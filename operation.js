// Vector3의 subtract 함수 추가
BABYLON.Vector3.prototype.subtract = function (otherVector) {
    return new BABYLON.Vector3(
        this.x - otherVector.x,
        this.y - otherVector.y,
        this.z - otherVector.z
    );
};