import styled, { keyframes } from "styled-components";
import loadingIcon from "../assets/image/loadingIcon.svg";
import { FlexBox, FlexCCBox, FlexSBCBox } from "./FlexBox";
import { Modal, Pagination, PaginationProps } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import closeIcon from "../assets/image/closeIcon.svg";
import leftIcon from "../assets/image/Home/leftIcon.svg";
import rightIcon from "../assets/image/Home/rightIcon.svg";
import { useSelector } from "react-redux";
import { getEdgeNodeEarnList, getMyNft, getRefereeList } from "../API";
import { AddrHandle, dateFormat } from "../utils/tool";

const AllModal = styled(Modal)`
  z-index: 10000;
  .ant-modal-content {
    overflow: hidden;
    border-radius: 12px;
    opacity: 1;
    background: #0a0a0a;
    box-sizing: border-box;
    border: 1px solid #FF8B36;
    .ant-modal-body {
      position: relative;
      padding: 39px;
    }
  }
  @media (max-width: 1200px) {
    .ant-modal-content {
      .ant-modal-body {
        padding: 30px 18px;
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
`;
const Table = styled.div`
  width: 100%;
  border-radius: 4px;
  opacity: 1;
  box-sizing: border-box;
  border: 1px solid #c2c2c2;
`;
const Table_Title = styled.div`
  opacity: 1;
  background: #dfdfdf;
  > div {
    > div {
      font-family: "Space Grotesk";
      font-size: 12px;
      font-weight: normal;
      line-height: 16px;
      text-align: center;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #3d3d3d;
    }
  }
  @media (max-width: 1200px) {
    > div {
      > div {
        line-height: 12px;
      }
    }
  }
`;

const Items = styled(FlexBox)`
  justify-content: space-between;
  border-bottom: 1px solid #c2c2c2;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 15px;
    border-right: 1px solid #c2c2c2;
    &:first-child {
      flex: auto;
      max-width: 108px;
    }
    &:last-child {
      border: none;
    }
  }
  @media (max-width: 1200px) {
    > div {
      padding: 10px 0px;
      &:first-child {
        max-width: 58px;
      }
    }
  }
`;
const Table_Content = styled.div`
  opacity: 1;
  background: #ffffff;
  > div {
    > div {
      text-align: center;
    }
    &:last-child {
      border: none;
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

export default function ModalContent(props: any) {
  const { t } = useTranslation();
  const token = useSelector((state: any) => state?.token);
  const [PageNum, setPageNum] = useState(1);
  const [RecordList3, setRecordList3] = useState<any>({});
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

  useEffect(() => {
    if (!!token) {
      getEdgeNodeEarnList({ pageNum: PageNum, pageSize: 10 }).then(
        (res: any) => {
          if (res.code !== 200) return;
          setRecordList3(res?.data || {});
        }
      );
    } else {
      setRecordList3({});
    }
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
          {t("Recommended list")}
          <ModalContainer_Close>
            {" "}
            <img
              src={closeIcon}
              alt=""
              onClick={() => {
                // setBindModal(false);
                props?.close();
              }}
            />
          </ModalContainer_Close>
        </ModalContainer_Title>
        <ModalContainer_Content>
          <Table>
            <Table_Title>
              <Items>
                <div>No</div>
                <div>Mining edge nodes</div>
                <div>Output quantity</div>
                <div>Time</div>
              </Items>
            </Table_Title>
            <Table_Content>
              {RecordList3?.list?.map((item: any, index: any) => (
                <Items key={index}>
                  <div>{Number(index) + (Number(PageNum) - 1) * 10 + 1}</div>
                  <div>{item?.edgeNodeNum}</div>
                  <div>{item?.outputNum} UAC</div>
                  <div>
                    {dateFormat("YYYY-mm-dd HH:MM:SS", new Date(item?.time))}
                  </div>
                </Items>
              ))}
            </Table_Content>
          </Table>

          <PaginationContainer>
            <Pagination
              current={PageNum}
              pageSize={10}
              onChange={onChange}
              total={RecordList3?.total}
              showQuickJumper
              defaultCurrent={1}
              itemRender={itemRender}
            />
          </PaginationContainer>
        </ModalContainer_Content>
      </ModalContainer>
    </AllModal>
  );
}
