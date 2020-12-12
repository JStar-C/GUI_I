// inclass6 Joseph Calles (changing-content.js)

$(function() {
    
    // change list items containing "pine" to "almonds"
    $("#page ul li:contains(pine)").text("almonds");

    // add <em> tag to elements of class hot
    $("#page ul li.hot").wrap("<em></em>");

    // remove list item with id="one"
    $("#one").remove();
});
