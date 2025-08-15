// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductAuth {
    address public owner;

    struct Product {
        string name;
        string serialNumber;
        string brand;
        uint256 price;
        address manufacturer;
        address currentOwner;
        bool isAuthentic;
        bool isRegistered;
    }

    struct Seller {
        string name;
        string sellerCode;
        address sellerAddress;
        string brand;
        bool isRegistered;
    }

    struct Manufacturer {
        string name;
        string manufacturerId;
        address manufacturerAddress;
        bool isRegistered;
    }

    mapping(string => Product) public products; // serialNumber => Product
    mapping(address => Seller) public sellers;
    mapping(string => Manufacturer) public manufacturers; // manufacturerId => Manufacturer
    mapping(address => string) public addressToManufacturerId;

    event ProductRegistered(string serialNumber, string name, string brand, uint256 price, address manufacturer);
    event SellerAdded(address seller, string name, string brand);
    event ManufacturerRegistered(string manufacturerId, string name, address manufacturerAddress);
    event ProductTransferred(string serialNumber, address from, address to);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyManufacturer(string memory manufacturerId) {
        require(manufacturers[manufacturerId].manufacturerAddress == msg.sender, "Not authorized manufacturer");
        _;
    }

    modifier onlyRegisteredSeller() {
        require(sellers[msg.sender].isRegistered, "Not a registered seller");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerManufacturer(string memory manufacturerId, string memory name) public {
        require(manufacturers[manufacturerId].manufacturerAddress == address(0), "Manufacturer ID already exists");
        manufacturers[manufacturerId] = Manufacturer(name, manufacturerId, msg.sender, true);
        addressToManufacturerId[msg.sender] = manufacturerId;
        emit ManufacturerRegistered(manufacturerId, name, msg.sender);
    }

    function registerProduct(
        string memory manufacturerId,
        string memory name, 
        string memory serialNumber, 
        uint256 price, 
        string memory brand
    ) public onlyManufacturer(manufacturerId) {
        require(products[serialNumber].manufacturer == address(0), "Product already registered");
        require(bytes(serialNumber).length > 0, "Serial number cannot be empty");
        
        products[serialNumber] = Product(
            name, 
            serialNumber, 
            brand, 
            price, 
            msg.sender, 
            msg.sender, 
            true, 
            true
        );
        
        emit ProductRegistered(serialNumber, name, brand, price, msg.sender);
    }

    function addSeller(
        string memory sellerCode, 
        string memory name, 
        string memory brand
    ) public {
        require(!sellers[msg.sender].isRegistered, "Seller already registered");
        require(bytes(sellerCode).length > 0, "Seller code cannot be empty");
        
        sellers[msg.sender] = Seller(name, sellerCode, msg.sender, brand, true);
        emit SellerAdded(msg.sender, name, brand);
    }

    function transferProductToSeller(string memory serialNumber, address sellerAddress) public {
        require(products[serialNumber].manufacturer == msg.sender, "Not the product manufacturer");
        require(sellers[sellerAddress].isRegistered, "Seller not registered");
        require(products[serialNumber].isRegistered, "Product not registered");
        
        products[serialNumber].currentOwner = sellerAddress;
        emit ProductTransferred(serialNumber, msg.sender, sellerAddress);
    }

    function verifyProduct(string memory serialNumber) public view returns (
        string memory name,
        string memory brand,
        uint256 price,
        address manufacturer,
        address currentOwner,
        bool isAuthentic,
        bool isRegistered
    ) {
        Product memory p = products[serialNumber];
        return (p.name, p.brand, p.price, p.manufacturer, p.currentOwner, p.isAuthentic, p.isRegistered);
    }

    function getSellerInfo(address sellerAddress) public view returns (
        string memory name,
        string memory sellerCode,
        string memory brand,
        bool isRegistered
    ) {
        Seller memory s = sellers[sellerAddress];
        return (s.name, s.sellerCode, s.brand, s.isRegistered);
    }

    function getManufacturerInfo(string memory manufacturerId) public view returns (
        string memory name,
        address manufacturerAddress,
        bool isRegistered
    ) {
        Manufacturer memory m = manufacturers[manufacturerId];
        return (m.name, m.manufacturerAddress, m.isRegistered);
    }

    function isProductAuthentic(string memory serialNumber) public view returns (bool) {
        return products[serialNumber].isRegistered && products[serialNumber].isAuthentic;
    }
}