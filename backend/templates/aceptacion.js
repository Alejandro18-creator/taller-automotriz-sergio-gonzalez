const generarLayout = require("./layout");

function generarCorreoAceptacion({ nombre, patente, fecha, hora }) {
 return generarLayout({
  titulo: "Confirmación de cita",

  contenido: `
    <h2>Estimado(a) ${nombre}</h2>

    <p>
      Nos complace informarle que su solicitud de atención ha sido
      <strong>aceptada</strong>.
    </p>

    <hr>

    <p><strong>Patente:</strong> ${patente}</p>

    <p><strong>Fecha:</strong> ${fecha}</p>

    <p><strong>Hora:</strong> ${hora}</p>

    <hr>

    <p>
      Lo esperamos en la fecha y hora indicada.
    </p>

    <p>
      Saludos cordiales.
    </p>
  `,
});
}

module.exports = generarCorreoAceptacion;
