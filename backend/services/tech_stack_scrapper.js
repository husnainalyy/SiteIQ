import axios from "axios";
import * as cheerio from 'cheerio';

// Fetch website HTML
async function fetchWebsiteHTML(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    return data;
  } catch (error) {
    console.error("Error fetching website:", error.message);
    return null;
  }
}

// Extract metadata & scripts
function extractWebsiteInfo(html) {
  const $ = cheerio.load(html);
  const metaTags = {};
  const scripts = [];

  // Extract <meta> tags
  $("meta").each((_, el) => {
    const name = $(el).attr("name") || $(el).attr("property");
    const content = $(el).attr("content");
    if (name && content) {
      metaTags[name.toLowerCase()] = content;
    }
  });

  // Extract <script> sources
  $("script").each((_, el) => {
    const src = $(el).attr("src");
    if (src) scripts.push(src);
  });

  return { metaTags, scripts };
}

module.exports = { fetchWebsiteHTML, extractWebsiteInfo };
