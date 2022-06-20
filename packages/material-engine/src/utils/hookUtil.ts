/**
 * hook utils
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

  console.log('registerHook', action);

  hookStore[action].push(handler);
}

export function triggerHook(action: string, ...data: any) {
  if (!action || !hookStore[action]) {
    console.log('triggerHook, no action or no handler');
    return;
  }

  console.log('triggerHook', action);

  const handlers = hookStore[action];

  handlers.forEach((handler) => {
    if (handler && typeof handler === 'function') {
      handler(...data);
    }
  });
}
