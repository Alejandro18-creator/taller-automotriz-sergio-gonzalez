require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", (req, res) => {
  res.send("Backend Taller Automotriz funcionando.");
});

app.get("/test", async (req, res) => {
  try {
    const resultado = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "alejandrocastillop50@gmail.com",
      subject: "Prueba Taller Automotriz",
      html: `
        <h2>¡Funcionó!</h2>
        <p>Este es el primer correo enviado desde el backend del Taller Automotriz Sergio González.</p>
      `,
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