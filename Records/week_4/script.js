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



