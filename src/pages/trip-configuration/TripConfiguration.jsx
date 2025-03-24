import React, { useState } from "react";
import Nav from "../../components/nav/Nav";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import LeafletRoutingMachine from "../../components/leaflet-routing-machine/LeafletRoutingMachine";


import "./TripConfiguration.scss";

const TripConfiguration = () => {
    const [isPickup, setPickup] = useState(true);

    const handleClick = (type) => {
        setPickup(type === "pickup");
    };
    
    return (
        <div className="trip-configuration-container">
            <Nav />
            <div className="trip-configuration-content">
                <div className="map-point-marker">
                    <div className="action" onClick={() => handleClick("current")}>
                        <MapPin /> current position
                    </div>
                    <div className={`action ${isPickup ? "fill" : ""}`} onClick={() => handleClick("pickup")}>
                        <MapPin /> Pick-up
                    </div>
                    <div className={`action ${!isPickup ? "fill" : ""}`}  onClick={() => handleClick("dropoff")}>
                        <MapPin /> Dropoff
                    </div>
                </div>
                <div className="map">
                    <MapContainer
                        center={[48.8566, 2.3522]}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LeafletRoutingMachine isPickup={isPickup}/>
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default TripConfiguration;
