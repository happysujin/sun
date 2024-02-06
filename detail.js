let inouting = false;
let intrp = false;
function mouseIn(name){
    // 툴팁 표시
    var tooltip = document.getElementById('tooltip');
    tooltip.textContent = name;

    // 투명도를 1로 설정하고 페이드 인 효과 적용
    fadeIn(tooltip);
}

function mouseOut(){
    var tooltip = document.getElementById('tooltip');
    // 투명도를 0으로 설정하고 페이드 아웃 효과 적용
    fadeOut(tooltip);
}

// 페이드 인 함수
function fadeIn(element) {
    inouting = true;
    element.style.opacity = 0;  // 초기 투명도를 0으로 설정
    element.style.display = 'block';  // 표시 상태로 변경

    // 0에서 1까지 투명도를 증가시키는 애니메이션
    var opacity = 0;
    var fadeInInterval = setInterval(function () {
        if (opacity < 1 && !intrp) {
            opacity += 0.1;  // 조절 가능한 값
            element.style.opacity = opacity;
        } else {
            clearInterval(fadeInInterval);
            element.style.display = 'block';
            inouting = false;
        }
    }, 10);  // 갱신 주기 (ms)
}

// 페이드 아웃 함수
function fadeOut(element) {
    inouting = true;
    // 1에서 0까지 투명도를 감소시키는 애니메이션
    var opacity = 1;
    var fadeOutInterval = setInterval(function () {
        if (opacity > 0 && !intrp) {
            opacity -= 0.1;  // 조절 가능한 값
            element.style.opacity = opacity;
        } else {
            clearInterval(fadeOutInterval);
            element.style.display = 'none';  // 숨김 상태로 변경
            inouting = false;
        }
    }, 10);  // 갱신 주기 (ms)
}

async function smoothCameraTransition(camera, targetPosition, targetRadius, index, scene) {
    anime = true;
    targetRadius = (targetRadius+1)*2;
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
        frame: 80,
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
        value:  Math.PI / 2 // 목표 beta 값 (0으로 설정)
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
    //camera.animations.push(positionAnimation);
    camera.animations.push(radiusAnimation);
    camera.animations.push(betaAnimation);

    // 애니메이션을 재생할 위치 설정
    const anim = scene.beginAnimation(camera, 0, 100, false, 1);
    await anim.waitAsync();
    track = index;
    anime = false;
    planetInfoRegister();
    //camera.setTarget(targetPosition);
    camera.radius=targetRadius;
}


var pause = false;
// 버튼 엘리먼트를 가져옵니다.
var playPauseButton = document.getElementById('playPauseIcon');

// 클릭 이벤트를 추가합니다.
playPauseButton.addEventListener('click', function() {
    // 현재 버튼의 텍스트를 확인하여 상태를 판단합니다.
    if (playPauseButton.textContent === '▶') {
        // 재생 중인 상태이므로 버튼을 일시정지로 변경합니다.
        playPauseButton.textContent = '❚❚';
        playPauseButton.classList.remove('play');
        playPauseButton.classList.add('pause');
        // 여기에 재생 중인 상태에 대한 동작을 추가하세요.
        pause = false;
        console.log('Playing...');
    } else {
        // 일시정지 중인 상태이므로 버튼을 재생으로 변경합니다.
        playPauseButton.textContent = '▶';
        playPauseButton.classList.remove('pause');
        playPauseButton.classList.add('play');
        // 여기에 일시정지 중인 상태에 대한 동작을 추가하세요.
        pause = true;
        console.log('Paused.');
    }
});

// 마우스 이동 이벤트 리스너 등록
document.addEventListener('mousemove', function(event) {
    // 마우스 이동할 때 툴팁의 위치를 마우스 위치로 설정
    var tooltip = document.getElementById('tooltip');
    var x = event.clientX ; // 마우스 오른쪽으로 10px 이동
    var y = event.clientY - 30; // 마우스 아래쪽으로 10px 이동

    // 툴팁 위치 업데이트
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
});

////delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForValueOne(value) {

    while (value !== 1) {
        await delay(50); // 1초 기다림
        console.log("아직 1이 아님");
        // 여기에서 value 값을 업데이트하거나 외부에서 업데이트되는 조건을 확인합니다.
    }

    console.log("1이 되었습니다!");
}

// 함수 호출