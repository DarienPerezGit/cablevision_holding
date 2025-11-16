-- Script de creación de tablas para Cablevision Holding (MySQL)

CREATE TABLE Pais (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE AreaMercado (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Empresa (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    fechaEntradaHolding DATE,
    facturacionAnual DOUBLE,
    numeroVendedores INT,
    ciudadSede VARCHAR(100),
    pais_sede_id BIGINT,
    FOREIGN KEY (pais_sede_id) REFERENCES Pais(id)
);

CREATE TABLE empresa_pais_operacion (
    empresa_id BIGINT NOT NULL,
    pais_id BIGINT NOT NULL,
    PRIMARY KEY (empresa_id, pais_id),
    FOREIGN KEY (empresa_id) REFERENCES Empresa(id),
    FOREIGN KEY (pais_id) REFERENCES Pais(id)
);

CREATE TABLE empresa_area_mercado (
    empresa_id BIGINT NOT NULL,
    area_mercado_id BIGINT NOT NULL,
    PRIMARY KEY (empresa_id, area_mercado_id),
    FOREIGN KEY (empresa_id) REFERENCES Empresa(id),
    FOREIGN KEY (area_mercado_id) REFERENCES AreaMercado(id)
);

CREATE TABLE Usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    email VARCHAR(100),
    tipo VARCHAR(20) NOT NULL
);

CREATE TABLE Asesor (
    id BIGINT PRIMARY KEY,
    codigoAsesor VARCHAR(50),
    titulacion VARCHAR(100),
    FOREIGN KEY (id) REFERENCES Usuario(id)
);

CREATE TABLE Vendedor (
    id BIGINT PRIMARY KEY,
    codigoVendedor VARCHAR(50),
    empresa_id BIGINT,
    vendedor_superior_id BIGINT,
    FOREIGN KEY (id) REFERENCES Usuario(id),
    FOREIGN KEY (empresa_id) REFERENCES Empresa(id),
    FOREIGN KEY (vendedor_superior_id) REFERENCES Vendedor(id)
);

CREATE TABLE AsesorEmpresaArea (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    asesor_id BIGINT,
    empresa_id BIGINT,
    area_mercado_id BIGINT,
    FOREIGN KEY (asesor_id) REFERENCES Asesor(id),
    FOREIGN KEY (empresa_id) REFERENCES Empresa(id),
    FOREIGN KEY (area_mercado_id) REFERENCES AreaMercado(id)
);

CREATE TABLE cuentas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numeroCuenta VARCHAR(50) NOT NULL UNIQUE,
    pin VARCHAR(20) NOT NULL,
    saldo DECIMAL(15,2) NOT NULL,
    activa BOOLEAN NOT NULL,
    fecha_creacion DATETIME,
    ultima_actualizacion DATETIME
);

CREATE TABLE Captacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendedor_id BIGINT,
    vendedor_captado_id BIGINT,
    fechaCaptacion DATE,
    FOREIGN KEY (vendedor_id) REFERENCES Vendedor(id),
    FOREIGN KEY (vendedor_captado_id) REFERENCES Vendedor(id)
);
