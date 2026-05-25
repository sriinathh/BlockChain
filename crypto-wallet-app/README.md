
# Crypto Wallet App

A full-stack crypto wallet web application with a React + Tailwind frontend and a Node.js + Express backend. The backend integrates with a Solidity smart contract (Hardhat) and provides REST endpoints to persist and query on-chain and off-chain transaction records.

This repo contains two main folders:
- [client](client): React frontend (pages, components, and service layer)
- [server](server): Express API, Mongoose models, Hardhat contracts, and deployment scripts

Core capabilities
- Connect and save a user's wallet address
- Query on-chain balance via a provider
- Send transactions from a server-side wallet (requires `PRIVATE_KEY`)
- Persist transaction records in MongoDB and expose paginated endpoints
- Compile and deploy `WalletStorage.sol` using Hardhat

Quick tech summary
- Frontend: React, Tailwind CSS, Axios, Ethers.js
- Backend: Node.js, Express, Mongoose, JWT auth, Ethers.js
- Smart contracts: Solidity, Hardhat

Prerequisites
- Node.js (16+ recommended)
- npm or yarn
- Local or remote MongoDB (optional — server can run without DB for frontend-only development)
- Hardhat for local blockchain testing/deployment

Install dependencies

```bash
# from repository root
cd client && npm install
cd ../server && npm install
```

Environment variables (server)
Create a `.env` file in `server/` with the values below. The server logs a warning and will run without MongoDB if `MONGO_URI` is not set, but some features will be disabled.

```
PORT=5000                   # optional, default 5000
MONGO_URI=mongodb://...     # MongoDB connection string (optional)
JWT_SECRET=your_jwt_secret  # required for auth-protected endpoints
SEPOLIA_RPC_URL=...         # JSON-RPC URL for sepolia (or your network)
PRIVATE_KEY=0x...           # private key used by server to send txs (DO NOT COMMIT)
```

Frontend config
- The client uses `REACT_APP_API_URL` (optional). If unset, it defaults to `http://localhost:5000`.

Running a local development environment

1) Start a local Hardhat node (optional, for blockchain interactions):

```bash
cd server
npx hardhat node
```

2) Deploy the `WalletStorage` contract to the node (in a separate terminal):

```bash
cd server
node scripts/deploy.js
```

3) Start the backend server

```bash
cd server
npm run dev
```

4) Start the React frontend

```bash
cd client
npm start
```

Server behavior notes
- If `MONGO_URI` is missing, the server issues a warning and continues — useful for frontend-only testing.
- The backend expects `JWT_SECRET` for any route protected by the `requireAuth` middleware.
- Provider and on-chain actions use `SEPOLIA_RPC_URL` and `PRIVATE_KEY` from the environment (see `server/utils/ethersProvider.js`).

API reference (high level)

- POST /api/auth/register
	- Body: `{ username, email, password }`
	- Returns: `{ success, token, user }` (201)

- POST /api/auth/login
	- Body: `{ email, password }`
	- Returns: `{ success, token, user }`

- POST /api/wallet/connect (auth)
	- Body: `{ address }` — saves a wallet address to the authenticated user

- GET /api/wallet/balance/:address
	- Returns the ether balance for `:address` (formatted string)

- POST /api/wallet/send (auth)
	- Body: `{ to, amount }` — sends transaction from server-side wallet (using `PRIVATE_KEY`)
	- Saves a pending transaction record in MongoDB

- GET /api/transactions/:wallet?page=1&limit=20 (auth)
	- Returns paginated on/off-chain transactions for a wallet

- POST /api/transactions/save
	- Body: `{ sender, receiver, amount, txHash, network, status }` — save transaction record

Data models (summary)
- User: `username`, `email`, `password` (hashed), `walletAddress`, `profileImage`, `createdAt`
- Transaction: `sender`, `receiver`, `amount`, `txHash`, `network` (default `sepolia`), `timestamp`, `status`

Smart contract
- `server/contracts/WalletStorage.sol` provides `saveTransaction` and a public `transactions` array. Use the Hardhat deploy script `server/scripts/deploy.js` to deploy the contract to your configured RPC.

Useful npm scripts
- Client (`client/package.json`): `start`, `build`, `test`
- Server (`server/package.json`): `start`, `dev` (nodemon), `hardhat`

Testing
- Run Hardhat tests (if present) from the `server/` folder:

```bash
cd server
npx hardhat test
```

Development tips
- To test wallet send flows locally, run a Hardhat node, deploy the contract, and configure `SEPOLIA_RPC_URL` to `http://127.0.0.1:8545` (Hardhat output). Use one of the test accounts' private keys (from Hardhat output) as `PRIVATE_KEY`.
- The client uses `client/src/services/api.js` to call the backend. You can set `REACT_APP_API_URL` to point to a remote server for testing.

Contributing
- Create issues for feature requests or bugs. Fork, implement, and open a PR. Please run tests and linters before submitting.

Where to look in the codebase
- Backend entry: [server/index.js](server/index.js)
- Auth routes: [server/routes/auth.js](server/routes/auth.js)
- Wallet & tx routes: [server/routes/wallet.js](server/routes/wallet.js) and [server/routes/transactions.js](server/routes/transactions.js)
- Hardhat scripts: [server/scripts/deploy.js](server/scripts/deploy.js)
- Smart contract: [server/contracts/WalletStorage.sol](server/contracts/WalletStorage.sol)
- Frontend API client: [client/src/services/api.js](client/src/services/api.js)

Next steps I can do for you
- Add an examples/usage section with screenshots or sample curl commands
- Add CI steps for running tests and linters
- Create a .env.example file with safe placeholders

If you'd like any of the above, tell me which one and I'll add it.
