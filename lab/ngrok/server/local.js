const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.json({ msg: "Wow! You find me." });
});

app.get("/path", function (req, res) {
  res.json({ msg: "Wow! You find me with path." });
});

app.post("/", function (req, res) {
  res.json({ msg: "Here is your post result" });
});

const port = 7846;
app.listen(port, () => {
  console.log("server is listening: ", port);
});
