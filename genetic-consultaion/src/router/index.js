import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/home'

// 微信服务号路由
import WechatInformedUpload from '@/views/wechat/InformedUpload'
import WechatReportUpload from '@/views/wechat/ReportUpload'
import HospitalList from '@/views/wechat/hospital_list'
import DeptList from '@/views/wechat/dept_list'
import ReportDownload from '@/views/wechat/report_download'
import ReportView from '@/views/wechat/report_view'
import OrderList from '@/views/wechat/order_list'
import WechatReportList from '@/views/wechat/report_list'
import WechatInformedList from '@/views/wechat/informed_list'
import PathlogicUpload from '@/views/wechat/pathlogic_upload'
// 移动端报告页面
import PersonalReport from '@/views/wechat/report/personal_report'
import RU6C from '@/views/wechat/report/ru6c'
import RU6CDetail from '@/views/wechat/report/ru6c_detail'

// 后台管理路由
import Dashboard from '@/views/home/dashboard/dashboard'

import UserSec from '@/views/home/user/user'
import UserList from '@/views/home/user/list'

import InformedUpload from '@/views/home/informed/informed_upload'
import InformedInfoList from '@/views/home/informed/list'
import ReportUpload from '@/views/home/report/report_upload'
import ReportInfoList from '@/views/home/report/list'

import InformedList from '@/views/home/data_collect/informed_list'
import InformedEdit from '@/views/home/data_collect/informed_edit'

import ReportList from '@/views/home/data_collect/report_list'
import ReportEdit from '@/views/home/data_collect/report_edit'
import DataReview from '@/views/home/data_review/data_review'

import BarcodeUserList from '@/views/home/channel/list'

import Order from '@/views/home/order/order'
import OrderDetail from '@/views/home/order/detail'
import CustomerList from '@/views/home/customer/list'

import ProductList from '@/views/home/product/list'
import ProductEdit from '@/views/home/product/edit'

import PatientList from '@/views/home/patient/list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: '/user',
          name: 'UserSec',
          component: UserSec,
          redirect: '/user/list/business-agent',
          children: [
            {
              path: '/user/list/:role',
              name: 'UserList',
              component: UserList
            }
          ]
        },
        {
          path: '/channel',
          name: 'BarcodeUserList',
          component: BarcodeUserList,
          redirect: '/channel/barcode',
          children: [
            {
              path: '/channel/barcode',
              name: 'BarcodeUserList',
              component: BarcodeUserList
            }
          ]
        },
        {
          path: '/informed/upload',
          name: 'InformedUpload',
          component: InformedUpload
        },
        {
          path: '/informed/info/list',
          name: 'InformedInfoList',
          component: InformedInfoList
        },
        {
          path: '/report/upload',
          name: 'ReportUpload',
          component: ReportUpload
        },
        {
          path: '/informed/list',
          name: 'InformedList',
          component: InformedList
        },
        {
          path: '/report/list',
          name: 'ReportList',
          component: ReportList
        },
        {
          path: '/report/info/list',
          name: 'ReportInfoList',
          component: ReportInfoList
        },
        {
          path: '/informed/edit/:informedId',
          name: 'InformedEdit',
          component: InformedEdit
        },
        {
          path: '/report/edit/:reportId',
          name: 'ReportEdit',
          component: ReportEdit
        },
        {
          path: '/review',
          name: 'DataReview',
          component: DataReview
        },
        {
          path: '/order',
          name: 'Order',
          component: Order
        },
        {
          path: '/order/:id',
          name: 'OrderDetail',
          component: OrderDetail
        },
        {
          path: '/customer',
          name: 'CustomerList',
          component: CustomerList
        },
        {
          path: '/product',
          name: 'ProductList',
          component: ProductList
        },
        {
          path: '/product/edit/:id',
          name: 'ProductEdit',
          component: ProductEdit
        },
        {
          path: '/product/add',
          name: 'ProductAdd',
          component: ProductEdit
        },
        {
          path: '/patient/list',
          name: 'PatientList',
          component: PatientList
        }
      ]
    },
    {
      path: '/wechat/order',
      name: 'OrderList',
      component: OrderList,
      meta: {
        title: '我的订单'
      }
    },
    {
      path: '/wechat/informed/upload',
      name: 'WechatInformedUpload',
      component: WechatInformedUpload,
      meta: {
        title: '上传知情同意'
      }
    },
    {
      path: '/wechat/report/upload',
      name: 'WechatReportUpload',
      component: WechatReportUpload,
      meta: {
        title: '上传报告'
      }
    },
    {
      path: '/wechat/case/upload',
      name: 'PathlogicUpload',
      component: PathlogicUpload,
      meta: {
        title: '上传病历'
      }
    },
    {
      path: '/wechat/hospital',
      name: 'HospitalList',
      component: HospitalList,
      meta: {
        title: '选择医院'
      }
    },
    {
      path: '/wechat/hospital',
      name: 'HospitalList',
      component: HospitalList,
      meta: {
        title: '选择医院'
      }
    },
    {
      path: '/wechat/dept',
      name: 'DeptList',
      component: DeptList,
      meta: {
        title: '选择科室'
      }
    },
    {
      path: '/wechat/informed/list',
      name: 'WechatInformedList',
      component: WechatInformedList,
      meta: {
        title: '我的知情'
      }
    },
    {
      path: '/wechat/report/list',
      name: 'WechatReportList',
      component: WechatReportList,
      meta: {
        title: '我的报告'
      }
    },
    {
      path: '/report/download',
      name: 'ReportDownload',
      component: ReportDownload,
      meta: {
        title: '下载报告'
      }
    },
    {
      path: '/report/view',
      name: 'ReportView',
      component: ReportView,
      meta: {
        title: '预览报告'
      }
    },
    {
      path: '/report/personal',
      name: 'PersonalReport',
      component: PersonalReport,
      meta: {
        title: '个人检测报告'
      }
    },
    {
      path: '/report/ru6c',
      name: 'RU6C',
      component: RU6C,
      meta: {
        title: '健康检测报告'
      }
    },
    {
      path: '/report/ru6c/detail',
      name: 'RU6CDetail',
      component: RU6CDetail,
      meta: {
        title: '健康检测报告'
      }
    }
  ]
})
