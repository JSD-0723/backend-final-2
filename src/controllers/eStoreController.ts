import { Request, Response } from 'express'; // Assuming you're using Express
const createModels = require('../models/eStore')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const modelsMap = createModels();
const User = modelsMap['user']
const Categorie = modelsMap['categorie']
const Product = modelsMap['product']
const Brand = modelsMap['brand']
const cart=modelsMap['cart']
const key: any = process.env.tokenKey
const { Op, literal } = require('sequelize');


interface UserInformation {
  name: string,
  password: string,
  email: string
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
  User.findOne({ where: { name: userInformation.name }, attributes: ['password', 'id'] }).

    then((userinfo: any) => {
      console.log(userinfo)
      bcrypt.compare(userInformation.password, userinfo['password'], (err: any, result: any) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          // Handle the error, perhaps by sending an error response to the user
        } else if (result) {
          const Token = generateToken({ 'id': userinfo['id'] }, key)
          res.status(200).send(Token)

        } else {
          // Passwords don't match, deny access
          res.status(404).send('Password does not match');
          // You may want to send an error response or redirect the user to a login page
        }
      })
    })
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
    email: userInformation.email,
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
      ['id', 'img', 'short_description', 'price', 'name']
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
    attributes: ['id', 'img', 'name'],
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
    attributes: ['id','name','logo'],
  })
    .then((result: any) => {
      res.send(result);
    })
    .catch((error: any) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });
};
//###################################################################
export const viewCategoryName = (req: Request, res: Response) => {
  Categorie.findAll({
    attributes: ['id', 'name'],
    limit: 7,
  })
    .then((result: any) => {
      res.send(result);
    })
    .catch((error: any) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });

}
//#######################################################################
export const searchByBrandOrProductName = (req: Request, res: Response) => {
  const brandOrProductName = req.query.name;
  const page :any = parseInt(req.query.page as string) || 1;// Get the requested page or default to 1
  const limit = 10; // Number of results per page

  const offset = (page - 1) * limit;

  Product.findAndCountAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${brandOrProductName}%` } },
        { brand_name: { [Op.like]: `%${brandOrProductName}%` } },
      ],
    },
    attributes: ['id', 'img', 'name', 'price', 'short_description', 'rating'],
    limit: limit,
    offset: offset,
  })
    .then((result: any) => {
      const { count, rows } = result;
      const totalPages = Math.ceil(count / limit);

      if (page > totalPages) {
        return res.status(404).send('Page not found');
      }

      res.send({
        totalItems: count,
        totalPages: totalPages,
        currentPage: page,
        products: rows,
      });
    })
    .catch((error: any) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });
};

//####################################################################
export const viewProductBelongCategory = (req: Request, res: Response) => {
  const categoryName = req.query.name;
  const page :any = parseInt(req.query.page as string) || 1; // Extract page number from query parameter, default to 1
  const limit :any= parseInt(req.query.limit as string)|| 10; // Extract limit from query parameter, default to 10

  const offset = (page - 1) * limit;

  Product.findAndCountAll({
    where: {
      categorie_name: categoryName
    },
    attributes: ['id', 'img', 'name', 'price', 'short_description', 'rating'],
    limit: limit,
    offset: offset
  })
    .then((result: any) => {
      const { count, rows } = result;
      const totalPages = Math.ceil(count / limit);

      res.send({
        totalProducts: count,
        totalPages: totalPages,
        currentPage: page,
        products: rows
      });
    })
    .catch((error: any) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });
}
//#############################################################################
export const TopCategoriesFormobile = (req: Request, res: Response) => {
  Categorie.findAll({
    where: {
      mobile_img: {
        [Op.ne]: null // Check if 'mobile_img' is not equal to null
      }
    },
    attributes: ['id', 'name', 'mobile_img'],
    limit: 7,
  })
    .then((result: any) => {
      res.send(result);
    })
    .catch((error: any) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });

}
//#######################################################################
export const viewProductDetailById = (req: Request, res: Response) => {
  const productId = req.query.id
  Product.findOne({
    where: { id: productId },
    attributes: ['id', 'name', 'short_description', 'rating', 'price', 'img', 'description']
  }).then((result: any) => {
    res.send(result)
  }).catch((error: any) => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });

}
//##############################################################################################
export const viewRelatedProduct = (req: Request, res: Response) => {
  const productId = req.query.id;

  // Use Promises to handle the database queries
  Product.findOne({
    where: { id: productId },
    attributes: ['categoreiId','id'], // Corrected the attribute name
  })
    .then((product:any) => {
      if (!product) {
        res.status(404).send('Product not found');
      } else {
        return Product.findAll({
          where: { categoreiId: product['categoreiId'] ,id:{[Op.ne]:product['id']}},
          attributes: ['id', 'img', 'name', 'price', 'short_description', 'rating'],
        });
      }
    })
    .then((relatedProducts:any) => {
      res.send(relatedProducts);
    })
    .catch((error:any) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });
};
//#####################################################################################
export const addToCart = (req: Request, res: Response) => {
  const bearerToken :any=req.headers['authorization'];
  const Token = bearerToken.split(' ')[1];
  console.log(Token)
  try{
    const pylod=decodeToken(Token,key)
    var userId=pylod['id']

  }catch(err){
    res.status(505).send('unautorized')
  }
  const productId=req.body.productId
  cart.create({userId:userId,productId:productId}).then(
    res.status(200).send('add to cart successfully')
  ) .catch((error:any) => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });
  }
//###########################################################################################
export const viewProductBelongBrand = (req: Request, res: Response) => {
  const brandName = req.query.name;
  const page :any = parseInt(req.query.page as string) || 1; // Extract page number from query parameter, default to 1
  const limit :any= parseInt(req.query.limit as string)|| 10; // Extract limit from query parameter, default to 10

  const offset = (page - 1) * limit;

  Product.findAndCountAll({
    where: {
      brand_name: brandName
    },
    attributes: ['id', 'img', 'name', 'price', 'short_description', 'rating'],
    limit: limit,
    offset: offset
  })
    .then((result: any) => {
      const { count, rows } = result;
      const totalPages = Math.ceil(count / limit);

      res.send({
        totalProducts: count,
        totalPages: totalPages,
        currentPage: page,
        products: rows
      });
    })
    .catch((error: any) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });
}