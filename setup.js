#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Fake Product Identification DApp...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js v16 or higher.');
  process.exit(1);
}

// Check if npm is installed
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' });
  console.log(`✅ npm version: ${npmVersion.trim()}`);
} catch (error) {
  console.error('❌ npm is not installed. Please install npm.');
  process.exit(1);
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Main dependencies installed');
  
  // Install my-dapp dependencies
  if (fs.existsSync('my-dapp')) {
    console.log('📦 Installing Hardhat dependencies...');
    execSync('cd my-dapp && npm install', { stdio: 'inherit' });
    console.log('✅ Hardhat dependencies installed');
  }
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Compile contracts
console.log('\n🔨 Compiling smart contracts...');
try {
  execSync('npm run compile', { stdio: 'inherit' });
  console.log('✅ Smart contracts compiled successfully');
} catch (error) {
  console.error('❌ Failed to compile contracts:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start the local blockchain: npm run node');
console.log('2. Deploy smart contracts: npm run deploy');
console.log('3. Start the server: npm start');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n📖 For detailed instructions, see README.md');