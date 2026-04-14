import CryptoJS from 'crypto-js';

/**
 * 计算字符串的MD5值
 * @param content 待计算MD5值的字符串
 * @returns 返回计算得到的MD5散列值
 */
export function md5(content: string): string {
  return CryptoJS.MD5(content).toString();
}

/**
 * aes加密
 * @word 要加密的内容
 * @keyWord String  加密key
 *  */
export function aesEncrypt(word: string, keyWord: string): string {
  if (!keyWord) {
    keyWord = 'XwKsGlMcdPMEhR1B';
  }
  const key = CryptoJS.enc.Utf8.parse(keyWord);
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
