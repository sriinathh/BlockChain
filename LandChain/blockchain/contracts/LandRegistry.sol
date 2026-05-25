// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./LandNFT.sol";

contract LandRegistry is AccessControl, ReentrancyGuard {
    bytes32 public constant OFFICER_ROLE = keccak256("OFFICER_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    enum VerificationStatus { Pending, Verified, Rejected }

    struct Land {
        uint256 landId;
        string surveyNumber;
        string ownerName;
        address ownerWallet;
        string district;
        string state;
        string landArea;
        string gpsCoordinates;
        string ipfsHash;
        uint256 registrationDate;
        VerificationStatus verificationStatus;
        address currentOwner;
        address[] previousOwners;
        uint256 nftTokenId; // Maps to LandNFT tokenId, 0 if not minted
    }

    uint256 private _landIds;
    LandNFT public landNFT;

    // Mappings
    mapping(uint256 => Land) private _lands;
    uint256[] private _allLandIds;
    
    // Hash mapping to prevent duplicate survey numbers per district/state
    // keccak256(surveyNumber, district, state) => bool
    mapping(bytes32 => bool) private _surveyRegistered;

    // Events
    event LandRegistered(uint256 indexed landId, address indexed owner, string surveyNumber);
    event LandVerified(uint256 indexed landId, VerificationStatus status, uint256 nftTokenId);
    event OwnershipTransferred(uint256 indexed landId, address indexed from, address indexed to);
    event FraudDetected(uint256 indexed landId, string reason);
    event OfficerAssigned(address indexed officer);
    event OfficerRevoked(address indexed officer);

    constructor(address nftContractAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OFFICER_ROLE, msg.sender); // Admin is also officer by default
        landNFT = LandNFT(nftContractAddress);
    }

    modifier onlyOfficer() {
        require(hasRole(OFFICER_ROLE, msg.sender), "Caller is not a government officer");
        _;
    }

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an administrator");
        _;
    }

    /**
     * @dev Register a new property request. Open to any citizen.
     */
    function registerLand(
        string memory surveyNumber,
        string memory ownerName,
        string memory district,
        string memory state,
        string memory landArea,
        string memory gpsCoordinates,
        string memory ipfsHash
    ) external nonReentrant returns (uint256) {
        // Enforce uniqueness key
        bytes32 surveyHash = keccak256(abi.encodePacked(surveyNumber, district, state));
        require(!_surveyRegistered[surveyHash], "Deed Registry: Survey plot is already registered under this zoning district");

        _landIds++;
        uint256 newLandId = _landIds;

        // Auto grant user role
        if (!hasRole(USER_ROLE, msg.sender)) {
            _grantRole(USER_ROLE, msg.sender);
        }

        address[] memory emptyHistory;

        _lands[newLandId] = Land({
            landId: newLandId,
            surveyNumber: surveyNumber,
            ownerName: ownerName,
            ownerWallet: msg.sender,
            district: district,
            state: state,
            landArea: landArea,
            gpsCoordinates: gpsCoordinates,
            ipfsHash: ipfsHash,
            registrationDate: block.timestamp,
            verificationStatus: VerificationStatus.Pending,
            currentOwner: msg.sender,
            previousOwners: emptyHistory,
            nftTokenId: 0
        });

        _allLandIds.push(newLandId);
        _surveyRegistered[surveyHash] = true;

        emit LandRegistered(newLandId, msg.sender, surveyNumber);
        return newLandId;
    }

    /**
     * @dev Officer audits and approves/rejects land deeds. Mint NFT upon approval.
     */
    function verifyLand(uint256 landId, bool approve, string memory tokenURI) external onlyOfficer nonReentrant {
        Land storage land = _lands[landId];
        require(land.landId != 0, "Deed Registry: Land parcel not found");
        require(land.verificationStatus == VerificationStatus.Pending, "Deed Registry: Property has already been audited");

        if (approve) {
            land.verificationStatus = VerificationStatus.Verified;
            
            // Mint Land Title NFT Certificate
            uint256 tokenId = landNFT.mintCertificate(land.ownerWallet, tokenURI);
            land.nftTokenId = tokenId;

            emit LandVerified(landId, VerificationStatus.Verified, tokenId);
        } else {
            land.verificationStatus = VerificationStatus.Rejected;
            // Clear survey hash to allow future correction
            bytes32 surveyHash = keccak256(abi.encodePacked(land.surveyNumber, land.district, land.state));
            _surveyRegistered[surveyHash] = false;

            emit LandVerified(landId, VerificationStatus.Rejected, 0);
        }
    }

    /**
     * @dev Transfer property ownership to a new wallet.
     */
    function transferOwnership(
        uint256 landId,
        address to,
        string memory newOwnerName
    ) external nonReentrant {
        Land storage land = _lands[landId];
        require(land.landId != 0, "Deed Registry: Land parcel not found");
        require(land.currentOwner == msg.sender, "Deed Registry: Only current title deed holder can transfer");
        require(land.verificationStatus == VerificationStatus.Verified, "Deed Registry: Land must be verified to transfer");
        require(to != address(0), "Deed Registry: Cannot transfer to null address");
        require(to != msg.sender, "Deed Registry: Cannot transfer to yourself");

        // Keep records of previous owner
        land.previousOwners.push(msg.sender);

        // Update ownership state
        land.ownerWallet = to;
        land.ownerName = newOwnerName;
        land.currentOwner = to;

        // If NFT certificate was minted, transfer NFT as well
        // LandRegistry contract must be approved by msg.sender beforehand
        if (land.nftTokenId > 0) {
            landNFT.transferFrom(msg.sender, to, land.nftTokenId);
        }

        emit OwnershipTransferred(landId, msg.sender, to);
    }

    /**
     * @dev Fraud control: Admins can manually reject/flag forged deeds.
     */
    function rejectFraudulentLand(uint256 landId, string memory reason) external onlyAdmin {
        Land storage land = _lands[landId];
        require(land.landId != 0, "Deed Registry: Land parcel not found");
        
        land.verificationStatus = VerificationStatus.Rejected;
        
        bytes32 surveyHash = keccak256(abi.encodePacked(land.surveyNumber, land.district, land.state));
        _surveyRegistered[surveyHash] = false;

        emit FraudDetected(landId, reason);
    }

    /**
     * @dev Update file hashes if deed documents need correction.
     */
    function updateIPFSHash(uint256 landId, string memory newHash) external {
        Land storage land = _lands[landId];
        require(land.landId != 0, "Deed Registry: Land parcel not found");
        require(land.currentOwner == msg.sender || hasRole(OFFICER_ROLE, msg.sender), "Deed Registry: Unauthorized to update hash");
        
        land.ipfsHash = newHash;
    }

    // Role Assignments
    function grantOfficerRole(address officer) external onlyAdmin {
        grantRole(OFFICER_ROLE, officer);
        emit OfficerAssigned(officer);
    }

    function revokeOfficerRole(address officer) external onlyAdmin {
        revokeRole(OFFICER_ROLE, officer);
        emit OfficerRevoked(officer);
    }

    // Getters
    function getLandDetails(uint256 landId) external view returns (Land memory) {
        require(_lands[landId].landId != 0, "Deed Registry: Land parcel not found");
        return _lands[landId];
    }

    function getOwnershipHistory(uint256 landId) external view returns (address[] memory) {
        require(_lands[landId].landId != 0, "Deed Registry: Land parcel not found");
        return _lands[landId].previousOwners;
    }

    function getAllLands() external view returns (uint256[] memory) {
        return _allLandIds;
    }
}
