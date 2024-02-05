class Planet {
    constructor(name = "Unknown", diameter = 0.5, radius = 5, angle = 0, scene) {
        this.name = name;
        this.diameter = diameter;
        this.radius = radius;
        this.angle = angle;

        // Mesh 생성
        this.moon = BABYLON.MeshBuilder.CreateSphere(this.name, { diameter: this.diameter }, scene);
        this.moon.position = new BABYLON.Vector3(this.radius, 0, 0);

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
        this.circle = BABYLON.MeshBuilder.CreateLines("circle", { points: points, width:0.2  }, scene);
        this.circle.color = new BABYLON.Color3(1, 1, 1); // White color
        this.circle.alpha = 0.2;
    }
}

window.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('renderCanvas');
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);

        // Create a sphere to represent the planet
        var Sun = BABYLON.MeshBuilder.CreateSphere("Sun", { diameter: 2 }, scene);
        Sun.position = new BABYLON.Vector3(0, 0, 0);

        // Create a sphere to represent the moon
        var planets_name = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
        var planets = [];
        for(var i = 0; i <= planets_name.length ; i++){
            planets.push(new Planet(planets_name[i],undefined,5+2*i,undefined,scene));
        }

        // Create a light
        var light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 0, 0), scene);

        // Create a camera
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 4, 20, BABYLON.Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        
        camera.beta = 0;//Math.PI / 2; // 90 degrees

        // Set up the animation
        //var angle = 0;
        scene.registerBeforeRender(function () {
            // Rotate the planet around its own axis
            Sun.rotation.y += 0.01;
            
            // Orbit the moon around the planet
            for(var i = 0; i < planets.length ; i++){
                planets[i].moon.position.x = Math.cos(planets[i].angle) * planets[i].radius;
                planets[i].moon.position.z = Math.sin(planets[i].angle) * planets[i].radius;
                planets[i].angle += 0.02 - 0.005*i;

                // Rotate the moon around its own axis
                planets[i].moon.rotation.y += 0.02;
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

    window.addEventListener('resize', function () {
        engine.resize();
    });
});
