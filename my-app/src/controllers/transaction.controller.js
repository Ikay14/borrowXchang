import userModel from "../models/user.model.js";
import { BadRequestError, NotFoundError } from "../utils/exception.js";
import walletModel from '../models/wallet.model.js';
import transactionModel from '../models/transaction.js'
import { TRANSACTION_STATUS } from "../config/transactionStatus.js";
import {successResponse} from "../utils/responseFormatter.js"
import { notifyTransaction } from "./notification.controller.js"
import { v4 as uuidv4 } from 'uuid'; 

export const transfer = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) return next(new BadRequestError('User not found'));

    const { receiverWallet, amount } = req.body;
    if (!receiverWallet || !amount)
      return next(new BadRequestError('Receiver wallet and amount are required'))

    const senderWallet = await walletModel.findOne({ user: user._id });
    if (!senderWallet) return next(new BadRequestError('Sender wallet not found'));

    if (senderWallet.walletId === receiverWallet)
      return next(new BadRequestError(`You can't send money to your own wallet`))

    const receiverWalletDoc = await walletModel.findOne({ walletId: receiverWallet });
    if (!receiverWalletDoc) return next(new BadRequestError('Receiver wallet not found'))

    if (typeof amount !== 'number' || amount <= 0)
    return next(new BadRequestError('Amount must be a positive number'));

    if (senderWallet.balance < amount)
    return next(new BadRequestError('Insufficient balance'));

    // Deduct amount temporarily from sender's wallet (reserve funds)
    senderWallet.balance -= amount;
    await senderWallet.save()

    // Create pending transaction
    const transaction = await transactionModel.create({
      transactionId: uuidv4(),
      sender: user._id,
      receiver: receiverWalletDoc.user,
      senderWallet: senderWallet.walletId,
      receiverWallet: receiverWalletDoc.walletId,
      amount,
      status: 'PENDING',
    })

    // notify the receiver here
    await notifyTransaction(transaction, 'INITIATED');

  return successResponse(res, {
  message: 'Transaction initiated successfully',
  data: transaction,
  statusCode: 201,
});

  } catch (error) {
    return next(error)
  }
}


export const acceptTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params

    const transaction = await transactionModel.findOne(transactionId )
    if (!transaction) return next(new NotFoundError('Transaction not found'));

    if (transaction.status !== TRANSACTION_STATUS.PENDING) {
      return next(new BadRequestError('Transaction has already been processed'))
    }

    if (transaction.receiver.toString() !== req.user._id.toString()) {
      return next(new BadRequestError('You are not authorized to accept this transaction'));
    }

    const receiverWallet = await walletModel.findOne({ walletId: transaction.receiverWallet });
    const senderWallet = await walletModel.findOne({ walletId: transaction.senderWallet });

    if (!receiverWallet || !senderWallet) {
      return next(new NotFoundError('Wallet not found'))
    }

    receiverWallet.balance += transaction.amount
    await receiverWallet.save();

    transaction.status = TRANSACTION_STATUS.COMPLETED
    
    await transaction.save()

    //  notify sender
    await notifyTransaction(transaction, 'ACCEPTED');


     return successResponse(res, {
      message: 'Transaction accepted successfully',
      data: { transaction },
    })
  } catch (error) {
    next(error)
  }
}


export const declineTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params

    const transaction = await transactionModel.findOne(transactionId)
    if (!transaction) return next(new NotFoundError('Transaction not found'));

    if (transaction.status !== TRANSACTION_STATUS.PENDING) {
      return next(new BadRequestError('Transaction has already been processed'));
    }

    if (transaction.receiver.toString() !== req.user._id.toString()) {
      return next(new BadRequestError('You are not authorized to decline this transaction'))
    }

    const senderWallet = await walletModel.findOne({ walletId: transaction.senderWallet });
    if (!senderWallet) {
      return next(new NotFoundError('Sender wallet not found')) 
    }

    senderWallet.balance += transaction.amount // Refund the sender 
    await senderWallet.save()

   transaction.status = TRANSACTION_STATUS.DECLINED;
    await transaction.save();

    // notify sender
     await notifyTransaction(transaction, 'DECLINED');


   return successResponse(res, {
      message: 'Transaction declined and funds refunded',
      data: { transaction },
    });
  } catch (error) {
    next(error)
  }
}


export const getTransactions = async (req, res, next) => {
  try {
    const { status, type, limit = 10, skip = 0 } = req.query;

    const query = {
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    };

    if (status) query.status = status.toUpperCase();

    if (type === 'sent') query.sender = req.user._id;
    else if (type === 'received') query.receiver = req.user._id;

    const transactions = await transactionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

 return successResponse(res, {
      message: 'Transactions fetched successfully',
      data: {
        count: transactions.length,
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};



