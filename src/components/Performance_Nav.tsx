import React, { useState } from "react";
import "../assets/style/componentsStyle/Performance_Nav.scss";
import copy from "../assets/image/layout/copy.svg";
import { Dropdown, Menu } from "antd";
import { useTranslation } from "react-i18next";
import dropDownIcon from "../assets/image/layout/dropDownIcon.png";
import usdtIcon from "../assets/image/Swap/usdtIcon.png";
import pijsIcon from "../assets/image/Swap/pijsIcon.png";
const InviteNav = () => {
  const { t } = useTranslation();
  const [FilterActive, setFilterActive] = useState<any>(1);
  const [CurrentActiveLP, setCurrentActiveLP] = useState<any>("PIJS-USDT LP");
  const [CurrentActiveSigleCoin, setCurrentActiveSigleCoin] =
    useState<any>("PIJS");
  const coinsMenu = (
    <Menu
      items={[
        {
          value: "PIJS-USDT LP",
          key: "lp1",
        },
      ].map((item: any) => {
        return {
          label: (
            <span
              className="LangItem"
              onClick={() => {
                setCurrentActiveLP(item?.value);
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
  return (
    <div className="performance_container">
      <div className="filter_box">
        <div className="filter_box_left">
          <div
            onClick={() => {
              setFilterActive(1);
            }}
            className={FilterActive === 1 ? "active" : ""}
          >
            {t("流动性挖矿")}
          </div>
          <div
            onClick={() => {
              setFilterActive(2);
            }}
            className={FilterActive === 2 ? "active" : ""}
          >
            {t("糖浆池")}
          </div>
        </div>
        <div className="filter_box_right">
          {t("币种")}
          <Dropdown
            overlay={FilterActive === 1 ? coinsMenu : singleCoinsMenu}
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
              {FilterActive === 1 ? CurrentActiveLP : CurrentActiveSigleCoin}
              <img src={dropDownIcon} alt="" className="dropDownIcon1" />
            </div>
          </Dropdown>
        </div>
      </div>

      <div className="items">
        {[]?.map((item: any, index: any) => (
          <div
            className={
              Number(index + 1) % 3 === 0 ? "item no_margin_left" : "item"
            }
            key={index}
          >
            <div className="item_title">
              {FilterActive === 1 ? (
                <div className="coin_box">
                  <img src={usdtIcon} alt="" />
                  <img src={pijsIcon} alt="" />
                </div>
              ) : (
                <div className="siglecoin_box">
                  <img src={pijsIcon} alt="" />
                </div>
              )}
              PIJS-USDT LP
            </div>
            <div className="devider"></div>
            <div className="item_content">
              <div className="data_detail">
                <div className="tag">{t("本轮新增")}</div>
                <div className="amount">10000000 LP</div>
                <div className="value">$10000000</div>
              </div>
              <div className="data_detail">
                <div className="tag">{t("上轮业绩")}</div>
                <div className="amount">10000000 PIJS</div>
                <div className="value">$10000000</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InviteNav;
