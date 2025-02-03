import CryptoJS from "crypto-js";
const key = CryptoJS.enc.Hex.parse("de2024ab3d6ac01ad9dc6a897652f2d2"); //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Hex.parse("de2024ab3d6ac01ad9dc6a897652f2d2");

//解密方法
function Decrypt(data: string) {
  var decrypt = CryptoJS.AES.decrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  var result = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString());
  return result;
}

//加密方法
function Encrypt(word: any) {
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
export { Decrypt, Encrypt };
