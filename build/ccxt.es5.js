"use strict";

/*

MIT License

Copyright (c) 2017 Igor Kroitor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _objectValues(obj) {
    var values = [];
    var keys = Object.keys(obj);

    for (var k = 0; k < keys.length; ++k) values.push(obj[keys[k]]);

    return values;
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function () {

    //-----------------------------------------------------------------------------
    // dependencies

    var CryptoJS = require('crypto-js'),
        qs = require('qs');

    //-----------------------------------------------------------------------------
    // this is updated by vss.js when building

    var version = '1.4.5';

    //-----------------------------------------------------------------------------
    // platform detection

    var isNode = typeof window === 'undefined',
        isCommonJS = typeof module !== 'undefined' && typeof require !== 'undefined';

    //-----------------------------------------------------------------------------

    var CCXTError = function (_Error) {
        _inherits(CCXTError, _Error);

        function CCXTError(message) {
            _classCallCheck(this, CCXTError);

            // a workaround to make `instanceof CCXTError` work in ES5
            var _this = _possibleConstructorReturn(this, (CCXTError.__proto__ || Object.getPrototypeOf(CCXTError)).call(this, message));

            _this.constructor = CCXTError;
            _this.__proto__ = CCXTError.prototype;
            _this.message = message;
            return _this;
        }

        return CCXTError;
    }(Error);

    var ExchangeError = function (_CCXTError) {
        _inherits(ExchangeError, _CCXTError);

        function ExchangeError(message) {
            _classCallCheck(this, ExchangeError);

            var _this2 = _possibleConstructorReturn(this, (ExchangeError.__proto__ || Object.getPrototypeOf(ExchangeError)).call(this, message));

            _this2.constructor = ExchangeError;
            _this2.__proto__ = ExchangeError.prototype;
            _this2.message = message;
            return _this2;
        }

        return ExchangeError;
    }(CCXTError);

    var AuthenticationError = function (_CCXTError2) {
        _inherits(AuthenticationError, _CCXTError2);

        function AuthenticationError(message) {
            _classCallCheck(this, AuthenticationError);

            var _this3 = _possibleConstructorReturn(this, (AuthenticationError.__proto__ || Object.getPrototypeOf(AuthenticationError)).call(this, message));

            _this3.constructor = AuthenticationError;
            _this3.__proto__ = AuthenticationError.prototype;
            _this3.message = message;
            return _this3;
        }

        return AuthenticationError;
    }(CCXTError);

    var NetworkError = function (_CCXTError3) {
        _inherits(NetworkError, _CCXTError3);

        function NetworkError(message) {
            _classCallCheck(this, NetworkError);

            var _this4 = _possibleConstructorReturn(this, (NetworkError.__proto__ || Object.getPrototypeOf(NetworkError)).call(this, message));

            _this4.constructor = NetworkError;
            _this4.__proto__ = NetworkError.prototype;
            _this4.message = message;
            return _this4;
        }

        return NetworkError;
    }(CCXTError);

    var DDoSProtection = function (_NetworkError) {
        _inherits(DDoSProtection, _NetworkError);

        function DDoSProtection(message) {
            _classCallCheck(this, DDoSProtection);

            var _this5 = _possibleConstructorReturn(this, (DDoSProtection.__proto__ || Object.getPrototypeOf(DDoSProtection)).call(this, message));

            _this5.constructor = DDoSProtection;
            _this5.__proto__ = DDoSProtection.prototype;
            _this5.message = message;
            return _this5;
        }

        return DDoSProtection;
    }(NetworkError);

    var RequestTimeout = function (_NetworkError2) {
        _inherits(RequestTimeout, _NetworkError2);

        function RequestTimeout(message) {
            _classCallCheck(this, RequestTimeout);

            var _this6 = _possibleConstructorReturn(this, (RequestTimeout.__proto__ || Object.getPrototypeOf(RequestTimeout)).call(this, message));

            _this6.constructor = RequestTimeout;
            _this6.__proto__ = RequestTimeout.prototype;
            _this6.message = message;
            return _this6;
        }

        return RequestTimeout;
    }(NetworkError);

    var ExchangeNotAvailable = function (_NetworkError3) {
        _inherits(ExchangeNotAvailable, _NetworkError3);

        function ExchangeNotAvailable(message) {
            _classCallCheck(this, ExchangeNotAvailable);

            var _this7 = _possibleConstructorReturn(this, (ExchangeNotAvailable.__proto__ || Object.getPrototypeOf(ExchangeNotAvailable)).call(this, message));

            _this7.constructor = ExchangeNotAvailable;
            _this7.__proto__ = ExchangeNotAvailable.prototype;
            _this7.message = message;
            return _this7;
        }

        return ExchangeNotAvailable;
    }(NetworkError);

    //-----------------------------------------------------------------------------
    // utility helpers

    var sleep = function sleep(ms) {
        return new Promise(function (resolve) {
            return setTimeout(resolve, ms);
        });
    };

    var decimal = function decimal(float) {
        return parseFloat(float).toString();
    };

    var timeout = function timeout(ms, promise) {
        return Promise.race([promise, sleep(ms).then(function () {
            throw new RequestTimeout('request timed out');
        })]);
    };

    var capitalize = function capitalize(string) {
        return string.length ? string.charAt(0).toUpperCase() + string.slice(1) : string;
    };

    var keysort = function keysort(object) {
        var result = {};
        Object.keys(object).sort().forEach(function (key) {
            return result[key] = object[key];
        });
        return result;
    };

    var extend = function extend() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var result = {};

        var _loop = function _loop(i) {
            if (_typeof(args[i]) === 'object') Object.keys(args[i]).forEach(function (key) {
                return result[key] = args[i][key];
            });
        };

        for (var i = 0; i < args.length; i++) {
            _loop(i);
        }return result;
    };

    var omit = function omit(object) {
        var result = extend(object);
        for (var i = 1; i < arguments.length; i++) {
            if (typeof arguments[i] === 'string') delete result[arguments[i]];else if (Array.isArray(arguments[i])) for (var k = 0; k < arguments[i].length; k++) {
                delete result[arguments[i][k]];
            }
        }return result;
    };

    var indexBy = function indexBy(array, key) {
        var result = {};
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (typeof element[key] != 'undefined') {
                result[element[key]] = element;
            }
        }
        return result;
    };

    var sortBy = function sortBy(array, key) {
        var descending = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        descending = descending ? -1 : 1;
        return array.sort(function (a, b) {
            return a[key] < b[key] ? -descending : a[key] > b[key] ? descending : 0;
        });
    };

    var flatten = function flatten(array) {
        var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        for (var i = 0, length = array.length; i < length; i++) {
            var value = array[i];
            if (Array.isArray(value)) {
                flatten(value, result);
            } else {
                result.push(value);
            }
        }
        return result;
    };

    var unique = function unique(array) {
        return array.filter(function (value, index, self) {
            return self.indexOf(value) == index;
        });
    };

    var pluck = function pluck(array, key) {
        return array.filter(function (element) {
            return typeof element[key] != 'undefined';
        }).map(function (element) {
            return element[key];
        });
    };

    var urlencode = function urlencode(object) {
        return qs.stringify(object);
    };

    var sum = function sum() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        var result = args.filter(function (arg) {
            return typeof arg != 'undefined';
        });
        return result.length > 0 ? result.reduce(function (sum, value) {
            return sum + value;
        }, 0) : undefined;
    };

    var ordered = function ordered(x) {
        return x;
    }; // a stub to keep assoc keys in order, in JS it does nothing, it's mostly for Python

    //-----------------------------------------------------------------------------
    // a cross-platform Fetch API

    var nodeFetch = isNode && module.require('node-fetch') // using module.require to prevent Webpack / React Native from trying to include it
    ,
        windowFetch = typeof window !== 'undefined' && window.fetch // native Fetch API (in newer browsers)
    ,
        xhrFetch = function xhrFetch(url, options) {
        var verbose = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return (// a quick ad-hoc polyfill (for older browsers)
            new Promise(function (resolve, reject) {

                if (verbose) console.log(url, options);

                var xhr = new XMLHttpRequest();
                var method = options.method || 'GET';

                xhr.open(method, url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) resolve(xhr.responseText);else {
                            // [403, 404, ...].indexOf (xhr.status) >= 0
                            throw new Error(method, url, xhr.status, xhr.responseText);
                        }
                    }
                };

                if (typeof options.headers != 'undefined') for (var header in options.headers) {
                    xhr.setRequestHeader(header, options.headers[header]);
                }xhr.send(options.body);
            })
        );
    };

    var fetch = nodeFetch || windowFetch || xhrFetch;

    //-----------------------------------------------------------------------------
    // string ←→ binary ←→ base64 conversion routines

    var stringToBinary = function stringToBinary(str) {
        var arr = new Uint8Array(str.length);
        for (var i = 0; i < str.length; i++) {
            arr[i] = str.charCodeAt(i);
        }
        return CryptoJS.lib.WordArray.create(arr);
    };

    var stringToBase64 = function stringToBase64(string) {
        return CryptoJS.enc.Latin1.parse(string).toString(CryptoJS.enc.Base64);
    },
        utf16ToBase64 = function utf16ToBase64(string) {
        return CryptoJS.enc.Utf16.parse(string).toString(CryptoJS.enc.Base64);
    },
        base64ToBinary = function base64ToBinary(string) {
        return CryptoJS.enc.Base64.parse(string);
    },
        base64ToString = function base64ToString(string) {
        return CryptoJS.enc.Base64.parse(string).toString(CryptoJS.enc.Utf8);
    },
        binaryToString = function binaryToString(string) {
        return string;
    };

    var binaryConcat = function binaryConcat() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        return args.reduce(function (a, b) {
            return a.concat(b);
        });
    };

    // url-safe-base64 without equals signs, with + replaced by - and slashes replaced by underscores
    var urlencodeBase64 = function urlencodeBase64(base64string) {
        return base64string.replace(/[=]+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
    };

    //-----------------------------------------------------------------------------
    // cryptography

    var hash = function hash(request) {
        var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'md5';
        var digest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'hex';

        var result = CryptoJS[hash.toUpperCase()](request);
        return digest == 'binary' ? result : result.toString(CryptoJS.enc[capitalize(digest)]);
    };

    var hmac = function hmac(request, secret) {
        var hash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'sha256';
        var digest = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'hex';

        var encoding = digest == 'binary' ? 'Latin1' : capitalize(digest);
        return CryptoJS['Hmac' + hash.toUpperCase()](request, secret).toString(CryptoJS.enc[capitalize(encoding)]);
    };

    //-----------------------------------------------------------------------------
    // a JSON Web Token authentication method

    var jwt = function jwt(request, secret) {
        var alg = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'HS256';
        var hash = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'sha256';

        var encodedHeader = urlencodeBase64(stringToBase64(JSON.stringify({ 'alg': alg, 'typ': 'JWT' }))),
            encodedData = urlencodeBase64(stringToBase64(JSON.stringify(request))),
            token = [encodedHeader, encodedData].join('.'),
            signature = urlencodeBase64(utf16ToBase64(hmac(token, secret, hash, 'utf16')));
        return [token, signature].join('.');
    };

    //-----------------------------------------------------------------------------
    // the base class

    var Exchange = function Exchange(config) {
        var _this12 = this;

        this.hash = hash;
        this.hmac = hmac;
        this.jwt = jwt; // JSON Web Token
        this.binaryConcat = binaryConcat;
        this.stringToBinary = stringToBinary;
        this.stringToBase64 = stringToBase64;
        this.base64ToBinary = base64ToBinary;
        this.base64ToString = base64ToString;
        this.binaryToString = binaryToString;
        this.utf16ToBase64 = utf16ToBase64;
        this.urlencode = urlencode;
        this.omit = omit;
        this.pluck = pluck;
        this.unique = unique;
        this.extend = extend;
        this.flatten = flatten;
        this.indexBy = indexBy;
        this.sortBy = sortBy;
        this.keysort = keysort;
        this.decimal = decimal;
        this.capitalize = capitalize;
        this.json = JSON.stringify;
        this.sum = sum;
        this.ordered = ordered;

        this.encode = function (string) {
            return string;
        };
        this.decode = function (string) {
            return string;
        };

        if (isNode) this.nodeVersion = process.version.match(/\d+\.\d+.\d+/)[0];

        this.init = function () {
            var _this8 = this;

            this.orders = {};
            this.trades = {};

            if (this.api) Object.keys(this.api).forEach(function (type) {
                Object.keys(_this8.api[type]).forEach(function (method) {
                    var urls = _this8.api[type][method];

                    var _loop2 = function _loop2() {
                        var url = urls[i].trim();
                        var splitPath = url.split(/[^a-zA-Z0-9]/);

                        var uppercaseMethod = method.toUpperCase();
                        var lowercaseMethod = method.toLowerCase();
                        var camelcaseMethod = capitalize(lowercaseMethod);
                        var camelcaseSuffix = splitPath.map(capitalize).join('');
                        var underscoreSuffix = splitPath.map(function (x) {
                            return x.trim().toLowerCase();
                        }).filter(function (x) {
                            return x.length > 0;
                        }).join('_');

                        if (camelcaseSuffix.indexOf(camelcaseMethod) === 0) camelcaseSuffix = camelcaseSuffix.slice(camelcaseMethod.length);

                        if (underscoreSuffix.indexOf(lowercaseMethod) === 0) underscoreSuffix = underscoreSuffix.slice(lowercaseMethod.length);

                        var camelcase = type + camelcaseMethod + capitalize(camelcaseSuffix);
                        var underscore = type + '_' + lowercaseMethod + '_' + underscoreSuffix;

                        var f = function f(params) {
                            return _this8.request(url, type, uppercaseMethod, params);
                        };

                        _this8[camelcase] = f;
                        _this8[underscore] = f;
                    };

                    for (var i = 0; i < urls.length; i++) {
                        _loop2();
                    }
                });
            });

            if (this.markets) this.setMarkets(this.markets);
        };

        this.fetch = function (url) {
            var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';

            var _this9 = this;

            var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var body = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;


            if (isNode && this.userAgent) if (typeof this.userAgent == 'string') headers = extend({ 'User-Agent': this.userAgent }, headers);else if (_typeof(this.userAgent) == 'object' && 'User-Agent' in this.userAgent) headers = extend(this.userAgent, headers);

            if (this.proxy.length) headers = extend({ 'Origin': '*' }, headers);

            var options = { 'method': method, 'headers': headers, 'body': body };

            url = this.proxy + url;

            if (this.verbose) console.log(this.id, method, url, "\nRequest:\n", options);

            return timeout(this.timeout, fetch(url, options).catch(function (e) {
                if (isNode) {
                    throw new ExchangeNotAvailable([_this9.id, method, url, e.type, e.message].join(' '));
                }
                throw e; // rethrow all unknown errors
            }).then(function (response) {

                if (typeof response == 'string') return response;

                return response.text().then(function (text) {
                    if (_this9.verbose) console.log(_this9.id, method, url, text ? "\nResponse:\n" + text : '');
                    if (response.status >= 200 && response.status <= 300) return text;
                    var error = undefined;
                    var details = text;
                    if ([429].indexOf(response.status) >= 0) {
                        error = DDoSProtection;
                    } else if ([404, 409, 500, 501, 502, 521, 525].indexOf(response.status) >= 0) {
                        error = ExchangeNotAvailable;
                    } else if ([400, 403, 405, 503].indexOf(response.status) >= 0) {
                        var ddosProtection = text.match(/cloudflare|incapsula/i);
                        if (ddosProtection) {
                            error = DDoSProtection;
                        } else {
                            error = ExchangeNotAvailable;
                            details = text + ' (possible reasons: ' + ['invalid API keys', 'bad or old nonce', 'exchange is down or offline', 'on maintenance', 'DDoS protection', 'rate-limiting'].join(', ') + ')';
                        }
                    } else if ([408, 504].indexOf(response.status) >= 0) {
                        error = RequestTimeout;
                    } else if ([401, 422, 511].indexOf(response.status) >= 0) {
                        error = AuthenticationError;
                    } else {
                        error = Error;
                    }
                    throw new error([_this9.id, method, url, response.status, response.statusText, details].join(' '));
                });
            }).then(function (response) {
                return _this9.handleResponse(url, method, headers, response);
            }));
        };

        this.handleResponse = function (url) {
            var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'GET';
            var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
            var body = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;


            try {

                return JSON.parse(body);
            } catch (e) {

                var maintenance = body.match(/offline|busy|retry|wait|unavailable|maintain|maintenance|maintenancing/i);
                var ddosProtection = body.match(/cloudflare|incapsula|overload/i);

                if (e instanceof SyntaxError) {

                    var error = ExchangeNotAvailable;
                    var details = 'not accessible from this location at the moment';
                    if (maintenance) details = 'offline, on maintenance or unreachable from this location at the moment';
                    if (ddosProtection) error = DDoSProtection;
                    throw new error([this.id, method, url, details].join(' '));
                }

                if (this.verbose) console.log(this.id, method, url, 'error', e, "response body:\n'" + body + "'");

                throw e;
            }
        };

        this.set_markets = this.setMarkets = function (markets) {
            var values = _objectValues(markets);
            this.markets = indexBy(values, 'symbol');
            this.marketsById = indexBy(markets, 'id');
            this.markets_by_id = this.marketsById;
            this.symbols = Object.keys(this.markets);
            var base = this.pluck(values.filter(function (market) {
                return 'base' in market;
            }), 'base');
            var quote = this.pluck(values.filter(function (market) {
                return 'quote' in market;
            }), 'quote');
            this.currencies = this.unique(base.concat(quote));
            return this.markets;
        };

        this.load_markets = this.loadMarkets = function () {
            var _this10 = this;

            var reload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (!reload && this.markets) {
                if (!this.marketsById) {
                    return new Promise(function (resolve, reject) {
                        return resolve(_this10.setMarkets(_this10.markets));
                    });
                }
                return new Promise(function (resolve, reject) {
                    return resolve(_this10.markets);
                });
            }
            return this.fetchMarkets().then(function (markets) {
                return _this10.setMarkets(markets);
            });
        };

        this.fetch_tickers = function () {
            return this.fetchTickers();
        };

        this.fetchTickers = function () {
            throw new ExchangeError(this.id + ' API does not allow to fetch all tickers at once with a single call to fetch_tickers () for now');
        };

        this.fetch_markets = function () {
            return this.fetchMarkets();
        };

        this.fetchMarkets = function () {
            var _this11 = this;

            return new Promise(function (resolve, reject) {
                return resolve(_this11.markets);
            });
        };

        this.commonCurrencyCode = function (currency) {
            if (!this.substituteCommonCurrencyCodes) return currency;
            if (currency == 'XBT') return 'BTC';
            if (currency == 'BCC') return 'BCH';
            if (currency == 'DRK') return 'DASH';
            return currency;
        };

        this.market = function (market) {
            return typeof market === 'string' && typeof this.markets != 'undefined' && typeof this.markets[market] != 'undefined' ? this.markets[market] : market;
        };

        this.market_id = this.marketId = function (market) {
            return this.market(market).id || market;
        };

        this.symbol = function (market) {
            return this.market(market).symbol || market;
        };

        this.extract_params = this.extractParams = function (string) {
            var re = /{([a-zA-Z0-9_]+?)}/g;
            var matches = [];
            var match = void 0;
            while (match = re.exec(string)) {
                matches.push(match[1]);
            }return matches;
        };

        this.implode_params = this.implodeParams = function (string, params) {
            for (var property in params) {
                string = string.replace('{' + property + '}', params[property]);
            }return string;
        };

        this.url = function (path) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var result = this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (Object.keys(query).length) result += '?' + this.urlencode(query);
            return result;
        };

        this.parse_trades = this.parseTrades = function (trades) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var result = [];
            for (var t = 0; t < trades.length; t++) {
                result.push(this.parseTrade(trades[t], market));
            }
            return result;
        };

        this.parse_ohlcv = this.parseOHLCV = function (ohlcv) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            return ohlcv;
        };

        this.parse_ohlcvs = this.parseOHLCVs = function (ohlcvs) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
            var timeframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
            var since = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
            var limit = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;

            var result = [];
            for (var t = 0; t < ohlcvs.length; t++) {
                result.push(this.parseOHLCV(ohlcvs[t], market, timeframe, since, limit));
            }
            return result;
        };

        this.create_limit_buy_order = this.createLimitBuyOrder = function (market, amount, price) {
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.createOrder(market, 'limit', 'buy', amount, price, params);
        };

        this.create_limit_sell_order = this.createLimitSellOrder = function (market, amount, price) {
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            return this.createOrder(market, 'limit', 'sell', amount, price, params);
        };

        this.create_market_buy_order = this.createMarketBuyOrder = function (market, amount) {
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return this.createOrder(market, 'market', 'buy', amount, undefined, params);
        };

        this.create_market_sell_order = this.createMarketSellOrder = function (market, amount) {
            var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return this.createOrder(market, 'market', 'sell', amount, undefined, params);
        };

        this.iso8601 = function (timestamp) {
            return new Date(timestamp).toISOString();
        };
        this.parse8601 = Date.parse;
        this.seconds = function () {
            return Math.floor(_this12.milliseconds() / 1000);
        };
        this.microseconds = function () {
            return Math.floor(_this12.milliseconds() * 1000);
        };
        this.milliseconds = Date.now;
        this.nonce = this.seconds;
        this.id = undefined;
        this.rateLimit = 2000; // milliseconds = seconds * 1000
        this.timeout = 10000; // milliseconds = seconds * 1000
        this.verbose = false;
        this.userAgent = false;
        this.twofa = false; // two-factor authentication
        this.substituteCommonCurrencyCodes = true;
        this.yyyymmddhhmmss = function (timestamp) {
            var date = new Date(timestamp);
            var yyyy = date.getUTCFullYear();
            var MM = date.getUTCMonth();
            var dd = date.getUTCDay();
            var hh = date.getUTCHours();
            var mm = date.getUTCMinutes();
            var ss = date.getUTCSeconds();
            MM = MM < 10 ? '0' + MM : MM;
            dd = dd < 10 ? '0' + dd : dd;
            hh = hh < 10 ? '0' + hh : hh;
            mm = mm < 10 ? '0' + mm : mm;
            ss = ss < 10 ? '0' + ss : ss;
            return yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss;
        };

        if (isNode) this.userAgent = {
            'User-Agent': 'ccxt/' + version + ' (+https://github.com/kroitor/ccxt)' + ' Node.js/' + this.nodeVersion + ' (JavaScript)'

            // prepended to URL, like https://proxy.com/https://exchange.com/api...
        };this.proxy = '';

        for (var property in config) {
            this[property] = config[property];
        }this.fetch_balance = this.fetchBalance;
        this.fetch_order_book = this.fetchOrderBook;
        this.fetch_ticker = this.fetchTicker;
        this.fetch_trades = this.fetchTrades;

        this.init();
    };

    //=============================================================================

    var _1broker = {

        'id': '_1broker',
        'name': '1Broker',
        'countries': 'US',
        'rateLimit': 1500,
        'version': 'v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766021-420bd9fc-5ecb-11e7-8ed6-56d0081efed2.jpg',
            'api': 'https://1broker.com/api',
            'www': 'https://1broker.com',
            'doc': 'https://1broker.com/?c=en/content/api-documentation'
        },
        'api': {
            'private': {
                'get': ['market/bars', 'market/categories', 'market/details', 'market/list', 'market/quotes', 'market/ticks', 'order/cancel', 'order/create', 'order/open', 'position/close', 'position/close_cancel', 'position/edit', 'position/history', 'position/open', 'position/shared/get', 'social/profile_statistics', 'social/profile_trades', 'user/bitcoin_deposit_address', 'user/details', 'user/overview', 'user/quota_status', 'user/transaction_log']
            }
        },

        fetchCategories: function fetchCategories() {
            var categories,
                _this13 = this;

            return Promise.resolve().then(function () {
                return _this13.privateGetMarketCategories();
            }).then(function (_resp) {
                categories = _resp;

                return categories['response'];
            });
        },
        fetchMarkets: function fetchMarkets() {
            function _recursive() {
                if (c < categories.length) {
                    return Promise.resolve().then(function () {
                        category = categories[c];
                        return this_.privateGetMarketList({
                            'category': category.toLowerCase()
                        });
                    }).then(function (_resp) {
                        markets = _resp;

                        for (p = 0; p < markets['response'].length; p++) {
                            market = markets['response'][p];
                            id = market['symbol'];
                            symbol = undefined;
                            base = undefined;
                            quote = undefined;

                            if (category == 'FOREX' || category == 'CRYPTO') {
                                symbol = market['name'];
                                parts = symbol.split('/');

                                base = parts[0];
                                quote = parts[1];
                            } else {
                                base = id;
                                quote = 'USD';
                                symbol = base + '/' + quote;
                            }
                            base = this_.commonCurrencyCode(base);
                            quote = this_.commonCurrencyCode(quote);
                            result.push({
                                'id': id,
                                'symbol': symbol,
                                'base': base,
                                'quote': quote,
                                'info': market
                            });
                        }
                        c++;
                        return _recursive();
                    });
                }
            }

            var this_,
                categories,
                result,
                c,
                category,
                markets,
                p,
                market,
                id,
                symbol,
                base,
                quote,
                parts,
                _this14 = this;

            return Promise.resolve().then(function () {
                this_ = _this14; // workaround for Babel bug (not passing `this` to _recursive() call)

                return _this14.fetchCategories();
            }).then(function (_resp) {
                categories = _resp;
                result = [];
                c = 0;
                return _recursive();
            }).then(function () {
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var balance,
                response,
                result,
                c,
                currency,
                _this18 = this;

            return Promise.resolve().then(function () {
                return _this18.loadMarkets();
            }).then(function () {
                return _this18.privateGetUserOverview();
            }).then(function (_resp) {
                balance = _resp;
                response = balance['response'];
                result = {
                    'info': response
                };

                for (c = 0; c < _this18.currencies.length; c++) {
                    currency = _this18.currencies[c];

                    result[currency] = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };
                }
                result['BTC']['free'] = parseFloat(response['balance']);
                result['BTC']['total'] = result['BTC']['free'];
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                bidPrice,
                askPrice,
                bid,
                ask,
                _this19 = this,
                _arguments7 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments7.length > 1 && _arguments7[1] !== undefined ? _arguments7[1] : {};
                return _this19.loadMarkets();
            }).then(function () {
                return _this19.privateGetMarketQuotes(_this19.extend({
                    'symbols': _this19.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['response'][0];
                timestamp = _this19.parse8601(orderbook['updated']);
                bidPrice = parseFloat(orderbook['bid']);
                askPrice = parseFloat(orderbook['ask']);
                bid = [bidPrice, undefined];
                ask = [askPrice, undefined];

                return {
                    'timestamp': timestamp,
                    'datetime': _this19.iso8601(timestamp),
                    'bids': [bid],
                    'asks': [ask]
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this20 = this;

            throw new ExchangeError(_this20.id + ' fetchTrades () method not implemented yet');
        },
        fetchTicker: function fetchTicker(market) {
            var result,
                orderbook,
                ticker,
                timestamp,
                _this21 = this;

            return Promise.resolve().then(function () {
                return _this21.loadMarkets();
            }).then(function () {
                return _this21.privateGetMarketBars({
                    'symbol': _this21.marketId(market),
                    'resolution': 60,
                    'limit': 1
                });
            }).then(function (_resp) {
                result = _resp;
                return _this21.fetchOrderBook(market);
            }).then(function (_resp) {
                orderbook = _resp;
                ticker = result['response'][0];
                timestamp = _this21.parse8601(ticker['date']);

                return {
                    'timestamp': timestamp,
                    'datetime': _this21.iso8601(timestamp),
                    'high': parseFloat(ticker['h']),
                    'low': parseFloat(ticker['l']),
                    'bid': orderbook['bids'][0][0],
                    'ask': orderbook['asks'][0][0],
                    'vwap': undefined,
                    'open': parseFloat(ticker['o']),
                    'close': parseFloat(ticker['c']),
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': undefined
                };
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                result,
                _this22 = this,
                _arguments10 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments10.length > 4 && _arguments10[4] !== undefined ? _arguments10[4] : undefined;
                params = _arguments10.length > 5 && _arguments10[5] !== undefined ? _arguments10[5] : {};
                return _this22.loadMarkets();
            }).then(function () {
                order = {
                    'symbol': _this22.marketId(market),
                    'margin': amount,
                    'direction': side == 'sell' ? 'short' : 'long',
                    'leverage': 1,
                    'type': side
                };

                if (type == 'limit') {
                    order['price'] = price;
                } else {
                    order['type'] += '_market';
                }return _this22.privateGetOrderCreate(_this22.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['response']['order_id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this23 = this;

            return Promise.resolve().then(function () {
                return _this23.loadMarkets();
            }).then(function () {
                return _this23.privatePostOrderCancel({ 'order_id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                response,
                _this24 = this,
                _arguments12 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments12.length > 1 && _arguments12[1] !== undefined ? _arguments12[1] : 'public';
                method = _arguments12.length > 2 && _arguments12[2] !== undefined ? _arguments12[2] : 'GET';
                params = _arguments12.length > 3 && _arguments12[3] !== undefined ? _arguments12[3] : {};
                headers = _arguments12.length > 4 && _arguments12[4] !== undefined ? _arguments12[4] : undefined;
                body = _arguments12.length > 5 && _arguments12[5] !== undefined ? _arguments12[5] : undefined;

                if (!_this24.apiKey) {
                    throw new AuthenticationError(_this24.id + ' requires apiKey for all requests');
                }url = _this24.urls['api'] + '/' + _this24.version + '/' + path + '.php';
                query = _this24.extend({ 'token': _this24.apiKey }, params);

                url += '?' + _this24.urlencode(query);
                return _this24.fetch(url, method);
            }).then(function (_resp) {
                response = _resp;

                if ('warning' in response) {
                    if (response['warning']) {
                        throw new ExchangeError(_this24.id + ' Warning: ' + response['warning_message']);
                    }
                }if ('error' in response) {
                    if (response['error']) {
                        throw new ExchangeError(_this24.id + ' Error: ' + response['error_code'] + response['error_message']);
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var cryptocapital = {

        'id': 'cryptocapital',
        'name': 'Crypto Capital',
        'comment': 'Crypto Capital API',
        'countries': 'PA', // Panama
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27993158-7a13f140-64ac-11e7-89cc-a3b441f0b0f8.jpg',
            'www': 'https://cryptocapital.co',
            'doc': 'https://github.com/cryptocap'
        },
        'api': {
            'public': {
                'get': ['stats', 'historical-prices', 'order-book', 'transactions']
            },
            'private': {
                'post': ['balances-and-info', 'open-orders', 'user-transactions', 'btc-deposit-address/get', 'btc-deposit-address/new', 'deposits/get', 'withdrawals/get', 'orders/new', 'orders/edit', 'orders/cancel', 'orders/status', 'withdrawals/new']
            }
        },

        fetchBalance: function fetchBalance() {
            var response,
                balance,
                result,
                c,
                currency,
                account,
                _this25 = this;

            return Promise.resolve().then(function () {
                return _this25.privatePostBalancesAndInfo();
            }).then(function (_resp) {
                response = _resp;
                balance = response['balances-and-info'];
                result = { 'info': balance };

                for (c = 0; c < _this25.currencies.length; c++) {
                    currency = _this25.currencies[c];
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (currency in balance['available']) {
                        account['free'] = parseFloat(balance['available'][currency]);
                    }if (currency in balance['on_hold']) {
                        account['used'] = parseFloat(balance['on_hold'][currency]);
                    }account['total'] = _this25.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                _timestamp,
                price,
                amount,
                _this26 = this,
                _arguments14 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments14.length > 1 && _arguments14[1] !== undefined ? _arguments14[1] : {};
                return _this26.publicGetOrderBook(_this26.extend({
                    'currency': _this26.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['order-book'];
                timestamp = _this26.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this26.iso8601(timestamp)
                };
                sides = { 'bids': 'bid', 'asks': 'ask' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        _timestamp = parseInt(order['timestamp']) * 1000;
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['order_amount']);

                        result[key].push([price, amount, _timestamp]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this27 = this;

            return Promise.resolve().then(function () {
                return _this27.publicGetStats({
                    'currency': _this27.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['stats'];
                timestamp = _this27.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this27.iso8601(timestamp),
                    'high': parseFloat(ticker['max']),
                    'low': parseFloat(ticker['min']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last_price']),
                    'change': parseFloat(ticker['daily_change']),
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['total_btc_traded'])
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this28 = this;

            return _this28.publicGetTransactions({
                'currency': _this28.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                result,
                _this29 = this,
                _arguments17 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments17.length > 4 && _arguments17[4] !== undefined ? _arguments17[4] : undefined;
                params = _arguments17.length > 5 && _arguments17[5] !== undefined ? _arguments17[5] : {};
                order = {
                    'side': side,
                    'type': type,
                    'currency': _this29.marketId(market),
                    'amount': amount
                };

                if (type == 'limit') {
                    order['limit_price'] = price;
                }return _this29.privatePostOrdersNew(_this29.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this30 = this;

            return _this30.privatePostOrdersCancel({ 'id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                request,
                response,
                errors,
                e,
                error,
                _this31 = this,
                _arguments19 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments19.length > 1 && _arguments19[1] !== undefined ? _arguments19[1] : 'public';
                method = _arguments19.length > 2 && _arguments19[2] !== undefined ? _arguments19[2] : 'GET';
                params = _arguments19.length > 3 && _arguments19[3] !== undefined ? _arguments19[3] : {};
                headers = _arguments19.length > 4 && _arguments19[4] !== undefined ? _arguments19[4] : undefined;
                body = _arguments19.length > 5 && _arguments19[5] !== undefined ? _arguments19[5] : undefined;

                if (_this31.id == 'cryptocapital') {
                    throw new ExchangeError(_this31.id + ' is an abstract base API for _1btcxe');
                }url = _this31.urls['api'] + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this31.urlencode(params);
                    }
                } else {
                    query = _this31.extend({
                        'api_key': _this31.apiKey,
                        'nonce': _this31.nonce()
                    }, params);
                    request = _this31.json(query);

                    query['signature'] = _this31.hmac(_this31.encode(request), _this31.encode(_this31.secret));
                    body = _this31.json(query);
                    headers = { 'Content-Type': 'application/json' };
                }
                return _this31.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('errors' in response) {
                    errors = [];

                    for (e = 0; e < response['errors'].length; e++) {
                        error = response['errors'][e];

                        errors.push(error['code'] + ': ' + error['message']);
                    }
                    errors = errors.join(' ');
                    throw new ExchangeError(_this31.id + ' ' + errors);
                }
                return _this31.fetch(url, method, headers, body);
            });
        }
    };

    //-----------------------------------------------------------------------------

    var _1btcxe = extend(cryptocapital, {

        'id': '_1btcxe',
        'name': '1BTCXE',
        'countries': 'PA', // Panama
        'comment': 'Crypto Capital API',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766049-2b294408-5ecc-11e7-85cc-adaff013dc1a.jpg',
            'api': 'https://1btcxe.com/api',
            'www': 'https://1btcxe.com',
            'doc': 'https://1btcxe.com/api-docs.php'
        },
        'markets': {
            'BTC/USD': { 'id': 'USD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'EUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/CNY': { 'id': 'CNY', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
            'BTC/RUB': { 'id': 'RUB', 'symbol': 'BTC/RUB', 'base': 'BTC', 'quote': 'RUB' },
            'BTC/CHF': { 'id': 'CHF', 'symbol': 'BTC/CHF', 'base': 'BTC', 'quote': 'CHF' },
            'BTC/JPY': { 'id': 'JPY', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' },
            'BTC/GBP': { 'id': 'GBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP' },
            'BTC/CAD': { 'id': 'CAD', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD' },
            'BTC/AUD': { 'id': 'AUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
            'BTC/AED': { 'id': 'AED', 'symbol': 'BTC/AED', 'base': 'BTC', 'quote': 'AED' },
            'BTC/BGN': { 'id': 'BGN', 'symbol': 'BTC/BGN', 'base': 'BTC', 'quote': 'BGN' },
            'BTC/CZK': { 'id': 'CZK', 'symbol': 'BTC/CZK', 'base': 'BTC', 'quote': 'CZK' },
            'BTC/DKK': { 'id': 'DKK', 'symbol': 'BTC/DKK', 'base': 'BTC', 'quote': 'DKK' },
            'BTC/HKD': { 'id': 'HKD', 'symbol': 'BTC/HKD', 'base': 'BTC', 'quote': 'HKD' },
            'BTC/HRK': { 'id': 'HRK', 'symbol': 'BTC/HRK', 'base': 'BTC', 'quote': 'HRK' },
            'BTC/HUF': { 'id': 'HUF', 'symbol': 'BTC/HUF', 'base': 'BTC', 'quote': 'HUF' },
            'BTC/ILS': { 'id': 'ILS', 'symbol': 'BTC/ILS', 'base': 'BTC', 'quote': 'ILS' },
            'BTC/INR': { 'id': 'INR', 'symbol': 'BTC/INR', 'base': 'BTC', 'quote': 'INR' },
            'BTC/MUR': { 'id': 'MUR', 'symbol': 'BTC/MUR', 'base': 'BTC', 'quote': 'MUR' },
            'BTC/MXN': { 'id': 'MXN', 'symbol': 'BTC/MXN', 'base': 'BTC', 'quote': 'MXN' },
            'BTC/NOK': { 'id': 'NOK', 'symbol': 'BTC/NOK', 'base': 'BTC', 'quote': 'NOK' },
            'BTC/NZD': { 'id': 'NZD', 'symbol': 'BTC/NZD', 'base': 'BTC', 'quote': 'NZD' },
            'BTC/PLN': { 'id': 'PLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
            'BTC/RON': { 'id': 'RON', 'symbol': 'BTC/RON', 'base': 'BTC', 'quote': 'RON' },
            'BTC/SEK': { 'id': 'SEK', 'symbol': 'BTC/SEK', 'base': 'BTC', 'quote': 'SEK' },
            'BTC/SGD': { 'id': 'SGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' },
            'BTC/THB': { 'id': 'THB', 'symbol': 'BTC/THB', 'base': 'BTC', 'quote': 'THB' },
            'BTC/TRY': { 'id': 'TRY', 'symbol': 'BTC/TRY', 'base': 'BTC', 'quote': 'TRY' },
            'BTC/ZAR': { 'id': 'ZAR', 'symbol': 'BTC/ZAR', 'base': 'BTC', 'quote': 'ZAR' }
        }
    });

    //-----------------------------------------------------------------------------

    var anxpro = {

        'id': 'anxpro',
        'name': 'ANXPro',
        'countries': ['JP', 'SG', 'HK', 'NZ'],
        'version': '2',
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27765983-fd8595da-5ec9-11e7-82e3-adb3ab8c2612.jpg',
            'api': 'https://anxpro.com/api',
            'www': 'https://anxpro.com',
            'doc': ['http://docs.anxv2.apiary.io', 'https://anxpro.com/pages/api']
        },
        'api': {
            'public': {
                'get': ['{currency_pair}/money/ticker', '{currency_pair}/money/depth/full', '{currency_pair}/money/trade/fetch']
            },
            'private': {
                'post': ['{currency_pair}/money/order/add', '{currency_pair}/money/order/cancel', '{currency_pair}/money/order/quote', '{currency_pair}/money/order/result', '{currency_pair}/money/orders', 'money/{currency}/address', 'money/{currency}/send_simple', 'money/info', 'money/trade/list', 'money/wallet/history']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'BTCUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/HKD': { 'id': 'BTCHKD', 'symbol': 'BTC/HKD', 'base': 'BTC', 'quote': 'HKD' },
            'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/CAD': { 'id': 'BTCCAD', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD' },
            'BTC/AUD': { 'id': 'BTCAUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
            'BTC/SGD': { 'id': 'BTCSGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' },
            'BTC/JPY': { 'id': 'BTCJPY', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' },
            'BTC/GBP': { 'id': 'BTCGBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP' },
            'BTC/NZD': { 'id': 'BTCNZD', 'symbol': 'BTC/NZD', 'base': 'BTC', 'quote': 'NZD' },
            'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'DOGE/BTC': { 'id': 'DOGEBTC', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC' },
            'STR/BTC': { 'id': 'STRBTC', 'symbol': 'STR/BTC', 'base': 'STR', 'quote': 'BTC' },
            'XRP/BTC': { 'id': 'XRPBTC', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var response,
                balance,
                currencies,
                result,
                c,
                currency,
                account,
                wallet,
                _this32 = this;

            return Promise.resolve().then(function () {
                return _this32.privatePostMoneyInfo();
            }).then(function (_resp) {
                response = _resp;
                balance = response['data'];
                currencies = Object.keys(balance['Wallets']);
                result = { 'info': balance };

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (currency in balance['Wallets']) {
                        wallet = balance['Wallets'][currency];

                        account['free'] = parseFloat(wallet['Available_Balance']['value']);
                        account['total'] = parseFloat(wallet['Balance']['value']);
                        account['used'] = account['total'] - account['free'];
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                t,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this33 = this,
                _arguments21 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments21.length > 1 && _arguments21[1] !== undefined ? _arguments21[1] : {};
                return _this33.publicGetCurrencyPairMoneyDepthFull(_this33.extend({
                    'currency_pair': _this33.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['data'];
                t = parseInt(orderbook['dataUpdateTime']);
                timestamp = parseInt(t / 1000);
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this33.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['amount']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                t,
                timestamp,
                bid,
                ask,
                _this34 = this;

            return Promise.resolve().then(function () {
                return _this34.publicGetCurrencyPairMoneyTicker({
                    'currency_pair': _this34.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['data'];
                t = parseInt(ticker['dataUpdateTime']);
                timestamp = parseInt(t / 1000);
                bid = undefined;
                ask = undefined;

                if (ticker['buy']['value']) {
                    bid = parseFloat(ticker['buy']['value']);
                }if (ticker['sell']['value']) {
                    ask = parseFloat(ticker['sell']['value']);
                }return {
                    'timestamp': timestamp,
                    'datetime': _this34.iso8601(timestamp),
                    'high': parseFloat(ticker['high']['value']),
                    'low': parseFloat(ticker['low']['value']),
                    'bid': bid,
                    'ask': ask,
                    'vwap': parseFloat(ticker['vwap']['value']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']['value']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['avg']['value']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']['value'])
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var error,
                _this35 = this;

            error = _this35.id + ' switched off the trades endpoint, see their docs at http://docs.anxv2.apiary.io/reference/market-data/currencypairmoneytradefetch-disabled';

            throw new ExchangeError(error);
            return _this35.publicGetCurrencyPairMoneyTradeFetch({
                'currency_pair': _this35.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                result,
                _this36 = this,
                _arguments24 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments24.length > 4 && _arguments24[4] !== undefined ? _arguments24[4] : undefined;
                params = _arguments24.length > 5 && _arguments24[5] !== undefined ? _arguments24[5] : {};
                order = {
                    'currency_pair': _this36.marketId(market),
                    'amount_int': amount,
                    'type': side
                };

                if (type == 'limit') {
                    order['price_int'] = price;
                }return _this36.privatePostCurrencyPairOrderAdd(_this36.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['data']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this37 = this;

            return _this37.privatePostCurrencyPairOrderCancel({ 'oid': id });
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                query,
                url,
                nonce,
                secret,
                auth,
                response,
                _test,
                _this38 = this,
                _arguments26 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments26.length > 1 && _arguments26[1] !== undefined ? _arguments26[1] : 'public';
                method = _arguments26.length > 2 && _arguments26[2] !== undefined ? _arguments26[2] : 'GET';
                params = _arguments26.length > 3 && _arguments26[3] !== undefined ? _arguments26[3] : {};
                headers = _arguments26.length > 4 && _arguments26[4] !== undefined ? _arguments26[4] : undefined;
                body = _arguments26.length > 5 && _arguments26[5] !== undefined ? _arguments26[5] : undefined;
                request = _this38.implodeParams(path, params);
                query = _this38.omit(params, _this38.extractParams(path));
                url = _this38.urls['api'] + '/' + _this38.version + '/' + request;

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this38.urlencode(query);
                    }
                } else {
                    nonce = _this38.nonce();

                    body = _this38.urlencode(_this38.extend({ 'nonce': nonce }, query));
                    secret = _this38.base64ToBinary(_this38.secret);
                    auth = request + "\0" + body;

                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Rest-Key': _this38.apiKey,
                        'Rest-Sign': _this38.hmac(_this38.encode(auth), secret, 'sha512', 'base64')
                    };
                }
                return _this38.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test = 'result' in response;

                if (_test && response['result'] == 'success') {
                    return response;
                } else {
                    throw new ExchangeError(_this38.id + ' ' + _this38.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bit2c = {

        'id': 'bit2c',
        'name': 'Bit2C',
        'countries': 'IL', // Israel
        'rateLimit': 3000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766119-3593220e-5ece-11e7-8b3a-5a041f6bcc3f.jpg',
            'api': 'https://www.bit2c.co.il',
            'www': 'https://www.bit2c.co.il',
            'doc': ['https://www.bit2c.co.il/home/api', 'https://github.com/OferE/bit2c']
        },
        'api': {
            'public': {
                'get': ['Exchanges/{pair}/Ticker', 'Exchanges/{pair}/orderbook', 'Exchanges/{pair}/trades']
            },
            'private': {
                'post': ['Account/Balance', 'Account/Balance/v2', 'Merchant/CreateCheckout', 'Order/AccountHistory', 'Order/AddCoinFundsRequest', 'Order/AddFund', 'Order/AddOrder', 'Order/AddOrderMarketPriceBuy', 'Order/AddOrderMarketPriceSell', 'Order/CancelOrder', 'Order/MyOrders', 'Payment/GetMyId', 'Payment/Send']
            }
        },
        'markets': {
            'BTC/NIS': { 'id': 'BtcNis', 'symbol': 'BTC/NIS', 'base': 'BTC', 'quote': 'NIS' },
            'LTC/BTC': { 'id': 'LtcBtc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'LTC/NIS': { 'id': 'LtcNis', 'symbol': 'LTC/NIS', 'base': 'LTC', 'quote': 'NIS' }
        },

        fetchBalance: function fetchBalance() {
            var balance,
                result,
                c,
                currency,
                account,
                available,
                _this39 = this;

            return Promise.resolve().then(function () {
                return _this39.privatePostAccountBalanceV2();
            }).then(function (_resp) {
                balance = _resp;
                result = { 'info': balance };

                for (c = 0; c < _this39.currencies.length; c++) {
                    currency = _this39.currencies[c];
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (currency in balance) {
                        available = 'AVAILABLE_' + currency;

                        account['free'] = balance[available];
                        account['total'] = balance[currency];
                        account['used'] = account['total'] - account['free'];
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _timestamp2,
                _this40 = this,
                _arguments28 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments28.length > 1 && _arguments28[1] !== undefined ? _arguments28[1] : {};
                return _this40.publicGetExchangesPairOrderbook(_this40.extend({
                    'pair': _this40.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this40.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this40.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order[0];
                        amount = order[1];
                        _timestamp2 = order[2] * 1000;

                        result[side].push([price, amount, _timestamp2]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this41 = this;

            return Promise.resolve().then(function () {
                return _this41.publicGetExchangesPairTicker({
                    'pair': _this41.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this41.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this41.iso8601(timestamp),
                    'high': parseFloat(ticker['h']),
                    'low': parseFloat(ticker['l']),
                    'bid': undefined,
                    'ask': undefined,
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['ll']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['av']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['a'])
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this42 = this;

            return _this42.publicGetExchangesPairTrades({
                'pair': _this42.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                result,
                _this43 = this,
                _arguments31 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments31.length > 4 && _arguments31[4] !== undefined ? _arguments31[4] : undefined;
                params = _arguments31.length > 5 && _arguments31[5] !== undefined ? _arguments31[5] : {};
                method = 'privatePostOrderAddOrder';
                order = {
                    'Amount': amount,
                    'Pair': _this43.marketId(market)
                };

                if (type == 'market') {
                    method += 'MarketPrice' + _this43.capitalize(side);
                } else {
                    order['Price'] = price;
                    order['Total'] = amount * price;
                    order['IsBid'] = side == 'buy';
                }
                return _this43[method](_this43.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['NewOrder']['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this44 = this;

            return _this44.privatePostOrderCancelOrder({ 'id': id });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            if (api == 'public') {
                url += '.json';
            } else {
                var nonce = this.nonce();
                var query = this.extend({ 'nonce': nonce }, params);
                body = this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'key': this.apiKey,
                    'sign': this.hmac(this.encode(body), this.encode(this.secret), 'sha512', 'base64')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitbay = {

        'id': 'bitbay',
        'name': 'BitBay',
        'countries': ['PL', 'EU'], // Poland
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766132-978a7bd8-5ece-11e7-9540-bc96d1e9bbb8.jpg',
            'www': 'https://bitbay.net',
            'api': {
                'public': 'https://bitbay.net/API/Public',
                'private': 'https://bitbay.net/API/Trading/tradingApi.php'
            },
            'doc': ['https://bitbay.net/public-api', 'https://bitbay.net/account/tab-api', 'https://github.com/BitBayNet/API']
        },
        'api': {
            'public': {
                'get': ['{id}/all', '{id}/market', '{id}/orderbook', '{id}/ticker', '{id}/trades']
            },
            'private': {
                'post': ['info', 'trade', 'cancel', 'orderbook', 'orders', 'transfer', 'withdraw', 'history', 'transactions']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'BTCUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/PLN': { 'id': 'BTCPLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
            'LTC/USD': { 'id': 'LTCUSD', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD' },
            'LTC/EUR': { 'id': 'LTCEUR', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR' },
            'LTC/PLN': { 'id': 'LTCPLN', 'symbol': 'LTC/PLN', 'base': 'LTC', 'quote': 'PLN' },
            'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'ETH/USD': { 'id': 'ETHUSD', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD' },
            'ETH/EUR': { 'id': 'ETHEUR', 'symbol': 'ETH/EUR', 'base': 'ETH', 'quote': 'EUR' },
            'ETH/PLN': { 'id': 'ETHPLN', 'symbol': 'ETH/PLN', 'base': 'ETH', 'quote': 'PLN' },
            'ETH/BTC': { 'id': 'ETHBTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'LSK/USD': { 'id': 'LSKUSD', 'symbol': 'LSK/USD', 'base': 'LSK', 'quote': 'USD' },
            'LSK/EUR': { 'id': 'LSKEUR', 'symbol': 'LSK/EUR', 'base': 'LSK', 'quote': 'EUR' },
            'LSK/PLN': { 'id': 'LSKPLN', 'symbol': 'LSK/PLN', 'base': 'LSK', 'quote': 'PLN' },
            'LSK/BTC': { 'id': 'LSKBTC', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var response,
                balance,
                result,
                c,
                currency,
                account,
                _this45 = this;

            return Promise.resolve().then(function () {
                return _this45.privatePostInfo();
            }).then(function (_resp) {
                response = _resp;
                balance = response['balances'];
                result = { 'info': balance };

                for (c = 0; c < _this45.currencies.length; c++) {
                    currency = _this45.currencies[c];
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (currency in balance) {
                        account['free'] = parseFloat(balance[currency]['available']);
                        account['used'] = parseFloat(balance[currency]['locked']);
                        account['total'] = _this45.sum(account['free'], account['used']);
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this46 = this,
                _arguments34 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments34.length > 1 && _arguments34[1] !== undefined ? _arguments34[1] : {};
                return _this46.publicGetIdOrderbook(_this46.extend({
                    'id': _this46.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this46.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this46.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this47 = this;

            return Promise.resolve().then(function () {
                return _this47.publicGetIdTicker({
                    'id': _this47.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this47.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this47.iso8601(timestamp),
                    'high': parseFloat(ticker['max']),
                    'low': parseFloat(ticker['min']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['average']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this48 = this;

            return _this48.publicGetIdTrades({
                'id': _this48.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                _this49 = this,
                _arguments37 = arguments;

            price = _arguments37.length > 4 && _arguments37[4] !== undefined ? _arguments37[4] : undefined;
            params = _arguments37.length > 5 && _arguments37[5] !== undefined ? _arguments37[5] : {};
            p = _this49.market(market);

            return _this49.privatePostTrade(_this49.extend({
                'type': side,
                'currency': p['base'],
                'amount': amount,
                'payment_currency': p['quote'],
                'rate': price
            }, params));
        },
        cancelOrder: function cancelOrder(id) {
            var _this50 = this;

            return _this50.privatePostCancel({ 'id': id });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api];
            if (api == 'public') {
                url += '/' + this.implodeParams(path, params) + '.json';
            } else {
                body = this.urlencode(this.extend({
                    'method': path,
                    'moment': this.nonce()
                }, params));
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'API-Key': this.apiKey,
                    'API-Hash': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitbays = {

        'id': 'bitbays',
        'name': 'BitBays',
        'countries': ['CN', 'GB', 'HK', 'AU', 'CA'],
        'rateLimit': 1500,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27808599-983687d2-6051-11e7-8d95-80dfcbe5cbb4.jpg',
            'api': 'https://bitbays.com/api',
            'www': 'https://bitbays.com',
            'doc': 'https://bitbays.com/help/api/'
        },
        'api': {
            'public': {
                'get': ['ticker', 'trades', 'depth']
            },
            'private': {
                'post': ['cancel', 'info', 'orders', 'order', 'transactions', 'trade']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/CNY': { 'id': 'btc_cny', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
            'ODS/BTC': { 'id': 'ods_btc', 'symbol': 'ODS/BTC', 'base': 'ODS', 'quote': 'BTC' },
            'LSK/BTC': { 'id': 'lsk_btc', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC' },
            'LSK/CNY': { 'id': 'lsk_cny', 'symbol': 'LSK/CNY', 'base': 'LSK', 'quote': 'CNY' }
        },

        fetchBalance: function fetchBalance() {
            var response,
                balance,
                result,
                c,
                currency,
                lowercase,
                account,
                _this51 = this;

            return Promise.resolve().then(function () {
                return _this51.privatePostInfo();
            }).then(function (_resp) {
                response = _resp;
                balance = response['result']['wallet'];
                result = { 'info': balance };

                for (c = 0; c < _this51.currencies.length; c++) {
                    currency = _this51.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (lowercase in balance) {
                        account['free'] = parseFloat(balance[lowercase]['avail']);
                        account['used'] = parseFloat(balance[lowercase]['lock']);
                        account['total'] = _this51.sum(account['free'], account['used']);
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this52 = this,
                _arguments40 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments40.length > 1 && _arguments40[1] !== undefined ? _arguments40[1] : {};
                return _this52.publicGetDepth(_this52.extend({
                    'market': _this52.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['result'];
                timestamp = _this52.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this52.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this53 = this;

            return Promise.resolve().then(function () {
                return _this53.publicGetTicker({
                    'market': _this53.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['result'];
                timestamp = _this53.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this53.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this54 = this;

            return _this54.publicGetTrades({
                'market': _this54.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this55 = this,
                _arguments43 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments43.length > 4 && _arguments43[4] !== undefined ? _arguments43[4] : undefined;
                params = _arguments43.length > 5 && _arguments43[5] !== undefined ? _arguments43[5] : {};
                order = {
                    'market': _this55.marketId(market),
                    'op': side,
                    'amount': amount
                };

                if (type == 'market') {
                    order['order_type'] = 1;
                    order['price'] = price;
                } else {
                    order['order_type'] = 0;
                }
                return _this55.privatePostTrade(_this55.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['result']['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this56 = this;

            return _this56.privatePostCancel({ 'id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                response,
                _test2,
                _this57 = this,
                _arguments45 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments45.length > 1 && _arguments45[1] !== undefined ? _arguments45[1] : 'public';
                method = _arguments45.length > 2 && _arguments45[2] !== undefined ? _arguments45[2] : 'GET';
                params = _arguments45.length > 3 && _arguments45[3] !== undefined ? _arguments45[3] : {};
                headers = _arguments45.length > 4 && _arguments45[4] !== undefined ? _arguments45[4] : undefined;
                body = _arguments45.length > 5 && _arguments45[5] !== undefined ? _arguments45[5] : undefined;
                url = _this57.urls['api'] + '/' + _this57.version + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this57.urlencode(params);
                    }
                } else {
                    nonce = _this57.nonce();

                    body = _this57.urlencode(_this57.extend({
                        'nonce': nonce
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this57.apiKey,
                        'Sign': _this57.hmac(_this57.encode(body), _this57.secret, 'sha512')
                    };
                }
                return _this57.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test2 = 'status' in response;

                if (_test2 && response['status'] == 200) {
                    return response;
                } else {
                    throw new ExchangeError(_this57.id + ' ' + _this57.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bitcoincoid = {

        'id': 'bitcoincoid',
        'name': 'Bitcoin.co.id',
        'countries': 'ID', // Indonesia
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766138-043c7786-5ecf-11e7-882b-809c14f38b53.jpg',
            'api': {
                'public': 'https://vip.bitcoin.co.id/api',
                'private': 'https://vip.bitcoin.co.id/tapi'
            },
            'www': 'https://www.bitcoin.co.id',
            'doc': ['https://vip.bitcoin.co.id/downloads/BITCOINCOID-API-DOCUMENTATION.pdf', 'https://vip.bitcoin.co.id/trade_api']
        },
        'api': {
            'public': {
                'get': ['{pair}/ticker', '{pair}/trades', '{pair}/depth']
            },
            'private': {
                'post': ['getInfo', 'transHistory', 'trade', 'tradeHistory', 'openOrders', 'cancelOrder']
            }
        },
        'markets': {
            'BTC/IDR': { 'id': 'btc_idr', 'symbol': 'BTC/IDR', 'base': 'BTC', 'quote': 'IDR', 'baseId': 'btc', 'quoteId': 'idr' },
            'BTS/BTC': { 'id': 'bts_btc', 'symbol': 'BTS/BTC', 'base': 'BTS', 'quote': 'BTC', 'baseId': 'bts', 'quoteId': 'btc' },
            'DASH/BTC': { 'id': 'drk_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC', 'baseId': 'drk', 'quoteId': 'btc' },
            'DOGE/BTC': { 'id': 'doge_btc', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC', 'baseId': 'doge', 'quoteId': 'btc' },
            'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'baseId': 'eth', 'quoteId': 'btc' },
            'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'baseId': 'ltc', 'quoteId': 'btc' },
            'NXT/BTC': { 'id': 'nxt_btc', 'symbol': 'NXT/BTC', 'base': 'NXT', 'quote': 'BTC', 'baseId': 'nxt', 'quoteId': 'btc' },
            'STR/BTC': { 'id': 'str_btc', 'symbol': 'STR/BTC', 'base': 'STR', 'quote': 'BTC', 'baseId': 'str', 'quoteId': 'btc' },
            'NEM/BTC': { 'id': 'nem_btc', 'symbol': 'NEM/BTC', 'base': 'NEM', 'quote': 'BTC', 'baseId': 'nem', 'quoteId': 'btc' },
            'XRP/BTC': { 'id': 'xrp_btc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC', 'baseId': 'xrp', 'quoteId': 'btc' }
        },

        fetchBalance: function fetchBalance() {
            var response,
                balance,
                frozen,
                result,
                c,
                currency,
                lowercase,
                account,
                _this58 = this;

            return Promise.resolve().then(function () {
                return _this58.privatePostGetInfo();
            }).then(function (_resp) {
                response = _resp;
                balance = response['return']['balance'];
                frozen = response['return']['balance_hold'];
                result = { 'info': balance };

                for (c = 0; c < _this58.currencies.length; c++) {
                    currency = _this58.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (lowercase in balance) {
                        account['free'] = parseFloat(balance[lowercase]);
                    }
                    if (lowercase in frozen) {
                        account['used'] = parseFloat(frozen[lowercase]);
                    }
                    account['total'] = _this58.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this59 = this,
                _arguments47 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments47.length > 1 && _arguments47[1] !== undefined ? _arguments47[1] : {};
                return _this59.publicGetPairDepth(_this59.extend({
                    'pair': _this59.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this59.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this59.iso8601(timestamp)
                };
                sides = { 'bids': 'buy', 'asks': 'sell' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var pair,
                response,
                ticker,
                timestamp,
                baseVolume,
                quoteVolume,
                _this60 = this;

            return Promise.resolve().then(function () {
                pair = _this60.market(market);
                return _this60.publicGetPairTicker({
                    'pair': pair['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = parseFloat(ticker['server_time']) * 1000;
                baseVolume = 'vol_' + pair['baseId'].toLowerCase();
                quoteVolume = 'vol_' + pair['quoteId'].toLowerCase();

                return {
                    'timestamp': timestamp,
                    'datetime': _this60.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker[baseVolume]),
                    'quoteVolume': parseFloat(ticker[quoteVolume]),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this61 = this;

            return _this61.publicGetPairTrades({
                'pair': _this61.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                order,
                base,
                result,
                _this62 = this,
                _arguments50 = arguments;

            price = _arguments50.length > 4 && _arguments50[4] !== undefined ? _arguments50[4] : undefined;
            params = _arguments50.length > 5 && _arguments50[5] !== undefined ? _arguments50[5] : {};
            p = _this62.market(market);
            order = {
                'pair': p['id'],
                'type': side,
                'price': price
            };
            base = p['base'].toLowerCase();

            order[base] = amount;
            result = _this62.privatePostTrade(_this62.extend(order, params));

            return {
                'info': result,
                'id': result['return']['order_id'].toString()
            };
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this63 = this,
                _arguments51 = arguments;

            params = _arguments51.length > 1 && _arguments51[1] !== undefined ? _arguments51[1] : {};

            return _this63.privatePostCancelOrder(_this63.extend({
                'id': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                response,
                _this64 = this,
                _arguments52 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments52.length > 1 && _arguments52[1] !== undefined ? _arguments52[1] : 'public';
                method = _arguments52.length > 2 && _arguments52[2] !== undefined ? _arguments52[2] : 'GET';
                params = _arguments52.length > 3 && _arguments52[3] !== undefined ? _arguments52[3] : {};
                headers = _arguments52.length > 4 && _arguments52[4] !== undefined ? _arguments52[4] : undefined;
                body = _arguments52.length > 5 && _arguments52[5] !== undefined ? _arguments52[5] : undefined;
                url = _this64.urls['api'][api];

                if (api == 'public') {
                    url += '/' + _this64.implodeParams(path, params);
                } else {
                    body = _this64.urlencode(_this64.extend({
                        'method': path,
                        'nonce': _this64.nonce()
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this64.apiKey,
                        'Sign': _this64.hmac(_this64.encode(body), _this64.encode(_this64.secret), 'sha512')
                    };
                }
                return _this64.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this64.id + ' ' + response['error']);
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bitfinex = {

        'id': 'bitfinex',
        'name': 'Bitfinex',
        'countries': 'US',
        'version': 'v1',
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766244-e328a50c-5ed2-11e7-947b-041416579bb3.jpg',
            'api': 'https://api.bitfinex.com',
            'www': 'https://www.bitfinex.com',
            'doc': ['https://bitfinex.readme.io/v1/docs', 'https://bitfinex.readme.io/v2/docs', 'https://github.com/bitfinexcom/bitfinex-api-node']
        },
        'api': {
            'public': {
                'get': ['book/{symbol}', 'candles/{symbol}', 'lendbook/{currency}', 'lends/{currency}', 'pubticker/{symbol}', 'stats/{symbol}', 'symbols', 'symbols_details', 'today', 'trades/{symbol}']
            },
            'private': {
                'post': ['account_infos', 'balances', 'basket_manage', 'credits', 'deposit/new', 'funding/close', 'history', 'history/movements', 'key_info', 'margin_infos', 'mytrades', 'offer/cancel', 'offer/new', 'offer/status', 'offers', 'order/cancel', 'order/cancel/all', 'order/cancel/multi', 'order/cancel/replace', 'order/new', 'order/new/multi', 'order/status', 'orders', 'position/claim', 'positions', 'summary', 'taken_funds', 'total_taken_funds', 'transfer', 'unused_taken_funds', 'withdraw']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                baseId,
                quoteId,
                base,
                quote,
                symbol,
                _this65 = this;

            return Promise.resolve().then(function () {
                return _this65.publicGetSymbolsDetails();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['pair'].toUpperCase();
                    baseId = id.slice(0, 3);
                    quoteId = id.slice(3, 6);
                    base = baseId;
                    quote = quoteId;
                    // issue #4 Bitfinex names Dash as DSH, instead of DASH

                    if (base == 'DSH') {
                        base = 'DASH';
                    }symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'baseId': baseId,
                        'quoteId': quoteId,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                b,
                account,
                currency,
                uppercase,
                result,
                c,
                _currency,
                _account,
                _this66 = this;

            return Promise.resolve().then(function () {
                return _this66.loadMarkets();
            }).then(function () {
                return _this66.privatePostBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = {};

                for (b = 0; b < response.length; b++) {
                    account = response[b];

                    if (account['type'] == 'exchange') {
                        currency = account['currency'];
                        // issue #4 Bitfinex names Dash as DSH, instead of DASH

                        if (currency == 'DSH') {
                            currency = 'DASH';
                        }uppercase = currency.toUpperCase();

                        balances[uppercase] = account;
                    }
                }
                result = { 'info': response };

                for (c = 0; c < _this66.currencies.length; c++) {
                    _currency = _this66.currencies[c];
                    _account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (_currency in balances) {
                        _account['free'] = parseFloat(balances[_currency]['available']);
                        _account['total'] = parseFloat(balances[_currency]['amount']);
                        _account['used'] = _account['total'] - _account['free'];
                    }
                    result[_currency] = _account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _timestamp3,
                _this67 = this,
                _arguments55 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments55.length > 1 && _arguments55[1] !== undefined ? _arguments55[1] : {};
                return _this67.loadMarkets();
            }).then(function () {
                return _this67.publicGetBookSymbol(_this67.extend({
                    'symbol': _this67.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this67.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this67.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['amount']);
                        _timestamp3 = parseInt(parseFloat(order['timestamp']));

                        result[side].push([price, amount, _timestamp3]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this68 = this;

            return Promise.resolve().then(function () {
                return _this68.loadMarkets();
            }).then(function () {
                return _this68.publicGetPubtickerSymbol({
                    'symbol': _this68.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseFloat(ticker['timestamp']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this68.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last_price']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['mid']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        parseTrade: function parseTrade(trade, market) {
            var timestamp = trade['timestamp'] * 1000;
            var type = undefined;
            return {
                'id': trade['tid'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['type'],
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['amount'])
            };
        },
        fetchTrades: function fetchTrades(market) {
            var m,
                trades,
                _this69 = this;

            return Promise.resolve().then(function () {
                return _this69.loadMarkets();
            }).then(function () {
                m = _this69.market(market);
                return _this69.publicGetTradesSymbol({
                    'symbol': m['id']
                });
            }).then(function (_resp) {
                trades = _resp;

                return _this69.parseTrades(trades, m);
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                result,
                _this70 = this,
                _arguments58 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments58.length > 4 && _arguments58[4] !== undefined ? _arguments58[4] : undefined;
                params = _arguments58.length > 5 && _arguments58[5] !== undefined ? _arguments58[5] : {};
                return _this70.loadMarkets();
            }).then(function () {
                order = {
                    'symbol': _this70.marketId(market),
                    'amount': amount.toString(),
                    'side': side,
                    'type': 'exchange ' + type,
                    'ocoorder': false,
                    'buy_price_oco': 0,
                    'sell_price_oco': 0
                };

                if (type == 'market') {
                    order['price'] = _this70.nonce().toString();
                } else {
                    order['price'] = price;
                }
                return _this70.privatePostOrderNew(_this70.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this71 = this;

            return Promise.resolve().then(function () {
                return _this71.loadMarkets();
            }).then(function () {
                return _this71.privatePostOrderCancel({ 'order_id': id });
            });
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                query,
                url,
                nonce,
                payload,
                secret,
                response,
                _this72 = this,
                _arguments60 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments60.length > 1 && _arguments60[1] !== undefined ? _arguments60[1] : 'public';
                method = _arguments60.length > 2 && _arguments60[2] !== undefined ? _arguments60[2] : 'GET';
                params = _arguments60.length > 3 && _arguments60[3] !== undefined ? _arguments60[3] : {};
                headers = _arguments60.length > 4 && _arguments60[4] !== undefined ? _arguments60[4] : undefined;
                body = _arguments60.length > 5 && _arguments60[5] !== undefined ? _arguments60[5] : undefined;
                request = '/' + _this72.version + '/' + _this72.implodeParams(path, params);
                query = _this72.omit(params, _this72.extractParams(path));
                url = _this72.urls['api'] + request;

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this72.urlencode(query);
                    }
                } else {
                    nonce = _this72.nonce();

                    query = _this72.extend({
                        'nonce': nonce.toString(),
                        'request': request
                    }, query);
                    query = _this72.json(query);
                    query = _this72.encode(query);
                    payload = _this72.stringToBase64(query);
                    secret = _this72.encode(_this72.secret);

                    headers = {
                        'X-BFX-APIKEY': _this72.apiKey,
                        'X-BFX-PAYLOAD': payload,
                        'X-BFX-SIGNATURE': _this72.hmac(payload, secret, 'sha384')
                    };
                }
                return _this72.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('message' in response) {
                    throw new ExchangeError(_this72.id + ' ' + _this72.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bitflyer = {

        'id': 'bitflyer',
        'name': 'bitFlyer',
        'countries': 'JP',
        'version': 'v1',
        'rateLimit': 500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28051642-56154182-660e-11e7-9b0d-6042d1e6edd8.jpg',
            'api': 'https://api.bitflyer.jp',
            'www': 'https://bitflyer.jp',
            'doc': 'https://bitflyer.jp/API'
        },
        'api': {
            'public': {
                'get': ['getmarkets', // or 'markets'
                'getboard', // or 'board'
                'getticker', // or 'ticker'
                'getexecutions', // or 'executions'
                'gethealth', 'getchats']
            },
            'private': {
                'get': ['getpermissions', 'getbalance', 'getcollateral', 'getcollateralaccounts', 'getaddresses', 'getcoinins', 'getcoinouts', 'getbankaccounts', 'getdeposits', 'getwithdrawals', 'getchildorders', 'getparentorders', 'getparentorder', 'getexecutions', 'getpositions', 'gettradingcommission'],
                'post': ['sendcoin', 'withdraw', 'sendchildorder', 'cancelchildorder', 'sendparentorder', 'cancelparentorder', 'cancelallchildorders']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                currencies,
                base,
                quote,
                symbol,
                numCurrencies,
                _this73 = this;

            return Promise.resolve().then(function () {
                return _this73.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['product_code'];
                    currencies = id.split('_');
                    base = undefined;
                    quote = undefined;
                    symbol = id;
                    numCurrencies = currencies.length;

                    if (numCurrencies == 2) {
                        base = currencies[0];
                        quote = currencies[1];
                        symbol = base + '/' + quote;
                    }
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                b,
                account,
                currency,
                result,
                c,
                _currency2,
                _account2,
                _this74 = this;

            return Promise.resolve().then(function () {
                return _this74.loadMarkets();
            }).then(function () {
                return _this74.privateGetBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = {};

                for (b = 0; b < response.length; b++) {
                    account = response[b];
                    currency = account['currency_code'];

                    balances[currency] = account;
                }
                result = { 'info': response };

                for (c = 0; c < _this74.currencies.length; c++) {
                    _currency2 = _this74.currencies[c];
                    _account2 = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (_currency2 in balances) {
                        _account2['total'] = balances[_currency2]['amount'];
                        _account2['free'] = balances[_currency2]['available'];
                        _account2['used'] = _account2['total'] - _account2['free'];
                    }
                    result[_currency2] = _account2;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this75 = this,
                _arguments63 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments63.length > 1 && _arguments63[1] !== undefined ? _arguments63[1] : {};
                return _this75.loadMarkets();
            }).then(function () {
                return _this75.publicGetBoard(_this75.extend({
                    'product_code': _this75.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this75.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this75.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['size']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this76 = this;

            return Promise.resolve().then(function () {
                return _this76.loadMarkets();
            }).then(function () {
                return _this76.publicGetTicker({
                    'product_code': _this76.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this76.parse8601(ticker['timestamp']);

                return {
                    'timestamp': timestamp,
                    'datetime': _this76.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': parseFloat(ticker['best_bid']),
                    'ask': parseFloat(ticker['best_ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['ltp']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['volume_by_product']),
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this77 = this;

            return Promise.resolve().then(function () {
                return _this77.loadMarkets();
            }).then(function () {
                return _this77.publicGetExecutions({
                    'product_code': _this77.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                result,
                _this78 = this,
                _arguments66 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments66.length > 4 && _arguments66[4] !== undefined ? _arguments66[4] : undefined;
                params = _arguments66.length > 5 && _arguments66[5] !== undefined ? _arguments66[5] : {};
                return _this78.loadMarkets();
            }).then(function () {
                order = {
                    'product_code': _this78.marketId(market),
                    'child_order_type': type.toUpperCase(),
                    'side': side.toUpperCase(),
                    'price': price,
                    'size': amount
                };
                return _this78.privatePostSendchildorder(_this78.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['child_order_acceptance_id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this79 = this,
                _arguments67 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments67.length > 1 && _arguments67[1] !== undefined ? _arguments67[1] : {};
                return _this79.loadMarkets();
            }).then(function () {
                return _this79.privatePostCancelchildorder(_this79.extend({
                    'parent_order_id': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                url,
                nonce,
                auth,
                _this80 = this,
                _arguments68 = arguments;

            api = _arguments68.length > 1 && _arguments68[1] !== undefined ? _arguments68[1] : 'public';
            method = _arguments68.length > 2 && _arguments68[2] !== undefined ? _arguments68[2] : 'GET';
            params = _arguments68.length > 3 && _arguments68[3] !== undefined ? _arguments68[3] : {};
            headers = _arguments68.length > 4 && _arguments68[4] !== undefined ? _arguments68[4] : undefined;
            body = _arguments68.length > 5 && _arguments68[5] !== undefined ? _arguments68[5] : undefined;
            request = '/' + _this80.version + '/' + path;

            if (api == 'private') {
                request = '/me' + request;
            }url = _this80.urls['api'] + request;

            if (api == 'public') {
                if (Object.keys(params).length) {
                    url += '?' + _this80.urlencode(params);
                }
            } else {
                nonce = _this80.nonce().toString();

                body = _this80.json(params);
                auth = [nonce, method, request, body].join('');

                headers = {
                    'ACCESS-KEY': _this80.apiKey,
                    'ACCESS-TIMESTAMP': nonce,
                    'ACCESS-SIGN': _this80.hmac(_this80.encode(auth), _this80.secret),
                    'Content-Type': 'application/json'
                };
            }
            return _this80.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitlish = {

        'id': 'bitlish',
        'name': 'bitlish',
        'countries': ['GB', 'EU', 'RU'],
        'rateLimit': 1500,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766275-dcfc6c30-5ed3-11e7-839d-00a846385d0b.jpg',
            'api': 'https://bitlish.com/api',
            'www': 'https://bitlish.com',
            'doc': 'https://bitlish.com/api'
        },
        'api': {
            'public': {
                'get': ['instruments', 'ohlcv', 'pairs', 'tickers', 'trades_depth', 'trades_history']
            },
            'private': {
                'post': ['accounts_operations', 'balance', 'cancel_trade', 'cancel_trades_by_ids', 'cancel_all_trades', 'create_bcode', 'create_template_wallet', 'create_trade', 'deposit', 'list_accounts_operations_from_ts', 'list_active_trades', 'list_bcodes', 'list_my_matches_from_ts', 'list_my_trades', 'list_my_trads_from_ts', 'list_payment_methods', 'list_payments', 'redeem_code', 'resign', 'signin', 'signout', 'trade_details', 'trade_options', 'withdraw', 'withdraw_by_id']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                keys,
                p,
                market,
                id,
                symbol,
                _symbol$split,
                _symbol$split2,
                base,
                quote,
                _this81 = this;

            return Promise.resolve().then(function () {
                return _this81.publicGetPairs();
            }).then(function (_resp) {
                markets = _resp;
                result = [];
                keys = Object.keys(markets);

                for (p = 0; p < keys.length; p++) {
                    market = markets[keys[p]];
                    id = market['id'];
                    symbol = market['name'];
                    _symbol$split = symbol.split('/');
                    _symbol$split2 = _slicedToArray(_symbol$split, 2);
                    base = _symbol$split2[0];
                    quote = _symbol$split2[1];
                    // issue #4 bitlish names Dash as DSH, instead of DASH

                    if (base == 'DSH') {
                        base = 'DASH';
                    }symbol = base + '/' + quote;
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['max']),
                'low': parseFloat(ticker['min']),
                'bid': undefined,
                'ask': undefined,
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': parseFloat(ticker['first']),
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': undefined,
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this82 = this;

            return Promise.resolve().then(function () {
                return _this82.loadMarkets();
            }).then(function () {
                return _this82.publicGetTickers();
            }).then(function (_resp) {
                tickers = _resp;
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this82.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this82.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                ticker,
                _this83 = this;

            return Promise.resolve().then(function () {
                return _this83.loadMarkets();
            }).then(function () {
                p = _this83.market(market);
                return _this83.publicGetTickers();
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[p['id']];

                return _this83.parseTicker(ticker, p);
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this84 = this,
                _arguments72 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments72.length > 1 && _arguments72[1] !== undefined ? _arguments72[1] : {};
                return _this84.loadMarkets();
            }).then(function () {
                return _this84.publicGetTradesDepth(_this84.extend({
                    'pair_id': _this84.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = parseInt(parseInt(orderbook['last']) / 1000);
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this84.iso8601(timestamp)
                };
                sides = { 'bids': 'bid', 'asks': 'ask' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['volume']);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this85 = this;

            return Promise.resolve().then(function () {
                return _this85.loadMarkets();
            }).then(function () {
                return _this85.publicGetTradesHistory({
                    'pair_id': _this85.marketId(market)
                });
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                result,
                currencies,
                balance,
                c,
                currency,
                account,
                _c,
                _currency3,
                _account3,
                _this86 = this;

            return Promise.resolve().then(function () {
                return _this86.loadMarkets();
            }).then(function () {
                return _this86.privatePostBalance();
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };
                currencies = Object.keys(response);
                balance = {};

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    account = response[currency];

                    currency = currency.toUpperCase();
                    // issue #4 bitlish names Dash as DSH, instead of DASH
                    if (currency == 'DSH') {
                        currency = 'DASH';
                    }balance[currency] = account;
                }
                for (_c = 0; _c < _this86.currencies.length; _c++) {
                    _currency3 = _this86.currencies[_c];
                    _account3 = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (_currency3 in balance) {
                        _account3['free'] = parseFloat(balance[_currency3]['funds']);
                        _account3['used'] = parseFloat(balance[_currency3]['holded']);
                        _account3['total'] = _this86.sum(_account3['free'], _account3['used']);
                    }
                    result[_currency3] = _account3;
                }
                return result;
            });
        },
        signIn: function signIn() {
            return this.privatePostSignin({
                'login': this.login,
                'passwd': this.password
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                result,
                _this87 = this,
                _arguments75 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments75.length > 4 && _arguments75[4] !== undefined ? _arguments75[4] : undefined;
                params = _arguments75.length > 5 && _arguments75[5] !== undefined ? _arguments75[5] : {};
                return _this87.loadMarkets();
            }).then(function () {
                order = {
                    'pair_id': _this87.marketId(market),
                    'dir': side == 'buy' ? 'bid' : 'ask',
                    'amount': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this87.privatePostCreateTrade(_this87.extend(order, params));
            }).then(function (_resp) {
                result = _resp;

                return {
                    'info': result,
                    'id': result['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this88 = this;

            return Promise.resolve().then(function () {
                return _this88.loadMarkets();
            }).then(function () {
                return _this88.privatePostCancelTrade({ 'id': id });
            });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + path;
            if (api == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                body = this.json(this.extend({ 'token': this.apiKey }, params));
                headers = { 'Content-Type': 'application/json' };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitmarket = {

        'id': 'bitmarket',
        'name': 'BitMarket',
        'countries': ['PL', 'EU'],
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27767256-a8555200-5ef9-11e7-96fd-469a65e2b0bd.jpg',
            'api': {
                'public': 'https://www.bitmarket.net',
                'private': 'https://www.bitmarket.pl/api2/' // last slash is critical
            },
            'www': ['https://www.bitmarket.pl', 'https://www.bitmarket.net'],
            'doc': ['https://www.bitmarket.net/docs.php?file=api_public.html', 'https://www.bitmarket.net/docs.php?file=api_private.html', 'https://github.com/bitmarket-net/api']
        },
        'api': {
            'public': {
                'get': ['json/{market}/ticker', 'json/{market}/orderbook', 'json/{market}/trades', 'json/ctransfer', 'graphs/{market}/90m', 'graphs/{market}/6h', 'graphs/{market}/1d', 'graphs/{market}/7d', 'graphs/{market}/1m', 'graphs/{market}/3m', 'graphs/{market}/6m', 'graphs/{market}/1y']
            },
            'private': {
                'post': ['info', 'trade', 'cancel', 'orders', 'trades', 'history', 'withdrawals', 'tradingdesk', 'tradingdeskStatus', 'tradingdeskConfirm', 'cryptotradingdesk', 'cryptotradingdeskStatus', 'cryptotradingdeskConfirm', 'withdraw', 'withdrawFiat', 'withdrawPLNPP', 'withdrawFiatFast', 'deposit', 'transfer', 'transfers', 'marginList', 'marginOpen', 'marginClose', 'marginCancel', 'marginModify', 'marginBalanceAdd', 'marginBalanceRemove', 'swapList', 'swapOpen', 'swapClose']
            }
        },
        'markets': {
            'BTC/PLN': { 'id': 'BTCPLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
            'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'LTC/PLN': { 'id': 'LTCPLN', 'symbol': 'LTC/PLN', 'base': 'LTC', 'quote': 'PLN' },
            'LTC/BTC': { 'id': 'LTCBTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'LiteMineX/BTC': { 'id': 'LiteMineXBTC', 'symbol': 'LiteMineX/BTC', 'base': 'LiteMineX', 'quote': 'BTC' },
            'PlnX/BTC': { 'id': 'PlnxBTC', 'symbol': 'PlnX/BTC', 'base': 'PlnX', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var response,
                data,
                balance,
                result,
                c,
                currency,
                account,
                _this89 = this;

            return Promise.resolve().then(function () {
                return _this89.loadMarkets();
            }).then(function () {
                return _this89.privatePostInfo();
            }).then(function (_resp) {
                response = _resp;
                data = response['data'];
                balance = data['balances'];
                result = { 'info': data };

                for (c = 0; c < _this89.currencies.length; c++) {
                    currency = _this89.currencies[c];
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (currency in balance['available']) {
                        account['free'] = balance['available'][currency];
                    }if (currency in balance['blocked']) {
                        account['used'] = balance['blocked'][currency];
                    }account['total'] = _this89.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this90 = this,
                _arguments78 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments78.length > 1 && _arguments78[1] !== undefined ? _arguments78[1] : {};
                return _this90.publicGetJsonMarketOrderbook(_this90.extend({
                    'market': _this90.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this90.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this90.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this91 = this;

            return Promise.resolve().then(function () {
                return _this91.publicGetJsonMarketTicker({
                    'market': _this91.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this91.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this91.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this92 = this;

            return _this92.publicGetJsonMarketTrades({
                'market': _this92.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                result,
                _this93 = this,
                _arguments81 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments81.length > 4 && _arguments81[4] !== undefined ? _arguments81[4] : undefined;
                params = _arguments81.length > 5 && _arguments81[5] !== undefined ? _arguments81[5] : {};
                return _this93.privatePostTrade(_this93.extend({
                    'market': _this93.marketId(market),
                    'type': side,
                    'amount': amount,
                    'rate': price
                }, params));
            }).then(function (_resp) {
                response = _resp;
                result = {
                    'info': response
                };

                if ('id' in response['order']) {
                    result['id'] = response['id'];
                }return result;
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this94 = this;

            return _this94.privatePostCancel({ 'id': id });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api];
            if (api == 'public') {
                url += '/' + this.implodeParams(path + '.json', params);
            } else {
                var nonce = this.nonce();
                var query = this.extend({
                    'tonce': nonce,
                    'method': path
                }, params);
                body = this.urlencode(query);
                headers = {
                    'API-Key': this.apiKey,
                    'API-Hash': this.hmac(this.encode(body), this.encode(this.secret), 'sha512')
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitmex = {

        'id': 'bitmex',
        'name': 'BitMEX',
        'countries': 'SC', // Seychelles
        'version': 'v1',
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766319-f653c6e6-5ed4-11e7-933d-f0bc3699ae8f.jpg',
            'api': 'https://www.bitmex.com',
            'www': 'https://www.bitmex.com',
            'doc': ['https://www.bitmex.com/app/apiOverview', 'https://github.com/BitMEX/api-connectors/tree/master/official-http']
        },
        'api': {
            'public': {
                'get': ['announcement', 'announcement/urgent', 'funding', 'instrument', 'instrument/active', 'instrument/activeAndIndices', 'instrument/activeIntervals', 'instrument/compositeIndex', 'instrument/indices', 'insurance', 'leaderboard', 'liquidation', 'orderBook', 'orderBook/L2', 'quote', 'quote/bucketed', 'schema', 'schema/websocketHelp', 'settlement', 'stats', 'stats/history', 'trade', 'trade/bucketed']
            },
            'private': {
                'get': ['apiKey', 'chat', 'chat/channels', 'chat/connected', 'execution', 'execution/tradeHistory', 'notification', 'order', 'position', 'user', 'user/affiliateStatus', 'user/checkReferralCode', 'user/commission', 'user/depositAddress', 'user/margin', 'user/minWithdrawalFee', 'user/wallet', 'user/walletHistory', 'user/walletSummary'],
                'post': ['apiKey', 'apiKey/disable', 'apiKey/enable', 'chat', 'order', 'order/bulk', 'order/cancelAllAfter', 'order/closePosition', 'position/isolate', 'position/leverage', 'position/riskLimit', 'position/transferMargin', 'user/cancelWithdrawal', 'user/confirmEmail', 'user/confirmEnableTFA', 'user/confirmWithdrawal', 'user/disableTFA', 'user/logout', 'user/logoutAll', 'user/preferences', 'user/requestEnableTFA', 'user/requestWithdrawal'],
                'put': ['order', 'order/bulk', 'user'],
                'delete': ['apiKey', 'order', 'order/all']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                isFuturesContract,
                symbol,
                _this95 = this;

            return Promise.resolve().then(function () {
                return _this95.publicGetInstrumentActive();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['symbol'];
                    base = market['underlying'];
                    quote = market['quoteCurrency'];
                    isFuturesContract = id != base + quote;

                    base = _this95.commonCurrencyCode(base);
                    quote = _this95.commonCurrencyCode(quote);
                    symbol = isFuturesContract ? id : base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                result,
                b,
                balance,
                currency,
                account,
                _this96 = this;

            return Promise.resolve().then(function () {
                return _this96.loadMarkets();
            }).then(function () {
                return _this96.privateGetUserMargin({ 'currency': 'all' });
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };

                for (b = 0; b < response.length; b++) {
                    balance = response[b];
                    currency = balance['currency'].toUpperCase();

                    currency = _this96.commonCurrencyCode(currency);
                    account = {
                        'free': balance['availableMargin'],
                        'used': undefined,
                        'total': balance['amount']
                    };

                    if (currency == 'BTC') {
                        account['free'] = account['free'] * 0.00000001;
                        account['total'] = account['total'] * 0.00000001;
                    }
                    account['used'] = account['total'] - account['free'];
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                o,
                order,
                side,
                amount,
                price,
                _this97 = this,
                _arguments85 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments85.length > 1 && _arguments85[1] !== undefined ? _arguments85[1] : {};
                return _this97.loadMarkets();
            }).then(function () {
                return _this97.publicGetOrderBookL2(_this97.extend({
                    'symbol': _this97.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this97.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this97.iso8601(timestamp)
                };

                for (o = 0; o < orderbook.length; o++) {
                    order = orderbook[o];
                    side = order['side'] == 'Sell' ? 'asks' : 'bids';
                    amount = order['size'];
                    price = order['price'];

                    result[side].push([price, amount]);
                }
                result['bids'] = _this97.sortBy(result['bids'], 0, true);
                result['asks'] = _this97.sortBy(result['asks'], 0);
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var request,
                quotes,
                quotesLength,
                quote,
                tickers,
                ticker,
                timestamp,
                _this98 = this;

            return Promise.resolve().then(function () {
                return _this98.loadMarkets();
            }).then(function () {
                request = {
                    'symbol': _this98.marketId(market),
                    'binSize': '1d',
                    'partial': true,
                    'count': 1,
                    'reverse': true
                };
                return _this98.publicGetQuoteBucketed(request);
            }).then(function (_resp) {
                quotes = _resp;
                quotesLength = quotes.length;
                quote = quotes[quotesLength - 1];
                return _this98.publicGetTradeBucketed(request);
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[0];
                timestamp = _this98.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this98.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(quote['bidPrice']),
                    'ask': parseFloat(quote['askPrice']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': parseFloat(ticker['close']),
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['homeNotional']),
                    'quoteVolume': parseFloat(ticker['foreignNotional']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this99 = this;

            return Promise.resolve().then(function () {
                return _this99.loadMarkets();
            }).then(function () {
                return _this99.publicGetTrade({
                    'symbol': _this99.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this100 = this,
                _arguments88 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments88.length > 4 && _arguments88[4] !== undefined ? _arguments88[4] : undefined;
                params = _arguments88.length > 5 && _arguments88[5] !== undefined ? _arguments88[5] : {};
                return _this100.loadMarkets();
            }).then(function () {
                order = {
                    'symbol': _this100.marketId(market),
                    'side': _this100.capitalize(side),
                    'orderQty': amount,
                    'ordType': _this100.capitalize(type)
                };

                if (type == 'limit') {
                    order['rate'] = price;
                }return _this100.privatePostOrder(_this100.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['orderID']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this101 = this;

            return Promise.resolve().then(function () {
                return _this101.loadMarkets();
            }).then(function () {
                return _this101.privateDeleteOrder({ 'orderID': id });
            });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var query = '/api/' + this.version + '/' + path;
            if (Object.keys(params).length) query += '?' + this.urlencode(params);
            var url = this.urls['api'] + query;
            if (api == 'private') {
                var nonce = this.nonce().toString();
                if (method == 'POST') if (Object.keys(params).length) body = this.json(params);
                var request = [method, query, nonce, body || ''].join('');
                headers = {
                    'Content-Type': 'application/json',
                    'api-nonce': nonce,
                    'api-key': this.apiKey,
                    'api-signature': this.hmac(this.encode(request), this.encode(this.secret))
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bitso = {

        'id': 'bitso',
        'name': 'Bitso',
        'countries': 'MX', // Mexico
        'rateLimit': 2000, // 30 requests per minute
        'version': 'v3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766335-715ce7aa-5ed5-11e7-88a8-173a27bb30fe.jpg',
            'api': 'https://api.bitso.com',
            'www': 'https://bitso.com',
            'doc': 'https://bitso.com/api_info'
        },
        'api': {
            'public': {
                'get': ['available_books', 'ticker', 'order_book', 'trades']
            },
            'private': {
                'get': ['account_status', 'balance', 'fees', 'fundings', 'fundings/{fid}', 'funding_destination', 'kyc_documents', 'ledger', 'ledger/trades', 'ledger/fees', 'ledger/fundings', 'ledger/withdrawals', 'mx_bank_codes', 'open_orders', 'order_trades/{oid}', 'orders/{oid}', 'user_trades', 'user_trades/{tid}', 'withdrawals/', 'withdrawals/{wid}'],
                'post': ['bitcoin_withdrawal', 'debit_card_withdrawal', 'ether_withdrawal', 'orders', 'phone_number', 'phone_verification', 'phone_withdrawal', 'spei_withdrawal'],
                'delete': ['orders/{oid}', 'orders/all']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                symbol,
                _symbol$split3,
                _symbol$split4,
                base,
                quote,
                _this102 = this;

            return Promise.resolve().then(function () {
                return _this102.publicGetAvailableBooks();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['payload'].length; p++) {
                    market = markets['payload'][p];
                    id = market['book'];
                    symbol = id.toUpperCase().replace('_', '/');
                    _symbol$split3 = symbol.split('/');
                    _symbol$split4 = _slicedToArray(_symbol$split3, 2);
                    base = _symbol$split4[0];
                    quote = _symbol$split4[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this103 = this;

            return Promise.resolve().then(function () {
                return _this103.loadMarkets();
            }).then(function () {
                return _this103.privateGetBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = response['payload']['balances'];
                result = { 'info': response };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'].toUpperCase();
                    account = {
                        'free': parseFloat(balance['available']),
                        'used': parseFloat(balance['locked']),
                        'total': parseFloat(balance['total'])
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this104 = this,
                _arguments92 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments92.length > 1 && _arguments92[1] !== undefined ? _arguments92[1] : {};
                return _this104.loadMarkets();
            }).then(function () {
                return _this104.publicGetOrderBook(_this104.extend({
                    'book': _this104.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['payload'];
                timestamp = _this104.parse8601(orderbook['updated_at']);
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this104.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['amount']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this105 = this;

            return Promise.resolve().then(function () {
                return _this105.loadMarkets();
            }).then(function () {
                return _this105.publicGetTicker({
                    'book': _this105.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['payload'];
                timestamp = _this105.parse8601(ticker['created_at']);

                return {
                    'timestamp': timestamp,
                    'datetime': _this105.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this106 = this;

            return Promise.resolve().then(function () {
                return _this106.loadMarkets();
            }).then(function () {
                return _this106.publicGetTrades({
                    'book': _this106.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this107 = this,
                _arguments95 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments95.length > 4 && _arguments95[4] !== undefined ? _arguments95[4] : undefined;
                params = _arguments95.length > 5 && _arguments95[5] !== undefined ? _arguments95[5] : {};
                return _this107.loadMarkets();
            }).then(function () {
                order = {
                    'book': _this107.marketId(market),
                    'side': side,
                    'type': type,
                    'major': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this107.privatePostOrders(_this107.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['payload']['oid']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this108 = this;

            return Promise.resolve().then(function () {
                return _this108.loadMarkets();
            }).then(function () {
                return _this108.privateDeleteOrders({ 'oid': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                query,
                url,
                nonce,
                request,
                signature,
                auth,
                response,
                _test3,
                _this109 = this,
                _arguments97 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments97.length > 1 && _arguments97[1] !== undefined ? _arguments97[1] : 'public';
                method = _arguments97.length > 2 && _arguments97[2] !== undefined ? _arguments97[2] : 'GET';
                params = _arguments97.length > 3 && _arguments97[3] !== undefined ? _arguments97[3] : {};
                headers = _arguments97.length > 4 && _arguments97[4] !== undefined ? _arguments97[4] : undefined;
                body = _arguments97.length > 5 && _arguments97[5] !== undefined ? _arguments97[5] : undefined;
                query = '/' + _this109.version + '/' + _this109.implodeParams(path, params);
                url = _this109.urls['api'] + query;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this109.urlencode(params);
                    }
                } else {
                    if (Object.keys(params).length) {
                        body = _this109.json(params);
                    }nonce = _this109.nonce().toString();
                    request = [nonce, method, query, body || ''].join('');
                    signature = _this109.hmac(_this109.encode(request), _this109.encode(_this109.secret));
                    auth = _this109.apiKey + ':' + nonce + ':' + signature;

                    headers = { 'Authorization': "Bitso " + auth };
                }
                return _this109.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test3 = 'success' in response;

                if (_test3 && response['success']) {
                    return response;
                } else {
                    throw new ExchangeError(_this109.id + ' ' + _this109.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bitstamp = {

        'id': 'bitstamp',
        'name': 'Bitstamp',
        'countries': 'GB',
        'rateLimit': 1000,
        'version': 'v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27786377-8c8ab57e-5fe9-11e7-8ea4-2b05b6bcceec.jpg',
            'api': 'https://www.bitstamp.net/api',
            'www': 'https://www.bitstamp.net',
            'doc': 'https://www.bitstamp.net/api'
        },
        'api': {
            'public': {
                'get': ['order_book/{id}/', 'ticker_hour/{id}/', 'ticker/{id}/', 'transactions/{id}/']
            },
            'private': {
                'post': ['balance/', 'balance/{id}/', 'buy/{id}/', 'buy/market/{id}/', 'cancel_order/', 'liquidation_address/info/', 'liquidation_address/new/', 'open_orders/all/', 'open_orders/{id}/', 'sell/{id}/', 'sell/market/{id}/', 'transfer-from-main/', 'transfer-to-main/', 'user_transactions/', 'user_transactions/{id}/', 'withdrawal/cancel/', 'withdrawal/open/', 'withdrawal/status/', 'xrp_address/', 'xrp_withdrawal/']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'btcusd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'btceur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'EUR/USD': { 'id': 'eurusd', 'symbol': 'EUR/USD', 'base': 'EUR', 'quote': 'USD' },
            'XRP/USD': { 'id': 'xrpusd', 'symbol': 'XRP/USD', 'base': 'XRP', 'quote': 'USD' },
            'XRP/EUR': { 'id': 'xrpeur', 'symbol': 'XRP/EUR', 'base': 'XRP', 'quote': 'EUR' },
            'XRP/BTC': { 'id': 'xrpbtc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' },
            'LTC/USD': { 'id': 'ltcusd', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD' },
            'LTC/EUR': { 'id': 'ltceur', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR' },
            'LTC/BTC': { 'id': 'ltcbtc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' }
        },

        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this110 = this,
                _arguments98 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments98.length > 1 && _arguments98[1] !== undefined ? _arguments98[1] : {};
                return _this110.publicGetOrderBookId(_this110.extend({
                    'id': _this110.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = parseInt(orderbook['timestamp']) * 1000;
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this110.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this111 = this;

            return Promise.resolve().then(function () {
                return _this111.publicGetTickerId({
                    'id': _this111.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseInt(ticker['timestamp']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this111.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this112 = this;

            return _this112.publicGetTransactionsId({
                'id': _this112.marketId(market)
            });
        },
        fetchBalance: function fetchBalance() {
            var balance,
                result,
                c,
                currency,
                lowercase,
                total,
                free,
                used,
                account,
                _this113 = this;

            return Promise.resolve().then(function () {
                return _this113.privatePostBalance();
            }).then(function (_resp) {
                balance = _resp;
                result = { 'info': balance };

                for (c = 0; c < _this113.currencies.length; c++) {
                    currency = _this113.currencies[c];
                    lowercase = currency.toLowerCase();
                    total = lowercase + '_balance';
                    free = lowercase + '_available';
                    used = lowercase + '_reserved';
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (free in balance) {
                        account['free'] = parseFloat(balance[free]);
                    }if (used in balance) {
                        account['used'] = parseFloat(balance[used]);
                    }if (total in balance) {
                        account['total'] = parseFloat(balance[total]);
                    }result[currency] = account;
                }
                return result;
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this114 = this,
                _arguments102 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments102.length > 4 && _arguments102[4] !== undefined ? _arguments102[4] : undefined;
                params = _arguments102.length > 5 && _arguments102[5] !== undefined ? _arguments102[5] : {};
                method = 'privatePost' + _this114.capitalize(side);
                order = {
                    'id': _this114.marketId(market),
                    'amount': amount
                };

                if (type == 'market') {
                    method += 'Market';
                } else {
                    order['price'] = price;
                }method += 'Id';
                return _this114[method](_this114.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this115 = this;

            return _this115.privatePostCancelOrder({ 'id': id });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                if (!this.uid) throw new AuthenticationError(this.id + ' requires `' + this.id + '.uid` property for authentication');
                var nonce = this.nonce().toString();
                var auth = nonce + this.uid + this.apiKey;
                var signature = this.hmac(this.encode(auth), this.encode(this.secret));
                query = this.extend({
                    'key': this.apiKey,
                    'signature': signature.toUpperCase(),
                    'nonce': nonce
                }, query);
                body = this.urlencode(query);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bittrex = {

        'id': 'bittrex',
        'name': 'Bittrex',
        'countries': 'US',
        'version': 'v1.1',
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766352-cf0b3c26-5ed5-11e7-82b7-f3826b7a97d8.jpg',
            'api': 'https://bittrex.com/api',
            'www': 'https://bittrex.com',
            'doc': ['https://bittrex.com/Home/Api', 'https://www.npmjs.org/package/node.bittrex.api']
        },
        'api': {
            'public': {
                'get': ['currencies', 'markethistory', 'markets', 'marketsummaries', 'marketsummary', 'orderbook', 'ticker']
            },
            'account': {
                'get': ['balance', 'balances', 'depositaddress', 'deposithistory', 'order', 'orderhistory', 'withdrawalhistory', 'withdraw']
            },
            'market': {
                'get': ['buylimit', 'buymarket', 'cancel', 'openorders', 'selllimit', 'sellmarket']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this116 = this;

            return Promise.resolve().then(function () {
                return _this116.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['result'].length; p++) {
                    market = markets['result'][p];
                    id = market['MarketName'];
                    base = market['MarketCurrency'];
                    quote = market['BaseCurrency'];

                    base = _this116.commonCurrencyCode(base);
                    quote = _this116.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                indexed,
                c,
                currency,
                account,
                balance,
                _this117 = this;

            return Promise.resolve().then(function () {
                return _this117.loadMarkets();
            }).then(function () {
                return _this117.accountGetBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result'];
                result = { 'info': balances };
                indexed = _this117.indexBy(balances, 'Currency');

                for (c = 0; c < _this117.currencies.length; c++) {
                    currency = _this117.currencies[c];
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (currency in indexed) {
                        balance = indexed[currency];

                        account['free'] = balance['Available'];
                        account['used'] = balance['Balance'] - balance['Available'];
                        account['total'] = balance['Balance'];
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        parseBidAsk: function parseBidAsk(bidask) {
            var price = parseFloat(bidask['Rate']);
            var amount = parseFloat(bidask['Quantity']);
            return [price, amount];
        },
        parseBidAsks: function parseBidAsks(bidasks) {
            var result = [];
            for (var i = 0; i < bidasks.length; i++) {
                result.push(this.parseBidAsk(bidasks[i]));
            }
            return result;
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                _this118 = this,
                _arguments106 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments106.length > 1 && _arguments106[1] !== undefined ? _arguments106[1] : {};
                return _this118.loadMarkets();
            }).then(function () {
                return _this118.publicGetOrderbook(_this118.extend({
                    'market': _this118.marketId(market),
                    'type': 'both',
                    'depth': 50
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['result'];
                timestamp = _this118.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this118.iso8601(timestamp)
                };
                sides = { 'bids': 'buy', 'asks': 'sell' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];

                    result[key] = _this118.parseBidAsks(orderbook[side]);
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.parse8601(ticker['TimeStamp']);
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['High']),
                'low': parseFloat(ticker['Low']),
                'bid': parseFloat(ticker['Bid']),
                'ask': parseFloat(ticker['Ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['Last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['BaseVolume']),
                'quoteVolume': parseFloat(ticker['Volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                result,
                t,
                ticker,
                id,
                market,
                symbol,
                _id$split,
                _id$split2,
                quote,
                base,
                _this119 = this;

            return Promise.resolve().then(function () {
                return _this119.loadMarkets();
            }).then(function () {
                return _this119.publicGetMarketsummaries();
            }).then(function (_resp) {
                response = _resp;
                tickers = response['result'];
                result = {};

                for (t = 0; t < tickers.length; t++) {
                    ticker = tickers[t];
                    id = ticker['MarketName'];
                    market = undefined;
                    symbol = id;

                    if (id in _this119.markets_by_id) {
                        market = _this119.markets_by_id[id];
                        symbol = market['symbol'];
                    } else {
                        _id$split = id.split('-');
                        _id$split2 = _slicedToArray(_id$split, 2);
                        quote = _id$split2[0];
                        base = _id$split2[1];

                        base = _this119.commonCurrencyCode(base);
                        quote = _this119.commonCurrencyCode(quote);
                        symbol = base + '/' + quote;
                    }
                    result[symbol] = _this119.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var m,
                response,
                ticker,
                _this120 = this;

            return Promise.resolve().then(function () {
                return _this120.loadMarkets();
            }).then(function () {
                m = _this120.market(market);
                return _this120.publicGetMarketsummary({
                    'market': m['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['result'][0];

                return _this120.parseTicker(ticker, m);
            });
        },
        parseTrade: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(trade['TimeStamp']);
            var side = undefined;
            if (trade['OrderType'] == 'BUY') {
                side = 'buy';
            } else if (trade['OrderType'] == 'SELL') {
                side = 'sell';
            }
            var type = undefined;
            return {
                'id': trade['Id'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': side,
                'price': trade['Price'],
                'amount': trade['Quantity']
            };
        },
        fetchTrades: function fetchTrades(market) {
            var m,
                response,
                _this121 = this;

            return Promise.resolve().then(function () {
                return _this121.loadMarkets();
            }).then(function () {
                m = _this121.market(market);
                return _this121.publicGetMarkethistory({
                    'market': m['id']
                });
            }).then(function (_resp) {
                response = _resp;

                return _this121.parseTrades(response['result'], m);
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                result,
                _this122 = this,
                _arguments110 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments110.length > 4 && _arguments110[4] !== undefined ? _arguments110[4] : undefined;
                params = _arguments110.length > 5 && _arguments110[5] !== undefined ? _arguments110[5] : {};
                return _this122.loadMarkets();
            }).then(function () {
                method = 'marketGet' + _this122.capitalize(side) + type;
                order = {
                    'market': _this122.marketId(market),
                    'quantity': amount
                };

                if (type == 'limit') {
                    order['rate'] = price;
                }return _this122[method](_this122.extend(order, params));
            }).then(function (_resp) {
                response = _resp;
                result = {
                    'info': response,
                    'id': response['result']['uuid']
                };

                return result;
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this123 = this;

            return Promise.resolve().then(function () {
                return _this123.loadMarkets();
            }).then(function () {
                return _this123.marketGetCancel({ 'uuid': id });
            });
        },
        parseOrder: function parseOrder(order) {
            var side = order['Type'] == 'LIMIT_BUY' ? 'buy' : 'sell';
            var open = order['IsOpen'];
            var canceled = order['CancelInitiated'];
            var status = undefined;
            if (open) {
                status = 'open';
            } else if (canceled) {
                status = 'canceled';
            } else {
                status = 'closed';
            }
            var timestamp = this.parse8601(order['Opened']);
            var market = this.markets_by_id[order['Exchange']];
            var result = {
                'info': order,
                'id': order['OrderUuid'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': 'limit',
                'side': side,
                'price': order['PricePerUnit'],
                'amount': order['Quantity'],
                'remaining': order['QuantityRemaining'],
                'status': status
            };
            return result;
        },
        fetchOrder: function fetchOrder(id) {
            var response,
                _this124 = this;

            return Promise.resolve().then(function () {
                return _this124.loadMarkets();
            }).then(function () {
                return _this124.accountGetOrder({ 'uuid': id });
            }).then(function (_resp) {
                response = _resp;

                return _this124.parseOrder(response['result']);
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                signature,
                response,
                _test4,
                _this125 = this,
                _arguments113 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments113.length > 1 && _arguments113[1] !== undefined ? _arguments113[1] : 'public';
                method = _arguments113.length > 2 && _arguments113[2] !== undefined ? _arguments113[2] : 'GET';
                params = _arguments113.length > 3 && _arguments113[3] !== undefined ? _arguments113[3] : {};
                headers = _arguments113.length > 4 && _arguments113[4] !== undefined ? _arguments113[4] : undefined;
                body = _arguments113.length > 5 && _arguments113[5] !== undefined ? _arguments113[5] : undefined;
                url = _this125.urls['api'] + '/' + _this125.version + '/';

                if (api == 'public') {
                    url += api + '/' + method.toLowerCase() + path;
                    if (Object.keys(params).length) {
                        url += '?' + _this125.urlencode(params);
                    }
                } else {
                    nonce = _this125.nonce();

                    url += api + '/';
                    if (api == 'account' && path != 'withdraw' || path == 'openorders') {
                        url += method.toLowerCase();
                    }url += path + '?' + _this125.urlencode(_this125.extend({
                        'nonce': nonce,
                        'apikey': _this125.apiKey
                    }, params));
                    signature = _this125.hmac(_this125.encode(url), _this125.encode(_this125.secret), 'sha512');

                    headers = { 'apisign': signature };
                }
                return _this125.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test4 = 'success' in response;

                if (_test4 && response['success']) {
                    return response;
                } else {
                    throw new ExchangeError(_this125.id + ' ' + _this125.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var blinktrade = {

        'id': 'blinktrade',
        'name': 'BlinkTrade',
        'countries': ['US', 'VE', 'VN', 'BR', 'PK', 'CL'],
        'rateLimit': 1000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27990968-75d9c884-6470-11e7-9073-46756c8e7e8c.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://blinktrade.com',
            'doc': 'https://blinktrade.com/docs'
        },
        'api': {
            'public': {
                'get': ['{currency}/ticker', // ?crypto_currency=BTC
                '{currency}/orderbook', // ?crypto_currency=BTC
                '{currency}/trades']
            },
            'private': {
                'post': ['D', // order
                'F', // cancel order
                'U2', // balance
                'U4', // my orders
                'U6', // withdraw
                'U18', // deposit
                'U24', // confirm withdrawal
                'U26', // list withdrawals
                'U30', // list deposits
                'U34', // ledger
                'U70']
            }
        },
        'markets': {
            'BTC/VEF': { 'id': 'BTCVEF', 'symbol': 'BTC/VEF', 'base': 'BTC', 'quote': 'VEF', 'brokerId': 1, 'broker': 'SurBitcoin' },
            'BTC/VND': { 'id': 'BTCVND', 'symbol': 'BTC/VND', 'base': 'BTC', 'quote': 'VND', 'brokerId': 3, 'broker': 'VBTC' },
            'BTC/BRL': { 'id': 'BTCBRL', 'symbol': 'BTC/BRL', 'base': 'BTC', 'quote': 'BRL', 'brokerId': 4, 'broker': 'FoxBit' },
            'BTC/PKR': { 'id': 'BTCPKR', 'symbol': 'BTC/PKR', 'base': 'BTC', 'quote': 'PKR', 'brokerId': 8, 'broker': 'UrduBit' },
            'BTC/CLP': { 'id': 'BTCCLP', 'symbol': 'BTC/CLP', 'base': 'BTC', 'quote': 'CLP', 'brokerId': 9, 'broker': 'ChileBit' }
        },

        fetchBalance: function fetchBalance() {
            var _this126 = this;

            return _this126.privatePostU2({
                'BalanceReqID': _this126.nonce()
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this127 = this,
                _arguments115 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments115.length > 1 && _arguments115[1] !== undefined ? _arguments115[1] : {};
                p = _this127.market(market);
                return _this127.publicGetCurrencyOrderbook(_this127.extend({
                    'currency': p['quote'],
                    'crypto_currency': p['base']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this127.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this127.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                timestamp,
                lowercaseQuote,
                quoteVolume,
                _this128 = this;

            return Promise.resolve().then(function () {
                p = _this128.market(market);
                return _this128.publicGetCurrencyTicker({
                    'currency': p['quote'],
                    'crypto_currency': p['base']
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this128.milliseconds();
                lowercaseQuote = p['quote'].toLowerCase();
                quoteVolume = 'vol_' + lowercaseQuote;

                return {
                    'timestamp': timestamp,
                    'datetime': _this128.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['vol']),
                    'quoteVolume': parseFloat(ticker[quoteVolume]),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var p,
                _this129 = this;

            p = _this129.market(market);

            return _this129.publicGetCurrencyTrades({
                'currency': p['quote'],
                'crypto_currency': p['base']
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                order,
                response,
                _this130 = this,
                _arguments118 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments118.length > 4 && _arguments118[4] !== undefined ? _arguments118[4] : undefined;
                params = _arguments118.length > 5 && _arguments118[5] !== undefined ? _arguments118[5] : {};

                if (type == 'market') {
                    throw new ExchangeError(_this130.id + ' allows limit orders only');
                }p = _this130.market(market);
                order = {
                    'ClOrdID': _this130.nonce(),
                    'Symbol': p['id'],
                    'Side': _this130.capitalize(side),
                    'OrdType': 2,
                    'Price': price,
                    'OrderQty': amount,
                    'BrokerID': p['brokerId']
                };
                return _this130.privatePostD(_this130.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['OrderID']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this131 = this,
                _arguments119 = arguments;

            params = _arguments119.length > 1 && _arguments119[1] !== undefined ? _arguments119[1] : {};

            return _this131.privatePostF(_this131.extend({
                'ClOrdID': id
            }, params));
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce().toString();
                var request = this.extend({ 'MsgType': path }, query);
                body = this.json(request);
                headers = {
                    'APIKey': this.apiKey,
                    'Nonce': nonce,
                    'Signature': this.hmac(this.encode(nonce), this.encode(this.secret)),
                    'Content-Type': 'application/json'
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var bl3p = {

        'id': 'bl3p',
        'name': 'BL3P',
        'countries': ['NL', 'EU'], // Netherlands, EU
        'rateLimit': 1000,
        'version': '1',
        'comment': 'An exchange market by BitonicNL',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28501752-60c21b82-6feb-11e7-818b-055ee6d0e754.jpg',
            'api': 'https://api.bl3p.eu',
            'www': ['https://bl3p.eu', 'https://bitonic.nl'],
            'doc': ['https://github.com/BitonicNL/bl3p-api/tree/master/docs', 'https://bl3p.eu/api', 'https://bitonic.nl/en/api']
        },
        'api': {
            'public': {
                'get': ['{market}/ticker', '{market}/orderbook', '{market}/trades']
            },
            'private': {
                'post': ['{market}/money/depth/full', '{market}/money/order/add', '{market}/money/order/cancel', '{market}/money/order/result', '{market}/money/orders', '{market}/money/orders/history', '{market}/money/trades/fetch', 'GENMKT/money/info', 'GENMKT/money/deposit_address', 'GENMKT/money/new_deposit_address', 'GENMKT/money/wallet/history', 'GENMKT/money/withdraw']
            }
        },
        'markets': {
            'BTC/EUR': { 'id': 'BTCEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'LTC/EUR': { 'id': 'LTCEUR', 'symbol': 'LTC/EUR', 'base': 'LTC', 'quote': 'EUR' }
        },

        fetchBalance: function fetchBalance() {
            var response,
                data,
                balance,
                result,
                c,
                currency,
                account,
                _this132 = this;

            return Promise.resolve().then(function () {
                return _this132.privatePostGENMKTMoneyInfo();
            }).then(function (_resp) {
                response = _resp;
                data = response['data'];
                balance = data['wallets'];
                result = { 'info': data };

                for (c = 0; c < _this132.currencies.length; c++) {
                    currency = _this132.currencies[c];
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (currency in balance) {
                        if ('available' in balance[currency]) {
                            account['free'] = parseFloat(balance[currency]['available']['value']);
                        }
                    }
                    if (currency in balance) {
                        if ('balance' in balance[currency]) {
                            account['total'] = parseFloat(balance[currency]['balance']['value']);
                        }
                    }
                    if (account['total']) {
                        if (account['free']) {
                            account['used'] = account['total'] - account['free'];
                        }
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this133 = this,
                _arguments121 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments121.length > 1 && _arguments121[1] !== undefined ? _arguments121[1] : {};
                p = _this133.market(market);
                return _this133.publicGetMarketOrderbook(_this133.extend({
                    'market': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['data'];
                timestamp = _this133.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this133.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['price_int'] / 100000;
                        amount = order['amount_int'] / 100000000;

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this134 = this;

            return Promise.resolve().then(function () {
                return _this134.publicGetMarketTicker({
                    'market': _this134.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['timestamp'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this134.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']['24h']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this135 = this;

            return _this135.publicGetMarketTrades({
                'market': _this135.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                order,
                response,
                _this136 = this,
                _arguments124 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments124.length > 4 && _arguments124[4] !== undefined ? _arguments124[4] : undefined;
                params = _arguments124.length > 5 && _arguments124[5] !== undefined ? _arguments124[5] : {};
                p = _this136.market(market);
                order = {
                    'market': p['id'],
                    'amount_int': amount,
                    'fee_currency': p['quote'],
                    'type': side == 'buy' ? 'bid' : 'ask'
                };

                if (type == 'limit') {
                    order['price_int'] = price;
                }return _this136.privatePostMarketMoneyOrderAdd(_this136.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this137 = this;

            return _this137.privatePostMarketMoneyOrderCancel({ 'order_id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                url,
                query,
                nonce,
                secret,
                auth,
                signature,
                _this138 = this,
                _arguments126 = arguments;

            api = _arguments126.length > 1 && _arguments126[1] !== undefined ? _arguments126[1] : 'public';
            method = _arguments126.length > 2 && _arguments126[2] !== undefined ? _arguments126[2] : 'GET';
            params = _arguments126.length > 3 && _arguments126[3] !== undefined ? _arguments126[3] : {};
            headers = _arguments126.length > 4 && _arguments126[4] !== undefined ? _arguments126[4] : undefined;
            body = _arguments126.length > 5 && _arguments126[5] !== undefined ? _arguments126[5] : undefined;
            request = _this138.implodeParams(path, params);
            url = _this138.urls['api'] + '/' + _this138.version + '/' + request;
            query = _this138.omit(params, _this138.extractParams(path));

            if (api == 'public') {
                if (Object.keys(query).length) {
                    url += '?' + _this138.urlencode(query);
                }
            } else {
                nonce = _this138.nonce();

                body = _this138.urlencode(_this138.extend({ 'nonce': nonce }, query));
                secret = _this138.base64ToBinary(_this138.secret);
                auth = request + "\0" + body;
                signature = _this138.hmac(_this138.encode(auth), secret, 'sha512', 'base64');

                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'Rest-Key': _this138.apiKey,
                    'Rest-Sign': signature
                };
            }
            return _this138.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var btcchina = {

        'id': 'btcchina',
        'name': 'BTCChina',
        'countries': 'CN',
        'rateLimit': 1500,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766368-465b3286-5ed6-11e7-9a11-0f6467e1d82b.jpg',
            'api': {
                'public': 'https://data.btcchina.com/data',
                'private': 'https://api.btcchina.com/api_trade_v1.php'
            },
            'www': 'https://www.btcchina.com',
            'doc': 'https://www.btcchina.com/apidocs'
        },
        'api': {
            'public': {
                'get': ['historydata', 'orderbook', 'ticker', 'trades']
            },
            'private': {
                'post': ['BuyIcebergOrder', 'BuyOrder', 'BuyOrder2', 'BuyStopOrder', 'CancelIcebergOrder', 'CancelOrder', 'CancelStopOrder', 'GetAccountInfo', 'getArchivedOrder', 'getArchivedOrders', 'GetDeposits', 'GetIcebergOrder', 'GetIcebergOrders', 'GetMarketDepth', 'GetMarketDepth2', 'GetOrder', 'GetOrders', 'GetStopOrder', 'GetStopOrders', 'GetTransactions', 'GetWithdrawal', 'GetWithdrawals', 'RequestWithdrawal', 'SellIcebergOrder', 'SellOrder', 'SellOrder2', 'SellStopOrder']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                keys,
                p,
                key,
                market,
                parts,
                id,
                base,
                quote,
                symbol,
                _this139 = this;

            return Promise.resolve().then(function () {
                return _this139.publicGetTicker({
                    'market': 'all'
                });
            }).then(function (_resp) {
                markets = _resp;
                result = [];
                keys = Object.keys(markets);

                for (p = 0; p < keys.length; p++) {
                    key = keys[p];
                    market = markets[key];
                    parts = key.split('_');
                    id = parts[1];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);

                    base = base.toUpperCase();
                    quote = quote.toUpperCase();
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                _this140 = this;

            return Promise.resolve().then(function () {
                return _this140.loadMarkets();
            }).then(function () {
                return _this140.privatePostGetAccountInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result'];
                result = { 'info': balances };


                for (c = 0; c < _this140.currencies.length; c++) {
                    currency = _this140.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (lowercase in balances['balance']) {
                        account['total'] = parseFloat(balances['balance'][lowercase]['amount']);
                    }if (lowercase in balances['frozen']) {
                        account['used'] = parseFloat(balances['frozen'][lowercase]['amount']);
                    }account['free'] = account['total'] - account['used'];
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this141 = this,
                _arguments129 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments129.length > 1 && _arguments129[1] !== undefined ? _arguments129[1] : {};
                return _this141.loadMarkets();
            }).then(function () {
                return _this141.publicGetOrderbook(_this141.extend({
                    'market': _this141.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['date'] * 1000;
                ;
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this141.iso8601(timestamp)
                };

                result['asks'] = _this141.sortBy(result['asks'], 0);
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this142 = this;

            return Promise.resolve().then(function () {
                return _this142.loadMarkets();
            }).then(function () {
                p = _this142.market(market);
                return _this142.publicGetTicker({
                    'market': p['id']
                });
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers['ticker'];
                timestamp = ticker['date'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this142.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': parseFloat(ticker['open']),
                    'close': parseFloat(ticker['prev_close']),
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this143 = this;

            return Promise.resolve().then(function () {
                return _this143.loadMarkets();
            }).then(function () {
                return _this143.publicGetTrades({
                    'market': _this143.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                method,
                order,
                id,
                response,
                _this144 = this,
                _arguments132 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments132.length > 4 && _arguments132[4] !== undefined ? _arguments132[4] : undefined;
                params = _arguments132.length > 5 && _arguments132[5] !== undefined ? _arguments132[5] : {};
                return _this144.loadMarkets();
            }).then(function () {
                p = _this144.market(market);
                method = 'privatePost' + _this144.capitalize(side) + 'Order2';
                order = {};
                id = p['id'].toUpperCase();

                if (type == 'market') {
                    order['params'] = [undefined, amount, id];
                } else {
                    order['params'] = [price, amount, id];
                }
                return _this144[method](_this144.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                market,
                _this145 = this,
                _arguments133 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments133.length > 1 && _arguments133[1] !== undefined ? _arguments133[1] : {};
                return _this145.loadMarkets();
            }).then(function () {
                market = params['market']; // TODO fixme

                return _this145.privatePostCancelOrder(_this145.extend({
                    'params': [id, market]
                }, params));
            });
        },
        nonce: function nonce() {
            return this.microseconds();
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'][api] + '/' + path;
            if (api == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                if (!this.apiKey) throw new AuthenticationError(this.id + ' requires `' + this.id + '.apiKey` property for authentication');
                if (!this.secret) throw new AuthenticationError(this.id + ' requires `' + this.id + '.secret` property for authentication');
                var p = [];
                if ('params' in params) p = params['params'];
                var nonce = this.nonce();
                var request = {
                    'method': path,
                    'id': nonce,
                    'params': p
                };
                p = p.join(',');
                body = this.json(request);
                var query = 'tonce=' + nonce + '&accesskey=' + this.apiKey + '&requestmethod=' + method.toLowerCase() + '&id=' + nonce + '&method=' + path + '&params=' + p;
                var signature = this.hmac(this.encode(query), this.encode(this.secret), 'sha1');
                var auth = this.apiKey + ':' + signature;
                headers = {
                    'Content-Length': body.length,
                    'Authorization': 'Basic ' + this.stringToBase64(auth),
                    'Json-Rpc-Tonce': nonce
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------

    var btce = {

        'id': 'btce',
        'name': 'BTC-e',
        'countries': ['BG', 'RU'], // Bulgaria, Russia
        'version': '3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27843225-1b571514-611a-11e7-9208-2641a560b561.jpg',
            'api': {
                'public': 'https://btc-e.com/api',
                'private': 'https://btc-e.com/tapi'
            },
            'www': 'https://btc-e.com',
            'doc': ['https://btc-e.com/api/3/docs', 'https://btc-e.com/tapi/docs']
        },
        'api': {
            'public': {
                'get': ['info', 'ticker/{pair}', 'depth/{pair}', 'trades/{pair}']
            },
            'private': {
                'post': ['getInfo', 'Trade', 'ActiveOrders', 'OrderInfo', 'CancelOrder', 'TradeHistory', 'TransHistory', 'CoinDepositAddress', 'WithdrawCoin', 'CreateCoupon', 'RedeemCoupon']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var response,
                markets,
                keys,
                result,
                p,
                id,
                market,
                _id$split3,
                _id$split4,
                base,
                quote,
                symbol,
                _this146 = this;

            return Promise.resolve().then(function () {
                return _this146.publicGetInfo();
            }).then(function (_resp) {
                response = _resp;
                markets = response['pairs'];
                keys = Object.keys(markets);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = markets[id];
                    _id$split3 = id.split('_');
                    _id$split4 = _slicedToArray(_id$split3, 2);
                    base = _id$split4[0];
                    quote = _id$split4[1];

                    base = base.toUpperCase();
                    quote = quote.toUpperCase();
                    if (base == 'DSH') {
                        base = 'DASH';
                    }base = _this146.commonCurrencyCode(base);
                    quote = _this146.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                funds,
                currencies,
                c,
                currency,
                uppercase,
                account,
                _this147 = this;

            return Promise.resolve().then(function () {
                return _this147.loadMarkets();
            }).then(function () {
                return _this147.privatePostGetInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['return'];
                result = { 'info': balances };
                funds = balances['funds'];
                currencies = Object.keys(funds);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    uppercase = currency.toUpperCase();
                    // they misspell DASH as dsh :/

                    if (uppercase == 'DSH') {
                        uppercase = 'DASH';
                    }account = {
                        'free': funds[currency],
                        'used': undefined,
                        'total': funds[currency]
                    };

                    result[uppercase] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                response,
                orderbook,
                timestamp,
                result,
                _this148 = this,
                _arguments136 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments136.length > 1 && _arguments136[1] !== undefined ? _arguments136[1] : {};
                return _this148.loadMarkets();
            }).then(function () {
                p = _this148.market(market);
                return _this148.publicGetDepthPair(_this148.extend({
                    'pair': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;

                if (p['id'] in response) {
                    orderbook = response[p['id']];
                    timestamp = _this148.milliseconds();
                    result = {
                        'bids': orderbook['bids'],
                        'asks': orderbook['asks'],
                        'timestamp': timestamp,
                        'datetime': _this148.iso8601(timestamp)
                    };

                    result['bids'] = _this148.sortBy(result['bids'], 0, true);
                    result['asks'] = _this148.sortBy(result['asks'], 0);
                    return result;
                } else {
                    throw new ExchangeError(_this148.id + ' ' + p['symbol'] + ' order book is empty or not available');
                }
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this149 = this;

            return Promise.resolve().then(function () {
                return _this149.loadMarkets();
            }).then(function () {
                p = _this149.market(market);
                return _this149.publicGetTickerPair({
                    'pair': p['id']
                });
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[p['id']];
                timestamp = ticker['updated'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this149.iso8601(timestamp),
                    'high': ticker['high'] ? ticker['high'] : undefined,
                    'low': ticker['low'] ? ticker['low'] : undefined,
                    'bid': ticker['sell'] ? ticker['buy'] : undefined,
                    'ask': ticker['buy'] ? ticker['sell'] : undefined,
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': ticker['last'] ? ticker['last'] : undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': ticker['avg'] ? ticker['avg'] : undefined,
                    'baseVolume': ticker['vol_cur'] ? ticker['vol_cur'] : undefined,
                    'quoteVolume': ticker['vol'] ? ticker['vol'] : undefined,
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this150 = this;

            return Promise.resolve().then(function () {
                return _this150.loadMarkets();
            }).then(function () {
                return _this150.publicGetTradesPair({
                    'pair': _this150.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this151 = this,
                _arguments139 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments139.length > 4 && _arguments139[4] !== undefined ? _arguments139[4] : undefined;
                params = _arguments139.length > 5 && _arguments139[5] !== undefined ? _arguments139[5] : {};
                return _this151.loadMarkets();
            }).then(function () {
                order = {
                    'pair': _this151.marketId(market),
                    'type': side,
                    'amount': amount,
                    'rate': price
                };
                return _this151.privatePostTrade(_this151.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['return']['order_id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this152 = this;

            return Promise.resolve().then(function () {
                return _this152.loadMarkets();
            }).then(function () {
                return _this152.privatePostCancelOrder({ 'order_id': id });
            });
        },
        parseOrder: function parseOrder(order) {
            var statusCode = order['status'];
            var status = undefined;
            if (statusCode == 0) {
                status = 'open';
            } else if (statusCode == 2 || statusCode == 3) {
                status = 'canceled';
            } else {
                status = 'closed';
            }
            var timestamp = order['timestamp_created'] * 1000;
            var market = this.markets_by_id[order['pair']];
            var result = {
                'info': order,
                'id': order['id'],
                'symbol': market['symbol'],
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'type': 'limit',
                'side': order['type'],
                'price': order['rate'],
                'amount': order['start_amount'],
                'remaining': order['amount'],
                'status': status
            };
            return result;
        },
        fetchOrder: function fetchOrder(id) {
            var response,
                order,
                _this153 = this;

            return Promise.resolve().then(function () {
                return _this153.loadMarkets();
            }).then(function () {
                return _this153.privatePostOrderInfo({ 'order_id': id });
            }).then(function (_resp) {
                response = _resp;
                order = response['return'][id];

                return _this153.parseOrder(_this153.extend({ 'id': id }, order));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                response,
                _this154 = this,
                _arguments142 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments142.length > 1 && _arguments142[1] !== undefined ? _arguments142[1] : 'public';
                method = _arguments142.length > 2 && _arguments142[2] !== undefined ? _arguments142[2] : 'GET';
                params = _arguments142.length > 3 && _arguments142[3] !== undefined ? _arguments142[3] : {};
                headers = _arguments142.length > 4 && _arguments142[4] !== undefined ? _arguments142[4] : undefined;
                body = _arguments142.length > 5 && _arguments142[5] !== undefined ? _arguments142[5] : undefined;
                url = _this154.urls['api'][api] + '/' + _this154.version + '/' + _this154.implodeParams(path, params);
                query = _this154.omit(params, _this154.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this154.urlencode(query);
                    }
                } else {
                    nonce = _this154.nonce();

                    body = _this154.urlencode(_this154.extend({
                        'nonce': nonce,
                        'method': path
                    }, query));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this154.apiKey,
                        'Sign': _this154.hmac(_this154.encode(body), _this154.encode(_this154.secret), 'sha512')
                    };
                }
                return _this154.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('success' in response) {
                    if (!response['success']) {
                        throw new ExchangeError(_this154.id + ' ' + _this154.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var btcmarkets = {

        'id': 'btcmarkets',
        'name': 'BTC Markets',
        'countries': 'AU', // Australia
        'rateLimit': 1000, // market data cached for 1 second (trades cached for 2 seconds)
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/29142911-0e1acfc2-7d5c-11e7-98c4-07d9532b29d7.jpg',
            'api': 'https://api.btcmarkets.net',
            'www': 'https://btcmarkets.net/',
            'doc': 'https://github.com/BTCMarkets/API'
        },
        'api': {
            'public': {
                'get': ['market/{id}/tick', 'market/{id}/orderbook', 'market/{id}/trades']
            },
            'private': {
                'get': ['account/balance', 'account/{id}/tradingfee'],
                'post': ['fundtransfer/withdrawCrypto', 'fundtransfer/withdrawEFT', 'order/create', 'order/cancel', 'order/history', 'order/open', 'order/trade/history', 'order/createBatch', // they promise it's coming soon...
                'order/detail']
            }
        },
        'markets': {
            'BTC/AUD': { 'id': 'BTC/AUD', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
            'LTC/AUD': { 'id': 'LTC/AUD', 'symbol': 'LTC/AUD', 'base': 'LTC', 'quote': 'AUD' },
            'ETH/AUD': { 'id': 'ETH/AUD', 'symbol': 'ETH/AUD', 'base': 'ETH', 'quote': 'AUD' },
            'ETC/AUD': { 'id': 'ETC/AUD', 'symbol': 'ETC/AUD', 'base': 'ETC', 'quote': 'AUD' },
            'XRP/AUD': { 'id': 'XRP/AUD', 'symbol': 'XRP/AUD', 'base': 'XRP', 'quote': 'AUD' },
            'BCH/AUD': { 'id': 'BCH/AUD', 'symbol': 'BCH/AUD', 'base': 'BCH', 'quote': 'AUD' },
            'LTC/BTC': { 'id': 'LTC/BTC', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'ETH/BTC': { 'id': 'ETH/BTC', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'ETC/BTC': { 'id': 'ETC/BTC', 'symbol': 'ETC/BTC', 'base': 'ETC', 'quote': 'BTC' },
            'XRP/BTC': { 'id': 'XRP/BTC', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' },
            'BCH/BTC': { 'id': 'BCH/BTC', 'symbol': 'BCH/BTC', 'base': 'BCH', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var balances,
                result,
                b,
                balance,
                currency,
                multiplier,
                free,
                used,
                account,
                _this155 = this;

            return Promise.resolve().then(function () {
                return _this155.loadMarkets();
            }).then(function () {
                return _this155.privateGetAccountBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    multiplier = 100000000;
                    free = parseFloat(balance['balance'] / multiplier);
                    used = parseFloat(balance['pendingFunds'] / multiplier);
                    account = {
                        'free': free,
                        'used': used,
                        'total': _this155.sum(free, used)
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        parseBidAsk: function parseBidAsk(bidask) {
            var price = bidask[0];
            var amount = bidask[1];
            return [price, amount];
        },
        parseBidAsks: function parseBidAsks(bidasks) {
            var result = [];
            for (var i = 0; i < bidasks.length; i++) {
                result.push(this.parseBidAsk(bidasks[i]));
            }
            return result;
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                m,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                _this156 = this,
                _arguments144 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments144.length > 1 && _arguments144[1] !== undefined ? _arguments144[1] : {};
                return _this156.loadMarkets();
            }).then(function () {
                m = _this156.market(market);
                return _this156.publicGetMarketIdOrderbook(_this156.extend({
                    'id': m['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['timestamp'] * 1000;
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this156.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];

                    result[side] = _this156.parseBidAsks(orderbook[side]);
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['timestamp'] * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': parseFloat(ticker['bestBid']),
                'ask': parseFloat(ticker['bestAsk']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['lastPrice']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume24h']),
                'info': ticker
            };
        },
        fetchTicker: function fetchTicker(market) {
            var m,
                ticker,
                _this157 = this;

            return Promise.resolve().then(function () {
                return _this157.loadMarkets();
            }).then(function () {
                m = _this157.market(market);
                return _this157.publicGetMarketIdTick({
                    'id': m['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this157.parseTicker(ticker, m);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this158 = this;

            return Promise.resolve().then(function () {
                return _this158.loadMarkets();
            }).then(function () {
                return _this158.publicGetMarketIdTrades({
                    // 'since': 59868345231,
                    'id': _this158.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                m,
                multiplier,
                orderSide,
                order,
                response,
                _this159 = this,
                _arguments147 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments147.length > 4 && _arguments147[4] !== undefined ? _arguments147[4] : undefined;
                params = _arguments147.length > 5 && _arguments147[5] !== undefined ? _arguments147[5] : {};
                return _this159.loadMarkets();
            }).then(function () {
                m = _this159.market(market);
                multiplier = 100000000; // for price and volume
                // does BTC Markets support market orders at all?

                orderSide = side == 'buy' ? 'Bid' : 'Ask';
                order = _this159.ordered({
                    'currency': m['quote'],
                    'instrument': m['base'],
                    'price': price * multiplier,
                    'volume': amount * multiplier,
                    'orderSide': orderSide,
                    'ordertype': _this159.capitalize(type),
                    'clientRequestId': _this159.nonce().toString()
                });
                return _this159.privatePostOrderCreate(_this159.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrders: function cancelOrders(ids) {
            var _this160 = this;

            return Promise.resolve().then(function () {
                return _this160.loadMarkets();
            }).then(function () {
                return _this160.privatePostOrderCancel({ 'order_ids': ids });
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this161 = this;

            return Promise.resolve().then(function () {
                return _this161.loadMarkets();
            }).then(function () {
                return _this161.cancelOrders([id]);
            });
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                uri,
                url,
                query,
                nonce,
                auth,
                secret,
                signature,
                response,
                _test5,
                _this162 = this,
                _arguments150 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments150.length > 1 && _arguments150[1] !== undefined ? _arguments150[1] : 'public';
                method = _arguments150.length > 2 && _arguments150[2] !== undefined ? _arguments150[2] : 'GET';
                params = _arguments150.length > 3 && _arguments150[3] !== undefined ? _arguments150[3] : {};
                headers = _arguments150.length > 4 && _arguments150[4] !== undefined ? _arguments150[4] : undefined;
                body = _arguments150.length > 5 && _arguments150[5] !== undefined ? _arguments150[5] : undefined;
                uri = '/' + _this162.implodeParams(path, params);
                url = _this162.urls['api'] + uri;
                query = _this162.omit(params, _this162.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this162.urlencode(params);
                    }
                } else {
                    nonce = _this162.nonce().toString();
                    auth = uri + "\n" + nonce + "\n";

                    headers = {
                        'Content-Type': 'application/json',
                        'apikey': _this162.apiKey,
                        'timestamp': nonce
                    };
                    if (method == 'POST') {
                        body = _this162.urlencode(query);
                        headers['Content-Length'] = body.length;
                        auth += body;
                    }
                    secret = _this162.base64ToBinary(_this162.secret);
                    signature = _this162.hmac(_this162.encode(auth), secret, 'sha512', 'base64');

                    headers['signature'] = signature;
                }
                return _this162.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test5 = api == 'private';

                if (_test5 && 'success' in response) {
                    if (!response['success']) {
                        throw new ExchangeError(_this162.id + ' ' + _this162.json(response));
                    }
                }
                if (_test5) {
                    return response;
                } else {
                    return response;
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var btctrader = {

        'id': 'btctrader',
        'name': 'BTCTrader',
        'countries': ['TR', 'GR', 'PH'], // Turkey, Greece, Philippines
        'rateLimit': 1000,
        'comment': 'base API for BTCExchange, BTCTurk',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27992404-cda1e386-649c-11e7-8dc1-40bbd2897768.jpg',
            'api': 'https://www.btctrader.com/api',
            'www': 'https://www.btctrader.com',
            'doc': 'https://github.com/BTCTrader/broker-api-docs'
        },
        'api': {
            'public': {
                'get': ['ohlcdata', // ?last=COUNT
                'orderbook', 'ticker', 'trades']
            },
            'private': {
                'get': ['balance', 'openOrders', 'userTransactions'],
                'post': ['buy', 'cancelOrder', 'sell']
            }
        },

        fetchBalance: function fetchBalance() {
            var response,
                result,
                base,
                quote,
                symbol,
                market,
                _this163 = this;

            return Promise.resolve().then(function () {
                return _this163.privateGetBalance();
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };
                base = {
                    'free': response['bitcoin_available'],
                    'used': response['bitcoin_reserved'],
                    'total': response['bitcoin_balance']
                };
                quote = {
                    'free': response['money_available'],
                    'used': response['money_reserved'],
                    'total': response['money_balance']
                };
                symbol = _this163.symbols[0];
                market = _this163.markets[symbol];

                result[market['base']] = base;
                result[market['quote']] = quote;
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this164 = this,
                _arguments152 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments152.length > 1 && _arguments152[1] !== undefined ? _arguments152[1] : {};
                return _this164.publicGetOrderbook(params);
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = parseInt(orderbook['timestamp'] * 1000);
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this164.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this165 = this;

            return Promise.resolve().then(function () {
                return _this165.publicGetTicker();
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseInt(ticker['timestamp'] * 1000);

                return {
                    'timestamp': timestamp,
                    'datetime': _this165.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['average']),
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var maxCount,
                _this166 = this;

            maxCount = 50;

            return _this166.publicGetTrades();
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this167 = this,
                _arguments155 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments155.length > 4 && _arguments155[4] !== undefined ? _arguments155[4] : undefined;
                params = _arguments155.length > 5 && _arguments155[5] !== undefined ? _arguments155[5] : {};
                method = 'privatePost' + _this167.capitalize(side);
                order = {
                    'Type': side == 'buy' ? 'BuyBtc' : 'SelBtc',
                    'IsMarketOrder': type == 'market' ? 1 : 0
                };

                if (type == 'market') {
                    if (side == 'buy') {
                        order['Total'] = amount;
                    } else {
                        order['Amount'] = amount;
                    }
                } else {
                    order['Price'] = price;
                    order['Amount'] = amount;
                }
                return _this167[method](_this167.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this168 = this;

            return _this168.privatePostCancelOrder({ 'id': id });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            if (this.id == 'btctrader') throw new ExchangeError(this.id + ' is an abstract base API for BTCExchange, BTCTurk');
            var url = this.urls['api'] + '/' + path;
            if (api == 'public') {
                if (Object.keys(params).length) url += '?' + this.urlencode(params);
            } else {
                var nonce = this.nonce().toString;
                body = this.urlencode(params);
                var secret = this.base64ToString(this.secret);
                var auth = this.apiKey + nonce;
                headers = {
                    'X-PCK': this.apiKey,
                    'X-Stamp': nonce.toString(),
                    'X-Signature': this.hmac(this.encode(auth), secret, 'sha256', 'base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var btcexchange = extend(btctrader, {

        'id': 'btcexchange',
        'name': 'BTCExchange',
        'countries': 'PH', // Philippines
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27993052-4c92911a-64aa-11e7-96d8-ec6ac3435757.jpg',
            'api': 'https://www.btcexchange.ph/api',
            'www': 'https://www.btcexchange.ph',
            'doc': 'https://github.com/BTCTrader/broker-api-docs'
        },
        'markets': {
            'BTC/PHP': { 'id': 'BTC/PHP', 'symbol': 'BTC/PHP', 'base': 'BTC', 'quote': 'PHP' }
        }
    });

    //-----------------------------------------------------------------------------

    var btctradeua = {

        'id': 'btctradeua',
        'name': 'BTC Trade UA',
        'countries': 'UA', // Ukraine,
        'rateLimit': 3000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27941483-79fc7350-62d9-11e7-9f61-ac47f28fcd96.jpg',
            'api': 'https://btc-trade.com.ua/api',
            'www': 'https://btc-trade.com.ua',
            'doc': 'https://docs.google.com/document/d/1ocYA0yMy_RXd561sfG3qEPZ80kyll36HUxvCRe5GbhE/edit'
        },
        'api': {
            'public': {
                'get': ['deals/{symbol}', 'trades/sell/{symbol}', 'trades/buy/{symbol}', 'japan_stat/high/{symbol}']
            },
            'private': {
                'post': ['auth', 'ask/{symbol}', 'balance', 'bid/{symbol}', 'buy/{symbol}', 'my_orders/{symbol}', 'order/status/{id}', 'remove/order/{id}', 'sell/{symbol}']
            }
        },
        'markets': {
            'BTC/UAH': { 'id': 'btc_uah', 'symbol': 'BTC/UAH', 'base': 'BTC', 'quote': 'UAH' },
            'ETH/UAH': { 'id': 'eth_uah', 'symbol': 'ETH/UAH', 'base': 'ETH', 'quote': 'UAH' },
            'LTC/UAH': { 'id': 'ltc_uah', 'symbol': 'LTC/UAH', 'base': 'LTC', 'quote': 'UAH' },
            'DOGE/UAH': { 'id': 'doge_uah', 'symbol': 'DOGE/UAH', 'base': 'DOGE', 'quote': 'UAH' },
            'DASH/UAH': { 'id': 'dash_uah', 'symbol': 'DASH/UAH', 'base': 'DASH', 'quote': 'UAH' },
            'SIB/UAH': { 'id': 'sib_uah', 'symbol': 'SIB/UAH', 'base': 'SIB', 'quote': 'UAH' },
            'KRB/UAH': { 'id': 'krb_uah', 'symbol': 'KRB/UAH', 'base': 'KRB', 'quote': 'UAH' },
            'NVC/UAH': { 'id': 'nvc_uah', 'symbol': 'NVC/UAH', 'base': 'NVC', 'quote': 'UAH' },
            'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'NVC/BTC': { 'id': 'nvc_btc', 'symbol': 'NVC/BTC', 'base': 'NVC', 'quote': 'BTC' },
            'ITI/UAH': { 'id': 'iti_uah', 'symbol': 'ITI/UAH', 'base': 'ITI', 'quote': 'UAH' },
            'DOGE/BTC': { 'id': 'doge_btc', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC' },
            'DASH/BTC': { 'id': 'dash_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC' }
        },

        signIn: function signIn() {
            return this.privatePostAuth();
        },
        fetchBalance: function fetchBalance() {
            var response,
                result,
                accounts,
                b,
                account,
                currency,
                balance,
                _this169 = this;

            return Promise.resolve().then(function () {
                return _this169.privatePostBalance();
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };

                if ('accounts' in result) {
                    accounts = response['accounts'];

                    for (b = 0; b < accounts.length; b++) {
                        account = accounts[b];
                        currency = account['currency'];
                        balance = parseFloat(account['balance']);

                        result[currency] = {
                            'free': balance,
                            'used': undefined,
                            'total': balance
                        };
                    }
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                bids,
                asks,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this170 = this,
                _arguments158 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments158.length > 1 && _arguments158[1] !== undefined ? _arguments158[1] : {};
                p = _this170.market(market);
                return _this170.publicGetTradesBuySymbol(_this170.extend({
                    'symbol': p['id']
                }, params));
            }).then(function (_resp) {
                bids = _resp;
                return _this170.publicGetTradesSellSymbol(_this170.extend({
                    'symbol': p['id']
                }, params));
            }).then(function (_resp) {
                asks = _resp;
                orderbook = {
                    'bids': [],
                    'asks': []
                };

                if (bids) {
                    if ('list' in bids) {
                        orderbook['bids'] = bids['list'];
                    }
                }
                if (asks) {
                    if ('list' in asks) {
                        orderbook['asks'] = asks['list'];
                    }
                }
                timestamp = _this170.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this170.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['currency_trade']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                result,
                tickerLength,
                start,
                t,
                candle,
                last,
                _this171 = this;

            return Promise.resolve().then(function () {
                return _this171.publicGetJapanStatHighSymbol({
                    'symbol': _this171.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['trades'];
                timestamp = _this171.milliseconds();
                result = {
                    'timestamp': timestamp,
                    'datetime': _this171.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': undefined,
                    'ask': undefined,
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': undefined,
                    'info': ticker
                };
                tickerLength = ticker.length;

                if (tickerLength > 0) {
                    start = Math.max(tickerLength - 48, 0);

                    for (t = start; t < ticker.length; t++) {
                        candle = ticker[t];

                        if (typeof result['open'] == 'undefined') {
                            result['open'] = candle[1];
                        }if (typeof result['high'] == 'undefined' || result['high'] < candle[2]) {
                            result['high'] = candle[2];
                        }if (typeof result['low'] == 'undefined' || result['low'] > candle[3]) {
                            result['low'] = candle[3];
                        }if (typeof result['quoteVolume'] == 'undefined') {
                            result['quoteVolume'] = -candle[5];
                        } else {
                            result['quoteVolume'] -= candle[5];
                        }
                    }
                    last = tickerLength - 1;

                    result['close'] = ticker[last][4];
                    result['quoteVolume'] = -1 * result['quoteVolume'];
                }
                return result;
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this172 = this;

            return _this172.publicGetDealsSymbol({
                'symbol': _this172.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                method,
                order,
                _this173 = this,
                _arguments161 = arguments;

            price = _arguments161.length > 4 && _arguments161[4] !== undefined ? _arguments161[4] : undefined;
            params = _arguments161.length > 5 && _arguments161[5] !== undefined ? _arguments161[5] : {};

            if (type == 'market') {
                throw new ExchangeError(_this173.id + ' allows limit orders only');
            }p = _this173.market(market);
            method = 'privatePost' + _this173.capitalize(side) + 'Id';
            order = {
                'count': amount,
                'currency1': p['quote'],
                'currency': p['base'],
                'price': price
            };

            return _this173[method](_this173.extend(order, params));
        },
        cancelOrder: function cancelOrder(id) {
            var _this174 = this;

            return _this174.privatePostRemoveOrderId({ 'id': id });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (Object.keys(query).length) url += this.implodeParams(path, query);
            } else {
                var nonce = this.nonce();
                body = this.urlencode(this.extend({
                    'out_order_id': nonce,
                    'nonce': nonce
                }, query));
                var auth = body + this.secret;
                headers = {
                    'public-key': this.apiKey,
                    'api-sign': this.hash(this.encode(auth), 'sha256'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var btcturk = extend(btctrader, {

        'id': 'btcturk',
        'name': 'BTCTurk',
        'countries': 'TR', // Turkey
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27992709-18e15646-64a3-11e7-9fa2-b0950ec7712f.jpg',
            'api': 'https://www.btcturk.com/api',
            'www': 'https://www.btcturk.com',
            'doc': 'https://github.com/BTCTrader/broker-api-docs'
        },
        'markets': {
            'BTC/TRY': { 'id': 'BTC/TRY', 'symbol': 'BTC/TRY', 'base': 'BTC', 'quote': 'TRY' }
        }
    });

    //-----------------------------------------------------------------------------

    var btcx = {

        'id': 'btcx',
        'name': 'BTCX',
        'countries': ['IS', 'US', 'EU'],
        'rateLimit': 1500, // support in english is very poor, unable to tell rate limits
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766385-9fdcc98c-5ed6-11e7-8f14-66d5e5cd47e6.jpg',
            'api': 'https://btc-x.is/api',
            'www': 'https://btc-x.is',
            'doc': 'https://btc-x.is/custom/api-document.html'
        },
        'api': {
            'public': {
                'get': ['depth/{id}/{limit}', 'ticker/{id}', 'trade/{id}/{limit}']
            },
            'private': {
                'post': ['balance', 'cancel', 'history', 'order', 'redeem', 'trade', 'withdraw']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'btc/usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/EUR': { 'id': 'btc/eur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
        },

        fetchBalance: function fetchBalance() {
            var balances,
                result,
                currencies,
                c,
                currency,
                uppercase,
                account,
                _this175 = this;

            return Promise.resolve().then(function () {
                return _this175.privatePostBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };
                currencies = Object.keys(balances);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    uppercase = currency.toUpperCase();
                    account = {
                        'free': balances[currency],
                        'used': undefined,
                        'total': balances[currency]
                    };

                    result[uppercase] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this176 = this,
                _arguments164 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments164.length > 1 && _arguments164[1] !== undefined ? _arguments164[1] : {};
                return _this176.publicGetDepthIdLimit(_this176.extend({
                    'id': _this176.marketId(market),
                    'limit': 1000
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this176.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this176.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['price'];
                        amount = order['amount'];

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this177 = this;

            return Promise.resolve().then(function () {
                return _this177.publicGetTickerId({
                    'id': _this177.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['time'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this177.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['sell']),
                    'ask': parseFloat(ticker['buy']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this178 = this;

            return _this178.publicGetTradeIdLimit({
                'id': _this178.marketId(market),
                'limit': 100
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this179 = this,
                _arguments167 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments167.length > 4 && _arguments167[4] !== undefined ? _arguments167[4] : undefined;
                params = _arguments167.length > 5 && _arguments167[5] !== undefined ? _arguments167[5] : {};
                return _this179.privatePostTrade(_this179.extend({
                    'type': side.toUpperCase(),
                    'market': _this179.marketId(market),
                    'amount': amount,
                    'price': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order']['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this180 = this;

            return _this180.privatePostCancel({ 'order': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                response,
                _this181 = this,
                _arguments169 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments169.length > 1 && _arguments169[1] !== undefined ? _arguments169[1] : 'public';
                method = _arguments169.length > 2 && _arguments169[2] !== undefined ? _arguments169[2] : 'GET';
                params = _arguments169.length > 3 && _arguments169[3] !== undefined ? _arguments169[3] : {};
                headers = _arguments169.length > 4 && _arguments169[4] !== undefined ? _arguments169[4] : undefined;
                body = _arguments169.length > 5 && _arguments169[5] !== undefined ? _arguments169[5] : undefined;
                url = _this181.urls['api'] + '/' + _this181.version + '/';

                if (api == 'public') {
                    url += _this181.implodeParams(path, params);
                } else {
                    nonce = _this181.nonce();

                    url += api;
                    body = _this181.urlencode(_this181.extend({
                        'Method': path.toUpperCase(),
                        'Nonce': nonce
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Key': _this181.apiKey,
                        'Signature': _this181.hmac(_this181.encode(body), _this181.encode(_this181.secret), 'sha512')
                    };
                }
                return _this181.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this181.id + ' ' + _this181.json(response['error']));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bter = {
        'id': 'bter',
        'name': 'Bter',
        'countries': ['VG', 'CN'], // British Virgin Islands, China
        'version': '2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27980479-cfa3188c-6387-11e7-8191-93fc4184ba5c.jpg',
            'api': {
                'public': 'https://data.bter.com/api',
                'private': 'https://api.bter.com/api'
            },
            'www': 'https://bter.com',
            'doc': 'https://bter.com/api2'
        },
        'api': {
            'public': {
                'get': ['pairs', 'marketinfo', 'marketlist', 'tickers', 'ticker/{id}', 'orderBook/{id}', 'trade/{id}', 'tradeHistory/{id}', 'tradeHistory/{id}/{tid}']
            },
            'private': {
                'post': ['balances', 'depositAddress', 'newAddress', 'depositsWithdrawals', 'buy', 'sell', 'cancelOrder', 'cancelAllOrders', 'getOrder', 'openOrders', 'tradeHistory', 'withdraw']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var response,
                markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this182 = this;

            return Promise.resolve().then(function () {
                return _this182.publicGetMarketlist();
            }).then(function (_resp) {
                response = _resp;
                markets = response['data'];
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['pair'];
                    base = market['curr_a'];
                    quote = market['curr_b'];

                    base = _this182.commonCurrencyCode(base);
                    quote = _this182.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var balance,
                result,
                c,
                currency,
                code,
                account,
                _this183 = this;

            return Promise.resolve().then(function () {
                return _this183.loadMarkets();
            }).then(function () {
                return _this183.privatePostBalances();
            }).then(function (_resp) {
                balance = _resp;
                result = { 'info': balance };

                for (c = 0; c < _this183.currencies.length; c++) {
                    currency = _this183.currencies[c];
                    code = _this183.commonCurrencyCode(currency);
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if ('available' in balance) {
                        if (currency in balance['available']) {
                            account['free'] = parseFloat(balance['available'][currency]);
                        }
                    }
                    if ('locked' in balance) {
                        if (currency in balance['locked']) {
                            account['used'] = parseFloat(balance['locked'][currency]);
                        }
                    }
                    account['total'] = _this183.sum(account['free'], account['used']);
                    result[code] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this184 = this,
                _arguments172 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments172.length > 1 && _arguments172[1] !== undefined ? _arguments172[1] : {};
                return _this184.loadMarkets();
            }).then(function () {
                return _this184.publicGetOrderBookId(_this184.extend({
                    'id': _this184.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this184.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this184.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                result['asks'] = _this184.sortBy(result['asks'], 0);
                return result;
            });
        },
        parseTicker: function parseTicker(ticker) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high24hr']),
                'low': parseFloat(ticker['low24hr']),
                'bid': parseFloat(ticker['highestBid']),
                'ask': parseFloat(ticker['lowestAsk']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': parseFloat(ticker['percentChange']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['baseVolume']),
                'quoteVolume': parseFloat(ticker['quoteVolume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                result,
                ids,
                i,
                id,
                _id$split5,
                _id$split6,
                baseId,
                quoteId,
                base,
                quote,
                symbol,
                ticker,
                market,
                _this185 = this;

            return Promise.resolve().then(function () {
                return _this185.loadMarkets();
            }).then(function () {
                return _this185.publicGetTickers();
            }).then(function (_resp) {
                tickers = _resp;
                result = {};
                ids = Object.keys(tickers);

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    _id$split5 = id.split('_');
                    _id$split6 = _slicedToArray(_id$split5, 2);
                    baseId = _id$split6[0];
                    quoteId = _id$split6[1];
                    base = baseId.toUpperCase();
                    quote = quoteId.toUpperCase();

                    base = _this185.commonCurrencyCode(base);
                    quote = _this185.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;
                    ticker = tickers[id];
                    market = undefined;

                    if (symbol in _this185.markets) {
                        market = _this185.markets[symbol];
                    }if (id in _this185.markets_by_id) {
                        market = _this185.markets_by_id[id];
                    }result[symbol] = _this185.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this186 = this;

            return Promise.resolve().then(function () {
                return _this186.loadMarkets();
            }).then(function () {
                p = _this186.market(market);
                return _this186.publicGetTickerId({
                    'id': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this186.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this187 = this;

            return Promise.resolve().then(function () {
                return _this187.loadMarkets();
            }).then(function () {
                return _this187.publicGetTradeHistoryId({
                    'id': _this187.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this188 = this,
                _arguments176 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments176.length > 4 && _arguments176[4] !== undefined ? _arguments176[4] : undefined;
                params = _arguments176.length > 5 && _arguments176[5] !== undefined ? _arguments176[5] : {};

                if (type == 'market') {
                    throw new ExchangeError(_this188.id + ' allows limit orders only');
                }return _this188.loadMarkets();
            }).then(function () {
                method = 'privatePost' + _this188.capitalize(side);
                order = {
                    'currencyPair': _this188.marketId(market),
                    'rate': price,
                    'amount': amount
                };
                return _this188[method](_this188.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['orderNumber']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this189 = this;

            return Promise.resolve().then(function () {
                return _this189.loadMarkets();
            }).then(function () {
                return _this189.privatePostCancelOrder({ 'orderNumber': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                prefix,
                url,
                query,
                nonce,
                request,
                response,
                _this190 = this,
                _arguments178 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments178.length > 1 && _arguments178[1] !== undefined ? _arguments178[1] : 'public';
                method = _arguments178.length > 2 && _arguments178[2] !== undefined ? _arguments178[2] : 'GET';
                params = _arguments178.length > 3 && _arguments178[3] !== undefined ? _arguments178[3] : {};
                headers = _arguments178.length > 4 && _arguments178[4] !== undefined ? _arguments178[4] : undefined;
                body = _arguments178.length > 5 && _arguments178[5] !== undefined ? _arguments178[5] : undefined;
                prefix = api == 'private' ? api + '/' : '';
                url = _this190.urls['api'][api] + _this190.version + '/1/' + prefix + _this190.implodeParams(path, params);
                query = _this190.omit(params, _this190.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this190.urlencode(query);
                    }
                } else {
                    nonce = _this190.nonce();
                    request = { 'nonce': nonce };

                    body = _this190.urlencode(_this190.extend(request, query));
                    headers = {
                        'Key': _this190.apiKey,
                        'Sign': _this190.hmac(_this190.encode(body), _this190.encode(_this190.secret), 'sha512'),
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length
                    };
                }
                return _this190.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('result' in response) {
                    if (response['result'] != 'true') {
                        throw new ExchangeError(_this190.id + ' ' + _this190.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var bxinth = {

        'id': 'bxinth',
        'name': 'BX.in.th',
        'countries': 'TH', // Thailand
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766412-567b1eb4-5ed7-11e7-94a8-ff6a3884f6c5.jpg',
            'api': 'https://bx.in.th/api',
            'www': 'https://bx.in.th',
            'doc': 'https://bx.in.th/info/api'
        },
        'api': {
            'public': {
                'get': ['', // ticker
                'options', 'optionbook', 'orderbook', 'pairing', 'trade', 'tradehistory']
            },
            'private': {
                'post': ['balance', 'biller', 'billgroup', 'billpay', 'cancel', 'deposit', 'getorders', 'history', 'option-issue', 'option-bid', 'option-sell', 'option-myissue', 'option-mybid', 'option-myoptions', 'option-exercise', 'option-cancel', 'option-history', 'order', 'withdrawal', 'withdrawal-history']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this191 = this;

            return Promise.resolve().then(function () {
                return _this191.publicGetPairing();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    market = markets[keys[p]];
                    id = market['pairing_id'].toString();
                    base = market['primary_currency'];
                    quote = market['secondary_currency'];

                    base = _this191.commonCurrencyCode(base);
                    quote = _this191.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        commonCurrencyCode: function commonCurrencyCode(currency) {
            // why would they use three letters instead of four for currency codes
            if (currency == 'DAS') return 'DASH';
            if (currency == 'DOG') return 'DOGE';
            return currency;
        },
        fetchBalance: function fetchBalance() {
            var response,
                balance,
                result,
                currencies,
                c,
                currency,
                code,
                account,
                _this192 = this;

            return Promise.resolve().then(function () {
                return _this192.loadMarkets();
            }).then(function () {
                return _this192.privatePostBalance();
            }).then(function (_resp) {
                response = _resp;
                balance = response['balance'];
                result = { 'info': balance };
                currencies = Object.keys(balance);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    code = _this192.commonCurrencyCode(currency);
                    account = {
                        'free': parseFloat(balance[currency]['available']),
                        'used': undefined,
                        'total': parseFloat(balance[currency]['total'])
                    };

                    account['used'] = account['total'] - account['free'];
                    result[code] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this193 = this,
                _arguments181 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments181.length > 1 && _arguments181[1] !== undefined ? _arguments181[1] : {};
                return _this193.loadMarkets();
            }).then(function () {
                return _this193.publicGetOrderbook(_this193.extend({
                    'pairing': _this193.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this193.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this193.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': parseFloat(ticker['orderbook']['bids']['highbid']),
                'ask': parseFloat(ticker['orderbook']['asks']['highbid']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last_price']),
                'change': parseFloat(ticker['change']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume_24hours']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                result,
                ids,
                i,
                id,
                ticker,
                market,
                symbol,
                _this194 = this;

            return Promise.resolve().then(function () {
                return _this194.loadMarkets();
            }).then(function () {
                return _this194.publicGet();
            }).then(function (_resp) {
                tickers = _resp;
                result = {};
                ids = Object.keys(tickers);

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    ticker = tickers[id];
                    market = _this194.markets_by_id[id];
                    symbol = market['symbol'];

                    result[symbol] = _this194.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                id,
                ticker,
                _this195 = this;

            return Promise.resolve().then(function () {
                return _this195.loadMarkets();
            }).then(function () {
                p = _this195.market(market);
                return _this195.publicGet({ 'pairing': p['id'] });
            }).then(function (_resp) {
                tickers = _resp;
                id = p['id'].toString();
                ticker = tickers[id];

                return _this195.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this196 = this;

            return Promise.resolve().then(function () {
                return _this196.loadMarkets();
            }).then(function () {
                return _this196.publicGetTrade({
                    'pairing': _this196.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this197 = this,
                _arguments185 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments185.length > 4 && _arguments185[4] !== undefined ? _arguments185[4] : undefined;
                params = _arguments185.length > 5 && _arguments185[5] !== undefined ? _arguments185[5] : {};
                return _this197.loadMarkets();
            }).then(function () {
                return _this197.privatePostOrder(_this197.extend({
                    'pairing': _this197.marketId(market),
                    'type': side,
                    'amount': amount,
                    'rate': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var pairing,
                _this198 = this;

            return Promise.resolve().then(function () {
                return _this198.loadMarkets();
            }).then(function () {
                pairing = undefined; // TODO fixme

                return _this198.privatePostCancel({
                    'order_id': id,
                    'pairing': pairing
                });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                auth,
                signature,
                response,
                _test6,
                _this199 = this,
                _arguments187 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments187.length > 1 && _arguments187[1] !== undefined ? _arguments187[1] : 'public';
                method = _arguments187.length > 2 && _arguments187[2] !== undefined ? _arguments187[2] : 'GET';
                params = _arguments187.length > 3 && _arguments187[3] !== undefined ? _arguments187[3] : {};
                headers = _arguments187.length > 4 && _arguments187[4] !== undefined ? _arguments187[4] : undefined;
                body = _arguments187.length > 5 && _arguments187[5] !== undefined ? _arguments187[5] : undefined;
                url = _this199.urls['api'] + '/';

                if (path) {
                    url += path + '/';
                }if (Object.keys(params).length) {
                    url += '?' + _this199.urlencode(params);
                }if (api == 'private') {
                    nonce = _this199.nonce();
                    auth = _this199.apiKey + nonce.toString() + _this199.secret;
                    signature = _this199.hash(_this199.encode(auth), 'sha256');

                    body = _this199.urlencode(_this199.extend({
                        'key': _this199.apiKey,
                        'nonce': nonce,
                        'signature': signature
                        // twofa: this.twofa,
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length
                    };
                }
                return _this199.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'public') {
                    return response;
                } else {
                    _test6 = 'success' in response;

                    if (_test6 && response['success']) {
                        return response;
                    } else {
                        throw new ExchangeError(_this199.id + ' ' + _this199.json(response));
                    }
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var ccex = {

        'id': 'ccex',
        'name': 'C-CEX',
        'countries': ['DE', 'EU'],
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766433-16881f90-5ed8-11e7-92f8-3d92cc747a6c.jpg',
            'api': {
                'tickers': 'https://c-cex.com/t',
                'public': 'https://c-cex.com/t/api_pub.html',
                'private': 'https://c-cex.com/t/api.html'
            },
            'www': 'https://c-cex.com',
            'doc': 'https://c-cex.com/?id=api'
        },
        'api': {
            'tickers': {
                'get': ['coinnames', '{market}', 'pairs', 'prices', 'volume_{coin}']
            },
            'public': {
                'get': ['balancedistribution', 'markethistory', 'markets', 'marketsummaries', 'orderbook']
            },
            'private': {
                'get': ['buylimit', 'cancel', 'getbalance', 'getbalances', 'getopenorders', 'getorder', 'getorderhistory', 'mytrades', 'selllimit']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this200 = this;

            return Promise.resolve().then(function () {
                return _this200.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['result'].length; p++) {
                    market = markets['result'][p];
                    id = market['MarketName'];
                    base = market['MarketCurrency'];
                    quote = market['BaseCurrency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this201 = this;

            return Promise.resolve().then(function () {
                return _this201.loadMarkets();
            }).then(function () {
                return _this201.privateGetBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['Currency'];
                    account = {
                        'free': balance['Available'],
                        'used': balance['Pending'],
                        'total': balance['Balance']
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this202 = this,
                _arguments190 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments190.length > 1 && _arguments190[1] !== undefined ? _arguments190[1] : {};
                return _this202.loadMarkets();
            }).then(function () {
                return _this202.publicGetOrderbook(_this202.extend({
                    'market': _this202.marketId(market),
                    'type': 'both',
                    'depth': 100
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['result'];
                timestamp = _this202.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this202.iso8601(timestamp)
                };
                sides = { 'bids': 'buy', 'asks': 'sell' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['Rate']);
                        amount = parseFloat(order['Quantity']);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['updated'] * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['lastprice']),
                'change': undefined,
                'percentage': undefined,
                'average': parseFloat(ticker['avg']),
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['buysupport']),
                'info': ticker
            };
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                response,
                ticker,
                _this203 = this;

            return Promise.resolve().then(function () {
                return _this203.loadMarkets();
            }).then(function () {
                p = _this203.market(market);
                return _this203.tickersGetMarket({
                    'market': p['id'].toLowerCase()
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];

                return _this203.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this204 = this;

            return Promise.resolve().then(function () {
                return _this204.loadMarkets();
            }).then(function () {
                return _this204.publicGetMarkethistory({
                    'market': _this204.marketId(market),
                    'type': 'both',
                    'depth': 100
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                response,
                _this205 = this,
                _arguments193 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments193.length > 4 && _arguments193[4] !== undefined ? _arguments193[4] : undefined;
                params = _arguments193.length > 5 && _arguments193[5] !== undefined ? _arguments193[5] : {};
                return _this205.loadMarkets();
            }).then(function () {
                method = 'privateGet' + _this205.capitalize(side) + type;
                return _this205[method](_this205.extend({
                    'market': _this205.marketId(market),
                    'quantity': amount,
                    'rate': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['result']['uuid']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this206 = this;

            return Promise.resolve().then(function () {
                return _this206.loadMarkets();
            }).then(function () {
                return _this206.privateGetCancel({ 'uuid': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                query,
                response,
                _test7,
                _this207 = this,
                _arguments195 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments195.length > 1 && _arguments195[1] !== undefined ? _arguments195[1] : 'public';
                method = _arguments195.length > 2 && _arguments195[2] !== undefined ? _arguments195[2] : 'GET';
                params = _arguments195.length > 3 && _arguments195[3] !== undefined ? _arguments195[3] : {};
                headers = _arguments195.length > 4 && _arguments195[4] !== undefined ? _arguments195[4] : undefined;
                body = _arguments195.length > 5 && _arguments195[5] !== undefined ? _arguments195[5] : undefined;
                url = _this207.urls['api'][api];

                if (api == 'private') {
                    nonce = _this207.nonce().toString();
                    query = _this207.keysort(_this207.extend({
                        'a': path,
                        'apikey': _this207.apiKey,
                        'nonce': nonce
                    }, params));

                    url += '?' + _this207.urlencode(query);
                    headers = { 'apisign': _this207.hmac(_this207.encode(url), _this207.encode(_this207.secret), 'sha512') };
                } else {
                    if (api == 'public') {
                        url += '?' + _this207.urlencode(_this207.extend({
                            'a': 'get' + path
                        }, params));
                    } else {
                        url += '/' + _this207.implodeParams(path, params) + '.json';
                    }
                }return _this207.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'tickers') {
                    return response;
                } else {
                    _test7 = 'success' in response;

                    if (_test7 && response['success']) {
                        return response;
                    } else {
                        throw new ExchangeError(_this207.id + ' ' + _this207.json(response));
                    }
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var cex = {

        'id': 'cex',
        'name': 'CEX.IO',
        'countries': ['GB', 'EU', 'CY', 'RU'],
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766442-8ddc33b0-5ed8-11e7-8b98-f786aef0f3c9.jpg',
            'api': 'https://cex.io/api',
            'www': 'https://cex.io',
            'doc': 'https://cex.io/cex-api'
        },
        'api': {
            'public': {
                'get': ['currency_limits', 'last_price/{pair}', 'last_prices/{currencies}', 'ohlcv/hd/{yyyymmdd}/{pair}', 'order_book/{pair}', 'ticker/{pair}', 'tickers/{currencies}', 'trade_history/{pair}'],
                'post': ['convert/{pair}', 'price_stats/{pair}']
            },
            'private': {
                'post': ['active_orders_status/', 'archived_orders/{pair}', 'balance/', 'cancel_order/', 'cancel_orders/{pair}', 'cancel_replace_order/{pair}', 'close_position/{pair}', 'get_address/', 'get_myfee/', 'get_order/', 'get_order_tx/', 'open_orders/{pair}', 'open_orders/', 'open_position/{pair}', 'open_positions/{pair}', 'place_order/{pair}', 'place_order/{pair}']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                symbol,
                _symbol$split5,
                _symbol$split6,
                base,
                quote,
                _this208 = this;

            return Promise.resolve().then(function () {
                return _this208.publicGetCurrencyLimits();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['data']['pairs'].length; p++) {
                    market = markets['data']['pairs'][p];
                    id = market['symbol1'] + '/' + market['symbol2'];
                    symbol = id;
                    _symbol$split5 = symbol.split('/');
                    _symbol$split6 = _slicedToArray(_symbol$split5, 2);
                    base = _symbol$split6[0];
                    quote = _symbol$split6[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var balances,
                result,
                c,
                currency,
                account,
                _this209 = this;

            return Promise.resolve().then(function () {
                return _this209.loadMarkets();
            }).then(function () {
                return _this209.privatePostBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this209.currencies.length; c++) {
                    currency = _this209.currencies[c];
                    account = {
                        'free': parseFloat(balances[currency]['available']),
                        'used': parseFloat(balances[currency]['orders']),
                        'total': undefined
                    };

                    account['total'] = _this209.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this210 = this,
                _arguments198 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments198.length > 1 && _arguments198[1] !== undefined ? _arguments198[1] : {};
                return _this210.loadMarkets();
            }).then(function () {
                return _this210.publicGetOrderBookPair(_this210.extend({
                    'pair': _this210.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['timestamp'] * 1000;
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this210.iso8601(timestamp)
                };

                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = parseInt(ticker['timestamp']) * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var currencies,
                response,
                tickers,
                result,
                t,
                ticker,
                symbol,
                market,
                _this211 = this;

            return Promise.resolve().then(function () {
                return _this211.loadMarkets();
            }).then(function () {
                currencies = _this211.currencies.join('/');
                return _this211.publicGetTickersCurrencies({
                    'currencies': currencies
                });
            }).then(function (_resp) {
                response = _resp;
                tickers = response['data'];
                result = {};

                for (t = 0; t < tickers.length; t++) {
                    ticker = tickers[t];
                    symbol = ticker['pair'].replace(':', '/');
                    market = _this211.markets[symbol];

                    result[symbol] = _this211.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this212 = this;

            return Promise.resolve().then(function () {
                return _this212.loadMarkets();
            }).then(function () {
                p = _this212.market(market);
                return _this212.publicGetTickerPair({
                    'pair': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this212.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this213 = this;

            return Promise.resolve().then(function () {
                return _this213.loadMarkets();
            }).then(function () {
                return _this213.publicGetTradeHistoryPair({
                    'pair': _this213.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this214 = this,
                _arguments202 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments202.length > 4 && _arguments202[4] !== undefined ? _arguments202[4] : undefined;
                params = _arguments202.length > 5 && _arguments202[5] !== undefined ? _arguments202[5] : {};
                return _this214.loadMarkets();
            }).then(function () {
                order = {
                    'pair': _this214.marketId(market),
                    'type': side,
                    'amount': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                } else {
                    order['order_type'] = type;
                }return _this214.privatePostPlaceOrderPair(_this214.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this215 = this;

            return Promise.resolve().then(function () {
                return _this215.loadMarkets();
            }).then(function () {
                return _this215.privatePostCancelOrder({ 'id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                auth,
                signature,
                response,
                _test8,
                _test9,
                _this216 = this,
                _arguments204 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments204.length > 1 && _arguments204[1] !== undefined ? _arguments204[1] : 'public';
                method = _arguments204.length > 2 && _arguments204[2] !== undefined ? _arguments204[2] : 'GET';
                params = _arguments204.length > 3 && _arguments204[3] !== undefined ? _arguments204[3] : {};
                headers = _arguments204.length > 4 && _arguments204[4] !== undefined ? _arguments204[4] : undefined;
                body = _arguments204.length > 5 && _arguments204[5] !== undefined ? _arguments204[5] : undefined;
                url = _this216.urls['api'] + '/' + _this216.implodeParams(path, params);
                query = _this216.omit(params, _this216.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this216.urlencode(query);
                    }
                } else {
                    if (!_this216.uid) {
                        throw new AuthenticationError(_this216.id + ' requires `' + _this216.id + '.uid` property for authentication');
                    }nonce = _this216.nonce().toString();
                    auth = nonce + _this216.uid + _this216.apiKey;
                    signature = _this216.hmac(_this216.encode(auth), _this216.encode(_this216.secret));

                    body = _this216.urlencode(_this216.extend({
                        'key': _this216.apiKey,
                        'signature': signature.toUpperCase(),
                        'nonce': nonce
                    }, query));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length
                    };
                }
                return _this216.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test8 = 'e' in response;
                _test9 = _test8 && 'ok' in response;

                if (_test9 && response['ok'] == 'ok') {
                    return response;
                } else {
                    if (_test8) {
                        throw new ExchangeError(_this216.id + ' ' + _this216.json(response));
                    }

                    return response;
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var chbtc = {
        'id': 'chbtc',
        'name': 'CHBTC',
        'countries': 'CN',
        'rateLimit': 1000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28555659-f0040dc2-7109-11e7-9d99-688a438bf9f4.jpg',
            'api': {
                'public': 'http://api.chbtc.com/data', // no https for public API
                'private': 'https://trade.chbtc.com/api'
            },
            'www': 'https://trade.chbtc.com/api',
            'doc': 'https://www.chbtc.com/i/developer'
        },
        'api': {
            'public': {
                'get': ['ticker', 'depth', 'trades', 'kline']
            },
            'private': {
                'post': ['order', 'cancelOrder', 'getOrder', 'getOrders', 'getOrdersNew', 'getOrdersIgnoreTradeType', 'getUnfinishedOrdersIgnoreTradeType', 'getAccountInfo', 'getUserAddress', 'getWithdrawAddress', 'getWithdrawRecord', 'getChargeRecord', 'getCnyWithdrawRecord', 'getCnyChargeRecord', 'withdraw']
            }
        },
        'markets': {
            'BTC/CNY': { 'id': 'btc_cny', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
            'LTC/CNY': { 'id': 'ltc_cny', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY' },
            'ETH/CNY': { 'id': 'eth_cny', 'symbol': 'ETH/CNY', 'base': 'ETH', 'quote': 'CNY' },
            'ETC/CNY': { 'id': 'etc_cny', 'symbol': 'ETC/CNY', 'base': 'ETC', 'quote': 'CNY' },
            'BTS/CNY': { 'id': 'bts_cny', 'symbol': 'BTS/CNY', 'base': 'BTS', 'quote': 'CNY' },
            'EOS/CNY': { 'id': 'eos_cny', 'symbol': 'EOS/CNY', 'base': 'EOS', 'quote': 'CNY' }
        },

        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                c,
                currency,
                account,
                _this217 = this;

            return Promise.resolve().then(function () {
                return _this217.privatePostGetAccountInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result'];
                result = { 'info': balances };

                for (c = 0; c < _this217.currencies.length; c++) {
                    currency = _this217.currencies[c];
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (currency in balances['balance']) {
                        account['free'] = balances['balance'][currency]['amount'];
                    }if (currency in balances['frozen']) {
                        account['used'] = balances['frozen'][currency]['amount'];
                    }account['total'] = _this217.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                bids,
                asks,
                result,
                _this218 = this,
                _arguments206 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments206.length > 1 && _arguments206[1] !== undefined ? _arguments206[1] : {};
                p = _this218.market(market);
                return _this218.publicGetDepth(_this218.extend({
                    'currency': p['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this218.milliseconds();
                bids = undefined;
                asks = undefined;

                if ('bids' in orderbook) {
                    bids = orderbook['bids'];
                }if ('asks' in orderbook) {
                    asks = orderbook['asks'];
                }result = {
                    'bids': bids,
                    'asks': asks,
                    'timestamp': timestamp,
                    'datetime': _this218.iso8601(timestamp)
                };

                if (result['bids']) {
                    result['bids'] = _this218.sortBy(result['bids'], 0, true);
                }if (result['asks']) {
                    result['asks'] = _this218.sortBy(result['asks'], 0);
                }return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this219 = this;

            return Promise.resolve().then(function () {
                return _this219.publicGetTicker({
                    'currency': _this219.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = _this219.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this219.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this220 = this;

            return _this220.publicGetTrades({
                'currency': _this220.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                paramString,
                tradeType,
                response,
                _this221 = this,
                _arguments209 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments209.length > 4 && _arguments209[4] !== undefined ? _arguments209[4] : undefined;
                params = _arguments209.length > 5 && _arguments209[5] !== undefined ? _arguments209[5] : {};
                paramString = '&price=' + price.toString();

                paramString += '&amount=' + amount.toString();
                tradeType = side == 'buy' ? '1' : '0';

                paramString += '&tradeType=' + tradeType;
                paramString += '&currency=' + _this221.marketId(market);
                return _this221.privatePostOrder(paramString);
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                paramString,
                _this222 = this,
                _arguments210 = arguments;

            params = _arguments210.length > 1 && _arguments210[1] !== undefined ? _arguments210[1] : {};
            paramString = '&id=' + id.toString();

            if ('currency' in params) {
                paramString += '&currency=' + params['currency'];
            }return _this222.privatePostCancelOrder(paramString);
        },
        fetchOrder: function fetchOrder(id) {
            var params,
                paramString,
                _this223 = this,
                _arguments211 = arguments;

            params = _arguments211.length > 1 && _arguments211[1] !== undefined ? _arguments211[1] : {};
            paramString = '&id=' + id.toString();

            if ('currency' in params) {
                paramString += '&currency=' + params['currency'];
            }return _this223.privatePostGetOrder(paramString);
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                paramsLength,
                nonce,
                auth,
                secret,
                signature,
                suffix,
                response,
                _this224 = this,
                _arguments212 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments212.length > 1 && _arguments212[1] !== undefined ? _arguments212[1] : 'public';
                method = _arguments212.length > 2 && _arguments212[2] !== undefined ? _arguments212[2] : 'GET';
                params = _arguments212.length > 3 && _arguments212[3] !== undefined ? _arguments212[3] : {};
                headers = _arguments212.length > 4 && _arguments212[4] !== undefined ? _arguments212[4] : undefined;
                body = _arguments212.length > 5 && _arguments212[5] !== undefined ? _arguments212[5] : undefined;
                url = _this224.urls['api'][api];

                if (api == 'public') {
                    url += '/' + _this224.version + '/' + path;
                    if (Object.keys(params).length) {
                        url += '?' + _this224.urlencode(params);
                    }
                } else {
                    paramsLength = params.length; // params should be a string here

                    nonce = _this224.nonce();
                    auth = 'method=' + path;

                    auth += '&accesskey=' + _this224.apiKey;
                    auth += paramsLength ? params : '';
                    secret = _this224.hash(_this224.encode(_this224.secret), 'sha1');
                    signature = _this224.hmac(_this224.encode(auth), _this224.encode(secret), 'md5');
                    suffix = 'sign=' + signature + '&reqTime=' + nonce.toString();

                    url += '/' + path + '?' + auth + '&' + suffix;
                }
                return _this224.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'private') {
                    if ('code' in response) {
                        throw new ExchangeError(_this224.id + ' ' + _this224.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var chilebit = extend(blinktrade, {
        'id': 'chilebit',
        'name': 'ChileBit',
        'countries': 'CL',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27991414-1298f0d8-647f-11e7-9c40-d56409266336.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://chilebit.net',
            'doc': 'https://blinktrade.com/docs'
        },
        'comment': 'Blinktrade API',
        'markets': {
            'BTC/CLP': { 'id': 'BTCCLP', 'symbol': 'BTC/CLP', 'base': 'BTC', 'quote': 'CLP', 'brokerId': 9, 'broker': 'ChileBit' }
        }
    });

    //-----------------------------------------------------------------------------

    var coincheck = {

        'id': 'coincheck',
        'name': 'coincheck',
        'countries': ['JP', 'ID'],
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766464-3b5c3c74-5ed9-11e7-840e-31b32968e1da.jpg',
            'api': 'https://coincheck.com/api',
            'www': 'https://coincheck.com',
            'doc': 'https://coincheck.com/documents/exchange/api'
        },
        'api': {
            'public': {
                'get': ['exchange/orders/rate', 'order_books', 'rate/{pair}', 'ticker', 'trades']
            },
            'private': {
                'get': ['accounts', 'accounts/balance', 'accounts/leverage_balance', 'bank_accounts', 'deposit_money', 'exchange/orders/opens', 'exchange/orders/transactions', 'exchange/orders/transactions_pagination', 'exchange/leverage/positions', 'lending/borrows/matches', 'send_money', 'withdraws'],
                'post': ['bank_accounts', 'deposit_money/{id}/fast', 'exchange/orders', 'exchange/transfers/to_leverage', 'exchange/transfers/from_leverage', 'lending/borrows', 'lending/borrows/{id}/repay', 'send_money', 'withdraws'],
                'delete': ['bank_accounts/{id}', 'exchange/orders/{id}', 'withdraws/{id}']
            }
        },
        'markets': {
            'BTC/JPY': { 'id': 'btc_jpy', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY' }, // the only real pair
            'ETH/JPY': { 'id': 'eth_jpy', 'symbol': 'ETH/JPY', 'base': 'ETH', 'quote': 'JPY' },
            'ETC/JPY': { 'id': 'etc_jpy', 'symbol': 'ETC/JPY', 'base': 'ETC', 'quote': 'JPY' },
            'DAO/JPY': { 'id': 'dao_jpy', 'symbol': 'DAO/JPY', 'base': 'DAO', 'quote': 'JPY' },
            'LSK/JPY': { 'id': 'lsk_jpy', 'symbol': 'LSK/JPY', 'base': 'LSK', 'quote': 'JPY' },
            'FCT/JPY': { 'id': 'fct_jpy', 'symbol': 'FCT/JPY', 'base': 'FCT', 'quote': 'JPY' },
            'XMR/JPY': { 'id': 'xmr_jpy', 'symbol': 'XMR/JPY', 'base': 'XMR', 'quote': 'JPY' },
            'REP/JPY': { 'id': 'rep_jpy', 'symbol': 'REP/JPY', 'base': 'REP', 'quote': 'JPY' },
            'XRP/JPY': { 'id': 'xrp_jpy', 'symbol': 'XRP/JPY', 'base': 'XRP', 'quote': 'JPY' },
            'ZEC/JPY': { 'id': 'zec_jpy', 'symbol': 'ZEC/JPY', 'base': 'ZEC', 'quote': 'JPY' },
            'XEM/JPY': { 'id': 'xem_jpy', 'symbol': 'XEM/JPY', 'base': 'XEM', 'quote': 'JPY' },
            'LTC/JPY': { 'id': 'ltc_jpy', 'symbol': 'LTC/JPY', 'base': 'LTC', 'quote': 'JPY' },
            'DASH/JPY': { 'id': 'dash_jpy', 'symbol': 'DASH/JPY', 'base': 'DASH', 'quote': 'JPY' },
            'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'ETC/BTC': { 'id': 'etc_btc', 'symbol': 'ETC/BTC', 'base': 'ETC', 'quote': 'BTC' },
            'LSK/BTC': { 'id': 'lsk_btc', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC' },
            'FCT/BTC': { 'id': 'fct_btc', 'symbol': 'FCT/BTC', 'base': 'FCT', 'quote': 'BTC' },
            'XMR/BTC': { 'id': 'xmr_btc', 'symbol': 'XMR/BTC', 'base': 'XMR', 'quote': 'BTC' },
            'REP/BTC': { 'id': 'rep_btc', 'symbol': 'REP/BTC', 'base': 'REP', 'quote': 'BTC' },
            'XRP/BTC': { 'id': 'xrp_btc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC' },
            'ZEC/BTC': { 'id': 'zec_btc', 'symbol': 'ZEC/BTC', 'base': 'ZEC', 'quote': 'BTC' },
            'XEM/BTC': { 'id': 'xem_btc', 'symbol': 'XEM/BTC', 'base': 'XEM', 'quote': 'BTC' },
            'LTC/BTC': { 'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'DASH/BTC': { 'id': 'dash_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var balances,
                result,
                c,
                currency,
                lowercase,
                account,
                reserved,
                _this225 = this;

            return Promise.resolve().then(function () {
                return _this225.privateGetAccountsBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this225.currencies.length; c++) {
                    currency = _this225.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (lowercase in balances) {
                        account['free'] = parseFloat(balances[lowercase]);
                    }reserved = lowercase + '_reserved';

                    if (reserved in balances) {
                        account['used'] = parseFloat(balances[reserved]);
                    }account['total'] = _this225.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this226 = this,
                _arguments214 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments214.length > 1 && _arguments214[1] !== undefined ? _arguments214[1] : {};
                return _this226.publicGetOrderBooks(params);
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this226.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this226.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this227 = this;

            return Promise.resolve().then(function () {
                return _this227.publicGetTicker();
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['timestamp'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this227.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this228 = this;

            return _this228.publicGetTrades();
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                prefix,
                order,
                order_type,
                _prefix,
                response,
                _this229 = this,
                _arguments217 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments217.length > 4 && _arguments217[4] !== undefined ? _arguments217[4] : undefined;
                params = _arguments217.length > 5 && _arguments217[5] !== undefined ? _arguments217[5] : {};
                prefix = '';
                order = {
                    'pair': _this229.marketId(market)
                };

                if (type == 'market') {
                    order_type = type + '_' + side;

                    order['order_type'] = order_type;
                    _prefix = side == 'buy' ? order_type + '_' : '';

                    order[_prefix + 'amount'] = amount;
                } else {
                    order['order_type'] = side;
                    order['rate'] = price;
                    order['amount'] = amount;
                }
                return _this229.privatePostExchangeOrders(_this229.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this230 = this;

            return _this230.privateDeleteExchangeOrdersId({ 'id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                length,
                auth,
                response,
                _test10,
                _this231 = this,
                _arguments219 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments219.length > 1 && _arguments219[1] !== undefined ? _arguments219[1] : 'public';
                method = _arguments219.length > 2 && _arguments219[2] !== undefined ? _arguments219[2] : 'GET';
                params = _arguments219.length > 3 && _arguments219[3] !== undefined ? _arguments219[3] : {};
                headers = _arguments219.length > 4 && _arguments219[4] !== undefined ? _arguments219[4] : undefined;
                body = _arguments219.length > 5 && _arguments219[5] !== undefined ? _arguments219[5] : undefined;
                url = _this231.urls['api'] + '/' + _this231.implodeParams(path, params);
                query = _this231.omit(params, _this231.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this231.urlencode(query);
                    }
                } else {
                    nonce = _this231.nonce().toString();
                    length = 0;

                    if (Object.keys(query).length) {
                        body = _this231.urlencode(_this231.keysort(query));
                        length = body.length;
                    }
                    auth = nonce + url + (body || '');

                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': length,
                        'ACCESS-KEY': _this231.apiKey,
                        'ACCESS-NONCE': nonce,
                        'ACCESS-SIGNATURE': _this231.hmac(_this231.encode(auth), _this231.encode(_this231.secret))
                    };
                }
                return _this231.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'public') {
                    return response;
                } else {
                    _test10 = 'success' in response;

                    if (_test10 && response['success']) {
                        return response;
                    } else {
                        throw new ExchangeError(_this231.id + ' ' + _this231.json(response));
                    }
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var coinfloor = {

        'id': 'coinfloor',
        'name': 'coinfloor',
        'rateLimit': 1000,
        'countries': 'UK',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28246081-623fc164-6a1c-11e7-913f-bac0d5576c90.jpg',
            'api': 'https://webapi.coinfloor.co.uk:8090/bist',
            'www': 'https://www.coinfloor.co.uk',
            'doc': ['https://github.com/coinfloor/api', 'https://www.coinfloor.co.uk/api']
        },
        'api': {
            'public': {
                'get': ['{id}/ticker/', '{id}/order_book/', '{id}/transactions/']
            },
            'private': {
                'post': ['{id}/balance/', '{id}/user_transactions/', '{id}/open_orders/', '{id}/cancel_order/', '{id}/buy/', '{id}/sell/', '{id}/buy_market/', '{id}/sell_market/', '{id}/estimate_sell_market/', '{id}/estimate_buy_market/']
            }
        },
        'markets': {
            'BTC/GBP': { 'id': 'XBT/GBP', 'symbol': 'BTC/GBP', 'base': 'BTC', 'quote': 'GBP' },
            'BTC/EUR': { 'id': 'XBT/EUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/USD': { 'id': 'XBT/USD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/PLN': { 'id': 'XBT/PLN', 'symbol': 'BTC/PLN', 'base': 'BTC', 'quote': 'PLN' },
            'BCH/GBP': { 'id': 'BCH/GBP', 'symbol': 'BCH/GBP', 'base': 'BCH', 'quote': 'GBP' }
        },

        fetchBalance: function fetchBalance(market) {
            var _this232 = this;

            return _this232.privatePostIdBalance({
                'id': _this232.marketId(market)
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this233 = this;

            return Promise.resolve().then(function () {
                return _this233.publicGetIdOrderBook({
                    'id': _this233.marketId(market)
                });
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this233.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this233.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            // rewrite to get the timestamp from HTTP headers
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': parseFloat(ticker['vwap']),
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTicker: function fetchTicker(market) {
            var m,
                ticker,
                _this234 = this;

            return Promise.resolve().then(function () {
                m = _this234.market(market);
                return _this234.publicGetIdTicker({
                    'id': m['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this234.parseTicker(ticker, m);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this235 = this;

            return _this235.publicGetIdTransactions({
                'id': _this235.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                method,
                _this236 = this,
                _arguments224 = arguments;

            price = _arguments224.length > 4 && _arguments224[4] !== undefined ? _arguments224[4] : undefined;
            params = _arguments224.length > 5 && _arguments224[5] !== undefined ? _arguments224[5] : {};
            order = { 'id': _this236.marketId(market) };
            method = 'privatePostId' + _this236.capitalize(side);

            if (type == 'market') {
                order['quantity'] = amount;
                method += 'Market';
            } else {
                order['price'] = price;
                order['amount'] = amount;
            }
            return _this236[method](_this236.extend(order, params));
        },
        cancelOrder: function cancelOrder(id) {
            var _this237 = this;

            return _this237.privatePostIdCancelOrder({ 'id': id });
        },
        request: function request(path) {
            var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            // curl -k -u '[User ID]/[API key]:[Passphrase]' https://webapi.coinfloor.co.uk:8090/bist/XBT/GBP/balance/
            var url = this.urls['api'] + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (type == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                var nonce = this.nonce();
                body = this.urlencode(this.extend({ 'nonce': nonce }, query));
                var auth = this.uid + '/' + this.apiKey + ':' + this.password;
                var signature = this.stringToBase64(auth);
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': body.length,
                    'Authorization': 'Basic ' + signature
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var coingi = {

        'id': 'coingi',
        'name': 'Coingi',
        'rateLimit': 1000,
        'countries': ['PA', 'BG', 'CN', 'US'], // Panama, Bulgaria, China, US
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28619707-5c9232a8-7212-11e7-86d6-98fe5d15cc6e.jpg',
            'api': 'https://api.coingi.com',
            'www': 'https://coingi.com',
            'doc': 'http://docs.coingi.apiary.io/'
        },
        'api': {
            'current': {
                'get': ['order-book/{pair}/{askCount}/{bidCount}/{depth}', 'transactions/{pair}/{maxCount}', '24hour-rolling-aggregation']
            },
            'user': {
                'post': ['balance', 'add-order', 'cancel-order', 'orders', 'transactions', 'create-crypto-withdrawal']
            }
        },
        'markets': {
            'LTC/BTC': { 'id': 'ltc-btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC' },
            'PPC/BTC': { 'id': 'ppc-btc', 'symbol': 'PPC/BTC', 'base': 'PPC', 'quote': 'BTC' },
            'DOGE/BTC': { 'id': 'doge-btc', 'symbol': 'DOGE/BTC', 'base': 'DOGE', 'quote': 'BTC' },
            'VTC/BTC': { 'id': 'vtc-btc', 'symbol': 'VTC/BTC', 'base': 'VTC', 'quote': 'BTC' },
            'FTC/BTC': { 'id': 'ftc-btc', 'symbol': 'FTC/BTC', 'base': 'FTC', 'quote': 'BTC' },
            'NMC/BTC': { 'id': 'nmc-btc', 'symbol': 'NMC/BTC', 'base': 'NMC', 'quote': 'BTC' },
            'DASH/BTC': { 'id': 'dash-btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC' }
        },

        fetchBalance: function fetchBalance() {
            var currencies,
                c,
                currency,
                balances,
                result,
                b,
                balance,
                _currency4,
                account,
                _this238 = this;

            return Promise.resolve().then(function () {
                currencies = [];

                for (c = 0; c < _this238.currencies.length; c++) {
                    currency = _this238.currencies[c].toLowerCase();

                    currencies.push(currency);
                }
                return _this238.userPostBalance({
                    'currencies': currencies.join(',')
                });
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    _currency4 = balance['currency']['name'];

                    _currency4 = _currency4.toUpperCase();
                    account = {
                        'free': balance['available'],
                        'used': balance['blocked'] + balance['inOrders'] + balance['withdrawing'],
                        'total': undefined
                    };

                    account['total'] = _this238.sum(account['free'], account['used']);
                    result[_currency4] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this239 = this,
                _arguments227 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments227.length > 1 && _arguments227[1] !== undefined ? _arguments227[1] : {};
                p = _this239.market(market);
                return _this239.currentGetOrderBookPairAskCountBidCountDepth(_this239.extend({
                    'pair': p['id'],
                    'askCount': 512, // maximum returned number of asks 1-512
                    'bidCount': 512, // maximum returned number of bids 1-512
                    'depth': 32 // maximum number of depth range steps 1-32
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this239.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this239.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['price'];
                        amount = order['baseAmount'];

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': ticker['high'],
                'low': ticker['low'],
                'bid': ticker['highestBid'],
                'ask': ticker['lowestAsk'],
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': undefined,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': ticker['baseVolume'],
                'quoteVolume': ticker['counterVolume'],
                'info': ticker
            };
            return ticker;
        },
        fetchTickers: function fetchTickers() {
            var response,
                result,
                t,
                ticker,
                base,
                quote,
                symbol,
                market,
                _this240 = this;

            return Promise.resolve().then(function () {
                return _this240.currentGet24hourRollingAggregation();
            }).then(function (_resp) {
                response = _resp;
                result = {};

                for (t = 0; t < response.length; t++) {
                    ticker = response[t];
                    base = ticker['currencyPair']['base'].toUpperCase();
                    quote = ticker['currencyPair']['counter'].toUpperCase();
                    symbol = base + '/' + quote;
                    market = _this240.markets[symbol];

                    result[symbol] = _this240.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                tickers,
                t,
                ticker,
                base,
                quote,
                _symbol,
                p,
                symbol,
                _ticker,
                _this241 = this;

            return Promise.resolve().then(function () {
                return _this241.currentGet24hourRollingAggregation();
            }).then(function (_resp) {
                response = _resp;
                tickers = {};

                for (t = 0; t < response.length; t++) {
                    ticker = response[t];
                    base = ticker['currencyPair']['base'].toUpperCase();
                    quote = ticker['currencyPair']['counter'].toUpperCase();
                    _symbol = base + '/' + quote;

                    tickers[_symbol] = ticker;
                }
                p = _this241.market(market);
                symbol = p['symbol'];

                if (symbol in tickers) {
                    _ticker = tickers[symbol];

                    return _this241.parseTicker(_ticker, p);
                } else {
                    throw new ExchangeError(_this241.id + ' ' + symbol + ' ticker not found');
                }
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this242 = this,
                _arguments230 = arguments;

            params = _arguments230.length > 1 && _arguments230[1] !== undefined ? _arguments230[1] : {};

            return _this242.currentGetTransactionsPairMaxCount(_this242.extend({
                'pair': _this242.marketId(market),
                'maxCount': 128
            }, params));
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this243 = this,
                _arguments231 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments231.length > 4 && _arguments231[4] !== undefined ? _arguments231[4] : undefined;
                params = _arguments231.length > 5 && _arguments231[5] !== undefined ? _arguments231[5] : {};
                order = {
                    'currencyPair': _this243.marketId(market),
                    'volume': amount,
                    'price': price,
                    'orderType': side == 'buy' ? 0 : 1
                };
                return _this243.userPostAddOrder(_this243.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['result']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this244 = this;

            return _this244.userPostCancelOrder({ 'orderId': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                request,
                auth,
                response,
                _this245 = this,
                _arguments233 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments233.length > 1 && _arguments233[1] !== undefined ? _arguments233[1] : 'public';
                method = _arguments233.length > 2 && _arguments233[2] !== undefined ? _arguments233[2] : 'GET';
                params = _arguments233.length > 3 && _arguments233[3] !== undefined ? _arguments233[3] : {};
                headers = _arguments233.length > 4 && _arguments233[4] !== undefined ? _arguments233[4] : undefined;
                body = _arguments233.length > 5 && _arguments233[5] !== undefined ? _arguments233[5] : undefined;
                url = _this245.urls['api'] + '/' + api + '/' + _this245.implodeParams(path, params);
                query = _this245.omit(params, _this245.extractParams(path));

                if (api == 'current') {
                    if (Object.keys(query).length) {
                        url += '?' + _this245.urlencode(query);
                    }
                } else {
                    nonce = _this245.nonce();
                    request = _this245.extend({
                        'token': _this245.apiKey,
                        'nonce': nonce
                    }, query);
                    auth = nonce.toString() + '$' + _this245.apiKey;

                    request['signature'] = _this245.hmac(_this245.encode(auth), _this245.encode(_this245.secret));
                    body = _this245.json(request);
                    headers = {
                        'Content-Type': 'application/json',
                        'Content-Length': body.length
                    };
                }
                return _this245.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('errors' in response) {
                    throw new ExchangeError(_this245.id + ' ' + _this245.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var coinmarketcap = {

        'id': 'coinmarketcap',
        'name': 'CoinMarketCap',
        'rateLimit': 10000,
        'version': 'v1',
        'countries': 'US',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28244244-9be6312a-69ed-11e7-99c1-7c1797275265.jpg',
            'api': 'https://api.coinmarketcap.com',
            'www': 'https://coinmarketcap.com',
            'doc': 'https://coinmarketcap.com/api'
        },
        'api': {
            'public': {
                'get': ['ticker/', 'ticker/{id}/', 'global/']
            }
        },
        'currencies': ['AUD', 'BRL', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'HKD', 'IDR', 'INR', 'JPY', 'KRW', 'MXN', 'RUB', 'USD'],

        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                _this246 = this,
                _arguments234 = arguments;

            params = _arguments234.length > 1 && _arguments234[1] !== undefined ? _arguments234[1] : {};

            throw new ExchangeError('Fetching order books is not supported by the API of ' + _this246.id);
        },
        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                c,
                base,
                baseId,
                quote,
                quoteId,
                symbol,
                id,
                _this247 = this;

            return Promise.resolve().then(function () {
                return _this247.publicGetTicker();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];

                    for (c = 0; c < _this247.currencies.length; c++) {
                        base = market['symbol'];
                        baseId = market['id'];
                        quote = _this247.currencies[c];
                        quoteId = quote.toLowerCase();
                        symbol = base + '/' + quote;
                        id = baseId + '/' + quote;

                        result.push({
                            'id': id,
                            'symbol': symbol,
                            'base': base,
                            'quote': quote,
                            'baseId': baseId,
                            'quoteId': quoteId,
                            'info': market
                        });
                    }
                }
                return result;
            });
        },
        fetchGlobal: function fetchGlobal() {
            var currency,
                request,
                _this248 = this,
                _arguments236 = arguments;

            return Promise.resolve().then(function () {
                currency = _arguments236.length > 0 && _arguments236[0] !== undefined ? _arguments236[0] : 'USD';
                return _this248.loadMarkets();
            }).then(function () {
                request = {};

                if (currency) {
                    request['convert'] = currency;
                }return _this248.publicGetGlobal(request);
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            if ('last_updated' in ticker) if (ticker['last_updated']) timestamp = parseInt(ticker['last_updated']) * 1000;
            var volume = undefined;
            var volumeKey = '24h_volume_' + market['quoteId'];
            if (ticker[volumeKey]) volume = parseFloat(ticker[volumeKey]);
            var price = 'price_' + market['quoteId'];
            var change = undefined;
            var changeKey = 'percent_change_24h';
            if (ticker[changeKey]) change = parseFloat(ticker[changeKey]);
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': undefined,
                'ask': undefined,
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker[price]),
                'change': change,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': volume,
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var currency,
                request,
                response,
                tickers,
                t,
                ticker,
                id,
                market,
                symbol,
                _this249 = this,
                _arguments237 = arguments;

            return Promise.resolve().then(function () {
                currency = _arguments237.length > 0 && _arguments237[0] !== undefined ? _arguments237[0] : 'USD';
                return _this249.loadMarkets();
            }).then(function () {
                request = {};

                if (currency) {
                    request['convert'] = currency;
                }return _this249.publicGetTicker(request);
            }).then(function (_resp) {
                response = _resp;
                tickers = {};

                for (t = 0; t < response.length; t++) {
                    ticker = response[t];
                    id = ticker['id'] + '/' + currency;
                    market = _this249.markets_by_id[id];
                    symbol = market['symbol'];

                    tickers[symbol] = _this249.parseTicker(ticker, market);
                }
                return tickers;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                request,
                response,
                ticker,
                _this250 = this;

            return Promise.resolve().then(function () {
                return _this250.loadMarkets();
            }).then(function () {
                p = _this250.market(market);
                request = {
                    'convert': p['quote'],
                    'id': p['baseId']
                };
                return _this250.publicGetTickerId(request);
            }).then(function (_resp) {
                response = _resp;
                ticker = response[0];

                return _this250.parseTicker(ticker, p);
            });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/' + this.version + '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (Object.keys(query).length) url += '?' + this.urlencode(query);
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var coinmate = {

        'id': 'coinmate',
        'name': 'CoinMate',
        'countries': ['GB', 'CZ'], // UK, Czech Republic
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27811229-c1efb510-606c-11e7-9a36-84ba2ce412d8.jpg',
            'api': 'https://coinmate.io/api',
            'www': 'https://coinmate.io',
            'doc': ['http://docs.coinmate.apiary.io', 'https://coinmate.io/developers']
        },
        'api': {
            'public': {
                'get': ['orderBook', 'ticker', 'transactions']
            },
            'private': {
                'post': ['balances', 'bitcoinWithdrawal', 'bitcoinDepositAddresses', 'buyInstant', 'buyLimit', 'cancelOrder', 'cancelOrderWithInfo', 'createVoucher', 'openOrders', 'redeemVoucher', 'sellInstant', 'sellLimit', 'transactionHistory', 'unconfirmedBitcoinDeposits']
            }
        },
        'markets': {
            'BTC/EUR': { 'id': 'BTC_EUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' },
            'BTC/CZK': { 'id': 'BTC_CZK', 'symbol': 'BTC/CZK', 'base': 'BTC', 'quote': 'CZK' }
        },

        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                c,
                currency,
                account,
                _this251 = this;

            return Promise.resolve().then(function () {
                return _this251.privatePostBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['data'];
                result = { 'info': balances };

                for (c = 0; c < _this251.currencies.length; c++) {
                    currency = _this251.currencies[c];
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (currency in balances) {
                        account['free'] = balances[currency]['available'];
                        account['used'] = balances[currency]['reserved'];
                        account['total'] = balances[currency]['balance'];
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this252 = this,
                _arguments240 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments240.length > 1 && _arguments240[1] !== undefined ? _arguments240[1] : {};
                return _this252.publicGetOrderBook(_this252.extend({
                    'currencyPair': _this252.marketId(market),
                    'groupByPriceLimit': 'False'
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['data'];
                timestamp = orderbook['timestamp'] * 1000;
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this252.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['price'];
                        amount = order['amount'];

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this253 = this;

            return Promise.resolve().then(function () {
                return _this253.publicGetTicker({
                    'currencyPair': _this253.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['data'];
                timestamp = ticker['timestamp'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this253.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['amount']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this254 = this;

            return _this254.publicGetTransactions({
                'currencyPair': _this254.marketId(market),
                'minutesIntoHistory': 10
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this255 = this,
                _arguments243 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments243.length > 4 && _arguments243[4] !== undefined ? _arguments243[4] : undefined;
                params = _arguments243.length > 5 && _arguments243[5] !== undefined ? _arguments243[5] : {};
                method = 'privatePost' + _this255.capitalize(side);
                order = {
                    'currencyPair': _this255.marketId(market)
                };

                if (type == 'market') {
                    if (side == 'buy') {
                        order['total'] = amount; // amount in fiat
                    } else {
                        order['amount'] = amount;
                    } // amount in fiat
                    method += 'Instant';
                } else {
                    order['amount'] = amount; // amount in crypto
                    order['price'] = price;
                    method += _this255.capitalize(type);
                }
                return _this255[method](self.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['data'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this256 = this;

            return _this256.privatePostCancelOrder({ 'orderId': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                auth,
                signature,
                response,
                _this257 = this,
                _arguments245 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments245.length > 1 && _arguments245[1] !== undefined ? _arguments245[1] : 'public';
                method = _arguments245.length > 2 && _arguments245[2] !== undefined ? _arguments245[2] : 'GET';
                params = _arguments245.length > 3 && _arguments245[3] !== undefined ? _arguments245[3] : {};
                headers = _arguments245.length > 4 && _arguments245[4] !== undefined ? _arguments245[4] : undefined;
                body = _arguments245.length > 5 && _arguments245[5] !== undefined ? _arguments245[5] : undefined;
                url = _this257.urls['api'] + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this257.urlencode(params);
                    }
                } else {
                    if (!_this257.uid) {
                        throw new AuthenticationError(_this257.id + ' requires `' + _this257.id + '.uid` property for authentication');
                    }nonce = _this257.nonce().toString();
                    auth = nonce + _this257.uid + _this257.apiKey;
                    signature = _this257.hmac(_this257.encode(auth), _this257.encode(_this257.secret));

                    body = _this257.urlencode(_this257.extend({
                        'clientId': _this257.uid,
                        'nonce': nonce,
                        'publicKey': _this257.apiKey,
                        'signature': signature.toUpperCase()
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                }
                return _this257.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    if (response['error']) {
                        throw new ExchangeError(_this257.id + ' ' + _this257.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var coinsecure = {

        'id': 'coinsecure',
        'name': 'Coinsecure',
        'countries': 'IN', // India
        'rateLimit': 1000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766472-9cbd200a-5ed9-11e7-9551-2267ad7bac08.jpg',
            'api': 'https://api.coinsecure.in',
            'www': 'https://coinsecure.in',
            'doc': ['https://api.coinsecure.in', 'https://github.com/coinsecure/plugins']
        },
        'api': {
            'public': {
                'get': ['bitcoin/search/confirmation/{txid}', 'exchange/ask/low', 'exchange/ask/orders', 'exchange/bid/high', 'exchange/bid/orders', 'exchange/lastTrade', 'exchange/max24Hr', 'exchange/min24Hr', 'exchange/ticker', 'exchange/trades']
            },
            'private': {
                'get': ['mfa/authy/call', 'mfa/authy/sms', 'netki/search/{netkiName}', 'user/bank/otp/{number}', 'user/kyc/otp/{number}', 'user/profile/phone/otp/{number}', 'user/wallet/coin/address/{id}', 'user/wallet/coin/deposit/confirmed/all', 'user/wallet/coin/deposit/confirmed/{id}', 'user/wallet/coin/deposit/unconfirmed/all', 'user/wallet/coin/deposit/unconfirmed/{id}', 'user/wallet/coin/wallets', 'user/exchange/bank/fiat/accounts', 'user/exchange/bank/fiat/balance/available', 'user/exchange/bank/fiat/balance/pending', 'user/exchange/bank/fiat/balance/total', 'user/exchange/bank/fiat/deposit/cancelled', 'user/exchange/bank/fiat/deposit/unverified', 'user/exchange/bank/fiat/deposit/verified', 'user/exchange/bank/fiat/withdraw/cancelled', 'user/exchange/bank/fiat/withdraw/completed', 'user/exchange/bank/fiat/withdraw/unverified', 'user/exchange/bank/fiat/withdraw/verified', 'user/exchange/ask/cancelled', 'user/exchange/ask/completed', 'user/exchange/ask/pending', 'user/exchange/bid/cancelled', 'user/exchange/bid/completed', 'user/exchange/bid/pending', 'user/exchange/bank/coin/addresses', 'user/exchange/bank/coin/balance/available', 'user/exchange/bank/coin/balance/pending', 'user/exchange/bank/coin/balance/total', 'user/exchange/bank/coin/deposit/cancelled', 'user/exchange/bank/coin/deposit/unverified', 'user/exchange/bank/coin/deposit/verified', 'user/exchange/bank/coin/withdraw/cancelled', 'user/exchange/bank/coin/withdraw/completed', 'user/exchange/bank/coin/withdraw/unverified', 'user/exchange/bank/coin/withdraw/verified', 'user/exchange/bank/summary', 'user/exchange/coin/fee', 'user/exchange/fiat/fee', 'user/exchange/kycs', 'user/exchange/referral/coin/paid', 'user/exchange/referral/coin/successful', 'user/exchange/referral/fiat/paid', 'user/exchange/referrals', 'user/exchange/trade/summary', 'user/login/token/{token}', 'user/summary', 'user/wallet/summary', 'wallet/coin/withdraw/cancelled', 'wallet/coin/withdraw/completed', 'wallet/coin/withdraw/unverified', 'wallet/coin/withdraw/verified'],
                'post': ['login', 'login/initiate', 'login/password/forgot', 'mfa/authy/initiate', 'mfa/ga/initiate', 'signup', 'user/netki/update', 'user/profile/image/update', 'user/exchange/bank/coin/withdraw/initiate', 'user/exchange/bank/coin/withdraw/newVerifycode', 'user/exchange/bank/fiat/withdraw/initiate', 'user/exchange/bank/fiat/withdraw/newVerifycode', 'user/password/change', 'user/password/reset', 'user/wallet/coin/withdraw/initiate', 'wallet/coin/withdraw/newVerifycode'],
                'put': ['signup/verify/{token}', 'user/exchange/kyc', 'user/exchange/bank/fiat/deposit/new', 'user/exchange/ask/new', 'user/exchange/bid/new', 'user/exchange/instant/buy', 'user/exchange/instant/sell', 'user/exchange/bank/coin/withdraw/verify', 'user/exchange/bank/fiat/account/new', 'user/exchange/bank/fiat/withdraw/verify', 'user/mfa/authy/initiate/enable', 'user/mfa/ga/initiate/enable', 'user/netki/create', 'user/profile/phone/new', 'user/wallet/coin/address/new', 'user/wallet/coin/new', 'user/wallet/coin/withdraw/sendToExchange', 'user/wallet/coin/withdraw/verify'],
                'delete': ['user/gcm/{code}', 'user/logout', 'user/exchange/bank/coin/withdraw/unverified/cancel/{withdrawID}', 'user/exchange/bank/fiat/deposit/cancel/{depositID}', 'user/exchange/ask/cancel/{orderID}', 'user/exchange/bid/cancel/{orderID}', 'user/exchange/bank/fiat/withdraw/unverified/cancel/{withdrawID}', 'user/mfa/authy/disable/{code}', 'user/mfa/ga/disable/{code}', 'user/profile/phone/delete', 'user/profile/image/delete/{netkiName}', 'user/wallet/coin/withdraw/unverified/cancel/{withdrawID}']
            }
        },
        'markets': {
            'BTC/INR': { 'id': 'BTC/INR', 'symbol': 'BTC/INR', 'base': 'BTC', 'quote': 'INR' }
        },

        fetchBalance: function fetchBalance() {
            var response,
                balance,
                coin,
                fiat,
                result,
                _this258 = this;

            return Promise.resolve().then(function () {
                return _this258.privateGetUserExchangeBankSummary();
            }).then(function (_resp) {
                response = _resp;
                balance = response['message'];
                coin = {
                    'free': balance['availableCoinBalance'],
                    'used': balance['pendingCoinBalance'],
                    'total': balance['totalCoinBalance']
                };
                fiat = {
                    'free': balance['availableFiatBalance'],
                    'used': balance['pendingFiatBalance'],
                    'total': balance['totalFiatBalance']
                };
                result = {
                    'info': balance,
                    'BTC': coin,
                    'INR': fiat
                };

                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                bids,
                asks,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this259 = this,
                _arguments247 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments247.length > 1 && _arguments247[1] !== undefined ? _arguments247[1] : {};
                return _this259.publicGetExchangeBidOrders(params);
            }).then(function (_resp) {
                bids = _resp;
                return _this259.publicGetExchangeAskOrders(params);
            }).then(function (_resp) {
                asks = _resp;
                orderbook = {
                    'bids': bids['message'],
                    'asks': asks['message']
                };
                timestamp = _this259.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this259.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['rate'];
                        amount = order['vol'];

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this260 = this;

            return Promise.resolve().then(function () {
                return _this260.publicGetExchangeTicker();
            }).then(function (_resp) {
                response = _resp;
                ticker = response['message'];
                timestamp = ticker['timestamp'];

                return {
                    'timestamp': timestamp,
                    'datetime': _this260.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['lastPrice']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['coinvolume']),
                    'quoteVolume': parseFloat(ticker['fiatvolume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this261 = this;

            return _this261.publicGetExchangeTrades();
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                direction,
                response,
                _this262 = this,
                _arguments250 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments250.length > 4 && _arguments250[4] !== undefined ? _arguments250[4] : undefined;
                params = _arguments250.length > 5 && _arguments250[5] !== undefined ? _arguments250[5] : {};
                method = 'privatePutUserExchange';
                order = {};

                if (type == 'market') {
                    method += 'Instant' + _this262.capitalize(side);
                    if (side == 'buy') {
                        order['maxFiat'] = amount;
                    } else {
                        order['maxVol'] = amount;
                    }
                } else {
                    direction = side == 'buy' ? 'Bid' : 'Ask';

                    method += direction + 'New';
                    order['rate'] = price;
                    order['vol'] = amount;
                }
                return _this262[method](self.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['message']['orderID']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var method,
                _this263 = this;

            throw new ExchangeError(_this263.id + ' cancelOrder () is not fully implemented yet');
            method = 'privateDeleteUserExchangeAskCancelOrderId'; // TODO fixme, have to specify order side here

            return _this263[method]({ 'orderID': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                response,
                _test11,
                _this264 = this,
                _arguments252 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments252.length > 1 && _arguments252[1] !== undefined ? _arguments252[1] : 'public';
                method = _arguments252.length > 2 && _arguments252[2] !== undefined ? _arguments252[2] : 'GET';
                params = _arguments252.length > 3 && _arguments252[3] !== undefined ? _arguments252[3] : {};
                headers = _arguments252.length > 4 && _arguments252[4] !== undefined ? _arguments252[4] : undefined;
                body = _arguments252.length > 5 && _arguments252[5] !== undefined ? _arguments252[5] : undefined;
                url = _this264.urls['api'] + '/' + _this264.version + '/' + _this264.implodeParams(path, params);
                query = _this264.omit(params, _this264.extractParams(path));

                if (api == 'private') {
                    headers = { 'Authorization': _this264.apiKey };
                    if (Object.keys(query).length) {
                        body = _this264.json(query);
                        headers['Content-Type'] = 'application/json';
                    }
                }
                return _this264.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test11 = 'success' in response;

                if (_test11 && response['success']) {
                    return response;
                } else {
                    throw new ExchangeError(_this264.id + ' ' + _this264.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var coinspot = {

        'id': 'coinspot',
        'name': 'CoinSpot',
        'countries': 'AU', // Australia
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28208429-3cacdf9a-6896-11e7-854e-4c79a772a30f.jpg',
            'api': {
                'public': 'https://www.coinspot.com.au/pubapi',
                'private': 'https://www.coinspot.com.au/api'
            },
            'www': 'https://www.coinspot.com.au',
            'doc': 'https://www.coinspot.com.au/api'
        },
        'api': {
            'public': {
                'get': ['latest']
            },
            'private': {
                'post': ['orders', 'orders/history', 'my/coin/deposit', 'my/coin/send', 'quote/buy', 'quote/sell', 'my/balances', 'my/orders', 'my/buy', 'my/sell', 'my/buy/cancel', 'my/sell/cancel']
            }
        },
        'markets': {
            'BTC/AUD': { 'id': 'BTC', 'symbol': 'BTC/AUD', 'base': 'BTC', 'quote': 'AUD' },
            'LTC/AUD': { 'id': 'LTC', 'symbol': 'LTC/AUD', 'base': 'LTC', 'quote': 'AUD' },
            'DOGE/AUD': { 'id': 'DOGE', 'symbol': 'DOGE/AUD', 'base': 'DOGE', 'quote': 'AUD' }
        },

        fetchBalance: function fetchBalance() {
            var response,
                result,
                balances,
                currencies,
                c,
                currency,
                uppercase,
                account,
                _this265 = this;

            return Promise.resolve().then(function () {
                return _this265.privatePostMyBalances();
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };

                if ('balance' in response) {
                    balances = response['balance'];
                    currencies = Object.keys(balances);

                    for (c = 0; c < currencies.length; c++) {
                        currency = currencies[c];
                        uppercase = currency.toUpperCase();
                        account = {
                            'free': balances[currency],
                            'used': undefined,
                            'total': balances[currency]
                        };

                        if (uppercase == 'DRK') {
                            uppercase = 'DASH';
                        }result[uppercase] = account;
                    }
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this266 = this,
                _arguments254 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments254.length > 1 && _arguments254[1] !== undefined ? _arguments254[1] : {};
                p = _this266.market(market);
                return _this266.privatePostOrders(_this266.extend({
                    'cointype': p['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this266.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this266.iso8601(timestamp)
                };
                sides = { 'bids': 'buyorders', 'asks': 'sellorders' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['rate']);
                        amount = parseFloat(order['amount']);

                        result[key].push([price, amount]);
                    }
                }
                result['bids'] = _this266.sortBy(result['bids'], 0, true);
                result['asks'] = _this266.sortBy(result['asks'], 0);
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                id,
                ticker,
                timestamp,
                _this267 = this;

            return Promise.resolve().then(function () {
                return _this267.publicGetLatest();
            }).then(function (_resp) {
                response = _resp;
                id = _this267.marketId(market);

                id = id.toLowerCase();
                ticker = response['prices'][id];
                timestamp = _this267.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this267.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': undefined,
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this268 = this;

            return _this268.privatePostOrdersHistory({
                'cointype': _this268.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                _this269 = this,
                _arguments257 = arguments;

            price = _arguments257.length > 4 && _arguments257[4] !== undefined ? _arguments257[4] : undefined;
            params = _arguments257.length > 5 && _arguments257[5] !== undefined ? _arguments257[5] : {};
            method = 'privatePostMy' + _this269.capitalize(side);

            if (type == 'market') {
                throw new ExchangeError(_this269.id + ' allows limit orders only');
            }order = {
                'cointype': _this269.marketId(market),
                'amount': amount,
                'rate': price
            };

            return _this269[method](_this269.extend(order, params));
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                method,
                _this270 = this,
                _arguments258 = arguments;

            params = _arguments258.length > 1 && _arguments258[1] !== undefined ? _arguments258[1] : {};

            throw new ExchangeError(_this270.id + ' cancelOrder () is not fully implemented yet');
            method = 'privatePostMyBuy';

            return _this270[method]({ 'id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                _this271 = this,
                _arguments259 = arguments;

            api = _arguments259.length > 1 && _arguments259[1] !== undefined ? _arguments259[1] : 'public';
            method = _arguments259.length > 2 && _arguments259[2] !== undefined ? _arguments259[2] : 'GET';
            params = _arguments259.length > 3 && _arguments259[3] !== undefined ? _arguments259[3] : {};
            headers = _arguments259.length > 4 && _arguments259[4] !== undefined ? _arguments259[4] : undefined;
            body = _arguments259.length > 5 && _arguments259[5] !== undefined ? _arguments259[5] : undefined;

            if (!_this271.apiKey) {
                throw new AuthenticationError(_this271.id + ' requires apiKey for all requests');
            }url = _this271.urls['api'][api] + '/' + path;

            if (api == 'private') {
                nonce = _this271.nonce();

                body = _this271.json(_this271.extend({ 'nonce': nonce }, params));
                headers = {
                    'Content-Type': 'application/json',
                    'Content-Length': body.length,
                    'key': _this271.apiKey,
                    'sign': _this271.hmac(_this271.encode(body), _this271.encode(_this271.secret), 'sha512')
                };
            }
            return _this271.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var dsx = {

        'id': 'dsx',
        'name': 'DSX',
        'countries': 'UK',
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27990275-1413158a-645a-11e7-931c-94717f7510e3.jpg',
            'api': {
                'mapi': 'https://dsx.uk/mapi', // market data
                'tapi': 'https://dsx.uk/tapi', // trading
                'dwapi': 'https://dsx.uk/dwapi' // deposit/withdraw
            },
            'www': 'https://dsx.uk',
            'doc': ['https://api.dsx.uk', 'https://dsx.uk/api_docs/public', 'https://dsx.uk/api_docs/private', '']
        },
        'api': {
            'mapi': { // market data (public)
                'get': ['barsFromMoment/{id}/{period}/{start}', // empty reply :\
                'depth/{id}', 'info', 'lastBars/{id}/{period}/{amount}', // period is (m, h or d)
                'periodBars/{id}/{period}/{start}/{end}', 'ticker/{id}', 'trades/{id}']
            },
            'tapi': { // trading (private)
                'post': ['getInfo', 'TransHistory', 'TradeHistory', 'OrderHistory', 'ActiveOrders', 'Trade', 'CancelOrder']
            },
            'dwapi': { // deposit / withdraw (private)
                'post': ['getCryptoDepositAddress', 'cryptoWithdraw', 'fiatWithdraw', 'getTransactionStatus', 'getTransactions']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var response,
                keys,
                result,
                p,
                id,
                market,
                base,
                quote,
                symbol,
                _this272 = this;

            return Promise.resolve().then(function () {
                return _this272.mapiGetInfo();
            }).then(function (_resp) {
                response = _resp;
                keys = Object.keys(response['pairs']);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = response['pairs'][id];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);

                    base = base.toUpperCase();
                    quote = quote.toUpperCase();
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                currencies,
                c,
                currency,
                account,
                _this273 = this;

            return Promise.resolve().then(function () {
                return _this273.loadMarkets();
            }).then(function () {
                return _this273.tapiPostGetInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['return'];
                result = { 'info': balances };
                currencies = Object.keys(balances['total']);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    account = {
                        'free': balances['funds'][currency],
                        'used': undefined,
                        'total': balances['total'][currency]
                    };

                    account['used'] = account['total'] - account['free'];
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this274 = this,
                _arguments262 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments262.length > 1 && _arguments262[1] !== undefined ? _arguments262[1] : {};
                return _this274.loadMarkets();
            }).then(function () {
                p = _this274.market(market);
                return _this274.mapiGetDepthId(_this274.extend({
                    'id': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response[p['id']];
                timestamp = _this274.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this274.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order[0];
                        amount = order[1];

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                response,
                ticker,
                timestamp,
                _this275 = this;

            return Promise.resolve().then(function () {
                return _this275.loadMarkets();
            }).then(function () {
                p = _this275.market(market);
                return _this275.mapiGetTickerId({
                    'id': p['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response[p['id']];
                timestamp = ticker['updated'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this275.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['avg']),
                    'baseVolume': parseFloat(ticker['vol']),
                    'quoteVolume': parseFloat(ticker['vol_cur']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this276 = this;

            return Promise.resolve().then(function () {
                return _this276.loadMarkets();
            }).then(function () {
                return _this276.mapiGetTradesId({
                    'id': _this276.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this277 = this,
                _arguments265 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments265.length > 4 && _arguments265[4] !== undefined ? _arguments265[4] : undefined;
                params = _arguments265.length > 5 && _arguments265[5] !== undefined ? _arguments265[5] : {};
                return _this277.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this277.id + ' allows limit orders only');
                }order = {
                    'pair': _this277.marketId(market),
                    'type': side,
                    'rate': price,
                    'amount': amount
                };
                return _this277.tapiPostTrade(_this277.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['return']['orderId'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this278 = this;

            return Promise.resolve().then(function () {
                return _this278.loadMarkets();
            }).then(function () {
                return _this278.tapiPostCancelOrder({ 'orderId': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                _method,
                response,
                _test12,
                _this279 = this,
                _arguments267 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments267.length > 1 && _arguments267[1] !== undefined ? _arguments267[1] : 'mapi';
                method = _arguments267.length > 2 && _arguments267[2] !== undefined ? _arguments267[2] : 'GET';
                params = _arguments267.length > 3 && _arguments267[3] !== undefined ? _arguments267[3] : {};
                headers = _arguments267.length > 4 && _arguments267[4] !== undefined ? _arguments267[4] : undefined;
                body = _arguments267.length > 5 && _arguments267[5] !== undefined ? _arguments267[5] : undefined;
                url = _this279.urls['api'][api];

                if (api == 'mapi' || api == 'dwapi') {
                    url += '/' + _this279.implodeParams(path, params);
                }query = _this279.omit(params, _this279.extractParams(path));

                if (api == 'mapi') {
                    if (Object.keys(query).length) {
                        url += '?' + _this279.urlencode(query);
                    }
                } else {
                    nonce = _this279.nonce();
                    _method = path;

                    body = _this279.urlencode(_this279.extend({
                        'method': path,
                        'nonce': nonce
                    }, query));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this279.apiKey,
                        'Sign': _this279.hmac(_this279.encode(body), _this279.encode(_this279.secret), 'sha512', 'base64')
                    };
                }
                return _this279.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'mapi') {
                    return response;
                } else {
                    _test12 = 'success' in response;

                    if (_test12 && response['success']) {
                        return response;
                    } else {
                        throw new ExchangeError(_this279.id + ' ' + _this279.json(response));
                    }
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var exmo = {

        'id': 'exmo',
        'name': 'EXMO',
        'countries': ['ES', 'RU'], // Spain, Russia
        'rateLimit': 1000, // once every 350 ms ≈ 180 requests per minute ≈ 3 requests per second
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766491-1b0ea956-5eda-11e7-9225-40d67b481b8d.jpg',
            'api': 'https://api.exmo.com',
            'www': 'https://exmo.me',
            'markets': 'https://exmo.me/en/trade#?pair=BTC_USD',
            'doc': ['https://exmo.me/ru/api_doc', 'https://github.com/exmo-dev/exmo_api_lib/tree/master/nodejs']
        },
        'api': {
            'public': {
                'get': ['currency', 'order_book', 'pair_settings', 'ticker', 'trades']
            },
            'private': {
                'post': ['user_info', 'order_create', 'order_cancel', 'user_open_orders', 'user_trades', 'user_cancelled_orders', 'order_trades', 'required_amount', 'deposit_address', 'withdraw_crypt', 'withdraw_get_txid', 'excode_create', 'excode_load', 'wallet_history']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                id,
                market,
                symbol,
                _symbol$split7,
                _symbol$split8,
                base,
                quote,
                _this280 = this;

            return Promise.resolve().then(function () {
                return _this280.publicGetPairSettings();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = markets[id];
                    symbol = id.replace('_', '/');
                    _symbol$split7 = symbol.split('/');
                    _symbol$split8 = _slicedToArray(_symbol$split7, 2);
                    base = _symbol$split8[0];
                    quote = _symbol$split8[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                result,
                c,
                currency,
                account,
                _this281 = this;

            return Promise.resolve().then(function () {
                return _this281.loadMarkets();
            }).then(function () {
                return _this281.privatePostUserInfo();
            }).then(function (_resp) {
                response = _resp;
                result = { 'info': response };

                for (c = 0; c < _this281.currencies.length; c++) {
                    currency = _this281.currencies[c];
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (currency in response['balances']) {
                        account['free'] = parseFloat(response['balances'][currency]);
                    }if (currency in response['reserved']) {
                        account['used'] = parseFloat(response['reserved'][currency]);
                    }account['total'] = _this281.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this282 = this,
                _arguments270 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments270.length > 1 && _arguments270[1] !== undefined ? _arguments270[1] : {};
                return _this282.loadMarkets();
            }).then(function () {
                p = _this282.market(market);
                return _this282.publicGetOrderBook(_this282.extend({
                    'pair': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response[p['id']];
                timestamp = _this282.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this282.iso8601(timestamp)
                };
                sides = { 'bids': 'bid', 'asks': 'ask' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['updated'] * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy_price']),
                'ask': parseFloat(ticker['sell_price']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last_trade']),
                'change': undefined,
                'percentage': undefined,
                'average': parseFloat(ticker['avg']),
                'baseVolume': parseFloat(ticker['vol']),
                'quoteVolume': parseFloat(ticker['vol_curr']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var currency,
                response,
                result,
                ids,
                i,
                id,
                market,
                symbol,
                ticker,
                _this283 = this,
                _arguments271 = arguments;

            return Promise.resolve().then(function () {
                currency = _arguments271.length > 0 && _arguments271[0] !== undefined ? _arguments271[0] : 'USD';
                return _this283.loadMarkets();
            }).then(function () {
                return _this283.publicGetTicker();
            }).then(function (_resp) {
                response = _resp;
                result = {};
                ids = Object.keys(response);

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this283.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = response[id];

                    result[symbol] = _this283.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                p,
                _this284 = this;

            return Promise.resolve().then(function () {
                return _this284.loadMarkets();
            }).then(function () {
                return _this284.publicGetTicker();
            }).then(function (_resp) {
                response = _resp;
                p = _this284.market(market);

                return _this284.parseTicker(response[p['id']], p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this285 = this;

            return Promise.resolve().then(function () {
                return _this285.loadMarkets();
            }).then(function () {
                return _this285.publicGetTrades({
                    'pair': _this285.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                prefix,
                order,
                response,
                _this286 = this,
                _arguments274 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments274.length > 4 && _arguments274[4] !== undefined ? _arguments274[4] : undefined;
                params = _arguments274.length > 5 && _arguments274[5] !== undefined ? _arguments274[5] : {};
                return _this286.loadMarkets();
            }).then(function () {
                prefix = '';

                if (type == 'market') {
                    prefix = 'market_';
                }order = {
                    'pair': _this286.marketId(market),
                    'quantity': amount,
                    'price': price || 0,
                    'type': prefix + side
                };
                return _this286.privatePostOrderCreate(_this286.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this287 = this;

            return Promise.resolve().then(function () {
                return _this287.loadMarkets();
            }).then(function () {
                return _this287.privatePostOrderCancel({ 'order_id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                response,
                _test13,
                _this288 = this,
                _arguments276 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments276.length > 1 && _arguments276[1] !== undefined ? _arguments276[1] : 'public';
                method = _arguments276.length > 2 && _arguments276[2] !== undefined ? _arguments276[2] : 'GET';
                params = _arguments276.length > 3 && _arguments276[3] !== undefined ? _arguments276[3] : {};
                headers = _arguments276.length > 4 && _arguments276[4] !== undefined ? _arguments276[4] : undefined;
                body = _arguments276.length > 5 && _arguments276[5] !== undefined ? _arguments276[5] : undefined;
                url = _this288.urls['api'] + '/' + _this288.version + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this288.urlencode(params);
                    }
                } else {
                    nonce = _this288.nonce();

                    body = _this288.urlencode(_this288.extend({ 'nonce': nonce }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this288.apiKey,
                        'Sign': _this288.hmac(_this288.encode(body), _this288.encode(_this288.secret), 'sha512')
                    };
                }
                return _this288.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test13 = 'result' in response;

                if (_test13 && response['result']) {
                    return response;
                } else {
                    if (_test13) {
                        throw new ExchangeError(_this288.id + ' ' + _this288.json(response));
                    }

                    return response;
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var flowbtc = {

        'id': 'flowbtc',
        'name': 'flowBTC',
        'countries': 'BR', // Brazil
        'version': 'v1',
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28162465-cd815d4c-67cf-11e7-8e57-438bea0523a2.jpg',
            'api': 'https://api.flowbtc.com:8400/ajax',
            'www': 'https://trader.flowbtc.com',
            'doc': 'http://www.flowbtc.com.br/api/'
        },
        'api': {
            'public': {
                'post': ['GetTicker', 'GetTrades', 'GetTradesByDate', 'GetOrderBook', 'GetProductPairs', 'GetProducts']
            },
            'private': {
                'post': ['CreateAccount', 'GetUserInfo', 'SetUserInfo', 'GetAccountInfo', 'GetAccountTrades', 'GetDepositAddresses', 'Withdraw', 'CreateOrder', 'ModifyOrder', 'CancelOrder', 'CancelAllOrders', 'GetAccountOpenOrders', 'GetOrderFee']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var response,
                markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this289 = this;

            return Promise.resolve().then(function () {
                return _this289.publicPostGetProductPairs();
            }).then(function (_resp) {
                response = _resp;
                markets = response['productPairs'];
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['name'];
                    base = market['product1Label'];
                    quote = market['product2Label'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this290 = this;

            return Promise.resolve().then(function () {
                return _this290.loadMarkets();
            }).then(function () {
                return _this290.privatePostGetAccountInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['currencies'];
                result = { 'info': response };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['name'];
                    account = {
                        'free': balance['balance'],
                        'used': balance['hold'],
                        'total': undefined
                    };

                    account['total'] = _this290.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this291 = this,
                _arguments279 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments279.length > 1 && _arguments279[1] !== undefined ? _arguments279[1] : {};
                return _this291.loadMarkets();
            }).then(function () {
                p = _this291.market(market);
                return _this291.publicPostGetOrderBook(_this291.extend({
                    'productPair': p['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this291.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this291.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['px']);
                        amount = parseFloat(order['qty']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                timestamp,
                _this292 = this;

            return Promise.resolve().then(function () {
                return _this292.loadMarkets();
            }).then(function () {
                p = _this292.market(market);
                return _this292.publicPostGetTicker({
                    'productPair': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this292.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this292.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['volume24hr']),
                    'quoteVolume': parseFloat(ticker['volume24hrProduct2']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                _this293 = this,
                _arguments281 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments281.length > 1 && _arguments281[1] !== undefined ? _arguments281[1] : {};
                return _this293.loadMarkets();
            }).then(function () {
                return _this293.publicPostGetTrades(_this293.extend({
                    'ins': _this293.marketId(market)
                }, params));
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                orderType,
                order,
                response,
                _this294 = this,
                _arguments282 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments282.length > 4 && _arguments282[4] !== undefined ? _arguments282[4] : undefined;
                params = _arguments282.length > 5 && _arguments282[5] !== undefined ? _arguments282[5] : {};
                return _this294.loadMarkets();
            }).then(function () {
                orderType = type == 'market' ? 1 : 0;
                order = {
                    'ins': _this294.marketId(market),
                    'side': side,
                    'orderType': orderType,
                    'qty': amount,
                    'px': price
                };
                return _this294.privatePostCreateOrder(_this294.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['serverOrderId']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this295 = this,
                _arguments283 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments283.length > 1 && _arguments283[1] !== undefined ? _arguments283[1] : {};
                return _this295.loadMarkets();
            }).then(function () {
                if ('ins' in params) {
                    return _this295.privatePostCancelOrder(_this295.extend({
                        'serverOrderId': id
                    }, params));
                } else {
                    throw new ExchangeError(_this295.id + ' requires `ins` symbol parameter for cancelling an order');
                }
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                auth,
                signature,
                response,
                _test14,
                _this296 = this,
                _arguments284 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments284.length > 1 && _arguments284[1] !== undefined ? _arguments284[1] : 'public';
                method = _arguments284.length > 2 && _arguments284[2] !== undefined ? _arguments284[2] : 'GET';
                params = _arguments284.length > 3 && _arguments284[3] !== undefined ? _arguments284[3] : {};
                headers = _arguments284.length > 4 && _arguments284[4] !== undefined ? _arguments284[4] : undefined;
                body = _arguments284.length > 5 && _arguments284[5] !== undefined ? _arguments284[5] : undefined;
                url = _this296.urls['api'] + '/' + _this296.version + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        body = _this296.json(params);
                    }
                } else {
                    if (!_this296.uid) {
                        throw new AuthenticationError(_this296.id + ' requires `' + _this296.id + '.uid` property for authentication');
                    }nonce = _this296.nonce();
                    auth = nonce.toString() + _this296.uid + _this296.apiKey;
                    signature = _this296.hmac(_this296.encode(auth), _this296.encode(_this296.secret));

                    body = _this296.json(_this296.extend({
                        'apiKey': _this296.apiKey,
                        'apiNonce': nonce,
                        'apiSig': signature.toUpperCase()
                    }, params));
                    headers = {
                        'Content-Type': 'application/json',
                        'Content-Length': body.length
                    };
                }
                return _this296.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test14 = 'isAccepted' in response;

                if (_test14 && response['isAccepted']) {
                    return response;
                } else {
                    throw new ExchangeError(_this296.id + ' ' + _this296.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var foxbit = extend(blinktrade, {
        'id': 'foxbit',
        'name': 'FoxBit',
        'countries': 'BR',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27991413-11b40d42-647f-11e7-91ee-78ced874dd09.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://foxbit.exchange',
            'doc': 'https://blinktrade.com/docs'
        },
        'comment': 'Blinktrade API',
        'markets': {
            'BTC/BRL': { 'id': 'BTCBRL', 'symbol': 'BTC/BRL', 'base': 'BTC', 'quote': 'BRL', 'brokerId': 4, 'broker': 'FoxBit' }
        }
    });

    //-----------------------------------------------------------------------------

    var fyb = {

        'rateLimit': 1500,
        'api': {
            'public': {
                'get': ['ticker', 'tickerdetailed', 'orderbook', 'trades']
            },
            'private': {
                'post': ['test', 'getaccinfo', 'getpendingorders', 'getorderhistory', 'cancelpendingorder', 'placeorder', 'withdraw']
            }
        },

        fetchBalance: function fetchBalance() {
            var balance,
                btc,
                symbol,
                quote,
                lowercase,
                fiat,
                crypto,
                accounts,
                _this297 = this;

            return Promise.resolve().then(function () {
                return _this297.privatePostGetaccinfo();
            }).then(function (_resp) {
                balance = _resp;
                btc = parseFloat(balance['btcBal']);
                symbol = _this297.symbols[0];
                quote = _this297.markets[symbol]['quote'];
                lowercase = quote.toLowerCase() + 'Bal';
                fiat = parseFloat(balance[lowercase]);
                crypto = {
                    'free': btc,
                    'used': undefined,
                    'total': btc
                };
                accounts = { 'BTC': crypto };

                accounts[quote] = {
                    'free': fiat,
                    'used': undefined,
                    'total': fiat
                };
                accounts['info'] = balance;
                return accounts;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this298 = this,
                _arguments286 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments286.length > 1 && _arguments286[1] !== undefined ? _arguments286[1] : {};
                return _this298.publicGetOrderbook(params);
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this298.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this298.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                last,
                volume,
                _this299 = this;

            return Promise.resolve().then(function () {
                return _this299.publicGetTickerdetailed();
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this299.milliseconds();
                last = undefined;
                volume = undefined;

                if ('last' in ticker) {
                    last = parseFloat(ticker['last']);
                }if ('vol' in ticker) {
                    volume = parseFloat(ticker['vol']);
                }return {
                    'timestamp': timestamp,
                    'datetime': _this299.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': last,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': volume,
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this300 = this;

            return _this300.publicGetTrades();
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this301 = this,
                _arguments289 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments289.length > 4 && _arguments289[4] !== undefined ? _arguments289[4] : undefined;
                params = _arguments289.length > 5 && _arguments289[5] !== undefined ? _arguments289[5] : {};
                return _this301.privatePostPlaceorder(_this301.extend({
                    'qty': amount,
                    'price': price,
                    'type': side[0].toUpperCase()
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['pending_oid']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this302 = this;

            return _this302.privatePostCancelpendingorder({ 'orderNo': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                response,
                _this303 = this,
                _arguments291 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments291.length > 1 && _arguments291[1] !== undefined ? _arguments291[1] : 'public';
                method = _arguments291.length > 2 && _arguments291[2] !== undefined ? _arguments291[2] : 'GET';
                params = _arguments291.length > 3 && _arguments291[3] !== undefined ? _arguments291[3] : {};
                headers = _arguments291.length > 4 && _arguments291[4] !== undefined ? _arguments291[4] : undefined;
                body = _arguments291.length > 5 && _arguments291[5] !== undefined ? _arguments291[5] : undefined;
                url = _this303.urls['api'] + '/' + path;

                if (api == 'public') {
                    url += '.json';
                } else {
                    nonce = _this303.nonce();

                    body = _this303.urlencode(_this303.extend({ 'timestamp': nonce }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'key': _this303.apiKey,
                        'sig': _this303.hmac(_this303.encode(body), _this303.encode(_this303.secret), 'sha1')
                    };
                }
                return _this303.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if (api == 'private') {
                    if ('error' in response) {
                        if (response['error']) {
                            throw new ExchangeError(_this303.id + ' ' + _this303.json(response));
                        }
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var fybse = extend(fyb, {
        'id': 'fybse',
        'name': 'FYB-SE',
        'countries': 'SE', // Sweden
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766512-31019772-5edb-11e7-8241-2e675e6797f1.jpg',
            'api': 'https://www.fybse.se/api/SEK',
            'www': 'https://www.fybse.se',
            'doc': 'http://docs.fyb.apiary.io'
        },
        'markets': {
            'BTC/SEK': { 'id': 'SEK', 'symbol': 'BTC/SEK', 'base': 'BTC', 'quote': 'SEK' }
        }
    });

    //-----------------------------------------------------------------------------

    var fybsg = extend(fyb, {
        'id': 'fybsg',
        'name': 'FYB-SG',
        'countries': 'SG', // Singapore
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766513-3364d56a-5edb-11e7-9e6b-d5898bb89c81.jpg',
            'api': 'https://www.fybsg.com/api/SGD',
            'www': 'https://www.fybsg.com',
            'doc': 'http://docs.fyb.apiary.io'
        },
        'markets': {
            'BTC/SGD': { 'id': 'SGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' }
        }
    });

    //-----------------------------------------------------------------------------

    var gatecoin = {

        'id': 'gatecoin',
        'name': 'Gatecoin',
        'rateLimit': 2000,
        'countries': 'HK', // Hong Kong
        'comment': 'a regulated/licensed exchange',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28646817-508457f2-726c-11e7-9eeb-3528d2413a58.jpg',
            'api': 'https://api.gatecoin.com',
            'www': 'https://gatecoin.com',
            'doc': ['https://gatecoin.com/api', 'https://github.com/Gatecoin/RESTful-API-Implementation', 'https://api.gatecoin.com/swagger-ui/index.html']
        },
        'api': {
            'public': {
                'get': ['Public/ExchangeRate', // Get the exchange rates
                'Public/LiveTicker', // Get live ticker for all currency
                'Public/LiveTicker/{CurrencyPair}', // Get live ticker by currency
                'Public/LiveTickers', // Get live ticker for all currency
                'Public/MarketDepth/{CurrencyPair}', // Gets prices and market depth for the currency pair.
                'Public/NetworkStatistics/{DigiCurrency}', // Get the network status of a specific digital currency
                'Public/StatisticHistory/{DigiCurrency}/{Typeofdata}', // Get the historical data of a specific digital currency
                'Public/TickerHistory/{CurrencyPair}/{Timeframe}', // Get ticker history
                'Public/Transactions/{CurrencyPair}', // Gets recent transactions
                'Public/TransactionsHistory/{CurrencyPair}', // Gets all transactions
                'Reference/BusinessNatureList', // Get the business nature list.
                'Reference/Countries', // Get the country list.
                'Reference/Currencies', // Get the currency list.
                'Reference/CurrencyPairs', // Get the currency pair list.
                'Reference/CurrentStatusList', // Get the current status list.
                'Reference/IdentydocumentTypes', // Get the different types of identity documents possible.
                'Reference/IncomeRangeList', // Get the income range list.
                'Reference/IncomeSourceList', // Get the income source list.
                'Reference/VerificationLevelList', // Get the verif level list.
                'Stream/PublicChannel'],
                'post': ['Export/Transactions', // Request a export of all trades from based on currencypair, start date and end date
                'Ping', // Post a string, then get it back.
                'Public/Unsubscribe/{EmailCode}', // Lets the user unsubscribe from emails
                'RegisterUser']
            },
            'private': {
                'get': ['Account/CorporateData', // Get corporate account data
                'Account/DocumentAddress', // Check if residence proof uploaded
                'Account/DocumentCorporation', // Check if registered document uploaded
                'Account/DocumentID', // Check if ID document copy uploaded
                'Account/DocumentInformation', // Get Step3 Data
                'Account/Email', // Get user email
                'Account/FeeRate', // Get fee rate of logged in user
                'Account/Level', // Get verif level of logged in user
                'Account/PersonalInformation', // Get Step1 Data
                'Account/Phone', // Get user phone number
                'Account/Profile', // Get trader profile
                'Account/Questionnaire', // Fill the questionnaire
                'Account/Referral', // Get referral information
                'Account/ReferralCode', // Get the referral code of the logged in user
                'Account/ReferralNames', // Get names of referred traders
                'Account/ReferralReward', // Get referral reward information
                'Account/ReferredCode', // Get referral code
                'Account/ResidentInformation', // Get Step2 Data
                'Account/SecuritySettings', // Get verif details of logged in user
                'Account/User', // Get all user info
                'APIKey/APIKey', // Get API Key for logged in user
                'Auth/ConnectionHistory', // Gets connection history of logged in user
                'Balance/Balances', // Gets the available balance for each currency for the logged in account.
                'Balance/Balances/{Currency}', // Gets the available balance for s currency for the logged in account.
                'Balance/Deposits', // Get all account deposits, including wire and digital currency, of the logged in user
                'Balance/Withdrawals', // Get all account withdrawals, including wire and digital currency, of the logged in user
                'Bank/Accounts/{Currency}/{Location}', // Get internal bank account for deposit
                'Bank/Transactions', // Get all account transactions of the logged in user
                'Bank/UserAccounts', // Gets all the bank accounts related to the logged in user.
                'Bank/UserAccounts/{Currency}', // Gets all the bank accounts related to the logged in user.
                'ElectronicWallet/DepositWallets', // Gets all crypto currency addresses related deposits to the logged in user.
                'ElectronicWallet/DepositWallets/{DigiCurrency}', // Gets all crypto currency addresses related deposits to the logged in user by currency.
                'ElectronicWallet/Transactions', // Get all digital currency transactions of the logged in user
                'ElectronicWallet/Transactions/{DigiCurrency}', // Get all digital currency transactions of the logged in user
                'ElectronicWallet/UserWallets', // Gets all external digital currency addresses related to the logged in user.
                'ElectronicWallet/UserWallets/{DigiCurrency}', // Gets all external digital currency addresses related to the logged in user by currency.
                'Info/ReferenceCurrency', // Get user's reference currency
                'Info/ReferenceLanguage', // Get user's reference language
                'Notification/Messages', // Get from oldest unread + 3 read message to newest messages
                'Trade/Orders', // Gets open orders for the logged in trader.
                'Trade/Orders/{OrderID}', // Gets an order for the logged in trader.
                'Trade/StopOrders', // Gets all stop orders for the logged in trader. Max 1000 record.
                'Trade/StopOrdersHistory', // Gets all stop orders for the logged in trader. Max 1000 record.
                'Trade/Trades', // Gets all transactions of logged in user
                'Trade/UserTrades'],
                'post': ['Account/DocumentAddress', // Upload address proof document
                'Account/DocumentCorporation', // Upload registered document document
                'Account/DocumentID', // Upload ID document copy
                'Account/Email/RequestVerify', // Request for verification email
                'Account/Email/Verify', // Verification email
                'Account/GoogleAuth', // Enable google auth
                'Account/Level', // Request verif level of logged in user
                'Account/Questionnaire', // Fill the questionnaire
                'Account/Referral', // Post a referral email
                'APIKey/APIKey', // Create a new API key for logged in user
                'Auth/ChangePassword', // Change password.
                'Auth/ForgotPassword', // Request reset password
                'Auth/ForgotUserID', // Request user id
                'Auth/Login', // Trader session log in.
                'Auth/Logout', // Logout from the current session.
                'Auth/LogoutOtherSessions', // Logout other sessions.
                'Auth/ResetPassword', // Reset password
                'Bank/Transactions', // Request a transfer from the traders account of the logged in user. This is only available for bank account
                'Bank/UserAccounts', // Add an account the logged in user
                'ElectronicWallet/DepositWallets/{DigiCurrency}', // Add an digital currency addresses to the logged in user.
                'ElectronicWallet/Transactions/Deposits/{DigiCurrency}', // Get all internal digital currency transactions of the logged in user
                'ElectronicWallet/Transactions/Withdrawals/{DigiCurrency}', // Get all external digital currency transactions of the logged in user
                'ElectronicWallet/UserWallets/{DigiCurrency}', // Add an external digital currency addresses to the logged in user.
                'ElectronicWallet/Withdrawals/{DigiCurrency}', // Request a transfer from the traders account to an external address. This is only available for crypto currencies.
                'Notification/Messages', // Mark all as read
                'Notification/Messages/{ID}', // Mark as read
                'Trade/Orders', // Place an order at the exchange.
                'Trade/StopOrders'],
                'put': ['Account/CorporateData', // Update user company data for corporate account
                'Account/DocumentID', // Update ID document meta data
                'Account/DocumentInformation', // Update Step3 Data
                'Account/Email', // Update user email
                'Account/PersonalInformation', // Update Step1 Data
                'Account/Phone', // Update user phone number
                'Account/Questionnaire', // update the questionnaire
                'Account/ReferredCode', // Update referral code
                'Account/ResidentInformation', // Update Step2 Data
                'Account/SecuritySettings', // Update verif details of logged in user
                'Account/User', // Update all user info
                'Bank/UserAccounts', // Update the label of existing user bank accounnt
                'ElectronicWallet/DepositWallets/{DigiCurrency}/{AddressName}', // Update the name of an address
                'ElectronicWallet/UserWallets/{DigiCurrency}', // Update the name of an external address
                'Info/ReferenceCurrency', // User's reference currency
                'Info/ReferenceLanguage'],
                'delete': ['APIKey/APIKey/{PublicKey}', // Remove an API key
                'Bank/Transactions/{RequestID}', // Delete pending account withdraw of the logged in user
                'Bank/UserAccounts/{Currency}/{Label}', // Delete an account of the logged in user
                'ElectronicWallet/DepositWallets/{DigiCurrency}/{AddressName}', // Delete an digital currency addresses related to the logged in user.
                'ElectronicWallet/UserWallets/{DigiCurrency}/{AddressName}', // Delete an external digital currency addresses related to the logged in user.
                'Trade/Orders', // Cancels all existing order
                'Trade/Orders/{OrderID}', // Cancels an existing order
                'Trade/StopOrders', // Cancels all existing stop orders
                'Trade/StopOrders/{ID}']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var response,
                markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this304 = this;

            return Promise.resolve().then(function () {
                return _this304.publicGetPublicLiveTickers();
            }).then(function (_resp) {
                response = _resp;
                markets = response['tickers'];
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['currencyPair'];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this305 = this;

            return Promise.resolve().then(function () {
                return _this305.loadMarkets();
            }).then(function () {
                return _this305.privateGetBalanceBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balances'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    account = {
                        'free': balance['availableBalance'],
                        'used': _this305.sum(balance['pendingIncoming'], balance['pendingOutgoing'], balance['openOrder']),
                        'total': balance['balance']
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this306 = this,
                _arguments294 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments294.length > 1 && _arguments294[1] !== undefined ? _arguments294[1] : {};
                return _this306.loadMarkets();
            }).then(function () {
                p = _this306.market(market);
                return _this306.publicGetPublicMarketDepthCurrencyPair(_this306.extend({
                    'CurrencyPair': p['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this306.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this306.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['volume']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = parseInt(ticker['createDateTime']) * 1000;
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': parseFloat(ticker['vwap']),
                'open': parseFloat(ticker['open']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                result,
                t,
                ticker,
                id,
                market,
                symbol,
                _this307 = this;

            return Promise.resolve().then(function () {
                return _this307.loadMarkets();
            }).then(function () {
                return _this307.publicGetPublicLiveTickers();
            }).then(function (_resp) {
                response = _resp;
                tickers = response['tickers'];
                result = {};

                for (t = 0; t < tickers.length; t++) {
                    ticker = tickers[t];
                    id = ticker['currencyPair'];
                    market = _this307.markets_by_id[id];
                    symbol = market['symbol'];

                    result[symbol] = _this307.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                response,
                ticker,
                _this308 = this;

            return Promise.resolve().then(function () {
                return _this308.loadMarkets();
            }).then(function () {
                p = _this308.market(market);
                return _this308.publicGetPublicLiveTickerCurrencyPair({
                    'CurrencyPair': p['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];

                return _this308.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this309 = this;

            return Promise.resolve().then(function () {
                return _this309.loadMarkets();
            }).then(function () {
                return _this309.publicGetPublicTransactionsCurrencyPair({
                    'CurrencyPair': _this309.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this310 = this,
                _arguments298 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments298.length > 4 && _arguments298[4] !== undefined ? _arguments298[4] : undefined;
                params = _arguments298.length > 5 && _arguments298[5] !== undefined ? _arguments298[5] : {};
                return _this310.loadMarkets();
            }).then(function () {
                order = {
                    'Code': _this310.marketId(market),
                    'Way': side == 'buy' ? 'Bid' : 'Ask',
                    'Amount': amount
                };

                if (type == 'limit') {
                    order['Price'] = price;
                }if (_this310.twofa) {
                    if ('ValidationCode' in params) {
                        order['ValidationCode'] = params['ValidationCode'];
                    } else {
                        throw new AuthenticationError(_this310.id + ' two-factor authentication requires a missing ValidationCode parameter');
                    }
                }
                return _this310.privatePostTradeOrders(_this310.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['clOrderId']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this311 = this;

            return Promise.resolve().then(function () {
                return _this311.loadMarkets();
            }).then(function () {
                return _this311.privateDeleteTradeOrdersOrderID({ 'OrderID': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                contentType,
                auth,
                signature,
                response,
                _test15,
                _test16,
                _this312 = this,
                _arguments300 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments300.length > 1 && _arguments300[1] !== undefined ? _arguments300[1] : 'public';
                method = _arguments300.length > 2 && _arguments300[2] !== undefined ? _arguments300[2] : 'GET';
                params = _arguments300.length > 3 && _arguments300[3] !== undefined ? _arguments300[3] : {};
                headers = _arguments300.length > 4 && _arguments300[4] !== undefined ? _arguments300[4] : undefined;
                body = _arguments300.length > 5 && _arguments300[5] !== undefined ? _arguments300[5] : undefined;
                url = _this312.urls['api'] + '/' + _this312.implodeParams(path, params);
                query = _this312.omit(params, _this312.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this312.urlencode(query);
                    }
                } else {
                    nonce = _this312.nonce();
                    contentType = method == 'GET' ? '' : 'application/json';
                    auth = method + url + contentType + nonce.toString();

                    auth = auth.toLowerCase();
                    signature = _this312.hmac(_this312.encode(auth), _this312.encode(_this312.secret), 'sha256', 'base64');

                    headers = {
                        'API_PUBLIC_KEY': _this312.apiKey,
                        'API_REQUEST_SIGNATURE': signature,
                        'API_REQUEST_DATE': nonce
                    };
                    if (method != 'GET') {
                        headers['Content-Type'] = contentType;
                        body = _this312.json(_this312.extend({ 'nonce': nonce }, params));
                    }
                }
                return _this312.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                _test15 = 'responseStatus' in response;
                _test16 = _test15 && 'message' in response['responseStatus'];

                if (_test16 && response['responseStatus']['message'] == 'OK') {
                    return response;
                } else {
                    throw new ExchangeError(_this312.id + ' ' + _this312.json(response));
                }
            });
        }
    };

    //-----------------------------------------------------------------------------

    var gdax = {
        'id': 'gdax',
        'name': 'GDAX',
        'countries': 'US',
        'rateLimit': 1000,
        'urls': {
            'test': 'https://api-public.sandbox.gdax.com',
            'logo': 'https://user-images.githubusercontent.com/1294454/27766527-b1be41c6-5edb-11e7-95f6-5b496c469e2c.jpg',
            'api': 'https://api.gdax.com',
            'www': 'https://www.gdax.com',
            'doc': 'https://docs.gdax.com'
        },
        'api': {
            'public': {
                'get': ['currencies', 'products', 'products/{id}/book', 'products/{id}/candles', 'products/{id}/stats', 'products/{id}/ticker', 'products/{id}/trades', 'time']
            },
            'private': {
                'get': ['accounts', 'accounts/{id}', 'accounts/{id}/holds', 'accounts/{id}/ledger', 'coinbase-accounts', 'fills', 'funding', 'orders', 'orders/{id}', 'payment-methods', 'position', 'reports/{id}', 'users/self/trailing-volume'],
                'post': ['deposits/coinbase-account', 'deposits/payment-method', 'funding/repay', 'orders', 'position/close', 'profiles/margin-transfer', 'reports', 'withdrawals/coinbase', 'withdrawals/crypto', 'withdrawals/payment-method'],
                'delete': ['orders', 'orders/{id}']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this313 = this;

            return Promise.resolve().then(function () {
                return _this313.publicGetProducts();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['id'];
                    base = market['base_currency'];
                    quote = market['quote_currency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var balances,
                result,
                b,
                balance,
                currency,
                account,
                _this314 = this;

            return Promise.resolve().then(function () {
                return _this314.loadMarkets();
            }).then(function () {
                return _this314.privateGetAccounts();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    account = {
                        'free': parseFloat(balance['available']),
                        'used': parseFloat(balance['hold']),
                        'total': parseFloat(balance['balance'])
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this315 = this,
                _arguments303 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments303.length > 1 && _arguments303[1] !== undefined ? _arguments303[1] : {};
                return _this315.loadMarkets();
            }).then(function () {
                return _this315.publicGetProductsIdBook(_this315.extend({
                    'id': _this315.marketId(market),
                    'level': 2 // 1 best bidask, 2 aggregated, 3 full
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this315.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this315.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                quote,
                timestamp,
                bid,
                ask,
                _this316 = this;

            return Promise.resolve().then(function () {
                return _this316.loadMarkets();
            }).then(function () {
                p = _this316.market(market);
                return _this316.publicGetProductsIdTicker({
                    'id': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;
                return _this316.publicGetProductsIdStats({
                    'id': p['id']
                });
            }).then(function (_resp) {
                quote = _resp;
                timestamp = _this316.parse8601(ticker['time']);
                bid = undefined;
                ask = undefined;

                if ('bid' in ticker) {
                    bid = parseFloat(ticker['bid']);
                }if ('ask' in ticker) {
                    ask = parseFloat(ticker['ask']);
                }return {
                    'timestamp': timestamp,
                    'datetime': _this316.iso8601(timestamp),
                    'high': parseFloat(quote['high']),
                    'low': parseFloat(quote['low']),
                    'bid': bid,
                    'ask': ask,
                    'vwap': undefined,
                    'open': parseFloat(quote['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(quote['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        parseTrade: function parseTrade(trade, market) {
            var timestamp = this.parse8601(['time']);
            var type = undefined;
            return {
                'id': trade['trade_id'].toString(),
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': undefined,
                'side': trade['side'],
                'price': parseFloat(trade['price']),
                'amount': parseFloat(trade['size'])
            };
        },
        fetchTrades: function fetchTrades(market) {
            var _this317 = this;

            return Promise.resolve().then(function () {
                return _this317.loadMarkets();
            }).then(function () {
                return _this317.publicGetProductsIdTrades({
                    'id': _this317.marketId(market) // fixes issue #2
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                oid,
                order,
                response,
                _this318 = this,
                _arguments306 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments306.length > 4 && _arguments306[4] !== undefined ? _arguments306[4] : undefined;
                params = _arguments306.length > 5 && _arguments306[5] !== undefined ? _arguments306[5] : {};
                return _this318.loadMarkets();
            }).then(function () {
                oid = _this318.nonce().toString();
                order = {
                    'product_id': _this318.marketId(market),
                    'side': side,
                    'size': amount,
                    'type': type
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this318.privatePostOrders(_this318.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this319 = this;

            return Promise.resolve().then(function () {
                return _this319.loadMarkets();
            }).then(function () {
                return _this319.privateDeleteOrdersId({ 'id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                url,
                query,
                nonce,
                what,
                secret,
                signature,
                response,
                _this320 = this,
                _arguments308 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments308.length > 1 && _arguments308[1] !== undefined ? _arguments308[1] : 'public';
                method = _arguments308.length > 2 && _arguments308[2] !== undefined ? _arguments308[2] : 'GET';
                params = _arguments308.length > 3 && _arguments308[3] !== undefined ? _arguments308[3] : {};
                headers = _arguments308.length > 4 && _arguments308[4] !== undefined ? _arguments308[4] : undefined;
                body = _arguments308.length > 5 && _arguments308[5] !== undefined ? _arguments308[5] : undefined;
                request = '/' + _this320.implodeParams(path, params);
                url = _this320.urls['api'] + request;
                query = _this320.omit(params, _this320.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this320.urlencode(query);
                    }
                } else {
                    if (!_this320.apiKey) {
                        throw new AuthenticationError(_this320.id + ' requires apiKey property for authentication and trading');
                    }if (!_this320.secret) {
                        throw new AuthenticationError(_this320.id + ' requires secret property for authentication and trading');
                    }if (!_this320.password) {
                        throw new AuthenticationError(_this320.id + ' requires password property for authentication and trading');
                    }nonce = _this320.nonce().toString();

                    if (Object.keys(query).length) {
                        body = _this320.json(query);
                    }what = nonce + method + request + (body || '');
                    secret = _this320.base64ToBinary(_this320.secret);
                    signature = _this320.hmac(_this320.encode(what), secret, 'sha256', 'base64');

                    headers = {
                        'CB-ACCESS-KEY': _this320.apiKey,
                        'CB-ACCESS-SIGN': signature,
                        'CB-ACCESS-TIMESTAMP': nonce,
                        'CB-ACCESS-PASSPHRASE': _this320.password,
                        'Content-Type': 'application/json'
                    };
                }
                return _this320.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('message' in response) {
                    throw new ExchangeError(_this320.id + ' ' + _this320.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var gemini = {
        'id': 'gemini',
        'name': 'Gemini',
        'countries': 'US',
        'rateLimit': 1500, // 200 for private API
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27816857-ce7be644-6096-11e7-82d6-3c257263229c.jpg',
            'api': 'https://api.gemini.com',
            'www': 'https://gemini.com',
            'doc': 'https://docs.gemini.com/rest-api'
        },
        'api': {
            'public': {
                'get': ['symbols', 'pubticker/{symbol}', 'book/{symbol}', 'trades/{symbol}', 'auction/{symbol}', 'auction/{symbol}/history']
            },
            'private': {
                'post': ['order/new', 'order/cancel', 'order/cancel/session', 'order/cancel/all', 'order/status', 'orders', 'mytrades', 'tradevolume', 'balances', 'deposit/{currency}/newAddress', 'withdraw/{currency}', 'heartbeat']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                id,
                market,
                uppercase,
                base,
                quote,
                symbol,
                _this321 = this;

            return Promise.resolve().then(function () {
                return _this321.publicGetSymbols();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    id = markets[p];
                    market = id;
                    uppercase = market.toUpperCase();
                    base = uppercase.slice(0, 3);
                    quote = uppercase.slice(3, 6);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _timestamp4,
                _this322 = this,
                _arguments310 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments310.length > 1 && _arguments310[1] !== undefined ? _arguments310[1] : {};
                return _this322.loadMarkets();
            }).then(function () {
                return _this322.publicGetBookSymbol(_this322.extend({
                    'symbol': _this322.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this322.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this322.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['amount']);
                        _timestamp4 = parseInt(order['timestamp']) * 1000;

                        result[side].push([price, amount, _timestamp4]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                timestamp,
                baseVolume,
                quoteVolume,
                _this323 = this;

            return Promise.resolve().then(function () {
                return _this323.loadMarkets();
            }).then(function () {
                p = _this323.market(market);
                return _this323.publicGetPubtickerSymbol({
                    'symbol': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['volume']['timestamp'];
                baseVolume = p['base'];
                quoteVolume = p['quote'];

                return {
                    'timestamp': timestamp,
                    'datetime': _this323.iso8601(timestamp),
                    'high': undefined,
                    'low': undefined,
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['volume'][baseVolume]),
                    'quoteVolume': parseFloat(ticker['volume'][quoteVolume]),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this324 = this;

            return Promise.resolve().then(function () {
                return _this324.loadMarkets();
            }).then(function () {
                return _this324.publicGetTradesSymbol({
                    'symbol': _this324.marketId(market)
                });
            });
        },
        fetchBalance: function fetchBalance() {
            var balances,
                result,
                b,
                balance,
                currency,
                account,
                _this325 = this;

            return Promise.resolve().then(function () {
                return _this325.loadMarkets();
            }).then(function () {
                return _this325.privatePostBalances();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    account = {
                        'free': parseFloat(balance['available']),
                        'used': undefined,
                        'total': parseFloat(balance['amount'])
                    };

                    account['used'] = account['total'] - account['free'];
                    result[currency] = account;
                }
                return result;
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this326 = this,
                _arguments314 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments314.length > 4 && _arguments314[4] !== undefined ? _arguments314[4] : undefined;
                params = _arguments314.length > 5 && _arguments314[5] !== undefined ? _arguments314[5] : {};
                return _this326.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this326.id + ' allows limit orders only');
                }order = {
                    'client_order_id': _this326.nonce(),
                    'symbol': _this326.marketId(market),
                    'amount': amount.toString(),
                    'price': price.toString(),
                    'side': side,
                    'type': 'exchange limit' // gemini allows limit orders only
                };
                return _this326.privatePostOrderNew(_this326.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this327 = this;

            return Promise.resolve().then(function () {
                return _this327.loadMarkets();
            }).then(function () {
                return _this327.privatePostCancelOrder({ 'order_id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                request,
                payload,
                signature,
                response,
                _this328 = this,
                _arguments316 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments316.length > 1 && _arguments316[1] !== undefined ? _arguments316[1] : 'public';
                method = _arguments316.length > 2 && _arguments316[2] !== undefined ? _arguments316[2] : 'GET';
                params = _arguments316.length > 3 && _arguments316[3] !== undefined ? _arguments316[3] : {};
                headers = _arguments316.length > 4 && _arguments316[4] !== undefined ? _arguments316[4] : undefined;
                body = _arguments316.length > 5 && _arguments316[5] !== undefined ? _arguments316[5] : undefined;
                url = '/' + _this328.version + '/' + _this328.implodeParams(path, params);
                query = _this328.omit(params, _this328.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this328.urlencode(query);
                    }
                } else {
                    nonce = _this328.nonce();
                    request = _this328.extend({
                        'request': url,
                        'nonce': nonce
                    }, query);
                    payload = _this328.json(request);

                    payload = _this328.stringToBase64(_this328.encode(payload));
                    signature = _this328.hmac(payload, _this328.encode(_this328.secret), 'sha384');

                    headers = {
                        'Content-Type': 'text/plain',
                        'Content-Length': 0,
                        'X-GEMINI-APIKEY': _this328.apiKey,
                        'X-GEMINI-PAYLOAD': payload,
                        'X-GEMINI-SIGNATURE': signature
                    };
                }
                url = _this328.urls['api'] + url;
                return _this328.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('result' in response) {
                    if (response['result'] == 'error') {
                        throw new ExchangeError(_this328.id + ' ' + _this328.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var hitbtc = {

        'id': 'hitbtc',
        'name': 'HitBTC',
        'countries': 'HK', // Hong Kong
        'rateLimit': 1500,
        'version': '1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766555-8eaec20e-5edc-11e7-9c5b-6dc69fc42f5e.jpg',
            'api': 'http://api.hitbtc.com',
            'www': 'https://hitbtc.com',
            'doc': ['https://hitbtc.com/api', 'http://hitbtc-com.github.io/hitbtc-api', 'http://jsfiddle.net/bmknight/RqbYB']
        },
        'api': {
            'public': {
                'get': ['{symbol}/orderbook', '{symbol}/ticker', '{symbol}/trades', '{symbol}/trades/recent', 'symbols', 'ticker', 'time,']
            },
            'trading': {
                'get': ['balance', 'orders/active', 'orders/recent', 'order', 'trades/by/order', 'trades'],
                'post': ['new_order', 'cancel_order', 'cancel_orders']
            },
            'payment': {
                'get': ['balance', 'address/{currency}', 'transactions', 'transactions/{transaction}'],
                'post': ['transfer_to_trading', 'transfer_to_main', 'address/{currency}', 'payout']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                lot,
                step,
                symbol,
                _this329 = this;

            return Promise.resolve().then(function () {
                return _this329.publicGetSymbols();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['symbols'].length; p++) {
                    market = markets['symbols'][p];
                    id = market['symbol'];
                    base = market['commodity'];
                    quote = market['currency'];
                    lot = parseFloat(market['lot']);
                    step = parseFloat(market['step']);

                    base = _this329.commonCurrencyCode(base);
                    quote = _this329.commonCurrencyCode(quote);
                    // looks like they now have it correct
                    // if (base == 'DSH')
                    //     base = 'DASH';
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'lot': lot,
                        'step': step,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this330 = this;

            return Promise.resolve().then(function () {
                return _this330.loadMarkets();
            }).then(function () {
                return _this330.tradingGetBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balance'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency_code'];
                    account = {
                        'free': parseFloat(balance['cash']),
                        'used': parseFloat(balance['reserved']),
                        'total': undefined
                    };

                    account['total'] = _this330.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this331 = this,
                _arguments319 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments319.length > 1 && _arguments319[1] !== undefined ? _arguments319[1] : {};
                return _this331.loadMarkets();
            }).then(function () {
                return _this331.publicGetSymbolOrderbook(_this331.extend({
                    'symbol': _this331.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this331.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this331.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['timestamp'];
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': parseFloat(ticker['open']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['volume']),
                'quoteVolume': parseFloat(ticker['volume_quote']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this332 = this;

            return Promise.resolve().then(function () {
                return _this332.loadMarkets();
            }).then(function () {
                return _this332.publicGetTicker();
            }).then(function (_resp) {
                tickers = _resp;
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this332.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this332.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this333 = this;

            return Promise.resolve().then(function () {
                return _this333.loadMarkets();
            }).then(function () {
                p = _this333.market(market);
                return _this333.publicGetSymbolTicker({
                    'symbol': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                if ('message' in ticker) {
                    throw new ExchangeError(_this333.id + ' ' + ticker['message']);
                }return _this333.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this334 = this;

            return Promise.resolve().then(function () {
                return _this334.loadMarkets();
            }).then(function () {
                return _this334.publicGetSymbolTrades({
                    'symbol': _this334.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                quantity,
                wholeLots,
                difference,
                order,
                response,
                _this335 = this,
                _arguments323 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments323.length > 4 && _arguments323[4] !== undefined ? _arguments323[4] : undefined;
                params = _arguments323.length > 5 && _arguments323[5] !== undefined ? _arguments323[5] : {};
                return _this335.loadMarkets();
            }).then(function () {
                p = _this335.market(market);
                // check if amount can be evenly divided into lots
                // they want integer quantity in lot units

                quantity = parseFloat(amount) / p['lot'];
                wholeLots = Math.round(quantity);
                difference = quantity - wholeLots;

                if (Math.abs(difference) > p['step']) {
                    throw new ExchangeError(_this335.id + ' order amount should be evenly divisible by lot unit size of ' + p['lot'].toString());
                }order = {
                    'clientOrderId': _this335.nonce(),
                    'symbol': p['id'],
                    'side': side,
                    'quantity': wholeLots.toString(), // quantity in integer lot units
                    'type': type
                };

                if (type == 'limit') {
                    order['price'] = _this335.decimal(price);
                }return _this335.tradingPostNewOrder(_this335.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['ExecutionReport']['orderId']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this336 = this;

            return Promise.resolve().then(function () {
                return _this336.loadMarkets();
            }).then(function () {
                return _this336.tradingPostCancelOrder({ 'clientOrderId': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                auth,
                response,
                _this337 = this,
                _arguments325 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments325.length > 1 && _arguments325[1] !== undefined ? _arguments325[1] : 'public';
                method = _arguments325.length > 2 && _arguments325[2] !== undefined ? _arguments325[2] : 'GET';
                params = _arguments325.length > 3 && _arguments325[3] !== undefined ? _arguments325[3] : {};
                headers = _arguments325.length > 4 && _arguments325[4] !== undefined ? _arguments325[4] : undefined;
                body = _arguments325.length > 5 && _arguments325[5] !== undefined ? _arguments325[5] : undefined;
                url = '/' + 'api' + '/' + _this337.version + '/' + api + '/' + _this337.implodeParams(path, params);
                query = _this337.omit(params, _this337.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this337.urlencode(query);
                    }
                } else {
                    nonce = _this337.nonce();

                    query = _this337.extend({ 'nonce': nonce, 'apikey': _this337.apiKey }, query);
                    if (method == 'POST') {
                        if (Object.keys(query).length) {
                            body = _this337.urlencode(query);
                        }
                    }if (Object.keys(query).length) {
                        url += '?' + _this337.urlencode(query);
                    }auth = url + (body || '');

                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Signature': _this337.hmac(_this337.encode(auth), _this337.encode(_this337.secret), 'sha512').toLowerCase()
                    };
                }
                url = _this337.urls['api'] + url;
                return _this337.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('code' in response) {
                    throw new ExchangeError(_this337.id + ' ' + _this337.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var huobi = {

        'id': 'huobi',
        'name': 'Huobi',
        'countries': 'CN',
        'rateLimit': 2000,
        'version': 'v3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766569-15aa7b9a-5edd-11e7-9e7f-44791f4ee49c.jpg',
            'api': 'http://api.huobi.com',
            'www': 'https://www.huobi.com',
            'doc': 'https://github.com/huobiapi/API_Docs_en/wiki'
        },
        'api': {
            'staticmarket': {
                'get': ['{id}_kline_{period}', 'ticker_{id}', 'depth_{id}', 'depth_{id}_{length}', 'detail_{id}']
            },
            'usdmarket': {
                'get': ['{id}_kline_{period}', 'ticker_{id}', 'depth_{id}', 'depth_{id}_{length}', 'detail_{id}']
            },
            'trade': {
                'post': ['get_account_info', 'get_orders', 'order_info', 'buy', 'sell', 'buy_market', 'sell_market', 'cancel_order', 'get_new_deal_orders', 'get_order_id_by_trade_id', 'withdraw_coin', 'cancel_withdraw_coin', 'get_withdraw_coin_result', 'transfer', 'loan', 'repayment', 'get_loan_available', 'get_loans']
            }
        },
        'markets': {
            'BTC/CNY': { 'id': 'btc', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY', 'type': 'staticmarket', 'coinType': 1 },
            'LTC/CNY': { 'id': 'ltc', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY', 'type': 'staticmarket', 'coinType': 2 },
            'BTC/USD': { 'id': 'btc', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD', 'type': 'usdmarket', 'coinType': 1 }
        },

        fetchBalance: function fetchBalance() {
            var balances,
                result,
                c,
                currency,
                lowercase,
                account,
                available,
                frozen,
                loan,
                _this338 = this;

            return Promise.resolve().then(function () {
                return _this338.tradePostGetAccountInfo();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this338.currencies.length; c++) {
                    currency = _this338.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };
                    available = 'available_' + lowercase + '_display';
                    frozen = 'frozen_' + lowercase + '_display';
                    loan = 'loan_' + lowercase + '_display';

                    if (available in balances) {
                        account['free'] = parseFloat(balances[available]);
                    }if (frozen in balances) {
                        account['used'] = parseFloat(balances[frozen]);
                    }if (loan in balances) {
                        account['used'] = _this338.sum(account['used'], parseFloat(balances[loan]));
                    }account['total'] = _this338.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                method,
                orderbook,
                timestamp,
                result,
                _this339 = this,
                _arguments327 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments327.length > 1 && _arguments327[1] !== undefined ? _arguments327[1] : {};
                p = _this339.market(market);
                method = p['type'] + 'GetDepthId';
                return _this339[method](_this339.extend({ 'id': p['id'] }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this339.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this339.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                method,
                response,
                ticker,
                timestamp,
                _this340 = this;

            return Promise.resolve().then(function () {
                p = _this340.market(market);
                method = p['type'] + 'GetTickerId';
                return _this340[method]({ 'id': p['id'] });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = parseInt(response['time']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this340.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var p,
                method,
                _this341 = this;

            p = _this341.market(market);
            method = p['type'] + 'GetDetailId';

            return _this341[method]({ 'id': p['id'] });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                method,
                order,
                response,
                _this342 = this,
                _arguments330 = arguments;

            price = _arguments330.length > 4 && _arguments330[4] !== undefined ? _arguments330[4] : undefined;
            params = _arguments330.length > 5 && _arguments330[5] !== undefined ? _arguments330[5] : {};
            p = _this342.market(market);
            method = 'tradePost' + _this342.capitalize(side);
            order = {
                'coin_type': p['coinType'],
                'amount': amount,
                'market': p['quote'].toLowerCase()
            };

            if (type == 'limit') {
                order['price'] = price;
            } else {
                method += _this342.capitalize(type);
            }response = _this342[method](_this342.extend(order, params));

            return {
                'info': response,
                'id': response['id']
            };
        },
        cancelOrder: function cancelOrder(id) {
            var _this343 = this;

            return _this343.tradePostCancelOrder({ 'id': id });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                queryString,
                _query,
                response,
                _this344 = this,
                _arguments332 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments332.length > 1 && _arguments332[1] !== undefined ? _arguments332[1] : 'trade';
                method = _arguments332.length > 2 && _arguments332[2] !== undefined ? _arguments332[2] : 'GET';
                params = _arguments332.length > 3 && _arguments332[3] !== undefined ? _arguments332[3] : {};
                headers = _arguments332.length > 4 && _arguments332[4] !== undefined ? _arguments332[4] : undefined;
                body = _arguments332.length > 5 && _arguments332[5] !== undefined ? _arguments332[5] : undefined;
                url = _this344.urls['api'];

                if (api == 'trade') {
                    url += '/api' + _this344.version;
                    query = _this344.keysort(_this344.extend({
                        'method': path,
                        'access_key': _this344.apiKey,
                        'created': _this344.nonce()
                    }, params));
                    queryString = _this344.urlencode(_this344.omit(query, 'market'));
                    // secret key must be at the end of query to be signed

                    queryString += '&secret_key=' + _this344.secret;
                    query['sign'] = _this344.hash(_this344.encode(queryString));
                    body = _this344.urlencode(query);
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length
                    };
                } else {
                    url += '/' + api + '/' + _this344.implodeParams(path, params) + '_json.js';
                    _query = _this344.omit(params, _this344.extractParams(path));

                    if (Object.keys(_query).length) {
                        url += '?' + _this344.urlencode(_query);
                    }
                }
                return _this344.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('status' in response) {
                    if (response['status'] == 'error') {
                        throw new ExchangeError(_this344.id + ' ' + _this344.json(response));
                    }
                }if ('code' in response) {
                    throw new ExchangeError(_this344.id + ' ' + _this344.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var itbit = {

        'id': 'itbit',
        'name': 'itBit',
        'countries': 'US',
        'rateLimit': 2000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27822159-66153620-60ad-11e7-89e7-005f6d7f3de0.jpg',
            'api': 'https://api.itbit.com',
            'www': 'https://www.itbit.com',
            'doc': ['https://api.itbit.com/docs', 'https://www.itbit.com/api']
        },
        'api': {
            'public': {
                'get': ['markets/{symbol}/ticker', 'markets/{symbol}/order_book', 'markets/{symbol}/trades']
            },
            'private': {
                'get': ['wallets', 'wallets/{walletId}', 'wallets/{walletId}/balances/{currencyCode}', 'wallets/{walletId}/funding_history', 'wallets/{walletId}/trades', 'wallets/{walletId}/orders/{id}'],
                'post': ['wallet_transfers', 'wallets', 'wallets/{walletId}/cryptocurrency_deposits', 'wallets/{walletId}/cryptocurrency_withdrawals', 'wallets/{walletId}/orders', 'wire_withdrawal'],
                'delete': ['wallets/{walletId}/orders/{id}']
            }
        },
        'markets': {
            'BTC/USD': { 'id': 'XBTUSD', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'BTC/SGD': { 'id': 'XBTSGD', 'symbol': 'BTC/SGD', 'base': 'BTC', 'quote': 'SGD' },
            'BTC/EUR': { 'id': 'XBTEUR', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
        },

        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this345 = this,
                _arguments333 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments333.length > 1 && _arguments333[1] !== undefined ? _arguments333[1] : {};
                return _this345.publicGetMarketsSymbolOrderBook(_this345.extend({
                    'symbol': _this345.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this345.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this345.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                bid,
                ask,
                _this346 = this;

            return Promise.resolve().then(function () {
                return _this346.publicGetMarketsSymbolTicker({
                    'symbol': _this346.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this346.parse8601(ticker['serverTimeUTC']);
                bid = undefined;
                ask = undefined;

                if ('bid' in ticker) {
                    if (ticker['bid']) {
                        bid = parseFloat(ticker['bid']);
                    }
                }if ('ask' in ticker) {
                    if (ticker['ask']) {
                        ask = parseFloat(ticker['ask']);
                    }
                }return {
                    'timestamp': timestamp,
                    'datetime': _this346.iso8601(timestamp),
                    'high': parseFloat(ticker['high24h']),
                    'low': parseFloat(ticker['low24h']),
                    'bid': bid,
                    'ask': ask,
                    'vwap': parseFloat(ticker['vwap24h']),
                    'open': parseFloat(ticker['openToday']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['lastPrice']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume24h']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this347 = this;

            return _this347.publicGetMarketsSymbolTrades({
                'symbol': _this347.marketId(market)
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                b,
                balance,
                currency,
                account,
                _this348 = this;

            return Promise.resolve().then(function () {
                return _this348.privateGetBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balances'];
                result = { 'info': response };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    account = {
                        'free': parseFloat(balance['availableBalance']),
                        'used': undefined,
                        'total': parseFloat(balance['totalBalance'])
                    };

                    account['used'] = account['total'] - account['free'];
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchWallets: function fetchWallets() {
            return this.privateGetWallets();
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                order,
                response,
                _this349 = this,
                _arguments337 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments337.length > 4 && _arguments337[4] !== undefined ? _arguments337[4] : undefined;
                params = _arguments337.length > 5 && _arguments337[5] !== undefined ? _arguments337[5] : {};

                if (type == 'market') {
                    throw new ExchangeError(_this349.id + ' allows limit orders only');
                }amount = amount.toString();
                price = price.toString();
                p = _this349.market(market);
                order = {
                    'side': side,
                    'type': type,
                    'currency': p['base'],
                    'amount': amount,
                    'display': amount,
                    'price': price,
                    'instrument': p['id']
                };
                return _this349.privatePostTradeAdd(_this349.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this350 = this,
                _arguments338 = arguments;

            params = _arguments338.length > 1 && _arguments338[1] !== undefined ? _arguments338[1] : {};

            return _this350.privateDeleteWalletsWalletIdOrdersId(_this350.extend({
                'id': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                timestamp,
                auth,
                message,
                _hash,
                binhash,
                signature,
                response,
                _this351 = this,
                _arguments339 = arguments;

            api = _arguments339.length > 1 && _arguments339[1] !== undefined ? _arguments339[1] : 'public';
            method = _arguments339.length > 2 && _arguments339[2] !== undefined ? _arguments339[2] : 'GET';
            params = _arguments339.length > 3 && _arguments339[3] !== undefined ? _arguments339[3] : {};
            headers = _arguments339.length > 4 && _arguments339[4] !== undefined ? _arguments339[4] : undefined;
            body = _arguments339.length > 5 && _arguments339[5] !== undefined ? _arguments339[5] : undefined;
            url = _this351.urls['api'] + '/' + _this351.version + '/' + _this351.implodeParams(path, params);
            query = _this351.omit(params, _this351.extractParams(path));

            if (api == 'public') {
                if (Object.keys(query).length) {
                    url += '?' + _this351.urlencode(query);
                }
            } else {
                if (Object.keys(query).length) {
                    body = _this351.json(query);
                } else {
                    body = '';
                }nonce = _this351.nonce().toString();
                timestamp = nonce;
                auth = [method, url, body, nonce, timestamp];
                message = nonce + _this351.json(auth);
                _hash = _this351.hash(_this351.encode(message), 'sha256', 'binary');
                binhash = _this351.binaryConcat(url, _hash);
                signature = _this351.hmac(binhash, _this351.encode(_this351.secret), 'sha512', 'base64');

                headers = {
                    'Authorization': self.apiKey + ':' + signature,
                    'Content-Type': 'application/json',
                    'X-Auth-Timestamp': timestamp,
                    'X-Auth-Nonce': nonce
                };
            }
            response = _this351.fetch(url, method, headers, body);

            if ('code' in response) {
                throw new ExchangeError(_this351.id + ' ' + _this351.json(response));
            }return response;
        }
    };

    //-----------------------------------------------------------------------------

    var jubi = {

        'id': 'jubi',
        'name': 'jubi.com',
        'countries': 'CN',
        'rateLimit': 1500,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766581-9d397d9a-5edd-11e7-8fb9-5d8236c0e692.jpg',
            'api': 'https://www.jubi.com/api',
            'www': 'https://www.jubi.com',
            'doc': 'https://www.jubi.com/help/api.html'
        },
        'api': {
            'public': {
                'get': ['depth', 'orders', 'ticker', 'allticker']
            },
            'private': {
                'post': ['balance', 'trade_add', 'trade_cancel', 'trade_list', 'trade_view', 'wallet']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                id,
                base,
                quote,
                symbol,
                _this352 = this;

            return Promise.resolve().then(function () {
                return _this352.publicGetAllticker();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    base = id.toUpperCase();
                    quote = 'CNY';
                    symbol = base + '/' + quote;

                    base = _this352.commonCurrencyCode(base);
                    quote = _this352.commonCurrencyCode(quote);
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': id
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var balances,
                result,
                c,
                currency,
                lowercase,
                account,
                free,
                used,
                _this353 = this;

            return Promise.resolve().then(function () {
                return _this353.loadMarkets();
            }).then(function () {
                return _this353.privatePostBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this353.currencies.length; c++) {
                    currency = _this353.currencies[c];
                    lowercase = currency.toLowerCase();

                    if (lowercase == 'dash') {
                        lowercase = 'drk';
                    }account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };
                    free = lowercase + '_balance';
                    used = lowercase + '_lock';

                    if (free in balances) {
                        account['free'] = parseFloat(balances[free]);
                    }if (used in balances) {
                        account['used'] = parseFloat(balances[used]);
                    }account['total'] = _this353.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this354 = this,
                _arguments342 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments342.length > 1 && _arguments342[1] !== undefined ? _arguments342[1] : {};
                return _this354.loadMarkets();
            }).then(function () {
                return _this354.publicGetDepth(_this354.extend({
                    'coin': _this354.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this354.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this354.iso8601(timestamp)
                };

                result['asks'] = _this354.sortBy(result['asks'], 0);
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['vol']),
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this355 = this;

            return Promise.resolve().then(function () {
                return _this355.loadMarkets();
            }).then(function () {
                return _this355.publicGetAllticker();
            }).then(function (_resp) {
                tickers = _resp;
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this355.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this355.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this356 = this;

            return Promise.resolve().then(function () {
                return _this356.loadMarkets();
            }).then(function () {
                p = _this356.market(market);
                return _this356.publicGetTicker({
                    'coin': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this356.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this357 = this;

            return Promise.resolve().then(function () {
                return _this357.loadMarkets();
            }).then(function () {
                return _this357.publicGetOrders({
                    'coin': _this357.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this358 = this,
                _arguments346 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments346.length > 4 && _arguments346[4] !== undefined ? _arguments346[4] : undefined;
                params = _arguments346.length > 5 && _arguments346[5] !== undefined ? _arguments346[5] : {};
                return _this358.loadMarkets();
            }).then(function () {
                return _this358.privatePostTradeAdd(_this358.extend({
                    'amount': amount,
                    'price': price,
                    'type': side,
                    'coin': _this358.marketId(market)
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this359 = this,
                _arguments347 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments347.length > 1 && _arguments347[1] !== undefined ? _arguments347[1] : {};
                return _this359.loadMarkets();
            }).then(function () {
                return _this359.privateDeleteWalletsWalletIdOrdersId(_this359.extend({
                    'id': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                query,
                request,
                secret,
                response,
                _this360 = this,
                _arguments348 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments348.length > 1 && _arguments348[1] !== undefined ? _arguments348[1] : 'public';
                method = _arguments348.length > 2 && _arguments348[2] !== undefined ? _arguments348[2] : 'GET';
                params = _arguments348.length > 3 && _arguments348[3] !== undefined ? _arguments348[3] : {};
                headers = _arguments348.length > 4 && _arguments348[4] !== undefined ? _arguments348[4] : undefined;
                body = _arguments348.length > 5 && _arguments348[5] !== undefined ? _arguments348[5] : undefined;
                url = _this360.urls['api'] + '/' + _this360.version + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this360.urlencode(params);
                    }
                } else {
                    nonce = _this360.nonce().toString();
                    query = _this360.extend({
                        'key': _this360.apiKey,
                        'nonce': nonce
                    }, params);
                    request = _this360.urlencode(query);
                    secret = _this360.hash(_this360.encode(_this360.secret));

                    query['signature'] = _this360.hmac(_this360.encode(request), _this360.encode(secret));
                    body = _this360.urlencode(query);
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length
                    };
                }
                return _this360.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('result' in response) {
                    if (!response['result']) {
                        throw new ExchangeError(_this360.id + ' ' + _this360.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------
    // kraken is also owner of ex. Coinsetter / CaVirtEx / Clevercoin

    var kraken = {

        'id': 'kraken',
        'name': 'Kraken',
        'countries': 'US',
        'version': '0',
        'rateLimit': 1500,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766599-22709304-5ede-11e7-9de1-9f33732e1509.jpg',
            'api': 'https://api.kraken.com',
            'www': 'https://www.kraken.com',
            'doc': ['https://www.kraken.com/en-us/help/api', 'https://github.com/nothingisdead/npm-kraken-api']
        },
        'api': {
            'public': {
                'get': ['Assets', 'AssetPairs', 'Depth', 'OHLC', 'Spread', 'Ticker', 'Time', 'Trades']
            },
            'private': {
                'post': ['AddOrder', 'Balance', 'CancelOrder', 'ClosedOrders', 'DepositAddresses', 'DepositMethods', 'DepositStatus', 'Ledgers', 'OpenOrders', 'OpenPositions', 'QueryLedgers', 'QueryOrders', 'QueryTrades', 'TradeBalance', 'TradesHistory', 'TradeVolume', 'Withdraw', 'WithdrawCancel', 'WithdrawInfo', 'WithdrawStatus']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                id,
                market,
                base,
                quote,
                darkpool,
                symbol,
                _this361 = this;

            return Promise.resolve().then(function () {
                return _this361.publicGetAssetPairs();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets['result']);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = markets['result'][id];
                    base = market['base'];
                    quote = market['quote'];

                    if (base[0] == 'X' || base[0] == 'Z') {
                        base = base.slice(1);
                    }if (quote[0] == 'X' || quote[0] == 'Z') {
                        quote = quote.slice(1);
                    }base = _this361.commonCurrencyCode(base);
                    quote = _this361.commonCurrencyCode(quote);
                    darkpool = id.indexOf('.d') >= 0;
                    symbol = darkpool ? market['altname'] : base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'darkpool': darkpool,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                darkpool,
                p,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _timestamp5,
                _this362 = this,
                _arguments350 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments350.length > 1 && _arguments350[1] !== undefined ? _arguments350[1] : {};
                return _this362.loadMarkets();
            }).then(function () {
                darkpool = market.indexOf('.d') >= 0;

                if (darkpool) {
                    throw new ExchangeError(_this362.id + ' does not provide an order book for darkpool symbol ' + market);
                }p = _this362.market(market);
                return _this362.publicGetDepth(_this362.extend({
                    'pair': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['result'][p['id']];
                timestamp = _this362.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this362.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);
                        _timestamp5 = order[2] * 1000;

                        result[side].push([price, amount, _timestamp5]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['h'][1]),
                'low': parseFloat(ticker['l'][1]),
                'bid': parseFloat(ticker['b'][0]),
                'ask': parseFloat(ticker['a'][0]),
                'vwap': parseFloat(ticker['p'][1]),
                'open': parseFloat(ticker['o']),
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['c'][0]),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['v'][1]),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var pairs,
                s,
                symbol,
                market,
                filter,
                response,
                tickers,
                ids,
                result,
                i,
                id,
                _market,
                _symbol2,
                ticker,
                _this363 = this;

            return Promise.resolve().then(function () {
                return _this363.loadMarkets();
            }).then(function () {
                pairs = [];

                for (s = 0; s < _this363.symbols.length; s++) {
                    symbol = _this363.symbols[s];
                    market = _this363.markets[symbol];

                    if (!market['darkpool']) {
                        pairs.push(market['id']);
                    }
                }
                filter = pairs.join(',');
                return _this363.publicGetTicker({
                    'pair': filter
                });
            }).then(function (_resp) {
                response = _resp;
                tickers = response['result'];
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    _market = _this363.markets_by_id[id];
                    _symbol2 = _market['symbol'];
                    ticker = tickers[id];

                    result[_symbol2] = _this363.parseTicker(ticker, _market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var darkpool,
                p,
                response,
                ticker,
                _this364 = this;

            return Promise.resolve().then(function () {
                return _this364.loadMarkets();
            }).then(function () {
                darkpool = market.indexOf('.d') >= 0;

                if (darkpool) {
                    throw new ExchangeError(_this364.id + ' does not provide a ticker for darkpool symbol ' + market);
                }p = _this364.market(market);
                return _this364.publicGetTicker({
                    'pair': p['id']
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['result'][p['id']];

                return _this364.parseTicker(ticker, p);
            });
        },
        parseTrade: function parseTrade(trade, market) {
            var timestamp = parseInt(trade[2] * 1000);
            var side = trade[3] == 's' ? 'sell' : 'buy';
            var type = trade[4] == 'l' ? 'limit' : 'market';
            return {
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'type': type,
                'side': side,
                'price': parseFloat(trade[0]),
                'amount': parseFloat(trade[1])
            };
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                m,
                id,
                response,
                trades,
                _this365 = this,
                _arguments353 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments353.length > 1 && _arguments353[1] !== undefined ? _arguments353[1] : {};
                return _this365.loadMarkets();
            }).then(function () {
                m = _this365.market(market);
                id = m['id'];
                return _this365.publicGetTrades(_this365.extend({
                    'pair': id
                }, params));
            }).then(function (_resp) {
                response = _resp;
                trades = response['result'][id];

                return _this365.parseTrades(trades, m);
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                currencies,
                c,
                currency,
                code,
                balance,
                account,
                _this366 = this;

            return Promise.resolve().then(function () {
                return _this366.loadMarkets();
            }).then(function () {
                return _this366.privatePostBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result'];
                result = { 'info': balances };
                currencies = Object.keys(balances);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    code = currency;
                    // X-ISO4217-A3 standard currency codes

                    if (code[0] == 'X') {
                        code = code.slice(1);
                    } else {
                        if (code[0] == 'Z') {
                            code = code.slice(1);
                        }
                    }code = _this366.commonCurrencyCode(code);
                    balance = parseFloat(balances[currency]);
                    account = {
                        'free': balance,
                        'used': undefined,
                        'total': balance
                    };

                    result[code] = account;
                }
                return result;
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                length,
                id,
                _this367 = this,
                _arguments355 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments355.length > 4 && _arguments355[4] !== undefined ? _arguments355[4] : undefined;
                params = _arguments355.length > 5 && _arguments355[5] !== undefined ? _arguments355[5] : {};
                return _this367.loadMarkets();
            }).then(function () {
                order = {
                    'pair': _this367.marketId(market),
                    'type': side,
                    'ordertype': type,
                    'volume': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this367.privatePostAddOrder(_this367.extend(order, params));
            }).then(function (_resp) {
                response = _resp;
                length = response['txid'].length;
                id = length > 1 ? response['txid'] : response['txid'][0];

                return {
                    'info': response,
                    'id': id
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this368 = this;

            return Promise.resolve().then(function () {
                return _this368.loadMarkets();
            }).then(function () {
                return _this368.privatePostCancelOrder({ 'txid': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                auth,
                _hash2,
                binary,
                binhash,
                secret,
                signature,
                response,
                numErrors,
                _this369 = this,
                _arguments357 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments357.length > 1 && _arguments357[1] !== undefined ? _arguments357[1] : 'public';
                method = _arguments357.length > 2 && _arguments357[2] !== undefined ? _arguments357[2] : 'GET';
                params = _arguments357.length > 3 && _arguments357[3] !== undefined ? _arguments357[3] : {};
                headers = _arguments357.length > 4 && _arguments357[4] !== undefined ? _arguments357[4] : undefined;
                body = _arguments357.length > 5 && _arguments357[5] !== undefined ? _arguments357[5] : undefined;
                url = '/' + _this369.version + '/' + api + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this369.urlencode(params);
                    }
                } else {
                    nonce = _this369.nonce().toString();

                    body = _this369.urlencode(_this369.extend({ 'nonce': nonce }, params));
                    auth = _this369.encode(nonce + body);
                    _hash2 = _this369.hash(auth, 'sha256', 'binary');
                    binary = _this369.stringToBinary(_this369.encode(url));
                    binhash = _this369.binaryConcat(binary, _hash2);
                    secret = _this369.base64ToBinary(_this369.secret);
                    signature = _this369.hmac(binhash, secret, 'sha512', 'base64');

                    headers = {
                        'API-Key': _this369.apiKey,
                        'API-Sign': signature,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                }
                url = _this369.urls['api'] + url;
                return _this369.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    numErrors = response['error'].length;

                    if (numErrors) {
                        throw new ExchangeError(_this369.id + ' ' + _this369.json(response));
                    }
                }
                return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var lakebtc = {

        'id': 'lakebtc',
        'name': 'LakeBTC',
        'countries': 'US',
        'version': 'api_v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28074120-72b7c38a-6660-11e7-92d9-d9027502281d.jpg',
            'api': 'https://api.lakebtc.com',
            'www': 'https://www.lakebtc.com',
            'doc': ['https://www.lakebtc.com/s/api', 'https://www.lakebtc.com/s/api_v2']
        },
        'api': {
            'public': {
                'get': ['bcorderbook', 'bctrades', 'ticker']
            },
            'private': {
                'post': ['buyOrder', 'cancelOrders', 'getAccountInfo', 'getExternalAccounts', 'getOrders', 'getTrades', 'openOrders', 'sellOrder']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                keys,
                k,
                id,
                market,
                base,
                quote,
                symbol,
                _this370 = this;

            return Promise.resolve().then(function () {
                return _this370.publicGetTicker();
            }).then(function (_resp) {
                markets = _resp;
                result = [];
                keys = Object.keys(markets);

                for (k = 0; k < keys.length; k++) {
                    id = keys[k];
                    market = markets[id];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);

                    base = base.toUpperCase();
                    quote = quote.toUpperCase();
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                currencies,
                c,
                currency,
                balance,
                account,
                _this371 = this;

            return Promise.resolve().then(function () {
                return _this371.loadMarkets();
            }).then(function () {
                return _this371.privatePostGetAccountInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balance'];
                result = { 'info': response };
                currencies = Object.keys(balances);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    balance = parseFloat(balances[currency]);
                    account = {
                        'free': balance,
                        'used': undefined,
                        'total': balance
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this372 = this,
                _arguments360 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments360.length > 1 && _arguments360[1] !== undefined ? _arguments360[1] : {};
                return _this372.loadMarkets();
            }).then(function () {
                return _this372.publicGetBcorderbook(_this372.extend({
                    'symbol': _this372.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this372.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this372.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this373 = this;

            return Promise.resolve().then(function () {
                return _this373.loadMarkets();
            }).then(function () {
                p = _this373.market(market);
                return _this373.publicGetTicker({
                    'symbol': p['id']
                });
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[p['id']];
                timestamp = _this373.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this373.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this374 = this;

            return Promise.resolve().then(function () {
                return _this374.loadMarkets();
            }).then(function () {
                return _this374.publicGetBctrades({
                    'symbol': _this374.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                marketId,
                order,
                response,
                _this375 = this,
                _arguments363 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments363.length > 4 && _arguments363[4] !== undefined ? _arguments363[4] : undefined;
                params = _arguments363.length > 5 && _arguments363[5] !== undefined ? _arguments363[5] : {};
                return _this375.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this375.id + ' allows limit orders only');
                }method = 'privatePost' + _this375.capitalize(side) + 'Order';
                marketId = _this375.marketId(market);
                order = {
                    'params': [price, amount, marketId]
                };
                return _this375[method](_this375.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this376 = this;

            return Promise.resolve().then(function () {
                return _this376.loadMarkets();
            }).then(function () {
                return _this376.privatePostCancelOrder({ 'params': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                query,
                signature,
                response,
                _this377 = this,
                _arguments365 = arguments;

            api = _arguments365.length > 1 && _arguments365[1] !== undefined ? _arguments365[1] : 'public';
            method = _arguments365.length > 2 && _arguments365[2] !== undefined ? _arguments365[2] : 'GET';
            params = _arguments365.length > 3 && _arguments365[3] !== undefined ? _arguments365[3] : {};
            headers = _arguments365.length > 4 && _arguments365[4] !== undefined ? _arguments365[4] : undefined;
            body = _arguments365.length > 5 && _arguments365[5] !== undefined ? _arguments365[5] : undefined;
            url = _this377.urls['api'] + '/' + _this377.version;

            if (api == 'public') {
                url += '/' + path;
                if (Object.keys(params).length) {
                    url += '?' + _this377.urlencode(params);
                }
            } else {
                nonce = _this377.nonce();

                if (Object.keys(params).length) {
                    params = params.join(',');
                } else {
                    params = '';
                }query = _this377.urlencode({
                    'tonce': nonce,
                    'accesskey': _this377.apiKey,
                    'requestmethod': method.toLowerCase(),
                    'id': nonce,
                    'method': path,
                    'params': params
                });

                body = _this377.json({
                    'method': path,
                    'params': params,
                    'id': nonce
                });
                signature = _this377.hmac(_this377.encode(query), _this377.secret, 'sha1', 'base64');

                headers = {
                    'Json-Rpc-Tonce': nonce,
                    'Authorization': "Basic " + _this377.apiKey + ':' + signature,
                    'Content-Length': body.length,
                    'Content-Type': 'application/json'
                };
            }
            response = _this377.fetch(url, method, headers, body);

            if ('error' in response) {
                throw new ExchangeError(_this377.id + ' ' + _this377.json(response));
            }return response;
        }
    };

    //-----------------------------------------------------------------------------

    var livecoin = {

        'id': 'livecoin',
        'name': 'LiveCoin',
        'countries': ['US', 'UK', 'RU'],
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27980768-f22fc424-638a-11e7-89c9-6010a54ff9be.jpg',
            'api': 'https://api.livecoin.net',
            'www': 'https://www.livecoin.net',
            'doc': 'https://www.livecoin.net/api?lang=en'
        },
        'api': {
            'public': {
                'get': ['exchange/all/order_book', 'exchange/last_trades', 'exchange/maxbid_minask', 'exchange/order_book', 'exchange/restrictions', 'exchange/ticker', // omit params to get all tickers at once
                'info/coinInfo']
            },
            'private': {
                'get': ['exchange/client_orders', 'exchange/order', 'exchange/trades', 'exchange/commission', 'exchange/commissionCommonInfo', 'payment/balances', 'payment/balance', 'payment/get/address', 'payment/history/size', 'payment/history/transactions'],
                'post': ['exchange/buylimit', 'exchange/buymarket', 'exchange/cancellimit', 'exchange/selllimit', 'exchange/sellmarket', 'payment/out/capitalist', 'payment/out/card', 'payment/out/coin', 'payment/out/okpay', 'payment/out/payeer', 'payment/out/perfectmoney', 'payment/voucher/amount', 'payment/voucher/make', 'payment/voucher/redeem']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                symbol,
                _symbol$split9,
                _symbol$split10,
                base,
                quote,
                _this378 = this;

            return Promise.resolve().then(function () {
                return _this378.publicGetExchangeTicker();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['symbol'];
                    symbol = id;
                    _symbol$split9 = symbol.split('/');
                    _symbol$split10 = _slicedToArray(_symbol$split9, 2);
                    base = _symbol$split10[0];
                    quote = _symbol$split10[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var balances,
                result,
                b,
                balance,
                currency,
                account,
                _this379 = this;

            return Promise.resolve().then(function () {
                return _this379.loadMarkets();
            }).then(function () {
                return _this379.privateGetPaymentBalances();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < _this379.currencies.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    account = undefined;

                    if (currency in result) {
                        account = result[currency];
                    } else {
                        account = {
                            'free': undefined,
                            'used': undefined,
                            'total': undefined
                        };
                    }if (balance['type'] == 'total') {
                        account['total'] = parseFloat(balance['value']);
                    }if (balance['type'] == 'available') {
                        account['free'] = parseFloat(balance['value']);
                    }if (balance['type'] == 'trade') {
                        account['used'] = parseFloat(balance['value']);
                    }result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this380 = this,
                _arguments368 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments368.length > 1 && _arguments368[1] !== undefined ? _arguments368[1] : {};
                return _this380.loadMarkets();
            }).then(function () {
                return _this380.publicGetExchangeOrderBook(_this380.extend({
                    'currencyPair': _this380.marketId(market),
                    'groupByPrice': 'false',
                    'depth': 100
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['timestamp'];
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this380.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['best_bid']),
                'ask': parseFloat(ticker['best_ask']),
                'vwap': parseFloat(ticker['vwap']),
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this381 = this;

            return Promise.resolve().then(function () {
                return _this381.loadMarkets();
            }).then(function () {
                return _this381.publicGetExchangeTicker();
            }).then(function (_resp) {
                response = _resp;
                tickers = _this381.indexBy(response, 'symbol');
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this381.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this381.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this382 = this;

            return Promise.resolve().then(function () {
                return _this382.loadMarkets();
            }).then(function () {
                p = _this382.market(market);
                return _this382.publicGetExchangeTicker({
                    'currencyPair': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this382.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this383 = this;

            return Promise.resolve().then(function () {
                return _this383.loadMarkets();
            }).then(function () {
                return _this383.publicGetExchangeLastTrades({
                    'currencyPair': _this383.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this384 = this,
                _arguments372 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments372.length > 4 && _arguments372[4] !== undefined ? _arguments372[4] : undefined;
                params = _arguments372.length > 5 && _arguments372[5] !== undefined ? _arguments372[5] : {};
                return _this384.loadMarkets();
            }).then(function () {
                method = 'privatePostExchange' + _this384.capitalize(side) + type;
                order = {
                    'currencyPair': _this384.marketId(market),
                    'quantity': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this384[method](_this384.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this385 = this,
                _arguments373 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments373.length > 1 && _arguments373[1] !== undefined ? _arguments373[1] : {};
                return _this385.loadMarkets();
            }).then(function () {
                return _this385.privatePostExchangeCancellimit(_this385.extend({
                    'orderId': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                signature,
                response,
                _this386 = this,
                _arguments374 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments374.length > 1 && _arguments374[1] !== undefined ? _arguments374[1] : 'public';
                method = _arguments374.length > 2 && _arguments374[2] !== undefined ? _arguments374[2] : 'GET';
                params = _arguments374.length > 3 && _arguments374[3] !== undefined ? _arguments374[3] : {};
                headers = _arguments374.length > 4 && _arguments374[4] !== undefined ? _arguments374[4] : undefined;
                body = _arguments374.length > 5 && _arguments374[5] !== undefined ? _arguments374[5] : undefined;
                url = _this386.urls['api'] + '/' + path;

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this386.urlencode(params);
                    }
                } else {
                    query = _this386.urlencode(_this386.keysort(params));

                    if (method == 'GET') {
                        if (query) {
                            url += '?' + query;
                        } else {
                            if (query) {
                                body = query;
                            }
                        }
                    }signature = _this386.hmac(_this386.encode(query), _this386.encode(_this386.secret), 'sha256');

                    headers = {
                        'Api-Key': _this386.apiKey,
                        'Sign': signature.toUpperCase(),
                        'Content-Type': 'application/x-www-form-urlencoded'
                    };
                }
                return _this386.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('success' in response) {
                    if (!response['success']) {
                        throw new ExchangeError(_this386.id + ' ' + _this386.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var liqui = extend(btce, {
        'id': 'liqui',
        'name': 'Liqui',
        'countries': 'UA',
        'rateLimit': 1000,
        'version': '3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27982022-75aea828-63a0-11e7-9511-ca584a8edd74.jpg',
            'api': {
                'public': 'https://api.liqui.io/api',
                'private': 'https://api.liqui.io/tapi'
            },
            'www': 'https://liqui.io',
            'doc': 'https://liqui.io/api'
        },

        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                response,
                _this387 = this,
                _arguments375 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments375.length > 1 && _arguments375[1] !== undefined ? _arguments375[1] : 'public';
                method = _arguments375.length > 2 && _arguments375[2] !== undefined ? _arguments375[2] : 'GET';
                params = _arguments375.length > 3 && _arguments375[3] !== undefined ? _arguments375[3] : {};
                headers = _arguments375.length > 4 && _arguments375[4] !== undefined ? _arguments375[4] : undefined;
                body = _arguments375.length > 5 && _arguments375[5] !== undefined ? _arguments375[5] : undefined;
                url = _this387.urls['api'][api];
                query = _this387.omit(params, _this387.extractParams(path));

                if (api == 'public') {
                    url += '/' + _this387.version + '/' + _this387.implodeParams(path, params);
                    if (Object.keys(query).length) {
                        url += '?' + _this387.urlencode(query);
                    }
                } else {
                    nonce = _this387.nonce();

                    body = _this387.urlencode(_this387.extend({
                        'nonce': nonce,
                        'method': path
                    }, query));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this387.apiKey,
                        'Sign': _this387.hmac(_this387.encode(body), _this387.encode(_this387.secret), 'sha512')
                    };
                }
                return _this387.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('success' in response) {
                    if (!response['success']) {
                        throw new ExchangeError(_this387.id + ' ' + _this387.json(response));
                    }
                }return response;
            });
        }
    });

    //-----------------------------------------------------------------------------

    var luno = {

        'id': 'luno',
        'name': 'luno',
        'countries': ['GB', 'SG', 'ZA'],
        'rateLimit': 3000,
        'version': '1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766607-8c1a69d8-5ede-11e7-930c-540b5eb9be24.jpg',
            'api': 'https://api.mybitx.com/api',
            'www': 'https://www.luno.com',
            'doc': ['https://www.luno.com/en/api', 'https://npmjs.org/package/bitx', 'https://github.com/bausmeier/node-bitx']
        },
        'api': {
            'public': {
                'get': ['orderbook', 'ticker', 'tickers', 'trades']
            },
            'private': {
                'get': ['accounts/{id}/pending', 'accounts/{id}/transactions', 'balance', 'fee_info', 'funding_address', 'listorders', 'listtrades', 'orders/{id}', 'quotes/{id}', 'withdrawals', 'withdrawals/{id}'],
                'post': ['accounts', 'postorder', 'marketorder', 'stoporder', 'funding_address', 'withdrawals', 'send', 'quotes', 'oauth2/grant'],
                'put': ['quotes/{id}'],
                'delete': ['quotes/{id}', 'withdrawals/{id}']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this388 = this;

            return Promise.resolve().then(function () {
                return _this388.publicGetTickers();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['tickers'].length; p++) {
                    market = markets['tickers'][p];
                    id = market['pair'];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);

                    base = _this388.commonCurrencyCode(base);
                    quote = _this388.commonCurrencyCode(quote);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                b,
                balance,
                currency,
                reserved,
                unconfirmed,
                account,
                _this389 = this;

            return Promise.resolve().then(function () {
                return _this389.loadMarkets();
            }).then(function () {
                return _this389.privateGetBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balance'];
                result = { 'info': response };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = _this389.commonCurrencyCode(balance['asset']);
                    reserved = parseFloat(balance['reserved']);
                    unconfirmed = parseFloat(balance['unconfirmed']);
                    account = {
                        'free': parseFloat(balance['balance']),
                        'used': _this389.sum(reserved, unconfirmed),
                        'total': undefined
                    };

                    account['total'] = _this389.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this390 = this,
                _arguments378 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments378.length > 1 && _arguments378[1] !== undefined ? _arguments378[1] : {};
                return _this390.loadMarkets();
            }).then(function () {
                return _this390.publicGetOrderbook(_this390.extend({
                    'pair': _this390.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['timestamp'];
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this390.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['volume']);
                        // let timestamp = order[2] * 1000;

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['timestamp'];
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last_trade']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['rolling_24_hour_volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this391 = this;

            return Promise.resolve().then(function () {
                return _this391.loadMarkets();
            }).then(function () {
                return _this391.publicGetTickers();
            }).then(function (_resp) {
                response = _resp;
                tickers = _this391.indexBy(response['tickers'], 'pair');
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this391.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this391.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this392 = this;

            return Promise.resolve().then(function () {
                return _this392.loadMarkets();
            }).then(function () {
                p = _this392.market(market);
                return _this392.publicGetTicker({
                    'pair': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this392.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this393 = this;

            return Promise.resolve().then(function () {
                return _this393.loadMarkets();
            }).then(function () {
                return _this393.publicGetTrades({
                    'pair': _this393.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this394 = this,
                _arguments382 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments382.length > 4 && _arguments382[4] !== undefined ? _arguments382[4] : undefined;
                params = _arguments382.length > 5 && _arguments382[5] !== undefined ? _arguments382[5] : {};
                return _this394.loadMarkets();
            }).then(function () {
                method = 'privatePost';
                order = { 'pair': _this394.marketId(market) };

                if (type == 'market') {
                    method += 'Marketorder';
                    order['type'] = side.toUpperCase();
                    if (side == 'buy') {
                        order['counter_volume'] = amount;
                    } else {
                        order['base_volume'] = amount;
                    }
                } else {
                    method += 'Order';
                    order['volume'] = amount;
                    order['price'] = price;
                    if (side == 'buy') {
                        order['type'] = 'BID';
                    } else {
                        order['type'] = 'ASK';
                    }
                }
                return _this394[method](_this394.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this395 = this;

            return Promise.resolve().then(function () {
                return _this395.loadMarkets();
            }).then(function () {
                return _this395.privatePostStoporder({ 'order_id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                auth,
                response,
                _this396 = this,
                _arguments384 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments384.length > 1 && _arguments384[1] !== undefined ? _arguments384[1] : 'public';
                method = _arguments384.length > 2 && _arguments384[2] !== undefined ? _arguments384[2] : 'GET';
                params = _arguments384.length > 3 && _arguments384[3] !== undefined ? _arguments384[3] : {};
                headers = _arguments384.length > 4 && _arguments384[4] !== undefined ? _arguments384[4] : undefined;
                body = _arguments384.length > 5 && _arguments384[5] !== undefined ? _arguments384[5] : undefined;
                url = _this396.urls['api'] + '/' + _this396.version + '/' + _this396.implodeParams(path, params);
                query = _this396.omit(params, _this396.extractParams(path));

                if (Object.keys(query).length) {
                    url += '?' + _this396.urlencode(query);
                }if (api == 'private') {
                    auth = _this396.encode(_this396.apiKey + ':' + _this396.secret);

                    auth = _this396.stringToBase64(auth);
                    headers = { 'Authorization': 'Basic ' + _this396.decode(auth) };
                }
                return _this396.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this396.id + ' ' + _this396.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var mercado = {

        'id': 'mercado',
        'name': 'Mercado Bitcoin',
        'countries': 'BR', // Brazil
        'rateLimit': 1000,
        'version': 'v3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27837060-e7c58714-60ea-11e7-9192-f05e86adb83f.jpg',
            'api': {
                'public': 'https://www.mercadobitcoin.net/api',
                'private': 'https://www.mercadobitcoin.net/tapi'
            },
            'www': 'https://www.mercadobitcoin.com.br',
            'doc': ['https://www.mercadobitcoin.com.br/api-doc', 'https://www.mercadobitcoin.com.br/trade-api']
        },
        'api': {
            'public': {
                'get': [// last slash critical
                'orderbook/', 'orderbook_litecoin/', 'ticker/', 'ticker_litecoin/', 'trades/', 'trades_litecoin/', 'v2/ticker/', 'v2/ticker_litecoin/']
            },
            'private': {
                'post': ['cancel_order', 'get_account_info', 'get_order', 'get_withdrawal', 'list_system_messages', 'list_orders', 'list_orderbook', 'place_buy_order', 'place_sell_order', 'withdraw_coin']
            }
        },
        'markets': {
            'BTC/BRL': { 'id': 'BRLBTC', 'symbol': 'BTC/BRL', 'base': 'BTC', 'quote': 'BRL', 'suffix': '' },
            'LTC/BRL': { 'id': 'BRLLTC', 'symbol': 'LTC/BRL', 'base': 'LTC', 'quote': 'BRL', 'suffix': 'Litecoin' }
        },

        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                method,
                orderbook,
                timestamp,
                result,
                _this397 = this,
                _arguments385 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments385.length > 1 && _arguments385[1] !== undefined ? _arguments385[1] : {};
                p = _this397.market(market);
                method = 'publicGetOrderbook' + _this397.capitalize(p['suffix']);
                return _this397[method](params);
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this397.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this397.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                method,
                response,
                ticker,
                timestamp,
                _this398 = this;

            return Promise.resolve().then(function () {
                p = _this398.market(market);
                method = 'publicGetV2Ticker' + _this398.capitalize(p['suffix']);
                return _this398[method]();
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = parseInt(ticker['date']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this398.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var p,
                method,
                _this399 = this;

            p = _this399.market(market);
            method = 'publicGetTrades' + _this399.capitalize(p['suffix']);

            return _this399[method]();
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                _this400 = this;

            return Promise.resolve().then(function () {
                return _this400.privatePostGetAccountInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balance'];
                result = { 'info': response };

                for (c = 0; c < _this400.currencies.length; c++) {
                    currency = _this400.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (lowercase in balances) {
                        account['free'] = parseFloat(balances[lowercase]['available']);
                        account['total'] = parseFloat(balances[lowercase]['total']);
                        account['used'] = account['total'] - account['free'];
                    }
                    result[currency] = account;
                }
                return result;
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this401 = this,
                _arguments389 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments389.length > 4 && _arguments389[4] !== undefined ? _arguments389[4] : undefined;
                params = _arguments389.length > 5 && _arguments389[5] !== undefined ? _arguments389[5] : {};

                if (type == 'market') {
                    throw new ExchangeError(_this401.id + ' allows limit orders only');
                }method = 'privatePostPlace' + _this401.capitalize(side) + 'Order';
                order = {
                    'coin_pair': _this401.marketId(market),
                    'quantity': amount,
                    'limit_price': price
                };
                return _this401[method](_this401.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['response_data']['order']['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this402 = this,
                _arguments390 = arguments;

            params = _arguments390.length > 1 && _arguments390[1] !== undefined ? _arguments390[1] : {};

            return _this402.privatePostCancelOrder(_this402.extend({
                'order_id': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                auth,
                response,
                _this403 = this,
                _arguments391 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments391.length > 1 && _arguments391[1] !== undefined ? _arguments391[1] : 'public';
                method = _arguments391.length > 2 && _arguments391[2] !== undefined ? _arguments391[2] : 'GET';
                params = _arguments391.length > 3 && _arguments391[3] !== undefined ? _arguments391[3] : {};
                headers = _arguments391.length > 4 && _arguments391[4] !== undefined ? _arguments391[4] : undefined;
                body = _arguments391.length > 5 && _arguments391[5] !== undefined ? _arguments391[5] : undefined;
                url = _this403.urls['api'][api] + '/';

                if (api == 'public') {
                    url += path;
                } else {
                    url += _this403.version + '/';
                    nonce = _this403.nonce();

                    body = _this403.urlencode(_this403.extend({
                        'tapi_method': path,
                        'tapi_nonce': nonce
                    }, params));
                    auth = '/tapi/' + _this403.version + '/' + '?' + body;

                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'TAPI-ID': _this403.apiKey,
                        'TAPI-MAC': _this403.hmac(_this403.encode(auth), _this403.secret, 'sha512')
                    };
                }
                return _this403.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error_message' in response) {
                    throw new ExchangeError(_this403.id + ' ' + _this403.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------
    // OKCoin
    // China
    // https://www.okcoin.com/
    // https://www.okcoin.com/rest_getStarted.html
    // https://github.com/OKCoin/websocket
    // https://www.npmjs.com/package/okcoin.com
    // https://www.okcoin.cn
    // https://www.okcoin.cn/rest_getStarted.html

    var okcoin = {

        'version': 'v1',
        'rateLimit': 1000, // up to 3000 requests per 5 minutes ≈ 600 requests per minute ≈ 10 requests per second ≈ 100 ms
        'api': {
            'public': {
                'get': ['depth', 'exchange_rate', 'future_depth', 'future_estimated_price', 'future_hold_amount', 'future_index', 'future_kline', 'future_price_limit', 'future_ticker', 'future_trades', 'kline', 'otcs', 'ticker', 'trades']
            },
            'private': {
                'post': ['account_records', 'batch_trade', 'borrow_money', 'borrow_order_info', 'borrows_info', 'cancel_borrow', 'cancel_order', 'cancel_otc_order', 'cancel_withdraw', 'future_batch_trade', 'future_cancel', 'future_devolve', 'future_explosive', 'future_order_info', 'future_orders_info', 'future_position', 'future_position_4fix', 'future_trade', 'future_trades_history', 'future_userinfo', 'future_userinfo_4fix', 'lend_depth', 'order_fee', 'order_history', 'order_info', 'orders_info', 'otc_order_history', 'otc_order_info', 'repayment', 'submit_otc_order', 'trade', 'trade_history', 'trade_otc_order', 'withdraw', 'withdraw_info', 'unrepayments_info', 'userinfo']
            }
        },

        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this404 = this,
                _arguments392 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments392.length > 1 && _arguments392[1] !== undefined ? _arguments392[1] : {};
                return _this404.publicGetDepth(_this404.extend({
                    'symbol': _this404.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this404.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': _this404.sortBy(orderbook['asks'], 0),
                    'timestamp': timestamp,
                    'datetime': _this404.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var response,
                ticker,
                timestamp,
                _this405 = this;

            return Promise.resolve().then(function () {
                return _this405.publicGetTicker({
                    'symbol': _this405.marketId(market)
                });
            }).then(function (_resp) {
                response = _resp;
                ticker = response['ticker'];
                timestamp = parseInt(response['date']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this405.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this406 = this;

            return _this406.publicGetTrades({
                'symbol': _this406.marketId(market)
            });
        },
        fetchOHLCV: function fetchOHLCV(market) {
            var timeframe,
                since,
                limit,
                m,
                response,
                _this407 = this,
                _arguments395 = arguments;

            return Promise.resolve().then(function () {
                timeframe = _arguments395.length > 1 && _arguments395[1] !== undefined ? _arguments395[1] : 60;
                since = _arguments395.length > 2 && _arguments395[2] !== undefined ? _arguments395[2] : undefined;
                limit = _arguments395.length > 3 && _arguments395[3] !== undefined ? _arguments395[3] : undefined;
                m = _this407.market(market);
                return _this407.publicGetKline({
                    'symbol': m['id'],
                    'type': '1min',
                    'since': since,
                    'size': parseInt(limit)
                });
            }).then(function (_resp) {
                response = _resp;

                return _this407.parseOHLCVs(m, response, timeframe, since, limit);
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                _this408 = this;

            return Promise.resolve().then(function () {
                return _this408.privatePostUserinfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['info']['funds'];
                result = { 'info': response };

                for (c = 0; c < _this408.currencies.length; c++) {
                    currency = _this408.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if (lowercase in balances['free']) {
                        account['free'] = parseFloat(balances['free'][lowercase]);
                    }if (lowercase in balances['freezed']) {
                        account['used'] = parseFloat(balances['freezed'][lowercase]);
                    }account['total'] = _this408.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this409 = this,
                _arguments397 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments397.length > 4 && _arguments397[4] !== undefined ? _arguments397[4] : undefined;
                params = _arguments397.length > 5 && _arguments397[5] !== undefined ? _arguments397[5] : {};
                order = {
                    'symbol': _this409.marketId(market),
                    'type': side,
                    'amount': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                } else {
                    order['type'] += '_market';
                }return _this409.privatePostTrade(_this409.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this410 = this,
                _arguments398 = arguments;

            params = _arguments398.length > 1 && _arguments398[1] !== undefined ? _arguments398[1] : {};

            return _this410.privatePostCancelOrder(_this410.extend({
                'order_id': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                queryString,
                response,
                _this411 = this,
                _arguments399 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments399.length > 1 && _arguments399[1] !== undefined ? _arguments399[1] : 'public';
                method = _arguments399.length > 2 && _arguments399[2] !== undefined ? _arguments399[2] : 'GET';
                params = _arguments399.length > 3 && _arguments399[3] !== undefined ? _arguments399[3] : {};
                headers = _arguments399.length > 4 && _arguments399[4] !== undefined ? _arguments399[4] : undefined;
                body = _arguments399.length > 5 && _arguments399[5] !== undefined ? _arguments399[5] : undefined;
                url = '/' + 'api' + '/' + _this411.version + '/' + path + '.do';

                if (api == 'public') {
                    if (Object.keys(params).length) {
                        url += '?' + _this411.urlencode(params);
                    }
                } else {
                    query = _this411.keysort(_this411.extend({
                        'api_key': _this411.apiKey
                    }, params));
                    // secret key must be at the end of query

                    queryString = _this411.urlencode(query) + '&secret_key=' + _this411.secret;

                    query['sign'] = _this411.hash(_this411.encode(queryString)).toUpperCase();
                    body = _this411.urlencode(query);
                    headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
                }
                url = _this411.urls['api'] + url;
                return _this411.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('result' in response) {
                    if (!response['result']) {
                        throw new ExchangeError(_this411.id + ' ' + _this411.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var okcoincny = extend(okcoin, {
        'id': 'okcoincny',
        'name': 'OKCoin CNY',
        'countries': 'CN',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766792-8be9157a-5ee5-11e7-926c-6d69b8d3378d.jpg',
            'api': 'https://www.okcoin.cn',
            'www': 'https://www.okcoin.cn',
            'doc': 'https://www.okcoin.cn/rest_getStarted.html'
        },
        'markets': {
            'BTC/CNY': { 'id': 'btc_cny', 'symbol': 'BTC/CNY', 'base': 'BTC', 'quote': 'CNY' },
            'LTC/CNY': { 'id': 'ltc_cny', 'symbol': 'LTC/CNY', 'base': 'LTC', 'quote': 'CNY' }
        }
    });

    //-----------------------------------------------------------------------------

    var okcoinusd = extend(okcoin, {
        'id': 'okcoinusd',
        'name': 'OKCoin USD',
        'countries': ['CN', 'US'],
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766791-89ffb502-5ee5-11e7-8a5b-c5950b68ac65.jpg',
            'api': 'https://www.okcoin.com',
            'www': 'https://www.okcoin.com',
            'doc': ['https://www.okcoin.com/rest_getStarted.html', 'https://www.npmjs.com/package/okcoin.com']
        },
        'markets': {
            'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'LTC/USD': { 'id': 'ltc_usd', 'symbol': 'LTC/USD', 'base': 'LTC', 'quote': 'USD' },
            'ETH/USD': { 'id': 'eth_usd', 'symbol': 'ETH/USD', 'base': 'ETH', 'quote': 'USD' },
            'ETC/USD': { 'id': 'etc_usd', 'symbol': 'ETC/USD', 'base': 'ETC', 'quote': 'USD' }
        }
    });

    //-----------------------------------------------------------------------------

    var paymium = {

        'id': 'paymium',
        'name': 'Paymium',
        'countries': ['FR', 'EU'],
        'rateLimit': 2000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27790564-a945a9d4-5ff9-11e7-9d2d-b635763f2f24.jpg',
            'api': 'https://paymium.com/api',
            'www': 'https://www.paymium.com',
            'doc': ['https://github.com/Paymium/api-documentation', 'https://www.paymium.com/page/developers']
        },
        'api': {
            'public': {
                'get': ['countries', 'data/{id}/ticker', 'data/{id}/trades', 'data/{id}/depth', 'bitcoin_charts/{id}/trades', 'bitcoin_charts/{id}/depth']
            },
            'private': {
                'get': ['merchant/get_payment/{UUID}', 'user', 'user/addresses', 'user/addresses/{btc_address}', 'user/orders', 'user/orders/{UUID}', 'user/price_alerts'],
                'post': ['user/orders', 'user/addresses', 'user/payment_requests', 'user/price_alerts', 'merchant/create_payment'],
                'delete': ['user/orders/{UUID}/cancel', 'user/price_alerts/{id}']
            }
        },
        'markets': {
            'BTC/EUR': { 'id': 'eur', 'symbol': 'BTC/EUR', 'base': 'BTC', 'quote': 'EUR' }
        },

        fetchBalance: function fetchBalance() {
            var balances,
                result,
                c,
                currency,
                lowercase,
                account,
                balance,
                locked,
                _this412 = this;

            return Promise.resolve().then(function () {
                return _this412.privateGetUser();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this412.currencies.length; c++) {
                    currency = _this412.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };
                    balance = 'balance_' + lowercase;
                    locked = 'locked_' + lowercase;

                    if (balance in balances) {
                        account['free'] = balances[balance];
                    }if (locked in balances) {
                        account['used'] = balances[locked];
                    }account['total'] = _this412.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _timestamp6,
                _this413 = this,
                _arguments401 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments401.length > 1 && _arguments401[1] !== undefined ? _arguments401[1] : {};
                return _this413.publicGetDataIdDepth(_this413.extend({
                    'id': _this413.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this413.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this413.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['price'];
                        amount = order['amount'];
                        _timestamp6 = order['timestamp'] * 1000;

                        result[side].push([price, amount, _timestamp6]);
                    }
                }
                result['bids'] = _this413.sortBy(result['bids'], 0, true);
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this414 = this;

            return Promise.resolve().then(function () {
                return _this414.publicGetDataIdTicker({
                    'id': _this414.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = ticker['at'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this414.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': parseFloat(ticker['open']),
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['price']),
                    'change': undefined,
                    'percentage': parseFloat(ticker['variation']),
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this415 = this;

            return _this415.publicGetDataIdTrades({
                'id': _this415.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this416 = this,
                _arguments404 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments404.length > 4 && _arguments404[4] !== undefined ? _arguments404[4] : undefined;
                params = _arguments404.length > 5 && _arguments404[5] !== undefined ? _arguments404[5] : {};
                order = {
                    'type': _this416.capitalize(type) + 'Order',
                    'currency': _this416.marketId(market),
                    'direction': side,
                    'amount': amount
                };

                if (type == 'market') {
                    order['price'] = price;
                }return _this416.privatePostUserOrders(_this416.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['uuid']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this417 = this,
                _arguments405 = arguments;

            params = _arguments405.length > 1 && _arguments405[1] !== undefined ? _arguments405[1] : {};

            return _this417.privatePostCancelOrder(_this417.extend({
                'orderNumber': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                auth,
                response,
                _this418 = this,
                _arguments406 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments406.length > 1 && _arguments406[1] !== undefined ? _arguments406[1] : 'public';
                method = _arguments406.length > 2 && _arguments406[2] !== undefined ? _arguments406[2] : 'GET';
                params = _arguments406.length > 3 && _arguments406[3] !== undefined ? _arguments406[3] : {};
                headers = _arguments406.length > 4 && _arguments406[4] !== undefined ? _arguments406[4] : undefined;
                body = _arguments406.length > 5 && _arguments406[5] !== undefined ? _arguments406[5] : undefined;
                url = _this418.urls['api'] + '/' + _this418.version + '/' + _this418.implodeParams(path, params);
                query = _this418.omit(params, _this418.extractParams(path));

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this418.urlencode(query);
                    }
                } else {
                    body = _this418.json(params);
                    nonce = _this418.nonce().toString();
                    auth = nonce + url + body;

                    headers = {
                        'Api-Key': _this418.apiKey,
                        'Api-Signature': _this418.hmac(_this418.encode(auth), _this418.secret),
                        'Api-Nonce': nonce,
                        'Content-Type': 'application/json'
                    };
                }
                return _this418.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('errors' in response) {
                    throw new ExchangeError(_this418.id + ' ' + _this418.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var poloniex = {

        'id': 'poloniex',
        'name': 'Poloniex',
        'countries': 'US',
        'rateLimit': 500, // 6 calls per second
        'orderCache': {},
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766817-e9456312-5ee6-11e7-9b3c-b628ca5626a5.jpg',
            'api': {
                'public': 'https://poloniex.com/public',
                'private': 'https://poloniex.com/tradingApi'
            },
            'www': 'https://poloniex.com',
            'doc': ['https://poloniex.com/support/api/', 'http://pastebin.com/dMX7mZE0']
        },
        'api': {
            'public': {
                'get': ['return24hVolume', 'returnChartData', 'returnCurrencies', 'returnLoanOrders', 'returnOrderBook', 'returnTicker', 'returnTradeHistory']
            },
            'private': {
                'post': ['buy', 'cancelLoanOffer', 'cancelOrder', 'closeMarginPosition', 'createLoanOffer', 'generateNewAddress', 'getMarginPosition', 'marginBuy', 'marginSell', 'moveOrder', 'returnActiveLoans', 'returnAvailableAccountBalances', 'returnBalances', 'returnCompleteBalances', 'returnDepositAddresses', 'returnDepositsWithdrawals', 'returnFeeInfo', 'returnLendingHistory', 'returnMarginAccountSummary', 'returnOpenLoanOffers', 'returnOpenOrders', 'returnOrderTrades', 'returnTradableBalances', 'returnTradeHistory', 'sell', 'toggleAutoRenew', 'transferBalance', 'withdraw']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                id,
                market,
                _id$split7,
                _id$split8,
                quote,
                base,
                symbol,
                _this419 = this;

            return Promise.resolve().then(function () {
                return _this419.publicGetReturnTicker();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = markets[id];
                    _id$split7 = id.split('_');
                    _id$split8 = _slicedToArray(_id$split7, 2);
                    quote = _id$split8[0];
                    base = _id$split8[1];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var balances,
                result,
                currencies,
                c,
                currency,
                balance,
                account,
                _this420 = this;

            return Promise.resolve().then(function () {
                return _this420.loadMarkets();
            }).then(function () {
                return _this420.privatePostReturnCompleteBalances({
                    'account': 'all'
                });
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };
                currencies = Object.keys(balances);

                for (c = 0; c < currencies.length; c++) {
                    currency = currencies[c];
                    balance = balances[currency];
                    account = {
                        'free': parseFloat(balance['available']),
                        'used': parseFloat(balance['onOrders']),
                        'total': undefined
                    };

                    account['total'] = _this420.sum(account['free'], account['used']);
                    result[currency] = account;
                }
                return result;
            });
        },
        parseBidAsk: function parseBidAsk(bidask) {
            var price = parseFloat(bidask[0]);
            var amount = parseFloat(bidask[1]);
            return [price, amount];
        },
        parseBidAsks: function parseBidAsks(bidasks) {
            var result = [];
            for (var i = 0; i < bidasks.length; i++) {
                result.push(this.parseBidAsk(bidasks[i]));
            }
            return result;
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                _this421 = this,
                _arguments409 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments409.length > 1 && _arguments409[1] !== undefined ? _arguments409[1] : {};
                return _this421.loadMarkets();
            }).then(function () {
                return _this421.publicGetReturnOrderBook(_this421.extend({
                    'currencyPair': _this421.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this421.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this421.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];

                    result[side] = _this421.parseBidAsks(orderbook[side]);
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high24hr']),
                'low': parseFloat(ticker['low24hr']),
                'bid': parseFloat(ticker['highestBid']),
                'ask': parseFloat(ticker['lowestAsk']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': parseFloat(ticker['percentChange']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['baseVolume']),
                'quoteVolume': parseFloat(ticker['quoteVolume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this422 = this;

            return Promise.resolve().then(function () {
                return _this422.loadMarkets();
            }).then(function () {
                return _this422.publicGetReturnTicker();
            }).then(function (_resp) {
                tickers = _resp;
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this422.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this422.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var m,
                tickers,
                ticker,
                _this423 = this;

            return Promise.resolve().then(function () {
                return _this423.loadMarkets();
            }).then(function () {
                m = _this423.market(market);
                return _this423.publicGetReturnTicker();
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[m['id']];

                return _this423.parseTicker(ticker, m);
            });
        },
        parseTrade: function parseTrade(trade) {
            var market = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var timestamp = this.parse8601(trade['date']);
            var id = undefined;
            var order = undefined;
            if ('tradeID' in trade) id = trade['tradeID'];
            if ('orderNumber' in trade) order = trade['orderNumber'];
            return {
                'info': trade,
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'symbol': market['symbol'],
                'id': id,
                'order': order,
                'type': undefined,
                'side': trade['type'],
                'price': parseFloat(trade['rate']),
                'amount': parseFloat(trade['amount'])
            };
        },
        fetchTrades: function fetchTrades(market) {
            var params,
                m,
                trades,
                _this424 = this,
                _arguments412 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments412.length > 1 && _arguments412[1] !== undefined ? _arguments412[1] : {};
                return _this424.loadMarkets();
            }).then(function () {
                m = _this424.market(market);
                return _this424.publicGetReturnTradeHistory(_this424.extend({
                    'currencyPair': m['id'],
                    'end': _this424.seconds() // last 50000 trades by default
                }, params));
            }).then(function (_resp) {
                trades = _resp;

                return _this424.parseTrades(trades, m);
            });
        },
        fetchMyTrades: function fetchMyTrades() {
            var market,
                params,
                now,
                request,
                _m,
                trades,
                result,
                ids,
                i,
                id,
                _trades,
                _market2,
                symbol,
                _this425 = this,
                _arguments413 = arguments;

            return Promise.resolve().then(function () {
                market = _arguments413.length > 0 && _arguments413[0] !== undefined ? _arguments413[0] : undefined;
                params = _arguments413.length > 1 && _arguments413[1] !== undefined ? _arguments413[1] : {};
                now = _this425.seconds();
                request = _this425.extend({
                    'currencyPair': 'all',
                    'end': _this425.seconds() // last 50000 trades by default
                }, params);

                if (market) {
                    _m = _this425.market(market);

                    request['currencyPair'] = _m['id'];
                }
                return _this425.privatePostReturnTradeHistory(request);
            }).then(function (_resp) {
                trades = _resp;

                if (market) {
                    return _this425.parseTrades(trades, m);
                } else {
                    result = { 'info': trades };
                    ids = Object.keys(trades);

                    for (i = 0; i < ids.length; i++) {
                        id = ids[i];
                        _trades = _trades[id];
                        _market2 = _this425.markets_by_id[id];
                        symbol = _market2['symbol'];

                        result[symbol] = _this425.parseTrades(_trades, _market2);
                    }
                    return result;
                }
            });
        },
        parseOrder: function parseOrder(order, market) {
            return {
                'id': order['orderNumber'],
                'timestamp': order['timestamp'],
                'datetime': this.iso8601(order['timestamp']),
                'status': order['status'],
                'symbol': market['symbol'],
                'type': order['type'],
                'side': order['side'],
                'price': order['price'],
                'amount': order['amount'],
                'trades': this.parseTrades(order['resultingTrades'], market)
            };
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                m,
                response,
                timestamp,
                order,
                id,
                _this426 = this,
                _arguments414 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments414.length > 4 && _arguments414[4] !== undefined ? _arguments414[4] : undefined;
                params = _arguments414.length > 5 && _arguments414[5] !== undefined ? _arguments414[5] : {};

                if (type == 'market') {
                    throw new ExchangeError(_this426.id + ' allows limit orders only');
                }return _this426.loadMarkets();
            }).then(function () {
                method = 'privatePost' + _this426.capitalize(side);
                m = _this426.market(market);
                return _this426[method](_this426.extend({
                    'currencyPair': m['id'],
                    'rate': price,
                    'amount': amount
                }, params));
            }).then(function (_resp) {
                response = _resp;
                timestamp = _this426.milliseconds();
                order = _this426.parseOrder(_this426.extend({
                    'timestamp': timestamp,
                    'status': 'open',
                    'type': type,
                    'side': side,
                    'price': price,
                    'amount': amount
                }, response), m);
                id = order['id'];

                _this426.orders[id] = order;
                return _this426.extend({ 'info': response }, order);
            });
        },
        fetchOrder: function fetchOrder(id) {
            var found,
                _this427 = this;

            return Promise.resolve().then(function () {
                return _this427.loadMarkets();
            }).then(function () {
                found = id in _this427.orders;

                if (!found) {
                    throw new ExchangeError(_this427.id + ' order ' + id + ' not found');
                }return _this427.orders[id];
            });
        },
        fetchOrderTrades: function fetchOrderTrades(id) {
            var params,
                trades,
                _this428 = this,
                _arguments416 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments416.length > 1 && _arguments416[1] !== undefined ? _arguments416[1] : {};
                return _this428.loadMarkets();
            }).then(function () {
                return _this428.privatePostReturnOrderTrades(_this428.extend({
                    'orderNumber': id
                }, params));
            }).then(function (_resp) {
                trades = _resp;

                return _this428.parseTrades(trades);
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this429 = this,
                _arguments417 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments417.length > 1 && _arguments417[1] !== undefined ? _arguments417[1] : {};
                return _this429.loadMarkets();
            }).then(function () {
                return _this429.privatePostCancelOrder(_this429.extend({
                    'orderNumber': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                response,
                _this430 = this,
                _arguments418 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments418.length > 1 && _arguments418[1] !== undefined ? _arguments418[1] : 'public';
                method = _arguments418.length > 2 && _arguments418[2] !== undefined ? _arguments418[2] : 'GET';
                params = _arguments418.length > 3 && _arguments418[3] !== undefined ? _arguments418[3] : {};
                headers = _arguments418.length > 4 && _arguments418[4] !== undefined ? _arguments418[4] : undefined;
                body = _arguments418.length > 5 && _arguments418[5] !== undefined ? _arguments418[5] : undefined;
                url = _this430.urls['api'][api];
                query = _this430.extend({ 'command': path }, params);

                if (api == 'public') {
                    url += '?' + _this430.urlencode(query);
                } else {
                    query['nonce'] = _this430.nonce();
                    body = _this430.urlencode(query);
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Key': _this430.apiKey,
                        'Sign': _this430.hmac(_this430.encode(body), _this430.encode(_this430.secret), 'sha512')
                    };
                }
                return _this430.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this430.id + ' ' + _this430.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var quadrigacx = {

        'id': 'quadrigacx',
        'name': 'QuadrigaCX',
        'countries': 'CA',
        'rateLimit': 1000,
        'version': 'v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766825-98a6d0de-5ee7-11e7-9fa4-38e11a2c6f52.jpg',
            'api': 'https://api.quadrigacx.com',
            'www': 'https://www.quadrigacx.com',
            'doc': 'https://www.quadrigacx.com/api_info'
        },
        'api': {
            'public': {
                'get': ['order_book', 'ticker', 'transactions']
            },
            'private': {
                'post': ['balance', 'bitcoin_deposit_address', 'bitcoin_withdrawal', 'buy', 'cancel_order', 'ether_deposit_address', 'ether_withdrawal', 'lookup_order', 'open_orders', 'sell', 'user_transactions']
            }
        },
        'markets': {
            'BTC/CAD': { 'id': 'btc_cad', 'symbol': 'BTC/CAD', 'base': 'BTC', 'quote': 'CAD' },
            'BTC/USD': { 'id': 'btc_usd', 'symbol': 'BTC/USD', 'base': 'BTC', 'quote': 'USD' },
            'ETH/BTC': { 'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC' },
            'ETH/CAD': { 'id': 'eth_cad', 'symbol': 'ETH/CAD', 'base': 'ETH', 'quote': 'CAD' }
        },

        fetchBalance: function fetchBalance() {
            var balances,
                result,
                c,
                currency,
                lowercase,
                account,
                _this431 = this;

            return Promise.resolve().then(function () {
                return _this431.privatePostBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (c = 0; c < _this431.currencies.length; c++) {
                    currency = _this431.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': parseFloat(balances[lowercase + '_available']),
                        'used': parseFloat(balances[lowercase + '_reserved']),
                        'total': parseFloat(balances[lowercase + '_balance'])
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this432 = this,
                _arguments420 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments420.length > 1 && _arguments420[1] !== undefined ? _arguments420[1] : {};
                return _this432.publicGetOrderBook(_this432.extend({
                    'book': _this432.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = parseInt(orderbook['timestamp']) * 1000;
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this432.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this433 = this;

            return Promise.resolve().then(function () {
                return _this433.publicGetTicker({
                    'book': _this433.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = parseInt(ticker['timestamp']) * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this433.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['bid']),
                    'ask': parseFloat(ticker['ask']),
                    'vwap': parseFloat(ticker['vwap']),
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['volume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this434 = this;

            return _this434.publicGetTransactions({
                'book': _this434.marketId(market)
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                method,
                order,
                response,
                _this435 = this,
                _arguments423 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments423.length > 4 && _arguments423[4] !== undefined ? _arguments423[4] : undefined;
                params = _arguments423.length > 5 && _arguments423[5] !== undefined ? _arguments423[5] : {};
                method = 'privatePost' + _this435.capitalize(side);
                order = {
                    'amount': amount,
                    'book': _this435.marketId(market)
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this435[method](_this435.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this436 = this,
                _arguments424 = arguments;

            params = _arguments424.length > 1 && _arguments424[1] !== undefined ? _arguments424[1] : {};

            return _this436.privatePostCancelOrder(_this436.extend({
                'id': id
            }, params));
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                request,
                signature,
                query,
                response,
                _this437 = this,
                _arguments425 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments425.length > 1 && _arguments425[1] !== undefined ? _arguments425[1] : 'public';
                method = _arguments425.length > 2 && _arguments425[2] !== undefined ? _arguments425[2] : 'GET';
                params = _arguments425.length > 3 && _arguments425[3] !== undefined ? _arguments425[3] : {};
                headers = _arguments425.length > 4 && _arguments425[4] !== undefined ? _arguments425[4] : undefined;
                body = _arguments425.length > 5 && _arguments425[5] !== undefined ? _arguments425[5] : undefined;
                url = _this437.urls['api'] + '/' + _this437.version + '/' + path;

                if (api == 'public') {
                    url += '?' + _this437.urlencode(params);
                } else {
                    if (!_this437.uid) {
                        throw new AuthenticationError(_this437.id + ' requires `' + _this437.id + '.uid` property for authentication');
                    }nonce = _this437.nonce();
                    request = [nonce.toString(), _this437.uid, _this437.apiKey].join('');
                    signature = _this437.hmac(_this437.encode(request), _this437.encode(_this437.secret));
                    query = _this437.extend({
                        'key': _this437.apiKey,
                        'nonce': nonce,
                        'signature': signature
                    }, params);

                    body = _this437.json(query);
                    headers = {
                        'Content-Type': 'application/json',
                        'Content-Length': body.length
                    };
                }
                return _this437.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this437.id + ' ' + _this437.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var quoine = {

        'id': 'quoine',
        'name': 'QUOINE',
        'countries': ['JP', 'SG', 'VN'],
        'version': '2',
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766844-9615a4e8-5ee8-11e7-8814-fcd004db8cdd.jpg',
            'api': 'https://api.quoine.com',
            'www': 'https://www.quoine.com',
            'doc': 'https://developers.quoine.com'
        },
        'api': {
            'public': {
                'get': ['products', 'products/{id}', 'products/{id}/price_levels', 'executions', 'ir_ladders/{currency}']
            },
            'private': {
                'get': ['accounts/balance', 'crypto_accounts', 'executions/me', 'fiat_accounts', 'loan_bids', 'loans', 'orders', 'orders/{id}', 'orders/{id}/trades', 'trades', 'trades/{id}/loans', 'trading_accounts', 'trading_accounts/{id}'],
                'post': ['fiat_accounts', 'loan_bids', 'orders'],
                'put': ['loan_bids/{id}/close', 'loans/{id}', 'orders/{id}', 'orders/{id}/cancel', 'trades/{id}', 'trades/{id}/close', 'trades/close_all', 'trading_accounts/{id}']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this438 = this;

            return Promise.resolve().then(function () {
                return _this438.publicGetProducts();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['id'];
                    base = market['base_currency'];
                    quote = market['quoted_currency'];
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var balances,
                result,
                b,
                balance,
                currency,
                total,
                account,
                _this439 = this;

            return Promise.resolve().then(function () {
                return _this439.loadMarkets();
            }).then(function () {
                return _this439.privateGetAccountsBalance();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    total = parseFloat(balance['balance']);
                    account = {
                        'free': total,
                        'used': undefined,
                        'total': total
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this440 = this,
                _arguments428 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments428.length > 1 && _arguments428[1] !== undefined ? _arguments428[1] : {};
                return _this440.loadMarkets();
            }).then(function () {
                return _this440.publicGetProductsIdPriceLevels(_this440.extend({
                    'id': _this440.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this440.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this440.iso8601(timestamp)
                };
                sides = { 'bids': 'buy_price_levels', 'asks': 'sell_price_levels' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            var last = undefined;
            if ('last_traded_price' in ticker) {
                if (ticker['last_traded_price']) {
                    var length = ticker['last_traded_price'].length;
                    if (length > 0) last = parseFloat(ticker['last_traded_price']);
                }
            }
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high_market_ask']),
                'low': parseFloat(ticker['low_market_bid']),
                'bid': parseFloat(ticker['market_bid']),
                'ask': parseFloat(ticker['market_ask']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': last,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['volume_24h']),
                'quoteVolume': undefined,
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                result,
                t,
                ticker,
                base,
                quote,
                symbol,
                market,
                _this441 = this;

            return Promise.resolve().then(function () {
                return _this441.loadMarkets();
            }).then(function () {
                return _this441.publicGetProducts();
            }).then(function (_resp) {
                tickers = _resp;
                result = {};

                for (t = 0; t < tickers.length; t++) {
                    ticker = tickers[t];
                    base = ticker['base_currency'];
                    quote = ticker['quoted_currency'];
                    symbol = base + '/' + quote;
                    market = _this441.markets[symbol];

                    result[symbol] = _this441.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this442 = this;

            return Promise.resolve().then(function () {
                return _this442.loadMarkets();
            }).then(function () {
                p = _this442.market(market);
                return _this442.publicGetProductsId({
                    'id': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this442.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this443 = this;

            return Promise.resolve().then(function () {
                return _this443.loadMarkets();
            }).then(function () {
                return _this443.publicGetExecutions({
                    'product_id': _this443.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this444 = this,
                _arguments432 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments432.length > 4 && _arguments432[4] !== undefined ? _arguments432[4] : undefined;
                params = _arguments432.length > 5 && _arguments432[5] !== undefined ? _arguments432[5] : {};
                return _this444.loadMarkets();
            }).then(function () {
                order = {
                    'order_type': type,
                    'product_id': _this444.marketId(market),
                    'side': side,
                    'quantity': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this444.privatePostOrders(_this444.extend({
                    'order': order
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this445 = this,
                _arguments433 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments433.length > 1 && _arguments433[1] !== undefined ? _arguments433[1] : {};
                return _this445.loadMarkets();
            }).then(function () {
                return _this445.privatePutOrdersIdCancel(_this445.extend({
                    'id': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                request,
                response,
                _this446 = this,
                _arguments434 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments434.length > 1 && _arguments434[1] !== undefined ? _arguments434[1] : 'public';
                method = _arguments434.length > 2 && _arguments434[2] !== undefined ? _arguments434[2] : 'GET';
                params = _arguments434.length > 3 && _arguments434[3] !== undefined ? _arguments434[3] : {};
                headers = _arguments434.length > 4 && _arguments434[4] !== undefined ? _arguments434[4] : undefined;
                body = _arguments434.length > 5 && _arguments434[5] !== undefined ? _arguments434[5] : undefined;
                url = '/' + _this446.implodeParams(path, params);
                query = _this446.omit(params, _this446.extractParams(path));

                headers = {
                    'X-Quoine-API-Version': _this446.version,
                    'Content-Type': 'application/json'
                };
                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this446.urlencode(query);
                    }
                } else {
                    nonce = _this446.nonce();
                    request = {
                        'path': url,
                        'nonce': nonce,
                        'token_id': _this446.apiKey,
                        'iat': Math.floor(nonce / 1000) // issued at
                    };

                    if (Object.keys(query).length) {
                        body = _this446.json(query);
                    }headers['X-Quoine-Auth'] = _this446.jwt(request, _this446.secret);
                }
                return _this446.fetch(_this446.urls['api'] + url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('message' in response) {
                    throw new ExchangeError(_this446.id + ' ' + _this446.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var southxchange = {

        'id': 'southxchange',
        'name': 'SouthXchange',
        'countries': 'AR', // Argentina
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27838912-4f94ec8a-60f6-11e7-9e5d-bbf9bd50a559.jpg',
            'api': 'https://www.southxchange.com/api',
            'www': 'https://www.southxchange.com',
            'doc': 'https://www.southxchange.com/Home/Api'
        },
        'api': {
            'public': {
                'get': ['markets', 'price/{symbol}', 'prices', 'book/{symbol}', 'trades/{symbol}']
            },
            'private': {
                'post': ['cancelMarketOrders', 'cancelOrder', 'generatenewaddress', 'listOrders', 'listBalances', 'placeOrder', 'withdraw']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                base,
                quote,
                symbol,
                id,
                _this447 = this;

            return Promise.resolve().then(function () {
                return _this447.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    base = market[0];
                    quote = market[1];
                    symbol = base + '/' + quote;
                    id = symbol;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var balances,
                result,
                b,
                balance,
                currency,
                uppercase,
                free,
                used,
                total,
                account,
                _this448 = this;

            return Promise.resolve().then(function () {
                return _this448.loadMarkets();
            }).then(function () {
                return _this448.privatePostListBalances();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['Currency'];
                    uppercase = currency.uppercase;
                    free = parseFloat(balance['Available']);
                    used = parseFloat(balance['Unconfirmed']);
                    total = _this448.sum(free, used);
                    account = {
                        'free': free,
                        'used': used,
                        'total': total
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this449 = this,
                _arguments437 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments437.length > 1 && _arguments437[1] !== undefined ? _arguments437[1] : {};
                return _this449.loadMarkets();
            }).then(function () {
                return _this449.publicGetBookSymbol(_this449.extend({
                    'symbol': _this449.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this449.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this449.iso8601(timestamp)
                };
                sides = { 'bids': 'BuyOrders', 'asks': 'SellOrders' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['Price']);
                        amount = parseFloat(order['Amount']);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.milliseconds();
            var bid = undefined;
            var ask = undefined;
            if ('Bid' in ticker) if (ticker['Bid']) bid = parseFloat(ticker['Bid']);
            if ('Ask' in ticker) if (ticker['Ask']) ask = parseFloat(ticker['Ask']);
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': undefined,
                'low': undefined,
                'bid': bid,
                'ask': ask,
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['Last']),
                'change': parseFloat(ticker['Variation24Hr']),
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['Volume24Hr']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this450 = this;

            return Promise.resolve().then(function () {
                return _this450.loadMarkets();
            }).then(function () {
                return _this450.publicGetPrices();
            }).then(function (_resp) {
                response = _resp;
                tickers = _this450.indexBy(response, 'Market');
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this450.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this450.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this451 = this;

            return Promise.resolve().then(function () {
                return _this451.loadMarkets();
            }).then(function () {
                p = _this451.market(market);
                return _this451.publicGetPriceSymbol({
                    'symbol': _this451.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this451.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this452 = this;

            return Promise.resolve().then(function () {
                return _this452.loadMarkets();
            }).then(function () {
                return _this452.publicGetTradesSymbol({
                    'symbol': _this452.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                order,
                response,
                _this453 = this,
                _arguments441 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments441.length > 4 && _arguments441[4] !== undefined ? _arguments441[4] : undefined;
                params = _arguments441.length > 5 && _arguments441[5] !== undefined ? _arguments441[5] : {};
                return _this453.loadMarkets();
            }).then(function () {
                p = _this453.market(market);
                order = {
                    'listingCurrency': p['base'],
                    'referenceCurrency': p['quote'],
                    'type': side,
                    'amount': amount
                };

                if (type == 'limit') {
                    order['limitPrice'] = price;
                }return _this453.privatePostPlaceOrder(_this453.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response.toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this454 = this,
                _arguments442 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments442.length > 1 && _arguments442[1] !== undefined ? _arguments442[1] : {};
                return _this454.loadMarkets();
            }).then(function () {
                return _this454.privatePostCancelOrder(_this454.extend({
                    'orderCode': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                response,
                _this455 = this,
                _arguments443 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments443.length > 1 && _arguments443[1] !== undefined ? _arguments443[1] : 'public';
                method = _arguments443.length > 2 && _arguments443[2] !== undefined ? _arguments443[2] : 'GET';
                params = _arguments443.length > 3 && _arguments443[3] !== undefined ? _arguments443[3] : {};
                headers = _arguments443.length > 4 && _arguments443[4] !== undefined ? _arguments443[4] : undefined;
                body = _arguments443.length > 5 && _arguments443[5] !== undefined ? _arguments443[5] : undefined;
                url = _this455.urls['api'] + '/' + _this455.implodeParams(path, params);
                query = _this455.omit(params, _this455.extractParams(path));

                if (api == 'private') {
                    nonce = _this455.nonce();

                    query = _this455.extend({
                        'key': _this455.apiKey,
                        'nonce': nonce
                    }, query);
                    body = _this455.json(query);
                    headers = {
                        'Content-Type': 'application/json',
                        'Hash': _this455.hmac(_this455.encode(body), _this455.encode(_this455.secret), 'sha512')
                    };
                }
                return _this455.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;
                // if (!response)
                //     throw new ExchangeError (this.id + ' ' + this.json (response));

                return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var surbitcoin = extend(blinktrade, {
        'id': 'surbitcoin',
        'name': 'SurBitcoin',
        'countries': 'VE',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27991511-f0a50194-6481-11e7-99b5-8f02932424cc.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://surbitcoin.com',
            'doc': 'https://blinktrade.com/docs'
        },
        'comment': 'Blinktrade API',
        'markets': {
            'BTC/VEF': { 'id': 'BTCVEF', 'symbol': 'BTC/VEF', 'base': 'BTC', 'quote': 'VEF', 'brokerId': 1, 'broker': 'SurBitcoin' }
        }
    });

    //-----------------------------------------------------------------------------

    var therock = {

        'id': 'therock',
        'name': 'TheRockTrading',
        'countries': 'MT',
        'rateLimit': 1000,
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766869-75057fa2-5ee9-11e7-9a6f-13e641fa4707.jpg',
            'api': 'https://api.therocktrading.com',
            'www': 'https://therocktrading.com',
            'doc': ['https://api.therocktrading.com/doc/v1/index.html', 'https://api.therocktrading.com/doc/']
        },
        'api': {
            'public': {
                'get': ['funds/{id}/orderbook', 'funds/{id}/ticker', 'funds/{id}/trades', 'funds/tickers']
            },
            'private': {
                'get': ['balances', 'balances/{id}', 'discounts', 'discounts/{id}', 'funds', 'funds/{id}', 'funds/{id}/trades', 'funds/{fund_id}/orders', 'funds/{fund_id}/orders/{id}', 'funds/{fund_id}/position_balances', 'funds/{fund_id}/positions', 'funds/{fund_id}/positions/{id}', 'transactions', 'transactions/{id}', 'withdraw_limits/{id}', 'withdraw_limits'],
                'post': ['atms/withdraw', 'funds/{fund_id}/orders'],
                'delete': ['funds/{fund_id}/orders/{id}', 'funds/{fund_id}/orders/remove_all']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this456 = this;

            return Promise.resolve().then(function () {
                return _this456.publicGetFundsTickers();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets['tickers'].length; p++) {
                    market = markets['tickers'][p];
                    id = market['fund_id'];
                    base = id.slice(0, 3);
                    quote = id.slice(3, 6);
                    symbol = base + '/' + quote;

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                b,
                balance,
                currency,
                free,
                total,
                used,
                account,
                _this457 = this;

            return Promise.resolve().then(function () {
                return _this457.loadMarkets();
            }).then(function () {
                return _this457.privateGetBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['balances'];
                result = { 'info': response };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    free = balance['trading_balance'];
                    total = balance['balance'];
                    used = total - free;
                    account = {
                        'free': free,
                        'used': used,
                        'total': total
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this458 = this,
                _arguments446 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments446.length > 1 && _arguments446[1] !== undefined ? _arguments446[1] : {};
                return _this458.loadMarkets();
            }).then(function () {
                return _this458.publicGetFundsIdOrderbook(_this458.extend({
                    'id': _this458.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this458.parse8601(orderbook['date']);
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this458.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['amount']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = this.parse8601(ticker['date']);
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['bid']),
                'ask': parseFloat(ticker['ask']),
                'vwap': undefined,
                'open': parseFloat(ticker['open']),
                'close': parseFloat(ticker['close']),
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': parseFloat(ticker['volume_traded']),
                'quoteVolume': parseFloat(ticker['volume']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var response,
                tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                ticker,
                _this459 = this;

            return Promise.resolve().then(function () {
                return _this459.loadMarkets();
            }).then(function () {
                return _this459.publicGetFundsTickers();
            }).then(function (_resp) {
                response = _resp;
                tickers = _this459.indexBy(response['tickers'], 'fund_id');
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = _this459.markets_by_id[id];
                    symbol = market['symbol'];
                    ticker = tickers[id];

                    result[symbol] = _this459.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                ticker,
                _this460 = this;

            return Promise.resolve().then(function () {
                return _this460.loadMarkets();
            }).then(function () {
                p = _this460.market(market);
                return _this460.publicGetFundsIdTicker({
                    'id': p['id']
                });
            }).then(function (_resp) {
                ticker = _resp;

                return _this460.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this461 = this;

            return Promise.resolve().then(function () {
                return _this461.loadMarkets();
            }).then(function () {
                return _this461.publicGetFundsIdTrades({
                    'id': _this461.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this462 = this,
                _arguments450 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments450.length > 4 && _arguments450[4] !== undefined ? _arguments450[4] : undefined;
                params = _arguments450.length > 5 && _arguments450[5] !== undefined ? _arguments450[5] : {};
                return _this462.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this462.id + ' allows limit orders only');
                }return _this462.privatePostFundsFundIdOrders(_this462.extend({
                    'fund_id': _this462.marketId(market),
                    'side': side,
                    'amount': amount,
                    'price': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this463 = this,
                _arguments451 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments451.length > 1 && _arguments451[1] !== undefined ? _arguments451[1] : {};
                return _this463.loadMarkets();
            }).then(function () {
                return _this463.privateDeleteFundsFundIdOrdersId(_this463.extend({
                    'id': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                auth,
                response,
                _this464 = this,
                _arguments452 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments452.length > 1 && _arguments452[1] !== undefined ? _arguments452[1] : 'public';
                method = _arguments452.length > 2 && _arguments452[2] !== undefined ? _arguments452[2] : 'GET';
                params = _arguments452.length > 3 && _arguments452[3] !== undefined ? _arguments452[3] : {};
                headers = _arguments452.length > 4 && _arguments452[4] !== undefined ? _arguments452[4] : undefined;
                body = _arguments452.length > 5 && _arguments452[5] !== undefined ? _arguments452[5] : undefined;
                url = _this464.urls['api'] + '/' + _this464.version + '/' + _this464.implodeParams(path, params);
                query = _this464.omit(params, _this464.extractParams(path));

                if (api == 'private') {
                    nonce = _this464.nonce().toString();
                    auth = nonce + url;

                    headers = {
                        'X-TRT-KEY': _this464.apiKey,
                        'X-TRT-NONCE': nonce,
                        'X-TRT-SIGN': _this464.hmac(_this464.encode(auth), _this464.encode(_this464.secret), 'sha512')
                    };
                    if (Object.keys(query).length) {
                        body = _this464.json(query);
                        headers['Content-Type'] = 'application/json';
                    }
                }
                return _this464.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('errors' in response) {
                    throw new ExchangeError(_this464.id + ' ' + _this464.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var urdubit = extend(blinktrade, {
        'id': 'urdubit',
        'name': 'UrduBit',
        'countries': 'PK',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27991453-156bf3ae-6480-11e7-82eb-7295fe1b5bb4.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://urdubit.com',
            'doc': 'https://blinktrade.com/docs'
        },
        'comment': 'Blinktrade API',
        'markets': {
            'BTC/PKR': { 'id': 'BTCPKR', 'symbol': 'BTC/PKR', 'base': 'BTC', 'quote': 'PKR', 'brokerId': 8, 'broker': 'UrduBit' }
        }
    });

    //-----------------------------------------------------------------------------

    var vaultoro = {

        'id': 'vaultoro',
        'name': 'Vaultoro',
        'countries': 'CH',
        'rateLimit': 1000,
        'version': '1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766880-f205e870-5ee9-11e7-8fe2-0d5b15880752.jpg',
            'api': 'https://api.vaultoro.com',
            'www': 'https://www.vaultoro.com',
            'doc': 'https://api.vaultoro.com'
        },
        'api': {
            'public': {
                'get': ['bidandask', 'buyorders', 'latest', 'latesttrades', 'markets', 'orderbook', 'sellorders', 'transactions/day', 'transactions/hour', 'transactions/month']
            },
            'private': {
                'get': ['balance', 'mytrades', 'orders'],
                'post': ['buy/{symbol}/{type}', 'cancel/{id}', 'sell/{symbol}/{type}', 'withdraw']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var result,
                markets,
                market,
                base,
                quote,
                symbol,
                baseId,
                quoteId,
                id,
                _this465 = this;

            return Promise.resolve().then(function () {
                result = [];
                return _this465.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                market = markets['data'];
                base = market['BaseCurrency'];
                quote = market['MarketCurrency'];
                symbol = base + '/' + quote;
                baseId = base;
                quoteId = quote;
                id = market['MarketName'];

                result.push({
                    'id': id,
                    'symbol': symbol,
                    'base': base,
                    'quote': quote,
                    'baseId': baseId,
                    'quoteId': quoteId,
                    'info': market
                });
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                b,
                balance,
                currency,
                uppercase,
                free,
                used,
                total,
                account,
                _this466 = this;

            return Promise.resolve().then(function () {
                return _this466.loadMarkets();
            }).then(function () {
                return _this466.privateGetBalance();
            }).then(function (_resp) {
                response = _resp;
                balances = response['data'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency_code'];
                    uppercase = currency.toUpperCase();
                    free = balance['cash'];
                    used = balance['reserved'];
                    total = _this466.sum(free, used);
                    account = {
                        'free': free,
                        'used': used,
                        'total': total
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this467 = this,
                _arguments455 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments455.length > 1 && _arguments455[1] !== undefined ? _arguments455[1] : {};
                return _this467.loadMarkets();
            }).then(function () {
                return _this467.publicGetOrderbook(params);
            }).then(function (_resp) {
                response = _resp;
                orderbook = {
                    'bids': response['data'][0]['b'],
                    'asks': response['data'][1]['s']
                };
                timestamp = _this467.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this467.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = order['Gold_Price'];
                        amount = order['Gold_Amount'];

                        result[side].push([price, amount]);
                    }
                }
                result['bids'] = _this467.sortBy(result['bids'], 0, true);
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var quote,
                bidsLength,
                bid,
                ask,
                response,
                ticker,
                timestamp,
                _this468 = this;

            return Promise.resolve().then(function () {
                return _this468.loadMarkets();
            }).then(function () {
                return _this468.publicGetBidandask();
            }).then(function (_resp) {
                quote = _resp;
                bidsLength = quote['bids'].length;
                bid = quote['bids'][bidsLength - 1];
                ask = quote['asks'][0];
                return _this468.publicGetMarkets();
            }).then(function (_resp) {
                response = _resp;
                ticker = response['data'];
                timestamp = _this468.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this468.iso8601(timestamp),
                    'high': parseFloat(ticker['24hHigh']),
                    'low': parseFloat(ticker['24hLow']),
                    'bid': bid[0],
                    'ask': ask[0],
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['LastPrice']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': parseFloat(ticker['24hVolume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this469 = this;

            return Promise.resolve().then(function () {
                return _this469.loadMarkets();
            }).then(function () {
                return _this469.publicGetTransactionsDay();
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                p,
                method,
                response,
                _this470 = this,
                _arguments458 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments458.length > 4 && _arguments458[4] !== undefined ? _arguments458[4] : undefined;
                params = _arguments458.length > 5 && _arguments458[5] !== undefined ? _arguments458[5] : {};
                return _this470.loadMarkets();
            }).then(function () {
                p = _this470.market(market);
                method = 'privatePost' + _this470.capitalize(side) + 'SymbolType';
                return _this470[method](_this470.extend({
                    'symbol': p['quoteId'].toLowerCase(),
                    'type': type,
                    'gld': amount,
                    'price': price || 1
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['data']['Order_ID']
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this471 = this,
                _arguments459 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments459.length > 1 && _arguments459[1] !== undefined ? _arguments459[1] : {};
                return _this471.loadMarkets();
            }).then(function () {
                return _this471.privatePostCancelId(_this471.extend({
                    'id': id
                }, params));
            });
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'public';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            var url = this.urls['api'] + '/';
            if (api == 'public') {
                url += path;
            } else {
                var nonce = this.nonce();
                url += this.version + '/' + this.implodeParams(path, params);
                var query = this.extend({
                    'nonce': nonce,
                    'apikey': this.apiKey
                }, this.omit(params, this.extractParams(path)));
                url += '?' + this.urlencode(query);
                headers = {
                    'Content-Type': 'application/json',
                    'X-Signature': this.hmac(this.encode(url), this.encode(this.secret))
                };
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var vbtc = extend(blinktrade, {
        'id': 'vbtc',
        'name': 'VBTC',
        'countries': 'VN',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27991481-1f53d1d8-6481-11e7-884e-21d17e7939db.jpg',
            'api': {
                'public': 'https://api.blinktrade.com/api',
                'private': 'https://api.blinktrade.com/tapi'
            },
            'www': 'https://vbtc.exchange',
            'doc': 'https://blinktrade.com/docs'
        },
        'comment': 'Blinktrade API',
        'markets': {
            'BTC/VND': { 'id': 'BTCVND', 'symbol': 'BTC/VND', 'base': 'BTC', 'quote': 'VND', 'brokerId': 3, 'broker': 'VBTC' }
        }
    });

    //-----------------------------------------------------------------------------

    var virwox = {

        'id': 'virwox',
        'name': 'VirWoX',
        'countries': 'AT',
        'rateLimit': 1000,
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766894-6da9d360-5eea-11e7-90aa-41f2711b7405.jpg',
            'api': {
                'public': 'http://api.virwox.com/api/json.php',
                'private': 'https://www.virwox.com/api/trading.php'
            },
            'www': 'https://www.virwox.com',
            'doc': 'https://www.virwox.com/developers.php'
        },
        'api': {
            'public': {
                'get': ['getInstruments', 'getBestPrices', 'getMarketDepth', 'estimateMarketOrder', 'getTradedPriceVolume', 'getRawTradeData', 'getStatistics', 'getTerminalList', 'getGridList', 'getGridStatistics'],
                'post': ['getInstruments', 'getBestPrices', 'getMarketDepth', 'estimateMarketOrder', 'getTradedPriceVolume', 'getRawTradeData', 'getStatistics', 'getTerminalList', 'getGridList', 'getGridStatistics']
            },
            'private': {
                'get': ['cancelOrder', 'getBalances', 'getCommissionDiscount', 'getOrders', 'getTransactions', 'placeOrder'],
                'post': ['cancelOrder', 'getBalances', 'getCommissionDiscount', 'getOrders', 'getTransactions', 'placeOrder']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                market,
                id,
                symbol,
                base,
                quote,
                _this472 = this;

            return Promise.resolve().then(function () {
                return _this472.publicGetInstruments();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets['result']);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    market = markets['result'][keys[p]];
                    id = market['instrumentID'];
                    symbol = market['symbol'];
                    base = market['longCurrency'];
                    quote = market['shortCurrency'];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                b,
                balance,
                currency,
                total,
                account,
                _this473 = this;

            return Promise.resolve().then(function () {
                return _this473.loadMarkets();
            }).then(function () {
                return _this473.privatePostGetBalances();
            }).then(function (_resp) {
                response = _resp;
                balances = response['result']['accountList'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    total = balance['balance'];
                    account = {
                        'free': total,
                        'used': undefined,
                        'total': total
                    };

                    result[currency] = account;
                }
                return result;
            });
        },
        fetchBestPrices: function fetchBestPrices(market) {
            var _this474 = this;

            return Promise.resolve().then(function () {
                return _this474.loadMarkets();
            }).then(function () {
                return _this474.publicPostGetBestPrices({
                    'symbols': [_this474.symbol(market)]
                });
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                response,
                orderbook,
                timestamp,
                result,
                sides,
                keys,
                k,
                key,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this475 = this,
                _arguments463 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments463.length > 1 && _arguments463[1] !== undefined ? _arguments463[1] : {};
                return _this475.loadMarkets();
            }).then(function () {
                return _this475.publicPostGetMarketDepth(_this475.extend({
                    'symbols': [_this475.symbol(market)],
                    'buyDepth': 100,
                    'sellDepth': 100
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response['result'][0];
                timestamp = _this475.milliseconds();
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this475.iso8601(timestamp)
                };
                sides = { 'bids': 'buy', 'asks': 'sell' };
                keys = Object.keys(sides);

                for (k = 0; k < keys.length; k++) {
                    key = keys[k];
                    side = sides[key];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['price']);
                        amount = parseFloat(order['volume']);

                        result[key].push([price, amount]);
                    }
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var end,
                start,
                response,
                tickers,
                keys,
                length,
                lastKey,
                ticker,
                timestamp,
                _this476 = this;

            return Promise.resolve().then(function () {
                return _this476.loadMarkets();
            }).then(function () {
                end = _this476.milliseconds();
                start = end - 86400000;
                return _this476.publicGetTradedPriceVolume({
                    'instrument': _this476.symbol(market),
                    'endDate': _this476.yyyymmddhhmmss(end),
                    'startDate': _this476.yyyymmddhhmmss(start),
                    'HLOC': 1
                });
            }).then(function (_resp) {
                response = _resp;
                tickers = response['result']['priceVolumeList'];
                keys = Object.keys(tickers);
                length = keys.length;
                lastKey = keys[length - 1];
                ticker = tickers[lastKey];
                timestamp = _this476.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this476.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': undefined,
                    'ask': undefined,
                    'vwap': undefined,
                    'open': parseFloat(ticker['open']),
                    'close': parseFloat(ticker['close']),
                    'first': undefined,
                    'last': undefined,
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': parseFloat(ticker['longVolume']),
                    'quoteVolume': parseFloat(ticker['shortVolume']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this477 = this;

            return Promise.resolve().then(function () {
                return _this477.loadMarkets();
            }).then(function () {
                return _this477.publicGetRawTradeData({
                    'instrument': _this477.symbol(market),
                    'timespan': 3600
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this478 = this,
                _arguments466 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments466.length > 4 && _arguments466[4] !== undefined ? _arguments466[4] : undefined;
                params = _arguments466.length > 5 && _arguments466[5] !== undefined ? _arguments466[5] : {};
                return _this478.loadMarkets();
            }).then(function () {
                order = {
                    'instrument': _this478.symbol(market),
                    'orderType': side.toUpperCase(),
                    'amount': amount
                };

                if (type == 'limit') {
                    order['price'] = price;
                }return _this478.privatePostPlaceOrder(_this478.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['orderID'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this479 = this,
                _arguments467 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments467.length > 1 && _arguments467[1] !== undefined ? _arguments467[1] : {};
                return _this479.loadMarkets();
            }).then(function () {
                return _this479.privatePostCancelOrder(_this479.extend({
                    'orderID': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                auth,
                nonce,
                response,
                _this480 = this,
                _arguments468 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments468.length > 1 && _arguments468[1] !== undefined ? _arguments468[1] : 'public';
                method = _arguments468.length > 2 && _arguments468[2] !== undefined ? _arguments468[2] : 'GET';
                params = _arguments468.length > 3 && _arguments468[3] !== undefined ? _arguments468[3] : {};
                headers = _arguments468.length > 4 && _arguments468[4] !== undefined ? _arguments468[4] : undefined;
                body = _arguments468.length > 5 && _arguments468[5] !== undefined ? _arguments468[5] : undefined;
                url = _this480.urls['api'][api];
                auth = {};

                if (api == 'private') {
                    auth['key'] = _this480.apiKey;
                    auth['user'] = _this480.login;
                    auth['pass'] = _this480.password;
                }
                nonce = _this480.nonce();

                if (method == 'GET') {
                    url += '?' + _this480.urlencode(_this480.extend({
                        'method': path,
                        'id': nonce
                    }, auth, params));
                } else {
                    headers = { 'Content-Type': 'application/json' };
                    body = _this480.json({
                        'method': path,
                        'params': _this480.extend(auth, params),
                        'id': nonce
                    });
                }
                return _this480.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    if (response['error']) {
                        throw new ExchangeError(_this480.id + ' ' + _this480.json(response));
                    }
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var xbtce = {

        'id': 'xbtce',
        'name': 'xBTCe',
        'countries': 'RU',
        'rateLimit': 2000, // responses are cached every 2 seconds
        'version': 'v1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28059414-e235970c-662c-11e7-8c3a-08e31f78684b.jpg',
            'api': 'https://cryptottlivewebapi.xbtce.net:8443/api',
            'www': 'https://www.xbtce.com',
            'doc': ['https://www.xbtce.com/tradeapi', 'https://support.xbtce.info/Knowledgebase/Article/View/52/25/xbtce-exchange-api']
        },
        'api': {
            'public': {
                'get': ['currency', 'currency/{filter}', 'level2', 'level2/{filter}', 'quotehistory/{symbol}/{periodicity}/bars/ask', 'quotehistory/{symbol}/{periodicity}/bars/bid', 'quotehistory/{symbol}/level2', 'quotehistory/{symbol}/ticks', 'symbol', 'symbol/{filter}', 'tick', 'tick/{filter}', 'ticker', 'ticker/{filter}', 'tradesession']
            },
            'private': {
                'get': ['tradeserverinfo', 'tradesession', 'currency', 'currency/{filter}', 'level2', 'level2/{filter}', 'symbol', 'symbol/{filter}', 'tick', 'tick/{filter}', 'account', 'asset', 'asset/{id}', 'position', 'position/{id}', 'trade', 'trade/{id}', 'quotehistory/{symbol}/{periodicity}/bars/ask', 'quotehistory/{symbol}/{periodicity}/bars/ask/info', 'quotehistory/{symbol}/{periodicity}/bars/bid', 'quotehistory/{symbol}/{periodicity}/bars/bid/info', 'quotehistory/{symbol}/level2', 'quotehistory/{symbol}/level2/info', 'quotehistory/{symbol}/periodicities', 'quotehistory/{symbol}/ticks', 'quotehistory/{symbol}/ticks/info', 'quotehistory/cache/{symbol}/{periodicity}/bars/ask', 'quotehistory/cache/{symbol}/{periodicity}/bars/bid', 'quotehistory/cache/{symbol}/level2', 'quotehistory/cache/{symbol}/ticks', 'quotehistory/symbols', 'quotehistory/version'],
                'post': ['trade', 'tradehistory'],
                'put': ['trade'],
                'delete': ['trade']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                base,
                quote,
                symbol,
                _this481 = this;

            return Promise.resolve().then(function () {
                return _this481.privateGetSymbol();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['Symbol'];
                    base = market['MarginCurrency'];
                    quote = market['ProfitCurrency'];

                    if (base == 'DSH') {
                        base = 'DASH';
                    }symbol = base + '/' + quote;

                    symbol = market['IsTradeAllowed'] ? symbol : id;
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var balances,
                result,
                b,
                balance,
                currency,
                uppercase,
                total,
                account,
                _this482 = this;

            return Promise.resolve().then(function () {
                return _this482.loadMarkets();
            }).then(function () {
                return _this482.privateGetAsset();
            }).then(function (_resp) {
                balances = _resp;
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['Currency'];
                    uppercase = currency.toUpperCase();
                    // xbtce names DASH incorrectly as DSH

                    if (uppercase == 'DSH') {
                        uppercase = 'DASH';
                    }total = balance['balance'];
                    account = {
                        'free': balance['FreeAmount'],
                        'used': balance['LockedAmount'],
                        'total': balance['Amount']
                    };

                    result[uppercase] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                Side,
                orders,
                i,
                order,
                price,
                amount,
                _this483 = this,
                _arguments471 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments471.length > 1 && _arguments471[1] !== undefined ? _arguments471[1] : {};
                return _this483.loadMarkets();
            }).then(function () {
                p = _this483.market(market);
                return _this483.privateGetLevel2Filter(_this483.extend({
                    'filter': p['id']
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;

                orderbook = orderbook[0];
                timestamp = orderbook['Timestamp'];
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this483.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    Side = _this483.capitalize(side);
                    orders = orderbook[Side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order['Price']);
                        amount = parseFloat(order['Volume']);

                        result[side].push([price, amount]);
                    }
                }
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = 0;
            var last = undefined;
            if ('LastBuyTimestamp' in ticker) if (timestamp < ticker['LastBuyTimestamp']) {
                timestamp = ticker['LastBuyTimestamp'];
                last = ticker['LastBuyPrice'];
            }
            if ('LastSellTimestamp' in ticker) if (timestamp < ticker['LastSellTimestamp']) {
                timestamp = ticker['LastSellTimestamp'];
                last = ticker['LastSellPrice'];
            }
            if (!timestamp) timestamp = this.milliseconds();
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': ticker['DailyBestBuyPrice'],
                'low': ticker['DailyBestSellPrice'],
                'bid': ticker['BestBid'],
                'ask': ticker['BestAsk'],
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': last,
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': ticker['DailyTradedTotalVolume'],
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                base,
                quote,
                ticker,
                _this484 = this;

            return Promise.resolve().then(function () {
                return _this484.loadMarkets();
            }).then(function () {
                return _this484.publicGetTicker();
            }).then(function (_resp) {
                tickers = _resp;

                tickers = _this484.indexBy(tickers, 'Symbol');
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = undefined;
                    symbol = undefined;

                    if (id in _this484.markets_by_id) {
                        market = _this484.markets_by_id[id];
                        symbol = market['symbol'];
                    } else {
                        base = id.slice(0, 3);
                        quote = id.slice(3, 6);

                        if (base == 'DSH') {
                            base = 'DASH';
                        }if (quote == 'DSH') {
                            quote = 'DASH';
                        }symbol = base + '/' + quote;
                    }
                    ticker = tickers[id];

                    result[symbol] = _this484.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                length,
                ticker,
                _this485 = this;

            return Promise.resolve().then(function () {
                return _this485.loadMarkets();
            }).then(function () {
                p = _this485.market(market);
                return _this485.publicGetTickerFilter({
                    'filter': p['id']
                });
            }).then(function (_resp) {
                tickers = _resp;
                length = tickers.length;

                if (length < 1) {
                    throw new ExchangeError(_this485.id + ' fetchTicker returned empty response, xBTCe public API error');
                }tickers = _this485.indexBy(tickers, 'Symbol');
                ticker = tickers[p['id']];

                return _this485.parseTicker(ticker, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this486 = this;

            return Promise.resolve().then(function () {
                return _this486.loadMarkets();
            }).then(function () {
                // no method for trades?
                return _this486.privateGetTrade();
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this487 = this,
                _arguments475 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments475.length > 4 && _arguments475[4] !== undefined ? _arguments475[4] : undefined;
                params = _arguments475.length > 5 && _arguments475[5] !== undefined ? _arguments475[5] : {};
                return _this487.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this487.id + ' allows limit orders only');
                }return _this487.tapiPostTrade(_this487.extend({
                    'pair': _this487.marketId(market),
                    'type': side,
                    'amount': amount,
                    'rate': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['Id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this488 = this,
                _arguments476 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments476.length > 1 && _arguments476[1] !== undefined ? _arguments476[1] : {};
                return _this488.loadMarkets();
            }).then(function () {
                return _this488.privateDeleteTrade(_this488.extend({
                    'Type': 'Cancel',
                    'Id': id
                }, params));
            });
        },
        nonce: function nonce() {
            return this.milliseconds();
        },
        request: function request(path) {
            var api = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'api';
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
            var params = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
            var body = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : undefined;

            if (!this.apiKey) throw new AuthenticationError(this.id + ' requires apiKey for all requests, their public API is always busy');
            if (!this.uid) throw new AuthenticationError(this.id + ' requires uid property for authentication and trading');
            var url = this.urls['api'] + '/' + this.version;
            if (api == 'public') url += '/' + api;
            url += '/' + this.implodeParams(path, params);
            var query = this.omit(params, this.extractParams(path));
            if (api == 'public') {
                if (Object.keys(query).length) url += '?' + this.urlencode(query);
            } else {
                headers = { 'Accept-Encoding': 'gzip, deflate' };
                var nonce = this.nonce().toString();
                if (method == 'POST') {
                    if (Object.keys(query).length) {
                        headers['Content-Type'] = 'application/json';
                        body = this.json(query);
                    } else url += '?' + this.urlencode(query);
                }
                var auth = nonce + this.uid + this.apiKey + method + url;
                if (body) auth += body;
                var signature = this.hmac(this.encode(auth), this.encode(this.secret), 'sha256', 'base64');
                var credentials = this.uid + ':' + this.apiKey + ':' + nonce + ':' + this.binaryToString(signature);
                headers['Authorization'] = 'HMAC ' + credentials;
            }
            return this.fetch(url, method, headers, body);
        }
    };

    //-----------------------------------------------------------------------------

    var yobit = {

        'id': 'yobit',
        'name': 'YoBit',
        'countries': 'RU',
        'rateLimit': 2000, // responses are cached every 2 seconds
        'version': '3',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766910-cdcbfdae-5eea-11e7-9859-03fea873272d.jpg',
            'api': 'https://yobit.net',
            'www': 'https://www.yobit.net',
            'doc': 'https://www.yobit.net/en/api/'
        },
        'api': {
            'api': {
                'get': ['depth/{pairs}', 'info', 'ticker/{pairs}', 'trades/{pairs}']
            },
            'tapi': {
                'post': ['ActiveOrders', 'CancelOrder', 'GetDepositAddress', 'getInfo', 'OrderInfo', 'Trade', 'TradeHistory', 'WithdrawCoinsToAddress']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                keys,
                result,
                p,
                id,
                market,
                symbol,
                _symbol$split11,
                _symbol$split12,
                base,
                quote,
                _this489 = this;

            return Promise.resolve().then(function () {
                return _this489.apiGetInfo();
            }).then(function (_resp) {
                markets = _resp;
                keys = Object.keys(markets['pairs']);
                result = [];

                for (p = 0; p < keys.length; p++) {
                    id = keys[p];
                    market = markets['pairs'][id];
                    symbol = id.toUpperCase().replace('_', '/');
                    _symbol$split11 = symbol.split('/');
                    _symbol$split12 = _slicedToArray(_symbol$split11, 2);
                    base = _symbol$split12[0];
                    quote = _symbol$split12[1];

                    base = _this489.commonCurrencyCode(base);
                    quote = _this489.commonCurrencyCode(quote);
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                _this490 = this;

            return Promise.resolve().then(function () {
                return _this490.loadMarkets();
            }).then(function () {
                return _this490.tapiPostGetInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['return'];
                result = { 'info': balances };

                for (c = 0; c < _this490.currencies.length; c++) {
                    currency = _this490.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if ('funds' in balances) {
                        if (lowercase in balances['funds']) {
                            account['free'] = balances['funds'][lowercase];
                        }
                    }if ('funds_incl_orders' in balances) {
                        if (lowercase in balances['funds_incl_orders']) {
                            account['total'] = balances['funds_incl_orders'][lowercase];
                        }
                    }if (account['total'] && account['free']) {
                        account['used'] = account['total'] - account['free'];
                    }result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                response,
                orderbook,
                timestamp,
                bids,
                asks,
                result,
                _this491 = this,
                _arguments479 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments479.length > 1 && _arguments479[1] !== undefined ? _arguments479[1] : {};
                return _this491.loadMarkets();
            }).then(function () {
                p = _this491.market(market);
                return _this491.apiGetDepthPairs(_this491.extend({
                    'pairs': p['id']
                }, params));
            }).then(function (_resp) {
                response = _resp;
                orderbook = response[p['id']];
                timestamp = _this491.milliseconds();
                bids = 'bids' in orderbook ? orderbook['bids'] : [];
                asks = 'asks' in orderbook ? orderbook['asks'] : [];
                result = {
                    'bids': bids,
                    'asks': asks,
                    'timestamp': timestamp,
                    'datetime': _this491.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                tickers,
                ticker,
                timestamp,
                _this492 = this;

            return Promise.resolve().then(function () {
                return _this492.loadMarkets();
            }).then(function () {
                p = _this492.market(market);
                return _this492.apiGetTickerPairs({
                    'pairs': p['id']
                });
            }).then(function (_resp) {
                tickers = _resp;
                ticker = tickers[p['id']];
                timestamp = ticker['updated'] * 1000;

                return {
                    'timestamp': timestamp,
                    'datetime': _this492.iso8601(timestamp),
                    'high': parseFloat(ticker['high']),
                    'low': parseFloat(ticker['low']),
                    'bid': parseFloat(ticker['buy']),
                    'ask': parseFloat(ticker['sell']),
                    'vwap': undefined,
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': parseFloat(ticker['last']),
                    'change': undefined,
                    'percentage': undefined,
                    'average': parseFloat(ticker['avg']),
                    'baseVolume': parseFloat(ticker['vol_cur']),
                    'quoteVolume': parseFloat(ticker['vol']),
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this493 = this;

            return Promise.resolve().then(function () {
                return _this493.loadMarkets();
            }).then(function () {
                return _this493.apiGetTradesPairs({
                    'pairs': _this493.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this494 = this,
                _arguments482 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments482.length > 4 && _arguments482[4] !== undefined ? _arguments482[4] : undefined;
                params = _arguments482.length > 5 && _arguments482[5] !== undefined ? _arguments482[5] : {};
                return _this494.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this494.id + ' allows limit orders only');
                }return _this494.tapiPostTrade(_this494.extend({
                    'pair': _this494.marketId(market),
                    'type': side,
                    'amount': amount,
                    'rate': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['return']['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this495 = this,
                _arguments483 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments483.length > 1 && _arguments483[1] !== undefined ? _arguments483[1] : {};
                return _this495.loadMarkets();
            }).then(function () {
                return _this495.tapiPostCancelOrder(_this495.extend({
                    'order_id': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                query,
                nonce,
                _query2,
                response,
                _this496 = this,
                _arguments484 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments484.length > 1 && _arguments484[1] !== undefined ? _arguments484[1] : 'api';
                method = _arguments484.length > 2 && _arguments484[2] !== undefined ? _arguments484[2] : 'GET';
                params = _arguments484.length > 3 && _arguments484[3] !== undefined ? _arguments484[3] : {};
                headers = _arguments484.length > 4 && _arguments484[4] !== undefined ? _arguments484[4] : undefined;
                body = _arguments484.length > 5 && _arguments484[5] !== undefined ? _arguments484[5] : undefined;
                url = _this496.urls['api'] + '/' + api;

                if (api == 'api') {
                    url += '/' + _this496.version + '/' + _this496.implodeParams(path, params);
                    query = _this496.omit(params, _this496.extractParams(path));

                    if (Object.keys(query).length) {
                        url += '?' + _this496.urlencode(query);
                    }
                } else {
                    nonce = _this496.nonce();
                    _query2 = _this496.extend({ 'method': path, 'nonce': nonce }, params);

                    body = _this496.urlencode(_query2);
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'key': _this496.apiKey,
                        'sign': _this496.hmac(_this496.encode(body), _this496.encode(_this496.secret), 'sha512')
                    };
                }
                return _this496.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this496.id + ' ' + _this496.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var yunbi = {

        'id': 'yunbi',
        'name': 'YUNBI',
        'countries': 'CN',
        'rateLimit': 1000,
        'version': 'v2',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/28570548-4d646c40-7147-11e7-9cf6-839b93e6d622.jpg',
            'api': 'https://yunbi.com',
            'www': 'https://yunbi.com',
            'doc': ['https://yunbi.com/documents/api/guide', 'https://yunbi.com/swagger/']
        },
        'api': {
            'public': {
                'get': ['tickers', 'tickers/{market}', 'markets', 'order_book', 'k', 'depth', 'trades', 'k_with_pending_trades', 'timestamp', 'addresses/{address}', 'partners/orders/{id}/trades']
            },
            'private': {
                'get': ['deposits', 'members/me', 'deposit', 'deposit_address', 'order', 'orders', 'trades/my'],
                'post': ['order/delete', 'orders', 'orders/multi', 'orders/clear']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                symbol,
                _symbol$split13,
                _symbol$split14,
                base,
                quote,
                _this497 = this;

            return Promise.resolve().then(function () {
                return _this497.publicGetMarkets();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['id'];
                    symbol = market['name'];
                    _symbol$split13 = symbol.split('/');
                    _symbol$split14 = _slicedToArray(_symbol$split13, 2);
                    base = _symbol$split14[0];
                    quote = _symbol$split14[1];

                    base = _this497.commonCurrencyCode(base);
                    quote = _this497.commonCurrencyCode(quote);
                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                b,
                balance,
                currency,
                uppercase,
                account,
                _this498 = this;

            return Promise.resolve().then(function () {
                return _this498.loadMarkets();
            }).then(function () {
                return _this498.privateGetMembersMe();
            }).then(function (_resp) {
                response = _resp;
                balances = response['accounts'];
                result = { 'info': balances };

                for (b = 0; b < balances.length; b++) {
                    balance = balances[b];
                    currency = balance['currency'];
                    uppercase = currency.toUpperCase();
                    account = {
                        'free': parseFloat(balance['balance']),
                        'used': parseFloat(balance['locked']),
                        'total': undefined
                    };

                    account['total'] = _this498.sum(account['free'], account['used']);
                    result[uppercase] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                p,
                orderbook,
                timestamp,
                result,
                sides,
                s,
                side,
                orders,
                i,
                order,
                price,
                amount,
                _this499 = this,
                _arguments487 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments487.length > 1 && _arguments487[1] !== undefined ? _arguments487[1] : {};
                return _this499.loadMarkets();
            }).then(function () {
                p = _this499.market(market);
                return _this499.publicGetDepth(_this499.extend({
                    'market': p['id'],
                    'limit': 300
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = orderbook['timestamp'] * 1000;
                result = {
                    'bids': [],
                    'asks': [],
                    'timestamp': timestamp,
                    'datetime': _this499.iso8601(timestamp)
                };
                sides = ['bids', 'asks'];

                for (s = 0; s < sides.length; s++) {
                    side = sides[s];
                    orders = orderbook[side];

                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        price = parseFloat(order[0]);
                        amount = parseFloat(order[1]);

                        result[side].push([price, amount]);
                    }
                }
                result['bids'] = _this499.sortBy(result['bids'], 0, true);
                result['asks'] = _this499.sortBy(result['asks'], 0);
                return result;
            });
        },
        parseTicker: function parseTicker(ticker, market) {
            var timestamp = ticker['at'] * 1000;
            ticker = ticker['ticker'];
            return {
                'timestamp': timestamp,
                'datetime': this.iso8601(timestamp),
                'high': parseFloat(ticker['high']),
                'low': parseFloat(ticker['low']),
                'bid': parseFloat(ticker['buy']),
                'ask': parseFloat(ticker['sell']),
                'vwap': undefined,
                'open': undefined,
                'close': undefined,
                'first': undefined,
                'last': parseFloat(ticker['last']),
                'change': undefined,
                'percentage': undefined,
                'average': undefined,
                'baseVolume': undefined,
                'quoteVolume': parseFloat(ticker['vol']),
                'info': ticker
            };
        },
        fetchTickers: function fetchTickers() {
            var tickers,
                ids,
                result,
                i,
                id,
                market,
                symbol,
                base,
                quote,
                _symbol3,
                ticker,
                _this500 = this;

            return Promise.resolve().then(function () {
                return _this500.loadMarkets();
            }).then(function () {
                return _this500.publicGetTickers();
            }).then(function (_resp) {
                tickers = _resp;
                ids = Object.keys(tickers);
                result = {};

                for (i = 0; i < ids.length; i++) {
                    id = ids[i];
                    market = undefined;
                    symbol = id;

                    if (id in _this500.markets_by_id) {
                        market = _this500.markets_by_id[id];
                        symbol = market['symbol'];
                    } else {
                        base = id.slice(0, 3);
                        quote = id.slice(3, 6);

                        base = base.toUpperCase();
                        quote = quote.toUpperCase();
                        base = _this500.commonCurrencyCode(base);
                        quote = _this500.commonCurrencyCode(quote);
                        _symbol3 = base + '/' + quote;
                    }
                    ticker = tickers[id];

                    result[symbol] = _this500.parseTicker(ticker, market);
                }
                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var p,
                response,
                _this501 = this;

            return Promise.resolve().then(function () {
                return _this501.loadMarkets();
            }).then(function () {
                p = _this501.market(market);
                return _this501.publicGetTickersMarket({
                    'market': p['id']
                });
            }).then(function (_resp) {
                response = _resp;

                return _this501.parseTicker(response, p);
            });
        },
        fetchTrades: function fetchTrades(market) {
            var m,
                _this502 = this;

            return Promise.resolve().then(function () {
                return _this502.loadMarkets();
            }).then(function () {
                m = _this502.market(market);

                return _this502.publicGetTrades({
                    'market': m['id']
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                order,
                response,
                _this503 = this,
                _arguments491 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments491.length > 4 && _arguments491[4] !== undefined ? _arguments491[4] : undefined;
                params = _arguments491.length > 5 && _arguments491[5] !== undefined ? _arguments491[5] : {};
                return _this503.loadMarkets();
            }).then(function () {
                order = {
                    'market': _this503.marketId(market),
                    'side': side,
                    'volume': amount.toString(),
                    'ord_type': type
                };

                if (type == 'limit') {
                    order['price'] = price.toString();
                }
                return _this503.privatePostOrders(_this503.extend(order, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var _this504 = this;

            return Promise.resolve().then(function () {
                return _this504.loadMarkets();
            }).then(function () {
                return _this504.privatePostOrderDelete({ 'id': id });
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                request,
                query,
                url,
                nonce,
                _query3,
                auth,
                signature,
                suffix,
                response,
                _this505 = this,
                _arguments493 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments493.length > 1 && _arguments493[1] !== undefined ? _arguments493[1] : 'public';
                method = _arguments493.length > 2 && _arguments493[2] !== undefined ? _arguments493[2] : 'GET';
                params = _arguments493.length > 3 && _arguments493[3] !== undefined ? _arguments493[3] : {};
                headers = _arguments493.length > 4 && _arguments493[4] !== undefined ? _arguments493[4] : undefined;
                body = _arguments493.length > 5 && _arguments493[5] !== undefined ? _arguments493[5] : undefined;
                request = '/api/' + _this505.version + '/' + _this505.implodeParams(path, params) + '.json';
                query = _this505.omit(params, _this505.extractParams(path));
                url = _this505.urls['api'] + request;

                if (api == 'public') {
                    if (Object.keys(query).length) {
                        url += '?' + _this505.urlencode(query);
                    }
                } else {
                    nonce = _this505.nonce().toString();
                    _query3 = _this505.urlencode(_this505.keysort(_this505.extend({
                        'access_key': _this505.apiKey,
                        'tonce': nonce
                    }, params)));
                    auth = method + '|' + request + '|' + _query3;
                    signature = _this505.hmac(_this505.encode(auth), _this505.encode(_this505.secret));
                    suffix = _query3 + '&signature=' + signature;

                    if (method == 'GET') {
                        url += '?' + suffix;
                    } else {
                        body = suffix;
                        headers = {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Content-Length': body.length
                        };
                    }
                }
                return _this505.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this505.id + ' ' + _this505.json(response));
                }return response;
            });
        }
    };

    //-----------------------------------------------------------------------------

    var zaif = {

        'id': 'zaif',
        'name': 'Zaif',
        'countries': 'JP',
        'rateLimit': 2000,
        'version': '1',
        'urls': {
            'logo': 'https://user-images.githubusercontent.com/1294454/27766927-39ca2ada-5eeb-11e7-972f-1b4199518ca6.jpg',
            'api': 'https://api.zaif.jp',
            'www': 'https://zaif.jp',
            'doc': ['http://techbureau-api-document.readthedocs.io/ja/latest/index.html', 'https://corp.zaif.jp/api-docs', 'https://corp.zaif.jp/api-docs/api_links', 'https://www.npmjs.com/package/zaif.jp', 'https://github.com/you21979/node-zaif']
        },
        'api': {
            'api': {
                'get': ['depth/{pair}', 'currencies/{pair}', 'currencies/all', 'currency_pairs/{pair}', 'currency_pairs/all', 'last_price/{pair}', 'ticker/{pair}', 'trades/{pair}']
            },
            'tapi': {
                'post': ['active_orders', 'cancel_order', 'deposit_history', 'get_id_info', 'get_info', 'get_info2', 'get_personal_info', 'trade', 'trade_history', 'withdraw', 'withdraw_history']
            },
            'ecapi': {
                'post': ['createInvoice', 'getInvoice', 'getInvoiceIdsByOrderNumber', 'cancelInvoice']
            }
        },

        fetchMarkets: function fetchMarkets() {
            var markets,
                result,
                p,
                market,
                id,
                symbol,
                _symbol$split15,
                _symbol$split16,
                base,
                quote,
                _this506 = this;

            return Promise.resolve().then(function () {
                return _this506.apiGetCurrencyPairsAll();
            }).then(function (_resp) {
                markets = _resp;
                result = [];

                for (p = 0; p < markets.length; p++) {
                    market = markets[p];
                    id = market['currency_pair'];
                    symbol = market['name'];
                    _symbol$split15 = symbol.split('/');
                    _symbol$split16 = _slicedToArray(_symbol$split15, 2);
                    base = _symbol$split16[0];
                    quote = _symbol$split16[1];

                    result.push({
                        'id': id,
                        'symbol': symbol,
                        'base': base,
                        'quote': quote,
                        'info': market
                    });
                }
                return result;
            });
        },
        fetchBalance: function fetchBalance() {
            var response,
                balances,
                result,
                c,
                currency,
                lowercase,
                account,
                _this507 = this;

            return Promise.resolve().then(function () {
                return _this507.loadMarkets();
            }).then(function () {
                return _this507.tapiPostGetInfo();
            }).then(function (_resp) {
                response = _resp;
                balances = response['return'];
                result = { 'info': balances };

                for (c = 0; c < _this507.currencies.length; c++) {
                    currency = _this507.currencies[c];
                    lowercase = currency.toLowerCase();
                    account = {
                        'free': undefined,
                        'used': undefined,
                        'total': undefined
                    };

                    if ('funds' in balances) {
                        if (lowercase in balances['funds']) {
                            account['free'] = balances['funds'][lowercase];
                        }
                    }if ('funds_incl_orders' in balances) {
                        if (lowercase in balances['funds_incl_orders']) {
                            account['total'] = balances['funds_incl_orders'][lowercase];
                        }
                    }if (account['total'] && account['free']) {
                        account['used'] = account['total'] - account['free'];
                    }result[currency] = account;
                }
                return result;
            });
        },
        fetchOrderBook: function fetchOrderBook(market) {
            var params,
                orderbook,
                timestamp,
                result,
                _this508 = this,
                _arguments496 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments496.length > 1 && _arguments496[1] !== undefined ? _arguments496[1] : {};
                return _this508.loadMarkets();
            }).then(function () {
                return _this508.apiGetDepthPair(_this508.extend({
                    'pair': _this508.marketId(market)
                }, params));
            }).then(function (_resp) {
                orderbook = _resp;
                timestamp = _this508.milliseconds();
                result = {
                    'bids': orderbook['bids'],
                    'asks': orderbook['asks'],
                    'timestamp': timestamp,
                    'datetime': _this508.iso8601(timestamp)
                };

                return result;
            });
        },
        fetchTicker: function fetchTicker(market) {
            var ticker,
                timestamp,
                _this509 = this;

            return Promise.resolve().then(function () {
                return _this509.loadMarkets();
            }).then(function () {
                return _this509.apiGetTickerPair({
                    'pair': _this509.marketId(market)
                });
            }).then(function (_resp) {
                ticker = _resp;
                timestamp = _this509.milliseconds();

                return {
                    'timestamp': timestamp,
                    'datetime': _this509.iso8601(timestamp),
                    'high': ticker['high'],
                    'low': ticker['low'],
                    'bid': ticker['bid'],
                    'ask': ticker['ask'],
                    'vwap': ticker['vwap'],
                    'open': undefined,
                    'close': undefined,
                    'first': undefined,
                    'last': ticker['last'],
                    'change': undefined,
                    'percentage': undefined,
                    'average': undefined,
                    'baseVolume': undefined,
                    'quoteVolume': ticker['volume'],
                    'info': ticker
                };
            });
        },
        fetchTrades: function fetchTrades(market) {
            var _this510 = this;

            return Promise.resolve().then(function () {
                return _this510.loadMarkets();
            }).then(function () {
                return _this510.apiGetTradesPair({
                    'pair': _this510.marketId(market)
                });
            });
        },
        createOrder: function createOrder(market, type, side, amount) {
            var price,
                params,
                response,
                _this511 = this,
                _arguments499 = arguments;

            return Promise.resolve().then(function () {
                price = _arguments499.length > 4 && _arguments499[4] !== undefined ? _arguments499[4] : undefined;
                params = _arguments499.length > 5 && _arguments499[5] !== undefined ? _arguments499[5] : {};
                return _this511.loadMarkets();
            }).then(function () {
                if (type == 'market') {
                    throw new ExchangeError(_this511.id + ' allows limit orders only');
                }return _this511.tapiPostTrade(_this511.extend({
                    'currency_pair': _this511.marketId(market),
                    'action': side == 'buy' ? 'bid' : 'ask',
                    'amount': amount,
                    'price': price
                }, params));
            }).then(function (_resp) {
                response = _resp;

                return {
                    'info': response,
                    'id': response['return']['order_id'].toString()
                };
            });
        },
        cancelOrder: function cancelOrder(id) {
            var params,
                _this512 = this,
                _arguments500 = arguments;

            return Promise.resolve().then(function () {
                params = _arguments500.length > 1 && _arguments500[1] !== undefined ? _arguments500[1] : {};
                return _this512.loadMarkets();
            }).then(function () {
                return _this512.tapiPostCancelOrder(_this512.extend({
                    'order_id': id
                }, params));
            });
        },
        request: function request(path) {
            var api,
                method,
                params,
                headers,
                body,
                url,
                nonce,
                response,
                _this513 = this,
                _arguments501 = arguments;

            return Promise.resolve().then(function () {
                api = _arguments501.length > 1 && _arguments501[1] !== undefined ? _arguments501[1] : 'api';
                method = _arguments501.length > 2 && _arguments501[2] !== undefined ? _arguments501[2] : 'GET';
                params = _arguments501.length > 3 && _arguments501[3] !== undefined ? _arguments501[3] : {};
                headers = _arguments501.length > 4 && _arguments501[4] !== undefined ? _arguments501[4] : undefined;
                body = _arguments501.length > 5 && _arguments501[5] !== undefined ? _arguments501[5] : undefined;
                url = _this513.urls['api'] + '/' + api;

                if (api == 'api') {
                    url += '/' + _this513.version + '/' + _this513.implodeParams(path, params);
                } else {
                    nonce = _this513.nonce();

                    body = _this513.urlencode(_this513.extend({
                        'method': path,
                        'nonce': nonce
                    }, params));
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': body.length,
                        'Key': _this513.apiKey,
                        'Sign': _this513.hmac(_this513.encode(body), _this513.encode(_this513.secret), 'sha512')
                    };
                }
                return _this513.fetch(url, method, headers, body);
            }).then(function (_resp) {
                response = _resp;

                if ('error' in response) {
                    throw new ExchangeError(_this513.id + ' ' + response['error']);
                }if ('success' in response) {
                    if (!response['success']) {
                        throw new ExchangeError(_this513.id + ' ' + _this513.json(response));
                    }
                }return response;
            });
        }
    };

    //=============================================================================

    var exchanges = {

        '_1broker': _1broker,
        '_1btcxe': _1btcxe,
        'anxpro': anxpro,
        'bit2c': bit2c,
        'bitbay': bitbay,
        'bitbays': bitbays,
        'bitcoincoid': bitcoincoid,
        'bitfinex': bitfinex,
        'bitflyer': bitflyer,
        'bitlish': bitlish,
        'bitmarket': bitmarket,
        'bitmex': bitmex,
        'bitso': bitso,
        'bitstamp': bitstamp,
        'bittrex': bittrex,
        'bl3p': bl3p,
        'btcchina': btcchina,
        'btce': btce,
        'btcexchange': btcexchange,
        'btcmarkets': btcmarkets,
        'btctradeua': btctradeua,
        'btcturk': btcturk,
        'btcx': btcx,
        'bter': bter,
        'bxinth': bxinth,
        'ccex': ccex,
        'cex': cex,
        'chbtc': chbtc,
        'chilebit': chilebit,
        'coincheck': coincheck,
        'coinfloor': coinfloor,
        'coingi': coingi,
        'coinmarketcap': coinmarketcap,
        'coinmate': coinmate,
        'coinsecure': coinsecure,
        'coinspot': coinspot,
        'dsx': dsx,
        'exmo': exmo,
        'flowbtc': flowbtc,
        'foxbit': foxbit,
        'fybse': fybse,
        'fybsg': fybsg,
        'gatecoin': gatecoin,
        'gdax': gdax,
        'gemini': gemini,
        'hitbtc': hitbtc,
        'huobi': huobi,
        'itbit': itbit,
        'jubi': jubi,
        'kraken': kraken,
        'lakebtc': lakebtc,
        'livecoin': livecoin,
        'liqui': liqui,
        'luno': luno,
        'mercado': mercado,
        'okcoincny': okcoincny,
        'okcoinusd': okcoinusd,
        'paymium': paymium,
        'poloniex': poloniex,
        'quadrigacx': quadrigacx,
        'quoine': quoine,
        'southxchange': southxchange,
        'surbitcoin': surbitcoin,
        'therock': therock,
        'urdubit': urdubit,
        'vaultoro': vaultoro,
        'vbtc': vbtc,
        'virwox': virwox,
        'xbtce': xbtce,
        'yobit': yobit,
        'yunbi': yunbi,
        'zaif': zaif
    };

    var defineAllExchanges = function defineAllExchanges(exchanges) {
        var result = {};

        var _loop3 = function _loop3(id) {
            result[id] = function (params) {
                return new Exchange(extend(exchanges[id], params));
            };
        };

        for (var id in exchanges) {
            _loop3(id);
        }result.exchanges = Object.keys(exchanges);
        return result;
    };

    //-----------------------------------------------------------------------------

    var ccxt = Object.assign(defineAllExchanges(exchanges), {

        version: version,

        // exceptions

        CCXTError: CCXTError,
        ExchangeError: ExchangeError,
        AuthenticationError: AuthenticationError,
        NetworkError: NetworkError,
        DDoSProtection: DDoSProtection,
        RequestTimeout: RequestTimeout,
        ExchangeNotAvailable: ExchangeNotAvailable,

        // common utility functions

        sleep: sleep,
        timeout: timeout,
        capitalize: capitalize,
        keysort: keysort,
        extend: extend,
        omit: omit,
        indexBy: indexBy,
        sortBy: sortBy,
        flatten: flatten,
        unique: unique,
        pluck: pluck,
        urlencode: urlencode,
        sum: sum,
        decimal: decimal,

        // underscore aliases

        index_by: indexBy,
        sort_by: sortBy,

        // crypto functions

        binaryConcat: binaryConcat,
        stringToBinary: stringToBinary,
        binaryToString: binaryToString,
        stringToBase64: stringToBase64,
        utf16ToBase64: utf16ToBase64,
        base64ToBinary: base64ToBinary,
        base64ToString: base64ToString,
        urlencodeBase64: urlencodeBase64,
        hash: hash,
        hmac: hmac,
        jwt: jwt

    });

    //-----------------------------------------------------------------------------

    if (isCommonJS) {

        module.exports = ccxt;
    } else {

        window.ccxt = ccxt;
    }

    //-----------------------------------------------------------------------------
})(); // end of namespace
