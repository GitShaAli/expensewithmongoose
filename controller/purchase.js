const Razorpay = require('razorpay');
const { BulkRecordError } = require('sequelize');
const Order = require('../models/orders');
const User = require('../models/user');


const purchasepremium =async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 1000;

        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(err);
            }
            const orders = new Order({
                orderid : order.id,
                paymentid:0,
                status:'pending',
                userId:req.user._id
              });
            orders.save().then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

 const updateTransactionStatus = (req, res ) => {
    try {
        const { payment_id, order_id} = req.body;
        const update = {paymentid:payment_id,status:"success"}
        Order.findOneAndUpdate({'order.orderid':order_id},update).then(order => {
            console.log("Order :   "+order);
            const member = {ispremiumuser:true};
            for(let i in order){
                if(order[i].userId){
                    User.findOneAndUpdate({'user._id':order[i].userId},member).then(()=>{
                        console.log("Updated")
                    })
                    // console.log("order in : "+order[i].userId);
                    break;
                }
            }
            
            // console.log("Order :   "+order);
            // for(let i=0;i<order.length;i++){
            //     // user.findOneAndUpdate({'user._id':order[i]._id},member)
            // }
            
            
            return res.status(202).json({sucess: true, message: "Transaction Successful"});
        //         order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
        //         req.user.update({ispremiumuser: true})
        //         console.log(res);
        //         return res.status(202).json({sucess: true, message: "Transaction Successful"});
        //     }).catch((err)=> {
        //         throw new Error(err);
        //     })
        // }).catch(err => {
        //     throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' })

    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
}