const defaultData = {
  name:"Your Name", role:"Student • Creator • Freelancer", email:"you@example.com",
  location:"Your location", github:"", linkedin:"",
  bio:"Add a short introduction about yourself, your interests, and the kind of opportunities you're looking for.",
  availability:"Open to internships, freelance projects & collaborations",
  skills:[
    {name:"Web Development",desc:"Responsive websites and clean front-end experiences."},
    {name:"UI & Design",desc:"Simple, accessible interfaces focused on clarity."},
    {name:"Creative Work",desc:"Research, content, presentations, and digital projects."}
  ],
  projects:[
    {name:"My First Project",type:"WEB",desc:"Describe what you built, the problem it solves, and what you learned.",tags:"HTML, CSS, JavaScript",url:""},
    {name:"Second Project",type:"APP",desc:"Add another project that demonstrates your skills or interests.",tags:"Design, JavaScript",url:""},
    {name:"Third Project",type:"CREATIVE",desc:"School, personal, volunteer, or freelance work can go here.",tags:"Research, Design",url:""}
  ]
};

let data = JSON.parse(localStorage.getItem("portfolioData") || "null") || defaultData;

const $ = id => document.getElementById(id);
const editor = $("editor");

function esc(s=""){
  return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function renderEditor(){
  $("name").value=data.name;$("role").value=data.role;$("email").value=data.email;
  $("location").value=data.location;$("github").value=data.github;$("linkedin").value=data.linkedin;
  $("bio").value=data.bio;$("availability").value=data.availability;

  $("skillsEditor").innerHTML=data.skills.map((s,i)=>`
    <div class="dynamic-row">
      <input data-skill-name="${i}" value="${esc(s.name)}" placeholder="Skill name">
      <input data-skill-desc="${i}" value="${esc(s.desc)}" placeholder="Short description">
      <button type="button" class="remove-btn" onclick="removeSkill(${i})">Remove</button>
    </div>`).join("");

  $("projectsEditor").innerHTML=data.projects.map((p,i)=>`
    <div class="project-row">
      <input data-p-name="${i}" value="${esc(p.name)}" placeholder="Project name">
      <input data-p-type="${i}" value="${esc(p.type)}" placeholder="Category e.g. WEB">
      <textarea data-p-desc="${i}" rows="2" placeholder="Project description">${esc(p.desc)}</textarea>
      <input data-p-tags="${i}" value="${esc(p.tags)}" placeholder="Tags separated by commas">
      <input data-p-url="${i}" value="${esc(p.url)}" placeholder="Project URL (optional)">
      <button type="button" class="remove-btn" onclick="removeProject(${i})">Remove project</button>
    </div>`).join("");
}

function renderPortfolio(){
  $("viewName").textContent=data.name || "Your Name";
  $("heroRole").textContent=(data.role || "Student • Creator • Freelancer").toUpperCase();
  $("viewBio").textContent=data.bio || "";
  $("aboutCopy").textContent=data.bio || "";
  $("viewLocation").textContent=data.location || "Your location";
  $("viewAvailability").textContent=data.availability || "Open to opportunities";
  $("footerName").textContent=data.name || "Your Name";
  const initials=(data.name||"YN").split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();
  $("initials").textContent=initials || "YN";

  const email=data.email || "you@example.com";
  $("emailBtn").href=`mailto:${email}`;$("contactEmail").href=`mailto:${email}`;$("contactEmail").textContent=`${email} ↗`;

  setLink("contactGithub",data.github,"GitHub ↗");
  setLink("contactLinkedin",data.linkedin,"LinkedIn ↗");

  $("skillsView").innerHTML=data.skills.map((s,i)=>`
    <article class="skill"><span class="skill-num">0${i+1}</span><h3>${esc(s.name)}</h3><p>${esc(s.desc)}</p></article>`).join("");

  $("projectsView").innerHTML=data.projects.map((p,i)=>`
    <article class="project">
      <div class="project-top"><span>0${i+1}</span><span>${esc(p.type||"PROJECT")}</span></div>
      <h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p>
      <div class="project-tags">${String(p.tags||"").split(",").map(t=>t.trim()).filter(Boolean).map(t=>`<span>${esc(t)}</span>`).join("")}</div>
      ${p.url ? `<a class="project-link" href="${esc(p.url)}" target="_blank" rel="noreferrer">View project ↗</a>` : ""}
    </article>`).join("");
}
function setLink(id,url,label){
  const el=$(id);el.textContent=label;
  if(url){el.href=url;el.target="_blank";el.rel="noreferrer";el.style.display="block";}
  else{el.href="#";el.removeAttribute("target");el.style.display="none";}
}
function collect(){
  data.name=$("name").value.trim();data.role=$("role").value.trim();data.email=$("email").value.trim();
  data.location=$("location").value.trim();data.github=$("github").value.trim();data.linkedin=$("linkedin").value.trim();
  data.bio=$("bio").value.trim();data.availability=$("availability").value.trim();
  data.skills=[...document.querySelectorAll("[data-skill-name]")].map((el,i)=>({name:el.value.trim(),desc:document.querySelector(`[data-skill-desc="${i}"]`).value.trim()})).filter(x=>x.name);
  data.projects=[...document.querySelectorAll("[data-p-name]")].map((el,i)=>({
    name:el.value.trim(),type:document.querySelector(`[data-p-type="${i}"]`).value.trim(),
    desc:document.querySelector(`[data-p-desc="${i}"]`).value.trim(),
    tags:document.querySelector(`[data-p-tags="${i}"]`).value.trim(),
    url:document.querySelector(`[data-p-url="${i}"]`).value.trim()
  })).filter(x=>x.name);
}
function openEditor(){editor.classList.remove("hidden");renderEditor();}
function closeEditor(){editor.classList.add("hidden");}
window.removeSkill=i=>{data.skills.splice(i,1);renderEditor()};
window.removeProject=i=>{data.projects.splice(i,1);renderEditor()};

$("portfolioForm").addEventListener("submit",e=>{
  e.preventDefault();collect();localStorage.setItem("portfolioData",JSON.stringify(data));renderPortfolio();closeEditor();
});
$("addSkill").addEventListener("click",()=>{collect();data.skills.push({name:"New skill",desc:"Describe what you can do."});renderEditor()});
$("addProject").addEventListener("click",()=>{collect();data.projects.push({name:"New project",type:"PROJECT",desc:"Describe your project.",tags:"",url:""});renderEditor()});
$("editBtn").addEventListener("click",openEditor);$("closeEditor").addEventListener("click",closeEditor);
$("printBtn").addEventListener("click",()=>window.print());
$("resetBtn").addEventListener("click",()=>{
  if(confirm("Reset your portfolio to the starter template?")){data=JSON.parse(JSON.stringify(defaultData));localStorage.removeItem("portfolioData");renderEditor();renderPortfolio();}
});

renderPortfolio();
openEditor();
