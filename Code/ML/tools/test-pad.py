import joblib
import pandas as pd
import re

from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.preprocessing import LabelEncoder



#---
def normalize_text(s):
    s = s.lower()
    
    # remove punctuation that is not word-internal (e.g., hyphens, apostrophes)
    s = re.sub('\s\W',' ',s)
    s = re.sub('\W\s',' ',s)
    s = re.sub(r'[?]', '', s)
    
    # make sure we didn't introduce any double spaces
    s = re.sub('\s+',' ',s)
    
    return s
#---



#---
# TEST MODEL (multiple topics)
ttls = ["Lakers' LeBron James says there's nothing he can't do on the basketball court: 'I have no weakness",
	"How Likely Is Election Doomsday?", "Durham crowd-sourcing startup acquired by Virginia firm",
	"HHMI, one of the largest research philanthropies, will require immediate open access to papers",
	"Lenny Kravitz: I love Jason Momoa",
	"China’s ‘Golden Week’ Kicks Off in Boost to Battered Tourism Industry",
	"COVID-19 Daily Update 10-1-2020"]    

ttls = [normalize_text(s) for s in ttls]

model = joblib.load("mnb-news-gcloud_v01.joblib")
vectorizer = joblib.load("vectorizer_v01.joblib")
labeler = joblib.load("labeler_v01.joblib")

vec = vectorizer.transform(ttls).toarray().tolist()
# ~ print(vec[1])
# ~ print(len(vec[0]), "\n")

pred = model.predict(vec)

tops = labeler.inverse_transform(pred)
print(tops)

# ~ for title, topic in zip(ttls, tops) :
	# ~ print("({})\n{}\n".format(topic, title)) 
#---




#---
# TEST MODEL (single topic)
# ~ title = "Trump says he and first lady will begin 'quarantine process' after top aide Hope Hicks tests positive for Covid-19"
# ~ title = [normalize_text(title)]

# ~ model = joblib.load("mnb-news-gcloud_v01.joblib")
# ~ vectorizer = joblib.load("vectorizer_v01.joblib")
# ~ labeler = joblib.load("labeler_v01.joblib")

# ~ vec = vectorizer.transform(title).toarray().tolist()
# ~ print(vec)

# ~ pred = model.predict(vec)
# ~ topic = labeler.inverse_transform(pred)

# ~ print("\n", title[0])
# ~ print("({})".format(topic[0]))
#---




'''    
news = pd.read_json("news_v03.json")

news['text'] = [normalize_text(s) for s in news["title"]]

vectorizer = TfidfVectorizer()
x = vectorizer.fit_transform(news["text"])

labeler = LabelEncoder()
y = labeler.fit_transform(news["topic"])

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3)

nb = MultinomialNB()
nb.fit(x_train, y_train)

print("model accuracy:", nb.score(x_test, y_test))
'''



	
	
	




'''
news = pd.read_json("news_v02.json")

# ~ print(news.groupby(["topic"]).count())
# ~ print(news.sample(10))

vectorizer = CountVectorizer()
x = vectorizer.fit_transform(news['title'])

vocab = vectorizer.vocabulary_
print(len(vocab))
'''

print("\nDONE!")


