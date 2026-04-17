import { toggleServiceDetails, addItem, calculateAndDisplayTotal, getFormData, populateForm } from './ui.js';
import { generatePrintableQuote } from './print.js';
import { fetchQuote, saveQuote } from './api.js';

document.addEventListener('DOMContentLoaded', async function () {

    // Ligar Botões Principais
    document.getElementById('btn-add-item').addEventListener('click', () => addItem());

    const btnPrint = document.getElementById('btn-print');
    if (btnPrint) btnPrint.addEventListener('click', generatePrintableQuote);

    const btnSaveDb = document.getElementById('btn-save-db');
    if (btnSaveDb) {
        btnSaveDb.addEventListener('click', async () => {
            const dados = getFormData();
            if (dados) {
                const editId = btnSaveDb.dataset.editId;
                await saveQuote(dados, editId);
            }
        });
    }

    // Ligar Inputs
    document.getElementById('outros_valores').addEventListener('input', calculateAndDisplayTotal);

    document.querySelectorAll('.service-block').forEach(groupDiv => {
        const checkbox = groupDiv.querySelector('.service-block__checkbox');
        const valorInput = groupDiv.querySelector('.service-block__price');
        if (checkbox) {
            checkbox.addEventListener('change', function () {
                toggleServiceDetails(this);
                calculateAndDisplayTotal();
            });
        }
        if (valorInput) valorInput.addEventListener('input', calculateAndDisplayTotal);
    });

    // Rehydration (Edição)
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    if (editId) {
        const orcData = await fetchQuote(editId);
        if (orcData) {
            populateForm(orcData);
            btnSaveDb.innerHTML = "💾 Atualizar Orçamento";
            btnSaveDb.classList.replace('button--warning', 'button--primary');
            btnSaveDb.dataset.editId = editId;
            document.getElementById('main-title').textContent = `A Editar Orçamento #${editId}`;
        }
    } else {
        document.getElementById('orcamento_data').value = new Date().toISOString().split('T')[0];
    }
});