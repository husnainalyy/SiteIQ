const mockClerkAuth = (req, res, next) => {
  // Simulating Clerk authentication
  req.auth = { 
    userId: "clerk_user_1234" // Your test user ID
  };
  next();
};

export default mockClerkAuth;