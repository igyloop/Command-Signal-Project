// Iniciamos la cámara y preparamos el reconocimiento de gestos (requiere la biblioteca de MediaPipe)

async function iniciarControlPorGestos() {
    const videoElement = document.createElement('video');
    videoElement.setAttribute('playsinline', '');
    videoElement.style.display = 'none';
    document.body.appendChild(videoElement);

    // Cargar MediaPipe Hands
    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });
    camera.start();
}

function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandedness) {
        console.log("Mano detectada", results.multiHandLandmarks);
        // Aquí puedes agregar lógica para interpretar los gestos
    }
}

document.addEventListener("DOMContentLoaded", iniciarControlPorGestos);
