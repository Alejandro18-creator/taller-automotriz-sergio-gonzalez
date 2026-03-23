/**
 * PUBLICO COTIZACIONES - Solicitud de cotización
 */

import { getSupabaseClient } from "../supabase-client.js";

const PublicoCotizacionesModule = {
  name: "publico-cotizaciones",

  render() {
    return `
      <div class="publico-form-container">
        <h2>Solicitar Cotización</h2>
        <p>Completa los datos del vehículo y del servicio para enviar una cotización preliminar.</p>

        <form id="formCotizacionPublica" class="reserva-form">
          <div class="form-group">
            <label>Nombre Completo *</label>
            <input type="text" name="nombre" placeholder="Nombre completo" required>
          </div>

          <div class="form-group">
            <label>Teléfono *</label>
            <input type="tel" name="telefono" placeholder="Teléfono" required>
          </div>

          <div class="form-group">
            <label>Marca *</label>
            <input type="text" name="marca" placeholder="Marca del vehículo" required>
          </div>

          <div class="form-group">
            <label>Modelo *</label>
            <input type="text" name="modelo" placeholder="Modelo del vehículo" required>
          </div>

          <div class="form-group">
            <label>Año</label>
            <input type="number" name="anio" min="1980" max="2100" placeholder="Año del vehículo">
          </div>

          <div class="form-group">
            <label>Trabajo a cotizar *</label>
            <textarea name="trabajo" rows="4" placeholder="Describe el trabajo o problema" required></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-lg">Solicitar Cotización</button>
        </form>

        <div id="mensajeCotizacion" class="mensaje" style="display: none;"></div>
      </div>
    `;
  },

  init() {
    const form = document.getElementById("formCotizacionPublica");
    if (form) {
      form.addEventListener("submit", this.onSubmit);
    }
  },

  async onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const mensaje = document.getElementById("mensajeCotizacion");

    try {
      const client = getSupabaseClient();
      if (!client) {
        throw new Error(
          "Supabase no está disponible. Recarga la página e intenta de nuevo",
        );
      }

      const payload = {
        tipo: "cotizacion",
        nombre: formData.get("nombre"),
        telefono: formData.get("telefono"),
        marca: formData.get("marca"),
        modelo: formData.get("modelo"),
        anio: formData.get("anio") || null,
        trabajo: formData.get("trabajo"),
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
        mensaje.textContent = `Cotización solicitada correctamente. Folio #${data?.id ?? "N/A"}`;
        mensaje.style.display = "block";
      }

      event.target.reset();
    } catch (err) {
      if (mensaje) {
        mensaje.textContent = `No se pudo enviar la cotización: ${err.message}`;
        mensaje.style.display = "block";
      }
    }
  },

  destroy() {
    const form = document.getElementById("formCotizacionPublica");
    if (form) {
      form.removeEventListener("submit", this.onSubmit);
    }
  },
};

export default PublicoCotizacionesModule;
