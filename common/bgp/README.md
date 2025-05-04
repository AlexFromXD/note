# BGP Overview

## 🎯 本篇能解答的關鍵問題

- 自治系統（Autonomous System）是誰定義的？什麼時候算是一個獨立網域？
- 為什麼明明有 IP 和 TCP，還需要 BGP？
- BGP 是怎麼決定封包的走向？會決定整條路嗎？
- 要怎麼開始營運自己的自治系統？實際要做哪些事？又怎麼透過它獲利？

---

## 📖 名詞解釋

| 名詞                                 | 定義                                                                       |
| ------------------------------------ | -------------------------------------------------------------------------- |
| **BGP**（Border Gateway Protocol）   | 一種第 4 層協定，讓不同自治系統之間交換路由資訊。                          |
| **ASN**（Autonomous System Number）  | 每個自治系統的唯一識別編號，可為公有或私有。                               |
| **Prefix**                           | 一段 IP 網段，以 CIDR 表示，例如 `10.0.0.0/16`。BGP 宣告的最小單位。       |
| **BGP Session**（BGP 連線）          | BGP 對等端之間的連線，通常透過 TCP port 179 建立，建立後才能交換路由資訊。 |
| **Static Route**（靜態路由）         | 手動配置的路由，不會自動更新。                                             |
| **IGP**（Interior Gateway Protocol） | 在單一自治系統內部交換路由的協定（如 OSPF、EIGRP）。                       |
| **EGP**（Exterior Gateway Protocol） | 在自治系統與自治系統之間交換路由的協定（如 BGP）。                         |
| **Anycast**                          | 多個節點共用同一 IP，封包會被導向最近的節點。                              |
| **VGW／DXGW**                        | AWS 的網關元件，扮演 BGP 對等端角色。                                      |

---

## 📘 概念解釋

### 🔄 BGP 如何交換路由資訊？

當兩個自治系統（Autonomous System）想要交換彼此的路由資訊時，會先建立一條 BGP 連線（BGP Session），這是一種基於 TCP port 179 的長連線。你可能會問：為什麼是 TCP？因為 BGP 是一種可靠的、基於狀態的協定，它需要確保每個 prefix 的交換、撤銷都能被雙方同步記錄與追蹤。

Session 建立後，其中一方會用 UPDATE 封包主動宣告自己可以抵達哪些 prefix。這些宣告不只包含目的網段，還附帶各種屬性，例如：

- **AS Path**：這段路徑經過哪些 AS，是 loop 避免與距離計算的依據。
- **Next Hop**：這條路的下一跳 IP，實際封包要怎麼送得出去靠它。
- **Local Preference**：內部偏好值，決定哪條路比較被偏好。
- **MED（Multi Exit Discriminator）**：建議對方偏好從哪個出口進來。

那這些資訊收到以後，對方會全部接受嗎？當然不會。每一台 BGP router 都會根據自己設定的 routing policy，比較所有候選路徑，選出一條 best path。你可以想像它像是在比價——誰的路徑最短、屬性最優，就選誰。選定之後，這條 best path 才會被寫入本地的路由表中（RIB，Routing Information Base），成為實際轉送封包所依據的依據。

這個流程不是單次的，而是持續進行的。只要有一方撤銷 prefix（例如內部路由改變），會再次送出 UPDATE 或 WITHDRAW，另一方也會即時更新自己的路由表。這就是為什麼我們說 BGP 是動態路由協定，而且是網際網路路由穩定性的核心。

在 VPN 或內部網路中，也可以透過 `IGP` 交換 private prefix（像是 `10.0.0.0/8`），但這些不會被 propagate 到全球網路，而是限制在特定 session 間使用。

### 🧭 BGP peering 一定是雙向嗎？AS 可以跟任何人建立連線嗎？

你可能會想：「我既然有自己的 ASN，是不是就可以隨便找一個 AS 建 BGP session？」實際上並不行。BGP 是協商性質的協定，你必須獲得對方 AS 的允許，雙方才能建立 peering 關係。

這就像要進行交易，你必須先取得對方同意。每個 AS 都會根據自身策略決定要不要與你對等，像是地理位置、流量平衡、商業利益、技術條件等都是考量因素（技術上則是檢查 ip match / as match / tcp 179 port 是否放行等）。例如，大型 ISP 通常不與小型企業直接 peering，而是提供「transit」服務，由你付費連上他們，讓他們幫你中繼到更多網路。

所以如果你想從 AS1 到 AS3，但無法直接接上，你可能必須透過 AS2 中繼，這就是我們在 BGP 中看到的 AS_PATH = 1 2 3。這段資訊不只是繞路紀錄，更是選路依據與防止 loop 的核心資料。

這也正是為什麼「誰肯幫你轉告 prefix 給誰」這件事非常關鍵。這個策略叫做 routing policy，而不是所有 prefix 都能被 propagate。你可以要求中繼者不要把你的宣告傳出去（如 no-export），或者把某條路做 AS Path prepend，讓它「看起來比較遠」，以此降低別人選用的機率。

### 🪜 為什麼還需要 BGP？IP 和 TCP 不夠嗎？

IP 負責為每個封包指定目的地，TCP 則確保封包可靠地送達，而誰來決定「路怎麼走」是 BGP 的角色。你可能會想：「這不是 route table 在做的事嗎？」沒錯，但 route table 只是結果，而不是產生這些結果的機制。BGP 負責讓不同網域之間互相交換路由資訊，產生並維持這些路由的正確性與穩定性。沒有它，網際網路根本連不在一起。

### 🔁 為什麼 BGP 是 hop-by-hop？不是一次決定好路徑？

一條封包的路徑，是由每一個中繼設備自己決定「下一跳」來累積完成的。每個 prefix 宣告中會附帶 AS Path，讓接收方能判斷封包是否會繞回自己（即 loop），一旦發現自己的 ASN 出現在路徑中，就會拒絕使用這條路徑。這種 hop-by-hop 的決策方式讓整體系統可以分散運作，具備高度容錯性。

### 🏠 為什麼我在家裡從來沒碰過 BGP？

你可能會說：「我從沒設定過什麼 BGP，但上網不是一樣順？」因為你家裡的路由器只需要一條 default route 就能把所有封包交給 ISP。接下來的所有路由選擇，都是由 ISP 與其他自治系統透過 BGP 自動完成的。簡單來說，你是網路的終點，而不是 routing 的參與者。只有當你需要跨站點連線（例如企業總部與分部）、自建 WAN、或接入雲端時，你才會成為 BGP 的一份子。這也是為什麼在 AWS 上你會開始遇到 BGP——那代表你正在參與「網路的邊界」。

### 🧭 為什麼 BGP 只負責 AS 之間？那 AS 內部怎麼做？

BGP 負責的是自治系統之間的資訊交換（稱為 eBGP），但在一個 AS 內部，若有數十台甚至上百台路由器，難道也要手動寫靜態路由？當然不是。這時候，就會由 IGP（如 OSPF、EIGRP）接手，讓內部設備彼此交換路由資訊，自動維持內部拓撲。這樣 BGP 就可以只專注在「告訴其他 AS：我有哪些 prefix 可以提供」，而不是處理內部細節。

### 🌐 Anycast 是什麼？它跟 BGP 有什麼關係？

你可能聽過 DNS 有一個全球共用的 IP（像是 8.8.8.8），卻能連到不同的地點，這是怎麼做到的？答案就是 Anycast。Anycast 是一種建構在 BGP 上的應用策略，讓多個地理位置的節點同時對外宣告相同的 IP prefix，讓封包被導向「拓撲上最近的節點」。

這裡的「最近」不是指物理距離，而是 BGP 認為的路由成本最短。也就是說，不同地區的使用者會透過不同的路徑，被 BGP 自動導向離他們最近的 Anycast 節點，而這一切是由 BGP 的選路機制所驅動。

Anycast 可以讓全球使用者都用同一 IP，而不需要設計 DNS 對應邏輯，同時具備：

- 快速接入：封包就近送達，提高延遲表現。
- 自動容錯：節點下線時，BGP 自動把流量轉向其他節點。
- 大量分流：DDoS 攻擊可以分散進多個節點，而不是灌爆單點。
  > 就像是 Google Map 的「有更快路線可供選擇」。

常見應用包含 Google DNS（8.8.8.8）、Cloudflare CDN、L-root、AWS Global Accelerator 等。你可能會問：「這樣封包回程會不會走另一條路？」是的，Anycast 是非對稱路由模型，請求與回應可能經過不同節點，這在診斷時要特別注意。

---

## 🛠️ AWS 除錯 SOP

以下是一個系統性的排查流程，當你在 AWS 架構下（例如 Site-to-Site VPN、Direct Connect）遇到無法從 on-prem 到 VPC、或是 BGP 沒學到 prefix 的問題時，可以依照這個順序排查。

### 🔍 步驟一：確認 BGP Session 是否建立成功

- **在哪裡看？** 在 on-prem router 或防火牆的介面（如 FortiGate、Cisco、VyOS）上。
- **指標訊號：** BGP session 有 `Established` 狀態。
- **常見錯誤：** IP 不通、TCP port 179 被擋、ASN 設定錯、對等端未上線。

### 🔍 步驟二：雙方是否正確宣告 prefix？

- **在哪裡看？**

  - On-prem 檢查：`show ip bgp` 看 AWS 宣告了哪些 prefix。
  - AWS 端檢查：觀察 VPC route table 是否有自動出現 on-prem 的 route。

- **觀察重點：** Prefix 是否在期望範圍內？是 /16 還是太小被過濾掉？（AWS 對 prefix 最小長度有限制）

你可能會忽略：宣告 private prefix 沒問題，但如果你錯用 public ASN 宣告 private prefix，對方有可能過濾掉。

### 🔍 步驟三：Route Table 有正確接收 Propagation 嗎？

- **觀察 VPC Route Table：** 是否有連到 VGW 的 route？是否打開了 propagation？
- **反向也要檢查：** on-prem 是否有從 BGP 學到回 AWS 的 prefix，否則封包出得去，回不來。

你可能會問：「AWS 上的 propagation 是不是自動的？」是的，但前提是你有啟用 propagation 權限，且對應的 VGW 與 VPN Connection 設定正確。

### 🔍 步驟四：封包真的出得去、回得來嗎？

- **VPC Flow Logs** 是你最好的朋友。你可以觀察封包是否真的送出了、是否有 ACK 回來。
- **Security Group 與 NACL** 雖然不是 routing 的一部分，但會影響封包是否能被接受。

如果你看到封包從 EC2 出去了，但沒有回來，那可能是 on-prem 沒有 route、沒宣告、沒 NAT、或防火牆擋住了。

### 📌 小結

| 檢查項目                          | 檢查點            | 工具或指令                                            |
| --------------------------------- | ----------------- | ----------------------------------------------------- |
| BGP Session 是否成立              | VPN 對等端        | `show ip bgp summary` 或 CloudWatch VPN Tunnel Metric |
| Prefix 是否有交換成功             | 雙方路由表        | `show ip bgp`、VPC route table                        |
| Route table 是否 propagation 正確 | AWS VPC           | Route table 頁面 + propagation status                 |
| 封包是否走得出去回得來            | Flow Logs／抓封包 | Flow logs、EC2 log、Firewall log                      |

這個流程的目的不是要你記住所有設定，而是訓練你具備一個 mental model：BGP 是建立資訊，Route Table 是轉送依據，封包是否可達是最終驗證。

---

## 🧠 延伸：經營自治系統的商業模式

自治系統（AS）通常是由 ISP、雲端、CDN、網安業者等角色經營。要營運一個自治系統，你必須具備：

1. **合法的 ASN**：向區域網路註冊管理機構（RIR）如 APNIC、ARIN 申請。
2. **自有或取得的 IP 空間**：可以是 IPv4 或 IPv6，多為 public prefix。
3. **上游（upstream）連線夥伴**：與 ISP 或 IX（Internet Exchange）建立 BGP peering。
4. **路由控管與監控能力**：配置 BGP policy、route filter、防止 prefix leak、設定 RPKI 等。

### 💡 常見營運情境

| 類型          | 角色與行為                                          |
| ------------- | --------------------------------------------------- |
| ISP／電信商   | 宣告大量客戶的 prefix，接收數百條 peering。         |
| 跨國企業      | 控制企業 WAN／VPN，使用多個 DX／ISP、做流量最適化。 |
| CDN／雲端平台 | 透過 Anycast + BGP 提供全球低延遲接入點。           |
| DDoS 防禦商   | 使用 BGP diversion 技術將流量導向清洗中心。         |
| 教育研究單位  | 參與學術 IX（如 TWAREN）、共享路由資源。            |

---

### 💰 如何透過自治系統獲利？

1. **販售頻寬與 transit**：你可以成為其他小型 AS 的上游。
2. **提供 DDoS 緩解／流量清洗服務**：結合 BGP diversion 與清洗設備。
3. **成為 CDN 節點或雲服務轉運點**：與內容平台合作，提供地區性快取。
4. **管理複數 BGP 出口做成本優化**：透過 routing policy 將非關鍵流量導出廉價路。

> 在這個以應用為核心的時代，控制底層封包的進出口，仍是一種極高的技術優勢與談判籌碼。

---

# 🧪 Hands-on Lab

## 🔍 用 FRR 模擬兩個 AS 透過 BGP 交換路由

FRR（Free Range Routing）是一套開源的動態路由協定套件，支援包括 BGP、OSPF、RIP、IS-IS 等協定，廣泛用於 Linux router 模擬與網路實驗中。

它的架構採用模組化設計，主要元件包括：

- `zebra`：FRR 的核心守護程序，管理 routing table 與 interface 狀態，其他 daemon 都透過它與 kernel 互動。
- `bgpd`：負責 BGP 協定的實作與運作。
- `vtysh`：互動式 shell，提供統一 CLI 介面，可同時存取所有 daemon（例如 bgpd、zebra）。

### 操作

1. `$ docker compose up`
1. `$ docker exec -it router1 vtysh`
1. `$ show ip bgp summary`

   ```
   IPv4 Unicast Summary (VRF default):
   BGP router identifier 1.1.1.1, local AS number 65001 vrf-id 0
   BGP table version 2
   RIB entries 3, using 576 bytes of memory
   Peers 1, using 717 KiB of memory

   Neighbor        V         AS   MsgRcvd   MsgSent   TblVer  InQ OutQ  Up/Down State/PfxRcd   PfxSnt Desc
   172.31.253.9    4      65002        11        12        0    0    0 00:00:02            1        2 N/A

   Total number of neighbors 1
   ```

   - **Neighbor**：對等端 IP
   - **V**：BGP 協定版本（通常為 4）
   - **AS**：對等端的 Autonomous System Number
   - **MsgRcvd / MsgSent**：從對等端接收與送出的 BGP 訊息數量
   - **TblVer**：本地 RIB（Routing Information Base）的版本號
   - **InQ / OutQ**：尚未處理的 BGP 封包數（正常為 0）
   - **Up/Down**：BGP session 維持的時間，若不為 0 表示已建立
   - **State/PfxRcd**：若為 `Established`，此欄會顯示學到的 prefix 數；若為 `(Policy)` 表示有 prefix 被 policy 擋下
   - **PfxSnt**：本機送出給該 neighbor 的 prefix 數
   - **Desc**：備註，可自定義

1. `$ show ip bgp`

   ```
   BGP table version is 2, local router ID is 1.1.1.1, vrf id 0
   Default local pref 100, local AS 65001
   Status codes:  s suppressed, d damped, h history, * valid, > best, = multipath,
                 i internal, r RIB-failure, S Stale, R Removed
   Nexthop codes: @NNN nexthop's vrf id, < announce-nh-self
   Origin codes:  i - IGP, e - EGP, ? - incomplete
   RPKI validation codes: V valid, I invalid, N Not found

     Network          Next Hop            Metric LocPrf Weight Path
   *> 10.10.10.0/24    0.0.0.0                  0         32768 i
   *> 20.20.20.0/24    172.31.253.9             0             0 65002 i

   Displayed  2 routes and 2 total paths
   ```

   可以看到除了 prefix `20.20.20.0/24` 已經指向 router2。
