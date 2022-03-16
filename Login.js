var socket = io.connect('http://192.168.43.99:8000');

function login () {
  var Lusername = document.getElementById("l-username").value;
  var Lpassword = document.getElementById("l-password").value;
  var LiUsername = -1;
  var LiPassword = -1;
  var Lspacecount1 = 0;
  var Lspacecount2 = 0;
  var Lcharcount1 = 0;
  var Lcharcount2 = 0;
  for (let length of Lusername) {
  
  LiUsername = LiUsername + 1;
  if (Lusername[LiUsername] === ' ') {

    Lspacecount1 = Lspacecount1 + 1;
    

  }

  else {

    Lcharcount1 = Lcharcount1 + 1;
    

  }

}

for (let length of Lpassword) {

LiPassword = LiPassword + 1;
if (Lpassword[LiPassword] === ' ') {

Lspacecount2 = Lspacecount2 + 1;

}

else {

Lcharcount2 = Lcharcount2 + 1;

}


}

if(Lcharcount1 === 0 || Lcharcount2 === 0) {
  
document.getElementById('Lflag').focus({preventScroll: false});
  document.getElementById('Lflag').innerHTML = "Please complete the required fields on the form before attempting to submit the form";
  
  
  } else {
    socket.emit('login', {username: Lusername.trim(), password: Lpassword.trim()});
  }
}

  socket.on('reject', (resp) => { 
    document.getElementById('Lflag').innerHTML = resp.reject;
    document.getElementById('Lflag').focus({preventScroll: false});
  });
    
    socket.on('accept', (user) => {
      if(document.cookie.indexOf("loggedOut=" + user.username) > -1) {
      document.cookie = "loggedOut=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; //delete all cookies
      document.cookie = `username=${user.username}; path=http://192.168.43.99:8000/chat-page`;
      document.getElementById('Lflag').focus({preventScroll: false});
      document.getElementById('Lflag').innerHTML = "Logged In Successfully";
      } else {
        document.cookie = `username=${user.username}; path=http://192.168.43.99:8000/chat-page`;
        document.cookie = "loggedOut=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; //delete all cookies
        document.getElementById('Lflag').innerHTML = "Logged In Successfully";
        document.getElementById('Lflag').focus({preventScroll: false});
      }
      
      if (user.username === "Admin") {
        setTimeout(()=> {
      window.location.href = "http://192.168.43.99:8000/chat-contacts";
      document.cookie = "username=Admin; path=http://192.168.43.99:8000/chat-contacts"
    }, 3000);
      } else {
        setTimeout(()=> {
      window.location.href = "http://192.168.43.99:8000/chat-page";
    }, 3000);
      }
      
    })

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
