let map = L.map('map').setView([24.7136, 46.6753], 6);

// Define base maps
let baseMaps = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en', {
        attribution: '&copy; OpenStreetMap contributors'
    }),
    "Satellite": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }),
    "Topographic": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    })
};

// Add default base map
baseMaps["OpenStreetMap"].addTo(map);

// Add layer control
L.control.layers(baseMaps).addTo(map);

let markers = [];
let polyline = null;
let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Initialize the draw control
let drawControl = new L.Control.Draw({
    draw: {
        polygon: {
            allowIntersection: false,
            showArea: true,
            metric: true,
        },
        polyline: true,
        circle: false,
        rectangle: false,
        marker: false,
    },
    edit: {
        featureGroup: drawnItems,
    },
});
map.addControl(drawControl);

// Function to calculate distance between multiple points
function calculateTotalDistance(points) {
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
        let lat1 = points[i].lat;
        let lon1 = points[i].lng;
        let lat2 = points[i + 1].lat;
        let lon2 = points[i + 1].lng;
        totalDistance += calculateDistance(lat1, lon1, lat2, lon2);
    }
    return totalDistance;
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    let dLat = toRadians(lat2 - lat1);
    let dLon = toRadians(lon2 - lon1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Function to calculate area of a polygon
function calculateArea(latLngs) {
    let area = L.GeometryUtil.geodesicArea(latLngs);
    return Math.abs(area / 1000000); // Convert to square kilometers
}

// Update distance and area
function updateDistance() {
    if (markers.length < 2) return;
    let points = markers.map(marker => marker.getLatLng());
    let totalDistance = calculateTotalDistance(points);

    let unit = document.getElementById("unit").value;
    if (unit === "miles") totalDistance *= 0.621371;
    if (unit === "meters") totalDistance *= 1000;

    document.getElementById("distance").innerText = `Total Distance: ${totalDistance.toFixed(2)} ${unit}`;

    if (polyline) map.removeLayer(polyline);
    polyline = L.polyline(points, {color: 'blue'}).addTo(map);
    drawnItems.addLayer(polyline); // Add polyline to drawnItems
}

// Reset map
function resetMap() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    if (polyline) map.removeLayer(polyline);
    drawnItems.clearLayers();
    document.getElementById("distance").innerText = "Click on the map to add points and calculate the distance";
    document.getElementById("area").innerText = "Draw a polygon to calculate the area";
}

// Get location name
async function getLocationName(lat, lon, marker) {
    try {
        let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`);
        let data = await response.json();
        if (data.display_name) {
            marker.bindPopup(data.display_name).openPopup();
        }
    } catch (error) {
        console.error("Error fetching location name:", error);
    }
}

// Handle map clicks
map.on('click', function(e) {
    let marker = L.marker(e.latlng, {draggable: true}).addTo(map);
    markers.push(marker);
    getLocationName(e.latlng.lat, e.latlng.lng, marker);
    marker.on('dragend', updateDistance);
    if (markers.length >= 2) updateDistance();
});

// Handle drawn shapes
map.on(L.Draw.Event.CREATED, function(event) {
    let layer = event.layer;
    drawnItems.addLayer(layer);

    if (layer instanceof L.Polygon) {
        let area = calculateArea(layer.getLatLngs()[0]);
        document.getElementById("area").innerText = `Area: ${area.toFixed(2)} km²`;
    } else if (layer instanceof L.Polyline) {
        updateDistance();
    }
});

// Search location
async function searchLocation() {
    let query = document.getElementById("locationSearch").value;
    if (!query) return;
    try {
        let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&accept-language=en`);
        if (!response.ok) throw new Error("Network response was not ok");
        let data = await response.json();
        if (data.length > 0) {
            let { lat, lon } = data[0];
            map.setView([lat, lon], 10);
            let marker = L.marker([lat, lon], {draggable: true}).addTo(map);
            markers.push(marker);
            getLocationName(lat, lon, marker);
            marker.on('dragend', updateDistance);
            if (markers.length >= 2) updateDistance();
        } else {
            alert("Location not found.");
        }
    } catch (error) {
        console.error("Error during search:", error);
        alert("There was a problem with the search. Please try again later.");
    }
}

// Locate user
function locateUser() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        map.setView([lat, lon], 13);
        let marker = L.marker([lat, lon], {draggable: true}).addTo(map);
        markers.push(marker);
        getLocationName(lat, lon, marker);
        marker.on('dragend', updateDistance);
        if (markers.length >= 2) updateDistance();
    }, function(error) {
        alert("Unable to retrieve your location.");
    });
}

// Export as GeoJSON
function exportGeoJSON() {
    let geoJSON = drawnItems.toGeoJSON();
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geoJSON));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "map_data.geojson");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
