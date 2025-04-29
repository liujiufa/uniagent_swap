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
  percentToDecimal,
  thousandsSeparator,
} from "../utils/tool";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
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
import piIcon from "../assets/image/Swap/piIcon.png";
import usdtIcon from "../assets/image/Swap/usdtIcon.png";
import pijsIcon from "../assets/image/Swap/pijsIcon.png";
import uacIcon from "../assets/image/Swap/uacIcon.png";
import swapBanner from "../assets/image/Swap/swapBanner.png";
import MainBg from "../assets/image/layout/MainBg.png";
import mainBgMobile from "../assets/image/layout/mainBgMobile.png";
import pledge_bg from "../assets/image/Pledge/pledge_bg.png";
import rightIcon from "../assets/image/Pledge/rightIcon.png";

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
import { getNodeRedeemInfo, getPledgeBaasList, getUserInfo } from "../API";
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

const SwapItem_Title = styled(FlexSBCBox)`
  font-family: "MiSans";
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #bcc6cf;
  margin-top: 36px;
  padding: 17px 24px;
  .selectBox {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-family: "MiSans";
    font-size: 18px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #bcc6cf;
    div {
      cursor: pointer;
      border-radius: 4px;
      opacity: 1;
      box-sizing: border-box;
      border: 1px solid #bcc6cf;
      width: 20px;
      height: 20px;
    }
    img {
      width: 20px;
      height: 20px;
    }
  }

  span {
    font-family: "MiSans";
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    text-align: right;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #c8c8c8;
    margin-left: 12px;
  }
  @media (max-width: 768px) {
    margin: 24px 0px 0px;
    padding: 14px 12px;
    span {
      font-size: 14px;
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
  border-radius: 0px 0px 16px 16px;
  opacity: 1;
  background: #000000;
  overflow: hidden;

  .tip {
    font-family: "MiSans";
    font-size: 18px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #53575c;
    margin-bottom: 8px;
  }
  > input {
    font-family: "MiSans";
    font-size: 32px;
    font-weight: 500;
    line-height: 42px;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #bcc6cf;
    background: transparent;
    outline: none;
    border: none;
  }
  @media (max-width: 768px) {
    padding: 14px 12px;
    > input {
      font-family: "MiSans";
      font-size: 18px;
      font-weight: 500;
      line-height: 24px;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #bcc6cf;
    }
    .tip {
      font-size: 14px;
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
    font-family: "MiSans";
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
    margin-top: 40px;
    > div {
      padding: 6px 16px;
      font-size: 14px;
    }
  }
  @media (max-width: 375px) {
    flex-wrap: wrap;
    > div {
      margin-top: 8px;
    }
  }
`;

const SwapBox = styled.div`
  border-radius: 16px;
  opacity: 1;
  background: #292a2b;
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

  const [SuccessFulHash, setSuccessFulHash] = useState("");
  const [LpAddress, setLpAddress] = useState("");
  const [LPBalance, setLPBalance] = useState("0");
  const { address: web3ModalAccount, isConnected } = useAppKitAccount();
  const { isNoGasFun } = useNoGas();
  const [RedeemType, setRedeemType] = useState(1);
  const [PercentValue, setPercentValue] = useState("0%");
  const [UserInfo, setUserInfo] = useState<any>({});

  const [PledgeCoinList, setPledgeCoinList] = useState<any>([]);
  const [NodeRedeemInfo, setNodeRedeemInfo] = useState<any>([]);

  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
    withdrawHandleTransaction,
  } = useUSDTGroup(contractAddress?.LPPledge, LpAddress);
  const { CoinId } = useParams();
  const CurrentLP: any = PledgeCoinList?.find(
    (item: any) => item?.id === Number(CoinId)
  );
  const Amount: any =
    Number(UserInfo?.nodeType) === 1 && RedeemType === 2
      ? NodeRedeemInfo?.totalPledgeNum
      : CurrentLP?.pledgeUser?.pledgeNum * percentToDecimal(PercentValue);
  const getInitData = () => {
    // 类型 1-LP 2-代币  状态 0-未开始 1-进行中 2-已结束
    getPledgeBaasList(1, -1).then((res: any) => {
      if (res.code === 200) {
        setPledgeCoinList(res?.data || []);
      }
    });
    getNodeRedeemInfo(1).then((res: any) => {
      if (res.code === 200) {
        setNodeRedeemInfo(res?.data || []);
      }
    });
  };

  const RemoveLiquidityFun = async () => {
    // return addMessage(t("Coming soon"));
    withdrawHandleTransaction(
      Number(Amount ?? 0) + "",
      async (call: any) => {
        let res: any = null;
        try {
          if (!!(await isNoGasFun())) return;
          setTip(t("本金提取中"));
          setShowTipModal(true);

          res = await Contracts.example?.unstakeLP(
            web3ModalAccount as string,
            Amount + "",
            contractAddress?.LPPledge
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
          setSuccessFulHash(res?.transactionHash);
          setTip(t("本金提取成功"));
          getInitData();
          setTimeout(() => {
            getInitData();
          }, 5000);
          return setShowSuccessTipModal(true);
        } else if (res?.status === false) {
          setShowTipModal(false);
          return addMessage(t("failed"));
        }
      },
      () => {
        setTip(
          t("1000000LP", {
            num: Number(Amount ?? 0),
          })
        );
        setShowTipModal(true);
      },
      () => {
        setShowTipModal(false);
      }
    );
  };

  const getLpBalance = async () => {
    try {
      let lpAddress: any = await Contracts.example?.getPair(
        web3ModalAccount as string,
        contractAddress?.PIJSBSC,
        contractAddress?.USDTBSC,
        contractAddress?.PIJSFactory
      );

      setLpAddress(lpAddress ?? "");

      let LPbalance = await Contracts.example.balanceOf(
        web3ModalAccount as string,
        lpAddress
      );
      setLPBalance(EthertoWei(LPbalance ?? "0"));
    } catch (error: any) {
      // debugger;
      // debugger;
      setLPBalance("0");
    }
  };
  const getInitUserData = () => {
    getUserInfo().then((res: any) => {
      setUserInfo(res?.data || {});
    });
  };

  useEffect(() => {
    getInitData();
  }, [web3ModalAccount, token]);

  useEffect(() => {
    if (!!web3ModalAccount) {
      getLpBalance();
    }
  }, [web3ModalAccount, chainId]);
  useEffect(() => {
    if (!!token) {
      getInitUserData();
    }
  }, [token]);
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
      return <Btn isActive={false}>{t("请输入撤出比例")}</Btn>;
    // if (Number(Amount) > Number(CurrentLP?.pledgeUser?.pledgeNum))
    //   return <Btn isActive={false}>{t("余额不足")}</Btn>;

    return (
      <Btn
        isActive={true}
        onClick={() => {
          RemoveLiquidityFun();
        }}
      >
        {Number(TOKENAllowance) >= Number(Amount) ? t("提取") : t("授权")} LP
      </Btn>
    );
  };

  return (
    <>
      <HomeContainerBox src={width >= 1400 ? pledge_bg : pledge_bg}>
        <div>
          <SwapContainer>
            <SwapContainer_Title
              onClick={() => {
                Navigate(-1);
              }}
            >
              {" "}
              <img src={toIcon} alt="" /> {t("质押赎回")}
            </SwapContainer_Title>
            <SwapBox>
              <SwapItem_Title>
                <div className="selectBox">
                  {RedeemType === 1 ? (
                    <img src={rightIcon} alt="" />
                  ) : (
                    <div
                      onClick={() => {
                        setRedeemType(1);
                      }}
                    ></div>
                  )}
                  <span>{t("我的质押")}</span>
                </div>

                <span>
                  {t("当前持仓")}: {CurrentLP?.pledgeUser?.pledgeNum ?? 0}{" "}
                  {CurrentLP?.title}
                </span>
              </SwapItem_Title>

              <SwapItem>
                <LiquidityItem>
                  <div className="tip">{t("输入撤出比例")}</div>
                  <input type="text" value={PercentValue} />
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
            </SwapBox>
            {Number(UserInfo?.nodeType) === 1 && (
              <SwapBox>
                <SwapItem_Title>
                  <div className="selectBox">
                    {RedeemType === 2 ? (
                      <img src={rightIcon} alt="" />
                    ) : (
                      <div
                        onClick={() => {
                          setRedeemType(2);
                        }}
                      ></div>
                    )}
                    <span>{t("超级节点权益质押")}</span>
                  </div>

                  <span>
                    {t("权益已兑付")} {NodeRedeemInfo?.redeemRate ?? 0}%
                  </span>
                </SwapItem_Title>
                <SwapItem>
                  <LiquidityItem>
                    <div className="tip">{t("权益质押只能一次性提取")}</div>
                    <input
                      type="text"
                      value={NodeRedeemInfo?.totalPledgeNum ?? 0 + " " + "LP"}
                      readOnly={true}
                    />
                  </LiquidityItem>
                </SwapItem>
              </SwapBox>
            )}

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
                // getCoinList();
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
