# 4sq-venue

## Usage

```console
docker build --pull -t 4sq-venue:$(git rev-parse HEAD) .
docker run -it --rm --shm-size 1G 4sq-venue:$(git rev-parse HEAD) node
```

## Structure

```
.
|_ lib
|_ venues
  |_ {venume_name}
     |_ config.js    # venue config
     |_ scraped.ltsv # result of scraping
```

### venue config specification

TODO: write json schema

## Scheduled Jobs

circleci で監視スクリプトを定期実行（毎日）

1.  ベニューのホームページからスクレイピングでサブベニューをリストアップする (scrape)
    1.1. diff があったら PR を送信する
    1.2. PR が merge されたら閉店したベニューに閉店リクエストを送る
2.  foursquare の API によりサブベニューを取得し、1 でリストアップしたサブベニューと紐付けをする (list-venues)
    2.1. diff があったら PR を送信する

```

```
