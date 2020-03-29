AFRAME.registerComponent('beam', {
  schema: {
    length: {type: 'number'},
    width: {type: 'number'},
    thickness: {type: 'number'},
    height: {type: 'number'},
    src: {type: 'string', default: 'textures/concrete_floor.jpg'},    
  },

  init: function () {
    // Do something when component first attached.
    let data = this.data
    let el = this.el

    let materials = []

    for(let i = 0; i < 6; i++)
    {
      let texture = new THREE.TextureLoader().load(data.src)
      materials.push(new THREE.MeshStandardMaterial({map: texture}))
    }

    let geometry = new THREE.BoxBufferGeometry(data.length, data.thickness, data.width)
    let mesh = new THREE.Mesh(geometry, materials)

    el.setObject3D('mesh', mesh)
    mesh.position.set(data.length/2, data.height, 0)

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


AFRAME.registerComponent('wall', {
  schema: {
    length: {type: 'number'},
    height: {type: 'number', default: 5},
    orientation: {type: 'string', default: 'left'},
    color: {type:'string', default:'#ffffff'},
    src: {type: 'string', default: 'textures/wall2.jpg'},
  },

  init: function () {
    // Do something when component first attached.
    let data = this.data
    let el = this.el
    
    let wallTexture = new THREE.TextureLoader().load(data.src)
    let wallGeometry = new THREE.PlaneBufferGeometry(data.length, data.height)
    let wallMaterial = new THREE.MeshStandardMaterial({map: wallTexture})
    let wallMesh = new THREE.Mesh(wallGeometry, wallMaterial)

    el.setObject3D('mesh', wallMesh)

    let beam = document.createElement('a-entity')
    beam.setAttribute('beam', `length: ${data.length + 0.2}; width: ${0.3}; thickness: ${0.5}; height: ${data.height - 0.25}`)

    el.appendChild(beam)

    wallMesh.position.set(data.length/2, data.height/2, 0)
    if(data.orientation == "right") wallMesh.rotateY(3.14159)
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
    width: {type: 'number'},
    depth: {type: 'number'},
    src: {type: 'string', default: 'textures/concrete_floor.jpg'},
  },

  init: function () {
    // Do something when component first attached.
    let data = this.data
    let el = this.el
    let floorMaterials = []

    for(let i = 0; i < 6; i++)
    {
      let floorTexture = new THREE.TextureLoader().load(data.src)
      floorMaterials.push(new THREE.MeshStandardMaterial({map: floorTexture}))
    }

    let floorGeometry = new THREE.BoxBufferGeometry(data.depth, 0.01, data.width)
    let floorMesh = new THREE.Mesh(floorGeometry, floorMaterials)

    el.setObject3D('mesh', floorMesh)
    floorMesh.position.set(data.depth/2, 0, -data.width/2)
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

