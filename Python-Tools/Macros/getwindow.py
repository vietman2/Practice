import pygetwindow

window = pygetwindow.getWindowWithTitle('Notepad')[0]

new_position = (100, 100)
window.moveTo(new_position[0], new_position[1])