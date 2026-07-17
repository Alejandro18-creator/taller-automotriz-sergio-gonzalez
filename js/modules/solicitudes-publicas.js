/**
 * SOLICITUDES DE ATENCION - Vista interna para el taller
 */

import Notificaciones from "./notificaciones.js";

import { db } from "../firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const SolicitudesPublicasModule = {
  name: "solicitudes-publicas",

  render() {
    return `
      <div class="solicitudes-container">
      
  <div class="solicitudes-header">

    <h2>Solicitudes de Atencion</h2>

    <div>

      <button id="btnBorrarTodo" class="btn btn-danger">
        🗑 Borrar Todo
      </button>

      <button id="btnRecargarSolicitudes" class="btn btn-secondary">
        <i class="fas fa-rotate"></i> Recargar
      </button>

    </div>

  </div>

        <p class="solicitudes-info">
          Aquí llegan las solicitudes enviadas desde Atención (vista pública).
        </p>

        <div id="solicitudesEstado" class="mensaje" style="display: none;"></div>

        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Patente</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Detalle</th>
              <th>Fecha Agendada</th>
              <th>Recibido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="solicitudesBody">
            <tr>
              <td colspan="10" style="text-align: center; padding: 20px;">Cargando solicitudes...</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  },

  init() {
    const recargarBtn = document.getElementById("btnRecargarSolicitudes");

    const borrarBtn = document.getElementById("btnBorrarTodo");

    const tabla = document.getElementById("solicitudesBody");

    this.onRecargar = () => this.cargarSolicitudes();
    this.onTablaClick = (event) => this.handleTableClick(event);

    if (recargarBtn) {
      recargarBtn.addEventListener("click", this.onRecargar);
    }

    if (borrarBtn) {
      borrarBtn.addEventListener("click", () => this.borrarTodo());
    }

    if (tabla) {
      tabla.addEventListener("click", this.onTablaClick);
    }

    this.cargarSolicitudes();
  },

  getEstadoLabel(estado) {
    switch (estado) {
      case "pendiente":
        return "Pendiente";

      case "esperando_vehiculo":
        return "Esperando Vehículo";

      case "diagnostico":
        return "Diagnóstico";

      case "cotizacion":
        return "Cotización";

      case "reparacion":
        return "Reparación";

      case "terminado":
        return "Terminado";

      case "entregado":
        return "Entregado";

      default:
        return estado;
    }
  },

  getEstadoOptions(estadoActual) {
    const estados = ["pendiente", "en_proceso", "cerrada"];
    return estados
      .map((estado) => {
        const selected = estado === estadoActual ? "selected" : "";
        return `<option value="${estado}" ${selected}>${this.getEstadoLabel(estado)}</option>`;
      })
      .join("");
  },

  async cargarSolicitudes() {
    const tbody = document.getElementById("solicitudesBody");
    const estado = document.getElementById("solicitudesEstado");

    if (!tbody) {
      return;
    }

    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 20px;">Cargando solicitudes...
    `;

    try {
      /*
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Cliente de Supabase no inicializado");
      }
      */
      const snapshot = await getDocs(collection(db, "solicitudes_publicas"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        _doc: doc.data(),
        ...doc.data(),
      }));

      if (!data || data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="10" style="text-align: center; padding: 20px;">Sin solicitudes registradas</td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = data
        .map((item) => {
          const nombre = item.cliente?.nombre || "-";
          const telefono = item.cliente?.telefono || "-";
          const email = item.cliente?.email || item.cliente?.correo || "-";
          const marca = item.vehiculo?.marca || "-";
          const modelo = item.vehiculo?.modelo || "-";
          const anio = item.vehiculo?.anio || "-";
          const detalle = item.detalle || item.servicio || "-";

          const fecha = item.created_at
            ? new Date(item.created_at).toLocaleString("es-CL")
            : "-";
          const fechaAgendada = (() => {
            if (!item.agenda?.fecha) return "-";
            const raw = String(item.agenda.fecha).trim();
            // Intentar extraer YYYY-MM-DD del valor
            const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (match) {
              const [, y, m, d] = match;
              const meses = [
                "ene",
                "feb",
                "mar",
                "abr",
                "may",
                "jun",
                "jul",
                "ago",
                "sep",
                "oct",
                "nov",
                "dic",
              ];
              const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
              const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
              return `${dias[dateObj.getDay()]} ${Number(d)} de ${meses[Number(m) - 1]} ${y}`;
            }
            return raw;
          })();
          const horaAgendada = (() => {
            if (!item.agenda?.hora) return "";
            const raw = String(item.agenda.hora).trim();
            const match = raw.match(/^(\d{2}:\d{2})/);
            return match ? `${match[1]} hrs` : raw;
          })();
          const estadoSolicitud = item.estado || "pendiente";

          return `
            <tr>
              <td>${item.folio ?? item.id}</td>
              <td>${nombre}</td>
              <td>${telefono}</td>
              <td>${item.vehiculo?.patente || "-"}</td>
              <td>${marca}</td>
              <td>${modelo}</td>
              <td>${anio}</td>
              <td>${detalle}</td>
              <td>${fechaAgendada !== "-" ? `<span class="fecha-agendada-badge"><i class="fas fa-calendar-check"></i> ${fechaAgendada}${horaAgendada ? ` · ${horaAgendada}` : ""}</span>` : "-"}</td>
              <td>${fecha}</td>
              <td>
                <div class="estado-actions">
                  <select class="estado-select" data-id="${item.id}">
                    ${this.getEstadoOptions(estadoSolicitud)}
                  </select>

                  <button
                    class="btn btn-secondary btn-sm btn-guardar-estado"
                    data-id="${item.id}"
                    data-email="${email}"
                    data-patente="${item.vehiculo?.patente || ""}"
                    data-fecha="${fechaAgendada}"
                    data-hora="${horaAgendada}">
                    ${
                      estadoSolicitud === "pendiente"
                        ? "Aceptar"
                        : estadoSolicitud === "esperando_vehiculo"
                          ? "Ingresar Vehículo"
                          : "Ver OT"
                    }
                  </button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");

      if (estado) {
        estado.style.display = "none";
      }
    } catch (err) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 20px;">No se pudo cargar la información</td>
        </tr>
      `;

      if (estado) {
        estado.textContent = `Error cargando solicitudes: ${err.message}`;
        estado.style.display = "block";
      }
    }
  },

  async handleTableClick(event) {
    const target = event.target.closest(".btn-guardar-estado");

    if (!target) {
      return;
    }

    console.log("CLICK ACEPTAR");

    const confirmar = confirm(
      "¿Confirma que desea aceptar esta solicitud de atención?",
    );

    if (!confirmar) {
      return;
    }

    const id = target.dataset.id;

    const textoBoton = target.textContent.trim();

    if (textoBoton === "Ingresar Vehículo") {
      window.router.navigate("ingreso-vehiculo");
      return;
    }

    const row = target.closest("tr");

    const estadoSelect = row ? row.querySelector(".estado-select") : null;

    const nuevoEstado = estadoSelect ? estadoSelect.value : null;

    if (!id || !nuevoEstado) {
      return;
    }

    const estadoMensaje = document.getElementById("solicitudesEstado");

    try {
      const solicitudRef = doc(db, "solicitudes_publicas", id);

      await updateDoc(solicitudRef, {
        estado: "esperando_vehiculo",
      });

      await Notificaciones.enviarAceptacion({
        id,
        nombre: row.children[1].textContent,
        telefono: row.children[2].textContent,
        email: target.dataset.email,
        marca: row.children[4].textContent,
        patente: target.dataset.patente,
        fecha: target.dataset.fecha,
        hora: target.dataset.hora,
      });
      /*
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Cliente de Supabase no inicializado");
      }
        */
      /*
      const { error } = await client
        .from("solicitudes_publicas")
        .update({ estado: nuevoEstado })
        .eq("id", id);

      if (error) {
        throw error;
      }
      */
      target.textContent = "Ingresar Vehículo";
      this.cargarSolicitudes();

      /*window.otDraft = {
        solicitudId: target.dataset.id,

        cliente: row.children[1].textContent,

        telefono: row.children[2].textContent,

        patente: row.children[3].textContent,

        vehiculo:
          row.children[4].textContent + " " + row.children[5].textContent,
      };

      window.router.navigate("ordenes-trabajo");*/

      target.classList.remove("btn-secondary");

      target.classList.add("btn-success");

      if (estadoMensaje) {
        estadoMensaje.textContent = `Estado actualizado correctamente para solicitud #${id}.`;
        estadoMensaje.style.display = "block";
      }

      /* this.cargarSolicitudes();*/
    } catch (err) {
      console.error(err);

      if (estadoMensaje) {
        estadoMensaje.textContent = `No se pudo actualizar el estado: ${err.message}`;
        estadoMensaje.style.display = "block";
      }
    }
  },

  async borrarTodo() {
    const confirmar = confirm(
      "¿Desea borrar TODAS las solicitudes y TODAS las órdenes de trabajo?",
    );

    if (!confirmar) {
      return;
    }

    try {
      // Borrar solicitudes
      const solicitudes = await getDocs(collection(db, "solicitudes_publicas"));

      for (const documento of solicitudes.docs) {
        await deleteDoc(documento.ref);
      }

      // Borrar órdenes de trabajo
      const ots = await getDocs(collection(db, "ordenes_trabajo"));

      for (const documento of ots.docs) {
        await deleteDoc(documento.ref);
      }

      window.otDraft = null;

      alert("Todos los datos fueron eliminados.");

      this.cargarSolicitudes();
    } catch (err) {
      console.error(err);

      alert("No fue posible borrar los datos.");
    }
  },

  destroy() {
    const recargarBtn = document.getElementById("btnRecargarSolicitudes");
    const tabla = document.getElementById("solicitudesBody");

    if (recargarBtn) {
      recargarBtn.removeEventListener("click", this.onRecargar);
    }

    if (tabla) {
      tabla.removeEventListener("click", this.onTablaClick);
    }
  },
};

export default SolicitudesPublicasModule;
