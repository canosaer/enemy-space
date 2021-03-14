class Player{constructor(){this.bonus={pilot:0,gunner:0,engineer:0},this.components={installed:[],stored:[]},this.repeat=!1,this.defense=5,this.crewElements={pilot:document.querySelector(".crew__pilot-level_human"),gunner:document.querySelector(".crew__gunner-level_human"),engineer:document.querySelector(".crew__engineer-level_human")},this.crewElements.pilot.textContent=this.bonus.pilot,this.crewElements.gunner.textContent=this.bonus.gunner,this.crewElements.engineer.textContent=this.bonus.engineer,this.setupListeners()}setupListeners(){document.addEventListener("increaseCrew",this.increaseCrew),document.addEventListener("renderInstalledComponents",this.renderInstalledComponents)}increaseCrew=e=>{const{crew:t}=e.detail;let n=parseInt(sessionStorage.getItem("dm21IncreaseLevel"));if("pilot"===t?"crewSetup"===sessionStorage.getItem("dm21GamePhase")&&this.bonus.pilot>1?this.repeat=!0:(this.bonus.pilot=this.bonus.pilot+n,this.crewElements.pilot.textContent=this.bonus.pilot,this.repeat=!1):"gunner"===t?"crewSetup"===sessionStorage.getItem("dm21GamePhase")&&this.bonus.gunner>1?this.repeat=!0:(this.bonus.gunner=this.bonus.gunner+n,this.crewElements.gunner.textContent=this.bonus.gunner,this.repeat=!1):"engineer"===t&&("crewSetup"===sessionStorage.getItem("dm21GamePhase")&&this.bonus.engineer>1?this.repeat=!0:(this.bonus.engineer=this.bonus.engineer+n,this.crewElements.engineer.textContent=this.bonus.engineer,this.repeat=!1)),2===n){sessionStorage.setItem("dm21IncreaseLevel","1");let e=`${t} increased`;e=e.toUpperCase(),this.logMessage(e),this.logMessage("Select Crew: Click on a different crew member to give them a +1 bonus.")}else if(1===n&&!this.repeat){let e=`${t} increased`;e=e.toUpperCase(),this.logMessage(e),this.removeCrewListeners(),this.advancePhase()}};removeCrewListeners=()=>{let e=new CustomEvent("removeCrewListeners");document.dispatchEvent(e)};advancePhase=()=>{let e=new CustomEvent("advancePhase");document.dispatchEvent(e)};logMessage(e){let t=new CustomEvent("message",{detail:{message:e}});document.dispatchEvent(t)}renderInstalledComponents=()=>{let e=document.querySelector(".components_human"),t=document.querySelector(".consumables_human"),n=e.querySelectorAll(".components__item"),s=!1;if(n.length>0&&n[0].classList.contains("clickable")&&(s=!0),n.forEach((e=>{e.remove()})),n=t.querySelectorAll(".consumables__item"),n.forEach((e=>{e.remove()})),this.components.installed.forEach((n=>{if(n.counter){let e=document.createElement("li");e.classList.add("consumables__item"),e.textContent=`${n.title}: ${n.counter}`,t.appendChild(e)}else{let t=document.createElement("li");t.classList.add("components__item"),t.style.background=`url("${n.image}")`,t.style.backgroundPosition="center",t.style.backgroundSize="cover",n.disabled&&t.classList.add("disabled"),e.appendChild(t)}})),s){let e=new CustomEvent("togglePlayerComponents");document.dispatchEvent(e)}}}
//# sourceMappingURL=player.js.map