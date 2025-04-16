import React, { useEffect, useState } from "react";
import "../assets/style/componentsStyle/Airdrop_Nav.scss";
import copy from "../assets/image/layout/copy.svg";
import dropDownIcon from "../assets/image/layout/dropDownIcon.png";
import time from "../assets/image/PersonCenter/time.png";
import { Dropdown, Menu } from "antd";
import { useTranslation } from "react-i18next";
import { useViewport } from "./viewportContext";
import { useSelector } from "react-redux";
import { getPiotnsAccount, getPiotnsAccountRecord } from "../API";
import { dateFormat } from "../utils/tool";

const InviteNav = () => {
  const { width } = useViewport();
  const { t, i18n } = useTranslation();
  const [ActiveTab, setActiveTab] = useState("1");
  const [CurrentActiveSigleCoin, setCurrentActiveSigleCoin] =
    useState<any>("πPionts");
  const token = useSelector((state: any) => state?.token);
  const [PiotnsAccount, setPiotnsAccount] = useState<any>({});
  const [PiotnsAccountRecord, setPiotnsAccountRecord] = useState<any>({});
  const singleCoinsMenu = (
    <Menu
      items={[
        {
          value: "πPionts",
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
    getPiotnsAccount().then((res: any) => {
      setPiotnsAccount(res?.data || {});
    });
    getPiotnsAccountRecord().then((res: any) => {
      setPiotnsAccountRecord(res?.data || {});
    });
  };

  useEffect(() => {
    if (!!token) {
      getInitData();
    }
  }, [token]);
  return (
    <div className="airdrop_container">
      <div className="my_invite_list">
        <div className="manage_box">
          <div className="tabs">
            <div
              onClick={() => {
                setActiveTab("1");
              }}
              className={ActiveTab === "1" ? "active" : "tab"}
            >
              空投资产
            </div>
            <div
              onClick={() => {
                setActiveTab("2");
              }}
              className={ActiveTab === "2" ? "active" : "tab"}
            >
              记录
            </div>
          </div>

          {ActiveTab === "2" && (
            <div className="filter_box_right">
              币种
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
                <div className="item">币种</div>
                <div className="item">总收益</div>
                <div className="item">余额</div>
                <div className="item">已处理</div>
                <div className="item">操作</div>
              </div>
              <div className="table_content items">
                <div className="item">πPionts</div>
                <div className="item">{PiotnsAccount?.totalEarn ?? 0}</div>
                <div className="item">{PiotnsAccount?.amount ?? 0}</div>
                <div className="item">0</div>
                <div className={false ? "item manage" : "item managed"}>
                  兑换
                </div>
              </div>
            </div>
          ) : (
            <div className="mobile_table">
              <div className="mobile_table_item">
                <div className="mobile_table_item_top">
                  πPionts{" "}
                  <div className={false ? "manage" : "managed"}>兑换</div>
                </div>
                <div className="mobile_table_item_bottom">
                  <div className="item">
                    <div>总收益</div>
                    {PiotnsAccount?.totalEarn ?? 0}
                  </div>
                  <div className="item">
                    <div>余额</div>
                    {PiotnsAccount?.amount ?? 0}
                  </div>
                  <div className="item">
                    <div>已处理</div>0
                  </div>
                </div>
              </div>
            </div>
          ))}
        {ActiveTab === "2" &&
          (width > 768 ? (
            <div className="table">
              <div className="table_title items">
                <div className="item">收益类型</div>
                <div className="item">时间</div>
                <div className="item">币种</div>
                <div className="item">数量</div>
              </div>
              <div className="table_content items">
                <div className="item">
                  {!!PiotnsAccountRecord?.taskName
                    ? i18n.language === "zh-CN"
                      ? JSON.parse(PiotnsAccountRecord?.taskName ?? "")?.en
                      : JSON.parse(PiotnsAccountRecord?.taskName ?? "")?.zh
                    : "-"}
                </div>
                <div className="item">
                  {PiotnsAccountRecord?.updateTime
                    ? dateFormat(
                        "YYYY-mm-dd HH:MM",
                        new Date(PiotnsAccountRecord?.updateTime)
                      )
                    : "-"}
                </div>
                <div className="item">πPionts</div>
                <div className="item">{PiotnsAccountRecord?.points ?? 0}</div>
              </div>
            </div>
          ) : (
            !!PiotnsAccountRecord?.points && (
              <div className="mobile_record">
                <div className="mobile_record_item">
                  {!!PiotnsAccountRecord?.taskName
                    ? i18n.language === "zh-CN"
                      ? JSON?.parse(PiotnsAccountRecord?.taskName ?? "")?.en
                      : JSON?.parse(PiotnsAccountRecord?.taskName ?? "")?.zh
                    : "-"}
                  <div className="mobile_record_item_box">
                    <div className="left">
                      <img src={time} alt="" />
                      {PiotnsAccountRecord?.updateTime
                        ? dateFormat(
                            "YYYY-mm-dd HH:MM",
                            new Date(PiotnsAccountRecord?.updateTime)
                          )
                        : "-"}
                    </div>
                    <div className={false ? "yellow" : "green"}>
                      +{PiotnsAccountRecord?.points ?? 0} πPionts
                    </div>
                  </div>
                </div>
                {/* <div className="mobile_record_item">
                完成XXX任务
                <div className="mobile_record_item_box">
                  <div className="left">
                    <img src={time} alt="" /> 2024-07-15 12:35
                  </div>
                  <div className={false ? "yellow" : "green"}>+500.00 PIJS</div>
                </div>
              </div> */}
              </div>
            )
          ))}
      </div>
    </div>
  );
};

export default InviteNav;
