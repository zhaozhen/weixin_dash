<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>
			</el-table-column>
			<el-table-column prop="createdAt" label="注册时间" width="200" sortable>
			</el-table-column>
			<el-table-column prop="role" label="角色" width="120" :formatter="formatRole" sortable>
			</el-table-column>
			<el-table-column prop="location" label="地址" min-width="200" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible"  :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
			<el-form-item label="注册时间" prop="createdAt">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.createdAt"></el-date-picker>
				</el-form-item>
				<el-form-item label="角色"  prop="role">
					<el-radio-group v-model="editForm.role">
					<el-radio class="radio" disabled :label="3">管理员</el-radio>
					<el-radio class="radio" :label="1">用户</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄" prop="age">
					<el-input-number v-model="editForm.score" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.location"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="注册时间" prop="createdAt">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.createdAt"></el-date-picker>
				</el-form-item>
				<el-form-item label="角色"  prop="role">
					<el-radio-group v-model="addForm.role">
					<el-radio class="radio" disabled :label="3">管理员</el-radio>
					<el-radio class="radio" :label="1">用户</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄" prop="age">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="地址" prop="location">
					<el-input type="textarea" v-model="addForm.location"></el-input>
				</el-form-item>				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
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
        name: ""
      },
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        createdAt: [{ required: true, message: "请输入时间", trigger: "blur" }],
        location: [{ required: true, message: "请输入地址", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        name: "",
        sex: 0,
        age: 0,
        role: 1,
        createdAt: "",
        location: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        createdAt: [{ required: true, message: "请输入时间", trigger: "blur" }],
        location: [{ required: true, message: "请输入地址", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        name: "",
        sex: 0,
        age: 0,
        role: 1,
        createdAt: "",
        location: ""
      }
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    formatRole: function(row, column) {
      return row.role == 1 ? "管理员" : "普通用户";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page,
        name: this.filters.name
      };
      this.listLoading = true;
      NProgress.start();
      api.getUsers(para).then(({ data }) => {
        this.listLoading = false;
        NProgress.done();
        if (data.errNo > 0) {
          this.$message({
            type: "info",
            message: data.msg
          });
          return;
        } else {
          this.total = data.data.total;
          this.users = data.data.users;
        }
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          //NProgress.start();
		  let para = { id: row.id };
		  
          this.$message({
            type: "info",
            message: "删除成功！"
		  });
		  this.listLoading = false;
          // removeUser(para).then((res) => {
          // 	this.listLoading = false;
          // 	//NProgress.done();
          // 	this.$message({
          // 		message: '删除成功',
          // 		type: 'success'
          // 	});
          // 	this.getUsers();
          // });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      console.log(row);
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: "",
        sex: -1,
        age: 0,
        createdAt: "",
        location: ""
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            // para.birth =
            //   !para.birth || para.birth == ""
            //     ? ""
            //     : util.formatDate.format(new Date(para.birth), "yyyy-MM-dd hh:mm:ss");

            api.addAndUpdateUser(para).then(({ data }) => {
              this.listLoading = false;
              NProgress.done();
              if (data.errNo > 0) {
                this.$message({
                  type: "info",
                  message: data.msg
                });
                return;
              } else {
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
                this.getUsers();
              }
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            NProgress.start();
            let para = Object.assign({}, this.addForm);
            console.log(para);
            // para.createdAt =
            //   !para.createdAt || para.createdAt == ""
            //     ? ""
            //     : util.formatDate.format(
            //         new Date(para.createdAt),
            //         "yyyy-MM-dd hh:mm:ss"
            //       );
            api.addAndUpdateUser(para).then(({ data }) => {
              this.listLoading = false;
              NProgress.done();
              if (data.errNo > 0) {
                this.$message({
                  type: "info",
                  message: data.msg
                });
              } else {
                this.$refs["addForm"].resetFields();
                this.addFormVisible = false;
                this.getUsers();
              }
            });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          NProgress.start();
          let para = { ids: ids };

          this.$message({
            type: "info",
            message: "删除成功！"
          });

          this.listLoading = false;
          NProgress.done();
          //   setTimeout(function() {
          //     this.listLoading = false;
          //     NProgress.done();
          //   }, 2000);
          // batchRemoveUser(para).then((res) => {
          // 	this.listLoading = false;
          // 	//NProgress.done();
          // 	this.$message({
          // 		message: '删除成功',
          // 		type: 'success'
          // 	});
          // 	this.getUsers();
          // });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getUsers();
  }
};
</script>

<style >

</style>