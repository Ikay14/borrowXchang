import { Router } from "express";   
import { transfer, acceptTransaction, declineTransaction, getTransactions } from '../controllers/transaction.controller.js'
import { protect } from "../middleware/auth.middleeware.js";

const router = Router() 

router.post('/initiateTransfer', protect, transfer)
router.post('/accept/:id', protect, acceptTransaction)
router.post('/decline/:id', protect, declineTransaction)
router.get('/transactions', protect, getTransactions);


export default router 