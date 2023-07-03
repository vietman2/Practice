from requests import get
from bs4 import BeautifulSoup

base_url = "https://weworkremotely.com/remote-jobs/search?term="
search_term = "python"

response = get(f"{base_url}{search_term}")

if response.status_code != 200:
    print("Error: ", response.status_code)
    exit()
else:
    soup = BeautifulSoup(response.text, "html.parser")
    jobs = soup.find_all('section', class_='jobs')
    for job in jobs:
        job_posts = job.find_all('li')
        for job_post in job_posts:
            print(job_post)
            print()