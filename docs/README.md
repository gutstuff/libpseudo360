# Documentation

## Options 

```js
(new LibPseudo360({
    optionName: value
})).init();
```

```js
var options = {
    /**
     * Path to images, relative to html file
     * @typedef string
     */
    imagePath: "img/",
    /**
     * First image name
     * @typedef string
     */
    firstImageName: "001.jpg",
    /**
     * Last image name
     * @typedef string
     */
    lastImageName: "016.jpg",
    /**
     * Force image width in px (when imageWidth > imageHeight)
     * @typedef number
     */
    imageWidth: 150,
    /**
     * Force image height in px (when imageHeight > imageWidth)
     * @typedef number
     */
    imageHeight: 150,
    /**
     * Start from image number
     * @typedef number
     */
    startImage: 5,
    /**
     * @typedef boolean
     */
    rotateLeft: true,
    /**
     * @typedef boolean
     */
    cameraLock: false,
    /**
     * Hide menu
     * @typedef boolean
     */
    hideMenu: false,
    /**
     * Start with animation paused
     * @typedef boolean
     */
    pause: false,
    /**
     * Animation frames per seconds
     * @typedef number
     */
    fps: 60,
    /**
     * Show debug messages in console
     * @typedef boolean
     */
    debugMessages: false,
    /**
     * Call function after all images are loaded
     * @typedef function
     */
    readyCallback: function whenReady() {
        console.log("Call whenReady()");
    }
}
```
