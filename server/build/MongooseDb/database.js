"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Todo = exports.User = void 0;
const mongoose = require("mongoose");
// import mongoose from "mongoose";
//env
mongoose.connect("mongodb+srv://parthjadhao:PCIFvB0h2neEzgq0@cluster0.m9wmyjk.mongodb.net/");
const todoSchema = new mongoose.Schema({
    userId: String,
    title: String,
    discription: String,
});
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});
exports.User = mongoose.model("User", userSchema);
exports.Todo = mongoose.model("Todo", todoSchema);
// module.exports = {
//   User,
//   Todo,
// };
