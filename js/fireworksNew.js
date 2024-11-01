// 构造函数，创建 LEAF 对象
const LEAF = function(width, height, renderer){
    this.width = width; // 叶子的宽度
    this.height = height; // 叶子的高度
    this.renderer = renderer; // 渲染器，负责画出叶子
    this.init(); // 初始化叶子
};

// 构造函数，创建 STAR 对象
const STAR = function(width, height, context, renderer){
    this.width = width; // 星星的宽度
    this.height = height; // 星星的高度
    this.renderer = renderer; // 渲染器，负责画出星星
    this.init(context); // 初始化星星
};

// 构造函数，创建 FIREWORK 对象
const FIREWORK = function(width, height, renderer){
    this.width = width; // 烟花的宽度
    this.height = height; // 烟花的高度
    this.renderer = renderer; // 渲染器
    this.init(); // 初始化烟花
};

// 构造函数，创建 TWIG 对象
const TWIG = function(width, height, x, y, angle, theta){
    this.width = width; // Twig 的宽度
    this.height = height; // Twig 的高度
    this.x = x; // Twig 的 X 坐标
    this.y = y; // Twig 的 Y 坐标
    this.angle = angle; // Twig 的角度
    this.theta = theta; // Twig 的摆动角度
    this.rate = Math.min(width, height) / 500; // Twig 的缩放比例
};

// 渲染器对象，包含多个渲染参数和方法
const RENDERER =  {
    LEAF_INTERVAL_RANGE: {min: 100, max: 200}, // 叶子出现间隔范围
    FIREWORK_INTERVAL_RANGE: {min: 20, max: 200}, // 烟花出现间隔范围
    SKY_COLOR: 'hsla(210, 60%, %luminance%, 0.2)', // 天空的颜色
    STAR_COUNT: 100, // 星星的数量

    init: function () {
        console.log('init renderer==================='); // 初始化日志
        this.setParameters(); // 设置渲染器参数
        this.reconstructMethod(); // 重构方法
        this.createTwigs(); // 创建 Twig
        this.createStars(); // 创建星星
        this.render(); // 开始渲染
    },

    setParameters: function () {
        // var canvasMain = document.getElementById('jsi-fireworks-container');
        // // document.body.appendChild(canvasMain);
        // var contextMain = canvasMain.getContext('2d');
        //
        // function resizeCanvas() {
        //     canvasMain.width = window.innerWidth;
        //     canvasMain.height = window.innerHeight;
        //
        //     clearCanvas();
        // }

        // 获取容器元素并设置其宽高
        this.$container = $('#jsi-fireworks-container');
        this.width = this.$container.width(); // 宽度
        this.height = this.$container.height(); // 高度
        this.distance = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2)); // 计算中心到边缘的距离

        // 创建两个 canvas 用于绘制烟花和 Twig
        this.contextFireworks = $('<canvas />').attr({
            width: this.width,
            height: this.height
        }).appendTo(this.$container).get(0).getContext('2d'); // 烟花上下文

        this.contextTwigs = $('<canvas />').attr({
            width: this.width,
            height: this.height
        }).appendTo(this.$container).get(0).getContext('2d'); // Twig 上下文

        // 初始化 Twig、叶子、星星和烟花的数组
        this.twigs = [];
        this.leaves = [new LEAF(this.width, this.height, this)];
        this.stars = [];
        this.fireworks = [new FIREWORK(this.width, this.height, this)];

        // 设置叶子和烟花的出现间隔
        this.leafInterval = this.getRandomValue(this.LEAF_INTERVAL_RANGE) | 0;
        this.maxFireworkInterval = this.getRandomValue(this.FIREWORK_INTERVAL_RANGE) | 0;
        this.fireworkInterval = this.maxFireworkInterval;
        console.log('leafInterval', this.leafInterval, 'fireworkInterval', this.fireworkInterval, 'fireworks', this.fireworks); // 日志输出
    },

    // 重构方法以确保上下文绑定正确
    reconstructMethod: function () {
        this.render = this.render.bind(this); // 绑定 render 方法
    },

    getRandomValue: function (range) {
        return range.min + (range.max - range.min) * Math.random(); // 返回指定范围内的随机值
    },

    createTwigs: function () {
        // 创建多个 Twig 对象并加入到 twigs 数组
        this.twigs.push(new TWIG(this.width, this.height, 0, 0, Math.PI * 3 / 4, 0));
        this.twigs.push(new TWIG(this.width, this.height, this.width, 0, -Math.PI * 3 / 4, Math.PI));
        this.twigs.push(new TWIG(this.width, this.height, 0, this.height, Math.PI / 4, Math.PI));
        this.twigs.push(new TWIG(this.width, this.height, this.width, this.height, -Math.PI / 4, 0));
    },

    createStars: function () {
        let i = 0, length = this.STAR_COUNT; // 初始化星星数量
        for (; i < length; i++) {
            this.stars.push(new STAR(this.width, this.height, this.contextTwigs, this)); // 创建 STAR 对象并加入到 stars 数组
        }
    },

    render: function () {
        let i; // 渲染循环
        requestAnimationFrame(this.render); // 请求下一个动画帧

        let maxOpacity = 0, // 最大不透明度
            contextTwigs = this.contextTwigs, // Twig 上下文
            contextFireworks = this.contextFireworks; // 烟花上下文

        // 计算最大不透明度
        for (i = this.fireworks.length - 1; i >= 0; i--) {
            maxOpacity = Math.max(maxOpacity, this.fireworks[i].getOpacity());
        }
        // contextTwigs.clearRect(0, 0, this.width, this.height); // 清空 Twig 画布
        // contextFireworks.fillStyle = this.SKY_COLOR.replace('%luminance', 5 + maxOpacity * 15); // 设置天空颜色
        // contextFireworks.fillRect(0, 0, this.width, this.height); // 填充天空

        // 清除整个画布
        contextTwigs.clearRect(0, 0, this.width, this.height);
        contextFireworks.clearRect(0, 0, this.width, this.height);

        // 移除填充天空背景的代码
        // contextFireworks.fillStyle = this.SKY_COLOR.replace('%luminance', 5 + maxOpacity * 15);
        // contextFireworks.fillRect(0, 0, this.width, this.height);

        // 渲染烟花
        for (i = this.fireworks.length - 1; i >= 0; i--) {
            if (!this.fireworks[i].render(contextFireworks)) {
                this.fireworks.splice(i, 1); // 如果烟花没有再显示，则移除它
            }
        }
        // 渲染星星
        for (i = this.stars.length - 1; i >= 0; i--) {
            this.stars[i].render(contextTwigs); // 渲染星星到 Twig 上下文
        }
        // 渲染 Twig
        for (i = this.twigs.length - 1; i >= 0; i--) {
            this.twigs[i].render(contextTwigs); // 渲染 Twig
        }
        // 渲染叶子
        for (i = this.leaves.length - 1; i >= 0; i--) {
            if (!this.leaves[i].render(contextTwigs)) {
                this.leaves.splice(i, 1); // 如果叶子没有再显示，则移除它
            }
        }
        // 处理叶子出现间隔
        if (--this.leafInterval === 0) {
            this.leaves.push(new LEAF(this.width, this.height, this)); // 添加新的叶子
            this.leafInterval = this.getRandomValue(this.LEAF_INTERVAL_RANGE) | 0; // 重新设置叶子间隔
        }
        // 处理烟花出现间隔
        if (--this.fireworkInterval === 0) {
            this.fireworks.push(new FIREWORK(this.width, this.height, this)); // 添加新的烟花
            this.maxFireworkInterval = this.getRandomValue(this.FIREWORK_INTERVAL_RANGE) | 0; // 重新设置烟花间隔
            this.fireworkInterval = this.maxFireworkInterval; // 更新烟花间隔
        }
    }
};

TWIG.prototype = {
    SHAKE_FREQUENCY: Math.PI / 300, // 定义树枝摇动的频率
    MAX_LEVEL: 4, // 定义树枝的最大层级
    COLOR: 'hsla(120,60%,1%,0)', // 定义树枝的颜色

    renderBlock: function (context, x, y, length, level, angle) {
        context.save(); // 保存当前绘图状态
        context.translate(x, y); // 将坐标系原点移动到 (x, y)
        context.rotate(this.angle + angle * (level + 1)); // 旋转坐标系
        context.scale(this.rate, this.rate); // 缩放坐标系
        context.beginPath(); // 开始绘制路径
        context.moveTo(0, 0); // 移动到起点 (0, 0)
        context.lineTo(0, -length); // 绘制线段到 (0, -length)
        context.stroke(); // 绘制线条
        context.fill(); // 填充线条

        if (level === this.MAX_LEVEL) { // 如果达到最大层级
            length = length / (1 - level / 10); // 调整长度

            context.save(); // 保存当前绘图状态
            context.beginPath(); // 开始绘制路径
            context.scale(1 - level / 10, 1 - level / 10); // 缩放坐标系
            context.moveTo(0, -length); // 移动到起点 (0, -length)
            context.quadraticCurveTo(30, -length - 20, 0, -length - 80); // 绘制二次贝塞尔曲线
            context.quadraticCurveTo(-30, -length - 20, 0, -length); // 绘制二次贝塞尔曲线
            context.stroke(); // 绘制线条
            context.fill(); // 填充线条
            context.restore(); // 恢复之前的绘图状态
            context.restore(); // 恢复之前的绘图状态
        } else {
            for (let i = -1; i <= 1; i += 2) { // 循环绘制左右两个分支
                context.save(); // 保存当前绘图状态
                context.translate(0, -40); // 将坐标系原点移动到 (0, -40)
                context.rotate((Math.PI / 3 - Math.PI / 20 * level) * i); // 旋转坐标系
                context.scale(1 - level / 10, 1 - level / 10); // 缩放坐标系
                context.beginPath(); // 开始绘制路径
                context.moveTo(0, 0); // 移动到起点 (0, 0)
                context.lineTo(0, -length * 0.8); // 绘制线段到 (0, -length * 0.8)
                context.quadraticCurveTo(30, -length * 0.8 - 20, 0, -length * 0.8 - 80); // 绘制二次贝塞尔曲线
                context.quadraticCurveTo(-30, -length * 0.8 - 20, 0, -length * 0.8); // 绘制二次贝塞尔曲线
                context.stroke(); // 绘制线条
                context.fill(); // 填充线条
                context.restore(); // 恢复之前的绘图状态
            }
            context.restore(); // 恢复之前的绘图状态
            level++; // 增加层级
            this.renderBlock(context, x + 40 * Math.sin(this.angle + angle * level), y - 40 * Math.cos(this.angle + angle * level), length, level, angle); // 递归绘制下一层级
        }
    },

    render: function (context) {
        context.fillStyle = this.COLOR; // 设置填充颜色
        context.strokeStyle = this.COLOR; // 设置线条颜色
        context.lineWidth = 3; // 设置线条宽度
        this.renderBlock(context, this.x, this.y, 40, 0, Math.PI / 48 * Math.sin(this.theta)); // 调用 renderBlock 方法绘制树枝
        this.theta += this.SHAKE_FREQUENCY; // 增加 theta 值
        this.theta %= Math.PI * 2; // 使用浮点数取模运算
    }
};

LEAF.prototype = {
    OFFSET: 100, // 定义叶子的偏移量
    VELOCITY_Y: 3, // 定义叶子的垂直速度
    COLOR: 'hsla(120,60%,1%,0)', // 定义叶子的颜色

    init: function () {
        this.x = this.renderer.getRandomValue({ min: 0, max: this.width }); // 随机生成 x 坐标
        this.y = -this.OFFSET; // 设置 y 坐标为负偏移量
        this.vx = this.renderer.getRandomValue({ min: 0, max: 1 }) * (this.x <= this.width / 2 ? 1 : -1); // 随机生成 x 方向的速度
        this.vy = this.VELOCITY_Y; // 设置 y 方向的速度

        this.rate = this.renderer.getRandomValue({ min: 0.4, max: 0.8 }); // 随机生成缩放比例
        this.theta = this.renderer.getRandomValue({ min: 0, max: Math.PI * 2 }); // 随机生成旋转角度
        this.deltaTheta = this.renderer.getRandomValue({ min: -Math.PI / 300, max: Math.PI / 300 }); // 随机生成角度变化量
    },

    render: function (context) {
        context.save(); // 保存当前绘图状态
        context.fillStyle = this.COLOR; // 设置填充颜色
        context.translate(this.x, this.y); // 将坐标系原点移动到 (x, y)
        context.rotate(this.theta); // 旋转坐标系
        context.scale(this.rate, this.rate); // 缩放坐标系
        context.beginPath(); // 开始绘制路径
        context.moveTo(0, 0); // 移动到起点 (0, 0)
        context.quadraticCurveTo(30, -20, 0, -80); // 绘制二次贝塞尔曲线
        context.quadraticCurveTo(-30, -20, 0, 0); // 绘制二次贝塞尔曲线
        context.fill(); // 填充路径
        context.restore(); // 恢复之前的绘图状态

        this.x += this.vx * this.rate; // 更新 x 坐标
        this.y += this.vy * this.rate; // 更新 y 坐标
        this.theta += this.deltaTheta; // 更新旋转角度
        this.theta %= Math.PI * 2; // 使用浮点数取模运算

        return this.y <= this.height + this.OFFSET && this.x >= -this.OFFSET && this.x <= this.width + this.OFFSET; // 判断叶子是否在可见区域内
    }
};

STAR.prototype = {
    RADIUS_RANGE: { min: 1, max: 4 }, // 定义星星的半径范围
    COUNT_RANGE: { min: 100, max: 1000 }, // 定义星星的最大计数范围
    DELTA_THETA: Math.PI / 30, // 定义 theta 的变化量
    DELTA_PHI: Math.PI / 50000, // 定义 phi 的变化量

    init: function (context) {
        if (!this.renderer || !context) {
            throw new Error('Renderer or context is not defined'); // 如果渲染器或上下文未定义，抛出错误
        }

        this.x = this.renderer.getRandomValue({ min: 0, max: this.width }); // 随机生成 x 坐标
        this.y = this.renderer.getRandomValue({ min: 0, max: this.height }); // 随机生成 y 坐标
        this.radius = this.renderer.getRandomValue(this.RADIUS_RANGE); // 随机生成半径
        this.maxCount = this.renderer.getRandomValue(this.COUNT_RANGE) | 0; // 随机生成最大计数
        this.count = this.maxCount; // 设置计数为最大值
        this.theta = 0; // 初始化 theta 为 0
        this.phi = 0; // 初始化 phi 为 0

        this.gradient = context.createRadialGradient(0, 0, 0, 0, 0, this.radius); // 创建径向渐变
        this.gradient.addColorStop(0, 'hsla(220, 80%, 100%, 1)'); // 添加颜色停止点
        this.gradient.addColorStop(0.1, 'hsla(220, 80%, 80%, 1)'); // 添加颜色停止点
        this.gradient.addColorStop(0.25, 'hsla(220, 80%, 50%, 1)'); // 添加颜色停止点
        this.gradient.addColorStop(1, 'hsla(220, 80%, 30%, 0)'); // 添加颜色停止点
    },

    render: function (context) {
        if (!context) {
            throw new Error('Context is not defined'); // 如果上下文未定义，抛出错误
        }

        context.save(); // 保存当前绘图状态
        context.globalAlpha = Math.abs(Math.cos(this.theta)); // 设置全局透明度
        context.translate(this.width / 2, this.height / 2); // 将坐标系原点移动到画布中心
        context.rotate(this.phi); // 旋转坐标系
        context.translate(this.x - this.width / 2, this.y - this.height / 2); // 再次平移坐标系
        context.beginPath(); // 开始绘制路径
        context.fillStyle = this.gradient; // 设置填充样式为渐变色
        context.arc(0, 0, this.radius, 0, Math.PI * 2, false); // 绘制圆形
        context.fill(); // 填充圆形
        context.restore(); // 恢复之前的绘图状态

        if (--this.count === 0) { // 减少计数，如果计数为0
            this.count = this.maxCount; // 重置计数为最大值
            this.theta = Math.PI; // 确保 theta 重置为 Math.PI
        }
        if (this.theta > 0) { // 如果 theta 大于0
            this.theta -= this.DELTA_THETA; // 减少 theta 的值
        }
        this.phi += this.DELTA_PHI; // 增加 phi 的值
        this.phi = this.phi % (Math.PI / 2); // 使用浮点数取模运算
    }
};

// 粒子构造函数
/**
 * 粒子构造函数
 * @param {number} x - 粒子的初始 x 坐标
 * @param {number} y - 粒子的初始 y 坐标
 * @param {Renderer} renderer - 渲染器对象
 */
const PARTICLE = function (x, y, renderer) {
    this.x = x; // 设置粒子的 x 坐标
    this.y = y; // 设置粒子的 y 坐标
    this.renderer = renderer; // 设置渲染器对象
    this.init(); // 初始化粒子
};

// 烟花原型定义
FIREWORK.prototype = {
    COLOR: 'hsl(%hue, 80%, 60%)', // 颜色模板字符串
    PARTICLE_COUNT: 300, // 粒子数量
    DELTA_OPACITY: 0.01, // 不透明度变化量
    RADIUS: 2, // 粒子半径
    VELOCITY: -3, // 初始速度
    WAIT_COUNT_RANGE: { min: 30, max: 60 }, // 等待计数范围
    THRESHOLD: 50, // 阈值
    DELTA_THETA: Math.PI / 10, // 角度变化量
    GRAVITY: 0.002, // 重力加速度

    /**
     * 初始化烟花
     */
    init: function () {
        this.setParameters(); // 设置烟花参数
        this.createParticles(); // 创建粒子
    },

    /**
     * 设置烟花参数
     */
    setParameters: function () {
        if (!this.renderer) {
            throw new Error('Renderer is not defined'); // 如果渲染器未定义，抛出错误
        }

        const hue = (256 * Math.random()) | 0; // 生成随机色调

        this.x = this.renderer.getRandomValue({ min: this.width / 8, max: this.width * 7 / 8 }); // 设置 x 坐标
        this.y = this.renderer.getRandomValue({ min: this.height / 4, max: this.height / 2 }); // 设置 y 坐标
        this.x0 = this.x; // 保存初始 x 坐标
        this.y0 = this.height + this.RADIUS; // 保存初始 y 坐标
        this.color = this.COLOR.replace('%hue', hue); // 替换颜色模板中的色调
        this.status = 0; // 设置初始状态
        this.theta = 0; // 初始化角度
        this.waitCount = this.renderer.getRandomValue(this.WAIT_COUNT_RANGE); // 设置等待计数
        this.opacity = 1; // 设置初始不透明度
        this.velocity = this.VELOCITY; // 设置初始速度
        this.particles = []; // 初始化粒子数组
    },

    /**
     * 创建粒子
     */
    createParticles: function () {
        for (let i = 0; i < this.PARTICLE_COUNT; i++) { // 循环创建指定数量的粒子
            this.particles.push(new PARTICLE(this.x, this.y, this.renderer)); // 创建新的粒子并添加到数组中
        }
    },

    /**
     * 获取不透明度
     * @returns {number} 当前不透明度
     */
    getOpacity: function () {
        return this.status === 2 ? this.opacity : 0; // 如果状态为2，返回不透明度，否则返回0
    },

    /**
     * 渲染烟花
     * @param {CanvasRenderingContext2D} context - 画布上下文
     * @returns {boolean} 是否继续渲染
     */
    render: function (context) {
        if (!context) {
            throw new Error('Context is not defined'); // 如果上下文未定义，抛出错误
        }

        switch (this.status) {
            case 0: // 状态0：上升阶段
                context.save(); // 保存当前绘图状态
                context.fillStyle = this.color; // 设置填充颜色
                context.globalCompositeOperation = 'lighter'; // 设置合成操作模式
                const alpha = (this.y0 - this.y) <= this.THRESHOLD ? ((this.y0 - this.y) / this.THRESHOLD) : 1; // 计算透明度
                context.globalAlpha = alpha; // 设置全局透明度
                const sinTheta = Math.sin(this.theta) / 2; // 计算正弦值
                context.translate(this.x0 + sinTheta, this.y0); // 平移坐标系
                context.scale(0.8, 2.4); // 缩放坐标系
                context.beginPath(); // 开始绘制路径
                context.arc(0, 0, this.RADIUS, 0, Math.PI * 2, false); // 绘制圆形
                context.fill(); // 填充圆形
                context.restore(); // 恢复之前的绘图状态

                this.y0 += this.velocity; // 更新 y0 值

                if (this.y0 <= this.y) { // 如果 y0 小于等于 y
                    this.status = 1; // 改变状态为1
                }
                this.theta += this.DELTA_THETA; // 增加角度
                this.theta %= Math.PI * 2; // 取模运算
                this.velocity += this.GRAVITY; // 增加速度
                return true; // 返回 true 表示继续渲染
            case 1: // 状态1：等待阶段
                if (--this.waitCount <= 0) { // 减少等待计数，如果计数小于等于0
                    this.status = 2; // 改变状态为2
                }
                return true; // 返回 true 表示继续渲染
            case 2: // 状态2：爆炸阶段
                context.save(); // 保存当前绘图状态
                context.globalCompositeOperation = 'lighter'; // 设置合成操作模式
                context.globalAlpha = this.opacity; // 设置全局透明度
                context.fillStyle = this.color; // 设置填充颜色

                for (let i = 0; i < this.particles.length; i++) { // 循环渲染所有粒子
                    this.particles[i].render(context, this.opacity); // 渲染粒子
                }
                context.restore(); // 恢复之前的绘图状态
                this.opacity -= this.DELTA_OPACITY; // 减少不透明度
                return this.opacity > 0; // 如果不透明度大于0，返回 true 表示继续渲染
        }
    }
};

// 粒子原型定义
PARTICLE.prototype = {
    RADIUS: 1.5, // 粒子半径
    VELOCITY_RANGE: { min: 0, max: 3 }, // 速度范围
    GRAVITY: 0.02, // 重力加速度
    FRICTION: 0.98, // 摩擦系数

    /**
     * 初始化粒子
     */
    init: function () {
        if (!this.VELOCITY_RANGE || typeof this.VELOCITY_RANGE.min !== 'number' || typeof this.VELOCITY_RANGE.max !== 'number') {
            throw new Error('VELOCITY_RANGE is not defined or invalid'); // 如果速度范围未定义或无效，抛出错误
        }

        const radian = Math.PI * 2 * Math.random(); // 生成随机弧度
        const velocity = (1 - Math.pow(Math.random(), 6)) * this.VELOCITY_RANGE.max; // 计算速度
        const rate = Math.random(); // 生成随机率

        this.vx = velocity * Math.cos(radian) * rate; // 计算 x 方向的速度
        this.vy = velocity * Math.sin(radian) * rate; // 计算 y 方向的速度
    },

    /**
     * 渲染粒子
     * @param {CanvasRenderingContext2D} context - 画布上下文
     * @param {number} opacity - 当前不透明度
     */
    render: function (context, opacity) {
        if (!context) {
            throw new Error('Context is not defined'); // 如果上下文未定义，抛出错误
        }

        context.beginPath(); // 开始绘制路径
        context.arc(this.x, this.y, this.RADIUS, 0, Math.PI * 2, false); // 绘制圆形
        context.fill(); // 填充圆形

        this.x += this.vx; // 更新 x 坐标
        this.y += this.vy; // 更新 y 坐标
        this.vy += this.GRAVITY; // 增加 y 方向的速度
        this.vx *= this.FRICTION; // 应用摩擦力
        this.vy *= this.FRICTION; // 应用摩擦力
    }
};

// 页面加载完成后初始化渲染器
$(function () {
    RENDERER.init(); // 初始化渲染器
});
