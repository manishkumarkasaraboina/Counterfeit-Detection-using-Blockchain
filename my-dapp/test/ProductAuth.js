const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductAuth", function () {
  let ProductAuth;
  let productAuth;
  let owner;
  let manufacturer;
  let seller;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, manufacturer, seller, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    ProductAuth = await ethers.getContractFactory("ProductAuth");
    productAuth = await ProductAuth.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await productAuth.owner()).to.equal(owner.address);
    });
  });

  describe("Manufacturer Registration", function () {
    it("Should register a manufacturer successfully", async function () {
      await productAuth.connect(manufacturer).registerManufacturer("MAN001", "Test Manufacturer");
      
      const manufacturerInfo = await productAuth.getManufacturerInfo("MAN001");
      expect(manufacturerInfo[0]).to.equal("Test Manufacturer");
      expect(manufacturerInfo[1]).to.equal(manufacturer.address);
      expect(manufacturerInfo[2]).to.be.true;
    });

    it("Should not allow duplicate manufacturer ID", async function () {
      await productAuth.connect(manufacturer).registerManufacturer("MAN001", "Test Manufacturer");
      
      await expect(
        productAuth.connect(addr1).registerManufacturer("MAN001", "Another Manufacturer")
      ).to.be.revertedWith("Manufacturer ID already exists");
    });
  });

  describe("Product Registration", function () {
    beforeEach(async function () {
      await productAuth.connect(manufacturer).registerManufacturer("MAN001", "Test Manufacturer");
    });

    it("Should register a product successfully", async function () {
      await productAuth.connect(manufacturer).registerProduct(
        "MAN001",
        "Test Product",
        "SN001",
        ethers.parseEther("1.0"),
        "Test Brand"
      );

      const productInfo = await productAuth.verifyProduct("SN001");
      expect(productInfo[0]).to.equal("Test Product");
      expect(productInfo[1]).to.equal("Test Brand");
      expect(productInfo[2]).to.equal(ethers.parseEther("1.0"));
      expect(productInfo[3]).to.equal(manufacturer.address);
      expect(productInfo[4]).to.equal(manufacturer.address);
      expect(productInfo[5]).to.be.true;
      expect(productInfo[6]).to.be.true;
    });

    it("Should not allow non-manufacturer to register products", async function () {
      await expect(
        productAuth.connect(addr1).registerProduct(
          "MAN001",
          "Test Product",
          "SN001",
          ethers.parseEther("1.0"),
          "Test Brand"
        )
      ).to.be.revertedWith("Not authorized manufacturer");
    });

    it("Should not allow duplicate product registration", async function () {
      await productAuth.connect(manufacturer).registerProduct(
        "MAN001",
        "Test Product",
        "SN001",
        ethers.parseEther("1.0"),
        "Test Brand"
      );

      await expect(
        productAuth.connect(manufacturer).registerProduct(
          "MAN001",
        "Another Product",
          "SN001",
          ethers.parseEther("2.0"),
          "Another Brand"
        )
      ).to.be.revertedWith("Product already registered");
    });
  });

  describe("Seller Registration", function () {
    it("Should register a seller successfully", async function () {
      await productAuth.connect(seller).addSeller("SELLER001", "Test Seller", "Test Brand");

      const sellerInfo = await productAuth.getSellerInfo(seller.address);
      expect(sellerInfo[0]).to.equal("Test Seller");
      expect(sellerInfo[1]).to.equal("SELLER001");
      expect(sellerInfo[2]).to.equal("Test Brand");
      expect(sellerInfo[3]).to.be.true;
    });

    it("Should not allow duplicate seller registration", async function () {
      await productAuth.connect(seller).addSeller("SELLER001", "Test Seller", "Test Brand");

      await expect(
        productAuth.connect(seller).addSeller("SELLER002", "Another Seller", "Another Brand")
      ).to.be.revertedWith("Seller already registered");
    });
  });

  describe("Product Verification", function () {
    beforeEach(async function () {
      await productAuth.connect(manufacturer).registerManufacturer("MAN001", "Test Manufacturer");
      await productAuth.connect(manufacturer).registerProduct(
        "MAN001",
        "Test Product",
        "SN001",
        ethers.parseEther("1.0"),
        "Test Brand"
      );
    });

    it("Should verify authentic product correctly", async function () {
      const isAuthentic = await productAuth.isProductAuthentic("SN001");
      expect(isAuthentic).to.be.true;
    });

    it("Should return false for non-existent product", async function () {
      const isAuthentic = await productAuth.isProductAuthentic("SN999");
      expect(isAuthentic).to.be.false;
    });

    it("Should return complete product information", async function () {
      const productInfo = await productAuth.verifyProduct("SN001");
      expect(productInfo[0]).to.equal("Test Product");
      expect(productInfo[1]).to.equal("Test Brand");
      expect(productInfo[2]).to.equal(ethers.parseEther("1.0"));
      expect(productInfo[3]).to.equal(manufacturer.address);
      expect(productInfo[4]).to.equal(manufacturer.address);
      expect(productInfo[5]).to.be.true;
      expect(productInfo[6]).to.be.true;
    });
  });

  describe("Product Transfer", function () {
    beforeEach(async function () {
      await productAuth.connect(manufacturer).registerManufacturer("MAN001", "Test Manufacturer");
      await productAuth.connect(manufacturer).registerProduct(
        "MAN001",
        "Test Product",
        "SN001",
        ethers.parseEther("1.0"),
        "Test Brand"
      );
      await productAuth.connect(seller).addSeller("SELLER001", "Test Seller", "Test Brand");
    });

    it("Should transfer product to seller successfully", async function () {
      await productAuth.connect(manufacturer).transferProductToSeller("SN001", seller.address);

      const productInfo = await productAuth.verifyProduct("SN001");
      expect(productInfo[4]).to.equal(seller.address);
    });

    it("Should not allow transfer to unregistered seller", async function () {
      await expect(
        productAuth.connect(manufacturer).transferProductToSeller("SN001", addr1.address)
      ).to.be.revertedWith("Seller not registered");
    });

    it("Should not allow non-manufacturer to transfer product", async function () {
      await expect(
        productAuth.connect(addr1).transferProductToSeller("SN001", seller.address)
      ).to.be.revertedWith("Not the product manufacturer");
    });
  });
});