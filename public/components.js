AFRAME.registerComponent('wall', {
  schema: {
    id: {type: 'string'},
    length: {type: 'number'},
    x: {type: 'number'},
    z: {type: 'number'},
    rotY: {type: 'number'},
    orientation: {type: 'string', default: 'left'}
  },

  init: function () {
    // Do something when component first attached.
  },

  update: function () {
    // Do something when component's data is updated.
  },

  remove: function () {
    // Do something the component or its entity is detached.
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
  }
});

AFRAME.registerComponent('floor', {
  schema: {
    id: {type: 'string'},
    width: {type: 'number'},
    depth: {type: 'number'},
    x: {type: 'number'},
    z: {type: 'number'},
    rotY: {type: 'number'}
  },

  init: function () {
    // Do something when component first attached.
  },

  update: function () {
    // Do something when component's data is updated.
  },

  remove: function () {
    // Do something the component or its entity is detached.
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
  }
});

AFRAME.registerComponent('framed-art', {
  schema: {
    artData: {type: 'string'},
    width: {type: 'number'}
  },

  init: function () {
    // Do something when component first attached.
  },

  update: function () {
    // Do something when component's data is updated.
  },

  remove: function () {
    // Do something the component or its entity is detached.
  },

  tick: function (time, timeDelta) {
    // Do something on every scene tick or frame.
  }
});



AFRAME.registerComponent('malloci', {
    schema: {
      mdURL: {type: 'string'},
      hallWidth: {type: 'number', default: 8},
      height: {type: 'number', default: 4},
    },
  
    /**
     * Initial creation and setting of the mesh.
     */
    init: function () {
      var data = this.data;
      var el = this.el;
  
      
    }
  });

