---
pointId: kp-csma-ca-protocol
---

## CSMA/CA 的思路 {#csma-ca-basics}

<!-- kb-csma-ca-basics-1 -->
**CSMA/CA** 采用**冲突避免**而非冲突检测。无线局域网中，发送方在发送时信号最强，无法同时检测到远端的冲突信号，即无法做到"边发边听"。因此无线网络在发送前和发送中都采取一系列措施降低冲突概率。

<!-- kb-csma-ca-basics-2 -->
**CSMA/CD** 用于有线以太网，可以检测冲突。

**CSMA/CA** 用于无线局域网（802.11 WiFi）。

两者都在发送前监听，但 CA 还多了确认、预留信道和退避等机制。

## RTS/CTS 握手全流程 {#csma-ca-process}

<!-- kb-csma-ca-proc-1 -->
:::html
<svg viewBox="0 0 600 490" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 16px; font-weight: 700; fill: #1e293b; }
    .lbl { font-size: 12px; font-weight: 600; fill: #1e293b; }
    .tl  { stroke: #1e293b; stroke-width: 1.5; stroke-dasharray: 5,3; }
    .br  { stroke: #1e293b; stroke-width: 1.2; fill: none; }
    .bx  { fill: #cbd5e1; fill-opacity: 0.75; stroke: #64748b; stroke-width: 1.5; }
    .bx-data { fill: #93c5fd; fill-opacity: 0.9; stroke: #1d4ed8; stroke-width: 2; }
    .nav { stroke: #dc2626; stroke-width: 1.5; fill: none; }
  </style>

  <!-- 三列标题 -->
  <text x="110" y="28" class="hdr" text-anchor="middle">Source</text>
  <text x="300" y="28" class="hdr" text-anchor="middle">Destination</text>
  <text x="490" y="28" class="hdr" text-anchor="middle">Other Nodes</text>

  <!-- 三条竖虚线 -->
  <line x1="110" y1="45" x2="110" y2="480" class="tl"/>
  <line x1="300" y1="45" x2="300" y2="480" class="tl"/>
  <line x1="490" y1="45" x2="490" y2="480" class="tl"/>

  <!-- DIFS 标签 + 括号（Source 侧，底部贴 RTS 顶） -->
  <text x="78" y="85" class="lbl" text-anchor="middle" transform="rotate(-90 78 85)">DIFS</text>
  <line x1="95" y1="70" x2="95" y2="105" class="br"/>
  <line x1="95" y1="70" x2="110" y2="70" class="br"/>
  <line x1="95" y1="105" x2="110" y2="105" class="br"/>

  <!-- RTS：Source → Destination（只发到 Destination，不跨到 Other Nodes） -->
  <polygon points="110,105 300,145 300,165 110,125" class="bx"/>
  <text x="205" y="138" class="hdr" fill="#334155" text-anchor="middle">RTS</text>

  <!-- SIFS ①（Destination 侧，顶端贴 RTS 底 y=165，底端贴 CTS 顶 y=185） -->
  <text x="328" y="178" class="lbl" text-anchor="middle" transform="rotate(-90 328 178)">SIFS</text>
  <line x1="315" y1="165" x2="315" y2="185" class="br"/>
  <line x1="315" y1="165" x2="300" y2="165" class="br"/>
  <line x1="315" y1="185" x2="300" y2="185" class="br"/>

  <!-- CTS：Destination → Source + Other Nodes -->
  <polygon points="300,185 110,215 110,235 300,205" class="bx"/>
  <polygon points="300,185 490,215 490,235 300,205" class="bx"/>
  <text x="205" y="210" class="hdr" fill="#334155" text-anchor="middle">CTS</text>
  <text x="395" y="210" class="hdr" fill="#334155" text-anchor="middle">CTS</text>

  <!-- SIFS ②（Source 侧，紧贴 CTS 底部与 DATA 顶部） -->
  <text x="78" y="250" class="lbl" text-anchor="middle" transform="rotate(-90 78 250)">SIFS</text>
  <line x1="95" y1="235" x2="95" y2="265" class="br"/>
  <line x1="95" y1="235" x2="110" y2="235" class="br"/>
  <line x1="95" y1="265" x2="110" y2="265" class="br"/>

  <!-- DATA：Source → Destination（加粗，70px 厚） -->
  <polygon points="110,265 300,315 300,385 110,335" class="bx-data"/>
  <text x="205" y="305" class="hdr" fill="#1e40af" text-anchor="middle">DATA</text>

  <!-- SIFS ③（Destination 侧，紧贴 DATA 底部与 ACK 顶部） -->
  <text x="325" y="400" class="lbl" text-anchor="middle" transform="rotate(-90 325 400)">SIFS</text>
  <line x1="315" y1="385" x2="315" y2="415" class="br"/>
  <line x1="315" y1="385" x2="300" y2="385" class="br"/>
  <line x1="315" y1="415" x2="300" y2="415" class="br"/>

  <!-- ACK：Destination → Source + Other Nodes -->
  <polygon points="300,415 110,445 110,465 300,435" class="bx"/>
  <polygon points="300,415 490,445 490,465 300,435" class="bx"/>
  <text x="205" y="455" class="hdr" fill="#334155" text-anchor="middle">ACK</text>
  <text x="395" y="455" class="hdr" fill="#334155" text-anchor="middle">ACK</text>

  <!-- NAV 箭头（左侧，在 SIFS 文字左边，红色双向箭头） -->
  <line x1="50" y1="105" x2="50" y2="465" class="nav"/>
  <!-- 上箭头 -->
  <polygon points="50,105 45,115 55,115" fill="#dc2626"/>
  <!-- 下箭头 -->
  <polygon points="50,465 45,455 55,455" fill="#dc2626"/>
  <text x="35" y="290" class="lbl" fill="#dc2626" font-size="14" font-weight="700" text-anchor="middle" transform="rotate(-90 35 290)">NAV（网络分配向量）</text>
</svg>
:::

<!-- kb-csma-ca-proc-2 -->
上图完整展示了 RTS/CTS 握手的时延过程：

① 源站监听 DIFS 空闲后发送 **RTS 帧**，RTS 只发给目的站。
② 目的站收到 RTS，等待 SIFS 后回复 **CTS 帧**，CTS 同时广播到源站和其他站点。其他站点通过 CTS 的 NAV 字段获知信道被占用。
③ 源站收到 CTS，等待 SIFS 后发送 **DATA 数据帧**。
④ 目的站收到 DATA，等待 SIFS 后回复 **ACK 确认帧**，ACK 同样广播到其他站点。

## 二进制指数退避 {#csma-ca-backoff}

<!-- kb-csma-ca-backoff-1 -->
发生冲突后，发送方需要等待一段随机时间再重试。退避计数器在区间 $[0, CW]$ 中随机选取一个值，$CW$（竞争窗口）随冲突次数 $k$ 按指数增长：$CW = 2^k \times W_{min}$。

<!-- kb-csma-ca-backoff-2 -->
**初始值**：$CW$ 初始为 $W_{min}$（通常 15 个时隙，每个时隙约 9 μs），即退避区间 $[0, 15]$。

<!-- kb-csma-ca-backoff-3 -->
**增长规则**：每发生一次冲突，$CW$ 翻倍。第 1 次冲突 $CW=31$，第 2 次 $CW=63$，第 3 次 $CW=127$……以此类推，每次翻倍指数增长。

<!-- kb-csma-ca-backoff-4 -->
**上限**：$CW$ 最多涨到 $W_{max}$（通常 1023），之后不再翻倍，但退避计数器仍可继续取 $[0, 1023]$ 中的随机值。成功传输后 $CW$ 重置为 $W_{min}$。

<!-- kb-csma-ca-backoff-5 -->
**例** 假设时隙 9 μs，第 1 次冲突从 $[0, 15]$ 中随机选 6，等待 $6 \times 9 = 54$ μs；第 2 次冲突 $CW$ 翻倍为 31，从 $[0, 31]$ 中随机选 20，等待 $20 \times 9 = 180$ μs；第 3 次冲突 $CW=63$，以此类推。冲突越多，等待时间越长，指数增长使冲突概率快速下降。

## NAV 网络分配向量 {#csma-ca-nav}

<!-- kb-csma-ca-nav-1 -->
**NAV**（Network Allocation Vector）是 RTS/CTS 帧中携带的一个计时字段，告诉周围所有站点信道已被预约一段时间，期间不要发送。其他站点听到 RTS 或 CTS 后，把帧中携带的 NAV 值设为倒计时，归零前保持沉默。

<!-- kb-csma-ca-nav-3 -->
比如：站点 A 向 B 发 RTS，NAV 字段设为 500 μs（足以覆盖后续 CTS+DATA+ACK）。B 回复 CTS，NAV 同样为 500 μs。周围站点 C 只听到 RTS，站点 D 只听到 CTS，两者都会将自己的 NAV 设为 500 μs，在 500 μs 内保持静默。500 μs 后 NAV 归零，信道重新竞争。
