/**
 * 弹窗
 */
class Popup {
    /**
     * 初始化
     * @param {object} info - 参数对象
     * @param {object} info.globe - Globe
     * @param {string} info.geometry - 位置
     * @param {string} options.name - name
     * @param {object} [options.properties] - 属性
     * @param {string} [options.html] - html
     */
    constructor(info) {
        this.id = 0;
        //如果有div就移除
        if (document.getElementsByClassName("bx-popup-ctn").length > 0) {
            document.getElementsByClassName("bx-popup-ctn")[0].remove();
        }
        this.viewer = info.globe.viewer; //弹窗创建的viewer
        this.geometry = info.geometry; //弹窗挂载的位置
        this.id = "popup_" + this.id++;
        this.ctn = document.createElement("div");
        this.ctn.classList.add("bx-popup-ctn");
        this.ctn.id = this.id;
        this.viewer.container.append(this.ctn);
        this.properties=info.properties;
        if(info.properties) {
            //创建Html
            var content=this.createTable(info.properties);
            this.ctn.innerHTML = this.createHtml(info.name, content);
        }else {
            this.ctn.innerHTML = this.createHtml(info.name, info.html);
        }
        this.render(this.geometry);
        //添加监听拖动重新渲染位置
        this.eventListener = this.viewer.clock.onTick.addEventListener(clock => {
            this.render(this.geometry);
        });
        //绑定关闭事件
        document.getElementsByClassName(
            "leaflet-popup-close-button"
        )[0].onclick = () => {
            this.close();
        };
    }
    //渲染位置
    render(geometry) {
        if(geometry==null||geometry.x==null||geometry.y==null) return;
        var position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            this.viewer.scene,
            geometry
        );
        this.ctn.style.left = position.x - this.ctn.offsetWidth / 2 + "px";
        this.ctn.style.top = position.y - this.ctn.offsetHeight - 30 + "px";
    }
    createHtml(header, content) {
        var html =
            '<div class="bx-popup-header-ctn">' +
            header +
            '<span class="leaflet-popup-close-button" ><i class="el-icon-close"><button>X</button></i></span>' +
            "</div>" +
            '<div class="bx-popup-content-ctn" >' +
            '<div class="bx-popup-content" >' +
           content +
            "</div>" +
            "</div>" +
            '<div class="bx-popup-tip-container" >' +
            '<div class="bx-popup-tip" >' +
            "</div>" +
            "</div>";
        return html;
    }
    createTable(content) {
        let html = '<table class="table-popup">';
        for (let key in content) {
            if(key=='isVideo'||key=='callback'||key=='popup') continue;
            html += `<tr><td class="title-popup">${key}</td>
           <td class="value-popup">${content[key]}</td></tr>`;
        }
        html += "</table>";

        if(this.properties.isVideo){
            html="<video style='width: 300px;height: 180px;' autoplay loop crossorigin controls>" +
                "<source src='"+this.properties.url+"' type='video/mp4'>"+
                "</video>";
        }

        return html;
    }
    close() {
        this.ctn.remove();
        // this.viewer.clock.onTick.removeEventListener(this.eventListener);
        this.eventListener();
    }
}
export default Popup;