// Importa o módulo express para esse arquivo
const express = require("express");
require("dotenv").config();
const nodemailer = require("nodemailer");

// Instancia uma referência do express no projeto
const app = express();
const port = process.env.PORT || 3010; // Const para armanezar a porta do servidor
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(
  express.static(__dirname + "/assets", {
    index: false,
    immutable: true,
    cacheControl: true,
    maxAge: "30d",
  })
);
// Liga o servidor na porta 3000
//app.listen(3000);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/send", async (req, res) => {
  const user = req.body;

  const transporter = nodemailer.createTransport({
    secure:false,
    port: Number(process.env.PORT),
    service:'gmail',
    tls: {
      rejectUnauthorized: false,
    },
    secureConnection: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter
    .sendMail({
      from: `${user.name} <${user.email}> `,
      to: "ivanpintoadvocacia@hotmail.com",
      subject: user.subject,
      text: user.message,
    })
    .then((r) => {
      res.redirect("/");
      console.log(r);
    })
    .catch((e) => {
      console.log(e);
    });
});

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
