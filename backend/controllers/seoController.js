import SeoReport from "../models/seoModel.js";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const publicKey = process.env.SEO_API_PUBLIC_KEY;
const privateKey = process.env.SEO_API_SECRET_KEY; // better name than secretKey
const salt = process.env.SEO_SALT;


const createNewReport = async (req, res) => {
  const { phrase, domain } = req.body;
  const { clerkUserId } = req.auth;

  if (!phrase || !domain || !clerkUserId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Step 1: Generate job ID from Authoritas API
    const { ts, hash } = generateAuthoritasHash({ publicKey, privateKey, salt });
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

    // Step 2: Check if report already exists
    let report = await SeoReport.findOne({ clerkUserId, domain });

    let message;

    if (!report) {
      // Step 3: Create new document if none exists
      report = await SeoReport.create({
        clerkUserId,
        domain,
        phraseResults: [{
          phrase,
          jid,
        }]
      });
      message = "New report created";
    } else {
      // Step 4: Update or insert phrase result
      const existingPhrase = report.phraseResults.find(p => p.phrase === phrase);

      if (existingPhrase) {
        existingPhrase.jid = jid;
        existingPhrase.rawResponse = jobResponse.data;
        existingPhrase.updatedAt = new Date();
        message = "Phrase updated";
      } else {
        report.phraseResults.push({
          phrase,
          jid,
          rawResponse: jobResponse.data
        });
        message = "New phrase added";
      }

      await report.save();
    }

    // Step 5: Respond
    return res.status(200).json({
      message,
      jid,
      report
    });

  } catch (error) {
    console.error("Error in createNewReport:", error);
    return res.status(500).json({
      error: "Failed to process SEO report",
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

  const maxAttempts = 20;
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
        // Job is ready — now update the DB
        const report = await SeoReport.findOne({ "phraseResults.jid": jid });

        if (!report) {
          return res.status(404).json({ error: "Report with this jid not found" });
        }

        // Find the phraseResult with this jid and update its rawResponse
        const phraseResult = report.phraseResults.find(p => p.jid === jid);

        if (!phraseResult) {
          return res.status(404).json({ error: "Phrase result not found for jid" });
        }

        phraseResult.rawResponse = response.data;

        await report.save();

        return res.status(200).json({
          message: "Job is ready and report updated successfully",
          jid,
          updatedResponse: response.data
        });
      }

      attempts++;
      if (attempts >= maxAttempts) {
        return res.status(202).json({ message: "Job not ready after waiting, try again later", jid });
      }

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

const scorePhrase = async (req, res) => {
  const { jid, phrase, domain } = req.body;

  if (!jid || !phrase || !domain) {
    return res.status(400).json({ error: "jid, phrase, and domain are required." });
  }

  const report = await SeoReport.findOne({ domain });
console.log("Enterd scorephrase")

  if (!report) {
    return res.status(404).json({ error: "Report not found." });
  }

  const phraseEntry = report.phraseResults.find(p => p.jid === jid && p.phrase === phrase);
  if (!phraseEntry) {
    return res.status(404).json({ error: "Phrase not found for given jid." });
  }

  const scores = scoreSeoResponse(phraseEntry.rawResponse, phrase, domain);
  console.log(scores);
  phraseEntry.scores = scores;

  await report.save();

  res.status(200).json({
    message: "Score calculated and saved.",
    scores
  });
};

const deleteReport = async (req, res) => {
  const { jid } = req.params;

  if (!jid) {
    return res.status(400).json({ error: "Job ID (jid) is required" });
  }

  try {
    // Find report containing the phrase with this jid
    const report = await SeoReport.findOne({ "phraseResults.jid": jid });

    if (!report) {
      return res.status(404).json({ error: "No report found containing this jid" });
    }

    // Filter out the phraseResult with the matching jid
    report.phraseResults = report.phraseResults.filter(p => p.jid !== jid);

    if (report.phraseResults.length === 0) {
      // If no phrases left, delete the entire report
      await SeoReport.findByIdAndDelete(report._id);
      return res.status(200).json({ message: "Report deleted completely as it had only one phrase" });
    }

    // Otherwise, save the updated report
    await report.save();

    res.status(200).json({ message: "Phrase result deleted successfully", jid });
  } catch (error) {
    console.error("Error deleting report/phrase:", error.message);
    res.status(500).json({ error: "Failed to delete report or phrase", details: error.message });
  }
};

const returnReport = async (req, res) => {
  const { jid } = req.params;

  if (!jid) {
    return res.status(400).json({ error: "Job ID not included in parameter" });
  }

  try {
    // Find the report that contains a phraseResult with this jid
    const report = await SeoReport.findOne({ "phraseResults.jid": jid });

    if (!report) {
      return res.status(404).json({ error: "No report found containing this jid ",  jid });
    }

    // Find the specific phraseResult inside the report
    const phraseEntry = report.phraseResults.find(p => p.jid === jid);

    if (!phraseEntry) {
      return res.status(404).json({ error: "Phrase entry not found for this jid" });
    }

    // Respond with the phraseEntry and some report metadata
    return res.status(200).json({
      reportId: report._id,
      domain: report.domain,
      scanDate: report.scanDate,
      phraseResult: phraseEntry
    });

  } catch (error) {
    console.error("Error fetching report:", error.message);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};
function scoreSeoResponse(rawResponse, keyword, domain) {
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

  const responseData = rawResponse?.response || {};
  const results = responseData.results || {};
  const summary = responseData.summary || {};

  const organicEntries = Object.entries(results.organic || {});
  const universalEntries = Object.entries(results.universal || {});

  const top10 = organicEntries
    .map(([positionStr, result]) => ({
      position: parseInt(positionStr),
      ...result
    }))
    .filter(r => r.position <= 10);

  const lowerKeyword = keyword.toLowerCase();

  // 1. Ranking Position (30 pts max)
  const rank = organicEntries.find(([_, r]) => r.url?.includes(domain));
  if (rank) {
    const position = parseInt(rank[0]);
    if (position === 1) scores.rankingPosition = 30;
    else if (position <= 3) scores.rankingPosition = 27;
    else if (position <= 10) scores.rankingPosition = 25;
    else if (position <= 15) scores.rankingPosition = 20;
    else if (position <= 25) scores.rankingPosition = 15;
    else if (position <= 35) scores.rankingPosition = 10;
    else scores.rankingPosition = 5;
  }

  // 2. Keyword Relevance (20 pts max)
  let relevanceScore = 0;
  top10.forEach(result => {
    if (result.title?.toLowerCase().includes(lowerKeyword)) relevanceScore += 8;
    if (result.description?.toLowerCase().includes(lowerKeyword)) relevanceScore += 8;
    if (result.url?.toLowerCase().includes(lowerKeyword)) relevanceScore += 4;
  });
  scores.keywordRelevance = Math.min(relevanceScore, 20);

  // 3. Rich Snippets (10 pts max)
  let richScore = 0;
  universalEntries.forEach(([_, result]) => {
    if (Array.isArray(result.rich_snippets) && result.rich_snippets.length > 0) {
      richScore += 5;
    }
  });
  scores.richSnippets = Math.min(richScore, 10);

  // 4. URL Structure (10 pts max)
  let cleanUrlScore = 0;
  top10.forEach(result => {
    try {
      const pathname = new URL(result.url).pathname;
      if (!pathname.includes("?") && !pathname.includes("_")) {
        cleanUrlScore += 2;
      }
    } catch {}
  });
  scores.urlStructure = Math.min(cleanUrlScore, 10);

  // 5. Visibility (10 pts max)
  let visibilityScore = 0;
  top10.forEach(result => {
    if (result.above_the_fold) visibilityScore += 3;
  });
  scores.visibility = Math.min(visibilityScore, 10);

  // 6. Competitor Analysis (10 pts max)
  try {
    const top10Hosts = top10.map(r => new URL(r.url).hostname);
    if (top10Hosts.includes(domain)) {
      scores.competitorAnalysis = 10;
    }
  } catch {}

  // 7. Pagination Strength (10 pts max)
  const page1Organic = summary.pages?.["1"]?.organic || 0;
  scores.paginationStrength = Math.min(page1Organic, 10); // 1pt per result on page 1

  // Total Score
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

export { createNewReport, getExistingReport, deleteReport, returnReport, scorePhrase};
