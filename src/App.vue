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
            :name="item.name">
          <el-form v-if="item.isSimple" ref="form" :model="form">
            <el-form-item label="日志">
              <el-input type="textarea" :rows="10" v-model="item.desc"></el-input>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="文件">
                  <el-upload
                      :auto-upload="false"
                      :on-change="elInFile"
                      ref="upload"
                      class="upload-demo"
                      accept=".proto" action="">
                    <el-button slot="trigger" size="mini" type="success" plain>选取文件</el-button>
                    <i slot="tip" class="el-upload__tip el-icon-info">只能选取proto</i>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="8" style="width: 90%">
                <el-form-item label="服务和协议">
                  <el-cascader
                      v-model="value"
                      :options="item.options"
                      :props="{ expandTrigger: 'hover' }"
                      @change="handleChange"></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="线程">
                  <el-input v-model="item.task" type="number" style="width: 90%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="循环">
                  <el-input v-model="item.loop" type="number" style="width: 90%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="超时">
                  <el-input v-model="item.timeout" type="number" style="width: 90%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="异步">
              <el-switch v-model="item.delivery"></el-switch>
            </el-form-item>
            <el-form-item label="参数">
              <el-input type="textarea" :rows="2" v-model="item.param"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">开始测试</el-button>
              <el-button>停止测试</el-button>
            </el-form-item>
          </el-form>
          <el-form v-if="!item.isSimple" ref="form" :model="form">
            <el-form-item label="日志">
              <el-input type="textarea" :rows="10" v-model="item.desc"></el-input>
            </el-form-item>
            <el-col :span="12">
              <el-form-item label="任务">
                <el-input type="textarea" :rows="10" v-model="item.list"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="onSubmit">开始测试</el-button>
                <el-button>停止测试</el-button>
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
    export default {
        data() {
            return {
                task: '无',
                activeName: 'second',
                editableTabsValue: '1',
                editableTabs: [{
                    title: '这是简单任务标题',
                    name: '1',
                    isSimple: true,            //是否简单任务
                    delivery: false,           //是否异步
                    desc: '这是日志',           //这是有序列表，存放日志
                    value: [],
                    options: [{
                        value: 'zhinan',
                        label: '指南',
                        children: [{
                            value: 'shejiyuanze',
                            label: '设计原则',
                            children: [{
                                value: 'yizhi',
                                label: '一致'
                            }, {
                                value: 'fankui',
                                label: '反馈'
                            }, {
                                value: 'xiaolv',
                                label: '效率'
                            }, {
                                value: 'kekong',
                                label: '可控'
                            }]
                        }, {
                            value: 'daohang',
                            label: '导航',
                            children: [{
                                value: 'cexiangdaohang',
                                label: '侧向导航'
                            }, {
                                value: 'dingbudaohang',
                                label: '顶部导航'
                            }]
                        }]
                    }, {
                        value: 'zujian',
                        label: '组件',
                        children: [{
                            value: 'basic',
                            label: 'Basic',
                            children: [{
                                value: 'layout',
                                label: 'Layout 布局'
                            }, {
                                value: 'color',
                                label: 'Color 色彩'
                            }, {
                                value: 'typography',
                                label: 'Typography 字体'
                            }, {
                                value: 'icon',
                                label: 'Icon 图标'
                            }, {
                                value: 'button',
                                label: 'Button 按钮'
                            }]
                        }, {
                            value: 'form',
                            label: 'Form',
                            children: [{
                                value: 'radio',
                                label: 'Radio 单选框'
                            }, {
                                value: 'checkbox',
                                label: 'Checkbox 多选框'
                            }, {
                                value: 'input',
                                label: 'Input 输入框'
                            }, {
                                value: 'input-number',
                                label: 'InputNumber 计数器'
                            }, {
                                value: 'select',
                                label: 'Select 选择器'
                            }, {
                                value: 'cascader',
                                label: 'Cascader 级联选择器'
                            }, {
                                value: 'switch',
                                label: 'Switch 开关'
                            }, {
                                value: 'slider',
                                label: 'Slider 滑块'
                            }, {
                                value: 'time-picker',
                                label: 'TimePicker 时间选择器'
                            }, {
                                value: 'date-picker',
                                label: 'DatePicker 日期选择器'
                            }, {
                                value: 'datetime-picker',
                                label: 'DateTimePicker 日期时间选择器'
                            }, {
                                value: 'upload',
                                label: 'Upload 上传'
                            }, {
                                value: 'rate',
                                label: 'Rate 评分'
                            }, {
                                value: 'form',
                                label: 'Form 表单'
                            }]
                        }, {
                            value: 'data',
                            label: 'Data',
                            children: [{
                                value: 'table',
                                label: 'Table 表格'
                            }, {
                                value: 'tag',
                                label: 'Tag 标签'
                            }, {
                                value: 'progress',
                                label: 'Progress 进度条'
                            }, {
                                value: 'tree',
                                label: 'Tree 树形控件'
                            }, {
                                value: 'pagination',
                                label: 'Pagination 分页'
                            }, {
                                value: 'badge',
                                label: 'Badge 标记'
                            }]
                        }, {
                            value: 'notice',
                            label: 'Notice',
                            children: [{
                                value: 'alert',
                                label: 'Alert 警告'
                            }, {
                                value: 'loading',
                                label: 'Loading 加载'
                            }, {
                                value: 'message',
                                label: 'Message 消息提示'
                            }, {
                                value: 'message-box',
                                label: 'MessageBox 弹框'
                            }, {
                                value: 'notification',
                                label: 'Notification 通知'
                            }]
                        }, {
                            value: 'navigation',
                            label: 'Navigation',
                            children: [{
                                value: 'menu',
                                label: 'NavMenu 导航菜单'
                            }, {
                                value: 'tabs',
                                label: 'Tabs 标签页'
                            }, {
                                value: 'breadcrumb',
                                label: 'Breadcrumb 面包屑'
                            }, {
                                value: 'dropdown',
                                label: 'Dropdown 下拉菜单'
                            }, {
                                value: 'steps',
                                label: 'Steps 步骤条'
                            }]
                        }, {
                            value: 'others',
                            label: 'Others',
                            children: [{
                                value: 'dialog',
                                label: 'Dialog 对话框'
                            }, {
                                value: 'tooltip',
                                label: 'Tooltip 文字提示'
                            }, {
                                value: 'popover',
                                label: 'Popover 弹出框'
                            }, {
                                value: 'card',
                                label: 'Card 卡片'
                            }, {
                                value: 'carousel',
                                label: 'Carousel 走马灯'
                            }, {
                                value: 'collapse',
                                label: 'Collapse 折叠面板'
                            }]
                        }]
                    }, {
                        value: 'ziyuan',
                        label: '资源',
                        children: [{
                            value: 'axure',
                            label: 'Axure Components'
                        }, {
                            value: 'sketch',
                            label: 'Sketch Templates'
                        }, {
                            value: 'jiaohu',
                            label: '组件交互文档'
                        }]
                    }],
                    task: 0,                   //多线程
                    loop: 0,                   //循环次数
                    timeout: 0,                //超时时间
                    param: '这是参数'           //请求参数
                }, {
                    title: '这是复杂任务标题',
                    name: '2',
                    isSimple: false,           //是否简单任务
                    desc: '这是日志',           //这是有序列表，存放日志
                    list: []                    //这是任务列表
                }],
                tabIndex: 2,                   //这是标签的索引
                form: {
                    title: '',                //这是标签的名字
                },
                formLabelWidth: '120px',
                dialogFormVisible: false,
                isSimple: true
            }
        },
        created: async function () {
        },
        methods: {
            createTask() {
                this.task = '创建简单任务';
                let newTabName = ++this.tabIndex + '';
                this.editableTabs.push({
                    title: this.form.title,
                    name: newTabName,
                    isSimple: this.isSimple,
                });
                this.editableTabsValue = newTabName;
                this.dialogFormVisible = false;
            },
            createSimpleTask() {
                this.task = '创建简单任务';
                this.isSimple = true;
                this.dialogFormVisible = true;
            },
            createCompositeTask() {
                this.task = '创建复合任务';
                this.isSimple = false;
                this.dialogFormVisible = true;
            },
            copyCurrentTask() {
                this.task = '复制当前任务';
            },
            deleteCurrentTask() {
                // eslint-disable-next-line no-console
                console.log(this.editableTabsValue);
                this.removeTab(this.editableTabsValue);
                this.task = '删除当前任务';
            },
            deleteAllTasks() {
                this.editableTabs = [];
                this.task = '删除所有任务';
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
            onSubmit() {
                // eslint-disable-next-line no-console
                console.log('submit!');
            },
            elInFile(f, fs) {
                // eslint-disable-next-line no-console
                console.log(fs);
                // eslint-disable-next-line no-console
                console.log(f);
            },
            handleChange(value) {
                // eslint-disable-next-line no-console
                console.log(value);
            }
        },
    }
</script>
