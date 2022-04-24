import { customersFeature, initialState } from './customers.reducer';
import { init } from './customers.actions';

describe('Customer Reducer', () => {
  describe('init', () => {
    it("shouldn't do aynthing when state has no error", () => {
      const state = initialState;
      const newState = customersFeature.reducer(state, init());
      expect(state).toBe(newState);
    });

    it('should remove the error when state has an error', () => {
      const state = { ...initialState, hasError: true };
      const newState = customersFeature.reducer(state, init());
      expect(newState.hasError).toBe(false);
    });
  });
});
