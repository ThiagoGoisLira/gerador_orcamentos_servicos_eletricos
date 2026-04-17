/**
 * ============================================================================
 * FICHEIRO: api.js
 * RESPONSABILIDADE: Comunicação com o Servidor (Back-end PHP).
 * Encapsula toda a lógica de pedidos de rede (Fetch API).
 * ============================================================================
 */

/**
 * Vai buscar os dados de um orçamento existente à base de dados (Modo Leitura).
 * * @param {string|number} id - O identificador único do orçamento que queremos carregar.
 * @returns {Object|null} - Retorna o objeto com os dados do orçamento ou null se falhar.
 */
export async function fetchQuote(id) {
    try {
        // 1. Faz o pedido GET padrão, passando o ID pelo URL (Query String)
        const response = await fetch(`api/buscar_orcamento.php?id=${id}`);
        
        // 2. Lemos a resposta como texto puro PRIMEIRO. 
        // TRUQUE DE MESTRE: Isto ajuda imenso a fazer debugging. Se o PHP falhar e 
        // devolver uma página de erro HTML, ver o erro em texto salva horas de dor de cabeça.
        const textoResposta = await response.text();
        const result = JSON.parse(textoResposta);
        
        // 3. Verifica a flag 'sucesso' que configurámos no nosso PHP
        if (!result.sucesso) throw new Error(result.erro);
        
        // 4. Se tudo correu bem, devolve apenas o "miolo" (os dados úteis) para o main.js
        return result.dados;
        
    } catch (erro) {
        // Captura falhas de rede (sem internet), erros de parse (JSON quebrado) ou o nosso próprio "throw"
        console.error("Erro na API (fetchQuote):", erro);
        alert("Erro ao carregar dados do servidor. Veja a consola (F12).");
        return null;
    }
}

/**
 * Envia os dados para criar (INSERT) um novo orçamento ou atualizar (UPDATE) um existente.
 * * @param {Object} dados - O objeto JSON final, já mastigado e formatado pelo ui.js
 * @param {string|null} editId - O ID do orçamento se estivermos a editar (ou undefined/null se for novo)
 */
export async function saveQuote(dados, editId) {
    // 1. Configuração Padrão: Assume que vamos criar um NOVO orçamento
    let urlEndpoint = 'api/salvar_orcamento.php'; 
    
    // 2. Desvio de Lógica (UPDATE): Se o botão tinha um ID gravado, estamos em Modo Edição
    if (editId) {
        dados.id = editId; // Embutimos o ID dentro do pacote de dados para o PHP saber quem atualizar
        urlEndpoint = 'api/atualizar_orcamento_completo.php'; // Mudamos a rota para o ficheiro de Update
    }

    try {
        // 3. Executa o pedido POST ao servidor
        const response = await fetch(urlEndpoint, {
            method: 'POST', 
            // Informa o PHP de que a "encomenda" que estamos a enviar está no formato JSON
            headers: { 'Content-Type': 'application/json' }, 
            // Pega no objeto JavaScript e transforma-o numa String JSON (serialização)
            body: JSON.stringify(dados)
        });
        
        // 4. Processa a resposta do servidor usando a mesma técnica de ler o texto primeiro
        const textoResposta = await response.text();
        const resultado = JSON.parse(textoResposta);
        
        // 5. Avalia o resultado ditado pelo PHP
        if (resultado.sucesso) {
            // Feedback de sucesso para o utilizador
            alert('✅ ' + (resultado.mensagem || `Orçamento guardado com sucesso! (ID: ${resultado.id})`));
            
            // Regra de UX (Experiência do Utilizador):
            // - Se criou um novo, reencaminha logo para a listagem (dashboard).
            // - Se estava apenas a editar/atualizar, mantém-o na página de edição.
            if (!editId) window.location.href = 'dashboard.php';
            
        } else {
            // O PHP encontrou um erro lógico (ex: dados incompletos ou falha no PDO)
            alert('❌ Erro: ' + resultado.erro);
        }
    } catch (erro) {
        // O servidor desligou-se, internet caiu ou o PHP não devolveu JSON válido
        console.error("Erro na API (saveQuote):", erro);
        alert('❌ Falha de ligação ao servidor.');
    }
}