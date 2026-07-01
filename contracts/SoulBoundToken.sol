// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulBoundToken is ERC721, Ownable {
    uint256 private _nextTokenId;
    
    // Mapping from tokenId to tokenURI (metadata IPFS/API links)
    mapping(uint256 => string) private _tokenURIs;

    event BadgeMinted(address indexed recipient, uint256 indexed tokenId, string badgeType);

    constructor() ERC721("ScoutRena Badge", "SRB") Ownable(msg.sender) {}

    // Mint a new badge to a student. Only the platform owner/admin can mint badges.
    function mintBadge(address recipient, string memory badgeType, string memory uri) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(recipient, tokenId);
        _tokenURIs[tokenId] = uri;
        
        emit BadgeMinted(recipient, tokenId, badgeType);
        return tokenId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    // Override transfers to make them soulbound (non-transferable)
    function transferFrom(address from, address to, uint256 tokenId) public override {
        revert("SoulBoundToken: Transfers are blocked. This badge is linked to your identity.");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public override {
        revert("SoulBoundToken: Transfers are blocked. This badge is linked to your identity.");
    }
}
