import Product from "../models/product.js";

export async function getProducts(req, res) {
    try {
        if (isAdmin(req)) {
            Product.find().then((data) => {
                res.json(data);
            })
        } else {
            const products = await Product.find({ isAvailable: true })
            res.json(products)

        }
    } catch (err) {
        res.json({
            message: "You need to be loged in",
            error: err
        })
    }

}

export function saveProduct(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Product can only aded by an admin"
        })
        return;
    }

    const product = new Product(
        {
            productId: req.body.productId,
            name: req.body.name,
            altName: req.body.altName,
            description: req.body.description,
            images: req.body.images,
            labelledPrice: req.body.labelledPrice,
            price: req.body.price,
            stock: req.body.stock,
            isAvailable: req.body.isAvailable
        }
        //  req.body
    );



    product.save().then(() => {
        res.json({
            message: "product have saved",
        });
    }).catch((e) => {
        res.status(500).json({
            message: e.message,
        });
    })

};

export async function deleteProduct(req, res) {


    if (isAdmin(req)) {

        // This code block is for getting the product id in request body
        // const product = await Product.findOne({ productId: req.body.productId })

        // if (product) {
        //     const result = await Product.deleteOne({ productId: req.body.productId })
        //     res.json({
        //         message: req.body.productId + " has deleted",
        //         result: result
        //     })
        // } else {
        //     res.status(500).json({
        //         message: req.body.productId + " product not found",
        //     })
        // }
        const product = await Product.findOne({ productId: req.params.productId })

        if (product) {
            const result = await Product.deleteOne({ productId: req.params.productId })
            res.json({
                message: req.params.productId + " has deleted",
                result: result
            })
        } else {
            res.status(500).json({
                message: req.params.productId + " product not found",
            })
        }
    } else {
        res.json({
            message: "You need to be an admin to delete product"
        })
    }
}

export async function updateProduct(req, res) {

    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Only admins can update the product"
        })
        return;
    }
    const result = await Product.findOneAndUpdate({ productId: req.params.productId },
        req.body,
        { new: true })
    res.json({ result: result })
}

export async function getProduct(req, res) {
    const product = await Product.findOne({ productId: req.params.productId })
    if (product) {
        if(product.isAvailable){
            res.json(product)
            return
        }else {
            if(!isAdmin(req)){
                res.status(404).json({
                    message:"No product found"
                })
            }else {
                res.status(200).json(product)
            }
        }
    } else {
        res.status(404).json({
            message: "No product to show for relevent product id"
        })
    }
}


export function isAdmin(req) {
    if (req.user == null) {
        return false
    }
    if (req.user.role != "admin") {
        return false
    }
    return true;
}