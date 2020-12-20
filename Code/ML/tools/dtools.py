import json
import pandas as pd



def preview_json(fname, feature, n=10) :
    '''docstring'''
    df = pd.read_json(fname)
    print(df.groupby([feature]).count())
    print(df.sample(n))
    #
    print("\nDONE!")

def csv_to_json(csv_in, json_out, n=10) :
    '''docstring'''
    df = pd.read_csv(csv_in, sep=',')
    df.to_json(json_out)
    #
    print("frame length: ", len(df), end="\n\n")
    print(df.sample(n))

def extract_feature(csv_in, json_out, feature, n=10) :
    '''docstring'''
    print("reading csv ...\n")
    df = pd.read_csv(csv_in)
    print("isolating titles ... \n")
    s = df[feature]
    print("writing json ...\n")
    s.to_json(json_out)
    #
    print("series length: ", len(s), end="\n\n")
    print(s.sample(n))

def trim(jin, jout, feature, idx) :
    '''docstring'''
    df = pd.read_json(jin)
    #
    s = df[feature]
    #
    trim = [s.loc[i] for i in range(idx, len(s))]
    #
    to_json = json.dumps(trim)
    with open(jout, 'w') as f :
        f.write(to_json)

def allnews_crime() :
    key_words = []
    with open("crime-grams.txt", 'r') as f :
        for line in f.readlines() :
            key_words.append(line.rstrip())
    #
    with open("allnews-slim.json") as f :
        news = json.load(f)
    #
    crime = []
    for item in news :
        hit = False
        for word in key_words :
            if word in item.lower() :
                hit = True
                break
        if hit is True :
            crime.append(item)
    #
    print("crime articles:", len(crime))
    #
    with open("crime.txt", 'w') as out :
        for item in crime :
            out.write(item + "\n")

def stitch() :
    '''docstring'''
    news = pd.read_json("news_v03.json")
    #
    bus = news[news["topic"] == "business"]
    ent = news[news["topic"] == "entertainment"]
    hea = news[news["topic"] == "health"]
    pol = news[news["topic"] == "politics"]
    sci = news[news["topic"] == "science & tech"]
    spo = news[news["topic"] == "sports"]
    tra = news[news["topic"] == "travel"]
    #
    cri = pd.read_json("huffpost-crime.json")
    cols = {"headline" : "title", "category" : "topic"}
    cri.rename(columns=cols, inplace=True)
    cri["topic"] = cri["topic"].replace(["CRIME"], ["crime"])
    #
    frame = [bus, cri, ent, hea, pol, sci, spo, tra]
    df = pd.concat(frame)
    #
    idx = [i for i in range(len(df))]
    df.insert(0, "id", idx)
    df.set_index("id", inplace=True)
    #
    print(df.groupby(["topic"]).count())
    print(df.sample(10))
    #
    df.to_json("unbal-news_00.json") 

def to_text(topic) :
    '''docstring'''
    news = pd.read_json("unbal-news_00.json")
    df = news[news["topic"] == topic] 
    #
    with open(topic+".txt", 'w') as out :
        #
        print("writing {} to txt ...\n".format(topic))
        #
        for i in range(len(df)) :
            row = df.iloc[i]["title"]
            out.write(row + "\n")
    
#===============================================================================


if __name__ == "__main__" :
    #

    #
    print("\nDONE!")
