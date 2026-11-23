const KEY="nutritrack_local_v1";
const defaults={goals:{calories:2300,protein:130,carbs:250,fat:75},days:{},weights:[],catalog:[]};
let db=loadDB(), selectedDate=localDate(), selectedCatalogFood=null;
const $=id=>document.getElementById(id);
function localDate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function loadDB(){try{const stored=JSON.parse(localStorage.getItem(KEY)||"{}");return {...structuredClone(defaults),...stored,catalog:Array.isArray(stored.catalog)?stored.catalog:[]}}catch{return structuredClone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(db))}
function dayData(){return db.days[selectedDate]||(db.days[selectedDate]={foods:[]})}
function n(v){return Number(v)||0}
function fmt(v){return Number(v.toFixed(1)).toString()}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function totalsFor(foods){return foods.reduce((a,f)=>{["calories","protein","carbs","fat"].forEach(k=>a[k]+=n(f[k]));return a},{calories:0,protein:0,carbs:0,fat:0})}
function render(){
  $("dayPicker").value=selectedDate;
  const foods=dayData().foods, totals=totalsFor(foods), g=db.goals, rem=g.calories-totals.calories;
  $("calories").textContent=Math.round(totals.calories);$("protein").textContent=fmt(totals.protein);$("carbs").textContent=fmt(totals.carbs);$("fat").textContent=fmt(totals.fat);
  $("remaining").textContent=rem>=0?`${Math.round(rem).toLocaleString("es-CL")} restantes`:`${Math.abs(Math.round(rem)).toLocaleString("es-CL")} sobre objetivo`;
  $("calorieGoalLabel").textContent=`${Math.round(totals.calories).toLocaleString("es-CL")} / ${g.calories.toLocaleString("es-CL")} kcal`;
  $("calorieBar").style.width=Math.min(100,totals.calories/g.calories*100)+"%";
  [["protein",g.protein],["carbs",g.carbs],["fat",g.fat]].forEach(([k,goal])=>$(k+"Bar").style.width=(goal?Math.min(100,totals[k]/goal*100):0)+"%");
  const groups=["Desayuno","Almuerzo","Once","Cena","Snack"];
  $("mealList").innerHTML=foods.length?groups.map(group=>{const arr=foods.filter(f=>f.meal===group);if(!arr.length)return "";const sum=arr.reduce((s,f)=>s+n(f.calories),0);return `<article class="meal-group"><div class="meal-group-head"><strong>${group}</strong><span>${Math.round(sum)} kcal</span></div>${arr.map(f=>`<div class="food-row"><div class="food-info"><strong>${esc(f.name)}</strong><small>${fmt(n(f.grams))} g · ${fmt(n(f.protein))} g proteína · ${Math.round(n(f.calories))} kcal</small></div><span class="food-kcal">${Math.round(n(f.calories))}</span><button class="mini-action" data-delete="${f.id}" aria-label="Eliminar">×</button></div>`).join("")}</article>`}).join(""):`<div class="empty">Todavía no hay alimentos registrados para este día.<br>Busca un alimento en tu catálogo o crea uno nuevo.</div>`;
  const latest=[...db.weights].sort((a,b)=>b.date.localeCompare(a.date))[0];
  $("latestWeight").innerHTML=latest?`${fmt(latest.value)} <small>kg</small>`:'— <small>kg</small>';
  $("weightDate").textContent=latest?`Registrado el ${new Date(latest.date+"T12:00:00").toLocaleDateString("es-CL")}`:"Registra tu peso para comenzar";
  renderStats();
}
function renderStats(){
  const last7=[];for(let i=6;i>=0;i--){const d=new Date(`${selectedDate}T12:00:00`);d.setDate(d.getDate()-i);const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;const foods=db.days[key]?.foods||[];last7.push({key,label:d.toLocaleDateString("es-CL",{weekday:"short"}).replace(".",""),...totalsFor(foods),has:foods.length>0})}
  const recorded=last7.filter(d=>d.has), avg=recorded.length?recorded.reduce((s,d)=>s+d.calories,0)/recorded.length:0, avgP=recorded.length?recorded.reduce((s,d)=>s+d.protein,0)/recorded.length:0;
  $("avgCalories").textContent=recorded.length?`${Math.round(avg).toLocaleString("es-CL")} kcal`:"—";
  $("avgProtein").textContent=recorded.length?`${fmt(avgP)} g`:"—";
  const max=Math.max(db.goals.calories,...last7.map(d=>d.calories),1);
  $("weeklyBars").innerHTML=last7.map(d=>`<div class="bar-day"><div class="bar-track"><i style="height:${d.has?Math.max(4,d.calories/max*100):0}%" title="${d.has?Math.round(d.calories)+" kcal":"Sin registro"}"></i></div><small>${d.label}</small></div>`).join("");
}
function renderCatalog(query=""){
  const q=query.trim().toLocaleLowerCase("es-CL");const list=db.catalog.filter(f=>f.name.toLocaleLowerCase("es-CL").includes(q)).sort((a,b)=>a.name.localeCompare(b.name,"es"));
  $("catalogResults").innerHTML=list.length?list.map(f=>`<button type="button" class="catalog-item" data-pick="${f.id}"><span><strong>${esc(f.name)}</strong><small>${Math.round(f.calories)} kcal · ${fmt(f.protein)} g proteína por 100 g</small></span><b>›</b></button>`).join(""):`<div class="catalog-empty">${q?"No encontramos ese alimento en tu catálogo.":"Tu catálogo está vacío. Crea tu primer alimento usando los valores de su etiqueta por 100 g."}</div>`;
}
function openFoodSearch(){selectedCatalogFood=null;$("foodSearch").value="";$("quickAddPanel").hidden=true;renderCatalog();$("foodDialog").showModal();setTimeout(()=>$("foodSearch").focus(),100)}
function updateCalculated(){if(!selectedCatalogFood)return;const grams=n($("foodGrams").value),ratio=grams/100,f=selectedCatalogFood;$("calculatedMacros").innerHTML=`<span>${Math.round(f.calories*ratio)} kcal</span><span>${fmt(f.protein*ratio)} g proteína</span><span>${fmt(f.carbs*ratio)} g carbohidratos</span><span>${fmt(f.fat*ratio)} g grasas</span>`}
$("foodSearch").addEventListener("input",e=>renderCatalog(e.target.value));
$("catalogResults").addEventListener("click",e=>{const b=e.target.closest("[data-pick]");if(!b)return;selectedCatalogFood=db.catalog.find(f=>f.id===b.dataset.pick);$("selectedFoodName").textContent=selectedCatalogFood.name;$("selectedFoodInfo").textContent=`Valores por 100 g · ${selectedCatalogFood.calories} kcal`;$("foodGrams").value=100;$("quickAddPanel").hidden=false;updateCalculated()});
$("foodGrams").addEventListener("input",updateCalculated);
$("confirmAddFood").onclick=()=>{if(!selectedCatalogFood)return;const grams=n($("foodGrams").value);if(grams<=0){alert("Ingresa una cantidad válida en gramos.");return}const ratio=grams/100,f=selectedCatalogFood;dayData().foods.push({id:crypto.randomUUID(),catalogId:f.id,name:f.name,meal:$("mealType").value,grams,calories:f.calories*ratio,protein:f.protein*ratio,carbs:f.carbs*ratio,fat:f.fat*ratio});save();$("foodDialog").close();render()};
$("newFoodBtn").onclick=()=>{$("customFoodForm").reset();$("customFoodDialog").showModal()};
$("customFoodForm").addEventListener("submit",e=>{e.preventDefault();const name=$("customName").value.trim();if(db.catalog.some(f=>f.name.toLocaleLowerCase("es-CL")===name.toLocaleLowerCase("es-CL"))&&!confirm("Ya existe un alimento con ese nombre. ¿Guardar igualmente?") )return;const f={id:crypto.randomUUID(),name,calories:n($("customCalories").value),protein:n($("customProtein").value),carbs:n($("customCarbs").value),fat:n($("customFat").value),createdAt:new Date().toISOString()};db.catalog.push(f);save();$("customFoodDialog").close();$("foodSearch").value=name;renderCatalog(name);selectedCatalogFood=f;$("selectedFoodName").textContent=f.name;$("selectedFoodInfo").textContent=`Valores por 100 g · ${f.calories} kcal`;$("foodGrams").value=100;$("quickAddPanel").hidden=false;updateCalculated();if(!$ ("foodDialog").open)$ ("foodDialog").showModal()});
$("mealList").addEventListener("click",e=>{const del=e.target.dataset.delete;if(del&&confirm("¿Eliminar este alimento del registro?")){dayData().foods=dayData().foods.filter(x=>x.id!==del);save();render()}});
$("addBtn").onclick=openFoodSearch;
$("dayPicker").onchange=e=>{selectedDate=e.target.value||localDate();render()};
$("goalBtn").onclick=()=>{$("goalCalories").value=db.goals.calories;$ ("goalProtein").value=db.goals.protein;$ ("goalCarbs").value=db.goals.carbs;$ ("goalFat").value=db.goals.fat;$ ("goalDialog").showModal()};
$("goalForm").addEventListener("submit",e=>{e.preventDefault();db.goals={calories:n($("goalCalories").value)||2300,protein:n($("goalProtein").value),carbs:n($("goalCarbs").value),fat:n($("goalFat").value)};save();$("goalDialog").close();render()});
$("weightBtn").onclick=()=>$ ("weightDialog").showModal();
$("weightForm").addEventListener("submit",e=>{e.preventDefault();db.weights.push({date:selectedDate,value:n($("weightValue").value)});save();$("weightDialog").close();$("weightValue").value="";render()});
$("backupBtn").onclick=()=>$ ("backupDialog").showModal();
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`nutritrack-backup-${localDate()}.json`;a.click();URL.revokeObjectURL(url)};
$("importFile").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const imported=JSON.parse(await file.text());if(!imported.goals||!imported.days||!Array.isArray(imported.weights))throw Error();if(!Array.isArray(imported.catalog))imported.catalog=[];if(!confirm("Esto reemplazará tus datos actuales. ¿Continuar?"))return;db=imported;save();render();$("backupDialog").close();alert("Copia importada correctamente.")}catch{alert("No se pudo importar. Verifica que sea una copia de NutriTrack válida.")}e.target.value=""};
$("navMeals").onclick=e=>{e.preventDefault();$("addBtn").scrollIntoView({behavior:"smooth",block:"center"})};
$("navWeight").onclick=e=>{e.preventDefault();$("weightBtn").scrollIntoView({behavior:"smooth",block:"center"})};
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
render();
