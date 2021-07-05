const express = require('express');
const plivo = require('plivo');
const mongoose = require('mongoose');
const notp = require('notp');
const Firstlist = mongoose.model('Firstlist');

const t_secret = 'Sun0624';

const router = express.Router();


router.post('/addtofirstlist', async (req, res) => {
    const { phone } = req.query;

    try {
        const otp=notp.totp.gen(t_secret,[user.phone],time=60);
        console.log('otp is ', otp)
        const user = await Firstlist.create({ phone: phone, otp: otp });
        if(!user){
            res.status(422).send(err.message);
        } else {
            console.log('otp is',user.otp, 'user id is',user.phone);
            let client = new plivo.Client('auth_id', 'auth_token');
            client.messages.create(
                '+919394828908',
                '+916304614701',
                `Your Otp is ${user.phone}`
            ).then((message_created)=>{
                console.log(message_created);
                res.send(`${user.phone}`);
            }).catch(async(err)=>{
                console.log('err is', err);
                await Firstlist.deleteOne({ phone: phone, otp: otp });
                res.status(422).send(err.message);
            });
        }
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post('/verify', async (req, res) => {
    const { phone, otp } = req.query;
    
    try {
        console.log('phone: ',phone, 'otp: ', otp);
        const user = await Firstlist.findOneAndUpdate({ phone: phone, otp: otp },
            { $set: { added: 'true' } },
            { new: true });
        if(!user) {
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