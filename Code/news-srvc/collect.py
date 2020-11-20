import joblib
import json 
import random as rand
import requests 
import os

from flask import Flask
from geolib import geohash
from google.cloud import firestore
from label import LabelNews
from newspaper import Article, ArticleException
#===============================================================================


# information needed to make the request
subscription_key = "6b62615906f84b91b3cceb985b4011e6"
search_term = "Microsoft"
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/news/search"
cities = ["long-beach","lakewood","cerritos", "bellflower"]

def webscrape(city, key, url):
    """ Creates a request for news article that contain a city, gets the 
    response in JSON format, and both adds and removes information based 
    on what we need.
    
    RETURNS
    -------
    A list of headline items, each item is a dictionary.
    """
    
    # header contains info to give us access to the site at url
    headers = {"Ocp-Apim-Subscription-Key": key}  
    params = {"q":city,"textDecorations": True,
              "textFormat":"HTML","freshness":"Week"}  
    print("pulling from Microsoft ...\n")
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    response_json = response.json()
    # clean up response json - only keep 'value' tag
    print("isolating 'value' data ...\n")
    tags_to_remove = ['_type','readLink','queryContext',
                      'totalEstimatedMatches','sort']
    for tag in tags_to_remove:
        response_json.pop(tag)
    # articles are under the 'value" key in response_json
    articles = response_json['value']  
    # get summaries
    print("retrieving summaries ...\n")
    for item in articles :
        try:
            news = Article(item["url"])
            news.download()
            news.parse()
            news.nlp()
            item["summary"] = news.summary
        except ArticleException:
            print("Forbidden Article")
            item["summary"] = "no summary" #-!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    important_tags = ["city",'datePublished','name',
                      'organization','summary','url']
    # clean each article
    print("\ncollecting payload ...\n")
    payload = []
    for item in articles :
        # want to save organization name from 'provider' key, ... 
        # ... then remove it and save under key 'organization'
        organization = item['provider'][0]['name']
        item.pop('provider')
        item['organization'] = organization
        item["city"] = city
        # remove other unneccessary tags
        money = dict((k, item[k]) for k in important_tags)
        #remove unnecessary symbols in the headline and summaries
        if ("<b>" in item['name']):
          item['name'] = item["name"].replace('<b>','')
          item['name'] = item["name"].replace('</b>','')

        payload.append(money)
                
    return payload
#===============================================================================
def gen_id(news_item) :
    '''generates a unique id for a news headline by concatenating the article's
    geohash with its publication date.
    
    ARGS
    ---
    news_item (dict) : news headline object in format ...
    
    RETURNS
    ---
    unique id as a string
    '''
    return news_item["geohash"] + '_' + news_item["datePublished"]
    
def locate(news_lst, city) :
    '''Temporary geohasher assigns random locations based on city parameter; also 
    assigns unique id's
    
    ARGS
    ---
    news_lst : list of news articles in format ...
    city (string) : collection id
    
    RETURNS
    ---
    list of news articles in format ...
    '''
    #long beach values
    if (city == "long-beach"):
        max_lat = 33.8765
        min_lat = 33.7664
        max_lon = -118.0997
        min_lon = -118.2042

    #cerritos values
    elif (city == "cerritos"):
        max_lat = 33.8879
        min_lat = 33.8459
        max_lon = -118.0287
        min_lon = -118.1085
    #
    #bellflower values
    elif (city == "bellflower"):
        max_lat = 33.9105
        min_lat = 33.8656
        max_lon = -118.1067
        min_lon = -118.1514
    #
    #lakewood values
    elif (city == "lakewood"):
        max_lat = 33.8692
        min_lat = 33.8202
        max_lon = -118.0590
        min_lon = -118.1677


    rand.seed()
    #
    for item in news_lst :
        lati = min_lat + (max_lat-min_lat)*rand.random()
        long = min_lon + (max_lon-min_lon)*rand.random()
        ghash = geohash.encode(lati, long, 7)
        loncoord = float(geohash.decode(ghash).lat)
        latcoord = float(geohash.decode(ghash).lon)
        item["geohash"] = ghash
        item["id"] = gen_id(item)
        #item["location"] = str(loncoord) + "," + str(latcoord)
        #item["longitude"] = loncoord
        #item["latitude"] = latcoord
        item["location"] = firestore.GeoPoint(latcoord, loncoord)
    return news_lst
#===============================================================================



app = Flask(__name__) 
#
labeler = joblib.load("labeler_02.joblib")
model = joblib.load("mnb-model_02.joblib")
vectorizer = joblib.load("vectorizer_02.joblib")


@app.route('/')
def collect() :
  for c in cities:
    # scrape
    news = webscrape(c, subscription_key, search_url)
    # geohash and id
    news_lst = locate(news,c)
    # label
    ln = LabelNews(labeler, model, news_lst, vectorizer)
    news_lst = ln.assign_topics()
    #
    # Project ID determined by GCLOUD_PROJECT environment variable 
    print("writing to Firestore ...\n")
    db = firestore.Client()    
    for item in news_lst :
        #doc_ref = db.collection(item["city"]).document(item["id"])
        doc_ref = db.collection("Testing Collections").document(c).collection("Articles").document(item["id"])
        doc_ref.set({
            "datePublished" : item["datePublished"],
            "name" : item["name"],
            "organization" : item["organization"],
            "summary" : item["summary"],
            "url" : item["url"],
            "geohash" : item["geohash"],
            #"location" : firestore.GeoPoint(item["latitude"], item["longitude"]),
            "location" : item["location"],
            "topic" : item["topic"],
        })    
    #
    text = []
    for i in news_lst :
        text.append(i["topic"] + " : " + i["name"])
    text = ";_____".join(text)
    
    name = os.environ.get('NAME', text)
    return "{}".format(name)



if __name__ == "__main__" :
    app.run(debug=True, host="0.0.0.0", port=os.environ.get("PORT", 8080))
    #
    print("\nDONE!")
