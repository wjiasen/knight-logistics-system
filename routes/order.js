const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");

/**
 * 计算顺丰 msgDigest（常见标准写法）：
 * msgDigest = Base64( MD5( bodyJson + CHECKWORD ) )
 */
function calcMsgDigest(bodyJson, checkword) {
  const md5Buf = crypto.createHash("md5").update(bodyJson + checkword, "utf8").digest();
  return Buffer.from(md5Buf).toString("base64");
}

/**
 * 统一调用顺丰标准接口
 */
async function callSF(serviceCode, body) {
  const clientCode = process.env.CLIENT_CODE;   // 顾客编码
  const checkword  = process.env.CHECKWORD;     // 校验码
  const apiUrl     = process.env.SF_API_URL || "https://sfapi-sbox.sf-express.com/std/service";

  const bodyJson = JSON.stringify(body);
  const msgDigest = calcMsgDigest(bodyJson, checkword);

  const payload = {
    head: {
      transType: serviceCode,
      transMessageId: `${Date.now()}-${Math.floor(Math.random()*100000)}`
    },
    // 部分环境也允许 {head: clientCode, serviceCode, msgDigest, body} 这种扁平格式；
    // 我们按文档常见格式带上 clientCode + msgDigest：
    clientCode,
    msgDigest,
    serviceCode,
    body
  };

  const resp = await axios.post(apiUrl, payload, {
    headers: { "Content-Type": "application/json" },
    timeout: 15000
  });
  return resp.data;
}

/**
 * 创建订单（你在 Postman 调用的就是这个）
 * URL: POST /api/order
 */
router.post("/", async (req, res) => {
  try {
    // 1) 取参数（前端/Postman 传什么我们就接什么）
    const { orderId, sender, receiver, cargo, weight, payMethod = 1, expressType = "1" } = req.body;

    // 2) MOCK：先跑通整条链路，不调用顺丰
    if (process.env.MOCK === "1") {
      return res.json({
        mock: true,
        message: "Mock create order success",
        echo: { orderId, sender, receiver, cargo, weight, payMethod, expressType }
      });
    }

    // 3) 真实调用顺丰沙箱
    const body = {
      orderId,               // 你的系统单号
      expressType,           // 产品类型，1=标快（示例）
      payMethod,             // 1=寄付月结（示例）
      sender,                // 发件方对象
      receiver,              // 收件方对象
      cargoDetails: Array.isArray(cargo) ? cargo : [cargo], // [{name,count}]
      totalWeight: weight || 1,
      parcelQty: 1
    };

    const data = await callSF("COM_RECE_JUOP_CREATE_ORDER", body);
    return res.json(data);
  } catch (err) {
    // 把尽可能多的错误信息返回，方便排查
    return res.status(500).json({
      error: "SF create order failed",
      detail: err?.response?.data || err.message
    });
  }
});

module.exports = router;
