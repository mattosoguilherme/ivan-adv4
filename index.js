// Importa o módulo express para esse arquivo
const express = require("express");
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

app.get("/send", async (req, res)  => {

  const user = {
    nome: "Guilherme Mattoso",
    email: "guilhermemktfran@gmail.com",
    assunto: "Teste",
    mensagem: "Isso é um teste",
  };
  const transporter = nodemailer.createTransport({
    // host: process.env.MAIL_HOST,
    port: Number(process.env.PORT),
    service: 'gmail',
    secure: false,
    secureConnection: false,
    auth: {
      user: process.env.USER,
      pass:process.env.PASS,
    },
  });

  console.log(process.env.USER);

  const mail = await transporter.sendMail({
    from: user.email,
    to: "ivanpintoadvocacia@gmail.com",
    subject: user.assunto,
    text: user.mensagem,
  }).catch(e => console.log(e))

  res.send(mail)
  console.log(mail);
  
});

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
