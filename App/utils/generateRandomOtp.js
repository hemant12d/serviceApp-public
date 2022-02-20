const generateRandomOtp = () =>{
    // Default random range range 0.01 to 1.00 
    let otp = Math.floor(Math.random()*1_000_0);

    if(otp < 1000){
       otp = ( otp.toString() + (Math.floor(Math.random()*10)).toString() ) * 1;
    }

    return otp;
}

export default generateRandomOtp;