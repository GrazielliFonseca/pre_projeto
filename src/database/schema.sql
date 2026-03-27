CREATE TABLE IF NOT EXISTS categoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(50) NOT NULL CHECK (length(trim(nome)) > 0),
    beneficios VARCHAR(100),
    preco DECIMAL(10, 2) CHECK (preco >= 0)
);

CREATE TABLE IF NOT EXISTS funcionario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(50) NOT NULL CHECK (length(trim(nome)) > 0),
    cargo VARCHAR (50) CHECK (cargo IN ('Adm', 'Gerente', 'Estoquista', 'Vendedor')),
    nivel_permissao VARCHAR (50) CHECK (nivel_permissao IN ('Total', 'Restrito'))
);

CREATE TABLE IF NOT EXISTS fornecedor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(50) NOT NULL CHECK (length(trim(nome)) > 0),
    telefone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL CHECK (email LIKE '%@%'),
    cnpj VARCHAR(20) UNIQUE NOT NULL 
);

CREATE TABLE IF NOT EXISTS produto (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL CHECK (length(trim(nome)) > 0),
    descricao VARCHAR(255),
    categoria VARCHAR(50),
    tamanho VARCHAR(20),
    cor VARCHAR(20),
    marca VARCHAR(50),
    sku VARCHAR(50) UNIQUE,
    qtd INT DEFAULT 0 CHECK (qtd >= 0),
    estoque_min INT DEFAULT 5 CHECK (estoque_min >= 0),
    custo DECIMAL(10, 2) CHECK (custo >= 0),
    venda DECIMAL(10, 2) CHECK (venda >= 0),
    margem DECIMAL(10, 2),
    id_funcionario INT,
    id_fornecedor INT,
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id),
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedor(id),
    CHECK (venda >= custo)
);

CREATE TABLE IF NOT EXISTS cliente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL CHECK (length(trim(nome)) > 0),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL CHECK (email LIKE '%@%'),
    senha TEXT,
    telefone VARCHAR(20),
    rua VARCHAR(100),
    numero VARCHAR(50),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    cep VARCHAR(9),
    data_nasc VARCHAR(10),
    id_categoria INT DEFAULT 1,
    perfil_estilo VARCHAR(50) DEFAULT 'Casual',
    total_gasto DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id)
);

CREATE TABLE IF NOT EXISTS pedido (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INT,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10, 2) CHECK (valor_total >= 0) NOT NULL,
    forma_pagto VARCHAR(50) CHECK (forma_pagto IN ('Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Pix')),
    status VARCHAR(50) CHECK (status IN ('Pendente', 'Finalizado', 'Cancelado')),
    forma_entrega VARCHAR(50) CHECK (forma_entrega IN ('Enviar', 'Retirar na loja')),
    frete DECIMAL(10, 2) CHECK (frete >= 0) DEFAULT 0.00,
    cep VARCHAR(9),
    rua VARCHAR(100),
    numero VARCHAR(10),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    estado VARCHAR(50),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id)
);

CREATE TABLE IF NOT EXISTS itens_pedido (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INT,
    id_produto INT,
    qtd INT CHECK (qtd > 0),
    valor_unitario DECIMAL(10,2) CHECK (valor_unitario >= 0),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id),
    FOREIGN KEY (id_produto) REFERENCES produto(id)
);

CREATE TABLE IF NOT EXISTS movimento_estoque (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_produto INT,
    id_funcionario INT,
    id_pedido INT,
    tipo_movimentacao VARCHAR(50) CHECK (tipo_movimentacao IN ('Entrada', 'Saída', 'Ajuste', 'Devolução')),
    qtd INT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produto) REFERENCES produto(id),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id)
);

CREATE TABLE IF NOT EXISTS avaliacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INT,
    id_produto INT,
    estrelas INT CHECK (estrelas BETWEEN 1 AND 5),
    descricao VARCHAR(100),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_produto) REFERENCES produto(id)
);
