//Packetgun-backend by willmil11
//

module.exports = {
    "system": {
        "inited": false,
        "genprefix": function () {
            return module.exports.system.prefix + " ";
        },
        "checkinit": function () {
            if (!(module.exports.system.inited)) {
                throw module.exports.system.genthrow("Packetgun-backend is not initialized.");
            }
        },
        "genthrow": function (message) {
            return module.exports.system.genprefix() + message;
        },
        "ids": {
            "lengths": 5,
            "ids_list": []
        },
        "genid": function () {
            //Check if all ids for the current length are used
            if (module.exports.system.ids.ids_list.length >= Math.pow(10, module.exports.system.ids.lengths)) {
                module.exports.system.ids.lengths += 1;
            }

            var id = "";
            var index = 0;
            while (index < module.exports.system.ids.lengths) {
                id += Math.floor(Math.random() * 10);
                index += 1;
            }
            return {
                "id": id,
                "id_index": module.exports.system.ids.ids_list.length,
                "remove": function () {
                    module.exports.system.ids.ids_list.splice(this.id_index, 1);
                }
            }
        },
        "verboselog": function (message) {
            if (module.exports.system.verbose) {
                console.log(module.exports.system.genprefix() + message);
            }
        },
        "verbose": false
    },
    "init": function (verbose, custom_prefix) {
        if (verbose === true) {
            module.exports.system.verbose = true;
        }
        else {
            module.exports.system.verbose = false;
        }
        if (custom_prefix) {
            module.exports.system.prefix = custom_prefix;
        }
        else {
            module.exports.system.prefix = "[Packetgun-backend]";
        }
        try {
            module.exports.system.easynodes = require("easynodes");
        }
        catch (error) {
            throw module.exports.system.genthrow("An error has occured while importing easynodes.");
        }
        var easynodes = module.exports.system.easynodes;
        easynodes.init();
        module.exports.system.inited = true;
        module.exports.system.verboselog("Packetgun-backend initialized.");
    },
    "listen": {
        "classic": function (port, callback) {
            module.exports.system.checkinit();
            var easynodes = module.exports.system.easynodes;
            if (port == null) {
                throw module.exports.system.genthrow("An error has occured while trying to listen with classic method: port is null.");
            }
            else {
                if (!(typeof port === "number")) {
                    throw module.exports.system.genthrow("An error has occured while trying to listen with classic method: port is not a number.");
                }
            }
            if (callback == null) {
                throw module.exports.system.genthrow("An error has occured while trying to listen with classic method: callback is null.");
            }
            else {
                if (!(typeof callback === "function")) {
                    throw module.exports.system.genthrow("An error has occured while trying to listen with classic method: callback is not a function.");
                }
            }
            try {
                easynodes.http.newServer(function (requestHandler) {
                    var url = requestHandler.url;
                    var ip = requestHandler.ip;
                    var slice = url.slice(1);
                    var decode = decodeURI(slice);
                    var data;
                    try {
                        data = JSON.parse(decode);
                    }
                    catch (error) {
                        throw module.exports.system.genthrow("An error has occured while listening with classic method: Client is not packetgun client.");
                        return;
                    }
                    if (!(typeof data === "object")) {
                        throw module.exports.system.genthrow("An error has occured while listening with classic method: Client is not packetgun client.");
                        return;
                    }
                    else {
                        if (data.data == null) {
                            throw module.exports.system.genthrow("An error has occured while listening with classic method: Client is not packetgun client.");
                            return;
                        }
                        else {
                            if (data.exit_code == null) {
                                throw module.exports.system.genthrow("An error has occured while listening with classic method: Client is not packetgun client.");
                                return;
                            }
                            else {
                                if (!(typeof data.exit_code === "number")) {
                                    throw module.exports.system.genthrow("An error has occured while listening with classic method: Client is not packetgun client.");
                                    return;
                                }
                                else {
                                    if ((!(data.exit_code === 0)) && (!(data.exit_code === 1))) {
                                        throw module.exports.system.genthrow("An error has occured while listening with classic method: Client is not packetgun client.");
                                        return;
                                    }
                                }
                            }
                        }
                    }
                    var response = callback({
                        "data": data.data,
                        "exit_code": 0,
                        "client_exit_code": data.exit_code,
                        "ip": ip
                    })

                    //If response is not an object, throw an error
                    if (!(typeof response === "object")) {
                        throw module.exports.system.genthrow("An error has occured while listening with classic method: Response is not an object.");
                        return;
                    }
                    else {
                        //Check response integrity
                        if (response.data == null) {
                            throw module.exports.system.genthrow("An error has occured while listening with classic method: Response data is null.");
                            return;
                        }
                        else {
                            if (response.exit_code == null) {
                                throw module.exports.system.genthrow("An error has occured while listening with classic method: Response exit_code is null.");
                                return;
                            }
                            else {
                                if (!(typeof response.exit_code === "number")) {
                                    throw module.exports.system.genthrow("An error has occured while listening with classic method: Response exit_code is not a number.");
                                    return;
                                }
                                else {
                                    if ((!(response.exit_code === 0)) && (!(response.exit_code === 1))) {
                                        throw module.exports.system.genthrow("An error has occured while listening with classic method: Response exit_code is not 0 or 1.");
                                        return;
                                    }
                                    else {
                                        requestHandler.end(JSON.stringify({
                                            "data": response.data,
                                            "exit_code": response.exit_code
                                        }), 200, { "Content-Type": "text/plain", "Access-Control-Allow-Origin": "*" });
                                    }
                                }
                            }
                        }
                    }
                }, port);
            }
            catch (error) {
                throw module.exports.system.genthrow("An error has occured while listening with classic method.");
            }
        },
        "recommended": function (port, callback) {
            module.exports.system.checkinit();
            var easynodes = module.exports.system.easynodes;
            if (port == null) {
                throw module.exports.system.genthrow("An error has occured while trying to listen with recommended method: port is null.");
            }
            else {
                if (!(typeof port === "number")) {
                    throw module.exports.system.genthrow("An error has occured while trying to listen with recommended method: port i s not a number.");
                }
            }
            if (callback == null) {
                throw module.exports.system.genthrow("An error has occured while trying to listen with recommended method: callback is null.");
            }
            else {
                if (!(typeof callback === "function")) {
                    throw module.exports.system.genthrow("An error has occured while trying to listen with recommended method: callback is not a function.");
                }
            }

            try {
                easynodes.websocket.newServer(port, function (client) {
                    callback({
                        "on": function (event, eventcallback) {
                            if (event == null) {
                                throw module.exports.system.genthrow("An error has occured while trying to listen with recommended method: event is null.");
                            }
                            else {
                                if (!(typeof event === "string")) {
                                    throw module.exports.system.genthrow("An error has occured while trying to listen with recommended method: event is not a string.");
                                }
                            }
                            if (eventcallback == null) {
                                throw module.exports.system.genthrow("An error has occured while trying to listen with recommended method: eventcallback is null.");
                            }
                            else {
                                if (!(typeof eventcallback === "function")) {
                                    throw module.exports.system.genthrow("An error has occured while trying to listen with recommended method: eventcallback is not a function.");
                                }
                            }
                            if (event !== "data" && event !== "clientDisconnect") {
                                throw module.exports.system.genthrow("An error has occurred: event is neither 'data' nor 'clientDisconnect'.");
                            }
                            if (event === "data") {
                                client.onmessage(function (data) {
                                    var received;
                                    try{
                                        received = JSON.parse(data);
                                    }
                                    catch (error){
                                        throw module.exports.system.genthrow("An error has occured while processing received data.");
                                    }
                                    if (!(typeof received === "object")) {
                                        throw module.exports.system.genthrow("An error has occured while processing received data.");
                                    }
                                    else {
                                        if (received.data == null) {
                                            throw module.exports.system.genthrow("An error has occured while processing received data.");
                                        }
                                        else {
                                            if (received.exit_code == null) {
                                                throw module.exports.system.genthrow("An error has occured while processing received data.");
                                            }
                                            else {
                                                if (!(typeof received.exit_code === "number")) {
                                                    throw module.exports.system.genthrow("An error has occured while processing received data.");
                                                }
                                                else {
                                                    if ((!(received.exit_code === 0)) && (!(received.exit_code === 1))) {
                                                        throw module.exports.system.genthrow("An error has occured while processing received data.");
                                                    }
                                                    else {
                                                        eventcallback({
                                                            "exit_code": 0,
                                                            "client_exit_code": received.exit_code,
                                                            "data": received.data
                                                        })
                                                    }
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                            else {
                                if (event === "clientDisconnect") {
                                    client.onclose(function () {
                                        eventcallback();
                                    })
                                }
                                else {
                                    throw module.exports.system.genthrow("An error has occured while trying to listen with recommended method: event is not data or clientDisconnect.");
                                }
                            }
                        },
                        "close": function () {
                            client.close();
                        },
                        "send": function (data) {
                            if (!(typeof data === "object")) {
                                throw module.exports.system.genthrow("An error has occured while trying to send data: data is not an object.");
                            }
                            else {
                                if (data.data == null) {
                                    throw module.exports.system.genthrow("An error has occured while trying to send data: data.data is null.");
                                }
                                else {
                                    if (data.exit_code == null) {
                                        throw module.exports.system.genthrow("An error has occured while trying to send data: data.exit_code is null.");
                                    }
                                    else {
                                        if (!(typeof data.exit_code === "number")) {
                                            throw module.exports.system.genthrow("An error has occured while trying to send data: data.exit_code is not a number.");
                                        }
                                        else {
                                            if ((!(data.exit_code === 0)) && (!(data.exit_code === 1))) {
                                                throw module.exports.system.genthrow("An error has occured while trying to send data: data.exit_code is not 0 or 1.");
                                            }
                                            else {
                                                client.send(JSON.stringify({
                                                    "data": data.data,
                                                    "exit_code": data.exit_code
                                                }))
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "removeEvents": function () {
                            client.removeEvents();
                        }
                    })
                })
            }
            catch (error) {
                throw module.exports.system.genthrow("An error has occured while listening with recommended method");
            }
        }
    }
}