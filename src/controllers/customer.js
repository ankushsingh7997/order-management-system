const customerModel = require("../models/customerModel");
const validation = require("../validations/validation");
const validator = require("validator");

const createCustomer = async function (req, res) {
  let data = req.body;
  let enteries = Object.entries(data);
  if (enteries.length == 0)
    return res
      .status(400)
      .send({ status: false, message: "please provide data to create" });
  let arr = ["title", "name", "phone", "email"];
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
      if (enteries[i][0]!="phone") {
        data[enteries[i][0]] = data[enteries[i][0]].trim();
        if (data[enteries[i][0]] == "")
          return res.status(400).send({
            status: false,
            message: `${enteries[i][0]} field connot be empty`,
          });
        else {
          if (enteries[i][0] == "title") {
            if (!["MR", "MRS", "MISS"].includes(data.title))
              return res
                .status(400)
                .send({ status: false, message: "title must be MR,MRS,MISS" });
          } else if (enteries[i][0] == "name") {
            if (!validator.isAlpha(data.name, "en-US", { ignore: " " }))
              return res
                .status(400)
                .send({ status: false, message: "please provide valid name" });
          } else if (enteries[i][0] == "email") {
            data.email=data.email.toLowerCase()
            if (!validation.isValidEmail(data.email))
              return res
                .status(400)
                .send({ status: false, message: "please provide valid email" });
          }}
      } else {
        if (!validation.isValidPhone(data.phone)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter valid phone number" });
        }}
    } else {
      delete data[enteries[i][0]];
    }}// duplicate email and phone number
  let checkDuplicate = await customerModel.find({
    $or: [{ email: data.email }, { phone: data.phone }]});
if (checkDuplicate.length >= 1) {
    if (data.email.toLowerCase() == checkDuplicate[0].email) {
      return res
        .status(400)
        .send({ status: false, msg: "email is already in use" });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Phone is already in use" });
    }
  }
  let customer = await customerModel.create(data);
  return res
    .status(201)
    .send({ status: true, message: "customer regestered successfully" });
};
module.exports = { createCustomer };
