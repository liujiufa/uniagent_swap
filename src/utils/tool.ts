import dayjs from "dayjs";
import store from "../store";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
  createAddMessageAction,
  createSetLodingAction,
} from "../store/actions";
import relativeTime from "dayjs/plugin/relativeTime";
import BigNumber from "big.js";
import Web3 from "web3";

export function toThousands(num: string) {
  let numArr = num.split(".");
  if (numArr.length > 1) {
    return parseFloat(numArr[0]).toLocaleString() + "." + numArr[1];
  } else {
    return parseFloat(numArr[0]).toLocaleString();
  }
}
//用户地址处理方法
export function AddrHandle(
  addr: string,
  start = 4,
  end = 4,
  replace = "..."
): string | undefined {
  if (!addr) {
    return;
  }
  let r = new RegExp("(.{" + start + "}).*(.{" + end + "})");
  let addrArr: RegExpMatchArray | null = addr.match(r);
  return addrArr![1] + replace + addrArr![2];
}
export function HowLongAgo(time: number) {
  dayjs.extend(relativeTime);
  var a = dayjs();
  return a.to(new Date(time));
}

export function GetQueryString(name: string) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  // console.log(window.location)
  var r = window.location.search.slice(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

export function JudgmentNumber(number: string) {
  let numArr = number.split(".");
  if (numArr.length > 1) {
    return numArr[1].length > 18;
  }
  return false;
}
// 不四舍五入
export function NumSplic(val: any, len: number = 6) {
  var f = parseFloat(val);
  if (isNaN(f)) {
    return false;
  }
  var s = val.toString();
  if (s.indexOf(".") > 0) {
    let f = s.split(".")[1].substring(0, len);
    s = s.split(".")[0] + "." + f;
  }
  var rs = s.indexOf(".");
  if (rs < 0) {
    rs = s.length;
    s += ".";
  }
  while (s.length <= rs + len) {
    s += "0";
  }
  return s;
}
// 不补0
export function NumSplic1(val: any, len: number = 4) {
  var f = parseFloat(val);
  if (isNaN(f)) {
    return "-";
  }
  var s = val.toString();
  if (s.indexOf(".") > 0) {
    let f = s.split(".")[1].substring(0, len);
    s = s.split(".")[0] + "." + f;
  }
  return s;
}
// 截断小数（不四舍五入）
export function getBit(value: number, bit = 5) {
  let str = value.toString();
  let strIndex = str.indexOf(".");
  if (strIndex === -1) return str;
  str = str.substring(0, strIndex + bit);
  // console.log(str, bit);
  // console.log(typeof str,'getBit值')
  return str;
}

export function numberDivision() {}

export function showLoding(isShow: boolean) {
  store.dispatch(createSetLodingAction(isShow));
}

export function addMessage(msg: string) {
  store.dispatch(
    createAddMessageAction({
      message: msg,
      index: store.getState().message.length,
    })
  );
}
export function isApprove(price: number | string, Approve: string) {
  return new BigNumber(Approve).gte(price);
}
export function dateFormat(fmt: string, date: Date) {
  let ret;
  const opt: { [key: string]: string } = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}
export function getUTCTime() {
  let d1: any = new Date();
  let d2: any = new Date(
    d1.getUTCFullYear(),
    d1.getUTCMonth(),
    d1.getUTCDate(),
    d1.getUTCHours(),
    d1.getUTCMinutes(),
    d1.getUTCSeconds()
  );
  return Date.parse(d1);
}
export function getFullNum(num: any) {
  //处理非数字
  if (isNaN(num)) {
    return num;
  }
  //处理不需要转换的数字
  var str = "" + num;
  if (!/e/i.test(str)) {
    return num;
  }
  return num.toFixed(18).replace(/\.?0+$/, "");
}

//订阅数据send模式
export function initWebSocket(
  url: string,
  subscribe: string,
  sendUrl: string,
  data: any,
  callback: any
) {
  let socket = new SockJS(url);
  const obj: any = {};
  obj.stompClient = Stomp.over(socket);
  obj.stompClient.connect(
    {},
    () => {
      obj.subscription = obj.stompClient.subscribe(subscribe, (data: any) => {
        var resdata = JSON.parse(data.body);
        callback(resdata);
      });
      obj.sendTimer = setInterval(() => {
        obj.stompClient.send(
          sendUrl,
          { "Content-Type": "application/json;charset=UTF-8" },
          JSON.stringify({ ...data })
        );
        console.log(data, sendUrl, "推送数据12");
      }, 2000);
    },
    function () {}
  );
  obj.stompClient.ws.onclose = function () {};
  return obj;
}
export function getWebsocketData(
  url: string,
  subscribe: string,
  callback: any
) {
  console.log(url, subscribe);
  var stompClient: any;
  var socket = new SockJS(url);
  stompClient = Stomp.over(socket);
  stompClient.connect(
    {},
    function () {
      stompClient.subscribe(subscribe, function (data: any) {
        console.log(data.body);
        callback(JSON.parse(data.body));
      });
    },
    function () {}
  );
  stompClient.ws.onclose = function () {};
  return stompClient;
}

export function startWord(name: string) {
  if (name.startsWith("/View")) return name.slice(5);
  return "";
}

export function EthertoWei(amount: string) {
  let amounted = Web3.utils.fromWei(amount + "", "ether");
  // console.log(amounted, typeof (amounted), 'eht');

  return amounted;
}

export const decimalNum = (
  num: string | number = 0,
  decimal?: string | number,
  delimiter = "",
  currencySymbol = ""
) => {
  decimal ??= 2;

  const big = num ? num.toString() : "0";

  const negativeNChar = Number(big) < 0 ? "-" : "";

  const bigArr = (Number(big) < 0 ? big.slice(1) : big).toString().split(".");
  let intStr = "";
  let decStr = bigArr[1]?.slice(0, Number(decimal)) || "";

  while (!Number(decStr[decStr.length - 1]) && !!decStr) {
    decStr = decStr.slice(0, decStr.length - 1);
  }
  bigArr[0]
    .split("")
    .reverse()
    .forEach((item, idx) => {
      if (!!idx && !(idx % 3) && idx !== bigArr[0].length) {
        intStr = item + delimiter + intStr;
      } else {
        intStr = item + intStr;
      }
    });

  if (Number(decimal)) {
    if (decStr) {
      intStr += "." + decStr;
    }
  }

  return currencySymbol + negativeNChar + intStr;
};

export const decimalNumRedundancy = (
  num: string | number = 0,
  decimal?: string | number,
  delimiter = "",
  currencySymbol = ""
) => {
  decimal ??= 2;

  const value = decimalNum(num, Number(decimal), delimiter, currencySymbol);

  const str = value.replaceAll(currencySymbol, "");

  const str1 = str.replaceAll(delimiter, "");

  let decStr = "0.";
  let handleData = false;

  for (let index = 0; index < Number(decimal) - 1; index++) {
    decStr += "0";
  }

  if (
    !!Number(Number(decimal)) &&
    !!Number(num.toString()) &&
    !Number(str1.toString())
  ) {
    decStr += "1";
    handleData = true;
  }

  return handleData
    ? `<${decimalNum(decStr, Number(decimal), "", currencySymbol)}`
    : value;
};

export function formatTimestampToUTC(timestamp: any) {
  // 创建一个 Date 对象
  const date = new Date(timestamp);

  // 获取 UTC 年、月、日、时、分、秒
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // 月份从 0 开始
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  // 格式化为 "YYYY-MM-DD HH:mm:ss"
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatSecondsToHHMMSS(seconds: any) {
  // 计算小时、分钟和秒
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  // 格式化为两位数
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(secs).padStart(2, "0");

  // 返回格式化的时间字符串
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// 千位分隔符
export function thousandsSeparator(n: number): string {
  const strSplit = n?.toString().split(".");
  const integer = strSplit[0].split("");
  integer.reverse();
  const decimal = strSplit[1];
  const newInteger = [];
  for (let i = 0; i < integer.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      newInteger.push(",");
    }
    newInteger.push(integer[i]);
  }
  newInteger.reverse();
  let s = newInteger.join("");
  if (decimal) {
    s += `.${decimal}`;
  }
  return s;
}
// 百分号转小数
export function percentToDecimal(percentString: any) {
  // 移除百分号
  const numericString = percentString.replace("%", "");

  // 将字符串转换为浮点数并除以 100
  const decimalValue = parseFloat(numericString) / 100;

  return decimalValue;
}
