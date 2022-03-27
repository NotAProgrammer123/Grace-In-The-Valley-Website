//modules
const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const moment = require('moment');
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");
const validator = require("email-validator");
const events = require('events');
const axios = require('axios');
const bcrypt = require('bcrypt');
const { passwordStrength } = require('check-password-strength');
const { isJwtExpired } = require('jwt-check-expiration');
const url = require("url");

//global variables
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const dir = '/Home-Final.html';
const port = 8000;
const host = '167.99.47.41';
const eventEmitter = new events.EventEmitter();
const saltRounds = 10;
var arrUsers; //
var objUsers = {}; //
var signToken = {};
var tokens = {} //
var openChatEmail; //

function isEmpty(obj) {
      return Object.keys(obj).length === 0;
       }

function cleanObjSignToken() {
  Object.keys(signToken).forEach((key) => {
    if (isJwtExpired(tokens[key])) {
      delete signToken[key];
      delete tokens[key];
    }
  })
}

function cleanObjUsers () {
  Object.keys(objUsers).forEach((key) => {
    if (isEmpty(objUsers[key]) || (!io.sockets.adapter.rooms[key])) {
      delete objUsers[key];
    }
  });
}

setInterval(() => {
  cleanObjUsers();
  cleanObjSignToken();
}, 1000 * 60 * 5);

function getKeyByValue (object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

//setup server and database connection
server.listen(port, host, () => {
  console.log('Listening on Port ' + port);
});

const db = mysql.createConnection({
  host: "db-mysql-ams3-33374-do-user-11040713-0.b.db.ondigitalocean.com",
  user: "doadmin",
  password: "KrRidv1Vfoeyr4Zr",
  database: 'defaultdb',
  port: '25060'
});

db.connect((err) => {
  if (err) throw err;
})

//express.js middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(bodyParser.json())

    //express.js routes
    app.get('/', (req, res) => {
    res.sendFile(__dirname + dir );
    });

    app.get('/Access-Denied', (req, res) => {
      res.sendFile(__dirname + "/Access-Denied.html");
    })

    app.get('/home', (req, res) => {
      res.sendFile(__dirname + '/Home-Final.html');
    });

    app.get('/chat-contacts', (req, res) => {
      res.sendFile(__dirname + '/chat-contacts.html')
    })

    app.get('/chat-page', (req, res) => {
      res.sendFile(__dirname + '/Chat.html')
    })

    app.get('/about-author', (req, res) => {
      res.sendFile(__dirname + '/About Author-Final.html');
    });

    app.get('/my-life-story', (req, res) => {
      res.sendFile(__dirname + '/My Life Story-Final.html');
    });

    app.get('/purchase', (req, res) => {
      res.sendFile(__dirname + '/Purchase Book-Final.html');
    });

    app.get('/contact-page', (req, res) => {
      res.sendFile(__dirname + '/Contact Us-Final.html');
    })

    app.get('/login', (req, res, next) => {
      res.sendFile(__dirname + '/Login.html');
    });

    app.get('/new-email', (req, res) => {
      res.sendFile(__dirname + '/EmailChange.html');
    }) 

    app.get('/forgot-change/:token', (req, res) => {
      try {
        var email;
        db.query("SELECT email FROM tokens WHERE token=?", [req.params.token], (err, result) => {
          if (err) throw err;
          if (result.length !== 0) {
            email = result[0]["email"];
          const verify = jwt.verify(req.params.token, signToken[email] +  email);
          res.sendFile(__dirname + '/forgotChange.html');

          db.query("DELETE FROM tokens WHERE token =?", [req.params.token], (er, rs) => {
            if (er) throw er;
          })
          } else {
            res.send("<h1>Your link has expired or is invalid</h1>")
          }
          
        }) 
      } catch (error) {
        res.send("<h1>Your link has expired or is invalid</h1>");
      }
    });

    app.get('/account-deleted/:token', (req, res) => {
      try {
        var email;
        db.query("SELECT email FROM tokens WHERE token=?", [req.params.token], (err, result) => {
          if (err) throw err;
          if (result.length !== 0) {
            email = result[0]["email"];
          const verify = jwt.verify(req.params.token, signToken[email] +  email);
          res.sendFile(__dirname + '/Deleted.html');

          db.query("DELETE FROM tokens WHERE token =?", [req.params.token], (er, rs) => {
            if (er) throw er;
          })

          db.query("DELETE FROM accounts WHERE email=?", [email], (err, result) =>{
            if (err) throw err;
          })
    
          db.query("DELETE FROM messages WHERE room=?", [email], (err, result) => {
            if (err) throw err;
          })

          } else {
            res.send("<h1>Your link has expired or is invalid</h1>")
          }
          
        }) 
      } catch (error) {
        res.send("<h1>Your link has expired or is invalid</h1>");
      }
    })

    app.get('/forgot', (req, res) => {
      res.sendFile(__dirname + '/Forgot.html');
    })

    app.get('/account-created', (req, res) => {
      res.sendFile(__dirname + '/account-created.html');
    })

    app.get('/confirmed/:token', (req, res) => {
      try {
        var email;
        db.query("SELECT newEmail, oldEmail FROM change_email WHERE token=?", [req.params.token], (err, result) => {
          if (err) throw err;
          if (result.length !== 0) {
            newEmail = result[0]["newEmail"];
            oldEmail = result[0]["oldEmail"];
          const verify = jwt.verify(req.params.token, signToken[newEmail] +  newEmail);
          res.sendFile(__dirname + '/Confirmed.html');

          db.query("DELETE FROM change_email WHERE token =?", [req.params.token], (er, rs) => {
            if (er) throw er;
          })

          db.query("UPDATE accounts SET email=? WHERE email=?", [newEmail, oldEmail], (err, result) =>{
            if (err) throw err;
          })
    
          db.query("UPDATE messages SET room=? WHERE room=?", [newEmail, oldEmail], (err, result) => {
            if (err) throw err;
          })
          
          } else {
            res.send("<h1>Your link has expired or is invalid</h1>")
          }
          
        }) 
      } catch (error) {
        res.send("<h1>Your link has expired or is invalid</h1>");
      }
    })

    app.get('/create-account', (req, res) => {
      res.sendFile(__dirname + '/Create.html');
    })

    app.get('/pay', (req, res) => {
      res.sendFile(__dirname + '/Payment.html');
    })

    app.post('/pay', (req, res) => {
      axios.post('https://online.yoco.com/v1/charges/', {
        token: req.body.token,
        currency: 'ZAR',
        amountInCents: 200
    }, {
        headers: {
            'X-Auth-Secret-Key': 'sk_live_5144d7347LoRzyebcb741769a403'
        }
    })
        .then(response => {
            res.send(response.data);
        })
        .catch(error => {
            res.send(error.response.data);
        })
    })

    app.get('/create-account/:token', (req, res) => {
      try {
        var username;
        var email;
        db.query("SELECT email FROM tokens WHERE token=?", [req.params.token], (error, result) => {
          if (error) throw error
          if (result.length !== 0) {
            email = result[0]["email"];
            try {
               const verify = jwt.verify(req.params.token, signToken[email] +  email);
            } catch (error) {
              res.send("<h1>Your link has expired or is invalid</h1>"); 
            }
             db.query("DELETE FROM tokens WHERE username=? AND email=?", [username, email], (er, rs) => {
              if (er) throw er;
            });

        var newToken = jwt.sign({email: email, username: '3759&^$%%&^876'}, ')(*&^new)(*&^invalidator*&^&signature#^%$%#', {expiresIn: 600});
        signToken[email] = newToken;
        res.sendFile(__dirname + '/Password.html');
          }
        })
      } catch (error) {
       res.send("<h1>Your link has expired or is invalid</h1>"); 
      }
    })

    app.post('/create-account/:token', (req, res) => {
      var username;
      var email
      db.query("SELECT username, email FROM tokens WHERE token=?", [req.params.token], (err, res) => {
        if (err) throw err;
        username = res[0]["username"];
        email = res[0]["email"];
      })
        var newPassword = req.body.password.trim();
        bcrypt.hash(newPassword, saltRounds, (prb, hash) => {
          if (prb) throw prb;
    
          function createAccount() {
            if (
              passwordStrength(newPassword).length >= 8
           && passwordStrength(newPassword).contains.indexOf('uppercase') > -1 === true
           && passwordStrength(newPassword).contains.indexOf('lowercase') > -1 === true
           && passwordStrength(newPassword).contains.indexOf('symbol') > -1 === true
           ) {
            db.query("INSERT INTO accounts (username, password, email, logstatus, blocked, verified) VALUES (?,?,?,?,?,?)", [username, hash, email, "out", 0, 1], (err, results) => {
              if (err) throw err;
              eventEmitter.emit('newAccount', username, email);
              io.sockets.emit('redirect');
            })   
           } else {
             io.sockets.emit('reject', {reject: "Your password is too weak. Ensure that your password is at least 8 characters long, contains at least 1 uppercase letter, 1 lowercase letter and 1 symbol"})
           }
           
          }
          createAccount();
        });
    })

    io.on('connection', (socket) => {

      socket.on('disconnect', () => {
        var email;
        if (objUsers.admin) {
          if(socket.id === objUsers.admin) {
           if(objUsers[openChatEmail]) {
             function exc() {
                if (objUsers[openChatEmail].visitor) {
               delete objUsers[openChatEmail].admin;
               delete objUsers.admin;
             }
             }
            exc();
           } else {
             delete objUsers[openChatEmail];
             delete objUsers.admin;
        }
         
           } 
         } else {
           var values = Object.values(objUsers);
           var Id = socket.id;
           for (let i =0; i <= values.length - 1; i++) {
             var obj = values[i];
             if (typeof obj === "object") {
               if (obj.visitor === Id) {
                 email = getKeyByValue(objUsers, obj);
               }
             }
           }
           if (objUsers[email]) {
             if (objUsers[email].admin) {
              delete objUsers[email].visitor;
            } else {
              delete objUsers[email];
            }
         }
           }

      });
    

      socket.on('login', (data) =>{
        var loginUsername = data.username;
        var loginPassword = data.password;
        
        db.query("SELECT password, email FROM accounts WHERE username=? AND verified=0", [loginUsername], (err, results) => {
          if (results.length === 0) {
            socket.emit('reject', {reject: "Invalid Username Entered"})
          } else {
            if (err) throw err;
            var hash = results[0]['password'].toString();
            bcrypt.compare(loginPassword, hash, (errors, resultant) => {
              if (errors) throw errors;
              if (!resultant) {
                socket.emit('reject', {reject: "Incorrect Password Entered"})
              } else {
                socket.emit('accept', {username: loginUsername});
                db.query("UPDATE accounts SET logstatus =? WHERE username =? AND password=?", ['in', loginUsername, loginPassword], (errs, resultants) => {
                  if (errs) throw errs;
                })
              }
            }) 
          }
        })
      })

      socket.on('submit', (data) =>  {
        function Mail () {
          var sName = data.name;
          var sEmail = data.email;
          var sMessage = data.message;
      
      var msgName = "Name: " + sName;
      var msgEmail = "E-mail: " + sEmail;
      var msgMessage = "Message: " + sMessage;
      var message = msgName + "\n" + "\n" + msgEmail + "\n" + "\n" + msgMessage;
      
      var transporter = nodemailer.createTransport ({
          service: 'gmail',
          auth: {
              user: 'thesele.setsabi@gmail.com',
              pass: 'makopoi2008'
          }
      });
      
      var mailOptions = {
          from: 'thesele.setsabi@gmail.com',
          to: 'thesele.setsabi@gmail.com',
          subject: 'Message from visitor on www.findinggraceinthevalley.com',
          text: message
      };
       
      transporter.sendMail(mailOptions, function (error, info){
          if(error) {
              console.log(error);
          } else {
              console.log('name: ' + sName + '     ' + 'email: ' + sEmail + '     ' + 'message: ' + sMessage);
          }
      });
      }
      Mail();
    });
        
    socket.on('create-account', (data) => {
      var username = data.username;
      var email = data.email;

      if(validator.validate(email) === true) {
        db.query("SELECT count(*) FROM accounts WHERE email=? OR username=?", [email, username], (err, results) => {
          if (err) throw err;
          if(results.length !== 0) {
            var count = results[0]['count(*)'];
            if (count === 0) {
              var JWT_SECRET = 'some super secret...';
              var secret = JWT_SECRET + email;
              var token = jwt.sign({email: email, username: username}, secret, {expiresIn: 600});
              db.query("INSERT INTO tokens (email, token, username) VALUES (?, ?, ?)", [email, token, username], (error, res) => {
              if (error) throw error;
            })
              var link = `https://gracevalleybook.com/create-account/${token}`;
              signToken[email] = JWT_SECRET;
              tokens[email] = token;
              console.log(link)
              console.log(signToken);
              console.log(tokens);
  
              var iPos = link.indexOf(' ');
              while(iPos > -1) {
                iPos = link.indexOf(' ');
                link = link.replace(' ', '%20');
              }
              
              var transporter = nodemailer.createTransport ({
                service: 'gmail',
                auth: {
                    user: 'thesele.setsabi@gmail.com',
                    pass: 'makopoi2008'
                }
              });
            
            var mailOptions = {
                from: 'thesele.setsabi@gmail.com',
                to: email,
                subject: 'www.findinggraceinthevalley.com account email verification',
                html: `<a target='_blank' href=${link}>Click on this link to proceed</a>`
            };
            
            transporter.sendMail(mailOptions, function (error, info){
            
                if(error) {
                    console.log(error);
                } else {
                  console.log("link sent");
                }
          })
           } else {
             socket.emit('already-exists', {reject: "The account you are trying to register already exists/an account with your email address or username already exists"});
           }
          }  
      });
      } else {
        socket.emit('notValidEmail', {reject: "The email address you have entered does not exist"});
      }
        
      
  });
      
    socket.on('message', (data) => {
        var senderID = data.id; 
        var username = data.username;
        var targetID;
        var email;
      
        db.query("SELECT username, email FROM accounts WHERE username=?", [username], (err, results) => {
          if (err) throw err;
          if (results.length !== 0) {
          var name = results[0]['username'];
          
          if (username === "Admin") {
             email = openChatEmail;
          } else {
             email = results[0]['email'];
          }

          targetID = email;
          
          var today = new Date ();
          var date = today.getFullYear().toString()  + '-' + (today.getMonth() + 1).toString() + '-' + today.getDate().toString();
          date = moment(date, "YYYY-MM-DD");
          newDate = date.format("YYYY-MM-DD") 
          var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
          if (username !== "Admin") {
            var message = data.message;
            eventEmitter.emit('sendToAdmin', message, name, email)
            io.to(targetID).emit('message-from-others', {message: data.message, who: name, senderID: senderID});
            db.query("INSERT INTO messages (message, room, msgdate, msgtime, fromWho) values (?, ?, ?, ?, ?)", [data.message, email, newDate, time, name], (err, result) => {
              if (err) throw err;
              var adminSeen = 0;
              if (username === "Admin") {
              adminSeen = 1;
              db.query("UPDATE messages SET adminSeen =? WHERE room=? AND message=? ORDER BY msgdate ASC, msgtime ASC LIMIT 1", [adminSeen, email, data.message], (err, result) => {
                if (err) throw err;
              })
            }  else {
              db.query("UPDATE messages SET adminSeen = ? WHERE room=? AND message=? ORDER BY msgdate ASC, msgtime ASC LIMIT 1", [adminSeen, email, data.message], (err, result) => {
                if (err) throw err;
              })
            }
             
            })
          } else {
            socket.broadcast.emit("newMessage", name);
            io.to(targetID).emit('message-from-others', {message: data.message, who: "Admin", senderID: senderID});
            db.query("INSERT INTO messages (message, room, msgdate, msgtime, fromWho, userSeen) values (?, ?, ?, ?, ?, ?)", [data.message, email, newDate, time, "admin", 0], (err, result) => {
              if (err) throw err;
            })
          } 
        } 
      })  
  })

    socket.on("join", (data) => {
      var entryPage = data.prev;
      var username = data.username;
      if (entryPage === "https://gracevalleybook.com/chat-contacts") {
        socket.join(openChatEmail);
        objUsers.admin = socket.id;
        if (objUsers[openChatEmail]) {
          objUsers[openChatEmail].admin = socket.id;
        }
         db.query("SELECT message, fromWho FROM messages WHERE room=? ORDER BY msgdate ASC, msgtime ASC", [openChatEmail], (err, results) => {
           if (err) throw err;
           socket.emit('adminMessages', {users: results});
         })
      } else {
        db.query("SELECT email FROM accounts WHERE username=?", [username], (err, res) => {
          if (err) throw err;
          if (res.length !== 0) {
            var email = res[0]["email"];
            socket.join(email);
            objUsers[email] = {visitor: socket.id};
            db.query("SELECT message, fromWho FROM messages WHERE room=? ORDER BY msgdate ASC, msgtime ASC", [email], (err, results) => {
              if (err) throw err;
              socket.emit('loginMessages', {users: results});
            })
          }
        })
      }
    })

    socket.on("fetchUsers", () => {
      var usersProcessed = []; 
      var emails = [];

      db.query("SELECT fromWho FROM messages WHERE adminSeen <>1 AND fromWho<>'admin'", (err, results) => {
        var IDs = [];
        for (let i=0; i <=results.length -1; i++) {
          var user = results[i]["fromWho"];
          IDs.push(user);
        }
        socket.emit("recentMessages", {arrayID: IDs})
      }) 
      
      db.query("SELECT username, email FROM accounts WHERE blocked=0", (err, results) => {
        if (err) throw err;
        arrUsers = results;

        var recordCount = arrUsers.length;
        for (let i = 0; i <= recordCount - 1; i++) {
          var username = arrUsers[i]["username"]
          var email = arrUsers[i]["email"]
          usersProcessed.push(username);
          emails.push(email)
        }

        socket.emit('arrayUsers', {users: usersProcessed, email: emails});
        
       db.query("SELECT DISTINCT room FROM messages WHERE adminSeen=0", (err, result) => {
         var rooms = result;
         var arrRooms = [];
         var countPerRoom = [];
         
         for (let i = 0; i <= rooms.length - 1; i++) {
          var room = rooms[i]['room'];
          arrRooms.push(room);
          db.query("SELECT count(*) FROM messages WHERE adminSeen=0 AND room =?", [room], (err, result) =>{
            if (err) throw err;
            count = result[0]['count(*)'];
            countPerRoom.push(count);
            socket.emit('totalMessages', {rooms: arrRooms, counts: countPerRoom});
          })
        }
      }) 
    })
  })

    socket.on('listen', () => {
      eventEmitter.on('newAccount', (username, email) => {
        socket.emit("addAccount", {username: username, email: email});
      });

      eventEmitter.on('sendToAdmin', (message, name, email) => {
        socket.emit('increment', {message: message, name:name, id: email, email: email});
      })
    }) 

    socket.on('openChat', (data) => {
      var username = data.username;
      var email;
      db.query("SELECT email, username FROM accounts WHERE username=?", [username], (err, result) => {
        if (err) throw err;
        if(result.length !== 0) {
          openChatEmail = result[0]['email'];
          db.query("UPDATE messages SET adminSeen = 1 WHERE room=?", [openChatEmail], (err, result) => {
            if (err) throw err;
          })
        }
      }) 
    })

    socket.on('cookie', (cookie) => {
     var userCookie = cookie;
     userCookie = userCookie.replace("username=", "")
      db.query( "SELECT count(*), email FROM accounts WHERE username=?", [userCookie], (err, results) => {
        if (err) throw err;
        if (results.length !== 0) {
          var count = results[0]['count(*)'];
          var email = results[0]['email'];
          if (count != 0) {
            socket.join(email);
            objUsers[email] = { visitor: socket.id };
            db.query("SELECT message, fromWho FROM messages WHERE room=? ORDER BY msgdate ASC, msgtime ASC", [email], (err, results) => {
              if (err) throw err;
              socket.emit('objectMessages', {users: results});
            })
          }
        }
      })
    })

    socket.on('blockUser', (username) => {
      db.query("UPDATE accounts SET blocked=1 WHERE username=?", [username], (err, result) => {
        if (err) throw err;
      })
    })

    socket.on("userSeen", (username) => {
      if (username === "Admin") {
        //do nothing
      } else {
        db.query("SELECT email FROM accounts WHERE username=?", [username], (err, result) => {
          if (err) throw err;
          if(result.length !== 0) {
            var email = result[0]["email"];
            db.query("SELECT count(*) FROM messages WHERE room=? AND fromWho='Admin' AND userSeen<>1", [email], (newerror, newresults) => {
              if (newerror) throw newerror;
              if (newresults.length !== 0) {
                var count = newresults[0]["count(*)"];
                socket.emit('checkNewAdminMessages', count);
              }

            })
          }
        })
      }
    })

    socket.on("seenByUser", (username) => {
     db.query("SELECT email FROM accounts WHERE username=?", [username], (err, result) => {
       if (result.length !== 0) {
        var email = result[0]["email"];
        db.query("UPDATE messages SET userSeen=1 WHERE room=? AND fromWho='Admin'", [email], (err, result) => {
          if (err) throw err;
        })
       }
     })
    })

    socket.on('forgot', (email) => {
      db.query("SELECT count(*), username FROM accounts WHERE email=?", [email], (err, result) => {
            console.log(result);
        if (result.length !== 0) {
          var count = result[0]["count(*)"];
        var username = result[0]["username"];
        if (count === 0) {
          socket.emit("EmailNotFound", {reject: "No such email address is registered to our accounts. Please try again."} )
        } else {
         //code to change username or password
            var JWT_SECRET = 'some super secret...';
            var secret = JWT_SECRET + email;
            var payload = {email: email};
            var token = jwt.sign(payload, secret, {expiresIn: 600});
            db.query("INSERT INTO tokens (email, token, username) VALUES (?, ?, ?)", [email, token, username], (error, res) => {
              if (error) throw error;
            })
            var link = `https://gracevalleybook.com/forgot-change/${token}`;
            signToken[email] = JWT_SECRET;
            tokens[email] = token;
            console.log(link)
            function MailOut () {
              var transporter = nodemailer.createTransport ({
                  service: 'gmail',
                  auth: {
                      user: 'thesele.setsabi@gmail.com',
                      pass: 'makopoi2008'
                  }
              });
              
              var mailOptions = {
                  from: 'thesele.setsabi@gmail.com',
                  to: email,
                  subject: 'www.findinggraceinthevalley.com - Change your username or password',
                  html: `<a target='_blank' href=${link}>Click on this link to proceed</a>`
              };
              
              transporter.sendMail(mailOptions, function (error, info){
                  if(error) {
                      console.log(error);
                  }
              });
                socket.emit("deleteSent", {accept: "A link has been sent to your email address. Click on the link to change your forgotten account details", sessionEmail: email})
                db.query("INSERT INTO change_email (token, email) VALUES (?, ?)", [token, email], (err, res) => {
                  if (err) throw err;
                })
              }
          MailOut();  
        }
      }
    })
  })

    socket.on("change", (data) => {
      var email = data.email;
      var password = data.password;
      db.query("SELECT password FROM accounts WHERE email =?", [email], (errors, results) => {
        if (errors) throw errors;
        if (results.length === 0) {
          socket.emit("notFound", {reject: "Invalid email or password entered"});
        } else {
          var hash = results[0]["password"].toString();
          bcrypt.compare(password, hash, (er, rs) => {
            if (er) throw er;
            if (!rs) {
              socket.emit("notFound", {reject: "Invalid email or password entered"});
            } else {
              socket.emit("showForm");
            db.query("SELECT username FROM accounts WHERE email=?", [email], (err, result) => {
              if (err) throw err;
              if (result.length !== 0) {
                oldUsername = result[0]["username"];
                oldEmail = email;
              }
            })
            }
          })
        }
      })
    })

    socket.on("newDetails", (data) => {
      var username = data.username.trim();
      var password = data.password.trim();
      var email = data.email.trim();

      if (
        passwordStrength(password).length >= 8
            && passwordStrength(password).contains.indexOf('uppercase') > -1 === true
            && passwordStrength(password).contains.indexOf('lowercase') > -1 === true
            && passwordStrength(password).contains.indexOf('symbol') > -1 === true
      ) {
        bcrypt.hash(password, saltRounds, (er, hash) => {
          if (er) throw er;
          db.query("SELECT count(*) FROM accounts WHERE username=?", [username], (error, resultant) => {
            if(error) throw error;
            if (resultant.length !== 0) {
              var count = resultant[0]["count(*)"];
            if (count === 0) {
              db.query("UPDATE accounts SET username=?, password=? WHERE email=?", [username, hash, email], (err, result) => {
                if (err) throw err;
                socket.emit("accountUpdated");
                db.query("UPDATE messages SET fromWho=? WHERE room=? AND fromWho<>'Admin'", [username, oldEmail], (problem, results) => {
                  if (problem) throw problem;
                })
              })
            } else {
             db.query("SELECT username FROM accounts WHERE email=?", [email], (prob, reslt) => {
               if (prob) throw prob;
               if (reslt.length !== 0) {
                var checkName = reslt[0]["username"];
                if (checkName === username) {
                  db.query("UPDATE accounts SET password=? WHERE email=?", [hash, email], (prb, rsl) => {
                    if (prb) throw prb;
                    socket.emit("accountUpdated")
                  })
                } else {
                 socket.emit("already", {reject: "The username you have entered is already taken by another account"});
                }
               }
             })
            }
            }
          })
        })
       
      } else {
        socket.emit('reject', {reject: "Your password is too weak. Ensure that your password is at least 8 characters long, contains at least 1 uppercase letter, 1 lowercase letter and 1 symbol"})
      }

      
    }) 

    socket.on('logout', (username) => {
      var formattedName = username.replace('username=', "");
      if (formattedName === "Admin") {
        if(objUsers) {
          var arr = Array.from(objUsers);
          if (arr.length > 0) {
            delete objUsers[openChatEmail].admin;
          }  
        }
      } else {
         db.query("SELECT email FROM accounts WHERE username=?", [formattedName], (er, rslt) => {
        if(er) throw er;
        if (rslt.length !== 0) {
          var email = rslt[0]["email"];
          if (objUsers[email]) {
            delete objUsers[email].visitor
          }
          socket.leave(email);
        }
      })
      }
     
      
      db.query("UPDATE accounts SET logstatus = 'out' WHERE username =?", [formattedName], (err, result) => {
        if (err) throw err;
      })
      
    })

    socket.on("deleteAccount", (data) => {
      var email = data.email;
      var password = data.password;
      var JWT_SECRET = 'some super secret...';
            var secret = JWT_SECRET + email;
            var payload = {email: email};
            var token = jwt.sign(payload, secret, {expiresIn: 600});
            db.query("INSERT INTO tokens (email, token, username) VALUES (?, ?, ?)", [email, token, "none"], (error, res) => {
              if (error) throw error;
            })
            var link = `https://gracevalleybook.com/account-deleted/${token}`;
            signToken[email] = JWT_SECRET;
            tokens[email] = token;
            console.log(link)
            db.query("SELECT password FROM accounts WHERE email=?", [email], (err, result) => {
              if (err) throw err;
              if (result.length === 0) {
                socket.emit("deleteRejected", {reject: "Incorrect email or password entered"});
              } else {
                var hash = result[0]["password"].toString();
                bcrypt.compare(password, hash, (er, rs) => {
                  if (er) throw er;
                  if (!rs) {
                    socket.emit("deleteRejected", {reject: "Incorrect email or password entered"});
                  } else {
                    MailOut();
                  }
                })
              }
            })
            
            function MailOut () {
              var transporter = nodemailer.createTransport ({
                  service: 'gmail',
                  auth: {
                      user: 'thesele.setsabi@gmail.com',
                      pass: 'makopoi2008'
                  }
              });
              
              var mailOptions = {
                  from: 'thesele.setsabi@gmail.com',
                  to: email,
                  subject: 'www.findinggraceinthevalley.com - delete account (CANNOT BE UNDONE!)',
                  html: `<a target='_blank' href=${link}>Click on this link to proceed</a>`
              };
              
              transporter.sendMail(mailOptions, function (error, info){
                  if(error) {
                      console.log(error);
                  }
              });
                socket.emit("deleteSent", {accept: "A link has been sent to your email address. Click on the link to delete your account"})
              }
        });

        socket.on("changeEmail", (data) => {
          var email = data.email;
          var password = data.password
          db.query("SELECT count(*) FROM accounts WHERE email=?", [email], (err, result) => {
            if(result.length !== 0) {
              if (err) throw err;
            var count = result[0]["count(*)"];
            if (count === 0) {
              socket.emit("rejectAttempt", {reject: "Incorrect email entered"});
            } else {
              db.query("SELECT password FROM accounts WHERE email=?", [email], (error, results) => {
                if (error) throw error;
                if (results.length !== 0) {
                  var hash = results[0]["password"].toString();
                bcrypt.compare(password, hash, (er, rs) => {
                  if (er) throw er;
                  if (!rs) {
                    socket.emit("rejectAttempt", {reject: "Incorrect password entered"});
                  } else {
                    socket.emit("bounce");
                    db.query("INSERT INTO change_email (oldEmail) VALUES (?)", [email], (er, rs) => {
                      if (er) throw er;
                    })
                  }
                })
                }
              })
            }
            }
          })
        }) 

        socket.on("SetNewEmail", (emails) => {
          var email = emails.inputEmail;
          var oldEmail = emails.oldEmail;
          db.query("SELECT count(*) FROM accounts WHERE email=?", [email], (err, result) => {
            if (err) throw err;
            if (result.length !== 0) { 
              var count = result[0]["count(*)"];
              if (count === 0) { 
                if(validator.validate(email) === true) { 
                  var JWT_SECRET = 'some super secret...';
                  var secret = JWT_SECRET + email;
                  var payload = {email: email};
                  var token = jwt.sign(payload, secret, {expiresIn: 600});

                  db.query("UPDATE change_email SET token=?, newEmail=? WHERE oldEmail=?", [token, email, oldEmail], (error, res) => {
              if (error) throw error;
            })
                  var link = `https://gracevalleybook.com/confirmed/${token}`;
                  signToken[email] = JWT_SECRET; 
                  tokens[email] = token;
                  console.log(link)
                  MailOut();
                  function MailOut () {
                    var transporter = nodemailer.createTransport ({
                        service: 'gmail',
                        auth: {
                            user: 'thesele.setsabi@gmail.com',
                            pass: 'makopoi2008'
                        }
                    });
                    
                    var mailOptions = {
                        from: 'thesele.setsabi@gmail.com',
                        to: email,
                        subject: 'www.findinggraceinthevalley.com - change email address linked to your account',
                        html: `<a target='_blank' href=${link}>Click on this link to proceed</a>`
                    };
                    
                    transporter.sendMail(mailOptions, function (error, info){
                        if(error) {
                            console.log(error);
                        }
                    });
                      socket.emit("confirmed", {accept: "A link has been sent to your email address. Click on the link to change the email address linked to your account"})
                    }
                } else {
                  socket.emit("notValidEmail", {reject: "The email address you have entered does not exist"});
                }
              } else {
                socket.emit("reject", {reject: "The email address you have entered is already registered to another account"});
              }
            }
        })
      })

        socket.on("ForgotResolved", (data) => {
          var username = data.username;
          var password = data.password;
          var currentURL = data.currentURL;
          var token = url.parse(currentURL, true).path.replace("/forgot-change/", "");
        
          db.query("SELECT email FROM change_email WHERE token=?", [token], (err, res) => {
            if (err) throw err;
            if (res.length !== 0) {
              var emailForgot = res[0]["email"];
              console.log(emailForgot)
              if (
                passwordStrength(password).length >= 8
                && passwordStrength(password).contains.indexOf('uppercase') > -1 === true
                && passwordStrength(password).contains.indexOf('lowercase') > -1 === true
                && passwordStrength(password).contains.indexOf('symbol') > -1 === true
              ) {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                  db.query("SELECT count(*) FROM accounts WHERE username=?", [username], (error, resultant) => {
                    if(error) throw error;
                    if (resultant.length !== 0) {
                      var count = resultant[0]["count(*)"];
                    if (count === 0) {
                      db.query("UPDATE accounts SET username=?, password=? WHERE email=?", [username, hash, emailForgot], (err, result) => {
                        if (err) throw err;
                        socket.emit("accountUpdated");
                        db.query("UPDATE messages SET fromWho=? WHERE room=? AND fromWho<>'Admin'", [username, emailForgot], (problem, results) => {
                          if (problem) throw problem;
                        })
                      })
                    } else {
                     db.query("SELECT username FROM accounts WHERE email=?", [emailForgot], (prob, reslt) => {
                       if (prob) throw prob;
                       console.log(emailForgot)
                       if (reslt.length !== 0) {
                        var checkName = reslt[0]["username"];
                       if (checkName === username) {
                         db.query("UPDATE accounts SET password=? WHERE email=?", [hash, emailForgot], (prb, rsl) => {
                           if (prb) throw prb;
                           socket.emit("accountUpdated");
                         })
                         db.query("DELETE FROM change_email WHERE token=?", [token], (pr, nopr) => {
                           if (pr) throw pr;
                         })
                       } else {
                        socket.emit("already", {reject: "The username you have entered is already taken by another account"});
                       }
                       }
                     })
                    }
                    }
                  })
                })
              } else {
                socket.emit('reject', {reject: "Your password is too weak. Ensure that your password is at least 8 characters long, contains at least 1 uppercase letter, 1 lowercase letter and 1 symbol"})
              } 
            }
          })
        })
      });
