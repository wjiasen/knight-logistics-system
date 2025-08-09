const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => res.send("Knight Logistics API Running"));

// routes
const orderRoutes = require("./routes/order");
app.use("/api/order", orderRoutes); // => POST https://.../api/order

// start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
