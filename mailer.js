var express = require('express');
const { Socket } = require('socket.io');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var today = new Date ();
var time = today.getHours() + ':' + today.getMinutes();
var dir = '/Responsive.html';
var port = 3000;
var host = '192.168.43.99';
var nodemailer = require('nodemailer');
var firstname;
var lastname;
var country; 
var subject;



app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + dir );
    });

io.on('connection', (socket) => {

    console.log('User Connected on Port 3000 at ' + time);

    socket.on('mail', (data) => {

        function Mail () {
            firstname = data.firstname;
            lastname = data.lastname;
            country = data.country;
            subject = data.subject;
        
        var message1 = "Name: " + firstname + " " + lastname;
        var message2 = "Country: " + country;
        var message3 = "Comment: " + subject;
        var message = message1 + "\n" + "\n" + message2 + "\n" + "\n" + message3;
        
        
         
        
        
        
        
        
        var transporter = nodemailer.createTransport ({
            service: 'gmail',
            auth: {
                user: 'thesele.setsabi@gmail.com',
                pass: 'makopoi2008'
            }
        
        
        });
        
        var mailOptions = {
            from: 'thesele.setsabi@gmail.com',
            to: 'anthonytesla2@gmail.com',
            subject: 'Submit Contact Form With Node.js',
            text: message
        };
        
        
        transporter.sendMail(mailOptions, function (error, info){
        
            if(error) {
                console.log(error);
            } else {
        
                console.log('Message Sent');
            }
        
        
        });
        
        }

        Mail();
      
        
        });


    });

   



server.listen(port, host, () => {
    console.log('Listening on Port 3000');
});
