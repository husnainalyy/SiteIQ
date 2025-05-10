import User from '../models/User.js';
import WebsiteHistory from '../models/WebsiteHistory.js';

// ✅ Get Full History of a User
const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.auth.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const history = await WebsiteHistory.find({ userId });
    return res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching user history:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get History for a Specific Website
const getWebsiteHistory = async (req, res) => {
  try {
    const { userId, websiteUrl } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const history = await WebsiteHistory.find({ userId, url: websiteUrl });
    return res.status(200).json({ history });
  } catch (error) {
    console.error("Error fetching website history:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Clear Entire History for a User
const clearUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    await WebsiteHistory.deleteMany({ userId });

    return res.status(200).json({ message: "History cleared successfully." });
  } catch (error) {
    console.error("Error clearing history:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Delete a Specific History Entry
const deleteHistoryEntry = async (req, res) => {
  try {
    const { userId, historyId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const deleted = await WebsiteHistory.findOneAndDelete({ _id: historyId, userId });

    if (!deleted) {
      return res.status(404).json({ error: "History entry not found." });
    }

    return res.status(200).json({ message: "History entry deleted successfully." });
  } catch (error) {
    console.error("Error deleting history entry:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getUserHistory,
  getWebsiteHistory,
  clearUserHistory,
  deleteHistoryEntry
};
