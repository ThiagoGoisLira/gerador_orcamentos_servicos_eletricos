# 📝 Sistema Gerador de Orçamentos (SaaS Style)

Um sistema web completo para criação, gestão e impressão de orçamentos de serviços e materiais. Desenvolvido com uma interface moderna, amigável e focado na produtividade de profissionais autônomos e pequenas empresas.

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-success)
![Linguagem Principal](https://img.shields.io/badge/PHP-Backend-777BB4?logo=php)
![Linguagem Front](https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?logo=javascript)

---

## ✨ Funcionalidades

- **CRUD Completo:** Crie, visualize, edite e exclua orçamentos diretamente da base de dados.
- **Edição "Rehydration":** Capacidade de carregar um orçamento antigo e preencher automaticamente todo o formulário (serviços, itens e valores) para edição ou reimpressão.
- **Cálculo Automático:** Soma automática de serviços fixos, peças adicionais (tabela dinâmica) e custos extras em tempo real.
- **Geração de PDF:** Layout de impressão profissional gerado dinamicamente numa aba limpa para entrega ao cliente ou impressão.
- **Armazenamento Flexível:** Utiliza a tipagem `JSON` no MySQL para guardar quantidades infinitas de itens e descrições sem a necessidade de tabelas relacionais complexas.
- **Gestão de Status:** Controle visual rápido para saber se o orçamento está `Pendente`, `Aprovado` ou `Recusado`.
- **Pesquisa em Tempo Real:** Filtro rápido no Dashboard pelo nome do cliente ou texto usando Vanilla JavaScript, sem recarregar a página.
- **UI/UX Moderna:** Interface baseada em "Cards" (Cartões), com paleta de cores harmoniosa, sombras profundas e modais interativos (Design inspirado em plataformas SaaS).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 (CSS Variables, Flexbox, Grid Layout), Vanilla JavaScript (Fetch API, DOM Manipulation).
- **Backend:** PHP 7/8 (PDO com `ERRMODE_EXCEPTION` para segurança máxima contra SQL Injection e tratamento de erros).
- **Base de Dados:** MySQL (Consultas parametrizadas e armazenamento inteligente em JSON).
- **Ambiente de Desenvolvimento:** XAMPP (Apache + MySQL).

---

## 📂 Estrutura do Projeto e Explicação dos Ficheiros

```text
/gerador_orcamentos
│
├── Index.html                       # Página principal: Formulário em "Cards" para criar/editar.
├── dashboard.php                    # Painel de Controlo: Tabela de gestão, pesquisa e status.
├── style.css                        # Folha de estilos global: Controla as cores e a UI.
├── script.js                        # Motor Front-end: Lógica de cálculos, PDF e Fetch API.
├── banco_de_dados.sql               # Script SQL: Criação da base de dados.
│
├── salvar_orcamento.php             # API PHP (Create): Insere um novo registo.
├── buscar_orcamento.php             # API PHP (Read): Busca um orçamento pelo ID.
├── atualizar_orcamento_completo.php # API PHP (Update): Atualiza todos os dados de um orçamento.
├── atualizar_status.php             # API PHP (Update): Altera rapidamente o status.
└── excluir_orcamento.php            # API PHP (Delete): Remove um registo da base de dados.

🚀 Como Executar o Projeto Localmente
Pré-requisitos

Para rodar este projeto, irá precisar de um servidor web local com suporte a PHP e MySQL, como o XAMPP, WAMP ou LAMP.
Passo a Passo

    Clonar o Repositório
    Faça o clone deste repositório para a pasta pública do seu servidor web (no XAMPP, a pasta htdocs).
git clone [https://github.com/ThiagoGoisLira/gerador_de_orcamentos_eletricos.git](https://github.com/ThiagoGoisLira/gerador_de_orcamentos_eletricos) gerador_orcamentos

Iniciar o Servidor
Abra o painel de controlo do XAMPP e inicie os módulos Apache e MySQL.

Configurar a Base de Dados

    Aceda ao phpMyAdmin (geralmente em http://localhost/phpmyadmin).

    Crie uma base de dados chamada gerador_orcamentos.

    Vá à aba SQL, copie o conteúdo do ficheiro banco_de_dados.sql e execute-o para criar a tabela.

Aceder ao Sistema
Abra o seu navegador de internet e aceda ao seguinte endereço:
http://localhost/gerador_orcamentos/Index.html

⚙️ Configurações da Base de Dados

Se o seu ambiente MySQL possuir uma senha diferente do padrão do XAMPP, lembre-se de atualizar as credenciais nos ficheiros PHP do back-end (salvar_orcamento.php, buscar_orcamento.php, etc):
    $host = 'localhost';
    $dbname = 'gerador_orcamentos';
    $user = 'root'; // Altere para o seu utilizador
    $pass = '';     // Coloque a sua senha aqui, se houver

📸 Screenshots

    Tela de Criação de Orçamento:
    assets/Tela1.png

    Painel de Gestão (Dashboard):
    assets/Tela3.png

    Layout de Impressão / PDF:
    assets/Tela2.png

🤝 Contribuições

Contribuições são sempre bem-vindas! Se tens alguma ideia para melhorar o código, refatorar o JavaScript ou adicionar novas features, sente-te à vontade para fazer um fork do repositório e abrir um Pull Request.
📄 Licença

Este projeto está sob a licença MIT. Consulta o ficheiro LICENSE para mais detalhes.

Desenvolvido com 💻 e ☕ por THIAGO GOiS