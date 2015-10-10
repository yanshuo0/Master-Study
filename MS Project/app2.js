(function (global) {
    document.getElementById("input").value = global.localStorage.getItem("mySharedData");
}(window));
