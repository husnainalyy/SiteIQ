import User from '../models/User.js';  // Use import instead of require

/**
 * Increments usage count for the given user and recommendation type.
 * @param {String} userId - The MongoDB _id of the user.
 * @param {'seo'|'techstack'} type - The type of recommendation.
 */
const incrementUsage = async (userId, type) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    if (type === 'seo') {
      user.usage.seoRecommendations++;
    } else if (type === 'techstack') {
      user.usage.techStackRecommendations++;
    }

    await user.save();
  } catch (err) {
    console.error(`Error incrementing usage for user ${userId}:`, err.message);
  }
};

export default incrementUsage; // Export using ES modules
