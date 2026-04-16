<?php
// Define as credenciais num único lugar!
$host = 'localhost';
$dbname = 'gerador_orcamentos';
$user = 'root';
$pass = '';

try {
    // Cria a ligação (PDO) e força o report de erros detalhados
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Se a base de dados falhar, o sistema para aqui e avisa
    echo json_encode(['sucesso' => false, 'erro' => 'Erro de ligação à base de dados: ' . $e->getMessage()]);
    exit;
}
?>