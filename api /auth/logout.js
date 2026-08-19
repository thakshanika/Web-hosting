const {clearSession}=require("../../lib/auth");
module.exports=(req,res)=>{clearSession(res);res.json({ok:true})};
