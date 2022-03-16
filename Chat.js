var socket = io.connect('http://192.168.43.99:8000');

	var input = document.getElementById('typing-box');
	input.addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			event.preventDefault();
			document.getElementById("submit").click();
		}
	})
	
	socket.on('message-from-others', (data) => {
	var html;	
	if (data.who === "Admin") {
		html = '<div class="message-box others-message-box">' +
			   '<div class="message others-message"> ' + "Admin: " + jQuery(data.message).text() + ' </div>' +
				'<div class="separator"></div>' +'</div>';
	} else {
		html = '<div class="message-box others-message-box">' +
			   '<div class="message others-message"> ' + data.who + ': ' + jQuery(data.message).text() + ' </div>' +
				'<div class="separator"></div>' +'</div>';
	}
		
	
							
	document.getElementById("message-area").innerHTML += html;

	var	ID = socket.id;

	});

	function sendMessage() {

		function makeMessage() {
			var message = document.getElementById("typing-box").value;
				var html = '<div class="message-box my-message-box">' +
								'<div class="message my-message"> ' + "You: " + jQuery(message).text() + ' </div>' +
								'<div class="separator"></div>' +
							'</div>';
							
				document.getElementById("message-area").innerHTML += html;
				document.getElementById("typing-box").value = "";
				socket.emit('message', {message: message, id: socket.id})
				
		}
				
				makeMessage();
				
	}



			window.onload = function () {

			if (document.referrer !== "http://192.168.43.99:8000/chat-contacts") {
				var username = document.cookie;
				username = username.replace("username=", "");
				socket.emit("seenByUser", username);
			} else {
				document.getElementById("out").disabled = true;
				document.getElementById("out").style.visibility = "hidden";
			}

				function preventBack() {
        window.history.forward();
    }

    setTimeout("preventBack()", 0);
    window.onunload = function() {
        null
    };

	function verify() {
					if (document.referrer === "http://192.168.43.99:8000/contact-page" ) {
					socket.emit('cookie', cookie)
				} else {
					socket.emit('join', {prev: document.referrer});
				}
			}

		
				let cookie = document.cookie;
				if (cookie.indexOf("username=") === -1) {
					window.location.href =  "http://192.168.43.99:8000/Access-Denied";
				} else {
					verify();
				}
				
			}

			function back () {
				if (document.referrer === "http://192.168.43.99:8000/chat-contacts") {
					window.location.href = "http://192.168.43.99:8000/chat-contacts";
					socket.emit('AdminBack');
				} else {
					window.location.href = "http://192.168.43.99:8000/contact-page";
					socket.emit('UserBack');
				}
				
			}

			socket.on('objectMessages', (data) => {
				var arrMessages = data.users;
				for (let i = 0; i <= arrMessages.length - 1; i++) {
					var user = arrMessages[i];
					var message = user['message']
					var sender = user['fromWho'];
					if (sender === "admin") {
						var element = '<div class="message-box others-message-box">' +
			   						  '<div class="message others-message"> ' + "Admin: " + jQuery(message).text() + ' </div>' +
							          '<div class="separator"></div>' +'</div>';
						document.getElementById("message-area").innerHTML += element;
					} else {
						var element = '<div class="message-box my-message-box">' +
									  '<div class="message my-message"> ' + "You: " + jQuery(message).text() + ' </div>' +
									  '<div class="separator"></div>' +
								    '</div>'
						document.getElementById("message-area").innerHTML += element;
					}
				}
			})

			socket.on('adminMessages', (data) => {
				var arrMessages = data.users;
				for (let i = 0; i <= arrMessages.length - 1; i++) {
					var user = arrMessages[i];
					var message = user['message']
					var sender = user['fromWho'];
					if (sender === "admin") {
						var element = '<div class="message-box my-message-box">' +
									  '<div class="message my-message"> ' + "You: " + jQuery(message).text() + ' </div>' +
									  '<div class="separator"></div>' +
								    '</div>'
						document.getElementById("message-area").innerHTML += element;
					} else {
						var element = '<div class="message-box others-message-box">' +
			   						  '<div class="message others-message"> ' + sender + ": " + jQuery(message).text() + ' </div>' +
							          '<div class="separator"></div>' +'</div>';
						document.getElementById("message-area").innerHTML += element;
					}
				}
			})

			socket.on('loginMessages', (data) => {
				var arrMessages = data.users;
				for (let i = 0; i <= arrMessages.length - 1; i++) {
					var user = arrMessages[i];
					var message = user['message'];
					var sender = user['fromWho'];
					if (sender === "admin") {
						var element = '<div class="message-box others-message-box">' +
			   						  '<div class="message others-message"> ' + "Admin: " + jQuery(message).text() + ' </div>' +
							          '<div class="separator"></div>' +'</div>';
						document.getElementById("message-area").innerHTML += element;
					} else {
						var element = '<div class="message-box my-message-box">' +
									  '<div class="message my-message"> ' + "You: " + jQuery(message).text() + ' </div>' +
									  '<div class="separator"></div>' +
								    '</div>'
						document.getElementById("message-area").innerHTML += element;
					}
				}
			})

			function logout() {
				let username = document.cookie;
				username = username.replace("username=", "");
				document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
				document.cookie = "loggedOut=" + username + "; path=http://192.168.43.99:8000/home";
				socket.emit('logout', username)
				window.location.href = "http://192.168.43.99:8000/home"
			}