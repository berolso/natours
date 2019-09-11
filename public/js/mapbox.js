// 185
// eslint-disable

//190
export const displayMap = locations => {
  // 186
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYmVyZXRlciIsImEiOiJjazBlYXM3Y3MwMDllM2htc2FydGRiZjZnIn0.5B19_sf3P3_DJNOXtMKLvA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bereter/ck0eb7qs01kfw1cpeavphun15',
    scrollZoom: false
    // center: [-118, 34],
    // zoom: 4,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';
    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    //add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    //extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 100,
      left: 100,
      right: 100
    }
  });
};
