// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const http = require('http');

//const host = 'api.worldweatheronline.com';
const wwoApiKey = '6b1855c9d7344e099dc75413180405';
var apiToken= 'Z9HiW4adRe6jssm-mdpaV';
const host = 'skx55499.live.dynatrace.com';

exports.dialogflowWeatherWebhook = (req, res) => {
  // Get the city and date from the request
  let city = req.body.queryResult.parameters['geo-city']; // city is a required param

  // Get the date for the weather forecast (if present)
  let date = '';
  if (req.body.queryResult.parameters['date']) {
    date = req.body.queryResult.parameters['date'];
    console.log('Date: ' + date);
  }

  // Call the weather API
  callWeatherApi(city, date).then((output) => {
    res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
  }).catch(() => {
    res.json({ 'fulfillmentText': `I don't know the weather but I hope it's good!` });
  });
};

function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + '6b1855c9d7344e099dc75413180405' + '&date=' + date;
    console.log('API Request: ' + host + path);

    // Make the HTTP request to get the weather
    http.get({host: 'api.worldweatheronline.com', path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let forecast = response['data']['weather'][0];
        let location = response['data']['request'][0];
        let conditions = response['data']['current_condition'][0];
        let currentConditions = conditions['weatherDesc'][0]['value'];

        // Create response
        let output = `Current conditions in the ${location['type']} 
        ${location['query']} are ${currentConditions} with a projected high of
        ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
        ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
        ${forecast['date']}.`;

        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        console.log(`Error calling the weather API: ${error}`)
        reject();
      });
    });
  });
}

	exports.dialogServerInformation = (req, res) => {
	  let timeseriesId = 'com.dynatrace.builtin:host.cpu.user';
	  let relativeTime = 'day';
	  let aggregationType = 'avg';
	  let queryMode = 'total';

	  if (req.body.queryResult.parameters['timeseriesId']) {
		timeseriesId = req.body.queryResult.parameters['timeseriesId'];
		console.log('timeseriesId: ' + timeseriesId);
		}
	 if (req.body.queryResult.parameters['relativeTime']) {
		relativeTime = req.body.queryResult.parameters['relativeTime'];
		console.log('relativeTime: ' + relativeTime);
	  }
	  if (req.body.queryResult.parameters['aggregationType']) {
		aggregationType = req.body.queryResult.parameters['aggregationType'];
		console.log('aggregationType: ' + aggregationType);
	  }
	  if (req.body.queryResult.parameters['queryMode']) {
		queryMode = req.body.queryResult.parameters['queryMode'];
		console.log('queryMode: ' + queryMode);
	  }
		
	  // Call the weather API
	  callServerApi(apiToken,timeseriesId,relativeTime,aggregationType,queryMode).then((output) => {
		res.json({ 'fulfillmentText': output }); // Return the results of the weather API to Dialogflow
	  }).catch(() => {
	    res.json({ 'fulfillmentText': `I don't know the mentioned cpu utilisation but I hope it's good!` });
	  });
	};

	function callServerApi (apiToken,timeseriesId,relativeTime,aggregationType,queryMode) {
	  return new Promise((resolve, reject) => {
	    // Create the path for the HTTP request to get the weather
	    let path = '/api/v1/timeseries' +
	      '?Api-Token=' + apiToken + '&timeseriesId=' + timeseriesId + '&relativeTime=' + relativeTime  + '&aggregationType=' + aggregationType  + '&queryMode=' + queryMode ;
	   
	    console.log('API Request: ' + host + path);
		let output = "";

        $.ajax({
                                   url: 'https://skx55499.live.dynatrace.com'+path,
                                   type: 'GET',
                                   success: function(data) {
                                                   //var response = JSON.parse(data);
                                   var cpuTime = data["result"]["dataPoints"]["HOST-4688A9873FADC4D5"][0][1];
									console.log("success" + cpuTime);
                                    output = `current cpu utilisation on server HOST-4688A9873FADC4D5 is `+ cpuTime;
									// Resolve the promise with the output text
									resolve(output);               
                                   },
								   error:function(xhr, status, error) {
   									 console.log(xhr.responseText);
 									}                                    
                                });

		 console.log('API Request 1: ' + output);
	    // Make the HTTP request to get the weather
	  /*  http.get({host: host, path: path}, (res) => {
		  console.log('res ***'+ res.result.datapoints);			
	      let body = ''; // var to store the response chunks
	      res.on('data', (d) => { body += d; }); // store each response chunk
	      res.on('end', () => {
	        // After all the data has been received parse the JSON for desired data
	        console.log("body "+body);
			let response = res;
			console.log(response);
	         let cpuTime = response['result']['dataPoints']['HOST-4688A9873FADC4D5'][0][1];
	        // Create response
	        let output = `current cpu utilisation on server HOST-4688A9873FADC4D5 is `+ cpuTime;
	        // Resolve the promise with the output text
	        console.log(response);
	        resolve(output);
	      });    
      
	      res.on('error', (error) => {
	        console.log(`Error calling the weather API: ${error}`)
	        reject();
	      });
	    }); */
	  });
	}
