const isValidEmail = function (email) {
    
    let regex =/^[a-z0-9](\.?[a-z0-9]){1,}@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/
    return regex.test(email)

};

const isValidPhone = function (phone) {
    
    let regex =/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/
    return regex.test(phone)

};


module.exports={isValidEmail,isValidPhone}