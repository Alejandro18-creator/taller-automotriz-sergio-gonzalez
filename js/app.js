// =============================
// MENU RESERVA
// =============================

const menuReserva = document.getElementById("menuReserva");
const pantallaInicio = document.getElementById("pantallaInicio");
const pantallaReserva = document.getElementById("pantallaReserva");

if (menuReserva) {
    menuReserva.addEventListener("click", () => {
        pantallaInicio.style.display = "none";
        pantallaReserva.style.display = "block";
    });
}


// =============================
// SELECTS
// =============================

const selectMarca = document.getElementById("marca");
const selectModelo = document.getElementById("modelo");


// =============================
// MARCAS
// =============================

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
    "Dodge",
    "Ram"
];


// =============================
// MODELOS POR MARCA
// =============================

const modelosPorMarca = {

    Toyota: ["Corolla", "Yaris", "Hilux", "RAV4", "Land Cruiser"],
    Chevrolet: ["Spark", "Sail", "Tracker", "Silverado"],
    Ford: ["Ranger", "Focus", "Fiesta", "Explorer"],
    Nissan: ["Versa", "Sentra", "Navara", "X-Trail"],
    Hyundai: ["Accent", "Elantra", "Tucson", "Santa Fe"],
    Kia: ["Rio", "Cerato", "Sportage"],
    Mazda: ["Mazda 2", "Mazda 3", "CX5"],
    Volkswagen: ["Gol", "Polo", "Amarok", "Tiguan"],
    Mitsubishi: ["L200", "Montero", "Outlander"],
    Subaru: ["Impreza", "Forester", "Outback"],
    Honda: ["Civic", "Accord", "CR-V"],
    Suzuki: ["Swift", "Baleno", "Vitara"],
    Peugeot: ["208", "308", "3008"],
    Renault: ["Clio", "Duster", "Captur"],
    Fiat: ["Uno", "Argo", "Toro"],
    BMW: ["Serie 1", "Serie 3", "X5"],
    "Mercedes-Benz": ["Clase A", "Clase C", "GLC"],
    Audi: ["A3", "A4", "Q5"],
    Volvo: ["XC40", "XC60", "XC90"],
    Jeep: ["Wrangler", "Cherokee", "Compass"],
    Dodge: ["Durango", "Charger"],
    Ram: ["1500", "2500"]
};


// =============================
// LLENAR SELECT DE MARCAS
// =============================

if (selectMarca) {

    marcas.forEach(marca => {

        const option = document.createElement("option");
        option.value = marca;
        option.textContent = marca;

        selectMarca.appendChild(option);

    });

}


// =============================
// CAMBIO DE MARCA → CARGAR MODELOS
// =============================

if (selectMarca && selectModelo) {

    selectMarca.addEventListener("change", () => {

        const marcaSeleccionada = selectMarca.value;

        selectModelo.innerHTML = '<option value="">Seleccione modelo</option>';

        if (modelosPorMarca[marcaSeleccionada]) {

            modelosPorMarca[marcaSeleccionada].forEach(modelo => {

                const option = document.createElement("option");
                option.value = modelo;
                option.textContent = modelo;

                selectModelo.appendChild(option);

            });

        }

    });

}