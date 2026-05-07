<template>
  <el-container class="home-container">
    <!-- ===== 侧栏（贯穿全高） ===== -->
    <el-aside width="200px" class="pc-aside">
      <div class="pc-sidebrand">
        <div class="mark"><span class="g">易</span></div>
        <div class="meta">
          <div class="n">易得好康</div>
          <div class="s">HEALTH ADMIN</div>
        </div>
      </div>
      <el-menu
        class="pc-side-menu"
        :default-active="activeIndex"
        :default-openeds="openMenu"
        @select="handleSelect">

        <li class="pc-menu-group">总览</li>
        <el-menu-item index="/dashboard">
          <i class="ri-dashboard-2-line"></i><span slot="title">运营总览</span>
        </el-menu-item>

        <li class="pc-menu-group">业务中心</li>
        <el-submenu index="biz-order" v-if="sec.includes('order') || sec.includes('system') || sec.includes('wrj:manage') || sec.includes('accuragen:manage')">
          <template slot="title"><i class="ri-shopping-bag-3-line"></i><span>订单与样本</span></template>
          <el-menu-item index="/order" v-if="sec.includes('order')">订单管理</el-menu-item>
          <el-menu-item index="/brca/order" v-if="sec.includes('system')">BRCA 订单</el-menu-item>
          <el-menu-item index="/wrj/order" v-if="sec.includes('wrj:manage')">维汝健订单</el-menu-item>
          <el-menu-item index="/accuragen/channel" v-if="sec.includes('accuragen:manage')">安易筛渠道</el-menu-item>
        </el-submenu>

        <el-submenu index="biz-report" v-if="sec.includes('upload:report') || sec.includes('data-collect:report') || sec.includes('report:list') || sec.includes('custome-report:genessential') || sec.includes('system') || sec.includes('wrj:manage') || sec.includes('accuragen:manage')">
          <template slot="title"><i class="ri-file-text-line"></i><span>报告管理</span></template>
          <el-menu-item index="/report/customize/genessential" v-if="sec.includes('custome-report:genessential')">定制报告</el-menu-item>
          <el-menu-item index="/report/upload" v-if="sec.includes('upload:report')">上传报告</el-menu-item>
          <el-menu-item index="/report/list" v-if="sec.includes('data-collect:report')">提取报告</el-menu-item>
          <el-menu-item index="/report/info/list" v-if="sec.includes('report:list')">查看报告</el-menu-item>
          <el-menu-item index="/brca/paper/report" v-if="sec.includes('system')">BRCA 纸质报告</el-menu-item>
          <el-menu-item index="/wrj/paper/report" v-if="sec.includes('wrj:manage')">维汝健纸质报告</el-menu-item>
          <el-menu-item index="/accuragen/paper/report" v-if="sec.includes('accuragen:manage')">安易筛纸质报告</el-menu-item>
        </el-submenu>

        <el-submenu index="biz-informed" v-if="sec.includes('upload:informed') || sec.includes('data-collect:informed') || sec.includes('informed:list')">
          <template slot="title"><i class="ri-edit-2-line"></i><span>知情管理</span></template>
          <el-menu-item index="/informed/upload" v-if="sec.includes('upload:informed')">上传知情</el-menu-item>
          <el-menu-item index="/informed/list" v-if="sec.includes('data-collect:informed')">查看知情</el-menu-item>
          <el-menu-item index="/informed/info/list" v-if="sec.includes('informed:list')">知情查询</el-menu-item>
        </el-submenu>

        <el-menu-item index="/review" v-if="sec.includes('data-review')">
          <i class="ri-shield-check-line"></i><span slot="title">信息复核</span>
        </el-menu-item>

        <el-submenu index="biz-ru6c" v-if="sec.includes('ru6c-gene')">
          <template slot="title"><i class="ri-test-tube-line"></i><span>易见康检测</span></template>
          <el-menu-item index="/ru6c/upload">上传文件</el-menu-item>
          <el-menu-item index="/ru6c/list">查看结果</el-menu-item>
        </el-submenu>

        <el-menu-item index="/patient/list" v-if="sec.includes('patient:list')">
          <i class="ri-user-heart-line"></i><span slot="title">客户管理</span>
        </el-menu-item>

        <el-menu-item index="/points">
          <i class="ri-coin-line"></i><span slot="title">积分管理</span>
        </el-menu-item>

        <el-submenu index="biz-finance" v-if="sec.includes('system') || sec.includes('wrj:manage')">
          <template slot="title"><i class="ri-wallet-3-line"></i><span>财务中心</span></template>
          <el-menu-item index="/brca/commission" v-if="sec.includes('system')">佣金账户</el-menu-item>
          <el-menu-item index="/brca/withdraw" v-if="sec.includes('system')">提现记录</el-menu-item>
          <el-menu-item index="/brca/invoice" v-if="sec.includes('system')">BRCA 发票</el-menu-item>
          <el-menu-item index="/wrj/invoice" v-if="sec.includes('wrj:manage')">维汝健发票</el-menu-item>
          <el-menu-item index="/brca/exchange" v-if="sec.includes('system')">积分兑换</el-menu-item>
          <el-menu-item index="/brca/express" v-if="sec.includes('system')">快递查询</el-menu-item>
          <el-menu-item index="/brca/doctor" v-if="sec.includes('system')">注册医生</el-menu-item>
          <el-menu-item index="/brca/whitelist" v-if="sec.includes('system')">白名单</el-menu-item>
        </el-submenu>

        <li class="pc-menu-group">主数据</li>
        <el-menu-item index="/product" v-if="sec.includes('product')">
          <i class="ri-archive-2-line"></i><span slot="title">产品管理</span>
        </el-menu-item>
        <el-menu-item index="/hospital" v-if="sec.includes('hospital:list')">
          <i class="ri-hospital-line"></i><span slot="title">医院管理</span>
        </el-menu-item>
        <el-menu-item index="/firm" v-if="sec.includes('firm:list')">
          <i class="ri-building-2-line"></i><span slot="title">厂商管理</span>
        </el-menu-item>
        <el-menu-item index="/channel" v-if="sec.includes('channel:list')">
          <i class="ri-route-line"></i><span slot="title">渠道商管理</span>
        </el-menu-item>

        <el-submenu index="disease" v-if="sec.includes('system') && role === 'manager' && userId === 1">
          <template slot="title"><i class="ri-dna-line"></i><span>疾病数据库</span></template>
          <el-menu-item index="/drug">指南管理</el-menu-item>
          <el-menu-item index="/disease">疾病数据维护</el-menu-item>
          <el-menu-item index="/gene">基因数据维护</el-menu-item>
          <el-menu-item index="/product-cl">产品数据维护</el-menu-item>
        </el-submenu>

        <li class="pc-menu-group">系统</li>
        <el-submenu index="system" v-if="sec.includes('system')">
          <template slot="title"><i class="ri-team-line"></i><span>账号与权限</span></template>
          <el-menu-item index="/user" v-if="sec.includes('system:user-sec')">账号管理</el-menu-item>
          <el-menu-item index="/invite" v-if="sec.includes('system:user-sec')">邀请用户</el-menu-item>
        </el-submenu>

        <el-submenu index="printer" v-if="sec.includes('system') && role === 'manager' && userId === 1">
          <template slot="title"><i class="ri-printer-line"></i><span>一体机管理</span></template>
          <el-menu-item index="/printer/list">一体机列表</el-menu-item>
        </el-submenu>

        <el-submenu index="rank" v-if="sec.includes('system') && role === 'manager' && userId === 1">
          <template slot="title"><i class="ri-bar-chart-2-line"></i><span>实验室排名</span></template>
          <el-menu-item index="/rank/list">总排名</el-menu-item>
          <el-menu-item index="/standard/list">打分项维护</el-menu-item>
        </el-submenu>

        <el-submenu index="qrcode_manager" v-if="sec.includes('wechat_qrcode')">
          <template slot="title"><i class="ri-qr-code-line"></i><span>公众号二维码</span></template>
          <el-menu-item index="/qrcode-manager/add" v-if="sec.includes('wechat_qrcode:create')">生成二维码</el-menu-item>
          <el-menu-item index="/qrcode-manager/list" v-if="sec.includes('wechat_qrcode:list')">查看二维码列表</el-menu-item>
        </el-submenu>

      </el-menu>
    </el-aside>

    <!-- ===== 主内容区 ===== -->
    <el-container direction="vertical" class="pc-content">
      <el-header class="pc-header">
        <div class="left">
          <div class="pc-workspace-title">
            <span class="eyebrow">易得好康后台</span>
            <span class="title">运营工作台</span>
          </div>
        </div>
        <div class="right">
          <i class="el-icon-search" title="搜索"></i>
          <i class="el-icon-question" title="帮助"></i>
          <span class="ic-bell"><i class="el-icon-bell" title="通知"></i><em class="dot"></em></span>
          <el-dropdown trigger="click">
            <span class="user-chip">
              <span class="avatar">{{ avatarText }}</span>
              <span class="meta">
                <span class="n">{{ username }}</span>
                <span class="r">{{ roleLabel }}</span>
              </span>
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 历史 Tab 条 -->
      <div class="pc-tabs" v-if="tabs.length">
        <div class="pc-tabs-track">
          <div
            v-for="t in tabs"
            :key="t.key"
            class="pc-tab"
            :class="{ active: t.key === activeIndex }"
            @click="switchTab(t.key)">
            <i :class="t.icon"></i>
            <span class="label">{{ t.title }}</span>
            <i
              class="el-icon-close close"
              v-if="t.key !== '/dashboard'"
              @click.stop="closeTab(t.key)"></i>
          </div>
        </div>
        <div class="pc-tabs-actions">
          <i class="el-icon-refresh" title="刷新" @click="refreshTab"></i>
          <el-dropdown trigger="click" @command="tabCommand">
            <i class="el-icon-arrow-down"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="closeOthers">关闭其他</el-dropdown-item>
              <el-dropdown-item command="closeAll">全部关闭</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <el-main>
        <transition name="pc-fade" mode="out-in" :duration="200">
          <router-view :key="activeIndex"></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
const ICON_MAP = {
  '/dashboard': 'ri-dashboard-2-line',
  '/order': 'ri-shopping-bag-3-line',
  '/brca/order': 'ri-shopping-bag-3-line',
  '/wrj/order': 'ri-shopping-bag-3-line',
  '/accuragen/channel': 'ri-shopping-bag-3-line',
  '/report/customize/genessential': 'ri-file-text-line',
  '/report/upload': 'ri-file-text-line',
  '/report/list': 'ri-file-text-line',
  '/report/info/list': 'ri-file-text-line',
  '/brca/paper/report': 'ri-file-text-line',
  '/wrj/paper/report': 'ri-file-text-line',
  '/accuragen/paper/report': 'ri-file-text-line',
  '/informed/upload': 'ri-edit-2-line',
  '/informed/list': 'ri-edit-2-line',
  '/informed/info/list': 'ri-edit-2-line',
  '/review': 'ri-shield-check-line',
  '/ru6c/upload': 'ri-test-tube-line',
  '/ru6c/list': 'ri-test-tube-line',
  '/patient/list': 'ri-user-heart-line',
  '/points': 'ri-coin-line',
  '/brca/commission': 'ri-wallet-3-line',
  '/brca/withdraw': 'ri-wallet-3-line',
  '/brca/invoice': 'ri-wallet-3-line',
  '/wrj/invoice': 'ri-wallet-3-line',
  '/brca/exchange': 'ri-wallet-3-line',
  '/brca/express': 'ri-wallet-3-line',
  '/brca/doctor': 'ri-wallet-3-line',
  '/brca/whitelist': 'ri-wallet-3-line',
  '/product': 'ri-archive-2-line',
  '/hospital': 'ri-hospital-line',
  '/firm': 'ri-building-2-line',
  '/channel': 'ri-route-line',
  '/drug': 'ri-dna-line',
  '/disease': 'ri-dna-line',
  '/gene': 'ri-dna-line',
  '/product-cl': 'ri-dna-line',
  '/user': 'ri-team-line',
  '/invite': 'ri-team-line',
  '/printer/list': 'ri-printer-line',
  '/rank/list': 'ri-bar-chart-2-line',
  '/standard/list': 'ri-bar-chart-2-line',
  '/qrcode-manager/add': 'ri-qr-code-line',
  '/qrcode-manager/list': 'ri-qr-code-line'
}

const CRUMB_MAP = {
  '/dashboard': ['总览', '运营总览'],
  '/order': ['订单与样本', '订单管理'],
  '/brca/order': ['订单与样本', 'BRCA 订单'],
  '/wrj/order': ['订单与样本', '维汝健订单'],
  '/accuragen/channel': ['订单与样本', '安易筛渠道'],
  '/report/customize/genessential': ['报告管理', '定制报告'],
  '/report/upload': ['报告管理', '上传报告'],
  '/report/list': ['报告管理', '提取报告'],
  '/report/info/list': ['报告管理', '查看报告'],
  '/brca/paper/report': ['报告管理', 'BRCA 纸质报告'],
  '/wrj/paper/report': ['报告管理', '维汝健纸质报告'],
  '/accuragen/paper/report': ['报告管理', '安易筛纸质报告'],
  '/informed/upload': ['知情管理', '上传知情'],
  '/informed/list': ['知情管理', '查看知情'],
  '/informed/info/list': ['知情管理', '知情查询'],
  '/review': ['信息复核'],
  '/ru6c/upload': ['易见康检测', '上传文件'],
  '/ru6c/list': ['易见康检测', '查看结果'],
  '/patient/list': ['客户管理'],
  '/points': ['积分管理'],
  '/brca/commission': ['财务中心', '佣金账户'],
  '/brca/withdraw': ['财务中心', '提现记录'],
  '/brca/invoice': ['财务中心', 'BRCA 发票'],
  '/wrj/invoice': ['财务中心', '维汝健发票'],
  '/brca/exchange': ['财务中心', '积分兑换'],
  '/brca/express': ['财务中心', '快递查询'],
  '/brca/doctor': ['财务中心', '注册医生'],
  '/brca/whitelist': ['财务中心', '白名单'],
  '/product': ['主数据', '产品管理'],
  '/hospital': ['主数据', '医院管理'],
  '/firm': ['主数据', '厂商管理'],
  '/channel': ['主数据', '渠道商管理'],
  '/drug': ['主数据', '疾病数据库', '指南管理'],
  '/disease': ['主数据', '疾病数据库', '疾病维护'],
  '/gene': ['主数据', '疾病数据库', '基因维护'],
  '/product-cl': ['主数据', '疾病数据库', '产品维护'],
  '/user': ['系统', '账号与权限', '账号管理'],
  '/invite': ['系统', '账号与权限', '邀请用户'],
  '/printer/list': ['系统', '一体机列表'],
  '/rank/list': ['系统', '实验室排名', '总排名'],
  '/standard/list': ['系统', '实验室排名', '打分项维护'],
  '/qrcode-manager/add': ['系统', '公众号二维码', '生成二维码'],
  '/qrcode-manager/list': ['系统', '公众号二维码', '二维码列表']
}

const ROLE_LABEL = {
  manager: '管理员',
  'jk-service': '客服',
  operator: '运营',
  viewer: '查看者'
}

export default {
  name: 'home',
  data () {
    return {
      username: window.localStorage.username || 'admin',
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      // 沿用既有硬编码 sec（原 home.vue 已是这样），后续若改回 localStorage 再统一调整
      sec: 'upload,upload:informed,upload:report,upload:medical-records,order,data-collect,data-collect:informed,data-collect:report,data-review,system,system:user-sec,product,patient:list,hospital:list,firm:list,channel:list,custome-report:genessential,wechat_qrcode,wechat_qrcode:create,wechat_qrcode:list,accuragen:manage,wrj:manage',
      role: window.localStorage.role || '',
      activeIndex: '/dashboard',
      openMenu: ['biz-order', 'biz-report', 'biz-informed', 'biz-finance'],
      crumbPath: ['总览', '运营总览'],
      tabs: [{ key: '/dashboard', title: '运营总览', icon: 'ri-dashboard-2-line' }],
      tabReloadKey: 0
    }
  },
  computed: {
    avatarText () {
      const u = this.username || ''
      return u.slice(0, 2).toUpperCase()
    },
    roleLabel () {
      return ROLE_LABEL[this.role] || this.role || '运营'
    }
  },
  methods: {
    logout () {
      window.localStorage.clear()
      if (process.env.NODE_ENV === 'development') {
        window.location.href = process.env.DEV_LOGIN_PATH || '/#/dashboard'
        return
      }
      if (this.axios.defaults.baseURL.includes('qa.mdhcare.cn')) {
        window.location.href = 'http://qa.mdhcare.cn/website/login.html'
      } else if (this.axios.defaults.baseURL.includes('z.mdhcare.cn/z/')) {
        window.location.href = 'https://z.mdhcare.cn/z/login.html'
      } else {
        window.location.href = 'https://z.mdhcare.cn/login.html'
      }
    },
    handleSelect (key) {
      // el-menu 已经走 router 模式（通过 $router.push），这里只更新 active
      this.activeIndex = key
      if (this.$route.fullPath !== key) {
        this.$router.push(key).catch(() => {})
      }
    },
    pathOf (key) {
      // tab key 是 fullPath（含 query），map 用 path 索引
      return (key || '').split('?')[0] || '/'
    },
    iconForKey (key) {
      return ICON_MAP[this.pathOf(key)] || 'ri-file-line'
    },
    titleFromKey (key) {
      const path = this.pathOf(key)
      const c = CRUMB_MAP[path]
      if (c && c.length) return c[c.length - 1]
      const matched = this.$router.resolve(path)
      if (matched && matched.route && matched.route.meta && matched.route.meta.title) return matched.route.meta.title
      return path
    },
    syncFromRoute (fullPath) {
      this.activeIndex = fullPath
      const path = this.pathOf(fullPath)
      const c = CRUMB_MAP[path]
      this.crumbPath = c ? c.slice() : [this.titleFromKey(fullPath)]
      this.openTab(fullPath)
    },
    openTab (key) {
      if (this.tabs.find(t => t.key === key)) return
      this.tabs.push({
        key: key,
        title: this.titleFromKey(key),
        icon: this.iconForKey(key)
      })
      // 上限 12 个，保留首页
      if (this.tabs.length > 12) this.tabs.splice(1, 1)
    },
    switchTab (key) {
      if (key === this.activeIndex) return
      this.$router.push(key).catch(() => {})
    },
    closeTab (key) {
      const idx = this.tabs.findIndex(t => t.key === key)
      if (idx < 0) return
      this.tabs.splice(idx, 1)
      if (key === this.activeIndex) {
        const next = this.tabs[idx] || this.tabs[idx - 1] || this.tabs[0]
        if (next) this.$router.push(next.key).catch(() => {})
      }
    },
    refreshTab () {
      // 通过改变 router-view 的 key 触发组件重建
      const k = this.activeIndex
      this.activeIndex = ''
      this.$nextTick(() => { this.activeIndex = k })
    },
    tabCommand (cmd) {
      const k = this.activeIndex
      if (cmd === 'closeOthers') {
        this.tabs = this.tabs.filter(t => t.key === '/dashboard' || t.key === k)
      } else if (cmd === 'closeAll') {
        this.tabs = this.tabs.filter(t => t.key === '/dashboard')
        this.$router.push('/dashboard').catch(() => {})
      }
    }
  },
  watch: {
    '$route' (to) {
      this.syncFromRoute(to.fullPath)
    }
  },
  created () {
    this.syncFromRoute(this.$route.fullPath)
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100%;
  min-width: 1200px;
  height: 100%;
}
.pc-content {
  flex: 1;
  min-width: 0;
}
/* aside 自带样式由 element-overrides.css 提供 */
.pc-aside {
  height: 100vh;
}
</style>

<style lang="scss">
/* 顶栏 / tabs / aside 已统一在 src/assets/css/design-system/element-overrides.css 里以 #app 作 scope 落地，
   这里不再重复样式 —— 下面只对 router-view transition 做兜底 */
.pc-fade-enter-active,
.pc-fade-leave-active { transition: all 200ms ease; }
.pc-fade-enter,
.pc-fade-leave-to { opacity: 0; transform: translateY(4px); }
</style>
