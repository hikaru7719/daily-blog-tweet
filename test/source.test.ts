import { getURL, getRequest } from "../src/source";

test("loadPage test", async () => {
  expect.assertions(1);
  const url = await getURL();
  expect(url).toContain("http");
});

test("getRequest test", async () => {
  const body = await getRequest();
  expect(body).toContain("</html>");
});
