# 🗄️ Mis Proyectos de Bases de Datos

Este repositorio contiene el modelado, diseño e implementación de bases de datos relacionales para diferentes escenarios comerciales.

---

## 1. Sistema de Inventario "ABC" (Electrodomésticos)
**Tecnología:** `Microsoft SQL Server (T-SQL)`

Diseño de una base de datos transaccional para el control de entradas (compras a proveedores) y salidas (ventas a clientes) de electrodomésticos.

```sql
USE master
GO

IF DB_ID('DBElectrodomesticosABC') IS NOT NULL
    DROP DATABASE DBElectrodomesticosABC
GO

CREATE DATABASE DBElectrodomesticosABC
GO

USE DBElectrodomesticosABC
GO

IF OBJECT_ID('Cliente') IS NOT NULL
    DROP TABLE Cliente
GO

CREATE TABLE Cliente
(
    idCliente INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(150),
    email VARCHAR(100)
)
GO

IF OBJECT_ID('Proveedor') IS NOT NULL
    DROP TABLE Proveedor
GO

CREATE TABLE Proveedor
(
    idProveedor INT PRIMARY KEY IDENTITY(1,1),
    nombreProveedor VARCHAR(120) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(150),
    email VARCHAR(100)
)
GO

IF OBJECT_ID('Electrodomesticos') IS NOT NULL
    DROP TABLE Electrodomesticos
GO

CREATE TABLE Electrodomesticos
(
    idElectrodomestico INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(200),
    marca VARCHAR(100),
    precioCompra DECIMAL(10,2) NOT NULL,
    precioVenta DECIMAL(10,2) NOT NULL
)
GO

IF OBJECT_ID('OrdenCompra') IS NOT NULL
    DROP TABLE OrdenCompra
GO

CREATE TABLE OrdenCompra
(
    idOrdenCompra INT PRIMARY KEY IDENTITY(1,1),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    montoTotal DECIMAL(12,2) NOT NULL,
    idProveedor INT NOT NULL,

    CONSTRAINT FK_OrdenCompra_Proveedor
    FOREIGN KEY (idProveedor)
    REFERENCES Proveedor(idProveedor)
)
GO

IF OBJECT_ID('Comprobante') IS NOT NULL
    DROP TABLE Comprobante
GO

CREATE TABLE Comprobante
(
    idComprobante INT PRIMARY KEY IDENTITY(1,1),
    fecha DATE NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    idCliente INT NOT NULL,
    email VARCHAR(100),

    CONSTRAINT FK_Comprobante_Cliente
    FOREIGN KEY (idCliente)
    REFERENCES Cliente(idCliente)
)
GO

IF OBJECT_ID('DetalleEntradaSalida') IS NOT NULL
    DROP TABLE DetalleEntradaSalida
GO

CREATE TABLE DetalleEntradaSalida
(
    idDetalle INT PRIMARY KEY IDENTITY(1,1),
    cantidad INT NULL, 
    subtotal DECIMAL(12,2) NOT NULL,
    idElectrodomestico INT NOT NULL,
    idOrdenCompra INT NULL,
    idComprobante INT NULL,

    CONSTRAINT FK_Detalle_Electrodomestico
    FOREIGN KEY (idElectrodomestico)
    REFERENCES Electrodomesticos(idElectrodomestico),

    CONSTRAINT FK_Detalle_OrdenCompra
    FOREIGN KEY (idOrdenCompra)
    REFERENCES OrdenCompra(idOrdenCompra),

    CONSTRAINT FK_Detalle_Comprobante
    FOREIGN KEY (idComprobante)
    REFERENCES Comprobante(idComprobante)
)
GO
