const redis = require('redis');
const client = redis.createClient();

const getkey = function(name) {
    return new Promise((resolve, reject) => {
        client.get(name, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        });
    });
}

const set = function(key, value) {
    return new Promise((resolve, reject) => {
        client.set(key, value, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        });
    });
}

const getlist = function(name) {
    return new Promise((resolve, reject) => {
        client.lrange(name, 0, -1, (err, reply) => {
            if (err) reject(err);
            else {
                for (let i = 0; i < reply.length; i++) reply[i] = JSON.parse(reply[i]);
                resolve(reply);
            }
        });
    });
} 

const hget = function(key, field) {
    return new Promise((resolve, reject) => {
        client.hget(key, field, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        });
    });
}

const hset = function(key, field, value) {
    return new Promise((resolve, reject) => {
        client.hset(key, field, value, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        });
    });
}

const hmset = function(key, data) {
    return new Promise((resolve, reject) => {
        client.hmset(key, data, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        });
    });
}

function incrby(key, increment) {
    return new Promise((resolve, reject) => {
        client.incrby(key, increment, (err, reply) => {
            if (err) reject(err);
            else resolve(Number(reply));
        });
    });
}

function decrby(key, increment) {
    return new Promise((resolve, reject) => {
        client.decrby(key, increment, (err, reply) => {
            if (err) reject(err);
            else resolve(Number(reply));
        });
    });
}

function hincrby(key, field, increment) {
    return new Promise((resolve, reject) => {
        client.hincrby(key, field, increment, (err, reply) => {
            if (err) reject(err);
            else resolve(Number(reply));
        });
    });
}

function mUpdate(data) {
    return new Promise((resolve, reject) => {
        client.mset(data, (err, reply) => {
            if (err) reject(err);
            else resolve(reply);
        })
    });
}

module.exports.set = set;
module.exports.get = getkey;
module.exports.lrange = getlist;
module.exports.mset = mUpdate;
module.exports.hget = hget;
module.exports.hset = hset;
module.exports.incrby = incrby;
module.exports.hincrby = hincrby;
module.exports.decrby = decrby;
module.exports.hmset = hmset;
