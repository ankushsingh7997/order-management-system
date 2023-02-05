const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const orderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
      
    },
    customerId: {
      type: ObjectId,
      required: true,
      ref: "customerData"
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("order", orderSchema);