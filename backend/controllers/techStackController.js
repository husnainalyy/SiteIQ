// controllers/techstackController.js
import { analyzeWebsite } from "../services/tech_stack_aiservice.js";
import axios from "axios";
import * as cheerio  from "cheerio";

// RECOMMEND new tech stack (no site yet)
export async function recommendStack(req, res) {
  const { useCase, seoFocused, performanceFocused } = req.body;

  if (!useCase || typeof seoFocused !== 'boolean' || typeof performanceFocused !== 'boolean') {
    return res.status(400).json({ error: "Use case, SEO focus, and performance focus are required" });
  }

  const metadata = { title: "N/A", description: "N/A" };
  const scripts = [];

  try {
    const recommendation = await analyzeWebsite(metadata, scripts, useCase, seoFocused, performanceFocused);
    res.json({ mode: "recommend", metadata, scripts, recommendation });
  } catch (error) {
    console.error("Error in recommendStack:", error.message);
    res.status(500).json({ error: "Failed to get recommendation" });
  }
}

// IMPROVE existing site
export async function improveStack(req, res) {
  const { websiteUrl, useCase, seoFocused, performanceFocused } = req.body;

  if (!websiteUrl || !useCase || typeof seoFocused !== 'boolean' || typeof performanceFocused !== 'boolean') {
    return res.status(400).json({ error: "Website URL, use case, SEO focus, and performance focus are required" });
  }

  try {
    const { metadata, scripts } = await scrapeWebsite(websiteUrl);
    const recommendation = await analyzeWebsite(metadata, scripts, useCase, seoFocused, performanceFocused);
    res.json({ mode: "improve", websiteUrl, metadata, scripts, recommendation });
  } catch (error) {
    console.error("Error in improveStack:", error.message);
    res.status(500).json({ error: "Failed to analyze website" });
  }
}

// Utility: Scrape meta & scripts
async function scrapeWebsite(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const metadata = {
    title: $("title").text(),
    description: $('meta[name="description"]').attr("content") || "N/A",
  };

  const scripts = [];
  $("script").each((i, el) => {
    const src = $(el).attr("src");
    if (src) scripts.push(src);
  });

  return { metadata, scripts };
}
