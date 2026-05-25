# LandChain Troubleshooting & Setup Guide

Welcome to the **LandChain** project. This document addresses the common development errors you encountered regarding MetaMask connectivity, login unauthorized status (401), and registration bad requests (400).

---

## 🛠️ 1. MetaMask Connectivity Issues

### **Error Logged**
```
inpage.js:1 Uncaught (in promise) i: Failed to connect to MetaMask
    at Object.connect (inpage.js:1:72086)
Caused by: Error: MetaMask extension not found
```

### **Why it Happens**
Your browser is attempting to invoke the Web3 provider API (`window.ethereum`) to sign smart contract transactions, but the **MetaMask extension** is either not installed, not active, or disabled in your browser.

### **How to Resolve**
1. **Install MetaMask**:
   - Download and install the MetaMask extension for your web browser (Chrome, Edge, Firefox, Brave) from the official website: [metamask.io](https://metamask.io).
2. **Create/Import a Wallet**:
   - Follow the MetaMask setup steps to initialize a wallet.
3. **Configure Local Hardhat Network in MetaMask**:
   - Open MetaMask, click the Network selector (top left), and select **Add Network** -> **Add a network manually**.
   - Fill in the following details:
     * **Network Name**: `Hardhat Localhost`
     * **New RPC URL**: `http://127.0.0.1:8545`
     * **Chain ID**: `1337` (or `31337` depending on the node configuration)
     * **Currency Symbol**: `ETH`
4. **Import a Pre-funded Account**:
   - Hardhat boots with 20 pre-funded test accounts loaded with `10,000 ETH` each.
   - You can copy the private key of the first account from the Hardhat CLI output and import it into MetaMask (Click account icon -> **Import Account** -> paste the private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`).

---

## 📋 2. Registration "400 (Bad Request)" Errors

### **Error Logged**
```
POST http://localhost:5000/api/auth/register 400 (Bad Request)
```

### **Why it Happens**
The Express backend enforces strict input validation using the `express-validator` library. If any of the sent fields do not match the expected formats, regex, or length constraints, the server rejects the request with a `400 Bad Request` and sends back the validation errors.

### **Expected Field Formats**
To successfully register a new account, ensure your request body matches these exact validation rules:

| Field Name | Type / Format | Validation Rule / Regex | Example |
| :--- | :--- | :--- | :--- |
| **`name`** | String | Cannot be empty, whitespace trimmed | `John Doe` |
| **`email`** | String (Email) | Must be a valid email format | `john@example.com` |
| **`phone`** | String (Regex) | `^\+?[0-9\s-]{10,15}$` (10 to 15 digits, spaces/dashes/optional + allowed) | `9876543210` or `+91 98765-43210` |
| **`aadhaar`** | String (Regex) | `^\d{4}-\d{4}-\d{4}$` (Must be formatted with hyphens) | `1234-5678-9012` |
| **`wallet`** | String (Hex) | `^0x[a-fA-F0-9]{40}$` (Valid 42-character Ethereum public key) | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| **`password`** | String | Minimum length of **6 characters** | `secure123` |

### **Common Mistakes**
* **Aadhaar format**: Registering with a raw 12-digit number (e.g. `123456789012`) instead of hyphens (`1234-5678-9012`).
* **Wallet**: Providing a wallet address that is empty or does not start with `0x` followed by exactly 40 hexadecimal characters.
* **Password**: Providing a signature password shorter than 6 characters.

---

## 🔐 3. Login "401 (Unauthorized)" Errors

### **Error Logged**
```
POST http://localhost:5000/api/auth/login 401 (Unauthorized)
```

### **Why it Happens**
The login credentials provided do not match any existing record in MongoDB, or the password verification failed.

### **Required Login Payload**
Login expects the following fields:
* **`aadhaar`**: String in format `XXXX-XXXX-XXXX`
* **`password`**: String password

### **How to Resolve**
1. Make sure you are using the correct **Aadhaar Number** format (`XXXX-XXXX-XXXX`) and the exact password you used during registration.
2. If you haven't successfully registered an account (due to a previous 400 Bad Request error), you must first resolve the registration inputs and successfully create the account before attempting to log in.

---

## 🚀 4. Quick Run Instructions

Make sure your developer stacks are run in the following sequence:

### **Step 1: Start Blockchain Node**
```bash
cd blockchain
npm run dev
```
Starts a local Hardhat node on `http://127.0.0.1:8545`.

### **Step 2: Deploy Contracts**
```bash
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```
Deploys the smart contracts and writes the dynamic ABIs to client and server folders.

### **Step 3: Start Node/Express API Server**
```bash
cd server
npm run dev
```
Connects to MongoDB and the local Hardhat blockchain.

### **Step 4: Start Frontend Client**
```bash
cd client
npm start
```
Starts the Vite developer portal on `http://localhost:5173/`. Open this link in a browser that has the MetaMask extension installed!
