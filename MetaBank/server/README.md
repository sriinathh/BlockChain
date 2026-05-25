# MetaBank Server

Quick setup and run instructions for the server backend.

Prerequisites:
- Node.js 18+ and npm
- MongoDB running locally or a MongoDB URI
- (Optional) Hardhat for local blockchain: `npm install --global hardhat`

1) Install dependencies

```bash
cd server
npm install
```

2) Configure environment

Copy `.env.example` to `.env` and fill values (MONGO_URI, JWT_SECRET, RPC URLs, PRIVATE_KEY).

3) Start a local blockchain (optional, for contracts)

```bash
# from server/
npx hardhat node
# or run a local Ganache instance
```

4) Deploy contracts (optional)

```bash
npx hardhat run scripts/deploy.js --network localhost
```

5) Start the server

```bash
npm run dev
# or
npm start
```

6) Client integration

The client expects these endpoints:
- `GET /api/auth/nonce?address=0x...` — returns a nonce for wallet signature
- `POST /api/auth/verify-wallet` — verify signed message and return JWT
- `POST /api/wallet/connect` — register a wallet for a user
- `GET /api/wallet/balance/:address` — return ETH balance

If you want me to install dependencies and start the server locally, tell me and I'll run the commands.
