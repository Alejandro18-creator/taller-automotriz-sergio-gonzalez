const Notificaciones = {
  async enviarAceptacion(solicitud) {
    console.log("Enviar correo de aceptación:", solicitud);
  },

  async enviarWhatsApp(solicitud) {
    console.log("Enviar WhatsApp:", solicitud);
  },
};

export default Notificaciones;