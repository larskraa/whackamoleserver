/**
 * Created by rubenschmidt on 07.04.2016.
 */
var app = require('../index.js');
var Attender = require('./attender.js');
var io = app.io;


var attenders = [];
var masterId;
var gameName;
var currentMole = {
    hit: true
};
// Constructor
function Game(name, id) {
    // always initialize all instance properties
    this.name = name;
    gameName = name;
    masterId = id;
    attenders.push(new Attender(id, 0));
}
// class methods
Game.prototype.getName = function() {
    return this.name;
};

Game.prototype.getNuberOfAttenders = function ()
{
    return  attenders.length;
};

Game.prototype.getMasterId = function ()
{
    return masterId;
};

Game.prototype.joinGame = function (socketId, nickName)
{
    if (nickName == null){
        nickName = generateRandomNickName();
    }
    var attender = new Attender(socketId, nickName, 0);
    attenders.push(attender);
};

Game.prototype.isFull = function ()
{
    return attenders.length > 5
};

Game.prototype.start = function()
{
    // Start game after 3 seconds
    setTimeout(sendNewMole, 1000);
};

Game.prototype.registerHit = function (socketId)
{
    if (currentMole.hit === true){
        return false;
    }
    for (var i = 0; i < attenders.length; i++) {
        var attender = attenders[i];
        if (attender.id === socketId){
            attender.points += 1;
            currentMole.hit = true;
            return true;
        }
    }
};

function sendNewMole()
{
    if(currentMole.hit === false){
        setTimeout(sendNewMole, 500);
        return;
    }
    currentMole = {
        pos: getRandomInt(0,8),
        hit: false
    };
    console.log(currentMole);
    io.to(gameName).emit('new mole', JSON.stringify(currentMole));
    setTimeout(sendNewMole, 500);
}

function generateRandomNickName()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// export the class
module.exports = Game;