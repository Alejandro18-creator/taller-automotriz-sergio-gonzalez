/**
 * DISPONIBILIDAD - Gestión de horarios del taller
 * Permite al dueño bloquear días completos o franjas horarias
 * para que no aparezcan disponibles en la vista pública.
 */

import { getSupabaseClient } from "../supabase-client.js";

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const HORAS_TALLER = Array.from(
  { length: 10 },
  (_, i) => `${String(i + 9).padStart(2, "0")}:00`,
);

const DisponibilidadModule = {
  name: "disponibilidad",
  displayMonth: null,
  displayYear: null,
  selectedDate: null,
  bloqueos: [],          // Array de { id, fecha, hora, motivo }
  reservas: [],          // Array de solicitudes agendadas por clientes

  render() {
    const today = new Date();
    this.displayMonth = today.getMonth();
    this.displayYear = today.getFullYear();
    this.selectedDate = null;
    this.bloqueos = [];
    this.reservas = [];

    return `
      <div class="disponibilidad-container">
        <div class="disponibilidad-header">
          <h2><i class="fas fa-calendar-xmark"></i> Gestión de Disponibilidad</h2>
          <p class="disponibilidad-desc">
            Marca los días u horas en que el taller no estará disponible. 
            Estos horarios <strong>no aparecerán</strong> para los clientes al agendar.
          </p>
        </div>

        <div class="disponibilidad-layout">
          <!-- Calendario -->
          <div class="disponibilidad-calendario">
            <div class="calendario-widget" id="dispCalendarioWidget">
              <div class="calendario-header">
                <button type="button" id="dispBtnMesAnterior" class="calendario-nav" title="Mes anterior">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span id="dispCalendarioTitulo" class="calendario-titulo"></span>
                <button type="button" id="dispBtnMesSiguiente" class="calendario-nav" title="Mes siguiente">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
              <div class="calendario-dias-semana">
                ${DIAS_SEMANA.map((d) => `<span>${d}</span>`).join("")}
              </div>
              <div class="calendario-grid" id="dispCalendarioGrid"></div>
            </div>
          </div>

          <!-- Panel lateral: acciones del día seleccionado -->
          <div class="disponibilidad-panel" id="dispPanel">
            <div class="disp-panel-placeholder">
              <i class="fas fa-hand-pointer"></i>
              <p>Selecciona un día en el calendario para ver o bloquear horarios.</p>
            </div>
          </div>
        </div>

        <!-- Resumen de bloqueos activos -->
        <div class="disponibilidad-resumen">
          <h3><i class="fas fa-ban"></i> Bloqueos Activos</h3>
          <div id="dispResumenBody">
            <p class="disp-cargando">Cargando bloqueos...</p>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    console.log("Disponibilidad inicializado");
    this.renderCalendar();
    this.cargarBloqueos();
    this.setupEventListeners();
  },

  setupEventListeners() {
    const btnPrev = document.getElementById("dispBtnMesAnterior");
    const btnNext = document.getElementById("dispBtnMesSiguiente");
    const grid = document.getElementById("dispCalendarioGrid");
    const panel = document.getElementById("dispPanel");

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        const today = new Date();
        if (
          this.displayYear > today.getFullYear() ||
          (this.displayYear === today.getFullYear() && this.displayMonth > today.getMonth())
        ) {
          this.displayMonth--;
          if (this.displayMonth < 0) { this.displayMonth = 11; this.displayYear--; }
          this.renderCalendar();
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        const today = new Date();
        const maxDate = new Date(today.getFullYear(), today.getMonth() + 6, 1);
        const next = new Date(this.displayYear, this.displayMonth + 1, 1);
        if (next <= maxDate) {
          this.displayMonth++;
          if (this.displayMonth > 11) { this.displayMonth = 0; this.displayYear++; }
          this.renderCalendar();
        }
      });
    }

    if (grid) {
      grid.addEventListener("click", (e) => this.onDayClick(e));
    }

    if (panel) {
      panel.addEventListener("click", (e) => this.onPanelClick(e));
    }

    // Delegación para resumen
    const resumen = document.getElementById("dispResumenBody");
    if (resumen) {
      resumen.addEventListener("click", (e) => this.onResumenClick(e));
    }
  },

  // ===== Calendario =====

  renderCalendar() {
    const grid = document.getElementById("dispCalendarioGrid");
    const titulo = document.getElementById("dispCalendarioTitulo");
    if (!grid || !titulo) return;

    titulo.textContent = `${MESES[this.displayMonth]} ${this.displayYear}`;

    const firstDay = new Date(this.displayYear, this.displayMonth, 1).getDay();
    const daysInMonth = new Date(this.displayYear, this.displayMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = "";

    for (let i = 0; i < firstDay; i++) {
      html += `<span class="calendario-dia vacio"></span>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(this.displayYear, this.displayMonth, d);
      const iso = `${this.displayYear}-${String(this.displayMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isSunday = date.getDay() === 0;
      const isPast = date < today;
      const isSelected = this.selectedDate === iso;
      const bloqueosDia = this.getBloqueosFecha(iso);
      const isDiaCompleto = bloqueosDia.some((b) => b.hora === null);
      const tieneBloqueosParciales = bloqueosDia.length > 0 && !isDiaCompleto;
      const reservasDia = this.getReservasFecha(iso);
      const tieneReservas = reservasDia.length > 0;

      let classes = "calendario-dia";
      if (isPast) classes += " pasado";
      if (isSunday) classes += " domingo";
      if (isSelected) classes += " seleccionado";
      if (isDiaCompleto) classes += " bloqueado-completo";
      if (tieneBloqueosParciales) classes += " bloqueado-parcial";
      if (tieneReservas && !isDiaCompleto) classes += " tiene-reservas";
      if (isPast) classes += " deshabilitado";

      html += `<span class="${classes}" data-fecha="${iso}">${d}</span>`;
    }

    grid.innerHTML = html;
  },

  // ===== Panel lateral =====

  onDayClick(e) {
    const target = e.target.closest(".calendario-dia");
    if (!target || target.classList.contains("vacio") || target.classList.contains("deshabilitado")) return;

    const fecha = target.dataset.fecha;
    if (!fecha) return;

    this.selectedDate = fecha;
    this.renderCalendar();
    this.renderPanel();
  },

  renderPanel() {
    const panel = document.getElementById("dispPanel");
    if (!panel || !this.selectedDate) return;

    const [y, m, d] = this.selectedDate.split("-");
    const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
    const nombreDia = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][dateObj.getDay()];
    const fechaLabel = `${nombreDia} ${Number(d)} de ${MESES[Number(m) - 1]}, ${y}`;

    const bloqueosDia = this.getBloqueosFecha(this.selectedDate);
    const isDiaCompleto = bloqueosDia.some((b) => b.hora === null);
    const horasBloqueadas = new Set(
      bloqueosDia.filter((b) => b.hora !== null).map((b) => b.hora.substring(0, 5))
    );

    // Reservas de clientes para este día
    const reservasDia = this.getReservasFecha(this.selectedDate);
    const horasReservadas = new Map();
    reservasDia.forEach((r) => {
      const h = r.hora_agendada ? String(r.hora_agendada).substring(0, 5) : null;
      if (h) horasReservadas.set(h, r);
    });

    let html = `
      <div class="disp-panel-header">
        <h4><i class="fas fa-calendar-day"></i> ${fechaLabel}</h4>
      </div>
    `;

    if (isDiaCompleto) {
      const bloqueo = bloqueosDia.find((b) => b.hora === null);
      html += `
        <div class="disp-estado-dia bloqueado">
          <i class="fas fa-ban"></i> <strong>Día completo bloqueado</strong>
          ${bloqueo.motivo ? `<p class="disp-motivo">${bloqueo.motivo}</p>` : ""}
          <button class="btn btn-sm btn-desbloquear-dia" data-id="${bloqueo.id}" title="Desbloquear día">
            <i class="fas fa-unlock"></i> Desbloquear día
          </button>
        </div>
      `;
    } else {
      html += `
        <div class="disp-bloquear-dia">
          <div class="disp-motivo-grupo">
            <input type="text" id="dispMotivo" placeholder="Motivo (opcional)" class="disp-input-motivo">
          </div>
          <button class="btn btn-primary btn-sm btn-bloquear-dia-completo">
            <i class="fas fa-ban"></i> Bloquear día completo
          </button>
        </div>

        <div class="disp-horas-titulo">
          <span>Horarios del día:</span>
        </div>

        <div class="disp-horas-grid">
          ${HORAS_TALLER.map((hora) => {
            const estaBloqueada = horasBloqueadas.has(hora);
            const reserva = horasReservadas.get(hora);
            const bloqueo = estaBloqueada
              ? bloqueosDia.find((b) => b.hora && b.hora.substring(0, 5) === hora)
              : null;

            // Hora bloqueada por el dueño
            if (estaBloqueada) {
              return `
                <div class="disp-hora-item bloqueada">
                  <span class="disp-hora-label">${hora}</span>
                  <span class="disp-hora-estado"><i class="fas fa-lock"></i> Bloqueada</span>
                  <button class="btn btn-sm btn-desbloquear-hora" data-id="${bloqueo.id}" title="Desbloquear">
                    <i class="fas fa-unlock"></i>
                  </button>
                </div>
              `;
            }

            // Hora reservada por un cliente
            if (reserva) {
              return `
                <div class="disp-hora-item reservada">
                  <span class="disp-hora-label">${hora}</span>
                  <span class="disp-hora-estado disp-hora-cliente">
                    <i class="fas fa-user"></i> ${reserva.nombre || "Cliente"}
                  </span>
                  <button class="btn btn-sm btn-liberar-reserva" data-id="${reserva.id}" title="Liberar esta hora (cancelar reserva del cliente)">
                    <i class="fas fa-calendar-plus"></i> Liberar
                  </button>
                </div>
              `;
            }

            // Hora libre
            return `
              <div class="disp-hora-item disponible">
                <span class="disp-hora-label">${hora}</span>
                <span class="disp-hora-estado"><i class="fas fa-check"></i> Libre</span>
                <button class="btn btn-sm btn-bloquear-hora" data-fecha="${this.selectedDate}" data-hora="${hora}" title="Bloquear hora">
                  <i class="fas fa-lock"></i>
                </button>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    // Mostrar listado de reservas del día si las hay
    if (reservasDia.length > 0 && !isDiaCompleto) {
      html += `
        <div class="disp-reservas-dia">
          <div class="disp-horas-titulo"><span><i class="fas fa-users"></i> Reservas del día (${reservasDia.length}):</span></div>
          ${reservasDia.map((r) => {
            const h = r.hora_agendada ? String(r.hora_agendada).substring(0, 5) : "--";
            return `
              <div class="disp-reserva-detalle">
                <span class="disp-reserva-hora">${h}</span>
                <span class="disp-reserva-nombre">${r.nombre || "Sin nombre"}</span>
                <span class="disp-reserva-tel">${r.telefono || ""}</span>
                <span class="disp-reserva-servicio">${r.servicio || r.mensaje || ""}</span>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    panel.innerHTML = html;
  },

  // ===== Eventos del panel =====

  async onPanelClick(e) {
    const target = e.target.closest("button");
    if (!target) return;

    if (target.classList.contains("btn-bloquear-dia-completo")) {
      await this.bloquearDiaCompleto();
    } else if (target.classList.contains("btn-bloquear-hora")) {
      const fecha = target.dataset.fecha;
      const hora = target.dataset.hora;
      if (fecha && hora) await this.bloquearHora(fecha, hora);
    } else if (target.classList.contains("btn-desbloquear-dia") || target.classList.contains("btn-desbloquear-hora")) {
      const id = Number(target.dataset.id);
      if (id) await this.eliminarBloqueo(id);
    } else if (target.classList.contains("btn-liberar-reserva")) {
      const id = Number(target.dataset.id);
      if (id) await this.liberarReserva(id);
    }
  },

  async onResumenClick(e) {
    const target = e.target.closest(".btn-eliminar-bloqueo");
    if (!target) return;
    const id = Number(target.dataset.id);
    if (id) await this.eliminarBloqueo(id);
  },

  // ===== Operaciones CRUD con Supabase =====

  async cargarBloqueos() {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const today = new Date();
      const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      // Cargar bloqueos del dueño
      const { data, error } = await supabase
        .from("bloqueos_horario")
        .select("*")
        .gte("fecha", todayIso)
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true });

      if (error) throw error;
      this.bloqueos = data || [];

      // Cargar reservas de clientes (solicitudes con fecha agendada)
      const { data: reservas, error: errRes } = await supabase
        .from("solicitudes_publicas")
        .select("*")
        .eq("tipo", "atencion")
        .not("fecha_agendada", "is", null)
        .gte("fecha_agendada", todayIso)
        .order("fecha_agendada", { ascending: true });

      if (!errRes) {
        this.reservas = reservas || [];
      }

      this.renderCalendar();
      this.renderResumen();
      if (this.selectedDate) this.renderPanel();
    } catch (err) {
      console.error("Error al cargar bloqueos:", err);
    }
  },

  async bloquearDiaCompleto() {
    if (!this.selectedDate) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const motivoInput = document.getElementById("dispMotivo");
    const motivo = motivoInput ? motivoInput.value.trim() : "";

    try {
      // Eliminar bloqueos parciales existentes de ese día
      await supabase
        .from("bloqueos_horario")
        .delete()
        .eq("fecha", this.selectedDate);

      // Insertar bloqueo de día completo (hora = null)
      const { error } = await supabase
        .from("bloqueos_horario")
        .insert({ fecha: this.selectedDate, hora: null, motivo: motivo || null });

      if (error) throw error;

      await this.cargarBloqueos();
    } catch (err) {
      console.error("Error al bloquear día:", err);
      alert("No se pudo bloquear el día. Intente de nuevo.");
    }
  },

  async bloquearHora(fecha, hora) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from("bloqueos_horario")
        .insert({ fecha, hora: `${hora}:00`, motivo: null });

      if (error) throw error;

      await this.cargarBloqueos();
    } catch (err) {
      console.error("Error al bloquear hora:", err);
      alert("No se pudo bloquear la hora. Intente de nuevo.");
    }
  },

  async eliminarBloqueo(id) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from("bloqueos_horario")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await this.cargarBloqueos();
    } catch (err) {
      console.error("Error al eliminar bloqueo:", err);
      alert("No se pudo eliminar el bloqueo.");
    }
  },

  async liberarReserva(id) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    if (!confirm("¿Liberar esta hora? Se eliminará la fecha y hora agendada de la solicitud del cliente.")) return;

    try {
      const { error } = await supabase
        .from("solicitudes_publicas")
        .update({ fecha_agendada: null, hora_agendada: null })
        .eq("id", id);

      if (error) throw error;

      await this.cargarBloqueos();
    } catch (err) {
      console.error("Error al liberar reserva:", err);
      alert("No se pudo liberar la hora.");
    }
  },

  // ===== Helpers =====

  getBloqueosFecha(fecha) {
    return this.bloqueos.filter((b) => b.fecha === fecha);
  },

  getReservasFecha(fecha) {
    return this.reservas.filter((r) => {
      const f = r.fecha_agendada ? String(r.fecha_agendada).substring(0, 10) : "";
      return f === fecha;
    });
  },

  renderResumen() {
    const container = document.getElementById("dispResumenBody");
    if (!container) return;

    if (this.bloqueos.length === 0) {
      container.innerHTML = `<p class="disp-sin-bloqueos">No hay bloqueos activos. Todos los horarios están disponibles.</p>`;
      return;
    }

    // Agrupar por fecha
    const porFecha = {};
    this.bloqueos.forEach((b) => {
      if (!porFecha[b.fecha]) porFecha[b.fecha] = [];
      porFecha[b.fecha].push(b);
    });

    let html = '<div class="disp-resumen-lista">';

    Object.keys(porFecha)
      .sort()
      .forEach((fecha) => {
        const items = porFecha[fecha];
        const [y, m, d] = fecha.split("-");
        const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
        const nombreDia = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][dateObj.getDay()];
        const fechaLabel = `${nombreDia} ${Number(d)} de ${MESES[Number(m) - 1]}`;
        const isDiaCompleto = items.some((b) => b.hora === null);

        html += `<div class="disp-resumen-item">`;
        html += `<div class="disp-resumen-fecha"><i class="fas fa-calendar"></i> ${fechaLabel}</div>`;

        if (isDiaCompleto) {
          const bloqueo = items.find((b) => b.hora === null);
          html += `<div class="disp-resumen-detalle">
            <span class="badge estado-cancelada"><i class="fas fa-ban"></i> Día completo</span>
            ${bloqueo.motivo ? `<span class="disp-resumen-motivo">${bloqueo.motivo}</span>` : ""}
            <button class="btn btn-sm btn-eliminar-bloqueo" data-id="${bloqueo.id}" title="Eliminar">
              <i class="fas fa-trash"></i>
            </button>
          </div>`;
        } else {
          const horas = items
            .filter((b) => b.hora !== null)
            .map((b) => `
              <span class="disp-resumen-hora">
                ${b.hora.substring(0, 5)}
                <button class="btn btn-sm btn-eliminar-bloqueo" data-id="${b.id}" title="Eliminar">
                  <i class="fas fa-times"></i>
                </button>
              </span>
            `)
            .join("");
          html += `<div class="disp-resumen-detalle"><span class="badge estado-en_proceso"><i class="fas fa-clock"></i> Horas:</span> ${horas}</div>`;
        }

        html += `</div>`;
      });

    html += "</div>";
    container.innerHTML = html;
  },

  destroy() {
    // Limpiar referencias
    this.bloqueos = [];
    this.reservas = [];
    this.selectedDate = null;
  },
};

export default DisponibilidadModule;
