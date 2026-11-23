---
pointId: kp-utilization
---

## RTT {#utilization-rtt}

<!-- kb-utilization-rtt-1 -->
**RTT**（Round-Trip Time）指发送方发完数据到收到接收方确认所经历的时间。包括来回传播时延、接收方处理时延和确认帧发送时延，**不含数据帧发送时延**。

<!-- kb-utilization-rtt-2 -->
题目说"忽略确认帧长度和处理时延"时，$\text{RTT} = 2 \times \text{传播时延}$。两个传播时延之和可能远大于发送时延，因此 RTT 主要由距离决定。

<!-- kb-utilization-rtt-3 -->
:::html
<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg">
  <style>text{font-family:system-ui,sans-serif;font-size:9px}</style>

  <line x1="130" y1="38" x2="130" y2="260" stroke="#6b7280" stroke-width="1.2"/>
  <line x1="430" y1="38" x2="430" y2="260" stroke="#6b7280" stroke-width="1.2"/>
  <text x="130" y="32" fill="#374151" font-weight="600" font-size="11" text-anchor="middle">发送方</text>
  <text x="430" y="32" fill="#374151" font-weight="600" font-size="11" text-anchor="middle">接收方</text>

  <!-- 前提标注 -->
  <text x="280" y="22" fill="#9ca3af" font-size="9" text-anchor="middle">忽略确认帧长度、处理时延</text>

  <!-- 数据帧 -->
  <polygon points="130,48 130,100 430,156 430,104" fill="#dbeafe" fill-opacity="0.25" stroke="#2563eb" stroke-width="1"/>
  <line x1="130" y1="48" x2="430" y2="104" stroke="#2563eb" stroke-width="0.8"/>
  <line x1="130" y1="100" x2="430" y2="156" stroke="#2563eb" stroke-width="0.8"/>

  <!-- 发送时延 -->
  <line x1="130" y1="48" x2="114" y2="48" stroke="#2563eb" stroke-width="1.2"/>
  <line x1="130" y1="100" x2="114" y2="100" stroke="#2563eb" stroke-width="1.2"/>
  <text x="122" y="58" fill="#1e40af" font-weight="600" font-size="10" text-anchor="middle">
    <tspan x="122" dy="0">发</tspan><tspan x="122" dy="11">送</tspan><tspan x="122" dy="11">时</tspan><tspan x="122" dy="11">延</tspan>
  </text>

  <!-- 数据传播 -->
  <line x1="130" y1="48" x2="430" y2="48" stroke="#059669" stroke-width="0.7" stroke-dasharray="4,3"/>
  <line x1="430" y1="48" x2="446" y2="48" stroke="#059669" stroke-width="1.2"/>
  <line x1="430" y1="104" x2="446" y2="104" stroke="#059669" stroke-width="1.2"/>
  <text x="438" y="60" fill="#059669" font-weight="600" font-size="10" text-anchor="middle">
    <tspan x="438" dy="0">传</tspan><tspan x="438" dy="11">播</tspan><tspan x="438" dy="11">时</tspan><tspan x="438" dy="11">延</tspan>
  </text>

  <!-- 接收 -->
  <line x1="430" y1="104" x2="446" y2="104" stroke="#94a3b8" stroke-width="0.7"/>
  <line x1="430" y1="156" x2="446" y2="156" stroke="#94a3b8" stroke-width="0.7"/>
  <text x="438" y="116" fill="#64748b" font-size="9" text-anchor="middle">
    <tspan x="438" dy="0">接</tspan><tspan x="438" dy="11">收</tspan>
  </text>

  <!-- ACK 返回（无帧长，仅传播） -->
  <line x1="430" y1="156" x2="130" y2="212" stroke="#db2777" stroke-width="1" stroke-dasharray="5,3"/>

  <!-- ACK 传播 -->
  <line x1="130" y1="156" x2="114" y2="156" stroke="#059669" stroke-width="1"/>
  <line x1="130" y1="212" x2="114" y2="212" stroke="#059669" stroke-width="1"/>
  <text x="122" y="168" fill="#059669" font-weight="600" font-size="9" text-anchor="middle">
    <tspan x="122" dy="0">传</tspan><tspan x="122" dy="10">播</tspan><tspan x="122" dy="10">时</tspan><tspan x="122" dy="10">延</tspan>
  </text>

  <!-- RTT 括号（发完之后到收到 ACK） -->
  <line x1="98" y1="100" x2="98" y2="212" stroke="#374151" stroke-width="1.2"/>
  <line x1="92" y1="100" x2="104" y2="100" stroke="#374151" stroke-width="1"/>
  <line x1="92" y1="212" x2="104" y2="212" stroke="#374151" stroke-width="1"/>
  <text x="86" y="162" fill="#374151" font-weight="700" font-size="10" transform="rotate(-90,86,162)">RTT = 2×传播时延</text>

  <line x1="130" y1="260" x2="130" y2="274" stroke="#6b7280" stroke-width="1" marker-end="url(#td)"/>
  <line x1="430" y1="260" x2="430" y2="274" stroke="#6b7280" stroke-width="1" marker-end="url(#td)"/>
  <text x="130" y="286" fill="#6b7280" font-size="9" text-anchor="middle">时间</text>
  <text x="430" y="286" fill="#6b7280" font-size="9" text-anchor="middle">时间</text>

  <defs><marker id="td" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280"/></marker></defs>
</svg>
:::

## 信道利用率 {#utilization-channel}

<!-- kb-utilization-channel-1 -->
**信道利用率** $= \frac{\text{发送方实际发送数据的时间}}{\text{发送周期总时间}}$。每发一帧的周期 $= T_{\text{发送}} + \text{RTT}$（发送用时 + 等待确认用时），其中只有 $T_{\text{发送}}$ 在做有用功，其余时间链路空转。

<!-- kb-utilization-channel-3 -->
:::html
<svg viewBox="0 0 560 360" xmlns="http://www.w3.org/2000/svg">
  <style>text{font-family:system-ui,sans-serif;font-size:9px}</style>

  <line x1="130" y1="38" x2="130" y2="320" stroke="#6b7280" stroke-width="1.2"/>
  <line x1="430" y1="38" x2="430" y2="320" stroke="#6b7280" stroke-width="1.2"/>
  <text x="130" y="32" fill="#374151" font-weight="600" font-size="11" text-anchor="middle">发送方</text>
  <text x="430" y="32" fill="#374151" font-weight="600" font-size="11" text-anchor="middle">接收方</text>

  <!-- 数据帧 平行四边形 -->
  <polygon points="130,50 130,104 430,160 430,106" fill="#dbeafe" fill-opacity="0.25" stroke="#2563eb" stroke-width="1"/>
  <line x1="130" y1="50" x2="430" y2="106" stroke="#2563eb" stroke-width="0.8"/>
  <line x1="130" y1="104" x2="430" y2="160" stroke="#2563eb" stroke-width="0.8"/>

  <!-- 发送时延 -->
  <line x1="130" y1="50" x2="114" y2="50" stroke="#2563eb" stroke-width="1.2"/>
  <line x1="130" y1="104" x2="114" y2="104" stroke="#2563eb" stroke-width="1.2"/>
  <text x="122" y="60" fill="#1e40af" font-weight="600" font-size="10" text-anchor="middle">
    <tspan x="122" dy="0">发</tspan><tspan x="122" dy="11">送</tspan><tspan x="122" dy="11">时</tspan><tspan x="122" dy="11">延</tspan>
  </text>

  <!-- 数据传播 y=50→106 -->
  <line x1="130" y1="50" x2="430" y2="50" stroke="#059669" stroke-width="0.7" stroke-dasharray="4,3"/>
  <line x1="430" y1="50" x2="446" y2="50" stroke="#059669" stroke-width="1.2"/>
  <line x1="430" y1="106" x2="446" y2="106" stroke="#059669" stroke-width="1.2"/>
  <text x="438" y="60" fill="#059669" font-weight="600" font-size="10" text-anchor="middle">
    <tspan x="438" dy="0">传</tspan><tspan x="438" dy="11">播</tspan><tspan x="438" dy="11">时</tspan><tspan x="438" dy="11">延</tspan>
  </text>

  <!-- 接收方处理 y=106→160 -->
  <line x1="430" y1="106" x2="446" y2="106" stroke="#94a3b8" stroke-width="0.7"/>
  <line x1="430" y1="160" x2="446" y2="160" stroke="#94a3b8" stroke-width="0.7"/>
  <text x="438" y="118" fill="#64748b" font-size="9" text-anchor="middle">
    <tspan x="438" dy="0">接</tspan><tspan x="438" dy="11">收</tspan>
  </text>

  <!-- ACK 帧 平行四边形（从接收方回发送方） -->
  <polygon points="430,172 430,184 130,238 130,226" fill="#fce7f3" fill-opacity="0.4" stroke="#db2777" stroke-width="0.8" stroke-dasharray="4,3"/>
  <line x1="430" y1="172" x2="130" y2="226" stroke="#db2777" stroke-width="0.7" stroke-dasharray="4,3"/>
  <line x1="430" y1="184" x2="130" y2="238" stroke="#db2777" stroke-width="0.7" stroke-dasharray="4,3"/>

  <!-- ACK 发送（接收方） -->
  <line x1="430" y1="172" x2="446" y2="172" stroke="#db2777" stroke-width="0.8"/>
  <line x1="430" y1="184" x2="446" y2="184" stroke="#db2777" stroke-width="0.8"/>
  <text x="438" y="179" fill="#9d174d" font-size="9" text-anchor="middle">ACK</text>

  <!-- ACK 传播回发送方 -->
  <line x1="430" y1="172" x2="130" y2="172" stroke="#059669" stroke-width="0.6" stroke-dasharray="3,3"/>
  <line x1="130" y1="172" x2="114" y2="172" stroke="#059669" stroke-width="1"/>
  <line x1="130" y1="226" x2="114" y2="226" stroke="#059669" stroke-width="1"/>
  <text x="122" y="182" fill="#059669" font-weight="600" font-size="9" text-anchor="middle">
    <tspan x="122" dy="0">传</tspan><tspan x="122" dy="10">播</tspan><tspan x="122" dy="10">时</tspan><tspan x="122" dy="10">延</tspan>
  </text>

  <!-- 发送方收到 ACK -->
  <line x1="130" y1="226" x2="114" y2="226" stroke="#94a3b8" stroke-width="0.7"/>
  <line x1="130" y1="238" x2="114" y2="238" stroke="#94a3b8" stroke-width="0.7"/>
  <text x="122" y="233" fill="#64748b" font-size="8" text-anchor="middle">收ACK</text>

  <!-- 发送周期标注 -->
  <line x1="98" y1="50" x2="98" y2="238" stroke="#374151" stroke-width="1.2"/>
  <line x1="92" y1="50" x2="104" y2="50" stroke="#374151" stroke-width="1"/>
  <line x1="92" y1="238" x2="104" y2="238" stroke="#374151" stroke-width="1"/>
  <text x="86" y="150" fill="#374151" font-weight="700" font-size="10" transform="rotate(-90,86,150)">T发送 + RTT</text>

  <!-- 利用率公式 -->
  <text x="280" y="295" fill="#374151" font-weight="700" font-size="12" text-anchor="middle">U = T发送 / (T发送+RTT)</text>
  <text x="280" y="313" fill="#6b7280" font-size="10" text-anchor="middle">发送时延是有效工作时间，其余都是等待</text>

  <line x1="130" y1="320" x2="130" y2="334" stroke="#6b7280" stroke-width="1" marker-end="url(#tc)"/>
  <line x1="430" y1="320" x2="430" y2="334" stroke="#6b7280" stroke-width="1" marker-end="url(#tc)"/>
  <text x="130" y="346" fill="#6b7280" font-size="9" text-anchor="middle">时间</text>
  <text x="430" y="346" fill="#6b7280" font-size="9" text-anchor="middle">时间</text>

  <defs><marker id="tc" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280"/></marker></defs>
</svg>
:::
