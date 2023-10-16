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
export default router;

