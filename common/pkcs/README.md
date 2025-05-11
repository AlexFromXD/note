# PKCS Overview

## 📦 PKCS 是什麼？

PKCS（Public-Key Cryptography Standards）是 RSA Labs 提出的一系列加密標準，分成 [#1 ~ #15](https://zh.wikipedia.org/zh-tw/%E5%85%AC%E9%92%A5%E5%AF%86%E7%A0%81%E5%AD%A6%E6%A0%87%E5%87%86)（有些已棄用）。其中 #1 就是在定義 RSA 的數理基礎、公/私鑰格式，以及加/解密、簽/驗章的流程。

目前 PKCS#1 最新的版本是 2002 年的 v2.1，這個版本發佈了 OAEP（Optimal Asymmetric Encryption Padding），主要是為了修正 v1.5 曾遭遇的 `padding oracle attack`。

> 2016 年的 v2.2 轉移至 IETF RFC 系列（RFC 8017），技術面沒有變動。

### 什麼是 padding ?

RSA 加密時只能處理固定大小的數字（例如 2048-bit RSA 最多只能加密約 190 多 bytes），
如果你要加密的資料太短，為了防止「重複的明文會導致重複的密文」這種安全風險，
就會在資料前面填入一些隨機值，這個動作就叫做 padding（填充）。

也就是說，padding 的目的有兩個：

- 讓相同明文每次加密結果不同（增加隨機性）
- 讓資料填滿金鑰長度限制，不被猜出格式

### 攻擊手法

| 攻擊手法                               | 觸發條件 / 說明                                                        | 防禦方式                                                         | 對應版本                       |
| -------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------ |
| **明文重放（Replay）**                 | 相同明文 → 相同密文，攻擊者重送密文獲得相同行為                        | 使用隨機 padding（OAEP）<br>應用層加入 nonce、timestamp、session | ❌ v1.5<br>✅ v2.1+            |
| **重複密文（Ciphertext Duplication）** | 攻擊者觀察密文重複頻率，推斷明文內容或樣板                             | 加密輸出需具備隨機性（OAEP）                                     | ❌ v1.5<br>✅ v2.1+            |
| **乘法關係攻擊**                       | RSA 同步加密多筆明文，利用 `C1 × C2 = (M1 × M2)^e mod n`               | 改用混合加密（RSA 只加密 AES key）                               | ❌ raw RSA<br>✅ 混合式        |
| **低指數攻擊（Low e）**                | 使用 e = 3 時若明文過小，可能使 `M^e < n` → 攻擊者直接開根號還原       | 使用 OAEP padding<br>或將 M 擴充成大數                           | ❌ raw RSA<br>✅ v1.5+         |
| **Padding Oracle**                     | 解密回應格式錯誤 vs MAC 錯 → 可用回應行為作為 side channel             | 使用 OAEP<br>或固定延遲 + 統一錯誤訊息                           | ❌ v1.5<br>✅ v2.1+            |
| **Bleichenbacher Attack**              | 攻擊者餵送 `(c × s^e) mod n` 並觀察 padding 驗證結果，逐步收斂明文區間 | 使用 OAEP padding<br>或禁止重複解密 + constant-time 行為         | ❌ v1.5<br>✅ v2.1+            |
| **訊息結構偽造（格式猜測）**           | 明文開頭格式已知（如 ASN.1 或標準 header），攻擊者暴力猜測其餘區段     | 使用隨機 padding 擋住格式、避免明文直接暴露於開頭                | ❌ raw/v1.5<br>✅ v2.1+        |
| **Chosen Ciphertext Attack**           | 攻擊者可任意選擇密文送給 server 解密並觀察回應                         | 限制解密次數 + 使用混合式加密                                    | ❌ raw RSA<br>✅ 混合式 / OAEP |

從上表可以看出混合式（RSA + 一種對稱式加密，通常是 AES）& OAEP 可以防止多種攻擊。直得注意的是 OAEP 預設是搭配 `SHA-1`，實作上可升級為 `SHA-256`。至於混合加密在 PKCS#1 並沒有相關定義。以下介紹幾種常見的應用：

### CMS (PKCS#7 / RFC 5652)

定義了一種通用的語法，用於表示加密和簽章的資料，包括數位簽章、數位信封（encrypted message），以及簽章的格式。在 CMS 規格中，加密資料的訊息類型稱為 EnvelopedData，其結構如下：

```
EnvelopedData ::= SEQUENCE {
  version CMSVersion,
  recipientInfos SET OF RecipientInfo,   ← 🔐 RSA 加密後的 AES key
  encryptedContentInfo EncryptedContentInfo  ← 🔒 被 AES 加密的內容
}
```

### JWE (RFC 7516)

JWE 是 JWT 規範家族（JOSE：JSON Object Signing and Encryption）的一部分，以 JSON 結構封裝加密資料，設計目標是：

- 語言中立（跨平台）
- 格式標準化（Base64URL encoded）
- 支援混合加密架構（RSA / ECDH + AES）

```
BASE64URL(Protected Header) . # JSON，指定 alg（金鑰加密）與 enc（資料加密）
BASE64URL(Encrypted Key) .    # CEK 經接收者公鑰加密後的結果
BASE64URL(IV) .               # AES 所用初始化向量（IV）
BASE64URL(Ciphertext) .       # encrypted payload
BASE64URL(Auth Tag)           # 用於驗證資料完整性（僅 AEAD 模式適用）
```

header 定義

```
{
  "alg": "RSA-OAEP-256",  // RSA 封裝 CEK（非對稱）
  "enc": "A256GCM"        // AES 加密 Payload（對稱）
}
```

### OpenPGP（RFC 4880）

OpenPGP 源自於 PGP（Pretty Good Privacy），支援 加密、簽章、驗證、壓縮、封裝，並廣泛用於：電子郵件加密（如 GnuPG）、軟體簽章（APT/Yum key）、金鑰交換。

> 如果你有聽過 GPG 的話，他代表 Gnu Privacy Guard，也就是 OSS 版的 PGP。可以理解成 PGP(純技術) 先發展出 OpenPGP (interface)，後來再長出 GPG & Symantec PGP(產品) 兩種實作。

```
Public-Key Encrypted Session  ← RSA 加密 AES key
Symmetric Encrypted Data      ← AES 加密實際內容
```

### 綜合比較

| 面向           | OpenPGP                       | JWE (RFC 7516)                | CMS / PKCS#7                     |
| -------------- | ----------------------------- | ----------------------------- | -------------------------------- |
| 封裝格式       | Binary + 自訂封包             | JSON + Base64URL              | ASN.1 DER binary                 |
| 混合加密支援   | ✅ RSA/ECDH + AES             | ✅ RSA/ECDH + AES             | ✅ RSA + AES                     |
| 加密演算法彈性 | 高（ElGamal, ECC, IDEA, etc） | 中（alg/enc 組合明確但有限）  | 高（支援多種 RSA, ECC 封裝）     |
| 壓縮支援       | ✅                            | ❌（交給應用層處理）          | ✅（可用 CompressedContentInfo） |
| 多接收者       | ✅ 多份 Session Key 封裝      | ✅ JSON General Serialization | ✅ RecipientInfos                |
| 人類可讀性     | ❌ Binary 格式為主            | ✅ JSON                       | ❌ ASN.1                         |

---

## 📖 Appendix

### 複習一下 RSA

```
enc：C = M^e mod n
dec：M = C^d mod n
```

#### step

1. n = p \* q (p, q 為質數)
1. φ(n) = (p-1) \* (q-1)
1. 公鑰 e，令 gcd(e, φ(n)) = 1
1. 私鑰 d，令 e × d ≡ 1 mod φ(n)
1. 測試 >> [rsa.js](./rsa.js)
