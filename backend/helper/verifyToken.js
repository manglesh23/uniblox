const jwt = require("jsonwebtoken");

const verifytoken = async (req, res, next) => {               //middleware to verify the token.
  let token = req.headers["authorization"];
  // console.log("Token:-",token)
  // console.log("Before token:-",token);

  if (token.includes("Bearer")) {
    token = token.split(" ")[1];
  }

  // console.log("Verification Token:-",token);
  if (!token) return res.status(403).send("Access Denied");

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
};

module.exports = { verifytoken };
