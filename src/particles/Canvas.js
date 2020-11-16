import React from "react";
import RAFManager from "raf-manager";

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this._id = 0;
    this.size = { width: 0, height: 0 };
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      this.initCanvas();
      this.resize = this.resize.bind(this);
      window.addEventListener("resize", this.resize);
    }, 100);

    const canvas = this.canvasRef.current;
    this.props.onCanvasDidMount && this.props.onCanvasDidMount(canvas);
  }

  initCanvas() {
    const canvas = this.canvasRef.current;
    if (this.props.globalCompositeOperation) {
      const context = canvas.getContext("2d");
      context.globalCompositeOperation = this.props.globalCompositeOperation;
    }

    const { width, height } = this.setCanvasSize(canvas);
    this.heartbeatDetectionCanvasSize(canvas);
    this.props.onCanvasInited(canvas, width, height);
  }

  heartbeatDetectionCanvasSize(canvas) {
    this._id = setInterval(() => {
      if(this.canvasRef.current){
        const newHeight = this.canvasRef.current.clientHeight;
        if (newHeight !== this.size.height) {
          const { width, height } = this.setCanvasSize(canvas);
          this.props.onResize && this.props.onResize(width, height);
        }
      }
    }, 1000 / 10);
  }

  componentWillUnmount() {
    try{
      window.removeEventListener("resize", this.resize);
      clearInterval(this._id);
    }catch(e){

    }
  }

  resize() {
    const canvas = this.canvasRef.current;
    const { width, height } = this.setCanvasSize(canvas);
    this.props.onResize && this.props.onResize(width, height);
  }

  setCanvasSize(canvas) {
    const width = this.canvasRef.current.clientWidth;
    const height = this.canvasRef.current.clientHeight;

    this.size.width = width;
    this.size.height = height;
    canvas.width = width;
    canvas.height = height;
    return { width, height };
  }

  handleWaypointEnter() {
    RAFManager.start();
  }

  handleWaypointLeave() {
    RAFManager.stop();
  }

  getStyle() {
    let style = { width: "100%", height: "100%" };

    if (this.props.bg) {
      style = Object.assign(style, {
        position: "absolute",
        zIndex: -1,
        top: 0,
        left: 0
      });
    }
    return style;
  }

  handleMouseDown(e) {
    this.props.onMouseDown && this.props.onMouseDown(e);
  }

  render() {
    return (
      <canvas
        ref={this.canvasRef}
        onMouseDown={this.handleMouseDown.bind(this)}
        style={this.getStyle()}
      />
    );
  }
}
