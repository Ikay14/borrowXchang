import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  user: 
  { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  walletId: 
  { type: String, 
    required: true, 
    unique: true 
},
  balance: 
  { type: Number, 
    default: 100 
},
}, {
    timestamps: true
});

export default mongoose.model('Wallet', walletSchema)
