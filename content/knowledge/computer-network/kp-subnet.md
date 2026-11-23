---
pointId: kp-subnet
---

## CIDR 与子网掩码 {#subnet-basics}

<!-- kb-subnet-cidr-1 -->
CIDR 取消了 A/B/C 类的固定分类，用**斜杠记法**把网络前缀长度写出来：192.168.1.0/24 表示前 24 位是网络前缀，后 8 位是主机号。

<!-- kb-subnet-cidr-2 -->
CIDR 可以把多个连续网络**聚合**成一个更大的网络（路由聚合，route aggregation），减少路由表条目。

<!-- kb-subnet-mask-1 -->
**子网掩码**是与 IP 地址等长的 32 位数字，网络号对应位为 1、主机号对应位为 0。把 IP 地址与子网掩码做**按位与**，得到的就是网络地址。

<!-- kb-subnet-mask-2 -->
:::formula
\text{网络地址} = \text{IP 地址} \land \text{子网掩码}
:::

<!-- kb-subnet-mask-3 -->
例如 IP 192.168.1.10、掩码 255.255.255.0，与运算后网络地址是 192.168.1.0。斜杠记法的 /24 与 255.255.255.0 是同一件事。

<!-- kb-subnet-host-1 -->
一个子网能容纳的主机数由**主机号位数**决定。主机号占 $n$ 位时，理论上最多有 $2^n$ 个组合，其中两个要保留、不能分配给主机。

<!-- kb-subnet-host-2 -->
:::formula
\text{可用主机数} = 2^n - 2
:::

<!-- kb-subnet-host-3 -->
减去的两个是：

- 主机号**全 0**：网络地址，标识子网本身。
- 主机号**全 1**：广播地址，向子网内所有主机广播。

这两个地址都不能分配给主机。

<!-- kb-subnet-host-4 -->
例如 /24 子网的主机号占 8 位，可用主机数 = $2^8 - 2 = 254$，其中 0 保留给网络地址、255 保留给广播地址，实际可用 1 到 254。

## VLSM 可变长子网划分 {#vlsm}

<!-- kb-subnet-vlsm-1 -->
**VLSM**（可变长子网掩码）允许在一个网络内使用不同长度的子网掩码，把地址块按实际需求切成大小不等的子网。

1. 需要主机多的子网：分配大块地址。
2. 只需要少数地址的子网：分配小块地址。

这样能节省地址空间。

<!-- kb-subnet-vlsm-anim -->
:::animation{ref="@/animations/computer-networks/network-layer/subnet-vlsm#subnetVlsmAnimation"}
