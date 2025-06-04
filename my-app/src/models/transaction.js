import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderWallet: {
      type: String,
      required: true,
    },
    receiverWallet: {
      type: String,
      required: true,
    },
     transactionId: {
    type: String,
  },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Transfer amount must be positive'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'DECLINED'],
      default: 'PENDING',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
    declinedReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Transaction', transactionSchema);
