import { db } from "../firebase.js";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
      const cliente = document.getElementById("otCliente");

      const telefono = document.getElementById("otTelefono");

      const vehiculo = document.getElementById("otVehiculo");

      const patente = document.getElementById("otPatente");

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

      const form = document.getElementById("formOT");

      if (form) {
        form.addEventListener("submit", (e) => this.crearOT(e));
      }
    }
  },

  async crearOT(event) {
    event.preventDefault();

    const payload = {
      cliente: document.getElementById("otCliente").value,

      telefono: document.getElementById("otTelefono").value,

      vehiculo: document.getElementById("otVehiculo").value,

      patente: document.getElementById("otPatente").value.toUpperCase(),

      kilometraje: Number(document.getElementById("otKilometraje").value) || 0,

      diagnostico: document.getElementById("otDiagnostico").value,

      estado: "diagnostico",

      created_at: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, "ordenes_trabajo"), payload);

      console.log("OT creada:", docRef.id);

      if (window.otDraft?.solicitudId) {

  await updateDoc(
    doc(
      db,
      "solicitudes_publicas",
      window.otDraft.solicitudId
    ),
    {
      otId: docRef.id,
      estado: "diagnostico",
      updated_at: new Date().toISOString(),
    }
  );

}


      alert("OT creada correctamente");
    } catch (err) {
      console.error(err);

      alert("Error al crear la OT");
    }
  },

  destroy() {},
};

export default OrdenesTrabajoModule;
