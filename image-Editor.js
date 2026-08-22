let filters = {
    brightness: { value: 100, min: 0, max: 200, unit: "%" },
    contrast: { value: 100, min: 0, max: 200, unit: "%" },
    saturation: { value: 100, min: 0, max: 200, unit: "%" },
    hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
    blur: { value: 0, min: 0, max: 20, unit: "px" },
    grayscale: { value: 0, min: 0, max: 100, unit: "%" },
    sepia: { value: 0, min: 0, max: 100, unit: "%" },
    opacity: { value: 100, min: 0, max: 100, unit: "%" },
    invert: { value: 0, min: 0, max: 100, unit: "%" }
};

const defaultFilters = JSON.parse(JSON.stringify(filters));

const presets = {
    Original: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    Bright: {
        brightness: 140,
        contrast: 110,
        saturation: 120,
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    Vintage: {
        brightness: 110,
        contrast: 90,
        saturation: 80,
        hueRotation: 0,
        blur: 0,
        grayscale: 10,
        sepia: 60,
        opacity: 100,
        invert: 0
    },

    Cool: {
        brightness: 100,
        contrast: 110,
        saturation: 120,
        hueRotation: 25,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    Warm: {
        brightness: 105,
        contrast: 105,
        saturation: 140,
        hueRotation: 340,
        blur: 0,
        grayscale: 0,
        sepia: 20,
        opacity: 100,
        invert: 0
    },

    "B&W": {
        brightness: 100,
        contrast: 120,
        saturation: 0,
        hueRotation: 0,
        blur: 0,
        grayscale: 100,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    Dreamy: {
        brightness: 120,
        contrast: 90,
        saturation: 120,
        hueRotation: 0,
        blur: 3,
        grayscale: 0,
        sepia: 10,
        opacity: 100,
        invert: 0
    },

    Dark: {
        brightness: 70,
        contrast: 130,
        saturation: 100,
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    Vivid: {
        brightness: 110,
        contrast: 130,
        saturation: 170,
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 0
    },

    Invert: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hueRotation: 0,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        opacity: 100,
        invert: 100
    }
};

const presetsContainer = document.querySelector(".presets");
const filtersContainer = document.querySelector(".filters");
const imageCanvas = document.querySelector("#image-canvas");
const imgInput = document.querySelector("#image-input");
const resetButton = document.querySelector("#Reset-btn");
const downloadBtn = document.querySelector("#Download-btn");

const canvasCtx = imageCanvas.getContext("2d");

let image = null;

function createFilterElement(name, unit, value, min, max) {

    const div = document.createElement("div");
    div.className = "filter";

    const label = document.createElement("p");
    label.innerText = `${name}: ${value}${unit}`;

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.value = value;
    input.id = name;

    input.addEventListener("input", () => {
        filters[name].value = Number(input.value);
        label.innerText = `${name}: ${input.value}${unit}`;
        applyFilters();
    });

    div.append(label, input);

    return div;
}

function createFilters() {

    filtersContainer.innerHTML = "";

    Object.keys(filters).forEach(key => {
        filtersContainer.appendChild(
            createFilterElement(
                key,
                filters[key].unit,
                filters[key].value,
                filters[key].min,
                filters[key].max
            )
        );
    });
}

function createPresets() {

    if (!presetsContainer) return;

    presetsContainer.innerHTML = "";

    Object.keys(presets).forEach(name => {

        const btn = document.createElement("button");
        btn.className = "preset-btn";
        btn.innerText = name;

        btn.addEventListener("click", () => {

            Object.keys(filters).forEach(filter => {

                filters[filter].value = presets[name][filter];

                const slider = document.getElementById(filter);

                if (slider) {
                    slider.value = filters[filter].value;

                    slider.previousElementSibling.innerText =
                        `${filter}: ${filters[filter].value}${filters[filter].unit}`;
                }
            });

            applyFilters();
        });

        presetsContainer.appendChild(btn);

    });

}

createFilters();
createPresets();

imgInput.addEventListener("change", e => {

    const file = e.target.files[0];

    if (!file) return;

    const img = new Image();

    img.src = URL.createObjectURL(file);

    img.onload = () => {

        image = img;

        imageCanvas.width = img.width;
        imageCanvas.height = img.height;

        document.querySelector(".placeholder").style.display = "none";

        applyFilters();
    };

});
function applyFilters() {

    if (!image) return;

    canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    canvasCtx.filter = `
        brightness(${filters.brightness.value}%)
        contrast(${filters.contrast.value}%)
        saturate(${filters.saturation.value}%)
        hue-rotate(${filters.hueRotation.value}deg)
        blur(${filters.blur.value}px)
        grayscale(${filters.grayscale.value}%)
        sepia(${filters.sepia.value}%)
        opacity(${filters.opacity.value}%)
        invert(${filters.invert.value}%)
    `;

    canvasCtx.drawImage(image, 0, 0);

    canvasCtx.filter = "none";
}


// ===================== RESET =====================

resetButton.addEventListener("click", () => {

    // Default values restore
    filters = JSON.parse(JSON.stringify(defaultFilters));

    // Sliders recreate
    createFilters();

    // Image redraw
    applyFilters();

});


// ===================== DOWNLOAD =====================

downloadBtn.addEventListener("click", () => {

    if (!image) {
        alert("Please upload an image first.");
        return;
    }

    applyFilters();

    const link = document.createElement("a");

    link.download = "edited-image.png";
    link.href = imageCanvas.toDataURL("image/png");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

});


// ===================== PRESET HELPERS =====================

function applyPreset(name) {

    const preset = presets[name];

    if (!preset) return;

    Object.keys(filters).forEach(key => {

        filters[key].value = preset[key];

    });

    createFilters();

    applyFilters();

}


// ===================== OPTIONAL =====================

// Agar future me JS se preset lagana ho
// applyPreset("Vintage");
// applyPreset("Warm");
// applyPreset("Dreamy");