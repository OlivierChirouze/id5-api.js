import sinon from 'sinon';
import multiplexing, {LocalStorage, WindowStorage, ApiEventsDispatcher} from '@id5io/multiplexing';
import { NO_OP_LOGGER } from '@id5io/multiplexing';

export const TEST_ID5_PARTNER_ID = 99;
export const ID5_FETCH_ENDPOINT = `https://id5-sync.com/gm/v3`;
export const ID5_CALL_ENDPOINT = `https://id5-sync.com/i/${TEST_ID5_PARTNER_ID}`;
export const ID5_SYNC_ENDPOINT = `https://id5-sync.com/s/${TEST_ID5_PARTNER_ID}`;

export const CALLBACK_TIMEOUT_MS = 30;

export const TEST_ID5ID_STORAGE_CONFIG = {
  name: 'id5id',
  expiresDays: 90
};
export const TEST_ID5ID_STORAGE_CONFIG_EXPIRED = {
  name: 'id5id',
  expiresDays: -5
};
export const TEST_LAST_STORAGE_CONFIG = {
  name: 'id5id_last',
  expiresDays: 90
};
export const TEST_CONSENT_DATA_STORAGE_CONFIG = {
  name: 'id5id_cached_consent_data',
  expiresDays: 30
};
export const TEST_PD_STORAGE_CONFIG = {
  name: `id5id_cached_pd_${TEST_ID5_PARTNER_ID}`,
  expiresDays: 30
};
export const TEST_NB_STORAGE_CONFIG = {
  name: `id5id_${TEST_ID5_PARTNER_ID}_nb`,
  expiresDays: 90
};

export const TEST_PRIVACY_STORAGE_CONFIG = {
  name: 'id5id_privacy',
  expiresDays: 30
}

export const TEST_PRIVACY_ALLOWED = JSON.stringify({
  'jurisdiction': 'other',
  'id5_consent': true
});
export const TEST_PRIVACY_DISALLOWED = JSON.stringify({
  'jurisdiction': 'gdpr',
  'id5_consent': false
});

export const TEST_RESPONSE_ID5ID = 'testresponseid5id';
export const TEST_RESPONSE_SIGNATURE = 'uvwxyz';
export const TEST_RESPONSE_LINK_TYPE = 1;

export const TEST_RESPONSE_ID5_CONSENT = {
  'universal_uid': TEST_RESPONSE_ID5ID,
  'cascade_needed': false,
  'signature': TEST_RESPONSE_SIGNATURE,
  'ext': {
    'linkType': TEST_RESPONSE_LINK_TYPE
  },
  'privacy': JSON.parse(TEST_PRIVACY_ALLOWED)
};
export const STORED_JSON = encodeURIComponent(JSON.stringify(TEST_RESPONSE_ID5_CONSENT));

export const TEST_RESPONSE_CASCADE = {
  'universal_uid': TEST_RESPONSE_ID5ID,
  'cascade_needed': true,
  'signature': TEST_RESPONSE_SIGNATURE,
  'ext': {
    'linkType': TEST_RESPONSE_LINK_TYPE
  },
  'privacy': JSON.parse(TEST_PRIVACY_ALLOWED)
};

export const DEFAULT_EXTENSIONS = {
  lb: 'lbValue',
  lbCDN: '%%LB_CDN%%'
}

export function prepareMultiplexingResponse(genericResponse, requestString) {
  const request = JSON.parse(requestString);
  const responses = {};
  request.requests.forEach(rq => responses[rq.requestId] = {});
  return JSON.stringify({generic: genericResponse, responses: responses});
}

export function defaultInit(partnerId = TEST_ID5_PARTNER_ID) {
  return {
    partnerId,
    disableUaHints: true,
    multiplexing: {_disabled: true}
  }
}

export function defaultInitBypassConsent(partnerId = TEST_ID5_PARTNER_ID) {
  return {
    ...defaultInit(partnerId),
    debugBypassConsent: true
  }
}

export function setupGppV11Stub(){
  window.__gpp = function (command) {
    if(command==='ping'){
      return {
        gppVersion        : '1.1',
        cmpStatus         : 'stub',
        signalStatus    : 'ready',
        applicableSections: [-1, 0],
        gppString         : 'GPP_STRING'
      };
    }
  }
}
export function clearGppStub(){
  window.__gpp = undefined;
}


export const localStorage = new LocalStorage(new WindowStorage(window));

export function resetAllInLocalStorage() {
  localStorage.removeItemWithExpiration(TEST_ID5ID_STORAGE_CONFIG);
  localStorage.removeItemWithExpiration(TEST_LAST_STORAGE_CONFIG);
  localStorage.removeItemWithExpiration(TEST_PRIVACY_STORAGE_CONFIG);
  localStorage.removeItemWithExpiration(TEST_PD_STORAGE_CONFIG);
  localStorage.removeItemWithExpiration(TEST_CONSENT_DATA_STORAGE_CONFIG);
  localStorage.removeItemWithExpiration(TEST_NB_STORAGE_CONFIG);
}

/**
 * Performs a sequence of timeouts expressed with parameter "steps" using
 * the specified clock
 * @param {object} clock
 * @param  {...object} steps objects made of {timeout: a numeric value, fn: a function to execute}
 */
export function execSequence(clock, ...steps) {
  const rootFn = steps.reduceRight((acc, val, index) => {
    return () => {
      setTimeout(() => {
        const storedIndex = index;
        try {
          val.fn();
        } catch (origErr) {
          throw new Error(`[Sequence step ${storedIndex}] ${origErr.message}`);
        }
        acc();
      }, val.timeout);
      clock.tick(val.timeout);
    };
  }, () => {
  });
  rootFn();
}

export class MultiplexingStub {

  constructor() {
    this.realCreate = multiplexing.createInstance;
    this.stubCreate = sinon.stub(multiplexing, multiplexing.createInstance.name)
  }

  returnsInstance(instance) {
    this.stubCreate.returns(instance);
  }

  interceptInstance(interceptor) {
    const thisStub = this;
    this.stubCreate.callsFake((...args) => {
      return interceptor(thisStub.realCreate(...args));
    })
  }

  restore() {
    this.stubCreate.restore()
  }
}

export function sinonFetchResponder(responseProvider) {
  return (request) => {
    if (request.url === ID5_FETCH_ENDPOINT) {
      request.respond(200, { 'Content-Type': ' application/json' }, responseProvider(request));
    }
  }
}

export class MultiplexInstanceStub {
  registerObj;
  _dispatcher;

  constructor() {
    this._dispatcher = new ApiEventsDispatcher(NO_OP_LOGGER);
    sinon.stub(this, 'register');
    sinon.stub(this, 'updateConsent');
  }

  on(event, callback) {
    this._dispatcher.on(event, callback);
    return this;
  }

  emit(event, ...args) {
    this._dispatcher.emit(event, ...args);
    return this;
  }

  register(registerObj) {
    this.registerObj = registerObj;
  }

  updateConsent() {}
}
