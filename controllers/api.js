import User from '../models/user.js';

import responseToSend from '../data/data.js';


export const getAll = async (req, res) => {
    try {
      res.status(200).json({
        response: responseToSend
        });
    }
    catch(err){
        console.log(err);
    }
}

// export const addApi = async (req, res) => {
//     console.log('------------')
//     const id = req.params.id;
//     const {link} = req.query;
//     console.log(`id: ${id}`);
//     console.log(`link: ${link}`)


//      User.findById(id, (err, user)=>{
//         if(err)console.log( "err 0")
//         if(user){
//             const Apis = user.apis;
//             if(Apis.includes(link)){
//                 return res.status(200).json({success: false, message:'Already added'});
//             }
            
//         }
//     })


// try {
//      await User.updateOne(
//         { _id: id },
//         { $push: { apis: link }}, (err, response)=>{
//             if(err){ console.log("err 1");
//                 // return res.status(400).json({success: false, message: 'unexpected error occured', error: err.message})
//             }
//             else{
//                 return res.status(200).json({success: true, message:`${link} is added to list successfully`, response: response})
//             }

//         })
//     } catch (error) {
//         console.log('error 2')
//         return res.status(500).json({success: false, message: 'unexpected error occured', error: error.message})

        
// }

// }

export const addApi = async (req, res) => {
    try {
      const id = req.params.id;
      const { link } = req.query;
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(200).json({ success: false, message: 'User not found' });
      }
  
      if (user.apis.includes(link)) {
        return res.status(200).json({ success: false, isAlready: true, message: 'API already added' });
      }
  
      await User.updateOne(
        { _id: id },
        { $push: { apis: link }},
      );
  
      return res.status(200).json({ success: true, message: `${link} is added to list successfully` });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Unexpected error occurred', error: error.message });
    }
  };
  
export const deleteApi = async (req, res) =>{
 const id = req.params.id;
 const {link} = req.query;
//  console.log(`id: ${id}`);

    User.updateOne(
      { _id: id },
      { $pull: { apis: link }}, (err, response)=>{
          if(err){ console.log(err);
              return res.status(200).json({success: false, message: 'unexpected error occured', error: err.message})
          }
          else if(response){
            User.findOne({ _id: id }, (err, user) => {
              if (err) {
                console.log(err);
                return res.status(200).json({ success: false, message: 'unexpected error occured', error: err.message });
              }
              else {
                // console.log(user.apis);
                return res.status(200).json({ success: true, message: `${link} is removed from list successfully`, response: user.apis });
              }
            });
          }
          else{
              // console.log('link not found')
          }

      })


}

export const getAddedApis = async (req, res)=>{

    const id = req.params.id;
    const {link} = req.query;
    // console.log(`id: ${id}`);
  
  User.findById(id, (err, user)=>{
    if(err){
       return res.status(200).json({
          success:false,
          message:"some error"
        })
      }else{

        return res.status(200).json({
          success:true,
          message:"apis fetched successfully",
          apis:user.apis
        })
      }
      });

}