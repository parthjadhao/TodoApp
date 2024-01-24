const { User } = require("../MongooseDb/database");
const jwt = require("jsonwebtoken");
const SECRET = "sfgsgsdfs";
// import { Request, Response, NextFunction } from "express";

// export interface customRequest extends Request {
//   userId: string;
// }

const authorization = async (req, res, next) => {
  console.log("Control speaking from middleware");
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Unauthorized user");
  }

  try {
    const result = await jwt.verify(token, SECRET);
    req.userId = result.userId;
    console.log(result.userId);

    const user = await User.findOne({ _id: req.userId });
    console.log(user);

    if (!user) {
      return res.status(403).json({ error: "Authorization failed" });
    }

    next();
  } catch (e) {
    console.error("Authorization failed due to", e);
    return res.status(500).send("Authorization failed due to " + e.message);
  }
};
module.exports = authorization;
