MFA 用了很久，試試看自己來做個 TOTP 產生器。

GPT 說基本概念如下：

```
OTP = Truncate(HMAC-SHA1(Secret, TimeCounter))
```

- Secret：使用者的密鑰（Base32）
- TimeCounter：當前時間戳 T 除以 30 秒（以減少頻繁變動）
- HMAC-SHA1：將 Secret 和 TimeCounter 進行 HMAC 計算
- Truncate：取最後 4 個 bytes，做 bitwise 運算，得到 6 位數 OTP

先複習下 HMAC，MAC 是指 **Message Authentication Code**，HMAC 則是 **Keyed-Hashing for Message Authentication**。簡單講就是一種標準化的加鹽（salt）方式。公式如下：

```
HMAC(K, M) = H( (K' ⊕ opad) || H((K' ⊕ ipad) || M) )
```

- H 是雜湊函數（例如 SHA-1、SHA-256）
- K 是密鑰
- M 是要驗證的訊息
- K' 是處理後的密鑰（長度調整為 64 bytes）
- ipad 是一組固定的內部填充值 0x36
- opad 是一組固定的外部填充值 0x5C
- ⊕ 是 XOR（異或運算）
- || 是字串或資料的串接（concatenation）

**步驟**

1. 產生 K'

   - 如果 K 小於 64 bytes，則在後面補 0x00 直到 64 bytes
   - 如果 K 大於 64 bytes，則先做 H(K) 雜湊，讓它變成 64 bytes

1. 內部雜湊（Inner Hash）

   1. `K'` 和 `ipad` 重複做 64 次 XOR
   1. 把這個結果跟 M（訊息）串接
   1. 對這個新字串計算 H() 雜湊

1. 外部雜湊（Outer Hash）
   1. `K'` 和 `opad` 重複做 64 次 XOR
   1. 把這個結果跟 inner（前一步的雜湊結果）串接
   1. 對這個新字串計算 H() 雜湊

知道這些概念之後就可以來寫[程式](./otp.js)囉！
