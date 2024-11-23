const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    createdBy: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true }
    },
    status:{type:String,default:"created"},
    orderDetails: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });



module.exports = mongoose.model('Order', orderSchema);
