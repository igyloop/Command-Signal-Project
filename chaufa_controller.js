const express = require('express');
const {Board, Servo} = require("johnny-five");
const {EtherPortClient} = require('etherport-client');

const board = new Board({
    port: new EtherPortClient({
        host: '192.168.200.189',
        port: 3030
    }),
    repl: true
});
const controller = "PCA9685";


const app = express();
const puerto = 3000;

app.use(express.static('public'));

angulo_base = 90;
angulo_hombro = 70;
angulo_codo = 45;
angulo_muneca = 115;
angulo_muneca2 = 0;
angulo_garra = 0;

function volver(res) {
    res.redirect('/');
}

board.on('ready', () => {
    const servo_base = new Servo({
        //controller,
        pin: 4,
        range: [0, 180],
        startAt: angulo_base,
    });
    const servo_hombro = new Servo({
        //controller,
        pin: 9,
        range: [20, 165],
        startAt: angulo_hombro,
    });

    const servo_codo = new Servo({
        //controller,
        pin: 10,
        range: [0, 130],
        startAt: angulo_codo,
    });
    const servo_muneca = new Servo({
        //controller,
        pin: 11,
        range: [0, 180],
        startAt: angulo_muneca,
    });
    const servo_muneca2 = new Servo({
        //controller,
        pin: 12,
        range: [0, 180],
        startAt: angulo_muneca2,
    });
    const servo_garra = new Servo({
        //controller,
        pin: 13,
        range: [0, 180],
        startAt: angulo_garra,
    });

    //servo_base.to(angulo_base,5000);
    //servo_fordback.to(angulo_fordback,5000);
    //servo_updown.to(angulo_updown, 5000);
    //servo_garra.to(angulo_garra,5000);

    // MOVIMIENTO DE LA BASE
    app.get('/BaseLeft', (req, res) => {
        console.log(`Base Izquierda`);
        angulo_base += 1;
            servo_base.to(angulo_base,500, volver(res));
    });

    app.get('/BaseRight', (req, res) => {
        console.log(`Base Derecha`);
        angulo_base -= 1;
            servo_base.to(angulo_base,500, volver(res)); 
    });
    
    //MOVIMIENTO ADELANTE / ATRAS
    app.get('/HombroAdelante', (req, res) => {
        console.log(`Hombro Adelante`);
        angulo_hombro += 1;
            servo_hombro.to(angulo_hombro,500, volver(res));
    });

    app.get('/HombroAtras', (req, res) => {
        console.log(`Hombro Atras`);
        angulo_hombro -= 1;
            servo_hombro.to(angulo_hombro,500, volver(res)); 
    });

    //MOVIMIENTO ARRIBA / ABAJO
    app.get('/CodoAdelante', (req, res) => {
        console.log(`Codo Adelante`);
        angulo_codo += 1;
            servo_codo.to(angulo_codo,500, volver(res));
    });

    app.get('/CodoAtras', (req, res) => {
        console.log(`Codo Atrás`);
        angulo_codo -= 1;
            servo_codo.to(angulo_codo,500, volver(res)); 
    });

    //MOVIMIENTO GARRA
    app.get('/MunecaAdelante', (req, res) => {
        console.log(`Muneca Adelante`);
        angulo_muneca += 1;
            servo_muneca.to(angulo_muneca, 500, volver(res));
    });

    app.get('/MunecaAtras', (req, res) => {
        console.log(`Muneca Atras`);
        angulo_muneca -= 1;
            servo_muneca.to(angulo_muneca, 500, volver(res)); 
    });

    app.get('/MunecaIzquierda', (req, res) => {
        console.log(`Muneca Izquierda`);
        angulo_muneca2 += 1;
            servo_muneca2.to(angulo_muneca2, 500, volver(res));
    });

    app.get('/MunecaDerecha', (req, res) => {
        console.log(`Muneca Derecha`);
        angulo_muneca2 -= 1;
            servo_muneca2.to(angulo_muneca2, 500, volver(res)); 
    });

    app.get('/Open', (req, res) => {
        console.log(`Abierto`);
            servo_garra.to(115, 500, volver(res));
    });

    app.get('/Close', (req, res) => {
        console.log(`Cerrado`);
            servo_garra.to(103, 500, volver(res)); 
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