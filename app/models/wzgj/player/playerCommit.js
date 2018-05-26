const Commit = require('../../common/commit');
class PlayerCommit extends Commit {
    constructor() {
        super();
    }
	set uid(value) {
        this._modify('uid', value);
    }
    get uid() {
        return this._value('uid');
    }
	set username(value) {
        this._modify('username', value);
    }
    get username() {
        return this._value('username');
    }
	set password(value) {
        this._modify('password', value);
    }
    get password() {
        return this._value('password');
    }
	set phone(value) {
        this._modify('phone', value);
    }
    get phone() {
        return this._value('phone');
    }
	set email(value) {
        this._modify('email', value);
    }
    get email() {
        return this._value('email');
    }
	set from(value) {
        this._modify('from', value);
    }
    get from() {
        return this._value('from');
    }
	set regTime(value) {
        this._modify('regTime', value);
    }
    get regTime() {
        return this._value('regTime');
    }
	set inviter(value) {
        this._modify('inviter', value);
    }
    get inviter() {
        return this._value('inviter');
    }
	set active(value) {
        this._modify('active', value);
    }
    get active() {
        return this._value('active');
    }
	set forbidTalk(value) {
        this._modify('forbidTalk', value);
    }
    get forbidTalk() {
        return this._value('forbidTalk');
    }
	set friends(value) {
        this._modify('friends', value);
    }
    get friends() {
        return this._value('friends');
    }
	set role(value) {
        this._modify('role', value);
    }
    get role() {
        return this._value('role');
    }
	set roleName(value) {
        this._modify('roleName', value);
    }
    get roleName() {
        return this._value('roleName');
    }
	set imageId(value) {
        this._modify('imageId', value);
    }
    get imageId() {
        return this._value('imageId');
    }
	set rank(value) {
        this._modify('rank', value);
    }
    get rank() {
        return this._value('rank');
    }
	set pinCode(value) {
        this._modify('pinCode', value);
    }
    get pinCode() {
        return this._value('pinCode');
    }
	set money(value) {
        this._modify('money', value);
    }
    get money() {
        return this._value('money');
    }
	set level(value) {
        this._modify('level', value);
    }
    get level() {
        return this._value('level');
    }
	set experience(value) {
        this._modify('experience', value);
    }
    get experience() {
        return this._value('experience');
    }
	set loginCount(value) {
        this._modify('loginCount', value);
    }
    get loginCount() {
        return this._value('loginCount');
    }
	set lastOnlineTime(value) {
        this._modify('lastOnlineTime', value);
    }
    get lastOnlineTime() {
        return this._value('lastOnlineTime');
    }
	set ext(value) {
        this._modify('ext', value);
    }
    get ext() {
        return this._value('ext');
    }
	set address(value) {
        this._modify('address', value);
    }
    get address() {
        return this._value('address');
    }
	set account(value) {
        this._modify('account', value);
    }
    get account() {
        return this._value('account');
    }
	set cardNO(value) {
        this._modify('cardNO', value);
    }
    get cardNO() {
        return this._value('cardNO');
    }
	set weixin(value) {
        this._modify('weixin', value);
    }
    get weixin() {
        return this._value('weixin');
    }
	set zhifubao(value) {
        this._modify('zhifubao', value);
    }
    get zhifubao() {
        return this._value('zhifubao');
    }
	set bindTime(value) {
        this._modify('bindTime', value);
    }
    get bindTime() {
        return this._value('bindTime');
    }
}
module.exports = PlayerCommit;