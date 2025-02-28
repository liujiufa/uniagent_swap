import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "antd";
import type { MenuProps } from "antd";
import {
  AddrHandle,
  addMessage,
  GetQueryString,
  showLoding,
  NumSplic,
  getFullNum,
  startWord,
} from "../utils/tool";
import {
  Login,
  checkInviteCode,
  getUserInfo,
  isNewUser,
  isRefereeAddress,
  signBindReferee,
} from "../API/index";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import { stateType } from "../store/reducer";
import { Contracts } from "../web3";
import { createLoginSuccessAction, savePriceAction } from "../store/actions";
import BigNumber from "big.js";
import copy from "copy-to-clipboard";
import demo from "../assets/image/demo.svg";
import menu_fill from "../assets/image/layout/menu_fill.svg";
import menu_close from "../assets/image/layout/menu_close.svg";
import walletIcon from "../assets/image/layout/walletIcon.svg";
import hotIcon from "../assets/image/layout/hotIcon.png";
import NodeMenuBg from "../assets/image/layout/NodeMenuBg.png";

import "../assets/style/layout.scss";
import { Menu, Dropdown, Modal } from "antd";
import {
  contractAddress,
  curentBSCChainId,
  curentUNIChainId,
  customNetwork_BSC,
  customNetwork_BSC_TEST,
  customNetwork_UNI,
  customNetwork_UNI_TEST,
  GoTo,
  isMain,
  LOCAL_KEY,
  loginNetworkId,
  NETWORK_PARAMS,
} from "../config";
import { useViewport } from "../components/viewportContext";
import Web3 from "web3";
import styled from "styled-components";
import { FlexBox, FlexCCBox, FlexSBCBox } from "../components/FlexBox";
import CodeInputBox from "../components/CodeInputBox";
import { useSign } from "../hooks/useSign";
import { useNoGas } from "../hooks/useNoGas";
import useTipLoding from "../components/ModalContent";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
  useDisconnect,
} from "@reown/appkit/react";
import newLogo from "../assets/image/layout/logo.png";
import c_img1 from "../assets/image/layout/c_img1.png";
import c_img2 from "../assets/image/layout/c_img2.png";
import c_img3 from "../assets/image/layout/c_img3.png";
import wallet_img1 from "../assets/image/layout/wallet_img1.png";
import wallet_img2 from "../assets/image/layout/wallet_img2.png";
import wallet_img3 from "../assets/image/layout/wallet_img3.png";
import chain_img1 from "../assets/image/layout/chain_img1.png";
import chain_img2 from "../assets/image/layout/chain_img2.png";
import chain_img3 from "../assets/image/layout/chain_img3.png";
import chain_img4 from "../assets/image/layout/chain_img4.png";
import chain_img5 from "../assets/image/layout/chain_img5.png";
import chain_img6 from "../assets/image/layout/chain_img6.png";
import dropDownIcon from "../assets/image/layout/dropDownIcon.png";
import dropDownIcon1 from "../assets/image/layout/dropDownIcon1.png";
import mobileMenuBg from "../assets/image/layout/mobileMenuBg.png";
import languageIcon from "../assets/image/layout/languageIcon.svg";
import dropdown from "../assets/image/layout/dropdown.svg";
import ReferListModal from "../components/ReferListModal";
import closeIcon from "../assets/image/closeIcon.svg";

const { Header, Content } = Layout;

let refereeUserAddress: any;

const LogoContainer = styled(FlexCCBox)`
  width: fit-content;
  font-family: "PingFang SC";
  font-size: 18px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;

  > img {
    height: 33px;
    margin-right: 36px;
  }
  @media (max-width: 1600px) {
    > img {
      margin-right: 24px;
    }
  }
  @media (max-width: 1400px) {
    > img {
      width: 100%;
      width: 99px;
      height: 26px;
      margin-right: 0px;
      /* margin-top: 1px; */
    }
  }
`;

const HeaderContainer = styled(Header)`
  margin: 0px auto;
  backdrop-filter: blur(10px);
  padding: 0;
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  background: linear-gradient(90deg, #323436 3%, #181c21 97%);
  .HeaderNav {
    max-width: 1920px;
    padding: 0px 40px;
  }
  @media (max-width: 1400px) {
    background: transparent;
    .HeaderNav {
      padding: 0px 15px;
    }
  }
`;

const SetBox = styled.div`
  display: flex;
  align-items: center;
  height: fit-content;
  line-height: normal;
  .priceBox {
    font-family: "DIN";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    color: #4baf73;
    display: flex;
    align-items: center;
    margin-right: 20px;
  }

  .activeConnect {
    display: flex;
    justify-content: center;
    align-items: center;
    > img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .walletInfo {
      font-family: "Space Grotesk";
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
      > div {
        font-family: "Space Grotesk";
        font-size: 12px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #999999;
      }
    }
  }
  .langDrowDrop {
    height: fit-content;
  }
  .dropdownBox {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    height: fit-content;
    padding: 6px 18px;
    border-radius: 16px;
    opacity: 1;
    background: #383e45;
    font-family: MiSans;
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #c5ccd4;
    > img {
      width: 12px;
      height: 12px;
      margin-left: 8px;
    }
    .chainIcon {
      width: 26px;
      height: 26px;
      margin: 0px 8px 0px 0px;
    }
  }
  .chainDropdownBox {
    padding: 3px 12px 3px 3px;
  }
  .Connect {
    display: flex;
    align-items: center;
    border-radius: 124px;
    opacity: 1;
    background: #f4c134;
    font-family: MiSans;
    font-size: 14px;
    font-weight: 500;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #181a20;
    padding: 4px 12px;
    > img {
      margin-right: 8px;
    }
    .dropDownIcon1 {
      width: 16px;
      height: 16px;
      margin-left: 8px;
    }
  }
  .LangDropDown {
    .ant-dropdown-menu {
      padding: 15px;
      border-radius: 12px;
      opacity: 1;
      background: #191e22;
      .ant-dropdown-menu-item {
        padding: 0;
        .LangItem {
          cursor: pointer;
          margin-bottom: 20px;
        }
        /* 语言切换下拉 */
        .ReallyLangItem {
          margin-bottom: 10px;
        }
        &:last-child {
          .LangItem {
            margin-bottom: 0px;
          }
        }
        .LangItem {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-family: MiSans;
          font-size: 14px;
          font-weight: 500;
          line-height: normal;
          letter-spacing: 0em;
          font-variation-settings: "opsz" auto;
          color: #c5ccd4;
          img {
            width: 26px;
            height: 26px;
            margin-right: 8px;
          }
        }
        > span {
          font-family: "Space Grotesk";
          font-size: 16px;
          font-weight: bold;
          line-height: normal;
          letter-spacing: 0em;
          font-variation-settings: "opsz" auto;
          color: #ffffff;
          .img {
          }
          .activeImg {
            display: none;
          }
        }
        &:hover {
          /* border-radius: 4px;
          opacity: 1;
          background: rgba(147, 230, 63, 0.2); */
          /* > span {
            .img {
              display: none;
            }
            .activeImg {
              display: block;
            }
          } */
        }
      }
    }
  }
  .ChainDropDown {
    .ant-dropdown-menu {
      padding: 0px;
      border-radius: 12px;
      opacity: 1;
      background: #191e22;
      .ant-dropdown-menu-item {
        padding: 0px;
        .LangItem {
          cursor: pointer;
          padding: 0 15px;
        }
        &:last-child {
          .LangItem {
            padding-bottom: 20px;
          }
        }
      }
    }
  }

  > div {
    margin-left: 12px;
  }
  @media (max-width: 1400px) {
    > div {
      margin-left: 6px;
    }
    > img {
      margin-left: 6px;
    }
    .LangDropDown {
      .ant-dropdown-menu {
        .ant-dropdown-menu-item {
          .LangItem {
            cursor: pointer;
            img {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }

    .Connect {
      padding: 4px 10px;
      width: fit-content;
      img {
        margin-right: 6px;
      }
      .dropDownIcon1 {
        width: 12px;
        height: 12px;
        margin: 0px 0px 0px 6px;
      }
    }
    .chainDropdownBox {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      .chainIcon {
        margin-right: 0;
      }
    }
  }
`;

const MyLayout = styled(Layout)`
  position: relative;
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
  align-items: flex-start;
  font-family: "Space Grotesk";
  font-size: 24px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  @media (max-width: 1200px) {
    font-size: 18px;
  }
`;

const MobileSlider = styled.div<{ src: string }>`
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: cover; //根据你图片的大小自定义
  background-repeat: no-repeat;
  position: fixed;
  top: 0px;

  width: 100%;
  opacity: 1;
  border-top: 1px solid #232323;
  opacity: 1;

  box-shadow: 0px 4px 10px 0px rgb(255, 139, 54, 0.5);
  z-index: 999;
  overflow: auto;
`;
const MobileSlider_Menu = styled.div`
  padding: 82px 15px 18px;
  height: 100vh;
  .menu {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: MiSans;
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #c5ccd4;
  }
  > div {
    padding: 15px 0px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-right: 0;
    white-space: nowrap;
    opacity: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    &:last-child {
      margin-right: 0;
      border-bottom: none;
    }
    &:first-child {
      padding-top: 0px;
    }
  }
  .active {
    color: #f4c134;
  }

  .communityMenus {
    display: block !important;
    .nav {
      padding-left: 24px;
      > div {
        > div {
          font-family: MiSans;
          font-size: 16px;
          font-weight: normal;
          line-height: normal;
          letter-spacing: 0em;
          font-variation-settings: "opsz" auto;
          color: #c5ccd4;
          margin: 30px 0px;
          &:last-child {
          }
        }
      }
    }
  }
`;

const NavContainer = styled(FlexBox)`
  justify-content: flex-start;
  flex: 1;
  /* padding: 0px 35.5px ; */
  .menu {
    font-family: MiSans;
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #c5ccd4;
  }
  > div {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-right: 36px;
    white-space: nowrap;
    &:last-child {
      margin-right: 0;
    }
  }
  .active {
    color: #f4c134;
  }
  @media (max-width: 1600px) {
    > div {
      margin-right: 24px;
    }
  }
`;
const NodePartner = styled(FlexCCBox)<{ src: string }>`
  padding: 8px 16px 8px 10px !important;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%; //根据你图片的大小自定义
  background-repeat: no-repeat;
  font-family: MiSans;
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #f4c134;

  > img {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
  @media (max-width: 1400px) {
    /* background-size: contain; */
    height: fit-content;
    width: fit-content;
  }
`;
const SelectMenu = styled(FlexBox)`
  min-width: 200px;
  padding: 12px 15px;
  font-family: MiSans;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #8b9096;
  border-bottom: 1px solid #272d32;
  margin-bottom: 14px;
  @media (max-width: 1400px) {
    min-width: fit-content;
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
      padding: 39px;
    }
  }
  @media (max-width: 1200px) {
    .ant-modal-content {
      .ant-modal-body {
        padding: 24px 15px;
      }
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
  top: 25px;
  right: 15px;
  z-index: 100;
`;

const ModalContainer_Content = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputBox = styled(FlexSBCBox)`
  width: 100%;
  margin: 24px auto 34px;
  .inputContainer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > input {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      border-radius: 4px;
      border-radius: 4px;
      opacity: 1;
      background: #181818;
      box-sizing: border-box;
      border: 1px solid #232323;
      font-family: "Space Grotesk";
      font-size: 30px;
      font-weight: normal;
      line-height: normal;
      text-align: center;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
      margin: 0;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
    input:focus {
      appearance: none;
      outline: 0;
      box-shadow: 0 0 0 3px rgb(131 192 253 / 50%);
    }
  }
  @media (max-width: 1200px) {
    > input {
      font-size: 24px;
    }
  }
`;

const Btn = styled(FlexCCBox)`
  width: fit-content;
  opacity: 1;
  padding: 12px 32px;
  border-radius: 8px;
  opacity: 1;
  background: #f4c134;
  cursor: pointer;
  font-family: "Space Grotesk";
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #0a0a0a;
  @media (max-width: 1200px) {
    font-size: 16px;
  }
`;

const ConfirmBtn = styled(FlexCCBox)`
  width: 100%;
  > div {
    width: 100%;
  }
`;

const MobileSlider_Title = styled.div`
  height: 64px;
  position: fixed;
  top: 0;
  width: 100%;
  .LogoContainer_Mobile {
    margin-bottom: 2px;
  }
`;
export let communityObj = [
  {
    value: "Telegram",
    key: "c_item1",
    img: c_img1,
    link: "https://t.me/pijswap",
  },
  {
    value: "Twitter",
    key: "c_item2",
    img: c_img2,
    link: "https://x.com/PIJSwap_Labs",
  },
  {
    value: "Medium",
    key: "c_item3",
    img: c_img3,
    link: "https://medium.com/@PIJSwap",
  },
];
declare let window: any;
const MainLayout: any = () => {
  const web3 = new Web3();
  const codeInputRef = useRef<any>(null);
  let dispatch = useDispatch();
  let token = useSelector<any>((state) => state.token);
  let { t, i18n } = useTranslation();
  let [ItemActive, setItemActive] = useState("/");
  const [InputValue, setInputValue] = useState<any>(null);
  const Navigate = useNavigate();
  const { width } = useViewport();
  const [CurrentChain, setCurrentChain] = useState<any>({
    value: "BNB Chain",
    chainId: isMain ? 56 : 97,
    key: "chain_item1",
    img: chain_img1,
    link: "https://www.uniagent.co/pdf/Whitepaper.pdf",
  });
  const { signFun } = useSign();
  const { isNoGasFun } = useNoGas();
  const { walletProvider } = useAppKitProvider("eip155");
  const { address: web3ModalAccount, isConnected } = useAppKitAccount();
  const { caipNetwork, caipNetworkId, chainId, switchNetwork } =
    useAppKitNetwork();
  const { open, close } = useAppKit();
  const { disconnect } = useDisconnect();
  const [BindModal, setBindModal] = useState(false);
  const location = useLocation();
  const pathname = startWord(location.pathname);
  const queryParams = new URLSearchParams(location.search);
  const invite = queryParams.get("inviteCode");

  const [showMask, setShowMask] = useState(false);
  const [MyInviteCodeStateModal, setMyInviteCodeStateModal] = useState(false);
  const [OpenList, setOpenList] = useState<any>([]);
  const [UserInfo, setUserInfo] = useState<any>({});
  const [NewUserState, setNewUserState] = useState(false);

  function changeLanguage(lang: any) {
    window.localStorage.setItem(LOCAL_KEY, lang.key);
    i18n.changeLanguage(lang.key);
  }
  const openFun = (type: any) => {
    let Arr: any = OpenList;
    if (Arr?.some((item: any) => Number(item) === Number(type))) {
      Arr = Arr?.filter((item: any) => Number(item) !== Number(type));
    } else {
      Arr = [...Arr, type];
    }

    setOpenList(Arr);
    console.log(Arr, "Arr");
  };
  // const initalToken =
  //   "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1ODkyIiwic3ViIjoie1widXNlckFkZHJlc3NcIjpcIjB4YjdhY2NiZjQ5ZDMyZjY4MDA0OWRiMDQ0YjhlZmIxZTJmMTgzMzVhZlwiLFwiaWRcIjo1ODkyfSIsImlzcyI6ImFkbWluIiwiaWF0IjoxNzI5NjY2MTcyLCJleHAiOjE3NjA3NzAxNzJ9.muZSze-DNH4RkqBRYQkqh-_HxLuBceKlKjiTHF85Am0";
  const initalToken = localStorage.getItem(
    (web3ModalAccount as string)?.toLowerCase()
  );

 
  let connectedObj = [
    {
      value: "绑定推荐码",
      key: "wallet_item1",
      img: wallet_img1,
    },
    {
      value: "我的邀请码",
      key: "wallet_item2",
      img: wallet_img2,
    },
    {
      value: "断开连接",
      key: "wallet_item3",
      img: wallet_img3,
    },
  ];
  let ChainObj = [
    {
      value: "BNB Chain",
      chainId: curentBSCChainId,
      key: "chain_item1",
      img: chain_img1,
      link: "https://www.uniagent.co/pdf/Whitepaper.pdf",
    },
    {
      value: "Pi Network",
      chainId: 19898,
      key: "chain_item2",
      img: chain_img2,
      link: "https://uniagent.gitbook.io/uniagent",
    },
    {
      value: "UniAgent",
      chainId: curentUNIChainId,
      key: "chain_item3",
      img: chain_img3,
      link: "https://www.uniagent.co/pdf/ProjectIntroduction.pdf",
    },
    {
      value: "Ethereum",
      chainId: 1,
      key: "chain_item4",
      img: chain_img4,
      link: "https://www.uniagent.co/pdf/DeAILightingPlan.pdf",
    },

    {
      value: "Base",
      chainId: 112123,
      key: "chain_item6",
      img: chain_img6,
      link: "",
    },
    {
      value: "Solana",
      chainId: 112,
      key: "chain_item5",
      img: chain_img5,
      link: "",
    },
  ];
  let langObj = [
    { value: "简体中文", key: "zh-CN" },
    { value: "繁体中文", key: "zh-TW" },
    { value: "English", key: "en" },
    // { value: "日本語", key: "ja" },
    // { value: "한국인", key: "kr" },
    // { value: "Nederlands", key: "lang1" },
    // { value: "Polski", key: "lang2" },
    // { value: "Português (Brazil)", key: "lang3" },
    // { value: "Italiano", key: "lang4" },
    // { value: "Bahasa Indonesia", key: "lang5" },
  ];

  const menu1 = (
    <Menu
      onClick={() => {}}
      items={communityObj.map((item: any) => {
        return {
          label: (
            <span
              className="LangItem"
              onClick={() => {
                window.open(item?.link);
              }}
            >
              <img className="img" src={item?.img} alt="" />
              <img className="activeImg" src={item?.activeImg} alt="" />{" "}
              {item.value}
            </span>
          ),
          key: item?.key,
        };
      })}
    />
  );
  const connectedMenu = (
    <Menu
      items={connectedObj.map((item: any) => {
        return {
          label: (
            <span
              className="LangItem"
              onClick={() => {
                if (item?.key === "wallet_item1") {
                  if (!UserInfo?.isBind) {
                    setBindModal(true);
                  } else {
                    return addMessage(t("当前帐号已绑定"));
                  }
                } else if (item?.key === "wallet_item2") {
                  setMyInviteCodeStateModal(true);
                } else if (item?.key === "wallet_item3") {
                  disconnect();
                  if (!!web3ModalAccount) {
                    dispatch(
                      createLoginSuccessAction(web3ModalAccount as string, "")
                    );
                  }
                }
              }}
            >
              <img className="img" src={item?.img} alt="" />
              <img className="activeImg" src={item?.activeImg} alt="" />{" "}
              {t(item.value)}
            </span>
          ),
          key: item?.key,
        };
      })}
    />
  );
  const menu2 = (
    <Menu
      onClick={() => {}}
      items={[
        {
          label: <SelectMenu>{t("选择网络")}</SelectMenu>,
          key: "title",
        },
        ...ChainObj.map((item: any) => {
          return {
            label: (
              <span
                className="LangItem"
                onClick={() => {
                  new Contracts(walletProvider);
                  if (item?.chainId === curentBSCChainId) {
                    switchNetwork(
                      isMain ? customNetwork_BSC : customNetwork_BSC_TEST
                    );
                  } else if (item?.chainId === curentUNIChainId) {
                    // debugger;
                    // window?.ethereum?.request({
                    //   method: "wallet_addEthereumChain",
                    //   params: [NETWORK_PARAMS],
                    // });

                    try {
                      // 请求添加网络
                      window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [NETWORK_PARAMS],
                      });
                    } catch (error) {
                      console.error("Error adding network:", error);
                    }
                    switchNetwork(
                      isMain ? customNetwork_UNI : customNetwork_UNI_TEST
                    );
                  } else {
                    return addMessage(t("Coming soon"));
                  }
                }}
              >
                <img className="img" src={item?.img} alt="" />
                {item.value}
              </span>
            ),
            key: item?.key,
          };
        }),
      ]}
    />
  );
  const menu3 = (
    <Menu
      onClick={changeLanguage}
      items={langObj.map((item: any) => {
        return {
          label: <span className="LangItem ReallyLangItem">{item.value}</span>,
          key: item?.key,
        };
      })}
    />
  );

  const headerIconObj: any = {
    "/": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/Swap": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/Bridge": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
  };

  // 导航
  const navigateFun = (path: string) => {
    Navigate("/View" + path);
  };

  function menuActive(path: string) {
    if (ItemActive === path) {
      return headerIconObj[path]?.menuActive;
    } else {
      return headerIconObj[path]?.menu;
    }
  }

  function iconActive(path: string) {
    if (ItemActive === path) {
      return headerIconObj[path]?.activeIcon;
    } else {
      return headerIconObj[path]?.Icon;
    }
  }

  const LoginFun = useCallback(
    async (inviteCode = "", NewUserState = false) => {
      if (web3ModalAccount) {
        // debugger;
        await signFun((res: any) => {
          Login({
            ...res,
            userAddress: web3ModalAccount as string,
            chainName: loginNetworkId.find(
              (item: any) => Number(item?.id) === Number(chainId)
            )?.name,
            inviteCode: inviteCode,
          }).then((res: any) => {
            if (res.code === 200) {
              showLoding(false);
              // debugger;
              dispatch(
                createLoginSuccessAction(
                  web3ModalAccount as string,
                  res.data.token
                )
              );

              localStorage.setItem(
                (web3ModalAccount as string)?.toLowerCase(),
                res.data.token
              );
              getInitData();
              if (!!res?.data?.isLoginReferee && !!inviteCode) {
                return addMessage(t("推荐码已绑定"));
              }
            } else {
              disconnect();
              showLoding(false);
              addMessage(res.msg);
            }
          });
        }, `userAddress=${web3ModalAccount as string}`);
      }
    },
    [web3ModalAccount, chainId]
  );

  const SelectBindFun = async (InputValue = "") => {
    if (!web3ModalAccount) return;
    new Contracts(walletProvider);
    isNewUser(web3ModalAccount as string)
      .then((res: any) => {
        if (res?.code === 200) {
          LoginFun(InputValue, !!res?.data);
          if (!!res.data) {
            // setNewUserState(true);
            if (codeInputRef.current) {
              codeInputRef.current?.setCodes(InputValue || null);
            }
          } else {
            if (codeInputRef.current) {
              codeInputRef.current?.setCodes(null);
            }
          }
        } else {
          disconnect();
        }
      })
      .catch((e: any) => {
        // debugger;
        disconnect();
      });
  };

  const toBindFun = useCallback(
    async (inviteCode = "") => {
      if (web3ModalAccount) {
        await signFun((res: any) => {
          signBindReferee({
            ...res,
            userAddress: web3ModalAccount as string,
            chainName: loginNetworkId.find(
              (item: any) => Number(item?.id) === Number(chainId)
            )?.name,
            inviteCode: inviteCode,
          }).then((res: any) => {
            if (res.code === 200) {
              showLoding(false);
              setBindModal(false);
              getInitData();
              return addMessage(t("帐号已绑定"));
            } else {
              showLoding(false);
              addMessage(res.msg);
            }
          });
        }, `userAddress=${web3ModalAccount as string}`);
      }
    },
    [web3ModalAccount, chainId]
  );

  const BindFun = useCallback(async () => {
    if (web3ModalAccount) {
      if (!InputValue) return addMessage(t("5"));
      let res: any = await checkInviteCode(InputValue);
      // debugger;
      if (!res?.data) return addMessage(t("6"));
      await toBindFun(InputValue);
    } else {
      addMessage("Please Connect wallet");
    }
  }, [web3ModalAccount, InputValue]);
  const getInitData = () => {
    getUserInfo().then((res: any) => {
      setUserInfo(res?.data || {});
    });
  };

  useEffect(() => {
    // if (String(pathname) !== "/Bridge") {
    //   switchNetwork(customNetwork_UNI);
    // }
    if (!!pathname) {
      setItemActive(pathname ?? "/");
    }
  }, [pathname, token]);

  useEffect(() => {
    new Contracts(walletProvider);
    console.log(chainId, web3ModalAccount, "chainId");
    if (!!invite && String(invite).length >= 6) {
      let str = String(invite).length > 6 ? String(invite).slice(0, 6) : invite;
      setInputValue(str);
      SelectBindFun(str);
    } else {
      SelectBindFun();
    }
  }, [web3ModalAccount, chainId, isConnected, invite]);

  useEffect(() => {
    if (!!token) {
      getInitData();
    }
  }, [token]);

  useEffect(() => {
    if (chainId) {
      // debugger;
      console.log(
        chainId,
        ChainObj?.find(
          (item: any) => Number(item?.chainId) === Number(chainId)
        ),
        ChainObj,
        "chainId"
      );
      if (
        Object.keys(
          ChainObj?.find(
            (item: any) => Number(item?.chainId) === Number(chainId)
          ) ?? {}
        ).length !== 0
      ) {
        setCurrentChain(
          ChainObj?.find(
            (item: any) => Number(item?.chainId) === Number(chainId)
          ) || {}
        );
      }
    }
  }, [web3ModalAccount, chainId]);

  return (
    <MyLayout>
      <HeaderContainer>
        <div className="HeaderNav">
          <LogoContainer>
            <img
              onClick={() => {
                setShowMask(false);
                Navigate("/View/");
              }}
              src={newLogo}
            />
          </LogoContainer>

          {width > 1400 && (
            <NavContainer>
              <div
                className={String(ItemActive) === "/" ? "active menu" : "menu"}
                onClick={() => {
                  // switchNetwork(customNetwork_UNI);
                  Navigate("/View/");
                }}
              >
                {t("交易")}
              </div>
              <NodePartner
                src={NodeMenuBg}
                onClick={() => {
                  return addMessage("Coming soon");
                  window.open(GoTo);
                }}
              >
                <img src={hotIcon} alt="" />
                {t("节点合伙人")}
              </NodePartner>
              <div
                className={
                  String(ItemActive) === "/Pool" ? "active menu" : "menu"
                }
                onClick={() => {
                  return addMessage("Coming soon");
                  // switchNetwork(customNetwork_UNI);
                  Navigate("/View/Pool");
                }}
              >
                {t("质押糖浆池")}
              </div>
              <div
                className={
                  String(ItemActive) === "/LiquidityPledge"
                    ? "active menu"
                    : "menu"
                }
                onClick={() => {
                  return addMessage("Coming soon");
                  // switchNetwork(customNetwork_UNI);
                  Navigate("/View/LiquidityPledge");
                }}
              >
                {t("流动性挖矿")}
              </div>
              <div
                className={
                  String(ItemActive) === "/TradePledge" ? "active menu" : "menu"
                }
                onClick={() => {
                  return addMessage("Coming soon");
                  // switchNetwork(customNetwork_UNI);
                  Navigate("/View/TradePledge");
                }}
              >
                {t("交易挖矿")}
              </div>
              <div
                className={
                  String(ItemActive) === "/Bridge" ? "active menu" : "menu"
                }
                onClick={() => {
                  Navigate("/View/Bridge");
                }}
              >
                {t("跨链桥")}
              </div>
              <div
                className={
                  String(ItemActive) === "/Dao" ? "active menu" : "menu"
                }
                onClick={() => {
                  return addMessage("Coming soon");
                  // switchNetwork(customNetwork_UNI);
                  Navigate("/View/Dao");
                }}
              >
                DAO
              </div>
            </NavContainer>
          )}

          {width > 1400 ? (
            <SetBox>
              <Dropdown
                overlay={menu3}
                placement="bottom"
                overlayClassName="LangDropDown"
                trigger={["click"]}
                arrow={false}
                getPopupContainer={(triggerNode: any) => triggerNode}
              >
                <div className="langDrowDrop pointer">
                  <img src={languageIcon} alt="" />
                </div>
              </Dropdown>
              <Dropdown
                overlay={menu1}
                placement="bottom"
                overlayClassName="LangDropDown"
                trigger={["click"]}
                arrow={false}
                getPopupContainer={(triggerNode: any) => triggerNode}
              >
                <div className="dropdownBox pointer">
                  {t("全球社区")} <img src={dropDownIcon} alt="" />
                </div>
              </Dropdown>
              <Dropdown
                overlay={menu2}
                placement="bottom"
                overlayClassName="LangDropDown ChainDropDown"
                trigger={["click"]}
                arrow={false}
                getPopupContainer={(triggerNode: any) => triggerNode}
              >
                <div className="dropdownBox chainDropdownBox pointer">
                  <img src={CurrentChain?.img} alt="" className="chainIcon" />{" "}
                  {CurrentChain?.value} <img src={dropDownIcon} alt="" />
                </div>
              </Dropdown>

              {!!token ? (
                <Dropdown
                  overlay={connectedMenu}
                  placement="bottom"
                  overlayClassName="LangDropDown "
                  trigger={["click"]}
                  arrow={false}
                  getPopupContainer={(triggerNode: any) => triggerNode}
                >
                  <div
                    className="Connect   pointer "
                    onClick={() => {
                      // open();
                    }}
                  >
                    <img src={walletIcon} alt="" />{" "}
                    {AddrHandle(web3ModalAccount as string, 6, 4)}{" "}
                    <img src={dropDownIcon1} alt="" className="dropDownIcon1" />
                  </div>
                </Dropdown>
              ) : (
                <div
                  className="Connect  pointer "
                  onClick={() => {
                    open();
                  }}
                >
                  <img src={walletIcon} alt="" /> {t("连接钱包")}
                </div>
              )}
            </SetBox>
          ) : (
            <SetBox>
              <Dropdown
                overlay={menu2}
                placement="bottom"
                overlayClassName="LangDropDown ChainDropDown"
                trigger={["click"]}
                arrow={false}
                getPopupContainer={(triggerNode: any) => triggerNode}
              >
                <div className="dropdownBox chainDropdownBox pointer">
                  <img src={CurrentChain?.img} alt="" className="chainIcon" />
                  <img src={dropDownIcon} alt="" />
                </div>
              </Dropdown>

              {!!token ? (
                <Dropdown
                  overlay={connectedMenu}
                  placement="bottom"
                  overlayClassName="LangDropDown "
                  trigger={["click"]}
                  arrow={false}
                  getPopupContainer={(triggerNode: any) => triggerNode}
                >
                  <div
                    className="Connect  pointer "
                    onClick={() => {
                      // open();
                    }}
                  >
                    <img src={walletIcon} alt="" />{" "}
                    {AddrHandle(web3ModalAccount as string, 2, 4)}{" "}
                    <img src={dropDownIcon1} alt="" className="dropDownIcon1" />
                  </div>
                </Dropdown>
              ) : (
                <div
                  className="Connect  pointer "
                  onClick={() => {
                    open();
                  }}
                >
                  <img src={walletIcon} alt="" /> {t("连接钱包")}
                </div>
              )}
              <img
                src={showMask ? menu_close : menu_fill}
                alt=""
                onClick={() => {
                  setShowMask(!showMask);
                }}
              />
            </SetBox>
          )}
        </div>
      </HeaderContainer>

      <MobileSlider
        style={{ display: showMask ? "block" : "none" }}
        src={mobileMenuBg}
      >
        <div>
          <MobileSlider_Title>
            <div className="HeaderNav">
              <LogoContainer className="LogoContainer_Mobile">
                <img
                  onClick={() => {
                    setShowMask(false);
                    Navigate("/View/");
                  }}
                  src={newLogo}
                />
              </LogoContainer>

              <SetBox>
                <img
                  src={showMask ? menu_close : menu_fill}
                  alt=""
                  onClick={() => {
                    setShowMask(!showMask);
                  }}
                />
              </SetBox>
            </div>
          </MobileSlider_Title>

          <MobileSlider_Menu>
            <div
              className={String(ItemActive) === "/" ? "active menu" : "menu"}
              onClick={() => {
                // switchNetwork(customNetwork_UNI);
                Navigate("/View/");
                setShowMask(false);
              }}
            >
              {t("交易")}
            </div>
            <div>
              <NodePartner
                src={NodeMenuBg}
                onClick={() => {
                  return addMessage("Coming soon");
                  window.open(GoTo);
                }}
              >
                <img src={hotIcon} alt="" />
                {t("节点合伙人")}
              </NodePartner>
            </div>

            <div
              className={
                String(ItemActive) === "/Pool" ? "active menu" : "menu"
              }
              onClick={() => {
                return addMessage("Coming soon");
                // switchNetwork(customNetwork_UNI);
                Navigate("/View/Pool");
              }}
            >
              {t("质押糖浆池")}
            </div>
            <div
              className={
                String(ItemActive) === "/LiquidityPledge"
                  ? "active menu"
                  : "menu"
              }
              onClick={() => {
                return addMessage("Coming soon");
                // switchNetwork(customNetwork_UNI);
                Navigate("/View/LiquidityPledge");
              }}
            >
              {t("流动性挖矿")}
            </div>
            <div
              className={
                String(ItemActive) === "/TradePledge" ? "active menu" : "menu"
              }
              onClick={() => {
                return addMessage("Coming soon");

                // switchNetwork(customNetwork_UNI);
                Navigate("/View/TradePledge");
              }}
            >
              {t("交易挖矿")}
            </div>
            <div
              className={
                String(ItemActive) === "/Bridge" ? "active menu" : "menu"
              }
              onClick={() => {
                Navigate("/View/Bridge");
                setShowMask(false);
              }}
            >
              {t("跨链桥")}
            </div>
            <div
              className={String(ItemActive) === "/Dao" ? "active menu" : "menu"}
              onClick={() => {
                return addMessage("Coming soon");
                // switchNetwork(customNetwork_UNI);
                Navigate("/View/Dao");
              }}
            >
              DAO
            </div>

            <div
              className="communityMenus"
              onClick={() => {
                openFun(0);
              }}
            >
              <div className="menu">
                {t("全球社区")}{" "}
                <img
                  src={dropdown}
                  alt=""
                  className={
                    !OpenList?.some((item1: any) => Number(item1) === Number(0))
                      ? "rotetaOpen"
                      : "rotetaClose"
                  }
                />
              </div>
              <div className="nav">
                {OpenList?.some(
                  (item1: any) => Number(item1) === Number(0)
                ) && (
                  <div>
                    <div
                      // onClick={() => {
                      //   dispatch(setCollapsedAction(true));
                      //   navigate("/View/Invest");
                      // }}
                      onClick={() => {
                        window.open(communityObj[0]?.link);
                      }}
                    >
                      Telegram
                    </div>
                    <div
                      // onClick={() => {
                      //   dispatch(setCollapsedAction(true));
                      //   navigate("/View/AboutUs");
                      // }}
                      onClick={() => {
                        window.open(communityObj[1]?.link);
                      }}
                    >
                      Twitter
                    </div>

                    <div
                      // onClick={() => {
                      //   dispatch(setCollapsedAction(true));
                      //   navigate("/View/ContractUs");
                      // }}
                      onClick={() => {
                        window.open(communityObj[2]?.link);
                      }}
                    >
                      Medium
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className="communityMenus"
              onClick={() => {
                openFun(1);
              }}
            >
              <div className="menu">
                {t("语言")}{" "}
                <img
                  src={dropdown}
                  alt=""
                  className={
                    !OpenList?.some((item1: any) => Number(item1) === Number(1))
                      ? "rotetaOpen"
                      : "rotetaClose"
                  }
                />
              </div>
              <div className="nav">
                {OpenList?.some(
                  (item1: any) => Number(item1) === Number(1)
                ) && (
                  <div>
                    {langObj?.map((item: any, index: any) => (
                      <div
                        key={index}
                        // onClick={() => {
                        //   dispatch(setCollapsedAction(true));
                        //   navigate("/View/Invest");
                        // }}
                        onClick={() => {
                          // window.open(linkObj?.tg);
                          changeLanguage(item);
                        }}
                      >
                        {item?.value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </MobileSlider_Menu>
        </div>
      </MobileSlider>

      <Content className="MainContent">
        <Outlet />
        {!!showMask && (
          <div
            className="Mask"
            onClick={() => {
              setShowMask(false);
            }}
          ></div>
        )}
      </Content>

      <ReferListModal
        userInfo={UserInfo}
        ShowTipModal={MyInviteCodeStateModal}
        close={() => {
          setMyInviteCodeStateModal(false);
        }}
      />
      <AllModal
        visible={BindModal}
        className="Modal"
        centered
        width={"461px"}
        closable={false}
        footer={null}
      >
        <ModalContainer>
          <ModalContainer_Title>
            {t("Bind referral code")}
            <ModalContainer_Close>
              {" "}
              <img
                src={closeIcon}
                alt=""
                onClick={() => {
                  setBindModal(false);
                }}
              />
            </ModalContainer_Close>
          </ModalContainer_Title>
          <ModalContainer_Content>
            <InputBox>
              <CodeInputBox
                ref={codeInputRef}
                defaultCode={InputValue ?? null}
                onValueChange={(codes: any) => setInputValue(codes)}
              />
            </InputBox>
            <ConfirmBtn>
              <Btn
                onClick={() => {
                  // if (!!NoNewUserState) {
                  BindFun();
                  // } else {
                  //   LoginFun(InputValue);
                  // }
                }}
              >
                {t("Confirm")}
              </Btn>
            </ConfirmBtn>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>
    </MyLayout>
  );
};
export default MainLayout;
