const crypto = require('crypto');

class Token{
    static create(uid, timestamp, secret) {
        let msg = uid + '|' + timestamp;
        let cipher = crypto.createCipher('aes256', secret);
        let enc = cipher.update(msg, 'utf8', 'hex');
        enc += cipher.final('hex');
        return enc;
    }

    static parse(token, secret) {
        let decipher = crypto.createDecipher('aes256', secret);
        let dec = null;
        try {
            dec = decipher.update(token, 'hex', 'utf8');
            dec += decipher.final('utf8');
        } catch(err) {
            return null;
        }
        let ts = dec.split('|');
        if(ts.length !== 2) {
            return null;
        }
        return {uid: +ts[0], timestamp: Number(ts[1])};
    }
}

module.exports = Token;
