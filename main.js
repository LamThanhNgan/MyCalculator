// constants & variables
const topScreen = document.getElementById("nums-top"); //lây các số ở pần trên màn hình
const bottomScreen = document.getElementById("nums-bottom"); //lấy các số ở phần dưới màn hình 
const buttons = document.getElementsByClassName("button")
const colors = ["#294192", "#2f4d0d", "#790979", "#811414"];   //tạo mảng color
//tạo đối tượng bàn phím
const calcValues = {
    num1: "1", num2: "2", num3: "3", num4: "4", num5: "5", num6: "6",
    num7: "7", num8: "8", num9: "9", num0: "0", comma: ",", sum: "+",
    substract: "-", divide: "÷", multiply: "x", factorial: "!", overX: "1/",
    equalTo: "=", squareRoot: "√", cubeRoot: "∛", squarePower: "²",
    pi: "3,1415926535897932384", euler: "2,7182818284590452353"};

var givenResult = false;
var resultValue = "0";
var colorNum = 0;
var record = [];


function setUp() {
    for (idName of buttons) {
        buttonAction(idName);
    }
}

function buttonAction(input) {
    let specialValues = [
        "equalTo", "overX", "factorial", "squareRoot", "cubeRoot",
        "squarePower", "divide", "multiply", "sum", "substract"];    /* = , 1/X, ! can , can bac 3, can2, +-* chia binh*/ 
    /*Nếu input.id có trong mảng trên  - Các dấu => bắt sự kiện theo hàm process*/ 
    if (specialValues.includes(input.id)) {
        input.addEventListener(
            "click", () => processValue(input.id), false);
    }
    else{
        // là số =>bắt sự kiện theo hàm bottom
        input.addEventListener(
            "click", () => bottomScreenPrint(input.id), false);
    }
}

/*Tính toán*/ 
function arithmeticSection(total, symbol, number) {
    switch (symbol) {
        case "+": return total + parseFloat(number);
        case "-": return total - parseFloat(number);
        case "x": return total * parseFloat(number);
        case "÷": return total / parseFloat(number);
    }
}


function scientificSection(symbol) {
    let number = parseFloat(bottomScreen.innerHTML.replace(",", "."));

    if (wrongInput(number, symbol)) {
        bottomScreen.innerHTML = wrongInput(number, symbol);
        return "error"
    }

    switch (symbol) {
        case "1/": return 1 / number;
        case "√":  return Math.sqrt(number);
        case "∛":  return Math.cbrt(number);
        case "²":  return Math.pow(number, 2);

        case "!":
            if (number === 0) {return 1}
            let inputNumber = number;

            for (num=1; num < inputNumber; num++) {number *= num}
            return number;
    }
}


function calculateValues(history) {
    if (Number.isNaN(parseFloat(history[0]))) {history.unshift("0")}
    let result = parseFloat(history[0]);
    
    for (value in history) {
        let numberAndSymbol = [history[value -1], history[value]];

        // Arithmetic section
        if (["+", "-", "x", "÷"].includes(history[value - 1])) {
            result = arithmeticSection(result, ...numberAndSymbol);
        }

        // Scientific section
        else if (["1/", "!", "√", "∛", "²"].includes(history[value])) {
            result = scientificSection(numberAndSymbol[1]);
        }
    }

    if (result === "error") {record = [], resultValue = "0"}
    return result;
}


function wrongInput(number, symbol) {
    number = number.toString()
    console.log(number);
    let factorialError    = symbol === "!"  && number.includes("-", ".");
    let rootError         = symbol === "√"  && number[0] === "-";
    let zeroDivisionError = symbol === "1/" && number === undefined;

    if      (factorialError || rootError)  {return "Invalid Input"}
    else if (zeroDivisionError) {return "You can't divide by zero"}
}


function topScreenPrint(total) {
    let symbol = record.slice(-1)[0];
    let preSymbol
    let preTotal
    let preProcess

    if (record.length >= 4 && symbol) {
        preTotal = calculateValues(record.slice(0, -2)).toString();
        preSymbol = record.slice(-3)[0];
        preProcess = `${preTotal} ${preSymbol}`;
    }

    else if (record.length < 4 && symbol !== "=") {preProcess = ""}
    let screenNumber = bottomScreen.innerHTML;

    switch (symbol) {
        case "!":
        case "²":
            topScreen.innerHTML =
                `${preProcess} (${screenNumber})${symbol}`;
            break;

        case "1/":
        case "√":
        case "∛":
            topScreen.innerHTML =
                `${preProcess} ${symbol}(${screenNumber})`;
            break;

        case "=":
            topScreen.innerHTML += " =";
            break
    }
    if (symbol !== "=" && record.length >= 4) {record = [preTotal, preSymbol]}
    else if (symbol === "=" || record.length < 4) {record = []}

    resultValue = total;
    givenResult = true;
}


function screenModification(total) {
    
    topScreen.innerHTML = "";
    total = total.toString();

    if (total === "Infinity") {
        bottomScreenPrint("clear");
        return bottomScreen.innerHTML = "You can't divide by zero";
    }

    for (value in record) {
        if (["1/", "!", "√", "∛", "²", "="].includes(record[value])) {
            topScreenPrint(total);
            break;
        }
        topScreen.innerHTML += ` ${record[value].replace(".", ",")}`;
    }

    if (total !== "error") {bottomScreen.innerHTML = total.replace(".", ",")}
}


function processValue(sym) {

    if (resultValue.slice(-1) === ",") {
        resultValue = resultValue.slice(0, -1)
    }
    record.push(resultValue.replace(",", "."), calcValues[sym]);

    if (record.slice(-2)[0] === "0" && record.slice(-1)[0] !== "=" && record.length === 2) {
        record = record.slice(0, -3);
        record.push(calcValues[sym]);
    }

    screenModification(calculateValues(record));

    if (["1/", "!", "√", "∛", "²", "="].includes(calcValues[sym]) === false) {
        resultValue = "0"}
}

function bottomScreenPrint(sym) {
    //sym = id 
    givenResultCheck(sym);

    if (["clear", "ce"].includes(sym) || sum == "del"
    && resultValue.length === 1 || sym === "num0"
    && (resultValue === "" || resultValue === "0")) {
        resultValue = "0";
    }

    if (sym === "clear") {
        topScreen.innerHTML = "";
        bottomScreen.innerHTML= "";
        record = [];
    }
    else if (sym.includes("num") || sym === "comma"
    && resultValue.includes(",") === false) {
        if (resultValue === "0" && sym !== "comma") {resultValue = ""}
        resultValue += calcValues[sym];
    }

    else if (["pi", "euler"].includes(sym)) {
        resultValue = calcValues[sym];
    }

    else if (sym === "negate" && resultValue !== "0") {
        if      (resultValue[0] !== "-") {resultValue = "-" + resultValue}
        else if (resultValue[0] === "-") {resultValue = resultValue.slice(1)}
    }

    else if (sym=="del" && resultValue.length > 1) {
        resultValue = resultValue.slice(0, -1);
    }
    bottomScreen.innerHTML = resultValue;
}

function givenResultCheck(sym) {
    /*Sau khi trả kết quả về : 
    * 1. nếu người dùng nhập số => xóa màn hình 
    * 2. nếu người dùng tiếp tục tính toán => thêm vào tính tiếp  
    */
    if (givenResult && sym !== "negate" && [0, 3].includes(record.length)) {
        givenResult = false;
        resultValue = "0";
        record = [];
        topScreen.innerHTML = "";
    }
}
window.addEventListener('load', setUp, false);  // Starts the script
