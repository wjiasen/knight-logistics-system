const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");

router.post("/create", async (req, res) => {
  const { orderId, sender, receiver, cargo, weight } = req.body;

  const payload = {
    head: {
      transType: 200,
      transMessageId: Date.now().toString(),
      customerCode: process.env.SF_CUSTOMER_CODE,
    },
    body: {
      orderId,
      expressType: "1",
      sender,
      receiver,
      parcelQty: 1,
      payMethod: 1,
      cargoDetails: cargo,
      totalWeight: weight,
    },
  };

  const bodyStr = JSON.stringify(payload.body);
  const verifyCode = crypto
    .createHash("md5")
    .update(bodyStr + process.env.SF_SANDBOX_KEY, "utf8")
    .digest("base64");

  const finalPayload = {
    ...payload,
    verifyCode,
  };

  try {
    const response = await axios.post(process.env.SF_API_URL, finalPayload, {
      headers: { "Content-Type": "application/json" },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
