const videoContainer = document.querySelector('#camera');
const video = document.querySelector('#video-preview');
const canvas = document.querySelector('canvas');
let camera = 'user';
let torch = false;
let videoWidth = 0;
let videoHeight = 0;

// Start camera
function initiateCamera () {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: {ideal: 4096},
            height: {ideal: 4096},
            facingMode: camera,
        }
    })
    .then(function(mediaStream) {
        // Start stream
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
            video.play();
        };

        // Get stream track
        let stream = mediaStream.getVideoTracks()[0];
    
        // log actual width & height of the camera video
        console.log('Camera Resolution: ' + stream.getSettings().width + 'x' + stream.getSettings().height);

        // Setup canvas
        canvas.height = parseInt(stream.getSettings().height < stream.getSettings().width ? stream.getSettings().height : stream.getSettings().width);
        canvas.width = canvas.height;
        console.log('Canvas size: ' + canvas.height + 'x' + canvas.width);
    })
    .catch(function(error) {
        /* handle error */
        console.log(error.name + ": " + error.message);
    });
}

initiateCamera();

// Stop Camera
function stopCamera(){
    if (video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
        video.srcObject = null;
    }
}

// Switch camera facingmode
const cameraSwitch = document.querySelector('#switch-camera');
cameraSwitch.addEventListener('click', function() {
    stopCamera();
    camera === 'user' ? camera = 'environment' : camera = 'user';
    console.log('Facingmode: ' + camera);
    initiateCamera();
});

// Take snapshot
const snap = document.querySelector('#snap');
const ctx =  canvas.getContext('2d');
const photo = document.querySelector('#photo');

snap.addEventListener('click', function(e){
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // apply filter to canvas
    let filter = getComputedStyle(videoContainer).filter;
    ctx.filter = filter;

    // Get scale factor for videoframe to fill square canvas
    let scale = Math.max(canvas.width / videoWidth, canvas.height / videoHeight);
    let x = (canvas.width / 2) - (videoWidth / 2) * scale;
    let y = (canvas.height / 2) - (videoHeight / 2) * scale;

    // disable image smoothening bcuz it sucks
    ctx.imageSmoothingEnabled = false;

    // add video frame to canvas
    ctx.drawImage(video, x, y, videoWidth * scale, videoHeight * scale);

    // apply overlays to canvas
    applyOverlay(getComputedStyle(videoContainer, '::before'));
    applyOverlay(getComputedStyle(videoContainer, '::after'));

    // covert canvas to dataURL
    const data = canvas.toDataURL('image/jpeg', 0.7);

    // save image
    let timestamp = new Date(Date.now());
    timestamp = {
        'year': timestamp.getFullYear(),
        'month': timestamp.getMonth() + 1,
        'day': timestamp.getDate(),
        'hour': timestamp.getHours(),
        'min': timestamp.getMinutes(),
        'sec': timestamp.getSeconds()
    }

    photo.download = 'IMG_' + timestamp.year + '-' + timestamp.month + '-' + timestamp.day + '_' + timestamp.hour + '-' + timestamp.min + '-' + timestamp.sec + '.jpg';
    photo.setAttribute('href', data);
    photo.click();

}, false);

// Filters

const filterSelect = document.querySelector('#filter-selection');

const filters = [
    "filter-1977",
    "filter-aden",
    "filter-amaro",
    "filter-ashby",
    "filter-brannan",
    "filter-brooklyn",
    "filter-charmes",
    "filter-clarendon",
    "filter-crema",
    "filter-dogpatch",
    "filter-earlybird",
    "filter-gingham",
    "filter-ginza",
    "filter-hefe",
    "filter-helena",
    "filter-hudson",
    "filter-inkwell",
    "filter-kelvin",
    "filter-juno",
    "filter-lark",
    "filter-lofi",
    "filter-ludwig",
    "filter-maven",
    "filter-mayfair",
    "filter-moon",
    "filter-nashville",
    "filter-perpetua",
    "filter-poprocket",
    "filter-reyes",
    "filter-rise",
    "filter-sierra",
    "filter-skyline",
    "filter-slumber",
    "filter-stinson",
    "filter-sutro",
    "filter-toaster",
    "filter-valencia",
    "filter-vesper",
    "filter-walden",
    "filter-willow",
    "filter-xpro-ii"
]

filters.forEach(function(filter){
    let label = document.createElement('label');
    label.setAttribute('for', filter);
    label.textContent = filter.replace('filter-', '');

    let input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('id', filter);
    input.setAttribute('name', 'filter');
    input.setAttribute('value', filter);

    filterSelect.appendChild(input);
    filterSelect.appendChild(label);
});

// Set filter on video preview

filterSelect.addEventListener('click', function(){
    let seletctedFilter = document.querySelector('input[type=radio]:checked').value;
    videoContainer.className = '';

    if (filterSelect.value === "None") {
        return;
    } else {
        videoContainer.classList.add(seletctedFilter);
    }
}, false);

// apply overlay function
function applyOverlay(overlayElement){
    // set blendmode
    ctx.globalCompositeOperation = overlayElement.mixBlendMode;

    if(overlayElement.opacity !== 1){
        ctx.globalAlpha = overlayElement.opacity;
    }

    // set color and add rectangle to canvas
    ctx.fillStyle = overlayElement.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // set blendmode
    ctx.globalCompositeOperation = overlayElement.mixBlendMode;

    // set gradients
    if (overlayElement.backgroundImage.startsWith('radial-gradient')) {
        let gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.sqrt((canvas.width / 2) * (canvas.width / 2) + (canvas.width / 2) * (canvas.width / 2)));

        // Get gradient values
        let gradientColors = overlayElement.backgroundImage.match(/rgba\(\d+, \d+, \d+, (\d*|(\.\d+)|\d.\d+)\)/g);
        let gradientStops = overlayElement.backgroundImage.match(/\) \d+/g);

        for (let i = 0; i < gradientColors.length; i++) {
            gradientStops[i] = gradientStops[i].replace(') ', '');
            gradientStops[i] = parseInt(gradientStops[i]) / 100;
            gradient.addColorStop(gradientStops[i], gradientColors[i]);
        }

        ctx.fillStyle = gradient;
        
    } else if (overlayElement.backgroundImage.startsWith('linear-gradient')) {
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);

        // Get gradient values
        let gradientColors = overlayElement.backgroundImage.match(/rgba\(\d+, \d+, \d+, (\d*|(\.\d+)|\d.\d+)\)/g);
        let gradientStops = [0,1];

        for (let i = 0; i < gradientColors.length; i++) {
            gradient.addColorStop(gradientStops[i], gradientColors[i]);
            console.log(gradientStops[i], gradientColors[i]);
        }
        
        ctx.fillStyle = gradient;
    }

    // add colored rectangle to canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
}