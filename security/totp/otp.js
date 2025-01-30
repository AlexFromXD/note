const crypto = require("crypto");

// 每 5 秒換一次，測試用
const TIME_STEP = 5;

function generateBase64Secret(length = 16) {
  const secret = crypto.randomBytes(length);
  return {
    secret,
    encoded: secret.toString("base64url"),
  };
}

function generateTOTP(secret, timeStep = TIME_STEP, window = 0) {
  // 計算目前是第幾個 30 秒區間，並允許 verify 時的時間誤差
  let timeCounter = Math.floor(Date.now() / 1000 / timeStep) + window;
  // 轉換成 8-byte Big Endian Buffer（最高位先存）
  const timeBuffer = Buffer.alloc(8);
  for (let i = 7; i >= 0; i--) {
    timeBuffer[i] = timeCounter & 0xff; // 0xff = `1111 1111`，取 timeCounter 的最低 8-bit
    timeCounter >>>= 8; // 右移 8-bit
  }

  const hmac = crypto.createHmac("sha1", secret).update(timeBuffer).digest();

  // 動態截斷（取 HMAC 的最後 4 個 bytes）
  const offset = hmac[hmac.length - 1] & 0xf;
  const otpBinary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  // 取最後 6 位數
  const otp = otpBinary % 1000000;
  return otp.toString().padStart(6, "0");
}

// window: 允許的時間誤差範圍
function verifyTOTP(secret, otp, timeStep = TIME_STEP, window = 1) {
  for (let i = -window; i <= window; i++) {
    const validOTP = generateTOTP(secret, timeStep, i);
    if (validOTP === otp) {
      return true;
    }
  }
  return false;
}

const secret = generateBase64Secret();

const otp = generateTOTP(secret.secret);
console.log("otp: ", otp);

const valid = verifyTOTP(secret.secret, otp);
console.log("valid right now: ", valid);

setTimeout(() => {
  const valid = verifyTOTP(secret.secret, otp);
  console.log("valid after 6 sec: ", valid);
}, 6000);

setTimeout(() => {
  const valid = verifyTOTP(secret.secret, otp);
  console.log("valid after 12 sec: ", valid);
}, 12000);
