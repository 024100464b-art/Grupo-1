# ✈️ AeroQuery Cusco - Propuesta de Sistema Aeroportuario

enlace del informe: https://docs.google.com/document/d/1m4hF-El2VvDXaAiTE2C1vUS3zjjb1C3AYRzupd6OAUE/edit?tab=t.0

**AeroQuery Cusco** es una propuesta de diseño arquitectónico y modelado de datos para la gestión operativa en terminales aéreos. El proyecto plantea resolver la complejidad de manejar simultáneamente el flujo de pasajeros, asignación de aeronaves, venta de boletos y logística de equipaje mediante una base de datos relacional altamente normalizada.
🌐 **Ver Presentación del Proyecto (GitHub Pages):** Reemplaza-esto-con-tu-link-de-github-pages.com
## 📂 Contenido del Repositorio
Este repositorio contiene los documentos base y scripts de la propuesta del proyecto:
 * 📄 informe sqlaeropuerto borrador.pdf: Documento principal de la propuesta técnica. Detalla el planteamiento del problema, la justificación de las 13 tablas, el stack tecnológico propuesto (WinForms, EF Core) y la lógica de las consultas.
 * 🗄️ Script_BaseDatos_Cusco.sql: Script T-SQL completo para la creación de la base de datos BDAeropuertoCusco, la estructuración de las 13 tablas con sus llaves primarias/foráneas y la inserción de datos de prueba (incluyendo la simulación de 10,000 pasajeros y 900 vuelos).
 * 🌐 index.html: Código fuente de la landing page (desplegada en GitHub Pages) que resume la propuesta de manera visual utilizando Tailwind CSS.
 * 📦 AeroQuery.zip: Archivo empaquetado descargable que contiene todos los recursos del proyecto listos para su distribución.
## 🏗️ Arquitectura de la Base de Datos
El núcleo del proyecto es una base de datos en **SQL Server** dividida en 4 áreas operativas principales:
 1. **Infraestructura:** Aeropuerto, Aerolínea, Aeronave, Puerta Embarque.
 2. **Operaciones Aéreas:** Vuelo.
 3. **Gestión Comercial:** Pasajero, Boleto, Asiento, Equipaje.
 4. **Recursos Humanos:** Cargo, Área, Empleado, Vuelo Empleado.
## 💡 Niveles de Consultas Propuestas
El sistema está diseñado para soportar la extracción de métricas mediante LINQ to Entities / SQL, divididas en 3 niveles de complejidad:
 * **Nivel 1 (Básicas):** Listados generales y búsquedas simples (ej. Buscar pasajero por DNI).
 * **Nivel 2 (Intermedias):** Cruces de información mediante *JOINs* (ej. Vuelos con sus respectivas Aerolíneas y Aeronaves).
 * **Nivel 3 (Avanzadas):** Extracción de métricas clave cruzando de 3 a 5 tablas, uso de agrupaciones (GroupBy) y funciones de agregación (Sum, Count) (ej. Ranking de rutas más demandadas, Recaudación por aerolínea, Dashboard de ocupación en tiempo real).
## ⚙️ Instrucciones de Uso (Para Desarrolladores)
Si deseas probar la estructura de la base de datos propuesta:
 1. Clona este repositorio o descarga el archivo AeroQuery.zip.
 2. Abre **SQL Server Management Studio (SSMS)**.
 3. Carga el archivo Script_BaseDatos_Cusco.sql.
 4. Ejecuta el script de una sola vez. Esto creará la base de datos BDAeropuertoCusco, generará las 13 tablas e insertará los datos de prueba de forma automática.
 5. Revisa el archivo informe sqlaeropuerto borrador.pdf para entender el diseño del ORM (Entity Framework Core) y cómo se planea conectar esta base de datos con C#.
*Desarrollado como propuesta de arquitectura y modelado de datos para sistemas complejos.*
