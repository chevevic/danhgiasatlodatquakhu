async function getweather(lat,lon) {
    const end_date = '2024-09-07';
    const start_date = '2024-09-06';
    try {
    const api_url = `https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&start_date=${start_date}&end_date=${end_date}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,wind_speed_10m,temperature_120m,soil_moisture_27_to_81cm&timezone=Asia%2FBangkok`;
    const api_url1 =  `https://api.open-elevation.com/api/v1/lookup?locations=${lat - 0.0004},${lon - 0.0004}|${lat + 0.0004},${lon + 0.0004}`;
    const api_url2 =`https://rest.isric.org/soilgrids/v2.0/classification/query?lon=${lon}&lat=${lat}&number_classes=12`
    const response = await fetch(api_url);
    const json = await response.json();
    console.log(json);
    const response1 = await fetch(api_url1);
    const elevationData = await response1.json();
    const elevation1 = elevationData.results[0].elevation;
    const elevation2 = elevationData.results[1].elevation;
    const distance = getDistance(lat - 0.0004, lon - 0.0004, lat + 0.0004, lon + 0.0004);
    const slope = Math.atan((Math.abs(elevation2 - elevation1)) / distance)*(180 / Math.PI);
    console.log(`Slope: ${slope} °`);
    const response2 = await fetch(api_url2);
    const soiltype = await response2.json();
    console.log(soiltype);
    fetch(`https://overpass-api.de/api/interpreter?data=[out:json];(way(around:750,${lat},${lon})["landuse"];node(around:1000,${lat},${lon})["landuse"];);out%20body;%3E;out%20skel%20qt;`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start_date}&endtime=${end_date}`;
    const response4 = await fetch(url);
    const seismicData = await response4.json();
    console.log(seismicData);
    let totalImpact = 0;
    let count = 0;
    if (seismicData.features && Array.isArray(seismicData.features)) {
        seismicData.features.forEach(earthquake => {
            const magnitude = earthquake.properties.mag;
            const earthquakeLat = earthquake.geometry.coordinates[1];
            const earthquakeLon = earthquake.geometry.coordinates[0];
            const distance1 = getDistance(lat, lon, earthquakeLat, earthquakeLon);
            const impact = magnitude / (1 + distance1);
    
            totalImpact += impact;
            count++;
        });
    } else {
        console.error("Dữ liệu động đất không hợp lệ hoặc không có dữ liệu features.");
    }
    
    const Impact = count > 0 ? totalImpact : 0;
    
    console.log(`Tổng Mức độ ảnh hưởng từ các trận động đất trong khu vực: ${Impact.toFixed(2)}`);
    console.log(elevationData)
    return {
        json,
        slope,
        soiltype,
        start_date,
        end_date,
        Impact
    };
    } catch (error) {
        console.error("An error occurred:", error);
        return 0;
    }
}
var script = document.createElement('script');
script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
script.onload = function() {
    console.log('jQuery đã được tải thành công!');
    $('h1').text('jQuery đã được tải xong!');
};
script.onerror = function() {
    console.error('Lỗi khi tải jQuery!');
};
document.head.appendChild(script);
function getHumanData(city) {
    if (city === "") {
        return 0;
    } else {
    try {
     return new Promise((resolve, reject) => {
         const name = city;
         if (name === "") {
            return 0;
         }
         const apiKeys = ['CvVjkVRAMC0qBCc3X00OPA==jL1dpztC8JYWK4Fm','bx1RyMZI6jijYhcOkN09oA==fWblJEURLHBnuQMP','1T+PdTDqdcBAN2KBPy3rUA==Azgxa1tszECyQmdB','jdXat9Ki5HubXgmipMFdAA==WftEvsVIXvufKXUf',]; // Thay 'YOUR_NEW_API_KEY' bằng API key mới của bạn
         let currentApiKeyIndex = 0;
 
         function makeRequest() {
             $.ajax({
                 method: 'GET',
                 url: 'https://api.api-ninjas.com/v1/city?name=' + name,
                 headers: { 'X-Api-Key': apiKeys[currentApiKeyIndex] },
                 contentType: 'application/json',
                 success: function(result) {
                     if (result && result[0] && result[0].population) {
                         console.log(result);
                         resolve(result[0].population);
                     } else {
                         resolve(156474);
                     }
                 },
                 error: function ajaxError(jqXHR) {
                     if (jqXHR.status === 400 && currentApiKeyIndex === 0) {
                         console.log('API key đầu tiên không hợp lệ, thử với key khác...');
                         currentApiKeyIndex++;
                         makeRequest();
                     } else {
                         reject('Error: ' + jqXHR.responseText);
                     }
                 }
             });
         }
 
         makeRequest();
     });
    } catch (error) {
         console.error('Có lỗi trong quá trình thực thi:', error);
         return;
    }
 };}
function calculateLandslideRisk(hazard, exposure, vulnerability) {
    if (hazard < 0 || exposure < 0 || vulnerability < 0) {
        return "Giá trị không hợp lệ. Tất cả các tham số phải lớn hơn hoặc bằng 0.";
    }
    let risk = hazard * exposure * vulnerability;
    return `Rủi ro sạt lở đất: ${risk}`;
}
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180; 
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return R * c;
}
function calculatehazard(slope,rain,soil,humid,wind) {
    hazard = (((slope * (rain + soil + humid + wind)) / (2*(2+2+2+2))) * 100).toFixed(0);
    return hazard
}
function getslopeFactor(slope) {
    if (slope <= 0.5) return 0
    if (slope >0.5 && slope < 1) return 0.05;
    if (slope >= 1 && slope < 3) return 0.2;
    if (slope >= 3 && slope < 10) return 0.5;
    if (slope >= 10 && slope < 15) return 1;
    if (slope >= 15 && slope <= 25) return 1.5;
    if (slope > 25 && slope <= 35) return 1.75; 
    return 2.0;
}
function getrainFactor(rainfall) {
    if (rainfall < 0.1 ) return 0.05;
    if (rainfall >=0.4 && rainfall < 1.2) return 0.25;
    if (rainfall >= 1.2 && rainfall < 2.2) return 0.5;
    if (rainfall >= 2.2 && rainfall < 5) return 1.0;
    if (rainfall >= 5 && rainfall <10) return 1.5;
    return 2.0;
}

function getsoilFactor(soil) {
    if (soil === "arenosols" || soil === "histosols") return 2.0;
    if (soil === "Vertisols" || soil === "Gleysols") return 1.5;
    if (soil === "Cambisols" || soil === "Acrisols") return 1.2;
    if (soil === "Fluvisols" || soil === "Andosols" || soil === "phaeozems" ) return 0.8;
    if (soil === "Luvisols" || soil === "Ferralsols" )  return 0.4;
    return 0.2;
}

function getwindFactor(wind) {
    if (wind < 12) return 0.1;
    if (wind >= 12 && wind < 20) return 0.5;
    if (wind >= 20 && wind < 30) return 1.0;
    if (wind >= 30 && wind <= 40) return 1.5; 
    return 2.0;
}

function getsoilmoistureFactor(humid) {
    if (humid < 10) return 0.1;
    if (humid >= 10 && humid < 15) return 0.5;
    if (humid >=15 && humid < 30) return 1.0;
    if (humid >= 30 && humid <= 40) return 1.5;
    return 2.0;
}
