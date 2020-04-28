import requests

from bs4 import BeautifulSoup 

r=requests.get("ENTER URL HERE")

print(r.status_code)