import { useWeb3React } from "@web3-react/core";
import { t } from "i18next";
import { draw, drawAward } from "../API";
import { addMessage, showLoding } from "../utils/tool";
import { Contracts } from "../web3";
import { useSelector } from "react-redux";
import { useAppKitAccount } from "@reown/appkit/react";
export const useGetReward = () => {
  const token = useSelector<any>((state) => state?.token);
  const { account } = useWeb3React();
  const { address: web3ModalAccount, isConnected } = useAppKitAccount();
  function getReward(
    callbackFun: any,
    contractAddress: string,
    data: any,
    onDoing: any,
    onFailed: any
  ) {
    if (!web3ModalAccount) return addMessage(t("Please Connect wallet"));
    if (!token) return addMessage(t("1"));
    draw(data).then(async (res: any) => {
      onDoing();
      if (res?.code === 200) {
        let value: any = null;
        try {
          value = await Contracts.example.withdrawReward(
            web3ModalAccount as string,
            res?.data,
            contractAddress
          );
        } catch (error: any) {
          onFailed();
          if (error?.code === 4001) {
            return addMessage(t("failed"));
          }
        }
        onFailed();
        if (!!value?.status) {
          // addMessage(t("Received successfully"));
          await callbackFun();
        } else if (value?.status === false) {
          onFailed();
          // addMessage(t("failed"));
        }
      } else {
        onFailed();
        addMessage(res.msg);
      }
    });
  }
  return { getReward };
};
