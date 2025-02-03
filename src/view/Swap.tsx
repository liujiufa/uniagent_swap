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
} from "../API/index";
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
import copyIcon from "../assets/image/Swap/copyIcon.png";
import dropIcon from "../assets/image/Swap/dropIcon.svg";
import toSwaps from "../assets/image/Swap/toSwaps.png";
import receiveIcon from "../assets/image/Swap/receiveIcon.svg";
import refreshIcon from "../assets/image/Swap/refreshIcon.svg";
import fromToLine from "../assets/image/Swap/fromToLine.png";
import toIcon from "../assets/image/Swap/toIcon.svg";
import dropdownIcon from "../assets/image/Swap/dropdownIcon.svg";
import addIcon from "../assets/image/Swap/addIcon.png";
import nodata from "../assets/image/Swap/nodata.png";

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
import SelectTokensModal from "../components/SelectTokensModal";
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
  margin-top: 20px;
  width: 100%;
  padding: 24px;
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

const SwapContainer_Title = styled(FlexBox)`
  align-items: center;
  font-family: "Space Grotesk";
  font-size: 24px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #93e63f;
  > img {
    margin-right: 14px;
  }
  @media (max-width: 768px) {
    font-family: Space Grotesk;
    font-size: 18px;
    font-weight: bold;
    line-height: 18px;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #93e63f;
    > img {
      margin-right: 8px;
    }
  }
`;
const SwapItem = styled.div``;

const SwapItemBottom = styled.div`
  margin-top: 50px;
  @media (max-width: 768px) {
    margin-top: 36px;
  }
`;

const SwapItem_Title = styled(FlexSBCBox)`
  font-family: Space Grotesk;
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin: 36px 0px 15px;
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
      font-size: 16px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
      > span {
        font-family: Space Grotesk;
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        text-align: right;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #ffffff;
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

  @media (max-width: 768px) {
  }
`;
const Item_Left = styled(FlexSBCBox)`
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
    flex: 1;
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
    }
  }
  @media (max-width: 768px) {
    padding: 16px 9px;
    min-width: 107px;

    > img {
      &:nth-child(1) {
        width: 24px;
        height: 24px;
        margin-right: 6px;
      }
      width: 16px;
      height: 16px;
    }
    .coin_info {
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
    text-align: left;
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
      height: 26px;
      font-family: Space Grotesk;
      font-size: 20px;
      font-weight: bold;
      line-height: 20px;
      text-align: right;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
  }
`;

const SwapToIcon = styled(FlexCCBox)`
  margin: 38px auto 0px;
  width: 36px;
  height: 36px;
  > img {
    width: 100%;
  }
  @media (max-width: 768px) {
    margin: 32px auto 0px;
    width: 20px;
    height: 20px;
  }
`;
const Btn = styled(FlexCCBox)<{ isActive: boolean }>`
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
    margin: 32px 0px 0px;
    font-family: Space Grotesk;
    font-size: 16px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #0a0a0a;
  }
`;
const SwapInfo = styled.div`
  margin-top: 36px;
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
    margin-top: 32px;
    padding: 13px 10px;
    > div {
      margin-bottom: 15px;
      font-family: Space Grotesk;
      font-size: 16px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #999999;
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
  }
`;
const SwapContainer_Tabs = styled(FlexSBCBox)`
  margin-top: 82px;
  width: 100%;
  border-radius: 6px;
  opacity: 1;
  background: #0a0a0a;
  box-sizing: border-box;
  border: 1px solid #93e63f;
  padding: 7px;

  > div {
    width: 33%;
    padding: 12px;
    border: none;
    font-family: Space Grotesk;
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    text-align: center;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
  .active {
    color: #000000;
    border-radius: 6px;
    opacity: 1;
    background: #93e63f;
  }
  @media (max-width: 768px) {
    margin-top: 30px;
    padding: 6px;
    > div {
      padding: 11px;

      font-family: Space Grotesk;
      font-size: 18px;
      font-weight: bold;
      line-height: normal;
      text-align: center;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
    }
  }
`;
const SelectTokenPair = styled.div``;
const Tokens = styled(FlexBox)`
  justify-content: flex-start;
  align-items: center;
  > img {
    margin: 0px 30px;
    width: 23px;
    height: 23px;
  }
  @media (max-width: 768px) {
    > img {
      width: 16px;
      height: 16px;
      margin: 0px 18px;
    }
  }
`;
const Token = styled(FlexSBCBox)`
  width: 100%;
  max-width: 190px;
  padding: 11px 20px;
  border-radius: 6px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #666666;

  > img {
    &:nth-child(1) {
      width: 24px;
      height: 24px;
    }
    &:nth-child(2) {
      width: 16px;
      height: 16px;
    }
  }
  > div {
    padding: 0 12px;
    flex: 1;
    font-family: Space Grotesk;
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
  @media (max-width: 768px) {
    max-width: fit-content;
    padding: 11px 8px;
    > div {
      font-family: Space Grotesk;
      font-size: 18px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
  }
`;

const SwapItem_Title_Item = styled(FlexSBCBox)`
  margin-bottom: 15px;
  > div {
    &:first-child {
      display: flex;
      align-items: center;

      font-family: Space Grotesk;
      font-size: 18px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
      img {
        width: 24px;
        height: 24px;
      }
      div {
        font-family: Space Grotesk;
        font-size: 18px;
        font-weight: bold;
        line-height: normal;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #ffffff;
        margin: 0px 14px 0px 8px;
      }
    }
    &:nth-child(2) {
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
    margin-bottom: 10px;
    > div {
      &:first-child {
        font-family: Space Grotesk;
        font-size: 16px;
        font-weight: bold;
        line-height: normal;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #ffffff;
        img {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
`;
const SwapInfo_Title = styled.div`
  font-family: Space Grotesk !important;
  font-size: 18px !important;
  font-weight: bold !important;
  line-height: normal !important;
  letter-spacing: 0em !important;
  font-variation-settings: "opsz" auto !important;
  color: #ffffff !important;
  @media (max-width: 768px) {
    font-size: 16px !important;
  }
`;
const SwapInfo_Content = styled.div``;
const SwapInfo_Item = styled(FlexSBCBox)`
  width: 100%;
`;
const SwapInfo_Item_Left = styled.div`
  font-family: Space Grotesk;
  font-size: 16px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #999999;
  > div {
    display: flex;
    align-items: center;
    font-family: Space Grotesk;
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    margin-bottom: 15px;
    img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
  }
  @media (max-width: 768px) {
    font-family: Space Grotesk;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
    > div {
      font-family: Space Grotesk;
      font-size: 16px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
      margin-bottom: 12px;
      img {
        margin-right: 6px;
      }
    }
  }
`;
const SwapInfo_Item_Right = styled.div``;
const Remove_Btn = styled(FlexCCBox)`
  padding: 9px 18px;
  border-radius: 8px;
  opacity: 1;
  background: rgba(147, 230, 63, 0.1);
  box-sizing: border-box;
  border: 1px solid #557930;
  font-family: Space Grotesk;
  font-size: 16px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #93e63f;
  @media (max-width: 768px) {
    border-radius: 8px;
    opacity: 1;
    background: rgba(147, 230, 63, 0.1);
    box-sizing: border-box;
    border: 1px solid #557930;
    padding: 9px;
  }
`;
const NoData = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Space Grotesk;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #666666;
  > img {
    width: 44px;
    height: 44px;
    margin-bottom: 8px;
  }
`;
const LiquidityItem = styled.div`
  padding: 24px;
  border-radius: 6px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #666666;
  > input {
    font-family: Space Grotesk;
    font-size: 48px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    background: transparent;
    outline: none;
    border: none;
  }
  @media (max-width: 768px) {
    padding: 14px;
    > input {
      font-family: Space Grotesk;
      font-size: 32px;
      font-weight: bold;
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
    padding: 9px 24px;
    border-radius: 24px;
    opacity: 1;
    background: rgba(147, 230, 63, 0.1);
    box-sizing: border-box;
    border: 1px solid #557930;
    font-family: Space Grotesk;
    font-size: 16px;
    font-weight: bold;
    line-height: normal;
    text-align: center;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #7fc33a;
    margin-right: 8px;
  }
  @media (max-width: 768px) {
    > div {
      padding: 7px 16px;
      font-family: Space Grotesk;
      font-size: 14px;
      font-weight: bold;
      line-height: normal;
      text-align: center;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #7fc33a;
    }
  }
  @media (max-width: 375px) {
    flex-wrap: wrap;
    > div {
      margin-top: 8px;
    }
  }
`;
const ReceivedBox = styled.div`
  width: 100%;
  padding: 20px;
  border-radius: 6px;
  opacity: 1;
  background: #1f1f1f;
  > div {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
  @media (max-width: 768px) {
    padding: 20px 9px;
  }
`;
const ReceivedBox_Item = styled(FlexSBCBox)`
  > div {
    display: flex;
    align-items: center;
    img {
      height: 24px;
      width: 24px;
      margin-right: 8px;
    }
    font-family: Space Grotesk;
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
  @media (max-width: 768px) {
    > div {
      font-family: Space Grotesk;
      font-size: 14px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
  }
`;
const LiquidityPrice = styled.div`
  margin: 15px 0px 120px;
  font-family: Space Grotesk;
  font-size: 16px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #999999;
  @media (max-width: 768px) {
    margin: 10px 0px 66px;
    font-family: Space Grotesk;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
  }
`;
let timer: any = null;
export default function Rank() {
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
  const [SelectTokensModalState, setSelectTokensModalState] = useState(false);
  const [EdgeNodeModalState, setEdgeNodeModalState] = useState(false);

  const [SuccessFulHash, setSuccessFulHash] = useState("");
  const [RecordList3, setRecordList3] = useState<any>({});
  const [AllData, setAllData] = useState<any>({});
  const [PersonData, setPersonData] = useState<any>({});
  const [DrawData, setDrawData] = useState<any>(0);
  // 1=挖矿节点 2=未挖矿节点
  const [ModalType, setModalType] = useState<any>(1);
  const [LiquidityType, setLiquidityType] = useState<any>(2);
  const [TabActive, setTabActive] = useState("Trade");

  const [Amount, setAmount] = useState(1);
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.NFTManage, "USDT");
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

  const CopyCodeFun = (code: string) => {
    if (!IsBindState) return addMessage(t("9"));
    if (!web3ModalAccount) {
      return addMessage(t("Please Connect wallet"));
    } else {
      copyFun(window.location.origin + `?inviteCode=${code}`);
      addMessage(t("Copied successfully"));
    }
  };

  const buyNFTFun = (value: any) => {
    if (!web3ModalAccount) return addMessage(t("Please Connect wallet"));
    if (!IsBindState) return addMessage(t("9"));
    if (Number(value) <= 0) return;
    handleTransaction(
      value + "",
      async (call: any) => {
        let res: any = null;
        let item: any = await payNft({ buyNum: Amount });
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
          t("Approving 5 AI Nodes", {
            amount: Number(NftBase?.currentPrice) * Amount ?? 0,
            num: Amount,
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
      getAllData().then((res: any) => {
        setAllData(res?.data || {});
      });

      if (!!token) {
        getInitData();
      }
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

  return (
    <HomeContainerBox>
      <SwapContainer_Tabs>
        <div
          className={String(TabActive) === "Trade" ? "active" : ""}
          onClick={() => {
            setTabActive("Trade");
          }}
        >
          Trade
        </div>
        <div
          className={String(TabActive) === "TWAP" ? "active" : ""}
          onClick={() => {
            setTabActive("TWAP");
          }}
        >
          TWAP
        </div>
        <div
          className={String(TabActive) === "Liquidity" ? "active" : ""}
          onClick={() => {
            setTabActive("Liquidity");
          }}
        >
          Liquidity
        </div>
      </SwapContainer_Tabs>
      {String(TabActive) === "Trade" && (
        <SwapContainer>
          <SwapContainer_Title>UniAgent Swap</SwapContainer_Title>
          <SwapItem>
            <SwapItem_Title>
              Transfer out <div>Balance: 100</div>
            </SwapItem_Title>

            <Item>
              <Item_Left>
                <img src={roundIcon} alt="" />
                <div className="coin_info">
                  {/* <div className="chain">BSC Chain</div> */}
                  <div className="coin">UAC</div>
                </div>
                <img src={dropIcon} alt="" />
              </Item_Left>
              <Devider></Devider>
              <Item_Right>
                <input type="text" value={0} />
              </Item_Right>
            </Item>
          </SwapItem>
          <SwapToIcon>
            <img src={toSwaps} alt="" />
          </SwapToIcon>

          <SwapItem>
            <SwapItem_Title style={{ marginTop: "0px" }}>
              Receive{" "}
              {/* <div>
              Balance: 100 <span>All</span>
            </div> */}
            </SwapItem_Title>

            <Item>
              <Item_Left>
                <img src={roundIcon} alt="" />
                <div className="coin_info">
                  {/* <div className="chain">UniAgent Chain</div> */}
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

          {/* <ReceiveItem>
          Receiving Address
          <ReceiveBox>
            <input
              type="text"
              placeholder="Please enter the receiving address"
            />{" "}
            <img src={receiveIcon} alt="" />
          </ReceiveBox>
        </ReceiveItem> */}

          <Btn isActive={true}>Connect Wallet</Btn>

          <SwapInfo>
            {/* <div>
            Exchange Path <span>uniAgent Bridge</span>
          </div> */}
            <div>
              Reference Price <span>1 UAC = 10.02814 USDT</span>
            </div>
            <div>
              Price Impact <span>0.133%</span>
            </div>
            <div>
              Slippage Limit <span>5.00%</span>
            </div>
            <div>
              Transaction Fee <span>0.2UAC</span>
            </div>
            <div>
              Minimum Received <span>98.299700</span>
            </div>
            <div>
              Swap Path<span>UniAgent Swap</span>
            </div>
          </SwapInfo>
        </SwapContainer>
      )}
      {String(TabActive) === "Liquidity" &&
        (Number(LiquidityType) === 1 ? (
          <SwapContainer>
            <SwapContainer_Title>
              {" "}
              <img src={toIcon} alt="" /> Remove UAC-USDT Liquidity
            </SwapContainer_Title>

            <SwapItem_Title>Enter Withdrawal Percentage</SwapItem_Title>
            <SwapItem>
              <LiquidityItem>
                <input type="text" value={"0%"} />
                <PercentageBox>
                  <div>25%</div>
                  <div>50%</div>
                  <div>75%</div>
                  <div>100%</div>
                </PercentageBox>
              </LiquidityItem>
            </SwapItem>
            <SwapItemBottom>
              <SwapItem_Title_Item>
                <div>Received Amount</div>
              </SwapItem_Title_Item>
              <ReceivedBox>
                <ReceivedBox_Item>
                  <div>
                    <img src={roundIcon} alt="" />
                    UAC
                  </div>
                  <div>1000.0000</div>
                </ReceivedBox_Item>
                <ReceivedBox_Item>
                  <div>
                    <img src={roundIcon} alt="" />
                    UAC
                  </div>
                  <div>1000.0000</div>
                </ReceivedBox_Item>
              </ReceivedBox>
            </SwapItemBottom>
            <LiquidityPrice>
              Reference Price 1 UAC = 10.02814 USDT
            </LiquidityPrice>

            <Btn isActive={true}>Enter withdrawal percentage</Btn>
          </SwapContainer>
        ) : (
          <SwapContainer>
            <SwapContainer_Title>
              {" "}
              <img src={toIcon} alt="" /> Add V2 Liquidity
            </SwapContainer_Title>

            <SelectTokenPair>
              <SwapItem_Title>Select Token Pair</SwapItem_Title>
              <Tokens>
                <Token>
                  <img src={roundIcon} alt="" />
                  <div>UAC</div>
                  <img src={dropdownIcon} alt="" />
                </Token>
                <img src={addIcon} alt="" />
                <Token>
                  <img src={roundIcon} alt="" />
                  <div>UAC</div>
                  <img src={dropdownIcon} alt="" />
                </Token>
              </Tokens>
            </SelectTokenPair>
            <SwapItem_Title>Enter Amount</SwapItem_Title>

            <SwapItem>
              <SwapItem_Title_Item>
                <div>
                  <img src={roundIcon} alt="" />
                  <div>UAC</div>

                  <img src={copyIcon} alt="" />
                </div>
                <div>Balance: 100</div>
              </SwapItem_Title_Item>

              <Item>
                {/* <Item_Left>
                <img src={roundIcon} alt="" />
                <div className="coin_info">
                  <div className="coin">UAC</div>
                </div>
                <img src={dropIcon} alt="" />
              </Item_Left>
              <Devider></Devider> */}
                <Item_Right>
                  <input type="text" value={0} />
                </Item_Right>
              </Item>
            </SwapItem>
            {/* <SwapToIcon>
            <img src={toSwaps} alt="" />
          </SwapToIcon> */}

            <SwapItemBottom>
              <SwapItem_Title_Item>
                <div>
                  <img src={roundIcon} alt="" />
                  <div>USDT</div>

                  <img src={copyIcon} alt="" />
                </div>
                <div>Balance: 100</div>
              </SwapItem_Title_Item>

              <Item>
                {/* <Item_Left>
                <img src={roundIcon} alt="" />
                <div className="coin_info">
                  <div className="coin">UAC</div>
                </div>
                <img src={dropIcon} alt="" />
              </Item_Left>
              <Devider></Devider> */}
                <Item_Right>
                  <input type="text" value={0} />
                </Item_Right>
              </Item>
            </SwapItemBottom>

            {/* <ReceiveItem>
          Receiving Address
          <ReceiveBox>
            <input
              type="text"
              placeholder="Please enter the receiving address"
            />{" "}
            <img src={receiveIcon} alt="" />
          </ReceiveBox>
        </ReceiveItem> */}

            <Btn isActive={true}>Connect Wallet</Btn>

            <SwapInfo>
              <SwapInfo_Title>Your Position</SwapInfo_Title>
              {false ? (
                <SwapInfo_Content>
                  <SwapInfo_Item>
                    <SwapInfo_Item_Left>
                      <div>
                        <img src={roundIcon} alt="" />
                        <img src={roundIcon} alt="" />
                        UAC-USDT V2 LP
                      </div>
                      1000.0000LP
                    </SwapInfo_Item_Left>
                    <SwapInfo_Item_Right>
                      <Remove_Btn>Remove</Remove_Btn>
                    </SwapInfo_Item_Right>
                  </SwapInfo_Item>
                </SwapInfo_Content>
              ) : (
                <SwapInfo_Content>
                  <NoData>
                    <img src={nodata} alt="" />
                    No current positions
                  </NoData>
                </SwapInfo_Content>
              )}
            </SwapInfo>
          </SwapContainer>
        ))}

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
      {/* Select Send Tokens */}
      <SelectTokensModal
        ShowTipModal={SelectTokensModalState}
        Tip={Tip}
        close={() => {
          setSelectTokensModalState(false);
        }}
        allTipFun={allTipFun}
      />
    </HomeContainerBox>
  );
}
