## SPF

SPF(Sender Policy Framework ) 記錄定義了**能夠代表您傳送電子郵件的郵件伺服器和網域**，並會指示收件伺服器該如何處理檢查完畢的郵件。收件伺服器會在收到看似來自貴機構的郵件時檢查您的 SPF 記錄，藉此驗證該郵件是否確實是由您授權的伺服器傳送。

> If you have multiple TXT DNS entries that start with this prefix, email servers will immediately stop processing their SPF checks. SPF authentication will **always fail.**

| `v`       | SPF 版本，這個標記是必要項目，且必須是記錄中的第一個標記。機制必須為：`v=spf1`                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ip4`     | 依據 IPv4 位址或位址範圍授權郵件伺服器。這個值必須是標準格式的 IPv4 位址或位址範圍，例如：`ip4:192.168.0.1` 或 `ip4:192.0.2.0/24`                                   |
| `ip6`     | 依據 IPv6 位址或位址範圍授權郵件伺服器。這個值必須是標準格式的 IPv6 位址或位址範圍，例如：`ip6:3FFE:0000:0000:0001:0200:F8FF:FE75:50DF` 或 `ip6:2001:db8:1234::/48` |
| `a`       | 依據網域名稱授權郵件伺服器，例如：`a:solarmora.com`                                                                                                                 |
| `mx`      | 依據網域 MX 記錄授權一或多個郵件伺服器，例如：`mx:mail.solarmora.com` 如果您的 SPF 記錄中沒有這項機制，系統會將使用 SPF 記錄網域的 MX 記錄做為預設值。              |
| `include` | 依據網域授權第三方電子郵件寄件者，例如：`include:servers.mail.net`                                                                                                  |
| `all`     | 指定系統對與機制相符的所有內送郵件執行的動作。建議您一律在 SPF 記錄中納入這項機制。                                                                                 |

這必須是 SPF 記錄中的最後一項機制，系統會忽略 SPF 記錄中列於  `all`  機制之後的所有機制。
**該使用  ~all  還是 -all？**
如果 SPF 記錄中含有  `~all` ([非封鎖性失敗限定詞](https://support.google.com/a/answer/10683907?sjid=299997186207250570-AP#softfail))，若寄件者不在 SPF 記錄中，收件伺服器通常會接受對方傳送的郵件，但會將這些郵件標示為可疑郵件。
如果 SPF 記錄含有  `-all` ([失敗限定詞](https://support.google.com/a/answer/10683907?sjid=299997186207250570-AP#fail))，若寄件者不在 SPF 記錄中，收件伺服器可能就會拒收對方傳送的郵件。如果您的 SPF 記錄設定有誤，失敗限定詞可能會導致更多從您網域寄出的郵件被歸類為垃圾郵件。
**提示**：如要防止不會傳送電子郵件的網域遭到假冒，請使用  `vspf1 ~all`  做為該網域的 SPF 記錄 |

| **SPF 記錄範例**                                         | **說明**                       |
| -------------------------------------------------------- | ------------------------------ |
| `v=spf1 ip4:192.168.0.0/16 include:_spf.google.com ~all` | 為網域授權以下電子郵件寄件者： |

• 任何 IP 位址介於  **192.168.0.0**  和  **192.168.255.255**  之間的伺服器
• **Google Workspace** |
| `v=spf1 ip4:192.168.0.0/16 include:_spf.google.com include:sendyourmail.com ~all` | 為網域授權以下電子郵件寄件者：
• 介於  **192.168.0.0**  和  **192.168.255.255**  之間的伺服器
• **Google Workspace**
• 第三方服務  **Sendyourmail** |
| `v=spf1 a:mail.solarmora.com ip4:192.72.10.10 include:_spf.google.com ~all` | 為網域授權以下電子郵件寄件者：
• 伺服器  **mail.solarmora.com**
• IP 位址為  **192.72.10.10**  的伺服器
• **Google Workspace** |
| `v=spf1 include:servers.mail.net include:_spf.google.com ~all` | 為網域授權以下電子郵件寄件者：
• 伺服器為  **servers.mail.net**  的第三方電子郵件服務
• **Google Workspace** |

| **限定詞** | **收件伺服器針對與機制相符的郵件採取的動作**                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `+`        | 通過驗證。IP 位址與機制相符的伺服器有權為網域傳送郵件。系統會讓郵件通過驗證。如果機制未使用限定詞，系統預設會執行這項動作。       |
| `-`        | 不予通過驗證。IP 位址與機制相符的伺服器無權為網域傳送郵件。SPF 記錄不包含寄件伺服器的 IP 位址或網域，因此郵件無法通過驗證。       |
| `~`        | 讓驗證非封鎖性失敗。IP 位址與機制相符的伺服器可能未取得為網域傳送郵件的權限。收件伺服器通常會接受郵件，但會將其標示為可疑郵件。   |
| `？`       | 代表中立，沒有通過驗證與否的問題。SPF 記錄未明確指出該 IP 位址是否有權為網域傳送郵件。會產生中立結果的 SPF 記錄通常是使用  `?all` |

> Ref: https://support.google.com/a/answer/10683907

## DKIM

DKIM(DomainKeys Identified Mail) 使用以[公用金鑰加密法](https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/)為基礎的數位簽章配置來驗證電子郵件的來源。電子郵件提供者產生公用金鑰和私密金鑰。它們會**將公用金鑰提供給網域擁有者**，網域擁有者會將公用金鑰儲存在公開可用的 DNS 記錄（DKIM 記錄）中。從該網域傳送的所有電子郵件都**包含 DKIM 標頭**，其中包含使用私密金鑰簽署的資料區段（數位簽章）。電子郵件伺服器可以檢查 DKIM DNS 記錄、取得公用金鑰，以及使用公用金鑰驗證數位簽章。

> Ref: https://www.cloudflare.com/zh-tw/learning/dns/dns-records/dns-dkim-record/

## DMARC

DMARC(Domain-based Message Authentication, Reporting & Conformance) 決定當電子郵件未通過檢查（SPF or DKIM）時，會被標記為垃圾郵件、被封鎖，還是被傳遞給預定的收件者。

e.g. `v=DMARC1; p=reject; [rua=mailto:postmaster@solarmora.com](mailto:rua=mailto:postmaster@solarmora.com), [mailto:dmarc@solarmora.com](mailto:dmarc@solarmora.com); pct=100; adkim=s; aspf=s`

> 欄位含義：https://support.google.com/a/answer/2466580
