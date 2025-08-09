// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// 加载环境变量
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

// 业务路由：/api/order
const orderRoutes = require("./routes/order");
// POST https://<your-render>.onrender.com/api/order
app.use("/api/order", orderRoutes);

// 启动服务（Render 必须绑定 process.env.PORT）
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
