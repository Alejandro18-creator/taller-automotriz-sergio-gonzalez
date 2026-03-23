/**
 * CLIENTES - Gestión de Clientes
 */

const ClientesModule = {
  name: "clientes",

  render() {
    return `
            <div class="clientes-container">
                <div class="clientes-header">
                    <h2>Gestión de Clientes</h2>
                    <button class="btn btn-primary" id="btnAgregarCliente">
                        <i class="fas fa-plus"></i> Agregar Cliente
                    </button>
                </div>

                <div class="clientes-content">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>Vehículos</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="clientesTableBody">
                            <tr>
                                <td colspan="6" style="text-align: center; padding: 20px;">Sin clientes registrados</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Modal para agregar/editar cliente -->
                <div id="modalCliente" class="modal" style="display: none;">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h3>Agregar Cliente</h3>
                        <form id="formCliente">
                            <input type="text" placeholder="Nombre" required>
                            <input type="tel" placeholder="Teléfono" required>
                            <input type="email" placeholder="Email" required>
                            <button type="submit" class="btn btn-primary">Guardar</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
  },

  init() {
    console.log("Clientes inicializado");
    this.setupEventListeners();
  },

  setupEventListeners() {
    const btnAgregar = document.getElementById("btnAgregarCliente");
    if (btnAgregar) {
      btnAgregar.addEventListener("click", () => this.abrirModal());
    }
  },

  abrirModal() {
    const modal = document.getElementById("modalCliente");
    if (modal) {
      modal.style.display = "block";
    }
  },

  destroy() {
    const modal = document.getElementById("modalCliente");
    if (modal) {
      modal.style.display = "none";
    }
  },
};

export default ClientesModule;
