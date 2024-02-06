async function smoothCameraTransition(camera, targetPosition, targetRadius, index, scene) {
    anime = true;
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
    var targetAnimation = new BABYLON.Animation(
        "targetAnimation",
        "target",
        100,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    var radiusAnimation = new BABYLON.Animation(
        "radiusAnimation",
        "radius",
        100,
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    var betaAnimation = new BABYLON.Animation(
        "betaAnimation",
        "beta",
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

    var targetKeys = [];
    targetKeys.push({
        frame: 0,
        value: camera.target // 현재 카메라 타겟
    });
    targetKeys.push({
        frame: 100,
        value: targetPosition // 목표 위치
    });
    console.log(camera.target)

    var radiusKeys = [];
    radiusKeys.push({
        frame: 0,
        value: camera.radius // 현재 카메라 radius
    });
    radiusKeys.push({
        frame: 100,
        value: targetRadius // 목표 radius
    });

    var betaKeys = [];
    betaKeys.push({
        frame: 0,
        value: camera.beta // 현재 카메라 beta 값
    });
    betaKeys.push({
        frame: 100,
        value: 0 // 목표 beta 값 (0으로 설정)
    });

    // 애니메이션에 프레임들 적용
    positionAnimation.setKeys(positionKeys);
    radiusAnimation.setKeys(radiusKeys);
    targetAnimation.setKeys(targetKeys);
    betaAnimation.setKeys(betaKeys);

    // 애니메이션에 이징 함수 적용
    positionAnimation.setEasingFunction(easingFunction);
    targetAnimation.setEasingFunction(easingFunction);
    radiusAnimation.setEasingFunction(easingFunction);
    betaAnimation.setEasingFunction(easingFunction);

    // 카메라에 애니메이션 적용
    camera.animations = [];
    camera.animations.push(targetAnimation);
    camera.animations.push(positionAnimation);
    camera.animations.push(radiusAnimation);
    //camera.animations.push(betaAnimation);

    // 애니메이션을 재생할 위치 설정
    const anim = scene.beginAnimation(camera, 0, 100, false, 1);
    await anim.waitAsync();
    track = index;
    anime = false;
    //camera.setTarget(targetPosition);
    camera.radius=targetRadius;
}