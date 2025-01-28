async function getweather(lat,lon) {
    const end_date = '2024-09-08';
    const start_date = '2024-09-07';
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
    console.log(elevationData)
    return {
        json,
        slope,
        soiltype,
        start_date,
        end_date
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
    console.log(`Distance: ${distance} meters`);
    return R * c;
}
function calculatehazard(slope,rain,soil,elevation,wind) {
    hazard = ((slope*0.17 + elevation*0.36 + soil*0.055 + rain*0.36 + wind*0.055 )).toFixed(3);
    return hazard
}
function getelevationFactor(elevation) {
    if (elevation < 500) return 1;
    if (elevation >= 500 && elevation < 1000) return 2;
    if (elevation >= 1000 && elevation < 1500) return 3;
    return 4;
}
function getslopeFactor(slope) {
    if (slope <= 8) return 1;
    if (slope > 8 && slope < 15) return 2;
    if (slope >= 15 && slope < 20) return 3;
    if (slope >= 20 && slope < 25) return 4;
    return 5;
}
function getrainFactor(rainfall) {
    if (rainfall < 4 ) return 1;
    if (rainfall >= 4 && rainfall < 10) return 2;
    return 3;
}
function getsoilFactor(soil) {
    if (soil === "arenosols" || soil === "histosols") return 3;
    if (soil === "Vertisols" || soil === "Gleysols") return 3;
    if (soil === "Cambisols" || soil === "Acrisols") return 2;
    if (soil === "Fluvisols" || soil === "Andosols" || soil === "phaeozems" ) return 2;
    if (soil === "Luvisols" || soil === "Ferralsols" )  return 1;
    return 1;
}

function getwindFactor(wind) {
    if (wind < 12) return 1;
    if (wind >= 12 && wind < 20) return 2;
    if (wind >= 20 && wind < 30) return 3;
    if (wind >= 30 && wind <= 40) return 4; 
    return 5;
}

function getsoilmoistureFactor(humid) {
    if (humid < 10) return 0.1;
    if (humid >= 10 && humid < 15) return 0.5;
    if (humid >=15 && humid < 30) return 1.0;
    if (humid >= 30 && humid <= 40) return 1.5;
    return 2.0;
}
