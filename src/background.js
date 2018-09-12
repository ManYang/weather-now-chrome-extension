const axios = require('axios');
import { key } from 'key.js';

export const api = axios.create({
	baseURL: 'http://api.openweathermap.org/data/2.5',
	timeout: 5000,
});

// getIcon = (weather_main) => {
// 	// https://openweathermap.org/weather-conditions
// 	switch(weather_main) {
// 	    case "Thunderstorm":
// 	        return "Thunderstorm";
// 	        break;
// 	    case "Drizzle":
// 	        return "Drizzle";
// 	        break;
// 	    case "Rain":
// 	        return "Rain";
// 	        break;
// 	    case "Rain":
// 	        return "Rain";
// 	        break;
//         case "Snow":
//             return "Snow";
//             break;
//         case "Atmosphere":
//             return "Atmosphere";
//             break;
//         case "Clear":
//             return "Clear";
//             break;
//         case "Clouds":
//             return "Clouds";
//             break;
// 	    default:
// 	        return "Clear";
// 	}
// }

var perviousWeather = null;

function showWeather() {
	navigator.geolocation.getCurrentPosition(function(position) {
	    console.log("latitude=" + position.coords.latitude +
	    ", longitude=" + position.coords.longitude);
	    // get weather based on location
	    api.get('/weather', {params:{lat: position.coords.latitude, lon: position.coords.longitude,  APPID: key }}).then(res => {
	    	// depends on diff data set diff icon
	    	// chrome.browserAction.setIcon({ path: "http://openweathermap.org/img/w/" + res.data.weather[0].icon+ ".png" }); too ugly

	    	// display day/night icon based on sunset
	    	var sunset = new Date(res.data.sys.sunset*1000).getTime();
	    	var now = new Date().getTime();
	    	console.log('now', now, 'sunset', sunset);
	    	if (now <= sunset) {
	    		chrome.browserAction.setIcon({ path: "images/" + res.data.weather[0].main + ".png" });
	    	} else {
	    		chrome.browserAction.setIcon({ path: "images/" + res.data.weather[0].main + "-dark.png" });
	    	}
	    	if (!perviousWeather) {
	    		perviousWeather = res.data.weather[0].main;
	    	}
	    	// if weather changes, show alert
	    	if (perviousWeather !== res.data.weather[0].main) {
	    		chrome.browserAction.setBadgeText({ text: "Changed" });
	    		perviousWeather = res.data.weather[0].main;
	    	}
	    	// todo:set diff background color based on sunset
	    	chrome.extension.onConnect.addListener(function(port) {
	    		port.postMessage({ from: 'bg', data: res.data });
	    	})
	    });
	});
}

showWeather();

// setInterval(showWeather, 1000*60);

