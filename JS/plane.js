// 参数：背景的宽  背景的高  背景的横坐标 背景的纵坐标 背景图片
function Background(width, height, x, y, imgsrc) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = imgsrc;

    // 创建方法 画背景图  两张背景图片竖着排列
    this.draw = function (ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.img, this.x, this.y + this.height, this.width, this.height)
        this.move();
    }

    // 移动图片的方法
    // 判断 
    // 图片的纵坐标是否为负数 如果为负数则表示图片在画布的上面 向下移动 加数值
    // 如果图片纵坐标不为负值 则表示该张图片已经全部展示出来 需重新赋负值 完成无缝衔接
    this.move = function () {
        if (this.y <= 0) {
            this.y += BACKGROUND_SPEED;
        } else {
            this.y = -height;
        }
    }
}


// 声明英雄战机  飞机构造函数
function Hero(width, height, x, y, imgsrc) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = imgsrc;

    // 方法
    this.draw = function (ctx) {
        // 参数 图片 图片横坐标 图片纵坐标 图片宽度 图片高度
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    // 绑定事件
    // 在页面中移动鼠标时  飞机图片跟着移动
    document.onmousemove = function (e) {
        X = e.clientX - canvas.offsetLeft - HERO_WIDTH / 2;
        Y = e.clientY - canvas.offsetTop - HERO_HEIGHT / 2;
        // 设定飞机移动边界
        if (X < 0) {
            X = 0;
        }
        if (X >= WIDTH - HERO_WIDTH) {
            X = WIDTH - HERO_WIDTH;
        }
        if (Y < 0) {
            Y = 0;
        }
        if (Y >= HEIGHT - HERO_HEIGHT) {
            Y = HEIGHT - HERO_HEIGHT;
        }
        hero.x = X;
        hero.y = Y;
    }
}


// 子弹对象
function Bullet(width, height, x, y, imgSrc) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = imgSrc;


    this.draw = function () {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        this.move();
    }

    this.move = function () {
        if (this.y > 0) {
            this.y -= BULLET_SPEED;
        } else {
            var index = bulletlist.indexOf(this);
            bulletlist.splice(index, 1);
        }
    }


}


// 敌方飞机构造函数
// 参数： 敌方飞机宽  高  起点很坐标  起点纵坐标
function Enemy(width, height, x, y, imgSrc) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.imgSrc = imgSrc;
    this.img = new Image();
    this.img.src = this.imgSrc;

    this.draw = function (ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        this.move();
    }


    this.move = function () {
        if (this.y < HEIGHT + this.height) {
            this.y += ENEMY_SPEED;
        } else {
            var index = enemyList.indexOf(this);
            enemyList.splice(index, 1);
            delete this;
        }
    }

}



// 炸裂构造函数  Explosion
// 参数： 爆炸的宽 爆炸的高 爆炸的起点横坐标 爆炸的纵坐标
function Explosion(width, height, x, y) {
    this.width = width;    //
    this.height = height;
    this.x = x;
    this.y = y;
    this.num = 1;    // 图片路径中的数字
    this.counter = 1;  // 计数

    this.draw = function (ctx) {
        var img = new Image();
        var imgSrc = `./img/explosion${this.num}.png`;    // 炸裂图片路径
        img.src = imgSrc;
        img.onload = () => {
            ctx.drawImage(img, this.x, this.y, this.width, this.height)
        }
        this.move();
    }

    this.move = function () {
        if (this.counter < 19) {
            this.num++;
            this.counter++;
        } else if (this.counter < 37) {
            this.num--;
            this.counter++;
        } else {
            this.counter = 1;
            var index = explosionList.indexOf(this);
            explosionList.splice(index, 1);
            delete this;
        }
    }
}




