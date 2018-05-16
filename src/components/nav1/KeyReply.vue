<template>
	<section>
		<!--列表-->
		<el-table :data="keyReplies" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="key" label="关键字" width="120" sortable>
			</el-table-column>
			<el-table-column prop="msg_type" label="回复类型" width="150" :formatter="formatMsgType" sortable>
			</el-table-column>
            <el-table-column prop="value" label="关键字的内容" width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</section>
</template>


<script>
import util from "../../../static/js/util";
import api from "../../axios.js";
import NProgress from "nprogress";

export default {
  data() {
    return {
      //   filters: {
      //     name: ""
      //   },
      keyReplies: [],
      total: 0,
      page: 1,
      listLoading: false
    };
  },
  methods: {
    //msgType转换
    formatMsgType: function(row, column) {
      switch (row.msg_type) {
        case 0:
          return "Text(文本)";
          break;
        case 1:
          return "Image(图片)";
          break;
        case 2:
          return "Voice(声音)";
          break;
        case 3:
          return "Video(视频)";
          break;
        case 4:
          return "Music(音乐)";
          break;
        case 5:
          return "News(图文消息)";
          break;
        default:
          console.log(row.msg_type);
          return "default";
          break;
      }
    },
    getKeyReplys() {
      let para = {
        // page: this.page,
        // name: this.filters.name
      };
      this.listLoading = true;
      NProgress.start();
      api.getKeyReplys({}).then(({ data }) => {
        this.listLoading = false;
        NProgress.done();
        if (data.errNo > 0) {
          this.$message({
            type: "info",
            message: data.msg
          });
          return;
        } else {
          //   this.total = data.data.total;
          this.keyReplies = data.data.keyplies;
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    }
  },
  mounted() {
    this.getKeyReplys();
  }
};
</script>

<style >

</style>
