/**
 * Modal组件实现
 */
import {
    Widget
} from "../component.js";
import React from 'react';
import WidgetEx from './WidgetEx.js';
import Popup from './Popup.js';
import Dialog from './Dialog.js';
import Mask from './Mask.js';
import './index.css';

// 模式对话框组件
class Modal extends WidgetEx {
  static PaneType = {
    Popup : Symbol(),
    Dialog : Symbol(),
  };
  // static defaultProps = { ...Object.getPrototypeOf(Modal).defaultProps,
  //   classModalOuter : 'ui-modal-outer',
  //   isVisibleInitial : true,
  //   paneType : Modal.PaneType.Dialog,
  //   onBeforeMount : ()=>{},
  //   onAfterMount : ()=>{},
  //   onBeforeDestroy : ()=>{},
  //   // version: '2015.12.10',
  // };
  static defaultProps = {
    prefixCls: 'ui-modal',
    title: 'Modal对话框',
    width: undefined,
    height: undefined,
    visible: true,
    paneType: Modal.PaneType.Dialog,
    onClickClose: ()=>{},
    onClickSubmit: ()=>{},
    onBeforeMount : ()=>{},
    onAfterMount : ()=>{},
    onBeforeDestroy : ()=>{},
  };
  constructor(props) {
    super(props);
    const zComHelper = Modal.getZComHelper();
    this.state = {
      // bIsVisible: Modal.defaultProps.isVisibleInitial,
      windowWidth: zComHelper.getWindowWidth(),
      windowHeight: zComHelper.getWindowHeight(),
    };
    this.eventHandlerResize = this.handleResize.bind(this);
  }
  componentWillMount() {
    super.componentWillMount();
    if(!this.props.isMaintainedRender)
      if(this.props.onBeforeMount) this.props.onBeforeMount(this);
  }
  componentDidMount() {
    super.componentDidMount();
    if(!this.props.isMaintainedRender) {
      window.addEventListener ? window.addEventListener('resize', this.eventHandlerResize)
      : $(window).on('resize', this.eventHandlerResize);
      if(this.props.onAfterMount) this.props.onAfterMount(this);
    }
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    this.setVisibility(nextProps.isVisibleInitial);
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if(!this.props.isMaintainedRender){
      window.removeEventListener ? window.removeEventListener('resize', this.eventHandlerResize)
      : $(window).off('resize', this.eventHandlerResize);
      if(this.props.onBeforeDestroy) this.props.onBeforeDestroy(this);
    }
    // 清除本组件实例所提供的遮罩存放容器
    const _this = this.getInstanceForRender();
    Mask.getStaticInstance().mapOutContainer(_this);
  }
  // 设定本组件实例是否可见
  setVisibility(bIsVisible, forceBuddyUpdate=true) {
    const _this = this.getInstanceForRender();
    _this && _this.setState({bIsVisible:bIsVisible}, ()=>{
      if(forceBuddyUpdate) { // 强制遮罩层重新渲染
        const myStaticMask = Mask.getStaticInstance();
        if(_this.refs.MaskReservedContainer)
          myStaticMask.mapInContainer(_this);
        else 
          myStaticMask.mapOutContainer(_this);
      }
    });
  }
  // 获取本组件实例是否可见
  getVisibility() {
    const _this = this.getInstanceForRender();
    return _this.props.visible;
    // return _this.state.bIsVisible;
  }
  handleClose() {
    this.props.onClickClose();
  }
  handleResize() {
    console.log(123);return;
    const zComHelper = Modal.getZComHelper();
    this.setState({
      windowWidth: zComHelper.getWindowWidth(),
      windowHeight: zComHelper.getWindowHeight(),
    });
  }
  jsxElementToRender() {
    let resVDOM = null;
    let styleTmpl = {};
    if(this.props.width) {
      styleTmpl.left = (this.state.windowWidth-this.props.width)/2;
      styleTmpl.width = this.props.width;
    }
    if(this.props.height) {
      styleTmpl.top = (this.state.windowHeight-this.props.height)/2;
      styleTmpl.height = this.props.height;
    }

    const {prefixCls, width, height, visible, paneType, onClickClose, onClickSubmit, onBeforeMount, onAfterMount, onBeforeDestroy, ...otherProps} = this.props;
    let jsxPane = null;
    switch(this.props.paneType) {
      case Modal.PaneType.Popup:
        jsxPane = (<Popup {...otherProps} styleTmpl={styleTmpl} onClickClose={this.props.onClickClose} onClickSubmit={this.props.onClickSubmit} />);
        break;
      case Modal.PaneType.Dialog:
        jsxPane = (<Dialog {...otherProps} styleTmpl={styleTmpl} onClickClose={this.props.onClickClose} onClickSubmit={this.props.onClickSubmit} />);
        break;
      default: break;
    }
    if(this.getVisibility()) {
      resVDOM = (<div name="RCZModal" className={'ui-modal'/*'ui-modal-outer'*/}>
        <div ref="MaskReservedContainer"></div>
        {jsxPane}
      </div>)
    }
    return resVDOM;
  }
}

export default Modal;

