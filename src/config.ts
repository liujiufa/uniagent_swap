import Token from "./ABI/ERC20Token.json";
import NFTManage from "./ABI/NFTManage.json";
import Nstake from "./ABI/Nstake.json";
import NFT from "./ABI/NFT.json";
import Bridge from "./ABI/Bridge.json";
import UniAgentRouter from "./ABI/UniAgentRouter.json";
import UniAgentFactory from "./ABI/UniAgentFactory.json";
import { defineChain } from "@reown/appkit/networks";
// 正式
export const isMain = true;
export const curentBSCChainId = isMain ? 56 : 97;
export const curentUNIChainId = isMain ? 656898 : 656231;
export const LOCAL_KEY = "PIJS_LANG";
const url = window.location.hostname;
const result = url.split(".").slice(1).join(".");
export let baseUrl: string = isMain
  ? `https://pijswap.xyz/pjisswap-api`
  : "http://82.156.97.39:8880/";
//  "https://yhhyn.com/" + "api"
// "https://kf-panda.com/" + "api";
// "http://172.20.10.2:28889/";
export let ContractUrl: string = isMain
  ? "https://bscscan.com/address/"
  : "https://testnet.bscscan.com/address/";
export let BlockUrl: string = isMain
  ? "https://bscscan.com/tx/"
  : "https://testnet.bscscan.com/tx/";
export const BitNumber = 8;
export const GoTo = "https://node.pijswap.com/";
// Documentation
export const Documentation = "https://pijswap.gitbook.io/pijswap";
// InviteRebateKOLApplication
export const InviteRebateKOLApplication = "https://pijswap.gitbook.io/pijswap";
// TermsofService
export const TermsofService =
  "https://pijswap.gitbook.io/pijswap/terms-of-service";
// TokenEconomicModel
export const TokenEconomicModel =
  "https://pijswap.gitbook.io/pijswap/token-economic-model";
//@ts-ignore
export const customNetwork_BSC = defineChain({
  id: 56,
  caipNetworkId: "eip155:56",
  chainNamespace: "eip155",
  name: "BSC",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: {
      http: ["https://bsc-dataseed.binance.org"],
      webSocket: ["WS_RPC_URL"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://bscscan.com",
    },
  },
});

export const customNetwork_BSC_TEST = defineChain({
  id: 97,
  caipNetworkId: "eip155:97",
  chainNamespace: "eip155",
  name: "BSC",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: {
      http: ["https://bsc-testnet-rpc.publicnode.com"],
      webSocket: ["WS_RPC_URL"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
    },
  },
});

export const customNetwork_UNI = defineChain({
  id: 656898,
  caipNetworkId: "eip155:656898",
  chainNamespace: "eip155",
  name: "UNI",
  nativeCurrency: {
    decimals: 18,
    name: "UAC",
    symbol: "UAC",
  },
  rpcUrls: {
    default: {
      http: ["http://chain.uniagent.co/"],
    },
  },
});

export const customNetwork_UNI_TEST = defineChain({
  id: 656231,
  caipNetworkId: "eip155:656231",
  chainNamespace: "eip155",
  name: "UNI",
  nativeCurrency: {
    decimals: 18,
    name: "UAC",
    symbol: "UAC",
  },
  rpcUrls: {
    default: {
      http: ["http://chain.51time.xyz/"],
      webSocket: ["WS_RPC_URL"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://etherscan.io",
    },
  },
});

export const defaultNetwork: any = {
  chainId: 656898,
  name: "UNI",
  currency: "UAC",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "http://chain.uniagent.co/",
};
export const loginNetworkId = [
  { id: isMain ? 56 : 97, name: "BSC", bridgeChainId: 1 },
  { id: isMain ? 656898 : 656231, name: "UniAgent", bridgeChainId: 2 },
];

export const NETWORK_PARAMS = {
  chainId: "0xA0062", // 以太坊主网的 Chain ID
  chainName: "UNI",
  nativeCurrency: {
    name: "UAC",
    symbol: "UAC",
    decimals: 18,
  },
  rpcUrls: ["http://chain.uniagent.co/"], // 替换为你的 Infura 项目 ID
  blockExplorerUrls: ["https://etherscan.io"],
};

interface abiObjType {
  [propName: string]: any;
}

interface contractAddressType {
  [propName: string]: string;
}

export const abiObj: abiObjType = {
  USDTBSC: Token,
  USDTUNI: Token,
  NFTManage: NFTManage,
  Stake: Nstake,
  NFT: NFT,
  BridgeBSC: Bridge,
  BridgeUNI: Bridge,
  Router: UniAgentRouter,
  Factory: UniAgentFactory,
};

export const Main: contractAddressType = {
  USDTBSC: "0x55d398326f99059fF775485246999027B3197955",
  BridgeBSC: "0x6f7cDbB867088D5945b465726834a782a2c0D7D0",
  USDTUNI: "0x74cA830003Bc76693830d37DCcE9C56be78Ae66C",
  BridgeUNI: "0x68d1CbEF2D485052385dD2a209F6F105528838B5",
  PIJSBSC: "0x74cA830003Bc76693830d37DCcE9C56be78Ae66C",
  PiBSC: "0x74cA830003Bc76693830d37DCcE9C56be78Ae66C",
  Factory: "0x55D3a5458be5AFc639858825FaBc34CD3D5a6117",
  WUAC: "0x001C41f7b0cB226a19dfBEc7a18C8a8DA249eC46",
  Router: "0x51d5273F6Eb69e37C86De5bDCF6efb0424255A5a",
};

const Test = {
  USDTBSC: "0x2b11640f31b84dc727841FE6B5a905D366A00e78",
  BridgeBSC: "0x31221fBcCa8d331E867dd44B9a01086aF35ad851",
  USDTUNI: "0xBda69B1320e7FEa4b16Ac82aD60116e0424A006f",
  BridgeUNI: "0x69B92335D53C6fe719169BD4BDeffd6ED2833a4a",
  PIJSBSC: "0xBda69B1320e7FEa4b16Ac82aD60116e0424A006f",
  PiBSC: "0xBda69B1320e7FEa4b16Ac82aD60116e0424A006f",
  Factory: "0x82d3B7112eFD2127cD1eE771286D1cA1Ee3EfC2a",
  WUAC: "0xFB572Ae3f87E322f65D2869e08a8b283501614aF",
  Router: "0xf9D1e5Ce5b2851625A9E73859b15A14bbad39dC8",
};
export const contractAddress: contractAddressType = isMain ? Main : Test;
