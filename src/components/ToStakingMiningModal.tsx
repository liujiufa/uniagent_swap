import styled, { keyframes } from "styled-components";
import loadingIcon from "../assets/image/loadingIcon.svg";
import { FlexBox, FlexCCBox, FlexSBCBox } from "./FlexBox";
import { Modal, Pagination, PaginationProps } from "antd";
import { useEffect, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import closeIcon from "../assets/image/closeIcon.svg";
import leftIcon from "../assets/image/Home/leftIcon.svg";
import rightIcon from "../assets/image/Home/rightIcon.svg";
import selectedIcon from "../assets/image/Home/selectedIcon.svg";
import MyNode from "../assets/image/Home/MyNode.png";
import { useSelector } from "react-redux";
import { getMyNft } from "../API";
import { useViewport } from "./viewportContext";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Contracts } from "../web3";
import { AddrHandle, EthertoWei, addMessage } from "../utils/tool";
import { useNoGas } from "../hooks/useNoGas";
import roundIcon from "../assets/image/Swap/roundIcon.svg";
import React from "react";

const AllModal = styled(Modal)`
  z-index: 10000;
  .ant-modal-content {
    overflow: hidden;
    border-radius: 12px;
    opacity: 1;
    background: #0a0a0a;
    box-sizing: border-box;
    border: 1px solid #557930;
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
  @media (max-width: 768px) {
    padding: 39px 16px 0px;
    font-size: 18px;
  }
`;

const ModalContainer_Content = styled.div`
  width: 100%;
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 31px 32px;
  @media (max-width: 1200px) {
    margin-top: 24px;
  }
  @media (max-width: 768px) {
    padding: 0 16px 40px;
  }
`;
const ChainItems = styled.div`
  width: 100%;
  margin-bottom: 40px;
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;
const ChainItem = styled(FlexCCBox)`
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  opacity: 1;
  box-sizing: border-box;
  border: 1px solid #232323;
  font-family: Space Grotesk;
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  > img {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 16px;
    > img {
      width: 24px;
      height: 24px;
      margin-right: 6px;
    }
  }
`;
const ItemTitle = styled.div`
  margin-bottom: 10px;
  width: 100%;
  font-family: Space Grotesk;
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #999999;
`;
const ChainItemsBox = styled(FlexSBCBox)`
  overflow: auto;
  padding-bottom: 6px;
  > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .active {
      border-radius: 8px;
      opacity: 1;
      box-sizing: border-box;
      border: 1px solid #93e63f;
    }
    @media (max-width: 375px) {
      min-width: 345px;
    }
  }
`;
const Tokens = styled.div`
  width: 100%;
`;
const TokensBox = styled.div`
  max-height: 380px;
`;
const TokensItem = styled(FlexSBCBox)`
  cursor: pointer;
  > div {
    display: flex;
    align-items: center;
    font-family: Space Grotesk;
    font-size: 24px;
    font-weight: bold;
    line-height: normal;
    text-align: right;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    > img {
      margin-right: 12px;
    }
    .coin_info {
      font-family: Space Grotesk;
      font-size: 24px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
      text-align: left;

      > div {
        margin-top: 2px;
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
  @media (max-width: 768px) {
    > div {
      font-size: 18px;
      > img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
      .coin_info {
        font-size: 18px;
        > div {
        }
      }
    }
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
const NFTItem_Top = styled(FlexSBCBox)`
  > div {
    font-family: "Space Grotesk";
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
    > div {
      margin-top: 4px;
      font-family: "Space Grotesk";
      font-size: 18px;
      font-weight: bold;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
    &:nth-child(1) {
      flex: auto;
      max-width: 150px;
    }
    &:nth-child(2) {
      flex: auto;
      max-width: 120px;
    }
    &:nth-child(3) {
      flex: auto;
      max-width: 100px;
    }
  }
`;

const HomeBox_Left_Price_Top = styled(FlexSBCBox)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    font-family: "Space Grotesk";
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
  }
  @media (max-width: 768px) {
    > div {
      font-size: 14px;
    }
  }
`;
const HomeBox_Left_Price_Bottom = styled(FlexSBCBox)`
  width: 100%;
  margin: 16px auto 0px;
  > div {
    display: flex;
    align-items: flex-end;
    &:first-child {
      font-family: "Space Grotesk";
      font-size: 40px;
      font-weight: normal;
      line-height: 40px;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
      > span {
        margin-left: 6px;
        font-family: "Space Grotesk";
        font-size: 24px;
        font-weight: normal;
        line-height: 28px;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #ffffff;
      }
    }
  }
  @media (max-width: 768px) {
    margin: 10px auto 0px;
    > div {
      &:first-child {
        font-size: 24px;
        font-weight: normal;
        line-height: 24px;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #ffffff;
        > span {
          font-size: 18px;
          line-height: 20px;
        }
      }
    }
  }
`;
const Manage = styled(FlexSBCBox)`
  width: 100%;
  max-width: 300px;
  opacity: 1;
  background: #191919;
  align-items: center !important;
  > div {
    &:first-child,
    &:last-child {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      /* padding: 14.88px; */
      border-radius: 4px;
      opacity: 1;
      background: #181818;
      box-sizing: border-box;
      border: 1px solid #ffffff;
      color: #ffffff;
      font-family: "Space Grotesk";
      font-size: 24px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
      cursor: pointer;
    }
    &:nth-child(2) {
      height: fit-content;
      flex: 1;
      height: 44px;

      display: flex;
      align-items: center;
      justify-content: center;
      input {
        width: 100%;
        background: transparent;
        text-align: center;
        border: none;
        font-family: "Space Grotesk";
        font-size: 24px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #ffffff;
      }
    }
  }

  @media (max-width: 1200px) {
    max-width: 136px;

    > div {
      &:first-child,
      &:last-child {
        width: 30px;
        height: 30px;
        font-size: 14px;
      }
      &:nth-child(2) {
        height: 30px;
        input {
          font-size: 14px;
        }
      }
    }
  }
`;
const NodeInfo = styled.div`
  width: 100%;
  border-radius: 8px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #232323;
  padding: 30px 22px;
  margin-bottom: 14px;
  @media (max-width: 768px) {
    padding: 14px;
  }
`;
const BtnBox = styled.div`
  font-family: "Space Grotesk";
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #999999;
`;
const Btn = styled(FlexCCBox)`
  padding: 12px;
  border-radius: 8px;
  opacity: 1;
  background: #93e63f;
  font-family: "Space Grotesk";
  font-size: 20px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #0a0a0a;
  margin-bottom: 14px;
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 12px;
  }
`;

let NodeInter: any = null;
const ModalContent = React.forwardRef((props: any, ref: any) => {
  const { t } = useTranslation();
  const { width } = useViewport();
  const [PageNum, setPageNum] = useState(1);
  const [RecordList3, setRecordList3] = useState<any>({});
  const [SelectedList, setSelectedList] = useState<any>([]);
  const [ActiveSub, setActiveSub] = useState(1);
  const [Amount, setAmount] = useState(1);
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const token = useSelector((state: any) => state?.token);
  const onChange: PaginationProps["onChange"] = (page) => {
    console.log(page);
    setPageNum(page);
  };
  const [Balance, setBalance] = useState("0");
  const { isNoGasFun } = useNoGas();
  // 当前链
  // useImperativeHandle(
  //   ref,
  //   () => ({
  //     type: LinkType2,
  //   }),
  //   [LinkType2]
  // );

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
  const stakeFun = async (amount: any) => {
    if (Number(Balance) < Number(amount))
      return addMessage(t("Insufficient balance"));
    let res: any = null;
    try {
      if (!!(await isNoGasFun())) return;
      props.close();
      props?.allTipFun(
        2,
        t("Pledge 600 UAC to get 1 edge node", { amount: amount, num: Amount })
      );
      res = await Contracts.example?.stakeEdgeNode(
        web3ModalAccount as string,
        Amount,
        amount
      );
      if (!!res?.status) {
        props?.allTipFun(4);
        props?.allTipFun(
          3,
          t("Edge node staking mining is successful"),
          res?.transactionHash
        );
      } else {
        if (res?.status === false) {
          props?.allTipFun(4);
          return addMessage(t("failed"));
        }
      }
    } catch (error: any) {
      if (error?.code === 4001) {
        props?.allTipFun(4);
        return addMessage(t("failed"));
      }
    }
  };

  useEffect(() => {
    if (!!token) {
      // getMyNft({ pageNum: PageNum, pageSize: width >= 1200 ? 10 : 6 }).then(
      //   (res: any) => {
      //     if (res.code !== 200) return;
      //     let Arr: any =
      //       width > 1200
      //         ? res?.data?.list?.length % 4 !== 0
      //           ? fillArrayToMultipleOfFour(res?.data?.list, 4)
      //           : res?.data?.list
      //         : res?.data?.list?.length % 2 !== 0
      //         ? fillArrayToMultipleOfFour(res?.data?.list, 2)
      //         : res?.data?.list;
      //     res.data.list = Arr;
      //     setRecordList3(res?.data || {});
      //   }
      // );
    } else {
      // setRecordList3({});
    }
    return () => {
      clearInterval(NodeInter);
    };
  }, [token, PageNum, props?.ShowTipModal]);

  useEffect(() => {
    if (web3ModalAccount) {
      Contracts.example?.getBalance(web3ModalAccount).then((res: any) => {
        setBalance(EthertoWei(res ?? "0"));
      });
    }
  }, [web3ModalAccount, props?.ShowTipModal]);
  return (
    <AllModal
      visible={props?.ShowTipModal}
      className="Modal"
      centered
      width={"483px"}
      closable={false}
      footer={null}
    >
      <ModalContainer>
        <ModalContainer_Title>
          {t("Select Send Tokens")}
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
          <ChainItems>
            <ItemTitle>Chain</ItemTitle>
            <ChainItemsBox>
              <div>
                {props?.ChainArr?.map((item: any, index: any) => (
                  <ChainItem
                    className={
                      String(props?.LinkType2) === String(item?.ChainName)
                        ? "active"
                        : ""
                    }
                    key={index}
                    onClick={() => {
                      props?.SelectTypeFun("to", item?.ChainName);
                      // setLinkType1(
                      //   props?.ChainArr?.filter(
                      //     (item1: any) =>
                      //       String(item1?.ChainName) !== String(item?.ChainName)
                      //   )[
                      //     props?.ChainArr?.filter(
                      //       (item1: any) =>
                      //         String(item1?.ChainName) !== String(item?.ChainName)
                      //     )?.length - 1
                      //   ]
                      // );
                    }}
                  >
                    <img src={roundIcon} alt="" />
                    {item?.ChainName}
                  </ChainItem>
                ))}
              </div>
            </ChainItemsBox>
          </ChainItems>
          <Tokens>
            <ItemTitle>
              {" "}
              <ItemTitle>Tokens</ItemTitle>
            </ItemTitle>
            <TokensBox>
              {props?.ChainArr?.find(
                (item: any) =>
                  String(item?.ChainName) === String(props?.LinkType2)
              )?.tokens?.map((item: any, index: any) => (
                <TokensItem
                  key={index}
                  onClick={() => {
                    props?.close();
                  }}
                >
                  <div>
                    <img src={roundIcon} alt="" />
                    <div className="coin_info">
                      {item?.tokenName}
                      <div>{AddrHandle(item?.tokenAddress, 6, 4)}</div>
                    </div>
                  </div>
                  <div>0</div>
                </TokensItem>
              ))}
            </TokensBox>
          </Tokens>
        </ModalContainer_Content>
      </ModalContainer>
    </AllModal>
  );
});
export default ModalContent;
