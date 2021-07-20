/**
 * 异步组件
 * let ComA = asyncComponent(()=>import('XXX/XXX'));
 * <ComA/>
 *
 */
import React, { Component } from "react";

/**
 * 异步组件
 * @param {function} importComponent
 * @param {*} name
 * @returns
 * @example
 * const ComA = asyncComponent(()=>import('XXX/XXX'));
 * <ComA/>
 */
const asyncComponent = (importComponent, name) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
      };
      this.need = true;
    }

    // 在 componentDidMount 勾子中再执行渲染
    componentDidMount() {
      importComponent() //我们传进来的函数返回我们想要的组件 cmp
        .then((cmp) => {
          this.need &&
            //把组件 cmp 存到 state 中
            this.setState({ component: name ? cmp[name] : cmp.default });
        });
    }

    componentWillUnmount() {
      this.need = false;
    }

    render() {
      //渲染的时候再把组件 cmp 拿出来
      const Com = this.state.component;
      //返回的其实就是组件 cmp，并且把传给A的属性也转移到B上
      return Com ? <Com {...this.props} /> : null;
    }
  };
};

export default asyncComponent;
