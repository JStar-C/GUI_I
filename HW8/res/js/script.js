/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  Joseph Calles
 *  University of Massachusetts --Lowell
 *  COMP.4610-201 HW8 Fall 2020
 *  Filename: https://jstar-c.github.io/GUI_I/HW8/res/js/script.js
 *  Email: joseph_calles@student.uml.edu
 *  Copyright (c) 2020 by Josph Calles. All rights reserved. May be freely
 *      copied or excerpted for educational purposes with credit to the author.
 *  File created on 11/28/2020.
 *  JavaScript file for HW8 Scrabble
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// keeps track of which letters are in which space
var letter_array = ['\0', '\0', '\0', '\0', '\0', '\0', '\0'];

// holds the original positions of the tiles 
var original_positions = [];

// which tile IDs have been placed on the board
var used_tiles = [];

// internal representation of the bag of letters
var bag = [];

// keeps track of the total score
var total_score = 0;

// when the page loads, initalize the game
$(document).ready(function () {

    // initalize the bag of tiles
    for(let i = 0; i < 27; ++i)
    {
        let size = ScrabbleTiles[i].count;
        for(let j = 0; j < size; ++j)
        {
            bag.push(ScrabbleTiles[i].letter);
        }
    }

    // initalize the first 7 letters in the rack
    for(let i = 0; i < 7; ++i)
    {
        let letter = get_random_letter_from_bag();
        if(letter == "_") 
        { 
            letter = "Blank"; 
        }
        $(`#tile${i}`).attr("src", `images/scrabble_tiles/Scrabble_Tile_${letter}.jpg`);
    }

    // retrieve the starting positions of the tiles 
    for(let i = 0; i < 7; ++i)
    {
        original_positions.push($(`#tile${i}`).position());
    }

});

// ----------------------------------------------------------------------------
    /* draggable UI */

// options
var draggableOpts = {
    revert   : true ,
    disabled : false,
    scroll   : false,
    stack    : "img"
}

// initalization 
$(function() {
    for (let i = 0; i < 7; ++i)
    {
        $(`#tile${i}`).draggable(draggableOpts);
    }
});

// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
    /* droppable UI */

// event helper
function droppableEventDrop( event, ui ) {

    // get identifiers and values from space and tile
    let space_id = parseInt($(this)[0].id.replace("space", ""));
    let tile_id  = parseInt(ui.draggable[0].id.replace("tile", ""));
    let tile_val = ui.draggable[0].src.charAt(ui.draggable[0].src.indexOf(".jpg") - 1);
    if( tile_val == 'k' ) // "Blank" ends with a lower case 'k'
    {
        tile_val = '_';
    }

    if(legal_move(space_id))
    {
        // forbid the space to hold more tiles
        $(this).droppable("option", "accept", "none");

        // prevent tile from bouncing back to position
        $(`#tile${tile_id}`).draggable("option", "revert", false );

        // disable the tile
        $(`#tile${tile_id}`).draggable("disable");

        // https://stackoverflow.com/questions/15343385/
        // change the position of the tile to "snap" into the space
        ui.draggable.position({of:$(this), my:'left+5 top+5', at:'left top'});

        // add letter to internal representation
        letter_array[space_id] = tile_val;

        // add tile_id to list of used IDs
        used_tiles.push(tile_id);

        console.log(`TILE PLACED | tile_id:${tile_id} | tile_val:${tile_val} | space_id:${space_id}`);
    }
    else 
    {
        // display error message for 3 seconds
        $("#error-placeholder").text("Error: cannot place tile there");
        setTimeout(function () {
            $("#error-placeholder").text("");
        }, 3000)
    }
}

// options
var droppableOpts = {
    accept : "*",
    drop   : droppableEventDrop
}
 
// initalization 
$(function() {
    for (let i = 0; i < 7; ++i)
    {
        $(`#space${i}`).droppable(droppableOpts);
    }
});

// ----------------------------------------------------------------------------

// submit button is clicked
function submitFunction() {

    let word_multiplier = 1;
    let points = 0;
    let sum = 0;

    // calculate score
    for(let i = 0; i < 7; ++i)
    {
        if (letter_array[i] != '\0') // find a placed letter
        {
            let seeker = 0;

            // seek the index of the placed letter
            while(ScrabbleTiles[seeker++].letter != letter_array[i]){;}

            // retieve the base point value of the tile (correct one-off error)
            points = ScrabbleTiles[--seeker].value;

            if (i == 2) {      // double letter score
                sum += points * 2; 
            } 
            else if (i == 4) { // triple letter score
                sum += points * 3; 
            } 
            else if (i == 0) { // double word score
                sum += points; 
                word_multiplier *= 2; 
            } 
            else if (i == 6) { // triple word score
                sum += points; 
                word_multiplier *= 3; 
            } 
            else {             // no bonus
                sum += points; 
            } 
        }
    }

    // reset the letter array
    for(let i = 0; i < 7; ++i)
    {
        letter_array[i] = '\0';
    }

    // update word and total score
    sum *= word_multiplier;
    total_score += sum;

    // display word and total score
    $("#w-score").text(`Word score: ${sum}`);
    $("#t-score").text(`Total score: ${total_score}`);
 
    // for each tile and space, reset configurations
    for(let i = 0; i < 7; ++i)
    {
        // allow all spaces to hold tiles
        $(`#space${i}`).droppable("option", "accept", "*");

        // force all tiles to bounce back to starting positions 
        $(`#tile${i}`).draggable("option", "revert", true);

        // enable all tiles
        $(`#tile${i}`).draggable("enable");

        // move all tiles from board to rack 
        $(`#tile${i}`).position({
            of: document,
            my: `left+${original_positions[i].left} top+${original_positions[i].top}`,
            at: "left top"
        });
    }
    
    // clear the board and remove used tiles
    while(used_tiles.length > 0)
    {
        let tile_id = used_tiles.pop();
        let letter = get_random_letter_from_bag();
        if(letter == "_") 
        { 
            letter = "Blank"; 
        }

        if(letter != "BAG_IS_EMPTY")
        {
            // change the image associated with the tile 
            $(`#tile${tile_id}`).attr("src", 
                `images/scrabble_tiles/Scrabble_Tile_${letter}.jpg`);
        }
        else
        {
            // remove the tile object
            $(`#tile${tile_id}`).remove();
        }

        let msg = bag.length > 0 ? `Tiles remaining in bag: ${bag.length}` : "No more tiles in bag!";

        // display message for 3 seconds
        $("#error-placeholder").text(msg);
        setTimeout(function () {
            $("#error-placeholder").text("");
        }, 3000)
    }
}

// when the users clicks the "restart" button on the page, refresh the page
// see: https://stackoverflow.com/questions/3715047/
function refresh() {
    location.reload();
    return false;
}

// this function is used to determine if the placement of a tile on a given 
// space is legal or not, that is, if it either
//    (a) the first tile to be placed on the board
//    (b) adjacent to other tiles already on the board
// returns boolean true/false
function legal_move(space_id) {
    let legality = true;
    let initial_placement = true;

    // check if this is the first space to be occupied
    for(let i = 0; i < 7; ++i)
    {
        if(letter_array[i] != '\0')
        {
            initial_placement = false;
        }
    }

    // check adjacent spaces
    if(initial_placement == false)
    {
        let previous_space = letter_array[space_id > 0 ? space_id - 1 : 0];
        let next_space     = letter_array[space_id < 6 ? space_id + 1 : 6];

        if(previous_space == '\0' && next_space == '\0')
        {
            legality = false;
        }
    }

    return legality;
}

// this function picks a letter at random from the bag, removes its instance 
// from the bag and returns the character repesentation of the letter.
// returns "BAG_IS_EMPTY" if the bag array is actually empty
function get_random_letter_from_bag() {
    if(bag.length > 0)
    {
        // select a random letter from the bag
        let index  = Math.floor(Math.random() * 1000000) % bag.length;
        let letter = bag[index];

        // remove from bag
        bag.splice(index, 1);

        return letter;
    }
    else 
    {
        return "BAG_IS_EMPTY";
    }
}
