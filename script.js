/* -------------------- SVG Devices -------------------- */

function renderDevices() {
    const devices = document.querySelectorAll(".replace-with-svg");

    devices.forEach(device => {
        let video = device.getAttribute("data-video");
        let screen = device.getAttribute("data-screen");
        let type = device.getAttribute("data-device");
        let svg;

        switch (type) {
            case "smartphone":
                if (video === "true") {
                    svg = '<svg class="smartphone" data-name="Smartphone" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1314 2658"><defs><clipPath id="clip-path-smartphone"><path d="M1098,63c77.2-1.56,145.69,66.69,144,144V2451a145,145,0,0,1-2.93,29c-10.81,55.33-56.69,101.27-112,112.05a145,145,0,0,1-29,2.93H216a145,145,0,0,1-29-2.93c-55.35-10.82-101.26-56.67-112-112.05A145,145,0,0,1,72,2451V207A143.87,143.87,0,0,1,216,63Z" fill="none" /></clipPath></defs ><path class="device-body" d="M1100,0c113.22,0,205,91.78,205,205V680h5a4,4,0,0,1,4,4V992a4,4,0,0,1-4,4h-5V2453c0,113.22-91.78,205-205,205H214c-113.22,0-205-91.78-205-205V1070H4a4,4,0,0,1-4-4V874a4,4,0,0,1,4-4H9V815H4a4,4,0,0,1-4-4V619a4,4,0,0,1,4-4H9V522H4a4,4,0,0,1-4-4V427a4,4,0,0,1,4-4H9V205C9,91.78,100.78,0,214,0" fill="#fff" /><foreignObject clip-path="url(#clip-path-smartphone)" width="1170" height="100%" x="72" y="63"><video class="screen" width="1170" transform="translate(72 63)" autoplay loop muted><source src=' + screen + ' type="video/mp4"></video></foreignObject></svg>'
                } else {
                    svg = '<svg class="smartphone" data-name="Smartphone" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1314 2658"><defs><clipPath id="clip-path-smartphone"><path d="M1098,63c77.2-1.56,145.69,66.69,144,144V2451a145,145,0,0,1-2.93,29c-10.81,55.33-56.69,101.27-112,112.05a145,145,0,0,1-29,2.93H216a145,145,0,0,1-29-2.93c-55.35-10.82-101.26-56.67-112-112.05A145,145,0,0,1,72,2451V207A143.87,143.87,0,0,1,216,63Z" fill="none" /></clipPath></defs><path class="device-body" d="M1100,0c113.22,0,205,91.78,205,205V680h5a4,4,0,0,1,4,4V992a4,4,0,0,1-4,4h-5V2453c0,113.22-91.78,205-205,205H214c-113.22,0-205-91.78-205-205V1070H4a4,4,0,0,1-4-4V874a4,4,0,0,1,4-4H9V815H4a4,4,0,0,1-4-4V619a4,4,0,0,1,4-4H9V522H4a4,4,0,0,1-4-4V427a4,4,0,0,1,4-4H9V205C9,91.78,100.78,0,214,0" fill="#fff" /><g clip-path="url(#clip-path-smartphone)"><image class="screen" width="1170" transform="translate(72 63)" xlink:href=' + screen + ' /></g></svg>'
                }
                break;

            case "tablet":
                svg = '<svg class="tablet" data-name="Tablet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 2583 2317.64"><defs><clipPath id="clip-path-tablet"><path d="M135.41,99.19h2318a35,35,0,0,1,35,35v1598a35,35,0,0,1-35,35h-2318a35,35,0,0,1-35-35v-1598A35,35,0,0,1,135.41,99.19Z" fill="none" /></clipPath></defs><path class="device-body" d="M137.41,1862.19a132,132,0,0,1-132-132v-1468h-3a2,2,0,0,1-2-2v-120a2,2,0,0,1,2-2h3v-2a132,132,0,0,1,132-132h72v-3a2,2,0,0,1,2-2h101a2,2,0,0,1,2,2v3h20v-3a2,2,0,0,1,2-2h101a2,2,0,0,1,2,2v3h2012a132,132,0,0,1,132,132v1594a132,132,0,0,1-132,132Z" /><g clip-path="url(#clip-path-tablet)"><image class="screen" width="2388" transform="translate(100 100)" xlink:href=' + screen + ' /></g></svg>'
                break;

            case "display":
                if (video === "true") {
                    svg = '<svg class="display" data-name="Display" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 6175 4580"><defs><clipPath id="clip-path-display"><rect x="79.51" y="79.52" width="6016" height="3384" fill="none" /></clipPath></defs><g class="device-body"><path d="M2338.51,4571.52h199v4a4,4,0,0,1-4,4h-191a4,4,0,0,1-4-4v-4Z"/><path d="M3642.51,4571.52h199v4a4,4,0,0,1-4,4h-191a4,4,0,0,1-4-4v-4Z"/><rect x="2316.51" y="4493.52" width="1542" height="78" fill="#ccc"/><rect x="2316.51" y="3543.52" width="1542" height="950" fill="#ebebeb"/><path d="M43.51-.48h6088a44,44,0,0,1,44,44v3456a44,44,0,0,1-44,44H43.51a44,44,0,0,1-44-44V43.52A44,44,0,0,1,43.51-.48Z"/></g><foreignObject clip-path="url(#clip-path-display)" width="6016" height="100%" x="80" y="80"><video class="screen" width="6016" transform="translate(80 80)" autoplay loop muted><source src=' + screen + ' type="video/mp4"></video></foreignObject></svg>'
                } else {
                    svg = '<svg class="display" data-name="Display" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 6175 4580"><defs><clipPath id="clip-path-display"><rect x="79.51" y="79.52" width="6016" height="3384" fill="none" /></clipPath></defs><g class="device-body"><path d="M2338.51,4571.52h199v4a4,4,0,0,1-4,4h-191a4,4,0,0,1-4-4v-4Z"/><path d="M3642.51,4571.52h199v4a4,4,0,0,1-4,4h-191a4,4,0,0,1-4-4v-4Z"/><rect x="2316.51" y="4493.52" width="1542" height="78" fill="#ccc"/><rect x="2316.51" y="3543.52" width="1542" height="950" fill="#ebebeb"/><path d="M43.51-.48h6088a44,44,0,0,1,44,44v3456a44,44,0,0,1-44,44H43.51a44,44,0,0,1-44-44V43.52A44,44,0,0,1,43.51-.48Z"/></g><g clip-path="url(#clip-path-display)"><image class="screen" width="6016" transform="translate(80 80)" xlink:href=' + screen + ' /></g></svg>'
                }
                break;
        }

        device.outerHTML = svg;
    })
}

renderDevices();
