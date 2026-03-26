/**
 * PUBLICO ATENCION - Solicitud de atención para clientes
 * Incluye calendario visual para agendar día de atención
 */

import { getSupabaseClient } from "../supabase-client.js";

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const HORAS_RESERVA = Array.from(
  { length: 10 },
  (_, index) => `${String(index + 9).padStart(2, "0")}:00`,
);
const ANIO_ACTUAL = new Date().getFullYear();
const ANIOS_VEHICULO = Array.from({ length: ANIO_ACTUAL - 1979 }, (_, index) =>
  String(ANIO_ACTUAL - index),
);
const MARCAS_VEHICULO = [
  "Toyota",
  "Chevrolet",
  "Ford",
  "Nissan",
  "Hyundai",
  "Kia",
  "Mazda",
  "Volkswagen",
  "Mitsubishi",
  "Subaru",
  "Honda",
  "Suzuki",
  "Peugeot",
  "Renault",
  "Citroën",
  "Fiat",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volvo",
  "Jeep",
  "Chery",
  "Great Wall",
  "Mahindra",
  "BYD",
  "Otro",
];
const MODELOS_POR_MARCA = {
  Toyota: ["Corolla", "Yaris", "Hilux", "RAV4", "Fortuner"],
  Chevrolet: ["Sail", "Spark", "Onix", "Tracker", "D-Max"],
  Ford: ["Fiesta", "Focus", "Ranger", "Escape", "Explorer"],
  Nissan: ["Versa", "Sentra", "Qashqai", "X-Trail", "Navara"],
  Hyundai: ["i10", "Accent", "Elantra", "Tucson", "Santa Fe"],
  Kia: ["Morning", "Rio", "Cerato", "Seltos", "Sportage"],
  Mazda: ["Mazda2", "Mazda3", "CX-3", "CX-5", "BT-50"],
  Volkswagen: ["Gol", "Polo", "Virtus", "T-Cross", "Amarok"],
  Mitsubishi: ["Lancer", "ASX", "Outlander", "Montero", "L200"],
  Subaru: ["Impreza", "Legacy", "XV", "Forester", "Outback"],
  Honda: ["Fit", "City", "Civic", "CR-V", "Pilot"],
  Suzuki: ["Alto", "Swift", "Baleno", "Vitara", "Jimny"],
  Peugeot: ["208", "2008", "308", "3008", "Partner"],
  Renault: ["Kwid", "Sandero", "Logan", "Duster", "Oroch"],
  Citroën: ["C3", "C4", "C-Elysée", "Berlingo", "Aircross"],
  Fiat: ["Mobi", "Argo", "Cronos", "Pulse", "Strada"],
  BMW: ["Serie 1", "Serie 3", "X1", "X3", "X5"],
  "Mercedes-Benz": ["Clase A", "Clase C", "GLA", "GLC", "Sprinter"],
  Audi: ["A1", "A3", "A4", "Q3", "Q5"],
  Volvo: ["S60", "S90", "XC40", "XC60", "XC90"],
  Jeep: ["Renegade", "Compass", "Cherokee", "Wrangler", "Gladiator"],
  Chery: ["Tiggo 2", "Tiggo 4", "Tiggo 7", "Tiggo 8", "Arrizo 5"],
  "Great Wall": ["Poer", "Wingle 7", "Haval H2", "Haval H6", "Haval Jolion"],
  Mahindra: ["Scorpio", "XUV500", "XUV700", "Pik Up", "KUV100"],
  BYD: ["Dolphin", "Yuan Plus", "Han", "Tang", "Seal"],
  Otro: ["Otro"],
};

const PublicoAtencionModule = {
  name: "publico-atencion",
  selectedDate: null,
  selectedTime: null,
  displayMonth: null,
  displayYear: null,
  bookedSlots: new Map(),

  normalizeDateValue(value) {
    const raw = String(value || "").trim();
    const match = raw.match(/^(\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : "";
  },

  normalizeTimeValue(value) {
    const raw = String(value || "").trim();
    const match = raw.match(/^(\d{2}:\d{2})/);
    return match ? match[1] : "";
  },

  getDateLabel(dateValue) {
    const normalizedDate = this.normalizeDateValue(dateValue);
    if (!normalizedDate) return "";

    const [year, month, day] = normalizedDate.split("-");
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    const nombreDia = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ][dateObj.getDay()];

    return `${nombreDia} ${day} de ${MESES[Number(month) - 1]}, ${year}`;
  },

  getBookedHoursForDate(dateValue) {
    return this.bookedSlots.get(dateValue) || new Set();
  },

  registerBookedSlot(dateValue, timeValue) {
    const normalizedDate = this.normalizeDateValue(dateValue);
    if (!normalizedDate) return;

    const bookedHours = new Set(this.getBookedHoursForDate(normalizedDate));
    const normalizedTime = this.normalizeTimeValue(timeValue);

    if (normalizedTime) {
      bookedHours.add(normalizedTime);
    } else {
      HORAS_RESERVA.forEach((hour) => bookedHours.add(hour));
    }

    this.bookedSlots.set(normalizedDate, bookedHours);
  },

  isTimeSlotPast(dateValue, timeValue) {
    const normalizedDate = this.normalizeDateValue(dateValue);
    const normalizedTime = this.normalizeTimeValue(timeValue);
    if (!normalizedDate || !normalizedTime) return false;

    const [year, month, day] = normalizedDate.split("-").map(Number);
    const [hours, minutes] = normalizedTime.split(":").map(Number);
    const slotDate = new Date(year, month - 1, day, hours, minutes, 0, 0);

    return slotDate <= new Date();
  },

  isDateFullyBooked(dateValue) {
    const normalizedDate = this.normalizeDateValue(dateValue);
    if (!normalizedDate) return false;

    return HORAS_RESERVA.every(
      (hour) =>
        this.getBookedHoursForDate(normalizedDate).has(hour) ||
        this.isTimeSlotPast(normalizedDate, hour),
    );
  },

  updateSelectionText() {
    const texto = document.getElementById("fechaSeleccionadaTexto");
    if (!texto) return;

    if (!this.selectedDate) {
      texto.textContent = "Ningún día seleccionado";
      texto.classList.remove("activo");
      return;
    }

    const dateLabel = this.getDateLabel(this.selectedDate);
    if (!this.selectedTime) {
      texto.innerHTML = `<i class="fas fa-calendar-check"></i> Día seleccionado: <strong>${dateLabel}</strong>. Ahora elige una hora.`;
      texto.classList.add("activo");
      return;
    }

    texto.innerHTML = `<i class="fas fa-check-circle"></i> Reserva seleccionada: <strong>${dateLabel}</strong> a las <strong>${this.selectedTime} hrs</strong>`;
    texto.classList.add("activo");
  },

  updateModelOptions(selectedMarca) {
    const selectModelo = document.getElementById("atencionModelo");
    if (!selectModelo) return;

    const modelos = MODELOS_POR_MARCA[selectedMarca] || [];
    const baseOption = '<option value="">Seleccione modelo</option>';
    const modelOptions = modelos
      .map((modelo) => `<option value="${modelo}">${modelo}</option>`)
      .join("");

    selectModelo.innerHTML = `${baseOption}${modelOptions}`;
  },

  onBrandChange(e) {
    const marca = e.target?.value || "";
    this.updateModelOptions(marca);
  },

  render() {
    const today = new Date();
    this.displayMonth = today.getMonth();
    this.displayYear = today.getFullYear();
    this.selectedDate = null;
    this.selectedTime = null;
    this.bookedSlots = new Map();

    return `
      <div class="publico-form-container">
        <h2><i class="fas fa-headset"></i> Solicitar Atención</h2>
        <p>Completa este formulario y selecciona un día en el calendario para agendar tu visita. Tu vehículo tiene algún problema? No te preocupes, estamos aquí para ayudarte. Contacta con nosotros para recibir asesoramiento experto y resolver tus dudas mecánicas 🚗💨</p>

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
            <label>Marca del Vehículo *</label>
            <select name="marca" id="atencionMarca" required>
              <option value="">Seleccione una marca</option>
              ${MARCAS_VEHICULO.map((marca) => `<option value="${marca}">${marca}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label>Modelo del Vehículo *</label>
            <select name="modelo" id="atencionModelo" required>
              <option value="">Seleccione modelo</option>
            </select>
          </div>

          <div class="form-group">
            <label>Año del Vehículo *</label>
            <select name="anio" id="atencionAnio" required>
              <option value="">Seleccione año</option>
              ${ANIOS_VEHICULO.map((anio) => `<option value="${anio}">${anio}</option>`).join("")}
            </select>
          </div>

          <div class="form-group">
            <label>Servicio requerido *</label>
            <select name="servicio" required>
              <option value="">Seleccione un servicio</option>
              <option value="mantencion">Mantención</option>
              <option value="suspencion">Suspensión</option>
              <option value="frenos">Revisión de frenos</option>
              <option value="motor">Diagnóstico de motor</option>
              <option value="scaner">Scaner</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <!-- Calendario visual -->
          <div class="form-group">
            <label><i class="fas fa-calendar-alt"></i> Selecciona el día para tu atención *</label>
            <div class="agenda-selector">
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

              <div class="horarios-widget">
                <div class="horarios-header">
                  <span><i class="fas fa-clock"></i> Reserva de Hora</span>
                  <small>09:00 a 18:00 hrs</small>
                </div>
                <div class="horarios-grid" id="horariosGrid"></div>
                <p id="horariosAyuda" class="horarios-ayuda">Selecciona un día para ver horarios disponibles.</p>
              </div>
            </div>
            <input type="hidden" name="fecha_agendada" id="fechaAgendadaInput" required>
            <input type="hidden" name="hora_agendada" id="horaAgendadaInput" required>
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
    const daysInMonth = new Date(
      this.displayYear,
      this.displayMonth + 1,
      0,
    ).getDate();
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
      const isBooked = this.isDateFullyBooked(iso);
      const isToday = date.getTime() === today.getTime();
      const isSelected = this.selectedDate === iso;

      let classes = "calendario-dia";
      if (isPast) classes += " pasado";
      if (isSunday) classes += " domingo";
      if (isToday) classes += " hoy";
      if (isBooked) classes += " ocupado";
      if (isSelected) classes += " seleccionado";
      if (isPast || isSunday || isBooked) classes += " deshabilitado";

      html += `<span class="${classes}" data-fecha="${iso}" title="${isPast ? "Fecha pasada" : isSunday ? "Domingo - cerrado" : isBooked ? "Día ya reservado" : iso}">${d}</span>`;
    }

    grid.innerHTML = html;
  },

  renderTimeSlots() {
    const grid = document.getElementById("horariosGrid");
    const helpText = document.getElementById("horariosAyuda");
    if (!grid || !helpText) return;

    if (!this.selectedDate) {
      grid.innerHTML = "";
      helpText.textContent = "Selecciona un día para ver horarios disponibles.";
      return;
    }

    const bookedHours = this.getBookedHoursForDate(this.selectedDate);

    grid.innerHTML = HORAS_RESERVA.map((hour) => {
      const isBooked = bookedHours.has(hour);
      const isPast = this.isTimeSlotPast(this.selectedDate, hour);
      const isSelected = this.selectedTime === hour;
      const classes = ["horario-slot"];

      if (isBooked) classes.push("ocupado");
      if (isPast) classes.push("pasado");
      if (isSelected) classes.push("seleccionado");

      const disabled = isBooked || isPast ? "disabled" : "";
      const title = isBooked
        ? "Hora reservada"
        : isPast
          ? "Hora ya pasada"
          : `Reservar ${hour}`;

      return `<button type="button" class="${classes.join(" ")}" data-hora="${hour}" ${disabled} title="${title}">${hour}</button>`;
    }).join("");

    const availableCount = HORAS_RESERVA.filter(
      (hour) =>
        !bookedHours.has(hour) && !this.isTimeSlotPast(this.selectedDate, hour),
    ).length;

    helpText.textContent =
      availableCount > 0
        ? `${availableCount} horario(s) disponible(s) para ${this.getDateLabel(this.selectedDate)}.`
        : `No quedan horarios disponibles para ${this.getDateLabel(this.selectedDate)}.`;
  },

  /** Carga fechas ya utilizadas para deshabilitarlas en el calendario */
  async loadBookedDates() {
    try {
      const client = getSupabaseClient();
      if (!client) return;

      const today = new Date();
      const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

      const { data, error } = await client
        .from("solicitudes_publicas")
        .select("*")
        .eq("tipo", "atencion")
        .not("fecha_agendada", "is", null)
        .gte("fecha_agendada", todayIso);

      if (error) throw error;

      this.bookedSlots = new Map();

      (data ?? []).forEach((item) => {
        this.registerBookedSlot(item.fecha_agendada, item.hora_agendada);
      });

      this.renderCalendar();
      this.renderTimeSlots();
    } catch (err) {
      console.error("No se pudieron cargar fechas reservadas:", err);
    }
  },

  /** Maneja el click en un día del calendario */
  onDayClick(e) {
    const target = e.target.closest(".calendario-dia");
    if (
      !target ||
      target.classList.contains("deshabilitado") ||
      target.classList.contains("vacio")
    )
      return;

    const fecha = target.dataset.fecha;
    if (!fecha) return;

    this.selectedDate = fecha;
    this.selectedTime = null;

    // Actualizar input oculto
    const fechaInput = document.getElementById("fechaAgendadaInput");
    const horaInput = document.getElementById("horaAgendadaInput");
    if (fechaInput) fechaInput.value = fecha;
    if (horaInput) horaInput.value = "";

    this.renderCalendar();
    this.renderTimeSlots();
    this.updateSelectionText();
  },

  onTimeClick(e) {
    const target = e.target.closest(".horario-slot");
    if (!target || target.disabled) return;

    const hora = this.normalizeTimeValue(target.dataset.hora);
    if (!hora || !this.selectedDate) return;

    this.selectedTime = hora;

    const horaInput = document.getElementById("horaAgendadaInput");
    if (horaInput) horaInput.value = hora;

    this.renderTimeSlots();
    this.updateSelectionText();
  },

  init() {
    const form = document.getElementById("formAtencionPublica");
    const marcaSelect = document.getElementById("atencionMarca");

    this.onBrandChangeBound = (e) => this.onBrandChange(e);

    if (form) {
      form.addEventListener("submit", (e) => this.onSubmit(e));
    }

    if (marcaSelect) {
      marcaSelect.addEventListener("change", this.onBrandChangeBound);
      this.updateModelOptions(marcaSelect.value || "");
    }

    // Renderizar calendario
    this.renderCalendar();
    this.renderTimeSlots();
    this.loadBookedDates();

    // Navegación meses
    const btnPrev = document.getElementById("btnMesAnterior");
    const btnNext = document.getElementById("btnMesSiguiente");

    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        const today = new Date();
        // No retroceder antes del mes actual
        if (
          this.displayYear > today.getFullYear() ||
          (this.displayYear === today.getFullYear() &&
            this.displayMonth > today.getMonth())
        ) {
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
    const horariosGrid = document.getElementById("horariosGrid");
    if (grid) {
      grid.addEventListener("click", (e) => this.onDayClick(e));
    }

    if (horariosGrid) {
      horariosGrid.addEventListener("click", (e) => this.onTimeClick(e));
    }
  },

  async onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const mensaje = document.getElementById("mensajeAtencion");

    // Validar que se haya seleccionado fecha
    const fechaAgendada = formData.get("fecha_agendada");
    const horaAgendada = this.normalizeTimeValue(formData.get("hora_agendada"));
    if (!fechaAgendada) {
      if (mensaje) {
        mensaje.textContent = "Por favor selecciona un día en el calendario.";
        mensaje.className = "mensaje mensaje-error";
        mensaje.style.display = "block";
      }
      document
        .getElementById("calendarioWidget")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!horaAgendada) {
      if (mensaje) {
        mensaje.textContent =
          "Por favor selecciona una hora disponible para la reserva.";
        mensaje.className = "mensaje mensaje-error";
        mensaje.style.display = "block";
      }
      document
        .getElementById("horariosGrid")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
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
        marca: formData.get("marca") || null,
        modelo: formData.get("modelo") || null,
        anio: Number(formData.get("anio")) || null,
        servicio: formData.get("servicio"),
        mensaje: formData.get("mensaje"),
        fecha_agendada: fechaAgendada,
        hora_agendada: horaAgendada,
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
        mensaje.innerHTML = `<i class="fas fa-check-circle"></i> Solicitud enviada correctamente. Folio <strong>#${data?.id ?? "N/A"}</strong> — Agendado para el <strong>${d}/${m}/${y}</strong> a las <strong>${horaAgendada} hrs</strong>`;
        mensaje.className = "mensaje mensaje-exito";
        mensaje.style.display = "block";
      }

      event.target.reset();
      this.updateModelOptions("");
      this.registerBookedSlot(fechaAgendada, horaAgendada);
      this.selectedDate = null;
      this.selectedTime = null;
      const horaInput = document.getElementById("horaAgendadaInput");
      if (horaInput) horaInput.value = "";
      this.renderCalendar();
      this.renderTimeSlots();
      this.updateSelectionText();
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
    const marcaSelect = document.getElementById("atencionMarca");

    if (marcaSelect && this.onBrandChangeBound) {
      marcaSelect.removeEventListener("change", this.onBrandChangeBound);
    }

    if (form) {
      form.replaceWith(form.cloneNode(true));
    }
  },
};

export default PublicoAtencionModule;
