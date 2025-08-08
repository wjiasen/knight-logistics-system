const express = require("express");
const dotenv = require("dotenv");
const orderRoutes = require("./routes/order");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => res.send("Knight Logistics API Running"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
