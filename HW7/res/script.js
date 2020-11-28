/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  Joseph Calles
 *  University of Massachusetts --Lowell
 *  COMP.4610-201 HW7 Fall 2020
 *  Filename: https://jstar-c.github.io/GUI_I/HW6/res/script.js
 *  Email: joseph_calles@student.uml.edu
 *  Copyright (c) 2020 by Josph Calles. All rights reserved. May be freely
 *      copied or excerpted for educational purposes with credit to the author.
 *  File created on 11/25/2020.
 *  JavaScript file for HW7 Interactive Dynamic Table
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// ----------------------------------------------------------------------------

var errorIsUp    = false; // invalid input error label
var warningXIsUp = false; // x-axis warning label
var warningYIsUp = false; // y-axis warning label
var x_start, y_start, x_end, y_end; // table bounds
var table;
var checker;

// initialize slider values
$("#y_start_label").val(0);
$("#y_end_label"  ).val(0);
$("#x_start_label").val(0);
$("#x_end_label"  ).val(0);

// string to hold table content
const tab_content = `
        <div class="container">
            <div class="well table-placeholder">
                <!--   [generate table via JavaScript here]   -->
                <h3><center>Table will display here</center></h3>
            </div>
        </div>
    `

$("#Tab0").html(tab_content);

// ----------------------------------------------------------------------------

 /* jQuery tabs */

(function($) {
    var tabOpts = {
        beforeActivate: function (e, ui) {
            if (ui.newTab.index() == $("#myTabs ul li").length - 1) // when "+"" tab is clicked
            {
                console.log("created new tab");
                $("#myTabs ul .newTabButton") // create new  li for tab
                    .before(`<li class=\"tab\"><a href=\"#Tab${ui.newTab.index() - 1}\">New Tab</a></li>`);
                $("#myTabs #newTabButton")    // create new div for tab
                    .before(`<div id=\"Tab${ui.newTab.index() - 1}\"></div>`);
                $("#myTabs").tabs("refresh"); // refresh
            }
        },
        activate: function (e, ui) {
            if (ui.newTab.index() == $("#myTabs ul li").length - 1) // when "+"" tab is clicked
            {
                console.log("changed focus")
                $("#myTabs").tabs("option", "active", $("#myTabs ul li").length - 2); // change active tab
                $(`#myTabs #Tab${ui.newTab.index() - 1}`).html(tab_content);          // add html content
                $("#myTabs").tabs("refresh"); // refresh
            }
        }
    };
    $("#myTabs").tabs(tabOpts); // initalize the tabs object
})(jQuery);

// ----------------------------------------------------------------------------
 
 /* jQuery Validator */

$.validator.messages.required = ''; // removed becuase always valid
$.validator.messages.digits   = 'Please enter only digits';
$.validator.messages.number   = 'Please enter a number';
$.validator.messages.range    = 'Values must be in range (-50, 50)';

// a method to check if the X axis is properly ordered
jQuery.validator.addMethod("OrderedXAxis", function(value, element) {
        return x_start > x_end ? true : false;
    }, "Warning: the columns appear out-of-order");

// a method to check if the Y axis is properly ordered
jQuery.validator.addMethod("OrderedYAxis", function(value, element) {
        return y_start > y_end ? true : false;
    }, "Warning: the rows appear out-of-order");
  
$("#my-form").validate({
    rules: {
        y_start, y_end, x_start, x_end: {
            required : true,     // all inputs are required
            number   : true,     // all inputs must be numbers
            digits   : true,     // all inputs must be digits
            range    : [-50, 50] // all inputs must fall in the range
        },
        warnings: {
            OrderedXAxis : true, // custom addMethod calls 
            OrderedYAxis : true  //   for checking order of values
        }
    }
});

// ----------------------------------------------------------------------------
 /* y_start slider */

var y_start_sliderOpts = { // slider options
    animate:  true ,
    disabled: false,
    range:    false,
    values:   null ,
    min:      -50  ,
    max:       50  ,
    value:      0  ,
    step:       1  ,
    slide: function() {
        $("#y_start_label").val($("#y_start_slider").slider("value"));
    }
};

(function($){ // initialize slider
    $("#y_start_slider").slider(y_start_sliderOpts);
})(jQuery);

function update_y_start_label() { // update onblur
    $("#y_start_slider").slider("value", $("#y_start_label").val());
}

// ----------------------------------------------------------------------------
 /* y_end slider */

var y_end_sliderOpts = { // slider options
    animate:  true ,
    disabled: false,
    range:    false,
    values:   null ,
    min:      -50  ,
    max:       50  ,
    value:      0  ,
    step:       1  ,
    slide: function() {
        $("#y_end_label").val($("#y_end_slider").slider("value"));
    }
};

(function($){ // initialize slider
    $("#y_end_slider").slider(y_end_sliderOpts);
})(jQuery);

function update_y_end_label() { // update onblur
    $("#y_end_slider").slider("value", $("#y_end_label").val());
}

// ----------------------------------------------------------------------------
 /* x_start slider */

var x_start_sliderOpts = { // slider options
    animate:  true ,
    disabled: false,
    range:    false,
    values:   null ,
    min:      -50  ,
    max:       50  ,
    value:      0  ,
    step:       1  ,
    slide: function() {
        $("#x_start_label").val($("#x_start_slider").slider("value"));
    }
};

(function($){ // initialize slider
    $("#x_start_slider").slider(x_start_sliderOpts);
})(jQuery);

function update_x_start_label() { // update onblur
    $("#x_start_slider").slider("value", $("#x_start_label").val());
}

// ----------------------------------------------------------------------------
 /* x_end slider */

var x_end_sliderOpts = { // slider options
    animate:  true ,
    disabled: false,
    range:    false,
    values:   null ,
    min:      -50  ,
    max:       50  ,
    value:      0  ,
    step:       1  ,
    slide: function(e) {
        $("#x_end_label").val($("#x_end_slider").slider("value"));
    }
};

(function($){ // initialize slider
    $("#x_end_slider").slider(x_end_sliderOpts);
})(jQuery);

function update_x_end_label() { // update onblur
    $("#x_end_slider").slider("value", $("#x_end_label").val());
}

// ----------------------------------------------------------------------------

// capture the form and see when the user clicks the 'submit' button
$("#submission").click(getVariables);

/*
 * called when the user clicks the 'submit' button.
 * captures the user's input and invalidates inputs containing exponential
 * notation; then calls functions to manage warnings and generate table.
 */
function getVariables(e) 
{
    e.preventDefault(); // to prevent the screen from flashing

    console.log("input submitted");

    let userInput;  // used to hold the user's input as a string until it can be parsed

    // capture variables from input
    userInput = $("#y_start_label").val();
    y_start = (userInput.includes("e") || userInput.includes("E")) ? undefined : parseInt(userInput);

    userInput = $("#y_end_label"  ).val();
    y_end   = (userInput.includes("e") || userInput.includes("E")) ? undefined : parseInt(userInput);

    userInput = $("#x_start_label").val(); 
    x_start = (userInput.includes("e") || userInput.includes("E")) ? undefined : parseInt(userInput);

    userInput = $("#x_end_label"  ).val();
    x_end   = (userInput.includes("e") || userInput.includes("E")) ? undefined : parseInt(userInput);

    console.log(`user inputs: row(${y_start}-${y_end}) column(${x_start}-${x_end})`);

    if (check_for_validity()) // if the user's input are valid then ...
    {
        manage_warnings(); // add or remove warnings if applicable
        generate_table();  // generate the table from the inputs
    } 
    else // if the user's input are invalid then ...
    {
        post_error(); // post an error message and clear the input fields
    }
}

/*
 * checks each of the four inputs to make sure they are valid integers; if one
 * is not, it will be reset on the form and the function will return false
 */
function check_for_validity() 
{
    let validity = true; // initialze validity as true unless invalidated

    if (!Number.isInteger(y_start)) { // check validity of row top
        $("#y_start").val("");
        console.log("y_start is invalid");
        validity = false;
    }

    if (!Number.isInteger(y_end  )) { // check validity of row bottom
        $("#y_end"  ).val("");
        console.log("y_end is invalid");
        validity = false;
    }

    if (!Number.isInteger(x_start)) { // check validity of column left
        $("#x_start").val("");
        console.log("x_start is invalid");
        validity = false;
    }

    if (!Number.isInteger(x_end  )) { // check validity of column right
        $("#x_end"  ).val("");
        console.log("x_end is invalid");
        validity = false;
    }

    return validity;
}

/*
 * called when check_for_validity() returns true indicating that the user
 * inputs are valid, in which case we check if the inputs are out-of-order.
 * - if the inputs are out of order, post a warning message;
 * - if the inputs are not out of order, remove any warnings.
 * - if an error posted by post_error(), remove it.
 */
function manage_warnings()
{
    console.log("the inputs are valid");

    if(errorIsUp) // remove error message if needed
    {
        $("#ErrorInvalidInput").remove();          // remove element
        console.log("error message was removed"); // update log
        errorIsUp = false;                       // update status
    }

    // check the status of the warning X
    if (x_start > x_end && !warningXIsUp) // add warning if needed
    {
        $("#my-form").append(
            $("<span></span>").text("Warning: the columns appear out-of-order").attr({
            "class" : "label label-warning center-block",
               "id" : "warningX"
        })); // create an error, add text, and attributes 

        console.log("warning X was posted"); // update log
        warningXIsUp = true;                // update status
    } 
    else if (x_start <= x_end && warningXIsUp)   // remove warning if needed
    {
        $("#warningX").remove();               // remove element
        console.log("warning X was removed"); // update log
        warningXIsUp = false;                // update status
    }

    // check the status of the warning Y
    if (y_start > y_end && !warningYIsUp) // add warning if needed
    {
        $("#my-form").append(
            $("<span></span>").text("Warning: the rows appear out-of-order").attr({
            "class" : "label label-warning center-block",
               "id" : "warningY"
        })); // create an error, add text, and attributes 

        console.log("warning Y was posted"); // update log
        warningYIsUp = true;                // update status
    } 
    else if (y_start <= y_end && warningYIsUp)   // remove warning if needed
    {
        $("#warningY").remove();               // remove element
        console.log("warning Y was removed"); // update log
        warningYIsUp = false;                // update status
    }

    return;
}

/*
 * generate the Interactive Dynamic Table using valid inputs.
 * clears all the contents of the 'table-placeholder' id in the HTML
 * and then creates <div class="table"><table class="table"></table></div>
 * within it before generating the table using a nested for-loop.
 */
function generate_table()
{
    let currentTab = $("#myTabs").tabs("option", "active");
    console.log(currentTab);
    table = $(`#myTabs #Tab${currentTab} .table-placeholder`);
    console.log(table);

    // this does not work for some reason 
    //document.getElementById("myTabs").getElementsByTagName('ul')[0].childNodes[currentTab].textContent= `${y_start}<br>${y_end}<br>${x_start}<br>${x_end}`;
    //document.getElementById("myTabs").getElementsByTagName('ul')[0].childNodes[currentTab].setAttribute("style", "min-width:2em;text-align:right;padding:10px");
    
    let xAdder = x_start < x_end ? 1 : -1;
    let yAdder = y_start < y_end ? 1 : -1;

    // clear pervious table or placeholder
    table.empty();
    console.log("previous contents cleared");

    // generate <div>
    table.append($("<div></div>").attr("class", "table"));

    table = $("div.table"); // advance table one level inward

    // generate <table>
    table.append($("<table></table>").attr("class", "table"));

    table = $("table.table"); // advance table one level inward

    // generate initial row <tr>
    table.append($("<tr></tr>"));

    // generate top-left entry <th>
    let row = $("tr").last();   // create row
    row.append($("<th></th>")); // create entry

    // generate table headers <th>
    for(let x = x_start; x != x_end + xAdder; x += xAdder)
    {
        row.append($("<th></th>").text(x));
    }

    // generate rows
    for(let y = y_start; y != y_end + yAdder; y += yAdder)
    {
        table.append($("<tr></tr>"));       // create row
        row = $("tr").last();               // select row
        row.append($("<td></td>").text(y)); // add header

        // fill each row one column at a time
        for(let x = x_start; x != x_end + xAdder; x += xAdder)
        {
            row.append($("<td></td>").text(y * x));
        }
    }

    console.log("table created");
    
    return;
}

/*
 * called when check_for_validity() returns false indicating that the user 
 * inputs are invalid, in which case an error message will be posted.
 */
function post_error() 
{
    if (!errorIsUp) // post error message
    {
        $("#my-form").append(
            $("<span></span>").text("Error: invalid input(s)").attr({
            "class" : "label label-danger center-block",
               "id" : "ErrorInvalidInput"
        })); // create an error, add text, and attributes 

        console.log("ErrorInvalidInput was posted"); // update log
        errorIsUp = true;                           // update status
    }

    return;
}

