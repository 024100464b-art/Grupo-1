
northwind:
use Northwind
go

-- Consulta1: Productos por categoría filtrado por ID
if object_id('spProductosPorCategoria') is not null
	drop proc spProductosPorCategoria
go
create proc spProductosPorCategoria
@CategoryID int
as
begin
	select C.CategoryID, C.CategoryName, P.ProductID, P.ProductName, P.UnitPrice
	from Categories C inner join Products P
	on C.CategoryID = P.CategoryID
	where C.CategoryID = @CategoryID
end
go
exec spProductosPorCategoria 1
go


-- Consulta2: Territorios asignados a un empleado específico
if object_id('spTerritoriosPorEmpleado') is not null
	drop proc spTerritoriosPorEmpleado
go
create proc spTerritoriosPorEmpleado
@EmployeeID int
as
begin
	select E.EmployeeID, E.FirstName + ' ' + E.LastName as Empleado, T.TerritoryDescription
	from Employees E inner join EmployeeTerritories ET
	on E.EmployeeID = ET.EmployeeID inner join Territories T
	on ET.TerritoryID = T.TerritoryID
	where E.EmployeeID = @EmployeeID
end
go
exec spTerritoriosPorEmpleado 2
go


-- Consulta3: Productos de un proveedor específico
if object_id('spProductosPorProveedor') is not null
	drop proc spProductosPorProveedor
go
create proc spProductosPorProveedor
@SupplierID int
as
begin
	select S.SupplierID, S.CompanyName, P.ProductID, P.ProductName
	from Suppliers S inner join Products P
	on S.SupplierID = P.SupplierID
	where S.SupplierID = @SupplierID
end
go
exec spProductosPorProveedor 5
go


-- Consulta4: Detalle de facturación filtrado por Orden
if object_id('spDetallePorOrden') is not null
	drop proc spDetallePorOrden
go
create proc spDetallePorOrden
@OrderID int
as
begin
	select O.OrderID, C.CompanyName, P.ProductName, OD.UnitPrice, OD.Quantity, (OD.UnitPrice * OD.Quantity) as SubTotal
	from Orders O inner join Customers C
	on O.CustomerID = C.CustomerID inner join [Order Details] OD
	on O.OrderID = OD.OrderID inner join Products P
	on OD.ProductID = P.ProductID
	where O.OrderID = @OrderID
end
go
exec spDetallePorOrden 10248
go


-- Consulta5: Stock de productos de un proveedor (Gestión de Inventario)
if object_id('spStockPorProveedor') is not null
	drop proc spStockPorProveedor
go
create proc spStockPorProveedor
@SupplierID int
as
begin
	select S.CompanyName, P.ProductName, P.UnitsInStock
	from Products P inner join Suppliers S
	on P.SupplierID = S.SupplierID
	where S.SupplierID = @SupplierID
	order by P.UnitsInStock asc
end
go
exec spStockPorProveedor 1
go


-- Consulta6: Órdenes enviadas por un transportista específico
if object_id('spOrdenesPorTransportista') is not null
	drop proc spOrdenesPorTransportista
go
create proc spOrdenesPorTransportista
@ShipperID int
as
begin
	select S.CompanyName as Transportista, O.OrderID, O.OrderDate, O.ShipCity
	from Orders O inner join Shippers S
	on O.ShipVia = S.ShipperID
	where S.ShipperID = @ShipperID
end
go
exec spOrdenesPorTransportista 3
go


-- Consulta7: Historial de compras de un Cliente
if object_id('spHistorialCliente') is not null
	drop proc spHistorialCliente
go
create proc spHistorialCliente
@CustomerID nchar(5)
as
begin
	select C.CustomerID, C.CompanyName, O.OrderID, O.OrderDate
	from Customers C inner join Orders O
	on C.CustomerID = O.CustomerID
	where C.CustomerID = @CustomerID
	order by O.OrderDate desc
end
go
exec spHistorialCliente 'ALFKI'
go


-- Consulta8: Detalle de ventas de un Producto específico
if object_id('spVentasPorProducto') is not null
	drop proc spVentasPorProducto
go
create proc spVentasPorProducto
@ProductID int
as
begin
	select P.ProductName, OD.OrderID, OD.Quantity, O.OrderDate
	from Products P inner join [Order Details] OD
	on P.ProductID = OD.ProductID inner join Orders O
	on OD.OrderID = O.OrderID
	where P.ProductID = @ProductID
end
go
exec spVentasPorProducto 11
go
