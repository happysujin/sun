function smoothCameraTransition(camera, targetPosition, targetRadius, scene, camera) {
    targetRadius += 5;
    var easingFunction = new BABYLON.QuadraticEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    // 새로운 애니메이션 생성
    var positionAnimation = new BABYLON.Animation(
        "positionAnimation",
        "position",
        100,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // 새로운 애니메이션 생성
    var radiusAnimation = new BABYLON.Animation(
        "radiusAnimation",
        "radius",
        100,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // 프레임들 정의
    var positionKeys = [];
    positionKeys.push({
        frame: 0,
        value: camera.position.clone() // 현재 카메라 위치
    });
    positionKeys.push({
        frame: 100,
        value: targetPosition.clone() // 목표 위치
    });

    var radiusKeys = [];
    radiusKeys.push({
        frame: 0,
        value: camera.radius // 현재 카메라 radius
    });
    radiusKeys.push({
        frame: 100,
        value: targetRadius // 목표 radius
    });

    // 애니메이션에 프레임들 적용
    positionAnimation.setKeys(positionKeys);
    radiusAnimation.setKeys(radiusKeys);

    // 애니메이션에 이징 함수 적용
    positionAnimation.setEasingFunction(easingFunction);
    radiusAnimation.setEasingFunction(easingFunction);

    // 카메라에 애니메이션 적용
    camera.animations = [];
    camera.animations.push(positionAnimation);
    camera.animations.push(radiusAnimation);

    // 애니메이션을 재생할 위치 설정
    scene.beginAnimation(camera, 0, 100, false, 1);

    camera.setTarget(targetPosition);
    camera.radius = targetRadius;
}


