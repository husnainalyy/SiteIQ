import SeoReport from "../models/seoModel.js";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import User from "../models/User.js";
import Website from "../models/website.js";

dotenv.config();

const publicKey = process.env.SEO_API_PUBLIC_KEY;
const privateKey = process.env.SEO_API_SECRET_KEY;
const salt = process.env.SEO_SALT;

// Hash generation utility
function generateAuthoritasHash({ publicKey, privateKey, salt }) {
  const ts = Math.floor(Date.now() / 1000);
  const stringToHash = ts + publicKey + salt;
  const hmac = crypto.createHmac("sha256", privateKey);
  const hash = hmac.update(stringToHash).digest("hex");
  return { ts, hash };
}

// Scoring function remains unchanged
function scoreSeoResponse(rawResponse, keyword, domain) {
  // same implementation as you provided
  // ...
}

// Generate & Score Report
const generateAndScoreReport = async (req, res) => {
  const { phrase, domain } = req.body;
  const clerkUserId = req.auth.userId;
  console.log(clerkUserId);

  if (!phrase || !domain || !clerkUserId) {
    return res.status(400).json({
      error: "Missing required fields (phrase, domain, clerkUserId)",
    });
  }

  try {
    // Step 1: Ensure Website exists
    let website = await Website.findOne({ domain });

    if (!website) {
      website = await Website.create({
        clerkuserId: clerkUserId,
        domain: domain,
      });
    }

    // Step 2: Initiate Authoritas job
    const { ts, hash } = generateAuthoritasHash({
      publicKey,
      privateKey,
      salt,
    });

    let jobResponse;
    try {
      jobResponse = await axios.post(
        "https://v3.api.analyticsseo.com/serps/",
        {
          search_engine: "google",
          region: "global",
          language: "en",
          max_results: 30,
          phrase,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `KeyAuth publicKey=${publicKey} hash=${hash} ts=${ts}`,
          },
        }
      );
    } catch (apiError) {
      console.error(
        "Error initiating Authoritas job:",
        apiError.response?.data || apiError.message
      );
      return res.status(500).json({
        error: "Failed to initiate Authoritas job",
        details: apiError.response?.data || apiError.message,
      });
    }

    const jid = jobResponse.data.jid;

    // Step 3: Polling
    const pollingIntervals = [30_000, 20_000, 15_000, 10_000];
    const maxAttempts = 20;
    let jobReady = false;
    let currentAttempts = 0;
    let rawResponse = null;

    while (!jobReady && currentAttempts < maxAttempts) {
      const pollInterval =
        pollingIntervals[
          Math.min(currentAttempts, pollingIntervals.length - 1)
        ];
      currentAttempts++;

      try {
        const { ts: pollTs, hash: pollHash } = generateAuthoritasHash({
          publicKey,
          privateKey,
          salt,
        });
        const pollResponse = await axios.get(
          `https://v3.api.analyticsseo.com/serps/${jid}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `KeyAuth publicKey=${publicKey} hash=${pollHash} ts=${pollTs}`,
            },
          }
        );

        if (pollResponse.data.ready) {
          jobReady = true;
          rawResponse = pollResponse.data;
          break;
        } else {
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
        }
      } catch (pollError) {
        console.error(`Polling error for JID ${jid}:`, pollError.message);
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }
    }

    if (!jobReady || !rawResponse) {
      return res.status(504).json({
        error: "Authoritas job did not complete in time",
        jid,
        status: "pending",
      });
    }

    // Step 4: Scoring
    const scores = scoreSeoResponse(rawResponse, phrase, domain);

    // Step 5: Save or update SeoReport
    let report = await SeoReport.findOne({ clerkUserId, website: website._id });
    let message;

    if (!report) {
      report = await SeoReport.create({
        clerkUserId,
        website: website._id,
        scanDate: new Date(),
        phraseResults: [
          {
            phrase,
            jid,
            rawResponse,
            scores,
            updatedAt: new Date(),
          },
        ],
      });

      // Add report reference to Website if not already present
      if (!website.seoReport.includes(report._id)) {
        website.seoReport.push(report._id);
        await website.save();
      }

      message = "New SEO report created for website";
    } else {
      const existing = report.phraseResults.find((p) => p.phrase === phrase);
      if (existing) {
        existing.jid = jid;
        existing.rawResponse = rawResponse;
        existing.scores = scores;
        existing.updatedAt = new Date();
        message = "Existing phrase updated with new scores";
      } else {
        report.phraseResults.push({
          phrase,
          jid,
          rawResponse,
          scores,
          updatedAt: new Date(),
        });
        message = "Phrase added to existing report";
      }
      await report.save();
    }

    return res.status(200).json({
      message,
      jid,
      reportId: report._id,
      phraseResult: report.phraseResults.find((p) => p.jid === jid),
    });
  } catch (error) {
    console.error("Fatal error in generateAndScoreReport:", error);
    return res.status(500).json({
      error: "Failed to generate and save SEO report",
      details: error.message,
    });
  }
};

// Delete Report/Phrase
const deleteReport = async (req, res) => {
  const { jid } = req.params;
  const clerkUserId = req.auth.userId;

  if (!jid) {
    return res.status(400).json({ error: "Job ID (jid) is required" });
  }

  try {
    const report = await SeoReport.findOne({
      "phraseResults.jid": jid,
      clerkUserId,
    });

    if (!report) {
      return res
        .status(404)
        .json({ error: "No report found containing this jid" });
    }

    report.phraseResults = report.phraseResults.filter((p) => p.jid !== jid);

    if (report.phraseResults.length === 0) {
      await SeoReport.findByIdAndDelete(report._id);
      return res.status(200).json({
        message: "Report deleted completely as it had only one phrase",
      });
    }

    await report.save();

    res
      .status(200)
      .json({ message: "Phrase result deleted successfully", jid });
  } catch (error) {
    console.error("Error deleting report/phrase:", error.message);
    res.status(500).json({
      error: "Failed to delete report or phrase",
      details: error.message,
    });
  }
};

// Return Report
const returnReport = async (req, res) => {
  const { jid } = req.params;
  const clerkUserId = req.auth.userId;

  if (!jid) {
    return res.status(400).json({ error: "Job ID not included in parameter" });
  }

  try {
    const report = await SeoReport.findOne({
      "phraseResults.jid": jid,
      clerkUserId,
    }).populate("website");

    if (!report) {
      return res
        .status(404)
        .json({ error: "No report found containing this jid", jid });
    }

    const phraseEntry = report.phraseResults.find((p) => p.jid === jid);

    if (!phraseEntry) {
      return res
        .status(404)
        .json({ error: "Phrase entry not found for this jid" });
    }

    return res.status(200).json({
      reportId: report._id,
      website: {
        id: report.website._id,
        domain: report.website.domain,
      },
      scanDate: report.scanDate,
      phraseResult: phraseEntry,
    });
  } catch (error) {
    console.error("Error fetching report:", error.message);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

export { generateAndScoreReport, deleteReport, returnReport };
