async function api(url,opt){const r=await fetch(url,opt);return [r,await r.json()]};
async function init(){const r=await fetch("/api/auth/me");if(!r.ok)return location.href="/login.html";const u=(await r.json()).user;hello.textContent="Hi, "+u.name;load()}
async function load(){const [r,d]=await api("/api/projects/list");if(!r.ok)return;projects.innerHTML=d.projects.length?d.projects.map(p=>`<article class="glass project"><h3>${esc(p.name)}</h3><div class="muted">${p.files.length} files</div><div class="muted">${new Date(p.createdAt).toLocaleString()}</div><div class="row"><a target="_blank" href="/api/site?path=${encodeURIComponent('x')}"> </a><a target="_blank" href="${p.url}">Open</a><button onclick="del('${p.id}')">Delete</button></div></article>`).join(""):`<div class="glass project"><h3>No projects yet</h3><p class="muted">Create your first static website.</p></div>`}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function openCreate(){create.showModal()}
async function createProject(){const fs=[{path:"index.html",content:html.value}];if(css.value.trim())fs.push({path:"style.css",content:css.value});if(js.value.trim())fs.push({path:"script.js",content:js.value});const [r,d]=await api("/api/projects/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:pname.value,files:fs})});if(r.ok){create.close();pname.value=html.value=css.value=js.value="";load()}else createMsg.textContent=d.error||"Deploy failed"}
async function del(id){if(!confirm("Delete this project?"))return;await api("/api/projects/delete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});load()}
async function logout(){await fetch("/api/auth/logout");location.href="/"}
init();

