function RotateDecorator(target: any, propertyName: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function(degree: number, ...args: any[]) { // 确保degree作为参数
        let ctx = this.canvas_context;
        // 你的自定义逻辑
        let canvas = this.canvas_el;
        degree = degree ? Number(degree) : 0;
        this.transformCount = this.transformCount ?? 0;
        this.rotateDegreeSum = this.rotateDegreeSum ?? 0;
        this.rotateDegreeSum = (this.rotateDegreeSum + degree) % 360;
        degree = this.transformCount == 0 ? degree : -degree; // 消除翻转影响
        let deg = Math.PI / 180; // 角度转化为弧度
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(centerX, centerY);
        ctx.transform(Math.cos(deg * degree), Math.sin(deg * degree), -Math.sin(deg * degree), Math.cos(deg * degree), 0, 0);
        ctx.translate(-centerX, -centerY);

        // 原始方法可能不需要被调用，取决于你是否想扩展或完全替代原方法的行为
        // 如果你还想保留原始方法的行为，那么可以这样调用它：
        // originalMethod.apply(this, [degree, ...args]);
    };

    return descriptor;
}


export { RotateDecorator };