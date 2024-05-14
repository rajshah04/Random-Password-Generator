const inputSlider = document.querySelector("[data-lengthSlider]") ;
const lengthDisplay = document.querySelector("[data-lengthNumber]") ;

const passwordDisplay = document.querySelector("[data-passwordDisplay]") ;
const copyBtn = document.querySelector("[data-copy]") ;
const copyMsg = document.querySelector("[data-copyMsg]") ;
// const copyMsg = document.getElementsByClassName(".tooltip") ;
const requirementsMsg = document.querySelector("[data-requirementsMsg]") ;
const uppercaseCheck = document.querySelector("#uppercase") ;
const lowercaseCheck = document.querySelector("#lowercase") ;
const numbersCheck = document.querySelector("#numbers") ;
const symbolsCheck = document.querySelector("#symbols") ;
const indicator = document.querySelector("[data-indicator]") ;
const generateBtn = document.querySelector(".generateButton") ;
const allCheckBox = document.querySelectorAll("input[type=checkbox]") ;
const symbols = '~`^%$#}@!)(*&]=_+-"<,./?>[{' ;

let password = "" ;
let passwordLength = 10 ;
let checkCount = 0 ;
handleSlider() ;
// set strength circle color to grey
setIndicator("#ccc") ;

// set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength ;
    lengthDisplay.innerText = passwordLength ;

    const min = inputSlider.min ;
    const max = inputSlider.max ;
    // inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%" ;    
    inputSlider.style.backgroundSize = ((passwordLength - 1) * 100 / (max - min)) + "% 100%" ;    
}

function setIndicator(color){
    indicator.style.backgroundColor = color ;
    // add shadow too
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}` ;
}

function getRandInteger(min , max){
    return Math.floor(Math.random() * (max - min)) + min ;
}

function generateRandomNumber(){
    return getRandInteger(0 , 9) ;
}

function generateLowerCase(){
    return String.fromCharCode(getRandInteger(97 , 123)) ;
}

function generateUpperCase(){
    return String.fromCharCode(getRandInteger(65 , 91)) ;
}

function generateSymbol(){
    return symbols[getRandInteger(0 , symbols.length)] ;
}

function calculateStrength(){
    let hasUpper = false ;
    let hasLower = false ;
    let hasNum = false ;
    let hasSym = false ;

    if(uppercaseCheck.checked) hasUpper = true ;
    if(lowercaseCheck.checked) hasLower = true ;
    if(numbersCheck.checked) hasNum = true ;
    if(symbolsCheck.checked) hasSym = true ;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0") ;
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0") ;
    }
    else{
        setIndicator("#f00") ;
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value) ;
        copyMsg.innerText = "Copied" ;
    }
    catch(e){
        copyMsg.innerText = "Failed" ;
    }

    copyMsg.classList.add('active') ;

    setTimeout(()=>{
        copyMsg.classList.remove('active') ;
    }, 2000) ;
}

function shufflePassword(arr) {
    // Fisher Yates Method
    for(let i = arr.length - 1 ; i > 0 ; i--){
        const j = Math.floor(Math.random() * (i + 1)) ;
        const temp = arr[i] ;
        arr[i] = arr[j] ;
        arr[j] = temp ;
    }

    let str = "" ;
    arr.forEach((ele) => (str += ele)) ;
    return str ;
}

function handleCheckBoxChange() {
    checkCount = 0 ;
    allCheckBox.forEach( (checkbox) => {
        checkCount++ ;
    })

    // corner case
    if(passwordLength < checkCount){
        passwordLength = checkCount ;
        handleSlider() ;
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange) ;
})

// adjusting the passwordLength acc to the slider
inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value ;
    handleSlider() ;
})

// copying the content if available
copyBtn.addEventListener('click' , () => {
    // if(passwordDisplay.value){
    //     copyContent() ;
    // }
    const pass = passwordDisplay.value ;
    if(pass.length > 0){
        copyContent() ;
    }
})

dispMsg2 = () => {
    // requirementsMsg.innerText = "Please select the requirements." ;
    requirementsMsg.classList.add("dispMsgActive") ;

    let x = window.matchMedia("(max-width :350px)") ;
    dispMsg2MQ(x) ;

    setTimeout(() => {
        requirementsMsg.classList.remove("dispMsgActive") ;
    }, 3000) ;
}

dispMsg2MQ = (x) => {
    if(x.matches){
        alert("Please select the requirements.") ;
        requirementsMsg.classList.remove("dispMsgActive") ;
    }
}

generateBtn.addEventListener('click' , () => {
    // none of the checkboxes are selected
    // if(checkCount == 0) return ;
    if(checkCount == 0) dispMsg2();
    // if(checkCount <= 0) return ;

    if(passwordLength < checkCount){
        passwordLength = checkCount ;
        handleSlider() ;
    }

    // let's start our journey to find new password

    // remove old password
    password = "" ;

    let funcArr = [] ;

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase) ;

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase) ;

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber) ;

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol) ;

    // compulsory addition
    // we are doing this compulsory addition because , if a checkbox is selected , then it should be present in the password too 
    for(let i = 0 ; i < funcArr.length ; i++){
        password += funcArr[i]() ;
    }

    // remaining addition
    for(let i = 0 ; i < passwordLength - funcArr.length; i++){
        let randIndex = getRandInteger(0 , funcArr.length) ;
        password += funcArr[randIndex]() ;
    }

    // shuffle the password
    password = shufflePassword(Array.from(password)) ;

    // show password in UI
    passwordDisplay.value = password ;

    // calculate the strength
    calculateStrength() ;
})

// try adding a msg when user clicks on generateButton withour checking the requirements -- done

// adding media query using javascript
// let x = window.matchMedia("(max-width :350px)") ;
// dispMsg2MQ(x) ;