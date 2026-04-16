<?php
// API para CRIAR (INSERT) um orçamento
ini_set('display_errors', 0);
header('Content-Type: application/json');

// Importa a ligação (O '../' volta uma pasta atrás para achar o config)
require_once '../config/conexao.php';

$dadosBrutos = file_get_contents("php://input");
$dados = json_decode($dadosBrutos, true);

if ($dados) {
    try {
        $sql = "INSERT INTO orcamentos (cliente_nome, cliente_endereco, cliente_telefone, data_orcamento, total, status, detalhes_json) 
                VALUES (:nome, :endereco, :telefone, :data, :total, :status, :detalhes)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nome' => $dados['cliente_nome'],
            ':endereco' => $dados['cliente_endereco'],
            ':telefone' => $dados['cliente_telefone'],
            ':data' => $dados['data_orcamento'],
            ':total' => $dados['total'],
            ':status' => $dados['status'],
            ':detalhes' => json_encode($dados['detalhes'])
        ]);

        echo json_encode(['sucesso' => true, 'id' => $pdo->lastInsertId()]);
    } catch (PDOException $e) {
        echo json_encode(['sucesso' => false, 'erro' => 'Erro ao guardar: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['sucesso' => false, 'erro' => 'Nenhum dado recebido.']);
}
