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
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { getPledgeBaasList } from "../API";
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
  font-family: "MiSans";
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #bcc6cf;
  margin: 36px 0px 15px;

  span {
    font-family: "MiSans";
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
    font-family: "MiSans";
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
      font-family: "MiSans";
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
    margin-top: 60px;
    > div {
      border-radius: 24px;
      opacity: 1;
      background: #383e45;
      padding: 6px 24px;
      font-family: "MiSans";
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
    font-family: "MiSans";
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
      font-family: "MiSans";
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
      font-family: "MiSans";
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
        font-family: "MiSans";
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
  const [LpAddress, setLpAddress] = useState("");
  const { token } = useSelector<stateType, stateType>((state) => state);
  const [Tip, setTip] = useState("");
  const [Title, setTitle] = useState("");
  const [ShowTipModal, setShowTipModal] = useState(false);
  const [ShowSuccessTipModal, setShowSuccessTipModal] = useState(false);
  const [ShowAddLiquiditySuccessTipModal, setShowAddLiquiditySuccessTipModal] =
    useState(false);

  const [SuccessFulHash, setSuccessFulHash] = useState("");
  const { address: web3ModalAccount, isConnected } = useAppKitAccount();
  const { isNoGasFun } = useNoGas();
  const [PledgeCoinList, setPledgeCoinList] = useState<any>([]);

  const [InputAmount, setInputAmount] = useState(1);
  const { CoinId } = useParams();
  const CurrentLP: any = PledgeCoinList?.find(
    (item: any) => item?.id === Number(CoinId)
  );

  const {
    TOKENBalance: LPTOKENBalance,
    TOKENAllowance: LPTOKENAllowance,
    handleApprove: LPhandleApprove,
    handleTransaction: LPhandleTransaction,
    handleUSDTRefresh: LPhandleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.LPPledge, contractAddress?.PIJSBSC);

  const getInitData = () => {
    // 类型 1-LP 2-代币  状态 0-未开始 1-进行中 2-已结束
    getPledgeBaasList(2, -1).then((res: any) => {
      if (res.code === 200) {
        setPledgeCoinList(res?.data || []);
      }
    });
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

  const PledgeLiquidityFun = async () => {
    // return addMessage(t("Coming soon"));

    LPhandleTransaction(
      Number(InputAmount ?? 0) + "",
      async (call: any) => {
        let res: any = null;
        try {
          if (!!(await isNoGasFun())) return;
          setTip(
            t("质押PIJS中", {
              coin: CurrentLP?.title,
            })
          );
          setShowTipModal(true);

          res = await Contracts.example?.stakePIJS(
            web3ModalAccount as string,
            InputAmount + "",
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
          setTip(t("流动性质押成功"));
          getInitData();
          return setShowSuccessTipModal(true);
        } else if (res?.status === false) {
          setShowTipModal(false);
          return addMessage(t("failed"));
        }
      },
      () => {
        setTip(
          t("批准 100.0000 PIJS", {
            num: Number(InputAmount ?? 0),
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
  };

  useEffect(() => {
    getInitData();
  }, [web3ModalAccount, token]);

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
    if (Number(InputAmount) === 0)
      return <Btn isActive={false}>{t("请输入质押数量")}</Btn>;
    if (Number(InputAmount) > Number(LPTOKENBalance ?? 0))
      return <Btn isActive={false}>{t("余额不足")}</Btn>;

    return (
      <Btn
        isActive={true}
        onClick={() => {
          PledgeLiquidityFun();
        }}
      >
        {Number(LPTOKENAllowance) >= Number(InputAmount)
          ? t("质押")
          : t("授权")}{" "}
        {CurrentLP?.title}
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
              <img src={toIcon} alt="" /> {CurrentLP?.title} {t("质押")}
            </SwapContainer_Title>

            <SwapItem_Title>
              {t("输入质押数量")}{" "}
              <span>
                {CurrentLP?.title}
                {t("余额")}: {NumSplic1(LPTOKENBalance, 4) ?? 0}
              </span>
            </SwapItem_Title>
            <SwapItem>
              <LiquidityItem>
                <input type="text" value={InputAmount} onChange={InputFun} />
                <PercentageBox>
                  <div
                    onClick={() => {
                      setInputAmount(
                        Math.round(
                          0.25 * Number(NumSplic1(LPTOKENBalance, 4)) * 10000
                        ) / 10000
                      );
                    }}
                  >
                    25%
                  </div>
                  <div
                    onClick={() => {
                      setInputAmount(
                        Math.round(
                          0.5 * Number(NumSplic1(LPTOKENBalance, 4)) * 10000
                        ) / 10000
                      );
                    }}
                  >
                    50%
                  </div>
                  <div
                    onClick={() => {
                      setInputAmount(
                        Math.round(
                          0.75 * Number(NumSplic1(LPTOKENBalance, 4)) * 10000
                        ) / 10000
                      );
                    }}
                  >
                    75%
                  </div>
                  <div
                    onClick={() => {
                      setInputAmount(
                        Math.round(
                          1 * Number(NumSplic1(LPTOKENBalance, 4)) * 10000
                        ) / 10000
                      );
                    }}
                  >
                    100%
                  </div>
                </PercentageBox>
              </LiquidityItem>
            </SwapItem>
            <SwapItemBottom>
              <MyHold>
                <div>
                  {t("已持仓")}
                  <div className="value">
                    {CurrentLP?.pledgeUser?.pledgeNum ?? 0}
                  </div>
                </div>
                <div>
                  <div className="value oddValue"> +</div>
                </div>
                <div>
                  {t("增加持仓")}
                  <div className="value">{InputAmount ?? 0}</div>
                </div>
                <div>
                  <div className="value oddValue"> =</div>
                </div>
                <div>
                  {t("我的持仓")}
                  <div className="value">
                    {Number(CurrentLP?.pledgeUser?.pledgeNum ?? 0) +
                      Number(InputAmount ?? 0)}
                  </div>
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
          <ModalContentSuccessSigleBtn
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
