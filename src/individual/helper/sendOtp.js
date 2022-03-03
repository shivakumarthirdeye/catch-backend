import axios from "axios";
require("dotenv").config();

async function sendOtp(val) {
  try {
    const { data } = await axios.get(
      `http://bhashsms.com/api/sendmsg.php?user=ameenreddy&pass=123&sender=TEINNO&phone=${val.phone}&text=Dear%20Customer,%${val.otp}%20is%20your%20OTP.%20Do%20not%20share%20this%20OTP%20with%20anyone.%20Thank%20you.%20-%20TEINNO&priority=ndnd&stype=normal`
    );
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
}

module.exports = sendOtp;
