/**
 * PUBLICO ATENCION - Solicitud de atención para clientes
 */

import { getSupabaseClient } from "../supabase-client.js";

const PublicoAtencionModule = {
  name: "publico-atencion",

  render() {
    return `
      <div class="publico-form-container">
        <h2>Solicitar Atención</h2>
        <p>Completa este formulario y te contactaremos para agendar una revisión.</p>

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

          <div class="form-group">
            <label>Mensaje *</label>
            <textarea name="mensaje" rows="4" placeholder="Cuéntanos qué necesita tu vehículo" required></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-lg">Enviar Solicitud</button>
        </form>

        <div id="mensajeAtencion" class="mensaje" style="display: none;"></div>
      </div>
    `;
  },

  init() {
    const form = document.getElementById("formAtencionPublica");
    if (form) {
      form.addEventListener("submit", this.onSubmit);
    }
  },

  async onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const mensaje = document.getElementById("mensajeAtencion");

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
        mensaje.textContent = `Solicitud enviada correctamente. Folio #${data?.id ?? "N/A"}`;
        mensaje.style.display = "block";
      }

      event.target.reset();
    } catch (err) {
      if (mensaje) {
        mensaje.textContent = `No se pudo enviar la solicitud: ${err.message}`;
        mensaje.style.display = "block";
      }
    }
  },

  destroy() {
    const form = document.getElementById("formAtencionPublica");
    if (form) {
      form.removeEventListener("submit", this.onSubmit);
    }
  },
};

export default PublicoAtencionModule;
