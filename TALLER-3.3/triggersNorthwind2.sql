use Northwind
go

-- PRUEBA 1: Probar Auditoría de Precios
update Products 
set UnitPrice = 21.00 
where ProductID = 1
go

select * from AuditoriaPreciosProductos
go

-- PRUEBA 2: Probar Validación de Stock (Fallo controlado con TRY/CATCH)
begin try
	insert into [Order Details] (OrderID, ProductID, UnitPrice, Quantity, Discount)
	values (10248, 1, 14.00, 5000, 0)
end try
begin catch
	select 
		error_message() as [Mensaje de Error Esperado (Prueba 2)],
		'El trigger funcionó y la transacción fue revertida' as [Estado]
end catch
go


-- PRUEBA 3: Probar Eliminación de Clientes (Archivado sin romper FK)
insert into Customers (CustomerID, CompanyName, ContactName)
values ('ABCDE', 'Empresa de Prueba', 'Juan Perez')
go

delete from Customers 
where CustomerID = 'ABCDE'
go

select * from ClientesEliminados
go


-- PRUEBA 4: Probar Log de Empleados (Máximo 10 caracteres en FirstName)
update Employees 
set FirstName = 'Nancy M' 
where EmployeeID = 1
go
select * from LogActualizacionesEmpleados
go

-- PRUEBA 5: Probar Fechas de Envío (Fallo controlado con TRY/CATCH)
begin try
	insert into Orders (CustomerID, EmployeeID, OrderDate, ShippedDate)
	values ('VINET', 5, '1996-07-04', '1990-01-01')
end try
begin catch
	select 
		error_message() as [Mensaje de Error Esperado (Prueba 5)],
		'El trigger funcionó bloqueando la fecha coherente' as [Resultado]
end catch
go