var jp = Object.defineProperty,
  Hp = Object.defineProperties;
var Bp = Object.getOwnPropertyDescriptors;
var Hn = Object.getOwnPropertySymbols;
var uc = Object.prototype.hasOwnProperty,
  dc = Object.prototype.propertyIsEnumerable;
var lc = (e, t, n) =>
    t in e
      ? jp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  te = (e, t) => {
    for (var n in (t ||= {})) uc.call(t, n) && lc(e, n, t[n]);
    if (Hn) for (var n of Hn(t)) dc.call(t, n) && lc(e, n, t[n]);
    return e;
  },
  ne = (e, t) => Hp(e, Bp(t));
var cb = (e, t) => {
  var n = {};
  for (var r in e) uc.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && Hn)
    for (var r of Hn(e)) t.indexOf(r) < 0 && dc.call(e, r) && (n[r] = e[r]);
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
function ti(e, t) {
  return Object.is(e, t);
}
var j = null,
  Bn = !1,
  ni = 1,
  ce = Symbol("SIGNAL");
function b(e) {
  let t = j;
  return (j = e), t;
}
function ri() {
  return j;
}
var It = {
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
    (j.producerIndexOfThis[t] = sn(j) ? pc(e, j, t) : 0)),
    (j.producerLastReadVersion[t] = e.version);
}
function fc() {
  ni++;
}
function oi(e) {
  if (!(sn(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === ni)) {
    if (!e.producerMustRecompute(e) && !qn(e)) {
      ei(e);
      return;
    }
    e.producerRecomputeValue(e), ei(e);
  }
}
function ii(e) {
  if (e.liveConsumerNode === void 0) return;
  let t = Bn;
  Bn = !0;
  try {
    for (let n of e.liveConsumerNode) n.dirty || $p(n);
  } finally {
    Bn = t;
  }
}
function si() {
  return j?.consumerAllowSignalWrites !== !1;
}
function $p(e) {
  (e.dirty = !0), ii(e), e.consumerMarkedDirty?.(e);
}
function ei(e) {
  (e.dirty = !1), (e.lastCleanEpoch = ni);
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
    if (r !== n.version || (oi(n), r !== n.version)) return !0;
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
function pc(e, t, n) {
  if ((hc(e), e.liveConsumerNode.length === 0 && gc(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      e.producerIndexOfThis[r] = pc(e.producerNode[r], e, r);
  return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1;
}
function Wn(e, t) {
  if ((hc(e), e.liveConsumerNode.length === 1 && gc(e)))
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
function hc(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function gc(e) {
  return e.producerNode !== void 0;
}
function ai(e, t) {
  let n = Object.create(Up);
  (n.computation = e), t !== void 0 && (n.equal = t);
  let r = () => {
    if ((oi(n), an(n), n.value === $n)) throw n.error;
    return n.value;
  };
  return (r[ce] = n), r;
}
var Jo = Symbol("UNSET"),
  Xo = Symbol("COMPUTING"),
  $n = Symbol("ERRORED"),
  Up = ne(te({}, It), {
    value: Jo,
    dirty: !0,
    error: null,
    equal: ti,
    kind: "computed",
    producerMustRecompute(e) {
      return e.value === Jo || e.value === Xo;
    },
    producerRecomputeValue(e) {
      if (e.value === Xo) throw new Error("Detected cycle in computations.");
      let t = e.value;
      e.value = Xo;
      let n = cn(e),
        r,
        o = !1;
      try {
        (r = e.computation()),
          b(null),
          (o = t !== Jo && t !== $n && r !== $n && e.equal(t, r));
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
function qp() {
  throw new Error();
}
var mc = qp;
function yc(e) {
  mc(e);
}
function ci(e) {
  mc = e;
}
var Wp = null;
function li(e, t) {
  let n = Object.create(Gn);
  (n.value = e), t !== void 0 && (n.equal = t);
  let r = () => (an(n), n.value);
  return (r[ce] = n), r;
}
function un(e, t) {
  si() || yc(e), e.equal(e.value, t) || ((e.value = t), zp(e));
}
function ui(e, t) {
  si() || yc(e), un(e, t(e.value));
}
var Gn = ne(te({}, It), { equal: ti, value: void 0, kind: "signal" });
function zp(e) {
  e.version++, fc(), ii(e), Wp?.();
}
function di(e) {
  let t = b(null);
  try {
    return e();
  } finally {
    b(t);
  }
}
var fi;
function dn() {
  return fi;
}
function Me(e) {
  let t = fi;
  return (fi = e), t;
}
var Qn = Symbol("NotFound");
function D(e) {
  return typeof e == "function";
}
function Dt(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var Zn = Dt(
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
function ze(e, t) {
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
            vc(i);
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
      if (this.closed) vc(t);
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
    n === t ? (this._parentage = null) : Array.isArray(n) && ze(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && ze(n, t), t instanceof e && t._removeParent(this);
  }
};
V.EMPTY = (() => {
  let e = new V();
  return (e.closed = !0), e;
})();
var pi = V.EMPTY;
function Yn(e) {
  return (
    e instanceof V ||
    (e && "closed" in e && D(e.remove) && D(e.add) && D(e.unsubscribe))
  );
}
function vc(e) {
  D(e) ? e() : e.unsubscribe();
}
var de = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var wt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = wt;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = wt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Kn(e) {
  wt.setTimeout(() => {
    let { onUnhandledError: t } = de;
    if (t) t(e);
    else throw e;
  });
}
function Ge() {}
var Ec = hi("C", void 0, void 0);
function Ic(e) {
  return hi("E", void 0, e);
}
function Dc(e) {
  return hi("N", e, void 0);
}
function hi(e, t, n) {
  return { kind: e, value: t, error: n };
}
var Qe = null;
function bt(e) {
  if (de.useDeprecatedSynchronousErrorHandling) {
    let t = !Qe;
    if ((t && (Qe = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = Qe;
      if (((Qe = null), n)) throw r;
    }
  } else e();
}
function wc(e) {
  de.useDeprecatedSynchronousErrorHandling &&
    Qe &&
    ((Qe.errorThrown = !0), (Qe.error = e));
}
var Ze = class extends V {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Yn(t) && t.add(this))
          : (this.destination = Jp);
    }
    static create(t, n, r) {
      return new Mt(t, n, r);
    }
    next(t) {
      this.isStopped ? mi(Dc(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? mi(Ic(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? mi(Ec, this) : ((this.isStopped = !0), this._complete());
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
  Yp = Function.prototype.bind;
function gi(e, t) {
  return Yp.call(e, t);
}
var yi = class {
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
  Mt = class extends Ze {
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
              next: t.next && gi(t.next, i),
              error: t.error && gi(t.error, i),
              complete: t.complete && gi(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new yi(o);
    }
  };
function Jn(e) {
  de.useDeprecatedSynchronousErrorHandling ? wc(e) : Kn(e);
}
function Kp(e) {
  throw e;
}
function mi(e, t) {
  let { onStoppedNotification: n } = de;
  n && wt.setTimeout(() => n(e, t));
}
var Jp = { closed: !0, next: Ge, error: Kp, complete: Ge };
var Ct = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function re(e) {
  return e;
}
function Xp(...e) {
  return vi(e);
}
function vi(e) {
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
      let i = th(n) ? n : new Mt(n, r, o);
      return (
        bt(() => {
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
        (r = bc(r)),
        new r((o, i) => {
          let s = new Mt({
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
    [Ct]() {
      return this;
    }
    pipe(...n) {
      return vi(n)(this);
    }
    toPromise(n) {
      return (
        (n = bc(n)),
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
function bc(e) {
  var t;
  return (t = e ?? de.Promise) !== null && t !== void 0 ? t : Promise;
}
function eh(e) {
  return e && D(e.next) && D(e.error) && D(e.complete);
}
function th(e) {
  return (e && e instanceof Ze) || (eh(e) && Yn(e));
}
function Ei(e) {
  return D(e?.lift);
}
function _(e) {
  return (t) => {
    if (Ei(t))
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
  return new Ii(e, t, n, r, o);
}
var Ii = class extends Ze {
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
function Di() {
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
var wi = class extends S {
  constructor(t, n) {
    super(),
      (this.source = t),
      (this.subjectFactory = n),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      Ei(t) && (this.lift = t.lift);
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
    return Di()(this);
  }
};
var Mc = Dt(
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
        if (this.closed) throw new Mc();
      }
      next(n) {
        bt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        bt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        bt(() => {
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
          ? pi
          : ((this.currentObservers = null),
            i.push(n),
            new V(() => {
              (this.currentObservers = null), ze(i, n);
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
        : pi;
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
var bi = class extends ve {
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
        ze(r, this),
        t != null && (this.id = this.recycleAsyncId(n, t, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var _t = class e {
  constructor(t, n = e.now) {
    (this.schedulerActionCtor = t), (this.now = n);
  }
  schedule(t, n = 0, r) {
    return new this.schedulerActionCtor(this, t).schedule(r, n);
  }
};
_t.now = pn.now;
var nr = class extends _t {
  constructor(t, n = _t.now) {
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
var Mi = new nr(tr),
  Cc = Mi;
var gn = new S((e) => e.complete());
function rr(e) {
  return e && D(e.schedule);
}
function _c(e) {
  return e[e.length - 1];
}
function or(e) {
  return D(_c(e)) ? e.pop() : void 0;
}
function Pe(e) {
  return rr(_c(e)) ? e.pop() : void 0;
}
function xc(e, t, n, r) {
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
function Tc(e) {
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
function Ye(e) {
  return this instanceof Ye ? ((this.v = e), this) : new Ye(e);
}
function Nc(e, t, n) {
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
    f.value instanceof Ye
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
function Sc(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Tc == "function" ? Tc(e) : e[Symbol.iterator]()),
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
  return D(e[Ct]);
}
function cr(e) {
  return Symbol.asyncIterator && D(e?.[Symbol.asyncIterator]);
}
function lr(e) {
  return new TypeError(
    `You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function nh() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var ur = nh();
function dr(e) {
  return D(e?.[ur]);
}
function fr(e) {
  return Nc(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield Ye(n.read());
        if (o) return yield Ye(void 0);
        yield yield Ye(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function pr(e) {
  return D(e?.getReader);
}
function L(e) {
  if (e instanceof S) return e;
  if (e != null) {
    if (ar(e)) return rh(e);
    if (ir(e)) return oh(e);
    if (sr(e)) return ih(e);
    if (cr(e)) return Oc(e);
    if (dr(e)) return sh(e);
    if (pr(e)) return ah(e);
  }
  throw lr(e);
}
function rh(e) {
  return new S((t) => {
    let n = e[Ct]();
    if (D(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function oh(e) {
  return new S((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function ih(e) {
  return new S((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n)
    ).then(null, Kn);
  });
}
function sh(e) {
  return new S((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function Oc(e) {
  return new S((t) => {
    ch(e, t).catch((n) => t.error(n));
  });
}
function ah(e) {
  return Oc(fr(e));
}
function ch(e, t) {
  var n, r, o, i;
  return xc(this, void 0, void 0, function* () {
    try {
      for (n = Sc(e); (r = yield n.next()), !r.done; ) {
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
function Z(e, t, n, r = 0, o = !1) {
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
        (o) => Z(r, e, () => r.next(o), t),
        () => Z(r, e, () => r.complete(), t),
        (o) => Z(r, e, () => r.error(o), t)
      )
    );
  });
}
function gr(e, t = 0) {
  return _((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function Rc(e, t) {
  return L(e).pipe(gr(t), hr(t));
}
function kc(e, t) {
  return L(e).pipe(gr(t), hr(t));
}
function Ac(e, t) {
  return new S((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function Pc(e, t) {
  return new S((n) => {
    let r;
    return (
      Z(n, t, () => {
        (r = e[ur]()),
          Z(
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
    Z(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      Z(
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
function Lc(e, t) {
  return mr(fr(e), t);
}
function Fc(e, t) {
  if (e != null) {
    if (ar(e)) return Rc(e, t);
    if (ir(e)) return Ac(e, t);
    if (sr(e)) return kc(e, t);
    if (cr(e)) return mr(e, t);
    if (dr(e)) return Pc(e, t);
    if (pr(e)) return Lc(e, t);
  }
  throw lr(e);
}
function Le(e, t) {
  return t ? Fc(e, t) : L(e);
}
function lh(...e) {
  let t = Pe(e);
  return Le(e, t);
}
function uh(e, t) {
  let n = D(e) ? e : () => e,
    r = (o) => o.error(n());
  return new S(t ? (o) => t.schedule(r, 0, o) : r);
}
function dh(e) {
  return !!e && (e instanceof S || (D(e.lift) && D(e.subscribe)));
}
var Ke = Dt(
  (e) =>
    function () {
      e(this),
        (this.name = "EmptyError"),
        (this.message = "no elements in sequence");
    }
);
function Vc(e) {
  return e instanceof Date && !isNaN(e);
}
function Fe(e, t) {
  return _((n, r) => {
    let o = 0;
    n.subscribe(
      M(r, (i) => {
        r.next(e.call(t, i, o++));
      })
    );
  });
}
var { isArray: fh } = Array;
function ph(e, t) {
  return fh(t) ? e(...t) : e(t);
}
function yr(e) {
  return Fe((t) => ph(e, t));
}
var { isArray: hh } = Array,
  { getPrototypeOf: gh, prototype: mh, keys: yh } = Object;
function vr(e) {
  if (e.length === 1) {
    let t = e[0];
    if (hh(t)) return { args: t, keys: null };
    if (vh(t)) {
      let n = yh(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function vh(e) {
  return e && typeof e == "object" && gh(e) === mh;
}
function Er(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function Eh(...e) {
  let t = Pe(e),
    n = or(e),
    { args: r, keys: o } = vr(e);
  if (r.length === 0) return Le([], t);
  let i = new S(Ih(r, t, o ? (s) => Er(o, s) : re));
  return n ? i.pipe(yr(n)) : i;
}
function Ih(e, t, n = re) {
  return (r) => {
    jc(
      t,
      () => {
        let { length: o } = e,
          i = new Array(o),
          s = o,
          a = o;
        for (let c = 0; c < o; c++)
          jc(
            t,
            () => {
              let l = Le(e[c], t),
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
function jc(e, t, n) {
  e ? Z(n, e, t) : t();
}
function Hc(e, t, n, r, o, i, s, a) {
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
      L(n(g, u++)).subscribe(
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
                  s ? Z(t, s, () => h(N)) : h(N);
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
function Je(e, t, n = 1 / 0) {
  return D(t)
    ? Je((r, o) => Fe((i, s) => t(r, i, o, s))(L(e(r, o))), n)
    : (typeof t == "number" && (n = t), _((r, o) => Hc(r, o, e, n)));
}
function Ci(e = 1 / 0) {
  return Je(re, e);
}
function Bc() {
  return Ci(1);
}
function Ir(...e) {
  return Bc()(Le(e, Pe(e)));
}
function Dh(e) {
  return new S((t) => {
    L(e()).subscribe(t);
  });
}
function wh(...e) {
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
        L(n[u]).subscribe(
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
function $c(e = 0, t, n = Cc) {
  let r = -1;
  return (
    t != null && (rr(t) ? (n = t) : (r = t)),
    new S((o) => {
      let i = Vc(e) ? +e - n.now() : e;
      i < 0 && (i = 0);
      let s = 0;
      return n.schedule(function () {
        o.closed ||
          (o.next(s++), 0 <= r ? this.schedule(void 0, r) : o.complete());
      }, i);
    })
  );
}
function bh(e = 0, t = Mi) {
  return e < 0 && (e = 0), $c(e, e, t);
}
function Tt(e, t) {
  return _((n, r) => {
    let o = 0;
    n.subscribe(M(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function Uc(e) {
  return _((t, n) => {
    let r = null,
      o = !1,
      i;
    (r = t.subscribe(
      M(n, void 0, void 0, (s) => {
        (i = L(e(s, Uc(e)(t)))),
          r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
      })
    )),
      o && (r.unsubscribe(), (r = null), i.subscribe(n));
  });
}
function qc(e, t, n, r, o) {
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
function Mh(e, t) {
  return D(t) ? Je(e, t, 1) : Je(e, 1);
}
function Ch(e) {
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
            (i = M(n, s, Ge)),
            L(e(a)).subscribe(i);
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
function _i(e) {
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
function Dr(e = _h) {
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
function _h() {
  return new Ke();
}
function Th(e) {
  return _((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function xh(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Tt((o, i) => e(o, i, r)) : re,
      _i(1),
      n ? mn(t) : Dr(() => new Ke())
    );
}
function Ti(e) {
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
function Nh(e, t) {
  let n = arguments.length >= 2;
  return (r) =>
    r.pipe(
      e ? Tt((o, i) => e(o, i, r)) : re,
      Ti(1),
      n ? mn(t) : Dr(() => new Ke())
    );
}
function Sh(e, t) {
  return _(qc(e, t, arguments.length >= 2, !0));
}
function Oh(...e) {
  let t = Pe(e);
  return _((n, r) => {
    (t ? Ir(e, n, t) : Ir(e, n)).subscribe(r);
  });
}
function Rh(e, t) {
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
          L(e(c, u)).subscribe(
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
function kh(e) {
  return _((t, n) => {
    L(e).subscribe(M(n, () => n.complete(), Ge)), !n.closed && t.subscribe(n);
  });
}
function Wc(e, t, n) {
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
var Ri = { JSACTION: "jsaction" },
  ki = { JSACTION: "__jsaction", OWNER: "__owner" },
  Zc = {};
function Ah(e) {
  return e[ki.JSACTION];
}
function zc(e, t) {
  e[ki.JSACTION] = t;
}
function Ph(e) {
  return Zc[e];
}
function Lh(e, t) {
  Zc[e] = t;
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
  Fh = [m.MOUSEENTER, m.MOUSELEAVE, "pointerenter", "pointerleave"],
  yN = [
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
  Vh = [m.FOCUS, m.BLUR, m.ERROR, m.LOAD, m.TOGGLE],
  Ai = (e) => Vh.indexOf(e) >= 0;
function jh(e) {
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
function Hh(e, t, n, r) {
  let o = !1;
  Ai(t) && (o = !0);
  let i = typeof r == "boolean" ? { capture: o, passive: r } : o;
  return (
    e.addEventListener(t, n, i),
    { eventType: t, handler: n, capture: o, passive: r }
  );
}
function Bh(e, t) {
  if (e.removeEventListener) {
    let n = typeof t.passive == "boolean" ? { capture: t.capture } : t.capture;
    e.removeEventListener(t.eventType, t.handler, n);
  } else e.detachEvent && e.detachEvent(`on${t.eventType}`, t.handler);
}
function $h(e) {
  e.preventDefault ? e.preventDefault() : (e.returnValue = !1);
}
var Gc = typeof navigator < "u" && /Macintosh/.test(navigator.userAgent);
function Uh(e) {
  return e.which === 2 || (e.which == null && e.button === 4);
}
function qh(e) {
  return (Gc && e.metaKey) || (!Gc && e.ctrlKey) || Uh(e) || e.shiftKey;
}
function Wh(e, t, n) {
  let r = e.relatedTarget;
  return (
    ((e.type === m.MOUSEOVER && t === m.MOUSEENTER) ||
      (e.type === m.MOUSEOUT && t === m.MOUSELEAVE) ||
      (e.type === m.POINTEROVER && t === m.POINTERENTER) ||
      (e.type === m.POINTEROUT && t === m.POINTERLEAVE)) &&
    (!r || (r !== n && !n.contains(r)))
  );
}
function zh(e, t) {
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
var Gh = typeof navigator < "u" && /iPhone|iPad|iPod/.test(navigator.userAgent),
  Cr = class {
    element;
    handlerInfos = [];
    constructor(t) {
      this.element = t;
    }
    addEventListener(t, n, r) {
      Gh && (this.element.style.cursor = "pointer"),
        this.handlerInfos.push(Hh(this.element, t, n(this.element), r));
    }
    cleanUp() {
      for (let t = 0; t < this.handlerInfos.length; t++)
        Bh(this.element, this.handlerInfos[t]);
      this.handlerInfos = [];
    }
  },
  Qh = { EVENT_ACTION_SEPARATOR: ":" };
function Ve(e) {
  return e.eventType;
}
function Pi(e, t) {
  e.eventType = t;
}
function br(e) {
  return e.event;
}
function Yc(e, t) {
  e.event = t;
}
function Kc(e) {
  return e.targetElement;
}
function Jc(e, t) {
  e.targetElement = t;
}
function Xc(e) {
  return e.eic;
}
function Zh(e, t) {
  e.eic = t;
}
function Yh(e) {
  return e.timeStamp;
}
function Kh(e, t) {
  e.timeStamp = t;
}
function Mr(e) {
  return e.eia;
}
function el(e, t, n) {
  e.eia = [t, n];
}
function xi(e) {
  e.eia = void 0;
}
function wr(e) {
  return e[1];
}
function Jh(e) {
  return e.eirp;
}
function tl(e, t) {
  e.eirp = t;
}
function nl(e) {
  return e.eir;
}
function rl(e, t) {
  e.eir = t;
}
function ol(e) {
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
function Xh(e, t, n, r, o, i, s, a) {
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
var Ni = class e {
    eventInfo;
    constructor(t) {
      this.eventInfo = t;
    }
    getEventType() {
      return Ve(this.eventInfo);
    }
    setEventType(t) {
      Pi(this.eventInfo, t);
    }
    getEvent() {
      return br(this.eventInfo);
    }
    setEvent(t) {
      Yc(this.eventInfo, t);
    }
    getTargetElement() {
      return Kc(this.eventInfo);
    }
    setTargetElement(t) {
      Jc(this.eventInfo, t);
    }
    getContainer() {
      return Xc(this.eventInfo);
    }
    setContainer(t) {
      Zh(this.eventInfo, t);
    }
    getTimestamp() {
      return Yh(this.eventInfo);
    }
    setTimestamp(t) {
      Kh(this.eventInfo, t);
    }
    getAction() {
      let t = Mr(this.eventInfo);
      if (t) return { name: t[0], element: t[1] };
    }
    setAction(t) {
      if (!t) {
        xi(this.eventInfo);
        return;
      }
      el(this.eventInfo, t.name, t.element);
    }
    getIsReplay() {
      return Jh(this.eventInfo);
    }
    setIsReplay(t) {
      tl(this.eventInfo, t);
    }
    getResolved() {
      return nl(this.eventInfo);
    }
    setResolved(t) {
      rl(this.eventInfo, t);
    }
    clone() {
      return new e(ol(this.eventInfo));
    }
  },
  eg = {},
  tg = /\s*;\s*/,
  ng = m.CLICK,
  Si = class {
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
      this.clickModSupport && Ve(t) === m.CLICK && qh(br(t))
        ? Pi(t, m.CLICKMOD)
        : this.a11yClickSupport && this.updateEventInfoForA11yClick(t);
    }
    resolveAction(t) {
      nl(t) || (this.populateAction(t, Kc(t)), rl(t, !0));
    }
    resolveParentAction(t) {
      let n = Mr(t),
        r = n && wr(n);
      xi(t);
      let o = r && this.getParentNode(r);
      o && this.populateAction(t, o);
    }
    populateAction(t, n) {
      let r = n;
      for (
        ;
        r &&
        r !== Xc(t) &&
        (r.nodeType === Node.ELEMENT_NODE && this.populateActionOnElement(r, t),
        !Mr(t));

      )
        r = this.getParentNode(r);
      let o = Mr(t);
      if (
        o &&
        (this.a11yClickSupport && this.preventDefaultForA11yClick(t),
        this.syntheticMouseEventSupport &&
          (Ve(t) === m.MOUSEENTER ||
            Ve(t) === m.MOUSELEAVE ||
            Ve(t) === m.POINTERENTER ||
            Ve(t) === m.POINTERLEAVE))
      )
        if (Wh(br(t), Ve(t), wr(o))) {
          let i = zh(br(t), wr(o));
          Yc(t, i), Jc(t, wr(o));
        } else xi(t);
    }
    getParentNode(t) {
      let n = t[ki.OWNER];
      if (n) return n;
      let r = t.parentNode;
      return r?.nodeName === "#document-fragment" ? (r?.host ?? null) : r;
    }
    populateActionOnElement(t, n) {
      let r = this.parseActions(t),
        o = r[Ve(n)];
      o !== void 0 && el(n, o, t),
        this.a11yClickSupport && this.populateClickOnlyAction(t, n, r);
    }
    parseActions(t) {
      let n = Ah(t);
      if (!n) {
        let r = t.getAttribute(Ri.JSACTION);
        if (!r) (n = eg), zc(t, n);
        else {
          if (((n = Ph(r)), !n)) {
            n = {};
            let o = r.split(tg);
            for (let i = 0; i < o.length; i++) {
              let s = o[i];
              if (!s) continue;
              let a = s.indexOf(Qh.EVENT_ACTION_SEPARATOR),
                c = a !== -1,
                l = c ? s.substr(0, a).trim() : ng,
                u = c ? s.substr(a + 1).trim() : s;
              n[l] = u;
            }
            Lh(r, n);
          }
          zc(t, n);
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
  il = (function (e) {
    return (
      (e[(e.I_AM_THE_JSACTION_FRAMEWORK = 0)] = "I_AM_THE_JSACTION_FRAMEWORK"),
      e
    );
  })(il || {}),
  Oi = class {
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
      let n = new Ni(t);
      this.actionResolver?.resolveEventType(t),
        this.actionResolver?.resolveAction(t);
      let r = n.getAction();
      if (
        (r && rg(r.element, n) && $h(n.getEvent()),
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
function rg(e, t) {
  return (
    e.tagName === "A" &&
    (t.getEventType() === m.CLICK || t.getEventType() === m.CLICKMOD)
  );
}
var sl = Symbol.for("propagationStopped"),
  Li = { REPLAY: 101 };
var og = "`preventDefault` called during event replay.";
var ig = "`composedPath` called during event replay.",
  _r = class {
    dispatchDelegate;
    clickModSupport;
    actionResolver;
    dispatcher;
    constructor(t, n = !0) {
      (this.dispatchDelegate = t),
        (this.clickModSupport = n),
        (this.actionResolver = new Si({ clickModSupport: n })),
        (this.dispatcher = new Oi(
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
      for (t.getIsReplay() && cg(t), sg(t); t.getAction(); ) {
        if (
          (lg(t),
          (Ai(t.getEventType()) &&
            t.getAction().element !== t.getTargetElement()) ||
            (this.dispatchDelegate(t.getEvent(), t.getAction().name), ag(t)))
        )
          return;
        this.actionResolver.resolveParentAction(t.eventInfo);
      }
    }
  };
function sg(e) {
  let t = e.getEvent(),
    n = e.getEvent().stopPropagation.bind(t),
    r = () => {
      (t[sl] = !0), n();
    };
  Xe(t, "stopPropagation", r), Xe(t, "stopImmediatePropagation", r);
}
function ag(e) {
  return !!e.getEvent()[sl];
}
function cg(e) {
  let t = e.getEvent(),
    n = e.getTargetElement(),
    r = t.preventDefault.bind(t);
  Xe(t, "target", n),
    Xe(t, "eventPhase", Li.REPLAY),
    Xe(t, "preventDefault", () => {
      throw (r(), new Error(og + ""));
    }),
    Xe(t, "composedPath", () => {
      throw new Error(ig + "");
    });
}
function lg(e) {
  let t = e.getEvent(),
    n = e.getAction()?.element;
  n && Xe(t, "currentTarget", n, { configurable: !0 });
}
function Xe(e, t, n, { configurable: r = !1 } = {}) {
  Object.defineProperty(e, t, { value: n, configurable: r });
}
function al(e, t) {
  e.ecrd((n) => {
    t.dispatch(n);
  }, il.I_AM_THE_JSACTION_FRAMEWORK);
}
function ug(e) {
  return e?.q ?? [];
}
function dg(e) {
  e && (Qc(e.c, e.et, e.h), Qc(e.c, e.etc, e.h, !0));
}
function Qc(e, t, n, r) {
  for (let o = 0; o < t.length; o++) e.removeEventListener(t[o], n, r);
}
var fg = !1,
  cl = (() => {
    class e {
      static MOUSE_SPECIAL_SUPPORT = fg;
      containerManager;
      eventHandlers = {};
      browserEventTypeToExtraEventTypes = {};
      dispatcher = null;
      queuedEventInfos = [];
      constructor(n) {
        this.containerManager = n;
      }
      handleEvent(n, r, o) {
        let i = Xh(n, r, r.target, o, Date.now());
        this.handleEventInfo(i);
      }
      handleEventInfo(n) {
        if (!this.dispatcher) {
          tl(n, !0), this.queuedEventInfos?.push(n);
          return;
        }
        this.dispatcher(n);
      }
      addEvent(n, r, o) {
        if (
          n in this.eventHandlers ||
          !this.containerManager ||
          (!e.MOUSE_SPECIAL_SUPPORT && Fh.indexOf(n) >= 0)
        )
          return;
        let i = (a, c, l) => {
          this.handleEvent(a, c, l);
        };
        this.eventHandlers[n] = i;
        let s = jh(r || n);
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
        n && (this.replayEarlyEventInfos(n.q), dg(n), delete window._ejsa);
      }
      replayEarlyEventInfos(n) {
        for (let r = 0; r < n.length; r++) {
          let o = n[r],
            i = this.getEventTypesForBrowserEventType(o.eventType);
          for (let s = 0; s < i.length; s++) {
            let a = ol(o);
            Pi(a, i[s]), this.handleEventInfo(a);
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
function ll(e, t = window) {
  return ug(t._ejsas?.[e]);
}
function Fi(e, t = window) {
  t._ejsas && (t._ejsas[e] = void 0);
}
var gu =
    "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss",
  C = class extends Error {
    code;
    constructor(t, n) {
      super(hg(t, n)), (this.code = t);
    }
  };
function pg(e) {
  return `NG0${Math.abs(e)}`;
}
function hg(e, t) {
  return `${pg(e)}${t ? ": " + t : ""}`;
}
var mu = Symbol("InputSignalNode#UNSET"),
  gg = ne(te({}, Gn), {
    transformFn: void 0,
    applyValueToInputSignal(e, t) {
      un(e, t);
    },
  });
function yu(e, t) {
  let n = Object.create(gg);
  (n.value = e), (n.transformFn = t?.transform);
  function r() {
    if ((an(n), n.value === mu)) {
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
function mg(e) {
  return function (...n) {
    if (e) {
      let r = e(...n);
      for (let o in r) this[o] = r[o];
    }
  };
}
function vu(e, t, n) {
  return On(() => {
    let r = mg(t);
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
var je = globalThis;
function k(e) {
  for (let t in e) if (e[t] === k) return t;
  throw Error("Could not find renamed property on target object.");
}
function yg(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function J(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return `[${e.map(J).join(", ")}]`;
  if (e == null) return "" + e;
  let t = e.overriddenName || e.name;
  if (t) return `${t}`;
  let n = e.toString();
  if (n == null) return "" + n;
  let r = n.indexOf(`
`);
  return r >= 0 ? n.slice(0, r) : n;
}
function rs(e, t) {
  return e ? (t ? `${e} ${t}` : e) : t || "";
}
var vg = k({ __forward_ref__: k });
function Eu(e) {
  return (
    (e.__forward_ref__ = Eu),
    (e.toString = function () {
      return J(this());
    }),
    e
  );
}
function G(e) {
  return Iu(e) ? e() : e;
}
function Iu(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(vg) && e.__forward_ref__ === Eu
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
function ZN(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function Do(e) {
  return ul(e, Du) || ul(e, wu);
}
function YN(e) {
  return Do(e) !== null;
}
function ul(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function Eg(e) {
  let t = e && (e[Du] || e[wu]);
  return t || null;
}
function dl(e) {
  return e && (e.hasOwnProperty(fl) || e.hasOwnProperty(Ig)) ? e[fl] : null;
}
var Du = k({ ɵprov: k }),
  fl = k({ ɵinj: k }),
  wu = k({ ngInjectableDef: k }),
  Ig = k({ ngInjectorDef: k }),
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
function bu(e) {
  return e && !!e.ɵproviders;
}
var Dg = k({ ɵcmp: k }),
  wg = k({ ɵdir: k }),
  bg = k({ ɵpipe: k }),
  Mg = k({ ɵmod: k }),
  $r = k({ ɵfac: k }),
  In = k({ __NG_ELEMENT_ID__: k }),
  pl = k({ __NG_ENV_ID__: k });
function rt(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Cg(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
      ? e.type.name || e.type.toString()
      : rt(e);
}
function Mu(e, t) {
  throw new C(-200, e);
}
function da(e, t) {
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
  os;
function Cu() {
  return os;
}
function Y(e) {
  let t = os;
  return (os = e), t;
}
function _u(e, t, n) {
  let r = Do(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & T.Optional) return null;
  if (t !== void 0) return t;
  da(e, "Injector");
}
var _g = {},
  tt = _g,
  is = "__NG_DI_FLAG__",
  Ur = class {
    injector;
    constructor(t) {
      this.injector = t;
    }
    retrieve(t, n) {
      let r = n;
      return this.injector.get(t, r.optional ? Qn : tt, r);
    }
  },
  qr = "ngTempTokenPath",
  Tg = "ngTokenPath",
  xg = /\n/gm,
  Ng = "\u0275",
  hl = "__source";
function Sg(e, t = T.Default) {
  if (dn() === void 0) throw new C(-203, !1);
  if (dn() === null) return _u(e, void 0, t);
  {
    let n = dn(),
      r;
    return (
      n instanceof Ur ? (r = n.injector) : (r = n),
      r.get(e, t & T.Optional ? null : void 0, t)
    );
  }
}
function $e(e, t = T.Default) {
  return (Cu() || Sg)(G(e), t);
}
function E(e, t = T.Default) {
  return $e(e, wo(t));
}
function wo(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function ss(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = G(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new C(900, !1);
      let o,
        i = T.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = Og(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push($e(o, i));
    } else t.push($e(r));
  }
  return t;
}
function Tu(e, t) {
  return (e[is] = t), (e.prototype[is] = t), e;
}
function Og(e) {
  return e[is];
}
function Rg(e, t, n, r) {
  let o = e[qr];
  throw (
    (t[hl] && o.unshift(t[hl]),
    (e.message = kg(
      `
` + e.message,
      o,
      n,
      r
    )),
    (e[Tg] = o),
    (e[qr] = null),
    e)
  );
}
function kg(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == Ng
      ? e.slice(2)
      : e;
  let o = J(t);
  if (Array.isArray(t)) o = t.map(J).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : J(a)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
    xg,
    `
  `
  )}`;
}
var xu = Tu(vu("Optional"), 8);
var Nu = Tu(vu("SkipSelf"), 4);
function ot(e, t) {
  let n = e.hasOwnProperty($r);
  return n ? e[$r] : null;
}
function Ag(e, t, n) {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let o = e[r],
      i = t[r];
    if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
  }
  return !0;
}
function Pg(e) {
  return e.flat(Number.POSITIVE_INFINITY);
}
function fa(e, t) {
  e.forEach((n) => (Array.isArray(n) ? fa(n, t) : t(n)));
}
function Su(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function Wr(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function Lg(e, t) {
  let n = [];
  for (let r = 0; r < e; r++) n.push(t);
  return n;
}
function Fg(e, t, n, r) {
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
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), Fg(e, r, t, n)), r;
}
function Vi(e, t) {
  let n = Rn(e, t);
  if (n >= 0) return e[n | 1];
}
function Rn(e, t) {
  return Vg(e, t, 1);
}
function Vg(e, t, n) {
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
var it = {},
  K = [],
  Ft = new x(""),
  Ou = new x("", -1),
  Ru = new x(""),
  zr = class {
    get(t, n = tt) {
      if (n === tt) {
        let r = new Error(`NullInjectorError: No provider for ${J(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  };
function ku(e, t) {
  let n = e[Mg] || null;
  if (!n && t === !0)
    throw new Error(`Type ${J(e)} does not have '\u0275mod' property.`);
  return n;
}
function Ue(e) {
  return e[Dg] || null;
}
function Au(e) {
  return e[wg] || null;
}
function Pu(e) {
  return e[bg] || null;
}
function pa(e) {
  return { ɵproviders: e };
}
function jg(...e) {
  return { ɵproviders: ha(!0, e), ɵfromNgModule: !0 };
}
function ha(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    fa(t, (s) => {
      let a = s;
      as(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Lu(o, i),
    n
  );
}
function Lu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    ga(o, (i) => {
      t(i, r);
    });
  }
}
function as(e, t, n, r) {
  if (((e = G(e)), !e)) return !1;
  let o = null,
    i = dl(e),
    s = !i && Ue(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = dl(c)), i)) o = c;
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
      for (let l of c) as(l, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let l;
      try {
        fa(i.imports, (u) => {
          as(u, t, n, r) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && Lu(l, t);
    }
    if (!a) {
      let l = ot(o) || (() => new o());
      t({ provide: o, useFactory: l, deps: K }, o),
        t({ provide: Ru, useValue: o, multi: !0 }, o),
        t({ provide: Ft, useValue: () => $e(o), multi: !0 }, o);
    }
    let c = i.providers;
    if (c != null && !a) {
      let l = e;
      ga(c, (u) => {
        t(u, l);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function ga(e, t) {
  for (let n of e)
    bu(n) && (n = n.ɵproviders), Array.isArray(n) ? ga(n, t) : t(n);
}
var Hg = k({ provide: String, useValue: k });
function Fu(e) {
  return e !== null && typeof e == "object" && Hg in e;
}
function Bg(e) {
  return !!(e && e.useExisting);
}
function $g(e) {
  return !!(e && e.useFactory);
}
function Vt(e) {
  return typeof e == "function";
}
function Ug(e) {
  return !!e.useClass;
}
var Vu = new x(""),
  Ar = {},
  gl = {},
  ji;
function ma() {
  return ji === void 0 && (ji = new zr()), ji;
}
var Ce = class {},
  Dn = class extends Ce {
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
        ls(t, (s) => this.processProvider(s)),
        this.records.set(Ou, xt(void 0, this)),
        o.has("environment") && this.records.set(Ce, xt(void 0, this));
      let i = this.records.get(Vu);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Ru, K, T.Self)));
    }
    retrieve(t, n) {
      let r = n;
      return this.get(t, r.optional ? Qn : tt, r);
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
      let n = Me(this),
        r = Y(void 0),
        o;
      try {
        return t();
      } finally {
        Me(n), Y(r);
      }
    }
    get(t, n = tt, r = T.Default) {
      if ((vn(this), t.hasOwnProperty(pl))) return t[pl](this);
      r = wo(r);
      let o,
        i = Me(this),
        s = Y(void 0);
      try {
        if (!(r & T.SkipSelf)) {
          let c = this.records.get(t);
          if (c === void 0) {
            let l = Qg(t) && Do(t);
            l && this.injectableDefInScope(l)
              ? (c = xt(cs(t), Ar))
              : (c = null),
              this.records.set(t, c);
          }
          if (c != null) return this.hydrate(t, c);
        }
        let a = r & T.Self ? ma() : this.parent;
        return (n = r & T.Optional && n === tt ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[qr] = a[qr] || []).unshift(J(t)), i)) throw a;
          return Rg(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        Y(s), Me(i);
      }
    }
    resolveInjectorInitializers() {
      let t = b(null),
        n = Me(this),
        r = Y(void 0),
        o;
      try {
        let i = this.get(Ft, K, T.Self);
        for (let s of i) s();
      } finally {
        Me(n), Y(r), b(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(J(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    processProvider(t) {
      t = G(t);
      let n = Vt(t) ? t : G(t && t.provide),
        r = Wg(t);
      if (!Vt(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = xt(void 0, Ar, !0)),
          (o.factory = () => ss(o.multi)),
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
          n.value === gl
            ? Mu(J(t))
            : n.value === Ar && ((n.value = gl), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            Gg(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        b(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = G(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function cs(e) {
  let t = Do(e),
    n = t !== null ? t.factory : ot(e);
  if (n !== null) return n;
  if (e instanceof x) throw new C(204, !1);
  if (e instanceof Function) return qg(e);
  throw new C(204, !1);
}
function qg(e) {
  if (e.length > 0) throw new C(204, !1);
  let n = Eg(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function Wg(e) {
  if (Fu(e)) return xt(void 0, e.useValue);
  {
    let t = ju(e);
    return xt(t, Ar);
  }
}
function ju(e, t, n) {
  let r;
  if (Vt(e)) {
    let o = G(e);
    return ot(o) || cs(o);
  } else if (Fu(e)) r = () => G(e.useValue);
  else if ($g(e)) r = () => e.useFactory(...ss(e.deps || []));
  else if (Bg(e)) r = () => $e(G(e.useExisting));
  else {
    let o = G(e && (e.useClass || e.provide));
    if (zg(e)) r = () => new o(...ss(e.deps));
    else return ot(o) || cs(o);
  }
  return r;
}
function vn(e) {
  if (e.destroyed) throw new C(205, !1);
}
function xt(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function zg(e) {
  return !!e.deps;
}
function Gg(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function Qg(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof x);
}
function ls(e, t) {
  for (let n of e)
    Array.isArray(n) ? ls(n, t) : n && bu(n) ? ls(n.ɵproviders, t) : t(n);
}
function Hu(e, t) {
  let n;
  e instanceof Dn ? (vn(e), (n = e)) : (n = new Ur(e));
  let r,
    o = Me(n),
    i = Y(void 0);
  try {
    return t();
  } finally {
    Me(o), Y(i);
  }
}
function Bu() {
  return Cu() !== void 0 || dn() != null;
}
function $u(e) {
  if (!Bu()) throw new C(-203, !1);
}
function Zg(e) {
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
  _e = 9,
  Te = 10,
  A = 11,
  wn = 12,
  ml = 13,
  zt = 14,
  Q = 15,
  st = 16,
  Nt = 17,
  xe = 18,
  Mo = 19,
  Uu = 20,
  Be = 21,
  Hi = 22,
  at = 23,
  le = 24,
  kt = 25,
  P = 26,
  qu = 1,
  Ne = 6,
  Se = 7,
  Qr = 8,
  jt = 9,
  W = 10;
function he(e) {
  return Array.isArray(e) && typeof e[qu] == "object";
}
function we(e) {
  return Array.isArray(e) && e[qu] === !0;
}
function ya(e) {
  return (e.flags & 4) !== 0;
}
function mt(e) {
  return e.componentOffset > -1;
}
function Co(e) {
  return (e.flags & 1) === 1;
}
function Ie(e) {
  return !!e.template;
}
function bn(e) {
  return (e[I] & 512) !== 0;
}
function Gt(e) {
  return (e[I] & 256) === 256;
}
var us = class {
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
function Wu(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
var KN = (() => {
  let e = () => zu;
  return (e.ngInherit = !0), e;
})();
function zu(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = Kg), Yg;
}
function Yg() {
  let e = Qu(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === it) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function Kg(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = Qu(e) || Jg(e, { previous: it, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    l = c[i];
  (a[i] = new us(l && l.currentValue, n, c === it)), Wu(e, t, o, n);
}
var Gu = "__ngSimpleChanges__";
function Qu(e) {
  return e[Gu] || null;
}
function Jg(e, t) {
  return (e[Gu] = t);
}
var yl = null;
var O = function (e, t = null, n) {
    yl?.(e, t, n);
  },
  Zu = "svg",
  Xg = "math";
function ge(e) {
  for (; Array.isArray(e); ) e = e[se];
  return e;
}
function Yu(e, t) {
  return ge(t[e]);
}
function me(e, t) {
  return ge(t[e.index]);
}
function kn(e, t) {
  return e.data[t];
}
function Ku(e, t) {
  return e[t];
}
function De(e, t) {
  let n = t[e];
  return he(n) ? n : n[se];
}
function em(e) {
  return (e[I] & 4) === 4;
}
function va(e) {
  return (e[I] & 128) === 128;
}
function tm(e) {
  return we(e[U]);
}
function qe(e, t) {
  return t == null ? null : e[t];
}
function Ju(e) {
  e[Nt] = 0;
}
function Xu(e) {
  e[I] & 1024 || ((e[I] |= 1024), va(e) && Qt(e));
}
function nm(e, t) {
  for (; e > 0; ) (t = t[zt]), e--;
  return t;
}
function _o(e) {
  return !!(e[I] & 9216 || e[le]?.dirty);
}
function ds(e) {
  e[Te].changeDetectionScheduler?.notify(8),
    e[I] & 64 && (e[I] |= 1024),
    _o(e) && Qt(e);
}
function Qt(e) {
  e[Te].changeDetectionScheduler?.notify(0);
  let t = ct(e);
  for (; t !== null && !(t[I] & 8192 || ((t[I] |= 8192), !va(t))); ) t = ct(t);
}
function ed(e, t) {
  if (Gt(e)) throw new C(911, !1);
  e[Be] === null && (e[Be] = []), e[Be].push(t);
}
function rm(e, t) {
  if (e[Be] === null) return;
  let n = e[Be].indexOf(t);
  n !== -1 && e[Be].splice(n, 1);
}
function ct(e) {
  let t = e[U];
  return we(t) ? t[U] : t;
}
function Ea(e) {
  return (e[Gr] ??= []);
}
function Ia(e) {
  return (e.cleanup ??= []);
}
function om(e, t, n, r) {
  let o = Ea(t);
  o.push(n), e.firstCreatePass && Ia(e).push(r, o.length - 1);
}
var w = { lFrame: sd(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var fs = !1;
function im() {
  return w.lFrame.elementDepthCount;
}
function sm() {
  w.lFrame.elementDepthCount++;
}
function am() {
  w.lFrame.elementDepthCount--;
}
function Da() {
  return w.bindingsEnabled;
}
function Zt() {
  return w.skipHydrationRootTNode !== null;
}
function cm(e) {
  return w.skipHydrationRootTNode === e;
}
function lm(e) {
  w.skipHydrationRootTNode = e;
}
function um() {
  w.skipHydrationRootTNode = null;
}
function v() {
  return w.lFrame.lView;
}
function F() {
  return w.lFrame.tView;
}
function JN(e) {
  return (w.lFrame.contextLView = e), e[$];
}
function XN(e) {
  return (w.lFrame.contextLView = null), e;
}
function z() {
  let e = td();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function td() {
  return w.lFrame.currentTNode;
}
function dm() {
  let e = w.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function yt(e, t) {
  let n = w.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function wa() {
  return w.lFrame.isParent;
}
function ba() {
  w.lFrame.isParent = !1;
}
function fm() {
  return w.lFrame.contextLView;
}
function nd() {
  return fs;
}
function Zr(e) {
  let t = fs;
  return (fs = e), t;
}
function be() {
  let e = w.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function pm() {
  return w.lFrame.bindingIndex;
}
function hm(e) {
  return (w.lFrame.bindingIndex = e);
}
function Yt() {
  return w.lFrame.bindingIndex++;
}
function Ma(e) {
  let t = w.lFrame,
    n = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), n;
}
function gm() {
  return w.lFrame.inI18n;
}
function mm(e, t) {
  let n = w.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), ps(t);
}
function ym() {
  return w.lFrame.currentDirectiveIndex;
}
function ps(e) {
  w.lFrame.currentDirectiveIndex = e;
}
function vm(e) {
  let t = w.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function rd() {
  return w.lFrame.currentQueryIndex;
}
function Ca(e) {
  w.lFrame.currentQueryIndex = e;
}
function Em(e) {
  let t = e[y];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[ee] : null;
}
function od(e, t, n) {
  if (n & T.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & T.Host); )
      if (((o = Em(i)), o === null || ((i = i[zt]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (w.lFrame = id());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function _a(e) {
  let t = id(),
    n = e[y];
  (w.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function id() {
  let e = w.lFrame,
    t = e === null ? null : e.child;
  return t === null ? sd(e) : t;
}
function sd(e) {
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
function ad() {
  let e = w.lFrame;
  return (w.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var cd = ad;
function Ta() {
  let e = ad();
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
function Im(e) {
  return (w.lFrame.contextLView = nm(e, w.lFrame.contextLView))[$];
}
function Re() {
  return w.lFrame.selectedIndex;
}
function lt(e) {
  w.lFrame.selectedIndex = e;
}
function xa() {
  let e = w.lFrame;
  return kn(e.tView, e.selectedIndex);
}
function eS() {
  w.lFrame.currentNamespace = Zu;
}
function ld() {
  return w.lFrame.currentNamespace;
}
var ud = !0;
function To() {
  return ud;
}
function We(e) {
  ud = e;
}
function Dm(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = zu(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function Na(e, t) {
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
  dd(e, t, 3, n);
}
function Lr(e, t, n, r) {
  (e[I] & 3) === n && dd(e, t, n, r);
}
function Bi(e, t) {
  let n = e[I];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[I] = n));
}
function dd(e, t, n, r) {
  let o = r !== void 0 ? e[Nt] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == "number") {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      t[c] < 0 && (e[Nt] += 65536),
        (a < i || i == -1) &&
          (wm(e, n, t, c), (e[Nt] = (e[Nt] & 4294901760) + c + 2)),
        c++;
}
function vl(e, t) {
  O(4, e, t);
  let n = b(null);
  try {
    t.call(e);
  } finally {
    b(n), O(5, e, t);
  }
}
function wm(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[I] >> 14 < e[Nt] >> 16 &&
      (e[I] & 3) === t &&
      ((e[I] += 16384), vl(a, i))
    : vl(a, i);
}
var At = -1,
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
function bm(e) {
  return (e.flags & 8) !== 0;
}
function Mm(e) {
  return (e.flags & 16) !== 0;
}
function Cm(e, t, n) {
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
      _m(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function fd(e) {
  return e === 3 || e === 4 || e === 6;
}
function _m(e) {
  return e.charCodeAt(0) === 64;
}
function Ht(e, t) {
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
              ? El(e, n, o, null, t[++r])
              : El(e, n, o, null, null));
      }
    }
  return e;
}
function El(e, t, n, r, o) {
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
function pd(e) {
  return e !== At;
}
function Yr(e) {
  return e & 32767;
}
function Tm(e) {
  return e >> 16;
}
function Kr(e, t) {
  let n = Tm(e),
    r = t;
  for (; n > 0; ) (r = r[zt]), n--;
  return r;
}
var hs = !0;
function Jr(e) {
  let t = hs;
  return (hs = e), t;
}
var xm = 256,
  hd = xm - 1,
  gd = 5,
  Nm = 0,
  Ee = {};
function Sm(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(In) && (r = n[In]),
    r == null && (r = n[In] = Nm++);
  let o = r & hd,
    i = 1 << o;
  t.data[e + (o >> gd)] |= i;
}
function Xr(e, t) {
  let n = md(e, t);
  if (n !== -1) return n;
  let r = t[y];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    $i(r.data, e),
    $i(t, null),
    $i(r.blueprint, null));
  let o = Sa(e, t),
    i = e.injectorIndex;
  if (pd(o)) {
    let s = Yr(o),
      a = Kr(o, t),
      c = a[y].data;
    for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | c[s + l];
  }
  return (t[i + 8] = o), i;
}
function $i(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function md(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Sa(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Dd(o)), r === null)) return At;
    if ((n++, (o = o[zt]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return At;
}
function gs(e, t, n) {
  Sm(e, t, n);
}
function Om(e, t) {
  if (t === "class") return e.classes;
  if (t === "style") return e.styles;
  let n = e.attrs;
  if (n) {
    let r = n.length,
      o = 0;
    for (; o < r; ) {
      let i = n[o];
      if (fd(i)) break;
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
function yd(e, t, n) {
  if (n & T.Optional || e !== void 0) return e;
  da(t, "NodeInjector");
}
function vd(e, t, n, r) {
  if (
    (n & T.Optional && r === void 0 && (r = null),
    (n & (T.Self | T.Host)) === 0)
  ) {
    let o = e[_e],
      i = Y(void 0);
    try {
      return o ? o.get(t, r, n & T.Optional) : _u(t, r, n & T.Optional);
    } finally {
      Y(i);
    }
  }
  return yd(r, t, n);
}
function Ed(e, t, n, r = T.Default, o) {
  if (e !== null) {
    if (t[I] & 2048 && !(r & T.Self)) {
      let s = Pm(e, t, n, r, Ee);
      if (s !== Ee) return s;
    }
    let i = Id(e, t, n, r, Ee);
    if (i !== Ee) return i;
  }
  return vd(t, n, r, o);
}
function Id(e, t, n, r, o) {
  let i = km(n);
  if (typeof i == "function") {
    if (!od(t, e, r)) return r & T.Host ? yd(o, n, r) : vd(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & T.Optional))) da(n);
      else return s;
    } finally {
      cd();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = md(e, t),
      c = At,
      l = r & T.Host ? t[Q][ee] : null;
    for (
      (a === -1 || r & T.SkipSelf) &&
      ((c = a === -1 ? Sa(e, t) : t[a + 8]),
      c === At || !Dl(r, !1)
        ? (a = -1)
        : ((s = t[y]), (a = Yr(c)), (t = Kr(c, t))));
      a !== -1;

    ) {
      let u = t[y];
      if (Il(i, a, u.data)) {
        let d = Rm(a, t, n, s, r, l);
        if (d !== Ee) return d;
      }
      (c = t[a + 8]),
        c !== At && Dl(r, t[y].data[a + 8] === l) && Il(i, a, t)
          ? ((s = u), (a = Yr(c)), (t = Kr(c, t)))
          : (a = -1);
    }
  }
  return o;
}
function Rm(e, t, n, r, o, i) {
  let s = t[y],
    a = s.data[e + 8],
    c = r == null ? mt(a) && hs : r != s && (a.type & 3) !== 0,
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
    if (f && Ie(f) && f.type === n) return c;
  }
  return null;
}
function Mn(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (o instanceof ut) {
    let s = o;
    s.resolving && Mu(Cg(i[n]));
    let a = Jr(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      l = s.injectImpl ? Y(s.injectImpl) : null,
      u = od(e, r, T.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Dm(n, i[n], t);
    } finally {
      l !== null && Y(l), Jr(a), (s.resolving = !1), cd();
    }
  }
  return o;
}
function km(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(In) ? e[In] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & hd : Am) : t;
}
function Il(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> gd)] & r);
}
function Dl(e, t) {
  return !(e & T.Self) && !(e & T.Host && t);
}
var nt = class {
  _tNode;
  _lView;
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return Ed(this._tNode, this._lView, t, wo(r), n);
  }
};
function Am() {
  return new nt(z(), v());
}
function tS(e) {
  return On(() => {
    let t = e.prototype.constructor,
      n = t[$r] || ms(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[$r] || ms(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function ms(e) {
  return Iu(e)
    ? () => {
        let t = ms(G(e));
        return t && t();
      }
    : ot(e);
}
function Pm(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[I] & 2048 && !bn(s); ) {
    let a = Id(i, s, n, r | T.Self, Ee);
    if (a !== Ee) return a;
    let c = i.parent;
    if (!c) {
      let l = s[Uu];
      if (l) {
        let u = l.get(n, Ee, r);
        if (u !== Ee) return u;
      }
      (c = Dd(s)), (s = s[zt]);
    }
    i = c;
  }
  return o;
}
function Dd(e) {
  let t = e[y],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[ee] : null;
}
function nS(e) {
  return Om(z(), e);
}
function wl(e, t = null, n = null, r) {
  let o = wd(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function wd(e, t = null, n = null, r, o = new Set()) {
  let i = [n || K, jg(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : J(e))),
    new Dn(i, t || ma(), r || null, o)
  );
}
var dt = class e {
  static THROW_IF_NOT_FOUND = tt;
  static NULL = new zr();
  static create(t, n) {
    if (Array.isArray(t)) return wl({ name: "" }, n, t, "");
    {
      let r = t.name ?? "";
      return wl({ name: r }, t.parent, t.providers, r);
    }
  }
  static ɵprov = q({ token: e, providedIn: "any", factory: () => $e(Ou) });
  static __NG_ELEMENT_ID__ = -1;
};
var Lm = new x("");
Lm.__NG_ELEMENT_ID__ = (e) => {
  let t = z();
  if (t === null) throw new C(204, !1);
  if (t.type & 2) return t.value;
  if (e & T.Optional) return null;
  throw new C(204, !1);
};
var bd = !1,
  xo = (() => {
    class e {
      static __NG_ELEMENT_ID__ = Fm;
      static __NG_ENV_ID__ = (n) => n;
    }
    return e;
  })(),
  eo = class extends xo {
    _lView;
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return ed(this._lView, t), () => rm(this._lView, t);
    }
  };
function Fm() {
  return new eo(v());
}
var ft = class {},
  Oa = new x("", { providedIn: "root", factory: () => !1 });
var Md = new x(""),
  Cd = new x(""),
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
var ys = class extends ve {
    __isAsync;
    destroyRef = void 0;
    pendingTasks = void 0;
    constructor(t = !1) {
      super(),
        (this.__isAsync = t),
        Bu() &&
          ((this.destroyRef = E(xo, { optional: !0 }) ?? void 0),
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
  He = ys;
function Cn(...e) {}
function _d(e) {
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
function bl(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = Cn;
    }
  );
}
var Ra = "isAngularZone",
  to = Ra + "_ID",
  Vm = 0,
  ie = class e {
    hasPendingMacrotasks = !1;
    hasPendingMicrotasks = !1;
    isStable = !0;
    onUnstable = new He(!1);
    onMicrotaskEmpty = new He(!1);
    onStable = new He(!1);
    onError = new He(!1);
    constructor(t) {
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = bd,
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
        Bm(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(Ra) === !0;
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
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, jm, Cn, Cn);
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
  jm = {};
function ka(e) {
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
function Hm(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    _d(() => {
      (e.callbackScheduled = !1),
        vs(e),
        (e.isCheckStableRunning = !0),
        ka(e),
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
    vs(e);
}
function Bm(e) {
  let t = () => {
      Hm(e);
    },
    n = Vm++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [Ra]: !0, [to]: n, [to + n]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if ($m(c)) return r.invokeTask(i, s, a, c);
      try {
        return Ml(e), r.invokeTask(i, s, a, c);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          Cl(e);
      }
    },
    onInvoke: (r, o, i, s, a, c, l) => {
      try {
        return Ml(e), r.invoke(i, s, a, c, l);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !Um(c) &&
          t(),
          Cl(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), vs(e), ka(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function vs(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function Ml(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function Cl(e) {
  e._nesting--, ka(e);
}
var Es = class {
  hasPendingMicrotasks = !1;
  hasPendingMacrotasks = !1;
  isStable = !0;
  onUnstable = new He();
  onMicrotaskEmpty = new He();
  onStable = new He();
  onError = new He();
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
function $m(e) {
  return Td(e, "__ignore_ng_zone__");
}
function Um(e) {
  return Td(e, "__scheduler_tick__");
}
function Td(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var pt = class {
    _console = console;
    handleError(t) {
      this._console.error("ERROR", t);
    }
  },
  qm = new x("", {
    providedIn: "root",
    factory: () => {
      let e = E(ie),
        t = E(pt);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function _l(e, t) {
  return yu(e, t);
}
function Wm(e) {
  return yu(mu, e);
}
var rS = ((_l.required = Wm), _l);
function zm() {
  return Jt(z(), v());
}
function Jt(e, t) {
  return new No(me(e, t));
}
var No = (() => {
  class e {
    nativeElement;
    constructor(n) {
      this.nativeElement = n;
    }
    static __NG_ELEMENT_ID__ = zm;
  }
  return e;
})();
function Gm(e) {
  return e instanceof No ? e.nativeElement : e;
}
function Qm(e) {
  return typeof e == "function" && e[ce] !== void 0;
}
function oS(e, t) {
  let n = li(e, t?.equal),
    r = n[ce];
  return (
    (n.set = (o) => un(r, o)),
    (n.update = (o) => ui(r, o)),
    (n.asReadonly = Zm.bind(n)),
    n
  );
}
function Zm() {
  let e = this[ce];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    (t[ce] = e), (e.readonlyFn = t);
  }
  return e.readonlyFn;
}
function xd(e) {
  return Qm(e) && typeof e.set == "function";
}
function Ym() {
  return this._results[Symbol.iterator]();
}
var Is = class {
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
      let r = Pg(t);
      (this._changesDetected = !Ag(this._results, r, n)) &&
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
    [Symbol.iterator] = Ym;
  },
  Km = "ngSkipHydration",
  Jm = "ngskiphydration";
function Nd(e) {
  let t = e.mergedAttrs;
  if (t === null) return !1;
  for (let n = 0; n < t.length; n += 2) {
    let r = t[n];
    if (typeof r == "number") return !1;
    if (typeof r == "string" && r.toLowerCase() === Jm) return !0;
  }
  return !1;
}
function Sd(e) {
  return e.hasAttribute(Km);
}
function no(e) {
  return (e.flags & 128) === 128;
}
function Xm(e) {
  if (no(e)) return !0;
  let t = e.parent;
  for (; t; ) {
    if (no(e) || Nd(t)) return !0;
    t = t.parent;
  }
  return !1;
}
var Od = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(Od || {}),
  Rd = new Map(),
  ey = 0;
function ty() {
  return ey++;
}
function ny(e) {
  Rd.set(e[Mo], e);
}
function Ds(e) {
  Rd.delete(e[Mo]);
}
var Tl = "__ngContext__";
function Xt(e, t) {
  he(t) ? ((e[Tl] = t[Mo]), ny(t)) : (e[Tl] = t);
}
function kd(e) {
  return Pd(e[wn]);
}
function Ad(e) {
  return Pd(e[pe]);
}
function Pd(e) {
  for (; e !== null && !we(e); ) e = e[pe];
  return e;
}
var ws;
function iS(e) {
  ws = e;
}
function An() {
  if (ws !== void 0) return ws;
  if (typeof document < "u") return document;
  throw new C(210, !1);
}
var ro = new x("", { providedIn: "root", factory: () => ry }),
  ry = "ng",
  oy = new x(""),
  sS = new x("", { providedIn: "platform", factory: () => "unknown" });
var aS = new x(""),
  cS = new x("", {
    providedIn: "root",
    factory: () =>
      An().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
      null,
  });
function iy() {
  let e = new So();
  return (e.store = sy(An(), E(ro))), e;
}
var So = (() => {
  class e {
    static ɵprov = q({ token: e, providedIn: "root", factory: iy });
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
function sy(e, t) {
  let n = e.getElementById(t + "-state");
  if (n?.textContent)
    try {
      return JSON.parse(n.textContent);
    } catch (r) {
      console.warn("Exception while restoring TransferState for app " + t, r);
    }
  return {};
}
var Ld = "h",
  Fd = "b",
  ay = "f",
  cy = "n",
  ly = "e",
  uy = "t",
  Aa = "c",
  Vd = "x",
  oo = "r",
  dy = "i",
  fy = "n",
  jd = "d";
var py = "di",
  hy = "s",
  gy = "p";
var xr = new x(""),
  Hd = !1,
  Bd = new x("", { providedIn: "root", factory: () => Hd });
var $d = new x(""),
  my = !1,
  yy = new x(""),
  xl = new x("", { providedIn: "root", factory: () => new Map() }),
  Pa = (function (e) {
    return (
      (e[(e.CHANGE_DETECTION = 0)] = "CHANGE_DETECTION"),
      (e[(e.AFTER_NEXT_RENDER = 1)] = "AFTER_NEXT_RENDER"),
      e
    );
  })(Pa || {}),
  Oo = new x(""),
  Nl = new Set();
function vt(e) {
  Nl.has(e) ||
    (Nl.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
var La = (() => {
  class e {
    view;
    node;
    constructor(n, r) {
      (this.view = n), (this.node = r);
    }
    static __NG_ELEMENT_ID__ = vy;
  }
  return e;
})();
function vy() {
  return new La(v(), z());
}
var St = (function (e) {
    return (
      (e[(e.EarlyRead = 0)] = "EarlyRead"),
      (e[(e.Write = 1)] = "Write"),
      (e[(e.MixedReadWrite = 2)] = "MixedReadWrite"),
      (e[(e.Read = 3)] = "Read"),
      e
    );
  })(St || {}),
  Ud = (() => {
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
  Ey = [St.EarlyRead, St.Write, St.MixedReadWrite, St.Read],
  Iy = (() => {
    class e {
      ngZone = E(ie);
      scheduler = E(ft);
      errorHandler = E(pt, { optional: !0 });
      sequences = new Set();
      deferredRegistrations = new Set();
      executing = !1;
      constructor() {
        E(Oo, { optional: !0 });
      }
      execute() {
        let n = this.sequences.size > 0;
        n && O(16), (this.executing = !0);
        for (let r of Ey)
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
          ? ((r[kt] ??= []).push(n), Qt(r), (r[I] |= 8192))
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
        return r ? r.run(Pa.AFTER_NEXT_RENDER, n) : n();
      }
      static ɵprov = q({
        token: e,
        providedIn: "root",
        factory: () => new e(),
      });
    }
    return e;
  })(),
  bs = class {
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
      let t = this.view?.[kt];
      t && (this.view[kt] = t.filter((n) => n !== this));
    }
  };
function qd(e, t) {
  !t?.injector && $u(qd);
  let n = t?.injector ?? E(dt);
  return vt("NgAfterNextRender"), wy(e, n, t, !0);
}
function Dy(e, t) {
  if (e instanceof Function) {
    let n = [void 0, void 0, void 0, void 0];
    return (n[t] = e), n;
  } else return [e.earlyRead, e.write, e.mixedReadWrite, e.read];
}
function wy(e, t, n, r) {
  let o = t.get(Ud);
  o.impl ??= t.get(Iy);
  let i = t.get(Oo, null, { optional: !0 }),
    s = n?.phase ?? St.MixedReadWrite,
    a = n?.manualCleanup !== !0 ? t.get(xo) : null,
    c = t.get(La, null, { optional: !0 }),
    l = new bs(o.impl, Dy(e, s), c?.view, r, a, i?.snapshot(null));
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
  Sl = 0,
  by = 1,
  B = (function (e) {
    return (
      (e[(e.Placeholder = 0)] = "Placeholder"),
      (e[(e.Loading = 1)] = "Loading"),
      (e[(e.Complete = 2)] = "Complete"),
      (e[(e.Error = 3)] = "Error"),
      e
    );
  })(B || {});
var My = 0,
  Ro = 1;
var Cy = 4,
  _y = 5;
var Ty = 7,
  Pt = 8,
  xy = 9,
  Wd = (function (e) {
    return (
      (e[(e.Manual = 0)] = "Manual"),
      (e[(e.Playthrough = 1)] = "Playthrough"),
      e
    );
  })(Wd || {});
function Vr(e, t) {
  let n = Sy(e),
    r = t[n];
  if (r !== null) {
    for (let o of r) o();
    t[n] = null;
  }
}
function Ny(e) {
  Vr(1, e), Vr(0, e), Vr(2, e);
}
function Sy(e) {
  let t = Cy;
  return e === 1 ? (t = _y) : e === 2 && (t = xy), t;
}
function zd(e) {
  return e + 1;
}
function Pn(e, t) {
  let n = e[y],
    r = zd(t.index);
  return e[r];
}
function ko(e, t) {
  let n = zd(t.index);
  return e.data[n];
}
function Oy(e, t, n) {
  let r = t[y],
    o = ko(r, n);
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
function Ol(e, t) {
  return t === B.Placeholder
    ? (e.placeholderBlockConfig?.[Sl] ?? null)
    : t === B.Loading
      ? (e.loadingBlockConfig?.[Sl] ?? null)
      : null;
}
function Ry(e) {
  return e.loadingBlockConfig?.[by] ?? null;
}
function Rl(e, t) {
  if (!e || e.length === 0) return t;
  let n = new Set(e);
  for (let r of t) n.add(r);
  return e.length === n.size ? e : Array.from(n);
}
function ky(e, t) {
  let n = t.primaryTmplIndex + P;
  return kn(e, n);
}
var Ao = "ngb";
var Ay = (e, t, n) => {
    let r = e,
      o = r.__jsaction_fns ?? new Map(),
      i = o.get(t) ?? [];
    i.push(n), o.set(t, i), (r.__jsaction_fns = o);
  },
  Py = (e, t) => {
    let n = e,
      r = n.getAttribute(Ao) ?? "",
      o = t.get(r) ?? new Set();
    o.has(n) || o.add(n), t.set(r, o);
  };
var Ly = (e) => {
    e.removeAttribute(Ri.JSACTION),
      e.removeAttribute(Ao),
      (e.__jsaction_fns = void 0);
  },
  Fy = new x("", { providedIn: "root", factory: () => ({}) });
function Gd(e, t) {
  let n = t?.__jsaction_fns?.get(e.type);
  if (!(!n || !t?.isConnected)) for (let r of n) r(e);
}
var Fa = new x("");
var Vy = "__nghData__",
  Qd = Vy,
  jy = "__nghDeferData__",
  Hy = jy,
  Ui = "ngh",
  By = "nghm",
  Zd = () => null;
function $y(e, t, n = !1) {
  let r = e.getAttribute(Ui);
  if (r == null) return null;
  let [o, i] = r.split("|");
  if (((r = n ? i : o), !r)) return null;
  let s = i ? `|${i}` : "",
    a = n ? o : s,
    c = {};
  if (r !== "") {
    let u = t.get(So, null, { optional: !0 });
    u !== null && (c = u.get(Qd, [])[Number(r)]);
  }
  let l = { data: c, firstChild: e.firstChild ?? null };
  return (
    n && ((l.firstChild = e), Po(l, 0, e.nextSibling)),
    a ? e.setAttribute(Ui, a) : e.removeAttribute(Ui),
    l
  );
}
function Uy() {
  Zd = $y;
}
function Yd(e, t, n = !1) {
  return Zd(e, t, n);
}
function qy(e) {
  let t = e._lView;
  return t[y].type === 2 ? null : (bn(t) && (t = t[P]), t);
}
function Wy(e) {
  return e.textContent?.replace(/\s/gm, "");
}
function zy(e) {
  let t = An(),
    n = t.createNodeIterator(e, NodeFilter.SHOW_COMMENT, {
      acceptNode(i) {
        let s = Wy(i);
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
function Po(e, t, n) {
  (e.segmentHeads ??= {}), (e.segmentHeads[t] = n);
}
function Ms(e, t) {
  return e.segmentHeads?.[t] ?? null;
}
function Gy(e) {
  return e.get(yy, !1, { optional: !0 });
}
function Qy(e, t) {
  let n = e.data,
    r = n[ly]?.[t] ?? null;
  return r === null && n[Aa]?.[t] && (r = Va(e, t)), r;
}
function Kd(e, t) {
  return e.data[Aa]?.[t] ?? null;
}
function Va(e, t) {
  let n = Kd(e, t) ?? [],
    r = 0;
  for (let o of n) r += o[oo] * (o[Vd] ?? 1);
  return r;
}
function Zy(e) {
  if (typeof e.disconnectedNodes > "u") {
    let t = e.data[jd];
    e.disconnectedNodes = t ? new Set(t) : null;
  }
  return e.disconnectedNodes;
}
function Ln(e, t) {
  if (typeof e.disconnectedNodes > "u") {
    let n = e.data[jd];
    e.disconnectedNodes = n ? new Set(n) : null;
  }
  return !!Zy(e)?.has(t);
}
function Yy(e, t) {
  let n = t.get(Fa),
    o = t.get(So).get(Hy, {}),
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
    c.unshift(s), (s = o[s][gy]);
  }
  return { parentBlockPromise: a, hydrationQueue: c };
}
function qi(e) {
  return (
    !!e && e.nodeType === Node.COMMENT_NODE && e.textContent?.trim() === By
  );
}
function kl(e) {
  for (; e && e.nodeType === Node.TEXT_NODE; ) e = e.previousSibling;
  return e;
}
function Ky(e) {
  for (let r of e.body.childNodes) if (qi(r)) return;
  let t = kl(e.body.previousSibling);
  if (qi(t)) return;
  let n = kl(e.head.lastChild);
  if (!qi(n)) throw new C(-507, !1);
}
function Jd(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = b(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          Ca(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      b(r);
    }
  }
}
function Cs(e, t, n) {
  Ca(0);
  let r = b(null);
  try {
    t(e, n);
  } finally {
    b(r);
  }
}
function ja(e, t, n) {
  if (ya(t)) {
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
function Jy() {
  if (Nr === void 0 && ((Nr = null), je.trustedTypes))
    try {
      Nr = je.trustedTypes.createPolicy("angular", {
        createHTML: (e) => e,
        createScript: (e) => e,
        createScriptURL: (e) => e,
      });
    } catch {}
  return Nr;
}
function Lo(e) {
  return Jy()?.createHTML(e) || e;
}
var Sr;
function Xd() {
  if (Sr === void 0 && ((Sr = null), je.trustedTypes))
    try {
      Sr = je.trustedTypes.createPolicy("angular#unsafe-bypass", {
        createHTML: (e) => e,
        createScript: (e) => e,
        createScriptURL: (e) => e,
      });
    } catch {}
  return Sr;
}
function Al(e) {
  return Xd()?.createHTML(e) || e;
}
function Pl(e) {
  return Xd()?.createScriptURL(e) || e;
}
var io = class {
  changingThisBreaksApplicationSecurity;
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${gu})`;
  }
};
function en(e) {
  return e instanceof io ? e.changingThisBreaksApplicationSecurity : e;
}
function Ha(e, t) {
  let n = Xy(e);
  if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${gu})`);
  }
  return n === t;
}
function Xy(e) {
  return (e instanceof io && e.getTypeName()) || null;
}
function ev(e) {
  let t = new Ts(e);
  return tv() ? new _s(t) : t;
}
var _s = class {
    inertDocumentHelper;
    constructor(t) {
      this.inertDocumentHelper = t;
    }
    getInertBodyElement(t) {
      t = "<body><remove></remove>" + t;
      try {
        let n = new window.DOMParser().parseFromString(Lo(t), "text/html").body;
        return n === null
          ? this.inertDocumentHelper.getInertBodyElement(t)
          : (n.firstChild?.remove(), n);
      } catch {
        return null;
      }
    }
  },
  Ts = class {
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
      return (n.innerHTML = Lo(t)), n;
    }
  };
function tv() {
  try {
    return !!new window.DOMParser().parseFromString(Lo(""), "text/html");
  } catch {
    return !1;
  }
}
var nv = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function ef(e) {
  return (e = String(e)), e.match(nv) ? e : "unsafe:" + e;
}
function ke(e) {
  let t = {};
  for (let n of e.split(",")) t[n] = !0;
  return t;
}
function Fn(...e) {
  let t = {};
  for (let n of e) for (let r in n) n.hasOwnProperty(r) && (t[r] = !0);
  return t;
}
var tf = ke("area,br,col,hr,img,wbr"),
  nf = ke("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
  rf = ke("rp,rt"),
  rv = Fn(rf, nf),
  ov = Fn(
    nf,
    ke(
      "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
    )
  ),
  iv = Fn(
    rf,
    ke(
      "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
    )
  ),
  Ll = Fn(tf, ov, iv, rv),
  of = ke("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
  sv = ke(
    "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
  ),
  av = ke(
    "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
  ),
  cv = Fn(of, sv, av),
  lv = ke("script,style,template"),
  xs = class {
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
          o.push(n), (n = fv(n));
          continue;
        }
        for (; n; ) {
          n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
          let i = dv(n);
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
      let n = Fl(t).toLowerCase();
      if (!Ll.hasOwnProperty(n))
        return (this.sanitizedSomething = !0), !lv.hasOwnProperty(n);
      this.buf.push("<"), this.buf.push(n);
      let r = t.attributes;
      for (let o = 0; o < r.length; o++) {
        let i = r.item(o),
          s = i.name,
          a = s.toLowerCase();
        if (!cv.hasOwnProperty(a)) {
          this.sanitizedSomething = !0;
          continue;
        }
        let c = i.value;
        of[a] && (c = ef(c)), this.buf.push(" ", s, '="', Vl(c), '"');
      }
      return this.buf.push(">"), !0;
    }
    endElement(t) {
      let n = Fl(t).toLowerCase();
      Ll.hasOwnProperty(n) &&
        !tf.hasOwnProperty(n) &&
        (this.buf.push("</"), this.buf.push(n), this.buf.push(">"));
    }
    chars(t) {
      this.buf.push(Vl(t));
    }
  };
function uv(e, t) {
  return (
    (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !==
    Node.DOCUMENT_POSITION_CONTAINED_BY
  );
}
function dv(e) {
  let t = e.nextSibling;
  if (t && e !== t.previousSibling) throw sf(t);
  return t;
}
function fv(e) {
  let t = e.firstChild;
  if (t && uv(e, t)) throw sf(t);
  return t;
}
function Fl(e) {
  let t = e.nodeName;
  return typeof t == "string" ? t : "FORM";
}
function sf(e) {
  return new Error(
    `Failed to sanitize html because the element is clobbered: ${e.outerHTML}`
  );
}
var pv = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
  hv = /([^\#-~ |!])/g;
function Vl(e) {
  return e
    .replace(/&/g, "&amp;")
    .replace(pv, function (t) {
      let n = t.charCodeAt(0),
        r = t.charCodeAt(1);
      return "&#" + ((n - 55296) * 1024 + (r - 56320) + 65536) + ";";
    })
    .replace(hv, function (t) {
      return "&#" + t.charCodeAt(0) + ";";
    })
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
var Or;
function gv(e, t) {
  let n = null;
  try {
    Or = Or || ev(e);
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
    let a = new xs().sanitizeChildren(jl(n) || n);
    return Lo(a);
  } finally {
    if (n) {
      let r = jl(n) || n;
      for (; r.firstChild; ) r.firstChild.remove();
    }
  }
}
function jl(e) {
  return "content" in e && mv(e) ? e.content : null;
}
function mv(e) {
  return e.nodeType === Node.ELEMENT_NODE && e.nodeName === "TEMPLATE";
}
var Fo = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(Fo || {});
function lS(e) {
  let t = Ba();
  return t
    ? Al(t.sanitize(Fo.HTML, e) || "")
    : Ha(e, "HTML")
      ? Al(en(e))
      : gv(An(), rt(e));
}
function yv(e) {
  let t = Ba();
  return t ? t.sanitize(Fo.URL, e) || "" : Ha(e, "URL") ? en(e) : ef(rt(e));
}
function vv(e) {
  let t = Ba();
  if (t) return Pl(t.sanitize(Fo.RESOURCE_URL, e) || "");
  if (Ha(e, "ResourceURL")) return Pl(en(e));
  throw new C(904, !1);
}
function Ev(e, t) {
  return (t === "src" &&
    (e === "embed" ||
      e === "frame" ||
      e === "iframe" ||
      e === "media" ||
      e === "script")) ||
    (t === "href" && (e === "base" || e === "link"))
    ? vv
    : yv;
}
function uS(e, t, n) {
  return Ev(t, n)(e);
}
function Ba() {
  let e = v();
  return e && e[Te].sanitizer;
}
var Iv = /^>|^->|<!--|-->|--!>|<!-$/g,
  Dv = /(<|>)/g,
  wv = "\u200B$1\u200B";
function bv(e) {
  return e.replace(Iv, (t) => t.replace(Dv, wv));
}
function Mv(e) {
  return e.ownerDocument.body;
}
function af(e) {
  return e instanceof Function ? e() : e;
}
function Cv(e, t, n) {
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
var cf = "ng-template";
function _v(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && Cv(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if ($a(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function $a(e) {
  return e.type === 4 && e.value !== cf;
}
function Tv(e, t, n) {
  let r = e.type === 4 && !n ? cf : e.value;
  return t === r;
}
function xv(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? Ov(o) : 0,
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
          (c !== "" && !Tv(e, c, n)) || (c === "" && t.length === 1))
        ) {
          if (fe(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !_v(e, o, c, n)) {
          if (fe(r)) return !1;
          s = !0;
        }
      } else {
        let l = t[++a],
          u = Nv(c, o, $a(e), n);
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
function Nv(e, t, n, r) {
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
  } else return Rv(t, e);
}
function lf(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (xv(e, t[r], n)) return !0;
  return !1;
}
function Sv(e) {
  let t = e.attrs;
  if (t != null) {
    let n = t.indexOf(5);
    if ((n & 1) === 0) return t[n + 1];
  }
  return null;
}
function Ov(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (fd(n)) return t;
  }
  return e.length;
}
function Rv(e, t) {
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
function kv(e, t) {
  e: for (let n = 0; n < t.length; n++) {
    let r = t[n];
    if (e.length === r.length) {
      for (let o = 0; o < e.length; o++) if (e[o] !== r[o]) continue e;
      return !0;
    }
  }
  return !1;
}
function Hl(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function Av(e) {
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
      o !== "" && !fe(s) && ((t += Hl(i, o)), (o = "")),
        (r = s),
        (i = i || !fe(r));
    n++;
  }
  return o !== "" && (t += Hl(i, o)), t;
}
function Pv(e) {
  return e.map(Av).join(",");
}
function Lv(e) {
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
function uf(e, t) {
  return e.createText(t);
}
function Fv(e, t, n) {
  e.setValue(t, n);
}
function df(e, t) {
  return e.createComment(bv(t));
}
function Ua(e, t, n) {
  return e.createElement(t, n);
}
function so(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function ff(e, t, n) {
  e.appendChild(t, n);
}
function Bl(e, t, n, r, o) {
  r !== null ? so(e, t, n, r, o) : ff(e, t, n);
}
function qa(e, t, n) {
  e.removeChild(null, t, n);
}
function pf(e) {
  e.textContent = "";
}
function Vv(e, t, n) {
  e.setAttribute(t, "style", n);
}
function jv(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function hf(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && Cm(e, t, r),
    o !== null && jv(e, t, o),
    i !== null && Vv(e, t, i);
}
function Wa(e, t, n, r, o, i, s, a, c, l, u) {
  let d = P + r,
    p = d + o,
    f = Hv(d, p),
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
function Hv(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : ae);
  return n;
}
function Bv(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = Wa(
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
function za(e, t, n, r, o, i, s, a, c, l, u) {
  let d = t.blueprint.slice();
  return (
    (d[se] = o),
    (d[I] = r | 4 | 128 | 8 | 64 | 1024),
    (l !== null || (e && e[I] & 2048)) && (d[I] |= 2048),
    Ju(d),
    (d[U] = d[zt] = e),
    (d[$] = n),
    (d[Te] = s || (e && e[Te])),
    (d[A] = a || (e && e[A])),
    (d[_e] = c || (e && e[_e]) || null),
    (d[ee] = i),
    (d[Mo] = ty()),
    (d[ue] = u),
    (d[Uu] = l),
    (d[Q] = t.type == 2 ? e[Q] : d),
    d
  );
}
function $v(e, t, n) {
  let r = me(t, e),
    o = Bv(n),
    i = e[Te].rendererFactory,
    s = Ga(
      e,
      za(
        e,
        o,
        null,
        gf(n),
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
function gf(e) {
  let t = 16;
  return e.signals ? (t = 4096) : e.onPush && (t = 64), t;
}
function mf(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function Ga(e, t) {
  return e[wn] ? (e[ml][pe] = t) : (e[wn] = t), (e[ml] = t), t;
}
function dS(e = 1) {
  yf(F(), v(), Re() + e, !1);
}
function yf(e, t, n, r) {
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
var Vo = (function (e) {
  return (
    (e[(e.None = 0)] = "None"),
    (e[(e.SignalBased = 1)] = "SignalBased"),
    (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
    e
  );
})(Vo || {});
function Ns(e, t, n, r) {
  let o = b(null);
  try {
    let [i, s, a] = e.inputs[n],
      c = null;
    (s & Vo.SignalBased) !== 0 && (c = t[i][ce]),
      c !== null && c.transformFn !== void 0
        ? (r = c.transformFn(r))
        : a !== null && (r = a.call(t, r)),
      e.setInput !== null ? e.setInput(t, c, r, n, i) : Wu(t, c, i, r);
  } finally {
    b(o);
  }
}
function vf(e, t, n, r, o) {
  let i = Re(),
    s = r & 2;
  try {
    lt(-1), s && t.length > P && yf(e, t, P, !1), O(s ? 2 : 0, o), n(r, o);
  } finally {
    lt(i), O(s ? 3 : 1, o);
  }
}
function jo(e, t, n) {
  Zv(e, t, n), (n.flags & 64) === 64 && Yv(e, t, n);
}
function Qa(e, t, n = me) {
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
function Uv(e, t, n, r) {
  let i = r.get(Bd, Hd) || n === _n.ShadowDom,
    s = e.selectRootElement(t, i);
  return qv(s), s;
}
function qv(e) {
  Ef(e);
}
var Ef = () => null;
function Wv(e) {
  Sd(e) ? pf(e) : zy(e);
}
function zv() {
  Ef = Wv;
}
function Gv(e) {
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
function If(e, t, n, r, o, i, s, a) {
  if (!a && Ka(t, e, n, r, o)) {
    mt(t) && Qv(n, t.index);
    return;
  }
  if (t.type & 3) {
    let c = me(t, n);
    (r = Gv(r)),
      (o = s != null ? s(o, t.value || "", r) : o),
      i.setProperty(c, r, o);
  } else t.type & 12;
}
function Qv(e, t) {
  let n = De(t, e);
  n[I] & 16 || (n[I] |= 64);
}
function Zv(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd;
  mt(n) && $v(t, n, e.data[r + n.componentOffset]),
    e.firstCreatePass || Xr(n, t);
  let i = n.initialInputs;
  for (let s = r; s < o; s++) {
    let a = e.data[s],
      c = Mn(t, e, s, n);
    if ((Xt(c, t), i !== null && eE(t, s - r, c, a, n, i), Ie(a))) {
      let l = De(n.index, t);
      l[$] = Mn(t, e, s, n);
    }
  }
}
function Yv(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = ym();
  try {
    lt(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        l = t[a];
      ps(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          Kv(c, l);
    }
  } finally {
    lt(-1), ps(s);
  }
}
function Kv(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function Za(e, t) {
  let n = e.directiveRegistry,
    r = null;
  if (n)
    for (let o = 0; o < n.length; o++) {
      let i = n[o];
      lf(t, i.selectors, !1) && ((r ??= []), Ie(i) ? r.unshift(i) : r.push(i));
    }
  return r;
}
function Jv(e, t, n, r, o, i) {
  let s = me(e, t);
  Xv(t[A], s, i, e.value, n, r, o);
}
function Xv(e, t, n, r, o, i, s) {
  if (i == null) e.removeAttribute(t, o, n);
  else {
    let a = s == null ? rt(i) : s(i, r || "", o);
    e.setAttribute(t, o, a, n);
  }
}
function eE(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; a += 2) {
      let c = s[a],
        l = s[a + 1];
      Ns(r, n, c, l);
    }
}
function Ya(e, t) {
  let n = e[_e],
    r = n ? n.get(pt, null) : null;
  r && r.handleError(t);
}
function Ka(e, t, n, r, o) {
  let i = e.inputs?.[r],
    s = e.hostDirectiveInputs?.[r],
    a = !1;
  if (s)
    for (let c = 0; c < s.length; c += 2) {
      let l = s[c],
        u = s[c + 1],
        d = t.data[l];
      Ns(d, n[l], u, o), (a = !0);
    }
  if (i)
    for (let c of i) {
      let l = n[c],
        u = t.data[c];
      Ns(u, l, r, o), (a = !0);
    }
  return a;
}
function tE(e, t) {
  let n = De(t, e),
    r = n[y];
  nE(r, n);
  let o = n[se];
  o !== null && n[ue] === null && (n[ue] = Yd(o, n[_e])),
    O(18),
    Ja(r, n, n[$]),
    O(19, n[$]);
}
function nE(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Ja(e, t, n) {
  _a(t);
  try {
    let r = e.viewQuery;
    r !== null && Cs(1, r, n);
    let o = e.template;
    o !== null && vf(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[xe]?.finishViewCreation(e),
      e.staticContentQueries && Jd(e, t),
      e.staticViewQueries && Cs(2, e.viewQuery, n);
    let i = e.components;
    i !== null && rE(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[I] &= -5), Ta();
  }
}
function rE(e, t) {
  for (let n = 0; n < t.length; n++) tE(e, t[n]);
}
function tn(e, t, n, r) {
  let o = b(null);
  try {
    let i = t.tView,
      a = e[I] & 4096 ? 4096 : 16,
      c = za(
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
    let u = e[xe];
    return u !== null && (c[xe] = u.createEmbeddedView(i)), Ja(i, c, n), c;
  } finally {
    b(o);
  }
}
function ht(e, t) {
  return !t || t.firstChild === null || no(e);
}
var oE;
function Xa(e, t) {
  return oE(e, t);
}
var Ss = (function (e) {
  return (
    (e[(e.Important = 1)] = "Important"), (e[(e.DashCase = 2)] = "DashCase"), e
  );
})(Ss || {});
function Et(e) {
  return (e.flags & 32) === 32;
}
function Ot(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    we(r) ? (i = r) : he(r) && ((s = !0), (r = r[se]));
    let a = ge(r);
    e === 0 && n !== null
      ? o == null
        ? ff(t, n, a)
        : so(t, n, a, o || null, !0)
      : e === 1 && n !== null
        ? so(t, n, a, o || null, !0)
        : e === 2
          ? qa(t, a, s)
          : e === 3 && t.destroyNode(a),
      i != null && hE(t, e, i, n, o);
  }
}
function iE(e, t) {
  Df(e, t), (t[se] = null), (t[ee] = null);
}
function sE(e, t, n, r, o, i) {
  (r[se] = o), (r[ee] = t), $o(e, r, n, 1, o, i);
}
function Df(e, t) {
  t[Te].changeDetectionScheduler?.notify(9), $o(e, t, t[A], 2, null, null);
}
function aE(e) {
  let t = e[wn];
  if (!t) return Wi(e[y], e);
  for (; t; ) {
    let n = null;
    if (he(t)) n = t[wn];
    else {
      let r = t[W];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[pe] && t !== e; ) he(t) && Wi(t[y], t), (t = t[U]);
      t === null && (t = e), he(t) && Wi(t[y], t), (n = t && t[pe]);
    }
    t = n;
  }
}
function ec(e, t) {
  let n = e[jt],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Ho(e, t) {
  if (Gt(t)) return;
  let n = t[A];
  n.destroyNode && $o(e, t, n, 3, null, null), aE(t);
}
function Wi(e, t) {
  if (Gt(t)) return;
  let n = b(null);
  try {
    (t[I] &= -129),
      (t[I] |= 256),
      t[le] && ln(t[le]),
      lE(e, t),
      cE(e, t),
      t[y].type === 1 && t[A].destroy();
    let r = t[st];
    if (r !== null && we(t[U])) {
      r !== t[U] && ec(r, t);
      let o = t[xe];
      o !== null && o.detachView(e);
    }
    Ds(t);
  } finally {
    b(n);
  }
}
function cE(e, t) {
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
  let o = t[Be];
  if (o !== null) {
    t[Be] = null;
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
function lE(e, t) {
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
function wf(e, t, n) {
  return uE(e, t.parent, n);
}
function uE(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[se];
  if (mt(r)) {
    let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
    if (o === _n.None || o === _n.Emulated) return null;
  }
  return me(r, n);
}
function bf(e, t, n) {
  return fE(e, t, n);
}
function dE(e, t, n) {
  return e.type & 40 ? me(e, n) : null;
}
var fE = dE,
  $l;
function Bo(e, t, n, r) {
  let o = wf(e, r, t),
    i = t[A],
    s = r.parent || t[ee],
    a = bf(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) Bl(i, o, n[c], a, !1);
    else Bl(i, o, n, a, !1);
  $l !== void 0 && $l(i, r, t, n, o);
}
function En(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return me(t, e);
    if (n & 4) return Os(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return En(e, r);
      {
        let o = e[t.index];
        return we(o) ? Os(-1, o) : ge(o);
      }
    } else {
      if (n & 128) return En(e, t.next);
      if (n & 32) return Xa(t, e)() || ge(e[t.index]);
      {
        let r = Mf(e, t);
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
function Mf(e, t) {
  if (t !== null) {
    let r = e[Q][ee],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Os(e, t) {
  let n = W + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[y].firstChild;
    if (o !== null) return En(r, o);
  }
  return t[Se];
}
function tc(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      c = n.type;
    if ((s && t === 0 && (a && Xt(ge(a), r), (n.flags |= 2)), !Et(n)))
      if (c & 8) tc(e, t, n.child, r, o, i, !1), Ot(t, e, o, a, i);
      else if (c & 32) {
        let l = Xa(n, r),
          u;
        for (; (u = l()); ) Ot(t, e, o, u, i);
        Ot(t, e, o, a, i);
      } else c & 16 ? Cf(e, t, r, n, o, i) : Ot(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function $o(e, t, n, r, o, i) {
  tc(n, r, e.firstChild, t, o, i, !1);
}
function pE(e, t, n) {
  let r = t[A],
    o = wf(e, n, t),
    i = n.parent || t[ee],
    s = bf(i, n, t);
  Cf(r, 0, t, n, o, s);
}
function Cf(e, t, n, r, o, i) {
  let s = n[Q],
    c = s[ee].projection[r.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      Ot(t, e, o, u, i);
    }
  else {
    let l = c,
      u = s[U];
    no(r) && (l.flags |= 128), tc(e, t, l, u, o, i, !0);
  }
}
function hE(e, t, n, r, o) {
  let i = n[Se],
    s = ge(n);
  i !== s && Ot(t, e, r, i, o);
  for (let a = W; a < n.length; a++) {
    let c = n[a];
    $o(c[y], c, e, t, r, i);
  }
}
function gE(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf("-") === -1 ? void 0 : Ss.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == "string" &&
          o.endsWith("!important") &&
          ((o = o.slice(0, -10)), (i |= Ss.Important)),
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
    i !== null && r.push(ge(i)), we(i) && mE(i, r);
    let s = n.type;
    if (s & 8) ao(e, t, n.child, r);
    else if (s & 32) {
      let a = Xa(n, t),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = Mf(t, n);
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
function mE(e, t) {
  for (let n = W; n < e.length; n++) {
    let r = e[n],
      o = r[y].firstChild;
    o !== null && ao(r[y], r, o, t);
  }
  e[Se] !== e[se] && t.push(e[Se]);
}
function _f(e) {
  if (e[kt] !== null) {
    for (let t of e[kt]) t.impl.addSequence(t);
    e[kt].length = 0;
  }
}
var Tf = [];
function yE(e) {
  return e[le] ?? vE(e);
}
function vE(e) {
  let t = Tf.pop() ?? Object.create(IE);
  return (t.lView = e), t;
}
function EE(e) {
  e.lView[le] !== e && ((e.lView = null), Tf.push(e));
}
var IE = ne(te({}, It), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    Qt(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[le] = this;
  },
});
function DE(e) {
  let t = e[le] ?? Object.create(wE);
  return (t.lView = e), t;
}
var wE = ne(te({}, It), {
  consumerIsAlwaysLive: !0,
  kind: "template",
  consumerMarkedDirty: (e) => {
    let t = ct(e.lView);
    for (; t && !xf(t[y]); ) t = ct(t);
    t && Xu(t);
  },
  consumerOnSignalRead() {
    this.lView[le] = this;
  },
});
function xf(e) {
  return e.type !== 2;
}
function Nf(e) {
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
var bE = 100;
function Sf(e, t = !0, n = 0) {
  let o = e[Te].rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    ME(e, n);
  } catch (s) {
    throw (t && Ya(e, s), s);
  } finally {
    i || o.end?.();
  }
}
function ME(e, t) {
  let n = nd();
  try {
    Zr(!0), Rs(e, t);
    let r = 0;
    for (; _o(e); ) {
      if (r === bE) throw new C(103, !1);
      r++, Rs(e, 1);
    }
  } finally {
    Zr(n);
  }
}
function CE(e, t, n, r) {
  if (Gt(t)) return;
  let o = t[I],
    i = !1,
    s = !1;
  _a(t);
  let a = !0,
    c = null,
    l = null;
  i ||
    (xf(e)
      ? ((l = yE(t)), (c = cn(l)))
      : ri() === null
        ? ((a = !1), (l = DE(t)), (c = cn(l)))
        : t[le] && (ln(t[le]), (t[le] = null)));
  try {
    Ju(t), hm(e.bindingStartIndex), n !== null && vf(e, t, n, 2, r);
    let u = (o & 3) === 3;
    if (!i)
      if (u) {
        let f = e.preOrderCheckHooks;
        f !== null && Pr(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && Lr(t, f, 0, null), Bi(t, 0);
      }
    if (
      (s || _E(t), Nf(t), Of(t, 0), e.contentQueries !== null && Jd(e, t), !i)
    )
      if (u) {
        let f = e.contentCheckHooks;
        f !== null && Pr(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && Lr(t, f, 1), Bi(t, 1);
      }
    xE(e, t);
    let d = e.components;
    d !== null && kf(t, d, 0);
    let p = e.viewQuery;
    if ((p !== null && Cs(2, p, r), !i))
      if (u) {
        let f = e.viewCheckHooks;
        f !== null && Pr(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && Lr(t, f, 2), Bi(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Hi])) {
      for (let f of t[Hi]) f();
      t[Hi] = null;
    }
    i || (_f(t), (t[I] &= -73));
  } catch (u) {
    throw (i || Qt(t), u);
  } finally {
    l !== null && (Un(l, c), a && EE(l)), Ta();
  }
}
function Of(e, t) {
  for (let n = kd(e); n !== null; n = Ad(n))
    for (let r = W; r < n.length; r++) {
      let o = n[r];
      Rf(o, t);
    }
}
function _E(e) {
  for (let t = kd(e); t !== null; t = Ad(t)) {
    if (!(t[I] & 2)) continue;
    let n = t[jt];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      Xu(o);
    }
  }
}
function TE(e, t, n) {
  O(18);
  let r = De(t, e);
  Rf(r, n), O(19, r[$]);
}
function Rf(e, t) {
  va(e) && Rs(e, t);
}
function Rs(e, t) {
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
    CE(r, e, r.template, e[$]);
  else if (o & 8192) {
    Nf(e), Of(e, 1);
    let a = r.components;
    a !== null && kf(e, a, 1), _f(e);
  }
}
function kf(e, t, n) {
  for (let r = 0; r < t.length; r++) TE(e, t[r], n);
}
function xE(e, t) {
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
          mm(s, i);
          let c = t[i];
          O(24, c), a(2, c), O(25, c);
        }
      }
    } finally {
      lt(-1);
    }
}
function Uo(e, t) {
  let n = nd() ? 64 : 1088;
  for (e[Te].changeDetectionScheduler?.notify(t); e; ) {
    e[I] |= n;
    let r = ct(e);
    if (bn(e) && !r) return e;
    e = r;
  }
  return null;
}
function Af(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function Pf(e, t) {
  let n = W + t;
  if (n < e.length) return e[n];
}
function nn(e, t, n, r = !0) {
  let o = t[y];
  if ((NE(o, t, e, n), r)) {
    let s = Os(n, e),
      a = t[A],
      c = a.parentNode(e[Se]);
    c !== null && sE(o, e[ee], a, t, c, s);
  }
  let i = t[ue];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function nc(e, t) {
  let n = Tn(e, t);
  return n !== void 0 && Ho(n[y], n), n;
}
function Tn(e, t) {
  if (e.length <= W) return;
  let n = W + t,
    r = e[n];
  if (r) {
    let o = r[st];
    o !== null && o !== e && ec(o, r), t > 0 && (e[n - 1][pe] = r[pe]);
    let i = Wr(e, W + t);
    iE(r[y], r);
    let s = i[xe];
    s !== null && s.detachView(i[y]),
      (r[U] = null),
      (r[pe] = null),
      (r[I] &= -129);
  }
  return r;
}
function NE(e, t, n, r) {
  let o = W + r,
    i = n.length;
  r > 0 && (n[o - 1][pe] = t),
    r < i - W ? ((t[pe] = n[o]), Su(n, W + r, t)) : (n.push(t), (t[pe] = null)),
    (t[U] = n);
  let s = t[st];
  s !== null && n !== s && Lf(s, t);
  let a = t[xe];
  a !== null && a.insertView(e), ds(t), (t[I] |= 128);
}
function Lf(e, t) {
  let n = e[jt],
    r = t[U];
  if (he(r)) e[I] |= 2;
  else {
    let o = r[U][Q];
    t[Q] !== o && (e[I] |= 2);
  }
  n === null ? (e[jt] = [t]) : n.push(t);
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
    return Gt(this._lView);
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[U];
      if (we(t)) {
        let n = t[Qr],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (Tn(t, r), Wr(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    Ho(this._lView[y], this._lView);
  }
  onDestroy(t) {
    ed(this._lView, t);
  }
  markForCheck() {
    Uo(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[I] &= -129;
  }
  reattach() {
    ds(this._lView), (this._lView[I] |= 128);
  }
  detectChanges() {
    (this._lView[I] |= 1024), Sf(this._lView, this.notifyErrorHandler);
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
    n !== null && !t && ec(n, this._lView), Df(this._lView[y], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new C(902, !1);
    this._appRef = t;
    let n = bn(this._lView),
      r = this._lView[st];
    r !== null && !n && Lf(r, this._lView), ds(this._lView);
  }
};
var co = (() => {
    class e {
      static __NG_ELEMENT_ID__ = RE;
    }
    return e;
  })(),
  SE = co,
  OE = class extends SE {
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
function RE() {
  return qo(z(), v());
}
function qo(e, t) {
  return e.type & 4 ? new OE(t, e, Jt(e, t)) : null;
}
function Vn(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = kE(e, t, n, r, o)), gm() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = dm();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return yt(i, !0), i;
}
function kE(e, t, n, r, o) {
  let i = td(),
    s = wa(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = PE(e, a, n, t, r, o));
  return AE(e, c, i, s), c;
}
function AE(e, t, n, r) {
  e.firstChild === null && (e.firstChild = t),
    n !== null &&
      (r
        ? n.child == null && t.parent !== null && (n.child = t)
        : n.next === null && ((n.next = t), (t.prev = n)));
}
function PE(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    Zt() && (a |= 128),
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
var LE = new RegExp(`^(\\d+)*(${Fd}|${Ld})*(.*)`);
function FE(e) {
  let t = e.match(LE),
    [n, r, o, i] = t,
    s = r ? parseInt(r, 10) : o,
    a = [];
  for (let [c, l, u] of i.matchAll(/(f|n)(\d*)/g)) {
    let d = parseInt(u, 10) || 1;
    a.push(l, d);
  }
  return [s, ...a];
}
function VE(e) {
  return !e.prev && e.parent?.type === 8;
}
function zi(e) {
  return e.index - P;
}
function jE(e, t) {
  let n = e.i18nNodes;
  if (n) return n.get(t);
}
function Wo(e, t, n, r) {
  let o = zi(r),
    i = jE(e, o);
  if (i === void 0) {
    let s = e.data[fy];
    if (s?.[o]) i = BE(s[o], n);
    else if (t.firstChild === r) i = e.firstChild;
    else {
      let a = r.prev === null,
        c = r.prev ?? r.parent;
      if (VE(r)) {
        let l = zi(r.parent);
        i = Ms(e, l);
      } else {
        let l = me(c, n);
        if (a) i = l.firstChild;
        else {
          let u = zi(c),
            d = Ms(e, u);
          if (c.type === 2 && d) {
            let f = Va(e, u) + 1;
            i = zo(f, d);
          } else i = l.nextSibling;
        }
      }
    }
  }
  return i;
}
function zo(e, t) {
  let n = t;
  for (let r = 0; r < e; r++) n = n.nextSibling;
  return n;
}
function HE(e, t) {
  let n = e;
  for (let r = 0; r < t.length; r += 2) {
    let o = t[r],
      i = t[r + 1];
    for (let s = 0; s < i; s++)
      switch (o) {
        case ay:
          n = n.firstChild;
          break;
        case cy:
          n = n.nextSibling;
          break;
      }
  }
  return n;
}
function BE(e, t) {
  let [n, ...r] = FE(e),
    o;
  if (n === Ld) o = t[Q][se];
  else if (n === Fd) o = Mv(t[Q][se]);
  else {
    let i = Number(n);
    o = ge(t[i + P]);
  }
  return HE(o, r);
}
var $E = !1;
function UE(e) {
  $E = e;
}
function qE(e) {
  let t = e[ue];
  if (t) {
    let { i18nNodes: n, dehydratedIcuData: r } = t;
    if (n && r) {
      let o = e[A];
      for (let i of r.values()) WE(o, n, i);
    }
    (t.i18nNodes = void 0), (t.dehydratedIcuData = void 0);
  }
}
function WE(e, t, n) {
  for (let r of n.node.cases[n.case]) {
    let o = t.get(r.index - P);
    o && qa(e, o, !1);
  }
}
function Ff(e) {
  let t = e[Ne] ?? [],
    r = e[U][A],
    o = [];
  for (let i of t) i.data[py] !== void 0 ? o.push(i) : Vf(i, r);
  e[Ne] = o;
}
function zE(e) {
  let { lContainer: t } = e,
    n = t[Ne];
  if (n === null) return;
  let o = t[U][A];
  for (let i of n) Vf(i, o);
}
function Vf(e, t) {
  let n = 0,
    r = e.firstChild;
  if (r) {
    let o = e.data[oo];
    for (; n < o; ) {
      let i = r.nextSibling;
      qa(t, r, !1), (r = i), n++;
    }
  }
}
function Go(e) {
  Ff(e);
  let t = e[se];
  he(t) && lo(t);
  for (let n = W; n < e.length; n++) lo(e[n]);
}
function lo(e) {
  qE(e);
  let t = e[y];
  for (let n = P; n < t.bindingStartIndex; n++)
    if (we(e[n])) {
      let r = e[n];
      Go(r);
    } else he(e[n]) && lo(e[n]);
}
function jf(e) {
  let t = e._views;
  for (let n of t) {
    let r = qy(n);
    r !== null && r[se] !== null && (he(r) ? lo(r) : Go(r));
  }
}
function GE(e, t, n, r) {
  e !== null && (n.cleanup(t), Go(e.lContainer), jf(r));
}
function QE(e, t) {
  let n = [];
  for (let r of t)
    for (let o = 0; o < (r[Vd] ?? 1); o++) {
      let i = { data: r, firstChild: null };
      r[oo] > 0 && ((i.firstChild = e), (e = zo(r[oo], e))), n.push(i);
    }
  return [e, n];
}
var Hf = () => null;
function ZE(e, t) {
  let n = e[Ne];
  return !t || n === null || n.length === 0
    ? null
    : n[0].data[dy] === t
      ? n.shift()
      : (Ff(e), null);
}
function YE() {
  Hf = ZE;
}
function Bt(e, t) {
  return Hf(e, t);
}
var KE = class {},
  Bf = class {},
  ks = class {
    resolveComponentFactory(t) {
      throw Error(`No component factory found for ${J(t)}.`);
    }
  },
  Qo = class {
    static NULL = new ks();
  },
  uo = class {},
  yS = (() => {
    class e {
      destroyNode = null;
      static __NG_ELEMENT_ID__ = () => JE();
    }
    return e;
  })();
function JE() {
  let e = v(),
    t = z(),
    n = De(t.index, e);
  return (he(n) ? n : e)[A];
}
var XE = (() => {
  class e {
    static ɵprov = q({ token: e, providedIn: "root", factory: () => null });
  }
  return e;
})();
var Gi = {},
  Lt = class {
    injector;
    parentInjector;
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = wo(r);
      let o = this.injector.get(t, Gi, r);
      return o !== Gi || n === Gi ? o : this.parentInjector.get(t, n, r);
    }
  };
function As(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = rs(o, a);
      else if (i == 2) {
        let c = a,
          l = t[++s];
        r = rs(r, c + ": " + l + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
function Zo(e, t = T.Default) {
  let n = v();
  if (n === null) return $e(e, t);
  let r = z();
  return Ed(r, n, G(e), t);
}
function vS() {
  let e = "invalid";
  throw new Error(e);
}
function rc(e, t, n, r, o) {
  let i = r === null ? null : { "": -1 },
    s = o(e, n);
  if (s !== null) {
    let a,
      c = null,
      l = null,
      u = tI(s);
    u === null ? (a = s) : ([a, c, l] = u), oI(e, t, n, a, i, c, l);
  }
  i !== null && r !== null && eI(n, r, i);
}
function eI(e, t, n) {
  let r = (e.localNames = []);
  for (let o = 0; o < t.length; o += 2) {
    let i = n[t[o + 1]];
    if (i == null) throw new C(-301, !1);
    r.push(t[o], i);
  }
}
function tI(e) {
  let t = null,
    n = !1;
  for (let s = 0; s < e.length; s++) {
    let a = e[s];
    if ((s === 0 && Ie(a) && (t = a), a.findHostDirectiveDefs !== null)) {
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
      ((r ??= []), (o ??= new Map()), (i ??= new Map()), nI(s, r, i, o)),
      s === t && ((r ??= []), r.push(s));
  return r !== null
    ? (r.push(...(t === null ? e : e.slice(1))), [r, o, i])
    : null;
}
function nI(e, t, n, r) {
  let o = t.length;
  e.findHostDirectiveDefs(e, t, r), n.set(e, [o, t.length - 1]);
}
function rI(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function oI(e, t, n, r, o, i, s) {
  let a = r.length,
    c = !1;
  for (let p = 0; p < a; p++) {
    let f = r[p];
    !c && Ie(f) && ((c = !0), rI(e, n, p)), gs(Xr(n, t), e, f.type);
  }
  uI(n, e.data.length, a);
  for (let p = 0; p < a; p++) {
    let f = r[p];
    f.providersResolver && f.providersResolver(f);
  }
  let l = !1,
    u = !1,
    d = mf(e, t, a, null);
  a > 0 && (n.directiveToIndex = new Map());
  for (let p = 0; p < a; p++) {
    let f = r[p];
    if (
      ((n.mergedAttrs = Ht(n.mergedAttrs, f.hostAttrs)),
      sI(e, n, t, d, f),
      lI(d, f, o),
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
  iI(e, n, i);
}
function iI(e, t, n) {
  for (let r = t.directiveStart; r < t.directiveEnd; r++) {
    let o = e.data[r];
    if (n === null || !n.has(o)) Ul(0, t, o, r), Ul(1, t, o, r), Wl(t, r, !1);
    else {
      let i = n.get(o);
      ql(0, t, i, r), ql(1, t, i, r), Wl(t, r, !0);
    }
  }
}
function Ul(e, t, n, r) {
  let o = e === 0 ? n.inputs : n.outputs;
  for (let i in o)
    if (o.hasOwnProperty(i)) {
      let s;
      e === 0 ? (s = t.inputs ??= {}) : (s = t.outputs ??= {}),
        (s[i] ??= []),
        s[i].push(r),
        $f(t, i);
    }
}
function ql(e, t, n, r) {
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
        $f(t, s);
    }
}
function $f(e, t) {
  t === "class" ? (e.flags |= 8) : t === "style" && (e.flags |= 16);
}
function Wl(e, t, n) {
  let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
  if (r === null || (!n && o === null) || (n && i === null) || $a(e)) {
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
function sI(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = ot(o.type, !0)),
    s = new ut(i, Ie(o), Zo);
  (e.blueprint[r] = s), (n[r] = s), aI(e, t, r, mf(e, n, o.hostVars, ae), o);
}
function aI(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    cI(s) != a && s.push(a), s.push(n, r, i);
  }
}
function cI(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function lI(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    Ie(t) && (n[""] = e);
  }
}
function uI(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function Uf(e, t, n, r, o, i, s, a) {
  let c = t.consts,
    l = qe(c, s),
    u = Vn(t, e, 2, r, l);
  return (
    i && rc(t, n, u, qe(c, a), o),
    (u.mergedAttrs = Ht(u.mergedAttrs, u.attrs)),
    u.attrs !== null && As(u, u.attrs, !1),
    u.mergedAttrs !== null && As(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
  );
}
function qf(e, t) {
  Na(e, t), ya(t) && e.queries.elementEnd(t);
}
var fo = class extends Qo {
  ngModule;
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = Ue(t);
    return new $t(n, this.ngModule);
  }
};
function dI(e) {
  return Object.keys(e).map((t) => {
    let [n, r, o] = e[t],
      i = {
        propName: n,
        templateName: t,
        isSignal: (r & Vo.SignalBased) !== 0,
      };
    return o && (i.transform = o), i;
  });
}
function fI(e) {
  return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
}
function pI(e, t, n) {
  let r = t instanceof Ce ? t : t?.injector;
  return (
    r &&
      e.getStandaloneInjector !== null &&
      (r = e.getStandaloneInjector(r) || r),
    r ? new Lt(n, r) : n
  );
}
function hI(e) {
  let t = e.get(uo, null);
  if (t === null) throw new C(407, !1);
  let n = e.get(XE, null),
    r = e.get(ft, null);
  return { rendererFactory: t, sanitizer: n, changeDetectionScheduler: r };
}
function gI(e, t) {
  let n = (e.selectors[0][0] || "div").toLowerCase();
  return Ua(t, n, n === "svg" ? Zu : n === "math" ? Xg : null);
}
var $t = class extends Bf {
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
        (this.cachedInputs ??= dI(this.componentDef.inputs)), this.cachedInputs
      );
    }
    get outputs() {
      return (
        (this.cachedOutputs ??= fI(this.componentDef.outputs)),
        this.cachedOutputs
      );
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = Pv(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors ?? []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, o) {
      O(22);
      let i = b(null);
      try {
        let s = this.componentDef,
          a = r ? ["ng-version", "19.2.6"] : Lv(this.componentDef.selectors[0]),
          c = Wa(0, null, null, 1, 0, null, null, null, null, [a], null),
          l = pI(s, o || this.ngModule, t),
          u = hI(l),
          d = u.rendererFactory.createRenderer(null, s),
          p = r ? Uv(d, r, s.encapsulation, l) : gI(s, d),
          f = za(
            null,
            c,
            null,
            512 | gf(s),
            null,
            null,
            u,
            d,
            l,
            null,
            Yd(p, l, !0)
          );
        (f[P] = p), _a(f);
        let h = null;
        try {
          let g = Uf(P, c, f, "#host", () => [this.componentDef], !0, 0);
          p && (hf(d, p, g), Xt(p, f)),
            jo(c, f, g),
            ja(c, g, f),
            qf(c, g),
            n !== void 0 && mI(g, this.ngContentSelectors, n),
            (h = De(g.index, f)),
            (f[$] = h[$]),
            Ja(c, f, null);
        } catch (g) {
          throw (h !== null && Ds(h), Ds(f), g);
        } finally {
          O(23), Ta();
        }
        return new Ps(this.componentType, f);
      } finally {
        b(i);
      }
    }
  },
  Ps = class extends KE {
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
        (this.instance = De(this._tNode.index, n)[$]),
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
        i = Ka(r, o[y], o, t, n);
      this.previousInputValues.set(t, n);
      let s = De(r.index, o);
      Uo(s, 1);
    }
    get injector() {
      return new nt(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function mI(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null && i.length ? Array.from(i) : null);
  }
}
var oc = (() => {
  class e {
    static __NG_ELEMENT_ID__ = yI;
  }
  return e;
})();
function yI() {
  let e = z();
  return zf(e, v());
}
var vI = oc,
  Wf = class extends vI {
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
      return new nt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let t = Sa(this._hostTNode, this._hostLView);
      if (pd(t)) {
        let n = Kr(t, this._hostLView),
          r = Yr(t),
          o = n[y].data[r + 8];
        return new nt(o, n);
      } else return new nt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(t) {
      let n = zl(this._lContainer);
      return (n !== null && n[t]) || null;
    }
    get length() {
      return this._lContainer.length - W;
    }
    createEmbeddedView(t, n, r) {
      let o, i;
      typeof r == "number"
        ? (o = r)
        : r != null && ((o = r.index), (i = r.injector));
      let s = Bt(this._lContainer, t.ssrId),
        a = t.createEmbeddedViewImpl(n || {}, i, s);
      return this.insertImpl(a, o, ht(this._hostTNode, s)), a;
    }
    createComponent(t, n, r, o, i) {
      let s = t && !Zg(t),
        a;
      if (s) a = n;
      else {
        let h = n || {};
        (a = h.index),
          (r = h.injector),
          (o = h.projectableNodes),
          (i = h.environmentInjector || h.ngModuleRef);
      }
      let c = s ? t : new $t(Ue(t)),
        l = r || this.parentInjector;
      if (!i && c.ngModule == null) {
        let g = (s ? l : this.parentInjector).get(Ce, null);
        g && (i = g);
      }
      let u = Ue(c.componentType ?? {}),
        d = Bt(this._lContainer, u?.id ?? null),
        p = d?.firstChild ?? null,
        f = c.create(l, o, p, i);
      return this.insertImpl(f.hostView, a, ht(this._hostTNode, d)), f;
    }
    insert(t, n) {
      return this.insertImpl(t, n, !0);
    }
    insertImpl(t, n, r) {
      let o = t._lView;
      if (tm(o)) {
        let a = this.indexOf(t);
        if (a !== -1) this.detach(a);
        else {
          let c = o[U],
            l = new Wf(c, c[ee], c[U]);
          l.detach(l.indexOf(t));
        }
      }
      let i = this._adjustIndex(n),
        s = this._lContainer;
      return nn(s, o, i, r), t.attachToViewContainerRef(), Su(Qi(s), i, t), t;
    }
    move(t, n) {
      return this.insert(t, n);
    }
    indexOf(t) {
      let n = zl(this._lContainer);
      return n !== null ? n.indexOf(t) : -1;
    }
    remove(t) {
      let n = this._adjustIndex(t, -1),
        r = Tn(this._lContainer, n);
      r && (Wr(Qi(this._lContainer), n), Ho(r[y], r));
    }
    detach(t) {
      let n = this._adjustIndex(t, -1),
        r = Tn(this._lContainer, n);
      return r && Wr(Qi(this._lContainer), n) != null ? new xn(r) : null;
    }
    _adjustIndex(t, n = 0) {
      return t ?? this.length + n;
    }
  };
function zl(e) {
  return e[Qr];
}
function Qi(e) {
  return e[Qr] || (e[Qr] = []);
}
function zf(e, t) {
  let n,
    r = t[e.index];
  return (
    we(r) ? (n = r) : ((n = Af(r, t, null, e)), (t[e.index] = n), Ga(t, n)),
    Gf(n, t, e, r),
    new Wf(n, e, t)
  );
}
function EI(e, t) {
  let n = e[A],
    r = n.createComment(""),
    o = me(t, e),
    i = n.parentNode(o);
  return so(n, i, r, n.nextSibling(o), !1), r;
}
var Gf = Qf,
  ic = () => !1;
function II(e, t, n) {
  return ic(e, t, n);
}
function Qf(e, t, n, r) {
  if (e[Se]) return;
  let o;
  n.type & 8 ? (o = ge(r)) : (o = EI(t, n)), (e[Se] = o);
}
function DI(e, t, n) {
  if (e[Se] && e[Ne]) return !0;
  let r = n[ue],
    o = t.index - P;
  if (!r || Xm(t) || Ln(r, o)) return !1;
  let s = Ms(r, o),
    a = r.data[Aa]?.[o],
    [c, l] = QE(s, a);
  return (e[Se] = c), (e[Ne] = l), !0;
}
function wI(e, t, n, r) {
  ic(e, n, t) || Qf(e, t, n, r);
}
function bI() {
  (Gf = wI), (ic = DI);
}
var Ls = class e {
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
  Fs = class e {
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
        sc(t, n).matches !== null && this.queries[n].setDirty();
    }
  },
  po = class {
    flags;
    read;
    predicate;
    constructor(t, n, r = null) {
      (this.flags = n),
        (this.read = r),
        typeof t == "string" ? (this.predicate = OI(t)) : (this.predicate = t);
    }
  },
  Vs = class e {
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
  js = class e {
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
          this.matchTNodeWithReadOption(t, n, MI(n, i)),
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
          if (o === No || o === oc || (o === co && n.type & 4))
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
function MI(e, t) {
  let n = e.localNames;
  if (n !== null) {
    for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
  }
  return null;
}
function CI(e, t) {
  return e.type & 11 ? Jt(e, t) : e.type & 4 ? qo(e, t) : null;
}
function _I(e, t, n, r) {
  return n === -1 ? CI(t, e) : n === -2 ? TI(e, t, r) : Mn(e, e[y], n, t);
}
function TI(e, t, n) {
  if (n === No) return Jt(t, e);
  if (n === co) return qo(t, e);
  if (n === oc) return zf(t, e);
}
function Zf(e, t, n, r) {
  let o = t[xe].queries[r];
  if (o.matches === null) {
    let i = e.data,
      s = n.matches,
      a = [];
    for (let c = 0; s !== null && c < s.length; c += 2) {
      let l = s[c];
      if (l < 0) a.push(null);
      else {
        let u = i[l];
        a.push(_I(t, u, s[c + 1], n.metadata.read));
      }
    }
    o.matches = a;
  }
  return o.matches;
}
function Hs(e, t, n, r) {
  let o = e.queries.getByIndex(n),
    i = o.matches;
  if (i !== null) {
    let s = Zf(e, t, o, n);
    for (let a = 0; a < i.length; a += 2) {
      let c = i[a];
      if (c > 0) r.push(s[a / 2]);
      else {
        let l = i[a + 1],
          u = t[-c];
        for (let d = W; d < u.length; d++) {
          let p = u[d];
          p[st] === p[U] && Hs(p[y], p, l, r);
        }
        if (u[jt] !== null) {
          let d = u[jt];
          for (let p = 0; p < d.length; p++) {
            let f = d[p];
            Hs(f[y], f, l, r);
          }
        }
      }
    }
  }
  return r;
}
function xI(e, t) {
  return e[xe].queries[t].queryList;
}
function Yf(e, t, n) {
  let r = new Is((n & 4) === 4);
  return (
    om(e, t, r, r.destroy), (t[xe] ??= new Fs()).queries.push(new Ls(r)) - 1
  );
}
function NI(e, t, n) {
  let r = F();
  return (
    r.firstCreatePass &&
      (Kf(r, new po(e, t, n), -1), (t & 2) === 2 && (r.staticViewQueries = !0)),
    Yf(r, v(), t)
  );
}
function SI(e, t, n, r) {
  let o = F();
  if (o.firstCreatePass) {
    let i = z();
    Kf(o, new po(t, n, r), i.index),
      RI(o, e),
      (n & 2) === 2 && (o.staticContentQueries = !0);
  }
  return Yf(o, v(), n);
}
function OI(e) {
  return e.split(",").map((t) => t.trim());
}
function Kf(e, t, n) {
  e.queries === null && (e.queries = new Vs()), e.queries.track(new js(t, n));
}
function RI(e, t) {
  let n = e.contentQueries || (e.contentQueries = []),
    r = n.length ? n[n.length - 1] : -1;
  t !== r && n.push(e.queries.length - 1, t);
}
function sc(e, t) {
  return e.queries.getByIndex(t);
}
function kI(e, t) {
  let n = e[y],
    r = sc(n, t);
  return r.crossesNgTemplate ? Hs(n, e, t, []) : Zf(n, e, r, t);
}
var Nn = class {},
  AI = class {};
var Bs = class extends Nn {
    ngModuleType;
    _parent;
    _bootstrapComponents = [];
    _r3Injector;
    instance;
    destroyCbs = [];
    componentFactoryResolver = new fo(this);
    constructor(t, n, r, o = !0) {
      super(), (this.ngModuleType = t), (this._parent = n);
      let i = ku(t);
      (this._bootstrapComponents = af(i.bootstrap)),
        (this._r3Injector = wd(
          t,
          n,
          [
            { provide: Nn, useValue: this },
            { provide: Qo, useValue: this.componentFactoryResolver },
            ...r,
          ],
          J(t),
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
  $s = class extends AI {
    moduleType;
    constructor(t) {
      super(), (this.moduleType = t);
    }
    create(t) {
      return new Bs(this.moduleType, t, []);
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
        { provide: Qo, useValue: this.componentFactoryResolver },
      ],
      t.parent || ma(),
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
function Jf(e, t, n = null) {
  return new ho({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
var PI = (() => {
  class e {
    _injector;
    cachedInjectors = new Map();
    constructor(n) {
      this._injector = n;
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = ha(!1, n.type),
          o =
            r.length > 0
              ? Jf([r], this._injector, `Standalone[${n.type.name}]`)
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
      factory: () => new e($e(Ce)),
    });
  }
  return e;
})();
function wS(e) {
  return On(() => {
    let t = Xf(e),
      n = ne(te({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Od.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: t.standalone
          ? (o) => o.get(PI).getOrCreateStandaloneInjector(n)
          : null,
        getExternalStyles: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || _n.Emulated,
        styles: e.styles || K,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    t.standalone && vt("NgStandalone"), ep(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = Gl(r, !1)), (n.pipeDefs = Gl(r, !0)), (n.id = HI(n)), n
    );
  });
}
function LI(e) {
  return Ue(e) || Au(e);
}
function FI(e) {
  return e !== null;
}
function bS(e) {
  return On(() => ({
    type: e.type,
    bootstrap: e.bootstrap || K,
    declarations: e.declarations || K,
    imports: e.imports || K,
    exports: e.exports || K,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function VI(e, t) {
  if (e == null) return it;
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
        : ((i = o), (s = o), (a = Vo.None), (c = null)),
        (n[i] = [r, a, c]),
        (t[i] = s);
    }
  return n;
}
function jI(e) {
  if (e == null) return it;
  let t = {};
  for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
  return t;
}
function MS(e) {
  return On(() => {
    let t = Xf(e);
    return ep(t), t;
  });
}
function CS(e) {
  return {
    type: e.type,
    name: e.name,
    factory: null,
    pure: e.pure !== !1,
    standalone: e.standalone ?? !0,
    onDestroy: e.type.prototype.ngOnDestroy || null,
  };
}
function Xf(e) {
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
    inputConfig: e.inputs || it,
    exportAs: e.exportAs || null,
    standalone: e.standalone ?? !0,
    signals: e.signals === !0,
    selectors: e.selectors || K,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: VI(e.inputs, t),
    outputs: jI(e.outputs),
    debugInfo: null,
  };
}
function ep(e) {
  e.features?.forEach((t) => t(e));
}
function Gl(e, t) {
  if (!e) return null;
  let n = t ? Pu : LI;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(FI);
}
function HI(e) {
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
function BI(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function $I(e) {
  let t = BI(e.type),
    n = !0,
    r = [e];
  for (; t; ) {
    let o;
    if (Ie(e)) o = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new C(903, !1);
      o = t.ɵdir;
    }
    if (o) {
      if (n) {
        r.push(o);
        let s = e;
        (s.inputs = Zi(e.inputs)),
          (s.declaredInputs = Zi(e.declaredInputs)),
          (s.outputs = Zi(e.outputs));
        let a = o.hostBindings;
        a && GI(e, a);
        let c = o.viewQuery,
          l = o.contentQueries;
        if (
          (c && WI(e, c),
          l && zI(e, l),
          UI(e, o),
          yg(e.outputs, o.outputs),
          Ie(o) && o.data.animation)
        ) {
          let u = e.data;
          u.animation = (u.animation || []).concat(o.data.animation);
        }
      }
      let i = o.features;
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s];
          a && a.ngInherit && a(e), a === $I && (n = !1);
        }
    }
    t = Object.getPrototypeOf(t);
  }
  qI(r);
}
function UI(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
    let r = t.inputs[n];
    r !== void 0 &&
      ((e.inputs[n] = r), (e.declaredInputs[n] = t.declaredInputs[n]));
  }
}
function qI(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    (o.hostVars = t += o.hostVars),
      (o.hostAttrs = Ht(o.hostAttrs, (n = Ht(n, o.hostAttrs))));
  }
}
function Zi(e) {
  return e === it ? {} : e === K ? [] : e;
}
function WI(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.viewQuery = t);
}
function zI(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i);
      })
    : (e.contentQueries = t);
}
function GI(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.hostBindings = t);
}
function tp(e) {
  return ac(e)
    ? Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e)
    : !1;
}
function QI(e, t) {
  if (Array.isArray(e)) for (let n = 0; n < e.length; n++) t(e[n]);
  else {
    let n = e[Symbol.iterator](),
      r;
    for (; !(r = n.next()).done; ) t(r.value);
  }
}
function ac(e) {
  return e !== null && (typeof e == "function" || typeof e == "object");
}
function Ae(e, t, n) {
  return (e[t] = n);
}
function Yo(e, t) {
  return e[t];
}
function X(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function Ut(e, t, n, r) {
  let o = X(e, t, n);
  return X(e, t + 1, r) || o;
}
function np(e, t, n, r, o) {
  let i = Ut(e, t, n, r);
  return X(e, t + 2, o) || i;
}
function Ko(e, t, n, r, o, i) {
  let s = Ut(e, t, n, r);
  return Ut(e, t + 2, o, i) || s;
}
function ZI(e, t, n, r, o, i, s, a, c) {
  let l = t.consts,
    u = Vn(t, e, 4, s || null, a || null);
  Da() && rc(t, n, u, qe(l, c), Za),
    (u.mergedAttrs = Ht(u.mergedAttrs, u.attrs)),
    Na(t, u);
  let d = (u.tView = Wa(
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
    d = t.firstCreatePass ? ZI(u, t, e, r, o, i, s, a, c) : t.data[u];
  yt(d, !1);
  let p = rp(t, e, d, n);
  To() && Bo(t, e, p, d), Xt(p, e);
  let f = Af(p, e, p, d);
  return (
    (e[u] = f),
    Ga(e, f),
    II(f, d, e),
    Co(d) && jo(t, e, d),
    c != null && Qa(e, d, l),
    d
  );
}
function YI(e, t, n, r, o, i, s, a) {
  let c = v(),
    l = F(),
    u = qe(l.consts, i);
  return go(c, l, e, t, n, r, o, u, s, a), YI;
}
var rp = op;
function op(e, t, n, r) {
  return We(!0), t[A].createComment("");
}
function KI(e, t, n, r) {
  let o = t[ue],
    i = !o || Zt() || Et(n) || Ln(o, r);
  if ((We(i), i)) return op(e, t);
  let s = o.data[uy]?.[r] ?? null;
  s !== null &&
    n.tView !== null &&
    n.tView.ssrId === null &&
    (n.tView.ssrId = s);
  let a = Wo(o, e, t, n);
  Po(o, r, a);
  let c = Va(o, r);
  return zo(c, a);
}
function JI() {
  rp = KI;
}
var XI = (() => {
  class e {
    cachedInjectors = new Map();
    getOrCreateInjector(n, r, o, i) {
      if (!this.cachedInjectors.has(n)) {
        let s = o.length > 0 ? Jf(o, r, i) : null;
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
var eD = new x("");
function Yi(e, t, n) {
  return e.get(XI).getOrCreateInjector(t, e, n, "");
}
function tD(e, t, n) {
  if (e instanceof Lt) {
    let o = e.injector,
      i = e.parentInjector,
      s = Yi(i, t, n);
    return new Lt(o, s);
  }
  let r = e.get(Ce);
  if (r !== e) {
    let o = Yi(r, t, n);
    return new Lt(e, o);
  }
  return Yi(e, t, n);
}
function Rt(e, t, n, r = !1) {
  let o = n[U],
    i = o[y];
  if (Gt(o)) return;
  let s = Pn(o, t),
    a = s[Ro],
    c = s[Ty];
  if (!(c !== null && e < c) && Ql(a, e) && Ql(s[My] ?? -1, e)) {
    let l = ko(i, t),
      d =
        !r &&
        !0 &&
        (Ry(l) !== null || Ol(l, B.Loading) !== null || Ol(l, B.Placeholder))
          ? oD
          : rD;
    try {
      d(e, s, n, t, o);
    } catch (p) {
      Ya(o, p);
    }
  }
}
function nD(e, t) {
  let n = e[Ne]?.findIndex((o) => o.data[hy] === t[Ro]) ?? -1;
  return { dehydratedView: n > -1 ? e[Ne][n] : null, dehydratedViewIx: n };
}
function rD(e, t, n, r, o) {
  O(20);
  let i = Oy(e, o, r);
  if (i !== null) {
    t[Ro] = e;
    let s = o[y],
      a = i + P,
      c = kn(s, a),
      l = 0;
    nc(n, l);
    let u;
    if (e === B.Complete) {
      let h = ko(s, r),
        g = h.providers;
      g && g.length > 0 && (u = tD(o[_e], h, g));
    }
    let { dehydratedView: d, dehydratedViewIx: p } = nD(n, t),
      f = tn(o, c, null, { injector: u, dehydratedView: d });
    if (
      (nn(n, f, l, ht(c, d)),
      Uo(f, 2),
      p > -1 && n[Ne]?.splice(p, 1),
      (e === B.Complete || e === B.Error) && Array.isArray(t[Pt]))
    ) {
      for (let h of t[Pt]) h();
      t[Pt] = null;
    }
  }
  O(21);
}
function Ql(e, t) {
  return e < t;
}
function Zl(e, t, n) {
  e.loadingPromise.then(() => {
    e.loadingState === oe.COMPLETE
      ? Rt(B.Complete, t, n)
      : e.loadingState === oe.FAILED && Rt(B.Error, t, n);
  });
}
var oD = null;
var _S = (() => {
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
var iD = new x("");
var ip = (() => {
    class e {
      static ɵprov = q({
        token: e,
        providedIn: "root",
        factory: () => new Us(),
      });
    }
    return e;
  })(),
  Us = class {
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
function sp(e) {
  return !!e && typeof e.then == "function";
}
function sD(e) {
  return !!e && typeof e.subscribe == "function";
}
var ap = new x("");
function TS(e) {
  return pa([{ provide: ap, multi: !0, useValue: e }]);
}
var cp = (() => {
    class e {
      resolve;
      reject;
      initialized = !1;
      done = !1;
      donePromise = new Promise((n, r) => {
        (this.resolve = n), (this.reject = r);
      });
      appInits = E(ap, { optional: !0 }) ?? [];
      injector = E(dt);
      constructor() {}
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = Hu(this.injector, o);
          if (sp(i)) n.push(i);
          else if (sD(i)) {
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
  cc = new x("");
function aD() {
  ci(() => {
    throw new C(600, !1);
  });
}
function cD(e) {
  return e.isBoundToModule;
}
var lD = 10;
var Oe = (() => {
  class e {
    _runningTick = !1;
    _destroyed = !1;
    _destroyListeners = [];
    _views = [];
    internalErrorHandler = E(qm);
    afterRenderManager = E(Ud);
    zonelessEnabled = E(Oa);
    rootEffectScheduler = E(ip);
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
    isStable = E(Kt).hasPendingTasks.pipe(Fe((n) => !n));
    constructor() {
      E(Oo, { optional: !0 });
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
    _injector = E(Ce);
    _rendererFactory = null;
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      return this.bootstrapImpl(n, r);
    }
    bootstrapImpl(n, r, o = dt.NULL) {
      O(10);
      let i = n instanceof Bf;
      if (!this._injector.get(cp).done) {
        let f = "";
        throw new C(405, f);
      }
      let a;
      i ? (a = n) : (a = this._injector.get(Qo).resolveComponentFactory(n)),
        this.componentTypes.push(a.componentType);
      let c = cD(a) ? void 0 : this._injector.get(Nn),
        l = r || a.selector,
        u = a.create(o, [], l, c),
        d = u.location.nativeElement,
        p = u.injector.get(iD, null);
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
          ? this.tracingSnapshot.run(Pa.CHANGE_DETECTION, this.tickImpl)
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
      for (; this.dirtyFlags !== 0 && n++ < lD; )
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
          uD(r, o, n, this.zonelessEnabled);
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
        this._injector.get(cc, []).forEach((o) => o(n));
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
function uD(e, t, n, r) {
  if (!n && !_o(e)) return;
  Sf(e, t, n && !r ? 0 : 1);
}
function dD(e, t, n) {
  let r = t[_e],
    o = t[y];
  if (e.loadingState !== oe.NOT_STARTED)
    return e.loadingPromise ?? Promise.resolve();
  let i = Pn(t, n),
    s = ky(o, e);
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
              R = Ue(g) || Au(g);
            if (R) p.push(R);
            else {
              let N = Pu(g);
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
            Ya(t, g);
          }
        } else {
          e.loadingState = oe.COMPLETE;
          let h = s.tView;
          if (p.length > 0) {
            h.directiveRegistry = Rl(h.directiveRegistry, p);
            let g = p.map((N) => N.type),
              R = ha(!1, ...g);
            e.providers = R;
          }
          f.length > 0 && (h.pipeRegistry = Rl(h.pipeRegistry, f));
        }
      })),
      e.loadingPromise)
    : ((e.loadingPromise = Promise.resolve().then(() => {
        (e.loadingPromise = null), (e.loadingState = oe.COMPLETE), c.remove(l);
      })),
      e.loadingPromise);
}
function fD(e, t) {
  return t[_e].get(eD, null, { optional: !0 })?.behavior !== Wd.Manual;
}
function pD(e, t, n) {
  let r = t[y],
    o = t[n.index];
  if (!fD(e, t)) return;
  let i = Pn(t, n),
    s = ko(r, n);
  switch ((Ny(i), s.loadingState)) {
    case oe.NOT_STARTED:
      Rt(B.Loading, n, o),
        dD(s, t, n),
        s.loadingState === oe.IN_PROGRESS && Zl(s, n, o);
      break;
    case oe.IN_PROGRESS:
      Rt(B.Loading, n, o), Zl(s, n, o);
      break;
    case oe.COMPLETE:
      Rt(B.Complete, n, o);
      break;
    case oe.FAILED:
      Rt(B.Error, n, o);
      break;
    default:
  }
}
function hD(e, t, n) {
  return on(this, null, function* () {
    let r = e.get(Fa);
    if (r.hydrating.has(t)) return;
    let { parentBlockPromise: i, hydrationQueue: s } = Yy(t, e);
    if (s.length === 0) return;
    i !== null && s.shift(), yD(r, s), i !== null && (yield i);
    let a = s[0];
    r.has(a)
      ? yield Yl(e, s, n)
      : r.awaitParentBlock(a, () =>
          on(this, null, function* () {
            return yield Yl(e, s, n);
          })
        );
  });
}
function Yl(e, t, n) {
  return on(this, null, function* () {
    let r = e.get(Fa),
      o = r.hydrating,
      i = e.get(Kt),
      s = i.add();
    for (let c = 0; c < t.length; c++) {
      let l = t[c],
        u = r.get(l);
      if (u != null) {
        if ((yield ED(u), yield vD(e), gD(u))) {
          zE(u), Kl(t.slice(c), r);
          break;
        }
        o.get(l).resolve();
      } else {
        mD(c, t, r), Kl(t.slice(c), r);
        break;
      }
    }
    let a = t[t.length - 1];
    yield o.get(a)?.promise,
      i.remove(s),
      n && n(t),
      GE(r.get(a), t, r, e.get(Oe));
  });
}
function gD(e) {
  return Pn(e.lView, e.tNode)[Ro] === B.Error;
}
function mD(e, t, n) {
  let r = e - 1,
    o = r > -1 ? n.get(t[r]) : null;
  o && Go(o.lContainer);
}
function Kl(e, t) {
  let n = t.hydrating;
  for (let r in e) n.get(r)?.reject();
  t.cleanup(e);
}
function yD(e, t) {
  for (let n of t) e.hydrating.set(n, Promise.withResolvers());
}
function vD(e) {
  return new Promise((t) => qd(t, { injector: e }));
}
function ED(e) {
  return on(this, null, function* () {
    let { tNode: t, lView: n } = e,
      r = Pn(n, t);
    return new Promise((o) => {
      ID(r, o), pD(2, n, t);
    });
  });
}
function ID(e, t) {
  Array.isArray(e[Pt]) || (e[Pt] = []), e[Pt].push(t);
}
function DD(e, t, n, r) {
  let o = v(),
    i = Yt();
  if (X(o, i, t)) {
    let s = F(),
      a = xa();
    Jv(a, o, e, t, n, r);
  }
  return DD;
}
function wD(e, t, n, r) {
  return X(e, Yt(), n) ? t + rt(n) + r : ae;
}
function bD(e, t, n, r, o, i) {
  let s = pm(),
    a = Ut(e, s, n, o);
  return Ma(2), a ? t + rt(n) + r + rt(o) + i : ae;
}
function Rr(e, t) {
  return (e << 17) | (t << 2);
}
function gt(e) {
  return (e >> 17) & 32767;
}
function MD(e) {
  return (e & 2) == 2;
}
function CD(e, t) {
  return (e & 131071) | (t << 17);
}
function qs(e) {
  return e | 2;
}
function qt(e) {
  return (e & 131068) >> 2;
}
function Ki(e, t) {
  return (e & -131069) | (t << 2);
}
function _D(e) {
  return (e & 1) === 1;
}
function Ws(e) {
  return e | 1;
}
function TD(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = gt(s),
    c = qt(s);
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
        p !== 0 && (e[p + 1] = Ki(e[p + 1], r)),
        (e[a + 1] = CD(e[a + 1], r));
    } else
      (e[r + 1] = Rr(a, 0)), a !== 0 && (e[a + 1] = Ki(e[a + 1], r)), (a = r);
  else
    (e[r + 1] = Rr(c, 0)),
      a === 0 ? (a = r) : (e[c + 1] = Ki(e[c + 1], r)),
      (c = r);
  l && (e[r + 1] = qs(e[r + 1])),
    Jl(e, u, r, !0),
    Jl(e, u, r, !1),
    xD(t, u, e, r, i),
    (s = Rr(a, c)),
    i ? (t.classBindings = s) : (t.styleBindings = s);
}
function xD(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == "string" &&
    Rn(i, t) >= 0 &&
    (n[r + 1] = Ws(n[r + 1]));
}
function Jl(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? gt(o) : qt(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let c = e[s],
      l = e[s + 1];
    ND(c, t) && ((a = !0), (e[s + 1] = r ? Ws(l) : qs(l))),
      (s = r ? gt(l) : qt(l));
  }
  a && (e[n + 1] = r ? qs(o) : Ws(o));
}
function ND(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == "string"
      ? Rn(e, t) >= 0
      : !1;
}
var H = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function lp(e) {
  return e.substring(H.key, H.keyEnd);
}
function SD(e) {
  return e.substring(H.value, H.valueEnd);
}
function OD(e) {
  return fp(e), up(e, Wt(e, 0, H.textEnd));
}
function up(e, t) {
  let n = H.textEnd;
  return n === t ? -1 : ((t = H.keyEnd = kD(e, (H.key = t), n)), Wt(e, t, n));
}
function RD(e) {
  return fp(e), dp(e, Wt(e, 0, H.textEnd));
}
function dp(e, t) {
  let n = H.textEnd,
    r = (H.key = Wt(e, t, n));
  return n === r
    ? -1
    : ((r = H.keyEnd = AD(e, r, n)),
      (r = Xl(e, r, n, 58)),
      (r = H.value = Wt(e, r, n)),
      (r = H.valueEnd = PD(e, r, n)),
      Xl(e, r, n, 59));
}
function fp(e) {
  (H.key = 0),
    (H.keyEnd = 0),
    (H.value = 0),
    (H.valueEnd = 0),
    (H.textEnd = e.length);
}
function Wt(e, t, n) {
  for (; t < n && e.charCodeAt(t) <= 32; ) t++;
  return t;
}
function kD(e, t, n) {
  for (; t < n && e.charCodeAt(t) > 32; ) t++;
  return t;
}
function AD(e, t, n) {
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
function Xl(e, t, n, r) {
  return (t = Wt(e, t, n)), t < n && t++, t;
}
function PD(e, t, n) {
  let r = -1,
    o = -1,
    i = -1,
    s = t,
    a = s;
  for (; s < n; ) {
    let c = e.charCodeAt(s++);
    if (c === 59) return a;
    c === 34 || c === 39
      ? (a = s = eu(e, c, s, n))
      : t === s - 4 && i === 85 && o === 82 && r === 76 && c === 40
        ? (a = s = eu(e, 41, s, n))
        : c > 32 && (a = s),
      (i = o),
      (o = r),
      (r = c & -33);
  }
  return a;
}
function eu(e, t, n, r) {
  let o = -1,
    i = n;
  for (; i < r; ) {
    let s = e.charCodeAt(i++);
    if (s == t && o !== 92) return i;
    s == 92 && o === 92 ? (o = 0) : (o = s);
  }
  throw new Error();
}
function LD(e, t, n) {
  let r = v(),
    o = Yt();
  if (X(r, o, t)) {
    let i = F(),
      s = xa();
    If(i, s, r, e, t, r[A], n, !1);
  }
  return LD;
}
function zs(e, t, n, r, o) {
  Ka(t, e, n, o ? "class" : "style", r);
}
function FD(e, t, n) {
  return pp(e, t, n, !1), FD;
}
function VD(e, t) {
  return pp(e, t, null, !0), VD;
}
function xS(e) {
  hp(yp, jD, e, !1);
}
function jD(e, t) {
  for (let n = RD(t); n >= 0; n = dp(t, n)) yp(e, lp(t), SD(t));
}
function NS(e) {
  hp(zD, HD, e, !0);
}
function HD(e, t) {
  for (let n = OD(t); n >= 0; n = up(t, n)) bo(e, lp(t), !0);
}
function pp(e, t, n, r) {
  let o = v(),
    i = F(),
    s = Ma(2);
  if ((i.firstUpdatePass && mp(i, e, s, r), t !== ae && X(o, s, t))) {
    let a = i.data[Re()];
    vp(i, a, o, o[A], e, (o[s + 1] = QD(t, n)), r, s);
  }
}
function hp(e, t, n, r) {
  let o = F(),
    i = Ma(2);
  o.firstUpdatePass && mp(o, null, i, r);
  let s = v();
  if (n !== ae && X(s, i, n)) {
    let a = o.data[Re()];
    if (Ep(a, r) && !gp(o, i)) {
      let c = r ? a.classesWithoutHost : a.stylesWithoutHost;
      c !== null && (n = rs(c, n || "")), zs(o, a, s, n, r);
    } else GD(o, a, s, s[A], s[i + 1], (s[i + 1] = WD(e, t, n)), r, i);
  }
}
function gp(e, t) {
  return t >= e.expandoStartIndex;
}
function mp(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[Re()],
      s = gp(e, n);
    Ep(i, r) && t === null && !s && (t = !1),
      (t = BD(o, i, t, r)),
      TD(o, i, t, n, s, r);
  }
}
function BD(e, t, n, r) {
  let o = vm(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = Ji(null, e, t, n, r)), (n = Sn(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = Ji(o, e, t, n, r)), i === null)) {
        let c = $D(e, t, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Ji(null, e, t, c[1], r)),
          (c = Sn(c, t.attrs, r)),
          UD(e, t, r, c));
      } else i = qD(e, t, r);
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n
  );
}
function $D(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (qt(r) !== 0) return e[gt(r)];
}
function UD(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[gt(o)] = r;
}
function qD(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = Sn(r, s, n);
  }
  return Sn(r, t.attrs, n);
}
function Ji(e, t, n, r, o) {
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
function WD(e, t, n) {
  if (n == null || n === "") return K;
  let r = [],
    o = en(n);
  if (Array.isArray(o)) for (let i = 0; i < o.length; i++) e(r, o[i], !0);
  else if (typeof o == "object")
    for (let i in o) o.hasOwnProperty(i) && e(r, i, o[i]);
  else typeof o == "string" && t(r, o);
  return r;
}
function yp(e, t, n) {
  bo(e, t, en(n));
}
function zD(e, t, n) {
  let r = String(t);
  r !== "" && !r.includes(" ") && bo(e, r, n);
}
function GD(e, t, n, r, o, i, s, a) {
  o === ae && (o = K);
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
      h !== null && vp(e, t, n, r, h, g, s, a),
      (u = c < o.length ? o[c] : null),
      (d = l < i.length ? i[l] : null);
  }
}
function vp(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let c = e.data,
    l = c[a + 1],
    u = _D(l) ? tu(c, t, n, o, qt(l), s) : void 0;
  if (!mo(u)) {
    mo(i) || (MD(l) && (i = tu(c, null, n, o, a, s)));
    let d = Yu(Re(), n);
    gE(r, s, d, o, i);
  }
}
function tu(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      p = n[o + 1];
    p === ae && (p = d ? K : void 0);
    let f = d ? Vi(p, r) : u === r ? p : void 0;
    if ((l && !mo(f) && (f = Vi(c, r)), mo(f) && ((a = f), s))) return a;
    let h = e[o + 1];
    o = s ? gt(h) : qt(h);
  }
  if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = Vi(c, r));
  }
  return a;
}
function mo(e) {
  return e !== void 0;
}
function QD(e, t) {
  return (
    e == null ||
      e === "" ||
      (typeof t == "string"
        ? (e = e + t)
        : typeof e == "object" && (e = J(en(e)))),
    e
  );
}
function Ep(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
var Gs = class {
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
function Xi(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function ZD(e, t, n) {
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
        d = Xi(i, l, i, u, n);
      if (d !== 0) {
        d < 0 && e.updateValue(i, u), i++;
        continue;
      }
      let p = e.at(s),
        f = t[c],
        h = Xi(s, p, c, f, n);
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
      if (((r ??= new yo()), (o ??= ru(e, i, s, n)), Qs(e, r, i, N)))
        e.updateValue(i, u), i++, s++;
      else if (o.has(N)) r.set(g, e.detach(i)), s--;
      else {
        let rn = e.create(i, t[i]);
        e.attach(i, rn), i++, s++;
      }
    }
    for (; i <= c; ) nu(e, r, n, i, t[i]), i++;
  } else if (t != null) {
    let c = t[Symbol.iterator](),
      l = c.next();
    for (; !l.done && i <= s; ) {
      let u = e.at(i),
        d = l.value,
        p = Xi(i, u, i, d, n);
      if (p !== 0) p < 0 && e.updateValue(i, d), i++, (l = c.next());
      else {
        (r ??= new yo()), (o ??= ru(e, i, s, n));
        let f = n(i, d);
        if (Qs(e, r, i, f)) e.updateValue(i, d), i++, s++, (l = c.next());
        else if (!o.has(f))
          e.attach(i, e.create(i, d)), i++, s++, (l = c.next());
        else {
          let h = n(i, u);
          r.set(h, e.detach(i)), s--;
        }
      }
    }
    for (; !l.done; ) nu(e, r, n, e.length, l.value), (l = c.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((c) => {
    e.destroy(c);
  });
}
function Qs(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function nu(e, t, n, r, o) {
  if (Qs(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function ru(e, t, n, r) {
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
function SS(e, t) {
  vt("NgControlFlow");
  let n = v(),
    r = Yt(),
    o = n[r] !== ae ? n[r] : -1,
    i = o !== -1 ? vo(n, P + o) : void 0,
    s = 0;
  if (X(n, r, e)) {
    let a = b(null);
    try {
      if ((i !== void 0 && nc(i, s), e !== -1)) {
        let c = P + e,
          l = vo(n, c),
          u = Js(n[y], c),
          d = Bt(l, u.tView.ssrId),
          p = tn(n, u, t, { dehydratedView: d });
        nn(l, p, s, ht(u, d));
      }
    } finally {
      b(a);
    }
  } else if (i !== void 0) {
    let a = Pf(i, s);
    a !== void 0 && (a[$] = t);
  }
}
var Zs = class {
  lContainer;
  $implicit;
  $index;
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - W;
  }
};
function OS(e) {
  return e;
}
function RS(e, t) {
  return t;
}
var Ys = class {
  hasEmptyBlock;
  trackByFn;
  liveCollection;
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function kS(e, t, n, r, o, i, s, a, c, l, u, d, p) {
  vt("NgControlFlow");
  let f = v(),
    h = F(),
    g = c !== void 0,
    R = v(),
    N = a ? s.bind(R[Q][$]) : s,
    rn = new Ys(g, N);
  (R[P + e] = rn),
    go(f, h, e + 1, t, n, r, o, qe(h.consts, i)),
    g && go(f, h, e + 2, c, l, u, d, qe(h.consts, p));
}
var Ks = class extends Gs {
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
    return this.lContainer.length - W;
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
      (this.needsIndexUpdate ||= t !== this.length - 1), YD(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = Bt(this.lContainer, this.templateTNode.tView.ssrId),
      o = tn(
        this.hostLView,
        this.templateTNode,
        new Zs(this.lContainer, n, t),
        { dehydratedView: r }
      );
    return this.operationsCounter?.recordCreate(), o;
  }
  destroy(t) {
    Ho(t[y], t), this.operationsCounter?.recordDestroy();
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
    return KD(this.lContainer, t);
  }
};
function AS(e) {
  let t = b(null),
    n = Re();
  try {
    let r = v(),
      o = r[y],
      i = r[n],
      s = n + 1,
      a = vo(r, s);
    if (i.liveCollection === void 0) {
      let l = Js(o, s);
      i.liveCollection = new Ks(a, r, l);
    } else i.liveCollection.reset();
    let c = i.liveCollection;
    if ((ZD(c, e, i.trackByFn), c.updateIndexes(), i.hasEmptyBlock)) {
      let l = Yt(),
        u = c.length === 0;
      if (X(r, l, u)) {
        let d = n + 2,
          p = vo(r, d);
        if (u) {
          let f = Js(o, d),
            h = Bt(p, f.tView.ssrId),
            g = tn(r, f, void 0, { dehydratedView: h });
          nn(p, g, 0, ht(f, h));
        } else nc(p, 0);
      }
    }
  } finally {
    b(t);
  }
}
function vo(e, t) {
  return e[t];
}
function YD(e, t) {
  return Tn(e, t);
}
function KD(e, t) {
  return Pf(e, t);
}
function Js(e, t) {
  return kn(e, t);
}
function Ip(e, t, n, r) {
  let o = v(),
    i = F(),
    s = P + e,
    a = o[A],
    c = i.firstCreatePass ? Uf(s, i, o, t, Za, Da(), n, r) : i.data[s],
    l = wp(i, o, c, a, t, e);
  o[s] = l;
  let u = Co(c);
  return (
    yt(c, !0),
    hf(a, l, c),
    !Et(c) && To() && Bo(i, o, l, c),
    (im() === 0 || u) && Xt(l, o),
    sm(),
    u && (jo(i, o, c), ja(i, c, o)),
    r !== null && Qa(o, c),
    Ip
  );
}
function Dp() {
  let e = z();
  wa() ? ba() : ((e = e.parent), yt(e, !1));
  let t = e;
  cm(t) && um(), am();
  let n = F();
  return (
    n.firstCreatePass && qf(n, t),
    t.classesWithoutHost != null &&
      bm(t) &&
      zs(n, t, v(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Mm(t) &&
      zs(n, t, v(), t.stylesWithoutHost, !1),
    Dp
  );
}
function JD(e, t, n, r) {
  return Ip(e, t, n, r), Dp(), JD;
}
var wp = (e, t, n, r, o, i) => (We(!0), Ua(r, o, ld()));
function XD(e, t, n, r, o, i) {
  let s = t[ue],
    a = !s || Zt() || Et(n) || Ln(s, i);
  if ((We(a), a)) return Ua(r, o, ld());
  let c = Wo(s, e, t, n);
  return (
    Kd(s, i) && Po(s, i, c.nextSibling),
    s && (Nd(n) || Sd(c)) && mt(n) && (lm(n), pf(c)),
    c
  );
}
function ew() {
  wp = XD;
}
function tw(e, t, n, r, o) {
  let i = t.consts,
    s = qe(i, r),
    a = Vn(t, e, 8, "ng-container", s);
  s !== null && As(a, s, !0);
  let c = qe(i, o);
  return (
    Da() && rc(t, n, a, c, Za),
    (a.mergedAttrs = Ht(a.mergedAttrs, a.attrs)),
    t.queries !== null && t.queries.elementStart(t, a),
    a
  );
}
function bp(e, t, n) {
  let r = v(),
    o = F(),
    i = e + P,
    s = o.firstCreatePass ? tw(i, o, r, t, n) : o.data[i];
  yt(s, !0);
  let a = Cp(o, r, s, e);
  return (
    (r[i] = a),
    To() && Bo(o, r, a, s),
    Xt(a, r),
    Co(s) && (jo(o, r, s), ja(o, s, r)),
    n != null && Qa(r, s),
    bp
  );
}
function Mp() {
  let e = z(),
    t = F();
  return (
    wa() ? ba() : ((e = e.parent), yt(e, !1)),
    t.firstCreatePass && (Na(t, e), ya(e) && t.queries.elementEnd(e)),
    Mp
  );
}
function nw(e, t, n) {
  return bp(e, t, n), Mp(), nw;
}
var Cp = (e, t, n, r) => (We(!0), df(t[A], ""));
function rw(e, t, n, r) {
  let o,
    i = t[ue],
    s = !i || Zt() || Ln(i, r) || Et(n);
  if ((We(s), s)) return df(t[A], "");
  let a = Wo(i, e, t, n),
    c = Qy(i, r);
  return Po(i, r, a), (o = zo(c, a)), o;
}
function ow() {
  Cp = rw;
}
function PS() {
  return v();
}
var et = void 0;
function iw(e) {
  let t = Math.floor(Math.abs(e)),
    n = e.toString().replace(/^[^.]*\.?/, "").length;
  return t === 1 && n === 0 ? 1 : 5;
}
var sw = [
    "en",
    [["a", "p"], ["AM", "PM"], et],
    [["AM", "PM"], et, et],
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
    et,
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
    et,
    [
      ["B", "A"],
      ["BC", "AD"],
      ["Before Christ", "Anno Domini"],
    ],
    0,
    [6, 0],
    ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
    ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
    ["{1}, {0}", et, "{1} 'at' {0}", et],
    [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"],
    ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"],
    "USD",
    "$",
    "US Dollar",
    {},
    "ltr",
    iw,
  ],
  es = {};
function LS(e) {
  let t = cw(e),
    n = ou(t);
  if (n) return n;
  let r = t.split("-")[0];
  if (((n = ou(r)), n)) return n;
  if (r === "en") return sw;
  throw new C(701, !1);
}
function ou(e) {
  return (
    e in es ||
      (es[e] =
        je.ng &&
        je.ng.common &&
        je.ng.common.locales &&
        je.ng.common.locales[e]),
    es[e]
  );
}
var aw = (function (e) {
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
})(aw || {});
function cw(e) {
  return e.toLowerCase().replace(/_/g, "-");
}
var Eo = "en-US",
  lw = "USD";
var uw = Eo;
function dw(e) {
  typeof e == "string" && (uw = e.toLowerCase().replace(/_/g, "-"));
}
function iu(e, t, n) {
  return function r(o) {
    if (o === Function) return n;
    let i = mt(e) ? De(e.index, t) : t;
    Uo(i, 5);
    let s = t[$],
      a = su(t, s, n, o),
      c = r.__ngNextListenerFn__;
    for (; c; ) (a = su(t, s, c, o) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function su(e, t, n, r) {
  let o = b(null);
  try {
    return O(6, t, n), n(r) !== !1;
  } catch (i) {
    return fw(e, i), !1;
  } finally {
    O(7, t, n), b(o);
  }
}
function fw(e, t) {
  let n = e[_e],
    r = n ? n.get(pt, null) : null;
  r && r.handleError(t);
}
function au(e, t, n, r, o, i) {
  let s = t[n],
    a = t[y],
    l = a.data[n].outputs[r],
    u = s[l],
    d = a.firstCreatePass ? Ia(a) : null,
    p = Ea(t),
    f = u.subscribe(i),
    h = p.length;
  p.push(i, f), d && d.push(o, e.index, h, -(h + 1));
}
var _p = (e, t, n) => {};
function cu(e) {
  _p = e;
}
function pw(e, t, n, r) {
  let o = v(),
    i = F(),
    s = z();
  return Tp(i, o, o[A], s, e, t, r), pw;
}
function hw(e, t, n, r) {
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
function Tp(e, t, n, r, o, i, s) {
  let a = Co(r),
    l = e.firstCreatePass ? Ia(e) : null,
    u = Ea(t),
    d = !0;
  if (r.type & 3 || s) {
    let p = me(r, t),
      f = s ? s(p) : p,
      h = u.length,
      g = s ? (N) => s(ge(N[r.index])) : r.index,
      R = null;
    if ((!s && a && (R = hw(e, t, o, r.index)), R !== null)) {
      let N = R.__ngLastListenerFn__ || R;
      (N.__ngNextListenerFn__ = i), (R.__ngLastListenerFn__ = i), (d = !1);
    } else {
      (i = iu(r, t, i)), _p(f, o, i);
      let N = n.listen(f, o, i);
      u.push(i, N), l && l.push(o, g, h, h + 1);
    }
  } else i = iu(r, t, i);
  if (d) {
    let p = r.outputs?.[o],
      f = r.hostDirectiveOutputs?.[o];
    if (f && f.length)
      for (let h = 0; h < f.length; h += 2) {
        let g = f[h],
          R = f[h + 1];
        au(r, t, g, R, o, i);
      }
    if (p && p.length) for (let h of p) au(r, t, h, o, o, i);
  }
}
function FS(e = 1) {
  return Im(e);
}
function gw(e, t) {
  let n = null,
    r = Sv(e);
  for (let o = 0; o < t.length; o++) {
    let i = t[o];
    if (i === "*") {
      n = o;
      continue;
    }
    if (r === null ? lf(e, i, !0) : kv(r, i)) return o;
  }
  return n;
}
function VS(e) {
  let t = v()[Q][ee];
  if (!t.projection) {
    let n = e ? e.length : 1,
      r = (t.projection = Lg(n, null)),
      o = r.slice(),
      i = t.child;
    for (; i !== null; ) {
      if (i.type !== 128) {
        let s = e ? gw(i, e) : 0;
        s !== null &&
          (o[s] ? (o[s].projectionNext = i) : (r[s] = i), (o[s] = i));
      }
      i = i.next;
    }
  }
}
function jS(e, t = 0, n, r, o, i) {
  let s = v(),
    a = F(),
    c = r ? e + 1 : null;
  c !== null && go(s, a, c, r, o, i, null, n);
  let l = Vn(a, P + e, 16, null, n || null);
  l.projection === null && (l.projection = t), ba();
  let d = !s[ue] || Zt();
  s[Q][ee].projection[l.projection] === null && c !== null
    ? mw(s, a, c)
    : d && !Et(l) && pE(a, s, l);
}
function mw(e, t, n) {
  let r = P + n,
    o = t.data[r],
    i = e[r],
    s = Bt(i, o.tView.ssrId),
    a = tn(e, o, void 0, { dehydratedView: s });
  nn(i, a, 0, ht(o, s));
}
function HS(e, t, n, r) {
  SI(e, t, n, r);
}
function BS(e, t, n) {
  NI(e, t, n);
}
function $S(e) {
  let t = v(),
    n = F(),
    r = rd();
  Ca(r + 1);
  let o = sc(n, r);
  if (e.dirty && em(t) === ((o.metadata.flags & 2) === 2)) {
    if (o.matches === null) e.reset([]);
    else {
      let i = kI(t, r);
      e.reset(i, Gm), e.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function US() {
  return xI(v(), rd());
}
function yw(e, t, n, r) {
  n >= e.data.length && ((e.data[n] = null), (e.blueprint[n] = null)),
    (t[n] = r);
}
function qS(e) {
  let t = fm();
  return Ku(t, P + e);
}
function WS(e, t = "") {
  let n = v(),
    r = F(),
    o = e + P,
    i = r.firstCreatePass ? Vn(r, o, 1, t, null) : r.data[o],
    s = xp(r, n, i, t, e);
  (n[o] = s), To() && Bo(r, n, s, i), yt(i, !1);
}
var xp = (e, t, n, r, o) => (We(!0), uf(t[A], r));
function vw(e, t, n, r, o) {
  let i = t[ue],
    s = !i || Zt() || Et(n) || Ln(i, o);
  return We(s), s ? uf(t[A], r) : Wo(i, e, t, n);
}
function Ew() {
  xp = vw;
}
function Iw(e) {
  return Np("", e, ""), Iw;
}
function Np(e, t, n) {
  let r = v(),
    o = wD(r, e, t, n);
  return o !== ae && Sp(r, Re(), o), Np;
}
function Dw(e, t, n, r, o) {
  let i = v(),
    s = bD(i, e, t, n, r, o);
  return s !== ae && Sp(i, Re(), s), Dw;
}
function Sp(e, t, n) {
  let r = Yu(t, e);
  Fv(e[A], r, n);
}
function ww(e, t, n) {
  xd(t) && (t = t());
  let r = v(),
    o = Yt();
  if (X(r, o, t)) {
    let i = F(),
      s = xa();
    If(i, s, r, e, t, r[A], n, !1);
  }
  return ww;
}
function zS(e, t) {
  let n = xd(e);
  return n && e.set(t), n;
}
function bw(e, t) {
  let n = v(),
    r = F(),
    o = z();
  return Tp(r, n, n[A], o, e, t), bw;
}
function Mw(e, t, n) {
  let r = F();
  if (r.firstCreatePass) {
    let o = Ie(e);
    Xs(n, r.data, r.blueprint, o, !0), Xs(t, r.data, r.blueprint, o, !1);
  }
}
function Xs(e, t, n, r, o) {
  if (((e = G(e)), Array.isArray(e)))
    for (let i = 0; i < e.length; i++) Xs(e[i], t, n, r, o);
  else {
    let i = F(),
      s = v(),
      a = z(),
      c = Vt(e) ? e : G(e.provide),
      l = ju(e),
      u = a.providerIndexes & 1048575,
      d = a.directiveStart,
      p = a.providerIndexes >> 20;
    if (Vt(e) || !e.multi) {
      let f = new ut(l, o, Zo),
        h = ns(c, t, o ? u : u + p, d);
      h === -1
        ? (gs(Xr(a, s), i, c),
          ts(i, e, t.length),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(f),
          s.push(f))
        : ((n[h] = f), (s[h] = f));
    } else {
      let f = ns(c, t, u + p, d),
        h = ns(c, t, u, u + p),
        g = f >= 0 && n[f],
        R = h >= 0 && n[h];
      if ((o && !R) || (!o && !g)) {
        gs(Xr(a, s), i, c);
        let N = Tw(o ? _w : Cw, n.length, o, r, l);
        !o && R && (n[h].providerFactory = N),
          ts(i, e, t.length, 0),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(N),
          s.push(N);
      } else {
        let N = Op(n[o ? h : f], l, !o && r);
        ts(i, e, f > -1 ? f : h, N);
      }
      !o && r && R && n[h].componentProviders++;
    }
  }
}
function ts(e, t, n, r) {
  let o = Vt(t),
    i = Ug(t);
  if (o || i) {
    let c = (i ? G(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
      let l = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let u = l.indexOf(n);
        u === -1 ? l.push(n, [r, c]) : l[u + 1].push(r, c);
      } else l.push(n, c);
    }
  }
}
function Op(e, t, n) {
  return n && e.componentProviders++, e.multi.push(t) - 1;
}
function ns(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function Cw(e, t, n, r) {
  return ea(this.multi, []);
}
function _w(e, t, n, r) {
  let o = this.multi,
    i;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Mn(n, n[y], this.providerFactory.index, r);
    (i = a.slice(0, s)), ea(o, i);
    for (let c = s; c < a.length; c++) i.push(a[c]);
  } else (i = []), ea(o, i);
  return i;
}
function ea(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function Tw(e, t, n, r, o) {
  let i = new ut(e, n, Zo);
  return (
    (i.multi = []),
    (i.index = t),
    (i.componentProviders = 0),
    Op(i, o, r && !n),
    i
  );
}
function GS(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => Mw(r, o ? o(e) : e, t);
  };
}
function QS(e, t, n) {
  let r = be() + e,
    o = v();
  return o[r] === ae ? Ae(o, r, n ? t.call(n) : t()) : Yo(o, r);
}
function ZS(e, t, n, r) {
  return xw(v(), be(), e, t, n, r);
}
function YS(e, t, n, r, o) {
  return Nw(v(), be(), e, t, n, r, o);
}
function KS(e, t, n, r, o, i) {
  return Sw(v(), be(), e, t, n, r, o, i);
}
function JS(e, t, n, r, o, i, s) {
  return Rp(v(), be(), e, t, n, r, o, i, s);
}
function XS(e, t, n, r, o, i, s, a) {
  let c = be() + e,
    l = v(),
    u = Ko(l, c, n, r, o, i);
  return X(l, c + 4, s) || u
    ? Ae(l, c + 5, a ? t.call(a, n, r, o, i, s) : t(n, r, o, i, s))
    : Yo(l, c + 5);
}
function eO(e, t, n, r, o, i, s, a, c) {
  let l = be() + e,
    u = v(),
    d = Ko(u, l, n, r, o, i);
  return Ut(u, l + 4, s, a) || d
    ? Ae(u, l + 6, c ? t.call(c, n, r, o, i, s, a) : t(n, r, o, i, s, a))
    : Yo(u, l + 6);
}
function tO(e, t, n, r, o, i, s, a, c, l) {
  let u = be() + e,
    d = v(),
    p = Ko(d, u, n, r, o, i);
  return np(d, u + 4, s, a, c) || p
    ? Ae(d, u + 7, l ? t.call(l, n, r, o, i, s, a, c) : t(n, r, o, i, s, a, c))
    : Yo(d, u + 7);
}
function nO(e, t, n, r) {
  return Ow(v(), be(), e, t, n, r);
}
function jn(e, t) {
  let n = e[t];
  return n === ae ? void 0 : n;
}
function xw(e, t, n, r, o, i) {
  let s = t + n;
  return X(e, s, o) ? Ae(e, s + 1, i ? r.call(i, o) : r(o)) : jn(e, s + 1);
}
function Nw(e, t, n, r, o, i, s) {
  let a = t + n;
  return Ut(e, a, o, i)
    ? Ae(e, a + 2, s ? r.call(s, o, i) : r(o, i))
    : jn(e, a + 2);
}
function Sw(e, t, n, r, o, i, s, a) {
  let c = t + n;
  return np(e, c, o, i, s)
    ? Ae(e, c + 3, a ? r.call(a, o, i, s) : r(o, i, s))
    : jn(e, c + 3);
}
function Rp(e, t, n, r, o, i, s, a, c) {
  let l = t + n;
  return Ko(e, l, o, i, s, a)
    ? Ae(e, l + 4, c ? r.call(c, o, i, s, a) : r(o, i, s, a))
    : jn(e, l + 4);
}
function Ow(e, t, n, r, o, i) {
  let s = t + n,
    a = !1;
  for (let c = 0; c < o.length; c++) X(e, s++, o[c]) && (a = !0);
  return a ? Ae(e, s, r.apply(i, o)) : jn(e, s);
}
function rO(e, t) {
  let n = F(),
    r,
    o = e + P;
  n.firstCreatePass
    ? ((r = Rw(t, n.pipeRegistry)),
      (n.data[o] = r),
      r.onDestroy && (n.destroyHooks ??= []).push(o, r.onDestroy))
    : (r = n.data[o]);
  let i = r.factory || (r.factory = ot(r.type, !0)),
    s,
    a = Y(Zo);
  try {
    let c = Jr(!1),
      l = i();
    return Jr(c), yw(n, v(), o, l), l;
  } finally {
    Y(a);
  }
}
function Rw(e, t) {
  if (t)
    for (let n = t.length - 1; n >= 0; n--) {
      let r = t[n];
      if (e === r.name) return r;
    }
}
function oO(e, t, n, r, o, i) {
  let s = e + P,
    a = v(),
    c = Ku(a, s);
  return kw(a, s)
    ? Rp(a, be(), t, c.transform, n, r, o, i, c)
    : c.transform(n, r, o, i);
}
function kw(e, t) {
  return e[y].data[t].pure;
}
function iO(e, t) {
  return qo(e, t);
}
var ta = class {
    ngModuleFactory;
    componentFactories;
    constructor(t, n) {
      (this.ngModuleFactory = t), (this.componentFactories = n);
    }
  },
  sO = (() => {
    class e {
      compileModuleSync(n) {
        return new $s(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let r = this.compileModuleSync(n),
          o = ku(n),
          i = af(o.declarations).reduce((s, a) => {
            let c = Ue(a);
            return c && s.push(new $t(c)), s;
          }, []);
        return new ta(r, i);
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
var Aw = (() => {
    class e {
      zone = E(ie);
      changeDetectionScheduler = E(ft);
      applicationRef = E(Oe);
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
  Pw = new x("", { factory: () => !1 });
function kp({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new ie(ne(te({}, Ap()), { scheduleInRootZone: n }))),
    [
      { provide: ie, useFactory: e },
      {
        provide: Ft,
        multi: !0,
        useFactory: () => {
          let r = E(Aw, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: Ft,
        multi: !0,
        useFactory: () => {
          let r = E(Lw);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: Md, useValue: !0 } : [],
      { provide: Cd, useValue: n ?? bd },
    ]
  );
}
function aO(e) {
  let t = e?.ignoreChangesOutsideZone,
    n = e?.scheduleInRootZone,
    r = kp({
      ngZoneFactory: () => {
        let o = Ap(e);
        return (
          (o.scheduleInRootZone = n),
          o.shouldCoalesceEventChangeDetection && vt("NgZone_CoalesceEvent"),
          new ie(o)
        );
      },
      ignoreChangesOutsideZone: t,
      scheduleInRootZone: n,
    });
  return pa([{ provide: Pw, useValue: !0 }, { provide: Oa, useValue: !1 }, r]);
}
function Ap(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var Lw = (() => {
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
var Fw = (() => {
  class e {
    appRef = E(Oe);
    taskService = E(Kt);
    ngZone = E(ie);
    zonelessEnabled = E(Oa);
    tracing = E(Oo, { optional: !0 });
    disableScheduling = E(Md, { optional: !0 }) ?? !1;
    zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
    schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }];
    subscriptions = new V();
    angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(to) : null;
    scheduleInRootZone =
      !this.zonelessEnabled &&
      this.zoneIsDefined &&
      (E(Cd, { optional: !0 }) ?? !1);
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
          (this.ngZone instanceof Es || !this.zoneIsDefined));
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
      let o = this.useMicrotaskScheduler ? bl : _d;
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
        bl(() => {
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
function Vw() {
  return (typeof $localize < "u" && $localize.locale) || Eo;
}
var Pp = new x("", {
    providedIn: "root",
    factory: () => E(Pp, T.Optional | T.SkipSelf) || Vw(),
  }),
  cO = new x("", { providedIn: "root", factory: () => lw });
var na = new x(""),
  jw = new x("");
function yn(e) {
  return !e.moduleRef;
}
function Hw(e) {
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
        s = e.platformInjector.get(na);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(na);
      s.add(i),
        e.moduleRef.onDestroy(() => {
          jr(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
    }
    return $w(r, n, () => {
      let i = t.get(cp);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get(Pp, Eo);
          if ((dw(s || Eo), !t.get(jw, !0)))
            return yn(e)
              ? t.get(Oe)
              : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
          if (yn(e)) {
            let c = t.get(Oe);
            return (
              e.rootComponent !== void 0 && c.bootstrap(e.rootComponent), c
            );
          } else return Bw(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function Bw(e, t) {
  let n = e.injector.get(Oe);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new C(-403, !1);
  t.push(e);
}
function $w(e, t, n) {
  try {
    let r = n();
    return sp(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
var Hr = null;
function Uw(e = [], t) {
  return dt.create({
    name: t,
    providers: [
      { provide: Vu, useValue: "platform" },
      { provide: na, useValue: new Set([() => (Hr = null)]) },
      ...e,
    ],
  });
}
function qw(e = []) {
  if (Hr) return Hr;
  let t = Uw(e);
  return (Hr = t), aD(), Ww(t), t;
}
function Ww(e) {
  let t = e.get(oy, null);
  Hu(e, () => {
    t?.forEach((n) => n());
  });
}
var lO = (() => {
  class e {
    static __NG_ELEMENT_ID__ = zw;
  }
  return e;
})();
function zw(e) {
  return Gw(z(), v(), (e & 16) === 16);
}
function Gw(e, t, n) {
  if (mt(e) && !n) {
    let r = De(e.index, t);
    return new xn(r, r);
  } else if (e.type & 175) {
    let r = t[Q];
    return new xn(r, t);
  }
  return null;
}
var ra = class {
    constructor() {}
    supports(t) {
      return tp(t);
    }
    create(t) {
      return new oa(t);
    }
  },
  Qw = (e, t) => t,
  oa = class {
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
      this._trackByFn = t || Qw;
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
        let s = !r || (n && n.currentIndex < lu(r, o, i)) ? n : r,
          a = lu(s, o, i),
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
      if ((t == null && (t = []), !tp(t))) throw new C(900, !1);
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
          QI(t, (a) => {
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
              : (t = this._addAfter(new ia(n, r), i, o))),
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
  ia = class {
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
  sa = class {
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
      r || ((r = new sa()), this.map.set(n, r)), r.add(t);
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
function lu(e, t, n) {
  let r = e.previousIndex;
  if (r === null) return r;
  let o = 0;
  return n && r < n.length && (o = n[r]), r + t + o;
}
var aa = class {
    constructor() {}
    supports(t) {
      return t instanceof Map || ac(t);
    }
    create() {
      return new ca();
    }
  },
  ca = class {
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
      else if (!(t instanceof Map || ac(t))) throw new C(900, !1);
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
      let r = new la(t);
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
  la = class {
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
function uu() {
  return new Zw([new ra()]);
}
var Zw = (() => {
  class e {
    factories;
    static ɵprov = q({ token: e, providedIn: "root", factory: uu });
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
        useFactory: (r) => e.create(n, r || uu()),
        deps: [[e, new Nu(), new xu()]],
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
function du() {
  return new Yw([new aa()]);
}
var Yw = (() => {
  class e {
    static ɵprov = q({ token: e, providedIn: "root", factory: du });
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
        useFactory: (r) => e.create(n, r || du()),
        deps: [[e, new Nu(), new xu()]],
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
function uO(e) {
  O(8);
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = qw(r),
      i = [kp({}), { provide: ft, useExisting: Fw }, ...(n || [])],
      s = new ho({
        providers: i,
        parent: o,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return Hw({
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
  fu = "",
  Br = [];
function pu(e) {
  return e.get($d, my);
}
function dO() {
  let e = [
    {
      provide: $d,
      useFactory: () => {
        let t = !0;
        {
          let n = E(ro);
          t = !!window._ejsas?.[n];
        }
        return t && vt("NgEventReplay"), t;
      },
    },
  ];
  return (
    e.push(
      {
        provide: Ft,
        useValue: () => {
          let t = E(Oe),
            { injector: n } = t;
          if (!kr.has(t)) {
            let r = E(xl);
            pu(n) &&
              cu((o, i, s) => {
                o.nodeType === Node.ELEMENT_NODE && (Ay(o, i, s), Py(o, r));
              });
          }
        },
        multi: !0,
      },
      {
        provide: cc,
        useFactory: () => {
          let t = E(ro),
            n = E(Oe),
            { injector: r } = n;
          return () => {
            !pu(r) ||
              kr.has(n) ||
              (kr.add(n),
              n.onDestroy(() => {
                kr.delete(n), Fi(t), cu(() => {});
              }),
              n.whenStable().then(() => {
                if (n.destroyed) return;
                let o = r.get(Fy);
                Kw(o, r);
                let i = r.get(xl);
                i.get(fu)?.forEach(Ly), i.delete(fu);
                let s = o.instance;
                Gy(r) ? n.onDestroy(() => s.cleanUp()) : s.cleanUp();
              }));
          };
        },
        multi: !0,
      }
    ),
    e
  );
}
var Kw = (e, t) => {
  let n = t.get(ro),
    r = window._ejsas[n],
    o = (e.instance = new cl(new Cr(r.c)));
  for (let a of r.et) o.addEvent(a);
  for (let a of r.etc) o.addEvent(a);
  let i = ll(n);
  o.replayEarlyEventInfos(i), Fi(n);
  let s = new _r((a) => {
    Jw(t, a, a.currentTarget);
  });
  al(o, s);
};
function Jw(e, t, n) {
  let r = (n && n.getAttribute(Ao)) ?? "";
  /d\d+/.test(r) ? Xw(r, e, t, n) : t.eventPhase === Li.REPLAY && Gd(t, n);
}
function Xw(e, t, n, r) {
  Br.push({ event: n, currentTarget: r }), hD(t, e, eb);
}
function eb(e) {
  let t = [...Br],
    n = new Set(e);
  Br = [];
  for (let { event: r, currentTarget: o } of t) {
    let i = o.getAttribute(Ao);
    n.has(i) ? Gd(r, o) : Br.push({ event: r, currentTarget: o });
  }
}
var hu = !1;
function tb() {
  hu || ((hu = !0), Uy(), ew(), Ew(), ow(), JI(), bI(), YE(), zv());
}
function nb(e) {
  return e.whenStable();
}
function fO() {
  let e = [
    {
      provide: xr,
      useFactory: () => {
        let t = !0;
        return (
          (t = !!E(So, { optional: !0 })?.get(Qd, null)),
          t && vt("NgHydration"),
          t
        );
      },
    },
    {
      provide: Ft,
      useValue: () => {
        UE(!1), E(xr) && (Ky(An()), tb());
      },
      multi: !0,
    },
  ];
  return (
    e.push(
      { provide: Bd, useFactory: () => E(xr) },
      {
        provide: cc,
        useFactory: () => {
          if (E(xr)) {
            let t = E(Oe);
            return () => {
              nb(t).then(() => {
                t.destroyed || jf(t);
              });
            };
          }
          return () => {};
        },
        multi: !0,
      }
    ),
    pa(e)
  );
}
function pO(e) {
  return typeof e == "boolean" ? e : e != null && e !== "false";
}
function hO(e, t = NaN) {
  return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t;
}
function gO(e) {
  return di(e);
}
function mO(e, t) {
  return ai(e, t?.equal);
}
var ua = class {
  [ce];
  constructor(t) {
    this[ce] = t;
  }
  destroy() {
    this[ce].destroy();
  }
};
function rb(e, t) {
  !t?.injector && $u(rb);
  let n = t?.injector ?? E(dt),
    r = t?.manualCleanup !== !0 ? n.get(xo) : null,
    o,
    i = n.get(La, null, { optional: !0 }),
    s = n.get(ft);
  return (
    i !== null && !t?.forceRoot
      ? ((o = sb(i.view, s, e)),
        r instanceof eo && r._lView === i.view && (r = null))
      : (o = ab(e, n.get(ip), s)),
    (o.injector = n),
    r !== null && (o.onDestroyFn = r.onDestroy(() => o.destroy())),
    new ua(o)
  );
}
var Lp = ne(te({}, It), {
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
  ob = ne(te({}, Lp), {
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
  ib = ne(te({}, Lp), {
    consumerMarkedDirty() {
      (this.view[I] |= 8192), Qt(this.view), this.notifier.notify(13);
    },
    destroy() {
      ln(this),
        this.onDestroyFn(),
        this.maybeCleanup(),
        this.view[at]?.delete(this);
    },
  });
function sb(e, t, n) {
  let r = Object.create(ib);
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
function ab(e, t, n) {
  let r = Object.create(ob);
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
function yO(e) {
  let t = Ue(e);
  if (!t) return null;
  let n = new $t(t);
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
  IO = "*";
function DO(e, t) {
  return { type: ye.Trigger, name: e, definitions: t, options: {} };
}
function wO(e, t = null) {
  return { type: ye.Animate, styles: t, timings: e };
}
function bO(e, t = null) {
  return { type: ye.Sequence, steps: e, options: t };
}
function MO(e) {
  return { type: ye.Style, styles: e, offset: null };
}
function CO(e, t, n) {
  return { type: ye.State, name: e, styles: t, options: n };
}
function _O(e, t, n = null) {
  return { type: ye.Transition, expr: e, animation: t, options: n };
}
function TO(e, t = null) {
  return { type: ye.Reference, animation: e, options: t };
}
function xO(e = null) {
  return { type: ye.AnimateChild, options: e };
}
function NO(e, t = null) {
  return { type: ye.AnimateRef, animation: e, options: t };
}
function SO(e, t, n = null) {
  return { type: ye.Query, selector: e, animation: t, options: n };
}
var Fp = class {
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
  Vp = class {
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
  OO = "!";
export {
  te as a,
  ne as b,
  cb as c,
  V as d,
  Xp as e,
  S as f,
  Di as g,
  wi as h,
  ve as i,
  fn as j,
  bi as k,
  gn as l,
  Le as m,
  lh as n,
  uh as o,
  dh as p,
  Ke as q,
  Fe as r,
  Eh as s,
  Je as t,
  Ci as u,
  Ir as v,
  Dh as w,
  wh as x,
  bh as y,
  Tt as z,
  Uc as A,
  Mh as B,
  Ch as C,
  mn as D,
  _i as E,
  Th as F,
  xh as G,
  Ti as H,
  Nh as I,
  Sh as J,
  Oh as K,
  Rh as L,
  kh as M,
  Wc as N,
  C as O,
  Eu as P,
  q as Q,
  ZN as R,
  YN as S,
  x as T,
  T as U,
  $e as V,
  E as W,
  pa as X,
  Vu as Y,
  Ce as Z,
  Hu as _,
  $u as $,
  KN as aa,
  JN as ba,
  XN as ca,
  eS as da,
  tS as ea,
  nS as fa,
  dt as ga,
  xo as ha,
  ft as ia,
  Kt as ja,
  He as ka,
  ie as la,
  pt as ma,
  rS as na,
  No as oa,
  oS as pa,
  iS as qa,
  ro as ra,
  oy as sa,
  sS as ta,
  aS as ua,
  cS as va,
  So as wa,
  Oo as xa,
  vt as ya,
  qd as za,
  _n as Aa,
  lS as Ba,
  yv as Ca,
  uS as Da,
  dS as Ea,
  Ss as Fa,
  co as Ga,
  uo as Ha,
  yS as Ia,
  Zo as Ja,
  vS as Ka,
  oc as La,
  AI as Ma,
  Jf as Na,
  wS as Oa,
  bS as Pa,
  MS as Qa,
  CS as Ra,
  $I as Sa,
  YI as Ta,
  _S as Ua,
  sp as Va,
  TS as Wa,
  cc as Xa,
  Oe as Ya,
  DD as Za,
  LD as _a,
  FD as $a,
  VD as ab,
  xS as bb,
  NS as cb,
  SS as db,
  OS as eb,
  RS as fb,
  kS as gb,
  AS as hb,
  Ip as ib,
  Dp as jb,
  JD as kb,
  bp as lb,
  Mp as mb,
  nw as nb,
  PS as ob,
  LS as pb,
  aw as qb,
  pw as rb,
  FS as sb,
  VS as tb,
  jS as ub,
  HS as vb,
  BS as wb,
  $S as xb,
  US as yb,
  qS as zb,
  WS as Ab,
  Iw as Bb,
  Np as Cb,
  Dw as Db,
  ww as Eb,
  zS as Fb,
  bw as Gb,
  GS as Hb,
  QS as Ib,
  ZS as Jb,
  YS as Kb,
  KS as Lb,
  JS as Mb,
  XS as Nb,
  eO as Ob,
  tO as Pb,
  nO as Qb,
  rO as Rb,
  oO as Sb,
  iO as Tb,
  sO as Ub,
  aO as Vb,
  Pp as Wb,
  cO as Xb,
  lO as Yb,
  Zw as Zb,
  Yw as _b,
  uO as $b,
  dO as ac,
  fO as bc,
  pO as cc,
  hO as dc,
  gO as ec,
  mO as fc,
  rb as gc,
  yO as hc,
  ye as ic,
  IO as jc,
  DO as kc,
  wO as lc,
  bO as mc,
  MO as nc,
  CO as oc,
  _O as pc,
  TO as qc,
  xO as rc,
  NO as sc,
  SO as tc,
  Fp as uc,
  Vp as vc,
  OO as wc,
};
