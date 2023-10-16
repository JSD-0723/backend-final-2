import { Sequelize, DataTypes } from 'sequelize';
const dotenv = require('dotenv')
const bcrypt = require('bcrypt');
dotenv.config()
const host = process.env.host;
const databaseName = process.env.databaseName;
const useName = process.env.useName || 'root';
const password = process.env.password;
const databasePort = process.env.databasePort;


function createModels() {
  const sequelize = new Sequelize({
    password: password,
    database: databaseName,
    username: useName,
    host,
    port: parseInt(databasePort!),
    dialect: 'mysql',
  });

  console.log(password)

  // create user model
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
    ,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(password) {
        // Hash the password before setting it
        const saltRounds = 10;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        this.setDataValue('password', hashedPassword);
      }
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },

    },

  }, {
    timestamps: false,
    freezeTableName: true
  }
  )

  // create user role model 
  const user_role = sequelize.define('user_role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    timestamps: false
  })

  //create wish list model
  const wish_list = sequelize.define("wish_list", {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true
    },
  })

  // create review model
  const review = sequelize.define("review", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },

  })

  const rating = sequelize.define('rating', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true
    }
    ,
    rating: {
      type: DataTypes.STRING,
      allowNull: false,

    },

  })

  const product = sequelize.define('product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
    ,
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
    ,
    short_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    brand_name:{
      type:DataTypes.STRING,
      allowNull:true
    }
    ,
    categorie_name:{
      type:DataTypes.STRING,
      allowNull:true
    }

  }
  )

  const brand = sequelize.define('brand', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false

    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: false
  })

  const categorie = sequelize.define('categorei', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: false
  }
  )

  //relation 
  user_role.hasMany(User)
  User.belongsTo(user_role)
  User.hasOne(wish_list)
  wish_list.belongsTo(User)
  User.hasMany(review)
  review.belongsTo(User)
  User.hasMany(rating)
  rating.belongsTo(User)
  wish_list.hasMany(product)
  product.belongsTo(wish_list)
  product.hasMany(review)
  review.belongsTo(product)
  product.hasMany(rating)
  rating.belongsTo(product)
  brand.hasMany(product)
  product.belongsTo(brand)
  categorie.hasMany(product)
  product.belongsTo(categorie)


  sequelize.sync({ alter: true })
    .then(() => {
      console.log('Tables created');
    })
    .catch((error) => {
      console.error(error);
    });

  return {
    'user': User, 'userRole': user_role,
    'wishList': wish_list, 'review': review, 'rating': rating,
    'product': product, 'categorie': categorie, 'brand': brand
  };
}


module.exports = createModels;
