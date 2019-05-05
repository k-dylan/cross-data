/*
 * 跨域localStorage数据共享
 * iframe引用JS库
 * @Author: kdylan
 * @Date: 2019-05-05 11:21:29
 * @Last Modified by: kdylan
 * @Last Modified time: 2019-05-05 18:55:02
 */

export default class Hub {
    /**
     * 构造函数
     * @param {RegExp} safeDomain 域名白名单正则表达式
     * @param {String} prefix key前缀
     */
    constructor (safeDomain, prefix) {
        this._safeDomain = safeDomain || /.*/;
        this._prefix = prefix ? `cros_${prefix}` : 'cros';
        this._action = ['set', 'get', 'clear', 'remove'];
        this._store = window.localStorage;
        if (Object.prototype.toString.call(this._safeDomain) !== '[object RegExp]') {
            throw new Error('safeDomain必须是正则表达式')
        }

        window.addEventListener('message', event => {
            if (typeof event.data !== 'string') return;
            let data = JSON.parse(event.data);
            if (this._action.includes(data.type) === false) return ;
            if (this._safeDomain.test(event.origin) === false) return;

            let message = this[data.type](data.key, data.value) || {}
            message.pid = data.pid;
            window.top.postMessage(JSON.stringify(message), event.origin)
        })
    }

    set(key, value) {
        let k = `${this._prefix}_${key}`
        this._store.setItem(k, value);
        return {};
    }

    get(key) {
        let k = `${this._prefix}_${key}`
        let result = this._store.getItem(k);
        return { result: JSON.parse(result) }
    }
    
    remove(key) {
        let k = `${this._prefix}_${key}`
        this._store.removeItem(k);
        return {}
    }

    clear () {
        let keyReg = new RegExp(`^${this._prefix}`)
        Object.keys(this._store).forEach(k => {
            if (keyReg.test(k) === true) {
                this._store.removeItem(k)
            }
        })
    }
}