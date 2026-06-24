let products = [];

// CSV読み込み
fetch('master.csv')
  .then(response => response.text())
  .then(csv => {
    const rows = csv.trim().split('\n');

    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].split(',');

      products.push({
        jan: cols[0].trim(),
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
  });

// JAN検索
function searchJAN(jan) {
  const item = products.find(p => p.jan === jan);

  if (!item) {
    document.getElementById('result').innerHTML = "<p>該当商品がありません</p>";
    return;
  }

  let html = `
    <div class="card">
      <p><strong>商品名：</strong>${item.name}</p>
      <p><strong>規格：</strong>${item.size}</p>
  `;

  if (item.discount && item.discount !== "-") {
    html += `<p><strong>値引：</strong>${item.discount}円</p>`;
    html += `<p><strong>期間：</strong>${item.discount_period}</p>`;
  }

  if (item.plus_point && item.plus_point !== "-") {
    html += `<p><strong>プラスポイント：</strong>${item.plus_point}pt</p>`;
    html += `<p><strong>PP期間：</strong>${item.plus_point_period}</p>`;
  }

  if (item.point_rate && item.point_rate !== "-") {
    html += `<p><strong>ポイント倍率：</strong>${item.point_rate}倍</p>`;
    html += `<p><strong>倍期間：</strong>${item.point_rate_period}</p>`;
  }

  html += `</div>`;

  document.getElementById('result').innerHTML = html;
}

// 入力イベント
document.getElementById('jan').addEventListener('input', (e) => {
  if (e.target.value.length === 13) {
    searchJAN(e.target.value.trim());
  }
});

// リセットボタン
document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('jan').value = "";
  document.getElementById('result').innerHTML = "";
});

// ★ 読み取り精度MAX版 Quagga2
document.getElementById('scanBtn').addEventListener('click', () => {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('body'),
      constraints: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 720 },
        aspectRatio: { ideal: 1.777 },   // iPhoneで安定
        frameRate: { ideal: 15 }         // FPSを下げて精度UP
      }
    },

    locator: {
      patchSize: "medium",
      halfSample: true,
      // ★ スキャン領域を中央に限定（精度UP）
      roi: {
        x: 0.1,   // 左10%
        y: 0.3,   // 上30%
        width: 0.8,
        height: 0.4
      }
    },

    decoder: {
      readers: ["ean_reader"],
      multiple: false
    },

    // ★ iPhone Safari 安定化
    numOfWorkers: 0,

    // ★ 誤検出フィルタ
    locate: true
  }, function(err) {
    if (err) {
      alert("カメラが使用できません");
      return;
    }
    Quagga.start();
  });

  let lastCode = "";
  let lastTime = 0;

  // ★ 読み取り成功時（誤検出防止ロジック付き）
  Quagga.onDetected(data => {
    const code = data.codeResult.code;
    const now = Date.now();

    // ★ 信頼度フィルタ（confidence が低い場合は無視）
    if (data.codeResult.confidence < 30) return;

    // ★ 連続検出の抑制（同じコードを連続で拾わない）
    if (code === lastCode && now - lastTime < 800) return;

    lastCode = code;
    lastTime = now;

    document.getElementById('jan').value = code;
    searchJAN(code);
    Quagga.stop();
  });
});
