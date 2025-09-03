export function validate(email, username = null , password, confirmPassword = null){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,20}$/;
    const usernameRegex = /^(?=.{3,16}$)[a-zA-Z0-9._]+(?<![_.])$/;

    if(!emailRegex.test(email)){
        return 'Email Invalid'
    }
    if(username!=null && !usernameRegex.test(username)){
        return 'username Invalid'
    }
    if(confirmPassword!=null && password != confirmPassword){
        return 'Password doesnt Match'
    }
    if(!passwordRegex.test(password)){
        return 'Password not valid'
    }
    return null;
}