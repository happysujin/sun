// Vector3의 subtract 함수 추가
BABYLON.Vector3.prototype.subtract = function (otherVector) {
    return new BABYLON.Vector3(
        this.x - otherVector.x,
        this.y - otherVector.y,
        this.z - otherVector.z
    );
};

function calculateDistance(vectorA, vectorB) {
    const dx = vectorB.x - vectorA.x;
    const dy = vectorB.y - vectorA.y;
    const dz = vectorB.z - vectorA.z;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return distance;
}

function cartesianToSpherical(center, point) {
    const cartesianCoordinates = point.subtract(center);
    var radius = cartesianCoordinates.length();

    if(radius === 0) return {radius: 0, alpha: 0, beta: 0};

    // 방위각 계산
    var alpha = Math.atan2(cartesianCoordinates.y, cartesianCoordinates.x) ;

    // 고도각 계산
    var beta = Math.acos(cartesianCoordinates.z / radius) ;

    return { radius: radius, alpha: alpha, beta: beta };
}