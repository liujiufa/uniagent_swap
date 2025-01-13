import axois from "../utils/axiosExport";
interface LoginData {
  password: string;
  refereeUserAddress: string;
  userAddress: string;
  userPower: number;
}

export function Login(data: any) {
  return axois.request({
    url: "/user/login",
    method: "post",
    data: {
      ...data,
    },
  });
}
/* 判断上级地址是否有效 */
export function isRefereeAddress(data: any) {
  return axois.request({
    url: `/user/isRefereeAddress`,
    method: "post",
    data: {
      ...data,
    },
  });
}

export function getRobotInfo() {
  return axois.request({
    url: "/robot/getRobotInfo",
    method: "get",
  });
}

export function receive(data: LoginData) {
  return axois.request({
    url: "/user/isRefereeAddress/{address}",
    method: "post",
    data: {
      ...data,
    },
  });
}
export function checkInviteCode(inviteCode: string) {
  return axois.request({
    url: `/user/checkInviteCode/${inviteCode}`,
    method: "get",
  });
}
export function isNewUser(userAddress: string) {
  return axois.request({
    url: `/user/isNewUser/${userAddress}`,
    method: "get",
  });
}
export function getProductOff() {
  return axois.request({
    url: `/product/getProductOff`,
    method: "get",
  });
}
export function getUserInfo() {
  return axois.request({
    url: `/user/getUserInfo`,
    method: "get",
  });
}
export function getNftBase() {
  return axois.request({
    url: `/nft/getNftBase`,
    method: "get",
  });
}
export function drawAward(data: any) {
  return axois.request({
    url: `/user/drawAward`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function getRefereeList(data: any) {
  return axois.request({
    url: `/user/getRefereeList`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function payNft(data: any) {
  return axois.request({
    url: `/nft/payNft`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function getMyNft(data: any) {
  return axois.request({
    url: `/nft/getMyNft`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function getAllData() {
  return axois.request({
    url: `/user/getAllData`,
    method: "get",
  });
}
export function getDrawData() {
  return axois.request({
    url: `/user/getDrawData`,
    method: "get",
  });
}
export function getPersonData() {
  return axois.request({
    url: `/user/getPersonData`,
    method: "get",
  });
}
export function getRefereeData(data: any) {
  return axois.request({
    url: `/user/getRefereeData`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function getAiNodeList(type: 1 | 2) {
  return axois.request({
    url: `/mine/getAiNodeList/${type}`,
    method: "get",
  });
}
export function getAiNodeMineEarnList(data: any) {
  return axois.request({
    url: `/mine/getAiNodeMineEarnList`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function getAiNodeTreatBright() {
  return axois.request({
    url: `/mine/getAiNodeTreatBright`,
    method: "get",
  });
}
