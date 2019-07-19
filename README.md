# wx2tt

小程序转换工具

## 安装

```
npm i mini2mini -g
```

## 使用方法
```
mini2mini wx <path/to/wxapp> qq <path/to/qqapp> [--watch] [--minify] [--minify-css] [--minify-js] [--minify-xml]
```

## 参数说明
- path/to/wxapp 表示微信小程序目录
- path/to/ttapp 表示头条小程序目录
- --watch 表示监听模式运行
- --minify 压缩所有能压缩的文件
- --minify-wxss 仅压缩wxss文件
- --minify-js 仅压缩js文件
- --minify-wxml 仅压缩wxml文件


## 说明

mini2mini 的功能很简单，以微信小程序转换成qq小程序，他主要做了如下事情：

- 转换xml 后缀
- 转换css 后缀
- 替换 xml 中 wx: 改为 qq:
- 替换 js 中 wx. 改为 qq.

## 使用技巧

- 使用小程序框架开发者, 可以将编译后的再通过 mini2mini 进行转换
- 如果原生开发者，将 mini2mini 克隆下来 ，可以很方便扩展 mini2mini，比如增加 sass 或者 less 功能
- 无论是原生开发或者框架开发投不推荐压缩 js，这将使你线上的代码很难度

## 注意事项

**基于小程序之间的共同性
感谢！参考：https://github.com/dream2023/wx2tt.git
