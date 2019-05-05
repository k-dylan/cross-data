/*
 * 跨域localStorage数据共享
 * 父页面引用库
 * @Author: kdylan
 * @Date: 2019-05-05 11:19:43
 * @Last Modified by: kdylan
 * @Last Modified time: 2019-05-05 19:11:20
 */

export default class Client {
    constructor(opts = {}) {
        if (!opts.iframeUrl) throw new Error('iframeUrl不能为空');
        this._createIframe(opts.iframeUrl);
        this._iframeOrigin = new URL(opts.iframeUrl).origin;
        this._iframeBeforeData = [];   // iframe加载完成以前发送的数据
        this._promiseCb = {};
        this._pid = 0; 

        window.addEventListener('message', event => {
            let data = event.data;
            if (typeof data !== 'object') {
                try {
                    data = JSON.parse(event.data);
                } catch (err) { retrun }
            }
            if (typeof data.pid === 'undefined') return;
            //TODO: 添加域名验证
            if (data.err) {
                this._promiseCb[data.pid].reject(data.error);
            } else {
                this._promiseCb[data.pid].resolve(data.result);
            }
        })
    }

    /**
     * 创建iframe
     * @param {String} url iframe url
     */
    _createIframe(url) {
        let frame = document.createElement('iframe');
        frame.style.cssText = 'width: 0px; height: 0px; position: absolute; top: -999px; left: -999px;'
        frame.setAttribute('src', url);
        frame.onload = () => {
            this.child = frame.contentWindow;
            this._iframeBeforeData.forEach(item => item())
        }
        document.body.appendChild(frame);
    }

    /**
     * 写入数据
     * @param {String} key 要写入的数据key
     * @param {Any} value 要写入的数据
     */
    set(key, value) {
        if(typeof value === 'undefined') return;
        value = JSON.stringify(value);

        return this._send({
            type: 'set',
            pid: this._pid++,
            key,
            value
        })
    }

    /**
     * 获取数据
     * @param {String} key 要获取的key
     */
    get(key) {
        return this._send({
            type: 'get',
            pid: this._pid++,
            key
        })
    }

    /**
     * 删除数据
     * @param {String} key 要删除的数据的key
     */
    remove(key) {
        return this._send({
            type: 'remove',
            pid: this._pid++,
            key
        })
    }

    /**
     * 清空数据
     */
    clear() {
        return this._send({
            type: 'clear',
            pid: this._pid++
        })
    }

    /**
     * 发送数据
     * @param {Object} message 要发送的数据内容
     */
    _send(message) {
        if (this.child) return this._postMessage(message)
        return new Promise((resolve) => {
            this._iframeBeforeData.push(() => {
                this._postMessage(message).then(resolve)
            });
        })
    }

    /**
     * 发送数据主函数
     */
    _postMessage (message) {
        return new Promise((resolve, reject) => {
            this.child.postMessage(JSON.stringify(message), this._iframeOrigin)
            this._promiseCb[message.pid] = {
                resolve,
                reject
            }
        })
    }
}