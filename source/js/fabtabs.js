if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var settings = {};

    var init,
        selectTab;

    var methods = {
        init: function($el, options) {
            init($el, options);
        },
        selectTab: function($el, options) {
            selectTab($el, options);
        }
    };

    $.fn.tabs = function (methodOrOptions) {
        var $elements = $(this),
            options = false;

        if (methods[methodOrOptions]) {
            options = (arguments[1]) ? arguments[1]: false;
            return methods[methodOrOptions]($elements, options);
        } else if (typeof methodOrOptions === 'object' || ! methodOrOptions) {
            // Default to "init"
            options = (arguments[0]) ? arguments[0]: false;
            return methods.init($elements, options);
        } else {
            $.error('Method ' +  methodOrOptions + ' does not exist on jQuery.tabs');
        }

    };

    // TODO: enable the use of the tabs without js (urls for tabs)

    init = function(elements, options) {
        if (options) {
            $.extend(settings, options);
        }

        elements.each(function() {
            var $container = $(this);

            var $tablist = $container.children('ul:first-of-type'),
                $tabPanels = $container.children('.c-tabs__tabpanel');

            /*
                filters out data-fabtabs=false to allow a link in the list not
                to be a tab
                TODO: This needs to be handled better as it breaks tabbing
            */
            var $tabs = $tablist.find('a').not('[data-fabtabs="false"]');

            $tablist.attr('role','tablist');
            $tablist.find('li').attr('role','presentation');

            $tabs.attr({
                'role' : 'tab',
                'tabindex' : '-1'
            });

            // Make each aria-controls correspond to id of targeted section (re href)
            $tabs.each(function() {
                $(this).attr(
                    'aria-controls', $(this).attr('href').substring(1)
                );
            });

            // Make each section focusable and give it the tabpanel role
            $tabPanels.attr({
                'role' : 'tabpanel'
            });

            // Make first child of each panel focusable programmatically
            $tabPanels.find('> *:first-child').attr({
                'tabindex' : '0'
            });

            // Make all but the first section hidden (ARIA state and display CSS)
            $tabPanels.not(":eq(0)").attr({
                'aria-hidden' : 'true'
            });

            // Change focus between tabs with arrow keys
            $tabs.on('keydown', function(e) {
                // define current, previous and next (possible) tabs
                var $prev = $(this).parents('li').prev().children('[role="tab"]');
                var $next = $(this).parents('li').next().children('[role="tab"]');
                var $target;

                // find the direction (prev or next)
                switch (e.keyCode) {
                    case 37:
                        $target = $prev;
                    break;
                    case 39:
                        $target = $next;
                    break;
                    default:
                        $target = false
                    break;
                }

                if ($target) {
                    selectTab($container, $tabs.index($target), true);
                }
            });

            // Handle click on tab to show + focus tabpanel
            $tabs.on('click', function(event) {
                selectTab($container, $tabs.index($(this)));
                event.preventDefault();
            });

            // Select first tab by default
            selectTab($container, $tabs.index(0));
        });
    }

    selectTab = function($container, tabNum, focus) {
        var $tabs,
            $tabToSelect,
            $tabPanels,
            $tabPanelToSelect;

        $container.trigger('tab.beforeChange', [$tabPanelToSelect, $tabToSelect, tabNum]);

        $tabs = $container.children('[role="tablist"]').find('[role="tab"]');
        $tabPanels = $container.children('[role="tabpanel"]');
        $tabToSelect = $tabs.eq(tabNum);
        $tabPanelToSelect = $('#' + $tabToSelect.attr('href').substring(1));

        // remove focusability [sic] and aria-selected
        $tabs.attr({
            'tabindex': '-1',
            'aria-selected' : null
        });
        $tabs.removeClass('is-active');

        // replace above on clicked tab
        $tabToSelect.attr({
            'tabindex' : '0',
            'aria-selected' : true
        });
        // class useful for styled tabs which actually are not tabs at all
        $tabToSelect.addClass('is-active');

        if (focus) {
            $tabToSelect.focus();
        }

        // Hide panels
        $tabPanels.attr('aria-hidden', 'true');

        // show corresponding panel
        $tabPanelToSelect.attr('aria-hidden', null);

        /*
            TODO: when tabs are nested this is called more than once
        */
        $container.trigger('tab.afterChange', [$tabPanelToSelect, $tabToSelect, tabNum]);
    }
}));