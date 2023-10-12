import { Request, Response } from 'express'; // Assuming you're using Express
const createModels=require('../models/eStore')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt');
const modelsMap = createModels();
const User=modelsMap['user']
const Categorie=modelsMap['categorie']
const Product=modelsMap['product']
const Brand =modelsMap['brand']
const key:any=process.env.tokenKey
const { Op, literal } = require('sequelize');


interface UserInformation{
  name:string,
  password:string,
  email:string
}


//############################# token process##############################
const generateToken = (payload: any, secret: string) => {
	const token = jwt.sign(payload, secret);
	return token;
}

const decodeToken = (token: string, secret: string) => {
	const decoded = jwt.verify(token, secret);
	return decoded;
}
// login ################################
export const login = (req: Request, res: Response) => {
  const userInformation: UserInformation = req.body;
  User.findOne({where:{name:userInformation.name},attributes: ['password','id']}).
 
  then((userinfo:any) => {
    console.log(userinfo)
    bcrypt.compare(userInformation.password, userinfo['password'], (err:any, result:any) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        // Handle the error, perhaps by sending an error response to the user
      } else if (result) {
        const Token=generateToken({'id':userinfo['id']},key)
        res.status(200).send(Token)
       
      } else {
        // Passwords don't match, deny access
        res.status(404).send('Password does not match');
        // You may want to send an error response or redirect the user to a login page
      }
    })})
    .catch((err: Error) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
};

// signup############################################################
export const createUser = (req: Request, res: Response) => {
  const userInformation: UserInformation = req.body;
  User.create({
    name: userInformation.name,
    password: userInformation.password,
    email:userInformation.email,
  })
    .then(() => res.status(200).send('user created'))
    .catch((err: Error) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
};
//############################################################################################
export const newArrival = (req: Request, res: Response) => {
  // Calculate a date three months ago
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
 console.log(threeMonthsAgo)


  // Use Sequelize or your database library to query for products created within the last three months
  Product.findAll({
    attributes:
      ['img','short_description','price','name']
    ,
    where: {
      createdAt: {
        [Op.gt]: threeMonthsAgo, // Less than three months ago
      },
    },
  })
    .then((result: any) => {
      res.send(result);
    })
    .catch((error: any) => {
      res.status(500).send('Error: ' + error);
    });
};
//#############################################################################
export const shopByCollection = (req: Request, res: Response) => {
  Categorie.findAll({
    attributes: ['img', 'name'],
  })
    .then((result: any) => {
      res.send(result);
    })
    .catch((error: any) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });
};
//############################################################################################
export const shopByBrand = (req: Request, res: Response) => {
  Brand.findAll({
    attributes: ['logo'],
  })
    .then((result: any) => {
      res.send(result);
    })
    .catch((error: any) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });
};