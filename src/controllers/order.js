const orderModel=require('../models/orderModel')
const validator=require('validator')
const { isValidObjectId}=require('mongoose')
const customerModel=require('../models/customerModel')

const createOrder=async function(req,res)
{  let data = req.body;
  let enteries = Object.entries(data);
  if (enteries.length == 0)
    return res
      .status(400)
      .send({ status: false, message: "please provide data to create" });
  let arr = ["title", "description", "price", "customerId"];
  for (let i = 0; i < enteries.length; i++) {
    // check for mendatory field
    let count = 0;
    if (count == 0) {
      for (let j = 0; j < arr.length; j++) {
        let flag = false;
        for (let k = 0; k < enteries.length; k++) {
          if (enteries[k][0] == arr[j]) {
            flag = true;
            break;
          }}
        if (!flag)
          return res
            .status(400)
            .send({ status: false, message: `${arr[j]} is a mendatory field` });
      } count++;
    }//------------check for extra keys  and delete from data //trim values // after trim if empty string give message
    if (arr.includes(enteries[i][0])) {
      if (enteries[i][0]!="price") {
        data[enteries[i][0]] = data[enteries[i][0]].trim();
        if (data[enteries[i][0]] == "")
          return res.status(400).send({
            status: false,
            message: `${enteries[i][0]} field connot be empty`,
          });
        else {
          if (enteries[i][0] == "title") {
            if (!validator.isAlpha(data.title, "en-US", { ignore: " " }))
              return res
                .status(400)
                .send({ status: false, message: "enter valid title"});
          } else if (enteries[i][0] == "description") {
            if (!validator.isAlpha(data.description, "en-US", { ignore: " " }))
              return res
                .status(400)
                .send({ status: false, message: "please provide valid discription" });
          } else if (enteries[i][0] == "customerId") {
           
            if (!isValidObjectId(data.customerId))
              return res
                .status(400)
                .send({ status: false, message: "please enter a valid customerId" });
          }}
      } else {
        if (!validator.isNumeric(data.price)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter valid price" }); }}
    } else {
      delete data[enteries[i][0]];
    }}
    let checkCustomer = await customerModel.findOne({ _id: data.customerId });
  if (!checkCustomer)
    return res.status(400).send({ status: false, mesasge: "no user found" });

    let create = await orderModel.create(data);
    let { noOfOrders, moneyBack } = checkCustomer;

  let update = {};
  let remainingOrders;

  if (noOfOrders < 10) {
    remainingOrders = `${
      9 - noOfOrders
    } Order left to be a gold member and enjoying 10% discount`;
    update = { $inc: { noOfOrders: 1 } };
    
  }

  if (noOfOrders >= 10 && noOfOrders < 20) {
    remainingOrders = `${
      19 - noOfOrders
    } Order left , to be a platinum member and enjoying 10% discount`;
    moneyBack = moneyBack + (data.price * 10) / 100;
    update = {
      $set: { moneyBack: moneyBack, category: "gold" },
      $inc: { noOfOrders: 1 },
    };
  }
  if (noOfOrders >= 20) {
    remainingOrders = "20% discount credited to your account";
    moneyBack = moneyBack + (data.price * 20) / 100;
    update = {
      $set: { moneyBack: moneyBack, category: "platinum" },
      $inc: { noOfOrders: 1 },
    };
    return res
      .status(201)
      .send({
        status: true,
        message: `20% discount credited to your account`,
        orderDetails: create,
      });
  }
  await customerModel.findOneAndUpdate({ _id: data.customerId }, update);
  return res
    .status(201)
    .send({ status: true, message: remainingOrders, orderDetails: create });
}
module.exports = { createOrder };