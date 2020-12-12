// inclass6 Joseph Calles (attributes.js)

$(function() {

    // remove class of "hot" from third item in list
    $("#page ul li:eq(2)").removeClass("hot");

    // add class of "favorite" to all items of of class "hot"
    $("#page ul li.hot").addClass("favorite");
});
