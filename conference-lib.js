
// export let div=null;

// export function conferenceUI (divId){
//   div=document.getElementById(divId);
// }

// export function startConference(){
//    Start();
// }


 let div=null;

 function conferenceUI (divId){
  div=document.getElementById(divId);
}

 function startConference(){
   Start();
}





////////////////////////////////////////////////////// video conference lib ////////////////////////////////////////////////////////////////////////


let connection=null;
let isJoined=false;
let room=null;
let video =null;
let members=[];
let localTracks=[];
const remoteTracks={};


//// ** server congiguration ** ////

const option={
    hosts:{
    domain:"192.168.0.150",
    muc:"conference.192.168.0.150",
    anonymousdomain:"192.168.0.150"
},
      bosh:"https://192.168.0.150/http-bind"
};

//// ** conference configuration ** ////
const confOption={
    openBridgeChannel:true,
    password:"123456"
};


//// ** conference join success handler function ** ////

function onConferenceJoined(){
    isJoined=true;
    for(let i=0;i<localTracks.length;i++){
        room.addTrack(localTracks[i]);
    }  
}

//// ** server connection fail handler function ** ////
function onConnectionFail(){
    alert("Connection Failed");
}

//// ** local track adding handler function ** ////
const onLocalTracks=(tracks)=> {
    localTracks = tracks;
    for (let i = 0; i < localTracks.length; i++) {
        if (localTracks[i].getType() === 'video') {
          
            localTracks[i].attach($(`#local`)[0]);
        } else {
//            localTracks[i].attach($(`#localAudio${i}`)[0]);
        }
        
    }
}


//// ** server connection success handler function ** ////

const onConnectionSuccess=()=>{

    alert("--------------------------------connected");
    room=connection.initJitsiConference("new",confOption);
    room.on(
        JitsiMeetJS.events.conference.CONFERENCE_JOINED,
        onConferenceJoined);
        room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);

        room.join();
}


//// ** jitsi initialize option configuration ** ////

const initOptions={
     disableAudioLevels: false,

    // The ID of the jidesha extension for Chrome.
    desktopSharingChromeExtId: 'mbocklcggfhnbahlnepmldehdhpjfcjp',

    // Whether desktop sharing should be disabled on Chrome.
    desktopSharingChromeDisabled: false,

    // The media sources to use when using screen sharing with the Chrome
    // extension.
    desktopSharingChromeSources: [ 'screen', 'window' ],

    // Required version of Chrome extension
    desktopSharingChromeMinExtVersion: '0.1',

    // Whether desktop sharing should be disabled on Firefox.
    desktopSharingFirefoxDisabled: true
}

//// ** conference start handler function ** ////

const Start= async ()=>{
    JitsiMeetJS.init(initOptions);

connection=new JitsiMeetJS.JitsiConnection(null,"asdnoncla#252k3rk3m3",option);

connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,onConnectionSuccess);
connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED,onConnectionFail);
connection.connect();

JitsiMeetJS.createLocalTracks({ devices: [ 'audio', 'video' ] })
    .then(onLocalTracks)
    .catch(error => {
        throw error;
    });

}

//// ** remote/other participant track handler function ** ////

function onRemoteTrack(track){
    
    //checking if it's the native track
    if(track.isLocal()){
        return;
    }
    
    const participant=track.getParticipantId();
    
    if(!remoteTracks[participant]){
     remoteTracks[participant]=[];
//        members=[];
    }
    
    const idx=remoteTracks[participant].push(track);
    
    let userData={
        id:participant,
        vid:(participant+idx),
        str:createElement(participant),
        track:track,
        active:true,
        kick:false
    };
    console.log(track);
    addMember(userData);
    
    if(track.getType()==="video"){
        
    }else{
        
    }    
}


////////////////////////////////////////////////////// conference design ////////////////////////////////////////////////////////////////////////




//// ** participant filter function ** ////

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

//// ** adding new participant handler function ** ////

 function addMember(data){
     if(filterMember(data.id).length===0)
        {
            members.push(data);
            $(`#${data.id}`).draggable();
            addVideos();
        }
}

//// ** adding video to ui handler ** ////

const addVideos=function(){
    if(div == null){
        alert("no div selected");
        return true;
    }
    let blackRoom=div;
    alert(blackRoom);
    alert(div);
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

//// ** adding track to the video ** ////

const addTracks=function(){
    if(members.length>0){
        for(let i=0;i<members.length;i++){
            console.log(members);
            members[i].track.attach($(`#${members[i].id}`)[0]);
        }
    }
}

//// ** video muting handler ** ////

const Mute=function(id){
    
    let video=id;
    
        if(!video.muted)
           video.muted=true;
        else
            video.muted=false;
    
}

//// ** creating new video element ** ////

 function createElement(x){
   let str= `<div class="video-border" id="video-border${x}">`+
         `<video id="${x}" autoplay="1">`+
           ' </video>'+
           ` <button class="btn btn-outline-secondary" style="z-index: 99;position:absolute;bottom:15px;margin-left: -65%" onclick="Mute('video-border${x}')" ><img src="icons/mute.png" width="16 auto"/></button>`+
            `<button class="btn btn-outline-danger" style="z-index: 99;position:absolute;bottom:15px;margin-left: -52%"  onclick="Remove('${x}')" ><img src="icons/close.png" width="16 auto"/></button>`+
        '</div>';
    return str;
}

function createLocalElement(x){
   let str= `<div class="video-border">`+
         `<video id="${x}">`+
           ' <source src="abc.mp4" type="video/mp4">'+
           ' </video>'+
           ` <button class="btn btn-outline-secondary" style="z-index: 99;position:absolute;bottom:15px;margin-left: -65%" onclick="Mute('${x}')" ><img src="icons/mute.png" width="24 auto"/></button>`+
            `<button class="btn btn-outline-danger" style="z-index: 99;position:absolute;bottom:15px;margin-left: -52%"  onclick="Remove('${x}')" ><img src="icons/close.png" width="24 auto"/></button>`+
        '</div>';
    return str;
}


//// ** holding video by id ** ////

const Play=(id)=>{
   
    let video=id;
    
    if(video.paused)
        video.play();
    else
        video.pause();
}

//// ** video delete handler ** ////

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
