# kessan-kabuka

**https://minnanosaiban.github.io/kessan-kabuka/**

決算・株価データ検証。無料で手に入る株価・決算短信・有価証券報告書をもとにした分析記事です（Zensical 製、GitHub Pages で公開）。分析コードは別リポジトリ [blog](https://github.com/minnanosaiban/blog) にあります。

## 動かし方

初回だけ（このフォルダで）：

```
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
```

| 何をする | 方法 |
|---|---|
| ローカルで見る | `serve.bat`（`http://localhost:8000/`） |
| ビルドだけ確認 | `build.bat` |
| **公開する** | **`deploy.bat`**（ビルド確認 → main へ push → GitHub Actions が公開） |

## 構成

```
docs/
  index.md        記事の一覧
  posts/          記事（画像は posts/img/）
  glossary.md     用語集
  css/shared/     共通デザイン（minna-design から同期。直接編集しない）
  css/            この site 固有（layout / blog / components）
  js/lightbox.js  図のクリック拡大
overrides/        テンプレートの上書き
```

## デザイン

tomo・hotline と共通のデザインシステム：https://github.com/minnanosaiban/minna-design 。共通CSSを更新したら `sync.bat C:\minnanosaiban\kessan-kabuka`（minna-design 側のスクリプト）で取り込む。
