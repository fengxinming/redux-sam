import isFunction from 'celia/isFunction';
import { normalizeNamespace, normalizeMap, getContextByNamespace } from './lib/utils';

function mapMutations(sam) {
  return normalizeNamespace((component, mutations, namespace) => {
    normalizeMap(mutations, (val, key) => {
      component[key] = function mappedMutation(...args) {
        let { commit } = sam;
        if (namespace) {
          const ctx = getContextByNamespace(sam, 'mapMutations', namespace);
          if (!ctx) {
            return;
          }
          commit = ctx.commit;
        }
        return isFunction(val)
          ? val.apply(component, [commit, ...args])
          : commit.apply(sam, [val, ...args]);
      };
    });
  });
};

function mapActions(sam) {
  return normalizeNamespace((component, actions, namespace) => {
    normalizeMap(actions, (val, key) => {
      component[key] = function mappedMutation(...args) {
        let { dispatch } = sam;
        if (namespace) {
          const ctx = getContextByNamespace(sam, 'mapActions', namespace);
          if (!ctx) {
            return;
          }
          dispatch = ctx.dispatch;
        }
        return isFunction(val)
          ? val.apply(component, [dispatch, ...args])
          : dispatch.apply(sam, [val, ...args]);
      };
    });
  });
};

export default function (sam) {
  return {
    mapMutations: mapMutations(sam),
    mapActions: mapActions(sam)
  };
};
