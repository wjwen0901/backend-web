import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// import Vconsole from 'vconsole';
// const vConsole = new Vconsole();
// Vue.use(vConsole)

export default new Router({
    routes: [{
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
                  path: '/accuragen/channel',
                  name: 'AccuragenChannel',
                  component: resolve => require(['@/views/home/accuragen/channel-list'], resolve)
                },
                {
                  path: '/accuragen/paper/report',
                  name: 'AccuragenPaperReport',
                  component: resolve => require(['@/views/home/accuragen/paper-report'], resolve)
                },
                {
                  path: '/brca/order',
                  name: 'BrcaOrder',
                  component: resolve => require(['@/views/home/brca/order'], resolve)
                },
                {
                  path: '/brca',
                  name: 'UserSec',
                  component: resolve => require(['@/views/home/brca/user'], resolve)
                },
                {
                  path: '/brca/whitelist',
                  name: 'Whitelist',
                  component: resolve => require(['@/views/home/brca/whitelist'], resolve)
                },
                {
                  path: '/brca/commission',
                  name: 'commission',
                  component: resolve => require(['@/views/home/brca/commission'], resolve)
                },
                {
                  path: '/brca/withdraw',
                  name: 'withdraw',
                  component: resolve => require(['@/views/home/brca/withdraw'], resolve)
                },
                {
                  path: '/brca/invoice',
                  name: 'Invoice',
                  component: resolve => require(['@/views/home/brca/invoice'], resolve)
                },
                {
                  path: '/brca/express',
                  name: 'Express',
                  component: resolve => require(['@/views/home/brca/express'], resolve)
                },
                {
                  path: '/brca/exchange',
                  name: 'Exchange',
                  component: resolve => require(['@/views/home/brca/exchange'], resolve)
                },
                {
                  path: '/brca/paper/report',
                  name: 'PaperReport',
                  component: resolve => require(['@/views/home/brca/paper-report'], resolve)
                },
                {
                  path: '/brca/doctor',
                  name: 'BrcaUserSec',
                  component: resolve => require(['@/views/home/brca/user'], resolve),
                  redirect: '/brca/doctor/list/business-agent',
                  children: [{
                    path: '/brca/doctor/list/:role',
                    name: 'BrcaUserList',
                    component: resolve => require(['@/views/home/brca/user-list'], resolve)
                  }]
                },

                {
                  path: '/wrj/order',
                  name: 'WrjOrder',
                  component: resolve => require(['@/views/home/wrj/order'], resolve)
                },
                {
                  path: '/wrj/invoice',
                  name: 'WrjInvoice',
                  component: resolve => require(['@/views/home/wrj/invoice'], resolve)
                },
                {
                  path: '/wrj/express',
                  name: 'WrjExpress',
                  component: resolve => require(['@/views/home/wrj/express'], resolve)
                },
                {
                  path: '/wrj/paper/report',
                  name: 'WrjPaperReport',
                  component: resolve => require(['@/views/home/wrj/paper-report'], resolve)
                },


                {
                    path: '/user',
                    name: 'UserSec',
                    component: resolve => require(['@/views/home/user/user'], resolve),
                    redirect: '/user/list/business-agent',
                    children: [{
                        path: '/user/list/:role',
                        name: 'UserList',
                        component: resolve => require(['@/views/home/user/list'], resolve)
                    }]
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
                    path: '/informed/all/:sampleNo',
                    name: 'InformedAll',
                    component: resolve => require(['@/views/home/data_collect/informed_all'], resolve)
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
                    name: 'DiseaseAdd',
                    component: resolve => require(['@/views/home/disease/disease/edit'], resolve)
                },
                {
                    path: '/disease/edit/:id',
                    name: 'DiseaseEdit',
                    component: resolve => require(['@/views/home/disease/disease/edit'], resolve)
                },
                {
                    path: '/disease/preview',
                    name: 'DiseasePreview',
                    component: resolve => require(['@/views/home/disease/disease/preview'], resolve)
                },
                {
                    path: '/disease/view',
                    name: 'DiseaseView',
                    component: resolve => require(['@/views/home/disease/disease/view'], resolve)
                },
                {
                    path: '/gene',
                    name: 'Gene',
                    component: resolve => require(['@/views/home/disease/gene/list'], resolve)
                },
                {
                    path: '/gene/preview',
                    name: 'GenePreview',
                    component: resolve => require(['@/views/home/disease/gene/preview'], resolve)
                },
                {
                    path: '/gene/view',
                    name: 'GeneView',
                    component: resolve => require(['@/views/home/disease/gene/view'], resolve)
                },
                {
                    path: '/gene/add',
                    name: 'GeneAdd',
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
                    path: '/drug/preview',
                    name: 'DrugPreview',
                    component: resolve => require(['@/views/home/disease/drug/preview'], resolve)
                },
                {
                    path: '/drug/add',
                    name: 'DrugAdd',
                    component: resolve => require(['@/views/home/disease/drug/edit'], resolve)
                },
                {
                    path: '/drug/edit/:id',
                    name: 'DrugEdit',
                    component: resolve => require(['@/views/home/disease/drug/edit'], resolve)
                },
                {
                    path: '/drug/view',
                    name: 'DrugView',
                    component: resolve => require(['@/views/home/disease/drug/view'], resolve)

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
                },
                {
                    path: '/guide',
                    name: 'Guide',
                    component: resolve => require(['@/views/home/disease/guide/list'], resolve)
                },
                {
                    path: '/guide/add',
                    name: 'GuideAdd',
                    component: resolve => require(['@/views/home/disease/guide/edit'], resolve)
                },
                {
                    path: '/guide/edit/:id',
                    name: 'GuideEdit',
                    component: resolve => require(['@/views/home/disease/guide/edit'], resolve)
                },
                {
                    path: '/product-cl',
                    name: 'ProductCl',
                    component: resolve => require(['@/views/home/disease/product/list'], resolve)
                },
                {
                    path: '/product-cl/add',
                    name: 'ProductClAdd',
                    component: resolve => require(['@/views/home/disease/product/edit'], resolve)
                },
                {
                    path: '/product-cl/edit/:id',
                    name: 'ProductClEdit',
                    component: resolve => require(['@/views/home/disease/product/edit'], resolve)
                },
                {
                    path: '/product-cl/preview',
                    name: 'ProductClPreview',
                    component: resolve => require(['@/views/home/disease/product/preview'], resolve)
                },
                {
                    path: '/product-cl/view',
                    name: 'ProductClView',
                    component: resolve => require(['@/views/home/disease/product/view'], resolve)
                },
                {
                    path: '/rank/list',
                    name: 'RankList',
                    component: resolve => require(['@/views/home/rank/rank_list'], resolve)
                },
                {
                    path: '/rank/edit/:id',
                    name: 'RankEdit',
                    component: resolve => require(['@/views/home/rank/company_rank'], resolve)
                },
                {
                    path: '/rank/add',
                    name: 'RankEdit',
                    component: resolve => require(['@/views/home/rank/company_rank'], resolve)
                },
                {
                    path: '/standard/list',
                    name: 'StandardList',
                    component: resolve => require(['@/views/home/rank/standard_list'], resolve)
                },
                {
                    path: '/printer/list',
                    name: 'PrinterList',
                    component: resolve => require(['@/views/home/printer/list'], resolve)
                },
                // 公众号二维码操作
                {
                    path: '/qrcode-manager/add',
                    name: 'QmAdd',
                    component: resolve => require(['@/views/home/qrcode_manager/qm_add'], resolve)
                },
                {
                    path: '/qrcode-manager/edit',
                    name: 'QmEdit',
                    component: resolve => require(['@/views/home/qrcode_manager/qm_edit'], resolve)
                },
                {
                    path: '/qrcode-manager/list',
                    name: 'QmList',
                    component: resolve => require(['@/views/home/qrcode_manager/qm_list'], resolve)
                },
                {
                    path: '/qrcode-manager/detail-list',
                    name: 'DetailList',
                    component: resolve => require(['@/views/home/qrcode_manager/detail_list'], resolve)
                }
                ,
                {
                  path: '/ru6c/upload',
                  name: 'Ru6cUpload',
                  component: resolve => require(['@/views/home/ru6c/upload'], resolve)
                },
                {
                  path: '/ru6c/list',
                  name: 'Ru6cList',
                  component: resolve => require(['@/views/home/ru6c/list'], resolve)
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
            path: '/wechat/browser/upload',
            name: 'BrowserUpload',
            component: resolve => require(['@/views/wechat/browserUpload'], resolve),
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
        },
        {
            path: '/customize/genessential/sport-report/:sampleNo',
            name: 'GenessentialSportPDFReport',
            component: resolve => require(['@/views/customize/genessential/sport_report'], resolve)
        },
        {
            path: '/market/items',
            name: 'MarketItems',
            component: resolve => require(['@/views/wechat/item_list'], resolve),
            meta: {
                title: '基因检测产品目录'
            }
        },
        {
            path: '/qrcode/pay',
            name: 'QrcodePay',
            component: resolve => require(['@/views/wechat/qrcode/pay_temp'], resolve),
            meta: {
                title: '见山会诊正在向你收款'
            }
        },
        {
            path: '/qrcode/pay/info/:id',
            name: 'QrcodePayInfo',
            component: resolve => require(['@/views/wechat/qrcode/pay_info'], resolve),
            meta: {
                title: '见山会诊正在向你收款'
            }
        },
        {
            path: '/qrcode/pay/temp',
            name: 'QrcodePayTemp',
            component: resolve => require(['@/views/wechat/qrcode/pay_temp'], resolve),
            meta: {
                title: '基因检测产品付款'
            }
        },
        {
            path: '/wechat/express/upload',
            name: 'ExpressUpload',
            component: resolve => require(['@/views/wechat/express_upload'], resolve),
            meta: {
                title: '快递单上传'
            }
        },
        {
            path: '/wechat/express/show',
            name: 'ExpressShow',
            component: resolve => require(['@/views/wechat/express_show'], resolve),
            meta: {
                title: '查看快递单'
            }
        },
        {
            path: '/wechat/signin',
            name: 'Signin',
            component: resolve => require(['@/views/wechat/signin/signin'], resolve),
            meta: {
                title: '见山会诊签到'
            }
        },
        {
            path: '/wechat/lucky',
            name: 'Lucky',
            component: resolve => require(['@/views/wechat/lucky/lucky'], resolve),
            meta: {
                title: '见山会诊签到抽奖'
            }
        },
        {
            path: '/wechat/lucky/guide',
            name: 'Lucky',
            component: resolve => require(['@/views/wechat/lucky/lucky_guide'], resolve),
            meta: {
                title: '见山会诊签到查看指南'
            }
        },
        {
            path: '/wechat/lucky/down',
            name: 'Lucky',
            component: resolve => require(['@/views/wechat/lucky/guide_view'], resolve),
            meta: {
                title: '见山会诊签到查看指南'
            }
        },
        {
            path: '/wechat/qrcode/order',
            name: 'channelOrder',
            component: resolve => require(['@/views/wechat/qrcode/order_code'], resolve),
            meta: {
                title: '见山会诊签到查看指南'
            }
        }
    ]
})
