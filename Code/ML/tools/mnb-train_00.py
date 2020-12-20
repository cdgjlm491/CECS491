import numpy as np
import pandas as pd
import re

from sklearn.externals import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.preprocessing import LabelEncoder



def normalize_text(s) :
    '''s : a string'''
    s = s.lower()
    # remove punctuation that is not word-internal ... 
    # ... (e.g., hyphens, apostrophes)
    s = re.sub('\s\W',' ',s)
    s = re.sub('\W\s',' ',s)
    s = re.sub(r'[?()]', '',s)
    # make sure we didn't introduce any double spaces
    s = re.sub('\s+',' ',s)
    #
    return s 

def train() :
    '''docstring'''
    print("normalizing text ... ")
    news = pd.read_json("unbal-news_00.json")
    news['text'] = [normalize_text(s) for s in news['title']]
    #
    news.sample(10)
    #
    vectorizer = CountVectorizer()
    encoder = LabelEncoder()
    #
    x = vectorizer.fit_transform(news['text'])
    y = encoder.fit_transform(news['topic'])
    #
    joblib.dump(vectorizer, "vectorizer_02.joblib")  
    joblib.dump(encoder, "labeler_02.joblib")
    #
    print("vectorizing text ... ") 
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2)
    #
    print("fitting model ...")
    nb = MultinomialNB()
    nb.fit(x_train, y_train)
    # 
    joblib.dump(nb, "mnb-model_02.joblib") 
    print(nb.score(x_test, y_test))

def test() :
    '''docstring'''
    ttls = ["World Series Game 5 live updates: Dodgers lead Rays in fourth inning",
            "Renowned chef has yet another winner: ReMix Kitchen Bar in Long Beach",
            "Rapper Offset detained and released in Beverly Hills during pro-Trump demonstration",
            "Long Beach Transit to launch new public art installation for National Art Day",
            "Man who supplied weapons to San Bernardino terrorists to be sentenced Friday",
            "Clerk settles sexual harassment lawsuit against former L.A.-based appeals court judge"]
    #
    ttls = [normalize_text(s) for s in ttls]
    #
    model = joblib.load("mnb-model_02.joblib")
    vectorizer = joblib.load("vectorizer_02.joblib")
    labeler = joblib.load("labeler_02.joblib")
    #
    vec = vectorizer.transform(ttls).toarray().tolist()
    pred = model.predict(vec)
    tops = labeler.inverse_transform(pred)
    #
    for title, topic in zip(ttls, tops) :
        print("({})\n{}\n".format(topic, title))



if __name__ == "__main__" :
    #
    test()
    #
    print("\nDONE!")
