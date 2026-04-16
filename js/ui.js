import { formatCurrency, parseCurrency } from './calculos.js';

export function toggleServiceDetails(checkbox) {
    const parentGroup = checkbox.closest('.servico-group');
    const detailDiv = parentGroup.querySelector('.servico-detalhe');
    if (detailDiv) {
        detailDiv.style.display = checkbox.checked ? 'block' : 'none';
        if (!checkbox.checked) {
            const textarea = detailDiv.querySelector('textarea');
            if (textarea) textarea.value = '';
        }
    }
}

export function calculateAndDisplayTotal() {
    let total = 0;
    document.querySelectorAll('.servico-group').forEach(groupDiv => {
        const checkbox = groupDiv.querySelector('input[type="checkbox"]');
        const valorInput = groupDiv.querySelector('.valor-principal');
        if (checkbox && checkbox.checked && valorInput) {
            total += parseFloat(valorInput.value || 0);
        }
    });

    document.querySelectorAll('#itens_lista .valor-item').forEach(item => {
        total += parseFloat(item.textContent || 0);
    });

    const outrosCustos = document.getElementById('outros_valores');
    total += parseFloat(outrosCustos.value || 0);
    
    document.getElementById('total_orcamento').textContent = formatCurrency(total);
}

export function addItem(desc = null, valor = null) {
    const descInput = document.getElementById('item_desc');
    const valorInput = document.getElementById('item_valor');
    const tbody = document.getElementById('itens_lista');
    
    const d = desc || descInput.value;
    const v = valor !== null ? parseFloat(valor) : parseFloat(valorInput.value);

    if (d.trim() === '' || isNaN(v) || v < 0) {
        if(!desc) alert('Por favor, preencha a descrição e um valor válido.');
        return;
    }

    const newRow = tbody.insertRow();
    newRow.innerHTML = `
        <td>${d}</td>
        <td class="valor-item" contenteditable="true">${v.toFixed(2)}</td>
        <td class="col-acao"><button type="button" class="btn-remove">🗑️</button></td>
    `;
    
    newRow.querySelector('.btn-remove').addEventListener('click', function () { 
        this.parentNode.parentNode.remove();
        calculateAndDisplayTotal();
    });
    
    newRow.querySelector('.valor-item').addEventListener('blur', function () { 
        let newValue = parseFloat(this.textContent.replace(',', '.'));
        if (isNaN(newValue) || newValue < 0) {
            alert('Valor inválido.');
            newValue = 0;
        }
        this.textContent = newValue.toFixed(2);
        calculateAndDisplayTotal();
    });

    descInput.value = ''; valorInput.value = ''; 
    calculateAndDisplayTotal();
}

export function getFormData() {
    const clienteNome = document.getElementById('cliente_nome').value;
    if(!clienteNome) { alert("O nome do cliente é obrigatório."); return null; }

    const totalTexto = document.getElementById('total_orcamento').textContent;
    const dados = {
        cliente_nome: clienteNome,
        cliente_endereco: document.getElementById('cliente_endereco').value,
        cliente_telefone: document.getElementById('cliente_telefone').value,
        data_orcamento: document.getElementById('orcamento_data').value,
        status: document.getElementById('status_orcamento') ? document.getElementById('status_orcamento').value : 'Pendente',
        total: parseCurrency(totalTexto),
        detalhes: { servicos: [], itens_adicionais: [], custos_extras: document.getElementById('outros_valores').value, observacoes: document.getElementById('observacoes').value }
    };

    document.querySelectorAll('.servico-group').forEach(groupDiv => {
        const checkbox = groupDiv.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            const label = groupDiv.querySelector('label').textContent.trim();
            const valorInput = groupDiv.querySelector('.valor-principal').value;
            const textarea = groupDiv.querySelector('.servico-detalhe textarea');
            dados.detalhes.servicos.push({ servico: label, valor: valorInput, descricao: textarea ? textarea.value : '' });
        }
    });

    document.querySelectorAll('#itens_lista tr').forEach(row => {
        dados.detalhes.itens_adicionais.push({ descricao: row.cells[0].textContent, valor: row.cells[1].textContent });
    });

    return dados;
}

export function populateForm(orc) {
    document.getElementById('cliente_nome').value = orc.cliente_nome;
    document.getElementById('cliente_endereco').value = orc.cliente_endereco;
    document.getElementById('cliente_telefone').value = orc.cliente_telefone;
    document.getElementById('orcamento_data').value = orc.data_orcamento;
    document.getElementById('status_orcamento').value = orc.status;

    const detalhes = JSON.parse(orc.detalhes_json);

    if(detalhes.custos_extras) document.getElementById('outros_valores').value = detalhes.custos_extras;
    if(detalhes.observacoes) document.getElementById('observacoes').value = detalhes.observacoes;

    if(detalhes.servicos) {
        detalhes.servicos.forEach(servicoSalvo => {
            document.querySelectorAll('.servico-group').forEach(group => {
                const labelText = group.querySelector('label').textContent.trim();
                if(labelText === servicoSalvo.servico) {
                    const checkbox = group.querySelector('input[type="checkbox"]');
                    const valorInput = group.querySelector('.valor-principal');
                    const textarea = group.querySelector('.servico-detalhe textarea');

                    checkbox.checked = true;
                    toggleServiceDetails(checkbox);
                    valorInput.value = servicoSalvo.valor;
                    if(textarea) textarea.value = servicoSalvo.descricao;
                }
            });
        });
    }

    if(detalhes.itens_adicionais) {
        document.getElementById('itens_lista').innerHTML = '';
        detalhes.itens_adicionais.forEach(item => addItem(item.descricao, item.valor));
    }

    calculateAndDisplayTotal();
}