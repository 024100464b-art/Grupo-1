use Northwind
go

-- 1. AUDITORÍA DE CAMBIOS EN PRECIOS (TABLA: Products)
if object_id('AuditoriaPreciosProductos', 'U') is null
begin
	create table AuditoriaPreciosProductos (
		IdAuditoria int identity(1,1) primary key,
		IdProducto int,
		PrecioAnterior money,
		PrecioNuevo money,
		FechaCambio datetime,
		Usuario varchar(100)
	)
end
go

drop trigger if exists TR_Auditoria_Cambio_Precio
go

create trigger TR_Auditoria_Cambio_Precio
on Products
after update
as
begin
	if update(UnitPrice)
	begin
		insert into AuditoriaPreciosProductos (IdProducto, PrecioAnterior, PrecioNuevo, FechaCambio, Usuario)
		select d.ProductID, d.UnitPrice, i.UnitPrice, getdate(), system_user
		from inserted i
		join deleted d on i.ProductID = d.ProductID
		where i.UnitPrice <> d.UnitPrice
	end
end
go

-- 2. VALIDACIÓN DE STOCK MÍNIMO (TABLA: [Order Details])
drop trigger if exists TR_Validar_Stock
go

create trigger TR_Validar_Stock
on [Order Details]
after insert
as
begin
	if exists (
		select 1 
		from inserted i
		join Products p on i.ProductID = p.ProductID
		where p.UnitsInStock < i.Quantity
	)
	begin
		raiserror ('Error: Stock insuficiente para realizar el pedido.', 16, 1)
		rollback transaction
	end
end
go

-- 3. REGISTRO DE ELIMINACIÓN DE CLIENTES (TABLA: Customers)
if object_id('ClientesEliminados', 'U') is null
begin
	create table ClientesEliminados (
		IdCliente nchar(5),
		NombreCompania nvarchar(40),
		NombreContacto nvarchar(30),
		FechaElimonacion datetime
	)
end
go

drop trigger if exists TR_Archivar_Cliente_Eliminado
go

create trigger TR_Archivar_Cliente_Eliminado
on Customers
instead of delete
as
begin
	insert into ClientesEliminados (IdCliente, NombreCompania, NombreContacto, FechaElimonacion)
	select CustomerID, CompanyName, ContactName, getdate()
	from deleted
    
	delete from Customers 
	where CustomerID in (select CustomerID from deleted)
end
go
-- 4. LOG DE ACTUALIZACIONES DE EMPLEADOS (TABLA: Employees)
if object_id('LogActualizacionesEmpleados', 'U') is null
begin
	create table LogActualizacionesEmpleados (
		IdLog int identity(1,1) primary key,
		IdEmpleado int,
		Apellido nvarchar(20),
		Nombre nvarchar(10),
		FechaLog datetime,
		Usuario varchar(100)
	)
end
go

drop trigger if exists TR_Log_Actualizacion_Empleado
go

create trigger TR_Log_Actualizacion_Empleado
on Employees
after update
as
begin
	insert into LogActualizacionesEmpleados (IdEmpleado, Apellido, Nombre, FechaLog, Usuario)
	select i.EmployeeID, i.LastName, i.FirstName, getdate(), system_user
	from inserted i
end
go

-- 5. CONTROL DE INTEGRIDAD EN FECHAS DE ENVÍO (TABLA: Orders)
drop trigger if exists TR_Validar_Fecha_Envio
go

create trigger TR_Validar_Fecha_Envio
on Orders
after insert, update
as
begin
	if exists (
		select 1 
		from inserted 
		where ShippedDate < OrderDate
	)
	begin
		raiserror ('La fecha de envío no puede ser anterior a la fecha del pedido.', 16, 1)
		rollback transaction
	end
end
go

print '¡Todos los triggers se han instalado y están listos para usarse!'
go

