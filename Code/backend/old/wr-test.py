from geolib import geohash
from google.cloud import firestore



# Project ID is determined by the GCLOUD_PROJECT environment variable 
db = firestore.Client()
# write data
lat = 33.783822
lon = -118.114089
ghash = geohash.encode(lat, lon, 7)
#
doc_ref = db.collection("Long Beach").document("lbc-test")
doc_ref.set({
    "datePublished" : "2020-10-13T01:19:00.0000000Z",
    "name" : "Firefighters Rescue 3 Cats From <b>Long Beach</b> House Fire",
    "organization" : "Patch",
    "summary" : "According to the fire department...",
    "url" : "https://patch.com/new-york/longbeach/firefighters-rescue-3-cats-long-beach-house-fire",
    "geohash" : ghash
})
print("\nDONE!")
