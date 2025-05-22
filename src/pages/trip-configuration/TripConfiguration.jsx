import React, { useState, useEffect } from "react";
import Nav from "../../components/nav/Nav";
import Log from "../../components/log/Log";
import { MapPin, Save, DraftingCompass } from "lucide-react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import LeafletRoutingMachine from "../../components/leaflet-routing-machine/LeafletRoutingMachine";
import Tracking from "../../components/tracking/Tracking";
import api from "../../services/api";

import "./TripConfiguration.scss";

const TripConfiguration = () => {
    const [type, setType] = useState("current");
    const [dataLogs, setDataLogs] = useState([]);
    const [plannedStartDate, setPlannedStartDate] = useState('');
    const [result, setResult] = useState({});
    const [compute, setCompute] = useState(false);

    const saveAll = () => {
        const bodyData = {
            data: result,
            date: plannedStartDate
        };
        
        api.post('api/trip', bodyData)
        .then((response) => {
            console.log(response.data);
            
        })
        .catch((err)=> {
            alert(err)
        })
    }

    const handleClick = (type) => {
        setType(type);
    }

    useEffect(()=> {
        if (Object.keys(result).length > 0) {
            setCompute(true);
        }else {
            setCompute(false)
        }
    }, [result])
    
    return (
        <div className="trip-configuration-container">
            <Nav />
            <div className="trip-configuration-content">
                <div className="map-point-marker">
                    <div className={`action ${type === "current" ? "fill": ""}`} onClick={() => handleClick("current")}>
                        <MapPin /> Current
                    </div>
                    <div className={`action ${type === "pickup" ? "fill" : ""}`} onClick={() => handleClick("pickup")}>
                        <MapPin /> Pick-up
                    </div>
                    <div className={`action ${type === "dropoff" ? "fill" : ""}`}  onClick={() => handleClick("dropoff")}>
                        <MapPin /> Dropoff
                    </div>
                    {!compute ? 
                    <div className="action" onClick={() => setCompute(true)}>
                        <DraftingCompass /> Compute
                    </div> : 
                    <div className="action" onClick={saveAll}>
                        <Save /> Save
                    </div>
                    }
                </div>
                <div className="planned-start-date">
                    <div className="input-date"><input type="datetime-local" value={plannedStartDate} onChange={(e) => setPlannedStartDate(e.target.value)} /></div>
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
                        <LeafletRoutingMachine 
                            type={type} 
                            setData={setDataLogs} 
                            setResult={setResult} 
                            compute={compute}
                            plannedStartDate={plannedStartDate}/>
                    </MapContainer>
                </div>
            </div>
            <div className="log-trip-container">
                <div className="log-trip-config">
                    <Tracking size={dataLogs.length}>
                        {dataLogs.length > 0 && dataLogs.map((data, index) => (
                            <Log 
                                key={index} 
                                dataLogs={data} 
                                startDate={plannedStartDate} 
                                addDay={index}
                            />
                        ))}
                    </Tracking>
                </div>
            </div>
        </div>
    );
};

export default TripConfiguration;
