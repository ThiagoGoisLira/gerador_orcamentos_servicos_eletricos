<?php
// API para LER (SELECT) um orçamento específico
ini_set('display_errors', 0);
header('Content-Type: application/json');
require_once '../config/conexao.php';

try {
    if (isset($_GET['id'])) {
        $sql = "SELECT * FROM orcamentos WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $_GET['id']]);

        $orcamento = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($orcamento) {
            echo json_encode(['sucesso' => true, 'dados' => $orcamento]);
        } else {
            echo json_encode(['sucesso' => false, 'erro' => 'Nenhum orçamento encontrado.']);
        }
    } else {
        echo json_encode(['sucesso' => false, 'erro' => 'ID em falta.']);
    }
} catch (PDOException $e) {
    echo json_encode(['sucesso' => false, 'erro' => 'Erro SQL: ' . $e->getMessage()]);
}
