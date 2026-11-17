"auto";
// Auto.js / AutoX.js (Android)
// Положи в /sdcard/ два скриншота (обрезанные точно по объекту, без цифр таймера):
//   chest.png - иконка сундучка на эфире
//   claim.png - кнопка "забрать" в момент, когда таймер на 0

var WORK_MIN = 60;
var REST_MIN = 30;

if (!requestScreenCapture()) {
    toast("Нужно разрешить запись экрана");
    exit();
}

var chest = images.read("/sdcard/chest.png");
var claim = images.read("/sdcard/claim.png");
if (!chest || !claim) {
    toast("Не найдены /sdcard/chest.png или /sdcard/claim.png");
    exit();
}

var running = false;

// Плавающая кнопка поверх экрана
var w = floaty.window(
    <frame>
        <button id="btn" text="СТАРТ" w="90" h="50" />
    </frame>
);
w.setPosition(20, 300);

function setBtn(text) {
    ui.run(function () { w.btn.setText(text); });
}

function findAndTap(tpl) {
    var shot = captureScreen();
    var p = images.findImage(shot, tpl, { threshold: 0.8 });
    if (p) {
        click(p.x + random(5, 15), p.y + random(5, 15));
        return true;
    }
    return false;
}

function sleepWhile(ms) {
    // спим кусками, чтобы можно было остановить кнопкой
    var end = Date.now() + ms;
    while (running && Date.now() < end) sleep(500);
}

function botLoop() {
    while (running) {
        var end = Date.now() + WORK_MIN * 60000;
        while (running && Date.now() < end) {
            if (findAndTap(chest)) sleep(random(800, 1500));
            if (findAndTap(claim)) sleep(random(800, 1500));
            sleepWhile(3000);
        }
        if (!running) break;

        back(); // выйти с эфира
        toast("Пауза " + REST_MIN + " мин");
        setBtn("ПАУЗА");
        sleepWhile(REST_MIN * 60000);
        if (!running) break;

        device.vibrate(500);
        toast("Пауза закончилась: открой эфир и нажми СТАРТ");
        running = false;
    }
    setBtn("СТАРТ");
}

w.btn.click(function () {
    if (running) {
        running = false;
        setBtn("СТАРТ");
        toast("Бот остановлен");
    } else {
        running = true;
        setBtn("СТОП");
        threads.start(botLoop);
    }
});

// держим скрипт живым, чтобы кнопка не пропала
setInterval(function () {}, 1000);
