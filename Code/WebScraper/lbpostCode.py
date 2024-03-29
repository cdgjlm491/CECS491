from bs4 import BeautifulSoup
from requests import get
import pandas as pd
import itertools
import matplotlib
import time
import seaborn as sns
from time import sleep
from random import randint
sns.set()

#mask our scraper as a browser
headers = ({'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'})

titles = []
tags = []
times = []
authors = []
descs = []
links = []



n_pages = 0

#theres 10 articles per page on lbpost

for page in range(0,5):
    n_pages+=1
    lbpost = "https://lbpost.com/news/crime/"

    response = get(lbpost, headers=headers)


    html_soup = BeautifulSoup(response.text, 'html.parser')

    article_containers = html_soup.find_all('div', class_="article-inner col-md-7 d-flex flex-column")

    if article_containers != []:
        for container in article_containers:

            #get the titles of each article
            title = container.find_all('h2')[0].find_all('a')[0].text
            titles.append(title)

            #get the article link
            link = container.find_all('h2')[0].a.attrs['href']
            links.append(link)

            #get article content
            single = get(link, headers=headers)
            article_soup = BeautifulSoup(single.text, 'html.parser')
            article_text = article_soup.find_all('section', class_="container")
            paragraphs = article_text[0].find_all('p')
            paragraph_list= []
            for p in paragraphs:
                if ("Hyperlocal" not in p.text):
                    paragraph_list.append(p.text)
            
            final = " ".join(paragraph_list)
            descs.append(final)

            #get the timestamp
            timestamp = pd.to_datetime(container.time.attrs['datetime'])
            timestamp = timestamp.replace(tzinfo=None)
            times.append(timestamp)

            #get the author
            author = container.find_all('div', class_="post-author")[0].find_all('a')[0].text
            authors.append(author)

            #get the tag 
            tag = container.find_all('small')[1].find_all('li')[0].text
            tags.append(tag)

    else:
        break

    sleep(randint(1,2))


print('You scraped {} pages containing {} properties.'.format(n_pages, len(titles)))


cols = ['Title','Date Posted', 'Author', 'Description', 'Tag','Link']

longbeachpost = pd.DataFrame({'Title':titles, 'Date Posted':times, 'Author':authors, 'Description':descs, 'Tag':tags, 'Link':links})[cols]

longbeachpost.to_excel('lbpost_excel.xls')

longbeachpost.to_csv('lbpost_csv.csv', index = False)

longbeachpost.to_json('lbpost_final.json')




