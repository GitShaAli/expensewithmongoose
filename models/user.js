// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// //id, name , password, phone number, role

// const User = sequelize.define('user', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: Sequelize.STRING,
//     email: {
//        type:  Sequelize.STRING,
//        allowNull: false,
//        unique: true
//     },
//     password: Sequelize.STRING,
//     ispremiumuser: Sequelize.BOOLEAN
// })

// module.exports = User;
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  ispremiumuser: {
        type: Boolean,
        required: true
  },
  expense: {
    list: [
      {
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true }
      }
    ]
  },
  income: {
    list: [
      {
        description: { type: String, required: true },
        price: { type: Number, required: true },
      }
    ]
  }
});

userSchema.methods.addExpenses = function(des,price,cat){
    console.log("In addexp" + des);

    const userExpenses = [...this.expense.list];
    userExpenses.push({description:des,price:price,category:cat})
    const addedExpense = {
        list: userExpenses
    };
    this.expense = addedExpense;
    return this.save();
}

userSchema.methods.addIncome = function(des,price){

    const userIncome = [...this.income.list];
    userIncome.push({description:des,price:price})
    const addedIncome = {
        list: userIncome
    };
    this.income= addedIncome;
    return this.save();
}

userSchema.methods.isPremium = function(){
    const isprem=this.ispremiumuser;
    console.log("isprem : "+isprem);
    return isprem;
}

userSchema.methods.removeExpenses = function(id){
    const filterAllExpenses = this.expense.list.filter(item => {
        return item._id.toString() !== id.toString();
    });
    console.log("After filter : "+filterAllExpenses);
      this.expense.list = filterAllExpenses
      console.log(this.expense);
      return this.save();
}

module.exports = mongoose.model('User', userSchema);