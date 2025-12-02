Krypt — Blockchain-based application for sending and storing Ethereum transactions
Repo: blockchain-based-application-for-sending-and-storing-Ethereum

Live Demo:


Short Description:
Purpose: A lightweight Web3 DApp that lets users connect a MetaMask wallet, send ETH with a short message/keyword, and persist compact transaction metadata on-chain via a simple Solidity contract. The frontend is a React + Vite app styled with Tailwind; the smart contract is built and deployed with Hardhat and interacted with using ethers.js.
Features

Wallet integration: Connect MetaMask from the browser.
Send ETH: Compose a recipient, amount, message, and keyword; sign & send with MetaMask.
On-chain metadata: A Solidity contract stores concise transaction records (sender, receiver, amount, message, keyword, timestamp).
Transaction feed: Frontend displays transactions (with timestamps and Etherscan/local explorer links).
Local development: Run a local Hardhat node for fast testing.

Tech stack
Smart contract: Solidity (Hardhat)
Frontend: React + Vite, TypeScript/JS mix, Tailwind CSS
Wallet / RPC: MetaMask, window.ethereum
Blockchain lib: ethers (v6 compatible)
Local node: Hardhat node (localhost:8545)
Repository layout (key paths)

smart_contract — Hardhat project
Transactions.sol — Solidity contract
deploy.js — deployment script
artifacts/ — compiled artifacts (contains ABI JSON)
client — React + Vite frontend
TransactionContext.jsx — wallet/contract logic
src/components/Welcome.tsx — send form + UI
constants.js — contract ABI import & address used by frontend
src/utils/Transactions.json — ABI (should match compiled artifact)

Start the frontend
Open the Vite URL (e.g., http://localhost:5173), click Connect Wallet, fill the form and click Send now. Approve the MetaMask prompt to send.

Contributing & Extensibility
You can extend the contract to store richer metadata or move large metadata off-chain (IPFS) and store hashes on-chain.
Add WalletConnect or other providers for mobile wallet support.
Add event listeners in the frontend for contract events to avoid polling for getAllTransactions().
