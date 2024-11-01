// app.js

let isArmAvailable = true; // Estado del brazo robótico
let userQueue = []; // Cola de usuarios
let observerMode = false; // Modo observador
const loadingIndicator = document.getElementById('loadingIndicator');
const statusElement = document.getElementById('status');

function acceder() {
    loadingIndicator.style.display = 'block'; // Mostrar animación de carga

    setTimeout(() => {
        loadingIndicator.style.display = 'none'; // Ocultar animación de carga
        if (isArmAvailable) {
            userQueue.push('Usuario'); // Agregar usuario a la cola
            verificarDisponibilidad(); // Verificar disponibilidad
        } else {
            alert("El brazo robótico está ocupado. Intenta más tarde.");
        }
    }, 2000); // Simulación de tiempo de conexión
}

function observar() {
    observerMode = true;
    alert("Ahora estás en modo observador.");
    actualizarEstado(); // Actualiza la visualización del estado
}

function verificarDisponibilidad() {
    if (userQueue.length > 0) {
        isArmAvailable = false; // Marcar brazo como no disponible
        statusElement.innerHTML = "Brazo robótico en uso por: " + userQueue[0];
        setTimeout(() => {
            userQueue.shift(); // Eliminar usuario de la cola después de uso
            isArmAvailable = true; // Liberar brazo
            statusElement.innerHTML = "Brazo robótico disponible.";
        }, 5000); // Simulación de uso del brazo robótico
    } else {
        statusElement.innerHTML = "Brazo robótico disponible.";
    }
}

function mostrarNotificacion(mensaje) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = mensaje;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000); // Eliminar notificación después de 3 segundos
}

function actualizarEstado() {
    // Actualizar el estado del usuario en la interfaz
    const estadoDiv = document.getElementById('estadoUsuarios');
    estadoDiv.innerHTML = observerMode ? "Modo observador activado" : "Controlando el brazo robótico";
}
