const expess = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const { privateDecrypt } = require('crypto');
const exp = require('constants');
const { appendFile } = require('fs');
const hostname = '0.0.0.0';     
const PORT = 8080;
const APP_ID = "615f724e7f5347f0bd569b403a1ab4e6";
const APP_CERITIFICATE = "2272aaf9612d45c7818629496183cdc6";

const app = expess();
const nocache = (req, resp, next) => {
    resp.header('Cache-control', 'private , no-cache , no-store ,must-revalidate');
    resp.header('Express', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

const generateAccessToken = (req, res) => {
    //set response header
    res.header('Acess-Control-Allow-Origin', '*');
    // get channel name
    const channelName = voice-call;

    if (!channelName) {
        return res.status(500).json({ 'error': 'channel is required' });
    }
    // get uid
    let uid = req.query.uid;

    if (!uid || uid == '') {

        uid = 0;
    }
    //get role

    let role = RtcRole.SUBSCRIBER;
    if (req.query.role == 'publisher') {
        role = RtcRole.PUBLISHER;
    }
    //get the expre time

    let expireTime = req.query.expireTime;
    if (!expireTime || expireTime == '') {
        expireTime = 3600;
    }

    // calculate privilege expire time

    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    // build the token 
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERITIFICATE, channelName, uid, role, privilegeExpireTime);
    return res.json({

        'token': token
    });
    // require the token 
}
app.get('/access-token', nocache, generateAccessToken);
app.listen(PORT, () => {
    console.log(`listining the port: ${PORT}`);
    nocache();
    generateAccessToken();
})