const Commit = require('../../common/commit');
class AccountCommit extends Commit {
    constructor() {
        super();
    }
	set id(value) {
        this._modify('id', value);
    }
    get id() {
        return this._value('id');
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
	set nickname(value) {
        this._modify('nickname', value);
    }
    get nickname() {
        return this._value('nickname');
    }
	set openid(value) {
        this._modify('openid', value);
    }
    get openid() {
        return this._value('openid');
    }
	set email(value) {
        this._modify('email', value);
    }
    get email() {
        return this._value('email');
    }
	set from_ip(value) {
        this._modify('from_ip', value);
    }
    get from_ip() {
        return this._value('from_ip');
    }
	set created_at(value) {
        this._modify('created_at', value);
    }
    get created_at() {
        return this._value('created_at');
    }
	set inviter(value) {
        this._modify('inviter', value);
    }
    get inviter() {
        return this._value('inviter');
    }
	set token(value) {
        this._modify('token', value);
    }
    get token() {
        return this._value('token');
    }
	set active(value) {
        this._modify('active', value);
    }
    get active() {
        return this._value('active');
    }
	set forbid_talk(value) {
        this._modify('forbid_talk', value);
    }
    get forbid_talk() {
        return this._value('forbid_talk');
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
	set figure_url(value) {
        this._modify('figure_url', value);
    }
    get figure_url() {
        return this._value('figure_url');
    }
	set test(value) {
        this._modify('test', value);
    }
    get test() {
        return this._value('test');
    }
	set new_user_draw(value) {
        this._modify('new_user_draw', value);
    }
    get new_user_draw() {
        return this._value('new_user_draw');
    }
	set daily_draw(value) {
        this._modify('daily_draw', value);
    }
    get daily_draw() {
        return this._value('daily_draw');
    }
	set rank_name(value) {
        this._modify('rank_name', value);
    }
    get rank_name() {
        return this._value('rank_name');
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
	set login_count(value) {
        this._modify('login_count', value);
    }
    get login_count() {
        return this._value('login_count');
    }
	set updated_at(value) {
        this._modify('updated_at', value);
    }
    get updated_at() {
        return this._value('updated_at');
    }
	set ext(value) {
        this._modify('ext', value);
    }
    get ext() {
        return this._value('ext');
    }
	set bank_address(value) {
        this._modify('bank_address', value);
    }
    get bank_address() {
        return this._value('bank_address');
    }
	set bank_account(value) {
        this._modify('bank_account', value);
    }
    get bank_account() {
        return this._value('bank_account');
    }
	set bank_card(value) {
        this._modify('bank_card', value);
    }
    get bank_card() {
        return this._value('bank_card');
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
	set pin_code(value) {
        this._modify('pin_code', value);
    }
    get pin_code() {
        return this._value('pin_code');
    }
	set bind_card_at(value) {
        this._modify('bind_card_at', value);
    }
    get bind_card_at() {
        return this._value('bind_card_at');
    }
}
module.exports = AccountCommit;