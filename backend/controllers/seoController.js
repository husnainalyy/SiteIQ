import SeoReport from "../models/seoModel.js";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const publicKey = process.env.SEO_API_PUBLIC_KEY;
const privateKey = process.env.SEO_API_SECRET_KEY; // better name than secretKey
const salt = process.env.SEO_SALT;

// Utility function to generate hash for Authoritas API
function generateAuthoritasHash({ publicKey, privateKey, salt }) {
    const ts = Math.floor(Date.now() / 1000); // Unix Timestamp
    const stringToHash = ts + publicKey + salt;
    const hmac = crypto.createHmac("sha256", privateKey);
    const hash = hmac.update(stringToHash).digest("hex");
    return { ts, hash };
}

// Utility function to score the SEO response (as provided in your code)
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
        } catch { }
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
    } catch { }

    // 7. Pagination Strength (10 pts max)
    const page1Organic = summary.pages?.["1"]?.organic || 0;
    scores.paginationStrength = Math.min(page1Organic, 10); // 1pt per result on page 1

    // Total Score
    scores.total = Object.values(scores).reduce((sum, val) => sum + val, 0);

    return scores;
}

const generateAndScoreReport = async (req, res) => {
    const { phrase, domain } = req.body;
    const { clerkUserId } = req.auth; // Assuming req.auth contains clerkUserId

    if (!phrase || !domain || !clerkUserId) {
        return res.status(400).json({ error: "Missing required fields (phrase, domain, clerkUserId)" });
    }

    const maxAttempts = 20; // Max attempts to poll the API for readiness
    const pollInterval = 5000; // Poll every 5 seconds

    try {
        // Step 1: Generate job ID from Authoritas API
        const { ts, hash } = generateAuthoritasHash({ publicKey, privateKey, salt });
        let jobResponse;
        try {
             jobResponse = await axios.post(
                'https://v3.api.analyticsseo.com/serps/',
                {
                    search_engine: "google",
                    region: "global", // Consider making this dynamic if needed
                    language: "en",   // Consider making this dynamic if needed
                    max_results: 100, // Or another appropriate number
                    phrase
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `KeyAuth publicKey=${publicKey} hash=${hash} ts=${ts}`,
                    }
                }
            );
        } catch (apiError) {
             console.error("Error initiating Authoritas job:", apiError.response?.data || apiError.message);
             return res.status(500).json({
                error: "Failed to initiate Authoritas job",
                details: apiError.response?.data || apiError.message
             });
        }


        const jid = jobResponse.data.jid;
        console.log(`Authoritas job initiated with JID: ${jid}`);

        // Step 2: Poll for job completion
        let jobReady = false;
        let currentAttempts = 0;
        let rawResponse = null;

        while (!jobReady && currentAttempts < maxAttempts) {
            currentAttempts++;
            console.log(`Polling job status for JID ${jid}, Attempt ${currentAttempts}`);

            try {
                const { ts: pollTs, hash: pollHash } = generateAuthoritasHash({ publicKey, privateKey, salt });
                const pollResponse = await axios.get(`https://v3.api.analyticsseo.com/serps/${jid}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `KeyAuth publicKey=${publicKey} hash=${pollHash} ts=${pollTs}`
                    }
                });

                if (pollResponse.data.ready) {
                    jobReady = true;
                    rawResponse = pollResponse.data;
                    console.log(`Job ${jid} is ready.`);
                } else {
                    console.log(`Job ${jid} not ready yet. Waiting...`);
                    await new Promise(resolve => setTimeout(resolve, pollInterval)); // Wait before polling again
                }
            } catch (pollError) {
                console.error(`Error polling Authoritas job ${jid}:`, pollError.response?.data || pollError.message);
                // Depending on the error, you might want to break or continue
                // For now, let's assume transient errors and continue polling up to maxAttempts
                 await new Promise(resolve => setTimeout(resolve, pollInterval)); // Wait before polling again
            }
        }

        if (!jobReady || !rawResponse) {
            // Job didn't become ready within the allowed attempts
            console.error(`Authoritas job ${jid} did not become ready after ${maxAttempts} attempts.`);
            return res.status(504).json({ // 504 Gateway Timeout or 500
                error: "Authoritas job did not complete within the expected time. Please try fetching the report later using the jid.",
                jid: jid,
                status: "pending" // Indicate job might still be running on their end
            });
        }

        // Step 3: Calculate Score
        console.log(`Scoring report for JID ${jid}, phrase "${phrase}", domain "${domain}"`);
        const scores = scoreSeoResponse(rawResponse, phrase, domain);
        console.log("Calculated Scores:", scores);


        // Step 4: Find or Create Report in DB and Save Results + Scores
        let report = await SeoReport.findOne({ clerkUserId, domain });
        let message;

        if (!report) {
            // Create new report document
            report = await SeoReport.create({
                clerkUserId,
                domain,
                scanDate: new Date(), // Add a scan date
                phraseResults: [{
                    phrase,
                    jid,
                    rawResponse: rawResponse,
                    scores: scores,
                    updatedAt: new Date()
                }]
            });
            message = "New report created with phrase and scores";
            console.log("Created new report:", report._id);

        } else {
            // Report exists, find or add phrase result
            const existingPhraseEntry = report.phraseResults.find(p => p.phrase === phrase);

            if (existingPhraseEntry) {
                // Update existing phrase entry
                existingPhraseEntry.jid = jid; // Update jid with the new one
                existingPhraseEntry.rawResponse = rawResponse;
                existingPhraseEntry.scores = scores;
                existingPhraseEntry.updatedAt = new Date();
                message = "Existing phrase updated with new results and scores";
                console.log(`Updated phrase "${phrase}" in report ${report._id}`);

            } else {
                // Add new phrase entry
                report.phraseResults.push({
                    phrase,
                    jid,
                    rawResponse: rawResponse,
                    scores: scores,
                    updatedAt: new Date()
                });
                message = "New phrase added to existing report with results and scores";
                 console.log(`Added new phrase "${phrase}" to report ${report._id}`);
            }

            await report.save(); // Save the updated report document
        }

        // Step 5: Respond to client
        return res.status(200).json({
            message,
            jid,
            reportId: report._id,
            phraseResult: report.phraseResults.find(p => p.jid === jid) // Return the specific phrase entry
        });

    } catch (error) {
        console.error("Fatal Error in generateAndScoreReport:", error);
        // Catch any unexpected errors
        return res.status(500).json({
            error: "An internal server error occurred while generating and scoring the report",
            details: error.message,
             // Potentially include jid if it was successfully created before the error
             jid: jobResponse?.data?.jid // Check if jobResponse was successful
        });
    }
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

  console.log(req.auth.clerkUserId);

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


export { generateAndScoreReport, deleteReport, returnReport};