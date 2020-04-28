from bs4 import BeautifulSoup
from requests import get
from selenium.webdriver import ActionChains
from selenium import webdriver

import pandas as pd
import itertools
import matplotlib
import time
import seaborn as sns
from time import sleep
from random import randint
sns.set()

titles = []
#tags = []  #still need to find
times = []
authors = []
#descs = []   #does not have description
links = []

""" This program scrapes KTLA for articles in a specific city entered"""
#headers = ({'User-Agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'})

options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--incognito')
options.add_argument('--headless')
driver = webdriver.Chrome(executable_path = "C:/Users/riana/Desktop/CECS491A/Code/chromedriver.exe")

driver.get("https://ktla.com/tag/norwalk")
more_buttons = driver.find_elements_by_class_name("Load More")
for x in range(len(more_buttons)):
  if more_buttons[x].is_displayed():
      driver.execute_script("arguments[0].click();", more_buttons[x])
      time.sleep(1)
page_source = driver.page_source



n_pages = 0

for page in range(0,5):
    n_pages +=1
    html_soup = BeautifulSoup(page_source, 'html.parser')
    article_containers = html_soup.find_all('h2', class_="article-list__article-title")
    article_containers += html_soup.find_all('h3', class_="article-list__article-title")
    
    #need to loop through article containers
    if article_containers != []:
        for container in article_containers:
    
             #getting the title
            title = container.find_all('a')[0].text
            title = title.replace("\t","")
            title = title.replace("\n","")
            titles.append(title)

            #getting the link
            link = container.find_all('a')[0].attrs["href"]
            links.append(link)

            #going to go into article link to get author, date
            ktla_article = link
            driver.get(ktla_article)
            article_response = driver.page_source
            html_soup_2 = BeautifulSoup(article_response, 'html.parser')
            article_info = html_soup_2.find_all('div',class_="article-meta")
            article =article_info[0]

            #getting the author
            author = article.find_all('a')[0].text
            authors.append(author)

             #getting the timestamp
            timestamp = pd.to_datetime(article.time.attrs['datetime'])
            timestamp = timestamp.replace(tzinfo=None)
            times.append(timestamp)
        btn = driver.find_element_by_xpath("//*[text()='Load More']")
        ActionChains(driver).move_to_element(btn).perform()
        driver.execute_script("arguments[0].scrollIntoView();", btn)

    else:
        break

    sleep(randint(1,2))

print('You scraped {} pages containing {} properties.'.format(n_pages, len(titles)))



cols = ['Title','Date Posted', 'Author','Link']

ktla_pages = pd.DataFrame({'Title':titles, 'Date Posted':times, 'Author':authors, 'Link':links})[cols]

ktla_pages.to_json('ktla.json')



