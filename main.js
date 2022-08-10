// The following code is extremely valoatile you mess with you break, and if you break it it's your fault that it's not looking like the best website in the world.

function getColumns() {
    if (window.innerWidth < 640) {
        return 1;
    } else if (window.innerWidth > 1280) {
        return 3;
    } else {
        return 2;
    }
}

function getTheImagesReady(columns) {
    $("#photo-gallery-container").html("");
    fetch("./technology.json")
        .then(response => response.json())
        .then(data => {
            // This is because we want to know what we are showing.
            console.log(data);

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
                
                imageContainer.append(`<a href=${data.results[i].links.html} class='absolute w-full h-full image-link flex justify-center items-center'><i class='fal fa-link text-7xl text-white'></i></a>`);
                
                imageContainer.append(`<img src=${data.results[i].urls.regular} alt=${data.results[i].alt_description} />`);
                
                columnContainers[k].append(imageContainer);

                if (k === columns - 1) k = 0;
                else k++;
                console.log(columnContainers);
            }
            
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
        resizeEventHandler = setTimeout(() => getTheImagesReady(getColumns()), 1000);
    }
});