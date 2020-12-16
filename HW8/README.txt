Joseph Calles
University of Massachusetts --Lowell
COMP.4610-201 HW8 Fall 2020
Email: joseph_calles@student.uml.edu
Copyright (c) 2020 by Josph Calles. All rights reserved. May be freely 
    copied or excerpted for educational purposes with credit to the author.

See this homework online at: https://jstar-c.github.io/GUI_I/HW8/index.html

Sources:

    W3Schools       https://www.w3schools.com/

    jQuery          https://api.jqueryui.com/draggable/ 
                    https://api.jqueryui.com/droppable/

    StackOverflow   https://stackoverflow.com/questions/15343385/
                    https://stackoverflow.com/questions/3715047/

Overview:
    7 spaces and 7 tiles are given in the HTML file along with placeholders for
    text and error messages. The JavaScript initalizes jQuery droppable objects
    onto the 7 spaces, and jQuery draggable objects onto the 7 tiles. No more
    objects are ever instatiated, they are only removed once the bag runs out
    of tiles. The tiles are "changed" by only changing the image that appears.

    The droppableEventDrop() function does most of the work connecting the
    HTML, draggables, and droppables together in a logical manner.

Features:   
-   Tiles are randomized in a bag (represented by an array). Only the letters   
    are needed to be appended to the img src. letters are also identified by
    the img src.
-   Bonuses are linked the index of the space they are manually hard-coded.
    They are tallied upon clicking "submit"
-   The droppableEventDrop() function modifies some of the draggable options
    in order to control the movement of the tiles. When the "submit" button
    is clicked, all of these changes are undone, the tile positions, and new
    letters are selected. If the bag is empty, an instance of a tile will be 
    removed and a message will be displyed. 
