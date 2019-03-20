import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: resolve => require(['@/views/home/home'], resolve),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: resolve => require(['@/views/home/dashboard/dashboard'], resolve)
        },
        {
          path: '/user',
          name: 'UserSec',
          component: resolve => require(['@/views/home/user/user'], resolve),
          redirect: '/user/list/business-agent',
          children: [
            {
              path: '/user/list/:role',
              name: 'UserList',
              component: resolve => require(['@/views/home/user/list'], resolve)
            }
          ]
        },
        {
          path: '/channel/barcode',
          name: 'BarcodeUserList',
          component: resolve => require(['@/views/home/channel/list'], resolve)
        },
        {
          path: '/informed/upload',
          name: 'InformedUpload',
          component: resolve => require(['@/views/home/informed/informed_upload'], resolve)
        },
        {
          path: '/informed/info/list',
          name: 'InformedInfoList',
          component: resolve => require(['@/views/home/informed/list'], resolve)
        },
        {
          path: '/report/upload',
          name: 'ReportUpload',
          component: resolve => require(['@/views/home/report/report_upload'], resolve)
        },
        {
          path: '/informed/list',
          name: 'InformedList',
          component: resolve => require(['@/views/home/data_collect/informed_list'], resolve)
        },
        {
          path: '/report/list',
          name: 'ReportList',
          component: resolve => require(['@/views/home/data_collect/report_list'], resolve)
        },
        {
          path: '/report/info/list',
          name: 'ReportInfoList',
          component: resolve => require(['@/views/home/report/list'], resolve)
        },
        {
          path: '/informed/edit/:informedId',
          name: 'InformedEdit',
          component: resolve => require(['@/views/home/data_collect/informed_edit'], resolve)
        },
        {
          path: '/report/edit/:reportId',
          name: 'ReportEdit',
          component: resolve => require(['@/views/home/data_collect/report_edit'], resolve)
        },
        {
          path: '/review',
          name: 'DataReview',
          component: resolve => require(['@/views/home/data_review/data_review'], resolve)
        },
        {
          path: '/review/detail/:reportId',
          name: 'DataReviewDetail',
          component: resolve => require(['@/views/home/data_review/detail'], resolve)
        },
        {
          path: '/order',
          name: 'Order',
          component: resolve => require(['@/views/home/order/order'], resolve)
        },
        {
          path: '/order/:id',
          name: 'OrderDetail',
          component: resolve => require(['@/views/home/order/detail'], resolve)
        },
        {
          path: '/customer',
          name: 'CustomerList',
          component: resolve => require(['@/views/home/customer/list'], resolve)
        },
        {
          path: '/product',
          name: 'ProductList',
          component: resolve => require(['@/views/home/product/list'], resolve)
        },
        {
          path: '/product/edit/:id',
          name: 'ProductEdit',
          component: resolve => require(['@/views/home/product/edit'], resolve)
        },
        {
          path: '/product/add',
          name: 'ProductAdd',
          component: resolve => require(['@/views/home/product/edit'], resolve)
        },
        {
          path: '/patient/list',
          name: 'PatientList',
          component: resolve => require(['@/views/home/patient/list'], resolve)
        },
        {
          path: '/hospital',
          name: 'HospitalList',
          component: resolve => require(['@/views/home/hospital/list'], resolve)
        },
        {
          path: '/hospital/edit/:id',
          name: 'HospitalEdit',
          component: resolve => require(['@/views/home/hospital/edit'], resolve)
        },
        {
          path: '/hospital/add',
          name: 'HospitalAdd',
          component: resolve => require(['@/views/home/hospital/edit'], resolve)
        },
        {
          path: '/firm',
          name: 'FirmList',
          component: resolve => require(['@/views/home/firm/list'], resolve)
        },
        {
          path: '/firm/add',
          name: 'FirmAdd',
          component: resolve => require(['@/views/home/firm/edit'], resolve)
        },
        {
          path: '/firm/edit/:id',
          name: 'FirmEdit',
          component: resolve => require(['@/views/home/firm/edit'], resolve)
        },
        {
          path: '/channel',
          name: 'ChannelList',
          component: resolve => require(['@/views/home/channel/list'], resolve)
        },
        {
          path: '/channel/add',
          name: 'ChannelAdd',
          component: resolve => require(['@/views/home/channel/edit'], resolve)
        },
        {
          path: '/channel/edit/:id',
          name: 'ChannelEdit',
          component: resolve => require(['@/views/home/channel/edit'], resolve)
        },
        {
          path: '/report/customize/genessential',
          name: 'ReportCustomize',
          component: resolve => require(['@/views/customize/genessential/customize_report'], resolve)
        },
        {
          path: '/disease',
          name: 'Disease',
          component: resolve => require(['@/views/home/disease/disease/list'], resolve)
        },
        {
          path: '/disease/add',
          name: 'DiseaseEdit',
          component: resolve => require(['@/views/home/disease/disease/edit'], resolve)
        },
        {
          path: '/disease/edit/:id',
          name: 'DiseaseEdit',
          component: resolve => require(['@/views/home/disease/disease/edit'], resolve)
        },
        {
          path: '/gene',
          name: 'Gene',
          component: resolve => require(['@/views/home/disease/gene/list'], resolve)
        },
        {
          path: '/gene/add',
          name: 'GeneEdit',
          component: resolve => require(['@/views/home/disease/gene/edit'], resolve)
        },
        {
          path: '/gene/edit/:id',
          name: 'GeneEdit',
          component: resolve => require(['@/views/home/disease/gene/edit'], resolve)
        },
        {
          path: '/drug',
          name: 'Drug',
          component: resolve => require(['@/views/home/disease/drug/list'], resolve)
        },
        {
          path: '/drug/add',
          name: 'DrugEdit',
          component: resolve => require(['@/views/home/disease/drug/edit'], resolve)
        },
        {
          path: '/drug/edit/:id',
          name: 'DrugEdit',
          component: resolve => require(['@/views/home/disease/drug/edit'], resolve)
        },
        {
          path: '/test',
          name: 'Test',
          component: resolve => require(['@/views/home/disease/test/list'], resolve)
        },
        {
          path: '/test/add',
          name: 'TestEdit',
          component: resolve => require(['@/views/home/disease/test/edit'], resolve)
        },
        {
          path: '/test/edit/:id',
          name: 'TestEdit',
          component: resolve => require(['@/views/home/disease/test/edit'], resolve)
        }
      ]
    },
    {
      path: '/wechat/order',
      name: 'OrderList',
      component: resolve => require(['@/views/wechat/order_list'], resolve),
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/wechat/informed/upload',
      name: 'WechatInformedUpload',
      component: resolve => require(['@/views/wechat/InformedUpload'], resolve),
      meta: {
        title: '上传知情同意'
      }
    },
    {
      path: '/wechat/report/upload',
      name: 'WechatReportUpload',
      component: resolve => require(['@/views/wechat/ReportUpload'], resolve),
      meta: {
        title: '上传报告'
      }
    },
    {
      path: '/wechat/case/upload',
      name: 'PathlogicUpload',
      component: resolve => require(['@/views/wechat/pathlogic_upload'], resolve),
      meta: {
        title: '上传病历'
      }
    },
    {
      path: '/wechat/hospital',
      name: 'HospitalList',
      component: resolve => require(['@/views/wechat/hospital_list'], resolve),
      meta: {
        title: '选择医院'
      }
    },
    {
      path: '/wechat/dept',
      name: 'DeptList',
      component: resolve => require(['@/views/wechat/dept_list'], resolve),
      meta: {
        title: '选择科室'
      }
    },
    {
      path: '/wechat/informed/list',
      name: 'WechatInformedList',
      component: resolve => require(['@/views/wechat/informed_list'], resolve),
      meta: {
        title: '我的知情'
      }
    },
    {
      path: '/wechat/report/list',
      name: 'WechatReportList',
      component: resolve => require(['@/views/wechat/report_list'], resolve),
      meta: {
        title: '我的报告'
      }
    },
    {
      path: '/report/download',
      name: 'ReportDownload',
      component: resolve => require(['@/views/wechat/report_download'], resolve),
      meta: {
        title: '下载报告'
      }
    },
    {
      path: '/report/view',
      name: 'ReportView',
      component: resolve => require(['@/views/wechat/report_view'], resolve),
      meta: {
        title: '预览报告'
      }
    },
    {
      path: '/report/personal',
      name: 'PersonalReport',
      component: resolve => require(['@/views/wechat/report/personal_report'], resolve),
      meta: {
        title: '个人检测报告'
      }
    },
    {
      path: '/report/ru6c',
      name: 'RU6C',
      component: resolve => require(['@/views/wechat/report/ru6c'], resolve),
      meta: {
        title: '健康检测报告'
      }
    },
    {
      path: '/report/ru6c/detail',
      name: 'RU6CDetail',
      component: resolve => require(['@/views/wechat/report/ru6c_detail'], resolve),
      meta: {
        title: '健康检测报告'
      }
    },
    {
      path: '/wechat/salesman/add',
      name: 'AddUser',
      component: resolve => require(['@/views/wechat/add_user'], resolve),
      meta: {
        title: '业务员绑定'
      }
    },
    {
      path: '/wechat/success',
      name: 'Success',
      component: resolve => require(['@/views/wechat/add_user_success'], resolve),
      meta: {
        title: '操作成功'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: resolve => require(['@/views/register'], resolve)
    },
    {
      path: '/loading',
      name: 'Loading',
      component: resolve => require(['@/views/loading'], resolve)
    },
    {
      path: '/customize/genessential/pdf-report/:sampleNo',
      name: 'GenessentialPDFReport',
      component: resolve => require(['@/views/customize/genessential/pdf_report'], resolve)
    }
  ]
})
