import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";

const LeafletRoutingMachine = ({ isPickup }) => {
  const map = useMap();
  const [pickup, setPickup] = useState([null, null]);
  const [dropoff, setDropoff] = useState([null, null]);
  const [pickupMarker, setPickupMarker] = useState(null);
  const [dropoffMarker, setDropoffMarker] = useState(null);
  const [routeData, setRouteData] = useState({ distance: 0, duration: 0, coordinates: [] });
  const [routingControl, setRoutingControl] = useState(null);

  useEffect(() => {
    const onMapClick = (e) => {
      if (isPickup) {
        if (pickupMarker) {
          map.removeLayer(pickupMarker);
        }
        const newMarker = L.marker([e.latlng.lat, e.latlng.lng])
          .addTo(map)
          .bindTooltip("Pickup", { permanent: true, direction: "top" });
        setPickup([e.latlng.lat, e.latlng.lng]);
        setPickupMarker(newMarker);
      } else {
        if (dropoffMarker) {
          map.removeLayer(dropoffMarker);
        }
  
        const newMarker = L.marker([e.latlng.lat, e.latlng.lng])
          .addTo(map)
          .bindTooltip("Dropoff", { permanent: true, direction: "top" });
        setDropoff([e.latlng.lat, e.latlng.lng]);
        setDropoffMarker(newMarker);
      }
    };
  
    map.on("click", onMapClick);
  
    return () => {
      map.off("click", onMapClick);
    };
  }, [isPickup, map, pickupMarker, dropoffMarker]);

  useEffect(() => {
    if (pickup[0] !== null && dropoff[0] !== null) {
      if (routingControl) {
        map.removeControl(routingControl);
      }

      const newRoutingControl = L.Routing.control({
        waypoints: [L.latLng(pickup[0], pickup[1]), L.latLng(dropoff[0], dropoff[1])],
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

      newRoutingControl.on("routeselected", function (e) {
        const route = e.route;
        const distance = route.summary.totalDistance;
        const coordinates = route.coordinates.map(coord => [coord.lat, coord.lng]);
        const duration = route.summary.totalTime;
        
        setRouteData({ distance, duration, coordinates });
        console.log(distance, duration);
        

      });

      setRoutingControl(newRoutingControl);
    }
  }, [pickup, dropoff]);

  return null;
  
};

let DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [20, 20],
  iconAnchor: [0, 0],
  popupAnchor: [2, -40],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default LeafletRoutingMachine;
