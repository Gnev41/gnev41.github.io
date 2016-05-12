// Переменные
var canvas, ctx;
var bPlay = false;
var iAngle = 0;
var sText = 'ебал в рот этот html ';
var StartAngle =  -Math.PI /4;

// Функции рисования
function clear() { // Очистка элемента canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawScene() { // Основная функция вывода сцены
    if (bPlay == 1) {
        clear(); // Очистка элемента canvas

        // Заполняем фон
        ctx.fillStyle = '#d7e8f1';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Меняем угол
        iAngle+=0.005;

        // и выводим текст по кругу с радиусом 200 в центре элемента canvas
        draw3DTextCircle(sText, canvas.width / 2, canvas.height / 2, 200,  - iAngle);
    }
}

function draw3DTextCircle(s, x, y, radius, iSAngle){

    // Радиан на символ
    var fRadPerLetter = ( (Math.PI -1.5 )/ s.length);

    // Сохраняем контекст, переводим и вращаем его
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(StartAngle-iSAngle);

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

// Привязываем событие onload
if (window.attachEvent) {
    window.attachEvent('onload', main_init);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function() {
            curronload();
            main_init();
        };
        window.onload = newonload;
    } else {
        window.onload = main_init;
    }
}

function main_init() {

    // Создаем элемент canvas и объект context
    canvas = document.getElementById('panel');
    ctx = canvas.getContext('2d');

    // Инициализуем строку текста
    ctx.font = '22px Verdana';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Заполняем фон
    ctx.fillStyle = '#d7e8f1';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Выводим текст по кругу с радуисом 200 по центру элемента canvas
    draw3DTextCircle(sText, canvas.width / 2, canvas.height / 2, 200, -iAngle);

    setInterval(drawScene, 40); // Выводим сцену
}