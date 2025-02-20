import React from "react";
import styled from "styled-components";
import { FlexCCBox, FlexSBCBox } from "./FlexBox";
import communityItem1 from "../assets/image/layout/communityItem1.png";
import communityItem2 from "../assets/image/layout/communityItem2.png";
import communityItem3 from "../assets/image/layout/communityItem3.png";
import { useTranslation } from "react-i18next";
import {
  Documentation,
  InviteRebateKOLApplication,
  TermsofService,
  TokenEconomicModel,
} from "../config";
const FooterContainer = styled.div`
  width: 100%;
  opacity: 1;
  background: #202428;
  > div {
    width: 100%;
    max-width: 778px;
    margin: auto;
  }
`;
const FooterContainer_Top = styled(FlexSBCBox)`
  padding: 30px 15px 20px;
  opacity: 1;
  .navs {
    width: 100%;
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    > div {
      /* max-width: 120px; */
      > div {
        cursor: pointer;
        font-family: MiSans;
        font-size: 13px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #c5ccd4;
        margin-bottom: 12px;
        &:first-child {
          font-family: MiSans;
          font-size: 13px;
          font-weight: 500;
          line-height: normal;
          letter-spacing: 0em;
          font-variation-settings: "opsz" auto;
          color: #f4c134;
        }
        &:last-child {
          margin-bottom: 0px;
        }
      }
    }
  }
  @media (max-width: 768px) {
    padding: 24px 26px;
    .navs {
      flex-wrap: wrap;
      > div {
        max-width: 100%;

        width: 100%;
        margin-bottom: 30px;
        &:last-child {
          margin-bottom: 0;
        }
        > div {
        }
      }
    }
  }
`;
const Devider = styled.div`
  width: 100%;
  height: 1px;
  opacity: 1;
  max-width: 100% !important;
  background: #313539;
`;
const FooterContainer_Bottom = styled(FlexSBCBox)`
  padding: 20px 15px;
  > div {
    img {
      width: 24px;
      height: 24px;
      margin-right: 25px;
    }
  }
`;
const Footer = () => {
  const { t } = useTranslation();
  return (
    <FooterContainer>
      <FooterContainer_Top>
        <div className="navs">
          <div>
            <div>{t("生态系统")}</div>
            <div>{t("交易")}</div>
            <div>{t("赚取")}</div>
            <div>{t("参与")}</div>
          </div>
          <div>
            <div>BUSINESS</div>
            <div>{t("PiJS 激励")}</div>
            <div>{t("质押糖浆池")}</div>
            <div>{t("代币发布")}</div>
            <div>{t("品牌资产")}</div>
          </div>
          <div>
            <div>{t("开发者")}</div>
            <div>{t("开发者贡献")}</div>
            <div>{t("Github")}</div>
            <div>{t("漏洞资金")}</div>
            <div
              onClick={() => {
                window.open(InviteRebateKOLApplication);
              }}
            >
              {t("邀请返佣KOL申请")}
            </div>
          </div>
          <div>
            <div>{t("支持")}</div>
            <div>{t("获取帮助")}</div>
            <div>{t("故障排查")}</div>
            <div
              onClick={() => {
                window.open(Documentation);
              }}
            >
              {t("文档")}
            </div>
            <div>{t("审计")}</div>
          </div>
          <div>
            <div>{t("关于")}</div>
            <div
              onClick={() => {
                window.open(TokenEconomicModel);
              }}
            >
              {t("代币经济模型")}
            </div>
            <div>{t("PiJS 产出量预测")}</div>
            <div>{t("博客")}</div>
            <div
              onClick={() => {
                window.open(TermsofService);
              }}
            >
              {t("服务条款")}
            </div>
          </div>
        </div>
      </FooterContainer_Top>
      <Devider></Devider>
      <FooterContainer_Bottom>
        <div>
          <img src={communityItem1} alt="" />
          <img src={communityItem2} alt="" />
          <img src={communityItem3} alt="" />
        </div>
      </FooterContainer_Bottom>
    </FooterContainer>
  );
};

export default Footer;
