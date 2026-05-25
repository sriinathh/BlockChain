// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LandNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    constructor() ERC721("LandChain Certificate", "LCCERT") Ownable(msg.sender) {}

    /**
     * @dev Mint a new NFT certificate representing land title deeds.
     * @param to The recipient's wallet address.
     * @param tokenURI The IPFS metadata URI containing land properties and image.
     * @return The newly minted tokenId.
     */
    function mintCertificate(address to, string memory tokenURI) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        
        _safeMint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        return newItemId;
    }
}
