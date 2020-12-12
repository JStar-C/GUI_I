// inclass6 Joseph Calles (adding-new-content.js)

$(function() {

    // add "just updated" paragraph 
    $("#page ul").before("<p>Just updated</p>");

    // prepend "+" to all items of class hot
    $("#page ul li.hot").prepend("+ ");

    // append a new item to the list
    let new_list_item = $("<li id=\"five\"><em>gluten-free</em> soy sauce</li>");
    $("#page ul").last().append(new_list_item);

});
