# daily-blog-tweet

自分の代わりにはてブのトレンドをツイートしてくれるやつ

# Setup Env File

Set Twitter token to .env.

```
ACCESS_TOKEN=xxxxxx
ACCESS_TOKEN_SECRET=xxxxxx
API_KEY=xxxxxx
API_SECRET_KEY=xxxxxx
```

# Run Local

```
yarn install
yarn dev
```

# Run Docker

```
docker build -t daily-blog-tweet .
docker run daily-blog-tweet --env-file .env
```

# test

```
yarn test
```
