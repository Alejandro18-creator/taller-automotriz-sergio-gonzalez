/**
 * VEHÍCULOS - Gestión de Vehículos
 */

const VehiculosModule = {
  name: "vehiculos",

  render() {
    return `
            <div class="vehiculos-container">
                <div class="vehiculos-header">
                    <h2>Gestión de Vehículos</h2>
                    <button class="btn btn-primary" id="btnAgregarVehiculo">
                        <i class="fas fa-plus"></i> Agregar Vehículo
                    </button>
                </div>

                <div class="vehiculos-content">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Patente</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Año</th>
                                <th>Cliente</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="vehiculosTableBody">
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 20px;">Sin vehículos registrados</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Modal para agregar/editar vehículo -->
                <div id="modalVehiculo" class="modal" style="display: none;">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h3>Agregar Vehículo</h3>
                        <form id="formVehiculo">
                            <input type="text" placeholder="Patente" required>
                            <input type="text" placeholder="Marca" required>
                            <input type="text" placeholder="Modelo" required>
                            <input type="number" placeholder="Año" required>
                            <select required>
                                <option value="">Seleccione Cliente</option>
                            </select>
                            <button type="submit" class="btn btn-primary">Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
  },

  init() {
    console.log("Vehículos inicializado");
    this.setupEventListeners();
  },

  setupEventListeners() {
    const btnAgregar = document.getElementById("btnAgregarVehiculo");
    if (btnAgregar) {
      btnAgregar.addEventListener("click", () => this.abrirModal());
    }
  },

  abrirModal() {
    const modal = document.getElementById("modalVehiculo");
    if (modal) {
      modal.style.display = "block";
    }
  },

  destroy() {
    const modal = document.getElementById("modalVehiculo");
    if (modal) {
      modal.style.display = "none";
    }
  },
};

export default VehiculosModule;
