import "./style.css";
import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

const location = {
  painting1: {
    position: {
      x: -14,
      y: 10,
      z: -1.2,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  painting2: {
    position: {
      x: 18.963,
      y: 10.0,
      z: -1.8,
    },
    rotation: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
  },
  painting3: {
    position: {
      x: -16.522,
      y: 10.0,
      z: 49.15,
    },
    rotation: {
      x: 0.0,
      y: 0.0,
      z: 0.0,
    },
  },
  painting4: {
    position: {
      x: 48.75,
      y: 10.0,
      z: 13.543,
    },
    rotation: {
      x: 0.0,
      y: 90.0,
      z: 0.0,
    },
  },
  // painting: {
  //   position: {
  //     x: ,
  //     y: ,
  //     z: ,
  //   },
  //   rotation: {
  //     x: 0,
  //     y: 0,
  //     z: 0,
  //   },
  // },
};

const data = {
  painting1: {
    resource: "img/painting1.webp",
    resourceSize: 1200,
    title: "Tranh tô màu trẻ em",
    description: "Đây là tranh để cho trẻ em tô màu!!!",
    link: "https://ecommerce.uetbc.xyz/product/tranh-to-mau-tre-em-2/",
  },
  painting2: {
    resource: "img/painting2.webp",
    resourceSize: 450,
    title: "Tranh pikachu",
    description: "Pikà Pikà Chuuu!",
    link: "https://ecommerce.uetbc.xyz/product/pikachu/",
  },
  painting3: {
    resource: "img/painting3.webp",
    resourceSize: 300,
    title: "Tranh Totoro",
    description:
      "Gia đình Kusakabe chuyển về vùng thôn quê sinh sống. Căn nhà mới mà họ sắp ở dân làng đồn đại là bị ma ám. Nhưng điều ấy chẳng làm lay chuyển nỗi tò mò, hiếu động của hai chị em nhà Kusakabe: Satsuki và Mei. Tại ngôi nhà mới, Satsuki và Mei kết thân với bà hàng xóm tốt bụng tên Nanny và cậu bé Kanta, cùng tuổi với Satsuki.",
    link: "https://ecommerce.uetbc.xyz/product/totoro/",
  },
  painting4: {
    resource: "img/painting4.webp",
    resourceSize: 450,
    title: "Tranh dòng sông êm đềm",
    description: "Ơi! Con sông quê con sông quê...",
    link: "https://ecommerce.uetbc.xyz/product/tranh-dong-song-em-dem-ms474/",
  },
};

function openInNewTab(url) {
  window.open(url, "_blank").focus();
}

function addPainting(scene, name, location, data) {
  const painting = new BABYLON.MeshBuilder.CreatePlane(
    name,
    { size: 10, sizeOrientation: BABYLON.Mesh.DOUBLESIDE },
    scene
  );
  painting.enablePointerMoveEvents = true;

  painting.position = new BABYLON.Vector3(
    location.position.x,
    location.position.y,
    location.position.z
  );

  painting.rotation = new BABYLON.Vector3(
    degToRad(location.rotation.x),
    degToRad(location.rotation.y),
    degToRad(location.rotation.z)
  );

  const paintingTex = new BABYLON.DynamicTexture(
    name,
    data.resourceSize,
    scene
  );

  const textureContext = paintingTex.getContext();
  const paintingMat = new BABYLON.StandardMaterial(name, scene);
  paintingMat.diffuseTexture = paintingTex;

  const img = new Image();
  img.src = data.resource;
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    //Add image to dynamic texture
    textureContext.drawImage(this, 0, 0);
    paintingTex.update();
  };

  painting.material = paintingMat;
}

const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

let guiBG, guiTitle, guiDescription;

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  scene.collisionsEnabled = true;

  scene.debugLayer.show();

  await BABYLON.SceneLoader.AppendAsync("./models/", "room.babylon", scene);

  const camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 35, -10),
    scene
  );
  camera.applyGravity = true;
  camera.checkCollisions = true;
  camera.ellipsoid = new BABYLON.Vector3(1, 5, 1);
  camera._needMoveForGravity = false;
  camera.attachControl(canvas, true);
  camera.position = new BABYLON.Vector3(-35, 8, 5);

  const skybox = BABYLON.MeshBuilder.CreateBox(
    "skyBox",
    { size: 1000.0 },
    scene
  );
  const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
    "img/TropicalSunnyDay",
    scene
  );
  skyboxMaterial.reflectionTexture.coordinatesMode =
    BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  const light = new BABYLON.HemisphericLight(
    "light1",
    new BABYLON.Vector3(-1, 1, 0),
    scene
  );
  light.intensity = 1.5;

  for (let key in data) {
    console.log(location[key]);
    addPainting(scene, key, location[key], data[key]);
  }

  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  guiBG = new GUI.Rectangle();
  guiBG.isVisible = false;
  guiBG.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
  guiBG.width = 0.5;
  guiBG.top = "10px";
  guiBG.height = "150px";
  guiBG.color = "Orange";
  guiBG.background = "rgba(5,5,5,0.7)";
  advancedTexture.addControl(guiBG);

  guiTitle = new GUI.TextBlock();
  guiTitle.textVerticalAlignment = GUI.TextBlock.VERTICAL_ALIGNMENT_TOP;
  guiTitle.color = "white";
  guiTitle.top = "15px";
  guiTitle.fontSize = "36px";
  advancedTexture.addControl(guiTitle);

  guiDescription = new GUI.TextBlock();
  guiDescription.textVerticalAlignment = GUI.TextBlock.VERTICAL_ALIGNMENT_TOP;
  guiDescription.textWrapping = true;
  guiDescription.color = "#ddd";
  guiDescription.width = 0.5;
  guiDescription.top = "60px";
  guiDescription.fontSize = "18px";
  advancedTexture.addControl(guiDescription);

  return scene;
};

(async () => {
  const scene = await createScene();

  scene.onPointerUp = function (evt, pickResult) {
    if (pickResult.hit) {
      if (data[pickResult.pickedMesh?.name ?? ""]) {
        openInNewTab(data[pickResult.pickedMesh.name].link);
      }
    }
  };

  let prevPick;

  scene.onPointerMove = function (evt, pickResult) {
    const meshPicked = pickResult?.pickedMesh;
    if (prevPick !== meshPicked) {
      prevPick = meshPicked;
      if (meshPicked != null) {
        const paintingName = meshPicked.name;
        if (data.hasOwnProperty(paintingName)) {
          guiBG.isVisible = true;
          guiTitle.text = data[paintingName].title;
          guiDescription.text = data[paintingName].description;
        }
      } else {
        guiBG.isVisible = false;
        guiTitle.text = "";
        guiDescription.text = "";
      }
    }
  };

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
    scene.render();
  });

  // Watch for browser/canvas resize events
  window.addEventListener("resize", function () {
    engine.resize();
  });
})();
