import Token from "./ABI/ERC20Token.json";
import NFTManage from "./ABI/NFTManage.json";
import Nstake from "./ABI/Nstake.json";
import NFT from "./ABI/NFT.json";
import Bridge from "./ABI/Bridge.json";
import UniAgentRouter from "./ABI/UniAgentRouter.json";
import UniAgentFactory from "./ABI/UniAgentFactory.json";
import NodeDistribute from "./ABI/NodeRewardDistribute.json";
import PIJSPool from "./ABI/PIJSPool.json";
import LPPledge from "./ABI/PIJSStake.json";
import { defineChain } from "@reown/appkit/networks";
// 正式
export const isMain = false;
export const curentBSCChainId = isMain ? 56 : 97;
export const curentUNIChainId = isMain ? 656898 : 656898;
export const LOCAL_KEY = "PIJS_LANG";
export let baseUrl: string = isMain
  ? window.location.origin + "/api/"
  : "https://alpha.pijswap.com/api/";

export let ContractUrl: string = isMain
  ? "https://bscscan.com/address/"
  : "https://testnet.bscscan.com/address/";
export let BlockUrl: string = isMain
  ? "https://bscscan.com/tx/"
  : "https://testnet.bscscan.com/tx/";
export const BitNumber = 8;
export const GoTo = "https://airdrop.pijswap.com/";
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
  { id: isMain ? 656898 : 656898, name: "UniAgent", bridgeChainId: 2 },
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
  LPToken: Token,
  NFTManage: NFTManage,
  Stake: Nstake,
  NFT: NFT,
  BridgeBSC: Bridge,
  BridgeUNI: Bridge,
  Router: UniAgentRouter,
  Factory: UniAgentFactory,
  NodeDistribute: NodeDistribute,
  LPPledge: LPPledge,
};

export const Main: contractAddressType = {
  USDTBSC: "0x55d398326f99059fF775485246999027B3197955",
  BridgeBSC: "0x6f7cDbB867088D5945b465726834a782a2c0D7D0",
  USDTUNI: "0x74cA830003Bc76693830d37DCcE9C56be78Ae66C",
  BridgeUNI: "0x68d1CbEF2D485052385dD2a209F6F105528838B5",
  PIJSBSC: "0x74cA830003Bc76693830d37DCcE9C56be78Ae66C",
  PiBSC: "0x74cA830003Bc76693830d37DCcE9C56be78Ae66C",
  UACFactory: "0x55D3a5458be5AFc639858825FaBc34CD3D5a6117",
  WUAC: "0x001C41f7b0cB226a19dfBEc7a18C8a8DA249eC46",
  UACRouter: "0x51d5273F6Eb69e37C86De5bDCF6efb0424255A5a",
  WBNB: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
  PIJSFactory: "0x748C54e7bd5592F755DDFFE6Ad59b6Ef519E0635",
  PIJSRouter: "0x83728DF7204BDbDE3cd23122a224F36C0Dbd6892",
};

const Test = {
  USDTBSC: "0xEF8e449696AEd4Dd98193485E19f8b8614b40643",
  BridgeBSC: "0x31221fBcCa8d331E867dd44B9a01086aF35ad851",
  USDTUNI: "0xBda69B1320e7FEa4b16Ac82aD60116e0424A006f",
  BridgeUNI: "0x69B92335D53C6fe719169BD4BDeffd6ED2833a4a",
  PIJSBSC: "0x13E34f9CD20608f3a6c708f6226B86d776311255",
  PiBSC: "0xBda69B1320e7FEa4b16Ac82aD60116e0424A006f",
  UACFactory: "0x82d3B7112eFD2127cD1eE771286D1cA1Ee3EfC2a",
  WUAC: "0xFB572Ae3f87E322f65D2869e08a8b283501614aF",
  UACRouter: "0xf9D1e5Ce5b2851625A9E73859b15A14bbad39dC8",

  WBNB: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
  PIJSFactory: "0x85e3bF8fD6234b9AA278a7C3738A254861bDAe02",
  PIJSRouter: "0x3fc1d9B004387d8464F1e89a471D226194d88F90",

  NodeDistribute: "0x3FA2dc7af032b0a31A1426a4A9e811105dF8F0C4",
  StakingRewardDistribute: "0xa12a0EB1BaB4f9fE924749411e3133ea8479Cc94",
  // LP&&单币
  LPPledge: "0x598175B1C823bbADa7256763267e3ec8080f0178",
  LPToken: "0xB030F713f504645864c13A9E98942a40D93d7181",
};

export const contractAddress: contractAddressType = isMain ? Main : Test;
