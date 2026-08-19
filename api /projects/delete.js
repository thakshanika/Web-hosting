const {verify}=require("../../lib/auth");
const {loadDB,saveDB}=require("../../lib/github");
module.exports=async(req,res)=>{
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 try{const u=verify(req),db=await loadDB(),id=req.body?.id,p=db.projects.find(x=>x.id===id&&x.userId===u.id);
 if(!p)return res.status(404).json({error:"Project not found"});
 db.projects=db.projects.filter(x=>x.id!==id);await saveDB(db);res.json({ok:true})}
 catch(e){res.status(500).json({error:e.message})}
};
