import * as hc from "typed-rest-client/HttpClient";
import cheerio from "cheerio";

export interface WebPage {
  getURL(): string;
}

export async function getURL(): Promise<string | undefined | null> {
  const result = await getRequest();
  return fetchURL(result);
}

export async function getRequest(): Promise<string> {
  const client = new hc.HttpClient(null);
  const resp = await client.get("https://b.hatena.ne.jp/hotentry/it");
  const body = await resp.readBody();
  return body;
}

export async function fetchURL(response: string) {
  const $ = cheerio.load(response);
  return $(".entrylist-header-main").find("button").attr("data-href");
}
