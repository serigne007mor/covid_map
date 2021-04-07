import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { HeatmapLayer } from '@deck.gl/aggregation-layers';
import mapStyles from './map-styles';


const sourceData = './COVID-19_Cases_US.json';


const scatterplot = () => new ScatterplotLayer({
    id: 'scatter',
    data: sourceData,
    opacity: 0.8,
    filled: true,
    radiusMinPixels: 50,
    radiusMaxPixels: 5,
    getPosition: d => [d.longitude, d.latitude],
    getFillColor: d => d.Confirmed > 0 ? [200, 0, 40, 150] : [255, 140, 0, 100],

    pickable: true,
    onHover: ({ object, x, y }) => {
        const el = document.getElementById('tooltip');
        if (object) {
            const { Confirmed, Recovered, Deaths, Active } = object;
            el.innerHTML = ` Confirmed: ${Confirmed}, Death: ${Deaths}`
            el.style.display = 'block';
            el.style.opacity = 0.9;
            el.style.left = x + 'px';
            el.style.top = y + 'px';
        } else {
            el.style.opacity = 0.0;
        }
    },

    // onClick: ({ object, x, y }) => {
    //     window.open(`https://www.gunviolencearchive.org/incident/${object.UID}`)
    // },

});

const heatmap = () => new HeatmapLayer({
    id: 'heat',
    data: sourceData,
    getPosition: d => [d.longitude, d.latitude],
    getWeight: d => d.Confirmed + (d.Deaths * 0.5),
    radiusPixels: 60,
});



const hexagon = () => new HexagonLayer({
    id: 'hex',
    data: sourceData,
    getPosition: d => [d.longitude, d.latitude],
    getElevationWeight: d => (d.Confirmed * 10) + d.Deaths,
    elevationScale: 1500,
    extruded: true,
    radius: 10000,
    opacity: 0.6,
    coverage: 0.88,
    lowerPercentile: 50

});


window.initMap = () => {

    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.0, lng: -100.0 },
        zoom: 5,
        styles: mapStyles
    });

    const overlay = new GoogleMapsOverlay({
        layers: [
            scatterplot(),
            heatmap(),
            hexagon()
        ],
    });


    overlay.setMap(map);

}