const {readText,projectRepo}=require("../lib/github");
module.exports=async(req,res)=>{
 try{
  const raw=req.query.path||"";
  const parts=raw.split("/").filter(Boolean);
  if(parts.length<3)return res.status(404).send("Not found");
  const [userId,slug,...rest]=parts, file=rest.join("/")||"index.html";
  const text=await readText(projectRepo(),`${userId}/${slug}/${file}`);
  const ext=file.split(".").pop().toLowerCase();
  const types={html:"text/html; charset=utf-8",css:"text/css; charset=utf-8",js:"application/javascript; charset=utf-8",json:"application/json",svg:"image/svg+xml",txt:"text/plain"};
  res.setHeader("Content-Type",types[ext]||"text/plain; charset=utf-8");res.send(text);
 }catch(e){res.status(404).send("File not found")}
};