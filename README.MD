# 🌍 Distance and Area Calculator with Map

![Project Preview](https://via.placeholder.com/1000x500.png?text=Project+Screenshot)

##  Overview
This web-based interactive mapping application allows users to measure distances and calculate areas effortlessly. Built with **Leaflet.js** and **Leaflet Draw**, the tool supports:
- **Geolocation**
- **Location search**
- **Multiple map layers**
- **GeoJSON export**

Perfect for **GIS professionals**, **students**, and **mapping enthusiasts**!

##  Key Features
✅ **Distance Measurement**: Click on the map to add points and calculate distances in **kilometers, miles, or meters**.

✅ **Area Calculation**: Draw polygons and instantly get their area in **square kilometers**.

✅ **Location Search**: Use OpenStreetMap’s **Nominatim API** to find locations worldwide.

✅ **User Geolocation**: Detect and zoom to the user's current location with one click.

✅ **Export as GeoJSON**: Save drawn features in **GeoJSON** format for GIS applications.

✅ **Map Layers Control**: Easily switch between **OpenStreetMap, Satellite, and Topographic maps** for better visualization.

##  Technologies Used
- **HTML5, CSS3, JavaScript**
- **[Leaflet.js](https://leafletjs.com/)** for interactive mapping.
- **[Leaflet Draw](https://github.com/Leaflet/Leaflet.draw)** for drawing and editing features.
- **OpenStreetMap & Nominatim API** for geolocation and search functionality.

##  UI Preview
![Map Interface](https://via.placeholder.com/800x400.png?text=Map+Interface)

##  Installation & Usage
### 1️⃣ Clone the repository:
```bash
git clone https://github.com/yourusername/distance-area-calculator.git
```
### 2️⃣ Navigate to the project folder and open `index.html`:
```bash
cd distance-area-calculator
open index.html
```

##  How to Use
1️⃣ **Search for a location** using the search bar.
2️⃣ **Click on the map** to add points and measure distances.
3️⃣ **Draw a polygon** to calculate its area.
4️⃣ **Switch between different map layers** for better visualization.
5️⃣ **Export your drawn features** as a **GeoJSON** file for further GIS processing.

##  Code Snippet (Adding a Map with Leaflet.js)
```javascript
let map = L.map('map').setView([24.7136, 46.6753], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
```

##  Contribution Guidelines
We welcome contributions! Feel free to **fork the repository, report issues, or submit pull requests** to enhance this project.

##  Contact
For inquiries, feedback, or suggestions, reach out at [ALYAAALAA301GMAIL.com].

---

🌟 **If you find this project useful, consider giving it a star on GitHub!**

