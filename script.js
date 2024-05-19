let myPassword = document.querySelector("[myPassword]");
let myCopyBtn = document.querySelector("[copyIcon]");
let myCopyMsg = document.querySelector("[copyMsg]");

let myLength = document.querySelector("#mylength");
let mySlider = document.querySelector("#myRange");

let myUpperCase = document.querySelector("[upperCase]");
let myLowerCase = document.querySelector("[lowerCase]");
let myNumbers = document.querySelector("[numbers]");
let mySymbols = document.querySelector("[symbols]");
let myAllCheckBoxes = document.querySelectorAll("[type=checkbox]");

let myStrength = document.querySelector("#passwordStrength");

let myGenerateButton = document.querySelector("[button]");

let myInnerLength = parseInt(myLength.innerText);

let symbols = '`~!@#$%^&*()_+"-=/*-+[{]};:,.|<>?';

let password = "";
let passwordLength = 10;
let checkCounter = 0;

// console.log(length);

function handleSlider() {
  mySlider.value = passwordLength;
  myLength.innerText = passwordLength;
  const max = mySlider.max;
  const min = mySlider.min;
  mySlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}
handleSlider();

function getRanInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getRanUpperCase() {
  return String.fromCharCode(getRanInteger(65, 91));
}

function getRanLowerCase() {
  return String.fromCharCode(getRanInteger(97, 123));
}

function getRanNumber() {
  return getRanInteger(0, 9);
}

function getRanSymbols() {
  const ranNumber = getRanInteger(0, symbols.length);
  return symbols[ranNumber];
}

// console.log(myStrength)

function indicator(color) {
  myStrength.style.backgroundColor = color;
}

function colorGenerator() {
  let upperCaseCheck = false;
  let lowerCaseCheck = false;
  let numberCheck = false;
  let symbolCheck = false;

  if (myUpperCase.checked) upperCaseCheck = true;
  if (myLowerCase.checked) lowerCaseCheck = true;
  if (myNumbers.checked) numberCheck = true;
  if (mySymbols.checked) symbolCheck = true;

  if (
    upperCaseCheck &&
    lowerCaseCheck &&
    (numberCheck || symbolCheck) &&
    passwordLength >= 8
  )
    indicator("#0f0");
  else if (
    (upperCaseCheck || lowerCaseCheck) &&
    (numberCheck || symbolCheck) &&
    passwordLength >= 6
  )
    indicator("#ff0");
  else indicator("#f00");
}

// console.log(myCopyMsg.classList.remove('hidden'));
// console.log(myCopyMsg.classList);

async function copyContent() {
  try {
    await navigator.clipboard.writeText(myPassword.value);
    myCopyBtn.addEventListener("click", () => {
      myCopyMsg.classList.remove("hidden");
      myCopyMsg.innerText = "Copied";
    });
    setTimeout(() => {
      myCopyMsg.classList.add("hidden");
    }, 1000);
  } catch (e) {
    myCopyMsg.innerText = "Failed";
  }
}

// shuffle function goes here...

function shufflePassword(array) {
  // fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

mySlider.addEventListener("input", (e) => {
  // console.log(e.target.value);
  passwordLength = e.target.value;
  handleSlider();
});

myCopyBtn.addEventListener("click", () => {
  if (myPassword.value) copyContent();
});

function handleCheckCount() {
  checkCounter = 0;
  myAllCheckBoxes.forEach((checkbox) => {
    if (checkbox.checked) checkCounter++;
    if (myLength.innerText < checkCounter) {
      mySlider.value = checkCounter;
      handleSlider();
    }
  });
  // console.log(myLength.innerText);
}

myAllCheckBoxes.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckCount);
});

myGenerateButton.addEventListener("click", () => {
  if (checkCounter <= 0) return;
  // console.log(myLength.innerText);
  // console.log(mySlider.value);

  if (myLength.innerText < checkCounter) {
    myLength.innerText = checkCounter;
    mySlider.value = checkCounter;

    // console.log("hello")
  }

  password = "";

  let myArray = []; // very special for me 'coz its an array of ***functions*** as mentioned below.

  // console.log(myArray)
  if (myUpperCase.checked) {
    myArray.push(getRanUpperCase);
  }
  if (myLowerCase.checked) {
    myArray.push(getRanLowerCase);
  }
  if (myNumbers.checked) {
    myArray.push(getRanNumber);
  }
  if (mySymbols.checked) {
    myArray.push(getRanSymbols);
  }
  console.log("This is array of functins: ", myArray);
  // compulsary element's
  for (let i = 0; i < myArray.length; i++) {
    password += myArray[i]();
  }

  /*Note: 
    ***Question: Can't we call functions during pushing into the array, rather than calling them inside the loop?

    ****Answer: Technically, you could call the functions while pushing them into myArray,like this
        if (myUpperCase.checked) {
            password += getRanUpperCase();
        }
        if (myLowerCase.checked) {
            password += getRanLowerCase();
        }
        // Repeat for other conditions...

    ***but doing so might not give you the desired behavior. Let's see why:

    myArray[i]() gives me more flexibility because Array stores functions and it is called inside the loop which gives us new values every time && ****** if we are calling it during the pushing of elements then the array will have fixed values and that same fixed values will be used for the remaining elements array as its for loop written below... */

  // console.log(typeof(myLength.innerText-myArray.length));
  // console.log(myLength.value-myArray.length);
  // remaining ele's

  for (let i = 0; i < myLength.innerText - myArray.length; i++) {
    let ranIndex = getRanInteger(0, myArray.length);
    password += myArray[ranIndex]();
  }

  // shuffle the password

  password = shufflePassword(Array.from(password));

  // showing in UI
  myPassword.value = password;

  // calculate strength
  colorGenerator();
});
