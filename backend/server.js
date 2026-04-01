const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();

app.use(cors());
app.use(express.json());

const client = twilio("TU_ACCOUNT_SID", "TU_AUTH_TOKEN");

app.post("/enviar-whatsapp", async function (req, res) {
  const data = req.body;

  const mensaje =
    "Nueva Reserva\n\n" +
    "Nombre: " + data.nombre + "\n" +
    "Telefono: " + data.telefono + "\n" +
    "Fecha: " + (data.fecha || data.fecha_agendada) + "\n" +
    "Hora: " + (data.hora || data.hora_agendada);

  try {
    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+569XXXXXXXX",
      body: mensaje
    });

    res.json({ ok: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "fallo" });
  }
});

app.listen(3000, function () {
  console.log("Servidor corriendo en puerto 3000");
});