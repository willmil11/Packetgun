var packetgun = {
    "system": {
        "genthrow": function (error) {
            throw "[Packetgun] " + error;
        }
    },
    "classic": async function (adress, data) {
        if (!(typeof adress === "string")) {
            this.system.genthrow("Adress is not a string.");
        }
        if (!(typeof data === "object")) {
            this.system.genthrow("Data is not an object.");
        }
        else{
            if (data.data == null) {
                this.system.genthrow("Invalid data.")
            }
            else {
                if (data.exit_code == null) {
                    this.system.genthrow("Invalid data.")
                }
            }
        }
        var returns = null;
        adress = "http://" + adress;

        if (adress.endsWith("/")) {
            adress = adress.slice(0, -1);
        }
        var stringified = JSON.stringify(data);
        if (stringified.length > 255) {
            this.system.genthrow("Data is too big for classic method, use recommended method for bigger data. [Classic method max size: 255 characters, data includes exit_code and data] [Current size: " + stringified.length + "]");
        }
        adress = "http://" + adress + "/" + stringified;
        if (adress.startsWith("http://http://")) {
            adress = adress.slice(7);
        }
        var xhr = new XMLHttpRequest();
        try{
            xhr.open("GET", adress);
        }
        catch (error){
            returns =  {
                "exit_code": 1,
                "error": "Invalid adress, should be as 'ip:port'."
            }
        }
        xhr.withCredentials = false;
        xhr.onerror = function () {
            returns = {
                "exit_code": 1,
                "error": "An error has occured while connecting."
            }
        }
        xhr.onload = function () {
            var received;
            try {
                received = JSON.parse(this.responseText);
            }
            catch (error) {
                returns = {
                    "exit_code": 1,
                    "error": "An error has occured while processing received data."
                }
            }
            returns = {
                "exit_code": 0,
                "server_exit_code": received.exit_code,
                "data": received.data
            }
        }
        xhr.send();
        var stop = false;
        xhr.addEventListener("error", function () {
            stop = true;
        });
        while (returns === null) {
            await new Promise(r => setTimeout(r, 1));
            if (stop) {
                return;
            }
        }
        if (!(returns === null)) {
            return returns;
        }
    },
    "recommended": async function (adress, callback) {
        if (!(typeof callback === "function")) {
            this.system.genthrow("Callback is not a function.");
        }
        if (!(typeof adress === "string")) {
            this.system.genthrow("Adress is not a string.");
        }
        var returns = null;
        adress = "ws://" + adress;
        var ws;
        try{
            ws = new WebSocket(adress);
        }
        catch (error){
            returns = {
                "exit_code": 1,
                "error": "Invalid adress, should be as 'ip:port'."
            }
        }
        ws.onerror = function () {
            returns = {
                "exit_code": 1,
                "error": "An error has occured while connection."
            }
        }
        ws.onopen = function () {
            callback({
                "on": function (event, eventcallback) {
                    if (!(typeof event === "string")) {
                        packetgun_frontend.system.genthrow("Event is not a string.")
                    }
                    if (!(typeof eventcallback === "function")) {
                        packetgun_frontend.system.genthrow("Eventcallback is not a function.")
                    }
                    if (event !== "data" && event !== "serverDisconnect") {
                        packetgun_frontend.system.genthrow("An error has occurred: event is neither 'data' nor 'serverDisconnect'.");
                    }
                    if (event === "data") {
                        ws.onmessage = function (event) {
                            var data = `${event.data}`;
                            try {
                                data = JSON.parse(data);
                            }
                            catch (error) {
                                packetgun_frontend.system.genthrow("An error has occured while processing received data.")
                            }
                            eventcallback({
                                "exit_code": 0,
                                "server_exit_code": data.exit_code,
                                "data": data.data
                            });
                        }
                    }
                    else {
                        if (event === "serverDisconnect") {
                            ws.onclose = function (event) {
                                eventcallback();
                            }
                        }
                    }
                },
                "close": function () {
                    ws.close();
                },
                "send": function (data) {
                    if (!(typeof data === "object")) {
                        packetgun_frontend.system.genthrow("Data is not an object.")
                    }
                    else {
                        if (data.data == null) {
                            packetgun_frontend.system.genthrow("Invalid data.")
                        }
                        else {
                            if (data.exit_code == null) {
                                packetgun_frontend.system.genthrow("Invalid data.")
                            }
                            else {
                                ws.send(JSON.stringify({
                                    "exit_code": data.exit_code,
                                    "data": data.data
                                }));
                            }
                        }
                    }
                },
                "removeEvents": function () {
                    ws.onmessage = null;
                    ws.onclose = null;
                }
            })
        }
        var stop = false;
        ws.addEventListener("close", function () {
            stop = true;
        });
        while (returns === null) {
            await new Promise(r => setTimeout(r, 1));
            if (stop) {
                return;
            }
        }
        if (!(returns === null)) {
            return returns;
        }
    }
}