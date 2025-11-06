const express = require("express");
const { crdRouter } = require("./crd");

const app = express();

app.use(express.json()).use("/crd", crdRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
