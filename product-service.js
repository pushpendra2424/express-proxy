const express = require("express");
const app = express();
const port = 9091;

app.get("/products", (req, res) => {
  const products = [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
  ];
  res.json(products);
});
app.get("/products/me", (req, res) => {
  res.json("Products me called...");
});
app.use("*", (req, res) => {
  return res.json("Products end point not found...");
});
app.listen(port, () => {
  console.log(`Product 1 Microservice listening at http://localhost:${port}`);
});
