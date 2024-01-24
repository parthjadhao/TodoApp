// import express from "express";
const express = require("express");
// import { Request, Response } from "express";
// import { customRequest } from "../Middleware/authentication.js";
// import { z } from "zod";
const z = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Todo } = require("../MongooseDb/database.js");
const { User } = require("../MongooseDb/database.js");
const authorization = require("../Middleware/authentication.js");
const SECRET = "sfgsgsdfs"; //env
const router = express.Router();

// interface TodoType {
//   userId: String;
//   title: String;
//   description: String;
//   _id: String;
// }
// type TodoTypeArray = TodoType[];

let userSignUpLoginInputValidation = z.object({
  username: z.string().min(1).max(10),
  password: z.string().min(8).max(18),
});
router.post("/SignUp", async (req, res) => {
  const parsedData = userSignUpLoginInputValidation.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(403).send("invalid input");
  }
  const { username, password } = parsedData.data;
  try {
    const isSameUser = await User.findOne({ username: username });
    if (isSameUser) {
      res.status(202).send("username is already taken");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: username,
        password: hashedPassword,
      });
      try {
        const result = await newUser.save();
        const userId = result._id;
        jwt.sign({ userId }, SECRET, (err, token) => {
          if (err) {
            return res.status(500).send("failed to create account, try again");
          } else {
            return res
              .status(202)
              .send({ message: "account created successfully", token });
          }
        });
      } catch (e) {
        return res.status(500).send("failed to create account, try again");
      }
    }
  } catch (error) {
    return res.status(500).send("failed to create account try again");
  }
});

router.post("/Login", async (req, res) => {
  const parsedData = userSignUpLoginInputValidation.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(403).send({ messege: "invalid output" });
  }
  const { username, password } = parsedData.data;
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(404).send("User not found");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send("Invalid password");
  }

  const userId = user._id;
  jwt.sign({ userId }, SECRET, (err, token) => {
    if (err) {
      return res.status(500).send("Unable to login, try again");
    } else {
      return res.status(200).send({ token, message: "Logged in successfully" });
    }
  });
});

router.get("/", authorization, (req, res) => {
  const userId = req.userId;
  Todo.find({ userId: userId })
    .then((allTodos) => {
      res.json(allTodos);
    })
    .catch((err) => {
      console.error(err + "unable to fetch todos");
      res.status(500).send({ error: true, message: "Unable to fetch todos" });
    });
});

router.post("/createTodo", authorization, (req, res) => {
  const { title, discription } = req.body;
  const newTodo = new Todo({
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

router.delete("/deleteTodo/:id", authorization, async (req, res) => {
  const todoId = req.params.id;
  try {
    console.log(todoId);
    const deleteTodo = await Todo.findOneAndDelete({
      _id: todoId,
      userId: req.userId,
    });
    if (!deleteTodo) {
      console.log(deleteTodo);
      return res.status(403).send("incorrect id");
    }
    return res.status(202).send("succesfully deleted the todo");
  } catch (e) {
    console.error(e);
    return res.status(500).send("failed to delete try again" + e);
  }
});

module.exports = router;
