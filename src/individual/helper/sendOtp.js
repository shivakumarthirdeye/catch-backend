import axios from 'axios'
require('dotenv').config();


async function sendOtp(val) {
    try{
        const { data } = await axios.get(`https://api.msg91.com/api/v5/otp?template_id=6163f7d2b67db544bd014b38&mobile=${val.phone}&authkey=352965AGRc89Jv9612dcdc5P1&otp=${val.otp}`)
        console.log(data)
        return data
    } catch(e){
        console.log(e)
    }
}

module.exports = sendOtp;