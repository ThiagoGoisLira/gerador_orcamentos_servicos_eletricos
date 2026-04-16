<?php
require_once 'config/conexao.php';

$stmt = $pdo->query("SELECT id, cliente_nome, cliente_endereco, cliente_telefone, data_orcamento, total, status, detalhes_json FROM orcamentos ORDER BY data_criacao DESC");
$orcamentos = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <title>Painel de Gestão</title>
    <link rel="stylesheet" href="css/style.css?v=<?php echo time(); ?>">
</head>

<body>
    <div class="container container-large">
        <div class="page-header">
            <h1>Gestão de Orçamentos</h1>
            <div style="display: flex; gap: 15px; align-items: center;">
                <input type="text" id="searchInput" class="search-input" placeholder="🔍 Procurar cliente...">
                <a href="index.html" class="btn-link" style="background-color: var(--primary); color: white;">+ Novo Orçamento</a>
            </div>
        </div>

        <div class="section-card" style="padding: 0; overflow: hidden;">
            <div class="table-wrapper" style="border: none;">
                <table id="orcamentosTable">
                    <thead>
                        <tr>
                            <th>Nº</th>
                            <th>Cliente</th>
                            <th>Data</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th style="text-align: right;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($orcamentos as $orc): ?>
                            <tr class="linha-orcamento">
                                <td style="color: var(--text-muted); font-weight: 600;">#<?php echo $orc['id']; ?></td>
                                <td class="nome-cliente" style="font-weight: 500;"><?php echo htmlspecialchars($orc['cliente_nome']); ?></td>
                                <td><?php echo date('d/m/Y', strtotime($orc['data_orcamento'])); ?></td>

                                <td style="font-weight: 600;">R$ <?php echo number_format($orc['total'], 2, ',', '.'); ?></td>

                                <td>
                                    <select class="change-status" data-id="<?php echo $orc['id']; ?>" onchange="updateStatus(this)">
                                        <option value="Pendente" <?php echo $orc['status'] == 'Pendente' ? 'selected' : ''; ?>>Pendente</option>
                                        <option value="Aprovado" <?php echo $orc['status'] == 'Aprovado' ? 'selected' : ''; ?>>Aprovado</option>
                                        <option value="Recusado" <?php echo $orc['status'] == 'Recusado' ? 'selected' : ''; ?>>Recusado</option>
                                    </select>
                                    &nbsp;
                                    <span class="status-badge <?php echo $orc['status']; ?>"><?php echo $orc['status']; ?></span>
                                </td>
                                <td class="col-acoes" style="text-align: right;">
                                    <button class="btn-action btn-view" data-json="<?php echo htmlspecialchars($orc['detalhes_json'] ?? '{}', ENT_QUOTES, 'UTF-8'); ?>" onclick="openViewModal(this)">Ver</button>
                                    <a href="index.html?id=<?php echo $orc['id']; ?>" class="btn-action btn-edit" style="text-decoration: none; padding: 7px 12px; display: inline-block;">Editar Completo</a>
                                    <button class="btn-action btn-delete" onclick="deleteQuote(<?php echo $orc['id']; ?>)">🗑️</button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        <tr id="noResults" style="display: none;">
                            <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-muted);">Nenhum registo encontrado.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div id="viewModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" onclick="closeModals()">&times;</span>
            <h2 class="modal-title">Detalhes do Orçamento</h2>
            <div id="viewModalBody" style="margin-top: 20px; line-height: 1.6;"></div>
        </div>
    </div>

    <script>
        // Função de moeda em JS (formatada para pt-BR e BRL)
        function formatMoney(value) {
            return parseFloat(value || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        }

        document.getElementById('searchInput').addEventListener('keyup', function() {
            let filter = this.value.toLowerCase();
            let rows = document.querySelectorAll('.linha-orcamento');
            let hasVisibleRows = false;
            rows.forEach(row => {
                if (row.textContent.toLowerCase().includes(filter)) {
                    row.style.display = '';
                    hasVisibleRows = true;
                } else {
                    row.style.display = 'none';
                }
            });
            document.getElementById('noResults').style.display = hasVisibleRows ? 'none' : 'table-row';
        });

        async function updateStatus(selectElement) {
            const id = selectElement.getAttribute('data-id');
            const novoStatus = selectElement.value;
            try {
                const response = await fetch('api/atualizar_status.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                        status: novoStatus
                    })
                });
                const resultado = await response.json();
                if (resultado.sucesso) location.reload();
                else alert('Erro ao atualizar estado.');
            } catch (erro) {
                alert('Erro de ligação.');
            }
        }

        async function deleteQuote(id) {
            if (confirm('Tem a certeza que deseja excluir este orçamento permanentemente?')) {
                try {
                    const response = await fetch('api/excluir_orcamento.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: id
                        })
                    });
                    const resultado = await response.json();
                    if (resultado.sucesso) {
                        location.reload();
                    } else {
                        alert('Erro ao excluir.');
                    }
                } catch (erro) {
                    alert('Erro de ligação.');
                }
            }
        }

        function openViewModal(btnElement) {
            let detalhes = {};
            try {
                detalhes = JSON.parse(btnElement.getAttribute('data-json'));
            } catch (e) {
                return;
            }
            let html = '';

            if (detalhes.servicos && detalhes.servicos.length > 0) {
                html += `<div style="margin-bottom: 20px;"><h3 style="color:var(--primary); margin-bottom: 10px; font-size: 1.1em;">Serviços Selecionados</h3><ul style="padding-left: 20px; color: var(--text-main);">`;
                detalhes.servicos.forEach(s => html += `<li style="margin-bottom: 5px;"><strong>${s.servico}</strong> - <span style="color: var(--success); font-weight:bold;">${formatMoney(s.valor)}</span>${s.descricao ? `<br><small style="color: var(--text-muted);">📝 ${s.descricao}</small>` : ''}</li>`);
                html += `</ul></div>`;
            }
            if (detalhes.itens_adicionais && detalhes.itens_adicionais.length > 0) {
                html += `<div style="margin-bottom: 20px;"><h3 style="color:var(--primary); margin-bottom: 10px; font-size: 1.1em;">Materiais Adicionais</h3><table style="width: 100%; border-collapse: collapse; font-size: 0.95em;"><tr><th style="text-align: left; padding-bottom: 5px; border-bottom: 2px solid var(--border-color);">Descrição</th><th style="text-align: right; padding-bottom: 5px; border-bottom: 2px solid var(--border-color);">Valor</th></tr>`;

                // R$ nos Itens Adicionais (Modal do Dashboard)
                detalhes.itens_adicionais.forEach(item => html += `<tr><td style="padding: 8px 0; border-bottom: 1px solid var(--border-color);">${item.descricao}</td><td style="padding: 8px 0; border-bottom: 1px solid var(--border-color); text-align: right; font-weight: 500;">R$ ${item.valor}</td></tr>`);
                html += `</table></div>`;
            }
            if (detalhes.custos_extras && parseFloat(detalhes.custos_extras) > 0) html += `<p style="font-size: 1.05em;"><strong>Custos Extras:</strong> <span style="color: var(--warning); font-weight: bold;">${formatMoney(detalhes.custos_extras)}</span></p>`;
            if (detalhes.observacoes) html += `<div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid var(--border-color);"><strong style="color:var(--text-main);">Observações:</strong><br> <span style="white-space: pre-wrap; color: var(--text-muted); font-size:0.9em;">${detalhes.observacoes}</span></div>`;
            if (html === '') html = "<p style='color: var(--text-muted);'>Nenhum detalhe salvo.</p>";

            document.getElementById('viewModalBody').innerHTML = html;
            document.getElementById('viewModal').style.display = 'block';
        }

        function closeModals() {
            document.getElementById('viewModal').style.display = 'none';
        }
        window.onclick = function(event) {
            if (event.target == document.getElementById('viewModal')) {
                closeModals();
            }
        }
    </script>
</body>

</html>