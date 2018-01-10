<template>
<section>
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">
      <!--<el-form-item>
					<el-input v-model="filters.name"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>-->
      <el-form-item>
        <el-select v-model="filters.categoryId" placeholder="请选择" @change="changeList">
          <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.key"></el-input>
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
    <el-table-column prop="name" label="图片名称" sortable>
    </el-table-column>
    <el-table-column prop="status" label="状态" :formatter="formatStatus" sortable>
    </el-table-column>
    <el-table-column prop="type" label="类别" sortable>
      <template slot-scope="scope">
					 <el-select v-model="scope.row.category_name" placeholder="请选择" @change="handleEditCategory($event,scope.$index, scope.row)">
				    <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
       </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间" sortable>
    </el-table-column>
    <el-table-column label="操作">
      <template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="primary" size="small" @click="handleJudge(scope.$index, scope.row)">审核</el-button>
					<!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
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
  <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="editForm.name" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog>

  <!--新增界面-->
  <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
    <!--<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
      <el-form-item label="标签" prop="name">
        <el-input v-model="addForm.name" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>-->
    <el-upload class="upload-demo" action="//47.97.167.88/image/upload" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :on-success="fileSuccess" list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="fileSubmit">确定</el-button>
    </div>
  </el-dialog>

  <!--审核界面-->
  <el-dialog title="编辑" v-model="judgeFormVisible" :close-on-click-modal="false">
    <el-form :model="judgeForm" label-width="80px" :rules="judgeFormRules" ref="judgeForm">
      <el-radio-group v-model="judgeForm.status" @change="changeStatus" prop="status">
        <el-radio label="0">待审核</el-radio>
        <el-radio label="2">通过</el-radio>
        <el-radio label="1">删除</el-radio>
      </el-radio-group>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="judgeFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="judgeSubmit" :loading="judgeLoading">提交</el-button>
    </div>
  </el-dialog>

</section>
</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import {
  getImageList,
  getUserListPage,
  updateImgCat,
  judgeImg,
  editUser,
  addUser
} from '../../api/api';

export default {
  data() {
    return {
      filters: {
        key: '',
        categoryId: '',
      },
      flag: false,
      fileList: [],
      options: [],
      users: [],
      total: 0,
      page: 1,
      judgeFormVisible:false,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{
          required: true,
          message: '请输入标签',
          trigger: 'blur'
        }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: ''
      },
      judgeForm: {
        id: 0,
        status: ''
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }]
      },
      //新增界面数据
      addForm: {
        name: ''
      }

    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    //性别显示转换
    formatStatus: function(row, column) {
      switch (row.status) {
        case '0':
          return '待审核';
          break;
        case '1':
          return '删除';
          break;
        case '2':
          return '通过';
          break;
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    changeList(val) {
      this.filters.categoryId = val;
      console.log(val);
    },
    fileSubmit(val) {
      this.addFormVisible = false;
      this.fileList = [];
      this.getUsers();
    },
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page,
        categoryId: this.filters.categoryId,
        key: this.filters.key
      };
      this.listLoading = true;
      //NProgress.start();
      getImageList(para).then((res) => {
        this.total = res.data.total;
        this.users = res.data.message.data;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    fileSuccess: function() {
      this.$message({
        message: '上传成功',
        type: 'success'
      });
    },
    getList() {
      getUserListPage().then((res) => {
        //this.total = res.data.total;
        this.options = res.data.message;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    handleJudge: function(index, row) {
      console.log(row);
      this.judgeFormVisible = true;
      this.judgeForm.id = Object.assign({}, row).id;
      this.judgeForm.status = Object.assign({}, row).status;
    },
    handleEditCategory: function(val, index, row) {
      console.log(val);
      if (!this.flag) {
        this.flag = true;
        return;
      }
      let para = {};
      console.log(row);
      para.id = row.id;
      para.categoryId = val;
      updateImgCat(para).then((res) => {
        //NProgress.done();
        this.$message({
          message: '提交成功',
          type: 'success'
        });
        // this.getUsers();
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = {
          id: row.id
        };
        removeUser(para).then((res) => {
          this.listLoading = false;
          //NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getUsers();
        });
      }).catch(() => {

      });
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {
        name: ''
      };
    },
    judgeSubmit: function(index, row) {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.judgeLoading = true;
        //NProgress.start();
        let para = Object.assign({}, this.judgeForm);
        judgeImg(para).then((res) => {
          this.judgeLoading = false;
          //NProgress.done();
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.$refs['judgeForm'].resetFields();
          this.judgeFormVisible = false;
          this.getUsers();
        });
      });
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);
            editUser(para).then((res) => {
              this.editLoading = false;
              //NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.$refs['editForm'].resetFields();
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            //para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
            addUser(para).then((res) => {
              this.addLoading = false;
              //NProgress.done();
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              this.$refs['addForm'].resetFields();
              this.addFormVisible = false;
              this.getUsers();
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
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        //NProgress.start();
        let para = {
          ids: ids
        };
        batchRemoveUser(para).then((res) => {
          this.listLoading = false;
          //NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getUsers();
        });
      }).catch(() => {

      });
    }
  },
  mounted() {
    this.getUsers();
    this.getList();
  }
}
</script>

<style scoped>

</style>
