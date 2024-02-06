document.addEventListener('DOMContentLoaded', function () {
    var infoIcon = document.getElementById('infoIcon');
    var description = document.getElementById('description');
    description.style.display = 'none';
    description.style.opacity = 0;
    var intervalId;

    // 클릭 이벤트 핸들러 등록
    infoIcon.addEventListener('click', function () {
        var duration = 150; // 애니메이션 지속 시간(ms)
        var interval = 16; // 갱신 주기(ms)
        if(description.style.display === 'none'){
            var currentOpacity = 0;
            var targetOpacity = 1;
            description.style.display = 'block';
            clearInterval(intervalId);
            intervalId = setInterval(function () {
                currentOpacity += (interval / duration);
                description.style.opacity = currentOpacity;

                if (currentOpacity >= targetOpacity) {
                    clearInterval(intervalId);
                }
            }, interval);
        }
        else{
            clearInterval(intervalId);
            var currentOpacity = 1;
            var targetOpacity = 0;
            intervalId = setInterval(function () {
                currentOpacity -= (interval / duration);
                description.style.opacity = currentOpacity;

                if (currentOpacity <= targetOpacity) {
                    description.style.display = 'none';
                    clearInterval(intervalId);
                }
            }, interval);
        }
    });
});


function planetInfoRegister() {
    // h2 요소 내용 변경
    var one = planets[track];
    var h2Element = document.querySelector('#description h2');
    h2Element.textContent = one.name;

    // p 요소 내용 변경
    var pElement = document.querySelector('#description p');
    pElement.textContent = 'Diameter: ' + one.diameter + '\n';
}

