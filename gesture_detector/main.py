import numpy as np
from typing import List, Tuple

from gesture_detector.hand_gesture_extractor import HandProcessing
from gesture_detector.drawing_functions import DrawingFunctions


class GestureDetector:
    def __init__(self):
        self.hand_detector = HandProcessing(threshold_detection=0.9)
        self.draw = DrawingFunctions()

    def fingers_interpretation(self, fingers_up: List[int]) -> str:
        commands = {
            (1, 1, 0, 0, 0): 'U',
            (1, 0, 0, 0, 1): 'D',
            (1, 0, 0, 0, 0): 'L',
            (0, 0, 0, 0, 1): 'R',
            (1, 1, 1, 1, 1): 'F',
            (0, 0, 0, 0, 0): 'B',
            (0, 1, 1, 0, 0): 'Open',
            (1, 1, 1, 0, 0): 'Close',
        }
        return commands.get(tuple(fingers_up), "")

    def gesture_interpretation(self, img: np.ndarray) -> Tuple[str, np.ndarray]:
        frame = img.copy()
        frame = self.hand_detector.find_hands(frame, draw=True)
        hand_list, bbox = self.hand_detector.find_position(frame, draw_box=False)
        if len(hand_list) == 21:
            fingers_up = self.hand_detector.fingers_up(hand_list)
            command = self.fingers_interpretation(fingers_up)
            frame = self.draw.draw_actions(command, frame)
            return command, frame
        else:
            return "S", frame



