import {ApiEvent} from './apiEvent.js';
import {ProxyMethodCallTarget} from './messaging.js';

/**
 * @interface
 */
export class Follower {
  /**
   * @type {Properties}
   * @private
   */
  _instanceProperties;

  constructor(properties) {
    this._instanceProperties = properties;
  }

  getId() {
    return this._instanceProperties.id;
  }

  /**
   *
   * @return {FetchIdData}
   */
  getFetchIdData() {
    return this._instanceProperties.fetchIdData;
  }

  updateFetchIdData(newFetchIdData) {
    Object.assign(this._instanceProperties.fetchIdData, newFetchIdData);
  }

  /**
   *
   * @param {Id5UserId} uid
   */
  notifyUidReady(uid) {
  }

  /**
   * @param {FetchId5UidCanceled} cancelInfo
   */
  notifyFetchUidCanceled(cancelInfo) {
  }

  /**
   * @param {CascadePixelCall} cascadeData
   */
  notifyCascadeNeeded(cascadeData) {
  }

  /**
   * @param {CascadePixelCall} cascadeData
   */
  canDoCascade(cascadeData) {
    return this._instanceProperties.canDoCascade === true && cascadeData.partnerId === this._instanceProperties.fetchIdData.partnerId;
  }
}

export class DirectFollower extends Follower {
  /**
   * @type {ApiEventsDispatcher}
   * @private
   */
  _dispatcher;

  constructor(properties, dispatcher) {
    super(properties);
    this._dispatcher = dispatcher;
  }

  notifyUidReady(uid) {
    this._dispatcher.emit(ApiEvent.USER_ID_READY, uid);
  }

  notifyFetchUidCanceled(cancelInfo) {
    this._dispatcher.emit(ApiEvent.USER_ID_FETCH_CANCELED, cancelInfo);
  }

  notifyCascadeNeeded(cascadeData) {
    this._dispatcher.emit(ApiEvent.CASCADE_NEEDED, cascadeData);
  }
}

export class ProxyFollower extends Follower {
  /**
   * @type {CrossInstanceMessenger}
   * @private
   */
  _messenger;

  /**
   * @param {DiscoveredInstance} knownInstance - leader instance properties
   * @param {CrossInstanceMessenger} messenger
   */
  constructor(knownInstance, messenger) {
    super(knownInstance.properties);
    this._messenger = messenger;
  }

  /**
   * @private
   */
  _callProxy(methodName, args) {
    this._messenger.callProxyMethod(this.getId(), ProxyMethodCallTarget.FOLLOWER, methodName, args);
  }

  notifyUidReady(uid) {
    this._callProxy('notifyUidReady', [uid]);
  }

  notifyFetchUidCanceled(cancelInfo) {
    this._callProxy('notifyFetchUidCanceled', [cancelInfo]);
  }

  notifyCascadeNeeded(cascadeData) {
    this._callProxy('notifyCascadeNeeded', [cascadeData]);
  }
}
