import SeoReport from "../models/seoModel.js";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const publicKey = process.env.SEO_API_PUBLIC_KEY;
const privateKey = process.env.SEO_API_SECRET_KEY; // better name than secretKey
const salt = process.env.SEO_SALT;

// Check that critical env vars are loaded
if (!privateKey || !publicKey || !salt) {
  console.error("Missing SEO API environment variables!");
  process.exit(1); // Exit the app if env vars are not loaded
}

const createNewReport = async (req, res) => {
  const { phrase, domain} = req.body;
  // const {clerkUserid} = req.auth.userId
  const clerkUserId = "clerk_user_12345";

  if (!phrase || !domain || !clerkUserId) {
    return res.status(400).json({ error: "Missing required fields: phrase, domain, or clerkUserId" });
  }

  const { ts, hash } = generateAuthoritasHash({
    publicKey,
    privateKey,
    salt
  });

  try {
    const jobResponse = await axios.post(
      'https://v3.api.analyticsseo.com/serps/',
      {
        search_engine: "google",
        region: "global",
        language: "en",
        max_results: 100,
        phrase
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `KeyAuth publicKey=${publicKey} hash=${hash} ts=${ts}`,
        }
      }
    );

    const jid = jobResponse.data.jid;

    // Check if document exists
    const existingReport = await SeoReport.findOne({ clerkUserId, domain });

    if (!existingReport) {
      // Create new document
      const newReport = await SeoReport.create({
        clerkUserId,
        domain,
        phraseResults: [{
          phrase,
          jid,
          rawResponse: jobResponse.data
        }]
      });
      return res.status(201).json({
        message: "New report created",
        jid,
        report: newReport
      });
    }

    // Check if phrase already exists
    const existingPhrase = existingReport.phraseResults.find(p => p.phrase === phrase);

    if (existingPhrase) {
      // Update existing phrase entry
      existingPhrase.jid = jid;
      existingPhrase.rawResponse = jobResponse.data;
    } else {
      // Add new phrase result
      existingReport.phraseResults.push({
        phrase,
        jid,
        rawResponse: jobResponse.data
      });
    }

    const savedReport = await existingReport.save();

    res.status(200).json({
      message: existingPhrase ? "Phrase updated" : "New phrase added",
      jid,
      report: savedReport
    });

  } catch (error) {
    console.error("SEO API error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to create or update SEO report",
      details: error.response?.data || error.message
    });
  }
};


const getExistingReport = async (req, res) => {
  const { jid } = req.params;

  if (!jid) {
    return res.status(400).json({ error: "Job ID (jid) is required" });
  }

  const { ts, hash } = generateAuthoritasHash({
    publicKey,
    privateKey,
    salt
  });

  const maxAttempts = 20; // Optional: avoid infinite loop (3s x 20 = 60s max wait)
  let attempts = 0;

  const fetchJobStatus = async () => {
    try {
      const response = await axios.get(`https://v3.api.analyticsseo.com/serps/${jid}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `KeyAuth publicKey=${publicKey} hash=${hash} ts=${ts}`
        }
      });

      if (response.data.ready) {
        return res.status(200).json(response.data);
      }

      attempts++;
      if (attempts >= maxAttempts) {
        return res.status(202).json({ message: "Job not ready after waiting, try again later", jid });
      }

      // Wait 3 seconds and try again
      setTimeout(fetchJobStatus, 3000);
    } catch (error) {
      console.error("Error fetching SEO report:", error.response?.data || error.message);
      return res.status(500).json({ 
        error: "Failed to fetch SEO report",
        details: error.response?.data || error.message 
      });
    }
  };
  fetchJobStatus();
};


export function scoreSeoResponse(rawResponse, keyword, domain) {
  const scores = {
    rankingPosition: 0,
    keywordRelevance: 0,
    richSnippets: 0,
    urlStructure: 0,
    visibility: 0,
    competitorAnalysis: 0,
    paginationStrength: 0,
    total: 0
  };

  const organicResults = rawResponse?.results?.organic || {};
  const summary = rawResponse?.summary || {};
  const rankings = Object.entries(organicResults).map(([position, data]) => ({
    position: parseInt(position),
    ...data
  }));

  // 1. Ranking Position
  const found = rankings.find(r => r.url.includes(domain));
  if (found) {
    const pos = found.position;
    if (pos === 1) scores.rankingPosition = 30;
    else if (pos <= 3) scores.rankingPosition = 25;
    else if (pos <= 10) scores.rankingPosition = 15;
    else scores.rankingPosition = 5;
  }

  // 2. Keyword Relevance (first 10 results)
  rankings.slice(0, 10).forEach(result => {
    if (result.title?.includes(keyword)) scores.keywordRelevance += 10;
    if (result.description?.includes(keyword)) scores.keywordRelevance += 10;
    if (result.url?.includes(keyword)) scores.keywordRelevance += 5;
  });

  // 3. Rich Snippets
  rankings.slice(0, 10).forEach(result => {
    if (result.rich_snippets?.length > 0) scores.richSnippets += 20;
  });

  // 4. URL Structure
  rankings.slice(0, 10).forEach(result => {
    if (!result.url.includes("?") && !result.url.includes("_")) scores.urlStructure += 10;
  });

  // 5. Visibility
  rankings.slice(0, 10).forEach(result => {
    if (result.above_the_fold) scores.visibility += 15;
  });

  // 6. Competitor Analysis (bonus if your domain is in top 10)
  const top10Hosts = rankings.slice(0, 10).map(r => new URL(r.url).hostname);
  if (top10Hosts.includes(domain)) scores.competitorAnalysis = 10;

  // 7. Pagination Strength
  const page1Organic = summary?.pages?.["1"]?.organic || 0;
  scores.paginationStrength = Math.min(page1Organic * 2, 20);

  // Total
  scores.total = Object.values(scores).reduce((sum, val) => sum + val, 0);

  return scores;
}

// Utility function to generate hash for Authoritas API
function generateAuthoritasHash({ publicKey, privateKey, salt }) {
  const ts = Math.floor(Date.now() / 1000); // Unix Timestamp
  const stringToHash = ts + publicKey + salt;
  const hmac = crypto.createHmac("sha256", privateKey);
  const hash = hmac.update(stringToHash).digest("hex");
  return { ts, hash };
}

export { createNewReport, getExistingReport };
