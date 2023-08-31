import {ApiEvent, ApiEventsDispatcher} from './apiEvent.js';
import {NoopLogger} from './logger.js';
import {ProxyMethodCallTarget} from './messaging.js';

/**
 * @interface
 */
export class Leader {
  updateConsent(consentData) {
  }

  updateFetchIdData(instanceId, fetchIdData) {
  }

  /**
   *
   * @param {RefreshOptions} refreshOptions
   */
  refreshUid(refreshOptions) {
  }

  onLeaderChange(newLeader) {
  }

  /**
   *
   * @param {Follower} follower
   */
  addFollower(follower) {
  }
}

export class ActualLeader extends Leader {
  /**
   * @type Array<Follower>
   * @private
   */
  _followers;

  /**
   * @type {UidFetcher}
   * @private
   */
  _fetcher;

  /**
   * @type {ApiEventsDispatcher}
   * @private
   */
  _dispatcher;

  /**
   * @type {Logger}
   * @private
   */
  _log;

  /**
   * @type {ConsentManager}
   * @private
   */
  _consentManager;

  _lastUid;

  /**
   * @param {UidFetcher} fetcher
   * @param {ConsentManager} consentManager
   * @param {Array<Follower>} followers
   * @param {Logger} logger
   */
  constructor(fetcher, consentManager, followers, logger = NoopLogger) {
    super();
    this._dispatcher = new ApiEventsDispatcher(logger);
    this._fetcher = fetcher;
    this._followers = followers;
    this._consentManager = consentManager;
    const leader = this;
    this._dispatcher.on(ApiEvent.USER_ID_READY, uid => leader._handleUidReady(uid));
    this._dispatcher.on(ApiEvent.USER_ID_FETCH_CANCELED, cancel => leader._handleCancel(cancel));
    this._dispatcher.on(ApiEvent.CASCADE_NEEDED, cascade => leader._handleCascade(cascade));
    this._log = logger;
  }

  _handleUidReady(uid) {
    for (const follower of this._followers) {
      this._log.debug('Notify uid ready.', 'Follower:', follower.getId(), 'Uid:', uid);
      follower.notifyUidReady(uid);
    }
    this._lastUid = uid;
  }

  /**
   *
   * @param {CascadePixelCall} cascade
   * @private
   */
  _handleCascade(cascade) {
    const cascadeEligible =
      this._followers.filter(follower => follower.canDoCascade(cascade))
        .sort((followerA, followerB) => {
          const getDepth = function (f) {
            return f.getFetchIdData().refererInfo?.stack?.length || Number.MAX_SAFE_INTEGER;
          };
          return getDepth(followerA) - getDepth(followerB);
        });
    if (cascadeEligible.length > 0) {
      cascadeEligible[0].notifyCascadeNeeded(cascade);
    } else {
      this._log.error(`Couldn't find cascade eligible follower`);
    }
  }

  _handleCancel(cancel) {
    for (const follower of this._followers) {
      follower.notifyFetchUidCanceled(cancel);
    }
  }

  _getId(forceRefresh = false) {
    const fetchIds = this._followers.map(follower => {
      return {
        ...follower.getFetchIdData(),
        integrationId: follower.getId()
      };
    });
    this._fetcher.getId(this._dispatcher, fetchIds, forceRefresh);
  }

  start() {
    // TODO handle in progress
    this._getId(false);
  }

  refreshUid(options = {}) {
    if (options.resetConsent === true) {
      this._consentManager.resetConsentData(options.forceAllowLocalStorageGrant === true);
    }
    this._getId(options.forceFetch === true);
  }

  updateConsent(consentData) {
    // TODO check if changed , maybe re-trigger getId ???
    // TODO add metric if updated different
    this._consentManager.setConsentData(consentData);
  }

  updateFetchIdData(instanceId, fetchIdData) {
    const toUpdate = this._followers.find(instance => instance.getId() === instanceId);
    toUpdate.updateFetchIdData(fetchIdData);
    // TODO should refreshId ??
  }

  addFollower(follower) {
    this._log.debug('Added follower', follower.getId(), 'last uid', this._lastUid);
    if (this._lastUid) { // late joiner
      // if redy just notify follower
      follower.notifyUidReady(this._lastUid);
    }
    this._followers.push(follower);
  }
}

export class ProxyLeader extends Leader {
  /**
   * @type {CrossInstanceMessenger}
   * @private
   */
  _messenger;
  _leaderInstanceId;

  /**
   *
   * @param {CrossInstanceMessenger} messenger
   * @param {String} leaderInstanceId
   */
  constructor(messenger, leaderInstanceId) {
    super();
    this._messenger = messenger;
    this._leaderInstanceId = leaderInstanceId;
  }

  /**
   * @private
   */
  _sendToLeader(methodName, args) {
    this._messenger.callProxyMethod(this._leaderInstanceId, ProxyMethodCallTarget.LEADER, methodName, args);
  }

  updateConsent(consentData) {
    this._sendToLeader('updateConsent', [consentData]);
  }

  refreshUid(options) {
    this._sendToLeader('refreshUid', [options]);
  }

  updateFetchIdData(instanceId, fetchIdData) {
    this._sendToLeader('updateFetchIdData', [instanceId, fetchIdData]);
  }
}

export class AwaitedLeader extends Leader {
  _callsQueue = [];

  updateConsent(consentData) {
    this._add('updateConsent', [consentData]);
  }

  updateFetchIdData(instanceId, fetchIdData) {
    this._add('updateFetchIdData', [instanceId, fetchIdData]);
  }

  refreshUid(refreshOptions) {
    this._add('refreshUid', [refreshOptions]);
  }

  _add(name, args) {
    this._callsQueue.push({
      name: name,
      args: args
    });
  }

  /**
   *
   * @param {ActualLeader} newLeader
   */
  onLeaderChange(newLeader) {
    for (const methodCall of this._callsQueue) {
      newLeader[methodCall.name](...methodCall.args);
    }
  }
}
