# Componente de Paginação Reutilizável

## 📦 Localização

`src/components/paginacao/paginacao.js`

## 🎯 Descrição

Componente reutilizável para gerenciar paginação de dados vindos do backend (Spring Boot Page). Renderiza automaticamente os controles de navegação (Anterior, números de páginas, Próxima) e mantém o estado da paginação.

## ✨ Funcionalidades

- ✅ Renderização automática de controles de paginação
- ✅ Navegação entre páginas (anterior/próxima)
- ✅ Botões numerados de páginas (máx. 5 visíveis)
- ✅ Página atual destacada
- ✅ Botões desabilitados quando apropriado
- ✅ Atualização automática do total de registros
- ✅ Callback para mudança de página
- ✅ Compatível com Spring Boot Page

## 📚 Como Usar

### 1. Importar o componente

```javascript
import { PaginacaoComponent } from "../../components/paginacao/paginacao.js";
```

### 2. Criar instância do componente

```javascript
let paginacao = new PaginacaoComponent({
  containerId: "paginacao", // ID do elemento <ul> da paginação
  totalRegistrosId: "totalRegistros", // ID do elemento para exibir total (opcional)
  tamanhoPagina: 10, // Itens por página
  onPageChange: (numeroPagina) => {
    // Callback quando mudar de página
    carregarDados(numeroPagina);
  },
});
```

### 3. Carregar dados do backend

```javascript
async function carregarDados(pagina = 0) {
  try {
    const response = await seuService.listarTodos({
      page: pagina,
      size: paginacao.getTamanhoPagina(),
      sort: "id,desc",
    });

    // Atualiza o componente com a resposta do backend
    paginacao.atualizar(response);

    // Renderiza seus dados
    renderizarTabela(response.content);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    paginacao.limpar();
  }
}
```

### 4. HTML necessário

```html
<!-- Elemento para total de registros -->
<div class="text-muted" id="totalRegistros">Total de registros: 0</div>

<!-- Elemento para paginação -->
<nav aria-label="Navegação de páginas">
  <ul class="pagination justify-content-end mb-0" id="paginacao">
    <!-- Será preenchido automaticamente pelo componente -->
  </ul>
</nav>
```

## 📋 Métodos Disponíveis

### `atualizar(responseData)`

Atualiza o estado da paginação com dados do backend (formato Spring Boot Page).

```javascript
paginacao.atualizar(response);
```

### `irParaPagina(numeroPagina)`

Navega para uma página específica.

```javascript
paginacao.irParaPagina(2); // Vai para página 3 (zero-based)
```

### `voltarParaPrimeiraPagina()`

Volta para a primeira página.

```javascript
paginacao.voltarParaPrimeiraPagina();
```

### `limpar()`

Limpa o estado da paginação e remove os controles.

```javascript
paginacao.limpar();
```

### `getPaginaAtual()`

Retorna o número da página atual (zero-based).

```javascript
const pagina = paginacao.getPaginaAtual(); // Ex: 0, 1, 2...
```

### `getTamanhoPagina()`

Retorna o tamanho da página configurado.

```javascript
const tamanho = paginacao.getTamanhoPagina(); // Ex: 10
```

### `setTamanhoPagina(tamanho)`

Define um novo tamanho de página e volta para a primeira página.

```javascript
paginacao.setTamanhoPagina(20); // Agora mostra 20 itens por página
```

### `getParams(sort)`

Retorna objeto com parâmetros de paginação para enviar ao backend.

```javascript
const params = paginacao.getParams("nome,asc");
// Retorna: { page: 0, size: 10, sort: 'nome,asc' }
```

## 🔧 Estrutura de Resposta Esperada (Spring Boot Page)

```json
{
  "content": [...],           // Array com os dados da página
  "totalElements": 50,        // Total de registros
  "totalPages": 5,            // Total de páginas
  "number": 0,                // Página atual (zero-based)
  "size": 10,                 // Itens por página
  "numberOfElements": 10,     // Itens na página atual
  "first": true,              // É a primeira página?
  "last": false               // É a última página?
}
```

## 💡 Exemplo Completo

```javascript
import { PaginacaoComponent } from "../../components/paginacao/paginacao.js";
import { meuService } from "../../services/meuService.js";

let dados = [];
let paginacao = null;

async function inicializar() {
  // Configura paginação
  paginacao = new PaginacaoComponent({
    containerId: "paginacao",
    totalRegistrosId: "totalRegistros",
    tamanhoPagina: 10,
    onPageChange: (numeroPagina) => {
      carregarDados(numeroPagina);
    },
  });

  // Carrega primeira página
  await carregarDados(0);
}

async function carregarDados(pagina = 0) {
  try {
    const response = await meuService.listar({
      page: pagina,
      size: paginacao.getTamanhoPagina(),
      sort: "id,desc",
    });

    dados = response.content;
    paginacao.atualizar(response);
    renderizar(dados);
  } catch (error) {
    console.error("Erro:", error);
    paginacao.limpar();
    renderizar([]);
  }
}

function aplicarFiltros() {
  // Volta para primeira página ao filtrar
  paginacao.voltarParaPrimeiraPagina();
}

// Inicializa ao carregar
setTimeout(inicializar, 100);
```

## 🎨 Personalização

O componente usa classes Bootstrap para estilização. Para personalizar, modifique o CSS das classes:

- `.page-item` - Item de paginação
- `.page-link` - Link de página
- `.active` - Página ativa
- `.disabled` - Botão desabilitado

## 🚀 Onde está sendo usado

- ✅ **Pontos de Coleta** (`src/pages/ponto-coleta/ponto-coleta.js`)
- 🔄 Pode ser usado em qualquer página que liste dados paginados
