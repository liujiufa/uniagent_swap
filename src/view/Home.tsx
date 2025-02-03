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
import avtor from "../assets/image/Home/avtor.svg";
import goToIcon from "../assets/image/Home/goToIcon.svg";
import copy from "../assets/image/Home/copy.svg";
import exitIcon from "../assets/image/Home/exitIcon.svg";
import useTipLoding from "../components/ModalContent";
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
import NFT from "../assets/image/Home/NFT.png";
// @ts-ignore
import nodeVideo from "../assets/video/nodeVideo.mp4";
// @ts-ignore
import nodeVideo1 from "../assets/video/nodeVideo1.mp4";
import copying from "../assets/image/Home/copying.svg";
import go_icon from "../assets/image/go_icon.svg";
import ModalContentSuccess from "../components/ModalContentSuccess";
import ReferListModal from "../components/ReferListModal";
import MyNodeListModal from "../components/MyNodeListModal";
import useTime from "../hooks/useTime";
import LightUpNode from "../components/LightUpNode";
import RecommendedOuputModal from "../components/RecommendedOuputModal";
import RevokeNode from "../components/RevokeNode";
import RecommendedMintedModal from "../components/RecommendedMintedModal";
import { useGetReward } from "../hooks/useGetReward";
import StakingMiningModal from "../components/StakingMiningModal";
const HomeContainerBox = styled(ContainerBox)`
  padding: 56px;
  width: 100%;
  @media (max-width: 1200px) {
    padding: 56px 15px;
  }
`;
export const GameTooltip = styled.div``;
const HomeBox = styled.div`
  margin: 84px auto;
  max-width: 1156px;
  width: 100%;
  align-items: flex-end;
  @media (max-width: 1200px) {
    display: block;
    margin: 10px auto;
  }
`;
const All_Data = styled.div``;
const Personal_Data = styled.div`
  margin-top: 38px;
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;
const Title = styled(FlexBox)`
  align-items: center;

  font-family: "Space Grotesk";
  font-size: 32px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #93e63f;
  margin-bottom: 16px;
  > div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: "Space Grotesk";
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    text-align: right;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
    > div {
      margin-left: 6px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-family: "Space Grotesk";
      font-size: 16px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #93e63f;
      > div {
        margin-left: 20px;
      }
    }
  }
  @media (max-width: 768px) {
    font-family: Space Grotesk;
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    margin-bottom: 14px;
    display: block;
    > div {
    }
  }
`;
const Mobile_Box = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 14px;
  .Mobile_Box_Left {
    font-family: Space Grotesk;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
    > div {
      font-family: Space Grotesk;
      font-size: 18px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #93e63f;
    }
  }
`;
const All_Data_Content = styled(FlexBox)`
  @media (max-width: 768px) {
    display: block;
  }
`;

const All_Data_Content_Left = styled.div`
  flex: 1;
  margin-right: 25px;
  border-radius: 8px;
  opacity: 1;
  box-sizing: border-box;
  border: 1px solid #232323;
  overflow: hidden;
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;
const VideoBox = styled(FlexCCBox)`
  width: 100%;
  height: 100%;
  video {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
`;
const All_Data_Content_Right = styled.div`
  width: 314px;
  border-radius: 8px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #232323;
  @media (max-width: 1024px) {
    width: fit-content;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const All_Items = styled(FlexBox)`
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;
  > div {
    font-family: "Space Grotesk";
    font-size: 32px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    > div {
      margin-top: 4px;
      font-family: "Space Grotesk";
      font-size: 18px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #999999;
    }
  }
  @media (max-width: 1024px) {
    padding: 15px;
    > div {
      font-size: 22px;
      margin-bottom: 22px;
      &:last-child {
        margin-bottom: 0px;
      }
      > div {
        font-size: 14px;
      }
    }
  }
  @media (max-width: 768px) {
  }
`;
const Withdrawn_Btn = styled(FlexCCBox)`
  border-radius: 8px;
  opacity: 1;
  background: rgba(147, 230, 63, 0.1);
  box-sizing: border-box;
  border: 1px solid #557930;
  padding: 12px 18px;
  font-family: "Space Grotesk";
  font-size: 16px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #93e63f;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
const Personal_Data_Content = styled.div`
  border-radius: 8px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #232323;
  padding: 30px;
  @media (max-width: 768px) {
    padding: 13px 15px;
  }
`;
const Personal_Items = styled(FlexBox)`
  flex-wrap: wrap;
  > div {
    &:nth-child(3) {
      margin-bottom: 72px;
    }
  }
  @media (max-width: 1024px) {
    > div {
      &:nth-child(3) {
        margin-bottom: 30px;
      }
      &:nth-child(5) {
        margin-bottom: 30px;
      }
    }
  }
  @media (max-width: 768px) {
    > div {
      margin-bottom: 30px;
      &:nth-child(3) {
        margin-bottom: 30px;
      }
      &:nth-child(5) {
        margin-bottom: 30px;
      }
      &:nth-child(9),
      &:nth-child(10) {
        margin-bottom: 0px;
      }
      &:nth-child(odd) {
        width: 60%;
        padding-right: 12px;
      }
      &:nth-child(even) {
        width: 40%;
      }
    }
  }
`;
const Personal_Item = styled.div`
  width: 20%;
  > div {
    font-family: "Space Grotesk";
    font-size: 22px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    > div {
      &:first-child {
        font-family: "Space Grotesk";
        font-size: 16px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #999999;

        margin-top: 4px;
      }
    }
  }
  @media (max-width: 1024px) {
    width: 25%;

    > div {
      font-size: 18px;
      > div {
        &:first-child {
          font-size: 12px;
        }
      }
    }
  }

  @media (max-width: 768px) {
    width: 50%;
  }
`;
const CheckBtn = styled.div`
  font-family: "Space Grotesk";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #93e63f;
  margin-top: 12px;
  @media (max-width: 1024px) {
    font-size: 12px;
    margin-top: 4px;
  }
`;
const Btn = styled(FlexCCBox)`
  width: fit-content;
  font-family: "Space Grotesk";
  font-size: 16px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #0a0a0a;
  white-space: nowrap;
  padding: 12px 18px;
  border-radius: 8px;
  opacity: 1;
  background: #93e63f;
  margin-top: 12px;
  @media (max-width: 1024px) {
    font-size: 14px;
    margin-top: 10px;
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
  const [StakingMiningModalState, setStakingMiningModalState] = useState(false);
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
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.NFTManage, contractAddress?.USDTBSC);
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
      <HomeBox>
        <All_Data>
          {width > 768 && <Title>All Data</Title>}
          <All_Data_Content>
            <All_Data_Content_Left>
              <VideoBox>
                <video autoPlay loop muted playsInline>
                  <source src={nodeVideo1} type="video/mp4" />
                </video>
              </VideoBox>
            </All_Data_Content_Left>
            {!(width > 768) && <Title>All Data</Title>}

            <All_Data_Content_Right>
              <All_Items>
                <div>
                  {thousandsSeparator(AllData?.totalOutput ?? "-") ?? "-"}
                  <div>Total Output</div>
                </div>
                <div>
                  {thousandsSeparator(AllData?.totalBurn ?? "-") ?? "-"}
                  <div>Total Destruction</div>
                </div>
                <div>
                  {thousandsSeparator(AllData?.totalPledge ?? "-") ?? "-"}
                  <div>Total Staking</div>
                </div>
                <div>
                  {AllData?.nextHalvedTime?.split(" ")[0] ?? "-"}
                  <div>Next Reduction</div>
                </div>
              </All_Items>
            </All_Data_Content_Right>
          </All_Data_Content>
        </All_Data>
        <Personal_Data>
          <Title>
            Personal Data
            {width > 768 ? (
              <div>
                Unclaimed Revenue{" "}
                <div>
                  {DrawData ?? "-"}
                  <Withdrawn_Btn
                    onClick={() => {
                      if (Number(DrawData || 0) > 0) {
                        getReward(() => {}, "Stake");
                      }
                    }}
                  >
                    Withdrawn
                  </Withdrawn_Btn>
                </div>
              </div>
            ) : (
              <Mobile_Box>
                <div className="Mobile_Box_Left">
                  Unclaimed Revenue <div>{DrawData ?? "-"}</div>
                </div>
                <Withdrawn_Btn
                  onClick={() => {
                    if (Number(DrawData || 0) > 0) {
                      getReward(() => {}, "Stake");
                    }
                  }}
                >
                  Withdrawn
                </Withdrawn_Btn>
              </Mobile_Box>
            )}
          </Title>
          <Personal_Data_Content>
            <Personal_Items>
              <Personal_Item>
                <div>
                  {thousandsSeparator(PersonData?.mineTotalEarn ?? "-")}
                  <div>Mining Revenue</div>
                </div>
              </Personal_Item>
              <Personal_Item>
                <div>
                  {thousandsSeparator(PersonData?.refereeTotalEarn ?? "-")}
                  <div>Referral Revenue</div>
                  <CheckBtn
                    onClick={() => {
                      setReferListStateModal(true);
                    }}
                  >
                    Check&gt;&gt;
                  </CheckBtn>
                </div>
              </Personal_Item>
              <Personal_Item>
                <div>
                  {thousandsSeparator(PersonData?.treatMineAINode ?? "-")} AI
                  Nodes
                  <div>Unmined AI Node</div>
                  <Btn
                    onClick={() => {
                      setModalType(2);
                      setNodeMintModalState(true);
                    }}
                  >
                    Staking Mining
                  </Btn>
                </div>
              </Personal_Item>
              <Personal_Item>
                <div>
                  {thousandsSeparator(PersonData?.alreadyMineAINode ?? "-")} AI
                  Nodes
                  <div>Mined AI Node</div>
                  <Btn
                    onClick={() => {
                      setModalType(1);
                      setNodeMintModalState(true);
                    }}
                  >
                    Release
                  </Btn>
                </div>
              </Personal_Item>
              {
                // Number(PersonData?.alreadyBrightAINode ?? 0) > 0 ? (
                //   <Personal_Item>
                //     <div>
                //       Illuminated{" "}
                //       {thousandsSeparator(PersonData?.alreadyBrightAINode ?? "-")}{" "}
                //       AI Nodes
                //       <div>NFT light up edge node</div>
                //       <Btn
                //         onClick={() => {
                //           setModalType(3);
                //           setNodeMintModalState(true);
                //         }}
                //       >
                //         Cancel
                //       </Btn>
                //     </div>
                //   </Personal_Item>
                // ) : (
                <Personal_Item>
                  <div>
                    Unlit
                    <div>NFT light up edge node</div>
                    <Btn
                      onClick={() => {
                        setLightUpNodeModalState(true);
                      }}
                    >
                      Light
                    </Btn>
                  </div>
                </Personal_Item>
                // )
              }
              <Personal_Item>
                <div>
                  {thousandsSeparator(PersonData?.nftPower ?? "-")} T
                  <div>NFT Computing Power</div>
                </div>
              </Personal_Item>
              <Personal_Item>
                <div>
                  {thousandsSeparator(PersonData?.aiNodeMineEarn ?? "-")}
                  <div>AI Node Mining Revenue</div>
                  <CheckBtn
                    onClick={() => {
                      setRecommendedOuputModalState(true);
                    }}
                  >
                    Check&gt;&gt;
                  </CheckBtn>
                </div>
              </Personal_Item>
              <Personal_Item>
                <div>
                  {thousandsSeparator(PersonData?.uacPledgeNum ?? "-")} Edge
                  Node
                  <div>UAC Staking</div>
                  <Btn
                    onClick={() => {
                      setRevokeNodeModalState(true);
                    }}
                  >
                    Release
                  </Btn>
                </div>
              </Personal_Item>
              <Personal_Item>
                <div>
                  {thousandsSeparator(PersonData?.edgeMineNode ?? "-")} Edge
                  Nodes
                  <div>Mining Edge Node</div>
                  <Btn
                    onClick={() => {
                      setStakingMiningModalState(true);
                    }}
                  >
                    Staking Mining
                  </Btn>
                </div>
              </Personal_Item>
              <Personal_Item>
                <div>
                  {thousandsSeparator(PersonData?.edgeNodeMineEarn ?? "-")}
                  <div>Edge Node Mining Revenue</div>
                  <CheckBtn
                    onClick={() => {
                      setEdgeNodeModalState(true);
                    }}
                  >
                    Check&gt;&gt;
                  </CheckBtn>
                </div>
              </Personal_Item>
            </Personal_Items>
          </Personal_Data_Content>
        </Personal_Data>
      </HomeBox>

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

      <StakingMiningModal
        ShowTipModal={StakingMiningModalState}
        Tip={Tip}
        close={() => {
          setStakingMiningModalState(false);
        }}
        allTipFun={allTipFun}
      />
    </HomeContainerBox>
  );
}
