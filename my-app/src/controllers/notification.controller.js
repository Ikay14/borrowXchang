import Notification from '../models/notification.js'
import { formatTransactionMessage } from '../config/utils/notificationFormatter.js';
import { getIO } from '../services/socket.service.js';
import { successResponse } from '../utils/responseFormatter.js';


export const sendNotification = async (userId, notification) => {
  const io = getIO();
  io.to(userId.toString()).emit('notification', notification);
};

export const notifyTransaction = async (transaction, type) => {
  try {
    const message = formatTransactionMessage(transaction, type);

    const recipient = {
      INITIATED: transaction.receiver,
      ACCEPTED: transaction.sender,
      DECLINED: transaction.sender,
    }[type];

    if (!recipient || !message) return;

    await Notification.create({ user: recipient, message });

    await sendNotification(recipient, {
      type: `TRANSACTION_${type}`,
      message,
      transactionId: transaction._id,
      amount: transaction.amount,
    });
  } catch (err) {
    console.error(`Failed to notify ${type} transaction:`, err.message);
  }
};

export const getUserNotifications = async (req, res, next) => {
  try {
   const notifications = await Notification.find({ 
      $or: [
        { recipient: req.user._id },
        { user: req.user._id }  
      ]
    })

    return successResponse(res, {
      message: 'Notifications retrieved successfully',
      data: { notifications },
      statusCode: 200
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return next(error);
  }
};

