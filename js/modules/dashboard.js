/**
 * DASHBOARD - Pantalla Principal
 * Muestra resumen del taller
 */

const DashboardModule = {
  name: "dashboard",

  render() {
    return `
            <div class="dashboard-container">
                <div class="welcome-section">
                    <h2>Bienvenido al Sistema del Taller Sebastian Gonzalez</h2>
                    <p>Dashboard del taller automotriz - Gestión integral de servicios</p>
                </div>

                <div class="dashboard-grid">
                    <div class="card card-ordenes">
                        <div class="card-icon">
                            <i class="fas fa-file-invoice"></i>
                        </div>
                        <div class="card-content">
                            <h3>Órdenes Pendientes</h3>
                            <p class="card-number">0</p>
                            <a href="#" class="card-link">Ver todas →</a>
                        </div>
                    </div>

                    <div class="card card-vehiculos">
                        <div class="card-icon">
                            <i class="fas fa-car"></i>
                        </div>
                        <div class="card-content">
                            <h3>Vehículos en Reparación</h3>
                            <p class="card-number">0</p>
                            <a href="#" class="card-link">Ver detalle →</a>
                        </div>
                    </div>

                    <div class="card card-clientes">
                        <div class="card-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="card-content">
                            <h3>Clientes Totales</h3>
                            <p class="card-number">0</p>
                            <a href="#" class="card-link">Listar →</a>
                        </div>
                    </div>

                    <div class="card card-ingresos">
                        <div class="card-icon">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="card-content">
                            <h3>Ingresos Hoy</h3>
                            <p class="card-number">$0</p>
                            <a href="#" class="card-link">Reportes →</a>
                        </div>
                    </div>
                </div>

                <div class="dashboard-bottom">
                    <div class="recent-orders">
                        <h3>Órdenes Recientes</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Vehículo</th>
                                    <th>Estado</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="5" style="text-align: center; padding: 20px;">Sin órdenes registradas</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
  },

  init() {
    console.log("Dashboard inicializado");
    // Aquí irán las funciones de carga de datos desde Supabase
  },

  destroy() {
    // Limpiar event listeners si es necesario
  },
};

export default DashboardModule;
