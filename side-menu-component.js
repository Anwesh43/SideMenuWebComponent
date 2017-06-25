const w = window.innerWidth,h = window.innerHeight
class SideMenuComponent extends HTMLElement  {
    constructor() {
        super()
        this.img = document.createElement('img')
        this.ul = document.createElement('ul')
        this.childObj = []
        this.img.style.position = 'absolute'
        this.img.style.left = w/20
        this.img.style.top = w/20
        for(var i=0;i<this.children.length;i++) {
            const child = this.children[i]
            this.childObj.push({text:child.text,href:child.href})
        }
        this.hamburgIcon = new HamburgIcon(this.img)
        this.animationHandler = new AnimationHandler(this)
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = (event) => {
            if(this.animationHandler) {
                this.animationHandler.startAnimation()
            }
        }
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/20
        canvas.height = w/20
        const context = canvas.getContext('2d')
        context.save()
        context.globalAlpha = 0.5
        context.fillStyle = 'black'
        context.fillRect(0,0,canvas.width,canvas.height)
        context.restore()
        this.hamburgIcon.draw(context)
        this.img.src = canvas.toDataURL()
    }
    update() {
        this.hamburgIcon.update()
    }
    startUpdating(dir) {
        this.hamburgIcon.startUpdating(dir)
    }
    stopped() {
        return this.hamburgIcon.stopped()
    }
}
class HamburgIcon {
    constructor(img) {
        this.ly = w/40
        this.img = img
        this.dir = 0
    }
    draw(context) {
        context.strokeStyle = 'white'
        context.lineWidth = w/100
        context.save()
        context.translate(w/40,w/40)
        for(var i=0;i<3;i++) {
            context.beginPath()
            context.moveTo(-w/40,(i-1)*this.ly)
            context.lineTo(w/40,(i-1)*this.ly))
            context.stroke()
        }
        context.restore()
    }
    startUpdating(dir) {
        this.dir = dir
    }
    update() {
        this.img.style.left = parseFloat(this.img.style.left) + this.dir*(w/50);
        this.ly -= this.dir*(w/200);
        if(this.ly>w/40) {
            this.dir = 0
            this.ly = w/40
            this.img.style.left = w/20
        }
        if(this.ly<0) {
            this.ly = 0
            this.img.style.left = 3*w/20
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
}
class AnimationHandler {
    constructor(component) {
        this.prevDir = -1
        this.animating = false
        this.component = component
    }

    startAnimation() {
        if(this.animating == false) {
            this.animating = true
            this.component.startUpdating(this.prevDir*-1)
            const interval = setInterval(()=>{
                this.component.render()
                this.component.update()
                if(this.component.stopped() == true) {
                    this.prevDir *= -1
                    this.animating = false
                    clearInterval(interval)
                }
            },50)
        }
    }
}
customElements.define('side-menu',SideMenuComponent)
