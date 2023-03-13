class PopupIFrame {
            constructor() {
                const width = 500;
                const height = 400;

                const wrapper = document.createElement('div');
                wrapper.style.position = 'absolute';
                wrapper.style.width = `${width}px`;
                wrapper.style.height = `${height}px`;
                wrapper._width = width;
                wrapper._height = height;

                wrapper.style.left = `0px`;
                wrapper._left = 0;
                wrapper.style.bottom = `0px`;
                wrapper._bottom = 0;

                // wrapper.style.background = 'black';
                document.body.appendChild(wrapper);
                const iframe = document.createElement('iframe');
                // iframe.src = ;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                wrapper.appendChild(iframe);

                wrapper.style.display = 'none';
                wrapper._show = false;

                this._wrapper = wrapper;
                this._iframe = iframe;
            }

            setPosition(left, bottom) {
                const wrapper = this._wrapper;
                if (wrapper._left !== left || wrapper._bottom !== bottom) {
                    wrapper.style.left = `${left}px`;
                    wrapper._left = left;
                    wrapper.style.bottom = `${bottom}px`;
                    wrapper._bottom = bottom;
                }
            }

            set show(value) {
                const wrapper = this._wrapper;
                if (wrapper._show !== !!value) {
                    wrapper._show = !!value;
                    if (wrapper._show) {
                        wrapper.style.display = 'block';
                    } else {
                        wrapper.style.display = 'none';
                    }
                }
            }

            get show() {
                const wrapper = this._wrapper;
                return wrapper._show;
            }

            set uri(value) {
                const iframe = this._iframe;
                if (iframe.src !== value) {
                    iframe.src = value;
                }
            }

            get uri() {
                const iframe = this._iframe;
                return iframe.src;
            }

            set width(value) {
                const wrapper = this._wrapper;
                if (wrapper.width !== value) {
                    wrapper._width = value;
                    wrapper.style.width = `${width}px`;
                }
            }

            get width() {
                return this._wrapper._width;
            }

            set height(value) {
                const wrapper = this._wrapper;
                if (wrapper.height !== value) {
                    wrapper._height = value;
                    wrapper.style.height = `${height}px`;
                }
            }

            get height() {
                return this._wrapper._height;
            }

            destroy() {
                document.body.removeChild(this._wrapper);
                this._wrapper = undefined;
                this._iframe = undefined;
            }
        }