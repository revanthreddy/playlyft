angular.module('starter.services', [])

	.factory('Planner', function ($http) {


		var playlyft =
			{
				"route_id": "121212121",
				"stops": [
					{
						"position": 0,
						"venue_name": "Kingdom",
						"lat": 30.267099,
						"long": -97.742928,
						"artist_name": "Zeds dead",
						"start_time": "2016-03-18T02:30:00",
						"visited": "false"
					},
					{
						"position": 1,
						"venue_name": "stubbs",
						"lat": 30.268479,
						"long": -97.736181,
						"artist_name": "ed sharpe",
						"start_time": "2016-03-18T02:40:00",
						"visited": "false"
					},
					{
						"position": 2,
						"venue_name": "mohawk",
						"lat": 30.442023,
						"long": -97.752688,
						"artist_name": "KING",
						"start_time": "2016-03-19T02:30:00",
						"visited": "false"
					},
					{
						"position": 3,
						"venue_name": "zilker park",
						"lat": 30.266962,
						"long": -97.772859,
						"artist_name": "KING",
						"start_time": "2016-03-20T02:30:00",
						"visited": "false"
					}
				]

			};


		return {
			playlist: function (user_id, lat, long, callback) {

				var url = "https://ckme1eqpjl.execute-api.us-east-1.amazonaws.com/prod/plans"

				callback = callback || noop;

				callback(null, playlyft);
			},
			markStopAsDone: function (route_id, position, callback) {
				
				playlyft.stops[position].visited = "true"
				console.log(route_id + ' -- ' + position);
				callback(null,playlyft.stops);
			}
		};
	});