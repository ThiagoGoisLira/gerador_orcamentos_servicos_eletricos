-- Cria a base de dados e seleciona para uso
CREATE DATABASE gerador_orcamentos;
USE gerador_orcamentos;

-- Cria a tabela principal
CREATE TABLE orcamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_nome VARCHAR(255) NOT NULL,
    cliente_endereco VARCHAR(255),
    cliente_telefone VARCHAR(50),
    data_orcamento DATE,
    total DECIMAL(10,2),
    status ENUM('Pendente', 'Aprovado', 'Recusado') DEFAULT 'Pendente',
    detalhes_json JSON,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);