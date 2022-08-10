// The following code is extremely valoatile you mess with you break, and if you break it it's your fault that it's not looking like the best website in the world.

// This is global constant and should not be messed with.
const CLIENT_ID = "gV19f1Py-heLx8S4MjAPGgNH5ze1NTzu1fnTGsWggaw";

// global variable to store data, because we are not smart enough to understand memory management on client side as of right now!!
let jsonData = {};

// This function will return the number of columns needed to be on the page according to the window size
function getColumns() {
    if (window.innerWidth < 640) {
        return 1;
    } else if (window.innerWidth > 1280) {
        return 3;
    } else {
        return 2;
    }
}


function populateTheData(columns, data, total_pages, total) {
    // necesary evil
    $("#photo-gallery-container").html("");
    $("#precaution").removeClass("hidden");

    // This is just what people usually do with these kind of things.
    $("#info-data div:first-child").text(`Pages: ${total_pages || 1}`);
    $("#info-data div:last-child").text(`Total Result: ${total || 30}`);


    // This is where actual data injection will take place in javscript.
    let columnContainers = [];
    for (let j = 0; j < columns; j++) {
        let temp = $("<div></div>");
        temp.addClass("grid grid-columns-1 gap-4 items-start");
        columnContainers.push(temp);
        $("#photo-gallery-container").append(temp);
    }

    for (let i = 0, k = 0; i < data.length; i++) {
        // The main image container
        let imageContainer = $("<figure class='relative shadow-lg'></figure>");
        
        // This is the extra information which you get in the api about the image
        let imageInfo = $("<div class='absolute w-full h-full flex flex-col justify-between items-start image-link'></div>");
        
        imageInfo.append($(`<div style='z-index: 200;' class='w-full p-4 flex items-center overflow-hidden'><img class='w-8 h-8 rounded-full' src=${data[i].user.profile_image.small} /><span class='ml-4 text-lg text-slate-300'>${data[i].user.name}</span></div>`));

        // The link which is visible when you hover over the image
        imageInfo.append(`<a style='z-index: 100;' href=${data[i].links.html} class='absolute w-full h-full image-link flex justify-center items-center' target='_blank'><i class='fal fa-link text-7xl text-white'></i></a>`);

        if (data[i].tags) {
            let imageTags = $("<div style='z-index: 200;' class='flex flex-row-reverse p-2'></div>");
            for (let tag = 0; tag < data[i].tags.length; tag++) {
                imageTags.append(`<div class='capitalize py-1 px-3 bg-slate-200 dsl-color rounded m-2'>${data[i].tags[tag].title}</div>`);
            }

            imageInfo.append(imageTags);
        }

        imageContainer.append(imageInfo);

        // This is the actual image
        imageContainer.append(`<img src=${data[i].urls.regular} alt=${data[i].alt_description} />`);
        
        columnContainers[k].append(imageContainer);

        if (k === columns - 1) k = 0;
        else k++;
    }
}

function getTheImagesReady(columns, val = null) {
    fetch(!val ? "./technology.json" : `https://api.unsplash.com/search/photos/?query=${val}&client_id=${CLIENT_ID}&per_page=30`)
        .then(response => response.json())
        .then(data => {
            // This is for developers
            console.log(data);
            jsonData = data;
            populateTheData(columns, data.results, data.total_pages, data.total);
        })
        .catch(err => {
            $("#error-message").removeClass("hidden");
            $("#precaution").addClass("hidden");
            console.error(err);
        });
}

$("#random-image-generator").click(() => {
    fetch(`https://api.unsplash.com/photos/random?client_id=${CLIENT_ID}&count=30`)
        .then(response => response.json())
        .then(data => {
            // This is for developers
            console.log(data);
            jsonData = data;
            populateTheData(getColumns(), data, "1", "30");
        })
        .catch(err => {
            $("#error-message").removeClass("hidden");
            $("#precaution").addClass("hidden");
            console.error(err);
        });
});

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


// footer related
$("#cancel-form-submission").click(() => {
    $("#cancel-form-submission").addClass("hidden");
});

$("#feedback-form").submit(e => {
    e.preventDefault();
    $("#cancel-form-submission").removeClass("hidden");
    $("#feedback-form input").val("");
    $("#feedback-form textarea").val("");
    
})