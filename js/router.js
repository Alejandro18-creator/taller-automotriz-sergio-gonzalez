/**
 * ROUTER - Sistema de Navegación SPA
 * Maneja el cambio entre módulos y la carga de componentes
 */

// Importar módulos
import DashboardModule from "./modules/dashboard.js";
import ClientesModule from "./modules/clientes.js";
import VehiculosModule from "./modules/vehiculos.js";
import OrdenesModule from "./modules/ordenes.js";
import ReportesModule from "./modules/reportes.js";
import ReservasModule from "./modules/reservas.js";
import SolicitudesPublicasModule from "./modules/solicitudes-publicas.js";
import PublicoInicioModule from "./modules/publico-inicio.js";
import PublicoAtencionModule from "./modules/publico-atencion.js";
import PublicoCotizacionesModule from "./modules/publico-cotizaciones.js";

// Registro de módulos disponibles
const modules = {
  dashboard: DashboardModule,
  clientes: ClientesModule,
  vehiculos: VehiculosModule,
  ordenes: OrdenesModule,
  reportes: ReportesModule,
  reservas: ReservasModule,
  "solicitudes-publicas": SolicitudesPublicasModule,
  "publico-inicio": PublicoInicioModule,
  "publico-atencion": PublicoAtencionModule,
  "publico-cotizaciones": PublicoCotizacionesModule,
};

const menuByMode = {
  publico: [
    { module: "publico-inicio", icon: "fas fa-home", label: "Inicio" },
    {
      module: "publico-atencion",
      icon: "fas fa-headset",
      label: "Solicitar Atención",
    },
    {
      module: "publico-cotizaciones",
      icon: "fas fa-file-signature",
      label: "Cotizaciones",
    },
    {
      module: "reservas",
      icon: "fas fa-calendar-check",
      label: "Reservar Hora",
    },
  ],
  taller: [
    { module: "dashboard", icon: "fas fa-chart-line", label: "Dashboard" },
    {
      module: "solicitudes-publicas",
      icon: "fas fa-inbox",
      label: "Solicitudes Públicas",
    },
    { module: "clientes", icon: "fas fa-users", label: "Clientes" },
    { module: "vehiculos", icon: "fas fa-car", label: "Vehículos" },
    { module: "ordenes", icon: "fas fa-file-invoice", label: "Órdenes" },
    { module: "reportes", icon: "fas fa-chart-bar", label: "Reportes" },
  ],
};

const defaultModuleByMode = {
  publico: "publico-inicio",
  taller: "dashboard",
};

class Router {
  constructor() {
    this.currentModule = null;
    this.contentArea = null;
    this.sidebar = null;
    this.currentMode = "publico";
    this.modeButtons = null;
    this.modeLabel = null;
    this.modeDescription = null;
  }

  async init() {
    this.contentArea = document.querySelector(".content");
    this.sidebar = document.querySelector("#sidebarMenu");
    this.modeButtons = document.querySelectorAll("[data-mode]");
    this.modeLabel = document.querySelector("#modeLabel");
    this.modeDescription = document.querySelector("#modeDescription");

    if (!this.contentArea || !this.sidebar) {
      console.error("No se encontraron elementos necesarios");
      return;
    }

    this.setupModeListeners();
    this.renderMenu();
    this.updateModeUI();

    this.navigate(defaultModuleByMode[this.currentMode]);
  }

  setupModeListeners() {
    this.modeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const { mode } = button.dataset;
        this.switchMode(mode);
      });
    });
  }

  switchMode(mode) {
    if (!menuByMode[mode] || mode === this.currentMode) {
      return;
    }

    if (this.currentModule && this.currentModule.destroy) {
      this.currentModule.destroy();
    }

    this.currentMode = mode;
    this.renderMenu();
    this.updateModeUI();
    this.navigate(defaultModuleByMode[mode]);
  }

  renderMenu() {
    const menuItems = menuByMode[this.currentMode] || [];
    this.sidebar.innerHTML = menuItems
      .map(
        (item) => `
          <li data-module="${item.module}">
            <i class="${item.icon}"></i> ${item.label}
          </li>
        `,
      )
      .join("");

    this.setupMenuListeners();
  }

  setupMenuListeners() {
    const sidebarItems = this.sidebar.querySelectorAll("li[data-module]");

    sidebarItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const moduleName = item.dataset.module;
        this.navigate(moduleName);
      });
    });
  }

  updateModeUI() {
    this.modeButtons.forEach((button) => {
      const isActive = button.dataset.mode === this.currentMode;
      button.classList.toggle("active", isActive);
    });

    if (this.modeLabel && this.modeDescription) {
      if (this.currentMode === "publico") {
        this.modeLabel.textContent = "Vista Pública";
        this.modeDescription.textContent =
          "Información, atención y cotizaciones para clientes";
      } else {
        this.modeLabel.textContent = "Vista Taller";
        this.modeDescription.textContent = "Gestión interna del taller";
      }
    }

    document.body.classList.toggle(
      "modo-publico",
      this.currentMode === "publico",
    );
    document.body.classList.toggle(
      "modo-taller",
      this.currentMode === "taller",
    );
  }

  async navigate(moduleName) {
    // Validar que el módulo exista
    if (!modules[moduleName]) {
      console.error(`Módulo ${moduleName} no encontrado`);
      return;
    }

    // Limpiar módulo actual
    if (this.currentModule && this.currentModule.destroy) {
      this.currentModule.destroy();
    }

    // Obtener el nuevo módulo
    const newModule = modules[moduleName];

    // Actualizar contenido
    this.contentArea.innerHTML = newModule.render();

    // Inicializar módulo
    newModule.init();

    // Guardar referencia al módulo actual
    this.currentModule = newModule;

    // Actualizar menu activo
    this.updateActiveMenuItem(moduleName);

    console.log(`Navegó a: ${moduleName} (${this.currentMode})`);
  }

  updateActiveMenuItem(moduleName) {
    const menuItems = this.sidebar.querySelectorAll("li[data-module]");

    menuItems.forEach((item) => {
      if (item.dataset.module === moduleName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }
}

// Exportar instancia del router
const router = new Router();

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  router.init();
});

export default router;
