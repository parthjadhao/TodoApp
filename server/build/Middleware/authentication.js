"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const { User } = require("../MongooseDb/database");
const jwt = require("jsonwebtoken");
const SECRET = "sfgsgsdfs";
const authorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Control speaking from middleware");
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send("Unauthorized user");
    }
    try {
        const result = yield jwt.verify(token, SECRET);
        req.userId = result.userId;
        console.log(result.userId);
        const user = yield User.findOne({ _id: req.userId });
        console.log(user);
        if (!user) {
            return res.status(403).json({ error: "Authorization failed" });
        }
        next();
    }
    catch (e) {
        console.error("Authorization failed due to", e);
        return res.status(500).send("Authorization failed due to " + e.message);
    }
});
exports.authorization = authorization;
// module.exports = authorization;
