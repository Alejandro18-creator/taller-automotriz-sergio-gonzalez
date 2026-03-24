/**
 * SOLICITUDES PUBLICAS - Vista interna para el taller
 */

import { getSupabaseClient } from "../supabase-client.js";

const SolicitudesPublicasModule = {
  name: "solicitudes-publicas",

  render() {
    return `
      <div class="solicitudes-container">
        <div class="solicitudes-header">
          <h2>Solicitudes Públicas</h2>
          <button id="btnRecargarSolicitudes" class="btn btn-secondary">
            <i class="fas fa-rotate"></i> Recargar
          </button>
        </div>

        <p class="solicitudes-info">
          Aquí llegan las solicitudes enviadas desde Atención y Cotizaciones (vista pública).
        </p>

        <div id="solicitudesEstado" class="mensaje" style="display: none;"></div>

        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Vehículo</th>
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
    const tabla = document.getElementById("solicitudesBody");

    this.onRecargar = () => this.cargarSolicitudes();
    this.onTablaClick = (event) => this.handleTableClick(event);

    if (recargarBtn) {
      recargarBtn.addEventListener("click", this.onRecargar);
    }

    if (tabla) {
      tabla.addEventListener("click", this.onTablaClick);
    }

    this.cargarSolicitudes();
  },

  getEstadoLabel(estado) {
    if (estado === "en_proceso") {
      return "En Proceso";
    }
    if (estado === "cerrada") {
      return "Cerrada";
    }
    return "Pendiente";
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
        <td colspan="10" style="text-align: center; padding: 20px;">Consultando Supabase...</td>
      </tr>
    `;

    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Cliente de Supabase no inicializado");
      }

      const { data, error } = await client
        .from("solicitudes_publicas")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

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
          const tipo = item.tipo || "-";
          const nombre = item.nombre || "-";
          const telefono = item.telefono || "-";
          const vehiculo =
            [item.marca, item.modelo, item.patente]
              .filter(Boolean)
              .join(" / ") || "-";
          const detalle = item.mensaje || item.trabajo || item.servicio || "-";
          const fecha = item.created_at
            ? new Date(item.created_at).toLocaleString("es-CL")
            : "-";
          const fechaAgendada = (() => {
            if (!item.fecha_agendada) return "-";
            const raw = String(item.fecha_agendada).trim();
            // Intentar extraer YYYY-MM-DD del valor
            const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (match) {
              const [, y, m, d] = match;
              const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
              const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
              const dias = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
              return `${dias[dateObj.getDay()]} ${Number(d)} de ${meses[Number(m) - 1]} ${y}`;
            }
            return raw;
          })();
          const estadoSolicitud = item.estado || "pendiente";

          return `
            <tr>
              <td>${item.id ?? "-"}</td>
              <td>${tipo}</td>
              <td>
                <span class="estado-chip estado-${estadoSolicitud}">${this.getEstadoLabel(estadoSolicitud)}</span>
              </td>
              <td>${nombre}</td>
              <td>${telefono}</td>
              <td>${vehiculo}</td>
              <td>${detalle}</td>
              <td>${fechaAgendada !== "-" ? `<span class="fecha-agendada-badge"><i class="fas fa-calendar-check"></i> ${fechaAgendada}</span>` : "-"}</td>
              <td>${fecha}</td>
              <td>
                <div class="estado-actions">
                  <select class="estado-select" data-id="${item.id}">
                    ${this.getEstadoOptions(estadoSolicitud)}
                  </select>
                  <button class="btn btn-secondary btn-sm btn-guardar-estado" data-id="${item.id}">
                    Guardar
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
    const target = event.target;
    const isSaveButton = target.classList.contains("btn-guardar-estado");

    if (!isSaveButton) {
      return;
    }

    const id = Number(target.dataset.id);
    const row = target.closest("tr");
    const estadoSelect = row ? row.querySelector(".estado-select") : null;
    const nuevoEstado = estadoSelect ? estadoSelect.value : null;

    if (!id || !nuevoEstado) {
      return;
    }

    const estadoMensaje = document.getElementById("solicitudesEstado");

    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error("Cliente de Supabase no inicializado");
      }

      const { error } = await client
        .from("solicitudes_publicas")
        .update({ estado: nuevoEstado })
        .eq("id", id);

      if (error) {
        throw error;
      }

      if (estadoMensaje) {
        estadoMensaje.textContent = `Estado actualizado correctamente para solicitud #${id}.`;
        estadoMensaje.style.display = "block";
      }

      this.cargarSolicitudes();
    } catch (err) {
      if (estadoMensaje) {
        estadoMensaje.textContent = `No se pudo actualizar el estado: ${err.message}`;
        estadoMensaje.style.display = "block";
      }
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
