import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("LandChain Smart Contracts System", function () {
  let LandNFT;
  let landNFT;
  let LandRegistry;
  let landRegistry;
  let owner;
  let officer;
  let citizen1;
  let citizen2;

  beforeEach(async function () {
    // Get signing accounts
    [owner, officer, citizen1, citizen2] = await ethers.getSigners();

    // 1. Deploy LandNFT
    LandNFT = await ethers.getContractFactory("LandNFT");
    landNFT = await LandNFT.deploy();
    await landNFT.waitForDeployment();
    const landNFTAddress = await landNFT.getAddress();

    // 2. Deploy LandRegistry
    LandRegistry = await ethers.getContractFactory("LandRegistry");
    landRegistry = await LandRegistry.deploy(landNFTAddress);
    await landRegistry.waitForDeployment();
    const landRegistryAddress = await landRegistry.getAddress();

    // 3. Grant Officer Role
    await landRegistry.grantOfficerRole(officer.address);

    // 4. Bind NFT Contract Ownership to Registry
    await landNFT.transferOwnership(landRegistryAddress);
  });

  describe("Deployment and Roles Setup", function () {
    it("Should set the correct deployer as default admin", async function () {
      const DEFAULT_ADMIN_ROLE = await landRegistry.DEFAULT_ADMIN_ROLE();
      expect(await landRegistry.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should assign officer roles successfully", async function () {
      const OFFICER_ROLE = await landRegistry.OFFICER_ROLE();
      expect(await landRegistry.hasRole(OFFICER_ROLE, officer.address)).to.be.true;
    });
  });

  describe("Land Registration Requests", function () {
    it("Should allow citizen registration and emit LandRegistered event", async function () {
      await expect(
        landRegistry.connect(citizen1).registerLand(
          "204/3A",
          "Srinath Kumar",
          "Kanchipuram",
          "Tamil Nadu",
          "2.4 Acres",
          "12.9716, 79.1588",
          "QmDeed12345"
        )
      )
        .to.emit(landRegistry, "LandRegistered")
        .withArgs(1, citizen1.address, "204/3A");

      const land = await landRegistry.getLandDetails(1);
      expect(land.ownerName).to.equal("Srinath Kumar");
      expect(land.verificationStatus).to.equal(0); // Pending
    });

    it("Should reject double registration of the same Survey Number in a district", async function () {
      await landRegistry.connect(citizen1).registerLand(
        "204/3A",
        "Srinath Kumar",
        "Kanchipuram",
        "Tamil Nadu",
        "2.4 Acres",
        "12.9716, 79.1588",
        "QmDeed12345"
      );

      await expect(
        landRegistry.connect(citizen2).registerLand(
          "204/3A",
          "Priya Sharma",
          "Kanchipuram",
          "Tamil Nadu",
          "1.2 Acres",
          "12.9716, 79.1588",
          "QmDeed67890"
        )
      ).to.be.revertedWith("Deed Registry: Survey plot is already registered under this zoning district");
    });
  });

  describe("Verification and NFT Minting", function () {
    beforeEach(async function () {
      await landRegistry.connect(citizen1).registerLand(
        "204/3A",
        "Srinath Kumar",
        "Kanchipuram",
        "Tamil Nadu",
        "2.4 Acres",
        "12.9716, 79.1588",
        "QmDeed12345"
      );
    });

    it("Should prevent regular citizens from verifying land", async function () {
      await expect(
        landRegistry.connect(citizen1).verifyLand(1, true, "https://ipfs.io/ipfs/QmMetadata")
      ).to.be.revertedWith("Caller is not a government officer");
    });

    it("Should allow officers to verify land and mint NFT certificate", async function () {
      await expect(
        landRegistry.connect(officer).verifyLand(1, true, "https://ipfs.io/ipfs/QmMetadata")
      )
        .to.emit(landRegistry, "LandVerified")
        .withArgs(1, 1, 1); // LandId 1, Status Verified (1), TokenId 1

      const land = await landRegistry.getLandDetails(1);
      expect(land.verificationStatus).to.equal(1); // Verified
      expect(land.nftTokenId).to.equal(1);

      // Verify NFT Owner is citizen1
      expect(await landNFT.ownerOf(1)).to.equal(citizen1.address);
      expect(await landNFT.tokenURI(1)).to.equal("https://ipfs.io/ipfs/QmMetadata");
    });

    it("Should allow officers to reject fraudulent requests", async function () {
      await expect(
        landRegistry.connect(officer).verifyLand(1, false, "")
      )
        .to.emit(landRegistry, "LandVerified")
        .withArgs(1, 2, 0); // LandId 1, Status Rejected (2), TokenId 0

      const land = await landRegistry.getLandDetails(1);
      expect(land.verificationStatus).to.equal(2); // Rejected
    });
  });

  describe("Ownership Transfer", function () {
    beforeEach(async function () {
      await landRegistry.connect(citizen1).registerLand(
        "204/3A",
        "Srinath Kumar",
        "Kanchipuram",
        "Tamil Nadu",
        "2.4 Acres",
        "12.9716, 79.1588",
        "QmDeed12345"
      );
      await landRegistry.connect(officer).verifyLand(1, true, "https://ipfs.io/ipfs/QmMetadata");
    });

    it("Should fail if LandRegistry contract is not approved to transfer the NFT", async function () {
      // Citizen1 tries to transfer without approving LandRegistry contract for the NFT
      await expect(
        landRegistry.connect(citizen1).transferOwnership(1, citizen2.address, "Priya Sharma")
      ).to.be.reverted;
    });

    it("Should successfully transfer ownership and NFT when approved", async function () {
      const landRegistryAddress = await landRegistry.getAddress();
      
      // Citizen1 approves LandRegistry to manage NFT
      await landNFT.connect(citizen1).approve(landRegistryAddress, 1);

      await expect(
        landRegistry.connect(citizen1).transferOwnership(1, citizen2.address, "Priya Sharma")
      )
        .to.emit(landRegistry, "OwnershipTransferred")
        .withArgs(1, citizen1.address, citizen2.address);

      const land = await landRegistry.getLandDetails(1);
      expect(land.currentOwner).to.equal(citizen2.address);
      expect(land.ownerName).to.equal("Priya Sharma");
      
      // Verify previous owners array
      const history = await landRegistry.getOwnershipHistory(1);
      expect(history[0]).to.equal(citizen1.address);

      // Verify NFT belongs to citizen2 now
      expect(await landNFT.ownerOf(1)).to.equal(citizen2.address);
    });
  });

  describe("Admin Controls and Fraud Control", function () {
    beforeEach(async function () {
      await landRegistry.connect(citizen1).registerLand(
        "204/3A",
        "Srinath Kumar",
        "Kanchipuram",
        "Tamil Nadu",
        "2.4 Acres",
        "12.9716, 79.1588",
        "QmDeed12345"
      );
    });

    it("Should allow admin to revoke officer roles and reject fraudulent land", async function () {
      await expect(
        landRegistry.connect(owner).rejectFraudulentLand(1, "Forged signature detected")
      )
        .to.emit(landRegistry, "FraudDetected")
        .withArgs(1, "Forged signature detected");

      const land = await landRegistry.getLandDetails(1);
      expect(land.verificationStatus).to.equal(2); // Rejected
    });
  });
});
