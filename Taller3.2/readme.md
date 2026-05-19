# Taller 3.2: Consolidación Multibase de Datos (Northwind & Pubs)

Este repositorio contiene la entrega integrada del **Taller 3.2**, donde se extienden y aplican las operaciones unarias y binarias del álgebra relacional utilizando **ADO.NET Entity Framework** y **LINQ** en arquitecturas multi-contexto de bases de datos.

---

## 📂 Recursos de Entrega

El taller está compuesto por los siguientes archivos esenciales:
* **`Taller3.2.cs`**: Implementación robusta en C# que unifica las 18 consultas requeridas sobre las estructuras de datos de `Northwind` y `Pubs`.
* **`infografia3.2.html`**: Dashboard interactivo que muestra las equivalencias teóricas entre notación formal y código.
* **`instnwnd.sql`**: Script de creación para el entorno Northwind.
* **`instpubs.sql`**: Script de creación para el entorno Pubs.
* **`taller3.2ejecutable.zip.zip`**: Ejecutable compilado para despliegue directo.

---

## 🛠️ Requisitos de Configuración Local

### 1. Preparar las Bases de Datos
1. Ejecuta el archivo `instnwnd.sql` en tu instancia local de SQL Server para dar de alta `Northwind`.
2. Ejecuta el archivo `instpubs.sql` para restaurar y configurar la base de datos de publicaciones `PubsAbejitas`.

### 2. Configurar el Mapeo de Entity Framework
* Al abrir la solución de Visual Studio, asegúrate de configurar los archivos de mapeo `.edmx` para apuntar a tus servidores locales de SQL Server.
* Comprueba que las cadenas de conexión del archivo `App.config` estén apuntando correctamente a tus instancias locales.

---

## ⚙️ Compilación y Extracción del Ejecutable (.exe)
Para asegurar el funcionamiento libre de errores en otros equipos:
1. Cambia el perfil de compilación de Visual Studio de **Debug** a **Release**.
2. Presiona `Ctrl + Shift + B` para iniciar la compilación limpia de la solución.
3. El archivo `Taller3.2.exe` se generará en la ruta `bin/Release/` acompañado de sus archivos de configuración cruciales (`EntityFramework.dll`, `EntityFramework.SqlServer.dll` y `TuProyecto.exe.config`).
