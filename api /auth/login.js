const bcrypt=require("bcryptjs");
const {loadDB}=require("../../lib/github");
const {sign,setSession}=require("../../lib/auth");

module.exports=async(req,res)=>{
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  try{
    const {email,password}=req.body||{}, db=await loadDB();
    const user=db.users.find(u=>u.email===(email||"").toLowerCase().trim());
    if(!user || !(await bcrypt.compare(password||"",user.password))) return res.status(401).json({error:"Invalid email or password"});
    setSession(res,sign(user)); res.json({ok:true,user:{id:user.id,name:user.name,email:user.email}});
  }catch(e){res.status(500).json({error:e.message})}
};
