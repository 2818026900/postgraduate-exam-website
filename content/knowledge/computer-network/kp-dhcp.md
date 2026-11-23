---
pointId: kp-dhcp
---

## DHCP 动态分配 IP {#dhcp-purpose}

<!-- kb-dhcp-purpose-1 -->
**DHCP** 为主机自动分配 IP 地址、子网掩码、默认网关和 DNS 服务器等配置，避免手工配置。主机开机后无需知道网络参数，直接从 DHCP 服务器获取。

<!-- kb-dhcp-purpose-2 -->
:::callout{title="DHCP 是应用层协议" tone="blue"}
DHCP 使用 UDP，客户端端口 68、服务器端口 67。虽然服务于网络层地址配置，但协议本身位于应用层，借助广播来发现服务器。
:::

## DHCP四步交互 {#dhcp-process}

<!-- kb-dhcp-process-anim -->
:::animation{ref="@/animations/computer-networks/network-layer/dhcp-process#dhcpProcessAnimation"}

<!-- kb-dhcp-process-1 -->
1. **DHCPDISCOVER**：客户端广播（目的 MAC = FF-FF-FF-FF-FF-FF），寻找 DHCP 服务器。
2. **DHCPOFFER**：服务器**单播**应答（目的 MAC 填客户端 MAC），提供一个可用地址。
3. **DHCPREQUEST**：客户端广播（目的 MAC = FF-FF-FF-FF-FF-FF），确认选择该地址。
4. **DHCPACK**：服务器**单播**确认（目的 MAC 填客户端 MAC），地址租约生效。

<!-- kb-dhcp-process-2 -->
分配到的地址是**租约**形式，租期过半客户端会续租。地址可被回收后再次分配，实现地址复用。
