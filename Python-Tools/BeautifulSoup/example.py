import requests
from bs4 import BeautifulSoup

# Get the HTML from the URL
r = requests.get("https://www.google.com")
html = r.text

# Parse the HTML
soup = BeautifulSoup(html, "html.parser")

# Get the text from the HTML
text = soup.get_text()

# Print the text
print(text)

# Save the text to a file
with open("output.txt", "w") as f:
    f.write(text)

