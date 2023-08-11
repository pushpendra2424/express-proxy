const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");

const app = express();
const port = 9090;
const jwtSecretKey = "secret-key";

const routes = require("./routes.json");
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "You have not access this api end point..." });
    }
    req.user = user;
    next();
  });
}

function createProxy(target, requireAuth) {
  return (req, res) => {
    if (requireAuth) {
      authenticateToken(req, res, () => {
        createProxyMiddleware({ target })(req, res);
      });
    } else {
      createProxyMiddleware({ target })(req, res);
    }
  };
}

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username },
    jwtSecretKey,
    { expiresIn: "1h" }
  );
  res.status(200).json({ token });
});

app.post("/add-service", authenticateToken, (req, res) => {
  const { serviceName, target, auth, enabled } = req.body;

  if (!serviceName || !target) {
    return res.status(400).json({ message: "Service name is required" });
  }

  const services = routes.gateway.services;

  if (services[serviceName]) {
    return res.status(400).json({ message: "Service already exists" });
  }

  services[serviceName] = {
    target,
    auth: auth === true,
    enabled,
  };

  fs.writeFileSync("./routes.json", JSON.stringify(routes));
  res.status(200).json({ message: "New service added successfully!" });
});

app.use("/:service", (req, res, next) => {
  const requestedService = req.params.service;
  const services = routes.gateway.services;

  if (services[requestedService] && services[requestedService].enabled) {
    const service = services[requestedService];
    const target = service.target;
    const requireAuth = service.auth === true;

    createProxy(target, requireAuth)(req, res);
  } else {
    next();
  }
});

app.use("*", (req, res) => {
  return res.send("Not found...");
});

app.listen(port, () => {
  console.log(`API Gateway listening at http://localhost:${port}`);
});
