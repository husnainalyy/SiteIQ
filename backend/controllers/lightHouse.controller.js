import SeoReport from '../models/seoModel.js';
import lighthouseScrapper from '../services/light_house_scrapper.js';
import lighthouseService from '../services/light_house_services.js';

const { scrapeWebsite } = lighthouseScrapper;
const { runLighthouse } = lighthouseService;

// ✅ CREATE
const analyzeWebsite = async (req, res) => {
  try {
    console.log("✅ Step 1: Authenticating user...");
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      console.warn("❌ Unauthorized - no user ID found.");
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log("✅ Step 2: Extracting domain from request body...");
    const { domain } = req.body;
    if (!domain) {
      console.warn("❌ Missing required field: domain.");
      return res.status(400).json({ error: 'Missing required field: domain.' });
    }

    console.log("✅ Step 3: Creating SEO report entry...");
    const newReport = new SeoReport({
      clerkUserId,
      domain,
      phraseResults: [],
      lighthouse: {
        logs: ["🔄 Analysis initialized..."],
        error: null,
        lighthouseReport: {},
        createdAt: new Date()
      }
    });

    await newReport.save();

    console.log("✅ Step 4: Kicking off background analysis...");
    processAnalysis(newReport._id, domain);

    return res.status(202).json({
      message: 'Analysis started',
      reportId: newReport._id,
    });
  } catch (error) {
    console.error('❌ Error initiating analysis:', error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 🔧 Background Processing
const processAnalysis = async (reportId, domain) => {
  try {
    console.log("🔍 Running Lighthouse and SEO Scraper...");
    const [seoData, lighthouseResult] = await Promise.all([
      scrapeWebsite(domain),
      runLighthouse(domain),
    ]);

    console.log("✅ Updating report with results...");
    await SeoReport.findByIdAndUpdate(reportId, {
      $set: {
        'lighthouse.lighthouseReport': lighthouseResult,
        'lighthouse.logs': ["✅ Lighthouse analysis completed."],
        'lighthouse.error': null,
        phraseResults: seoData,
      },
      $currentDate: {
        'lighthouse.createdAt': true
      }
    });
  } catch (error) {
    console.error("❌ Background analysis failed:", error.message || error);
    await SeoReport.findByIdAndUpdate(reportId, {
      $set: {
        'lighthouse.logs': ["❌ Analysis failed."],
        'lighthouse.error': {
          message: error.message,
          stack: error.stack,
          name: error.name || "UnknownError"
        }
      }
    });
  }
};

// 📄 READ ONE
const getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await SeoReport.findById(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error("❌ Error fetching report:", error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 📄 READ ALL (for current user)
const getAllReports = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const reports = await SeoReport.find({ clerkUserId }).sort({ createdAt: -1 });
    return res.status(200).json(reports);
  } catch (error) {
    console.error("❌ Error fetching reports:", error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 📝 UPDATE (e.g., optional metadata update)
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await SeoReport.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ error: 'Report not found' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("❌ Error updating report:", error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ❌ DELETE
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SeoReport.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Report not found' });
    }

    return res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting report:", error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  analyzeWebsite,  // ✅ CREATE
  getReport,        // 📄 READ ONE
  getAllReports,    // 📄 READ ALL
  updateReport,     // 📝 UPDATE
  deleteReport      // ❌ DELETE
};
