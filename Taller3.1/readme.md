# 📊 Taller 3.1: Álgebra Relacional con LINQ y Entity Framework

Este repositorio contiene la solución completa, optimizada y documentada para el **Taller 3.1**.  
En este proyecto se implementan y demuestran de forma práctica las operaciones fundamentales del álgebra relacional utilizando el paradigma de programación declarativo **LINQ** y el ORM **Entity Framework 6** sobre la base de datos clásica **Microsoft Pubs** (adaptada localmente bajo el nombre de `PubsAbejitas`).

---

# 📂 Estructura de los Entregables

La solución se compone de los siguientes archivos esenciales organizados para su evaluación:

| Nombre del Entregable | Extensión / Tipo | Descripción Técnica |
|---|---|---|
| `PubsAbejitas.sql` | 🗄️ Script SQL Server | Código DDL/DML que crea la base de datos, define llaves primarias/foráneas y carga los datos de prueba. |
| `Taller3.1.cs` | 💻 Archivo de Código C# | Contiene el código fuente de `Form1.cs` con los 18 métodos interactivos de Windows Forms correspondientes al taller. |
| `Taller3.1VS.zip` | 📦 Archivo Comprimido | Proyecto de Visual Studio depurado y limpio (sin carpetas residuales pesadas como `/bin` u `/obj`). |
| `index.html` | 🌐 Dashboard Web | Interfaz de control web interactiva para visualizar las equivalencias algebraicas y descargar los recursos con un clic. |

---

# 🛠️ Instrucciones de Configuración y Despliegue

Sigue estos pasos ordenados para montar el entorno local y ejecutar el software sin inconvenientes:

---

## 1️⃣ Preparar la Base de Datos en SQL Server

1. Abre **SQL Server Management Studio (SSMS)** y conéctate a tu instancia local de base de datos.

2. Abre el archivo `PubsAbejitas.sql` en una nueva consulta.

3. Ejecuta el script (`F5`) para crear la base de datos `PubsAbejitas` y poblar automáticamente sus tablas de catálogo:

```sql
jobs, employees, titles, stores, sales, discounts, authors y titleauthors
