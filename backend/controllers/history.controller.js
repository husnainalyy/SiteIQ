import User from '../models/User.js'; // Import the User model

// ✅ Get Full History of a User
const getUserHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        return res.status(200).json({ history: user.websiteHistory });
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

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const websiteHistory = user.websiteHistory.filter(entry => entry.url === websiteUrl);
        return res.status(200).json({ history: websiteHistory });
    } catch (error) {
        console.error("Error fetching website history:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// ✅ Clear Entire History for a User
const clearUserHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndUpdate(userId, { websiteHistory: [] }, { new: true });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        return res.status(200).json({ message: "History cleared successfully." });
    } catch (error) {
        console.error("Error clearing history:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteHistoryEntry = async (req, res) => {
  try {
    const { userId, historyId } = req.params; // historyId is expected to be a string (e.g., "1")

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Filter out the history entry with the matching id
    user.websiteHistory = user.websiteHistory.filter(entry => entry.id !== historyId); // Comparing as strings

    // Save the updated user document
    await user.save();

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
