////////////////////////////////////////////////////////////////
// Warning: 不用 BigInt 會導致溢位
// BigInt 是透過在一個數值後加上 n ，例如 10n ，或呼叫 BigInt() 所生成的。
////////////////////////////////////////////////////////////////

const readline = require("node:readline");

// Step 1: 選擇質數與計算 n, φ(n)
const p = 11n;
const q = 17n;
const n = p * q; // n = 187n
const phi = (p - 1n) * (q - 1n); // φ(n) = 160n

// Step 2: 選擇公開指數 e 並找到私鑰 d
const e = 7n;
const d = 23n; // 7 × 23 ≡ 1 mod 160

function modPow(base, exponent, modulus) {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent / 2n;
    base = (base * base) % modulus;
  }
  return result;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(`輸入你想加密的數字，必須小於 ${n} => `, (number) => {
  const m = BigInt(number);
  const c = modPow(m, e, n); // c = m^e mod n

  console.log("Encrypted c =", c.toString());

  const m_decrypted = modPow(c, d, n); // m = c^d mod n
  console.log("Decrypted m =", m_decrypted.toString());

  rl.close();
});
