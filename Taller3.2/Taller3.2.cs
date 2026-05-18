using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace operaciones_unarias_binarias
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            using (NorthwindEntities northwind = new NorthwindEntities())
            {
                northwind.Configuration.LazyLoadingEnabled = false;
                northwind.Configuration.ProxyCreationEnabled = false;

                var consulta = northwind.Employees
                                        .Where(em => em.Country == "USA")
                                        .ToList();

                dgvNorthwind.DataSource = consulta;
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            using (NorthwindEntities northwind = new NorthwindEntities())
            {
                northwind.Configuration.LazyLoadingEnabled = false;
                northwind.Configuration.ProxyCreationEnabled = false;

                var consulta = northwind.Products
                                        .Where(p => p.UnitPrice > 20M)
                                        .ToList();

                dgvNorthwind.DataSource = consulta;
            }
        }

        private void button3_Click(object sender, EventArgs e)
        {
            using (NorthwindEntities northwind = new NorthwindEntities())
            {
                northwind.Configuration.LazyLoadingEnabled = false;
                northwind.Configuration.ProxyCreationEnabled = false;

                var consulta = northwind.Customers
                                        .Where(c => c.City == "London")
                                        .ToList();

                dgvNorthwind.DataSource = consulta;
            }
        }

        private void button4_Click(object sender, EventArgs e)
        {
            using (NorthwindEntities northwind = new NorthwindEntities())
            {
                northwind.Configuration.LazyLoadingEnabled = false;
                northwind.Configuration.ProxyCreationEnabled = false;

                var consulta = northwind.Employees
                                        .Select(em => new
                                        {
                                            em.FirstName,
                                            em.LastName
                                        })
                                        .ToList();

                dgvNorthwind.DataSource = consulta;
            }
        }

        private void button5_Click(object sender, EventArgs e)
        {
            using (NorthwindEntities northwind = new NorthwindEntities())
            {
                northwind.Configuration.LazyLoadingEnabled = false;
                northwind.Configuration.ProxyCreationEnabled = false;

                var consulta = northwind.Products
                                        .Select(p => new
                                        {
                                            p.ProductName,
                                            p.UnitPrice
                                        })
                                        .ToList();

                dgvNorthwind.DataSource = consulta;
            }
        }

        private void button6_Click(object sender, EventArgs e)
        {
            using (NorthwindEntities northwind = new NorthwindEntities())
            {
                northwind.Configuration.LazyLoadingEnabled = false;
                northwind.Configuration.ProxyCreationEnabled = false;

                var consulta = northwind.Orders
                                        .Select(o => new
                                        {
                                            o.OrderID,
                                            o.OrderDate
                                        })
                                        .ToList();

                dgvNorthwind.DataSource = consulta;
            }
        }

        private void button7_Click(object sender, EventArgs e)
        {
            using (NorthwindEntities northwind = new NorthwindEntities())
            {
                northwind.Configuration.LazyLoadingEnabled = false;
                northwind.Configuration.ProxyCreationEnabled = false;

                var consulta = northwind.Products
                                        .Select(p => new
                                        {
                                            Producto = p.ProductName,
                                            Precio = p.UnitPrice
                                        })
                                        .ToList();

                dgvNorthwind.DataSource = consulta;
            }
        }

        private void button8_Click(object sender, EventArgs e)
        {
            using (NorthwindEntities northwind = new NorthwindEntities())
            {
                northwind.Configuration.LazyLoadingEnabled = false;
                northwind.Configuration.ProxyCreationEnabled = false;

                var consulta = northwind.Employees
                                        .Select(em => new
                                        {
                                            Nombre = em.FirstName,
                                            Apellido = em.LastName
                                        })
                                        .ToList();

                dgvNorthwind.DataSource = consulta;
            }
        }

        private void button9_Click(object sender, EventArgs e)
        {
            using (NorthwindEntities northwind = new NorthwindEntities())
            {
                northwind.Configuration.LazyLoadingEnabled = false;
                northwind.Configuration.ProxyCreationEnabled = false;

                var consulta = northwind.Customers
                                        .Select(c => new
                                        {
                                            Empresa = c.CompanyName,
                                            Ciudad = c.City
                                        })
                                        .ToList();

                dgvNorthwind.DataSource = consulta;
            }
        }

        private void button10_Click(object sender, EventArgs e)
        {
            using (pubsEntities pubs = new pubsEntities())
            {
                pubs.Configuration.LazyLoadingEnabled = false;
                pubs.Configuration.ProxyCreationEnabled = false;

                var consulta1 = pubs.authors
                                    .Select(a => new { Nombre = a.au_fname });

                var consulta2 = pubs.publishers
                                    .Select(p => new { Nombre = p.pub_name });

                dgvNorthwind.DataSource =
                    consulta1.Union(consulta2).ToList();
            }
        }

        private void button11_Click(object sender, EventArgs e)
        {
            using (pubsEntities pubs = new pubsEntities())
            {
                pubs.Configuration.LazyLoadingEnabled = false;
                pubs.Configuration.ProxyCreationEnabled = false;

                var consulta1 = pubs.authors
                                    .Select(a => new { Ciudad = a.city });

                var consulta2 = pubs.publishers
                                    .Select(p => new { Ciudad = p.city });

                var consulta3 = pubs.stores
                                    .Select(s => new { Ciudad = s.city });

                dgvNorthwind.DataSource =
                    consulta1.Union(consulta2)
                             .Union(consulta3)
                             .ToList();
            }
        }

        private void button12_Click(object sender, EventArgs e)
        {
            using (pubsEntities pubs = new pubsEntities())
            {
                pubs.Configuration.LazyLoadingEnabled = false;
                pubs.Configuration.ProxyCreationEnabled = false;

                var consulta1 = pubs.authors
                                    .Select(a => new { Telefono = a.phone });

                var consulta2 = pubs.stores
                                    .Select(s => new { Telefono = s.stor_name });

                dgvNorthwind.DataSource =
                    consulta1.Union(consulta2).ToList();
            }
        }

        private void button13_Click(object sender, EventArgs e)
        {
            using (pubsEntities pubs = new pubsEntities())
            {
                pubs.Configuration.LazyLoadingEnabled = false;
                pubs.Configuration.ProxyCreationEnabled = false;

                var consulta1 = pubs.authors.Select(a => new { a.city });

                var consulta2 = pubs.publishers.Select(p => new { p.city });

                dgvNorthwind.DataSource =
                    consulta1.Except(consulta2).ToList();
            }
        }

        private void button14_Click(object sender, EventArgs e)
        {
            using (pubsEntities pubs = new pubsEntities())
            {
                pubs.Configuration.LazyLoadingEnabled = false;
                pubs.Configuration.ProxyCreationEnabled = false;

                var consulta1 = pubs.authors.Select(a => new { a.state });

                var consulta2 = pubs.stores.Select(s => new { s.state });

                dgvNorthwind.DataSource =
                    consulta1.Except(consulta2).ToList();
            }
        }

        private void button15_Click(object sender, EventArgs e)
        {
            using (pubsEntities pubs = new pubsEntities())
            {
                pubs.Configuration.LazyLoadingEnabled = false;
                pubs.Configuration.ProxyCreationEnabled = false;

                var consulta1 = pubs.publishers.Select(p => new { p.city });

                var consulta2 = pubs.stores.Select(s => new { s.city });

                dgvNorthwind.DataSource =
                    consulta1.Except(consulta2).ToList();
            }
        }

        private void button16_Click(object sender, EventArgs e)
        {
            using (pubsEntities pubs = new pubsEntities())
            {
                pubs.Configuration.LazyLoadingEnabled = false;
                pubs.Configuration.ProxyCreationEnabled = false;

                var consulta = from a in pubs.authors
                               from t in pubs.titles
                               select new
                               {
                                   a.au_fname,
                                   t.title1
                               };

                dgvNorthwind.DataSource = consulta.ToList();
            }
        }

        private void button17_Click(object sender, EventArgs e)
        {
            using (pubsEntities pubs = new pubsEntities())
            {
                pubs.Configuration.LazyLoadingEnabled = false;
                pubs.Configuration.ProxyCreationEnabled = false;

                var consulta = from p in pubs.publishers
                               from s in pubs.stores
                               select new
                               {
                                   p.pub_name,
                                   s.stor_name
                               };

                dgvNorthwind.DataSource = consulta.ToList();
            }
        }

        private void button18_Click(object sender, EventArgs e)
        {
            using (pubsEntities pubs = new pubsEntities())
            {
                pubs.Configuration.LazyLoadingEnabled = false;
                pubs.Configuration.ProxyCreationEnabled = false;

                var consulta = from a in pubs.authors
                               from s in pubs.sales
                               select new
                               {
                                   a.au_fname,
                                   s.qty
                               };

                dgvNorthwind.DataSource = consulta.ToList();
            }
        }
    }
}
