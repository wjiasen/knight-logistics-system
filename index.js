// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// 读取 .env 环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 根路径健康检查
app.get("/", (req, res) => {
  res.send("Knight Logistics API Running");
});

// 引入订单路由
const orderRoutes = require("./routes/order");
app.use("/api/order", orderRoutes);

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
