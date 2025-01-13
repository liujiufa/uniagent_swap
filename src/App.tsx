// @ts-nocheck
import "./App.scss";
import "./App.css";
import React from "react";

import { useEffect } from "react";
import "./lang/i18n";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Routers from "./router";
import { GetQueryString, showLoding, startWord } from "./utils/tool";
// import web3 from 'web3';
import { stateType } from "./store/reducer";
import {
  createAddMessageAction,
  createLoginSuccessAction,
  createDelMessageAction,
} from "./store/actions";
import { Login } from "./API";
import Loding from "./components/loding";
import ViewportProvider from "./components/viewportContext";
// import { useNavigate } from "react-router-dom";
// import Home from './view/Home';
import prohibit from "./assets/image/prohibit.png";
import info from "./assets/image/info.svg";

import { t } from "i18next";
import useConnectWallet, { connector } from "./hooks/useConnectWallet";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { useSign } from "./hooks/useSign";
import { useTitle } from "ahooks";

import * as QB from "quickblox/quickblox";

import { QBConfig } from "./QBconfig";

declare let window: any;

const MessageBox = styled.div`
  position: fixed;
  z-index: 9999;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);

  border-radius: 8px;
  opacity: 1;
  background: #0f0f0f;
  box-sizing: border-box;
  border: 1px solid #557930;

  .messageItem {
    display: flex;
    align-items: center;
    width: fit-content;
    padding: 12px 16px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.5);
    font-family: "PingFang SC";
    font-size: 16px;
    font-weight: normal;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #ffffff;
    > img {
      margin-right: 10px;
    }
    /* margin-bottom: 8px; */
  }
  @media (max-width: 1200px) {
    .messageItem {
      font-size: 14px;
      padding: 12px 14px;
    }
  }
`;

function App() {
  const { t } = useTranslation();
  useTitle(t("UniAgent"));

  const web3React = useWeb3React();
  const { connectWallet } = useConnectWallet();
  const { signFun } = useSign();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  let state = useSelector<stateType, stateType>((state) => state);

  return (
    <ViewportProvider>
      <div className="App">
        <MessageBox>
          {state?.message?.map((item, index) => (
            <div className="messageItem" key={index}>
              <img src={info} alt="" /> {item.message}
            </div>
          ))}
        </MessageBox>
        <Routers></Routers>
        {state.showLoding && <Loding></Loding>}
      </div>
    </ViewportProvider>
  );
}

export default App;
