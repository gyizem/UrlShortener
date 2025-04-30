const CHARS = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789"

function randomAlias(){
    let alias = ""

    for(let i=0; i<5;i++){
        alias += CHARS[Math.floor(Math.random()*CHARS.length)]
    }

    return alias
}

module.exports = randomAlias