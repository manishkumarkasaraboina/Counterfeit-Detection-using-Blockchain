const express = require('express');
const cors = require('cors');
const path = require('path');
const { ethers } = require('ethers');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../src')));

// Contract ABI and Address (will be updated after deployment)
const CONTRACT_ABI = [
  "function registerManufacturer(string memory manufacturerId, string memory name) public",
  "function registerProduct(string memory manufacturerId, string memory name, string memory serialNumber, uint256 price, string memory brand) public",
  "function addSeller(string memory sellerCode, string memory name, string memory brand) public",
  "function verifyProduct(string memory serialNumber) public view returns (string memory name, string memory brand, uint256 price, address manufacturer, address currentOwner, bool isAuthentic, bool isRegistered)",
  "function isProductAuthentic(string memory serialNumber) public view returns (bool)",
  "function getSellerInfo(address sellerAddress) public view returns (string memory name, string memory sellerCode, string memory brand, bool isRegistered)",
  "function getManufacturerInfo(string memory manufacturerId) public view returns (string memory name, address manufacturerAddress, bool isRegistered)"
];

// Connect to local Hardhat network
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Contract address (will be set after deployment)
let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Default Hardhat address
let contract = null;

// Initialize contract
async function initializeContract() {
  try {
    // Use the first Hardhat account's private key
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    const signer = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
    console.log('✅ Contract initialized with address:', contractAddress);
  } catch (error) {
    console.log('❌ Error initializing contract:', error.message);
  }
}

// Initialize contract on startup
initializeContract();

// API endpoints
app.post('/registerManufacturer', async (req, res) => {
  const { manufacturerId, name } = req.body;
  
  try {
    if (!contract) {
      return res.status(500).json({ success: false, message: 'Contract not initialized' });
    }

    const tx = await contract.registerManufacturer(manufacturerId, name);
    await tx.wait();
    
    res.json({ success: true, message: 'Manufacturer registered successfully' });
  } catch (error) {
    console.error('Error registering manufacturer:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/registerProduct', async (req, res) => {
  const { manufacturerId, productName, serialNumber, price, brand } = req.body;
  
  try {
    if (!contract) {
      return res.status(500).json({ success: false, message: 'Contract not initialized' });
    }

    const tx = await contract.registerProduct(manufacturerId, productName, serialNumber, ethers.parseEther(price.toString()), brand);
    await tx.wait();
    
    res.json({ success: true, productId: serialNumber, message: 'Product registered successfully' });
  } catch (error) {
    console.error('Error registering product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/addSeller', async (req, res) => {
  const { sellerCode, name, brand } = req.body;
  
  try {
    if (!contract) {
      return res.status(500).json({ success: false, message: 'Contract not initialized' });
    }

    const tx = await contract.addSeller(sellerCode, name, brand);
    await tx.wait();
    
    res.json({ success: true, message: 'Seller added successfully' });
  } catch (error) {
    console.error('Error adding seller:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/verifyProduct', async (req, res) => {
  const { productId } = req.body;
  
  try {
    if (!contract) {
      return res.status(500).json({ success: false, message: 'Contract not initialized' });
    }

    const productInfo = await contract.verifyProduct(productId);
    const isAuthentic = await contract.isProductAuthentic(productId);
    
    if (productInfo[6]) { // isRegistered
      res.json({
        exists: true,
        isAuthentic: isAuthentic,
        productInfo: {
          name: productInfo[0],
          brand: productInfo[1],
          price: ethers.formatEther(productInfo[2]),
          manufacturer: productInfo[3],
          currentOwner: productInfo[4],
          isAuthentic: productInfo[5],
          isRegistered: productInfo[6]
        }
      });
    } else {
      res.json({ exists: false, isAuthentic: false });
    }
  } catch (error) {
    console.error('Error verifying product:', error);
    res.status(500).json({ exists: false, message: error.message });
  }
});

app.get('/getSellerInfo/:address', async (req, res) => {
  const { address } = req.params;
  
  try {
    if (!contract) {
      return res.status(500).json({ success: false, message: 'Contract not initialized' });
    }

    const sellerInfo = await contract.getSellerInfo(address);
    
    res.json({
      success: true,
      sellerInfo: {
        name: sellerInfo[0],
        sellerCode: sellerInfo[1],
        brand: sellerInfo[2],
        isRegistered: sellerInfo[3]
      }
    });
  } catch (error) {
    console.error('Error getting seller info:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/getManufacturerInfo/:manufacturerId', async (req, res) => {
  const { manufacturerId } = req.params;
  
  try {
    if (!contract) {
      return res.status(500).json({ success: false, message: 'Contract not initialized' });
    }

    const manufacturerInfo = await contract.getManufacturerInfo(manufacturerId);
    
    res.json({
      success: true,
      manufacturerInfo: {
        name: manufacturerInfo[0],
        manufacturerAddress: manufacturerInfo[1],
        isRegistered: manufacturerInfo[2]
      }
    });
  } catch (error) {
    console.error('Error getting manufacturer info:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update contract address endpoint (for after deployment)
app.post('/updateContractAddress', (req, res) => {
  const { address } = req.body;
  contractAddress = address;
  initializeContract();
  res.json({ success: true, message: 'Contract address updated' });
});

// Serve index.html on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('🔗 Make sure Hardhat network is running on http://127.0.0.1:8545');
});