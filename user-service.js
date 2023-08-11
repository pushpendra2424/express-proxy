const express = require("express");
const app = express();
const port = 9092;

app.get("/users", (req, res) => {
  const users = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
  ];
  return res.json(users);
});
app.get("/users/me", (req, res) => {
  return res.json("Me api run...");
});
app.use("*", (req, res) => {
  return res.json("Child end point not match...");
});

app.listen(port, () => {
  console.log(`User Microservice listening at http://localhost:${port}`);
});
