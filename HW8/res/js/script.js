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

var letter_array = ['\0', '\0', '\0', '\0', '\0', '\0', '\0'];
var original_positions = [];
var used_tiles = [];
var bag = [];
var total_score = 0;

// on page load
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

    for(let i = 0; i < 7; ++i)
    {
        let letter = get_random_letter_from_bag();
        if(letter == "_") 
        { 
            letter = "Blank"; 
        }
        $(`#tile${i}`).attr("src", `images/scrabble_tiles/Scrabble_Tile_${letter}.jpg`);
    }

    for(let i = 0; i < 7; ++i)
    {
        original_positions.push($(`#tile${i}`).position());
    }
});

function get_random_letter_from_bag() {
    if(bag.length > 0)
    {
        let index  = Math.floor(Math.random() * 1000000) % bag.length;
        let letter = bag[index];
        bag.splice(index, 1);
        console.log(letter);
        return letter;
    }
    else 
    {
        return "BAG_IS_EMPTY";
    }
}

// ----------------------------------------------------------------------------
    /* draggable UI */

// options
var draggableOpts = {
    revert: false
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
    // https://stackoverflow.com/questions/15343385/
    // change the position of the tile to "snap" into the space
    ui.draggable.position({of:$(this), my:'left+5 top+5', at:'left top'});

    let tile_id  = parseInt(ui.draggable[0].id.replace("tile", ""));
    let tile_val = ui.draggable[0].src.charAt(ui.draggable[0].src.indexOf(".jpg") - 1);
    let space_id = parseInt($(this)[0].id.replace("space", ""));

    used_tiles.push(tile_id);

    console.log(`TILE PLACED | tile_id:${tile_id} | tile_val:${tile_val} | space_id:${space_id}`);
    letter_array[space_id] = tile_val;
}

// options
var droppableOpts = {
    drop: droppableEventDrop
}
 
// initalization 
$(function() {
    for (let i = 0; i < 7; ++i)
    {
        $(`#space${i}`).droppable(droppableOpts);
    }
});
// ----------------------------------------------------------------------------

// onClick of submit
function submitFunction() {
    console.log("submitted");

    let word_multiplier = 1;
    let points = 0;
    let sum = 0;

    for(let i = 0; i < 7; ++i)
    {
        if (letter_array[i] != '\0')
        {
            let seeker = 0;

            // seek the index of the placed letter
            while(ScrabbleTiles[seeker++].letter != letter_array[i]){;}

            // retieve the base point value of the tile (correct one-off error)
            points = ScrabbleTiles[--seeker].value;

            if (i == 2) { // double letter score
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
            else { // no bonus
                sum += points; 
            } 
        }
    }

    // reset the letter array
    for(let i = 0; i < 7; ++i)
    {
        letter_array[i] = '\0';
    }

    // calculate word and total score
    sum *= word_multiplier;
    total_score += sum;

    // display word and total score
    $("#w-score").text(`Word score: ${sum}`);
    $("#t-score").text(`Total score: ${total_score}`);

    //
    /*
    for(let i = 0; i < 7; ++i)
    {
        $(`#tile${i}`).position({
            my: `left+${original_positions[i].left} top+${original_positions[i].top}`,
            at: "left top",
            of: "document"
          });
          //({"top" : original_positions[i].top, "left" : original_positions[i].left});
    }
    */
    for(;used_tiles.length > 0;)
    {
        let tile_id = used_tiles.pop();
        let letter = get_random_letter_from_bag();
        if(letter != "BAG_IS_EMPTY")
        {
            $(`#tile${tile_id}`).attr("src", `images/scrabble_tiles/Scrabble_Tile_${letter}.jpg`);
        }
        else
        {
            $(`#tile${tile_id}`).remove();
        }
    }
}
