<template>
  <el-container>
    <el-header>
      <el-input
        class="search-input"
        placeholder="请输入医院名称"
        v-model="keywords">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </el-header>
    <el-main>
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div id="dataList" class="mdh-input-row" v-for="hospital in hospitalList" v-bind:key="hospital.id"
             @click="chooseHospital(hospital.id, hospital.name)">
          <label>{{hospital.name}}</label>
        </div>
      </mescroll-vue>
    </el-main>
  </el-container>
</template>
<script>
import MescrollVue from 'mescroll.js/mescroll.vue'
export default {
  name: 'hospital_list',
  components: {
    MescrollVue // 注册mescroll组件
  },
  data () {
    return {
      keywords: null,
      hospitalList: [],
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: { // 上拉加载的配置.
        // warpId: 'dataList',
        callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
        // 以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 // 每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">亲,没有更多数据了~</p>',
        noMoreSize: 10, // 如果列表已无数据,可设置列表总数大于5才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
        toTop: {
          // 回到顶部按钮
          src: './static/mescroll/mescroll-totop.png', // 图片路径,默认null,支持网络图
          offset: 1000 // 列表滚动1000px才显示回到顶部按钮
        },
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才显示
          warpId: 'dataList', // 父布局的id (1.3.5版本支持传入dom元素)
          icon: './static/mescroll/mescroll-empty.png', // 图标,默认null,支持网络图
          tip: '暂无相关数据~' // 提示
        }
      }
    }
  },
  methods: {
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit (mescroll) {
      this.mescroll = mescroll
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback (page, mescroll) {
      // 联网请求
      this.axios.get('hospital/page', {
        params: {
          pageNum: page.num, // 页码
          pageSize: page.size, // 每页长度
          keywords: this.keywords
        }
      }).then((response) => {
        // 请求的列表数据
        if (response.data.endRow === 0) {
          const newHospital = [{
            name: this.keywords,
            id: 0
          }]
          this.hospitalList = newHospital
        } else {
          // 如果是第一页需手动制空列表
          if (page.num === 1) this.hospitalList = []
          // 把请求到的数据添加到列表
          this.hospitalList = this.hospitalList.concat(response.data.list)
        }
        // 数据渲染成功后,隐藏下拉刷新的状态
        this.$nextTick(() => {
          mescroll.endSuccess(response.data.endRow)
        })
      }).catch((e) => {
        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        mescroll.endErr()
      })
    },
    getHospitalList () {
      this.axios.get('hospital/page', {
        params: {
          keywords: this.keywords,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        if (res.data.list.length === 0) {
          const newHospital = [{
            name: this.keywords,
            id: 0
          }]
          console.log(newHospital)
          this.hospitalList = newHospital
        } else {
          this.hospitalList = res.data.list
        }
      }).catch(err => {
        console.log(err)
      })
    },
    chooseHospital (id, name) {
      if (parseInt(id) === 0) {
        this.axios.post('hospital', {name: name}).then(res => {
          this.$router.push({path: '/wechat/informed/upload', query: {hid: res.data.id, hname: name, openid: this.$route.query.openid}})
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$router.push({path: '/wechat/informed/upload', query: {hid: id, hname: name, openid: this.$route.query.openid}})
      }
    }
  },
  watch: {
    keywords: {
      handler: function (val, oldval) {
        if (val !== oldval) {
          this.mescroll.resetUpScroll()
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    min-height: 100%;
    background: #f2f2f2;
  }
  .el-header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
    background: #f2f2f2;
  }
  .search-input {
    margin-top: 10px;
  }
  .el-main {
    padding: 0;
    padding-top: 60px;
    overflow: scroll;
  }
  .mdh-input-row {
    position: relative;
    width: 100%;
    background: #fff;
    height: 40px;
    padding: 0;
    label {
      position: absolute;
      left: 0;
      top: 0;
      width: calc(100% - 20px);
      padding-left: 20px;
      line-height: 40px;
      font-size: 14px;
    }
    input {
      height: 40px;
      width: 100%;
      padding: 0;
      padding-left: 80px;
      border: 0;
      line-height: 40px;
    }
    .next-step {
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      padding: 0px 10px;
      line-height: 40px;
      color: #333333;
    }
    &:after {
      position: absolute;
      right: 0;
      bottom: 0;
      height: 1px;
      width: 100%;
      content: '';
      /*border-bottom: 1px solid #c8c7cc;*/
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #c8c7cc;
    }

  }
</style>
