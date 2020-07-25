import dotenv from "dotenv";

dotenv.config();

export type Config = {
  apiKey: string;
  apiSecretKey: string;
  accessToken: string;
  accessTokenSecret: string;
};

export default make();

function make() {
  const accessToken = validateNotEmpty(
    process.env.ACCESS_TOKEN,
    "access token"
  );
  const accessTokenSecret = validateNotEmpty(
    process.env.ACCESS_TOKEN_SECRET,
    "access token secret"
  );
  const apiKey = validateNotEmpty(process.env.API_KEY, "api key");
  const apiSecretKey = validateNotEmpty(
    process.env.API_SECRET_KEY,
    "api key secret"
  );
  return {
    accessToken,
    accessTokenSecret,
    apiKey,
    apiSecretKey,
  };
}

function validateNotEmpty(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`cannot load ${name}`);
  }
  return value;
}
