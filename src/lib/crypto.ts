import { jwtDecode } from "jwt-decode";

export function enCrypto(token: string): string {
  const CryptoJS = require("crypto-js");
  const ciphertext = CryptoJS.AES.encrypt(
    token,
    process.env.TOKEN_SECRET
  ).toString();
  return ciphertext;
}

export function deCrypto(salt: string): string | null {
  if (!salt) return null;
  const CryptoJS = require("crypto-js");
  const bytes = CryptoJS.AES.decrypt(salt, process.env.TOKEN_SECRET);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
