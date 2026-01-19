🚀 LevelUp Eventos

    Plataforma interativa para eventos, comunidades e gamificação educacional, unindo tecnologia, engajamento e experiência do usuário em um único ecossistema digital.

📌 Sobre o Projeto

    O LevelUp Eventos é uma plataforma web desenvolvida para conectar pessoas através de eventos tecnológicos, comunidades temáticas e desafios interativos (quizzes), promovendo aprendizado contínuo e engajamento por meio de gamificação e ranking global.

    O projeto foi idealizado para resolver a dificuldade de engajar participantes em eventos online e presenciais, oferecendo uma experiência moderna, interativa e motivadora.

🎯 Problema

    Atualmente, muitos eventos perdem engajamento após a inscrição inicial. Falta interação contínua entre participantes, organizadores e conteúdo.

    Principais dores identificadas:

    Baixa participação após o evento

    Pouca integração entre participantes

    Falta de incentivo ao aprendizado contínuo

    Experiência digital pouco atrativa

💡 Solução Proposta

    O LevelUp Eventos centraliza:

    Eventos em destaque

    Comunidades temáticas (tecnologia, cultura geek, programação, etc.)

    Sistema de quizzes interativos

    Ranking global de usuários

    Tudo em uma interface moderna inspirada em plataformas de streaming.

🧩 Funcionalidades Principais
👤 Autenticação

    Cadastro e login de usuários

    Autenticação segura com JWT

📅 Eventos

    Listagem de eventos em destaque

    Detalhes de cada evento

    Integração com API REST

👥 Comunidades

    Entrar e sair de comunidades

    Comunidades temáticas (Star Wars, Harry Potter, Marvel, Naruto, Dragon Ball)

🧠 Quizzes

    Quizzes interativos por comunidade

    Feedback visual de respostas corretas e incorretas

    Pontuação automática

🏆 Ranking

    Ranking global de usuários

    Sistema de pontuação por desempenho

🏗️ Arquitetura do Projeto

    O projeto utiliza arquitetura monorepo, separando backend e frontend:

    LevelUpEventos/
    ├── api/        # Backend (Node.js + Express)
    └── frontend/   # Frontend (HTML, CSS, JavaScript)

⚙️ Tecnologias Utilizadas
    Backend (/api)

    Node.js

    Express.js

    MongoDB

    Mongoose

    JWT (JSON Web Token)

    Bcrypt

    CORS

    Frontend (/frontend)

    HTML5

    CSS3 (Design System próprio)

    JavaScript (Vanilla JS)

    Fetch API

    LocalStorage

    UI inspirada em Netflix/Streaming

🔐 Segurança

    Autenticação baseada em JWT

    Rotas protegidas por middleware

    Criptografia de senhas com Bcrypt

▶️ Como Executar o Projeto

    1️⃣ Clonar o repositório
    git clone https://github.com/Joao-Roberto-Soares/LevelUpEventos.git
    cd LevelUpEventos

    2️⃣ Rodar o Backend
    cd api
    npm install
    npm start


    Servidor rodando em:

    http://localhost:3000

    3️⃣ Rodar o Frontend

    Abra o arquivo:

    frontend/login.html


    ou utilize uma extensão como Live Server.

🧪 Usuários e Testes

    Você pode criar uma conta diretamente pela tela de cadastro.

👨‍💻 Organização da Equipe (Projeto Acadêmico)

    O desenvolvimento foi dividido em áreas:

    Área	Responsável
    Arquitetura do Sistema	João Roberto
    Backend e API REST	João Roberto
    Autenticação e Segurança	João Roberto
    Frontend e UI/UX	João Roberto
    Sistema de Comunidades	João Roberto
    Sistema de Quiz	João Roberto
    Ranking e Gamificação	João Roberto

📈 Diferenciais do Projeto

    Interface moderna e profissional

    Arquitetura escalável

    Gamificação integrada

    Estrutura pronta para produção

    Código organizado e documentado

📌 Próximas Melhorias

    Dashboard administrativo

    Sistema de notificações

    Gamificação avançada (níveis e conquistas)

    Chat em tempo real nas comunidades

    Deploy em nuvem (Render + Vercel)

📄 Licença

    Este projeto foi desenvolvido para fins educacionais.

👤 Autor

    João Roberto Soares
        
        github: Joao-Roberto-Soares
        email: joaorobertovds@gmail.com