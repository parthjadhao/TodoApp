import { User } from "../MongooseDb/database";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
// import Express from "../index"; no need to import this
const SECRET = "sfgsgsdfs";
export interface customRequest extends Request {
  userId: String;
}
export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Control speaking from middleware");
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send("Unauthorized user");
  }

  try {
    const result = (await jwt.verify(token, SECRET)) as JwtPayload;
    // you cant assign req values, they are sent from frontend
    // also req is an object it holds data in headers and body
    // req.userId is invalid
    const userId = result.userId; // Assign userId to the request object

    // Access userId only after successful assignment
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(403).json({ error: "Authorization failed" });
    }

    next();
  } catch (e: any) {
    console.error("Authorization failed due to", e);
    return res.status(500).send("Authorization failed due to " + e.message);
  }
};

// export default authorization;
