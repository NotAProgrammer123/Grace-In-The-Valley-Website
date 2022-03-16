var socket = io.connect('http://192.168.43.99:8000');
function execute () {
    let inputEmail = document.getElementById("email").value.trim();
    
    iEmail = -1;
    spacecount1 = 0;
    charcount1 = 0;

for (let length of inputEmail) {

 iEmail = iEmail + 1;
 if (inputEmail[iEmail] === ' ') {

   spacecount1 = spacecount1 + 1;
   

 }

 else {

   charcount1 = charcount1 + 1;
   

 }

}

if(charcount1 === 0) {

alert("Please complete the required fields on the form before attempting to submit the form");


} else {
  socket.emit("SetNewEmail", {inputEmail: inputEmail, oldEmail: sessionStorage.getItem("oldEmail")});
  sessionStorage.removeItem("oldEmail");
}
}

socket.on("notValidEmail", (resp) => {
    document.getElementById("flag").innerHTML = resp.reject;
})

socket.on("confirmed", (resp) => {
    document.getElementById("flag").innerHTML = resp.accept;
})

socket.on("reject", (resp) => {
  document.getElementById("flag").innerHTML = resp.reject;
})