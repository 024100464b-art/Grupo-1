use pubs
go

---------visualizacion de los datos y sus tablas------------

-- 1. Tabla de Autores
SELECT * FROM authors;

-- 2. Tabla de Editores
SELECT * FROM publishers;

-- 3. Tabla de Títulos (Libros)
SELECT * FROM titles;

-- 4. Tabla de Relación entre Títulos y Autores
SELECT * FROM titleauthor;

-- 5. Tabla de Ventas
SELECT * FROM sales;

-- 6. Tabla de Tiendas
SELECT * FROM stores;

-- 7. Tabla de Empleados
SELECT * FROM employee;

-- 8. Tabla de Trabajos/Puestos
SELECT * FROM jobs;

-- 9. Tabla de Información adicional de los editores (incluye logos)
SELECT * FROM pub_info;

-- 10. Tabla de Esquema de Regalías
SELECT * FROM roysched;

-- 11. Tabla de Descuentos
SELECT * FROM discounts;

---------------------------------------------------------------------
--creacion de los sp 
----------------------------------------------------------------------
---sp 1 libros y editoriales
if OBJECT_ID('splibrosyeditoriales') is not null
	drop proc splibrosyeditoriales
go

create proc splibrosyeditoriales
as
begin
	select t.title as 'titulo del libro', p.pub_name as 'editorial'
	from titles t inner join publishers p
	on t.pub_id = p.pub_id;
end
go

exec splibrosyeditoriales
go


---sp 2 empleados y puestos
if OBJECT_ID('spempleadosypuestos') is not null
	drop proc spempleadosypuestos
go

create proc spempleadosypuestos
as
begin
	select e.fname + ' ' + e.lname as 'nombre del empleado', j.job_desc as 'puesto'
	from employee e inner join jobs j
	on e.job_id = j.job_id;
end
go

exec spempleadosypuestos
go


---sp 3 tiendas y ventas
if OBJECT_ID('sptiendasyventas') is not null
	drop proc sptiendasyventas
go

create proc sptiendasyventas
as
begin
	select st.stor_name as 'tienda', s.ord_num as 'numero de orden', s.qty as 'cantidad'
	from stores st inner join sales s
	on st.stor_id = s.stor_id;
end
go

exec sptiendasyventas
go


---sp 4 libros y detalle de ventas
if OBJECT_ID('splibrosydetalleventas') is not null
	drop proc splibrosydetalleventas
go

create proc splibrosydetalleventas
as
begin
	select t.title as 'titulo', s.ord_date as 'fecha de venta', s.qty as 'unidades vendidas'
	from titles t inner join sales s
	on t.title_id = s.title_id;
end
go

exec splibrosydetalleventas
go


---sp 5 autores e id de libros
if OBJECT_ID('spautoresyidlibros') is not null
	drop proc spautoresyidlibros
go

create proc spautoresyidlibros
as
begin
	select a.au_fname + ' ' + a.au_lname as 'autor', ta.title_id as 'id del libro'
	from authors a inner join titleauthor ta
	on a.au_id = ta.au_id;
end
go

exec spautoresyidlibros
go


---sp 6 editoriales y detalles
if OBJECT_ID('speditorialesydetalles') is not null
	drop proc speditorialesydetalles
go

create proc speditorialesydetalles
as
begin
	select p.pub_name as 'editorial', pi.pr_info as 'informacion publica'
	from publishers p inner join pub_info pi
	on p.pub_id = pi.pub_id;
end
go

exec speditorialesydetalles
go


---sp 7 empleados y editoriales
if OBJECT_ID('spempleadosyeditoriales') is not null
	drop proc spempleadosyeditoriales
go

create proc spempleadosyeditoriales
as
begin
	select e.fname + ' ' + e.lname as 'empleado', p.pub_name as 'trabaja en editorial'
	from employee e inner join publishers p
	on e.pub_id = p.pub_id;
end
go

exec spempleadosyeditoriales
go


---sp 8 autores por titulo
if OBJECT_ID('spautoresportitulo') is not null
	drop proc spautoresportitulo
go

create proc spautoresportitulo
as
begin
	select a.au_fname + ' ' + a.au_lname as 'autor', t.title as 'libro publicado'
	from authors a inner join titleauthor ta
	on a.au_id = ta.au_id inner join titles t
	on ta.title_id = t.title_id;
end
go

exec spautoresportitulo
go


---sp 9 libros sin ventas
if OBJECT_ID('splibrossinventas') is not null
	drop proc splibrossinventas
go

create proc splibrossinventas
as
begin
	select t.title as 'libros sin ventas', s.ord_num
	from titles t left join sales s
	on t.title_id = s.title_id
	where s.ord_num is null;
end
go

exec splibrossinventas
go


---sp 10 puestos sin empleados
if OBJECT_ID('sppuestossinempleados') is not null
	drop proc sppuestossinempleados
go

create proc sppuestossinempleados
as
begin
	select e.emp_id as 'id de empleado faltante', j.job_desc as 'puestos sin empleados'
	from employee e right join jobs j
	on e.job_id = j.job_id
	where e.emp_id is null;
end
go

exec sppuestossinempleados
go