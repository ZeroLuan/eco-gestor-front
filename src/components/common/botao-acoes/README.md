# Componente Botão de Ações

Componente reutilizável para criar botões de ação com dropdown (três pontinhos).

## 📦 Importação

```javascript
import {
  criarBotaoAcoes,
  criarBotaoAcoesPadrao,
  adicionarEventListeners,
  AcoesPadrao,
} from "../../components/common/botao-acoes/botao-acoes.js";
```

## 🎯 Uso Básico

### Botão com Ações Padrão (Editar + Excluir)

```javascript
// No renderizarTabela()
tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.status}</td>
    <td>
        ${criarBotaoAcoesPadrao(item.id)}
    </td>
`;

// Adicionar event listeners
adicionarEventListeners(tbody, (action, id) => {
  if (action === "editar") {
    editarItem(id);
  } else if (action === "excluir") {
    excluirItem(id);
  }
});
```

## 🎨 Uso Avançado

### Criar Botão com Ações Customizadas

```javascript
import {
  criarBotaoAcoes,
  AcoesPadrao,
} from "../../components/common/botao-acoes/botao-acoes.js";

const acoes = [AcoesPadrao.VISUALIZAR, AcoesPadrao.EDITAR, AcoesPadrao.EXCLUIR];

tr.innerHTML = `
    <td>${item.nome}</td>
    <td>
        ${criarBotaoAcoes(item.id, acoes)}
    </td>
`;
```

### Ação Customizada

```javascript
const acoesCustomizadas = [
  {
    tipo: "download",
    label: "Baixar PDF",
    icone: "bi-download",
    classe: "text-primary",
  },
  {
    tipo: "duplicar",
    label: "Duplicar",
    icone: "bi-files",
    classe: "",
  },
  AcoesPadrao.EXCLUIR,
];

const html = criarBotaoAcoes(item.id, acoesCustomizadas);
```

## 📋 Ações Pré-definidas

O componente oferece ações padrão através do objeto `AcoesPadrao`:

```javascript
AcoesPadrao.EDITAR; // Editar (ícone: bi-pencil-square)
AcoesPadrao.EXCLUIR; // Excluir (ícone: bi-trash, classe: text-danger)
AcoesPadrao.VISUALIZAR; // Visualizar (ícone: bi-eye)
AcoesPadrao.ATIVAR; // Ativar (ícone: bi-check-circle, classe: text-success)
AcoesPadrao.DESATIVAR; // Desativar (ícone: bi-x-circle, classe: text-warning)
```

## 🔧 API

### `criarBotaoAcoesPadrao(id)`

Cria um botão com ações padrão: Editar e Excluir.

**Parâmetros:**

- `id` (number|string): ID do item

**Retorna:** String HTML

---

### `criarBotaoAcoes(id, acoes)`

Cria um botão customizado com as ações especificadas.

**Parâmetros:**

- `id` (number|string): ID do item
- `acoes` (Array<Object>): Array de objetos de ação
  - `tipo` (string): Identificador da ação
  - `label` (string): Texto exibido
  - `icone` (string): Classe do ícone Bootstrap Icons
  - `classe` (string, opcional): Classes CSS adicionais

**Retorna:** String HTML

---

### `adicionarEventListeners(container, callback)`

Adiciona event listeners aos botões dentro de um container.

**Parâmetros:**

- `container` (HTMLElement): Elemento que contém os botões
- `callback` (Function): Função callback `(action, id, event) => {}`
  - `action` (string): Tipo da ação clicada
  - `id` (string): ID do item
  - `event` (Event): Evento original do click

**Exemplo:**

```javascript
adicionarEventListeners(tbody, (action, id, event) => {
  console.log(`Ação: ${action}, ID: ${id}`);
});
```

## 💡 Exemplos Práticos

### Exemplo 1: Página de Pontos de Coleta

```javascript
import {
  criarBotaoAcoesPadrao,
  adicionarEventListeners,
} from "../../components/common/botao-acoes/botao-acoes.js";

function renderizarTabela(dados) {
  const tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";

  dados.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${item.endereco}</td>
            <td>${criarBotaoAcoesPadrao(item.id)}</td>
        `;
    tbody.appendChild(tr);
  });

  adicionarEventListeners(tbody, (action, id) => {
    if (action === "editar") {
      abrirModalEdicao(id);
    } else if (action === "excluir") {
      confirmarExclusao(id);
    }
  });
}
```

### Exemplo 2: Ações Condicionais por Status

```javascript
import {
  criarBotaoAcoes,
  AcoesPadrao,
} from "../../components/common/botao-acoes/botao-acoes.js";

function renderizarTabela(dados) {
  dados.forEach((item) => {
    // Ações diferentes baseadas no status
    const acoes = item.ativo
      ? [AcoesPadrao.EDITAR, AcoesPadrao.DESATIVAR]
      : [AcoesPadrao.EDITAR, AcoesPadrao.ATIVAR];

    tr.innerHTML = `
            <td>${item.nome}</td>
            <td>${criarBotaoAcoes(item.id, acoes)}</td>
        `;
  });
}
```

## 🎨 Estrutura HTML Gerada

```html
<div class="dropdown">
  <button
    class="btn btn-outline-secondary btn-sm"
    type="button"
    data-bs-toggle="dropdown"
    aria-expanded="false"
    title="Ações"
  >
    <i class="bi bi-three-dots-vertical"></i>
  </button>
  <ul class="dropdown-menu dropdown-menu-end">
    <li>
      <a class="dropdown-item" href="#" data-action="editar" data-id="123">
        <i class="bi bi-pencil-square me-2"></i>Editar
      </a>
    </li>
    <li><hr class="dropdown-divider" /></li>
    <li>
      <a
        class="dropdown-item text-danger"
        href="#"
        data-action="excluir"
        data-id="123"
      >
        <i class="bi bi-trash me-2"></i>Excluir
      </a>
    </li>
  </ul>
</div>
```

## ✅ Benefícios

- ✅ **Reutilizável**: Use em qualquer página que precise de botão de ações
- ✅ **Consistente**: Aparência e comportamento uniformes
- ✅ **Flexível**: Suporta ações customizadas
- ✅ **Acessível**: Usa componentes Bootstrap com aria attributes
- ✅ **Manutenível**: Alterações centralizadas afetam todas as páginas
