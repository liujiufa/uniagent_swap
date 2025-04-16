import React, { useState, useEffect, useRef } from "react";
import {
  getAllData,
  getDrawData,
  getExchangeFormDataList,
  getExchangeRecord,
  getMyNft,
  getNftBase,
  getPersonData,
  getPledgeBaasList,
  getPriceInfo,
  getProductOff,
  getServerTime,
  getUserInfo,
  isNewUser,
  payNft,
  runBridge,
} from "../API/index";
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
import copyFun from "copy-to-clipboard";
import { Contracts } from "../web3";
import useUSDTGroup from "../hooks/useUSDTGroup";
import {
  contractAddress,
  curentBSCChainId,
  curentUNIChainId,
  isMain,
  loginNetworkId,
} from "../config";
import { createLoginSuccessAction } from "../store/actions";
import { useNoGas } from "../hooks/useNoGas";
import ModalContent from "../components/ModalContent";
import ModalContentSuccess from "../components/ModalContentSuccess";
import { useGetReward } from "../hooks/useGetReward";
import avtorImg from "../assets/image/avtorImg.png";
import pledge_bg from "../assets/image/Pledge/pledge_bg.png";
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
import usdtIcon from "../assets/image/Swap/usdtIcon.png";
import pijsIcon from "../assets/image/Swap/pijsIcon.png";
import uacIcon from "../assets/image/Swap/uacIcon.png";
import person_banner from "../assets/image/PersonCenter/person_banner.png";
import level from "../assets/image/PersonCenter/level.png";
import mobile_banner from "../assets/image/PersonCenter/mobile_banner.png";
import nav1 from "../assets/image/PersonCenter/nav1.png";
import nav2 from "../assets/image/PersonCenter/nav2.png";
import nav3 from "../assets/image/PersonCenter/nav3.png";
import nav4 from "../assets/image/PersonCenter/nav4.png";
import nav5 from "../assets/image/PersonCenter/nav5.png";
import nav6 from "../assets/image/PersonCenter/nav6.png";
import nav1_active from "../assets/image/PersonCenter/nav1_active.png";
import nav2_active from "../assets/image/PersonCenter/nav2_active.png";
import nav3_active from "../assets/image/PersonCenter/nav3_active.png";
import nav4_active from "../assets/image/PersonCenter/nav4_active.png";
import nav5_active from "../assets/image/PersonCenter/nav5_active.png";
import nav6_active from "../assets/image/PersonCenter/nav6_active.png";
import dropDownIcon from "../assets/image/layout/dropDownIcon.png";

import { turn } from "../components/loding";
import "../assets/style/PersonCenter.scss";
import ModalContentSuccessSigleBtn from "../components/ModalContentSuccessSigleBtn";
import { Dropdown, Menu } from "antd";
import Mining_Nav from "../components/Mining_Nav";
import Invite_Nav from "../components/Invite_Nav";
import Right_Nav from "../components/Right_Nav";
import Performance_Nav from "../components/Performance_Nav";
import Airdrop_Nav from "../components/Airdrop_Nav";
import Medal_Nav from "../components/Medal_Nav";
import { userTypeObj } from "../components/ReferListModal";

const HomeContainerBox = styled.div<{ src: string }>`
  padding-top: 64px;
  width: 100%;
  /* min-height: 100vh; */
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: cover; //根据你图片的大小自定义
  background-repeat: no-repeat;
  overflow: hidden;
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
  chainId: number;
  tokens: Token[];
}
const ChainArr: Chain[] = [
  {
    ChainName: "Pi",
    icon: piIcon,
    chainId: 19898,
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
    chainId: curentBSCChainId,
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
    chainId: curentUNIChainId,
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

  const token = useSelector<stateType, stateType>((state: any) => state?.token);

  const [Tip, setTip] = useState("");
  const [ShowTipModal, setShowTipModal] = useState(false);
  const [ShowSuccessTipModal, setShowSuccessTipModal] = useState(false);

  const [SuccessFulHash, setSuccessFulHash] = useState("");
  const [PledgeCoinList, setPledgeCoinList] = useState<any>([]);

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
  const [UserInfo, setUserInfo] = useState<any>({});

  const [ActiveNav, setActiveNav] = useState<any>("nav1");
  const { isNoGasFun } = useNoGas();
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

  const getInitData = () => {
    getUserInfo().then((res: any) => {
      setUserInfo(res?.data || {});
    });
  };
  useEffect(() => {
    if (!!token) {
      getInitData();
    }
  }, [token]);

  useEffect(() => {
    handleUSDTRefresh();
    // if (!!web3ModalAccount) {
    //   addBalancesToTokens();
    // }
  }, [web3ModalAccount, chainId, token]);

  useEffect(() => {
    if (!token) {
      setPledgeCoinList([]);
      setUserInfo({});
    }
  }, []);

  return (
    <>
      <HomeContainerBox
        src={width >= 1400 ? pledge_bg : pledge_bg}
        className="PersonCenter"
      >
        <div className="content">
          {width > 768 ? (
            <div className="banner">
              <div className="banner_left">
                <div className="person_info">
                  <div className="avtor">
                    <img src={avtorImg} alt="" />
                  </div>
                  <div className="address">
                    {AddrHandle(web3ModalAccount as string, 6, 4)}{" "}
                    <div>{userTypeObj[UserInfo?.nodeType]}</div>
                  </div>
                </div>
                <img src={level} alt="" />
              </div>
              <div className="banner_right">
                <img src={person_banner} alt="" />
              </div>
            </div>
          ) : (
            <div className="banner">
              <div className="banner_right">
                <img src={mobile_banner} alt="" />
              </div>
              <div className="banner_left">
                <div className="person_info">
                  <div className="avtor">
                    <img src={avtorImg} alt="" />
                  </div>
                  <div className="address">
                    {AddrHandle(web3ModalAccount as string, 6, 4)}{" "}
                    <div>{userTypeObj[UserInfo?.nodeType]}</div>
                  </div>
                </div>
                <img src={level} alt="" />
              </div>
            </div>
          )}
          <div className="content_bottom">
            {width > 768 ? (
              <div className="navs">
                <div className="nav">
                  <div
                    onClick={() => {
                      setActiveNav("nav1");
                    }}
                  >
                    <div
                      className={ActiveNav === "nav1" ? "active nav" : "nav"}
                    >
                      <img
                        src={ActiveNav === "nav1" ? nav1_active : nav1}
                        alt=""
                      />
                      挖矿
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setActiveNav("nav2");
                    }}
                  >
                    <div
                      className={ActiveNav === "nav2" ? "active nav" : "nav"}
                    >
                      <img
                        src={ActiveNav === "nav2" ? nav2_active : nav2}
                        alt=""
                      />
                      邀请
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setActiveNav("nav3");
                    }}
                  >
                    <div
                      className={ActiveNav === "nav3" ? "active nav" : "nav"}
                    >
                      <img
                        src={ActiveNav === "nav3" ? nav3_active : nav3}
                        alt=""
                      />
                      权益
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setActiveNav("nav4");
                    }}
                  >
                    <div
                      className={ActiveNav === "nav4" ? "active nav" : "nav"}
                    >
                      <img
                        src={ActiveNav === "nav4" ? nav4_active : nav4}
                        alt=""
                      />
                      业绩
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setActiveNav("nav5");
                    }}
                  >
                    <div
                      className={ActiveNav === "nav5" ? "active nav" : "nav"}
                    >
                      <img
                        src={ActiveNav === "nav5" ? nav5_active : nav5}
                        alt=""
                      />
                      空投
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setActiveNav("nav6");
                    }}
                  >
                    <div
                      className={ActiveNav === "nav6" ? "active nav" : "nav"}
                    >
                      <img
                        src={ActiveNav === "nav6" ? nav6_active : nav6}
                        alt=""
                      />
                      勋章
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="navs_line">
                <div
                  onClick={() => {
                    setActiveNav("nav1");
                  }}
                >
                  <div className={ActiveNav === "nav1" ? "active nav" : "nav"}>
                    挖矿 <div className="bottom_line"></div>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setActiveNav("nav2");
                  }}
                >
                  <div className={ActiveNav === "nav2" ? "active nav" : "nav"}>
                    邀请 <div className="bottom_line"></div>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setActiveNav("nav3");
                  }}
                >
                  <div className={ActiveNav === "nav3" ? "active nav" : "nav"}>
                    权益 <div className="bottom_line"></div>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setActiveNav("nav4");
                  }}
                >
                  <div className={ActiveNav === "nav4" ? "active nav" : "nav"}>
                    业绩 <div className="bottom_line"></div>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setActiveNav("nav5");
                  }}
                >
                  <div className={ActiveNav === "nav5" ? "active nav" : "nav"}>
                    空投 <div className="bottom_line"></div>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setActiveNav("nav6");
                  }}
                >
                  <div className={ActiveNav === "nav6" ? "active nav" : "nav"}>
                    勋章 <div className="bottom_line"></div>
                  </div>
                </div>
              </div>
            )}
            <div className="navs_content">
              {ActiveNav === "nav1" && <Mining_Nav></Mining_Nav>}
              {ActiveNav === "nav2" && (
                <Invite_Nav userInfo={UserInfo}></Invite_Nav>
              )}
              {ActiveNav === "nav3" && <Right_Nav></Right_Nav>}
              {ActiveNav === "nav4" && <Performance_Nav></Performance_Nav>}
              {ActiveNav === "nav5" && <Airdrop_Nav></Airdrop_Nav>}
              {ActiveNav === "nav6" && <Medal_Nav></Medal_Nav>}
            </div>
          </div>

          <ModalContent
            ShowTipModal={ShowTipModal}
            Tip={Tip}
            close={() => {
              setShowTipModal(false);
            }}
          />
          <ModalContentSuccessSigleBtn
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
        </div>
        {width >= 1400 && <Footer></Footer>}
      </HomeContainerBox>
      {!(width >= 1400) && <Footer></Footer>}
    </>
  );
}
