var Zt = Object.defineProperty;
var Gt = (x, e, t) => e in x ? Zt(x, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : x[e] = t;
var nt = (x, e, t) => Gt(x, typeof e != "symbol" ? e + "" : e, t);
var St = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Vt(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;
}
function Tt(x) {
  throw new Error('Could not dynamically require "' + x + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Mt = { exports: {} };
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/
(function(x, e) {
  (function(t) {
    x.exports = t();
  })(function() {
    return function t(r, n, a) {
      function o(p, f) {
        if (!n[p]) {
          if (!r[p]) {
            var y = typeof Tt == "function" && Tt;
            if (!f && y) return y(p, !0);
            if (s) return s(p, !0);
            var m = new Error("Cannot find module '" + p + "'");
            throw m.code = "MODULE_NOT_FOUND", m;
          }
          var h = n[p] = { exports: {} };
          r[p][0].call(h.exports, function(b) {
            var d = r[p][1][b];
            return o(d || b);
          }, h, h.exports, t, r, n, a);
        }
        return n[p].exports;
      }
      for (var s = typeof Tt == "function" && Tt, c = 0; c < a.length; c++) o(a[c]);
      return o;
    }({ 1: [function(t, r, n) {
      var a = t("./utils"), o = t("./support"), s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      n.encode = function(c) {
        for (var p, f, y, m, h, b, d, _ = [], u = 0, v = c.length, E = v, A = a.getTypeOf(c) !== "string"; u < c.length; ) E = v - u, y = A ? (p = c[u++], f = u < v ? c[u++] : 0, u < v ? c[u++] : 0) : (p = c.charCodeAt(u++), f = u < v ? c.charCodeAt(u++) : 0, u < v ? c.charCodeAt(u++) : 0), m = p >> 2, h = (3 & p) << 4 | f >> 4, b = 1 < E ? (15 & f) << 2 | y >> 6 : 64, d = 2 < E ? 63 & y : 64, _.push(s.charAt(m) + s.charAt(h) + s.charAt(b) + s.charAt(d));
        return _.join("");
      }, n.decode = function(c) {
        var p, f, y, m, h, b, d = 0, _ = 0, u = "data:";
        if (c.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
        var v, E = 3 * (c = c.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
        if (c.charAt(c.length - 1) === s.charAt(64) && E--, c.charAt(c.length - 2) === s.charAt(64) && E--, E % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
        for (v = o.uint8array ? new Uint8Array(0 | E) : new Array(0 | E); d < c.length; ) p = s.indexOf(c.charAt(d++)) << 2 | (m = s.indexOf(c.charAt(d++))) >> 4, f = (15 & m) << 4 | (h = s.indexOf(c.charAt(d++))) >> 2, y = (3 & h) << 6 | (b = s.indexOf(c.charAt(d++))), v[_++] = p, h !== 64 && (v[_++] = f), b !== 64 && (v[_++] = y);
        return v;
      };
    }, { "./support": 30, "./utils": 32 }], 2: [function(t, r, n) {
      var a = t("./external"), o = t("./stream/DataWorker"), s = t("./stream/Crc32Probe"), c = t("./stream/DataLengthProbe");
      function p(f, y, m, h, b) {
        this.compressedSize = f, this.uncompressedSize = y, this.crc32 = m, this.compression = h, this.compressedContent = b;
      }
      p.prototype = { getContentWorker: function() {
        var f = new o(a.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new c("data_length")), y = this;
        return f.on("end", function() {
          if (this.streamInfo.data_length !== y.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
        }), f;
      }, getCompressedWorker: function() {
        return new o(a.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      } }, p.createWorkerFrom = function(f, y, m) {
        return f.pipe(new s()).pipe(new c("uncompressedSize")).pipe(y.compressWorker(m)).pipe(new c("compressedSize")).withStreamInfo("compression", y);
      }, r.exports = p;
    }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(t, r, n) {
      var a = t("./stream/GenericWorker");
      n.STORE = { magic: "\0\0", compressWorker: function() {
        return new a("STORE compression");
      }, uncompressWorker: function() {
        return new a("STORE decompression");
      } }, n.DEFLATE = t("./flate");
    }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(t, r, n) {
      var a = t("./utils"), o = function() {
        for (var s, c = [], p = 0; p < 256; p++) {
          s = p;
          for (var f = 0; f < 8; f++) s = 1 & s ? 3988292384 ^ s >>> 1 : s >>> 1;
          c[p] = s;
        }
        return c;
      }();
      r.exports = function(s, c) {
        return s !== void 0 && s.length ? a.getTypeOf(s) !== "string" ? function(p, f, y, m) {
          var h = o, b = m + y;
          p ^= -1;
          for (var d = m; d < b; d++) p = p >>> 8 ^ h[255 & (p ^ f[d])];
          return -1 ^ p;
        }(0 | c, s, s.length, 0) : function(p, f, y, m) {
          var h = o, b = m + y;
          p ^= -1;
          for (var d = m; d < b; d++) p = p >>> 8 ^ h[255 & (p ^ f.charCodeAt(d))];
          return -1 ^ p;
        }(0 | c, s, s.length, 0) : 0;
      };
    }, { "./utils": 32 }], 5: [function(t, r, n) {
      n.base64 = !1, n.binary = !1, n.dir = !1, n.createFolders = !0, n.date = null, n.compression = null, n.compressionOptions = null, n.comment = null, n.unixPermissions = null, n.dosPermissions = null;
    }, {}], 6: [function(t, r, n) {
      var a = null;
      a = typeof Promise < "u" ? Promise : t("lie"), r.exports = { Promise: a };
    }, { lie: 37 }], 7: [function(t, r, n) {
      var a = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", o = t("pako"), s = t("./utils"), c = t("./stream/GenericWorker"), p = a ? "uint8array" : "array";
      function f(y, m) {
        c.call(this, "FlateWorker/" + y), this._pako = null, this._pakoAction = y, this._pakoOptions = m, this.meta = {};
      }
      n.magic = "\b\0", s.inherits(f, c), f.prototype.processChunk = function(y) {
        this.meta = y.meta, this._pako === null && this._createPako(), this._pako.push(s.transformTo(p, y.data), !1);
      }, f.prototype.flush = function() {
        c.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
      }, f.prototype.cleanUp = function() {
        c.prototype.cleanUp.call(this), this._pako = null;
      }, f.prototype._createPako = function() {
        this._pako = new o[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
        var y = this;
        this._pako.onData = function(m) {
          y.push({ data: m, meta: y.meta });
        };
      }, n.compressWorker = function(y) {
        return new f("Deflate", y);
      }, n.uncompressWorker = function() {
        return new f("Inflate", {});
      };
    }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(t, r, n) {
      function a(h, b) {
        var d, _ = "";
        for (d = 0; d < b; d++) _ += String.fromCharCode(255 & h), h >>>= 8;
        return _;
      }
      function o(h, b, d, _, u, v) {
        var E, A, T = h.file, L = h.compression, B = v !== p.utf8encode, j = s.transformTo("string", v(T.name)), z = s.transformTo("string", p.utf8encode(T.name)), Z = T.comment, Q = s.transformTo("string", v(Z)), k = s.transformTo("string", p.utf8encode(Z)), N = z.length !== T.name.length, l = k.length !== Z.length, D = "", et = "", U = "", rt = T.dir, W = T.date, tt = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
        b && !d || (tt.crc32 = h.crc32, tt.compressedSize = h.compressedSize, tt.uncompressedSize = h.uncompressedSize);
        var F = 0;
        b && (F |= 8), B || !N && !l || (F |= 2048);
        var I = 0, J = 0;
        rt && (I |= 16), u === "UNIX" ? (J = 798, I |= function(V, lt) {
          var ut = V;
          return V || (ut = lt ? 16893 : 33204), (65535 & ut) << 16;
        }(T.unixPermissions, rt)) : (J = 20, I |= function(V) {
          return 63 & (V || 0);
        }(T.dosPermissions)), E = W.getUTCHours(), E <<= 6, E |= W.getUTCMinutes(), E <<= 5, E |= W.getUTCSeconds() / 2, A = W.getUTCFullYear() - 1980, A <<= 4, A |= W.getUTCMonth() + 1, A <<= 5, A |= W.getUTCDate(), N && (et = a(1, 1) + a(f(j), 4) + z, D += "up" + a(et.length, 2) + et), l && (U = a(1, 1) + a(f(Q), 4) + k, D += "uc" + a(U.length, 2) + U);
        var Y = "";
        return Y += `
\0`, Y += a(F, 2), Y += L.magic, Y += a(E, 2), Y += a(A, 2), Y += a(tt.crc32, 4), Y += a(tt.compressedSize, 4), Y += a(tt.uncompressedSize, 4), Y += a(j.length, 2), Y += a(D.length, 2), { fileRecord: y.LOCAL_FILE_HEADER + Y + j + D, dirRecord: y.CENTRAL_FILE_HEADER + a(J, 2) + Y + a(Q.length, 2) + "\0\0\0\0" + a(I, 4) + a(_, 4) + j + D + Q };
      }
      var s = t("../utils"), c = t("../stream/GenericWorker"), p = t("../utf8"), f = t("../crc32"), y = t("../signature");
      function m(h, b, d, _) {
        c.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = b, this.zipPlatform = d, this.encodeFileName = _, this.streamFiles = h, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
      }
      s.inherits(m, c), m.prototype.push = function(h) {
        var b = h.meta.percent || 0, d = this.entriesCount, _ = this._sources.length;
        this.accumulate ? this.contentBuffer.push(h) : (this.bytesWritten += h.data.length, c.prototype.push.call(this, { data: h.data, meta: { currentFile: this.currentFile, percent: d ? (b + 100 * (d - _ - 1)) / d : 100 } }));
      }, m.prototype.openedSource = function(h) {
        this.currentSourceOffset = this.bytesWritten, this.currentFile = h.file.name;
        var b = this.streamFiles && !h.file.dir;
        if (b) {
          var d = o(h, b, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          this.push({ data: d.fileRecord, meta: { percent: 0 } });
        } else this.accumulate = !0;
      }, m.prototype.closedSource = function(h) {
        this.accumulate = !1;
        var b = this.streamFiles && !h.file.dir, d = o(h, b, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        if (this.dirRecords.push(d.dirRecord), b) this.push({ data: function(_) {
          return y.DATA_DESCRIPTOR + a(_.crc32, 4) + a(_.compressedSize, 4) + a(_.uncompressedSize, 4);
        }(h), meta: { percent: 100 } });
        else for (this.push({ data: d.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
        this.currentFile = null;
      }, m.prototype.flush = function() {
        for (var h = this.bytesWritten, b = 0; b < this.dirRecords.length; b++) this.push({ data: this.dirRecords[b], meta: { percent: 100 } });
        var d = this.bytesWritten - h, _ = function(u, v, E, A, T) {
          var L = s.transformTo("string", T(A));
          return y.CENTRAL_DIRECTORY_END + "\0\0\0\0" + a(u, 2) + a(u, 2) + a(v, 4) + a(E, 4) + a(L.length, 2) + L;
        }(this.dirRecords.length, d, h, this.zipComment, this.encodeFileName);
        this.push({ data: _, meta: { percent: 100 } });
      }, m.prototype.prepareNextSource = function() {
        this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
      }, m.prototype.registerPrevious = function(h) {
        this._sources.push(h);
        var b = this;
        return h.on("data", function(d) {
          b.processChunk(d);
        }), h.on("end", function() {
          b.closedSource(b.previous.streamInfo), b._sources.length ? b.prepareNextSource() : b.end();
        }), h.on("error", function(d) {
          b.error(d);
        }), this;
      }, m.prototype.resume = function() {
        return !!c.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
      }, m.prototype.error = function(h) {
        var b = this._sources;
        if (!c.prototype.error.call(this, h)) return !1;
        for (var d = 0; d < b.length; d++) try {
          b[d].error(h);
        } catch {
        }
        return !0;
      }, m.prototype.lock = function() {
        c.prototype.lock.call(this);
        for (var h = this._sources, b = 0; b < h.length; b++) h[b].lock();
      }, r.exports = m;
    }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(t, r, n) {
      var a = t("../compressions"), o = t("./ZipFileWorker");
      n.generateWorker = function(s, c, p) {
        var f = new o(c.streamFiles, p, c.platform, c.encodeFileName), y = 0;
        try {
          s.forEach(function(m, h) {
            y++;
            var b = function(v, E) {
              var A = v || E, T = a[A];
              if (!T) throw new Error(A + " is not a valid compression method !");
              return T;
            }(h.options.compression, c.compression), d = h.options.compressionOptions || c.compressionOptions || {}, _ = h.dir, u = h.date;
            h._compressWorker(b, d).withStreamInfo("file", { name: m, dir: _, date: u, comment: h.comment || "", unixPermissions: h.unixPermissions, dosPermissions: h.dosPermissions }).pipe(f);
          }), f.entriesCount = y;
        } catch (m) {
          f.error(m);
        }
        return f;
      };
    }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(t, r, n) {
      function a() {
        if (!(this instanceof a)) return new a();
        if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
        this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
          var o = new a();
          for (var s in this) typeof this[s] != "function" && (o[s] = this[s]);
          return o;
        };
      }
      (a.prototype = t("./object")).loadAsync = t("./load"), a.support = t("./support"), a.defaults = t("./defaults"), a.version = "3.10.1", a.loadAsync = function(o, s) {
        return new a().loadAsync(o, s);
      }, a.external = t("./external"), r.exports = a;
    }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(t, r, n) {
      var a = t("./utils"), o = t("./external"), s = t("./utf8"), c = t("./zipEntries"), p = t("./stream/Crc32Probe"), f = t("./nodejsUtils");
      function y(m) {
        return new o.Promise(function(h, b) {
          var d = m.decompressed.getContentWorker().pipe(new p());
          d.on("error", function(_) {
            b(_);
          }).on("end", function() {
            d.streamInfo.crc32 !== m.decompressed.crc32 ? b(new Error("Corrupted zip : CRC32 mismatch")) : h();
          }).resume();
        });
      }
      r.exports = function(m, h) {
        var b = this;
        return h = a.extend(h || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: s.utf8decode }), f.isNode && f.isStream(m) ? o.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : a.prepareContent("the loaded zip file", m, !0, h.optimizedBinaryString, h.base64).then(function(d) {
          var _ = new c(h);
          return _.load(d), _;
        }).then(function(d) {
          var _ = [o.Promise.resolve(d)], u = d.files;
          if (h.checkCRC32) for (var v = 0; v < u.length; v++) _.push(y(u[v]));
          return o.Promise.all(_);
        }).then(function(d) {
          for (var _ = d.shift(), u = _.files, v = 0; v < u.length; v++) {
            var E = u[v], A = E.fileNameStr, T = a.resolve(E.fileNameStr);
            b.file(T, E.decompressed, { binary: !0, optimizedBinaryString: !0, date: E.date, dir: E.dir, comment: E.fileCommentStr.length ? E.fileCommentStr : null, unixPermissions: E.unixPermissions, dosPermissions: E.dosPermissions, createFolders: h.createFolders }), E.dir || (b.file(T).unsafeOriginalName = A);
          }
          return _.zipComment.length && (b.comment = _.zipComment), b;
        });
      };
    }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(t, r, n) {
      var a = t("../utils"), o = t("../stream/GenericWorker");
      function s(c, p) {
        o.call(this, "Nodejs stream input adapter for " + c), this._upstreamEnded = !1, this._bindStream(p);
      }
      a.inherits(s, o), s.prototype._bindStream = function(c) {
        var p = this;
        (this._stream = c).pause(), c.on("data", function(f) {
          p.push({ data: f, meta: { percent: 0 } });
        }).on("error", function(f) {
          p.isPaused ? this.generatedError = f : p.error(f);
        }).on("end", function() {
          p.isPaused ? p._upstreamEnded = !0 : p.end();
        });
      }, s.prototype.pause = function() {
        return !!o.prototype.pause.call(this) && (this._stream.pause(), !0);
      }, s.prototype.resume = function() {
        return !!o.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
      }, r.exports = s;
    }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(t, r, n) {
      var a = t("readable-stream").Readable;
      function o(s, c, p) {
        a.call(this, c), this._helper = s;
        var f = this;
        s.on("data", function(y, m) {
          f.push(y) || f._helper.pause(), p && p(m);
        }).on("error", function(y) {
          f.emit("error", y);
        }).on("end", function() {
          f.push(null);
        });
      }
      t("../utils").inherits(o, a), o.prototype._read = function() {
        this._helper.resume();
      }, r.exports = o;
    }, { "../utils": 32, "readable-stream": 16 }], 14: [function(t, r, n) {
      r.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(a, o) {
        if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(a, o);
        if (typeof a == "number") throw new Error('The "data" argument must not be a number');
        return new Buffer(a, o);
      }, allocBuffer: function(a) {
        if (Buffer.alloc) return Buffer.alloc(a);
        var o = new Buffer(a);
        return o.fill(0), o;
      }, isBuffer: function(a) {
        return Buffer.isBuffer(a);
      }, isStream: function(a) {
        return a && typeof a.on == "function" && typeof a.pause == "function" && typeof a.resume == "function";
      } };
    }, {}], 15: [function(t, r, n) {
      function a(T, L, B) {
        var j, z = s.getTypeOf(L), Z = s.extend(B || {}, f);
        Z.date = Z.date || /* @__PURE__ */ new Date(), Z.compression !== null && (Z.compression = Z.compression.toUpperCase()), typeof Z.unixPermissions == "string" && (Z.unixPermissions = parseInt(Z.unixPermissions, 8)), Z.unixPermissions && 16384 & Z.unixPermissions && (Z.dir = !0), Z.dosPermissions && 16 & Z.dosPermissions && (Z.dir = !0), Z.dir && (T = u(T)), Z.createFolders && (j = _(T)) && v.call(this, j, !0);
        var Q = z === "string" && Z.binary === !1 && Z.base64 === !1;
        B && B.binary !== void 0 || (Z.binary = !Q), (L instanceof y && L.uncompressedSize === 0 || Z.dir || !L || L.length === 0) && (Z.base64 = !1, Z.binary = !0, L = "", Z.compression = "STORE", z = "string");
        var k = null;
        k = L instanceof y || L instanceof c ? L : b.isNode && b.isStream(L) ? new d(T, L) : s.prepareContent(T, L, Z.binary, Z.optimizedBinaryString, Z.base64);
        var N = new m(T, k, Z);
        this.files[T] = N;
      }
      var o = t("./utf8"), s = t("./utils"), c = t("./stream/GenericWorker"), p = t("./stream/StreamHelper"), f = t("./defaults"), y = t("./compressedObject"), m = t("./zipObject"), h = t("./generate"), b = t("./nodejsUtils"), d = t("./nodejs/NodejsStreamInputAdapter"), _ = function(T) {
        T.slice(-1) === "/" && (T = T.substring(0, T.length - 1));
        var L = T.lastIndexOf("/");
        return 0 < L ? T.substring(0, L) : "";
      }, u = function(T) {
        return T.slice(-1) !== "/" && (T += "/"), T;
      }, v = function(T, L) {
        return L = L !== void 0 ? L : f.createFolders, T = u(T), this.files[T] || a.call(this, T, null, { dir: !0, createFolders: L }), this.files[T];
      };
      function E(T) {
        return Object.prototype.toString.call(T) === "[object RegExp]";
      }
      var A = { load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, forEach: function(T) {
        var L, B, j;
        for (L in this.files) j = this.files[L], (B = L.slice(this.root.length, L.length)) && L.slice(0, this.root.length) === this.root && T(B, j);
      }, filter: function(T) {
        var L = [];
        return this.forEach(function(B, j) {
          T(B, j) && L.push(j);
        }), L;
      }, file: function(T, L, B) {
        if (arguments.length !== 1) return T = this.root + T, a.call(this, T, L, B), this;
        if (E(T)) {
          var j = T;
          return this.filter(function(Z, Q) {
            return !Q.dir && j.test(Z);
          });
        }
        var z = this.files[this.root + T];
        return z && !z.dir ? z : null;
      }, folder: function(T) {
        if (!T) return this;
        if (E(T)) return this.filter(function(z, Z) {
          return Z.dir && T.test(z);
        });
        var L = this.root + T, B = v.call(this, L), j = this.clone();
        return j.root = B.name, j;
      }, remove: function(T) {
        T = this.root + T;
        var L = this.files[T];
        if (L || (T.slice(-1) !== "/" && (T += "/"), L = this.files[T]), L && !L.dir) delete this.files[T];
        else for (var B = this.filter(function(z, Z) {
          return Z.name.slice(0, T.length) === T;
        }), j = 0; j < B.length; j++) delete this.files[B[j].name];
        return this;
      }, generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, generateInternalStream: function(T) {
        var L, B = {};
        try {
          if ((B = s.extend(T || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: o.utf8encode })).type = B.type.toLowerCase(), B.compression = B.compression.toUpperCase(), B.type === "binarystring" && (B.type = "string"), !B.type) throw new Error("No output type specified.");
          s.checkSupport(B.type), B.platform !== "darwin" && B.platform !== "freebsd" && B.platform !== "linux" && B.platform !== "sunos" || (B.platform = "UNIX"), B.platform === "win32" && (B.platform = "DOS");
          var j = B.comment || this.comment || "";
          L = h.generateWorker(this, B, j);
        } catch (z) {
          (L = new c("error")).error(z);
        }
        return new p(L, B.type || "string", B.mimeType);
      }, generateAsync: function(T, L) {
        return this.generateInternalStream(T).accumulate(L);
      }, generateNodeStream: function(T, L) {
        return (T = T || {}).type || (T.type = "nodebuffer"), this.generateInternalStream(T).toNodejsStream(L);
      } };
      r.exports = A;
    }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(t, r, n) {
      r.exports = t("stream");
    }, { stream: void 0 }], 17: [function(t, r, n) {
      var a = t("./DataReader");
      function o(s) {
        a.call(this, s);
        for (var c = 0; c < this.data.length; c++) s[c] = 255 & s[c];
      }
      t("../utils").inherits(o, a), o.prototype.byteAt = function(s) {
        return this.data[this.zero + s];
      }, o.prototype.lastIndexOfSignature = function(s) {
        for (var c = s.charCodeAt(0), p = s.charCodeAt(1), f = s.charCodeAt(2), y = s.charCodeAt(3), m = this.length - 4; 0 <= m; --m) if (this.data[m] === c && this.data[m + 1] === p && this.data[m + 2] === f && this.data[m + 3] === y) return m - this.zero;
        return -1;
      }, o.prototype.readAndCheckSignature = function(s) {
        var c = s.charCodeAt(0), p = s.charCodeAt(1), f = s.charCodeAt(2), y = s.charCodeAt(3), m = this.readData(4);
        return c === m[0] && p === m[1] && f === m[2] && y === m[3];
      }, o.prototype.readData = function(s) {
        if (this.checkOffset(s), s === 0) return [];
        var c = this.data.slice(this.zero + this.index, this.zero + this.index + s);
        return this.index += s, c;
      }, r.exports = o;
    }, { "../utils": 32, "./DataReader": 18 }], 18: [function(t, r, n) {
      var a = t("../utils");
      function o(s) {
        this.data = s, this.length = s.length, this.index = 0, this.zero = 0;
      }
      o.prototype = { checkOffset: function(s) {
        this.checkIndex(this.index + s);
      }, checkIndex: function(s) {
        if (this.length < this.zero + s || s < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + s + "). Corrupted zip ?");
      }, setIndex: function(s) {
        this.checkIndex(s), this.index = s;
      }, skip: function(s) {
        this.setIndex(this.index + s);
      }, byteAt: function() {
      }, readInt: function(s) {
        var c, p = 0;
        for (this.checkOffset(s), c = this.index + s - 1; c >= this.index; c--) p = (p << 8) + this.byteAt(c);
        return this.index += s, p;
      }, readString: function(s) {
        return a.transformTo("string", this.readData(s));
      }, readData: function() {
      }, lastIndexOfSignature: function() {
      }, readAndCheckSignature: function() {
      }, readDate: function() {
        var s = this.readInt(4);
        return new Date(Date.UTC(1980 + (s >> 25 & 127), (s >> 21 & 15) - 1, s >> 16 & 31, s >> 11 & 31, s >> 5 & 63, (31 & s) << 1));
      } }, r.exports = o;
    }, { "../utils": 32 }], 19: [function(t, r, n) {
      var a = t("./Uint8ArrayReader");
      function o(s) {
        a.call(this, s);
      }
      t("../utils").inherits(o, a), o.prototype.readData = function(s) {
        this.checkOffset(s);
        var c = this.data.slice(this.zero + this.index, this.zero + this.index + s);
        return this.index += s, c;
      }, r.exports = o;
    }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(t, r, n) {
      var a = t("./DataReader");
      function o(s) {
        a.call(this, s);
      }
      t("../utils").inherits(o, a), o.prototype.byteAt = function(s) {
        return this.data.charCodeAt(this.zero + s);
      }, o.prototype.lastIndexOfSignature = function(s) {
        return this.data.lastIndexOf(s) - this.zero;
      }, o.prototype.readAndCheckSignature = function(s) {
        return s === this.readData(4);
      }, o.prototype.readData = function(s) {
        this.checkOffset(s);
        var c = this.data.slice(this.zero + this.index, this.zero + this.index + s);
        return this.index += s, c;
      }, r.exports = o;
    }, { "../utils": 32, "./DataReader": 18 }], 21: [function(t, r, n) {
      var a = t("./ArrayReader");
      function o(s) {
        a.call(this, s);
      }
      t("../utils").inherits(o, a), o.prototype.readData = function(s) {
        if (this.checkOffset(s), s === 0) return new Uint8Array(0);
        var c = this.data.subarray(this.zero + this.index, this.zero + this.index + s);
        return this.index += s, c;
      }, r.exports = o;
    }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(t, r, n) {
      var a = t("../utils"), o = t("../support"), s = t("./ArrayReader"), c = t("./StringReader"), p = t("./NodeBufferReader"), f = t("./Uint8ArrayReader");
      r.exports = function(y) {
        var m = a.getTypeOf(y);
        return a.checkSupport(m), m !== "string" || o.uint8array ? m === "nodebuffer" ? new p(y) : o.uint8array ? new f(a.transformTo("uint8array", y)) : new s(a.transformTo("array", y)) : new c(y);
      };
    }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(t, r, n) {
      n.LOCAL_FILE_HEADER = "PK", n.CENTRAL_FILE_HEADER = "PK", n.CENTRAL_DIRECTORY_END = "PK", n.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", n.ZIP64_CENTRAL_DIRECTORY_END = "PK", n.DATA_DESCRIPTOR = "PK\x07\b";
    }, {}], 24: [function(t, r, n) {
      var a = t("./GenericWorker"), o = t("../utils");
      function s(c) {
        a.call(this, "ConvertWorker to " + c), this.destType = c;
      }
      o.inherits(s, a), s.prototype.processChunk = function(c) {
        this.push({ data: o.transformTo(this.destType, c.data), meta: c.meta });
      }, r.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(t, r, n) {
      var a = t("./GenericWorker"), o = t("../crc32");
      function s() {
        a.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
      }
      t("../utils").inherits(s, a), s.prototype.processChunk = function(c) {
        this.streamInfo.crc32 = o(c.data, this.streamInfo.crc32 || 0), this.push(c);
      }, r.exports = s;
    }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(t, r, n) {
      var a = t("../utils"), o = t("./GenericWorker");
      function s(c) {
        o.call(this, "DataLengthProbe for " + c), this.propName = c, this.withStreamInfo(c, 0);
      }
      a.inherits(s, o), s.prototype.processChunk = function(c) {
        if (c) {
          var p = this.streamInfo[this.propName] || 0;
          this.streamInfo[this.propName] = p + c.data.length;
        }
        o.prototype.processChunk.call(this, c);
      }, r.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(t, r, n) {
      var a = t("../utils"), o = t("./GenericWorker");
      function s(c) {
        o.call(this, "DataWorker");
        var p = this;
        this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, c.then(function(f) {
          p.dataIsReady = !0, p.data = f, p.max = f && f.length || 0, p.type = a.getTypeOf(f), p.isPaused || p._tickAndRepeat();
        }, function(f) {
          p.error(f);
        });
      }
      a.inherits(s, o), s.prototype.cleanUp = function() {
        o.prototype.cleanUp.call(this), this.data = null;
      }, s.prototype.resume = function() {
        return !!o.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, a.delay(this._tickAndRepeat, [], this)), !0);
      }, s.prototype._tickAndRepeat = function() {
        this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (a.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
      }, s.prototype._tick = function() {
        if (this.isPaused || this.isFinished) return !1;
        var c = null, p = Math.min(this.max, this.index + 16384);
        if (this.index >= this.max) return this.end();
        switch (this.type) {
          case "string":
            c = this.data.substring(this.index, p);
            break;
          case "uint8array":
            c = this.data.subarray(this.index, p);
            break;
          case "array":
          case "nodebuffer":
            c = this.data.slice(this.index, p);
        }
        return this.index = p, this.push({ data: c, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
      }, r.exports = s;
    }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(t, r, n) {
      function a(o) {
        this.name = o || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
      }
      a.prototype = { push: function(o) {
        this.emit("data", o);
      }, end: function() {
        if (this.isFinished) return !1;
        this.flush();
        try {
          this.emit("end"), this.cleanUp(), this.isFinished = !0;
        } catch (o) {
          this.emit("error", o);
        }
        return !0;
      }, error: function(o) {
        return !this.isFinished && (this.isPaused ? this.generatedError = o : (this.isFinished = !0, this.emit("error", o), this.previous && this.previous.error(o), this.cleanUp()), !0);
      }, on: function(o, s) {
        return this._listeners[o].push(s), this;
      }, cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
      }, emit: function(o, s) {
        if (this._listeners[o]) for (var c = 0; c < this._listeners[o].length; c++) this._listeners[o][c].call(this, s);
      }, pipe: function(o) {
        return o.registerPrevious(this);
      }, registerPrevious: function(o) {
        if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
        this.streamInfo = o.streamInfo, this.mergeStreamInfo(), this.previous = o;
        var s = this;
        return o.on("data", function(c) {
          s.processChunk(c);
        }), o.on("end", function() {
          s.end();
        }), o.on("error", function(c) {
          s.error(c);
        }), this;
      }, pause: function() {
        return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
      }, resume: function() {
        if (!this.isPaused || this.isFinished) return !1;
        var o = this.isPaused = !1;
        return this.generatedError && (this.error(this.generatedError), o = !0), this.previous && this.previous.resume(), !o;
      }, flush: function() {
      }, processChunk: function(o) {
        this.push(o);
      }, withStreamInfo: function(o, s) {
        return this.extraStreamInfo[o] = s, this.mergeStreamInfo(), this;
      }, mergeStreamInfo: function() {
        for (var o in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, o) && (this.streamInfo[o] = this.extraStreamInfo[o]);
      }, lock: function() {
        if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
        this.isLocked = !0, this.previous && this.previous.lock();
      }, toString: function() {
        var o = "Worker " + this.name;
        return this.previous ? this.previous + " -> " + o : o;
      } }, r.exports = a;
    }, {}], 29: [function(t, r, n) {
      var a = t("../utils"), o = t("./ConvertWorker"), s = t("./GenericWorker"), c = t("../base64"), p = t("../support"), f = t("../external"), y = null;
      if (p.nodestream) try {
        y = t("../nodejs/NodejsStreamOutputAdapter");
      } catch {
      }
      function m(b, d) {
        return new f.Promise(function(_, u) {
          var v = [], E = b._internalType, A = b._outputType, T = b._mimeType;
          b.on("data", function(L, B) {
            v.push(L), d && d(B);
          }).on("error", function(L) {
            v = [], u(L);
          }).on("end", function() {
            try {
              var L = function(B, j, z) {
                switch (B) {
                  case "blob":
                    return a.newBlob(a.transformTo("arraybuffer", j), z);
                  case "base64":
                    return c.encode(j);
                  default:
                    return a.transformTo(B, j);
                }
              }(A, function(B, j) {
                var z, Z = 0, Q = null, k = 0;
                for (z = 0; z < j.length; z++) k += j[z].length;
                switch (B) {
                  case "string":
                    return j.join("");
                  case "array":
                    return Array.prototype.concat.apply([], j);
                  case "uint8array":
                    for (Q = new Uint8Array(k), z = 0; z < j.length; z++) Q.set(j[z], Z), Z += j[z].length;
                    return Q;
                  case "nodebuffer":
                    return Buffer.concat(j);
                  default:
                    throw new Error("concat : unsupported type '" + B + "'");
                }
              }(E, v), T);
              _(L);
            } catch (B) {
              u(B);
            }
            v = [];
          }).resume();
        });
      }
      function h(b, d, _) {
        var u = d;
        switch (d) {
          case "blob":
          case "arraybuffer":
            u = "uint8array";
            break;
          case "base64":
            u = "string";
        }
        try {
          this._internalType = u, this._outputType = d, this._mimeType = _, a.checkSupport(u), this._worker = b.pipe(new o(u)), b.lock();
        } catch (v) {
          this._worker = new s("error"), this._worker.error(v);
        }
      }
      h.prototype = { accumulate: function(b) {
        return m(this, b);
      }, on: function(b, d) {
        var _ = this;
        return b === "data" ? this._worker.on(b, function(u) {
          d.call(_, u.data, u.meta);
        }) : this._worker.on(b, function() {
          a.delay(d, arguments, _);
        }), this;
      }, resume: function() {
        return a.delay(this._worker.resume, [], this._worker), this;
      }, pause: function() {
        return this._worker.pause(), this;
      }, toNodejsStream: function(b) {
        if (a.checkSupport("nodestream"), this._outputType !== "nodebuffer") throw new Error(this._outputType + " is not supported by this method");
        return new y(this, { objectMode: this._outputType !== "nodebuffer" }, b);
      } }, r.exports = h;
    }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(t, r, n) {
      if (n.base64 = !0, n.array = !0, n.string = !0, n.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", n.nodebuffer = typeof Buffer < "u", n.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u") n.blob = !1;
      else {
        var a = new ArrayBuffer(0);
        try {
          n.blob = new Blob([a], { type: "application/zip" }).size === 0;
        } catch {
          try {
            var o = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            o.append(a), n.blob = o.getBlob("application/zip").size === 0;
          } catch {
            n.blob = !1;
          }
        }
      }
      try {
        n.nodestream = !!t("readable-stream").Readable;
      } catch {
        n.nodestream = !1;
      }
    }, { "readable-stream": 16 }], 31: [function(t, r, n) {
      for (var a = t("./utils"), o = t("./support"), s = t("./nodejsUtils"), c = t("./stream/GenericWorker"), p = new Array(256), f = 0; f < 256; f++) p[f] = 252 <= f ? 6 : 248 <= f ? 5 : 240 <= f ? 4 : 224 <= f ? 3 : 192 <= f ? 2 : 1;
      p[254] = p[254] = 1;
      function y() {
        c.call(this, "utf-8 decode"), this.leftOver = null;
      }
      function m() {
        c.call(this, "utf-8 encode");
      }
      n.utf8encode = function(h) {
        return o.nodebuffer ? s.newBufferFrom(h, "utf-8") : function(b) {
          var d, _, u, v, E, A = b.length, T = 0;
          for (v = 0; v < A; v++) (64512 & (_ = b.charCodeAt(v))) == 55296 && v + 1 < A && (64512 & (u = b.charCodeAt(v + 1))) == 56320 && (_ = 65536 + (_ - 55296 << 10) + (u - 56320), v++), T += _ < 128 ? 1 : _ < 2048 ? 2 : _ < 65536 ? 3 : 4;
          for (d = o.uint8array ? new Uint8Array(T) : new Array(T), v = E = 0; E < T; v++) (64512 & (_ = b.charCodeAt(v))) == 55296 && v + 1 < A && (64512 & (u = b.charCodeAt(v + 1))) == 56320 && (_ = 65536 + (_ - 55296 << 10) + (u - 56320), v++), _ < 128 ? d[E++] = _ : (_ < 2048 ? d[E++] = 192 | _ >>> 6 : (_ < 65536 ? d[E++] = 224 | _ >>> 12 : (d[E++] = 240 | _ >>> 18, d[E++] = 128 | _ >>> 12 & 63), d[E++] = 128 | _ >>> 6 & 63), d[E++] = 128 | 63 & _);
          return d;
        }(h);
      }, n.utf8decode = function(h) {
        return o.nodebuffer ? a.transformTo("nodebuffer", h).toString("utf-8") : function(b) {
          var d, _, u, v, E = b.length, A = new Array(2 * E);
          for (d = _ = 0; d < E; ) if ((u = b[d++]) < 128) A[_++] = u;
          else if (4 < (v = p[u])) A[_++] = 65533, d += v - 1;
          else {
            for (u &= v === 2 ? 31 : v === 3 ? 15 : 7; 1 < v && d < E; ) u = u << 6 | 63 & b[d++], v--;
            1 < v ? A[_++] = 65533 : u < 65536 ? A[_++] = u : (u -= 65536, A[_++] = 55296 | u >> 10 & 1023, A[_++] = 56320 | 1023 & u);
          }
          return A.length !== _ && (A.subarray ? A = A.subarray(0, _) : A.length = _), a.applyFromCharCode(A);
        }(h = a.transformTo(o.uint8array ? "uint8array" : "array", h));
      }, a.inherits(y, c), y.prototype.processChunk = function(h) {
        var b = a.transformTo(o.uint8array ? "uint8array" : "array", h.data);
        if (this.leftOver && this.leftOver.length) {
          if (o.uint8array) {
            var d = b;
            (b = new Uint8Array(d.length + this.leftOver.length)).set(this.leftOver, 0), b.set(d, this.leftOver.length);
          } else b = this.leftOver.concat(b);
          this.leftOver = null;
        }
        var _ = function(v, E) {
          var A;
          for ((E = E || v.length) > v.length && (E = v.length), A = E - 1; 0 <= A && (192 & v[A]) == 128; ) A--;
          return A < 0 || A === 0 ? E : A + p[v[A]] > E ? A : E;
        }(b), u = b;
        _ !== b.length && (o.uint8array ? (u = b.subarray(0, _), this.leftOver = b.subarray(_, b.length)) : (u = b.slice(0, _), this.leftOver = b.slice(_, b.length))), this.push({ data: n.utf8decode(u), meta: h.meta });
      }, y.prototype.flush = function() {
        this.leftOver && this.leftOver.length && (this.push({ data: n.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
      }, n.Utf8DecodeWorker = y, a.inherits(m, c), m.prototype.processChunk = function(h) {
        this.push({ data: n.utf8encode(h.data), meta: h.meta });
      }, n.Utf8EncodeWorker = m;
    }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(t, r, n) {
      var a = t("./support"), o = t("./base64"), s = t("./nodejsUtils"), c = t("./external");
      function p(d) {
        return d;
      }
      function f(d, _) {
        for (var u = 0; u < d.length; ++u) _[u] = 255 & d.charCodeAt(u);
        return _;
      }
      t("setimmediate"), n.newBlob = function(d, _) {
        n.checkSupport("blob");
        try {
          return new Blob([d], { type: _ });
        } catch {
          try {
            var u = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            return u.append(d), u.getBlob(_);
          } catch {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      };
      var y = { stringifyByChunk: function(d, _, u) {
        var v = [], E = 0, A = d.length;
        if (A <= u) return String.fromCharCode.apply(null, d);
        for (; E < A; ) _ === "array" || _ === "nodebuffer" ? v.push(String.fromCharCode.apply(null, d.slice(E, Math.min(E + u, A)))) : v.push(String.fromCharCode.apply(null, d.subarray(E, Math.min(E + u, A)))), E += u;
        return v.join("");
      }, stringifyByChar: function(d) {
        for (var _ = "", u = 0; u < d.length; u++) _ += String.fromCharCode(d[u]);
        return _;
      }, applyCanBeUsed: { uint8array: function() {
        try {
          return a.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
        } catch {
          return !1;
        }
      }(), nodebuffer: function() {
        try {
          return a.nodebuffer && String.fromCharCode.apply(null, s.allocBuffer(1)).length === 1;
        } catch {
          return !1;
        }
      }() } };
      function m(d) {
        var _ = 65536, u = n.getTypeOf(d), v = !0;
        if (u === "uint8array" ? v = y.applyCanBeUsed.uint8array : u === "nodebuffer" && (v = y.applyCanBeUsed.nodebuffer), v) for (; 1 < _; ) try {
          return y.stringifyByChunk(d, u, _);
        } catch {
          _ = Math.floor(_ / 2);
        }
        return y.stringifyByChar(d);
      }
      function h(d, _) {
        for (var u = 0; u < d.length; u++) _[u] = d[u];
        return _;
      }
      n.applyFromCharCode = m;
      var b = {};
      b.string = { string: p, array: function(d) {
        return f(d, new Array(d.length));
      }, arraybuffer: function(d) {
        return b.string.uint8array(d).buffer;
      }, uint8array: function(d) {
        return f(d, new Uint8Array(d.length));
      }, nodebuffer: function(d) {
        return f(d, s.allocBuffer(d.length));
      } }, b.array = { string: m, array: p, arraybuffer: function(d) {
        return new Uint8Array(d).buffer;
      }, uint8array: function(d) {
        return new Uint8Array(d);
      }, nodebuffer: function(d) {
        return s.newBufferFrom(d);
      } }, b.arraybuffer = { string: function(d) {
        return m(new Uint8Array(d));
      }, array: function(d) {
        return h(new Uint8Array(d), new Array(d.byteLength));
      }, arraybuffer: p, uint8array: function(d) {
        return new Uint8Array(d);
      }, nodebuffer: function(d) {
        return s.newBufferFrom(new Uint8Array(d));
      } }, b.uint8array = { string: m, array: function(d) {
        return h(d, new Array(d.length));
      }, arraybuffer: function(d) {
        return d.buffer;
      }, uint8array: p, nodebuffer: function(d) {
        return s.newBufferFrom(d);
      } }, b.nodebuffer = { string: m, array: function(d) {
        return h(d, new Array(d.length));
      }, arraybuffer: function(d) {
        return b.nodebuffer.uint8array(d).buffer;
      }, uint8array: function(d) {
        return h(d, new Uint8Array(d.length));
      }, nodebuffer: p }, n.transformTo = function(d, _) {
        if (_ = _ || "", !d) return _;
        n.checkSupport(d);
        var u = n.getTypeOf(_);
        return b[u][d](_);
      }, n.resolve = function(d) {
        for (var _ = d.split("/"), u = [], v = 0; v < _.length; v++) {
          var E = _[v];
          E === "." || E === "" && v !== 0 && v !== _.length - 1 || (E === ".." ? u.pop() : u.push(E));
        }
        return u.join("/");
      }, n.getTypeOf = function(d) {
        return typeof d == "string" ? "string" : Object.prototype.toString.call(d) === "[object Array]" ? "array" : a.nodebuffer && s.isBuffer(d) ? "nodebuffer" : a.uint8array && d instanceof Uint8Array ? "uint8array" : a.arraybuffer && d instanceof ArrayBuffer ? "arraybuffer" : void 0;
      }, n.checkSupport = function(d) {
        if (!a[d.toLowerCase()]) throw new Error(d + " is not supported by this platform");
      }, n.MAX_VALUE_16BITS = 65535, n.MAX_VALUE_32BITS = -1, n.pretty = function(d) {
        var _, u, v = "";
        for (u = 0; u < (d || "").length; u++) v += "\\x" + ((_ = d.charCodeAt(u)) < 16 ? "0" : "") + _.toString(16).toUpperCase();
        return v;
      }, n.delay = function(d, _, u) {
        setImmediate(function() {
          d.apply(u || null, _ || []);
        });
      }, n.inherits = function(d, _) {
        function u() {
        }
        u.prototype = _.prototype, d.prototype = new u();
      }, n.extend = function() {
        var d, _, u = {};
        for (d = 0; d < arguments.length; d++) for (_ in arguments[d]) Object.prototype.hasOwnProperty.call(arguments[d], _) && u[_] === void 0 && (u[_] = arguments[d][_]);
        return u;
      }, n.prepareContent = function(d, _, u, v, E) {
        return c.Promise.resolve(_).then(function(A) {
          return a.blob && (A instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(A)) !== -1) && typeof FileReader < "u" ? new c.Promise(function(T, L) {
            var B = new FileReader();
            B.onload = function(j) {
              T(j.target.result);
            }, B.onerror = function(j) {
              L(j.target.error);
            }, B.readAsArrayBuffer(A);
          }) : A;
        }).then(function(A) {
          var T = n.getTypeOf(A);
          return T ? (T === "arraybuffer" ? A = n.transformTo("uint8array", A) : T === "string" && (E ? A = o.decode(A) : u && v !== !0 && (A = function(L) {
            return f(L, a.uint8array ? new Uint8Array(L.length) : new Array(L.length));
          }(A))), A) : c.Promise.reject(new Error("Can't read the data of '" + d + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
        });
      };
    }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(t, r, n) {
      var a = t("./reader/readerFor"), o = t("./utils"), s = t("./signature"), c = t("./zipEntry"), p = t("./support");
      function f(y) {
        this.files = [], this.loadOptions = y;
      }
      f.prototype = { checkSignature: function(y) {
        if (!this.reader.readAndCheckSignature(y)) {
          this.reader.index -= 4;
          var m = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + o.pretty(m) + ", expected " + o.pretty(y) + ")");
        }
      }, isSignature: function(y, m) {
        var h = this.reader.index;
        this.reader.setIndex(y);
        var b = this.reader.readString(4) === m;
        return this.reader.setIndex(h), b;
      }, readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
        var y = this.reader.readData(this.zipCommentLength), m = p.uint8array ? "uint8array" : "array", h = o.transformTo(m, y);
        this.zipComment = this.loadOptions.decodeFileName(h);
      }, readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
        for (var y, m, h, b = this.zip64EndOfCentralSize - 44; 0 < b; ) y = this.reader.readInt(2), m = this.reader.readInt(4), h = this.reader.readData(m), this.zip64ExtensibleData[y] = { id: y, length: m, value: h };
      }, readBlockZip64EndOfCentralLocator: function() {
        if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
      }, readLocalFiles: function() {
        var y, m;
        for (y = 0; y < this.files.length; y++) m = this.files[y], this.reader.setIndex(m.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), m.readLocalPart(this.reader), m.handleUTF8(), m.processAttributes();
      }, readCentralDir: function() {
        var y;
        for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (y = new c({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(y);
        if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
      }, readEndOfCentral: function() {
        var y = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
        if (y < 0) throw this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
        this.reader.setIndex(y);
        var m = y;
        if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === o.MAX_VALUE_16BITS || this.diskWithCentralDirStart === o.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === o.MAX_VALUE_16BITS || this.centralDirRecords === o.MAX_VALUE_16BITS || this.centralDirSize === o.MAX_VALUE_32BITS || this.centralDirOffset === o.MAX_VALUE_32BITS) {
          if (this.zip64 = !0, (y = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          if (this.reader.setIndex(y), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
        }
        var h = this.centralDirOffset + this.centralDirSize;
        this.zip64 && (h += 20, h += 12 + this.zip64EndOfCentralSize);
        var b = m - h;
        if (0 < b) this.isSignature(m, s.CENTRAL_FILE_HEADER) || (this.reader.zero = b);
        else if (b < 0) throw new Error("Corrupted zip: missing " + Math.abs(b) + " bytes.");
      }, prepareReader: function(y) {
        this.reader = a(y);
      }, load: function(y) {
        this.prepareReader(y), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
      } }, r.exports = f;
    }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(t, r, n) {
      var a = t("./reader/readerFor"), o = t("./utils"), s = t("./compressedObject"), c = t("./crc32"), p = t("./utf8"), f = t("./compressions"), y = t("./support");
      function m(h, b) {
        this.options = h, this.loadOptions = b;
      }
      m.prototype = { isEncrypted: function() {
        return (1 & this.bitFlag) == 1;
      }, useUTF8: function() {
        return (2048 & this.bitFlag) == 2048;
      }, readLocalPart: function(h) {
        var b, d;
        if (h.skip(22), this.fileNameLength = h.readInt(2), d = h.readInt(2), this.fileName = h.readData(this.fileNameLength), h.skip(d), this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        if ((b = function(_) {
          for (var u in f) if (Object.prototype.hasOwnProperty.call(f, u) && f[u].magic === _) return f[u];
          return null;
        }(this.compressionMethod)) === null) throw new Error("Corrupted zip : compression " + o.pretty(this.compressionMethod) + " unknown (inner file : " + o.transformTo("string", this.fileName) + ")");
        this.decompressed = new s(this.compressedSize, this.uncompressedSize, this.crc32, b, h.readData(this.compressedSize));
      }, readCentralPart: function(h) {
        this.versionMadeBy = h.readInt(2), h.skip(2), this.bitFlag = h.readInt(2), this.compressionMethod = h.readString(2), this.date = h.readDate(), this.crc32 = h.readInt(4), this.compressedSize = h.readInt(4), this.uncompressedSize = h.readInt(4);
        var b = h.readInt(2);
        if (this.extraFieldsLength = h.readInt(2), this.fileCommentLength = h.readInt(2), this.diskNumberStart = h.readInt(2), this.internalFileAttributes = h.readInt(2), this.externalFileAttributes = h.readInt(4), this.localHeaderOffset = h.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
        h.skip(b), this.readExtraFields(h), this.parseZIP64ExtraField(h), this.fileComment = h.readData(this.fileCommentLength);
      }, processAttributes: function() {
        this.unixPermissions = null, this.dosPermissions = null;
        var h = this.versionMadeBy >> 8;
        this.dir = !!(16 & this.externalFileAttributes), h == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), h == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
      }, parseZIP64ExtraField: function() {
        if (this.extraFields[1]) {
          var h = a(this.extraFields[1].value);
          this.uncompressedSize === o.MAX_VALUE_32BITS && (this.uncompressedSize = h.readInt(8)), this.compressedSize === o.MAX_VALUE_32BITS && (this.compressedSize = h.readInt(8)), this.localHeaderOffset === o.MAX_VALUE_32BITS && (this.localHeaderOffset = h.readInt(8)), this.diskNumberStart === o.MAX_VALUE_32BITS && (this.diskNumberStart = h.readInt(4));
        }
      }, readExtraFields: function(h) {
        var b, d, _, u = h.index + this.extraFieldsLength;
        for (this.extraFields || (this.extraFields = {}); h.index + 4 < u; ) b = h.readInt(2), d = h.readInt(2), _ = h.readData(d), this.extraFields[b] = { id: b, length: d, value: _ };
        h.setIndex(u);
      }, handleUTF8: function() {
        var h = y.uint8array ? "uint8array" : "array";
        if (this.useUTF8()) this.fileNameStr = p.utf8decode(this.fileName), this.fileCommentStr = p.utf8decode(this.fileComment);
        else {
          var b = this.findExtraFieldUnicodePath();
          if (b !== null) this.fileNameStr = b;
          else {
            var d = o.transformTo(h, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(d);
          }
          var _ = this.findExtraFieldUnicodeComment();
          if (_ !== null) this.fileCommentStr = _;
          else {
            var u = o.transformTo(h, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(u);
          }
        }
      }, findExtraFieldUnicodePath: function() {
        var h = this.extraFields[28789];
        if (h) {
          var b = a(h.value);
          return b.readInt(1) !== 1 || c(this.fileName) !== b.readInt(4) ? null : p.utf8decode(b.readData(h.length - 5));
        }
        return null;
      }, findExtraFieldUnicodeComment: function() {
        var h = this.extraFields[25461];
        if (h) {
          var b = a(h.value);
          return b.readInt(1) !== 1 || c(this.fileComment) !== b.readInt(4) ? null : p.utf8decode(b.readData(h.length - 5));
        }
        return null;
      } }, r.exports = m;
    }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(t, r, n) {
      function a(b, d, _) {
        this.name = b, this.dir = _.dir, this.date = _.date, this.comment = _.comment, this.unixPermissions = _.unixPermissions, this.dosPermissions = _.dosPermissions, this._data = d, this._dataBinary = _.binary, this.options = { compression: _.compression, compressionOptions: _.compressionOptions };
      }
      var o = t("./stream/StreamHelper"), s = t("./stream/DataWorker"), c = t("./utf8"), p = t("./compressedObject"), f = t("./stream/GenericWorker");
      a.prototype = { internalStream: function(b) {
        var d = null, _ = "string";
        try {
          if (!b) throw new Error("No output type specified.");
          var u = (_ = b.toLowerCase()) === "string" || _ === "text";
          _ !== "binarystring" && _ !== "text" || (_ = "string"), d = this._decompressWorker();
          var v = !this._dataBinary;
          v && !u && (d = d.pipe(new c.Utf8EncodeWorker())), !v && u && (d = d.pipe(new c.Utf8DecodeWorker()));
        } catch (E) {
          (d = new f("error")).error(E);
        }
        return new o(d, _, "");
      }, async: function(b, d) {
        return this.internalStream(b).accumulate(d);
      }, nodeStream: function(b, d) {
        return this.internalStream(b || "nodebuffer").toNodejsStream(d);
      }, _compressWorker: function(b, d) {
        if (this._data instanceof p && this._data.compression.magic === b.magic) return this._data.getCompressedWorker();
        var _ = this._decompressWorker();
        return this._dataBinary || (_ = _.pipe(new c.Utf8EncodeWorker())), p.createWorkerFrom(_, b, d);
      }, _decompressWorker: function() {
        return this._data instanceof p ? this._data.getContentWorker() : this._data instanceof f ? this._data : new s(this._data);
      } };
      for (var y = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], m = function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, h = 0; h < y.length; h++) a.prototype[y[h]] = m;
      r.exports = a;
    }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(t, r, n) {
      (function(a) {
        var o, s, c = a.MutationObserver || a.WebKitMutationObserver;
        if (c) {
          var p = 0, f = new c(b), y = a.document.createTextNode("");
          f.observe(y, { characterData: !0 }), o = function() {
            y.data = p = ++p % 2;
          };
        } else if (a.setImmediate || a.MessageChannel === void 0) o = "document" in a && "onreadystatechange" in a.document.createElement("script") ? function() {
          var d = a.document.createElement("script");
          d.onreadystatechange = function() {
            b(), d.onreadystatechange = null, d.parentNode.removeChild(d), d = null;
          }, a.document.documentElement.appendChild(d);
        } : function() {
          setTimeout(b, 0);
        };
        else {
          var m = new a.MessageChannel();
          m.port1.onmessage = b, o = function() {
            m.port2.postMessage(0);
          };
        }
        var h = [];
        function b() {
          var d, _;
          s = !0;
          for (var u = h.length; u; ) {
            for (_ = h, h = [], d = -1; ++d < u; ) _[d]();
            u = h.length;
          }
          s = !1;
        }
        r.exports = function(d) {
          h.push(d) !== 1 || s || o();
        };
      }).call(this, typeof St < "u" ? St : typeof self < "u" ? self : typeof window < "u" ? window : {});
    }, {}], 37: [function(t, r, n) {
      var a = t("immediate");
      function o() {
      }
      var s = {}, c = ["REJECTED"], p = ["FULFILLED"], f = ["PENDING"];
      function y(u) {
        if (typeof u != "function") throw new TypeError("resolver must be a function");
        this.state = f, this.queue = [], this.outcome = void 0, u !== o && d(this, u);
      }
      function m(u, v, E) {
        this.promise = u, typeof v == "function" && (this.onFulfilled = v, this.callFulfilled = this.otherCallFulfilled), typeof E == "function" && (this.onRejected = E, this.callRejected = this.otherCallRejected);
      }
      function h(u, v, E) {
        a(function() {
          var A;
          try {
            A = v(E);
          } catch (T) {
            return s.reject(u, T);
          }
          A === u ? s.reject(u, new TypeError("Cannot resolve promise with itself")) : s.resolve(u, A);
        });
      }
      function b(u) {
        var v = u && u.then;
        if (u && (typeof u == "object" || typeof u == "function") && typeof v == "function") return function() {
          v.apply(u, arguments);
        };
      }
      function d(u, v) {
        var E = !1;
        function A(B) {
          E || (E = !0, s.reject(u, B));
        }
        function T(B) {
          E || (E = !0, s.resolve(u, B));
        }
        var L = _(function() {
          v(T, A);
        });
        L.status === "error" && A(L.value);
      }
      function _(u, v) {
        var E = {};
        try {
          E.value = u(v), E.status = "success";
        } catch (A) {
          E.status = "error", E.value = A;
        }
        return E;
      }
      (r.exports = y).prototype.finally = function(u) {
        if (typeof u != "function") return this;
        var v = this.constructor;
        return this.then(function(E) {
          return v.resolve(u()).then(function() {
            return E;
          });
        }, function(E) {
          return v.resolve(u()).then(function() {
            throw E;
          });
        });
      }, y.prototype.catch = function(u) {
        return this.then(null, u);
      }, y.prototype.then = function(u, v) {
        if (typeof u != "function" && this.state === p || typeof v != "function" && this.state === c) return this;
        var E = new this.constructor(o);
        return this.state !== f ? h(E, this.state === p ? u : v, this.outcome) : this.queue.push(new m(E, u, v)), E;
      }, m.prototype.callFulfilled = function(u) {
        s.resolve(this.promise, u);
      }, m.prototype.otherCallFulfilled = function(u) {
        h(this.promise, this.onFulfilled, u);
      }, m.prototype.callRejected = function(u) {
        s.reject(this.promise, u);
      }, m.prototype.otherCallRejected = function(u) {
        h(this.promise, this.onRejected, u);
      }, s.resolve = function(u, v) {
        var E = _(b, v);
        if (E.status === "error") return s.reject(u, E.value);
        var A = E.value;
        if (A) d(u, A);
        else {
          u.state = p, u.outcome = v;
          for (var T = -1, L = u.queue.length; ++T < L; ) u.queue[T].callFulfilled(v);
        }
        return u;
      }, s.reject = function(u, v) {
        u.state = c, u.outcome = v;
        for (var E = -1, A = u.queue.length; ++E < A; ) u.queue[E].callRejected(v);
        return u;
      }, y.resolve = function(u) {
        return u instanceof this ? u : s.resolve(new this(o), u);
      }, y.reject = function(u) {
        var v = new this(o);
        return s.reject(v, u);
      }, y.all = function(u) {
        var v = this;
        if (Object.prototype.toString.call(u) !== "[object Array]") return this.reject(new TypeError("must be an array"));
        var E = u.length, A = !1;
        if (!E) return this.resolve([]);
        for (var T = new Array(E), L = 0, B = -1, j = new this(o); ++B < E; ) z(u[B], B);
        return j;
        function z(Z, Q) {
          v.resolve(Z).then(function(k) {
            T[Q] = k, ++L !== E || A || (A = !0, s.resolve(j, T));
          }, function(k) {
            A || (A = !0, s.reject(j, k));
          });
        }
      }, y.race = function(u) {
        var v = this;
        if (Object.prototype.toString.call(u) !== "[object Array]") return this.reject(new TypeError("must be an array"));
        var E = u.length, A = !1;
        if (!E) return this.resolve([]);
        for (var T = -1, L = new this(o); ++T < E; ) B = u[T], v.resolve(B).then(function(j) {
          A || (A = !0, s.resolve(L, j));
        }, function(j) {
          A || (A = !0, s.reject(L, j));
        });
        var B;
        return L;
      };
    }, { immediate: 36 }], 38: [function(t, r, n) {
      var a = {};
      (0, t("./lib/utils/common").assign)(a, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")), r.exports = a;
    }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(t, r, n) {
      var a = t("./zlib/deflate"), o = t("./utils/common"), s = t("./utils/strings"), c = t("./zlib/messages"), p = t("./zlib/zstream"), f = Object.prototype.toString, y = 0, m = -1, h = 0, b = 8;
      function d(u) {
        if (!(this instanceof d)) return new d(u);
        this.options = o.assign({ level: m, method: b, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: h, to: "" }, u || {});
        var v = this.options;
        v.raw && 0 < v.windowBits ? v.windowBits = -v.windowBits : v.gzip && 0 < v.windowBits && v.windowBits < 16 && (v.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new p(), this.strm.avail_out = 0;
        var E = a.deflateInit2(this.strm, v.level, v.method, v.windowBits, v.memLevel, v.strategy);
        if (E !== y) throw new Error(c[E]);
        if (v.header && a.deflateSetHeader(this.strm, v.header), v.dictionary) {
          var A;
          if (A = typeof v.dictionary == "string" ? s.string2buf(v.dictionary) : f.call(v.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(v.dictionary) : v.dictionary, (E = a.deflateSetDictionary(this.strm, A)) !== y) throw new Error(c[E]);
          this._dict_set = !0;
        }
      }
      function _(u, v) {
        var E = new d(v);
        if (E.push(u, !0), E.err) throw E.msg || c[E.err];
        return E.result;
      }
      d.prototype.push = function(u, v) {
        var E, A, T = this.strm, L = this.options.chunkSize;
        if (this.ended) return !1;
        A = v === ~~v ? v : v === !0 ? 4 : 0, typeof u == "string" ? T.input = s.string2buf(u) : f.call(u) === "[object ArrayBuffer]" ? T.input = new Uint8Array(u) : T.input = u, T.next_in = 0, T.avail_in = T.input.length;
        do {
          if (T.avail_out === 0 && (T.output = new o.Buf8(L), T.next_out = 0, T.avail_out = L), (E = a.deflate(T, A)) !== 1 && E !== y) return this.onEnd(E), !(this.ended = !0);
          T.avail_out !== 0 && (T.avail_in !== 0 || A !== 4 && A !== 2) || (this.options.to === "string" ? this.onData(s.buf2binstring(o.shrinkBuf(T.output, T.next_out))) : this.onData(o.shrinkBuf(T.output, T.next_out)));
        } while ((0 < T.avail_in || T.avail_out === 0) && E !== 1);
        return A === 4 ? (E = a.deflateEnd(this.strm), this.onEnd(E), this.ended = !0, E === y) : A !== 2 || (this.onEnd(y), !(T.avail_out = 0));
      }, d.prototype.onData = function(u) {
        this.chunks.push(u);
      }, d.prototype.onEnd = function(u) {
        u === y && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = u, this.msg = this.strm.msg;
      }, n.Deflate = d, n.deflate = _, n.deflateRaw = function(u, v) {
        return (v = v || {}).raw = !0, _(u, v);
      }, n.gzip = function(u, v) {
        return (v = v || {}).gzip = !0, _(u, v);
      };
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(t, r, n) {
      var a = t("./zlib/inflate"), o = t("./utils/common"), s = t("./utils/strings"), c = t("./zlib/constants"), p = t("./zlib/messages"), f = t("./zlib/zstream"), y = t("./zlib/gzheader"), m = Object.prototype.toString;
      function h(d) {
        if (!(this instanceof h)) return new h(d);
        this.options = o.assign({ chunkSize: 16384, windowBits: 0, to: "" }, d || {});
        var _ = this.options;
        _.raw && 0 <= _.windowBits && _.windowBits < 16 && (_.windowBits = -_.windowBits, _.windowBits === 0 && (_.windowBits = -15)), !(0 <= _.windowBits && _.windowBits < 16) || d && d.windowBits || (_.windowBits += 32), 15 < _.windowBits && _.windowBits < 48 && !(15 & _.windowBits) && (_.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new f(), this.strm.avail_out = 0;
        var u = a.inflateInit2(this.strm, _.windowBits);
        if (u !== c.Z_OK) throw new Error(p[u]);
        this.header = new y(), a.inflateGetHeader(this.strm, this.header);
      }
      function b(d, _) {
        var u = new h(_);
        if (u.push(d, !0), u.err) throw u.msg || p[u.err];
        return u.result;
      }
      h.prototype.push = function(d, _) {
        var u, v, E, A, T, L, B = this.strm, j = this.options.chunkSize, z = this.options.dictionary, Z = !1;
        if (this.ended) return !1;
        v = _ === ~~_ ? _ : _ === !0 ? c.Z_FINISH : c.Z_NO_FLUSH, typeof d == "string" ? B.input = s.binstring2buf(d) : m.call(d) === "[object ArrayBuffer]" ? B.input = new Uint8Array(d) : B.input = d, B.next_in = 0, B.avail_in = B.input.length;
        do {
          if (B.avail_out === 0 && (B.output = new o.Buf8(j), B.next_out = 0, B.avail_out = j), (u = a.inflate(B, c.Z_NO_FLUSH)) === c.Z_NEED_DICT && z && (L = typeof z == "string" ? s.string2buf(z) : m.call(z) === "[object ArrayBuffer]" ? new Uint8Array(z) : z, u = a.inflateSetDictionary(this.strm, L)), u === c.Z_BUF_ERROR && Z === !0 && (u = c.Z_OK, Z = !1), u !== c.Z_STREAM_END && u !== c.Z_OK) return this.onEnd(u), !(this.ended = !0);
          B.next_out && (B.avail_out !== 0 && u !== c.Z_STREAM_END && (B.avail_in !== 0 || v !== c.Z_FINISH && v !== c.Z_SYNC_FLUSH) || (this.options.to === "string" ? (E = s.utf8border(B.output, B.next_out), A = B.next_out - E, T = s.buf2string(B.output, E), B.next_out = A, B.avail_out = j - A, A && o.arraySet(B.output, B.output, E, A, 0), this.onData(T)) : this.onData(o.shrinkBuf(B.output, B.next_out)))), B.avail_in === 0 && B.avail_out === 0 && (Z = !0);
        } while ((0 < B.avail_in || B.avail_out === 0) && u !== c.Z_STREAM_END);
        return u === c.Z_STREAM_END && (v = c.Z_FINISH), v === c.Z_FINISH ? (u = a.inflateEnd(this.strm), this.onEnd(u), this.ended = !0, u === c.Z_OK) : v !== c.Z_SYNC_FLUSH || (this.onEnd(c.Z_OK), !(B.avail_out = 0));
      }, h.prototype.onData = function(d) {
        this.chunks.push(d);
      }, h.prototype.onEnd = function(d) {
        d === c.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = d, this.msg = this.strm.msg;
      }, n.Inflate = h, n.inflate = b, n.inflateRaw = function(d, _) {
        return (_ = _ || {}).raw = !0, b(d, _);
      }, n.ungzip = b;
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(t, r, n) {
      var a = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
      n.assign = function(c) {
        for (var p = Array.prototype.slice.call(arguments, 1); p.length; ) {
          var f = p.shift();
          if (f) {
            if (typeof f != "object") throw new TypeError(f + "must be non-object");
            for (var y in f) f.hasOwnProperty(y) && (c[y] = f[y]);
          }
        }
        return c;
      }, n.shrinkBuf = function(c, p) {
        return c.length === p ? c : c.subarray ? c.subarray(0, p) : (c.length = p, c);
      };
      var o = { arraySet: function(c, p, f, y, m) {
        if (p.subarray && c.subarray) c.set(p.subarray(f, f + y), m);
        else for (var h = 0; h < y; h++) c[m + h] = p[f + h];
      }, flattenChunks: function(c) {
        var p, f, y, m, h, b;
        for (p = y = 0, f = c.length; p < f; p++) y += c[p].length;
        for (b = new Uint8Array(y), p = m = 0, f = c.length; p < f; p++) h = c[p], b.set(h, m), m += h.length;
        return b;
      } }, s = { arraySet: function(c, p, f, y, m) {
        for (var h = 0; h < y; h++) c[m + h] = p[f + h];
      }, flattenChunks: function(c) {
        return [].concat.apply([], c);
      } };
      n.setTyped = function(c) {
        c ? (n.Buf8 = Uint8Array, n.Buf16 = Uint16Array, n.Buf32 = Int32Array, n.assign(n, o)) : (n.Buf8 = Array, n.Buf16 = Array, n.Buf32 = Array, n.assign(n, s));
      }, n.setTyped(a);
    }, {}], 42: [function(t, r, n) {
      var a = t("./common"), o = !0, s = !0;
      try {
        String.fromCharCode.apply(null, [0]);
      } catch {
        o = !1;
      }
      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch {
        s = !1;
      }
      for (var c = new a.Buf8(256), p = 0; p < 256; p++) c[p] = 252 <= p ? 6 : 248 <= p ? 5 : 240 <= p ? 4 : 224 <= p ? 3 : 192 <= p ? 2 : 1;
      function f(y, m) {
        if (m < 65537 && (y.subarray && s || !y.subarray && o)) return String.fromCharCode.apply(null, a.shrinkBuf(y, m));
        for (var h = "", b = 0; b < m; b++) h += String.fromCharCode(y[b]);
        return h;
      }
      c[254] = c[254] = 1, n.string2buf = function(y) {
        var m, h, b, d, _, u = y.length, v = 0;
        for (d = 0; d < u; d++) (64512 & (h = y.charCodeAt(d))) == 55296 && d + 1 < u && (64512 & (b = y.charCodeAt(d + 1))) == 56320 && (h = 65536 + (h - 55296 << 10) + (b - 56320), d++), v += h < 128 ? 1 : h < 2048 ? 2 : h < 65536 ? 3 : 4;
        for (m = new a.Buf8(v), d = _ = 0; _ < v; d++) (64512 & (h = y.charCodeAt(d))) == 55296 && d + 1 < u && (64512 & (b = y.charCodeAt(d + 1))) == 56320 && (h = 65536 + (h - 55296 << 10) + (b - 56320), d++), h < 128 ? m[_++] = h : (h < 2048 ? m[_++] = 192 | h >>> 6 : (h < 65536 ? m[_++] = 224 | h >>> 12 : (m[_++] = 240 | h >>> 18, m[_++] = 128 | h >>> 12 & 63), m[_++] = 128 | h >>> 6 & 63), m[_++] = 128 | 63 & h);
        return m;
      }, n.buf2binstring = function(y) {
        return f(y, y.length);
      }, n.binstring2buf = function(y) {
        for (var m = new a.Buf8(y.length), h = 0, b = m.length; h < b; h++) m[h] = y.charCodeAt(h);
        return m;
      }, n.buf2string = function(y, m) {
        var h, b, d, _, u = m || y.length, v = new Array(2 * u);
        for (h = b = 0; h < u; ) if ((d = y[h++]) < 128) v[b++] = d;
        else if (4 < (_ = c[d])) v[b++] = 65533, h += _ - 1;
        else {
          for (d &= _ === 2 ? 31 : _ === 3 ? 15 : 7; 1 < _ && h < u; ) d = d << 6 | 63 & y[h++], _--;
          1 < _ ? v[b++] = 65533 : d < 65536 ? v[b++] = d : (d -= 65536, v[b++] = 55296 | d >> 10 & 1023, v[b++] = 56320 | 1023 & d);
        }
        return f(v, b);
      }, n.utf8border = function(y, m) {
        var h;
        for ((m = m || y.length) > y.length && (m = y.length), h = m - 1; 0 <= h && (192 & y[h]) == 128; ) h--;
        return h < 0 || h === 0 ? m : h + c[y[h]] > m ? h : m;
      };
    }, { "./common": 41 }], 43: [function(t, r, n) {
      r.exports = function(a, o, s, c) {
        for (var p = 65535 & a | 0, f = a >>> 16 & 65535 | 0, y = 0; s !== 0; ) {
          for (s -= y = 2e3 < s ? 2e3 : s; f = f + (p = p + o[c++] | 0) | 0, --y; ) ;
          p %= 65521, f %= 65521;
        }
        return p | f << 16 | 0;
      };
    }, {}], 44: [function(t, r, n) {
      r.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
    }, {}], 45: [function(t, r, n) {
      var a = function() {
        for (var o, s = [], c = 0; c < 256; c++) {
          o = c;
          for (var p = 0; p < 8; p++) o = 1 & o ? 3988292384 ^ o >>> 1 : o >>> 1;
          s[c] = o;
        }
        return s;
      }();
      r.exports = function(o, s, c, p) {
        var f = a, y = p + c;
        o ^= -1;
        for (var m = p; m < y; m++) o = o >>> 8 ^ f[255 & (o ^ s[m])];
        return -1 ^ o;
      };
    }, {}], 46: [function(t, r, n) {
      var a, o = t("../utils/common"), s = t("./trees"), c = t("./adler32"), p = t("./crc32"), f = t("./messages"), y = 0, m = 4, h = 0, b = -2, d = -1, _ = 4, u = 2, v = 8, E = 9, A = 286, T = 30, L = 19, B = 2 * A + 1, j = 15, z = 3, Z = 258, Q = Z + z + 1, k = 42, N = 113, l = 1, D = 2, et = 3, U = 4;
      function rt(i, O) {
        return i.msg = f[O], O;
      }
      function W(i) {
        return (i << 1) - (4 < i ? 9 : 0);
      }
      function tt(i) {
        for (var O = i.length; 0 <= --O; ) i[O] = 0;
      }
      function F(i) {
        var O = i.state, P = O.pending;
        P > i.avail_out && (P = i.avail_out), P !== 0 && (o.arraySet(i.output, O.pending_buf, O.pending_out, P, i.next_out), i.next_out += P, O.pending_out += P, i.total_out += P, i.avail_out -= P, O.pending -= P, O.pending === 0 && (O.pending_out = 0));
      }
      function I(i, O) {
        s._tr_flush_block(i, 0 <= i.block_start ? i.block_start : -1, i.strstart - i.block_start, O), i.block_start = i.strstart, F(i.strm);
      }
      function J(i, O) {
        i.pending_buf[i.pending++] = O;
      }
      function Y(i, O) {
        i.pending_buf[i.pending++] = O >>> 8 & 255, i.pending_buf[i.pending++] = 255 & O;
      }
      function V(i, O) {
        var P, w, g = i.max_chain_length, S = i.strstart, M = i.prev_length, $ = i.nice_match, R = i.strstart > i.w_size - Q ? i.strstart - (i.w_size - Q) : 0, H = i.window, q = i.w_mask, G = i.prev, K = i.strstart + Z, ot = H[S + M - 1], st = H[S + M];
        i.prev_length >= i.good_match && (g >>= 2), $ > i.lookahead && ($ = i.lookahead);
        do
          if (H[(P = O) + M] === st && H[P + M - 1] === ot && H[P] === H[S] && H[++P] === H[S + 1]) {
            S += 2, P++;
            do
              ;
            while (H[++S] === H[++P] && H[++S] === H[++P] && H[++S] === H[++P] && H[++S] === H[++P] && H[++S] === H[++P] && H[++S] === H[++P] && H[++S] === H[++P] && H[++S] === H[++P] && S < K);
            if (w = Z - (K - S), S = K - Z, M < w) {
              if (i.match_start = O, $ <= (M = w)) break;
              ot = H[S + M - 1], st = H[S + M];
            }
          }
        while ((O = G[O & q]) > R && --g != 0);
        return M <= i.lookahead ? M : i.lookahead;
      }
      function lt(i) {
        var O, P, w, g, S, M, $, R, H, q, G = i.w_size;
        do {
          if (g = i.window_size - i.lookahead - i.strstart, i.strstart >= G + (G - Q)) {
            for (o.arraySet(i.window, i.window, G, G, 0), i.match_start -= G, i.strstart -= G, i.block_start -= G, O = P = i.hash_size; w = i.head[--O], i.head[O] = G <= w ? w - G : 0, --P; ) ;
            for (O = P = G; w = i.prev[--O], i.prev[O] = G <= w ? w - G : 0, --P; ) ;
            g += G;
          }
          if (i.strm.avail_in === 0) break;
          if (M = i.strm, $ = i.window, R = i.strstart + i.lookahead, H = g, q = void 0, q = M.avail_in, H < q && (q = H), P = q === 0 ? 0 : (M.avail_in -= q, o.arraySet($, M.input, M.next_in, q, R), M.state.wrap === 1 ? M.adler = c(M.adler, $, q, R) : M.state.wrap === 2 && (M.adler = p(M.adler, $, q, R)), M.next_in += q, M.total_in += q, q), i.lookahead += P, i.lookahead + i.insert >= z) for (S = i.strstart - i.insert, i.ins_h = i.window[S], i.ins_h = (i.ins_h << i.hash_shift ^ i.window[S + 1]) & i.hash_mask; i.insert && (i.ins_h = (i.ins_h << i.hash_shift ^ i.window[S + z - 1]) & i.hash_mask, i.prev[S & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = S, S++, i.insert--, !(i.lookahead + i.insert < z)); ) ;
        } while (i.lookahead < Q && i.strm.avail_in !== 0);
      }
      function ut(i, O) {
        for (var P, w; ; ) {
          if (i.lookahead < Q) {
            if (lt(i), i.lookahead < Q && O === y) return l;
            if (i.lookahead === 0) break;
          }
          if (P = 0, i.lookahead >= z && (i.ins_h = (i.ins_h << i.hash_shift ^ i.window[i.strstart + z - 1]) & i.hash_mask, P = i.prev[i.strstart & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = i.strstart), P !== 0 && i.strstart - P <= i.w_size - Q && (i.match_length = V(i, P)), i.match_length >= z) if (w = s._tr_tally(i, i.strstart - i.match_start, i.match_length - z), i.lookahead -= i.match_length, i.match_length <= i.max_lazy_match && i.lookahead >= z) {
            for (i.match_length--; i.strstart++, i.ins_h = (i.ins_h << i.hash_shift ^ i.window[i.strstart + z - 1]) & i.hash_mask, P = i.prev[i.strstart & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = i.strstart, --i.match_length != 0; ) ;
            i.strstart++;
          } else i.strstart += i.match_length, i.match_length = 0, i.ins_h = i.window[i.strstart], i.ins_h = (i.ins_h << i.hash_shift ^ i.window[i.strstart + 1]) & i.hash_mask;
          else w = s._tr_tally(i, 0, i.window[i.strstart]), i.lookahead--, i.strstart++;
          if (w && (I(i, !1), i.strm.avail_out === 0)) return l;
        }
        return i.insert = i.strstart < z - 1 ? i.strstart : z - 1, O === m ? (I(i, !0), i.strm.avail_out === 0 ? et : U) : i.last_lit && (I(i, !1), i.strm.avail_out === 0) ? l : D;
      }
      function it(i, O) {
        for (var P, w, g; ; ) {
          if (i.lookahead < Q) {
            if (lt(i), i.lookahead < Q && O === y) return l;
            if (i.lookahead === 0) break;
          }
          if (P = 0, i.lookahead >= z && (i.ins_h = (i.ins_h << i.hash_shift ^ i.window[i.strstart + z - 1]) & i.hash_mask, P = i.prev[i.strstart & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = i.strstart), i.prev_length = i.match_length, i.prev_match = i.match_start, i.match_length = z - 1, P !== 0 && i.prev_length < i.max_lazy_match && i.strstart - P <= i.w_size - Q && (i.match_length = V(i, P), i.match_length <= 5 && (i.strategy === 1 || i.match_length === z && 4096 < i.strstart - i.match_start) && (i.match_length = z - 1)), i.prev_length >= z && i.match_length <= i.prev_length) {
            for (g = i.strstart + i.lookahead - z, w = s._tr_tally(i, i.strstart - 1 - i.prev_match, i.prev_length - z), i.lookahead -= i.prev_length - 1, i.prev_length -= 2; ++i.strstart <= g && (i.ins_h = (i.ins_h << i.hash_shift ^ i.window[i.strstart + z - 1]) & i.hash_mask, P = i.prev[i.strstart & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = i.strstart), --i.prev_length != 0; ) ;
            if (i.match_available = 0, i.match_length = z - 1, i.strstart++, w && (I(i, !1), i.strm.avail_out === 0)) return l;
          } else if (i.match_available) {
            if ((w = s._tr_tally(i, 0, i.window[i.strstart - 1])) && I(i, !1), i.strstart++, i.lookahead--, i.strm.avail_out === 0) return l;
          } else i.match_available = 1, i.strstart++, i.lookahead--;
        }
        return i.match_available && (w = s._tr_tally(i, 0, i.window[i.strstart - 1]), i.match_available = 0), i.insert = i.strstart < z - 1 ? i.strstart : z - 1, O === m ? (I(i, !0), i.strm.avail_out === 0 ? et : U) : i.last_lit && (I(i, !1), i.strm.avail_out === 0) ? l : D;
      }
      function at(i, O, P, w, g) {
        this.good_length = i, this.max_lazy = O, this.nice_length = P, this.max_chain = w, this.func = g;
      }
      function dt() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new o.Buf16(2 * B), this.dyn_dtree = new o.Buf16(2 * (2 * T + 1)), this.bl_tree = new o.Buf16(2 * (2 * L + 1)), tt(this.dyn_ltree), tt(this.dyn_dtree), tt(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new o.Buf16(j + 1), this.heap = new o.Buf16(2 * A + 1), tt(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new o.Buf16(2 * A + 1), tt(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }
      function ct(i) {
        var O;
        return i && i.state ? (i.total_in = i.total_out = 0, i.data_type = u, (O = i.state).pending = 0, O.pending_out = 0, O.wrap < 0 && (O.wrap = -O.wrap), O.status = O.wrap ? k : N, i.adler = O.wrap === 2 ? 0 : 1, O.last_flush = y, s._tr_init(O), h) : rt(i, b);
      }
      function bt(i) {
        var O = ct(i);
        return O === h && function(P) {
          P.window_size = 2 * P.w_size, tt(P.head), P.max_lazy_match = a[P.level].max_lazy, P.good_match = a[P.level].good_length, P.nice_match = a[P.level].nice_length, P.max_chain_length = a[P.level].max_chain, P.strstart = 0, P.block_start = 0, P.lookahead = 0, P.insert = 0, P.match_length = P.prev_length = z - 1, P.match_available = 0, P.ins_h = 0;
        }(i.state), O;
      }
      function pt(i, O, P, w, g, S) {
        if (!i) return b;
        var M = 1;
        if (O === d && (O = 6), w < 0 ? (M = 0, w = -w) : 15 < w && (M = 2, w -= 16), g < 1 || E < g || P !== v || w < 8 || 15 < w || O < 0 || 9 < O || S < 0 || _ < S) return rt(i, b);
        w === 8 && (w = 9);
        var $ = new dt();
        return (i.state = $).strm = i, $.wrap = M, $.gzhead = null, $.w_bits = w, $.w_size = 1 << $.w_bits, $.w_mask = $.w_size - 1, $.hash_bits = g + 7, $.hash_size = 1 << $.hash_bits, $.hash_mask = $.hash_size - 1, $.hash_shift = ~~(($.hash_bits + z - 1) / z), $.window = new o.Buf8(2 * $.w_size), $.head = new o.Buf16($.hash_size), $.prev = new o.Buf16($.w_size), $.lit_bufsize = 1 << g + 6, $.pending_buf_size = 4 * $.lit_bufsize, $.pending_buf = new o.Buf8($.pending_buf_size), $.d_buf = 1 * $.lit_bufsize, $.l_buf = 3 * $.lit_bufsize, $.level = O, $.strategy = S, $.method = P, bt(i);
      }
      a = [new at(0, 0, 0, 0, function(i, O) {
        var P = 65535;
        for (P > i.pending_buf_size - 5 && (P = i.pending_buf_size - 5); ; ) {
          if (i.lookahead <= 1) {
            if (lt(i), i.lookahead === 0 && O === y) return l;
            if (i.lookahead === 0) break;
          }
          i.strstart += i.lookahead, i.lookahead = 0;
          var w = i.block_start + P;
          if ((i.strstart === 0 || i.strstart >= w) && (i.lookahead = i.strstart - w, i.strstart = w, I(i, !1), i.strm.avail_out === 0) || i.strstart - i.block_start >= i.w_size - Q && (I(i, !1), i.strm.avail_out === 0)) return l;
        }
        return i.insert = 0, O === m ? (I(i, !0), i.strm.avail_out === 0 ? et : U) : (i.strstart > i.block_start && (I(i, !1), i.strm.avail_out), l);
      }), new at(4, 4, 8, 4, ut), new at(4, 5, 16, 8, ut), new at(4, 6, 32, 32, ut), new at(4, 4, 16, 16, it), new at(8, 16, 32, 32, it), new at(8, 16, 128, 128, it), new at(8, 32, 128, 256, it), new at(32, 128, 258, 1024, it), new at(32, 258, 258, 4096, it)], n.deflateInit = function(i, O) {
        return pt(i, O, v, 15, 8, 0);
      }, n.deflateInit2 = pt, n.deflateReset = bt, n.deflateResetKeep = ct, n.deflateSetHeader = function(i, O) {
        return i && i.state ? i.state.wrap !== 2 ? b : (i.state.gzhead = O, h) : b;
      }, n.deflate = function(i, O) {
        var P, w, g, S;
        if (!i || !i.state || 5 < O || O < 0) return i ? rt(i, b) : b;
        if (w = i.state, !i.output || !i.input && i.avail_in !== 0 || w.status === 666 && O !== m) return rt(i, i.avail_out === 0 ? -5 : b);
        if (w.strm = i, P = w.last_flush, w.last_flush = O, w.status === k) if (w.wrap === 2) i.adler = 0, J(w, 31), J(w, 139), J(w, 8), w.gzhead ? (J(w, (w.gzhead.text ? 1 : 0) + (w.gzhead.hcrc ? 2 : 0) + (w.gzhead.extra ? 4 : 0) + (w.gzhead.name ? 8 : 0) + (w.gzhead.comment ? 16 : 0)), J(w, 255 & w.gzhead.time), J(w, w.gzhead.time >> 8 & 255), J(w, w.gzhead.time >> 16 & 255), J(w, w.gzhead.time >> 24 & 255), J(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), J(w, 255 & w.gzhead.os), w.gzhead.extra && w.gzhead.extra.length && (J(w, 255 & w.gzhead.extra.length), J(w, w.gzhead.extra.length >> 8 & 255)), w.gzhead.hcrc && (i.adler = p(i.adler, w.pending_buf, w.pending, 0)), w.gzindex = 0, w.status = 69) : (J(w, 0), J(w, 0), J(w, 0), J(w, 0), J(w, 0), J(w, w.level === 9 ? 2 : 2 <= w.strategy || w.level < 2 ? 4 : 0), J(w, 3), w.status = N);
        else {
          var M = v + (w.w_bits - 8 << 4) << 8;
          M |= (2 <= w.strategy || w.level < 2 ? 0 : w.level < 6 ? 1 : w.level === 6 ? 2 : 3) << 6, w.strstart !== 0 && (M |= 32), M += 31 - M % 31, w.status = N, Y(w, M), w.strstart !== 0 && (Y(w, i.adler >>> 16), Y(w, 65535 & i.adler)), i.adler = 1;
        }
        if (w.status === 69) if (w.gzhead.extra) {
          for (g = w.pending; w.gzindex < (65535 & w.gzhead.extra.length) && (w.pending !== w.pending_buf_size || (w.gzhead.hcrc && w.pending > g && (i.adler = p(i.adler, w.pending_buf, w.pending - g, g)), F(i), g = w.pending, w.pending !== w.pending_buf_size)); ) J(w, 255 & w.gzhead.extra[w.gzindex]), w.gzindex++;
          w.gzhead.hcrc && w.pending > g && (i.adler = p(i.adler, w.pending_buf, w.pending - g, g)), w.gzindex === w.gzhead.extra.length && (w.gzindex = 0, w.status = 73);
        } else w.status = 73;
        if (w.status === 73) if (w.gzhead.name) {
          g = w.pending;
          do {
            if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > g && (i.adler = p(i.adler, w.pending_buf, w.pending - g, g)), F(i), g = w.pending, w.pending === w.pending_buf_size)) {
              S = 1;
              break;
            }
            S = w.gzindex < w.gzhead.name.length ? 255 & w.gzhead.name.charCodeAt(w.gzindex++) : 0, J(w, S);
          } while (S !== 0);
          w.gzhead.hcrc && w.pending > g && (i.adler = p(i.adler, w.pending_buf, w.pending - g, g)), S === 0 && (w.gzindex = 0, w.status = 91);
        } else w.status = 91;
        if (w.status === 91) if (w.gzhead.comment) {
          g = w.pending;
          do {
            if (w.pending === w.pending_buf_size && (w.gzhead.hcrc && w.pending > g && (i.adler = p(i.adler, w.pending_buf, w.pending - g, g)), F(i), g = w.pending, w.pending === w.pending_buf_size)) {
              S = 1;
              break;
            }
            S = w.gzindex < w.gzhead.comment.length ? 255 & w.gzhead.comment.charCodeAt(w.gzindex++) : 0, J(w, S);
          } while (S !== 0);
          w.gzhead.hcrc && w.pending > g && (i.adler = p(i.adler, w.pending_buf, w.pending - g, g)), S === 0 && (w.status = 103);
        } else w.status = 103;
        if (w.status === 103 && (w.gzhead.hcrc ? (w.pending + 2 > w.pending_buf_size && F(i), w.pending + 2 <= w.pending_buf_size && (J(w, 255 & i.adler), J(w, i.adler >> 8 & 255), i.adler = 0, w.status = N)) : w.status = N), w.pending !== 0) {
          if (F(i), i.avail_out === 0) return w.last_flush = -1, h;
        } else if (i.avail_in === 0 && W(O) <= W(P) && O !== m) return rt(i, -5);
        if (w.status === 666 && i.avail_in !== 0) return rt(i, -5);
        if (i.avail_in !== 0 || w.lookahead !== 0 || O !== y && w.status !== 666) {
          var $ = w.strategy === 2 ? function(R, H) {
            for (var q; ; ) {
              if (R.lookahead === 0 && (lt(R), R.lookahead === 0)) {
                if (H === y) return l;
                break;
              }
              if (R.match_length = 0, q = s._tr_tally(R, 0, R.window[R.strstart]), R.lookahead--, R.strstart++, q && (I(R, !1), R.strm.avail_out === 0)) return l;
            }
            return R.insert = 0, H === m ? (I(R, !0), R.strm.avail_out === 0 ? et : U) : R.last_lit && (I(R, !1), R.strm.avail_out === 0) ? l : D;
          }(w, O) : w.strategy === 3 ? function(R, H) {
            for (var q, G, K, ot, st = R.window; ; ) {
              if (R.lookahead <= Z) {
                if (lt(R), R.lookahead <= Z && H === y) return l;
                if (R.lookahead === 0) break;
              }
              if (R.match_length = 0, R.lookahead >= z && 0 < R.strstart && (G = st[K = R.strstart - 1]) === st[++K] && G === st[++K] && G === st[++K]) {
                ot = R.strstart + Z;
                do
                  ;
                while (G === st[++K] && G === st[++K] && G === st[++K] && G === st[++K] && G === st[++K] && G === st[++K] && G === st[++K] && G === st[++K] && K < ot);
                R.match_length = Z - (ot - K), R.match_length > R.lookahead && (R.match_length = R.lookahead);
              }
              if (R.match_length >= z ? (q = s._tr_tally(R, 1, R.match_length - z), R.lookahead -= R.match_length, R.strstart += R.match_length, R.match_length = 0) : (q = s._tr_tally(R, 0, R.window[R.strstart]), R.lookahead--, R.strstart++), q && (I(R, !1), R.strm.avail_out === 0)) return l;
            }
            return R.insert = 0, H === m ? (I(R, !0), R.strm.avail_out === 0 ? et : U) : R.last_lit && (I(R, !1), R.strm.avail_out === 0) ? l : D;
          }(w, O) : a[w.level].func(w, O);
          if ($ !== et && $ !== U || (w.status = 666), $ === l || $ === et) return i.avail_out === 0 && (w.last_flush = -1), h;
          if ($ === D && (O === 1 ? s._tr_align(w) : O !== 5 && (s._tr_stored_block(w, 0, 0, !1), O === 3 && (tt(w.head), w.lookahead === 0 && (w.strstart = 0, w.block_start = 0, w.insert = 0))), F(i), i.avail_out === 0)) return w.last_flush = -1, h;
        }
        return O !== m ? h : w.wrap <= 0 ? 1 : (w.wrap === 2 ? (J(w, 255 & i.adler), J(w, i.adler >> 8 & 255), J(w, i.adler >> 16 & 255), J(w, i.adler >> 24 & 255), J(w, 255 & i.total_in), J(w, i.total_in >> 8 & 255), J(w, i.total_in >> 16 & 255), J(w, i.total_in >> 24 & 255)) : (Y(w, i.adler >>> 16), Y(w, 65535 & i.adler)), F(i), 0 < w.wrap && (w.wrap = -w.wrap), w.pending !== 0 ? h : 1);
      }, n.deflateEnd = function(i) {
        var O;
        return i && i.state ? (O = i.state.status) !== k && O !== 69 && O !== 73 && O !== 91 && O !== 103 && O !== N && O !== 666 ? rt(i, b) : (i.state = null, O === N ? rt(i, -3) : h) : b;
      }, n.deflateSetDictionary = function(i, O) {
        var P, w, g, S, M, $, R, H, q = O.length;
        if (!i || !i.state || (S = (P = i.state).wrap) === 2 || S === 1 && P.status !== k || P.lookahead) return b;
        for (S === 1 && (i.adler = c(i.adler, O, q, 0)), P.wrap = 0, q >= P.w_size && (S === 0 && (tt(P.head), P.strstart = 0, P.block_start = 0, P.insert = 0), H = new o.Buf8(P.w_size), o.arraySet(H, O, q - P.w_size, P.w_size, 0), O = H, q = P.w_size), M = i.avail_in, $ = i.next_in, R = i.input, i.avail_in = q, i.next_in = 0, i.input = O, lt(P); P.lookahead >= z; ) {
          for (w = P.strstart, g = P.lookahead - (z - 1); P.ins_h = (P.ins_h << P.hash_shift ^ P.window[w + z - 1]) & P.hash_mask, P.prev[w & P.w_mask] = P.head[P.ins_h], P.head[P.ins_h] = w, w++, --g; ) ;
          P.strstart = w, P.lookahead = z - 1, lt(P);
        }
        return P.strstart += P.lookahead, P.block_start = P.strstart, P.insert = P.lookahead, P.lookahead = 0, P.match_length = P.prev_length = z - 1, P.match_available = 0, i.next_in = $, i.input = R, i.avail_in = M, P.wrap = S, h;
      }, n.deflateInfo = "pako deflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(t, r, n) {
      r.exports = function() {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
      };
    }, {}], 48: [function(t, r, n) {
      r.exports = function(a, o) {
        var s, c, p, f, y, m, h, b, d, _, u, v, E, A, T, L, B, j, z, Z, Q, k, N, l, D;
        s = a.state, c = a.next_in, l = a.input, p = c + (a.avail_in - 5), f = a.next_out, D = a.output, y = f - (o - a.avail_out), m = f + (a.avail_out - 257), h = s.dmax, b = s.wsize, d = s.whave, _ = s.wnext, u = s.window, v = s.hold, E = s.bits, A = s.lencode, T = s.distcode, L = (1 << s.lenbits) - 1, B = (1 << s.distbits) - 1;
        t: do {
          E < 15 && (v += l[c++] << E, E += 8, v += l[c++] << E, E += 8), j = A[v & L];
          e: for (; ; ) {
            if (v >>>= z = j >>> 24, E -= z, (z = j >>> 16 & 255) === 0) D[f++] = 65535 & j;
            else {
              if (!(16 & z)) {
                if (!(64 & z)) {
                  j = A[(65535 & j) + (v & (1 << z) - 1)];
                  continue e;
                }
                if (32 & z) {
                  s.mode = 12;
                  break t;
                }
                a.msg = "invalid literal/length code", s.mode = 30;
                break t;
              }
              Z = 65535 & j, (z &= 15) && (E < z && (v += l[c++] << E, E += 8), Z += v & (1 << z) - 1, v >>>= z, E -= z), E < 15 && (v += l[c++] << E, E += 8, v += l[c++] << E, E += 8), j = T[v & B];
              r: for (; ; ) {
                if (v >>>= z = j >>> 24, E -= z, !(16 & (z = j >>> 16 & 255))) {
                  if (!(64 & z)) {
                    j = T[(65535 & j) + (v & (1 << z) - 1)];
                    continue r;
                  }
                  a.msg = "invalid distance code", s.mode = 30;
                  break t;
                }
                if (Q = 65535 & j, E < (z &= 15) && (v += l[c++] << E, (E += 8) < z && (v += l[c++] << E, E += 8)), h < (Q += v & (1 << z) - 1)) {
                  a.msg = "invalid distance too far back", s.mode = 30;
                  break t;
                }
                if (v >>>= z, E -= z, (z = f - y) < Q) {
                  if (d < (z = Q - z) && s.sane) {
                    a.msg = "invalid distance too far back", s.mode = 30;
                    break t;
                  }
                  if (N = u, (k = 0) === _) {
                    if (k += b - z, z < Z) {
                      for (Z -= z; D[f++] = u[k++], --z; ) ;
                      k = f - Q, N = D;
                    }
                  } else if (_ < z) {
                    if (k += b + _ - z, (z -= _) < Z) {
                      for (Z -= z; D[f++] = u[k++], --z; ) ;
                      if (k = 0, _ < Z) {
                        for (Z -= z = _; D[f++] = u[k++], --z; ) ;
                        k = f - Q, N = D;
                      }
                    }
                  } else if (k += _ - z, z < Z) {
                    for (Z -= z; D[f++] = u[k++], --z; ) ;
                    k = f - Q, N = D;
                  }
                  for (; 2 < Z; ) D[f++] = N[k++], D[f++] = N[k++], D[f++] = N[k++], Z -= 3;
                  Z && (D[f++] = N[k++], 1 < Z && (D[f++] = N[k++]));
                } else {
                  for (k = f - Q; D[f++] = D[k++], D[f++] = D[k++], D[f++] = D[k++], 2 < (Z -= 3); ) ;
                  Z && (D[f++] = D[k++], 1 < Z && (D[f++] = D[k++]));
                }
                break;
              }
            }
            break;
          }
        } while (c < p && f < m);
        c -= Z = E >> 3, v &= (1 << (E -= Z << 3)) - 1, a.next_in = c, a.next_out = f, a.avail_in = c < p ? p - c + 5 : 5 - (c - p), a.avail_out = f < m ? m - f + 257 : 257 - (f - m), s.hold = v, s.bits = E;
      };
    }, {}], 49: [function(t, r, n) {
      var a = t("../utils/common"), o = t("./adler32"), s = t("./crc32"), c = t("./inffast"), p = t("./inftrees"), f = 1, y = 2, m = 0, h = -2, b = 1, d = 852, _ = 592;
      function u(k) {
        return (k >>> 24 & 255) + (k >>> 8 & 65280) + ((65280 & k) << 8) + ((255 & k) << 24);
      }
      function v() {
        this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new a.Buf16(320), this.work = new a.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }
      function E(k) {
        var N;
        return k && k.state ? (N = k.state, k.total_in = k.total_out = N.total = 0, k.msg = "", N.wrap && (k.adler = 1 & N.wrap), N.mode = b, N.last = 0, N.havedict = 0, N.dmax = 32768, N.head = null, N.hold = 0, N.bits = 0, N.lencode = N.lendyn = new a.Buf32(d), N.distcode = N.distdyn = new a.Buf32(_), N.sane = 1, N.back = -1, m) : h;
      }
      function A(k) {
        var N;
        return k && k.state ? ((N = k.state).wsize = 0, N.whave = 0, N.wnext = 0, E(k)) : h;
      }
      function T(k, N) {
        var l, D;
        return k && k.state ? (D = k.state, N < 0 ? (l = 0, N = -N) : (l = 1 + (N >> 4), N < 48 && (N &= 15)), N && (N < 8 || 15 < N) ? h : (D.window !== null && D.wbits !== N && (D.window = null), D.wrap = l, D.wbits = N, A(k))) : h;
      }
      function L(k, N) {
        var l, D;
        return k ? (D = new v(), (k.state = D).window = null, (l = T(k, N)) !== m && (k.state = null), l) : h;
      }
      var B, j, z = !0;
      function Z(k) {
        if (z) {
          var N;
          for (B = new a.Buf32(512), j = new a.Buf32(32), N = 0; N < 144; ) k.lens[N++] = 8;
          for (; N < 256; ) k.lens[N++] = 9;
          for (; N < 280; ) k.lens[N++] = 7;
          for (; N < 288; ) k.lens[N++] = 8;
          for (p(f, k.lens, 0, 288, B, 0, k.work, { bits: 9 }), N = 0; N < 32; ) k.lens[N++] = 5;
          p(y, k.lens, 0, 32, j, 0, k.work, { bits: 5 }), z = !1;
        }
        k.lencode = B, k.lenbits = 9, k.distcode = j, k.distbits = 5;
      }
      function Q(k, N, l, D) {
        var et, U = k.state;
        return U.window === null && (U.wsize = 1 << U.wbits, U.wnext = 0, U.whave = 0, U.window = new a.Buf8(U.wsize)), D >= U.wsize ? (a.arraySet(U.window, N, l - U.wsize, U.wsize, 0), U.wnext = 0, U.whave = U.wsize) : (D < (et = U.wsize - U.wnext) && (et = D), a.arraySet(U.window, N, l - D, et, U.wnext), (D -= et) ? (a.arraySet(U.window, N, l - D, D, 0), U.wnext = D, U.whave = U.wsize) : (U.wnext += et, U.wnext === U.wsize && (U.wnext = 0), U.whave < U.wsize && (U.whave += et))), 0;
      }
      n.inflateReset = A, n.inflateReset2 = T, n.inflateResetKeep = E, n.inflateInit = function(k) {
        return L(k, 15);
      }, n.inflateInit2 = L, n.inflate = function(k, N) {
        var l, D, et, U, rt, W, tt, F, I, J, Y, V, lt, ut, it, at, dt, ct, bt, pt, i, O, P, w, g = 0, S = new a.Buf8(4), M = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        if (!k || !k.state || !k.output || !k.input && k.avail_in !== 0) return h;
        (l = k.state).mode === 12 && (l.mode = 13), rt = k.next_out, et = k.output, tt = k.avail_out, U = k.next_in, D = k.input, W = k.avail_in, F = l.hold, I = l.bits, J = W, Y = tt, O = m;
        t: for (; ; ) switch (l.mode) {
          case b:
            if (l.wrap === 0) {
              l.mode = 13;
              break;
            }
            for (; I < 16; ) {
              if (W === 0) break t;
              W--, F += D[U++] << I, I += 8;
            }
            if (2 & l.wrap && F === 35615) {
              S[l.check = 0] = 255 & F, S[1] = F >>> 8 & 255, l.check = s(l.check, S, 2, 0), I = F = 0, l.mode = 2;
              break;
            }
            if (l.flags = 0, l.head && (l.head.done = !1), !(1 & l.wrap) || (((255 & F) << 8) + (F >> 8)) % 31) {
              k.msg = "incorrect header check", l.mode = 30;
              break;
            }
            if ((15 & F) != 8) {
              k.msg = "unknown compression method", l.mode = 30;
              break;
            }
            if (I -= 4, i = 8 + (15 & (F >>>= 4)), l.wbits === 0) l.wbits = i;
            else if (i > l.wbits) {
              k.msg = "invalid window size", l.mode = 30;
              break;
            }
            l.dmax = 1 << i, k.adler = l.check = 1, l.mode = 512 & F ? 10 : 12, I = F = 0;
            break;
          case 2:
            for (; I < 16; ) {
              if (W === 0) break t;
              W--, F += D[U++] << I, I += 8;
            }
            if (l.flags = F, (255 & l.flags) != 8) {
              k.msg = "unknown compression method", l.mode = 30;
              break;
            }
            if (57344 & l.flags) {
              k.msg = "unknown header flags set", l.mode = 30;
              break;
            }
            l.head && (l.head.text = F >> 8 & 1), 512 & l.flags && (S[0] = 255 & F, S[1] = F >>> 8 & 255, l.check = s(l.check, S, 2, 0)), I = F = 0, l.mode = 3;
          case 3:
            for (; I < 32; ) {
              if (W === 0) break t;
              W--, F += D[U++] << I, I += 8;
            }
            l.head && (l.head.time = F), 512 & l.flags && (S[0] = 255 & F, S[1] = F >>> 8 & 255, S[2] = F >>> 16 & 255, S[3] = F >>> 24 & 255, l.check = s(l.check, S, 4, 0)), I = F = 0, l.mode = 4;
          case 4:
            for (; I < 16; ) {
              if (W === 0) break t;
              W--, F += D[U++] << I, I += 8;
            }
            l.head && (l.head.xflags = 255 & F, l.head.os = F >> 8), 512 & l.flags && (S[0] = 255 & F, S[1] = F >>> 8 & 255, l.check = s(l.check, S, 2, 0)), I = F = 0, l.mode = 5;
          case 5:
            if (1024 & l.flags) {
              for (; I < 16; ) {
                if (W === 0) break t;
                W--, F += D[U++] << I, I += 8;
              }
              l.length = F, l.head && (l.head.extra_len = F), 512 & l.flags && (S[0] = 255 & F, S[1] = F >>> 8 & 255, l.check = s(l.check, S, 2, 0)), I = F = 0;
            } else l.head && (l.head.extra = null);
            l.mode = 6;
          case 6:
            if (1024 & l.flags && (W < (V = l.length) && (V = W), V && (l.head && (i = l.head.extra_len - l.length, l.head.extra || (l.head.extra = new Array(l.head.extra_len)), a.arraySet(l.head.extra, D, U, V, i)), 512 & l.flags && (l.check = s(l.check, D, V, U)), W -= V, U += V, l.length -= V), l.length)) break t;
            l.length = 0, l.mode = 7;
          case 7:
            if (2048 & l.flags) {
              if (W === 0) break t;
              for (V = 0; i = D[U + V++], l.head && i && l.length < 65536 && (l.head.name += String.fromCharCode(i)), i && V < W; ) ;
              if (512 & l.flags && (l.check = s(l.check, D, V, U)), W -= V, U += V, i) break t;
            } else l.head && (l.head.name = null);
            l.length = 0, l.mode = 8;
          case 8:
            if (4096 & l.flags) {
              if (W === 0) break t;
              for (V = 0; i = D[U + V++], l.head && i && l.length < 65536 && (l.head.comment += String.fromCharCode(i)), i && V < W; ) ;
              if (512 & l.flags && (l.check = s(l.check, D, V, U)), W -= V, U += V, i) break t;
            } else l.head && (l.head.comment = null);
            l.mode = 9;
          case 9:
            if (512 & l.flags) {
              for (; I < 16; ) {
                if (W === 0) break t;
                W--, F += D[U++] << I, I += 8;
              }
              if (F !== (65535 & l.check)) {
                k.msg = "header crc mismatch", l.mode = 30;
                break;
              }
              I = F = 0;
            }
            l.head && (l.head.hcrc = l.flags >> 9 & 1, l.head.done = !0), k.adler = l.check = 0, l.mode = 12;
            break;
          case 10:
            for (; I < 32; ) {
              if (W === 0) break t;
              W--, F += D[U++] << I, I += 8;
            }
            k.adler = l.check = u(F), I = F = 0, l.mode = 11;
          case 11:
            if (l.havedict === 0) return k.next_out = rt, k.avail_out = tt, k.next_in = U, k.avail_in = W, l.hold = F, l.bits = I, 2;
            k.adler = l.check = 1, l.mode = 12;
          case 12:
            if (N === 5 || N === 6) break t;
          case 13:
            if (l.last) {
              F >>>= 7 & I, I -= 7 & I, l.mode = 27;
              break;
            }
            for (; I < 3; ) {
              if (W === 0) break t;
              W--, F += D[U++] << I, I += 8;
            }
            switch (l.last = 1 & F, I -= 1, 3 & (F >>>= 1)) {
              case 0:
                l.mode = 14;
                break;
              case 1:
                if (Z(l), l.mode = 20, N !== 6) break;
                F >>>= 2, I -= 2;
                break t;
              case 2:
                l.mode = 17;
                break;
              case 3:
                k.msg = "invalid block type", l.mode = 30;
            }
            F >>>= 2, I -= 2;
            break;
          case 14:
            for (F >>>= 7 & I, I -= 7 & I; I < 32; ) {
              if (W === 0) break t;
              W--, F += D[U++] << I, I += 8;
            }
            if ((65535 & F) != (F >>> 16 ^ 65535)) {
              k.msg = "invalid stored block lengths", l.mode = 30;
              break;
            }
            if (l.length = 65535 & F, I = F = 0, l.mode = 15, N === 6) break t;
          case 15:
            l.mode = 16;
          case 16:
            if (V = l.length) {
              if (W < V && (V = W), tt < V && (V = tt), V === 0) break t;
              a.arraySet(et, D, U, V, rt), W -= V, U += V, tt -= V, rt += V, l.length -= V;
              break;
            }
            l.mode = 12;
            break;
          case 17:
            for (; I < 14; ) {
              if (W === 0) break t;
              W--, F += D[U++] << I, I += 8;
            }
            if (l.nlen = 257 + (31 & F), F >>>= 5, I -= 5, l.ndist = 1 + (31 & F), F >>>= 5, I -= 5, l.ncode = 4 + (15 & F), F >>>= 4, I -= 4, 286 < l.nlen || 30 < l.ndist) {
              k.msg = "too many length or distance symbols", l.mode = 30;
              break;
            }
            l.have = 0, l.mode = 18;
          case 18:
            for (; l.have < l.ncode; ) {
              for (; I < 3; ) {
                if (W === 0) break t;
                W--, F += D[U++] << I, I += 8;
              }
              l.lens[M[l.have++]] = 7 & F, F >>>= 3, I -= 3;
            }
            for (; l.have < 19; ) l.lens[M[l.have++]] = 0;
            if (l.lencode = l.lendyn, l.lenbits = 7, P = { bits: l.lenbits }, O = p(0, l.lens, 0, 19, l.lencode, 0, l.work, P), l.lenbits = P.bits, O) {
              k.msg = "invalid code lengths set", l.mode = 30;
              break;
            }
            l.have = 0, l.mode = 19;
          case 19:
            for (; l.have < l.nlen + l.ndist; ) {
              for (; at = (g = l.lencode[F & (1 << l.lenbits) - 1]) >>> 16 & 255, dt = 65535 & g, !((it = g >>> 24) <= I); ) {
                if (W === 0) break t;
                W--, F += D[U++] << I, I += 8;
              }
              if (dt < 16) F >>>= it, I -= it, l.lens[l.have++] = dt;
              else {
                if (dt === 16) {
                  for (w = it + 2; I < w; ) {
                    if (W === 0) break t;
                    W--, F += D[U++] << I, I += 8;
                  }
                  if (F >>>= it, I -= it, l.have === 0) {
                    k.msg = "invalid bit length repeat", l.mode = 30;
                    break;
                  }
                  i = l.lens[l.have - 1], V = 3 + (3 & F), F >>>= 2, I -= 2;
                } else if (dt === 17) {
                  for (w = it + 3; I < w; ) {
                    if (W === 0) break t;
                    W--, F += D[U++] << I, I += 8;
                  }
                  I -= it, i = 0, V = 3 + (7 & (F >>>= it)), F >>>= 3, I -= 3;
                } else {
                  for (w = it + 7; I < w; ) {
                    if (W === 0) break t;
                    W--, F += D[U++] << I, I += 8;
                  }
                  I -= it, i = 0, V = 11 + (127 & (F >>>= it)), F >>>= 7, I -= 7;
                }
                if (l.have + V > l.nlen + l.ndist) {
                  k.msg = "invalid bit length repeat", l.mode = 30;
                  break;
                }
                for (; V--; ) l.lens[l.have++] = i;
              }
            }
            if (l.mode === 30) break;
            if (l.lens[256] === 0) {
              k.msg = "invalid code -- missing end-of-block", l.mode = 30;
              break;
            }
            if (l.lenbits = 9, P = { bits: l.lenbits }, O = p(f, l.lens, 0, l.nlen, l.lencode, 0, l.work, P), l.lenbits = P.bits, O) {
              k.msg = "invalid literal/lengths set", l.mode = 30;
              break;
            }
            if (l.distbits = 6, l.distcode = l.distdyn, P = { bits: l.distbits }, O = p(y, l.lens, l.nlen, l.ndist, l.distcode, 0, l.work, P), l.distbits = P.bits, O) {
              k.msg = "invalid distances set", l.mode = 30;
              break;
            }
            if (l.mode = 20, N === 6) break t;
          case 20:
            l.mode = 21;
          case 21:
            if (6 <= W && 258 <= tt) {
              k.next_out = rt, k.avail_out = tt, k.next_in = U, k.avail_in = W, l.hold = F, l.bits = I, c(k, Y), rt = k.next_out, et = k.output, tt = k.avail_out, U = k.next_in, D = k.input, W = k.avail_in, F = l.hold, I = l.bits, l.mode === 12 && (l.back = -1);
              break;
            }
            for (l.back = 0; at = (g = l.lencode[F & (1 << l.lenbits) - 1]) >>> 16 & 255, dt = 65535 & g, !((it = g >>> 24) <= I); ) {
              if (W === 0) break t;
              W--, F += D[U++] << I, I += 8;
            }
            if (at && !(240 & at)) {
              for (ct = it, bt = at, pt = dt; at = (g = l.lencode[pt + ((F & (1 << ct + bt) - 1) >> ct)]) >>> 16 & 255, dt = 65535 & g, !(ct + (it = g >>> 24) <= I); ) {
                if (W === 0) break t;
                W--, F += D[U++] << I, I += 8;
              }
              F >>>= ct, I -= ct, l.back += ct;
            }
            if (F >>>= it, I -= it, l.back += it, l.length = dt, at === 0) {
              l.mode = 26;
              break;
            }
            if (32 & at) {
              l.back = -1, l.mode = 12;
              break;
            }
            if (64 & at) {
              k.msg = "invalid literal/length code", l.mode = 30;
              break;
            }
            l.extra = 15 & at, l.mode = 22;
          case 22:
            if (l.extra) {
              for (w = l.extra; I < w; ) {
                if (W === 0) break t;
                W--, F += D[U++] << I, I += 8;
              }
              l.length += F & (1 << l.extra) - 1, F >>>= l.extra, I -= l.extra, l.back += l.extra;
            }
            l.was = l.length, l.mode = 23;
          case 23:
            for (; at = (g = l.distcode[F & (1 << l.distbits) - 1]) >>> 16 & 255, dt = 65535 & g, !((it = g >>> 24) <= I); ) {
              if (W === 0) break t;
              W--, F += D[U++] << I, I += 8;
            }
            if (!(240 & at)) {
              for (ct = it, bt = at, pt = dt; at = (g = l.distcode[pt + ((F & (1 << ct + bt) - 1) >> ct)]) >>> 16 & 255, dt = 65535 & g, !(ct + (it = g >>> 24) <= I); ) {
                if (W === 0) break t;
                W--, F += D[U++] << I, I += 8;
              }
              F >>>= ct, I -= ct, l.back += ct;
            }
            if (F >>>= it, I -= it, l.back += it, 64 & at) {
              k.msg = "invalid distance code", l.mode = 30;
              break;
            }
            l.offset = dt, l.extra = 15 & at, l.mode = 24;
          case 24:
            if (l.extra) {
              for (w = l.extra; I < w; ) {
                if (W === 0) break t;
                W--, F += D[U++] << I, I += 8;
              }
              l.offset += F & (1 << l.extra) - 1, F >>>= l.extra, I -= l.extra, l.back += l.extra;
            }
            if (l.offset > l.dmax) {
              k.msg = "invalid distance too far back", l.mode = 30;
              break;
            }
            l.mode = 25;
          case 25:
            if (tt === 0) break t;
            if (V = Y - tt, l.offset > V) {
              if ((V = l.offset - V) > l.whave && l.sane) {
                k.msg = "invalid distance too far back", l.mode = 30;
                break;
              }
              lt = V > l.wnext ? (V -= l.wnext, l.wsize - V) : l.wnext - V, V > l.length && (V = l.length), ut = l.window;
            } else ut = et, lt = rt - l.offset, V = l.length;
            for (tt < V && (V = tt), tt -= V, l.length -= V; et[rt++] = ut[lt++], --V; ) ;
            l.length === 0 && (l.mode = 21);
            break;
          case 26:
            if (tt === 0) break t;
            et[rt++] = l.length, tt--, l.mode = 21;
            break;
          case 27:
            if (l.wrap) {
              for (; I < 32; ) {
                if (W === 0) break t;
                W--, F |= D[U++] << I, I += 8;
              }
              if (Y -= tt, k.total_out += Y, l.total += Y, Y && (k.adler = l.check = l.flags ? s(l.check, et, Y, rt - Y) : o(l.check, et, Y, rt - Y)), Y = tt, (l.flags ? F : u(F)) !== l.check) {
                k.msg = "incorrect data check", l.mode = 30;
                break;
              }
              I = F = 0;
            }
            l.mode = 28;
          case 28:
            if (l.wrap && l.flags) {
              for (; I < 32; ) {
                if (W === 0) break t;
                W--, F += D[U++] << I, I += 8;
              }
              if (F !== (4294967295 & l.total)) {
                k.msg = "incorrect length check", l.mode = 30;
                break;
              }
              I = F = 0;
            }
            l.mode = 29;
          case 29:
            O = 1;
            break t;
          case 30:
            O = -3;
            break t;
          case 31:
            return -4;
          case 32:
          default:
            return h;
        }
        return k.next_out = rt, k.avail_out = tt, k.next_in = U, k.avail_in = W, l.hold = F, l.bits = I, (l.wsize || Y !== k.avail_out && l.mode < 30 && (l.mode < 27 || N !== 4)) && Q(k, k.output, k.next_out, Y - k.avail_out) ? (l.mode = 31, -4) : (J -= k.avail_in, Y -= k.avail_out, k.total_in += J, k.total_out += Y, l.total += Y, l.wrap && Y && (k.adler = l.check = l.flags ? s(l.check, et, Y, k.next_out - Y) : o(l.check, et, Y, k.next_out - Y)), k.data_type = l.bits + (l.last ? 64 : 0) + (l.mode === 12 ? 128 : 0) + (l.mode === 20 || l.mode === 15 ? 256 : 0), (J == 0 && Y === 0 || N === 4) && O === m && (O = -5), O);
      }, n.inflateEnd = function(k) {
        if (!k || !k.state) return h;
        var N = k.state;
        return N.window && (N.window = null), k.state = null, m;
      }, n.inflateGetHeader = function(k, N) {
        var l;
        return k && k.state && 2 & (l = k.state).wrap ? ((l.head = N).done = !1, m) : h;
      }, n.inflateSetDictionary = function(k, N) {
        var l, D = N.length;
        return k && k.state ? (l = k.state).wrap !== 0 && l.mode !== 11 ? h : l.mode === 11 && o(1, N, D, 0) !== l.check ? -3 : Q(k, N, D, D) ? (l.mode = 31, -4) : (l.havedict = 1, m) : h;
      }, n.inflateInfo = "pako inflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(t, r, n) {
      var a = t("../utils/common"), o = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], s = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], c = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], p = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
      r.exports = function(f, y, m, h, b, d, _, u) {
        var v, E, A, T, L, B, j, z, Z, Q = u.bits, k = 0, N = 0, l = 0, D = 0, et = 0, U = 0, rt = 0, W = 0, tt = 0, F = 0, I = null, J = 0, Y = new a.Buf16(16), V = new a.Buf16(16), lt = null, ut = 0;
        for (k = 0; k <= 15; k++) Y[k] = 0;
        for (N = 0; N < h; N++) Y[y[m + N]]++;
        for (et = Q, D = 15; 1 <= D && Y[D] === 0; D--) ;
        if (D < et && (et = D), D === 0) return b[d++] = 20971520, b[d++] = 20971520, u.bits = 1, 0;
        for (l = 1; l < D && Y[l] === 0; l++) ;
        for (et < l && (et = l), k = W = 1; k <= 15; k++) if (W <<= 1, (W -= Y[k]) < 0) return -1;
        if (0 < W && (f === 0 || D !== 1)) return -1;
        for (V[1] = 0, k = 1; k < 15; k++) V[k + 1] = V[k] + Y[k];
        for (N = 0; N < h; N++) y[m + N] !== 0 && (_[V[y[m + N]]++] = N);
        if (B = f === 0 ? (I = lt = _, 19) : f === 1 ? (I = o, J -= 257, lt = s, ut -= 257, 256) : (I = c, lt = p, -1), k = l, L = d, rt = N = F = 0, A = -1, T = (tt = 1 << (U = et)) - 1, f === 1 && 852 < tt || f === 2 && 592 < tt) return 1;
        for (; ; ) {
          for (j = k - rt, Z = _[N] < B ? (z = 0, _[N]) : _[N] > B ? (z = lt[ut + _[N]], I[J + _[N]]) : (z = 96, 0), v = 1 << k - rt, l = E = 1 << U; b[L + (F >> rt) + (E -= v)] = j << 24 | z << 16 | Z | 0, E !== 0; ) ;
          for (v = 1 << k - 1; F & v; ) v >>= 1;
          if (v !== 0 ? (F &= v - 1, F += v) : F = 0, N++, --Y[k] == 0) {
            if (k === D) break;
            k = y[m + _[N]];
          }
          if (et < k && (F & T) !== A) {
            for (rt === 0 && (rt = et), L += l, W = 1 << (U = k - rt); U + rt < D && !((W -= Y[U + rt]) <= 0); ) U++, W <<= 1;
            if (tt += 1 << U, f === 1 && 852 < tt || f === 2 && 592 < tt) return 1;
            b[A = F & T] = et << 24 | U << 16 | L - d | 0;
          }
        }
        return F !== 0 && (b[L + F] = k - rt << 24 | 64 << 16 | 0), u.bits = et, 0;
      };
    }, { "../utils/common": 41 }], 51: [function(t, r, n) {
      r.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, {}], 52: [function(t, r, n) {
      var a = t("../utils/common"), o = 0, s = 1;
      function c(g) {
        for (var S = g.length; 0 <= --S; ) g[S] = 0;
      }
      var p = 0, f = 29, y = 256, m = y + 1 + f, h = 30, b = 19, d = 2 * m + 1, _ = 15, u = 16, v = 7, E = 256, A = 16, T = 17, L = 18, B = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], j = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], Z = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], Q = new Array(2 * (m + 2));
      c(Q);
      var k = new Array(2 * h);
      c(k);
      var N = new Array(512);
      c(N);
      var l = new Array(256);
      c(l);
      var D = new Array(f);
      c(D);
      var et, U, rt, W = new Array(h);
      function tt(g, S, M, $, R) {
        this.static_tree = g, this.extra_bits = S, this.extra_base = M, this.elems = $, this.max_length = R, this.has_stree = g && g.length;
      }
      function F(g, S) {
        this.dyn_tree = g, this.max_code = 0, this.stat_desc = S;
      }
      function I(g) {
        return g < 256 ? N[g] : N[256 + (g >>> 7)];
      }
      function J(g, S) {
        g.pending_buf[g.pending++] = 255 & S, g.pending_buf[g.pending++] = S >>> 8 & 255;
      }
      function Y(g, S, M) {
        g.bi_valid > u - M ? (g.bi_buf |= S << g.bi_valid & 65535, J(g, g.bi_buf), g.bi_buf = S >> u - g.bi_valid, g.bi_valid += M - u) : (g.bi_buf |= S << g.bi_valid & 65535, g.bi_valid += M);
      }
      function V(g, S, M) {
        Y(g, M[2 * S], M[2 * S + 1]);
      }
      function lt(g, S) {
        for (var M = 0; M |= 1 & g, g >>>= 1, M <<= 1, 0 < --S; ) ;
        return M >>> 1;
      }
      function ut(g, S, M) {
        var $, R, H = new Array(_ + 1), q = 0;
        for ($ = 1; $ <= _; $++) H[$] = q = q + M[$ - 1] << 1;
        for (R = 0; R <= S; R++) {
          var G = g[2 * R + 1];
          G !== 0 && (g[2 * R] = lt(H[G]++, G));
        }
      }
      function it(g) {
        var S;
        for (S = 0; S < m; S++) g.dyn_ltree[2 * S] = 0;
        for (S = 0; S < h; S++) g.dyn_dtree[2 * S] = 0;
        for (S = 0; S < b; S++) g.bl_tree[2 * S] = 0;
        g.dyn_ltree[2 * E] = 1, g.opt_len = g.static_len = 0, g.last_lit = g.matches = 0;
      }
      function at(g) {
        8 < g.bi_valid ? J(g, g.bi_buf) : 0 < g.bi_valid && (g.pending_buf[g.pending++] = g.bi_buf), g.bi_buf = 0, g.bi_valid = 0;
      }
      function dt(g, S, M, $) {
        var R = 2 * S, H = 2 * M;
        return g[R] < g[H] || g[R] === g[H] && $[S] <= $[M];
      }
      function ct(g, S, M) {
        for (var $ = g.heap[M], R = M << 1; R <= g.heap_len && (R < g.heap_len && dt(S, g.heap[R + 1], g.heap[R], g.depth) && R++, !dt(S, $, g.heap[R], g.depth)); ) g.heap[M] = g.heap[R], M = R, R <<= 1;
        g.heap[M] = $;
      }
      function bt(g, S, M) {
        var $, R, H, q, G = 0;
        if (g.last_lit !== 0) for (; $ = g.pending_buf[g.d_buf + 2 * G] << 8 | g.pending_buf[g.d_buf + 2 * G + 1], R = g.pending_buf[g.l_buf + G], G++, $ === 0 ? V(g, R, S) : (V(g, (H = l[R]) + y + 1, S), (q = B[H]) !== 0 && Y(g, R -= D[H], q), V(g, H = I(--$), M), (q = j[H]) !== 0 && Y(g, $ -= W[H], q)), G < g.last_lit; ) ;
        V(g, E, S);
      }
      function pt(g, S) {
        var M, $, R, H = S.dyn_tree, q = S.stat_desc.static_tree, G = S.stat_desc.has_stree, K = S.stat_desc.elems, ot = -1;
        for (g.heap_len = 0, g.heap_max = d, M = 0; M < K; M++) H[2 * M] !== 0 ? (g.heap[++g.heap_len] = ot = M, g.depth[M] = 0) : H[2 * M + 1] = 0;
        for (; g.heap_len < 2; ) H[2 * (R = g.heap[++g.heap_len] = ot < 2 ? ++ot : 0)] = 1, g.depth[R] = 0, g.opt_len--, G && (g.static_len -= q[2 * R + 1]);
        for (S.max_code = ot, M = g.heap_len >> 1; 1 <= M; M--) ct(g, H, M);
        for (R = K; M = g.heap[1], g.heap[1] = g.heap[g.heap_len--], ct(g, H, 1), $ = g.heap[1], g.heap[--g.heap_max] = M, g.heap[--g.heap_max] = $, H[2 * R] = H[2 * M] + H[2 * $], g.depth[R] = (g.depth[M] >= g.depth[$] ? g.depth[M] : g.depth[$]) + 1, H[2 * M + 1] = H[2 * $ + 1] = R, g.heap[1] = R++, ct(g, H, 1), 2 <= g.heap_len; ) ;
        g.heap[--g.heap_max] = g.heap[1], function(st, ft) {
          var vt, yt, kt, ht, Ct, It, _t = ft.dyn_tree, Bt = ft.max_code, jt = ft.stat_desc.static_tree, Wt = ft.stat_desc.has_stree, Ht = ft.stat_desc.extra_bits, Nt = ft.stat_desc.extra_base, xt = ft.stat_desc.max_length, Et = 0;
          for (ht = 0; ht <= _; ht++) st.bl_count[ht] = 0;
          for (_t[2 * st.heap[st.heap_max] + 1] = 0, vt = st.heap_max + 1; vt < d; vt++) xt < (ht = _t[2 * _t[2 * (yt = st.heap[vt]) + 1] + 1] + 1) && (ht = xt, Et++), _t[2 * yt + 1] = ht, Bt < yt || (st.bl_count[ht]++, Ct = 0, Nt <= yt && (Ct = Ht[yt - Nt]), It = _t[2 * yt], st.opt_len += It * (ht + Ct), Wt && (st.static_len += It * (jt[2 * yt + 1] + Ct)));
          if (Et !== 0) {
            do {
              for (ht = xt - 1; st.bl_count[ht] === 0; ) ht--;
              st.bl_count[ht]--, st.bl_count[ht + 1] += 2, st.bl_count[xt]--, Et -= 2;
            } while (0 < Et);
            for (ht = xt; ht !== 0; ht--) for (yt = st.bl_count[ht]; yt !== 0; ) Bt < (kt = st.heap[--vt]) || (_t[2 * kt + 1] !== ht && (st.opt_len += (ht - _t[2 * kt + 1]) * _t[2 * kt], _t[2 * kt + 1] = ht), yt--);
          }
        }(g, S), ut(H, ot, g.bl_count);
      }
      function i(g, S, M) {
        var $, R, H = -1, q = S[1], G = 0, K = 7, ot = 4;
        for (q === 0 && (K = 138, ot = 3), S[2 * (M + 1) + 1] = 65535, $ = 0; $ <= M; $++) R = q, q = S[2 * ($ + 1) + 1], ++G < K && R === q || (G < ot ? g.bl_tree[2 * R] += G : R !== 0 ? (R !== H && g.bl_tree[2 * R]++, g.bl_tree[2 * A]++) : G <= 10 ? g.bl_tree[2 * T]++ : g.bl_tree[2 * L]++, H = R, ot = (G = 0) === q ? (K = 138, 3) : R === q ? (K = 6, 3) : (K = 7, 4));
      }
      function O(g, S, M) {
        var $, R, H = -1, q = S[1], G = 0, K = 7, ot = 4;
        for (q === 0 && (K = 138, ot = 3), $ = 0; $ <= M; $++) if (R = q, q = S[2 * ($ + 1) + 1], !(++G < K && R === q)) {
          if (G < ot) for (; V(g, R, g.bl_tree), --G != 0; ) ;
          else R !== 0 ? (R !== H && (V(g, R, g.bl_tree), G--), V(g, A, g.bl_tree), Y(g, G - 3, 2)) : G <= 10 ? (V(g, T, g.bl_tree), Y(g, G - 3, 3)) : (V(g, L, g.bl_tree), Y(g, G - 11, 7));
          H = R, ot = (G = 0) === q ? (K = 138, 3) : R === q ? (K = 6, 3) : (K = 7, 4);
        }
      }
      c(W);
      var P = !1;
      function w(g, S, M, $) {
        Y(g, (p << 1) + ($ ? 1 : 0), 3), function(R, H, q, G) {
          at(R), J(R, q), J(R, ~q), a.arraySet(R.pending_buf, R.window, H, q, R.pending), R.pending += q;
        }(g, S, M);
      }
      n._tr_init = function(g) {
        P || (function() {
          var S, M, $, R, H, q = new Array(_ + 1);
          for (R = $ = 0; R < f - 1; R++) for (D[R] = $, S = 0; S < 1 << B[R]; S++) l[$++] = R;
          for (l[$ - 1] = R, R = H = 0; R < 16; R++) for (W[R] = H, S = 0; S < 1 << j[R]; S++) N[H++] = R;
          for (H >>= 7; R < h; R++) for (W[R] = H << 7, S = 0; S < 1 << j[R] - 7; S++) N[256 + H++] = R;
          for (M = 0; M <= _; M++) q[M] = 0;
          for (S = 0; S <= 143; ) Q[2 * S + 1] = 8, S++, q[8]++;
          for (; S <= 255; ) Q[2 * S + 1] = 9, S++, q[9]++;
          for (; S <= 279; ) Q[2 * S + 1] = 7, S++, q[7]++;
          for (; S <= 287; ) Q[2 * S + 1] = 8, S++, q[8]++;
          for (ut(Q, m + 1, q), S = 0; S < h; S++) k[2 * S + 1] = 5, k[2 * S] = lt(S, 5);
          et = new tt(Q, B, y + 1, m, _), U = new tt(k, j, 0, h, _), rt = new tt(new Array(0), z, 0, b, v);
        }(), P = !0), g.l_desc = new F(g.dyn_ltree, et), g.d_desc = new F(g.dyn_dtree, U), g.bl_desc = new F(g.bl_tree, rt), g.bi_buf = 0, g.bi_valid = 0, it(g);
      }, n._tr_stored_block = w, n._tr_flush_block = function(g, S, M, $) {
        var R, H, q = 0;
        0 < g.level ? (g.strm.data_type === 2 && (g.strm.data_type = function(G) {
          var K, ot = 4093624447;
          for (K = 0; K <= 31; K++, ot >>>= 1) if (1 & ot && G.dyn_ltree[2 * K] !== 0) return o;
          if (G.dyn_ltree[18] !== 0 || G.dyn_ltree[20] !== 0 || G.dyn_ltree[26] !== 0) return s;
          for (K = 32; K < y; K++) if (G.dyn_ltree[2 * K] !== 0) return s;
          return o;
        }(g)), pt(g, g.l_desc), pt(g, g.d_desc), q = function(G) {
          var K;
          for (i(G, G.dyn_ltree, G.l_desc.max_code), i(G, G.dyn_dtree, G.d_desc.max_code), pt(G, G.bl_desc), K = b - 1; 3 <= K && G.bl_tree[2 * Z[K] + 1] === 0; K--) ;
          return G.opt_len += 3 * (K + 1) + 5 + 5 + 4, K;
        }(g), R = g.opt_len + 3 + 7 >>> 3, (H = g.static_len + 3 + 7 >>> 3) <= R && (R = H)) : R = H = M + 5, M + 4 <= R && S !== -1 ? w(g, S, M, $) : g.strategy === 4 || H === R ? (Y(g, 2 + ($ ? 1 : 0), 3), bt(g, Q, k)) : (Y(g, 4 + ($ ? 1 : 0), 3), function(G, K, ot, st) {
          var ft;
          for (Y(G, K - 257, 5), Y(G, ot - 1, 5), Y(G, st - 4, 4), ft = 0; ft < st; ft++) Y(G, G.bl_tree[2 * Z[ft] + 1], 3);
          O(G, G.dyn_ltree, K - 1), O(G, G.dyn_dtree, ot - 1);
        }(g, g.l_desc.max_code + 1, g.d_desc.max_code + 1, q + 1), bt(g, g.dyn_ltree, g.dyn_dtree)), it(g), $ && at(g);
      }, n._tr_tally = function(g, S, M) {
        return g.pending_buf[g.d_buf + 2 * g.last_lit] = S >>> 8 & 255, g.pending_buf[g.d_buf + 2 * g.last_lit + 1] = 255 & S, g.pending_buf[g.l_buf + g.last_lit] = 255 & M, g.last_lit++, S === 0 ? g.dyn_ltree[2 * M]++ : (g.matches++, S--, g.dyn_ltree[2 * (l[M] + y + 1)]++, g.dyn_dtree[2 * I(S)]++), g.last_lit === g.lit_bufsize - 1;
      }, n._tr_align = function(g) {
        Y(g, 2, 3), V(g, E, Q), function(S) {
          S.bi_valid === 16 ? (J(S, S.bi_buf), S.bi_buf = 0, S.bi_valid = 0) : 8 <= S.bi_valid && (S.pending_buf[S.pending++] = 255 & S.bi_buf, S.bi_buf >>= 8, S.bi_valid -= 8);
        }(g);
      };
    }, { "../utils/common": 41 }], 53: [function(t, r, n) {
      r.exports = function() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      };
    }, {}], 54: [function(t, r, n) {
      (function(a) {
        (function(o, s) {
          if (!o.setImmediate) {
            var c, p, f, y, m = 1, h = {}, b = !1, d = o.document, _ = Object.getPrototypeOf && Object.getPrototypeOf(o);
            _ = _ && _.setTimeout ? _ : o, c = {}.toString.call(o.process) === "[object process]" ? function(A) {
              process.nextTick(function() {
                v(A);
              });
            } : function() {
              if (o.postMessage && !o.importScripts) {
                var A = !0, T = o.onmessage;
                return o.onmessage = function() {
                  A = !1;
                }, o.postMessage("", "*"), o.onmessage = T, A;
              }
            }() ? (y = "setImmediate$" + Math.random() + "$", o.addEventListener ? o.addEventListener("message", E, !1) : o.attachEvent("onmessage", E), function(A) {
              o.postMessage(y + A, "*");
            }) : o.MessageChannel ? ((f = new MessageChannel()).port1.onmessage = function(A) {
              v(A.data);
            }, function(A) {
              f.port2.postMessage(A);
            }) : d && "onreadystatechange" in d.createElement("script") ? (p = d.documentElement, function(A) {
              var T = d.createElement("script");
              T.onreadystatechange = function() {
                v(A), T.onreadystatechange = null, p.removeChild(T), T = null;
              }, p.appendChild(T);
            }) : function(A) {
              setTimeout(v, 0, A);
            }, _.setImmediate = function(A) {
              typeof A != "function" && (A = new Function("" + A));
              for (var T = new Array(arguments.length - 1), L = 0; L < T.length; L++) T[L] = arguments[L + 1];
              var B = { callback: A, args: T };
              return h[m] = B, c(m), m++;
            }, _.clearImmediate = u;
          }
          function u(A) {
            delete h[A];
          }
          function v(A) {
            if (b) setTimeout(v, 0, A);
            else {
              var T = h[A];
              if (T) {
                b = !0;
                try {
                  (function(L) {
                    var B = L.callback, j = L.args;
                    switch (j.length) {
                      case 0:
                        B();
                        break;
                      case 1:
                        B(j[0]);
                        break;
                      case 2:
                        B(j[0], j[1]);
                        break;
                      case 3:
                        B(j[0], j[1], j[2]);
                        break;
                      default:
                        B.apply(s, j);
                    }
                  })(T);
                } finally {
                  u(A), b = !1;
                }
              }
            }
          }
          function E(A) {
            A.source === o && typeof A.data == "string" && A.data.indexOf(y) === 0 && v(+A.data.slice(y.length));
          }
        })(typeof self > "u" ? a === void 0 ? this : a : self);
      }).call(this, typeof St < "u" ? St : typeof self < "u" ? self : typeof window < "u" ? window : {});
    }, {}] }, {}, [10])(10);
  });
})(Mt);
var Xt = Mt.exports;
const Yt = /* @__PURE__ */ Vt(Xt);
var X = /* @__PURE__ */ ((x) => (x.Document = "document", x.Paragraph = "paragraph", x.Run = "run", x.Text = "text", x.Break = "break", x.Table = "table", x.TableRow = "tableRow", x.TableCell = "tableCell", x.Hyperlink = "hyperlink", x.Drawing = "drawing", x.Image = "image", x.BookmarkStart = "bookmarkStart", x.BookmarkEnd = "bookmarkEnd", x.Comment = "comment", x.CommentRangeStart = "commentRangeStart", x.CommentRangeEnd = "commentRangeEnd", x.CommentReference = "commentReference", x.Section = "section", x.Header = "header", x.Footer = "footer", x.Tab = "tab", x.Symbol = "symbol", x.SimpleField = "simpleField", x.ComplexField = "complexField", x.FieldInstruction = "fieldInstruction", x.Footnote = "footnote", x.Endnote = "endnote", x.FootnoteReference = "footnoteReference", x.EndnoteReference = "endnoteReference", x))(X || {});
const qt = {
  W: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
  W14: "http://schemas.microsoft.com/office/word/2010/wordml",
  W15: "http://schemas.microsoft.com/office/word/2012/wordml",
  R: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
  A: "http://schemas.openxmlformats.org/drawingml/2006/main",
  WP: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
  PIC: "http://schemas.openxmlformats.org/drawingml/2006/picture"
}, mt = {
  DOCUMENT: "word/document.xml",
  COMMENTS: "word/comments.xml",
  COMMENTS_EXTENDED: "word/commentsExtended.xml",
  STYLES: "word/styles.xml",
  NUMBERING: "word/numbering.xml",
  THEME: "word/theme/theme1.xml",
  FOOTNOTES: "word/footnotes.xml",
  ENDNOTES: "word/endnotes.xml",
  FONT_TABLE: "word/fontTable.xml",
  FONT_TABLE_RELS: "word/_rels/fontTable.xml.rels",
  RELS: "word/_rels/document.xml.rels",
  CONTENT_TYPES: "[Content_Types].xml",
  HEADER_PREFIX: "word/header",
  FOOTER_PREFIX: "word/footer"
}, At = {
  IMAGE: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
  HEADER: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header",
  FOOTER: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer",
  FONT: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/font"
};
class Kt {
  /**
   * 获取元素的所有子元素
   */
  elements(e, t) {
    const r = [];
    for (let n = 0; n < e.childNodes.length; n++) {
      const a = e.childNodes[n];
      a.nodeType === Node.ELEMENT_NODE && (!t || a.localName === t) && r.push(a);
    }
    return r;
  }
  /**
   * 获取第一个匹配的子元素
   */
  element(e, t) {
    for (let r = 0; r < e.childNodes.length; r++) {
      const n = e.childNodes[r];
      if (n.nodeType === Node.ELEMENT_NODE && n.localName === t)
        return n;
    }
    return null;
  }
  /**
   * 获取元素属性值
   */
  attr(e, t) {
    if (!e) return;
    for (const n of Object.values(qt)) {
      const a = e.getAttributeNS(n, t);
      if (a) return a;
    }
    const r = e.getAttribute(`w:${t}`);
    return r || e.getAttribute(t) || void 0;
  }
  /**
   * 获取布尔属性
   */
  boolAttr(e, t, r = !1) {
    if (!e) return r;
    const n = this.attr(e, t);
    return n === void 0 ? r : n === "1" || n === "true" || n === "on";
  }
  /**
   * 获取整数属性
   */
  intAttr(e, t) {
    if (!e) return;
    const r = this.attr(e, t);
    if (r)
      return parseInt(r, 10);
  }
  /**
   * 获取长度属性并转换单位
   */
  lengthAttr(e, t, r = wt.Dxa) {
    if (!e) return;
    const n = this.attr(e, t);
    return this.convertLength(n, r);
  }
  /**
   * 转换长度单位
   */
  convertLength(e, t = wt.Dxa) {
    return e ? /[a-z%]+$/i.test(e) ? e : `${(parseFloat(e) * t.mul).toFixed(2)}${t.unit}` : void 0;
  }
  /**
   * 获取元素的文本内容
   */
  textContent(e) {
    return e && e.textContent || "";
  }
}
const wt = {
  /** 1/20 点 (twip) */
  Dxa: { mul: 0.05, unit: "pt" },
  /** EMU (English Metric Unit) */
  Emu: { mul: 1 / 12700, unit: "pt" },
  /** 半点 */
  FontSize: { mul: 0.5, unit: "pt" },
  /** 1/8 点 */
  Border: { mul: 0.125, unit: "pt" }
};
function gt(x) {
  x.charCodeAt(0) === 65279 && (x = x.substring(1)), x = x.replace(/<\?xml[^?]*\?>/g, "");
  const t = new DOMParser().parseFromString(x, "application/xml"), r = t.getElementsByTagName("parsererror")[0];
  if (r)
    throw new Error(`XML 解析错误: ${r.textContent}`);
  return t;
}
const C = new Kt();
function Jt(x) {
  const e = {
    colorScheme: { name: "", colors: {} },
    fontScheme: { name: "", majorFont: {}, minorFont: {} }
  }, t = Pt(x, "themeElements");
  if (!t) return e;
  for (const r of Rt(t)) {
    const n = r.localName;
    n === "clrScheme" ? e.colorScheme = Qt(r) : n === "fontScheme" && (e.fontScheme = ee(r));
  }
  return e;
}
function Qt(x) {
  const e = {
    name: x.getAttribute("name") || "",
    colors: {}
  };
  for (const t of Rt(x)) {
    const r = t.localName, n = te(t);
    n && (e.colors[r] = n);
  }
  return e;
}
function te(x) {
  const e = Pt(x, "srgbClr");
  if (e) {
    const r = e.getAttribute("val");
    return r ? `#${r}` : null;
  }
  const t = Pt(x, "sysClr");
  if (t) {
    const r = t.getAttribute("lastClr");
    return r ? `#${r}` : null;
  }
  return null;
}
function ee(x) {
  const e = {
    name: x.getAttribute("name") || "",
    majorFont: {},
    minorFont: {}
  };
  for (const t of Rt(x)) {
    const r = t.localName;
    r === "majorFont" ? e.majorFont = Ot(t) : r === "minorFont" && (e.minorFont = Ot(t));
  }
  return e;
}
function Ot(x) {
  const e = {};
  for (const t of Rt(x)) {
    const r = t.localName, n = t.getAttribute("typeface");
    n && (r === "latin" ? e.latin = n : r === "ea" ? e.ea = n : r === "cs" && (e.cs = n));
  }
  return e;
}
function Pt(x, e) {
  for (let t = 0; t < x.childNodes.length; t++) {
    const r = x.childNodes[t];
    if (r.nodeType === Node.ELEMENT_NODE) {
      const n = r;
      if (n.localName === e)
        return n;
    }
  }
  return null;
}
function Rt(x) {
  const e = [];
  for (let t = 0; t < x.childNodes.length; t++) {
    const r = x.childNodes[t];
    r.nodeType === Node.ELEMENT_NODE && e.push(r);
  }
  return e;
}
const re = {
  // 标准映射
  dark1: "dk1",
  dark2: "dk2",
  light1: "lt1",
  light2: "lt2",
  accent1: "accent1",
  accent2: "accent2",
  accent3: "accent3",
  accent4: "accent4",
  accent5: "accent5",
  accent6: "accent6",
  hyperlink: "hlink",
  followedHyperlink: "folHlink",
  // 直接映射（XML 中的原始名称）
  dk1: "dk1",
  dk2: "dk2",
  lt1: "lt1",
  lt2: "lt2",
  hlink: "hlink",
  folHlink: "folHlink",
  // 文本颜色别名
  text1: "dk1",
  text2: "dk2",
  background1: "lt1",
  background2: "lt2"
};
function ne(x, e) {
  var a;
  if (!((a = x == null ? void 0 : x.colorScheme) != null && a.colors)) return;
  const t = e.themeColor, r = re[t] || t, n = x.colorScheme.colors[r];
  if (n)
    return e.themeTint !== void 0 || e.themeShade !== void 0 ? ie(n, e.themeTint, e.themeShade) : n;
}
function ie(x, e, t) {
  const r = x.replace("#", ""), n = parseInt(r.substr(0, 2), 16), a = parseInt(r.substr(2, 2), 16), o = parseInt(r.substr(4, 2), 16);
  let s = n, c = a, p = o;
  if (e !== void 0 && e > 0) {
    const f = e / 255;
    s = Math.round(n + (255 - n) * f), c = Math.round(a + (255 - a) * f), p = Math.round(o + (255 - o) * f);
  }
  if (t !== void 0 && t > 0) {
    const f = 1 - t / 255;
    s = Math.round(s * f), c = Math.round(c * f), p = Math.round(p * f);
  }
  return s = Math.max(0, Math.min(255, s)), c = Math.max(0, Math.min(255, c)), p = Math.max(0, Math.min(255, p)), `#${Ft(s)}${Ft(c)}${Ft(p)}`;
}
function Ft(x) {
  const e = x.toString(16);
  return e.length === 1 ? "0" + e : e;
}
function ze(x, e, t = "latin") {
  return x != null && x.fontScheme ? (e === "major" ? x.fontScheme.majorFont : x.fontScheme.minorFont)[t] : void 0;
}
const se = {
  embedRegular: "regular",
  embedBold: "bold",
  embedItalic: "italic",
  embedBoldItalic: "boldItalic"
};
function ae(x) {
  const t = gt(x).documentElement, r = oe(t), n = new Map(r.map((o) => [o.name, o])), a = de(r);
  return {
    fonts: r,
    fontMap: n,
    substitutionMap: a
  };
}
function oe(x) {
  return C.elements(x, "font").map((e) => le(e));
}
function le(x) {
  const e = {
    name: C.attr(x, "name") || "",
    embedFontRefs: []
  };
  for (const t of C.elements(x))
    switch (t.localName) {
      case "family":
        e.family = C.attr(t, "val");
        break;
      case "altName":
        e.altName = C.attr(t, "val");
        break;
      case "charset":
        e.charset = C.attr(t, "val");
        break;
      case "panose1":
        e.panose1 = C.attr(t, "val");
        break;
      case "sig":
        e.sig = ce(t);
        break;
      case "embedRegular":
      case "embedBold":
      case "embedItalic":
      case "embedBoldItalic":
        const r = he(t);
        r && e.embedFontRefs.push(r);
        break;
    }
  return e;
}
function ce(x) {
  return {
    usb0: C.attr(x, "usb0"),
    usb1: C.attr(x, "usb1"),
    usb2: C.attr(x, "usb2"),
    usb3: C.attr(x, "usb3"),
    csb0: C.attr(x, "csb0"),
    csb1: C.attr(x, "csb1")
  };
}
function he(x) {
  const e = C.attr(x, "id");
  if (!e) return null;
  const t = se[x.localName];
  return t ? {
    id: e,
    key: C.attr(x, "fontKey"),
    subsetted: C.boolAttr(x, "subsetted"),
    type: t
  } : null;
}
function de(x) {
  const e = /* @__PURE__ */ new Map();
  for (const t of x)
    t.altName && e.set(t.name, t.altName);
  return e;
}
function Be(x, e) {
  return x.substitutionMap.get(e) || e;
}
function Ne(x, e) {
  return x.fontMap.get(e);
}
function Oe(x, e) {
  const t = x.fontMap.get(e);
  return t ? t.embedFontRefs.length > 0 : !1;
}
function Le(x, e, t) {
  const r = x.fontMap.get(e);
  return r ? t ? r.embedFontRefs.filter((n) => n.type === t) : r.embedFontRefs : [];
}
function De(x, e) {
  const t = [], r = x.fontMap.get(e);
  if (t.push(Lt(e)), r != null && r.altName && t.push(Lt(r.altName)), r != null && r.family) {
    const n = ue(r.family);
    n && t.push(n);
  }
  return t.join(", ");
}
function Lt(x) {
  return /[\s,'"()]/.test(x) ? `"${x.replace(/"/g, '\\"')}"` : x;
}
function ue(x) {
  switch (x.toLowerCase()) {
    case "roman":
      return "serif";
    case "swiss":
      return "sans-serif";
    case "modern":
      return "monospace";
    case "script":
      return "cursive";
    case "decorative":
      return "fantasy";
    default:
      return null;
  }
}
const Dt = {
  injectStyles: !0,
  timeout: 1e4
};
async function fe(x, e, t, r = {}) {
  const n = { ...Dt, ...r }, a = [];
  for (const o of e.fonts)
    if (o.embedFontRefs.length !== 0)
      for (const s of o.embedFontRefs)
        try {
          const c = await pe(
            x,
            o,
            s,
            t,
            n.timeout || Dt.timeout
          );
          c && a.push(c);
        } catch (c) {
          console.warn(`加载嵌入字体失败: ${o.name} (${s.type})`, c);
        }
  return n.injectStyles && a.length > 0 && _e(a, n.styleContainer), a;
}
async function pe(x, e, t, r, n) {
  const a = r.find((b) => b.id === t.id);
  if (!a)
    return console.warn(`找不到嵌入字体关系: ${t.id}`), null;
  const o = `word/${a.target}`, s = x.file(o);
  if (!s)
    return console.warn(`找不到嵌入字体文件: ${o}`), null;
  const c = await Promise.race([
    s.async("arraybuffer"),
    new Promise(
      (b, d) => setTimeout(() => d(new Error("字体加载超时")), n)
    )
  ]);
  let p = c;
  t.key && (p = me(c, t.key));
  const f = ge(new Uint8Array(p)), y = be(f), m = new Blob([p], { type: y }), h = await ye(m);
  return {
    fontName: e.name,
    type: t.type,
    dataUrl: h,
    format: f
  };
}
function me(x, e) {
  const t = e.replace(/[{}-]/g, "");
  if (t.length !== 32)
    return console.warn("无效的字体密钥格式:", e), x;
  const r = new Uint8Array(16);
  for (let s = 0; s < 4; s++)
    r[3 - s] = parseInt(t.substr(s * 2, 2), 16);
  for (let s = 0; s < 2; s++)
    r[5 - s] = parseInt(t.substr(8 + s * 2, 2), 16);
  for (let s = 0; s < 2; s++)
    r[7 - s] = parseInt(t.substr(12 + s * 2, 2), 16);
  for (let s = 0; s < 8; s++)
    r[8 + s] = parseInt(t.substr(16 + s * 2, 2), 16);
  const n = new Uint8Array(x), a = new Uint8Array(n.length), o = Math.min(32, n.length);
  for (let s = 0; s < o; s++)
    a[s] = n[s] ^ r[s % 16];
  for (let s = o; s < n.length; s++)
    a[s] = n[s];
  return a.buffer;
}
function ge(x) {
  return x.length < 4 ? "truetype" : x[0] === 79 && x[1] === 84 && x[2] === 84 && x[3] === 79 ? "opentype" : x[0] === 0 && x[1] === 1 && x[2] === 0 && x[3] === 0 || x[0] === 116 && x[1] === 114 && x[2] === 117 && x[3] === 101 ? "truetype" : x[0] === 0 && x[1] === 0 && x[2] === 1 ? "embedded-opentype" : "truetype";
}
function be(x) {
  switch (x) {
    case "opentype":
      return "font/otf";
    case "truetype":
      return "font/ttf";
    case "embedded-opentype":
      return "application/vnd.ms-fontobject";
    default:
      return "font/ttf";
  }
}
function ye(x) {
  return new Promise((e, t) => {
    const r = new FileReader();
    r.onloadend = () => e(r.result), r.onerror = t, r.readAsDataURL(x);
  });
}
function _e(x, e) {
  const t = document.createElement("style");
  t.setAttribute("data-docx-fonts", "true");
  const r = x.map((o) => we(o)).join(`
`);
  t.textContent = r;
  const n = e || document.head, a = n.querySelector("style[data-docx-fonts]");
  a && a.remove(), n.appendChild(t);
}
function we(x) {
  const e = ve(x.type), t = ke(x.type), r = xe(x.format);
  return `@font-face {
  font-family: "${Ce(x.fontName)}";
  src: url("${x.dataUrl}") format("${r}");
  font-weight: ${e};
  font-style: ${t};
  font-display: swap;
}`;
}
function ve(x) {
  switch (x) {
    case "bold":
    case "boldItalic":
      return "700";
    default:
      return "400";
  }
}
function ke(x) {
  switch (x) {
    case "italic":
    case "boldItalic":
      return "italic";
    default:
      return "normal";
  }
}
function xe(x) {
  switch (x) {
    case "opentype":
      return "opentype";
    case "truetype":
      return "truetype";
    case "embedded-opentype":
      return "embedded-opentype";
    default:
      return "truetype";
  }
}
function Ce(x) {
  return x.replace(/"/g, '\\"');
}
function Me(x) {
  const t = (x || document.head).querySelector("style[data-docx-fonts]");
  t && t.remove();
}
function Ee(x) {
  const r = new DOMParser().parseFromString(x, "application/xml").documentElement, n = [], a = r.getElementsByTagName("Relationship");
  for (let o = 0; o < a.length; o++) {
    const s = a[o], c = s.getAttribute("Type") || "";
    c === At.FONT && n.push({
      id: s.getAttribute("Id") || "",
      type: c,
      target: s.getAttribute("Target") || "",
      targetMode: s.getAttribute("TargetMode") || void 0
    });
  }
  return n;
}
const $t = "http://schemas.microsoft.com/office/word/2012/wordml";
function Se(x) {
  const e = /* @__PURE__ */ new Map();
  if (!x)
    return e;
  try {
    const r = gt(x).documentElement, n = r.getElementsByTagNameNS($t, "commentEx"), a = n.length > 0 ? Array.from(n) : Array.from(r.getElementsByTagName("commentEx"));
    for (const o of a) {
      const s = zt(o, "paraId");
      if (!s) continue;
      const c = {
        paraId: s,
        paraIdParent: zt(o, "paraIdParent"),
        done: Ae(o, "done")
      };
      e.set(s, c);
    }
    console.log("[DEBUG] parseCommentsExtended: found", e.size, "extended comments");
  } catch (t) {
    console.warn("解析 commentsExtended.xml 失败:", t);
  }
  return e;
}
function Te(x, e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of x)
    n.paraId && t.set(n.paraId, n);
  for (const n of x)
    n.replies = [];
  for (const [n, a] of e) {
    const o = t.get(n);
    if (o && (o.done = a.done, a.paraIdParent)) {
      const s = t.get(a.paraIdParent);
      s && (o.parentId = s.id, s.replies.push(o));
    }
  }
  const r = x.filter((n) => !n.parentId);
  return r.sort((n, a) => {
    const o = new Date(n.date).getTime(), s = new Date(a.date).getTime();
    return o - s;
  }), Ut(r), console.log(
    "[DEBUG] buildCommentTree: root comments:",
    r.length,
    "total comments:",
    x.length
  ), r;
}
function Ut(x) {
  for (const e of x)
    e.replies && e.replies.length > 0 && (e.replies.sort((t, r) => {
      const n = new Date(t.date).getTime(), a = new Date(r.date).getTime();
      return n - a;
    }), Ut(e.replies));
}
function zt(x, e) {
  let t = x.getAttributeNS($t, e);
  return t || (t = x.getAttribute(e), t) ? t : (t = x.getAttribute(`w15:${e}`), t || void 0);
}
function Ae(x, e) {
  const t = zt(x, e);
  return t ? t === "1" || t === "true" : !1;
}
class Re {
  constructor() {
    nt(this, "zip", null);
    nt(this, "relationships", []);
    nt(this, "images", /* @__PURE__ */ new Map());
    nt(this, "theme");
    nt(this, "fontTable");
    nt(this, "embeddedFonts", []);
    nt(this, "bookmarks", /* @__PURE__ */ new Map());
  }
  /**
   * 解析 DOCX 文件
   */
  async parse(e) {
    const t = e instanceof ArrayBuffer ? e : await e.arrayBuffer();
    this.zip = await Yt.loadAsync(t), this.bookmarks = /* @__PURE__ */ new Map(), await this.parseRelationships(), await this.loadImages();
    const r = await this.parseStyles(), n = new Map(r.map((u) => [u.id, u])), a = await this.parseComments(), o = new Map(a.map((u) => [u.id, u])), s = await this.parseCommentsExtended(), c = Te(a, s), { numberings: p, abstractNumberings: f, numberingMap: y } = await this.parseNumberings();
    this.theme = await this.parseTheme();
    const m = await this.parseHeadersFooters("header"), h = await this.parseHeadersFooters("footer"), b = await this.parseFootnotes(), d = await this.parseEndnotes();
    return this.fontTable = await this.parseFontTable(), this.embeddedFonts = await this.loadEmbeddedFonts(), {
      body: await this.parseDocument(),
      comments: a,
      commentMap: o,
      rootComments: c,
      commentsExtendedMap: s,
      styles: r,
      styleMap: n,
      numberings: p,
      numberingMap: y,
      abstractNumberings: f,
      images: this.images,
      relationships: this.relationships,
      headers: m,
      footers: h,
      theme: this.theme,
      footnotes: b,
      endnotes: d,
      fontTable: this.fontTable,
      embeddedFonts: this.embeddedFonts,
      bookmarks: this.bookmarks
    };
  }
  /**
   * 获取 ZIP 实例
   */
  getZip() {
    return this.zip;
  }
  /**
   * 解析关系文件
   */
  async parseRelationships() {
    var n, a;
    const e = await ((a = (n = this.zip) == null ? void 0 : n.file(mt.RELS)) == null ? void 0 : a.async("string"));
    if (!e) return;
    const r = gt(e).documentElement;
    this.relationships = C.elements(r, "Relationship").map((o) => ({
      id: C.attr(o, "Id") || "",
      type: C.attr(o, "Type") || "",
      target: C.attr(o, "Target") || "",
      targetMode: C.attr(o, "TargetMode")
    }));
  }
  /**
   * 加载图片资源
   */
  async loadImages() {
    var e;
    for (const t of this.relationships)
      if (t.type === At.IMAGE) {
        const r = `word/${t.target}`, n = (e = this.zip) == null ? void 0 : e.file(r);
        if (n) {
          const a = await n.async("blob"), o = await this.blobToBase64(a);
          this.images.set(t.id, o);
        }
      }
  }
  /**
   * Blob 转 Base64
   */
  blobToBase64(e) {
    return new Promise((t, r) => {
      const n = new FileReader();
      n.onloadend = () => t(n.result), n.onerror = r, n.readAsDataURL(e);
    });
  }
  /**
   * 解析样式
   */
  async parseStyles() {
    var a, o;
    const e = await ((o = (a = this.zip) == null ? void 0 : a.file(mt.STYLES)) == null ? void 0 : o.async("string"));
    if (!e) return [];
    const t = gt(e), r = [], n = t.getElementsByTagNameNS(
      "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
      "style"
    );
    for (let s = 0; s < n.length; s++) {
      const c = n[s], p = C.element(c, "name"), f = C.element(c, "basedOn"), y = {
        id: C.attr(c, "styleId") || "",
        name: p ? C.attr(p, "val") : void 0,
        type: C.attr(c, "type") || "paragraph",
        basedOn: f ? C.attr(f, "val") : void 0
      }, m = C.element(c, "pPr");
      m && (y.paragraphProps = this.parseParagraphProperties(m));
      const h = C.element(c, "rPr");
      h && (y.runProps = this.parseRunProperties(h)), r.push(y);
    }
    return r;
  }
  /**
   * 解析主题（word/theme/theme1.xml）
   */
  async parseTheme() {
    var t, r;
    const e = await ((r = (t = this.zip) == null ? void 0 : t.file(mt.THEME)) == null ? void 0 : r.async("string"));
    if (e)
      try {
        const n = gt(e);
        return Jt(n.documentElement);
      } catch (n) {
        console.warn("主题解析失败:", n);
        return;
      }
  }
  /**
   * 解析字体表（word/fontTable.xml）
   */
  async parseFontTable() {
    var t, r;
    const e = await ((r = (t = this.zip) == null ? void 0 : t.file(mt.FONT_TABLE)) == null ? void 0 : r.async("string"));
    if (e)
      try {
        return ae(e);
      } catch (n) {
        console.warn("字体表解析失败:", n);
        return;
      }
  }
  /**
   * 加载嵌入字体
   */
  async loadEmbeddedFonts() {
    var t;
    if (!this.fontTable || !this.zip) return [];
    if (!this.fontTable.fonts.some((r) => r.embedFontRefs.length > 0)) return [];
    try {
      const r = await ((t = this.zip.file(mt.FONT_TABLE_RELS)) == null ? void 0 : t.async("string"));
      if (!r)
        return console.warn("找不到字体表关系文件"), [];
      const n = Ee(r);
      return await fe(this.zip, this.fontTable, n, {
        injectStyles: !0
      });
    } catch (r) {
      return console.warn("嵌入字体加载失败:", r), [];
    }
  }
  /**
   * 解析脚注（word/footnotes.xml）
   */
  async parseFootnotes() {
    var t, r;
    const e = await ((r = (t = this.zip) == null ? void 0 : t.file(mt.FOOTNOTES)) == null ? void 0 : r.async("string"));
    if (!e) return /* @__PURE__ */ new Map();
    try {
      const n = gt(e);
      return this.parseNotes(n.documentElement, "footnote", X.Footnote);
    } catch (n) {
      return console.warn("脚注解析失败:", n), /* @__PURE__ */ new Map();
    }
  }
  /**
   * 解析尾注（word/endnotes.xml）
   */
  async parseEndnotes() {
    var t, r;
    const e = await ((r = (t = this.zip) == null ? void 0 : t.file(mt.ENDNOTES)) == null ? void 0 : r.async("string"));
    if (!e) return /* @__PURE__ */ new Map();
    try {
      const n = gt(e);
      return this.parseNotes(n.documentElement, "endnote", X.Endnote);
    } catch (n) {
      return console.warn("尾注解析失败:", n), /* @__PURE__ */ new Map();
    }
  }
  /**
   * 解析注释（脚注/尾注通用）
   */
  parseNotes(e, t, r) {
    const n = /* @__PURE__ */ new Map(), a = e.getElementsByTagNameNS(
      "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
      t
    );
    for (let o = 0; o < a.length; o++) {
      const s = a[o], c = C.attr(s, "id") || "", p = C.attr(s, "type");
      if (p === "separator" || p === "continuationSeparator")
        continue;
      const f = {
        type: r,
        id: c,
        noteType: p,
        children: this.parseChildren(s)
      };
      n.set(c, f);
    }
    return n;
  }
  /**
   * 解析编号（word/numbering.xml）
   */
  async parseNumberings() {
    var c, p;
    const e = await ((p = (c = this.zip) == null ? void 0 : c.file(mt.NUMBERING)) == null ? void 0 : p.async("string"));
    if (!e)
      return {
        numberings: [],
        abstractNumberings: [],
        numberingMap: /* @__PURE__ */ new Map()
      };
    const r = gt(e).documentElement, n = [], a = /* @__PURE__ */ new Map();
    for (const f of C.elements(r))
      switch (f.localName) {
        case "abstractNum":
          n.push(this.parseAbstractNumbering(f));
          break;
        case "num":
          const y = C.attr(f, "numId") || "", m = C.element(f, "abstractNumId");
          if (m) {
            const h = C.attr(m, "val") || "";
            a.set(y, h);
          }
          break;
      }
    const o = [], s = /* @__PURE__ */ new Map();
    for (const [f, y] of a) {
      const m = n.find((h) => h.id === y);
      if (m) {
        const h = {
          id: f,
          abstractNumId: y,
          levels: m.levels.map((b) => ({ ...b }))
        };
        o.push(h), s.set(f, h);
      }
    }
    return { numberings: o, abstractNumberings: n, numberingMap: s };
  }
  /**
   * 解析抽象编号定义
   */
  parseAbstractNumbering(e) {
    const t = {
      id: C.attr(e, "abstractNumId") || "",
      levels: []
    };
    for (const r of C.elements(e))
      switch (r.localName) {
        case "name":
          t.name = C.attr(r, "val");
          break;
        case "multiLevelType":
          t.multiLevelType = C.attr(r, "val");
          break;
        case "numStyleLink":
          t.numberingStyleLink = C.attr(r, "val");
          break;
        case "styleLink":
          t.styleLink = C.attr(r, "val");
          break;
        case "lvl":
          t.levels.push(this.parseNumberingLevel(r));
          break;
      }
    return t;
  }
  /**
   * 解析编号级别
   */
  parseNumberingLevel(e) {
    const t = {
      level: C.intAttr(e, "ilvl") ?? 0,
      format: "decimal",
      text: "",
      start: 1,
      suffix: "tab"
    };
    for (const r of C.elements(e))
      switch (r.localName) {
        case "start":
          t.start = C.intAttr(r, "val") ?? 1;
          break;
        case "numFmt":
          t.format = C.attr(r, "val") || "decimal";
          break;
        case "lvlText":
          t.text = C.attr(r, "val") || "";
          break;
        case "suff":
          t.suffix = C.attr(r, "val") || "tab";
          break;
        case "pStyle":
          t.pStyleName = C.attr(r, "val");
          break;
        case "pPr":
          t.paragraphProps = this.parseParagraphProperties(r);
          break;
        case "rPr":
          t.runProps = this.parseRunProperties(r);
          break;
      }
    return t;
  }
  /**
   * 解析评论
   */
  async parseComments() {
    var o, s, c;
    const e = await ((s = (o = this.zip) == null ? void 0 : o.file(mt.COMMENTS)) == null ? void 0 : s.async("string"));
    if (!e) return [];
    const t = gt(e), r = [], n = t.getElementsByTagNameNS(
      "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
      "comment"
    ), a = "http://schemas.microsoft.com/office/word/2010/wordml";
    for (let p = 0; p < n.length; p++) {
      const f = n[p], y = ((c = f.textContent) == null ? void 0 : c.trim()) || "";
      let m = f.getAttributeNS(a, "paraId");
      m || (m = f.getAttribute("w14:paraId") || null);
      const h = {
        type: X.Comment,
        id: C.attr(f, "id") || "",
        author: C.attr(f, "author") || "未知",
        date: C.attr(f, "date") || (/* @__PURE__ */ new Date()).toISOString(),
        initials: C.attr(f, "initials"),
        children: this.parseChildren(f),
        rawText: y,
        paraId: m || void 0
      };
      r.push(h);
    }
    return console.log("[DEBUG] parseComments: found", r.length, "comments"), r;
  }
  /**
   * 解析扩展评论（word/commentsExtended.xml）
   * 包含评论的父子关系信息
   */
  async parseCommentsExtended() {
    var t, r;
    const e = await ((r = (t = this.zip) == null ? void 0 : t.file(mt.COMMENTS_EXTENDED)) == null ? void 0 : r.async("string"));
    return e ? (console.log("[DEBUG] commentsExtended.xml found, length:", e.length), Se(e)) : (console.log("[DEBUG] commentsExtended.xml not found"), /* @__PURE__ */ new Map());
  }
  /**
   * 解析文档主体
   */
  async parseDocument() {
    var p, f;
    const e = await ((f = (p = this.zip) == null ? void 0 : p.file(mt.DOCUMENT)) == null ? void 0 : f.async("string"));
    if (!e)
      return { type: X.Document, children: [] };
    const t = gt(e), r = t.getElementsByTagNameNS(
      "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
      "body"
    )[0];
    if (!r)
      return { type: X.Document, children: [] };
    const n = C.element(r, "sectPr"), a = n ? this.parseSectionProperties(n) : void 0, o = t.getElementsByTagNameNS(
      "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
      "document"
    )[0], s = o ? C.element(o, "background") : null, c = s ? this.parseBackground(s) : void 0;
    return {
      type: X.Document,
      children: this.parseChildren(r),
      sectionProps: a,
      background: c
    };
  }
  /**
   * 解析页眉页脚
   */
  async parseHeadersFooters(e) {
    var n, a;
    const t = /* @__PURE__ */ new Map(), r = e === "header" ? At.HEADER : At.FOOTER;
    for (const o of this.relationships)
      if (o.type === r) {
        const s = `word/${o.target}`, c = await ((a = (n = this.zip) == null ? void 0 : n.file(s)) == null ? void 0 : a.async("string"));
        if (c) {
          const f = gt(c).getElementsByTagNameNS(
            "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
            e === "header" ? "hdr" : "ftr"
          )[0];
          if (f) {
            const y = {
              type: e === "header" ? X.Header : X.Footer,
              children: this.parseChildren(f)
            };
            t.set(o.id, y);
          }
        }
      }
    return t;
  }
  /**
   * 解析背景
   */
  parseBackground(e) {
    const t = {}, r = C.attr(e, "color");
    return r && r !== "auto" && (t["background-color"] = `#${r}`), t;
  }
  /**
   * 解析 Section 属性
   */
  parseSectionProperties(e) {
    const t = {};
    for (const r of C.elements(e))
      switch (r.localName) {
        case "pgSz":
          t.pageSize = this.parsePageSize(r);
          break;
        case "pgMar":
          t.pageMargins = this.parsePageMargins(r);
          break;
        case "type":
          t.type = C.attr(r, "val") || "nextPage";
          break;
        case "cols":
          t.columns = this.parseColumns(r);
          break;
        case "pgBorders":
          t.pageBorders = this.parseBorders(r);
          break;
        case "pgNumType":
          t.pageNumber = {
            start: C.intAttr(r, "start"),
            format: C.attr(r, "fmt"),
            chapSep: C.attr(r, "chapSep"),
            chapStyle: C.attr(r, "chapStyle")
          };
          break;
        case "headerReference":
          t.headerRefs || (t.headerRefs = []), t.headerRefs.push({
            id: C.attr(r, "id") || "",
            type: C.attr(r, "type") || "default"
          });
          break;
        case "footerReference":
          t.footerRefs || (t.footerRefs = []), t.footerRefs.push({
            id: C.attr(r, "id") || "",
            type: C.attr(r, "type") || "default"
          });
          break;
        case "titlePg":
          t.titlePage = C.boolAttr(r, "val") !== !1;
          break;
      }
    return t;
  }
  /**
   * 解析页面尺寸
   */
  parsePageSize(e) {
    return {
      width: C.lengthAttr(e, "w"),
      height: C.lengthAttr(e, "h"),
      orientation: C.attr(e, "orient")
    };
  }
  /**
   * 解析页边距
   */
  parsePageMargins(e) {
    return {
      top: C.lengthAttr(e, "top"),
      right: C.lengthAttr(e, "right"),
      bottom: C.lengthAttr(e, "bottom"),
      left: C.lengthAttr(e, "left"),
      header: C.lengthAttr(e, "header"),
      footer: C.lengthAttr(e, "footer"),
      gutter: C.lengthAttr(e, "gutter")
    };
  }
  /**
   * 解析分栏
   */
  parseColumns(e) {
    const t = {
      numberOfColumns: C.intAttr(e, "num"),
      space: C.lengthAttr(e, "space"),
      separator: C.boolAttr(e, "sep"),
      equalWidth: C.boolAttr(e, "equalWidth") !== !1,
      columns: []
    };
    for (const r of C.elements(e, "col"))
      t.columns.push({
        width: C.lengthAttr(r, "w"),
        space: C.lengthAttr(r, "space")
      });
    return t;
  }
  /**
   * 解析边框
   */
  parseBorders(e) {
    const t = {};
    for (const r of C.elements(e)) {
      const n = this.parseBorder(r);
      switch (r.localName) {
        case "top":
          t.top = n;
          break;
        case "bottom":
          t.bottom = n;
          break;
        case "left":
        case "start":
          t.left = n;
          break;
        case "right":
        case "end":
          t.right = n;
          break;
      }
    }
    return t;
  }
  /**
   * 解析单个边框
   */
  parseBorder(e) {
    const t = C.attr(e, "color");
    return {
      style: C.attr(e, "val"),
      width: C.lengthAttr(e, "sz", wt.Border),
      color: t && t !== "auto" ? `#${t}` : void 0
    };
  }
  /**
   * 解析子元素
   */
  parseChildren(e, t = !1) {
    const r = [];
    for (const n of C.elements(e)) {
      const a = this.parseElement(n);
      a && r.push(a);
    }
    return t && r.length === 0 && console.log(
      "[DEBUG] parseChildren: no children parsed from",
      e.localName,
      "childNodes:",
      e.childNodes.length,
      "elements:",
      C.elements(e).map((n) => n.localName)
    ), r;
  }
  /**
   * 解析单个元素
   */
  parseElement(e) {
    var r;
    const t = e.localName;
    switch (t) {
      case "p":
        return this.parseParagraph(e);
      case "r":
        return this.parseRun(e);
      case "t":
        return this.parseText(e);
      case "br":
        return this.parseBreak(e);
      case "tab":
        return this.parseTab();
      case "sym":
        return this.parseSymbol(e);
      case "lastRenderedPageBreak":
        return { type: X.Break, breakType: "lastRenderedPageBreak" };
      case "fldSimple":
        return this.parseSimpleField(e);
      case "fldChar":
        return this.parseComplexField(e);
      case "instrText":
        return this.parseFieldInstruction(e);
      case "tbl":
        return this.parseTable(e);
      case "tr":
        return this.parseTableRow(e);
      case "tc":
        return this.parseTableCell(e);
      case "hyperlink":
        return this.parseHyperlink(e);
      case "drawing":
        return this.parseDrawing(e);
      case "commentRangeStart":
        return this.parseCommentRangeStart(e);
      case "commentRangeEnd":
        return this.parseCommentRangeEnd(e);
      case "commentReference":
        return this.parseCommentReference(e);
      case "footnoteReference":
        return this.parseFootnoteReference(e);
      case "endnoteReference":
        return this.parseEndnoteReference(e);
      case "bookmarkStart":
        return this.parseBookmarkStart(e);
      case "bookmarkEnd":
        return this.parseBookmarkEnd(e);
      default:
        console.log("[DEBUG] parseElement default branch for:", t);
        const n = this.parseChildren(e);
        if (n.length > 0)
          return console.log("[DEBUG]   -> found children:", n.length), n.length === 1 ? n[0] : {
            type: X.Run,
            children: n
          };
        const a = (r = e.textContent) == null ? void 0 : r.trim();
        return a ? (console.log("[DEBUG]   -> using textContent:", a.substring(0, 50)), {
          type: X.Text,
          text: a
        }) : null;
    }
  }
  /**
   * 解析段落
   */
  parseParagraph(e) {
    const t = C.element(e, "pPr");
    return {
      type: X.Paragraph,
      props: t ? this.parseParagraphProperties(t) : void 0,
      children: this.parseChildren(e).filter((r) => r.type !== X.Paragraph)
    };
  }
  /**
   * 解析段落属性
   */
  parseParagraphProperties(e) {
    const t = {}, r = C.element(e, "pStyle");
    r && (t.styleId = C.attr(r, "val"));
    const n = C.element(e, "jc");
    if (n) {
      const y = C.attr(n, "val");
      (y === "left" || y === "center" || y === "right" || y === "both") && (t.justification = y);
    }
    const a = C.element(e, "ind");
    a && (t.indentation = {
      left: C.lengthAttr(a, "left"),
      right: C.lengthAttr(a, "right"),
      firstLine: C.lengthAttr(a, "firstLine"),
      hanging: C.lengthAttr(a, "hanging")
    });
    const o = C.element(e, "spacing");
    o && (t.spacing = {
      before: C.lengthAttr(o, "before"),
      after: C.lengthAttr(o, "after"),
      // line 保存原始数值（twip），由渲染器根据 lineRule 计算
      line: C.intAttr(o, "line"),
      lineRule: C.attr(o, "lineRule")
    });
    const s = C.element(e, "pageBreakBefore");
    s && (t.pageBreakBefore = C.boolAttr(s, "val") !== !1);
    const c = C.element(e, "pBdr");
    c && (t.borders = this.parseBorders(c));
    const p = C.element(e, "sectPr");
    p && (t.sectionProps = this.parseSectionProperties(p));
    const f = C.element(e, "numPr");
    return f && (t.numbering = this.parseParagraphNumbering(f)), t;
  }
  /**
   * 解析段落编号引用
   */
  parseParagraphNumbering(e) {
    const t = {
      id: "",
      level: 0
    };
    for (const r of C.elements(e))
      switch (r.localName) {
        case "numId":
          t.id = C.attr(r, "val") || "";
          break;
        case "ilvl":
          t.level = C.intAttr(r, "val") ?? 0;
          break;
      }
    if (t.id)
      return t;
  }
  /**
   * 解析 Run
   */
  parseRun(e) {
    const t = C.element(e, "rPr");
    return {
      type: X.Run,
      props: t ? this.parseRunProperties(t) : void 0,
      children: this.parseChildren(e)
    };
  }
  /**
   * 解析 Run 属性
   */
  parseRunProperties(e) {
    var b, d, _, u;
    const t = {}, r = C.element(e, "rStyle");
    r && (t.styleId = C.attr(r, "val"));
    const n = C.element(e, "b");
    n && (t.bold = C.attr(n, "val") !== "0");
    const a = C.element(e, "i");
    a && (t.italic = C.attr(a, "val") !== "0");
    const o = C.element(e, "u");
    o && (t.underline = C.attr(o, "val") || "single");
    const s = C.element(e, "strike");
    s && (t.strike = C.attr(s, "val") !== "0");
    const c = C.element(e, "dstrike");
    c && (t.dstrike = C.attr(c, "val") !== "0");
    const p = C.element(e, "vertAlign");
    if (p) {
      const v = C.attr(p, "val");
      (v === "superscript" || v === "subscript") && (t.vertAlign = v);
    }
    const f = C.element(e, "color");
    if (f) {
      const v = C.attr(f, "val"), E = C.attr(f, "themeColor");
      if (E) {
        const A = C.attr(f, "themeTint"), T = C.attr(f, "themeShade");
        if (t.themeColor = {
          themeColor: E,
          themeTint: A ? parseInt(A, 16) : void 0,
          themeShade: T ? parseInt(T, 16) : void 0
        }, this.theme) {
          const L = ne(this.theme, t.themeColor);
          L && (t.color = L);
        }
      } else v && v !== "auto" && (t.color = `#${v}`);
    }
    const y = C.element(e, "sz");
    y && (t.fontSize = C.lengthAttr(y, "val", wt.FontSize));
    const m = C.element(e, "rFonts");
    if (m) {
      const v = C.attr(m, "asciiTheme"), E = C.attr(m, "eastAsiaTheme");
      if (v || E) {
        const A = v || E || "";
        if (A.startsWith("major")) {
          if (t.themeFontFamily = "major", (d = (b = this.theme) == null ? void 0 : b.fontScheme) != null && d.majorFont) {
            const T = A.includes("EastAsia") ? this.theme.fontScheme.majorFont.ea : this.theme.fontScheme.majorFont.latin;
            T && (t.fontFamily = T);
          }
        } else if (A.startsWith("minor") && (t.themeFontFamily = "minor", (u = (_ = this.theme) == null ? void 0 : _.fontScheme) != null && u.minorFont)) {
          const T = A.includes("EastAsia") ? this.theme.fontScheme.minorFont.ea : this.theme.fontScheme.minorFont.latin;
          T && (t.fontFamily = T);
        }
      }
      t.fontFamily || (t.fontFamily = C.attr(m, "ascii") || C.attr(m, "eastAsia") || C.attr(m, "hAnsi"));
    }
    const h = C.element(e, "highlight");
    return h && (t.highlight = C.attr(h, "val")), t;
  }
  /**
   * 解析文本
   */
  parseText(e) {
    return {
      type: X.Text,
      text: e.textContent || ""
    };
  }
  /**
   * 解析换行
   */
  parseBreak(e) {
    const t = C.attr(e, "type");
    return {
      type: X.Break,
      breakType: t || "textWrapping"
    };
  }
  /**
   * 解析 Tab
   */
  parseTab() {
    return {
      type: X.Tab
    };
  }
  /**
   * 解析符号字符 - <w:sym w:font="Symbol" w:char="F0B7"/>
   * Symbol 字体中的特殊字符，如箭头、符号等
   */
  parseSymbol(e) {
    const t = C.attr(e, "font"), r = C.attr(e, "char");
    let n;
    if (r) {
      const a = parseInt(r, 16);
      isNaN(a) || (n = String.fromCharCode(a));
    }
    return {
      type: X.Symbol,
      font: t,
      char: n
    };
  }
  /**
   * 解析简单域 - <w:fldSimple w:instr="PAGE">...</w:fldSimple>
   */
  parseSimpleField(e) {
    return {
      type: X.SimpleField,
      instruction: C.attr(e, "instr") || "",
      children: this.parseChildren(e)
    };
  }
  /**
   * 解析复杂域字符 - <w:fldChar w:fldCharType="begin"/>
   */
  parseComplexField(e) {
    return {
      type: X.ComplexField,
      charType: C.attr(e, "fldCharType") || ""
    };
  }
  /**
   * 解析域指令 - <w:instrText>PAGE</w:instrText>
   */
  parseFieldInstruction(e) {
    return {
      type: X.FieldInstruction,
      text: e.textContent || ""
    };
  }
  /**
   * 解析表格
   */
  parseTable(e) {
    const t = {
      type: X.Table,
      children: []
    };
    for (const r of C.elements(e))
      switch (r.localName) {
        case "tr":
          t.children.push(this.parseTableRow(r));
          break;
        case "tblGrid":
          t.columns = this.parseTableGrid(r);
          break;
        case "tblPr":
          t.props = this.parseTableProperties(r);
          break;
      }
    return t;
  }
  /**
   * 解析表格列宽度
   */
  parseTableGrid(e) {
    const t = [];
    for (const r of C.elements(e))
      r.localName === "gridCol" && t.push({
        width: C.lengthAttr(r, "w")
      });
    return t;
  }
  /**
   * 解析表格属性
   */
  parseTableProperties(e) {
    const t = {};
    for (const r of C.elements(e))
      switch (r.localName) {
        case "tblW":
          t.width = C.lengthAttr(r, "w");
          const n = C.attr(r, "type");
          (n === "auto" || n === "dxa" || n === "pct") && (t.widthType = n);
          break;
        case "jc":
          t.justification = C.attr(r, "val");
          break;
        case "tblBorders":
          t.borders = this.parseTableBorders(r);
          break;
        case "tblCellSpacing":
          t.cellSpacing = C.lengthAttr(r, "w");
          break;
        case "tblCellMar":
          t.cellMargin = {
            top: C.lengthAttr(C.element(r, "top"), "w"),
            bottom: C.lengthAttr(C.element(r, "bottom"), "w"),
            left: C.lengthAttr(C.element(r, "left"), "w") || C.lengthAttr(C.element(r, "start"), "w"),
            right: C.lengthAttr(C.element(r, "right"), "w") || C.lengthAttr(C.element(r, "end"), "w")
          };
          break;
      }
    return t;
  }
  /**
   * 解析表格边框（包含内部边框 insideH/insideV）
   */
  parseTableBorders(e) {
    const t = {};
    for (const r of C.elements(e)) {
      const n = this.parseBorder(r);
      switch (r.localName) {
        case "top":
          t.top = n;
          break;
        case "bottom":
          t.bottom = n;
          break;
        case "left":
        case "start":
          t.left = n;
          break;
        case "right":
        case "end":
          t.right = n;
          break;
        case "insideH":
          t.insideH = n;
          break;
        case "insideV":
          t.insideV = n;
          break;
      }
    }
    return t;
  }
  /**
   * 解析表格行
   */
  parseTableRow(e) {
    return {
      type: X.TableRow,
      children: C.elements(e).filter((t) => t.localName === "tc").map((t) => this.parseTableCell(t))
    };
  }
  /**
   * 解析表格单元格
   */
  parseTableCell(e) {
    const t = {
      type: X.TableCell,
      children: []
    };
    for (const r of C.elements(e))
      if (r.localName === "tcPr")
        t.props = this.parseTableCellProperties(r);
      else {
        const n = this.parseElement(r);
        n && t.children.push(n);
      }
    return t;
  }
  /**
   * 解析表格单元格属性
   */
  parseTableCellProperties(e) {
    const t = {};
    for (const r of C.elements(e))
      switch (r.localName) {
        case "tcW":
          t.width = C.lengthAttr(r, "w");
          break;
        case "gridSpan":
          t.gridSpan = C.intAttr(r, "val");
          break;
        case "vMerge":
          const n = C.attr(r, "val");
          t.verticalMerge = n === "restart" ? "restart" : "continue";
          break;
        case "vAlign":
          t.verticalAlign = C.attr(r, "val");
          break;
        case "shd":
          const a = C.attr(r, "fill");
          a && a !== "auto" && (t.shading = `#${a}`);
          break;
        case "tcBorders":
          t.borders = this.parseBorders(r);
          break;
      }
    return t;
  }
  /**
   * 解析超链接
   */
  parseHyperlink(e) {
    const t = C.attr(e, "id");
    let r;
    if (t) {
      const n = this.relationships.find((a) => a.id === t);
      n && (r = n.target);
    }
    return {
      type: X.Hyperlink,
      href: r,
      anchor: C.attr(e, "anchor"),
      children: this.parseChildren(e)
    };
  }
  /**
   * 解析绘图（图片等）
   */
  parseDrawing(e) {
    const t = [], r = e.getElementsByTagNameNS(
      "http://schemas.openxmlformats.org/drawingml/2006/main",
      "blip"
    );
    for (let n = 0; n < r.length; n++) {
      const o = r[n].getAttributeNS(
        "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        "embed"
      );
      if (o && this.images.has(o)) {
        const s = e.getElementsByTagNameNS(
          "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
          "extent"
        )[0];
        let c, p;
        if (s) {
          const f = s.getAttribute("cx"), y = s.getAttribute("cy");
          f && (c = C.convertLength(f, wt.Emu)), y && (p = C.convertLength(y, wt.Emu));
        }
        t.push({
          type: X.Image,
          src: this.images.get(o),
          width: c,
          height: p
        });
      }
    }
    return {
      type: X.Drawing,
      children: t
    };
  }
  /**
   * 解析评论范围开始
   */
  parseCommentRangeStart(e) {
    return {
      type: X.CommentRangeStart,
      id: C.attr(e, "id") || ""
    };
  }
  /**
   * 解析评论范围结束
   */
  parseCommentRangeEnd(e) {
    return {
      type: X.CommentRangeEnd,
      id: C.attr(e, "id") || ""
    };
  }
  /**
   * 解析评论引用
   */
  parseCommentReference(e) {
    return {
      type: X.CommentReference,
      id: C.attr(e, "id") || ""
    };
  }
  /**
   * 解析脚注引用
   */
  parseFootnoteReference(e) {
    return {
      type: X.FootnoteReference,
      id: C.attr(e, "id") || ""
    };
  }
  /**
   * 解析尾注引用
   */
  parseEndnoteReference(e) {
    return {
      type: X.EndnoteReference,
      id: C.attr(e, "id") || ""
    };
  }
  /**
   * 解析书签开始
   * <w:bookmarkStart w:id="0" w:name="bookmark1"/>
   */
  parseBookmarkStart(e) {
    const t = {
      type: X.BookmarkStart,
      id: C.attr(e, "id") || "",
      name: C.attr(e, "name") || "",
      colFirst: C.intAttr(e, "colFirst"),
      colLast: C.intAttr(e, "colLast")
    };
    return t.name && !t.name.startsWith("_") && this.bookmarks.set(t.name, t), t;
  }
  /**
   * 解析书签结束
   * <w:bookmarkEnd w:id="0"/>
   */
  parseBookmarkEnd(e) {
    return {
      type: X.BookmarkEnd,
      id: C.attr(e, "id") || ""
    };
  }
}
class Ie {
  // 尾注编号计数器
  constructor(e) {
    nt(this, "document", null);
    nt(this, "container");
    nt(this, "options");
    nt(this, "classPrefix");
    // 评论相关状态
    nt(this, "commentRanges", /* @__PURE__ */ new Map());
    nt(this, "activeCommentId", null);
    nt(this, "svgLayer", null);
    nt(this, "currentCommentIds", /* @__PURE__ */ new Set());
    // 当前正在渲染的评论范围
    nt(this, "commentStartInParagraph", /* @__PURE__ */ new Set());
    // 在当前段落开始的评论
    // 页码相关状态
    nt(this, "currentPageNumber", 1);
    nt(this, "totalPages", 1);
    nt(this, "inComplexField", !1);
    // 是否在复杂域中
    nt(this, "currentFieldInstruction", "");
    // 当前域指令
    nt(this, "skipFieldContent", !1);
    // 是否跳过域的静态内容（separate 后）
    // 编号/列表相关状态
    // 编号计数器：key 格式为 "numId-level"，value 为当前计数
    nt(this, "numberingCounters", /* @__PURE__ */ new Map());
    // 脚注/尾注相关状态
    nt(this, "currentFootnoteIds", []);
    // 当前页面引用的脚注 ID
    nt(this, "currentEndnoteIds", []);
    // 文档中引用的尾注 ID
    nt(this, "footnoteCounter", 0);
    // 脚注编号计数器
    nt(this, "endnoteCounter", 0);
    // 表格垂直合并状态
    nt(this, "tableVerticalMerges", []);
    nt(this, "currentVerticalMerge", /* @__PURE__ */ new Map());
    nt(this, "currentCellCol", 0);
    // 表格边框状态（用于 insideH/insideV 内部边框）
    nt(this, "currentTableBorders");
    nt(this, "tableBordersStack", []);
    nt(this, "currentTableRowIndex", 0);
    nt(this, "currentTableRowCount", 0);
    nt(this, "currentTableColCount", 0);
    const t = typeof e.container == "string" ? document.querySelector(e.container) : e.container;
    if (!t)
      throw new Error("容器元素不存在");
    this.container = t, this.classPrefix = e.classNamePrefix || "docx", this.options = {
      container: this.container,
      renderComments: e.renderComments ?? !0,
      enableCommentEdit: e.enableCommentEdit ?? !0,
      showCommentLines: e.showCommentLines ?? !0,
      breakPages: e.breakPages ?? !0,
      classNamePrefix: this.classPrefix,
      onCommentClick: e.onCommentClick || (() => {
      }),
      onCommentChange: e.onCommentChange || (() => {
      }),
      onCommentAccept: e.onCommentAccept,
      onCommentReject: e.onCommentReject
    };
  }
  /**
   * 渲染文档
   */
  render(e) {
    this.document = e, this.commentRanges.clear(), this.currentCommentIds.clear(), this.numberingCounters.clear(), this.currentFootnoteIds = [], this.currentEndnoteIds = [], this.footnoteCounter = 0, this.endnoteCounter = 0;
    for (const a of e.comments)
      this.commentRanges.set(a.id, {
        id: a.id,
        startElement: null,
        endElement: null,
        highlightElements: [],
        panelElement: null
      });
    this.container.innerHTML = "", this.container.className = `${this.classPrefix}-container`;
    const t = this.createElement("div", `${this.classPrefix}-wrapper`);
    this.options.breakPages ? this.renderWithPages(t, e) : this.renderSinglePage(t, e), this.container.appendChild(t), this.options.showCommentLines && (this.svgLayer = this.createSvgLayer(), this.container.appendChild(this.svgLayer)), this.options.renderComments && this.renderAllCommentBubbles();
    let r = !1;
    const n = () => {
      r || (requestAnimationFrame(() => {
        this.positionCommentBubbles(), this.updateLines(), r = !1;
      }), r = !0);
    };
    t.addEventListener("scroll", () => {
      this.positionCommentBubbles(), this.updateLines();
    }, { passive: !0 }), window.addEventListener("resize", n), requestAnimationFrame(() => {
      this.positionCommentBubbles(), this.updateLines();
    });
  }
  /**
   * 单页渲染模式
   */
  renderSinglePage(e, t) {
    const r = this.createElement("div", `${this.classPrefix}-document`), n = this.createElement("div", `${this.classPrefix}-page`), a = this.renderElement(t.body);
    a && n.appendChild(a), this.renderPageFootnotes(this.currentFootnoteIds, n), r.appendChild(n), e.appendChild(r), this.renderDocumentEndnotes(e);
  }
  /**
   * 分页渲染模式
   */
  renderWithPages(e, t) {
    const r = t.body, n = r.sectionProps, a = this.splitBySection(r.children || [], n), o = this.groupByPageBreaks(a);
    this.totalPages = o.length;
    let s;
    for (let c = 0; c < o.length; c++) {
      this.currentPageNumber = c + 1;
      const p = this.currentFootnoteIds.length, f = o[c];
      if (f.length === 0) continue;
      let m = f[0].sectProps || n;
      const h = this.createPageElement(m);
      m != null && m.headerRefs && this.renderHeaderFooter(
        m.headerRefs,
        m,
        c,
        s !== m,
        h,
        "header"
      );
      for (const d of f) {
        const _ = this.createSectionContent(d.sectProps);
        for (const u of d.elements) {
          const v = this.renderElement(u);
          v && _.appendChild(v);
        }
        h.appendChild(_), m = d.sectProps || m;
      }
      const b = this.currentFootnoteIds.slice(p);
      this.renderPageFootnotes(b, h), m != null && m.footerRefs && this.renderHeaderFooter(
        m.footerRefs,
        m,
        c,
        s !== m,
        h,
        "footer"
      ), e.appendChild(h), s = m;
    }
    this.renderDocumentEndnotes(e);
  }
  /**
   * 按 Section 分割内容
   */
  splitBySection(e, t) {
    var o, s;
    const r = [];
    let n = { sectProps: null, elements: [], pageBreak: !1 };
    r.push(n);
    for (const c of e)
      if (c.type === X.Paragraph && (o = c.props) != null && o.pageBreakBefore && (n.pageBreak = !0, n = { sectProps: null, elements: [], pageBreak: !1 }, r.push(n)), n.elements.push(c), c.type === X.Paragraph) {
        const p = c, f = (s = p.props) == null ? void 0 : s.sectionProps;
        let y = !1;
        const m = (h) => {
          for (const b of h) {
            if (b.type === X.Break) {
              const d = b;
              if (d.breakType === "page" || d.breakType === "lastRenderedPageBreak") {
                y = !0;
                return;
              }
            }
            b.type === X.Run && b.children && m(b.children);
          }
        };
        this.options.breakPages && p.children && m(p.children), (f || y) && (n.sectProps = f || null, n.pageBreak = y, n = { sectProps: null, elements: [], pageBreak: !1 }, r.push(n));
      }
    let a = null;
    for (let c = r.length - 1; c >= 0; c--)
      r[c].sectProps === null ? r[c].sectProps = a || t || null : a = r[c].sectProps;
    return r;
  }
  /**
   * 按分页符分组
   */
  groupByPageBreaks(e) {
    const t = [];
    let r = [];
    t.push(r);
    let n = null;
    for (const a of e)
      r.push(a), (a.pageBreak || this.isPageBreakSection(n, a.sectProps)) && (r = [], t.push(r)), n = a.sectProps;
    return t.filter((a) => a.length > 0);
  }
  /**
   * 检查是否因为 Section 属性变化需要分页
   */
  isPageBreakSection(e, t) {
    if (!e || !t) return !1;
    const r = e.pageSize, n = t.pageSize;
    return !r || !n ? !1 : r.orientation !== n.orientation || r.width !== n.width || r.height !== n.height;
  }
  /**
   * 创建页面元素
   */
  createPageElement(e) {
    const t = this.createElement("section", `${this.classPrefix}-page`);
    if (e && (e.pageSize && (e.pageSize.width && (t.style.width = e.pageSize.width), e.pageSize.height && (t.style.minHeight = e.pageSize.height)), e.pageMargins)) {
      const r = e.pageMargins;
      r.top && (t.style.paddingTop = r.top), r.right && (t.style.paddingRight = r.right), r.bottom && (t.style.paddingBottom = r.bottom), r.left && (t.style.paddingLeft = r.left);
    }
    return t;
  }
  /**
   * 创建 Section 内容区域
   */
  createSectionContent(e) {
    const t = this.createElement("article", `${this.classPrefix}-section-content`);
    if (e != null && e.columns) {
      const r = e.columns;
      r.numberOfColumns && r.numberOfColumns > 1 && (t.style.columnCount = String(r.numberOfColumns), r.space && (t.style.columnGap = r.space), r.separator && (t.style.columnRule = "1px solid #ccc"));
    }
    return t;
  }
  /**
   * 渲染页眉或页脚
   */
  renderHeaderFooter(e, t, r, n, a, o) {
    var y, m;
    if (!e || e.length === 0) return;
    let s = null;
    if (t.titlePage && n && (s = e.find((h) => h.type === "first")), s || r % 2 === 1 && (s = e.find((h) => h.type === "even")), s || (s = e.find((h) => h.type === "default")), !s) return;
    const c = o === "header" ? (y = this.document) == null ? void 0 : y.headers : (m = this.document) == null ? void 0 : m.footers, p = c == null ? void 0 : c.get(s.id);
    if (!p) return;
    const f = this.createElement("div", `${this.classPrefix}-${o}`);
    for (const h of p.children || []) {
      const b = this.renderElement(h);
      b && f.appendChild(b);
    }
    if (t.pageMargins) {
      const h = t.pageMargins;
      o === "header" && h.header && h.top ? (f.style.marginTop = `calc(${h.header} - ${h.top})`, f.style.minHeight = `calc(${h.top} - ${h.header})`) : o === "footer" && h.footer && h.bottom && (f.style.marginBottom = `calc(${h.footer} - ${h.bottom})`, f.style.minHeight = `calc(${h.bottom} - ${h.footer})`);
    }
    o === "header" ? a.insertBefore(f, a.firstChild) : a.appendChild(f);
  }
  /**
   * 渲染所有评论气泡（右侧固定面板）
   */
  renderAllCommentBubbles() {
    var r;
    const e = this.createElement("div", `${this.classPrefix}-comments-layer`);
    this.container.appendChild(e);
    const t = ((r = this.document) == null ? void 0 : r.comments) || [];
    console.log("[DEBUG] renderAllCommentBubbles - Total comments:", t.length), t.forEach((n) => {
      var a;
      console.log("[DEBUG] Comment:", {
        id: n.id,
        author: n.author,
        date: n.date,
        childrenCount: ((a = n.children) == null ? void 0 : a.length) || 0,
        text: this.getCommentText(n)
      });
    }), console.log("[DEBUG] Comment ranges count:", this.commentRanges.size);
    for (const n of t) {
      const a = this.commentRanges.get(n.id);
      if (a && a.highlightElements.length > 0) {
        const o = this.createCommentBubble(n);
        a.panelElement = o, e.appendChild(o);
      }
    }
  }
  /**
   * 定位评论气泡到对应的高亮文字旁边
   * 原文不可见时隐藏评论
   */
  positionCommentBubbles() {
    const e = this.container.querySelector(`.${this.classPrefix}-page`);
    if (!e) return;
    const r = e.getBoundingClientRect().right + 15, n = 0, a = window.innerHeight;
    for (const [, o] of this.commentRanges) {
      if (!o.panelElement || o.highlightElements.length === 0) continue;
      const c = o.highlightElements[0].getBoundingClientRect();
      c.bottom > n && c.top < a ? (o.panelElement.style.display = "block", o.panelElement.style.left = `${r}px`, o.panelElement.style.top = `${c.top}px`) : o.panelElement.style.display = "none";
    }
  }
  /**
   * 创建 SVG 连线层
   */
  createSvgLayer() {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    return e.classList.add(`${this.classPrefix}-lines`), e;
  }
  /**
   * 更新所有连线
   */
  updateLines() {
    if (this.svgLayer) {
      this.svgLayer.innerHTML = "";
      for (const [e] of this.commentRanges) {
        const t = e === this.activeCommentId;
        this.drawCommentLine(e, t);
      }
    }
  }
  /**
   * 绘制单个评论的连线
   */
  drawCommentLine(e, t) {
    const r = this.commentRanges.get(e);
    if (!r || !r.highlightElements.length || !r.panelElement || !this.svgLayer || r.panelElement.style.display === "none") return;
    const n = r.highlightElements[0].getBoundingClientRect(), a = r.panelElement.getBoundingClientRect(), o = n.right, s = n.top + n.height / 2, c = a.left, p = s, f = document.createElementNS("http://www.w3.org/2000/svg", "line");
    f.setAttribute("x1", String(o)), f.setAttribute("y1", String(s)), f.setAttribute("x2", String(c)), f.setAttribute("y2", String(p)), f.setAttribute("stroke", "#ef4444"), f.setAttribute("stroke-width", t ? "2" : "1"), this.svgLayer.appendChild(f);
  }
  /**
   * 渲染元素
   */
  renderElement(e) {
    switch (e.type) {
      case X.Document:
        return this.renderDocument(e);
      case X.Paragraph:
        return this.renderParagraph(e);
      case X.Run:
        return this.renderRun(e);
      case X.Text:
        return this.renderText(e);
      case X.Break:
        return this.renderBreak(e);
      case X.Tab:
        return this.renderTab();
      case X.Symbol:
        return this.renderSymbol(e);
      case X.SimpleField:
        return this.renderSimpleField(e);
      case X.ComplexField:
        return this.renderComplexField(e);
      case X.FieldInstruction:
        return this.renderFieldInstruction(e);
      case X.Table:
        return this.renderTable(e);
      case X.TableRow:
        return this.renderTableRow(e);
      case X.TableCell:
        return this.renderTableCell(e);
      case X.Hyperlink:
        return this.renderHyperlink(e);
      case X.Drawing:
        return this.renderDrawing(e);
      case X.Image:
        return this.renderImage(e);
      case X.CommentRangeStart:
        return this.renderCommentRangeStart(e);
      case X.CommentRangeEnd:
        return this.renderCommentRangeEnd(e);
      case X.CommentReference:
        return this.renderCommentReference(e);
      case X.FootnoteReference:
        return this.renderFootnoteReference(e);
      case X.EndnoteReference:
        return this.renderEndnoteReference(e);
      case X.Footnote:
        return this.renderFootnote(e);
      case X.Endnote:
        return this.renderEndnote(e);
      case X.BookmarkStart:
        return this.renderBookmarkStart(e);
      case X.BookmarkEnd:
        return this.renderBookmarkEnd(e);
      default:
        return null;
    }
  }
  /**
   * 渲染文档
   */
  renderDocument(e) {
    const t = this.createElement("article", `${this.classPrefix}-body`);
    return this.renderChildren(e.children || [], t), t;
  }
  /**
   * 渲染段落
   */
  renderParagraph(e) {
    const t = this.createElement("p", `${this.classPrefix}-p`);
    this.commentStartInParagraph.clear(), e.props && this.applyParagraphStyles(t, e.props);
    const r = this.renderNumbering(e.props);
    return r && (t.insertBefore(r, t.firstChild), t.classList.add(`${this.classPrefix}-list-item`)), this.renderChildren(e.children || [], t), (t.childNodes.length === 0 || t.childNodes.length === 1 && r) && t.appendChild(document.createElement("br")), this.commentStartInParagraph.size > 0 && this.options.renderComments && (t.dataset.commentIds = Array.from(this.commentStartInParagraph).join(",")), t;
  }
  /**
   * 渲染编号
   */
  renderNumbering(e) {
    var f, y;
    if (!(e != null && e.numbering) || !((f = this.document) != null && f.numberingMap))
      return null;
    const { id: t, level: r } = e.numbering, n = this.document.numberingMap.get(t);
    if (!n)
      return null;
    const a = n.levels.find((m) => m.level === r);
    if (!a)
      return null;
    const o = this.getNumberingContent(n, a, t, r), s = this.createElement("span", `${this.classPrefix}-numbering`);
    s.textContent = o, a.runProps && this.applyRunStyles(s, a.runProps);
    const c = this.createElement("span", `${this.classPrefix}-numbering-suffix`);
    switch (a.suffix) {
      case "tab":
        c.innerHTML = "&emsp;";
        break;
      case "space":
        c.innerHTML = "&nbsp;";
        break;
    }
    const p = this.createElement("span", `${this.classPrefix}-numbering-wrapper`);
    if (p.appendChild(s), p.appendChild(c), (y = a.paragraphProps) != null && y.indentation) {
      const m = a.paragraphProps.indentation;
      m.left && (p.style.marginLeft = m.left), m.hanging && (p.style.textIndent = `-${m.hanging}`, p.style.paddingLeft = m.hanging);
    }
    return p;
  }
  /**
   * 获取编号内容
   */
  getNumberingContent(e, t, r, n) {
    const a = t.format, o = t.text;
    if (a === "bullet")
      return o || "•";
    const s = `${r}-${n}`;
    let c = this.numberingCounters.get(s) ?? t.start - 1;
    c++, this.numberingCounters.set(s, c);
    for (let f = n + 1; f <= 8; f++)
      this.numberingCounters.delete(`${r}-${f}`);
    let p = o;
    for (let f = 0; f <= n; f++) {
      const y = this.numberingCounters.get(`${r}-${f}`) ?? 1, m = e.levels.find((d) => d.level === f), h = (m == null ? void 0 : m.format) || "decimal", b = this.formatNumber(y, h);
      p = p.replace(`%${f + 1}`, b);
    }
    return p;
  }
  /**
   * 格式化编号
   */
  formatNumber(e, t) {
    switch (t) {
      case "decimal":
        return String(e);
      case "decimalZero":
        return e < 10 ? `0${e}` : String(e);
      case "lowerLetter":
        return this.toLetters(e, !1);
      case "upperLetter":
        return this.toLetters(e, !0);
      case "lowerRoman":
        return this.toRoman(e).toLowerCase();
      case "upperRoman":
        return this.toRoman(e);
      case "chineseCountingThousand":
      case "chineseCounting":
        return this.toChinese(e);
      case "ideographTraditional":
        return this.toChineseTraditional(e);
      case "bullet":
        return "•";
      default:
        return String(e);
    }
  }
  /**
   * 数字转字母
   */
  toLetters(e, t) {
    const r = t ? 65 : 97;
    let n = "";
    for (; e > 0; )
      e--, n = String.fromCharCode(r + e % 26) + n, e = Math.floor(e / 26);
    return n;
  }
  /**
   * 数字转罗马数字
   */
  toRoman(e) {
    const t = [
      [1e3, "M"],
      [900, "CM"],
      [500, "D"],
      [400, "CD"],
      [100, "C"],
      [90, "XC"],
      [50, "L"],
      [40, "XL"],
      [10, "X"],
      [9, "IX"],
      [5, "V"],
      [4, "IV"],
      [1, "I"]
    ];
    let r = "";
    for (const [n, a] of t)
      for (; e >= n; )
        r += a, e -= n;
    return r;
  }
  /**
   * 数字转中文数字
   */
  toChinese(e) {
    const t = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"], r = ["", "十", "百", "千", "万"];
    if (e <= 10)
      return e === 10 ? "十" : t[e];
    let n = "", a = 0;
    for (; e > 0; ) {
      const o = e % 10;
      o !== 0 ? n = t[o] + r[a] + n : n && !n.startsWith("零") && (n = "零" + n), e = Math.floor(e / 10), a++;
    }
    return n.startsWith("一十") && (n = n.substring(1)), n;
  }
  /**
   * 数字转中文传统数字（甲乙丙丁...）
   */
  toChineseTraditional(e) {
    const t = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    return e >= 1 && e <= 10 ? t[e - 1] : String(e);
  }
  /**
   * 创建评论气泡
   */
  createCommentBubble(e) {
    const t = this.createElement("div", `${this.classPrefix}-comment-bubble`);
    t.dataset.commentId = e.id;
    const r = e.initials || e.author.charAt(0).toUpperCase(), n = this.formatDate(e.date), a = this.getCommentText(e), s = this.options.enableCommentEdit || this.options.onCommentAccept || this.options.onCommentReject ? `
      <div class="${this.classPrefix}-comment-actions">
        ${this.options.onCommentAccept ? `
          <button class="${this.classPrefix}-comment-btn accept" title="接受建议">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
          </button>
        ` : ""}
        ${this.options.onCommentReject ? `
          <button class="${this.classPrefix}-comment-btn reject" title="拒绝建议">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </button>
        ` : ""}
        ${this.options.enableCommentEdit ? `
          <button class="${this.classPrefix}-comment-btn edit" title="编辑">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="${this.classPrefix}-comment-btn delete" title="删除">
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        ` : ""}
      </div>
    ` : "";
    t.innerHTML = `
      <div class="${this.classPrefix}-comment-header">
        <div class="${this.classPrefix}-comment-avatar">${this.escapeHtml(r)}</div>
        <div class="${this.classPrefix}-comment-meta">
          <span class="${this.classPrefix}-comment-author">${this.escapeHtml(e.author)}</span>
          <span class="${this.classPrefix}-comment-date">${n}</span>
        </div>
      </div>
      <div class="${this.classPrefix}-comment-content">${this.escapeHtml(a)}</div>
      ${s}
    `, t.addEventListener("mouseenter", () => this.highlightComment(e.id)), t.addEventListener("mouseleave", () => this.unhighlightComment(e.id)), t.addEventListener("click", () => {
      this.selectComment(e.id), this.options.onCommentClick(e);
    });
    const c = t.querySelector(".accept");
    c == null || c.addEventListener("click", (m) => {
      var h, b;
      m.stopPropagation(), (b = (h = this.options).onCommentAccept) == null || b.call(h, e);
    });
    const p = t.querySelector(".reject");
    p == null || p.addEventListener("click", (m) => {
      var h, b;
      m.stopPropagation(), (b = (h = this.options).onCommentReject) == null || b.call(h, e);
    });
    const f = t.querySelector(".edit");
    f == null || f.addEventListener("click", (m) => {
      m.stopPropagation(), this.editComment(e);
    });
    const y = t.querySelector(".delete");
    return y == null || y.addEventListener("click", (m) => {
      m.stopPropagation(), this.deleteComment(e.id);
    }), t;
  }
  /**
   * 获取评论文本内容
   */
  getCommentText(e) {
    const t = [], r = (a) => {
      for (const o of a)
        o.type === X.Text && t.push(o.text), o.children && r(o.children);
    };
    r(e.children || []);
    const n = t.join("");
    return !n && e.rawText ? (console.log("[DEBUG] Comment", e.id, "using rawText:", e.rawText), e.rawText) : (console.log("[DEBUG] Comment", e.id, "text result:", n), n || "");
  }
  /**
   * 高亮评论
   */
  highlightComment(e) {
    var r;
    this.activeCommentId = e;
    const t = this.commentRanges.get(e);
    t && (t.highlightElements.forEach((n) => {
      n.classList.add(`${this.classPrefix}-highlight--active`);
    }), (r = t.panelElement) == null || r.classList.add(`${this.classPrefix}-comment-bubble--active`)), this.updateLines();
  }
  /**
   * 取消高亮评论
   */
  unhighlightComment(e) {
    var r;
    this.activeCommentId === e && (this.activeCommentId = null);
    const t = this.commentRanges.get(e);
    t && (t.highlightElements.forEach((n) => {
      n.classList.remove(`${this.classPrefix}-highlight--active`);
    }), (r = t.panelElement) == null || r.classList.remove(`${this.classPrefix}-comment-bubble--active`)), this.updateLines();
  }
  /**
   * 选中评论
   */
  selectComment(e) {
    this.activeCommentId = e, this.updateLines();
  }
  /**
   * 编辑评论
   */
  editComment(e) {
    const t = this.getCommentText(e), r = prompt("编辑评论:", t);
    if (r !== null && r !== t) {
      const n = { type: X.Text, text: r }, a = { type: X.Run, children: [n] }, o = { type: X.Paragraph, children: [a] };
      e.children = [o];
      const s = this.commentRanges.get(e.id);
      if (s != null && s.panelElement) {
        const c = s.panelElement.querySelector(`.${this.classPrefix}-comment-content`);
        c && (c.textContent = r);
      }
      this.options.onCommentChange(e, "update");
    }
  }
  /**
   * 删除评论
   */
  deleteComment(e) {
    var n, a;
    if (!confirm("确定要删除这条评论吗？")) return;
    const t = (n = this.document) == null ? void 0 : n.commentMap.get(e);
    if (!t) return;
    const r = this.commentRanges.get(e);
    if (r && (r.highlightElements.forEach((o) => {
      o.classList.remove(`${this.classPrefix}-highlight`), o.classList.remove(`${this.classPrefix}-highlight--active`);
    }), (a = r.panelElement) == null || a.remove()), this.document) {
      const o = this.document.comments.indexOf(t);
      o > -1 && this.document.comments.splice(o, 1), this.document.commentMap.delete(e);
    }
    this.commentRanges.delete(e), this.options.onCommentChange(t, "delete"), this.updateLines();
  }
  /**
   * 应用段落样式
   */
  applyParagraphStyles(e, t) {
    const r = [];
    if (t.justification) {
      const n = {
        left: "left",
        center: "center",
        right: "right",
        both: "justify"
      };
      r.push(`text-align: ${n[t.justification] || "left"}`);
    }
    if (t.indentation && (t.indentation.left && r.push(`padding-left: ${t.indentation.left}`), t.indentation.right && r.push(`padding-right: ${t.indentation.right}`), t.indentation.firstLine && r.push(`text-indent: ${t.indentation.firstLine}`)), t.spacing && (t.spacing.before && r.push(`margin-top: ${t.spacing.before}`), t.spacing.after && r.push(`margin-bottom: ${t.spacing.after}`), t.spacing.line !== void 0)) {
      const n = t.spacing.line;
      switch (t.spacing.lineRule) {
        case "auto":
          r.push(`line-height: ${(n / 240).toFixed(2)}`);
          break;
        case "atLeast":
          r.push(`line-height: calc(100% + ${n / 20}pt)`);
          break;
        case "exact":
        default:
          r.push(`line-height: ${n / 20}pt`);
          break;
      }
    }
    r.length > 0 && (e.style.cssText = r.join("; "));
  }
  /**
   * 渲染 Run
   */
  renderRun(e) {
    if (this.skipFieldContent && !(e.children || []).some(
      (n) => n.type === X.ComplexField && n.charType === "end"
    ))
      return null;
    const t = this.createElement("span", `${this.classPrefix}-run`);
    if (this.currentCommentIds.size > 0) {
      t.classList.add(`${this.classPrefix}-highlight`);
      for (const r of this.currentCommentIds) {
        t.classList.add(`${this.classPrefix}-highlight-${r}`), t.dataset.commentId = r;
        const n = this.commentRanges.get(r);
        n && n.highlightElements.push(t);
      }
      t.addEventListener("click", () => {
        const r = t.dataset.commentId;
        r && this.highlightComment(r);
      });
    }
    return e.props && this.applyRunStyles(t, e.props), this.renderChildren(e.children || [], t), t.childNodes.length === 0 ? null : t;
  }
  /**
   * 应用 Run 样式
   */
  applyRunStyles(e, t) {
    const r = [];
    t.bold && r.push("font-weight: bold"), t.italic && r.push("font-style: italic");
    const n = [];
    if (t.underline && t.underline !== "none" && (e.classList.add(`${this.classPrefix}-underline-${t.underline}`), this.isComplexUnderline(t.underline) || n.push("underline")), t.strike && n.push("line-through"), t.dstrike && e.classList.add(`${this.classPrefix}-dstrike`), n.length > 0 && r.push(`text-decoration: ${n.join(" ")}`), t.vertAlign && e.classList.add(`${this.classPrefix}-${t.vertAlign}`), t.color && r.push(`color: ${t.color}`), t.fontSize && r.push(`font-size: ${t.fontSize}`), t.fontFamily && r.push(`font-family: "${t.fontFamily}"`), t.highlight) {
      const a = {
        yellow: "#ffff00",
        green: "#00ff00",
        cyan: "#00ffff",
        magenta: "#ff00ff",
        blue: "#0000ff",
        red: "#ff0000",
        darkBlue: "#000080",
        darkCyan: "#008080",
        darkGreen: "#008000",
        darkMagenta: "#800080",
        darkRed: "#800000",
        darkYellow: "#808000",
        darkGray: "#808080",
        lightGray: "#c0c0c0",
        black: "#000000"
      };
      r.push(`background-color: ${a[t.highlight] || t.highlight}`);
    }
    r.length > 0 && (e.style.cssText = r.join("; "));
  }
  /**
   * 检查是否是复杂下划线样式（需要特殊 CSS 处理）
   */
  isComplexUnderline(e) {
    return [
      "double",
      "thick",
      "dotted",
      "dottedHeavy",
      "dash",
      "dashedHeavy",
      "dashLong",
      "dashLongHeavy",
      "dotDash",
      "dashDotHeavy",
      "dotDotDash",
      "dashDotDotHeavy",
      "wave",
      "wavyHeavy",
      "wavyDouble"
    ].includes(e);
  }
  /**
   * 渲染文本
   */
  renderText(e) {
    if (this.skipFieldContent)
      return null;
    const t = document.createElement("span");
    return t.textContent = e.text, t;
  }
  /**
   * 渲染换行
   */
  renderBreak(e) {
    switch (e.breakType) {
      case "page":
      case "lastRenderedPageBreak":
        const t = this.createElement("div", `${this.classPrefix}-page-break`);
        return t.style.pageBreakAfter = "always", t;
      case "column":
        const r = this.createElement("span", `${this.classPrefix}-column-break`);
        return r.style.breakAfter = "column", r;
      default:
        return document.createElement("br");
    }
  }
  /**
   * 渲染 Tab
   */
  renderTab() {
    const e = this.createElement("span", `${this.classPrefix}-tab`);
    return e.innerHTML = "&emsp;", e;
  }
  /**
   * 渲染 Symbol 字符
   * 处理 Word 中的特殊符号字符（如 Wingdings、Symbol 字体中的符号）
   */
  renderSymbol(e) {
    const t = this.createElement("span", `${this.classPrefix}-symbol`);
    return e.font && (t.style.fontFamily = `"${e.font}", "Segoe UI Symbol", "Apple Symbols", sans-serif`), e.char ? t.textContent = e.char : t.textContent = "□", t;
  }
  /**
   * 渲染简单域 - 如 PAGE, NUMPAGES 等
   */
  renderSimpleField(e) {
    const t = e.instruction.trim().toUpperCase(), r = this.evaluateFieldInstruction(t);
    if (r !== null) {
      const a = this.createElement("span", `${this.classPrefix}-field`);
      return a.textContent = r, a;
    }
    const n = this.createElement("span", `${this.classPrefix}-field`);
    return this.renderChildren(e.children || [], n), n;
  }
  /**
   * 渲染复杂域字符
   */
  renderComplexField(e) {
    switch (e.charType) {
      case "begin":
        return this.inComplexField = !0, this.skipFieldContent = !1, this.currentFieldInstruction = "", null;
      case "separate":
        const t = this.evaluateFieldInstruction(this.currentFieldInstruction.trim().toUpperCase());
        if (t !== null) {
          this.skipFieldContent = !0;
          const r = this.createElement("span", `${this.classPrefix}-field`);
          return r.textContent = t, r;
        }
        return null;
      case "end":
        return this.inComplexField = !1, this.skipFieldContent = !1, this.currentFieldInstruction = "", null;
      default:
        return null;
    }
  }
  /**
   * 渲染域指令
   */
  renderFieldInstruction(e) {
    return this.inComplexField && (this.currentFieldInstruction += e.text), null;
  }
  /**
   * 计算域值
   */
  evaluateFieldInstruction(e) {
    switch (e.split(/\s+/)[0]) {
      case "PAGE":
        return String(this.currentPageNumber);
      case "NUMPAGES":
        return String(this.totalPages);
      case "DATE":
        return (/* @__PURE__ */ new Date()).toLocaleDateString("zh-CN");
      case "TIME":
        return (/* @__PURE__ */ new Date()).toLocaleTimeString("zh-CN");
      default:
        return null;
    }
  }
  /**
   * 渲染表格
   */
  renderTable(e) {
    var n, a, o;
    const t = this.createElement("table", `${this.classPrefix}-table`);
    if (this.tableVerticalMerges.push(this.currentVerticalMerge), this.currentVerticalMerge = /* @__PURE__ */ new Map(), this.tableBordersStack.push(this.currentTableBorders), this.currentTableBorders = (n = e.props) == null ? void 0 : n.borders, this.currentTableRowCount = ((a = e.children) == null ? void 0 : a.length) || 0, this.currentTableColCount = ((o = e.columns) == null ? void 0 : o.length) || 0, this.currentTableRowIndex = 0, e.columns && e.columns.length > 0) {
      const s = document.createElement("colgroup");
      for (const c of e.columns) {
        const p = document.createElement("col");
        c.width && (p.style.width = c.width), s.appendChild(p);
      }
      t.appendChild(s);
    }
    e.props && this.applyTableStyles(t, e.props);
    const r = document.createElement("tbody");
    for (const s of e.children || []) {
      this.currentCellCol = 0;
      const c = this.renderTableRow(s);
      r.appendChild(c), this.currentTableRowIndex++;
    }
    return t.appendChild(r), this.currentVerticalMerge = this.tableVerticalMerges.pop() || /* @__PURE__ */ new Map(), this.currentTableBorders = this.tableBordersStack.pop(), t;
  }
  /**
   * 应用表格样式
   */
  applyTableStyles(e, t) {
    t.width && (t.widthType, e.style.width = t.width), t.justification === "center" && (e.style.marginLeft = "auto", e.style.marginRight = "auto"), t.cellSpacing && (e.style.borderSpacing = t.cellSpacing, e.style.borderCollapse = "separate");
  }
  /**
   * 将边框属性转换为 CSS 字符串
   */
  borderToCss(e) {
    if (!e || !e.style)
      return "none";
    const t = this.parseBorderType(e.style);
    if (t === "none")
      return "none";
    const r = e.width || "1px", n = e.color || "black";
    return `${r} ${t} ${n}`;
  }
  /**
   * 将 Word 边框类型转换为 CSS 边框样式
   */
  parseBorderType(e) {
    switch (e) {
      case "single":
        return "solid";
      case "dashDotStroked":
        return "solid";
      case "dashed":
        return "dashed";
      case "dashSmallGap":
        return "dashed";
      case "dotDash":
        return "dotted";
      case "dotDotDash":
        return "dotted";
      case "dotted":
        return "dotted";
      case "double":
        return "double";
      case "doubleWave":
        return "double";
      case "inset":
        return "inset";
      case "nil":
        return "none";
      case "none":
        return "none";
      case "outset":
        return "outset";
      case "thick":
        return "solid";
      case "thickThinLargeGap":
        return "solid";
      case "thickThinMediumGap":
        return "solid";
      case "thickThinSmallGap":
        return "solid";
      case "thinThickLargeGap":
        return "solid";
      case "thinThickMediumGap":
        return "solid";
      case "thinThickSmallGap":
        return "solid";
      case "thinThickThinLargeGap":
        return "solid";
      case "thinThickThinMediumGap":
        return "solid";
      case "thinThickThinSmallGap":
        return "solid";
      case "threeDEmboss":
        return "solid";
      case "threeDEngrave":
        return "solid";
      case "triple":
        return "double";
      case "wave":
        return "solid";
      default:
        return "solid";
    }
  }
  /**
   * 应用单元格边框样式
   */
  applyCellBorders(e, t, r, n, a) {
    const o = this.currentTableBorders, s = r === 0, c = r === this.currentTableRowCount - 1, p = n === 0, f = n + a >= this.currentTableColCount;
    let y = t == null ? void 0 : t.top;
    y || (s ? y = o == null ? void 0 : o.top : y = o == null ? void 0 : o.insideH), y && (e.style.borderTop = this.borderToCss(y));
    let m = t == null ? void 0 : t.bottom;
    m || (c ? m = o == null ? void 0 : o.bottom : m = o == null ? void 0 : o.insideH), m && (e.style.borderBottom = this.borderToCss(m));
    let h = t == null ? void 0 : t.left;
    h || (p ? h = o == null ? void 0 : o.left : h = o == null ? void 0 : o.insideV), h && (e.style.borderLeft = this.borderToCss(h));
    let b = t == null ? void 0 : t.right;
    b || (f ? b = o == null ? void 0 : o.right : b = o == null ? void 0 : o.insideV), b && (e.style.borderRight = this.borderToCss(b));
  }
  /**
   * 渲染表格行
   */
  renderTableRow(e) {
    const t = this.createElement("tr", `${this.classPrefix}-tr`);
    this.currentCellCol = 0;
    for (const r of e.children || []) {
      const n = this.renderTableCell(r);
      n && t.appendChild(n);
    }
    return t;
  }
  /**
   * 渲染表格单元格
   */
  renderTableCell(e) {
    const t = this.createElement("td", `${this.classPrefix}-td`), r = e.props, n = this.currentCellCol, a = (r == null ? void 0 : r.gridSpan) || 1;
    if (r != null && r.verticalMerge)
      if (r.verticalMerge === "restart")
        this.currentVerticalMerge.set(n, t), t.rowSpan = 1;
      else {
        const o = this.currentVerticalMerge.get(n);
        if (o)
          return o.rowSpan += 1, this.currentCellCol += a, null;
      }
    else
      this.currentVerticalMerge.delete(n);
    return r && (r.width && (t.style.width = r.width), r.verticalAlign && (t.style.verticalAlign = r.verticalAlign), r.shading && (t.style.backgroundColor = r.shading), a > 1 && (t.colSpan = a)), this.applyCellBorders(
      t,
      r == null ? void 0 : r.borders,
      this.currentTableRowIndex,
      n,
      a
    ), this.renderChildren(e.children || [], t), this.currentCellCol += a, t;
  }
  /**
   * 渲染超链接
   */
  renderHyperlink(e) {
    const t = document.createElement("a");
    return t.className = `${this.classPrefix}-link`, e.href ? (t.href = e.href, t.target = "_blank", t.rel = "noopener noreferrer") : e.anchor && (t.href = `#${e.anchor}`), this.renderChildren(e.children || [], t), t;
  }
  /**
   * 渲染绘图
   */
  renderDrawing(e) {
    const t = this.createElement("span", `${this.classPrefix}-drawing`);
    return this.renderChildren(e.children || [], t), t;
  }
  /**
   * 渲染图片
   */
  renderImage(e) {
    const t = document.createElement("img");
    return t.className = `${this.classPrefix}-image`, t.src = e.src, e.width && (t.style.width = e.width), e.height && (t.style.height = e.height), e.alt && (t.alt = e.alt), t;
  }
  /**
   * 渲染评论范围开始
   */
  renderCommentRangeStart(e) {
    this.currentCommentIds.add(e.id), this.commentStartInParagraph.add(e.id);
    const t = this.createElement("span", `${this.classPrefix}-comment-start`);
    t.dataset.commentId = e.id;
    const r = this.commentRanges.get(e.id);
    return r && (r.startElement = t), t;
  }
  /**
   * 渲染评论范围结束
   */
  renderCommentRangeEnd(e) {
    this.currentCommentIds.delete(e.id);
    const t = this.createElement("span", `${this.classPrefix}-comment-end`);
    t.dataset.commentId = e.id;
    const r = this.commentRanges.get(e.id);
    return r && (r.endElement = t), t;
  }
  /**
   * 渲染评论引用
   */
  renderCommentReference(e) {
    const t = this.createElement("span", `${this.classPrefix}-comment-ref`);
    return t.dataset.commentId = e.id, t.textContent = "📝", t.title = "查看评论", t.addEventListener("click", () => {
      this.highlightComment(e.id);
    }), t;
  }
  /**
   * 渲染书签开始标记
   * 创建一个锚点元素，供超链接跳转使用
   */
  renderBookmarkStart(e) {
    if (e.name.startsWith("_"))
      return this.createElement("span");
    const t = this.createElement("span", `${this.classPrefix}-bookmark`);
    return t.id = e.name, t.dataset.bookmarkId = e.id, t.dataset.bookmarkName = e.name, t;
  }
  /**
   * 渲染书签结束标记
   * 书签结束标记不需要渲染任何可见内容
   */
  renderBookmarkEnd(e) {
    return this.createElement("span");
  }
  /**
   * 渲染脚注引用（文档正文中的上标数字）
   */
  renderFootnoteReference(e) {
    this.footnoteCounter++, this.currentFootnoteIds.push(e.id);
    const t = this.createElement("sup", `${this.classPrefix}-footnote-ref`);
    return t.dataset.footnoteId = e.id, t.textContent = String(this.footnoteCounter), t.title = "脚注", t.addEventListener("click", () => {
      const r = document.getElementById(`${this.classPrefix}-footnote-${e.id}`);
      r == null || r.scrollIntoView({ behavior: "smooth", block: "center" });
    }), t;
  }
  /**
   * 渲染尾注引用（文档正文中的上标数字）
   */
  renderEndnoteReference(e) {
    this.endnoteCounter++, this.currentEndnoteIds.push(e.id);
    const t = this.createElement("sup", `${this.classPrefix}-endnote-ref`);
    return t.dataset.endnoteId = e.id, t.textContent = String(this.endnoteCounter), t.title = "尾注", t.addEventListener("click", () => {
      const r = document.getElementById(`${this.classPrefix}-endnote-${e.id}`);
      r == null || r.scrollIntoView({ behavior: "smooth", block: "center" });
    }), t;
  }
  /**
   * 渲染脚注内容
   */
  renderFootnote(e) {
    const t = this.createElement("li", `${this.classPrefix}-footnote`);
    return t.id = `${this.classPrefix}-footnote-${e.id}`, t.dataset.footnoteId = e.id, this.renderChildren(e.children || [], t), t;
  }
  /**
   * 渲染尾注内容
   */
  renderEndnote(e) {
    const t = this.createElement("li", `${this.classPrefix}-endnote`);
    return t.id = `${this.classPrefix}-endnote-${e.id}`, t.dataset.endnoteId = e.id, this.renderChildren(e.children || [], t), t;
  }
  /**
   * 渲染页面脚注区域
   */
  renderPageFootnotes(e, t) {
    var o;
    if (e.length === 0 || !((o = this.document) != null && o.footnotes)) return;
    const r = this.createElement("div", `${this.classPrefix}-footnotes-section`), n = this.createElement("hr", `${this.classPrefix}-footnotes-separator`);
    r.appendChild(n);
    const a = this.createElement("ol", `${this.classPrefix}-footnotes-list`);
    for (const s of e) {
      const c = this.document.footnotes.get(s);
      if (c) {
        const p = this.renderFootnote(c);
        a.appendChild(p);
      }
    }
    r.appendChild(a), t.appendChild(r);
  }
  /**
   * 渲染文档尾注区域
   */
  renderDocumentEndnotes(e) {
    var a;
    if (this.currentEndnoteIds.length === 0 || !((a = this.document) != null && a.endnotes)) return;
    const t = this.createElement("div", `${this.classPrefix}-endnotes-section`), r = this.createElement("h3", `${this.classPrefix}-endnotes-title`);
    r.textContent = "尾注", t.appendChild(r);
    const n = this.createElement("ol", `${this.classPrefix}-endnotes-list`);
    for (const o of this.currentEndnoteIds) {
      const s = this.document.endnotes.get(o);
      if (s) {
        const c = this.renderEndnote(s);
        n.appendChild(c);
      }
    }
    t.appendChild(n), e.appendChild(t);
  }
  /**
   * 渲染子元素
   */
  renderChildren(e, t) {
    for (const r of e) {
      const n = this.renderElement(r);
      n && t.appendChild(n);
    }
  }
  /**
   * 创建元素
   */
  createElement(e, t) {
    const r = document.createElement(e);
    return t && (r.className = t), r;
  }
  /**
   * 格式化日期
   */
  formatDate(e) {
    try {
      return new Date(e).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    } catch {
      return e;
    }
  }
  /**
   * 转义 HTML
   */
  escapeHtml(e) {
    const t = document.createElement("div");
    return t.textContent = e, t.innerHTML;
  }
  /**
   * 获取文档对象
   */
  getDocument() {
    return this.document;
  }
}
console.log("[docx-render] 模块开始加载...");
console.log("[docx-render] DocumentParser 已导入");
console.log("[docx-render] DocumentRenderer 已导入");
console.log("[docx-render] types 已导入");
console.log("[docx-render] 开始导入样式...");
console.log("[docx-render] 样式导入完成");
class Fe {
  constructor(e) {
    nt(this, "parser");
    nt(this, "renderer");
    nt(this, "document", null);
    console.log("[docx-render] DocxRender 构造函数被调用"), this.parser = new Re(), this.renderer = new Ie(e);
  }
  /**
   * 渲染 DOCX 文件
   */
  async render(e) {
    console.log("[docx-render] DocxRender.render() 开始"), this.document = await this.parser.parse(e), console.log("[docx-render] 文档解析完成，开始渲染"), this.renderer.render(this.document), console.log("[docx-render] DocxRender.render() 完成");
  }
  /**
   * 获取文档对象
   */
  getDocument() {
    return this.document;
  }
  /**
   * 获取所有评论
   */
  getComments() {
    var e;
    return ((e = this.document) == null ? void 0 : e.comments) || [];
  }
  /**
   * 获取解析器（用于保存修改）
   */
  getParser() {
    return this.parser;
  }
}
async function $e(x, e, t) {
  console.log("[docx-render] renderDocx() 被调用");
  const r = new Fe({
    container: e,
    ...t
  });
  return await r.render(x), r;
}
console.log("[docx-render] 模块加载完成!");
export {
  mt as DOCX_PARTS,
  Re as DocumentParser,
  Ie as DocumentRenderer,
  Fe as DocxRender,
  X as DomType,
  qt as XML_NS,
  ie as applyTintShade,
  Te as buildCommentTree,
  De as buildFontFamily,
  Me as cleanupFontStyles,
  Le as getEmbedFontRefs,
  Ne as getFontDeclaration,
  Be as getSubstituteFontName,
  Oe as hasEmbeddedFont,
  fe as loadEmbeddedFonts,
  Se as parseCommentsExtended,
  ae as parseFontTable,
  Jt as parseTheme,
  $e as renderDocx,
  ne as resolveThemeColor,
  ze as resolveThemeFont
};
