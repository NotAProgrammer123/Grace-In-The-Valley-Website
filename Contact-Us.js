var socket = io.connect("164.92.155.66");
socket.on("newMessage", (targetUsername) => {
      var cookie = document.cookie;
      var name = cookie.replace("username=", "");
      name === targetUsername ? alert("You have a message from the website Admin") : ""; 
    });
var frmMessage = document.getElementById('frmMessage');

document.getElementById('btnSubmit').addEventListener('click', function () {
  let inputName = document.getElementById("edtName").value;
          inputEmail = document.getElementById("edtEmail").value;
          inputMessage = document.getElementById("edtMessage").value;
          iName = -1;
          iSurname = -1;
          iMessage = -1;
          spacecount1 = 0;
          spacecount2 = 0;
          spacecount3 = 0;
          charcount1 = 0;
          charcount2 = 0;
          charcount3 = 0;


      for (let length of inputName) {
    
       iName = iName + 1;
       if (inputName[iName] === ' ') {
    
         spacecount1 = spacecount1 + 1;
         
    
       }
    
       else {
    
         charcount1 = charcount1 + 1;
         
    
       }
    
     }
    
     for (let length of inputEmail) {
    
    iSurname = iSurname + 1;
    if (inputEmail[iSurname] === ' ') {
    
    spacecount2 = spacecount2 + 1;
    
    }
    
    else {
    
    charcount2 = charcount2 + 1;
    
    }
    
    }
    
    for (let length of inputMessage) {
    
    iMessage = iMessage + 1;
    if (inputMessage[iMessage] === ' ') {
    
    spacecount3 = spacecount3 + 1;
    
    }
    
    else {
    
    charcount3 = charcount3 + 1;
    
    }
    
    
    
    
    }
    
    if(charcount1 === 0 || charcount3 === 0) {
    
    alert("Please complete the required fields on the form before attempting to submit the form");
    
    
    } else {
    
    
    
   
   

      function Mail () {
      var name = document.getElementById("edtName").value.trim();
          email = document.getElementById("edtEmail").value.trim();
          message = document.getElementById("edtMessage").value.trim();
          

            
        socket.emit('submit', {name, email, message});
        alert('Your message has been sent');
        document.getElementById("edtName").value = "";
        document.getElementById("edtEmail").value = "";
        document.getElementById("edtMessage").value = "";
      }

      Mail();
    
    
    }
});

function redirect() {
  if (document.cookie.indexOf('username') === -1 ) {
      window.location.href = "http://164.92.155.66/login";
  } else {
      let cookie = document.cookie;
      if (cookie.replace('username=', "") === "Admin") {
          window.location.href = "164.92.155.66/chat-contacts";
      } else {
          document.cookie = cookie + "; path=http://164.92.155.66/chat-page";
          window.location.href = "http://164.92.155.66/chat-page";
      }
      
  
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
