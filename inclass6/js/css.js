// inclass6 Joseph Calles (css.js)

$(function() {

    // capture original color
    let backgroundColor = $("#page ul li:first").css("background-color");

    // append paragraph after <ul> tag
    $("#page").append(`<p>Color was: ${backgroundColor}</p>`);

    // modify CSS of all list items
    $("#page ul li").css({
        "background-color" : "#c5a996"         ,
                  "border" : "white solid 1px" ,
                   "color" : "black"           ,
             "text-shadow" : "none"            ,
             "font-family" : "Georgia"         ,
    });

});
