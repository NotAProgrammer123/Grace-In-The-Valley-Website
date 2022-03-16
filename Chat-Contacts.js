var socket = io.connect('http://192.168.43.99:8000');

    function blockUser(data) {
    document.getElementById('cancel').style.visibility = "hidden"
    var username = data.replace("Block ", "");
    document.getElementById(username).remove();
    socket.emit('blockUser', username);
    
    for (let i = 0; i <= document.getElementsByClassName("BlockButton").length - 1; i++) {
       var element =  document.getElementsByClassName("BlockButton").item(i);
       var aTag = document.getElementsByClassName("rdr")[i];
       element.style.visibility = "hidden";
       aTag.setAttribute("href", "http://192.168.43.99:8000/chat-page");

    }
  }

    
  function cancel() {
    document.getElementById('cancel').style.visibility = "hidden"
    for (let i = 0; i <= document.getElementsByClassName("BlockButton").length - 1; i++) {
       var element =  document.getElementsByClassName("BlockButton").item(i);
       var aTag = document.getElementsByClassName("rdr")[i];
       element.style.visibility = "hidden";
       document.getElementById('cancel').visibility = "visible";
       aTag.setAttribute("href", "http://192.168.43.99:8000/chat-page");

    }
  }

  function blockUsers () {
    document.getElementById('cancel').style.visibility = "visible";
    for (let i=0; i <= document.getElementsByClassName("BlockButton").length - 1; i++) {
      var element =  document.getElementsByClassName("BlockButton").item(i);
      var aTag = document.getElementsByClassName("rdr")[i];
      element.style.visibility = "visible";
      aTag.removeAttribute("href");
    }


   
  }
    
    
    function openChat (id) {
      var username = id;
      socket.emit('openChat', {username: username});
    }
    
    window.onload = function () {
        socket.emit('fetchUsers');
        socket.emit('listen');  
        let cookie = document.cookie;
				if (cookie.indexOf("username=Admin") === -1) {
					window.location.href = "http://192.168.43.99:8000/Access-Denied";
				} 
    }

    socket.on('arrayUsers', (data) => {
        var arrUsers = data.users;
        for (let i = 0; i <= arrUsers.length - 1; i++) {
            var div = document.createElement("DIV");
            var user = arrUsers[i];
            var insert = '"' + user + '"' + '>';
            var insert1 = '"' + data.email[i] + "1" + '"' ;
            var element = '<a class="rdr"  onclick = "openChat(this.id)" href = "http://192.168.43.99:8000/chat-page" id=' + insert + '<button style="visibility:hidden" onclick="blockUser(this.innerHTML)" class="BlockButton">' + "Block " + user + '</button><li class="contacts__item" style="height: 9vh"><div class = "contact" style="height:6vh">' + user + '<div class="badge-container" id=' + insert1 + 'style="float:right; visibility:hidden; height: 4vh"><div class="badge__value" id =' + '"' + data.email[i] + '"' + '>' + '0</div></div></div> </li></a>';
            var lastChild = document.getElementsByClassName("contacts__list")[document.getElementsByClassName("contacts__list").length - 1];
            div.innerHTML +=  element;
            if (user !== "Admin") {
              lastChild.appendChild(div);
            }   
        }
       
    })
    
    socket.on("recentMessages", (data) => {
      var arrayID = data.arrayID;
     
       // var user = arrayID[i];
        
        function getElement(timeout=200) {
        const intervalObj = setInterval(function() {
            var element = document.getElementById(arrayID[arrayID.length - 1]);
           
              if (typeof(element) != 'undefined' && element != null)  {
                    clearInterval(intervalObj);
                    for (let i=0; i <= arrayID.length -1; i++) {
                      var contact = document.getElementById(arrayID[i]).cloneNode(true);
                      document.getElementById(arrayID[i]).remove();
                      var menu = document.getElementById('allcontacts');
                      menu.insertBefore(contact, anchor);
                      document.getElementById("heading").innerHTML = "Recent Messages";
                    }
            }
    
        }, timeout);
    
        

      }
      getElement();
    })
    
    

    socket.on('addAccount', (data) => {
      if (data.username === "Admin") {
        //do nothing
      } else {
       var div = document.createElement("DIV");
       var insert = '"' + data.username + '"' + '>';
       var insert1 = '"' + data.email + "1" + '"' ;
       var ident = data.email;
       var sNew = ident.replace(" ", "");
       var lastChild = document.getElementsByClassName("contacts__list")[document.getElementsByClassName("contacts__list").length - 1];
       var insertEmail = '"' + data.email + '"' + '>';
       var element = '<a class="rdr" onclick = "openChat(this.id)" href = "http://192.168.43.99:8000/chat-page" id=' + insert + '<button style="visibility:hidden" onclick="blockUser(this.innerHTML)" class="BlockButton">' + "Block " + data.username + '</button><li class="contacts__item" style="height: 9vh"><div class = "contact" style="height:6vh">' + data.username + '<div class="badge-container" id=' + insert1 + 'style="float:right; visibility:hidden; height: 4vh"><div class="badge__value" id =' + '"' + sNew + '"' + '>' + '0</div></div></div></li></a>';
       var lastChild = document.getElementsByClassName("contacts__list")[document.getElementsByClassName("contacts__list").length - 1];
       div.innerHTML +=  element;
       lastChild.appendChild(div);

      }
      
    })

    socket.on('totalMessages', (data) => {
      if (data.rooms.length === data.counts.length) {
        for (let i=0; i <= data.rooms.length - 1; i++) {
          var room = data.rooms[i];
          var count = data.counts[i];
          document.getElementById(room + "1").style.visibility = "visible"; //notification container
          document.getElementById(room).innerHTML = count;                  //message count of room
          document.getElementById('count').innerHTML = Number( document.getElementById('count').innerHTML) + count; //total messages
        }
      }
			})

     socket.on('increment', (data) => {
       var room = data.id; //email
       var count = Number(document.getElementById(room).innerHTML) + 1;
       document.getElementById(room).innerHTML = count
       document.getElementById('count').innerHTML = Number( document.getElementById('count').innerHTML) + 1;

       var anchor =  document.getElementById('anchor')
       var div = document.createElement("DIV");
       var insert = '"' + data.name + '"' + '>';
       var menu = document.getElementById('allcontacts');
       document.getElementById(data.name).remove();
       var element = '<a class="rdr" onclick = "openChat(this.id)" href = "http://192.168.43.99:8000/chat-page" id=' + insert + '<button style="visibility:hidden" onclick="blockUser(this.innerHTML)" class="BlockButton">' + "Block " + data.name + '</button>' + '<li class="contacts__item" style="height: 9vh"><div class = "contact" style="height:6vh">' + data.name + '<div class="badge-container" style="float:right; height: 4vh"><div class="badge__value" id =' + '"' + data.email + '"' + '>' +  count + '</div></div></div></li></a> ';
       div.innerHTML += element;
       menu.insertBefore(div, anchor);
       document.getElementById("heading").innerHTML = "Recent Messages";
      
     }) 

    function logout() {
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC"; //delete all cookies
      socket.emit('logout', "Admin");
      window.location.href = "http://192.168.43.99:8000/home";
    }
    

     function preventBack() {
        window.history.forward();
    }

    setTimeout("preventBack()", 0);
    window.onunload = function() {
        null
    };
