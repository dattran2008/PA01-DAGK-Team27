var geocode = { lat: 10.762622, lng: 106.660172 };

let map = null,
    userMarker = null,
    infoWindow = null,
    prevLatLng = null;

//create basic map
function initMap() {
    // var geocode = { lat: 10.24232, lng: 106.51502 };
    var map = new google.maps.Map(document.getElementById('map'), {
        center: geocode,
        zoom: 12,
        scrollwheel: true
    });

    var input = document.getElementById('pac-input');

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); //Postion of input search box

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.BOUNCE
    });
    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        // Set the position of the marker using the place ID and location.
        marker.setPlace({
            placeId: place.place_id,
            location: place.geometry.location //lấy vị trí toạ độ cụ thể của Address
        });
        marker.setVisible(true);

        infowindowContent.children['place-name'].textContent = place.formatted_address;
        infowindowContent.children['place-id'].textContent = place.geometry.location;
        infowindowContent.children['place-address'].textContent = place.formatted_address;
        infowindow.open(map, marker);
    });
}


// Drag Marker with new locate
function drawUserMarker(latLng, dragVal) {
    // remove map attached and listeners
    if (userMarker) {
        userMarker.setMap(null);
        google.maps.event.clearListeners(userMarker, "mouseup");
        google.maps.event.clearListeners(userMarker, "mousedown");
    }
    // draw new marker
    userMarker = new google.maps.Marker({
        position: latLng,
        map,
        draggable: dragVal,
        animation: google.maps.Animation.DROP
    });
    // (re-)add event listeners
    userMarker.addListener("mouseup", moveUserMarkerMouseUp);
    userMarker.addListener("mousedown", moveUserMarkerMouseDown);
}

function moveUserMarkerMouseDown() {
    infoWindow.close();
}

function moveUserMarkerMouseUp() {
    // geo query new position
    const newLagLng = {
        lat: userMarker.getPosition().lat(),
        lng: userMarker.getPosition().lng()
    };
    $.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
        newLagLng.lat
        },${
        newLagLng.lng
        }&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAt-z3ICdN7F6QAM0cUuw21ZUF_BYKMfw0`,
        function (data) {
            // extract data
            const {
                results,
                status
            } = data;
            if (status !== "OK") return;
            // confirm the new position
            const infoWindowContent = `
          <div class="infowindow-container">
            <p id="infowindow-address">${results[0].formatted_address}</p>
            <p>Điều chỉnh vị trí hành khách đến đây?</p>
            <div class="infowindow-btn btn-group">
              <button class="btn btn-success" 
                onClick="document.getElementById('acceptChangeUserPosition').click()">
                Có
              </button>
              <button class="btn btn-cancel" 
                onClick="document.getElementById('declineChangeUserPosition').click()">
                Điều chỉnh tiếp
              </button>
              <button class="btn btn-primary" 
                onClick="document.getElementById('revertChangeUserPosition').click()">
                Về vị trí cũ
              </button>
            </div>
          </div>`;
            infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent
            });
            infoWindow.open(map, userMarker);
        }
    );
}

function handleQueryGeolocationFinish(coords) {
    // add marker indicating user position
    drawUserMarker(coords, true);
    // re-config the map
    map.setZoom(DEFAULT_ZOOM_LEVEL);
    map.panTo(coords);
    // pop up confirm
    $.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat()},${coords.lng()}&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAt-z3ICdN7F6QAM0cUuw21ZUF_BYKMfw0`,
        function (data) {
            // extract data
            const {
                results,
                status
            } = data;
            // confirm the new position
            let infoWindowContent = "";
            if (status === "OK") {
                infoWindowContent = `
          <div class="infowindow-container">
            <p id="infowindow-address">${results[0].formatted_address}</p>
            <p>Vị trí hành khách chính xác?</p>
            <div class="infowindow-btn btn-group">
              <button class="btn btn-success" style="width: 49%"
                onClick="document.getElementById('acceptChangeUserPosition').click()">
                Có
              </button>
              <button class="btn btn-cancel" style="width: 49%" 
                onClick="document.getElementById('declineChangeUserPosition').click()">
                Điều chỉnh tiếp
              </button>
            </div>
          </div>`;
            } else if (status === "ZERO_RESULTS") {
                infoWindowContent = `
          <div class="infowindow-container">
            <p>Vị trí hành khách nhập không có kết quả chính xác. Điều chỉnh?</p>
            <div class="infowindow-btn btn-group">
              <button class="btn btn-success" style="width: 49%"
                onClick="document.getElementById('acceptChangeUserPosition').click()">
                Có
              </button>
              <button class="btn btn-cancel" style="width: 49%"
                onClick="document.getElementById('declineChangeUserPosition').click()">
                Không
              </button>
            </div>
          </div>`;
            }

            infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent
            });
            infoWindow.open(map, userMarker);
        }
    );
}

// handle buttons clicked in info window
if (document.getElementById("acceptChangeUserPosition"))
    document.getElementById("acceptChangeUserPosition").addEventListener(
        "click",
        function (e) {
            infoWindow.close();
            // send message to server
            socket.emit("");
            // nếu như confirm đúng ròi thì tắt nút định vị
            $('#btn-locate').prop('disabled', true);
            // cập nhật lat và lng mới trong db
            const reqId = $("#reqId").val();
            const reqObject = {
                reqId, newLat: userMarker.getPosition().lat(),
                newLng: userMarker.getPosition().lng()
            }
            $.ajax({
                url: "http://localhost:3000/request/coords",
                type: "PATCH",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                    'x-access-token': localStorage.getItem('token_2')
                },
                data: JSON.stringify(reqObject),
                dataType: "json"
            }).done(function () {
                // tìm thằng tr cập nhật lại status của nó ở cả 2 phía client lẫn database
                setStatusByReqId('reqTable', 'reqId', 'IDENTIFIED');
                // reset lại các input
                resetInput();
                // hiện msg thành công
                showSuccessMsg('Định vị thành công');
                resetMap(userMarker, map);
            })
        },
        false
    );

if (document.getElementById("declineChangeUserPosition"))
    document.getElementById("declineChangeUserPosition").addEventListener(
        "click",
        function (e) {
            infoWindow.close();
        },
        false
    );

if (document.getElementById("revertChangeUserPosition"))
    document.getElementById("revertChangeUserPosition").addEventListener(
        "click",
        function (e) {
            infoWindow.close();
            // move the marker back
            handleQueryGeolocationFinish(prevLatLng);
        },
        false
    );