const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/order', async (req, res) => {
  const {
    orderId,
    sender,
    receiver,
    cargo,
    payMethod
  } = req.body;

  try {
    // 1. 构造顺丰 API 请求体
    const requestData = {
      orderId,
      expressType: 1,
      sender,    // 发件人信息对象
      receiver,  // 收件人信息对象
      cargoDetails: [cargo],
      payMethod
    };

    // 2. 生成签名（加密）并发送请求
    const { SF_CLIENT_CODE, SF_CHECKWORD } = process.env;

    const response = await axios.post('https://sfapi-sandbox.sf-express.com/std/service', {
      head: SF_CLIENT_CODE,
      serviceCode: 'COM_RECE_JUOP_CREATE_ORDER',
      body: requestData
    }, {
      headers: {
        'Content-Type': 'application/json',
        // 如果需要加密，可以在此处加入加密逻辑或签名字段
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('下单失败:', error.response?.data || error.message);
    res.status(500).json({ error: '顺丰下单失败' });
  }
});

module.exports = router;
