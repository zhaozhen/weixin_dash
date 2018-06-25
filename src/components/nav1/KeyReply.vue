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

<!-- KeywordsReplyMsgText  = 0
	KeywordsReplyMsgImage = 1
	KeywordsReplyMsgVoice = 2
	KeywordsReplyMsgVideo = 3
	KeywordsReplyMsgMusic = 4
	KeywordsReplyMsgNews  = 5 -->
      <!-- 编辑页面 -->
    	<el-dialog title="编辑" v-model="editFormVisible"  :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="70px" ref="editForm">
				<el-form-item label="关键字" prop="key">
					<el-input v-model="editForm.key" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="回复类型">
					<el-radio-group v-model="editForm.msg_type">
						<el-radio class="radio" :label="0">文字</el-radio>
						<el-radio class="radio" :label="1">图片</el-radio>
            <el-radio class="radio" :label="2">声音</el-radio>
            <el-radio class="radio" :label="3">视频</el-radio>
            <el-radio class="radio" :label="4">音乐</el-radio>
            <el-radio class="radio" :label="5">图文消息</el-radio>
					</el-radio-group>
				</el-form-item>
  

        <!-- 文字 -->
        <el-form-item label="内容" prop="value">
					<el-input v-model="editForm.value"></el-input>
				</el-form-item>

       <el-form-item label="图片" prop="value">
					<el-input v-model="editForm.value"></el-input>
				</el-form-item>

<el-upload
  class="avatar-uploader"
  :show-file-list="false"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="editForm.imageUrl" :src="editForm.imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>

		</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


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
      
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editForm: {
        msg_type: 0,
        key: "",
        value: ""
      },
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
    },
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
     //图片上传
    handleAvatarSuccess(res, file) {
      console.log(file)
      this.imageUrl = URL.createObjectURL(file.raw);
      },
    beforeAvatarUpload(file) {
      console.log(file)
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
  },
  mounted() {
    this.getKeyReplys();
  }
};
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
