const option={
    hosts:{
    domain:"192.168.0.149",
    muc:"conference.192.168.0.149",
    anonymousdomain:"guest.192.168.0.149",
    //VirtualHost:"guest.192.168.0.149"
},
      bosh:"https://192.168.0.149/http-bind"
};

const confOption={
    openBridgeChannel:true,
    password:"123456"
};

let connection=null;
let isJoined=false;
let room=null;

let localTracks=[];
const remoteTracks={};


//conference join function
function onConferenceJoined(){
    isJoined=true;
    for(let i=0;i<localTracks.length;i++){
        room.addTrack(localTracks[i]);
    }  
}

//connection failed
function onConnectionFail(){
    alert("Connection Failed");
}


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

const onConnectionSuccess=()=>{

    alert("--------------------------------connected");
    room=connection.initJitsiConference("new3",confOption);
    room.on(
        JitsiMeetJS.events.conference.CONFERENCE_JOINED,
        onConferenceJoined);
        room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);

        room.join("123456");
}


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

const Start= async ()=>{
    JitsiMeetJS.init(initOptions);

connection=new JitsiMeetJS.JitsiConnection(null,"asdnoncla#252k3rk3m3",option);

connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,onConnectionSuccess);
connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED,onConnectionFail);
connection.connect();
// {"id":"username@192.168.0.149","password":"password"}
JitsiMeetJS.createLocalTracks({ devices: [ 'audio', 'video' ] })
    .then(onLocalTracks)
    .catch(error => {
        throw error;
    });

}

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