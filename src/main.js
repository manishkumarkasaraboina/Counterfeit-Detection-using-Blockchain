// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      btn.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });

  // Check system status
  checkSystemStatus();
});

// System status check
async function checkSystemStatus() {
  const blockchainStatus = document.getElementById('blockchainStatus');
  const contractStatus = document.getElementById('contractStatus');

  try {
    // Check if server is running
    const response = await axios.get('http://localhost:3000/');
    blockchainStatus.textContent = 'Connected';
    blockchainStatus.className = 'status-connected';
    
    // Check contract status
    try {
      const contractResponse = await axios.post('http://localhost:3000/verifyProduct', {
        productId: 'test'
      });
      contractStatus.textContent = 'Ready';
      contractStatus.className = 'status-connected';
    } catch (error) {
      contractStatus.textContent = 'Error';
      contractStatus.className = 'status-error';
    }
  } catch (error) {
    blockchainStatus.textContent = 'Disconnected';
    blockchainStatus.className = 'status-error';
    contractStatus.textContent = 'Unavailable';
    contractStatus.className = 'status-error';
  }
}

// ==========================
// Register Manufacturer Form
// ==========================
document.getElementById("registerManufacturerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const manufacturerId = document.getElementById("manufacturerId").value;
  const manufacturerName = document.getElementById("manufacturerName").value;
  const resultDiv = document.getElementById("manufacturerResult");

  // Show loading state
  resultDiv.innerHTML = '<div class="loading"></div> Registering manufacturer...';
  resultDiv.className = 'info';

  try {
    const response = await axios.post("http://localhost:3000/registerManufacturer", {
      manufacturerId,
      name: manufacturerName
    });

    if (response.data.success) {
      resultDiv.innerHTML = `✅ ${response.data.message}`;
      resultDiv.className = 'success';
      
      // Clear form
      document.getElementById("registerManufacturerForm").reset();
    } else {
      resultDiv.innerHTML = `❌ ${response.data.message}`;
      resultDiv.className = 'error';
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `❌ Error: ${error.response?.data?.message || error.message}`;
    resultDiv.className = 'error';
  }
});

// ==========================
// Register Product Form
// ==========================
document.getElementById("registerProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const manufacturerId = document.getElementById("productManufacturerId").value;
  const productName = document.getElementById("productName").value;
  const serialNumber = document.getElementById("serialNumber").value;
  const price = document.getElementById("price").value;
  const brand = document.getElementById("brand").value;
  const resultDiv = document.getElementById("productResult");

  // Show loading state
  resultDiv.innerHTML = '<div class="loading"></div> Registering product on blockchain...';
  resultDiv.className = 'info';

  try {
    const response = await axios.post("http://localhost:3000/registerProduct", {
      manufacturerId,
      productName,
      serialNumber,
      price,
      brand
    });

    if (response.data.success) {
      resultDiv.innerHTML = `✅ ${response.data.message}`;
      resultDiv.className = 'success';

      // Generate QR Code
      const qrDiv = document.getElementById("qrCode");
      qrDiv.innerHTML = "";
      new QRCode(qrDiv, {
        text: serialNumber,
        width: 200,
        height: 200,
        colorDark: "#667eea",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

      // Clear form
      document.getElementById("registerProductForm").reset();
    } else {
      resultDiv.innerHTML = `❌ ${response.data.message}`;
      resultDiv.className = 'error';
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `❌ Error: ${error.response?.data?.message || error.message}`;
    resultDiv.className = 'error';
  }
});

// ==========================
// Add Seller Form
// ==========================
document.getElementById("addSellerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const sellerCode = document.getElementById("sellerCode").value;
  const sellerName = document.getElementById("sellerName").value;
  const brand = document.getElementById("brandSeller").value;
  const resultDiv = document.getElementById("sellerResult");

  // Show loading state
  resultDiv.innerHTML = '<div class="loading"></div> Registering seller...';
  resultDiv.className = 'info';

  try {
    const response = await axios.post("http://localhost:3000/addSeller", {
      sellerCode,
      name: sellerName,
      brand
    });

    if (response.data.success) {
      resultDiv.innerHTML = `✅ ${response.data.message}`;
      resultDiv.className = 'success';
      
      // Clear form
      document.getElementById("addSellerForm").reset();
    } else {
      resultDiv.innerHTML = `❌ ${response.data.message}`;
      resultDiv.className = 'error';
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `❌ Error: ${error.response?.data?.message || error.message}`;
    resultDiv.className = 'error';
  }
});

// ==========================
// Verify Product Form
// ==========================
document.getElementById("verifyProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const productId = document.getElementById("verifyProductId").value;
  const resultDiv = document.getElementById("verificationResult");

  // Show loading state
  resultDiv.innerHTML = '<div class="loading"></div> Verifying product on blockchain...';
  resultDiv.className = 'info';

  try {
    const response = await axios.post("http://localhost:3000/verifyProduct", {
      productId
    });

    if (response.data.exists) {
      const productInfo = response.data.productInfo;
      const badgeClass = response.data.isAuthentic ? 'badge-authentic' : 'badge-fake';
      const badgeText = response.data.isAuthentic ? 'AUTHENTIC' : 'FAKE';
      
      resultDiv.innerHTML = `
        <div class="product-info">
          <h4>Product Verification Result</h4>
          <span class="badge ${badgeClass}">${badgeText}</span>
          
          <p><span class="label">Product Name:</span> <span class="value">${productInfo.name}</span></p>
          <p><span class="label">Brand:</span> <span class="value">${productInfo.brand}</span></p>
          <p><span class="label">Price:</span> <span class="value">${productInfo.price} ETH</span></p>
          <p><span class="label">Manufacturer:</span> <span class="value">${productInfo.manufacturer}</span></p>
          <p><span class="label">Current Owner:</span> <span class="value">${productInfo.currentOwner}</span></p>
          <p><span class="label">Registration Status:</span> <span class="value">${productInfo.isRegistered ? 'Registered' : 'Not Registered'}</span></p>
        </div>
      `;
      resultDiv.className = response.data.isAuthentic ? 'success' : 'error';
    } else {
      resultDiv.innerHTML = `
        <div class="product-info">
          <h4>Product Verification Result</h4>
          <span class="badge badge-fake">FAKE</span>
          <p>❌ This product is not registered on the blockchain. It may be counterfeit or not yet registered.</p>
        </div>
      `;
      resultDiv.className = 'error';
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `
      <div class="product-info">
        <h4>Verification Error</h4>
        <p>❌ Error: ${error.response?.data?.message || error.message}</p>
      </div>
    `;
    resultDiv.className = 'error';
  }
});

// Auto-refresh system status every 30 seconds
setInterval(checkSystemStatus, 30000);