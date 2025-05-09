const mockClerkAuth = (req, res, next) => {
  // Simulating Clerk authentication
  req.auth = { 
    clerkUserId: "clerk_user_12345" // Your test user ID
  };

  next();
};

export default mockClerkAuth;