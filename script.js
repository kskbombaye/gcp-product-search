let products = [];

fetch("master.csv")
  .then(response => response.text())
  .then(csv => {
    const rows = csv.trim().split("\n");

    for(let i=1; i<rows.length; i++){
      const cols = rows[i].split(",");

      products.push({
        jan: cols[0],
        name: cols[1],
        size: cols[2],
        discount: cols[3],
        plusPoint: cols[6],
        rate: cols[9]
      });
    }
  });

document.addEventListener("DOMContentLoaded", () => {

  const janInput = document.getElementById("jan");

  janInput.addEventListener("input", () => {

    if(janInput.value.length !== 13){
      return;
    }

    const item =
      products.find(p => p.jan === janInput.value);

    if(!item){
      alert("商品が見つかりません");
      return;
    }

    document.getElementById("name").textContent =
      item.name || "-";

    document.getElementById("size").textContent =
      item.size || "-";

    document.getElementById("discount").textContent =
      item.discount ? item.discount + "円" : "-";

    document.getElementById("pluspoint").textContent =
      item.plusPoint ? item.plusPoint + "P" : "-";

    document.getElementById("rate").textContent =
      item.rate ? item.rate + "倍" : "-";
  });

});
