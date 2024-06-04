import { createContext, useEffect, useState } from "react";
import { accessListify, ethers, namehash, utils } from "ethers";
import ContractABI from "./abi.json";
import { deployedContractAddress } from "../utils/key";
const { ethereum } = window;

export const Web3ApiContext = createContext();

let contractAddress = deployedContractAddress;

const getContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(
    contractAddress,
    ContractABI.abi,
    signer
  );

  return contract;
};

const Web3ApiProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setConnectedAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object found!");
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install Metamask");

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setConnectedAccount(accounts[0]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const Disconnect = () => {
    setConnectedAccount("0x0");
  };

  const LodgeFIR = async () => {
    // if (!name && !accusedName && !description && !district && !thana) {
    //   console.log("Fill all the necessary fields");
    //   return;
    // }
    try {

      const tx = await getContract();
      const data = await tx.lodgeFir(
        "Mr. X",
        "Mr. Y",
        "Murder",
        "Description",
        "West Bengal",
        "Hooghly",
        "0xa73D1330Ac56A106527Eaa00c458C44101Db852e",
        "http://fileid",
        123,
        "pending"
      );
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFIRbyThana = async () => {
    try {
      const tx = await getContract();
      
      // Fetch FIR IDs
      const firIds = await tx.getThanaFIRs();
      
      // Fetch details for each FIR ID
      const firDetailsPromises = firIds.map(id => tx.getFIRDetails(id));
      const firDetails = await Promise.all(firDetailsPromises);
  
      // Map FIR details to structured objects
      const firs = firDetails.map(e => ({
        victimName: e.victimName,
        accusedNames: e.accusedNames,
        subject: e.subject,
        description: e.description,
        state: e.state,
        district: e.district,
        thanaAddress: e.thanaAddress,
        documentHash: e.documentHash,
        firId: e.firId.toString(),
        lodgedBy: e.lodgedBy,
        timestamp: e.timestamp.toString(), 
        status: e.status
      }));
  
      return firs;
    } catch (error) {
      console.log(error);
    }
  }

  const getFIRbyVictim = async () => {
    try {
      const tx = await getContract();
      
      // Fetch FIR IDs
      const firIds = await tx.getMyFIRs();
      
      // Fetch details for each FIR ID
      const firDetailsPromises = firIds.map(id => tx.getFIRDetails(id));
      const firDetails = await Promise.all(firDetailsPromises);
  
      // Map FIR details to structured objects
      const firs = firDetails.map(e => ({
        victimName: e.victimName,
        accusedNames: e.accusedNames,
        subject: e.subject,
        description: e.description,
        state: e.state,
        district: e.district,
        thanaAddress: e.thanaAddress,
        documentHash: e.documentHash,
        firId: e.firId.toString(),
        lodgedBy: e.lodgedBy,
        timestamp: e.timestamp.toString(), 
        status: e.status
      }));
      console.log(firs)
      return firs;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      checkIfWalletIsConnected();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <Web3ApiContext.Provider
      value={{
        connectWallet,
        connectedAccount,
        checkIfWalletIsConnected,
        Disconnect,
        LodgeFIR,
        getFIRbyThana,
        getFIRbyVictim
      }}
    >
      {children}
    </Web3ApiContext.Provider>
  );
};

export default Web3ApiProvider;
