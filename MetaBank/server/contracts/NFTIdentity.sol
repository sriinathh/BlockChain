// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTIdentity is ERC721 {
    uint256 public nextId;
    constructor() ERC721("MetaBankID", "MBID") {}
    function mint(address to) external returns (uint256) {
        nextId++;
        _mint(to, nextId);
        return nextId;
    }
}
