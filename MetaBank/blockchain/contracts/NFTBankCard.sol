// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTBankCard is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping(uint256 => string) private _tiers;

    constructor() ERC721("MetaBank Premium Card", "MBPC") Ownable(msg.sender) {}

    function mintCard(address to, string memory tokenURI, string memory tier) external onlyOwner returns (uint256) {
        _nextTokenId++;
        uint256 tokenId = _nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _tiers[tokenId] = tier;
        return tokenId;
    }

    function getTier(uint256 tokenId) external view returns (string memory) {
        return _tiers[tokenId];
    }
}
