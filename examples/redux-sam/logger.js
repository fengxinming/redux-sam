/*
 * redux-sam.js v1.1.1
 * (c) 2018-2019 Jesse Feng
 * Released under the MIT License.
 */
import copy from 'celia.object/copy';

function createSamLogger(ref) {
  if ( ref === void 0 ) ref = {};
  var collapsed = ref.collapsed; if ( collapsed === void 0 ) collapsed = true;
  var filter = ref.filter; if ( filter === void 0 ) filter = function (mutation, stateBefore, stateAfter) { return true; };
  var transformer = ref.transformer; if ( transformer === void 0 ) transformer = function (state) { return state; };
  var mutationTransformer = ref.mutationTransformer; if ( mutationTransformer === void 0 ) mutationTransformer = function (mut) { return mut; };
  var logger = ref.logger; if ( logger === void 0 ) logger = console;

  return function (sam) {
    var prevState = copy(sam.state, true);

    sam.subscribe(function (mutation, state) {
      if (typeof logger === 'undefined') {
        return;
      }
      var nextState = copy(state, true);

      if (filter(mutation, prevState, nextState)) {
        var time = new Date();
        var formattedTime = " @ " + (pad(time.getHours(), 2)) + ":" + (pad(time.getMinutes(), 2)) + ":" + (pad(time.getSeconds(), 2)) + "." + (pad(time.getMilliseconds(), 3));
        var formattedMutation = mutationTransformer(mutation);
        var message = "mutation " + (mutation.type) + formattedTime;
        var startMessage = collapsed
          ? logger.groupCollapsed
          : logger.group;

        // render
        try {
          startMessage.call(logger, message);
        } catch (e) {
          console.log(message);
        }

        logger.log('%c prev state', 'color: #9E9E9E; font-weight: bold', transformer(prevState));
        logger.log('%c mutation', 'color: #03A9F4; font-weight: bold', formattedMutation);
        logger.log('%c next state', 'color: #4CAF50; font-weight: bold', transformer(nextState));

        try {
          logger.groupEnd();
        } catch (e) {
          logger.log('—— log end ——');
        }
      }

      prevState = nextState;
    });
  };
}

function repeat(str, times) {
  return (new Array(times + 1)).join(str);
}

function pad(num, maxLength) {
  return repeat('0', maxLength - num.toString().length) + num;
}

export default createSamLogger;
