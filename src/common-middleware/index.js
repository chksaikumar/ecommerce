const jwt = require("jsonwebtoken");

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    //if it is undefined then it will execute
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } else {
    return res.status(400).json({ message: "Authorization required" });
  }
  next();
};

//user middelware for the customers
exports.userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(400).json({ message: "User access denied" });
  }
  next();
};
//admin middleware
exports.adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    //if it not an admin it will return message
    return res.status(400).json({ message: "Admin access denied" });
  }
  next();
};
