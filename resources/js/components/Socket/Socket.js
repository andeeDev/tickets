let socket;
const connect = () => {
    socket = new WebSocket('ws://localhost:8080');
    let connectInterval;
    let timeout = 2000;

    socket.onclose = e => {
        console.log(
            `Socket is closed. Reconnect will be attempted in ${Math.min(
                10000 / 1000,
                (timeout + timeout) / 1000
            )} second.`,
            e.reason
        );
        timeout = timeout + timeout; //increment retry interval
        connectInterval = setTimeout(check, Math.min(10000, timeout)); //call check function after timeout
    };
    const check = () => {
        if (!socket || socket.readyState == WebSocket.CLOSED) socket.connect(); //check if websocket instance is closed, if so call `connect` function.
    };
    // websocket onerror event listener
    socket.onerror = err => {
        console.error(
            "Socket encountered error: ",
            err.message,
            "Closing socket"
        );
        socket.close();
    }
};

export default socket;
