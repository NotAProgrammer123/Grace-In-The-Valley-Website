var socket = io.connect('http://192.168.43.99');

function append () {
    let inputPassword = document.getElementById("password").value;
    
    iPassword = -1;
    spacecount1 = 0;
    charcount1 = 0;

for (let length of inputPassword) {

 iPassword = iPassword + 1;
 if (inputPassword[iPassword] === ' ') {

   spacecount1 = spacecount1 + 1;
   

 }

 else {

   charcount1 = charcount1 + 1;
   

 }

}

if(charcount1 === 0) {
  document.getElementById('flag').focus({preventScroll: false});
  document.getElementById('flag').innerHTML = "Please complete the required fields on the form before attempting to submit the form";


} 
}

socket.on('reject', (data) => {
  document.getElementById('flag').focus({preventScroll: false});
  document.getElementById('flag').innerHTML = data.reject;

})

socket.on('redirect', () => {
  window.location.href = 'http://192.168.43.99:8000/account-created';
})