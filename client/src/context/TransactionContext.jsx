import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";
export const TransactionContext = React.createContext();

const getEthereum = () => window.ethereum;

const createEthereumContract = async () => {
  const ethereum = getEthereum();
  if (!ethereum) {
    console.log("Ethereum object not found when creating contract");
    return null;
  }

  // Support ethers v5 and v6 providers
  if (ethers.providers && ethers.providers.Web3Provider) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionsContract;
  }

  if (ethers.BrowserProvider) {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionsContract;
  }

  console.log('Unsupported ethers version');
  return null;
};

export const TransactionProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      const ethereum = getEthereum();
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        if (!transactionsContract) return;

        const availableTransactions = await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }));

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      const ethereum = getEthereum();
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      const ethereum = getEthereum();
      if (ethereum) {
        const transactionsContract = await createEthereumContract();
        if (!transactionsContract) return;
        const currentTransactionCount = await transactionsContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);
      // avoid throwing to prevent uncaught exceptions in UI event handlers
    }
  };

  const connectWallet = async () => {
    try {
      const ethereum = getEthereum();
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      console.log(error);
      // avoid throwing to prevent uncaught exceptions in UI event handlers
    }
  };

  const sendTransaction = async () => {
    try {
      const ethereum = getEthereum();
      if (ethereum) {
        const { addressTo, amount, keyword, message } = formData;
        const transactionsContract = await createEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
          method: "eth_sendTransaction",
          params: [{
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 21000 Gwei
            value: parsedAmount._hex,
          }],
        });

        // Call contract to record the transaction details on-chain (if required by your contract)
        if (transactionsContract) {
          const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

          setIsLoading(true);
          console.log(`Loading - ${transactionHash.hash}`);
          await transactionHash.wait();
          console.log(`success ${transactionHash.hash}`);
          setIsLoading(false);

          const transactionsCount = await transactionsContract.getTransactionCount();

          setTransactionCount(transactionsCount.toNumber());
          // optionally reload or update state
          window.location.reload();
        } else {
          console.log("Transactions contract not available");
        }
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      // avoid throwing to prevent uncaught exceptions in UI event handlers
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
