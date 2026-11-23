---
pointId: kp-nyquist-shannon
---

## 无噪声信道的码元上限 {#nyquist-limit}

<!-- kb-nyquist-limit-1 -->
奈奎斯特定理讨论理想低通信道。带宽限制了每秒可以可靠传输的码元数，而每个码元携带的信息量由离散电平数决定。

<!-- kb-nyquist-limit-2 -->
:::formula
C\ [\text{bps}] = 2 \times W\ [\text{Hz}] \times \log_2 V
:::

<!-- kb-nyquist-limit-3 -->
$W$ 是信道带宽，$V$ 是码元可取的离散电平数。

## 有噪声信道的容量上限 {#shannon-limit}

<!-- kb-shannon-limit-1 -->
香农定理把噪声影响纳入计算。信噪比越高，信道容量越大；但容量随信噪比按对数增长，不能靠无限提高功率线性换取速率。

<!-- kb-shannon-limit-2 -->
:::formula
C\ [\text{bps}] = W\ [\text{Hz}] \times \log_2 (1 + S/N)
:::

<!-- kb-shannon-limit-3 -->
若题目给的是分贝，先用 $S/N = 10^{\text{dB}/10}$ 转为数值比。

## 取两个约束中的较小值 {#nyquist-shannon-choice}

<!-- kb-nyquist-shannon-choice-1 -->
真实信道既有带宽限制，也有噪声限制。题目同时给出电平数和信噪比时，应分别计算奈奎斯特上限与香农上限，最终速率不能超过其中较小者。
