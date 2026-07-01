import express from 'express'
import { getProducts, saveProduct, deleteProduct, updateProduct, getProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/', getProducts);
productRouter.post('/', saveProduct);
productRouter.delete('/', deleteProduct);
productRouter.delete('/:productId', deleteProduct);
productRouter.put('/:productId', updateProduct);
productRouter.get('/:productId', getProduct);




export default productRouter;