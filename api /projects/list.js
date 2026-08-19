const {verify}=require("../../lib/auth");
const {loadDB}=require("../../lib/github");
module.exports=async(req,res)=>{
 try{const u=verify(req),db=await loadDB();res.json({projects:db.projects.filter(p=>p.userId===u.id).map(p=>({...p,url:`/api/site?path=${encodeURIComponent(`${u.id}/${p.slug}/index.html`)}`}))})}
 catch(e){res.status(401).json({error:e.message})}
};