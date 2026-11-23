---
pointId: kp-ospf
---

## OSPF 的原理 {#ospf-basics}

<!-- kb-ospf-basics-1 -->
**OSPF**（开放最短路径优先）是一种**链路状态**协议。每个路由器把自己的邻接关系和链路代价向区域内泛洪，使所有路由器获得一致的链路状态数据库，再以自己为源运行 **Dijkstra** 算法算出最短路径树。OSPF 比 RIP 收敛更快。

<!-- kb-ospf-basics-2 -->
:::callout{title="OSPF 的层数" tone="blue"}
OSPF 直接运行在 IP 之上（协议号为 89），不使用 UDP/TCP。
:::

<!-- kb-ospf-basics-3 -->
:::html
<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .dim { font-size: 11px; fill: #64748b; }
    .rtr { font-size: 12px; font-weight: 700; fill: #1e40af; }
    .flood { font-size: 10px; font-weight: 600; fill: #d97706; }
    .lbl { font-size: 12px; font-weight: 700; fill: #1e293b; }
  </style>
  <defs>
    <marker id="arr-o" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#d97706"/>
    </marker>
  </defs>

  <text x="380" y="26" class="hdr" text-anchor="middle">OSPF：泛洪链路状态，每个路由器独立算最短路径</text>

  <!-- 4 个路由器 -->
  <rect x="40" y="90" width="120" height="50" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="100" y="112" class="rtr" text-anchor="middle">R1</text>
  <text x="100" y="130" class="dim" text-anchor="middle">代价 1</text>

  <rect x="320" y="60" width="120" height="50" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="380" y="82" class="rtr" text-anchor="middle">R2</text>
  <text x="380" y="100" class="dim" text-anchor="middle">代价 2</text>

  <rect x="600" y="90" width="120" height="50" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="660" y="112" class="rtr" text-anchor="middle">R3</text>
  <text x="660" y="130" class="dim" text-anchor="middle">代价 1</text>

  <rect x="320" y="230" width="120" height="50" rx="4" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
  <text x="380" y="252" class="rtr" text-anchor="middle">R4</text>
  <text x="380" y="270" class="dim" text-anchor="middle">代价 3</text>

  <!-- 链路 -->
  <line x1="160" y1="115" x2="320" y2="85" stroke="#94a3b8" stroke-width="2"/>
  <line x1="440" y1="85" x2="600" y2="115" stroke="#94a3b8" stroke-width="2"/>
  <line x1="380" y1="110" x2="380" y2="230" stroke="#94a3b8" stroke-width="2"/>

  <!-- 泛洪箭头 -->
  <path d="M 100 90 C 120 40, 340 20, 360 60" stroke="#d97706" stroke-width="2" fill="none" stroke-dasharray="5 3" marker-end="url(#arr-o)"/>
  <text x="210" y="40" class="flood">泛洪：R1 广播自己的链路状态</text>
  <path d="M 720 100 C 720 40, 460 20, 440 60" stroke="#d97706" stroke-width="2" fill="none" stroke-dasharray="5 3" marker-end="url(#arr-o)"/>
  <text x="560" y="40" class="flood">泛洪</text>

  <!-- 链路状态数据库 -->
  <rect x="25" y="310" width="355" height="70" rx="4" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="202" y="332" class="lbl" text-anchor="middle">链路状态数据库（每台路由器都有完整一份）</text>
  <text x="202" y="354" class="dim" text-anchor="middle">R1—R2：代价1；R2—R3：代价2；R1—R4：代价3；R3—R4：代价1</text>

  <!-- Dijkstra -->
  <rect x="380" y="310" width="355" height="70" rx="4" fill="#f8fafc" stroke="#16a34a" stroke-width="1.5"/>
  <text x="557" y="332" class="lbl" fill="#166534" text-anchor="middle">以自己为源，运行 Dijkstra 算法</text>
  <text x="557" y="354" class="dim" fill="#166534" text-anchor="middle">算出到每个网络的最短路径，填入路由表</text>

  <text x="380" y="396" class="dim" text-anchor="middle">先让全网状态一致（泛洪），再各自独立计算，谁也不需要"听邻居说"</text>
</svg>
:::

## OSPF 的报文类型 {#ospf-messages}

<!-- kb-ospf-msg-1 -->
OSPF 有五种基本报文类型，分工明确：
1. **Hello 报文**：发现和维护邻居关系，周期性发送。
2. **数据库描述报文**（DD）：描述自己链路状态数据库的摘要，用于邻居间同步初始状态。
3. **链路状态请求报文**（LSR）：发现自己缺少某条链路状态时，向邻居请求完整内容。
4. **链路状态更新报文**（LSU）：真正传送链路状态信息（泛洪的就是它）。
5. **链路状态确认报文**（LSAck）：确认收到链路状态更新，保证可靠。

<!-- kb-ospf-msg-2 -->
:::callout{title="OSPF 特点" tone="blue"}
支持开销度量、支持多条等代价路径负载均衡，收敛快，适合中大型网络。
:::

## OSPF 如何控制洪泛规模 {#ospf-flood-scope}

<!-- kb-ospf-scope-1 -->
OSPF 用**区域划分**限制洪泛范围：每台路由器只在自己所在区域内泛洪链路状态。**区域边界路由器**只把**汇总后的路由信息**传给骨干区域和其他区域，不扩散区域内每一条链路状态。这样洪泛被限制在局部，全网不需要同步所有细节。

<!-- kb-ospf-scope-2 -->
在**广播型链路**（如多台路由器接在同一个以太网上）里，OSPF 再通过指定路由器（DR）和备用指定路由器（BDR）进一步压缩洪泛：所有路由器只和 DR/BDR 建立邻接关系，由 DR 代表该链路泛洪，不需要每两台路由器两两建立邻接。

这样能大幅减少需要发送和处理的链路状态报文数量。
