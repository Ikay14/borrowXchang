export const formatTransactionMessage = (transaction, type) => {
  const amount = transaction.amount.toFixed(2);
  const senderWallet = transaction.senderWallet;
  const receiverWallet = transaction.receiverWallet;

  const templates = {
    INITIATED: ` New transfer of ₦${amount} initiated from wallet ${senderWallet} to your wallet ${receiverWallet}. Awaiting your approval.`,
    ACCEPTED: ` Your transfer of ₦${amount} to wallet ${receiverWallet} has been accepted.`,
    DECLINED: ` Your transfer of ₦${amount} to wallet ${receiverWallet} was declined. The amount has been refunded to your wallet.`,
  };

  return templates[type] || 'You have a new transaction update.';
};
