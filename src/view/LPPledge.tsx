import React, { useState, useEffect, useRef } from "react";
import "../assets/style/Home.scss";
import Table from "../components/Table";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";
import { stateType } from "../store/reducer";
import styled, { keyframes } from "styled-components";
import { useViewport } from "../components/viewportContext";
import {
  AddrHandle,
  EthertoWei,
  NumSplic,
  NumSplic1,
  addMessage,
  dateFormat,
  decimalNum,
  getFullNum,
  thousandsSeparator,
} from "../utils/tool";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ContainerBox,
  FlexBox,
  FlexCCBox,
  FlexECBox,
  FlexSACBox,
  FlexSBCBox,
  FlexSCBox,
} from "../components/FlexBox";
import toIcon from "../assets/image/Swap/toIcon.svg";
import dropdownIcon from "../assets/image/Swap/dropdownIcon.svg";
import addIcon from "../assets/image/Swap/addIcon.png";
import nodata from "../assets/image/Swap/nodata.png";
import setIcon from "../assets/image/Swap/setIcon.svg";
import piIcon from "../assets/image/Swap/piIcon.png";
import usdtIcon from "../assets/image/Swap/usdtIcon.png";
import pijsIcon from "../assets/image/Swap/pijsIcon.png";
import uacIcon from "../assets/image/Swap/uacIcon.png";
import swapBanner from "../assets/image/Swap/swapBanner.png";
import MainBg from "../assets/image/layout/MainBg.png";
import mainBgMobile from "../assets/image/layout/mainBgMobile.png";
import pledge_bg from "../assets/image/Pledge/pledge_bg.png";

import copyFun from "copy-to-clipboard";
import { Contracts } from "../web3";
import useUSDTGroup from "../hooks/useUSDTGroup";
import { contractAddress, curentBSCChainId, curentUNIChainId } from "../config";
import { createLoginSuccessAction } from "../store/actions";
import { useNoGas } from "../hooks/useNoGas";
import ModalContent from "../components/ModalContent";
import ModalContentSuccess from "../components/ModalContentSuccess";
import SelectTokensModal from "../components/SelectTokensModal";

import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitState,
  useDisconnect,
} from "@reown/appkit/react";
import Web3 from "web3";
import { isNumber } from "lodash";
import AddLiquidityModalContentSuccess from "../components/AddLiquidityModalContentSuccess";
import { Modal } from "antd";
import Footer from "../components/Footer";
import PriceChart from "../components/PriceChart";
const HomeContainerBox = styled.div<{ src: string }>`
  padding-top: 64px;
  width: 100%;
  /* min-height: 100vh; */
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: cover; //根据你图片的大小自定义
  background-repeat: no-repeat;
  overflow: hidden;
  > div {
    &:first-child {
      display: flex;
      align-items: center;
      flex-direction: column;
      min-height: calc(100vh - 320px);
      height: 100%;
      width: 100%;
      max-width: 778px;
      padding: 94px 15px 127px;
      width: 100%;
      margin: auto;
      @media (max-width: 1200px) {
        padding: 0px 15px 226px;
      }
    }
  }

  @media (max-width: 1400px) {
    background-size: 100% 100%;
  }
`;
export const GameTooltip = styled.div``;
const SwapContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  opacity: 1;
  background: #1f2021;
  box-sizing: border-box;
  border: 1px solid #232323;
  backdrop-filter: blur(143px);
  @media (max-width: 768px) {
    margin-top: 15px;
    padding: 24px 11px;
  }
`;

const SwapContainer_Title = styled(FlexBox)`
  align-items: center;
  font-family: "Space Grotesk";
  font-size: 24px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #f4c134;
  > img {
    margin-right: 14px;
  }
  @media (max-width: 768px) {
    font-family: "Space Grotesk";
    font-size: 18px;
    font-weight: bold;
    line-height: 18px;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #f4c134;
    > img {
      margin-right: 8px;
    }
  }
`;
const SwapItem = styled.div``;

const SwapItemBottom = styled.div`
  margin-top: 36px;
  @media (max-width: 768px) {
    margin-top: 24px;
  }
`;

const SwapItem_Title = styled(FlexSBCBox)`
  font-family: MiSans;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #bcc6cf;
  margin: 36px 0px 15px;

  span {
    font-family: MiSans;
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    text-align: right;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #c8c8c8;
  }
  @media (max-width: 768px) {
    margin: 24px 0px 10px;
    font-size: 16px;
    span {
    }
  }
`;
const Btn = styled(FlexCCBox)<{ isActive: boolean }>`
  cursor: pointer;
  margin: 36px 0px;
  padding: 12px;
  font-family: "Space Grotesk";
  font-size: 16px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #0a0a0a;
  border-radius: 6px;
  opacity: 1;
  background: ${({ isActive }) => (isActive ? "#F4C134" : "#876D28")};
  @media (max-width: 768px) {
    margin: 32px 0px 0px;
    font-family: "Space Grotesk";
    font-size: 16px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #0a0a0a;
  }
`;
const LiquidityItem = styled.div`
  padding: 24px;
  border-radius: 16px;
  opacity: 1;
  background: #000000;
  > input {
    font-family: MiSans;
    font-size: 32px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #bcc6cf;
    background: transparent;
    outline: none;
    border: none;
  }
  @media (max-width: 768px) {
    padding: 14px;
    > input {
      font-family: MiSans;
      font-size: 28px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
  }
`;
const PercentageBox = styled(FlexBox)`
  margin-top: 68px;
  align-items: center;
  > div {
    padding: 6px 30px;
    border-radius: 24px;
    opacity: 1;
    background: #383e45;
    font-family: MiSans;
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    text-align: center;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #c8c8c8;
    margin-right: 8px;
  }
  @media (max-width: 768px) {
    margin-top: 60px;
    > div {
      border-radius: 24px;
      opacity: 1;
      background: #383e45;
      padding: 6px 24px;
      font-family: MiSans;
      font-size: 14px;
      font-weight: 500;
      line-height: normal;
      text-align: center;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #c8c8c8;
    }
  }
  @media (max-width: 375px) {
    flex-wrap: wrap;
    > div {
      margin-top: 6px;
    }
  }
`;

const MyHold = styled(FlexBox)`
  align-items: flex-end;
  justify-content: space-between;
  width: fit-content;
  margin-bottom: 298px;
  > div {
    font-family: MiSans;
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #c8c8c8;
    .value {
      margin-top: 13px;
      padding: 0 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 12px;
      opacity: 1;
      background: #383e45;
      height: 54px;
      font-family: MiSans;
      font-size: 18px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
    .oddValue {
      padding: 0 16px;
      background: transparent;
    }
  }
  @media (max-width: 768px) {
    margin-bottom: 130px;

    > div {
      font-family: MiSans;
      font-size: 12px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #c8c8c8;
      .value {
        margin-top: 8px;
        height: 44px;
        padding: 0px 10px;
        font-family: MiSans;
        font-size: 13px;
        font-weight: 500;
        line-height: normal;
        text-align: center;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #ffffff;
      }
    }
  }
  @media (max-width: 375px) {
    flex-wrap: wrap;
    justify-content: flex-start;
    > div {
      margin-top: 8px;
    }
  }
`;

export let tokenList: any = [
  {
    icon: usdtIcon,
    name: "USDT",
    tokenAddress: contractAddress?.USDTUNI,
    symbol: "Tether USD",
    chainId: curentUNIChainId,
    contractAddress: contractAddress?.UACFactory,
    Router: contractAddress?.UACRouter,
  },
  {
    icon: uacIcon,
    name: "UAC",
    tokenAddress: contractAddress?.WUAC,
    symbol: "UniAgent",
    chainId: curentUNIChainId,
    contractAddress: contractAddress?.UACFactory,
    Router: contractAddress?.UACRouter,
  },
  {
    icon: pijsIcon,
    name: "PIJS",
    tokenAddress: contractAddress?.PIJSBSC,
    symbol: "PIJS",
    chainId: curentBSCChainId,
    contractAddress: contractAddress?.PIJSFactory,
    Router: contractAddress?.PIJSRouter,
  },
  {
    icon: usdtIcon,
    name: "USDT",
    tokenAddress: contractAddress?.USDTBSC,
    symbol: "Tether USD",
    chainId: curentBSCChainId,
    contractAddress: contractAddress?.PIJSFactory,
    Router: contractAddress?.PIJSRouter,
  },
  {
    icon: piIcon,
    name: "Pi",
    tokenAddress: contractAddress?.PiBSC,
    symbol: "Pi Network",
    chainId: curentBSCChainId,
    contractAddress: contractAddress?.PIJSFactory,
    Router: contractAddress?.PIJSRouter,
  },
];
let timer: any = null;
export default function Rank() {
  const { width } = useViewport();
  const { t, i18n } = useTranslation();
  const Navigate = useNavigate();
  let dispatch = useDispatch();
  const { open, close } = useAppKit();
  const { selectedNetworkId } = useAppKitState();
  const { caipNetwork, caipNetworkId, chainId, switchNetwork } =
    useAppKitNetwork();
  const [IsBindState, setIsBindState] = useState(false);
  const { token } = useSelector<stateType, stateType>((state) => state);
  const [Tip, setTip] = useState("");
  const [Title, setTitle] = useState("");
  const [ShowTipModal, setShowTipModal] = useState(false);
  const [ShowSuccessTipModal, setShowSuccessTipModal] = useState(false);
  const [ShowAddLiquiditySuccessTipModal, setShowAddLiquiditySuccessTipModal] =
    useState(false);
  const [SelectTokensModalState, setSelectTokensModalState] = useState(false);
  const [SettingSlippage, setSettingSlippage] = useState(false);
  const [
    SelectTokensAddLiquidityModalState,
    setSelectTokensAddLiquidityModalState,
  ] = useState(false);

  const [SuccessFulHash, setSuccessFulHash] = useState("");
  const [LiquidityType, setLiquidityType] = useState<any>(2);
  const [TabActive, setTabActive] = useState("Trade");

  const { address: web3ModalAccount, isConnected } = useAppKitAccount();
  const { isNoGasFun } = useNoGas();
  const [CoinListObj, setCoinListObj] = useState<any>([]);

  const [FromToken, setFromToken] = useState(
    tokenList?.filter((item: any) => item?.chainId === chainId)[0]?.name ||
      "PIJS"
  );
  const [ToToken, setToToken] = useState(
    tokenList?.filter((item: any) => item?.chainId === chainId)[1]?.name ||
      "USDT"
  );
  const [AddLiquidityToken1, setAddLiquidityToken1] = useState(
    tokenList?.filter((item: any) => item?.chainId === chainId)[0]?.name ||
      "PIJS"
  );
  const [AddLiquidityToken2, setAddLiquidityToken2] = useState(
    tokenList?.filter((item: any) => item?.chainId === chainId)[1]?.name ||
      "USDT"
  );
  const [CurrentSelectedState, setCurrentSelectedState] = useState("from");
  const [AddLiquidityTokenType, setAddLiquidityTokenType] = useState(1);
  const [InputAmount, setInputAmount] = useState(1);
  const [ReceiveAmount, setReceiveAmount] = useState("0");
  const [OneUACToUSDT, setOneUACToUSDT] = useState("0");
  const [LPBalance, setLPBalance] = useState("0");
  const [PriceImpact, setPriceImpact] = useState("0");
  const [SlippageValue, setSlippageValue] = useState("5");
  const [LpAddress, setLpAddress] = useState("");
  const [PercentValue, setPercentValue] = useState("0");
  const [AddLiquidityTokenAmount1, setAddLiquidityTokenAmount1] = useState("1");
  const [AddLiquidityTokenAmount2, setAddLiquidityTokenAmount2] = useState("1");
  const [AddLiquidityTokenBalance1, setAddLiquidityTokenBalance1] =
    useState("0");
  const [AddLiquidityTokenBalance2, setAddLiquidityTokenBalance2] =
    useState("0");
  let CurrentFromToken: any = tokenList
    ?.filter((item: any) => item?.chainId === chainId)
    ?.find((item: any) => String(item?.name) === String(FromToken)) || {
    icon: pijsIcon,
    name: "PIJS",
    tokenAddress: contractAddress?.PIJSBSC,
    symbol: "PIJS",
    chainId: curentBSCChainId,
    contractAddress: contractAddress?.PIJSFactory,
    Router: contractAddress?.PIJSRouter,
  };
  let CurrentToToken: any = tokenList
    ?.filter((item: any) => item?.chainId === chainId)
    ?.find((item: any) => String(item?.name) === String(ToToken)) || {
    icon: usdtIcon,
    name: "USDT",
    tokenAddress: contractAddress?.USDTBSC,
    symbol: "Tether USD",
    chainId: curentBSCChainId,
    contractAddress: contractAddress?.PIJSFactory,
    Router: contractAddress?.PIJSRouter,
  };
  let CurrentAddLiquidityToken1: any = tokenList
    ?.filter((item: any) => item?.chainId === chainId)
    ?.find(
      (item: any) => String(item?.name) === String(AddLiquidityToken1)
    ) || {
    icon: pijsIcon,
    name: "PIJS",
    tokenAddress: contractAddress?.PIJSBSC,
    symbol: "PIJS",
    chainId: curentBSCChainId,
    contractAddress: contractAddress?.PIJSFactory,
    Router: contractAddress?.PIJSRouter,
  };
  let CurrentAddLiquidityToken2: any = tokenList
    ?.filter((item: any) => item?.chainId === chainId)
    ?.find(
      (item: any) => String(item?.name) === String(AddLiquidityToken2)
    ) || {
    icon: usdtIcon,
    name: "USDT",
    tokenAddress: contractAddress?.USDTBSC,
    symbol: "Tether USD",
    chainId: curentBSCChainId,
    contractAddress: contractAddress?.PIJSFactory,
    Router: contractAddress?.PIJSRouter,
  };

  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(CurrentFromToken?.Router, CurrentFromToken?.tokenAddress);
  const {
    TOKENBalance: LPTOKENBalance,
    TOKENAllowance: LPTOKENAllowance,
    handleApprove: LPhandleApprove,
    handleTransaction: LPhandleTransaction,
    handleUSDTRefresh: LPhandleUSDTRefresh,
  } = useUSDTGroup(CurrentAddLiquidityToken1?.Router, LpAddress);

  const CopyCodeFun = (code: string) => {
    if (!IsBindState) return addMessage(t("9"));
    if (!web3ModalAccount) {
      return addMessage(t("Please Connect wallet"));
    } else {
      copyFun(window.location.origin + `?inviteCode=${code}`);
      addMessage(t("Copied successfully"));
    }
  };
  const getInitData = () => {};

  const getCoinList = async () => {
    let Arr = [];
    if (!!web3ModalAccount) {
      for (let item of tokenList) {
        let value: any = 0;
        if (String(item?.name) === "UAC") {
          try {
            value = await Contracts.example.getBalance(
              web3ModalAccount as string
            );
          } catch (error: any) {}
          item = {
            ...item,
            balance: Web3.utils.fromWei(value + "", "ether") || 0,
          };
        } else {
          try {
            value = await Contracts.example.balanceOf(
              web3ModalAccount as string,
              item?.tokenAddress
              // "0x27e199Afb97612542d8dcD88C8DCE83b4b516992"
            );
          } catch (error: any) {}
          console.log(value, "value");
          item = {
            ...item,
            balance: Web3.utils.fromWei(value + "", "ether") || 0,
          };
        }
        // else {
        //   item = item;
        // }
        Arr.push(item);
      }
      setCoinListObj(Arr || []);
    } else {
      setCoinListObj(tokenList);
    }
  };

  // 解析 Transfer 事件
  function parseTransferEvent(log: any) {
    const transferEventSignature =
      "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

    if (
      String(log.raw.topics[0])?.toUpperCase() ===
      String(transferEventSignature)?.toUpperCase()
    ) {
      const from = `0x${log.raw.topics[1].slice(26)}`;
      const to = `0x${log.raw.topics[2].slice(26)}`;
      let web3 = new Web3();
      const value = web3.utils.hexToNumberString(log.raw.data);

      return {
        from,
        to,
        value,
      };
    }

    return null;
  }

  const RemoveLiquidityFun = async () => {
    // return addMessage(t("Coming soon"));

    LPhandleTransaction(
      (parseFloat(String(PercentValue)?.replace("%", "")) / 100) *
        Number(LPBalance ?? 0) +
        "",
      async (call: any) => {
        let res: any = null;
        try {
          if (!!(await isNoGasFun())) return;
          setTip(
            t("Removing UAC-USDT LP", {
              AddLiquidityToken1: AddLiquidityToken1,
              AddLiquidityToken2: AddLiquidityToken2,
            })
          );
          setShowTipModal(true);
          // 原生币+ERC20
          if (chainId === curentUNIChainId) {
            res = await Contracts.example?.removeLiquidityETH(
              web3ModalAccount as string,
              tokenList
                ?.filter((item: any) => item?.chainId === chainId)
                ?.find((item: any) => String(item?.name) === String("USDT"))
                ?.tokenAddress,
              (parseFloat(String(PercentValue)?.replace("%", "")) / 100) *
                Number(LPBalance ?? 0) +
                "",
              CurrentAddLiquidityToken1?.Router
            );
          } else {
            // ERC20+ERC20
            res = await Contracts.example?.removeLiquidity(
              web3ModalAccount as string,
              CurrentAddLiquidityToken1?.tokenAddress,
              CurrentAddLiquidityToken2?.tokenAddress,
              (parseFloat(String(PercentValue)?.replace("%", "")) / 100) *
                Number(LPBalance ?? 0) +
                "",
              CurrentAddLiquidityToken1?.Router
            );
          }
        } catch (error: any) {
          if (error?.code === 4001) {
            setShowTipModal(false);
            return addMessage(t("failed"));
          }
        }
        setShowTipModal(false);
        let lastEvent: any = null;
        if (!!res?.status) {
          try {
            for (const key in res?.events) {
              const log = res?.events[key];
              const event = parseTransferEvent(log);

              if (event) {
                lastEvent = event;
              }
              if (lastEvent) {
                // setCurrentLPBalance(EthertoWei(lastEvent?.value ?? "0"));
              }
            }
          } catch (error: any) {}
          debugger;
          await call();
          await getCoinList();
          await getLpBalance();
          // setCurrentLPBalance();
          setSuccessFulHash(res?.transactionHash);
          setShowTipModal(false);
          setShowAddLiquiditySuccessTipModal(true);
          setTitle(t("Liquidity removed successfully"));
          return setTip(t(""));
          // setShowTipModal(true);
        } else if (res?.status === false) {
          setShowTipModal(false);
          return addMessage(t("failed"));
        }
      },
      () => {
        setTip(
          t("Approve 100.0000 UAC-USDT", {
            num:
              (parseFloat(String(PercentValue)?.replace("%", "")) / 100) *
              Number(LPBalance ?? 0),
            token1: AddLiquidityToken1,
            token2: AddLiquidityToken2,
          })
        );
        setShowTipModal(true);
      },
      () => {
        setShowTipModal(false);
      }
    );
  };

  const InputFun = async (e: any) => {
    let filteredValue: any = String(e.target.value)
      ?.replace(/[+-]/g, "")
      .replace(/[^0-9.]/g, "");
    // Remove + and - characters
    const decimalIndex = filteredValue;
    setInputAmount(decimalIndex);
    if (Number(decimalIndex) <= 0 || !isNumber(Number(decimalIndex))) return;
    let receiveAmount: any = await Contracts.example?.getAmountsOut(
      web3ModalAccount as string,
      decimalIndex,
      [CurrentFromToken?.tokenAddress, CurrentToToken?.tokenAddress],
      CurrentFromToken?.Router
    );
    setReceiveAmount(EthertoWei(receiveAmount[1] ?? "0"));
  };
  const InputAddLiquidityFun = async (e: any, type: 1 | 2) => {
    let filteredValue: any = String(e.target.value)
      ?.replace(/[+-]/g, "")
      .replace(/[^0-9.]/g, "");
    // Remove + and - characters
    const decimalIndex = filteredValue;
    if (type === 1) {
      setAddLiquidityTokenAmount1(decimalIndex);
      if (Number(decimalIndex) <= 0 || !isNumber(Number(decimalIndex))) return;
      let receiveAmount: any = await Contracts.example?.getAmountsOut(
        web3ModalAccount as string,
        decimalIndex,
        [
          CurrentAddLiquidityToken1?.tokenAddress,
          CurrentAddLiquidityToken2?.tokenAddress,
        ],
        CurrentAddLiquidityToken1?.Router
      );
      setAddLiquidityTokenAmount2(EthertoWei(receiveAmount[1] ?? "0"));
    } else {
      setAddLiquidityTokenAmount2(decimalIndex);
      if (Number(decimalIndex) <= 0 || !isNumber(Number(decimalIndex))) return;
      let receiveAmount: any = await Contracts.example?.getAmountsOut(
        web3ModalAccount as string,
        decimalIndex,
        [
          CurrentAddLiquidityToken2?.tokenAddress,
          CurrentAddLiquidityToken1?.tokenAddress,
        ],
        CurrentAddLiquidityToken1?.Router
      );
      setAddLiquidityTokenAmount1(EthertoWei(receiveAmount[1] ?? "0"));
    }
  };
  const getLpBalance = async () => {
    try {
      let lpAddress: any = await Contracts.example?.getPair(
        web3ModalAccount as string,
        CurrentAddLiquidityToken1?.tokenAddress,
        CurrentAddLiquidityToken2?.tokenAddress,
        CurrentAddLiquidityToken1?.contractAddress
      );
      setLpAddress(lpAddress ?? "");

      let LPbalance = await Contracts.example.balanceOf(
        web3ModalAccount as string,
        lpAddress
        // "0x27e199Afb97612542d8dcD88C8DCE83b4b516992"
      );
      setLPBalance(EthertoWei(LPbalance ?? "0"));
    } catch (error: any) {
      // debugger;
      setLPBalance("0");
    }
  };
  const getPrice = async () => {
    try {
      Contracts.example
        ?.getAmountsOut(
          web3ModalAccount as string,
          1,
          [CurrentFromToken?.tokenAddress, CurrentToToken?.tokenAddress],
          CurrentFromToken?.Router
        )
        .then((res: any) => {
          // debugger;
          setOneUACToUSDT(EthertoWei(res[1] ?? "0"));
        });
    } catch (e: any) {
      setOneUACToUSDT("0");
    }
  };
  const getRemoveLiquidityInfo = async () => {
    let lpAddress: any = await Contracts.example?.getPair(
      web3ModalAccount as string,
      CurrentAddLiquidityToken1?.tokenAddress,
      CurrentAddLiquidityToken2?.tokenAddress,
      CurrentAddLiquidityToken1?.contractAddress
    );
    let LiquidityTokenBalance1: any = await Contracts.example.balanceOf(
      lpAddress as string,
      CurrentAddLiquidityToken1?.tokenAddress
    );
    let LiquidityTokenBalance2: any = await Contracts.example.balanceOf(
      lpAddress as string,
      CurrentAddLiquidityToken2?.tokenAddress
    );
    setAddLiquidityTokenBalance1(EthertoWei(LiquidityTokenBalance1 ?? "0"));
    setAddLiquidityTokenBalance2(EthertoWei(LiquidityTokenBalance2 ?? "0"));
  };

  const getContractData = async () => {
    let res1: any;
    let res2: any;
    try {
      res1 = await Contracts.example?.getAmountsOut(
        web3ModalAccount as string,
        InputAmount,
        [CurrentFromToken?.tokenAddress, CurrentToToken?.tokenAddress],
        CurrentFromToken?.Router
      );
      setReceiveAmount(EthertoWei(res1[1] ?? "0"));
    } catch (e: any) {
      setReceiveAmount("0");
    }

    try {
      res2 = await Contracts.example?.getAmountsOut(
        web3ModalAccount as string,
        AddLiquidityTokenAmount1,
        [
          CurrentAddLiquidityToken1?.tokenAddress,
          CurrentAddLiquidityToken2?.tokenAddress,
        ],
        CurrentAddLiquidityToken1?.Router
      );
      setAddLiquidityTokenAmount2(EthertoWei(res2[1] ?? "0"));
    } catch (e: any) {
      setAddLiquidityTokenAmount2("0");
    }

    getLpBalance();
  };

  useEffect(() => {
    if (!!token) {
      getInitData();
    } else {
    }
  }, [web3ModalAccount, token]);

  useEffect(() => {
    if (!!web3ModalAccount && Number(InputAmount) > 0) {
      getContractData();
    } else {
    }
  }, [
    web3ModalAccount,
    token,
    InputAmount,
    FromToken,
    ToToken,
    AddLiquidityToken1,
    AddLiquidityToken2,
    chainId,
    selectedNetworkId,
  ]);

  useEffect(() => {
    if (!!web3ModalAccount) {
      getLpBalance();
    }
  }, [
    web3ModalAccount,
    AddLiquidityToken1,
    AddLiquidityToken2,
    chainId,
    selectedNetworkId,
  ]);

  useEffect(() => {
    if (!!web3ModalAccount) {
      getPrice();
    }
  }, [web3ModalAccount, token, FromToken, ToToken]);

  useEffect(() => {
    handleUSDTRefresh();
  }, [web3ModalAccount, token, chainId]);
  useEffect(() => {
    getCoinList();
  }, [
    TabActive,
    web3ModalAccount,
    SelectTokensModalState,
    SelectTokensAddLiquidityModalState,
  ]);
  useEffect(() => {
    if (!!web3ModalAccount && String(PercentValue) !== "0%") {
      getRemoveLiquidityInfo();
    } else {
    }
  }, [web3ModalAccount, token, PercentValue]);

  const RemoveLiquidityBtn = () => {
    if (!web3ModalAccount)
      return (
        <Btn
          isActive={true}
          onClick={() => {
            open();
          }}
        >
          {t("连接钱包")}
        </Btn>
      );
    if (String(PercentValue) === "0")
      return <Btn isActive={false}>{t("请输入质押数量")}</Btn>;

    return (
      <Btn
        isActive={true}
        onClick={() => {
          RemoveLiquidityFun();
        }}
      >
        {Number(TOKENAllowance) >= Number(InputAmount) ? t("移除") : t("授权")}{" "}
        LP
      </Btn>
    );
  };

  return (
    <>
      <HomeContainerBox src={width >= 1400 ? pledge_bg : mainBgMobile}>
        <div>
          <SwapContainer>
            <SwapContainer_Title
              onClick={() => {
                Navigate(-1);
              }}
            >
              {" "}
              <img src={toIcon} alt="" /> {t("LP质押")}
            </SwapContainer_Title>

            <SwapItem_Title>
              {t("输入质押数量")} <span>LP余额: 0</span>
            </SwapItem_Title>
            <SwapItem>
              <LiquidityItem>
                <input type="text" value={PercentValue} />
                <PercentageBox>
                  <div
                    onClick={() => {
                      setPercentValue("10");
                    }}
                  >
                    10
                  </div>
                  <div
                    onClick={() => {
                      setPercentValue("20");
                    }}
                  >
                    20
                  </div>
                  <div
                    onClick={() => {
                      setPercentValue("50");
                    }}
                  >
                    50
                  </div>
                  <div
                    onClick={() => {
                      setPercentValue("100");
                    }}
                  >
                    100
                  </div>
                </PercentageBox>
              </LiquidityItem>
            </SwapItem>
            <SwapItemBottom>
              <MyHold>
                <div>
                  已持仓
                  <div className="value">1000.0000</div>
                </div>
                <div>
                  <div className="value oddValue"> +</div>
                </div>
                <div>
                  增加持仓
                  <div className="value">1000.0000</div>
                </div>
                <div>
                  <div className="value oddValue"> =</div>
                </div>
                <div>
                  我的持仓
                  <div className="value">1000.0000</div>
                </div>
              </MyHold>
            </SwapItemBottom>

            {RemoveLiquidityBtn()}
          </SwapContainer>

          <ModalContent
            ShowTipModal={ShowTipModal}
            Tip={Tip}
            close={() => {
              setShowTipModal(false);
            }}
          />
          <ModalContentSuccess
            ShowTipModal={ShowSuccessTipModal}
            Tip={Tip}
            hash={SuccessFulHash}
            fun={() => {
              if (!!token) {
                getCoinList();
              }
            }}
            close={() => {
              setShowSuccessTipModal(false);
            }}
          />
          <AddLiquidityModalContentSuccess
            ShowTipModal={ShowAddLiquiditySuccessTipModal}
            Tip={Tip}
            Title={Title}
            hash={SuccessFulHash}
            fun={() => {
              if (!!token) {
                getCoinList();
              }
            }}
            close={() => {
              setShowAddLiquiditySuccessTipModal(false);
            }}
          />
        </div>

        {width >= 1400 && <Footer></Footer>}
      </HomeContainerBox>
      {!(width >= 1400) && <Footer></Footer>}
    </>
  );
}
