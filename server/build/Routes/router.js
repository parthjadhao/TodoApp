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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../MongooseDb/database");
const authentication_1 = __importDefault(require("../Middleware/authentication"));
const SECRET = "sfgsgsdfs"; //env
const router = express_1.default.Router();
let userSignUpLoginInputValidation = zod_1.z.object({
    username: zod_1.z.string().min(1).max(10),
    password: zod_1.z.string().min(8).max(18),
});
router.post("/SignUp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = userSignUpLoginInputValidation.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(403).send("invalid input");
    }
    const { username, password } = parsedData.data;
    try {
        const isSameUser = yield database_1.User.findOne({ username: username });
        if (isSameUser) {
            res.status(202).send("username is already taken");
        }
        else {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = new database_1.User({
                username: username,
                password: hashedPassword,
            });
            try {
                const result = yield newUser.save();
                const userId = result._id;
                jsonwebtoken_1.default.sign({ userId }, SECRET, (err, token) => {
                    if (err) {
                        return res.status(500).send("failed to create account, try again");
                    }
                    else {
                        return res
                            .status(202)
                            .send({ message: "account created successfully", token });
                    }
                });
            }
            catch (e) {
                return res.status(500).send("failed to create account, try again");
            }
        }
    }
    catch (error) {
        return res.status(500).send("failed to create account try again");
    }
}));
router.post("/Login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedData = userSignUpLoginInputValidation.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(403).send({ messege: "invalid output" });
    }
    const { username, password } = parsedData.data;
    const user = yield database_1.User.findOne({ username: username });
    if (!user) {
        return res.status(404).send("User not found");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send("Invalid password");
    }
    const userId = user._id;
    jsonwebtoken_1.default.sign({ userId }, SECRET, (err, token) => {
        if (err) {
            return res.status(500).send("Unable to login, try again");
        }
        else {
            return res.status(200).send({ token, message: "Logged in successfully" });
        }
    });
}));
router.get("/", authentication_1.default, (req, res) => {
    const userId = req.userId;
    database_1.Todo.find({ userId: userId })
        .then((allTodos) => {
        res.json(allTodos);
    })
        .catch((err) => {
        console.error(err + "unable to fetch todos");
        res.status(500).send({ error: true, message: "Unable to fetch todos" });
    });
});
router.post("/createTodo", authentication_1.default, (req, res) => {
    const { title, discription } = req.body;
    console.log(req.body);
    console.log(discription);
    const newTodo = new database_1.Todo({
        userId: req.userId,
        title: title,
        discription: discription,
    });
    newTodo
        .save()
        .then((result) => {
        const todoId = result._id;
        console.log("Created Todo list successfully " + result);
        return res
            .status(201)
            .send({ message: "Todo created successfully", todoId });
    })
        .catch((err) => {
        console.error(err + "Failed to create todo");
        return res
            .status(500)
            .send({ error: true, message: "Failed to create todo" });
    });
});
router.delete("/deleteTodo/:id", authentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todoId = req.params.id;
    try {
        console.log(todoId);
        const deleteTodo = yield database_1.Todo.findOneAndDelete({
            _id: todoId,
            userId: req.userId,
        });
        if (!deleteTodo) {
            console.log(deleteTodo);
            return res.status(403).send("incorrect id");
        }
        return res.status(202).send("succesfully deleted the todo");
    }
    catch (e) {
        console.error(e);
        return res.status(500).send("failed to delete try again" + e);
    }
}));
// module.exports = router;
exports.default = router;
