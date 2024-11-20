from flask import Flask, render_template, Response, jsonify
import cv2
from gesture_detector.main import GestureDetector

app = Flask(__name__, template_folder="public")  # Indica que las plantillas están en "public"
camera = cv2.VideoCapture(0)
gesture_detector = GestureDetector()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    def generate():
        while True:
            success, frame = camera.read()
            if not success:
                break
            else:
                command, frame = gesture_detector.gesture_interpretation(frame)
                _, buffer = cv2.imencode('.jpg', frame)
                frame = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/gesture_command')
def gesture_command():
    return jsonify({"command": "DemoCommand"})  # Este es solo un ejemplo, conecta con tu lógica real

if __name__ == '__main__':
    app.run(host='127.0.0.4', port=3030, debug=True)
