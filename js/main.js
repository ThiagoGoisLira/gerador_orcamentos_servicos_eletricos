import { toggleServiceDetails, addItem, calculateAndDisplayTotal, getFormData, populateForm } from './ui.js';
import { generatePrintableQuote } from './print.js';
import { fetchQuote, saveQuote } from './api.js';

document.addEventListener('DOMContentLoaded', async function () {
    
    // 1. Ligar Botões Principais
    document.querySelector('.btn-add').addEventListener('click', () => addItem());
    
    const btnPrint = document.querySelector('.btn-print');
    if (btnPrint) btnPrint.addEventListener('click', generatePrintableQuote);
    
    const btnSaveDb = document.getElementById('btn-save-db');
    if (btnSaveDb) {
        btnSaveDb.addEventListener('click', async () => {
            const dados = getFormData();
            if (dados) {
                const editId = btnSaveDb.dataset.editId; // Lê se existe ID guardado no botão
                await saveQuote(dados, editId);
            }
        });
    }
    
    // 2. Ligar Inputs para recálculo dinâmico
    document.getElementById('outros_valores').addEventListener('input', calculateAndDisplayTotal);
    
    document.querySelectorAll('.servico-group').forEach(groupDiv => {
        const checkbox = groupDiv.querySelector('input[type="checkbox"]');
        const valorInput = groupDiv.querySelector('.valor-principal');
        if (checkbox) {
            checkbox.addEventListener('change', function () { 
                toggleServiceDetails(this); 
                calculateAndDisplayTotal(); 
            });
        }
        if (valorInput) valorInput.addEventListener('input', calculateAndDisplayTotal);
    });

    // 3. Verificar URL para Modo de Edição (Rehydration)
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');
    
    if (editId) {
        // Modo Edição
        const orcData = await fetchQuote(editId);
        if (orcData) {
            populateForm(orcData);
            
            // Altera o botão para refletir a atualização
            btnSaveDb.textContent = "💾 Atualizar Orçamento";
            btnSaveDb.style.backgroundColor = "var(--primary)"; 
            btnSaveDb.dataset.editId = editId; 
            document.getElementById('main-title').textContent = `A Editar Orçamento #${editId}`;
        }
    } else {
        // Modo Novo
        document.getElementById('orcamento_data').value = new Date().toISOString().split('T')[0];
    }
});