<?php
// API para mudar o Estado rapidamente
ini_set('display_errors', 0);
header('Content-Type: application/json');
require_once '../config/conexao.php';

try {
    $dados = json_decode(file_get_contents("php://input"), true);

    if (isset($dados['id']) && isset($dados['status'])) {
        $sql = "UPDATE orcamentos SET status = :status WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':status' => $dados['status'], ':id' => $dados['id']]);
        echo json_encode(['sucesso' => true]);
    } else {
        echo json_encode(['sucesso' => false, 'erro' => 'Dados incompletos']);
    }
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}
?>