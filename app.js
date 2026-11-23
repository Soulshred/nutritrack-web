const KEY="nutritrack_local_v1";
const defaults={goals:{calories:2300,protein:130,carbs:250,fat:75},days:{},weights:[]};
let db=loadDB(), selectedDate=localDate(), editingId=null;
const $=id=>document.getElementById(id);
function localDate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function loadDB(){try{return {...structuredClone(defaults),...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return structuredClone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function dayData(){return db.days[selectedDate]||(db.days[selectedDate]={foods:[]})}
function n(v){return Number(v)||0}
function fmt(v){return Number(v.toFixed(1)).toString()}
function render(){
  $("dayPicker").value=selectedDate;
  const foods=dayData().foods;
  const totals=foods.reduce((a,f)=>{["calories","protein","carbs","fat"].forEach(k=>a[k]+=n(f[k]));return a},{calories:0,protein:0,carbs:0,fat:0});
  $("calories").textContent=Math.round(totals.calories);
  $("protein").textContent=fmt(totals.protein);$("carbs").textContent=fmt(totals.carbs);$("fat").textContent=fmt(totals.fat);
  const g=db.goals, rem=g.calories-totals.calories;
  $("remaining").textContent=rem>=0?`${Math.round(rem).toLocaleString("es-CL")} restantes`:`${Math.abs(Math.round(rem)).toLocaleString("es-CL")} sobre objetivo`;
  $("calorieGoalLabel").textContent=`${Math.round(totals.calories).toLocaleString("es-CL")} / ${g.calories.toLocaleString("es-CL")} kcal`;
  $("calorieBar").style.width=Math.min(100,totals.calories/g.calories*100)+"%";
  [["protein",g.protein],["carbs",g.carbs],["fat",g.fat]].forEach(([k,goal])=>$(k+"Bar").style.width=(goal?Math.min(100,totals[k]/goal*100):0)+"%");
  const groups=["Desayuno","Almuerzo","Once","Cena","Snack"];
  $("mealList").innerHTML=foods.length?groups.map(group=>{
    const arr=foods.filter(f=>f.meal===group);if(!arr.length)return "";
    const sum=arr.reduce((s,f)=>s+n(f.calories),0);
    return `<article class="meal-group"><div class="meal-group-head"><strong>${group}</strong><span>${Math.round(sum)} kcal</span></div>${arr.map(f=>`<div class="food-row"><div class="food-info"><strong>${esc(f.name)}</strong><small>${fmt(n(f.protein))} g proteína · ${Math.round(n(f.calories))} kcal</small></div><span class="food-kcal">${Math.round(n(f.calories))}</span><button class="mini-action" data-edit="${f.id}" aria-label="Editar">✎</button><button class="mini-action" data-delete="${f.id}" aria-label="Eliminar">×</button></div>`).join("")}</article>`;
  }).join(""):`<div class="empty">Todavía no hay alimentos registrados para este día.<br>Presiona «Añadir alimento» para comenzar.</div>`;
  const latest=[...db.weights].sort((a,b)=>b.date.localeCompare(a.date))[0];
  $("latestWeight").innerHTML=latest?`${fmt(latest.value)} <small>kg</small>`:'— <small>kg</small>';
  $("weightDate").textContent=latest?`Registrado el ${new Date(latest.date+"T12:00:00").toLocaleDateString("es-CL")}`:"Registra tu peso para comenzar";
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function openFood(food=null){
  editingId=food?.id||null;$("foodTitle").textContent=food?"Editar alimento":"Añadir alimento";
  $("foodName").value=food?.name||"";$("mealType").value=food?.meal||"Desayuno";
  $("foodCalories").value=food?.calories??"";$("foodProtein").value=food?.protein??0;$("foodCarbs").value=food?.carbs??0;$("foodFat").value=food?.fat??0;
  $("foodDialog").showModal();
}
$("foodForm").addEventListener("submit",e=>{e.preventDefault();const f={id:editingId||crypto.randomUUID(),name:$("foodName").value.trim(),meal:$("mealType").value,calories:n($("foodCalories").value),protein:n($("foodProtein").value),carbs:n($("foodCarbs").value),fat:n($("foodFat").value)};
  const arr=dayData().foods,idx=arr.findIndex(x=>x.id===editingId);if(idx>=0)arr[idx]=f;else arr.push(f);save();$("foodDialog").close();render()});
$("mealList").addEventListener("click",e=>{const edit=e.target.dataset.edit,del=e.target.dataset.delete;if(edit){const f=dayData().foods.find(x=>x.id===edit);openFood(f)}if(del&&confirm("¿Eliminar este alimento?")){dayData().foods=dayData().foods.filter(x=>x.id!==del);save();render()}});
$("addBtn").onclick=()=>openFood();
$("dayPicker").onchange=e=>{selectedDate=e.target.value||localDate();render()};
$("goalBtn").onclick=()=>{$("goalCalories").value=db.goals.calories;$("goalProtein").value=db.goals.protein;$("goalCarbs").value=db.goals.carbs;$("goalFat").value=db.goals.fat;$("goalDialog").showModal()};
$("goalForm").addEventListener("submit",e=>{e.preventDefault();db.goals={calories:n($("goalCalories").value)||2300,protein:n($("goalProtein").value),carbs:n($("goalCarbs").value),fat:n($("goalFat").value)};save();$("goalDialog").close();render()});
$("weightBtn").onclick=()=>$("weightDialog").showModal();
$("weightForm").addEventListener("submit",e=>{e.preventDefault();db.weights.push({date:selectedDate,value:n($("weightValue").value)});save();$("weightDialog").close();$("weightValue").value="";render()});
$("backupBtn").onclick=()=>$("backupDialog").showModal();
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`nutritrack-backup-${localDate()}.json`;a.click();URL.revokeObjectURL(url)};
$("importFile").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const imported=JSON.parse(await file.text());if(!imported.goals||!imported.days||!Array.isArray(imported.weights))throw Error();if(!confirm("Esto reemplazará tus datos actuales. ¿Continuar?"))return;db=imported;save();render();$("backupDialog").close();alert("Copia importada correctamente.")}catch{alert("No se pudo importar. Verifica que sea una copia de NutriTrack válida.")}e.target.value=""};
$("navMeals").onclick=e=>{e.preventDefault();$("addBtn").scrollIntoView({behavior:"smooth",block:"center"})};
$("navWeight").onclick=e=>{e.preventDefault();$("weightBtn").scrollIntoView({behavior:"smooth",block:"center"})};
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
