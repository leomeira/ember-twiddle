import GistEditRoute from "../route";

export default GistEditRoute.extend({

  controllerName: 'gist',
  templateName: 'gist',

  model(params) {
    this.get('store').unloadAll('gistFile');
    const gistParams = this.paramsFor('gist.edit');

    return this.get('store').query('gist-revision', {
      gistId: gistParams.gistId,
      revId: params.revId
    }).then((response) => {
      return response.get('firstObject');
    });
  }
});
