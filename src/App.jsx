import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  ArrowRightLeft, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Lock,
  Landmark,
  Globe,
  X,
  ExternalLink,
  Info,
  ArrowUpRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { translations } from './translations';

// Utility for classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format numbers with commas and decimals
const formatNumber = (num, decimals = 2) => {
  return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

// Format large numbers (e.g. 1.2M)
const formatCompact = (num) => {
  return new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(num);
};

export default function App() {
  // --- Global State ---
  const [lang, setLang] = useState('en'); // en, zh_CN, zh_TW
  const t = (key) => translations[lang][key] || key;
  
  const [isKYCVerified, setIsKYCVerified] = useState(false);
  const [holdings, setHoldings] = useState(10000.00); // Initial dummy holdings
  const [nav, setNav] = useState(1.0234);
  const [activeTab, setActiveTab] = useState('invest');
  
  // --- Redemption State ---
  const [amount, setAmount] = useState('');
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [largeRedemptionState, setLargeRedemptionState] = useState('idle'); // idle, locked, processing, done

  // --- Validation State ---
  const [investError, setInvestError] = useState('');

  // --- Success State ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // New state for exit animation
  const [txDetails, setTxDetails] = useState(null);
  
  // --- Instant Redemption Success ---
  const [showInstantRedeemSuccess, setShowInstantRedeemSuccess] = useState(false);
  const [instantRedeemDetails, setInstantRedeemDetails] = useState(null);

  // --- Metrics Simulation ---
  const [tvl, setTvl] = useState(45230000);
  const [volume, setVolume] = useState(1250000);
  const [countdown, setCountdown] = useState('');

  // Helper for Redemption UI
  const isProcessing = ['locked', 'processing'].includes(largeRedemptionState);

  // Simulate NAV jitter & Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setNav(prev => prev + (Math.random() - 0.5) * 0.0005);
      
      // Countdown Logic (Next 14:00)
      const now = new Date();
      const target = new Date();
      target.setHours(14, 0, 0, 0);
      if (now > target) target.setDate(target.getDate() + 1);
      
      const diff = target - now;
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdown(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- Logic ---

  const handleInvestChange = (e) => {
    const valStr = e.target.value;
    setAmount(valStr);
    
    // Clear error if empty
    if (!valStr) {
      setInvestError('');
      return;
    }
    
    const val = parseFloat(valStr);
    if (val < 100) {
      setInvestError('errMinLimit');
    } else if (val > 5000000) {
      setInvestError('errExceed');
    } else {
      setInvestError('');
    }
  };

  const handleInvest = (e) => {
    e.preventDefault();
    if (!isKYCVerified || investError || !amount) return; // Block invalid
    
    const val = parseFloat(amount);
    
    setHoldings(prev => prev + val);
    setAmount('');
    setInvestError('');
    
    // Trigger Success Card
    const txHash = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
    setTxDetails({
      amount: val,
      hash: `${txHash.substring(0, 6)}...${txHash.substring(58)}`,
      certId: `CERT-${Date.now().toString().slice(-6)}`
    });
    setShowSuccess(true);
    
    // Auto-close success modal after 10s if not clicked
    setTimeout(() => {
        if(setShowSuccess) {
             handleCloseSuccess();
        }
    }, 10000);
  };

  const handleCloseSuccess = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsClosing(false);
      setAmount(''); // Clear amount on close
    }, 300); // Match duration-300
  };

  const handleRedeem = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return; // Validation handled by UI logic
    if (val > holdings) return;

    // Core Logic: Tiered Redemption
    if (val <= 1000) {
      // Level 1: Instant
      setHoldings(prev => prev - val);
      const newRecord = {
        id: Date.now(),
        amount: val,
        status: t('success'),
        type: t('instant'),
        time: new Date().toLocaleTimeString()
      };
      setRedemptionHistory(prev => [newRecord, ...prev]);
      setAmount('');
      
      // Instant Success Feedback
      setInstantRedeemDetails({ amount: val });
      setShowInstantRedeemSuccess(true);
      setTimeout(() => {
          setShowInstantRedeemSuccess(false);
      }, 3000);
      
    } else {
      // Level 2: Async Settlement
      setHoldings(prev => prev - val); // Lock tokens (burn from user view)
      setLargeRedemptionState('locked');
      
      const newRecord = {
        id: Date.now(),
        amount: val,
        status: t('processing'),
        type: t('t3Settlement'),
        time: new Date().toLocaleTimeString(),
        tag: t('waitingFiat')
      };
      setRedemptionHistory(prev => [newRecord, ...prev]);
      setAmount('');

      // Auto-advance to processing after 2s
      setTimeout(() => {
        setLargeRedemptionState('processing');
      }, 2000);
    }
  };

  // Admin Action to Finalize
  const adminConfirmSettlement = () => {
    if (largeRedemptionState !== 'processing') return;
    setLargeRedemptionState('done');
    
    // Update history status
    setRedemptionHistory(prev => prev.map((item, idx) => 
      idx === 0 ? { ...item, status: t('completed'), tag: t('settledVia') } : item
    ));

    // Reset state after delay
    setTimeout(() => {
      setLargeRedemptionState('idle');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-emerald-500/30">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-500" />
            <span className="font-bold text-lg tracking-tight">{t('brand')}<span className="text-emerald-500">{t('brandSuffix')}</span></span>
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">{t('demoTag')}</span>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Language Switcher */}
             <div className="relative group">
                <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{lang.replace('_', '-')}</span>
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all transform origin-top-right z-50">
                  <div className="py-1">
                    <button onClick={() => setLang('en')} className={cn("block w-full text-left px-4 py-2 text-sm hover:bg-slate-700", lang === 'en' ? "text-emerald-500" : "text-slate-300")}>English</button>
                    <button onClick={() => setLang('zh_CN')} className={cn("block w-full text-left px-4 py-2 text-sm hover:bg-slate-700", lang === 'zh_CN' ? "text-emerald-500" : "text-slate-300")}>简体中文</button>
                    <button onClick={() => setLang('zh_TW')} className={cn("block w-full text-left px-4 py-2 text-sm hover:bg-slate-700", lang === 'zh_TW' ? "text-emerald-500" : "text-slate-300")}>繁體中文</button>
                  </div>
                </div>
             </div>

            <div className="flex items-center gap-2 text-sm bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <span className="text-slate-400">{t('kycStatus')}:</span>
              <div className="relative group">
                <button 
                  onClick={() => setIsKYCVerified(!isKYCVerified)}
                  className={cn(
                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none",
                    isKYCVerified ? "bg-emerald-500" : "bg-slate-600"
                  )}
                >
                  <span className={cn(
                    "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
                    isKYCVerified ? "translate-x-5" : "translate-x-1"
                  )} />
                </button>
                <span className={cn("ml-2 text-xs font-medium cursor-help", isKYCVerified ? "text-emerald-400" : "text-slate-500")}>
                  {isKYCVerified ? t('kycPassed') : t('kycUnverified')}
                </span>

                {/* KYC Popover */}
                {isKYCVerified && (
                  <div className="absolute right-0 top-8 w-64 p-4 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 transform origin-top-right">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      {t('identity')}
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{t('kycPopoverType')}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="font-mono text-slate-300">{t('kycPopoverID')}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-white/5">
                        <span className="text-emerald-400">{t('kycPopoverRisk')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* --- Dashboard Metrics --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard 
            title={t('nav')} 
            value={`$${nav.toFixed(4)}`} 
            trend="+0.12%" 
            icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
            highlight
          />
          <MetricCard 
            title={t('tvl')} 
            value={`$${formatNumber(tvl, 0)}`} 
            sub={`${t('institutions')}: 42`}
            icon={<Lock className="w-4 h-4 text-slate-400" />}
            highlight
          />
          <MetricCard 
            title={t('volume')} 
            value={`$${formatNumber(volume, 0)}`} 
            sub={`${t('avgTicket')}: $50k`}
            icon={<ArrowRightLeft className="w-4 h-4 text-slate-400" />}
          />
          <MetricCard 
            title={t('nextUpdate')} 
            value={countdown} 
            sub={t('dailyRebalancing')}
            icon={<Clock className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Main Operation Card --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/40 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-white/5">
                <button 
                  onClick={() => { setActiveTab('invest'); setAmount(''); setInvestError(''); }}
                  className={cn(
                    "flex-1 py-4 text-sm font-medium transition-colors",
                    activeTab === 'invest' ? "bg-emerald-500/10 text-emerald-500 border-b-2 border-emerald-500" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {t('tabInvest')}
                </button>
                <button 
                  onClick={() => { setActiveTab('redeem'); setAmount(''); }}
                  className={cn(
                    "flex-1 py-4 text-sm font-medium transition-colors",
                    activeTab === 'redeem' ? "bg-rose-500/10 text-rose-500 border-b-2 border-rose-500" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {t('tabRedeem')}
                </button>
              </div>

              {/* Content */}
              <div className="p-6 relative">
                {activeTab === 'invest' ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{t('subscribeTitle')}</h3>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">{t('availableUSDC')}</p>
                        <p className="font-mono text-xl">$5,000,000.00</p>
                      </div>
                    </div>

                    {!isKYCVerified && (
                      <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                        <div className="text-sm text-rose-200">
                          <p className="font-bold">{t('complianceTitle')}</p>
                          <p>{t('complianceMsg')}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">{t('amountLabel')}</label>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={handleInvestChange}
                        placeholder={t('minAmount')}
                        className={cn(
                          "w-full bg-slate-900 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors",
                          investError 
                            ? "border-rose-500 focus:border-rose-500" 
                            : "border-slate-700 focus:border-emerald-500"
                        )}
                      />
                      {investError && (
                        <p className="text-xs text-rose-500 mt-1">{t(investError)}</p>
                      )}
                    </div>

                    <button 
                      onClick={handleInvest}
                      disabled={!isKYCVerified || !!investError || !amount}
                      className={cn(
                        "w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2",
                        !isKYCVerified || !!investError || !amount
                          ? "bg-slate-700 text-slate-500 opacity-50 cursor-not-allowed backdrop-blur-sm"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                      )}
                    >
                      {isKYCVerified ? (
                        <>
                          {t('btnInvest')} <ArrowUpRight className="w-4 h-4" />
                        </>
                      ) : (
                        t('btnKYCRequired')
                      )}
                    </button>

                    {/* Success Overlay Card */}
                    {showSuccess && txDetails && (
                      <div className={cn(
                        "absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10 transition-opacity duration-300",
                        isClosing ? "opacity-0" : "animate-in fade-in zoom-in"
                      )}>
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('subReqSubmitted')}</h3>
                        <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">{t('assetsMinting')}</p>
                        
                        <div className="w-full bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-500">{t('amountLabel')}</span>
                            <span className="font-mono text-white">{formatNumber(txDetails.amount)} USDC</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-500">{t('txHash')}</span>
                            <span className="font-mono text-emerald-400 flex items-center gap-1 cursor-pointer hover:text-emerald-300">
                              {txDetails.hash} <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500">{t('certId')}</span>
                            <span className="font-mono text-slate-300">{txDetails.certId}</span>
                          </div>
                        </div>

                        <div className="w-full mt-6">
                          <button 
                            onClick={handleCloseSuccess}
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 backdrop-blur-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {t('btnDoneReturn')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{t('redeemTitle')}</h3>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">{t('currentHoldings')}</p>
                        <p className="font-mono text-xl">{holdings.toFixed(2)} RWA</p>
                      </div>
                    </div>

                    {/* Timeline Component for Large Redemption */}
                    {largeRedemptionState !== 'idle' && (
                       <div className="relative">
                         <RedemptionTimeline state={largeRedemptionState} t={t} />
                         {largeRedemptionState === 'done' && (
                           <div className="mt-4 flex justify-center">
                             <button 
                               onClick={() => {
                                   setLargeRedemptionState('idle');
                                   setAmount('');
                               }}
                               className="px-6 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-sm font-medium transition-colors"
                             >
                               {t('btnBackRedeem')}
                             </button>
                           </div>
                         )}
                       </div>
                    )}

                    {isProcessing ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 text-amber-500 mb-1">
                            <Lock className="w-4 h-4" />
                            <span className="font-bold text-sm">{t('reqLocked')}</span>
                          </div>
                          <p className="text-xs text-amber-200/80">{t('settlementLocked')}</p>
                        </div>
                        
                        <button 
                          onClick={() => {
                            setLargeRedemptionState('idle');
                            setAmount('');
                          }}
                          className="w-full py-2 bg-transparent border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 rounded-lg text-sm font-medium transition-colors border-dashed"
                        >
                          {t('btnSimulateDone')}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm text-slate-400">{t('amountLabelRWA')}</label>
                          <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={t('enterAmount')}
                            className={cn(
                              "w-full bg-slate-900 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors",
                              (parseFloat(amount) > holdings || parseFloat(amount) <= 0 && amount !== '')
                                ? "border-rose-500 focus:border-rose-500" 
                                : "border-slate-700 focus:border-rose-500"
                            )}
                          />
                          {parseFloat(amount) > holdings && (
                             <p className="text-xs text-rose-500 mt-1">{t('insufficientBalance')}</p>
                          )}
                          {parseFloat(amount) <= 0 && amount !== '' && (
                             <p className="text-xs text-rose-500 mt-1">{t('errZero')}</p>
                          )}
                          {parseFloat(amount) > 1000 && parseFloat(amount) <= holdings && (
                            <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
                              <AlertTriangle className="w-3 h-3" />
                              {t('largeRedemptionWarn')}
                            </p>
                          )}
                        </div>

                        <button 
                          onClick={handleRedeem}
                          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > holdings}
                          className={cn(
                            "w-full py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg",
                            !amount || parseFloat(amount) <= 0 || parseFloat(amount) > holdings
                              ? "bg-slate-700 text-slate-500 opacity-50 cursor-not-allowed backdrop-blur-sm"
                              : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20"
                          )}
                        >
                          {t('btnRedeem')}
                        </button>
                      </>
                    )}

                    {/* Instant Redemption Success Modal */}
                    {showInstantRedeemSuccess && instantRedeemDetails && (
                        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{t('instantRedeemSuccess')}</h3>
                            <p className="text-slate-400 text-sm mb-6">{t('instantRedeemMsg')}</p>
                            <div className="text-xl font-mono text-emerald-400 mb-6">
                                -{formatNumber(instantRedeemDetails.amount)} RWA
                            </div>
                            <div className="w-full mt-2">
                                <button 
                                    onClick={() => setShowInstantRedeemSuccess(false)}
                                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 backdrop-blur-md transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Redemption History */}
                    <div className="mt-8">
                      <h4 className="text-sm font-medium text-slate-400 mb-3">{t('recentActivity')}</h4>
                      <div className="space-y-3">
                        {redemptionHistory.length === 0 && (
                          <p className="text-xs text-slate-600 text-center py-4">{t('noHistory')}</p>
                        )}
                        {redemptionHistory.map((item) => (
                          <div key={item.id} className="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between text-sm border border-slate-800">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                item.status === t('success') || item.status === t('completed') ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                              )} />
                              <div>
                                <p className="font-medium text-slate-200">{t('redeem')} {item.amount}</p>
                                <p className="text-xs text-slate-500">{item.time} • {item.type}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={cn(
                                "text-xs px-2 py-1 rounded",
                                item.status === t('success') || item.status === t('completed')
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-amber-500/10 text-amber-400"
                              )}>
                                {item.status}
                              </span>
                              {item.tag && item.status === t('processing') && (
                                <p className="text-[10px] text-amber-500 mt-1">{item.tag}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- Side Panel / Asset Card --- */}
          <div className="space-y-6">
             <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900/40 backdrop-blur-md rounded-xl border border-white/5 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <h3 className="text-slate-400 text-sm font-medium mb-1">{t('totalHoldings')}</h3>
                <div className="text-3xl font-bold text-white mb-4">
                  {holdings.toLocaleString()} <span className="text-lg text-emerald-500">RWA</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400">{t('avgCost')}</span>
                    <span>$1.0120</span>
                  </div>
                  <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                    <span className="text-slate-400">{t('unrealizedPnL')}</span>
                    <span className="text-emerald-400">+$2,450.20 (+4.2%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">{t('yield')}</span>
                    <span className="text-emerald-400">5.8%</span>
                  </div>
                </div>
             </div>

             {/* Admin Controls (Hidden Gem) */}
             <div className="bg-slate-900 rounded-xl border border-dashed border-slate-700 p-4 opacity-50 hover:opacity-100 transition-opacity">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">{t('adminSim')}</p>
                <button 
                  onClick={adminConfirmSettlement}
                  disabled={largeRedemptionState !== 'processing'}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded border border-slate-600 transition-colors disabled:opacity-50"
                >
                  {t('btnSimBank')}
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function MetricCard({ title, value, sub, trend, icon, highlight }) {
  return (
    <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-5 border border-white/5 hover:border-emerald-500/30 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        {icon}
      </div>
      <div className={cn(
        "text-2xl font-bold",
        highlight ? "bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent" : "text-white"
      )}>
        {value}
      </div>
      {(sub || trend) && (
        <div className="flex items-center gap-2 mt-1">
          {trend && <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">{trend}</span>}
          {sub && <span className="text-slate-500 text-xs">{sub}</span>}
        </div>
      )}
    </div>
  );
}

function RedemptionTimeline({ state, t }) {
  // state: 'locked', 'processing', 'done'
  const steps = [
    { id: 'locked', label: t('reqLocked'), icon: Lock },
    { id: 'processing', label: t('fiatProcessing'), icon: ArrowRightLeft },
    { id: 'done', label: t('finalSettlement'), icon: CheckCircle2 }
  ];

  const getStepStatus = (stepId) => {
    if (state === 'idle') return 'pending';
    if (state === 'done') return 'completed';
    if (state === stepId) return 'current';
    
    // Order: locked -> processing -> done
    const order = ['locked', 'processing', 'done'];
    const currentIndex = order.indexOf(state);
    const stepIndex = order.indexOf(stepId);
    
    return stepIndex < currentIndex ? 'completed' : 'pending';
  };

  return (
    <div className="w-full bg-slate-900 rounded-lg p-4 border border-slate-700">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0 relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-0 -translate-y-1/2" />
        
        {steps.map((step, idx) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="relative z-10 flex md:flex-col items-center gap-3 md:gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                status === 'completed' ? "bg-emerald-500 border-emerald-500 text-white" :
                status === 'current' ? "bg-slate-900 border-amber-500 text-amber-500" :
                "bg-slate-900 border-slate-700 text-slate-700"
              )}>
                {status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : 
                 status === 'current' ? <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" /> : 
                 <span className="text-xs">{idx + 1}</span>}
              </div>
              <div className="flex flex-col md:items-center">
                <div className="flex items-center gap-1">
                  {status === 'current' && step.id === 'processing' ? (
                     <Icon className="w-3 h-3 text-amber-500 animate-spin" />
                  ) : (
                     <Icon className={cn("w-3 h-3", status === 'completed' ? "text-emerald-500" : "text-slate-600")} />
                  )}
                  <span className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    status === 'completed' ? "text-emerald-500" :
                    status === 'current' ? "text-amber-500 animate-pulse" : "text-slate-600"
                  )}>
                    {step.label}
                  </span>
                </div>
                {status === 'current' && step.id === 'processing' && (
                  <span className="text-[10px] text-amber-500/80 animate-pulse mt-1">{t('bankConfirming')}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
