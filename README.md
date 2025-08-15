# 🔐 Fake Product Identification DApp

A blockchain-powered decentralized application (DApp) for authenticating products and preventing counterfeiting using Ethereum smart contracts and QR code technology.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project addresses the global issue of counterfeit products by providing a tamper-proof, decentralized solution for product authentication. Manufacturers can register their products on the blockchain, sellers can register under specific brands, and consumers can verify product authenticity by scanning QR codes or entering serial numbers.

## ✨ Features

### 🏭 Manufacturer Features
- Register as a manufacturer with unique ID
- Register products with detailed information
- Generate QR codes for each registered product
- Transfer products to authorized sellers

### 🏪 Seller Features
- Register as a seller with seller code
- Associate with specific product brands
- Receive products from manufacturers

### 👤 Consumer Features
- Verify product authenticity using serial numbers
- Scan QR codes for instant verification
- View detailed product information
- Real-time blockchain verification

### 🔒 Security Features
- Immutable blockchain storage
- Tamper-proof product records
- Decentralized verification system
- Secure smart contract interactions

## 🛠 Technology Stack

### Frontend
- **HTML5** - Structure and semantics
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Interactive functionality
- **QRCode.js** - QR code generation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Ethers.js** - Ethereum interaction
- **Axios** - HTTP client

### Blockchain
- **Solidity** - Smart contract language
- **Hardhat** - Development framework
- **Ethereum** - Blockchain platform

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Fake-Product-Identification
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd my-dapp
   npm install
   cd ..
   ```

3. **Compile smart contracts**
   ```bash
   npm run compile
   ```

## 🎮 Usage

### 1. Start the Local Blockchain

In a new terminal window:
```bash
npm run node
```

This starts a local Hardhat network with pre-funded accounts.

### 2. Deploy Smart Contracts

In another terminal window:
```bash
npm run deploy
```

This deploys the ProductAuth smart contract to the local network.

### 3. Start the Backend Server

In another terminal window:
```bash
npm start
```

The server will start on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🏭 Smart Contract

The `ProductAuth.sol` smart contract provides the following functions:

### Core Functions
- `registerManufacturer()` - Register a new manufacturer
- `registerProduct()` - Register a new product
- `addSeller()` - Register a new seller
- `verifyProduct()` - Verify product authenticity
- `transferProductToSeller()` - Transfer product ownership

### View Functions
- `getSellerInfo()` - Get seller information
- `getManufacturerInfo()` - Get manufacturer information
- `isProductAuthentic()` - Check if product is authentic

## 🔌 API Endpoints

### POST `/registerManufacturer`
Register a new manufacturer
```json
{
  "manufacturerId": "string",
  "name": "string"
}
```

### POST `/registerProduct`
Register a new product
```json
{
  "manufacturerId": "string",
  "productName": "string",
  "serialNumber": "string",
  "price": "number",
  "brand": "string"
}
```

### POST `/addSeller`
Register a new seller
```json
{
  "sellerCode": "string",
  "name": "string",
  "brand": "string"
}
```

### POST `/verifyProduct`
Verify product authenticity
```json
{
  "productId": "string"
}
```

### GET `/getSellerInfo/:address`
Get seller information by address

### GET `/getManufacturerInfo/:manufacturerId`
Get manufacturer information by ID

## 📱 User Guide

### For Manufacturers

1. **Register as Manufacturer**
   - Navigate to the Manufacturer tab
   - Enter your Manufacturer ID and Name
   - Click "Register Manufacturer"

2. **Register Products**
   - Enter product details (name, serial number, price, brand)
   - Click "Register Product"
   - A QR code will be generated for the product

### For Sellers

1. **Register as Seller**
   - Navigate to the Seller tab
   - Enter your Seller Code, Name, and Brand
   - Click "Register as Seller"

### For Consumers

1. **Verify Products**
   - Navigate to the Consumer tab
   - Enter the product serial number or scan QR code
   - Click "Verify Product"
   - View the verification result and product details

## 🔧 Development

### Project Structure
```
Fake-Product-Identification/
├── contracts/                 # Smart contracts
│   └── ProductAuth.sol
├── my-dapp/                   # Hardhat project
│   ├── contracts/
│   ├── scripts/
│   └── hardhat.config.js
├── src/                       # Frontend and backend
│   ├── index.html
│   ├── index.js
│   ├── main.js
│   └── styles.css
├── package.json
└── README.md
```

### Available Scripts
- `npm start` - Start the backend server
- `npm run dev` - Start with nodemon (auto-restart)
- `npm run deploy` - Deploy smart contracts
- `npm run node` - Start local blockchain
- `npm run compile` - Compile smart contracts

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ethereum Foundation for blockchain technology
- Hardhat team for the development framework
- QRCode.js for QR code generation
- Express.js team for the web framework


---

