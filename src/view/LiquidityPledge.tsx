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
import MainBg from "../assets/image/layout/MainBg.png";
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
import no_my_img from "../assets/image/Pledge/no_my_img.png";
import { turn } from "../components/loding";
import "../assets/style/LiquidityPledge.scss";
import ModalContentSuccessSigleBtn from "../components/ModalContentSuccessSigleBtn";

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
  const [ActiveTab, setActiveTab] = useState(-1);
  const [ServerTime, setServerTime] = useState(-1);
  const [PriceInfo, setPriceInfo] = useState<any>({});

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

  const BridgeFun = (FromInputAmount: any) => {
    // return addMessage("Coming soon");

    // if (!IsBindState) return addMessage(t("9"));
    if (Number(FromInputAmount) < 10 || Number(FromInputAmount) > 10000)
      return addMessage(t("单次最小跨链10U"));
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
          // toAddress: ReceiveAddress,
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
              // FromInputAmount,
              // ReceiveAddress,
              item?.data,
              // loginNetworkId?.find(
              //   (item: any) => String(item?.name) === String(LinkType2)
              // )?.bridgeChainId,
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
            return setTip(t("Bridge successful", { num: NumSplic1(Amount) }));
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
            num: NumSplic1(FromInputAmount),
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

  const getInitData = () => {
    // 类型 1-LP 2-代币  状态 0-未开始 1-进行中 2-已结束
    getPledgeBaasList(1, ActiveTab).then((res: any) => {
      if (res.code === 200) {
        setPledgeCoinList(res?.data || []);
      }
    });
    getServerTime().then((res: any) => {
      if (res.code === 200) {
        setServerTime(res?.data || 0);
      }
    });
    getPriceInfo().then((res: any) => {
      if (res.code === 200) {
        setPriceInfo(res?.data || {});
      }
    });
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
            token.balance = EthertoWei(Tokenbalance ?? "0");
          }
        }
      }
    }
  }

  useEffect(() => {
    // if (token) {
    getInitData();
    // }
  }, [web3ModalAccount, chainId, token, ActiveTab]);

  useEffect(() => {
    handleUSDTRefresh();
    // if (!!web3ModalAccount) {
    //   addBalancesToTokens();
    // }
  }, [web3ModalAccount, chainId, token]);

  // useEffect(() => {
  //   if (!token) {
  //     setPledgeCoinList([]);
  //   }
  // }, []);

  const MyBox = (item: any) => {
    if (!web3ModalAccount)
      return (
        <div className="mybox">
          <div className="mybox_bottom">
            <div className="no_my_box">
              <img src={no_my_img} alt="" />
              {t("未找到持仓")}
            </div>

            <div className="btns">
              <div
                className="btn_mid"
                onClick={() => {
                  open();
                }}
              >
                {t("连接钱包")}
              </div>
            </div>
          </div>
        </div>
      );

    if (!item?.pledgeUser)
      return (
        <div className="mybox">
          <div className="mybox_bottom">
            <div className="no_my_box">
              <img src={no_my_img} alt="" />
              {t("未找到持仓")}
            </div>
            <div className="btns">
              <div
                className="btn_left"
                onClick={() => {
                  Navigate("/View/", { state: { tab: "Liquidity" } });
                }}
              >
                {t("添加LP")}
              </div>
              <div
                className="btn_mid"
                onClick={() => {
                  Navigate(`/View/LPPledge/${item?.id}`);
                }}
              >
                {t("添加质押")}
              </div>
            </div>
          </div>
        </div>
      );

    return (
      <div className="mybox">
        <div className="mybox_top">
          <div className="mybox_top_reward">
            <div className="reward_data">
              {t("待提收益")}
              <div>{item?.pledgeUser?.treatDrawNum ?? 0} PiJS</div>
            </div>
            <div
              className="reward_btn btn"
              onClick={() => {
                if (item?.pledgeUser?.treatDrawNum > 0) {
                  getReward(
                    () => {
                      getInitData();
                      setTip(t("收益提取成功"));
                      setShowSuccessTipModal(true);
                    },
                    contractAddress?.StakingRewardDistribute,
                    {
                      coinName: "PIJS",
                      id: item?.pledgeUser?.id,
                      type: 1,
                    },
                    () => {
                      setTip(t("收益提取中"));
                      setShowTipModal(true);
                    },
                    () => {
                      setShowTipModal(false);
                    }
                  );
                }
              }}
            >
              {t("提收益")}
            </div>
          </div>
          {!!item?.pledgeUser?.nextDrawTime &&
            (ServerTime > item?.pledgeUser?.nextDrawTime ? (
              <div className="time">
                {t("下次提取")}：
                {dateFormat(
                  "YYYY-mm-dd HH:MM",
                  new Date(item?.pledgeUser?.nextDrawTime)
                )}
              </div>
            ) : (
              <div className="time">{t("收益每7天可提取一次")}</div>
            ))}
        </div>
        <div className="devider"></div>
        <div className="mybox_bottom">
          <div className="my_data">
            <div className="my">
              {t("我的质押")}
              <div className="num">
                {item?.pledgeUser?.pledgeNum} <span>LP</span>
              </div>
              <div className="value">
                $
                {NumSplic1(
                  Number(item?.pledgeUser?.pledgeNum) *
                    Number(PriceInfo?.lpPrice),
                  4
                )}
              </div>
            </div>
            <div className="my">
              {t("我的收益")}
              <div className="num">
                {item?.pledgeUser?.earnNum}{" "}
                <span>{item?.pledgeUser?.coinName}</span>
              </div>
              <div className="value">
                $
                {NumSplic1(
                  Number(item?.pledgeUser?.earnNum) *
                    Number(PriceInfo?.pijsPrice),
                  4
                )}
              </div>
            </div>
          </div>

          <div className="btns">
            <div
              className="btn_left"
              onClick={() => {
                Navigate(`/View/PledgeRedeem/${item?.id}`);
              }}
            >
              {t("提本金")}
            </div>
            <div
              className="btn_left"
              // className="btn_mid"
              onClick={() => {
                Navigate("/View/", { state: { tab: "Liquidity" } });
              }}
            >
              {t("添加LP")}
            </div>
            <div
              className="btn_mid"
              // className="btn_right"
              onClick={() => {
                Navigate(`/View/LPPledge/${item?.id}`);
              }}
            >
              {t("添加质押")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <HomeContainerBox
        src={width >= 1400 ? pledge_bg : pledge_bg}
        className="LiquidityPledge"
      >
        <div className="banner"></div>
        <div className="content">
          <div className="tabs">
            <div
              className={ActiveTab === -1 ? "active tab" : "tab"}
              onClick={() => {
                setActiveTab(-1);
              }}
            >
              {t("全部")}
            </div>
            <div
              className={ActiveTab === 1 ? "active tab" : "tab"}
              onClick={() => {
                setActiveTab(1);
              }}
            >
              {t("进行中")}
            </div>
            <div
              className={ActiveTab === 2 ? "active tab" : "tab"}
              onClick={() => {
                setActiveTab(2);
              }}
            >
              {t("已结束")}
            </div>
          </div>

          <div className="items">
            {PledgeCoinList?.map((item: any, index: any) => (
              <div key={index} className="item">
                <div className="coins_info">
                  <div className="coins_info_left">
                    <img src={usdtIcon} alt="" />
                    <img src={pijsIcon} alt="" />
                  </div>
                  <div className="coins_info_right">{item?.title}</div>
                </div>

                <div className="tip">
                  {t(
                    "根据质押价值动态计算产出系数，产出根据您的LP质押价值权重占比分配。"
                  )}
                </div>
                <div className="all_info">
                  <div>
                    {" "}
                    {t("质押的流动性")}{" "}
                    <span>${NumSplic1(item?.pledgeTotalNum) ?? "0"}</span>
                  </div>
                  <div>
                    {" "}
                    {t("产出系数")} <span>{item?.outputNumRate ?? "0"}%</span>
                  </div>
                  <div>
                    {" "}
                    APR <span>{NumSplic1(item?.apr) ?? "0"}%</span>
                  </div>
                </div>
                {MyBox(item)}
              </div>
            ))}
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
