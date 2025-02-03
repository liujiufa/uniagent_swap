import Token from "./ABI/ERC20Token.json";
import NFTManage from "./ABI/NFTManage.json";
import Nstake from "./ABI/Nstake.json";
import NFT from "./ABI/NFT.json";
import Bridge from "./ABI/Bridge.json";
// 正式
export const isMain = false;
export const LOCAL_KEY = "UniAgent_LANG";
const url = window.location.hostname;
const result = url.split(".").slice(1).join(".");
export let baseUrl: string = isMain
  ? `https://api.uniagent.co/api/`
  : "http://47.239.255.25" + "/api";
//  "https://yhhyn.com/" + "api"
// "https://kf-panda.com/" + "api";
// "http://172.20.10.2:28889/";
export let ContractUrl: string = isMain
  ? "https://bscscan.com/address/"
  : "https://testnet.bscscan.com/address/";
export let BlockUrl: string = isMain
  ? "https://bscscan.com/tx/"
  : "https://testnet.bscscan.com/tx/";
export let SuShiSwapUrl: string = "https://www.sushi.com/swap";
export let RewardType: any = { "1": "16", "2": "17" };
export const BitNumber = 8;

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
};

export const Main: contractAddressType = {
  USDT: "0x55d398326f99059fF775485246999027B3197955",
  nft: "0xa21c8a2FD49Eb7e008B452F1b2573Bbff0ea97FD",
  NFTManage: "0x312004832F8A8a35587a297Ee19DB90aA7D291e5",
};

const Test = {
  USDTBSC: "0x2b11640f31b84dc727841FE6B5a905D366A00e78",
  BridgeBSC: "0x152Be12C4205095467a5F6fFe73c6f315f33455f",
  USDTUNI: "0x11Cb2DD8a83d9A231Bf79E7A3ad3f8d39FD02c31",
  BridgeUNI: "0x07fff13bFdF7D411D887eF14AB5A092254F0ec7B",
  NFT: "0x182cFca36E3678ae45e9cBc47880Ab034882F9A5",
  NFTManage: "0x0A8C16f9Ed042cf71BeB49e8d8854D189c704aDb",
  Stake: "0xe9865261f234323e8E77F35E8D111c65650120F7",
};

export let SwapUrl: string = isMain
  ? `https://pancakeswap.finance/swap?chain=bsc&inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=${Main?.MBK}`
  : "https://pancakeswap.finance/swap?chain=bscTestnet&inputCurrency=0x2b11640f31b84dc727841FE6B5a905D366A00e78&outputCurrency=0xdA99fA57019FB1DFC1AAea892e5190a91236A840";
export const contractAddress: contractAddressType = isMain ? Main : Test;
