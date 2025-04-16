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
      // Encrypt: true,
    },
  });
}
export function signBindReferee(data: any) {
  return axois.request({
    url: "/user/signBindReferee",
    method: "post",
    data: {
      ...data,
      // Encrypt: true,
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
export function getNftBase() {
  return axois.request({
    url: `/nft/getNftBase`,
    method: "get",
  });
}
export function drawAward(data: any) {
  return axois.request({
    url: `/mine/draw`,
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
    url: `/mine/getRefereeData`,
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
export function getEdgeNodeList(type: 1 | 2) {
  return axois.request({
    url: `/mine/getEdgeNodeList/${type}`,
    method: "get",
  });
}
export function getExchangeFormDataList() {
  return axois.request({
    url: `/user/getExchangeFormDataList`,
    method: "get",
  });
}
export function getExchangeRecord() {
  return axois.request({
    url: `/user/getExchangeRecord`,
    method: "get",
  });
}
export function getUserInfo() {
  return axois.request({
    url: `/user/getUserInfo`,
    method: "get",
  });
}

export function quitEdgeNode(data: any) {
  return axois.request({
    url: `/mine/quitEdgeNode`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function getEdgeNodeEarnList(data: any) {
  return axois.request({
    url: `/mine/getEdgeNodeEarnList`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function runBridge(data: any) {
  return axois.request({
    url: `/user/runBridge`,
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
export function getKineData(token: any, time: any) {
  return axois.request({
    url: `/user/getKineData/${token}/${time}`,
    method: "get",
  });
}
export function getNodeUserEarnDetail(data: any) {
  return axois.request({
    url: `/pledge/getNodeUserEarnDetail`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function draw(data: any) {
  return axois.request({
    url: `/pledge/draw`,
    method: "post",
    data: {
      ...data,
    },
  });
}

export function getPledgeBaasList(type: any, status: any) {
  return axois.request({
    url: `/pledge/getPledgeBaasList/${type}/${status}`,
    method: "get",
  });
}
export function getServerTime() {
  return axois.request({
    url: `/pledge/getServerTime`,
    method: "get",
  });
}
export function getPriceInfo() {
  return axois.request({
    url: `/pledge/getPriceInfo`,
    method: "get",
  });
}
export function getNodeRedeemInfo(type: any) {
  return axois.request({
    url: `/pledge/getNodeRedeemInfo/${type}`,
    method: "get",
  });
}
export function getNodeUserInfo() {
  return axois.request({
    url: `/pledge/getNodeUserInfo`,
    method: "get",
  });
}
export function getMedalInfo() {
  return axois.request({
    url: `/user/getMedalInfo`,
    method: "get",
  });
}
export function getPiotnsAccount() {
  return axois.request({
    url: `/user/getPiotnsAccount`,
    method: "get",
  });
}
export function getPiotnsAccountRecord() {
  return axois.request({
    url: `/user/getPiotnsAccountRecord`,
    method: "get",
  });
}
export function getNodeUserInfoList() {
  return axois.request({
    url: `/pledge/getNodeUserInfoList`,
    method: "get",
  });
}
