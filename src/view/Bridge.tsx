import React, { useState, useEffect, useRef } from "react";
import {
  getAllData,
  getDrawData,
  getExchangeFormDataList,
  getExchangeRecord,
  getMyNft,
  getNftBase,
  getPersonData,
  getProductOff,
  getUserInfo,
  isNewUser,
  payNft,
  runBridge,
} from "../API/index";
import "../assets/style/Home.scss";
import NoData from "../components/NoData";
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
import roundIcon from "../assets/image/Swap/roundIcon.svg";
import usdtIcon from "../assets/image/Swap/usdtIcon.png";
import dropIcon from "../assets/image/Swap/dropIcon.svg";
import toSwap from "../assets/image/Swap/toSwap.svg";
import receiveIcon from "../assets/image/Swap/receiveIcon.svg";
import refreshIcon from "../assets/image/Swap/refreshIcon.svg";
import fromToLine from "../assets/image/Swap/fromToLine.png";
import copyFun from "copy-to-clipboard";
import { Contracts } from "../web3";
import useUSDTGroup from "../hooks/useUSDTGroup";
import { contractAddress, loginNetworkId } from "../config";
import { createLoginSuccessAction } from "../store/actions";
import { useNoGas } from "../hooks/useNoGas";
import ModalContent from "../components/ModalContent";
import ModalContentSuccess from "../components/ModalContentSuccess";
import ReferListModal from "../components/ReferListModal";
import MyNodeListModal from "../components/MyNodeListModal";
import useTime from "../hooks/useTime";
import LightUpNode from "../components/LightUpNode";
import RecommendedOuputModal from "../components/RecommendedOuputModal";
import RevokeNode from "../components/RevokeNode";
import RecommendedMintedModal from "../components/RecommendedMintedModal";
import { useGetReward } from "../hooks/useGetReward";
import FromStakingMiningModal from "../components/FromStakingMiningModal";
import ToStakingMiningModal from "../components/ToStakingMiningModal";
import MainBg from "../assets/image/layout/MainBg.png";
import mainBgMobile from "../assets/image/layout/mainBgMobile.png";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useDisconnect,
} from "@reown/appkit/react";
import Footer from "../components/Footer";
import chain_img1 from "../assets/image/layout/chain_img1.png";
import chain_img2 from "../assets/image/layout/chain_img2.png";
import chain_img3 from "../assets/image/layout/chain_img3.png";
import piIcon from "../assets/image/Swap/piIcon.png";
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
      padding: 0px 15px;
      padding: 0px 15px 226px;
      width: 100%;
      margin: auto;
      @media (max-width: 1200px) {
        padding: 0px 15px 226px;
      }
    }
  }
  /* @media (max-width: 1400px) {
    background-size: 100% 100%;
  } */
`;
export const GameTooltip = styled.div``;
const SwapContainer = styled.div`
  margin-top: 82px;
  width: 100%;
  padding: 24px;
  border-radius: 6px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #232323;
  @media (max-width: 768px) {
    margin-top: 30px;
    padding: 24px 11px;
  }
`;

const SwapContainer_Title = styled.div`
  font-family: "Space Grotesk";
  font-size: 24px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #f4c134;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;
const SwapItem = styled.div``;
const SwapItem_Title = styled(FlexSBCBox)`
  font-family: "Space Grotesk";
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin: 24px 0px 15px;
  > div {
    font-family: "Space Grotesk";
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    text-align: right;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    > span {
      cursor: pointer;
      font-family: "Space Grotesk";
      font-size: 16px;
      font-weight: normal;
      line-height: normal;
      text-align: right;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #f4c134;
      margin-left: 12px;
    }
  }
  @media (max-width: 768px) {
    font-family: "Space Grotesk";
    font-size: 16px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    margin: 24px 0px 10px;
    > div {
      font-family: "Space Grotesk";
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      text-align: right;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
      > span {
        font-size: 14px;
      }
    }
  }
`;
const Item = styled(FlexSBCBox)`
  border-radius: 6px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #666666;
`;
const Item_Left = styled(FlexSBCBox)`
  cursor: pointer;
  padding: 18px;
  width: fit-content;
  min-width: 228px;
  > img {
    &:nth-child(1) {
      width: 48px;
      height: 48px;
      margin-right: 12px;
    }
  }
  .coin_info {
    font-family: "Space Grotesk";
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
    .coin {
      font-family: "Space Grotesk";
      font-size: 24px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
      margin-top: 2px;
    }
  }
  @media (max-width: 768px) {
    padding: 10px;
    min-width: 142px;
    > img {
      &:nth-child(1) {
        width: 24px;
        height: 24px;
        margin-right: 6px;
      }
      &:nth-child(3) {
        margin-left: 6px;
      }
    }
    .coin_info {
      font-family: "Space Grotesk";
      font-size: 10px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #999999;
      .coin {
        font-family: "Space Grotesk";
        font-size: 14px;
        font-weight: bold;
        line-height: normal;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #ffffff;
      }
    }
  }
`;
const Devider = styled.div`
  width: 1px;
  height: 85px;
  background: #666666;
  @media (max-width: 768px) {
    height: 60px;
  }
`;
const Item_Right = styled(FlexBox)`
  flex: 1;
  padding: 18px;
  > input {
    width: 100%;
    font-family: "Space Grotesk";
    font-size: 32px;
    font-weight: bold;
    line-height: normal;
    text-align: right;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    background: transparent;
    outline: none;
    border: none;
  }
  @media (max-width: 768px) {
    padding: 15px 12px;
    > input {
      font-family: "Space Grotesk";
      font-size: 20px;
      font-weight: bold;
      line-height: normal;
      text-align: right;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
  }
`;

const SwapToIcon = styled(FlexCCBox)`
  margin: 38px auto 0px;
  @media (max-width: 768px) {
    margin: 32px auto 0px;
  }
`;
const ReceiveItem = styled.div`
  margin-top: 36px;
  font-family: "Space Grotesk";
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  @media (max-width: 768px) {
    margin-top: 32px;
    font-size: 16px;
  }
`;
const ReceiveBox = styled(FlexSBCBox)`
  margin-top: 15px;
  border-radius: 6px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #666666;
  padding: 20px;
  > input {
    flex: 1;
    font-family: "Space Grotesk";
    font-size: 18px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #fff;
    background: transparent;
    outline: none;
    border: none;
    &::placeholder {
      font-family: "Space Grotesk";
      font-size: 18px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #333333;
    }
  }
  img {
    cursor: pointer;
  }
  @media (max-width: 768px) {
    margin-top: 10px;
    padding: 12px 8px;
    > input {
      font-size: 14px;
      &::placeholder {
        color: #333333;
      }
    }
    img {
      width: 24px;
      height: 24px;
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
    margin: 32px 0px 16px;
  }
`;
const SwapInfo = styled.div`
  border-radius: 6px;
  opacity: 1;
  background: #1f1f1f;
  padding: 20px;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    font-family: "Space Grotesk";
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
    &:last-child {
      margin-bottom: 0px;
    }
    > span {
      font-family: "Space Grotesk";
      font-size: 16px;
      font-weight: normal;
      line-height: normal;
      text-align: right;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
  }
  @media (max-width: 768px) {
    padding: 16px 10px;
    > div {
      font-size: 12px;
      margin-bottom: 16px;
      > span {
        font-size: 12px;
      }
    }
  }
`;
const ExchangeRecord = styled.div`
  padding: 24px;
  width: 100%;
  margin-top: 36px;
  border-radius: 6px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #232323;
  @media (max-width: 768px) {
    margin-top: 15px;
    padding: 24px 11px;
  }
`;
const ExchangeRecordTitle = styled(FlexSBCBox)`
  width: 100%;

  > div {
    display: flex;
    align-items: center;
    font-family: "Space Grotesk";
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #f4c134;

    > span {
      margin-left: 6px;
      font-family: "Space Grotesk";
      font-size: 18px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #666666;
    }
  }
  > img {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    > div {
      flex: 1;
      font-size: 14px;
      display: block;
      > span {
        width: 100%;
        display: block;
        font-size: 14px;
        margin-left: 0px;
        margin-top: 2px;
      }
    }
  }
`;
const ExchangeRecordItems = styled.div`
  > div {
    margin-top: 30px;
    &:first-child {
      margin-top: 36px;
    }
  }
  @media (max-width: 768px) {
    > div {
      margin-top: 24px;
    }
  }
`;
const ExchangeRecordItem = styled(FlexBox)`
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 30px;
  opacity: 1;
  border-bottom: 1px solid #232323;
  > div {
    width: 48%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:nth-child(3),
    &:nth-child(4) {
      margin-top: 14px;
    }
    .from_coin_info {
      width: 160px;
      font-family: "Space Grotesk";
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #999999;
      > div {
        margin-top: 4px;
        font-family: "Space Grotesk";
        font-size: 16px;
        font-weight: bold;
        line-height: normal;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #ffffff;
      }
    }
    .from_coin_to_line {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: "Space Grotesk";
      font-size: 12px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #999999;
      img {
        width: 100%;
      }
    }
    .state {
      font-family: "Space Grotesk";
      font-size: 16px;
      font-weight: normal;
      line-height: normal;
      text-align: right;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #e6ae3f;
    }
    .price_info {
      font-family: "Space Grotesk";
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #666666;
      > div {
        margin-top: 4px;
        font-family: "Space Grotesk";
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #999999;
      }
    }
  }
  @media (max-width: 768px) {
    padding-bottom: 24px;
    > div {
      .from_coin_info {
        width: fit-content;
        font-size: 12px;
        > div {
          font-size: 14px;
        }
      }
      .from_coin_to_line {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding-left: 10px;
      }
      .state {
        font-size: 14px;
      }
      .price_info {
        font-size: 12px;
        > div {
          font-size: 12px;
        }
      }
    }
  }
`;

let timer: any = null;
interface Token {
  tokenName: string;
  tokenAddress?: string; // 使用可选属性，假设 contractAddress 可能为 undefined
  bridgeContract?: string; // 同样使用可选属性
  balance?: any; // 同样使用可选属性
}

interface Chain {
  ChainName: string;
  icon: any;
  tokens: Token[];
}
const ChainArr: Chain[] = [
  {
    ChainName: "Pi",
    icon: piIcon,
    tokens: [
      {
        tokenName: "USDT",
        tokenAddress: contractAddress?.USDTBSC,
        bridgeContract: contractAddress?.BridgeBSC,
      },
    ],
  },
  {
    ChainName: "BSC",
    icon: chain_img1,
    tokens: [
      {
        tokenName: "USDT",
        tokenAddress: contractAddress?.USDTBSC,
        bridgeContract: contractAddress?.BridgeBSC,
      },
    ],
  },
  {
    ChainName: "UniAgent",
    icon: chain_img3,

    tokens: [
      {
        tokenName: "USDT",
        tokenAddress: contractAddress?.USDTUNI,
        bridgeContract: contractAddress?.BridgeUNI,
      },
    ],
  },
];
export default function Rank() {
  const { open, close } = useAppKit();

  const CurrentFromLinkRef: any = useRef<any>(null);
  const CurrentToLinkRef: any = useRef<any>(null);
  const { width } = useViewport();
  const { t, i18n } = useTranslation();
  const Navigate = useNavigate();
  let dispatch = useDispatch();
  const { caipNetwork, caipNetworkId, chainId, switchNetwork } =
    useAppKitNetwork();

  const [IsBindState, setIsBindState] = useState(false);
  const token = useSelector<stateType, stateType>((state: any) => state?.token);
  console.log(token, "1212");
  const [NodeInfo, setNodeInfo] = useState<any>({});
  const [UserInfo, setUserInfo] = useState<any>({});
  const [NftBase, setNftBase] = useState<any>({});
  const [Tip, setTip] = useState("");
  const [ShowTipModal, setShowTipModal] = useState(false);
  const [ShowSuccessTipModal, setShowSuccessTipModal] = useState(false);
  const [FromStakingMiningModalState, setFromStakingMiningModalState] =
    useState(false);
  const [ToStakingMiningModalState, setToStakingMiningModalState] =
    useState(false);
  const [EdgeNodeModalState, setEdgeNodeModalState] = useState(false);

  const [SuccessFulHash, setSuccessFulHash] = useState("");
  const [RecordList3, setRecordList3] = useState<any>({});
  const [BridgeData, setBridgeData] = useState<any>({});
  const [BridgeExchangeRecord, setBridgeExchangeRecord] = useState<any>([]);
  const [DrawData, setDrawData] = useState<any>(0);
  // 1=挖矿节点 2=未挖矿节点
  const [ModalType, setModalType] = useState<any>(1);

  const [Amount, setAmount] = useState(1);
  const { address: web3ModalAccount, isConnected } = useAppKitAccount();
  const [LinkType1, setLinkType1] = useState("BSC");
  const [LinkType2, setLinkType2] = useState("UniAgent");
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(
    ChainArr?.find((item) => String(item?.ChainName) === String(LinkType1))
      ?.tokens[0]?.bridgeContract as string,
    ChainArr?.find((item) => String(item?.ChainName) === String(LinkType1))
      ?.tokens[0]?.tokenAddress as string
  );
  const [ReceiveAddress, setReceiveAddress] = useState("");
  const [FromInputAmount, setFromInputAmount] = useState("1");
  // const [TokenArr, setTokenArr] = useState([]);

  const { isNoGasFun } = useNoGas();
  const [IsNode, setIsNode] = useState(false);
  const { disconnect } = useDisconnect();
  const { getReward } = useGetReward();
  const inputFun = (amount: any, num = 0) => {
    let amounted: any = Number(amount) + num;
    // debugger;
    let filteredValue: any = String(amounted)?.replace(/[+-]/g, "");
    // Remove + and - characters
    const decimalIndex = filteredValue?.replace(/[^0-9]/g, "");
    // debugger;
    if (Number(decimalIndex) <= 0) return;
    setAmount(decimalIndex);
  };

  // type:from/to
  const SelectTypeFun = (type: any, name: any) => {
    if (String(type) === "from") {
      setLinkType1(name);
      setLinkType2(
        ChainArr?.filter(
          (item1: any) => String(item1?.ChainName) !== String(name)
        )[
          ChainArr?.filter(
            (item1: any) => String(item1?.ChainName) !== String(name)
          )?.length - 1
        ]?.ChainName
      );
    } else if (String(type) === "to") {
      setLinkType2(name);
      setLinkType1(
        ChainArr?.filter(
          (item1: any) => String(item1?.ChainName) !== String(name)
        )[
          ChainArr?.filter(
            (item1: any) => String(item1?.ChainName) !== String(name)
          )?.length - 1
        ]?.ChainName
      );
    }
    handleUSDTRefresh();
  };

  const CopyCodeFun = (code: string) => {
    if (!IsBindState) return addMessage(t("9"));
    if (!web3ModalAccount) {
      return addMessage(t("Please Connect wallet"));
    } else {
      copyFun(window.location.origin + `?inviteCode=${code}`);
      addMessage(t("Copied successfully"));
    }
  };

  const BridgeFun = (FromInputAmount: any) => {
    return addMessage("Coming soon");

    // if (!IsBindState) return addMessage(t("9"));
    if (Number(FromInputAmount) <= 0) return;
    handleTransaction(
      FromInputAmount + "",
      async (call: any) => {
        let res: any = null;
        let item: any = await runBridge({
          formNum: Number(FromInputAmount),
          fromChain: LinkType1,
          fromCoinName: ChainArr?.find(
            (item) => String(item?.ChainName) === String(LinkType1)
          )?.tokens[0]?.tokenName,
          toAddress: ReceiveAddress,
          toChain: LinkType2,
          toCoinName: ChainArr?.find(
            (item) => String(item?.ChainName) === String(LinkType1)
          )?.tokens[0]?.tokenName,
        });
        console.log(item, "item?.data");

        if (item?.code === 200) {
          try {
            if (!!(await isNoGasFun())) return;
            // debugger;
            setTip(t("Execute cross-chain exchange (close in 3 seconds)"));
            setShowTipModal(true);
            res = await Contracts.example?.deposite(
              web3ModalAccount as string,
              FromInputAmount,
              ReceiveAddress,
              item?.data,
              loginNetworkId?.find(
                (item: any) => String(item?.name) === String(LinkType2)
              )?.bridgeChainId,
              ChainArr?.find(
                (item) => String(item?.ChainName) === String(LinkType1)
              )?.tokens[0]?.bridgeContract as string
            );
          } catch (error: any) {
            // debugger;
            if (error?.code === 4001) {
              setShowTipModal(false);
              return addMessage(t("11"));
            }
          }
          setShowTipModal(false);
          // debugger;
          if (!!res?.status) {
            await call();
            await getInitData();
            setSuccessFulHash(res?.transactionHash);
            setShowTipModal(false);
            setShowSuccessTipModal(true);
            return setTip(t("Bridge successful", { num: Amount }));
            // setShowTipModal(true);
          } else if (res?.status === false) {
            setShowTipModal(false);
            return addMessage(t("11"));
          }
        } else {
          setShowTipModal(false);
          return addMessage(t("11"));
        }
      },
      () => {
        setTip(
          t("Approve 100.0000 USDT (BSC)", {
            num: FromInputAmount,
            chain: LinkType1,
          })
        );
        setShowTipModal(true);
      },
      () => {
        setShowTipModal(false);
      }
    );
  };

  const getBridgeData = () => {
    getExchangeFormDataList().then((res: any) => {
      setBridgeData(
        res?.data?.find(
          (item: any) => String(item?.chainName) === String(LinkType1)
        ) || {}
      );
    });
  };

  const getInitData = () => {
    getExchangeRecord().then((res: any) => {
      if (res.code === 200) {
        setBridgeExchangeRecord(res?.data || []);
      }
    });
  };

  const FromInputFun = (e: any) => {
    setFromInputAmount(e.target.value.replace(/[^0-9.]/g, ""));
  };

  // 添加余额字段的函数
  async function addBalancesToTokens() {
    for (const chain of ChainArr) {
      if (chain.tokens && chain.tokens.length > 0) {
        for (const token of chain.tokens) {
          debugger;

          if (token.tokenAddress) {
            // 调用接口查询余额
            let Tokenbalance: any = await Contracts.example?.balanceOf(
              web3ModalAccount as string,
              token.tokenAddress
              // "0x27e199Afb97612542d8dcD88C8DCE83b4b516992"
            );
            debugger;
            token.balance = EthertoWei(Tokenbalance ?? "0");
          }
        }
      }
    }
  }

  useEffect(() => {
    if (token) {
      getInitData();
    }
  }, [web3ModalAccount, chainId, token, isConnected]);
  useEffect(() => {
    getBridgeData();
  }, [web3ModalAccount, LinkType1, chainId]);

  useEffect(() => {
    setReceiveAddress(web3ModalAccount as string);
    handleUSDTRefresh();
    // if (!!web3ModalAccount) {
    //   addBalancesToTokens();
    // }
  }, [web3ModalAccount, chainId, token]);

  useEffect(() => {
    if (!token) {
      setUserInfo({});
      setNodeInfo({});
      setBridgeExchangeRecord([]);
    }
  }, []);

  const BtnBox = () => {
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
    if (!FromInputAmount || Number(FromInputAmount) <= 0)
      return <Btn isActive={false}>Please Enter The Exchange Quantity</Btn>;
    if (!ReceiveAddress)
      return (
        <Btn isActive={false}>Please fill in the correct receiving address</Btn>
      );
    if (Number(FromInputAmount) > Number(TOKENBalance))
      return <Btn isActive={false}>Insufficient balance</Btn>;
    return (
      <Btn
        isActive={true}
        onClick={() => {
          BridgeFun(FromInputAmount);
        }}
      >
        {t("交易")}
      </Btn>
    );
  };

  return (
    <>
      <HomeContainerBox src={width >= 1400 ? MainBg : mainBgMobile}>
        <div>
          {" "}
          <SwapContainer>
            <SwapContainer_Title>Bridge</SwapContainer_Title>
            <SwapItem>
              <SwapItem_Title>
                {t("发送")}{" "}
                <div>
                  {t("余额")}: {TOKENBalance ?? "0"}{" "}
                  <span
                    onClick={() => {
                      setFromInputAmount(TOKENBalance);
                    }}
                  >
                    All
                  </span>
                </div>
              </SwapItem_Title>
              <Item>
                <Item_Left
                  onClick={() => {
                    setFromStakingMiningModalState(true);
                  }}
                >
                  <img src={usdtIcon} alt="" />
                  <div className="coin_info">
                    <div className="chain">{LinkType1} Chain</div>
                    <div className="coin">USDT</div>
                  </div>
                  <img src={dropIcon} alt="" />
                </Item_Left>
                <Devider></Devider>
                <Item_Right>
                  <input
                    type="text"
                    value={!!FromInputAmount ? FromInputAmount : ""}
                    onChange={FromInputFun}
                  />
                </Item_Right>
              </Item>
            </SwapItem>
            <SwapToIcon>
              <img src={toSwap} alt="" />
            </SwapToIcon>

            <SwapItem>
              <SwapItem_Title style={{ marginTop: "0px" }}>
                {t("接收")}{" "}
                {/* <div>
              Balance: 100 <span>All</span>
            </div> */}
              </SwapItem_Title>
              <Item>
                <Item_Left
                  onClick={() => {
                    setToStakingMiningModalState(true);
                  }}
                >
                  <img src={usdtIcon} alt="" />
                  <div className="coin_info">
                    <div className="chain">{LinkType2} Chain</div>
                    <div className="coin">USDT</div>
                  </div>
                  <img src={dropIcon} alt="" />
                </Item_Left>
                <Devider></Devider>
                <Item_Right>
                  <input
                    type="text"
                    value={
                      NumSplic1(
                        (1 /
                          Number(
                            BridgeData?.exchangeTargetVoList?.find(
                              (item: any) =>
                                String(item?.chainName) === String(LinkType2)
                            )?.price
                          )) *
                          Number(FromInputAmount) *
                          (1 - Number(BridgeData?.fee)) *
                          Number(BridgeData?.price) *
                          (1 -
                            Number(
                              BridgeData?.exchangeTargetVoList?.find(
                                (item: any) =>
                                  String(item?.chainName) === String(LinkType2)
                              )?.fee
                            )),
                        4
                      ) ?? 0
                    }
                  />
                </Item_Right>
              </Item>
            </SwapItem>

            <ReceiveItem>
              {t("接收地址")}
              <ReceiveBox>
                <input
                  type="text"
                  placeholder={t("请输入接收地址")}
                  value={!!ReceiveAddress ? ReceiveAddress : ""}
                  onChange={(e: any) => {
                    setReceiveAddress(e.target.value);
                  }}
                />{" "}
                <img src={receiveIcon} alt="" />
              </ReceiveBox>
            </ReceiveItem>
            {BtnBox()}
            <SwapInfo>
              <div>
                {t("交换路径")} <span>{LinkType1} Bridge</span>
              </div>
              <div>
                {t("参考价格")}{" "}
                <span>
                  {BridgeData?.price} USDT({LinkType1}) ={" "}
                  {
                    BridgeData?.exchangeTargetVoList?.find(
                      (item: any) =>
                        String(item?.chainName) === String(LinkType2)
                    )?.price
                  }{" "}
                  USDT({LinkType2})
                </span>
              </div>
              <div>
                {t("Fee")}{" "}
                <span>
                  {Number(FromInputAmount) * Number(BridgeData?.fee)} USDT(
                  {BridgeData?.tokenType ?? "-"}) +{" "}
                  {NumSplic1(
                    (1 /
                      Number(
                        BridgeData?.exchangeTargetVoList?.find(
                          (item: any) =>
                            String(item?.chainName) === String(LinkType2)
                        )?.price
                      )) *
                      Number(FromInputAmount) *
                      (1 - Number(BridgeData?.fee)) *
                      Number(BridgeData?.price) *
                      Number(
                        BridgeData?.exchangeTargetVoList?.find(
                          (item: any) =>
                            String(item?.chainName) === String(LinkType2)
                        )?.fee
                      ),
                    4
                  )}{" "}
                  USDT(
                  {BridgeData?.exchangeTargetVoList?.find(
                    (item: any) => String(item?.chainName) === String(LinkType2)
                  )?.tokenType ?? "-"}
                  )
                </span>
              </div>
              <div>
                {t("Expected Receipt")}{" "}
                <span>
                  {NumSplic1(
                    (1 /
                      Number(
                        BridgeData?.exchangeTargetVoList?.find(
                          (item: any) =>
                            String(item?.chainName) === String(LinkType2)
                        )?.price
                      )) *
                      Number(FromInputAmount) *
                      (1 - Number(BridgeData?.fee)) *
                      Number(BridgeData?.price) *
                      (1 -
                        Number(
                          BridgeData?.exchangeTargetVoList?.find(
                            (item: any) =>
                              String(item?.chainName) === String(LinkType2)
                          )?.fee
                        )),
                    4
                  )}
                </span>
              </div>
            </SwapInfo>
          </SwapContainer>
          <ExchangeRecord>
            <ExchangeRecordTitle>
              <div>
                {t("交易记录")} <span>({t("仅展示最近7天")})</span>
              </div>
              <img
                src={refreshIcon}
                alt=""
                onClick={() => {
                  getInitData();
                }}
              />
            </ExchangeRecordTitle>
            <ExchangeRecordItems>
              {BridgeExchangeRecord?.map((item: any, index: any) => (
                <ExchangeRecordItem key={index}>
                  <div>
                    <div className="from_coin_info">
                      {item?.fromChain}
                      <div>
                        {item?.fromNum} {item?.fromCoinName}
                      </div>
                    </div>
                    <div className="from_coin_to_line">
                      <img src={fromToLine} alt="" />
                      Expected Receipt
                    </div>
                  </div>
                  <div>
                    <div className="from_coin_info">
                      {item?.toChain}
                      <div>
                        {item?.toNum} {item?.toCoinName}
                      </div>
                    </div>
                    <div
                      className="state"
                      style={{
                        color:
                          Number(item?.status) === 0 ||
                          Number(item?.status) === 1
                            ? "#e6ae3f"
                            : "#999999",
                      }}
                    >
                      {Number(item?.status) === 0 || Number(item?.status) === 1
                        ? "Exchanging"
                        : Number(item?.status) === 3
                        ? "Failed"
                        : "Completed"}
                    </div>
                  </div>
                  <div>
                    <div className="price_info">
                      Reference Price
                      <div>
                        {item?.fromPrice ?? 0} {item?.fromCoinName}(
                        {item?.fromChain}) = {item?.toPrice ?? 0}{" "}
                        {item?.toCoinName}({item?.toChain})
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="price_info">
                      Fee
                      <div>
                        {item?.fromFee} {item?.fromCoinName}(
                        {item?.fromTokenType}) + {item?.toFee}{" "}
                        {item?.toCoinName}({item?.toTokenType})
                      </div>
                    </div>
                  </div>
                </ExchangeRecordItem>
              ))}
            </ExchangeRecordItems>
          </ExchangeRecord>
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
                getInitData();
              }
            }}
            close={() => {
              setShowSuccessTipModal(false);
            }}
          />
          {/* Select From Send Tokens */}
          <FromStakingMiningModal
            ref={CurrentFromLinkRef}
            ChainArr={ChainArr}
            Balance={TOKENBalance}
            ShowTipModal={FromStakingMiningModalState}
            LinkType1={LinkType1}
            close={() => {
              setFromStakingMiningModalState(false);
            }}
            SelectTypeFun={SelectTypeFun}
          />
          {/* Select To Send Tokens */}
          <ToStakingMiningModal
            ref={CurrentToLinkRef}
            ChainArr={ChainArr}
            ShowTipModal={ToStakingMiningModalState}
            LinkType2={LinkType2}
            close={() => {
              setToStakingMiningModalState(false);
            }}
            SelectTypeFun={SelectTypeFun}
          />
        </div>
        {width >= 1400 && <Footer></Footer>}
      </HomeContainerBox>
      {!(width >= 1400) && <Footer></Footer>}
    </>
  );
}
