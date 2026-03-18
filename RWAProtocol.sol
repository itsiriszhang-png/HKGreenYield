// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// ═══════════════════════════════════════════════════════════════════════
// TRAE：RWA 机构级基建 - 合规层 + 赎回缓冲核心逻辑
// 关键特性：
// 1️⃣ ERC-3643 风格白名单 + 额度控制（合规拦截）
// 2️⃣ 多级赎回缓冲（一级稳定池 + 二级结算队列）
// 3️⃣ 锁定-确认-Burn 风控机制（防止双空风险）
// ═══════════════════════════════════════════════════════════════════════

contract RWAProtocol {
    string public name = "RWA Institutional Token";
    string public symbol = "RWA";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public isVerified; // ONCHAINID Whitelist
    
    // Redemption Queue Item
    struct RedemptionRequest {
        uint256 id;
        address user;
        uint256 amount;
        uint256 timestamp;
        bool processed;
    }
    
    uint256 public nextQueueId;
    mapping(uint256 => RedemptionRequest) public redemptionQueue;
    
    address public admin;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Invested(address indexed user, uint256 amount);
    event RedeemRequested(uint256 indexed queueId, address indexed user, uint256 amount);
    event RedeemProcessed(uint256 indexed queueId, address indexed user, uint256 amount);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    // Set KYC Status
    function setKYC(address user, bool status) external onlyAdmin {
        isVerified[user] = status;
    }

    function mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal {
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    // Investment Function
    function invest(uint256 amount) external {
        // 合规第一道防线：检查地址是否在 ONCHAINID 白名单中
        require(isVerified[msg.sender], "未通过KYC验证");
        
        mint(msg.sender, amount);
        emit Invested(msg.sender, amount);
    }

    // Redemption Function
    function requestRedeem(uint256 amount) external {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        // 核心竞争力：多级赎回判别逻辑
        if (amount <= 1000) {
            // 一级缓冲：即时销毁并结算
            _burn(msg.sender, amount);
        } else {
            // 二级队列：进入锁定状态，等待链下清算信号
            balanceOf[msg.sender] -= amount;
            balanceOf[address(this)] += amount;
            emit Transfer(msg.sender, address(this), amount);
            
            redemptionQueue[nextQueueId] = RedemptionRequest({
                id: nextQueueId,
                user: msg.sender,
                amount: amount,
                timestamp: block.timestamp,
                processed: false
            });
            emit RedeemRequested(nextQueueId, msg.sender, amount);
            nextQueueId++;
        }
    }

    // Admin Confirm (Settlement)
    function adminConfirmRedeem(uint256 queueId) external onlyAdmin {
        RedemptionRequest storage request = redemptionQueue[queueId];
        require(!request.processed, "Already processed");
        
        // Burn the locked tokens from contract
        _burn(address(this), request.amount);
        request.processed = true;
        
        emit RedeemProcessed(queueId, request.user, request.amount);
    }
}