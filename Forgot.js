var socket = io.connect('http://164.92.155.66');
var oldEmail;
function change () {
  var forgot = document.getElementById('forgot').selected;
  var change =  document.getElementById('change').selected;
  var deleteAccount = document.getElementById('delete').selected;
  var changeEmail = document.getElementById('changeEmail').selected;

  if (forgot) {
        document.getElementById("password").style.visibility = "hidden";
        document.getElementById("password").value = "";
    }
    
    if (change) {
      document.getElementById("password").style.visibility = "visible";
      document.getElementById("password").value = "";
    }

    if (deleteAccount) {
      document.getElementById("password").style.visibility = "visible";
      document.getElementById("password").value = "";
    }

    if (changeEmail) {
      document.getElementById("password").style.visibility = "visible";
      document.getElementById("password").value = "";
    }
}

function submit() {
  var forgot = document.getElementById('forgot').selected;
  var change =  document.getElementById('change').selected;
  var deleteAccount = document.getElementById('delete').selected;
  var changeEmail =  document.getElementById('changeEmail').selected;
  let inputEmail = document.getElementById("email").value.trim();
  let inputPassword = document.getElementById("password").value.trim();
  oldEmail = document.getElementById("email").value.trim();
      
    var iEmail = -1;
    var iPassword = 0;
    var spacecount1 = 0;
    var spacecount2 = 0;
    var charcount1 = 0;
    var charcount2 = 0;

  for (let length of inputEmail) {

   iEmail = iEmail + 1;
   if (inputEmail[iEmail] === ' ') {

     spacecount1 = spacecount1 + 1;
     

   }

   else {

     charcount1 = charcount1 + 1;
     

   }

 }

 for (let length of inputPassword) {

iPassword = iPassword + 1;
if (inputPassword[iPassword] === ' ') {

  spacecount2 = spacecount2 + 1;
  

}

else {

  charcount2 = charcount2 + 1;
  

}

}

 if( (charcount1 === 0 && forgot === true) || ( (charcount1 === 0 || charcount2 === 0) && forgot === false && changeEmail === false) || (charcount1 === 0 && charcount2 === 0 && changeEmail === true) ) {
  document.getElementById('flag').focus({preventScroll: false});  
  document.getElementById("flag").innerHTML = "Please complete the required fields on the form before attempting to submit the form";
} else {
    var forgot = document.getElementById('forgot').selected;
    var change =  document.getElementById('change').selected;
    var deleteAccount = document.getElementById('delete').selected;
    var changeEmail =  document.getElementById('changeEmail').selected;
    
    if (forgot) {
        socket.emit("forgot", inputEmail.trim());
    }
    
    if (change) {
        socket.emit("change", {email: inputEmail.trim(), password: inputPassword.trim()});
    }

    if (deleteAccount) {
        socket.emit("deleteAccount",  {email: inputEmail.trim(), password: inputPassword.trim()});
    }

    if (changeEmail) {
        socket.emit("changeEmail", {email: inputEmail.trim(), password: inputPassword.trim()});
        sessionStorage.setItem("oldEmail",  inputEmail.trim());
    }
}
}

function execute () {
  var inputUsername = document.getElementById("newUsername").value.trim();
  var inputPassword = document.getElementById("newPassword").value.trim();
  var iUsername = -1;
  var iPassword = 0;
  var spacecount1 = 0;
  var spacecount2 = 0;
  var charcount1 = 0;
  var charcount2 = 0;

  for (let length of inputUsername) {

iUsername = iUsername + 1;
if (inputUsername[iUsername] === ' ') {

  spacecount1 = spacecount1 + 1;
  

}

else {

  charcount1 = charcount1 + 1;
  

}

}

for (let length of inputPassword) {

iPassword = iPassword + 1;
if (inputPassword[iPassword] === ' ') {

spacecount2 = spacecount2 + 1;


}

else {

charcount2 = charcount2 + 1;


}

}

if(charcount1 === 0 || charcount2 === 0) {
document.getElementById('flag').focus({preventScroll: false});
document.getElementById('flag').innerHTML = "Please complete the required fields on the form before attempting to submit the form";


} else {
    socket.emit("newDetails", {username: inputUsername, password: inputPassword, email: oldEmail});
}
}

socket.on('EmailNotFound', (resp) => {
  document.getElementById('flag').focus({preventScroll: false});
  document.getElementById('flag').innerHTML = resp.reject;
})

socket.on("detailsSentToEmail", (resp) => {
  document.getElementById('flag').focus({preventScroll: false});
  document.getElementById('flag').innerHTML = resp.accept;
})

socket.on("notFound", (resp) => {
  document.getElementById('flag').focus({preventScroll: false});
  document.getElementById('flag').innerHTML = resp.reject;
})

socket.on("showForm", () => {
  document.getElementById("toDelete").remove();
  document.getElementById("reset").style.visibility = "visible";
  document.getElementById("flag").innerHTML = "Enter your new account details";
  document.getElementById('flag').focus({preventScroll: false});
})

socket.on("accountUpdated", () => {
  document.getElementById("flag").innerHTML = "Account updated!";
  document.getElementById('flag').focus({preventScroll: false});
  function redirect () {
      window.location.href = "http://164.92.155.66/login";
  }
  setTimeout(redirect, 3000);
})

socket.on("deleteSent", (resp) => {
  document.getElementById("flag").innerHTML = resp.accept;
  document.getElementById('flag').focus({preventScroll: false});
  sessionStorage.setItem("forgotEmail", resp.sessionEmail);
})

socket.on("deleteRejected", (resp) => {
document.getElementById("flag").innerHTML = resp.reject;
document.getElementById('flag').focus({preventScroll: false});
})

socket.on("already", (resp) => {
document.getElementById("flag").innerHTML = resp.reject;
document.getElementById('flag').focus({preventScroll: false});
})

socket.on("emailChangeSucceed", (resp) => {
document.getElementById("flag").innerHTML = resp.accept;
document.getElementById('flag').focus({preventScroll: false});
})

socket.on("rejectAttempt", (resp) => {
document.getElementById("flag").innerHTML = resp.reject;
document.getElementById('flag').focus({preventScroll: false});
})

socket.on('reject', (resp) => {
  document.getElementById("flag").innerHTML = resp.reject;
  document.getElementById('flag').focus({preventScroll: false});
})

socket.on("bounce", (email) => {
document.getElementById("flag").innerHTML = "Input accepted. You will now be redirected to an email reset page"
document.getElementById('flag').focus({preventScroll: false});
function bounce () {
  window.location.href = "http://164.92.155.66/new-email";
}
setTimeout(bounce, 3000);

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
