// Joseph Calles inclass5
// view online @ https://jstar-c.github.io/GUI_I/inclass5/example.html

    // since the <ul> tag did not have an ID, use getElementsbyTagName()
let ul = document.getElementsByTagName("ul")[0];
let newItem, li_count, h2;


// ADD NEW ITEM TO END OF LIST ------------------------------------------------

newItem = document.createElement("li");
newItem.textContent = "kale";
    // insert the newItem before the 0th child node of the <ul>
ul.insertBefore(newItem, ul.childNodes[0]);


// ADD NEW ITEM START OF LIST -------------------------------------------------

newItem = document.createElement("li");
newItem.textContent = "cream";
ul.appendChild(newItem);


// ADD A CLASS OF COOL TO ALL LIST ITEMS --------------------------------------

    // get number of children
li_count = ul.childElementCount;

    // loop through each child
for(let i = 0; i < li_count; i++)
{
    // set class attribute of each <li> element to "cool"
    ul.getElementsByTagName("li")[i].setAttribute("class", "cool");
}


// ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING -----------------------------

h2 = document.getElementsByTagName("h2")[0];
    // looking at ../css/c05.css, I discovered that a <span> nested within the
    // <h2> was needed to inlcude the styling elements of the number.
newItem = document.createElement("span");
newItem.textContent = li_count;

    // insert the <span> before the end of --that is, within-- the <h2>
h2.insertAdjacentElement("beforeEnd", newItem);
