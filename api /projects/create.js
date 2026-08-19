const crypto=require("crypto");
const {verify}=require("../../lib/auth");
const {loadDB,saveDB,putFile,projectRepo}=require("../../lib/github");

function safe(s){return String(s||"").toLowerCase().replace(/[^a-z0-9-]/g,"-").replace(/^-+|-+$/g,"").slice(0,40)||"site";}
module.exports=async(req,res)=>{
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 try{
  const u=verify(req), {name,files}=req.body||{};
  if(!name||!Array.isArray(files)||!files.length)return res.status(400).json({error:"Project name and files required"});
  if(files.length>30)return res.status(400).json({error:"Maximum 30 files"});
  const db=await loadDB(), slug=safe(name)+"-"+crypto.randomBytes(3).toString("hex");
  const project={id:crypto.randomUUID(),userId:u.id,name:String(name).slice(0,60),slug,files:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  for(const f of files){
   if(!f.path||typeof f.content!=="string")continue;
   const path=(`${u.id}/${slug}/${f.path}`).replace(/\.\./g,"");
   if(path.length>180)continue;
   await putFile(projectRepo(),path,f.content,`Deploy ${slug}: ${f.path}`);
   project.files.push(f.path);
  }
  if(!project.files.includes("index.html"))return res.status(400).json({error:"index.html is required"});
  db.projects.push(project);await saveDB(db);
  res.json({ok:true,project:{...project,userId:undefined,url:`/api/site?path=${encodeURIComponent(`${u.id}/${slug}/index.html`)}`}});
 }catch(e){res.status(500).json({error:e.message})}
};
