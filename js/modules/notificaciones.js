const NOMBRE_TALLER = "Taller Automotriz Sergio González";

const Notificaciones = {
  async enviarAceptacion(solicitud) {
    try {
      const respuesta = await fetch("http://localhost:3000/enviar-aceptacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: solicitud.nombre,
          email: solicitud.email,
          marca: solicitud.marca,
          patente: solicitud.patente,
          fecha: solicitud.fecha,
          hora: solicitud.hora,
        }),
      });

      const resultado = await respuesta.json();

      console.log("Correo enviado:", resultado);
    } catch (error) {
      console.error("Error enviando correo:", error);
    }
  },

  async enviarWhatsApp(solicitud) {
    console.log("Enviar WhatsApp:", solicitud);
  },

  generarMensajeAceptacion(solicitud) {
    return `
Estimado(a) ${solicitud.nombre}:

Le informamos que su solicitud de atención ha sido aceptada.

Detalles de la cita

Patente: ${solicitud.patente}
Fecha: ${solicitud.fecha}
Hora: ${solicitud.hora}

Lo esperamos en la fecha y hora indicadas.

Saludos cordiales,

${TALLER.nombre}

const TALLER = {
  nombre: "Taller Automotriz Sergio González",
  telefono: "+56 9 7552 0550",
  whatsapp: "56975520550",
  email: "contacto@taller.cl",
  direccion: "",
  logo: "",
};
`;
  },
};

export default Notificaciones;
