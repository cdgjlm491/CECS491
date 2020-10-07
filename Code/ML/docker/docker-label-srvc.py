'''========================================================================
1. listen for incoming headlines from collection service
2. receive jsonified headlines 
3. vectorize headlines
4. request labels from prediction server
5. jsonify labeled articles
6. send jsonified headlines to firestore
========================================================================'''
import googleapiclient.discovery
import joblib
import json
import os

from flask import Flask
#
#
#
def predict_json(project, model, instances, version=None) :
	'''
    Send json data to a deployed model for prediction.
    
    ARGS :
    ----
    project (str): project id where the AI Platform Prediction Model is 
		           deployed.
        
    model (str): model name.
        
    instances ([[float]]): List of input instances, where each input
                           instance is a list of floats.
        
    version: str, version of the model to target.
    
    
    RETURNS :
    -------
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
	
#==========================================================================
#
#
#
app = Flask(__name__)
	
@app.route('/')
def labeler() :
	target = os.environ.get("TARGET", "check!!!")

	print("opening samples.json...")
	# ~ sample = open("samples.json", 'r')
	
	print("deserializing json...")
	# ~ news = json.load(sample)
	
	print("constructing list of instances...")
	# ~ news = news["instances"]
	
	print("sending prediction request...")
	# ~ response = predict_json("localr-2020", "bow_model", news)
	
	# ~ labeler = joblib.load("labeler.joblib")
	
	# ~ print(labeler.inverse_transform(response))
	# ~ sample.close()
	print("\nDONE")	
	
	return "{}\n".format(target)


if __name__ == "__main__" :
	app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
	


