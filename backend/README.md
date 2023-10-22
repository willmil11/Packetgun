# Packetgun-backend by willmil11
## Installation
If you have node.js and npm installed you can run the following command in the terminal.
```bash
npm install packetgun-backend
```

## Usage
This package is designed to be used with packetgun-frontend as client.
<br>
<br>
First require the package:
```javascript
var packetgun = require("packetgun-backend");
```
Then init the package if you don't everything else that you do will throw an error. The syntax is as below
```js
packetgun.init(verbose, custom-prefix)
//Verbose must be boolean or unspecified (which counts as false)
//Custom-prefix must be a string or unspecified
```
### Classic method
To listen with classic method you need to do as below:
```js
//Listen for requests
packetgun.listen.classic(port, function(client){
    //Got request

    //Log client ip
    console.log(client.ip);
    //Log request exit code
    console.log(client.exit_code);
    //Log client exit code
    console.log(client.client_exit_code);
    //Log client data
    console.log(client.data);

    //Return a response
    //
    //exit_code will be server_exit_code on the client side
    return {
        exit_code: 0,
        data: "Hello world!"
    }
})
```
This method is not recommended because the size of the client upload data (including exit_code) is limitted to 255 chars/bytes, Also this method is unidirectional as it uses http: client to server not the other way around.

### Recommended method
To listen with recommended method you need to do as below:
```js
//Listen for clients
packetgun.listen.recommended(port, function(client){
    //This method uses a different approach to the classic method, this callback is ran when a new client connects.

    //Set an event for receiving data
    client.on("data", function(data){
        //Log request exit code
        console.log(client.exit_code);
        //Log client exit code
        console.log(client.client_exit_code);
        //Log client data
        console.log(client.data);
    })

    //Set an event for client disconnect
    client.on("clientDisconnect", function(){
        console.log("Client disconnected");
    })

    //Send data to the client (whenever you want and as many times as you want if the client is connected)
    client.send({
        exit_code: 0,
        data: "Hello world!"
    })

    //Close the connection (For the demo 5 seconds after the client connects)
    setTimeout(function(){
        client.close();
    }, 5000)
})
```
This method is recommended because it is bidirectional (client to server and server to client) as it uses websockets. Also the size of the client upload data (including exit_code) is unlimited.

## Future goals
- [ ] Encryption
- [ ] Better error handling
- [ ] Recommended method auto reconnection
- [ ] Classic method multiple part uploads (to avoid the 255 chars/bytes client upload limit)

## Changelog
### 1.0.0
- Initial release

## Creator and credits
The creator of this package is willmil11 (me).
<br>
<br>
Used easynodes for this package. easynodes uses other packages which credits can be found in it's readme. easynodes is also created by me.