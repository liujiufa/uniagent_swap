import React, { useEffect, useState } from "react";
import "../assets/style/componentsStyle/Right_Nav.scss";
import copy from "../assets/image/layout/copy.svg";
import dropDownIcon from "../assets/image/layout/dropDownIcon.png";
import time from "../assets/image/PersonCenter/time.png";
import { Dropdown, Menu, Pagination, PaginationProps } from "antd";
import { useTranslation } from "react-i18next";
import { useViewport } from "./viewportContext";
import { useSelector } from "react-redux";
import {
  getNodeUserEarnDetail,
  getNodeUserInfo,
  getNodeUserInfoList,
} from "../API";
import { FlexCCBox } from "./FlexBox";
import leftIcon from "../assets/image/Home/leftIcon.svg";
import rightIcon from "../assets/image/Home/rightIcon.svg";
import { PaginationContainer } from "./ReferListModal";
import { dateFormat } from "../utils/tool";
import { useGetReward } from "../hooks/useGetReward";
import ModalContentSuccessSigleBtn from "./ModalContentSuccessSigleBtn";
import { contractAddress } from "../config";
const InviteNav = () => {
  const { width } = useViewport();
  const { t } = useTranslation();
  const [ActiveTab, setActiveTab] = useState("1");
  const [CurrentActiveSigleCoin, setCurrentActiveSigleCoin] =
    useState<any>("PIJS");
  const token = useSelector((state: any) => state?.token);
  const [NodeUserInfo, setNodeUserInfo] = useState<any>({});
  const [RecordList3, setRecordList3] = useState<any>({});
  const [NodeUserInfoList, setNodeUserInfoList] = useState<any>([]);
  const [PageNum, setPageNum] = useState(1);
  const { getReward } = useGetReward();
  const [Tip, setTip] = useState("");
  const [ShowTipModal, setShowTipModal] = useState(false);
  const [ShowSuccessTipModal, setShowSuccessTipModal] = useState(false);
  const onChange: PaginationProps["onChange"] = (page) => {
    console.log(page);
    setPageNum(page);
  };
  let rewardObj = { 1: "领取奖励", 2: "手续费分红", 3: "盈利分红" };

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
  const singleCoinsMenu = (
    <Menu
      items={[
        {
          value: "PIJS",
          key: "lp1",
        },
      ].map((item: any) => {
        return {
          label: (
            <span
              className="LangItem"
              onClick={() => {
                setCurrentActiveSigleCoin(item?.value);
              }}
            >
              {t(item.value)}
            </span>
          ),
          key: item?.key,
        };
      })}
    />
  );
  const getInitData = () => {
    getNodeUserInfo().then((res: any) => {
      setNodeUserInfo(res?.data || {});
    });
    getNodeUserInfoList().then((res: any) => {
      setNodeUserInfoList(res?.data || []);
    });
  };

  const getRewardRecord = async () => {
    getNodeUserEarnDetail({ pageNum: PageNum, pageSize: 10 }).then(
      (res: any) => {
        setRecordList3(res?.data || {});
      }
    );
  };

  // 1领U 2领PIJS
  const getRewardFun = async (type: 1 | 2, call: any) => {
    if (type === 1) {
      getReward(
        () => {
          setTip(t("收益提取成功"));
          setShowSuccessTipModal(true);
          call();
        },
        contractAddress?.NodeDistribute,
        {
          coinName: "USDT",
          id: 0,
          type: 2,
        },
        () => {
          setTip(t("收益提取中"));
          setShowTipModal(true);
        },
        () => {
          setShowTipModal(false);
        }
      );
    } else {
      getReward(
        () => {
          setTip(t("收益提取成功"));
          setShowSuccessTipModal(true);
          call();
        },
        contractAddress?.NodeDistribute,
        {
          coinName: "PIJS",
          id: 0,
          type: 2,
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
  };

  useEffect(() => {
    if (!!token) {
      getInitData();
    }
  }, [token]);
  useEffect(() => {
    if (!!token) {
      getRewardRecord();
    } else {
      setRecordList3({});
    }
  }, [token, PageNum]);
  return (
    <div className="right_container">
      <div className="right_values">
        <div className="right_value">
          {t("权益收入价值")}
          <div>$ {NodeUserInfo?.earnAmount ?? "0"}</div>
        </div>
        <div className="right_value">
          {t("已提收益价值")}
          <div>$ {NodeUserInfo?.alreadyTotal ?? "0"}</div>
        </div>
        <div className="right_value">
          {t("待提收益价值")}
          <div>$ {NodeUserInfo?.treatAmount ?? "0"}</div>
        </div>
      </div>
      <div className="my_invite_list">
        <div className="manage_box">
          <div className="tabs">
            <div
              onClick={() => {
                setActiveTab("1");
              }}
              className={ActiveTab === "1" ? "active" : "tab"}
            >
              {t("权益")}
            </div>
            <div
              onClick={() => {
                setActiveTab("2");
              }}
              className={ActiveTab === "2" ? "active" : "tab"}
            >
              {t("记录")}
            </div>
          </div>

          {ActiveTab === "2" && (
            <div className="filter_box_right">
              {t("币种")}
              <Dropdown
                overlay={singleCoinsMenu}
                placement="bottom"
                overlayClassName="LangDropDown"
                trigger={["click"]}
                arrow={false}
                getPopupContainer={(triggerNode: any) => triggerNode}
              >
                <div
                  className="CoinBox pointer"
                  onClick={() => {
                    // open();
                  }}
                >
                  {CurrentActiveSigleCoin}
                  <img src={dropDownIcon} alt="" className="dropDownIcon1" />
                </div>
              </Dropdown>
            </div>
          )}
        </div>

        {ActiveTab === "1" &&
          (width > 768 ? (
            <div className="table">
              <div className="table_title items">
                <div className="item">{t("币种")}</div>
                <div className="item">{t("总收益")}</div>
                <div className="item">{t("已提收益")}</div>
                <div className="item">{t("待提收益")}</div>
                <div className="item">{t("操作")}</div>
              </div>
              {NodeUserInfoList?.map((item: any, index: any) => (
                <div className="table_content items" key={index}>
                  <div className="item">{item?.coinName}</div>
                  <div className="item">{item?.totalAmount}</div>
                  <div className="item">{item?.treatNum}</div>
                  <div className="item">{item?.amount}</div>
                  <div
                    className={
                      !!item?.amount && Number(item?.amount) > 0
                        ? "item manage"
                        : "item managed"
                    }
                    onClick={() => {
                      if (!!item?.amount && Number(item?.amount) > 0) {
                        getRewardFun(
                          String(item?.coinName) === "USDT" ? 1 : 2,
                          () => {
                            getInitData();
                          }
                        );
                      }
                    }}
                  >
                    {t("提收益")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mobile_table">
              {NodeUserInfoList?.map((item: any, index: any) => (
                <div className="mobile_table_item" key={index}>
                  <div className="mobile_table_item_top">
                    {item?.coinName}{" "}
                    <div
                      className={
                        !!item?.amount && Number(item?.amount) > 0
                          ? "item manage"
                          : "item managed"
                      }
                      onClick={() => {
                        if (!!item?.amount && Number(item?.amount) > 0) {
                          getRewardFun(
                            String(item?.coinName) === "USDT" ? 1 : 2,
                            () => {
                              getInitData();
                            }
                          );
                        }
                      }}
                    >
                      {t("提收益")}
                    </div>
                  </div>
                  <div className="mobile_table_item_bottom">
                    <div className="item">
                      <div>{t("总收益")}</div>
                      {item?.totalAmount}
                    </div>
                    <div className="item">
                      <div>{t("已提收益")}</div>
                      {item?.treatNum}
                    </div>
                    <div className="item">
                      <div>{t("待提收益")}</div>
                      {item?.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        {ActiveTab === "2" && (
          <>
            {width > 768 ? (
              <div className="table">
                <div className="table_title items">
                  <div className="item">{t("收益类型")}</div>
                  <div className="item">{t("时间")}</div>
                  <div className="item">{t("币种")}</div>
                  <div className="item">{t("数量")}</div>
                </div>
                {RecordList3?.list?.map((item: any, index: any) => (
                  <div className="table_content items" key={index}>
                    <div className="item">{t(rewardObj[item?.type])}</div>
                    <div className="item">
                      {" "}
                      {dateFormat("YY-mm-dd HH:MM", new Date(item?.createTime))}
                    </div>
                    <div className="item">{item?.coinName}</div>
                    <div className="item">{item?.num}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mobile_record">
                {RecordList3?.list?.map((item: any, index: any) => (
                  <div className="mobile_record_item" key={index}>
                    {rewardObj[item?.type]}
                    <div className="mobile_record_item_box">
                      <div className="left">
                        <img src={time} alt="" />{" "}
                        {dateFormat(
                          "YY-mm-dd HH:MM",
                          new Date(item?.createTime)
                        )}
                      </div>
                      <div className={false ? "yellow" : "green"}>
                        +{item?.num} {item?.coinName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          </>
        )}
      </div>
      <ModalContentSuccessSigleBtn
        ShowTipModal={ShowSuccessTipModal}
        Tip={Tip}
        fun={() => {
          if (!!token) {
            getInitData();
            getRewardRecord();
          }
        }}
        close={() => {
          setShowSuccessTipModal(false);
        }}
      />
    </div>
  );
};

export default InviteNav;
