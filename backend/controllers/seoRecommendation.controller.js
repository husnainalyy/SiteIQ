import axios from "axios";
import SeoReport from "../models/seoModel.js";
import SeoRecommendation from "../models/seoRecommendation.js";

// ✅ CREATE
const generateSEORecommendations = async (req, res) => {
  try {
    console.log("✅ Step 1: Extracting user ID from auth...");
    const clerkUserId = req.auth.userId;
    console.log(clerkUserId);

    if (!req.auth || !req.auth.userId) {
      console.warn("❌ Missing auth context.");
      return res.status(401).json({ error: "Unauthrized" });
    }

    console.log("✅ Step 2: Extracting domain from request body...");
    const { domain } = req.body;

    if (!domain) {
      console.warn("❌ Missing required field: domain.");
      return res.status(400).json({ error: "Missing required field: domain." });
    }

    console.log("✅ Step 3: Searching for SEO report in DB...");
    const seoReportDoc = await SeoReport.findOne({ clerkUserId, domain });
    console.log("seoReportDoc:", JSON.stringify(seoReportDoc, null, 2));

    if (!seoReportDoc || !seoReportDoc.phraseResults || seoReportDoc.phraseResults.length === 0) {
      console.warn("❌ SEO report not found or empty.");
      return res.status(404).json({
        error: "SEO report not found or contains no phrase results.",
      });
    }

    console.log("✅ Step 4: Validating Novita API key...");
    const NOVITA_API_KEY = process.env.NOVITA_API_KEY;
    if (!NOVITA_API_KEY) {
      console.error("❌ Missing Novita API key in environment variables.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    console.log("✅ Step 5: Extracting and trimming scores array...");
    const scoresArray = seoReportDoc.phraseResults.map(r => r.scores).slice(0, 10); // limit to top 10

    console.log("✅ Step 6: Constructing prompt...");
    const prompt = `Analyze this SEO report in extreme detail and provide a prioritized list of high-impact, actionable recommendations... \n\n${JSON.stringify(scoresArray, null, 2)}`;

    console.log("✅ Step 7: Sending request to Novita AI...");
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
      console.error("❌ AI model returned empty response.");
      return res.status(500).json({ error: "AI model returned an empty response." });
    }

    console.log("✅ Step 8: Extracting recommendation text...");
    const seoRecommendationText = response.data.choices[0].message.content.trim();

    console.log("✅ Step 9: Saving recommendation to database...");
    const newRecommendation = new SeoRecommendation({
      clerkUserId,
      domain,
      seoReport: seoReportDoc._id,
      recommendations: {
        seo: seoRecommendationText,
        lighthouse: "" // Leave empty or null for now if you're only generating SEO
      },
      action: "Analyzed",
    });
    
    await newRecommendation.save();
    
    console.log("✅ Step 10: Successfully saved and responding to client.");
    return res.status(200).json({
      message: "SEO recommendation generated and saved successfully.",
      recommendation: {
        seo: seoRecommendationText
      }
    });
    
  } catch (error) {
    console.error("❌ Error generating SEO recommendations:", error.response?.data || error.message || error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const generateLightHouseRecommendation = async (req, res) => {
  try {
    console.log("✅ Step 1: Extracting user ID from auth...");
    const clerkUserId = req.auth.userId;
    console.log(clerkUserId);

    if (!req.auth || !req.auth.userId) {
      console.warn("❌ Missing auth context.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("✅ Step 2: Extracting domain from request body...");
    const { domain } = req.body;

    if (!domain) {
      console.warn("❌ Missing required field: domain.");
      return res.status(400).json({ error: "Missing required field: domain." });
    }

    console.log("✅ Step 3: Searching for Lighthouse report in DB...");
    const seoReportDoc = await SeoReport.findOne({ clerkUserId, domain });
    console.log("seoReportDoc:", JSON.stringify(seoReportDoc, null, 2));

    if (!seoReportDoc || !seoReportDoc.lighthouse) {
      console.warn("❌ Lighthouse report not found.");
      return res.status(404).json({
        error: "Lighthouse report not found.",
      });
    }

    console.log("✅ Step 4: Validating Novita API key...");
    const NOVITA_API_KEY = process.env.NOVITA_API_KEY;
    if (!NOVITA_API_KEY) {
      console.error("❌ Missing Novita API key in environment variables.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    console.log("✅ Step 5: Extracting Lighthouse data...");
    const lighthouseData = seoReportDoc.lighthouseResult;
    const simplifiedData = {
      performance: null,
      accessibility: null,
      bestPractices: null,
      seo: null,
      audits: {}
    };
    
    try {
      // Handle different Lighthouse result formats
      const categories = lighthouseData?.categories || 
                       lighthouseData?.lhr?.categories || 
                       {};
      
      simplifiedData.performance = categories.performance?.score ?? 
                                 categories['performance']?.score ?? 
                                 null;
      
      simplifiedData.accessibility = categories.accessibility?.score ?? 
                                   categories['accessibility']?.score ?? 
                                   null;
      
      simplifiedData.bestPractices = categories['best-practices']?.score ?? 
                                    categories['bestPractices']?.score ?? 
                                    null;
      
      simplifiedData.seo = categories.seo?.score ?? 
                          categories['seo']?.score ?? 
                          null;
    
      // Handle audits data
      const audits = lighthouseData?.audits || 
                    lighthouseData?.lhr?.audits || 
                    {};
      
      simplifiedData.audits = Object.keys(audits)
        .filter(key => audits[key]?.score !== null && audits[key]?.score !== undefined)
        .reduce((obj, key) => {
          obj[key] = {
            title: audits[key]?.title || 'Untitled audit',
            description: audits[key]?.description || 'No description available',
            score: audits[key]?.score,
            displayValue: audits[key]?.displayValue || 'N/A'
          };
          return obj;
        }, {});
    
    } catch (error) {
      console.error('Error processing Lighthouse data:', error);
      // Return at least the basic structure even if processing fails
    }
    
    // Now use simplifiedData in your prompt
    console.log('Processed Lighthouse data:', simplifiedData);

    console.log("✅ Step 6: Constructing prompt...");
    const prompt = `Analyze this Lighthouse report in detail and provide specific technical recommendations to improve the website performance, accessibility, best practices, and SEO. 
    Focus on actionable items sorted by priority (high impact first). 
    For each recommendation, include: 
    1. The specific issue
    2. Why it matters
    3. How to fix it
    
    Lighthouse Data:
    ${JSON.stringify(simplifiedData, null, 2)}`;

    console.log("✅ Step 7: Sending request to Novita AI...");
    const response = await axios.post(
      "https://api.novita.ai/v3/openai/chat/completions",
      {
        model: "deepseek/deepseek_v3",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000, // Increased for more detailed technical recommendations
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
      console.error("❌ AI model returned empty response.");
      return res.status(500).json({ error: "AI model returned an empty response." });
    }

    console.log("✅ Step 8: Extracting recommendation text...");
    const lighthouseRecommendationText = response.data.choices[0].message.content.trim();

    console.log("✅ Step 9: Saving recommendation to database...");
    const newRecommendation = new SeoRecommendation({
      clerkUserId,
      domain,
      seoReport: seoReportDoc._id,
      recommendations: {
        lighthouse: lighthouseRecommendationText,
        seo: "" // Leave empty as this is Lighthouse-specific
      },
      action: "Analyzed",
    });

    await newRecommendation.save();

    console.log("✅ Step 10: Successfully saved and responding to client.");
    return res.status(200).json({
      message: "Lighthouse recommendation generated and saved successfully.",
      recommendation: {
        lighthouse: lighthouseRecommendationText
      }
    });

  } catch (error) {
    console.error("❌ Error generating Lighthouse recommendations:", error.response?.data || error.message || error);
    return res.status(500).json({ 
      error: "Internal Server Error",
      details: error.message 
    });
  }
};

// 📄 READ ALL recommendations for a user
const getAllRecommendations = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const recommendations = await SeoRecommendation.find({ clerkUserId }).sort({ createdAt: -1 });
    return res.status(200).json(recommendations);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch recommendations." });
  }
};

// 📄 READ ONE recommendation by ID
const getRecommendationById = async (req, res) => {
  try {
    const { id } = req.params;
    const recommendation = await SeoRecommendation.findById(id);
    if (!recommendation) return res.status(404).json({ error: "Recommendation not found." });

    return res.status(200).json(recommendation);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch recommendation." });
  }
};

// ✏️ UPDATE a recommendation's action or notes
const updateRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body;

    const updated = await SeoRecommendation.findByIdAndUpdate(
      id,
      { action, notes },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Recommendation not found." });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update recommendation." });
  }
};

// ❌ DELETE a recommendation
const deleteRecommendation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SeoRecommendation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Recommendation not found." });

    return res.status(200).json({ message: "Recommendation deleted." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete recommendation." });
  }
};

export {
  generateSEORecommendations,
  generateLightHouseRecommendation,
  getAllRecommendations,
  getRecommendationById,
  updateRecommendation,
  deleteRecommendation,
};
