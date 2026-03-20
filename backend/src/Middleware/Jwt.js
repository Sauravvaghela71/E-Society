// const jwt = require("jsonwebtoken");

// const protect = (req, res, next) => {
//   let token = req.headers.authorization;

//   if (token && token.startsWith("Bearer")) {
//     try {
//       token = token.split(" ")[1]; 
//       const decoded = jwt.verify(token, "your_super_secret_key_123");
      
//       req.user = decoded; 
//       next();
//     } catch (error) {
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     res.status(401).json({ message: "No token, authorization denied" });
//   }
// };

// module.exports = protect;