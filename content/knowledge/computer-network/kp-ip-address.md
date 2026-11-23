---
pointId: kp-ip-address
---

## IPv4 地址格式与网络号、主机号 {#ipv4-format}

<!-- kb-ip-address-format-1 -->
IPv4 地址长 **32 位**，通常写成**点分十进制**：把 32 位分成 4 组，每组 8 位转成十进制，用点隔开（如 192.168.1.10）。

<!-- kb-ip-address-format-2 -->
一个 IPv4 地址分为**网络号**和**主机号**两部分：

1. **网络号**：标识主机所在的网络。
2. **主机号**：标识网络内的具体主机。

路由时只关心网络号，到达目标网络后再由该网络定位主机。

## 看最高位即可判断类别 {#classful-addressing}

<!-- kb-ip-address-class-1 -->
分类编址按 32 位地址的**最高位**划分类别，看二进制最前面几位就能判断属于哪一类：

<!-- kb-ip-address-class-2 -->
:::html
<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: system-ui, sans-serif; }
    .hdr { font-size: 14px; font-weight: 700; fill: #1e293b; }
    .dim { font-size: 12px; fill: #64748b; }
    .bits { font-size: 13px; font-weight: 700; fill: #1e293b; text-anchor: middle; }
    .net  { fill: #dbeafe; stroke: #2563eb; stroke-width: 1.5; }
    .host { fill: #dcfce7; stroke: #16a34a; stroke-width: 1.5; }
    .spec { fill: #fef3c7; stroke: #d97706; stroke-width: 1.5; }
    .cls  { font-size: 15px; font-weight: 700; }
  </style>

  <text x="360" y="24" class="hdr" text-anchor="middle">按最高位识别地址类别</text>

  <!-- A -->
  <text x="36" y="58" class="cls" fill="#2563eb">A</text>
  <text x="68" y="62" class="dim">0</text>
  <rect x="120" y="42" width="135" height="30" rx="3" class="net"/>
  <text x="187" y="62" class="bits">8 位网络号（1~126）</text>
  <rect x="255" y="42" width="405" height="30" rx="3" class="host"/>
  <text x="457" y="62" class="bits">24 位主机号</text>
  <text x="680" y="62" class="dim">大型</text>

  <!-- B -->
  <text x="36" y="103" class="cls" fill="#2563eb">B</text>
  <text x="68" y="107" class="dim">10</text>
  <rect x="120" y="87" width="270" height="30" rx="3" class="net"/>
  <text x="255" y="107" class="bits">16 位网络号（128~191）</text>
  <rect x="390" y="87" width="270" height="30" rx="3" class="host"/>
  <text x="525" y="107" class="bits">16 位主机号</text>
  <text x="680" y="107" class="dim">中型</text>

  <!-- C -->
  <text x="36" y="148" class="cls" fill="#2563eb">C</text>
  <text x="68" y="152" class="dim">110</text>
  <rect x="120" y="132" width="405" height="30" rx="3" class="net"/>
  <text x="322" y="152" class="bits">24 位网络号（192~223）</text>
  <rect x="525" y="132" width="135" height="30" rx="3" class="host"/>
  <text x="592" y="152" class="bits">8 位主机号</text>
  <text x="680" y="152" class="dim">小型</text>

  <!-- D -->
  <text x="36" y="193" class="cls" fill="#d97706">D</text>
  <text x="68" y="197" class="dim">1110</text>
  <rect x="120" y="177" width="540" height="30" rx="3" class="spec"/>
  <text x="390" y="197" class="bits" fill="#92400e">组播地址（224~239）</text>
  <text x="680" y="197" class="dim">组播</text>

  <!-- E -->
  <text x="36" y="238" class="cls" fill="#d97706">E</text>
  <text x="68" y="242" class="dim">1111</text>
  <rect x="120" y="222" width="540" height="30" rx="3" class="spec"/>
  <text x="390" y="242" class="bits" fill="#92400e">保留地址（240~255）</text>
  <text x="680" y="242" class="dim">实验</text>

  <text x="360" y="280" class="dim" text-anchor="middle">最高位连续 1 的个数越多，网络号占比越大、主机号占比越小，适用网络规模越小</text>
</svg>
:::

<!-- kb-new-block-27 -->
:::callout{title="地址的第一个字段和地址类别的关系" tone="blue"}
A 类最高位 0、B 类 10、C 类 110、D 类 1110、E 类 1111。
:::

## IPv4 的特殊地址 {#special-address}

<!-- kb-ip-address-special-1 -->
| 地址 | 含义 |
|------|------|
| 主机号全 0 | 本网络本身（网络地址） |
| 主机号全 1 | 本网络的广播地址 |
| 127.0.0.0/8 | 环回地址（本机自测） |
| 0.0.0.0 | 本网络上的本主机 / 默认路由 |
| 255.255.255.255 | 全网广播 |
| 10.0.0.0/8、172.16.0.0/12、192.168.0.0/16 | 私有地址（本地地址） |

<!-- kb-ip-address-special-2 -->
**环回地址**（127.0.0.1）：发往环回地址的数据报不会离开本机，直接被协议栈回送给本机自己，用于测试本机 TCP/IP 协议栈是否正常工作。127.0.0.0/8 整个网段都保留作环回使用。
