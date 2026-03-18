# 🔥 TRAE：RWA 机构级基建 Demo

## 🎯 面试考察的 3 大核心机制

### 1️⃣ **合规拦截** (Compliance Interception)
- ERC-3643 风格白名单 + 额度双重校验
- 5种典型错误场景：地域限制、额度超限、日累计超限等

> **问题**：如何防止非合格投资者买入？
> **答案**：合约层白名单 + 前端预校验 + 转账前合规模块拦截

### 2️⃣ **流动性分层** (Liquidity Tiering)
- 小额赎回 → 一级稳定币缓冲池（即时）
- 大额赎回 → 二级结算队列（T+1~T+3）

> **防止挤兑：透明队列 + 限额 + 状态可视化**

### 3️⃣ **异步结算** (Asynchronous Settlement)
- 赎回请求 → 份额锁定 → 银行确认 → Burn 代币
- 异常处理：结算失败自动回滚，防止双空风险

---

## 🚀 一键部署

```bash
# 进入目录
cd RWA-Demo

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

---

## ⚡ **演示指南**

1. **合规演示**：默认状态下，Invest 按钮禁用（灰色/模糊）。点击右上角 **KYC Toggle** 开关，状态变为 PASSED，按钮变为绿色可用。
2. **小额赎回**：在 Redemption Tab 输入 `500`，点击赎回。历史记录立即显示 **Success** (一级缓冲)。
3. **大额赎回**：输入 `5000`，点击赎回。
    - 触发 **T+3 Settlement Queue**。
    - Timeline 显示 **Request Locked** -> **Fiat Processing** (闪烁)。
    - 点击右侧侧边栏的隐形 **Admin Simulation** 按钮，状态瞬间变为 **Final Settlement**，演示银行到账回调。
