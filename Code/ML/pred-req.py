'''
listen for unlabeled news articles instances
receive news article instances encoded in json files
vectorize headlines
request labels from prediction server
reserialize labeled articles into json
send articles instances to firestore
'''



#from sklearn.externals import joblib

import googleapiclient.discovery

import joblib
#
#
#
def predict_json(project, model, instances, version=None) :
	'''
    Send json data to a deployed model for prediction.
    
    ARGS :
        project (str): project id where the AI Platform Prediction Model is 
		 deployed.
        
        model (str): model name.
        
        instances ([[float]]): List of input instances, where each input
         instance is a list of floats.
        
        version: str, version of the model to target.
    
    RETURNS :
        Mapping {str: any}: dictionary of prediction results defined by the
		 model.
    '''
    # Create the AI Platform Prediction service object.
    # To authenticate set the environment variable
    # GOOGLE_APPLICATION_CREDENTIALS=<path_to_service_account_file>	
	service = googleapiclient.discovery.build('ml', 'v1')
	name = 'projects/{}/models/{}'.format(project, model)
	
	if version is not None:
		name += '/versions/{}'.format(version)
	
	response = service.projects().predict(
		name=name,
		body={'instances': instances}
	).execute()
	
	print("receiving response...")
	
	if 'error' in response:
		raise RuntimeError(response['error'])
		
	return response['predictions']

#
#
#   
import json
#
if __name__ == "__main__" :
	print("opening samples.json...")
	sample = open("samples.json", 'r')
	
	print("deserializing json...")
	news = json.load(sample)
	
	print("constructing list of instances...")
	news = news["instances"]
	
	print("sending prediction request...")
	response = predict_json("localr-2020", "bow_model", news)
	
	labeler = joblib.load("labeler.joblib")
	
	print(labeler.inverse_transform(response))
	sample.close()
	print("\nDONE")

