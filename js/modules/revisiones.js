import { getSupabaseClient } from "../supabase-client.js";

const RevisionesModule = {
  name: "revisiones",

  render() {
    return `
      <style>
        .revisiones-container {
          background: #f5f7fa;
          border-radius: 14px;
          box-shadow: 0 2px 16px #0001;
          padding: 2.5rem 1.5rem 2rem 1.5rem;
          max-width: 700px;
          margin: 2.5rem auto;
          font-family: 'Segoe UI', Arial, sans-serif;
        }
        .revisiones-container h2 {
          color: #263238;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .revisiones-list-ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .revisiones-list-ul li {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 6px #0001;
          margin-bottom: 1.2rem;
          padding: 1rem 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .btn-revisar {
          align-self: flex-end;
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 0.4rem 1.1rem;
          margin-top: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
        }
        .btn-revisar:hover {
          background: #0d47a1;
        }
      </style>
      <div class="revisiones-container">
        <h2>Revisiones de Vehículos</h2>
        <div id="revisiones-list">
          <p>Cargando reservas...</p>
        </div>
      </div>
    `;
  },

  async init() {
    const listDiv = document.getElementById("revisiones-list");
    listDiv.innerHTML = "<p>Cargando reservas...</p>";
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("solicitudes_publicas")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      listDiv.innerHTML = `<p style='color:red'>Error al cargar reservas</p>`;
      return;
    }
    if (!data || data.length === 0) {
      listDiv.innerHTML = "<p>No hay reservas pendientes.</p>";
      return;
    }
    // Guardar la lista HTML y los datos para volver atrás
    this._revisionesListaHTML = `<ul class='revisiones-list-ul'>${data
      .map(
        (r) => `
          <li>
            <b>${r.nombre}</b> - ${r.servicio} <br>
            <small>${r.marca || ""} ${r.modelo || ""} ${r.patente || ""}</small>
            <button class="btn-revisar" data-id="${r.id}">Revisar</button>
          </li>
        `,
      )
      .join("")}</ul>`;
    listDiv.innerHTML = this._revisionesListaHTML;
    // Guardar los datos de reservas para el botón Volver
    this._revisionesData = data;

    // Delegación de eventos para los botones
    listDiv.querySelectorAll(".btn-revisar").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = btn.getAttribute("data-id");
        // Obtener datos de la reserva seleccionada
        const reserva = data.find((r) => String(r.id) === String(id));
        // Mostrar solo el formulario de revisión de la reserva seleccionada
        listDiv.innerHTML = `<div id="form-revision-${id}">${this.renderRevisionForm(reserva)}</div>`;
        const formDiv = document.getElementById(`form-revision-${id}`);
        this.setupRevisionForm(formDiv, reserva);
      });
    });

    // Delegación de eventos para los botones
    listDiv.querySelectorAll(".btn-revisar").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = btn.getAttribute("data-id");
        // Ocultar otros formularios
        listDiv
          .querySelectorAll(".form-revision-container")
          .forEach((div) => (div.style.display = "none"));
        // Mostrar el formulario para este ítem
        const formDiv = document.getElementById(`form-revision-${id}`);
        if (formDiv) {
          // Obtener datos de la reserva seleccionada
          const reserva = data.find((r) => String(r.id) === String(id));
          formDiv.innerHTML = this.renderRevisionForm(reserva);
          formDiv.style.display = "block";
          this.setupRevisionForm(formDiv, reserva);
        }
      });
    });
  },

  renderRevisionForm(reserva) {
    // Ítems sugeridos
    const items = [
      "Frenos",
      "Motor",
      "Suspensión",
      "Luces",
      "Aceite",
      "Neumáticos",
      "Dirección",
      "Batería",
      "Otros",
    ];
    // Estilos en línea para visualización inmediata (puedes migrar a CSS luego)
    return `
      <style>
        .form-revision-dinamica {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 12px #0002;
          padding: 2rem 1.5rem;
          max-width: 480px;
          margin: 2rem auto;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }
        .form-revision-dinamica h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
          color: #1a237e;
        }
        #revision-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .revision-item {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .revision-item select, .revision-item input {
          padding: 0.3rem 0.5rem;
          border-radius: 5px;
          border: 1px solid #bdbdbd;
        }
        .revision-item input {
          flex: 1;
        }
        .btn-remove-item {
          background: #e53935;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 0.3rem 0.7rem;
          cursor: pointer;
        }
        #btn-add-item {
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 0.4rem 1rem;
          margin-top: 0.5rem;
          cursor: pointer;
        }
        .form-revision-dinamica textarea {
          border-radius: 5px;
          border: 1px solid #bdbdbd;
          padding: 0.5rem;
          width: 100%;
        }
        .form-revision-dinamica button[type="submit"] {
          background: #388e3c;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 0.5rem 1.2rem;
          font-weight: bold;
          margin-top: 0.7rem;
          cursor: pointer;
        }
        #btn-cancelar-revision {
          background: #757575;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 0.4rem 1rem;
          margin-left: 0.5rem;
          cursor: pointer;
        }
      </style>
      <form class="form-revision-dinamica">
        <h4>Diagnóstico de vehículo</h4>
        <div style="margin-bottom:0.7rem; color:#333; font-size:1rem;">
          <b>Cliente:</b> ${reserva.nombre}<br>
          <b>Marca:</b> ${reserva.marca || ""} &nbsp; <b>Modelo:</b> ${reserva.modelo || ""} &nbsp; <b>Patente:</b> ${reserva.patente || ""}
        </div>
        <div id="revision-items-list">
          ${this.renderRevisionItemSelect(items)}
        </div>
        <button type="button" id="btn-add-item">Agregar ítem</button>
        <label>Observaciones generales:<br>
          <textarea name="observaciones" rows="2"></textarea>
        </label>
        <div style="display:flex;gap:0.5rem;">
          <button type="submit">Guardar Revisión</button>
          <button type="button" id="btn-cancelar-revision">Cancelar</button>
          <button type="button" id="btn-volver-revisiones" style="background:#607d8b; color:#fff; border:none; border-radius:5px; padding:0.4rem 1rem; margin-left:0.5rem; cursor:pointer;">Volver</button>
        </div>
      </form>
    `;
  },

  renderRevisionItemSelect(items) {
    return `
        <div class="revision-item">
          <select name="item_nombre[]">
            ${items.map((i) => `<option value="${i}">${i}</option>`).join("")}
          </select>
          <input type="text" name="item_detalle[]" placeholder="Detalle o estado" />
          <button type="button" class="btn-remove-item">Quitar</button>
        </div>
      `;
  },

  setupRevisionForm(formDiv, reserva) {
    const form = formDiv.querySelector(".form-revision-dinamica");
    const itemsList = formDiv.querySelector("#revision-items-list");
    const items = [
      "Frenos",
      "Motor",
      "Suspensión",
      "Luces",
      "Aceite",
      "Neumáticos",
      "Dirección",
      "Batería",
      "Otros",
    ];
    // Agregar ítem
    form.querySelector("#btn-add-item").addEventListener("click", (e) => {
      e.preventDefault();
      itemsList.insertAdjacentHTML(
        "beforeend",
        this.renderRevisionItemSelect(items),
      );
      this.setupRemoveItemButtons(itemsList);
    });
    // Quitar ítem
    this.setupRemoveItemButtons(itemsList);
    // Cancelar
    form
      .querySelector("#btn-cancelar-revision")
      .addEventListener("click", (e) => {
        e.preventDefault();
        formDiv.style.display = "none";
      });
    // Botón Volver
    const volverBtn = form.querySelector("#btn-volver-revisiones");
    if (volverBtn) {
      volverBtn.addEventListener("click", (e) => {
        e.preventDefault();
        // Restaurar la lista de reservas
        const listDiv = formDiv.parentElement;
        if (this._revisionesListaHTML) {
          listDiv.innerHTML = this._revisionesListaHTML;
          // Volver a enlazar los botones de revisar
          listDiv.querySelectorAll(".btn-revisar").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
              const id = btn.getAttribute("data-id");
              // Obtener datos de la reserva seleccionada
              const reserva = this._revisionesData.find(
                (r) => String(r.id) === String(id),
              );
              listDiv.innerHTML = `<div id="form-revision-${id}">${this.renderRevisionForm(reserva)}</div>`;
              const formDiv2 = document.getElementById(`form-revision-${id}`);
              this.setupRevisionForm(formDiv2, reserva);
            });
          });
        }
      });
    }
    // Guardar revisión en Supabase
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const items = formData.getAll("item_nombre[]");
      const detalles = formData.getAll("item_detalle[]");
      const observaciones = formData.get("observaciones");
      const supabase = getSupabaseClient();
      // 1. Insertar en tabla revisiones
      const { data: revision, error: errorRevision } = await supabase
        .from("revisiones")
        .insert([
          {
            solicitud_id: reserva.id,
            observaciones: observaciones || null,
            fecha: new Date().toISOString(),
          },
        ])
        .select("id")
        .single();
      if (errorRevision || !revision) {
        alert("Error al guardar la revisión.");
        return;
      }
      // 2. Insertar ítems en tabla revision_items
      const itemsData = items.map((nombre, idx) => ({
        revision_id: revision.id,
        nombre,
        detalle: detalles[idx] || null,
      }));
      const { error: errorItems } = await supabase
        .from("revision_items")
        .insert(itemsData);
      if (errorItems) {
        alert("Revisión guardada, pero hubo un error con los ítems.");
      } else {
        alert("¡Revisión guardada correctamente!");
      }
      // Volver a la lista
      const listDiv = formDiv.parentElement;
      if (this._revisionesListaHTML) {
        listDiv.innerHTML = this._revisionesListaHTML;
        // Volver a enlazar los botones de revisar
        if (this._revisionesData) {
          listDiv.querySelectorAll(".btn-revisar").forEach((btn) => {
            btn.addEventListener("click", async (e) => {
              const id = btn.getAttribute("data-id");
              const reserva = this._revisionesData.find(
                (r) => String(r.id) === String(id),
              );
              listDiv.innerHTML = `<div id=\"form-revision-${id}\">${this.renderRevisionForm(reserva)}</div>`;
              const formDiv2 = document.getElementById(`form-revision-${id}`);
              this.setupRevisionForm(formDiv2, reserva);
            });
          });
        }
      }
    });
  },

  setupRemoveItemButtons(itemsList) {
    itemsList.querySelectorAll(".btn-remove-item").forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        btn.parentElement.remove();
      };
    });
  },

  destroy() {
    // Limpieza si es necesario
  },
};

export default RevisionesModule;
