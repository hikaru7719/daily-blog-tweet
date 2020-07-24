import * as hc from "typed-rest-client/HttpClient";
import cheerio from "cheerio";

export interface WebPage {
  getURL(): Promise<string | undefined>;
}

export async function getURL(): Promise<string | undefined> {
  const result = await getRequest();
  return discoverURL(result);
}

export async function getRequest(): Promise<string> {
  const client = new hc.HttpClient(null);
  const resp = await client.get("https://b.hatena.ne.jp/hotentry/it");
  const body = await resp.readBody();
  return body;
}

async function discoverURL(response: string) {
  const $ = cheerio.load(response);
  return $(".entrylist-header-main").find("button").attr("data-href");
}

export function make(): WebPage {
  return {
    getURL,
  };
}
