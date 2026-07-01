import Order from "../models/order.js"
import Product from '../models/product.js'
// get user information
// generate the order id like 'CBC0001'
// add current user name if not provided 
// orderId generate
// create order object


export async function createOrder(req, res) {

    if (req.user == null) {
        res.status(403).json({
            message: "Please log in first "
        })
        return
    }

    const orderInfo = req.body

    if (orderInfo.name == null) {
        orderInfo.name = req.user.firstName + " " + req.user.lastName
    }

    let orderId = 'CBC0001';

    // const lastOrder = await Order.find().sort({ date: -1 }).limit(1)
    const lastOrder = await Order.findOne().sort({ date: -1 })

    if (lastOrder) {
        const lastOrderId = lastOrder.orderId;
        const orderNumberInString = lastOrderId.replace("CBC", "");
        let orderNumber = parseInt(orderNumberInString);
        orderNumber++;
        const padNumber = orderNumber.toString().padStart(4, "0")
        orderId = "CBC" + padNumber;
    }



    try {
        let total = 0
        let totalLabelledPrice = 0
        let products = []


        for (let i = 0; i < orderInfo.products.length; i++) {
            const item = await Product.findOne({ productId: orderInfo.products[i].productId })
            // if (item) {
            //     if (item.isAvailable) {
            //         total = total + (item.price*orderInfo.products[i].qty)
            //         totalLabelledPrice += (item.labelledPrice * orderInfo.products[i].qty)
            //         products[i]= item;
            //     console.log("products===>",products)
                
            //     } 
                // else {
            //         res.json({
            //             message:"That product is not available now"
            //         })
            //         return
            //     }

            // } 
            // else {
            //     res.status(403).json({
            //         message: "No product in that that id"
            //     })
            //     return
            // }

            if (item == null) {
                return res.json({
                    message: "The product" + orderInfo.products[i].productId + "is not available"
                })
            }

            if (!item.isAvailable) {
                return res.status(403).json({
                    message: "The product is currently not available"
                })
            }

            products[i] = {
                productInfo: {
                    productId: item.productId,
                    name: item.name,
                    altName: item.altName,
                    description: item.description,
                    images: item.images,
                    labelledPrice: item.labelledPrice,
                    price: item.price
                },
                quantity: orderInfo.products[i].qty
            }

            total += (item.price * orderInfo.products[i].qty)
            totalLabelledPrice += (item.labelledPrice * orderInfo.products[i].qty)
        }

        const order = new Order({
            orderId: orderId,
            email: req.user.email,
            name: orderInfo.name,
            phone: req.body.phone,
            address: req.body.address,
            products: products,
            total: total,
            totalLabelledPrice: totalLabelledPrice,
        })


        const createdOrder = await order.save()
        res.json({
            message: "order created successfuly",
            order: createdOrder
        })

    } catch (err) {
        res.status(403).json({
            err: err
        })
    }

}