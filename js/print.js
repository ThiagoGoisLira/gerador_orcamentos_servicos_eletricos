import { formatCurrency } from './calculos.js';

export function generatePrintableQuote() {
    const cliente = document.getElementById('cliente_nome').value;
    const endereco = document.getElementById('cliente_endereco').value;
    const telefone = document.getElementById('cliente_telefone').value;
    const data = document.getElementById('orcamento_data').value;
    const total = document.getElementById('total_orcamento').textContent;
    const observacoes = document.getElementById('observacoes').value;

    const serviceItems = [
        { id: 'cameras', label: 'Câmeras (Instalação/Manutenção)', category: 'Segurança Eletrônica' },
        { id: 'cerca', label: 'Cerca Elétrica', category: 'Segurança Eletrônica' },
        { id: 'instalacao', label: 'Instalação Elétrica (Nova/Reforma)', category: 'Serviços Elétricos' },
        { id: 'manutencao', label: 'Manutenção Elétrica Geral', category: 'Serviços Elétricos' }
    ];

    const categorizedServices = {};
    let servicosCount = 0;

    serviceItems.forEach(item => {
        const checkbox = document.getElementById(`serv_${item.id}`);
        if (checkbox && checkbox.checked) {
            if (!categorizedServices[item.category]) categorizedServices[item.category] = [];
            const valorInput = document.getElementById(`val_${item.id}`);
            const descTextarea = document.getElementById(`desc_${item.id}`);
            categorizedServices[item.category].push({ 
                label: item.label, 
                valor: parseFloat(valorInput.value || 0), 
                descricao: descTextarea ? descTextarea.value.trim() : '' 
            });
            servicosCount++;
        }
    });

    let servicosHtml = '';
    if (servicosCount > 0) {
        for (const category in categorizedServices) {
            servicosHtml += `<div class="category-box"><h3 class="category-title">${category}</h3><ul class="servicos-list">`;
            categorizedServices[category].forEach(service => {
                servicosHtml += `<li class="servico-print-item">
                    <div class="servico-header"><span class="servico-nome">${service.label}</span><span class="servico-valor">${formatCurrency(service.valor)}</span></div>`;
                if (service.descricao) {
                    servicosHtml += `<div class="servico-detalhes">Detalhes: <span style="white-space: pre-wrap;">${service.descricao}</span></div>`;
                }
                servicosHtml += `</li>`;
            });
            servicosHtml += '</ul></div>';
        }
    } else {
        servicosHtml = "<p>Nenhum serviço principal selecionado.</p>";
    }

    let itensHtml = '<table class="itens-table"><thead><tr><th>Descrição</th><th class="valor-col">Valor</th></tr></thead><tbody>';
    const itensRows = document.querySelectorAll('#itens_lista tr');
    if (itensRows.length > 0) {
        itensRows.forEach(row => {
            const rawValue = parseFloat(row.cells[1].textContent || 0);
            itensHtml += `<tr><td>${row.cells[0].textContent}</td><td class="valor-col">${formatCurrency(rawValue)}</td></tr>`;
        });
    } else {
        itensHtml += '<tr><td colspan="2" class="no-items">Nenhum material adicional incluído.</td></tr>';
    }
    itensHtml += '</tbody></table>';

    const outrosCustos = parseFloat(document.getElementById('outros_valores').value || 0);
    let obsHtml = '';
    if (observacoes.trim() !== '') {
        obsHtml = `<div class="category-box"><h3 class="category-title">Observações Adicionais</h3><div class="obs-box"><p style="white-space: pre-wrap;">${observacoes}</p></div></div>`;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html><head><title>Orçamento - ${cliente}</title>
        <style>
            :root { --cor-primaria: #007bff; --cor-fundo-sec: #f8f9fa; --cor-total: #28a745; --cor-texto: #343a40; --cor-borda: #dee2e6; }
            body { font-family: 'Segoe UI', Tahoma, sans-serif; margin: 0; padding: 0; color: var(--cor-texto); background-color: #fff; }
            .document-container { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 5mm; box-sizing: border-box; display: flex; flex-direction: column; }
            header { text-align: left; margin-bottom: 5px; border-bottom: 2px solid var(--cor-primaria); padding-bottom: 5px; }
            header h1 { color: var(--cor-primaria); margin: 0 0 5px 0; font-size: 2.2em; }
            header p { margin: 0; font-size: 0.9em; color: #6c757d; }
            main { flex: 1; }
            .section-container, .category-box { border: 1px solid var(--cor-borda); border-radius: 8px; margin-bottom: 5px; background: #fff; overflow: hidden; }
            .category-title, .section-title { background-color: var(--cor-fundo-sec); padding: 5px 5px; margin: 0; font-size: 1.2em; color: var(--cor-primaria); border-bottom: 1px solid var(--cor-borda); }
            .section-content, .info-grid { padding: 5px; }
            .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; }
            .info-item p { margin: 0; line-height: 1.4; }
            .servicos-list { list-style: none; padding: 0 5px 5px 5px; margin: 0; }
            .servico-print-item { padding: 10px 0; border-bottom: 1px dashed var(--cor-borda); }
            .servico-print-item:last-child { border-bottom: none; }
            .servico-header { display: flex; justify-content: space-between; font-weight: 600; font-size: 1.05em; }
            .servico-valor { font-weight: 700; }
            .servico-detalhes { margin-top: 5px; font-size: 0.9em; color: #6c757d; padding-left: 15px; }
            .itens-table { width: 100%; border-collapse: collapse; margin: -1px; }
            .itens-table th, .itens-table td { border: 1px solid var(--cor-borda); padding: 10px; text-align: left; }
            .itens-table th { background-color: var(--cor-primaria); color: white; font-weight: 400; }
            .itens-table tr:nth-child(even) { background-color: var(--cor-fundo-sec); }
            .itens-table .valor-col { text-align: right; width: 120px; font-weight: 600; }
            .itens-table .no-items { font-style: italic; color: #999; text-align: center; }
            .total-box { text-align: right; margin-top: 25px; padding-top: 15px; border-top: 2px solid var(--cor-primaria); }
            .total-display { display: inline-block; background-color: var(--cor-total); color: white; padding: 10px 20px; font-size: 1.8em; font-weight: bold; border-radius: 6px; }
            .obs-box p { margin: 0; line-height: 1.6; font-size: 0.95em; padding: 0 15px 15px 15px;}
            footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ccc; font-size: 0.85em; color: #6c757d; text-align: center; }
            .validade { margin-bottom: 10px; font-style: italic; }
            .contact-info { font-weight: bold; color: var(--cor-primaria); }
            .contact-info p { margin: 2px 0; }
            @media print {
                @page { size: A4; margin: 0; }
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .document-container { padding: 15mm; box-shadow: none; border: none; min-height: 270mm; }
                .info-grid { display: block; } .info-item { margin-bottom: 10px; }
                .section-container, .category-box, .total-box, footer { page-break-inside: avoid; }
                * { color: #000 !important; } 
                header h1, .contact-info, .servico-valor, .category-title { color: var(--cor-primaria) !important; }
                .total-display { background-color: #e9ecef !important; color: #000 !important; border: 1px solid var(--cor-total); box-shadow: none; }
                .itens-table th { background-color: var(--cor-primaria) !important; color: white !important; }
            }
        </style></head><body>
            <div class="document-container">
                <header>
                    <h1>ORÇAMENTO DE SERVIÇOS</h1>
                    <p>Referente a Sistemas de Segurança e Instalações Elétricas</p>
                </header>
                <main>
                    <div class="section-container">
                        <h3 class="section-title">Dados do Cliente</h3>
                        <div class="info-grid">
                            <div class="info-item"><p><strong>Cliente:</strong> ${cliente || 'Não informado'}</p></div>
                            <div class="info-item"><p><strong>Endereço:</strong> ${endereco || 'Não informado'}</p></div>
                            <div class="info-item" style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                                <p><strong>Contato:</strong> ${telefone || 'Não informado'}</p>
                                <p><strong>Data:</strong> ${data ? new Date(data + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não informada'}</p>
                            </div>
                        </div>
                    </div>
                    ${servicosHtml}
                    <div class="category-box"><h3 class="category-title">Materiais e Peças Adicionais</h3>${itensHtml}</div>
                    <div class="category-box">
                        <h3 class="category-title">Custos Adicionais</h3>
                        <div class="section-content"><div class="info-item"><p>Deslocamento/Taxas/Outros: <strong>${formatCurrency(outrosCustos)}</strong></p></div></div>
                    </div>
                    ${obsHtml}
                </main>
                <div class="total-box"><span class="total-display">TOTAL: ${total}</span></div>
                <footer>
                    <div class="validade">Orçamento válido por 15 dias, sujeito a aprovação final.</div>
                    <div class="contact-info">
                        <p>-- G Eletrica - 41.065.559/0001-87 --</p>
                        <p>(87) 9.8802-7252 // Att. Thiago Gois</p>
                    </div>
                </footer>
            </div>
        </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 500);
}