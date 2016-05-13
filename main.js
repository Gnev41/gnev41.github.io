
var diameter = (window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight)-50,
    format = d3.format(",d");//описание функции приведения числа в нужный вид 3008 -> 3,008

    var pack = d3.layout.pack();

    var svg = d3.select("#main").append("svg");

    //<canvas id="panel" width="600" height="600"></canvas>
    //canvas = document.getElementById('panel');
    //ctx = canvas.getContext('2d');
    //d3.select("#main").append("canvas")
    //.attr("width", diameter)
    //.attr("height", diameter)

    var node ;

    var data = dat;

    var lastX,lastY;



    function draw3DTextCircleCTX(s, x, y, radius, iSAngle){

      // Радиан на символ
      var fRadPerLetter = (Math.PI / s.length)-0.07;

      // Сохраняем контекст, переводим и вращаем его
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(iSAngle);

      // Количество дополнительных нижних слоев
      var iDepth = 4;

      // Устанавливаем темно-зеленый цвет для дополнительных слоев
      ctx.fillStyle = '#168d1e';

      // Обрабоатываем каждый символ строки
      for (var i=0; i<s.length; i++) {
        ctx.save();
        ctx.rotate(i*fRadPerLetter);

          // Выводим дополнительные слои
          for (var n = 0; n < iDepth; n++) {
            ctx.fillText(s[i], n, n - radius);
          }

          // Параметры тени
          ctx.fillStyle = '#00d50f';
          ctx.shadowColor = 'black';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = iDepth + 2;
          ctx.shadowOffsetY = iDepth + 2;

          // выводим символы
          ctx.fillText(s[i], 0, -radius);
          ctx.restore();
        }
        ctx.restore();
      }



      var circle,text,question;
      function resize()
      {
        diameter =( window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight)-50;
        console.log(diameter);
        render(data);
      }
      window.onresize = resize;


    //обновление информации в 
    function get_data_update (name) {
     d3.json(name+".json", function(error, json) {
      if (error) return console.warn(error);

      data=json;
      render(data);
    });
   }




   function render(json){


    d3.select("#question")
    .select("text")
    .remove();


    //вставляем текст
    question = d3.select("#question")
    .select("td")
    .append("text")//если проходит фильтр(нет детей т.е. сам ребенок последнего поколения),
    .attr("dy", ".3em")// то пишем текст
    .style("text-anchor", "middle")
    .style("font-size","17px")
    .text(function(d) { return json.question })
    ;

    
    d3.select("svg").remove();
    svg=[];

    pack = d3.layout.pack()
    .size([diameter - 15, diameter - 15])
    .value(function(d) { return d.size; });

    svg = d3.select("#main").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(1,1)");

    //для отрисовки текста над кругами 
    //svg.append("defs");

    function getPathData1() {
        // adjust the radius a little so our text's baseline isn't sitting directly on the circle
        var r = (diameter /2)*0.98;
        return 'm' + 0 + ',' + r + ' ' +
        'a' + r + ',' + r + ' 0 0 0 ' + (2*r) + ',0';
      }
/*
       d3.select("svg")
      .append("path")
        .attr("d" , getPathData1()//getPathData( d3.select("#main_circle").datum().x, d3.select("#main_circle").datum().y,diameter/2)
          )

    d3.select("svg")
      .append("defs")
      .append("path")
        .attr("d" , getPathData1()getPathData(d3.select("#main_circle").datum().x, d3.select("#main_circle").datum().y,diameter/2)
          )
        .attr("id", "curvedTextPath")
        ;
        
        d3.select("svg")
        .append("textPath")
        .attr("startOffset", "50%")
        .attr("xlink:href", "#curvedTextPath")
        .text("Hello, world!");
        */

    node = svg.datum(json).selectAll(".node")//добавление всех кругов
    .data(pack.nodes)
    .enter().append("g")
    .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    ;

    node//добавление всплывающего текста
    .filter(function(d) { return d.children; })
    .append("title")
    .text(function(d) { return d.name })
    ;

    function getPathData(x,y,ra) {
        // adjust the radius a little so our text's baseline isn't sitting directly on the circle
        var r = ra * 1.1;
        return 'm' + x + ',' + (y+ra) + ' ' +
        'a' + r + ',' + r + ' 0 0 0 ' + (2*r) + ',1';
      }

  //отрисовка самих кружочков
  circle = node
        //.filter(function(d) { return !d.children; })
        .append("circle")
        .attr("style","fill-opacity: 0.5")//прозрачность круга
        .attr("r", function(d) { return d.r; })
        ;

        node//отметка большого круга главным
        .filter(function(d) { return d.r>(diameter/2 - 10); })
        //.select("circle")
        .attr("id", function(d) { return "main_circle"; })
        ;





  //текст внутри пузырьков
  text = node//.filter(function(d) { return !d.children; })
        .append("text")//если проходит фильтр(нет детей т.е. сам ребенок последнего поколения),
        .style("text-anchor", "middle")
        .style("font-size","9px")
        .text(function(d) { return d.name})
        //  d.r / 3 < d.name.length ? d.name.substring(0,d.name.substring(0, d.r / 3).lastIndexOf(" ")) : d.name; })
        ;

        node
        .filter(function(d) { return !d.children; })
        //////////////////////////////////////////////////////////
        .on('click', function (d, i){
          //console.log(d3.select("#main_circle").datum().x+"       "+d3.select("#main_circle").datum().x);
          lastX=d3.select(this).datum().x;
          lastY=d3.select(this).datum().y;
          d3.select(this)  // Выберем элемент, на который наведена мышь
          .select("circle")
          .transition()  // Начинаем анимацию
          .duration(3000) // Длительность анимации
          .attr("transform", function(d) {
           return "translate(" + (d3.select("#main_circle").datum().x-d.x) + "," + (d3.select("#main_circle").datum().y-d.y) + ")"; })
          .attr("r", function(d) { return d3.select("#main_circle").datum().r ; })
          ;
          console.log("click");

          get_data_update(d.name);
          ;
        })
        //////////////////////////////////////////////////////////
        .on('mouseenter', function(d) {
          lastX=d3.select(this).datum().x;
          lastY=d3.select(this).datum().y;
          console.log("mouseenter");
          d3.select(this)  // Выберем элемент, на который наведена мышь
          .select("circle")
          .transition()  // Начинаем анимацию
          .duration(400) // Длительность анимации
          .attr('r', function(d) { return d.r+3;})
          ;
        })
        //////////////////////////////////////////////////////////
        .on('mouseleave', function(d) {
          console.log("mouseleave");
          d3.select(this)
          .select("circle")
          .transition()
          .duration(100)
          // Возвращаем в начальную позицию
          .attr('r', function(d) { return d.r;})
          .attr("transform", function(d) { return "translate(" + (lastX- d.x) + "," + (lastY-d.y) + ")"; })
        });

      }
      render(data);




        /*node.filter(function(d) { return !d.children; })
        .filter(function(d) { return d.r / 3 >d.name.length; })
        .append("text")//если проходит фильтр(нет детей т.е. сам ребенок последнего поколения),
        .style("text-anchor", "middle")
        .style("-moz-hyphens", "auto")
        .style("webkit-hyphens", "auto")
        .style("-ms-hyphens", "auto")
        .text(function(d) { return d.name.substring(d.name.substring(0, d.r / 3).lastIndexOf(" ")); })
        ;*/
        /*

        d3.select(self.frameElement).style("height", diameter + "px")
        ;

        */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    node//добавление всплывающего текста
    .filter(function(d) { return d.children; })
    .append("textPath")
    .attr("xlink:href",function(d) {
      d3.select("defs")
      .append("path")
      .attr("id",d.x+"_"+d.y)
      .attr("d",getPathData(
        d3.select(this).datum().x,
        d3.select(this).datum().y,
        d3.select(this).datum().r)
      )
      ;

      return "#"+d.x+"_"+d.y; })
    .text(function(d) { return d.name })
    ;//d3.select("#main_circle").datum()
    */

/*    node//отрисовка текста поверх круга для родителей
    .filter(function(d) { return d.children; })
    .forEach(function(d) {
      draw3DTextCircle(
        d.name,
        d.x,
        d.y,
        d.r,
        0
        );
      })*/

/////////////////////////////////////////////////////////////////////////////////////
        /*
        circle //уменьшаем только детей
        .filter(function(d) { return !d.children; })
        .attr("r", function(d) { d.r=d.r-30;return d.r; })
*/