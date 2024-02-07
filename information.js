var planetInfoDescription = [
    { name: "Sun", diameter: 0, radius: 0, angle: 0, orbitalPeriod: 1},
    { name: "Mercury", diameter: 2439.70, radius: 0.39, angle: 0, orbitalPeriod: 88 }, // 공전 주기는 일 단위로 지정
    { name: "Venus", diameter: 6051.80, radius: 0.7, angle: 0, orbitalPeriod: 225 },
    { name: "Earth", diameter: 6378.14, radius: 1, angle: 0, orbitalPeriod: 365 },
    { name: "Mars", diameter: 3396.20, radius: 1.52, angle: 0, orbitalPeriod: 687 },
    { name: "Jupiter", diameter: 71492, radius: 5, angle: 0, orbitalPeriod: 4333 },
    { name: "Saturn", diameter: 60268, radius: 10, angle: 0, orbitalPeriod: 10759 },
    { name: "Uranus", diameter: 25559, radius: 20, angle: 0, orbitalPeriod: 30687 },
    { name: "Neptune", diameter: 24764, radius: 30, angle: 0, orbitalPeriod: 60190 }
];



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
    var one = planetInfoDescription[track];
    var h2Element = document.querySelector('#description h2');
    h2Element.textContent = one.name;

    // p 요소 내용 변경
    var pElement = document.querySelector('#description p');
    pElement.textContent = 'Diameter: ' + one.diameter + " (km) \r\n Radius: " + one.radius + ' (AU)\r\nOrbital Period: ' + one.orbitalPeriod + ' (day)';;
}
