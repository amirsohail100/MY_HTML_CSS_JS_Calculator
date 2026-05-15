const outputBox = document.querySelector(".output-box");
const buts = document.querySelectorAll(".but");
const butSs = document.querySelectorAll(".but-s");
const butSins = document.querySelectorAll(".but-sin");
const delBut = document.querySelector(".delBut");

const numList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

let butSinbool = false;
let output = "";

function intToStr(num) {
    return `${num}`;
}

function removeN_1(num) {
    let n = num.length;
    let newNum = "";
    for (let i = 0; i < n - 1; i++) {
        newNum = newNum + num[i];
    }
    return newNum;
}

function removeN_2(num) {
    let n = num.length;
    let newNum = "";
    let en = num[n-1]
    for (let i = 0; i < n - 2; i++) {
        newNum = newNum + num[i];
    }
    return newNum+en;
}

function ronFlo(floNum,n) {
    let strNum = `${floNum}`;
    let tf = false;
    for(let j=0;j<strNum.length;j++){
        if(strNum[j] === "."){
            tf = true;
            break;
        }else{
            tf = false;
        }
    }
    if(tf){
        let listFlo = strNum.split(".");
        let ans = listFlo[0] +".";
        for(let i=0;i<n-1;i+=2){
            ans = ans + listFlo[1][i] + listFlo[1][i+1];
        }
        return ans;
    }else{
        return strNum;
    }
    
}

function typeFlo(list) {
    let maxNum = 99999;
    let val = list[0];
    let ans1 = 0;
    let ans2 = 0;
    for (let i = 0; i < maxNum; i++) {
        if (val == i) {
            ans1 = ans1 + i;
        }
    }
    let maxFlo = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    let flo = `0.${list[1]}`;
    i = 0
    while (i < maxFlo.length) {
        if (flo == maxFlo[i]) {
            ans2 = ans2 + maxFlo[i];
        }
        i++;
    }
    return (ans1 + ans2);
}

function typeIntList(strList) {
    let maxNum = 99999;
    let findListInt = [];
    for (let val of strList) {
        for (let i = 0; i < maxNum; i++) {
            if (val == i) {
                findListInt.push(i);
            }
        }
        for (let j = 0; j < val.length; j++) {
            if (val[j] === ".") {
                let l = val.split(".");
                findListInt.push(typeFlo(l));
            }
        }
    }
    return findListInt;
}

function changeSin(intList, sinList) {
    let newList = [];
    for (let i = 0; i < intList.length; i++) {
        newList.push(intList[i]);
        if (i < sinList.length);
            newList.push(sinList[i]);
    }
    return newList;
}

function NEPO(bothList) {
    let po = bothList[0];
    let ne = 0;
    let mu = 1;
    let dv = 0;
    let i = 1;
    while (i < bothList.length) {
        if (bothList[i] === "+") {
            po = po + bothList[i + 1];
        } else if (bothList[i] === "-") {
            ne = ne + bothList[i + 1];
        } else if (bothList[i] === "x") {
            mu = mu * bothList[i + 1];
        } else if (bothList[i] === "/") {
            dv = dv + bothList[i + 1];
        }
        i++;
    }
    ne = (2 * -ne) + ne;
    if (dv === 0) {
        dv = 1;
        return ((ne + po) * mu) / dv;
    }
    return ((ne + po) * mu) / dv;
}

function myFuns(output) {
    let a = output + "_";
    let sins = ["%", "/", "-", "+", "x", "_"];
    let findSins = [];
    let strSplit = [];
    let st = 0;
    let p = 0;
    let temp = 0;
    while (p < a.length) {
        for (let sin of sins) {
            if (a[p] === sin) {
                temp = p - 1;
                let str = "";
                for (let i = st; i <= temp; i++) {
                    str = str + a[i];
                }
                strSplit.push(str);
                st = p + 1;
                if (sin != "_") {
                    findSins.push(sin);
                }
            }
        }
        p++;
    }
    let intList = typeIntList(strSplit);
    let both = changeSin(intList, findSins);
    return NEPO(both);
}

const enDisabled = (but)=>{
    for(let b of but){
        b.disabled = false;
    }
}



delBut.addEventListener("click", () => {
    if (delBut.textContent === "DEL") {
        output = removeN_1(output);
        outputBox.innerText = output;
    }
})


butSins.forEach((butsin) => {
    butsin.addEventListener("click", () => {
        if (output.length < 13) {
            let n = output.length;
            output = output + butsin.textContent;
            outputBox.innerText = output;
            if(butsin.textContent === "x"){
                if(output[n-1] === "/" || output[n-1] === "-" || output[n-1] === "+"){
                    output = removeN_2(output);
                    outputBox.innerText = output;
                }
                enDisabled(butSins);
                butsin.disabled = true;
            }else if(butsin.textContent === "-"){
                if(output[n-1] === "/" || output[n-1] === "x" || output[n-1] === "+"){
                    output = removeN_2(output);
                    outputBox.innerText = output;
                }
                enDisabled(butSins);
                butsin.disabled = true;
            }else if(butsin.textContent === "+"){
                if(output[n-1] === "/" || output[n-1] === "-" || output[n-1] === "x"){
                    output = removeN_2(output);
                    outputBox.innerText = output;
                }
                enDisabled(butSins);
                butsin.disabled = true;
            }else if(butsin.textContent === "/"){
                if(output[n-1] === "x" || output[n-1] === "-" || output[n-1] === "+"){
                    output = removeN_2(output);
                    outputBox.innerText = output;
                }
                enDisabled(butSins);
                butsin.disabled = true;
            }
            butSs.forEach((butS) => {
                butS.addEventListener("click", () => {
                    if (butS.textContent === "CE") {
                        output = "";
                        outputBox.innerText = 0;
                        enDisabled(butSins);
                    } else if (butS.textContent === "DEL") {
                        enDisabled(butSins);
                    } else if (butS.textContent === "=") {
                        output = ronFlo(myFuns(output),2);
                        outputBox.innerText = output;
                        enDisabled(butSins);
                    }
                })
            })
        }
    })
})

function butNumFun(butSins) {
    buts.forEach((but) => {
        but.addEventListener("click", () => {
            if (output.length < 13) {
                let n = output.length;
                output = output + but.textContent;
                outputBox.innerText = output;
                if(output[n] !== "/" || output[n] !== "-" || output[n] !== "+" || output[n] !== "x"){
                    enDisabled(butSins);
                }
            }
        })
    })
}
butNumFun(butSins);
