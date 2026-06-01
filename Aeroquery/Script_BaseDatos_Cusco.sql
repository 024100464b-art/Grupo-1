-- =====================================================
-- SCRIPT DE CREACIÓN: BDAeropuertoCusco
-- =====================================================

USE master;
GO

IF DB_ID('BDAeropuertoCusco') IS NOT NULL
BEGIN
    ALTER DATABASE BDAeropuertoCusco SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE BDAeropuertoCusco;
END;
GO

CREATE DATABASE BDAeropuertoCusco;
GO

USE BDAeropuertoCusco;
GO

CREATE TABLE Aeropuerto (
    idAeropuerto INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    ciudad VARCHAR(80) NOT NULL,
    pais VARCHAR(80) NOT NULL,
    codigoIATA CHAR(3) NOT NULL UNIQUE
);

CREATE TABLE Aerolinea (
    idAerolinea INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    paisOrigen VARCHAR(80),
    telefono VARCHAR(20)
);

CREATE TABLE Aeronave (
    idAeronave INT IDENTITY(1,1) PRIMARY KEY,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    modelo VARCHAR(80) NOT NULL,
    capacidad INT NOT NULL,
    idAerolinea INT NOT NULL,
    FOREIGN KEY (idAerolinea) REFERENCES Aerolinea(idAerolinea)
);

CREATE TABLE PuertaEmbarque (
    idPuerta INT IDENTITY(1,1) PRIMARY KEY,
    codigoPuerta VARCHAR(10) NOT NULL UNIQUE,
    zona VARCHAR(50),
    estado VARCHAR(30) DEFAULT 'Disponible'
);

CREATE TABLE Vuelo (
    idVuelo INT IDENTITY(1,1) PRIMARY KEY,
    codigoVuelo VARCHAR(20) NOT NULL UNIQUE,
    fechaSalida DATETIME NOT NULL,
    fechaLlegada DATETIME NOT NULL,
    estado VARCHAR(30) DEFAULT 'Programado',
    idAerolinea INT NOT NULL,
    idAeronave INT NOT NULL,
    idAeropuertoOrigen INT NOT NULL,
    idAeropuertoDestino INT NOT NULL,
    idPuerta INT,
    FOREIGN KEY (idAerolinea) REFERENCES Aerolinea(idAerolinea),
    FOREIGN KEY (idAeronave) REFERENCES Aeronave(idAeronave),
    FOREIGN KEY (idAeropuertoOrigen) REFERENCES Aeropuerto(idAeropuerto),
    FOREIGN KEY (idAeropuertoDestino) REFERENCES Aeropuerto(idAeropuerto),
    FOREIGN KEY (idPuerta) REFERENCES PuertaEmbarque(idPuerta)
);

CREATE TABLE Pasajero (
    idPasajero INT IDENTITY(1,1) PRIMARY KEY,
    nombres VARCHAR(80) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    tipoDocumento VARCHAR(30) NOT NULL,
    nroDocumento VARCHAR(20) NOT NULL UNIQUE,
    nacionalidad VARCHAR(60),
    telefono VARCHAR(20),
    correo VARCHAR(100)
);

CREATE TABLE Asiento (
    idAsiento INT IDENTITY(1,1) PRIMARY KEY,
    numeroAsiento VARCHAR(10) NOT NULL,
    clase VARCHAR(30) DEFAULT 'Económica',
    idAeronave INT NOT NULL,
    FOREIGN KEY (idAeronave) REFERENCES Aeronave(idAeronave)
);

CREATE TABLE Boleto (
    idBoleto INT IDENTITY(1,1) PRIMARY KEY,
    codigoBoleto VARCHAR(30) NOT NULL UNIQUE,
    fechaCompra DATETIME DEFAULT GETDATE(),
    precio DECIMAL(10,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Activo',
    idPasajero INT NOT NULL,
    idVuelo INT NOT NULL,
    idAsiento INT NOT NULL,
    FOREIGN KEY (idPasajero) REFERENCES Pasajero(idPasajero),
    FOREIGN KEY (idVuelo) REFERENCES Vuelo(idVuelo),
    FOREIGN KEY (idAsiento) REFERENCES Asiento(idAsiento)
);

CREATE TABLE Equipaje (
    idEquipaje INT IDENTITY(1,1) PRIMARY KEY,
    codigoEquipaje VARCHAR(30) NOT NULL UNIQUE,
    peso DECIMAL(6,2) NOT NULL,
    estado VARCHAR(30) DEFAULT 'Registrado',
    idBoleto INT NOT NULL,
    FOREIGN KEY (idBoleto) REFERENCES Boleto(idBoleto)
);

CREATE TABLE Cargo (
    idCargo INT IDENTITY(1,1) PRIMARY KEY,
    nombreCargo VARCHAR(80) NOT NULL,
    descripcion VARCHAR(200)
);

CREATE TABLE Area (
    idArea INT IDENTITY(1,1) PRIMARY KEY,
    nombreArea VARCHAR(80) NOT NULL,
    descripcion VARCHAR(200)
);

CREATE TABLE Empleado (
    idEmpleado INT IDENTITY(1,1) PRIMARY KEY,
    nombres VARCHAR(80) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    dni CHAR(8) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    turno VARCHAR(30),
    idCargo INT NOT NULL,
    idArea INT NOT NULL,
    FOREIGN KEY (idCargo) REFERENCES Cargo(idCargo),
    FOREIGN KEY (idArea) REFERENCES Area(idArea)
);

CREATE TABLE VueloEmpleado (
    idVueloEmpleado INT IDENTITY(1,1) PRIMARY KEY,
    idVuelo INT NOT NULL,
    idEmpleado INT NOT NULL,
    funcion VARCHAR(80),
    FOREIGN KEY (idVuelo) REFERENCES Vuelo(idVuelo),
    FOREIGN KEY (idEmpleado) REFERENCES Empleado(idEmpleado)
);
GO

-- Inserciones de Catálogos (Aeropuertos, Aerolíneas, etc...)
INSERT INTO Aeropuerto (nombre, ciudad, pais, codigoIATA) VALUES
('Aeropuerto Internacional Alejandro Velasco Astete', 'Cusco', 'Perú', 'CUZ'),
('Aeropuerto Internacional Jorge Chávez', 'Lima/Callao', 'Perú', 'LIM'),
('Aeropuerto Internacional Rodríguez Ballón', 'Arequipa', 'Perú', 'AQP'),
('Aeropuerto Internacional Inca Manco Cápac', 'Juliaca', 'Perú', 'JUL'),
('Aeropuerto Internacional Padre Aldamiz', 'Puerto Maldonado', 'Perú', 'PEM'),
('Aeropuerto Internacional Coronel FAP Francisco Secada Vignetta', 'Iquitos', 'Perú', 'IQT'),
('Aeropuerto Internacional Capitán FAP Guillermo Concha Iberico', 'Piura', 'Perú', 'PIU'),
('Aeropuerto Capitán FAP Carlos Martínez de Pinillos', 'Trujillo', 'Perú', 'TRU'),
('Aeropuerto Coronel FAP Alfredo Mendívil Duarte', 'Ayacucho', 'Perú', 'AYP'),
('Aeropuerto Internacional Teniente Alejandro Velasco Astete', 'Cusco', 'Perú', 'CZZ');

INSERT INTO Aerolinea (nombre, paisOrigen, telefono) VALUES
('LATAM Airlines Perú', 'Perú', '0800-12345'),
('Sky Airline Perú', 'Perú', '0800-54321'),
('JetSMART Perú', 'Perú', '0800-77777'),
('Star Perú', 'Perú', '0800-22222'),
('ATSA Airlines', 'Perú', '0800-99999');

INSERT INTO PuertaEmbarque (codigoPuerta, zona, estado) VALUES
('P1', 'Nacional', 'Disponible'), ('P2', 'Nacional', 'Disponible'),
('P3', 'Nacional', 'Disponible'), ('P4', 'Nacional', 'Disponible'),
('P5', 'Internacional', 'Disponible'), ('P6', 'Internacional', 'Mantenimiento');

INSERT INTO Cargo (nombreCargo, descripcion) VALUES
('Agente de embarque', 'Controla el ingreso de pasajeros'),
('Personal de seguridad', 'Realiza control de seguridad'),
('Operador de equipaje', 'Gestiona traslado de equipaje'),
('Supervisor de operaciones', 'Supervisa operaciones'),
('Técnico de mantenimiento', 'Revisa equipos operativos');

INSERT INTO Area (nombreArea, descripcion) VALUES
('Embarque', 'Abordaje de pasajeros'), ('Seguridad', 'Control y revisión'),
('Equipaje', 'Maletas y carga'), ('Operaciones', 'Coordinación de vuelos'),
('Mantenimiento', 'Soporte técnico');
GO

-- Rutinas de Inserción Masiva
DECLARE @i INT = 1;
WHILE @i <= 20
BEGIN
    INSERT INTO Aeronave (matricula, modelo, capacidad, idAerolinea)
    VALUES (CONCAT('OB-', 2000 + @i), CASE WHEN @i % 4 = 0 THEN 'Airbus A320neo' WHEN @i % 4 = 1 THEN 'Airbus A320' WHEN @i % 4 = 2 THEN 'Airbus A319' ELSE 'Boeing 737-800' END, CASE WHEN @i % 4 = 0 THEN 186 WHEN @i % 4 = 1 THEN 180 WHEN @i % 4 = 2 THEN 144 ELSE 189 END, ((@i - 1) % 5) + 1);
    SET @i = @i + 1;
END;
GO

DECLARE @aeronave INT = 1;
DECLARE @fila INT;
DECLARE @letra INT;
WHILE @aeronave <= 20
BEGIN
    SET @fila = 1;
    WHILE @fila <= 30
    BEGIN
        SET @letra = 1;
        WHILE @letra <= 6
        BEGIN
            INSERT INTO Asiento (numeroAsiento, clase, idAeronave)
            VALUES (CONCAT(@fila, CHAR(64 + @letra)), CASE WHEN @fila <= 3 THEN 'Ejecutiva' ELSE 'Económica' END, @aeronave);
            SET @letra = @letra + 1;
        END;
        SET @fila = @fila + 1;
    END;
    SET @aeronave = @aeronave + 1;
END;
GO

-- Se han omitido los bloques largos de nombres para mantener la legibilidad, 
-- el script original completo genera 10,000 boletos y 900 vuelos.
