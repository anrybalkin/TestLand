"use strict"
/**
 * change class fo showinh button
 * @param {*} id prefix id  button
 */
function showBtn(id) {
    let el = document.querySelector("." + id + "-btn-block");
    el.classList.remove("visibility-off");
    el.classList.add("visibilitybtn-on");
}

/**
 * Show next section content and hide old
 * @param {*} id next id section
 * @param {*} previd old id section
 */
function showNextStep(id, previd) {

    let nextEl = document.getElementById(id);
    let current = document.getElementById(previd);
    current.classList.toggle("visibilitysect-on");
    current.classList.toggle("visibility-off");
    nextEl.classList.toggle("visibilitysect-on");
    nextEl.classList.toggle("visibility-off");
}
/**
 * init Event Listeners on radiobutton to show btn by values id from array
 * @param {*} array Array ids
 * @param {*} sectionid id section for funtion which one will show button
 */
function initShow(array, sectionid) {
    for (let el of array) {
        document.getElementById(el).addEventListener("change", (e) => {
            showBtn(sectionid, e.target)
        });
    }
}
/**
 * init click events to show next content 
 * @param {*} array array prefix ids 
 */
function initBtn(array) {
    for (let el of array) {
        let previd = document.getElementById(el + "-btn").attributes.next.value;
        document.getElementById(el + "-btn").addEventListener("click", (e) => {
            showNextStep(el, previd)
        });
    }
}
/**
 * toggle error if exist
 */
function showError() {
    let el = document.querySelector(".error");
    el.classList.toggle("visibility-off");
    el.classList.toggle("visibilitysect-on");
}
/**
 * Show name and picture of astronomical symbols
 * @param {*} array 
 */
function showSymbol(array) {
    let errorN = document.querySelector(".error");
    let symbol = document.querySelector(".symbol");
    let symbolName = document.querySelector(".symbol-name");
    symbol.className = "";
    symbol.classList.add("symbol");
    symbol.classList.add(array[1]);
    symbol.classList.remove("visibility-off");
    symbol.classList.add("visibilitysect-on");
    symbolName.innerHTML = array[0];
    symbolName.classList.remove("visibility-off");
    symbolName.classList.add("visibilitysect-on");
    if (errorN.className.includes("visibilitysect-on")) {
        symbol.classList.toggle("visibility-off");
        symbol.classList.toggle("visibilitysect-on");
    }
}
/**
 * Get name and id symbol from array
 * @returns array with id sybmbol and name  
 */
function getAstroSymbol() {
    let day, month;
    day = parseInt(document.querySelector("select[name='day']").value);
    month = parseInt(document.querySelector("select[name='month']").value);

    for (let el of astroSym) {
        let begin = el.first_date.split(".");
        let end = el.last_date.split(".");
        console.log(day, month, el);
        if ((day <= end[0] && month == end[1]) || (day >= begin[0] && month == begin[1])) {
            return [el.name, el.id];
        }
    }


}
/**
 * validate birthday
 */
function checkState() {
    let day, month, year;
    day = document.querySelector("select[name='day']").value;
    month = document.querySelector("select[name='month']").value;
    year = document.querySelector("select[name='year']").value;
    if (day != 0 && month != 0 && year != 0) {
        showSymbol(getAstroSymbol());
        showBtn("step5");
    }
}
/**
 * animation progress bar on 6 step content
 */
function animateFinal() {
    showNextStep("step5", "step6");
    document.querySelector(".footer-text").innerHTML = "";
    let elements = document.querySelectorAll(".status-task");
    let counter = 0;
    let iterator = 0;
    let timerInterval = setInterval(() => {

        if (counter == 100) {
            document.querySelector("footer").style.transform="translate(0, 50%)";
            document.getElementById("step6").innerHTML = document.getElementById("step6").innerHTML + '<div class="progress-status black-blue-color">Готово!</div>';
            showNextStep("step6", "step7");
            let temp = "<div class='footer-advtext'>TERMENI SI CONDITII: ACESTA ESTE UN SERVICIU DE DIVERTISMENT. PRIN FOLOSIREA LUI DECLARATI CA AVETI 18</div>";
            document.querySelector("footer .wrapper").innerHTML = temp + document.querySelector("footer .wrapper").innerHTML;
            document.querySelector(".footer-text").innerHTML = "2020 © horoscop personal";
            return clearInterval(timerInterval);
        }
        counter++;
        document.querySelector(".into-progress-req").innerHTML = counter + "%";
        document.querySelector(".into-progress-req").style.width = counter + "%";
        if (iterator !== 7) {
            elements[iterator].classList.remove("process");
            elements[iterator].classList.add("complete");
            elements[iterator].innerHTML = "Выполнено!";
        }

        iterator = counter % 14 == 0 ? iterator + 1 : iterator;

    }, 100);;


}
/**
 * show data form obj and request dependencies
 * @param {*} obj initial object 
 */
function showData(obj) {
    let sectionData = document.querySelector(".step8-block");

    for (const [key, value] of Object.entries(obj)) {
        if (key == "url" || value == "") continue;

        let block = document.createElement("div");
        let valueEl = document.createElement("div");
        let keyEl = document.createElement("div");
        let ul = document.createElement("ul");

        keyEl.innerHTML = key + ": ";
        keyEl.classList.add("data-key");
        block.classList.add("data-block");
        block.appendChild(keyEl);
        block.appendChild(valueEl);
        sectionData.appendChild(block);
        valueEl.classList.add("data-value");
        valueEl.appendChild(ul);
        if (Array.isArray(value)) {
            for (let el of obj[key]) {
                let oReq = new XMLHttpRequest();

                oReq.open("GET", el, true);
                oReq.send();
                oReq.onload = () => {
                    let tmp = JSON.parse(oReq.responseText);
                    ul.innerHTML = ul.innerHTML + "<li>" +
                        (tmp.name != undefined ? tmp.name : tmp.title) + "</li>"
                }

            }
        } else {
            if (value.includes("https:")) {
                let oReq = new XMLHttpRequest();

                oReq.open("GET", obj[key], true);
                oReq.send();
                oReq.onload = () => {
                    let tmp = JSON.parse(oReq.responseText);
                    valueEl.innerHTML = valueEl.innerHTML +
                        (tmp.name != undefined ? tmp.name : tmp.title)
                }
                continue;
            }
            if (key == "created" || key == "edited") {
                valueEl.innerHTML = value.includes("T") ? value.replace("T", "<br>") : value;
                continue;
            }
            valueEl.innerHTML = value;
        }

    }
}
/**
 * get data from page
 * @param {*} url 
 */
function getData(url) {
    let oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.send();
    oReq.onload = () => {
        showData(JSON.parse(oReq.responseText))
    }

}
/**
 *  A function that will close all select boxes in the document,
    except the current select box: 
 * @param {*} elmnt 
 */
function closeAllSelect(elmnt) {
    let x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

let x, i, j, l, ll, selElmnt, a, b, c;
x = document.getElementsByClassName("custom-select");
l = x.length;

let startIds = ["gender-female", "gender-male"];
let step1Ids = ["times-of-day-morning", "times-of-day-night", "times-of-day-tonight", "times-of-day-daytime"];
let step2Ids = ["insomnia-yes", "insomnia-no", "insomnia-sometimes"];
let step3Ids = ["plans-yes", "plans-no", "plans-sometimes"];
let step4Ids = ["future-fam", "future-trav", "future-career", "future-all"];
let btns = ["start", "step1", "step2", "step3", "step4"];
let astroSym = [{
        "name": "Водолей",
        "id": "aquarius",
        "first_date": "21.1",
        "last_date": "19.2"
    },
    {
        "name": "Рыбы",
        "id": "pisces",
        "first_date": "20.2",
        "last_date": "20.3"
    },
    {
        "name": "Овен",
        "id": "aries",
        "first_date": "21.3",
        "last_date": "20.4"
    },
    {
        "name": "Телец",
        "id": "taurus",
        "first_date": "21.4",
        "last_date": "21.5"
    },
    {
        "name": "Близнецы",
        "id": "gemini",
        "first_date": "22.5",
        "last_date": "21.6"
    },
    {
        "name": "Рак",
        "id": "rak",
        "first_date": "22.6",
        "last_date": "22.7"
    },
    {
        "name": "Лео",
        "id": "leo",
        "first_date": "23.7",
        "last_date": "21.8"
    },
    {
        "name": "Дева",
        "id": "virgo",
        "first_date": "22.8",
        "last_date": "23.9"
    },
    {
        "name": "Весы",
        "id": "libra",
        "first_date": "24.9",
        "last_date": "23.10"
    },
    {
        "name": "Скорпион",
        "id": "scorpio",
        "first_date": "24.10",
        "last_date": "22.11"
    },
    {
        "name": "Стрелец",
        "id": "sagittarius",
        "first_date": "23.11",
        "last_date": "22.12"
    },
    {
        "name": "Козерог",
        "id": "capricorn",
        "first_date": "23.12",
        "last_date": "20.1"
    },
];

let selday = document.querySelector("select[name='day']");
let selmonth = document.querySelector("select[name='month']");
let selyear = document.querySelector("select[name='year']");
let step5btn = document.getElementById("step5-btn");
let step7btn = document.getElementById("step7-btn");



initShow(startIds, "start");
initShow(step1Ids, "step1");
initShow(step2Ids, "step2");
initShow(step3Ids, "step3");
initShow(step4Ids, "step4");
initBtn(btns);
step5btn.addEventListener("click", animateFinal);
step7btn.addEventListener("click", () => {
    showNextStep("step8", "step7");
    getData("https://swapi.dev/api/people/1");
})

if(window.innerWidth<623)
{
    let width=(document.body.clientWidth-30)+"px";
    
    for(let i=1;i<8;i++)
    {
        document.getElementById("step"+i).style.width=width;
    }
}

for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            let y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
            checkState();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}

document.addEventListener("click", closeAllSelect);