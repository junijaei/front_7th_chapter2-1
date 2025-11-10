/**
 * @typedef Component 컴포넌트
 * @property {function(*): *} initialState
 * @property {function(({state, props})): string} template
 * @property {function(({state, props, mountChildren})): string} children
 * @property {function({state: object, setState: function}): void} onMounted
 * @property {function({state: object, setState: function}): void} onUpdated
 * @property {function({state: object, setState: function}): void} onDestroy
 */

/**
 *
 * @param {Component} component
 * @returns {function(object, object): object}
 */

export const Component = (component) => {
  return (selector, props = {}) => {
    let state = component.initialState?.() || {};
    let isMounted = false;
    let children = [];

    const setState = (newState) => {
      state = { ...state, ...newState };
      render();
    };

    const mountChildren = (ComponentFn, selector, childrenProps = {}) => {
      const childrenTarget = document.querySelector(selector);
      if (childrenTarget) {
        const child = ComponentFn(selector, childrenProps);
        if (child) children.push(child);
      }
    };

    const destroyChildren = () => {
      children.forEach((child) => {
        if (child && child.destroy) child.destroy();
      });
      children = [];
    };

    const render = () => {
      console.log("render!!");
      destroyChildren();

      const target = document.querySelector(selector);
      target.innerHTML = component.template({ state, props });

      if (component.children) {
        console.log("children!!!");
        component.children({ state, props, mountChildren });
      }

      if (!isMounted) {
        isMounted = true;
        if (component.onMounted) component.onMounted({ state, setState, props, mountChildren });
      }

      if (isMounted && component.onUpdated) component.onUpdated({ state, setState });
    };

    const destroy = () => {
      destroyChildren();

      if (component.onDestroy) component.onDestroy();
    };

    render();

    return {
      state: () => state,
      setState,
      destroy,
    };
  };
};
