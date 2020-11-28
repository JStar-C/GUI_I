
(function($){
    $("#myTabs").tabs();
    $("#myTabs").bind("tabsselect", function(e, tab) {
        tab.index
    })(jQuery);