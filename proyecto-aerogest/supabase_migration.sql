-- =====================================================
-- MIGRACIÓN SUPABASE: AeroGest Cusco
-- Conversión de SQL Server a PostgreSQL
-- =====================================================

-- Eliminar vistas primero (dependen de tablas)
DROP VIEW IF EXISTS vista_dashboard CASCADE;
DROP VIEW IF EXISTS vista_vuelos CASCADE;
DROP VIEW IF EXISTS vista_pasajeros CASCADE;
DROP VIEW IF EXISTS vista_boletos CASCADE;
DROP VIEW IF EXISTS vista_equipajes CASCADE;

-- Eliminar tablas en orden inverso de dependencias
DROP TABLE IF EXISTS VueloEmpleado CASCADE;
DROP TABLE IF EXISTS Boleto CASCADE;
DROP TABLE IF EXISTS Equipaje CASCADE;
DROP TABLE IF EXISTS Asiento CASCADE;
DROP TABLE IF EXISTS Vuelo CASCADE;
DROP TABLE IF EXISTS Pasajero CASCADE;
DROP TABLE IF EXISTS Empleado CASCADE;
DROP TABLE IF EXISTS Cargo CASCADE;
DROP TABLE IF EXISTS Area CASCADE;
DROP TABLE IF EXISTS PuertaEmbarque CASCADE;
DROP TABLE IF EXISTS Aeronave CASCADE;
DROP TABLE IF EXISTS Aerolinea CASCADE;
DROP TABLE IF EXISTS Aeropuerto CASCADE;

-- Tablas de Incidencia (no estaba en script original)
DROP TABLE IF EXISTS incidencias CASCADE;

-- =====================================================
-- TABLAS BASE
-- =====================================================

CREATE TABLE Aeropuerto (
    idAeropuerto SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    ciudad VARCHAR(80) NOT NULL,
    pais VARCHAR(80) NOT NULL,
    codigoIATA CHAR(3) NOT NULL UNIQUE
);

CREATE TABLE Aerolinea (
    idAerolinea SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    paisOrigen VARCHAR(80),
    telefono VARCHAR(20)
);

CREATE TABLE Aeronave (
    idAeronave SERIAL PRIMARY KEY,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    modelo VARCHAR(80) NOT NULL,
    capacidad INT NOT NULL,
    idAerolinea INT NOT NULL REFERENCES Aerolinea(idAerolinea)
);

CREATE TABLE PuertaEmbarque (
    idPuerta SERIAL PRIMARY KEY,
    codigoPuerta VARCHAR(10) NOT NULL UNIQUE,
    zona VARCHAR(50),
    estado VARCHAR(30) DEFAULT 'Disponible'
);

CREATE TABLE Vuelo (
    idVuelo SERIAL PRIMARY KEY,
    codigoVuelo VARCHAR(20) NOT NULL UNIQUE,
    fechaSalida TIMESTAMP NOT NULL,
    fechaLlegada TIMESTAMP NOT NULL,
    estado VARCHAR(30) DEFAULT 'Programado',
    idAerolinea INT NOT NULL REFERENCES Aerolinea(idAerolinea),
    idAeronave INT NOT NULL REFERENCES Aeronave(idAeronave),
    idAeropuertoOrigen INT NOT NULL REFERENCES Aeropuerto(idAeropuerto),
    idAeropuertoDestino INT NOT NULL REFERENCES Aeropuerto(idAeropuerto),
    idPuerta INT REFERENCES PuertaEmbarque(idPuerta)
);

CREATE TABLE Pasajero (
    idPasajero SERIAL PRIMARY KEY,
    nombres VARCHAR(80) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    tipoDocumento VARCHAR(30) NOT NULL,
    nroDocumento VARCHAR(20) NOT NULL UNIQUE,
    nacionalidad VARCHAR(60),
    telefono VARCHAR(20),
    correo VARCHAR(100)
);

CREATE TABLE Asiento (
    idAsiento SERIAL PRIMARY KEY,
    numeroAsiento VARCHAR(10) NOT NULL,
    clase VARCHAR(30) DEFAULT 'Económica',
    idAeronave INT NOT NULL REFERENCES Aeronave(idAeronave)
);

CREATE TABLE Boleto (
    idBoleto SERIAL PRIMARY KEY,
    codigoBoleto VARCHAR(30) NOT NULL UNIQUE,
    fechaCompra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    precio DECIMAL(10,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Activo',
    idPasajero INT NOT NULL REFERENCES Pasajero(idPasajero),
    idVuelo INT NOT NULL REFERENCES Vuelo(idVuelo),
    idAsiento INT NOT NULL REFERENCES Asiento(idAsiento)
);

CREATE TABLE Equipaje (
    idEquipaje SERIAL PRIMARY KEY,
    codigoEquipaje VARCHAR(30) NOT NULL UNIQUE,
    peso DECIMAL(6,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Registrado',
    idBoleto INT NOT NULL REFERENCES Boleto(idBoleto)
);

CREATE TABLE Cargo (
    idCargo SERIAL PRIMARY KEY,
    nombreCargo VARCHAR(80) NOT NULL,
    descripcion VARCHAR(200)
);

CREATE TABLE Area (
    idArea SERIAL PRIMARY KEY,
    nombreArea VARCHAR(80) NOT NULL,
    descripcion VARCHAR(200)
);

CREATE TABLE Empleado (
    idEmpleado SERIAL PRIMARY KEY,
    nombres VARCHAR(80) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    dni CHAR(8) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    turno VARCHAR(30),
    idCargo INT NOT NULL REFERENCES Cargo(idCargo),
    idArea INT NOT NULL REFERENCES Area(idArea)
);

CREATE TABLE VueloEmpleado (
    idVueloEmpleado SERIAL PRIMARY KEY,
    idVuelo INT NOT NULL REFERENCES Vuelo(idVuelo),
    idEmpleado INT NOT NULL REFERENCES Empleado(idEmpleado),
    funcion VARCHAR(80)
);

-- =====================================================
-- TABLA INCIDENCIAS (requerida por la app)
-- =====================================================

CREATE TABLE incidencias (
    id SERIAL PRIMARY KEY,
    vuelo_id INT REFERENCES Vuelo(idVuelo),
    equipaje_id INT REFERENCES Equipaje(idEquipaje),
    descripcion TEXT NOT NULL,
    estado VARCHAR(30) DEFAULT 'Abierta',
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- VISTAS REQUERIDAS POR LA APP
-- =====================================================

CREATE VIEW vista_vuelos AS
SELECT
    v.idVuelo AS id,
    v.codigoVuelo AS codigo,
    al.nombre AS aerolina,
    ao.codigoIATA AS origen,
    ad.codigoIATA AS destino,
    to_char(v.fechaSalida, 'HH24:MI') AS salida,
    to_char(v.fechaLlegada, 'HH24:MI') AS llegada,
    COALESCE(pe.codigoPuerta, '-') AS puerta,
    v.estado
FROM Vuelo v
JOIN Aerolinea al ON v.idAerolinea = al.idAerolinea
JOIN Aeropuerto ao ON v.idAeropuertoOrigen = ao.idAeropuerto
JOIN Aeropuerto ad ON v.idAeropuertoDestino = ad.idAeropuerto
LEFT JOIN PuertaEmbarque pe ON v.idPuerta = pe.idPuerta;

CREATE VIEW vista_pasajeros AS
SELECT
    idPasajero AS id,
    nombres,
    apellidos,
    tipoDocumento AS tipo_documento,
    nroDocumento AS documento,
    nacionalidad,
    telefono,
    correo
FROM Pasajero;

CREATE VIEW vista_boletos AS
SELECT
    b.idBoleto AS id,
    b.codigoBoleto AS codigo_boleto,
    b.idPasajero AS pasajero_id,
    CONCAT(p.nombres, ' ', p.apellidos) AS pasajero_nombre,
    v.codigoVuelo AS vuelo_codigo,
    a.numeroAsiento AS asiento,
    b.precio,
    CASE b.estado
        WHEN 'Activo' THEN 'Confirmado'
        WHEN 'Cancelado' THEN 'Cancelado'
        ELSE 'Pendiente'
    END AS estado
FROM Boleto b
JOIN Pasajero p ON b.idPasajero = p.idPasajero
JOIN Vuelo v ON b.idVuelo = v.idVuelo
JOIN Asiento a ON b.idAsiento = a.idAsiento;

CREATE VIEW vista_equipajes AS
SELECT
    e.idEquipaje AS id,
    e.codigoEquipaje AS codigo_equipaje,
    p.idPasajero AS pasajero_id,
    CONCAT(p.nombres, ' ', p.apellidos) AS pasajero_nombre,
    b.codigoBoleto AS codigo_boleto,
    e.peso,
    CASE e.estado
        WHEN 'Registrado' THEN 'En Tránsito'
        WHEN 'Entregado' THEN 'Entregado'
        WHEN 'Perdido' THEN 'Perdido'
        ELSE 'En Tránsito'
    END AS estado
FROM Equipaje e
JOIN Boleto b ON e.idBoleto = b.idBoleto
JOIN Pasajero p ON b.idPasajero = p.idPasajero;

CREATE VIEW vista_dashboard AS
SELECT
    (SELECT COUNT(*) FROM Vuelo) AS total_vuelos,
    (SELECT COUNT(*) FROM Vuelo WHERE estado = 'Programado') AS vuelos_programados,
    (SELECT COUNT(*) FROM Vuelo WHERE estado = 'Retrasado') AS vuelos_retrasados,
    (SELECT COUNT(*) FROM Vuelo WHERE estado = 'Cancelado') AS vuelos_cancelados,
    (SELECT COUNT(*) FROM Vuelo WHERE estado IN ('Aterrizado', 'Completado')) AS vuelos_aterrizados,
    (SELECT COUNT(*) FROM Pasajero) AS total_pasajeros,
    (SELECT COUNT(*) FROM Boleto) AS total_boletos,
    (SELECT COUNT(*) FROM Equipaje) AS total_equipajes;

-- =====================================================
-- DATOS SEMILLA
-- =====================================================

INSERT INTO Aeropuerto (nombre, ciudad, pais, codigoIATA) VALUES
('Aeropuerto Internacional Alejandro Velasco Astete', 'Cusco', 'Perú', 'CUZ'),
('Aeropuerto Internacional Jorge Chávez', 'Lima/Callao', 'Perú', 'LIM'),
('Aeropuerto Internacional Rodríguez Ballón', 'Arequipa', 'Perú', 'AQP'),
('Aeropuerto Internacional Inca Manco Cápac', 'Juliaca', 'Perú', 'JUL'),
('Aeropuerto Internacional Padre Aldamiz', 'Puerto Maldonado', 'Perú', 'PEM'),
('Aeropuerto Internacional Coronel FAP Francisco Secada Vignetta', 'Iquitos', 'Perú', 'IQT'),
('Aeropuerto Internacional Capitán FAP Guillermo Concha Iberico', 'Piura', 'Perú', 'PIU'),
('Aeropuerto Capitán FAP Carlos Martínez de Pinillos', 'Trujillo', 'Perú', 'TRU'),
('Aeropuerto Coronel FAP Alfredo Mendívil Duarte', 'Ayacucho', 'Perú', 'AYP');

INSERT INTO Aerolinea (nombre, paisOrigen, telefono) VALUES
('LATAM Airlines Perú', 'Perú', '0800-12345'),
('Sky Airline Perú', 'Perú', '0800-54321'),
('JetSMART Perú', 'Perú', '0800-77777'),
('Star Perú', 'Perú', '0800-22222'),
('ATSA Airlines', 'Perú', '0800-99999');

INSERT INTO PuertaEmbarque (codigoPuerta, zona, estado) VALUES
('P1', 'Nacional', 'Disponible'),
('P2', 'Nacional', 'Disponible'),
('P3', 'Nacional', 'Disponible'),
('P4', 'Nacional', 'Disponible'),
('P5', 'Internacional', 'Disponible'),
('P6', 'Internacional', 'Mantenimiento');

INSERT INTO Cargo (nombreCargo, descripcion) VALUES
('Agente de embarque', 'Controla el ingreso de pasajeros'),
('Personal de seguridad', 'Realiza control de seguridad'),
('Operador de equipaje', 'Gestiona traslado de equipaje'),
('Supervisor de operaciones', 'Supervisa operaciones'),
('Técnico de mantenimiento', 'Revisa equipos operativos');

INSERT INTO Area (nombreArea, descripcion) VALUES
('Embarque', 'Abordaje de pasajeros'),
('Seguridad', 'Control y revisión'),
('Equipaje', 'Maletas y carga'),
('Operaciones', 'Coordinación de vuelos'),
('Mantenimiento', 'Soporte técnico');

-- Aeronaves (5 por aerolínea)
INSERT INTO Aeronave (matricula, modelo, capacidad, idAerolinea) VALUES
('OB-2001', 'Airbus A320', 180, 1),
('OB-2002', 'Airbus A319', 144, 1),
('OB-2003', 'Boeing 737-800', 189, 1),
('OB-2004', 'Airbus A320neo', 186, 1),
('OB-2005', 'Airbus A320', 180, 2),
('OB-2006', 'Airbus A319', 144, 2),
('OB-2007', 'Boeing 737-800', 189, 2),
('OB-2008', 'Airbus A320neo', 186, 2),
('OB-2009', 'Airbus A320', 180, 3),
('OB-2010', 'Airbus A319', 144, 3);
