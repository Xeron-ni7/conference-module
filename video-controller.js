let video =null;
//let room=null;
let members=[];
const init =()=>{
    
  video =document.getElementById("video1");
    $("#black-room video").draggable();
    $("#video-border").draggable();
}

function filterMember(id){
    
    let user=[];
    if(members.length>0){
        user=members.filter(function(data){
           if(data.id===id)
               return true;
        });
    }
    
    return user;
}

 function addMember(data){
     if(filterMember(data.id).length===0)
        {
            alert(data.id);
            members.push(data);
            $(`#${data.id}`).draggable();
            addVideos();
        }
}


const addVideos=function(){
    let blackRoom=document.getElementById("remoteVideos");
    let x=members.length;
    if(x>0){
    let colNum=parseInt(12/x);
        if(colNum===12)
            colNum=10;
    let str="<div class='row video-box'>";
    for (let i=0;i<x;i++){
        str+=`<div class="${'col-sm-'+colNum}">`;
        str+=members[i].str;
        str+='</div>';
    }
    str+="</div>";
    blackRoom.innerHTML=str;
        addTracks();
    }
}


const addTracks=function(){
    if(members.length>0){
        for(let i=0;i<members.length;i++){
            console.log(members);
            members[i].track.attach($(`#${members[i].id}`)[0]);
        }
    }
}

const Mute=function(id){
    
    let video=id;
    
        if(!video.muted)
           video.muted=true;
        else
            video.muted=false;
    
}

 function createElement(x){
   let str= `<div class="video-border" id="video-border${x}">`+
         `<video id="${x}" autoplay="1">`+
           ' </video>'+
           ` <button class="btn btn-outline-secondary" style="z-index: 99;position:absolute;bottom:15px;margin-left: -65%" onclick="Mute('video-border${x}')" ><img src="icons/mute.png" width="16 auto"/></button>`+
            `<button class="btn btn-outline-danger" style="z-index: 99;position:absolute;bottom:15px;margin-left: -52%"  onclick="Remove('${x}')" ><img src="icons/close.png" width="16 auto"/></button>`+
        '</div>';
    return str;
}

function createParticipantElement(x){
   let str= `<div class="video-border">`+
         `<video id="${x}">`+
           ' <source src="abc.mp4"  type="video/mp4">'+
           ' </video>'+
           ` <button class="btn btn-outline-secondary" style="z-index: 99;position:absolute;bottom:15px;margin-left: -65%" onclick="Mute('${x}')" ><img src="icons/mute.png" width="24 auto"/></button>`+
            `<button class="btn btn-outline-danger" style="z-index: 99;position:absolute;bottom:15px;margin-left: -52%"  onclick="Remove('${x}')" ><img src="icons/close.png" width="24 auto"/></button>`+
        '</div>';
    return str;
}

const Play=(id)=>{
   
    let video=id;
    
    if(video.paused)
        video.play();
    else
        video.pause();
}

const Remove=function(id){
     let users=members.filter(function(data){
        if(data.id==id){
            console.log(data.id);
            return false;
        }else{
            return true;
        } 
    });
    members=users;
    addVideos();
}

window.onload=init;