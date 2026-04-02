import { getSupabaseClient } from "../supabase-client.js";

const DiagnosticoModule = {
  name: "diagnostico",
  render() {
    return `
      <div class="diagnostico-container">
        <h2>Recepción y Diagnóstico</h2>
        <form id="buscadorOrdenes" class="diagnostico-buscador">
          <input type="text" id="busquedaOrden" placeholder="Buscar por nombre o patente..." autocomplete="off" />
          <button type="submit" class="btn btn-primary"><i class="fas fa-search"></i> Buscar</button>
        </form>
        <div id="resultadosDiagnostico"></div>
      </div>
    `;
  },
  init() {
    const form = document.getElementById("buscadorOrdenes");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.buscarOrden();
      });
    }
  },
  async buscarOrden() {
    const query = document
      .getElementById("busquedaOrden")
      .value.trim()
      .toLowerCase();
    const resultadosDiv = document.getElementById("resultadosDiagnostico");
    resultadosDiv.innerHTML = "<p>Buscando...</p>";
    if (!query) {
      resultadosDiv.innerHTML =
        "<p>Ingresa un nombre o patente para buscar.</p>";
      return;
    }
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("solicitudes_publicas")
      .select("*")
      .or(`nombre.ilike.%${query}%,patente.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(10);
    if (error || !data || data.length === 0) {
      resultadosDiv.innerHTML = "<p>No se encontraron órdenes.</p>";
      return;
    }
    resultadosDiv.innerHTML = data
      .map(
        (orden) => `
      <div class="diagnostico-orden-card">
        <h3>Orden #${orden.id} - ${orden.nombre} (${orden.patente || "Sin patente"})</h3>
        <p><b>Vehículo:</b> ${orden.marca || ""} ${orden.modelo || ""}</p>
        <p><b>Servicio:</b> ${orden.servicio || orden.trabajo || orden.mensaje || "-"}</p>
        <p><b>Estado:</b> ${orden.estado}</p>
        <button class="btn btn-secondary" onclick="window.mostrarDiagnosticoForm && window.mostrarDiagnosticoForm(${orden.id})">Recepción y Diagnóstico</button>
        <div id="diagnosticoForm${orden.id}"></div>
      </div>
    `,
      )
      .join("");
    // Exponer función global para mostrar el formulario
    window.mostrarDiagnosticoForm = async (ordenId) => {
      const formDiv = document.getElementById(`diagnosticoForm${ordenId}`);
      if (!formDiv) return;
      formDiv.innerHTML = `
        <form class="diagnostico-formulario" onsubmit="window.guardarDiagnostico && window.guardarDiagnostico(event, ${ordenId})">
          <label>Fecha y hora de llegada:<br><input type="datetime-local" name="fecha_llegada" required></label><br>
          <label>Revisiones realizadas:<br><textarea name="revisiones" rows="2" placeholder="Ej: Revisión de frenos, cambio de aceite..." required></textarea></label><br>
          <label>Problemas encontrados:<br><textarea name="problemas" rows="2" placeholder="Ej: Pastillas gastadas, fuga de aceite..." required></textarea></label><br>
          <label>Observaciones:<br><textarea name="observaciones" rows="2" placeholder="Observaciones adicionales"></textarea></label><br>
          <button type="submit" class="btn btn-primary">Guardar Diagnóstico</button>
        </form>
        <div id="historialDiagnostico${ordenId}"></div>
      `;
      // Mostrar historial
      window.cargarHistorialDiagnostico &&
        window.cargarHistorialDiagnostico(ordenId);
    };
    // Exponer función global para guardar diagnóstico
    window.guardarDiagnostico = async (e, ordenId) => {
      e.preventDefault();
      const form = e.target;
      const datos = {
        orden_id: ordenId,
        fecha_llegada: form.fecha_llegada.value,
        revisiones: form.revisiones.value,
        problemas: form.problemas.value,
        observaciones: form.observaciones.value,
      };
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("diagnosticos").insert([datos]);
      if (error) {
        alert("Error al guardar diagnóstico");
        return;
      }
      alert("Diagnóstico guardado correctamente");
      window.cargarHistorialDiagnostico &&
        window.cargarHistorialDiagnostico(ordenId);
    };
    // Exponer función global para cargar historial
    window.cargarHistorialDiagnostico = async (ordenId) => {
      const div = document.getElementById(`historialDiagnostico${ordenId}`);
      if (!div) return;
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("diagnosticos")
        .select("*")
        .eq("orden_id", ordenId)
        .order("fecha_llegada", { ascending: false });
      if (error || !data || data.length === 0) {
        div.innerHTML = "<p>No hay historial de diagnóstico.</p>";
        return;
      }
      div.innerHTML =
        `<h4>Historial de Diagnóstico</h4>` +
        data
          .map(
            (d) => `
        <div class="diagnostico-historial-item">
          <b>Fecha llegada:</b> ${d.fecha_llegada}<br>
          <b>Revisiones:</b> ${d.revisiones}<br>
          <b>Problemas:</b> ${d.problemas}<br>
          <b>Observaciones:</b> ${d.observaciones}<br>
        </div>
      `,
          )
          .join("");
    };
  },
};

export default DiagnosticoModule;
