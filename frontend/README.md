# Packetgun-frontend by willmil11
## Installation
If you have node.js and npm installed you can run the following command in the terminal.
```bash
npm install packetgun-frontend
```
## Usage
This package is designed to be used with packetgun-backend as server.

First import the package with a script tag in the html of your website:
```html
<script src="node_modules/packetgun-frontend/packetgun-frontend.js"></script>
```
This package doesn't require initialization.
#### The following will only work if the package is already fully loaded.
### Classic method
To send a request with classic method you need to do as below:
```js
//First you'll need to wrap the code in an async function in order to be able to use await
var app = async function(){
    //Send the request
    var response = await packetgun.classic("adress:port", {
        //exit_code will be client_exit_code on the backend side
        exit_code: 0,
        data: "Hello world!"
    })

    //Log request exit code
    console.log(response.exit_code)
    //Log server exit code
    console.log(response.server_exit_code)
    //Log server data
    console.log(response.data)
}
app()
```
This method is not recommended because the size of the client upload data (including exit_code) is limitted to 255 chars/bytes, Also this method is unidirectional as it uses http: client to server not the other way around.

### Recommended method
To create a client with recommended method you need to do as below:
```js
//Create a client
var error = packetgun.recommended("adress:port", function(client){
    //When this callback is ran the client is connected to the server
    
    //Set an event for receiving data
    client.on("data", function(data){
        //Log request exit code
        console.log(client.exit_code)
        //Log server exit code
        console.log(client.server_exit_code)
        //Log server data
        console.log(client.data)
    })

    //Set an event for when the server disconnects
    client.on("serverDisconnect", function(){
        console.log("Server disconnected")
    })

    //Send data to the server (whenever you want and as many times as you want if the server is connected)
    client.send({
        //exit_code will be client_exit_code on the backend side
        exit_code: 0,
        data: "Hello world!"
    })

    //Close the connection (For the demo 5 seconds after the client connects)
    setTimeout(function(){
        client.close()
    }, 5000)
})

//Create a loop to check if the error variable is not null if it is not null then there was an error, the error message will be in the error variable

var loop = setInterval(function(){
    //If error variable is not null
    if (!(error === null)){
        //Log error
        console.error(error)
        //Stop loop
        clearInterval(loop)
    }
}/*Loop every milisecond*/, 1)
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
There are no credits for this package. (yet)