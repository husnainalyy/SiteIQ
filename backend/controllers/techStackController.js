import axios from "axios"; // Correct import statement
import * as cheerio from "cheerio";
import { analyzeWebsite } from "../services/tech_stack_aiservice.js";

export async function getTechStack(req, res) {
  const { websiteUrl, useCase, seoFocused, performanceFocused } = req.body;

  if (
    !websiteUrl ||
    !useCase ||
    seoFocused === undefined ||
    performanceFocused === undefined
  ) {
    return res.status(400).json({
      error: "Website URL, use case, and SEO focus and performance focus are required"
    });
  }

  try {
    const { metadata, scripts } = await scrapeWebsite(websiteUrl);
    const recommendation = await analyzeWebsite(
      metadata,
      scripts,
      useCase,
      seoFocused,
      performanceFocused
    );

    res.json({ websiteUrl, metadata, scripts, recommendation });
  } catch (error) {
    // Log the actual error
    console.error("Error in getTechStack:", error);
    res.status(500).json({ error: "Failed to analyze website", message: error.message });
  }
}

async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url); // This should work now
    const $ = cheerio.load(response.data);

    const metadata = {
      title: $("title").text(),
      description: $('meta[name="description"]').attr("content"),
    };

    const scripts = [];
    $("script").each((_, el) => {
      const src = $(el).attr("src");
      if (src) scripts.push(src);
    });

    return { metadata, scripts };
  } catch (error) {
    console.error("Error scraping website:", error.message);
    throw error;  // Rethrow to be handled in the controller
  }
}
