const express = require('express');
const app = express();
const orderRoutes = require('./routes/order');

app.use(express.json());
app.use('/api', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
