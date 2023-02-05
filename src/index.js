const express = require("express");
const mongoose = require("mongoose");
const routes = require("./route/route");

const app = express();

app.use(express.json());
mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://Vishanksingh:7997@cluster0.ga4iiwd.mongodb.net/Ankush1234-DB?retryWrites=true&w=majority",{dbName:"order-management"},{useNewUrlParser:true}).then(()=>{console.log("mongoDb connected")}).catch((error)=>{console.log(error.message)})

app.use("/",routes);

app.listen(3000, function(){
    console.log("port is running on "+ 3000)
})