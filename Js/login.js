var Subtn=document.querySelector("button[value=submit]");
Subtn.addEventListener("click", function () {
    var user = document.querySelector("#name").value;
    localStorage.setItem("User",user);
});
