import SeoReport from '../models/seoModel.js';
import Website from '../models/website.js'; // Assuming you have this
import lighthouseScrapper from '../services/light_house_scrapper.js';
import lighthouseService from '../services/light_house_services.js';

const { scrapeWebsite } = lighthouseScrapper;
const { runLighthouse } = lighthouseService;

const analyzeWebsite = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    let { domain } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Missing required field: domain' });
    }

    // Normalize domain (same as your pre-save hook)
    domain = domain.trim().replace(/^https?:\/\//i, '');
    const normalizedDomain = `https://${domain}`;

    // 1️⃣ Check if this user already has this website
    let website = await Website.findOne({ clerkuserId: clerkUserId, domain: normalizedDomain });

    // 2️⃣ If not, create it
    if (!website) {
      website = new Website({ clerkuserId: clerkUserId, domain: normalizedDomain });
      await website.save();
    }

    // 3️⃣ Create report
    const newReport = new SeoReport({
      clerkUserId,
      website: website._id,
      phraseResults: [],
      lighthouse: {
        logs: ["🔄 Analysis initialized..."],
        error: null,
        lighthouseReport: {},
        createdAt: new Date()
      }
    });

    await newReport.save();

    // 4️⃣ Link report to website
    await Website.findByIdAndUpdate(website._id, {
      $push: { seoReport: newReport._id }
    });

    // 5️⃣ Start background processing
    processAnalysis(newReport._id, normalizedDomain);

    return res.status(202).json({
      message: 'Analysis started',
      reportId: newReport._id,
    });
  } catch (error) {
    console.error('❌ Error initiating analysis:', error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 🔧 Background Processing Logic
const processAnalysis = async (reportId, domain) => {
  try {
    console.log("🔍 Running Lighthouse and SEO Scraper...");
    const [seoData, lighthouseResult] = await Promise.all([
      scrapeWebsite(domain),
      runLighthouse(domain),
    ]);

    console.log("✅ Updating SEO report with results...");
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
    const report = await SeoReport.findById(id).populate("website");

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error("❌ Error fetching report:", error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 📄 READ ALL for current user
const getAllReports = async (req, res) => {
  try {
    const clerkUserId = req.auth?.userId;
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const reports = await SeoReport.find({ clerkUserId })
      .populate("website")
      .sort({ createdAt: -1 });

    return res.status(200).json(reports);
  } catch (error) {
    console.error("❌ Error fetching reports:", error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 📝 UPDATE
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

    // Remove reference from website
    await Website.findByIdAndUpdate(deleted.website, {
      $pull: { seoReport: deleted._id }
    });

    return res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting report:", error.message || error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  analyzeWebsite,
  getReport,
  getAllReports,
  updateReport,
  deleteReport
};
