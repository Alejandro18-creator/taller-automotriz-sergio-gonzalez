/**
 * ÓRDENES - Gestión de Órdenes de Trabajo
 */
import { getSupabaseClient } from "../supabase-client.js";

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

                <!-- Tarjetas de resumen por estado -->
                <div class="ordenes-resumen">
                    <div class="ordenes-card ordenes-card-pendiente">
                        <div class="ordenes-card-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="ordenes-card-info">
                            <span class="ordenes-card-label">Pendientes</span>
                            <span class="ordenes-card-count" id="countPendiente">0</span>
                        </div>
                    </div>
                    <div class="ordenes-card ordenes-card-proceso">
                        <div class="ordenes-card-icon">
                            <i class="fas fa-wrench"></i>
                        </div>
                        <div class="ordenes-card-info">
                            <span class="ordenes-card-label">En Proceso</span>
                            <span class="ordenes-card-count" id="countEnProceso">0</span>
                        </div>
                    </div>
                    <div class="ordenes-card ordenes-card-completada">
                        <div class="ordenes-card-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="ordenes-card-info">
                            <span class="ordenes-card-label">Completadas</span>
                            <span class="ordenes-card-count" id="countCompletada">0</span>
                        </div>
                    </div>
                    <div class="ordenes-card ordenes-card-cancelada">
                        <div class="ordenes-card-icon">
                            <i class="fas fa-times-circle"></i>
                        </div>
                        <div class="ordenes-card-info">
                            <span class="ordenes-card-label">Canceladas</span>
                            <span class="ordenes-card-count" id="countCancelada">0</span>
                        </div>
                    </div>
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
    this.cargarContadores();
    this.cargarOrdenes();
  },

  setupEventListeners() {
    // Cierre mejorado del modal
    const modal = document.getElementById("modalOrden");
    if (modal) {
      // Cerrar al hacer clic en la X
      const closeBtn = modal.querySelector(".close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          modal.style.display = "none";
        });
      }
      // Cerrar al hacer clic fuera del contenido
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
      // Cerrar con Escape
      document.addEventListener("keydown", (e) => {
        if (modal.style.display === "block" && e.key === "Escape") {
          modal.style.display = "none";
        }
      });
    }
    const btnCrear = document.getElementById("btnCrearOrden");
    if (btnCrear) {
      btnCrear.addEventListener("click", () => this.abrirModal());
    }

    const filtroEstado = document.getElementById("filtroEstado");
    if (filtroEstado) {
      filtroEstado.addEventListener("change", () => this.cargarOrdenes());
    }

    // Delegación de eventos para botones de cambiar estado
    const tabla = document.getElementById("ordenesTableBody");
    if (tabla) {
      tabla.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-cambiar-estado");
        if (!btn) return;

        const id = Number(btn.dataset.id);
        const row = btn.closest("tr");
        const select = row ? row.querySelector(".orden-estado-select") : null;
        if (id && select) {
          this.cambiarEstado(id, select.value);
        }
      });
    }
  },

  async cargarContadores() {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn("Supabase no disponible para cargar contadores");
      return;
    }

    try {
      // Traer todas las solicitudes y contar por estado
      const { data, error } = await supabase
        .from("solicitudes_publicas")
        .select("estado");

      if (error) {
        console.error("Error al cargar contadores:", error);
        return;
      }

      const contadores = {
        pendiente: 0,
        en_proceso: 0,
        completada: 0,
        cancelada: 0,
      };

      (data || []).forEach((item) => {
        const est = item.estado === "cerrada" ? "completada" : item.estado;
        if (contadores[est] !== undefined) {
          contadores[est]++;
        }
      });

      document.getElementById("countPendiente").textContent =
        contadores.pendiente;
      document.getElementById("countEnProceso").textContent =
        contadores.en_proceso;
      document.getElementById("countCompletada").textContent =
        contadores.completada;
      document.getElementById("countCancelada").textContent =
        contadores.cancelada;
    } catch (err) {
      console.error("Error al cargar contadores:", err);
    }
  },

  getEstadoTexto(estado) {
    const map = {
      pendiente: "Pendiente",
      en_proceso: "En Proceso",
      completada: "Completada",
      cancelada: "Cancelada",
      cerrada: "Completada",
    };
    return map[estado] || estado;
  },

  getNormalizedEstado(estado) {
    return estado === "cerrada" ? "completada" : estado || "pendiente";
  },

  getEstadoOptions(estadoActual) {
    const estados = ["pendiente", "en_proceso", "completada", "cancelada"];
    return estados
      .map((e) => {
        const selected =
          e === this.getNormalizedEstado(estadoActual) ? "selected" : "";
        return `<option value="${e}" ${selected}>${this.getEstadoTexto(e)}</option>`;
      })
      .join("");
  },

  async cargarOrdenes() {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn("Supabase no disponible para cargar órdenes");
      return;
    }

    const tbody = document.getElementById("ordenesTableBody");
    if (!tbody) return;

    try {
      let query = supabase
        .from("solicitudes_publicas")
        .select("*")
        .order("created_at", { ascending: false });

      const filtro = document.getElementById("filtroEstado");
      if (filtro && filtro.value) {
        if (filtro.value === "completada") {
          query = query.in("estado", ["completada", "cerrada"]);
        } else {
          query = query.eq("estado", filtro.value);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error al cargar órdenes:", error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;color:#d32f2f;">Error al cargar órdenes</td></tr>`;
        return;
      }

      if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;">Sin órdenes registradas</td></tr>`;
        return;
      }

      tbody.innerHTML = data
        .map((orden) => {
          const cliente = orden.nombre || "N/A";
          const vehiculo =
            [orden.marca, orden.modelo, orden.patente]
              .filter(Boolean)
              .join(" ") || "N/A";
          const servicio =
            orden.servicio || orden.trabajo || orden.mensaje || "N/A";
          const fecha = orden.created_at
            ? new Date(orden.created_at).toLocaleDateString("es-CO")
            : "N/A";
          const estadoNorm = this.getNormalizedEstado(orden.estado);
          const estadoClass = `estado-${estadoNorm}`;
          const telefono = orden.telefono
            ? String(orden.telefono).replace(/[^0-9]/g, "")
            : "";
          // Mensaje de confirmación para WhatsApp
          const mensajeWsp = encodeURIComponent(
            `Hola ${cliente}, tu reserva en el taller fue aceptada.\n\n` +
              `Vehículo: ${vehiculo}\n` +
              `Servicio: ${servicio}\n` +
              `Fecha: ${fecha}\n` +
              `¡Te esperamos!`,
          );
          const urlWsp = telefono
            ? `https://wa.me/56${telefono}?text=${mensajeWsp}`
            : null;

          // Botón para mostrar mensaje del cliente
          const btnMensaje = orden.mensaje
            ? `<button class="btn btn-xs btn-info btn-ver-mensaje" data-mensaje="${encodeURIComponent(
                orden.mensaje,
              )}" title="Ver mensaje del cliente">ver</button>`
            : "";

          return `
            <tr>
              <td>#${orden.id} ${btnMensaje}</td>
              <td>${cliente}</td>
              <td>${vehiculo}</td>
              <td>${servicio}</td>
              <td><span class="badge ${estadoClass}">${this.getEstadoTexto(orden.estado)}</span></td>
              <td>${fecha}</td>
              <td>
                <div class="orden-actions">
                  <select class="orden-estado-select" data-id="${orden.id}">
                    ${this.getEstadoOptions(orden.estado)}
                  </select>
                  <button class="btn btn-sm btn-primary btn-cambiar-estado" data-id="${orden.id}" title="Guardar estado">
                    <i class="fas fa-save"></i>
                  </button>
                  ${urlWsp ? `<a href="${urlWsp}" target="_blank" class="btn btn-sm btn-success" title="Confirmar por WhatsApp"><i class="fab fa-whatsapp"></i></a>` : ""}
                </div>
              </td>
            </tr>
          `;
        })
        .join("");

      // Delegar evento para mostrar mensaje del cliente
      tbody.querySelectorAll(".btn-ver-mensaje").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const mensaje = decodeURIComponent(btn.getAttribute("data-mensaje"));
          alert("Mensaje del cliente:\n\n" + mensaje);
        });
      });
    } catch (err) {
      console.error("Error al cargar órdenes:", err);
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;color:#d32f2f;">Error inesperado</td></tr>`;
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
