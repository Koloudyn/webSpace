let tableArray = {};
buttonFilter.onclick = function() {
    if (!isFieldsEmpty()) {
        tableArray = getArray();
        filter();
        document.getElementById('tableOfStars').innerHTML = printTable();
    }
};
function isFieldsEmpty() {
    if ((document.getElementById('starName').value == '')&&(document.getElementById('starStellarFrom').value == '') &&
    (document.getElementById('starStellarTo').value == '')&&(document.getElementById('starClass').value == '')) {
        return true;
    }
    return false;
}

function getArray() {
    let table = document.getElementById('tableOfStars').outerHTML;
    let keys = table.match(/<th>(.*?)<\/th>/g);
    for (let key in keys) {
        keys[key] = keys[key].replace(/<[^>]+>/g, '').trim().replace(/\s{2,}/gim,' ');
    };
    table = table.match(/<td>(.*?)<\/td>/g);
    for (let key in table) {
        table[key] = table[key].replace(/<[^>]+>/g, '').trim().replace(/\s{2,}/gim,' ');
    };

    let result = {};
    for (let i = 0; i < keys.length; i++) {
        let temp = [];
        for (let j = i; j < table.length; j+=3) {
            temp.push(table[j]);
        }
        result[keys[i]] = temp;
    }
    return result;
}

function filter() {
    if (document.getElementById('starName').value !== '') {
        let value = document.getElementById('starName').value;
        filterForOneField(value, 0);
    }
    if (document.getElementById('starStellarFrom').value !== '' || document.getElementById('starStellarTo').value !== '') {
        let valueMin = document.getElementById('starStellarFrom').value;
        let valueMax = document.getElementById('starStellarTo').value;
        if (valueMin !== '')
            filterForOneNumber(Number(valueMin), 'min');
        if (valueMax !== '')
            filterForOneNumber(Number(valueMax), 'max');
    }
    if (document.getElementById('starClass').value !== '') {
        let value = document.getElementById('starClass').value;
        filterForOneField(value, 2);
    }
}
function filterForOneField(value, index) {
    let key = Object.keys(tableArray)[index];
    let i = 0;
    while (i < tableArray[key].length) {
        if (!isValueIncludes(key, i, value)) {
            removeStr(i);
            i--;
        }
        i++;
    }
}
function filterForOneNumber(value, curNumber) {
    let key = Object.keys(tableArray)[1];
    let i = 0;
    while (i < tableArray[key].length) {
        if (curNumber == 'min') {
            if (!(Number(tableArray[key][i]) >= value)) {
                removeStr(i);
                i--;
            }
        }
        if (curNumber == 'max') {
            if (!(Number(tableArray[key][i]) <= value)) {
                removeStr(i);
                i--;
            }
        }
        i++;
    }
}
function isValueIncludes(key, i, value) {
    if (tableArray[key][i].includes(value)) {
        return true;
    }
    return false;
}
function removeStr(index) {
    let arrKey = Object.keys(tableArray);
    for (let key in arrKey) {
        tableArray[arrKey[key]].splice(index, 1);
    }
}

function printTable() {
    let result = ``;
    let arrKey = Object.keys(tableArray);
    for(let key in arrKey) {
        result += `<th>${arrKey[key]}</th>`;
    }
    result += '</tr>';
    for(let i = 0; i < tableArray[arrKey[0]].length; i++) {
        result += '<tr>';
        for(let key in arrKey) {
            result += `<td>${ tableArray[arrKey[key]][i] }</td>`;
        }
        result += '</tr>';
    }
    return result;
}


buttonSorting.onclick = function() {
    if (isChooseRight()) {
        tableArray = getArray();
        let values = getArguments();
        sorting(values);
        document.getElementById('tableOfStars').innerHTML = printTable();
    }
};
function isChooseRight() {
    if (document.getElementById('sortFirst').value == 0) {
        alert('Please, choose first sorting.');
        return false;
    }
    if (document.getElementById('sortFirst').value == document.getElementById('sortSecond').value) {
        alert('You can not choose the same sorting for second.');
        return false;
    }
    if ((document.getElementById('sortFirst').value == document.getElementById('sortThird').value) ||
    (document.getElementById('sortSecond').value == document.getElementById('sortThird').value)) {
        if (document.getElementById('sortSecond').value != 0) {
            alert('You can not choose the same sorting for third.');
            return false;
        }
    }
    return true;
}

function sorting(values) {
    let keys = Object.keys(tableArray);
    let n = tableArray[values[0]].length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (isCompareOrder(j, values)) {
                change(j, j + 1);
            }
        }
    }
}

function change(k, p) {
    let allKey = Object.keys(tableArray);
    for(let key in allKey) {
        let w = tableArray[allKey[key]][k];
        tableArray[allKey[key]][k] = tableArray[allKey[key]][p];
        tableArray[allKey[key]][p] = w;
    }
}
function isCompareOrder(n, arrCompare) {
    for (let k = 0; k < arrCompare.length; k+=2) {
        if (arrCompare[k] != 'Abs Magnitude') {
            if ((tableArray[arrCompare[k]][n] > tableArray[arrCompare[k]][n + 1])&&(arrCompare[k+1] == 'asc') ||
            (tableArray[arrCompare[k]][n] < tableArray[arrCompare[k]][n + 1])&&(arrCompare[k+1] == 'desc')) {
                return true;
            } else if (tableArray[arrCompare[k]][n] === tableArray[arrCompare[k]][n + 1]) {
                continue;
            } else {
                return false;
            }
        } else {
           if ((Number(tableArray[arrCompare[k]][n]) > Number(tableArray[arrCompare[k]][n + 1]))&&(arrCompare[k+1] == 'asc') ||
           (Number(tableArray[arrCompare[k]][n]) < Number(tableArray[arrCompare[k]][n + 1]))&&(arrCompare[k+1] == 'desc')) {
               return true;
           } else if (tableArray[arrCompare[k]][n] === tableArray[arrCompare[k]][n + 1]) {
               continue;
           } else {
               return false;
           }
        }
    }
    return false;
}
function getArguments() {
    let result = [];
    result.push(getColumnName(document.getElementById('sortFirst').value));
    (document.getElementById('descFirst').checked) ? result.push('desc') : result.push('asc');
    if (document.getElementById('sortSecond').value != 0) {
        result.push(getColumnName(document.getElementById('sortSecond').value));
        (document.getElementById('descSecond').checked) ? result.push('desc') : result.push('asc');
    }
    if (document.getElementById('sortThird').value != 0) {
        result.push(getColumnName(document.getElementById('sortThird').value));
        (document.getElementById('descThird').checked) ? result.push('desc') : result.push('asc');
    }
    return result;
}
function getColumnName(value) {
    if (value == 1) {
        return 'Common name';
    }
    if (value == 2) {
        return 'Abs Magnitude';
    }
    if (value == 3) {
        return 'Spectral Type';
    }
}
