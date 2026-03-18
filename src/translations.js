export const translations = {
  en: {
    // Header
    brand: "Trae",
    brandSuffix: "Capital",
    demoTag: "Institutional Demo",
    kycStatus: "KYC Status",
    kycPassed: "PASSED (HashKey)",
    kycUnverified: "UNVERIFIED",
    
    // Metrics
    nav: "Net Asset Value (NAV)",
    tvl: "Total Value Locked",
    institutions: "Institutions",
    volume: "24h Volume",
    avgTicket: "Avg Ticket",
    nextUpdate: "Next NAV Update",
    dailyRebalancing: "Daily Rebalancing",

    // Tabs
    tabInvest: "Subscription (Mint)",
    tabRedeem: "Redemption (Burn)",

    // Invest Tab
    subscribeTitle: "Subscribe RWA Token",
    availableUSDC: "Available USDC",
    complianceTitle: "Compliance Interception",
    complianceMsg: "Please complete ONCHAINID verification to proceed.",
    amountLabel: "Amount (USDC)",
    minAmount: "Min. $100",
    btnInvest: "Confirm Subscription",
    btnKYCRequired: "KYC Verification Required",
    investSuccess: "Successfully invested",
    enterValidAmount: "Please enter a valid amount",

    // Redeem Tab
    redeemTitle: "Redeem RWA Token",
    currentHoldings: "Current Holdings",
    amountLabelRWA: "Amount (RWA)",
    enterAmount: "Enter amount",
    largeRedemptionWarn: "Large redemption (>1000) triggers T+3 settlement queue",
    btnSettlement: "Settlement in Progress...",
    btnRedeem: "Confirm Redemption",
    recentActivity: "Recent Activities",
    noHistory: "No redemption history",
    enterValidAmountShort: "Please enter valid amount",
    insufficientBalance: "Insufficient RWA balance",
    settlementLocked: "Settlement in progress. New requests are locked.",

    // Timeline
    reqLocked: "Request Locked",
    fiatProcessing: "Fiat Processing",
    finalSettlement: "Final Settlement",
    bankConfirming: "Bank confirming...",

    // History Items
    redeem: "Redeem",
    success: "Success",
    instant: "Instant",
    processing: "Processing",
    t3Settlement: "T+3 Settlement",
    waitingFiat: "Waiting for Fiat Gateway Settlement",
    completed: "Completed",
    settledVia: "Settled via HSBC",

    // Success Card
    subReqSubmitted: "Subscription Request Submitted",
    assetsMinting: "Assets are being minted...",
    txHash: "Transaction Hash",
    certId: "Certificate ID",
    viewOnExplorer: "View on Explorer",
    done: "Done",
    btnConfirmContinue: "Confirm & Continue",
    btnDoneReturn: "Done & Return",
    btnBackRedeem: "Back to Redemption",
    btnSimulateDone: "Simulate Settlement Done",
    instantRedeemSuccess: "Instant Redemption Successful",
    instantRedeemMsg: "Funds have been returned to your wallet.",
    
    // KYC Popover
    kycPopoverType: "Type: Institutional (PI)",
    kycPopoverID: "ID: 0x71...c2",
    kycPopoverRisk: "Risk: Low",
    
    // Errors
    errZero: "Amount must be greater than 0",
    errMinLimit: "Minimum subscription amount is $100",
    errExceed: "Insufficient Liquidity",
    errKYC: "KYC verification required",
  },
  zh_CN: {
    // Header
    brand: "Trae",
    brandSuffix: "Capital",
    demoTag: "机构级演示",
    kycStatus: "KYC 状态",
    kycPassed: "已通过 (HashKey)",
    kycUnverified: "未认证",
    
    // Metrics
    nav: "单位净值 (NAV)",
    tvl: "总锁仓量 (TVL)",
    institutions: "入驻机构",
    volume: "24h 交易量",
    avgTicket: "平均单笔",
    nextUpdate: "下次净值更新",
    dailyRebalancing: "每日再平衡",

    // Tabs
    tabInvest: "一级申购 (Mint)",
    tabRedeem: "一级赎回 (Burn)",

    // Invest Tab
    subscribeTitle: "申购 RWA 代币",
    availableUSDC: "可用 USDC",
    complianceTitle: "合规拦截",
    complianceMsg: "请完成 ONCHAINID 身份认证以继续。",
    amountLabel: "金额 (USDC)",
    minAmount: "起投金额 $100",
    btnInvest: "确认申购",
    btnKYCRequired: "需要 KYC 认证",
    investSuccess: "申购成功",
    enterValidAmount: "请输入有效金额",

    // Redeem Tab
    redeemTitle: "赎回 RWA 代币",
    currentHoldings: "当前持仓",
    amountLabelRWA: "金额 (RWA)",
    enterAmount: "输入金额",
    largeRedemptionWarn: "大额赎回 (>1000) 将触发 T+3 结算队列",
    btnSettlement: "结算进行中...",
    btnRedeem: "确认赎回",
    recentActivity: "近期活动",
    noHistory: "暂无赎回记录",
    enterValidAmountShort: "请输入有效金额",
    insufficientBalance: "RWA 余额不足",
    settlementLocked: "结算处理中，新请求已锁定",

    // Timeline
    reqLocked: "请求已锁定",
    fiatProcessing: "法币处理中",
    finalSettlement: "最终结算",
    bankConfirming: "银行确认中...",

    // History Items
    redeem: "赎回",
    success: "成功",
    instant: "即时",
    processing: "处理中",
    t3Settlement: "T+3 结算",
    waitingFiat: "等待法币网关结算",
    completed: "已完成",
    settledVia: "通过 HSBC 结算",

    // Success Card
    subReqSubmitted: "申购请求已提交",
    assetsMinting: "资产铸造中...",
    txHash: "交易哈希",
    certId: "凭证编号",
    viewOnExplorer: "查看区块链浏览器",
    done: "完成",
    btnConfirmContinue: "确认并继续",
    btnDoneReturn: "完成并返回",
    btnBackRedeem: "返回赎回页",
    btnSimulateDone: "模拟结算完成",
    instantRedeemSuccess: "即时赎回成功",
    instantRedeemMsg: "资金已退回至您的钱包。",
    
    // KYC Popover
    kycPopoverType: "类型: 机构专业投资者 (PI)",
    kycPopoverID: "ID: 0x71...c2",
    kycPopoverRisk: "风险等级: 低",
    
    // Errors
    errZero: "金额必须大于 0",
    errMinLimit: "起投金额 $100",
    errExceed: "超出可用额度",
    errKYC: "需要 KYC 认证",
  },
  zh_TW: {
    // Header
    brand: "Trae",
    brandSuffix: "Capital",
    demoTag: "機構級演示",
    kycStatus: "KYC 狀態",
    kycPassed: "已通過 (HashKey)",
    kycUnverified: "未認證",
    
    // Metrics
    nav: "單位淨值 (NAV)",
    tvl: "總鎖倉量 (TVL)",
    institutions: "入駐機構",
    volume: "24h 交易量",
    avgTicket: "平均單筆",
    nextUpdate: "下次淨值更新",
    dailyRebalancing: "每日再平衡",

    // Tabs
    tabInvest: "一級申購 (Mint)",
    tabRedeem: "一級贖回 (Burn)",

    // Invest Tab
    subscribeTitle: "申購 RWA 代幣",
    availableUSDC: "可用 USDC",
    complianceTitle: "合規攔截",
    complianceMsg: "請完成 ONCHAINID 身份認證以繼續。",
    amountLabel: "金額 (USDC)",
    minAmount: "起投金額 $100",
    btnInvest: "確認申購",
    btnKYCRequired: "需要 KYC 認證",
    investSuccess: "申購成功",
    enterValidAmount: "請輸入有效金額",

    // Redeem Tab
    redeemTitle: "贖回 RWA 代幣",
    currentHoldings: "當前持倉",
    amountLabelRWA: "金額 (RWA)",
    enterAmount: "輸入金額",
    largeRedemptionWarn: "大額贖回 (>1000) 將觸發 T+3 結算隊列",
    btnSettlement: "結算進行中...",
    btnRedeem: "確認贖回",
    recentActivity: "近期活動",
    noHistory: "暫無贖回記錄",
    enterValidAmountShort: "請輸入有效金額",
    insufficientBalance: "RWA 餘額不足",
    settlementLocked: "結算處理中，新請求已鎖定",

    // Timeline
    reqLocked: "請求已鎖定",
    fiatProcessing: "法幣處理中",
    finalSettlement: "最終結算",
    bankConfirming: "銀行確認中...",

    // History Items
    redeem: "贖回",
    success: "成功",
    instant: "即時",
    processing: "處理中",
    t3Settlement: "T+3 結算",
    waitingFiat: "等待法幣網關結算",
    completed: "已完成",
    settledVia: "通過 HSBC 結算",
    
    // Success Card
    subReqSubmitted: "申購請求已提交",
    assetsMinting: "資產鑄造中...",
    txHash: "交易哈希",
    certId: "憑證編號",
    viewOnExplorer: "查看區塊鏈瀏覽器",
    done: "完成",
    btnConfirmContinue: "確認並繼續",
    btnDoneReturn: "完成並返回",
    btnBackRedeem: "返回贖回頁",
    btnSimulateDone: "模擬結算完成",
    instantRedeemSuccess: "即時贖回成功",
    instantRedeemMsg: "資金已退回至您的錢包。",
    
    // KYC Popover
    kycPopoverType: "類型: 機構專業投資者 (PI)",
    kycPopoverID: "ID: 0x71...c2",
    kycPopoverRisk: "風險等級: 低",
    
    // Errors
    errZero: "金額必須大於 0",
    errMinLimit: "起投金額 $100",
    errExceed: "超出可用餘額",
    errKYC: "需要 KYC 認證",
  }
};