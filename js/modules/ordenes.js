/**
 * ÓRDENES - Gestión de Órdenes de Trabajo
 */

const OrdenesModule = {
  name: "ordenes",

  render() {
    return `
            <div class="ordenes-container">
                <div class="ordenes-header">
                    <h2>Órdenes de Trabajo</h2>
                    <button class="btn btn-primary" id="btnCrearOrden">
                        <i class="fas fa-plus"></i> Nueva Orden
                    </button>
                </div>

                <div class="ordenes-filtros">
                    <select id="filtroEstado">
                        <option value="">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                </div>

                <div class="ordenes-content">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Orden ID</th>
                                <th>Cliente</th>
                                <th>Vehículo</th>
                                <th>Servicio</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="ordenesTableBody">
                            <tr>
                                <td colspan="7" style="text-align: center; padding: 20px;">Sin órdenes registradas</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Modal para crear/editar orden -->
                <div id="modalOrden" class="modal" style="display: none;">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h3>Nueva Orden</h3>
                        <form id="formOrden">
                            <select id="selectCliente" required>
                                <option value="">Seleccione Cliente</option>
                            </select>
                            <select id="selectVehiculo" required>
                                <option value="">Seleccione Vehículo</option>
                            </select>
                            <textarea placeholder="Descripción del servicio" required></textarea>
                            <input type="number" placeholder="Costo estimado" step="0.01" required>
                            <button type="submit" class="btn btn-primary">Crear Orden</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
  },

  init() {
    console.log("Órdenes inicializado");
    this.setupEventListeners();
  },

  setupEventListeners() {
    const btnCrear = document.getElementById("btnCrearOrden");
    if (btnCrear) {
      btnCrear.addEventListener("click", () => this.abrirModal());
    }
  },

  abrirModal() {
    const modal = document.getElementById("modalOrden");
    if (modal) {
      modal.style.display = "block";
    }
  },

  destroy() {
    const modal = document.getElementById("modalOrden");
    if (modal) {
      modal.style.display = "none";
    }
  },
};

export default OrdenesModule;
