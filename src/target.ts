import * as hc from "typed-rest-client/HttpClient";
import { IHeaders } from "typed-rest-client/Interfaces";
import crypto from "crypto";
import { Config } from "config";

export interface Message {
  send(): void;
}

export async function send(config: Config, news: string) {
  const client = new hc.HttpClient(null);
  const status = createStatus(news);
  const url = "https://api.twitter.com/1.1/statuses/update.json";
  const header = makeRequestOption(config, [status], "POST", url);
  const resp = await client.post(url, `${pairToString(status)}`, header);
  return resp.readBody();
}

const messages = [
  "おーー！",
  "これはすごい！",
  "すげーー！！",
  "ふむふむ",
  "なるほど！",
  "なるほど",
  "すごいな！",
  "気になる！",
  "気になる",
  "試してみたい！",
  "すごい！",
  "すごい",
  "あとで読む",
  "👀",
];

function createStatus(news: string) {
  const rondomMessage =
    messages[Math.floor(Math.random() * (messages.length - 1))];
  return {
    key: "status",
    value: `${rondomMessage}\n${news}`,
  };
}

type Pair = {
  key: string;
  value: string;
};

export function pairToString(pair: Pair) {
  return `${pair.key}=${percentEncode(pair.value)}`;
}

export function createParameterString(
  auth: Config,
  param: Pair[],
  nonth: string,
  timestamp: string
): string {
  const items: Pair[] = [
    { key: "oauth_consumer_key", value: auth.apiKey },
    { key: "oauth_nonce", value: nonth },
    { key: "oauth_signature_method", value: "HMAC-SHA1" },
    { key: "oauth_timestamp", value: timestamp },
    { key: "oauth_token", value: auth.accessToken },
    { key: "oauth_version", value: "1.0" },
    ...param,
  ];
  return items
    .sort((a: Pair, b: Pair): number => {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    })
    .map((p: Pair) => pairToString(p))
    .join("&");
}

function percentEncode(s: string) {
  return encodeURIComponent(s).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16)
  );
}

export function createSignBaseString(
  method: string,
  url: string,
  paramString: string
): string {
  return `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(
    paramString
  )}`;
}

export function createSigningKey(apiSecret: string, accessTokenSecret: string) {
  return `${percentEncode(apiSecret)}&${percentEncode(accessTokenSecret)}`;
}

export function calcSignature(signatureBase: string, signingKey: string) {
  return crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64");
}

function createNonce() {
  const s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let generate = "";
  while (true) {
    for (let i = 0; i < 32; i++) {
      generate += s.charAt(Math.floor(Math.random() * (s.length - 1)));
    }
    const lowStr = /[a-z]+/.test(generate);
    const upperStr = /[A-Z]+/.test(generate);
    const digit = /[0-9]+/.test(generate);
    if (lowStr && upperStr && digit) {
      return generate;
    }
  }
}

function createTimeStamp() {
  return Math.floor(Date.now() / 1000).toString();
}

function makeRequestOption(
  auth: Config,
  param: Pair[],
  method: string,
  url: string
): IHeaders {
  const { nonce, timestamp, sign } = createSign(auth, param, method, url);
  return {
    "Content-Type": "application/x-www-form-urlencoded",
    authorization: `OAuth oauth_consumer_key=\"${percentEncode(
      auth.apiKey
    )}\", oauth_nonce=\"${percentEncode(
      nonce
    )}\", oauth_signature=\"${percentEncode(
      sign
    )}\", oauth_signature_method=\"${percentEncode(
      "HMAC-SHA1"
    )}\", oauth_timestamp=\"${percentEncode(
      timestamp
    )}\", oauth_token=\"${percentEncode(
      auth.accessToken
    )}\", oauth_version=\"${percentEncode("1.0")}\"`,
  };
}

function createSign(auth: Config, param: Pair[], method: string, url: string) {
  const nonce = createNonce();
  const timestamp = createTimeStamp();
  const paramString = createParameterString(auth, param, nonce, timestamp);
  const baseString = createSignBaseString(method, url, paramString);
  const key = createSigningKey(auth.apiSecretKey, auth.accessTokenSecret);
  const sign = calcSignature(baseString, key);
  return { nonce, timestamp, sign };
}
