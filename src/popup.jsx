import React, { Component } from 'react';
import './Popup.scss';

class Popup extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	data: {},
            isDark: false,
	    };
	}
	componentWillMount () {
		var port = chrome.extension.connect({
			 name: "togglePlugin"
		});

		port.onMessage.addListener((msg) => {
			 console.log("message recieved" + JSON.stringify(msg.data));
			 if(msg.from === 'bg') {
                const sunset = new Date(msg.data.sys.sunset*1000).getTime();
                const now = new Date().getTime();
			 	this.setState({ data: msg.data, isDark: now >= sunset });
			 }
		});
	}

    Temperature = temp => {
        return temp - 273.15;
    }

    render() {
        return (
        	<div id="weather-panel" className="weather-panel">
                <span className={`weather-icon ${this.state.isDark ? 'dark' : 'light'}`}>
                    {
                        this.state.isDark ?
                        <img src={`../images/${this.state.data.weather? this.state.data.weather[0].main : 'Clear'}-dark.png`} />
                        :
                        <img src={`../images/${this.state.data.weather? this.state.data.weather[0].main : 'Clear'}.png`} />
                    }
                </span>    
        		<div className="main-weather">
        			<div id="weather-status" className="weather-status">
        				{ this.state.data.weather? this.state.data.weather[0].description : null }
        			</div>
        			<div id="weather-condition" className="weather-condition">
        				<div id="visibility" className="condition-item">Visiblity: { this.state.data? this.state.data.visibility : null }</div>
        				<div id="humidity" className="condition-item">Humidity: { this.state.data.main? this.state.data.main.humidity : null }</div>
        				<div id="pressure" className="condition-item">Pressure: { this.state.data.main? this.state.data.main.pressure : null }</div>
        				<div id="wind" className="condition-item">Wind: { this.state.data.wind? this.state.data.wind.speed : null } { this.state.data.wind? this.state.data.wind.degree : null }</div>
        			</div>
        		</div>

        		<div className="location-weather">
        			<label htmlFor="xBxHack">
        				<i id="set-icon" className="fa set-icon fa-ellipsis-v"></i>
        			</label>
        			<div className="location-status">
        				<input type="checkbox" id="xBxHack"/>
        				<div id="city" className="city">{this.state.data.name}</div>
        				<input id="userCity" className="userCity" type="text" placeholder="Enter City"/>
        				<div id="location" className="location">Lon: {this.state.data.coord ? this.state.data.coord.lon : null}, Lat: {this.state.data.coord ? this.state.data.coord.lat : null}</div>
        			</div>
        			<div className="weather-temp">
        				<div id="temperature" className="temperature">
                            { this.state.data.main? this.Temperature(this.state.data.main.temp) : null }
                        </div>
        				<div className="high-low">
        					<div id="high" className="high">Hi: { this.state.data.main? this.Temperature(this.state.data.main.temp_max) : null }</div>
        					<div id="low" className="low">Lo: { this.state.data.main? this.Temperature(this.state.data.main.temp_min) : null }</div>
        				</div>
        			</div>
        		</div>
        	</div>
        );
    }
}

export default Popup;