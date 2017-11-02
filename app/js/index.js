(function() {
    'use strict';

    var SECTION_WITH_KEYS_SELECTOR = '.js-section-with-keys';
    var KEYS_PER_SECTION = 8;
    var KEYS_CATEGORIES = [
        ['key-grey-1', 'key-grey-1', 'key-grey-1', 'key-blue-1', 'key-blue-2'],
        ['key-no-rotate', 'key-rotate'],
        ['key-far', 'key-middle', 'key-close']
    ];
    var THROTTLE_SCROLL_TIME = 50; // ms

    var MOVEMENT_RANGE_FAR_KEYS = 25; //px
    var MOVEMENT_RANGE_MIDDLE_KEYS = 75; //px
    var MOVEMENT_RANGE_CLOSE_KEYS = 150; //px

    var keysContainersCache = null;
    var viewportHeightCache = null;

    setTimeout(init);

    function init() {
        if(!isBrowserCompatible()) {
            return;
        }
        insertKeysDecoratoration();
        updateKeysOnScroll();
        window.onresize = throttle(resetSizes, THROTTLE_SCROLL_TIME);
    }

    function isBrowserCompatible() {
        return !!document.querySelectorAll;
    }

    function insertKeysDecoratoration() {
        var sectionsWithDecorators = document.querySelectorAll(SECTION_WITH_KEYS_SELECTOR);
        for(var i=0; i<sectionsWithDecorators.length; i++) {
            addKeysToSection(sectionsWithDecorators[i]);
        }
    }

    function updateKeysOnScroll() {
        window.addEventListener('scroll', throttle(updateKeys, THROTTLE_SCROLL_TIME), { passive: true });
    }

    function updateKeys() {
        var keysContainers = getKeysContainers();
        var middleOfScreen = getMiddleOfScreen();
        for(var i=0; i<keysContainers.length; i++) {
            updateKeysForContainer(keysContainers[i], middleOfScreen);
        }
    }

    function updateKeysForContainer(containerInfo, middleOfScreen) {
        var percentage = getPercentageInViewport(containerInfo, middleOfScreen);
        var farKeyModifier = getPositionModifierFromPercentage(percentage, MOVEMENT_RANGE_FAR_KEYS);
        var middleKeyModifier = getPositionModifierFromPercentage(percentage, MOVEMENT_RANGE_MIDDLE_KEYS);
        var closeKeyModifier = getPositionModifierFromPercentage(percentage, MOVEMENT_RANGE_CLOSE_KEYS);

        applyYTranslationToElements(containerInfo.farKeys, farKeyModifier);
        applyYTranslationToElements(containerInfo.middleKeys, middleKeyModifier);
        applyYTranslationToElements(containerInfo.closeKeys, closeKeyModifier);
    }

    function getPositionModifierFromPercentage(percentage, range) {
        return 2*(percentage - 0.5)*range;
    }

    function applyYTranslationToElements(elements, y) {
        for(var i=0; i<elements.length; i++) {
            elements[i].style.webkitTransform = 'translateY(' + y + 'px)';
            elements[i].style.transform = 'translateY(' + y + 'px)';
        }
    }

    function getPercentageInViewport(containerInfo, middleOfScreen) {
        var startOfContainer = containerInfo.offsetTop;
        var endOfContainer = containerInfo.offsetTop + containerInfo.height;
        if(!containerInfo.height) {
            return 0;
        }
        if(middleOfScreen <= startOfContainer) {
            return 0;
        }
        if(middleOfScreen >= endOfContainer) {
            return 1;
        }
        return (middleOfScreen - startOfContainer)/containerInfo.height;
    }

    function getKeysContainers() {
        if(!keysContainersCache) {
            keysContainersCache = [];
            var sectionsWithDecorators = document.querySelectorAll(SECTION_WITH_KEYS_SELECTOR);
            for(var i=0; i<sectionsWithDecorators.length; i++) {
                keysContainersCache.push({
                    offsetTop: sectionsWithDecorators[i].offsetTop,
                    height: sectionsWithDecorators[i].clientHeight,
                    farKeys: sectionsWithDecorators[i].querySelectorAll('.key-far'),
                    middleKeys: sectionsWithDecorators[i].querySelectorAll('.key-middle'),
                    closeKeys: sectionsWithDecorators[i].querySelectorAll('.key-close')
                });
            }
        }
        return keysContainersCache;
    }

    function resetSizes() {
        keysContainersCache = null;
        viewportHeightCache = null;
    }

    function getTopScroll() {
        var doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    }

    function getMiddleOfScreen() {
        var topScroll = getTopScroll();
        var viewportHeight = getViewportHeight();
        return topScroll + (viewportHeight / 2);
    }

    function getViewportHeight() {
        if(!viewportHeightCache) {
            viewportHeightCache = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        }
        return viewportHeightCache;
    }

    function addKeysToSection(section) {
        for(var i=0; i<KEYS_PER_SECTION; i++) {
            var newKey = createNewKey();
            section.appendChild(newKey);
        }
    }

    function createNewKey() {
        var classesToApply = ['key'];
        for(var i=0; i<KEYS_CATEGORIES.length; i++) {
            classesToApply.push(pickRandomOneFromArray(KEYS_CATEGORIES[i]));
        }
        var topPercentage = getRandomBetween(5, 95);
        var leftPercentage = getRandomBetween(5, 95);
        return createDOMElement(classesToApply, topPercentage, leftPercentage);
    }

    function createDOMElement(classesToApply, topPercentage, leftPercentage) {
        var element = document.createElement('div');
        element.className += " " + classesToApply.join(' ');
        element.style.top = topPercentage + '%';
        element.style.left = leftPercentage + '%';
        return element;
    }

    function pickRandomOneFromArray(optionsArray) {
        var randomIndex = getRandomBetween(0, optionsArray.length);
        return optionsArray[randomIndex];
    }

    function getRandomBetween(min, maxNotIncluding) {
        var random = min + Math.random()*(maxNotIncluding - min);
        return Math.floor(random);
    }

    // From https://remysharp.com/2010/07/21/throttling-function-calls
    function throttle(fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      var last,
          deferTimer;
      return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    }

    function debounce(fn, delay) {
      var timer = null;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      };
    }

})();
