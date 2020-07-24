import config from "./config";
import { make as makeSource } from "./source";
import { make as makeTarget } from "./target";

async function main() {
  const source = makeSource();
  const target = makeTarget();
  try {
    const url = await source.getURL();
    if (!url) {
      console.log("URL not found.");
      return;
    }
    const result = await target.send(url, config);
    console.log(
      `Request Complete! statusCode: ${result.statusCode}, message: ${result.message}`
    );
  } catch (e) {
    console.error(JSON.stringify(e));
  }
}

main();
