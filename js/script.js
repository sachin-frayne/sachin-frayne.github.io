window.onload = function () {
    var text = "Hello, World!";
    var index = 0;
    var container = document.getElementById("container");

    function displayLetter() {
        if (index < text.length) {
            container.innerHTML += text.charAt(index);
            index++;
            setTimeout(displayLetter, 300);
        }
    }

    displayLetter();
};