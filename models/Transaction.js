const mongoose = require("mongoose");

const PaymentStatus = ["SUCCESS", "FAILED", "PENDING"];

const transactionSchema = new mongoose.Schema({
  txnId: { type: Number, required: true, unique: true },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  status: { type: String, enum: PaymentStatus, required: true },
  txnTimestamp: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
