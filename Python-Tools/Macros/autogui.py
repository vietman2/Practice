import pyautogui

# move mouse to the right
pyautogui.moveRel(100, 0, duration=0.25)
# move mouse down
pyautogui.moveRel(0, 100, duration=0.25)
# move mouse to the left
pyautogui.moveRel(-100, 0, duration=0.25)
# move mouse up
pyautogui.moveRel(0, -100, duration=0.25)

# click the mouse
pyautogui.click()

# type some text
pyautogui.typewrite('Hello world!', interval=0.25)

# move mouse to button and click it
button_position = pyautogui.locateCenterOnScreen('button.png')
pyautogui.moveTo(button_position)
pyautogui.click()