/**
 * PUBLICO INICIO - Información general para clientes/visitantes
 */

const PublicoInicioModule = {
  name: "publico-inicio",

  render() {
    return `
      <div class="publico-container">
        <section class="publico-hero">
          <h2>Bienvenido a Taller Automotriz</h2>
          <p>
            Servicio mecánico integral, mantenciones, diagnóstico y reparación.
            Si quieres cotizar o solicitar atención, usa las opciones del menú público.
          </p>
        </section>

        <section class="publico-grid">
          <article class="publico-card">
            <i class="fas fa-tools"></i>
            <h3>Servicios</h3>
            <p>Mecánica general, frenos, suspensión, cambios de aceite y diagnóstico computarizado.</p>
          </article>

          <article class="publico-card">
            <i class="fas fa-clock"></i>
            <h3>Horarios</h3>
            <p>Lunes a Viernes: 08:30 - 18:30<br>Sábado: 09:00 - 14:00</p>
          </article>

          <article class="publico-card">
            <i class="fas fa-phone"></i>
            <h3>Contacto</h3>
            <p>Tel: +56 9 1234 5678<br>Email: contacto@taller.cl</p>
          </article>
        </section>
      </div>
    `;
  },

  init() {
    console.log("Módulo público de inicio inicializado");
  },

  destroy() {
    // No hay listeners a limpiar por ahora
  },
};

export default PublicoInicioModule;
