<template>
	<section>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.key" placeholder="关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getKeyReplys">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>


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
            <el-table-column prop="value" label="关键字的内容"  :formatter="formatMsgValue" width="200" sortable>
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
    	<el-dialog title="编辑" v-model="editFormVisible"  @open="openEditDialog()"  :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="70px" ref="editForm">
				<el-form-item label="关键字" prop="key">
					<el-input v-model="editForm.key" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="回复类型">
					<el-radio-group v-model="editForm.msg_type" @change="subShow">
						<el-radio class="radio" disabled :label="0">文字</el-radio>
						<el-radio class="radio" disabled :label="1">图片</el-radio>
            <el-radio class="radio" disabled :label="2">声音(sorry)</el-radio>
            <el-radio class="radio" disabled :label="3">视频(和图片类似)</el-radio>
            <el-radio class="radio" disabled :label="4">音乐</el-radio>
            <el-radio class="radio" disabled :label="5">图文消息</el-radio>
					</el-radio-group>
				</el-form-item>
  

        <!-- 文字 -->
        <el-form-item v-show="wz" label="内容" prop="value">
					<el-input v-model="editForm.msg" prop="msg" ></el-input>
				</el-form-item>

        <!-- 图片 -->
        <el-upload
          v-show="tp"
          class="avatar-uploader"
          :show-file-list="false"
          action="http://localhost:8023/api/upload"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="editForm.image" :src="editForm.image" prop="image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <!-- 音乐 -->
        <el-form-item v-show="yy" label="音乐名称" prop="value">
					<el-input v-model="editForm.title" prop="title"></el-input>
				</el-form-item>

       <el-form-item v-show="yy" label="音乐描述" prop="value">
					<el-input v-model="editForm.desc"prop="desc" ></el-input>
				</el-form-item>

        <el-form-item v-show="yy" label="音乐地址" prop="value">
					<el-input v-model="editForm.music" prop="music"></el-input>
				</el-form-item>


    <!-- 图文 -->
     <el-table
      v-show="tw"
      :data="twData"
      >
      <el-table-column
        prop="title"
        label="标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        width="180">
      </el-table-column>
      <el-table-column
        prop="pic_url"
        label="图片地址" :formatter="formateImageUrl">
      </el-table-column>
      <el-table-column
        prop="url"
        label="跳转地址" :formatter="formateImageUrl">
      </el-table-column>
      <el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEditSub(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDelSub(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
    </el-table>

		</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


<!-- sub页面的编辑 -->
<el-dialog title="编辑" v-model="editFormSubVisible"  :visible.sync="editFormSubVisible" :close-on-click-modal="false">
			<el-form :model="editFormSub" label-width="70px" ref="editForm">
				<el-form-item label="标题" prop="title">
					<el-input v-model="editFormSub.title" auto-complete="off"></el-input>
				</el-form-item>
		</el-form>

    <el-form :model="editFormSub" label-width="70px" ref="editForm">
				<el-form-item label="描述" prop="description">
					<el-input v-model="editFormSub.description" auto-complete="off"></el-input>
				</el-form-item>
		</el-form>

    <el-form :model="editFormSub" label-width="70px" ref="editForm">
				<el-form-item label="图片地址" prop="pic_url">
					<el-input v-model="editFormSub.pic_url"  auto-complete="off"></el-input>
				</el-form-item>
		</el-form>

    <el-form :model="editFormSub" label-width="70px" ref="editForm">
				<el-form-item label="跳转地址" prop="url">
					<el-input v-model="editFormSub.url" auto-complete="off"></el-input>
				</el-form-item>
		</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormSubVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmitSub" :loading="editLoading">暂时保存</el-button>
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
        filters: {
          key: ""
        },   
      wz:false,//文字
      tp:false, //图片
      yy:false, //音乐
      tw:false,//图文
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormSubVisible:false,
      editForm: {
        msg_type: -1,
        key: "",
        value: "",
        msg:"",
        image:"",
        imageUrl:"",
        title:"",
        desc:"",
        music:"",
      },
      keyReplies: [],
      total: 0,
      page: 1,
      listLoading: false,
      twData:[],
      editFormSub:{
        title:"",
        description:"",
        url:"",
        pic_url:"",
      }
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
    formatMsgValue:function(row, colum){
       switch (row.msg_type) {
        case 1:
        return "http://..."
        break;
        case 0:
          return row.value;
          break;
        case 4:
          return row.key_reply_music_vo.title;
          break;
        case 5:
          return "图文消息内容点编辑查看";
          break;
        default:
          return "default";
          break;
      }
    },
    handleDel:function(value,value1,value2){
      this.$message( {
          message: '意外不意外？',
          type: 'success'
        });

    },
    handleDelSub:function(value,value1,value2){
        this.$message( {
          message: '震惊不震惊？',
          type: 'warning'
        });

    },
    handleAdd:function(){

    },
    formateImageUrl:function(value){
      return "http://....";
    },
    subShow:function(value){
    // console.log(value);
    switch (value){
      case 0:
      this.wz=true;
      this.tp=false;
      this.yy=false;
      this.tw=false;
      break;
      case 1:
      this.tp=true;
      this.wz=false;
      this.yy=false;
      this.tw=false;
      break;
      case 4:
      this.yy=true;
      this.wz=false;
      this.tp=false;
      this.tw=false;
      break;
      case 5:
      this.tw=true;
      this.yy=false;
      this.wz=false;
      this.tp=false;
      break;
      default :
      this.wz=true;
      this.tp=false;
      this.yy=false;
      this.tw=false;
      break;
    }
    },
    getKeyReplys() {
      let para = {
        page: this.page,
        name: this.filters.key
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
          this.keyReplies = data.data.keyplies;
        }
      });
    },
    selsChange(sels) {
      this.sels = sels;
    },
    openEditDialog:function(){
      //通过editForm的值控制显示的字段
      this.subShow(this.editForm.msg_type);
       switch (this.editForm.msg_type) {
        case 0:
          this.twData=null;
          this.editForm.msg=this.editForm.value;
          // break;
        case 1:
          this.twData=null;
          this.editForm.image=this.editForm.value;
          // break;
        case 4:
          this.twData=null;
          this.editForm.title=this.editForm.key_reply_music_vo.title;
          this.editForm.desc=this.editForm.key_reply_music_vo.description;
          this.editForm.music=this.editForm.key_reply_music_vo.music_url;
          // break;
        case 5:
          this.twData=this.editForm.key_reply_news_vos;
          // break;
      }
    },
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    editSubmit:function(){
      //拼床合适的参数
      var para = Object.assign({}, this.editForm);
      switch (para.msg_type){
          case 0:
          para.value= para.msg;
          break;
          case 1:
          para.value=para.imageUrl;
          break;
          case 4:
          para.key_reply_music_vo.title=this.editForm.title;
          para.key_reply_music_vo.description=this.editForm.desc;
          para.key_reply_music_vo.music_url=this.editForm.music;
          break;
          case 5:
          para.key_reply_news_vos=this.twData;
          break;
      };

      this.listLoading = true;
      NProgress.start();
      api.addAndUpdateKeyReply(para).then(({ data }) => {
        this.listLoading = false;
        NProgress.done();
        if (data.errNo > 0) {
          this.$message({
            type: "info",
            message: data.msg
          });
          return;
        } else {
          this.editFormVisible = false;
          this.getKeyReplys();
        }
      });
    },
    handleEditSub: function(index, row) {
      this.editFormSubVisible = true;
      this.editFormSub = Object.assign({}, row);
    },
    editSubmitSub:function(){
      var _this=this;
      _this.twData.forEach(function(element,index){
      if(element.id==_this.editFormSub.id){
        console.log(_this.editFormSub.id);
           _this.$set(_this.twData, index, _this.editFormSub)
        }
      });
      this.editFormSubVisible = false;
    },
     //图片上传
    handleAvatarSuccess(res, file) {
      console.log(file)
      this.editForm.image = URL.createObjectURL(file.raw);
       this.editForm.imageUrl = file.response.filePath;
      // this.
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
