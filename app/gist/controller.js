import Ember from "ember";

const { RSVP, run } = Ember;

export default Ember.Controller.extend({
  queryParams: ['numColumns', 'fullScreen', 'route', 'openFiles', 'fileTreeShown'],
  numColumns: 1,
  fullScreen: false,
  openFiles: "",
  fileTreeShown: true,
  route: undefined,
  applicationUrl: undefined,
  unsaved: true,

  init(...args) {
    this._super(...args);
    this.setupWindowUpdate();
  },

  actions: {
    transitionQueryParams(queryParams) {
      return this.transitionToRoute({ queryParams: queryParams }).then(() => {
        return RSVP.resolve(queryParams);
      });
    }
  },

  setupWindowUpdate: function() {
    // TODO: this in a controller seems suspect, rather this should likely be
    // part of some handshake, to ensure no races exist. This should likley not
    // be something a controller would handle - (SP)
    window.addEventListener('message', (m) => {
      run(() => {
        if(typeof m.data==='object' && 'setDemoAppUrl' in m.data) {
          if (!this.get('isDestroyed')) {
            if (window.messagesWaiting > 0) {
              window.messagesWaiting = 0;
            }
            const newRoute = m.data.setDemoAppUrl || '/';
            this.setProperties({
              applicationUrl: newRoute,
              route: newRoute === "/" ? undefined : newRoute
            });
          }
        }
      });
    });
  }
});
