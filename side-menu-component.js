const w = window.innerWidth,h = window.innerHeight
class SideMenuComponent extends HTMLElement  {
    constructor() {
        super()
        this.img = document.createElement('img')
        this.ul = document.createElement('ul')
        this.childObj = []
        for(var i=0;i<this.children.length;i++) {
            const child = this.children[i]
            this.childObj.push({text:child.text,href:child.href})
        }
    }
    connectedCallback() {
        this.render()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w/10
        canvas.height = h/10
        const context = canvas.getContext('2d')
        this.img.src = canvas.toDataURL()
    }
}
