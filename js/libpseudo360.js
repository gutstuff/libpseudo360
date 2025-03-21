function LibPseudo360(options) {
    this.defaultParam = function (parameter, fallbackValue) {
        if (
            parameter !== null
            && typeof parameter !== "undefined"
            && typeof parameter === typeof fallbackValue
        ) {
            return parameter;
        }
        return fallbackValue;
    }

    this.strEquals = function (a, b) {
        if (a > b) {
            return false;
        } else if (a < b) {
            return false;
        } else {
            return true;
        }
    };

    var debugMessages = this.defaultParam(options.debugMessages, false);
    this.debugInfo = function (data) {
        if (debugMessages) {
            console.log(data);
        }
    };

    this.addJob = function () {
        this.jobsTODO += 1;
    };

    this.completeJob = function () {
        this.jobsCompleted += 1;

        var loading = document.getElementById(this.containerLoading);
        if (loading !== null) {
            loading.innerHTML = Math.floor(
                (this.jobsCompleted / this.jobsTODO)
                * this.maxProgress
            ).toString() + "%";
        }

        if (this.jobsTODO <= this.jobsCompleted) {
            this.allJobsDone = true;
            this.finishLoading();
        }
    };

    this.createImage = function (src) {
        var image = new Image(), that = this;
        image.src = src;

        image.addEventListener("load", function () {
            that.completeJob();
        }, false);

        image.addEventListener("error", function () {
            that.completeJob();
        }, false);

        image.addEventListener("dragstart", function (event) {
            event.preventDefault();
        }, false);

        image.addEventListener("click", function (event) {
            event.preventDefault();
        }, false);

        image.addEventListener("dlbclick", function (event) {
            event.preventDefault();
        }, false);
        
        return image;
    }

    this.loadImages = function () {
        this.debugInfo("Images path: '" + this.imgPath + "'");
        this.debugInfo("First image: '" + this.firstImg + "'");
        this.debugInfo("Last image: '" + this.lastImg + "'");

        var firstImgElements = this.firstImg.split(".");
        var lastImgElements = this.lastImg.split(".");

        var beginWithZero = false;

        if (
            firstImgElements[0].length == lastImgElements[0].length
            && this.strEquals(firstImgElements[0].trim().charAt(0), "0")
        ) {
            beginWithZero = true;
            this.debugInfo("Image names begin with '0'!");
        }

        var num = parseInt(firstImgElements[0]);
        var lastNum = parseInt(lastImgElements[0]);

        this.debugInfo("Number of images: " + (lastNum - num + 1).toString()
            + ", loading...");

        var images = new Array();
        var imgDiv = document.getElementById(this.containerImages);
        var i, k, tmp;
        for (i = num; i <= lastNum; i++) {
            tmp = "";
            if (beginWithZero) {
                k = firstImgElements[0].length - i.toString().length;
                var l;
                for (l = 0; l < k; l++) {
                    tmp += "0";
                }
            }
            tmp += i.toString() + "." + firstImgElements[1];
            tmp = this.imgPath + tmp;

            var image = this.createImage(tmp);
            images.push(image);
            imgDiv.appendChild(image);
            this.addJob();
        }
        return images;
    }

    this.prepareRequestAnimationFrame = function (frameTime) {
        if (typeof window.requestAnimationFrame === "undefined") {
            this.debugInfo("window.requestAnimationFrame is undefined");
            window.requestAnimationFrame = function () {
                return window.requestAnimFrame
                    || window.webkitRequestAnimationFrame
                    || window.mozRequestAnimationFrame
                    || window.oRequestAnimationFrame
                    || window.msRequestAnimationFrame
                    || function (callback) {
                        this.debugInfo("use setTimeout() for animation");
                        window.setTimeout(callback, frameTime);
                    };
            };
        }
    }

    this.finishLoading = function () {
        var startDate = Date.now(), elapsed, nowDate, that = this;

        this.animationLoop = function () {
            window.requestAnimationFrame(function () {
                that.animationLoop();
            });

            if (
                !that.runAnim
                || that.pause
            ) {
                startDate = Date.now();
                return;
            }

            nowDate = Date.now();
            elapsed = nowDate - startDate;

            if (elapsed > that.frameTime) {
                startDate = nowDate - (elapsed % that.frameTime);
                if (that.nextDir) {
                    that.next(true);
                } else {
                    that.previous(true);
                }
            }
        };

        if (typeof this.readyFunc === "function") {
            this.readyFunc();
        }

        var width = 0, height = 0;
        if (
            this.imgWidth > 0
            && this.imgWidth <= this.imgArr[0].width
        ) {
            width = this.imgWidth;
        }

        if (
            this.imgHeight > 0
            && this.imgHeight <= this.imgArr[0].height
        ) {
            height = this.imgHeight;
        }

        this.imgArr.forEach(function (element) {
            if (
                width > 0
                && width >= height
            ) {
                element.style.width = width.toString() + "px";
            } else if (
                height > 0
                && height >= width
            ) {
                element.style.height = height.toString() + "px";
            }
        });

        var element = document.getElementById(this.containerLoading);
        if (element !== null) {
            element.parentNode.removeChild(element);
        }
        document.getElementById(this.containerImages).style.display = "";
        if (!this.hideMenu) {
            document.getElementById(this.containerPanel).style.display = "";
        }

        this.animationLoop();
    };

    this.next = function (scrollOnEnd) {
        if (typeof scrollOnEnd === "undefined") {
            scrollOnEnd = false;
        }

        if (this.state === this.STATE_PREV) {
            this.k += 2;
        }

        if (scrollOnEnd && this.k == this.imgArr.length) {
            this.imgArr[this.k - 1].style.display = "";
            this.k = 0;
        } else if (this.k >= this.imgArr.length) {
            this.k = this.imgArr.length - 1;
        }

        if (this.k > 0) {
            this.imgArr[this.k - 1].style.display = "";
        }
        this.imgArr[this.k].style.display = "block";

        this.k++;
        this.state = this.STATE_NEXT;
    };

    this.previous = function (scrollOnEnd) {
        if (typeof scrollOnEnd === "undefined") {
            scrollOnEnd = false;
        }

        if (this.state == this.STATE_NEXT) {
            this.k -= 2;
        }

        if (scrollOnEnd && this.k < 0) {
            this.imgArr[this.k + 1].style.display = "";
            this.k = this.imgArr.length - 1;
        } else if (this.k < 0) {
            this.k = 0;
        }

        if (this.k < (this.imgArr.length - 1)) {
            this.imgArr[this.k + 1].style.display = "";
        }
        this.imgArr[this.k].style.display = "block";

        this.k--;
        this.state = this.STATE_PREV;
    };

    this.setImage = function (index) {
        this.k = index;
        this.imgArr[this.k].style.display = "block";
    };

    this.onMouseMove = function (event) {
        var deltaX = this.lastx - event.pageX;
        this.lastx = event.pageX;

        if (Math.abs(deltaX) / 100.0 + 0.97 <= 1.0) {
            return;
        }

        var d = Math.floor(this.imgArr.length / 16.0);

        if (d < 1) {
            d = 1;
        }

        var i;
        for (i = 0; i < d; i++) {
            if (deltaX >= 0) {
                this.previous(!this.rLock);
            } else {
                this.next(!this.rLock);
            }
        }
    };

    this.addEvents = function () {
        var that = this;
        document.getElementById(this.panelRotate)
            .addEventListener("click", function () {
                that.nextDir = !that.nextDir;
            }, false);

        document.getElementById(this.panelPlay)
            .addEventListener("click", function () {
                document.getElementById(that.panelPlay).style.display = "none";
                document.getElementById(that.panelPause).style.display = "";
                that.pause = false;
            }, false);

        document.getElementById(this.panelPause)
            .addEventListener("click", function () {
                document.getElementById(that.panelPause).style.display = "none";
                document.getElementById(that.panelPlay).style.display = "";
                that.pause = true;
            }, false);

        document.getElementById(this.panelPrev)
            .addEventListener("click", function () {
                that.previous(!that.rLock);
            }, false);

        document.getElementById(this.panelNext)
            .addEventListener("click", function () {
                that.next(!that.rLock);
            }, false);

        var image = document.getElementById(this.containerImages);

        image.addEventListener("touchstart", function (event) {
            that.runAnim = false;
            if (typeof event.touches[0].pageX !== "undefined") {
                that.lastx = event.touches[0].pageX;
            } else
                if (typeof event.targetTouches[0].pageX !== "undefined") {
                    that.lastx = event.targetTouches[0].pageX;
                }
            that.mouseDown = true;
        }, false);

        image.addEventListener("mousedown", function (event) {
            that.runAnim = false;
            that.lastx = event.pageX;
            that.mouseDown = true;
        }, false);

        image.addEventListener("touchcancel", function (event) {
            event.preventDefault();
            that.mouseDown = false;
        }, false);

        image.addEventListener("mousemove", function (event) {
            if (that.mouseDown) {
                that.onMouseMove(event);
            }
        }, false);

        image.addEventListener("touchmove", function (event) {
            event.preventDefault();
            if (that.mouseDown) {
                event.pageX = 0;
                if (typeof event.touches[0].pageX !== "undefined") {
                    event.pageX = event.touches[0].pageX;
                } else
                    if (typeof event.targetTouches[0].pageX !== "undefined") {
                        event.pageX = event.targetTouches[0].pageX;
                    }
                that.onMouseMove(event);
            }
        }, false);

        image.addEventListener("mouseup", function () {
            that.runAnim = true;
            that.mouseDown = false;
        }, false);

        image.addEventListener("touchend", function () {
            that.runAnim = true;
            that.mouseDown = false;
        }, false);
    }

    this.containerLoading = this.defaultParam(options.containerLoading, "libpseudo360-loading");
    this.containerMain = this.defaultParam(options.containerMain, "libpseudo360-main");
    this.containerImages = this.defaultParam(options.containerImages, "libpseudo360-images");
    this.containerPanel = this.defaultParam(options.containerPanel, "libpseudo360-panel");
    this.panelPrev = this.defaultParam(options.panelPrev, "libpseudo360-panel-prev");
    this.panelNext = this.defaultParam(options.panelNext, "libpseudo360-panel-next");
    this.panelRotate = this.defaultParam(options.panelRotate, "libpseudo360-panel-rotate");
    this.panelPause = this.defaultParam(options.panelPause, "libpseudo360-panel-pause");
    this.panelPlay = this.defaultParam(options.panelPlay, "libpseudo360-panel-play");

    this.imgPath = this.defaultParam(options.imagePath, "img/").trim();
    if (!this.strEquals(this.imgPath.charAt(this.imgPath.length - 1), "/")) {
        this.imgPath += "/";
    }
    this.firstImg = this.defaultParam(options.firstImageName, "001.jpg").trim();
    this.lastImg = this.defaultParam(options.lastImageName, "002.jpg").trim();
    this.imgWidth = this.defaultParam(options.imageWidth, 0);
    this.imgHeight = this.defaultParam(options.imageHeight, 0);
    this.startImage = this.defaultParam(options.startImage, 0);

    this.nextDir = this.defaultParam(options.rotateLeft, true);
    this.rLock = this.defaultParam(options.cameraLock, false);
    this.hideMenu = this.defaultParam(options.hideMenu, false);
    this.pause = this.defaultParam(options.pause, false);
    this.fps = this.defaultParam(options.fps, 60);
    this.readyFunc = this.defaultParam(options.readyCallback, null);

    this.imgArr = new Array();
    this.k = 0;
    this.mouseDown = false;
    this.lastx = 0;
    this.runAnim = true;
    // 16 images => ~166ms per frame with 60 fps
    this.frameTime = 1000 / this.fps / (-0.0625 * 16 + 11);
    this.STATE_PREV = 1;
    this.STATE_NEXT = 2;
    this.state = 0;

    this.jobsTODO = 0;
    this.jobsCompleted = 0;
    this.allJobsDone = false;
    this.maxProgress = 100;
}

LibPseudo360.prototype.init = function () {
    document.getElementById(this.containerLoading).innerHTML = "0%";
    document.getElementById(this.panelPause).style.display
        = (this.pause ? "none" : "display");
    document.getElementById(this.panelPlay).style.display
        = (this.pause ? "display" : "none");

    this.addEvents();
    this.imgArr = this.loadImages();

    if (
        this.startImage > 0
        && this.startImage <= this.imgArr.length
    ) {
        this.k = this.startImage;
    }

    this.frameTime = 1000 / (this.fps / (-0.0625 * this.imgArr.length + 11));
    this.prepareRequestAnimationFrame(this.frameTime);
    this.setImage(this.k);
}
