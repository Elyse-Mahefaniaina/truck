import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";
import api from "../../services/api";
import "./RouteMachineLoader.css";

const LeafletRoutingMachine = ({ type, setData }) => {
  const map = useMap();
  const [current, setCurrent] = useState([null, null]);
  const [pickup, setPickup] = useState([null, null]);
  const [dropoff, setDropoff] = useState([null, null]);
  const [currentMarker, setCurrentMarker] = useState(null)
  const [pickupMarker, setPickupMarker] = useState(null);
  const [dropoffMarker, setDropoffMarker] = useState(null);
  const [routingControl, setRoutingControl] = useState(null);

  const [loading, setLoading] = useState(false);

  
  const initMarker = () => {
    map.removeLayer(currentMarker);  
    map.removeLayer(pickupMarker);  
    map.removeLayer(dropoffMarker);  
  }

  useEffect(() => {
    const markerTypes = {
      current: {
        stateSetter: setCurrent,
        markerSetter: setCurrentMarker,
        marker: currentMarker,
        label: "Current",
      },
      pickup: {
        stateSetter: setPickup,
        markerSetter: setPickupMarker,
        marker: pickupMarker,
        label: "Pickup",
      },
      dropoff: {
        stateSetter: setDropoff,
        markerSetter: setDropoffMarker,
        marker: dropoffMarker,
        label: "Dropoff",
      },
    };
  
    const onMapClick = (e) => {
      if (!markerTypes[type]) return;
  
      const { stateSetter, markerSetter, marker, label } = markerTypes[type];
  
      if (marker) {
        map.removeLayer(marker);
      }
  
      const newMarker = L.marker([e.latlng.lat, e.latlng.lng])
        .addTo(map)
        .bindTooltip(label, { permanent: true, direction: "top" });
  
      stateSetter([e.latlng.lat, e.latlng.lng]);
      markerSetter(newMarker);
    };
  
    map.on("click", onMapClick);
  
    return () => {
      map.off("click", onMapClick);
    };

  }, [type, map, currentMarker, pickupMarker, dropoffMarker]);
  
  const splitDataPer24Hours = (data) => {
    let dataResult = [];
    let data_temp = [];
    let accumulated_duration = 0;
    
    for(let i= 0; i < data.length; i++) {
      accumulated_duration += (data[i].duration_from_last_point) + (data[i-1]?.duration[0] ?? 0);
      
      if(accumulated_duration > (24 * 3600)) {
        const accumulated_duration_temp = (accumulated_duration - ((data[i].duration_from_last_point) + (data[i-1]?.duration[0] ?? 0)))
        if((accumulated_duration_temp + (data[i-1]?.duration[0] ?? 0)) > (24 * 3600) ) {
          let data_int = data[i-1];
          data_int.duration[0] = (24 - accumulated_duration_temp); 
          data_temp.push(data_int); 

          const newDuration = data[i - 1]?.duration[0] ?? 0 - (24 - accumulated_duration_temp)
        }
        data_temp.push(data[i]);
        accumulated_duration = 0;
      }
      data_temp.push(data[i])

    }

  };
  // useEffect(() => {
  //   if (current[0] !== null && pickup[0] !== null && dropoff[0] !== null) {
  //     initMarker();
  //     if (routingControl) {
  //       map.removeControl(routingControl);
  //     }

  //     setLoading(true);
  //     api.get("api/trip/addpoint", {
  //       params: {
  //         current_lat: current[0], 
  //         current_lng: current[1],
  //         pickup_lat: pickup[0],
  //         pickup_lng: pickup[1],
  //         dropoff_lat: dropoff[0],
  //         dropoff_lng: dropoff[1]
  //       }
  //     }).then ((response) => {
  //       setLoading(false);
  //       console.log(response.data);
  //       localStorage.setItem("data", JSON.stringify(response.data));
  //       const waypoints = response.data.waypoints.map(point => L.latLng(point.lat, point.lng));
        
  //       response.data.waypoints.map((point) => {
  //         L.marker([point.lat, point.lng])
  //         .addTo(map)
  //         .bindTooltip(point.label, { permanent: true, direction: "top" });
  //       });
  //       const newRoutingControl = L.Routing.control({
  //         waypoints: waypoints,
  //         lineOptions: {
  //           styles: [{ color: "blue", weight: 5, opacity: 0.7 }],
  //         },
  //         router: L.Routing.osrmv1({
  //           serviceUrl: "https://router.project-osrm.org/route/v1",
  //           profile: "car",
  //           alternatives: false,
  //         }),
  //         routeWhileDragging: false,
  //         geocoder: L.Control.Geocoder.nominatim(),
  //         addWaypoints: false,
  //         draggableWaypoints: false,
  //         fitSelectedRoutes: true,
  //         showAlternatives: false,
  //       }).addTo(map);

  //       setRoutingControl(newRoutingControl);
        
  //     }).catch((error) => {
  //       setLoading(false);
  //       alert("Serveur saturé veillé réessayer plus tard !")
  //       console.log(error);
  //     });
  //   }
  // }, [current, pickup, dropoff]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data")); 
      const waypoints = data.waypoints.map(point => L.latLng(point.lat, point.lng));
      
      data.waypoints.map((point) => {
        L.marker([point.lat, point.lng])
        .addTo(map)
        .bindTooltip(point.label, { permanent: true, direction: "top" });
      });
      const newRoutingControl = L.Routing.control({
        waypoints: waypoints,
        lineOptions: {
          styles: [{ color: "blue", weight: 5, opacity: 0.7 }],
        },
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
          profile: "car",
          alternatives: false,
        }),
        routeWhileDragging: false,
        geocoder: L.Control.Geocoder.nominatim(),
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
      }).addTo(map);

      setRoutingControl(newRoutingControl);
  }, [])

  return (
    <>
    {loading && (
      <div className="overlay">
        <div className="spin"> </div>
      </div>
    )}
  </>
  );
  
};

let DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [20, 20],
  iconAnchor: [0, 0],
  popupAnchor: [2, -40],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default LeafletRoutingMachine;
