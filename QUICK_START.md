# Guía Rápida - Desarrollo

## 📁 Estructura del Proyecto

```
├── index.html                 ← Punto de entrada
├── css/                       ← Todos los estilos
│   ├── variables.css          ← Colores, fuentes
│   ├── styles.css             ← Layout base
│   ├── general.css            ← Componentes comunes
│   ├── dashboard.css          ← Estilos Dashboard
│   ├── reportes.css           ← Estilos Reportes
│   └── reservas.css           ← Estilos Reservas
├── js/
│   ├── router.js              ← ⭐ CORAZÓN DEL SISTEMA
│   ├── app.js                 ← Código antiguo (marcas/modelos)
│   └── modules/
│       ├── dashboard.js       ← Módulo Dashboard
│       ├── clientes.js        ← Módulo Clientes
│       ├── vehiculos.js       ← Módulo Vehículos
│       ├── ordenes.js         ← Módulo Órdenes
│       ├── reportes.js        ← Módulo Reportes
│       └── reservas.js        ← Módulo Reservas
├── components/                ← HTML reutilizable
├── img/                       ← Imágenes
└── README.md                  ← Documentación completa
```

## 🎮 Cómo Funciona

1. **Usuario abre la página** → Se carga `index.html`
2. **Se carga el router.js** → Renderiza el Dashboard por defecto
3. **Usuario hace clic en un menú** → Router cambia el módulo
4. **El módulo se renderiza y ejecuta** → Se muestra el contenido

## ❌ Si algo falla

1. Abre la consola: `F12` → `Console`
2. Busca mensajes de error
3. Identifica qué módulo está causando el problema
4. Ve al archivo correspondiente en `js/modules/`

## ✅ Agregar un nuevo módulo en 3 pasos

### Paso 1: Crear el archivo

`js/modules/ejemplo.js`

```javascript
const EjemploModule = {
  name: "ejemplo",
  render() {
    return '<div class="ejemplo-container"><h2>Ejemplo</h2></div>';
  },
  init() {
    console.log("Módulo Ejemplo cargado");
  },
  destroy() {},
};
export default EjemploModule;
```

### Paso 2: Registrar en router.js

```javascript
import EjemploModule from "./modules/ejemplo.js";
// ...
const modules = {
  // ... otros módulos
  ejemplo: EjemploModule, // ← Agregar
};
```

### Paso 3: Agregar en el menú (index.html)

```html
<li data-module="ejemplo"><i class="fas fa-star"></i> Ejemplo</li>
```

## 📝 Notas Importantes

- **Supabase**: Ya está configurado en index.html, disponible como `window.supabase`
- **CSS**: Los estilos específicos de cada módulo deben ir en su propio archivo CSS
- **Formularios**: Usa la clase `.reserva-form` como referencia
- **Tablas**: Usa la clase `.table` para consistencia
- **Mensajes**: Usa `.mensaje` para alertas

## 🔗 Enlaces Rápidos

- **Dashboard**: Pantalla principal con resumen
- **Clientes**: Gestión de clientes del taller
- **Vehículos**: Registro de vehículos
- **Órdenes**: Órdenes de trabajo
- **Reportes**: Análisis y estadísticas
- **Reservas**: Sistema de reserva de horas

## 💡 Tips de Debugging

```javascript
// Ver qué módulo está activo
console.log(router.currentModule.name);

// Probar carga manual
router.navigate("dashboard");

// Ver módulos disponibles
console.log(modules);
```

---

Para documentación completa, ver `README.md`
