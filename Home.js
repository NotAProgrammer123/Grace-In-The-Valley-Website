var socket = io.connect('http://159.223.236.41');

 

function handleCookie () {
let cookie = document.cookie;
                  if (cookie.indexOf("loggedOut=") === -1) {
                      //do nothing
                  } else {
          var str =  cookie.replace("loggedOut=", "")
                      socket.emit("userSeen", str);
                  }
  }

 window.onload = handleCookie();

socket.on("newMessage", (targetUsername) => {
  var cookie = document.cookie;
  var name = cookie.replace("username=", "");
  name === targetUsername ? alert("You have a message from the website Admin") : ""; 
})

socket.on("checkNewAdminMessages", (count) => {
  if (count > 0) {
    alert("You have new message(s) from the website Admin");
  }
})
  

window.onload = () => {
  var cookie = document.cookie;
  if (cookie.indexOf("loggedOut=") === -1) {
    //do nothing
  } else {
    //code for when user has new messages
  }
}

const activeLinks = document.querySelectorAll('.nav__links li'),
menu = document.querySelector('.bars');
let menuState = false;
menu.addEventListener('click',showMenu);
function showMenu(){
    if(!menuState){
        menu.classList.add("is-active");
        document.querySelector('.nav__links').classList.add('open');
        menuState =true;
    }else{
        menu.classList.remove("is-active");
        document.querySelector('.nav__links').classList.remove('open');
        menuState =false;
    }
}
activeLinks.forEach((item) => {
    item.addEventListener('click',activateLinks);
});
function activateLinks(){
    activeLinks.forEach((item) => {
        item.classList.remove('active');
    });
    this.classList.add('active')
}
