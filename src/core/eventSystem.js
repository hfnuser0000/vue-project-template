const levenshtein = require('fast-levenshtein').get;

class EventEmitter {
    constructor() {
        this.listeners = {};
        this.history = {};
        this.died = 0;
        this.names = new Set();
    }
    register(name) {
        this.names.add(name);
    }
    unregister(name) {
        this.names.delete(name);
    }
    info() {
        const result = {
            nrTotalListeners: 0,
            nrDied: this.died,
            events: {}
        };
        Object.entries(this.listeners).forEach(([name, listeners]) => {
            result.nrTotalListeners += (listeners ?? []).length;
            result.events[name] = {
                nrListeners: (listeners ?? []).length
            }
        });
        return result;
    }
    checkName(name) {
        const findSimilarName = (name) => {
            let bestMatch = {
                distance: 1/0,
                n: null
            };
            this.names.forEach(n => {
                const distance = levenshtein(n, name);
                if(distance < bestMatch.distance) {
                    bestMatch.distance = distance;
                    bestMatch.n = n;
                }
            });
            return bestMatch.n;
        };
        if(!this.names.has(name)) {
            const suggestion = findSimilarName(name);
            let message = `Event name: '${name}' not found!`;
            suggestion && (message += ` Did you mean '${suggestion}'?`);
            console.error(message);
        }
    }
    on(name, callback, { timeTravel=false, timeout=0, one=false }={}) {
        this.checkName(name);
        (this.listeners[name] || (this.listeners[name] = [])) &&
            this.listeners[name].push(callback);
        timeTravel &&
            (one?(this.history[name]??[]).reverse():(this.history[name]??[])).forEach(
                (message) =>
                    (this.listeners[name] ?? []).includes(callback) &&
                    callback(...message)
            );
        timeout && setTimeout(() => this.remove(name, callback), timeout);
    }
    one(name, callback, options) {
        const handler = (...message) => {
            callback(...message);
            this.remove(name, handler);
        };
        this.on(name, handler, { ...options, one: true });
    }
    once(name, options) {
        return new Promise((resolve, reject) => {
            this.one(name, (...message) => { resolve(message); }, { ...options, timeTravel: true });
        });
    }
    remove(name, handler) {
        this.checkName(name);
        if ((this.listeners[name] ?? []).length) {
            const handlerIdx = this.listeners[name].indexOf(handler);
            handlerIdx > -1 && (this.listeners[name][handlerIdx] = undefined, this.died += 1);
        }
    }
    emit(name, ...message) {
        this.checkName(name);
        this.history[name] ?? (this.history[name] = []);
        this.history[name].push(message);
        (this.listeners[name] ?? []).forEach(v => v && v(...message));
        this.listeners[name] = (this.listeners[name] ?? []).filter(l => !!l);
    }
    unbind(name) {
        this.checkName(name);
        !!(this.listeners[name] ?? []).length && (this.died += this.listeners[name].length, this.listeners[name] = null);
    }
    unbindAll() {
        this.died += this.info().nrTotalListeners;
        this.listeners = {};
        this.history = {};
    }
    reset() {
        this.unbindAll();
        this.died = 0;
        this.names = new Set();
    }
}

class MultiPromise {
    constructor() {
        this.eventEmitter = new EventEmitter;
        this.eventEmitter.register('start');
        this.eventEmitter.register('fulfill');
        this.eventEmitter.register('finish');
        this.promises = {};
        this.eventEmitter.one('start', () => {
            const unfinishes = new Set();
            Object.values(this.promises).forEach(promise => {
                if(!promise.fulfilled) unfinishes.add(promise.__id);
            });
            this.eventEmitter.on('fulfill', promise => {
                unfinishes.delete(promise.__id);
                if(!unfinishes.size) this.eventEmitter.emit('finish', this.promises);
            }, { timeTravel: true });
        });
    }
    register(promiseID) {
        if(this.promises[promiseID]) throw `Promise already registered '${promiseID}'`;
        this.promises[promiseID] = {
            __id: promiseID,
            result: undefined,
            fulfilled: false
        };
    }
    fulfill(promiseID, result) {
        if(!this.promises[promiseID]) throw `Promise not found '${promiseID}'`;
        this.promises[promiseID].result = result;
        this.promises[promiseID].fulfilled = true;
        this.eventEmitter.emit('fulfill', this.promises[promiseID]);
    }
    start() {
        this.eventEmitter.emit('start');
        return new Promise((resolve, reject) => {
            this.eventEmitter.one('finish', result => {
                this.eventEmitter.unbind('start');
                this.eventEmitter.unbind('fulfill');
                resolve(result);
            }, { timeTravel: true });
        });
    }
}

export {
    EventEmitter,
    MultiPromise
};
