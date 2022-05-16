import './style.css'
import * as THREE from 'three';
import * as dat from 'dat.gui'

//マウスの動きで角度をつけることができる
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// scene, camera, renderer の三つのオブジェクトが必要


// まずはシーンを作る
// シーンはこれから作る3Dの世界。ただし、この段階ではシーンの内容は空の状態
const scene = new THREE.Scene();

// カメラを作る
// カメラに写った内容が最終的にブラウザー上で表示されることになる
// 4つの引数が必要。これらは、カメラが写す範囲を示す。
// fovは画角を示す
// aspectは撮影結果の縦横比を示す。
// nearはニアークリップの距離を示す。nearより近い領域は表示されない。
// farはファークリップの距離を示しす。farより遠い領域は表示されない。
// window.innerWidth   コンテンツ表示領域の幅
// window.innerHeight  コンテンツ表示領域の高さ
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)


// レンダラーをDOM上に設置する
// レンダラーをDOMに設置しHTMLと紐づける。
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})
// setPixelRatio ( value : number )
// Sets device pixel ratio

// window.devicePixelRatio
// windows.devicePixelRatio プロパティを参照すると、 Web ページを表示しているディスプレイのデバイスピクセル比を参照することができる
renderer.setPixelRatio(window.devicePixelRatio);

// setSize
// Resizes the output canvas to (width, height) with device pixel ratio taken into account, 
// and also sets the viewport to fit that size, starting in (0, 0). 
// Setting updateStyle to false prevents any style changes to the output canvas.
renderer.setSize(window.innerWidth, window.innerHeight);


//positionはx、y、zの3つのプロパティーを持っており。初期ではx、y、zの値は全て0。setメソッドの引数はx, y, zの3つを順に渡す。
//以下では、カメラはzの正方向、つまり手前に30の位置に設置される
camera.position.setZ(30);

// sceneとcameraをアーギュメントとして渡す
renderer.render(scene, camera);

//ジオメトリー(3Dの物体その物)を追加する
//様々なジオメトリーがthree.jsに用意されている
const geometry = new THREE.TorusBufferGeometry(10, 3, 16, 100)

//色等必要なオプションを付け足す
//wireframeは3Dモデルを竹ひご細工のような線形状のみで表現すること
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });

//メッシュの作成
//ジオメトリとマテリアルを統合
const torus = new THREE.Mesh(geometry, material);

//メッシュをシーンに統合
scene.add(torus)

//GUIでの操作を加える
// const gui = new dat.GUI()

// gui.add(torus.rotation, 'x')
// gui.add(torus.rotation, 'y')
// gui.add(torus.rotation, 'z')

const pointLight = new THREE.PointLight(0xffff)
pointLight.position.set(5, 5, 5)

//AmbientLightはシーン全体にライトをあてる
const ambientLight = new THREE.AmbientLight(0xffff)
scene.add(pointLight, ambientLight)

//lighthelperはどこにライトがあるかわかるようにする
const lightHelper = new THREE.PointLightHelper(pointLight)

//格子の模様をつけて見やすくする
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper)

//マウスの動きで角度をつけることができる
const controls = new OrbitControls(camera, renderer.domElement);

const moonTexture = new THREE.TextureLoader().load('images/theEarth.jpg')

const moon = new THREE.Mesh(
  new THREE.SphereBufferGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture
  })
)

moon.position.z = 30;
moon.position.setX(-10);

scene.add(moon)

function addStar() {
  const geometry = new THREE.SphereBufferGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xFFF });
  const star = new THREE.Mesh(geometry, material);

  // Array(3)とすると、空の値が3つ入った配列が作成、それにfill()メソッドで数字を入れることができる。
  // map()は各要素1つずつに対して「コールバック関数」を実行し、その結果を新しい配列として返すことが出来る
  // MathUtils - An object with several math utility functions.
  // randFloatSpread ( range : Float )  - Random float in the interval
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300));
  star.position.set(x, y, z);
  scene.add(star);
}

//配列に含まれる要素を順に取り出しコールバック関数へ渡して処理を行うことができる
Array(600).fill().forEach(addStar)

//バックグラウンドの写真を選択
const spaceTexture = new THREE.TextureLoader().load('images/space1.jpg');
scene.background = spaceTexture;




function animate() {
  //渡した関数をブラウザの表示を邪魔しないタイミングで処理されるようにする関数
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  //uiにOrbitControlsを反映させる
  controls.update

  renderer.render(scene, camera);
}

function moveCamera() {
  // トップからviewポートがどれだけはなれているか
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05
  moon.rotation.y += 0.075
  moon.rotation.z += 0.05

  camera.rotation.z = t * -0.00001
  camera.rotation.x = t * -0.0001
  camera.rotation.y = t * -0.0003
}

// スクロールのたびにmoveCameraが実行される
document.body.onscroll = moveCamera



animate()
addStar()




