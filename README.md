## Índice

- [Descrição](#descrição)
- [Componentes](#componentes)
- [Sobre o Projeto](#sobre-o-projeto)
- [Como clonar ou baixar](#como-clonar-ou-baixar)
- [Como instalar](#como-instalar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Licença](#licença)

## Sobre o Projeto

### Título
***Exercitar***

### Componentes
Bárbara Lima Cordeiro da Silva  
Clara Alves Pinheiro  
Ênio Antônio Cunha Lizieri do Nascimento  
Matheus Bezeril Pinto  

### Descrição
Desenvolvido em Django, Next.js, Python, Javascript, HTML, CSS e React, o MVP do site centraliza em duas telas uma de login e outra para a criação e o agendamento de treinos diários ou semanais. 
O usuário pode cadastrar exercícios com séries e repetições e utilizar checkboxes para acompanhar a execução, 
gerando automaticamente a porcentagem de conclusão do treino e um histórico dos dias realizados.

## Como clonar ou baixar

Você pode obter este repositório de três formas:

### Clonar via HTTPS

```bash
git clone https://github.com/39Matheus/EngenhariaDeSoftware.git
```

Isso criará uma cópia local do repositório em sua máquina.

### Clonar via SSH

Se você já configurou sua chave SSH no GitHub, pode clonar usando:

```bash
git clone git@github.com:39Matheus/EngenhariaDeSoftware.git
```

Isso criará uma cópia local do repositório em sua máquina.

### Baixar como ZIP

1. Acesse a página do repositório no GitHub:
https://github.com/39Matheus/EngenhariaDeSoftware
2. Clique no botão **Code** (verde).
3. Selecione **Download ZIP**.
4. Extraia o arquivo ZIP para o local desejado em seu computador.

## Como instalar
### Backend
```bash
cd backend/

# Recomendado
python -m venv .venv
source .venv/bin/activate # Linux
.venv/Scripts/Activate.ps1 # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
### Frontend
```bash
cd exercitar/
npm install
npm run dev
```

## Estrutura do Projeto

```
Eng-de-Software-UFRN/
├── LICENSE
├── README.md
├── UserStories(Prioridades).md
├── .gitignore
├── api-doc.md
├── controle das etapas.csv
├── modelagem_db.md
├── backend/
├── exercitar/
├── docs/
└── assests/
```

- LICENSE: termos da licença do projeto (MIT).
- README.md: este arquivo de apresentação.
- .gitignore: arquivos a serem ignorados pelo git, como ambientes virtuais.
- backend: contém a API.
- exercitar: contém o frontend.
- docs: contém a documentação do projeto.
- assets: imagens para documentação. 

## Licença

Este projeto está licenciado sob a **Licença MIT**. Veja o arquivo `LICENSE` para mais detalhes.
