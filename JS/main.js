
// 获取背景音乐
var bgMusic = document.querySelector('#bgMusic');


//  1. 声明全局变量
// 画布
let WIDTH = 512,
    HEIGHT = 700,
    BACKGROUND_IMG = './img/bg.jpg',
    BACKGROUND_SPEED = 2,
    // console.log(BACKGROUND_IMG);
    // 我方战机
    HERO_WIDTH = 80,
    HERO_HEIGHT = 50,
    HERO_IMG = './img/hero.png';

// 设置游戏的难度
let DIFFICULT = '';


//英雄战机在画布的位置变量
let X,
    Y;

//敌机变量
let ENEMY_WIDTH = 80,  // 敌机宽度
    ENEMY_HEIGHT = 50,  // 敌机高度
    ENEMY_IMG = './img/enemy.png',  //敌机图片
    ENEMY_SPEED = 5,   //敌机移动速度
    ENEMY_FREQUENT = 20,  // 敌机攻击的火力
    ENEMY_NUM = 10;  // 敌机数量

// 子弹相关的变量
let BULLET_WIDTH = 30,      // 子弹宽度
    BULLET_HEIGHT = 30,     // 子弹高度
    BULLET_IMG = './img/bullet.png',       // 子弹图片位置
    BULLET_SPEED = 5,      // 子弹速度
    BULLET_FREQUENT = 20, // 火力 子弹的密集程度  子弹间的间隔
    num = 0;



// 2. 创建画布
const canvas = this.document.createElement('canvas');

// 3. 设置画布宽高
canvas.width = WIDTH;
canvas.height = HEIGHT;

// 插入画布
this.document.body.append(canvas);
// 获取画笔
const ctx = canvas.getContext('2d');

// 4. 生成游戏中涉及的对象  创建构造函数

// 背景对象
// 参数：图片的宽度 图片的高度 图片的横坐标 图片的纵坐标 图片
let background = new Background(WIDTH, HEIGHT, 0, -HEIGHT, BACKGROUND_IMG);

// 玩家操纵的英雄战机
// 参数： 战机宽度 战机高度 战机的起点横坐标  战机的起点纵坐标 战机的图片
let hero = new Hero(HERO_WIDTH, HERO_HEIGHT, WIDTH / 2 - HERO_WIDTH / 2, HEIGHT - HERO_HEIGHT, HERO_IMG)

// 子弹对象列表
let bulletlist = [];  // 放子弹的数组

// 敌方战机对象列表
var enemyList = [];

// 碰撞炸裂的数组
var explosionList = [];

// 得分
var score = 0;

// 血量
var bigHP = 400;
var HP = 50;

let a = 0;

let times = 2



// 5. 游戏界面的绘制
let timer = this.setInterval(function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT); // 清除画布
    background.draw(ctx);  // 调用background对象的draw的方法
    chose();  // 调用绘制文字函数
    hero.draw(ctx); //调用hero对象的draw方法
}, 15)

// 6. 绘制文字
function chose() {
    ctx.font = '65px 微软雅黑';
    ctx.fillText('飞机大战', 120, 130);
    ctx.font = '35px 微软雅黑';
    ctx.fillStyle = '#fff';
    ctx.fillText('请选择难度', 150, 220);
    ctx.fillText('简单', 210, 280);
    ctx.fillText('困难', 210, 340);
    ctx.fillText('地狱', 210, 400);



}





// 7. 给请选择难度绑定点击事件
canvas.onclick = function () {
    bgMusic.play();
    bgMusic.volume = .5;
    if (X < 250 && X > 160 && Y > 220 && Y < 260) {
        // alert(11);
        DIFFICULT = '简单';
        ENEMY_SPEED = 4;  // 敌机的速度
        ENEMY_FREQUENT = 20;  // 敌机攻击的火力 数值越小 敌人攻击越猛
        ENEMY_NUM = 10;  // 敌机的数量
        BULLET_FREQUENT = 10;  // 子弹的火力
    } else if (X < 250 && X > 160 && Y > 280 && Y < 320) {
        // alert(22);
        DIFFICULT = '困难';
        ENEMY_SPEED = 12;  // 敌机的速度
        ENEMY_FREQUENT = 10;  // 敌机攻击的火力 数值越小 敌人攻击越猛
        ENEMY_NUM = 20;  // 敌机的数量
        BULLET_FREQUENT = 1;  // 子弹的火力
        a = 5;

    } else if (X < 250 && X > 160 && Y > 340 && Y < 380) {
        // alert(33);
        DIFFICULT = '地狱';
        ENEMY_SPEED = 20;  // 敌机的速度
        ENEMY_FREQUENT = 5;  // 敌机攻击的火力 数值越小 敌人攻击越猛
        ENEMY_NUM = 30;  // 敌机的数量
        BULLET_FREQUENT = 2;  // 子弹的火力
        a = 10;

    } else {
        return false;
    }
    // console.log(DIFFICULT);

    canvas.onclick = null;  // 选择难度完成后  将canvas上的事件解除绑定
    clearInterval(timer);  // 关闭上次绘制背景，英雄的定时器，避免闪屏

    // 游戏界面的绘制
    timer = setInterval(function () {
        ctx.clearRect(0, 0, WIDTH, HEIGHT); // 清除画布
        background.draw(ctx);  // 调用background对象的draw的方法            
        hero.draw(ctx); //调用hero对象的draw方法
        game();
    }, 15)
}


// 游戏难度 左上角提示
function game() {

    // 绘制文字
    ctx.fillStyle = ('#fff');
    ctx.font = '20px 微软雅黑';
    ctx.fillText(`难度:${DIFFICULT}`, 10, 30);

    // 判断子弹的数量
    if (num < 999) {
        num++;
    } else {
        num = 0;
    }

    // 调用unit.js中生成子弹的函数
    generateBullet();

    // 绘制子弹
    for (let i = 0; i < bulletlist.length; i++) {
        bulletlist[i].draw(ctx);
    }

    // 生成敌机
    generateEnemy();

    // 绘制敌机
    for (var i = 0; i < enemyList.length; i++) {
        enemyList[i].draw(ctx);
    }

    // 碰撞
    //  collide 数组 储存两个参数： 碰撞的子弹  碰撞的敌机
    let collide = isCollideGroup(bulletlist, enemyList);
    // console.log(collide);
    if (collide.length > 0) {
        explosionList.push(new Explosion(100, 80, collide[1].x, collide[1].y + collide[1].height / 2))
        score++;
        removeArrItem(bulletlist, collide[0]);
        removeArrItem(enemyList, collide[1]);

        if (score % 20 == 0 && score != 0) {
            // ctx.font = ('24px 微软雅黑');
            // ctx.fillStyle = '#fff';
            // ctx.fillText(`您已击败${score}敌机,敌机速度现为${ENEMY_SPEED}`, 80, 100);
            a = a + 1;
            ENEMY_SPEED += 1;
            console.log(score, ENEMY_SPEED);
            switch (a) {
                case 5:
                    clearInterval(timer)
                    ctx.save();
                    ctx.beginPath();
                    ctx.font = '25px 微软雅黑';
                    ctx.fillStyle = '#fff';
                    ctx.fillText('您已在简单关卡无敌,请前往下一关困难', 60, HEIGHT / 2 - 50);
                    ctx.font = '38px 微软雅黑';
                    ctx.fillText('确认', WIDTH / 2 - 30, HEIGHT / 2 + 20);
                    ctx.closePath();
                    ctx.restore();
                    canvas.onclick = function () {
                        console.log(X, Y);
                        if (X > 184 && X < 261 && Y > 313 && Y < 353) {
                            ctx.clearRect(0, 0, WIDTH, HEIGHT); // 清除画布
                            // 游戏界面的绘制
                            timer = setInterval(function () {
                                ctx.clearRect(0, 0, WIDTH, HEIGHT); // 清除画布
                                background.draw(ctx);  // 调用background对象的draw的方法            
                                hero.draw(ctx); //调用hero对象的draw方法
                                game();
                            }, 15)

                            DIFFICULT = '困难';
                            ENEMY_SPEED = 15;  // 敌机的速度
                            ENEMY_FREQUENT = 10;  // 敌机攻击的火力 数值越小 敌人攻击越猛
                            ENEMY_NUM = 20;  // 敌机的数量
                            BULLET_FREQUENT = 8;  // 子弹的火力
                        }
                    }
                    break;
                case 10:
                    clearInterval(timer)
                    ctx.save();
                    ctx.beginPath();
                    ctx.font = '25px 微软雅黑';
                    ctx.fillStyle = '#fff';
                    ctx.fillText('您已在困难关卡无敌,请前往下一关地狱', 60, HEIGHT / 2 - 50);
                    ctx.font = '38px 微软雅黑';
                    ctx.fillText('确认', WIDTH / 2 - 30, HEIGHT / 2 + 20);
                    ctx.closePath();
                    ctx.restore();
                    canvas.onclick = function () {
                        console.log(X, Y);
                        if (X > 184 && X < 261 && Y > 313 && Y < 353) {
                            ctx.clearRect(0, 0, WIDTH, HEIGHT); // 清除画布
                            // 游戏界面的绘制
                            timer = setInterval(function () {
                                ctx.clearRect(0, 0, WIDTH, HEIGHT); // 清除画布
                                background.draw(ctx);  // 调用background对象的draw的方法            
                                hero.draw(ctx); //调用hero对象的draw方法
                                game();
                            }, 15)

                            DIFFICULT = '地狱';
                            ENEMY_SPEED = 20;  // 敌机的速度
                            ENEMY_FREQUENT = 5;  // 敌机攻击的火力 数值越小 敌人攻击越猛
                            ENEMY_NUM = 30;  // 敌机的数量
                            BULLET_FREQUENT = 2;  // 子弹的火力
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }





    // // 背景音乐
    // ctx.font = ('24px 微软雅黑');
    // ctx.fillStyle = '#fff';
    // ctx.fillText('开', 30, 550);
    // let flag = true;
    // if (X >= 0 && X < 15 && Y > 500 && Y < 530 && flag) {
    //     bgMusic.play();
    //     bgMusic.volume = .5;
    //     flag = false;
    // } else {
    //     bgMusic.playPause();
    //     ctx.strokeRect(0, 500, 15, 30);
    //     ctx.clearRect(0, 500, 15, 30); // 清除画布
    //     ctx.fillText('关', 30, 550);
    //     flag = true;

    // }


    canvas.onclick = function () {
        console.log(X, Y);
    }







    // 血条
    ctx.save();
    ctx.beginPath();
    // 大血条
    ctx.strokeStyle = 'black';
    ctx.strokeRect(50, 650, 400, 20);
    ctx.fillStyle = 'pink';
    ctx.fillRect(50, 650, bigHP, 20);
    // 小血条
    ctx.strokeStyle = 'black';
    ctx.strokeRect(X + 15, Y + 55, 50, 8);
    ctx.fillStyle = 'pink';
    ctx.fillRect(X + 15, Y + 55, HP, 8);
    ctx.closePath();
    ctx.restore();


    if (score % 20 == 0 && score != 0) {
        ctx.font = ('24px 微软雅黑');
        ctx.fillStyle = '#fff';
        ctx.fillText(`您已击败${score}敌机,敌机速度现为${ENEMY_SPEED}`, 80, 150);
    }



    // 绘制操作
    for (var i = 0; i < explosionList.length; i++) {
        explosionList[i].draw(ctx);
    }

    // 绘制得分
    ctx.fillText(`得分：${score}`, 140, 30);

    // 绘制敌机速度
    ctx.fillText(`敌机速度：${ENEMY_SPEED}`, 300, 30);


    // // 绘制敌人战机
    // ctx.save();
    // ctx.beginPath();
    // ctx.lineWidth = 5;
    // ctx.strokeStyle = 'black'
    // for (var i = 0; i < ENEMY_NUM; i++) {
    //     ctx.strokeRect(enemyList[i].x, enemyList[i].y, enemyList[i].width, enemyList[i].height);
    // }
    // ctx.closePath();
    // ctx.stroke();



    // 判断我方英雄战机是否撞到敌方战机
    // 如果我方英雄战机撞到敌方战机就掉血 当血量小于0时 结束游戏
    var hit = isCollideOneAndGroup(hero, enemyList, 20, 20);
    if (hit) {
        if (bigHP > 0 && HP > 0) {
            bigHP -= 40;
            HP -= 5;

        } else {
            clearInterval(timer);
            ctx.font = '35px 微软雅黑';
            ctx.fillStyle = '#ff0000';
            ctx.textAlign = 'center';
            ctx.fillText('你挂了!大侠请重新来过', WIDTH / 2, HEIGHT / 2 - 70);
            ctx.fillText(`这次的得分是${score}`, WIDTH / 2, HEIGHT / 2 - 130);
            ctx.font = '48px 微软雅黑';
            ctx.fillStyle = '#fff';
            ctx.fillText('重新开始', WIDTH / 2, HEIGHT / 2);
            canvas.onclick = function () {
                if (X > 116 && X < 307 && Y < 338 && Y > 307) {
                    location.reload();
                } else {
                    return false;
                }

            }

        }
    }

}

