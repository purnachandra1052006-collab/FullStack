// Variable for counter
let count = 0;

// 1. Counter Functions using document.getElementById
function increaseCount() {
    count = count + 1;
    document.getElementById("count-number").innerText = count;
}

function decreaseCount() {
    count = count - 1;
    document.getElementById("count-number").innerText = count;
}

function resetCount() {
    count = 0;
    document.getElementById("count-number").innerText = count;
}



// 2. Adding Elements to DOM dynamically
function addItem() {
    // Get text from input box
    let inputVal = document.getElementById("userInput").value;

    // Check if input is empty
    if (inputVal === "") {
        alert("Please enter some text first!");
    } else {
        // Create a new <li> element using createElement
        let newLi = document.createElement("li");
        newLi.innerText = inputVal;

        // Append child to the existing <ul> tag
        document.getElementById("myList").appendChild(newLi);

        // Clear the input field after adding
        document.getElementById("userInput").value = "";
    }
}

