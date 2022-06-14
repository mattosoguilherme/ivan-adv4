// Importa o módulo express para esse arquivo
const express = require("express");
const { url } = require("inspector");
// Importação do módulo nodemailer
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer/lib/smtp-transport");

require("dotenv").config();

// Instancia uma referência do express no projeto
const app = express();
const port = process.env.PORT || 3000; // Const para armanezar a porta do servidor
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

// var loading = document.getElementsByid('alerta')
// var error = document.getElementsByid('alerta')
// var sent = document.getElementsByid('alerta')
let emailAtivo =''
let senhaAtiva = ''

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/send", async (req,res) => {

  const {name, email, message, atuacao} = req.body;
  let user = {
    nome: name,
    email: email,
    mensagem: message,
    atuacao: atuacao
  }

  let update =''
  
  if (atuacao === 'civel'){
    update ={
      atuacao: "Direito Cível"
    }
    emailAtivo = process.env.MAIL_USER_IVAN
    senhaAtiva = process.env.MAIL_PASS_IVAN
  } if (atuacao === 'criminal') {
    update ={
      atuacao: "Direito Criminal"
    }
    emailAtivo = process.env.MAIL_USER_HERLON
    senhaAtiva = process.env.MAIL_PASS_HERLON
  } if (atuacao === 'previdenciario') {
    update = {
      atuacao: "Direito Previdenciário"
    }
    emailAtivo = process.env.MAIL_USER_HUELTON
    senhaAtiva = process.env.MAIL_PASS_HUELTON
  } if (atuacao === 'trabalhista') {
    update = {
      atuacao: "Direito Trabalhista"
    }
    emailAtivo = process.env.MAIL_USER_IVAN
    senhaAtiva = process.env.MAIL_PASS_IVAN
  }


 Object.assign(user, update);



    const transporter = nodemailer.createTransport( new smtpTransport({
        
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            // service:"yahoo",
            auth: {
              user: emailAtivo,
              pass: senhaAtiva,
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

    await transporter
     .sendMail({
      
        from: `${user.nome} <${user.email}> `,
        to: emailAtivo,
        subject: `${user.atuacao}`,
        text: `
        Cliente: ${user.nome}
        Contato: ${user.email}
        Mensagem: ${user.mensagem}
        `,
      })

      .then((r) => {
          // loading.innerHTML = 'Carregando'
          console.log(r);
          // sent.innerHTML = `<div class="sent-message">Your message has been sent.Thank you!</div>`
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