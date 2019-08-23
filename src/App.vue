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
        <el-row>
            <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
                <el-tab-pane
                        v-for="(item) in editableTabs"
                        :key="item.name"
                        :label="item.title"
                        :name="item.name"
                >
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="测试日志">
                            <el-input type="textarea" :rows="10" v-model="form.desc" disabled="disabled"></el-input>
                        </el-form-item>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="线程数">
                                    <el-input v-model="form.name" type="number"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="循环数">
                                    <el-input v-model="form.name" type="number"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="服务">
                                    <el-select v-model="form.region" placeholder="请选择服务" value="">
                                        <el-option label="区域一" value="shanghai"></el-option>
                                        <el-option label="区域二" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="协议">
                                    <el-select v-model="form.region" placeholder="请选择协议" value="">
                                        <el-option label="区域一" value="shanghai"></el-option>
                                        <el-option label="区域二" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="参数">
                            <el-input type="textarea" :rows="10" v-model="form.desc"></el-input>
                        </el-form-item>
                        <el-form-item label="是否异步">
                            <el-switch v-model="form.delivery"></el-switch>
                        </el-form-item>
                        <el-form-item label="活动性质">
                            <el-checkbox-group v-model="form.type">
                                <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
                                <el-checkbox label="地推活动" name="type"></el-checkbox>
                                <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                                <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="特殊资源">
                            <el-radio-group v-model="form.resource">
                                <el-radio label="线上品牌商赞助"></el-radio>
                                <el-radio label="线下场地免费"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="活动形式">
                            <el-input type="textarea" v-model="form.desc"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">立即创建</el-button>
                            <el-button>取消</el-button>
                        </el-form-item>
                    </el-form>
                    {{item.content}}
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
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
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
                this.task = '复制当前任务'
            },
            deleteCurrentTask() {
                this.task = '删除当前任务'
            },
            deleteAllTasks() {
                this.task = '删除所有任务'
            },
            handleClick(tab, event) {
                // eslint-disable-next-line no-console
                console.log(tab, event);
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
            }
        },
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
