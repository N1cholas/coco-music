[TOC]

# coco-music项目描述

## 项目配置

- 采用`vue`脚手架搭建
  - 添加路径别名
  - 使用`stylus`为`css`预处理器
- 项目依赖
  - `babel-runtime babel-polyfill`实现es6函数向下兼容
  - `fastclick`解决300ms延迟问题
  - `better-scroll`解决移动端常见滚动业务场景
  - `jsonp`跨域获取数据

## src目录

- `api`封装接口，接口配置
- `components`组件
- `base`通用组件
- `common`通用资源
  - `js`通用工具
  - `image`图片
  - `font`字体文件
  - `stylus`样式文件
    - `index.styl`引用`reset.styl base.styl icon.styl`文件
    - `reset.styl`重置样式
    - `base.styl`基础样式
    - `icon.styl`图标样式
    - `variable.styl`样式变量
    - `mixin.styl`样式函数
- `router`路由
- `store`状态管理

## 骨架页面

### header组件

- 顶部栏，展示LOGO、标识语和用户图标


### tab组件

- 切换栏，包括四个`tab`页，推荐、歌手、排行、搜索

## 推荐页面

- 包含`header tab`组件，轮播图组件和歌单列表
- 组件销毁清除内存资源

### jsonp获取slider轮播数据

- 使用[jsonp](https://github.com/webmodules/jsonp)为基础库
- 包装[jsonp](https://github.com/webmodules/jsonp)为`Promise`，合并请求参数为一个对象，将请求参数拼接到`url`上

`jsonp(url, opts, fn)`库的使用

- `url` (`String`) url to fetch
- `opts` (`Object`), optional
  - `param` (`String`) name of the query string parameter to specify the callback (defaults to `callback`)
  - `timeout` (`Number`) how long after a timeout error is emitted. `0` to disable (defaults to `60000`)
  - `prefix` (`String`) prefix for the global callback functions that handle jsonp responses (defaults to `__jp`)
  - `name` (`String`) name of the global callback functions that handle jsonp responses (defaults to `prefix` + incremented counter)
- `fn` callback

### slider组件

- 使用`vue`特性插槽和`better-scroll`滚动库实现
- 设置轮播容器和子元素的宽度
- 初始化并配置`better-scroll`实现轮播
- 实现底部原点
- 实现自动轮播
- 优化轮播，解决`resize`问题









