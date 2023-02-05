const express = require("express");
const mongoose = require("mongoose");
const routes = require("./route/route");

const app = express();

app.use(express.json());
mongoose.set("strictQuery", true);
mongoose.connect("")
.then(()=> console.log("mongoDb is connected"))
.catch((err)=> console.log(err))

app.use("/",routes);

app.listen(3000, function(){
    console.log("port is running on "+ 3000)
})