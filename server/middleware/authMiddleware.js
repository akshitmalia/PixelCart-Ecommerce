import jwt from "jsonwebtoken";
import User from "../models/User.js";

async function protect(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // it will be returning jwt payload earlier fed while making it 
    req.user = await User.findById(decoded.id).select("-otp -otpExpiry"); //EXCLUDE these fields

    next();

  } catch (error) {
    res.status(401).json({ message: "Not authorized, invalid token" });
  }
}

async function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized, admin only" });
  }
}

// route not found handler
function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

// general error handler
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
  });
}

//willl be using protect and adminOnly in the /routes/product-mainwebsite wiill be imported there 
//need to import notFound and errorHandler in the server.js //can separate them as errorMiddleware.js later

export { protect, adminOnly ,notFound, errorHandler};







// protect — checks if valid JWT cookie exists. If yes attaches user to req.user and moves forward. If no token or invalid token blocks the request.
// adminOnly — runs after protect. Checks if req.user.role is admin. If yes moves forward. If no sends 403 forbidden.
// next() — tells Express to move to the next function in the chain. Without calling next() the request just hangs and never gets a response.



// // any logged in user can access
// router.get("/profile", protect, getProfile)

// // only admin can access
// router.post("/products", protect, adminOnly, createProduct)