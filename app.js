
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);


const marsGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
scene.add(marsMesh);


const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 5000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 1 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);


function createShootingStar() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [0, 0, 0, 0, 0, 0];
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
    const shootingStar = new THREE.Line(geometry, material);

    shootingStar.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );

    shootingStar.direction = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
    );

    scene.add(shootingStar);

    return {
        star: shootingStar,
        direction: shootingStar.direction
    };
}


const shootingStars = [];
for (let i = 0; i < 5; i++) {
    shootingStars.push(createShootingStar());
}



const light = new THREE.PointLight(0xFFFFFF, 1);
light.position.set(0, 1, 1);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const webgl = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer();
renderer.setSize(webgl.clientWidth, window.innerHeight);
webgl.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);

    for (let i = 0; i < shootingStars.length; i++) {
        shootingStars[i].star.geometry.attributes.position.array[3] = shootingStars[i].star.position.x;
        shootingStars[i].star.geometry.attributes.position.array[4] = shootingStars[i].star.position.y;
        shootingStars[i].star.geometry.attributes.position.array[5] = shootingStars[i].star.position.z;
    
        shootingStars[i].star.position.add(shootingStars[i].direction);
        
        shootingStars[i].star.geometry.attributes.position.needsUpdate = true;
    
        if (shootingStars[i].star.position.length() > 10) {
            scene.remove(shootingStars[i].star);
            shootingStars[i] = createShootingStar();
        }
    }
    

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    const newWidth = webgl.clientWidth;
    const newHeight = window.innerHeight;
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(newWidth, newHeight);
});



document.addEventListener("DOMContentLoaded", function() {
    const letters = document.querySelectorAll('.word span');

    const shuffledLetters = [...letters].sort(() => Math.random() - 0.5);

    let cumulativeDelay = 0;

    shuffledLetters.forEach((letter, index) => {
        cumulativeDelay += (Math.random() * 1000) + 1500;

        setTimeout(() => {
            letter.classList.add('animate');
        }, cumulativeDelay);
    });
});



let audioCtx;
let filter;
let source;
let isWebAudioSupported = true;

$(document).ready(function() {




const song = document.getElementById("song");

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 22050;
        filter.connect(audioCtx.destination);
    }
}


$(".enter").click(function(){
    $("#playButton").hide()
    $("#pauseButton").show()

    initAudioContext();

    if (song.paused) {
        song.play().then(() => {
            if (isWebAudioSupported && !source) {
                source = audioCtx.createMediaElementSource(song);
                source.connect(filter);
            }
        }).catch((error) => {
            console.error("Playback error:", error);
            isWebAudioSupported = false;
        });
    }

    $("html, body").removeClass('no-scroll')
    $(".start").addClass('hide-start')

    $("html, body").scrollTo(0)

    setTimeout(function(){
        $(".start").addClass('display-none')
    }, 2000)

    const newWidth = webgl.clientWidth;
    const newHeight = window.innerHeight;
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(newWidth, newHeight);
})


$("#playButton").click(function() {
    $("#playButton").hide()
    $("#pauseButton").show()

    initAudioContext();

    if (song.paused) {
        song.play().then(() => {
            if (isWebAudioSupported && !source) {
                source = audioCtx.createMediaElementSource(song);
                source.connect(filter);
            }
        }).catch((error) => {
            console.error("Playback error:", error);
            isWebAudioSupported = false;
        });
    }
});

$("#pauseButton").click(function() {
    song.pause();
    $("#playButton").show()
    $("#pauseButton").hide()
});
})