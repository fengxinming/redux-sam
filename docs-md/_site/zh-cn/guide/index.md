# redux-sam

> `redux-sam` 作为一个 Redux 中间件，让你像使用Vuex一样管理状态。

笔者是一位 Vue 患者，从深圳来到杭州之后，发现 React 一直占据着杭州市场。最近在接手老项目过程中发现，前人对 Dva 的使用方式跟Vuex类似，除了每次在reducer最后返回新对象。

笔者在思考能不能像 Vuex 一样简单而纯粹地管理状态，而不是像 Dva 一样在 `redux-saga` 上进行二次封装。因此，在借(chao)鉴(xi) Vuex 的代码之后，孕育出了一个 Redux 中间件 `redux-sam`。

![redux-sam](../img/redux-sam.png)
