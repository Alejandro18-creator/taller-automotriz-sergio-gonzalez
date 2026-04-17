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
        <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #222; }
        .cotiz-header { display: flex; align-items: center; background: #1976d2; color: #fff; padding: 1.2rem 1rem; border-radius: 10px 10px 0 0; }
        .cotiz-header img { height: 60px; margin-right: 1.5rem; }
        .cotiz-title { font-size: 2.1rem; font-weight: bold; letter-spacing: 1px; }
        .cotiz-info { display: flex; justify-content: space-between; margin: 1.5rem 0 1rem 0; }
        .cotiz-info-box { background: #f5f7fa; border-radius: 8px; padding: 1rem 1.5rem; min-width: 260px; }
        .cotiz-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
        .cotiz-table th { background: #1976d2; color: #fff; padding: 0.6rem; font-size: 1rem; }
        .cotiz-table td { background: #f9f9f9; padding: 0.6rem; border-bottom: 1px solid #e0e0e0; }
        .cotiz-table tr:last-child td { border-bottom: none; }
        .cotiz-total { text-align: right; font-size: 1.2rem; font-weight: bold; margin-top: 1.5rem; color: #1976d2; }
        .cotiz-comments { margin-top: 2rem; font-size: 0.98rem; color: #444; }
        </style>
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

        <hr style="margin:1.2rem 0;">
        <div id="repuestos-list">
          <div class="repuesto-item" style="display:flex;gap:0.5rem;margin-bottom:0.5rem;">
            <input type="text" name="repuesto_nombre[]" placeholder="Repuesto a cambiar" style="flex:2;" />
            <input type="text" inputmode="numeric" pattern="[0-9.]*" name="repuesto_valor[]" placeholder="Valor a cobrar" style="flex:1;" />
            <button type="button" class="btn-remove-repuesto">Quitar</button>
          </div>
        </div>
        <div style="margin-top:0.7rem; font-weight:bold; color:#1a237e;">Total trabajo: <span id="total-trabajo">$0</span></div>
        <button type="button" id="btn-add-repuesto">Agregar repuesto</button>

        <label>Observaciones generales:<br>
          <textarea name="observaciones" rows="2"></textarea>
        </label>
        <div style="display:flex;gap:0.5rem;">
          <button type="submit">Guardar Revisión</button>
          <button type="button" id="btn-imprimir-revision" style="background:#1976d2; color:#fff; border:none; border-radius:5px; padding:0.4rem 1rem;">Imprimir</button>
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
    // --- Repuestos dinámicos ---
    const repuestosList = formDiv.querySelector("#repuestos-list");
    function formatCLP(value) {
      if (!value || isNaN(value)) return "";
      return value.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      });
    }

    function unformatCLP(str) {
      // Elimina todo lo que no sea número
      return parseInt((str || "").replace(/[^\d]/g, "")) || 0;
    }

    function updateRepuestoCLP() {
      const repuestoInputs = repuestosList.querySelectorAll(
        'input[name="repuesto_valor[]"]',
      );
      let total = 0;
      repuestoInputs.forEach((input) => {
        let raw = unformatCLP(input.value);
        total += raw;
        // Solo actualiza si el valor mostrado no coincide con el formateado
        const formatted = raw ? formatCLP(raw) : "";
        if (input.value !== formatted && input === document.activeElement) {
          // No formatear mientras se escribe
        } else {
          input.value = formatted;
        }
      });
      const totalTrabajo = formDiv.querySelector("#total-trabajo");
      if (totalTrabajo) totalTrabajo.textContent = formatCLP(total);
    }

    // Inicializar listeners para los inputs existentes
    repuestosList
      .querySelectorAll('input[name="repuesto_valor[]"]')
      .forEach((input) => {
        input.addEventListener("input", (e) => {
          // Permite solo números
          let raw = unformatCLP(input.value);
          input.value = raw ? formatCLP(raw) : "";
          updateRepuestoCLP();
        });
        input.addEventListener("focus", (e) => {
          // Al enfocar, mostrar solo el número
          let raw = unformatCLP(input.value);
          input.value = raw ? raw : "";
        });
        input.addEventListener("blur", (e) => {
          // Al salir, formatear
          let raw = unformatCLP(input.value);
          input.value = raw ? formatCLP(raw) : "";
          updateRepuestoCLP();
        });
      });

    // Listener para agregar repuesto
    formDiv.querySelector("#btn-add-repuesto").addEventListener("click", () => {
      const div = document.createElement("div");
      div.className = "repuesto-item";
      div.style.display = "flex";
      div.style.gap = "0.5rem";
      div.style.marginBottom = "0.5rem";
      div.innerHTML = `
        <input type="text" name="repuesto_nombre[]" placeholder="Repuesto a cambiar" style="flex:2;" />
        <input type="text" inputmode="numeric" pattern="[0-9.]*" name="repuesto_valor[]" placeholder="Valor a cobrar" style="flex:1;" />
        <button type="button" class="btn-remove-repuesto">Quitar</button>
      `;
      const input = div.querySelector('input[name="repuesto_valor[]"]');
      input.addEventListener("input", (e) => {
        let raw = unformatCLP(input.value);
        input.value = raw ? formatCLP(raw) : "";
        updateRepuestoCLP();
      });
      input.addEventListener("focus", (e) => {
        let raw = unformatCLP(input.value);
        input.value = raw ? raw : "";
      });
      input.addEventListener("blur", (e) => {
        let raw = unformatCLP(input.value);
        input.value = raw ? formatCLP(raw) : "";
        updateRepuestoCLP();
      });
      div
        .querySelector(".btn-remove-repuesto")
        .addEventListener("click", () => {
          div.remove();
          updateRepuestoCLP();
        });
      repuestosList.appendChild(div);
      updateRepuestoCLP();
    });
    // Botón quitar para el primero
    repuestosList.querySelectorAll(".btn-remove-repuesto").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        btn.parentElement.remove();
        updateRepuestoCLP();
      });
    });
    // Actualizar CLP al cargar
    updateRepuestoCLP();
    // Botón quitar para el primero
    repuestosList.querySelectorAll(".btn-remove-repuesto").forEach((btn) => {
      btn.addEventListener("click", (e) => btn.parentElement.remove());
    });
    // ...resto de lógica original...
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
    // Botón Imprimir personalizado
    const btnImprimir = form.querySelector("#btn-imprimir-revision");
    if (btnImprimir) {
      btnImprimir.addEventListener("click", () => {
        // Obtener datos del formulario
        const cliente = reserva.nombre || "";
        const marca = reserva.marca || "";
        const modelo = reserva.modelo || "";
        const patente = reserva.patente || "";
        const fecha = new Date().toLocaleDateString();
        const repuestos = Array.from(form.querySelectorAll(".repuesto-item"))
          .map((div) => {
            return {
              nombre: div.querySelector('input[name="repuesto_nombre[]"]')
                .value,
              valor: div.querySelector('input[name="repuesto_valor[]"]').value,
            };
          })
          .filter((r) => r.nombre || r.valor);
        const observaciones =
          form.querySelector('textarea[name="observaciones"]').value || "";
        const totalTrabajo =
          form.querySelector("#total-trabajo")?.textContent || "";

        // HTML personalizado tipo cotización
        const printHTML = `
<html><head><title>Cotización Diagnóstico de Vehículo</title>
<style>
body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #222; }
.cotiz-header { display: flex; align-items: center; background: #1976d2; color: #fff; padding: 1.2rem 1rem; border-radius: 10px 10px 0 0; }
.cotiz-header img { height: 60px; margin-right: 1.5rem; }
.cotiz-title { font-size: 2.1rem; font-weight: bold; letter-spacing: 1px; }
.cotiz-info { display: flex; justify-content: space-between; margin: 1.5rem 0 1rem 0; }
.cotiz-info-box { background: #f5f7fa; border-radius: 8px; padding: 1rem 1.5rem; min-width: 260px; }
.cotiz-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
.cotiz-table th { background: #1976d2; color: #fff; padding: 0.6rem; font-size: 1rem; }
.cotiz-table td { background: #f9f9f9; padding: 0.6rem; border-bottom: 1px solid #e0e0e0; }
.cotiz-table tr:last-child td { border-bottom: none; }
.cotiz-total { text-align: right; font-size: 1.2rem; font-weight: bold; margin-top: 1.5rem; color: #1976d2; }
.cotiz-comments { margin-top: 2rem; font-size: 0.98rem; color: #444; }
          });
</head><body>
  <div class="cotiz-header">
    <img src="${location.origin}/img/logo.jpg" alt="Logo taller" />
    <div>
      <div class="cotiz-title">COTIZACIÓN / DIAGNÓSTICO DE VEHÍCULO</div>
      <div style="font-size:1.1rem;">Fecha: ${fecha}</div>
    </div>
  </div>
  <div class="cotiz-info">
    <div class="cotiz-info-box">
      <b>Cliente:</b> ${cliente}<br>
      <b>Patente:</b> ${patente}<br>
    </div>
    <div class="cotiz-info-box">
      <b>Marca:</b> ${marca}<br>
      <b>Modelo:</b> ${modelo}<br>
    </div>
  </div>
  <table class="cotiz-table">
    <thead>
      <tr><th>Repuesto / Detalle</th><th style="width:160px;">Valor</th></tr>
    </thead>
    <tbody>
      ${repuestos.map((r) => `<tr><td>${r.nombre}</td><td style="text-align:right;">${r.valor}</td></tr>`).join("")}
    </tbody>
  </table>
  <div class="cotiz-total">TOTAL TRABAJO: ${totalTrabajo}</div>
  <div class="cotiz-comments">
    <b>Observaciones:</b><br>${observaciones ? observaciones.replace(/\n/g, "<br>") : "Sin observaciones."}
  </div>
</body></html>
        `;
        const printWindow = window.open("", "", "height=900,width=900");
        printWindow.document.write(printHTML);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
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
