---
banner:
  name: 'redux-sam'
  desc: 'redux-sam 作为一个Redux插件，让你像使用Vuex一样管理状态.'
  btns: 
    - { name: '开 始', href: './guide/index.html', primary: true }
    - { name: 'Github >', href: 'https://github.com/react-hobby/redux-sam' }
  caption: '当前版本: v1.1.1'
features: 
  - { name: 'State', desc: 'redux-sam 使用单一状态树，用一个对象就包含了全部的应用层级状态。' }
  - { name: 'Mutation', desc: '更改 redux-sam 的 store 中的状态的唯一方法是提交 mutation，redux-sam 中的 mutation 非常类似于事件，每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数。' }
  - { name: 'Action', desc: 'Action 类似于 mutation，不同在于：Action 提交的是 mutation，而不是直接变更状态；Action 可以包含任意异步操作。' }
  - { name: 'Module', desc: '由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。为了解决以上问题，redux-sam 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、甚至是嵌套子模块——从上至下进行同样方式的分割。' }

footer:
  copyRight:
    name: 'React Hobby Team'
    href: 'https://github.com/react-hobby'
  links:
    团队网址:
      - { name: 'React Hobby', href: 'https://github.com/react-hobby' }
      - { name: 'React Hobby Blog', href: 'https://github.com/react-hobby' }
    Git仓库:
      - { name: 'Github', href: 'https://github.com/react-hobby/redux-sam' }
      - { name: 'Github Issue', href: 'https://github.com/react-hobby/redux-sam/issues' }

---

<Homepage banner={banner} features={features} />
<Footer distPath={props.page.distPath} copyRight={props.footer.copyRight} links={props.footer.links} />
