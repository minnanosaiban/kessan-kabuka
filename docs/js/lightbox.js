// 図のクリック拡大。旧 glightbox（MkDocs プラグイン）の代わり。Zensical はプラグインを使えないため、
// 本文の画像（リンクでくるまれていないもの）をクリックすると、画面いっぱいに拡大して表示する。
// 背景クリック・Esc で閉じる。色は共通デザイン（無彩色）に合わせて、黒の半透明のみ。
document.addEventListener("DOMContentLoaded", function () {
  var imgs = document.querySelectorAll(".md-content img:not(.twemoji):not([data-no-zoom])");
  if (!imgs.length) return;

  var overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "拡大表示");
  overlay.style.cssText = "position:fixed;inset:0;z-index:1000;display:none;align-items:center;" +
    "justify-content:center;background:rgba(0,0,0,.82);cursor:zoom-out;padding:2vh 2vw;";
  var big = document.createElement("img");
  big.style.cssText = "max-width:96vw;max-height:96vh;width:auto;height:auto;background:#fff;border-radius:4px;";
  overlay.appendChild(big);
  document.body.appendChild(overlay);

  function close() { overlay.style.display = "none"; big.removeAttribute("src"); }
  overlay.addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  imgs.forEach(function (img) {
    if (img.closest("a")) return;   // リンク付きの画像はリンクを優先
    img.style.cursor = "zoom-in";
    img.addEventListener("click", function () {
      big.src = img.currentSrc || img.src;
      big.alt = img.alt || "";
      overlay.style.display = "flex";
    });
  });
});
