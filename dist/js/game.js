class Game{constructor(){this.referenceDeck=new Deck,this.gameDeck=new Deck,this.player=new Player,this.missileDialog=document.querySelector(".missile-dialog"),this.missileNumbers=document.querySelectorAll(".missile-dialog__number-button"),this.missileTypes=document.querySelectorAll(".missile-dialog__missile-type"),this.specialActions=document.querySelectorAll(".special-actions__button"),this.componentDisplay=document.querySelector(".components_human"),this.oppComponentDisplay=document.querySelector(".components_opponent"),this.completeTurn=document.querySelector(".complete"),this.undoTurn=document.querySelector(".undo"),this.activeMissileIndex=-1,this.lightMissileIndex=0,this.heavyMissileIndex=0,this.turnActions=[],this.restoreComponents=[],this.setupListeners(),new MessageHandler,this.setupShip(),this.setupOpponent(),this.setupCrew()}setupListeners(){document.querySelector(".game-display__title").addEventListener("click",this.returnToTitle),document.querySelector(".game-display__subtitle").addEventListener("click",this.returnToTitle),document.addEventListener("removeCrewListeners",this.toggleCrewListeners),document.addEventListener("advancePhase",this.advancePhase),document.addEventListener("togglePlayerComponents",this.togglePlayerComponentListeners),document.addEventListener("toggleOpponentComponents",this.toggleOpponentComponentListeners),this.missileNumbers.forEach((e=>{e.addEventListener("click",this.queueMissiles)})),this.missileTypes.forEach((e=>{e.addEventListener("click",this.selectMissileType)}))}returnToTitle(){localStorage.setItem("dm21GameState","paused"),document.querySelector(".title-screen").classList.remove("hidden"),document.querySelector(".game-display").classList.add("hidden")}setupShip=()=>{this.level=1,this.player.components.installed=[this.referenceDeck.cards[5],this.referenceDeck.cards[6],this.referenceDeck.cards[9],this.referenceDeck.cards[1]];let e=new CustomEvent("renderInstalledComponents");document.dispatchEvent(e)};setupOpponent=()=>{this.opponent=new Opponent;let e=new CustomEvent("setupOpponent",{detail:{level:this.level,referenceDeck:this.referenceDeck}});document.dispatchEvent(e)};setupCrew=()=>{this.logMessage('Select Crew: Under "Crew," click on your Pilot, Gunner, or Engineer to add a +2 bonus to that crew member.'),sessionStorage.setItem("dm21IncreaseLevel","2"),sessionStorage.setItem("dm21GamePhase","crewSetup"),this.toggleCrewListeners()};advancePhase=e=>{"crewSetup"===sessionStorage.getItem("dm21GamePhase")&&(sessionStorage.setItem("dm21GamePhase","combat"),this.startLevel())};toggleCrewListeners=()=>{crewElements.forEach((e=>{e.classList.toggle("clickable")})),crewElements[0].classList.contains("clickable")?(crewContainer.querySelector(".crew__pilot").addEventListener("click",this.increasePilot),crewContainer.querySelector(".crew__gunner").addEventListener("click",this.increaseGunner),crewContainer.querySelector(".crew__engineer").addEventListener("click",this.increaseEngineer)):(crewContainer.querySelector(".crew__pilot").removeEventListener("click",this.increasePilot),crewContainer.querySelector(".crew__gunner").removeEventListener("click",this.increaseGunner),crewContainer.querySelector(".crew__engineer").removeEventListener("click",this.increaseEngineer))};increasePilot=()=>{let e=new CustomEvent("increaseCrew",{detail:{crew:"pilot"}});document.dispatchEvent(e)};increaseGunner=()=>{let e=new CustomEvent("increaseCrew",{detail:{crew:"gunner"}});document.dispatchEvent(e)};increaseEngineer=()=>{let e=new CustomEvent("increaseCrew",{detail:{crew:"engineer"}});document.dispatchEvent(e)};logMessage(e){let t=new CustomEvent("message",{detail:{message:e}});document.dispatchEvent(t)}startLevel=()=>{this.attackRun=!1,this.expose=!1,this.hack,document.querySelector(".player-mat_opponent").classList.toggle("hidden"),this.logMessage("Combat begins!"),this.togglePlayerComponentListeners(),this.updateSpecialActionListeners()};togglePlayerComponentListeners=()=>{this.components=this.componentDisplay.querySelectorAll(".components__item"),this.components.forEach((e=>{e.classList.toggle("clickable"),e.classList.contains("clickable")?e.addEventListener("click",this.handlePlayerComponentClick):e.removeEventListener("click",this.handlePlayerComponentClick)}))};toggleOpponentComponentListeners=()=>{this.oppComponents=this.oppComponentDisplay.querySelectorAll(".components__item"),this.oppComponents.forEach((e=>{e.classList.toggle("clickable"),e.classList.contains("clickable")?e.addEventListener("click",this.handleOpponentComponentClick):e.removeEventListener("click",this.handleOpponentComponentClick)}))};updateSpecialActionListeners=()=>{if(this.attackRun)this.specialActions.forEach((e=>{e.classList.remove("clickable"),e.removeEventListener("click",this.handleSpecialActionClick)}));else if(this.expose)for(let e=0;e<this.specialActions.length;e++)e<2&&(this.specialActions[e].classList.remove("clickable"),this.specialActions[e].removeEventListener("click",this.handleSpecialActionClick));else if(this.hack)for(let e=0;e<this.specialActions.length;e++)0!==e&&2!==e||(this.specialActions[e].classList.remove("clickable"),this.specialActions[e].removeEventListener("click",this.handleSpecialActionClick));else this.specialActions.forEach((e=>{e.classList.contains("clickable")||(e.classList.add("clickable"),e.addEventListener("click",this.handleSpecialActionClick))}))};toggleTurnButtonListeners=()=>{this.completeTurn.classList.toggle("clickable"),this.completeTurn.classList.contains("clickable")?this.completeTurn.addEventListener("click",this.handleCompleteTurnClick):this.completeTurn.removeEventListener("click",this.handleCompleteTurnClick),this.undoTurn.classList.toggle("clickable"),this.undoTurn.classList.contains("clickable")?this.undoTurn.addEventListener("click",this.handleUndoTurnClick):this.undoTurn.removeEventListener("click",this.handleUndoTurnClick)};findComponentIndex=e=>{for(let t=0;t<this.player.components.installed.length;t++)if(this.player.components.installed[t].title===e)return t;return-1};findTurnIndex=e=>{for(let t=0;t<this.turnActions.length;t++)if(-1!=this.turnActions[t].log.indexOf(e))return t;return-1};handleSpecialActionClick=e=>{e.target.classList.contains("special-actions__button_attack-run")?(this.attackRun=!0,this.updateSpecialActionListeners(),this.logMessage("Select Weapon")):e.target.classList.contains("special-actions__button_expose")?(this.expose=!0,this.updateSpecialActionListeners(),this.completeAction()):(this.hack=!0,this.updateSpecialActionListeners(),this.completeAction())};handleUndoTurnClick=()=>{this.attackRun&&this.togglePlayerComponentListeners(),this.turnActions=[],this.expose=!1,this.hack=!1,this.attackRun=!1,this.countermeasures=!1,this.restoreComponents.length>0&&(this.player.components.installed=this.restoreComponents,-1!=this.activeMissileIndex&&(this.player.components.installed[this.activeMissileIndex].counter=this.activeMissileQuantity)),this.restoreComponents=[],this.updateSpecialActionListeners(),this.completeAction()};handlePlayerComponentClick=e=>{e.target.classList.toggle("focus");let t=e.target.style.background.toString();if(e.target.classList.contains("focus")){for(let e=0;e<this.player.components.installed.length;e++)-1!=t.indexOf(this.player.components.installed[e].image)&&(this.selectedComponent=this.player.components.installed[e]);if("Missile Launcher"===this.selectedComponent.title)this.lightMissileIndex=-1,this.heavyMissileIndex=-1,-1!=this.findComponentIndex("Light Missiles")?this.lightMissileIndex=this.findComponentIndex("Light Missiles"):-1!=this.findComponentIndex("Heavy Missiles")&&(this.heavyMissileIndex=this.findComponentIndex("Heavy Missiles")),(this.heavyMissileIndex>-1||this.lightMissileIndex>-1)&&this.missileDialog.classList.toggle("hidden"),this.heavyMissileIndex>-1&&this.lightMissileIndex>-1?this.missileDialog.querySelector(".missile-dialog__type").classList.toggle("hidden"):-1!=this.lightMissileIndex?(this.activeMissileIndex=this.lightMissileIndex,this.selectMissileNumber()):-1!=this.heavyMissileIndex?(this.activeMissileIndex=this.heavyMissileIndex,this.selectMissileNumber()):this.logMessage("No missiles left!");else if("Auto Cannon"===this.selectedComponent.title)if(-1===this.findTurnIndex("Auto Cannon")){let e={log:"Fire Auto Cannon",type:"attack",missiles:0,value:1};this.turnActions.push(e),this.completeAction()}else this.logMessage(`${this.selectedComponent.title} already used.`);else"Countermeasures"===this.selectedComponent.title&&(this.attackRun?this.logMessage("Must select weapon for attack run."):(this.countermeasures=!0,this.backupComponents(),this.player.components.installed.splice(this.findComponentIndex("Countermeasures"),1),this.completeAction()))}e.target.classList.toggle("focus")};selectMissileType=e=>{console.log(e.target)};selectMissileNumber=()=>{this.backupComponents(),this.missileDialog.querySelector(".missile-dialog__number").classList.toggle("hidden"),this.activeMissileQuantity=this.player.components.installed[this.activeMissileIndex].counter,this.activeMissileIndex===this.lightMissileIndex?this.activeMissileQuantity>4?this.maxMissiles=4:this.maxMissiles=this.activeMissileQuantity:this.activeMissileQUantity>2?this.maxMissiles=2:this.maxMissiles=this.activeMissileQuantity;for(let e=0;e<this.maxMissiles;e++)this.missileNumbers[e].classList.remove("hidden")};backupComponents=()=>{0===this.restoreComponents.length&&this.player.components.installed.forEach((e=>{this.restoreComponents.push(e)}))};queueMissiles=e=>{this.missileDialog.querySelector(".missile-dialog__number").classList.toggle("hidden"),this.missileDialog.classList.toggle("hidden");let t={log:`Fire ${e.target.textContent} ${this.player.components.installed[this.activeMissileIndex].title}`,type:"attack",missiles:e.target.textContent,value:this.player.components.installed[this.activeMissileIndex].attack};this.turnActions.push(t),this.player.components.installed[this.activeMissileIndex].counter=this.player.components.installed[this.activeMissileIndex].counter-e.target.textContent,0===this.player.components.installed[this.activeMissileIndex].counter&&this.player.components.installed.splice(this.activeMissileIndex,1),this.completeAction()};completeAction=()=>{let e="";if(this.countermeasures&&(e+="Deploy Countermeasures",(this.turnActions.length>0||this.expose||this.hack)&&(e+=" & ")),this.expose&&(e+="Expose",(this.turnActions.length>0||this.hack)&&(e+=" & ")),this.hack&&(e+="Hack",this.turnActions.length>0&&(e+=" & ")),this.attackRun&&(e+="Attack Run: ",this.togglePlayerComponentListeners()),this.turnActions.length>0)for(let t=0;t<this.turnActions.length;t++)e+=this.turnActions[t].log,this.turnActions.length>1&&t!=this.turnActions.length-1&&(e+=" & ");this.player.renderInstalledComponents(),this.completeTurn.classList.contains("clickable")||this.toggleTurnButtonListeners(),""===e&&(e="TURN RESET",this.toggleTurnButtonListeners()),this.logMessage(e),this.attackRun&&this.logMessage('Press "Complete Turn"')};handleCompleteTurnClick=()=>{array.forEach((e=>{}))};saveGame(){localStorage.setItem("dm21Save",JSON.stringify({player:this.player,gameDeck:this.gameDeck}))}loadGame(){try{const e=JSON.parse(localStorage.getItem("dm21Save"));if(e&&e.gameDeck)return this.gameDeck=Deck().restore(e.gameDeck.cards),this.player=Player().restore(e.player.bonus,e.player.crewElements,e.player.components,e.player.repeat),!0}catch(e){console.error("no game state")}return!1}}
//# sourceMappingURL=game.js.map