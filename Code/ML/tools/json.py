#!/usr/bin/env python
# coding: utf-8

# In[29]:


import joblib
import json
import numpy

titles = [
    "LA County Beaches to Stay Open for Labor Day", 
    "Video shows fatal OIS of California man that sparked protests",
    "LA County is easing COVID-19 restrictions again: What you need to know",
    "Census 2020: With deadline weeks away, organizations urge LA County residents to participate",
    "Man charged with stealing truck, killing 30-year-old woman in Gardena hit-and-run"
]

vectorizer = joblib.load("vectorizer.joblib")
titles = vectorizer.transform(titles)
print(titles[0].shape)

#model = joblib.load("mnb-news_gCloud.joblib")
#print(model.predict(titles))


'''
titles = vectorizer.transform(titles).toarray().tolist()
#print(len(titles), len(titles[0]), sep=", ")

toJSON = {
    "instances":[
        titles[0],
        titles[1],
        titles[2],
        titles[3],
        titles[4]
    ]
}
#print(json.dumps(toJSON))

outfile = open("samples.json", 'w')

json.dump(toJSON, outfile)

outfile.close()
'''
print("\nDONE")


# In[ ]:




