let connection =null;
let isjoined=false;
let room =null;
let localTracks=[];
const remoteTracks={};

let options={
    host:{
        domain:"192.168.0.150",
        muc:"conference.192.168.0.150",
        anonymousdomain:"192.168.0.150"
    },
    bosh :"https://192.168.0.150/http-bind"
};

const confOption=