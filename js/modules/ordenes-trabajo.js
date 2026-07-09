const OrdenesTrabajoModule = {

  name: "ordenes-trabajo",

  render() {

    return `

      <div class="ordenes-container">

        <div class="ordenes-header">
          <h2>Órdenes de Trabajo</h2>
        </div>

        <div class="card">

          <h3>Nueva Orden de Trabajo</h3>

          <form id="formOT">

            <div class="form-group">
              <label>Cliente</label>
              <input type="text" id="otCliente" class="form-control">
            </div>

            <div class="form-group">
              <label>Teléfono</label>
              <input type="text" id="otTelefono" class="form-control">
            </div>

            <div class="form-group">
              <label>Vehículo</label>
              <input type="text" id="otVehiculo" class="form-control">
            </div>

            <div class="form-group">
              <label>Patente</label>
              <input type="text" id="otPatente" class="form-control">
            </div>

            <div class="form-group">
              <label>Kilometraje</label>
              <input type="number" id="otKilometraje" class="form-control">
            </div>

            <div class="form-group">
              <label>Diagnóstico</label>

              <textarea
                id="otDiagnostico"
                class="form-control"
                rows="4"
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary">
              Crear OT
            </button>

          </form>

        </div>

      </div>

    `;
  },

  init() {

  console.log("Órdenes de Trabajo inicializado");

  if (window.otDraft) {

    const cliente =
      document.getElementById("otCliente");

    const telefono =
      document.getElementById("otTelefono");

    const vehiculo =
      document.getElementById("otVehiculo");

    const patente =
      document.getElementById("otPatente");

    if (cliente) {
      cliente.value = window.otDraft.cliente || "";
    }

    if (telefono) {
      telefono.value = window.otDraft.telefono || "";
    }

    if (vehiculo) {
      vehiculo.value = window.otDraft.vehiculo || "";
    }

    if (patente) {
      patente.value = window.otDraft.patente || "";
    }

  }

},

  destroy() {},

};

export default OrdenesTrabajoModule;