/**
 * PUBLICO ATENCION - Solicitud de atención para clientes
 * Incluye calendario visual para agendar día de atención
 */

import { getSupabaseClient } from "../supabase-client.js";

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const PublicoAtencionModule = {
  name: "publico-atencion",
  selectedDate: null,
  displayMonth: null,
  displayYear: null,

  render() {
    const today = new Date();
    this.displayMonth = today.getMonth();
    this.displayYear = today.getFullYear();
    this.selectedDate = null;

    return `
      <div class="publico-form-container">
        <h2><i class="fas fa-headset"></i> Solicitar Atención</h2>
        <p>Completa este formulario y selecciona un día en el calendario para agendar tu visita.</p>

        <form id="formAtencionPublica" class="reserva-form">
          <div class="form-group">
            <label>Nombre Completo *</label>
            <input type="text" name="nombre" placeholder="Nombre completo" required>
          </div>

          <div class="form-group">
            <label>Teléfono *</label>
            <input type="tel" name="telefono" placeholder="Teléfono" required>
          </div>

          <div class="form-group">
            <label>Email *</label>
            <input type="email" name="email" placeholder="Email" required>
          </div>

          <div class="form-group">
            <label>Patente</label>
            <input type="text" name="patente" placeholder="Patente">
          </div>

          <div class="form-group">
            <label>Servicio requerido *</label>
            <select name="servicio" required>
              <option value="">Seleccione un servicio</option>
              <option value="mantencion">Mantención</option>
              <option value="frenos">Revisión de frenos</option>
              <option value="motor">Diagnóstico de motor</option>
              <option value="electrico">Sistema eléctrico</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <!-- Calendario visual -->
          <div class="form-group">
            <label><i class="fas fa-calendar-alt"></i> Selecciona el día para tu atención *</label>
            <div class="calendario-widget" id="calendarioWidget">
              <div class="calendario-header">
                <button type="button" id="btnMesAnterior" class="calendario-nav" title="Mes anterior">
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span id="calendarioTitulo" class="calendario-titulo"></span>
                <button type="button" id="btnMesSiguiente" class="calendario-nav" title="Mes siguiente">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
              <div class="calendario-dias-semana">
                ${DIAS_SEMANA.map((d) => `<span>${d}</span>`).join("")}
              </div>
              <div class="calendario-grid" id="calendarioGrid"></div>
            </div>
            <input type="hidden" name="fecha_agendada" id="fechaAgendadaInput" required>
            <p id="fechaSeleccionadaTexto" class="fecha-seleccionada-texto">Ningún día seleccionado</p>
          </div>

          <div class="form-group">
            <label>Mensaje *</label>
            <textarea name="mensaje" rows="4" placeholder="Cuéntanos qué necesita tu vehículo" required></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-lg">
            <i class="fas fa-paper-plane"></i> Enviar Solicitud
          </button>
        </form>

        <div id="mensajeAtencion" class="mensaje" style="display: none;"></div>
      </div>
    `;
  },

  /** Dibuja los días del mes actual en el grid */
  renderCalendar() {
    const grid = document.getElementById("calendarioGrid");
    const titulo = document.getElementById("calendarioTitulo");
    if (!grid || !titulo) return;

    titulo.textContent = `${MESES[this.displayMonth]} ${this.displayYear}`;

    const firstDay = new Date(this.displayYear, this.displayMonth, 1).getDay();
    const daysInMonth = new Date(this.displayYear, this.displayMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = "";

    // Celdas vacías antes del primer día
    for (let i = 0; i < firstDay; i++) {
      html += `<span class="calendario-dia vacio"></span>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(this.displayYear, this.displayMonth, d);
      const iso = `${this.displayYear}-${String(this.displayMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isSunday = date.getDay() === 0;
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isSelected = this.selectedDate === iso;

      let classes = "calendario-dia";
      if (isPast) classes += " pasado";
      if (isSunday) classes += " domingo";
      if (isToday) classes += " hoy";
      if (isSelected) classes += " seleccionado";
      if (isPast || isSunday) classes += " deshabilitado";

      html += `<span class="${classes}" data-fecha="${iso}" title="${isPast ? 'Fecha pasada' : isSunday ? 'Domingo - cerrado' : iso}">${d}</span>`;
    }

    grid.innerHTML = html;
  },

  /** Maneja el click en un día del calendario */
  onDayClick(e) {
    const target = e.target.closest(".calendario-dia");
    if (!target || target.classList.contains("deshabilitado") || target.classList.contains("vacio")) return;

    const fecha = target.dataset.fecha;
    if (!fecha) return;

    this.selectedDate = fecha;

    // Actualizar input oculto
    const input = document.getElementById("fechaAgendadaInput");
    if (input) input.value = fecha;

    // Actualizar texto
    const texto = document.getElementById("fechaSeleccionadaTexto");
    if (texto) {
      const [y, m, d] = fecha.split("-");
      const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
      const nombreDia = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][dateObj.getDay()];
      texto.innerHTML = `<i class="fas fa-check-circle"></i> Día seleccionado: <strong>${nombreDia} ${d} de ${MESES[Number(m) - 1]}, ${y}</strong>`;
      texto.classList.add("activo");
    }

    this.renderCalendar();
  },

  init() {
    const form = document.getElementById("formAtencionPublica");
    if (form) {
      form.addEventListener("submit", (e) => this.onSubmit(e));
    }

    // Renderizar calendario
    this.renderCalendar();

    // Navegación meses
    const btnPrev = document.getElementById("btnMesAnterior");
    const btnNext = document.getElementById("btnMesSiguiente");

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        const today = new Date();
        // No retroceder antes del mes actual
        if (this.displayYear > today.getFullYear() ||
            (this.displayYear === today.getFullYear() && this.displayMonth > today.getMonth())) {
          this.displayMonth--;
          if (this.displayMonth < 0) {
            this.displayMonth = 11;
            this.displayYear--;
          }
          this.renderCalendar();
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", () => {
        // Permitir navegar hasta 3 meses adelante
        const today = new Date();
        const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);
        const next = new Date(this.displayYear, this.displayMonth + 1, 1);
        if (next <= maxDate) {
          this.displayMonth++;
          if (this.displayMonth > 11) {
            this.displayMonth = 0;
            this.displayYear++;
          }
          this.renderCalendar();
        }
      });
    }

    // Click en días
    const grid = document.getElementById("calendarioGrid");
    if (grid) {
      grid.addEventListener("click", (e) => this.onDayClick(e));
    }
  },

  async onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const mensaje = document.getElementById("mensajeAtencion");

    // Validar que se haya seleccionado fecha
    const fechaAgendada = formData.get("fecha_agendada");
    if (!fechaAgendada) {
      if (mensaje) {
        mensaje.textContent = "Por favor selecciona un día en el calendario.";
        mensaje.className = "mensaje mensaje-error";
        mensaje.style.display = "block";
      }
      document.getElementById("calendarioWidget")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error(
          "Supabase no está disponible. Recarga la página e intenta de nuevo",
        );
      }

      const payload = {
        tipo: "atencion",
        nombre: formData.get("nombre"),
        telefono: formData.get("telefono"),
        email: formData.get("email"),
        patente: formData.get("patente") || null,
        servicio: formData.get("servicio"),
        mensaje: formData.get("mensaje"),
        fecha_agendada: fechaAgendada,
      };

      const { data, error } = await client
        .from("solicitudes_publicas")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      if (mensaje) {
        const [y, m, d] = fechaAgendada.split("-");
        mensaje.innerHTML = `<i class="fas fa-check-circle"></i> Solicitud enviada correctamente. Folio <strong>#${data?.id ?? "N/A"}</strong> — Agendado para el <strong>${d}/${m}/${y}</strong>`;
        mensaje.className = "mensaje mensaje-exito";
        mensaje.style.display = "block";
      }

      event.target.reset();
      this.selectedDate = null;
      const texto = document.getElementById("fechaSeleccionadaTexto");
      if (texto) {
        texto.textContent = "Ningún día seleccionado";
        texto.classList.remove("activo");
      }
      this.renderCalendar();
    } catch (err) {
      if (mensaje) {
        mensaje.innerHTML = `<i class="fas fa-exclamation-triangle"></i> No se pudo enviar la solicitud: ${err.message}`;
        mensaje.className = "mensaje mensaje-error";
        mensaje.style.display = "block";
      }
    }
  },

  destroy() {
    const form = document.getElementById("formAtencionPublica");
    if (form) {
      form.replaceWith(form.cloneNode(true));
    }
  },
};

export default PublicoAtencionModule;
