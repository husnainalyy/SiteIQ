import User from "../models/User.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// ✅ CREATE: Generate and add a new SEO recommendation to the array
const generateSEORecommendations = async (req, res) => {
  try {
    const { userId, websiteUrl, seoReport } = req.body;

    // Initial required fields check
    if (!userId || !websiteUrl || !seoReport) {
      return res.status(400).json({
        error: "Missing required fields (userId, websiteUrl, seoReport).",
      });
    }

    // ✅ NEW CHECK: Ensure seoReport is not empty or invalid
    if (
      typeof seoReport !== 'object' ||
      Object.keys(seoReport).length === 0
    ) {
      return res.status(400).json({
        error: "SEO Report is empty or invalid. Cannot generate recommendations.",
      });
    }

    // Validate API Key
    const NOVITA_API_KEY = process.env.NOVITA_API_KEY;
    if (!NOVITA_API_KEY) {
      console.error("Missing Novita AI API key. Set NOVITA_API_KEY in .env.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    // Format prompt for DeepSeek
    const prompt = `Analyze this SEO report in extreme detail and provide a prioritized list of high-impact, actionable recommendations to improve search rankings, traffic, and conversions. Cover the following with specificity:  

1. **Technical SEO:** Identify crawl errors, indexability issues, site speed bottlenecks, mobile usability problems, or schema markup gaps. Recommend exact fixes (e.g., "Fix 500 errors on /cart page by debugging server logs").  

2. **On-Page SEO:** Evaluate title tags, meta descriptions, headers, keyword usage, and content quality. Suggest optimizations (e.g., "Rewrite H1 to include primary keyword 'best running shoes' and match search intent").  

3. **Content Gaps:** Highlight missing topics, low-quality pages, or underperforming content. Recommend updates, mergers, or deletions (e.g., "Merge /blog/post1 and /blog/post2 to avoid cannibalization").  

4. **Backlinks:** Analyze referring domains, anchor text, and toxic links. Suggest disavow actions or link-building targets (e.g., "Acquire backlinks from .edu sites in the fitness niche via guest posts").  

5. **UX/UI:** Identify poor navigation, high bounce rates, or CTA weaknesses. Propose fixes (e.g., "Add internal links from high-traffic pages to boost engagement").  

6. **Competitor Gaps:** Compare top 3 competitors' strengths (e.g., "Competitor X ranks for 'organic protein powder'—create a better guide with video tutorials").  

7. **Tracking & KPIs:** Ensure proper Google Analytics/GTM setup. Recommend tracking fixes (e.g., "Tag all campaign URLs with UTM parameters").  

Format output as:  
- **Priority Level (High/Medium/Low)**  
- **Issue**  
- **Actionable Recommendation**  
- **Expected Impact**  

Be brutally honest—omit fluff. Focus on steps that will move the needle within 3–6 months.:\n\n${JSON.stringify(
      seoReport,
      null,
      2
    )}`;

    // Call DeepSeek-V3 via Novita AI's API
    const response = await axios.post(
      "https://api.novita.ai/v3/openai/chat/completions",
      {
        model: "deepseek/deepseek_v3",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${NOVITA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.choices || response.data.choices.length === 0) {
      return res
        .status(500)
        .json({ error: "AI model returned an empty response." });
    }

    // Extract AI-generated recommendations
    const seoRecommendation = response.data.choices[0].message.content.trim();

    // Find the user and website
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const website = user.websites.find((site) => site.url === websiteUrl);
    if (!website) {
      return res.status(404).json({ error: "Website not found." });
    }

    // Determine the next sequential history id
    const lastHistoryEntry = user.websiteHistory.length > 0 ? user.websiteHistory[user.websiteHistory.length - 1] : null;
    const nextHistoryId = lastHistoryEntry ? lastHistoryEntry.id + 1 : 1;  // Default to 1 if no previous entry

    // Add to website history
    user.websiteHistory.push({
      id: nextHistoryId,  // Sequential ID
      url: websiteUrl,
      seoReport: seoReport,
      seoRecommendations: [seoRecommendation], // Store the new recommendation
      action: "Analyzed",
      websiteId: website._id, // Reference to the website's ObjectId
    });

    // Save the user document
    await user.save();

    return res.status(200).json({
      message: "SEO recommendation added successfully",
      seoRecommendation,
    });
  } catch (error) {
    console.error("Error generating SEO recommendations:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// ✅ READ: Get all SEO recommendations for all websites of a user
const getAllSEORecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const recommendations = user.websites.map((website) => ({
      websiteUrl: website.url,
      seoRecommendations: website.seoRecommendations || [],
    }));

    return res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching SEO recommendations:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ READ: Get all SEO recommendations for a specific website
const getSEORecommendationByWebsite = async (req, res) => {
  try {
    const { userId, websiteUrl } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const website = user.websites.find((site) => site.url === websiteUrl);
    if (!website) {
      return res.status(404).json({ error: "Website not found." });
    }

    return res.status(200).json({
      websiteUrl: website.url,
      seoRecommendations: website.seoRecommendations || [],
    });
  } catch (error) {
    console.error("Error fetching SEO recommendation:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ DELETE: Remove a specific SEO recommendation from a website
const deleteSEORecommendation = async (req, res) => {
  try {
    const { userId, websiteUrl } = req.params;

    // Find the user and the website
    const user = await User.findOne({
      _id: userId,
      "websites.url": websiteUrl,
    });
    if (!user) {
      return res.status(404).json({ error: "User or website not found." });
    }

    // Find the correct website entry
    const website = user.websites.find((site) => site.url === websiteUrl);
    if (
      !website ||
      !website.seoRecommendations ||
      website.seoRecommendations.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "No SEO recommendations to delete." });
    }

    // Remove the last recommendation from the array
    website.seoRecommendations.pop();

    // Save the updated user document
    await user.save();

    return res
      .status(200)
      .json({ message: "Last SEO recommendation deleted successfully." });
  } catch (error) {
    console.error("Error deleting SEO recommendation:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  generateSEORecommendations,
  getAllSEORecommendations,
  getSEORecommendationByWebsite,
  deleteSEORecommendation,
};
