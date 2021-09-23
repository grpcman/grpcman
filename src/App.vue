<template>
  <div>
    <el-row>
      <el-button type="primary" @click="createSimpleTask">创建简单任务</el-button>
      <el-button type="success" @click="createCompositeTask">创建组合任务</el-button>
      <el-button type="info" @click="copyCurrentTask">复制当前任务</el-button>
      <el-button type="warning" @click="deleteCurrentTask">删除当前任务</el-button>
      <el-button type="danger" @click="deleteAllTasks">删除所有任务</el-button>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-tabs
          v-model="currentEditableTabName" closable type="border-card" @tab-click="handleTabClick"
          @tab-remove="removeTab"
      >
        <el-tab-pane
            v-for="(item) in editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
        >
          <el-form v-if="item.isSimple" ref="form" :model="form">
            <el-form-item label="日志">
              <el-input v-model="item.log" :rows="10" style="width: 99%" type="textarea"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="文件">
                  <el-upload
                      ref="upload"
                      :auto-upload="false"
                      :limit="1"
                      :on-change="elInFile"
                      :on-exceed="handleExceed"
                      :on-remove="handleRemove"
                      accept=".proto"
                      action=""
                      class="upload-demo"
                  >
                    <el-button slot="trigger" plain size="mini" type="success">选取文件</el-button>
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
                      v-model="item.value"
                      :options="item.options"
                      :props="{ expandTrigger: 'hover' }"
                      style="width: 99%"
                      @change="handleChange"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="循环">
                  <el-input v-model="item.loop" style="width: 99%" type="number"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="超时">
                  <el-input v-model="item.timeout" disabled="disabled" style="width: 99%" type="number"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="异步（开启异步后程序将无法停止，直至循环结束）">
              <el-switch v-model="item.delivery" style="width: 99%"></el-switch>
            </el-form-item>
            <el-form-item label="参数（请根据您的服务填写，例如 json 字符串）">
              <el-input v-model="item.param" :rows="2" style="width: 99%" type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="item.startIsDisabled" type="primary" @click="onSimpleStart">开始测试</el-button>
              <el-button :disabled="item.stopIsDisabled" type="danger" @click="onSimpleEnd">停止测试</el-button>
            </el-form-item>
          </el-form>
          <el-form v-if="!item.isSimple" ref="form" :model="form">
            <el-form-item label="日志">
              <el-input v-model="item.log" :rows="20" type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="item.addIsDisabled" type="primary" @click="onCompositeAdd">新增任务</el-button>
              <el-button :disabled="item.startIsDisabled" type="success" @click="onCompositeStart">开始测试</el-button>
              <el-button :disabled="item.stopIsDisabled" type="danger" @click="onCompositeEnd">停止测试</el-button>
            </el-form-item>
            <el-table
                :data="item.tableData"
                border
                style="width: 100%"
            >
              <el-table-column
                  label="任务名称"
                  prop="title"
              >
              </el-table-column>
              <el-table-column
                  label="唯一编号"
                  prop="name"
              >
              </el-table-column>
              <el-table-column
                  label="地址"
                  prop="address"
              >
              </el-table-column>
              <el-table-column
                  label="协议"
                  prop="proto"
              >
              </el-table-column>
              <el-table-column
                  label="循环"
                  prop="loop"
              >
              </el-table-column>
              <el-table-column
                  fixed="right"
                  label="操作"
              >
                <template slot-scope="scope">
                  <el-button size="small" type="text" @click="handleEditClick(scope.row)">编辑</el-button>
                  <el-button size="small" type="text" @click="handleRemoveClick(scope.$index, item.tableData)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-dialog :visible.sync="dialogFormVisible" title="创建新任务">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="任务名称">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createTask">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="addDialogFormVisible" title="添加新任务">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="任务名称">
          <el-select v-model="selectedSimpleTask" placeholder="请选择" value="">
            <el-option
                v-for="item in addDialogFormList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
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
const protoLoader = require('@grpc/proto-loader')
const grpc = require('@grpc/grpc-js')
const { lib } = require('./lib.js')
const dayjs = require('dayjs')
const { ipcRenderer } = require('electron')

export default {
  data () {
    return {
      // 默认当前激活的窗口
      activeName: 'first',
      // 当前激活的窗口的名字
      currentEditableTabName: '1',
      // 自带的两个tab的内容
      editableTabs: [
        {
          title: '简单任务', // 任务的名称，tab的名称
          name: '1', // 任务的索引
          isSimple: true, // 是否简单任务
          delivery: false, // 是否异步
          log: '', // 这是有序列表，存放日志
          value: '', // 级联选择器的已选内容
          options: [], // 级联选择器的选项
          task: 1, // 多线程
          loop: 1, // 循环次数
          timeout: 10000, // 超时时间
          param: '{ "name": "grpcman" }', // 请求参数
          address: 'grpcmantest.d8s.fun:50051', // 任务的端口
          isTesting: false, // 任务是否正在进行
          client: null, // gRPC的client，用来调用rpc
          isEnding: false, // 是都已经点了停止
          startIsDisabled: false, // 开始按钮的禁用
          stopIsDisabled: true // 结束按钮的禁用
        },
        {
          title: '组合任务', // 任务的名称，tab的名称
          name: '2', // 任务的索引
          isSimple: false, // 是否简单任务
          log: '', // 存放组合任务的日志
          isTesting: false, // 任务是否正在进行
          isEnding: false, // 是都已经点了停止
          addIsDisabled: false, // 添加按钮的禁用
          startIsDisabled: false, // 开始按钮的禁用
          stopIsDisabled: true, // 结束按钮的禁用
          tableData: []// 这是任务列表
        }
      ],
      nextTabIndex: 3, // 这是标签的索引
      form: {
        title: '' // 这是新建标签时填写的名字
      },
      formLabelWidth: '120px', // 表单名字的宽度
      dialogFormVisible: false, // 创建新任务表单的开启状态
      addDialogFormVisible: false,
      addDialogFormList: [],
      isSimple: true, // 是否简单任务
      proto: null, // proto
      selectedSimpleTask: ''
    }
  },
  created: async function () {
    ipcRenderer.on('action', (event, arg) => {
      switch (arg) {
        case 'exiting':
          localStorage.setItem('data', JSON.stringify(this.$data))
          ipcRenderer.sendSync('reqaction', 'exit')
          break
        default:
          break
      }
    })

    try {
      let dataFromFile = localStorage.getItem('data')
      dataFromFile = JSON.parse(dataFromFile)
      for (const prop in dataFromFile) {
        this[prop] = dataFromFile[prop]
      }
    } catch (e) {
      console.log(e.message)
    }
  },
  methods: {
    createTask () {
      const newTabName = this.nextTabIndex + ''
      this.nextTabIndex++
      // 判断是否为简单任务
      if (this.isSimple) {
        // 创建简单任务
        this.editableTabs.push({
          title: this.form.title, // 任务的名称，tab的名称
          name: newTabName, // 任务的索引
          isSimple: true, // 是否简单任务
          delivery: false, // 是否异步
          log: '', // 这是有序列表，存放日志
          value: '',
          options: [],
          task: 1, // 多线程
          loop: 1, // 循环次数
          timeout: 10000, // 超时时间
          param: '{ "name": "grpcman" }', // 请求参数
          address: 'grpcmantest.d8s.fun:50051', // 任务的端口
          isTesting: false, // 任务是否正在进行
          client: null, // gRPC的client，用来调用rpc
          isEnding: false, // 是都已经点了停止
          startIsDisabled: false, // 开始按钮的禁用
          stopIsDisabled: true // 结束按钮的禁用
        })
      } else {
        // 创建组合任务
        this.editableTabs.push({
          title: this.form.title,
          name: newTabName,
          isSimple: this.isSimple,
          list: '', // 这是任务列表
          log: '', // 存放组合任务的日志
          isTesting: false, // 任务是否正在进行
          isEnding: false, // 是都已经点了停止
          addIsDisabled: false, // 添加按钮的禁用
          startIsDisabled: false, // 开始按钮的禁用
          stopIsDisabled: true, // 结束按钮的禁用
          tableData: []// 这是任务列表

        })
      }
      this.currentEditableTabName = newTabName
      this.dialogFormVisible = false
    },
    createSimpleTask () {
      // 创建简单任务
      this.isSimple = true
      this.dialogFormVisible = true
      // this.editableTabs[0].log += "\n创建简单任务";
    },
    handleExceed () {
      // 上传文件超出1个
      this.$message({
        message: '只能打开一个proto文件，请删除已有的proto文件',
        type: 'error'
      })
    },
    handleRemove () {
      // 从文件上传栏删除文件
      this.editableTabs[this.getIndexByName(this.currentEditableTabName)].log = ''
      this.editableTabs[this.getIndexByName(this.currentEditableTabName)].client = null
      this.$message({
        message: '当前proto文件删除成功，请选择新的协议',
        type: 'error'
      })
    },
    handleEditClick (row) {
      // 组合任务中简单任务的编辑
      this.currentEditableTabName = row.name
      this.$message({
        message: '编辑后请到组合任务删除该任务并重新添加',
        type: 'warning'
      })
    },
    handleRemoveClick (index, rows) {
      // 组合任务中简单任务的删除
      rows.splice(index, 1)
    },
    handleTabClick () {
      const task = this.editableTabs[this.getIndexByName(this.currentEditableTabName)]
      const refreshTable = []
      if (task.isSimple === false) {
        task.tableData.map((item) => {
          refreshTable.push(item.name)
        })
        task.tableData = []
        refreshTable.map((item) => {
          task.tableData.push({
            title: this.editableTabs[this.getIndexByName(item)].title,
            name: this.editableTabs[this.getIndexByName(item)].name,
            loop: this.editableTabs[this.getIndexByName(item)].loop,
            address: this.editableTabs[this.getIndexByName(item)].address,
            proto: this.editableTabs[this.getIndexByName(item)].value
          })
        })
      }
    },
    getIndexByName (name) {
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].name === name) {
          return i
        }
      }
    },
    addSimpleTaskCompositeTask () {
      // 向组合任务添加简单任务
      const task = this.editableTabs[this.getIndexByName(this.currentEditableTabName)]
      const simpleTask = this.editableTabs[this.getIndexByName(this.selectedSimpleTask)]
      task.tableData.push({
        title: simpleTask.title,
        name: simpleTask.name,
        loop: simpleTask.loop,
        address: simpleTask.address,
        proto: simpleTask.value
      })
      this.addDialogFormVisible = false
    },
    createCompositeTask () {
      // 创建组合任务
      this.isSimple = false
      this.dialogFormVisible = true
    },
    copyCurrentTask () {
      // 复制当前任务
      const newTabName = this.nextTabIndex + ''
      this.nextTabIndex++
      const data = { ...this.editableTabs[this.getIndexByName(this.currentEditableTabName)] }
      data.name = newTabName
      data.log = ''
      data.isTesting = false
      data.isEnding = false
      data.startIsDisabled = false
      data.stopIsDisabled = true
      this.editableTabs.push(data)
      this.currentEditableTabName = newTabName
    },
    deleteCurrentTask () {
      // 删除当前任务
      this.editableTabs[this.getIndexByName(this.currentEditableTabName)].isEnding = true
      this.removeTab(this.currentEditableTabName)
    },
    deleteAllTasks () {
      // 删除所有任务
      for (let i = this.editableTabs.length - 1; i >= 0; i--) {
        this.editableTabs[i].isEnding = true
        this.removeTab(this.editableTabs[i].name)
      }
    },
    removeTab (targetName) {
      // 删除tab
      const tabs = this.editableTabs
      let activeName = this.currentEditableTabName
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }
      this.currentEditableTabName = activeName
      this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    },
    getNowTime () {
      return dayjs().format('YYYY-MM-DD HH:mm:ss:SSS')
    },
    getTimestamp () {
      return Date.now()
    },
    replaceRandomWord (message) {
      message.replace(RegExp, '111')
    },
    async onSimpleStart () {
      const that = this
      const task = this.editableTabs[this.getIndexByName(this.currentEditableTabName)]
      console.log('onSimpleStart() task', task)
      task.isEnding = false
      // 简单任务的开始
      task.isTesting = true
      task.startIsDisabled = true
      task.stopIsDisabled = false
      const beforeParam = JSON.parse(JSON.stringify(task.param))
      console.log('onSimpleStart() beforeParam', beforeParam)
      const startTimestamp = this.getTimestamp()
      console.log('onSimpleStart() startTimestamp', startTimestamp)
      for (let i = 0; i < task.loop; i++) {
        task.param = beforeParam.replace(/%i/g, i)
        console.log('onSimpleStart() task.param', task.param)
        if (!task.isEnding) {
          const jsonObj = JSON.parse(task.param)
          console.log('onSimpleStart() jsonObj', jsonObj)
          const client = task.client
          console.log('onSimpleStart() client', client)
          const funcName = task.value[1]
          console.log('onSimpleStart() funcName', funcName)
          if (task.delivery === true) {
            client[funcName](jsonObj, function (err, res) {
              console.log('client func err', err)
              task.log += '[' + that.getNowTime() + ']' + JSON.stringify(res) + '\n'
            })
          } else {
            // const res = await lib.grpcCall(client, funcName, jsonObj, null)
            console.log('onSimpleStart() jsonObj 2', jsonObj)
            client[funcName](jsonObj, (err, res) => {
              if (err) {
                console.error(err)
                return
              }
              console.log('res', res)
              task.log += '[' + this.getNowTime() + ']' + JSON.stringify(res) + '\n'
            })
          }
        }
      }
      this.getTimestamp()
      task.log += `总耗时：${(this.getTimestamp() - startTimestamp) / 1000}秒\n`
      task.startIsDisabled = false
      task.stopIsDisabled = true
      this.editableTabs[this.getIndexByName(this.currentEditableTabName)].isTesting = false
    },
    onSimpleEnd () {
      // 简单任务的结束
      this.editableTabs[this.getIndexByName(this.currentEditableTabName)].isEnding = true
      this.editableTabs[this.getIndexByName(this.currentEditableTabName)].isTesting = false
    },
    async startSimpleTask (task, compositeTask) {
      const that = this
      task.isEnding = false
      task.isTesting = true
      const beforeParam = JSON.parse(JSON.stringify(task.param))
      const startTimestamp = this.getTimestamp()
      for (let i = 0; i < task.loop; i++) {
        task.param = beforeParam.replace(/%i/g, i)
        if (!task.isEnding && !compositeTask.isEnding) {
          const jsonObj = JSON.parse(task.param)
          if (task.delivery === true) {
            const client = task.client
            const funcName = task.value[1]
            client[funcName](jsonObj, function (err, res) {
              console.log(err)
              task.log += '[' + that.getNowTime() + ']' + JSON.stringify(res) + '\n'
              compositeTask.log += '[' + that.getNowTime() + ']' + JSON.stringify(res) + '\n'
            })
          } else {
            const res = await lib.grpcCall(task.client, task.value[1], jsonObj, null)
            task.log += '[' + this.getNowTime() + ']' + JSON.stringify(res) + '\n'
            compositeTask.log += '[' + this.getNowTime() + ']' + JSON.stringify(res) + '\n'
          }
        }
      }
      task.log += `总耗时：${(this.getTimestamp() - startTimestamp) / 1000}秒\n`
      compositeTask.log += `总耗时：${(this.getTimestamp() - startTimestamp) / 1000}秒\n`
      task.isTesting = false
    },
    async startSimpleTaskByName (name, compositeTask) {
      // 通过TaskName开始简单任务
      for (let i = 0; i < this.editableTabs.length; i++) {
        const currentTask = this.editableTabs[i]
        if (!currentTask.isSimple) {
          continue
        }
        if (currentTask.name !== name) {
          continue
        }
        await this.startSimpleTask(currentTask, compositeTask)
      }
    },
    async onCompositeStart () {
      // 混合任务的开始
      const task = this.editableTabs[this.getIndexByName(this.currentEditableTabName)]
      if (task.tableData.length === 0) {
        this.$message({
          message: '没有可以执行的任务',
          type: 'warning'
        })
        return 0
      }
      task.isEnding = false
      task.startIsDisabled = true
      task.stopIsDisabled = false
      task.isTesting = true
      for (let i = 0; i < task.tableData.length; i++) {
        if (!task.isEnding) {
          await this.startSimpleTaskByName(task.tableData[i].name, task)
        }
      }
      task.startIsDisabled = false
      task.stopIsDisabled = true
    },
    onCompositeAdd () {
      // 混合任务的添加按钮
      this.addDialogFormList = []
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].isSimple) {
          this.addDialogFormList.push({
            label: this.editableTabs[i].title,
            value: this.editableTabs[i].name
          })
        }
      }
      this.addDialogFormVisible = true
    },
    onCompositeEnd () {
      // 混合任务的结束
      const task = this.editableTabs[this.getIndexByName(this.currentEditableTabName)]
      task.isEnding = true
      task.isTesting = false
      task.startIsDisabled = false
      task.stopIsDisabled = true
    },
    // eslint-disable-next-line no-unused-vars
    elInFile (file, fileList) {
      this.editableTabs[this.getIndexByName(this.currentEditableTabName)].options = []
      this.$message({
        message: '请先填写这个服务的地址，再选择服务中的协议，否则创建的client有错误！',
        type: 'warning'
      })
      // 加载 proto 文件
      const packageDefinition = protoLoader.loadSync(
        file.raw.path,
        {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true
        }
      )
      console.log('elInFile() packageDefinition', packageDefinition)

      // 解析 proto
      const grpcObject = grpc.loadPackageDefinition(packageDefinition)
      console.log('elInFile() grpcObject', grpcObject)
      const grpcObjectKeys = Object.keys(grpcObject)
      console.log('elInFile() grpcObjectKeys', grpcObjectKeys)
      this.proto = grpcObject[grpcObjectKeys[0]]
      console.log('elInFile() this.proto', this.proto)

      // 为级联选择器添加 service
      let index = 0
      for (const serviceName in packageDefinition) {
        this.editableTabs[this.getIndexByName(this.currentEditableTabName)].options.push({
          label: serviceName,
          value: serviceName.split('.')[1],
          children: []
        })
        // 为级联选择器添加 rpc 方法名
        for (const serviceFunctionName in packageDefinition[serviceName]) {
          this.editableTabs[this.getIndexByName(this.currentEditableTabName)].options[index].children.push({
            label: serviceFunctionName,
            value: serviceFunctionName
          })
        }
        index++
      }
    },
    handleChange (value) {
      console.log('handleChange() value', value)
      const task = this.editableTabs[this.getIndexByName(this.currentEditableTabName)]
      console.log('handleChange() task', task)
      console.log('handleChange() this.proto', this.proto)
      console.log('handleChange() value[0]', value[0])
      console.log('handleChange() this.proto[value[0]]', this.proto[value[0]])
      task.client = new this.proto[value[0]](task.address, grpc.credentials.createInsecure())
    }
  }
}
</script>
