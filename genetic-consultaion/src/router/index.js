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
import Upload from '@/components/Upload'

// 后台管理路由
import Dashboard from '@/views/home/dashboard/dashboard'

import UserSec from '@/views/home/user/user'
import UserList from '@/views/home/user/list'

import InformedUpload from '@/views/home/informed/informed_upload'
import ReportUpload from '@/views/home/report/report_upload'

import InformedList from '@/views/home/data_collect/informed_list'
import InformedEdit from '@/views/home/data_collect/informed_edit'

import ReportList from '@/views/home/data_collect/report_list'
import ReportEdit from '@/views/home/data_collect/report_edit'
import DataReview from '@/views/home/data_review/data_review'

import BarcodeUserList from '@/views/home/channel/list'

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
        }
      ]
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
      path: '/upload',
      name: 'Upload',
      component: Upload,
      meta: {
        title: '预览报告'
      }
    }
  ]
})
