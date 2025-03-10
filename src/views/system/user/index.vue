<template>
  <div class="koi-flex">
    <KoiCard>
      <!-- 搜索条件 -->
      <el-form v-show="showSearch" :inline="true">
        <el-form-item label="登录账号" prop="username">
          <el-input
            placeholder="请输入登录账号"
            v-model="searchParams.username"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="nickname">
          <el-input
            placeholder="请输入用户名称"
            v-model="searchParams.nickname"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleListPage"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="search" plain v-debounce="handleSearch">搜索</el-button>
          <el-button type="danger" icon="refresh" plain v-throttle="resetSearch">重置</el-button>
          <el-button type="primary" icon="plus" plain @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>

      

      <br />
      <!-- 数据表格 :data="tableList" -->
      <el-table
        v-loading="loading"
        border
        :data="tableList"
        empty-text="暂时没有数据哟🌻"
      >
        <el-table-column label="序号" prop="userId" width="80px" align="center" type="index"></el-table-column>
        <el-table-column
          label="用户名"
          prop="username"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="头像" prop="avatar" width="80px" align="center">
          <template #default="scope">
            <div class="flex justify-center">
              <el-image
                class="rounded-full w-36px h-36px"
                :preview-teleported="true"
                :preview-src-list="[scope.row.avatar]"
                :src="
                  scope.row.avatar != null && scope.row.avatar != ''
                    ? scope.row.avatar
                    : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                "
              >
                <template #error>
                  <el-icon class="c-[--el-color-primary]" :size="36">
                    <CircleCloseFilled />
                  </el-icon>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="用户昵称"
          prop="nickname"
          width="120px"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="邮箱" prop="email" width="220px" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="手机号" prop="phone" width="150px" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="注册IP" prop="registerIp" width="150px" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="用户性别" prop="sex" width="100px" align="center">
          <template #default="scope">
            <KoiTag :tagOptions="userSexOptions" :value="scope.row.sex"></KoiTag>
          </template>
        </el-table-column>
        <!-- 注意：如果后端数据返回的是字符串"0" OR "1"，这里的active-value AND inactive-value不需要加冒号，会认为是字符串，否则：后端返回是0 AND 1数字，则需要添加冒号 -->
        
        <el-table-column label="创建时间" prop="createTime" width="180px" align="center"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime" width="180px" align="center"></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="150"
          fixed="right"
          v-auth="['system:role:update', 'system:role:delete']"
        >
          <template #default="{ row }">
            <el-tooltip content="修改🌻" placement="top">
              <el-button
                type="primary"
                icon="Edit"
                circle
                plain
                @click="handleUpdate(row)"
                v-auth="['system:role:update']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色🌻" placement="top">
              <el-button
                color="#626aef" 
                icon="User"
                circle
                plain 
                @click="handleAssignRoles()"
                v-auth="['system:role:update']"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除🌻" placement="top">
              <el-button
                type="danger"
                icon="Delete"
                circle
                plain
                @click="handleDelete(row)"
                v-auth="['system:role:delete']"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <br />
      <!-- {{ searchParams.pageNo }} --- {{ searchParams.pageSize }} -->
      <!-- 分页 -->
      <el-pagination
        background
        v-model:current-page="searchParams.currentPage"
        v-model:page-size="searchParams.pageSize"
        v-show="total > 0"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleListPage"
        @current-change="handleListPage"
      />

      <!-- 添加 OR 修改 -->
      <KoiDrawer
        ref="koiDrawerRef"
        :title="title"
        @koiConfirm="handleConfirm"
        @koiCancel="handleCancel"
        :loading="confirmLoading"
      >
        <template #content>
          <el-form ref="formRef" v-loading="loading" :model="form" label-width="80px" status-icon>
            <el-row>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="form.username" disabled/>
                </el-form-item>
              </el-col>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="用户昵称" prop="userNickName">
                  <el-input v-model="form.nickname" placeholder="请输入用户昵称" clearable/>
                </el-form-item>
              </el-col>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="用户邮箱" prop="userEmail">
                  <el-input v-model="form.email" placeholder="请输入用户email" clearable />
                </el-form-item>
              </el-col>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="用户性别" prop="sex">
                  <el-radio-group v-model="form.sex">
                    <el-radio v-for="item in userSexOptions" :key="item.dictValue" :label="Number(item.dictValue)" >
                      {{ item.dictLabel }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="用户头像" prop="avatar">
                  <KoiUploadImage v-model:imageUrl="form.avatar">
                    <template #content>
                      <el-icon><Avatar /></el-icon>
                      <span>请上传头像</span>
                    </template>
                    <template #tip>图片最大为 3M</template>
                  </KoiUploadImage>
                  <!-- <el-input v-model="form.avatar" placeholder="请输入用户头像地址" clearable /> -->
                </el-form-item>
              </el-col>
              
              
            </el-row>
          </el-form>
         
        </template>
      </KoiDrawer>
      <KoiDrawer
        ref="addDrawerRef"
        :title="title"
        @koiConfirm="handleAddConfirm"
        @koiCancel="handleCancel"
        :loading="confirmLoading"
      >
        <template #content>
          <el-form ref="formRef" v-loading="loading" :model="form" label-width="80px" status-icon 
          :rules="rules">
            <el-row>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="form.username"/>
                </el-form-item>
              </el-col>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="用户昵称" prop="userNickName">
                  <el-input v-model="form.nickname" placeholder="请输入用户昵称" clearable/>
                </el-form-item>
              </el-col>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="用户邮箱" prop="userEmail">
                  <el-input v-model="form.email" placeholder="请输入用户email" clearable />
                </el-form-item>
              </el-col>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="用户性别" prop="sex">
                  <el-radio-group v-model="form.sex">
                    <el-radio v-for="item in userSexOptions" :key="item.dictValue" :label="Number(item.dictValue)" >
                      {{ item.dictLabel }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :xs="{ span: 24 }" :sm="{ span: 24 }">
                <el-form-item label="用户头像" prop="avatar">
                  <KoiUploadImage v-model:imageUrl="form.avatar">
                    <template #content>
                      <el-icon><Avatar /></el-icon>
                      <span>请上传头像</span>
                    </template>
                    <template #tip>图片最大为 3M</template>
                  </KoiUploadImage>
                  <!-- <el-input v-model="form.avatar" placeholder="请输入用户头像地址" clearable /> -->
                </el-form-item>
              </el-col>
              
              
            </el-row>
          </el-form>
         
        </template>
      </KoiDrawer>

      <KoiDialog ref="koiDialogRef" title="分配角色" :height="450" :loading="confirmLoading" :footerHidden="true">
        <template #content>
          <div class="flex flex-justify-center">
            <el-transfer
              :props="{
                key: 'value',
                label: 'label'
              }"
              :titles="['角色列表', '拥有角色']"
              target-order="original"
              filterable
              filter-placeholder="关键字搜索"
              :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
              }"
              v-model="transferRightList"
              :data="transferLeftList"
              @change="handleTransferChange"
            />
          </div>
        </template>
      </KoiDialog>
    </KoiCard>
  </div>
</template>

<script setup lang="ts" name="userPage">
// 已使用字典案例
import { nextTick, ref, onMounted, reactive } from "vue";
// @ts-ignore
import {
  koiMsgSuccess,
  koiNoticeSuccess,
  koiNoticeError,
  koiMsgError,
  koiMsgWarning,
  koiMsgBox,
} from "@/utils/koi.ts";
// @ts-ignore
import { listPage, getById, add, update, deleteById, batchDelete, updateStatus, getUserInfo } from "@/api/system/user/index.ts";
import { listNormalRole, assignUserRole } from "@/api/system/role/index.ts";
// @ts-ignore
import { listDataByType } from "@/api/system/dict/data/index.ts";
import { koiDatePicker } from "@/utils/index.ts";

// 数据表格加载页面动画
const loading = ref(false);
/** 是否显示搜索表单 */
const showSearch = ref<boolean>(true); // 默认显示搜索条件
// 数据表格数据
const tableList = ref<any>([]);

// 查询参数
const searchParams = ref({
  currentPage: 1, // 第几页
  pageSize: 20, // 每页显示多少条
  username: "",
  nickname: "",
  phone: ""
});

const total = ref<number>(0);
/** 表单规则 */
const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }]
});

// 重置搜索参数
const resetSearchParams = () => {
  searchParams.value = {
    currentPage: 1,
    pageSize: 20,
    username: "",
    nickname: "",
    phone: ""
  };
  dateRange.value = [];
};

/** 搜索 */
const handleSearch = () => {
  console.log("搜索");
  searchParams.value.currentPage = 1;
  handleListPage();
};

/** 重置 */
const resetSearch = () => {
  console.log("重置搜索");
  resetSearchParams();
  handleListPage();
};

// 时间
const dateRange = ref();
/** @current-change：点击分页组件页码发生变化：例如：切换第2、3页 OR 上一页 AND 下一页 OR 跳转某一页 */
/** @size-change：点击分页组件下拉选中条数发生变化：例如：选择10条/页、20条/页等 */
// 分页查询，@current-change AND @size-change都会触发分页，调用后端分页接口
/** 数据表格 */
const handleListPage = async () => {
  try {
    loading.value = true;
    tableList.value = []; // 重置表格数据
    const res: any = await listPage(
      koiDatePicker(searchParams.value, dateRange.value)
    );
    console.log("用户数据表格数据->", res.data);
    tableList.value = res.data.records;
    total.value = res.data.total;
    loading.value = false;
  } catch (error) {
    console.log(error);
    koiNoticeError("数据查询失败，请刷新重试🌻");
  }
};

// 静态页面防止报错(可直接删除)
// @ts-ignore
const handleStaticPage = () => {
  listPage(koiDatePicker(searchParams.value, dateRange.value));
};

/** 数据表格[删除、批量删除等刷新使用] */
const handleTableData = async () => {
  try {
    const res: any = await listPage(koiDatePicker(searchParams.value, dateRange.value));
    // console.log("用户数据表格数据->", res.data);
    tableList.value = res.data.records;
    total.value = res.data.total;
  } catch (error) {
    console.log(error);
    koiNoticeError("数据查询失败，请刷新重试🌻");
  }
};

onMounted(() => {
  // 获取数据表格数据
  handleListPage();
  handleDict1();
  handleDict2();
});

// 翻译数据[用户类型]
const userTypeOptions = ref();
/** 字典翻译tag */
const handleDict1 = async () => {
  try {
    userTypeOptions.value = [
      {
        dictLabel: "系统用户",
        dictValue: "1",
        dictTag: "primary",
        dictColor: ""
      },
      {
        dictLabel: "注册用户",
        dictValue: "2",
        dictTag: "warning",
        dictColor: ""
      }
    ];
    // const res: any = await listDataByType("sys_user_type");
    // console.log("字典数据", res.data);
    // userTypeOptions.value = res.data;
  } catch (error) {
    console.log(error);
    koiMsgError("数据字典查询失败，请刷新重试🌻");
  }
};

// 翻译数据[用户性别]
const userSexOptions = ref([
      { dictLabel: "男", dictValue: "1", dictTag: "primary", dictColor: "" },
      { dictLabel: "女", dictValue: "2", dictTag: "danger", dictColor: "" },
      { dictLabel: "未知", dictValue: "3", dictTag: "info", dictColor: "" }
    ]);
/** 字典翻译tag */
const handleDict2 = async () => {
  try {
    userSexOptions.value = [
      { dictLabel: "男", dictValue: "1", dictTag: "primary", dictColor: "" },
      { dictLabel: "女", dictValue: "2", dictTag: "danger", dictColor: "" },
      { dictLabel: "未知", dictValue: "3", dictTag: "info", dictColor: "" }
    ];
    // const res: any = await listDataByType("sys_user_sex");
    // console.log("字典数据", res.data);
    // userSexOptions.value = res.data;
  } catch (error) {
    console.log(error);
    koiMsgError("数据字典查询失败，请刷新重试🌻");
  }
};

const single = ref<boolean>(true); // 非单个禁用

/** 添加 */
const handleAdd = () => {
  // 打开弹出框
  addDrawerRef.value.koiOpen();
  koiMsgSuccess("添加🌻");
  // 重置表单
  resetForm();
  // 标题
  title.value = "用户添加";
};

/** 回显数据 */
const handleEcho = async (username: any) => {
  console.log("回显数据username", username);
  if (username == null || username == "") {
    koiMsgWarning("请选择需要修改的数据🌻");
    return;
  }
  try {
    const res: any = await getUserInfo({ username });
    console.log(res.data);
    form.value = res.data;
  } catch (error) {
    koiNoticeError("数据获取失败，请刷新重试🌻");
    console.log(error);
  }
};

/** 修改 */
const handleUpdate = async (row?: any) => {
  // 打开弹出框
  koiDrawerRef.value.koiOpen();
  koiMsgSuccess("修改🌻");
  // 标题
  loading.value = true;
  title.value = "用户修改";
  const username = row.username;
  if (username == null || username == "") {
    koiMsgError("请选中需要修改的数据🌻");
  }
  console.log(username);
  // 回显数据
  handleEcho(username);
  loading.value = false;
};

/** 修改抽屉 */
const koiDrawerRef = ref();
/** 增加 */
const addDrawerRef = ref();
// 标题
const title = ref("用户类型管理");
// form表单Ref
const formRef = ref<any>();

// form表单
let form = ref<any>({
  nickname: "",
  avatar: "",
  email: "",
  phone: "",
  sex: ""
});

/** 清空表单数据 */
const resetForm = () => {
  // 等待 DOM 更新完成
  nextTick(() => {
    if (formRef.value) {
      // 重置该表单项，将其值重置为初始值，并移除校验结果
      formRef.value.resetFields();
    }
  });     
  form.value = {
    nickname: "",
    avatar: "",
    email: "",
    phone: "",
    sex: ""
  };
};

/** 表单规则 */

// 确定按钮是否显示loading
const confirmLoading = ref(false);
/** 确定  */
const handleConfirm = () => {
  if (!formRef.value) return;
  confirmLoading.value = true;
  (formRef.value as any).validate(async (valid: any) => {
    if (valid) {
      console.log("表单ID", form.value.username);
      if (form.value.username != null && form.value.username != "") {
        try {
          await update(form.value);
          koiNoticeSuccess("修改成功🌻");
          confirmLoading.value = false;
          koiDrawerRef.value.koiQuickClose();
          resetForm();
          handleListPage();
        } catch (error) {
          console.log(error);
          confirmLoading.value = false;
          koiNoticeError("修改失败，请刷新重试🌻");
        }
      } else {
        try {
          await add(form.value);
          koiNoticeSuccess("添加成功🌻");
          confirmLoading.value = false;
          koiDrawerRef.value.koiQuickClose();
          resetForm();
          handleListPage();
        } catch (error) {
          console.log(error);
          confirmLoading.value = false;
          koiNoticeError("添加失败，请刷新重试🌻");
        }
      }
    } else {
      koiMsgError("验证失败，请检查填写内容🌻");
      confirmLoading.value = false;
    }
  });
};
const handleAddConfirm = () => {
  if (!formRef.value) return;
  confirmLoading.value = true;
  (formRef.value as any).validate(async (valid: any) => {
    if (valid) {
      try {
          await add(form.value);
          koiNoticeSuccess("添加成功🌻");
          confirmLoading.value = false;
          koiDrawerRef.value.koiQuickClose();
          resetForm();
          handleListPage();
        } catch (error) {
          console.log(error);
          confirmLoading.value = false;
          koiNoticeError("添加失败，请刷新重试🌻");
        }
    }else {
      koiMsgError("验证失败，请检查填写内容🌻");
      confirmLoading.value = false;
    }
  });

};

/** 取消 */
const handleCancel = () => {
  koiDrawerRef.value.koiClose();
};


// 分配角色弹出框
const koiDialogRef = ref();
/** 分配角色 */
const handleAssignRoles = async () => {
  try {
    // 传递当前登录用户ID
    const res: any = await listNormalRole(1);
    transferLeftList.value = res.data.data1; // 左侧所有数据，右边出现一样的会自动进行去除
    transferRightList.value = res.data.data2;
  } catch (error) {
    console.log(error);
    koiMsgError("加载角色数据失败");
  }
  koiDialogRef.value.koiOpen();
};
// 右侧选中数据，必须是['1']数据
const transferRightList = ref(["1"]);
const transferLeftList = ref<any>([
  {
    label: "王者农药",
    value: "1"
  },
  {
    label: "QQ飞车",
    value: "2"
  },
  {
    label: "举例数据",
    value: "3"
  },
  {
    label: "三国杀",
    value: "4"
  },
  {
    label: "和平精英",
    value: "5"
  },
  {
    label: "刺激战场",
    value: "6"
  }
]);

// 右侧列表元素变化时触发
const handleTransferChange = async (value: any) => {
  console.log(value);
  try {
    await assignUserRole(value);
    koiNoticeSuccess("分配角色成功🌻");
  } catch (error) {
    console.log(error);
    handleAssignRoles();
    koiMsgError("分配角色失败，请重试");
  }
};

/** 删除 */
const handleDelete = (row: any) => {
  const id = row.userId;
  if (id == null || id == "") {
    koiMsgWarning("请选中需要删除的数据🌻");
    return;
  }
  koiMsgBox("您确认需要删除用户名称[" + row.userNickName + "]么？")
    .then(async () => {
      try {
        await deleteById(id);
        handleTableData();
        koiNoticeSuccess("删除成功🌻");
      } catch (error) {
        console.log(error);
        handleTableData();
        koiNoticeError("删除失败，请刷新重试🌻");
      }
    })
    .catch(() => {
      koiMsgError("已取消🌻");
    });
};
</script>

<style lang="scss" scoped>
// 穿梭框高度调整
:deep(.el-transfer-panel__body) {
  height: 400px;
}
</style>
