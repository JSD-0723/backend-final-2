import {Router} from 'express'
import express from 'express'
const eStoreController=require('../controllers/eStoreController');

const router: Router = express.Router();
router.post('/login',eStoreController.login)//login router 
router.post('/signUP',eStoreController.createUser)//signup router 
router.get('/shopByBrand',eStoreController.shopByBrand)
router.get('/shopByCollection',eStoreController.shopByCollection)
router.get('/newArrival',eStoreController.newArrival)
router.get('/viewCategoryName',eStoreController.viewCategoryName)
router.get('/searchProduct',eStoreController.searchByBrandOrProductName)
router.get('/viewProductByCategory',eStoreController.viewProductBelongCategory)
router.get('/TopCategories',eStoreController.TopCategoriesFormobile)
router.get('/productDetail',eStoreController.viewProductDetailById)
router.get('/viewRelatedProduct',eStoreController.viewRelatedProduct)
export default router;

