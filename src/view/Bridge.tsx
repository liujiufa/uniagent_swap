import React, { useState, useEffect, useRef } from "react";
import {
  getAllData,
  getDrawData,
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
  addMessage,
  dateFormat,
  decimalNum,
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
import dropIcon from "../assets/image/Swap/dropIcon.svg";
import toSwap from "../assets/image/Swap/toSwap.svg";
import receiveIcon from "../assets/image/Swap/receiveIcon.svg";
import refreshIcon from "../assets/image/Swap/refreshIcon.svg";
import fromToLine from "../assets/image/Swap/fromToLine.png";
import {
  useDisconnect,
  useWeb3Modal,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
  useWeb3ModalState,
} from "@web3modal/ethers/react";
import copyFun from "copy-to-clipboard";
import { Contracts } from "../web3";
import useUSDTGroup from "../hooks/useUSDTGroup";
import { contractAddress } from "../config";
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
const HomeContainerBox = styled(ContainerBox)`
  max-width: 748px;
  padding: 56px 15px;
  width: 100%;
  margin: auto;
  @media (max-width: 1200px) {
    padding: 56px 15px;
  }
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
  color: #93e63f;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;
const SwapItem = styled.div``;
const SwapItem_Title = styled(FlexSBCBox)`
  font-family: Space Grotesk;
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin: 24px 0px 15px;
  > div {
    font-family: Space Grotesk;
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    text-align: right;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    > span {
      cursor: pointer;
      font-family: Space Grotesk;
      font-size: 16px;
      font-weight: normal;
      line-height: normal;
      text-align: right;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #93e63f;
      margin-left: 12px;
    }
  }
  @media (max-width: 768px) {
    font-family: Space Grotesk;
    font-size: 16px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    margin: 24px 0px 10px;
    > div {
      font-family: Space Grotesk;
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
    font-family: Space Grotesk;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
    .coin {
      font-family: Space Grotesk;
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
      font-family: Space Grotesk;
      font-size: 10px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #999999;
      .coin {
        font-family: Space Grotesk;
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
    font-family: Space Grotesk;
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
      font-family: Space Grotesk;
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
  font-family: Space Grotesk;
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
    font-family: Space Grotesk;
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
      font-family: Space Grotesk;
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
  font-family: Space Grotesk;
  font-size: 16px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #0a0a0a;
  border-radius: 6px;
  opacity: 1;
  background: ${({ isActive }) => (isActive ? "#93E63F" : "#517130")};
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
    font-family: Space Grotesk;
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
      font-family: Space Grotesk;
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
    font-family: Space Grotesk;
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #93e63f;

    > span {
      margin-left: 6px;
      font-family: Space Grotesk;
      font-size: 18px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #666666;
    }
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
      font-family: Space Grotesk;
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #999999;
      > div {
        margin-top: 4px;
        font-family: Space Grotesk;
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
      font-family: Space Grotesk;
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
      font-family: Space Grotesk;
      font-size: 16px;
      font-weight: normal;
      line-height: normal;
      text-align: right;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #e6ae3f;
    }
    .price_info {
      font-family: Space Grotesk;
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #666666;
      > div {
        margin-top: 4px;
        font-family: Space Grotesk;
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #999999;
      }
    }
  }
`;

let timer: any = null;

const ChainArr = [
  { ChainName: "TRON", tokens: [] },
  {
    ChainName: "BSC",
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
  const CurrentFromLinkRef: any = useRef<any>(null);
  const CurrentToLinkRef: any = useRef<any>(null);
  const { width } = useViewport();
  const { t, i18n } = useTranslation();
  const Navigate = useNavigate();
  let dispatch = useDispatch();
  const { selectedNetworkId } = useWeb3ModalState();
  const [IsBindState, setIsBindState] = useState(false);
  const { token } = useSelector<stateType, stateType>((state) => state);
  const [NodeInfo, setNodeInfo] = useState<any>({});
  const [UserInfo, setUserInfo] = useState<any>({});
  const [NftBase, setNftBase] = useState<any>({});
  const [Tip, setTip] = useState("");
  const [ShowTipModal, setShowTipModal] = useState(false);
  const [ShowSuccessTipModal, setShowSuccessTipModal] = useState(false);
  const [ReferListStateModal, setReferListStateModal] = useState(false);
  const [NodeMintModalState, setNodeMintModalState] = useState(false);
  const [LightUpNodeModalState, setLightUpNodeModalState] = useState(false);
  const [RecommendedOuputModalState, setRecommendedOuputModalState] =
    useState(false);
  const [RevokeNodeModalState, setRevokeNodeModalState] = useState(false);
  const [FromStakingMiningModalState, setFromStakingMiningModalState] =
    useState(false);
  const [ToStakingMiningModalState, setToStakingMiningModalState] =
    useState(false);
  const [EdgeNodeModalState, setEdgeNodeModalState] = useState(false);

  const [SuccessFulHash, setSuccessFulHash] = useState("");
  const [RecordList3, setRecordList3] = useState<any>({});
  const [AllData, setAllData] = useState<any>({});
  const [PersonData, setPersonData] = useState<any>({});
  const [DrawData, setDrawData] = useState<any>(0);
  // 1=挖矿节点 2=未挖矿节点
  const [ModalType, setModalType] = useState<any>(1);

  const [Amount, setAmount] = useState(1);
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
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
  const [FromInputAmount, setFromInputAmount] = useState("");

  const { isNoGasFun } = useNoGas();
  const [IsNode, setIsNode] = useState(false);
  const { open } = useWeb3Modal();
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
            setTip(
              t("Stake 5 AI Nodes for Mining", {
                amount: Number(NftBase?.currentPrice) * Amount ?? 0,
                num: Amount,
              })
            );
            setShowTipModal(true);
            res = await Contracts.example?.mint(
              web3ModalAccount as string,
              item?.data
            );
          } catch (error: any) {
            if (error?.code === 4001) {
              setShowTipModal(false);
              return addMessage(t("11"));
            }
          }
          setShowTipModal(false);

          if (!!res?.status) {
            await call();
            await getInitData();
            setSuccessFulHash(res?.transactionHash);
            setShowTipModal(false);
            setShowSuccessTipModal(true);
            return setTip(
              t("AI node staking mining successful", { num: Amount })
            );
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

  const getWebsocketData = () => {
    timer = setInterval(() => {
      // getAllData().then((res: any) => {
      //   setAllData(res?.data || {});
      // });
      // if (!!token) {
      //   getInitData();
      // }
    }, 3000);
  };

  const getInitData = () => {
    getDrawData().then((res: any) => {
      if (res.code === 200) {
        setDrawData(res?.data || 0);
      }
    });
    getPersonData().then((res: any) => {
      if (res.code === 200) {
        setPersonData(res?.data || {});
      }
    });
  };

  const allTipFun = async (type: any, tip: any = "", hash: any = "") => {
    // 1:授权 2:loding 3:success 4:取消授权
    if (Number(type) === 1 || Number(type) === 2) {
      setTip(tip);
      setShowTipModal(true);
    } else if (Number(type) === 3) {
      setTip(tip);
      setSuccessFulHash(hash);
      setShowSuccessTipModal(true);
    } else if (Number(type) === 4) {
      setShowTipModal(false);
    }
  };

  useEffect(() => {
    getAllData().then((res: any) => {
      setAllData(res?.data || {});
    });

    if (!!token) {
      getInitData();
    } else {
    }
  }, [web3ModalAccount, token]);

  // useEffect(() => {
  //   if (!!web3ModalAccount) {
  //     Contracts.example?.mint(web3ModalAccount).then((res: any) => {
  //       console.log(res, "res");
  //       debugger;
  //       setIsNode(!!res);
  //     });
  //     handleUSDTRefresh();
  //   } else {
  //   }
  // }, [token, web3ModalAccount]);

  useEffect(() => {
    setReceiveAddress(web3ModalAccount as string);
    handleUSDTRefresh();
    isNewUser(web3ModalAccount as string).then((res: any) => {
      if (res?.code === 200) {
        setIsBindState(!res.data || false);
      }
    });
  }, [web3ModalAccount, token, selectedNetworkId]);
  useEffect(() => {
    if (!!token) {
      // getMyNft({ pageNum: 1, pageSize: 10 }).then((res: any) => {
      //   if (res.code !== 200) return;
      //   setRecordList3(res?.data || {});
      // });
    } else {
      setRecordList3({});
    }
  }, [token]);

  useEffect(() => {
    getWebsocketData();
    return () => {
      clearInterval(timer);
    };
  }, [token]);
  useEffect(() => {
    if (!token) {
      setUserInfo({});
      setNodeInfo({});
    }
  }, []);

  const BtnBox = () => {
    if (!web3ModalAccount) return <Btn isActive={true}>Connect Wallet</Btn>;
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
        Exchange
      </Btn>
    );
  };

  return (
    <HomeContainerBox>
      <SwapContainer>
        <SwapContainer_Title>UniAgent Bridge</SwapContainer_Title>
        <SwapItem>
          <SwapItem_Title>
            Transfer out{" "}
            <div>
              Balance: {TOKENBalance ?? "0"}{" "}
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
              <img src={roundIcon} alt="" />
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
                onChange={(e: any) => {
                  setFromInputAmount(e.target.value);
                }}
              />
            </Item_Right>
          </Item>
        </SwapItem>
        <SwapToIcon>
          <img src={toSwap} alt="" />
        </SwapToIcon>

        <SwapItem>
          <SwapItem_Title style={{ marginTop: "0px" }}>
            Receive{" "}
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
              <img src={roundIcon} alt="" />
              <div className="coin_info">
                <div className="chain">{LinkType2} Chain</div>
                <div className="coin">USDT</div>
              </div>
              <img src={dropIcon} alt="" />
            </Item_Left>
            <Devider></Devider>
            <Item_Right>
              <input type="text" value={0} />
            </Item_Right>
          </Item>
        </SwapItem>

        <ReceiveItem>
          Receiving Address
          <ReceiveBox>
            <input
              type="text"
              placeholder="Please enter the receiving address"
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
            Exchange Path <span>uniAgent Bridge</span>
          </div>
          <div>
            Reference Price <span>1 USDT(BSC) = 1.02814 USDT(uniAgent)</span>
          </div>
          <div>
            Fee <span>0.5 USDT(BEP20) + 08 USDT(ERC20)</span>
          </div>
          <div>
            Expected Receipt <span>98.299700</span>
          </div>
        </SwapInfo>
      </SwapContainer>

      <ExchangeRecord>
        <ExchangeRecordTitle>
          <div>
            Exchange Record <span>(Showing only the last 7 days)</span>
          </div>
          <img src={refreshIcon} alt="" />
        </ExchangeRecordTitle>
        <ExchangeRecordItems>
          {/* <ExchangeRecordItem>
            <div>
              <div className="from_coin_info">
                BSC Chain
                <div>100.0000 USDT</div>
              </div>
              <div className="from_coin_to_line">
                <img src={fromToLine} alt="" />
                Expected Receipt
              </div>
            </div>
            <div>
              <div className="from_coin_info">
                BSC Chain
                <div>100.0000 USDT</div>
              </div>
              <div className="state">Exchanging</div>
            </div>
            <div>
              <div className="price_info">
                Reference Price
                <div>1 USDT(BSC) = 1.02814 USDT(uniAgent)</div>
              </div>
            </div>
            <div>
              <div className="price_info">
                Reference Price
                <div>0.5 USDT(BEP20) + 08 USDT(ERC20)</div>
              </div>
            </div>
          </ExchangeRecordItem>
          <ExchangeRecordItem>
            <div>
              <div className="from_coin_info">
                BSC Chain
                <div>100.0000 USDT</div>
              </div>
              <div className="from_coin_to_line">
                <img src={fromToLine} alt="" />
                Expected Receipt
              </div>
            </div>
            <div>
              <div className="from_coin_info">
                BSC Chain
                <div>100.0000 USDT</div>
              </div>
              <div className="state">Exchanging</div>
            </div>
            <div>
              <div className="price_info">
                Reference Price
                <div>1 USDT(BSC) = 1.02814 USDT(uniAgent)</div>
              </div>
            </div>
            <div>
              <div className="price_info">
                Reference Price
                <div>0.5 USDT(BEP20) + 08 USDT(ERC20)</div>
              </div>
            </div>
          </ExchangeRecordItem> */}
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
          getNftBase().then((res: any) => {
            setNftBase(res?.data || {});
          });
          if (!!token) {
            getInitData();
            getMyNft({ pageNum: 1, pageSize: 10 }).then((res: any) => {
              if (res.code !== 200) return;
              setRecordList3(res?.data || {});
            });
          }
        }}
        close={() => {
          setShowSuccessTipModal(false);
        }}
      />
      {/* Referral Revenue */}
      <ReferListModal
        ShowTipModal={ReferListStateModal}
        Tip={Tip}
        close={() => {
          setReferListStateModal(false);
        }}
      />
      {/* AI Node Mining Revenue */}
      <RecommendedOuputModal
        ShowTipModal={RecommendedOuputModalState}
        Tip={Tip}
        close={() => {
          setRecommendedOuputModalState(false);
        }}
      />
      {/* Edge Node Mining Revenue */}
      <RecommendedMintedModal
        ShowTipModal={EdgeNodeModalState}
        Tip={Tip}
        close={() => {
          setEdgeNodeModalState(false);
        }}
      />
      {/* AI Node Mining/AI Nodes De-mining/Undo the lighting of edge nodes */}
      <MyNodeListModal
        ModalType={ModalType}
        ShowTipModal={NodeMintModalState}
        Tip={Tip}
        close={() => {
          setNodeMintModalState(false);
        }}
        allTipFun={allTipFun}
      />
      {/* AI nodes light up edge nodes */}
      <LightUpNode
        ShowTipModal={LightUpNodeModalState}
        Tip={Tip}
        close={() => {
          setLightUpNodeModalState(false);
        }}
        allTipFun={allTipFun}
      />
      {/* UAC Staking */}
      <RevokeNode
        ShowTipModal={RevokeNodeModalState}
        Tip={Tip}
        close={() => {
          setRevokeNodeModalState(false);
        }}
        allTipFun={allTipFun}
      />
      {/* Select From Send Tokens */}
      <FromStakingMiningModal
        ref={CurrentFromLinkRef}
        ChainArr={ChainArr}
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
    </HomeContainerBox>
  );
}
