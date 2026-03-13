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

```

2. Plataforma de Comercio Electrónico
Tecnología: PostgreSQL

Estructura relacional optimizada para una tienda en línea. Gestiona el catálogo de productos, cuentas de clientes, múltiples direcciones de envío, historial de pedidos y sistema de reseñas.
```postgresql
-- 1. Tablas Independientes
CREATE TABLE TCategoria (
    IdCategoria CHAR(5) PRIMARY KEY,
    nombreCat VARCHAR(50) UNIQUE NOT NULL,
    descripcionCat TEXT
);

CREATE TABLE TMarca (
    IdMarca CHAR(5) PRIMARY KEY,
    nombreM VARCHAR(50) NOT NULL,
    paisOrigenM VARCHAR(50) NOT NULL
);

CREATE TABLE TCliente (
    IdCliente CHAR(5) PRIMARY KEY,
    nombreCompletoC VARCHAR(100) NOT NULL,
    correoC VARCHAR(100) UNIQUE NOT NULL,
    contrasenaC VARCHAR(255) NOT NULL
);

-- 2. Tabla Producto (Depende de Categoría y Marca)
CREATE TABLE TProducto (
    IdProducto CHAR(5) PRIMARY KEY,
    nombreP VARCHAR(100) NOT NULL,
    descripcionP TEXT,
    precioP DECIMAL(10,2) NOT NULL,
    stockP INT NOT NULL,
    idCat CHAR(5) NOT NULL,
    idM CHAR(5) NOT NULL,
    FOREIGN KEY(idCat) REFERENCES TCategoria(IdCategoria),
    FOREIGN KEY(idM) REFERENCES TMarca(IdMarca)
);

-- 3. Tabla Dirección (Depende del Cliente)
CREATE TABLE TDireccion (
    IdDireccion CHAR(5) PRIMARY KEY,
    calleD VARCHAR(100) NOT NULL,
    ciudadD VARCHAR(50) NOT NULL,
    codigoPostalD VARCHAR(20),
    paisD VARCHAR(50) NOT NULL,
    idC CHAR(5) NOT NULL,
    FOREIGN KEY(idC) REFERENCES TCliente(IdCliente)
);

-- 4. Tabla Pedido (Depende del Cliente)
CREATE TABLE TPedido (
    IdPedido CHAR(5) PRIMARY KEY,
    fechaPe DATE NOT NULL,
    estadoPe VARCHAR(20) NOT NULL,
    idC CHAR(5) NOT NULL,
    FOREIGN KEY(idC) REFERENCES TCliente(IdCliente)
);

-- 5. Tabla DetallePedido (Depende de Pedido y Producto)
CREATE TABLE TDetallePedido (
    IdDetalle CHAR(5) PRIMARY KEY,
    cantidadDP INT NOT NULL,
    idPe CHAR(5) NOT NULL,
    idP CHAR(5) NOT NULL,
    FOREIGN KEY(idPe) REFERENCES TPedido(IdPedido),
    FOREIGN KEY(idP) REFERENCES TProducto(IdProducto)
);

-- 6. Tabla Opinión (Depende de Cliente y Producto)
CREATE TABLE TOpinion (
    IdOpinion CHAR(5) PRIMARY KEY,
    calificacionO INT NOT NULL CHECK (calificacionO >= 1 AND calificacionO <= 5),
    comentarioO TEXT,
    fechaO DATE NOT NULL,
    idC CHAR(5) NOT NULL,
    idP CHAR(5) NOT NULL,
    FOREIGN KEY(idC) REFERENCES TCliente(IdCliente),
    FOREIGN KEY(idP) REFERENCES TProducto(IdProducto)
);
