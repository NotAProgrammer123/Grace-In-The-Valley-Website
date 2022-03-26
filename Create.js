var socket = io.connect('https://gracevalleybook.com');
function execute () {
// event.preventDefault();
var inputUsername = document.getElementById("username").value;
var inputEmail = document.getElementById("email").value;
var iUsername = -1;
var iEmail = -1;
var spacecount1 = 0;
var spacecount3 = 0;
var charcount1 = 0;
var charcount3 = 0;



 for (let length of inputUsername) {

  iUsername = iUsername + 1;
  if (inputUsername[iUsername] === ' ') {

    spacecount1 = spacecount1 + 1;
    

  }

  else {

    charcount1 = charcount1 + 1;
    

  }

}


for (let length of inputEmail) {

iEmail = iEmail + 1;
if (inputEmail[iEmail === ' ']) {

spacecount3 = spacecount3 + 1;

}

else {

charcount3 = charcount3 + 1;

}


}




if(charcount1 === 0 || charcount3 === 0) {
 document.getElementById('flag').focus({preventScroll: false});
document.getElementById('flag').innerHTML = "Please complete the required fields on the form before attempting to submit the form";


} else {
   document.getElementById('flag').focus({preventScroll: false});
   document.getElementById('flag').innerHTML = "We have sent a link to your email address for account verification. Click on the link to finish creating your account";
 socket.emit('create-account', {username: inputUsername.trim(), email: inputEmail.trim() });
}
}

socket.on('already-exists', (data) => {
document.getElementById('flag').focus({preventScroll: false});
document.getElementById('flag').innerHTML = data.reject;
})

socket.on('notValidEmail', (resp) => {
   document.getElementById('flag').innerHTML = resp.reject;
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
