import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "antd";
import type { MenuProps } from "antd";
import {
  AddrHandle,
  addMessage,
  GetQueryString,
  showLoding,
  NumSplic,
  getFullNum,
  startWord,
} from "../utils/tool";
import {
  Login,
  checkInviteCode,
  isNewUser,
  isRefereeAddress,
} from "../API/index";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import { stateType } from "../store/reducer";
import { Contracts } from "../web3";
import { useThrottleFn } from "@umijs/hooks";
import { createLoginSuccessAction, savePriceAction } from "../store/actions";
import BigNumber from "big.js";
import copy from "copy-to-clipboard";
import Lang from "../assets/image/layout/Lang.svg";
import demo from "../assets/image/demo.svg";
import closeIcon from "../assets/image/closeIcon.svg";
import menu_fill from "../assets/image/layout/menu_fill.svg";
import menu_close from "../assets/image/layout/menu_close.svg";

import "../assets/style/layout.scss";
import { Menu, Dropdown, Modal } from "antd";
import useConnectWallet, {
  connector,
  // walletConnectConnector,
} from "../hooks/useConnectWallet";
import { contractAddress, LOCAL_KEY } from "../config";
import { useViewport } from "../components/viewportContext";
import Web3 from "web3";
import styled from "styled-components";
import { FlexBox, FlexCCBox, FlexSBCBox } from "../components/FlexBox";
import CodeInputBox from "../components/CodeInputBox";
import { useSign } from "../hooks/useSign";
import { Logo, ReturnIcon } from "../assets/image/layoutBox";
import {
  useDisconnect,
  useWeb3Modal,
  useWeb3ModalProvider,
  useWeb3ModalState,
} from "@web3modal/ethers/react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useNoGas } from "../hooks/useNoGas";
import useTipLoding from "../components/ModalContent";
import useUSDTGroup from "../hooks/useUSDTGroup";

const { Header, Content, Footer, Sider } = Layout;

let refereeUserAddress: any;

const LogoContainer = styled(FlexCCBox)`
  width: fit-content;
  font-family: "PingFang SC";
  font-size: 18px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: 0em;

  font-variation-settings: "opsz" auto;
  color: #ffffff;
  > svg {
    margin-right: 8px;
  }
  @media (max-width: 1200px) {
    > svg {
      height: 28px;
    }
  }
`;

const HeaderContainer = styled(Header)`
  opacity: 1;
  background: #0a0a0a;
  margin: 0px auto;
  backdrop-filter: blur(10px);
  padding: 0;
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  .HeaderNav {
    max-width: 1200px;
  }
`;

const SetBox = styled.div`
  display: flex;
  align-items: center;
  height: fit-content;
  .priceBox {
    font-family: "DIN";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    color: #4baf73;
    display: flex;
    align-items: center;
    margin-right: 20px;
  }

  .Connect {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 9px 18px;
    border-radius: 4px;
    opacity: 1;
    box-sizing: border-box;
    border: 1px solid #232323;
    font-family: "Space Grotesk";
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
    &:hover {
      border-radius: 4px;
      opacity: 1;
      background: #262626;
      color: #ffffff;
    }
    > img {
      margin-right: 5px;
    }
  }

  .activeConnect {
    display: flex;
    justify-content: center;
    align-items: center;
    > img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .walletInfo {
      font-family: "Space Grotesk";
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
      > div {
        font-family: "Space Grotesk";
        font-size: 12px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: 0em;
        font-variation-settings: "opsz" auto;
        color: #999999;
      }
    }
  }
`;

const MyLayout = styled(Layout)`
  position: relative;
`;

const AllModal = styled(Modal)`
  z-index: 10000;
  .ant-modal-content {
    overflow: hidden;
    border-radius: 12px;
    opacity: 1;
    background: #0a0a0a;
    box-sizing: border-box;
    border: 1px solid #557930;
    .ant-modal-body {
      position: relative;
      padding: 39px;
    }
  }
  @media (max-width: 1200px) {
    .ant-modal-content {
      .ant-modal-body {
        padding: 24px 15px;
      }
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

const ModalContainer_Close = styled(FlexCCBox)`
  position: absolute;
  z-index: 100;
  top: 25px;
  right: 15px;
  z-index: 100;
`;

export const ModalContainer_Title_Container = styled(FlexCCBox)`
  width: 100%;
  > img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  > svg {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
`;

export const ModalContainer_Title = styled(FlexBox)`
  width: 100%;
  align-items: flex-start;
  font-family: "Space Grotesk";
  font-size: 24px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #ffffff;
  @media (max-width: 1200px) {
    font-size: 18px;
  }
`;

const ModalContainer_Content = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LangItem = styled(FlexCCBox)`
  min-width: 135px;
  padding: 16px;
`;

const InputBox = styled(FlexSBCBox)`
  width: 100%;
  margin: 24px auto 34px;
  .inputContainer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > input {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      border-radius: 4px;
      border-radius: 4px;
      opacity: 1;
      background: #181818;
      box-sizing: border-box;
      border: 1px solid #232323;
      font-family: "Space Grotesk";
      font-size: 30px;
      font-weight: normal;
      line-height: normal;
      text-align: center;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #ffffff;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
      margin: 0;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
    input:focus {
      appearance: none;
      outline: 0;
      box-shadow: 0 0 0 3px rgb(131 192 253 / 50%);
    }
  }
  @media (max-width: 1200px) {
    > input {
      font-size: 24px;
    }
  }
`;

const Btn = styled(FlexCCBox)`
  width: fit-content;
  opacity: 1;
  padding: 12px 32px;
  border-radius: 8px;
  opacity: 1;
  background: #93e63f;
  cursor: pointer;
  font-family: "Space Grotesk";
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0em;
  font-variation-settings: "opsz" auto;
  color: #0a0a0a;
  @media (max-width: 1200px) {
    font-size: 16px;
  }
`;

const ConfirmBtn = styled(FlexCCBox)`
  width: 100%;
  > div {
    width: 100%;
  }
`;
const MobileSlider = styled.div`
  position: fixed;
  top: 56px;
  width: 100%;
  opacity: 1;
  border-top: 1px solid #232323;
  opacity: 1;
  background: #0a0a0a;
  box-shadow: 0px 4px 10px 0px rgba(147, 230, 63, 0.5);
  z-index: 10000000;
`;
const MobileSlider_Menu = styled.div`
  padding: 30px 16px;
  .MenuItem {
    font-family: "Space Grotesk";
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
  }
  .active {
    font-family: "Space Grotesk";
    font-size: 16px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #93e63f;
  }
  > div {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
`;
const MobileSlider_Connect = styled(FlexCCBox)`
  padding: 18px 16px;
  opacity: 1;
  border-top: 1px solid #232323;
  .address {
    display: flex;
    align-content: center;

    justify-content: space-between;
    > div {
      > img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
      font-family: "Space Grotesk";
      font-size: 14px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0em;
      font-variation-settings: "opsz" auto;
      color: #999999;
      height: fit-content;
      &:first-child {
        color: #fff;
      }
    }
  }
  > div {
    cursor: pointer;
    padding: 9px 12px;
    width: 100%;
    border-radius: 4px;
    opacity: 1;
    box-sizing: border-box;
    border: 1px solid #232323;
    font-family: "Space Grotesk";
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
    color: #999999;
  }
`;

const NavContainer = styled(FlexBox)`
  justify-content: flex-start;
  flex: 1;
  padding: 0px 35.5px;
  > div {
    font-family: "Space Grotesk";
    font-size: 16px;
    font-weight: bold;
    line-height: normal;
    letter-spacing: 0em;
    font-variation-settings: "opsz" auto;
  }
  .active {
    color: #93e63f;
  }
`;

const MainLayout: any = () => {
  const web3 = new Web3();
  const codeInputRef = useRef<any>(null);
  let dispatch = useDispatch();
  let token = useSelector<any>((state) => state.token);
  let { t, i18n } = useTranslation();
  let [ItemActive, setItemActive] = useState("/");
  const [InputValue, setInputValue] = useState<any>(null);
  const Navigate = useNavigate();
  const { width } = useViewport();
  const [BindModal, setBindModal] = useState(false);
  const [IsBindState, setIsBindState] = useState(false);
  const { signFun } = useSign();
  const { isNoGasFun } = useNoGas();
  const { walletProvider } = useWeb3ModalProvider();
  const {
    address: web3ModalAccount,
    chainId,
    isConnected,
  } = useWeb3ModalAccount();
  const { selectedNetworkId } = useWeb3ModalState();
  const { open, close } = useWeb3Modal();
  const { disconnect } = useDisconnect();

  const location = useLocation();
  const pathname = startWord(location.pathname);
  const queryParams = new URLSearchParams(location.search);
  const invite = queryParams.get("inviteCode");
  const {
    TOKENBalance,
    TOKENAllowance,
    handleApprove,
    handleTransaction,
    handleUSDTRefresh,
  } = useUSDTGroup(contractAddress?.BTStar, "USDT");
  const [showMask, setShowMask] = useState(false);

  function changeLanguage(lang: any) {
    window.localStorage.setItem(LOCAL_KEY, lang.key);
    i18n.changeLanguage(lang.key);
  }

  // const initalToken =
  //   "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1ODkyIiwic3ViIjoie1widXNlckFkZHJlc3NcIjpcIjB4YjdhY2NiZjQ5ZDMyZjY4MDA0OWRiMDQ0YjhlZmIxZTJmMTgzMzVhZlwiLFwiaWRcIjo1ODkyfSIsImlzcyI6ImFkbWluIiwiaWF0IjoxNzI5NjY2MTcyLCJleHAiOjE3NjA3NzAxNzJ9.muZSze-DNH4RkqBRYQkqh-_HxLuBceKlKjiTHF85Am0";
  const initalToken = localStorage.getItem(
    (web3ModalAccount as string)?.toLowerCase()
  );

  const langArr = [
    { key: "zh-CN", label: "中文简体" },
    { key: "zh-TW", label: "中文繁体" },
    { key: "en", label: "English" },
  ];

  const item = langArr.map((item: any) => {
    return {
      label: (
        <LangItem
          style={{ whiteSpace: "nowrap" }}
          className={
            String(i18n.language) === String(item?.key)
              ? "activeLangItem LangItem"
              : "LangItem"
          }
        >
          {item?.label}
        </LangItem>
      ),
      key: item?.key,
    };
  });

  const menu: any = <Menu onClick={changeLanguage} items={item} />;

  const inputFun = (e: any) => {
    // let value = e.target.value
    // let value = e.target.value.replace(/^[^1-9]+|[^0-9]/g, '')
    let str = e.target.value.trim();
    setInputValue(str);
  };

  const headerIconObj: any = {
    "/": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/Dashboard": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
  };

  // 导航
  const navigateFun = (path: string) => {
    Navigate("/View" + path);
  };

  function menuActive(path: string) {
    if (ItemActive === path) {
      return headerIconObj[path]?.menuActive;
    } else {
      return headerIconObj[path]?.menu;
    }
  }

  function iconActive(path: string) {
    if (ItemActive === path) {
      return headerIconObj[path]?.activeIcon;
    } else {
      return headerIconObj[path]?.Icon;
    }
  }

  const LoginFun = useCallback(
    async (inviteCode = "") => {
      if (web3ModalAccount) {
        // debugger;
        // debugger;
        await signFun((res: any) => {
          Login({
            ...res,
            userAddress: web3ModalAccount as string,
            inviteCode: inviteCode,
          }).then((res: any) => {
            if (res.code === 200) {
              showLoding(false);
              // setBindModal(false);
              dispatch(
                createLoginSuccessAction(
                  web3ModalAccount as string,
                  res.data.token
                )
              );
              SelectBindFun();
              localStorage.setItem(
                (web3ModalAccount as string)?.toLowerCase(),
                res.data.token
              );
            } else {
              showLoding(false);
              addMessage(res.msg);
            }
          });
        }, `userAddress=${web3ModalAccount as string}`);
      } else {
        addMessage("Please link wallet");
      }
    },
    [web3ModalAccount]
  );

  const BindFun = useCallback(async () => {
    if (web3ModalAccount) {
      if (!InputValue) return addMessage(t("5"));
      let res: any = await checkInviteCode(InputValue);
      // debugger;
      if (!res?.data) return addMessage(t("6"));
      await LoginFun(InputValue);
    } else {
      addMessage("Please link wallet");
    }
  }, [web3ModalAccount, InputValue]);

  const SelectBindFun = async () => {
    if (!web3ModalAccount) return;
    new Contracts(walletProvider);
    isNewUser(web3ModalAccount as string).then((res: any) => {
      // debugger;
      if (!!res.data) {
        if (codeInputRef.current) {
          codeInputRef.current?.setCodes(InputValue || null);
        }
        dispatch(createLoginSuccessAction(web3ModalAccount as string, ""));
        setBindModal(true);
      } else {
        setIsBindState(!res.data);
        setBindModal(false);
        dispatch(createLoginSuccessAction(web3ModalAccount as string, ""));

        if (codeInputRef.current) {
          codeInputRef.current?.setCodes(null);
        }
      }
    });
    // await Contracts.example
    //   .userBindInfo(web3ModalAccount as string)
    //   .then((res: any) => {
    //     if (!!res["0"]) {
    //       setIsBindState(!!res["0"]);
    //       setBindModal(false);
    //     } else {
    //       setBindModal(true);
    //     }
    //   });
  };

  const preLoginFun = async () => {
    // 先绑定再登录
    if (!initalToken) await LoginFun();
  };

  useEffect(() => {
    SelectBindFun();
  }, [web3ModalAccount, selectedNetworkId, initalToken, BindModal]);

  useEffect(() => {
    if (!!pathname) {
      setItemActive(pathname ?? "/");
    }
  }, [pathname]);

  useEffect(() => {
    if (!!invite && String(invite).length >= 6) {
      let str = String(invite).length > 6 ? String(invite).slice(0, 6) : invite;
      // debugger;
      setInputValue(str);
    } else {
    }
  }, [web3ModalAccount, selectedNetworkId, invite]);

  useEffect(() => {
    if (!!initalToken) {
      dispatch(
        createLoginSuccessAction(web3ModalAccount as string, initalToken)
      );
    } else {
    }
  }, [web3ModalAccount, token, initalToken]);

  useEffect(() => {
    if (!!web3ModalAccount && !!IsBindState) {
      new Contracts(walletProvider);
      preLoginFun();
    } else {
    }
  }, [IsBindState]);

  useEffect(() => {
    if (!!web3ModalAccount && selectedNetworkId) {
      new Contracts(walletProvider);
    }
  }, [web3ModalAccount, selectedNetworkId, token]);

  return (
    <MyLayout>
      <HeaderContainer>
        <div className="HeaderNav">
          <LogoContainer>
            <Logo
              onClick={() => {
                setShowMask(false);
                Navigate("/View/");
              }}
            ></Logo>
          </LogoContainer>

          {width > 768 && (
            <NavContainer>
              <div className={String(ItemActive) === "/" ? "active" : ""}>
                Home
              </div>
            </NavContainer>
          )}

          {width >= 1200 ? (
            <SetBox>
              {web3ModalAccount ? (
                <>
                  <div
                    className="  pointer activeConnect"
                    // onClick={() => {
                    //   open();
                    // }}
                  >
                    <img src={demo} alt="" />{" "}
                    <div className="walletInfo">
                      {AddrHandle(web3ModalAccount as string, 6, 4)}
                      <div
                        onClick={() => {
                          disconnect();
                          if (!!web3ModalAccount) {
                            dispatch(
                              createLoginSuccessAction(
                                web3ModalAccount as string,
                                ""
                              )
                            );
                            // window.localStorage.clear();
                          }
                        }}
                      >
                        Disconnect
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="Connect  pointer "
                  onClick={() => {
                    open();
                  }}
                >
                  Connect Wallet
                </div>
              )}
            </SetBox>
          ) : (
            <SetBox>
              <img
                src={showMask ? menu_close : menu_fill}
                alt=""
                onClick={() => {
                  setShowMask(!showMask);
                }}
              />
            </SetBox>
          )}
        </div>
      </HeaderContainer>

      <MobileSlider style={{ display: showMask ? "block" : "none" }}>
        <MobileSlider_Menu>
          {/* <div
            className={menuActive("/")}
            onClick={() => {
              setShowMask(false);
              Navigate("/View/");
            }}
          >
            AI Node Key
          </div> */}
          <div
            className={menuActive("/")}
            onClick={() => {
              setShowMask(false);
              Navigate("/View/");
            }}
          >
            Home
          </div>
        </MobileSlider_Menu>
        <MobileSlider_Connect>
          {!!web3ModalAccount ? (
            <div
              className="address"
              onClick={() => {
                open();
              }}
            >
              <div>
                <img src={demo} alt="" />{" "}
                {AddrHandle(web3ModalAccount as string, 6, 4)}
              </div>
              <div
                onClick={() => {
                  disconnect();
                  if (!!web3ModalAccount) {
                    dispatch(
                      createLoginSuccessAction(web3ModalAccount as string, "")
                    );
                    // window.localStorage.clear();
                  }
                }}
              >
                Disconnect
              </div>
            </div>
          ) : (
            <div
              onClick={() => {
                open();
              }}
            >
              Connect Wallet
            </div>
          )}
        </MobileSlider_Connect>
      </MobileSlider>

      <Content className="MainContent">
        <Outlet />
        {!!showMask && (
          <div
            className="Mask"
            onClick={() => {
              setShowMask(false);
            }}
          ></div>
        )}
      </Content>

      <AllModal
        visible={false}
        className="Modal"
        centered
        width={"461px"}
        closable={false}
        footer={null}
      >
        <ModalContainer>
          <ModalContainer_Title>
            {t("Bind referral code")}
            <ModalContainer_Close>
              {" "}
              {/* <img
                src={closeIcon}
                alt=""
                onClick={() => {
                  // setBindModal(false);
                }}
              /> */}
            </ModalContainer_Close>
          </ModalContainer_Title>
          <ModalContainer_Content>
            <InputBox>
              <CodeInputBox
                ref={codeInputRef}
                defaultCode={InputValue ?? null}
                onValueChange={(codes: any) => setInputValue(codes)}
              />
            </InputBox>
            <ConfirmBtn>
              <Btn
                onClick={() => {
                  BindFun();
                }}
              >
                {t("Confirm")}
              </Btn>
            </ConfirmBtn>
          </ModalContainer_Content>
        </ModalContainer>
      </AllModal>
    </MyLayout>
  );
};
export default MainLayout;
