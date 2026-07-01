// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ScoutRenaMarket is Ownable {
    IERC20 public talentToken;

    struct Bid {
        uint256 id;
        address company;
        string studentId; // Matches Firestore student ID for easy synchronization
        uint256 amount;
        bool active;
        bool accepted;
        uint256 timestamp;
    }

    uint256 public nextBidId;
    mapping(uint256 => Bid) public bids;
    // Maps studentId to list of bidIds
    mapping(string => uint256[]) public studentBids;
    // Maps company address to list of bidIds
    mapping(address => uint256[]) public companyBids;

    event BidPlaced(uint256 indexed bidId, address indexed company, string studentId, uint256 amount);
    event BidAccepted(uint256 indexed bidId, address indexed company, string studentId, uint256 amount);
    event BidRejected(uint256 indexed bidId, address indexed company, string studentId);
    event BidCanceled(uint256 indexed bidId, address indexed company, string studentId);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        talentToken = IERC20(_tokenAddress);
    }

    // Place a bid on a student. The company must approve the market contract to transfer tokens beforehand.
    function placeBid(string memory studentId, uint256 amount) external returns (uint256) {
        require(amount > 0, "Bid amount must be greater than 0");
        require(talentToken.balanceOf(msg.sender) >= amount, "Insufficient token balance");

        // Transfer tokens from company to this contract (holding escrow)
        require(talentToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        uint256 bidId = nextBidId++;
        Bid memory newBid = Bid({
            id: bidId,
            company: msg.sender,
            studentId: studentId,
            amount: amount,
            active: true,
            accepted: false,
            timestamp: block.timestamp
        });

        bids[bidId] = newBid;
        studentBids[studentId].push(bidId);
        companyBids[msg.sender].push(bidId);

        emit BidPlaced(bidId, msg.sender, studentId, amount);
        return bidId;
    }

    // Accept a bid. Can be triggered by the owner/admin on behalf of the student or via signatures.
    // In our simplified mock/demo, the platform admin triggers this when the student accepts.
    function acceptBid(uint256 bidId, address studentWallet) external onlyOwner {
        Bid storage bid = bids[bidId];
        require(bid.active, "Bid is not active");
        
        bid.active = false;
        bid.accepted = true;

        // Transfer locked tokens from this contract to the student
        require(talentToken.transfer(studentWallet, bid.amount), "Token transfer failed");

        emit BidAccepted(bidId, bid.company, bid.studentId, bid.amount);
    }

    // Reject a bid. Triggers return of tokens to the company.
    function rejectBid(uint256 bidId) external onlyOwner {
        Bid storage bid = bids[bidId];
        require(bid.active, "Bid is not active");

        bid.active = false;

        // Refund tokens to the company
        require(talentToken.transfer(bid.company, bid.amount), "Token refund failed");

        emit BidRejected(bidId, bid.company, bid.studentId);
    }

    // Cancel a bid. Can be triggered by the company.
    function cancelBid(uint256 bidId) external {
        Bid storage bid = bids[bidId];
        require(bid.active, "Bid is not active");
        require(bid.company == msg.sender, "Only the bidding company can cancel");

        bid.active = false;

        // Refund tokens to the company
        require(talentToken.transfer(bid.company, bid.amount), "Token refund failed");

        emit BidCanceled(bidId, bid.company, bid.studentId);
    }

    function getStudentBids(string memory studentId) external view returns (uint256[] memory) {
        return studentBids[studentId];
    }

    function getCompanyBids(address company) external view returns (uint256[] memory) {
        return companyBids[company];
    }
}
