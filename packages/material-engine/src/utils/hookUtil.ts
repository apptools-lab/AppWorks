/**
 * hool utils
 */
const hookStore = {};

export interface IMaterialHookHandler {
  (action: string, data?: any, args?: any): any
};

export function registerHook(action: string, handler: IMaterialHookHandler) {
  if (!action || !handler) {
    return;
  }

  hookStore[action] = hookStore[action] || [];

  hookStore[action].push(handler);
}

export function triggerHook(action: string, ...data: any) {
  if (!action || !hookStore[action]) {
    return;
  }

  const handlers = hookStore[action];

  handlers.forEach((handler) => {
    if (handler && typeof handler === 'function') {
      handler(...data);
    }
  });
}
