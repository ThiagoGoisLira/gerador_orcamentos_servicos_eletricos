/**
 * ============================================================================
 * FICHEIRO: ui.js
 * RESPONSABILIDADE: Controlar a Interface do Utilizador (UI).
 * Tudo o que envolve capturar cliques, ler campos do HTML, escrever na tela,
 * ocultar/mostrar elementos e montar tabelas dinâmicas fica neste ficheiro.
 * ============================================================================
 */

// Importa as funções matemáticas de formatação de outro módulo
import { formatCurrency, parseCurrency } from './calculos.js';

/**
 * Exibe ou oculta a caixa de texto de detalhes de um serviço.
 * É chamada automaticamente sempre que o utilizador marca/desmarca um checkbox.
 * * @param {HTMLElement} checkbox O elemento checkbox que foi clicado.
 */
export function toggleServiceDetails(checkbox) {
    // Procura o elemento "pai" (bloco inteiro do serviço) para não afetar outros serviços
    const parentGroup = checkbox.closest('.service-block');
    // Procura a caixa de detalhes dentro desse pai específico
    const detailDiv = parentGroup.querySelector('.service-block__details');
    
    if (detailDiv) {
        // Se o checkbox estiver marcado, mostra (block), senão oculta (none)
        detailDiv.style.display = checkbox.checked ? 'block' : 'none';
        
        // Regra de negócio: Se o utilizador desmarcar o serviço, apagamos o texto
        // que ele tinha escrito, para não guardar lixo na base de dados.
        if (!checkbox.checked) {
            const textarea = detailDiv.querySelector('.form__textarea');
            if (textarea) textarea.value = '';
        }
    }
}

/**
 * Varre todos os campos do ecrã com valores financeiros, soma tudo
 * e exibe o "Total: R$ XXX,XX" formatado no final da página.
 */
export function calculateAndDisplayTotal() {
    let total = 0;
    
    // 1. SOMA DOS SERVIÇOS PRINCIPAIS
    document.querySelectorAll('.service-block').forEach(groupDiv => {
        const checkbox = groupDiv.querySelector('.service-block__checkbox');
        const valorInput = groupDiv.querySelector('.service-block__price');
        
        // Só soma se o checkbox estiver marcado e houver um valor digitado
        if (checkbox && checkbox.checked && valorInput) {
            total += parseFloat(valorInput.value || 0);
        }
    });

    // 2. SOMA DOS MATERIAIS NA TABELA DINÂMICA
    document.querySelectorAll('#itens_lista .table__cell--editable').forEach(item => {
        // O textContent pega o que está escrito na célula da tabela
        total += parseFloat(item.textContent || 0);
    });

    // 3. SOMA DOS CUSTOS EXTRAS (Deslocamento, etc.)
    const outrosCustos = document.getElementById('outros_valores');
    total += parseFloat(outrosCustos.value || 0);

    // Atualiza o HTML com o valor final já formatado em Reais (R$)
    document.getElementById('total_orcamento').textContent = formatCurrency(total);
}

/**
 * Adiciona uma nova linha à tabela de "Materiais e Peças Adicionais".
 * Pode ser chamada pelo clique do botão (sem parâmetros) ou via código
 * ao editar um orçamento (passando desc e valor).
 */
export function addItem(desc = null, valor = null) {
    // Elementos de input (onde o utilizador digita)
    const descInput = document.getElementById('item_desc');
    const valorInput = document.getElementById('item_valor');
    // O corpo da tabela onde as linhas vão aparecer
    const tbody = document.getElementById('itens_lista');

    // Usa o parâmetro passado pela função OU o que está digitado no input
    const d = desc || descInput.value;
    const v = valor !== null ? parseFloat(valor) : parseFloat(valorInput.value);

    // Validação de segurança: Não deixa adicionar linhas vazias ou com valores negativos
    if (d.trim() === '' || isNaN(v) || v < 0) {
        if (!desc) alert('Por favor, preencha a descrição e um valor válido.');
        return;
    }

    // Cria fisicamente uma nova linha <tr> e adiciona a classe BEM
    const newRow = tbody.insertRow();
    newRow.classList.add('table__row');
    
    // Injeta as colunas <td> com os valores
    newRow.innerHTML = `
        <td class="table__cell">${d}</td>
        <td class="table__cell table__cell--editable" contenteditable="true">${v.toFixed(2)}</td>
        <td class="table__cell table__cell--action"><button type="button" class="button button--icon">🗑️</button></td>
    `;

    // Adiciona o evento de DELETAR no botão da lixeira recém-criado
    newRow.querySelector('.button--icon').addEventListener('click', function () {
        this.parentNode.parentNode.remove(); // Remove a linha inteira (<tr>)
        calculateAndDisplayTotal(); // Recalcula o total pois um item foi removido
    });

    // Adiciona o evento de EDIÇÃO RÁPIDA (quando o utilizador clica e muda o preço direto na tabela)
    newRow.querySelector('.table__cell--editable').addEventListener('blur', function () {
        // Tenta converter para número, trocando a vírgula por ponto (ex: 10,50 -> 10.50)
        let newValue = parseFloat(this.textContent.replace(',', '.'));
        
        // Se o utilizador apagar tudo ou escrever letras, zera o valor por segurança
        if (isNaN(newValue) || newValue < 0) {
            alert('Valor inválido.');
            newValue = 0;
        }
        
        this.textContent = newValue.toFixed(2); // Formata de volta para 2 casas decimais
        calculateAndDisplayTotal(); // Recalcula o total com o novo preço
    });

    // Limpa os inputs para o utilizador poder digitar a próxima peça
    descInput.value = ''; 
    valorInput.value = '';
    
    // Calcula o total para incluir a nova peça que acabou de ser adicionada
    calculateAndDisplayTotal();
}

/**
 * "Empacota" todos os dados digitados na tela num único Objeto JSON.
 * Este objeto é o que será enviado para o PHP salvar na Base de Dados.
 */
export function getFormData() {
    const clienteNome = document.getElementById('cliente_nome').value;
    
    // Validação vital: sem nome do cliente, o sistema não avança
    if (!clienteNome) { 
        alert("O nome do cliente é obrigatório."); 
        return null; 
    }

    // Pega o total visível e limpa a formatação "R$" para guardar um número puro
    const totalTexto = document.getElementById('total_orcamento').textContent;
    
    // Estrutura principal de dados
    const dados = {
        cliente_nome: clienteNome,
        cliente_endereco: document.getElementById('cliente_endereco').value,
        cliente_telefone: document.getElementById('cliente_telefone').value,
        data_orcamento: document.getElementById('orcamento_data').value,
        status: document.getElementById('status_orcamento') ? document.getElementById('status_orcamento').value : 'Pendente',
        total: parseCurrency(totalTexto), // Usa a função do calculos.js
        detalhes: { 
            servicos: [], 
            itens_adicionais: [], 
            custos_extras: document.getElementById('outros_valores').value, 
            observacoes: document.getElementById('observacoes').value 
        }
    };

    // Percorre os serviços e adiciona ao array de "servicos" apenas os que estiverem marcados
    document.querySelectorAll('.service-block').forEach(groupDiv => {
        const checkbox = groupDiv.querySelector('.service-block__checkbox');
        if (checkbox && checkbox.checked) {
            const label = groupDiv.querySelector('.service-block__label').textContent.trim();
            const valorInput = groupDiv.querySelector('.service-block__price').value;
            const textarea = groupDiv.querySelector('.service-block__details .form__textarea');
            
            dados.detalhes.servicos.push({ 
                servico: label, 
                valor: valorInput, 
                descricao: textarea ? textarea.value : '' 
            });
        }
    });

    // Percorre a tabela de peças e empurra para o array de "itens_adicionais"
    document.querySelectorAll('#itens_lista .table__row').forEach(row => {
        dados.detalhes.itens_adicionais.push({ 
            descricao: row.cells[0].textContent, 
            valor: row.cells[1].textContent 
        });
    });

    return dados;
}

/**
 * O Processo de "Rehydration" (Re-hidratação).
 * Pega nos dados que vieram da Base de Dados e preenche o HTML vazio.
 * * @param {Object} orc Os dados completos do orçamento vindos do PHP.
 */
export function populateForm(orc) {
    // 1. Preenche os inputs de texto básicos
    document.getElementById('cliente_nome').value = orc.cliente_nome;
    document.getElementById('cliente_endereco').value = orc.cliente_endereco;
    document.getElementById('cliente_telefone').value = orc.cliente_telefone;
    document.getElementById('orcamento_data').value = orc.data_orcamento;
    document.getElementById('status_orcamento').value = orc.status;

    // 2. Converte a coluna 'detalhes_json' (que é texto no banco) de volta para um Objeto JS
    const detalhes = JSON.parse(orc.detalhes_json);

    // 3. Preenche custos extras e observações
    if (detalhes.custos_extras) document.getElementById('outros_valores').value = detalhes.custos_extras;
    if (detalhes.observacoes) document.getElementById('observacoes').value = detalhes.observacoes;

    // 4. Marca os checkboxes de serviços e preenche os respetivos valores/textos
    if (detalhes.servicos) {
        detalhes.servicos.forEach(servicoSalvo => {
            // Vasculha a tela atrás de qual checkbox corresponde ao serviço salvo
            document.querySelectorAll('.service-block').forEach(group => {
                const labelText = group.querySelector('.service-block__label').textContent.trim();
                
                if (labelText === servicoSalvo.servico) {
                    const checkbox = group.querySelector('.service-block__checkbox');
                    const valorInput = group.querySelector('.service-block__price');
                    const textarea = group.querySelector('.service-block__details .form__textarea');

                    checkbox.checked = true;          // Marca a caixinha
                    toggleServiceDetails(checkbox);   // Mostra o campo de detalhes
                    valorInput.value = servicoSalvo.valor; // Coloca o preço antigo
                    if (textarea) textarea.value = servicoSalvo.descricao; // Coloca a descrição antiga
                }
            });
        });
    }

    // 5. Reconstrói a tabela de itens materiais dinamicamente
    if (detalhes.itens_adicionais) {
        document.getElementById('itens_lista').innerHTML = ''; // Limpa qualquer lixo antes de preencher
        detalhes.itens_adicionais.forEach(item => {
            // Reutiliza a função addItem, forçando os valores antigos em vez de ler dos inputs
            addItem(item.descricao, item.valor);
        });
    }

    // 6. Finalmente, recalcula o total visual para bater certo com a base de dados
    calculateAndDisplayTotal();
}