element = document.getElementById('makeGraph');
element.onclick = function() {
    if (this.value === "Make") {
        this.value = "Hide";
        d3.select("svg")
         .style("display", "");
        drawGraph();
    } else {
        this.value = "Make";
        d3.select("svg")
        .style("display", "none");
    }
};

function getArrGraph() {
    tableArray = getArray();

    let values = ['Spectral Type', 'asc'];
    sorting(values);
    let arrObject = [];
    for (let j = 0; j < tableArray['Spectral Type'].length; j++) {
        let temp = {};
        for (let key in tableArray) {
            temp[key] = tableArray[key][j];
        }
        arrObject.push(temp);
    }

    const ox = document.querySelector('input[name="ox"]:checked').value;
    const oy = document.querySelector('input[name="oy"]:checked').value;
    let groupObj = d3.group(arrObject, d => d[ox]);

    arrGroup = []; // массив объектов для построения графика
    for(let entry of groupObj) {
        let minMax = d3.extent(entry[1].map(d => d[oy]));

        let elementGroup = {};
        elementGroup["labelX"] = entry[0];
        elementGroup["valueMin"] = minMax[0];
        elementGroup["valueMax"] = minMax[1];

        arrGroup.push(elementGroup);
    }
    return arrGroup;
}
function drawGraph() {
    let arrGraph = getArrGraph();
    let marginX = 50;
    let marginY = 50;
    let height = 500;
    let width = 800;

    let svg = d3.select("svg")
    .attr("height", height)
    .attr("width", width);

    // очищаем svg перед построением
    svg.selectAll("*").remove();
    // определяем минимальное и максимальное значение по оси OY
    let min, max;
    min = d3.min(arrGraph.map(d => d.valueMin)) * 0.95;
    max = d3.max(arrGraph.map(d => d.valueMax)) * 1.8;

    let xAxisLen = width - 2 * marginX;
    let yAxisLen = height - 2 * marginY;

    // определяем шкалы для осей
    let scaleX = d3.scaleBand()
    .domain(arrGraph.map(function(d) {
        return d.labelX;
    })
    )
    .range([0, xAxisLen],1);

    let scaleY = d3.scaleLinear()
    .domain([min, max])
    .range([0, yAxisLen]);
    // создаем оси
    let axisX = d3.axisBottom(scaleX); // горизонтальная

    let axisY = d3.axisLeft(scaleY);// вертикальная

    // отображаем ось OX, устанавливаем подписи оси ОX и угол их наклона
    svg.append("g")
    .attr("transform", `translate(${marginX}, ${height - marginY})`)
    .call(axisX)
    .attr("class", "x-axis")
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
        return "rotate(-45)";
    });

    // отображаем ось OY
    svg.append("g")
    .attr("transform", `translate(${marginX}, ${marginY})`)
    .attr("class", "y-axis")
    .call(axisY);

    // создаем набор вертикальных линий для сетки
    d3.selectAll("g.x-axis g.tick")
    .append("line") // добавляем линию
    .classed("grid-line", true) // добавляем класс
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", - (yAxisLen));

    // отображаем данные в виде точечной диаграммы
    svg.selectAll(".dot")
     .data(getArrGraph)
     .enter()
     .append("circle")
     .attr("r", 3.5)
     .attr("cx", function(d) { return scaleX(d.labelX); })
     .attr("cy", function(d) { return scaleY(d.valueMax); })
     .attr("transform", `translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
     .style("fill", "navy")

     svg.append("text")
      .attr("x", marginX / 2)
      .attr("y",height / 2 )
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .attr("transform", `rotate(-90, ${marginX / 2}, ${height / 2})`)
      .text("Abs Magnitude");

      svg.append("text")
        .attr("x", width / 2)
        .attr("y", marginY / 2 )
        .style("text-anchor", "middle")
        .style("font-size", "17px")
        .attr("transform", `rotate(0, ${width / 2}, ${marginY / 2})`)
        .text("Hertzsprung-Russell diagram");
}