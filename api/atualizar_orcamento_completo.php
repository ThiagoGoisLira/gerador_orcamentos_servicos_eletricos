<?php
// API para ATUALIZAR (UPDATE) um orçamento na íntegra
ini_set('display_errors', 0);
header('Content-Type: application/json');
require_once '../config/conexao.php';

try {
    $dadosBrutos = file_get_contents("php://input");
    $dados = json_decode($dadosBrutos, true);

    if (!$dados) {
        echo json_encode(['sucesso' => false, 'erro' => 'Dados inválidos.']);
        exit;
    }

    if (isset($dados['id']) && isset($dados['cliente_nome'])) {

        $sql = "UPDATE orcamentos SET 
                cliente_nome = :nome, 
                cliente_endereco = :endereco, 
                cliente_telefone = :telefone, 
                data_orcamento = :data, 
                total = :total,
                status = :status,
                detalhes_json = :detalhes
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nome' => $dados['cliente_nome'],
            ':endereco' => $dados['cliente_endereco'],
            ':telefone' => $dados['cliente_telefone'],
            ':data' => $dados['data_orcamento'] ?: null,
            ':total' => $dados['total'],
            ':status' => $dados['status'],
            ':detalhes' => json_encode($dados['detalhes']),
            ':id' => $dados['id']
        ]);

        echo json_encode(['sucesso' => true, 'mensagem' => 'Atualizado com sucesso!']);
    } else {
        echo json_encode(['sucesso' => false, 'erro' => 'ID ou Nome em falta.']);
    }
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => 'Erro SQL: ' . $e->getMessage()]);
}
