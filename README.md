# Taller Mecánico - Sistema de Gestión SPA

## Estructura del Proyecto

Este es un proyecto Single Page Application (SPA) construido con HTML5, CSS3 y JavaScript vanilla.

```
taller-mecanico/
├── index.html              # Punto de entrada principal
├── css/
│   ├── variables.css       # Variables CSS globales
│   ├── styles.css          # Estilos base del layout
│   ├── general.css         # Estilos compartidos por todos los módulos
│   ├── dashboard.css       # Estilos del dashboard
│   ├── reportes.css        # Estilos de reportes
│   └── reservas.css        # Estilos de reservas
├── js/
│   ├── router.js           # Sistema de enrutamiento y navegación
│   ├── app.js              # Código antiguo (ref: selects de marcas/modelos)
│   └── modules/
│       ├── dashboard.js    # Módulo Dashboard
│       ├── clientes.js     # Módulo Gestión de Clientes
│       ├── vehiculos.js    # Módulo Gestión de Vehículos
│       ├── ordenes.js      # Módulo Gestión de Órdenes
│       ├── reportes.js     # Módulo Análisis y Reportes
│       └── reservas.js     # Módulo Reserva de Horas
├── components/
│   ├── sidebar.html        # Componente lateral (menú)
│   └── header.html         # Componente superior (encabezado)
├── img/
│   └── logo.jpg            # Logo del taller
└── README.md               # Este archivo
```

## Cómo Funciona

### 1. **Punto de Entrada (index.html)**

- Carga todos los estilos CSS y Font Awesome
- Define la estructura HTML base (Layout con sidebar, header, content)
- Carga Supabase
- Carga el router.js como módulo ES6

### 2. **Router (js/router.js)**

- Gestiona la navegación entre módulos
- Controla qué módulo se muestra en la sección `.content`
- Limpia y inicializa módulos
- Marca el elemento activo en el menú

### 3. **Módulos (js/modules/)**

Cada módulo tiene la misma estructura:

```javascript
const ModuloName = {
  name: "nombreModulo",

  render() {
    // Retorna el HTML del módulo
    return `<div>Contenido HTML</div>`;
  },

  init() {
    // Se ejecuta cuando el módulo se carga
    // Inicializa event listeners y lógica
  },

  destroy() {
    // Se ejecuta cuando el módulo se descarga
    // Limpia event listeners
  },
};
```

## Cómo Agregar un Nuevo Módulo

### Paso 1: Crear el archivo del módulo

Crear `js/modules/nuevamodulo.js`:

```javascript
const NuevaModuloModule = {
  name: "nuevamodulo",

  render() {
    return `
            <div class="nuevamodulo-container">
                <h2>Mi Nuevo Módulo</h2>
                <!-- Contenido aquí -->
            </div>
        `;
  },

  init() {
    console.log("Nuevo módulo inicializado");
    // Agregar event listeners aquí
  },

  destroy() {
    // Limpiar si es necesario
  },
};

export default NuevaModuloModule;
```

### Paso 2: Registrar el módulo en el router

En `js/router.js`, agregar el import:

```javascript
import NuevaModuloModule from "./modules/nuevamodulo.js";
```

Y agregarlo al objeto `modules`:

```javascript
const modules = {
  dashboard: DashboardModule,
  clientes: ClientesModule,
  vehiculos: VehiculosModule,
  ordenes: OrdenesModule,
  reportes: ReportesModule,
  reservas: ReservasModule,
  nuevamodulo: NuevaModuloModule, // <- Agregar aquí
};
```

### Paso 3: Agregar el menú en HTML

En `index.html`, agregar en la lista `<ul>` del sidebar:

```html
<li data-module="nuevamodulo"><i class="fas fa-icon"></i> Nuevo Módulo</li>
```

### Paso 4: Agregar estilos (opcional)

Crear `css/nuevamodulo.css` con los estilos específicos y agregar el link en `index.html`:

```html
<link rel="stylesheet" href="css/nuevamodulo.css" />
```

## Flujo de Navegación

1. Usuario hace clic en un elemento del menú (`li[data-module]`)
2. El router detecta el clic y extrae el valor de `data-module`
3. Router llama a `navigate(moduleName)`
4. El módulo anterior se limpia con `destroy()`
5. El nuevo módulo se renderiza: `contentArea.innerHTML = newModule.render()`
6. El nuevo módulo se inicializa: `newModule.init()`
7. El menú se actualiza para mostrar el item activo

## Integración con Supabase

Supabase está configurado en `index.html` y disponible globalmente como:

```javascript
const supabaseUrl = "https://ocqvpbwqovxprigfwqcc.supabase.co";
const supabaseKey = "sb_publishable_5LJ8bhujNmgyTRin-gc-ig_X4968E_B";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
```

En los módulos, puedes usar:

```javascript
init() {
    // Obtener datos de Supabase
    const { data, error } = await supabase
        .from('tabla_nombre')
        .select('*');
}
```

## Ventajas de esta Estructura

✅ **Modular**: Cada módulo es independiente  
✅ **Mantenible**: Errores localizados a un módulo específico  
✅ **Escalable**: Fácil agregar nuevos módulos  
✅ **Sin recarga**: Cambios sin recargar la página  
✅ **Organizado**: Código separado por funcionalidad

## Próximos Pasos

- [ ] Conectar módulos con Supabase
- [ ] Implementar autenticación
- [ ] Agregar validación de formularios
- [ ] Mejorar responsividad
- [ ] Agregar notificaciones/alerts
- [ ] Testing unitario
