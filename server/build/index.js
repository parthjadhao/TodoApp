const express = require("express");
const routes = require("./Routes/routes");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use("/", routes);
app.listen(port, () => {
    console.log(`Example app listening on port ${port} the secret key is ${process.env.SECRET_KEY}`);
});
