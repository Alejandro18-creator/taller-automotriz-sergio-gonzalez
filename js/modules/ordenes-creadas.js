import { db } from "../firebase.js";

import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const OrdenesCreadasModule = {
  name: "ordenes-creadas",

  render() {
    return `

      <div class="ordenes-container">

        <div class="ordenes-header">
          <h2>OT Creadas</h2>
        </div>

        <div class="card">

          <h3>Listado de Órdenes de Trabajo</h3>

          <p>Cargando órdenes de trabajo...</p>

        </div>

      </div>

    `;
  },

  async init() {
    console.log("OT Creadas");

    const container = document.querySelector(".card");

    const snapshot = await getDocs(collection(db, "ordenes_trabajo"));

    if (snapshot.empty) {
      container.innerHTML = `
      <h3>Listado de Órdenes de Trabajo</h3>
      <p>No existen órdenes de trabajo.</p>
    `;

      return;
    }

    let html = `
    <h3>Listado de Órdenes de Trabajo</h3>

    <table class="table">

      <thead>
        <tr>
         <th>OT</th>
            <th>Patente</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
  `;

    snapshot.forEach((doc) => {
      const ot = doc.data();

      html += `
  <tr>
    <td>${doc.id.substring(0, 8)}</td>
    <td>${ot.patente}</td>
    <td>${ot.cliente}</td>
    <td>${ot.estado}</td>
    <td>${new Date(ot.created_at).toLocaleDateString("es-CL")}</td>
    <td>
      <button
        class="btn btn-primary btn-sm"
        data-id="${doc.id}"
        data-patente="${ot.patente}">
        Abrir
      </button>
    </td>
  </tr>
`;
    });

    html += `
      </tbody>
    </table>
  `;

    container.innerHTML = html;
    container.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.otSeleccionada = {
          id: btn.dataset.id,
          patente: btn.dataset.patente,
        };

        window.router.navigate("ordenes-trabajo");
      });
    });
  },

  destroy() {},
};

export default OrdenesCreadasModule;
