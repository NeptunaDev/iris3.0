import crypto from "crypto";

import { SECRET_IV, SECRET_KEY } from "@/configuration/config";

const keyStr = SECRET_KEY;
const ivStr = SECRET_IV;
const key = Buffer.from(keyStr, "hex");
const iv = Buffer.from(ivStr, "hex");
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

export function encryptText(text: string) {
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decryptText(encryptedText: string) {
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
