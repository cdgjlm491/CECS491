#Key 1 = 6b62615906f84b91b3cceb985b4011e6
#Key 2 = 8d5f2f4fa21746b9ba6aBcf8b4e214f9 - DIDNT WORK

#pip install newspaper3k
#pip install nltk

import requests #make the HTTP request
import json     #for saving the JSON result
import nltk
from newspaper import Article

subscription_key = "6b62615906f84b91b3cceb985b4011e6"
search_term = "Microsoft"
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/news/search"

headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
params  = {"q": "long-beach", "textDecorations": True, "textFormat": "HTML"}

response = requests.get(search_url, headers=headers, params=params)
response.raise_for_status()
response_json= response.json()


#clean up response json - only keep 'value' tag
tags_to_remove = ['_type','readLink','queryContext','totalEstimatedMatches','sort']
for tag in tags_to_remove:
    response_json.pop(tag)

articles = response_json['value'] #articles are under the 'value" key in response_json



urls = [article["url"] for article in response_json["value"]]

# nltk.download('punkt')

#webscraping
summaries = []
for url in urls: 
    news = Article(url)
    news.download()
    news.parse()
    news.nlp()
    summaries.append(news.summary)

important_tags = ['datePublished','name', 'organization', 'summary', 'url']

i=0
#Going through each article
for article in response_json["value"]:
    if 'image' in article:
      article.pop('image')
    #removing 'about' key-value
    if 'about' in article:
        article.pop('about')
    #want to save organization name from 'provider' key, then remove it and save under key 'organization'
    organization = article['provider'][0]['name']
    article.pop('provider')
    article['organization'] = organization
    article.pop('description')
    #add summary key
    if(i<len(articles)):
        article.update({'summary':summaries[i]}) 
        i = i+1

# i=0
# for article in articles:
#     if(i<len(articles)):
#         article.update({'summary':summaries[i]}) 
#         i = i+1
    


#Saving the JSON result into a JSON file
outf_json = json.dumps(response_json)  # output file - convert dict into json string
with open('scrape-samples.json', 'w') as outf:  # writing the json string to output file
    outf.write(outf_json)
'''
#print results
print(summaries)
print (len(urls))
print(len(summaries))
print(len(articles))

#prettyprint
print(json.dumps(response_json,indent = 4, sort_keys= True))

#print remaining keys
'''

print("\nDONE")
