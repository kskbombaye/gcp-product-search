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

// JAN検索処理
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

  saveHistory(jan, item.name);
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

// 履歴保存
function saveHistory(jan, name) {
  let history = JSON.parse(localStorage.getItem("history") || "[]");

  history.unshift({ jan, name, time: new Date().toLocaleString() });

  if (history.length > 20) history.pop();

  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

// 履歴表示
function renderHistory() {
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  let html = "";

  history.forEach(h => {
    html += `<div class="history-item">${h.time}：${h.jan}（${h.name}）</div>`;
  });

  document.getElementById('history').innerHTML = html;
}

renderHistory();

// バーコード読み取り
document.getElementById('scanBtn').addEventListener('click', () => {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('body'),
    },
    decoder: {
      readers: ["ean_reader"]
    }
  }, function(err) {
    if (err) {
      alert("カメラが使用できません");
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(data => {
    const code = data.codeResult.code;
    document.getElementById('jan').value = code;
    searchJAN(code);
    Quagga.stop();
  });
});
