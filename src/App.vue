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
          v-for="(item) in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <el-form v-if="item.isSimple" ref="form" :model="form">
            <el-form-item label="日志">
              <el-input type="textarea" :rows="10" v-model="item.log1" style="width: 95%"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="文件">
                  <el-upload
                    :auto-upload="false"
                    :on-change="elInFile"
                    ref="upload"
                    class="upload-demo"
                    accept=".proto"
                    action
                  >
                    <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
                    <i slot="tip" class="el-upload__tip el-icon-info">只能选取proto文件，包名必须是proto</i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="服务和协议">
                  <el-cascader
                    v-model="item.value"
                    :options="item.options"
                    :props="{ expandTrigger: 'hover' }"
                    @change="handleChange"
                    style="width: 95%"
                  ></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="地址">
                  <el-input v-model="item.address" style="width: 95%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="线程">
                  <el-input v-model="item.task" type="number" style="width: 95%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="循环">
                  <el-input v-model="item.loop" type="number" style="width: 95%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="超时">
                  <el-input v-model="item.timeout" type="number" style="width: 95%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="异步">
              <el-switch v-model="item.delivery" style="width: 95%"></el-switch>
            </el-form-item>
            <el-form-item label="参数">
              <el-input type="textarea" :rows="2" v-model="item.param" style="width: 95%"></el-input>
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
      activeName: "first",
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "这是简单任务标题",
          name: "1",
          isSimple: true, //是否简单任务
          delivery: false, //是否异步
          log1: "这是简单任务的日志", //这是有序列表，存放日志
          value: "",
          options: [],
          task: 0, //多线程
          loop: 0, //循环次数
          timeout: 0, //超时时间
          param: "这是参数", //请求参数
          address: "localhost:50001",
          istesting: false,
          client: null
        },
        {
          title: "这是复杂任务标题",
          name: "2",
          isSimple: false, //是否简单任务
          log2: "这是复杂任务日志", //这是有序列表，存放日志
          list: "", //这是任务列表   这里是一个字符串，不是一个array
          istesting: false
        }
      ],
      tabIndex: 2, //这是标签的索引
      form: {
        title: "" //这是标签的名字
      },
      formLabelWidth: "120px",
      dialogFormVisible: false,
      isSimple: true,
      proto: null
    };
  },
  created: async function() {},
  methods: {
    createTask() {
      let newTabName = ++this.tabIndex + "";
      if (this.isSimple) {
        this.editableTabs.push({
          title: this.form.title,
          name: newTabName,
          isSimple: true, //是否简单任务
          delivery: false, //是否异步
          log1: "这是简单任务的日志", //这是有序列表，存放日志
          value: "",
          options: [],
          task: 0, //多线程
          loop: 0, //循环次数
          timeout: 0, //超时时间
          param: "这是参数", //请求参数
          address: "localhost:50001",
          istesting: false,
          client: null
        });
      } else {
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
      this.isSimple = true;
      this.dialogFormVisible = true;
      this.editableTabs[0].log1 += "\n创建简单任务";
    },
    createCompositeTask() {
      this.isSimple = false;
      this.dialogFormVisible = true;
      this.editableTabs[0].log1 += "\n创建复合任务";
    },
    copyCurrentTask() {
      this.editableTabs[0].log1 += "\n复制当前任务";
    },
    deleteCurrentTask() {
      // eslint-disable-next-line no-console
      console.log(this.editableTabsValue);
      this.removeTab(this.editableTabsValue);
      // this.editableTabs[0].log1 += "\n删除当前任务";
    },
    deleteAllTasks() {
      for (let i = 0; i < this.editableTabs.length; i++) {
        this.removeTab(i);
      }
      // this.editableTabs = [];
      // this.editableTabs[0].log1 += "\n删除所有任务";
    },
    removeTab(targetName) {
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
    onSimpleStart() {
      //简单任务的开始
      console.log(this.editableTabs[this.editableTabsValue - 1].istesting);
      this.editableTabs[this.editableTabsValue - 1].istesting = true;
      console.log(this.editableTabs[this.editableTabsValue - 1].istesting);
    },
    onSimpleEnd() {
      //简单任务的结束
      console.log(this.editableTabs[this.editableTabsValue - 1].istesting);
      this.editableTabs[this.editableTabsValue - 1].istesting = false;
      console.log(this.editableTabs[this.editableTabsValue - 1].istesting);
    },
    onCompositeStart() {
      //混合任务的开始
      this.editableTabs[this.editableTabsValue - 1].istesting = true;
    },
    onCompositeEnd() {
      //混合任务的开始
      this.editableTabs[this.editableTabsValue - 1].istesting = false;
    },
    elInFile(f, fs) {
      // eslint-disable-next-line no-console
      console.log(f);
      let packageDefinition = protoLoader.loadSync(f.raw.path, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      });
      this.proto = grpc.loadPackageDefinition(packageDefinition).proto;
      // eslint-disable-next-line no-console
      console.log(packageDefinition);
      let index = 0;
      for (let i in packageDefinition) {
        // eslint-disable-next-line no-console
        console.log(i);
        this.editableTabs[0].options.push({
          label: i,
          value: i.split(".")[1],
          children: []
        });
        for (let j in packageDefinition[i]) {
          this.editableTabs[0].options[index].children.push({
            label: j,
            value: j
          });
          // eslint-disable-next-line no-console
          console.log("\t" + j);
        }
        index++;
      }
    },
    handleChange(value) {
      console.log(this.editableTabs[this.editableTabsValue - 1].client);
      this.editableTabs[this.editableTabsValue - 1].client = new this.proto[
        value[0]
      ](
        this.editableTabs[this.editableTabsValue - 1].address,
        grpc.credentials.createInsecure()
      );
      // eslint-disable-next-line no-console
      console.log(this.editableTabs[this.editableTabsValue - 1].client);
    }
  }
};
</script>
