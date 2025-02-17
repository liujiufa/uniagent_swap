import styled, { keyframes } from "styled-components";
import loadingIcon from "../assets/image/loadingIcon.svg";
import { Btn, FlexBox, FlexCCBox } from "./FlexBox";
import { Modal } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
      padding: 24px 15px;
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

const SuccessfulBtn = styled(FlexCCBox)`
  width: 100%;
  margin-top: 24px;
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
        {!props?.Successful && (
          <LodingMode>
            <img src={loadingIcon} alt="" />
          </LodingMode>
        )}
        <TipText> {props?.Tip}</TipText>
      </ModalContainer>
    </AllModal>
  );
}
