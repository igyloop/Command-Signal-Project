import requests
import cv2
from gesture_detector.main import GestureDetector
from control_interface.serial_communication import SerialCommunication


class CarGestureControl:
    def __init__(self):
        print("Probando")
        self.cap = cv2.VideoCapture(1)
        self.cap.set(3, 720)
        self.cap.set(4, 360)
        print("camera encontrado")
        self.hand_gesture = GestureDetector()
        
        # self.communication = SerialCommunication()
        #miau

    def frame_processing(self):
        while True:
            t = cv2.waitKey(5)
            ret, frame = self.cap.read()
            command, draw_frame = self.hand_gesture.gesture_interpretation(frame)
            print("command: ")
            print(command)
            try:
                response = requests.get(f"http://172.23.116.245:3000/{command}")
            except requests.exceptions.Timeout:
                # Manejar el caso de que la solicitud excede el tiempo de espera
                print("La solicitud ha tardado demasiado. Verifica si el servidor está disponible.")
            except requests.exceptions.ConnectionError:
                # Manejar el caso de que no se pueda conectar al servidor
                print("Error de conexión. El servidor puede estar caído o inaccesible.")
            except requests.exceptions.HTTPError as err:
                # Manejar errores HTTP (códigos de estado 4xx o 5xx)
                print(f"Error HTTP: {err}")
            except requests.exceptions.RequestException as e:
                # Manejar cualquier otro tipo de excepción relacionada con la solicitud
                print(f"Error en la solicitud: {e}")

            # self.communication.sending_data(command)

            cv2.imshow('Car gesture control', draw_frame)
            if t == 27:
                break

        self.cap.release()
        cv2.destroyAllWindows()

detector = CarGestureControl()
detector.frame_processing()

