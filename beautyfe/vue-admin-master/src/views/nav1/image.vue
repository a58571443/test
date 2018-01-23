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
        <el-select v-model="filters.categoryId" placeholder="请选择类别" @change="changeList">
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
    <!-- <el-table-column type="selection" width="55">
    </el-table-column> -->
    <el-table-column prop="name" label="图片名称" sortable>
    </el-table-column>
    <el-table-column prop="ref_url" label="图片预览" sortable>
      <template slot-scope="scope">
        <img class="preview-img"  v-model="scope.row.ref_url" :src="scope.row.ref_url" @click="preview(scope.row.ref_url)">
       </template>
    </el-table-column>
    <el-table-column prop="title" label="关键字" sortable>
      <template slot-scope="scope">
        <ul v-for="(item,index) in scope.row.keyword">
           <li class="keyword-li">
             <p>{{item.name}}</p>
           </li>
        </ul>
     </template>
    </el-table-column>
    <el-table-column prop="status" label="状态" :formatter="formatStatus" sortable>
    </el-table-column>
    <el-table-column prop="type" label="类别" sortable>
      <template slot-scope="scope">
					 <el-select v-model="scope.row.category_name" placeholder="请选择" @visible-change="isVisible($event)" @change="handleEditCategory($event,scope.$index, scope.row)">
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
    <el-table-column prop="title" label="帖子名称" sortable>
    </el-table-column>
    <!-- <el-table-column prop="posts_id" label="帖子" sortable>
      <template slot-scope="scope">
           <el-select v-model="scope.row.posts_name" placeholder="请选择" @visible-change="isVisible($event)" @change="handleEditCategory($event,scope.$index, scope.row)">
            <el-option
              v-for="item in articles"
              :key="item.value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
       </template>
    </el-table-column> -->
    <el-table-column label="操作" class="td">
      <template scope="scope">
          <div class="btns">
            <el-button class="td-btn" type="primary" size="small" @click="handleJudge(scope.$index, scope.row)">审核</el-button>
  					<el-button class="td-btn" type="danger" size="small" @click="handleKeyword(scope.$index, scope.row)">编辑图片关键字</el-button>
            <el-button type="warning" @click.native="addArticle(scope.$index, scope.row)">添加帖子</el-button>
          </div>
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->

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

  <!--编辑帖子关键字-->
  <el-dialog title="编辑" v-model="keywordFormVisible" :close-on-click-modal="false">
    <el-form :model="keywordForm" label-width="80px" :rules="keywordFormRules" ref="keywordForm">
      <template slot-scope="scope">
         <ul v-model="keyword" v-for="(item,index) in keyword">
            <li>
              <p>{{item.name}}</p>
              <el-button @click="delKeyword(item.id,scope.$index, scope.row)">删除</el-button>
            </li>
         </ul>
     </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="keywordClose">确定</el-button>
      <el-button type="primary" @click.native="addKeywordShow">添加关键字</el-button>
    </div>
  </el-dialog>

  <!--新增关键字-->
  <el-dialog title="新增关键字" v-model="addKeywordFormVisible" :close-on-click-modal="false">
    <el-form :model="addKeywordForm" label-width="80px" :rules="addKeywordFormRules" ref="addKeywordForm">
      <el-form-item label="关键字" prop="keyword">
        <template slot-scope="scope">
             <el-select v-model="addKeywordForm.keywords" placeholder="请选择" @change="selectGet">
              <el-option
                v-for="item in keywords"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
         </template>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addKeywordFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="handleAddKeyword">提交</el-button>
    </div>
  </el-dialog>

  <!--预览图片-->
  <el-dialog title="预览" v-model="previewVisible" :close-on-click-modal="false">
    <img :src="previewUrl">
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="previewVisible = false">取消</el-button>
      <el-button type="primary" @click.native="previewVisible = false">确定</el-button>
    </div>
  </el-dialog>

  <!--编辑帖子图片-->
  <el-dialog title="编辑" v-model="imgsFormVisible" :close-on-click-modal="false">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-select v-model="filters.categoryId" placeholder="请选择类别" @change="changeAList">
            <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="关键字" v-model="filter.key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.keywordId" placeholder="请选择关键字" @change="changeKeyword">
            <el-option v-for="item in keywords" :key="item.value" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getArticle">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="lists" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column prop="title" label="帖子名称" sortable>
      </el-table-column>
      <el-table-column prop="title" label="关键字" sortable>
        <template slot-scope="scope">
         <ul v-for="(item,index) in scope.row.keyword">
            <li class="keyword-li">
              <p>{{item.name}}</p>
            </li>
         </ul>
      </template>
      </el-table-column>
      <el-table-column prop="icon_image" label="封面图片" sortable>
        <template slot-scope="scope">
          <img class="preview-img"  v-if="scope.row.icon_image" v-model="scope.row.icon_image.ref_url" :src="scope.row.icon_image.ref_url" @click="preview(scope.row.icon_image.ref_url)">
         </template>
      </el-table-column>
      <el-table-column label="操作" class="td">
        <template scope="scope">
           <div class="btns">
             <el-button class="td-btn" type="primary" size="small" @click="addToArticle(scope.$index, scope.row)">添加到该帖子</el-button>
           </div>
          <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleImgCurrentChange" :page-size="20" :total="Atotal" style="float:right;">
      </el-pagination>
    </el-col>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click.native="this.imgsFormVisible=false">确定</el-button> -->
      <!-- <el-button type="primary" @click.native="addToArticle">添加图片</el-button> -->
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
  bindPosts,
  delImgKeywords,
  getkeywordList,
  addImgKeywords,
  editUser,
  getpostsList,
  addUser
} from '../../api/api';

export default {
  data() {
    return {
      filters: {
        key: '',
        categoryId: '',
      },
      filter: {
        key: '',
        categoryId: '',
        keywordId: ''
      },
      keywords: [],
      articles: [],
      keyword: [],
      flag: false,
      label: '',
      previewUrl: '',
      keywordFormVisible: false,
      addKeywordFormVisible: false,
      previewVisible: false,
      imgsFormVisible: false,
      fileList: [],
      options: [],
      users: [],
      lists: [],
      total: 0,
      Atotal: 0,
      Apage: 1,
      page: 1,
      judgeFormVisible: false,
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
      },
      keywordForm: {
        id: '',
        keyword: ''
      },
      addKeywordForm: {
        id: '',
        keywordId: ''
      },
      articleForm: {
        id: ''
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
    handleImgCurrentChange(val) {
      this.Apage = val;
      this.getArticle();
    },
    handleKeyword: function(index, row) {
      this.keywordFormVisible = true;
      // this.keywordForm.keyword = this.keyword;
      if (row.keyword.length) {
        this.keyword = row.keyword;
      }
      this.keywordForm.id = row.id;
      this.addKeywordForm = row;
    },
    changeList(val) {
      this.filters.categoryId = val;
    },
    changeAList(val) {
      this.filter.categoryId = val;
    },
    changeKeyword(val) {
      this.filter.keywordId = val;
    },
    fileSubmit(val) {
      this.addFormVisible = false;
      this.fileList = [];
      this.getUsers();
    },
    getArticle() {
      let para = {
        page: this.Apage,
        categoryId: this.filter.categoryId,
        key: this.filter.key,
        keywordId: this.filter.keywordId
      };
      //NProgress.start();
      getpostsList(para).then((res) => {
        this.Atotal = parseInt(res.data.message.total);
        this.lists = res.data.message.data;
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
      getImageList(para).then((res) => {
        this.total = parseInt(res.data.message.total);
        this.users = res.data.message.data;
        this.listLoading = false;
        //NProgress.done();
      });
    },
    addArticle: function(index, row) {
      this.imgsFormVisible = true;

      this.articleForm.id = row.id;
      this.getArticle();
    },
    addToArticle: function(index, row) {
      let para = {
        id: this.articleForm.id,
        postsId: row.id
      }

      bindPosts(para).then((res) => {
        // this.addKeywordFormVisible = false;
        // this.keyword.push(obj);
        //NProgress.done();
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        // this.getUsers();
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
        var all = {
          id: '',
          name: '所有'
        };
        this.options.unshift(all);
        this.listLoading = false;
        this.flag = false;
        //NProgress.done();
      });
      getkeywordList().then((res) => {
        //this.total = res.data.total;
        this.keywords = res.data.message;
        // this.listLoading = false;
        //NProgress.done();
      });
    },
    handleJudge: function(index, row) {
      console.log(row);
      this.judgeFormVisible = true;
      this.judgeForm.id = Object.assign({}, row).id;
      this.judgeForm.status = Object.assign({}, row).status;
    },
    keywordClose: function() {
      this.keywordFormVisible = false;
      this.getUsers();
    },
    isVisible: function(val) {
      if (!val) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    },
    handleEditCategory: function(val, index, row) {
      console.log(val);
      if (!this.flag) {
        // this.flag = true;
        return;
      }
      let para = {};
      console.log(row);
      para.id = row.id;
      para.categoryId = val;
      updateImgCat(para).then((res) => {
        this.flag = false;
        //NProgress.done();
        this.$message({
          message: '提交成功',
          type: 'success'
        });
        // this.getUsers();
      });
    },
    addKeywordShow: function() {
      this.addKeywordFormVisible = true;
    },
    selectGet(val) {
      let obj = {};
      obj = this.keywords.find((item) => {
        return item.id === val;
      });
      this.label = obj.name;
    },
    handleAddKeyword: function() {
      let para = Object.assign({}, this.addKeywordForm);
      let name = this.label;
      let res = {
        id: para.id,
        keywordId: para.keywords,
        name: name
      };
      let obj = {
        id: para.keywords,
        name: name
      }

      addImgKeywords(res).then((res) => {
        this.addKeywordFormVisible = false;
        this.keyword.push(obj);
        //NProgress.done();
        this.$message({
          message: '添加成功',
          type: 'success'
        });
        // this.getUsers();
      });
    },
    preview: function(val) {
      this.previewVisible = true;
      this.previewUrl = val;
    },
    delKeyword: function(val) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        let para = {
          id: this.keywordForm.id,
          keywordId: val
        };
        delImgKeywords(para).then((res) => {
          var arr = this.keyword;
          for (var i in arr) {
            if (arr[i].id == para.keywordId) {
              arr.splice(i, 1);
            }
          }
          //NProgress.done();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        });
      }).catch(() => {

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
.btns {
  text-align: center;
}

.td-btn {
  margin: 0 auto;
  margin-bottom: 5px;
}

.preview-img {
  width: 90px;
}

.keyword-li {
  list-style: none;
  float: left;
  margin-right: 3px;
}
</style>
