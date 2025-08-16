const PostModel = require("../models/post-model");
// Cette handler function pour recuperer les posts qui sont la base de donner
const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({});
    res.status(200).json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
const updatePost = async(req,res)=>{
  try{
    //PostModel.up
  }catch(error){

  }
}
module.exports= getPosts;