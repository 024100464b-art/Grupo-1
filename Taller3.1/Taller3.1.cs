using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WindowsFormsApp1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // Evento de carga de formulario
        }

        private void label1_Click(object sender, EventArgs e)
        {
        }

        private void label2_Click(object sender, EventArgs e)
        {
        }

        private void label4_Click(object sender, EventArgs e)
        {
        }


        // ==========================================
        // OPERACIONES UNARIAS: SELECCIÓN (σ)
        // ==========================================

        private void btnJob_Click(object sender, EventArgs e)
        {
            // 1. Consulta de Selección: Filtra puestos de trabajo donde la descripción sea "Editor"
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consulta = from J in pubsAbejitas.jobs
                               where J.job_desc == "Editor"
                               select new
                               {
                                   J.job_id,
                                   J.job_desc,
                                   J.min_lvl,
                                   J.max_lvl
                               };

                dgvPubsAbejitas.DataSource = consulta.ToList();
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            // 2. Consulta de Selección: Filtra empleados cuyo nivel de trabajo sea mayor a 100
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consulta = from E in pubsAbejitas.employees
                               where E.job_lvl > 100
                               select new
                               {
                                   E.emp_id,
                                   E.fname,
                                   E.lname,
                                   E.job_lvl
                               };
                dgvPubsAbejitas.DataSource = consulta.ToList();
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            // 3. Consulta de Selección: Filtra títulos donde el precio del libro sea mayor a 20 dólares
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consulta = from T in pubsAbejitas.titles
                               where T.price > 20
                               select new
                               {
                                   T.title_id,
                                   T.title1, // 'title1' evita conflicto de nombres en Entity Framework
                                   T.price,
                                   T.type
                               };

                dgvPubsAbejitas.DataSource = consulta.ToList();
            }
        }


        // ==========================================
        // OPERACIONES UNARIAS: PROYECCIÓN (π)
        // ==========================================

        private void btnPublisher_Click(object sender, EventArgs e)
        {
            // 1. Consulta de Proyección: Extrae columnas específicas de la tabla publishers
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consulta = from P in pubsAbejitas.publishers
                               select new
                               {
                                   P.country,
                                   P.titles,
                                   P.employees,
                               };
                dgvPubsAbejitas.DataSource = consulta.ToList();
            }
        }

        private void btnStores_Click(object sender, EventArgs e)
        {
            // 2. Consulta de Proyección: Extrae columnas específicas de la tabla stores
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consulta = from S in pubsAbejitas.stores
                               select new
                               {
                                   S.sales,
                                   S.stor_id,
                                   S.stor_address,
                                   S.stor_name,
                               };
                dgvPubsAbejitas.DataSource = consulta.ToList();
            }
        }

        private void button12_Click(object sender, EventArgs e)
        {
            // 3. Consulta de Proyección: Extrae ciudad y estado de autores eliminando duplicados
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consulta = (from A in pubsAbejitas.authors
                                select new
                                {
                                    A.city,
                                    A.state
                                }).Distinct();

                dgvPubsAbejitas.DataSource = consulta.ToList();
            }
        }


        // ==========================================
        // OPERACIONES UNARIAS: RENOMBRAMIENTO (ρ)
        // ==========================================

        private void btnTittle_Click(object sender, EventArgs e)
        {
            // 1. Consulta de Renombramiento: Cambia etiquetas de salida de títulos para mayor claridad
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consulta = from T in pubsAbejitas.titles
                               select new
                               {
                                   IdTitulo = T.title_id,
                                   NombreLibro = T.title1,
                                   Precio = T.price
                               };

                dgvPubsAbejitas.DataSource = consulta.ToList();
            }
        }

        private void btnSales_Click(object sender, EventArgs e)
        {
            // 2. Consulta de Renombramiento: Cambia etiquetas de salida de la tabla sales
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consulta = from S in pubsAbejitas.sales
                               select new
                               {
                                   Orden = S.ord_num,
                                   Tienda = S.stor_id,
                                   CantidadVendida = S.qty,
                                   FechaVenta = S.ord_date
                               };

                dgvPubsAbejitas.DataSource = consulta.ToList();
            }
        }

        private void button5_Click(object sender, EventArgs e)
        {
            // 3. Consulta de Renombramiento: Traduce campos clave de la tabla employees a español
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consulta = from E in pubsAbejitas.employees
                               select new
                               {
                                   CodigoEmpleado = E.emp_id,
                                   PrimerNombre = E.fname,
                                   ApellidoPaterno = E.lname,
                                   FechaContratacion = E.hire_date
                               };

                dgvPubsAbejitas.DataSource = consulta.ToList();
            }
        }


        // ==========================================
        // OPERACIONES BINARIAS: UNIÓN (∪)
        // ==========================================

        private void btnStoresUnion_Click(object sender, EventArgs e)
        {
            // 1. Consulta de Unión: Combina tiendas y autores mapeándolos a una estructura común en memoria
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consultaStores = (from s in pubsAbejitas.stores
                                      select new
                                      {
                                          ID = s.stor_id,
                                          Descripcion = s.stor_name,
                                          Ubicacion = s.city + ", " + s.state,
                                          TipoRegistro = "Tienda"
                                      }).ToList(); // Traemos a memoria RAM primero

                var consultaAuthors = (from a in pubsAbejitas.authors
                                       select new
                                       {
                                           ID = a.au_id,
                                           Descripcion = a.au_fname + " " + a.au_lname,
                                           Ubicacion = a.city + ", " + a.state,
                                           TipoRegistro = "Autor"
                                       }).ToList(); // Traemos a memoria RAM primero

                // Unión ejecutada sin problemas en memoria
                var resultadoUnion = consultaStores.Union(consultaAuthors);
                dgvPubsAbejitas.DataSource = resultadoUnion.ToList();
            }
        }

        private void btnAuthorsUnion_Click(object sender, EventArgs e)
        {
            // 2. Consulta de Unión: Combina autores y empleados ordenando por nombre completo
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consultaAutores = (from a in pubsAbejitas.authors
                                       select new
                                       {
                                           ID = a.au_id,
                                           NombreCompleto = a.au_fname + " " + a.au_lname,
                                           Ciudad = a.city ?? "No registrada",
                                           Rol = "Autor"
                                       }).ToList();

                var consultaEmpleados = (from emp in pubsAbejitas.employees
                                         select new
                                         {
                                             ID = emp.emp_id,
                                             NombreCompleto = emp.fname + " " + emp.lname,
                                             Ciudad = "Sede Corporativa",
                                             Rol = "Empleado"
                                         }).ToList();

                var resultadoUnion = consultaAutores.Union(consultaEmpleados);
                dgvPubsAbejitas.DataSource = resultadoUnion.OrderBy(p => p.NombreCompleto).ToList();
            }
        }

        private void btnTittlesUnion_Click(object sender, EventArgs e)
        {
            // 3. Consulta de Unión: Une libros (titles) con editoriales (publishers) bajo una vista de inventario común
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var consultaLibros = (from t in pubsAbejitas.titles
                                      select new
                                      {
                                          ID = t.title_id,
                                          Descripcion = t.title1,
                                          Ubicacion = t.type,
                                          TipoRegistro = "Libro"
                                      }).ToList();

                var consultaEditoriales = (from p in pubsAbejitas.publishers
                                           select new
                                           {
                                               ID = p.pub_id,
                                               Descripcion = p.pub_name,
                                               Ubicacion = p.city + ", " + p.state,
                                               TipoRegistro = "Editorial"
                                           }).ToList();

                var resultadoUnion = consultaLibros.Union(consultaEditoriales);
                dgvPubsAbejitas.DataSource = resultadoUnion.ToList();
            }
        }


        // ==========================================
        // OPERACIONES BINARIAS: DIFERENCIA (-)
        // ==========================================

        private void button8_Click(object sender, EventArgs e)
        {
            // 1. Consulta de Diferencia: Excluye puestos directivos (Manager) de todos los puestos
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var todosLosPuestos = (from j in pubsAbejitas.jobs
                                       select new
                                       {
                                           Puesto = j.job_desc,
                                           NivelMinimo = j.min_lvl,
                                           NivelMaximo = j.max_lvl
                                       }).ToList();

                var puestosManager = (from j in pubsAbejitas.jobs
                                      where j.job_desc.Contains("Manager")
                                      select new
                                      {
                                          Puesto = j.job_desc,
                                          NivelMinimo = j.min_lvl,
                                          NivelMaximo = j.max_lvl
                                      }).ToList();

                var resultadoDiferencia = todosLosPuestos.Except(puestosManager);
                dgvPubsAbejitas.DataSource = resultadoDiferencia.ToList();
            }
        }

        private void btnEmployeesDiferencia_Click(object sender, EventArgs e)
        {
            // 2. Consulta de Diferencia: Todos los empleados exceptuando los asignados a la editorial '9952'
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var todosLosEmpleados = (from emp in pubsAbejitas.employees
                                         select new
                                         {
                                             ID = emp.emp_id,
                                             NombreCompleto = emp.fname + " " + emp.lname,
                                             ClaveEditorial = emp.pub_id,
                                             TipoRegistro = "Personal"
                                         }).ToList();

                var empleadosExcluir = (from emp in pubsAbejitas.employees
                                        where emp.pub_id == "9952"
                                        select new
                                        {
                                            ID = emp.emp_id,
                                            NombreCompleto = emp.fname + " " + emp.lname,
                                            ClaveEditorial = emp.pub_id,
                                            TipoRegistro = "Personal"
                                        }).ToList();

                var resultadoDiferencia = todosLosEmpleados.Except(empleadosExcluir);
                dgvPubsAbejitas.DataSource = resultadoDiferencia.ToList();
            }
        }

        private void btnPublishersDiferencia_Click(object sender, EventArgs e)
        {
            // 3. Consulta de Diferencia: Filtra solo editoriales de USA restando las extranjeras del total
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var todasLasEditoriales = (from p in pubsAbejitas.publishers
                                           select new
                                           {
                                               ID = p.pub_id,
                                               Nombre = p.pub_name,
                                               Pais = p.country,
                                               Tipo = "Editorial"
                                           }).ToList();

                var editorialesExtranjeras = (from p in pubsAbejitas.publishers
                                              where p.country != "USA"
                                              select new
                                              {
                                                  ID = p.pub_id,
                                                  Nombre = p.pub_name,
                                                  Pais = p.country,
                                                  Tipo = "Editorial"
                                              }).ToList();

                var resultadoDiferencia = todasLasEditoriales.Except(editorialesExtranjeras);
                dgvPubsAbejitas.DataSource = resultadoDiferencia.ToList();
            }
        }


        // ==========================================
        // OPERACIONES BINARIAS: PRODUCTO CARTESIANO (×)
        // ==========================================

        private void btnDiscountsPC_Click(object sender, EventArgs e)
        {
            // 1. Producto Cartesiano: Cruza todos los tipos de descuentos con todas las tiendas registradas
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var productoCartesiano = from d in pubsAbejitas.discounts
                                         from s in pubsAbejitas.stores
                                         select new
                                         {
                                             TipoDescuento = d.discounttype,
                                             Porcentaje = d.discount1,
                                             Tienda = s.stor_name,
                                             Ciudad = s.city
                                         };

                dgvPubsAbejitas.DataSource = productoCartesiano.ToList();
            }
        }

        private void btnProductoPC_Click(object sender, EventArgs e)
        {
            // 2. Producto Cartesiano: Empareja de manera absoluta todas las ventas con cada uno de los autores
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var productoCartesiano = from sa in pubsAbejitas.sales
                                         from au in pubsAbejitas.authors
                                         select new
                                         {
                                             OrdenNumero = sa.ord_num,
                                             Cantidad = sa.qty,
                                             FechaOrden = sa.ord_date,
                                             AutorPosible = au.au_fname + " " + au.au_lname,
                                             TelefonoAutor = au.phone
                                         };

                dgvPubsAbejitas.DataSource = productoCartesiano.ToList();
            }
        }

        private void btnAuthorsPC_Click(object sender, EventArgs e)
        {
            // 3. Producto Cartesiano: Cruza la asignación de libros-autores con todas las tiendas físicas disponibles
            using (PubsAbejitasEntities pubsAbejitas = new PubsAbejitasEntities())
            {
                var productoCartesiano = from ta in pubsAbejitas.titleauthors
                                         from s in pubsAbejitas.stores
                                         select new
                                         {
                                             ID_Autor = ta.au_id,
                                             ID_Libro = ta.title_id,
                                             PorcentajeRegalia = ta.royaltyper,
                                             TiendaDestino = s.stor_name,
                                             CiudadTienda = s.city
                                         };

                dgvPubsAbejitas.DataSource = productoCartesiano.ToList();
            }
        }
    }
}
