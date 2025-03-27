import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";
import api from "../../services/api";

const LeafletRoutingMachine = ({ type }) => {
  const map = useMap();
  const [current, setCurrent] = useState([null, null]);
  const [pickup, setPickup] = useState([null, null]);
  const [dropoff, setDropoff] = useState([null, null]);
  const [currentMarker, setCurrentMarker] = useState(null)
  const [pickupMarker, setPickupMarker] = useState(null);
  const [dropoffMarker, setDropoffMarker] = useState(null);
  const [routeData, setRouteData] = useState({ distance: 0, duration: 0, coordinates: [] });
  const [routingControl, setRoutingControl] = useState(null);
  const [remainingFuelDistance, setRemainingFuelDistancel] = useState(0);
  const [isGasStationFind, setGasStationFind] = useState(false);

  const getGasStations = async (lat, lng, radius = 1000) => {
    const query = `
      [out:json];
      (
        node["amenity"="fuel"](around:${radius},${lat},${lng});
        way["amenity"="fuel"](around:${radius},${lat},${lng});
        relation["amenity"="fuel"](around:${radius},${lat},${lng});
      );
      out body;
    `;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.elements.map(element => ({
        lat: element.lat,
        lng: element.lon,
        name: element.tags.name || "Unnamed Station"
      }));
    } catch (error) {
      console.error("Error fetching gas stations:", error);
      return [];
    }
  };
  
  

  useEffect(() => {
    api.post("/api/trip")
    .then((response) => {
      setRemainingFuelDistancel(1000 - response.data.distance)
    }).catch ((error) => {
      console.log(error);
    });
  }, [])

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
  

  useEffect(() => {
    if (current[0] !== null && pickup[0] !== null && dropoff[0] !== null) {
      if (routingControl) {
        map.removeControl(routingControl);
      }

      const newRoutingControl = L.Routing.control({
        waypoints: [L.latLng(current[0], current[1]), L.latLng(pickup[0], pickup[1]), L.latLng(dropoff[0], dropoff[1])],
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

      newRoutingControl.on("routeselected", async function (e) {
        const route = e.route;
        const distance = route.summary.totalDistance;
        const coordinates = route.coordinates.map(coord => [coord.lat, coord.lng]);
        const duration = route.summary.totalTime;
        
        setRouteData({ distance, duration, coordinates });
        const distanceToFind = remainingFuelDistance * 1000;
        
        let accumulatedDistance = 0;
        let markerPosition = null;

        for (let i = 1; i < coordinates.length; i++) {
          const [lat1, lng1] = coordinates[i - 1];
          const [lat2, lng2] = coordinates[i];
          const segmentDistance = map.distance([lat1, lng1], [lat2, lng2]);

          accumulatedDistance += segmentDistance;

          if (accumulatedDistance >= distanceToFind && !isGasStationFind) {
            const ratio = (accumulatedDistance - distanceToFind) / segmentDistance;
            const lat = lat2 - ratio * (lat2 - lat1);
            const lng = lng2 - ratio * (lng2 - lng1);
            markerPosition = [lat, lng];
            break;
          }
        }

        if (markerPosition && !isGasStationFind) {  
          const gasStations = await getGasStations(markerPosition[0], markerPosition[1], 10000);
  
          let closestStation = null;
          let closestDistance = Infinity;

          gasStations.forEach(station => {
            try {
              const stationPosition = [station.lat, station.lng];
              const distanceToStation = map.distance(markerPosition, stationPosition);

              if (distanceToStation < closestDistance) {
                closestDistance = distanceToStation;
                closestStation = station;
              }
            } catch (error) {
              // ignored
            }
          });

          if (closestStation) {
            const { lat, lng, name } = closestStation;
            if (!route.waypoints.some(waypoint => waypoint.lat === lat && waypoint.lng === lng) && !isGasStationFind) {
              newRoutingControl.spliceWaypoints(1, 0, L.latLng(lat, lng));
              L.marker([lat, lng])
              .addTo(map)
              .bindPopup(`refueling - ${name}`, { permanent: true, direction: "top" });

              setGasStationFind(true)
            }
          }

        }
      });

      setRoutingControl(newRoutingControl);
    }
  }, [current, pickup, dropoff]);

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
