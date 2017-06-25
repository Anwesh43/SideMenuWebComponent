const w = window.innerWidth,h = window.innerHeight
class SideMenuComponent extends HTMLElement  {
    constructor() {
        super()
        this.img = document.createElement('img')
        this.ul = document.createElement('ul')
        this.childObj = []
        for(var i=0;i<this.children.length;i++) {
            const child = this.children[i]
            this.childObj.push({text:child.getAttribute('text'),href:child.getAttribute('href')})
        }
        console.log(this.childObj)
        this.hamburgIcon = new HamburgIcon(this.img,this.ul)
        this.animationHandler = new AnimationHandler(this)
        const shadow = this.attachShadow({mode:'open'})
        this.initUiPosition()
        shadow.appendChild(this.ul)
        shadow.appendChild(this.img)
    }
    initUiPosition() {
        this.img.style.position = 'absolute'
        const ulSize = 3*w/20
        this.img.style.left = 0
        this.img.style.top = 0
        this.ul.style.width = ulSize

        this.ul.style.position = 'absolute'
        this.ul.style.left = -ulSize
        this.ul.style.top = 0
        this.ul.style.background = 'black'
        this.ul.style.opacity = 0.8
        this.ul.style.padding = '40px'
        this.childObj.forEach((child)=>{
            const li = document.createElement('li')
            const a = document.createElement('a')
            a.setAttribute('href',child.href)
            a.innerHTML = child.text
            a.style.color = 'white'
            a.style.fontSize = '30px'
            li.style.padding = '20px'
            console.log(a)

            li.appendChild(a)
            this.ul.appendChild(li)
        })
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
        context.globalAlpha = 0.8
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
    constructor(img,ul) {
        this.ly = w/50
        this.img = img
        this.ul = ul
        this.dir = 0
    }
    draw(context) {
        context.strokeStyle = 'white'
        context.lineWidth = 3
        context.save()
        context.translate(w/40,w/40)
        for(var i=0;i<3;i++) {
            context.beginPath()
            context.moveTo(-w/50,(i-1)*this.ly)
            context.lineTo(w/50,(i-1)*this.ly)
            context.stroke()
        }
        context.restore()
    }
    startUpdating(dir) {
        this.dir = dir
    }
    update() {
        this.img.style.left = parseFloat(this.img.style.left) + this.dir*(w/25)
        this.ly -= this.dir*(w/250)
        this.ul.style.left = parseFloat(this.ul.style.left) +this.dir*(parseFloat(this.ul.style.width)/5)
        if(this.ly>w/50) {
            this.dir = 0
            this.ly = w/50
            this.img.style.left = 0
            this.ul.style.left = -1*parseFloat(this.ul.style.width)
        }
        if(this.ly<0) {
            this.ly = 0
            this.img.style.left = w/5
            this.dir = 0
            this.ul.style.left = 0
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
                    this.component.render()
                }
            },50)
        }
    }
}
customElements.define('side-menu',SideMenuComponent)
