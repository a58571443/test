<template>
<section>
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-select v-model="filters.categoryId" placeholder="请选择" @change="changeList">
          <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="关键字" v-model="filters.key"></el-input>
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
    <el-table-column prop="id" label="id" sortable>
    </el-table-column>
    <el-table-column prop="category_id" label="类别id" sortable>
    </el-table-column>
    <el-table-column prop="status" label="状态" :formatter="formatStatus" sortable>
    </el-table-column>
    <el-table-column prop="title" label="标题" sortable>
    </el-table-column>
    <el-table-column prop="description" label="描述" sortable>
    </el-table-column>
    <el-table-column prop="rank" label="帖子权重" sortable>
      <template slot-scope="scope">
         <el-input v-model="scope.row.rank"  placeholder="请输入内容" @blur="handleEditRank($event,scope.$index, scope.row)"></el-input>
     </template>
    </el-table-column>
    <el-table-column prop="icon_id" label="icon_id" sortable>
    </el-table-column>
    <!--<el-table-column prop="create_time" label="创建时间" sortable>
    </el-table-column>
    <el-table-column prop="modified_time" label="修改时间" sortable>
    </el-table-column>-->
    <el-table-column prop="category_name" label="类别名称" sortable>
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
    <el-table-column label="操作" width="200px">
      <template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="primary" size="small" @click="handleJudge(scope.$index, scope.row)">审核</el-button>
          <!--<el-button type="warning" size="small" @click="handleCategory(scope.$index, scope.row)">编辑帖子类别</el-button>-->
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
      <el-form-item label="帖子名称" prop="title">
        <el-input v-model="editForm.title" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="帖子描述" prop="description">
        <el-input v-model="editForm.description" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
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

  <!--编辑帖子类别界面-->
  <el-dialog title="编辑" v-model="categoryFormVisible" :close-on-click-modal="false">
    <el-form :model="categoryForm" label-width="80px" :rules="categoryFormRules" ref="categoryForm">
      <el-select v-model="categoryForm.category_name" placeholder="请选择" @change="changeCategory">
        <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
        </el-option>
      </el-select>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="categoryFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="categorySubmit" :loading="judgeLoading">提交</el-button>
    </div>
  </el-dialog>

  <!--新增界面-->
  <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
    <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
      <el-form-item label="帖子标题" prop="title">
        <el-input v-model="addForm.title" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="帖子描述" prop="description">
        <el-input v-model="addForm.description" auto-complete="off"></el-input>
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
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import {
  getUserListPage,
  judgePost,
  getpostsList,
  removeUser,
  batchRemoveUser,
  editPost,
  addPost,
  categoryPost,
  updateRank
} from '../../api/api';

export default {
  data() {
    return {
      filters: {
        key: '',
        categoryId: '',
      },
      flag: false,
      flag1: false,
      options: [],
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列
      radio: '0',
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      judgeLoading: false,
      editFormRules: {
        title: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        title: '',
        description: ''
      },
      judgeForm: {
        id: 0,
        status: ''
      },
      categoryFormVisible: false,
      judgeFormVisible: false,
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        }]
      },
      //新增界面数据
      addForm: {
        title: '',
        description: ''
      },
      categoryForm: {
        id: '',
        categoryId: '',
        category_name: ''
      }
    }
  },
  methods: {
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
    changeStatus(val) {
      this.judgeForm.status = val;
      console.log(val);
    },
    changeCategory(val) {
      this.categoryForm.categoryId = val;
      console.log(val);
    },

    changeList(val) {
      this.filters.categoryId = val;
      console.log(val);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    getList() {
      getUserListPage().then((res) => {
        //this.total = res.data.total;
        this.options = res.data.message;
        this.listLoading = false;
        //NProgress.done();
      });
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
      getpostsList(para).then((res) => {
        this.flag = false;
        this.total = res.data.total;
        this.users = res.data.message.data;
        this.listLoading = false;
        //NProgress.done();
      });
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
      judgePost(para).then((res) => {
        //NProgress.done();
        this.$message({
          message: '提交成功',
          type: 'success'
        });
        // this.getUsers();
      });
    },
    handleEditRank: function(e, index, row) {
      console.log('!'+e.target.value);
      let para = {};
      para.id = row.id;
      para.rank = e.target.value;
      updateRank(para).then((res) => {
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
      console.log(row);
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
      this.addForm = {

      };
    },
    handleCategory: function(index, row) {
      console.log(row);
      this.categoryFormVisible = true;
      this.categoryForm.id = Object.assign({}, row).id;
      this.categoryForm.category_name = Object.assign({}, row).category_name;
      this.categoryForm.categoryId = Object.assign({}, row).category_id;
    },
    handleJudge: function(index, row) {
      console.log(row);
      this.judgeFormVisible = true;
      this.judgeForm.id = Object.assign({}, row).id;
      this.judgeForm.status = Object.assign({}, row).status;
    },
    categorySubmit: function(index, row) {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.categoryLoading = true;
        //NProgress.start();
        let para = Object.assign({}, this.categoryForm);
        categoryPost(para).then((res) => {
          this.categoryLoading = false;
          //NProgress.done();
          this.$message({
            message: '提交成功',
            type: 'success'
          });
          this.$refs['categoryForm'].resetFields();
          this.categoryFormVisible = false;
          this.getUsers();
        });
      });
    },
    judgeSubmit: function(index, row) {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.judgeLoading = true;
        //NProgress.start();
        let para = Object.assign({}, this.judgeForm);
        judgePost(para).then((res) => {
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
            editPost(para).then((res) => {
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
            addPost(para).then((res) => {
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
