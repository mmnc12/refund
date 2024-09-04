// Seleciona os elementos do formulãrio.
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expenseTotal = document.querySelector("aside header h2");
const expenseQuantity = document.querySelector("aside header p span");


// Captura o evento de input para formatar o valor.
amount.oninput = () => {
  // Obtém o valor atual do input e remove o caracteres não numéricos.
  let value = amount.value.replace(/\D/g, ""); 

  // Transforma o valor em centavos
  value = Number(value) / 100
  
  // Atualiza o valor do input.
  amount.value = formatCurrencyBRL(value);
  
}


function formatCurrencyBRL(value) {
  // Formata o valor no padrão BRL (Real Brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
  
  return value;
}

// Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
  // Previne o comportamento padrão de recarregar a página.
  event.preventDefault();

  // Cria um objeto com detalhes da nova despesa.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  expenseAdd(newExpense);
}

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item (li) na lista (ul).
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Cria o icone da categoria.
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Cria a info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona nome e categoria na div das informações de despesa.
    expenseInfo.append(expenseName, expenseCategory);

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Adiciona o icon remove
    const expenseRemove = document.createElement("img");
    expenseRemove.classList.add("remove-icon");
    expenseRemove.setAttribute("src", "img/remove.svg");
    expenseRemove.setAttribute("alt", "remover");

    // Adiciona os itens na lista.
    expenseList.append(expenseItem);

    // Limpa os campos da lista.
    formClear();

    // Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseRemove);

    updateTotals();

  } catch (error) {
    alert("Não foi possível atualizar a lista de despesa.")
    console.log(error)
  }
}

function updateTotals() {
  try {
    // Recupera todos os item (li) da lista (ul)
    const items = expenseList.children

    // Atualiza a quantidade de itens da lista
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`;

    // Variável para incrementar o total.
    let total = 0;

    // Percorre cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      // Remover caracteres não numéricos e substituir vírgula por ponto.
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

      // Converte o valor para floot
      value = parseFloat(value);

      // Verificar se é um número válido
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total. O valor não parece ser um número.")
      }

      // Incrementar o valor total.
      total += Number(value);
    }

    // Cria a span para adicionar o R$ formatado.
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    // Formata o valor e remove o R$ que será exibido pelo small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    // Limpa o conteúdo HTML.
    expenseTotal.innerHTML = "";

    // Adiciona o símbolo da moeda e o valor total formatado.
    expenseTotal.append(symbolBRL, total);

  } catch (error) {
    console.log(error);
    alert("Erro ao atualizar o total")
  }
}

// Evento que captura o click nos itens da lista
expenseList.addEventListener("click", (event) => {
  // Verificar se o elemento clicado é o icone de remover.
  if (event.target.classList.contains("remove-icon")) {
    // Obtém o li pai do elemento clicado.
    const item = event.target.closest(".expense");
    
    // Remove o item da lista
    item.remove();
  }

  // Atualiza os totais.
  updateTotals();
})


function formClear() {
  // limpa os campos da lista
  expense.value = "";
  category.value = "";
  amount.value = "";

  // Leva o cursou para o campo
  expense.focus();
}