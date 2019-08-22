# 项目结构

redux-sam 并不限制你的代码结构。但是，它规定了一些需要遵守的规则：

应用层级的状态应该集中到单个 store 对象中。

提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。

异步逻辑都应该封装到 action 里面。

只要你遵守以上规则，如何组织代码随你便。如果你的 store 文件太大，只需将 action、mutation 分割到单独的文件。

对于大型应用，我们会希望把 redux-sam 相关代码分割到模块中。下面是项目结构示例：

```js
├── public
│   ├── index.html
│   └── ... # 静态资源
└── src
    ├── index.js
    ├── api
    │    └── ... # 抽取出API请求
    ├── components
    │    ├── App
    │    └── ... # 抽取出公共组件
    └── store
         ├── index.js          # 我们组装模块并导出 store 的地方
         ├── actions.js        # 根级别的 action
         ├── mutations.js      # 根级别的 mutation
         └── modules
             ├── cart.js       # 购物车模块
             └── products.js   # 产品模块

```
