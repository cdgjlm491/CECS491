from bs4 import BeautifulSoup
from requests import get
import pandas as pd
import itertools
import matplotlib
import seaborn as sns
sns.set()

headers = ({'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'})

lbpost = "https://lbpost.com/news/crime/"

response = get(lbpost, headers=headers)

print(response)

print (response.text[:1000])

html_soup = BeautifulSoup(response.text, 'html.parser')

article_containers = html_soup.find_all('div', class_="article-inner col-md-7 d-flex flex-column")

first = article_containers[0]

title = first.find_all('h2')[0].find_all('a')[0].text

dt = first.time.attrs['datetime']

timestamp = pd.to_datetime(dt)

author = first.find_all('div', class_="post-author")[0].find_all('a')[0].text

tag = first.find_all('small')[1].find_all('li')[0].text

description = first.find_all('section', class_='flex-grow-1')[0].find_all('p')[0].text

#for url in first.find_all('a'):
#    print(url.get('href'))

print(title)
print(tag)
print(timestamp)
print(author)
print(description)






