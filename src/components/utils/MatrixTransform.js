// function matrixTransform(options) {
//     if (!options) {
//         options = {};
//     }
//     let tx = options.tx || 116.315984;
//     let ty = options.ty || 39.959576;
//     let tz = options.tz || 0;
//     let rx = options.rx || 0;
//     let ry = options.ry || 0;
//     let rz = options.rz || 0;
//     let scale = options.scale || 1;

//     let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(rx));
//     let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(ry));
//     let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(rz));
//     let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
//     let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
//     let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
//     //平移
//     let position = Cesium.Cartesian3.fromDegrees(tx, ty, tz);
//     let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);

//     let scaleParam = Cesium.Matrix4.fromUniformScale(scale);
//     //缩放
//     Cesium.Matrix4.multiply(m, scaleParam, m);
//     //旋转、平移矩阵相乘
//     Cesium.Matrix4.multiply(m, rotationX, m);
//     Cesium.Matrix4.multiply(m, rotationY, m);
//     Cesium.Matrix4.multiply(m, rotationZ, m);
//     //赋值给<tileset></tileset>
//     return m;
// }
// export { matrixTransform };

class MatrixTransform {
    constructor(options) {
        if (!options) {
            options = {};
        }
        this.tx = options.tx || 116.315984;
        this.ty = options.ty || 39.959576;
        this.tz = options.tz || 0;
        this.rx = options.rx || 0;
        this.ry = options.ry || 0;
        this.rz = options.rz || 0;
        this.scale = options.scale || 1;
    }
    tilesTransform() {
        let mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(this.rx));
        let my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(this.ry));
        let mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(this.rz));
        let rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
        let rotationY = Cesium.Matrix4.fromRotationTranslation(my);
        let rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
        //平移
        let position = Cesium.Cartesian3.fromDegrees(this.tx, this.ty, this.tz);
        let m = Cesium.Transforms.eastNorthUpToFixedFrame(position);

        let scale = Cesium.Matrix4.fromUniformScale(this.scale);
        //缩放   
        Cesium.Matrix4.multiply(m, scale, m);
        //旋转、平移矩阵相乘
        Cesium.Matrix4.multiply(m, rotationX, m);
        Cesium.Matrix4.multiply(m, rotationY, m);
        Cesium.Matrix4.multiply(m, rotationZ, m);
        //赋值给tileset
        return m;
    }
}
export default MatrixTransform;