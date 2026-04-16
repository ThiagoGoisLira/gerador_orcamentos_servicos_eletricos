<?php
// API para DELETAR da BD
ini_set('display_errors', 0);
header('Content-Type: application/json');
require_once '../config/conexao.php';

try {
    $dados = json_decode(file_get_contents("php://input"), true);

    if (isset($dados['id'])) {
        $sql = "DELETE FROM orcamentos WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $dados['id']]);
        echo json_encode(['sucesso' => true]);
    } else {
        echo json_encode(['sucesso' => false, 'erro' => 'ID não fornecido']);
    }
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
