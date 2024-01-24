import express from "express";
import routes from "./Routes/router";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
