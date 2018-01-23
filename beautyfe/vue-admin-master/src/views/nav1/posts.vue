<template>
<section>
  <!--工具条-->
  <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-select v-model="filters.categoryId" placeholder="请选择类别" @change="changeList">
          <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="关键字" v-model="filters.key"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="filters.keywordId" placeholder="请选择关键字" @change="changeKeyword">
          <el-option v-for="item in keywords" :key="item.value" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
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
    <!--<<el-table-column type="selection" width="55">
    </el-table-column>

    <el-table-column prop="category_id" label="类别id" sortable>
    </el-table-column>-->
    <el-table-column prop="id" label="id" sortable>
    </el-table-column>
    <el-table-column prop="status" label="状态" :formatter="formatStatus" sortable>
    </el-table-column>
    <el-table-column prop="title" label="标题" sortable>
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
    <el-table-column prop="description" label="描述" sortable>
    </el-table-column>
    <el-table-column prop="rank" label="帖子权重" sortable>
      <template slot-scope="scope">
         <el-input v-model="scope.row.rank"  placeholder="请输入内容" @blur="handleEditRank($event,scope.$index, scope.row)"></el-input>
     </template>
    </el-table-column>
    <el-table-column prop="category_name" label="类别名称" sortable>
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
    <el-table-column prop="icon_image" label="封面图片" sortable>
      <template slot-scope="scope">
        <img class="preview-img"  v-if="scope.row.icon_image" v-model="scope.row.icon_image.ref_url" :src="scope.row.icon_image.ref_url" @click="preview(scope.row.icon_image.ref_url)">
       </template>
    </el-table-column>
    <el-table-column label="操作" width="200px">
      <template scope="scope">
					<el-button class="td-btn" size="small" @click="handleEdit(scope.$index, scope.row)">编辑帖子</el-button>
					<el-button class="td-btn" type="primary" size="small" @click="handleJudge(scope.$index, scope.row)">审核</el-button>
          <!--<el-button type="warning" size="small" @click="handleCategory(scope.$index, scope.row)">编辑帖子类别</el-button>-->
          <el-button class="td-btn" type="warning" size="small" @click="handleKeyword(scope.$index, scope.row)">编辑帖子关键字</el-button>
          <el-button class="td-btn" type="success" size="small" @click="handleImg(scope.$index, scope.row)">编辑帖子图片</el-button>
				</template>
    </el-table-column>
  </el-table>

  <!--工具条-->
  <el-col :span="24" class="toolbar">
    <!--  <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
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

  <!--编辑帖子图片-->
  <el-dialog title="编辑" v-model="imgsFormVisible" :close-on-click-modal="false">
    <el-table :data="imgs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
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
      <el-table-column label="操作" class="td">
        <template scope="scope">
           <div class="btns">
             <el-button class="td-btn" type="primary" size="small" @click="delImgs(scope.$index, scope.row)">删除</el-button>
             <el-button size="small" @click="addMain(scope.$index, scope.row)">设为封面</el-button>
           </div>
 					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
 				</template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
      <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
      <el-pagination layout="prev, pager, next" @current-change="handleImgCurrentChange" :page-size="20" :total="imgTotal" style="float:right;">
      </el-pagination>
    </el-col>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="imgsClose">确定</el-button>
      <el-button type="primary" @click.native="addImgShow">添加图片</el-button>
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

  <!--新增界面-->
  <el-dialog title="新增" v-model="addImgVisible" :close-on-click-modal="false">
    <el-upload class="upload-demo" action="//47.97.167.88/image/upload" :data="uploadData" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :on-success="fileSuccess" list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addImgVisible = false">取消</el-button>
      <el-button type="primary" @click.native="fileSubmit">确定</el-button>
    </div>
  </el-dialog>
</section>
</template>


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
  updateRank,
  delKeywords,
  addKeywords,
  getkeywordList,
  getPostImgs,
  deleteImg,
  addIcon,
  addImg
} from '../../api/api';

export default {
  data() {
    return {
      filters: {
        key: '',
        categoryId: '',
        keywordId: ''
      },
      imgs: [],
      keywords: [],
      keyword: [],
      flag: false,
      addImgVisible: false,
      label: '',
      flag1: false,
      options: [],
      users: [],
      total: 0,
      imgTotal: 0,
      page: 1,
      imgPage: 1,
      rowData: '',
      listLoading: false,
      sels: [], //列表选中列
      radio: '0',
      previewVisible: false,
      previewUrl: '',
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
      addimgsFormVisible: false,
      imgsFormVisible: false,
      keywordFormVisible: false,
      categoryFormVisible: false,
      judgeFormVisible: false,
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addKeywordFormVisible: false,
      imgCatId: '',
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
      },
      keywordForm: {
        id: '',
        keyword: ''
      },
      imgsForm: {
        id: '',
        imageId: ''
      },
      addKeywordForm: {
        id: '',
        keywordId: ''
      },
      uploadData: {
        postsId: ''
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
    },
    changeCategory(val) {
      this.categoryForm.categoryId = val;
    },
    changeKeyword(val) {
      this.filters.keywordId = val;
    },
    changeList(val) {
      this.filters.categoryId = val;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    handleImgCurrentChange(val) {
      this.imgPage = val;
      this.getListImg(this.imgCatId);
    },
    selectGet(val) {
      let obj = {};
      obj = this.keywords.find((item) => {
        return item.id === val;
      });
      this.label = obj.name;
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
        //NProgress.done();
      });
      getkeywordList().then((res) => {
        //this.total = res.data.total;
        this.keywords = res.data.message;
        var all = {
          id: '',
          name: '所有'
        };
        this.keywords.unshift(all);
        // this.listLoading = false;
        //NProgress.done();
      });
    },
    getListImg(val) {
      let para = {
        page: this.imgPage,
        id: val
      };
      getPostImgs(para).then((res) => {
        this.imgTotal = parseInt(res.data.message.total);
        this.imgs = res.data.message.data;
        // this.listLoading = false;
        //NProgress.done();
      });
    },
    //获取用户列表
    getUsers() {
      let para = {
        page: this.page,
        categoryId: this.filters.categoryId,
        key: this.filters.key,
        keywordId: this.filters.keywordId
      };
      this.listLoading = true;
      //NProgress.start();
      getpostsList(para).then((res) => {
        this.flag = false;
        this.total = parseInt(res.data.message.total);
        this.users = res.data.message.data;
        this.listLoading = false;
        //NProgress.done();
      });
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
      categoryPost(para).then((res) => {
        //NProgress.done();
        this.$message({
          message: '提交成功',
          type: 'success'
        });
        // this.getUsers();
      });
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

      addKeywords(res).then((res) => {
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
    handleEditRank: function(e, index, row) {
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
    addMain: function(index, row) {
      let para = {
        id: this.imgsForm.id,
        imageId: row.id
      };
      addIcon(para).then((res) => {
        //NProgress.done();
        this.$message({
          message: '设置成功',
          type: 'success'
        });
      });

    },
    delImgs: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        let para = {
          id: this.imgsForm.id,
          imageId: row.id
        };
        deleteImg(para).then((res) => {
          var arr = this.imgs;
          for (var i in arr) {
            if (arr[i].id == para.imageId) {
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
    delKeyword: function(val) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        let para = {
          id: this.keywordForm.id,
          keywordId: val
        };
        delKeywords(para).then((res) => {
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
    keywordClose: function() {
      this.keywordFormVisible = false;
      this.getUsers();
    },
    imgsClose: function() {
      this.imgsFormVisible = false;
      this.getUsers();
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
    addKeywordShow: function() {
      this.addKeywordFormVisible = true;
    },
    addImgShow: function() {
      this.addImgVisible = true;
    },
    handleCategory: function(index, row) {
      console.log(row);
      this.categoryFormVisible = true;
      this.categoryForm.id = Object.assign({}, row).id;
      this.categoryForm.category_name = Object.assign({}, row).category_name;
      this.categoryForm.categoryId = Object.assign({}, row).category_id;
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
    handleImg: function(index, row) {
      this.getListImg(row.id);
      this.imgCatId = row.id;
      this.imgsFormVisible = true;
      // this.keywordForm.keyword = this.keyword;

      // this.imgs = row.images;
      this.imgsForm.id = row.id;
      this.uploadData.postsId = row.id;
      // this.addKeywordForm = row;
    },
    preview: function(val) {
      this.previewVisible = true;
      this.previewUrl = val;
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
    fileSubmit(val) {
      this.addImgVisible = false;
      this.fileList = [];
      this.getUsers();
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
.btns {
  text-align: center;
}

.td-btn {
  margin: 0 auto;
  margin-bottom: 5px;
}

.img-li {
  display: inline-block;
  width: 50%;
}

.img-li img {
  width: 100%;
}

.img-ul {
  font-size: 0;
}

.keyword-li {
  list-style: none;
  float: left;
  margin-right: 3px;
}

.preview-img {
  width: 90px;
}
</style>
