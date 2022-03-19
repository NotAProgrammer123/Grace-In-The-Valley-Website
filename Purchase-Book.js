var socket = io.connect('http://164.92.155.66');
            socket.on("newMessage", (targetUsername) => {
            var cookie = document.cookie;
            var name = cookie.replace("username=", "");
            name === targetUsername ? alert("You have a message from the website Admin") : ""; 
            });
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
