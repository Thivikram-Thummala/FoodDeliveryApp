// // auth.js middleware
// const authMiddleware = (req, res, next) => {
//     // console.log("Request session:", req.session); 
//     // console.log("User is authenticated:", req.isAuthenticated()); 
//     if (req.isAuthenticated()) {
//       return next(); 
//     } else {
//       console.log("User is not authenticated");
//       res.status(401).json({ success: false, message: "Unauthorized" }); 
//     }
//   };
  
//   export default authMiddleware;


import jwt from "jsonwebtoken"

// auth.js middleware
const authMiddleware = async (req, res, next) => {
  // Support standard `Authorization: Bearer <token>` and legacy `token` header
  const authHeader = req.headers.authorization || req.headers.token;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Not Authorized. Please log in." });
  }

  let token;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader;
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
    const token_decode = jwt.verify(token, secret);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log('Auth middleware error:', error.message || error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export default authMiddleware