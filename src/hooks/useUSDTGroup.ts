import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { addMessage, showLoding, decimalNum, NumSplic1 } from "../utils/tool";
import { t } from "i18next";
import { Contracts } from "../web3";
import { useNoGas } from "./useNoGas";
import useTipLoding from "../components/ModalContent";
import {
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from "@reown/appkit/react";

type AddressType = string;
type CoinAddressType = string;

export default function useUSDTGroup(
  contractAddress: AddressType,
  tokenAddress: CoinAddressType
) {
  const { walletProvider } = useAppKitProvider("eip155");
  console.log(contractAddress, tokenAddress, "-----");
  // debugger;
  const { address: web3ModalAccount, isConnected } = useAppKitAccount();

  const { caipNetwork, caipNetworkId, chainId, switchNetwork } =
    useAppKitNetwork();
  const [hash, setHash] = useState(0);
  const [TOKENBalance, setTOKENBalance] = useState("0");
  const [TOKENAllowance, setTOKENAllowance] = useState("0");
  const [symbol, setSymbol] = useState("");
  const { isNoGasFun } = useNoGas();

  /**
   *  TOKENBalance 余额
   */
  const initTOKENBalance = useCallback(async () => {
    if (!!web3ModalAccount && tokenAddress) {
      const balance = await Contracts.example?.balanceOf(
        web3ModalAccount,
        tokenAddress
      );
      // debugger;
      console.log(balance, "balance");

      setTOKENBalance(
        decimalNum(Web3.utils.fromWei(!!balance ? balance.toString() : "0"), 4)
      );
    }
  }, [web3ModalAccount, contractAddress, tokenAddress]);

  /**
   *  授权USDT
   */
  const handleApprove = useCallback(
    async (
      num: string,
      fun: any,
      onDoingFun = () => {},
      failFun = () => {}
    ) => {
      if (web3ModalAccount && tokenAddress) {
        // setTip("授权中");
        // setShowTipModal(true);
        try {
          if (!!(await isNoGasFun())) return;
          onDoingFun();
          const res = await Contracts.example?.approve(
            web3ModalAccount,
            contractAddress,
            tokenAddress,
            num
          );
          // const info = await res.wait();
          setHash(+new Date());
          // showLoding(false);
          // setShowTipModal(false);
          await fun(handleUSDTRefresh);
        } catch (error: any) {
          failFun();
          // debugger;
          // showLoding(false);
          // setShowTipModal(false);
          if (error?.code === 4001) {
            failFun();
            return addMessage(t("4"));
          }
        }
      }
    },
    [showLoding, tokenAddress, contractAddress, web3ModalAccount]
  );

  /**
   *  TOKENBalance 授权额度
   */
  const initTOKENAllowance = useCallback(async () => {
    if (!!web3ModalAccount && tokenAddress) {
      // debugger;
      const allowance = await Contracts.example?.Tokenapprove(
        web3ModalAccount,
        contractAddress,
        tokenAddress
      );
      setTOKENAllowance(
        Web3.utils.fromWei(!!allowance ? allowance.toString() : "0", "ether")
      );
    }
  }, [web3ModalAccount, contractAddress, tokenAddress]);

  /**
   *  TOKENBalance 授权额度
   */
  const initSymbol = useCallback(async () => {
    if (!!web3ModalAccount && tokenAddress) {
      const symbol = await Contracts.example?.symbol(
        web3ModalAccount,
        tokenAddress
      );
      setSymbol(symbol);
    }
  }, [web3ModalAccount, contractAddress, tokenAddress]);

  /**
   *  TOKENBalance 授权额度
   */
  const handleUSDTRefresh = useCallback(() => {
    setHash(+new Date());
  }, [tokenAddress, contractAddress]);

  const handleTransaction = useCallback(
    async (
      price: string,
      transactionCallBack: (refreshCall: () => void) => void,
      onDoingFun: () => void,
      failFun: () => void
    ) => {
      const balance = await Contracts.example?.balanceOf(
        web3ModalAccount as string,
        tokenAddress
      );
      if (
        Number(
          decimalNum(
            Web3.utils.fromWei(!!balance ? balance.toString() : "0"),
            4
          )
        ) >= Number(NumSplic1(price, 4))
      ) {
        if (Number(TOKENAllowance) >= Number(NumSplic1(price, 4))) {
          await transactionCallBack(handleUSDTRefresh);
        } else {
          await handleApprove(price, transactionCallBack, onDoingFun, failFun);
        }
      } else {
        // debugger
        addMessage(`${symbol} ${t("Insufficient balance")}`);
      }
    },
    [
      web3ModalAccount,
      handleApprove,
      symbol,
      handleUSDTRefresh,
      tokenAddress,
      contractAddress,
      TOKENBalance,
      TOKENAllowance,
      addMessage,
    ]
  );
  // 单币质押提取操作无需判断余额
  const withdrawHandleTransaction = useCallback(
    async (
      price: string,
      transactionCallBack: (refreshCall: () => void) => void,
      onDoingFun: () => void,
      failFun: () => void
    ) => {
      if (Number(TOKENAllowance) >= Number(price)) {
        await transactionCallBack(handleUSDTRefresh);
      } else {
        await handleApprove(price, transactionCallBack, onDoingFun, failFun);
      }
    },
    [
      web3ModalAccount,
      handleApprove,
      symbol,
      handleUSDTRefresh,
      tokenAddress,
      contractAddress,
      TOKENBalance,
      TOKENAllowance,
      addMessage,
    ]
  );

  useEffect(() => {
    new Contracts(walletProvider);
    if (!!web3ModalAccount && tokenAddress) {
      initTOKENBalance();
      initTOKENAllowance();
      initSymbol();
    }
  }, [web3ModalAccount, hash, tokenAddress, contractAddress, chainId]);

  return {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
    withdrawHandleTransaction,
  };
}
