/**
 * Vai buscar os dados de um orçamento existente à base de dados
 */
export async function fetchQuote(id) {
    try {
        const response = await fetch(`api/buscar_orcamento.php?id=${id}`);
        const textoResposta = await response.text();
        const result = JSON.parse(textoResposta);
        
        if (!result.sucesso) throw new Error(result.erro);
        return result.dados;
    } catch (erro) {
        console.error("Erro na API (fetchQuote):", erro);
        alert("Erro ao carregar dados do servidor. Veja a consola (F12).");
        return null;
    }
}

/**
 * Envia os dados para criar (INSERT) ou atualizar (UPDATE)
 */
export async function saveQuote(dados, editId) {
    let urlEndpoint = 'api/salvar_orcamento.php'; 
    if (editId) {
        dados.id = editId;
        urlEndpoint = 'api/atualizar_orcamento_completo.php'; 
    }

    try {
        const response = await fetch(urlEndpoint, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(dados)
        });
        
        const textoResposta = await response.text();
        const resultado = JSON.parse(textoResposta);
        
        if (resultado.sucesso) {
            alert('✅ ' + (resultado.mensagem || `Orçamento guardado com sucesso! (ID: ${resultado.id})`));
            if (!editId) window.location.href = 'dashboard.php';
        } else {
            alert('❌ Erro: ' + resultado.erro);
        }
    } catch (erro) {
        console.error("Erro na API (saveQuote):", erro);
        alert('❌ Falha de ligação ao servidor.');
    }
}