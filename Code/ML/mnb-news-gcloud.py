import joblib
import pandas as pd
import pickle
import re

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import LabelEncoder
#
#
#
'''
def normalize_text(s):
    s = s.lower()
    
    # remove punctuation that is not word-internal (e.g., hyphens, apostrophes)
    s = re.sub('\s\W',' ',s)
    s = re.sub('\W\s',' ',s)
    
    # make sure we didn't introduce any double spaces
    s = re.sub('\s+',' ',s)
    
    return s
#    
# read to dataframe
news = pd.read_json("news_v02.json")

news['text'] = [normalize_text(s) for s in news['title']]
print("done normalizing text")

# pull the data into vectors
vectorizer = CountVectorizer()
x = vectorizer.fit_transform(news['text'])

encoder = LabelEncoder()
y = encoder.fit_transform(news['topic'])

# persist label encoder
joblib.dump(encoder, "labeler.joblib")


labeler = joblib.load("labeler.joblib")
print(labeler.inverse_transform([5,4,3,2,1,0]))


'''
fn = open("model.pkl", "rb")
nb = pickle.load(fn)
fn.close()

print(nb.classes_)
