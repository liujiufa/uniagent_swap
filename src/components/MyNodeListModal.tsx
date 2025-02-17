import styled, { keyframes } from "styled-components";
import loadingIcon from "../assets/image/loadingIcon.svg";
import { FlexBox, FlexCCBox, FlexSBCBox } from "./FlexBox";
import { Modal, Pagination, PaginationProps } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import closeIcon from "../assets/image/closeIcon.svg";
import leftIcon from "../assets/image/Home/leftIcon.svg";
import rightIcon from "../assets/image/Home/rightIcon.svg";
import selectedIcon from "../assets/image/Home/selectedIcon.svg";
import MyNode from "../assets/image/Home/MyNode.png";
import { useSelector } from "react-redux";
import { getAiNodeList, getMyNft } from "../API";
import { useViewport } from "./viewportContext";
import { contractAddress } from "../config";
import { Contracts } from "../web3";
import { addMessage, showLoding } from "../utils/tool";
import { useNoGas } from "../hooks/useNoGas";
import { useAppKitAccount } from "@reown/appkit/react";

const AllModal = styled(Modal)`
  z-index: 10000;
  .ant-modal-content {
    overflow: hidden;
    border-radius: 12px;
    opacity: 1;
    background: #0a0a0a;
    box-sizing: border-box;
    border: 1px solid #F4C134;
    .ant-modal-body {
      position: relative;
      padding: 0px;
    }
  }
  @media (max-width: 1200px) {
    .ant-modal-content {
      .ant-modal-body {
        /* padding: 30px 32px; */
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
`;

const ModalContainer_Content = styled.div`
  width: 100%;
  margin-top: 27px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1200px) {
    margin-top: 24px;
  }
  @media (max-width: 768px) {
    margin-top: 15px;
  }
`;
export const PaginationContainer = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 47px;
  .ant-pagination {
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    .ant-pagination-prev,
    .ant-pagination-next {
      display: flex;
      align-items: center;
      a {
        color: #fff;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal; /* 100% */
      }
    }
    .ant-pagination-disabled {
      a {
        opacity: 0.5;
      }
    }
    .ant-pagination-item,
    .ant-pagination-jump-next {
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      /* border: none; */
      border-radius: 0.25rem;
      border: 1px solid rgba(255, 255, 255, 0.4);
      background: #1b1b1b;
      a {
        font-family: "Space Grotesk";
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
        text-align: center;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #999999;
      }
    }
    .ant-pagination-item-active {
      border-radius: 2px;
      opacity: 1;
      background: #80c639;
      a,
      span {
        font-family: "Space Grotesk";
        font-size: 12px;
        font-weight: normal;
        line-height: 16px;
        text-align: center;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #000000;
      }
    }
    .ant-pagination-jump-next
      .ant-pagination-item-container
      .ant-pagination-item-ellipsis,
    .ant-pagination-jump-prev
      .ant-pagination-item-container
      .ant-pagination-item-ellipsis {
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      font-family: "CKTKingkong";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      text-transform: uppercase;
    }

    .ant-pagination-options-quick-jumper {
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      font-family: "CKTKingkong";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;

      input {
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        background: #1b1b1b;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
  .ant-select {
    display: none;
  }
  @media (max-width: 768px) {
    margin-top: 18px;
    .ant-pagination-item,
    .ant-pagination-total-text {
      height: 26px;
      a {
        padding: 0px 4px;
      }
    }
    .ant-pagination-jump-next,
    .ant-pagination-jump-prev,
    .ant-pagination-next,
    .ant-pagination-prev {
      height: 26px;
    }
  }
`;
const NFTItems = styled(FlexBox)`
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  padding: 0px 39px;
  max-height: 500px;
  overflow: auto;

  &::-webkit-scrollbar-thumb {
    opacity: 1;
    background: #191919;
    border-radius: 10px;
  }
  &::-webkit-scrollbar {
    width: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }
  > div {
    /* flex: 1; */
    width: 100%;
    max-width: 30.5%;
  }
  @media (max-width: 1200px) {
    > div {
      max-width: 48%;
    }
  }
  @media (max-width: 768px) {
    padding: 0px 16px;
    > div {
      max-width: 48%;
    }
  }
`;
const NFTItem = styled.div<{ isUndoLight: boolean }>`
  border-radius: 4px;
  opacity: 1;
  background: #0f0f0f;
  border: 1px solid #232323;
  margin-bottom: 24px;
  > img {
    width: 100%;
  }
  > div {
    padding: ${({ isUndoLight }) => (isUndoLight ? "10px 10px 2px" : "10px")};
    font-family: "Space Grotesk";
    font-size: 12px;
    font-weight: normal;
    line-height: 16px;
    text-align: left;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      margin-right: 0;
    }
    &:nth-child(3) {
      padding: 0px 10px 10px;
    }
  }
  @media (max-width: 1200px) {
    margin-bottom: 20px;
  }
  @media (max-width: 768px) {
    margin-bottom: 4%;
  }
`;
const ModalContainer_SubTitle = styled.div`
  width: 100%;
  font-family: "Space Grotesk";
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  text-align: left;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #999999;
  margin-bottom: 18px;
  padding: 0px 39px;
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 0px 16px;
    margin-bottom: 15px;
  }
`;
const Modal_Footer = styled(FlexSBCBox)`
  width: 100%;
  padding: 24px 44px;
  opacity: 1;
  background: #191919;
  @media (max-width: 768px) {
    display: block;
    padding: 16px 15px;
  }
`;
const Modal_Footer_Left = styled(FlexSBCBox)`
  font-family: "Space Grotesk";
  font-size: 18px;
  font-weight: normal;
  line-height: 16px;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
const Select_All_Box = styled(FlexCCBox)`
  cursor: pointer;
  > div {
    width: 19px;
    height: 19px;
    border-radius: 2px;
    opacity: 1;
    box-sizing: border-box;
    border: 1px solid #666666;
    margin-right: 10px;
  }
  .active {
    border-radius: 2px;
    opacity: 1;
    background: #F4C134;
  }
`;
const Select_All_Box1 = styled(FlexCCBox)`
  cursor: pointer;
  > div {
    width: 19px;
    height: 19px;
    border-radius: 2px;
    opacity: 1;
    box-sizing: border-box;
    border: 1px solid #666666;
  }
  .active {
    border-radius: 2px;
    opacity: 1;
    background: #F4C134;
  }
`;
const Selected_Box = styled(FlexCCBox)`
  margin-left: 40px;
  font-family: "Space Grotesk";
  font-size: 18px;
  font-weight: normal;
  line-height: 16px;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  /* Selected */
  color: #999999;

  span {
    font-family: "Space Grotesk";
    font-size: 18px;
    font-weight: normal;
    line-height: 16px;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    /* 5 AI Nodes */
    color: #ffffff;
    margin-left: 5px;
  }
  @media (max-width: 768px) {
    flex: 1;
    justify-content: flex-end;
    font-size: 16px;
    span {
      font-size: 16px;
    }
  }
`;
const Modal_Footer_Right = styled(FlexSBCBox)`
  @media (max-width: 768px) {
    flex: 1;
    margin-top: 15px;
  }
`;
const Staking_Btn = styled(FlexCCBox)`
  border-radius: 8px;
  opacity: 1;
  background: #F4C134;
  font-family: "Space Grotesk";
  font-size: 16px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #0a0a0a;
  padding: 12px 18px;
  @media (max-width: 768px) {
    flex: 1;
    font-size: 14px;
  }
`;

let NodeInter: any = null;
export default function ModalContent(props: any) {
  const { t } = useTranslation();
  const {
    address: web3ModalAccount,
    isConnected,
  } = useAppKitAccount();
  const { width } = useViewport();
  const [PageNum, setPageNum] = useState(1);
  const [RecordList3, setRecordList3] = useState<any>([]);
  const [SelectedList, setSelectedList] = useState<any>([]);
  const [IsApproved, setIsApproved] = useState<any>(false);
  const { isNoGasFun } = useNoGas();

  const token = useSelector((state: any) => state?.token);
  const onChange: PaginationProps["onChange"] = (page) => {
    console.log(page);
    setPageNum(page);
  };
  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return (
        <FlexCCBox style={{ width: "100%" }}>
          <img src={leftIcon} alt="" />
        </FlexCCBox>
      );
    }
    if (type === "next") {
      return (
        <FlexCCBox style={{ width: "100%" }}>
          <img src={rightIcon} alt="" />
        </FlexCCBox>
      );
    }
    return originalElement;
  };
  // 1=挖矿节点 2=未挖矿节点
  const modalText = {
    1: {
      title: "AI Nodes De-mining",
      subtitle: "AI nodes mining",
      btn: "Unlock AI Node Mining",
    },
    2: {
      title: "AI Node Mining",
      subtitle: "Unmined AI Nodes",
      btn: "Staking AI Node Mining",
    },

    3: {
      title: "Undo the lighting of edge nodes",
      subtitle: "AI node has lit up edge nodes",
      btn: "Undo edge node highlight",
    },
  };

  function fillArrayToMultipleOfFour(arr: any, num: number) {
    // 计算需要填充的元素数量
    const fillCount = (3 - (arr.length % num)) % num; // 使用% 4确保当数组长度已经是4的倍数时不添加额外元素
    // 创建一个新数组，长度等于原数组加上需要填充的元素数量
    const newArr = new Array(arr.length + fillCount).fill({});
    // 将原数组的元素复制到新数组中
    for (let i = 0; i < arr.length; i++) {
      newArr[i] = arr[i];
    }
    return newArr;
  }
  const getRecordFun = () => {
    NodeInter = setInterval(() => {
      if (!!token) {
        // getMyNft({ pageNum: PageNum, pageSize: width >= 1200 ? 10 : 6 }).then(
        //   (res: any) => {
        //     if (res.code !== 200) return;
        //     let Arr: any =
        //       width > 1200
        //         ? res?.data?.length % 3 !== 0
        //           ? fillArrayToMultipleOfFour(res?.data, 3)
        //           : res?.data
        //         : res?.data?.length % 2 !== 0
        //         ? fillArrayToMultipleOfFour(res?.data, 2)
        //         : res?.data;
        //     res.data = Arr;
        //     setRecordList3(res?.data || []);
        //   }
        // );
      }
    }, 8000);
  };

  const openFun = (type: any) => {
    let Arr: any = SelectedList;
    if (Arr?.some((item: any) => Number(item) === Number(type))) {
      Arr = Arr?.filter((item: any) => Number(item) !== Number(type));
    } else {
      Arr = [...Arr, type];
    }
    setSelectedList(Arr);
    console.log(Arr, "Arr");
  };
  const selectAllFun = (Arr: any) => {
    let Arr1: any = [];
    if (Arr?.length > 0 && SelectedList?.length < Arr?.length) {
      for (let item of Arr) {
        Arr1?.push(item?.tokenId);
      }
      setSelectedList(Arr1);
    } else {
      setSelectedList([]);
    }
  };
  const ManageFun = async () => {
    if (!token) return;
    if (Number(props?.ModalType) === 2) {
      let res: any = null;
      try {
        if (!!(await isNoGasFun())) return;
        props.close();
        props?.allTipFun(
          2,
          t("Stake 5 AI Nodes for Mining", { num: SelectedList?.length })
        );
        res = await Contracts.example?.stakeAiNodes(
          web3ModalAccount as string,
          SelectedList
        );
        if (!!res?.status) {
          props?.allTipFun(4);
          props?.allTipFun(
            3,
            t("AI node staking mining successful"),
            res?.transactionHash
          );
        } else if (res?.status === false) {
          props?.allTipFun(4);
          return addMessage(t("failed"));
        }
      } catch (error: any) {
        if (error?.code === 4001) {
          props?.allTipFun(4);
          return addMessage(t("failed"));
        }
      }
    }
  };
  const Release = async () => {
    if (!token) return;
    let res: any = null;
    try {
      if (!!(await isNoGasFun())) return;
      props.close();
      props?.allTipFun(2, t("AI node is stopping mining"));
      res = await Contracts.example?.unStakeAiNodes(
        web3ModalAccount as string,
        SelectedList
      );
      if (!!res?.status) {
        props?.allTipFun(4);
        props?.allTipFun(
          3,
          t("AI node is stopping mining"),
          res?.transactionHash
        );
      } else if (res?.status === false) {
        props?.allTipFun(4);
        return addMessage(t("failed"));
      }
    } catch (error: any) {
      if (error?.code === 4001) {
        props?.allTipFun(4);
        return addMessage(t("failed"));
      }
    }
  };

  // NFT授权
  function ApproveEvolveFun() {
    if (!IsApproved) {
      if (!web3ModalAccount) {
        return addMessage(t("Please Connect wallet"));
      }
      // showLoding(true);
      props.close();
      props?.allTipFun(
        1,
        t("Approved 5 AI Nodes", { num: SelectedList?.length })
      );
      Contracts.example
        .setApprovalForAll(
          web3ModalAccount as string,
          contractAddress.Stake,
          true
        )
        .then(() => {
          setIsApproved(true);
          ManageFun();
        })
        .catch((error: any) => {
          if (error?.code === 4001) return props?.allTipFun(4);
        });
    }
  }

  useEffect(() => {
    if (!!token) {
      if (Number(props?.ModalType) === 3) {
        // getMyNft({ pageNum: PageNum, pageSize: width >= 1200 ? 10 : 6 }).then(
        //   (res: any) => {
        //     if (res.code !== 200) return;
        //     let Arr: any =
        //       width > 1200
        //         ? res?.data?.length % 3 !== 0
        //           ? fillArrayToMultipleOfFour(res?.data, 3)
        //           : res?.data
        //         : res?.data?.length % 2 !== 0
        //         ? fillArrayToMultipleOfFour(res?.data, 2)
        //         : res?.data;
        //     res.data = Arr;
        //     setRecordList3(res?.data || []);
        //   }
        // );
      } else {
        getAiNodeList(props?.ModalType).then((res: any) => {
          if (res.code !== 200) return;
          setRecordList3(res?.data || []);
        });
      }
      getRecordFun();
    }
    setSelectedList([]);
    return () => {
      clearInterval(NodeInter);
    };
  }, [token, props?.ShowTipModal, props?.ModalType]);

  useEffect(() => {
    if (web3ModalAccount) {
      Contracts.example
        ?.isApprovedForAll(web3ModalAccount, contractAddress.Stake)
        .then((res: boolean) => {
          setIsApproved(res);
        });
    }
  }, [web3ModalAccount, props?.ShowTipModal]);

  return (
    <AllModal
      visible={props?.ShowTipModal}
      className="Modal"
      centered
      width={"656px"}
      closable={false}
      footer={null}
    >
      <ModalContainer>
        <ModalContainer_Title>
          {t(modalText[props?.ModalType]?.title)}
          <ModalContainer_Close>
            {" "}
            <img
              src={closeIcon}
              alt=""
              onClick={() => {
                props.close();
              }}
            />
          </ModalContainer_Close>
        </ModalContainer_Title>
        <ModalContainer_Content>
          <ModalContainer_SubTitle>
            {t(modalText[props?.ModalType]?.subtitle)}
          </ModalContainer_SubTitle>

          <NFTItems>
            {(width > 1200
              ? RecordList3?.length % 3 !== 0
                ? fillArrayToMultipleOfFour(RecordList3, 3)
                : RecordList3
              : RecordList3?.length % 2 !== 0
              ? fillArrayToMultipleOfFour(RecordList3, 2)
              : RecordList3
            )?.map((item: any, index: any) =>
              !!item?.tokenId ? (
                <NFTItem
                  key={index}
                  isUndoLight={Number(props?.ModalType) === 3}
                >
                  <img src={!!item?.imgUrl ? item?.imgUrl : MyNode} alt="" />
                  <div>
                    #{item?.tokenId}{" "}
                    <Select_All_Box1
                      onClick={() => {
                        // debugger;
                        openFun(item?.tokenId + "");
                      }}
                    >
                      {SelectedList?.some(
                        (item1: any) => Number(item1) === Number(item?.tokenId)
                      ) ? (
                        <div className="active">
                          <img src={selectedIcon} alt="" />
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </Select_All_Box1>
                  </div>
                  {Number(props?.ModalType) === 3 && <div>Pledged 600 UAC</div>}
                </NFTItem>
              ) : (
                <div></div>
              )
            )}
          </NFTItems>

          <Modal_Footer>
            <Modal_Footer_Left>
              <Select_All_Box
                onClick={() => {
                  selectAllFun(RecordList3);
                }}
              >
                {SelectedList?.length === RecordList3?.length ? (
                  <div className="active">
                    <img src={selectedIcon} alt="" />
                  </div>
                ) : (
                  <div></div>
                )}
              </Select_All_Box>
              Select All
              <Selected_Box>
                Selected <span>{SelectedList?.length} AI Nodes</span>
              </Selected_Box>
            </Modal_Footer_Left>
            <Modal_Footer_Right>
              <Staking_Btn
                onClick={() => {
                  // 1=挖矿节点 2=未挖矿节点
                  if (SelectedList?.length > 0) {
                    if (Number(props?.ModalType) === 2) {
                      if (!!IsApproved) {
                        ManageFun();
                      } else {
                        ApproveEvolveFun();
                      }
                    } else if (Number(props?.ModalType) === 1) {
                      Release();
                    }
                  }
                }}
              >
                {t(modalText[props?.ModalType]?.btn)}
              </Staking_Btn>
            </Modal_Footer_Right>
          </Modal_Footer>
        </ModalContainer_Content>
      </ModalContainer>
    </AllModal>
  );
}
