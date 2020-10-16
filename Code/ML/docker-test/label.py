import joblib
import json
import re



with open("stopwords.txt", 'r') as f :
    STOPWORDS = [line.rstrip() for line in f]

def normalize_text(s) :
    '''s : a string'''
    s = s.lower()
    # remove <b> tags
    s = re.sub('(<b>)|(</b>)', '', s)
    # remove punctuation that is not word-internal ... 
    # ... (e.g., hyphens, apostrophes)
    s = re.sub('\s\W',' ',s)
    s = re.sub('\W\s',' ',s)
    s = re.sub(r'[?()]', '',s)
    # make sure we didn't introduce any double spaces
    s = re.sub('\s+',' ',s)
    #
    return s 

def cut_stop_words(s) : 
    '''text : a string'''
    grams = s.split()
    payload = [g for g in grams if g not in STOPWORDS]
    #
    return ' '.join(payload)



class LabelNews(object) :
    '''Assigns topics to unlabeled news headlines.'''
    def __init__(self, labeler, model, news, vectorizer) :
        '''
        ARGS
        ----
        labeler : ...  
        model : MultiNomialNB() object  
        news (dict) : in JSON format
        vectorizer (string) : ...
        '''
        #
        self._labeler = labeler
        self._model = model
        self._news = news["value"]
        self._vectorizer = vectorizer

    def assign_topics(self) :
        '''Adds topics to each item in _news.
        #
        RETURNS
        -------
        labeled news items as JSON object
        '''
        titles = [normalize_text(n["name"]) for n in self._news]
        titles = [cut_stop_words(t) for t in titles]
        #
        model_in = self._vectorizer.transform(titles).toarray().tolist()
        #
        model_out = self._model.predict(model_in)
        #
        topics = self._labeler.inverse_transform(model_out)
        #
        for article, topic in zip(self._news, topics) :
            article["topic"] = topic
        to_json = {"value" : self._news}
        #
        return json.dumps(to_json)



# ~ if __name__ == "__main__" :
    # ~ #
    # ~ labeler = joblib.load("labeler_v01.joblib")
    # ~ model = joblib.load("mnb-news-gcloud_v01.joblib")
    # ~ with open("cerritos.json") as f :
        # ~ news = json.load(f)
    # ~ vectorizer = joblib.load("vectorizer_v01.joblib")
    # ~ #
    # ~ ln = LabelNews(labeler, model, news, vectorizer)
    # ~ json_obj = ln.assign_topics()
    # ~ print(json_obj)
    # ~ #
    # ~ print("\nDONE!")
