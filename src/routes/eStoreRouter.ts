import {Router} from 'express'
import express from 'express'
const bookController=require('../controllers/eStoreController');

const router: Router = express.Router();
router.post('/login',bookController.login)//login router 
router.post('/signUP',bookController.createUser)//signup router 
export default router;

