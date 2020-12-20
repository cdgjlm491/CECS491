#!/usr/bin/env python
# coding: utf-8

# In[ ]:


# https://www.kaggle.com/kinguistics/classifying-news-headlines-with-scikit-learn/notebook
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import re

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.preprocessing import LabelEncoder
from wordcloud import ImageColorGenerator, STOPWORDS, WordCloud


# In[ ]:


# read to dataframe
news = pd.read_json("news_v02.json")

print("title count:", len(news))
print(news.groupby(["topic"]).count())
news.sample(10)


# In[ ]:


def normalize_text(s):
    s = s.lower()
    
    # remove punctuation that is not word-internal (e.g., hyphens, apostrophes)
    s = re.sub('\s\W',' ',s)
    s = re.sub('\W\s',' ',s)
    
    # make sure we didn't introduce any double spaces
    s = re.sub('\s+',' ',s)
    
    return s

news['text'] = [normalize_text(s) for s in news['title']]
print("done normalizing text")
news.sample(10)


# In[ ]:


# pull the data into vectors
vectorizer = CountVectorizer()
x = vectorizer.fit_transform(news['text'])
vocab = vectorizer.vocabulary_
print(len(vocab))
#print(vocab)

encoder = LabelEncoder()
y = encoder.fit_transform(news['topic'])

# split into train and test sets
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)
print("done vectorizing text")


# In[ ]:


# wordcloud
text = [key for key in vocab]
text = " ".join(text)
stop = set(STOPWORDS)
stop.add("will")
wordcloud = WordCloud(stopwords = stop, background_color = "white").generate(text)

plt.imshow(wordcloud, interpolation = "bilinear")
plt.axis("off")
plt.show()


# In[ ]:


nb = MultinomialNB()
nb.fit(x_train, y_train)

print(nb.score(x_test, y_test))

print("\nDONE!")

