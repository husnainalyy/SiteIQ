import { PLAN_LIMITS } from '../config/subscriptionLimits.js';  // Adjust the path if needed

const checkSubscriptionLimit = (type) => {
  return async (req, res, next) => {
    const user = req.user; // Assuming `req.user` is set by your auth middleware

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Reset week if it's a new week
    const now = new Date();
    const weekStart = new Date(user.usage.weekStart);
    const oneWeek = 7 * 24 * 60 * 60 * 1000;  // One week in milliseconds

    if (now - weekStart > oneWeek) {
      user.usage.seoRecommendations = 0;
      user.usage.techStackRecommendations = 0;
      user.usage.weekStart = now;
    }

    const limit = PLAN_LIMITS[user.plan];  // Get limit based on user's plan

    // Check usage based on the specified type
    if (user.plan !== 'business') {
      if (type === 'seo' && user.usage.seoRecommendations >= limit) {
        return res.status(429).json({ message: "SEO limit reached for the week" });
      }

      if (type === 'techstack' && user.usage.techStackRecommendations >= limit) {
        return res.status(429).json({ message: "TechStack limit reached for the week" });
      }
    }

    // Allow request to continue
    next();
  };
};

export default checkSubscriptionLimit;
