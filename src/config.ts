import Token from "./ABI/ERC20Token.json";
import NFTManage from "./ABI/NFTManage.json";
// 正式
export const isMain = false;
export const LOCAL_KEY = "UniAgent_LANG";
const url = window.location.hostname;
const result = url.split(".").slice(1).join(".");
export let baseUrl: string = isMain
  ? `https://api.uniagent.co/api/`
  : "http://47.239.255.25:28889/";
//  "https://yhhyn.com/" + "api"
// "https://kf-panda.com/" + "api";
// "http://192.168.1.37:28888/";
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
};

interface abiObjType {
  [propName: string]: any;
}

interface contractAddressType {
  [propName: string]: string;
}

export const abiObj: abiObjType = {
  USDT: Token,
  NFTManage: NFTManage,
};

export const Main: contractAddressType = {
  USDT: "0x55d398326f99059fF775485246999027B3197955",
  nft: "0xa21c8a2FD49Eb7e008B452F1b2573Bbff0ea97FD",
  NFTManage: "0x312004832F8A8a35587a297Ee19DB90aA7D291e5",
};

const Test = {
  USDT: "0x2b11640f31b84dc727841FE6B5a905D366A00e78",
  nft: "0x113D5ef4c6FE6f2edBcF6915Bf7582c09F342499",
  NFTManage: "0x0A8C16f9Ed042cf71BeB49e8d8854D189c704aDb",
};

export let SwapUrl: string = isMain
  ? `https://pancakeswap.finance/swap?chain=bsc&inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=${Main?.MBK}`
  : "https://pancakeswap.finance/swap?chain=bscTestnet&inputCurrency=0x2b11640f31b84dc727841FE6B5a905D366A00e78&outputCurrency=0xdA99fA57019FB1DFC1AAea892e5190a91236A840";
export const contractAddress: contractAddressType = isMain ? Main : Test;
