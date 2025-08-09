// index.js
const express = require("express");
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/order");

const app = express();
app.use(bodyParser.json());

// 根路径健康检查
app.get("/", (req, res) => {
  res.send("Knight Logistics API Running");
});

// API 路由
app.use("/api", orderRoutes);

// 读取 PORT 环境变量（Render 会自动注入）
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
