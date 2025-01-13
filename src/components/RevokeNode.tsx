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
import { getMyNft } from "../API";
import { useViewport } from "./viewportContext";

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
    padding: 39px 16px 0px;
  }
`;

const ModalContainer_Content = styled.div`
  width: 100%;
  margin-top: 27px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1200px) {
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
  padding: 0px 35px;
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
  }
  @media (max-width: 1200px) {
    padding: 0 16px;
    > div {
    }
  }
`;
const NFTItem = styled.div`
  border-radius: 8px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #232323;
  margin-bottom: 20px;
  padding: 15px 18px;
  > div {
  }
  @media (max-width: 768px) {
    padding: 14px;
    margin-bottom: 8px;
  }
`;
const Modal_Footer = styled(FlexSBCBox)`
  width: 100%;
  padding: 24px 35px;
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
    background: #93e63f;
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
    background: #93e63f;
  }
`;
const Selected_Box = styled(FlexCCBox)`
  margin-left: 38px;
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
  background: #93e63f;
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
const ModalContainer_SubTitles = styled(FlexBox)`
  width: 100%;
  padding: 0px 35px;
  margin-bottom: 20px;
  > div {
    font-family: "Space Grotesk";
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
    margin-right: 27px;
    padding-bottom: 5px;
  }
  .active {
    font-family: "Space Grotesk";
    font-size: 18px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #93e63f;
    opacity: 1;
    border-bottom: 2px solid #93e63f;
  }
  @media (max-width: 768px) {
    padding: 0px 16px;
    margin-bottom: 15px;
    > div {
      font-size: 14px;
      line-height: 14px;
      margin-right: 24px;
    }
    .active {
      font-size: 14px;
      line-height: 14px;
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
  @media (max-width: 768px) {
    > div {
      font-size: 12px;
      line-height: 12px;
      padding-right: 3px;
      > div {
        font-size: 14px;
      }
    }
  }
`;
const NFTItem_Bottom = styled(NFTItem_Top)`
  margin-top: 20px;
  > div {
    .selectBox {
      display: flex;
      align-items: center;
      font-family: "Space Grotesk";
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #999999;
      > div {
        margin-right: 8px;
      }
    }
  }
  @media (max-width: 768px) {
    margin-top: 15px;
    > div {
      .selectBox {
        > div {
          margin-right: 6px;
        }
      }
    }
  }
`;

let NodeInter: any = null;
export default function ModalContent(props: any) {
  const { t } = useTranslation();
  const { width } = useViewport();
  const [PageNum, setPageNum] = useState(1);
  const [RecordList3, setRecordList3] = useState<any>({});
  const [SelectedList, setSelectedList] = useState<any>([]);
  const [ActiveSub, setActiveSub] = useState(1);

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
        getMyNft({ pageNum: PageNum, pageSize: width >= 1200 ? 10 : 6 }).then(
          (res: any) => {
            if (res.code !== 200) return;
            let Arr: any =
              width > 1200
                ? res?.data?.list?.length % 4 !== 0
                  ? fillArrayToMultipleOfFour(res?.data?.list, 4)
                  : res?.data?.list
                : res?.data?.list?.length % 2 !== 0
                ? fillArrayToMultipleOfFour(res?.data?.list, 2)
                : res?.data?.list;
            res.data.list = Arr;
            setRecordList3(res?.data || {});
          }
        );
      }
    }, 8000);
  };

  const openFun = (type: any) => {
    let Arr: any = SelectedList;
    if (Arr?.some((item: any) => String(item) === String(type))) {
      Arr = Arr?.filter((item: any) => String(item) !== String(type));
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
  useEffect(() => {
    if (!!token) {
      getMyNft({ pageNum: PageNum, pageSize: width >= 1200 ? 10 : 6 }).then(
        (res: any) => {
          if (res.code !== 200) return;
          let Arr: any =
            width > 1200
              ? res?.data?.list?.length % 4 !== 0
                ? fillArrayToMultipleOfFour(res?.data?.list, 4)
                : res?.data?.list
              : res?.data?.list?.length % 2 !== 0
              ? fillArrayToMultipleOfFour(res?.data?.list, 2)
              : res?.data?.list;
          res.data.list = Arr;
          setRecordList3(res?.data || {});
        }
      );
      getRecordFun();
    } else {
      // setRecordList3({});
    }
    return () => {
      clearInterval(NodeInter);
    };
  }, [token, PageNum, props?.ShowTipModal]);
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
          {t("Revoke the illuminated edge nodes")}
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
          <ModalContainer_SubTitles>
            <div
              className={Number(ActiveSub) === 1 ? "active" : ""}
              onClick={() => {
                setActiveSub(1);
              }}
            >
              Staked edge node
            </div>
            <div
              className={Number(ActiveSub) === 2 ? "active" : ""}
              onClick={() => {
                setActiveSub(2);
              }}
            >
              Released edge nodes
            </div>
          </ModalContainer_SubTitles>

          {Number(ActiveSub) === 1 && (
            <NFTItems>
              {[
                { tokenId: "1" },
                { tokenId: "2" },
                { tokenId: "3" },
                { tokenId: "4" },
                { tokenId: "5" },
                { tokenId: "6" },
                { tokenId: "7" },
              ]?.map((item: any, index: any) => (
                <NFTItem key={index}>
                  <NFTItem_Top>
                    <div>
                      Number of edge nodes
                      <div>3</div>
                    </div>
                    <div>
                      Pledge Quantity
                      <div>600 UAC</div>
                    </div>
                    <div>
                      Staking Block
                      <div>214214</div>
                    </div>
                  </NFTItem_Top>
                  <NFTItem_Bottom>
                    <div>
                      Start mining blocks
                      <div>3</div>
                    </div>
                    <div>
                      Mining Status
                      <div>Waiting</div>
                    </div>
                    <div>
                      <div className="selectBox">
                        <Select_All_Box1
                          onClick={() => {
                            // debugger;
                            openFun(item?.tokenId + "");
                          }}
                        >
                          {SelectedList?.some(
                            (item1: any) =>
                              String(item1) === String(item?.tokenId)
                          ) ? (
                            <div className="active">
                              <img src={selectedIcon} alt="" />
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </Select_All_Box1>
                        Select
                      </div>
                    </div>
                  </NFTItem_Bottom>
                </NFTItem>
              ))}
            </NFTItems>
          )}
          {Number(ActiveSub) === 2 && (
            <NFTItems>
              {[
                { tokenId: "1" },
                { tokenId: "2" },
                { tokenId: "3" },
                { tokenId: "4" },
                { tokenId: "5" },
                { tokenId: "6" },
                { tokenId: "7" },
              ]?.map((item: any, index: any) => (
                <NFTItem key={index}>
                  <NFTItem_Top>
                    <div>
                      Number of edge nodes
                      <div>3</div>
                    </div>
                    <div>
                      Pledge Quantity
                      <div>600 UAC</div>
                    </div>
                    <div>
                      Staking Block
                      <div>214214</div>
                    </div>
                  </NFTItem_Top>
                  <NFTItem_Bottom>
                    <div>
                      Start mining blocks
                      <div>244521</div>
                    </div>
                    <div>
                      Unblock
                      <div>244521</div>
                    </div>
                    <div>
                      Mining Status
                      <div>Released</div>
                    </div>
                  </NFTItem_Bottom>
                </NFTItem>
              ))}
            </NFTItems>
          )}

          {Number(ActiveSub) === 1 && (
            <Modal_Footer>
              <Modal_Footer_Left>
                <Select_All_Box
                  onClick={() => {
                    selectAllFun([
                      { tokenId: "1" },
                      { tokenId: "2" },
                      { tokenId: "3" },
                      { tokenId: "4" },
                      { tokenId: "5" },
                      { tokenId: "6" },
                      { tokenId: "7" },
                    ]);
                  }}
                >
                  {SelectedList?.length ===
                  [
                    { tokenId: "1" },
                    { tokenId: "2" },
                    { tokenId: "3" },
                    { tokenId: "4" },
                    { tokenId: "5" },
                    { tokenId: "6" },
                    { tokenId: "7" },
                  ]?.length ? (
                    <div className="active">
                      <img src={selectedIcon} alt="" />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </Select_All_Box>
                Select All
                <Selected_Box>
                  Selected <span>5 AI Nodes</span>
                </Selected_Box>
              </Modal_Footer_Left>
              <Modal_Footer_Right>
                <Staking_Btn>Cancel edge node mining</Staking_Btn>
              </Modal_Footer_Right>
            </Modal_Footer>
          )}
        </ModalContainer_Content>
      </ModalContainer>
    </AllModal>
  );
}
