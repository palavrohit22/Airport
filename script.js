const datasetobj = {};
const totaldataArray = [];
var allDataArray = [];
var filterArray = [];
var filtertypeArray = [];
var filterArraySearch = [];
var nextClick;
var prevClick;
const ItemperIndex = 4;
var totalcountvalue = 0;
var filtercheckValues = [];
var paginationDataArray = [];
var StartCount;
var EndCount;
var previousbtn;
var nextbtn;

const fetchdata = (start, end) => {
    fetch('data/airports.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            setFieldArrayData(data);
            allDataArray = totaldataArray;
            FilterDatasetformat(allDataArray, start, end)
        })
        .catch(function (err) {
            console.log(err);
        });
}

fetchdata(0, ItemperIndex);

function setFieldArrayData(data) {
    for (let temp of data) {
        this.datasetobj = {
            "Name": temp.name,
            "ICAO": temp.icao,
            "IATA": temp.iata,
            "Elev.": temp.elevation,
            "Lat.": temp.latitude,
            "Long.": temp.longitude,
            "Type": temp.type,
        }
        totaldataArray.push(this.datasetobj);
    }
}

function FilterDatasetformat(allDataArray, start, end) {
    totalcountvalue = allDataArray.length;
    previousbtn = document.querySelector('.prev-span');
    nextbtn = document.querySelector('.next-span');
    if (start <= 0) {
        previousbtn.classList.add('arrow-btn-disabled')
    } else {
        previousbtn.classList.remove('arrow-btn-disabled')
    }
    if (end >= totalcountvalue) {
        nextbtn.classList.add('arrow-btn-disabled')
    } else {
        nextbtn.classList.remove('arrow-btn-disabled')
    }
    const airportData = allDataArray.slice(start, end);
    appendData(airportData);
    const pageStart = start;
    const pageTo = end;
    renderPagination(allDataArray, totalcountvalue, pageStart, pageTo);
    const typeCheckbox = document.querySelectorAll("input[type=checkbox]");
    for (var i = 0; i < typeCheckbox.length; i++) {
        typeCheckbox[i].addEventListener("change", filtertypedata);
    }
    const search = document.querySelector("#searchkeyword");
    search.addEventListener('keypress', searchfilterData)
}

// Search filter Data Value
function searchfilterData(e) {
    if (e.key === 'Enter') {
        if (filtertypeArray.length > 0) {
            filterArray = filtertypeArray;
        } else {
            filterArray = allDataArray;
        }
        filterArray = filterArray.filter((airport) => {
            return (
                airport.Name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                airport.ICAO.toLowerCase().includes(e.target.value.toLowerCase())
            )
        });
        filterArraySearch = filterArray;
        FilterDatasetformat(filterArray, 0, ItemperIndex);
    }
}

// Filter checkbox data
function filtertypedata(e) {
    if (e.target.checked) {
        filtercheckValues.push(e.target.value);
        const checkFilterData = allDataArray.filter((airport) => {
            return (filtercheckValues.some(value => airport.Type.toLowerCase().includes(value.toLowerCase())))
        });
        filterArray = checkFilterData;
        FilterDatasetformat(filterArray, 0, ItemperIndex);
        filtertypeArray = filterArray;
    } else {
        for (var i = 0; i < filtercheckValues.length; i++) {
            if (filtercheckValues[i] === e.target.value) {
                filtercheckValues.splice(i, 1);
                i--;
            }
        }
        const checkFilterData = allDataArray.filter((airport) => {
            return (filtercheckValues.some(value => airport.Type.toLowerCase().includes(value.toLowerCase())))
        });
        filterArray = checkFilterData;
        FilterDatasetformat(filterArray, 0, ItemperIndex);
        filtertypeArray = filterArray;
    }
    if (filtercheckValues.length === 0) {
        filterArray = allDataArray;
        FilterDatasetformat(filterArray, 0, ItemperIndex);
        filtertypeArray = filterArray;
    }
}

// append data and bind and create table view 
function appendData(data) {
    var col = [];
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    var table = document.createElement("table");
    var tr = table.insertRow(-1);
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    // add json data to the table.
    for (var i = 0; i < data.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i][col[j]];
        }
    }
    var divShowData = document.getElementById('tableview');
    divShowData.innerHTML = "";
    divShowData.appendChild(table);
};

// pagination
const renderPagination = (allDataArray, totalcountvalue, startCount, endCount) => {
    setRecords(startCount, endCount);
    const totalCountSpan = document.querySelector(".totalcountvalue");
    nextClick = document.querySelector('.next-span');
    prevClick = document.querySelector('.prev-span');
    if (prevClick) {
        prevClick.addEventListener('click', prevpageData);
    }

    if (nextClick) {
        nextClick.addEventListener('click', nextpagedata);
    }
    totalCountSpan.innerHTML = totalcountvalue;
    paginationDataArray = allDataArray;
    StartCount = startCount;
    EndCount = endCount;
};

function setRecords(startCount, endCount) {
    const pageStart = document.querySelector(".pageStart");
    const pageTo = document.querySelector(".pageTo");
    if (startCount < 0) {
        pageStart.innerHTML = 0;
        pageTo.innerHTML = 0;
    } else {
        pageStart.innerHTML = (startCount + 1);
    }
    if (endCount > totalcountvalue) {
        pageTo.innerHTML = totalcountvalue;
    } else {
        pageTo.innerHTML = endCount;
    }
}

function prevpageData() {
    const start = StartCount - ItemperIndex;
    const end = EndCount - ItemperIndex;
    if ((start + 1) > 0) {
        appendData(paginationDataArray.slice(start, end));
        setRecords(start, end);
    } else { }
    StartCount = start;
    EndCount = end;
    if (end <= paginationDataArray.length) {
        nextbtn.classList.remove('arrow-btn-disabled')
    } else {
        nextbtn.classList.add('arrow-btn-disabled')
    }
    if (start > 0) {
        previousbtn.classList.remove('arrow-btn-disabled')
    } else {
        previousbtn.classList.add('arrow-btn-disabled')
    }
}

function nextpagedata() {
    const start = StartCount + ItemperIndex;
    const end = EndCount + ItemperIndex;
    if (start > 0 && end >= start) {
        appendData(paginationDataArray.slice(start, end));
        setRecords(start, end);
    } else { }
    StartCount = start;
    EndCount = end;
    if (end <= paginationDataArray.length) {
        nextbtn.classList.remove('arrow-btn-disabled')
    } else {
        nextbtn.classList.add('arrow-btn-disabled')
    }
    if (start >= 0) {
        previousbtn.classList.remove('arrow-btn-disabled')
    } else {
        previousbtn.classList.add('arrow-btn-disabled')
    }
}


