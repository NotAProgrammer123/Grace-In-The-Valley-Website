function openLogin() {
    window.location.href = "http://164.92.155.66/login";    
}

function redirect() {
    setTimeout(openLogin, 3000)
    
    function count () {
    var sec = 3;
setInterval(function() {
document.getElementById("count").innerHTML = sec;
sec--;
}, 1000);
if (sec === 0) {
  clearInterval();
}
}
count();
}

window.onload= redirect();
