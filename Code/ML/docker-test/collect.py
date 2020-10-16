# Key 1 = 6b62615906f84b91b3cceb985b4011e6
# Key 2 = 8d5f2f4fa21746b9ba6aBcf8b4e214f9 - DIDNT WORK

import joblib
import json  # for saving the JSON result
import requests  # make the HTTP request
import os

from flask import Flask
from label import LabelNews
from newspaper import Article, ArticleException



# information needed to make the request
subscription_key = "6b62615906f84b91b3cceb985b4011e6"
search_term = "Microsoft"
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/news/search"


def webscrape(city, key, url):
    """ Creates a request for news article that contain a city, gets the 
    response in JSON format, and both adds and removes information based 
    on what we need
    
    RETURNS
    -------
    A python dictionary in JSON format.
    """
    
    # header contains info to give us access to the site at url
    headers = {"Ocp-Apim-Subscription-Key": key}  
    params = {"q": city, "textDecorations": True, 
		"textFormat": "HTML", "freshness": "Week"}  
    
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    response_json = response.json()

    # clean up response json - only keep 'value' tag
    tags_to_remove = ['_type', 'readLink', 'queryContext',
		'totalEstimatedMatches', 'sort']
    for tag in tags_to_remove:
        response_json.pop(tag)
	# articles are under the 'value" key in response_json
    articles = response_json['value']  

    urls = [article["url"] for article in response_json["value"]]

    # nltk.download('punkt')

    # webscraping

    summaries = []
    for url in urls:
        try:
         news = Article(url)
         news.download()
         news.parse()
         news.nlp()
         summaries.append(news.summary)
        except ArticleException:
          print("Forbbiden Article")


    important_tags = ['datePublished', 'name', 
		'organization', 'summary', 'url']
    cont = []
    i = 0
    # Going through each article
    for article in response_json["value"]:
        # want to save organization name from 'provider' key, ... 
        # then remove it and save under key 'organization'
        organization = article['provider'][0]['name']
        article.pop('provider')
        article['organization'] = organization

        # add summary key & values
        if (i < len(summaries)):
			# add summary to article
            article.update({'summary': summaries[i]})  
            i = i + 1

        # remove other unneccessary tags
        res = dict((k, article[k]) for k in important_tags if k in article)
        cont.append(res)

    # double check that articles were added correctly
    print("BEFORE CLEAR: " + str(len(response_json["value"])))
    response_json["value"].clear()
    print("AFTER CLEAR: " + str(len(response_json["value"])))
    print("APPENDING")
    for j in range(len(cont)):
        response_json["value"].append(cont[j])
    print("NEW LENGTH: " + str(len(response_json["value"])))

    # prettyprint
    print(json.dumps(response_json, indent=4, sort_keys=True))

    return response_json

#==========================================================================

app = Flask(__name__) 
#
labeler = joblib.load("labeler_v01.joblib")
model = joblib.load("mnb-news-gcloud_v01.joblib")
vectorizer = joblib.load("vectorizer_v01.joblib")


@app.route('/')
def collect() :
    #news = webscrape("long-beach", subscription_key, search_url)
    #news = webscrape("lakewood", subscription_key, search_url)
    #news = webscrape("cerritos", subscription_key, search_url)
    #news = webscrape("bellflower", subscription_key, search_url)
    with open("cerritos.json") as f :
        news = json.load(f)
    
    ln = LabelNews(labeler, model, news, vectorizer)
    to_firestore = ln.assign_topics()
    
    dct = json.loads(to_firestore)["value"]
    text = []
    for i in dct :
        text.append(i["topic"] + " : " + i["name"])
    text = ";_____".join(text)
    
    name = os.environ.get('NAME', text)
    return "{}".format(name)



if __name__ == "__main__" :
    app.run(debug=True, host="0.0.0.0", port=os.environ.get("PORT", 8080))
