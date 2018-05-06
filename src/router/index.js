import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index.js'
// import HelloWorld from '@/components/HelloWorld'
// import Login from '@/components/Login'

Vue.use(Router)

// 路由懒加载
const Login = resolve => {
  require.ensure(['../components/Login.vue'], () => {
    resolve(require('../components/Login.vue'))
  })
}
const HelloWorld = resolve => {
  require.ensure(['../components/HelloWorld.vue'], () => {
    resolve(require('../components/HelloWorld.vue'))
  })
}

const Register = resolve => {
  require.ensure(['../components/Register.vue'], () => {
    resolve(require('../components/Register.vue'));
  });
};



const Home = resolve => {
  require.ensure(['../components/Home.vue'], () => {
      resolve(require('../components/Home.vue'));
  }); 
};

const ECharts = resolve => {
  require.ensure(['../components/charts/echarts.vue'], () => {
      resolve(require('../components/charts/echarts.vue'));
  }); 
};


const Form = resolve => {
  require.ensure(['../components/nav1/Form.vue'], () => {
      resolve(require('../components/nav1/Form.vue'));
  }); 
};

const Table = resolve => {
  require.ensure(['../components/nav1/Table.vue'], () => {
      resolve(require('../components/nav1/Table.vue'));
  }); 
};
const User = resolve => {
  require.ensure(['../components/nav1/user.vue'], () => {
      resolve(require('../components/nav1/user.vue'));
  }); 
};


const Page4 = resolve => {
  require.ensure(['../components/nav2/Page4.vue'], () => {
      resolve(require('../components/nav2/Page4.vue'));
  }); 
};

const Page5 = resolve => {
  require.ensure(['../components/nav2/Page5.vue'], () => {
      resolve(require('../components/nav2/Page5.vue'));
  }); 
};

const Page6 = resolve => {
  require.ensure(['../components/nav3/Page6.vue'], () => {
      resolve(require('../components/nav3/Page6.vue'));
  }); 
};

const Main = resolve => {
  require.ensure(['../components/Main.vue'], () => {
      resolve(require('../components/Main.vue'));
  }); 
};

const Error404 = resolve => {
  require.ensure(['../components/404.vue'], () => {
      resolve(require('../components/404.vue'));
  }); 
};

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      hidden: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      hidden: true
    },
    {
      path: '/register',
      name: 'register',
      component: Register ,
      hidden: true
    },
  //   {
  //     path: '/main',
  //     component: Home,
  //     // children:[
  //     //     {
  //     //         path: '/',
  //     //         component: Main
  //     //     }
  //     // ]
  // },
  {
    path: '/',
    component: Home,
    name: '导航一',
    iconCls: 'el-icon-message',//图标样式class
    children: [
        { path: '/main', component: Main, name: '主页', hidden: true,meta:{requiresAuth:true} },
        { path: '/table', component: Table, name: 'Table' ,meta:{requiresAuth:true}},
        { path: '/form', component: Form, name: 'Form' ,meta:{requiresAuth:true}},
        { path: '/user', component: User, name: '列表' ,meta:{requiresAuth:true}},
    ]
},
{
    path: '/',
    component: Home,
    name: '导航二',
    iconCls: 'el-icon-circle-plus',
    children: [
        { path: '/page4', component: Page4, name: '页面4',meta:{requiresAuth:true} },
        { path: '/page5', component: Page5, name: '页面5' ,meta:{requiresAuth:true}}
    ]
},
{
    path: '/',
    component: Home,
    name: '导航三',
    iconCls: 'el-icon-service',
    // leaf: true,//只有一个节点
    children: [
        { path: '/page6', component: Page6, name: '导航三',meta:{requiresAuth:true} }
    ]
},
{
    path: '/',
    component: Home,
    name: 'Charts',
    iconCls: 'el-icon-location-outline',
    children: [
        { path: '/echarts', component: ECharts, name: 'echarts' ,meta:{requiresAuth:true}}
    ]
},
    {
      path: '*',
      name: 'error',
      component: Error404,
      hidden: true
    }
  ]
})

router.beforeEach((to, from, next) => {
  //获取store里面的token
  let token = store.state.token;
  //判断要去的路由有没有requiresAuth
  if(to.meta.requiresAuth){

    if(token){
      next();
    }else{
      next({
        path: '/login',
        query: { redirect: to.fullPath }  // 将刚刚要去的路由path（却无权限）作为参数，方便登录成功后直接跳转到该路由
      });
    }

  }else{
    next();//如果无需token,那么随它去吧
  }
});

export default router