const Commit = require('../../common/commit');
class BetCommit extends Commit {
    constructor() {
        super();
    }
	set id(value) {
        this._modify('id', value);
    }
    get id() {
        return this._value('id');
    }
	set uid(value) {
        this._modify('uid', value);
    }
    get uid() {
        return this._value('uid');
    }
	set period(value) {
        this._modify('period', value);
    }
    get period() {
        return this._value('period');
    }
	set identify(value) {
        this._modify('identify', value);
    }
    get identify() {
        return this._value('identify');
    }
	set betData(value) {
        this._modify('betData', value);
    }
    get betData() {
        return this._value('betData');
    }
	set betItems(value) {
        this._modify('betItems', value);
    }
    get betItems() {
        return this._value('betItems');
    }
	set betCount(value) {
        this._modify('betCount', value);
    }
    get betCount() {
        return this._value('betCount');
    }
	set betMoney(value) {
        this._modify('betMoney', value);
    }
    get betMoney() {
        return this._value('betMoney');
    }
	set winCount(value) {
        this._modify('winCount', value);
    }
    get winCount() {
        return this._value('winCount');
    }
	set winMoney(value) {
        this._modify('winMoney', value);
    }
    get winMoney() {
        return this._value('winMoney');
    }
	set betTime(value) {
        this._modify('betTime', value);
    }
    get betTime() {
        return this._value('betTime');
    }
	set state(value) {
        this._modify('state', value);
    }
    get state() {
        return this._value('state');
    }
}
module.exports = BetCommit;