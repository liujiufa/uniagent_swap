import { useCallback, useMemo } from "react";
import { Contract } from "web3-eth-contract";
import { provider } from "web3-core";
import Web3 from "web3";
import { abiObj, contractAddress, isMain } from "./config";
import BigNumber from "big.js";
import { log } from "console";
declare let window: any;
interface contractType {
  [propName: string]: Contract;
}
export const ChainId = {
  // BSC: "0x61",
  BSC: isMain ? "0x38" : "0x61",
};
//切换链
const SCAN_ADDRESS = {
  [ChainId.BSC]: "https://scan.demonchain.io/",
};
//配置连接链的信息
export const networkConf = {
  [ChainId.BSC]: {
    // chainId: '0x61',
    chainId: isMain ? "0x38" : "0x61",
    chainName: "BSC",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: isMain
      ? ["https://bsc-dataseed.binance.org/"]
      : ["https://data-seed-prebsc-2-s1.bnbchain.org:8545"],
    blockExplorerUrls: [SCAN_ADDRESS[ChainId.BSC]],
  },
};

export class Contracts {
  //单例
  static example: Contracts;
  web3: Web3;
  contract: contractType = {};
  constructor(library: any) {
    console.log(library, "library");

    this.web3 = new Web3(library);
    //保存实例到静态属性
    Contracts.example = this;
  }
  //判断合约是否实例化
  verification(contractName: string) {
    if (!this.contract[contractName]) {
      this.contract[contractName] = new this.web3.eth.Contract(
        abiObj[contractName],
        contractAddress[contractName]
      );
    }
  }
  //合约的方法

  //查询gas
  getGasPrice(addr: string) {
    return this.web3.eth.getGasPrice();
  }
  //查询BNB余额
  getBalance(addr: string) {
    return this.web3.eth.getBalance(addr);
  }
  //查询余额
  balanceOf(addr: string, contractName: string) {
    this.verification(contractName);
    let obj = new this.web3.eth.Contract(
      abiObj[contractName],
      contractAddress[contractName]
    );
    return obj?.methods.balanceOf(addr).call({ from: addr });
  }
  //查询授权
  Tokenapprove(addr: string, toaddr: string, contractName: string) {
    this.verification(contractName);
    let obj = new this.web3.eth.Contract(
      abiObj[contractName],
      contractAddress[contractName]
    );
    return obj?.methods.allowance(addr, toaddr).call({ from: addr });
  }
  symbol(addr: string, contractName: string) {
    this.verification(contractName);
    let obj = new this.web3.eth.Contract(
      abiObj[contractName],
      contractAddress[contractName]
    );
    return obj?.methods.symbol().call({ from: addr });
  }
  //授权1
  approve(addr: string, toaddr: string, contractName: string, value: string) {
    this.verification(contractName);
    let obj = new this.web3.eth.Contract(
      abiObj[contractName],
      contractAddress[contractName]
    );
    var amount = Web3.utils.toWei(String(Number(value)));
    console.log(toaddr, amount, "########", obj, "*******");
    return obj?.methods
      .approve(toaddr, amount)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  //签名数据
  Sign(addr: string, msg: string) {
    console.log(msg, "msg");
    return this.web3.eth.personal.sign(
      this.web3.utils.utf8ToHex(msg) as string,
      addr,
      "123"
    );
  }
  //奖励领取
  withdrawReward(addr: string, data: string, contractName: string) {
    // this.verification("Distribute");
    let obj = new this.web3.eth.Contract(
      abiObj[contractName],
      contractAddress[contractName]
    );
    console.log(data, "data");
    return obj?.methods
      .withdrawReward(data)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  //查询绑定
  userBindInfo(addr: string) {
    this.verification("Referrer");
    return this.contract.Referrer?.methods
      .userBindInfo(addr)
      .call({ from: addr });
  }

  bind(addr: string, inviteCode: string) {
    this.verification("Referrer");
    return this.contract.Referrer?.methods
      .bind(inviteCode)
      .send({ from: addr, gasPrice: "5000000000" });
  }
  price() {
    this.verification("Nodes");
    return this.contract.Nodes?.methods.price().call();
  }
  mint(addr: string, data: string) {
    this.verification("NFTManage");
    // debugger;
    return this.contract.NFTManage?.methods
      .mint(data)
      .send({ from: addr, gasPrice: "2000000000" });
  }
}
