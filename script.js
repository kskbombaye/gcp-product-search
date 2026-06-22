let products = [];

fetch("master.csv")
.then(response => response.text())
.then(data => {

    const rows = data.trim().split("\n");

    for(let i=1;i<rows.length;i++){

        const cols = rows[i].split(",");

        products.push({
            jan: cols[0],
            name: cols[1],
            size: cols[2],
            discount: cols[3],
            pluspoint: cols[6],
            rate: cols[9]
        });

    }

});

document.getElementById("jan").addEventListener("input", function(){

    if(this.value.length!==13)return;

    const item=products.find(p=>p.jan===this.value);

    if(!item)return;

    document.getElementById("name").innerHTML=item.name;
    document.getElementById("size").innerHTML=item.size;

    document.getElementById("discount").innerHTML=
        item.discount==="" ? "-" : item.discount+"円";

    document.getElementById("pluspoint").innerHTML=
        item.pluspoint==="" ? "-" : item.pluspoint+"P";

    document.getElementById("rate").innerHTML=
        item.rate==="" ? "-" : item.rate+"倍";

});
