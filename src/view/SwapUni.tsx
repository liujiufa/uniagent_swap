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
import { useLocation, useNavigate } from "react-router-dom";
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
import closeIcon from "../assets/image/closeIcon.svg";
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
  useAppKitProvider,
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
      padding: 0px 15px;
      padding: 0px 15px 226px;
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
  margin-top: 50px;
  @media (max-width: 768px) {
    margin-top: 36px;
  }
`;

const SwapItem_Title = styled(FlexSBCBox)`
  font-family: "Space Grotesk";
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin: 36px 0px 15px;
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
      font-size: 16px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
      > span {
        font-family: "Space Grotesk";
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
    flex: 1;
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
      font-family: "Space Grotesk";
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
    cursor: pointer;
    width: 100%;
  }
  @media (max-width: 768px) {
    margin: 32px auto 0px;
    width: 20px;
    height: 20px;
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
      display: flex;
      align-items: center;
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
    margin-top: 32px;
    padding: 13px 10px;
    > div {
      margin-bottom: 15px;
      font-family: "Space Grotesk";
      font-size: 16px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #999999;
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
  }
`;
const SwapContainer_Tabs = styled(FlexSBCBox)`
  width: 100%;
  border-radius: 6px;
  opacity: 1;
  background: #0a0a0a;
  box-sizing: border-box;
  border: 1px solid #685319;
  padding: 7px;

  > div {
    width: 33%;
    padding: 12px;
    border: none;
    font-family: "Space Grotesk";
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
    background: #f4c134;
  }
  @media (max-width: 768px) {
    padding: 6px;
    > div {
      padding: 6px;

      font-family: "Space Grotesk";
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
    font-family: "Space Grotesk";
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
      font-family: "Space Grotesk";
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

      font-family: "Space Grotesk";
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
        font-family: "Space Grotesk";
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
    margin-bottom: 10px;
    > div {
      &:first-child {
        font-family: "Space Grotesk";
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
  font-family: "Space Grotesk" !important;
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
  font-family: "Space Grotesk";
  font-size: 16px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #999999;
  > div {
    display: flex;
    align-items: center;
    font-family: "Space Grotesk";
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
    font-family: "Space Grotesk";
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
    > div {
      font-family: "Space Grotesk";
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
  cursor: pointer;
  padding: 9px 18px;
  border-radius: 8px;
  opacity: 1;
  background: rgba(147, 230, 63, 0.1);
  box-sizing: border-box;
  border: 1px solid #685319;
  font-family: "Space Grotesk";
  font-size: 16px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #f4c134;
  @media (max-width: 768px) {
    border-radius: 8px;
    opacity: 1;
    background: rgba(147, 230, 63, 0.1);
    box-sizing: border-box;
    border: 1px solid #685319;
    padding: 9px;
  }
`;
const NoData = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Space Grotesk";
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
    font-family: "Space Grotesk";
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
      font-family: "Space Grotesk";
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
    border: 1px solid #685319;
    font-family: "Space Grotesk";
    font-size: 16px;
    font-weight: bold;
    line-height: normal;
    text-align: center;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #f4c134;
    margin-right: 8px;
  }
  @media (max-width: 768px) {
    > div {
      padding: 7px 16px;
      font-family: "Space Grotesk";
      font-size: 14px;
      font-weight: bold;
      line-height: normal;
      text-align: center;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #f4c134;
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
    font-family: "Space Grotesk";
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
  @media (max-width: 768px) {
    > div {
      font-family: "Space Grotesk";
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
  font-family: "Space Grotesk";
  font-size: 16px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #999999;
  @media (max-width: 768px) {
    margin: 10px 0px 66px;
    font-family: "Space Grotesk";
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
  }
`;

const AllModal = styled(Modal)`
  z-index: 10000;
  .ant-modal-content {
    overflow: hidden;
    border-radius: 12px;
    opacity: 1;
    background: #0a0a0a;
    box-sizing: border-box;
    border: 1px solid #685319;
    .ant-modal-body {
      position: relative;
      padding: 0px;
    }
  }
`;

const ModalContainer = styled(FlexBox)`
  /* position: relative; */
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ModalContainer_Close = styled(FlexCCBox)`
  position: absolute;
  z-index: 100;
  top: 16px;
  right: 16px;
  z-index: 100;
`;

export const ModalContainer_Title_Container = styled(FlexCCBox)`
  width: 100%;
  > img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  > svg {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
`;

export const ModalContainer_Title = styled(FlexBox)`
  width: 100%;
  align-items: center;
  justify-content: center;
  font-family: "Space Grotesk";
  font-size: 24px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  padding: 39px 39px 0px;
  @media (max-width: 1200px) {
    font-size: 18px;
  }
  @media (max-width: 768px) {
    padding: 39px 16px 0px;
    font-size: 18px;
  }
`;
const ModalContainer_Content = styled.div`
  padding: 39px 30px;
  width: 100%;
  @media (max-width: 768px) {
    padding: 29px 12px;
  }
`;
const ModalContainer_Content_Tip = styled.div`
  font-family: Space Grotesk;
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
const ModalContainer_Content_Input = styled(FlexSBCBox)`
  font-family: Space Grotesk;
  font-size: 20px;
  font-weight: bold;
  line-height: normal;
  text-align: right;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  border-radius: 6px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #666666;
  padding: 15px 18px;
  margin: 17px auto 30px;
  > input {
    border: none;
    outline: none;
    background: transparent;
    font-family: Space Grotesk;
    font-size: 20px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
  @media (max-width: 768px) {
    margin: 14px auto 25px;
    padding: 15px 13px;
  }
`;
const Confirm_Btn = styled(FlexCCBox)`
  font-family: Space Grotesk;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #0a0a0a;
  padding: 14px;
  border-radius: 8px;
  opacity: 1;
  background: #f4c134;
  @media (max-width: 768px) {
    font-family: Space Grotesk;
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #0a0a0a;
  }
`;
const SwapBanner = styled.div`
  width: 100%;
  margin: 82px 0px 20px;

  img {
    width: 100%;
  }
  @media (max-width: 768px) {
    margin: 15px 0px 15px;
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
  const { walletProvider } = useAppKitProvider("eip155");

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
  const { state: stateObj } = useLocation();
  const [TabActive, setTabActive] = useState(stateObj?.tab ?? "Trade");

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
  const [PercentValue, setPercentValue] = useState("0%");
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
    TOKENBalance: CurrentAddLiquidity1TOKENBalance,
    TOKENAllowance: CurrentAddLiquidity1TOKENAllowance,
    handleApprove: CurrentAddLiquidity1handleApprove,
    handleTransaction: CurrentAddLiquidity1handleTransaction,
    handleUSDTRefresh: CurrentAddLiquidity1handleUSDTRefresh,
  } = useUSDTGroup(
    CurrentAddLiquidityToken1?.Router,
    CurrentAddLiquidityToken1?.tokenAddress
  );
  const {
    TOKENBalance: CurrentAddLiquidity2TOKENBalance,
    TOKENAllowance: CurrentAddLiquidity2TOKENAllowance,
    handleApprove: CurrentAddLiquidity2handleApprove,
    handleTransaction: CurrentAddLiquidity2handleTransaction,
    handleUSDTRefresh: CurrentAddLiquidity2handleUSDTRefresh,
  } = useUSDTGroup(
    CurrentAddLiquidityToken1?.Router,
    CurrentAddLiquidityToken2?.tokenAddress
  );
  console.log(
    CurrentAddLiquidity1TOKENAllowance,
    CurrentAddLiquidity2TOKENAllowance,
    "授权额度"
  );
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

  const getInitData = () => {};

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
  const getCoinList = async () => {
    let Arr = [];
    if (!!web3ModalAccount) {
      for (let item of tokenList) {
        let value: any = 0;
        if (String(item?.name) === "UAC") {
          try {
            value = await Contracts.example?.getBalance(
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
  const SelectTokenFun = (tokenName: any) => {
    if (String(CurrentSelectedState) === "from") {
      setFromToken(tokenName);
      setToToken(
        tokenList?.filter((item: any) => {
          const Result = (obj: any) => {
            return (
              obj?.chainId === chainId &&
              String(obj?.name) !== String(tokenName)
            );
          };

          return Result(item);
        })[0]?.name
      );
    } else if (String(CurrentSelectedState) === "to") {
      setToToken(tokenName);
      setFromToken(
        tokenList?.filter((item: any) => {
          const Result = (item: any) => {
            return (
              item?.chainId === chainId &&
              String(item?.name) !== String(tokenName)
            );
          };
          return Result(item);
        })[0]?.name
      );
    }
  };
  const SelectAddLiquidityTokenFun = (tokenName: any) => {
    if (Number(AddLiquidityTokenType) === 1) {
      setAddLiquidityToken1(tokenName);

      setAddLiquidityToken2(
        tokenList?.filter((item: any) => {
          const Result = (item: any) => {
            return (
              item?.chainId === chainId &&
              String(item?.name) !== String(tokenName)
            );
          };
          return Result(item);
        })[0]?.name
      );
    } else if (Number(AddLiquidityTokenType) === 2) {
      setAddLiquidityToken2(tokenName);
      setAddLiquidityToken1(
        tokenList?.filter((item: any) => {
          const Result = (item: any) => {
            return (
              item?.chainId === chainId &&
              String(item?.name) !== String(tokenName)
            );
          };
          return Result(item);
        })[0]?.name
      );
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

  const SwapFun = async () => {
    // return addMessage(t("Coming soon"));
    // usdt、uac之间兑换特殊处理
    if (chainId === curentUNIChainId) {
      if (String(FromToken) === "USDT") {
        handleTransaction(
          InputAmount + "",
          async (call: any) => {
            let res: any = null;
            try {
              if (!!(await isNoGasFun())) return;
              setTip(
                t("UAC exchanging for USDT", {
                  FromToken: FromToken,
                  ToToken: ToToken,
                })
              );
              setShowTipModal(true);
              res = await Contracts.example?.swapExactTokensForETH(
                web3ModalAccount as string,
                InputAmount,
                Number(ReceiveAmount) * (1 - Number(SlippageValue) / 100),
                [CurrentFromToken?.tokenAddress, CurrentToToken?.tokenAddress],
                CurrentFromToken?.Router
              );
            } catch (error: any) {
              if (error?.code === 4001) {
                setShowTipModal(false);
                return addMessage(t("failed"));
              }
            }
            setShowTipModal(false);

            if (!!res?.status) {
              await call();
              await getCoinList();
              setSuccessFulHash(res?.transactionHash);
              setShowTipModal(false);
              setShowSuccessTipModal(true);
              return setTip(
                t("Exchange successful, received 100.0000 USDT", {
                  amount: NumSplic1(ReceiveAmount, 4),
                  ToToken: ToToken,
                })
              );
              // setShowTipModal(true);
            } else if (res?.status === false) {
              setShowTipModal(false);
              return addMessage(t("failed"));
            }
          },
          () => {
            setTip(
              t("Approve 100.0000 USDT", {
                num: NumSplic1(InputAmount),
                coin: FromToken,
              })
            );
            setShowTipModal(true);
          },
          () => {
            setShowTipModal(false);
          }
        );
      } else if (String(FromToken) === "UAC") {
        let res: any = null;
        try {
          if (!!(await isNoGasFun())) return;
          setTip(
            t("UAC exchanging for USDT", {
              FromToken: FromToken,
              ToToken: ToToken,
            })
          );
          setShowTipModal(true);
          res = await Contracts.example?.swapExactETHForTokens(
            web3ModalAccount as string,
            InputAmount,
            [CurrentFromToken?.tokenAddress, CurrentToToken?.tokenAddress],
            CurrentFromToken?.Router
          );
        } catch (error: any) {
          if (error?.code === 4001) {
            setShowTipModal(false);
            return addMessage(t("failed"));
          }
        }
        setShowTipModal(false);

        if (!!res?.status) {
          await getCoinList();
          setSuccessFulHash(res?.transactionHash);
          setShowTipModal(false);
          setShowSuccessTipModal(true);
          return setTip(
            t("Exchange successful, received 100.0000 USDT", {
              amount: NumSplic1(ReceiveAmount, 4),
              ToToken: ToToken,
            })
          );
          // setShowTipModal(true);
        } else if (res?.status === false) {
          setShowTipModal(false);
          return addMessage(t("failed"));
        }
      }
    } else {
      handleTransaction(
        InputAmount + "",
        async (call: any) => {
          let res: any = null;
          try {
            if (!!(await isNoGasFun())) return;
            setTip(
              t("UAC exchanging for USDT", {
                FromToken: FromToken,
                ToToken: ToToken,
              })
            );
            setShowTipModal(true);
            res =
              await Contracts.example?.swapExactTokensForTokensSupportingFeeOnTransferTokens(
                web3ModalAccount as string,
                InputAmount,
                Number(ReceiveAmount) * (1 - Number(SlippageValue) / 100),
                [CurrentFromToken?.tokenAddress, CurrentToToken?.tokenAddress],
                CurrentFromToken?.Router
              );
          } catch (error: any) {
            if (error?.code === 4001) {
              setShowTipModal(false);
              return addMessage(t("failed"));
            }
          }
          setShowTipModal(false);

          if (!!res?.status) {
            await call();
            await getCoinList();
            setSuccessFulHash(res?.transactionHash);
            setShowTipModal(false);
            setShowSuccessTipModal(true);
            return setTip(
              t("Exchange successful, received 100.0000 USDT", {
                amount: NumSplic1(ReceiveAmount, 4),
                ToToken: ToToken,
              })
            );
            // setShowTipModal(true);
          } else if (res?.status === false) {
            setShowTipModal(false);
            return addMessage(t("failed"));
          }
        },
        () => {
          setTip(
            t("Approve 100.0000 USDT", {
              num: NumSplic1(InputAmount),
              coin: FromToken,
            })
          );
          setShowTipModal(true);
        },
        () => {
          setShowTipModal(false);
        }
      );
    }
  };
  // 原生代币和ERC-20代币
  const AddLiquidityFun = async () => {
    let USDTAmount =
      String(AddLiquidityToken1) === "USDT"
        ? AddLiquidityTokenAmount1
        : AddLiquidityTokenAmount2;
    let UACAmount =
      String(AddLiquidityToken1) === "UAC"
        ? AddLiquidityTokenAmount1
        : AddLiquidityTokenAmount2;
    // coin1、coin2哪个币ERC20就授权哪个
    let fun: any =
      String(AddLiquidityToken1) === "UAC"
        ? CurrentAddLiquidity2handleTransaction
        : CurrentAddLiquidity1handleTransaction;
    fun(
      USDTAmount,
      async (call: any) => {
        let res: any = null;
        try {
          if (!!(await isNoGasFun())) return;
          setTip(
            t("Adding UACUSDT LP", {
              AddLiquidityToken1: AddLiquidityToken1,
              AddLiquidityToken2: AddLiquidityToken2,
            })
          );
          setShowTipModal(true);
          res = await Contracts.example?.addLiquidityETH(
            web3ModalAccount as string,
            tokenList
              ?.filter((item: any) => item?.chainId === chainId)
              ?.find((item: any) => String(item?.name) === String("USDT"))
              ?.tokenAddress,
            UACAmount,
            USDTAmount,
            CurrentFromToken?.Router
          );
          // debugger;
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
          // debugger;
          await call();
          await getCoinList();
          await getLpBalance();
          // setCurrentLPBalance();
          setSuccessFulHash(res?.transactionHash);
          setShowTipModal(false);
          setShowAddLiquiditySuccessTipModal(true);
          setTitle(t("Liquidity Added Successfully"));
          return setTip(
            t("Received 12.0000 UACUSDT LP", {
              amount: NumSplic1(EthertoWei(lastEvent?.value ?? "0"), 4),
              AddLiquidityToken1: AddLiquidityToken1,
              AddLiquidityToken2: AddLiquidityToken2,
            })
          );
          // setShowTipModal(true);
        } else if (res?.status === false) {
          setShowTipModal(false);
          return addMessage(t("failed"));
        }
      },
      () => {
        setTip(
          t("Approve 100.0000 USDT", {
            num: NumSplic1(USDTAmount),
            coin: "USDT",
          })
        );
        setShowTipModal(true);
      },
      () => {
        setShowTipModal(false);
      }
    );
  };

  // ERC-20代币和ERC-20代币
  const AddLiquidityFun1 = async () => {
    let res: any = null;
    try {
      if (!!(await isNoGasFun())) return;
      setTip(
        t("Adding UACUSDT LP", {
          AddLiquidityToken1: AddLiquidityToken1,
          AddLiquidityToken2: AddLiquidityToken2,
        })
      );
      setShowTipModal(true);
      res = await Contracts.example?.addLiquidity(
        web3ModalAccount as string,
        CurrentAddLiquidityToken1.tokenAddress,
        CurrentAddLiquidityToken2.tokenAddress,
        AddLiquidityTokenAmount1,
        AddLiquidityTokenAmount2,
        CurrentAddLiquidityToken1?.Router
      );
    } catch (error: any) {
      debugger;
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
      await getCoinList();
      await getLpBalance();
      // setCurrentLPBalance();
      setSuccessFulHash(res?.transactionHash);
      setShowTipModal(false);
      setShowAddLiquiditySuccessTipModal(true);
      setTitle(t("Liquidity Added Successfully"));
      return setTip(
        t("Received 12.0000 UACUSDT LP", {
          amount: NumSplic1(EthertoWei(lastEvent?.value ?? "0"), 4),
          AddLiquidityToken1: AddLiquidityToken1,
          AddLiquidityToken2: AddLiquidityToken2,
        })
      );
      // setShowTipModal(true);
    } else if (res?.status === false) {
      setShowTipModal(false);
      return addMessage(t("failed"));
    }
  };

  const RemoveLiquidityFun = async () => {
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
              NumSplic1(
                (parseFloat(String(PercentValue)?.replace("%", "")) / 100) *
                  Number(LPBalance ?? 0)
              ) + "",
              CurrentAddLiquidityToken1?.Router
            );
          } else {
            // ERC20+ERC20
            res = await Contracts.example?.removeLiquidity(
              web3ModalAccount as string,
              CurrentAddLiquidityToken1?.tokenAddress,
              CurrentAddLiquidityToken2?.tokenAddress,
              NumSplic1(
                (parseFloat(String(PercentValue)?.replace("%", "")) / 100) *
                  Number(LPBalance ?? 0)
              ) + "",
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
            num: NumSplic1(
              (parseFloat(String(PercentValue)?.replace("%", "")) / 100) *
                Number(LPBalance ?? 0)
            ),
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
  const getPriceImpact = async () => {
    try {
      let lpAddress: any = await Contracts.example?.getPair(
        web3ModalAccount as string,
        CurrentAddLiquidityToken1?.tokenAddress,
        CurrentAddLiquidityToken2?.tokenAddress,
        CurrentAddLiquidityToken1?.contractAddress
      );

      let LPTokenBalance1: any = await Contracts.example.balanceOf(
        lpAddress as string,
        CurrentFromToken?.tokenAddress
      );
      let LPTokenBalance2: any = await Contracts.example.balanceOf(
        lpAddress as string,
        CurrentToToken?.tokenAddress
      );
      let SwapOutAmount: any = await Contracts.example?.getAmountsOut(
        web3ModalAccount as string,
        InputAmount,
        [CurrentFromToken?.tokenAddress, CurrentToToken?.tokenAddress],
        CurrentFromToken?.Router
      );
      // debugger;

      // 价格影响= |兑换之后的价格 - 兑换之前的价格| / 兑换之前的价格  * 100%
      let SwapPriceLate: any =
        (Number(EthertoWei(LPTokenBalance1 ?? "0")) + Number(InputAmount)) /
        (Number(EthertoWei(LPTokenBalance2 ?? "0")) -
          Number(EthertoWei(SwapOutAmount[1] ?? "0")));
      let SwapPriceBefore: any =
        Number(EthertoWei(LPTokenBalance1 ?? "0")) /
        Number(EthertoWei(LPTokenBalance2 ?? "0"));
      let priceImpact: any =
        (Math.abs(
          Number(getFullNum(SwapPriceLate ?? 0)) -
            Number(getFullNum(SwapPriceBefore ?? 0))
        ) /
          Number(getFullNum(SwapPriceBefore ?? 0))) *
        100;
      // debugger;
      console.log();
      setPriceImpact(priceImpact ?? "0");
    } catch (e: any) {
      setPriceImpact("0");
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

    let LPbalance = await Contracts.example.balanceOf(
      web3ModalAccount as string,
      lpAddress
    );
    let lpAllAmount: any = await Contracts.example?.totalsupply(
      web3ModalAccount as string,
      contractAddress.LPToken
    );
    let LiquidityTokenBalance1: any = await Contracts.example.balanceOf(
      lpAddress as string,
      CurrentAddLiquidityToken1?.tokenAddress
    );
    let LiquidityTokenBalance2: any = await Contracts.example.balanceOf(
      lpAddress as string,
      CurrentAddLiquidityToken2?.tokenAddress
    );
    setAddLiquidityTokenBalance1(
      (LPbalance / lpAllAmount) *
        Number(EthertoWei(LiquidityTokenBalance1 ?? "0")) +
        ""
    );
    setAddLiquidityTokenBalance2(
      (LPbalance / lpAllAmount) *
        Number(EthertoWei(LiquidityTokenBalance2 ?? "0")) +
        ""
    );
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
    // 计算价格影响
    getPriceImpact();
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
    if (!web3ModalAccount) return;
    new Contracts(walletProvider);

    getCoinList();
  }, [
    TabActive,
    web3ModalAccount,
    SelectTokensModalState,
    SelectTokensAddLiquidityModalState,
  ]);

  useEffect(() => {
    getWebsocketData();
    return () => {
      clearInterval(timer);
    };
  }, [token]);
  useEffect(() => {
    if (!!web3ModalAccount && String(PercentValue) !== "0%") {
      getRemoveLiquidityInfo();
    } else {
    }
  }, [web3ModalAccount, token, PercentValue]);
  useEffect(() => {
    if (chainId) {
      // console.log(chainId, "chainId");
      setFromToken(
        tokenList?.filter((item: any) => item?.chainId === chainId)[0]?.name ||
          "PIJS"
      );
      setToToken(
        tokenList?.filter((item: any) => item?.chainId === chainId)[1]?.name ||
          "USDT"
      );
      setAddLiquidityToken1(
        tokenList?.filter((item: any) => item?.chainId === chainId)[0]?.name ||
          "PIJS"
      );
      setAddLiquidityToken2(
        tokenList?.filter((item: any) => item?.chainId === chainId)[1]?.name ||
          "USDT"
      );
      // debugger;
    }
  }, [chainId]);

  // console.log(FromToken, AddLiquidityToken1);
  // AddLiquidityTokenAmount1:添加流动性 InputAmount:swap
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
    if (!InputAmount || Number(InputAmount) <= 0)
      return <Btn isActive={false}>{t("Please enter amount")}</Btn>;

    if (
      Number(InputAmount) >
      Number(
        CoinListObj?.filter((item: any) => item?.chainId === chainId)?.find(
          (item: any) => String(item?.name) === String(FromToken)
        )?.balance
      )
    )
      return (
        <Btn isActive={false}>
          {t("Insufficient {{name}} balance", { name: FromToken })}
        </Btn>
      );
    return (
      <Btn
        isActive={true}
        onClick={() => {
          SwapFun();
        }}
      >
        {String(FromToken) === "UAC"
          ? t("交易")
          : Number(TOKENAllowance) >= Number(InputAmount)
          ? t("交易")
          : t("授权")}
      </Btn>
    );
  };
  // AddLiquidityTokenAmount1:添加流动性 InputAmount:swap
  const AddLiquidityBtnBox = () => {
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
    if (
      !AddLiquidityTokenAmount1 ||
      !AddLiquidityTokenAmount2 ||
      Number(AddLiquidityTokenAmount1) <= 0 ||
      Number(AddLiquidityTokenAmount2) <= 0
    )
      return <Btn isActive={false}>{t("Please enter amount")}</Btn>;

    if (
      Number(AddLiquidityTokenAmount1) >
      Number(
        CoinListObj?.filter((item: any) => item?.chainId === chainId)?.find(
          (item: any) => String(item?.name) === String(AddLiquidityToken1)
        )?.balance
      )
    )
      return (
        <Btn isActive={false}>
          {t("Insufficient {{name}} balance", { name: AddLiquidityToken1 })}
        </Btn>
      );
    if (
      Number(AddLiquidityTokenAmount2) >
      Number(
        CoinListObj?.filter((item: any) => item?.chainId === chainId)?.find(
          (item: any) => String(item?.name) === String(AddLiquidityToken2)
        )?.balance
      )
    )
      return (
        <Btn isActive={false}>
          {t("Insufficient {{name}} balance", { name: AddLiquidityToken2 })}
        </Btn>
      );
    // 链原生添加流动性只需授权一次
    if (chainId === curentUNIChainId) {
      return (
        <Btn
          isActive={true}
          onClick={() => {
            AddLiquidityFun();
          }}
        >
          {Number(TOKENAllowance) >=
          Number(
            String(AddLiquidityToken1) === "USDT"
              ? AddLiquidityTokenAmount1
              : AddLiquidityTokenAmount2
          )
            ? t("添加")
            : t("授权")}
        </Btn>
      );
    } else {
      // 双ERC20代币
      if (
        Number(AddLiquidityTokenAmount1) >
        Number(CurrentAddLiquidity1TOKENAllowance)
      ) {
        return (
          <Btn
            isActive={true}
            onClick={() => {
              // handleApprove(price, transactionCallBack, onDoingFun, failFun)
              CurrentAddLiquidity1handleApprove(
                AddLiquidityTokenAmount1 + "",
                async (call: any) => {
                  // 授权完token1查询token2的额度
                  CurrentAddLiquidity1handleUSDTRefresh();
                  CurrentAddLiquidity2handleUSDTRefresh();
                  call();
                  setShowTipModal(false);
                  return addMessage(AddLiquidityToken1 + " " + t("授权成功"));
                },
                () => {
                  setTip(
                    t("Approve 100.0000 USDT", {
                      num: NumSplic1(AddLiquidityTokenAmount1),
                      coin: AddLiquidityToken1,
                    })
                  );
                  setShowTipModal(true);
                },
                () => {
                  setShowTipModal(false);
                }
              );
            }}
          >
            {t("授权")} {AddLiquidityToken1}
          </Btn>
        );
      }
      if (
        Number(AddLiquidityTokenAmount2) >
        Number(CurrentAddLiquidity2TOKENAllowance)
      ) {
        return (
          <Btn
            isActive={true}
            onClick={() => {
              // handleApprove(price, transactionCallBack, onDoingFun, failFun)
              CurrentAddLiquidity2handleApprove(
                AddLiquidityTokenAmount2 + "",
                async (call: any) => {
                  // 授权完token1查询token2的额度
                  CurrentAddLiquidity1handleUSDTRefresh();
                  CurrentAddLiquidity2handleUSDTRefresh();
                  call();
                  setShowTipModal(false);
                  return addMessage(AddLiquidityToken2 + " " + t("授权成功"));

                  // debugger;
                },
                () => {
                  setTip(
                    t("Approve 100.0000 USDT", {
                      num: NumSplic1(AddLiquidityTokenAmount2),
                      coin: AddLiquidityToken2,
                    })
                  );
                  setShowTipModal(true);
                },
                () => {
                  setShowTipModal(false);
                }
              );
            }}
          >
            {t("授权")} {AddLiquidityToken2}
          </Btn>
        );
      }

      return (
        <Btn
          isActive={true}
          onClick={() => {
            AddLiquidityFun1();
          }}
        >
          {t("添加")}
        </Btn>
      );
    }
  };
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
    if (String(PercentValue) === "0%")
      return <Btn isActive={false}>{t("Enter withdrawal percentage")}</Btn>;

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

  useEffect(() => {
    if (stateObj?.tab) {
      // 清除 location.state
      Navigate(window.location.pathname, { replace: true, state: null });
    }
  }, [stateObj?.tab, Navigate]);

  return (
    <>
      <HomeContainerBox src={width >= 1400 ? MainBg : mainBgMobile}>
        <div>
          <SwapBanner>
            <img src={swapBanner} alt="" />
          </SwapBanner>
          <SwapContainer_Tabs>
            <div
              className={String(TabActive) === "Trade" ? "active" : ""}
              onClick={() => {
                setTabActive("Trade");
              }}
            >
              {t("交易")}
            </div>
            <div
              className={String(TabActive) === "TWAP" ? "active" : ""}
              onClick={() => {
                // return addMessage(t("Coming soon"));
                setTabActive("TWAP");
              }}
            >
              Price
            </div>
            <div
              className={String(TabActive) === "Liquidity" ? "active" : ""}
              onClick={() => {
                setTabActive("Liquidity");
              }}
            >
              {t("流动性")}
            </div>
          </SwapContainer_Tabs>
          {String(TabActive) === "Trade" && (
            <SwapContainer>
              <SwapContainer_Title>PIJSwap</SwapContainer_Title>
              <SwapItem>
                <SwapItem_Title>
                  {t("发送")}{" "}
                  <div>
                    {t("余额")}:{" "}
                    {NumSplic1(
                      CoinListObj?.filter(
                        (item: any) => item?.chainId === chainId
                      )?.find(
                        (item: any) => String(item?.name) === String(FromToken)
                      )?.balance,
                      4
                    ) || 0}
                  </div>
                </SwapItem_Title>

                <Item>
                  <Item_Left
                    onClick={() => {
                      setCurrentSelectedState("from");
                      setSelectTokensModalState(true);
                    }}
                  >
                    <img src={CurrentFromToken?.icon} alt="" />
                    <div className="coin_info">
                      {/* <div className="chain">BSC Chain</div> */}
                      <div className="coin">{FromToken}</div>
                    </div>
                    <img src={dropIcon} alt="" />
                  </Item_Left>
                  <Devider></Devider>
                  <Item_Right>
                    <input
                      type="text"
                      value={InputAmount}
                      onChange={InputFun}
                    />
                  </Item_Right>
                </Item>
              </SwapItem>
              <SwapToIcon>
                <img
                  src={toSwaps}
                  alt=""
                  onClick={() => {
                    setFromToken(ToToken);
                    setToToken(FromToken);
                  }}
                />
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
                      setCurrentSelectedState("to");
                      setSelectTokensModalState(true);
                    }}
                  >
                    <img src={CurrentToToken?.icon} alt="" />
                    <div className="coin_info">
                      {/* <div className="chain">UniAgent Chain</div> */}
                      <div className="coin">{ToToken}</div>
                    </div>
                    <img src={dropIcon} alt="" />
                  </Item_Left>
                  <Devider></Devider>
                  <Item_Right>
                    <input
                      type="text"
                      value={
                        Number(ReceiveAmount) > 0
                          ? NumSplic1(ReceiveAmount, 4)
                          : "-"
                      }
                      readOnly={true}
                    />
                  </Item_Right>
                </Item>
              </SwapItem>

              {BtnBox()}

              <SwapInfo>
                <div>
                  {t("参考价格")}{" "}
                  <span>
                    1 {FromToken} = {NumSplic1(OneUACToUSDT, 4)} {ToToken}
                  </span>
                </div>
                <div>
                  {t("价格影响")} <span>{NumSplic1(PriceImpact, 4)}%</span>
                </div>
                <div>
                  {t("滑点限制")}{" "}
                  <span>
                    {SlippageValue ?? "-"}%{" "}
                    <img
                      src={setIcon}
                      alt=""
                      onClick={() => {
                        setSettingSlippage(true);
                      }}
                    />
                  </span>
                </div>

                <div>
                  {t("最低接收数量")}{" "}
                  <span>
                    {NumSplic1(
                      Number(ReceiveAmount) * (1 - Number(SlippageValue) / 100),
                      4
                    )}{" "}
                    {ToToken}
                  </span>
                </div>
                <div>
                  {t("交换路径")}
                  <span>PIJSwap</span>
                </div>
              </SwapInfo>
            </SwapContainer>
          )}
          {String(TabActive) === "TWAP" && (
            <>
              <PriceChart
                FromCoinName={FromToken}
                ToCoinName={ToToken}
              ></PriceChart>
              <SwapContainer>
                <SwapContainer_Title>PIJSwap</SwapContainer_Title>
                <SwapItem>
                  <SwapItem_Title>
                    {t("发送")}{" "}
                    <div>
                      {t("余额")}:{" "}
                      {NumSplic1(
                        CoinListObj?.filter(
                          (item: any) => item?.chainId === chainId
                        )?.find(
                          (item: any) =>
                            String(item?.name) === String(FromToken)
                        )?.balance,
                        4
                      ) || 0}
                    </div>
                  </SwapItem_Title>

                  <Item>
                    <Item_Left
                      onClick={() => {
                        setCurrentSelectedState("from");
                        setSelectTokensModalState(true);
                      }}
                    >
                      <img src={CurrentFromToken?.icon} alt="" />
                      <div className="coin_info">
                        {/* <div className="chain">BSC Chain</div> */}
                        <div className="coin">{FromToken}</div>
                      </div>
                      <img src={dropIcon} alt="" />
                    </Item_Left>
                    <Devider></Devider>
                    <Item_Right>
                      <input
                        type="text"
                        value={InputAmount}
                        onChange={InputFun}
                      />
                    </Item_Right>
                  </Item>
                </SwapItem>
                <SwapToIcon>
                  <img
                    src={toSwaps}
                    alt=""
                    onClick={() => {
                      setFromToken(ToToken);
                      setToToken(FromToken);
                    }}
                  />
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
                        setCurrentSelectedState("to");
                        setSelectTokensModalState(true);
                      }}
                    >
                      <img src={CurrentToToken?.icon} alt="" />
                      <div className="coin_info">
                        {/* <div className="chain">UniAgent Chain</div> */}
                        <div className="coin">{ToToken}</div>
                      </div>
                      <img src={dropIcon} alt="" />
                    </Item_Left>
                    <Devider></Devider>
                    <Item_Right>
                      <input
                        type="text"
                        value={
                          Number(ReceiveAmount) > 0
                            ? NumSplic1(ReceiveAmount, 4)
                            : "-"
                        }
                        readOnly={true}
                      />
                    </Item_Right>
                  </Item>
                </SwapItem>

                {BtnBox()}

                <SwapInfo>
                  <div>
                    {t("参考价格")}{" "}
                    <span>
                      1 {FromToken} = {NumSplic1(OneUACToUSDT, 4)} {ToToken}
                    </span>
                  </div>
                  <div>
                    {t("价格影响")} <span>{NumSplic1(PriceImpact, 4)}%</span>
                  </div>
                  <div>
                    {t("滑点限制")}{" "}
                    <span>
                      {SlippageValue ?? "-"}%{" "}
                      <img
                        src={setIcon}
                        alt=""
                        onClick={() => {
                          setSettingSlippage(true);
                        }}
                      />
                    </span>
                  </div>

                  <div>
                    {t("最低接收数量")}{" "}
                    <span>
                      {NumSplic1(
                        Number(ReceiveAmount) *
                          (1 - Number(SlippageValue) / 100),
                        4
                      )}{" "}
                      {ToToken}
                    </span>
                  </div>
                  <div>
                    {t("交换路径")}
                    <span>PIJSwap</span>
                  </div>
                </SwapInfo>
              </SwapContainer>
            </>
          )}
          {String(TabActive) === "Liquidity" &&
            (Number(LiquidityType) === 1 ? (
              <SwapContainer>
                <SwapContainer_Title
                  onClick={() => {
                    setLiquidityType(2);
                  }}
                >
                  {" "}
                  <img src={toIcon} alt="" />{" "}
                  {t("Remove UACUSDT Liquidity", {
                    coin1: AddLiquidityToken1,
                    coin2: AddLiquidityToken2,
                  })}
                </SwapContainer_Title>

                <SwapItem_Title>
                  {t("Enter Withdrawal Percentage")}
                </SwapItem_Title>
                <SwapItem>
                  <LiquidityItem>
                    <input type="text" value={PercentValue} readOnly={true} />
                    <PercentageBox>
                      <div
                        onClick={() => {
                          setPercentValue("25%");
                        }}
                      >
                        25%
                      </div>
                      <div
                        onClick={() => {
                          setPercentValue("50%");
                        }}
                      >
                        50%
                      </div>
                      <div
                        onClick={() => {
                          setPercentValue("75%");
                        }}
                      >
                        75%
                      </div>
                      <div
                        onClick={() => {
                          setPercentValue("100%");
                        }}
                      >
                        100%
                      </div>
                    </PercentageBox>
                  </LiquidityItem>
                </SwapItem>
                <SwapItemBottom>
                  <SwapItem_Title_Item>
                    <div>{t("Received Amount")}</div>
                  </SwapItem_Title_Item>
                  <ReceivedBox>
                    <ReceivedBox_Item>
                      <div>
                        <img src={CurrentAddLiquidityToken1?.icon} alt="" />
                        {AddLiquidityToken1}
                      </div>
                      <div>
                        {NumSplic1(
                          (Number(AddLiquidityTokenBalance1) *
                            parseFloat(
                              String(PercentValue)?.replace("%", "")
                            )) /
                            100,
                          4
                        )}{" "}
                      </div>
                    </ReceivedBox_Item>
                    <ReceivedBox_Item>
                      <div>
                        <img src={CurrentAddLiquidityToken2?.icon} alt="" />
                        {AddLiquidityToken2}
                      </div>
                      <div>
                        {NumSplic1(
                          (Number(AddLiquidityTokenBalance2) *
                            parseFloat(
                              String(PercentValue)?.replace("%", "")
                            )) /
                            100,
                          4
                        )}
                      </div>
                    </ReceivedBox_Item>
                  </ReceivedBox>
                </SwapItemBottom>
                <LiquidityPrice>
                  {t("Reference Price")} 1 {FromToken} ={" "}
                  {NumSplic1(OneUACToUSDT, 4)} {ToToken}
                </LiquidityPrice>

                {RemoveLiquidityBtn()}
              </SwapContainer>
            ) : (
              <SwapContainer>
                <SwapContainer_Title>
                  {" "}
                  {/* <img src={toIcon} alt="" />  */}
                  {t("Add V2 Liquidity")}
                </SwapContainer_Title>

                <SelectTokenPair>
                  <SwapItem_Title>{t("Select Token Pair")}</SwapItem_Title>
                  <Tokens>
                    <Token
                      onClick={() => {
                        setAddLiquidityTokenType(1);
                        setSelectTokensAddLiquidityModalState(true);
                      }}
                    >
                      <img src={CurrentAddLiquidityToken1?.icon} alt="" />
                      <div>{AddLiquidityToken1}</div>
                      <img src={dropdownIcon} alt="" />
                    </Token>
                    <img src={addIcon} alt="" />
                    <Token
                      onClick={() => {
                        setAddLiquidityTokenType(2);
                        setSelectTokensAddLiquidityModalState(true);
                      }}
                    >
                      <img src={CurrentAddLiquidityToken2?.icon} alt="" />
                      <div>{AddLiquidityToken2}</div>
                      <img src={dropdownIcon} alt="" />
                    </Token>
                  </Tokens>
                </SelectTokenPair>
                <SwapItem_Title>{t("Enter Amount")}</SwapItem_Title>

                <SwapItem>
                  <SwapItem_Title_Item>
                    <div>
                      <img src={CurrentAddLiquidityToken1?.icon} alt="" />
                      <div>{AddLiquidityToken1}</div>

                      <img src={copyIcon} alt="" />
                    </div>
                    <div>
                      {t("Balance")}:{" "}
                      {NumSplic1(
                        CoinListObj?.filter(
                          (item: any) => item?.chainId === chainId
                        )?.find(
                          (item: any) =>
                            String(item?.name) === String(AddLiquidityToken1)
                        )?.balance,
                        4
                      ) || 0}
                    </div>
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
                      <input
                        type="text"
                        value={AddLiquidityTokenAmount1}
                        onChange={(e: any) => {
                          InputAddLiquidityFun(e, 1);
                        }}
                      />
                    </Item_Right>
                  </Item>
                </SwapItem>
                {/* <SwapToIcon>
            <img src={toSwaps} alt="" />
          </SwapToIcon> */}

                <SwapItemBottom>
                  <SwapItem_Title_Item>
                    <div>
                      <img src={CurrentAddLiquidityToken2?.icon} alt="" />
                      <div>{AddLiquidityToken2}</div>

                      <img src={copyIcon} alt="" />
                    </div>
                    <div>
                      {t("Balance")}:{" "}
                      {NumSplic1(
                        CoinListObj?.filter(
                          (item: any) => item?.chainId === chainId
                        )?.find(
                          (item: any) =>
                            String(item?.name) === String(AddLiquidityToken2)
                        )?.balance,
                        4
                      ) || 0}
                    </div>
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
                      <input
                        type="text"
                        value={
                          !!AddLiquidityTokenAmount2
                            ? NumSplic1(AddLiquidityTokenAmount2, 4)
                            : ""
                        }
                        onChange={(e: any) => {
                          InputAddLiquidityFun(e, 2);
                        }}
                      />
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

                {AddLiquidityBtnBox()}

                <SwapInfo>
                  <SwapInfo_Title>{t("Your Position")}</SwapInfo_Title>
                  {Number(NumSplic1(LPBalance, 4)) > 0 ? (
                    <SwapInfo_Content>
                      <SwapInfo_Item>
                        <SwapInfo_Item_Left>
                          <div>
                            <img src={CurrentAddLiquidityToken1?.icon} alt="" />
                            <img src={CurrentAddLiquidityToken2?.icon} alt="" />
                            {AddLiquidityToken1}-{AddLiquidityToken2} V2 LP
                          </div>
                          {NumSplic1(LPBalance, 4)}LP
                        </SwapInfo_Item_Left>
                        <SwapInfo_Item_Right>
                          <Remove_Btn
                            onClick={() => {
                              setLiquidityType(true);
                            }}
                          >
                            {t("Remove")}
                          </Remove_Btn>
                        </SwapInfo_Item_Right>
                      </SwapInfo_Item>
                    </SwapInfo_Content>
                  ) : (
                    <SwapInfo_Content>
                      <NoData>
                        <img src={nodata} alt="" />
                        {t("No current positions")}
                      </NoData>
                    </SwapInfo_Content>
                  )}
                </SwapInfo>
              </SwapContainer>
            ))}

          <AllModal
            visible={SettingSlippage}
            className="Modal"
            centered
            width={"483px"}
            closable={false}
            footer={null}
          >
            <ModalContainer>
              <ModalContainer_Title>
                {t("Setting Slippage")}
                <ModalContainer_Close>
                  {" "}
                  <img
                    src={closeIcon}
                    alt=""
                    onClick={() => {
                      setSlippageValue("5");
                      setSettingSlippage(false);
                    }}
                  />
                </ModalContainer_Close>
              </ModalContainer_Title>
              <ModalContainer_Content>
                <ModalContainer_Content_Tip>
                  {t("Set max slippage (default 5%)")}
                </ModalContainer_Content_Tip>
                <ModalContainer_Content_Input>
                  <input
                    type="text"
                    value={SlippageValue}
                    onChange={(e: any) => {
                      setSlippageValue(e.target.value.replace(/[^0-9.]/g, ""));
                    }}
                  />
                  %
                </ModalContainer_Content_Input>
                <Confirm_Btn
                  onClick={() => {
                    if (Number(SlippageValue) > 0) {
                      setSettingSlippage(false);
                    } else {
                      return addMessage(t("Please set the slippage correctly"));
                    }
                  }}
                >
                  {t("Confirm")}
                </Confirm_Btn>
              </ModalContainer_Content>
            </ModalContainer>
          </AllModal>

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

          {/* Select Send Tokens */}
          <SelectTokensModal
            ShowTipModal={SelectTokensModalState}
            Tip={Tip}
            tokenList={CoinListObj}
            close={() => {
              setSelectTokensModalState(false);
            }}
            allTipFun={allTipFun}
            SelectTokenFun={SelectTokenFun}
          />
          {/* Add Liquidity */}
          <SelectTokensModal
            ShowTipModal={SelectTokensAddLiquidityModalState}
            Tip={Tip}
            tokenList={CoinListObj}
            close={() => {
              setSelectTokensAddLiquidityModalState(false);
            }}
            allTipFun={allTipFun}
            SelectTokenFun={SelectAddLiquidityTokenFun}
          />
        </div>

        {width >= 1400 && <Footer></Footer>}
      </HomeContainerBox>
      {!(width >= 1400) && <Footer></Footer>}
    </>
  );
}
