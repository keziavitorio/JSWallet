const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items;

btnNew.onclick = () => {
    if (descItem.value === "" || amount.value === "" || type.value === "") {
        alert("Preencha todos os campos!");
        return;
    }

    items.push({
        desc: descItem.value,
        amount: Math.abs(amount.value).toFixed(2),
        type: type.value,
        deleted: false, // Adicione o campo "deleted" e defina como falso por padrão
    });

    setItensBD();
    loadItens();

    descItem.value = "";
    amount.value = "";
};

function deleteItem(index) {
    items[index].deleted = true;

    let type = "Entrada";
    if (items[index].type === 'Entrada') {
        type = "Saída"
    }

    items.push({
        desc: `Estorno ${items[index].desc}`,
        amount:  items[index].amount,
        type: type,
        deleted: true
    })

    setItensBD();
    loadItens();
}

function insertItem(item, index) {
    let tr = document.createElement("tr");

    tr.innerHTML = `
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td class="columnType">${
      item.type === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td class="columnAction">
      <button id=b${index} onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

    tbody.appendChild(tr);
}

function loadItens() {
    items = getItensBD();
    tbody.innerHTML = "";
    items.forEach((item, index) => {
        const tr = document.createElement("tr");

        if (item.deleted) {
            tr.classList.add("deleted-item"); // Adicione uma classe para itens excluídos
        }

        tr.innerHTML = `
            <td>${item.desc}</td>
            <td>R$ ${item.amount}</td>
            <td class="columnType">${
                item.type === "Entrada"
                    ? '<i class="bx bxs-chevron-up-circle"></i>'
                    : '<i class="bx bxs-chevron-down-circle"></i>'
            }</td>
            `

        if (!item.desc.startsWith('Estorno') && !item.deleted) {
            tr.innerHTML += `<td class="columnAction">
                <button id=b${index} onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
            </td>`
        }

        tbody.appendChild(tr);
    });

    getTotals();
}

function getTotals() {
    const amountIncomes = items
        .filter((item) => item.type === "Entrada")
        .map((transaction) => Number(transaction.amount));

    const amountExpenses = items
        .filter((item) => item.type === "Saída")
        .map((transaction) => Number(transaction.amount));

    const totalIncomes = amountIncomes
        .reduce((acc, cur) => acc + cur, 0)
        .toFixed(2);

    const totalExpenses = Math.abs(
        amountExpenses.reduce((acc, cur) => acc + cur, 0)
    ).toFixed(2);

    const totalItems = (totalIncomes - totalExpenses).toFixed(2);

    incomes.innerHTML = totalIncomes;
    expenses.innerHTML = totalExpenses;
    total.innerHTML = totalItems;
}

const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) || [];
const setItensBD = () =>
    localStorage.setItem("db_items", JSON.stringify(items));

const clearHistoryBtn = document.querySelector("#clearHistory");

clearHistoryBtn.addEventListener("click", () => {
    items = items.filter((item) => !item.deleted); // Remove permanentemente os itens marcados como excluídos
    setItensBD();
    loadItens();
});


loadItens();