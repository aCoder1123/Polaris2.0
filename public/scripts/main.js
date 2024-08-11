/*! For license information please see main.js.LICENSE.txt */
(() => {
	"use strict";
	var e = {
			199: (e, t, n) => {
				Object.defineProperty(t, "__esModule", { value: !0 });
				var r,
					i,
					o = n(319),
					s = n(635),
					a = n(844),
					c = n(336),
					u = n(148),
					l = (function () {
						function e(e) {
							this.container = e;
						}
						return (
							(e.prototype.getPlatformInfoString = function () {
								return this.container
									.getProviders()
									.map(function (e) {
										if (
											(function (e) {
												var t = e.getComponent();
												return "VERSION" === (null == t ? void 0 : t.type);
											})(e)
										) {
											var t = e.getImmediate();
											return "".concat(t.library, "/").concat(t.version);
										}
										return null;
									})
									.filter(function (e) {
										return e;
									})
									.join(" ");
							}),
							e
						);
					})(),
					d = "@firebase/app",
					h = "0.10.6",
					p = new a.Logger("@firebase/app"),
					f = "[DEFAULT]",
					m =
						(((r = {})[d] = "fire-core"),
						(r["@firebase/app-compat"] = "fire-core-compat"),
						(r["@firebase/analytics"] = "fire-analytics"),
						(r["@firebase/analytics-compat"] = "fire-analytics-compat"),
						(r["@firebase/app-check"] = "fire-app-check"),
						(r["@firebase/app-check-compat"] = "fire-app-check-compat"),
						(r["@firebase/auth"] = "fire-auth"),
						(r["@firebase/auth-compat"] = "fire-auth-compat"),
						(r["@firebase/database"] = "fire-rtdb"),
						(r["@firebase/database-compat"] = "fire-rtdb-compat"),
						(r["@firebase/functions"] = "fire-fn"),
						(r["@firebase/functions-compat"] = "fire-fn-compat"),
						(r["@firebase/installations"] = "fire-iid"),
						(r["@firebase/installations-compat"] = "fire-iid-compat"),
						(r["@firebase/messaging"] = "fire-fcm"),
						(r["@firebase/messaging-compat"] = "fire-fcm-compat"),
						(r["@firebase/performance"] = "fire-perf"),
						(r["@firebase/performance-compat"] = "fire-perf-compat"),
						(r["@firebase/remote-config"] = "fire-rc"),
						(r["@firebase/remote-config-compat"] = "fire-rc-compat"),
						(r["@firebase/storage"] = "fire-gcs"),
						(r["@firebase/storage-compat"] = "fire-gcs-compat"),
						(r["@firebase/firestore"] = "fire-fst"),
						(r["@firebase/firestore-compat"] = "fire-fst-compat"),
						(r["@firebase/vertexai-preview"] = "fire-vertex"),
						(r["fire-js"] = "fire-js"),
						(r.firebase = "fire-js-all"),
						r),
					g = new Map(),
					v = new Map(),
					_ = new Map();
				function y(e, t) {
					try {
						e.container.addComponent(t);
					} catch (n) {
						p.debug("Component ".concat(t.name, " failed to register with FirebaseApp ").concat(e.name), n);
					}
				}
				function I(e) {
					var t,
						n,
						r,
						i,
						o = e.name;
					if (_.has(o)) return p.debug("There were multiple attempts to register component ".concat(o, ".")), !1;
					_.set(o, e);
					try {
						for (var a = s.__values(g.values()), c = a.next(); !c.done; c = a.next()) y(c.value, e);
					} catch (e) {
						t = { error: e };
					} finally {
						try {
							c && !c.done && (n = a.return) && n.call(a);
						} finally {
							if (t) throw t.error;
						}
					}
					try {
						for (var u = s.__values(v.values()), l = u.next(); !l.done; l = u.next()) y(l.value, e);
					} catch (e) {
						r = { error: e };
					} finally {
						try {
							l && !l.done && (i = u.return) && i.call(u);
						} finally {
							if (r) throw r.error;
						}
					}
					return !0;
				}
				function w(e, t) {
					var n = e.container.getProvider("heartbeat").getImmediate({ optional: !0 });
					return n && n.triggerHeartbeat(), e.container.getProvider(t);
				}
				function b(e) {
					return void 0 !== e.options;
				}
				var E =
						(((i = {})["no-app"] = "No Firebase App '{$appName}' has been created - call initializeApp() first"),
						(i["bad-app-name"] = "Illegal App name: '{$appName}'"),
						(i["duplicate-app"] = "Firebase App named '{$appName}' already exists with different options or config"),
						(i["app-deleted"] = "Firebase App named '{$appName}' already deleted"),
						(i["server-app-deleted"] = "Firebase Server App has been deleted"),
						(i["no-options"] = "Need to provide options, when not being deployed to hosting via source."),
						(i["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance."),
						(i["invalid-log-argument"] = "First argument to `onLog` must be null or a function."),
						(i["idb-open"] = "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}."),
						(i["idb-get"] = "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}."),
						(i["idb-set"] = "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}."),
						(i["idb-delete"] = "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."),
						(i["finalization-registry-not-supported"] = "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry."),
						(i["invalid-server-app-environment"] = "FirebaseServerApp is not for use in browser environments."),
						i),
					T = new c.ErrorFactory("app", "Firebase", E),
					A = (function () {
						function e(e, t, n) {
							var r = this;
							(this._isDeleted = !1),
								(this._options = s.__assign({}, e)),
								(this._config = s.__assign({}, t)),
								(this._name = t.name),
								(this._automaticDataCollectionEnabled = t.automaticDataCollectionEnabled),
								(this._container = n),
								this.container.addComponent(
									new o.Component(
										"app",
										function () {
											return r;
										},
										"PUBLIC"
									)
								);
						}
						return (
							Object.defineProperty(e.prototype, "automaticDataCollectionEnabled", {
								get: function () {
									return this.checkDestroyed(), this._automaticDataCollectionEnabled;
								},
								set: function (e) {
									this.checkDestroyed(), (this._automaticDataCollectionEnabled = e);
								},
								enumerable: !1,
								configurable: !0,
							}),
							Object.defineProperty(e.prototype, "name", {
								get: function () {
									return this.checkDestroyed(), this._name;
								},
								enumerable: !1,
								configurable: !0,
							}),
							Object.defineProperty(e.prototype, "options", {
								get: function () {
									return this.checkDestroyed(), this._options;
								},
								enumerable: !1,
								configurable: !0,
							}),
							Object.defineProperty(e.prototype, "config", {
								get: function () {
									return this.checkDestroyed(), this._config;
								},
								enumerable: !1,
								configurable: !0,
							}),
							Object.defineProperty(e.prototype, "container", {
								get: function () {
									return this._container;
								},
								enumerable: !1,
								configurable: !0,
							}),
							Object.defineProperty(e.prototype, "isDeleted", {
								get: function () {
									return this._isDeleted;
								},
								set: function (e) {
									this._isDeleted = e;
								},
								enumerable: !1,
								configurable: !0,
							}),
							(e.prototype.checkDestroyed = function () {
								if (this.isDeleted) throw T.create("app-deleted", { appName: this._name });
							}),
							e
						);
					})(),
					S = (function (e) {
						function t(t, n, r, i) {
							var o = this,
								a = void 0 !== n.automaticDataCollectionEnabled && n.automaticDataCollectionEnabled,
								c = { name: r, automaticDataCollectionEnabled: a };
							if (void 0 !== t.apiKey) o = e.call(this, t, c, i) || this;
							else {
								var u = t;
								o = e.call(this, u.options, c, i) || this;
							}
							return (
								(o._serverConfig = s.__assign({ automaticDataCollectionEnabled: a }, n)),
								(o._finalizationRegistry = null),
								"undefined" != typeof FinalizationRegistry &&
									(o._finalizationRegistry = new FinalizationRegistry(function () {
										o.automaticCleanup();
									})),
								(o._refCount = 0),
								o.incRefCount(o._serverConfig.releaseOnDeref),
								(o._serverConfig.releaseOnDeref = void 0),
								(n.releaseOnDeref = void 0),
								k(d, h, "serverapp"),
								o
							);
						}
						return (
							s.__extends(t, e),
							(t.prototype.toJSON = function () {}),
							Object.defineProperty(t.prototype, "refCount", {
								get: function () {
									return this._refCount;
								},
								enumerable: !1,
								configurable: !0,
							}),
							(t.prototype.incRefCount = function (e) {
								this.isDeleted || (this._refCount++, void 0 !== e && null !== this._finalizationRegistry && this._finalizationRegistry.register(e, this));
							}),
							(t.prototype.decRefCount = function () {
								return this.isDeleted ? 0 : --this._refCount;
							}),
							(t.prototype.automaticCleanup = function () {
								O(this);
							}),
							Object.defineProperty(t.prototype, "settings", {
								get: function () {
									return this.checkDestroyed(), this._serverConfig;
								},
								enumerable: !1,
								configurable: !0,
							}),
							(t.prototype.checkDestroyed = function () {
								if (this.isDeleted) throw T.create("server-app-deleted");
							}),
							t
						);
					})(A);
				function P(e, t) {
					var n, r;
					void 0 === t && (t = {});
					var i = e;
					"object" != typeof t && (t = { name: t });
					var a = s.__assign({ name: f, automaticDataCollectionEnabled: !1 }, t),
						u = a.name;
					if ("string" != typeof u || !u) throw T.create("bad-app-name", { appName: String(u) });
					if ((i || (i = c.getDefaultAppConfig()), !i)) throw T.create("no-options");
					var l = g.get(u);
					if (l) {
						if (c.deepEqual(i, l.options) && c.deepEqual(a, l.config)) return l;
						throw T.create("duplicate-app", { appName: u });
					}
					var d = new o.ComponentContainer(u);
					try {
						for (var h = s.__values(_.values()), p = h.next(); !p.done; p = h.next()) {
							var m = p.value;
							d.addComponent(m);
						}
					} catch (e) {
						n = { error: e };
					} finally {
						try {
							p && !p.done && (r = h.return) && r.call(h);
						} finally {
							if (n) throw n.error;
						}
					}
					var v = new A(i, a, d);
					return g.set(u, v), v;
				}
				function O(e) {
					return s.__awaiter(this, void 0, void 0, function () {
						var t, n;
						return s.__generator(this, function (r) {
							switch (r.label) {
								case 0:
									return (
										(t = !1),
										(n = e.name),
										g.has(n) ? ((t = !0), g.delete(n)) : v.has(n) && e.decRefCount() <= 0 && (v.delete(n), (t = !0)),
										t
											? [
													4,
													Promise.all(
														e.container.getProviders().map(function (e) {
															return e.delete();
														})
													),
											  ]
											: [3, 2]
									);
								case 1:
									r.sent(), (e.isDeleted = !0), (r.label = 2);
								case 2:
									return [2];
							}
						});
					});
				}
				function k(e, t, n) {
					var r,
						i = null !== (r = m[e]) && void 0 !== r ? r : e;
					n && (i += "-".concat(n));
					var s = i.match(/\s|\//),
						a = t.match(/\s|\//);
					if (s || a) {
						var c = ['Unable to register library "'.concat(i, '" with version "').concat(t, '":')];
						return s && c.push('library name "'.concat(i, '" contains illegal characters (whitespace or "/")')), s && a && c.push("and"), a && c.push('version name "'.concat(t, '" contains illegal characters (whitespace or "/")')), void p.warn(c.join(" "));
					}
					I(
						new o.Component(
							"".concat(i, "-version"),
							function () {
								return { library: i, version: t };
							},
							"VERSION"
						)
					);
				}
				var C = "firebase-heartbeat-database",
					R = 1,
					N = "firebase-heartbeat-store",
					D = null;
				function L() {
					return (
						D ||
							(D = u
								.openDB(C, R, {
									upgrade: function (e, t) {
										if (0 === t)
											try {
												e.createObjectStore(N);
											} catch (e) {
												console.warn(e);
											}
									},
								})
								.catch(function (e) {
									throw T.create("idb-open", { originalErrorMessage: e.message });
								})),
						D
					);
				}
				function M(e) {
					return s.__awaiter(this, void 0, void 0, function () {
						var t, n, r, i, o;
						return s.__generator(this, function (s) {
							switch (s.label) {
								case 0:
									return s.trys.push([0, 4, , 5]), [4, L()];
								case 1:
									return (t = s.sent()), [4, (n = t.transaction(N)).objectStore(N).get(F(e))];
								case 2:
									return (r = s.sent()), [4, n.done];
								case 3:
									return s.sent(), [2, r];
								case 4:
									return (i = s.sent()) instanceof c.FirebaseError ? p.warn(i.message) : ((o = T.create("idb-get", { originalErrorMessage: null == i ? void 0 : i.message })), p.warn(o.message)), [3, 5];
								case 5:
									return [2];
							}
						});
					});
				}
				function U(e, t) {
					return s.__awaiter(this, void 0, void 0, function () {
						var n, r, i, o;
						return s.__generator(this, function (s) {
							switch (s.label) {
								case 0:
									return s.trys.push([0, 4, , 5]), [4, L()];
								case 1:
									return (n = s.sent()), [4, (r = n.transaction(N, "readwrite")).objectStore(N).put(t, F(e))];
								case 2:
									return s.sent(), [4, r.done];
								case 3:
									return s.sent(), [3, 5];
								case 4:
									return (i = s.sent()) instanceof c.FirebaseError ? p.warn(i.message) : ((o = T.create("idb-set", { originalErrorMessage: null == i ? void 0 : i.message })), p.warn(o.message)), [3, 5];
								case 5:
									return [2];
							}
						});
					});
				}
				function F(e) {
					return "".concat(e.name, "!").concat(e.options.appId);
				}
				var x = (function () {
					function e(e) {
						var t = this;
						(this.container = e), (this._heartbeatsCache = null);
						var n = this.container.getProvider("app").getImmediate();
						(this._storage = new V(n)),
							(this._heartbeatsCachePromise = this._storage.read().then(function (e) {
								return (t._heartbeatsCache = e), e;
							}));
					}
					return (
						(e.prototype.triggerHeartbeat = function () {
							var e, t;
							return s.__awaiter(this, void 0, void 0, function () {
								var n, r, i, o;
								return s.__generator(this, function (s) {
									switch (s.label) {
										case 0:
											return (n = this.container.getProvider("platform-logger").getImmediate()), (r = n.getPlatformInfoString()), (i = j()), null != (null === (e = this._heartbeatsCache) || void 0 === e ? void 0 : e.heartbeats) ? [3, 2] : ((o = this), [4, this._heartbeatsCachePromise]);
										case 1:
											if (((o._heartbeatsCache = s.sent()), null == (null === (t = this._heartbeatsCache) || void 0 === t ? void 0 : t.heartbeats))) return [2];
											s.label = 2;
										case 2:
											return this._heartbeatsCache.lastSentHeartbeatDate === i ||
												this._heartbeatsCache.heartbeats.some(function (e) {
													return e.date === i;
												})
												? [2]
												: (this._heartbeatsCache.heartbeats.push({ date: i, agent: r }),
												  (this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter(function (e) {
														var t = new Date(e.date).valueOf();
														return Date.now() - t <= 2592e6;
												  })),
												  [2, this._storage.overwrite(this._heartbeatsCache)]);
									}
								});
							});
						}),
						(e.prototype.getHeartbeatsHeader = function () {
							var e;
							return s.__awaiter(this, void 0, void 0, function () {
								var t, n, r, i, o;
								return s.__generator(this, function (a) {
									switch (a.label) {
										case 0:
											return null !== this._heartbeatsCache ? [3, 2] : [4, this._heartbeatsCachePromise];
										case 1:
											a.sent(), (a.label = 2);
										case 2:
											return null == (null === (e = this._heartbeatsCache) || void 0 === e ? void 0 : e.heartbeats) || 0 === this._heartbeatsCache.heartbeats.length
												? [2, ""]
												: ((t = j()),
												  (n = (function (e, t) {
														var n, r;
														void 0 === t && (t = 1024);
														var i = [],
															o = e.slice(),
															a = function (e) {
																var n = i.find(function (t) {
																	return t.agent === e.agent;
																});
																if (n) {
																	if ((n.dates.push(e.date), W(i) > t)) return n.dates.pop(), "break";
																} else if ((i.push({ agent: e.agent, dates: [e.date] }), W(i) > t)) return i.pop(), "break";
																o = o.slice(1);
															};
														try {
															for (var c = s.__values(e), u = c.next(); !u.done && "break" !== a(u.value); u = c.next());
														} catch (e) {
															n = { error: e };
														} finally {
															try {
																u && !u.done && (r = c.return) && r.call(c);
															} finally {
																if (n) throw n.error;
															}
														}
														return { heartbeatsToSend: i, unsentEntries: o };
												  })(this._heartbeatsCache.heartbeats)),
												  (r = n.heartbeatsToSend),
												  (i = n.unsentEntries),
												  (o = c.base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: r }))),
												  (this._heartbeatsCache.lastSentHeartbeatDate = t),
												  i.length > 0 ? ((this._heartbeatsCache.heartbeats = i), [4, this._storage.overwrite(this._heartbeatsCache)]) : [3, 4]);
										case 3:
											return a.sent(), [3, 5];
										case 4:
											(this._heartbeatsCache.heartbeats = []), this._storage.overwrite(this._heartbeatsCache), (a.label = 5);
										case 5:
											return [2, o];
									}
								});
							});
						}),
						e
					);
				})();
				function j() {
					return new Date().toISOString().substring(0, 10);
				}
				var V = (function () {
					function e(e) {
						(this.app = e), (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck());
					}
					return (
						(e.prototype.runIndexedDBEnvironmentCheck = function () {
							return s.__awaiter(this, void 0, void 0, function () {
								return s.__generator(this, function (e) {
									return c.isIndexedDBAvailable()
										? [
												2,
												c
													.validateIndexedDBOpenable()
													.then(function () {
														return !0;
													})
													.catch(function () {
														return !1;
													}),
										  ]
										: [2, !1];
								});
							});
						}),
						(e.prototype.read = function () {
							return s.__awaiter(this, void 0, void 0, function () {
								var e;
								return s.__generator(this, function (t) {
									switch (t.label) {
										case 0:
											return [4, this._canUseIndexedDBPromise];
										case 1:
											return t.sent() ? [3, 2] : [2, { heartbeats: [] }];
										case 2:
											return [4, M(this.app)];
										case 3:
											return (null == (e = t.sent()) ? void 0 : e.heartbeats) ? [2, e] : [2, { heartbeats: [] }];
										case 4:
											return [2];
									}
								});
							});
						}),
						(e.prototype.overwrite = function (e) {
							var t;
							return s.__awaiter(this, void 0, void 0, function () {
								var n;
								return s.__generator(this, function (r) {
									switch (r.label) {
										case 0:
											return [4, this._canUseIndexedDBPromise];
										case 1:
											return r.sent() ? [3, 2] : [2];
										case 2:
											return [4, this.read()];
										case 3:
											return (n = r.sent()), [2, U(this.app, { lastSentHeartbeatDate: null !== (t = e.lastSentHeartbeatDate) && void 0 !== t ? t : n.lastSentHeartbeatDate, heartbeats: e.heartbeats })];
									}
								});
							});
						}),
						(e.prototype.add = function (e) {
							var t;
							return s.__awaiter(this, void 0, void 0, function () {
								var n;
								return s.__generator(this, function (r) {
									switch (r.label) {
										case 0:
											return [4, this._canUseIndexedDBPromise];
										case 1:
											return r.sent() ? [3, 2] : [2];
										case 2:
											return [4, this.read()];
										case 3:
											return (n = r.sent()), [2, U(this.app, { lastSentHeartbeatDate: null !== (t = e.lastSentHeartbeatDate) && void 0 !== t ? t : n.lastSentHeartbeatDate, heartbeats: s.__spreadArray(s.__spreadArray([], s.__read(n.heartbeats), !1), s.__read(e.heartbeats), !1) })];
									}
								});
							});
						}),
						e
					);
				})();
				function W(e) {
					return c.base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: e })).length;
				}
				I(
					new o.Component(
						"platform-logger",
						function (e) {
							return new l(e);
						},
						"PRIVATE"
					)
				),
					I(
						new o.Component(
							"heartbeat",
							function (e) {
								return new x(e);
							},
							"PRIVATE"
						)
					),
					k(d, h, "node"),
					k(d, h, "cjs5"),
					k("fire-js", ""),
					Object.defineProperty(t, "FirebaseError", {
						enumerable: !0,
						get: function () {
							return c.FirebaseError;
						},
					}),
					(t.SDK_VERSION = "10.12.3"),
					(t._DEFAULT_ENTRY_NAME = f),
					(t._addComponent = y),
					(t._addOrOverwriteComponent = function (e, t) {
						e.container.addOrOverwriteComponent(t);
					}),
					(t._apps = g),
					(t._clearComponents = function () {
						_.clear();
					}),
					(t._components = _),
					(t._getProvider = w),
					(t._isFirebaseApp = b),
					(t._isFirebaseServerApp = function (e) {
						return void 0 !== e.settings;
					}),
					(t._registerComponent = I),
					(t._removeServiceInstance = function (e, t, n) {
						void 0 === n && (n = f), w(e, t).clearInstance(n);
					}),
					(t._serverApps = v),
					(t.deleteApp = O),
					(t.getApp = function (e) {
						void 0 === e && (e = f);
						var t = g.get(e);
						if (!t && e === f && c.getDefaultAppConfig()) return P();
						if (!t) throw T.create("no-app", { appName: e });
						return t;
					}),
					(t.getApps = function () {
						return Array.from(g.values());
					}),
					(t.initializeApp = P),
					(t.initializeServerApp = function (e, t) {
						var n, r, i;
						if (c.isBrowser() && !c.isWebWorker()) throw T.create("invalid-server-app-environment");
						void 0 === t.automaticDataCollectionEnabled && (t.automaticDataCollectionEnabled = !1), (i = b(e) ? e.options : e);
						var a = s.__assign(s.__assign({}, t), i);
						if ((void 0 !== a.releaseOnDeref && delete a.releaseOnDeref, void 0 !== t.releaseOnDeref && "undefined" == typeof FinalizationRegistry)) throw T.create("finalization-registry-not-supported", {});
						var u,
							l =
								"" +
								((u = JSON.stringify(a)),
								s.__spreadArray([], s.__read(u), !1).reduce(function (e, t) {
									return (Math.imul(31, e) + t.charCodeAt(0)) | 0;
								}, 0)),
							d = v.get(l);
						if (d) return d.incRefCount(t.releaseOnDeref), d;
						var h = new o.ComponentContainer(l);
						try {
							for (var p = s.__values(_.values()), f = p.next(); !f.done; f = p.next()) {
								var m = f.value;
								h.addComponent(m);
							}
						} catch (e) {
							n = { error: e };
						} finally {
							try {
								f && !f.done && (r = p.return) && r.call(p);
							} finally {
								if (n) throw n.error;
							}
						}
						var g = new S(i, t, l, h);
						return v.set(l, g), g;
					}),
					(t.onLog = function (e, t) {
						if (null !== e && "function" != typeof e) throw T.create("invalid-log-argument");
						a.setUserLogHandler(e, t);
					}),
					(t.registerVersion = k),
					(t.setLogLevel = function (e) {
						a.setLogLevel(e);
					});
			},
			194: (e, t, n) => {
				var r = n(199),
					i = n(336),
					o = n(844),
					s = n(635),
					a = n(319);
				const c = function () {
						return { "dependent-sdk-initialized-before-auth": "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK." };
					},
					u = new i.ErrorFactory("auth", "Firebase", { "dependent-sdk-initialized-before-auth": "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK." }),
					l = new o.Logger("@firebase/auth");
				function d(e, ...t) {
					l.logLevel <= o.LogLevel.ERROR && l.error(`Auth (${r.SDK_VERSION}): ${e}`, ...t);
				}
				function h(e, ...t) {
					throw v(e, ...t);
				}
				function p(e, ...t) {
					return v(e, ...t);
				}
				function f(e, t, n) {
					const r = Object.assign(Object.assign({}, c()), { [t]: n });
					return new i.ErrorFactory("auth", "Firebase", r).create(t, { appName: e.name });
				}
				function m(e) {
					return f(e, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
				}
				function g(e, t, n) {
					if (!(t instanceof n)) throw (n.name !== t.constructor.name && h(e, "argument-error"), f(e, "argument-error", `Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`));
				}
				function v(e, ...t) {
					if ("string" != typeof e) {
						const n = t[0],
							r = [...t.slice(1)];
						return r[0] && (r[0].appName = e.name), e._errorFactory.create(n, ...r);
					}
					return u.create(e, ...t);
				}
				function _(e, t, ...n) {
					if (!e) throw v(t, ...n);
				}
				function y(e) {
					const t = "INTERNAL ASSERTION FAILED: " + e;
					throw (d(t), new Error(t));
				}
				function I(e, t) {
					e || y(t);
				}
				function w() {
					var e;
					return ("undefined" != typeof self && (null === (e = self.location) || void 0 === e ? void 0 : e.href)) || "";
				}
				function b() {
					return "http:" === E() || "https:" === E();
				}
				function E() {
					var e;
					return ("undefined" != typeof self && (null === (e = self.location) || void 0 === e ? void 0 : e.protocol)) || null;
				}
				class T {
					constructor(e, t) {
						(this.shortDelay = e), (this.longDelay = t), I(t > e, "Short delay should be less than long delay!"), (this.isMobile = i.isMobileCordova() || i.isReactNative());
					}
					get() {
						return "undefined" != typeof navigator && navigator && "onLine" in navigator && "boolean" == typeof navigator.onLine && (b() || i.isBrowserExtension() || "connection" in navigator) && !navigator.onLine ? Math.min(5e3, this.shortDelay) : this.isMobile ? this.longDelay : this.shortDelay;
					}
				}
				function A(e, t) {
					I(e.emulator, "Emulator should always be set here");
					const { url: n } = e.emulator;
					return t ? `${n}${t.startsWith("/") ? t.slice(1) : t}` : n;
				}
				class S {
					static initialize(e, t, n) {
						(this.fetchImpl = e), t && (this.headersImpl = t), n && (this.responseImpl = n);
					}
					static fetch() {
						return this.fetchImpl ? this.fetchImpl : "undefined" != typeof self && "fetch" in self ? self.fetch : "undefined" != typeof globalThis && globalThis.fetch ? globalThis.fetch : "undefined" != typeof fetch ? fetch : void y("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
					}
					static headers() {
						return this.headersImpl ? this.headersImpl : "undefined" != typeof self && "Headers" in self ? self.Headers : "undefined" != typeof globalThis && globalThis.Headers ? globalThis.Headers : "undefined" != typeof Headers ? Headers : void y("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
					}
					static response() {
						return this.responseImpl ? this.responseImpl : "undefined" != typeof self && "Response" in self ? self.Response : "undefined" != typeof globalThis && globalThis.Response ? globalThis.Response : "undefined" != typeof Response ? Response : void y("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
					}
				}
				const P = {
						CREDENTIAL_MISMATCH: "custom-token-mismatch",
						MISSING_CUSTOM_TOKEN: "internal-error",
						INVALID_IDENTIFIER: "invalid-email",
						MISSING_CONTINUE_URI: "internal-error",
						INVALID_PASSWORD: "wrong-password",
						MISSING_PASSWORD: "missing-password",
						INVALID_LOGIN_CREDENTIALS: "invalid-credential",
						EMAIL_EXISTS: "email-already-in-use",
						PASSWORD_LOGIN_DISABLED: "operation-not-allowed",
						INVALID_IDP_RESPONSE: "invalid-credential",
						INVALID_PENDING_TOKEN: "invalid-credential",
						FEDERATED_USER_ID_ALREADY_LINKED: "credential-already-in-use",
						MISSING_REQ_TYPE: "internal-error",
						EMAIL_NOT_FOUND: "user-not-found",
						RESET_PASSWORD_EXCEED_LIMIT: "too-many-requests",
						EXPIRED_OOB_CODE: "expired-action-code",
						INVALID_OOB_CODE: "invalid-action-code",
						MISSING_OOB_CODE: "internal-error",
						CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "requires-recent-login",
						INVALID_ID_TOKEN: "invalid-user-token",
						TOKEN_EXPIRED: "user-token-expired",
						USER_NOT_FOUND: "user-token-expired",
						TOO_MANY_ATTEMPTS_TRY_LATER: "too-many-requests",
						PASSWORD_DOES_NOT_MEET_REQUIREMENTS: "password-does-not-meet-requirements",
						INVALID_CODE: "invalid-verification-code",
						INVALID_SESSION_INFO: "invalid-verification-id",
						INVALID_TEMPORARY_PROOF: "invalid-credential",
						MISSING_SESSION_INFO: "missing-verification-id",
						SESSION_EXPIRED: "code-expired",
						MISSING_ANDROID_PACKAGE_NAME: "missing-android-pkg-name",
						UNAUTHORIZED_DOMAIN: "unauthorized-continue-uri",
						INVALID_OAUTH_CLIENT_ID: "invalid-oauth-client-id",
						ADMIN_ONLY_OPERATION: "admin-restricted-operation",
						INVALID_MFA_PENDING_CREDENTIAL: "invalid-multi-factor-session",
						MFA_ENROLLMENT_NOT_FOUND: "multi-factor-info-not-found",
						MISSING_MFA_ENROLLMENT_ID: "missing-multi-factor-info",
						MISSING_MFA_PENDING_CREDENTIAL: "missing-multi-factor-session",
						SECOND_FACTOR_EXISTS: "second-factor-already-in-use",
						SECOND_FACTOR_LIMIT_EXCEEDED: "maximum-second-factor-count-exceeded",
						BLOCKING_FUNCTION_ERROR_RESPONSE: "internal-error",
						RECAPTCHA_NOT_ENABLED: "recaptcha-not-enabled",
						MISSING_RECAPTCHA_TOKEN: "missing-recaptcha-token",
						INVALID_RECAPTCHA_TOKEN: "invalid-recaptcha-token",
						INVALID_RECAPTCHA_ACTION: "invalid-recaptcha-action",
						MISSING_CLIENT_TYPE: "missing-client-type",
						MISSING_RECAPTCHA_VERSION: "missing-recaptcha-version",
						INVALID_RECAPTCHA_VERSION: "invalid-recaptcha-version",
						INVALID_REQ_TYPE: "invalid-req-type",
					},
					O = new T(3e4, 6e4);
				function k(e, t) {
					return e.tenantId && !t.tenantId ? Object.assign(Object.assign({}, t), { tenantId: e.tenantId }) : t;
				}
				async function C(e, t, n, r, o = {}) {
					return R(e, o, async () => {
						let o = {},
							s = {};
						r && ("GET" === t ? (s = r) : (o = { body: JSON.stringify(r) }));
						const a = i.querystring(Object.assign({ key: e.config.apiKey }, s)).slice(1),
							c = await e._getAdditionalHeaders();
						return (c["Content-Type"] = "application/json"), e.languageCode && (c["X-Firebase-Locale"] = e.languageCode), S.fetch()(D(e, e.config.apiHost, n, a), Object.assign({ method: t, headers: c, referrerPolicy: "no-referrer" }, o));
					});
				}
				async function R(e, t, n) {
					e._canInitEmulator = !1;
					const r = Object.assign(Object.assign({}, P), t);
					try {
						const t = new M(e),
							i = await Promise.race([n(), t.promise]);
						t.clearNetworkTimeout();
						const o = await i.json();
						if ("needConfirmation" in o) throw U(e, "account-exists-with-different-credential", o);
						if (i.ok && !("errorMessage" in o)) return o;
						{
							const t = i.ok ? o.errorMessage : o.error.message,
								[n, s] = t.split(" : ");
							if ("FEDERATED_USER_ID_ALREADY_LINKED" === n) throw U(e, "credential-already-in-use", o);
							if ("EMAIL_EXISTS" === n) throw U(e, "email-already-in-use", o);
							if ("USER_DISABLED" === n) throw U(e, "user-disabled", o);
							const a = r[n] || n.toLowerCase().replace(/[_\s]+/g, "-");
							if (s) throw f(e, a, s);
							h(e, a);
						}
					} catch (t) {
						if (t instanceof i.FirebaseError) throw t;
						h(e, "network-request-failed", { message: String(t) });
					}
				}
				async function N(e, t, n, r, i = {}) {
					const o = await C(e, t, n, r, i);
					return "mfaPendingCredential" in o && h(e, "multi-factor-auth-required", { _serverResponse: o }), o;
				}
				function D(e, t, n, r) {
					const i = `${t}${n}?${r}`;
					return e.config.emulator ? A(e.config, i) : `${e.config.apiScheme}://${i}`;
				}
				function L(e) {
					switch (e) {
						case "ENFORCE":
							return "ENFORCE";
						case "AUDIT":
							return "AUDIT";
						case "OFF":
							return "OFF";
						default:
							return "ENFORCEMENT_STATE_UNSPECIFIED";
					}
				}
				class M {
					constructor(e) {
						(this.auth = e),
							(this.timer = null),
							(this.promise = new Promise((e, t) => {
								this.timer = setTimeout(() => t(p(this.auth, "network-request-failed")), O.get());
							}));
					}
					clearNetworkTimeout() {
						clearTimeout(this.timer);
					}
				}
				function U(e, t, n) {
					const r = { appName: e.name };
					n.email && (r.email = n.email), n.phoneNumber && (r.phoneNumber = n.phoneNumber);
					const i = p(e, t, r);
					return (i.customData._tokenResponse = n), i;
				}
				function F(e) {
					return void 0 !== e && void 0 !== e.getResponse;
				}
				function x(e) {
					return void 0 !== e && void 0 !== e.enterprise;
				}
				class j {
					constructor(e) {
						if (((this.siteKey = ""), (this.recaptchaEnforcementState = []), void 0 === e.recaptchaKey)) throw new Error("recaptchaKey undefined");
						(this.siteKey = e.recaptchaKey.split("/")[3]), (this.recaptchaEnforcementState = e.recaptchaEnforcementState);
					}
					getProviderEnforcementState(e) {
						if (!this.recaptchaEnforcementState || 0 === this.recaptchaEnforcementState.length) return null;
						for (const t of this.recaptchaEnforcementState) if (t.provider && t.provider === e) return L(t.enforcementState);
						return null;
					}
					isProviderEnabled(e) {
						return "ENFORCE" === this.getProviderEnforcementState(e) || "AUDIT" === this.getProviderEnforcementState(e);
					}
				}
				async function V(e, t) {
					return C(e, "GET", "/v2/recaptchaConfig", k(e, t));
				}
				async function W(e, t) {
					return C(e, "POST", "/v1/accounts:lookup", t);
				}
				function H(e) {
					if (e)
						try {
							const t = new Date(Number(e));
							if (!isNaN(t.getTime())) return t.toUTCString();
						} catch (e) {}
				}
				async function z(e, t = !1) {
					const n = i.getModularInstance(e),
						r = await n.getIdToken(t),
						o = q(r);
					_(o && o.exp && o.auth_time && o.iat, n.auth, "internal-error");
					const s = "object" == typeof o.firebase ? o.firebase : void 0,
						a = null == s ? void 0 : s.sign_in_provider;
					return { claims: o, token: r, authTime: H(B(o.auth_time)), issuedAtTime: H(B(o.iat)), expirationTime: H(B(o.exp)), signInProvider: a || null, signInSecondFactor: (null == s ? void 0 : s.sign_in_second_factor) || null };
				}
				function B(e) {
					return 1e3 * Number(e);
				}
				function q(e) {
					const [t, n, r] = e.split(".");
					if (void 0 === t || void 0 === n || void 0 === r) return d("JWT malformed, contained fewer than 3 sections"), null;
					try {
						const e = i.base64Decode(n);
						return e ? JSON.parse(e) : (d("Failed to decode base64 JWT payload"), null);
					} catch (e) {
						return d("Caught error parsing JWT payload as JSON", null == e ? void 0 : e.toString()), null;
					}
				}
				function G(e) {
					const t = q(e);
					return _(t, "internal-error"), _(void 0 !== t.exp, "internal-error"), _(void 0 !== t.iat, "internal-error"), Number(t.exp) - Number(t.iat);
				}
				async function K(e, t, n = !1) {
					if (n) return t;
					try {
						return await t;
					} catch (t) {
						throw (
							(t instanceof i.FirebaseError &&
								(function ({ code: e }) {
									return "auth/user-disabled" === e || "auth/user-token-expired" === e;
								})(t) &&
								e.auth.currentUser === e &&
								(await e.auth.signOut()),
							t)
						);
					}
				}
				class $ {
					constructor(e) {
						(this.user = e), (this.isRunning = !1), (this.timerId = null), (this.errorBackoff = 3e4);
					}
					_start() {
						this.isRunning || ((this.isRunning = !0), this.schedule());
					}
					_stop() {
						this.isRunning && ((this.isRunning = !1), null !== this.timerId && clearTimeout(this.timerId));
					}
					getInterval(e) {
						var t;
						if (e) {
							const e = this.errorBackoff;
							return (this.errorBackoff = Math.min(2 * this.errorBackoff, 96e4)), e;
						}
						{
							this.errorBackoff = 3e4;
							const e = (null !== (t = this.user.stsTokenManager.expirationTime) && void 0 !== t ? t : 0) - Date.now() - 3e5;
							return Math.max(0, e);
						}
					}
					schedule(e = !1) {
						if (!this.isRunning) return;
						const t = this.getInterval(e);
						this.timerId = setTimeout(async () => {
							await this.iteration();
						}, t);
					}
					async iteration() {
						try {
							await this.user.getIdToken(!0);
						} catch (e) {
							return void ("auth/network-request-failed" === (null == e ? void 0 : e.code) && this.schedule(!0));
						}
						this.schedule();
					}
				}
				class J {
					constructor(e, t) {
						(this.createdAt = e), (this.lastLoginAt = t), this._initializeTime();
					}
					_initializeTime() {
						(this.lastSignInTime = H(this.lastLoginAt)), (this.creationTime = H(this.createdAt));
					}
					_copy(e) {
						(this.createdAt = e.createdAt), (this.lastLoginAt = e.lastLoginAt), this._initializeTime();
					}
					toJSON() {
						return { createdAt: this.createdAt, lastLoginAt: this.lastLoginAt };
					}
				}
				async function Y(e) {
					var t;
					const n = e.auth,
						r = await e.getIdToken(),
						i = await K(e, W(n, { idToken: r }));
					_(null == i ? void 0 : i.users.length, n, "internal-error");
					const o = i.users[0];
					e._notifyReloadListener(o);
					const s = (null === (t = o.providerUserInfo) || void 0 === t ? void 0 : t.length) ? Q(o.providerUserInfo) : [],
						a = ((c = e.providerData), (u = s), [...c.filter((e) => !u.some((t) => t.providerId === e.providerId)), ...u]);
					var c, u;
					const l = e.isAnonymous,
						d = !((e.email && o.passwordHash) || (null == a ? void 0 : a.length)),
						h = !!l && d,
						p = { uid: o.localId, displayName: o.displayName || null, photoURL: o.photoUrl || null, email: o.email || null, emailVerified: o.emailVerified || !1, phoneNumber: o.phoneNumber || null, tenantId: o.tenantId || null, providerData: a, metadata: new J(o.createdAt, o.lastLoginAt), isAnonymous: h };
					Object.assign(e, p);
				}
				async function X(e) {
					const t = i.getModularInstance(e);
					await Y(t), await t.auth._persistUserIfCurrent(t), t.auth._notifyListenersIfCurrent(t);
				}
				function Q(e) {
					return e.map((e) => {
						var { providerId: t } = e,
							n = s.__rest(e, ["providerId"]);
						return { providerId: t, uid: n.rawId || "", displayName: n.displayName || null, email: n.email || null, phoneNumber: n.phoneNumber || null, photoURL: n.photoUrl || null };
					});
				}
				class Z {
					constructor() {
						(this.refreshToken = null), (this.accessToken = null), (this.expirationTime = null);
					}
					get isExpired() {
						return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
					}
					updateFromServerResponse(e) {
						_(e.idToken, "internal-error"), _(void 0 !== e.idToken, "internal-error"), _(void 0 !== e.refreshToken, "internal-error");
						const t = "expiresIn" in e && void 0 !== e.expiresIn ? Number(e.expiresIn) : G(e.idToken);
						this.updateTokensAndExpiration(e.idToken, e.refreshToken, t);
					}
					updateFromIdToken(e) {
						_(0 !== e.length, "internal-error");
						const t = G(e);
						this.updateTokensAndExpiration(e, null, t);
					}
					async getToken(e, t = !1) {
						return t || !this.accessToken || this.isExpired ? (_(this.refreshToken, e, "user-token-expired"), this.refreshToken ? (await this.refresh(e, this.refreshToken), this.accessToken) : null) : this.accessToken;
					}
					clearRefreshToken() {
						this.refreshToken = null;
					}
					async refresh(e, t) {
						const {
							accessToken: n,
							refreshToken: r,
							expiresIn: o,
						} = await (async function (e, t) {
							const n = await R(e, {}, async () => {
								const n = i.querystring({ grant_type: "refresh_token", refresh_token: t }).slice(1),
									{ tokenApiHost: r, apiKey: o } = e.config,
									s = D(e, r, "/v1/token", `key=${o}`),
									a = await e._getAdditionalHeaders();
								return (a["Content-Type"] = "application/x-www-form-urlencoded"), S.fetch()(s, { method: "POST", headers: a, body: n });
							});
							return { accessToken: n.access_token, expiresIn: n.expires_in, refreshToken: n.refresh_token };
						})(e, t);
						this.updateTokensAndExpiration(n, r, Number(o));
					}
					updateTokensAndExpiration(e, t, n) {
						(this.refreshToken = t || null), (this.accessToken = e || null), (this.expirationTime = Date.now() + 1e3 * n);
					}
					static fromJSON(e, t) {
						const { refreshToken: n, accessToken: r, expirationTime: i } = t,
							o = new Z();
						return n && (_("string" == typeof n, "internal-error", { appName: e }), (o.refreshToken = n)), r && (_("string" == typeof r, "internal-error", { appName: e }), (o.accessToken = r)), i && (_("number" == typeof i, "internal-error", { appName: e }), (o.expirationTime = i)), o;
					}
					toJSON() {
						return { refreshToken: this.refreshToken, accessToken: this.accessToken, expirationTime: this.expirationTime };
					}
					_assign(e) {
						(this.accessToken = e.accessToken), (this.refreshToken = e.refreshToken), (this.expirationTime = e.expirationTime);
					}
					_clone() {
						return Object.assign(new Z(), this.toJSON());
					}
					_performRefresh() {
						return y("not implemented");
					}
				}
				function ee(e, t) {
					_("string" == typeof e || void 0 === e, "internal-error", { appName: t });
				}
				class te {
					constructor(e) {
						var { uid: t, auth: n, stsTokenManager: r } = e,
							i = s.__rest(e, ["uid", "auth", "stsTokenManager"]);
						(this.providerId = "firebase"), (this.proactiveRefresh = new $(this)), (this.reloadUserInfo = null), (this.reloadListener = null), (this.uid = t), (this.auth = n), (this.stsTokenManager = r), (this.accessToken = r.accessToken), (this.displayName = i.displayName || null), (this.email = i.email || null), (this.emailVerified = i.emailVerified || !1), (this.phoneNumber = i.phoneNumber || null), (this.photoURL = i.photoURL || null), (this.isAnonymous = i.isAnonymous || !1), (this.tenantId = i.tenantId || null), (this.providerData = i.providerData ? [...i.providerData] : []), (this.metadata = new J(i.createdAt || void 0, i.lastLoginAt || void 0));
					}
					async getIdToken(e) {
						const t = await K(this, this.stsTokenManager.getToken(this.auth, e));
						return _(t, this.auth, "internal-error"), this.accessToken !== t && ((this.accessToken = t), await this.auth._persistUserIfCurrent(this), this.auth._notifyListenersIfCurrent(this)), t;
					}
					getIdTokenResult(e) {
						return z(this, e);
					}
					reload() {
						return X(this);
					}
					_assign(e) {
						this !== e && (_(this.uid === e.uid, this.auth, "internal-error"), (this.displayName = e.displayName), (this.photoURL = e.photoURL), (this.email = e.email), (this.emailVerified = e.emailVerified), (this.phoneNumber = e.phoneNumber), (this.isAnonymous = e.isAnonymous), (this.tenantId = e.tenantId), (this.providerData = e.providerData.map((e) => Object.assign({}, e))), this.metadata._copy(e.metadata), this.stsTokenManager._assign(e.stsTokenManager));
					}
					_clone(e) {
						const t = new te(Object.assign(Object.assign({}, this), { auth: e, stsTokenManager: this.stsTokenManager._clone() }));
						return t.metadata._copy(this.metadata), t;
					}
					_onReload(e) {
						_(!this.reloadListener, this.auth, "internal-error"), (this.reloadListener = e), this.reloadUserInfo && (this._notifyReloadListener(this.reloadUserInfo), (this.reloadUserInfo = null));
					}
					_notifyReloadListener(e) {
						this.reloadListener ? this.reloadListener(e) : (this.reloadUserInfo = e);
					}
					_startProactiveRefresh() {
						this.proactiveRefresh._start();
					}
					_stopProactiveRefresh() {
						this.proactiveRefresh._stop();
					}
					async _updateTokensIfNecessary(e, t = !1) {
						let n = !1;
						e.idToken && e.idToken !== this.stsTokenManager.accessToken && (this.stsTokenManager.updateFromServerResponse(e), (n = !0)), t && (await Y(this)), await this.auth._persistUserIfCurrent(this), n && this.auth._notifyListenersIfCurrent(this);
					}
					async delete() {
						if (r._isFirebaseServerApp(this.auth.app)) return Promise.reject(m(this.auth));
						const e = await this.getIdToken();
						return (
							await K(
								this,
								(async function (e, t) {
									return C(e, "POST", "/v1/accounts:delete", t);
								})(this.auth, { idToken: e })
							),
							this.stsTokenManager.clearRefreshToken(),
							this.auth.signOut()
						);
					}
					toJSON() {
						return Object.assign(Object.assign({ uid: this.uid, email: this.email || void 0, emailVerified: this.emailVerified, displayName: this.displayName || void 0, isAnonymous: this.isAnonymous, photoURL: this.photoURL || void 0, phoneNumber: this.phoneNumber || void 0, tenantId: this.tenantId || void 0, providerData: this.providerData.map((e) => Object.assign({}, e)), stsTokenManager: this.stsTokenManager.toJSON(), _redirectEventId: this._redirectEventId }, this.metadata.toJSON()), { apiKey: this.auth.config.apiKey, appName: this.auth.name });
					}
					get refreshToken() {
						return this.stsTokenManager.refreshToken || "";
					}
					static _fromJSON(e, t) {
						var n, r, i, o, s, a, c, u;
						const l = null !== (n = t.displayName) && void 0 !== n ? n : void 0,
							d = null !== (r = t.email) && void 0 !== r ? r : void 0,
							h = null !== (i = t.phoneNumber) && void 0 !== i ? i : void 0,
							p = null !== (o = t.photoURL) && void 0 !== o ? o : void 0,
							f = null !== (s = t.tenantId) && void 0 !== s ? s : void 0,
							m = null !== (a = t._redirectEventId) && void 0 !== a ? a : void 0,
							g = null !== (c = t.createdAt) && void 0 !== c ? c : void 0,
							v = null !== (u = t.lastLoginAt) && void 0 !== u ? u : void 0,
							{ uid: y, emailVerified: I, isAnonymous: w, providerData: b, stsTokenManager: E } = t;
						_(y && E, e, "internal-error");
						const T = Z.fromJSON(this.name, E);
						_("string" == typeof y, e, "internal-error"), ee(l, e.name), ee(d, e.name), _("boolean" == typeof I, e, "internal-error"), _("boolean" == typeof w, e, "internal-error"), ee(h, e.name), ee(p, e.name), ee(f, e.name), ee(m, e.name), ee(g, e.name), ee(v, e.name);
						const A = new te({ uid: y, auth: e, email: d, emailVerified: I, displayName: l, isAnonymous: w, photoURL: p, phoneNumber: h, tenantId: f, stsTokenManager: T, createdAt: g, lastLoginAt: v });
						return b && Array.isArray(b) && (A.providerData = b.map((e) => Object.assign({}, e))), m && (A._redirectEventId = m), A;
					}
					static async _fromIdTokenResponse(e, t, n = !1) {
						const r = new Z();
						r.updateFromServerResponse(t);
						const i = new te({ uid: t.localId, auth: e, stsTokenManager: r, isAnonymous: n });
						return await Y(i), i;
					}
					static async _fromGetAccountInfoResponse(e, t, n) {
						const r = t.users[0];
						_(void 0 !== r.localId, "internal-error");
						const i = void 0 !== r.providerUserInfo ? Q(r.providerUserInfo) : [],
							o = !((r.email && r.passwordHash) || (null == i ? void 0 : i.length)),
							s = new Z();
						s.updateFromIdToken(n);
						const a = new te({ uid: r.localId, auth: e, stsTokenManager: s, isAnonymous: o }),
							c = { uid: r.localId, displayName: r.displayName || null, photoURL: r.photoUrl || null, email: r.email || null, emailVerified: r.emailVerified || !1, phoneNumber: r.phoneNumber || null, tenantId: r.tenantId || null, providerData: i, metadata: new J(r.createdAt, r.lastLoginAt), isAnonymous: !((r.email && r.passwordHash) || (null == i ? void 0 : i.length)) };
						return Object.assign(a, c), a;
					}
				}
				const ne = new Map();
				function re(e) {
					I(e instanceof Function, "Expected a class definition");
					let t = ne.get(e);
					return t ? (I(t instanceof e, "Instance stored in cache mismatched with class"), t) : ((t = new e()), ne.set(e, t), t);
				}
				class ie {
					constructor() {
						(this.type = "NONE"), (this.storage = {});
					}
					async _isAvailable() {
						return !0;
					}
					async _set(e, t) {
						this.storage[e] = t;
					}
					async _get(e) {
						const t = this.storage[e];
						return void 0 === t ? null : t;
					}
					async _remove(e) {
						delete this.storage[e];
					}
					_addListener(e, t) {}
					_removeListener(e, t) {}
				}
				ie.type = "NONE";
				const oe = ie;
				function se(e, t, n) {
					return `firebase:${e}:${t}:${n}`;
				}
				class ae {
					constructor(e, t, n) {
						(this.persistence = e), (this.auth = t), (this.userKey = n);
						const { config: r, name: i } = this.auth;
						(this.fullUserKey = se(this.userKey, r.apiKey, i)), (this.fullPersistenceKey = se("persistence", r.apiKey, i)), (this.boundEventHandler = t._onStorageEvent.bind(t)), this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
					}
					setCurrentUser(e) {
						return this.persistence._set(this.fullUserKey, e.toJSON());
					}
					async getCurrentUser() {
						const e = await this.persistence._get(this.fullUserKey);
						return e ? te._fromJSON(this.auth, e) : null;
					}
					removeCurrentUser() {
						return this.persistence._remove(this.fullUserKey);
					}
					savePersistenceForRedirect() {
						return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
					}
					async setPersistence(e) {
						if (this.persistence === e) return;
						const t = await this.getCurrentUser();
						return await this.removeCurrentUser(), (this.persistence = e), t ? this.setCurrentUser(t) : void 0;
					}
					delete() {
						this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
					}
					static async create(e, t, n = "authUser") {
						if (!t.length) return new ae(re(oe), e, n);
						const r = (
							await Promise.all(
								t.map(async (e) => {
									if (await e._isAvailable()) return e;
								})
							)
						).filter((e) => e);
						let i = r[0] || re(oe);
						const o = se(n, e.config.apiKey, e.name);
						let s = null;
						for (const n of t)
							try {
								const t = await n._get(o);
								if (t) {
									const r = te._fromJSON(e, t);
									n !== i && (s = r), (i = n);
									break;
								}
							} catch (e) {}
						const a = r.filter((e) => e._shouldAllowMigration);
						return i._shouldAllowMigration && a.length
							? ((i = a[0]),
							  s && (await i._set(o, s.toJSON())),
							  await Promise.all(
									t.map(async (e) => {
										if (e !== i)
											try {
												await e._remove(o);
											} catch (e) {}
									})
							  ),
							  new ae(i, e, n))
							: new ae(i, e, n);
					}
				}
				function ce(e) {
					const t = e.toLowerCase();
					if (t.includes("opera/") || t.includes("opr/") || t.includes("opios/")) return "Opera";
					if (he(t)) return "IEMobile";
					if (t.includes("msie") || t.includes("trident/")) return "IE";
					if (t.includes("edge/")) return "Edge";
					if (ue(t)) return "Firefox";
					if (t.includes("silk/")) return "Silk";
					if (fe(t)) return "Blackberry";
					if (me(t)) return "Webos";
					if (le(t)) return "Safari";
					if ((t.includes("chrome/") || de(t)) && !t.includes("edge/")) return "Chrome";
					if (pe(t)) return "Android";
					{
						const t = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,
							n = e.match(t);
						if (2 === (null == n ? void 0 : n.length)) return n[1];
					}
					return "Other";
				}
				function ue(e = i.getUA()) {
					return /firefox\//i.test(e);
				}
				function le(e = i.getUA()) {
					const t = e.toLowerCase();
					return t.includes("safari/") && !t.includes("chrome/") && !t.includes("crios/") && !t.includes("android");
				}
				function de(e = i.getUA()) {
					return /crios\//i.test(e);
				}
				function he(e = i.getUA()) {
					return /iemobile/i.test(e);
				}
				function pe(e = i.getUA()) {
					return /android/i.test(e);
				}
				function fe(e = i.getUA()) {
					return /blackberry/i.test(e);
				}
				function me(e = i.getUA()) {
					return /webos/i.test(e);
				}
				function ge(e = i.getUA()) {
					return /iphone|ipad|ipod/i.test(e) || (/macintosh/i.test(e) && /mobile/i.test(e));
				}
				function ve(e = i.getUA()) {
					return ge(e) || pe(e) || me(e) || fe(e) || /windows phone/i.test(e) || he(e);
				}
				function _e(e, t = []) {
					let n;
					switch (e) {
						case "Browser":
							n = ce(i.getUA());
							break;
						case "Worker":
							n = `${ce(i.getUA())}-${e}`;
							break;
						default:
							n = e;
					}
					const o = t.length ? t.join(",") : "FirebaseCore-web";
					return `${n}/JsCore/${r.SDK_VERSION}/${o}`;
				}
				class ye {
					constructor(e) {
						(this.auth = e), (this.queue = []);
					}
					pushCallback(e, t) {
						const n = (t) =>
							new Promise((n, r) => {
								try {
									n(e(t));
								} catch (e) {
									r(e);
								}
							});
						(n.onAbort = t), this.queue.push(n);
						const r = this.queue.length - 1;
						return () => {
							this.queue[r] = () => Promise.resolve();
						};
					}
					async runMiddleware(e) {
						if (this.auth.currentUser === e) return;
						const t = [];
						try {
							for (const n of this.queue) await n(e), n.onAbort && t.push(n.onAbort);
						} catch (e) {
							t.reverse();
							for (const e of t)
								try {
									e();
								} catch (e) {}
							throw this.auth._errorFactory.create("login-blocked", { originalMessage: null == e ? void 0 : e.message });
						}
					}
				}
				class Ie {
					constructor(e) {
						var t, n, r, i;
						const o = e.customStrengthOptions;
						(this.customStrengthOptions = {}),
							(this.customStrengthOptions.minPasswordLength = null !== (t = o.minPasswordLength) && void 0 !== t ? t : 6),
							o.maxPasswordLength && (this.customStrengthOptions.maxPasswordLength = o.maxPasswordLength),
							void 0 !== o.containsLowercaseCharacter && (this.customStrengthOptions.containsLowercaseLetter = o.containsLowercaseCharacter),
							void 0 !== o.containsUppercaseCharacter && (this.customStrengthOptions.containsUppercaseLetter = o.containsUppercaseCharacter),
							void 0 !== o.containsNumericCharacter && (this.customStrengthOptions.containsNumericCharacter = o.containsNumericCharacter),
							void 0 !== o.containsNonAlphanumericCharacter && (this.customStrengthOptions.containsNonAlphanumericCharacter = o.containsNonAlphanumericCharacter),
							(this.enforcementState = e.enforcementState),
							"ENFORCEMENT_STATE_UNSPECIFIED" === this.enforcementState && (this.enforcementState = "OFF"),
							(this.allowedNonAlphanumericCharacters = null !== (r = null === (n = e.allowedNonAlphanumericCharacters) || void 0 === n ? void 0 : n.join("")) && void 0 !== r ? r : ""),
							(this.forceUpgradeOnSignin = null !== (i = e.forceUpgradeOnSignin) && void 0 !== i && i),
							(this.schemaVersion = e.schemaVersion);
					}
					validatePassword(e) {
						var t, n, r, i, o, s;
						const a = { isValid: !0, passwordPolicy: this };
						return this.validatePasswordLengthOptions(e, a), this.validatePasswordCharacterOptions(e, a), a.isValid && (a.isValid = null === (t = a.meetsMinPasswordLength) || void 0 === t || t), a.isValid && (a.isValid = null === (n = a.meetsMaxPasswordLength) || void 0 === n || n), a.isValid && (a.isValid = null === (r = a.containsLowercaseLetter) || void 0 === r || r), a.isValid && (a.isValid = null === (i = a.containsUppercaseLetter) || void 0 === i || i), a.isValid && (a.isValid = null === (o = a.containsNumericCharacter) || void 0 === o || o), a.isValid && (a.isValid = null === (s = a.containsNonAlphanumericCharacter) || void 0 === s || s), a;
					}
					validatePasswordLengthOptions(e, t) {
						const n = this.customStrengthOptions.minPasswordLength,
							r = this.customStrengthOptions.maxPasswordLength;
						n && (t.meetsMinPasswordLength = e.length >= n), r && (t.meetsMaxPasswordLength = e.length <= r);
					}
					validatePasswordCharacterOptions(e, t) {
						let n;
						this.updatePasswordCharacterOptionsStatuses(t, !1, !1, !1, !1);
						for (let r = 0; r < e.length; r++) (n = e.charAt(r)), this.updatePasswordCharacterOptionsStatuses(t, n >= "a" && n <= "z", n >= "A" && n <= "Z", n >= "0" && n <= "9", this.allowedNonAlphanumericCharacters.includes(n));
					}
					updatePasswordCharacterOptionsStatuses(e, t, n, r, i) {
						this.customStrengthOptions.containsLowercaseLetter && (e.containsLowercaseLetter || (e.containsLowercaseLetter = t)), this.customStrengthOptions.containsUppercaseLetter && (e.containsUppercaseLetter || (e.containsUppercaseLetter = n)), this.customStrengthOptions.containsNumericCharacter && (e.containsNumericCharacter || (e.containsNumericCharacter = r)), this.customStrengthOptions.containsNonAlphanumericCharacter && (e.containsNonAlphanumericCharacter || (e.containsNonAlphanumericCharacter = i));
					}
				}
				class we {
					constructor(e, t, n, r) {
						(this.app = e),
							(this.heartbeatServiceProvider = t),
							(this.appCheckServiceProvider = n),
							(this.config = r),
							(this.currentUser = null),
							(this.emulatorConfig = null),
							(this.operations = Promise.resolve()),
							(this.authStateSubscription = new Ee(this)),
							(this.idTokenSubscription = new Ee(this)),
							(this.beforeStateQueue = new ye(this)),
							(this.redirectUser = null),
							(this.isProactiveRefreshEnabled = !1),
							(this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1),
							(this._canInitEmulator = !0),
							(this._isInitialized = !1),
							(this._deleted = !1),
							(this._initializationPromise = null),
							(this._popupRedirectResolver = null),
							(this._errorFactory = u),
							(this._agentRecaptchaConfig = null),
							(this._tenantRecaptchaConfigs = {}),
							(this._projectPasswordPolicy = null),
							(this._tenantPasswordPolicies = {}),
							(this.lastNotifiedUid = void 0),
							(this.languageCode = null),
							(this.tenantId = null),
							(this.settings = { appVerificationDisabledForTesting: !1 }),
							(this.frameworks = []),
							(this.name = e.name),
							(this.clientVersion = r.sdkClientVersion);
					}
					_initializeWithPersistence(e, t) {
						return (
							t && (this._popupRedirectResolver = re(t)),
							(this._initializationPromise = this.queue(async () => {
								var n, r;
								if (!this._deleted && ((this.persistenceManager = await ae.create(this, e)), !this._deleted)) {
									if (null === (n = this._popupRedirectResolver) || void 0 === n ? void 0 : n._shouldInitProactively)
										try {
											await this._popupRedirectResolver._initialize(this);
										} catch (e) {}
									await this.initializeCurrentUser(t), (this.lastNotifiedUid = (null === (r = this.currentUser) || void 0 === r ? void 0 : r.uid) || null), this._deleted || (this._isInitialized = !0);
								}
							})),
							this._initializationPromise
						);
					}
					async _onStorageEvent() {
						if (this._deleted) return;
						const e = await this.assertedPersistence.getCurrentUser();
						return this.currentUser || e ? (this.currentUser && e && this.currentUser.uid === e.uid ? (this._currentUser._assign(e), void (await this.currentUser.getIdToken())) : void (await this._updateCurrentUser(e, !0))) : void 0;
					}
					async initializeCurrentUserFromIdToken(e) {
						try {
							const t = await W(this, { idToken: e }),
								n = await te._fromGetAccountInfoResponse(this, t, e);
							await this.directlySetCurrentUser(n);
						} catch (e) {
							console.warn("FirebaseServerApp could not login user with provided authIdToken: ", e), await this.directlySetCurrentUser(null);
						}
					}
					async initializeCurrentUser(e) {
						var t;
						if (r._isFirebaseServerApp(this.app)) {
							const e = this.app.settings.authIdToken;
							return e
								? new Promise((t) => {
										setTimeout(() => this.initializeCurrentUserFromIdToken(e).then(t, t));
								  })
								: this.directlySetCurrentUser(null);
						}
						const n = await this.assertedPersistence.getCurrentUser();
						let i = n,
							o = !1;
						if (e && this.config.authDomain) {
							await this.getOrInitRedirectPersistenceManager();
							const n = null === (t = this.redirectUser) || void 0 === t ? void 0 : t._redirectEventId,
								r = null == i ? void 0 : i._redirectEventId,
								s = await this.tryRedirectSignIn(e);
							(n && n !== r) || !(null == s ? void 0 : s.user) || ((i = s.user), (o = !0));
						}
						if (!i) return this.directlySetCurrentUser(null);
						if (!i._redirectEventId) {
							if (o)
								try {
									await this.beforeStateQueue.runMiddleware(i);
								} catch (e) {
									(i = n), this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
								}
							return i ? this.reloadAndSetCurrentUserOrClear(i) : this.directlySetCurrentUser(null);
						}
						return _(this._popupRedirectResolver, this, "argument-error"), await this.getOrInitRedirectPersistenceManager(), this.redirectUser && this.redirectUser._redirectEventId === i._redirectEventId ? this.directlySetCurrentUser(i) : this.reloadAndSetCurrentUserOrClear(i);
					}
					async tryRedirectSignIn(e) {
						let t = null;
						try {
							t = await this._popupRedirectResolver._completeRedirectFn(this, e, !0);
						} catch (e) {
							await this._setRedirectUser(null);
						}
						return t;
					}
					async reloadAndSetCurrentUserOrClear(e) {
						try {
							await Y(e);
						} catch (e) {
							if ("auth/network-request-failed" !== (null == e ? void 0 : e.code)) return this.directlySetCurrentUser(null);
						}
						return this.directlySetCurrentUser(e);
					}
					useDeviceLanguage() {
						this.languageCode = (function () {
							if ("undefined" == typeof navigator) return null;
							const e = navigator;
							return (e.languages && e.languages[0]) || e.language || null;
						})();
					}
					async _delete() {
						this._deleted = !0;
					}
					async updateCurrentUser(e) {
						if (r._isFirebaseServerApp(this.app)) return Promise.reject(m(this));
						const t = e ? i.getModularInstance(e) : null;
						return t && _(t.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token"), this._updateCurrentUser(t && t._clone(this));
					}
					async _updateCurrentUser(e, t = !1) {
						if (!this._deleted)
							return (
								e && _(this.tenantId === e.tenantId, this, "tenant-id-mismatch"),
								t || (await this.beforeStateQueue.runMiddleware(e)),
								this.queue(async () => {
									await this.directlySetCurrentUser(e), this.notifyAuthListeners();
								})
							);
					}
					async signOut() {
						return r._isFirebaseServerApp(this.app) ? Promise.reject(m(this)) : (await this.beforeStateQueue.runMiddleware(null), (this.redirectPersistenceManager || this._popupRedirectResolver) && (await this._setRedirectUser(null)), this._updateCurrentUser(null, !0));
					}
					setPersistence(e) {
						return r._isFirebaseServerApp(this.app)
							? Promise.reject(m(this))
							: this.queue(async () => {
									await this.assertedPersistence.setPersistence(re(e));
							  });
					}
					_getRecaptchaConfig() {
						return null == this.tenantId ? this._agentRecaptchaConfig : this._tenantRecaptchaConfigs[this.tenantId];
					}
					async validatePassword(e) {
						this._getPasswordPolicyInternal() || (await this._updatePasswordPolicy());
						const t = this._getPasswordPolicyInternal();
						return t.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION ? Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {})) : t.validatePassword(e);
					}
					_getPasswordPolicyInternal() {
						return null === this.tenantId ? this._projectPasswordPolicy : this._tenantPasswordPolicies[this.tenantId];
					}
					async _updatePasswordPolicy() {
						const e = await (async function (e, t = {}) {
								return C(e, "GET", "/v2/passwordPolicy", k(e, t));
							})(this),
							t = new Ie(e);
						null === this.tenantId ? (this._projectPasswordPolicy = t) : (this._tenantPasswordPolicies[this.tenantId] = t);
					}
					_getPersistence() {
						return this.assertedPersistence.persistence.type;
					}
					_updateErrorMap(e) {
						this._errorFactory = new i.ErrorFactory("auth", "Firebase", e());
					}
					onAuthStateChanged(e, t, n) {
						return this.registerStateListener(this.authStateSubscription, e, t, n);
					}
					beforeAuthStateChanged(e, t) {
						return this.beforeStateQueue.pushCallback(e, t);
					}
					onIdTokenChanged(e, t, n) {
						return this.registerStateListener(this.idTokenSubscription, e, t, n);
					}
					authStateReady() {
						return new Promise((e, t) => {
							if (this.currentUser) e();
							else {
								const n = this.onAuthStateChanged(() => {
									n(), e();
								}, t);
							}
						});
					}
					async revokeAccessToken(e) {
						if (this.currentUser) {
							const t = { providerId: "apple.com", tokenType: "ACCESS_TOKEN", token: e, idToken: await this.currentUser.getIdToken() };
							null != this.tenantId && (t.tenantId = this.tenantId),
								await (async function (e, t) {
									return C(e, "POST", "/v2/accounts:revokeToken", k(e, t));
								})(this, t);
						}
					}
					toJSON() {
						var e;
						return { apiKey: this.config.apiKey, authDomain: this.config.authDomain, appName: this.name, currentUser: null === (e = this._currentUser) || void 0 === e ? void 0 : e.toJSON() };
					}
					async _setRedirectUser(e, t) {
						const n = await this.getOrInitRedirectPersistenceManager(t);
						return null === e ? n.removeCurrentUser() : n.setCurrentUser(e);
					}
					async getOrInitRedirectPersistenceManager(e) {
						if (!this.redirectPersistenceManager) {
							const t = (e && re(e)) || this._popupRedirectResolver;
							_(t, this, "argument-error"), (this.redirectPersistenceManager = await ae.create(this, [re(t._redirectPersistence)], "redirectUser")), (this.redirectUser = await this.redirectPersistenceManager.getCurrentUser());
						}
						return this.redirectPersistenceManager;
					}
					async _redirectUserForId(e) {
						var t, n;
						return this._isInitialized && (await this.queue(async () => {})), (null === (t = this._currentUser) || void 0 === t ? void 0 : t._redirectEventId) === e ? this._currentUser : (null === (n = this.redirectUser) || void 0 === n ? void 0 : n._redirectEventId) === e ? this.redirectUser : null;
					}
					async _persistUserIfCurrent(e) {
						if (e === this.currentUser) return this.queue(async () => this.directlySetCurrentUser(e));
					}
					_notifyListenersIfCurrent(e) {
						e === this.currentUser && this.notifyAuthListeners();
					}
					_key() {
						return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
					}
					_startProactiveRefresh() {
						(this.isProactiveRefreshEnabled = !0), this.currentUser && this._currentUser._startProactiveRefresh();
					}
					_stopProactiveRefresh() {
						(this.isProactiveRefreshEnabled = !1), this.currentUser && this._currentUser._stopProactiveRefresh();
					}
					get _currentUser() {
						return this.currentUser;
					}
					notifyAuthListeners() {
						var e, t;
						if (!this._isInitialized) return;
						this.idTokenSubscription.next(this.currentUser);
						const n = null !== (t = null === (e = this.currentUser) || void 0 === e ? void 0 : e.uid) && void 0 !== t ? t : null;
						this.lastNotifiedUid !== n && ((this.lastNotifiedUid = n), this.authStateSubscription.next(this.currentUser));
					}
					registerStateListener(e, t, n, r) {
						if (this._deleted) return () => {};
						const i = "function" == typeof t ? t : t.next.bind(t);
						let o = !1;
						const s = this._isInitialized ? Promise.resolve() : this._initializationPromise;
						if (
							(_(s, this, "internal-error"),
							s.then(() => {
								o || i(this.currentUser);
							}),
							"function" == typeof t)
						) {
							const i = e.addObserver(t, n, r);
							return () => {
								(o = !0), i();
							};
						}
						{
							const n = e.addObserver(t);
							return () => {
								(o = !0), n();
							};
						}
					}
					async directlySetCurrentUser(e) {
						this.currentUser && this.currentUser !== e && this._currentUser._stopProactiveRefresh(), e && this.isProactiveRefreshEnabled && e._startProactiveRefresh(), (this.currentUser = e), e ? await this.assertedPersistence.setCurrentUser(e) : await this.assertedPersistence.removeCurrentUser();
					}
					queue(e) {
						return (this.operations = this.operations.then(e, e)), this.operations;
					}
					get assertedPersistence() {
						return _(this.persistenceManager, this, "internal-error"), this.persistenceManager;
					}
					_logFramework(e) {
						e && !this.frameworks.includes(e) && (this.frameworks.push(e), this.frameworks.sort(), (this.clientVersion = _e(this.config.clientPlatform, this._getFrameworks())));
					}
					_getFrameworks() {
						return this.frameworks;
					}
					async _getAdditionalHeaders() {
						var e;
						const t = { "X-Client-Version": this.clientVersion };
						this.app.options.appId && (t["X-Firebase-gmpid"] = this.app.options.appId);
						const n = await (null === (e = this.heartbeatServiceProvider.getImmediate({ optional: !0 })) || void 0 === e ? void 0 : e.getHeartbeatsHeader());
						n && (t["X-Firebase-Client"] = n);
						const r = await this._getAppCheckToken();
						return r && (t["X-Firebase-AppCheck"] = r), t;
					}
					async _getAppCheckToken() {
						var e;
						const t = await (null === (e = this.appCheckServiceProvider.getImmediate({ optional: !0 })) || void 0 === e ? void 0 : e.getToken());
						return (
							(null == t ? void 0 : t.error) &&
								(function (e, ...t) {
									l.logLevel <= o.LogLevel.WARN && l.warn(`Auth (${r.SDK_VERSION}): ${e}`, ...t);
								})(`Error while retrieving App Check token: ${t.error}`),
							null == t ? void 0 : t.token
						);
					}
				}
				function be(e) {
					return i.getModularInstance(e);
				}
				class Ee {
					constructor(e) {
						(this.auth = e), (this.observer = null), (this.addObserver = i.createSubscribe((e) => (this.observer = e)));
					}
					get next() {
						return _(this.observer, this.auth, "internal-error"), this.observer.next.bind(this.observer);
					}
				}
				let Te = {
					async loadJS() {
						throw new Error("Unable to load external scripts");
					},
					recaptchaV2Script: "",
					recaptchaEnterpriseScript: "",
					gapiScript: "",
				};
				function Ae(e) {
					return Te.loadJS(e);
				}
				function Se(e) {
					return `__${e}${Math.floor(1e6 * Math.random())}`;
				}
				class Pe {
					constructor(e) {
						(this.type = "recaptcha-enterprise"), (this.auth = be(e));
					}
					async verify(e = "verify", t = !1) {
						function n(t, n, r) {
							const i = window.grecaptcha;
							x(i)
								? i.enterprise.ready(() => {
										i.enterprise
											.execute(t, { action: e })
											.then((e) => {
												n(e);
											})
											.catch(() => {
												n("NO_RECAPTCHA");
											});
								  })
								: r(Error("No reCAPTCHA enterprise script loaded."));
						}
						return new Promise((e, r) => {
							(async function (e) {
								if (!t) {
									if (null == e.tenantId && null != e._agentRecaptchaConfig) return e._agentRecaptchaConfig.siteKey;
									if (null != e.tenantId && void 0 !== e._tenantRecaptchaConfigs[e.tenantId]) return e._tenantRecaptchaConfigs[e.tenantId].siteKey;
								}
								return new Promise(async (t, n) => {
									V(e, { clientType: "CLIENT_TYPE_WEB", version: "RECAPTCHA_ENTERPRISE" })
										.then((r) => {
											if (void 0 !== r.recaptchaKey) {
												const n = new j(r);
												return null == e.tenantId ? (e._agentRecaptchaConfig = n) : (e._tenantRecaptchaConfigs[e.tenantId] = n), t(n.siteKey);
											}
											n(new Error("recaptcha Enterprise site key undefined"));
										})
										.catch((e) => {
											n(e);
										});
								});
							})(this.auth)
								.then((i) => {
									if (!t && x(window.grecaptcha)) n(i, e, r);
									else {
										if ("undefined" == typeof window) return void r(new Error("RecaptchaVerifier is only supported in browser"));
										let t = Te.recaptchaEnterpriseScript;
										0 !== t.length && (t += i),
											Ae(t)
												.then(() => {
													n(i, e, r);
												})
												.catch((e) => {
													r(e);
												});
									}
								})
								.catch((e) => {
									r(e);
								});
						});
					}
				}
				async function Oe(e, t, n, r = !1) {
					const i = new Pe(e);
					let o;
					try {
						o = await i.verify(n);
					} catch (e) {
						o = await i.verify(n, !0);
					}
					const s = Object.assign({}, t);
					return r ? Object.assign(s, { captchaResp: o }) : Object.assign(s, { captchaResponse: o }), Object.assign(s, { clientType: "CLIENT_TYPE_WEB" }), Object.assign(s, { recaptchaVersion: "RECAPTCHA_ENTERPRISE" }), s;
				}
				async function ke(e, t, n, r) {
					var i;
					if (null === (i = e._getRecaptchaConfig()) || void 0 === i ? void 0 : i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")) {
						const i = await Oe(e, t, n, "getOobCode" === n);
						return r(e, i);
					}
					return r(e, t).catch(async (i) => {
						if ("auth/missing-recaptcha-token" === i.code) {
							console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
							const i = await Oe(e, t, n, "getOobCode" === n);
							return r(e, i);
						}
						return Promise.reject(i);
					});
				}
				function Ce(e, t) {
					const n = r._getProvider(e, "auth");
					if (n.isInitialized()) {
						const e = n.getImmediate(),
							r = n.getOptions();
						if (i.deepEqual(r, null != t ? t : {})) return e;
						h(e, "already-initialized");
					}
					return n.initialize({ options: t });
				}
				function Re(e, t, n) {
					const r = be(e);
					_(r._canInitEmulator, r, "emulator-config-failed"), _(/^https?:\/\//.test(t), r, "invalid-emulator-scheme");
					const i = !!(null == n ? void 0 : n.disableWarnings),
						o = Ne(t),
						{ host: s, port: a } = (function (e) {
							const t = Ne(e),
								n = /(\/\/)?([^?#/]+)/.exec(e.substr(t.length));
							if (!n) return { host: "", port: null };
							const r = n[2].split("@").pop() || "",
								i = /^(\[[^\]]+\])(:|$)/.exec(r);
							if (i) {
								const e = i[1];
								return { host: e, port: De(r.substr(e.length + 1)) };
							}
							{
								const [e, t] = r.split(":");
								return { host: e, port: De(t) };
							}
						})(t),
						c = null === a ? "" : `:${a}`;
					(r.config.emulator = { url: `${o}//${s}${c}/` }),
						(r.settings.appVerificationDisabledForTesting = !0),
						(r.emulatorConfig = Object.freeze({ host: s, port: a, protocol: o.replace(":", ""), options: Object.freeze({ disableWarnings: i }) })),
						i ||
							(function () {
								function e() {
									const e = document.createElement("p"),
										t = e.style;
									(e.innerText = "Running in emulator mode. Do not use with production credentials."), (t.position = "fixed"), (t.width = "100%"), (t.backgroundColor = "#ffffff"), (t.border = ".1em solid #000000"), (t.color = "#b50000"), (t.bottom = "0px"), (t.left = "0px"), (t.margin = "0px"), (t.zIndex = "10000"), (t.textAlign = "center"), e.classList.add("firebase-emulator-warning"), document.body.appendChild(e);
								}
								"undefined" != typeof console && "function" == typeof console.info && console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."), "undefined" != typeof window && "undefined" != typeof document && ("loading" === document.readyState ? window.addEventListener("DOMContentLoaded", e) : e());
							})();
				}
				function Ne(e) {
					const t = e.indexOf(":");
					return t < 0 ? "" : e.substr(0, t + 1);
				}
				function De(e) {
					if (!e) return null;
					const t = Number(e);
					return isNaN(t) ? null : t;
				}
				class Le {
					constructor(e, t) {
						(this.providerId = e), (this.signInMethod = t);
					}
					toJSON() {
						return y("not implemented");
					}
					_getIdTokenResponse(e) {
						return y("not implemented");
					}
					_linkToIdToken(e, t) {
						return y("not implemented");
					}
					_getReauthenticationResolver(e) {
						return y("not implemented");
					}
				}
				async function Me(e, t) {
					return C(e, "POST", "/v1/accounts:resetPassword", k(e, t));
				}
				async function Ue(e, t) {
					return C(e, "POST", "/v1/accounts:signUp", t);
				}
				async function Fe(e, t) {
					return N(e, "POST", "/v1/accounts:signInWithPassword", k(e, t));
				}
				async function xe(e, t) {
					return C(e, "POST", "/v1/accounts:sendOobCode", k(e, t));
				}
				async function je(e, t) {
					return xe(e, t);
				}
				async function Ve(e, t) {
					return xe(e, t);
				}
				class We extends Le {
					constructor(e, t, n, r = null) {
						super("password", n), (this._email = e), (this._password = t), (this._tenantId = r);
					}
					static _fromEmailAndPassword(e, t) {
						return new We(e, t, "password");
					}
					static _fromEmailAndCode(e, t, n = null) {
						return new We(e, t, "emailLink", n);
					}
					toJSON() {
						return { email: this._email, password: this._password, signInMethod: this.signInMethod, tenantId: this._tenantId };
					}
					static fromJSON(e) {
						const t = "string" == typeof e ? JSON.parse(e) : e;
						if ((null == t ? void 0 : t.email) && (null == t ? void 0 : t.password)) {
							if ("password" === t.signInMethod) return this._fromEmailAndPassword(t.email, t.password);
							if ("emailLink" === t.signInMethod) return this._fromEmailAndCode(t.email, t.password, t.tenantId);
						}
						return null;
					}
					async _getIdTokenResponse(e) {
						switch (this.signInMethod) {
							case "password":
								return ke(e, { returnSecureToken: !0, email: this._email, password: this._password, clientType: "CLIENT_TYPE_WEB" }, "signInWithPassword", Fe);
							case "emailLink":
								return (async function (e, t) {
									return N(e, "POST", "/v1/accounts:signInWithEmailLink", k(e, t));
								})(e, { email: this._email, oobCode: this._password });
							default:
								h(e, "internal-error");
						}
					}
					async _linkToIdToken(e, t) {
						switch (this.signInMethod) {
							case "password":
								return ke(e, { idToken: t, returnSecureToken: !0, email: this._email, password: this._password, clientType: "CLIENT_TYPE_WEB" }, "signUpPassword", Ue);
							case "emailLink":
								return (async function (e, t) {
									return N(e, "POST", "/v1/accounts:signInWithEmailLink", k(e, t));
								})(e, { idToken: t, email: this._email, oobCode: this._password });
							default:
								h(e, "internal-error");
						}
					}
					_getReauthenticationResolver(e) {
						return this._getIdTokenResponse(e);
					}
				}
				async function He(e, t) {
					return N(e, "POST", "/v1/accounts:signInWithIdp", k(e, t));
				}
				class ze extends Le {
					constructor() {
						super(...arguments), (this.pendingToken = null);
					}
					static _fromParams(e) {
						const t = new ze(e.providerId, e.signInMethod);
						return e.idToken || e.accessToken ? (e.idToken && (t.idToken = e.idToken), e.accessToken && (t.accessToken = e.accessToken), e.nonce && !e.pendingToken && (t.nonce = e.nonce), e.pendingToken && (t.pendingToken = e.pendingToken)) : e.oauthToken && e.oauthTokenSecret ? ((t.accessToken = e.oauthToken), (t.secret = e.oauthTokenSecret)) : h("argument-error"), t;
					}
					toJSON() {
						return { idToken: this.idToken, accessToken: this.accessToken, secret: this.secret, nonce: this.nonce, pendingToken: this.pendingToken, providerId: this.providerId, signInMethod: this.signInMethod };
					}
					static fromJSON(e) {
						const t = "string" == typeof e ? JSON.parse(e) : e,
							{ providerId: n, signInMethod: r } = t,
							i = s.__rest(t, ["providerId", "signInMethod"]);
						if (!n || !r) return null;
						const o = new ze(n, r);
						return (o.idToken = i.idToken || void 0), (o.accessToken = i.accessToken || void 0), (o.secret = i.secret), (o.nonce = i.nonce), (o.pendingToken = i.pendingToken || null), o;
					}
					_getIdTokenResponse(e) {
						return He(e, this.buildRequest());
					}
					_linkToIdToken(e, t) {
						const n = this.buildRequest();
						return (n.idToken = t), He(e, n);
					}
					_getReauthenticationResolver(e) {
						const t = this.buildRequest();
						return (t.autoCreate = !1), He(e, t);
					}
					buildRequest() {
						const e = { requestUri: "http://localhost", returnSecureToken: !0 };
						if (this.pendingToken) e.pendingToken = this.pendingToken;
						else {
							const t = {};
							this.idToken && (t.id_token = this.idToken), this.accessToken && (t.access_token = this.accessToken), this.secret && (t.oauth_token_secret = this.secret), (t.providerId = this.providerId), this.nonce && !this.pendingToken && (t.nonce = this.nonce), (e.postBody = i.querystring(t));
						}
						return e;
					}
				}
				const Be = { USER_NOT_FOUND: "user-not-found" };
				class qe extends Le {
					constructor(e) {
						super("phone", "phone"), (this.params = e);
					}
					static _fromVerification(e, t) {
						return new qe({ verificationId: e, verificationCode: t });
					}
					static _fromTokenResponse(e, t) {
						return new qe({ phoneNumber: e, temporaryProof: t });
					}
					_getIdTokenResponse(e) {
						return (async function (e, t) {
							return N(e, "POST", "/v1/accounts:signInWithPhoneNumber", k(e, t));
						})(e, this._makeVerificationRequest());
					}
					_linkToIdToken(e, t) {
						return (async function (e, t) {
							const n = await N(e, "POST", "/v1/accounts:signInWithPhoneNumber", k(e, t));
							if (n.temporaryProof) throw U(e, "account-exists-with-different-credential", n);
							return n;
						})(e, Object.assign({ idToken: t }, this._makeVerificationRequest()));
					}
					_getReauthenticationResolver(e) {
						return (async function (e, t) {
							return N(e, "POST", "/v1/accounts:signInWithPhoneNumber", k(e, Object.assign(Object.assign({}, t), { operation: "REAUTH" })), Be);
						})(e, this._makeVerificationRequest());
					}
					_makeVerificationRequest() {
						const { temporaryProof: e, phoneNumber: t, verificationId: n, verificationCode: r } = this.params;
						return e && t ? { temporaryProof: e, phoneNumber: t } : { sessionInfo: n, code: r };
					}
					toJSON() {
						const e = { providerId: this.providerId };
						return this.params.phoneNumber && (e.phoneNumber = this.params.phoneNumber), this.params.temporaryProof && (e.temporaryProof = this.params.temporaryProof), this.params.verificationCode && (e.verificationCode = this.params.verificationCode), this.params.verificationId && (e.verificationId = this.params.verificationId), e;
					}
					static fromJSON(e) {
						"string" == typeof e && (e = JSON.parse(e));
						const { verificationId: t, verificationCode: n, phoneNumber: r, temporaryProof: i } = e;
						return n || t || r || i ? new qe({ verificationId: t, verificationCode: n, phoneNumber: r, temporaryProof: i }) : null;
					}
				}
				class Ge {
					constructor(e) {
						var t, n, r, o, s, a;
						const c = i.querystringDecode(i.extractQuerystring(e)),
							u = null !== (t = c.apiKey) && void 0 !== t ? t : null,
							l = null !== (n = c.oobCode) && void 0 !== n ? n : null,
							d = (function (e) {
								switch (e) {
									case "recoverEmail":
										return "RECOVER_EMAIL";
									case "resetPassword":
										return "PASSWORD_RESET";
									case "signIn":
										return "EMAIL_SIGNIN";
									case "verifyEmail":
										return "VERIFY_EMAIL";
									case "verifyAndChangeEmail":
										return "VERIFY_AND_CHANGE_EMAIL";
									case "revertSecondFactorAddition":
										return "REVERT_SECOND_FACTOR_ADDITION";
									default:
										return null;
								}
							})(null !== (r = c.mode) && void 0 !== r ? r : null);
						_(u && l && d, "argument-error"), (this.apiKey = u), (this.operation = d), (this.code = l), (this.continueUrl = null !== (o = c.continueUrl) && void 0 !== o ? o : null), (this.languageCode = null !== (s = c.languageCode) && void 0 !== s ? s : null), (this.tenantId = null !== (a = c.tenantId) && void 0 !== a ? a : null);
					}
					static parseLink(e) {
						const t = (function (e) {
							const t = i.querystringDecode(i.extractQuerystring(e)).link,
								n = t ? i.querystringDecode(i.extractQuerystring(t)).deep_link_id : null,
								r = i.querystringDecode(i.extractQuerystring(e)).deep_link_id;
							return (r ? i.querystringDecode(i.extractQuerystring(r)).link : null) || r || n || t || e;
						})(e);
						try {
							return new Ge(t);
						} catch (e) {
							return null;
						}
					}
				}
				class Ke {
					constructor() {
						this.providerId = Ke.PROVIDER_ID;
					}
					static credential(e, t) {
						return We._fromEmailAndPassword(e, t);
					}
					static credentialWithLink(e, t) {
						const n = Ge.parseLink(t);
						return _(n, "argument-error"), We._fromEmailAndCode(e, n.code, n.tenantId);
					}
				}
				(Ke.PROVIDER_ID = "password"), (Ke.EMAIL_PASSWORD_SIGN_IN_METHOD = "password"), (Ke.EMAIL_LINK_SIGN_IN_METHOD = "emailLink");
				class $e {
					constructor(e) {
						(this.providerId = e), (this.defaultLanguageCode = null), (this.customParameters = {});
					}
					setDefaultLanguage(e) {
						this.defaultLanguageCode = e;
					}
					setCustomParameters(e) {
						return (this.customParameters = e), this;
					}
					getCustomParameters() {
						return this.customParameters;
					}
				}
				class Je extends $e {
					constructor() {
						super(...arguments), (this.scopes = []);
					}
					addScope(e) {
						return this.scopes.includes(e) || this.scopes.push(e), this;
					}
					getScopes() {
						return [...this.scopes];
					}
				}
				class Ye extends Je {
					static credentialFromJSON(e) {
						const t = "string" == typeof e ? JSON.parse(e) : e;
						return _("providerId" in t && "signInMethod" in t, "argument-error"), ze._fromParams(t);
					}
					credential(e) {
						return this._credential(Object.assign(Object.assign({}, e), { nonce: e.rawNonce }));
					}
					_credential(e) {
						return _(e.idToken || e.accessToken, "argument-error"), ze._fromParams(Object.assign(Object.assign({}, e), { providerId: this.providerId, signInMethod: this.providerId }));
					}
					static credentialFromResult(e) {
						return Ye.oauthCredentialFromTaggedObject(e);
					}
					static credentialFromError(e) {
						return Ye.oauthCredentialFromTaggedObject(e.customData || {});
					}
					static oauthCredentialFromTaggedObject({ _tokenResponse: e }) {
						if (!e) return null;
						const { oauthIdToken: t, oauthAccessToken: n, oauthTokenSecret: r, pendingToken: i, nonce: o, providerId: s } = e;
						if (!(n || r || t || i)) return null;
						if (!s) return null;
						try {
							return new Ye(s)._credential({ idToken: t, accessToken: n, nonce: o, pendingToken: i });
						} catch (e) {
							return null;
						}
					}
				}
				class Xe extends Je {
					constructor() {
						super("facebook.com");
					}
					static credential(e) {
						return ze._fromParams({ providerId: Xe.PROVIDER_ID, signInMethod: Xe.FACEBOOK_SIGN_IN_METHOD, accessToken: e });
					}
					static credentialFromResult(e) {
						return Xe.credentialFromTaggedObject(e);
					}
					static credentialFromError(e) {
						return Xe.credentialFromTaggedObject(e.customData || {});
					}
					static credentialFromTaggedObject({ _tokenResponse: e }) {
						if (!e || !("oauthAccessToken" in e)) return null;
						if (!e.oauthAccessToken) return null;
						try {
							return Xe.credential(e.oauthAccessToken);
						} catch (e) {
							return null;
						}
					}
				}
				(Xe.FACEBOOK_SIGN_IN_METHOD = "facebook.com"), (Xe.PROVIDER_ID = "facebook.com");
				class Qe extends Je {
					constructor() {
						super("google.com"), this.addScope("profile");
					}
					static credential(e, t) {
						return ze._fromParams({ providerId: Qe.PROVIDER_ID, signInMethod: Qe.GOOGLE_SIGN_IN_METHOD, idToken: e, accessToken: t });
					}
					static credentialFromResult(e) {
						return Qe.credentialFromTaggedObject(e);
					}
					static credentialFromError(e) {
						return Qe.credentialFromTaggedObject(e.customData || {});
					}
					static credentialFromTaggedObject({ _tokenResponse: e }) {
						if (!e) return null;
						const { oauthIdToken: t, oauthAccessToken: n } = e;
						if (!t && !n) return null;
						try {
							return Qe.credential(t, n);
						} catch (e) {
							return null;
						}
					}
				}
				(Qe.GOOGLE_SIGN_IN_METHOD = "google.com"), (Qe.PROVIDER_ID = "google.com");
				class Ze extends Je {
					constructor() {
						super("github.com");
					}
					static credential(e) {
						return ze._fromParams({ providerId: Ze.PROVIDER_ID, signInMethod: Ze.GITHUB_SIGN_IN_METHOD, accessToken: e });
					}
					static credentialFromResult(e) {
						return Ze.credentialFromTaggedObject(e);
					}
					static credentialFromError(e) {
						return Ze.credentialFromTaggedObject(e.customData || {});
					}
					static credentialFromTaggedObject({ _tokenResponse: e }) {
						if (!e || !("oauthAccessToken" in e)) return null;
						if (!e.oauthAccessToken) return null;
						try {
							return Ze.credential(e.oauthAccessToken);
						} catch (e) {
							return null;
						}
					}
				}
				(Ze.GITHUB_SIGN_IN_METHOD = "github.com"), (Ze.PROVIDER_ID = "github.com");
				class et extends Le {
					constructor(e, t) {
						super(e, e), (this.pendingToken = t);
					}
					_getIdTokenResponse(e) {
						return He(e, this.buildRequest());
					}
					_linkToIdToken(e, t) {
						const n = this.buildRequest();
						return (n.idToken = t), He(e, n);
					}
					_getReauthenticationResolver(e) {
						const t = this.buildRequest();
						return (t.autoCreate = !1), He(e, t);
					}
					toJSON() {
						return { signInMethod: this.signInMethod, providerId: this.providerId, pendingToken: this.pendingToken };
					}
					static fromJSON(e) {
						const t = "string" == typeof e ? JSON.parse(e) : e,
							{ providerId: n, signInMethod: r, pendingToken: i } = t;
						return n && r && i && n === r ? new et(n, i) : null;
					}
					static _create(e, t) {
						return new et(e, t);
					}
					buildRequest() {
						return { requestUri: "http://localhost", returnSecureToken: !0, pendingToken: this.pendingToken };
					}
				}
				class tt extends $e {
					constructor(e) {
						_(e.startsWith("saml."), "argument-error"), super(e);
					}
					static credentialFromResult(e) {
						return tt.samlCredentialFromTaggedObject(e);
					}
					static credentialFromError(e) {
						return tt.samlCredentialFromTaggedObject(e.customData || {});
					}
					static credentialFromJSON(e) {
						const t = et.fromJSON(e);
						return _(t, "argument-error"), t;
					}
					static samlCredentialFromTaggedObject({ _tokenResponse: e }) {
						if (!e) return null;
						const { pendingToken: t, providerId: n } = e;
						if (!t || !n) return null;
						try {
							return et._create(n, t);
						} catch (e) {
							return null;
						}
					}
				}
				class nt extends Je {
					constructor() {
						super("twitter.com");
					}
					static credential(e, t) {
						return ze._fromParams({ providerId: nt.PROVIDER_ID, signInMethod: nt.TWITTER_SIGN_IN_METHOD, oauthToken: e, oauthTokenSecret: t });
					}
					static credentialFromResult(e) {
						return nt.credentialFromTaggedObject(e);
					}
					static credentialFromError(e) {
						return nt.credentialFromTaggedObject(e.customData || {});
					}
					static credentialFromTaggedObject({ _tokenResponse: e }) {
						if (!e) return null;
						const { oauthAccessToken: t, oauthTokenSecret: n } = e;
						if (!t || !n) return null;
						try {
							return nt.credential(t, n);
						} catch (e) {
							return null;
						}
					}
				}
				async function rt(e, t) {
					return N(e, "POST", "/v1/accounts:signUp", k(e, t));
				}
				(nt.TWITTER_SIGN_IN_METHOD = "twitter.com"), (nt.PROVIDER_ID = "twitter.com");
				class it {
					constructor(e) {
						(this.user = e.user), (this.providerId = e.providerId), (this._tokenResponse = e._tokenResponse), (this.operationType = e.operationType);
					}
					static async _fromIdTokenResponse(e, t, n, r = !1) {
						const i = await te._fromIdTokenResponse(e, n, r),
							o = ot(n);
						return new it({ user: i, providerId: o, _tokenResponse: n, operationType: t });
					}
					static async _forOperation(e, t, n) {
						await e._updateTokensIfNecessary(n, !0);
						const r = ot(n);
						return new it({ user: e, providerId: r, _tokenResponse: n, operationType: t });
					}
				}
				function ot(e) {
					return e.providerId ? e.providerId : "phoneNumber" in e ? "phone" : null;
				}
				class st extends i.FirebaseError {
					constructor(e, t, n, r) {
						var i;
						super(t.code, t.message), (this.operationType = n), (this.user = r), Object.setPrototypeOf(this, st.prototype), (this.customData = { appName: e.name, tenantId: null !== (i = e.tenantId) && void 0 !== i ? i : void 0, _serverResponse: t.customData._serverResponse, operationType: n });
					}
					static _fromErrorAndOperation(e, t, n, r) {
						return new st(e, t, n, r);
					}
				}
				function at(e, t, n, r) {
					return ("reauthenticate" === t ? n._getReauthenticationResolver(e) : n._getIdTokenResponse(e)).catch((n) => {
						if ("auth/multi-factor-auth-required" === n.code) throw st._fromErrorAndOperation(e, n, t, r);
						throw n;
					});
				}
				function ct(e) {
					return new Set(e.map(({ providerId: e }) => e).filter((e) => !!e));
				}
				async function ut(e, t, n = !1) {
					const r = await K(e, t._linkToIdToken(e.auth, await e.getIdToken()), n);
					return it._forOperation(e, "link", r);
				}
				async function lt(e, t, n) {
					await Y(t);
					const r = !1 === e ? "provider-already-linked" : "no-such-provider";
					_(ct(t.providerData).has(n) === e, t.auth, r);
				}
				async function dt(e, t, n = !1) {
					const { auth: i } = e;
					if (r._isFirebaseServerApp(i.app)) return Promise.reject(m(i));
					const o = "reauthenticate";
					try {
						const r = await K(e, at(i, o, t, e), n);
						_(r.idToken, i, "internal-error");
						const s = q(r.idToken);
						_(s, i, "internal-error");
						const { sub: a } = s;
						return _(e.uid === a, i, "user-mismatch"), it._forOperation(e, o, r);
					} catch (e) {
						throw ("auth/user-not-found" === (null == e ? void 0 : e.code) && h(i, "user-mismatch"), e);
					}
				}
				async function ht(e, t, n = !1) {
					if (r._isFirebaseServerApp(e.app)) return Promise.reject(m(e));
					const i = "signIn",
						o = await at(e, i, t),
						s = await it._fromIdTokenResponse(e, i, o);
					return n || (await e._updateCurrentUser(s.user)), s;
				}
				async function pt(e, t) {
					return ht(be(e), t);
				}
				async function ft(e, t) {
					const n = i.getModularInstance(e);
					return await lt(!1, n, t.providerId), ut(n, t);
				}
				async function mt(e, t) {
					return dt(i.getModularInstance(e), t);
				}
				class gt {
					constructor(e, t) {
						(this.factorId = e), (this.uid = t.mfaEnrollmentId), (this.enrollmentTime = new Date(t.enrolledAt).toUTCString()), (this.displayName = t.displayName);
					}
					static _fromServerResponse(e, t) {
						return "phoneInfo" in t ? vt._fromServerResponse(e, t) : "totpInfo" in t ? _t._fromServerResponse(e, t) : h(e, "internal-error");
					}
				}
				class vt extends gt {
					constructor(e) {
						super("phone", e), (this.phoneNumber = e.phoneInfo);
					}
					static _fromServerResponse(e, t) {
						return new vt(t);
					}
				}
				class _t extends gt {
					constructor(e) {
						super("totp", e);
					}
					static _fromServerResponse(e, t) {
						return new _t(t);
					}
				}
				function yt(e, t, n) {
					var r;
					_((null === (r = n.url) || void 0 === r ? void 0 : r.length) > 0, e, "invalid-continue-uri"), _(void 0 === n.dynamicLinkDomain || n.dynamicLinkDomain.length > 0, e, "invalid-dynamic-link-domain"), (t.continueUrl = n.url), (t.dynamicLinkDomain = n.dynamicLinkDomain), (t.canHandleCodeInApp = n.handleCodeInApp), n.iOS && (_(n.iOS.bundleId.length > 0, e, "missing-ios-bundle-id"), (t.iOSBundleId = n.iOS.bundleId)), n.android && (_(n.android.packageName.length > 0, e, "missing-android-pkg-name"), (t.androidInstallApp = n.android.installApp), (t.androidMinimumVersionCode = n.android.minimumVersion), (t.androidPackageName = n.android.packageName));
				}
				async function It(e) {
					const t = be(e);
					t._getPasswordPolicyInternal() && (await t._updatePasswordPolicy());
				}
				async function wt(e, t) {
					const n = i.getModularInstance(e),
						r = await Me(n, { oobCode: t }),
						o = r.requestType;
					switch ((_(o, n, "internal-error"), o)) {
						case "EMAIL_SIGNIN":
							break;
						case "VERIFY_AND_CHANGE_EMAIL":
							_(r.newEmail, n, "internal-error");
							break;
						case "REVERT_SECOND_FACTOR_ADDITION":
							_(r.mfaInfo, n, "internal-error");
						default:
							_(r.email, n, "internal-error");
					}
					let s = null;
					return r.mfaInfo && (s = gt._fromServerResponse(be(n), r.mfaInfo)), { data: { email: ("VERIFY_AND_CHANGE_EMAIL" === r.requestType ? r.newEmail : r.email) || null, previousEmail: ("VERIFY_AND_CHANGE_EMAIL" === r.requestType ? r.email : r.newEmail) || null, multiFactorInfo: s }, operation: o };
				}
				async function bt(e, t, n) {
					const { auth: r } = e,
						i = { idToken: await e.getIdToken(), returnSecureToken: !0 };
					t && (i.email = t), n && (i.password = n);
					const o = await K(
						e,
						(async function (e, t) {
							return C(e, "POST", "/v1/accounts:update", t);
						})(r, i)
					);
					await e._updateTokensIfNecessary(o, !0);
				}
				class Et {
					constructor(e, t, n = {}) {
						(this.isNewUser = e), (this.providerId = t), (this.profile = n);
					}
				}
				class Tt extends Et {
					constructor(e, t, n, r) {
						super(e, t, n), (this.username = r);
					}
				}
				class At extends Et {
					constructor(e, t) {
						super(e, "facebook.com", t);
					}
				}
				class St extends Tt {
					constructor(e, t) {
						super(e, "github.com", t, "string" == typeof (null == t ? void 0 : t.login) ? (null == t ? void 0 : t.login) : null);
					}
				}
				class Pt extends Et {
					constructor(e, t) {
						super(e, "google.com", t);
					}
				}
				class Ot extends Tt {
					constructor(e, t, n) {
						super(e, "twitter.com", t, n);
					}
				}
				function kt(e, t, n, r) {
					return i.getModularInstance(e).onIdTokenChanged(t, n, r);
				}
				function Ct(e, t, n) {
					return i.getModularInstance(e).beforeAuthStateChanged(t, n);
				}
				class Rt {
					constructor(e, t, n) {
						(this.type = e), (this.credential = t), (this.user = n);
					}
					static _fromIdtoken(e, t) {
						return new Rt("enroll", e, t);
					}
					static _fromMfaPendingCredential(e) {
						return new Rt("signin", e);
					}
					toJSON() {
						const e = "enroll" === this.type ? "idToken" : "pendingCredential";
						return { multiFactorSession: { [e]: this.credential } };
					}
					static fromJSON(e) {
						var t, n;
						if (null == e ? void 0 : e.multiFactorSession) {
							if (null === (t = e.multiFactorSession) || void 0 === t ? void 0 : t.pendingCredential) return Rt._fromMfaPendingCredential(e.multiFactorSession.pendingCredential);
							if (null === (n = e.multiFactorSession) || void 0 === n ? void 0 : n.idToken) return Rt._fromIdtoken(e.multiFactorSession.idToken);
						}
						return null;
					}
				}
				class Nt {
					constructor(e, t, n) {
						(this.session = e), (this.hints = t), (this.signInResolver = n);
					}
					static _fromError(e, t) {
						const n = be(e),
							r = t.customData._serverResponse,
							i = (r.mfaInfo || []).map((e) => gt._fromServerResponse(n, e));
						_(r.mfaPendingCredential, n, "internal-error");
						const o = Rt._fromMfaPendingCredential(r.mfaPendingCredential);
						return new Nt(o, i, async (e) => {
							const i = await e._process(n, o);
							delete r.mfaInfo, delete r.mfaPendingCredential;
							const s = Object.assign(Object.assign({}, r), { idToken: i.idToken, refreshToken: i.refreshToken });
							switch (t.operationType) {
								case "signIn":
									const e = await it._fromIdTokenResponse(n, t.operationType, s);
									return await n._updateCurrentUser(e.user), e;
								case "reauthenticate":
									return _(t.user, n, "internal-error"), it._forOperation(t.user, t.operationType, s);
								default:
									h(n, "internal-error");
							}
						});
					}
					async resolveSignIn(e) {
						const t = e;
						return this.signInResolver(t);
					}
				}
				class Dt {
					constructor(e) {
						(this.user = e),
							(this.enrolledFactors = []),
							e._onReload((t) => {
								t.mfaInfo && (this.enrolledFactors = t.mfaInfo.map((t) => gt._fromServerResponse(e.auth, t)));
							});
					}
					static _fromUser(e) {
						return new Dt(e);
					}
					async getSession() {
						return Rt._fromIdtoken(await this.user.getIdToken(), this.user);
					}
					async enroll(e, t) {
						const n = e,
							r = await this.getSession(),
							i = await K(this.user, n._process(this.user.auth, r, t));
						return await this.user._updateTokensIfNecessary(i), this.user.reload();
					}
					async unenroll(e) {
						const t = "string" == typeof e ? e : e.uid,
							n = await this.user.getIdToken();
						try {
							const e = await K(this.user, ((r = this.user.auth), (i = { idToken: n, mfaEnrollmentId: t }), C(r, "POST", "/v2/accounts/mfaEnrollment:withdraw", k(r, i))));
							(this.enrolledFactors = this.enrolledFactors.filter(({ uid: e }) => e !== t)), await this.user._updateTokensIfNecessary(e), await this.user.reload();
						} catch (e) {
							throw e;
						}
						var r, i;
					}
				}
				const Lt = new WeakMap(),
					Mt = "__sak";
				class Ut {
					constructor(e, t) {
						(this.storageRetriever = e), (this.type = t);
					}
					_isAvailable() {
						try {
							return this.storage ? (this.storage.setItem(Mt, "1"), this.storage.removeItem(Mt), Promise.resolve(!0)) : Promise.resolve(!1);
						} catch (e) {
							return Promise.resolve(!1);
						}
					}
					_set(e, t) {
						return this.storage.setItem(e, JSON.stringify(t)), Promise.resolve();
					}
					_get(e) {
						const t = this.storage.getItem(e);
						return Promise.resolve(t ? JSON.parse(t) : null);
					}
					_remove(e) {
						return this.storage.removeItem(e), Promise.resolve();
					}
					get storage() {
						return this.storageRetriever();
					}
				}
				class Ft extends Ut {
					constructor() {
						super(() => window.localStorage, "LOCAL"),
							(this.boundEventHandler = (e, t) => this.onStorageEvent(e, t)),
							(this.listeners = {}),
							(this.localCache = {}),
							(this.pollTimer = null),
							(this.safariLocalStorageNotSynced =
								(function () {
									const e = i.getUA();
									return le(e) || ge(e);
								})() &&
								(function () {
									try {
										return !(!window || window === window.top);
									} catch (e) {
										return !1;
									}
								})()),
							(this.fallbackToPolling = ve()),
							(this._shouldAllowMigration = !0);
					}
					forAllChangedKeys(e) {
						for (const t of Object.keys(this.listeners)) {
							const n = this.storage.getItem(t),
								r = this.localCache[t];
							n !== r && e(t, r, n);
						}
					}
					onStorageEvent(e, t = !1) {
						if (!e.key)
							return void this.forAllChangedKeys((e, t, n) => {
								this.notifyListeners(e, n);
							});
						const n = e.key;
						if ((t ? this.detachListener() : this.stopPolling(), this.safariLocalStorageNotSynced)) {
							const r = this.storage.getItem(n);
							if (e.newValue !== r) null !== e.newValue ? this.storage.setItem(n, e.newValue) : this.storage.removeItem(n);
							else if (this.localCache[n] === e.newValue && !t) return;
						}
						const r = () => {
								const e = this.storage.getItem(n);
								(t || this.localCache[n] !== e) && this.notifyListeners(n, e);
							},
							o = this.storage.getItem(n);
						i.isIE() && 10 === document.documentMode && o !== e.newValue && e.newValue !== e.oldValue ? setTimeout(r, 10) : r();
					}
					notifyListeners(e, t) {
						this.localCache[e] = t;
						const n = this.listeners[e];
						if (n) for (const e of Array.from(n)) e(t ? JSON.parse(t) : t);
					}
					startPolling() {
						this.stopPolling(),
							(this.pollTimer = setInterval(() => {
								this.forAllChangedKeys((e, t, n) => {
									this.onStorageEvent(new StorageEvent("storage", { key: e, oldValue: t, newValue: n }), !0);
								});
							}, 1e3));
					}
					stopPolling() {
						this.pollTimer && (clearInterval(this.pollTimer), (this.pollTimer = null));
					}
					attachListener() {
						window.addEventListener("storage", this.boundEventHandler);
					}
					detachListener() {
						window.removeEventListener("storage", this.boundEventHandler);
					}
					_addListener(e, t) {
						0 === Object.keys(this.listeners).length && (this.fallbackToPolling ? this.startPolling() : this.attachListener()), this.listeners[e] || ((this.listeners[e] = new Set()), (this.localCache[e] = this.storage.getItem(e))), this.listeners[e].add(t);
					}
					_removeListener(e, t) {
						this.listeners[e] && (this.listeners[e].delete(t), 0 === this.listeners[e].size && delete this.listeners[e]), 0 === Object.keys(this.listeners).length && (this.detachListener(), this.stopPolling());
					}
					async _set(e, t) {
						await super._set(e, t), (this.localCache[e] = JSON.stringify(t));
					}
					async _get(e) {
						const t = await super._get(e);
						return (this.localCache[e] = JSON.stringify(t)), t;
					}
					async _remove(e) {
						await super._remove(e), delete this.localCache[e];
					}
				}
				Ft.type = "LOCAL";
				const xt = Ft;
				class jt extends Ut {
					constructor() {
						super(() => window.sessionStorage, "SESSION");
					}
					_addListener(e, t) {}
					_removeListener(e, t) {}
				}
				jt.type = "SESSION";
				const Vt = jt;
				class Wt {
					constructor(e) {
						(this.eventTarget = e), (this.handlersMap = {}), (this.boundEventHandler = this.handleEvent.bind(this));
					}
					static _getInstance(e) {
						const t = this.receivers.find((t) => t.isListeningto(e));
						if (t) return t;
						const n = new Wt(e);
						return this.receivers.push(n), n;
					}
					isListeningto(e) {
						return this.eventTarget === e;
					}
					async handleEvent(e) {
						const t = e,
							{ eventId: n, eventType: r, data: i } = t.data,
							o = this.handlersMap[r];
						if (!(null == o ? void 0 : o.size)) return;
						t.ports[0].postMessage({ status: "ack", eventId: n, eventType: r });
						const s = Array.from(o).map(async (e) => e(t.origin, i)),
							a = await (function (e) {
								return Promise.all(
									e.map(async (e) => {
										try {
											return { fulfilled: !0, value: await e };
										} catch (e) {
											return { fulfilled: !1, reason: e };
										}
									})
								);
							})(s);
						t.ports[0].postMessage({ status: "done", eventId: n, eventType: r, response: a });
					}
					_subscribe(e, t) {
						0 === Object.keys(this.handlersMap).length && this.eventTarget.addEventListener("message", this.boundEventHandler), this.handlersMap[e] || (this.handlersMap[e] = new Set()), this.handlersMap[e].add(t);
					}
					_unsubscribe(e, t) {
						this.handlersMap[e] && t && this.handlersMap[e].delete(t), (t && 0 !== this.handlersMap[e].size) || delete this.handlersMap[e], 0 === Object.keys(this.handlersMap).length && this.eventTarget.removeEventListener("message", this.boundEventHandler);
					}
				}
				function Ht(e = "", t = 10) {
					let n = "";
					for (let e = 0; e < t; e++) n += Math.floor(10 * Math.random());
					return e + n;
				}
				Wt.receivers = [];
				class zt {
					constructor(e) {
						(this.target = e), (this.handlers = new Set());
					}
					removeMessageHandler(e) {
						e.messageChannel && (e.messageChannel.port1.removeEventListener("message", e.onMessage), e.messageChannel.port1.close()), this.handlers.delete(e);
					}
					async _send(e, t, n = 50) {
						const r = "undefined" != typeof MessageChannel ? new MessageChannel() : null;
						if (!r) throw new Error("connection_unavailable");
						let i, o;
						return new Promise((s, a) => {
							const c = Ht("", 20);
							r.port1.start();
							const u = setTimeout(() => {
								a(new Error("unsupported_event"));
							}, n);
							(o = {
								messageChannel: r,
								onMessage(e) {
									const t = e;
									if (t.data.eventId === c)
										switch (t.data.status) {
											case "ack":
												clearTimeout(u),
													(i = setTimeout(() => {
														a(new Error("timeout"));
													}, 3e3));
												break;
											case "done":
												clearTimeout(i), s(t.data.response);
												break;
											default:
												clearTimeout(u), clearTimeout(i), a(new Error("invalid_response"));
										}
								},
							}),
								this.handlers.add(o),
								r.port1.addEventListener("message", o.onMessage),
								this.target.postMessage({ eventType: e, eventId: c, data: t }, [r.port2]);
						}).finally(() => {
							o && this.removeMessageHandler(o);
						});
					}
				}
				function Bt() {
					return window;
				}
				function qt() {
					return void 0 !== Bt().WorkerGlobalScope && "function" == typeof Bt().importScripts;
				}
				const Gt = "firebaseLocalStorageDb",
					Kt = "firebaseLocalStorage",
					$t = "fbase_key";
				class Jt {
					constructor(e) {
						this.request = e;
					}
					toPromise() {
						return new Promise((e, t) => {
							this.request.addEventListener("success", () => {
								e(this.request.result);
							}),
								this.request.addEventListener("error", () => {
									t(this.request.error);
								});
						});
					}
				}
				function Yt(e, t) {
					return e.transaction([Kt], t ? "readwrite" : "readonly").objectStore(Kt);
				}
				function Xt() {
					const e = indexedDB.open(Gt, 1);
					return new Promise((t, n) => {
						e.addEventListener("error", () => {
							n(e.error);
						}),
							e.addEventListener("upgradeneeded", () => {
								const t = e.result;
								try {
									t.createObjectStore(Kt, { keyPath: $t });
								} catch (e) {
									n(e);
								}
							}),
							e.addEventListener("success", async () => {
								const n = e.result;
								n.objectStoreNames.contains(Kt)
									? t(n)
									: (n.close(),
									  await (function () {
											const e = indexedDB.deleteDatabase(Gt);
											return new Jt(e).toPromise();
									  })(),
									  t(await Xt()));
							});
					});
				}
				async function Qt(e, t, n) {
					const r = Yt(e, !0).put({ [$t]: t, value: n });
					return new Jt(r).toPromise();
				}
				function Zt(e, t) {
					const n = Yt(e, !0).delete(t);
					return new Jt(n).toPromise();
				}
				class en {
					constructor() {
						(this.type = "LOCAL"),
							(this._shouldAllowMigration = !0),
							(this.listeners = {}),
							(this.localCache = {}),
							(this.pollTimer = null),
							(this.pendingWrites = 0),
							(this.receiver = null),
							(this.sender = null),
							(this.serviceWorkerReceiverAvailable = !1),
							(this.activeServiceWorker = null),
							(this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(
								() => {},
								() => {}
							));
					}
					async _openDb() {
						return this.db || (this.db = await Xt()), this.db;
					}
					async _withRetries(e) {
						let t = 0;
						for (;;)
							try {
								const t = await this._openDb();
								return await e(t);
							} catch (e) {
								if (t++ > 3) throw e;
								this.db && (this.db.close(), (this.db = void 0));
							}
					}
					async initializeServiceWorkerMessaging() {
						return qt() ? this.initializeReceiver() : this.initializeSender();
					}
					async initializeReceiver() {
						(this.receiver = Wt._getInstance(qt() ? self : null)), this.receiver._subscribe("keyChanged", async (e, t) => ({ keyProcessed: (await this._poll()).includes(t.key) })), this.receiver._subscribe("ping", async (e, t) => ["keyChanged"]);
					}
					async initializeSender() {
						var e, t;
						if (
							((this.activeServiceWorker = await (async function () {
								if (!(null === navigator || void 0 === navigator ? void 0 : navigator.serviceWorker)) return null;
								try {
									return (await navigator.serviceWorker.ready).active;
								} catch (e) {
									return null;
								}
							})()),
							!this.activeServiceWorker)
						)
							return;
						this.sender = new zt(this.activeServiceWorker);
						const n = await this.sender._send("ping", {}, 800);
						n && (null === (e = n[0]) || void 0 === e ? void 0 : e.fulfilled) && (null === (t = n[0]) || void 0 === t ? void 0 : t.value.includes("keyChanged")) && (this.serviceWorkerReceiverAvailable = !0);
					}
					async notifyServiceWorker(e) {
						var t;
						if (this.sender && this.activeServiceWorker && ((null === (t = null === navigator || void 0 === navigator ? void 0 : navigator.serviceWorker) || void 0 === t ? void 0 : t.controller) || null) === this.activeServiceWorker)
							try {
								await this.sender._send("keyChanged", { key: e }, this.serviceWorkerReceiverAvailable ? 800 : 50);
							} catch (t) {}
					}
					async _isAvailable() {
						try {
							if (!indexedDB) return !1;
							const e = await Xt();
							return await Qt(e, Mt, "1"), await Zt(e, Mt), !0;
						} catch (e) {}
						return !1;
					}
					async _withPendingWrite(e) {
						this.pendingWrites++;
						try {
							await e();
						} finally {
							this.pendingWrites--;
						}
					}
					async _set(e, t) {
						return this._withPendingWrite(async () => (await this._withRetries((n) => Qt(n, e, t)), (this.localCache[e] = t), this.notifyServiceWorker(e)));
					}
					async _get(e) {
						const t = await this._withRetries((t) =>
							(async function (e, t) {
								const n = Yt(e, !1).get(t),
									r = await new Jt(n).toPromise();
								return void 0 === r ? null : r.value;
							})(t, e)
						);
						return (this.localCache[e] = t), t;
					}
					async _remove(e) {
						return this._withPendingWrite(async () => (await this._withRetries((t) => Zt(t, e)), delete this.localCache[e], this.notifyServiceWorker(e)));
					}
					async _poll() {
						const e = await this._withRetries((e) => {
							const t = Yt(e, !1).getAll();
							return new Jt(t).toPromise();
						});
						if (!e) return [];
						if (0 !== this.pendingWrites) return [];
						const t = [],
							n = new Set();
						if (0 !== e.length) for (const { fbase_key: r, value: i } of e) n.add(r), JSON.stringify(this.localCache[r]) !== JSON.stringify(i) && (this.notifyListeners(r, i), t.push(r));
						for (const e of Object.keys(this.localCache)) this.localCache[e] && !n.has(e) && (this.notifyListeners(e, null), t.push(e));
						return t;
					}
					notifyListeners(e, t) {
						this.localCache[e] = t;
						const n = this.listeners[e];
						if (n) for (const e of Array.from(n)) e(t);
					}
					startPolling() {
						this.stopPolling(), (this.pollTimer = setInterval(async () => this._poll(), 800));
					}
					stopPolling() {
						this.pollTimer && (clearInterval(this.pollTimer), (this.pollTimer = null));
					}
					_addListener(e, t) {
						0 === Object.keys(this.listeners).length && this.startPolling(), this.listeners[e] || ((this.listeners[e] = new Set()), this._get(e)), this.listeners[e].add(t);
					}
					_removeListener(e, t) {
						this.listeners[e] && (this.listeners[e].delete(t), 0 === this.listeners[e].size && delete this.listeners[e]), 0 === Object.keys(this.listeners).length && this.stopPolling();
					}
				}
				en.type = "LOCAL";
				const tn = en,
					nn = 1e12;
				class rn {
					constructor(e) {
						(this.auth = e), (this.counter = nn), (this._widgets = new Map());
					}
					render(e, t) {
						const n = this.counter;
						return this._widgets.set(n, new on(e, this.auth.name, t || {})), this.counter++, n;
					}
					reset(e) {
						var t;
						const n = e || nn;
						null === (t = this._widgets.get(n)) || void 0 === t || t.delete(), this._widgets.delete(n);
					}
					getResponse(e) {
						var t;
						const n = e || nn;
						return (null === (t = this._widgets.get(n)) || void 0 === t ? void 0 : t.getResponse()) || "";
					}
					async execute(e) {
						var t;
						const n = e || nn;
						return null === (t = this._widgets.get(n)) || void 0 === t || t.execute(), "";
					}
				}
				class on {
					constructor(e, t, n) {
						(this.params = n),
							(this.timerId = null),
							(this.deleted = !1),
							(this.responseToken = null),
							(this.clickHandler = () => {
								this.execute();
							});
						const r = "string" == typeof e ? document.getElementById(e) : e;
						_(r, "argument-error", { appName: t }), (this.container = r), (this.isVisible = "invisible" !== this.params.size), this.isVisible ? this.execute() : this.container.addEventListener("click", this.clickHandler);
					}
					getResponse() {
						return this.checkIfDeleted(), this.responseToken;
					}
					delete() {
						this.checkIfDeleted(), (this.deleted = !0), this.timerId && (clearTimeout(this.timerId), (this.timerId = null)), this.container.removeEventListener("click", this.clickHandler);
					}
					execute() {
						this.checkIfDeleted(),
							this.timerId ||
								(this.timerId = window.setTimeout(() => {
									this.responseToken = (function () {
										const e = [],
											t = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
										for (let n = 0; n < 50; n++) e.push(t.charAt(Math.floor(62 * Math.random())));
										return e.join("");
									})();
									const { callback: e, "expired-callback": t } = this.params;
									if (e)
										try {
											e(this.responseToken);
										} catch (e) {}
									this.timerId = window.setTimeout(() => {
										if (((this.timerId = null), (this.responseToken = null), t))
											try {
												t();
											} catch (e) {}
										this.isVisible && this.execute();
									}, 6e4);
								}, 500));
					}
					checkIfDeleted() {
						if (this.deleted) throw new Error("reCAPTCHA mock was already deleted!");
					}
				}
				const sn = Se("rcb"),
					an = new T(3e4, 6e4);
				class cn {
					constructor() {
						var e;
						(this.hostLanguage = ""), (this.counter = 0), (this.librarySeparatelyLoaded = !!(null === (e = Bt().grecaptcha) || void 0 === e ? void 0 : e.render));
					}
					load(e, t = "") {
						return (
							_(
								(function (e) {
									return e.length <= 6 && /^\s*[a-zA-Z0-9\-]*\s*$/.test(e);
								})(t),
								e,
								"argument-error"
							),
							this.shouldResolveImmediately(t) && F(Bt().grecaptcha)
								? Promise.resolve(Bt().grecaptcha)
								: new Promise((n, r) => {
										const o = Bt().setTimeout(() => {
											r(p(e, "network-request-failed"));
										}, an.get());
										(Bt()[sn] = () => {
											Bt().clearTimeout(o), delete Bt()[sn];
											const i = Bt().grecaptcha;
											if (!i || !F(i)) return void r(p(e, "internal-error"));
											const s = i.render;
											(i.render = (e, t) => {
												const n = s(e, t);
												return this.counter++, n;
											}),
												(this.hostLanguage = t),
												n(i);
										}),
											Ae(`${Te.recaptchaV2Script}?${i.querystring({ onload: sn, render: "explicit", hl: t })}`).catch(() => {
												clearTimeout(o), r(p(e, "internal-error"));
											});
								  })
						);
					}
					clearedOneInstance() {
						this.counter--;
					}
					shouldResolveImmediately(e) {
						var t;
						return !!(null === (t = Bt().grecaptcha) || void 0 === t ? void 0 : t.render) && (e === this.hostLanguage || this.counter > 0 || this.librarySeparatelyLoaded);
					}
				}
				class un {
					async load(e) {
						return new rn(e);
					}
					clearedOneInstance() {}
				}
				const ln = "recaptcha",
					dn = { theme: "light", type: "image" };
				class hn {
					constructor(e, t) {
						(this.verificationId = e), (this.onConfirmation = t);
					}
					confirm(e) {
						const t = qe._fromVerification(this.verificationId, e);
						return this.onConfirmation(t);
					}
				}
				async function pn(e, t, n) {
					var r;
					const i = await n.verify();
					try {
						let o;
						if ((_("string" == typeof i, e, "argument-error"), _(n.type === ln, e, "argument-error"), (o = "string" == typeof t ? { phoneNumber: t } : t), "session" in o)) {
							const t = o.session;
							if ("phoneNumber" in o) {
								_("enroll" === t.type, e, "internal-error");
								const n = await (function (e, t) {
									return C(e, "POST", "/v2/accounts/mfaEnrollment:start", k(e, t));
								})(e, { idToken: t.credential, phoneEnrollmentInfo: { phoneNumber: o.phoneNumber, recaptchaToken: i } });
								return n.phoneSessionInfo.sessionInfo;
							}
							{
								_("signin" === t.type, e, "internal-error");
								const n = (null === (r = o.multiFactorHint) || void 0 === r ? void 0 : r.uid) || o.multiFactorUid;
								_(n, e, "missing-multi-factor-info");
								const s = await (function (e, t) {
									return C(e, "POST", "/v2/accounts/mfaSignIn:start", k(e, t));
								})(e, { mfaPendingCredential: t.credential, mfaEnrollmentId: n, phoneSignInInfo: { recaptchaToken: i } });
								return s.phoneResponseInfo.sessionInfo;
							}
						}
						{
							const { sessionInfo: t } = await (async function (e, t) {
								return C(e, "POST", "/v1/accounts:sendVerificationCode", k(e, t));
							})(e, { phoneNumber: o.phoneNumber, recaptchaToken: i });
							return t;
						}
					} finally {
						n._reset();
					}
				}
				class fn {
					constructor(e) {
						(this.providerId = fn.PROVIDER_ID), (this.auth = be(e));
					}
					verifyPhoneNumber(e, t) {
						return pn(this.auth, e, i.getModularInstance(t));
					}
					static credential(e, t) {
						return qe._fromVerification(e, t);
					}
					static credentialFromResult(e) {
						const t = e;
						return fn.credentialFromTaggedObject(t);
					}
					static credentialFromError(e) {
						return fn.credentialFromTaggedObject(e.customData || {});
					}
					static credentialFromTaggedObject({ _tokenResponse: e }) {
						if (!e) return null;
						const { phoneNumber: t, temporaryProof: n } = e;
						return t && n ? qe._fromTokenResponse(t, n) : null;
					}
				}
				function mn(e, t) {
					return t ? re(t) : (_(e._popupRedirectResolver, e, "argument-error"), e._popupRedirectResolver);
				}
				(fn.PROVIDER_ID = "phone"), (fn.PHONE_SIGN_IN_METHOD = "phone");
				class gn extends Le {
					constructor(e) {
						super("custom", "custom"), (this.params = e);
					}
					_getIdTokenResponse(e) {
						return He(e, this._buildIdpRequest());
					}
					_linkToIdToken(e, t) {
						return He(e, this._buildIdpRequest(t));
					}
					_getReauthenticationResolver(e) {
						return He(e, this._buildIdpRequest());
					}
					_buildIdpRequest(e) {
						const t = { requestUri: this.params.requestUri, sessionId: this.params.sessionId, postBody: this.params.postBody, tenantId: this.params.tenantId, pendingToken: this.params.pendingToken, returnSecureToken: !0, returnIdpCredential: !0 };
						return e && (t.idToken = e), t;
					}
				}
				function vn(e) {
					return ht(e.auth, new gn(e), e.bypassAuthState);
				}
				function _n(e) {
					const { auth: t, user: n } = e;
					return _(n, t, "internal-error"), dt(n, new gn(e), e.bypassAuthState);
				}
				async function yn(e) {
					const { auth: t, user: n } = e;
					return _(n, t, "internal-error"), ut(n, new gn(e), e.bypassAuthState);
				}
				class In {
					constructor(e, t, n, r, i = !1) {
						(this.auth = e), (this.resolver = n), (this.user = r), (this.bypassAuthState = i), (this.pendingPromise = null), (this.eventManager = null), (this.filter = Array.isArray(t) ? t : [t]);
					}
					execute() {
						return new Promise(async (e, t) => {
							this.pendingPromise = { resolve: e, reject: t };
							try {
								(this.eventManager = await this.resolver._initialize(this.auth)), await this.onExecution(), this.eventManager.registerConsumer(this);
							} catch (e) {
								this.reject(e);
							}
						});
					}
					async onAuthEvent(e) {
						const { urlResponse: t, sessionId: n, postBody: r, tenantId: i, error: o, type: s } = e;
						if (o) return void this.reject(o);
						const a = { auth: this.auth, requestUri: t, sessionId: n, tenantId: i || void 0, postBody: r || void 0, user: this.user, bypassAuthState: this.bypassAuthState };
						try {
							this.resolve(await this.getIdpTask(s)(a));
						} catch (e) {
							this.reject(e);
						}
					}
					onError(e) {
						this.reject(e);
					}
					getIdpTask(e) {
						switch (e) {
							case "signInViaPopup":
							case "signInViaRedirect":
								return vn;
							case "linkViaPopup":
							case "linkViaRedirect":
								return yn;
							case "reauthViaPopup":
							case "reauthViaRedirect":
								return _n;
							default:
								h(this.auth, "internal-error");
						}
					}
					resolve(e) {
						I(this.pendingPromise, "Pending promise was never set"), this.pendingPromise.resolve(e), this.unregisterAndCleanUp();
					}
					reject(e) {
						I(this.pendingPromise, "Pending promise was never set"), this.pendingPromise.reject(e), this.unregisterAndCleanUp();
					}
					unregisterAndCleanUp() {
						this.eventManager && this.eventManager.unregisterConsumer(this), (this.pendingPromise = null), this.cleanUp();
					}
				}
				const wn = new T(2e3, 1e4);
				class bn extends In {
					constructor(e, t, n, r, i) {
						super(e, t, r, i), (this.provider = n), (this.authWindow = null), (this.pollId = null), bn.currentPopupAction && bn.currentPopupAction.cancel(), (bn.currentPopupAction = this);
					}
					async executeNotNull() {
						const e = await this.execute();
						return _(e, this.auth, "internal-error"), e;
					}
					async onExecution() {
						I(1 === this.filter.length, "Popup operations only handle one event");
						const e = Ht();
						(this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], e)),
							(this.authWindow.associatedEvent = e),
							this.resolver._originValidation(this.auth).catch((e) => {
								this.reject(e);
							}),
							this.resolver._isIframeWebStorageSupported(this.auth, (e) => {
								e || this.reject(p(this.auth, "web-storage-unsupported"));
							}),
							this.pollUserCancellation();
					}
					get eventId() {
						var e;
						return (null === (e = this.authWindow) || void 0 === e ? void 0 : e.associatedEvent) || null;
					}
					cancel() {
						this.reject(p(this.auth, "cancelled-popup-request"));
					}
					cleanUp() {
						this.authWindow && this.authWindow.close(), this.pollId && window.clearTimeout(this.pollId), (this.authWindow = null), (this.pollId = null), (bn.currentPopupAction = null);
					}
					pollUserCancellation() {
						const e = () => {
							var t, n;
							(null === (n = null === (t = this.authWindow) || void 0 === t ? void 0 : t.window) || void 0 === n ? void 0 : n.closed)
								? (this.pollId = window.setTimeout(() => {
										(this.pollId = null), this.reject(p(this.auth, "popup-closed-by-user"));
								  }, 8e3))
								: (this.pollId = window.setTimeout(e, wn.get()));
						};
						e();
					}
				}
				bn.currentPopupAction = null;
				const En = "pendingRedirect",
					Tn = new Map();
				class An extends In {
					constructor(e, t, n = !1) {
						super(e, ["signInViaRedirect", "linkViaRedirect", "reauthViaRedirect", "unknown"], t, void 0, n), (this.eventId = null);
					}
					async execute() {
						let e = Tn.get(this.auth._key());
						if (!e) {
							try {
								const t = (await (async function (e, t) {
									const n = kn(t),
										r = On(e);
									if (!(await r._isAvailable())) return !1;
									const i = "true" === (await r._get(n));
									return await r._remove(n), i;
								})(this.resolver, this.auth))
									? await super.execute()
									: null;
								e = () => Promise.resolve(t);
							} catch (t) {
								e = () => Promise.reject(t);
							}
							Tn.set(this.auth._key(), e);
						}
						return this.bypassAuthState || Tn.set(this.auth._key(), () => Promise.resolve(null)), e();
					}
					async onAuthEvent(e) {
						if ("signInViaRedirect" === e.type) return super.onAuthEvent(e);
						if ("unknown" !== e.type) {
							if (e.eventId) {
								const t = await this.auth._redirectUserForId(e.eventId);
								if (t) return (this.user = t), super.onAuthEvent(e);
								this.resolve(null);
							}
						} else this.resolve(null);
					}
					async onExecution() {}
					cleanUp() {}
				}
				async function Sn(e, t) {
					return On(e)._set(kn(t), "true");
				}
				function Pn(e, t) {
					Tn.set(e._key(), t);
				}
				function On(e) {
					return re(e._redirectPersistence);
				}
				function kn(e) {
					return se(En, e.config.apiKey, e.name);
				}
				async function Cn(e, t, n = !1) {
					if (r._isFirebaseServerApp(e.app)) return Promise.reject(m(e));
					const i = be(e),
						o = mn(i, t),
						s = new An(i, o, n),
						a = await s.execute();
					return a && !n && (delete a.user._redirectEventId, await i._persistUserIfCurrent(a.user), await i._setRedirectUser(null, t)), a;
				}
				async function Rn(e) {
					const t = Ht(`${e.uid}:::`);
					return (e._redirectEventId = t), await e.auth._setRedirectUser(e), await e.auth._persistUserIfCurrent(e), t;
				}
				class Nn {
					constructor(e) {
						(this.auth = e), (this.cachedEventUids = new Set()), (this.consumers = new Set()), (this.queuedRedirectEvent = null), (this.hasHandledPotentialRedirect = !1), (this.lastProcessedEventTime = Date.now());
					}
					registerConsumer(e) {
						this.consumers.add(e), this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, e) && (this.sendToConsumer(this.queuedRedirectEvent, e), this.saveEventToCache(this.queuedRedirectEvent), (this.queuedRedirectEvent = null));
					}
					unregisterConsumer(e) {
						this.consumers.delete(e);
					}
					onEvent(e) {
						if (this.hasEventBeenHandled(e)) return !1;
						let t = !1;
						return (
							this.consumers.forEach((n) => {
								this.isEventForConsumer(e, n) && ((t = !0), this.sendToConsumer(e, n), this.saveEventToCache(e));
							}),
							this.hasHandledPotentialRedirect ||
								!(function (e) {
									switch (e.type) {
										case "signInViaRedirect":
										case "linkViaRedirect":
										case "reauthViaRedirect":
											return !0;
										case "unknown":
											return Ln(e);
										default:
											return !1;
									}
								})(e) ||
								((this.hasHandledPotentialRedirect = !0), t || ((this.queuedRedirectEvent = e), (t = !0))),
							t
						);
					}
					sendToConsumer(e, t) {
						var n;
						if (e.error && !Ln(e)) {
							const r = (null === (n = e.error.code) || void 0 === n ? void 0 : n.split("auth/")[1]) || "internal-error";
							t.onError(p(this.auth, r));
						} else t.onAuthEvent(e);
					}
					isEventForConsumer(e, t) {
						const n = null === t.eventId || (!!e.eventId && e.eventId === t.eventId);
						return t.filter.includes(e.type) && n;
					}
					hasEventBeenHandled(e) {
						return Date.now() - this.lastProcessedEventTime >= 6e5 && this.cachedEventUids.clear(), this.cachedEventUids.has(Dn(e));
					}
					saveEventToCache(e) {
						this.cachedEventUids.add(Dn(e)), (this.lastProcessedEventTime = Date.now());
					}
				}
				function Dn(e) {
					return [e.type, e.eventId, e.sessionId, e.tenantId].filter((e) => e).join("-");
				}
				function Ln({ type: e, error: t }) {
					return "unknown" === e && "auth/no-auth-event" === (null == t ? void 0 : t.code);
				}
				async function Mn(e, t = {}) {
					return C(e, "GET", "/v1/projects", t);
				}
				const Un = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
					Fn = /^https?/;
				function xn(e) {
					const t = w(),
						{ protocol: n, hostname: r } = new URL(t);
					if (e.startsWith("chrome-extension://")) {
						const i = new URL(e);
						return "" === i.hostname && "" === r ? "chrome-extension:" === n && e.replace("chrome-extension://", "") === t.replace("chrome-extension://", "") : "chrome-extension:" === n && i.hostname === r;
					}
					if (!Fn.test(n)) return !1;
					if (Un.test(e)) return r === e;
					const i = e.replace(/\./g, "\\.");
					return new RegExp("^(.+\\." + i + "|" + i + ")$", "i").test(r);
				}
				const jn = new T(3e4, 6e4);
				function Vn() {
					const e = Bt().___jsl;
					if (null == e ? void 0 : e.H) for (const t of Object.keys(e.H)) if (((e.H[t].r = e.H[t].r || []), (e.H[t].L = e.H[t].L || []), (e.H[t].r = [...e.H[t].L]), e.CP)) for (let t = 0; t < e.CP.length; t++) e.CP[t] = null;
				}
				function Wn(e) {
					return new Promise((t, n) => {
						var r, i, o;
						function s() {
							Vn(),
								gapi.load("gapi.iframes", {
									callback: () => {
										t(gapi.iframes.getContext());
									},
									ontimeout: () => {
										Vn(), n(p(e, "network-request-failed"));
									},
									timeout: jn.get(),
								});
						}
						if (null === (i = null === (r = Bt().gapi) || void 0 === r ? void 0 : r.iframes) || void 0 === i ? void 0 : i.Iframe) t(gapi.iframes.getContext());
						else {
							if (!(null === (o = Bt().gapi) || void 0 === o ? void 0 : o.load)) {
								const t = Se("iframefcb");
								return (
									(Bt()[t] = () => {
										gapi.load ? s() : n(p(e, "network-request-failed"));
									}),
									Ae(`${Te.gapiScript}?onload=${t}`).catch((e) => n(e))
								);
							}
							s();
						}
					}).catch((e) => {
						throw ((Hn = null), e);
					});
				}
				let Hn = null;
				const zn = new T(5e3, 15e3),
					Bn = "__/auth/iframe",
					qn = "emulator/auth/iframe",
					Gn = { style: { position: "absolute", top: "-100px", width: "1px", height: "1px" }, "aria-hidden": "true", tabindex: "-1" },
					Kn = new Map([
						["identitytoolkit.googleapis.com", "p"],
						["staging-identitytoolkit.sandbox.googleapis.com", "s"],
						["test-identitytoolkit.sandbox.googleapis.com", "t"],
					]);
				function $n(e) {
					const t = e.config;
					_(t.authDomain, e, "auth-domain-config-required");
					const n = t.emulator ? A(t, qn) : `https://${e.config.authDomain}/${Bn}`,
						o = { apiKey: t.apiKey, appName: e.name, v: r.SDK_VERSION },
						s = Kn.get(e.config.apiHost);
					s && (o.eid = s);
					const a = e._getFrameworks();
					return a.length && (o.fw = a.join(",")), `${n}?${i.querystring(o).slice(1)}`;
				}
				const Jn = { location: "yes", resizable: "yes", statusbar: "yes", toolbar: "no" };
				class Yn {
					constructor(e) {
						(this.window = e), (this.associatedEvent = null);
					}
					close() {
						if (this.window)
							try {
								this.window.close();
							} catch (e) {}
					}
				}
				const Xn = encodeURIComponent("fac");
				async function Qn(e, t, n, o, s, a) {
					_(e.config.authDomain, e, "auth-domain-config-required"), _(e.config.apiKey, e, "invalid-api-key");
					const c = { apiKey: e.config.apiKey, appName: e.name, authType: n, redirectUrl: o, v: r.SDK_VERSION, eventId: s };
					if (t instanceof $e) {
						t.setDefaultLanguage(e.languageCode), (c.providerId = t.providerId || ""), i.isEmpty(t.getCustomParameters()) || (c.customParameters = JSON.stringify(t.getCustomParameters()));
						for (const [e, t] of Object.entries(a || {})) c[e] = t;
					}
					if (t instanceof Je) {
						const e = t.getScopes().filter((e) => "" !== e);
						e.length > 0 && (c.scopes = e.join(","));
					}
					e.tenantId && (c.tid = e.tenantId);
					const u = c;
					for (const e of Object.keys(u)) void 0 === u[e] && delete u[e];
					const l = await e._getAppCheckToken(),
						d = l ? `#${Xn}=${encodeURIComponent(l)}` : "";
					return `${(function ({ config: e }) {
						return e.emulator ? A(e, "emulator/auth/handler") : `https://${e.authDomain}/__/auth/handler`;
					})(e)}?${i.querystring(u).slice(1)}${d}`;
				}
				const Zn = "webStorageSupport",
					er = class {
						constructor() {
							(this.eventManagers = {}), (this.iframes = {}), (this.originValidationPromises = {}), (this._redirectPersistence = Vt), (this._completeRedirectFn = Cn), (this._overrideRedirectResult = Pn);
						}
						async _openPopup(e, t, n, r) {
							var o;
							return (
								I(null === (o = this.eventManagers[e._key()]) || void 0 === o ? void 0 : o.manager, "_initialize() not called before _openPopup()"),
								(function (e, t, n, r = 500, o = 600) {
									const s = Math.max((window.screen.availHeight - o) / 2, 0).toString(),
										a = Math.max((window.screen.availWidth - r) / 2, 0).toString();
									let c = "";
									const u = Object.assign(Object.assign({}, Jn), { width: r.toString(), height: o.toString(), top: s, left: a }),
										l = i.getUA().toLowerCase();
									n && (c = de(l) ? "_blank" : n), ue(l) && ((t = t || "http://localhost"), (u.scrollbars = "yes"));
									const d = Object.entries(u).reduce((e, [t, n]) => `${e}${t}=${n},`, "");
									if (
										(function (e = i.getUA()) {
											var t;
											return ge(e) && !!(null === (t = window.navigator) || void 0 === t ? void 0 : t.standalone);
										})(l) &&
										"_self" !== c
									)
										return (
											(function (e, t) {
												const n = document.createElement("a");
												(n.href = e), (n.target = t);
												const r = document.createEvent("MouseEvent");
												r.initMouseEvent("click", !0, !0, window, 1, 0, 0, 0, 0, !1, !1, !1, !1, 1, null), n.dispatchEvent(r);
											})(t || "", c),
											new Yn(null)
										);
									const h = window.open(t || "", c, d);
									_(h, e, "popup-blocked");
									try {
										h.focus();
									} catch (e) {}
									return new Yn(h);
								})(e, await Qn(e, t, n, w(), r), Ht())
							);
						}
						async _openRedirect(e, t, n, r) {
							return await this._originValidation(e), (i = await Qn(e, t, n, w(), r)), (Bt().location.href = i), new Promise(() => {});
							var i;
						}
						_initialize(e) {
							const t = e._key();
							if (this.eventManagers[t]) {
								const { manager: e, promise: n } = this.eventManagers[t];
								return e ? Promise.resolve(e) : (I(n, "If manager is not set, promise should be"), n);
							}
							const n = this.initAndGetManager(e);
							return (
								(this.eventManagers[t] = { promise: n }),
								n.catch(() => {
									delete this.eventManagers[t];
								}),
								n
							);
						}
						async initAndGetManager(e) {
							const t = await (async function (e) {
									const t = await (function (e) {
											return (Hn = Hn || Wn(e)), Hn;
										})(e),
										n = Bt().gapi;
									return (
										_(n, e, "internal-error"),
										t.open(
											{ where: document.body, url: $n(e), messageHandlersFilter: n.iframes.CROSS_ORIGIN_IFRAMES_FILTER, attributes: Gn, dontclear: !0 },
											(t) =>
												new Promise(async (n, r) => {
													await t.restyle({ setHideOnLeave: !1 });
													const i = p(e, "network-request-failed"),
														o = Bt().setTimeout(() => {
															r(i);
														}, zn.get());
													function s() {
														Bt().clearTimeout(o), n(t);
													}
													t.ping(s).then(s, () => {
														r(i);
													});
												})
										)
									);
								})(e),
								n = new Nn(e);
							return t.register("authEvent", (t) => (_(null == t ? void 0 : t.authEvent, e, "invalid-auth-event"), { status: n.onEvent(t.authEvent) ? "ACK" : "ERROR" }), gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER), (this.eventManagers[e._key()] = { manager: n }), (this.iframes[e._key()] = t), n;
						}
						_isIframeWebStorageSupported(e, t) {
							this.iframes[e._key()].send(
								Zn,
								{ type: Zn },
								(n) => {
									var r;
									const i = null === (r = null == n ? void 0 : n[0]) || void 0 === r ? void 0 : r[Zn];
									void 0 !== i && t(!!i), h(e, "internal-error");
								},
								gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER
							);
						}
						_originValidation(e) {
							const t = e._key();
							return (
								this.originValidationPromises[t] ||
									(this.originValidationPromises[t] = (async function (e) {
										if (e.config.emulator) return;
										const { authorizedDomains: t } = await Mn(e);
										for (const e of t)
											try {
												if (xn(e)) return;
											} catch (e) {}
										h(e, "unauthorized-domain");
									})(e)),
								this.originValidationPromises[t]
							);
						}
						get _shouldInitProactively() {
							return ve() || le() || ge();
						}
					};
				class tr {
					constructor(e) {
						this.factorId = e;
					}
					_process(e, t, n) {
						switch (t.type) {
							case "enroll":
								return this._finalizeEnroll(e, t.credential, n);
							case "signin":
								return this._finalizeSignIn(e, t.credential);
							default:
								return y("unexpected MultiFactorSessionType");
						}
					}
				}
				class nr extends tr {
					constructor(e) {
						super("phone"), (this.credential = e);
					}
					static _fromCredential(e) {
						return new nr(e);
					}
					_finalizeEnroll(e, t, n) {
						return (function (e, t) {
							return C(e, "POST", "/v2/accounts/mfaEnrollment:finalize", k(e, t));
						})(e, { idToken: t, displayName: n, phoneVerificationInfo: this.credential._makeVerificationRequest() });
					}
					_finalizeSignIn(e, t) {
						return (function (e, t) {
							return C(e, "POST", "/v2/accounts/mfaSignIn:finalize", k(e, t));
						})(e, { mfaPendingCredential: t, phoneVerificationInfo: this.credential._makeVerificationRequest() });
					}
				}
				class rr {
					constructor() {}
					static assertion(e) {
						return nr._fromCredential(e);
					}
				}
				rr.FACTOR_ID = "phone";
				class ir {
					static assertionForEnrollment(e, t) {
						return or._fromSecret(e, t);
					}
					static assertionForSignIn(e, t) {
						return or._fromEnrollmentId(e, t);
					}
					static async generateSecret(e) {
						var t;
						const n = e;
						_(void 0 !== (null === (t = n.user) || void 0 === t ? void 0 : t.auth), "internal-error");
						const r = await ((i = n.user.auth), (o = { idToken: n.credential, totpEnrollmentInfo: {} }), C(i, "POST", "/v2/accounts/mfaEnrollment:start", k(i, o)));
						var i, o;
						return sr._fromStartTotpMfaEnrollmentResponse(r, n.user.auth);
					}
				}
				ir.FACTOR_ID = "totp";
				class or extends tr {
					constructor(e, t, n) {
						super("totp"), (this.otp = e), (this.enrollmentId = t), (this.secret = n);
					}
					static _fromSecret(e, t) {
						return new or(t, void 0, e);
					}
					static _fromEnrollmentId(e, t) {
						return new or(t, e);
					}
					async _finalizeEnroll(e, t, n) {
						return (
							_(void 0 !== this.secret, e, "argument-error"),
							(function (e, t) {
								return C(e, "POST", "/v2/accounts/mfaEnrollment:finalize", k(e, t));
							})(e, { idToken: t, displayName: n, totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp) })
						);
					}
					async _finalizeSignIn(e, t) {
						_(void 0 !== this.enrollmentId && void 0 !== this.otp, e, "argument-error");
						const n = { verificationCode: this.otp };
						return (function (e, t) {
							return C(e, "POST", "/v2/accounts/mfaSignIn:finalize", k(e, t));
						})(e, { mfaPendingCredential: t, mfaEnrollmentId: this.enrollmentId, totpVerificationInfo: n });
					}
				}
				class sr {
					constructor(e, t, n, r, i, o, s) {
						(this.sessionInfo = o), (this.auth = s), (this.secretKey = e), (this.hashingAlgorithm = t), (this.codeLength = n), (this.codeIntervalSeconds = r), (this.enrollmentCompletionDeadline = i);
					}
					static _fromStartTotpMfaEnrollmentResponse(e, t) {
						return new sr(e.totpSessionInfo.sharedSecretKey, e.totpSessionInfo.hashingAlgorithm, e.totpSessionInfo.verificationCodeLength, e.totpSessionInfo.periodSec, new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), e.totpSessionInfo.sessionInfo, t);
					}
					_makeTotpVerificationInfo(e) {
						return { sessionInfo: this.sessionInfo, verificationCode: e };
					}
					generateQrCodeUrl(e, t) {
						var n;
						let r = !1;
						return (ar(e) || ar(t)) && (r = !0), r && (ar(e) && (e = (null === (n = this.auth.currentUser) || void 0 === n ? void 0 : n.email) || "unknownuser"), ar(t) && (t = this.auth.name)), `otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`;
					}
				}
				function ar(e) {
					return void 0 === e || 0 === (null == e ? void 0 : e.length);
				}
				var cr = "@firebase/auth",
					ur = "1.7.5";
				class lr {
					constructor(e) {
						(this.auth = e), (this.internalListeners = new Map());
					}
					getUid() {
						var e;
						return this.assertAuthConfigured(), (null === (e = this.auth.currentUser) || void 0 === e ? void 0 : e.uid) || null;
					}
					async getToken(e) {
						return this.assertAuthConfigured(), await this.auth._initializationPromise, this.auth.currentUser ? { accessToken: await this.auth.currentUser.getIdToken(e) } : null;
					}
					addAuthTokenListener(e) {
						if ((this.assertAuthConfigured(), this.internalListeners.has(e))) return;
						const t = this.auth.onIdTokenChanged((t) => {
							e((null == t ? void 0 : t.stsTokenManager.accessToken) || null);
						});
						this.internalListeners.set(e, t), this.updateProactiveRefresh();
					}
					removeAuthTokenListener(e) {
						this.assertAuthConfigured();
						const t = this.internalListeners.get(e);
						t && (this.internalListeners.delete(e), t(), this.updateProactiveRefresh());
					}
					assertAuthConfigured() {
						_(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth");
					}
					updateProactiveRefresh() {
						this.internalListeners.size > 0 ? this.auth._startProactiveRefresh() : this.auth._stopProactiveRefresh();
					}
				}
				const dr = i.getExperimentalSetting("authIdTokenMaxAge") || 300;
				let hr = null;
				var pr;
				(Te = {
					loadJS: (e) =>
						new Promise((t, n) => {
							const r = document.createElement("script");
							var i, o;
							r.setAttribute("src", e),
								(r.onload = t),
								(r.onerror = (e) => {
									const t = p("internal-error");
									(t.customData = e), n(t);
								}),
								(r.type = "text/javascript"),
								(r.charset = "UTF-8"),
								(null !== (o = null === (i = document.getElementsByTagName("head")) || void 0 === i ? void 0 : i[0]) && void 0 !== o ? o : document).appendChild(r);
						}),
					gapiScript: "https://apis.google.com/js/api.js",
					recaptchaV2Script: "https://www.google.com/recaptcha/api.js",
					recaptchaEnterpriseScript: "https://www.google.com/recaptcha/enterprise.js?render=",
				}),
					(pr = "Browser"),
					r._registerComponent(
						new a.Component(
							"auth",
							(e, { options: t }) => {
								const n = e.getProvider("app").getImmediate(),
									r = e.getProvider("heartbeat"),
									i = e.getProvider("app-check-internal"),
									{ apiKey: o, authDomain: s } = n.options;
								_(o && !o.includes(":"), "invalid-api-key", { appName: n.name });
								const a = { apiKey: o, authDomain: s, clientPlatform: pr, apiHost: "identitytoolkit.googleapis.com", tokenApiHost: "securetoken.googleapis.com", apiScheme: "https", sdkClientVersion: _e(pr) },
									c = new we(n, r, i, a);
								return (
									(function (e, t) {
										const n = (null == t ? void 0 : t.persistence) || [],
											r = (Array.isArray(n) ? n : [n]).map(re);
										(null == t ? void 0 : t.errorMap) && e._updateErrorMap(t.errorMap), e._initializeWithPersistence(r, null == t ? void 0 : t.popupRedirectResolver);
									})(c, t),
									c
								);
							},
							"PUBLIC"
						)
							.setInstantiationMode("EXPLICIT")
							.setInstanceCreatedCallback((e, t, n) => {
								e.getProvider("auth-internal").initialize();
							})
					),
					r._registerComponent(
						new a.Component(
							"auth-internal",
							(e) => {
								return (t = be(e.getProvider("auth").getImmediate())), new lr(t);
								var t;
							},
							"PRIVATE"
						).setInstantiationMode("EXPLICIT")
					),
					r.registerVersion(
						cr,
						ur,
						(function (e) {
							switch (e) {
								case "Node":
									return "node";
								case "ReactNative":
									return "rn";
								case "Worker":
									return "webworker";
								case "Cordova":
									return "cordova";
								case "WebExtension":
									return "web-extension";
								default:
									return;
							}
						})(pr)
					),
					r.registerVersion(cr, ur, "cjs2017"),
					(t.AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY = {
						ADMIN_ONLY_OPERATION: "auth/admin-restricted-operation",
						ARGUMENT_ERROR: "auth/argument-error",
						APP_NOT_AUTHORIZED: "auth/app-not-authorized",
						APP_NOT_INSTALLED: "auth/app-not-installed",
						CAPTCHA_CHECK_FAILED: "auth/captcha-check-failed",
						CODE_EXPIRED: "auth/code-expired",
						CORDOVA_NOT_READY: "auth/cordova-not-ready",
						CORS_UNSUPPORTED: "auth/cors-unsupported",
						CREDENTIAL_ALREADY_IN_USE: "auth/credential-already-in-use",
						CREDENTIAL_MISMATCH: "auth/custom-token-mismatch",
						CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "auth/requires-recent-login",
						DEPENDENT_SDK_INIT_BEFORE_AUTH: "auth/dependent-sdk-initialized-before-auth",
						DYNAMIC_LINK_NOT_ACTIVATED: "auth/dynamic-link-not-activated",
						EMAIL_CHANGE_NEEDS_VERIFICATION: "auth/email-change-needs-verification",
						EMAIL_EXISTS: "auth/email-already-in-use",
						EMULATOR_CONFIG_FAILED: "auth/emulator-config-failed",
						EXPIRED_OOB_CODE: "auth/expired-action-code",
						EXPIRED_POPUP_REQUEST: "auth/cancelled-popup-request",
						INTERNAL_ERROR: "auth/internal-error",
						INVALID_API_KEY: "auth/invalid-api-key",
						INVALID_APP_CREDENTIAL: "auth/invalid-app-credential",
						INVALID_APP_ID: "auth/invalid-app-id",
						INVALID_AUTH: "auth/invalid-user-token",
						INVALID_AUTH_EVENT: "auth/invalid-auth-event",
						INVALID_CERT_HASH: "auth/invalid-cert-hash",
						INVALID_CODE: "auth/invalid-verification-code",
						INVALID_CONTINUE_URI: "auth/invalid-continue-uri",
						INVALID_CORDOVA_CONFIGURATION: "auth/invalid-cordova-configuration",
						INVALID_CUSTOM_TOKEN: "auth/invalid-custom-token",
						INVALID_DYNAMIC_LINK_DOMAIN: "auth/invalid-dynamic-link-domain",
						INVALID_EMAIL: "auth/invalid-email",
						INVALID_EMULATOR_SCHEME: "auth/invalid-emulator-scheme",
						INVALID_IDP_RESPONSE: "auth/invalid-credential",
						INVALID_LOGIN_CREDENTIALS: "auth/invalid-credential",
						INVALID_MESSAGE_PAYLOAD: "auth/invalid-message-payload",
						INVALID_MFA_SESSION: "auth/invalid-multi-factor-session",
						INVALID_OAUTH_CLIENT_ID: "auth/invalid-oauth-client-id",
						INVALID_OAUTH_PROVIDER: "auth/invalid-oauth-provider",
						INVALID_OOB_CODE: "auth/invalid-action-code",
						INVALID_ORIGIN: "auth/unauthorized-domain",
						INVALID_PASSWORD: "auth/wrong-password",
						INVALID_PERSISTENCE: "auth/invalid-persistence-type",
						INVALID_PHONE_NUMBER: "auth/invalid-phone-number",
						INVALID_PROVIDER_ID: "auth/invalid-provider-id",
						INVALID_RECIPIENT_EMAIL: "auth/invalid-recipient-email",
						INVALID_SENDER: "auth/invalid-sender",
						INVALID_SESSION_INFO: "auth/invalid-verification-id",
						INVALID_TENANT_ID: "auth/invalid-tenant-id",
						MFA_INFO_NOT_FOUND: "auth/multi-factor-info-not-found",
						MFA_REQUIRED: "auth/multi-factor-auth-required",
						MISSING_ANDROID_PACKAGE_NAME: "auth/missing-android-pkg-name",
						MISSING_APP_CREDENTIAL: "auth/missing-app-credential",
						MISSING_AUTH_DOMAIN: "auth/auth-domain-config-required",
						MISSING_CODE: "auth/missing-verification-code",
						MISSING_CONTINUE_URI: "auth/missing-continue-uri",
						MISSING_IFRAME_START: "auth/missing-iframe-start",
						MISSING_IOS_BUNDLE_ID: "auth/missing-ios-bundle-id",
						MISSING_OR_INVALID_NONCE: "auth/missing-or-invalid-nonce",
						MISSING_MFA_INFO: "auth/missing-multi-factor-info",
						MISSING_MFA_SESSION: "auth/missing-multi-factor-session",
						MISSING_PHONE_NUMBER: "auth/missing-phone-number",
						MISSING_SESSION_INFO: "auth/missing-verification-id",
						MODULE_DESTROYED: "auth/app-deleted",
						NEED_CONFIRMATION: "auth/account-exists-with-different-credential",
						NETWORK_REQUEST_FAILED: "auth/network-request-failed",
						NULL_USER: "auth/null-user",
						NO_AUTH_EVENT: "auth/no-auth-event",
						NO_SUCH_PROVIDER: "auth/no-such-provider",
						OPERATION_NOT_ALLOWED: "auth/operation-not-allowed",
						OPERATION_NOT_SUPPORTED: "auth/operation-not-supported-in-this-environment",
						POPUP_BLOCKED: "auth/popup-blocked",
						POPUP_CLOSED_BY_USER: "auth/popup-closed-by-user",
						PROVIDER_ALREADY_LINKED: "auth/provider-already-linked",
						QUOTA_EXCEEDED: "auth/quota-exceeded",
						REDIRECT_CANCELLED_BY_USER: "auth/redirect-cancelled-by-user",
						REDIRECT_OPERATION_PENDING: "auth/redirect-operation-pending",
						REJECTED_CREDENTIAL: "auth/rejected-credential",
						SECOND_FACTOR_ALREADY_ENROLLED: "auth/second-factor-already-in-use",
						SECOND_FACTOR_LIMIT_EXCEEDED: "auth/maximum-second-factor-count-exceeded",
						TENANT_ID_MISMATCH: "auth/tenant-id-mismatch",
						TIMEOUT: "auth/timeout",
						TOKEN_EXPIRED: "auth/user-token-expired",
						TOO_MANY_ATTEMPTS_TRY_LATER: "auth/too-many-requests",
						UNAUTHORIZED_DOMAIN: "auth/unauthorized-continue-uri",
						UNSUPPORTED_FIRST_FACTOR: "auth/unsupported-first-factor",
						UNSUPPORTED_PERSISTENCE: "auth/unsupported-persistence-type",
						UNSUPPORTED_TENANT_OPERATION: "auth/unsupported-tenant-operation",
						UNVERIFIED_EMAIL: "auth/unverified-email",
						USER_CANCELLED: "auth/user-cancelled",
						USER_DELETED: "auth/user-not-found",
						USER_DISABLED: "auth/user-disabled",
						USER_MISMATCH: "auth/user-mismatch",
						USER_SIGNED_OUT: "auth/user-signed-out",
						WEAK_PASSWORD: "auth/weak-password",
						WEB_STORAGE_UNSUPPORTED: "auth/web-storage-unsupported",
						ALREADY_INITIALIZED: "auth/already-initialized",
						RECAPTCHA_NOT_ENABLED: "auth/recaptcha-not-enabled",
						MISSING_RECAPTCHA_TOKEN: "auth/missing-recaptcha-token",
						INVALID_RECAPTCHA_TOKEN: "auth/invalid-recaptcha-token",
						INVALID_RECAPTCHA_ACTION: "auth/invalid-recaptcha-action",
						MISSING_CLIENT_TYPE: "auth/missing-client-type",
						MISSING_RECAPTCHA_VERSION: "auth/missing-recaptcha-version",
						INVALID_RECAPTCHA_VERSION: "auth/invalid-recaptcha-version",
						INVALID_REQ_TYPE: "auth/invalid-req-type",
					}),
					(t.ActionCodeOperation = { EMAIL_SIGNIN: "EMAIL_SIGNIN", PASSWORD_RESET: "PASSWORD_RESET", RECOVER_EMAIL: "RECOVER_EMAIL", REVERT_SECOND_FACTOR_ADDITION: "REVERT_SECOND_FACTOR_ADDITION", VERIFY_AND_CHANGE_EMAIL: "VERIFY_AND_CHANGE_EMAIL", VERIFY_EMAIL: "VERIFY_EMAIL" }),
					(t.ActionCodeURL = Ge),
					(t.AuthCredential = Le),
					(t.AuthEventManager = Nn),
					(t.AuthImpl = we),
					(t.AuthPopup = Yn),
					(t.EmailAuthCredential = We),
					(t.EmailAuthProvider = Ke),
					(t.FacebookAuthProvider = Xe),
					(t.FactorId = { PHONE: "phone", TOTP: "totp" }),
					(t.FetchProvider = S),
					(t.GithubAuthProvider = Ze),
					(t.GoogleAuthProvider = Qe),
					(t.OAuthCredential = ze),
					(t.OAuthProvider = Ye),
					(t.OperationType = { LINK: "link", REAUTHENTICATE: "reauthenticate", SIGN_IN: "signIn" }),
					(t.PhoneAuthCredential = qe),
					(t.PhoneAuthProvider = fn),
					(t.PhoneMultiFactorGenerator = rr),
					(t.ProviderId = { FACEBOOK: "facebook.com", GITHUB: "github.com", GOOGLE: "google.com", PASSWORD: "password", PHONE: "phone", TWITTER: "twitter.com" }),
					(t.RecaptchaVerifier = class {
						constructor(e, t, n = Object.assign({}, dn)) {
							(this.parameters = n), (this.type = ln), (this.destroyed = !1), (this.widgetId = null), (this.tokenChangeListeners = new Set()), (this.renderPromise = null), (this.recaptcha = null), (this.auth = be(e)), (this.isInvisible = "invisible" === this.parameters.size), _("undefined" != typeof document, this.auth, "operation-not-supported-in-this-environment");
							const r = "string" == typeof t ? document.getElementById(t) : t;
							_(r, this.auth, "argument-error"), (this.container = r), (this.parameters.callback = this.makeTokenCallback(this.parameters.callback)), (this._recaptchaLoader = this.auth.settings.appVerificationDisabledForTesting ? new un() : new cn()), this.validateStartingState();
						}
						async verify() {
							this.assertNotDestroyed();
							const e = await this.render(),
								t = this.getAssertedRecaptcha();
							return (
								t.getResponse(e) ||
								new Promise((n) => {
									const r = (e) => {
										e && (this.tokenChangeListeners.delete(r), n(e));
									};
									this.tokenChangeListeners.add(r), this.isInvisible && t.execute(e);
								})
							);
						}
						render() {
							try {
								this.assertNotDestroyed();
							} catch (e) {
								return Promise.reject(e);
							}
							return (
								this.renderPromise ||
									(this.renderPromise = this.makeRenderPromise().catch((e) => {
										throw ((this.renderPromise = null), e);
									})),
								this.renderPromise
							);
						}
						_reset() {
							this.assertNotDestroyed(), null !== this.widgetId && this.getAssertedRecaptcha().reset(this.widgetId);
						}
						clear() {
							this.assertNotDestroyed(),
								(this.destroyed = !0),
								this._recaptchaLoader.clearedOneInstance(),
								this.isInvisible ||
									this.container.childNodes.forEach((e) => {
										this.container.removeChild(e);
									});
						}
						validateStartingState() {
							_(!this.parameters.sitekey, this.auth, "argument-error"), _(this.isInvisible || !this.container.hasChildNodes(), this.auth, "argument-error"), _("undefined" != typeof document, this.auth, "operation-not-supported-in-this-environment");
						}
						makeTokenCallback(e) {
							return (t) => {
								if ((this.tokenChangeListeners.forEach((e) => e(t)), "function" == typeof e)) e(t);
								else if ("string" == typeof e) {
									const n = Bt()[e];
									"function" == typeof n && n(t);
								}
							};
						}
						assertNotDestroyed() {
							_(!this.destroyed, this.auth, "internal-error");
						}
						async makeRenderPromise() {
							if ((await this.init(), !this.widgetId)) {
								let e = this.container;
								if (!this.isInvisible) {
									const t = document.createElement("div");
									e.appendChild(t), (e = t);
								}
								this.widgetId = this.getAssertedRecaptcha().render(e, this.parameters);
							}
							return this.widgetId;
						}
						async init() {
							_(b() && !qt(), this.auth, "internal-error"),
								await (function () {
									let e = null;
									return new Promise((t) => {
										"complete" !== document.readyState ? ((e = () => t()), window.addEventListener("load", e)) : t();
									}).catch((t) => {
										throw (e && window.removeEventListener("load", e), t);
									});
								})(),
								(this.recaptcha = await this._recaptchaLoader.load(this.auth, this.auth.languageCode || void 0));
							const e = await (async function (e) {
								return (await C(e, "GET", "/v1/recaptchaParams")).recaptchaSiteKey || "";
							})(this.auth);
							_(e, this.auth, "internal-error"), (this.parameters.sitekey = e);
						}
						getAssertedRecaptcha() {
							return _(this.recaptcha, this.auth, "internal-error"), this.recaptcha;
						}
					}),
					(t.SAMLAuthCredential = et),
					(t.SAMLAuthProvider = tt),
					(t.SignInMethod = { EMAIL_LINK: "emailLink", EMAIL_PASSWORD: "password", FACEBOOK: "facebook.com", GITHUB: "github.com", GOOGLE: "google.com", PHONE: "phone", TWITTER: "twitter.com" }),
					(t.TotpMultiFactorGenerator = ir),
					(t.TotpSecret = sr),
					(t.TwitterAuthProvider = nt),
					(t.UserImpl = te),
					(t._assert = _),
					(t._castAuth = be),
					(t._clearRedirectOutcomes = function () {
						Tn.clear();
					}),
					(t._createError = p),
					(t._fail = h),
					(t._generateEventId = Ht),
					(t._getClientVersion = _e),
					(t._getInstance = re),
					(t._getProjectConfig = Mn),
					(t._getRedirectResult = Cn),
					(t._getRedirectUrl = Qn),
					(t._isAndroid = pe),
					(t._isIOS = ge),
					(t._isIOS7Or8 = function (e = i.getUA()) {
						return /(iPad|iPhone|iPod).*OS 7_\d/i.test(e) || /(iPad|iPhone|iPod).*OS 8_\d/i.test(e);
					}),
					(t._overrideRedirectResult = Pn),
					(t._persistenceKeyName = se),
					(t.applyActionCode = async function (e, t) {
						await (async function (e, t) {
							return C(e, "POST", "/v1/accounts:update", k(e, t));
						})(i.getModularInstance(e), { oobCode: t });
					}),
					(t.beforeAuthStateChanged = Ct),
					(t.browserLocalPersistence = xt),
					(t.browserPopupRedirectResolver = er),
					(t.browserSessionPersistence = Vt),
					(t.checkActionCode = wt),
					(t.confirmPasswordReset = async function (e, t, n) {
						await Me(i.getModularInstance(e), { oobCode: t, newPassword: n }).catch(async (t) => {
							throw ("auth/password-does-not-meet-requirements" === t.code && It(e), t);
						});
					}),
					(t.connectAuthEmulator = Re),
					(t.createUserWithEmailAndPassword = async function (e, t, n) {
						if (r._isFirebaseServerApp(e.app)) return Promise.reject(m(e));
						const i = be(e),
							o = ke(i, { returnSecureToken: !0, email: t, password: n, clientType: "CLIENT_TYPE_WEB" }, "signUpPassword", rt),
							s = await o.catch((t) => {
								throw ("auth/password-does-not-meet-requirements" === t.code && It(e), t);
							}),
							a = await it._fromIdTokenResponse(i, "signIn", s);
						return await i._updateCurrentUser(a.user), a;
					}),
					(t.debugAssert = I),
					(t.debugErrorMap = function () {
						return {
							"admin-restricted-operation": "This operation is restricted to administrators only.",
							"argument-error": "",
							"app-not-authorized": "This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.",
							"app-not-installed": "The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.",
							"captcha-check-failed": "The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.",
							"code-expired": "The SMS code has expired. Please re-send the verification code to try again.",
							"cordova-not-ready": "Cordova framework is not ready.",
							"cors-unsupported": "This browser is not supported.",
							"credential-already-in-use": "This credential is already associated with a different user account.",
							"custom-token-mismatch": "The custom token corresponds to a different audience.",
							"requires-recent-login": "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
							"dependent-sdk-initialized-before-auth": "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.",
							"dynamic-link-not-activated": "Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.",
							"email-change-needs-verification": "Multi-factor users must always have a verified email.",
							"email-already-in-use": "The email address is already in use by another account.",
							"emulator-config-failed": 'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',
							"expired-action-code": "The action code has expired.",
							"cancelled-popup-request": "This operation has been cancelled due to another conflicting popup being opened.",
							"internal-error": "An internal AuthError has occurred.",
							"invalid-app-credential": "The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.",
							"invalid-app-id": "The mobile app identifier is not registed for the current project.",
							"invalid-user-token": "This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.",
							"invalid-auth-event": "An internal AuthError has occurred.",
							"invalid-verification-code": "The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.",
							"invalid-continue-uri": "The continue URL provided in the request is invalid.",
							"invalid-cordova-configuration": "The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.",
							"invalid-custom-token": "The custom token format is incorrect. Please check the documentation.",
							"invalid-dynamic-link-domain": "The provided dynamic link domain is not configured or authorized for the current project.",
							"invalid-email": "The email address is badly formatted.",
							"invalid-emulator-scheme": "Emulator URL must start with a valid scheme (http:// or https://).",
							"invalid-api-key": "Your API key is invalid, please check you have copied it correctly.",
							"invalid-cert-hash": "The SHA-1 certificate hash provided is invalid.",
							"invalid-credential": "The supplied auth credential is incorrect, malformed or has expired.",
							"invalid-message-payload": "The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.",
							"invalid-multi-factor-session": "The request does not contain a valid proof of first factor successful sign-in.",
							"invalid-oauth-provider": "EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.",
							"invalid-oauth-client-id": "The OAuth client ID provided is either invalid or does not match the specified API key.",
							"unauthorized-domain": "This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.",
							"invalid-action-code": "The action code is invalid. This can happen if the code is malformed, expired, or has already been used.",
							"wrong-password": "The password is invalid or the user does not have a password.",
							"invalid-persistence-type": "The specified persistence type is invalid. It can only be local, session or none.",
							"invalid-phone-number": "The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].",
							"invalid-provider-id": "The specified provider ID is invalid.",
							"invalid-recipient-email": "The email corresponding to this action failed to send as the provided recipient email address is invalid.",
							"invalid-sender": "The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.",
							"invalid-verification-id": "The verification ID used to create the phone auth credential is invalid.",
							"invalid-tenant-id": "The Auth instance's tenant ID is invalid.",
							"login-blocked": "Login blocked by user-provided method: {$originalMessage}",
							"missing-android-pkg-name": "An Android Package Name must be provided if the Android App is required to be installed.",
							"auth-domain-config-required": "Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.",
							"missing-app-credential": "The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.",
							"missing-verification-code": "The phone auth credential was created with an empty SMS verification code.",
							"missing-continue-uri": "A continue URL must be provided in the request.",
							"missing-iframe-start": "An internal AuthError has occurred.",
							"missing-ios-bundle-id": "An iOS Bundle ID must be provided if an App Store ID is provided.",
							"missing-or-invalid-nonce": "The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.",
							"missing-password": "A non-empty password must be provided",
							"missing-multi-factor-info": "No second factor identifier is provided.",
							"missing-multi-factor-session": "The request is missing proof of first factor successful sign-in.",
							"missing-phone-number": "To send verification codes, provide a phone number for the recipient.",
							"missing-verification-id": "The phone auth credential was created with an empty verification ID.",
							"app-deleted": "This instance of FirebaseApp has been deleted.",
							"multi-factor-info-not-found": "The user does not have a second factor matching the identifier provided.",
							"multi-factor-auth-required": "Proof of ownership of a second factor is required to complete sign-in.",
							"account-exists-with-different-credential": "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
							"network-request-failed": "A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.",
							"no-auth-event": "An internal AuthError has occurred.",
							"no-such-provider": "User was not linked to an account with the given provider.",
							"null-user": "A null user object was provided as the argument for an operation which requires a non-null user object.",
							"operation-not-allowed": "The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.",
							"operation-not-supported-in-this-environment": 'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',
							"popup-blocked": "Unable to establish a connection with the popup. It may have been blocked by the browser.",
							"popup-closed-by-user": "The popup has been closed by the user before finalizing the operation.",
							"provider-already-linked": "User can only be linked to one identity for the given provider.",
							"quota-exceeded": "The project's quota for this operation has been exceeded.",
							"redirect-cancelled-by-user": "The redirect operation has been cancelled by the user before finalizing.",
							"redirect-operation-pending": "A redirect sign-in operation is already pending.",
							"rejected-credential": "The request contains malformed or mismatching credentials.",
							"second-factor-already-in-use": "The second factor is already enrolled on this account.",
							"maximum-second-factor-count-exceeded": "The maximum allowed number of second factors on a user has been exceeded.",
							"tenant-id-mismatch": "The provided tenant ID does not match the Auth instance's tenant ID",
							timeout: "The operation has timed out.",
							"user-token-expired": "The user's credential is no longer valid. The user must sign in again.",
							"too-many-requests": "We have blocked all requests from this device due to unusual activity. Try again later.",
							"unauthorized-continue-uri": "The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.",
							"unsupported-first-factor": "Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.",
							"unsupported-persistence-type": "The current environment does not support the specified persistence type.",
							"unsupported-tenant-operation": "This operation is not supported in a multi-tenant context.",
							"unverified-email": "The operation requires a verified email.",
							"user-cancelled": "The user did not grant your application the permissions it requested.",
							"user-not-found": "There is no user record corresponding to this identifier. The user may have been deleted.",
							"user-disabled": "The user account has been disabled by an administrator.",
							"user-mismatch": "The supplied credentials do not correspond to the previously signed in user.",
							"user-signed-out": "",
							"weak-password": "The password must be 6 characters long or more.",
							"web-storage-unsupported": "This browser is not supported or 3rd party cookies and data may be disabled.",
							"already-initialized": "initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.",
							"missing-recaptcha-token": "The reCAPTCHA token is missing when sending request to the backend.",
							"invalid-recaptcha-token": "The reCAPTCHA token is invalid when sending request to the backend.",
							"invalid-recaptcha-action": "The reCAPTCHA action is invalid when sending request to the backend.",
							"recaptcha-not-enabled": "reCAPTCHA Enterprise integration is not enabled for this project.",
							"missing-client-type": "The reCAPTCHA client type is missing when sending request to the backend.",
							"missing-recaptcha-version": "The reCAPTCHA version is missing when sending request to the backend.",
							"invalid-req-type": "Invalid request parameters.",
							"invalid-recaptcha-version": "The reCAPTCHA version is invalid when sending request to the backend.",
							"unsupported-password-policy-schema-version": "The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.",
							"password-does-not-meet-requirements": "The password does not meet the requirements.",
						};
					}),
					(t.deleteUser = async function (e) {
						return i.getModularInstance(e).delete();
					}),
					(t.fetchSignInMethodsForEmail = async function (e, t) {
						const n = { identifier: t, continueUri: b() ? w() : "http://localhost" },
							{ signinMethods: r } = await (async function (e, t) {
								return C(e, "POST", "/v1/accounts:createAuthUri", k(e, t));
							})(i.getModularInstance(e), n);
						return r || [];
					}),
					(t.getAdditionalUserInfo = function (e) {
						const { user: t, _tokenResponse: n } = e;
						return t.isAnonymous && !n
							? { providerId: null, isNewUser: !1, profile: null }
							: (function (e) {
									var t, n;
									if (!e) return null;
									const { providerId: r } = e,
										i = e.rawUserInfo ? JSON.parse(e.rawUserInfo) : {},
										o = e.isNewUser || "identitytoolkit#SignupNewUserResponse" === e.kind;
									if (!r && (null == e ? void 0 : e.idToken)) {
										const r = null === (n = null === (t = q(e.idToken)) || void 0 === t ? void 0 : t.firebase) || void 0 === n ? void 0 : n.sign_in_provider;
										if (r) return new Et(o, "anonymous" !== r && "custom" !== r ? r : null);
									}
									if (!r) return null;
									switch (r) {
										case "facebook.com":
											return new At(o, i);
										case "github.com":
											return new St(o, i);
										case "google.com":
											return new Pt(o, i);
										case "twitter.com":
											return new Ot(o, i, e.screenName || null);
										case "custom":
										case "anonymous":
											return new Et(o, null);
										default:
											return new Et(o, r, i);
									}
							  })(n);
					}),
					(t.getAuth = function (e = r.getApp()) {
						const t = r._getProvider(e, "auth");
						if (t.isInitialized()) return t.getImmediate();
						const n = Ce(e, { popupRedirectResolver: er, persistence: [tn, xt, Vt] }),
							o = i.getExperimentalSetting("authTokenSyncURL");
						if (o && "boolean" == typeof isSecureContext && isSecureContext) {
							const e = new URL(o, location.origin);
							if (location.origin === e.origin) {
								const t =
									((s = e.toString()),
									async (e) => {
										const t = e && (await e.getIdTokenResult()),
											n = t && (new Date().getTime() - Date.parse(t.issuedAtTime)) / 1e3;
										if (n && n > dr) return;
										const r = null == t ? void 0 : t.token;
										hr !== r && ((hr = r), await fetch(s, { method: r ? "POST" : "DELETE", headers: r ? { Authorization: `Bearer ${r}` } : {} }));
									});
								Ct(n, t, () => t(n.currentUser)), kt(n, (e) => t(e));
							}
						}
						var s;
						const a = i.getDefaultEmulatorHost("auth");
						return a && Re(n, `http://${a}`), n;
					}),
					(t.getIdToken = function (e, t = !1) {
						return i.getModularInstance(e).getIdToken(t);
					}),
					(t.getIdTokenResult = z),
					(t.getMultiFactorResolver = function (e, t) {
						var n;
						const r = i.getModularInstance(e),
							o = t;
						return _(t.customData.operationType, r, "argument-error"), _(null === (n = o.customData._serverResponse) || void 0 === n ? void 0 : n.mfaPendingCredential, r, "argument-error"), Nt._fromError(r, o);
					}),
					(t.getRedirectResult = async function (e, t) {
						return await be(e)._initializationPromise, Cn(e, t, !1);
					}),
					(t.inMemoryPersistence = oe),
					(t.indexedDBLocalPersistence = tn),
					(t.initializeAuth = Ce),
					(t.initializeRecaptchaConfig = function (e) {
						return (async function (e) {
							const t = be(e),
								n = await V(t, { clientType: "CLIENT_TYPE_WEB", version: "RECAPTCHA_ENTERPRISE" }),
								r = new j(n);
							null == t.tenantId ? (t._agentRecaptchaConfig = r) : (t._tenantRecaptchaConfigs[t.tenantId] = r), r.isProviderEnabled("EMAIL_PASSWORD_PROVIDER") && new Pe(t).verify();
						})(e);
					}),
					(t.isSignInWithEmailLink = function (e, t) {
						const n = Ge.parseLink(t);
						return "EMAIL_SIGNIN" === (null == n ? void 0 : n.operation);
					}),
					(t.linkWithCredential = ft),
					(t.linkWithPhoneNumber = async function (e, t, n) {
						const r = i.getModularInstance(e);
						await lt(!1, r, "phone");
						const o = await pn(r.auth, t, i.getModularInstance(n));
						return new hn(o, (e) => ft(r, e));
					}),
					(t.linkWithPopup = async function (e, t, n) {
						const r = i.getModularInstance(e);
						g(r.auth, t, $e);
						const o = mn(r.auth, n);
						return new bn(r.auth, "linkViaPopup", t, o, r).executeNotNull();
					}),
					(t.linkWithRedirect = function (e, t, n) {
						return (async function (e, t, n) {
							const r = i.getModularInstance(e);
							g(r.auth, t, $e), await r.auth._initializationPromise;
							const o = mn(r.auth, n);
							await lt(!1, r, t.providerId), await Sn(o, r.auth);
							const s = await Rn(r);
							return o._openRedirect(r.auth, t, "linkViaRedirect", s);
						})(e, t, n);
					}),
					(t.multiFactor = function (e) {
						const t = i.getModularInstance(e);
						return Lt.has(t) || Lt.set(t, Dt._fromUser(t)), Lt.get(t);
					}),
					(t.onAuthStateChanged = function (e, t, n, r) {
						return i.getModularInstance(e).onAuthStateChanged(t, n, r);
					}),
					(t.onIdTokenChanged = kt),
					(t.parseActionCodeURL = function (e) {
						return Ge.parseLink(e);
					}),
					(t.prodErrorMap = c),
					(t.reauthenticateWithCredential = mt),
					(t.reauthenticateWithPhoneNumber = async function (e, t, n) {
						const o = i.getModularInstance(e);
						if (r._isFirebaseServerApp(o.auth.app)) return Promise.reject(m(o.auth));
						const s = await pn(o.auth, t, i.getModularInstance(n));
						return new hn(s, (e) => mt(o, e));
					}),
					(t.reauthenticateWithPopup = async function (e, t, n) {
						const o = i.getModularInstance(e);
						if (r._isFirebaseServerApp(o.auth.app)) return Promise.reject(p(o.auth, "operation-not-supported-in-this-environment"));
						g(o.auth, t, $e);
						const s = mn(o.auth, n);
						return new bn(o.auth, "reauthViaPopup", t, s, o).executeNotNull();
					}),
					(t.reauthenticateWithRedirect = function (e, t, n) {
						return (async function (e, t, n) {
							const o = i.getModularInstance(e);
							if ((g(o.auth, t, $e), r._isFirebaseServerApp(o.auth.app))) return Promise.reject(m(o.auth));
							await o.auth._initializationPromise;
							const s = mn(o.auth, n);
							await Sn(s, o.auth);
							const a = await Rn(o);
							return s._openRedirect(o.auth, t, "reauthViaRedirect", a);
						})(e, t, n);
					}),
					(t.reload = X),
					(t.revokeAccessToken = function (e, t) {
						return be(e).revokeAccessToken(t);
					}),
					(t.sendEmailVerification = async function (e, t) {
						const n = i.getModularInstance(e),
							r = { requestType: "VERIFY_EMAIL", idToken: await e.getIdToken() };
						t && yt(n.auth, r, t);
						const { email: o } = await (async function (e, t) {
							return xe(e, t);
						})(n.auth, r);
						o !== e.email && (await e.reload());
					}),
					(t.sendPasswordResetEmail = async function (e, t, n) {
						const r = be(e),
							i = { requestType: "PASSWORD_RESET", email: t, clientType: "CLIENT_TYPE_WEB" };
						n && yt(r, i, n), await ke(r, i, "getOobCode", je);
					}),
					(t.sendSignInLinkToEmail = async function (e, t, n) {
						const r = be(e),
							i = { requestType: "EMAIL_SIGNIN", email: t, clientType: "CLIENT_TYPE_WEB" };
						!(function (e, t) {
							_(t.handleCodeInApp, r, "argument-error"), t && yt(r, e, t);
						})(i, n),
							await ke(r, i, "getOobCode", Ve);
					}),
					(t.setPersistence = function (e, t) {
						return i.getModularInstance(e).setPersistence(t);
					}),
					(t.signInAnonymously = async function (e) {
						var t;
						if (r._isFirebaseServerApp(e.app)) return Promise.reject(m(e));
						const n = be(e);
						if ((await n._initializationPromise, null === (t = n.currentUser) || void 0 === t ? void 0 : t.isAnonymous)) return new it({ user: n.currentUser, providerId: null, operationType: "signIn" });
						const i = await rt(n, { returnSecureToken: !0 }),
							o = await it._fromIdTokenResponse(n, "signIn", i, !0);
						return await n._updateCurrentUser(o.user), o;
					}),
					(t.signInWithCredential = pt),
					(t.signInWithCustomToken = async function (e, t) {
						if (r._isFirebaseServerApp(e.app)) return Promise.reject(m(e));
						const n = be(e),
							i = await (async function (e, t) {
								return N(e, "POST", "/v1/accounts:signInWithCustomToken", k(e, t));
							})(n, { token: t, returnSecureToken: !0 }),
							o = await it._fromIdTokenResponse(n, "signIn", i);
						return await n._updateCurrentUser(o.user), o;
					}),
					(t.signInWithEmailAndPassword = function (e, t, n) {
						return r._isFirebaseServerApp(e.app)
							? Promise.reject(m(e))
							: pt(i.getModularInstance(e), Ke.credential(t, n)).catch(async (t) => {
									throw ("auth/password-does-not-meet-requirements" === t.code && It(e), t);
							  });
					}),
					(t.signInWithEmailLink = async function (e, t, n) {
						if (r._isFirebaseServerApp(e.app)) return Promise.reject(m(e));
						const o = i.getModularInstance(e),
							s = Ke.credentialWithLink(t, n || w());
						return _(s._tenantId === (o.tenantId || null), o, "tenant-id-mismatch"), pt(o, s);
					}),
					(t.signInWithPhoneNumber = async function (e, t, n) {
						if (r._isFirebaseServerApp(e.app)) return Promise.reject(m(e));
						const o = be(e),
							s = await pn(o, t, i.getModularInstance(n));
						return new hn(s, (e) => pt(o, e));
					}),
					(t.signInWithPopup = async function (e, t, n) {
						if (r._isFirebaseServerApp(e.app)) return Promise.reject(p(e, "operation-not-supported-in-this-environment"));
						const i = be(e);
						g(e, t, $e);
						const o = mn(i, n);
						return new bn(i, "signInViaPopup", t, o).executeNotNull();
					}),
					(t.signInWithRedirect = function (e, t, n) {
						return (async function (e, t, n) {
							if (r._isFirebaseServerApp(e.app)) return Promise.reject(m(e));
							const i = be(e);
							g(e, t, $e), await i._initializationPromise;
							const o = mn(i, n);
							return await Sn(o, i), o._openRedirect(i, t, "signInViaRedirect");
						})(e, t, n);
					}),
					(t.signOut = function (e) {
						return i.getModularInstance(e).signOut();
					}),
					(t.unlink = async function (e, t) {
						const n = i.getModularInstance(e);
						await lt(!0, n, t);
						const { providerUserInfo: r } = await (async function (e, t) {
								return C(e, "POST", "/v1/accounts:update", t);
							})(n.auth, { idToken: await n.getIdToken(), deleteProvider: [t] }),
							o = ct(r || []);
						return (n.providerData = n.providerData.filter((e) => o.has(e.providerId))), o.has("phone") || (n.phoneNumber = null), await n.auth._persistUserIfCurrent(n), n;
					}),
					(t.updateCurrentUser = function (e, t) {
						return i.getModularInstance(e).updateCurrentUser(t);
					}),
					(t.updateEmail = function (e, t) {
						const n = i.getModularInstance(e);
						return r._isFirebaseServerApp(n.auth.app) ? Promise.reject(m(n.auth)) : bt(n, t, null);
					}),
					(t.updatePassword = function (e, t) {
						return bt(i.getModularInstance(e), null, t);
					}),
					(t.updatePhoneNumber = async function (e, t) {
						const n = i.getModularInstance(e);
						if (r._isFirebaseServerApp(n.auth.app)) return Promise.reject(m(n.auth));
						await ut(n, t);
					}),
					(t.updateProfile = async function (e, { displayName: t, photoURL: n }) {
						if (void 0 === t && void 0 === n) return;
						const r = i.getModularInstance(e),
							o = { idToken: await r.getIdToken(), displayName: t, photoUrl: n, returnSecureToken: !0 },
							s = await K(
								r,
								(async function (e, t) {
									return C(e, "POST", "/v1/accounts:update", t);
								})(r.auth, o)
							);
						(r.displayName = s.displayName || null), (r.photoURL = s.photoUrl || null);
						const a = r.providerData.find(({ providerId: e }) => "password" === e);
						a && ((a.displayName = r.displayName), (a.photoURL = r.photoURL)), await r._updateTokensIfNecessary(s);
					}),
					(t.useDeviceLanguage = function (e) {
						i.getModularInstance(e).useDeviceLanguage();
					}),
					(t.validatePassword = async function (e, t) {
						return be(e).validatePassword(t);
					}),
					(t.verifyBeforeUpdateEmail = async function (e, t, n) {
						const r = i.getModularInstance(e),
							o = { requestType: "VERIFY_AND_CHANGE_EMAIL", idToken: await e.getIdToken(), newEmail: t };
						n && yt(r.auth, o, n);
						const { email: s } = await (async function (e, t) {
							return xe(e, t);
						})(r.auth, o);
						s !== e.email && (await e.reload());
					}),
					(t.verifyPasswordResetCode = async function (e, t) {
						const { data: n } = await wt(i.getModularInstance(e), t);
						return n.email;
					});
			},
			970: (e, t, n) => {
				Object.defineProperty(t, "__esModule", { value: !0 });
				var r = n(194);
				n(199),
					n(336),
					n(844),
					n(635),
					n(319),
					(t.ActionCodeOperation = r.ActionCodeOperation),
					(t.ActionCodeURL = r.ActionCodeURL),
					(t.AuthCredential = r.AuthCredential),
					(t.AuthErrorCodes = r.AUTH_ERROR_CODES_MAP_DO_NOT_USE_INTERNALLY),
					(t.EmailAuthCredential = r.EmailAuthCredential),
					(t.EmailAuthProvider = r.EmailAuthProvider),
					(t.FacebookAuthProvider = r.FacebookAuthProvider),
					(t.FactorId = r.FactorId),
					(t.GithubAuthProvider = r.GithubAuthProvider),
					(t.GoogleAuthProvider = r.GoogleAuthProvider),
					(t.OAuthCredential = r.OAuthCredential),
					(t.OAuthProvider = r.OAuthProvider),
					(t.OperationType = r.OperationType),
					(t.PhoneAuthCredential = r.PhoneAuthCredential),
					(t.PhoneAuthProvider = r.PhoneAuthProvider),
					(t.PhoneMultiFactorGenerator = r.PhoneMultiFactorGenerator),
					(t.ProviderId = r.ProviderId),
					(t.RecaptchaVerifier = r.RecaptchaVerifier),
					(t.SAMLAuthProvider = r.SAMLAuthProvider),
					(t.SignInMethod = r.SignInMethod),
					(t.TotpMultiFactorGenerator = r.TotpMultiFactorGenerator),
					(t.TotpSecret = r.TotpSecret),
					(t.TwitterAuthProvider = r.TwitterAuthProvider),
					(t.applyActionCode = r.applyActionCode),
					(t.beforeAuthStateChanged = r.beforeAuthStateChanged),
					(t.browserLocalPersistence = r.browserLocalPersistence),
					(t.browserPopupRedirectResolver = r.browserPopupRedirectResolver),
					(t.browserSessionPersistence = r.browserSessionPersistence),
					(t.checkActionCode = r.checkActionCode),
					(t.confirmPasswordReset = r.confirmPasswordReset),
					(t.connectAuthEmulator = r.connectAuthEmulator),
					(t.createUserWithEmailAndPassword = r.createUserWithEmailAndPassword),
					(t.debugErrorMap = r.debugErrorMap),
					(t.deleteUser = r.deleteUser),
					(t.fetchSignInMethodsForEmail = r.fetchSignInMethodsForEmail),
					(t.getAdditionalUserInfo = r.getAdditionalUserInfo),
					(t.getAuth = r.getAuth),
					(t.getIdToken = r.getIdToken),
					(t.getIdTokenResult = r.getIdTokenResult),
					(t.getMultiFactorResolver = r.getMultiFactorResolver),
					(t.getRedirectResult = r.getRedirectResult),
					(t.inMemoryPersistence = r.inMemoryPersistence),
					(t.indexedDBLocalPersistence = r.indexedDBLocalPersistence),
					(t.initializeAuth = r.initializeAuth),
					(t.initializeRecaptchaConfig = r.initializeRecaptchaConfig),
					(t.isSignInWithEmailLink = r.isSignInWithEmailLink),
					(t.linkWithCredential = r.linkWithCredential),
					(t.linkWithPhoneNumber = r.linkWithPhoneNumber),
					(t.linkWithPopup = r.linkWithPopup),
					(t.linkWithRedirect = r.linkWithRedirect),
					(t.multiFactor = r.multiFactor),
					(t.onAuthStateChanged = r.onAuthStateChanged),
					(t.onIdTokenChanged = r.onIdTokenChanged),
					(t.parseActionCodeURL = r.parseActionCodeURL),
					(t.prodErrorMap = r.prodErrorMap),
					(t.reauthenticateWithCredential = r.reauthenticateWithCredential),
					(t.reauthenticateWithPhoneNumber = r.reauthenticateWithPhoneNumber),
					(t.reauthenticateWithPopup = r.reauthenticateWithPopup),
					(t.reauthenticateWithRedirect = r.reauthenticateWithRedirect),
					(t.reload = r.reload),
					(t.revokeAccessToken = r.revokeAccessToken),
					(t.sendEmailVerification = r.sendEmailVerification),
					(t.sendPasswordResetEmail = r.sendPasswordResetEmail),
					(t.sendSignInLinkToEmail = r.sendSignInLinkToEmail),
					(t.setPersistence = r.setPersistence),
					(t.signInAnonymously = r.signInAnonymously),
					(t.signInWithCredential = r.signInWithCredential),
					(t.signInWithCustomToken = r.signInWithCustomToken),
					(t.signInWithEmailAndPassword = r.signInWithEmailAndPassword),
					(t.signInWithEmailLink = r.signInWithEmailLink),
					(t.signInWithPhoneNumber = r.signInWithPhoneNumber),
					(t.signInWithPopup = r.signInWithPopup),
					(t.signInWithRedirect = r.signInWithRedirect),
					(t.signOut = r.signOut),
					(t.unlink = r.unlink),
					(t.updateCurrentUser = r.updateCurrentUser),
					(t.updateEmail = r.updateEmail),
					(t.updatePassword = r.updatePassword),
					(t.updatePhoneNumber = r.updatePhoneNumber),
					(t.updateProfile = r.updateProfile),
					(t.useDeviceLanguage = r.useDeviceLanguage),
					(t.validatePassword = r.validatePassword),
					(t.verifyBeforeUpdateEmail = r.verifyBeforeUpdateEmail),
					(t.verifyPasswordResetCode = r.verifyPasswordResetCode);
			},
			319: (e, t, n) => {
				Object.defineProperty(t, "__esModule", { value: !0 });
				var r = n(635),
					i = n(336),
					o = (function () {
						function e(e, t, n) {
							(this.name = e), (this.instanceFactory = t), (this.type = n), (this.multipleInstances = !1), (this.serviceProps = {}), (this.instantiationMode = "LAZY"), (this.onInstanceCreated = null);
						}
						return (
							(e.prototype.setInstantiationMode = function (e) {
								return (this.instantiationMode = e), this;
							}),
							(e.prototype.setMultipleInstances = function (e) {
								return (this.multipleInstances = e), this;
							}),
							(e.prototype.setServiceProps = function (e) {
								return (this.serviceProps = e), this;
							}),
							(e.prototype.setInstanceCreatedCallback = function (e) {
								return (this.onInstanceCreated = e), this;
							}),
							e
						);
					})(),
					s = "[DEFAULT]",
					a = (function () {
						function e(e, t) {
							(this.name = e), (this.container = t), (this.component = null), (this.instances = new Map()), (this.instancesDeferred = new Map()), (this.instancesOptions = new Map()), (this.onInitCallbacks = new Map());
						}
						return (
							(e.prototype.get = function (e) {
								var t = this.normalizeInstanceIdentifier(e);
								if (!this.instancesDeferred.has(t)) {
									var n = new i.Deferred();
									if ((this.instancesDeferred.set(t, n), this.isInitialized(t) || this.shouldAutoInitialize()))
										try {
											var r = this.getOrInitializeService({ instanceIdentifier: t });
											r && n.resolve(r);
										} catch (e) {}
								}
								return this.instancesDeferred.get(t).promise;
							}),
							(e.prototype.getImmediate = function (e) {
								var t,
									n = this.normalizeInstanceIdentifier(null == e ? void 0 : e.identifier),
									r = null !== (t = null == e ? void 0 : e.optional) && void 0 !== t && t;
								if (!this.isInitialized(n) && !this.shouldAutoInitialize()) {
									if (r) return null;
									throw Error("Service ".concat(this.name, " is not available"));
								}
								try {
									return this.getOrInitializeService({ instanceIdentifier: n });
								} catch (e) {
									if (r) return null;
									throw e;
								}
							}),
							(e.prototype.getComponent = function () {
								return this.component;
							}),
							(e.prototype.setComponent = function (e) {
								var t, n;
								if (e.name !== this.name) throw Error("Mismatching Component ".concat(e.name, " for Provider ").concat(this.name, "."));
								if (this.component) throw Error("Component for ".concat(this.name, " has already been provided"));
								if (((this.component = e), this.shouldAutoInitialize())) {
									if (
										(function (e) {
											return "EAGER" === e.instantiationMode;
										})(e)
									)
										try {
											this.getOrInitializeService({ instanceIdentifier: s });
										} catch (e) {}
									try {
										for (var i = r.__values(this.instancesDeferred.entries()), o = i.next(); !o.done; o = i.next()) {
											var a = r.__read(o.value, 2),
												c = a[0],
												u = a[1],
												l = this.normalizeInstanceIdentifier(c);
											try {
												var d = this.getOrInitializeService({ instanceIdentifier: l });
												u.resolve(d);
											} catch (e) {}
										}
									} catch (e) {
										t = { error: e };
									} finally {
										try {
											o && !o.done && (n = i.return) && n.call(i);
										} finally {
											if (t) throw t.error;
										}
									}
								}
							}),
							(e.prototype.clearInstance = function (e) {
								void 0 === e && (e = s), this.instancesDeferred.delete(e), this.instancesOptions.delete(e), this.instances.delete(e);
							}),
							(e.prototype.delete = function () {
								return r.__awaiter(this, void 0, void 0, function () {
									var e;
									return r.__generator(this, function (t) {
										switch (t.label) {
											case 0:
												return (
													(e = Array.from(this.instances.values())),
													[
														4,
														Promise.all(
															r.__spreadArray(
																r.__spreadArray(
																	[],
																	r.__read(
																		e
																			.filter(function (e) {
																				return "INTERNAL" in e;
																			})
																			.map(function (e) {
																				return e.INTERNAL.delete();
																			})
																	),
																	!1
																),
																r.__read(
																	e
																		.filter(function (e) {
																			return "_delete" in e;
																		})
																		.map(function (e) {
																			return e._delete();
																		})
																),
																!1
															)
														),
													]
												);
											case 1:
												return t.sent(), [2];
										}
									});
								});
							}),
							(e.prototype.isComponentSet = function () {
								return null != this.component;
							}),
							(e.prototype.isInitialized = function (e) {
								return void 0 === e && (e = s), this.instances.has(e);
							}),
							(e.prototype.getOptions = function (e) {
								return void 0 === e && (e = s), this.instancesOptions.get(e) || {};
							}),
							(e.prototype.initialize = function (e) {
								var t, n;
								void 0 === e && (e = {});
								var i = e.options,
									o = void 0 === i ? {} : i,
									s = this.normalizeInstanceIdentifier(e.instanceIdentifier);
								if (this.isInitialized(s)) throw Error("".concat(this.name, "(").concat(s, ") has already been initialized"));
								if (!this.isComponentSet()) throw Error("Component ".concat(this.name, " has not been registered yet"));
								var a = this.getOrInitializeService({ instanceIdentifier: s, options: o });
								try {
									for (var c = r.__values(this.instancesDeferred.entries()), u = c.next(); !u.done; u = c.next()) {
										var l = r.__read(u.value, 2),
											d = l[0],
											h = l[1];
										s === this.normalizeInstanceIdentifier(d) && h.resolve(a);
									}
								} catch (e) {
									t = { error: e };
								} finally {
									try {
										u && !u.done && (n = c.return) && n.call(c);
									} finally {
										if (t) throw t.error;
									}
								}
								return a;
							}),
							(e.prototype.onInit = function (e, t) {
								var n,
									r = this.normalizeInstanceIdentifier(t),
									i = null !== (n = this.onInitCallbacks.get(r)) && void 0 !== n ? n : new Set();
								i.add(e), this.onInitCallbacks.set(r, i);
								var o = this.instances.get(r);
								return (
									o && e(o, r),
									function () {
										i.delete(e);
									}
								);
							}),
							(e.prototype.invokeOnInitCallbacks = function (e, t) {
								var n,
									i,
									o = this.onInitCallbacks.get(t);
								if (o)
									try {
										for (var s = r.__values(o), a = s.next(); !a.done; a = s.next()) {
											var c = a.value;
											try {
												c(e, t);
											} catch (e) {}
										}
									} catch (e) {
										n = { error: e };
									} finally {
										try {
											a && !a.done && (i = s.return) && i.call(s);
										} finally {
											if (n) throw n.error;
										}
									}
							}),
							(e.prototype.getOrInitializeService = function (e) {
								var t,
									n = e.instanceIdentifier,
									r = e.options,
									i = void 0 === r ? {} : r,
									o = this.instances.get(n);
								if (!o && this.component && ((o = this.component.instanceFactory(this.container, { instanceIdentifier: ((t = n), t === s ? void 0 : t), options: i })), this.instances.set(n, o), this.instancesOptions.set(n, i), this.invokeOnInitCallbacks(o, n), this.component.onInstanceCreated))
									try {
										this.component.onInstanceCreated(this.container, n, o);
									} catch (e) {}
								return o || null;
							}),
							(e.prototype.normalizeInstanceIdentifier = function (e) {
								return void 0 === e && (e = s), this.component ? (this.component.multipleInstances ? e : s) : e;
							}),
							(e.prototype.shouldAutoInitialize = function () {
								return !!this.component && "EXPLICIT" !== this.component.instantiationMode;
							}),
							e
						);
					})(),
					c = (function () {
						function e(e) {
							(this.name = e), (this.providers = new Map());
						}
						return (
							(e.prototype.addComponent = function (e) {
								var t = this.getProvider(e.name);
								if (t.isComponentSet()) throw new Error("Component ".concat(e.name, " has already been registered with ").concat(this.name));
								t.setComponent(e);
							}),
							(e.prototype.addOrOverwriteComponent = function (e) {
								this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name), this.addComponent(e);
							}),
							(e.prototype.getProvider = function (e) {
								if (this.providers.has(e)) return this.providers.get(e);
								var t = new a(e, this);
								return this.providers.set(e, t), t;
							}),
							(e.prototype.getProviders = function () {
								return Array.from(this.providers.values());
							}),
							e
						);
					})();
				(t.Component = o), (t.ComponentContainer = c), (t.Provider = a);
			},
			844: (e, t, n) => {
				Object.defineProperty(t, "__esModule", { value: !0 });
				var r,
					i,
					o = n(635),
					s = [];
				(t.LogLevel = void 0), ((i = t.LogLevel || (t.LogLevel = {}))[(i.DEBUG = 0)] = "DEBUG"), (i[(i.VERBOSE = 1)] = "VERBOSE"), (i[(i.INFO = 2)] = "INFO"), (i[(i.WARN = 3)] = "WARN"), (i[(i.ERROR = 4)] = "ERROR"), (i[(i.SILENT = 5)] = "SILENT");
				var a = { debug: t.LogLevel.DEBUG, verbose: t.LogLevel.VERBOSE, info: t.LogLevel.INFO, warn: t.LogLevel.WARN, error: t.LogLevel.ERROR, silent: t.LogLevel.SILENT },
					c = t.LogLevel.INFO,
					u = (((r = {})[t.LogLevel.DEBUG] = "log"), (r[t.LogLevel.VERBOSE] = "log"), (r[t.LogLevel.INFO] = "info"), (r[t.LogLevel.WARN] = "warn"), (r[t.LogLevel.ERROR] = "error"), r),
					l = function (e, t) {
						for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
						if (!(t < e.logLevel)) {
							var i = new Date().toISOString(),
								s = u[t];
							if (!s) throw new Error("Attempted to log a message with an invalid logType (value: ".concat(t, ")"));
							console[s].apply(console, o.__spreadArray(["[".concat(i, "]  ").concat(e.name, ":")], n, !1));
						}
					},
					d = (function () {
						function e(e) {
							(this.name = e), (this._logLevel = c), (this._logHandler = l), (this._userLogHandler = null), s.push(this);
						}
						return (
							Object.defineProperty(e.prototype, "logLevel", {
								get: function () {
									return this._logLevel;
								},
								set: function (e) {
									if (!(e in t.LogLevel)) throw new TypeError('Invalid value "'.concat(e, '" assigned to `logLevel`'));
									this._logLevel = e;
								},
								enumerable: !1,
								configurable: !0,
							}),
							(e.prototype.setLogLevel = function (e) {
								this._logLevel = "string" == typeof e ? a[e] : e;
							}),
							Object.defineProperty(e.prototype, "logHandler", {
								get: function () {
									return this._logHandler;
								},
								set: function (e) {
									if ("function" != typeof e) throw new TypeError("Value assigned to `logHandler` must be a function");
									this._logHandler = e;
								},
								enumerable: !1,
								configurable: !0,
							}),
							Object.defineProperty(e.prototype, "userLogHandler", {
								get: function () {
									return this._userLogHandler;
								},
								set: function (e) {
									this._userLogHandler = e;
								},
								enumerable: !1,
								configurable: !0,
							}),
							(e.prototype.debug = function () {
								for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
								this._userLogHandler && this._userLogHandler.apply(this, o.__spreadArray([this, t.LogLevel.DEBUG], e, !1)), this._logHandler.apply(this, o.__spreadArray([this, t.LogLevel.DEBUG], e, !1));
							}),
							(e.prototype.log = function () {
								for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
								this._userLogHandler && this._userLogHandler.apply(this, o.__spreadArray([this, t.LogLevel.VERBOSE], e, !1)), this._logHandler.apply(this, o.__spreadArray([this, t.LogLevel.VERBOSE], e, !1));
							}),
							(e.prototype.info = function () {
								for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
								this._userLogHandler && this._userLogHandler.apply(this, o.__spreadArray([this, t.LogLevel.INFO], e, !1)), this._logHandler.apply(this, o.__spreadArray([this, t.LogLevel.INFO], e, !1));
							}),
							(e.prototype.warn = function () {
								for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
								this._userLogHandler && this._userLogHandler.apply(this, o.__spreadArray([this, t.LogLevel.WARN], e, !1)), this._logHandler.apply(this, o.__spreadArray([this, t.LogLevel.WARN], e, !1));
							}),
							(e.prototype.error = function () {
								for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
								this._userLogHandler && this._userLogHandler.apply(this, o.__spreadArray([this, t.LogLevel.ERROR], e, !1)), this._logHandler.apply(this, o.__spreadArray([this, t.LogLevel.ERROR], e, !1));
							}),
							e
						);
					})();
				(t.Logger = d),
					(t.setLogLevel = function (e) {
						s.forEach(function (t) {
							t.setLogLevel(e);
						});
					}),
					(t.setUserLogHandler = function (e, n) {
						for (
							var r = function (r) {
									var i = null;
									n && n.level && (i = a[n.level]),
										(r.userLogHandler =
											null === e
												? null
												: function (n, r) {
														for (var o = [], s = 2; s < arguments.length; s++) o[s - 2] = arguments[s];
														var a = o
															.map(function (e) {
																if (null == e) return null;
																if ("string" == typeof e) return e;
																if ("number" == typeof e || "boolean" == typeof e) return e.toString();
																if (e instanceof Error) return e.message;
																try {
																	return JSON.stringify(e);
																} catch (e) {
																	return null;
																}
															})
															.filter(function (e) {
																return e;
															})
															.join(" ");
														r >= (null != i ? i : n.logLevel) && e({ level: t.LogLevel[r].toLowerCase(), message: a, args: o, type: n.name });
												  });
								},
								i = 0,
								o = s;
							i < o.length;
							i++
						)
							r(o[i]);
					});
			},
			336: (e, t, n) => {
				Object.defineProperty(t, "__esModule", { value: !0 });
				const r = { NODE_CLIENT: !1, NODE_ADMIN: !1, SDK_VERSION: "${JSCORE_VERSION}" },
					i = function (e, t) {
						if (!e) throw o(t);
					},
					o = function (e) {
						return new Error("Firebase Database (" + r.SDK_VERSION + ") INTERNAL ASSERT FAILED: " + e);
					},
					s = function (e) {
						const t = [];
						let n = 0;
						for (let r = 0; r < e.length; r++) {
							let i = e.charCodeAt(r);
							i < 128 ? (t[n++] = i) : i < 2048 ? ((t[n++] = (i >> 6) | 192), (t[n++] = (63 & i) | 128)) : 55296 == (64512 & i) && r + 1 < e.length && 56320 == (64512 & e.charCodeAt(r + 1)) ? ((i = 65536 + ((1023 & i) << 10) + (1023 & e.charCodeAt(++r))), (t[n++] = (i >> 18) | 240), (t[n++] = ((i >> 12) & 63) | 128), (t[n++] = ((i >> 6) & 63) | 128), (t[n++] = (63 & i) | 128)) : ((t[n++] = (i >> 12) | 224), (t[n++] = ((i >> 6) & 63) | 128), (t[n++] = (63 & i) | 128));
						}
						return t;
					},
					a = {
						byteToCharMap_: null,
						charToByteMap_: null,
						byteToCharMapWebSafe_: null,
						charToByteMapWebSafe_: null,
						ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
						get ENCODED_VALS() {
							return this.ENCODED_VALS_BASE + "+/=";
						},
						get ENCODED_VALS_WEBSAFE() {
							return this.ENCODED_VALS_BASE + "-_.";
						},
						HAS_NATIVE_SUPPORT: "function" == typeof atob,
						encodeByteArray(e, t) {
							if (!Array.isArray(e)) throw Error("encodeByteArray takes an array as a parameter");
							this.init_();
							const n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
								r = [];
							for (let t = 0; t < e.length; t += 3) {
								const i = e[t],
									o = t + 1 < e.length,
									s = o ? e[t + 1] : 0,
									a = t + 2 < e.length,
									c = a ? e[t + 2] : 0,
									u = i >> 2,
									l = ((3 & i) << 4) | (s >> 4);
								let d = ((15 & s) << 2) | (c >> 6),
									h = 63 & c;
								a || ((h = 64), o || (d = 64)), r.push(n[u], n[l], n[d], n[h]);
							}
							return r.join("");
						},
						encodeString(e, t) {
							return this.HAS_NATIVE_SUPPORT && !t ? btoa(e) : this.encodeByteArray(s(e), t);
						},
						decodeString(e, t) {
							return this.HAS_NATIVE_SUPPORT && !t
								? atob(e)
								: (function (e) {
										const t = [];
										let n = 0,
											r = 0;
										for (; n < e.length; ) {
											const i = e[n++];
											if (i < 128) t[r++] = String.fromCharCode(i);
											else if (i > 191 && i < 224) {
												const o = e[n++];
												t[r++] = String.fromCharCode(((31 & i) << 6) | (63 & o));
											} else if (i > 239 && i < 365) {
												const o = (((7 & i) << 18) | ((63 & e[n++]) << 12) | ((63 & e[n++]) << 6) | (63 & e[n++])) - 65536;
												(t[r++] = String.fromCharCode(55296 + (o >> 10))), (t[r++] = String.fromCharCode(56320 + (1023 & o)));
											} else {
												const o = e[n++],
													s = e[n++];
												t[r++] = String.fromCharCode(((15 & i) << 12) | ((63 & o) << 6) | (63 & s));
											}
										}
										return t.join("");
								  })(this.decodeStringToByteArray(e, t));
						},
						decodeStringToByteArray(e, t) {
							this.init_();
							const n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_,
								r = [];
							for (let t = 0; t < e.length; ) {
								const i = n[e.charAt(t++)],
									o = t < e.length ? n[e.charAt(t)] : 0;
								++t;
								const s = t < e.length ? n[e.charAt(t)] : 64;
								++t;
								const a = t < e.length ? n[e.charAt(t)] : 64;
								if ((++t, null == i || null == o || null == s || null == a)) throw new c();
								const u = (i << 2) | (o >> 4);
								if ((r.push(u), 64 !== s)) {
									const e = ((o << 4) & 240) | (s >> 2);
									if ((r.push(e), 64 !== a)) {
										const e = ((s << 6) & 192) | a;
										r.push(e);
									}
								}
							}
							return r;
						},
						init_() {
							if (!this.byteToCharMap_) {
								(this.byteToCharMap_ = {}), (this.charToByteMap_ = {}), (this.byteToCharMapWebSafe_ = {}), (this.charToByteMapWebSafe_ = {});
								for (let e = 0; e < this.ENCODED_VALS.length; e++) (this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e)), (this.charToByteMap_[this.byteToCharMap_[e]] = e), (this.byteToCharMapWebSafe_[e] = this.ENCODED_VALS_WEBSAFE.charAt(e)), (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e), e >= this.ENCODED_VALS_BASE.length && ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e), (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e));
							}
						},
					};
				class c extends Error {
					constructor() {
						super(...arguments), (this.name = "DecodeBase64StringError");
					}
				}
				const u = function (e) {
						const t = s(e);
						return a.encodeByteArray(t, !0);
					},
					l = function (e) {
						return u(e).replace(/\./g, "");
					},
					d = function (e) {
						try {
							return a.decodeString(e, !0);
						} catch (e) {
							console.error("base64Decode failed: ", e);
						}
						return null;
					};
				function h(e, t) {
					if (!(t instanceof Object)) return t;
					switch (t.constructor) {
						case Date:
							return new Date(t.getTime());
						case Object:
							void 0 === e && (e = {});
							break;
						case Array:
							e = [];
							break;
						default:
							return t;
					}
					for (const n in t) t.hasOwnProperty(n) && "__proto__" !== n && (e[n] = h(e[n], t[n]));
					return e;
				}
				function p() {
					if ("undefined" != typeof self) return self;
					if ("undefined" != typeof window) return window;
					if (void 0 !== n.g) return n.g;
					throw new Error("Unable to locate global object.");
				}
				const f = () => {
						try {
							return (
								p().__FIREBASE_DEFAULTS__ ||
								(() => {
									if ("undefined" == typeof process || void 0 === process.env) return;
									const e = process.env.__FIREBASE_DEFAULTS__;
									return e ? JSON.parse(e) : void 0;
								})() ||
								(() => {
									if ("undefined" == typeof document) return;
									let e;
									try {
										e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
									} catch (e) {
										return;
									}
									const t = e && d(e[1]);
									return t && JSON.parse(t);
								})()
							);
						} catch (e) {
							return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
						}
					},
					m = (e) => {
						var t, n;
						return null === (n = null === (t = f()) || void 0 === t ? void 0 : t.emulatorHosts) || void 0 === n ? void 0 : n[e];
					};
				class g {
					constructor() {
						(this.reject = () => {}),
							(this.resolve = () => {}),
							(this.promise = new Promise((e, t) => {
								(this.resolve = e), (this.reject = t);
							}));
					}
					wrapCallback(e) {
						return (t, n) => {
							t ? this.reject(t) : this.resolve(n), "function" == typeof e && (this.promise.catch(() => {}), 1 === e.length ? e(t) : e(t, n));
						};
					}
				}
				function v() {
					return "undefined" != typeof navigator && "string" == typeof navigator.userAgent ? navigator.userAgent : "";
				}
				function _() {
					var e;
					const t = null === (e = f()) || void 0 === e ? void 0 : e.forceEnvironment;
					if ("node" === t) return !0;
					if ("browser" === t) return !1;
					try {
						return "[object process]" === Object.prototype.toString.call(n.g.process);
					} catch (e) {
						return !1;
					}
				}
				function y() {
					return "undefined" != typeof WorkerGlobalScope && "undefined" != typeof self && self instanceof WorkerGlobalScope;
				}
				class I extends Error {
					constructor(e, t, n) {
						super(t), (this.code = e), (this.customData = n), (this.name = "FirebaseError"), Object.setPrototypeOf(this, I.prototype), Error.captureStackTrace && Error.captureStackTrace(this, w.prototype.create);
					}
				}
				class w {
					constructor(e, t, n) {
						(this.service = e), (this.serviceName = t), (this.errors = n);
					}
					create(e, ...t) {
						const n = t[0] || {},
							r = `${this.service}/${e}`,
							i = this.errors[e],
							o = i
								? (function (e, t) {
										return e.replace(b, (e, n) => {
											const r = t[n];
											return null != r ? String(r) : `<${n}?>`;
										});
								  })(i, n)
								: "Error",
							s = `${this.serviceName}: ${o} (${r}).`;
						return new I(r, s, n);
					}
				}
				const b = /\{\$([^}]+)}/g;
				function E(e) {
					return JSON.parse(e);
				}
				const T = function (e) {
					let t = {},
						n = {},
						r = {},
						i = "";
					try {
						const o = e.split(".");
						(t = E(d(o[0]) || "")), (n = E(d(o[1]) || "")), (i = o[2]), (r = n.d || {}), delete n.d;
					} catch (e) {}
					return { header: t, claims: n, data: r, signature: i };
				};
				function A(e) {
					return null !== e && "object" == typeof e;
				}
				class S {
					constructor(e, t) {
						(this.observers = []),
							(this.unsubscribes = []),
							(this.observerCount = 0),
							(this.task = Promise.resolve()),
							(this.finalized = !1),
							(this.onNoObservers = t),
							this.task
								.then(() => {
									e(this);
								})
								.catch((e) => {
									this.error(e);
								});
					}
					next(e) {
						this.forEachObserver((t) => {
							t.next(e);
						});
					}
					error(e) {
						this.forEachObserver((t) => {
							t.error(e);
						}),
							this.close(e);
					}
					complete() {
						this.forEachObserver((e) => {
							e.complete();
						}),
							this.close();
					}
					subscribe(e, t, n) {
						let r;
						if (void 0 === e && void 0 === t && void 0 === n) throw new Error("Missing Observer.");
						(r = (function (e) {
							if ("object" != typeof e || null === e) return !1;
							for (const t of ["next", "error", "complete"]) if (t in e && "function" == typeof e[t]) return !0;
							return !1;
						})(e)
							? e
							: { next: e, error: t, complete: n }),
							void 0 === r.next && (r.next = P),
							void 0 === r.error && (r.error = P),
							void 0 === r.complete && (r.complete = P);
						const i = this.unsubscribeOne.bind(this, this.observers.length);
						return (
							this.finalized &&
								this.task.then(() => {
									try {
										this.finalError ? r.error(this.finalError) : r.complete();
									} catch (e) {}
								}),
							this.observers.push(r),
							i
						);
					}
					unsubscribeOne(e) {
						void 0 !== this.observers && void 0 !== this.observers[e] && (delete this.observers[e], (this.observerCount -= 1), 0 === this.observerCount && void 0 !== this.onNoObservers && this.onNoObservers(this));
					}
					forEachObserver(e) {
						if (!this.finalized) for (let t = 0; t < this.observers.length; t++) this.sendOne(t, e);
					}
					sendOne(e, t) {
						this.task.then(() => {
							if (void 0 !== this.observers && void 0 !== this.observers[e])
								try {
									t(this.observers[e]);
								} catch (e) {
									"undefined" != typeof console && console.error && console.error(e);
								}
						});
					}
					close(e) {
						this.finalized ||
							((this.finalized = !0),
							void 0 !== e && (this.finalError = e),
							this.task.then(() => {
								(this.observers = void 0), (this.onNoObservers = void 0);
							}));
					}
				}
				function P() {}
				function O(e, t) {
					return `${e} failed: ${t} argument `;
				}
				const k = 144e5;
				(t.CONSTANTS = r),
					(t.DecodeBase64StringError = c),
					(t.Deferred = g),
					(t.ErrorFactory = w),
					(t.FirebaseError = I),
					(t.MAX_VALUE_MILLIS = k),
					(t.RANDOM_FACTOR = 0.5),
					(t.Sha1 = class {
						constructor() {
							(this.chain_ = []), (this.buf_ = []), (this.W_ = []), (this.pad_ = []), (this.inbuf_ = 0), (this.total_ = 0), (this.blockSize = 64), (this.pad_[0] = 128);
							for (let e = 1; e < this.blockSize; ++e) this.pad_[e] = 0;
							this.reset();
						}
						reset() {
							(this.chain_[0] = 1732584193), (this.chain_[1] = 4023233417), (this.chain_[2] = 2562383102), (this.chain_[3] = 271733878), (this.chain_[4] = 3285377520), (this.inbuf_ = 0), (this.total_ = 0);
						}
						compress_(e, t) {
							t || (t = 0);
							const n = this.W_;
							if ("string" == typeof e) for (let r = 0; r < 16; r++) (n[r] = (e.charCodeAt(t) << 24) | (e.charCodeAt(t + 1) << 16) | (e.charCodeAt(t + 2) << 8) | e.charCodeAt(t + 3)), (t += 4);
							else for (let r = 0; r < 16; r++) (n[r] = (e[t] << 24) | (e[t + 1] << 16) | (e[t + 2] << 8) | e[t + 3]), (t += 4);
							for (let e = 16; e < 80; e++) {
								const t = n[e - 3] ^ n[e - 8] ^ n[e - 14] ^ n[e - 16];
								n[e] = 4294967295 & ((t << 1) | (t >>> 31));
							}
							let r,
								i,
								o = this.chain_[0],
								s = this.chain_[1],
								a = this.chain_[2],
								c = this.chain_[3],
								u = this.chain_[4];
							for (let e = 0; e < 80; e++) {
								e < 40 ? (e < 20 ? ((r = c ^ (s & (a ^ c))), (i = 1518500249)) : ((r = s ^ a ^ c), (i = 1859775393))) : e < 60 ? ((r = (s & a) | (c & (s | a))), (i = 2400959708)) : ((r = s ^ a ^ c), (i = 3395469782));
								const t = (((o << 5) | (o >>> 27)) + r + u + i + n[e]) & 4294967295;
								(u = c), (c = a), (a = 4294967295 & ((s << 30) | (s >>> 2))), (s = o), (o = t);
							}
							(this.chain_[0] = (this.chain_[0] + o) & 4294967295), (this.chain_[1] = (this.chain_[1] + s) & 4294967295), (this.chain_[2] = (this.chain_[2] + a) & 4294967295), (this.chain_[3] = (this.chain_[3] + c) & 4294967295), (this.chain_[4] = (this.chain_[4] + u) & 4294967295);
						}
						update(e, t) {
							if (null == e) return;
							void 0 === t && (t = e.length);
							const n = t - this.blockSize;
							let r = 0;
							const i = this.buf_;
							let o = this.inbuf_;
							for (; r < t; ) {
								if (0 === o) for (; r <= n; ) this.compress_(e, r), (r += this.blockSize);
								if ("string" == typeof e) {
									for (; r < t; )
										if (((i[o] = e.charCodeAt(r)), ++o, ++r, o === this.blockSize)) {
											this.compress_(i), (o = 0);
											break;
										}
								} else
									for (; r < t; )
										if (((i[o] = e[r]), ++o, ++r, o === this.blockSize)) {
											this.compress_(i), (o = 0);
											break;
										}
							}
							(this.inbuf_ = o), (this.total_ += t);
						}
						digest() {
							const e = [];
							let t = 8 * this.total_;
							this.inbuf_ < 56 ? this.update(this.pad_, 56 - this.inbuf_) : this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
							for (let e = this.blockSize - 1; e >= 56; e--) (this.buf_[e] = 255 & t), (t /= 256);
							this.compress_(this.buf_);
							let n = 0;
							for (let t = 0; t < 5; t++) for (let r = 24; r >= 0; r -= 8) (e[n] = (this.chain_[t] >> r) & 255), ++n;
							return e;
						}
					}),
					(t.areCookiesEnabled = function () {
						return !("undefined" == typeof navigator || !navigator.cookieEnabled);
					}),
					(t.assert = i),
					(t.assertionError = o),
					(t.async = function (e, t) {
						return (...n) => {
							Promise.resolve(!0)
								.then(() => {
									e(...n);
								})
								.catch((e) => {
									t && t(e);
								});
						};
					}),
					(t.base64 = a),
					(t.base64Decode = d),
					(t.base64Encode = u),
					(t.base64urlEncodeWithoutPadding = l),
					(t.calculateBackoffMillis = function (e, t = 1e3, n = 2) {
						const r = t * Math.pow(n, e),
							i = Math.round(0.5 * r * (Math.random() - 0.5) * 2);
						return Math.min(k, r + i);
					}),
					(t.contains = function (e, t) {
						return Object.prototype.hasOwnProperty.call(e, t);
					}),
					(t.createMockUserToken = function (e, t) {
						if (e.uid) throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
						const n = t || "demo-project",
							r = e.iat || 0,
							i = e.sub || e.user_id;
						if (!i) throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
						const o = Object.assign({ iss: `https://securetoken.google.com/${n}`, aud: n, iat: r, exp: r + 3600, auth_time: r, sub: i, user_id: i, firebase: { sign_in_provider: "custom", identities: {} } }, e);
						return [l(JSON.stringify({ alg: "none", type: "JWT" })), l(JSON.stringify(o)), ""].join(".");
					}),
					(t.createSubscribe = function (e, t) {
						const n = new S(e, t);
						return n.subscribe.bind(n);
					}),
					(t.decode = T),
					(t.deepCopy = function (e) {
						return h(void 0, e);
					}),
					(t.deepEqual = function e(t, n) {
						if (t === n) return !0;
						const r = Object.keys(t),
							i = Object.keys(n);
						for (const o of r) {
							if (!i.includes(o)) return !1;
							const r = t[o],
								s = n[o];
							if (A(r) && A(s)) {
								if (!e(r, s)) return !1;
							} else if (r !== s) return !1;
						}
						for (const e of i) if (!r.includes(e)) return !1;
						return !0;
					}),
					(t.deepExtend = h),
					(t.errorPrefix = O),
					(t.extractQuerystring = function (e) {
						const t = e.indexOf("?");
						if (!t) return "";
						const n = e.indexOf("#", t);
						return e.substring(t, n > 0 ? n : void 0);
					}),
					(t.getDefaultAppConfig = () => {
						var e;
						return null === (e = f()) || void 0 === e ? void 0 : e.config;
					}),
					(t.getDefaultEmulatorHost = m),
					(t.getDefaultEmulatorHostnameAndPort = (e) => {
						const t = m(e);
						if (!t) return;
						const n = t.lastIndexOf(":");
						if (n <= 0 || n + 1 === t.length) throw new Error(`Invalid host ${t} with no separate hostname and port!`);
						const r = parseInt(t.substring(n + 1), 10);
						return "[" === t[0] ? [t.substring(1, n - 1), r] : [t.substring(0, n), r];
					}),
					(t.getDefaults = f),
					(t.getExperimentalSetting = (e) => {
						var t;
						return null === (t = f()) || void 0 === t ? void 0 : t[`_${e}`];
					}),
					(t.getGlobal = p),
					(t.getModularInstance = function (e) {
						return e && e._delegate ? e._delegate : e;
					}),
					(t.getUA = v),
					(t.isAdmin = function (e) {
						const t = T(e).claims;
						return "object" == typeof t && !0 === t.admin;
					}),
					(t.isBrowser = function () {
						return "undefined" != typeof window || y();
					}),
					(t.isBrowserExtension = function () {
						const e = "object" == typeof chrome ? chrome.runtime : "object" == typeof browser ? browser.runtime : void 0;
						return "object" == typeof e && void 0 !== e.id;
					}),
					(t.isElectron = function () {
						return v().indexOf("Electron/") >= 0;
					}),
					(t.isEmpty = function (e) {
						for (const t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
						return !0;
					}),
					(t.isIE = function () {
						const e = v();
						return e.indexOf("MSIE ") >= 0 || e.indexOf("Trident/") >= 0;
					}),
					(t.isIndexedDBAvailable = function () {
						try {
							return "object" == typeof indexedDB;
						} catch (e) {
							return !1;
						}
					}),
					(t.isMobileCordova = function () {
						return "undefined" != typeof window && !!(window.cordova || window.phonegap || window.PhoneGap) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(v());
					}),
					(t.isNode = _),
					(t.isNodeSdk = function () {
						return !0 === r.NODE_CLIENT || !0 === r.NODE_ADMIN;
					}),
					(t.isReactNative = function () {
						return "object" == typeof navigator && "ReactNative" === navigator.product;
					}),
					(t.isSafari = function () {
						return !_() && !!navigator.userAgent && navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome");
					}),
					(t.isUWP = function () {
						return v().indexOf("MSAppHost/") >= 0;
					}),
					(t.isValidFormat = function (e) {
						const t = T(e).claims;
						return !!t && "object" == typeof t && t.hasOwnProperty("iat");
					}),
					(t.isValidTimestamp = function (e) {
						const t = T(e).claims,
							n = Math.floor(new Date().getTime() / 1e3);
						let r = 0,
							i = 0;
						return "object" == typeof t && (t.hasOwnProperty("nbf") ? (r = t.nbf) : t.hasOwnProperty("iat") && (r = t.iat), (i = t.hasOwnProperty("exp") ? t.exp : r + 86400)), !!n && !!r && !!i && n >= r && n <= i;
					}),
					(t.isWebWorker = y),
					(t.issuedAtTime = function (e) {
						const t = T(e).claims;
						return "object" == typeof t && t.hasOwnProperty("iat") ? t.iat : null;
					}),
					(t.jsonEval = E),
					(t.map = function (e, t, n) {
						const r = {};
						for (const i in e) Object.prototype.hasOwnProperty.call(e, i) && (r[i] = t.call(n, e[i], i, e));
						return r;
					}),
					(t.ordinal = function (e) {
						return Number.isFinite(e)
							? e +
									(function (e) {
										const t = (e = Math.abs(e)) % 100;
										if (t >= 10 && t <= 20) return "th";
										const n = e % 10;
										return 1 === n ? "st" : 2 === n ? "nd" : 3 === n ? "rd" : "th";
									})(e)
							: `${e}`;
					}),
					(t.promiseWithTimeout = function (e, t = 2e3) {
						const n = new g();
						return setTimeout(() => n.reject("timeout!"), t), e.then(n.resolve, n.reject), n.promise;
					}),
					(t.querystring = function (e) {
						const t = [];
						for (const [n, r] of Object.entries(e))
							Array.isArray(r)
								? r.forEach((e) => {
										t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e));
								  })
								: t.push(encodeURIComponent(n) + "=" + encodeURIComponent(r));
						return t.length ? "&" + t.join("&") : "";
					}),
					(t.querystringDecode = function (e) {
						const t = {};
						return (
							e
								.replace(/^\?/, "")
								.split("&")
								.forEach((e) => {
									if (e) {
										const [n, r] = e.split("=");
										t[decodeURIComponent(n)] = decodeURIComponent(r);
									}
								}),
							t
						);
					}),
					(t.safeGet = function (e, t) {
						return Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0;
					}),
					(t.stringLength = function (e) {
						let t = 0;
						for (let n = 0; n < e.length; n++) {
							const r = e.charCodeAt(n);
							r < 128 ? t++ : r < 2048 ? (t += 2) : r >= 55296 && r <= 56319 ? ((t += 4), n++) : (t += 3);
						}
						return t;
					}),
					(t.stringToByteArray = function (e) {
						const t = [];
						let n = 0;
						for (let r = 0; r < e.length; r++) {
							let o = e.charCodeAt(r);
							if (o >= 55296 && o <= 56319) {
								const t = o - 55296;
								r++, i(r < e.length, "Surrogate pair missing trail surrogate."), (o = 65536 + (t << 10) + (e.charCodeAt(r) - 56320));
							}
							o < 128 ? (t[n++] = o) : o < 2048 ? ((t[n++] = (o >> 6) | 192), (t[n++] = (63 & o) | 128)) : o < 65536 ? ((t[n++] = (o >> 12) | 224), (t[n++] = ((o >> 6) & 63) | 128), (t[n++] = (63 & o) | 128)) : ((t[n++] = (o >> 18) | 240), (t[n++] = ((o >> 12) & 63) | 128), (t[n++] = ((o >> 6) & 63) | 128), (t[n++] = (63 & o) | 128));
						}
						return t;
					}),
					(t.stringify = function (e) {
						return JSON.stringify(e);
					}),
					(t.uuidv4 = function () {
						return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
							const t = (16 * Math.random()) | 0;
							return ("x" === e ? t : (3 & t) | 8).toString(16);
						});
					}),
					(t.validateArgCount = function (e, t, n, r) {
						let i;
						if ((r < t ? (i = "at least " + t) : r > n && (i = 0 === n ? "none" : "no more than " + n), i)) throw new Error(e + " failed: Was called with " + r + (1 === r ? " argument." : " arguments.") + " Expects " + i + ".");
					}),
					(t.validateCallback = function (e, t, n, r) {
						if ((!r || n) && "function" != typeof n) throw new Error(O(e, t) + "must be a valid function.");
					}),
					(t.validateContextObject = function (e, t, n, r) {
						if ((!r || n) && ("object" != typeof n || null === n)) throw new Error(O(e, t) + "must be a valid context object.");
					}),
					(t.validateIndexedDBOpenable = function () {
						return new Promise((e, t) => {
							try {
								let n = !0;
								const r = "validate-browser-context-for-indexeddb-analytics-module",
									i = self.indexedDB.open(r);
								(i.onsuccess = () => {
									i.result.close(), n || self.indexedDB.deleteDatabase(r), e(!0);
								}),
									(i.onupgradeneeded = () => {
										n = !1;
									}),
									(i.onerror = () => {
										var e;
										t((null === (e = i.error) || void 0 === e ? void 0 : e.message) || "");
									});
							} catch (e) {
								t(e);
							}
						});
					}),
					(t.validateNamespace = function (e, t, n) {
						if ((!n || t) && "string" != typeof t) throw new Error(O(e, "namespace") + "must be a valid firebase namespace.");
					});
			},
			577: (e, t, n) => {
				Object.defineProperty(t, "__esModule", { value: !0 });
				var r = n(199);
				r.registerVersion("firebase", "10.12.3", "app"),
					Object.keys(r).forEach(function (e) {
						"default" === e ||
							t.hasOwnProperty(e) ||
							Object.defineProperty(t, e, {
								enumerable: !0,
								get: function () {
									return r[e];
								},
							});
					});
			},
			52: (e, t, n) => {
				Object.defineProperty(t, "__esModule", { value: !0 });
				var r = n(970);
				Object.keys(r).forEach(function (e) {
					"default" === e ||
						t.hasOwnProperty(e) ||
						Object.defineProperty(t, e, {
							enumerable: !0,
							get: function () {
								return r[e];
							},
						});
				});
			},
			210: (e, t) => {
				Object.defineProperty(t, "__esModule", { value: !0 }), (t.firebaseConfig = void 0), (t.firebaseConfig = { apiKey: "AIzaSyB63H-EFCTZgmVmlxPmIyEmy-TLevxfFLU", authDomain: "polaris-60dce.firebaseapp.com", projectId: "polaris-60dce", storageBucket: "polaris-60dce.appspot.com", messagingSenderId: "336111467040", appId: "1:336111467040:web:743f80789db026f3879a45", measurementId: "G-G1LENEB1DR" });
			},
			148: (e, t, n) => {
				n.r(t), n.d(t, { deleteDB: () => g, openDB: () => m, unwrap: () => f, wrap: () => p });
				const r = (e, t) => t.some((t) => e instanceof t);
				let i, o;
				const s = new WeakMap(),
					a = new WeakMap(),
					c = new WeakMap(),
					u = new WeakMap(),
					l = new WeakMap();
				let d = {
					get(e, t, n) {
						if (e instanceof IDBTransaction) {
							if ("done" === t) return a.get(e);
							if ("objectStoreNames" === t) return e.objectStoreNames || c.get(e);
							if ("store" === t) return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]);
						}
						return p(e[t]);
					},
					set: (e, t, n) => ((e[t] = n), !0),
					has: (e, t) => (e instanceof IDBTransaction && ("done" === t || "store" === t)) || t in e,
				};
				function h(e) {
					return "function" == typeof e
						? (t = e) !== IDBDatabase.prototype.transaction || "objectStoreNames" in IDBTransaction.prototype
							? (o || (o = [IDBCursor.prototype.advance, IDBCursor.prototype.continue, IDBCursor.prototype.continuePrimaryKey])).includes(t)
								? function (...e) {
										return t.apply(f(this), e), p(s.get(this));
								  }
								: function (...e) {
										return p(t.apply(f(this), e));
								  }
							: function (e, ...n) {
									const r = t.call(f(this), e, ...n);
									return c.set(r, e.sort ? e.sort() : [e]), p(r);
							  }
						: (e instanceof IDBTransaction &&
								(function (e) {
									if (a.has(e)) return;
									const t = new Promise((t, n) => {
										const r = () => {
												e.removeEventListener("complete", i), e.removeEventListener("error", o), e.removeEventListener("abort", o);
											},
											i = () => {
												t(), r();
											},
											o = () => {
												n(e.error || new DOMException("AbortError", "AbortError")), r();
											};
										e.addEventListener("complete", i), e.addEventListener("error", o), e.addEventListener("abort", o);
									});
									a.set(e, t);
								})(e),
						  r(e, i || (i = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])) ? new Proxy(e, d) : e);
					var t;
				}
				function p(e) {
					if (e instanceof IDBRequest)
						return (function (e) {
							const t = new Promise((t, n) => {
								const r = () => {
										e.removeEventListener("success", i), e.removeEventListener("error", o);
									},
									i = () => {
										t(p(e.result)), r();
									},
									o = () => {
										n(e.error), r();
									};
								e.addEventListener("success", i), e.addEventListener("error", o);
							});
							return (
								t
									.then((t) => {
										t instanceof IDBCursor && s.set(t, e);
									})
									.catch(() => {}),
								l.set(t, e),
								t
							);
						})(e);
					if (u.has(e)) return u.get(e);
					const t = h(e);
					return t !== e && (u.set(e, t), l.set(t, e)), t;
				}
				const f = (e) => l.get(e);
				function m(e, t, { blocked: n, upgrade: r, blocking: i, terminated: o } = {}) {
					const s = indexedDB.open(e, t),
						a = p(s);
					return (
						r &&
							s.addEventListener("upgradeneeded", (e) => {
								r(p(s.result), e.oldVersion, e.newVersion, p(s.transaction), e);
							}),
						n && s.addEventListener("blocked", (e) => n(e.oldVersion, e.newVersion, e)),
						a
							.then((e) => {
								o && e.addEventListener("close", () => o()), i && e.addEventListener("versionchange", (e) => i(e.oldVersion, e.newVersion, e));
							})
							.catch(() => {}),
						a
					);
				}
				function g(e, { blocked: t } = {}) {
					const n = indexedDB.deleteDatabase(e);
					return t && n.addEventListener("blocked", (e) => t(e.oldVersion, e)), p(n).then(() => {});
				}
				const v = ["get", "getKey", "getAll", "getAllKeys", "count"],
					_ = ["put", "add", "delete", "clear"],
					y = new Map();
				function I(e, t) {
					if (!(e instanceof IDBDatabase) || t in e || "string" != typeof t) return;
					if (y.get(t)) return y.get(t);
					const n = t.replace(/FromIndex$/, ""),
						r = t !== n,
						i = _.includes(n);
					if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || (!i && !v.includes(n))) return;
					const o = async function (e, ...t) {
						const o = this.transaction(e, i ? "readwrite" : "readonly");
						let s = o.store;
						return r && (s = s.index(t.shift())), (await Promise.all([s[n](...t), i && o.done]))[0];
					};
					return y.set(t, o), o;
				}
				var w;
				(w = d), (d = { ...w, get: (e, t, n) => I(e, t) || w.get(e, t, n), has: (e, t) => !!I(e, t) || w.has(e, t) });
			},
			635: (e, t, n) => {
				n.r(t), n.d(t, { __addDisposableResource: () => L, __assign: () => o, __asyncDelegator: () => A, __asyncGenerator: () => T, __asyncValues: () => S, __await: () => E, __awaiter: () => f, __classPrivateFieldGet: () => R, __classPrivateFieldIn: () => D, __classPrivateFieldSet: () => N, __createBinding: () => g, __decorate: () => a, __disposeResources: () => U, __esDecorate: () => u, __exportStar: () => v, __extends: () => i, __generator: () => m, __importDefault: () => C, __importStar: () => k, __makeTemplateObject: () => P, __metadata: () => p, __param: () => c, __propKey: () => d, __read: () => y, __rest: () => s, __runInitializers: () => l, __setFunctionName: () => h, __spread: () => I, __spreadArray: () => b, __spreadArrays: () => w, __values: () => _, default: () => F });
				var r = function (e, t) {
					return (
						(r =
							Object.setPrototypeOf ||
							({ __proto__: [] } instanceof Array &&
								function (e, t) {
									e.__proto__ = t;
								}) ||
							function (e, t) {
								for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
							}),
						r(e, t)
					);
				};
				function i(e, t) {
					if ("function" != typeof t && null !== t) throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
					function n() {
						this.constructor = e;
					}
					r(e, t), (e.prototype = null === t ? Object.create(t) : ((n.prototype = t.prototype), new n()));
				}
				var o = function () {
					return (
						(o =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++) for (var i in (t = arguments[n])) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
								return e;
							}),
						o.apply(this, arguments)
					);
				};
				function s(e, t) {
					var n = {};
					for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
					if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
						var i = 0;
						for (r = Object.getOwnPropertySymbols(e); i < r.length; i++) t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]]);
					}
					return n;
				}
				function a(e, t, n, r) {
					var i,
						o = arguments.length,
						s = o < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, n)) : r;
					if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, r);
					else for (var a = e.length - 1; a >= 0; a--) (i = e[a]) && (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
					return o > 3 && s && Object.defineProperty(t, n, s), s;
				}
				function c(e, t) {
					return function (n, r) {
						t(n, r, e);
					};
				}
				function u(e, t, n, r, i, o) {
					function s(e) {
						if (void 0 !== e && "function" != typeof e) throw new TypeError("Function expected");
						return e;
					}
					for (var a, c = r.kind, u = "getter" === c ? "get" : "setter" === c ? "set" : "value", l = !t && e ? (r.static ? e : e.prototype) : null, d = t || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h = !1, p = n.length - 1; p >= 0; p--) {
						var f = {};
						for (var m in r) f[m] = "access" === m ? {} : r[m];
						for (var m in r.access) f.access[m] = r.access[m];
						f.addInitializer = function (e) {
							if (h) throw new TypeError("Cannot add initializers after decoration has completed");
							o.push(s(e || null));
						};
						var g = (0, n[p])("accessor" === c ? { get: d.get, set: d.set } : d[u], f);
						if ("accessor" === c) {
							if (void 0 === g) continue;
							if (null === g || "object" != typeof g) throw new TypeError("Object expected");
							(a = s(g.get)) && (d.get = a), (a = s(g.set)) && (d.set = a), (a = s(g.init)) && i.unshift(a);
						} else (a = s(g)) && ("field" === c ? i.unshift(a) : (d[u] = a));
					}
					l && Object.defineProperty(l, r.name, d), (h = !0);
				}
				function l(e, t, n) {
					for (var r = arguments.length > 2, i = 0; i < t.length; i++) n = r ? t[i].call(e, n) : t[i].call(e);
					return r ? n : void 0;
				}
				function d(e) {
					return "symbol" == typeof e ? e : "".concat(e);
				}
				function h(e, t, n) {
					return "symbol" == typeof t && (t = t.description ? "[".concat(t.description, "]") : ""), Object.defineProperty(e, "name", { configurable: !0, value: n ? "".concat(n, " ", t) : t });
				}
				function p(e, t) {
					if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t);
				}
				function f(e, t, n, r) {
					return new (n || (n = Promise))(function (i, o) {
						function s(e) {
							try {
								c(r.next(e));
							} catch (e) {
								o(e);
							}
						}
						function a(e) {
							try {
								c(r.throw(e));
							} catch (e) {
								o(e);
							}
						}
						function c(e) {
							var t;
							e.done
								? i(e.value)
								: ((t = e.value),
								  t instanceof n
										? t
										: new n(function (e) {
												e(t);
										  })).then(s, a);
						}
						c((r = r.apply(e, t || [])).next());
					});
				}
				function m(e, t) {
					var n,
						r,
						i,
						o,
						s = {
							label: 0,
							sent: function () {
								if (1 & i[0]) throw i[1];
								return i[1];
							},
							trys: [],
							ops: [],
						};
					return (
						(o = { next: a(0), throw: a(1), return: a(2) }),
						"function" == typeof Symbol &&
							(o[Symbol.iterator] = function () {
								return this;
							}),
						o
					);
					function a(a) {
						return function (c) {
							return (function (a) {
								if (n) throw new TypeError("Generator is already executing.");
								for (; o && ((o = 0), a[0] && (s = 0)), s; )
									try {
										if (((n = 1), r && (i = 2 & a[0] ? r.return : a[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, a[1])).done)) return i;
										switch (((r = 0), i && (a = [2 & a[0], i.value]), a[0])) {
											case 0:
											case 1:
												i = a;
												break;
											case 4:
												return s.label++, { value: a[1], done: !1 };
											case 5:
												s.label++, (r = a[1]), (a = [0]);
												continue;
											case 7:
												(a = s.ops.pop()), s.trys.pop();
												continue;
											default:
												if (!((i = (i = s.trys).length > 0 && i[i.length - 1]) || (6 !== a[0] && 2 !== a[0]))) {
													s = 0;
													continue;
												}
												if (3 === a[0] && (!i || (a[1] > i[0] && a[1] < i[3]))) {
													s.label = a[1];
													break;
												}
												if (6 === a[0] && s.label < i[1]) {
													(s.label = i[1]), (i = a);
													break;
												}
												if (i && s.label < i[2]) {
													(s.label = i[2]), s.ops.push(a);
													break;
												}
												i[2] && s.ops.pop(), s.trys.pop();
												continue;
										}
										a = t.call(e, s);
									} catch (e) {
										(a = [6, e]), (r = 0);
									} finally {
										n = i = 0;
									}
								if (5 & a[0]) throw a[1];
								return { value: a[0] ? a[1] : void 0, done: !0 };
							})([a, c]);
						};
					}
				}
				var g = Object.create
					? function (e, t, n, r) {
							void 0 === r && (r = n);
							var i = Object.getOwnPropertyDescriptor(t, n);
							(i && !("get" in i ? !t.__esModule : i.writable || i.configurable)) ||
								(i = {
									enumerable: !0,
									get: function () {
										return t[n];
									},
								}),
								Object.defineProperty(e, r, i);
					  }
					: function (e, t, n, r) {
							void 0 === r && (r = n), (e[r] = t[n]);
					  };
				function v(e, t) {
					for (var n in e) "default" === n || Object.prototype.hasOwnProperty.call(t, n) || g(t, e, n);
				}
				function _(e) {
					var t = "function" == typeof Symbol && Symbol.iterator,
						n = t && e[t],
						r = 0;
					if (n) return n.call(e);
					if (e && "number" == typeof e.length)
						return {
							next: function () {
								return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e };
							},
						};
					throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
				}
				function y(e, t) {
					var n = "function" == typeof Symbol && e[Symbol.iterator];
					if (!n) return e;
					var r,
						i,
						o = n.call(e),
						s = [];
					try {
						for (; (void 0 === t || t-- > 0) && !(r = o.next()).done; ) s.push(r.value);
					} catch (e) {
						i = { error: e };
					} finally {
						try {
							r && !r.done && (n = o.return) && n.call(o);
						} finally {
							if (i) throw i.error;
						}
					}
					return s;
				}
				function I() {
					for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(y(arguments[t]));
					return e;
				}
				function w() {
					for (var e = 0, t = 0, n = arguments.length; t < n; t++) e += arguments[t].length;
					var r = Array(e),
						i = 0;
					for (t = 0; t < n; t++) for (var o = arguments[t], s = 0, a = o.length; s < a; s++, i++) r[i] = o[s];
					return r;
				}
				function b(e, t, n) {
					if (n || 2 === arguments.length) for (var r, i = 0, o = t.length; i < o; i++) (!r && i in t) || (r || (r = Array.prototype.slice.call(t, 0, i)), (r[i] = t[i]));
					return e.concat(r || Array.prototype.slice.call(t));
				}
				function E(e) {
					return this instanceof E ? ((this.v = e), this) : new E(e);
				}
				function T(e, t, n) {
					if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
					var r,
						i = n.apply(e, t || []),
						o = [];
					return (
						(r = {}),
						s("next"),
						s("throw"),
						s("return", function (e) {
							return function (t) {
								return Promise.resolve(t).then(e, u);
							};
						}),
						(r[Symbol.asyncIterator] = function () {
							return this;
						}),
						r
					);
					function s(e, t) {
						i[e] &&
							((r[e] = function (t) {
								return new Promise(function (n, r) {
									o.push([e, t, n, r]) > 1 || a(e, t);
								});
							}),
							t && (r[e] = t(r[e])));
					}
					function a(e, t) {
						try {
							(n = i[e](t)).value instanceof E ? Promise.resolve(n.value.v).then(c, u) : l(o[0][2], n);
						} catch (e) {
							l(o[0][3], e);
						}
						var n;
					}
					function c(e) {
						a("next", e);
					}
					function u(e) {
						a("throw", e);
					}
					function l(e, t) {
						e(t), o.shift(), o.length && a(o[0][0], o[0][1]);
					}
				}
				function A(e) {
					var t, n;
					return (
						(t = {}),
						r("next"),
						r("throw", function (e) {
							throw e;
						}),
						r("return"),
						(t[Symbol.iterator] = function () {
							return this;
						}),
						t
					);
					function r(r, i) {
						t[r] = e[r]
							? function (t) {
									return (n = !n) ? { value: E(e[r](t)), done: !1 } : i ? i(t) : t;
							  }
							: i;
					}
				}
				function S(e) {
					if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
					var t,
						n = e[Symbol.asyncIterator];
					return n
						? n.call(e)
						: ((e = _(e)),
						  (t = {}),
						  r("next"),
						  r("throw"),
						  r("return"),
						  (t[Symbol.asyncIterator] = function () {
								return this;
						  }),
						  t);
					function r(n) {
						t[n] =
							e[n] &&
							function (t) {
								return new Promise(function (r, i) {
									!(function (e, t, n, r) {
										Promise.resolve(r).then(function (t) {
											e({ value: t, done: n });
										}, t);
									})(r, i, (t = e[n](t)).done, t.value);
								});
							};
					}
				}
				function P(e, t) {
					return Object.defineProperty ? Object.defineProperty(e, "raw", { value: t }) : (e.raw = t), e;
				}
				var O = Object.create
					? function (e, t) {
							Object.defineProperty(e, "default", { enumerable: !0, value: t });
					  }
					: function (e, t) {
							e.default = t;
					  };
				function k(e) {
					if (e && e.__esModule) return e;
					var t = {};
					if (null != e) for (var n in e) "default" !== n && Object.prototype.hasOwnProperty.call(e, n) && g(t, e, n);
					return O(t, e), t;
				}
				function C(e) {
					return e && e.__esModule ? e : { default: e };
				}
				function R(e, t, n, r) {
					if ("a" === n && !r) throw new TypeError("Private accessor was defined without a getter");
					if ("function" == typeof t ? e !== t || !r : !t.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
					return "m" === n ? r : "a" === n ? r.call(e) : r ? r.value : t.get(e);
				}
				function N(e, t, n, r, i) {
					if ("m" === r) throw new TypeError("Private method is not writable");
					if ("a" === r && !i) throw new TypeError("Private accessor was defined without a setter");
					if ("function" == typeof t ? e !== t || !i : !t.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
					return "a" === r ? i.call(e, n) : i ? (i.value = n) : t.set(e, n), n;
				}
				function D(e, t) {
					if (null === t || ("object" != typeof t && "function" != typeof t)) throw new TypeError("Cannot use 'in' operator on non-object");
					return "function" == typeof e ? t === e : e.has(t);
				}
				function L(e, t, n) {
					if (null != t) {
						if ("object" != typeof t && "function" != typeof t) throw new TypeError("Object expected.");
						var r, i;
						if (n) {
							if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
							r = t[Symbol.asyncDispose];
						}
						if (void 0 === r) {
							if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
							(r = t[Symbol.dispose]), n && (i = r);
						}
						if ("function" != typeof r) throw new TypeError("Object not disposable.");
						i &&
							(r = function () {
								try {
									i.call(this);
								} catch (e) {
									return Promise.reject(e);
								}
							}),
							e.stack.push({ value: t, dispose: r, async: n });
					} else n && e.stack.push({ async: !0 });
					return t;
				}
				var M =
					"function" == typeof SuppressedError
						? SuppressedError
						: function (e, t, n) {
								var r = new Error(n);
								return (r.name = "SuppressedError"), (r.error = e), (r.suppressed = t), r;
						  };
				function U(e) {
					function t(t) {
						(e.error = e.hasError ? new M(t, e.error, "An error was suppressed during disposal.") : t), (e.hasError = !0);
					}
					return (function n() {
						for (; e.stack.length; ) {
							var r = e.stack.pop();
							try {
								var i = r.dispose && r.dispose.call(r.value);
								if (r.async)
									return Promise.resolve(i).then(n, function (e) {
										return t(e), n();
									});
							} catch (e) {
								t(e);
							}
						}
						if (e.hasError) throw e.error;
					})();
				}
				const F = { __extends: i, __assign: o, __rest: s, __decorate: a, __param: c, __metadata: p, __awaiter: f, __generator: m, __createBinding: g, __exportStar: v, __values: _, __read: y, __spread: I, __spreadArrays: w, __spreadArray: b, __await: E, __asyncGenerator: T, __asyncDelegator: A, __asyncValues: S, __makeTemplateObject: P, __importStar: k, __importDefault: C, __classPrivateFieldGet: R, __classPrivateFieldSet: N, __classPrivateFieldIn: D, __addDisposableResource: L, __disposeResources: U };
			},
		},
		t = {};
	function n(r) {
		var i = t[r];
		if (void 0 !== i) return i.exports;
		var o = (t[r] = { exports: {} });
		return e[r](o, o.exports, n), o.exports;
	}
	(n.d = (e, t) => {
		for (var r in t) n.o(t, r) && !n.o(e, r) && Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
	}),
		(n.g = (function () {
			if ("object" == typeof globalThis) return globalThis;
			try {
				return this || new Function("return this")();
			} catch (e) {
				if ("object" == typeof window) return window;
			}
		})()),
		(n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
		(n.r = (e) => {
			"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
		}),
		(() => {
			const e = (e) => {
				console.log(e.target.tagName), "SPAN" === e.target.tagName ? (e.target.classList.toggle("open"), e.target.parentElement.parentElement.classList.toggle("open")) : "path" === e.target.tagName ? (e.target.parentElement.classList.toggle("open"), e.target.parentElement.classList.contains("dayCollapse") ? e.target.parentElement.parentElement.parentElement.classList.toggle("open") : e.target.parentElement.parentElement.classList.toggle("open")) : (e.target.classList.toggle("open"), e.target.classList.contains("dayCollapse") ? e.target.parentElement.parentElement.classList.toggle("open") : e.target.parentElement.classList.toggle("open"));
			};
			(() => {
				let t = document.getElementsByClassName("collapse");
				for (let n of t) n.addEventListener("click", e);
			})(),
				document.getElementById("sideMenuWrap").addEventListener("mouseleave", (e) => {
					e.target.classList.contains("open") && (document.getElementById("sideMenuWrap").classList.toggle("open"), document.getElementById("menuToggle").classList.toggle("open"));
				});
			const t = n(577),
				r = n(52),
				i = n(210),
				o = (0, t.initializeApp)(i.firebaseConfig),
				s = (0, r.getAuth)(o);
			document.getElementById("signOutWrap").addEventListener("click", () => {
				(0, r.signOut)(s)
					.then(() => {
						window.location.href = "index.html";
					})
					.catch((e) => {
						alert(`There was a error signing out: ${e}`);
					});
			}),
				(0, r.onAuthStateChanged)(s, (e) => {
					if (e) {
						e.uid, console.log(e);
						let t = document.querySelector("#menuPF img");
						t && ((t.loading = "lazy"), (t.src = e.photoURL));
					} else (window.location.href = "public/index.html"), console.log("user signed out");
				});
		})();
})();
