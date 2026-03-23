/**
 * REPORTES - Análisis y Reportes
 */

const ReportesModule = {
  name: "reportes",

  render() {
    return `
            <div class="reportes-container">
                <div class="reportes-header">
                    <h2>Reportes</h2>
                </div>

                <div class="reportes-filtros">
                    <div class="filtro-grupo">
                        <label>Fecha Inicio:</label>
                        <input type="date" id="fechaInicio">
                    </div>
                    <div class="filtro-grupo">
                        <label>Fecha Fin:</label>
                        <input type="date" id="fechaFin">
                    </div>
                    <button class="btn btn-secondary" id="btnGenerarReporte">
                        <i class="fas fa-sync-alt"></i> Generar
                    </button>
                </div>

                <div class="reportes-grid">
                    <div class="reporte-card">
                        <h3>Órdenes Completadas</h3>
                        <p class="numero-grande">0</p>
                        <small>Este período</small>
                    </div>

                    <div class="reporte-card">
                        <h3>Ingresos Totales</h3>
                        <p class="numero-grande">$0</p>
                        <small>Este período</small>
                    </div>

                    <div class="reporte-card">
                        <h3>Órdenes Promedio</h3>
                        <p class="numero-grande">$0</p>
                        <small>Por orden</small>
                    </div>

                    <div class="reporte-card">
                        <h3>Clientes Nuevos</h3>
                        <p class="numero-grande">0</p>
                        <small>Este período</small>
                    </div>
                </div>

                <div class="reportes-tabla">
                    <h3>Detalle de Órdenes</h3>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Orden ID</th>
                                <th>Cliente</th>
                                <th>Monto</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody id="reportesTableBody">
                            <tr>
                                <td colspan="5" style="text-align: center; padding: 20px;">Sin datos</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
  },

  init() {
    console.log("Reportes inicializado");
    this.setupEventListeners();
  },

  setupEventListeners() {
    const btnGenerar = document.getElementById("btnGenerarReporte");
    if (btnGenerar) {
      btnGenerar.addEventListener("click", () => this.generarReporte());
    }
  },

  generarReporte() {
    console.log("Generando reporte...");
    // Aquí irá la lógica para generar reportes
  },

  destroy() {
    // Limpiar si es necesario
  },
};

export default ReportesModule;
