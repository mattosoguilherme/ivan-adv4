// Importa o módulo express para esse arquivo
const express = require("express");
const { url } = require("inspector");
// Importação do módulo nodemailer
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer/lib/smtp-transport");

require("dotenv").config();

// Instancia uma referência do express no projeto
const app = express();
const port = process.env.PORT || 3010; // Const para armanezar a porta do servidor
app.set("view engine", "ejs");
const path = require("path");
app.use(express.urlencoded({ extended: true }))

app.use(express.static(__dirname + "/assets", {
  index: false, 
  immutable: true, 
  cacheControl: true,
  maxAge: "30d"
}));
// Liga o servidor na porta 3000
//app.listen(3000);

// var loading = document.getElementsByClassName('loading')
// var error = document.getElementsByClassName('error-message')
// var sent = document.getElementsByClassName('sent-message')

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/send", async (req,res) => {
    const transporter = nodemailer.createTransport( new smtpTransport({
        
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            // service:"yahoo",
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
            
            // debug: true,
            logger:true,
            // secureConnection: false,
            tls:{
                rejectUnAuthorized:false,
                ignoreTLS: true,
                secure: true,
            },
            pool:true, 
          
    }));

    // const {name, email, subject, message} = req.body;
    // const user = {
    //   nome: name,
    //   email: email,
    //   assunto: subject,
    //   mensagem: message
    // }
    const user = req.body
    console.log(user)
  
    await transporter
     .sendMail({
      
        from: `${user.nome} <${user.email}> `,
        to: process.env.MAIL_USER,
        subject: `${user.assunto}`,
        text: `
        Cliente: ${user.nome}
        Contato: ${user.email}
        Mensagem: ${user.mensagem}
        `,
      })

      .then((r) => {
          // loading.innerHTML = 'Carregando'
          console.log(r);
          // sent.innerHTML = `${user.name}, sua mensagem foi enviada com sucesso! Logo entraremos em contato.`
          res.redirect('/');
          
      })
      .catch((e) => {
          // loading.innerHTML = 'Carregando'
          console.log(e);
          // error.innerHTML = `${user.name}, não foi possível enviar a sua mensagem, recarregue a página e tente novamente. Em caso de reincidência, nos procure via Whatsapp`
          res.redirect('/');
          
      })
 
})

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));