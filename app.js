// PROYECTO BRAZO BLANCO

const express = require('express');
const http = require('http'); // Necesario para usar Socket.io con Express
const socketIo = require('socket.io'); // Requiere socket.io
const path = require('path');

const {EtherPortClient} = require('etherport-client');
const {Board, Servo} = require("johnny-five");

const board = new Board({
    port: new EtherPortClient({
      host: '192.168.111.190',
      // host: '192.168.200.158',
      port: 3030
    }),
    repl: true
  });

const controller = "PCA9685";

var sv0, sv1, sv2, sv3, sv4, sv5, sv6;
board.on("ready", function() {
  console.log("Arduino Connected!!");

  sv0 = new Servo({ // Eje 0
    controller,
    range: [20, 140],
    pin: 8,
    startAt: 113,
  });
  sv1 = new Servo({ // Eje 1
    controller,
    range: [60, 135],
    pin: 9,
    startAt: 110,
  });
  sv2 = new Servo({ // Eje 1
    controller,
    range: [60, 135],
    pin: 10,
    startAt: 110,
  });
  sv3 = new Servo({ // Eje 2
    controller,
    range: [60, 110],
    pin: 12,
    startAt: 60,
  });

  sv4 = new Servo({ // Eje 3
    controller,
    range: [30, 140],
    pin: 13,
    startAt: 30,
  });
  sv5 = new Servo({ // Eje 4 (no funciona Servo)
    controller,
    range: [0, 180],
    pin: 14,
    startAt: 90,
  });
  sv6 = new Servo({ // Eje 5
    controller,
    range: [0, 100],
    pin: 15,
    startAt: 100,
  });


})


const app = express();
const port = 3000;

// Crea el servidor HTTP usando el módulo 'http' y Express
const server = http.createServer(app);

// Inicializa socket.io con el servidor HTTP
const io = socketIo(server);

// Configura Express para servir archivos estáticos (CSS, imágenes, JS, etc.) desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir el archivo HTML desde la carpeta "views"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/A', (req, res) => {
  console.log("Morder")
  res.send("OK");
});
app.get('/R', (req, res) => {
  console.log("Abrir")
  res.send("OK");
});

// Escucha las conexiones de socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar mensaje desde el servidor al cliente
    socket.emit('mensajeServidor', 'Bienvenido al servidor de Socket.io');

    // Escuchar un evento llamado 'mensajeCliente' que envía el cliente
    setTimeout(function(){
      
      socket.on("eje_set_req", (data)=>{
        // console.log('Ejecutando movimiento', data);
        // Code Here!!!
        if(data.eje == 0){
          sv0.to(data.grade)
        }
        if(data.eje == 1){
          sv1.to(data.grade)
          sv2.to(data.grade)
        }
        if(data.eje == 2){
          sv3.to(data.grade)
        }
        if(data.eje == 3){
          sv4.to(data.grade)
        }
        if(data.eje == 4){
          sv5.to(data.grade)
        }
        if(data.eje == 5){
          sv6.to(data.grade)
        }
        
        io.emit('eje_set_res', "Recibido");
      })

      socket.on("read_macro_req", (data)=>{
        console.log("Actividad Recibida!.")
        var jsonArr = JSON.parse(data);
        console.log(jsonArr)

        var i = 0;                  //  set your counter to 1

        function myLoop() {         //  create a loop function
          
          var ejex = jsonArr[i].eje;
          var gradex = jsonArr[i].grade;
          eval("sv"+ejex+".to("+gradex+", 3000)")
          
          i++;                    //  increment the counter
          if (i < jsonArr.length) {           //  if the counter < 10, call the loop function
            setTimeout(function() {   //  call a 3s setTimeout when the loop is called
              myLoop();             //  ..  again which will trigger another 
            }, 3000)
          }else{
            console.log("Actividad Terminada!")
          }                       //  ..  setTimeout()
        }

        myLoop();  
      })
    },5000)
    socket.on('mensajeCliente', (data) => {
        console.log('Mensaje del cliente:', data.mensaje);

        // Responder a todos los clientes con el mensaje recibido
        io.emit('mensajeServidor', `El cliente dice: ${data.mensaje}`);
    });

    // Detectar cuando un cliente se desconecta
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});



// Inicia el servidor en el puerto especificado
server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});