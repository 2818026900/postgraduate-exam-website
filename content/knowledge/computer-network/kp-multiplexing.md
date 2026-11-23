---
pointId: kp-multiplexing
---

## 多路复用 {#multiplexing-basics}

<!-- kb-multiplexing-basics-1 -->
**多路复用**让多路信号共享同一条物理链路，在逻辑上看起来各自独占信道。做法是把链路资源（时间、频率、波长等）分割成互不重叠的子信道，分配给不同用户。

## 频分复用 FDM {#multiplexing-fdm}

<!-- kb-multiplexing-fdm-1 -->
**频分复用**将信道总带宽划分为多个互不重叠的子频段，每个子频段分配给一路信号。各路信号**同时传输**，但在**频域上分开**。接收方用带通滤波器分离各路信号。

<!-- kb-multiplexing-fdm-3 -->
:::html
<svg viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .lbl { font-size: 11px; fill: #334155; }
    .dim { font-size: 10px; fill: #64748b; }
    .band { font-size: 12px; font-weight: 600; fill: #1e40af; }
  </style>

  <!-- 频率轴 -->
  <line x1="58" y1="28" x2="58" y2="175" stroke="#1e293b" stroke-width="1.5"/>
  <polygon points="58,20 54,31 62,31" fill="#1e293b"/>
  <text x="42" y="102" class="lbl" text-anchor="middle">频</text>
  <text x="42" y="115" class="lbl" text-anchor="middle">率</text>

  <!-- 时间轴 -->
  <line x1="58" y1="175" x2="470" y2="175" stroke="#1e293b" stroke-width="1.5"/>
  <polygon points="478,175 467,171 467,179" fill="#1e293b"/>
  <text x="470" y="195" class="lbl" text-anchor="end">时间</text>

  <!-- 子信道 3（高频）y=42~78 -->
  <rect x="58" y="42" width="400" height="36" rx="2" fill="#bfdbfe" stroke="#60a5fa" stroke-width="1"/>
  <text x="258" y="64" class="band" fill="#1d4ed8" text-anchor="middle">子信道 3（高频）</text>

  <!-- 保护频带 -->
  <rect x="58" y="78" width="400" height="8" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="0.5"/>
  <text x="465" y="85" class="dim" text-anchor="end">保护频带</text>

  <!-- 子信道 2 y=86~122 -->
  <rect x="58" y="86" width="400" height="36" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
  <text x="258" y="108" class="band" fill="#2563eb" text-anchor="middle">子信道 2</text>

  <!-- 保护频带 -->
  <rect x="58" y="122" width="400" height="8" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="0.5"/>
  <text x="465" y="129" class="dim" text-anchor="end">保护频带</text>

  <!-- 子信道 1（低频）y=130~166 -->
  <rect x="58" y="130" width="400" height="36" rx="2" fill="#eff6ff" stroke="#93c5fd" stroke-width="1"/>
  <text x="258" y="152" class="band" fill="#3b82f6" text-anchor="middle">子信道 1（低频）</text>

  <!-- 标注 -->
  <text x="460" y="215" class="dim" text-anchor="end">各路信号同时传输，频率互不重叠</text>
</svg>
:::

<!-- kb-multiplexing-fdm-2 -->
各路信号的载波频率不同，被调制到不同的频段上。相邻频段之间需留保护频带防止串扰。典型应用：广播电台（各台占用不同频率）、有线电视、ADSL。

## 时分复用 TDM {#multiplexing-tdm}

<!-- kb-multiplexing-tdm-1 -->
**时分复用**将时间划分为固定长度的帧，每帧再划分为固定数量的时隙，每个时隙分配给一路信号。各路信号轮流使用信道，在时域上分开，每个用户在自己的时隙内独占整个带宽。

<!-- kb-multiplexing-tdm-3 -->
:::html
<svg viewBox="0 0 560 270" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .lbl { font-size: 11px; fill: #334155; }
    .dim { font-size: 10px; fill: #64748b; }
    .slot { font-size: 10px; font-weight: 600; }
  </style>

  <!-- ===== 同步 TDM ===== -->
  <text x="28" y="40" class="hdr">同步 TDM（固定分配时隙）</text>

  <!-- TDM 帧 1 -->
  <rect x="28" y="52" width="72" height="32" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
  <text x="64" y="72" class="slot" fill="#1e40af" text-anchor="middle">用户 1</text>
  <rect x="102" y="52" width="72" height="32" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
  <text x="138" y="72" class="slot" fill="#1e40af" text-anchor="middle">用户 2</text>
  <rect x="176" y="52" width="72" height="32" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
  <text x="212" y="72" class="slot" fill="#1e40af" text-anchor="middle">用户 3</text>

  <!-- TDM 帧 2 -->
  <rect x="260" y="52" width="72" height="32" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
  <text x="296" y="72" class="slot" fill="#1e40af" text-anchor="middle">用户 1</text>
  <rect x="334" y="52" width="72" height="32" rx="2" fill="#f1f5f9" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="370" y="72" class="slot" fill="#94a3b8" text-anchor="middle">空闲</text>
  <rect x="408" y="52" width="72" height="32" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
  <text x="444" y="72" class="slot" fill="#1e40af" text-anchor="middle">用户 3</text>

  <!-- TDM 帧括号 -->
  <line x1="28" y1="90" x2="28" y2="98" stroke="#64748b" stroke-width="1"/>
  <line x1="248" y1="90" x2="248" y2="98" stroke="#64748b" stroke-width="1"/>
  <line x1="28" y1="94" x2="248" y2="94" stroke="#64748b" stroke-width="1"/>
  <text x="138" y="111" class="dim" text-anchor="middle">一个 TDM 帧（3 个用户各占一个时隙）</text>

  <!-- 浪费标注 -->
  <text x="370" y="113" class="dim" fill="#dc2626" text-anchor="middle">用户 2 无数据</text>
  <text x="370" y="125" class="dim" fill="#dc2626" text-anchor="middle">时隙白白浪费</text>

  <!-- 分隔线 -->
  <line x1="28" y1="145" x2="530" y2="145" stroke="#e2e8f0" stroke-width="1"/>

  <!-- ===== 统计 TDM ===== -->
  <text x="28" y="172" class="hdr">统计 TDM（按需动态分配）</text>

  <rect x="28" y="184" width="80" height="32" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
  <text x="68" y="199" class="slot" fill="#1e40af" text-anchor="middle">用户 1</text>
  <text x="68" y="212" class="dim" fill="#1e40af" text-anchor="middle">数据</text>

  <rect x="110" y="184" width="80" height="32" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
  <text x="150" y="199" class="slot" fill="#1e40af" text-anchor="middle">用户 3</text>
  <text x="150" y="212" class="dim" fill="#1e40af" text-anchor="middle">数据</text>

  <rect x="192" y="184" width="80" height="32" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
  <text x="232" y="199" class="slot" fill="#1e40af" text-anchor="middle">用户 1</text>
  <text x="232" y="212" class="dim" fill="#1e40af" text-anchor="middle">数据</text>

  <rect x="274" y="184" width="80" height="32" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
  <text x="314" y="199" class="slot" fill="#1e40af" text-anchor="middle">用户 2</text>
  <text x="314" y="212" class="dim" fill="#1e40af" text-anchor="middle">数据</text>

  <rect x="356" y="184" width="80" height="32" rx="2" fill="#dbeafe" stroke="#93c5fd" stroke-width="1"/>
  <text x="396" y="199" class="slot" fill="#1e40af" text-anchor="middle">用户 4</text>
  <text x="396" y="212" class="dim" fill="#1e40af" text-anchor="middle">数据</text>

  <!-- 标注 -->
  <text x="500" y="199" class="dim" text-anchor="end">无数据的用户</text>
  <text x="500" y="212" class="dim" text-anchor="end">不占时隙</text>

  <!-- 附加标注 -->
  <text x="28" y="248" class="dim" fill="#d97706">每时隙需携带地址信息标识用户来源（TDM 靠位置区分，不需要地址）</text>
  <text x="28" y="264" class="dim" fill="#d97706">统计 TDM 下，单个用户的最高速率可远大于平均分配速率</text>
</svg>
:::

<!-- kb-multiplexing-tdm-2 -->
**同步 TDM**：每个时隙固定分配，即使某路无数据也占着时隙不放。

**统计 TDM**：按需分配时隙，有数据的终端才占用，无数据的跳过。利用率高于同步 TDM，但需要额外地址信息标识数据来源。

## 波分复用 WDM {#multiplexing-wdm}

<!-- kb-multiplexing-wdm-1 -->
**波分复用**是频分复用在光纤上的变体：将不同波长的光信号合并到同一根光纤中传输，接收端用光滤波器分离。光的波长与频率一一对应（$c = \lambda f$），波长不同即频率不同。

<!-- kb-multiplexing-wdm-2 -->
:::html
<svg viewBox="0 0 540 210" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 13px; font-weight: 700; fill: #1e293b; }
    .lbl { font-size: 11px; fill: #334155; }
    .dim { font-size: 10px; fill: #64748b; }
  </style>

  <!-- 输入波长 -->
  <text x="26" y="62" class="lbl" fill="#dc2626" text-anchor="end" font-weight="600">λ₁</text>
  <line x1="34" y1="58" x2="115" y2="58" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>

  <text x="26" y="98" class="lbl" fill="#16a34a" text-anchor="end" font-weight="600">λ₂</text>
  <line x1="34" y1="94" x2="115" y2="94" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>

  <text x="26" y="134" class="lbl" fill="#2563eb" text-anchor="end" font-weight="600">λ₃</text>
  <line x1="34" y1="130" x2="115" y2="130" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>

  <!-- 合波器 -->
  <rect x="115" y="38" width="50" height="112" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5"/>
  <text x="140" y="80" class="lbl" text-anchor="middle" font-weight="600">合波</text>
  <text x="140" y="96" class="dim" text-anchor="middle">器</text>

  <!-- 光纤（含三条色带代表不同波长） -->
  <rect x="165" y="68" width="200" height="52" rx="3" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="175" y1="80" x2="355" y2="80" stroke="#ef4444" stroke-width="2.5" opacity="0.45"/>
  <line x1="175" y1="94" x2="355" y2="94" stroke="#22c55e" stroke-width="2.5" opacity="0.45"/>
  <line x1="175" y1="108" x2="355" y2="108" stroke="#3b82f6" stroke-width="2.5" opacity="0.45"/>
  <text x="260" y="61" class="dim" text-anchor="middle">一根光纤同时传输多路波长</text>

  <!-- 分波器 -->
  <rect x="365" y="38" width="50" height="112" rx="4" fill="#f1f5f9" stroke="#64748b" stroke-width="1.5"/>
  <text x="390" y="80" class="lbl" text-anchor="middle" font-weight="600">分波</text>
  <text x="390" y="96" class="dim" text-anchor="middle">器</text>

  <!-- 输出波长 -->
  <line x1="415" y1="58" x2="496" y2="58" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
  <text x="504" y="62" class="lbl" fill="#dc2626" text-anchor="start" font-weight="600">λ₁</text>

  <line x1="415" y1="94" x2="496" y2="94" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
  <text x="504" y="98" class="lbl" fill="#16a34a" text-anchor="start" font-weight="600">λ₂</text>

  <line x1="415" y1="130" x2="496" y2="130" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
  <text x="504" y="134" class="lbl" fill="#2563eb" text-anchor="start" font-weight="600">λ₃</text>

  <!-- 底部标注 -->
  <text x="270" y="182" class="dim" text-anchor="middle">波分复用 = 光纤上的频分复用，DWDM 可在一根光纤中复用上百个波长通道</text>
</svg>
:::

## 码分复用 CDM {#multiplexing-cdm}

<!-- kb-multiplexing-cdm-1 -->
**码分复用**给每个用户分配唯一的正交码片序列。发送时用码片序列与数据相乘，接收方用相同的码片序列做内积恢复数据。不同用户的信号在时间和频率上都重叠，靠正交码分离。**CDMA**（码分多址）移动通信广泛使用此技术。

<!-- kb-multiplexing-cdm-3 -->
**例** 用户 A 码片 $(+1,+1,+1,+1)$，用户 B 码片 $(+1,-1,+1,-1)$。两用户各发送 bit 1，叠加后接收方如何分离？

<!-- kb-multiplexing-cdm-4 -->
**第 1 步：编码**，发送方用数据 bit × 码片序列。发送 bit 1 则码片原样发出，发送 bit 0 则码片反相（全部取反）。A 发 bit 1 → $(+1,+1,+1,+1)$，B 发 bit 1 → $(+1,-1,+1,-1)$。

**第 2 步：叠加**，信道中两路信号线性叠加（对应位置相加）：$(+2, 0, +2, 0)$。

**第 3 步：解码**，接收方用目标用户的码片与叠加信号做内积，再除以码片长度。
A 解码：$[(+2)(+1) + (0)(+1) + (+2)(+1) + (0)(+1)] / 4 = 4/4 = +1$ → bit 1。
B 解码：$[(+2)(+1) + (0)(-1) + (+2)(+1) + (0)(-1)] / 4 = 4/4 = +1$ → bit 1。

<!-- kb-multiplexing-cdm-5 -->
:::callout{title="正交码片的内积为零" tone="blue"}
不同用户的码片两两正交，内积为 0。如 A 与 B 的码片内积：$(+1)(+1) + (+1)(-1) + (+1)(+1) + (+1)(-1) = 0$。解码时其他用户的贡献自动归零。
:::
