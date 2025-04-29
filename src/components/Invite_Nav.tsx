import React, { useEffect, useState } from "react";
import "../assets/style/componentsStyle/Invite_Nav.scss";
import copy from "../assets/image/layout/copy.svg";
import { useViewport } from "./viewportContext";
import { useAppKitAccount } from "@reown/appkit/react";
import { AddrHandle, addMessage } from "../utils/tool";
import copyFun from "copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getRefereeList } from "../API";
import { Pagination, PaginationProps } from "antd";
import { FlexCCBox } from "./FlexBox";
import leftIcon from "../assets/image/Home/leftIcon.svg";
import rightIcon from "../assets/image/Home/rightIcon.svg";
import { PaginationContainer } from "./ReferListModal";
import styled from "styled-components";

const WalletTip = styled.div`
  margin: 20px 0px 16px;
  font-family: "MiSans";
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #abb1b9;
`;
const InviteNav = (props: any) => {
  const { width } = useViewport();
  const { t } = useTranslation();
  const { address: web3ModalAccount, isConnected } = useAppKitAccount();
  const [RecordList3, setRecordList3] = useState<any>({});
  const token = useSelector((state: any) => state?.token);
  const [PageNum, setPageNum] = useState(1);
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
    <div className="invite_container">
      <div className="my_invite_title">
        {t("我的邀请码")}
        <div className="my_invite_content">
          {t("分享你的邀请码，邀请更多人参与，您将获得")}
          {!!token ? (
            <div className="invite_box">
              <div className="invite_box_left item">
                {t("邀请码")}
                <div>
                  {String(props?.userInfo?.inviteCode)}{" "}
                  <img
                    src={copy}
                    alt=""
                    onClick={() => {
                      CopyCodeFun(props?.userInfo?.inviteCode);
                    }}
                  />
                </div>
              </div>
              <div className="invite_box_right item">
                {t("邀请链接")}
                <div>
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
                </div>
              </div>
            </div>
          ) : (
            <WalletTip>{t("请连接您的钱包")}</WalletTip>
          )}
        </div>
      </div>
      <div className="my_invite_list">
        {t("邀请列表")} (Users {RecordList3?.total ?? 0})
        {width > 768 ? (
          <div className="table">
            <div className="table_title items">
              <div className="item">{t("Number")}</div>
              <div className="item">{t("Address")}</div>
              <div className="item">{t("Contribution")} USDT</div>
              <div className="item">{t("Contribution")} PIJS</div>
              <div className="item">{t("Contribution")} πPionts</div>
            </div>
            {RecordList3?.list?.map((item: any, index: any) => (
              <div className="table_content items" key={index}>
                <div className="item">
                  {Number(index) + (Number(PageNum) - 1) * 10 + 1}
                </div>
                <div className="item">{AddrHandle(item?.address, 6, 4)}</div>
                <div className="item">{item?.num}</div>
                <div className="item">{item?.pijsNum}</div>
                <div className="item">{item?.piontsNum}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mobile_table">
            {RecordList3?.list?.map((item: any, index: any) => (
              <div className="mobile_table_item" key={index}>
                <div className="mobile_table_item_top">
                  {Number(index) + (Number(PageNum) - 1) * 10 + 1}{" "}
                  <div> {AddrHandle(item?.address, 6, 4)}</div>
                </div>
                <div className="mobile_table_item_bottom">
                  <div className="item">
                    <div>{t("Contribution")} USDT</div>
                    {item?.num}
                  </div>
                  <div className="item">
                    <div>{t("Contribution")} PIJS</div>
                    {item?.pijsNum}
                  </div>
                  <div className="item">
                    <div>{t("Contribution")} πPionts</div>
                    {item?.piontsNum}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
    </div>
  );
};

export default InviteNav;
