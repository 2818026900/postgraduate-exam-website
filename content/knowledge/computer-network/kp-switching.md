---
pointId: kp-switching
---

## 三种交换方式对比 {#switching-compare}

<!-- kb-switching-compare-1 -->
| 特性 | 电路交换 | 报文交换 | 分组交换 |
|------|----------|----------|----------|
| 连接建立 | 需要，有建立时延 | 不需要 | 不需要 |
| 传输单位 | 比特流 | 整个报文 | 分组（包） |
| 存储转发 | 无，直达 | 有，逐结点 | 有，逐结点 |
| 转发时机 | **不转发，直通** | **收完整个报文再转发** | **收完一个分组即可转发** |
| 专用链路 | 是（通话期间独占） | 否（共享） | 否（共享） |
| 传输时延 | 最小（直通） | 最大（整个报文逐结点转发） | 较小（分组可以流水线） |
| 差错控制 | 无 | 可逐结点检查 | 可逐结点检查 |

## 三种交换的时延对比 {#switching-packet}

<!-- kb-switching-packet-1 -->
**存储转发**是报文交换和分组交换的共同特征：每个结点必须收完整个报文或分组后才能向下一结点转发。电路交换没有存储转发：连接建立后数据直通，结点只做电路切换。

<!-- kb-switching-packet-2 -->
**例** H1 将数据分成 3 个等长分组，经 1 台路由器 R 发送给 H2。两段链路速率相同，每个分组的发送时延为 $\tau$。忽略传播时延和处理时延。

<!-- kb-switching-packet-3 -->
:::html
<svg viewBox="0 0 960 380" xmlns="http://www.w3.org/2000/svg">
  <style>text{font-family:system-ui,sans-serif;font-size:8px}</style>

  <line x1="318" y1="18" x2="318" y2="352" stroke="#d1d5db" stroke-width="0.7" stroke-dasharray="4,4"/>
  <line x1="636" y1="18" x2="636" y2="352" stroke="#d1d5db" stroke-width="0.7" stroke-dasharray="4,4"/>

  <!-- ===== 左：电路交换 ===== -->
  <text x="159" y="18" fill="#374151" font-weight="700" font-size="11" text-anchor="middle">电路交换</text>

  <line x1="35" y1="32" x2="35" y2="340" stroke="#6b7280" stroke-width="1"/>
  <line x1="145" y1="32" x2="145" y2="340" stroke="#6b7280" stroke-width="1"/>
  <line x1="255" y1="32" x2="255" y2="340" stroke="#6b7280" stroke-width="1"/>
  <text x="35" y="26" fill="#374151" font-weight="600" font-size="9" text-anchor="middle">H1</text>
  <text x="145" y="26" fill="#374151" font-weight="600" font-size="9" text-anchor="middle">交换机</text>
  <text x="255" y="26" fill="#374151" font-weight="600" font-size="9" text-anchor="middle">H2</text>

  <!-- 建立连接：请求过去 + 应答回来 = RTT -->
  <line x1="35" y1="42" x2="145" y2="48" stroke="#d97706" stroke-width="1" marker-end="url(#ar)"/>
  <line x1="145" y1="48" x2="255" y2="54" stroke="#d97706" stroke-width="1" marker-end="url(#ar)"/>
  <text x="90" y="41" fill="#92400e" font-size="7" text-anchor="middle">请求</text>
  <text x="200" y="47" fill="#92400e" font-size="7" text-anchor="middle">请求</text>
  <line x1="255" y1="60" x2="145" y2="66" stroke="#d97706" stroke-width="0.7" stroke-dasharray="3,2" marker-end="url(#arl)"/>
  <line x1="145" y1="66" x2="35" y2="72" stroke="#d97706" stroke-width="0.7" stroke-dasharray="3,2" marker-end="url(#arl)"/>
  <text x="200" y="65" fill="#92400e" font-size="7" text-anchor="middle">应答</text>
  <text x="90" y="75" fill="#92400e" font-size="7" text-anchor="middle">应答</text>

  <!-- RTT 括号 -->
  <line x1="15" y1="42" x2="15" y2="72" stroke="#d97706" stroke-width="0.9"/>
  <line x1="9" y1="42" x2="21" y2="42" stroke="#d97706" stroke-width="0.6"/>
  <line x1="9" y1="72" x2="21" y2="72" stroke="#d97706" stroke-width="0.6"/>
  <text x="8" y="57" fill="#92400e" font-weight="700" font-size="9" transform="rotate(-90,8,57)">RTT</text>

  <!-- 数据传输 -->
  <polygon points="35,80 35,120 145,126 145,86" fill="#fef3c7" fill-opacity="0.4" stroke="#d97706" stroke-width="1"/>
  <polygon points="145,86 145,126 255,132 255,92" fill="#fef3c7" fill-opacity="0.4" stroke="#d97706" stroke-width="1"/>

  <line x1="35" y1="80" x2="19" y2="80" stroke="#d97706" stroke-width="0.9"/>
  <line x1="35" y1="120" x2="19" y2="120" stroke="#d97706" stroke-width="0.9"/>
  <text x="27" y="94" fill="#92400e" font-weight="600" font-size="8" text-anchor="middle"><tspan x="27" dy="0">发</tspan><tspan x="27" dy="10">送</tspan></text>

  <!-- 释放 -->
  <line x1="35" y1="240" x2="19" y2="240" stroke="#d97706" stroke-width="0.9"/>
  <line x1="35" y1="258" x2="19" y2="258" stroke="#d97706" stroke-width="0.9"/>
  <text x="27" y="249" fill="#92400e" font-weight="600" font-size="8" text-anchor="middle"><tspan x="27" dy="0">释</tspan><tspan x="27" dy="10">放</tspan></text>

  <line x1="35" y1="340" x2="35" y2="354" stroke="#6b7280" stroke-width="0.7" marker-end="url(#ta)"/>
  <line x1="145" y1="340" x2="145" y2="354" stroke="#6b7280" stroke-width="0.7" marker-end="url(#ta)"/>
  <line x1="255" y1="340" x2="255" y2="354" stroke="#6b7280" stroke-width="0.7" marker-end="url(#ta)"/>
  <text x="35" y="366" fill="#6b7280" font-size="8" text-anchor="middle">时间</text>
  <text x="145" y="366" fill="#6b7280" font-size="8" text-anchor="middle">时间</text>
  <text x="255" y="366" fill="#6b7280" font-size="8" text-anchor="middle">时间</text>
  <text x="145" y="340" fill="#d97706" font-size="9" text-anchor="middle">交换机只做电路切换，不存储</text>

  <!-- ===== 中：报文交换 ===== -->
  <text x="477" y="18" fill="#374151" font-weight="700" font-size="11" text-anchor="middle">报文交换</text>

  <line x1="355" y1="32" x2="355" y2="340" stroke="#6b7280" stroke-width="1"/>
  <line x1="465" y1="32" x2="465" y2="340" stroke="#6b7280" stroke-width="1"/>
  <line x1="575" y1="32" x2="575" y2="340" stroke="#6b7280" stroke-width="1"/>
  <text x="355" y="26" fill="#374151" font-weight="600" font-size="9" text-anchor="middle">H1</text>
  <text x="465" y="26" fill="#374151" font-weight="600" font-size="9" text-anchor="middle">R（路由器）</text>
  <text x="575" y="26" fill="#374151" font-weight="600" font-size="9" text-anchor="middle">H2</text>

  <polygon points="355,42 355,162 465,168 465,48" fill="#fecaca" fill-opacity="0.35" stroke="#dc2626" stroke-width="1"/>
  <line x1="355" y1="42" x2="465" y2="48" stroke="#dc2626" stroke-width="0.6"/>
  <line x1="355" y1="162" x2="465" y2="168" stroke="#dc2626" stroke-width="0.6"/>

  <polygon points="465,168 465,288 575,294 575,174" fill="#fecaca" fill-opacity="0.35" stroke="#dc2626" stroke-width="1"/>
  <line x1="465" y1="168" x2="575" y2="174" stroke="#dc2626" stroke-width="0.6"/>
  <line x1="465" y1="288" x2="575" y2="294" stroke="#dc2626" stroke-width="0.6"/>

  <line x1="355" y1="42" x2="339" y2="42" stroke="#dc2626" stroke-width="0.9"/>
  <line x1="355" y1="162" x2="339" y2="162" stroke="#dc2626" stroke-width="0.9"/>
  <text x="347" y="85" fill="#991b1b" font-weight="600" font-size="8" text-anchor="middle"><tspan x="347" dy="0">发</tspan><tspan x="347" dy="9">送</tspan><tspan x="347" dy="9">3τ</tspan></text>

  <line x1="575" y1="168" x2="591" y2="168" stroke="#dc2626" stroke-width="0.9"/>
  <line x1="575" y1="288" x2="591" y2="288" stroke="#dc2626" stroke-width="0.9"/>
  <text x="583" y="211" fill="#991b1b" font-weight="600" font-size="8" text-anchor="middle"><tspan x="583" dy="0">发</tspan><tspan x="583" dy="9">送</tspan><tspan x="583" dy="9">3τ</tspan></text>

  <line x1="355" y1="340" x2="355" y2="354" stroke="#6b7280" stroke-width="0.7" marker-end="url(#ta)"/>
  <line x1="465" y1="340" x2="465" y2="354" stroke="#6b7280" stroke-width="0.7" marker-end="url(#ta)"/>
  <line x1="575" y1="340" x2="575" y2="354" stroke="#6b7280" stroke-width="0.7" marker-end="url(#ta)"/>
  <text x="355" y="366" fill="#6b7280" font-size="8" text-anchor="middle">时间</text>
  <text x="465" y="366" fill="#6b7280" font-size="8" text-anchor="middle">时间</text>
  <text x="575" y="366" fill="#6b7280" font-size="8" text-anchor="middle">时间</text>
  <text x="465" y="340" fill="#dc2626" font-size="9" text-anchor="middle">收完整个报文才转发，R 空闲 3τ</text>

  <!-- ===== 右：分组交换 ===== -->
  <text x="795" y="18" fill="#374151" font-weight="700" font-size="11" text-anchor="middle">分组交换</text>

  <line x1="673" y1="32" x2="673" y2="340" stroke="#6b7280" stroke-width="1"/>
  <line x1="783" y1="32" x2="783" y2="340" stroke="#6b7280" stroke-width="1"/>
  <line x1="893" y1="32" x2="893" y2="340" stroke="#6b7280" stroke-width="1"/>
  <text x="673" y="26" fill="#374151" font-weight="600" font-size="9" text-anchor="middle">H1</text>
  <text x="783" y="26" fill="#374151" font-weight="600" font-size="9" text-anchor="middle">R（路由器）</text>
  <text x="893" y="26" fill="#374151" font-weight="600" font-size="9" text-anchor="middle">H2</text>

  <polygon points="673,42 673,82 783,88 783,48" fill="#dbeafe" fill-opacity="0.3" stroke="#2563eb" stroke-width="0.9"/>
  <line x1="673" y1="42" x2="783" y2="48" stroke="#2563eb" stroke-width="0.6"/>
  <line x1="673" y1="82" x2="783" y2="88" stroke="#2563eb" stroke-width="0.6"/>
  <text x="728" y="63" fill="#1e40af" font-weight="600" font-size="8" text-anchor="middle">G1</text>

  <polygon points="673,82 673,122 783,128 783,88" fill="#dbeafe" fill-opacity="0.3" stroke="#2563eb" stroke-width="0.9"/>
  <line x1="673" y1="82" x2="783" y2="88" stroke="#2563eb" stroke-width="0.6"/>
  <line x1="673" y1="122" x2="783" y2="128" stroke="#2563eb" stroke-width="0.6"/>
  <text x="728" y="103" fill="#1e40af" font-weight="600" font-size="8" text-anchor="middle">G2</text>

  <polygon points="673,122 673,162 783,168 783,128" fill="#dbeafe" fill-opacity="0.3" stroke="#2563eb" stroke-width="0.9"/>
  <line x1="673" y1="122" x2="783" y2="128" stroke="#2563eb" stroke-width="0.6"/>
  <line x1="673" y1="162" x2="783" y2="168" stroke="#2563eb" stroke-width="0.6"/>
  <text x="728" y="143" fill="#1e40af" font-weight="600" font-size="8" text-anchor="middle">G3</text>

  <polygon points="783,88 783,128 893,134 893,94" fill="#dbeafe" fill-opacity="0.3" stroke="#2563eb" stroke-width="0.9"/>
  <line x1="783" y1="88" x2="893" y2="94" stroke="#2563eb" stroke-width="0.6"/>
  <line x1="783" y1="128" x2="893" y2="134" stroke="#2563eb" stroke-width="0.6"/>
  <text x="838" y="111" fill="#1e40af" font-weight="600" font-size="8" text-anchor="middle">G1</text>

  <polygon points="783,128 783,168 893,174 893,134" fill="#dbeafe" fill-opacity="0.3" stroke="#2563eb" stroke-width="0.9"/>
  <line x1="783" y1="128" x2="893" y2="134" stroke="#2563eb" stroke-width="0.6"/>
  <line x1="783" y1="168" x2="893" y2="174" stroke="#2563eb" stroke-width="0.6"/>
  <text x="838" y="151" fill="#1e40af" font-weight="600" font-size="8" text-anchor="middle">G2</text>

  <polygon points="783,168 783,208 893,214 893,174" fill="#dbeafe" fill-opacity="0.3" stroke="#2563eb" stroke-width="0.9"/>
  <line x1="783" y1="168" x2="893" y2="174" stroke="#2563eb" stroke-width="0.6"/>
  <line x1="783" y1="208" x2="893" y2="214" stroke="#2563eb" stroke-width="0.6"/>
  <text x="838" y="191" fill="#1e40af" font-weight="600" font-size="8" text-anchor="middle">G3</text>

  <line x1="673" y1="42" x2="657" y2="42" stroke="#2563eb" stroke-width="0.9"/>
  <line x1="673" y1="162" x2="657" y2="162" stroke="#2563eb" stroke-width="0.9"/>
  <text x="665" y="85" fill="#1e40af" font-weight="600" font-size="8" text-anchor="middle"><tspan x="665" dy="0">发</tspan><tspan x="665" dy="9">送</tspan><tspan x="665" dy="9">3τ</tspan></text>

  <line x1="673" y1="340" x2="673" y2="354" stroke="#6b7280" stroke-width="0.7" marker-end="url(#ta)"/>
  <line x1="783" y1="340" x2="783" y2="354" stroke="#6b7280" stroke-width="0.7" marker-end="url(#ta)"/>
  <line x1="893" y1="340" x2="893" y2="354" stroke="#6b7280" stroke-width="0.7" marker-end="url(#ta)"/>
  <text x="673" y="366" fill="#6b7280" font-size="8" text-anchor="middle">时间</text>
  <text x="783" y="366" fill="#6b7280" font-size="8" text-anchor="middle">时间</text>
  <text x="893" y="366" fill="#6b7280" font-size="8" text-anchor="middle">时间</text>
  <text x="783" y="340" fill="#2563eb" font-size="9" text-anchor="middle">收完一个分组即可转发，流水线并行</text>

  <defs>
    <marker id="ta" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280"/></marker>
    <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 2 L 10 5 L 0 8 z" fill="#d97706"/></marker>
    <marker id="arl" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 10 2 L 0 5 L 10 8 z" fill="#d97706"/></marker>
  </defs>
</svg>
:::

## 数据报与虚电路 {#switching-datagram-vc}

<!-- kb-switching-dv-1 -->
分组交换网络提供两种服务：**数据报**和**虚电路**。

**数据报**是无连接方式：每个分组独立路由，同一通信的不同分组可能走不同路径到达。

**虚电路**是面向连接方式：先建立一条逻辑连接，所有分组沿同一条路径顺序到达。

<!-- kb-switching-dv-2 -->
| 特性 | 数据报 | 虚电路 |
|------|--------|--------|
| 连接建立 | 不需要 | 需要建立虚电路 |
| 路由方式 | 每个分组独立路由 | 建立后所有分组沿同一路径 |
| 分组顺序 | **可能乱序到达**| **按序到达**|
| 地址开销 | **每个分组携带完整目的地址** | **每个分组只携带虚电路号** |
| 结点故障 | 可绕行，健壮 | 虚电路中断，需重建 |
| 典型协议 | IP | X.25、ATM、帧中继 |

<!-- kb-switching-dv-3 -->
电路交换在物理层独占信道，独享链路。

虚电路是网络层逻辑连接，只保证分组沿同一路径转发。虚电路不独占带宽，链路利用率远高于电路交换。
