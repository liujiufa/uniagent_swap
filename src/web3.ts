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
      : ["http://192.252.179.83:8546/"],
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
  balanceOf(addr: string, tokenAddress: string) {
    let obj = new this.web3.eth.Contract(abiObj["USDTBSC"], tokenAddress);
    // debugger;
    return obj?.methods.balanceOf(addr).call({ from: addr });
  }
  //查询授权
  Tokenapprove(addr: string, toaddr: string, tokenAddress: string) {
    let obj = new this.web3.eth.Contract(abiObj["USDTBSC"], tokenAddress);
    return obj?.methods.allowance(addr, toaddr).call({ from: addr });
  }
  symbol(addr: string, tokenAddress: string) {
    let obj = new this.web3.eth.Contract(abiObj["USDTBSC"], tokenAddress);
    return obj?.methods.symbol().call({ from: addr });
  }
  //授权1
  approve(addr: string, toaddr: string, tokenAddress: string, value: string) {
    let obj = new this.web3.eth.Contract(abiObj["USDTBSC"], tokenAddress);
    var amount = Web3.utils.toWei(String(Number(value) + 1));
    console.log(toaddr, amount, "########", obj, "*******");
    return obj?.methods
      .approve(toaddr, amount)
      .send({ from: addr, gasPrice: "5000000000" });
  }

  //授权所有NFT
  setApprovalForAll(addr: string, toAddr: string, isApprova: boolean) {
    this.verification("NFT");
    return this.contract.NFT?.methods
      .setApprovalForAll(toAddr, isApprova)
      .send({ from: addr, gasPrice: "5000000000" });
  }

  //判断NFT授权
  isApprovedForAll(addr: string, toAddr: string) {
    this.verification("NFT");
    return this.contract.NFT?.methods
      .isApprovedForAll(addr, toAddr)
      .call({ from: addr });
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

  deposite(addr: string, data: any, contractAddress: any) {
    // debugger;

    let obj = new this.web3.eth.Contract(abiObj?.BridgeBSC, contractAddress);
    // var usdtAmounted = Web3.utils.toWei(usdtAmount + "", "ether");
    // console.log(usdtAmounted, reciever, order, chainId, "erer");
    return obj?.methods
      .deposite(data)
      .send({ from: addr, gasPrice: "2000000000" });
  }
  // deposite(
  //   addr: string,
  //   usdtAmount: any,
  //   reciever: string,
  //   order: any,
  //   chainId: any,
  //   contractAddress: any
  // ) {
  //   // debugger;

  //   let obj = new this.web3.eth.Contract(abiObj?.BridgeBSC, contractAddress);
  //   var usdtAmounted = Web3.utils.toWei(usdtAmount + "", "ether");
  //   console.log(usdtAmounted, reciever, order, chainId, "erer");
  //   return obj?.methods
  //     .deposite(usdtAmounted, reciever, order, chainId)
  //     .send({ from: addr, gasPrice: "2000000000" });
  // }

  stakeAiNodes(addr: string, arr: any) {
    this.verification("Stake");
    let Arr: any = arr.map(Number);
    return this.contract.Stake?.methods
      .stakeAiNodes(Arr)
      .send({ from: addr, gasPrice: "2000000000" });
  }
  lightUpEdgeNode(addr: string, arr: any, price: any) {
    this.verification("Stake");
    let Arr: any = arr.map(Number);
    var amounted = Web3.utils.toWei(price + "", "ether");

    return this.contract.Stake?.methods
      .lightUpEdgeNode(Arr)
      .send({ from: addr, gasPrice: "2000000000", value: amounted });
  }
  unStakeAiNodes(addr: string, arr: any) {
    this.verification("Stake");
    let Arr: any = arr.map(Number);
    // debugger;
    return this.contract.Stake?.methods
      .unStakeAiNodes(Arr)
      .send({ from: addr, gasPrice: "2000000000" });
  }
  stakeEdgeNode(addr: string, num: any, amount: any) {
    this.verification("Stake");
    // debugger;
    var amounted = Web3.utils.toWei(amount + "", "ether");

    return this.contract.Stake?.methods
      .stakeEdgeNode(num)
      .send({ from: addr, gasPrice: "2000000000", value: amounted });
  }
  swapExactTokensForETH(
    addr: string,
    amount: any,
    amountMin: any,
    Arr: any,
    contractAddress: any
  ) {
    // this.verification("Router");

    let obj = new this.web3.eth.Contract(abiObj?.Router, contractAddress);
    var amounted = Web3.utils.toWei(amount + "", "ether");
    var amountOutMined = Web3.utils.toWei(amountMin + "", "ether");
    let deadline: number = Math.floor(Date.now() / 1000) + 60;
    return obj?.methods
      .swapExactTokensForETH(amounted, amountOutMined, Arr, addr, deadline)
      .send({ from: addr, gasPrice: "2000000000" });
  }
  swapExactETHForTokens(
    addr: string,
    amount: any,
    Arr: any,
    contractAddress: any
  ) {
    // this.verification("Router");
    let obj = new this.web3.eth.Contract(abiObj?.Router, contractAddress);
    var amounted = Web3.utils.toWei(amount + "", "ether");
    let deadline: number = Math.floor(Date.now() / 1000) + 60;
    console.log(0, Arr, addr, deadline, "debugger");
    return obj?.methods
      .swapExactETHForTokens(0, Arr, addr, deadline)
      .send({ from: addr, gasPrice: "2000000000", value: amounted });
  }
  addLiquidityETH(
    addr: string,
    tokenAddress: string,
    amount: any,
    USDTamount: any,
    contractAddress: any
  ) {
    // this.verification("Router");
    let obj = new this.web3.eth.Contract(abiObj?.Router, contractAddress);
    var amounted = Web3.utils.toWei(amount + "", "ether");
    var USDTamounted = Web3.utils.toWei(USDTamount + "", "ether");
    let deadline: number = Math.floor(Date.now() / 1000) + 60;
    console.log(
      tokenAddress,
      0,
      0,
      0,
      addr,
      deadline,
      amounted,
      "addLiquidity"
    );
    return obj?.methods
      .addLiquidityETH(tokenAddress, USDTamounted, 0, 0, addr, deadline)
      .send({ from: addr, gasPrice: "2000000000", value: amounted });
  }
  removeLiquidityETH(
    addr: string,
    tokenAddress: string,
    LPamount: any,
    contractAddress: any
  ) {
    // this.verification("Router");
    let obj = new this.web3.eth.Contract(abiObj?.Router, contractAddress);
    var LPamounted = Web3.utils.toWei(LPamount + "", "ether");
    let deadline: number = Math.floor(Date.now() / 1000) + 60;

    return obj?.methods
      .removeLiquidityETH(tokenAddress, LPamounted, 0, 0, addr, deadline)
      .send({ from: addr, gasPrice: "2000000000" });
  }
  addLiquidityETHCall(
    addr: string,
    tokenAddress: string,
    amount: any,
    USDTamount: any,
    contractAddress: any
  ) {
    // this.verification("Router");
    let obj = new this.web3.eth.Contract(abiObj?.Router, contractAddress);
    var amounted = Web3.utils.toWei(amount + "", "ether");
    var USDTamounted = Web3.utils.toWei(USDTamount + "", "ether");
    let deadline: number = Math.floor(Date.now() / 1000) + 60;
    debugger;
    return obj?.methods
      .addLiquidityETH(tokenAddress, USDTamounted, 0, 0, addr, deadline)
      .call({ from: addr });
  }
  getAmountsOut(addr: string, amount: any, Arr: any, contractAddress: any) {
    // this.verification("Router");
    let obj = new this.web3.eth.Contract(abiObj?.Router, contractAddress);
    var amounted = Web3.utils.toWei(amount + "", "ether");
    return obj?.methods
      .getAmountsOut(amounted, Arr)
      .call({ from: addr, gasPrice: "2000000000" });
  }
  getPair(addr: string, addr1: any, addr2: any, contractAddress: any) {
    // this.verification("Factory");
    let obj = new this.web3.eth.Contract(abiObj?.Factory, contractAddress);

    // var amounted = Web3.utils.toWei(amount + "", "ether");
    return obj?.methods
      .getPair(addr1, addr2)
      .call({ from: addr, gasPrice: "2000000000" });
  }
}
