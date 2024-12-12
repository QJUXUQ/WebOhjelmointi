document.addEventListener("DOMContentLoaded", () => {
    fetch("renkaat.json")
        .then(response => response.json())
        .then(data => {
            initializeSelectOptions(data);
        })
        .catch(error => console.error("Virhe ladattaessa tietoja:", error));
});

function initializeSelectOptions(data) {
    const kokoValinta = document.getElementById("kokoValinta");
    const uniqueSizes = [...new Set(data.map(item => item.Koko))];
    uniqueSizes.forEach(size => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        kokoValinta.appendChild(option);
    });
}

function haeRenkaat() {
    const koko = document.getElementById("kokoValinta").value;
    const tyyppi = document.getElementById("tyyppiValinta").value;

    fetch("renkaat.json")
        .then(response => response.json())
        .then(data => {
            const filtered = data.filter(item => {
                return (koko === "" || item.Koko === koko) &&
                       (tyyppi === "" || item.Tyyppi === tyyppi);
            });
            naytaTulokset(filtered);
        })
        .catch(error => console.error("Virhe haussa:", error));
}

function naytaTulokset(renkaat) {
    const tableBody = document.getElementById("renkaatTaulukko").querySelector("tbody");
    tableBody.innerHTML = "";

    renkaat.forEach(rengas => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${rengas.Merkki}</td>
            <td>${rengas.Malli}</td>
            <td>${rengas.Koko}</td>
            <td>${rengas.Hinta.toFixed(2)}</td>
            <td>${rengas.Saldo}</td>
        `;
        tableBody.appendChild(row);
    });
}

function lajitteleTaulukko(sarake){

    const taulukko=document.getElementById("renkaatTaulukko");
    const rivit=Array.from(taulukko.querySelectorAll("tbody tr"));

    let nouseva= taulukko.getAttribute("data-sort-column")== sarake && taulukko.getAttribute("data-sort-order")=="asc";
    taulukko.setAttribute("data-sort-column",sarake);
    taulukko.setAttribute("data-sort-order",nouseva?"desc":"asc");

    rivit.sort((a,b)=>{
        let arvoA =a.cells[sarake].innerText.trim();
        let arvoB =b.cells[sarake].innerText.trim();

        if (sarake ===3){
            arvoA=parseFloat(arvoA)||0;
            arvoB=parseFloat(arvoB)||0;
        }
        if (arvoA < arvoB) return nouseva ? -1 : 1;
        if (arvoA > arvoB) return nouseva ? 1 : -1;
        return 0;
    });

    const tbody = taulukko.querySelector("tbody");
    tbody.innerHTML = "";
    rivit.forEach(rivi => tbody.appendChild(rivi));
}