const express = require('express');
const {Board, Led, Servo} = require("johnny-five");
const board = new Board();
const controller = "PCA9685";

const app = express();
const puerto = 3000;

app.use(express.static('public'));

angulo_base = 90;
angulo_fordback = 70;
angulo_updown = 45;
//angulo_garra = 165;

function volver(res) {
    res.redirect('/');
}

board.on('ready', () => {
    const servo_base = new Servo({
        controller,
        pin: 8,
        range: [0, 180]
    });
    const servo_fordback = new Servo({
        controller,
        pin: 9,
        range: [20, 165]
    });

    const servo_updown = new Servo({
        controller,
        pin: 10,
        range: [0, 130]
    });
    const servo_garra = new Servo({
        controller,
        pin: 11,
        range: [0, 180]
    });

    servo_base.to(angulo_base,5000);
    servo_fordback.to(angulo_fordback,5000);
    servo_updown.to(angulo_updown, 5000);
    //servo_garra.to(angulo_garra,5000);

    // MOVIMIENTO DE LA BASE
    app.get('/L', (req, res) => {
        console.log(`Izquierda`);
        angulo_base += 1;
            servo_base.to(angulo_base,500, volver(res));
    });

    app.get('/R', (req, res) => {
        console.log(`Derecha`);
        angulo_base -= 1;
            servo_base.to(angulo_base,500, volver(res)); 
    });
    
    //MOVIMIENTO ADELANTE / ATRAS
    app.get('/F', (req, res) => {
        console.log(`Adelante`);
        angulo_fordback += 1;
            servo_fordback.to(angulo_fordback,500, volver(res));
    });

    app.get('/B', (req, res) => {
        console.log(`Atras`);
        angulo_fordback -= 1;
            servo_fordback.to(angulo_fordback,500, volver(res)); 
    });

    //MOVIMIENTO ARRIBA / ABAJO
    app.get('/U', (req, res) => {
        console.log(`Arriba`);
        angulo_updown += 1;
            servo_updown.to(angulo_updown,500, volver(res));
    });

    app.get('/D', (req, res) => {
        console.log(`Abajo`);
        angulo_updown -= 1;
            servo_updown.to(angulo_updown,500, volver(res)); 
    });

    //MOVIMIENTO GARRA
    app.get('/Open', (req, res) => {
        console.log(`Abierto`);
        servo_garra.to(165, 500, volver(res));
    });

    app.get('/Close', (req, res) => {
        console.log(`Cerrado`);
        servo_garra.to(135, 500, volver(res)); 
    });

});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
});


/*
app.get('/P', (req, res) => {
    const servo = new Servo(9);
    console.log(`Izquierda`);
    if (servo) {
        currentAngle -= 1; // Aumenta el ángulo en 1
        // Asegúrate de que el ángulo no supere 180 grados
        if (currentAngle > 10) {
            currentAngle = 10;
        }
        servo.to(currentAngle, 500, volver(res));
    }
});

app.get('/I', (req, res) => {
    const servo = new Servo(9);
    servo.to(180, 3000);
});*/