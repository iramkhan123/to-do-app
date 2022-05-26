
const addbtn=document.querySelector(".add-btn");
const modalc=document.querySelector(".modal-cont");
var uid = new ShortUniqueId();
let colors=['first','second','third','fourth'];
let colorobj={
    'first':"To-Do",
    'second':"Important",
    'third':"Completed",
    'fourth':"Wait",

};
let lockClass="fa-lock";
let unlockClass="fa-lock-open";
let TicketArr=[];
let modalPriorityColor=colors[colors.length-1];
let addmodal=false;
let toolBoxColor=document.querySelectorAll(".color");
let maincont=document.querySelector(".main-cont");
let Textarea=document.querySelector(".textarea-cont");
addbtn.addEventListener('click',function(){
    if(!addmodal)
   {
        modalc.style.display="flex";
        
   }
   else{
       modalc.style.display="none";
   }
   addmodal = !addmodal;

})
//console.log(modalPriorityColor);
const allprioritycol=document.querySelectorAll(".priority-color");
allprioritycol.forEach(function(colorElem) {
    colorElem.addEventListener("click",function () {
        allprioritycol.forEach(function(prioritycolor){
            prioritycolor.classList.remove("active");
        })
        colorElem.classList.add("active");
        modalPriorityColor=colorElem.classList[0];
      //  console.log(modalPriorityColor);
    })
    
});
modalc.addEventListener("keydown",function(e){
    let key=e.key;
    if(key == "Shift"){
       // console.log(modalPriorityColor);
        //console.log(Textarea.value);
        createTicket(modalPriorityColor,Textarea.value)
      //  console.log(colorobj[modalPriorityColor]);
        modalc.style.display="none";
        addmodal=false;
        Textarea.value="";
        allprioritycol.forEach(function(colorElem){
            colorElem.classList.remove("active");
        })
        allprioritycol[3].classList.add("active");
    }
})
//to generate ids
function createTicket(ticketColor,data,TicketId){
    let Ticketcont=document.createElement("div");
    let id=TicketId || uid();
    /*console.log(colorobj[ticketColor]);*/
    Ticketcont.setAttribute("class","ticket-cont");
    Ticketcont.innerHTML=` 
    <div class="ticket-color ${ticketColor} "> ${colorobj[ticketColor]} </div>
    <div class="ticket-id">${id}</div>
    <div class="task-area"> ${data} </div>
    <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>
    `;
    let colorcont=colorobj[ticketColor];
    maincont.appendChild(Ticketcont);
    handleRemoval(Ticketcont, id);
    handlecolor(Ticketcont, id);
    handleLock(Ticketcont, id);
    //console.log(colorcontent);
    //if ticket is created for the first time, then ticketId would be undefined
    if(!TicketId){
    TicketArr.push({ticketColor, colorcont , data , TicketId:id});
    localStorage.setItem("ticket",JSON.stringify(TicketArr));
}}
/*console.log(uid());*/
//get all the tickets from local storage
if(localStorage.getItem("ticket")){
TicketArr=JSON.parse(localStorage.getItem("ticket"));
TicketArr.forEach(function(ticketObj){
    createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.TicketId);
})
}
for(let i=0;i<toolBoxColor.length;i++){
    toolBoxColor[i].addEventListener('click',function(e){
        let currentToolBoxCol=toolBoxColor[i].classList[0];

        let filteredTicket=TicketArr.filter(function(ticketObj){
          return currentToolBoxCol==ticketObj.ticketColor;
        })
        //remove all the tickets
         let alltickets=document.querySelectorAll(".ticket-cont");
        for(let i=0;i<alltickets.length;i++){
            alltickets[i].remove();
        }
        //display filtered tickets
        filteredTicket.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.TicketId);
        })
    })
    //to display all the tickets
    toolBoxColor[i].addEventListener('dblclick',function(){
        let alltickets=document.querySelectorAll(".ticket-cont");
        //remove color specific tickts
        for(let i=0;i<alltickets.length;i++){
            alltickets[i].remove();
        }
        TicketArr.forEach(function(ticketObj){
            
            createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.TicketId);
        })
    })
}
let removebtnflag=false;
let removebtn=document.querySelector(".remove-btn");
removebtn.addEventListener("click",function(){
    if(removebtnflag){
        removebtn.style.color="white";
    }
    else{
        removebtn.style.color="black";
    }
    removebtnflag=!removebtnflag;
})
function handleRemoval(ticket,id){
ticket.addEventListener("click",function(){
    if (!removebtnflag) return;
    //to remove from local storage
    //get idx of the ticket to be deleted
 let idx=getTicketidx(id);
 TicketArr.splice(idx,1)//idx se idx+1 tak remove
 //removed from browser storage and set updated arr
 let ticketarray=JSON.stringify(TicketArr);
 localStorage.setItem("ticket",ticketarray);
 ticket.remove();
})
}
function getTicketidx(id){
    let ticketidx=TicketArr.findIndex(function(ticketObj){
        return ticketObj.TicketId==id;
    })
    return ticketidx;
}
function handlecolor(ticket,id){
    let ticketcolorstrip=ticket.querySelector(".ticket-color");
   // console.log(ticketcolorstrip);
    ticketcolorstrip.addEventListener('click',function (){
        let currentcolor=ticketcolorstrip.classList[1];//pink 
        let currentcoloridx=colors.indexOf(currentcolor);//pinks' index
        let newcoloridx=currentcoloridx + 1;
        //console.log(newcoloridx);
         newcoloridx=newcoloridx % colors.length;
        // console.log(newcoloridx);
         let newticketcolor=colors[newcoloridx];
       //  let newcontent=colorcont[colors[newcoloridx]];
         ticketcolorstrip.classList.remove(currentcolor);
         ticketcolorstrip.classList.add(newticketcolor);
        let ticketcolorcontent=colorobj[newticketcolor];
        ticketcolorstrip.innerText=ticketcolorcontent;
         //local storage update
         let ticketidx=getTicketidx(id);
         TicketArr[ticketidx].ticketColor = newticketcolor;
         localStorage.setItem("ticket", JSON.stringify(TicketArr));
    })

}
let lockflag=true;
function handleLock(ticket, id){
 let ticketlockele=ticket.querySelector(".ticket-lock");
 let ticketlock=ticketlockele.children[0];
 let ticketTaskarea=ticket.querySelector(".task-area")
 ticketlock.addEventListener("click",function(){
       let ticketIdx=getTicketidx(id);
       if(ticketlock.classList.contains(lockClass)){
           ticketlock.classList.remove(lockClass);
           ticketlock.classList.add(unlockClass);
           ticketTaskarea.setAttribute("contenteditable","true");
       }
       else{
           ticketlock.classList.remove(unlockClass);
           ticketlock.classList.add(lockClass);
           ticketTaskarea.setAttribute("contenteditable","false");
       }
       TicketArr[ticketIdx].data = ticketTaskarea.innerText;
       localStorage.setItem("ticket", JSON.stringify(TicketArr));
 })
}

