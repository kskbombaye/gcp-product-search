let products = [];

// CSV読み込み
fetch('master.csv')
  .then(response => response.text())
  .then(csv => {
    const rows = csv.trim().split('\n');

    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].split(','); // ← カンマ区切り

      products.push({
        jan: cols[0].trim(),              // ← スペース除去が超重要
        name: cols[1],
        size: cols[2],
        discount: cols[3],
        discount_period: cols[4],
        plus_point: cols[5],
        plus_point_period: cols[6],
        point_rate: cols[7],
        point_rate_period: cols[8]
      });
    }

    console.log("読み込んだJAN一覧:", products.map(p => p.jan)); // デバッグ用
  });

// JAN入力 → 自動検索
document.addEventListener('DOMContentLoaded', () => {
  const janInput = document.getElementById('jan');

  janInput.addEventListener('input', () => {
    if (janInput.value.length === 13) {
      const jan = janInput.value.trim();
      const item = products.find(p => p.jan === jan);

      if (!item) {
        document.getElementById('result').innerHTML = "該当商品がありません";
        return;
      }

      let html = `
        <p>商品名：${item.name}</p>
        <p>規格：${item.size}</p>
      `;

      if (item.discount && item.discount !== "-") {
        html += `<p>値引金額：${item.discount}円</p>`;
        html += `<p>値引期間：${item.discount_period}</p>`;
      }

      if (item.plus_point && item.plus_point !== "-") {
        html += `<p>プラスポイント：${item.plus_point}pt</p>`;
        html += `<p>PP期間：${item.plus_point_period}</p>`;
      }

      if (item.point_rate && item.point_rate !== "-") {
        html += `<p>ポイント倍率：${item.point_rate}倍</p>`;
        html += `<p>倍期間：${item.point_rate_period}</p>`;
      }

      document.getElementById('result').innerHTML = html;
    }
  });
});
