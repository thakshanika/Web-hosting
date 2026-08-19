const bcrypt=require("bcryptjs");
const crypto=require("crypto");
const {loadDB,saveDB}=require("../../lib/github");
const {sign,setSession}=require("../../lib/auth");

module.exports=async(req,res)=>{
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  try{
    const {name,email,password}=req.body||{};
    if(!name||!email||!password||password.length<6) return res.status(400).json({error:"Name, valid email and 6+ character password required"});
    const db=await loadDB(), e=email.toLowerCase().trim();
    if(db.users.some(u=>u.email===e)) return res.status(409).json({error:"Email already registered"});
    const user={id:crypto.randomUUID(),name:name.trim(),email:e,password:await bcrypt.hash(password,10),createdAt:new Date().toISOString()};
    db.users.push(user); await saveDB(db);
    setSession(res,sign(user)); res.json({ok:true,user:{id:user.id,name:user.name,email:user.email}});
  }catch(e){res.status(500).json({error:e.message})}
};
