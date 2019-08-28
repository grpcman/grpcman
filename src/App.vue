<template>
  <div>
    <el-row>
      <el-button type="primary" @click="createSimpleTask">创建简单任务</el-button>
      <el-button type="success" @click="createCompositeTask">创建复合任务</el-button>
      <el-button type="info" @click="copyCurrentTask">复制当前任务</el-button>
      <el-button type="warning" @click="deleteCurrentTask">删除当前任务</el-button>
      <el-button type="danger" @click="deleteAllTasks">删除所有任务</el-button>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab">
        <el-tab-pane
          :key="item.name"
          :label="item.title"
          :name="item.name"
          v-for="(item) in editableTabs"
        >
          <el-form v-if="item.isSimple" ref="form" :model="form">
            <el-form-item label="日志">
              <el-input type="textarea" :rows="10" v-model="item.log1" style="width: 99%"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="文件">
                  <el-upload
                    :auto-upload="false"
                    :on-change="elInFile"
                    accept=".proto"
                    action
                    class="upload-demo"
                    ref="upload"
                  >
                    <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
                    <i slot="tip" class="el-upload__tip el-icon-info">只能选取proto文件，包名必须是proto</i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="地址">
                  <el-input v-model="item.address" style="width: 99%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务和协议">
                  <el-cascader
                    :options="item.options"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChange"
                    style="width: 99%"
                    v-model="item.value"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="线程">
                  <el-input v-model="item.task" type="number" style="width: 99%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="循环">
                  <el-input v-model="item.loop" type="number" style="width: 99%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="超时">
                  <el-input v-model="item.timeout" type="number" style="width: 99%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="异步">
              <el-switch v-model="item.delivery" style="width: 99%"></el-switch>
            </el-form-item>
            <el-form-item label="参数">
              <el-input type="textarea" :rows="2" v-model="item.param" style="width: 99%"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSimpleStart">开始测试</el-button>
              <el-button type="danger" @click="onSimpleEnd">停止测试</el-button>
            </el-form-item>
          </el-form>
          <el-form v-if="!item.isSimple" ref="form" :model="form">
            <el-form-item label="日志">
              <el-input type="textarea" :rows="10" v-model="item.log2"></el-input>
            </el-form-item>
            <el-col :span="12">
              <el-form-item label="任务">
                <el-input type="textarea" :rows="10" v-model="item.list"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="onCompositeStart">开始测试</el-button>
                <el-button type="danger" @click="onCompositeEnd">停止测试</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-dialog title="创建新任务" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="任务名称" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTask">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");
export default {
  data() {
    return {
      //当前激活的窗口
      activeName: "first",
      //当前激活的窗口的索引
      editableTabsValue: "1",
      //自带的两个tab的内容
      editableTabs: [
        {
          title: "这是简单任务标题",  //任务的名称，tab的名称
          name: "1",  //任务的索引
          isSimple: true, //是否简单任务
          delivery: false, //是否异步
          log1: "这是简单任务的日志", //这是有序列表，存放日志
          value: "",  //级联选择器的已选内容
          options: [],  //级联选择器的选项
          task: 1, //多线程
          loop: 1, //循环次数
          timeout: 10000, //超时时间
          param:{ userName: 'robot2', password: 'cc3e7bb5ad6f13c65f0bb97da5c35f7c' }, //请求参数
          address: "localhost:50301", //任务的端口
          isTesting: false, //任务是否正在进行
          client: null  //gRPC的client，用来调用rpc
        },
        {
          title: "这是复杂任务标题",  //任务的名称，tab的名称
          name: "2",  //任务的索引
          isSimple: false, //是否简单任务
          log2: "这是复杂任务日志", //存放复合任务的日志
          list: "", //这是任务列表
          isTesting: false  //任务是否正在进行
        }
      ],
      tabIndex: 2, //这是标签的索引
      form: {
        title: "" //这是新建标签时填写的名字
      },
      formLabelWidth: "120px",  //表单名字的宽度
      dialogFormVisible: false, //创建新任务表单的开启状态
      isSimple: true, //是否简单任务
      proto: null,  //proto
    };
  },
  created: async function() {},
  methods: {
    createTask() {
      let newTabName = ++this.tabIndex + "";
      //判断是否为简单任务
      if (this.isSimple) {
        //创建简单任务
        this.editableTabs.push({
          title: this.form.title, //任务的名称，tab的名称
          name: newTabName, //任务的索引
          isSimple: true, //是否简单任务
          delivery: false, //是否异步
          log1: "这是简单任务的日志", //这是有序列表，存放日志
          value: "",
          options: [],
          task: 1, //多线程
          loop: 1, //循环次数
          timeout: 10000, //超时时间
          param: { userName: 'robot2', password: 'cc3e7bb5ad6f13c65f0bb97da5c35f7c' }, //请求参数
          address: "localhost:50301", //任务的端口
          isTesting: false, //任务是否正在进行
          client: null  //gRPC的client，用来调用rpc
        });
      } else {
        //创建复合任务
        this.editableTabs.push({
          title: this.form.title,
          name: newTabName,
          isSimple: this.isSimple
        });
      }
      this.editableTabsValue = newTabName;
      this.dialogFormVisible = false;
    },
    createSimpleTask() {
      //创建简单任务
      this.isSimple = true;
      this.dialogFormVisible = true;
      // this.editableTabs[0].log1 += "\n创建简单任务";
    },
    createCompositeTask() {
      //创建组合任务
      this.isSimple = false;
      this.dialogFormVisible = true;
      // this.editableTabs[0].log1 += "\n创建复合任务";
    },
    copyCurrentTask() {
      //复制当前任务
      let newTabName = ++this.tabIndex + "";
      let data={...this.editableTabs[this.editableTabsValue - 1]};
      data.name=newTabName;
      this.editableTabs.push(data);
      this.editableTabsValue = newTabName;
    },
    deleteCurrentTask() {
      //删除当前任务
      this.removeTab(this.editableTabsValue);
    },
    deleteAllTasks() {
      //删除所有任务
      for (let i=this.editableTabs.length-1; i >=0; i--) {
        this.removeTab(this.editableTabs[i].name);
      }
    },
    removeTab(targetName) {
      //删除tab
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    async onSimpleStart() {
      //简单任务的开始
      // eslint-disable-next-line no-console
      console.log(this.editableTabsValue - 1);
      this.editableTabs[this.editableTabsValue - 1].istesting = true;
      for (let i = 0; i < this.editableTabs[this.editableTabsValue - 1].loop; i++) {
        // eslint-disable-next-line no-console
        console.log(this.editableTabs[this.editableTabsValue - 1].client);
        // eslint-disable-next-line no-console
        console.log(this.editableTabs[this.editableTabsValue - 1].value[1]);
        // eslint-disable-next-line no-console
        console.log(this.editableTabs[this.editableTabsValue - 1].param);
        let res = await lib.grpcCall(this.editableTabs[this.editableTabsValue - 1].client, this.editableTabs[this.editableTabsValue - 1].value[1], this.editableTabs[this.editableTabsValue - 1].param, null)
        this.editableTabs[this.editableTabsValue - 1].log1 += "\n" + res;
      }
    },
    onSimpleEnd() {
      //简单任务的结束
      this.editableTabs[this.editableTabsValue - 1].istesting = false;
    },
    onCompositeStart() {
      //混合任务的开始
      this.editableTabs[this.editableTabsValue - 1].istesting = true;
    },
    onCompositeEnd() {
      //混合任务的开始
      this.editableTabs[this.editableTabsValue - 1].istesting = false;
    },
    // eslint-disable-next-line no-unused-vars
    elInFile(f, fs) {
      this.$message({
        message: '请先填写这个服务的地址，再选择服务中的协议，否则创建的client有错误！',
        type: 'warning'
      });
      //通过f获取到上传的文件
      let packageDefinition = protoLoader.loadSync(f.raw.path, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      });
      //获取proto文件中的所有service
      this.proto = grpc.loadPackageDefinition(packageDefinition).proto;
      let index = 0;
      //为级联选择器添加service
      for (let i in packageDefinition) {
        this.editableTabs[this.editableTabsValue - 1].options.push({
          label: i,
          value: i.split(".")[1],
          children: []
        });
        //为级联选择器添加rpc
        for (let j in packageDefinition[i]) {
          this.editableTabs[this.editableTabsValue - 1].options[index].children.push({
            label: j,
            value: j
          });
        }
        index++;
      }
    },
    handleChange(value) {
      this.editableTabs[this.editableTabsValue - 1].client = new this.proto[
        value[0]
      ](
        this.editableTabs[this.editableTabsValue - 1].address,
        grpc.credentials.createInsecure()
      );
    }
  }
};
</script>
