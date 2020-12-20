#!/usr/bin/env python
# coding: utf-8

# In[2]:


import pandas as pd


# In[3]:


def trim() :
    # pull from huffington post data set
    news = pd.read_json("huffPost.json", lines = True)
    #
    news = news[["headline", "category"]]
    #
    a = news[news["category"] == "BUSINESS"]
    b = news[news["category"] == "ENTERTAINMENT"]
    c = news[news["category"] == "FOOD & DRINK"]
    d = news[news["category"] == "HEALTHY LIVING"]
    e = news[news["category"] == "PARENTING"]
    
    # combine topic frames
    count = 5000
    a = a[:count]
    b = b[:count]
    c = c[:count]
    d = d[:count]
    e = e[:count]
    
    frames = [a,b,c,d,e]
    news = pd.concat(frames)
        
    idx = [i for i in range(len(news))]
    news.insert(0, "id", idx)
    news.set_index("id", inplace = True)
    
    news.to_json(r'huffPost_v03.json')


# In[4]:


if __name__ == "__main__" :
    trim()
    print("DONE!")


# In[5]:


def select() :
    # pull from uci dataset
    news = pd.read_csv("uci-news-aggregator.csv")
    news = news[["TITLE", "CATEGORY"]]
    #
    b = news[news["CATEGORY"] == 'b']
    t = news[news["CATEGORY"] == 't']
    e = news[news["CATEGORY"] == 'e']
    h = news[news["CATEGORY"] == 'm']
    #
    b["CATEGORY"] = b["CATEGORY"].replace(['b'], ["business"])
    t["CATEGORY"] = t["CATEGORY"].replace(['t'], ["science & tech"])
    e["CATEGORY"] = e["CATEGORY"].replace(['e'], ["entertainment"])
    h["CATEGORY"] = h["CATEGORY"].replace(['m'], ["health"])
    
    # pull from huffington post data set
    p_news = pd.read_json("huffPost.json", lines = True)
    p_news = p_news[["headline", "category"]]
    cols = {"headline" : "TITLE", "category" : "CATEGORY"}
    #
    p = p_news[p_news["category"] == "POLITICS"]
    p.rename(columns = cols, inplace = True)
    p["CATEGORY"] = p["CATEGORY"].replace(["POLITICS"], ['politics'])    
    #
    trav = p_news[p_news["category"] == "TRAVEL"]
    trav.rename(columns = cols, inplace = True)
    trav["CATEGORY"] = trav["CATEGORY"].replace(["TRAVEL"], ['travel'])     
    
    # combine topic frames
    count = len(trav)
    b = b[:count]
    t = t[:count]
    e = e[:count]
    h = h[:count]
    p = p[:count]
    
    frames = [b, t, e, h, p, trav]
    news = pd.concat(frames)
    
    cols = {"TITLE" : "title", "CATEGORY" : "topic"}
    news.rename(columns = cols, inplace = True)    
    
    idx = [i for i in range(len(news))]
    news.insert(0, "id", idx)
    news.set_index("id", inplace = True)
    
    news.to_json(r'news_v02.json')
    
    #print(news.groupby(["CATEGORY"]).count())
    #print(news.head(20))


# In[6]:


def counter() :
    news = pd.read_csv("uci-news-aggregator.csv")
    news = news[["TITLE", "CATEGORY"]]

    c = news[news["CATEGORY"] == 'm']
    c.count()    


# In[7]:


def drop_cols() :
    news = pd.read_csv("uci-news-aggregator.csv")
    news.drop("ID", axis = 1, inplace = True)
    news.drop("URL", axis = 1, inplace = True)
    news.drop("PUBLISHER", axis = 1, inplace = True)
    news.drop("STORY", axis = 1, inplace = True)
    news.drop("HOSTNAME", axis = 1, inplace = True)
    news.drop("TIMESTAMP", axis = 1, inplace = True)
    news.head(5)


# In[ ]:




