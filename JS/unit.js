// 封装生成子弹的函数
function generateBullet() {
    if (num % BULLET_FREQUENT == 0) {
        // 子弹实例化参数：
        // 子弹的宽度  子弹高度 子弹的横坐标 子弹的纵坐标  子弹的图片
        var bullet = new Bullet(BULLET_WIDTH, BULLET_HEIGHT, hero.x + HERO_WIDTH / 2 - BULLET_WIDTH / 2, hero.y, BULLET_IMG);
        bulletlist.push(bullet)
    }
}

// 生成敌机对象
function generateEnemy() {
    if (num % ENEMY_FREQUENT == 0 && enemyList.length <= ENEMY_NUM) {
        var enemy = new Enemy(ENEMY_WIDTH, ENEMY_HEIGHT,
            getRandom(0, WIDTH - ENEMY_WIDTH), -ENEMY_HEIGHT, ENEMY_IMG);
        enemyList.push(enemy);
    }

}


// 获取随机数
function getRandom(min, max) {
    return Math.ceil(Math.random() * (max - min)) + min;
}

// var listA = [];
// 判断两个对象之间是否发生碰撞
// 参数： 第一个对象  第二个对象 两个对象离左边的距离
function isCollide(objA, objB, offsetX = 0, offsetY = 0) {
    return (Math.abs((objA.x + objA.width / 2) - (objB.x + objB.width / 2)) < Math.min(objA.width, objB.width) - offsetX) &&
        (Math.abs((objA.y + objA.height / 2) - (objB.y + objB.height / 2)) < Math.min(objA.height, objB.height) - offsetY);
    // 这里返回的是bool值
}


// 判断两个对象之间是否发生了碰撞 (子弹和敌机之间的碰撞)
function isCollideGroup(listA, listB) {
    for (var i = 0; i < listA.length; i++) {
        for (var j = 0; j < listB.length; j++) {
            if (isCollide(listA[i], listB[j])) {
                return [listA[i], listB[j]];
            }
        }
    }
    return [];

}

// 从数组中移除成员
function removeArrItem(arr, item) {
    var index = arr.indexOf(item);
    if (arr.indexOf(item) != -1) {
        arr.splice(index, 1);
    }
}

// 判断一个对象是否和一群对象中的某一个发生了碰撞  (我方战机和敌机们的碰撞)
function isCollideOneAndGroup(obj, listA, offsetX = 0, offsetY = 0) {
    for (var i = 0; i < listA.length; i++) {
        if (isCollide(listA[i], obj, offsetX, offsetY))
            return listA[i];
    }
    return null;
}

