import React, { useEffect, useState } from "react";
import "../assets/style/componentsStyle/Mining_Nav.scss";
import copy from "../assets/image/layout/copy.svg";
import { Dropdown, Menu } from "antd";
import { useTranslation } from "react-i18next";
import dropDownIcon from "../assets/image/layout/dropDownIcon.png";
import usdtIcon from "../assets/image/Swap/usdtIcon.png";
import pijsIcon from "../assets/image/Swap/pijsIcon.png";
import { getPledgeBaasList, getPriceInfo, getUserInfo } from "../API";
import { useSelector } from "react-redux";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { NumSplic1 } from "../utils/tool";
const InviteNav = () => {
  const { t } = useTranslation();
  const [FilterActive, setFilterActive] = useState<any>(1);
  const [CurrentActiveLP, setCurrentActiveLP] = useState<any>("PIJS-USDT LP");
  const [CurrentActiveSigleCoin, setCurrentActiveSigleCoin] =
    useState<any>("PIJS");
  const [UserInfo, setUserInfo] = useState<any>({});
  const [PriceInfo, setPriceInfo] = useState<any>({});

  let token = useSelector<any>((state) => state.token);
  const [PledgeCoinList, setPledgeCoinList] = useState<any>([]);
  const { address: web3ModalAccount, isConnected } = useAppKitAccount();
  const { caipNetwork, caipNetworkId, chainId, switchNetwork } =
    useAppKitNetwork();
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

  const getInitData = () => {
    // 类型 1-LP 2-代币  状态 0-未开始 1-进行中 2-已结束
    getPledgeBaasList(FilterActive, 1).then((res: any) => {
      if (res.code === 200) {
        setPledgeCoinList(res?.data || []);
      }
    });
    getPriceInfo().then((res: any) => {
      if (res.code === 200) {
        setPriceInfo(res?.data || {});
      }
    });
  };

  useEffect(() => {
    getInitData();
  }, [
    web3ModalAccount,
    chainId,
    FilterActive,
    CurrentActiveLP,
    CurrentActiveSigleCoin,
    token,
  ]);

  useEffect(() => {
    if (!token) {
      setPledgeCoinList([]);
    }
  }, []);

  return (
    <div className="mining_container">
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
        {PledgeCoinList?.map(
          (item: any, index: any) =>
            !!item?.pledgeUser && (
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
                  {FilterActive === 1
                    ? CurrentActiveLP
                    : CurrentActiveSigleCoin}
                </div>
                <div className="devider"></div>
                <div className="item_content">
                  <div className="data_detail">
                    <div className="tag">{t("质押")}</div>
                    <div className="amount">
                      {item?.pledgeUser?.pledgeNum ?? 0}{" "}
                      <span>
                        {" "}
                        {FilterActive === 1 ? "LP" : CurrentActiveSigleCoin}
                      </span>
                    </div>
                    <div className="value">
                      $
                      {NumSplic1(
                        Number(item?.pledgeUser?.pledgeNum) *
                          Number(
                            FilterActive === 1
                              ? PriceInfo?.lpPrice
                              : PriceInfo?.pijsPrice
                          ),
                        4
                      )}
                    </div>
                  </div>
                  <div className="data_detail">
                    <div className="tag">{t("收益")}</div>
                    <div className="amount">
                      {item?.pledgeUser?.earnNum ?? 0}{" "}
                      <span> {item?.pledgeUser?.coinName ?? "-"}</span>
                    </div>
                    <div className="value">
                      $
                      {NumSplic1(
                        Number(item?.pledgeUser?.earnNum) *
                          Number(PriceInfo?.pijsPrice),
                        4
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
        )}
        {/* <div className="flex_1"></div> */}
      </div>
    </div>
  );
};

export default InviteNav;
