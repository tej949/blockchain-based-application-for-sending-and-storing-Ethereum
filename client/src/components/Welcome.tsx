import React, { useContext } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import Loader from "./Loader";

const companyCommonStyles =
  "min-h-[70px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.0001"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const context = useContext(TransactionContext);
  if (!context) return null;

  const {
    currentAccount,
    connectWallet,
    handleChange,
    sendTransaction,
    formData,
    isLoading,
  } = context;

  const handleSubmit = (e) => {
    e.preventDefault();

    const { addressTo, amount, keyword, message } = formData;
    if (!addressTo || !amount || !keyword || !message) return;

    sendTransaction({ addressTo, amount, keyword, message });
  };

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">

        <div className="flex flex-1 flex-col mf:mr-10">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient py-1">
            Send Crypto <br /> across the world
          </h1>

          <p className="text-left mt-5 text-white font-light md:w-9/12">
            Explore the crypto world. Buy and sell cryptocurrencies easily.
          </p>

          {!currentAccount && (
            <button
              type="button"
              onClick={connectWallet}
              className="flex items-center my-5 bg-[#2952e3] p-3 rounded-full hover:bg-[#2546bd]"
            >
              <AiFillPlayCircle className="text-white mr-2" />
              <span className="text-white font-semibold">Connect Wallet</span>
            </button>
          )}

          <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
            {["Reliability", "Security", "Ethereum", "Web 3.0", "Low Fees", "Blockchain"].map((item) => (
              <div key={item} className={companyCommonStyles}>{item}</div>
            ))}
          </div>
        </div>

        <div className="flex flex-col flex-1 items-center mt-10">
          <div className="p-3 rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
            <div className="flex justify-between h-full flex-col">
              <div className="flex justify-between">
                <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                  <SiEthereum color="#fff" />
                </div>
                <BsInfoCircle color="#fff" />
              </div>

              <p className="text-white text-sm">
                {currentAccount ? shortenAddress(currentAccount) : "Not connected"}
              </p>
              <p className="text-white font-semibold">Ethereum</p>
            </div>
          </div>

          <div className="p-5 sm:w-96 w-full blue-glassmorphism">
            <Input placeholder="Address To" name="addressTo" type="text" value={formData.addressTo} handleChange={handleChange} />
            <Input placeholder="Amount (ETH)" name="amount" type="number" value={formData.amount} handleChange={handleChange} />
            <Input placeholder="Keyword" name="keyword" type="text" value={formData.keyword} handleChange={handleChange} />
            <Input placeholder="Message" name="message" type="text" value={formData.message} handleChange={handleChange} />

            {isLoading ? <Loader /> : (
              <button
                onClick={handleSubmit}
                className="text-white w-full mt-2 border p-2 rounded-full hover:bg-[#3d4f7c]"
              >
                Send now
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Welcome;