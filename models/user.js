import mongoose from "mongoose";

 const userSchema = new mongoose.Schema({
   email: {
     type: String,
     unique: true,
     required: true
    }, 
   name: {
     type: String,
     required: true
    },
   password: {
     type: String,
     required: true
    },
    apis: [{
      type: String
    }]
  },
 {
  collection: 'users'
  });

 const User = mongoose.model('User', userSchema); 
  export default User;