import React, { useEffect, useState } from "react";
import "../assets/style/componentsStyle/Medal_Nav.scss";
import copy from "../assets/image/layout/copy.svg";
import { Dropdown, Menu } from "antd";
import { useTranslation } from "react-i18next";
import dropDownIcon from "../assets/image/layout/dropDownIcon.png";
import medal_img from "../assets/image/PersonCenter/medal_img.png";
import pijsIcon from "../assets/image/Swap/pijsIcon.png";
import { getMedalInfo } from "../API";
import { useSelector } from "react-redux";
const InviteNav = () => {
  const { t } = useTranslation();
  const [FilterActive, setFilterActive] = useState<any>(1);
  const [CurrentActiveLP, setCurrentActiveLP] = useState<any>("PIJS-USDT LP");
  const [CurrentActiveSigleCoin, setCurrentActiveSigleCoin] =
    useState<any>("PIJS");
  const [MedalInfo, setMedalInfo] = useState<any>({});
  const token = useSelector((state: any) => state?.token);

  const getInitData = () => {
    getMedalInfo().then((res: any) => {
      setMedalInfo(res?.data || {});
    });
  };

  useEffect(() => {
    if (!!token) {
      getInitData();
    }
  }, [token]);

  return (
    <div className="medal_container">
      <div className="items">
        {!!MedalInfo?.isPioneer && (
          <div className={"item no_margin_left"}>
            <img src={medal_img} alt="" />
            <div>πConnect Badge</div>
          </div>
        )}
        {Number(MedalInfo?.nodeType) === 1 && (
          <div className={"item no_margin_left"}>
            <img src={medal_img} alt="" />
            <div>普通节点</div>
          </div>
        )}
        {Number(MedalInfo?.nodeType) === 2 && (
          <div className={"item no_margin_left"}>
            <img src={medal_img} alt="" />
            <div>超级节点</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteNav;
