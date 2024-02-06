var track = 0;
var track_x =0, track_y=0, track_z=0;
var anime = false;
var planets = [];
var wheel_alpha = 0, wheel_beta = 0, wheel_radius = 5;
var fixed = false;
var fix_radius = 10;

var wheel_vector = new BABYLON.Vector3(0, 0, 0);
class Planet {
    constructor(index, name = "Unknown", diameter = 0.5, radius = 5, angle = 0, orbitalPeriod = 365, textureUrl, scene, camera) {
        this.name = name;
        this.diameter = diameter;
        this.radius = radius;
        this.angle = angle;
        this.textureUrl = textureUrl;
        this.index = index;

        // 공전 주기에 반비례한 공전 속도 계산
        this.revolutionSpeed = (2 * Math.PI) / orbitalPeriod;

        // Mesh 생성
        this.moon = BABYLON.MeshBuilder.CreateSphere(this.name, { diameter: this.diameter }, scene);
        this.moon.position = new BABYLON.Vector3(this.radius, 0, 0);

        // 텍스처 로드 및 할당
        var texture = new BABYLON.Texture(this.textureUrl, scene);
        var material = new BABYLON.StandardMaterial(name + "Material", scene);
        material.diffuseTexture = texture;
        this.moon.material = material;

        // Create a set of points to represent a circle
        var points = [];
        var segments = 100; // Number of segments in the circle
        for (var i = 0; i <= segments; i++) {
            var theta = (i / segments) * Math.PI * 2;
            var x = Math.cos(theta) * radius;
            var z = Math.sin(theta) * radius;
            points.push(new BABYLON.Vector3(x, 0, z));
        }

        // Create lines using the set of points
        this.circle = BABYLON.MeshBuilder.CreateLines("circle", { points: points, width: 0.2 }, scene);
        this.circle.color = new BABYLON.Color3(1, 1, 1); // White color
        this.circle.alpha = 0.2;

        // 마우스 진입 이벤트 핸들러 등록
        this.circle.actionManager = new BABYLON.ActionManager(scene);
        this.moon.actionManager = new BABYLON.ActionManager(scene);
        this.circle.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                function (event) {
                    // 마우스가 원에 진입했을 때 색을 변경
                    this.circle.color = new BABYLON.Color3(0, 1, 0); // Green color
                    //툴팁 표시
                    mouseIn(this.name);
                }.bind(this)
            )
        );
        this.moon.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                function (event) {
                    //툴팁 표시
                    mouseIn(this.name);
                }.bind(this)
            )
        );

        // 마우스 클릭 이벤트 핸들러 등록
        this.circle.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                function (event) {
                    // 클릭시 행성으로 카메라 이동
                    smoothCameraTransition(camera, this.moon.position, this.diameter, this.index, scene);
                }.bind(this)
            )
        );
        this.moon.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                function (event) {
                    // 클릭시 행성으로 카메라 이동
                    smoothCameraTransition(camera, this.moon.position, this.diameter, this.index, scene);
                }.bind(this)
            )
        );
            
        // 마우스 이탈 이벤트 핸들러 등록
        this.circle.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                async function (event) {
                    // 마우스가 원에서 벗어났을 때 색을 원래대로 변경
                    this.circle.color = new BABYLON.Color3(1, 1, 1); // White color
                    mouseOut();
                }.bind(this)
            )
        );
        this.moon.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                async function (event) {
                    mouseOut();
                }.bind(this)
            )
        );
    }
}

window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);

    
        

        // Create a light
        var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 0, 0), scene);

        // Create a camera
        camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 20, BABYLON.Vector3(-50, 20, -50), scene);
        camera.attachControl(canvas, true);
        
        var planetInfo = [
            { name: "Sun", diameter: 2, radius: 0, angle: 0, orbitalPeriod: 1, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/sun.jpg" },
            { name: "Mercury", diameter: 0.5, radius: 5, angle: 0, orbitalPeriod: 88, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/mercury.jpg" }, // 공전 주기는 일 단위로 지정
            { name: "Venus", diameter: 0.8, radius: 7, angle: 0, orbitalPeriod: 225, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/venus.jpg" },
            { name: "Earth", diameter: 1, radius: 9, angle: 0, orbitalPeriod: 365, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/earth.jpg" },
            { name: "Mars", diameter: 0.7, radius: 11, angle: 0, orbitalPeriod: 687, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/mars.jpg" },
            { name: "Jupiter", diameter: 4, radius: 15, angle: 0, orbitalPeriod: 4333, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/jupiter.jpg" },
            { name: "Saturn", diameter: 3, radius: 20, angle: 0, orbitalPeriod: 10759, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/saturn.jpg" },
            { name: "Uranus", diameter: 2, radius: 25, angle: 0, orbitalPeriod: 30687, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/uranus.jpg" },
            { name: "Neptune", diameter: 2.5, radius: 30, angle: 0, orbitalPeriod: 60190, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/neptune.jpg" }
        ];


        // 각 행성의 정보를 사용하여 Planet 객체를 생성하고 배열에 추가
        for (var i = 0; i < planetInfo.length; i++) {
            var info = planetInfo[i];
            planets.push(new Planet(i, info.name, info.diameter, info.radius, info.angle, info.orbitalPeriod, info.textureUrl, scene, camera));
        }
        // Set up the animation
        //var angle = 0;
        scene.registerBeforeRender(function () {
            // Rotate the planet around its own axis
            //Sun.rotation.y += 0.01;
            if(!anime){
                //else{
                    var newPosition = planets[track].moon.position.clone();
                    newPosition.x += track_x;
                    newPosition.y += track_y;
                    newPosition.z += track_z;
                    camera.setTarget(newPosition);
                //}
                if(isMouseWheelClicked){
                    console.log("in rendringa");
                    // 카메라의 위치 계산
                    var x =  (wheel_radius * Math.sin(wheel_alpha) * Math.cos(wheel_beta));
                    var y =  ( wheel_radius * Math.sin(wheel_beta) * Math.sin(wheel_alpha));
                    var z =  ( wheel_radius * Math.cos(wheel_beta) );

                    // Vector3 객체 생성
                    var cameraPosition = new BABYLON.Vector3(x, y, z);
                    //camera.position = cameraPosition;
                    camera.position = newPosition.add(wheel_vector);
                }
                else if(fixed){
                    const distance = fix_radius - camera.radius;
                    camera.radius += distance * 0.1;
                    //camera.radius = fix_radius;
                }
                
            }
            
            
            if(!pause){
                // Orbit the moon around the planet
                for(var i = 0; i < planets.length ; i++){
                    var one = planets[i];
                    one.moon.position.x = Math.cos(one.angle) * one.radius;
                    one.moon.position.z = Math.sin(one.angle) * one.radius;
                    one.angle += one.revolutionSpeed;

                    // Rotate the moon around its own axis
                    one.moon.rotation.y += 0.02;
                }
            }
        });

        // // Create a set of points to represent a circle
        // var points = [];
        // var segments = 100; // Number of segments in the circle
        // for (var i = 0; i <= segments; i++) {
        //     var theta = (i / segments) * Math.PI * 2;
        //     var x = Math.cos(theta) * 5;
        //     var z = Math.sin(theta) * 5;
        //     points.push(new BABYLON.Vector3(x, 0, z));
        // }

        // // Create lines using the set of points
        // var circle = BABYLON.MeshBuilder.CreateLines("circle", { points: points, width:0.2  }, scene);
        // circle.color = new BABYLON.Color3(1, 1, 1); // White color
        // circle.alpha = 0.2;
        planetInfoRegister();
        return scene;
    };

    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });


    //moush wheel 
    var isMouseWheelClicked = false;
    var lastMousePosition = { x: 0, y: 0 };

    canvas.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        if (event.button === 1) {
            
            console.log('마우스 휠 버튼이 클릭되었습니다.');
            wheel_alpha = camera.alpha;
            wheel_beta = camera.beta;
            wheel_radius = camera.radius;
            var temp = camera.position.clone();
            var tempTarget = camera.target.clone();
            wheel_vector.x = temp.x -tempTarget.x;
            wheel_vector.y = temp.y -tempTarget.y;
            wheel_vector.z = temp.z -tempTarget.z;
            isMouseWheelClicked = true;
            lastMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    canvas.addEventListener("pointermove", function (event) {
        event.preventDefault();
        
        if (isMouseWheelClicked) {
            //console.log('마우스 휠 버튼이 @@@@@@@@@@@');
            event.preventDefault();
            var deltaX = event.clientX - lastMousePosition.x;
            var deltaY = event.clientY - lastMousePosition.y;

            // 조절할 이동 거리 계수
            var moveFactor = 0.05;
            
            var cameraDirection = camera.getDirection(new BABYLON.Vector3(0, 0, 1));

            // 현재 카메라의 수직 방향 벡터를 계산
            var cameraUpVector = camera.upVector;
            var cameraRightVector = BABYLON.Vector3.Cross(cameraDirection, cameraUpVector);

            //위치 이동량 계산
            track_x += (deltaX * cameraRightVector.x + deltaY * cameraUpVector.x) * moveFactor;
            track_y += (deltaX * cameraRightVector.y + deltaY * cameraUpVector.y) * moveFactor;
            track_z += (deltaX * cameraRightVector.z + deltaY * cameraUpVector.z) * moveFactor;

            lastMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    canvas.addEventListener("pointerup", function (event) {
        event.preventDefault();
        if (event.button === 1) {
            event.preventDefault();
            //console.log('마우스 휠 버튼이 데젹먼ㅇ마ㅣ엄ㄴ릭되었습니다.');
            isMouseWheelClicked = false;
            
            // console.log(wheel_alpha);
            // console.log(wheel_beta);
            // console.log(wheel_radius);
        }
    });


    const animationSpeed = 0.02; // 애니메이션 속도
    // 휠 이벤트 처리 함수 등록
    scene.onPointerObservable.add((kbInfo) => {
        if (kbInfo.type == 8) //scroll
        {
                // 휠의 방향에 따라 줌 값을 조정
                var zoomSpeed = 0.1; // 조정할 줌 속도
                fix_radius += kbInfo.event.deltaY * zoomSpeed;
                // 카메라의 radius를 음수로 하면 카메라가 아래를 향합니다.
                // 필요에 따라 조정하십시오.
                //if (camera.radius < 0) {
                //    camera.radius = 0;
                //}
        }
    });


});

document.addEventListener('keydown', function(event) {
    // Tab 키가 눌렸을 때
    if (event.key === " ") {
      // 원하는 함수 호출
      fix_radius = camera.radius;
      fixed = !fixed;
    }
  });

