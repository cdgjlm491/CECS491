import pandas as pd



news = pd.read_json("huffpost.json", lines=True)
news = news[["headline","category"]]
#
crime = news[news["category"] == "CRIME"]
#
crime.to_json("huffpost-crime.json")
#
print("\nDONE!")
