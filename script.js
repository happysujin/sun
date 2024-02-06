var track = 0;
var track_x =0, track_y=0, track_z=0;
var anime = false;

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
        this.circle.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                function (event) {
                    // 마우스가 원에 진입했을 때 색을 변경
                    this.circle.color = new BABYLON.Color3(0, 1, 0); // Green color
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

        this.moon.actionManager = new BABYLON.ActionManager(scene);
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
                function (event) {
                    // 마우스가 원에서 벗어났을 때 색을 원래대로 변경
                    this.circle.color = new BABYLON.Color3(1, 1, 1); // White color
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
        
        camera.beta = 0;//Math.PI / 2; // 90 degrees
        camera.setPosition(new BABYLON.Vector3(-50, 20, -50));
        camera.setTarget(BABYLON.Vector3.Zero());
        // // Create a sphere to represent the planet
        // var Sun = BABYLON.MeshBuilder.CreateSphere("Sun", { diameter: 2 }, scene);
        // Sun.position = new BABYLON.Vector3(0, 0, 0);  // Set the position to the left-bottom corner
        // Sun.actionManager = new BABYLON.ActionManager(scene);
        // Sun.actionManager.registerAction(
        //     new BABYLON.ExecuteCodeAction(
        //         BABYLON.ActionManager.OnPickTrigger,
        //         function (event) {
        //             // 클릭시 행성으로 카메라 이동
        //             smoothCameraTransition(camera, Sun.position, 2, scene);
        //         }.bind(this)
        //     )
        // );
        // Create a sphere to represent the moon
        // var planets_name = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
        // var planets = [];
        // for(var i = 0; i <= planets_name.length ; i++){
        //     planets.push(new Planet(planets_name[i],undefined,5+2*i,undefined,scene));
        // }
        // 행성의 정보를 담은 배열
        //var earthurl = "https://raw.githubusercontent.com/happysujin/image-hosting/main/earth.jpg";
        
        var planetInfo = [
            { name: "Sun", diameter: 2, radius: 0, angle: 0, orbitalPeriod: 1, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/sun.jpg" },
            { name: "Mercury", diameter: 0.5, radius: 5, angle: 0, orbitalPeriod: 88, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/mercury.jpg" }, // 공전 주기는 일 단위로 지정
            { name: "Venus", diameter: 0.8, radius: 7, angle: 0, orbitalPeriod: 225, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/venus.jpg" },
            { name: "Earth", diameter: 1, radius: 9, angle: 0, orbitalPeriod: 365, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/mars.jpg" },
            { name: "Mars", diameter: 0.7, radius: 11, angle: 0, orbitalPeriod: 687, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/earth.jpg" },
            { name: "Jupiter", diameter: 4, radius: 15, angle: 0, orbitalPeriod: 4333, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/jupiter.jpg" },
            { name: "Saturn", diameter: 3, radius: 20, angle: 0, orbitalPeriod: 10759, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/saturn.jpg" },
            { name: "Uranus", diameter: 2, radius: 25, angle: 0, orbitalPeriod: 30687, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/uranus.jpg" },
            { name: "Neptune", diameter: 2.5, radius: 30, angle: 0, orbitalPeriod: 60190, textureUrl: "https://raw.githubusercontent.com/happysujin/image-hosting/main/neptune.jpg" }
        ];

        var planets = [];

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
                var newPosition = planets[track].moon.position.clone();
                // newPosition.x = planets[track].moon.position.x + track_x;
                // newPosition.y = planets[track].moon.position.y + track_y;
                // newPosition.z = planets[track].moon.position.z + track_z;
                //var newPosition = planets[track].moon.position;
                newPosition.x += track_x;
                newPosition.y += track_y;
                newPosition.z += track_z;
                camera.setTarget(newPosition);
            }
            
            
            // Orbit the moon around the planet
            for(var i = 0; i < planets.length ; i++){
                var one = planets[i];
                one.moon.position.x = Math.cos(one.angle) * one.radius;
                one.moon.position.z = Math.sin(one.angle) * one.radius;
                one.angle += one.revolutionSpeed;

                // Rotate the moon around its own axis
                one.moon.rotation.y += 0.02;
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

        return scene;
    };

    var scene = createScene();

    engine.runRenderLoop(function () {
        scene.render();
    });

    // window.addEventListener('resize', function () {
    //     engine.resize();
    // });
    //moush wheel 
    // var isMouseWheelClicked = false;
    // var lastMousePosition = { x: 0, y: 0 };

    // canvas.addEventListener("mousedown", function (event) {
    //     if (event.button === 1) {
    //         isMouseWheelClicked = true;
    //         lastMousePosition = { x: event.clientX, y: event.clientY };
    //     }
    // });

    // canvas.addEventListener("mousemove", function (event) {
    //     // if (isMouseWheelClicked) {
    //     //     var deltaX = event.clientX - lastMousePosition.x;
    //     //     var deltaY = event.clientY - lastMousePosition.y;

    //     //     // 조절할 이동 거리 계수
    //     //     var moveFactor = 1;
    //     //     // 카메라 위치 조절
    //     //     camera.target=null;
    //     //     camera.position.x -= deltaX * moveFactor;
    //     //     camera.position.y += deltaY * moveFactor;
    //     //     camera.target.x -= deltaX * moveFactor;
    //     //     camera.target.y += deltaY * moveFactor;

    //     //     lastMousePosition = { x: event.clientX, y: event.clientY };
    //     // }
    // });

    // canvas.addEventListener("mouseup", function (event) {
    //     if (event.button === 1) {
    //         isMouseWheelClicked = false;
    //     }
    // });
});

