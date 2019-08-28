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
      <el-tabs @tab-remove="removeTab" closable type="border-card" v-model="currentEditableTabName">
        <el-tab-pane
                :key="item.name"
                :label="item.title"
                :name="item.name"
                v-for="(item) in editableTabs"
        >
          <el-form v-if="item.isSimple" ref="form" :model="form">
            <el-form-item label="日志">
              <el-input type="textarea" :rows="20" v-model="item.log" style="width: 99%"></el-input>
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
              <el-input type="textarea" :rows="20" v-model="item.log"></el-input>
            </el-form-item>
            <el-col :span="12">
              <el-form-item label="任务">
                <el-input type="textarea" :rows="5" v-model="item.list" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <el-button type="success" @click="onCompositeAdd">新增任务</el-button>
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
    <el-dialog title="添加新任务" :visible.sync="addDialogFormVisible">
      <el-form :model="form">
        <el-form-item label="任务名称" :label-width="formLabelWidth">
          <el-select v-model="selectedSimpleTask" placeholder="请选择" value="">
            <el-option
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    v-for="item in addDialogFormList">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSimpleTaskCompositeTask">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const protoLoader = require('@grpc/proto-loader');
  const grpc = require('grpc');
  const { lib } = require('./lib.js');

  export default {
    data () {
      return {
        //默认当前激活的窗口
        activeName: 'first',
        //当前激活的窗口的名字
        currentEditableTabName: '1',
        //自带的两个tab的内容
        editableTabs: [
          {
            title: '这是简单任务标题',  //任务的名称，tab的名称
            name: '1',  //任务的索引
            isSimple: true, //是否简单任务
            delivery: true, //是否异步
            log: '这是简单任务的日志', //这是有序列表，存放日志
            value: '',  //级联选择器的已选内容
            options: [],  //级联选择器的选项
            task: 1, //多线程
            loop: 1, //循环次数
            timeout: 10000, //超时时间
            param: '{ "userName": "robot2", "password": "cc3e7bb5ad6f13c65f0bb97da5c35f7c" }', //请求参数
            address: 'localhost:50301', //任务的端口
            isTesting: false, //任务是否正在进行
            client: null  //gRPC的client，用来调用rpc
          },
          {
            title: '这是复合任务标题',  //任务的名称，tab的名称
            name: '2',  //任务的索引
            isSimple: false, //是否简单任务
            log: '这是复合任务日志', //存放复合任务的日志
            list: '', //这是任务列表
            isTesting: false  //任务是否正在进行
          }
        ],
        nextTabIndex: 3, //这是标签的索引
        form: {
          title: '' //这是新建标签时填写的名字
        },
        formLabelWidth: '120px',  //表单名字的宽度
        dialogFormVisible: false, //创建新任务表单的开启状态
        addDialogFormVisible: false,
        addDialogFormList: [],
        isSimple: true, //是否简单任务
        proto: null,  //proto
        selectedSimpleTask: ''
      }
    },
    created: async function () {},
    methods: {
      createTask () {
        let newTabName = this.nextTabIndex + '';
        this.nextTabIndex++;
        //判断是否为简单任务
        if (this.isSimple) {
          //创建简单任务
          this.editableTabs.push({
            title: this.form.title, //任务的名称，tab的名称
            name: newTabName, //任务的索引
            isSimple: true, //是否简单任务
            delivery: true, //是否异步
            log: '这是简单任务的日志', //这是有序列表，存放日志
            value: '',
            options: [],
            task: 1, //多线程
            loop: 1, //循环次数
            timeout: 10000, //超时时间
            param: '{ "userName": "robot2", "password": "cc3e7bb5ad6f13c65f0bb97da5c35f7c" }', //请求参数
            address: 'localhost:50301', //任务的端口
            isTesting: false, //任务是否正在进行
            client: null  //gRPC的client，用来调用rpc
          })
        } else {
          //创建复合任务
          this.editableTabs.push({
            title: this.form.title,
            name: newTabName,
            isSimple: this.isSimple,
            list: '', //这是任务列表
            log: '这是复合任务日志', //存放复合任务的日志
            isTesting: false  //任务是否正在进行
          })
        }
        this.currentEditableTabName = newTabName;
        this.dialogFormVisible = false
      },
      createSimpleTask () {
        //创建简单任务
        this.isSimple = true;
        this.dialogFormVisible = true
        // this.editableTabs[0].log += "\n创建简单任务";
      },
      getIndexByName(name){
        for(let i =0; i <this.editableTabs.length;i++){
          if(this.editableTabs[i].name===name){
            return i
          }
        }
      },
      addSimpleTaskCompositeTask () {
        //向复合任务添加简单任务
        this.editableTabs[this.getIndexByName(this.currentEditableTabName)].list += this.selectedSimpleTask + '\n';
        this.addDialogFormVisible = false
      },
      createCompositeTask () {
        //创建组合任务
        this.isSimple = false;
        this.dialogFormVisible = true
        // this.editableTabs[0].log += "\n创建复合任务";
      },
      copyCurrentTask () {
        //复制当前任务
        let newTabName = this.nextTabIndex + '';
        this.nextTabIndex++;
        let data = { ...this.editableTabs[this.getIndexByName(this.currentEditableTabName)] };
        data.name = newTabName;
        data.log = '';
        this.editableTabs.push(data);
        this.currentEditableTabName = newTabName
      },
      deleteCurrentTask () {
        //删除当前任务
        this.removeTab(this.currentEditableTabName)
      },
      deleteAllTasks () {
        //删除所有任务
        for (let i = this.editableTabs.length - 1; i >= 0; i--) {
          this.removeTab(this.editableTabs[i].name)
        }
      },
      removeTab (targetName) {
        //删除tab
        let tabs = this.editableTabs;
        let activeName = this.currentEditableTabName;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.currentEditableTabName = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName)
      },
      async onSimpleStart () {
        //简单任务的开始
        this.editableTabs[this.getIndexByName(this.currentEditableTabName)].isTesting = true;
        for (let i = 0; i < this.editableTabs[this.getIndexByName(this.currentEditableTabName)].loop; i++) {
          let jsonObj = JSON.parse(this.editableTabs[this.getIndexByName(this.currentEditableTabName)].param);
          if (this.editableTabs[this.getIndexByName(this.currentEditableTabName)].delivery===false){
            let res = lib.grpcCall(this.editableTabs[this.getIndexByName(this.currentEditableTabName)].client, this.editableTabs[this.getIndexByName(this.currentEditableTabName)].value[1], jsonObj, null);
            this.editableTabs[this.getIndexByName(this.currentEditableTabName)].log += '\n' + JSON.stringify(res)
          }else{
            let res = await lib.grpcCall(this.editableTabs[
              this.getIndexByName(this.currentEditableTabName)].client, this.editableTabs[this.getIndexByName(this.currentEditableTabName)].value[1], jsonObj, null);
            this.editableTabs[this.getIndexByName(this.currentEditableTabName)].log += '\n' + JSON.stringify(res)
          }

        }
        this.editableTabs[this.getIndexByName(this.currentEditableTabName)].isTesting = false
      },
      onSimpleEnd () {
        //简单任务的结束
        //todo
        this.editableTabs[this.getIndexByName(this.currentEditableTabName)].isTesting = false
      },
      async startSimpleTask (task,fromCompositeTask) {
        // eslint-disable-next-line no-console
        console.log(task);
        // 开始简单任务
        task.isTesting = true;
        for (let i = 0; i < task.loop; i++) {
          let jsonObj = JSON.parse(task.param);
          let res = await lib.grpcCall(task.client, task.value[1], jsonObj, null);
          task.log += '\n' + JSON.stringify(res);
          fromCompositeTask.log += '\n' + JSON.stringify(res)
        }
        task.isTesting = false
      },
      async startSimpleTaskByName (name,fromCompositeTask) {
        // 通过TaskName开始简单任务
        for (let i = 0; i < this.editableTabs.length; i++) {
          let currentTask = this.editableTabs[i];
          if (!currentTask.isSimple) {
            continue
          }
          if (currentTask.name !== name) {
            continue
          }
          await this.startSimpleTask(currentTask,fromCompositeTask)
        }
      },
      async onCompositeStart () {
        //混合任务的开始
        let fromCompositeTask = this.editableTabs[this.getIndexByName(this.currentEditableTabName)];
        this.editableTabs[this.getIndexByName(this.currentEditableTabName)].isTesting = true;
        let taskNameList = this.editableTabs[this.getIndexByName(this.currentEditableTabName)].list.split('\n');
        taskNameList.pop();
        for (let i = 0; i < taskNameList.length; i++) {
          await this.startSimpleTaskByName(taskNameList[i],fromCompositeTask)
        }
      },
      onCompositeAdd () {
        //混合任务的添加
        this.addDialogFormList = [];
        for (let i = 0; i < this.editableTabs.length; i++) {
          if (this.editableTabs[i].isSimple) {
            this.addDialogFormList.push({ label: this.editableTabs[i].title, value: this.editableTabs[i].name })
          }
        }
        this.addDialogFormVisible = true
      },
      onCompositeEnd () {
        //混合任务的开始
        this.editableTabs[this.getIndexByName(this.currentEditableTabName)].isTesting = false
      },
      // eslint-disable-next-line no-unused-vars
      elInFile (file, fileList) {
        this.$message({
          message: '请先填写这个服务的地址，再选择服务中的协议，否则创建的client有错误！',
          type: 'warning'
        });
        // 加载 proto 文件
        let packageDefinition = protoLoader.loadSync(
          file.raw.path,
          {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
          }
        );
        // 解析 proto
        this.proto = grpc.loadPackageDefinition(packageDefinition).proto;
        let index = 0;
        // 为级联选择器添加 service
        for (let serviceName in packageDefinition) {
          this.editableTabs[this.getIndexByName(this.currentEditableTabName)].options.push({
            label: serviceName,
            value: serviceName.split('.')[1],
            children: []
          });
          // 为级联选择器添加 rpc 方法名
          for (let serviceFunctionName in packageDefinition[serviceName]) {
            this.editableTabs[this.getIndexByName(this.currentEditableTabName)].options[index].children.push({
              label: serviceFunctionName,
              value: serviceFunctionName
            })
          }
          index++
        }
      },
      handleChange (value) {
        this.editableTabs[this.getIndexByName(this.currentEditableTabName)].client = new this.proto[
          value[0]
          ](
          this.editableTabs[this.getIndexByName(this.currentEditableTabName)].address,
          grpc.credentials.createInsecure()
        )
      }
    }
  }
</script>
