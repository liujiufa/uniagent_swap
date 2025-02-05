import { useWeb3React } from "@web3-react/core";
import { addMessage, showLoding } from "../utils/tool";
import { Contracts } from "../web3";
import { useEffect } from "react";
import useConnectWallet from "./useConnectWallet";
import { useTranslation } from "react-i18next";
import { useAppKitAccount } from "@reown/appkit/react";
export const useNoGas = () => {
  const {
    address: web3ModalAccount,
    isConnected,
  } = useAppKitAccount();
  const { t } = useTranslation();
  async function isNoGasFun() {
    if (!web3ModalAccount) return addMessage(t("Please Connect wallet"));

    let BNBBalance = await Contracts?.example?.getBalance(web3ModalAccount);
    let gasPrice = await Contracts?.example?.getGasPrice(web3ModalAccount);
    if (Number(BNBBalance) < Number(gasPrice)) {
      addMessage(t("2"));
      showLoding(false);

      return true;
    } else {
      return false;
    }
  }
  return { isNoGasFun };
};
