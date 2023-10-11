import { Request, Response } from 'express'; // Assuming you're using Express
const createModels=require('../models/eStore')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt');
const modelsMap = createModels();
const User=modelsMap['user']
const key:any=process.env.tokenKey



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








