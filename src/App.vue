<template>
    <div>
        <el-row>
            <p>
                <el-tag>你执行了操作：</el-tag>
                <el-tag type="success"> {{task}}</el-tag>
            </p>
        </el-row>
        <el-row>
            <el-button type="primary" @click="createASimpleTask">创建简单任务</el-button>
            <el-button type="success" @click="createACompositeTask">创建复合任务</el-button>
            <el-button type="info" @click="copyCurrentTask">复制当前任务</el-button>
            <el-button type="warning" @click="deleteCurrentTask">删除当前任务</el-button>
            <el-button type="danger" @click="deleteAllTasks">删除所有任务</el-button>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-tabs v-model="editableTabsValue" type="border-card" editable closable @tab-remove="removeTab">
                <el-tab-pane
                        v-for="(item) in editableTabs"
                        :key="item.name"
                        :label="item.title"
                        :name="item.name">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="日志">
                            <el-input type="textarea" :rows="10" v-model="form.desc"></el-input>
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
                            <el-col :span="8">
                                <el-form-item label="服务">
                                    <el-select v-model="form.service" placeholder="请选择服务" value="" style="width: 100%">
                                        <el-option label="auth" value="shanghai"></el-option>
                                        <el-option label="game" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="协议">
                                    <el-select v-model="form.rpc" placeholder="请选择协议" value="" style="width: 100%">
                                        <el-option label="login" value="shanghai"></el-option>
                                        <el-option label="register" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="线程">
                                    <el-input v-model="form.task" type="number"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="循环">
                                    <el-input v-model="form.loop" type="number"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="超时">
                                    <el-input v-model="form.timeout" type="number"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="异步">
                            <el-switch v-model="form.delivery"></el-switch>
                        </el-form-item>
                        <el-form-item label="参数">
                            <el-input type="textarea" :rows="2" v-model="form.param"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">开始测试</el-button>
                            <el-button>停止测试</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                task: '无',
                activeName: 'second',
                editableTabsValue: '2',
                editableTabs: [{
                    title: 'Tab 1',
                    name: '1',
                    content: 'Tab 1 content'
                }, {
                    title: 'Tab 2',
                    name: '2',
                    content: 'Tab 2 content'
                }],
                tabIndex: 2,
                form: {
                    name: '',
                    delivery: false,
                    desc: '',
                    service: [],
                    rpc: [],
                    task: 0,
                    loop: 0,
                    timeout: 0,
                    param: ''
                }
            }
        },
        created: async function () {
        },
        methods: {
            createASimpleTask() {
                this.task = '创建简单任务';
                let newTabName = ++this.tabIndex + '';
                this.editableTabs.push({
                    title: '新简单任务',
                    name: newTabName,
                    content: '新简单任务页内容'
                });
                this.editableTabsValue = newTabName;
            },
            createACompositeTask() {
                this.task = '创建复合任务';
                let newTabName = ++this.tabIndex + '';
                this.editableTabs.push({
                    title: '新复杂任务',
                    name: newTabName,
                    content: '新复杂任务页内容'
                });
                this.editableTabsValue = newTabName;
            },
            copyCurrentTask() {
                this.task = '复制当前任务';
            },
            deleteCurrentTask() {
                this.task = '删除当前任务';
            },
            deleteAllTasks() {
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
        },
    }
</script>
