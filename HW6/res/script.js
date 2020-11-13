/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  Joseph Calles
 *  University of Massachusetts --Lowell
 *  COMP.4610-201 HW6 Fall 2020
 *  Filename: https://jstar-c.github.io/GUI_I/HW6/res/script.js
 *  Email: joseph_calles@student.uml.edu
 *  Copyright (c) 2020 by Josph Calles. All rights reserved. May be freely
 *      copied or excerpted for educational purposes with credit to the author.
 *  File created on 11/10/2020.
 *  JavaScript file for HW6 Interactive Dynamic Table
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.2/jquery.validate.min.js";

var errorIsUp    = false; // invalid input error label
var warningXIsUp = false; // x-axis warning label
var warningYIsUp = false; // y-axis warning label
var x_start, y_start, x_end, y_end; // table bounds

// source: https://stackoverflow.com/a/10180618
// Apr 16 '12 at 19:47 Josh
$.validator.messages.required = 'Please enter some value';
$.validator.messages.digits   = 'Please enter only digits';
$.validator.messages.number   = 'Please enter a number';
$.validator.messages.range    = 'Values must be in range (-100, 100)';

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
            required : true,       // all inputs are required
            number : true,        // all inputs must be numbers
            digits : true,       // all inputs must be digits
            range : [-100, 100] // all inputs must fall in the range
        },
        warnings: {
            OrderedXAxis : true, // custom addMethod calls 
            OrderedYAxis : true  //   for checking order of values
        }
    }
});

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

    console.log("input submitted")

    let userInput;  // used to hold the user's input as a string until it can be parsed

    // capture variables from input
    userInput = $("#y_start").val();
    y_start = (userInput.includes("e") || userInput.includes("E")) ? undefined : parseInt(userInput);

    userInput = $("#y_end"  ).val();
    y_end   = (userInput.includes("e") || userInput.includes("E")) ? undefined : parseInt(userInput);

    userInput = $("#x_start").val(); 
    x_start = (userInput.includes("e") || userInput.includes("E")) ? undefined : parseInt(userInput);

    userInput = $("#x_end"  ).val();
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
    let table = $("#table-placeholder")

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