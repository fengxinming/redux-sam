import clone from 'celia/looseClone';

export default function createSamLogger({
  collapsed = true,
  filter = (mutation, stateBefore, stateAfter) => true,
  transformer = state => state,
  mutationTransformer = mut => mut,
  logger = console
} = {}) {
  return (sam) => {
    let prevState = clone(sam.state, true);

    sam.subscribe((mutation, state) => {
      if (typeof logger === 'undefined') {
        return;
      }
      const nextState = clone(state, true);

      if (filter(mutation, prevState, nextState)) {
        const time = new Date();
        const formattedTime = ` @ ${time.toLocaleTimeString()}`;
        const formattedMutation = mutationTransformer(mutation);
        const message = `mutation ${mutation.type}${formattedTime}`;
        const startMessage = collapsed
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
