---
title: 決算データを無料で集める ― EDINET・TDnet の公式 XBRL を活用
description: 金融庁EDINET・東証TDnet・証券会社アプリから決算書や業績指標を取得し、株価チャートに業績という土台を加えます。
image: https://minnanosaiban.github.io/kessan-kabuka/posts/img/01-02_collect_other_data/00_thumbnail.png
url: https://minnanosaiban.github.io/kessan-kabuka/posts/01-02_collect_other_data/
twitter_card: summary_large_image
---

# 決算データを無料で集める ― ＥＤＩＮＥＴ・TDnet の公式ＸＢＲＬを活用

![株価以外のデータを集める](img/01-02_collect_other_data/00_thumbnail.png){width="1280"}

株価チャートだけで売買するのは、業績という土台を見ない **ギャンブルに近い** もの。決算データを足せば、銘柄を多角的に評価できます。本記事では、金融庁ＥＤＩＮＥＴ・ 東証 TDnet ・ 証券会社のアプリから決算書や業績指標を取得します。

これらのデータを使って、複数銘柄を指標と合わせて比較するチャートを作成し、株価チャートからもう一歩、目的をもったチャート作成に進めていきます。

<p class="fig-meta">データ出典<br><i class="fa-solid fa-caret-right"></i>ＥＤＩＮＥＴ：有報ＸＢＲＬ<br><i class="fa-solid fa-caret-right"></i>TDnet：決算短信ＸＢＲＬ、適時開示（発表日時）<br><i class="fa-solid fa-caret-right"></i>証券会社のアプリ：銘柄情報シートＣＳＶ</p>

<div class="ref-quiet">
<a class="ref-card ref-card--quiet" href="https://www.fsa.go.jp/search/20130917.html" target="_blank" rel="noopener">
<span class="ref-card-body">
<span class="ref-card-title">ＥＤＩＮＥＴとは</span>
<span class="ref-card-desc">有価証券報告書などの開示書類を閲覧できる電子開示システム ― 金融庁</span>
</span>
</a>
</div>




## 3 つのデータソース ― どこから何を取るか

| 取得元            | 情報                | 形式        |
| -------------- | ----------------- | --------- |
| **金融庁ＥＤＩＮＥＴ** | 有価証券報告書（有報ＸＢＲＬ） | ＸＢＲＬ      |
| **東証 TDnet**   | 決算短信ＸＢＲＬ・決算発表日時 | ＨＴＭＬ・ＸＢＲＬ |
| **証券会社のアプリ**   | 業績指標              | ＣＳＶ       |

- 本記事では、これらの **データの取り方** を解説します。

> ⚠️利用条件はデータソースごとに異なるため、各提供元の規約を確認してください。とくに証券会社のアプリのＣＳＶは再配布できません。アクセス間隔を 1 秒以上空けるなどマナーを守って使用してください。

## 金融庁ＥＤＩＮＥＴから有報を取得する

有報は、**ＰＤＦとＸＢＲＬ**（タグ付きデータ）の二つの形式で入手することができます。ＸＢＲＬはＥＤＩＮＥＴ公式ＡＰＩで取得できます。`type=1` でＸＢＲＬ書類一式、`type=5` でＸＢＲＬをＣＳＶ化したデータ一式が取得でき、ここでは `type=5` を使用します。

業績推移はヤフーファイナンスや株探などのサービスで確認できますが、期間は3～5年です。有報を遡って足せば **10 年超**の業績時系列も組めます。また、データを取得することで、銘柄の業績を比較した可視化が可能です。

```python
res = requests.get(f"https://disclosure.edinet-fsa.go.jp/api/v2/documents/{doc_id}",
    params={"type": 5, "Subscription-Key": API_KEY}) 
# type=5 で XBRL の CSV 化データ一式を取得（XBRL 書類一式は type=1）
```




## 東証 TDnet から決算短信を取得する

**決算短信ＸＢＲＬや決算発表日時** は、有報ＸＢＲＬと違い、TDnet には書類取得の公式ＡＰＩがありません（ＪＰＸの有料ＡＰＩは別枠）。そこで、一覧ページをスクレイピングして短信ＰＤＦのリンクと発表時刻を取得し、ＰＤＦのＵＲＬをＺＩＰのＵＲＬに書き換えてダウンロードします。このＺＩＰに短信ＸＢＲＬ一式が入っています。

```python
import requests
from bs4 import BeautifulSoup

url = f"https://www.release.tdnet.info/inbs/I_list_001_{target_date}.html"
soup = BeautifulSoup(requests.get(url, headers={"User-Agent": "Mozilla/5.0"}).text, "html.parser")
# 決算短信のリンクと発表時刻を抽出し、date, time, code の3列で earnings.csv に保存
```


## 証券会社のアプリから業績指標を取得する

後の記事（ＰＥＧ × ＲＯＥ・マルチファクター分析など）で「予想」「コンセンサス」として使う指標は、証券会社のアプリ からＣＳＶでエクスポートできます。

- ＥＰＳ / ＢＰＳ / 配当 / ＲＯＥ / ＲＯＡ / ＥＶ/EBITDA / 業績予想修正率(予想) / 経常利益変化率(予想) など様々な指標がそろっています。
- 楽天証券・マネックス証券・ＳＢＩ証券・会社四季報などが同等の指標を提供しています。

> ⚠️本記事以降、「予想」と表記されているものは **アナリストのコンセンサス値** で、企業公式の業績予想とは異なります。

## まとめ

- データソースは 3 本柱 ― **ＥＤＩＮＥＴ**（有報ＸＢＲＬ・公式ＡＰＩ）/ **TDnet**（決算短信ＸＢＲＬ・発表時刻）/ **証券会社のアプリ**（指標ＣＳＶ）
- 役割も分かれる ― 有報を遡れば **10 年超の時系列**、短信は **速報性と発表時刻**、アプリＣＳＶは **予想・コンセンサス**
- 取得したＸＢＲＬを「分析に使えるかたち」へ変換する手順は次回（1-3）

## <i class="fa-brands fa-github"></i> Python コード

本記事のチャート画像・アプリ・データ取得・成形スクリプトは、すべて **GitHub に公開**しています。データは提供元の利用規約により再配布できませんが、データを各自取得すれば、この記事と同じものが再現できます（動かし方はリポジトリの README 参照）。

<div class="repo-link-wrap">
<a class="repo-link" href="https://github.com/minnanosaiban/blog/tree/main/01-02_1_chart_multi" target="_blank" rel="noopener">
<span class="repo-link-path">github.com/minnanosaiban/blog/01-02_1_chart_multi</span>
<i class="repo-link-arrow fa-solid fa-arrow-up-right-from-square"></i>
</a>
</div>
<div class="repo-link-wrap">
<a class="repo-link" href="https://github.com/minnanosaiban/blog/tree/main/01-02_2_chart_earnings_pattern" target="_blank" rel="noopener">
<span class="repo-link-path">github.com/minnanosaiban/blog/01-02_2_chart_earnings_pattern</span>
<i class="repo-link-arrow fa-solid fa-arrow-up-right-from-square"></i>
</a>
</div>

## 📌 自作アプリ紹介


<div class="keypoint" markdown="span">**― 複数銘柄を俯瞰するチャート ―**</div>


<div class="repo-link-wrap">
<a class="repo-link" href="https://github.com/minnanosaiban/blog/tree/main/01-02_1_chart_multi" target="_blank" rel="noopener">
<span class="repo-link-path">github.com/minnanosaiban/blog/01-02_1_chart_multi</span>
<i class="repo-link-arrow fa-solid fa-arrow-up-right-from-square"></i>
</a>
</div>


株価だけでは「チャートを並べる」までですが、ここで取得した **業績指標（ＰＥＲ / ＰＢＲ / 配当）** を重ねると、銘柄比較が一気に厚くなります。複数銘柄のファンダ指標とチャートを 4 列カードグリッドで **1 画面で俯瞰** する Streamlit アプリです。

<p class="fig-meta"><i class="fa-solid fa-expand"></i> クリックで拡大</p>

![複数銘柄カードグリッド](img/01-02_collect_other_data/app_chart_multi.png){width="1200"}



<div class="keypoint" markdown="span">**― 決算発表直後の動きを確認するチャート ―**</div>


<div class="repo-link-wrap">
<a class="repo-link" href="https://github.com/minnanosaiban/blog/tree/main/01-02_2_chart_earnings_pattern" target="_blank" rel="noopener">
<span class="repo-link-path">github.com/minnanosaiban/blog/01-02_2_chart_earnings_pattern</span>
<i class="repo-link-arrow fa-solid fa-arrow-up-right-from-square"></i>
</a>
</div>


5分足 parquet と発表日時 `earnings.csv` で、決算発表後の値動きを 5 パターン（🟢上げ / 逆 V 字 / 無風 / V 字 / 🔴下げ）に自動分類する Streamlit アプリです。各銘柄の5分足チャートに、発表時刻の **縦点線**を入れていますので、決算発表直後の激しい株価の動きが確認できます。

<p class="fig-meta"><i class="fa-solid fa-expand"></i> クリックで拡大</p>

![決算パターングリッド](img/01-02_collect_other_data/app_earnings_pattern.png){width="1200"}

---
