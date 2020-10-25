/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  Joseph Calles
 *  University of Massachusetts --Lowell
 *  COMP.4610-201 HW5 Fall 2020
 *  Filename: https://jstar-c.github.io/GUI_I/HW5/res/script.js
 *  Email: joseph_calles@student.uml.edu
 *  Copyright (c) 2020 by Josph Calles. All rights reserved. May be freely
 *      copied or excerpted for educational purposes with credit to the author.
 *  File created on 10/20/2020.
 *  JavaScript file for HW5 Interactive Dynamic Table
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var errorIsUp = false;    // invalid input error label
var warningXIsUp = false; // x-axis warning label
var warningYIsUp = false; // y-axis warning label
var x_start, y_start, x_end, y_end;  // table bounds

 // capture the form and see when the user clicks the 'submit' button
const form = document.querySelector("#my-form");
form.addEventListener("submit", getVariables);

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

    /* 
     * the built-in parseInt() function does not work correctly when "e" or "E"
     * is used in an exponential notation number. So first, we must check for
     * it then we will check the validity of the inputs.
     */
    userInput = document.getElementById("x_start").value; 
    x_start = (userInput.includes("e") || userInput.includes("E")) ? undefined : parseInt(userInput);

    userInput = document.getElementById("y_start").value;
    y_start = (userInput.includes("e") || userInput.includes("E")) ? undefined : parseInt(userInput);

    userInput = document.getElementById("x_end"  ).value;
    x_end   = (userInput.includes("e") || userInput.includes("E")) ? undefined : parseInt(userInput);

    userInput = document.getElementById("y_end"  ).value;
    y_end   = (userInput.includes("e") || userInput.includes("E")) ? undefined : parseInt(userInput);

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
        document.getElementById("y_start").value = "";
        console.log("y_start is invalid");
        validity = false;
    }

    if (!Number.isInteger(y_end  )) { // check validity of row bottom
        document.getElementById("y_end"  ).value = "";
        console.log("y_end is invalid");
        validity = false;
    }

    if (!Number.isInteger(x_start)) { // check validity of column left
        document.getElementById("x_start").value = "";
        console.log("x_start is invalid");
        validity = false;
    }

    if (!Number.isInteger(x_end  )) { // check validity of column right
        document.getElementById("x_end"  ).value = "";
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
        form.removeChild(document.getElementById("ErrorInvalidInput")); // remove element
        console.log("error message was removed");                      // update log
        errorIsUp = false;                                            // update status
    }

    // check the status of the warning X
    if (x_start > x_end && !warningXIsUp) // add warning if needed
    {
        let label = document.createElement("span");                        // create element
        label.setAttribute("class", "label label-warning center-block");  // add attribute
        label.setAttribute("id", "warningX");                            // add attribute
        label.textContent = "Warning: the columns appear out-of-order"; // add text
        form.appendChild(label);                                       // append to html
        console.log("warning X was posted");                          // update log
        warningXIsUp = true;                                         // update status
    } 
    else if (x_start <= x_end && warningXIsUp)  // remove warning if needed
    {
        form.removeChild(document.getElementById("warningX"));   // remove element
        console.log("warning X was removed");                   // update log
        warningXIsUp = false;                                  // update status
    }

    // check the status of the warning Y
    if (y_start > y_end && !warningYIsUp) // add warning if needed
    {
        let label = document.createElement("span");                       // create element
        label.setAttribute("class", "label label-warning center-block"); // add attribute
        label.setAttribute("id", "warningY");                           // add attribute
        label.textContent = "Warning: the rows appear out-of-order";   // add text
        form.appendChild(label);                                      // append to html
        console.log("warning Y was posted");                         // update log
        warningYIsUp = true;                                        // update status
    } 
    else if (y_start <= y_end && warningYIsUp)  // remove warning if needed
    {
        form.removeChild(document.getElementById("warningY"));  // remove element
        console.log("warning Y was removed");                  // update log
        warningYIsUp = false;                                 // update status
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
    let table = document.getElementById("table-placeholder");

    let xAdder = x_start < x_end ? 1 : -1;
    let yAdder = y_start < y_end ? 1 : -1;

    // clear pervious table or placeholder
    while (table.hasChildNodes())
    {
        table.firstChild.remove();
    }
    console.log("previous contents cleared");

    // generate <div>
    let newElement = document.createElement("div");    // create element
    newElement.setAttribute("class", "table");        // add attribute
    table.appendChild(newElement);                   // append to html

    table = newElement; // advance table one level inward

    // generate <table>
    newElement = document.createElement("table");      // create element
    newElement.setAttribute("class", "table");        // add attribute
    table.appendChild(newElement);                   // append to html

    table = newElement; // advance table one level inward

    // generate initial row <tr>
    let row = document.createElement("tr");            // create element
    table.appendChild(row);                           // append to html

    // generate top-left entry <th>
    newElement = document.createElement("th");         // create element
    row.appendChild(newElement);                      // append to html

    // generate table headers <th>
    for(let x = x_start; x != x_end + xAdder; x += xAdder)
    {
        newElement = document.createElement("th");     // create header entry
        newElement.textContent = x;                   // write column header 
        row.appendChild(newElement);                 // append to html
    }

    // generate rows
    for(let y = y_start; y != y_end + yAdder; y += yAdder)
    {
        row = document.createElement("tr");            // create new row
        table.appendChild(row);                       // append to html
        
        newElement = document.createElement("td");     // create new data entry
        newElement.textContent = y;                   // write row header    
        row.appendChild(newElement);                 // append to html

        // fill each row one column at a time
        for(let x = x_start; x != x_end + xAdder; x += xAdder)
        {
            newElement = document.createElement("td"); // create new data entry
            newElement.textContent = y * x;           // write calculated number
            row.appendChild(newElement);             // append to html
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
        let label = document.createElement("span");                       // create element
        label.setAttribute("class", "label label-danger  center-block"); // add attribute
        label.setAttribute("id", "ErrorInvalidInput");                  // add attribute
        label.textContent = "Error: invalid input(s)";                 // add text
        form.appendChild(label);                                      // append to html
        console.log("ErrorInvalidInput was posted");                 // update log
        errorIsUp = true;                                           // update status
    }

    return;
}