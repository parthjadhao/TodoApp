"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const mongoose = require("mongoose");
const mongoose_1 = __importDefault(require("mongoose"));
//env
mongoose_1.default.connect("mongodb+srv://parthjadhao:PCIFvB0h2neEzgq0@cluster0.m9wmyjk.mongodb.net/");
const todoSchema = new mongoose_1.default.Schema({
    userId: String,
    title: String,
    discription: String,
});
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
});
const User = mongoose_1.default.model("User", userSchema);
const Todo = mongoose_1.default.model("Todo", todoSchema);
module.exports = {
    User,
    Todo,
};
