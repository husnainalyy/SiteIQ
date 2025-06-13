const mockClerkAuth = (req, res, next) => {
  // Simulating Clerk authentication
  req.auth = { 
    userId: "clerk_user_1234" // Your test user ID
  };
  console.log('mockClerkAuth set req.auth:', req.auth);
  console.log('mockClerkAuth set req.auth:', req.auth);
  next();
};

export default mockClerkAuth;