const generarLayout = require("./layout");

function generarCorreoAceptacion({ nombre, marca, patente, fecha, hora }) {
  return generarLayout({
    titulo: "Confirmación de cita",

    contenido: `
      <h2>¡Hola ${nombre}!</h2>

      <p>
        Hemos confirmado tu solicitud de atención. Te esperamos en nuestro taller en la fecha y hora indicadas.
      </p>

      <div class="tarjeta">

        <p><strong>🚘 Marca:</strong> ${marca}</p>

        <p><strong>🚗 Patente:</strong> ${patente}</p>

        <p><strong>📅 Fecha:</strong> ${fecha}</p>

        <p><strong>🕒 Hora:</strong> ${hora}</p>

      </div>

      <p>
        Si necesitas modificar tu cita o tienes alguna consulta, puedes comunicarte con nosotros.
      </p>

      <div style="text-align:center;">

        <a
          href="https://wa.me/56975520550"
          class="boton"
        >
          Contactar por WhatsApp
        </a>

      </div>

      <p class="texto-secundario" style="margin-top:30px;">
        Gracias por confiar en Servicio Gómez. Será un placer atenderte.
      </p>
    `,
  });
}

module.exports = generarCorreoAceptacion;
