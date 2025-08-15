const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ProductAuth contract...");

  // Get the contract factory
  const ProductAuth = await hre.ethers.getContractFactory("ProductAuth");
  
  // Deploy the contract
  const productAuth = await ProductAuth.deploy();
  
  // Wait for deployment to finish
  await productAuth.waitForDeployment();
  
  // Get the deployed contract address
  const address = await productAuth.getAddress();
  
  console.log("✅ ProductAuth deployed to:", address);
  console.log("📝 Contract address for backend:", address);
  
  // Verify the contract on Etherscan (if not on local network)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Contract verification failed:", error.message);
    }
  }
  
  return address;
}

// Handle errors
main()
  .then((address) => {
    console.log("🎉 Deployment completed successfully!");
    console.log("📋 Next steps:");
    console.log("1. Update the contract address in src/index.js");
    console.log("2. Start the backend server: node src/index.js");
    console.log("3. Start Hardhat network: npx hardhat node");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });