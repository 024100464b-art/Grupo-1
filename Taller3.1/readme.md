
Taller 3.1: Álgebra Relacional con LINQ y Entity Framework

Este repositorio contiene la solución completa y optimizada para el Taller 3.1, donde se implementan las operaciones fundamentales del álgebra relacional (tanto unarias como binarias) utilizando C#, LINQ y Entity Framework 6 sobre la base de datos clásica Microsoft Pubs (adaptada localmente como PubsAbejitas).

📂 Estructura de Entregables

El proyecto consta de los siguientes archivos clave para su evaluación:

PubsAbejitas.sql: Script de SQL Server que crea la base de datos, define las llaves primarias, foráneas y carga los datos de prueba necesarios para las consultas relacionales.

Taller3.1.cs: Archivo de código fuente principal (Form1.cs) que contiene los 18 métodos interactivos de Windows Forms mapeados a las operaciones algebraicas.

Taller3.1VS.zip: Solución empaquetada y limpia de Visual Studio lista para ser importada. Se han eliminado carpetas temporales pesadas (bin, obj, .vs) para un peso ligero y libre de conflictos.

index.html: Tablero de control web interactivo que permite previsualizar y descargar cómodamente el código fuente y el script de la base de datos.

🛠️ Instrucciones de Configuración y Despliegue

1. Preparar la Base de Datos (SQL Server)

Abre SQL Server Management Studio (SSMS).

Abre y ejecuta el archivo PubsAbejitas.sql para crear la base de datos local y poblar las tablas (jobs, employees, titles, stores, sales, discounts, authors, titleauthors).

2. Configurar la Solución en Visual Studio

Descomprime el archivo Taller3.1VS.zip.

Haz doble clic en el archivo de solución .sln para abrir el proyecto en Visual Studio (2019 o superior).

Asegúrate de verificar la cadena de conexión en el archivo App.config. Si tu instancia de SQL Server tiene un nombre personalizado (ej. LOCALHOST\SQLEXPRESS), edita el atributo connectionString para que coincida con tu servidor local.

3. Compilación y Ejecución

Presiona F5 o haz clic en Iniciar en Visual Studio.

Interactúa con la interfaz gráfica de Windows Forms, donde cada botón ejecuta una operación unaria o binaria del álgebra relacional.

📊 Operaciones Implementadas (18 Consultas)

Operaciones Unarias (3 ejercicios por operación)

Selección ($\sigma$): Filtrado selectivo de filas mediante predicados específicos sobre jobs, employees y titles.

Proyección ($\pi$): Extracción de subconjuntos de atributos específicos (columnas) eliminando duplicados mediante .Distinct().

Renombramiento ($\rho$): Proyección con cambio de alias a español para adecuar los datos a las necesidades de la interfaz.

Operaciones Binarias (3 ejercicios por operación)

Unión ($\cup$): Combinación de conjuntos compatibles (mismo tipo anónimo) evaluados de forma segura en memoria mediante el uso de .ToList().Union().

Diferencia ($-$): Exclusión de conjuntos compatibles utilizando .ToList().Except().

Producto Cartesiano ($\times$): Cruces de tablas completos (Cross Joins) a través de cláusulas from múltiples sin condiciones de clave asociativa.
