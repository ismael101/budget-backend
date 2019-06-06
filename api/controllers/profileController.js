const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/users')

exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              "IU3BRF8OIBW8YDBC9UIWEDHC80429H",
              {
                expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };
exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.profileid })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.get_all_bills = (req, res ,next) => {
    const profileid = req.params.profileid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        let bills = []
        let counter = 0
        user.bills.forEach(element => {
            bills[counter] = element
            counter++
        })
        res.status(200).json(bills)
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })

}
exports.create_bill = (req, res, next) => {
    const userid = req.params.profileid
    let bill = {
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        for: req.body.for,
        amount: req.body.amount,
        due: req.body.due,
        paid:req.body.paid
    }
    User.findOne({_id:userid})
    .exec()
    .then(user => {
        user.bills.push(bill)
        user.save(function(err){
            if(err) return handleError(err)
            console.log('object created')
        })
        res.status(201).json({
            message:'Bill Created',
            bill:bill
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })
}
exports.get_specific_bill = (req,res,next) => {
    const profileid = req.params.profileid
    const billid = req.params.billid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        bill = user.bills.id(billid)
        if(bill){
        res.status(200).json({
            message:'Bill Fetched',
            bill:bill
        })  
        }
        else{
        res.status(404).json({
            message:'Bill Doesnt Exist',   
        })

        }
        
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })

}

exports.update_bill = (req,res,next) => {
    const profileid = req.params.profileid
    const billid = req.params.billid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        user.bills.id(billid).set(req.body)
        user.save(function(err){
            if(err) return handleError(err);
        })
        res.status(200).json({
            message:'Bill updated',
        })
    })

}

exports.delete_bill = (req,res,next) => {
    const profileid = req.params.profileid
    const billid = req.params.billid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        user.bills.id(billid).remove()
        user.save(function(err){
            if(err) return handleError(err);
        })
        res.status(200).json({
            message:'Bill Deleted',
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })
}

exports.get_all_income = (req, res ,next) => {
    const profileid = req.params.profileid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        let income = []
        let counter = 0
        user.income.forEach(element => {
            bills[counter] = element
            counter++
        })
        res.status(200).json(income)
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })

}

exports.create_income = (req, res, next) => {
    const profileid = req.params.profileid
    let income = {
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        from: req.body.from,
        amount: req.body.amount,
        date: req.body.date,
    }
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        user.income.push(income)
        user.save(function(err){
            if(err) return handleError(err)
            console.log('object created')
        })
        res.status(201).json({
            message:'Income Created',
            income:income
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })
}

exports.get_specific_income = (req,res,next) => {
    const profileid = req.params.profileid
    const incomeid = req.params.incomeid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        income = user.income.id(incomeid)
        if(income){
        res.status(200).json({
            message:'Income Fetched',
            income:income
        })  
        }
        else{
        res.status(404).json({
            message:'Income Doesnt Exist',   
        })

        }
        
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })

}

exports.update_income = (req,res,next) => {
    const profileid = req.params.profileid
    const incomeid = req.params.incomeid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        user.income.id(incomeid).set(req.body)
        user.save(function(err){
            if(err) return handleError(err);
        })
        res.status(200).json({
            message:'Income updated',
        })
    })

}

exports.delete_income = (req,res,next) => {
    const profileid = req.params.profileid
    const incomeid = req.params.incomeid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        user.income.id(incomeid).remove()
        user.save(function(err){
            if(err) return handleError(err);
        })
        res.status(200).json({
            message:'Income Deleted',
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })
}

exports.get_all_savings = (req, res ,next) => {
    const profileid = req.params.profileid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        let savings = []
        let counter = 0
        user.savings.forEach(element => {
            savings[counter] = element
            counter++
        })
        res.status(200).json(savings)
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })

}

exports.create_savings = (req, res, next) => {
    const profileid = req.params.profileid
    let saving = {
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        amount: req.body.amount,
        date: req.body.date,
    }
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        user.savings.push(saving)
        user.save(function(err){
            if(err) return handleError(err)
            console.log('object created')
        })
        res.status(201).json({
            message:'Saving Created',
            saving:savings
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })
}

exports.get_specific_savings = (req,res,next) => {
    const profileid = req.params.profileid
    const savingsid = req.params.savingsid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        saving = user.savings.id(savingsid)
        if(saving){
        res.status(200).json({
            message:'Saving Fetched',
            saving:saving
        })  
        }
        else{
        res.status(404).json({
            message:'Saving Doesnt Exist',   
        })

        }
        
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })

}

exports.update_savings = (req,res,next) => {
    const profileid = req.params.profileid
    const savingsid = req.params.savingsid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        user.savings.id(savingsid).set(req.body)
        user.save(function(err){
            if(err) return handleError(err);
        })
        res.status(200).json({
            message:'Savings updated',
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })

}

exports.delete_savings = (req,res,next) => {
    const profileid = req.params.profileid
    const savingsid = req.params.savingsid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        user.savings.id(savingsid).remove()
        user.save(function(err){
            if(err) return handleError(err);
        })
        res.status(200).json({
            message:'Savings Deleted',
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })
}

exports.get_all_expenses = (req, res ,next) => {
    const profileid = req.params.profileid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        let expenses = []
        let counter = 0
        user.expenses.forEach(element => {
            expenses[counter] = element
            counter++
        })
        res.status(200).json(expenses)
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })

}

exports.create_expenses = (req, res, next) => {
    const profileid = req.params.profileid
    let expenses = {
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        for:req.body.for,
        amount: req.body.amount,
        date: req.body.date,
    }
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        user.expenses.push(expenses)
        user.save(function(err){
            if(err) return handleError(err)
            console.log('object created')
        })
        res.status(201).json({
            message:'Expenses Created',
            expenses:expenses
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })
}

exports.get_specific_expenses = (req,res,next) => {
    const profileid = req.params.profileid
    const expensesid = req.params.expensesid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        saving = user.expenses.id(expensesid)
        if(saving){
        res.status(200).json({
            message:'Expenses Fetched',
            expenses:expenses
        })  
        }
        else{
        res.status(404).json({
            message:'Expenses Doesnt Exist',   
        })

        }
        
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })

}

exports.update_expenses = (req,res,next) => {
    const profileid = req.params.profileid
    const expensesid = req.params.expensesid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        user.expenses.id(expensesid).set(req.body)
        user.save(function(err){
            if(err) return handleError(err);
        })
        res.status(200).json({
            message:'Expenses updated',
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })

}

exports.delete_expenses = (req,res,next) => {
    const profileid = req.params.profileid
    const expensesid = req.params.expensesid
    User.findOne({_id:profileid})
    .exec()
    .then(user => {
        user.expenses.id(expensesid).remove()
        user.save(function(err){
            if(err) return handleError(err);
        })
        res.status(200).json({
            message:'Expenses Deleted',
        })
    })
    .catch(err => {
        res.status(500).json({
            message:'Error Occured',
            error:err
        })
    })
}