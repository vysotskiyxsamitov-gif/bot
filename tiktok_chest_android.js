"auto";
// Auto.js / AutoX.js (Android)
// Положи в /sdcard/ два скриншота (обрезанные точно по объекту):
//   chest.png - иконка сундучка на эфире
//   claim.png - кнопка "забрать" (когда таймер на 0)

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

function findAndTap(tpl) {
    var shot = captureScreen();
    var p = images.findImage(shot, tpl, { threshold: 0.8 });
    if (p) {
        click(p.x + random(5, 15), p.y + random(5, 15));
        return true;
    }
    return false;
}

while (true) {
    toast("Бот работает " + WORK_MIN + " мин");
    var end = Date.now() + WORK_MIN * 60000;
    while (Date.now() < end) {
        if (findAndTap(chest)) sleep(random(800, 1500));
        if (findAndTap(claim)) sleep(random(800, 1500));
        sleep(3000);
    }

    back(); // выйти с эфира
    toast("Пауза " + REST_MIN + " мин");
    sleep(REST_MIN * 60000);

    device.vibrate(500);
    dialogs.alert("Пауза закончилась", "Открой эфир и нажми ОК, чтобы продолжить");
}
