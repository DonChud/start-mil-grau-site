const CONFIG = {
  whatsappNumber: "554196793668", // TROQUE pelo número real com DDI + DDD. Ex.: 5541991234567
  businessName: "Start Mil Grau",
  businessHours: "Seg–Sáb • 08:00 às 18:00",
  availableTimes: ["08:00","09:30","11:00","13:30","15:00","16:30","18:00"]
};

const services = [
  { id:"express", name:"Lavagem Start", price:100.00, duration:"45–60 min", desc:"Lavagem externa, aspiração simples, rodas e pneus." },
  { id:"complete", name:"Lavagem Grau Completa", price:160.00, duration:"75–90 min", desc:"Externa completa + aspiração, painéis e vidros internos." },
  { id:"internal", name:"Limpeza Mil Grau", price:200.00, duration:"2–3 h", desc:"Limpeza interna detalhada, carpetes, plásticos e cantos e caixas de rodas." },
  { id:"detail", name:"Limpeza Mil Grau Black", price:300.00, duration:"3–4 h", desc:"Tratamento completo interno e externo com acabamento premium." }
];

const plans = [
  { id:"essential", name:"Start Essencial", price:350.00, desc:"Sendo válido de segunda a sexta-feira, com horário agendado.", features:["2 lavagens /mês","5% em produtos adicionais","Prioridade básica"] },
  { id:"plus", name:"Start Plus", price:580, desc:"Sendo válido de segunda a sexta-feira, com horário agendado.", features:["3 lavagens completas/mês","10% em adicionais","Prioridade de agenda"], featured:true },
  { id:"black", name:"Start Black", price:1000.00, desc:"Sendo válido de segunda a sexta-feira, com horário agendado.", features:["4 lavagens premium/mês","15% em adicionais","Prioridade máxima","Benefícios exclusivos"] }
];

const faqs = [
  ["O agendamento fica confirmado automaticamente?","Não. A landing page organiza seu pedido e abre o WhatsApp. A equipe confirma o horário após receber a mensagem."],
  ["Preciso criar conta?","Não. O fluxo foi pensado para ser rápido e direto, sem cadastro obrigatório."],
  ["Posso escolher um plano mensal?","Sim. Selecione a aba de planos no formulário e envie o pedido pelo WhatsApp para receber os detalhes."],
  ["Funciona no celular?","Sim. O layout é totalmente responsivo e o botão final abre o WhatsApp com a mensagem pré-preenchida."]
];

const money = v => v.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function renderServices(){
  $("#servicesGrid").innerHTML = services.map((s,i)=>`<article class="service-card reveal" style="transition-delay:${i*60}ms"><div class="service-icon">${String(i+1).padStart(2,"0")}</div><h3>${s.name}</h3><p>${s.desc}</p><div class="meta-row"><div><div class="price">${money(s.price)}</div><div class="duration">${s.duration}</div></div><button class="card-link quick-book" data-kind="service" data-id="${s.id}">Agendar →</button></div></article>`).join("");
}
function renderPlans(){
  $("#plansGrid").innerHTML = plans.map((p,i)=>`<article class="plan-card ${p.featured?"featured":""} reveal" style="transition-delay:${i*80}ms">${p.featured?'<div class="plan-tag">MAIS ESCOLHIDO</div>':''}<h3>${p.name}</h3><p>${p.desc}</p><div class="price">${money(p.price)}<small style="font-size:.72rem;color:var(--muted)">/mês</small></div><ul class="plan-features">${p.features.map(f=>`<li>✓ ${f}</li>`).join("")}</ul><button class="btn ${p.featured?'btn-primary':'btn-ghost'} btn-block quick-book" data-kind="plan" data-id="${p.id}">Quero este plano</button></article>`).join("");
}
function renderFaq(){
  $("#faqList").innerHTML = faqs.map(([q,a])=>`<article class="faq-item"><button class="faq-question">${q}<span>+</span></button><div class="faq-answer"><p>${a}</p></div></article>`).join("");
  $$(".faq-question").forEach(btn=>btn.addEventListener("click",()=>btn.parentElement.classList.toggle("open")));
}

let currentStep=1;
let selectedKind="service";
let selectedId=services[0].id;

function choicesFor(kind){return kind==="service"?services:plans}
function renderBookingChoices(){
  $("#bookingChoices").innerHTML = choicesFor(selectedKind).map(item=>`<div class="choice-item ${item.id===selectedId?'active':''}" data-id="${item.id}"><span class="choice-radio"></span><div><strong>${item.name}</strong><small>${item.desc}</small></div><div class="choice-price">${money(item.price)}${selectedKind==='plan'?'<small>/mês</small>':''}</div></div>`).join("");
  $$(".choice-item").forEach(el=>el.addEventListener("click",()=>{selectedId=el.dataset.id;renderBookingChoices()}));
}
function setKind(kind){selectedKind=kind;selectedId=choicesFor(kind)[0].id;$$('.choice-tab').forEach(t=>t.classList.toggle('active',t.dataset.kind===kind));renderBookingChoices()}

function setMinDate(){
  const d=new Date(); d.setMinutes(d.getMinutes()-d.getTimezoneOffset()); $("#bookingDate").min=d.toISOString().slice(0,10);
}
function renderTimes(){
  $("#bookingTime").innerHTML='<option value="">Selecione</option>'+CONFIG.availableTimes.map(t=>`<option>${t}</option>`).join('');
}
function normalizePhone(v){return v.replace(/\D/g,"").slice(0,11)}
function phoneMask(v){const n=normalizePhone(v); if(n.length<=2)return n; if(n.length<=7)return `(${n.slice(0,2)}) ${n.slice(2)}`; return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`}

function validateStep(step){
  if(step===1) return true;
  if(step===2){if(!$("#bookingDate").value || !$("#bookingTime").value){toast("Escolha uma data e um horário.");return false}}
  if(step===3){
    const fields=["#customerName","#customerPhone","#vehicle","#plate"];
    for(const id of fields){if(!$(id).value.trim()){toast("Preencha todos os campos obrigatórios.");$(id).focus();return false}}
    if(normalizePhone($("#customerPhone").value).length<10){toast("Informe um WhatsApp válido.");return false}
  }
  return true;
}
function updateStep(){
  $$(".form-step").forEach(s=>s.classList.toggle("active",Number(s.dataset.step)===currentStep));
  const titles=["Escolha","Data e horário","Seus dados","Revisão"];
  $("#progressBar").style.width=`${currentStep*25}%`;
  $("#progressStep").textContent=`Etapa ${currentStep} de 4`;$("#progressTitle").textContent=titles[currentStep-1];
  $("#prevStep").disabled=currentStep===1;
  $("#nextStep").classList.toggle("hidden",currentStep===4);
  $("#submitBooking").classList.toggle("hidden",currentStep!==4);
  if(currentStep===4) renderSummary();
}
function selectedItem(){return choicesFor(selectedKind).find(x=>x.id===selectedId)}
function prettyDate(value){if(!value)return"";const [y,m,d]=value.split('-');return `${d}/${m}/${y}`}
function renderSummary(){
  const item=selectedItem();
  const rows=[
    [selectedKind==='service'?"Serviço":"Plano",item.name],["Valor",money(item.price)+(selectedKind==='plan'?" / mês":"")],["Data",prettyDate($("#bookingDate").value)],["Horário",$("#bookingTime").value],["Cliente",$("#customerName").value],["WhatsApp",$("#customerPhone").value],["Veículo",$("#vehicle").value],["Placa",$("#plate").value.toUpperCase()]
  ];
  $("#bookingSummary").innerHTML=rows.map(([a,b])=>`<div class="summary-row"><span>${a}</span><strong>${b}</strong></div>`).join("");
}
function buildWhatsAppMessage(){
  const item=selectedItem();
  const notes=$("#notes").value.trim()||"Sem observações";
  return `Olá, ${CONFIG.businessName}! Gostaria de solicitar um agendamento.\n\n*${selectedKind==='service'?'SERVIÇO':'PLANO'}*\n${item.name}\nValor: ${money(item.price)}${selectedKind==='plan'?' / mês':''}\n\n*DATA E HORÁRIO*\n${prettyDate($("#bookingDate").value)} às ${$("#bookingTime").value}\n\n*CLIENTE*\nNome: ${$("#customerName").value.trim()}\nWhatsApp: ${$("#customerPhone").value.trim()}\n\n*VEÍCULO*\n${$("#vehicle").value.trim()}\nPlaca: ${$("#plate").value.trim().toUpperCase()}\n\n*OBSERVAÇÕES*\n${notes}\n\nPode confirmar a disponibilidade desse horário?`;
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove("show"),2600)}

function initInteractions(){
  $("#menuButton").addEventListener("click",()=>{const menu=$("#mobileMenu");const open=menu.classList.toggle("open");$("#menuButton").setAttribute("aria-expanded",open)});
  $$("#mobileMenu a").forEach(a=>a.addEventListener("click",()=>$("#mobileMenu").classList.remove("open")));
  $$(".choice-tab").forEach(t=>t.addEventListener("click",()=>setKind(t.dataset.kind)));
  $("#prevStep").addEventListener("click",()=>{if(currentStep>1){currentStep--;updateStep()}});
  $("#nextStep").addEventListener("click",()=>{if(validateStep(currentStep)&&currentStep<4){currentStep++;updateStep()}});
  $("#customerPhone").addEventListener("input",e=>e.target.value=phoneMask(e.target.value));
  $("#plate").addEventListener("input",e=>e.target.value=e.target.value.replace(/[^a-zA-Z0-9]/g,'').toUpperCase().slice(0,7));
  $("#bookingForm").addEventListener("submit",e=>{
    e.preventDefault();
    if(!$("#privacyConsent").checked){toast("Marque a autorização para continuar.");return}
    if(!/^55\d{10,11}$/.test(CONFIG.whatsappNumber)){toast("Configure o número do WhatsApp no script.js antes de publicar.");return}
    const url=`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
    window.open(url,"_blank","noopener,noreferrer");
  });
  document.addEventListener("click",e=>{
    const btn=e.target.closest(".quick-book"); if(!btn)return;
    selectedKind=btn.dataset.kind; selectedId=btn.dataset.id; currentStep=1; $$(".choice-tab").forEach(t=>t.classList.toggle('active',t.dataset.kind===selectedKind));renderBookingChoices();updateStep();$("#agendar").scrollIntoView({behavior:"smooth"});
  });
}
function initReveal(){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
  $$(".reveal").forEach(el=>io.observe(el));
}

renderServices();renderPlans();renderFaq();renderBookingChoices();renderTimes();setMinDate();initInteractions();initReveal();updateStep();
$("#footerHours").textContent=CONFIG.businessHours;
$("#footerPhone").textContent=`WhatsApp: +${CONFIG.whatsappNumber}`;
$("#year").textContent=new Date().getFullYear();
