import styled, { keyframes } from "styled-components";
import copy from "../assets/image/layout/copy.svg";
import goIcon from "../assets/image/layout/goIcon.svg";
import { FlexBox, FlexCCBox, FlexSBCBox } from "./FlexBox";
import { Modal, Pagination, PaginationProps } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import closeIcon from "../assets/image/closeIcon.svg";
import leftIcon from "../assets/image/Home/leftIcon.svg";
import rightIcon from "../assets/image/Home/rightIcon.svg";
import { useSelector } from "react-redux";
import { getMyNft, getRefereeData, getRefereeList } from "../API";
import { AddrHandle, addMessage, dateFormat } from "../utils/tool";
import { useAppKitAccount } from "@reown/appkit/react";
import copyFun from "copy-to-clipboard";

const AllModal = styled(Modal)`
  z-index: 10000;
  max-width: calc(100vw - 30px);
  .ant-modal-content {
    overflow: hidden;
    border-radius: 12px;
    opacity: 1;
    background: #0a0a0a;
    box-sizing: border-box;
    border: 1px solid #685319;
    .ant-modal-body {
      position: relative;
      padding: 38px 32px 32px;
    }
  }
  @media (max-width: 1200px) {
    .ant-modal-content {
      .ant-modal-body {
        padding: 30px 14px;
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

export const ModalContainer_Title_Container = styled(FlexBox)`
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
  justify-content: left;
  font-family: MiSans;
  font-size: 24px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  color: #ffffff;
  @media (max-width: 1200px) {
    font-size: 18px;
  }
`;

const ModalContainer_Content = styled.div`
  width: 100%;
  margin-top: 27px;
  font-family: MiSans;
  font-size: 18px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  color: #ffffff;
  @media (max-width: 1200px) {
    margin-top: 20px;
    font-family: MiSans;
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
  }
`;
const Table = styled.div`
  margin-top: 15px;
  width: 100%;
  border-radius: 4px;
  opacity: 1;
  box-sizing: border-box;
  border: 1px solid #c2c2c2;
  @media (max-width: 1200px) {
    margin-top: 12px;
  }
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
    font-family: MiSans;
    font-size: 12px;
    font-weight: normal;
    line-height: 16px;
    text-align: center;
    letter-spacing: 0em;
    color: #3d3d3d;
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
      padding: 7px 0px;
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
      background: #f4c134;
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
const MyInvitedInfo = styled.div`
  width: 100%;
`;
const MyInvitedInfo_Earns = styled(FlexSBCBox)`
  width: 100%;
  margin: 32px 0px 4px;
  @media (max-width: 1200px) {
    margin: 20px 0px 4px;
  }
`;
const Earn = styled.div`
  font-family: MiSans;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  color: #abb1b9;
`;
const Code = styled.div`
  .codes {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    > div {
      font-family: MiSans;
      font-size: 18px;
      font-weight: normal;
      line-height: normal;
      text-align: center;
      letter-spacing: 0em;
      color: #ffffff;
      padding: 4px 8.5px;
      margin-left: 4px;
      border-radius: 4px;
      opacity: 1;
      background: #181818;
    }
  }
  @media (max-width: 1200px) {
    .code {
      > div {
        font-family: MiSans;
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        text-align: center;
        letter-spacing: 0em;
        color: #ffffff;
        padding: 3px 7px;
        margin-left: 3px;
      }
    }
  }
`;
const Title = styled(FlexBox)`
  width: 100%;
  justify-content: flex-end;
  align-items: center;

  font-family: MiSans;
  font-size: 16px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #999999;
  align-items: center;
  margin-bottom: 10px;
  > img {
    cursor: pointer;
    margin-left: 12px;
  }
  @media (max-width: 1200px) {
    font-family: MiSans;
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    color: #abb1b9;
    > img {
      margin-left: 8px;
    }
  }
`;
const EarnValue = styled(FlexBox)`
  margin-top: 10px;
  align-items: center;
  font-family: Space Grotesk;
  font-size: 30px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  > div {
    font-family: MiSans;
    font-size: 20px;
    font-weight: normal;
    line-height: 20px;
    letter-spacing: 0em;
    color: #ffffff;
    margin: 0px 2px 0px 8px;
  }
  @media (max-width: 1200px) {
    font-family: MiSans;
    font-size: 24px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    color: #ffffff;
    > div {
      font-family: MiSans;
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      color: #ffffff;
      margin: 0px 4px;
    }
    > img {
      width: 16px;
      height: 16px;
    }
  }
`;

const InvitedNum = styled.div`
  font-family: MiSans;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  color: #999999;
`;
const InvitedLink = styled(FlexBox)`
  align-items: center;
  font-family: MiSans;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  color: #ffffff;
  margin: 15px 0px;
  > img {
    cursor: pointer;
    margin-left: 24px;
  }
`;
const InvitedTip = styled.div`
  font-family: Space Grotesk;
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #999999;
`;
const WalletTip = styled.div`
  margin: 20px 0px 16px;
  font-family: MiSans;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #abb1b9;
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
  const { address: web3ModalAccount, isConnected } = useAppKitAccount();

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

  const CopyCodeFun = (code: string) => {
    // if (!props?.userInfo?.isBind) return addMessage(t("9"));
    if (!web3ModalAccount) {
      return addMessage(t("Please Connect wallet"));
    } else {
      copyFun(code);
      addMessage(t("Copied successfully"));
    }
  };

  useEffect(() => {
    if (!!token) {
      getRefereeList({ pageNum: PageNum, pageSize: 10 }).then((res: any) => {
        if (res.code !== 200) return;
        setRecordList3(res?.data || {});
      });
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
          {t("我的邀请码")}
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
        <MyInvitedInfo>
          {!!token ? (
            <>
              <MyInvitedInfo_Earns>
                <Earn>
                  {t("推荐奖励")}
                  <EarnValue>
                    {RecordList3?.awardNum ?? 0} <div>PiJS</div>{" "}
                    <img src={goIcon} alt="" />
                  </EarnValue>
                </Earn>
                <Code>
                  <Title>
                    {t("我的推荐码")}{" "}
                    <img
                      src={copy}
                      alt=""
                      onClick={() => {
                        CopyCodeFun(props?.userInfo?.inviteCode);
                      }}
                    />
                  </Title>
                  <div className="codes">
                    {String(props?.userInfo?.inviteCode)
                      ?.split("")
                      ?.map((item: any, index: any) => (
                        <div key={index}>{item}</div>
                      ))}
                  </div>
                </Code>
              </MyInvitedInfo_Earns>
              <InvitedNum>
                {t("Invited users")} {RecordList3?.refereeNum ?? 0}
              </InvitedNum>
              <InvitedLink>
                {t("Referral Link")}：
                {window.location.origin +
                  `?inviteCode=${props?.userInfo?.inviteCode}`}{" "}
                <img
                  src={copy}
                  alt=""
                  onClick={() => {
                    CopyCodeFun(
                      window.location.origin +
                        `?inviteCode=${props?.userInfo?.inviteCode}`
                    );
                  }}
                />
              </InvitedLink>
            </>
          ) : (
            <WalletTip>{t("请连接您的钱包")}</WalletTip>
          )}

          <InvitedTip>
            {t(
              "分享你的邀请码，邀请更多人参与，您将获得 15% 的挖矿收益以及 5% 的节点返佣奖励！"
            )}
          </InvitedTip>
        </MyInvitedInfo>

        <ModalContainer_Content>
          {t("邀请列表")}
          <Table>
            <Table_Title>
              <Items>
                <div>{t("Number")}</div>
                <div>{t("Address")}</div>
                <div>{t("Contribution Rewards")}</div>
              </Items>
            </Table_Title>
            <Table_Content>
              {RecordList3?.list?.map((item: any, index: any) => (
                <Items key={index}>
                  <div>{Number(index) + (Number(PageNum) - 1) * 10 + 1}</div>
                  <div>{AddrHandle(item?.address, 6, 4)}</div>
                  <div>{item?.num}</div>
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
