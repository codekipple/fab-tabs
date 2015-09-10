$(document).ready(function () {
    var $tabs = $('.js-tabs');

    $tabs.tabs();
    $tabs.on('tab.afterChange', function(event, $tab, $tabButton, tabNum) {
        // reset and refresh any embeded sliders or maps
        console.log('change');
    });
});