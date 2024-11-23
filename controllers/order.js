const axios = require('axios');
const Order = require('../models/order');
const getShiprocketToken = async () => {

    try {
        const input = {
            email: process.env.SHIPROCKET_EMAIL,
            password: process.env.SHIPROCKET_PASSWORD
        }
        let data = JSON.stringify(input);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://apiv2.shiprocket.in/v1/external/auth/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        const loginResponse = await axios.request(config)
        return loginResponse.data.token;
    } catch (err) {
        throw new Error('Error logging into Shiprocket: ' + err.message);
    }
};
const createOrder = async (req, res) => {
    try {
        const { orderDetails } = req.body
        const orderData = {
            order_id: `order-${new Date().toISOString()}`,
            order_date: new Date().toISOString(),
            pickup_location: "Home",
            channel_id: "",
            comment: "",
            billing_customer_name: req.user.name,
            billing_last_name: "",
            billing_address: orderDetails.address,
            billing_address_2: "",
            billing_city: orderDetails.city,
            billing_pincode: orderDetails.pincode,
            billing_state: orderDetails.state,
            billing_country: "India",
            billing_email: req.user.email,
            billing_phone: orderDetails.phone,
            shipping_is_billing: true,
            shipping_customer_name: req.user.name,
            shipping_last_name: "",
            shipping_address: orderDetails.address,
            shipping_address_2: "",
            shipping_city: orderDetails.city,
            shipping_pincode: orderDetails.pincode,
            shipping_country: "India",
            shipping_state: orderDetails.state,
            shipping_email: req.user.email,
            shipping_phone: orderDetails.phone,
            order_items: [
                {
                    name: orderDetails.productName,
                    sku: orderDetails.productName,
                    units: Number(orderDetails.units),
                    selling_price: orderDetails.price,
                    discount: "0",
                    tax: "0",
                    hsn: 768,
                },
            ],
            payment_method: orderDetails.paymentMethod,
            shipping_charges: 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: 0,
            sub_total: Number(orderDetails.price) * Number(orderDetails.units),
            length: Number(orderDetails.length),
            breadth: Number(orderDetails.breadth),
            height: Number(orderDetails.height),
            weight: Number(orderDetails.weight)
        }
        let data = JSON.stringify(orderData)
        const token = await getShiprocketToken();
        console.log(token)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: data
        };
        const shiprocketResponse = await axios.request(config)
        const shiprocketOrderId = shiprocketResponse.data.order_id;
        const order = new Order({
            orderId: shiprocketOrderId,
            createdBy: req.user,
            orderDetails:orderData
        });

        await order.save();
        res.status(201).json({ message: 'Order created successfully', success: true, order });
    } catch (err) {
        res.status(500).json({ message: 'Error creating order', success: false, error: err.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'createdBy.id': req.user.id });
        res.status(200).json({ success: true, orders });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', success: false, error: err.message });
    }
};

// Cancel an Order
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({ orderId: id });
        
        if (!order) return res.status(404).json({ message: 'Order not found', success: false });
        const token = await getShiprocketToken()
        const cancelResponse = await axios.post(`https://apiv2.shiprocket.in/v1/external/orders/cancel`, {
            ids: [order.orderId]
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(order)
        await Order.findByIdAndUpdate(order.id,{status:'cancelled'})
        res.status(200).json({ success: true, data: cancelResponse.data });
    } catch (err) {
        res.status(500).json({ message: 'Error canceling order', success: false, error: err.message });
    }
};

module.exports = { createOrder, getAllOrders, cancelOrder };
