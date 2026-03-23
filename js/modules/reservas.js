/**
 * RESERVAS - Reservas de Horas
 */

const ReservasModule = {
  name: "reservas",

  render() {
    return `
            <div class="reservas-container">
                <h2>Reservar Hora</h2>
                
                <form id="formReserva" class="reserva-form">
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
                        <select id="marca" name="marca" required>
                            <option value="">Seleccione una marca</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Modelo *</label>
                        <select id="modelo" name="modelo" required>
                            <option value="">Seleccione modelo</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Patente *</label>
                        <input type="text" name="patente" placeholder="Patente" required>
                    </div>

                    <div class="form-group">
                        <label>Fecha Deseada *</label>
                        <input type="date" name="fecha" required>
                    </div>

                    <div class="form-group">
                        <label>Hora Deseada *</label>
                        <input type="time" name="hora" required>
                    </div>

                    <div class="form-group">
                        <label>Descripción del Problema</label>
                        <textarea name="descripcion" placeholder="Describe el problema o servicio que necesitas" rows="4"></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary btn-lg">Solicitar Hora</button>
                </form>

                <div id="mensajeReserva" class="mensaje" style="display: none;"></div>
            </div>
        `;
  },

  init() {
    console.log("Reservas inicializado");
    this.cargarMarcas();
    this.setupEventListeners();
  },

  setupEventListeners() {
    const marcaSelect = document.getElementById("marca");
    const formReserva = document.getElementById("formReserva");

    if (marcaSelect) {
      marcaSelect.addEventListener("change", (e) =>
        this.cargarModelos(e.target.value),
      );
    }

    if (formReserva) {
      formReserva.addEventListener("submit", (e) => this.enviarReserva(e));
    }
  },

  cargarMarcas() {
    const marcas = [
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
    ];

    const selectMarca = document.getElementById("marca");
    if (selectMarca) {
      marcas.forEach((marca) => {
        const option = document.createElement("option");
        option.value = marca;
        option.textContent = marca;
        selectMarca.appendChild(option);
      });
    }
  },

  cargarModelos(marca) {
    const modelos = {
      Toyota: ["Corolla", "Camry", "Hilux", "4Runner", "Yaris"],
      Chevrolet: ["Sonic", "Cruze", "Malibu", "Spark", "Aveo"],
      Ford: ["Fiesta", "Focus", "Fusion", "Ranger", "Explorer"],
      Nissan: ["Versa", "Altima", "Maxima", "Frontier", "Qashqai"],
      Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "i10"],
      Kia: ["Cerato", "Optima", "Seltos", "Sportage", "Picanto"],
      Default: ["Modelo A", "Modelo B", "Modelo C"],
    };

    const selectModelo = document.getElementById("modelo");
    if (selectModelo) {
      selectModelo.innerHTML = '<option value="">Seleccione modelo</option>';
      const modelosMarca = modelos[marca] || modelos["Default"];

      modelosMarca.forEach((modelo) => {
        const option = document.createElement("option");
        option.value = modelo;
        option.textContent = modelo;
        selectModelo.appendChild(option);
      });
    }
  },

  enviarReserva(e) {
    e.preventDefault();
    console.log("Reserva enviada");
    const mensaje = document.getElementById("mensajeReserva");
    if (mensaje) {
      mensaje.textContent =
        "Tu solicitud de hora ha sido registrada. Nos contactaremos pronto.";
      mensaje.style.display = "block";
      e.target.reset();
    }
  },

  destroy() {
    // Limpiar si es necesario
  },
};

export default ReservasModule;
