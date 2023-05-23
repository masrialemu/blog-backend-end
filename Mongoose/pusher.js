const Pusher = require("pusher");
const pusher = new Pusher({
    appId: "1606168",
    key: "17f125a54fc243dc678c",
    secret: "007cd28cc6ee71eaa11c",
    cluster: "ap2",
    useTLS: true
  });

module.exports=pusher