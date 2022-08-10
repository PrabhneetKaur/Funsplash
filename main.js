// The following code is extremely valoatile you mess with you break, and if you break it it's your fault that it's not looking like the best website in the world.

// This is global constant and should not be messed with.
const CLIENT_ID = "gV19f1Py-heLx8S4MjAPGgNH5ze1NTzu1fnTGsWggaw";

// global variable to store data, because we are not smart enough to understand memory management on client side as of right now!!
let jsonData = {};

function getColumns() {
    if (window.innerWidth < 640) {
        return 1;
    } else if (window.innerWidth > 1280) {
        return 3;
    } else {
        return 2;
    }
}

function populateTheData(columns, data) {
    // necesary evil
    $("#photo-gallery-container").html("");

    // This is just what people usually do with these kind of things.
    $("#info-data div:first-child").text(`Pages: ${data.total_pages}`);
    $("#info-data div:last-child").text(`Total Result: ${data.total}`);


    // This is where actual data injection will take place in javscript.
    let columnContainers = [];
    for (let j = 0; j < columns; j++) {
        let temp = $("<div></div>");
        temp.addClass("grid grid-columns-1 gap-4 items-start");
        columnContainers.push(temp);
        $("#photo-gallery-container").append(temp);
    }

    for (let i = 0, k = 0; i < data.results.length; i++) {
        let imageContainer = $("<figure class='relative shadow-lg'></figure>");
        
        imageContainer.append(`<a href=${data.results[i].links.html} class='absolute w-full h-full image-link flex justify-center items-center' target='_blank'><i class='fal fa-link text-7xl text-white'></i></a>`);
        
        imageContainer.append(`<img src=${data.results[i].urls.regular} alt=${data.results[i].alt_description} />`);
        
        columnContainers[k].append(imageContainer);

        if (k === columns - 1) k = 0;
        else k++;
    }
}

function getTheImagesReady(columns, val = null) {
    $("#photo-gallery-container").html("");
    fetch(!val ? "./technology.json" : `https://api.unsplash.com/search/photos/?query=${val}&client_id=${CLIENT_ID}&per_page=30`)
        .then(response => response.json())
        .then(data => {
            // This is for developers
            console.log(data);
            jsonData = data;
            populateTheData(columns, data);
        })
        .catch(err => {
            $("#error-message").removeClass("hidden");
            console.error(err);
        })
}

let resizeEventHandler;
$(document).ready(() => {
    resizeEventHandler = setTimeout(() => getTheImagesReady(getColumns()), 1000);
});

let currentColumns = getColumns();

$(window).resize(() => {
    if (currentColumns != getColumns()) {
        clearTimeout(resizeEventHandler);
        resizeEventHandler = setTimeout(() => populateTheData(getColumns(), jsonData), 1000);
    }
});

$("#image-search-engine").submit(e => {
    e.preventDefault();
    let val = $("#image-search-input").val();
    if (val.length >= 3) {
        resizeEventHandler = setTimeout(() => getTheImagesReady(getColumns(), val), 1000);
    }
    $("#image-search-input").attr("placeholder", val);
});