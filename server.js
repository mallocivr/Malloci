const  liveServer = require("live-server");
const getIP = require('external-ip')();


let params = {
    https: "/usr/local/lib/node_modules/live-server-https",
    port: 7777, // Set the server port. Defaults to 8080.
    host: process.env.IP, // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: "public/", // Set root directory that's being served. Defaults to cwd.
    open: false, // When false, it won't load your browser by default.
    cors: true,
    ignore: 'scss,my/templates', // comma-separated string for paths to ignore
    file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    logLevel: 2 // 0 = errors only, 1 = some, 2 = lots
};
liveServer.start(params);

getIP((err, ip) => {
    if (err) {
        // every service in the list has failed
        throw err;
    }
    console.log("Public on ", ip);
});