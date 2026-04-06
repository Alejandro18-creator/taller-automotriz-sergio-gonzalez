/**
 * PUBLICO INICIO - Información general para clientes/visitantes
 */

const PublicoInicioModule = {
  name: "publico-inicio",

  render() {
    return `
      <h3 class="nuestros_serv">
        <a href="servicios.html" style="color: #8b0000; text-decoration: underline; cursor: pointer;">Nuestros Servicios</a>
      </h3>
      <div class="publico-container">
        <section class="publico-hero">
          <h2>Bienvenido a Taller Automotriz Sebastian Gonzalez</h2>
          <p>
            Servicio mecánico integral, mantenciones, diagnóstico y reparación.¿Listo para darle el mejor cuidado a tu auto?
            Garantizamos que tu vehículo esté en óptimas condiciones.
            Agenda hoy mismo el servicio que necesita tu auto, desde mantenciones por kilometraje hasta reparaciones generales y más. ¡Confía en nosotros para mantenerlo en su mejor versión!
            Si quieres solicitar atención, usa las opciones del menú público.
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
            <p>Lunes a Viernes: 09:00 - 18:00<br></p>
          </article>

          <article class="publico-card">
            <i class="fas fa-phone"></i>
            <h3>Contacto</h3>
            <p>Tel: +56 9 68360846<br>Email: Seba.gonzalez.gonzalez5@gmail.com</p>
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
