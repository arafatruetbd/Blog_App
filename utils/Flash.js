class Flash {
    constructor(req) {
        this.req = req
        this.success = this.extractFlashMessage('success')
        this.fail = this.extractFlashMessage('fail') 
    }
    extractFlashMessage(name){
        let messgae = this.req.flash(name)
        return messgae.length > 0 ? messgae[0] : false  
    }
    hasMessage(){
        return !this.success && !this.fail ? false : true
    }
    static getMessage(req) {
        let flash = new Flash(req)
        return {
            success: flash.success,
            fail: flash.fail,
            flashMessage: flash.hasMessage()
        }
    }
}

module.exports = Flash;