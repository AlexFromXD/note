# OpenSSL Cheatsheet

這份 cheatsheet 整理了常用的 OpenSSL 指令，並簡單說明使用情境。

## 產生 Key Pair

- **產生私鑰**  
  用於後續產生公鑰、簽章或解密。

  ```sh
  # rsa
  openssl genrsa -out private.pem 2048

  # ecdsa
  openssl ecparam -genkey -name prime256v1 -out private.pem
  ```

- **產生公鑰**  
  從私鑰導出公鑰，供加密或驗章使用。

  ```sh
  # rsa
  openssl rsa -in private.pem -outform PEM -pubout -out public.pem

  # ecdsa
  openssl ec -in private.pem -pubout -out public.pem

  ```

## 加密與解密

- **使用公鑰加密**  
  適合傳送敏感資料給擁有私鑰的人。

  ```sh
  openssl pkeyutl -encrypt -pubin -inkey public.pem -in msg.txt -out msg.cipher
  ```

- **使用私鑰解密**  
  只有擁有私鑰的人能解開密文。

  ```sh
  openssl pkeyutl -decrypt -inkey private.pem -in msg.cipher
  ```

> RSA 是 Rivest, Shamir, and Adleman 三位人名字母縮寫，ECDSA 是 Elliptic Curve Digital Signature Algorithm，名字透露了他是 Signature 算法，不能用來加解密！加密算法叫做 ECIES (Elliptic Curve Integrated Encryption Scheme)，而 OpenSSL 目前不支援。

## 簽章與驗章

- **使用私鑰簽章**  
  確認訊息來源與完整性。

  ```sh
  openssl pkeyutl -sign -inkey private.pem -in msg.txt -out msg.sign
  ```

- **使用公鑰驗章**  
  驗證簽章是否來自對方。

  ```sh
  openssl pkeyutl -verify -pubin -inkey public.pem -in msg.txt -sigfile msg.sign
  ```

## 檢查 SSL/TLS 連線

- **s_client 測試 SSL/TLS 連線**  
  建立 TLS 交握，並維持開啟的 TCP 連線，用於測試伺服器的憑證、協定與加密套件。

  ```sh
  openssl s_client -connect example.com:443

  # or 只顯示憑證資訊

  openssl s_client -connect example.com:443 -showcerts
  ```

  常見用途：

  - 檢查網站憑證有效性
  - 查看支援的 TLS 版本與 Cipher
  - 偵錯 HTTPS 連線問題

---

## TLS 1.3

### 流程

1. TCP 三向交握

   - Client → SYN
   - Server → SYN+ACK
   - Client → ACK

1. client 送出 ClientHello，包含：

   - 一串隨機亂數（叫 client_random）：防止攻擊者複製一模一樣的握手資料後重放。
   - 支援的加密演算法清單：例如哪些對稱加密（AES-GCM）、雜湊（SHA256）、金鑰交換演算法（X25519、secp256r1）… 等。
   - 一把臨時「公開金鑰」：用來計算雙方在這次連線專用的 session key。
   - FQDN：讓 SNI 提供正確的憑證。

1. server 收到 ClientHello 後，回應一個 ServerHello，包含：

   - 另一串隨機亂數（server_random）：跟 client_random 一起會參與 key 的生成。
   - server 的臨時公開金鑰（跟憑證裡的公開金鑰不同）。
   - server 的憑證：裡面有 server 的公開金鑰和簽章，用來向 CA 驗證這個 server 是否合法。
   - 一段數位簽章：server 拿自己的私鑰（不是臨時私鑰），對剛剛交換的資料做一段簽名，client 收到可以用憑證裡的公鑰驗證，用來防止 MITM。
   - EncryptedExtensions：其他額外協議用資訊。
   - Finished：用雙方產生的對稱金鑰（用 Diffie–Hellman + HKDF 算出來的）加密後送出一段資料，告訴 client：「我都準備好了」。

1. client 收到 server 的資料後，會：

   - 驗證 server 的憑證是不是有效、是不是信任的 CA 簽出來的。
   - 驗證 server 的簽章是不是正確的，防止有人中間竄改 ServerHello。
   - 拿自己的臨時私鑰 + server 的臨時公鑰，用 Diffie–Hellman 算出一個 shared secret。
   - 把 shared secret 丟進一個公式裡，混入剛剛雙方的 random 資料，跑出好幾把對稱加密金鑰（client 送資料用的 key、server 回資料用的 key 都分開），這就是 key derivation（HKDF）。
   - 用剛剛的金鑰加密自己的 Finished 資料送給 server，表示「我也準備好了」。

1. server 收到 client 的 Finished 後，也會用對稱金鑰解密、驗證無誤後，TLS 握手就結束了。

### 為什麼 TLS 1.3 不再使用 RSA 交換金鑰？

#### 在 TLS 1.2 時代，client 常常會這樣做：

- 自己先產生一把 AES 專用的 session key
- 再用 server 憑證中的 RSA 公鑰把這把 key 加密，傳給 server。
- server 用私鑰解密拿到 AES key，雙方就能開始加密資料
- 這種做法的缺點是：
  - forward secrecy 不成立：如果有攻擊者錄下整段通訊，再等你哪天 RSA 私鑰洩漏，就可以把整段歷史資料解開。
  - RSA 運算慢，無法硬體加速、成本高

#### TLS 1.3 就徹底把這條路砍掉，改成：

- 雙方各自臨時產生一把 ephemeral 金鑰（不在憑證裡）
- 交換彼此的公鑰後，靠 Diffie–Hellman 算出 shared secret
- 這個過程不需要加密或傳送任何對稱金鑰，對稱金鑰是算出來的，不會在網路中傳

### 總結

一個 TLS 傳輸會發生以下幾類簽章 or 加密：
| 階段/用途 | 說明 | 常用演算法 |
| ------------------ | --------------------------------------------- | --------------------------------- |
| 憑證簽章，發生在 TLS 交握之前 | 由 CA 簽出 server 的憑證，client 用來驗證 server 是誰 | RSA-PSS、ECDSA、Ed25519 |
| ServerHello 的簽章 | server 對自己送出的資料做簽章，防止中間人偽造 | 同上，使用憑證中的私鑰 |
| 金鑰交換（DH） | 雙方各自產 ephemeral key，計算 shared secret | X25519、secp256r1、X448 |
| 金鑰衍生（KDF） | 將 shared secret 混入雙方 random 值，導出不同方向用的 AES 金鑰 | HKDF（配 SHA256、SHA384） |
| 資料加密（record layer） | 真正加密 HTTP 資料的步驟，用硬體加速的對稱加密 | AES-128/256-GCM、ChaCha20-Poly1305 |

#### HKDF key schedule (HMAC-based Extract-and-Expand Key Derivation Function)

```
early_secret      = HKDF-Extract(salt=0, IKM=0)
handshake_secret  = HKDF-Extract(salt=early_secret, IKM=shared_secret)

client_traffic_secret = HKDF-Expand(handshake_secret, "client hs traffic", handshake_context)
server_traffic_secret = HKDF-Expand(handshake_secret, "server hs traffic", handshake_context)
application_traffic_secret = HKDF-Expand(..., ...)
```

> TLS 終究是理論，一切建立在「client 的 CA store 是可信的」這項基礎上，因此實務上要搭配 **TLS Pinning** 這樣的機制才能最大化安全性。
