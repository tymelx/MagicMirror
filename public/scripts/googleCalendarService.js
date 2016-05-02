/* global _CLIENTID */
angular.module("dashboard").factory("GoogleCalendar", ["$http", function($http) {
	var _SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
	var _CLIENTID = null;
	
	var isAuthenticated = function(callback) {
		_getClientID(function(id) {
			gapi.auth.authorize({
				'client_id': id,
				'scope': _SCOPES.join(' '),
				'immediate': true
			}, function(authResult) {
				if (authResult && !authResult.error) {
					callback(true);
				} else {
					callback(false)
				}
			});
		})
	}
	
	function _getClientID(callback) {
		if (_CLIENTID) {
			return _CLIENTID;
		} else {
			$http.get("/googlecredentials").success(function(data) {
				callback(data);
			})
		}
	}
	
	var authenticate = function(callback) {
		_getClientID(function(id) {
			gapi.auth.authorize({client_id: id, scope: _SCOPES, immediate: false}, function(authResult) {
				if (authResult && !authResult.error) {
					callback(true);
				} else {
					callback(false)
				}
			});
		})
	}
	
	var loadCalendarEvents = function(callback) {
		gapi.client.load('calendar', 'v3', function() {
			var todayStart = moment().minute(0).hour(0).second(0),
            todayStartISO = (todayStart.toDate().toISOString()),
            todayEnd = todayStart.add("days", 1).add("seconds", -1),
            todayEndISO = (todayEnd.toDate().toISOString());
        
			var request = gapi.client.calendar.events.list({
				'calendarId': 'primary',
				'timeMin': todayStartISO,
				'timeMax': todayEndISO,
				'showDeleted': false,
				'singleEvents': true,
				'maxResults': 10,
				'orderBy': 'startTime'
			});

        	request.execute(function(resp) {
          		var events = resp.items;
				var descriptions = []
          		if (events.length > 0) {
					for (i = 0; i < events.length; i++) {
						var event = events[i];
						var when = event.start.dateTime;
						var end = event.end.dateTime;
						if (!when) {
							when = event.start.date;
						}
						if (!end) {
							end = event.end.date;
						}
						var eventDescription = (event.summary + ' (' + moment(when).format("hh:mm A") + ' - ' + moment(end).format("hh:mm A") + ')');
						descriptions.push(eventDescription);
					}
				} else {
					//empty state
				}
				
				callback(descriptions)
			});
		});
	}
	
	return {
		authenticate: authenticate,
		isAuthenticated: isAuthenticated,
		loadCalendarEvents: loadCalendarEvents
	}
}])