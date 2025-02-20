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
export let RewardType: any = { "1": "16", "2": "17" };
export const BitNumber = 8;
export const GoTo = "https://node.pijswap.xyz/";
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
export const mainnet = {
  "0x1": {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  },
  "0x38": {
    chainId: 56,
    name: "BSC",
    currency: "BNB",
    explorerUrl: "https://bscscan.com",
    rpcUrl: "https://bsc-dataseed.binance.org",
  },
  "0x61": {
    chainId: 97,
    name: "BSC",
    currency: "BNB",
    explorerUrl: "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
    rpcUrl: "https://bsc-testnet-rpc.publicnode.com",
  },
  "0xa0367": {
    chainId: 656231,
    name: "BSC",
    currency: "BNB",
    explorerUrl: "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
    rpcUrl: "http://192.252.179.83:8546/",
  },
};
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
  chainId: 656231,
  name: "UNI",
  currency: "UAC",
  explorerUrl: "http://chain.51time.xyz/",
  rpcUrl: "https://etherscan.io",
};
export const loginNetworkId = [
  { id: 97, name: "BSC", bridgeChainId: 1 },
  { id: 656231, name: "UniAgent", bridgeChainId: 2 },
];

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
  USDT: "0x55d398326f99059fF775485246999027B3197955",
  BridgeBSC: "0x152Be12C4205095467a5F6fFe73c6f315f33455f",
  USDTUNI: "0x11Cb2DD8a83d9A231Bf79E7A3ad3f8d39FD02c31",
  BridgeUNI: "0x07fff13bFdF7D411D887eF14AB5A092254F0ec7B",
  Stake: "0xe9865261f234323e8E77F35E8D111c65650120F7",
  Factory: "0xDA1253700dF68930C81361D0769fBD27fB4fb253",
  WUAC: "0x27e199Afb97612542d8dcD88C8DCE83b4b516992",
  Router: "0x41f60550b884dAA6435C9435b9794F20cfD994D8",
};

const Test = {
  USDTBSC: "0x2b11640f31b84dc727841FE6B5a905D366A00e78",
  BridgeBSC: "0x152Be12C4205095467a5F6fFe73c6f315f33455f",
  USDTUNI: "0x88ad17e26f012ADC36D4BDd287f382BE7C7D61Ac",
  BridgeUNI: "0xC2Cb2362241a0c973C3d83477f6105E082b8a96B",

  Factory: "0x82d3B7112eFD2127cD1eE771286D1cA1Ee3EfC2a",
  WUAC: "0xFB572Ae3f87E322f65D2869e08a8b283501614aF",
  Router: "0xf9D1e5Ce5b2851625A9E73859b15A14bbad39dC8",
};
export const contractAddress: contractAddressType = isMain ? Main : Test;
