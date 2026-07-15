require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
const generarCorreoAceptacion = require("./templates/aceptacion");

const app = express();

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
  res.send("Backend Taller Automotriz funcionando.");
});

app.post("/enviar-aceptacion", async (req, res) => {
  try {
    console.log("=== PETICIÓN RECIBIDA ===");
    console.log(req.body);

    const { nombre, email, patente, fecha, hora } = req.body;

    const resultado = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirmación de cita - Taller Automotriz Sergio González",
      html: generarCorreoAceptacion({
        nombre,
        patente,
        fecha,
        hora,
      }),
    });

    console.log(resultado);

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

app.listen(3000, () => {
  console.log("Servidor iniciado en puerto 3000");
});
