import sinon from 'sinon';
import { RefreshedResponse, RefreshResult, UidFetcher } from '../../src/fetch.js';
import { Extensions } from '../../src/extensions.js';
import { API_TYPE, ConsentData, ConsentManager, GppConsentData, GRANT_TYPE, LocalStorageGrant, NoConsentError } from '../../src/consent.js';
import { NoopLogger } from '../../src/logger.js';
import { WindowStorage } from '../../src/localStorage.js';
import { Id5CommonMetrics } from '@id5io/diagnostics';
import { Store, StoredDataState } from '../../src/store.js';

const LOCAL_STORAGE_GRANT_ALLOWED_BY_API = new LocalStorageGrant(true, GRANT_TYPE.CONSENT_API, API_TYPE.TCF_V2);
const CONSENT_DATA_GDPR_ALLOWED = Object.assign(new ConsentData(), {
  consentString: 'CONSENT_STRING',
  localStoragePurposeConsent: true,
  gdprApplies: true,
  api: API_TYPE.TCF_V2
});

const CONSENT_DATA_GDPR_NOT_ALLOWED = Object.assign(new ConsentData(), {
  consentString: 'CONSENT_STRING',
  localStoragePurposeConsent: false,
  gdprApplies: true,
  api: API_TYPE.TCF_V2
});

const DEFAULT_EXTENSIONS = {
  lb: 'lbValue',
  lbCDN: '%%LB_CDN%%'
};

const origin = 'api';
const originVersion = '1.0.36';

const PRIVACY_DATA_RETURNED = { jurisdiction: 'gdpr', id5_consent: true };

const _DEBUG = false;

const FETCH_RESPONSE_OBJ = {
  created_at: '2023-08-07T15:46:59.070010024Z',
  id5_consent: true,
  original_uid: 'testresponseid5id',
  universal_uid: 'testresponseid5id',
  signature: 'signature',
  link_type: 0,
  cascade_needed: false,
  privacy: PRIVACY_DATA_RETURNED,
  ext: {
    linkType: 0,
    pba: 'g+Q9GCIcuZuBMslwof4uDw=='
  }
};

const FETCH_RESPONSE_OBJ_NO_CONSENT = {
  created_at: '2023-08-07T15:46:59.070010024Z',
  id5_consent: false,
  original_uid: '0',
  universal_uid: '0',
  link_type: 0,
  cascade_needed: false,
  privacy: {
    jurisdiction: 'gdpr',
    id5_consent: false
  },
  ext: {
    linkType: 0,
    pba: 'g+Q9GCIcuZuBMslwof4uDw=='
  }
};

/**
 * @type {FetchIdRequestData}
 */
const DEFAULT_FETCH_DATA = {
  integrationId: 'default-integration',
  cacheId: 'default-cache-id',
  role: 'leader',
  requestCount: 1,
  origin: origin,
  originVersion: originVersion,
  partnerId: 1234,
  refererInfo: {
    ref: 'http://example.com/page.html',
    topmostLocation: 'http://example.com/page.html',
    reachedTop: true,
    numIframes: 2,
    stack: [
      'http://example.com/page.html',
      'http://example.com/iframe1.html',
      'http://example.com/iframe2.html'
    ],
    canonicalUrl: 'https://id5.io'
  },
  isUsingCdn: true,
  att: 0,
  uaHints: undefined,
  abTesting: undefined,
  pd: undefined,
  partnerUserId: undefined,
  provider: undefined,
  segments: undefined,
  invalidSegmentsCount: undefined,
  refreshInSeconds: 3600,
  providedRefreshInSeconds: undefined
};

describe('RefreshedResponse', function () {
  it('should return generic response', function () {
    // given
    const refreshedResponse = new RefreshedResponse({
      generic: FETCH_RESPONSE_OBJ
    });

    // when
    const generic = refreshedResponse.getGenericResponse();

    // then
    expect(generic).to.be.eql(FETCH_RESPONSE_OBJ);
  });

  it('should return merged response when present', function () {
    // given
    const refreshedResponse = new RefreshedResponse({
      generic: FETCH_RESPONSE_OBJ,
      responses: {
        '1': {
          cascade_needed: true,
          universal_uid: 'uid-1'
        },
        '2': {
          universal_uid: 'uid-2'
        },
        '3': {}
      }
    });

    // when
    const responseFor1 = refreshedResponse.getResponseFor('1');
    const responseFor2 = refreshedResponse.getResponseFor('2');
    const responseFor3 = refreshedResponse.getResponseFor('3');
    const responseFor4 = refreshedResponse.getResponseFor('4');

    // then
    expect(responseFor1).to.be.eql({
      ...FETCH_RESPONSE_OBJ,
      cascade_needed: true,
      universal_uid: 'uid-1'
    });
    expect(responseFor2).to.be.eql({
      ...FETCH_RESPONSE_OBJ,
      universal_uid: 'uid-2'
    });
    expect(responseFor3).to.be.eql(FETCH_RESPONSE_OBJ);
    expect(responseFor4).to.be.undefined;
  });
});

/**
 *
 * @param {FetchResponse} generic
 * @param {Array<FetchIdRequestData>} fetchData
 * @return {{responses: {}, generic}}
 */
function createResponse(generic, fetchData) {
  const expectedResponse = {
    generic: generic,
    responses: {}
  };
  fetchData.forEach(data => {
    expectedResponse.responses[data.integrationId] = {};
  });
  return expectedResponse;
}

function prepareJsonResponse(genericResponse, requestString) {
  const request = JSON.parse(requestString);
  const responses = {};
  request.requests.forEach(rq => responses[rq.requestId] = {});
  return JSON.stringify({ generic: genericResponse, responses: responses });
}

describe('UidFetcher', function () {
  /**
   * @type {UidFetcher}
   */
  let fetcher;
  /**
   * @type {ConsentManager}
   */
  let consentManager;
  /**
   * @type {Extensions}
   */
  let extensions;
  /**
   * @type {Store}
   */
  let store;
  /**
   * @type {Id5CommonMetrics}
   */
  let metrics;
  let server;
  let localStorageCheckStub;


  const CURRENT_TIME = Date.now();
  let dateTimeStub;
  beforeEach(function () {
    let log = _DEBUG ? console : NoopLogger;
    consentManager = sinon.createStubInstance(ConsentManager);
    store = sinon.createStubInstance(Store);
    extensions = sinon.createStubInstance(Extensions);
    metrics = new Id5CommonMetrics(origin, originVersion);
    fetcher = new UidFetcher(consentManager, store, metrics, log, extensions);
    consentManager.getConsentData.resolves(CONSENT_DATA_GDPR_ALLOWED);
    extensions.gather.resolves(DEFAULT_EXTENSIONS);
    localStorageCheckStub = sinon.stub(WindowStorage, 'checkIfAccessible').returns(true);
    dateTimeStub = sinon.stub(Date, 'now').returns(CURRENT_TIME);
  });

  afterEach(function () {
    localStorageCheckStub.restore();
    dateTimeStub.restore();
  });

  describe('when server response does grant consent', function () {

    beforeEach(function () {
      server = sinon.fakeServer.create();
      server.respondImmediately = true;
      server.respondWith(sinonFetchResponder(request =>
        prepareJsonResponse(FETCH_RESPONSE_OBJ, request.requestBody)
      ));
    });

    afterEach(function () {
      server.restore();
    });

    describe('when no state is saved in cache', function () {
      let storedDataState;

      beforeEach(function () {
        storedDataState = Object.assign(new StoredDataState(), {
          nb: {},
          refreshInSeconds: 7200
        });
        store.getStoredDataState.returns(storedDataState);
        consentManager.localStorageGrant.onCall(0).returns(new LocalStorageGrant(true, GRANT_TYPE.PROVISIONAL, API_TYPE.NONE));
        consentManager.localStorageGrant.returns(LOCAL_STORAGE_GRANT_ALLOWED_BY_API);
      });

      [
        ['default', {}, {}],
        ['with pd', { pd: 'PD_DATA' }, { pd: 'PD_DATA' }],
        ['with partnerUserId', { partnerUserId: '1234567' }, { puid: '1234567' }],
        ['with provider', { provider: 'some_provider' }, { provider: 'some_provider' }],
        ['with ua hints', { uaHints: buildTestUaHints() }, { ua_hints: buildTestUaHints() }],
        ['with abTesting', { abTesting: { enabled: true, controlGroupPct: 0.5 } }, {
          ab_testing: {
            enabled: true,
            control_group_pct: 0.5
          }
        }],
        ['with segments', {
          segments: [
            { destination: '22', ids: ['abc'] },
            { destination: '21', ids: ['abcd'] }
          ]
        }, {
            segments: [
              { destination: '22', ids: ['abc'] },
              { destination: '21', ids: ['abcd'] }
            ]
          }],
        ['with invalid segments', {
          segments: [
            { destination: '22', ids: ['abc'] }
          ],
          invalidSegmentsCount: 10
        }, {
            segments: [
              { destination: '22', ids: ['abc'] }
            ],
            _invalid_segments: 10
          }],
        ['with provided refreshInSeconds', { providedRefreshInSeconds: 1000 }, {
          provided_options: {
            refresh_in_seconds: 1000
          }
        }],
        ['with trace', { trace: true }, { _trace: true }]
      ].forEach(([description, data, expectedInRequest]) => {
        it(`should call multi-fetch and correctly use parameters to create the fetch request body (${description})`, async () => {
          // given
          /**
           * @type {FetchIdRequestData}
           */
          const fetchData = {
            ...DEFAULT_FETCH_DATA,
            integrationId: crypto.randomUUID(),
            ...data
          };
          const inputFetchData = [fetchData];
          const nbPage = 3;
          storedDataState.nb[fetchData.partnerId] = nbPage;

          // when
          const fetchIdResult = fetcher.getId(inputFetchData);

          // then
          return fetchIdResult.refreshResult.then(data => {
            expect(store.storeRequestData).to.have.been.calledWith(CONSENT_DATA_GDPR_ALLOWED, inputFetchData);

            expect(consentManager.setStoredPrivacy).to.have.been.calledWith(PRIVACY_DATA_RETURNED);

            expectHttpPOST(server.requests[0], `https://id5-sync.com/gm/v3`, {
              requests: [
                expectedRequestFor(fetchData, CONSENT_DATA_GDPR_ALLOWED, DEFAULT_EXTENSIONS, nbPage, storedDataState, expectedInRequest)
              ]
            });
            const expectedResponse = createResponse(FETCH_RESPONSE_OBJ, [fetchData]);

            expect(store.storeResponse).to.have.been.calledWith(inputFetchData, new RefreshedResponse(expectedResponse, CURRENT_TIME), false);
            expect(store.incNbs).to.have.not.been.called;

            expect(data.refreshedResponse.timestamp).is.not.null;
            expect(data.refreshedResponse.timestamp).is.not.undefined;
            expect(data.refreshedResponse.response).is.eql(expectedResponse);
          });
        });

        it(`should call fetch with multiple requests and correct parameters (${description})`, async () => {
          // given
          /**
           * @type {FetchIdRequestData}
           */
          const firstInstanceData = {
            ...DEFAULT_FETCH_DATA,
            integrationId: crypto.randomUUID(),
            cacheId: crypto.randomUUID(),
            role: 'leader'
          };
          /**
           * @type {FetchIdRequestData}
           */
          const secondInstanceData = {
            integrationId: crypto.randomUUID(),
            cacheId: crypto.randomUUID(),
            requestCount: 2,
            origin: 'other-origin',
            originVersion: '7.0.1',
            partnerId: 4321,
            refererInfo: {
              ref: 'http://example.com/iframe1.html',
              topmostLocation: 'http://example.com/page.html',
              reachedTop: false,
              numIframes: 2,
              stack: [
                'http://example.com/page.html',
                'http://example.com/iframe1.html',
                'http://example.com/iframe2.html'
              ],
              canonicalUrl: 'https://id5.io'
            },
            isUsingCdn: false,
            att: 10,
            refreshInSeconds: 3600,
            role: 'follower',
            ...data
          };
          const nbPage1 = 3;
          const nbPage2 = 4;
          storedDataState.nb[firstInstanceData.partnerId] = nbPage1;
          storedDataState.nb[secondInstanceData.partnerId] = nbPage2;

          // when
          const fetchIdResult = fetcher.getId([firstInstanceData, secondInstanceData]);

          // then
          return fetchIdResult.refreshResult.then(data => {
            const expectedResponse = createResponse(FETCH_RESPONSE_OBJ, [firstInstanceData, secondInstanceData]);

            expect(consentManager.setStoredPrivacy).to.have.been.calledWith(PRIVACY_DATA_RETURNED);

            expect(store.storeRequestData).to.have.been.calledWith(CONSENT_DATA_GDPR_ALLOWED, [firstInstanceData, secondInstanceData]);
            expect(store.storeResponse).to.have.been.calledWith([firstInstanceData, secondInstanceData], new RefreshedResponse(expectedResponse, CURRENT_TIME), false);

            expectHttpPOST(server.requests[0], `https://id5-sync.com/gm/v3`, {
              requests: [
                expectedRequestFor(firstInstanceData, CONSENT_DATA_GDPR_ALLOWED, DEFAULT_EXTENSIONS, nbPage1, storedDataState),
                expectedRequestFor(secondInstanceData, CONSENT_DATA_GDPR_ALLOWED, DEFAULT_EXTENSIONS, nbPage2, storedDataState, expectedInRequest)
              ]
            });

            expect(data.refreshedResponse.timestamp).is.not.null;
            expect(data.refreshedResponse.timestamp).is.not.undefined;
            expect(data.refreshedResponse.response).is.eql(expectedResponse);
          });
        });
      });

      [true, false, undefined].forEach(accessibilityResult => {
        it(`checks local storage accessibility result when (${accessibilityResult})`, function () {
          const nbPage = 3;
          storedDataState.nb[DEFAULT_FETCH_DATA.partnerId] = nbPage;
          localStorageCheckStub.reset();
          localStorageCheckStub.returns(accessibilityResult);

          // when
          const inputFetchData = [DEFAULT_FETCH_DATA];
          const fetchIdResult = fetcher.getId(inputFetchData);

          // then
          return fetchIdResult.refreshResult.then(() => {

            expectHttpPOST(server.requests[0], `https://id5-sync.com/gm/v3`, {
              requests: [
                expectedRequestFor(DEFAULT_FETCH_DATA, CONSENT_DATA_GDPR_ALLOWED, DEFAULT_EXTENSIONS, nbPage, storedDataState, {
                  localStorage: accessibilityResult === true ? 1 : 0
                })]
            });
          });
        });
      });

      it(`passes GPP consent information to server`, function () {
        const gppAllowed = new ConsentData(API_TYPE.GPP_V1_1);
        gppAllowed.gppData = new GppConsentData(API_TYPE.GPP_V1_1, true, [2, 6], 'GPP_STRING');

        // when
        consentManager.getConsentData.resolves(gppAllowed);
        const inputFetchData = [DEFAULT_FETCH_DATA];
        const fetchIdResult = fetcher.getId(inputFetchData);

        // then
        return fetchIdResult.refreshResult.then(() => {
          expect(server.requests[0].url).is.eq(`https://id5-sync.com/gm/v3`);
          let body = JSON.parse(server.requests[0].requestBody);
          expect(body.requests).to.have.lengthOf(1);
          expect(body.requests[0].gpp_string).is.eq('GPP_STRING');
          expect(body.requests[0].gpp_sid).is.eq('2,6');
        });
      });

    });

    describe('when previous response is in cache', function () {
      beforeEach(function () {
        consentManager.localStorageGrant.onCall(0).returns(new LocalStorageGrant(true, GRANT_TYPE.JURISDICTION, API_TYPE.NONE));
        consentManager.localStorageGrant.returns(LOCAL_STORAGE_GRANT_ALLOWED_BY_API);
      });

      it(`should provide from cache and don't refresh when all freshness conditions are met`, function () {
        // given
        const stateStub = sinon.createStubInstance(StoredDataState);

        stateStub.storedResponse = FETCH_RESPONSE_OBJ;
        stateStub.storedDateTime = 1234;
        stateStub.consentHasChanged = false;
        stateStub.pdHasChanged = false;
        stateStub.isStoredIdStale.returns(false);
        stateStub.refreshInSecondsHasElapsed.returns(false);
        stateStub.isResponseComplete.returns(true);
        stateStub.isResponsePresent.returns(true);
        stateStub.segmentsHaveChanged = false;
        stateStub.hasValidUid.returns(true);
        stateStub.consentHasChanged = false;
        stateStub.nb = {};

        store.getStoredDataState.returns(stateStub);

        // when
        const fetchIdResult = fetcher.getId([DEFAULT_FETCH_DATA]);

        // then
        const fromCacheData = fetchIdResult.cachedResponse;
        expect(extensions.gather).to.have.not.been.called;
        expect(server.requests).to.have.lengthOf(0);

        expect(fromCacheData.timestamp).is.eq(stateStub.storedDateTime);
        expect(fromCacheData.response).is.eql(stateStub.storedResponse);

        return fetchIdResult.refreshResult.then(result => {
          expect(store.incNbs).to.have.been.calledWith([DEFAULT_FETCH_DATA], stateStub);
          expect(store.storeRequestData).to.have.been.calledWith(CONSENT_DATA_GDPR_ALLOWED, [DEFAULT_FETCH_DATA]);

          expect(consentManager.setStoredPrivacy).to.have.not.been.called;
          expect(result).to.be.eql(new RefreshResult(CONSENT_DATA_GDPR_ALLOWED));
        });
      });

      [
        { desc: 'refresh required', responseComplete: true, refreshRequired: true, consentHasChanged: false },
        { desc: 'consent changed', responseComplete: true, refreshRequired: false, consentHasChanged: true },
        { desc: 'response incomplete', responseComplete: false, refreshRequired: false, consentHasChanged: false }
      ].forEach(testCase => {
        it(`should provide from cache and then trigger a refresh when ${testCase.desc}`, function () {
          // given
          const stateStub = sinon.createStubInstance(StoredDataState);

          stateStub.storedResponse = FETCH_RESPONSE_OBJ;
          stateStub.storedDateTime = 1234;
          stateStub.consentHasChanged = testCase.consentHasChanged;
          stateStub.pdHasChanged = false;
          stateStub.isStoredIdStale.returns(false);
          stateStub.refreshInSecondsHasElapsed.returns(testCase.refreshRequired);
          stateStub.isResponseComplete.returns(testCase.responseComplete);
          stateStub.isResponsePresent.returns(true);
          stateStub.segmentsHaveChanged = false;
          stateStub.hasValidUid.returns(true);
          stateStub.nb = {};

          store.getStoredDataState.returns(stateStub);
          consentManager.getConsentData.reset();
          let resolveConsent;
          consentManager.getConsentData.returns(new Promise((resolve) => {
            resolveConsent = resolve;
          }));

          // when
          const fetchIdResult = fetcher.getId([DEFAULT_FETCH_DATA]);

          // then
          const fromCacheData = fetchIdResult.cachedResponse;
          expect(extensions.gather).to.not.have.been.called;
          expect(server.requests).to.have.lengthOf(0);

          expect(fromCacheData.timestamp).is.eq(stateStub.storedDateTime);
          expect(fromCacheData.response).is.eql(stateStub.storedResponse);

          expect(store.incNbs).to.have.been.calledWith([DEFAULT_FETCH_DATA], stateStub);

          resolveConsent(CONSENT_DATA_GDPR_ALLOWED);
          return fetchIdResult.refreshResult.then(refreshedData => {
            expect(extensions.gather).to.have.been.called;
            expect(server.requests).to.have.lengthOf(1);

            expect(refreshedData.refreshedResponse).to.not.be.undefined;
            expect(refreshedData.refreshedResponse.timestamp).to.not.be.undefined;
            expect(refreshedData.refreshedResponse.timestamp).is.not.eq(stateStub.storedDateTime);
            const expectedResponse = createResponse(FETCH_RESPONSE_OBJ, [DEFAULT_FETCH_DATA]);
            expect(refreshedData.refreshedResponse.response).is.eql(expectedResponse);

            expect(store.storeRequestData).to.have.been.calledWith(CONSENT_DATA_GDPR_ALLOWED, [DEFAULT_FETCH_DATA]);
            expect(store.storeResponse).to.have.been.calledWith([DEFAULT_FETCH_DATA], new RefreshedResponse(expectedResponse, CURRENT_TIME), true);
            expect(consentManager.setStoredPrivacy).to.have.been.calledWith(PRIVACY_DATA_RETURNED);
          });
        });
      });

      [
        { desc: 'pd changed', hasValidUid: true, pdHasChanged: true, segmentsHaveChanged: false, isStale: false },
        { desc: 'segments changed', hasValidUid: true, pdHasChanged: false, segmentsHaveChanged: true, isStale: false },
        { desc: 'is stale', hasValidUid: true, pdHasChanged: false, segmentsHaveChanged: false, isStale: true },
        { desc: 'has invalid uid', hasValidUid: false, pdHasChanged: false, segmentsHaveChanged: false, isStale: false }
      ].forEach(testCase => {
        it(`should not provide from cache but rather make a request when (${testCase.desc})`, function () {
          // given
          const stateStub = sinon.createStubInstance(StoredDataState);

          stateStub.storedResponse = FETCH_RESPONSE_OBJ;
          stateStub.storedDateTime = 1234;
          stateStub.consentHasChanged = false;
          stateStub.pdHasChanged = testCase.pdHasChanged;
          stateStub.isStoredIdStale.returns(testCase.isStale);
          stateStub.refreshInSecondsHasElapsed.returns(false);
          stateStub.isResponseComplete.returns(true);
          stateStub.isResponsePresent.returns(true);
          stateStub.segmentsHaveChanged = testCase.segmentsHaveChanged;
          stateStub.hasValidUid.returns(testCase.hasValidUid);
          stateStub.nb = {};

          store.getStoredDataState.returns(stateStub);

          // when
          const fetchIdResult = fetcher.getId([DEFAULT_FETCH_DATA]);

          // then
          expect(fetchIdResult.cachedResponse).to.be.undefined;
          return fetchIdResult.refreshResult.then(data => {
            expect(extensions.gather).to.have.been.called;
            expect(server.requests).to.have.lengthOf(1);

            expect(data.refreshedResponse).to.not.be.undefined;
            expect(data.refreshedResponse.timestamp).is.not.undefined;
            expect(data.refreshedResponse.timestamp).is.not.eq(stateStub.storedDateTime);
            const expectedResponse = createResponse(FETCH_RESPONSE_OBJ, [DEFAULT_FETCH_DATA]);
            expect(data.refreshedResponse.response).is.eql(expectedResponse);

            expect(store.storeRequestData).to.have.been.calledWith(CONSENT_DATA_GDPR_ALLOWED, [DEFAULT_FETCH_DATA]);
            expect(store.storeResponse).to.have.been.calledWith([DEFAULT_FETCH_DATA], new RefreshedResponse(expectedResponse, CURRENT_TIME), false);
            expect(store.incNbs).to.have.not.been.called;

            expect(consentManager.setStoredPrivacy).to.have.been.calledWith(PRIVACY_DATA_RETURNED);
          });
        });
      });

      it(`should not provide from cache when local storage access not granted`, function () {
        // given
        const stateStub = sinon.createStubInstance(StoredDataState);

        stateStub.storedResponse = FETCH_RESPONSE_OBJ;
        stateStub.storedDateTime = 1234;
        stateStub.consentHasChanged = false;
        stateStub.pdHasChanged = false;
        stateStub.isStoredIdStale.returns(false);
        stateStub.refreshInSecondsHasElapsed.returns(false);
        stateStub.isResponseComplete.returns(true);
        stateStub.isResponsePresent.returns(true);
        stateStub.segmentsHaveChanged = false;
        stateStub.hasValidUid.returns(true);
        stateStub.nb = {};

        store.getStoredDataState.returns(stateStub);

        consentManager.localStorageGrant.reset();
        consentManager.localStorageGrant.onCall(0).returns(new LocalStorageGrant(false, GRANT_TYPE.CONSENT_API, API_TYPE.TCF_V2));
        consentManager.localStorageGrant.onCall(1).returns(LOCAL_STORAGE_GRANT_ALLOWED_BY_API);
        consentManager.localStorageGrant.onCall(2).returns(LOCAL_STORAGE_GRANT_ALLOWED_BY_API);

        // when
        const fetchIdResult = fetcher.getId([DEFAULT_FETCH_DATA]);

        // then
        expect(fetchIdResult.cachedResponse).to.be.undefined;
        return fetchIdResult.refreshResult.then(data => {
          expect(extensions.gather).to.have.been.called;
          expect(server.requests).to.have.lengthOf(1);

          expect(data.refreshedResponse).to.not.be.undefined;
          expect(data.refreshedResponse.timestamp).is.not.undefined;
          expect(data.refreshedResponse.timestamp).is.not.eq(stateStub.storedDateTime);
          const expectedResponse = createResponse(FETCH_RESPONSE_OBJ, [DEFAULT_FETCH_DATA]);
          expect(data.refreshedResponse.response).is.eql(expectedResponse);

          expect(store.storeRequestData).to.have.been.calledWith(CONSENT_DATA_GDPR_ALLOWED, [DEFAULT_FETCH_DATA]);
          expect(store.storeResponse).to.have.been.calledWith([DEFAULT_FETCH_DATA], new RefreshedResponse(expectedResponse, CURRENT_TIME), false);
          expect(store.incNbs).to.have.not.been.called;

          expect(consentManager.setStoredPrivacy).to.have.been.calledWith(PRIVACY_DATA_RETURNED);
        });
      });
    });
  });

  describe('when server response does not grant consent', function () {
    beforeEach(function () {
      server = sinon.fakeServer.create();
      server.respondImmediately = true;
      server.respondWith(sinonFetchResponder(request =>
        prepareJsonResponse(FETCH_RESPONSE_OBJ_NO_CONSENT, request.requestBody)
      ));
    });

    afterEach(function () {
      server.restore();
    });

    describe('when no state is saved in cache', function () {
      let storedDataState;

      beforeEach(function () {
        storedDataState = Object.assign(new StoredDataState(), {
          nb: {},
          refreshInSeconds: 7200
        });
        store.getStoredDataState.returns(storedDataState);
        consentManager.localStorageGrant.reset();
        consentManager.localStorageGrant.onCall(0).returns(new LocalStorageGrant(true, GRANT_TYPE.PROVISIONAL, API_TYPE.NONE));
        consentManager.localStorageGrant.onCall(1).returns(new LocalStorageGrant(true, GRANT_TYPE.CONSENT_API, API_TYPE.TCF_V2));
        consentManager.localStorageGrant.onCall(2).returns(new LocalStorageGrant(false, GRANT_TYPE.ID5_CONSENT, API_TYPE.TCF_V2));
      });

      it('should not store response in storage but rather clear it but still stores the privacy object', function () {
        const fetchData = [{
          ...DEFAULT_FETCH_DATA,
          integrationId: crypto.randomUUID()
        }];

        // when
        const fetchIdResult = fetcher.getId(fetchData);

        // then
        expect(fetchIdResult.cachedResponse).to.be.undefined;
        return fetchIdResult.refreshResult.then(data => {
          expect(extensions.gather).to.have.been.called;
          expect(server.requests).to.have.lengthOf(1);
          expect(data.refreshedResponse.response).to.be.eql(createResponse(FETCH_RESPONSE_OBJ_NO_CONSENT, fetchData));
          expect(consentManager.setStoredPrivacy).to.have.been.calledWith({
            jurisdiction: 'gdpr',
            id5_consent: false
          });
          expect(store.storeResponse).to.not.have.been.called;
          expect(store.clearAll).to.have.been.called;
        });
      });
    });

    describe('when explicit denial of consent is saved in cache', function () {
      let storedDataState;

      beforeEach(function () {
        storedDataState = Object.assign(new StoredDataState(), {
          nb: {},
          refreshInSeconds: 7200
        });
        store.getStoredDataState.returns(storedDataState);
        consentManager.getConsentData.reset();
        consentManager.getConsentData.resolves(CONSENT_DATA_GDPR_NOT_ALLOWED);
        consentManager.localStorageGrant.returns(new LocalStorageGrant(false, GRANT_TYPE.JURISDICTION, API_TYPE.NONE));
      });

      it('should neither make a request to the backend nor read previous response from local storage nor store request state', function () {
        const fetchData = [{
          ...DEFAULT_FETCH_DATA,
          integrationId: crypto.randomUUID()
        }];

        // when
        const fetchIdResult = fetcher.getId(fetchData);

        // then
        expect(fetchIdResult.cachedResponse).to.be.undefined;
        return fetchIdResult.refreshResult.catch(error => {
          expect(extensions.gather).to.not.have.been.called;
          expect(server.requests).to.have.lengthOf(0);
          expect(store.getStoredDataState).to.not.have.been.called;
          expect(store.storeRequestData).to.not.have.been.called;
          expect(error).to.be.eql(new NoConsentError(CONSENT_DATA_GDPR_NOT_ALLOWED, 'No legal basis to use ID5'));
        });
      });
    });
  });


  describe('should handle fetch refresh error', function () {
    const fetchData = DEFAULT_FETCH_DATA;

    beforeEach(function () {
      /**
       * @type {FetchIdRequestData}
       */
      server = sinon.fakeServer.create();
      server.respondImmediately = true;
      consentManager.localStorageGrant.returns(LOCAL_STORAGE_GRANT_ALLOWED_BY_API);
      store.getStoredDataState.returns(Object.assign(new StoredDataState(), {
        nb: {},
        refreshInSeconds: 7200
      }));
    });

    afterEach(function () {
      server.restore();
    });

    it('when empty response', function () {
      // given
      server.respondWith(sinonFetchResponder(() => ''));

      // when
      const fetchIdResult = fetcher.getId([fetchData]);

      // then
      return fetchIdResult.refreshResult.catch(error => {
        // done
        expect(error).is.eql(new Error('Empty fetch response from ID5 servers: ""'));
      });
    });

    it('when invalid json response', function () {
      // given
      server.respondWith(sinonFetchResponder(() => '{'));

      // when
      const fetchIdResult = fetcher.getId([fetchData]);


      // then
      return fetchIdResult.refreshResult.catch(error => {
        // done
        expect(error).is.instanceof(SyntaxError);
      });
    });

    it('when ajax fails', function () {
      // given
      server.respondWith((request) => {
        request.respond(500, { 'Content-Type': ' application/json' }, 'Error');
      });

      // when
      const fetchIdResult = fetcher.getId([fetchData]);

      // then
      return fetchIdResult.refreshResult.catch(error => {
        // done
        expect(error).is.eql('Internal Server Error');
      });
    });

    it('when missing universal_uid', function () {
      // given
      server.respondWith(sinonFetchResponder(() => '{ "property" : 10 }'));

      // when
      const fetchIdResult = fetcher.getId([fetchData]);

      // then
      return fetchIdResult.refreshResult.catch(error => {
        // done
        expect(error).is.eql(new Error(`Server response failed to validate: { "property" : 10 }`));
      });
    });

    it('when failed while handling valid response', function () {
      // given
      const someError = new Error('error while storing privacy');
      server.respondWith(sinonFetchResponder(request =>
        prepareJsonResponse(FETCH_RESPONSE_OBJ, request.requestBody)
      ));
      consentManager.setStoredPrivacy.throws(someError);

      // when
      const fetchIdResult = fetcher.getId([fetchData]);

      // then
      return fetchIdResult.refreshResult.catch(error => {
        // done
        expect(error).is.eql(someError);
      });
    });
  });
});

// Helper functions

/**
 * @type FetchIdRequestData
 */
function expectedRequestFor(fetchIdData, consentData, extensions, nbPage, storedDataState, other = undefined) {
  return {
    requestId: fetchIdData.integrationId,
    requestCount: fetchIdData.requestCount,
    role: fetchIdData.role,
    cacheId: fetchIdData.cacheId,
    att: fetchIdData.att,
    extensions: extensions,
    gdpr: consentData.gdprApplies ? 1 : 0,
    gdpr_consent: consentData.consentString,
    id5cdn: fetchIdData.isUsingCdn,
    localStorage: 1,
    o: fetchIdData.origin,
    v: fetchIdData.originVersion,
    partner: fetchIdData.partnerId,
    provided_options: {},
    cu: fetchIdData.refererInfo.canonicalUrl,
    ref: fetchIdData.refererInfo.ref,
    tml: fetchIdData.refererInfo.topmostLocation,
    top: fetchIdData.refererInfo.reachedTop ? 1 : 0,
    u: fetchIdData.refererInfo.stack[0],
    ua: window.navigator.userAgent,
    used_refresh_in_seconds: storedDataState.refreshInSeconds,
    nbPage: nbPage,
    ...other
  };
}

function expectHttpPOST(request, url, body) {
  expect(request.url).is.eq(url);
  expect(request.method).is.eq('POST');
  const requestBody = JSON.parse(request.requestBody);
  expect(requestBody).is.eql(body);
}

function sinonFetchResponder(responseProvider) {
  return (request) => {
    request.respond(200, { 'Content-Type': ' application/json' }, responseProvider(request));
  };
}

function buildTestUaHints() {
  return {
    'architecture': 'x86',
    'brands': [
      {
        'brand': ' Not A;Brand',
        'version': '99'
      },
      {
        'brand': 'Chromium',
        'version': '101'
      },
      {
        'brand': 'Froogle Chrome',
        'version': '101'
      }
    ],
    'fullVersionList': [
      {
        'brand': ' Not A;Brand',
        'version': '99.0.0.0'
      },
      {
        'brand': 'Chromium',
        'version': '101.0.4951.64'
      },
      {
        'brand': 'Froogle Chrome',
        'version': '101.0.4951.64'
      }
    ],
    'mobile': false,
    'model': '',
    'platform': 'Linux',
    'platformVersion': '5.17.9'
  };
}
