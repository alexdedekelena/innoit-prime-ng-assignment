var Up = Object.defineProperty,
  qp = Object.defineProperties;
var Wp = Object.getOwnPropertyDescriptors;
var Hn = Object.getOwnPropertySymbols;
var pc = Object.prototype.hasOwnProperty,
  hc = Object.prototype.propertyIsEnumerable;
var fc = (e, t, n) =>
    t in e
      ? Up(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  te = (e, t) => {
    for (var n in (t ||= {})) pc.call(t, n) && fc(e, n, t[n]);
    if (Hn) for (var n of Hn(t)) hc.call(t, n) && fc(e, n, t[n]);
    return e;
  },
  ne = (e, t) => qp(e, Wp(t));
var hb = (e, t) => {
  var n = {};
  for (var r in e) pc.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Hn)
    for (var r of Hn(e)) t.indexOf(r) < 0 && hc.call(e, r) && (n[r] = e[r]);
  return n;
};
var on = (e, t, n) =>
  new Promise((r, o) => {
    var i = (c) => {
        try {
          a(n.next(c));
        } catch (l) {
          o(l);
        }
      },
      s = (c) => {
        try {
          a(n.throw(c));
        } catch (l) {
          o(l);
        }
      },
      a = (c) => (c.done ? r(c.value) : Promise.resolve(c.value).then(i, s));
    a((n = n.apply(e, t)).next());
  });
function ni(e, t) {
  return Object.is(e, t);
}
var j = null,
  Bn = !1,
  ri = 1,
  ce = Symbol("SIGNAL");
function b(e) {
  let t = j;
  return (j = e), t;
}
function oi() {
  return j;
}
var Dt = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  kind: "unknown",
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function an(e) {
  if (Bn) throw new Error("");
  if (j === null) return;
  j.consumerOnSignalRead(e);
  let t = j.nextProducerIndex++;
  if ((zn(j), t < j.producerNode.length && j.producerNode[t] !== e && sn(j))) {
    let n = j.producerNode[t];
    Wn(n, j.producerIndexOfThis[t]);
  }
  j.producerNode[t] !== e &&
    ((j.producerNode[t] = e),
    (j.producerIndexOfThis[t] = sn(j) ? mc(e, j, t) : 0)),
    (j.producerLastReadVersion[t] = e.version);
}
function gc() {
  ri++;
}
function ii(e) {
  if (!(sn(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === ri)) {
    if (!e.producerMustRecompute(e) && !qn(e)) {
      ti(e);
      return;
    }
    e.producerRecomputeValue(e), ti(e);
  }
}
function si(e) {
  if (e.liveConsumerNode === void 0) return;
  let t = Bn;
  Bn = !0;
  try {
    for (let n of e.liveConsumerNode) n.dirty || zp(n);
  } finally {
    Bn = t;
  }
}
function ai() {
  return j?.consumerAllowSignalWrites !== !1;
}
function zp(e) {
  (e.dirty = !0), si(e), e.consumerMarkedDirty?.(e);
}
function ti(e) {
  (e.dirty = !1), (e.lastCleanEpoch = ri);
}
function cn(e) {
  return e && (e.nextProducerIndex = 0), b(e);
}
function Un(e, t) {
  if (
    (b(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (sn(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Wn(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function qn(e) {
  zn(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (ii(n), r !== n.version)) return !0;
  }
  return !1;
}
function ln(e) {
  if ((zn(e), sn(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Wn(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function mc(e, t, n) {
  if ((yc(e), e.liveConsumerNode.length === 0 && vc(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      e.producerIndexOfThis[r] = mc(e.producerNode[r], e, r);
  return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1;
}
function Wn(e, t) {
  if ((yc(e), e.liveConsumerNode.length === 1 && vc(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      Wn(e.producerNode[r], e.producerIndexOfThis[r]);
  let n = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t];
    zn(o), (o.producerIndexOfThis[r] = t);
  }
}
function sn(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function zn(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function yc(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function vc(e) {
  return e.producerNode !== void 0;
}
function ci(e, t) {
  let n = Object.create(Gp);
  (n.computation = e), t !== void 0 && (n.equal = t);
  let r = () => {
    if ((ii(n), an(n), n.value === $n)) throw n.error;
    return n.value;
  };
  return (r[ce] = n), r;
}
var Xo = Symbol("UNSET"),
  ei = Symbol("COMPUTING"),
  $n = Symbol("ERRORED"),
  Gp = ne(te({}, Dt), {
    value: Xo,
    dirty: !0,
    error: null,
    equal: ni,
    kind: "computed",
    producerMustRecompute(e) {
      return e.value === Xo || e.value === ei;
    },
    producerRecomputeValue(e) {
      if (e.value === ei) throw new Error("Detected cycle in computations.");
      let t = e.value;
      e.value = ei;
      let n = cn(e),
        r,
        o = !1;
      try {
        (r = e.computation()),
          b(null),
          (o = t !== Xo && t !== $n && r !== $n && e.equal(t, r));
      } catch (i) {
        (r = $n), (e.error = i);
      } finally {
        Un(e, n);
      }
      if (o) {
        e.value = t;
        return;
      }
      (e.value = r), e.version++;
    },
  });
function Qp() {
  throw new Error();
}
var Ec = Qp;
function Ic(e) {
  Ec(e);
}
function li(e) {
  Ec = e;
}
var Zp = null;
function ui(e, t) {
  let n = Object.create(Gn);
  (n.value = e), t !== void 0 && (n.equal = t);
  let r = () => (an(n), n.value);
  return (r[ce] = n), r;
}
function un(e, t) {
  ai() || Ic(e), e.equal(e.value, t) || ((e.value = t), Yp(e));
}
function di(e, t) {
  ai() || Ic(e), un(e, t(e.value));
}
var Gn = ne(te({}, Dt), { equal: ni, value: void 0, kind: "signal" });
function Yp(e) {
  e.version++, gc(), si(e), Zp?.();
}
function fi(e) {
  let t = b(null);
  try {
    return e();
  } finally {
    b(t);
  }
}
var pi;
function dn() {
  return pi;
}
function Ce(e) {
  let t = pi;
  return (pi = e), t;
}
var Qn = Symbol("NotFound");
function D(e) {
  return typeof e == "function";
}
function wt(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Zn = wt(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    }
);
function Ge(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var V = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (D(r))
        try {
          r();
        } catch (i) {
          t = i instanceof Zn ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Dc(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof Zn ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new Zn(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Dc(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && Ge(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && Ge(n, t), t instanceof e && t._removeParent(this);
  }
};
V.EMPTY = (() => {
  let e = new V();
  return (e.closed = !0), e;
})();
var hi = V.EMPTY;
function Yn(e) {
  return (
    e instanceof V ||
    (e && "closed" in e && D(e.remove) && D(e.add) && D(e.unsubscribe))
  );
}
function Dc(e) {
  D(e) ? e() : e.unsubscribe();
}
var de = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var bt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = bt;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = bt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Kn(e) {
  bt.setTimeout(() => {
    let { onUnhandledError: t } = de;
    if (t) t(e);
    else throw e;
  });
}
function Qe() {}
var wc = gi("C", void 0, void 0);
function bc(e) {
  return gi("E", void 0, e);
}
function Mc(e) {
  return gi("N", e, void 0);
}
function gi(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Ze = null;
function Mt(e) {
  if (de.useDeprecatedSynchronousErrorHandling) {
    let t = !Ze;
    if ((t && (Ze = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Ze;
      if (((Ze = null), n)) throw r;
    }
  } else e();
}
function Cc(e) {
  de.useDeprecatedSynchronousErrorHandling &&
    Ze &&
    ((Ze.errorThrown = !0), (Ze.error = e));
}
var Ye = class extends V {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Yn(t) && t.add(this))
          : (this.destination = nh);
    }
    static create(t, n, r) {
      return new Ct(t, n, r);
    }
    next(t) {
      this.isStopped ? yi(Mc(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? yi(bc(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? yi(wc, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  eh = Function.prototype.bind;
function mi(e, t) {
  return eh.call(e, t);
}
var vi = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          Jn(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          Jn(r);
        }
      else Jn(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          Jn(n);
        }
    }
  },
  Ct = class extends Ye {
    constructor(t, n, r) {
      super();
      let o;
      if (D(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && de.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && mi(t.next, i),
              error: t.error && mi(t.error, i),
              complete: t.complete && mi(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new vi(o);
    }
  };
function Jn(e) {
  de.useDeprecatedSynchronousErrorHandling ? Cc(e) : Kn(e);
}
function th(e) {
  throw e;
}
function yi(e, t) {
  let { onStoppedNotification: n } = de;
  n && bt.setTimeout(() => n(e, t));
}
var nh = { closed: !0, next: Qe, error: th, complete: Qe };
var _t = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function re(e) {
  return e;
}
function rh(...e) {
  return Ei(e);
}
function Ei(e) {
  return e.length === 0
    ? re
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n);
        };
}
var S = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, o) {
      let i = ih(n) ? n : new Ct(n, r, o);
      return (
        Mt(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          );
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = _c(r)),
        new r((o, i) => {
          let s = new Ct({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                i(c), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [_t]() {
      return this;
    }
    pipe(...n) {
      return Ei(n)(this);
    }
    toPromise(n) {
      return (
        (n = _c(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i)
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function _c(e) {
  var t;
  return (t = e ?? de.Promise) !== null && t !== void 0 ? t : Promise;
}
function oh(e) {
  return e && D(e.next) && D(e.error) && D(e.complete);
}
function ih(e) {
  return (e && e instanceof Ye) || (oh(e) && Yn(e));
}
function Ii(e) {
  return D(e?.lift);
}
function _(e) {
  return (t) => {
    if (Ii(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function M(e, t, n, r, o) {
  return new Di(e, t, n, r, o);
}
var Di = class extends Ye {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              t.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              t.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
function wi() {
  return _((e, t) => {
    let n = null;
    e._refCount++;
    let r = M(t, void 0, void 0, void 0, () => {
      if (!e || e._refCount <= 0 || 0 < --e._refCount) {
        n = null;
        return;
      }
      let o = e._connection,
        i = n;
      (n = null), o && (!i || o === i) && o.unsubscribe(), t.unsubscribe();
    });
    e.subscribe(r), r.closed || (n = e.connect());
  });
}
var bi = class extends S {
  constructor(t, n) {
    super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Ii(t) && (this.lift = t.lift);
  }
  _subscribe(t) {
    return this.getSubject().subscribe(t);
  }
  getSubject() {
    let t = this._subject;
    return (
      (!t || t.isStopped) && (this._subject = this.subjectFactory()),
      this._subject
    );
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: t } = this;
    (this._subject = this._connection = null), t?.unsubscribe();
  }
  connect() {
    let t = this._connection;
    if (!t) {
      t = this._connection = new V();
      let n = this.getSubject();
      t.add(
        this.source.subscribe(
          M(
            n,
            void 0,
            () => {
              this._teardown(), n.complete();
            },
            (r) => {
              this._teardown(), n.error(r);
            },
            () => this._teardown()
          )
        )
      ),
        t.closed && ((this._connection = null), (t = V.EMPTY));
    }
    return t;
  }
  refCount() {
    return wi()(this);
  }
};
var Tc = wt(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var ve = (() => {
    class e extends S {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new Xn(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new Tc();
      }
      next(n) {
        Mt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        Mt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        Mt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? hi
          : ((this.currentObservers = null),
            i.push(n),
            new V(() => {
              (this.currentObservers = null), Ge(i, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new S();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new Xn(t, n)), e;
  })(),
  Xn = class extends ve {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n);
    }
    next(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : hi;
    }
  };
var fn = class extends ve {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return !n.closed && t.next(this._value), n;
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return this._throwIfClosed(), r;
  }
  next(t) {
    super.next((this._value = t));
  }
};
var pn = {
  now() {
    return (pn.delegate || Date).now();
  },
  delegate: void 0,
};
var Mi = class extends ve {
  constructor(t = 1 / 0, n = 1 / 0, r = pn) {
    super(),
      (this._bufferSize = t),
      (this._windowTime = n),
      (this._timestampProvider = r),
      (this._buffer = []),
      (this._infiniteTimeWindow = !0),
      (this._infiniteTimeWindow = n === 1 / 0),
      (this._bufferSize = Math.max(1, t)),
      (this._windowTime = Math.max(1, n));
  }
  next(t) {
    let {
      isStopped: n,
      _buffer: r,
      _infiniteTimeWindow: o,
      _timestampProvider: i,
      _windowTime: s,
    } = this;
    n || (r.push(t), !o && r.push(i.now() + s)),
      this._trimBuffer(),
      super.next(t);
  }
  _subscribe(t) {
    this._throwIfClosed(), this._trimBuffer();
    let n = this._innerSubscribe(t),
      { _infiniteTimeWindow: r, _buffer: o } = this,
      i = o.slice();
    for (let s = 0; s < i.length && !t.closed; s += r ? 1 : 2) t.next(i[s]);
    return this._checkFinalizedStatuses(t), n;
  }
  _trimBuffer() {
    let {
        _bufferSize: t,
        _timestampProvider: n,
        _buffer: r,
        _infiniteTimeWindow: o,
      } = this,
      i = (o ? 1 : 2) * t;
    if ((t < 1 / 0 && i < r.length && r.splice(0, r.length - i), !o)) {
      let s = n.now(),
        a = 0;
      for (let c = 1; c < r.length && r[c] <= s; c += 2) a = c;
      a && r.splice(0, a + 1);
    }
  }
};
var er = class extends V {
  constructor(t, n) {
    super();
  }
  schedule(t, n = 0) {
    return this;
  }
};
var hn = {
  setInterval(e, t, ...n) {
    let { delegate: r } = hn;
    return r?.setInterval ? r.setInterval(e, t, ...n) : setInterval(e, t, ...n);
  },
  clearInterval(e) {
    let { delegate: t } = hn;
    return (t?.clearInterval || clearInterval)(e);
  },
  delegate: void 0,
};
var tr = class extends er {
  constructor(t, n) {
    super(t, n), (this.scheduler = t), (this.work = n), (this.pending = !1);
  }
  schedule(t, n = 0) {
    var r;
    if (this.closed) return this;
    this.state = t;
    let o = this.id,
      i = this.scheduler;
    return (
      o != null && (this.id = this.recycleAsyncId(i, o, n)),
      (this.pending = !0),
      (this.delay = n),
      (this.id =
        (r = this.id) !== null && r !== void 0
          ? r
          : this.requestAsyncId(i, this.id, n)),
      this
    );
  }
  requestAsyncId(t, n, r = 0) {
    return hn.setInterval(t.flush.bind(t, this), r);
  }
  recycleAsyncId(t, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n;
    n != null && hn.clearInterval(n);
  }
  execute(t, n) {
    if (this.closed) return new Error("executing a cancelled action");
    this.pending = !1;
    let r = this._execute(t, n);
    if (r) return r;
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(t, n) {
    let r = !1,
      o;
    try {
      this.work(t);
    } catch (i) {
      (r = !0), (o = i || new Error("Scheduled action threw falsy error"));
    }
    if (r) return this.unsubscribe(), o;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: t, scheduler: n } = this,
        { actions: r } = n;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        Ge(r, this),
        t != null && (this.id = this.recycleAsyncId(n, t, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var Tt = class e {
  constructor(t, n = e.now) {
    (this.schedulerActionCtor = t), (this.now = n);
  }
  schedule(t, n = 0, r) {
    return new this.schedulerActionCtor(this, t).schedule(r, n);
  }
};
Tt.now = pn.now;
var nr = class extends Tt {
  constructor(t, n = Tt.now) {
    super(t, n), (this.actions = []), (this._active = !1);
  }
  flush(t) {
    let { actions: n } = this;
    if (this._active) {
      n.push(t);
      return;
    }
    let r;
    this._active = !0;
    do if ((r = t.execute(t.state, t.delay))) break;
    while ((t = n.shift()));
    if (((this._active = !1), r)) {
      for (; (t = n.shift()); ) t.unsubscribe();
      throw r;
    }
  }
};
var Ci = new nr(tr),
  xc = Ci;
var gn = new S((e) => e.complete());
function rr(e) {
  return e && D(e.schedule);
}
function Nc(e) {
  return e[e.length - 1];
}
function or(e) {
  return D(Nc(e)) ? e.pop() : void 0;
}
function Le(e) {
  return rr(Nc(e)) ? e.pop() : void 0;
}
function Oc(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(u) {
      try {
        l(r.next(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      try {
        l(r.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? i(u.value) : o(u.value).then(a, c);
    }
    l((r = r.apply(e, t || [])).next());
  });
}
function Sc(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function Ke(e) {
  return this instanceof Ke ? ((this.v = e), this) : new Ke(e);
}
function Rc(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype
    )),
    a("next"),
    a("throw"),
    a("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (h) {
      return Promise.resolve(h).then(f, d);
    };
  }
  function a(f, h) {
    r[f] &&
      ((o[f] = function (g) {
        return new Promise(function (R, N) {
          i.push([f, g, R, N]) > 1 || c(f, g);
        });
      }),
      h && (o[f] = h(o[f])));
  }
  function c(f, h) {
    try {
      l(r[f](h));
    } catch (g) {
      p(i[0][3], g);
    }
  }
  function l(f) {
    f.value instanceof Ke
      ? Promise.resolve(f.value.v).then(u, d)
      : p(i[0][2], f);
  }
  function u(f) {
    c("next", f);
  }
  function d(f) {
    c("throw", f);
  }
  function p(f, h) {
    f(h), i.shift(), i.length && c(i[0][0], i[0][1]);
  }
}
function kc(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Sc == "function" ? Sc(e) : e[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = e[i](s)), o(a, c, s.done, s.value);
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (l) {
      i({ value: l, done: a });
    }, s);
  }
}
var ir = (e) => e && typeof e.length == "number" && typeof e != "function";
function sr(e) {
  return D(e?.then);
}
function ar(e) {
  return D(e[_t]);
}
function cr(e) {
  return Symbol.asyncIterator && D(e?.[Symbol.asyncIterator]);
}
function lr(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function sh() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var ur = sh();
function dr(e) {
  return D(e?.[ur]);
}
function fr(e) {
  return Rc(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield Ke(n.read());
        if (o) return yield Ke(void 0);
        yield yield Ke(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function pr(e) {
  return D(e?.getReader);
}
function F(e) {
  if (e instanceof S) return e;
  if (e != null) {
    if (ar(e)) return ah(e);
    if (ir(e)) return ch(e);
    if (sr(e)) return lh(e);
    if (cr(e)) return Ac(e);
    if (dr(e)) return uh(e);
    if (pr(e)) return dh(e);
  }
  throw lr(e);
}
function ah(e) {
  return new S((t) => {
    let n = e[_t]();
    if (D(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function ch(e) {
  return new S((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function lh(e) {
  return new S((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n)
    ).then(null, Kn);
  });
}
function uh(e) {
  return new S((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function Ac(e) {
  return new S((t) => {
    fh(e, t).catch((n) => t.error(n));
  });
}
function dh(e) {
  return Ac(fr(e));
}
function fh(e, t) {
  var n, r, o, i;
  return Oc(this, void 0, void 0, function* () {
    try {
      for (n = kc(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function Y(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function hr(e, t = 0) {
  return _((n, r) => {
    n.subscribe(
      M(
        r,
        (o) => Y(r, e, () => r.next(o), t),
        () => Y(r, e, () => r.complete(), t),
        (o) => Y(r, e, () => r.error(o), t)
      )
    );
  });
}
function gr(e, t = 0) {
  return _((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function Pc(e, t) {
  return F(e).pipe(gr(t), hr(t));
}
function Lc(e, t) {
  return F(e).pipe(gr(t), hr(t));
}
function Fc(e, t) {
  return new S((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function Vc(e, t) {
  return new S((n) => {
    let r;
    return (
      Y(n, t, () => {
        (r = e[ur]()),
          Y(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0
          );
      }),
      () => D(r?.return) && r.return()
    );
  });
}
function mr(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new S((n) => {
    Y(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      Y(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function jc(e, t) {
  return mr(fr(e), t);
}
function Hc(e, t) {
  if (e != null) {
    if (ar(e)) return Pc(e, t);
    if (ir(e)) return Fc(e, t);
    if (sr(e)) return Lc(e, t);
    if (cr(e)) return mr(e, t);
    if (dr(e)) return Vc(e, t);
    if (pr(e)) return jc(e, t);
  }
  throw lr(e);
}
function Fe(e, t) {
  return t ? Hc(e, t) : F(e);
}
function ph(...e) {
  let t = Le(e);
  return Fe(e, t);
}
function hh(e, t) {
  let n = D(e) ? e : () => e,
    r = (o) => o.error(n());
  return new S(t ? (o) => t.schedule(r, 0, o) : r);
}
function gh(e) {
  return !!e && (e instanceof S || (D(e.lift) && D(e.subscribe)));
}
var Je = wt(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function Bc(e) {
  return e instanceof Date && !isNaN(e);
}
function Ve(e, t) {
  return _((n, r) => {
    let o = 0;
    n.subscribe(
      M(r, (i) => {
        r.next(e.call(t, i, o++));
      })
    );
  });
}
var { isArray: mh } = Array;
function yh(e, t) {
  return mh(t) ? e(...t) : e(t);
}
function yr(e) {
  return Ve((t) => yh(e, t));
}
var { isArray: vh } = Array,
  { getPrototypeOf: Eh, prototype: Ih, keys: Dh } = Object;
function vr(e) {
  if (e.length === 1) {
    let t = e[0];
    if (vh(t)) return { args: t, keys: null };
    if (wh(t)) {
      let n = Dh(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function wh(e) {
  return e && typeof e == "object" && Eh(e) === Ih;
}
function Er(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function bh(...e) {
  let t = Le(e),
    n = or(e),
    { args: r, keys: o } = vr(e);
  if (r.length === 0) return Fe([], t);
  let i = new S(Mh(r, t, o ? (s) => Er(o, s) : re));
  return n ? i.pipe(yr(n)) : i;
}
function Mh(e, t, n = re) {
  return (r) => {
    $c(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          $c(
            t,
            () => {
              let l = Fe(e[c], t),
                u = !1;
              l.subscribe(
                M(
                  r,
                  (d) => {
                    (i[c] = d), u || ((u = !0), a--), a || r.next(n(i.slice()));
                  },
                  () => {
                    --s || r.complete();
                  }
                )
              );
            },
            r
          );
      },
      r
    );
  };
}
function $c(e, t, n) {
  e ? Y(n, e, t) : t();
}
function Uc(e, t, n, r, o, i, s, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    p = () => {
      d && !c.length && !l && t.complete();
    },
    f = (g) => (l < r ? h(g) : c.push(g)),
    h = (g) => {
      i && t.next(g), l++;
      let R = !1;
      F(n(g, u++)).subscribe(
        M(
          t,
          (N) => {
            o?.(N), i ? f(N) : t.next(N);
          },
          () => {
            R = !0;
          },
          void 0,
          () => {
            if (R)
              try {
                for (l--; c.length && l < r; ) {
                  let N = c.shift();
                  s ? Y(t, s, () => h(N)) : h(N);
                }
                p();
              } catch (N) {
                t.error(N);
              }
          }
        )
      );
    };
  return (
    e.subscribe(
      M(t, f, () => {
        (d = !0), p();
      })
    ),
    () => {
      a?.();
    }
  );
}
function Xe(e, t, n = 1 / 0) {
  return D(t)
    ? Xe((r, o) => Ve((i, s) => t(r, i, o, s))(F(e(r, o))), n)
    : (typeof t == "number" && (n = t), _((r, o) => Uc(r, o, e, n)));
}
function _i(e = 1 / 0) {
  return Xe(re, e);
}
function qc() {
  return _i(1);
}
function Ir(...e) {
  return qc()(Fe(e, Le(e)));
}
function Ch(e) {
  return new S((t) => {
    F(e()).subscribe(t);
  });
}
function _h(...e) {
  let t = or(e),
    { args: n, keys: r } = vr(e),
    o = new S((i) => {
      let { length: s } = n;
      if (!s) {
        i.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        l = s;
      for (let u = 0; u < s; u++) {
        let d = !1;
        F(n[u]).subscribe(
          M(
            i,
            (p) => {
              d || ((d = !0), l--), (a[u] = p);
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (l || i.next(r ? Er(r, a) : a), i.complete());
            }
          )
        );
      }
    });
  return t ? o.pipe(yr(t)) : o;
}
function Wc(e = 0, t, n = xc) {
  let r = -1;
  return (
    t != null && (rr(t) ? (n = t) : (r = t)),
    new S((o) => {
      let i = Bc(e) ? +e - n.now() : e;
      i < 0 && (i = 0);
      let s = 0;
      return n.schedule(function () {
        o.closed ||
          (o.next(s++), 0 <= r ? this.schedule(void 0, r) : o.complete());
      }, i);
    })
  );
}
function Th(e = 0, t = Ci) {
  return e < 0 && (e = 0), Wc(e, e, t);
}
function xt(e, t) {
  return _((n, r) => {
    let o = 0;
    n.subscribe(M(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function zc(e) {
  return _((t, n) => {
    let r = null,
      o = !1,
      i;
    (r = t.subscribe(
      M(n, void 0, void 0, (s) => {
        (i = F(e(s, zc(e)(t)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
      })
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n));
  });
}
function Gc(e, t, n, r, o) {
  return (i, s) => {
    let a = n,
      c = t,
      l = 0;
    i.subscribe(
      M(
        s,
        (u) => {
          let d = l++;
          (c = a ? e(c, u, d) : ((a = !0), u)), r && s.next(c);
        },
        o &&
          (() => {
            a && s.next(c), s.complete();
          })
      )
    );
  };
}
function xh(e, t) {
  return D(t) ? Xe(e, t, 1) : Xe(e, 1);
}
function Nh(e) {
  return _((t, n) => {
    let r = !1,
      o = null,
      i = null,
      s = () => {
        if ((i?.unsubscribe(), (i = null), r)) {
          r = !1;
          let a = o;
          (o = null), n.next(a);
        }
      };
    t.subscribe(
      M(
        n,
        (a) => {
          i?.unsubscribe(),
            (r = !0),
            (o = a),
            (i = M(n, s, Qe)),
            F(e(a)).subscribe(i);
        },
        () => {
          s(), n.complete();
        },
        void 0,
        () => {
          o = i = null;
        }
      )
    );
  });
}
function mn(e) {
  return _((t, n) => {
    let r = !1;
    t.subscribe(
      M(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => {
          r || n.next(e), n.complete();
        }
      )
    );
  });
}
function Ti(e) {
  return e <= 0
    ? () => gn
    : _((t, n) => {
        let r = 0;
        t.subscribe(
          M(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          })
        );
      });
}
function Dr(e = Sh) {
  return _((t, n) => {
    let r = !1;
    t.subscribe(
      M(
        n,
        (o) => {
          (r = !0), n.next(o);
        },
        () => (r ? n.complete() : n.error(e()))
      )
    );
  });
}
function Sh() {
  return new Je();
}
function Oh(e) {
  return _((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Rh(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? xt((o, i) => e(o, i, r)) : re,
      Ti(1),
      n ? mn(t) : Dr(() => new Je())
    );
}
function xi(e) {
  return e <= 0
    ? () => gn
    : _((t, n) => {
        let r = [];
        t.subscribe(
          M(
            n,
            (o) => {
              r.push(o), e < r.length && r.shift();
            },
            () => {
              for (let o of r) n.next(o);
              n.complete();
            },
            void 0,
            () => {
              r = null;
            }
          )
        );
      });
}
function kh(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? xt((o, i) => e(o, i, r)) : re,
      xi(1),
      n ? mn(t) : Dr(() => new Je())
    );
}
function Ah(e, t) {
  return _(Gc(e, t, arguments.length >= 2, !0));
}
function Ph(...e) {
  let t = Le(e);
  return _((n, r) => {
    (t ? Ir(e, n, t) : Ir(e, n)).subscribe(r);
  });
}
function Lh(e, t) {
  return _((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      M(
        r,
        (c) => {
          o?.unsubscribe();
          let l = 0,
            u = i++;
          F(e(c, u)).subscribe(
            (o = M(
              r,
              (d) => r.next(t ? t(c, d, u, l++) : d),
              () => {
                (o = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
function Fh(e) {
  return _((t, n) => {
    F(e).subscribe(M(n, () => n.complete(), Qe)), !n.closed && t.subscribe(n);
  });
}
function Qc(e, t, n) {
  let r = D(e) || t || n ? { next: e, error: t, complete: n } : e;
  return r
    ? _((o, i) => {
        var s;
        (s = r.subscribe) === null || s === void 0 || s.call(r);
        let a = !0;
        o.subscribe(
          M(
            i,
            (c) => {
              var l;
              (l = r.next) === null || l === void 0 || l.call(r, c), i.next(c);
            },
            () => {
              var c;
              (a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                i.complete();
            },
            (c) => {
              var l;
              (a = !1),
                (l = r.error) === null || l === void 0 || l.call(r, c),
                i.error(c);
            },
            () => {
              var c, l;
              a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (l = r.finalize) === null || l === void 0 || l.call(r);
            }
          )
        );
      })
    : re;
}
var ki = { JSACTION: "jsaction" },
  Ai = { JSACTION: "__jsaction", OWNER: "__owner" },
  Jc = {};
function Vh(e) {
  return e[Ai.JSACTION];
}
function Zc(e, t) {
  e[Ai.JSACTION] = t;
}
function jh(e) {
  return Jc[e];
}
function Hh(e, t) {
  Jc[e] = t;
}
var m = {
    CLICK: "click",
    CLICKMOD: "clickmod",
    DBLCLICK: "dblclick",
    FOCUS: "focus",
    FOCUSIN: "focusin",
    BLUR: "blur",
    FOCUSOUT: "focusout",
    SUBMIT: "submit",
    KEYDOWN: "keydown",
    KEYPRESS: "keypress",
    KEYUP: "keyup",
    MOUSEOVER: "mouseover",
    MOUSEOUT: "mouseout",
    MOUSEENTER: "mouseenter",
    MOUSELEAVE: "mouseleave",
    POINTEROVER: "pointerover",
    POINTEROUT: "pointerout",
    POINTERENTER: "pointerenter",
    POINTERLEAVE: "pointerleave",
    ERROR: "error",
    LOAD: "load",
    TOUCHSTART: "touchstart",
    TOUCHEND: "touchend",
    TOUCHMOVE: "touchmove",
    TOGGLE: "toggle",
  },
  Bh = [m.MOUSEENTER, m.MOUSELEAVE, "pointerenter", "pointerleave"],
  bN = [
    m.CLICK,
    m.DBLCLICK,
    m.FOCUSIN,
    m.FOCUSOUT,
    m.KEYDOWN,
    m.KEYUP,
    m.KEYPRESS,
    m.MOUSEOVER,
    m.MOUSEOUT,
    m.SUBMIT,
    m.TOUCHSTART,
    m.TOUCHEND,
    m.TOUCHMOVE,
    "touchcancel",
    "auxclick",
    "change",
    "compositionstart",
    "compositionupdate",
    "compositionend",
    "beforeinput",
    "input",
    "select",
    "copy",
    "cut",
    "paste",
    "mousedown",
    "mouseup",
    "wheel",
    "contextmenu",
    "dragover",
    "dragenter",
    "dragleave",
    "drop",
    "dragstart",
    "dragend",
    "pointerdown",
    "pointermove",
    "pointerup",
    "pointercancel",
    "pointerover",
    "pointerout",
    "gotpointercapture",
    "lostpointercapture",
    "ended",
    "loadedmetadata",
    "pagehide",
    "pageshow",
    "visibilitychange",
    "beforematch",
  ],
  $h = [m.FOCUS, m.BLUR, m.ERROR, m.LOAD, m.TOGGLE],
  Pi = (e) => $h.indexOf(e) >= 0;
function Uh(e) {
  return e === m.MOUSEENTER
    ? m.MOUSEOVER
    : e === m.MOUSELEAVE
      ? m.MOUSEOUT
      : e === m.POINTERENTER
        ? m.POINTEROVER
        : e === m.POINTERLEAVE
          ? m.POINTEROUT
          : e;
}
function qh(e, t, n, r) {
  let o = !1;
  Pi(t) && (o = !0);
  let i = typeof r == "boolean" ? { capture: o, passive: r } : o;
  return (
    e.addEventListener(t, n, i),
    { eventType: t, handler: n, capture: o, passive: r }
  );
}
function Wh(e, t) {
  if (e.removeEventListener) {
    let n = typeof t.passive == "boolean" ? { capture: t.capture } : t.capture;
    e.removeEventListener(t.eventType, t.handler, n);
  } else e.detachEvent && e.detachEvent(`on${t.eventType}`, t.handler);
}
function zh(e) {
  e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
}
var Yc = typeof navigator < "u" && /Macintosh/.test(navigator.userAgent);
function Gh(e) {
  return e.which === 2 || (e.which == null && e.button === 4);
}
function Qh(e) {
  return (Yc && e.metaKey) || (!Yc && e.ctrlKey) || Gh(e) || e.shiftKey;
}
function Zh(e, t, n) {
  let r = e.relatedTarget;
  return (
    ((e.type === m.MOUSEOVER && t === m.MOUSEENTER) ||
      (e.type === m.MOUSEOUT && t === m.MOUSELEAVE) ||
      (e.type === m.POINTEROVER && t === m.POINTERENTER) ||
      (e.type === m.POINTEROUT && t === m.POINTERLEAVE)) &&
    (!r || (r !== n && !n.contains(r)))
  );
}
function Yh(e, t) {
  let n = {};
  for (let r in e) {
    if (r === "srcElement" || r === "target") continue;
    let o = r,
      i = e[o];
    typeof i != "function" && (n[o] = i);
  }
  return (
    e.type === m.MOUSEOVER
      ? (n.type = m.MOUSEENTER)
      : e.type === m.MOUSEOUT
        ? (n.type = m.MOUSELEAVE)
        : e.type === m.POINTEROVER
          ? (n.type = m.POINTERENTER)
          : (n.type = m.POINTERLEAVE),
    (n.target = n.srcElement = t),
    (n.bubbles = !1),
    (n._originalEvent = e),
    n
  );
}
var Kh = typeof navigator < "u" && /iPhone|iPad|iPod/.test(navigator.userAgent),
  Cr = class {
    element;
    handlerInfos = [];
    constructor(t) {
      this.element = t;
    }
    addEventListener(t, n, r) {
      Kh && (this.element.style.cursor = "pointer"),
        this.handlerInfos.push(qh(this.element, t, n(this.element), r));
    }
    cleanUp() {
      for (let t = 0; t < this.handlerInfos.length; t++)
        Wh(this.element, this.handlerInfos[t]);
      this.handlerInfos = [];
    }
  },
  Jh = { EVENT_ACTION_SEPARATOR: ":" };
function je(e) {
  return e.eventType;
}
function Li(e, t) {
  e.eventType = t;
}
function br(e) {
  return e.event;
}
function Xc(e, t) {
  e.event = t;
}
function el(e) {
  return e.targetElement;
}
function tl(e, t) {
  e.targetElement = t;
}
function nl(e) {
  return e.eic;
}
function Xh(e, t) {
  e.eic = t;
}
function eg(e) {
  return e.timeStamp;
}
function tg(e, t) {
  e.timeStamp = t;
}
function Mr(e) {
  return e.eia;
}
function rl(e, t, n) {
  e.eia = [t, n];
}
function Ni(e) {
  e.eia = void 0;
}
function wr(e) {
  return e[1];
}
function ng(e) {
  return e.eirp;
}
function ol(e, t) {
  e.eirp = t;
}
function il(e) {
  return e.eir;
}
function sl(e, t) {
  e.eir = t;
}
function al(e) {
  return {
    eventType: e.eventType,
    event: e.event,
    targetElement: e.targetElement,
    eic: e.eic,
    eia: e.eia,
    timeStamp: e.timeStamp,
    eirp: e.eirp,
    eiack: e.eiack,
    eir: e.eir,
  };
}
function rg(e, t, n, r, o, i, s, a) {
  return {
    eventType: e,
    event: t,
    targetElement: n,
    eic: r,
    timeStamp: o,
    eia: i,
    eirp: s,
    eiack: a,
  };
}
var Si = class e {
    eventInfo;
    constructor(t) {
      this.eventInfo = t;
    }
    getEventType() {
      return je(this.eventInfo);
    }
    setEventType(t) {
      Li(this.eventInfo, t);
    }
    getEvent() {
      return br(this.eventInfo);
    }
    setEvent(t) {
      Xc(this.eventInfo, t);
    }
    getTargetElement() {
      return el(this.eventInfo);
    }
    setTargetElement(t) {
      tl(this.eventInfo, t);
    }
    getContainer() {
      return nl(this.eventInfo);
    }
    setContainer(t) {
      Xh(this.eventInfo, t);
    }
    getTimestamp() {
      return eg(this.eventInfo);
    }
    setTimestamp(t) {
      tg(this.eventInfo, t);
    }
    getAction() {
      let t = Mr(this.eventInfo);
      if (t) return { name: t[0], element: t[1] };
    }
    setAction(t) {
      if (!t) {
        Ni(this.eventInfo);
        return;
      }
      rl(this.eventInfo, t.name, t.element);
    }
    getIsReplay() {
      return ng(this.eventInfo);
    }
    setIsReplay(t) {
      ol(this.eventInfo, t);
    }
    getResolved() {
      return il(this.eventInfo);
    }
    setResolved(t) {
      sl(this.eventInfo, t);
    }
    clone() {
      return new e(al(this.eventInfo));
    }
  },
  og = {},
  ig = /\s*;\s*/,
  sg = m.CLICK,
  Oi = class {
    a11yClickSupport = !1;
    clickModSupport = !0;
    syntheticMouseEventSupport;
    updateEventInfoForA11yClick = void 0;
    preventDefaultForA11yClick = void 0;
    populateClickOnlyAction = void 0;
    constructor({
      syntheticMouseEventSupport: t = !1,
      clickModSupport: n = !0,
    } = {}) {
      (this.syntheticMouseEventSupport = t), (this.clickModSupport = n);
    }
    resolveEventType(t) {
      this.clickModSupport && je(t) === m.CLICK && Qh(br(t))
        ? Li(t, m.CLICKMOD)
        : this.a11yClickSupport && this.updateEventInfoForA11yClick(t);
    }
    resolveAction(t) {
      il(t) || (this.populateAction(t, el(t)), sl(t, !0));
    }
    resolveParentAction(t) {
      let n = Mr(t),
        r = n && wr(n);
      Ni(t);
      let o = r && this.getParentNode(r);
      o && this.populateAction(t, o);
    }
    populateAction(t, n) {
      let r = n;
      for (
        ;
        r &&
        r !== nl(t) &&
        (r.nodeType === Node.ELEMENT_NODE && this.populateActionOnElement(r, t),
        !Mr(t));

      )
        r = this.getParentNode(r);
      let o = Mr(t);
      if (
        o &&
        (this.a11yClickSupport && this.preventDefaultForA11yClick(t),
        this.syntheticMouseEventSupport &&
          (je(t) === m.MOUSEENTER ||
            je(t) === m.MOUSELEAVE ||
            je(t) === m.POINTERENTER ||
            je(t) === m.POINTERLEAVE))
      )
        if (Zh(br(t), je(t), wr(o))) {
          let i = Yh(br(t), wr(o));
          Xc(t, i), tl(t, wr(o));
        } else Ni(t);
    }
    getParentNode(t) {
      let n = t[Ai.OWNER];
      if (n) return n;
      let r = t.parentNode;
      return r?.nodeName === "#document-fragment" ? (r?.host ?? null) : r;
    }
    populateActionOnElement(t, n) {
      let r = this.parseActions(t),
        o = r[je(n)];
      o !== void 0 && rl(n, o, t),
        this.a11yClickSupport && this.populateClickOnlyAction(t, n, r);
    }
    parseActions(t) {
      let n = Vh(t);
      if (!n) {
        let r = t.getAttribute(ki.JSACTION);
        if (!r) (n = og), Zc(t, n);
        else {
          if (((n = jh(r)), !n)) {
            n = {};
            let o = r.split(ig);
            for (let i = 0; i < o.length; i++) {
              let s = o[i];
              if (!s) continue;
              let a = s.indexOf(Jh.EVENT_ACTION_SEPARATOR),
                c = a !== -1,
                l = c ? s.substr(0, a).trim() : sg,
                u = c ? s.substr(a + 1).trim() : s;
              n[l] = u;
            }
            Hh(r, n);
          }
          Zc(t, n);
        }
      }
      return n;
    }
    addA11yClickSupport(t, n, r) {
      (this.a11yClickSupport = !0),
        (this.updateEventInfoForA11yClick = t),
        (this.preventDefaultForA11yClick = n),
        (this.populateClickOnlyAction = r);
    }
  },
  cl = (function (e) {
    return (
      (e[(e.I_AM_THE_JSACTION_FRAMEWORK = 0)] = "I_AM_THE_JSACTION_FRAMEWORK"),
      e
    );
  })(cl || {}),
  Ri = class {
    dispatchDelegate;
    actionResolver;
    eventReplayer;
    eventReplayScheduled = !1;
    replayEventInfoWrappers = [];
    constructor(t, { actionResolver: n, eventReplayer: r } = {}) {
      (this.dispatchDelegate = t),
        (this.actionResolver = n),
        (this.eventReplayer = r);
    }
    dispatch(t) {
      let n = new Si(t);
      this.actionResolver?.resolveEventType(t),
        this.actionResolver?.resolveAction(t);
      let r = n.getAction();
      if (
        (r && ag(r.element, n) && zh(n.getEvent()),
        this.eventReplayer && n.getIsReplay())
      ) {
        this.scheduleEventInfoWrapperReplay(n);
        return;
      }
      this.dispatchDelegate(n);
    }
    scheduleEventInfoWrapperReplay(t) {
      this.replayEventInfoWrappers.push(t),
        !this.eventReplayScheduled &&
          ((this.eventReplayScheduled = !0),
          Promise.resolve().then(() => {
            (this.eventReplayScheduled = !1),
              this.eventReplayer(this.replayEventInfoWrappers);
          }));
    }
  };
function ag(e, t) {
  return (
    e.tagName === "A" &&
    (t.getEventType() === m.CLICK || t.getEventType() === m.CLICKMOD)
  );
}
var ll = Symbol.for("propagationStopped"),
  Fi = { REPLAY: 101 };
var cg = "`preventDefault` called during event replay.";
var lg = "`composedPath` called during event replay.",
  _r = class {
    dispatchDelegate;
    clickModSupport;
    actionResolver;
    dispatcher;
    constructor(t, n = !0) {
      (this.dispatchDelegate = t),
        (this.clickModSupport = n),
        (this.actionResolver = new Oi({ clickModSupport: n })),
        (this.dispatcher = new Ri(
          (r) => {
            this.dispatchToDelegate(r);
          },
          { actionResolver: this.actionResolver }
        ));
    }
    dispatch(t) {
      this.dispatcher.dispatch(t);
    }
    dispatchToDelegate(t) {
      for (t.getIsReplay() && fg(t), ug(t); t.getAction(); ) {
        if (
          (pg(t),
          (Pi(t.getEventType()) &&
            t.getAction().element !== t.getTargetElement()) ||
            (this.dispatchDelegate(t.getEvent(), t.getAction().name), dg(t)))
        )
          return;
        this.actionResolver.resolveParentAction(t.eventInfo);
      }
    }
  };
function ug(e) {
  let t = e.getEvent(),
    n = e.getEvent().stopPropagation.bind(t),
    r = () => {
      (t[ll] = !0), n();
    };
  et(t, "stopPropagation", r), et(t, "stopImmediatePropagation", r);
}
function dg(e) {
  return !!e.getEvent()[ll];
}
function fg(e) {
  let t = e.getEvent(),
    n = e.getTargetElement(),
    r = t.preventDefault.bind(t);
  et(t, "target", n),
    et(t, "eventPhase", Fi.REPLAY),
    et(t, "preventDefault", () => {
      throw (r(), new Error(cg + ""));
    }),
    et(t, "composedPath", () => {
      throw new Error(lg + "");
    });
}
function pg(e) {
  let t = e.getEvent(),
    n = e.getAction()?.element;
  n && et(t, "currentTarget", n, { configurable: !0 });
}
function et(e, t, n, { configurable: r = !1 } = {}) {
  Object.defineProperty(e, t, { value: n, configurable: r });
}
function ul(e, t) {
  e.ecrd((n) => {
    t.dispatch(n);
  }, cl.I_AM_THE_JSACTION_FRAMEWORK);
}
function hg(e) {
  return e?.q ?? [];
}
function gg(e) {
  e && (Kc(e.c, e.et, e.h), Kc(e.c, e.etc, e.h, !0));
}
function Kc(e, t, n, r) {
  for (let o = 0; o < t.length; o++) e.removeEventListener(t[o], n, r);
}
var mg = !1,
  dl = (() => {
    class e {
      static MOUSE_SPECIAL_SUPPORT = mg;
      containerManager;
      eventHandlers = {};
      browserEventTypeToExtraEventTypes = {};
      dispatcher = null;
      queuedEventInfos = [];
      constructor(n) {
        this.containerManager = n;
      }
      handleEvent(n, r, o) {
        let i = rg(n, r, r.target, o, Date.now());
        this.handleEventInfo(i);
      }
      handleEventInfo(n) {
        if (!this.dispatcher) {
          ol(n, !0), this.queuedEventInfos?.push(n);
          return;
        }
        this.dispatcher(n);
      }
      addEvent(n, r, o) {
        if (
          n in this.eventHandlers ||
          !this.containerManager ||
          (!e.MOUSE_SPECIAL_SUPPORT && Bh.indexOf(n) >= 0)
        )
          return;
        let i = (a, c, l) => {
          this.handleEvent(a, c, l);
        };
        this.eventHandlers[n] = i;
        let s = Uh(r || n);
        if (s !== n) {
          let a = this.browserEventTypeToExtraEventTypes[s] || [];
          a.push(n), (this.browserEventTypeToExtraEventTypes[s] = a);
        }
        this.containerManager.addEventListener(
          s,
          (a) => (c) => {
            i(n, c, a);
          },
          o
        );
      }
      replayEarlyEvents(n = window._ejsa) {
        n && (this.replayEarlyEventInfos(n.q), gg(n), delete window._ejsa);
      }
      replayEarlyEventInfos(n) {
        for (let r = 0; r < n.length; r++) {
          let o = n[r],
            i = this.getEventTypesForBrowserEventType(o.eventType);
          for (let s = 0; s < i.length; s++) {
            let a = al(o);
            Li(a, i[s]), this.handleEventInfo(a);
          }
        }
      }
      getEventTypesForBrowserEventType(n) {
        let r = [];
        return (
          this.eventHandlers[n] && r.push(n),
          this.browserEventTypeToExtraEventTypes[n] &&
            r.push(...this.browserEventTypeToExtraEventTypes[n]),
          r
        );
      }
      handler(n) {
        return this.eventHandlers[n];
      }
      cleanUp() {
        this.containerManager?.cleanUp(),
          (this.containerManager = null),
          (this.eventHandlers = {}),
          (this.browserEventTypeToExtraEventTypes = {}),
          (this.dispatcher = null),
          (this.queuedEventInfos = []);
      }
      registerDispatcher(n, r) {
        this.ecrd(n, r);
      }
      ecrd(n, r) {
        if (((this.dispatcher = n), this.queuedEventInfos?.length)) {
          for (let o = 0; o < this.queuedEventInfos.length; o++)
            this.handleEventInfo(this.queuedEventInfos[o]);
          this.queuedEventInfos = null;
        }
      }
    }
    return e;
  })();
function fl(e, t = window) {
  return hg(t._ejsas?.[e]);
}
function Vi(e, t = window) {
  t._ejsas && (t._ejsas[e] = void 0);
}
var Iu =
    "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss",
  C = class extends Error {
    code;
    constructor(t, n) {
      super(vg(t, n)), (this.code = t);
    }
  };
function yg(e) {
  return `NG0${Math.abs(e)}`;
}
function vg(e, t) {
  return `${yg(e)}${t ? ": " + t : ""}`;
}
var Du = Symbol("InputSignalNode#UNSET"),
  Eg = ne(te({}, Gn), {
    transformFn: void 0,
    applyValueToInputSignal(e, t) {
      un(e, t);
    },
  });
function wu(e, t) {
  let n = Object.create(Eg);
  (n.value = e), (n.transformFn = t?.transform);
  function r() {
    if ((an(n), n.value === Du)) {
      let o = null;
      throw new C(-950, o);
    }
    return n.value;
  }
  return (r[ce] = n), r;
}
function On(e) {
  return { toString: e }.toString();
}
var Tr = "__parameters__";
function Ig(e) {
  return function (...n) {
    if (e) {
      let r = e(...n);
      for (let o in r) this[o] = r[o];
    }
  };
}
function bu(e, t, n) {
  return On(() => {
    let r = Ig(t);
    function o(...i) {
      if (this instanceof o) return r.apply(this, i), this;
      let s = new o(...i);
      return (a.annotation = s), a;
      function a(c, l, u) {
        let d = c.hasOwnProperty(Tr)
          ? c[Tr]
          : Object.defineProperty(c, Tr, { value: [] })[Tr];
        for (; d.length <= u; ) d.push(null);
        return (d[u] = d[u] || []).push(s), c;
      }
    }
    return (o.prototype.ngMetadataName = e), (o.annotationCls = o), o;
  });
}
var He = globalThis;
function A(e) {
  for (let t in e) if (e[t] === A) return t;
  throw Error("Could not find renamed property on target object.");
}
function Dg(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function X(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return `[${e.map(X).join(", ")}]`;
  if (e == null) return "" + e;
  let t = e.overriddenName || e.name;
  if (t) return `${t}`;
  let n = e.toString();
  if (n == null) return "" + n;
  let r = n.indexOf(`
`);
  return r >= 0 ? n.slice(0, r) : n;
}
function os(e, t) {
  return e ? (t ? `${e} ${t}` : e) : t || "";
}
var wg = A({ __forward_ref__: A });
function Mu(e) {
  return (
    (e.__forward_ref__ = Mu),
    (e.toString = function () {
      return X(this());
    }),
    e
  );
}
function W(e) {
  return Cu(e) ? e() : e;
}
function Cu(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(wg) && e.__forward_ref__ === Mu
  );
}
function q(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function tS(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function Do(e) {
  return pl(e, _u) || pl(e, Tu);
}
function nS(e) {
  return Do(e) !== null;
}
function pl(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function bg(e) {
  let t = e && (e[_u] || e[Tu]);
  return t || null;
}
function hl(e) {
  return e && (e.hasOwnProperty(gl) || e.hasOwnProperty(Mg)) ? e[gl] : null;
}
var _u = A({ ɵprov: A }),
  gl = A({ ɵinj: A }),
  Tu = A({ ngInjectableDef: A }),
  Mg = A({ ngInjectorDef: A }),
  x = class {
    _desc;
    ngMetadataName = "InjectionToken";
    ɵprov;
    constructor(t, n) {
      (this._desc = t),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = q({
              token: this,
              providedIn: n.providedIn || "root",
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function xu(e) {
  return e && !!e.ɵproviders;
}
var Cg = A({ ɵcmp: A }),
  _g = A({ ɵdir: A }),
  Tg = A({ ɵpipe: A }),
  xg = A({ ɵmod: A }),
  $r = A({ ɵfac: A }),
  In = A({ __NG_ELEMENT_ID__: A }),
  ml = A({ __NG_ENV_ID__: A });
function ot(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Ng(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
      ? e.type.name || e.type.toString()
      : ot(e);
}
function Nu(e, t) {
  throw new C(-200, e);
}
function pa(e, t) {
  throw new C(-201, !1);
}
var T = (function (e) {
    return (
      (e[(e.Default = 0)] = "Default"),
      (e[(e.Host = 1)] = "Host"),
      (e[(e.Self = 2)] = "Self"),
      (e[(e.SkipSelf = 4)] = "SkipSelf"),
      (e[(e.Optional = 8)] = "Optional"),
      e
    );
  })(T || {}),
  is;
function Su() {
  return is;
}
function K(e) {
  let t = is;
  return (is = e), t;
}
function Ou(e, t, n) {
  let r = Do(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & T.Optional) return null;
  if (t !== void 0) return t;
  pa(e, "Injector");
}
var Sg = {},
  nt = Sg,
  ss = "__NG_DI_FLAG__",
  Ur = class {
    injector;
    constructor(t) {
      this.injector = t;
    }
    retrieve(t, n) {
      let r = n;
      return this.injector.get(t, r.optional ? Qn : nt, r);
    }
  },
  qr = "ngTempTokenPath",
  Og = "ngTokenPath",
  Rg = /\n/gm,
  kg = "\u0275",
  yl = "__source";
function Ag(e, t = T.Default) {
  if (dn() === void 0) throw new C(-203, !1);
  if (dn() === null) return Ou(e, void 0, t);
  {
    let n = dn(),
      r;
    return (
      n instanceof Ur ? (r = n.injector) : (r = n),
      r.get(e, t & T.Optional ? null : void 0, t)
    );
  }
}
function Ue(e, t = T.Default) {
  return (Su() || Ag)(W(e), t);
}
function E(e, t = T.Default) {
  return Ue(e, wo(t));
}
function wo(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function as(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = W(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new C(900, !1);
      let o,
        i = T.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = Pg(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push(Ue(o, i));
    } else t.push(Ue(r));
  }
  return t;
}
function Ru(e, t) {
  return (e[ss] = t), (e.prototype[ss] = t), e;
}
function Pg(e) {
  return e[ss];
}
function Lg(e, t, n, r) {
  let o = e[qr];
  throw (
    (t[yl] && o.unshift(t[yl]),
    (e.message = Fg(
      `
` + e.message,
      o,
      n,
      r
    )),
    (e[Og] = o),
    (e[qr] = null),
    e)
  );
}
function Fg(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == kg
      ? e.slice(2)
      : e;
  let o = X(t);
  if (Array.isArray(t)) o = t.map(X).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : X(a)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
    Rg,
    `
  `
  )}`;
}
var ku = Ru(bu("Optional"), 8);
var Au = Ru(bu("SkipSelf"), 4);
function it(e, t) {
  let n = e.hasOwnProperty($r);
  return n ? e[$r] : null;
}
function Vg(e, t, n) {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let o = e[r],
      i = t[r];
    if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
  }
  return !0;
}
function jg(e) {
  return e.flat(Number.POSITIVE_INFINITY);
}
function ha(e, t) {
  e.forEach((n) => (Array.isArray(n) ? ha(n, t) : t(n)));
}
function Pu(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function Wr(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function Hg(e, t) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(t);
  return n;
}
function Bg(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) e.push(r, e[0]), (e[0] = n);
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      (e[o] = e[i]), o--;
    }
    (e[t] = n), (e[t + 1] = r);
  }
}
function bo(e, t, n) {
  let r = Rn(e, t);
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), Bg(e, r, t, n)), r;
}
function ji(e, t) {
  let n = Rn(e, t);
  if (n >= 0) return e[n | 1];
}
function Rn(e, t) {
  return $g(e, t, 1);
}
function $g(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var Ie = {},
  J = [],
  Vt = new x(""),
  Lu = new x("", -1),
  Fu = new x(""),
  zr = class {
    get(t, n = nt) {
      if (n === nt) {
        let r = new Error(`NullInjectorError: No provider for ${X(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  };
function Vu(e, t) {
  let n = e[xg] || null;
  if (!n && t === !0)
    throw new Error(`Type ${X(e)} does not have '\u0275mod' property.`);
  return n;
}
function qe(e) {
  return e[Cg] || null;
}
function ga(e) {
  return e[_g] || null;
}
function ju(e) {
  return e[Tg] || null;
}
function ma(e) {
  return { ɵproviders: e };
}
function Ug(...e) {
  return { ɵproviders: ya(!0, e), ɵfromNgModule: !0 };
}
function ya(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    ha(t, (s) => {
      let a = s;
      cs(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Hu(o, i),
    n
  );
}
function Hu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    va(o, (i) => {
      t(i, r);
    });
  }
}
function cs(e, t, n, r) {
  if (((e = W(e)), !e)) return !1;
  let o = null,
    i = hl(e),
    s = !i && qe(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = hl(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let l of c) cs(l, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let l;
      try {
        ha(i.imports, (u) => {
          cs(u, t, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && Hu(l, t);
    }
    if (!a) {
      let l = it(o) || (() => new o());
      t({ provide: o, useFactory: l, deps: J }, o),
        t({ provide: Fu, useValue: o, multi: !0 }, o),
        t({ provide: Vt, useValue: () => Ue(o), multi: !0 }, o);
    }
    let c = i.providers;
    if (c != null && !a) {
      let l = e;
      va(c, (u) => {
        t(u, l);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function va(e, t) {
  for (let n of e)
    xu(n) && (n = n.ɵproviders), Array.isArray(n) ? va(n, t) : t(n);
}
var qg = A({ provide: String, useValue: A });
function Bu(e) {
  return e !== null && typeof e == "object" && qg in e;
}
function Wg(e) {
  return !!(e && e.useExisting);
}
function zg(e) {
  return !!(e && e.useFactory);
}
function jt(e) {
  return typeof e == "function";
}
function Gg(e) {
  return !!e.useClass;
}
var $u = new x(""),
  Ar = {},
  vl = {},
  Hi;
function Ea() {
  return Hi === void 0 && (Hi = new zr()), Hi;
}
var _e = class {},
  Dn = class extends _e {
    parent;
    source;
    scopes;
    records = new Map();
    _ngOnDestroyHooks = new Set();
    _onDestroyHooks = [];
    get destroyed() {
      return this._destroyed;
    }
    _destroyed = !1;
    injectorDefTypes;
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        us(t, (s) => this.processProvider(s)),
        this.records.set(Lu, Nt(void 0, this)),
        o.has("environment") && this.records.set(_e, Nt(void 0, this));
      let i = this.records.get($u);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Fu, J, T.Self)));
    }
    retrieve(t, n) {
      let r = n;
      return this.get(t, r.optional ? Qn : nt, r);
    }
    destroy() {
      vn(this), (this._destroyed = !0);
      let t = b(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          b(t);
      }
    }
    onDestroy(t) {
      return (
        vn(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      vn(this);
      let n = Ce(this),
        r = K(void 0),
        o;
      try {
        return t();
      } finally {
        Ce(n), K(r);
      }
    }
    get(t, n = nt, r = T.Default) {
      if ((vn(this), t.hasOwnProperty(ml))) return t[ml](this);
      r = wo(r);
      let o,
        i = Ce(this),
        s = K(void 0);
      try {
        if (!(r & T.SkipSelf)) {
          let c = this.records.get(t);
          if (c === void 0) {
            let l = Jg(t) && Do(t);
            l && this.injectableDefInScope(l)
              ? (c = Nt(ls(t), Ar))
              : (c = null),
              this.records.set(t, c);
          }
          if (c != null) return this.hydrate(t, c);
        }
        let a = r & T.Self ? Ea() : this.parent;
        return (n = r & T.Optional && n === nt ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[qr] = a[qr] || []).unshift(X(t)), i)) throw a;
          return Lg(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        K(s), Ce(i);
      }
    }
    resolveInjectorInitializers() {
      let t = b(null),
        n = Ce(this),
        r = K(void 0),
        o;
      try {
        let i = this.get(Vt, J, T.Self);
        for (let s of i) s();
      } finally {
        Ce(n), K(r), b(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(X(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    processProvider(t) {
      t = W(t);
      let n = jt(t) ? t : W(t && t.provide),
        r = Zg(t);
      if (!jt(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = Nt(void 0, Ar, !0)),
          (o.factory = () => as(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n) {
      let r = b(null);
      try {
        return (
          n.value === vl
            ? Nu(X(t))
            : n.value === Ar && ((n.value = vl), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            Kg(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        b(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = W(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function ls(e) {
  let t = Do(e),
    n = t !== null ? t.factory : it(e);
  if (n !== null) return n;
  if (e instanceof x) throw new C(204, !1);
  if (e instanceof Function) return Qg(e);
  throw new C(204, !1);
}
function Qg(e) {
  if (e.length > 0) throw new C(204, !1);
  let n = bg(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function Zg(e) {
  if (Bu(e)) return Nt(void 0, e.useValue);
  {
    let t = Uu(e);
    return Nt(t, Ar);
  }
}
function Uu(e, t, n) {
  let r;
  if (jt(e)) {
    let o = W(e);
    return it(o) || ls(o);
  } else if (Bu(e)) r = () => W(e.useValue);
  else if (zg(e)) r = () => e.useFactory(...as(e.deps || []));
  else if (Wg(e)) r = () => Ue(W(e.useExisting));
  else {
    let o = W(e && (e.useClass || e.provide));
    if (Yg(e)) r = () => new o(...as(e.deps));
    else return it(o) || ls(o);
  }
  return r;
}
function vn(e) {
  if (e.destroyed) throw new C(205, !1);
}
function Nt(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function Yg(e) {
  return !!e.deps;
}
function Kg(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function Jg(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof x);
}
function us(e, t) {
  for (let n of e)
    Array.isArray(n) ? us(n, t) : n && xu(n) ? us(n.ɵproviders, t) : t(n);
}
function qu(e, t) {
  let n;
  e instanceof Dn ? (vn(e), (n = e)) : (n = new Ur(e));
  let r,
    o = Ce(n),
    i = K(void 0);
  try {
    return t();
  } finally {
    Ce(o), K(i);
  }
}
function Wu() {
  return Su() !== void 0 || dn() != null;
}
function zu(e) {
  if (!Wu()) throw new C(-203, !1);
}
function Xg(e) {
  return typeof e == "function";
}
var se = 0,
  y = 1,
  I = 2,
  U = 3,
  pe = 4,
  ee = 5,
  ue = 6,
  Gr = 7,
  $ = 8,
  Te = 9,
  xe = 10,
  k = 11,
  wn = 12,
  El = 13,
  Gt = 14,
  Q = 15,
  st = 16,
  St = 17,
  Ne = 18,
  Mo = 19,
  Gu = 20,
  $e = 21,
  Bi = 22,
  at = 23,
  le = 24,
  At = 25,
  P = 26,
  Qu = 1,
  Se = 6,
  Oe = 7,
  Qr = 8,
  Ht = 9,
  z = 10;
function he(e) {
  return Array.isArray(e) && typeof e[Qu] == "object";
}
function be(e) {
  return Array.isArray(e) && e[Qu] === !0;
}
function Ia(e) {
  return (e.flags & 4) !== 0;
}
function mt(e) {
  return e.componentOffset > -1;
}
function Co(e) {
  return (e.flags & 1) === 1;
}
function De(e) {
  return !!e.template;
}
function bn(e) {
  return (e[I] & 512) !== 0;
}
function Qt(e) {
  return (e[I] & 256) === 256;
}
var ds = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function Zu(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
var rS = (() => {
  let e = () => Yu;
  return (e.ngInherit = !0), e;
})();
function Yu(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = tm), em;
}
function em() {
  let e = Ju(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === Ie) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function tm(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = Ju(e) || nm(e, { previous: Ie, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[i];
  (a[i] = new ds(l && l.currentValue, n, c === Ie)), Zu(e, t, o, n);
}
var Ku = "__ngSimpleChanges__";
function Ju(e) {
  return e[Ku] || null;
}
function nm(e, t) {
  return (e[Ku] = t);
}
var Il = null;
var O = function (e, t = null, n) {
    Il?.(e, t, n);
  },
  Xu = "svg",
  rm = "math";
function ge(e) {
  for (; Array.isArray(e); ) e = e[se];
  return e;
}
function ed(e, t) {
  return ge(t[e]);
}
function me(e, t) {
  return ge(t[e.index]);
}
function kn(e, t) {
  return e.data[t];
}
function td(e, t) {
  return e[t];
}
function we(e, t) {
  let n = t[e];
  return he(n) ? n : n[se];
}
function om(e) {
  return (e[I] & 4) === 4;
}
function Da(e) {
  return (e[I] & 128) === 128;
}
function im(e) {
  return be(e[U]);
}
function We(e, t) {
  return t == null ? null : e[t];
}
function nd(e) {
  e[St] = 0;
}
function rd(e) {
  e[I] & 1024 || ((e[I] |= 1024), Da(e) && Zt(e));
}
function sm(e, t) {
  for (; e > 0; ) (t = t[Gt]), e--;
  return t;
}
function _o(e) {
  return !!(e[I] & 9216 || e[le]?.dirty);
}
function fs(e) {
  e[xe].changeDetectionScheduler?.notify(8),
    e[I] & 64 && (e[I] |= 1024),
    _o(e) && Zt(e);
}
function Zt(e) {
  e[xe].changeDetectionScheduler?.notify(0);
  let t = ct(e);
  for (; t !== null && !(t[I] & 8192 || ((t[I] |= 8192), !Da(t))); ) t = ct(t);
}
function od(e, t) {
  if (Qt(e)) throw new C(911, !1);
  e[$e] === null && (e[$e] = []), e[$e].push(t);
}
function am(e, t) {
  if (e[$e] === null) return;
  let n = e[$e].indexOf(t);
  n !== -1 && e[$e].splice(n, 1);
}
function ct(e) {
  let t = e[U];
  return be(t) ? t[U] : t;
}
function wa(e) {
  return (e[Gr] ??= []);
}
function ba(e) {
  return (e.cleanup ??= []);
}
function cm(e, t, n, r) {
  let o = wa(t);
  o.push(n), e.firstCreatePass && ba(e).push(r, o.length - 1);
}
var w = { lFrame: ud(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var ps = !1;
function lm() {
  return w.lFrame.elementDepthCount;
}
function um() {
  w.lFrame.elementDepthCount++;
}
function dm() {
  w.lFrame.elementDepthCount--;
}
function Ma() {
  return w.bindingsEnabled;
}
function Yt() {
  return w.skipHydrationRootTNode !== null;
}
function fm(e) {
  return w.skipHydrationRootTNode === e;
}
function pm(e) {
  w.skipHydrationRootTNode = e;
}
function hm() {
  w.skipHydrationRootTNode = null;
}
function v() {
  return w.lFrame.lView;
}
function L() {
  return w.lFrame.tView;
}
function oS(e) {
  return (w.lFrame.contextLView = e), e[$];
}
function iS(e) {
  return (w.lFrame.contextLView = null), e;
}
function G() {
  let e = id();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function id() {
  return w.lFrame.currentTNode;
}
function gm() {
  let e = w.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function yt(e, t) {
  let n = w.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function Ca() {
  return w.lFrame.isParent;
}
function _a() {
  w.lFrame.isParent = !1;
}
function mm() {
  return w.lFrame.contextLView;
}
function sd() {
  return ps;
}
function Zr(e) {
  let t = ps;
  return (ps = e), t;
}
function Me() {
  let e = w.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function ym() {
  return w.lFrame.bindingIndex;
}
function vm(e) {
  return (w.lFrame.bindingIndex = e);
}
function vt() {
  return w.lFrame.bindingIndex++;
}
function Ta(e) {
  let t = w.lFrame,
    n = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), n;
}
function Em() {
  return w.lFrame.inI18n;
}
function Im(e, t) {
  let n = w.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), hs(t);
}
function Dm() {
  return w.lFrame.currentDirectiveIndex;
}
function hs(e) {
  w.lFrame.currentDirectiveIndex = e;
}
function wm(e) {
  let t = w.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function ad() {
  return w.lFrame.currentQueryIndex;
}
function xa(e) {
  w.lFrame.currentQueryIndex = e;
}
function bm(e) {
  let t = e[y];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[ee] : null;
}
function cd(e, t, n) {
  if (n & T.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & T.Host); )
      if (((o = bm(i)), o === null || ((i = i[Gt]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (w.lFrame = ld());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function Na(e) {
  let t = ld(),
    n = e[y];
  (w.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function ld() {
  let e = w.lFrame,
    t = e === null ? null : e.child;
  return t === null ? ud(e) : t;
}
function ud(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function dd() {
  let e = w.lFrame;
  return (w.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var fd = dd;
function Sa() {
  let e = dd();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function Mm(e) {
  return (w.lFrame.contextLView = sm(e, w.lFrame.contextLView))[$];
}
function ke() {
  return w.lFrame.selectedIndex;
}
function lt(e) {
  w.lFrame.selectedIndex = e;
}
function To() {
  let e = w.lFrame;
  return kn(e.tView, e.selectedIndex);
}
function sS() {
  w.lFrame.currentNamespace = Xu;
}
function pd() {
  return w.lFrame.currentNamespace;
}
var hd = !0;
function xo() {
  return hd;
}
function ze(e) {
  hd = e;
}
function Cm(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = Yu(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function Oa(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: l,
        ngOnDestroy: u,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      c && (e.viewHooks ??= []).push(-n, c),
      l &&
        ((e.viewHooks ??= []).push(n, l), (e.viewCheckHooks ??= []).push(n, l)),
      u != null && (e.destroyHooks ??= []).push(n, u);
  }
}
function Pr(e, t, n) {
  gd(e, t, 3, n);
}
function Lr(e, t, n, r) {
  (e[I] & 3) === n && gd(e, t, n, r);
}
function $i(e, t) {
  let n = e[I];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[I] = n));
}
function gd(e, t, n, r) {
  let o = r !== void 0 ? e[St] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == "number") {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      t[c] < 0 && (e[St] += 65536),
        (a < i || i == -1) &&
          (_m(e, n, t, c), (e[St] = (e[St] & 4294901760) + c + 2)),
        c++;
}
function Dl(e, t) {
  O(4, e, t);
  let n = b(null);
  try {
    t.call(e);
  } finally {
    b(n), O(5, e, t);
  }
}
function _m(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[I] >> 14 < e[St] >> 16 &&
      (e[I] & 3) === t &&
      ((e[I] += 16384), Dl(a, i))
    : Dl(a, i);
}
var Pt = -1,
  ut = class {
    factory;
    injectImpl;
    resolving = !1;
    canSeeViewProviders;
    multi;
    componentProviders;
    index;
    providerFactory;
    constructor(t, n, r) {
      (this.factory = t), (this.canSeeViewProviders = n), (this.injectImpl = r);
    }
  };
function Tm(e) {
  return (e.flags & 8) !== 0;
}
function xm(e) {
  return (e.flags & 16) !== 0;
}
function Nm(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      Sm(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function md(e) {
  return e === 3 || e === 4 || e === 6;
}
function Sm(e) {
  return e.charCodeAt(0) === 64;
}
function Bt(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number"
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? wl(e, n, o, null, t[++r])
              : wl(e, n, o, null, null));
      }
    }
  return e;
}
function wl(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === n) {
      o !== null && (e[i + 1] = o);
      return;
    }
    i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    o !== null && e.splice(i++, 0, o);
}
function yd(e) {
  return e !== Pt;
}
function Yr(e) {
  return e & 32767;
}
function Om(e) {
  return e >> 16;
}
function Kr(e, t) {
  let n = Om(e),
    r = t;
  for (; n > 0; ) (r = r[Gt]), n--;
  return r;
}
var gs = !0;
function Jr(e) {
  let t = gs;
  return (gs = e), t;
}
var Rm = 256,
  vd = Rm - 1,
  Ed = 5,
  km = 0,
  Ee = {};
function Am(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(In) && (r = n[In]),
    r == null && (r = n[In] = km++);
  let o = r & vd,
    i = 1 << o;
  t.data[e + (o >> Ed)] |= i;
}
function Xr(e, t) {
  let n = Id(e, t);
  if (n !== -1) return n;
  let r = t[y];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Ui(r.data, e),
    Ui(t, null),
    Ui(r.blueprint, null));
  let o = Ra(e, t),
    i = e.injectorIndex;
  if (yd(o)) {
    let s = Yr(o),
      a = Kr(o, t),
      c = a[y].data;
    for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | c[s + l];
  }
  return (t[i + 8] = o), i;
}
function Ui(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function Id(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Ra(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Cd(o)), r === null)) return Pt;
    if ((n++, (o = o[Gt]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return Pt;
}
function ms(e, t, n) {
  Am(e, t, n);
}
function Pm(e, t) {
  if (t === "class") return e.classes;
  if (t === "style") return e.styles;
  let n = e.attrs;
  if (n) {
    let r = n.length,
      o = 0;
    for (; o < r; ) {
      let i = n[o];
      if (md(i)) break;
      if (i === 0) o = o + 2;
      else if (typeof i == "number")
        for (o++; o < r && typeof n[o] == "string"; ) o++;
      else {
        if (i === t) return n[o + 1];
        o = o + 2;
      }
    }
  }
  return null;
}
function Dd(e, t, n) {
  if (n & T.Optional || e !== void 0) return e;
  pa(t, "NodeInjector");
}
function wd(e, t, n, r) {
  if (
    (n & T.Optional && r === void 0 && (r = null),
    (n & (T.Self | T.Host)) === 0)
  ) {
    let o = e[Te],
      i = K(void 0);
    try {
      return o ? o.get(t, r, n & T.Optional) : Ou(t, r, n & T.Optional);
    } finally {
      K(i);
    }
  }
  return Dd(r, t, n);
}
function bd(e, t, n, r = T.Default, o) {
  if (e !== null) {
    if (t[I] & 2048 && !(r & T.Self)) {
      let s = jm(e, t, n, r, Ee);
      if (s !== Ee) return s;
    }
    let i = Md(e, t, n, r, Ee);
    if (i !== Ee) return i;
  }
  return wd(t, n, r, o);
}
function Md(e, t, n, r, o) {
  let i = Fm(n);
  if (typeof i == "function") {
    if (!cd(t, e, r)) return r & T.Host ? Dd(o, n, r) : wd(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & T.Optional))) pa(n);
      else return s;
    } finally {
      fd();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Id(e, t),
      c = Pt,
      l = r & T.Host ? t[Q][ee] : null;
    for (
      (a === -1 || r & T.SkipSelf) &&
      ((c = a === -1 ? Ra(e, t) : t[a + 8]),
      c === Pt || !Ml(r, !1)
        ? (a = -1)
        : ((s = t[y]), (a = Yr(c)), (t = Kr(c, t))));
      a !== -1;

    ) {
      let u = t[y];
      if (bl(i, a, u.data)) {
        let d = Lm(a, t, n, s, r, l);
        if (d !== Ee) return d;
      }
      (c = t[a + 8]),
        c !== Pt && Ml(r, t[y].data[a + 8] === l) && bl(i, a, t)
          ? ((s = u), (a = Yr(c)), (t = Kr(c, t)))
          : (a = -1);
    }
  }
  return o;
}
function Lm(e, t, n, r, o, i) {
  let s = t[y],
    a = s.data[e + 8],
    c = r == null ? mt(a) && gs : r != s && (a.type & 3) !== 0,
    l = o & T.Host && i === a,
    u = Fr(a, s, n, c, l);
  return u !== null ? Mn(t, s, u, a) : Ee;
}
function Fr(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    c = e.directiveStart,
    l = e.directiveEnd,
    u = i >> 20,
    d = r ? a : a + u,
    p = o ? a + u : l;
  for (let f = d; f < p; f++) {
    let h = s[f];
    if ((f < c && n === h) || (f >= c && h.type === n)) return f;
  }
  if (o) {
    let f = s[c];
    if (f && De(f) && f.type === n) return c;
  }
  return null;
}
function Mn(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (o instanceof ut) {
    let s = o;
    s.resolving && Nu(Ng(i[n]));
    let a = Jr(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      l = s.injectImpl ? K(s.injectImpl) : null,
      u = cd(e, r, T.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Cm(n, i[n], t);
    } finally {
      l !== null && K(l), Jr(a), (s.resolving = !1), fd();
    }
  }
  return o;
}
function Fm(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(In) ? e[In] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & vd : Vm) : t;
}
function bl(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> Ed)] & r);
}
function Ml(e, t) {
  return !(e & T.Self) && !(e & T.Host && t);
}
var rt = class {
  _tNode;
  _lView;
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return bd(this._tNode, this._lView, t, wo(r), n);
  }
};
function Vm() {
  return new rt(G(), v());
}
function aS(e) {
  return On(() => {
    let t = e.prototype.constructor,
      n = t[$r] || ys(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[$r] || ys(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function ys(e) {
  return Cu(e)
    ? () => {
        let t = ys(W(e));
        return t && t();
      }
    : it(e);
}
function jm(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[I] & 2048 && !bn(s); ) {
    let a = Md(i, s, n, r | T.Self, Ee);
    if (a !== Ee) return a;
    let c = i.parent;
    if (!c) {
      let l = s[Gu];
      if (l) {
        let u = l.get(n, Ee, r);
        if (u !== Ee) return u;
      }
      (c = Cd(s)), (s = s[Gt]);
    }
    i = c;
  }
  return o;
}
function Cd(e) {
  let t = e[y],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[ee] : null;
}
function cS(e) {
  return Pm(G(), e);
}
function Cl(e, t = null, n = null, r) {
  let o = _d(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function _d(e, t = null, n = null, r, o = new Set()) {
  let i = [n || J, Ug(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : X(e))),
    new Dn(i, t || Ea(), r || null, o)
  );
}
var dt = class e {
  static THROW_IF_NOT_FOUND = nt;
  static NULL = new zr();
  static create(t, n) {
    if (Array.isArray(t)) return Cl({ name: "" }, n, t, "");
    {
      let r = t.name ?? "";
      return Cl({ name: r }, t.parent, t.providers, r);
    }
  }
  static ɵprov = q({ token: e, providedIn: "any", factory: () => Ue(Lu) });
  static __NG_ELEMENT_ID__ = -1;
};
var Hm = new x("");
Hm.__NG_ELEMENT_ID__ = (e) => {
  let t = G();
  if (t === null) throw new C(204, !1);
  if (t.type & 2) return t.value;
  if (e & T.Optional) return null;
  throw new C(204, !1);
};
var Td = !1,
  No = (() => {
    class e {
      static __NG_ELEMENT_ID__ = Bm;
      static __NG_ENV_ID__ = (n) => n;
    }
    return e;
  })(),
  eo = class extends No {
    _lView;
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return od(this._lView, t), () => am(this._lView, t);
    }
  };
function Bm() {
  return new eo(v());
}
var ft = class {},
  ka = new x("", { providedIn: "root", factory: () => !1 });
var xd = new x(""),
  Nd = new x(""),
  Kt = (() => {
    class e {
      taskId = 0;
      pendingTasks = new Set();
      get _hasPendingTasks() {
        return this.hasPendingTasks.value;
      }
      hasPendingTasks = new fn(!1);
      add() {
        this._hasPendingTasks || this.hasPendingTasks.next(!0);
        let n = this.taskId++;
        return this.pendingTasks.add(n), n;
      }
      has(n) {
        return this.pendingTasks.has(n);
      }
      remove(n) {
        this.pendingTasks.delete(n),
          this.pendingTasks.size === 0 &&
            this._hasPendingTasks &&
            this.hasPendingTasks.next(!1);
      }
      ngOnDestroy() {
        this.pendingTasks.clear(),
          this._hasPendingTasks && this.hasPendingTasks.next(!1);
      }
      static ɵprov = q({
        token: e,
        providedIn: "root",
        factory: () => new e(),
      });
    }
    return e;
  })();
var vs = class extends ve {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = !1) {
      super(),
        (this.__isAsync = t),
        Wu() &&
          ((this.destroyRef = E(No, { optional: !0 }) ?? void 0),
          (this.pendingTasks = E(Kt, { optional: !0 }) ?? void 0));
    }
    emit(t) {
      let n = b(null);
      try {
        super.next(t);
      } finally {
        b(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == "object") {
        let c = t;
        (o = c.next?.bind(c)),
          (i = c.error?.bind(c)),
          (s = c.complete?.bind(c));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return t instanceof V && t.add(a), a;
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          t(n), r !== void 0 && this.pendingTasks?.remove(r);
        });
      };
    }
  },
  Be = vs;
function Cn(...e) {}
function Sd(e) {
  let t, n;
  function r() {
    e = Cn;
    try {
      n !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t);
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      e(), r();
    })),
    typeof requestAnimationFrame == "function" &&
      (n = requestAnimationFrame(() => {
        e(), r();
      })),
    () => r()
  );
}
function _l(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = Cn;
    }
  );
}
var Aa = "isAngularZone",
  to = Aa + "_ID",
  $m = 0,
  ie = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new Be(!1);
    onMicrotaskEmpty = new Be(!1);
    onStable = new Be(!1);
    onError = new Be(!1);
    constructor(t) {
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = Td,
      } = t;
      if (typeof Zone > "u") throw new C(908, !1);
      Zone.assertZonePatched();
      let s = this;
      (s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        Wm(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(Aa) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new C(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new C(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, Um, Cn, Cn);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  Um = {};
function Pa(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function qm(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    Sd(() => {
      (e.callbackScheduled = !1),
        Es(e),
        (e.isCheckStableRunning = !0),
        Pa(e),
        (e.isCheckStableRunning = !1);
    });
  }
  e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    Es(e);
}
function Wm(e) {
  let t = () => {
      qm(e);
    },
    n = $m++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [Aa]: !0, [to]: n, [to + n]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (zm(c)) return r.invokeTask(i, s, a, c);
      try {
        return Tl(e), r.invokeTask(i, s, a, c);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          xl(e);
      }
    },
    onInvoke: (r, o, i, s, a, c, l) => {
      try {
        return Tl(e), r.invoke(i, s, a, c, l);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !Gm(c) &&
          t(),
          xl(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), Es(e), Pa(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function Es(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Tl(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function xl(e) {
  e._nesting--, Pa(e);
}
var Is = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new Be();
  onMicrotaskEmpty = new Be();
  onStable = new Be();
  onError = new Be();
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function zm(e) {
  return Od(e, "__ignore_ng_zone__");
}
function Gm(e) {
  return Od(e, "__scheduler_tick__");
}
function Od(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var pt = class {
    _console = console;
    handleError(t) {
      this._console.error("ERROR", t);
    }
  },
  Qm = new x("", {
    providedIn: "root",
    factory: () => {
      let e = E(ie),
        t = E(pt);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function Nl(e, t) {
  return wu(e, t);
}
function Zm(e) {
  return wu(Du, e);
}
var lS = ((Nl.required = Zm), Nl);
function Ym() {
  return Jt(G(), v());
}
function Jt(e, t) {
  return new So(me(e, t));
}
var So = (() => {
  class e {
    nativeElement;
    constructor(n) {
      this.nativeElement = n;
    }
    static __NG_ELEMENT_ID__ = Ym;
  }
  return e;
})();
function Km(e) {
  return e instanceof So ? e.nativeElement : e;
}
function Jm(e) {
  return typeof e == "function" && e[ce] !== void 0;
}
function uS(e, t) {
  let n = ui(e, t?.equal),
    r = n[ce];
  return (
    (n.set = (o) => un(r, o)),
    (n.update = (o) => di(r, o)),
    (n.asReadonly = Xm.bind(n)),
    n
  );
}
function Xm() {
  let e = this[ce];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    (t[ce] = e), (e.readonlyFn = t);
  }
  return e.readonlyFn;
}
function Rd(e) {
  return Jm(e) && typeof e.set == "function";
}
function ey() {
  return this._results[Symbol.iterator]();
}
var Ds = class {
    _emitDistinctChangesOnly;
    dirty = !0;
    _onDirty = void 0;
    _results = [];
    _changesDetected = !1;
    _changes = void 0;
    length = 0;
    first = void 0;
    last = void 0;
    get changes() {
      return (this._changes ??= new ve());
    }
    constructor(t = !1) {
      this._emitDistinctChangesOnly = t;
    }
    get(t) {
      return this._results[t];
    }
    map(t) {
      return this._results.map(t);
    }
    filter(t) {
      return this._results.filter(t);
    }
    find(t) {
      return this._results.find(t);
    }
    reduce(t, n) {
      return this._results.reduce(t, n);
    }
    forEach(t) {
      this._results.forEach(t);
    }
    some(t) {
      return this._results.some(t);
    }
    toArray() {
      return this._results.slice();
    }
    toString() {
      return this._results.toString();
    }
    reset(t, n) {
      this.dirty = !1;
      let r = jg(t);
      (this._changesDetected = !Vg(this._results, r, n)) &&
        ((this._results = r),
        (this.length = r.length),
        (this.last = r[this.length - 1]),
        (this.first = r[0]));
    }
    notifyOnChanges() {
      this._changes !== void 0 &&
        (this._changesDetected || !this._emitDistinctChangesOnly) &&
        this._changes.next(this);
    }
    onDirty(t) {
      this._onDirty = t;
    }
    setDirty() {
      (this.dirty = !0), this._onDirty?.();
    }
    destroy() {
      this._changes !== void 0 &&
        (this._changes.complete(), this._changes.unsubscribe());
    }
    [Symbol.iterator] = ey;
  },
  ty = "ngSkipHydration",
  ny = "ngskiphydration";
function kd(e) {
  let t = e.mergedAttrs;
  if (t === null) return !1;
  for (let n = 0; n < t.length; n += 2) {
    let r = t[n];
    if (typeof r == "number") return !1;
    if (typeof r == "string" && r.toLowerCase() === ny) return !0;
  }
  return !1;
}
function Ad(e) {
  return e.hasAttribute(ty);
}
function no(e) {
  return (e.flags & 128) === 128;
}
function ry(e) {
  if (no(e)) return !0;
  let t = e.parent;
  for (; t; ) {
    if (no(e) || kd(t)) return !0;
    t = t.parent;
  }
  return !1;
}
var Pd = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(Pd || {}),
  Ld = new Map(),
  oy = 0;
function iy() {
  return oy++;
}
function sy(e) {
  Ld.set(e[Mo], e);
}
function ws(e) {
  Ld.delete(e[Mo]);
}
var Sl = "__ngContext__";
function Xt(e, t) {
  he(t) ? ((e[Sl] = t[Mo]), sy(t)) : (e[Sl] = t);
}
function Fd(e) {
  return jd(e[wn]);
}
function Vd(e) {
  return jd(e[pe]);
}
function jd(e) {
  for (; e !== null && !be(e); ) e = e[pe];
  return e;
}
var bs;
function dS(e) {
  bs = e;
}
function An() {
  if (bs !== void 0) return bs;
  if (typeof document < "u") return document;
  throw new C(210, !1);
}
var ro = new x("", { providedIn: "root", factory: () => ay }),
  ay = "ng",
  cy = new x(""),
  fS = new x("", { providedIn: "platform", factory: () => "unknown" });
var pS = new x(""),
  hS = new x("", {
    providedIn: "root",
    factory: () =>
      An().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
function ly() {
  let e = new Oo();
  return (e.store = uy(An(), E(ro))), e;
}
var Oo = (() => {
  class e {
    static ɵprov = q({ token: e, providedIn: "root", factory: ly });
    store = {};
    onSerializeCallbacks = {};
    get(n, r) {
      return this.store[n] !== void 0 ? this.store[n] : r;
    }
    set(n, r) {
      this.store[n] = r;
    }
    remove(n) {
      delete this.store[n];
    }
    hasKey(n) {
      return this.store.hasOwnProperty(n);
    }
    get isEmpty() {
      return Object.keys(this.store).length === 0;
    }
    onSerialize(n, r) {
      this.onSerializeCallbacks[n] = r;
    }
    toJson() {
      for (let n in this.onSerializeCallbacks)
        if (this.onSerializeCallbacks.hasOwnProperty(n))
          try {
            this.store[n] = this.onSerializeCallbacks[n]();
          } catch (r) {
            console.warn("Exception in onSerialize callback: ", r);
          }
      return JSON.stringify(this.store).replace(/</g, "\\u003C");
    }
  }
  return e;
})();
function uy(e, t) {
  let n = e.getElementById(t + "-state");
  if (n?.textContent)
    try {
      return JSON.parse(n.textContent);
    } catch (r) {
      console.warn("Exception while restoring TransferState for app " + t, r);
    }
  return {};
}
var Hd = "h",
  Bd = "b",
  dy = "f",
  fy = "n",
  py = "e",
  hy = "t",
  La = "c",
  $d = "x",
  oo = "r",
  gy = "i",
  my = "n",
  Ud = "d";
var yy = "di",
  vy = "s",
  Ey = "p";
var xr = new x(""),
  qd = !1,
  Wd = new x("", { providedIn: "root", factory: () => qd });
var zd = new x(""),
  Iy = !1,
  Dy = new x(""),
  Ol = new x("", { providedIn: "root", factory: () => new Map() }),
  Fa = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = "CHANGE_DETECTION"),
      (e[(e.AFTER_NEXT_RENDER = 1)] = "AFTER_NEXT_RENDER"),
      e
    );
  })(Fa || {}),
  Ro = new x(""),
  Rl = new Set();
function Et(e) {
  Rl.has(e) ||
    (Rl.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var Va = (() => {
  class e {
    view;
    node;
    constructor(n, r) {
      (this.view = n), (this.node = r);
    }
    static __NG_ELEMENT_ID__ = wy;
  }
  return e;
})();
function wy() {
  return new Va(v(), G());
}
var Ot = (function (e) {
    return (
      (e[(e.EarlyRead = 0)] = "EarlyRead"),
      (e[(e.Write = 1)] = "Write"),
      (e[(e.MixedReadWrite = 2)] = "MixedReadWrite"),
      (e[(e.Read = 3)] = "Read"),
      e
    );
  })(Ot || {}),
  Gd = (() => {
    class e {
      impl = null;
      execute() {
        this.impl?.execute();
      }
      static ɵprov = q({
        token: e,
        providedIn: "root",
        factory: () => new e(),
      });
    }
    return e;
  })(),
  by = [Ot.EarlyRead, Ot.Write, Ot.MixedReadWrite, Ot.Read],
  My = (() => {
    class e {
      ngZone = E(ie);
      scheduler = E(ft);
      errorHandler = E(pt, { optional: !0 });
      sequences = new Set();
      deferredRegistrations = new Set();
      executing = !1;
      constructor() {
        E(Ro, { optional: !0 });
      }
      execute() {
        let n = this.sequences.size > 0;
        n && O(16), (this.executing = !0);
        for (let r of by)
          for (let o of this.sequences)
            if (!(o.erroredOrDestroyed || !o.hooks[r]))
              try {
                o.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                  this.maybeTrace(() => {
                    let i = o.hooks[r];
                    return i(o.pipelinedValue);
                  }, o.snapshot)
                );
              } catch (i) {
                (o.erroredOrDestroyed = !0), this.errorHandler?.handleError(i);
              }
        this.executing = !1;
        for (let r of this.sequences)
          r.afterRun(), r.once && (this.sequences.delete(r), r.destroy());
        for (let r of this.deferredRegistrations) this.sequences.add(r);
        this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
          this.deferredRegistrations.clear(),
          n && O(17);
      }
      register(n) {
        let { view: r } = n;
        r !== void 0
          ? ((r[At] ??= []).push(n), Zt(r), (r[I] |= 8192))
          : this.executing
            ? this.deferredRegistrations.add(n)
            : this.addSequence(n);
      }
      addSequence(n) {
        this.sequences.add(n), this.scheduler.notify(7);
      }
      unregister(n) {
        this.executing && this.sequences.has(n)
          ? ((n.erroredOrDestroyed = !0),
            (n.pipelinedValue = void 0),
            (n.once = !0))
          : (this.sequences.delete(n), this.deferredRegistrations.delete(n));
      }
      maybeTrace(n, r) {
        return r ? r.run(Fa.AFTER_NEXT_RENDER, n) : n();
      }
      static ɵprov = q({
        token: e,
        providedIn: "root",
        factory: () => new e(),
      });
    }
    return e;
  })(),
  Ms = class {
    impl;
    hooks;
    view;
    once;
    snapshot;
    erroredOrDestroyed = !1;
    pipelinedValue = void 0;
    unregisterOnDestroy;
    constructor(t, n, r, o, i, s = null) {
      (this.impl = t),
        (this.hooks = n),
        (this.view = r),
        (this.once = o),
        (this.snapshot = s),
        (this.unregisterOnDestroy = i?.onDestroy(() => this.destroy()));
    }
    afterRun() {
      (this.erroredOrDestroyed = !1),
        (this.pipelinedValue = void 0),
        this.snapshot?.dispose(),
        (this.snapshot = null);
    }
    destroy() {
      this.impl.unregister(this), this.unregisterOnDestroy?.();
      let t = this.view?.[At];
      t && (this.view[At] = t.filter((n) => n !== this));
    }
  };
function Qd(e, t) {
  !t?.injector && zu(Qd);
  let n = t?.injector ?? E(dt);
  return Et("NgAfterNextRender"), _y(e, n, t, !0);
}
function Cy(e, t) {
  if (e instanceof Function) {
    let n = [void 0, void 0, void 0, void 0];
    return (n[t] = e), n;
  } else return [e.earlyRead, e.write, e.mixedReadWrite, e.read];
}
function _y(e, t, n, r) {
  let o = t.get(Gd);
  o.impl ??= t.get(My);
  let i = t.get(Ro, null, { optional: !0 }),
    s = n?.phase ?? Ot.MixedReadWrite,
    a = n?.manualCleanup !== !0 ? t.get(No) : null,
    c = t.get(Va, null, { optional: !0 }),
    l = new Ms(o.impl, Cy(e, s), c?.view, r, a, i?.snapshot(null));
  return o.impl.register(l), l;
}
var oe = (function (e) {
    return (
      (e[(e.NOT_STARTED = 0)] = "NOT_STARTED"),
      (e[(e.IN_PROGRESS = 1)] = "IN_PROGRESS"),
      (e[(e.COMPLETE = 2)] = "COMPLETE"),
      (e[(e.FAILED = 3)] = "FAILED"),
      e
    );
  })(oe || {}),
  kl = 0,
  Ty = 1,
  B = (function (e) {
    return (
      (e[(e.Placeholder = 0)] = "Placeholder"),
      (e[(e.Loading = 1)] = "Loading"),
      (e[(e.Complete = 2)] = "Complete"),
      (e[(e.Error = 3)] = "Error"),
      e
    );
  })(B || {});
var xy = 0,
  ko = 1;
var Ny = 4,
  Sy = 5;
var Oy = 7,
  Lt = 8,
  Ry = 9,
  Zd = (function (e) {
    return (
      (e[(e.Manual = 0)] = "Manual"),
      (e[(e.Playthrough = 1)] = "Playthrough"),
      e
    );
  })(Zd || {});
function Vr(e, t) {
  let n = Ay(e),
    r = t[n];
  if (r !== null) {
    for (let o of r) o();
    t[n] = null;
  }
}
function ky(e) {
  Vr(1, e), Vr(0, e), Vr(2, e);
}
function Ay(e) {
  let t = Ny;
  return e === 1 ? (t = Sy) : e === 2 && (t = Ry), t;
}
function Yd(e) {
  return e + 1;
}
function Pn(e, t) {
  let n = e[y],
    r = Yd(t.index);
  return e[r];
}
function Ao(e, t) {
  let n = Yd(t.index);
  return e.data[n];
}
function Py(e, t, n) {
  let r = t[y],
    o = Ao(r, n);
  switch (e) {
    case B.Complete:
      return o.primaryTmplIndex;
    case B.Loading:
      return o.loadingTmplIndex;
    case B.Error:
      return o.errorTmplIndex;
    case B.Placeholder:
      return o.placeholderTmplIndex;
    default:
      return null;
  }
}
function Al(e, t) {
  return t === B.Placeholder
    ? (e.placeholderBlockConfig?.[kl] ?? null)
    : t === B.Loading
      ? (e.loadingBlockConfig?.[kl] ?? null)
      : null;
}
function Ly(e) {
  return e.loadingBlockConfig?.[Ty] ?? null;
}
function Pl(e, t) {
  if (!e || e.length === 0) return t;
  let n = new Set(e);
  for (let r of t) n.add(r);
  return e.length === n.size ? e : Array.from(n);
}
function Fy(e, t) {
  let n = t.primaryTmplIndex + P;
  return kn(e, n);
}
var Po = "ngb";
var Vy = (e, t, n) => {
    let r = e,
      o = r.__jsaction_fns ?? new Map(),
      i = o.get(t) ?? [];
    i.push(n), o.set(t, i), (r.__jsaction_fns = o);
  },
  jy = (e, t) => {
    let n = e,
      r = n.getAttribute(Po) ?? "",
      o = t.get(r) ?? new Set();
    o.has(n) || o.add(n), t.set(r, o);
  };
var Hy = (e) => {
    e.removeAttribute(ki.JSACTION),
      e.removeAttribute(Po),
      (e.__jsaction_fns = void 0);
  },
  By = new x("", { providedIn: "root", factory: () => ({}) });
function Kd(e, t) {
  let n = t?.__jsaction_fns?.get(e.type);
  if (!(!n || !t?.isConnected)) for (let r of n) r(e);
}
var ja = new x("");
var $y = "__nghData__",
  Jd = $y,
  Uy = "__nghDeferData__",
  qy = Uy,
  qi = "ngh",
  Wy = "nghm",
  Xd = () => null;
function zy(e, t, n = !1) {
  let r = e.getAttribute(qi);
  if (r == null) return null;
  let [o, i] = r.split("|");
  if (((r = n ? i : o), !r)) return null;
  let s = i ? `|${i}` : "",
    a = n ? o : s,
    c = {};
  if (r !== "") {
    let u = t.get(Oo, null, { optional: !0 });
    u !== null && (c = u.get(Jd, [])[Number(r)]);
  }
  let l = { data: c, firstChild: e.firstChild ?? null };
  return (
    n && ((l.firstChild = e), Lo(l, 0, e.nextSibling)),
    a ? e.setAttribute(qi, a) : e.removeAttribute(qi),
    l
  );
}
function Gy() {
  Xd = zy;
}
function ef(e, t, n = !1) {
  return Xd(e, t, n);
}
function Qy(e) {
  let t = e._lView;
  return t[y].type === 2 ? null : (bn(t) && (t = t[P]), t);
}
function Zy(e) {
  return e.textContent?.replace(/\s/gm, "");
}
function Yy(e) {
  let t = An(),
    n = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, {
      acceptNode(i) {
        let s = Zy(i);
        return s === "ngetn" || s === "ngtns"
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }),
    r,
    o = [];
  for (; (r = n.nextNode()); ) o.push(r);
  for (let i of o)
    i.textContent === "ngetn"
      ? i.replaceWith(t.createTextNode(""))
      : i.remove();
}
function Lo(e, t, n) {
  (e.segmentHeads ??= {}), (e.segmentHeads[t] = n);
}
function Cs(e, t) {
  return e.segmentHeads?.[t] ?? null;
}
function Ky(e) {
  return e.get(Dy, !1, { optional: !0 });
}
function Jy(e, t) {
  let n = e.data,
    r = n[py]?.[t] ?? null;
  return r === null && n[La]?.[t] && (r = Ha(e, t)), r;
}
function tf(e, t) {
  return e.data[La]?.[t] ?? null;
}
function Ha(e, t) {
  let n = tf(e, t) ?? [],
    r = 0;
  for (let o of n) r += o[oo] * (o[$d] ?? 1);
  return r;
}
function Xy(e) {
  if (typeof e.disconnectedNodes > "u") {
    let t = e.data[Ud];
    e.disconnectedNodes = t ? new Set(t) : null;
  }
  return e.disconnectedNodes;
}
function Ln(e, t) {
  if (typeof e.disconnectedNodes > "u") {
    let n = e.data[Ud];
    e.disconnectedNodes = n ? new Set(n) : null;
  }
  return !!Xy(e)?.has(t);
}
function ev(e, t) {
  let n = t.get(ja),
    o = t.get(Oo).get(qy, {}),
    i = !1,
    s = e,
    a = null,
    c = [];
  for (; !i && s; ) {
    i = n.has(s);
    let l = n.hydrating.get(s);
    if (a === null && l != null) {
      a = l.promise;
      break;
    }
    c.unshift(s), (s = o[s][Ey]);
  }
  return { parentBlockPromise: a, hydrationQueue: c };
}
function Wi(e) {
  return (
    !!e && e.nodeType === Node.COMMENT_NODE && e.textContent?.trim() === Wy
  );
}
function Ll(e) {
  for (; e && e.nodeType === Node.TEXT_NODE; ) e = e.previousSibling;
  return e;
}
function tv(e) {
  for (let r of e.body.childNodes) if (Wi(r)) return;
  let t = Ll(e.body.previousSibling);
  if (Wi(t)) return;
  let n = Ll(e.head.lastChild);
  if (!Wi(n)) throw new C(-507, !1);
}
function nf(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = b(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          xa(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      b(r);
    }
  }
}
function _s(e, t, n) {
  xa(0);
  let r = b(null);
  try {
    t(e, n);
  } finally {
    b(r);
  }
}
function Ba(e, t, n) {
  if (Ia(t)) {
    let r = b(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = n[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      b(r);
    }
  }
}
var _n = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(_n || {}),
  Nr;
function nv() {
  if (Nr === void 0 && ((Nr = null), He.trustedTypes))
    try {
      Nr = He.trustedTypes.createPolicy("angular", {
        createHTML: (e) => e,
        createScript: (e) => e,
        createScriptURL: (e) => e,
      });
    } catch {}
  return Nr;
}
function Fo(e) {
  return nv()?.createHTML(e) || e;
}
var Sr;
function rf() {
  if (Sr === void 0 && ((Sr = null), He.trustedTypes))
    try {
      Sr = He.trustedTypes.createPolicy("angular#unsafe-bypass", {
        createHTML: (e) => e,
        createScript: (e) => e,
        createScriptURL: (e) => e,
      });
    } catch {}
  return Sr;
}
function Fl(e) {
  return rf()?.createHTML(e) || e;
}
function Vl(e) {
  return rf()?.createScriptURL(e) || e;
}
var io = class {
  changingThisBreaksApplicationSecurity;
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Iu})`;
  }
};
function en(e) {
  return e instanceof io ? e.changingThisBreaksApplicationSecurity : e;
}
function $a(e, t) {
  let n = rv(e);
  if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${Iu})`);
  }
  return n === t;
}
function rv(e) {
  return (e instanceof io && e.getTypeName()) || null;
}
function ov(e) {
  let t = new xs(e);
  return iv() ? new Ts(t) : t;
}
var Ts = class {
    inertDocumentHelper;
    constructor(t) {
      this.inertDocumentHelper = t;
    }
    getInertBodyElement(t) {
      t = "<body><remove></remove>" + t;
      try {
        let n = new window.DOMParser().parseFromString(Fo(t), "text/html").body;
        return n === null
          ? this.inertDocumentHelper.getInertBodyElement(t)
          : (n.firstChild?.remove(), n);
      } catch {
        return null;
      }
    }
  },
  xs = class {
    defaultDoc;
    inertDocument;
    constructor(t) {
      (this.defaultDoc = t),
        (this.inertDocument =
          this.defaultDoc.implementation.createHTMLDocument(
            "sanitization-inert"
          ));
    }
    getInertBodyElement(t) {
      let n = this.inertDocument.createElement("template");
      return (n.innerHTML = Fo(t)), n;
    }
  };
function iv() {
  try {
    return !!new window.DOMParser().parseFromString(Fo(""), "text/html");
  } catch {
    return !1;
  }
}
var sv = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function of(e) {
  return (e = String(e)), e.match(sv) ? e : "unsafe:" + e;
}
function Ae(e) {
  let t = {};
  for (let n of e.split(",")) t[n] = !0;
  return t;
}
function Fn(...e) {
  let t = {};
  for (let n of e) for (let r in n) n.hasOwnProperty(r) && (t[r] = !0);
  return t;
}
var sf = Ae("area,br,col,hr,img,wbr"),
  af = Ae("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
  cf = Ae("rp,rt"),
  av = Fn(cf, af),
  cv = Fn(
    af,
    Ae(
      "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
    )
  ),
  lv = Fn(
    cf,
    Ae(
      "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
    )
  ),
  jl = Fn(sf, cv, lv, av),
  lf = Ae("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
  uv = Ae(
    "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
  ),
  dv = Ae(
    "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
  ),
  fv = Fn(lf, uv, dv),
  pv = Ae("script,style,template"),
  Ns = class {
    sanitizedSomething = !1;
    buf = [];
    sanitizeChildren(t) {
      let n = t.firstChild,
        r = !0,
        o = [];
      for (; n; ) {
        if (
          (n.nodeType === Node.ELEMENT_NODE
            ? (r = this.startElement(n))
            : n.nodeType === Node.TEXT_NODE
              ? this.chars(n.nodeValue)
              : (this.sanitizedSomething = !0),
          r && n.firstChild)
        ) {
          o.push(n), (n = mv(n));
          continue;
        }
        for (; n; ) {
          n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
          let i = gv(n);
          if (i) {
            n = i;
            break;
          }
          n = o.pop();
        }
      }
      return this.buf.join("");
    }
    startElement(t) {
      let n = Hl(t).toLowerCase();
      if (!jl.hasOwnProperty(n))
        return (this.sanitizedSomething = !0), !pv.hasOwnProperty(n);
      this.buf.push("<"), this.buf.push(n);
      let r = t.attributes;
      for (let o = 0; o < r.length; o++) {
        let i = r.item(o),
          s = i.name,
          a = s.toLowerCase();
        if (!fv.hasOwnProperty(a)) {
          this.sanitizedSomething = !0;
          continue;
        }
        let c = i.value;
        lf[a] && (c = of(c)), this.buf.push(" ", s, '="', Bl(c), '"');
      }
      return this.buf.push(">"), !0;
    }
    endElement(t) {
      let n = Hl(t).toLowerCase();
      jl.hasOwnProperty(n) &&
        !sf.hasOwnProperty(n) &&
        (this.buf.push("</"), this.buf.push(n), this.buf.push(">"));
    }
    chars(t) {
      this.buf.push(Bl(t));
    }
  };
function hv(e, t) {
  return (
    (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !==
    Node.DOCUMENT_POSITION_CONTAINED_BY
  );
}
function gv(e) {
  let t = e.nextSibling;
  if (t && e !== t.previousSibling) throw uf(t);
  return t;
}
function mv(e) {
  let t = e.firstChild;
  if (t && hv(e, t)) throw uf(t);
  return t;
}
function Hl(e) {
  let t = e.nodeName;
  return typeof t == "string" ? t : "FORM";
}
function uf(e) {
  return new Error(
    `Failed to sanitize html because the element is clobbered: ${e.outerHTML}`
  );
}
var yv = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  vv = /([^\#-~ |!])/g;
function Bl(e) {
  return e
    .replace(/&/g, "&amp;")
    .replace(yv, function (t) {
      let n = t.charCodeAt(0),
        r = t.charCodeAt(1);
      return "&#" + ((n - 55296) * 1024 + (r - 56320) + 65536) + ";";
    })
    .replace(vv, function (t) {
      return "&#" + t.charCodeAt(0) + ";";
    })
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
var Or;
function Ev(e, t) {
  let n = null;
  try {
    Or = Or || ov(e);
    let r = t ? String(t) : "";
    n = Or.getInertBodyElement(r);
    let o = 5,
      i = r;
    do {
      if (o === 0)
        throw new Error(
          "Failed to sanitize html because the input is unstable"
        );
      o--, (r = i), (i = n.innerHTML), (n = Or.getInertBodyElement(r));
    } while (r !== i);
    let a = new Ns().sanitizeChildren($l(n) || n);
    return Fo(a);
  } finally {
    if (n) {
      let r = $l(n) || n;
      for (; r.firstChild; ) r.firstChild.remove();
    }
  }
}
function $l(e) {
  return "content" in e && Iv(e) ? e.content : null;
}
function Iv(e) {
  return e.nodeType === Node.ELEMENT_NODE && e.nodeName === "TEMPLATE";
}
var Vo = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(Vo || {});
function gS(e) {
  let t = Ua();
  return t
    ? Fl(t.sanitize(Vo.HTML, e) || "")
    : $a(e, "HTML")
      ? Fl(en(e))
      : Ev(An(), ot(e));
}
function Dv(e) {
  let t = Ua();
  return t ? t.sanitize(Vo.URL, e) || "" : $a(e, "URL") ? en(e) : of(ot(e));
}
function wv(e) {
  let t = Ua();
  if (t) return Vl(t.sanitize(Vo.RESOURCE_URL, e) || "");
  if ($a(e, "ResourceURL")) return Vl(en(e));
  throw new C(904, !1);
}
function bv(e, t) {
  return (t === "src" &&
    (e === "embed" ||
      e === "frame" ||
      e === "iframe" ||
      e === "media" ||
      e === "script")) ||
    (t === "href" && (e === "base" || e === "link"))
    ? wv
    : Dv;
}
function mS(e, t, n) {
  return bv(t, n)(e);
}
function Ua() {
  let e = v();
  return e && e[xe].sanitizer;
}
var Mv = /^>|^->|<!--|-->|--!>|<!-$/g,
  Cv = /(<|>)/g,
  _v = "\u200B$1\u200B";
function Tv(e) {
  return e.replace(Mv, (t) => t.replace(Cv, _v));
}
function xv(e) {
  return e.ownerDocument.body;
}
function df(e) {
  return e instanceof Function ? e() : e;
}
function Nv(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
var ff = "ng-template";
function Sv(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && Nv(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (qa(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function qa(e) {
  return e.type === 4 && e.value !== ff;
}
function Ov(e, t, n) {
  let r = e.type === 4 && !n ? ff : e.value;
  return t === r;
}
function Rv(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Pv(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
      if (!s && !fe(r) && !fe(c)) return !1;
      if (s && fe(c)) continue;
      (s = !1), (r = c | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !Ov(e, c, n)) || (c === "" && t.length === 1))
        ) {
          if (fe(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !Sv(e, o, c, n)) {
          if (fe(r)) return !1;
          s = !0;
        }
      } else {
        let l = t[++a],
          u = kv(c, o, qa(e), n);
        if (u === -1) {
          if (fe(r)) return !1;
          s = !0;
          continue;
        }
        if (l !== "") {
          let d;
          if (
            (u > i ? (d = "") : (d = o[u + 1].toLowerCase()), r & 2 && l !== d)
          ) {
            if (fe(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return fe(r) || s;
}
function fe(e) {
  return (e & 1) === 0;
}
function kv(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == "string"; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return Lv(t, e);
}
function pf(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Rv(e, t[r], n)) return !0;
  return !1;
}
function Av(e) {
  let t = e.attrs;
  if (t != null) {
    let n = t.indexOf(5);
    if ((n & 1) === 0) return t[n + 1];
  }
  return null;
}
function Pv(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (md(n)) return t;
  }
  return e.length;
}
function Lv(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function Fv(e, t) {
  e: for (let n = 0; n < t.length; n++) {
    let r = t[n];
    if (e.length === r.length) {
      for (let o = 0; o < e.length; o++) if (e[o] !== r[o]) continue e;
      return !0;
    }
  }
  return !1;
}
function Ul(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function Vv(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = "",
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      o !== "" && !fe(s) && ((t += Ul(i, o)), (o = "")),
        (r = s),
        (i = i || !fe(r));
    n++;
  }
  return o !== "" && (t += Ul(i, o)), t;
}
function jv(e) {
  return e.map(Vv).join(",");
}
function Hv(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!fe(o)) break;
      o = i;
    }
    r++;
  }
  return n.length && t.push(1, ...n), t;
}
var ae = {};
function hf(e, t) {
  return e.createText(t);
}
function Bv(e, t, n) {
  e.setValue(t, n);
}
function gf(e, t) {
  return e.createComment(Tv(t));
}
function Wa(e, t, n) {
  return e.createElement(t, n);
}
function so(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function mf(e, t, n) {
  e.appendChild(t, n);
}
function ql(e, t, n, r, o) {
  r !== null ? so(e, t, n, r, o) : mf(e, t, n);
}
function za(e, t, n) {
  e.removeChild(null, t, n);
}
function yf(e) {
  e.textContent = "";
}
function $v(e, t, n) {
  e.setAttribute(t, "style", n);
}
function Uv(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function vf(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && Nm(e, t, r),
    o !== null && Uv(e, t, o),
    i !== null && $v(e, t, i);
}
function Ga(e, t, n, r, o, i, s, a, c, l, u) {
  let d = P + r,
    p = d + o,
    f = qv(d, p),
    h = typeof l == "function" ? l() : l;
  return (f[y] = {
    type: e,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: p,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: h,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function qv(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : ae);
  return n;
}
function Wv(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = Ga(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : t;
}
function Qa(e, t, n, r, o, i, s, a, c, l, u) {
  let d = t.blueprint.slice();
  return (
    (d[se] = o),
    (d[I] = r | 4 | 128 | 8 | 64 | 1024),
    (l !== null || (e && e[I] & 2048)) && (d[I] |= 2048),
    nd(d),
    (d[U] = d[Gt] = e),
    (d[$] = n),
    (d[xe] = s || (e && e[xe])),
    (d[k] = a || (e && e[k])),
    (d[Te] = c || (e && e[Te]) || null),
    (d[ee] = i),
    (d[Mo] = iy()),
    (d[ue] = u),
    (d[Gu] = l),
    (d[Q] = t.type == 2 ? e[Q] : d),
    d
  );
}
function zv(e, t, n) {
  let r = me(t, e),
    o = Wv(n),
    i = e[xe].rendererFactory,
    s = Za(
      e,
      Qa(
        e,
        o,
        null,
        Ef(n),
        r,
        t,
        null,
        i.createRenderer(r, n),
        null,
        null,
        null
      )
    );
  return (e[t.index] = s);
}
function Ef(e) {
  let t = 16;
  return e.signals ? (t = 4096) : e.onPush && (t = 64), t;
}
function If(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function Za(e, t) {
  return e[wn] ? (e[El][pe] = t) : (e[wn] = t), (e[El] = t), t;
}
function yS(e = 1) {
  Df(L(), v(), ke() + e, !1);
}
function Df(e, t, n, r) {
  if (!r)
    if ((t[I] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Pr(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Lr(t, i, 0, n);
    }
  lt(n);
}
var jo = (function (e) {
  return (
    (e[(e.None = 0)] = "None"),
    (e[(e.SignalBased = 1)] = "SignalBased"),
    (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
    e
  );
})(jo || {});
function Ss(e, t, n, r) {
  let o = b(null);
  try {
    let [i, s, a] = e.inputs[n],
      c = null;
    (s & jo.SignalBased) !== 0 && (c = t[i][ce]),
      c !== null && c.transformFn !== void 0
        ? (r = c.transformFn(r))
        : a !== null && (r = a.call(t, r)),
      e.setInput !== null ? e.setInput(t, c, r, n, i) : Zu(t, c, i, r);
  } finally {
    b(o);
  }
}
function wf(e, t, n, r, o) {
  let i = ke(),
    s = r & 2;
  try {
    lt(-1), s && t.length > P && Df(e, t, P, !1), O(s ? 2 : 0, o), n(r, o);
  } finally {
    lt(i), O(s ? 3 : 1, o);
  }
}
function Ho(e, t, n) {
  Xv(e, t, n), (n.flags & 64) === 64 && eE(e, t, n);
}
function Ya(e, t, n = me) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function Gv(e, t, n, r) {
  let i = r.get(Wd, qd) || n === _n.ShadowDom,
    s = e.selectRootElement(t, i);
  return Qv(s), s;
}
function Qv(e) {
  bf(e);
}
var bf = () => null;
function Zv(e) {
  Ad(e) ? yf(e) : Yy(e);
}
function Yv() {
  bf = Zv;
}
function Kv(e) {
  return e === "class"
    ? "className"
    : e === "for"
      ? "htmlFor"
      : e === "formaction"
        ? "formAction"
        : e === "innerHtml"
          ? "innerHTML"
          : e === "readonly"
            ? "readOnly"
            : e === "tabindex"
              ? "tabIndex"
              : e;
}
function Ka(e, t, n, r, o, i, s, a) {
  if (!a && ec(t, e, n, r, o)) {
    mt(t) && Jv(n, t.index);
    return;
  }
  if (t.type & 3) {
    let c = me(t, n);
    (r = Kv(r)),
      (o = s != null ? s(o, t.value || "", r) : o),
      i.setProperty(c, r, o);
  } else t.type & 12;
}
function Jv(e, t) {
  let n = we(t, e);
  n[I] & 16 || (n[I] |= 64);
}
function Xv(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd;
  mt(n) && zv(t, n, e.data[r + n.componentOffset]),
    e.firstCreatePass || Xr(n, t);
  let i = n.initialInputs;
  for (let s = r; s < o; s++) {
    let a = e.data[s],
      c = Mn(t, e, s, n);
    if ((Xt(c, t), i !== null && oE(t, s - r, c, a, n, i), De(a))) {
      let l = we(n.index, t);
      l[$] = Mn(t, e, s, n);
    }
  }
}
function eE(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = Dm();
  try {
    lt(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        l = t[a];
      hs(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          tE(c, l);
    }
  } finally {
    lt(-1), hs(s);
  }
}
function tE(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Ja(e, t) {
  let n = e.directiveRegistry,
    r = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let i = n[o];
      pf(t, i.selectors, !1) && ((r ??= []), De(i) ? r.unshift(i) : r.push(i));
    }
  return r;
}
function nE(e, t, n, r, o, i) {
  let s = me(e, t);
  rE(t[k], s, i, e.value, n, r, o);
}
function rE(e, t, n, r, o, i, s) {
  if (i == null) e.removeAttribute(t, o, n);
  else {
    let a = s == null ? ot(i) : s(i, r || "", o);
    e.setAttribute(t, o, a, n);
  }
}
function oE(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let c = s[a],
        l = s[a + 1];
      Ss(r, n, c, l);
    }
}
function Xa(e, t) {
  let n = e[Te],
    r = n ? n.get(pt, null) : null;
  r && r.handleError(t);
}
function ec(e, t, n, r, o) {
  let i = e.inputs?.[r],
    s = e.hostDirectiveInputs?.[r],
    a = !1;
  if (s)
    for (let c = 0; c < s.length; c += 2) {
      let l = s[c],
        u = s[c + 1],
        d = t.data[l];
      Ss(d, n[l], u, o), (a = !0);
    }
  if (i)
    for (let c of i) {
      let l = n[c],
        u = t.data[c];
      Ss(u, l, r, o), (a = !0);
    }
  return a;
}
function iE(e, t) {
  let n = we(t, e),
    r = n[y];
  sE(r, n);
  let o = n[se];
  o !== null && n[ue] === null && (n[ue] = ef(o, n[Te])),
    O(18),
    tc(r, n, n[$]),
    O(19, n[$]);
}
function sE(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function tc(e, t, n) {
  Na(t);
  try {
    let r = e.viewQuery;
    r !== null && _s(1, r, n);
    let o = e.template;
    o !== null && wf(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[Ne]?.finishViewCreation(e),
      e.staticContentQueries && nf(e, t),
      e.staticViewQueries && _s(2, e.viewQuery, n);
    let i = e.components;
    i !== null && aE(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[I] &= -5), Sa();
  }
}
function aE(e, t) {
  for (let n = 0; n < t.length; n++) iE(e, t[n]);
}
function tn(e, t, n, r) {
  let o = b(null);
  try {
    let i = t.tView,
      a = e[I] & 4096 ? 4096 : 16,
      c = Qa(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null
      ),
      l = e[t.index];
    c[st] = l;
    let u = e[Ne];
    return u !== null && (c[Ne] = u.createEmbeddedView(i)), tc(i, c, n), c;
  } finally {
    b(o);
  }
}
function ht(e, t) {
  return !t || t.firstChild === null || no(e);
}
var cE;
function nc(e, t) {
  return cE(e, t);
}
var Os = (function (e) {
  return (
    (e[(e.Important = 1)] = "Important"), (e[(e.DashCase = 2)] = "DashCase"), e
  );
})(Os || {});
function It(e) {
  return (e.flags & 32) === 32;
}
function Rt(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    be(r) ? (i = r) : he(r) && ((s = !0), (r = r[se]));
    let a = ge(r);
    e === 0 && n !== null
      ? o == null
        ? mf(t, n, a)
        : so(t, n, a, o || null, !0)
      : e === 1 && n !== null
        ? so(t, n, a, o || null, !0)
        : e === 2
          ? za(t, a, s)
          : e === 3 && t.destroyNode(a),
      i != null && vE(t, e, i, n, o);
  }
}
function lE(e, t) {
  Mf(e, t), (t[se] = null), (t[ee] = null);
}
function uE(e, t, n, r, o, i) {
  (r[se] = o), (r[ee] = t), Uo(e, r, n, 1, o, i);
}
function Mf(e, t) {
  t[xe].changeDetectionScheduler?.notify(9), Uo(e, t, t[k], 2, null, null);
}
function dE(e) {
  let t = e[wn];
  if (!t) return zi(e[y], e);
  for (; t; ) {
    let n = null;
    if (he(t)) n = t[wn];
    else {
      let r = t[z];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[pe] && t !== e; ) he(t) && zi(t[y], t), (t = t[U]);
      t === null && (t = e), he(t) && zi(t[y], t), (n = t && t[pe]);
    }
    t = n;
  }
}
function rc(e, t) {
  let n = e[Ht],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Bo(e, t) {
  if (Qt(t)) return;
  let n = t[k];
  n.destroyNode && Uo(e, t, n, 3, null, null), dE(t);
}
function zi(e, t) {
  if (Qt(t)) return;
  let n = b(null);
  try {
    (t[I] &= -129),
      (t[I] |= 256),
      t[le] && ln(t[le]),
      pE(e, t),
      fE(e, t),
      t[y].type === 1 && t[k].destroy();
    let r = t[st];
    if (r !== null && be(t[U])) {
      r !== t[U] && rc(r, t);
      let o = t[Ne];
      o !== null && o.detachView(e);
    }
    ws(t);
  } finally {
    b(n);
  }
}
function fE(e, t) {
  let n = e.cleanup,
    r = t[Gr];
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == "string") {
        let a = n[s + 3];
        a >= 0 ? r[a]() : r[-a].unsubscribe(), (s += 2);
      } else {
        let a = r[n[s + 1]];
        n[s].call(a);
      }
  r !== null && (t[Gr] = null);
  let o = t[$e];
  if (o !== null) {
    t[$e] = null;
    for (let s = 0; s < o.length; s++) {
      let a = o[s];
      a();
    }
  }
  let i = t[at];
  if (i !== null) {
    t[at] = null;
    for (let s of i) s.destroy();
  }
}
function pE(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof ut)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            O(4, a, c);
            try {
              c.call(a);
            } finally {
              O(5, a, c);
            }
          }
        else {
          O(4, o, i);
          try {
            i.call(o);
          } finally {
            O(5, o, i);
          }
        }
      }
    }
}
function Cf(e, t, n) {
  return hE(e, t.parent, n);
}
function hE(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[se];
  if (mt(r)) {
    let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
    if (o === _n.None || o === _n.Emulated) return null;
  }
  return me(r, n);
}
function _f(e, t, n) {
  return mE(e, t, n);
}
function gE(e, t, n) {
  return e.type & 40 ? me(e, n) : null;
}
var mE = gE,
  Wl;
function $o(e, t, n, r) {
  let o = Cf(e, r, t),
    i = t[k],
    s = r.parent || t[ee],
    a = _f(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) ql(i, o, n[c], a, !1);
    else ql(i, o, n, a, !1);
  Wl !== void 0 && Wl(i, r, t, n, o);
}
function En(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return me(t, e);
    if (n & 4) return Rs(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return En(e, r);
      {
        let o = e[t.index];
        return be(o) ? Rs(-1, o) : ge(o);
      }
    } else {
      if (n & 128) return En(e, t.next);
      if (n & 32) return nc(t, e)() || ge(e[t.index]);
      {
        let r = Tf(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = ct(e[Q]);
          return En(o, r);
        } else return En(e, t.next);
      }
    }
  }
  return null;
}
function Tf(e, t) {
  if (t !== null) {
    let r = e[Q][ee],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Rs(e, t) {
  let n = z + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[y].firstChild;
    if (o !== null) return En(r, o);
  }
  return t[Oe];
}
function oc(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      c = n.type;
    if ((s && t === 0 && (a && Xt(ge(a), r), (n.flags |= 2)), !It(n)))
      if (c & 8) oc(e, t, n.child, r, o, i, !1), Rt(t, e, o, a, i);
      else if (c & 32) {
        let l = nc(n, r),
          u;
        for (; (u = l()); ) Rt(t, e, o, u, i);
        Rt(t, e, o, a, i);
      } else c & 16 ? xf(e, t, r, n, o, i) : Rt(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function Uo(e, t, n, r, o, i) {
  oc(n, r, e.firstChild, t, o, i, !1);
}
function yE(e, t, n) {
  let r = t[k],
    o = Cf(e, n, t),
    i = n.parent || t[ee],
    s = _f(i, n, t);
  xf(r, 0, t, n, o, s);
}
function xf(e, t, n, r, o, i) {
  let s = n[Q],
    c = s[ee].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Rt(t, e, o, u, i);
    }
  else {
    let l = c,
      u = s[U];
    no(r) && (l.flags |= 128), oc(e, t, l, u, o, i, !0);
  }
}
function vE(e, t, n, r, o) {
  let i = n[Oe],
    s = ge(n);
  i !== s && Rt(t, e, r, i, o);
  for (let a = z; a < n.length; a++) {
    let c = n[a];
    Uo(c[y], c, e, t, r, i);
  }
}
function EE(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf("-") === -1 ? void 0 : Os.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == "string" &&
          o.endsWith("!important") &&
          ((o = o.slice(0, -10)), (i |= Os.Important)),
        e.setStyle(n, r, o, i));
  }
}
function ao(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(ge(i)), be(i) && IE(i, r);
    let s = n.type;
    if (s & 8) ao(e, t, n.child, r);
    else if (s & 32) {
      let a = nc(n, t),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = Tf(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = ct(t[Q]);
        ao(c[y], c, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function IE(e, t) {
  for (let n = z; n < e.length; n++) {
    let r = e[n],
      o = r[y].firstChild;
    o !== null && ao(r[y], r, o, t);
  }
  e[Oe] !== e[se] && t.push(e[Oe]);
}
function Nf(e) {
  if (e[At] !== null) {
    for (let t of e[At]) t.impl.addSequence(t);
    e[At].length = 0;
  }
}
var Sf = [];
function DE(e) {
  return e[le] ?? wE(e);
}
function wE(e) {
  let t = Sf.pop() ?? Object.create(ME);
  return (t.lView = e), t;
}
function bE(e) {
  e.lView[le] !== e && ((e.lView = null), Sf.push(e));
}
var ME = ne(te({}, Dt), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    Zt(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[le] = this;
  },
});
function CE(e) {
  let t = e[le] ?? Object.create(_E);
  return (t.lView = e), t;
}
var _E = ne(te({}, Dt), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    let t = ct(e.lView);
    for (; t && !Of(t[y]); ) t = ct(t);
    t && rd(t);
  },
  consumerOnSignalRead() {
    this.lView[le] = this;
  },
});
function Of(e) {
  return e.type !== 2;
}
function Rf(e) {
  if (e[at] === null) return;
  let t = !0;
  for (; t; ) {
    let n = !1;
    for (let r of e[at])
      r.dirty &&
        ((n = !0),
        r.zone === null || Zone.current === r.zone
          ? r.run()
          : r.zone.run(() => r.run()));
    t = n && !!(e[I] & 8192);
  }
}
var TE = 100;
function kf(e, t = !0, n = 0) {
  let o = e[xe].rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    xE(e, n);
  } catch (s) {
    throw (t && Xa(e, s), s);
  } finally {
    i || o.end?.();
  }
}
function xE(e, t) {
  let n = sd();
  try {
    Zr(!0), ks(e, t);
    let r = 0;
    for (; _o(e); ) {
      if (r === TE) throw new C(103, !1);
      r++, ks(e, 1);
    }
  } finally {
    Zr(n);
  }
}
function NE(e, t, n, r) {
  if (Qt(t)) return;
  let o = t[I],
    i = !1,
    s = !1;
  Na(t);
  let a = !0,
    c = null,
    l = null;
  i ||
    (Of(e)
      ? ((l = DE(t)), (c = cn(l)))
      : oi() === null
        ? ((a = !1), (l = CE(t)), (c = cn(l)))
        : t[le] && (ln(t[le]), (t[le] = null)));
  try {
    nd(t), vm(e.bindingStartIndex), n !== null && wf(e, t, n, 2, r);
    let u = (o & 3) === 3;
    if (!i)
      if (u) {
        let f = e.preOrderCheckHooks;
        f !== null && Pr(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && Lr(t, f, 0, null), $i(t, 0);
      }
    if (
      (s || SE(t), Rf(t), Af(t, 0), e.contentQueries !== null && nf(e, t), !i)
    )
      if (u) {
        let f = e.contentCheckHooks;
        f !== null && Pr(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && Lr(t, f, 1), $i(t, 1);
      }
    RE(e, t);
    let d = e.components;
    d !== null && Lf(t, d, 0);
    let p = e.viewQuery;
    if ((p !== null && _s(2, p, r), !i))
      if (u) {
        let f = e.viewCheckHooks;
        f !== null && Pr(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && Lr(t, f, 2), $i(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Bi])) {
      for (let f of t[Bi]) f();
      t[Bi] = null;
    }
    i || (Nf(t), (t[I] &= -73));
  } catch (u) {
    throw (i || Zt(t), u);
  } finally {
    l !== null && (Un(l, c), a && bE(l)), Sa();
  }
}
function Af(e, t) {
  for (let n = Fd(e); n !== null; n = Vd(n))
    for (let r = z; r < n.length; r++) {
      let o = n[r];
      Pf(o, t);
    }
}
function SE(e) {
  for (let t = Fd(e); t !== null; t = Vd(t)) {
    if (!(t[I] & 2)) continue;
    let n = t[Ht];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      rd(o);
    }
  }
}
function OE(e, t, n) {
  O(18);
  let r = we(t, e);
  Pf(r, n), O(19, r[$]);
}
function Pf(e, t) {
  Da(e) && ks(e, t);
}
function ks(e, t) {
  let r = e[y],
    o = e[I],
    i = e[le],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && qn(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[I] &= -9217),
    s)
  )
    NE(r, e, r.template, e[$]);
  else if (o & 8192) {
    Rf(e), Af(e, 1);
    let a = r.components;
    a !== null && Lf(e, a, 1), Nf(e);
  }
}
function Lf(e, t, n) {
  for (let r = 0; r < t.length; r++) OE(e, t[r], n);
}
function RE(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) lt(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          Im(s, i);
          let c = t[i];
          O(24, c), a(2, c), O(25, c);
        }
      }
    } finally {
      lt(-1);
    }
}
function qo(e, t) {
  let n = sd() ? 64 : 1088;
  for (e[xe].changeDetectionScheduler?.notify(t); e; ) {
    e[I] |= n;
    let r = ct(e);
    if (bn(e) && !r) return e;
    e = r;
  }
  return null;
}
function Ff(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function Vf(e, t) {
  let n = z + t;
  if (n < e.length) return e[n];
}
function nn(e, t, n, r = !0) {
  let o = t[y];
  if ((kE(o, t, e, n), r)) {
    let s = Rs(n, e),
      a = t[k],
      c = a.parentNode(e[Oe]);
    c !== null && uE(o, e[ee], a, t, c, s);
  }
  let i = t[ue];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function ic(e, t) {
  let n = Tn(e, t);
  return n !== void 0 && Bo(n[y], n), n;
}
function Tn(e, t) {
  if (e.length <= z) return;
  let n = z + t,
    r = e[n];
  if (r) {
    let o = r[st];
    o !== null && o !== e && rc(o, r), t > 0 && (e[n - 1][pe] = r[pe]);
    let i = Wr(e, z + t);
    lE(r[y], r);
    let s = i[Ne];
    s !== null && s.detachView(i[y]),
      (r[U] = null),
      (r[pe] = null),
      (r[I] &= -129);
  }
  return r;
}
function kE(e, t, n, r) {
  let o = z + r,
    i = n.length;
  r > 0 && (n[o - 1][pe] = t),
    r < i - z ? ((t[pe] = n[o]), Pu(n, z + r, t)) : (n.push(t), (t[pe] = null)),
    (t[U] = n);
  let s = t[st];
  s !== null && n !== s && jf(s, t);
  let a = t[Ne];
  a !== null && a.insertView(e), fs(t), (t[I] |= 128);
}
function jf(e, t) {
  let n = e[Ht],
    r = t[U];
  if (he(r)) e[I] |= 2;
  else {
    let o = r[U][Q];
    t[Q] !== o && (e[I] |= 2);
  }
  n === null ? (e[Ht] = [t]) : n.push(t);
}
var xn = class {
  _lView;
  _cdRefInjectingView;
  notifyErrorHandler;
  _appRef = null;
  _attachedToViewContainer = !1;
  get rootNodes() {
    let t = this._lView,
      n = t[y];
    return ao(n, t, n.firstChild, []);
  }
  constructor(t, n, r = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r);
  }
  get context() {
    return this._lView[$];
  }
  set context(t) {
    this._lView[$] = t;
  }
  get destroyed() {
    return Qt(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[U];
      if (be(t)) {
        let n = t[Qr],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (Tn(t, r), Wr(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    Bo(this._lView[y], this._lView);
  }
  onDestroy(t) {
    od(this._lView, t);
  }
  markForCheck() {
    qo(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[I] &= -129;
  }
  reattach() {
    fs(this._lView), (this._lView[I] |= 128);
  }
  detectChanges() {
    (this._lView[I] |= 1024), kf(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new C(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = bn(this._lView),
      n = this._lView[st];
    n !== null && !t && rc(n, this._lView), Mf(this._lView[y], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new C(902, !1);
    this._appRef = t;
    let n = bn(this._lView),
      r = this._lView[st];
    r !== null && !n && jf(r, this._lView), fs(this._lView);
  }
};
var co = (() => {
    class e {
      static __NG_ELEMENT_ID__ = LE;
    }
    return e;
  })(),
  AE = co,
  PE = class extends AE {
    _declarationLView;
    _declarationTContainer;
    elementRef;
    constructor(t, n, r) {
      super(),
        (this._declarationLView = t),
        (this._declarationTContainer = n),
        (this.elementRef = r);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(t, n) {
      return this.createEmbeddedViewImpl(t, n);
    }
    createEmbeddedViewImpl(t, n, r) {
      let o = tn(this._declarationLView, this._declarationTContainer, t, {
        embeddedViewInjector: n,
        dehydratedView: r,
      });
      return new xn(o);
    }
  };
function LE() {
  return Wo(G(), v());
}
function Wo(e, t) {
  return e.type & 4 ? new PE(t, e, Jt(e, t)) : null;
}
function Vn(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = FE(e, t, n, r, o)), Em() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = gm();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return yt(i, !0), i;
}
function FE(e, t, n, r, o) {
  let i = id(),
    s = Ca(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = jE(e, a, n, t, r, o));
  return VE(e, c, i, s), c;
}
function VE(e, t, n, r) {
  e.firstChild === null && (e.firstChild = t),
    n !== null &&
      (r
        ? n.child == null && t.parent !== null && (n.child = t)
        : n.next === null && ((n.next = t), (t.prev = n)));
}
function jE(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    Yt() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: null,
      inputs: null,
      hostDirectiveInputs: null,
      outputs: null,
      hostDirectiveOutputs: null,
      directiveToIndex: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
var HE = new RegExp(`^(\\d+)*(${Bd}|${Hd})*(.*)`);
function BE(e) {
  let t = e.match(HE),
    [n, r, o, i] = t,
    s = r ? parseInt(r, 10) : o,
    a = [];
  for (let [c, l, u] of i.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(l, d);
  }
  return [s, ...a];
}
function $E(e) {
  return !e.prev && e.parent?.type === 8;
}
function Gi(e) {
  return e.index - P;
}
function UE(e, t) {
  let n = e.i18nNodes;
  if (n) return n.get(t);
}
function zo(e, t, n, r) {
  let o = Gi(r),
    i = UE(e, o);
  if (i === void 0) {
    let s = e.data[my];
    if (s?.[o]) i = WE(s[o], n);
    else if (t.firstChild === r) i = e.firstChild;
    else {
      let a = r.prev === null,
        c = r.prev ?? r.parent;
      if ($E(r)) {
        let l = Gi(r.parent);
        i = Cs(e, l);
      } else {
        let l = me(c, n);
        if (a) i = l.firstChild;
        else {
          let u = Gi(c),
            d = Cs(e, u);
          if (c.type === 2 && d) {
            let f = Ha(e, u) + 1;
            i = Go(f, d);
          } else i = l.nextSibling;
        }
      }
    }
  }
  return i;
}
function Go(e, t) {
  let n = t;
  for (let r = 0; r < e; r++) n = n.nextSibling;
  return n;
}
function qE(e, t) {
  let n = e;
  for (let r = 0; r < t.length; r += 2) {
    let o = t[r],
      i = t[r + 1];
    for (let s = 0; s < i; s++)
      switch (o) {
        case dy:
          n = n.firstChild;
          break;
        case fy:
          n = n.nextSibling;
          break;
      }
  }
  return n;
}
function WE(e, t) {
  let [n, ...r] = BE(e),
    o;
  if (n === Hd) o = t[Q][se];
  else if (n === Bd) o = xv(t[Q][se]);
  else {
    let i = Number(n);
    o = ge(t[i + P]);
  }
  return qE(o, r);
}
var zE = !1;
function GE(e) {
  zE = e;
}
function QE(e) {
  let t = e[ue];
  if (t) {
    let { i18nNodes: n, dehydratedIcuData: r } = t;
    if (n && r) {
      let o = e[k];
      for (let i of r.values()) ZE(o, n, i);
    }
    (t.i18nNodes = void 0), (t.dehydratedIcuData = void 0);
  }
}
function ZE(e, t, n) {
  for (let r of n.node.cases[n.case]) {
    let o = t.get(r.index - P);
    o && za(e, o, !1);
  }
}
function Hf(e) {
  let t = e[Se] ?? [],
    r = e[U][k],
    o = [];
  for (let i of t) i.data[yy] !== void 0 ? o.push(i) : Bf(i, r);
  e[Se] = o;
}
function YE(e) {
  let { lContainer: t } = e,
    n = t[Se];
  if (n === null) return;
  let o = t[U][k];
  for (let i of n) Bf(i, o);
}
function Bf(e, t) {
  let n = 0,
    r = e.firstChild;
  if (r) {
    let o = e.data[oo];
    for (; n < o; ) {
      let i = r.nextSibling;
      za(t, r, !1), (r = i), n++;
    }
  }
}
function Qo(e) {
  Hf(e);
  let t = e[se];
  he(t) && lo(t);
  for (let n = z; n < e.length; n++) lo(e[n]);
}
function lo(e) {
  QE(e);
  let t = e[y];
  for (let n = P; n < t.bindingStartIndex; n++)
    if (be(e[n])) {
      let r = e[n];
      Qo(r);
    } else he(e[n]) && lo(e[n]);
}
function $f(e) {
  let t = e._views;
  for (let n of t) {
    let r = Qy(n);
    r !== null && r[se] !== null && (he(r) ? lo(r) : Qo(r));
  }
}
function KE(e, t, n, r) {
  e !== null && (n.cleanup(t), Qo(e.lContainer), $f(r));
}
function JE(e, t) {
  let n = [];
  for (let r of t)
    for (let o = 0; o < (r[$d] ?? 1); o++) {
      let i = { data: r, firstChild: null };
      r[oo] > 0 && ((i.firstChild = e), (e = Go(r[oo], e))), n.push(i);
    }
  return [e, n];
}
var Uf = () => null;
function XE(e, t) {
  let n = e[Se];
  return !t || n === null || n.length === 0
    ? null
    : n[0].data[gy] === t
      ? n.shift()
      : (Hf(e), null);
}
function eI() {
  Uf = XE;
}
function $t(e, t) {
  return Uf(e, t);
}
var tI = class {},
  qf = class {},
  As = class {
    resolveComponentFactory(t) {
      throw Error(`No component factory found for ${X(t)}.`);
    }
  },
  Zo = class {
    static NULL = new As();
  },
  uo = class {},
  bS = (() => {
    class e {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => nI();
    }
    return e;
  })();
function nI() {
  let e = v(),
    t = G(),
    n = we(t.index, e);
  return (he(n) ? n : e)[k];
}
var rI = (() => {
  class e {
    static ɵprov = q({ token: e, providedIn: "root", factory: () => null });
  }
  return e;
})();
var Qi = {},
  Ft = class {
    injector;
    parentInjector;
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = wo(r);
      let o = this.injector.get(t, Qi, r);
      return o !== Qi || n === Qi ? o : this.parentInjector.get(t, n, r);
    }
  };
function Ps(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = os(o, a);
      else if (i == 2) {
        let c = a,
          l = t[++s];
        r = os(r, c + ": " + l + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
function Yo(e, t = T.Default) {
  let n = v();
  if (n === null) return Ue(e, t);
  let r = G();
  return bd(r, n, W(e), t);
}
function MS() {
  let e = "invalid";
  throw new Error(e);
}
function sc(e, t, n, r, o) {
  let i = r === null ? null : { "": -1 },
    s = o(e, n);
  if (s !== null) {
    let a,
      c = null,
      l = null,
      u = iI(s);
    u === null ? (a = s) : ([a, c, l] = u), cI(e, t, n, a, i, c, l);
  }
  i !== null && r !== null && oI(n, r, i);
}
function oI(e, t, n) {
  let r = (e.localNames = []);
  for (let o = 0; o < t.length; o += 2) {
    let i = n[t[o + 1]];
    if (i == null) throw new C(-301, !1);
    r.push(t[o], i);
  }
}
function iI(e) {
  let t = null,
    n = !1;
  for (let s = 0; s < e.length; s++) {
    let a = e[s];
    if ((s === 0 && De(a) && (t = a), a.findHostDirectiveDefs !== null)) {
      n = !0;
      break;
    }
  }
  if (!n) return null;
  let r = null,
    o = null,
    i = null;
  for (let s of e)
    s.findHostDirectiveDefs !== null &&
      ((r ??= []), (o ??= new Map()), (i ??= new Map()), sI(s, r, i, o)),
      s === t && ((r ??= []), r.push(s));
  return r !== null
    ? (r.push(...(t === null ? e : e.slice(1))), [r, o, i])
    : null;
}
function sI(e, t, n, r) {
  let o = t.length;
  e.findHostDirectiveDefs(e, t, r), n.set(e, [o, t.length - 1]);
}
function aI(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function cI(e, t, n, r, o, i, s) {
  let a = r.length,
    c = !1;
  for (let p = 0; p < a; p++) {
    let f = r[p];
    !c && De(f) && ((c = !0), aI(e, n, p)), ms(Xr(n, t), e, f.type);
  }
  hI(n, e.data.length, a);
  for (let p = 0; p < a; p++) {
    let f = r[p];
    f.providersResolver && f.providersResolver(f);
  }
  let l = !1,
    u = !1,
    d = If(e, t, a, null);
  a > 0 && (n.directiveToIndex = new Map());
  for (let p = 0; p < a; p++) {
    let f = r[p];
    if (
      ((n.mergedAttrs = Bt(n.mergedAttrs, f.hostAttrs)),
      uI(e, n, t, d, f),
      pI(d, f, o),
      s !== null && s.has(f))
    ) {
      let [g, R] = s.get(f);
      n.directiveToIndex.set(f.type, [
        d,
        g + n.directiveStart,
        R + n.directiveStart,
      ]);
    } else (i === null || !i.has(f)) && n.directiveToIndex.set(f.type, d);
    f.contentQueries !== null && (n.flags |= 4),
      (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) &&
        (n.flags |= 64);
    let h = f.type.prototype;
    !l &&
      (h.ngOnChanges || h.ngOnInit || h.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (l = !0)),
      !u &&
        (h.ngOnChanges || h.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (u = !0)),
      d++;
  }
  lI(e, n, i);
}
function lI(e, t, n) {
  for (let r = t.directiveStart; r < t.directiveEnd; r++) {
    let o = e.data[r];
    if (n === null || !n.has(o)) zl(0, t, o, r), zl(1, t, o, r), Ql(t, r, !1);
    else {
      let i = n.get(o);
      Gl(0, t, i, r), Gl(1, t, i, r), Ql(t, r, !0);
    }
  }
}
function zl(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s;
      e === 0 ? (s = t.inputs ??= {}) : (s = t.outputs ??= {}),
        (s[i] ??= []),
        s[i].push(r),
        Wf(t, i);
    }
}
function Gl(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s = o[i],
        a;
      e === 0
        ? (a = t.hostDirectiveInputs ??= {})
        : (a = t.hostDirectiveOutputs ??= {}),
        (a[s] ??= []),
        a[s].push(r, i),
        Wf(t, s);
    }
}
function Wf(e, t) {
  t === "class" ? (e.flags |= 8) : t === "style" && (e.flags |= 16);
}
function Ql(e, t, n) {
  let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
  if (r === null || (!n && o === null) || (n && i === null) || qa(e)) {
    (e.initialInputs ??= []), e.initialInputs.push(null);
    return;
  }
  let s = null,
    a = 0;
  for (; a < r.length; ) {
    let c = r[a];
    if (c === 0) {
      a += 4;
      continue;
    } else if (c === 5) {
      a += 2;
      continue;
    } else if (typeof c == "number") break;
    if (!n && o.hasOwnProperty(c)) {
      let l = o[c];
      for (let u of l)
        if (u === t) {
          (s ??= []), s.push(c, r[a + 1]);
          break;
        }
    } else if (n && i.hasOwnProperty(c)) {
      let l = i[c];
      for (let u = 0; u < l.length; u += 2)
        if (l[u] === t) {
          (s ??= []), s.push(l[u + 1], r[a + 1]);
          break;
        }
    }
    a += 2;
  }
  (e.initialInputs ??= []), e.initialInputs.push(s);
}
function uI(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = it(o.type, !0)),
    s = new ut(i, De(o), Yo);
  (e.blueprint[r] = s), (n[r] = s), dI(e, t, r, If(e, n, o.hostVars, ae), o);
}
function dI(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    fI(s) != a && s.push(a), s.push(n, r, i);
  }
}
function fI(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function pI(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    De(t) && (n[""] = e);
  }
}
function hI(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function zf(e, t, n, r, o, i, s, a) {
  let c = t.consts,
    l = We(c, s),
    u = Vn(t, e, 2, r, l);
  return (
    i && sc(t, n, u, We(c, a), o),
    (u.mergedAttrs = Bt(u.mergedAttrs, u.attrs)),
    u.attrs !== null && Ps(u, u.attrs, !1),
    u.mergedAttrs !== null && Ps(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
  );
}
function Gf(e, t) {
  Oa(e, t), Ia(t) && e.queries.elementEnd(t);
}
var fo = class extends Zo {
  ngModule;
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = qe(t);
    return new Ut(n, this.ngModule);
  }
};
function gI(e) {
  return Object.keys(e).map((t) => {
    let [n, r, o] = e[t],
      i = {
        propName: n,
        templateName: t,
        isSignal: (r & jo.SignalBased) !== 0,
      };
    return o && (i.transform = o), i;
  });
}
function mI(e) {
  return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
}
function yI(e, t, n) {
  let r = t instanceof _e ? t : t?.injector;
  return (
    r &&
      e.getStandaloneInjector !== null &&
      (r = e.getStandaloneInjector(r) || r),
    r ? new Ft(n, r) : n
  );
}
function vI(e) {
  let t = e.get(uo, null);
  if (t === null) throw new C(407, !1);
  let n = e.get(rI, null),
    r = e.get(ft, null);
  return { rendererFactory: t, sanitizer: n, changeDetectionScheduler: r };
}
function EI(e, t) {
  let n = (e.selectors[0][0] || "div").toLowerCase();
  return Wa(t, n, n === "svg" ? Xu : n === "math" ? rm : null);
}
var Ut = class extends qf {
    componentDef;
    ngModule;
    selector;
    componentType;
    ngContentSelectors;
    isBoundToModule;
    cachedInputs = null;
    cachedOutputs = null;
    get inputs() {
      return (
        (this.cachedInputs ??= gI(this.componentDef.inputs)), this.cachedInputs
      );
    }
    get outputs() {
      return (
        (this.cachedOutputs ??= mI(this.componentDef.outputs)),
        this.cachedOutputs
      );
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = jv(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors ?? []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, o) {
      O(22);
      let i = b(null);
      try {
        let s = this.componentDef,
          a = r ? ["ng-version", "19.2.6"] : Hv(this.componentDef.selectors[0]),
          c = Ga(0, null, null, 1, 0, null, null, null, null, [a], null),
          l = yI(s, o || this.ngModule, t),
          u = vI(l),
          d = u.rendererFactory.createRenderer(null, s),
          p = r ? Gv(d, r, s.encapsulation, l) : EI(s, d),
          f = Qa(
            null,
            c,
            null,
            512 | Ef(s),
            null,
            null,
            u,
            d,
            l,
            null,
            ef(p, l, !0)
          );
        (f[P] = p), Na(f);
        let h = null;
        try {
          let g = zf(P, c, f, "#host", () => [this.componentDef], !0, 0);
          p && (vf(d, p, g), Xt(p, f)),
            Ho(c, f, g),
            Ba(c, g, f),
            Gf(c, g),
            n !== void 0 && II(g, this.ngContentSelectors, n),
            (h = we(g.index, f)),
            (f[$] = h[$]),
            tc(c, f, null);
        } catch (g) {
          throw (h !== null && ws(h), ws(f), g);
        } finally {
          O(23), Sa();
        }
        return new Ls(this.componentType, f);
      } finally {
        b(i);
      }
    }
  },
  Ls = class extends tI {
    _rootLView;
    instance;
    hostView;
    changeDetectorRef;
    componentType;
    location;
    previousInputValues = null;
    _tNode;
    constructor(t, n) {
      super(),
        (this._rootLView = n),
        (this._tNode = kn(n[y], P)),
        (this.location = Jt(this._tNode, n)),
        (this.instance = we(this._tNode.index, n)[$]),
        (this.hostView = this.changeDetectorRef = new xn(n, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, n) {
      let r = this._tNode;
      if (
        ((this.previousInputValues ??= new Map()),
        this.previousInputValues.has(t) &&
          Object.is(this.previousInputValues.get(t), n))
      )
        return;
      let o = this._rootLView,
        i = ec(r, o[y], o, t, n);
      this.previousInputValues.set(t, n);
      let s = we(r.index, o);
      qo(s, 1);
    }
    get injector() {
      return new rt(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function II(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
var ac = (() => {
  class e {
    static __NG_ELEMENT_ID__ = DI;
  }
  return e;
})();
function DI() {
  let e = G();
  return Zf(e, v());
}
var wI = ac,
  Qf = class extends wI {
    _lContainer;
    _hostTNode;
    _hostLView;
    constructor(t, n, r) {
      super(),
        (this._lContainer = t),
        (this._hostTNode = n),
        (this._hostLView = r);
    }
    get element() {
      return Jt(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new rt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = Ra(this._hostTNode, this._hostLView);
      if (yd(t)) {
        let n = Kr(t, this._hostLView),
          r = Yr(t),
          o = n[y].data[r + 8];
        return new rt(o, n);
      } else return new rt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = Zl(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - z;
    }
    createEmbeddedView(t, n, r) {
      let o, i;
      typeof r == "number"
        ? (o = r)
        : r != null && ((o = r.index), (i = r.injector));
      let s = $t(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, i, s);
      return this.insertImpl(a, o, ht(this._hostTNode, s)), a;
    }
    createComponent(t, n, r, o, i) {
      let s = t && !Xg(t),
        a;
      if (s) a = n;
      else {
        let h = n || {};
        (a = h.index),
          (r = h.injector),
          (o = h.projectableNodes),
          (i = h.environmentInjector || h.ngModuleRef);
      }
      let c = s ? t : new Ut(qe(t)),
        l = r || this.parentInjector;
      if (!i && c.ngModule == null) {
        let g = (s ? l : this.parentInjector).get(_e, null);
        g && (i = g);
      }
      let u = qe(c.componentType ?? {}),
        d = $t(this._lContainer, u?.id ?? null),
        p = d?.firstChild ?? null,
        f = c.create(l, o, p, i);
      return this.insertImpl(f.hostView, a, ht(this._hostTNode, d)), f;
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let o = t._lView;
      if (im(o)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let c = o[U],
            l = new Qf(c, c[ee], c[U]);
          l.detach(l.indexOf(t));
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer;
      return nn(s, o, i, r), t.attachToViewContainerRef(), Pu(Zi(s), i, t), t;
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = Zl(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = Tn(this._lContainer, n);
      r && (Wr(Zi(this._lContainer), n), Bo(r[y], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = Tn(this._lContainer, n);
      return r && Wr(Zi(this._lContainer), n) != null ? new xn(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function Zl(e) {
  return e[Qr];
}
function Zi(e) {
  return e[Qr] || (e[Qr] = []);
}
function Zf(e, t) {
  let n,
    r = t[e.index];
  return (
    be(r) ? (n = r) : ((n = Ff(r, t, null, e)), (t[e.index] = n), Za(t, n)),
    Yf(n, t, e, r),
    new Qf(n, e, t)
  );
}
function bI(e, t) {
  let n = e[k],
    r = n.createComment(""),
    o = me(t, e),
    i = n.parentNode(o);
  return so(n, i, r, n.nextSibling(o), !1), r;
}
var Yf = Kf,
  cc = () => !1;
function MI(e, t, n) {
  return cc(e, t, n);
}
function Kf(e, t, n, r) {
  if (e[Oe]) return;
  let o;
  n.type & 8 ? (o = ge(r)) : (o = bI(t, n)), (e[Oe] = o);
}
function CI(e, t, n) {
  if (e[Oe] && e[Se]) return !0;
  let r = n[ue],
    o = t.index - P;
  if (!r || ry(t) || Ln(r, o)) return !1;
  let s = Cs(r, o),
    a = r.data[La]?.[o],
    [c, l] = JE(s, a);
  return (e[Oe] = c), (e[Se] = l), !0;
}
function _I(e, t, n, r) {
  cc(e, n, t) || Kf(e, t, n, r);
}
function TI() {
  (Yf = _I), (cc = CI);
}
var Fs = class e {
    queryList;
    matches = null;
    constructor(t) {
      this.queryList = t;
    }
    clone() {
      return new e(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  Vs = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    createEmbeddedView(t) {
      let n = t.queries;
      if (n !== null) {
        let r = t.contentQueries !== null ? t.contentQueries[0] : n.length,
          o = [];
        for (let i = 0; i < r; i++) {
          let s = n.getByIndex(i),
            a = this.queries[s.indexInDeclarationView];
          o.push(a.clone());
        }
        return new e(o);
      }
      return null;
    }
    insertView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    detachView(t) {
      this.dirtyQueriesWithMatches(t);
    }
    finishViewCreation(t) {
      this.dirtyQueriesWithMatches(t);
    }
    dirtyQueriesWithMatches(t) {
      for (let n = 0; n < this.queries.length; n++)
        lc(t, n).matches !== null && this.queries[n].setDirty();
    }
  },
  po = class {
    flags;
    read;
    predicate;
    constructor(t, n, r = null) {
      (this.flags = n),
        (this.read = r),
        typeof t == "string" ? (this.predicate = PI(t)) : (this.predicate = t);
    }
  },
  js = class e {
    queries;
    constructor(t = []) {
      this.queries = t;
    }
    elementStart(t, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].elementStart(t, n);
    }
    elementEnd(t) {
      for (let n = 0; n < this.queries.length; n++)
        this.queries[n].elementEnd(t);
    }
    embeddedTView(t) {
      let n = null;
      for (let r = 0; r < this.length; r++) {
        let o = n !== null ? n.length : 0,
          i = this.getByIndex(r).embeddedTView(t, o);
        i &&
          ((i.indexInDeclarationView = r), n !== null ? n.push(i) : (n = [i]));
      }
      return n !== null ? new e(n) : null;
    }
    template(t, n) {
      for (let r = 0; r < this.queries.length; r++)
        this.queries[r].template(t, n);
    }
    getByIndex(t) {
      return this.queries[t];
    }
    get length() {
      return this.queries.length;
    }
    track(t) {
      this.queries.push(t);
    }
  },
  Hs = class e {
    metadata;
    matches = null;
    indexInDeclarationView = -1;
    crossesNgTemplate = !1;
    _declarationNodeIndex;
    _appliesToNextNode = !0;
    constructor(t, n = -1) {
      (this.metadata = t), (this._declarationNodeIndex = n);
    }
    elementStart(t, n) {
      this.isApplyingToNode(n) && this.matchTNode(t, n);
    }
    elementEnd(t) {
      this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1);
    }
    template(t, n) {
      this.elementStart(t, n);
    }
    embeddedTView(t, n) {
      return this.isApplyingToNode(t)
        ? ((this.crossesNgTemplate = !0),
          this.addMatch(-t.index, n),
          new e(this.metadata))
        : null;
    }
    isApplyingToNode(t) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let n = this._declarationNodeIndex,
          r = t.parent;
        for (; r !== null && r.type & 8 && r.index !== n; ) r = r.parent;
        return n === (r !== null ? r.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(t, n) {
      let r = this.metadata.predicate;
      if (Array.isArray(r))
        for (let o = 0; o < r.length; o++) {
          let i = r[o];
          this.matchTNodeWithReadOption(t, n, xI(n, i)),
            this.matchTNodeWithReadOption(t, n, Fr(n, t, i, !1, !1));
        }
      else
        r === co
          ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1)
          : this.matchTNodeWithReadOption(t, n, Fr(n, t, r, !1, !1));
    }
    matchTNodeWithReadOption(t, n, r) {
      if (r !== null) {
        let o = this.metadata.read;
        if (o !== null)
          if (o === So || o === ac || (o === co && n.type & 4))
            this.addMatch(n.index, -2);
          else {
            let i = Fr(n, t, o, !1, !1);
            i !== null && this.addMatch(n.index, i);
          }
        else this.addMatch(n.index, r);
      }
    }
    addMatch(t, n) {
      this.matches === null ? (this.matches = [t, n]) : this.matches.push(t, n);
    }
  };
function xI(e, t) {
  let n = e.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
  }
  return null;
}
function NI(e, t) {
  return e.type & 11 ? Jt(e, t) : e.type & 4 ? Wo(e, t) : null;
}
function SI(e, t, n, r) {
  return n === -1 ? NI(t, e) : n === -2 ? OI(e, t, r) : Mn(e, e[y], n, t);
}
function OI(e, t, n) {
  if (n === So) return Jt(t, e);
  if (n === co) return Wo(t, e);
  if (n === ac) return Zf(t, e);
}
function Jf(e, t, n, r) {
  let o = t[Ne].queries[r];
  if (o.matches === null) {
    let i = e.data,
      s = n.matches,
      a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
      let l = s[c];
      if (l < 0) a.push(null);
      else {
        let u = i[l];
        a.push(SI(t, u, s[c + 1], n.metadata.read));
      }
    }
    o.matches = a;
  }
  return o.matches;
}
function Bs(e, t, n, r) {
  let o = e.queries.getByIndex(n),
    i = o.matches;
  if (i !== null) {
    let s = Jf(e, t, o, n);
    for (let a = 0; a < i.length; a += 2) {
      let c = i[a];
      if (c > 0) r.push(s[a / 2]);
      else {
        let l = i[a + 1],
          u = t[-c];
        for (let d = z; d < u.length; d++) {
          let p = u[d];
          p[st] === p[U] && Bs(p[y], p, l, r);
        }
        if (u[Ht] !== null) {
          let d = u[Ht];
          for (let p = 0; p < d.length; p++) {
            let f = d[p];
            Bs(f[y], f, l, r);
          }
        }
      }
    }
  }
  return r;
}
function RI(e, t) {
  return e[Ne].queries[t].queryList;
}
function Xf(e, t, n) {
  let r = new Ds((n & 4) === 4);
  return (
    cm(e, t, r, r.destroy), (t[Ne] ??= new Vs()).queries.push(new Fs(r)) - 1
  );
}
function kI(e, t, n) {
  let r = L();
  return (
    r.firstCreatePass &&
      (ep(r, new po(e, t, n), -1), (t & 2) === 2 && (r.staticViewQueries = !0)),
    Xf(r, v(), t)
  );
}
function AI(e, t, n, r) {
  let o = L();
  if (o.firstCreatePass) {
    let i = G();
    ep(o, new po(t, n, r), i.index),
      LI(o, e),
      (n & 2) === 2 && (o.staticContentQueries = !0);
  }
  return Xf(o, v(), n);
}
function PI(e) {
  return e.split(",").map((t) => t.trim());
}
function ep(e, t, n) {
  e.queries === null && (e.queries = new js()), e.queries.track(new Hs(t, n));
}
function LI(e, t) {
  let n = e.contentQueries || (e.contentQueries = []),
    r = n.length ? n[n.length - 1] : -1;
  t !== r && n.push(e.queries.length - 1, t);
}
function lc(e, t) {
  return e.queries.getByIndex(t);
}
function FI(e, t) {
  let n = e[y],
    r = lc(n, t);
  return r.crossesNgTemplate ? Bs(n, e, t, []) : Jf(n, e, r, t);
}
var Nn = class {},
  VI = class {};
var $s = class extends Nn {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new fo(this);
    constructor(t, n, r, o = !0) {
      super(), (this.ngModuleType = t), (this._parent = n);
      let i = Vu(t);
      (this._bootstrapComponents = df(i.bootstrap)),
        (this._r3Injector = _d(
          t,
          n,
          [
            { provide: Nn, useValue: this },
            { provide: Zo, useValue: this.componentFactoryResolver },
            ...r,
          ],
          X(t),
          new Set(["environment"])
        )),
        o && this.resolveInjectorInitializers();
    }
    resolveInjectorInitializers() {
      this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(this.ngModuleType));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let t = this._r3Injector;
      !t.destroyed && t.destroy(),
        this.destroyCbs.forEach((n) => n()),
        (this.destroyCbs = null);
    }
    onDestroy(t) {
      this.destroyCbs.push(t);
    }
  },
  Us = class extends VI {
    moduleType;
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new $s(this.moduleType, t, []);
    }
  };
var ho = class extends Nn {
  injector;
  componentFactoryResolver = new fo(this);
  instance = null;
  constructor(t) {
    super();
    let n = new Dn(
      [
        ...t.providers,
        { provide: Nn, useValue: this },
        { provide: Zo, useValue: this.componentFactoryResolver },
      ],
      t.parent || Ea(),
      t.debugName,
      new Set(["environment"])
    );
    (this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function tp(e, t, n = null) {
  return new ho({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var jI = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(n) {
      this._injector = n;
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = ya(!1, n.type),
          o =
            r.length > 0
              ? tp([r], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = q({
      token: e,
      providedIn: "environment",
      factory: () => new e(Ue(_e)),
    });
  }
  return e;
})();
function xS(e) {
  return On(() => {
    let t = np(e),
      n = ne(te({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Pd.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: t.standalone
          ? (o) => o.get(jI).getOrCreateStandaloneInjector(n)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || _n.Emulated,
        styles: e.styles || J,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    t.standalone && Et("NgStandalone"), rp(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = Yl(r, !1)), (n.pipeDefs = Yl(r, !0)), (n.id = qI(n)), n
    );
  });
}
function HI(e) {
  return qe(e) || ga(e);
}
function BI(e) {
  return e !== null;
}
function NS(e) {
  return On(() => ({
    type: e.type,
    bootstrap: e.bootstrap || J,
    declarations: e.declarations || J,
    imports: e.imports || J,
    exports: e.exports || J,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function $I(e, t) {
  if (e == null) return Ie;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a,
        c;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i), (c = o[3] || null))
        : ((i = o), (s = o), (a = jo.None), (c = null)),
        (n[i] = [r, a, c]),
        (t[i] = s);
    }
  return n;
}
function UI(e) {
  if (e == null) return Ie;
  let t = {};
  for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
  return t;
}
function SS(e) {
  return On(() => {
    let t = np(e);
    return rp(t), t;
  });
}
function OS(e) {
  return {
    type: e.type,
    name: e.name,
    factory: null,
    pure: e.pure !== !1,
    standalone: e.standalone ?? !0,
    onDestroy: e.type.prototype.ngOnDestroy || null,
  };
}
function np(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputConfig: e.inputs || Ie,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || J,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: $I(e.inputs, t),
    outputs: UI(e.outputs),
    debugInfo: null,
  };
}
function rp(e) {
  e.features?.forEach((t) => t(e));
}
function Yl(e, t) {
  if (!e) return null;
  let n = t ? ju : HI;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(BI);
}
function qI(e) {
  let t = 0,
    n = typeof e.consts == "function" ? "" : e.consts,
    r = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      n,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ];
  for (let i of r.join("|")) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function WI(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function zI(e) {
  let t = WI(e.type),
    n = !0,
    r = [e];
  for (; t; ) {
    let o;
    if (De(e)) o = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new C(903, !1);
      o = t.ɵdir;
    }
    if (o) {
      if (n) {
        r.push(o);
        let s = e;
        (s.inputs = Yi(e.inputs)),
          (s.declaredInputs = Yi(e.declaredInputs)),
          (s.outputs = Yi(e.outputs));
        let a = o.hostBindings;
        a && KI(e, a);
        let c = o.viewQuery,
          l = o.contentQueries;
        if (
          (c && ZI(e, c),
          l && YI(e, l),
          GI(e, o),
          Dg(e.outputs, o.outputs),
          De(o) && o.data.animation)
        ) {
          let u = e.data;
          u.animation = (u.animation || []).concat(o.data.animation);
        }
      }
      let i = o.features;
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s];
          a && a.ngInherit && a(e), a === zI && (n = !1);
        }
    }
    t = Object.getPrototypeOf(t);
  }
  QI(r);
}
function GI(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
    let r = t.inputs[n];
    r !== void 0 &&
      ((e.inputs[n] = r), (e.declaredInputs[n] = t.declaredInputs[n]));
  }
}
function QI(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    (o.hostVars = t += o.hostVars),
      (o.hostAttrs = Bt(o.hostAttrs, (n = Bt(n, o.hostAttrs))));
  }
}
function Yi(e) {
  return e === Ie ? {} : e === J ? [] : e;
}
function ZI(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.viewQuery = t);
}
function YI(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i);
      })
    : (e.contentQueries = t);
}
function KI(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.hostBindings = t);
}
function RS(e) {
  let t = (n) => {
    let r = Array.isArray(e);
    n.hostDirectives === null
      ? ((n.findHostDirectiveDefs = op),
        (n.hostDirectives = r ? e.map(qs) : [e]))
      : r
        ? n.hostDirectives.unshift(...e.map(qs))
        : n.hostDirectives.unshift(e);
  };
  return (t.ngInherit = !0), t;
}
function op(e, t, n) {
  if (e.hostDirectives !== null)
    for (let r of e.hostDirectives)
      if (typeof r == "function") {
        let o = r();
        for (let i of o) Kl(qs(i), t, n);
      } else Kl(r, t, n);
}
function Kl(e, t, n) {
  let r = ga(e.directive);
  JI(r.declaredInputs, e.inputs), op(r, t, n), n.set(r, e), t.push(r);
}
function qs(e) {
  return typeof e == "function"
    ? { directive: W(e), inputs: Ie, outputs: Ie }
    : {
        directive: W(e.directive),
        inputs: Jl(e.inputs),
        outputs: Jl(e.outputs),
      };
}
function Jl(e) {
  if (e === void 0 || e.length === 0) return Ie;
  let t = {};
  for (let n = 0; n < e.length; n += 2) t[e[n]] = e[n + 1];
  return t;
}
function JI(e, t) {
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let r = t[n],
        o = e[n];
      e[r] = o;
    }
}
function ip(e) {
  return uc(e)
    ? Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e)
    : !1;
}
function XI(e, t) {
  if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
  else {
    let n = e[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) t(r.value);
  }
}
function uc(e) {
  return e !== null && (typeof e == "function" || typeof e == "object");
}
function Pe(e, t, n) {
  return (e[t] = n);
}
function Ko(e, t) {
  return e[t];
}
function Z(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function qt(e, t, n, r) {
  let o = Z(e, t, n);
  return Z(e, t + 1, r) || o;
}
function sp(e, t, n, r, o) {
  let i = qt(e, t, n, r);
  return Z(e, t + 2, o) || i;
}
function Jo(e, t, n, r, o, i) {
  let s = qt(e, t, n, r);
  return qt(e, t + 2, o, i) || s;
}
function eD(e, t, n, r, o, i, s, a, c) {
  let l = t.consts,
    u = Vn(t, e, 4, s || null, a || null);
  Ma() && sc(t, n, u, We(l, c), Ja),
    (u.mergedAttrs = Bt(u.mergedAttrs, u.attrs)),
    Oa(t, u);
  let d = (u.tView = Ga(
    2,
    u,
    r,
    o,
    i,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    l,
    null
  ));
  return (
    t.queries !== null &&
      (t.queries.template(t, u), (d.queries = t.queries.embeddedTView(u))),
    u
  );
}
function go(e, t, n, r, o, i, s, a, c, l) {
  let u = n + P,
    d = t.firstCreatePass ? eD(u, t, e, r, o, i, s, a, c) : t.data[u];
  yt(d, !1);
  let p = ap(t, e, d, n);
  xo() && $o(t, e, p, d), Xt(p, e);
  let f = Ff(p, e, p, d);
  return (
    (e[u] = f),
    Za(e, f),
    MI(f, d, e),
    Co(d) && Ho(t, e, d),
    c != null && Ya(e, d, l),
    d
  );
}
function tD(e, t, n, r, o, i, s, a) {
  let c = v(),
    l = L(),
    u = We(l.consts, i);
  return go(c, l, e, t, n, r, o, u, s, a), tD;
}
var ap = cp;
function cp(e, t, n, r) {
  return ze(!0), t[k].createComment("");
}
function nD(e, t, n, r) {
  let o = t[ue],
    i = !o || Yt() || It(n) || Ln(o, r);
  if ((ze(i), i)) return cp(e, t);
  let s = o.data[hy]?.[r] ?? null;
  s !== null &&
    n.tView !== null &&
    n.tView.ssrId === null &&
    (n.tView.ssrId = s);
  let a = zo(o, e, t, n);
  Lo(o, r, a);
  let c = Ha(o, r);
  return Go(c, a);
}
function rD() {
  ap = nD;
}
var oD = (() => {
  class e {
    cachedInjectors = new Map();
    getOrCreateInjector(n, r, o, i) {
      if (!this.cachedInjectors.has(n)) {
        let s = o.length > 0 ? tp(o, r, i) : null;
        this.cachedInjectors.set(n, s);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static ɵprov = q({
      token: e,
      providedIn: "environment",
      factory: () => new e(),
    });
  }
  return e;
})();
var iD = new x("");
function Ki(e, t, n) {
  return e.get(oD).getOrCreateInjector(t, e, n, "");
}
function sD(e, t, n) {
  if (e instanceof Ft) {
    let o = e.injector,
      i = e.parentInjector,
      s = Ki(i, t, n);
    return new Ft(o, s);
  }
  let r = e.get(_e);
  if (r !== e) {
    let o = Ki(r, t, n);
    return new Ft(e, o);
  }
  return Ki(e, t, n);
}
function kt(e, t, n, r = !1) {
  let o = n[U],
    i = o[y];
  if (Qt(o)) return;
  let s = Pn(o, t),
    a = s[ko],
    c = s[Oy];
  if (!(c !== null && e < c) && Xl(a, e) && Xl(s[xy] ?? -1, e)) {
    let l = Ao(i, t),
      d =
        !r &&
        !0 &&
        (Ly(l) !== null || Al(l, B.Loading) !== null || Al(l, B.Placeholder))
          ? lD
          : cD;
    try {
      d(e, s, n, t, o);
    } catch (p) {
      Xa(o, p);
    }
  }
}
function aD(e, t) {
  let n = e[Se]?.findIndex((o) => o.data[vy] === t[ko]) ?? -1;
  return { dehydratedView: n > -1 ? e[Se][n] : null, dehydratedViewIx: n };
}
function cD(e, t, n, r, o) {
  O(20);
  let i = Py(e, o, r);
  if (i !== null) {
    t[ko] = e;
    let s = o[y],
      a = i + P,
      c = kn(s, a),
      l = 0;
    ic(n, l);
    let u;
    if (e === B.Complete) {
      let h = Ao(s, r),
        g = h.providers;
      g && g.length > 0 && (u = sD(o[Te], h, g));
    }
    let { dehydratedView: d, dehydratedViewIx: p } = aD(n, t),
      f = tn(o, c, null, { injector: u, dehydratedView: d });
    if (
      (nn(n, f, l, ht(c, d)),
      qo(f, 2),
      p > -1 && n[Se]?.splice(p, 1),
      (e === B.Complete || e === B.Error) && Array.isArray(t[Lt]))
    ) {
      for (let h of t[Lt]) h();
      t[Lt] = null;
    }
  }
  O(21);
}
function Xl(e, t) {
  return e < t;
}
function eu(e, t, n) {
  e.loadingPromise.then(() => {
    e.loadingState === oe.COMPLETE
      ? kt(B.Complete, t, n)
      : e.loadingState === oe.FAILED && kt(B.Error, t, n);
  });
}
var lD = null;
var kS = (() => {
  class e {
    log(n) {
      console.log(n);
    }
    warn(n) {
      console.warn(n);
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "platform" });
  }
  return e;
})();
var uD = new x("");
var lp = (() => {
    class e {
      static ɵprov = q({
        token: e,
        providedIn: "root",
        factory: () => new Ws(),
      });
    }
    return e;
  })(),
  Ws = class {
    queuedEffectCount = 0;
    queues = new Map();
    schedule(t) {
      this.enqueue(t);
    }
    remove(t) {
      let n = t.zone,
        r = this.queues.get(n);
      r.has(t) && (r.delete(t), this.queuedEffectCount--);
    }
    enqueue(t) {
      let n = t.zone;
      this.queues.has(n) || this.queues.set(n, new Set());
      let r = this.queues.get(n);
      r.has(t) || (this.queuedEffectCount++, r.add(t));
    }
    flush() {
      for (; this.queuedEffectCount > 0; )
        for (let [t, n] of this.queues)
          t === null ? this.flushQueue(n) : t.run(() => this.flushQueue(n));
    }
    flushQueue(t) {
      for (let n of t) t.delete(n), this.queuedEffectCount--, n.run();
    }
  };
function up(e) {
  return !!e && typeof e.then == "function";
}
function dD(e) {
  return !!e && typeof e.subscribe == "function";
}
var dp = new x("");
function AS(e) {
  return ma([{ provide: dp, multi: !0, useValue: e }]);
}
var fp = (() => {
    class e {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((n, r) => {
        (this.resolve = n), (this.reject = r);
      });
      appInits = E(dp, { optional: !0 }) ?? [];
      injector = E(dt);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = qu(this.injector, o);
          if (up(i)) n.push(i);
          else if (dD(i)) {
            let s = new Promise((a, c) => {
              i.subscribe({ complete: a, error: c });
            });
            n.push(s);
          }
        }
        let r = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && r(),
          (this.initialized = !0);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  dc = new x("");
function fD() {
  li(() => {
    throw new C(600, !1);
  });
}
function pD(e) {
  return e.isBoundToModule;
}
var hD = 10;
var Re = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = E(Qm);
    afterRenderManager = E(Gd);
    zonelessEnabled = E(ka);
    rootEffectScheduler = E(lp);
    dirtyFlags = 0;
    tracingSnapshot = null;
    externalTestViews = new Set();
    afterTick = new ve();
    get allViews() {
      return [...this.externalTestViews.keys(), ...this._views];
    }
    get destroyed() {
      return this._destroyed;
    }
    componentTypes = [];
    components = [];
    isStable = E(Kt).hasPendingTasks.pipe(Ve((n) => !n));
    constructor() {
      E(Ro, { optional: !0 });
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    _injector = E(_e);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      return this.bootstrapImpl(n, r);
    }
    bootstrapImpl(n, r, o = dt.NULL) {
      O(10);
      let i = n instanceof qf;
      if (!this._injector.get(fp).done) {
        let f = "";
        throw new C(405, f);
      }
      let a;
      i ? (a = n) : (a = this._injector.get(Zo).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let c = pD(a) ? void 0 : this._injector.get(Nn),
        l = r || a.selector,
        u = a.create(o, [], l, c),
        d = u.location.nativeElement,
        p = u.injector.get(uD, null);
      return (
        p?.registerApplication(d),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            jr(this.components, u),
            p?.unregisterApplication(d);
        }),
        this._loadComponent(u),
        O(11, u),
        u
      );
    }
    tick() {
      this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
    }
    _tick() {
      O(12),
        this.tracingSnapshot !== null
          ? this.tracingSnapshot.run(Fa.CHANGE_DETECTION, this.tickImpl)
          : this.tickImpl();
    }
    tickImpl = () => {
      if (this._runningTick) throw new C(101, !1);
      let n = b(null);
      try {
        (this._runningTick = !0), this.synchronize();
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        (this._runningTick = !1),
          this.tracingSnapshot?.dispose(),
          (this.tracingSnapshot = null),
          b(n),
          this.afterTick.next(),
          O(13);
      }
    };
    synchronize() {
      this._rendererFactory === null &&
        !this._injector.destroyed &&
        (this._rendererFactory = this._injector.get(uo, null, {
          optional: !0,
        }));
      let n = 0;
      for (; this.dirtyFlags !== 0 && n++ < hD; )
        O(14), this.synchronizeOnce(), O(15);
    }
    synchronizeOnce() {
      if (
        (this.dirtyFlags & 16 &&
          ((this.dirtyFlags &= -17), this.rootEffectScheduler.flush()),
        this.dirtyFlags & 7)
      ) {
        let n = !!(this.dirtyFlags & 1);
        (this.dirtyFlags &= -8), (this.dirtyFlags |= 8);
        for (let { _lView: r, notifyErrorHandler: o } of this.allViews)
          gD(r, o, n, this.zonelessEnabled);
        if (
          ((this.dirtyFlags &= -5),
          this.syncDirtyFlagsWithViews(),
          this.dirtyFlags & 23)
        )
          return;
      } else this._rendererFactory?.begin?.(), this._rendererFactory?.end?.();
      this.dirtyFlags & 8 &&
        ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews();
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => _o(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      this._views.push(r), r.attachToAppRef(this);
    }
    detachView(n) {
      let r = n;
      jr(this._views, r), r.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView),
        this.tick(),
        this.components.push(n),
        this._injector.get(dc, []).forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => jr(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new C(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function jr(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function gD(e, t, n, r) {
  if (!n && !_o(e)) return;
  kf(e, t, n && !r ? 0 : 1);
}
function mD(e, t, n) {
  let r = t[Te],
    o = t[y];
  if (e.loadingState !== oe.NOT_STARTED)
    return e.loadingPromise ?? Promise.resolve();
  let i = Pn(t, n),
    s = Fy(o, e);
  (e.loadingState = oe.IN_PROGRESS), Vr(1, i);
  let a = e.dependencyResolverFn,
    c = r.get(Kt),
    l = c.add();
  return a
    ? ((e.loadingPromise = Promise.allSettled(a()).then((u) => {
        let d = !1,
          p = [],
          f = [];
        for (let h of u)
          if (h.status === "fulfilled") {
            let g = h.value,
              R = qe(g) || ga(g);
            if (R) p.push(R);
            else {
              let N = ju(g);
              N && f.push(N);
            }
          } else {
            d = !0;
            break;
          }
        if (((e.loadingPromise = null), c.remove(l), d)) {
          if (((e.loadingState = oe.FAILED), e.errorTmplIndex === null)) {
            let h = "",
              g = new C(-750, !1);
            Xa(t, g);
          }
        } else {
          e.loadingState = oe.COMPLETE;
          let h = s.tView;
          if (p.length > 0) {
            h.directiveRegistry = Pl(h.directiveRegistry, p);
            let g = p.map((N) => N.type),
              R = ya(!1, ...g);
            e.providers = R;
          }
          f.length > 0 && (h.pipeRegistry = Pl(h.pipeRegistry, f));
        }
      })),
      e.loadingPromise)
    : ((e.loadingPromise = Promise.resolve().then(() => {
        (e.loadingPromise = null), (e.loadingState = oe.COMPLETE), c.remove(l);
      })),
      e.loadingPromise);
}
function yD(e, t) {
  return t[Te].get(iD, null, { optional: !0 })?.behavior !== Zd.Manual;
}
function vD(e, t, n) {
  let r = t[y],
    o = t[n.index];
  if (!yD(e, t)) return;
  let i = Pn(t, n),
    s = Ao(r, n);
  switch ((ky(i), s.loadingState)) {
    case oe.NOT_STARTED:
      kt(B.Loading, n, o),
        mD(s, t, n),
        s.loadingState === oe.IN_PROGRESS && eu(s, n, o);
      break;
    case oe.IN_PROGRESS:
      kt(B.Loading, n, o), eu(s, n, o);
      break;
    case oe.COMPLETE:
      kt(B.Complete, n, o);
      break;
    case oe.FAILED:
      kt(B.Error, n, o);
      break;
    default:
  }
}
function ED(e, t, n) {
  return on(this, null, function* () {
    let r = e.get(ja);
    if (r.hydrating.has(t)) return;
    let { parentBlockPromise: i, hydrationQueue: s } = ev(t, e);
    if (s.length === 0) return;
    i !== null && s.shift(), wD(r, s), i !== null && (yield i);
    let a = s[0];
    r.has(a)
      ? yield tu(e, s, n)
      : r.awaitParentBlock(a, () =>
          on(this, null, function* () {
            return yield tu(e, s, n);
          })
        );
  });
}
function tu(e, t, n) {
  return on(this, null, function* () {
    let r = e.get(ja),
      o = r.hydrating,
      i = e.get(Kt),
      s = i.add();
    for (let c = 0; c < t.length; c++) {
      let l = t[c],
        u = r.get(l);
      if (u != null) {
        if ((yield MD(u), yield bD(e), ID(u))) {
          YE(u), nu(t.slice(c), r);
          break;
        }
        o.get(l).resolve();
      } else {
        DD(c, t, r), nu(t.slice(c), r);
        break;
      }
    }
    let a = t[t.length - 1];
    yield o.get(a)?.promise,
      i.remove(s),
      n && n(t),
      KE(r.get(a), t, r, e.get(Re));
  });
}
function ID(e) {
  return Pn(e.lView, e.tNode)[ko] === B.Error;
}
function DD(e, t, n) {
  let r = e - 1,
    o = r > -1 ? n.get(t[r]) : null;
  o && Qo(o.lContainer);
}
function nu(e, t) {
  let n = t.hydrating;
  for (let r in e) n.get(r)?.reject();
  t.cleanup(e);
}
function wD(e, t) {
  for (let n of t) e.hydrating.set(n, Promise.withResolvers());
}
function bD(e) {
  return new Promise((t) => Qd(t, { injector: e }));
}
function MD(e) {
  return on(this, null, function* () {
    let { tNode: t, lView: n } = e,
      r = Pn(n, t);
    return new Promise((o) => {
      CD(r, o), vD(2, n, t);
    });
  });
}
function CD(e, t) {
  Array.isArray(e[Lt]) || (e[Lt] = []), e[Lt].push(t);
}
function _D(e, t, n, r) {
  let o = v(),
    i = vt();
  if (Z(o, i, t)) {
    let s = L(),
      a = To();
    nE(a, o, e, t, n, r);
  }
  return _D;
}
function TD(e, t, n, r) {
  return Z(e, vt(), n) ? t + ot(n) + r : ae;
}
function xD(e, t, n, r, o, i) {
  let s = ym(),
    a = qt(e, s, n, o);
  return Ta(2), a ? t + ot(n) + r + ot(o) + i : ae;
}
function Rr(e, t) {
  return (e << 17) | (t << 2);
}
function gt(e) {
  return (e >> 17) & 32767;
}
function ND(e) {
  return (e & 2) == 2;
}
function SD(e, t) {
  return (e & 131071) | (t << 17);
}
function zs(e) {
  return e | 2;
}
function Wt(e) {
  return (e & 131068) >> 2;
}
function Ji(e, t) {
  return (e & -131069) | (t << 2);
}
function OD(e) {
  return (e & 1) === 1;
}
function Gs(e) {
  return e | 1;
}
function RD(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = gt(s),
    c = Wt(s);
  e[r] = n;
  let l = !1,
    u;
  if (Array.isArray(n)) {
    let d = n;
    (u = d[1]), (u === null || Rn(d, u) > 0) && (l = !0);
  } else u = n;
  if (o)
    if (c !== 0) {
      let p = gt(e[a + 1]);
      (e[r + 1] = Rr(p, a)),
        p !== 0 && (e[p + 1] = Ji(e[p + 1], r)),
        (e[a + 1] = SD(e[a + 1], r));
    } else
      (e[r + 1] = Rr(a, 0)), a !== 0 && (e[a + 1] = Ji(e[a + 1], r)), (a = r);
  else
    (e[r + 1] = Rr(c, 0)),
      a === 0 ? (a = r) : (e[c + 1] = Ji(e[c + 1], r)),
      (c = r);
  l && (e[r + 1] = zs(e[r + 1])),
    ru(e, u, r, !0),
    ru(e, u, r, !1),
    kD(t, u, e, r, i),
    (s = Rr(a, c)),
    i ? (t.classBindings = s) : (t.styleBindings = s);
}
function kD(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == "string" &&
    Rn(i, t) >= 0 &&
    (n[r + 1] = Gs(n[r + 1]));
}
function ru(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? gt(o) : Wt(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let c = e[s],
      l = e[s + 1];
    AD(c, t) && ((a = !0), (e[s + 1] = r ? Gs(l) : zs(l))),
      (s = r ? gt(l) : Wt(l));
  }
  a && (e[n + 1] = r ? zs(o) : Gs(o));
}
function AD(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == "string"
      ? Rn(e, t) >= 0
      : !1;
}
var H = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function pp(e) {
  return e.substring(H.key, H.keyEnd);
}
function PD(e) {
  return e.substring(H.value, H.valueEnd);
}
function LD(e) {
  return mp(e), hp(e, zt(e, 0, H.textEnd));
}
function hp(e, t) {
  let n = H.textEnd;
  return n === t ? -1 : ((t = H.keyEnd = VD(e, (H.key = t), n)), zt(e, t, n));
}
function FD(e) {
  return mp(e), gp(e, zt(e, 0, H.textEnd));
}
function gp(e, t) {
  let n = H.textEnd,
    r = (H.key = zt(e, t, n));
  return n === r
    ? -1
    : ((r = H.keyEnd = jD(e, r, n)),
      (r = ou(e, r, n, 58)),
      (r = H.value = zt(e, r, n)),
      (r = H.valueEnd = HD(e, r, n)),
      ou(e, r, n, 59));
}
function mp(e) {
  (H.key = 0),
    (H.keyEnd = 0),
    (H.value = 0),
    (H.valueEnd = 0),
    (H.textEnd = e.length);
}
function zt(e, t, n) {
  for (; t < n && e.charCodeAt(t) <= 32; ) t++;
  return t;
}
function VD(e, t, n) {
  for (; t < n && e.charCodeAt(t) > 32; ) t++;
  return t;
}
function jD(e, t, n) {
  let r;
  for (
    ;
    t < n &&
    ((r = e.charCodeAt(t)) === 45 ||
      r === 95 ||
      ((r & -33) >= 65 && (r & -33) <= 90) ||
      (r >= 48 && r <= 57));

  )
    t++;
  return t;
}
function ou(e, t, n, r) {
  return (t = zt(e, t, n)), t < n && t++, t;
}
function HD(e, t, n) {
  let r = -1,
    o = -1,
    i = -1,
    s = t,
    a = s;
  for (; s < n; ) {
    let c = e.charCodeAt(s++);
    if (c === 59) return a;
    c === 34 || c === 39
      ? (a = s = iu(e, c, s, n))
      : t === s - 4 && i === 85 && o === 82 && r === 76 && c === 40
        ? (a = s = iu(e, 41, s, n))
        : c > 32 && (a = s),
      (i = o),
      (o = r),
      (r = c & -33);
  }
  return a;
}
function iu(e, t, n, r) {
  let o = -1,
    i = n;
  for (; i < r; ) {
    let s = e.charCodeAt(i++);
    if (s == t && o !== 92) return i;
    s == 92 && o === 92 ? (o = 0) : (o = s);
  }
  throw new Error();
}
function BD(e, t, n) {
  let r = v(),
    o = vt();
  if (Z(r, o, t)) {
    let i = L(),
      s = To();
    Ka(i, s, r, e, t, r[k], n, !1);
  }
  return BD;
}
function Qs(e, t, n, r, o) {
  ec(t, e, n, o ? "class" : "style", r);
}
function $D(e, t, n) {
  return yp(e, t, n, !1), $D;
}
function UD(e, t) {
  return yp(e, t, null, !0), UD;
}
function PS(e) {
  vp(Dp, qD, e, !1);
}
function qD(e, t) {
  for (let n = FD(t); n >= 0; n = gp(t, n)) Dp(e, pp(t), PD(t));
}
function LS(e) {
  vp(KD, WD, e, !0);
}
function WD(e, t) {
  for (let n = LD(t); n >= 0; n = hp(t, n)) bo(e, pp(t), !0);
}
function yp(e, t, n, r) {
  let o = v(),
    i = L(),
    s = Ta(2);
  if ((i.firstUpdatePass && Ip(i, e, s, r), t !== ae && Z(o, s, t))) {
    let a = i.data[ke()];
    wp(i, a, o, o[k], e, (o[s + 1] = XD(t, n)), r, s);
  }
}
function vp(e, t, n, r) {
  let o = L(),
    i = Ta(2);
  o.firstUpdatePass && Ip(o, null, i, r);
  let s = v();
  if (n !== ae && Z(s, i, n)) {
    let a = o.data[ke()];
    if (bp(a, r) && !Ep(o, i)) {
      let c = r ? a.classesWithoutHost : a.stylesWithoutHost;
      c !== null && (n = os(c, n || "")), Qs(o, a, s, n, r);
    } else JD(o, a, s, s[k], s[i + 1], (s[i + 1] = YD(e, t, n)), r, i);
  }
}
function Ep(e, t) {
  return t >= e.expandoStartIndex;
}
function Ip(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[ke()],
      s = Ep(e, n);
    bp(i, r) && t === null && !s && (t = !1),
      (t = zD(o, i, t, r)),
      RD(o, i, t, n, s, r);
  }
}
function zD(e, t, n, r) {
  let o = wm(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = Xi(null, e, t, n, r)), (n = Sn(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = Xi(o, e, t, n, r)), i === null)) {
        let c = GD(e, t, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Xi(null, e, t, c[1], r)),
          (c = Sn(c, t.attrs, r)),
          QD(e, t, r, c));
      } else i = ZD(e, t, r);
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n
  );
}
function GD(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (Wt(r) !== 0) return e[gt(r)];
}
function QD(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[gt(o)] = r;
}
function ZD(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = Sn(r, s, n);
  }
  return Sn(r, t.attrs, n);
}
function Xi(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = Sn(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return e !== null && (n.directiveStylingLast = a), r;
}
function Sn(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number"
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
          bo(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function YD(e, t, n) {
  if (n == null || n === "") return J;
  let r = [],
    o = en(n);
  if (Array.isArray(o)) for (let i = 0; i < o.length; i++) e(r, o[i], !0);
  else if (typeof o == "object")
    for (let i in o) o.hasOwnProperty(i) && e(r, i, o[i]);
  else typeof o == "string" && t(r, o);
  return r;
}
function Dp(e, t, n) {
  bo(e, t, en(n));
}
function KD(e, t, n) {
  let r = String(t);
  r !== "" && !r.includes(" ") && bo(e, r, n);
}
function JD(e, t, n, r, o, i, s, a) {
  o === ae && (o = J);
  let c = 0,
    l = 0,
    u = 0 < o.length ? o[0] : null,
    d = 0 < i.length ? i[0] : null;
  for (; u !== null || d !== null; ) {
    let p = c < o.length ? o[c + 1] : void 0,
      f = l < i.length ? i[l + 1] : void 0,
      h = null,
      g;
    u === d
      ? ((c += 2), (l += 2), p !== f && ((h = d), (g = f)))
      : d === null || (u !== null && u < d)
        ? ((c += 2), (h = u))
        : ((l += 2), (h = d), (g = f)),
      h !== null && wp(e, t, n, r, h, g, s, a),
      (u = c < o.length ? o[c] : null),
      (d = l < i.length ? i[l] : null);
  }
}
function wp(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let c = e.data,
    l = c[a + 1],
    u = OD(l) ? su(c, t, n, o, Wt(l), s) : void 0;
  if (!mo(u)) {
    mo(i) || (ND(l) && (i = su(c, null, n, o, a, s)));
    let d = ed(ke(), n);
    EE(r, s, d, o, i);
  }
}
function su(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      p = n[o + 1];
    p === ae && (p = d ? J : void 0);
    let f = d ? ji(p, r) : u === r ? p : void 0;
    if ((l && !mo(f) && (f = ji(c, r)), mo(f) && ((a = f), s))) return a;
    let h = e[o + 1];
    o = s ? gt(h) : Wt(h);
  }
  if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = ji(c, r));
  }
  return a;
}
function mo(e) {
  return e !== void 0;
}
function XD(e, t) {
  return (
    e == null ||
      e === "" ||
      (typeof t == "string"
        ? (e = e + t)
        : typeof e == "object" && (e = X(en(e)))),
    e
  );
}
function bp(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
var Zs = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      this.attach(r, i), this.attach(o, s);
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function es(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function ew(e, t, n) {
  let r,
    o,
    i = 0,
    s = e.length - 1,
    a = void 0;
  if (Array.isArray(t)) {
    let c = t.length - 1;
    for (; i <= s && i <= c; ) {
      let l = e.at(i),
        u = t[i],
        d = es(i, l, i, u, n);
      if (d !== 0) {
        d < 0 && e.updateValue(i, u), i++;
        continue;
      }
      let p = e.at(s),
        f = t[c],
        h = es(s, p, c, f, n);
      if (h !== 0) {
        h < 0 && e.updateValue(s, f), s--, c--;
        continue;
      }
      let g = n(i, l),
        R = n(s, p),
        N = n(i, u);
      if (Object.is(N, R)) {
        let rn = n(c, f);
        Object.is(rn, g)
          ? (e.swap(i, s), e.updateValue(s, f), c--, s--)
          : e.move(s, i),
          e.updateValue(i, u),
          i++;
        continue;
      }
      if (((r ??= new yo()), (o ??= cu(e, i, s, n)), Ys(e, r, i, N)))
        e.updateValue(i, u), i++, s++;
      else if (o.has(N)) r.set(g, e.detach(i)), s--;
      else {
        let rn = e.create(i, t[i]);
        e.attach(i, rn), i++, s++;
      }
    }
    for (; i <= c; ) au(e, r, n, i, t[i]), i++;
  } else if (t != null) {
    let c = t[Symbol.iterator](),
      l = c.next();
    for (; !l.done && i <= s; ) {
      let u = e.at(i),
        d = l.value,
        p = es(i, u, i, d, n);
      if (p !== 0) p < 0 && e.updateValue(i, d), i++, (l = c.next());
      else {
        (r ??= new yo()), (o ??= cu(e, i, s, n));
        let f = n(i, d);
        if (Ys(e, r, i, f)) e.updateValue(i, d), i++, s++, (l = c.next());
        else if (!o.has(f))
          e.attach(i, e.create(i, d)), i++, s++, (l = c.next());
        else {
          let h = n(i, u);
          r.set(h, e.detach(i)), s--;
        }
      }
    }
    for (; !l.done; ) au(e, r, n, e.length, l.value), (l = c.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((c) => {
    e.destroy(c);
  });
}
function Ys(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function au(e, t, n, r, o) {
  if (Ys(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function cu(e, t, n, r) {
  let o = new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var yo = class {
  kvMap = new Map();
  _vMap = void 0;
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) (r = o.get(r)), t(r, n);
      }
  }
};
function FS(e, t) {
  Et("NgControlFlow");
  let n = v(),
    r = vt(),
    o = n[r] !== ae ? n[r] : -1,
    i = o !== -1 ? vo(n, P + o) : void 0,
    s = 0;
  if (Z(n, r, e)) {
    let a = b(null);
    try {
      if ((i !== void 0 && ic(i, s), e !== -1)) {
        let c = P + e,
          l = vo(n, c),
          u = ea(n[y], c),
          d = $t(l, u.tView.ssrId),
          p = tn(n, u, t, { dehydratedView: d });
        nn(l, p, s, ht(u, d));
      }
    } finally {
      b(a);
    }
  } else if (i !== void 0) {
    let a = Vf(i, s);
    a !== void 0 && (a[$] = t);
  }
}
var Ks = class {
  lContainer;
  $implicit;
  $index;
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - z;
  }
};
function VS(e) {
  return e;
}
function jS(e, t) {
  return t;
}
var Js = class {
  hasEmptyBlock;
  trackByFn;
  liveCollection;
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function HS(e, t, n, r, o, i, s, a, c, l, u, d, p) {
  Et("NgControlFlow");
  let f = v(),
    h = L(),
    g = c !== void 0,
    R = v(),
    N = a ? s.bind(R[Q][$]) : s,
    rn = new Js(g, N);
  (R[P + e] = rn),
    go(f, h, e + 1, t, n, r, o, We(h.consts, i)),
    g && go(f, h, e + 2, c, l, u, d, We(h.consts, p));
}
var Xs = class extends Zs {
  lContainer;
  hostLView;
  templateTNode;
  operationsCounter = void 0;
  needsIndexUpdate = !1;
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r);
  }
  get length() {
    return this.lContainer.length - z;
  }
  at(t) {
    return this.getLView(t)[$].$implicit;
  }
  attach(t, n) {
    let r = n[ue];
    (this.needsIndexUpdate ||= t !== this.length),
      nn(this.lContainer, n, t, ht(this.templateTNode, r));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), tw(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = $t(this.lContainer, this.templateTNode.tView.ssrId),
      o = tn(
        this.hostLView,
        this.templateTNode,
        new Ks(this.lContainer, n, t),
        { dehydratedView: r }
      );
    return this.operationsCounter?.recordCreate(), o;
  }
  destroy(t) {
    Bo(t[y], t), this.operationsCounter?.recordDestroy();
  }
  updateValue(t, n) {
    this.getLView(t)[$].$implicit = n;
  }
  reset() {
    (this.needsIndexUpdate = !1), this.operationsCounter?.reset();
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[$].$index = t;
  }
  getLView(t) {
    return nw(this.lContainer, t);
  }
};
function BS(e) {
  let t = b(null),
    n = ke();
  try {
    let r = v(),
      o = r[y],
      i = r[n],
      s = n + 1,
      a = vo(r, s);
    if (i.liveCollection === void 0) {
      let l = ea(o, s);
      i.liveCollection = new Xs(a, r, l);
    } else i.liveCollection.reset();
    let c = i.liveCollection;
    if ((ew(c, e, i.trackByFn), c.updateIndexes(), i.hasEmptyBlock)) {
      let l = vt(),
        u = c.length === 0;
      if (Z(r, l, u)) {
        let d = n + 2,
          p = vo(r, d);
        if (u) {
          let f = ea(o, d),
            h = $t(p, f.tView.ssrId),
            g = tn(r, f, void 0, { dehydratedView: h });
          nn(p, g, 0, ht(f, h));
        } else ic(p, 0);
      }
    }
  } finally {
    b(t);
  }
}
function vo(e, t) {
  return e[t];
}
function tw(e, t) {
  return Tn(e, t);
}
function nw(e, t) {
  return Vf(e, t);
}
function ea(e, t) {
  return kn(e, t);
}
function Mp(e, t, n, r) {
  let o = v(),
    i = L(),
    s = P + e,
    a = o[k],
    c = i.firstCreatePass ? zf(s, i, o, t, Ja, Ma(), n, r) : i.data[s],
    l = _p(i, o, c, a, t, e);
  o[s] = l;
  let u = Co(c);
  return (
    yt(c, !0),
    vf(a, l, c),
    !It(c) && xo() && $o(i, o, l, c),
    (lm() === 0 || u) && Xt(l, o),
    um(),
    u && (Ho(i, o, c), Ba(i, c, o)),
    r !== null && Ya(o, c),
    Mp
  );
}
function Cp() {
  let e = G();
  Ca() ? _a() : ((e = e.parent), yt(e, !1));
  let t = e;
  fm(t) && hm(), dm();
  let n = L();
  return (
    n.firstCreatePass && Gf(n, t),
    t.classesWithoutHost != null &&
      Tm(t) &&
      Qs(n, t, v(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      xm(t) &&
      Qs(n, t, v(), t.stylesWithoutHost, !1),
    Cp
  );
}
function rw(e, t, n, r) {
  return Mp(e, t, n, r), Cp(), rw;
}
var _p = (e, t, n, r, o, i) => (ze(!0), Wa(r, o, pd()));
function ow(e, t, n, r, o, i) {
  let s = t[ue],
    a = !s || Yt() || It(n) || Ln(s, i);
  if ((ze(a), a)) return Wa(r, o, pd());
  let c = zo(s, e, t, n);
  return (
    tf(s, i) && Lo(s, i, c.nextSibling),
    s && (kd(n) || Ad(c)) && mt(n) && (pm(n), yf(c)),
    c
  );
}
function iw() {
  _p = ow;
}
function sw(e, t, n, r, o) {
  let i = t.consts,
    s = We(i, r),
    a = Vn(t, e, 8, "ng-container", s);
  s !== null && Ps(a, s, !0);
  let c = We(i, o);
  return (
    Ma() && sc(t, n, a, c, Ja),
    (a.mergedAttrs = Bt(a.mergedAttrs, a.attrs)),
    t.queries !== null && t.queries.elementStart(t, a),
    a
  );
}
function Tp(e, t, n) {
  let r = v(),
    o = L(),
    i = e + P,
    s = o.firstCreatePass ? sw(i, o, r, t, n) : o.data[i];
  yt(s, !0);
  let a = Np(o, r, s, e);
  return (
    (r[i] = a),
    xo() && $o(o, r, a, s),
    Xt(a, r),
    Co(s) && (Ho(o, r, s), Ba(o, s, r)),
    n != null && Ya(r, s),
    Tp
  );
}
function xp() {
  let e = G(),
    t = L();
  return (
    Ca() ? _a() : ((e = e.parent), yt(e, !1)),
    t.firstCreatePass && (Oa(t, e), Ia(e) && t.queries.elementEnd(e)),
    xp
  );
}
function aw(e, t, n) {
  return Tp(e, t, n), xp(), aw;
}
var Np = (e, t, n, r) => (ze(!0), gf(t[k], ""));
function cw(e, t, n, r) {
  let o,
    i = t[ue],
    s = !i || Yt() || Ln(i, r) || It(n);
  if ((ze(s), s)) return gf(t[k], "");
  let a = zo(i, e, t, n),
    c = Jy(i, r);
  return Lo(i, r, a), (o = Go(c, a)), o;
}
function lw() {
  Np = cw;
}
function $S() {
  return v();
}
function uw(e, t, n) {
  let r = v(),
    o = vt();
  if (Z(r, o, t)) {
    let i = L(),
      s = To();
    Ka(i, s, r, e, t, r[k], n, !0);
  }
  return uw;
}
var tt = void 0;
function dw(e) {
  let t = Math.floor(Math.abs(e)),
    n = e.toString().replace(/^[^.]*\.?/, "").length;
  return t === 1 && n === 0 ? 1 : 5;
}
var fw = [
    "en",
    [["a", "p"], ["AM", "PM"], tt],
    [["AM", "PM"], tt, tt],
    [
      ["S", "M", "T", "W", "T", "F", "S"],
      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    ],
    tt,
    [
      ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    ],
    tt,
    [
      ["B", "A"],
      ["BC", "AD"],
      ["Before Christ", "Anno Domini"],
    ],
    0,
    [6, 0],
    ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
    ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
    ["{1}, {0}", tt, "{1} 'at' {0}", tt],
    [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"],
    ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"],
    "USD",
    "$",
    "US Dollar",
    {},
    "ltr",
    dw,
  ],
  ts = {};
function US(e) {
  let t = hw(e),
    n = lu(t);
  if (n) return n;
  let r = t.split("-")[0];
  if (((n = lu(r)), n)) return n;
  if (r === "en") return fw;
  throw new C(701, !1);
}
function lu(e) {
  return (
    e in ts ||
      (ts[e] =
        He.ng &&
        He.ng.common &&
        He.ng.common.locales &&
        He.ng.common.locales[e]),
    ts[e]
  );
}
var pw = (function (e) {
  return (
    (e[(e.LocaleId = 0)] = "LocaleId"),
    (e[(e.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
    (e[(e.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
    (e[(e.DaysFormat = 3)] = "DaysFormat"),
    (e[(e.DaysStandalone = 4)] = "DaysStandalone"),
    (e[(e.MonthsFormat = 5)] = "MonthsFormat"),
    (e[(e.MonthsStandalone = 6)] = "MonthsStandalone"),
    (e[(e.Eras = 7)] = "Eras"),
    (e[(e.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
    (e[(e.WeekendRange = 9)] = "WeekendRange"),
    (e[(e.DateFormat = 10)] = "DateFormat"),
    (e[(e.TimeFormat = 11)] = "TimeFormat"),
    (e[(e.DateTimeFormat = 12)] = "DateTimeFormat"),
    (e[(e.NumberSymbols = 13)] = "NumberSymbols"),
    (e[(e.NumberFormats = 14)] = "NumberFormats"),
    (e[(e.CurrencyCode = 15)] = "CurrencyCode"),
    (e[(e.CurrencySymbol = 16)] = "CurrencySymbol"),
    (e[(e.CurrencyName = 17)] = "CurrencyName"),
    (e[(e.Currencies = 18)] = "Currencies"),
    (e[(e.Directionality = 19)] = "Directionality"),
    (e[(e.PluralCase = 20)] = "PluralCase"),
    (e[(e.ExtraData = 21)] = "ExtraData"),
    e
  );
})(pw || {});
function hw(e) {
  return e.toLowerCase().replace(/_/g, "-");
}
var Eo = "en-US",
  gw = "USD";
var mw = Eo;
function yw(e) {
  typeof e == "string" && (mw = e.toLowerCase().replace(/_/g, "-"));
}
function uu(e, t, n) {
  return function r(o) {
    if (o === Function) return n;
    let i = mt(e) ? we(e.index, t) : t;
    qo(i, 5);
    let s = t[$],
      a = du(t, s, n, o),
      c = r.__ngNextListenerFn__;
    for (; c; ) (a = du(t, s, c, o) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function du(e, t, n, r) {
  let o = b(null);
  try {
    return O(6, t, n), n(r) !== !1;
  } catch (i) {
    return vw(e, i), !1;
  } finally {
    O(7, t, n), b(o);
  }
}
function vw(e, t) {
  let n = e[Te],
    r = n ? n.get(pt, null) : null;
  r && r.handleError(t);
}
function fu(e, t, n, r, o, i) {
  let s = t[n],
    a = t[y],
    l = a.data[n].outputs[r],
    u = s[l],
    d = a.firstCreatePass ? ba(a) : null,
    p = wa(t),
    f = u.subscribe(i),
    h = p.length;
  p.push(i, f), d && d.push(o, e.index, h, -(h + 1));
}
var Sp = (e, t, n) => {};
function pu(e) {
  Sp = e;
}
function Ew(e, t, n, r) {
  let o = v(),
    i = L(),
    s = G();
  return Op(i, o, o[k], s, e, t, r), Ew;
}
function Iw(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[Gr],
          c = o[i + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (i += 2);
    }
  return null;
}
function Op(e, t, n, r, o, i, s) {
  let a = Co(r),
    l = e.firstCreatePass ? ba(e) : null,
    u = wa(t),
    d = !0;
  if (r.type & 3 || s) {
    let p = me(r, t),
      f = s ? s(p) : p,
      h = u.length,
      g = s ? (N) => s(ge(N[r.index])) : r.index,
      R = null;
    if ((!s && a && (R = Iw(e, t, o, r.index)), R !== null)) {
      let N = R.__ngLastListenerFn__ || R;
      (N.__ngNextListenerFn__ = i), (R.__ngLastListenerFn__ = i), (d = !1);
    } else {
      (i = uu(r, t, i)), Sp(f, o, i);
      let N = n.listen(f, o, i);
      u.push(i, N), l && l.push(o, g, h, h + 1);
    }
  } else i = uu(r, t, i);
  if (d) {
    let p = r.outputs?.[o],
      f = r.hostDirectiveOutputs?.[o];
    if (f && f.length)
      for (let h = 0; h < f.length; h += 2) {
        let g = f[h],
          R = f[h + 1];
        fu(r, t, g, R, o, i);
      }
    if (p && p.length) for (let h of p) fu(r, t, h, o, o, i);
  }
}
function qS(e = 1) {
  return Mm(e);
}
function Dw(e, t) {
  let n = null,
    r = Av(e);
  for (let o = 0; o < t.length; o++) {
    let i = t[o];
    if (i === "*") {
      n = o;
      continue;
    }
    if (r === null ? pf(e, i, !0) : Fv(r, i)) return o;
  }
  return n;
}
function WS(e) {
  let t = v()[Q][ee];
  if (!t.projection) {
    let n = e ? e.length : 1,
      r = (t.projection = Hg(n, null)),
      o = r.slice(),
      i = t.child;
    for (; i !== null; ) {
      if (i.type !== 128) {
        let s = e ? Dw(i, e) : 0;
        s !== null &&
          (o[s] ? (o[s].projectionNext = i) : (r[s] = i), (o[s] = i));
      }
      i = i.next;
    }
  }
}
function zS(e, t = 0, n, r, o, i) {
  let s = v(),
    a = L(),
    c = r ? e + 1 : null;
  c !== null && go(s, a, c, r, o, i, null, n);
  let l = Vn(a, P + e, 16, null, n || null);
  l.projection === null && (l.projection = t), _a();
  let d = !s[ue] || Yt();
  s[Q][ee].projection[l.projection] === null && c !== null
    ? ww(s, a, c)
    : d && !It(l) && yE(a, s, l);
}
function ww(e, t, n) {
  let r = P + n,
    o = t.data[r],
    i = e[r],
    s = $t(i, o.tView.ssrId),
    a = tn(e, o, void 0, { dehydratedView: s });
  nn(i, a, 0, ht(o, s));
}
function GS(e, t, n, r) {
  AI(e, t, n, r);
}
function QS(e, t, n) {
  kI(e, t, n);
}
function ZS(e) {
  let t = v(),
    n = L(),
    r = ad();
  xa(r + 1);
  let o = lc(n, r);
  if (e.dirty && om(t) === ((o.metadata.flags & 2) === 2)) {
    if (o.matches === null) e.reset([]);
    else {
      let i = FI(t, r);
      e.reset(i, Km), e.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function YS() {
  return RI(v(), ad());
}
function bw(e, t, n, r) {
  n >= e.data.length && ((e.data[n] = null), (e.blueprint[n] = null)),
    (t[n] = r);
}
function KS(e) {
  let t = mm();
  return td(t, P + e);
}
function JS(e, t = "") {
  let n = v(),
    r = L(),
    o = e + P,
    i = r.firstCreatePass ? Vn(r, o, 1, t, null) : r.data[o],
    s = Rp(r, n, i, t, e);
  (n[o] = s), xo() && $o(r, n, s, i), yt(i, !1);
}
var Rp = (e, t, n, r, o) => (ze(!0), hf(t[k], r));
function Mw(e, t, n, r, o) {
  let i = t[ue],
    s = !i || Yt() || It(n) || Ln(i, o);
  return ze(s), s ? hf(t[k], r) : zo(i, e, t, n);
}
function Cw() {
  Rp = Mw;
}
function _w(e) {
  return kp("", e, ""), _w;
}
function kp(e, t, n) {
  let r = v(),
    o = TD(r, e, t, n);
  return o !== ae && Ap(r, ke(), o), kp;
}
function Tw(e, t, n, r, o) {
  let i = v(),
    s = xD(i, e, t, n, r, o);
  return s !== ae && Ap(i, ke(), s), Tw;
}
function Ap(e, t, n) {
  let r = ed(t, e);
  Bv(e[k], r, n);
}
function xw(e, t, n) {
  Rd(t) && (t = t());
  let r = v(),
    o = vt();
  if (Z(r, o, t)) {
    let i = L(),
      s = To();
    Ka(i, s, r, e, t, r[k], n, !1);
  }
  return xw;
}
function XS(e, t) {
  let n = Rd(e);
  return n && e.set(t), n;
}
function Nw(e, t) {
  let n = v(),
    r = L(),
    o = G();
  return Op(r, n, n[k], o, e, t), Nw;
}
function Sw(e, t, n) {
  let r = L();
  if (r.firstCreatePass) {
    let o = De(e);
    ta(n, r.data, r.blueprint, o, !0), ta(t, r.data, r.blueprint, o, !1);
  }
}
function ta(e, t, n, r, o) {
  if (((e = W(e)), Array.isArray(e)))
    for (let i = 0; i < e.length; i++) ta(e[i], t, n, r, o);
  else {
    let i = L(),
      s = v(),
      a = G(),
      c = jt(e) ? e : W(e.provide),
      l = Uu(e),
      u = a.providerIndexes & 1048575,
      d = a.directiveStart,
      p = a.providerIndexes >> 20;
    if (jt(e) || !e.multi) {
      let f = new ut(l, o, Yo),
        h = rs(c, t, o ? u : u + p, d);
      h === -1
        ? (ms(Xr(a, s), i, c),
          ns(i, e, t.length),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(f),
          s.push(f))
        : ((n[h] = f), (s[h] = f));
    } else {
      let f = rs(c, t, u + p, d),
        h = rs(c, t, u, u + p),
        g = f >= 0 && n[f],
        R = h >= 0 && n[h];
      if ((o && !R) || (!o && !g)) {
        ms(Xr(a, s), i, c);
        let N = kw(o ? Rw : Ow, n.length, o, r, l);
        !o && R && (n[h].providerFactory = N),
          ns(i, e, t.length, 0),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(N),
          s.push(N);
      } else {
        let N = Pp(n[o ? h : f], l, !o && r);
        ns(i, e, f > -1 ? f : h, N);
      }
      !o && r && R && n[h].componentProviders++;
    }
  }
}
function ns(e, t, n, r) {
  let o = jt(t),
    i = Gg(t);
  if (o || i) {
    let c = (i ? W(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
      let l = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let u = l.indexOf(n);
        u === -1 ? l.push(n, [r, c]) : l[u + 1].push(r, c);
      } else l.push(n, c);
    }
  }
}
function Pp(e, t, n) {
  return n && e.componentProviders++, e.multi.push(t) - 1;
}
function rs(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function Ow(e, t, n, r) {
  return na(this.multi, []);
}
function Rw(e, t, n, r) {
  let o = this.multi,
    i;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Mn(n, n[y], this.providerFactory.index, r);
    (i = a.slice(0, s)), na(o, i);
    for (let c = s; c < a.length; c++) i.push(a[c]);
  } else (i = []), na(o, i);
  return i;
}
function na(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function kw(e, t, n, r, o) {
  let i = new ut(e, n, Yo);
  return (
    (i.multi = []),
    (i.index = t),
    (i.componentProviders = 0),
    Pp(i, o, r && !n),
    i
  );
}
function eO(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => Sw(r, o ? o(e) : e, t);
  };
}
function tO(e, t, n) {
  let r = Me() + e,
    o = v();
  return o[r] === ae ? Pe(o, r, n ? t.call(n) : t()) : Ko(o, r);
}
function nO(e, t, n, r) {
  return Aw(v(), Me(), e, t, n, r);
}
function rO(e, t, n, r, o) {
  return Pw(v(), Me(), e, t, n, r, o);
}
function oO(e, t, n, r, o, i) {
  return Lw(v(), Me(), e, t, n, r, o, i);
}
function iO(e, t, n, r, o, i, s) {
  return Lp(v(), Me(), e, t, n, r, o, i, s);
}
function sO(e, t, n, r, o, i, s, a) {
  let c = Me() + e,
    l = v(),
    u = Jo(l, c, n, r, o, i);
  return Z(l, c + 4, s) || u
    ? Pe(l, c + 5, a ? t.call(a, n, r, o, i, s) : t(n, r, o, i, s))
    : Ko(l, c + 5);
}
function aO(e, t, n, r, o, i, s, a, c) {
  let l = Me() + e,
    u = v(),
    d = Jo(u, l, n, r, o, i);
  return qt(u, l + 4, s, a) || d
    ? Pe(u, l + 6, c ? t.call(c, n, r, o, i, s, a) : t(n, r, o, i, s, a))
    : Ko(u, l + 6);
}
function cO(e, t, n, r, o, i, s, a, c, l) {
  let u = Me() + e,
    d = v(),
    p = Jo(d, u, n, r, o, i);
  return sp(d, u + 4, s, a, c) || p
    ? Pe(d, u + 7, l ? t.call(l, n, r, o, i, s, a, c) : t(n, r, o, i, s, a, c))
    : Ko(d, u + 7);
}
function lO(e, t, n, r) {
  return Fw(v(), Me(), e, t, n, r);
}
function jn(e, t) {
  let n = e[t];
  return n === ae ? void 0 : n;
}
function Aw(e, t, n, r, o, i) {
  let s = t + n;
  return Z(e, s, o) ? Pe(e, s + 1, i ? r.call(i, o) : r(o)) : jn(e, s + 1);
}
function Pw(e, t, n, r, o, i, s) {
  let a = t + n;
  return qt(e, a, o, i)
    ? Pe(e, a + 2, s ? r.call(s, o, i) : r(o, i))
    : jn(e, a + 2);
}
function Lw(e, t, n, r, o, i, s, a) {
  let c = t + n;
  return sp(e, c, o, i, s)
    ? Pe(e, c + 3, a ? r.call(a, o, i, s) : r(o, i, s))
    : jn(e, c + 3);
}
function Lp(e, t, n, r, o, i, s, a, c) {
  let l = t + n;
  return Jo(e, l, o, i, s, a)
    ? Pe(e, l + 4, c ? r.call(c, o, i, s, a) : r(o, i, s, a))
    : jn(e, l + 4);
}
function Fw(e, t, n, r, o, i) {
  let s = t + n,
    a = !1;
  for (let c = 0; c < o.length; c++) Z(e, s++, o[c]) && (a = !0);
  return a ? Pe(e, s, r.apply(i, o)) : jn(e, s);
}
function uO(e, t) {
  let n = L(),
    r,
    o = e + P;
  n.firstCreatePass
    ? ((r = Vw(t, n.pipeRegistry)),
      (n.data[o] = r),
      r.onDestroy && (n.destroyHooks ??= []).push(o, r.onDestroy))
    : (r = n.data[o]);
  let i = r.factory || (r.factory = it(r.type, !0)),
    s,
    a = K(Yo);
  try {
    let c = Jr(!1),
      l = i();
    return Jr(c), bw(n, v(), o, l), l;
  } finally {
    K(a);
  }
}
function Vw(e, t) {
  if (t)
    for (let n = t.length - 1; n >= 0; n--) {
      let r = t[n];
      if (e === r.name) return r;
    }
}
function dO(e, t, n, r, o, i) {
  let s = e + P,
    a = v(),
    c = td(a, s);
  return jw(a, s)
    ? Lp(a, Me(), t, c.transform, n, r, o, i, c)
    : c.transform(n, r, o, i);
}
function jw(e, t) {
  return e[y].data[t].pure;
}
function fO(e, t) {
  return Wo(e, t);
}
var ra = class {
    ngModuleFactory;
    componentFactories;
    constructor(t, n) {
      (this.ngModuleFactory = t), (this.componentFactories = n);
    }
  },
  pO = (() => {
    class e {
      compileModuleSync(n) {
        return new Us(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let r = this.compileModuleSync(n),
          o = Vu(n),
          i = df(o.declarations).reduce((s, a) => {
            let c = qe(a);
            return c && s.push(new Ut(c)), s;
          }, []);
        return new ra(r, i);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })();
var Hw = (() => {
    class e {
      zone = E(ie);
      changeDetectionScheduler = E(ft);
      applicationRef = E(Re);
      _onMicrotaskEmptySubscription;
      initialize() {
        this._onMicrotaskEmptySubscription ||
          (this._onMicrotaskEmptySubscription =
            this.zone.onMicrotaskEmpty.subscribe({
              next: () => {
                this.changeDetectionScheduler.runningTick ||
                  this.zone.run(() => {
                    this.applicationRef.tick();
                  });
              },
            }));
      }
      ngOnDestroy() {
        this._onMicrotaskEmptySubscription?.unsubscribe();
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
    return e;
  })(),
  Bw = new x("", { factory: () => !1 });
function Fp({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new ie(ne(te({}, Vp()), { scheduleInRootZone: n }))),
    [
      { provide: ie, useFactory: e },
      {
        provide: Vt,
        multi: !0,
        useFactory: () => {
          let r = E(Hw, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: Vt,
        multi: !0,
        useFactory: () => {
          let r = E($w);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: xd, useValue: !0 } : [],
      { provide: Nd, useValue: n ?? Td },
    ]
  );
}
function hO(e) {
  let t = e?.ignoreChangesOutsideZone,
    n = e?.scheduleInRootZone,
    r = Fp({
      ngZoneFactory: () => {
        let o = Vp(e);
        return (
          (o.scheduleInRootZone = n),
          o.shouldCoalesceEventChangeDetection && Et("NgZone_CoalesceEvent"),
          new ie(o)
        );
      },
      ignoreChangesOutsideZone: t,
      scheduleInRootZone: n,
    });
  return ma([{ provide: Bw, useValue: !0 }, { provide: ka, useValue: !1 }, r]);
}
function Vp(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var $w = (() => {
  class e {
    subscription = new V();
    initialized = !1;
    zone = E(ie);
    pendingTasks = E(Kt);
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              ie.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            ie.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
var Uw = (() => {
  class e {
    appRef = E(Re);
    taskService = E(Kt);
    ngZone = E(ie);
    zonelessEnabled = E(ka);
    tracing = E(Ro, { optional: !0 });
    disableScheduling = E(xd, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new V();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(to) : null;
    scheduleInRootZone =
      !this.zonelessEnabled &&
      this.zoneIsDefined &&
      (E(Nd, { optional: !0 }) ?? !1);
    cancelScheduledCallback = null;
    useMicrotaskScheduler = !1;
    runningTick = !1;
    pendingRenderTaskId = null;
    constructor() {
      this.subscriptions.add(
        this.appRef.afterTick.subscribe(() => {
          this.runningTick || this.cleanup();
        })
      ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          })
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof Is || !this.zoneIsDefined));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      let r = !1;
      switch (n) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 6: {
          (this.appRef.dirtyFlags |= 2), (r = !0);
          break;
        }
        case 12: {
          (this.appRef.dirtyFlags |= 16), (r = !0);
          break;
        }
        case 13: {
          (this.appRef.dirtyFlags |= 2), (r = !0);
          break;
        }
        case 11: {
          r = !0;
          break;
        }
        case 9:
        case 8:
        case 7:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (
        ((this.appRef.tracingSnapshot =
          this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null),
        !this.shouldScheduleTick(r))
      )
        return;
      let o = this.useMicrotaskScheduler ? _l : Sd;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              o(() => this.tick())
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              o(() => this.tick())
            ));
    }
    shouldScheduleTick(n) {
      return !(
        (this.disableScheduling && !n) ||
        this.appRef.destroyed ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(to + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      if (this.appRef.dirtyFlags === 0) {
        this.cleanup();
        return;
      }
      !this.zonelessEnabled &&
        this.appRef.dirtyFlags & 7 &&
        (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick();
          },
          void 0,
          this.schedulerTickApplyArgs
        );
      } catch (r) {
        throw (this.taskService.remove(n), r);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        _l(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(n);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(n);
      }
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = q({ token: e, factory: e.ɵfac, providedIn: "root" });
  }
  return e;
})();
function qw() {
  return (typeof $localize < "u" && $localize.locale) || Eo;
}
var jp = new x("", {
    providedIn: "root",
    factory: () => E(jp, T.Optional | T.SkipSelf) || qw(),
  }),
  gO = new x("", { providedIn: "root", factory: () => gw });
var oa = new x(""),
  Ww = new x("");
function yn(e) {
  return !e.moduleRef;
}
function zw(e) {
  let t = yn(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(ie);
  return n.run(() => {
    yn(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(pt, null),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({
          next: (i) => {
            r.handleError(i);
          },
        });
      }),
      yn(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(oa);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(oa);
      s.add(i),
        e.moduleRef.onDestroy(() => {
          jr(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
    }
    return Qw(r, n, () => {
      let i = t.get(fp);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get(jp, Eo);
          if ((yw(s || Eo), !t.get(Ww, !0)))
            return yn(e)
              ? t.get(Re)
              : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
          if (yn(e)) {
            let c = t.get(Re);
            return (
              e.rootComponent !== void 0 && c.bootstrap(e.rootComponent), c
            );
          } else return Gw(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function Gw(e, t) {
  let n = e.injector.get(Re);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new C(-403, !1);
  t.push(e);
}
function Qw(e, t, n) {
  try {
    let r = n();
    return up(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
var Hr = null;
function Zw(e = [], t) {
  return dt.create({
    name: t,
    providers: [
      { provide: $u, useValue: "platform" },
      { provide: oa, useValue: new Set([() => (Hr = null)]) },
      ...e,
    ],
  });
}
function Yw(e = []) {
  if (Hr) return Hr;
  let t = Zw(e);
  return (Hr = t), fD(), Kw(t), t;
}
function Kw(e) {
  let t = e.get(cy, null);
  qu(e, () => {
    t?.forEach((n) => n());
  });
}
var mO = (() => {
  class e {
    static __NG_ELEMENT_ID__ = Jw;
  }
  return e;
})();
function Jw(e) {
  return Xw(G(), v(), (e & 16) === 16);
}
function Xw(e, t, n) {
  if (mt(e) && !n) {
    let r = we(e.index, t);
    return new xn(r, r);
  } else if (e.type & 175) {
    let r = t[Q];
    return new xn(r, t);
  }
  return null;
}
var ia = class {
    constructor() {}
    supports(t) {
      return ip(t);
    }
    create(t) {
      return new sa(t);
    }
  },
  eb = (e, t) => t,
  sa = class {
    length = 0;
    collection;
    _linkedRecords = null;
    _unlinkedRecords = null;
    _previousItHead = null;
    _itHead = null;
    _itTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _movesHead = null;
    _movesTail = null;
    _removalsHead = null;
    _removalsTail = null;
    _identityChangesHead = null;
    _identityChangesTail = null;
    _trackByFn;
    constructor(t) {
      this._trackByFn = t || eb;
    }
    forEachItem(t) {
      let n;
      for (n = this._itHead; n !== null; n = n._next) t(n);
    }
    forEachOperation(t) {
      let n = this._itHead,
        r = this._removalsHead,
        o = 0,
        i = null;
      for (; n || r; ) {
        let s = !r || (n && n.currentIndex < hu(r, o, i)) ? n : r,
          a = hu(s, o, i),
          c = s.currentIndex;
        if (s === r) o--, (r = r._nextRemoved);
        else if (((n = n._next), s.previousIndex == null)) o++;
        else {
          i || (i = []);
          let l = a - o,
            u = c - o;
          if (l != u) {
            for (let p = 0; p < l; p++) {
              let f = p < i.length ? i[p] : (i[p] = 0),
                h = f + p;
              u <= h && h < l && (i[p] = f + 1);
            }
            let d = s.previousIndex;
            i[d] = u - l;
          }
        }
        a !== c && t(s, a, c);
      }
    }
    forEachPreviousItem(t) {
      let n;
      for (n = this._previousItHead; n !== null; n = n._nextPrevious) t(n);
    }
    forEachAddedItem(t) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n);
    }
    forEachMovedItem(t) {
      let n;
      for (n = this._movesHead; n !== null; n = n._nextMoved) t(n);
    }
    forEachRemovedItem(t) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n);
    }
    forEachIdentityChange(t) {
      let n;
      for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange)
        t(n);
    }
    diff(t) {
      if ((t == null && (t = []), !ip(t))) throw new C(900, !1);
      return this.check(t) ? this : null;
    }
    onDestroy() {}
    check(t) {
      this._reset();
      let n = this._itHead,
        r = !1,
        o,
        i,
        s;
      if (Array.isArray(t)) {
        this.length = t.length;
        for (let a = 0; a < this.length; a++)
          (i = t[a]),
            (s = this._trackByFn(a, i)),
            n === null || !Object.is(n.trackById, s)
              ? ((n = this._mismatch(n, i, s, a)), (r = !0))
              : (r && (n = this._verifyReinsertion(n, i, s, a)),
                Object.is(n.item, i) || this._addIdentityChange(n, i)),
            (n = n._next);
      } else
        (o = 0),
          XI(t, (a) => {
            (s = this._trackByFn(o, a)),
              n === null || !Object.is(n.trackById, s)
                ? ((n = this._mismatch(n, a, s, o)), (r = !0))
                : (r && (n = this._verifyReinsertion(n, a, s, o)),
                  Object.is(n.item, a) || this._addIdentityChange(n, a)),
              (n = n._next),
              o++;
          }),
          (this.length = o);
      return this._truncate(n), (this.collection = t), this.isDirty;
    }
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._movesHead !== null ||
        this._removalsHead !== null ||
        this._identityChangesHead !== null
      );
    }
    _reset() {
      if (this.isDirty) {
        let t;
        for (t = this._previousItHead = this._itHead; t !== null; t = t._next)
          t._nextPrevious = t._next;
        for (t = this._additionsHead; t !== null; t = t._nextAdded)
          t.previousIndex = t.currentIndex;
        for (
          this._additionsHead = this._additionsTail = null, t = this._movesHead;
          t !== null;
          t = t._nextMoved
        )
          t.previousIndex = t.currentIndex;
        (this._movesHead = this._movesTail = null),
          (this._removalsHead = this._removalsTail = null),
          (this._identityChangesHead = this._identityChangesTail = null);
      }
    }
    _mismatch(t, n, r, o) {
      let i;
      return (
        t === null ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
        (t =
          this._unlinkedRecords === null
            ? null
            : this._unlinkedRecords.get(r, null)),
        t !== null
          ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
            this._reinsertAfter(t, i, o))
          : ((t =
              this._linkedRecords === null
                ? null
                : this._linkedRecords.get(r, o)),
            t !== null
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, i, o))
              : (t = this._addAfter(new aa(n, r), i, o))),
        t
      );
    }
    _verifyReinsertion(t, n, r, o) {
      let i =
        this._unlinkedRecords === null
          ? null
          : this._unlinkedRecords.get(r, null);
      return (
        i !== null
          ? (t = this._reinsertAfter(i, t._prev, o))
          : t.currentIndex != o &&
            ((t.currentIndex = o), this._addToMoves(t, o)),
        t
      );
    }
    _truncate(t) {
      for (; t !== null; ) {
        let n = t._next;
        this._addToRemovals(this._unlink(t)), (t = n);
      }
      this._unlinkedRecords !== null && this._unlinkedRecords.clear(),
        this._additionsTail !== null && (this._additionsTail._nextAdded = null),
        this._movesTail !== null && (this._movesTail._nextMoved = null),
        this._itTail !== null && (this._itTail._next = null),
        this._removalsTail !== null && (this._removalsTail._nextRemoved = null),
        this._identityChangesTail !== null &&
          (this._identityChangesTail._nextIdentityChange = null);
    }
    _reinsertAfter(t, n, r) {
      this._unlinkedRecords !== null && this._unlinkedRecords.remove(t);
      let o = t._prevRemoved,
        i = t._nextRemoved;
      return (
        o === null ? (this._removalsHead = i) : (o._nextRemoved = i),
        i === null ? (this._removalsTail = o) : (i._prevRemoved = o),
        this._insertAfter(t, n, r),
        this._addToMoves(t, r),
        t
      );
    }
    _moveAfter(t, n, r) {
      return (
        this._unlink(t), this._insertAfter(t, n, r), this._addToMoves(t, r), t
      );
    }
    _addAfter(t, n, r) {
      return (
        this._insertAfter(t, n, r),
        this._additionsTail === null
          ? (this._additionsTail = this._additionsHead = t)
          : (this._additionsTail = this._additionsTail._nextAdded = t),
        t
      );
    }
    _insertAfter(t, n, r) {
      let o = n === null ? this._itHead : n._next;
      return (
        (t._next = o),
        (t._prev = n),
        o === null ? (this._itTail = t) : (o._prev = t),
        n === null ? (this._itHead = t) : (n._next = t),
        this._linkedRecords === null && (this._linkedRecords = new Io()),
        this._linkedRecords.put(t),
        (t.currentIndex = r),
        t
      );
    }
    _remove(t) {
      return this._addToRemovals(this._unlink(t));
    }
    _unlink(t) {
      this._linkedRecords !== null && this._linkedRecords.remove(t);
      let n = t._prev,
        r = t._next;
      return (
        n === null ? (this._itHead = r) : (n._next = r),
        r === null ? (this._itTail = n) : (r._prev = n),
        t
      );
    }
    _addToMoves(t, n) {
      return (
        t.previousIndex === n ||
          (this._movesTail === null
            ? (this._movesTail = this._movesHead = t)
            : (this._movesTail = this._movesTail._nextMoved = t)),
        t
      );
    }
    _addToRemovals(t) {
      return (
        this._unlinkedRecords === null && (this._unlinkedRecords = new Io()),
        this._unlinkedRecords.put(t),
        (t.currentIndex = null),
        (t._nextRemoved = null),
        this._removalsTail === null
          ? ((this._removalsTail = this._removalsHead = t),
            (t._prevRemoved = null))
          : ((t._prevRemoved = this._removalsTail),
            (this._removalsTail = this._removalsTail._nextRemoved = t)),
        t
      );
    }
    _addIdentityChange(t, n) {
      return (
        (t.item = n),
        this._identityChangesTail === null
          ? (this._identityChangesTail = this._identityChangesHead = t)
          : (this._identityChangesTail =
              this._identityChangesTail._nextIdentityChange =
                t),
        t
      );
    }
  },
  aa = class {
    item;
    trackById;
    currentIndex = null;
    previousIndex = null;
    _nextPrevious = null;
    _prev = null;
    _next = null;
    _prevDup = null;
    _nextDup = null;
    _prevRemoved = null;
    _nextRemoved = null;
    _nextAdded = null;
    _nextMoved = null;
    _nextIdentityChange = null;
    constructor(t, n) {
      (this.item = t), (this.trackById = n);
    }
  },
  ca = class {
    _head = null;
    _tail = null;
    add(t) {
      this._head === null
        ? ((this._head = this._tail = t),
          (t._nextDup = null),
          (t._prevDup = null))
        : ((this._tail._nextDup = t),
          (t._prevDup = this._tail),
          (t._nextDup = null),
          (this._tail = t));
    }
    get(t, n) {
      let r;
      for (r = this._head; r !== null; r = r._nextDup)
        if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, t))
          return r;
      return null;
    }
    remove(t) {
      let n = t._prevDup,
        r = t._nextDup;
      return (
        n === null ? (this._head = r) : (n._nextDup = r),
        r === null ? (this._tail = n) : (r._prevDup = n),
        this._head === null
      );
    }
  },
  Io = class {
    map = new Map();
    put(t) {
      let n = t.trackById,
        r = this.map.get(n);
      r || ((r = new ca()), this.map.set(n, r)), r.add(t);
    }
    get(t, n) {
      let r = t,
        o = this.map.get(r);
      return o ? o.get(t, n) : null;
    }
    remove(t) {
      let n = t.trackById;
      return this.map.get(n).remove(t) && this.map.delete(n), t;
    }
    get isEmpty() {
      return this.map.size === 0;
    }
    clear() {
      this.map.clear();
    }
  };
function hu(e, t, n) {
  let r = e.previousIndex;
  if (r === null) return r;
  let o = 0;
  return n && r < n.length && (o = n[r]), r + t + o;
}
var la = class {
    constructor() {}
    supports(t) {
      return t instanceof Map || uc(t);
    }
    create() {
      return new ua();
    }
  },
  ua = class {
    _records = new Map();
    _mapHead = null;
    _appendAfter = null;
    _previousMapHead = null;
    _changesHead = null;
    _changesTail = null;
    _additionsHead = null;
    _additionsTail = null;
    _removalsHead = null;
    _removalsTail = null;
    get isDirty() {
      return (
        this._additionsHead !== null ||
        this._changesHead !== null ||
        this._removalsHead !== null
      );
    }
    forEachItem(t) {
      let n;
      for (n = this._mapHead; n !== null; n = n._next) t(n);
    }
    forEachPreviousItem(t) {
      let n;
      for (n = this._previousMapHead; n !== null; n = n._nextPrevious) t(n);
    }
    forEachChangedItem(t) {
      let n;
      for (n = this._changesHead; n !== null; n = n._nextChanged) t(n);
    }
    forEachAddedItem(t) {
      let n;
      for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n);
    }
    forEachRemovedItem(t) {
      let n;
      for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n);
    }
    diff(t) {
      if (!t) t = new Map();
      else if (!(t instanceof Map || uc(t))) throw new C(900, !1);
      return this.check(t) ? this : null;
    }
    onDestroy() {}
    check(t) {
      this._reset();
      let n = this._mapHead;
      if (
        ((this._appendAfter = null),
        this._forEach(t, (r, o) => {
          if (n && n.key === o)
            this._maybeAddToChanges(n, r),
              (this._appendAfter = n),
              (n = n._next);
          else {
            let i = this._getOrCreateRecordForKey(o, r);
            n = this._insertBeforeOrAppend(n, i);
          }
        }),
        n)
      ) {
        n._prev && (n._prev._next = null), (this._removalsHead = n);
        for (let r = n; r !== null; r = r._nextRemoved)
          r === this._mapHead && (this._mapHead = null),
            this._records.delete(r.key),
            (r._nextRemoved = r._next),
            (r.previousValue = r.currentValue),
            (r.currentValue = null),
            (r._prev = null),
            (r._next = null);
      }
      return (
        this._changesTail && (this._changesTail._nextChanged = null),
        this._additionsTail && (this._additionsTail._nextAdded = null),
        this.isDirty
      );
    }
    _insertBeforeOrAppend(t, n) {
      if (t) {
        let r = t._prev;
        return (
          (n._next = t),
          (n._prev = r),
          (t._prev = n),
          r && (r._next = n),
          t === this._mapHead && (this._mapHead = n),
          (this._appendAfter = t),
          t
        );
      }
      return (
        this._appendAfter
          ? ((this._appendAfter._next = n), (n._prev = this._appendAfter))
          : (this._mapHead = n),
        (this._appendAfter = n),
        null
      );
    }
    _getOrCreateRecordForKey(t, n) {
      if (this._records.has(t)) {
        let o = this._records.get(t);
        this._maybeAddToChanges(o, n);
        let i = o._prev,
          s = o._next;
        return (
          i && (i._next = s),
          s && (s._prev = i),
          (o._next = null),
          (o._prev = null),
          o
        );
      }
      let r = new da(t);
      return (
        this._records.set(t, r),
        (r.currentValue = n),
        this._addToAdditions(r),
        r
      );
    }
    _reset() {
      if (this.isDirty) {
        let t;
        for (
          this._previousMapHead = this._mapHead, t = this._previousMapHead;
          t !== null;
          t = t._next
        )
          t._nextPrevious = t._next;
        for (t = this._changesHead; t !== null; t = t._nextChanged)
          t.previousValue = t.currentValue;
        for (t = this._additionsHead; t != null; t = t._nextAdded)
          t.previousValue = t.currentValue;
        (this._changesHead = this._changesTail = null),
          (this._additionsHead = this._additionsTail = null),
          (this._removalsHead = null);
      }
    }
    _maybeAddToChanges(t, n) {
      Object.is(n, t.currentValue) ||
        ((t.previousValue = t.currentValue),
        (t.currentValue = n),
        this._addToChanges(t));
    }
    _addToAdditions(t) {
      this._additionsHead === null
        ? (this._additionsHead = this._additionsTail = t)
        : ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
    }
    _addToChanges(t) {
      this._changesHead === null
        ? (this._changesHead = this._changesTail = t)
        : ((this._changesTail._nextChanged = t), (this._changesTail = t));
    }
    _forEach(t, n) {
      t instanceof Map
        ? t.forEach(n)
        : Object.keys(t).forEach((r) => n(t[r], r));
    }
  },
  da = class {
    key;
    previousValue = null;
    currentValue = null;
    _nextPrevious = null;
    _next = null;
    _prev = null;
    _nextAdded = null;
    _nextRemoved = null;
    _nextChanged = null;
    constructor(t) {
      this.key = t;
    }
  };
function gu() {
  return new tb([new ia()]);
}
var tb = (() => {
  class e {
    factories;
    static ɵprov = q({ token: e, providedIn: "root", factory: gu });
    constructor(n) {
      this.factories = n;
    }
    static create(n, r) {
      if (r != null) {
        let o = r.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (r) => e.create(n, r || gu()),
        deps: [[e, new Au(), new ku()]],
      };
    }
    find(n) {
      let r = this.factories.find((o) => o.supports(n));
      if (r != null) return r;
      throw new C(901, !1);
    }
  }
  return e;
})();
function mu() {
  return new nb([new la()]);
}
var nb = (() => {
  class e {
    static ɵprov = q({ token: e, providedIn: "root", factory: mu });
    factories;
    constructor(n) {
      this.factories = n;
    }
    static create(n, r) {
      if (r) {
        let o = r.factories.slice();
        n = n.concat(o);
      }
      return new e(n);
    }
    static extend(n) {
      return {
        provide: e,
        useFactory: (r) => e.create(n, r || mu()),
        deps: [[e, new Au(), new ku()]],
      };
    }
    find(n) {
      let r = this.factories.find((o) => o.supports(n));
      if (r) return r;
      throw new C(901, !1);
    }
  }
  return e;
})();
function yO(e) {
  O(8);
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = Yw(r),
      i = [Fp({}), { provide: ft, useExisting: Uw }, ...(n || [])],
      s = new ho({
        providers: i,
        parent: o,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return zw({
      r3Injector: s.injector,
      platformInjector: o,
      rootComponent: t,
    });
  } catch (t) {
    return Promise.reject(t);
  } finally {
    O(9);
  }
}
var kr = new WeakSet(),
  yu = "",
  Br = [];
function vu(e) {
  return e.get(zd, Iy);
}
function vO() {
  let e = [
    {
      provide: zd,
      useFactory: () => {
        let t = !0;
        {
          let n = E(ro);
          t = !!window._ejsas?.[n];
        }
        return t && Et("NgEventReplay"), t;
      },
    },
  ];
  return (
    e.push(
      {
        provide: Vt,
        useValue: () => {
          let t = E(Re),
            { injector: n } = t;
          if (!kr.has(t)) {
            let r = E(Ol);
            vu(n) &&
              pu((o, i, s) => {
                o.nodeType === Node.ELEMENT_NODE && (Vy(o, i, s), jy(o, r));
              });
          }
        },
        multi: !0,
      },
      {
        provide: dc,
        useFactory: () => {
          let t = E(ro),
            n = E(Re),
            { injector: r } = n;
          return () => {
            !vu(r) ||
              kr.has(n) ||
              (kr.add(n),
              n.onDestroy(() => {
                kr.delete(n), Vi(t), pu(() => {});
              }),
              n.whenStable().then(() => {
                if (n.destroyed) return;
                let o = r.get(By);
                rb(o, r);
                let i = r.get(Ol);
                i.get(yu)?.forEach(Hy), i.delete(yu);
                let s = o.instance;
                Ky(r) ? n.onDestroy(() => s.cleanUp()) : s.cleanUp();
              }));
          };
        },
        multi: !0,
      }
    ),
    e
  );
}
var rb = (e, t) => {
  let n = t.get(ro),
    r = window._ejsas[n],
    o = (e.instance = new dl(new Cr(r.c)));
  for (let a of r.et) o.addEvent(a);
  for (let a of r.etc) o.addEvent(a);
  let i = fl(n);
  o.replayEarlyEventInfos(i), Vi(n);
  let s = new _r((a) => {
    ob(t, a, a.currentTarget);
  });
  ul(o, s);
};
function ob(e, t, n) {
  let r = (n && n.getAttribute(Po)) ?? "";
  /d\d+/.test(r) ? ib(r, e, t, n) : t.eventPhase === Fi.REPLAY && Kd(t, n);
}
function ib(e, t, n, r) {
  Br.push({ event: n, currentTarget: r }), ED(t, e, sb);
}
function sb(e) {
  let t = [...Br],
    n = new Set(e);
  Br = [];
  for (let { event: r, currentTarget: o } of t) {
    let i = o.getAttribute(Po);
    n.has(i) ? Kd(r, o) : Br.push({ event: r, currentTarget: o });
  }
}
var Eu = !1;
function ab() {
  Eu || ((Eu = !0), Gy(), iw(), Cw(), lw(), rD(), TI(), eI(), Yv());
}
function cb(e) {
  return e.whenStable();
}
function EO() {
  let e = [
    {
      provide: xr,
      useFactory: () => {
        let t = !0;
        return (
          (t = !!E(Oo, { optional: !0 })?.get(Jd, null)),
          t && Et("NgHydration"),
          t
        );
      },
    },
    {
      provide: Vt,
      useValue: () => {
        GE(!1), E(xr) && (tv(An()), ab());
      },
      multi: !0,
    },
  ];
  return (
    e.push(
      { provide: Wd, useFactory: () => E(xr) },
      {
        provide: dc,
        useFactory: () => {
          if (E(xr)) {
            let t = E(Re);
            return () => {
              cb(t).then(() => {
                t.destroyed || $f(t);
              });
            };
          }
          return () => {};
        },
        multi: !0,
      }
    ),
    ma(e)
  );
}
function IO(e) {
  return typeof e == "boolean" ? e : e != null && e !== "false";
}
function DO(e, t = NaN) {
  return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t;
}
function wO(e) {
  return fi(e);
}
function bO(e, t) {
  return ci(e, t?.equal);
}
var fa = class {
  [ce];
  constructor(t) {
    this[ce] = t;
  }
  destroy() {
    this[ce].destroy();
  }
};
function lb(e, t) {
  !t?.injector && zu(lb);
  let n = t?.injector ?? E(dt),
    r = t?.manualCleanup !== !0 ? n.get(No) : null,
    o,
    i = n.get(Va, null, { optional: !0 }),
    s = n.get(ft);
  return (
    i !== null && !t?.forceRoot
      ? ((o = fb(i.view, s, e)),
        r instanceof eo && r._lView === i.view && (r = null))
      : (o = pb(e, n.get(lp), s)),
    (o.injector = n),
    r !== null && (o.onDestroyFn = r.onDestroy(() => o.destroy())),
    new fa(o)
  );
}
var Hp = ne(te({}, Dt), {
    consumerIsAlwaysLive: !0,
    consumerAllowSignalWrites: !0,
    dirty: !0,
    hasRun: !1,
    cleanupFns: void 0,
    zone: null,
    kind: "effect",
    onDestroyFn: Cn,
    run() {
      if (((this.dirty = !1), this.hasRun && !qn(this))) return;
      this.hasRun = !0;
      let e = (r) => (this.cleanupFns ??= []).push(r),
        t = cn(this),
        n = Zr(!1);
      try {
        this.maybeCleanup(), this.fn(e);
      } finally {
        Zr(n), Un(this, t);
      }
    },
    maybeCleanup() {
      if (this.cleanupFns?.length)
        try {
          for (; this.cleanupFns.length; ) this.cleanupFns.pop()();
        } finally {
          this.cleanupFns = [];
        }
    },
  }),
  ub = ne(te({}, Hp), {
    consumerMarkedDirty() {
      this.scheduler.schedule(this), this.notifier.notify(12);
    },
    destroy() {
      ln(this),
        this.onDestroyFn(),
        this.maybeCleanup(),
        this.scheduler.remove(this);
    },
  }),
  db = ne(te({}, Hp), {
    consumerMarkedDirty() {
      (this.view[I] |= 8192), Zt(this.view), this.notifier.notify(13);
    },
    destroy() {
      ln(this),
        this.onDestroyFn(),
        this.maybeCleanup(),
        this.view[at]?.delete(this);
    },
  });
function fb(e, t, n) {
  let r = Object.create(db);
  return (
    (r.view = e),
    (r.zone = typeof Zone < "u" ? Zone.current : null),
    (r.notifier = t),
    (r.fn = n),
    (e[at] ??= new Set()),
    e[at].add(r),
    r.consumerMarkedDirty(r),
    r
  );
}
function pb(e, t, n) {
  let r = Object.create(ub);
  return (
    (r.fn = e),
    (r.scheduler = t),
    (r.notifier = n),
    (r.zone = typeof Zone < "u" ? Zone.current : null),
    r.scheduler.schedule(r),
    r.notifier.notify(12),
    r
  );
}
function MO(e) {
  let t = qe(e);
  if (!t) return null;
  let n = new Ut(t);
  return {
    get selector() {
      return n.selector;
    },
    get type() {
      return n.componentType;
    },
    get inputs() {
      return n.inputs;
    },
    get outputs() {
      return n.outputs;
    },
    get ngContentSelectors() {
      return n.ngContentSelectors;
    },
    get isStandalone() {
      return t.standalone;
    },
    get isSignal() {
      return t.signals;
    },
  };
}
var ye = (function (e) {
    return (
      (e[(e.State = 0)] = "State"),
      (e[(e.Transition = 1)] = "Transition"),
      (e[(e.Sequence = 2)] = "Sequence"),
      (e[(e.Group = 3)] = "Group"),
      (e[(e.Animate = 4)] = "Animate"),
      (e[(e.Keyframes = 5)] = "Keyframes"),
      (e[(e.Style = 6)] = "Style"),
      (e[(e.Trigger = 7)] = "Trigger"),
      (e[(e.Reference = 8)] = "Reference"),
      (e[(e.AnimateChild = 9)] = "AnimateChild"),
      (e[(e.AnimateRef = 10)] = "AnimateRef"),
      (e[(e.Query = 11)] = "Query"),
      (e[(e.Stagger = 12)] = "Stagger"),
      e
    );
  })(ye || {}),
  TO = "*";
function xO(e, t) {
  return { type: ye.Trigger, name: e, definitions: t, options: {} };
}
function NO(e, t = null) {
  return { type: ye.Animate, styles: t, timings: e };
}
function SO(e, t = null) {
  return { type: ye.Sequence, steps: e, options: t };
}
function OO(e) {
  return { type: ye.Style, styles: e, offset: null };
}
function RO(e, t, n) {
  return { type: ye.State, name: e, styles: t, options: n };
}
function kO(e, t, n = null) {
  return { type: ye.Transition, expr: e, animation: t, options: n };
}
function AO(e, t = null) {
  return { type: ye.Reference, animation: e, options: t };
}
function PO(e = null) {
  return { type: ye.AnimateChild, options: e };
}
function LO(e, t = null) {
  return { type: ye.AnimateRef, animation: e, options: t };
}
function FO(e, t, n = null) {
  return { type: ye.Query, selector: e, animation: t, options: n };
}
var Bp = class {
    _onDoneFns = [];
    _onStartFns = [];
    _onDestroyFns = [];
    _originalOnDoneFns = [];
    _originalOnStartFns = [];
    _started = !1;
    _destroyed = !1;
    _finished = !1;
    _position = 0;
    parentPlayer = null;
    totalTime;
    constructor(t = 0, n = 0) {
      this.totalTime = t + n;
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((t) => t()),
        (this._onDoneFns = []));
    }
    onStart(t) {
      this._originalOnStartFns.push(t), this._onStartFns.push(t);
    }
    onDone(t) {
      this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
    }
    onDestroy(t) {
      this._onDestroyFns.push(t);
    }
    hasStarted() {
      return this._started;
    }
    init() {}
    play() {
      this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
        (this._started = !0);
    }
    triggerMicrotask() {
      queueMicrotask(() => this._onFinish());
    }
    _onStart() {
      this._onStartFns.forEach((t) => t()), (this._onStartFns = []);
    }
    pause() {}
    restart() {}
    finish() {
      this._onFinish();
    }
    destroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this.hasStarted() || this._onStart(),
        this.finish(),
        this._onDestroyFns.forEach((t) => t()),
        (this._onDestroyFns = []));
    }
    reset() {
      (this._started = !1),
        (this._finished = !1),
        (this._onStartFns = this._originalOnStartFns),
        (this._onDoneFns = this._originalOnDoneFns);
    }
    setPosition(t) {
      this._position = this.totalTime ? t * this.totalTime : 1;
    }
    getPosition() {
      return this.totalTime ? this._position / this.totalTime : 1;
    }
    triggerCallback(t) {
      let n = t == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  $p = class {
    _onDoneFns = [];
    _onStartFns = [];
    _finished = !1;
    _started = !1;
    _destroyed = !1;
    _onDestroyFns = [];
    parentPlayer = null;
    totalTime = 0;
    players;
    constructor(t) {
      this.players = t;
      let n = 0,
        r = 0,
        o = 0,
        i = this.players.length;
      i == 0
        ? queueMicrotask(() => this._onFinish())
        : this.players.forEach((s) => {
            s.onDone(() => {
              ++n == i && this._onFinish();
            }),
              s.onDestroy(() => {
                ++r == i && this._onDestroy();
              }),
              s.onStart(() => {
                ++o == i && this._onStart();
              });
          }),
        (this.totalTime = this.players.reduce(
          (s, a) => Math.max(s, a.totalTime),
          0
        ));
    }
    _onFinish() {
      this._finished ||
        ((this._finished = !0),
        this._onDoneFns.forEach((t) => t()),
        (this._onDoneFns = []));
    }
    init() {
      this.players.forEach((t) => t.init());
    }
    onStart(t) {
      this._onStartFns.push(t);
    }
    _onStart() {
      this.hasStarted() ||
        ((this._started = !0),
        this._onStartFns.forEach((t) => t()),
        (this._onStartFns = []));
    }
    onDone(t) {
      this._onDoneFns.push(t);
    }
    onDestroy(t) {
      this._onDestroyFns.push(t);
    }
    hasStarted() {
      return this._started;
    }
    play() {
      this.parentPlayer || this.init(),
        this._onStart(),
        this.players.forEach((t) => t.play());
    }
    pause() {
      this.players.forEach((t) => t.pause());
    }
    restart() {
      this.players.forEach((t) => t.restart());
    }
    finish() {
      this._onFinish(), this.players.forEach((t) => t.finish());
    }
    destroy() {
      this._onDestroy();
    }
    _onDestroy() {
      this._destroyed ||
        ((this._destroyed = !0),
        this._onFinish(),
        this.players.forEach((t) => t.destroy()),
        this._onDestroyFns.forEach((t) => t()),
        (this._onDestroyFns = []));
    }
    reset() {
      this.players.forEach((t) => t.reset()),
        (this._destroyed = !1),
        (this._finished = !1),
        (this._started = !1);
    }
    setPosition(t) {
      let n = t * this.totalTime;
      this.players.forEach((r) => {
        let o = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
        r.setPosition(o);
      });
    }
    getPosition() {
      let t = this.players.reduce(
        (n, r) => (n === null || r.totalTime > n.totalTime ? r : n),
        null
      );
      return t != null ? t.getPosition() : 0;
    }
    beforeDestroy() {
      this.players.forEach((t) => {
        t.beforeDestroy && t.beforeDestroy();
      });
    }
    triggerCallback(t) {
      let n = t == "start" ? this._onStartFns : this._onDoneFns;
      n.forEach((r) => r()), (n.length = 0);
    }
  },
  VO = "!";
export {
  te as a,
  ne as b,
  hb as c,
  V as d,
  rh as e,
  S as f,
  wi as g,
  bi as h,
  ve as i,
  fn as j,
  Mi as k,
  gn as l,
  Fe as m,
  ph as n,
  hh as o,
  gh as p,
  Je as q,
  Ve as r,
  bh as s,
  Xe as t,
  _i as u,
  Ir as v,
  Ch as w,
  _h as x,
  Th as y,
  xt as z,
  zc as A,
  xh as B,
  Nh as C,
  mn as D,
  Ti as E,
  Oh as F,
  Rh as G,
  xi as H,
  kh as I,
  Ah as J,
  Ph as K,
  Lh as L,
  Fh as M,
  Qc as N,
  C as O,
  Mu as P,
  q as Q,
  tS as R,
  nS as S,
  x as T,
  T as U,
  Ue as V,
  E as W,
  ma as X,
  $u as Y,
  _e as Z,
  qu as _,
  zu as $,
  rS as aa,
  oS as ba,
  iS as ca,
  sS as da,
  aS as ea,
  cS as fa,
  dt as ga,
  No as ha,
  ft as ia,
  Kt as ja,
  Be as ka,
  ie as la,
  pt as ma,
  lS as na,
  So as oa,
  uS as pa,
  dS as qa,
  ro as ra,
  cy as sa,
  fS as ta,
  pS as ua,
  hS as va,
  Oo as wa,
  Ro as xa,
  Et as ya,
  Qd as za,
  _n as Aa,
  gS as Ba,
  Dv as Ca,
  mS as Da,
  yS as Ea,
  Os as Fa,
  co as Ga,
  uo as Ha,
  bS as Ia,
  Yo as Ja,
  MS as Ka,
  ac as La,
  VI as Ma,
  tp as Na,
  xS as Oa,
  NS as Pa,
  SS as Qa,
  OS as Ra,
  zI as Sa,
  RS as Ta,
  tD as Ua,
  kS as Va,
  up as Wa,
  AS as Xa,
  dc as Ya,
  Re as Za,
  _D as _a,
  BD as $a,
  $D as ab,
  UD as bb,
  PS as cb,
  LS as db,
  FS as eb,
  VS as fb,
  jS as gb,
  HS as hb,
  BS as ib,
  Mp as jb,
  Cp as kb,
  rw as lb,
  Tp as mb,
  xp as nb,
  aw as ob,
  $S as pb,
  uw as qb,
  US as rb,
  pw as sb,
  Ew as tb,
  qS as ub,
  WS as vb,
  zS as wb,
  GS as xb,
  QS as yb,
  ZS as zb,
  YS as Ab,
  KS as Bb,
  JS as Cb,
  _w as Db,
  kp as Eb,
  Tw as Fb,
  xw as Gb,
  XS as Hb,
  Nw as Ib,
  eO as Jb,
  tO as Kb,
  nO as Lb,
  rO as Mb,
  oO as Nb,
  iO as Ob,
  sO as Pb,
  aO as Qb,
  cO as Rb,
  lO as Sb,
  uO as Tb,
  dO as Ub,
  fO as Vb,
  pO as Wb,
  hO as Xb,
  jp as Yb,
  gO as Zb,
  mO as _b,
  tb as $b,
  nb as ac,
  yO as bc,
  vO as cc,
  EO as dc,
  IO as ec,
  DO as fc,
  wO as gc,
  bO as hc,
  lb as ic,
  MO as jc,
  ye as kc,
  TO as lc,
  xO as mc,
  NO as nc,
  SO as oc,
  OO as pc,
  RO as qc,
  kO as rc,
  AO as sc,
  PO as tc,
  LO as uc,
  FO as vc,
  Bp as wc,
  $p as xc,
  VO as yc,
};
