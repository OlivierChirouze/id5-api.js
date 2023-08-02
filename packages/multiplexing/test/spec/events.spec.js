import {expect} from 'chai';
import sinon from "sinon";
import {ApiEvent, ApiEventsDispatcher} from "../../src/apiEvent.js";
import {NoopLogger} from "../../src/logger.js";
import chai from "chai";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

const _DEBUG = false;
describe('ApiEventsDispatcher', function () {

  /**
   * @type {ApiEventsDispatcher}
   */
  let dispatcher;

  beforeEach(function () {
    dispatcher = new ApiEventsDispatcher(_DEBUG ? console : NoopLogger);
  });

  afterEach(function () {
  });

  it(`should call only handlers registered for event`, function () {
    // given
    const handlerA = sinon.stub();
    const payloadA = {a: 1};
    dispatcher.on(ApiEvent.CONSENT_UPDATED, handlerA);

    const handlerB = sinon.stub();
    const payloadB = {b: 1};
    dispatcher.on(ApiEvent.USER_ID_READY, handlerB);

    // when
    dispatcher.emit(ApiEvent.CONSENT_UPDATED, payloadA);
    dispatcher.emit(ApiEvent.USER_ID_READY, payloadB);

    // then
    expect(handlerA).to.have.been.calledOnce;
    expect(handlerA).to.have.been.calledWith(payloadA);
    expect(handlerB).to.have.been.calledOnce;
    expect(handlerB).to.have.been.calledWith(payloadB);
    // when
  });

  it(`should call all handlers when event emitted`, function () {
    // given
    const event = ApiEvent.CONSENT_UPDATED;
    const handlerA = sinon.stub();
    const handlerB = sinon.stub();
    const payload = {x: 1};
    dispatcher.on(event, handlerA);
    dispatcher.on(event, handlerB);

    // when
    dispatcher.emit(event, payload);

    // then
    expect(handlerA).to.have.been.calledWith(payload);
    expect(handlerB).to.have.been.calledWith(payload);
  });

  it(`should ignore handlers errors and call others`, function () {
    // given
    const event = ApiEvent.CONSENT_UPDATED;
    const handlerA = sinon.stub().throws('BOOM');
    const handlerB = sinon.stub().throws('BOOM');
    const payload = {x: 1};
    dispatcher.on(event, handlerA);
    dispatcher.on(event, handlerB);

    // when
    dispatcher.emit(event, payload);

    // then
    expect(handlerA).to.have.been.calledWith(payload);
    expect(handlerB).to.have.been.calledWith(payload);
  });
});
