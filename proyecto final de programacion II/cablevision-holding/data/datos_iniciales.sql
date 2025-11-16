-- Script de inserción de datos de ejemplo para Cablevision Holding

INSERT INTO Pais (nombre) VALUES ('Argentina'), ('Chile'), ('Uruguay');

INSERT INTO AreaMercado (nombre) VALUES ('Telecomunicaciones'), ('Internet'), ('TV por cable');

INSERT INTO Empresa (nombre, fechaEntradaHolding, facturacionAnual, numeroVendedores, ciudadSede, pais_sede_id) VALUES
('Cablevision SA', '2010-05-01', 15000000, 120, 'Buenos Aires', 1),
('TeleRed', '2015-09-15', 8000000, 60, 'Santiago', 2);

INSERT INTO empresa_pais_operacion (empresa_id, pais_id) VALUES (1, 1), (1, 2), (2, 2), (2, 3);

INSERT INTO empresa_area_mercado (empresa_id, area_mercado_id) VALUES (1, 1), (1, 2), (2, 2), (2, 3);

INSERT INTO Usuario (username, password, nombre, apellido, email, tipo) VALUES
('asesor1', 'pass123', 'Juan', 'Pérez', 'juan.perez@mail.com', 'ASESOR'),
('vendedor1', 'pass456', 'Ana', 'García', 'ana.garcia@mail.com', 'VENDEDOR'),
('vendedor2', 'pass789', 'Luis', 'Martínez', 'luis.martinez@mail.com', 'VENDEDOR');

INSERT INTO Asesor (id, codigoAsesor, titulacion) VALUES (1, 'A001', 'Lic. en Marketing');

INSERT INTO Vendedor (id, codigoVendedor, empresa_id, vendedor_superior_id) VALUES (2, 'V001', 1, NULL), (3, 'V002', 2, 2);

INSERT INTO AsesorEmpresaArea (asesor_id, empresa_id, area_mercado_id) VALUES (1, 1, 1), (1, 2, 2);

INSERT INTO cuentas (numeroCuenta, pin, saldo, activa, fecha_creacion, ultima_actualizacion) VALUES
('10001', '1234', 5000.00, true, NOW(), NOW()),
('10002', '5678', 2500.00, true, NOW(), NOW());

INSERT INTO Captacion (vendedor_id, vendedor_captado_id, fechaCaptacion) VALUES (2, 3, '2023-10-01');
