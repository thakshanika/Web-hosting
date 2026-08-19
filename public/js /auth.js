async function post(url,data){const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});return [r,await r.json()]};
async function login(){const [r,d]=await post("/api/auth/login",{email:email.value,password:password.value});if(r.ok)location.href="/dashboard.html";else msg.textContent=d.error||"Login failed"}
async function register(){const [r,d]=await post("/api/auth/register",{name:name.value,email:email.value,password:password.value});if(r.ok)location.href="/dashboard.html";else msg.textContent=d.error||"Registration failed"}

