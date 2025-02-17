import styled, { keyframes } from "styled-components";
import loadingIcon from "../assets/image/loadingIcon.svg";
import { Btn, FlexBox, FlexCCBox, FlexSBCBox } from "./FlexBox";
import { Modal } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BlockUrl } from "../config";
const turn = keyframes`
    0%{-webkit-transform:rotate(0deg);}
    25%{-webkit-transform:rotate(90deg);}
    50%{-webkit-transform:rotate(180deg);}
    75%{-webkit-transform:rotate(270deg);}
    100%{-webkit-transform:rotate(360deg);}
`;
const LodingMode = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    width: 50px;
    animation: ${turn} 3s linear infinite;
  }
`;

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
`;

const ModalContainer = styled(FlexBox)`
  /* position: relative; */
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TitleText = styled(FlexCCBox)`
  width: 100%;
  font-family: "Space Grotesk";
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  text-align: center;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  margin-bottom: 10px;
`;
const TipText = styled(FlexCCBox)`
  width: 100%;
  font-family: "PingFang SC";
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
`;

const SuccessfulBtn = styled(FlexBox)`
  justify-content: space-around;
  width: 100%;
  margin-top: 24px;
`;
const SuccessfulBtn1 = styled(FlexCCBox)`
  padding: 11px 44px;
  border-radius: 8px;
  opacity: 1;
  background: rgba(147, 230, 63, 0.1);
  box-sizing: border-box;
  border: 1px solid #FF8B36;
  font-family: "Space Grotesk";
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
`;
const SuccessfulBtn2 = styled(FlexCCBox)`
  padding: 11px 44px;
  border-radius: 8px;
  opacity: 1;
  background: #FF8B36;
  font-family: "Space Grotesk";
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #0a0a0a;
`;

export default function ModalContent(props: any) {
  const { t } = useTranslation();

  return (
    <AllModal
      visible={props?.ShowTipModal}
      className="Modal"
      centered
      width={"400px"}
      closable={false}
      footer={null}
    >
      <ModalContainer>
        <TitleText>{props?.Title}</TitleText>
        <TipText>{props?.Tip}</TipText>

        <SuccessfulBtn>
          <SuccessfulBtn1
            onClick={() => {
              props?.fun();
              props?.close();
            }}
          >
            {t("Knew")}
          </SuccessfulBtn1>
          <SuccessfulBtn2
            onClick={() => {
              props?.fun();
              window.open(BlockUrl + props.hash);
            }}
          >
            {t("Check")}
          </SuccessfulBtn2>
        </SuccessfulBtn>
      </ModalContainer>
    </AllModal>
  );
}
