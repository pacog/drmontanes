setTimeout(init);

var SECTION_WITH_KEYS_SELECTOR = '.js-section-with-keys';
var KEYS_PER_SECTION = 10;
var KEYS_CATEGORIES = [
    ['key-grey-1', 'key-grey-1', 'key-grey-1', 'key-blue-1', 'key-blue-2'],
    ['key-no-rotate', 'key-rotate'],
    ['key-far', 'key-middle', 'key-close']
];

function init() {
    if(!isBrowserCompatible()) {
        return;
    }
    insertKeysDecoratoration();
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

function addKeysToSection(section) {
    for(i=0; i<KEYS_PER_SECTION; i++) {
        var newKey = createNewKey();
        console.log(newKey);
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
