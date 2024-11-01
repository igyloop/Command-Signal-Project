// Variables globales
let isConnected = false;
let isGestureControlActive = false;
let videoStream = null;
let waitlist = [];

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar los controles de la cámara
    initializeCameraControls();
});

function initializeCameraControls() {
    const gestureControl = document.getElementById('gestureControl');
    const stopGestureControl = document.getElementById('stopGestureControl');
    const toggleCamera = document.getElementById('toggleCamera');
    const closeCamera = document.getElementById('closeCamera');

    // Event listener para activar el control por gestos
    if (gestureControl) {
        gestureControl.addEventListener('click', function() {
            if (!isConnected) {
                alert("Por favor, inicie sesión primero.");
                return;
            }
            activateCamera();
        });
    }

    // Event listener para desactivar el control por gestos
    if (stopGestureControl) {
        stopGestureControl.addEventListener('click', function() {
            deactivateCamera();
        });
    }

    // Event listener para minimizar/maximizar la cámara
    if (toggleCamera) {
        toggleCamera.addEventListener('click', function() {
            const cameraContainer = document.getElementById('cameraContainer');
            if (cameraContainer.classList.contains('minimized')) {
                cameraContainer.classList.remove('minimized');
                this.textContent = 'Minimizar';
            } else {
                cameraContainer.classList.add('minimized');
                this.textContent = 'Maximizar';
            }
        });
    }

    // Event listener para cerrar la cámara
    if (closeCamera) {
        closeCamera.addEventListener('click', function() {
            deactivateCamera();
            const cameraContainer = document.getElementById('cameraContainer');
            cameraContainer.style.display = 'none';
        });
    }
}

function activateCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            const video = document.getElementById('video');
            const gestureControl = document.getElementById('gestureControl');
            const stopGestureControl = document.getElementById('stopGestureControl');
            
            videoStream = stream;
            video.srcObject = stream;
            video.play()
                .catch(function(error) {
                    console.error("Error playing video:", error);
                });

            isGestureControlActive = true;
            gestureControl.style.display = 'none';
            stopGestureControl.style.display = 'inline-block';
        })
        .catch(function(err) {
            console.error("Error al acceder a la cámara:", err);
            alert("No se pudo acceder a la cámara. Asegúrate de haber dado permiso y que no esté en uso.");
        });
}

function deactivateCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        const video = document.getElementById('video');
        video.srcObject = null;
        videoStream = null;
    }

    const gestureControl = document.getElementById('gestureControl');
    const stopGestureControl = document.getElementById('stopGestureControl');
    
    isGestureControlActive = false;
    gestureControl.style.display = 'inline-block';
    stopGestureControl.style.display = 'none';
}

// Función para mostrar las pestañas
function showTab(tabId) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let tab of tabs) {
        tab.style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'block';
}

// Función para conectar
function connect() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Por favor, complete todos los campos');
        return;
    }

    isConnected = true;
    document.getElementById('cameraContainer').style.display = 'block';
    document.getElementById('userState').textContent = "Conectado";
    document.getElementById('userStatus').style.display = 'block';
    document.getElementById('notificaciones').style.display = 'block';

    // Agregar el usuario a la lista de espera
    waitlist.push(email);
    updateWaitlistDisplay();

    // Actualizar el estado del robot
    document.getElementById('robotStatus').textContent = "El robot está en reposo.";
}

// Función para desconectar
function disconnect() {
    const email = document.getElementById('loginEmail').value;
    
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    isConnected = false;
    deactivateCamera();
    
    document.getElementById('cameraContainer').style.display = 'none';
    document.getElementById('userState').textContent = "Desconectado";
    document.getElementById('userStatus').style.display = 'none';
    document.getElementById('notificaciones').style.display = 'none';

    // Eliminar el usuario de la lista de espera
    waitlist = waitlist.filter(user => user !== email);
    updateWaitlistDisplay();

    document.getElementById('robotStatus').textContent = "El robot está en reposo.";
}

// Función para actualizar la lista de espera
function updateWaitlistDisplay() {
    const waitlistContainer = document.getElementById('waitlist');
    const waitlistMessage = document.getElementById('waitlistMessage');
    
    if (waitlist.length > 0) {
        waitlistMessage.textContent = waitlist.join(', ');
        waitlistContainer.style.display = 'block';
    } else {
        waitlistMessage.textContent = "No hay usuarios en espera.";
        waitlistContainer.style.display = 'none';
    }
}

// Función para registrar (puedes implementar la lógica según tus necesidades)
function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!name || !email || !password) {
        alert('Por favor, complete todos los campos');
        return;
    }

    alert('Registro exitoso! Por favor, inicie sesión.');
    showTab('loginTab');
}