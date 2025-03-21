import React from "react";
import Nav from "../../components/nav/Nav";
import { MapPin, MapPinOff } from "lucide-react";

import "./TripConfiguration.scss";

const TripConfiguration = () => {
    return (
        <div className="trip-configuration-container">
            <Nav />  
            <div className="trip-configuration-content">
                <div className="map-point-marker">
                    <div className="action"><MapPin />pick-up</div>
                    <div className="action"><MapPin />dropoff</div>
                    <div className="action fill"><MapPinOff />remove markings</div>
                </div>
                <div className="map"></div>
            </div>      
        </div>
    );
};

export default TripConfiguration;