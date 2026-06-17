USE PubsAbejitas;
GO

CREATE TRIGGER tr_Titles_ValidarPrecio
ON titles
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted WHERE price <= 0)
    BEGIN
        RAISERROR('Error: El precio del libro debe ser mayor a cero.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

CREATE TRIGGER tr_Sales_ActualizarYtdSales
ON sales
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE t
    SET t.ytd_sales = COALESCE(t.ytd_sales, 0) + i.qty
    FROM titles t
    INNER JOIN inserted i ON t.title_id = i.title_id;
END;
GO




CREATE TRIGGER tr_Sales_RestarYtdSales
ON sales
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE t
    SET t.ytd_sales = COALESCE(t.ytd_sales, 0) - d.qty
    FROM titles t
    INNER JOIN deleted d ON t.title_id = d.title_id;
END;
GO



CREATE TRIGGER tr_Employee_VerificarNivel
ON employee
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (
        SELECT 1 
        FROM inserted i 
        JOIN deleted d ON i.emp_id = d.emp_id 
        WHERE i.job_lvl < d.job_lvl
    )
    BEGIN
        RAISERROR('Error: No se permite degradar el nivel de trabajo de un empleado.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO


CREATE TRIGGER tr_Publishers_PrevenirBorrado
ON publishers
INSTEAD OF DELETE
AS
BEGIN
    RAISERROR('Operación denegada: Las editoriales no pueden ser eliminadas de la base de datos por políticas de auditoría.', 16, 1);
END;
GO

USE PubsAbejitas;
GO

-- Ver todos los libros (títulos) registrados
SELECT title_id, title, type, price, ytd_sales 
FROM titles;

-- Ver la lista de autores
SELECT au_id, au_lname, au_fname, phone, city 
FROM authors;

-- Ver las editoriales (publishers)
SELECT pub_id, pub_name, city, country 
FROM publishers;

-- Ver los empleados y sus niveles de trabajo
SELECT emp_id, fname, lname, job_id, job_lvl 
FROM employee;

-- Ver las órdenes de venta escritas
SELECT stor_id, ord_num, ord_date, qty, title_id 
FROM sales;
SELECT 
    t.title_id, 
    t.title AS [Título del Libro], 
    t.price AS [Precio], 
    p.pub_name AS [Editorial]
FROM titles t
INNER JOIN publishers p ON t.pub_id = p.pub_id;
SELECT 
    CONCAT(a.au_fname, ' ', a.au_lname) AS [Autor],
    t.title AS [Título del Libro],
    t.type AS [Categoría]
FROM authors a
INNER JOIN titleauthor ta ON a.au_id = ta.au_id
INNER JOIN titles t ON ta.title_id = t.title_id;
SELECT 
    st.stor_name AS [Tienda],
    s.ord_num AS [Nro. Orden],
    s.ord_date AS [Fecha Venta],
    t.title AS [Libro Vendido],
    s.qty AS [Cantidad Vencida]
FROM sales s
INNER JOIN stores st ON s.stor_id = st.stor_id
INNER JOIN titles t ON s.title_id = t.title_id;
SELECT 
    type AS [Categoría],
    COUNT(*) AS [Total Libros],
    SUM(ytd_sales) AS [Unidades Vendidas],
    SUM(price * ytd_sales) AS [Ingresos Totales ($)]
FROM titles
WHERE price IS NOT NULL AND ytd_sales IS NOT NULL
GROUP BY type
ORDER BY [Ingresos Totales ($)] DESC;
SELECT 
    YEAR(hire_date) AS [Año de Contratación],
    COUNT(*) AS [Cantidad de Empleados]
FROM employee
GROUP BY YEAR(hire_date)
ORDER BY [Año de Contratación] ASC;



USE PubsAbejitas;
GO

-- Ver todos los libros (títulos) registrados
SELECT title_id, title, type, price, ytd_sales 
FROM titles;

-- Ver la lista de autores
SELECT au_id, au_lname, au_fname, phone, city 
FROM authors;

-- Ver las editoriales (publishers)
SELECT pub_id, pub_name, city, country 
FROM publishers;

-- Ver los empleados y sus niveles de trabajo
SELECT emp_id, fname, lname, job_id, job_lvl 
FROM employee;

-- Ver las órdenes de venta escritas
SELECT stor_id, ord_num, ord_date, qty, title_id 
FROM sales;
