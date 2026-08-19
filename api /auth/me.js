const {verify}=require("../../lib/auth");
module.exports=(req,res)=>{try{res.json({ok:true,user:verify(req)})}catch(e){res.status(401).json({error:"Not authenticated"})}};
