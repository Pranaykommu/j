const express = require('express');
const plivo = require('plivo');
const mongoose = require('mongoose');
const notp = require('notp');
const Firstlist = mongoose.model('Firstlist');

const t_secret = 'Sun0624';

const router = express.Router();


router.post('/addtofirstlist', async (req, res) => {
    console.log(req);
    const {phone} = req.query;

    try {
	    const otp=notp.totp.gen(t_secret,[phone],time=60);
        console.log('created otp is ', otp);
        const olduser = await Firstlist.findOneAndUpdate({ phone: phone },
            { $set: { otp: otp } },
            { new: true });
        if (!olduser || olduser.length===0){
            //lets create a new user
            const user = await Firstlist.create({ phone: phone, otp: otp });
            if(!user || user.length===0){
                console.log('no user');
                res.status(422).send(err.message);
            } else {
                console.log('fetched otp is',user.otp, 'fetched phone is',user.phone);
                let client = new plivo.Client('MAYJG5MMRKZDBLZTEWOG', 'ZDRjYTUyODYwMjBmNGJhOWJkZjljNmRlYTI1NjQy');
                client.messages.create(
                    '+919394828908',
                    '+916304614701',
                    `Your Otp is ${user.otp}`
                ).then((message_created)=>{
                    console.log('successsss',message_created);
                    res.send(user.phone);
                }).catch((err)=>{
                    console.log('err is', err);
                    // await Firstlist.deleteOne({ phone: phone, otp: otp });
                    res.status(422).send(err.message);
                });
            }
        } else {
            //
            console.log('old user det', olduser.otp, olduser.phone);
            let client = new plivo.Client('MAYJG5MMRKZDBLZTEWOG', 'ZDRjYTUyODYwMjBmNGJhOWJkZjljNmRlYTI1NjQy');
                client.messages.create(
                    '+919394828908',
                    '+916304614701',
                    `Your Otp is ${olduser.otp}`
                ).then((message_created)=>{
                    console.log('successsss',message_created);
                    res.send(olduser.phone);
                }).catch((err)=>{
                    console.log('err is', err);
                    // await Firstlist.deleteOne({ phone: phone, otp: otp });
                    res.status(422).send(err.message);
                });
        }
    } catch (err) {        
        console.log('caught erroe :',err);
        return res.status(422).send(err.message);
    }
});


router.post('/verify', async (req, res) => {
    console.log('verify req is: ',req);
        const { phone, otp } = req.query;
        
        try {
        console.log('phone: ',phone, 'otp: ', otp);
            const user = await Firstlist.findOneAndUpdate({ phone: phone, otp: otp },
                { $set: { added: 'true' } },
                { new: true });
            if(!user || user.length===0) {
            console.log('no user to verufy');
                res.status(422).send('incorrect verification code');
            } else {
                console.log('user user: ', user);
                res.send('success');
            }
    
        } catch (err) {
    
            console.log('err', err);
            return res.status(422).send(err);
        }    
    });
    
    module.exports = router;
    