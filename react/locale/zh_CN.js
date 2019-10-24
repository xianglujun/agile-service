const docServer = 'http://v0-16.choerodon.io/zh/docs';
/*eslint-disable*/
const pageDetail = {
  'branch.head': '项目\"{name}\"的分支管理',
  'branch.createHead': '在应用\"{name}\"中创建分支',
  'branch.createDes': '采用Gitflow工作流模式，请在下面选择分支类型，并填写issue号或版本号，即可创建分支。',
  'branch.mergeDev': '是否将分支\"{name}\"合并到develop分支？',
  'branch.noCommitDev': '是否将分支\"{name}\"分支无提交，是否删除？',
  'branch.noCommit': '是否将分支\"{name}\"分支无提交，不生成版本号，是否删除？',
  'branch.mergeDevMas': '是否将分支\"{name}\"合并到master，develop分支，并以为\"{version}\"版本号？',
  'branch.description': '分支是将您的工作从开发主线上分离开来，以免影响开发主线。平台采用gitflow分支模型，您可以在此创建分支，然后将代码拉至本地开发后提交代码，再结束分支，平台会为您合并代码并触发相应的持续集成流水线。',
  'branch.createTip': '采用gitflow分支模型，可创建feature、release、hotfix等分支，结束分支时自动触发分支合并和特有的持续集成流水线。',
  'branch.link': `${docServer}/user-guide/development-pipeline/branch-management/`,
  'branch.editDes': '采用Git flow工作流模式，自动创建分支模式所特有的流水线，持续交付过程中对feature、release、hotfix等分支进行管理。',
  'branch.editHead': '修改分支\"{name}\"完成的问题',
  'branch.detailHead': '分支\"{name}\"完成的问题',
};

const zh_CN = {
  save: '保存',
  cancel: '取消',
  add: '添加',
  name: '名称',
  code: '编码',
  required: '字段不能为空！',
  'network.error': '网络错误',
  createSuccess: '创建成功',
  createFailed: '创建失败',
  edit: '编辑',
  delete: '删除',
  refresh: '刷新',
  filter: '筛选条件',
  create: '创建',
  confirm: '确认',
  relation: '关联',
  copy: '复制',
  editSuccess: '编辑成功',
  deleteSuccess: '删除成功',
  editFailed: '编辑失败',
  deleteFailed: '删除失败',
  disable: '停用',
  enable: '启用',

  "issue.detail": '详情',
  "issue.des": '描述',
  "issue.attachment": '附件',
  "issue.doc": '知识',
  "issue.commit": '评论',
  "issue.log": '工作日志',
  "issue.data_log": '操作历史',
  "issue.sub_task": '子任务',
  "issue.bug": '缺陷',
  "issue.link_task": '问题链接',
  "issue.link_test": '测试用例',
  "issue.branch": '开发',
  "issue.branch.create": '创建分支',
  "issue.commit.create": '添加评论',
  "issue.log.create": '登记工作',

  'field.create': '创建字段',
  'field.edit': '编辑自定义字段',
  'field.context': '问题类型',
  'field.code.rule': '编码只允许数字、字母及下划线',
  'field.code.exist': '编码已经存在',
  'field.name.exist': '名称已经存在',
  'field.type': '字段类型',
  'field.radio': '单选框',
  'field.checkbox': '复选框',
  'field.time': '时间选择器',
  'field.datetime': '日期时间选择器',
  'field.date': '日期选择器',
  'field.number': '数字输入框',
  'field.input': '文本框（单行）',
  'field.text': '文本框（多行）',
  'field.single': '选择器（单选）',
  'field.multiple': '选择器（多选）',
  'field.cascade': '选择器（级联选择）',
  'field.url': 'URL',
  'field.label': '标签',
  'field.member': '成员选择',
  'field.default': '默认值',
  'field.decimal': '小数输入',
  'field.urlError': 'URL格式错误',
  'field.useCurrentDate': '使用当前日期和时间为默认值',
  'field.useCurrentTime': '使用当前时间为默认值',
  'field.dragList.tips': '请为该字段添加值，你可以通过上下 拖拽 改变显示顺序。',
  'field.value.null': '请先设置字段值列表',

  'dragList.invalid': '禁用',
  'dragList.active': '启用',
  'dragList.placeholder': '选项值',
  'dragList.placeholder.code': '选项编码',

  "learnmore": "了解更多",
  'branch.branch': '分支',
  'branch.tag': '标记',
  'branch.create': '创建分支',
  'branch.title': '分支管理',
  'branch.branchType': '分支类型',
  'branch.list': '分支列表',
  'branch.tagList': '标记列表',
  'branch.name': '分支名称',
  'branch.type': '分支类型',
  'branch.code': '提交编码',
  'branch.des': '提交描述',
  'branch.commit': '提交',
  'branch.issue': '问题',
  'branch.issueName': '问题名称',
  'branch.source': '分支来源',
  'branch.owner': '提交者',
  'branch.time': '创建',
  'branch.edit': '修改相关联问题',
  'branch.request': '创建合并请求',
  'branch.checkName': '名称只能包含数字和".",并且以数字开头和结尾',
  'branch.checkNameEnd': '不能以"/"、"."、".lock"结尾',
  'branch.check': '只能包含字母、数字、\'——\'、\'_\'',
  'branch.master': 'Master',
  'branch.bugfix': 'Bugfix',
  'branch.feature': 'Feature',
  'branch.release': 'Release',
  'branch.hotfix': 'Hotfix',
  'branch.custom': 'Custom',
  'branch.issue.priority': '优先级',
  'branch.issue.module': '模块',
  'branch.issue.type': '类型',
  'branch.issue.label': '标签',
  'branch.issue.creator': '经办人',
  'branch.issue.summary': '描述',

  'branch.masterDes': '即主分支，用于版本持续发布。在开发的整个阶段一直存在，平时不在此分支开发，因此代码比较稳定。',
  'branch.bugfixDes': '即漏洞修补分支，通常用于对发布分支进行错误修复',
  'branch.featureDes': '即特性分支，用于日常开发时切出分支进行单功能开发。基于develop分支创建，结束分支时合并至develop分支。',
  'branch.releaseDes': '即发布分支，用于产品发布、产品迭代。基于develop分支创建，结束分支时合并到develop分支和master分支。',
  'branch.hotfixDes': ' 即热修分支，用于产品发布后修复缺陷。基于master分支创建，结束分支时合并到master分支和develop分支。',
  'branch.customDes': ' 即自定义分支。',
  'branch.delete.tooltip': '确定要删除该分支吗?',
  'branch.action.delete': '删除分支',
  'branch.issue.story': '用户故事',
  'branch.issue.task': '任务',
  'branch.issue.bug': '故障',
  'branch.issue.epic': '史诗',

  // 问题类型
  'issueType.title': '问题类型',
  'issueType.create': '添加问题类型',
  'issueType.tip': '问题类型是将敏捷服务和测试服务中的问题类型进行统一管理。',
  'issueType.name': '名称',
  'issueType.des': '描述',
  'issueType.scheme': '相关方案',
  'issueType.delete': '删除问题类型：',
  'issueType.action.delete': '删除问题类型',
  'issueType.delete.confirm': '请确认需要删除的问题类型。',
  'issueType.delete.noUse': '没有正在使用此类型的问题。',
  'issueType.delete.noUseTip': '注意：这个问题类型同时也会在所有字段配置、问题类型页面和状态机方案中被删除。',
  'issueType.delete.forbidden': '无法删除这个问题类型。',
  'issueType.delete.inUse': '当前有 {num} 个问题正在使用此类型。（你只能看到权限范围内的问题数量）',
  'issueType.delete.inUseTip': '注意：如果需要删除这个问题类型，需要将其与所有项目中的状态机，字段配置和字段页面方案解除关联。',
  'issueType.createDes': '在此输入问题类型的名称和描述，并为问题类型选择或上传一个图标，即可创建问题类型。',
  'issueType.label.name': '名称',
  'issueType.label.des': '描述',
  'issueType.label.icon': '图标',
  'issueType.label.color': '颜色',
  'issueType.name.check.exist': '问题类型名称已存在。',
  'error.issueType.update': '更新失败，请刷新后重试。',

  // 问题类型方案
  'issueTypeScheme.title': '问题类型方案',
  'issueTypeScheme.create': '添加方案',
  'issueTypeScheme.tip': '问题类型方案是将一些问题类型组合在一起，并关联给一个项目来使用，当你创建一个新的项目时，平台会为每个项目初始化一套默认的敏捷服务和测试服务的问题类型方案。',
  'issueTypeScheme.edit': '编辑方案',
  'issueTypeScheme.copy': '复制方案',
  'issueTypeScheme.name': '名称',
  'issueTypeScheme.des': '描述',
  'issueTypeScheme.type': '类型',
  'issueTypeScheme.project': '项目',
  'issueTypeScheme.delete': '删除问题类型：',
  'issueTypeScheme.delete.inUse': ' 项目正在使用这个方案。',
  'issueTypeScheme.delete.tip': '删除此方案后，这一项目将恢复为使用默认的全局问题类型方案。',
  'issueTypeScheme.delete.noUse': '没有项目使用这个方案。',
  'issueTypeScheme.action.delete': '删除问题类型方案',
  'issueTypeScheme.createDes': '在此输入问题类型方案的名称和描述，并选择需要的问题类型，即可创建问题类型方案。',
  'issueTypeScheme.label.name': '名称',
  'issueTypeScheme.label.des': '描述',
  'issueTypeScheme.label.default': '默认的问题类型',
  'issueTypeScheme.label.tips': '通过上下 #拖拽# 改变显示顺序。 同样你也可以从一个列表 #拖拽# 到另一个列表，来添加或移除类别。',
  'issueType.required': '问题类型必选！',
  'issueTypeScheme.name.check.exist': '问题类型方案名称已存在。',
  'issueTypeScheme.target': '问题类型用于当前方案',
  'issueTypeScheme.origin': '可用的问题类型',

  // 关联问题类型方案
  'relateIssueTypeScheme.title': '关联问题类型方案',
  'relateIssueTypeScheme.tip': '选择你需要的项目关联此问题类型方案。已有问题类型方案的项目将从当前使用方案更改为所选方案，部分问题因为设置需要进行合并匹配。',

  // 问题类型合并
  'relateMerge.title': '问题类型合并',
  'relateMerge.project': '项目',
  'relateMerge.currentType': '当前问题类型',
  'relateMerge.targetType': '目标问题类型',
  'relateMerge.effectCount': '影响的问题数',
  'relateMerge.currentTypeStatus': '当前问题类型状态',
  'relateMerge.targetTypeStatus': '目标问题类型状态',
  'relateMergeMatchFst.subTitle': '步骤1-确认当前问题类型',
  'relateMergeMatchFst.des': '项目中存在新方案中没有的问题类型，你需要将这些已有数据的问题移至另一个问题类型。',
  'relateMergeMatchSed.subTitle': '步骤2-选择目标问题类型',
  'relateMergeMatchSed.des': '请选择一个此项目中的其他问题类型进行合并，默认为你保留原有问题类型中的字段值，如果你去掉勾选项，原有问题类型的值将会被覆盖。',
  'relateMergeMatchTrd.subTitle': '步骤3-确认问题类型合并',
  'relateMergeMatchTrd.des': '你需要合并的当前问题类型是 {currentType} ，合并后的问题类型是 {targetType} ，请再次确认合并的内容。',
  'relateMergeUnMatch.subTitle': '步骤3-合并问题类型的状态',
  'relateMergeUnMatch.des': '你需要合并的问题类型中部分状态无法适用于目标问题类型，所以你必须选择一个目标问题类型中可用的状态进行过度。',

  //状态机方案
  'stateMachineScheme.title': '状态机方案',
  'stateMachineScheme.create': '添加状态机方案',
  'stateMachineScheme.name': '名称',
  'stateMachineScheme.des': '描述',
  'stateMachineScheme.project': '项目',
  'stateMachineScheme.issueType': '类型',
  'stateMachineScheme.stateMachine': '状态机',
  'stateMachineScheme.operation': '操作',
  'stateMachineScheme.createName': '请输入状态机方案名称',
  'stateMachineScheme.createDes': '请输入此状态机方案的详细描述',
  'stateMachineScheme.edit': '编辑状态机方案',
  'stateMachineScheme.manage': '项目管理流程方案',
  'stateMachineScheme.manageDes': '为项目ITSM生成了此Cloopm服务台IT支持状态流程方案',
  'stateMachineScheme.add': '添加状态机',
  'stateMachineScheme.next': '下一步',
  'stateMachineScheme.connect': '关联问题类型到状态机',
  'stateMachineScheme.connectIssueType': '问题类型',
  'stateMachineScheme.connectedStateMachine': '当前已关联的状态机',
  'stateMachineScheme.pre': '上一步',
  'stateMachineScheme.finish': '完成',
  'stateMachineScheme.cancel': '取消',
  'stateMachineScheme.delete': '删除状态机方案',
  'stateMachineScheme.deleteDesBefore': '确实要删除 ',
  'stateMachineScheme.deleteDesAfter': '注意：将会从所有项目中删除这个状态机方案。',
  'stateMachineScheme.conflictInfo': '此问题类型已经关联其他状态机。你如果需要更新此关联，之前的结果将会被覆盖。',
  'stateMachineScheme.tips': '注意：此状态机方案正在被使用。你正在编辑 #状态机方案草稿# ，如果修改后的草稿需要生效，点击 #发布# 。',
  'stateMachineScheme.publish': '发布',
  'stateMachineScheme.announcing': '发布中',
  'stateMachineScheme.deleteDraft': '删除草稿',
  'stateMachineScheme.original': '查看原件',
  'stateMachineScheme.draft': '编辑草稿',
  'stateMachineScheme.delete.draft': '删除状态机草稿',
  'stateMachineScheme.delete.des': '确实要删除当前编辑的状态机草稿吗？',
  'stateMachineScheme.title.matching': '问题类型及状态匹配',
  'stateMachineScheme.title.publish': '发布状态机方案',
  'stateMachineScheme.publish.des': '为了使部分问题兼容新的状态机，这些问题的当前状态需要进行新的匹配。',
  'stateMachineScheme.publish.noMatch': '所有问题类型和状态更改均可以自动迁移。',
  'stateMachineScheme.targetStatus': '新的状态',
  'stateMachineScheme.sourceStatus': '当前状态',
  'stateMachineScheme.des.none': '无描述',

  // 优先级
  'priority.title': '优先级',
  'priority.create': '创建优先级',
  'priority.edit': '编辑优先级',
  'priority.name': '名称',
  'priority.des': '描述',
  'priority.color': '颜色',
  'priority.list.tip': '以下列表显示了你当前使用的优先级，按照从高到低的顺序排列，你也可以通过上下拖拽改变显示顺序。',
  'priority.create.name.placeholder': '请输入优先级名称',
  'priority.create.des.placeholder': '请输入此优先级的详细描述',
  'priority.create.color.error': '颜色已经存在',
  'priority.create.name.error': '名称已经存在',
  'priority.delete.title': '删除优先级',
  'priority.delete.unused.notice': '注意：将会从所有使用的事件单中删除这个优先级。',
  'priority.delete.used,notice':
    '注意：将会从所有使用的事件单中删除这个优先级。请你为受影响的事件单选择一个新的优先级。',
  'priority.delete.chooseNewPriority.placeholder': '请选择一个新的优先级',
  'priority.default': '（默认）',
  'priority.delete.notice': '注意：将会从所有使用的问题中删除这个优先级。',
  'priority.delete.used.notice': '请你为受影响的问题选择一个新的优先级。',
  'priority.delete.used.tip.prefix': '当前有 ',
  'priority.delete.used.tip.suffix': ' 个问题正在使用此优先级。',
  'priority.disable.title': '停用优先级',
  'priority.disable.notice': '注意：停用后你的问题将无法选择到此优先级。',

  // 问题类型页面方案
  'issueTypeScreenSchemes.title': '问题类型页面方案',
  'issueTypeScreenSchemes.create': '添加问题类型页面方案',
  'issueTypeScreenSchemes.edit': '修改问题类型页面方案',
  'issueTypeScreenSchemes.name': '名称',
  'issueTypeScreenSchemes.project': '项目',
  'issueTypeScreenSchemes.operation': '操作',
  'issueTypeScreenSchemes.list.tip1': '你创建的问题类型页面方案中可以选择 #页面方案# 关联指定的 #问题类型# 。然后再把问题类型页面方案关联到一个或多个项目上，这样可以在指定项目中设置某个类型的某个操作使用哪个 #页面方案# 以及哪个 #页面# 。',
  'issueTypeScreenSchemes.list.tip2': '注意: 只能删除没有使用到项目上的问题类型页面方案。',
  'issueTypeScreenSchemes.edit.sidebarTitle': '修改问题类型页面方案',
  'issueTypeScreenSchemes.create.tip1': '如果你要启用这个页面方案，需要通过问题类型页面方案将其与一个或多个问题类型关联，然后将问题类型页面方案关联到一个或多个项目。',
  'issueTypeScreenSchemes.create.tip2': '注意：页面方案只能添加一个类型同为为 #创建# 或 #编辑# 的页面。',
  'issueTypeScreenSchemes.create.nameLabel': '名称',
  'issueTypeScreenSchemes.create.namePlaceholder': '请输入问题类型页面方案名称',
  'issueTypeScreenSchemes.create.nameWarning': '方案名称不能为空！',
  'issueTypeScreenSchemes.create.desLabel': '描述',
  'issueTypeScreenSchemes.create.desPlaceholder': '请输入此问题类型页面方案的详细描述',
  'issueTypeScreenSchemes.association.title': '问题类型与页面方案关联',
  'issueTypeScreenSchemes.association.addBtn': '添加',
  'issueTypeScreenSchemes.association.issueType': '问题类型',
  'issueTypeScreenSchemes.association.pageScheme': '页面方案',
  'issueTypeScreenSchemes.association.operation': '操作',
  'issueTypeScreenSchemes.association.create.issueTypePlaceholder': '请选择问题类型',
  'issueTypeScreenSchemes.association.create.pageSchemePlaceholder': '请选择页面方案',
  'issueTypeScreenSchemes.association.create.issueTypeWarning': '问题类型不能为空！',
  'issueTypeScreenSchemes.association.create.pageSchemeWarning': '页面方案不能为空！',
  'issueTypeScreenSchemes.association.create.sidebarTitle': '添加问题类型与页面方案关联',
  'issueTypeScreenSchemes.association.edit.sidebarTitle': '编辑问题类型与页面方案关联',
  'issueTypeScreenSchemes.name.check.exist': '问题类型页面方案名称已存在',
  'issueTypeScreenSchemes.delete': '删除问题类型页面方案：',
  'issueTypeScreenSchemes.action.delete': '删除问题类型页面方案',
  'issueTypeScreenSchemes.delete.inUse': '当前有 {num} 个项目正在使用此问题类型页面方案。',
  'issueTypeScreenSchemes.delete.tip': '注意：将会从所有项目中删除这个问题类型页面方案。',

  //状态
  'state.name': '名称',
  'state.des': '描述',
  'state.stage': '阶段',
  'state.stateMachine': '状态机',
  'state.title': '状态',
  'state.create': '创建状态',
  'state.edit': '编辑状态',
  'state.delete': '删除状态',
  'state.delete.tip': '注意：删除后不可恢复，请先进行数据备份。',
  'state.name.required': '名称为必填项',
  'state.tips': '帮助识别问题所处的生命周期的某个阶段',
  'state.tips2': '开始处理问题时，从 #待处理# 到 #处理中# ，随后，当完成所有工作时，进入到 #完成# 阶段。',

  //状态机
  'stateMachine.name': '名称',
  'stateMachine.related': '关联方案',
  'stateMachine.title': '状态机',
  'stateMachine.create': '创建状态机',
  'stateMachine.edit': '编辑状态机',
  'stateMachine.tab.graph': '图形',
  'stateMachine.tab.text': '文本',
  'stateMachine.des': '描述',
  'stateMachine.state.delete': '移除状态',
  'stateMachine.transfer.delete': '删除转换',
  'stateMachine.state': '状态',
  'stateMachine.state.add': '添加状态',
  'stateMachine.state.edit': '更改状态',
  'stateMachine.transfer': '转换',
  'stateMachine.transfer.add': '添加转换',
  'stateMachine.transfer.display': '显示转换标签',
  'stateMachine.transfer.name': '转换名称',
  'stateMachine.transfer.des': '描述',
  'stateMachine.transfer.source': '起始状态',
  'stateMachine.transfer.target': '目标状态',
  'stateMachine.transfer.page': '页面',
  'stateMachine.list.tip': '只有未关联状态机方案的状态机才能被删除。',
  'stateMachine.transfer.edit': '编辑转换',
  'stateMachine.transfer.delete.tip': '请选择你需要删除的转换。',
  'stateMachine.delete': '删除状态机',
  'stateMachine.condition': '条件',
  'stateMachine.verification': '验证器',
  'stateMachine.processor': '后处理功能',
  'stateMachine.config': '配置',
  'stateMachine.condition.des': '条件可以控制哪些用户在什么情况下能够执行一个转换。如果条件不满足，则用户在查看问题的界面上将看不到转换按钮。',
  'stateMachine.condition.guide': '不知道从哪里开始？',
  'stateMachine.condition.link': '从这开始',
  'stateMachine.config_condition.add': '添加条件',
  'stateMachine.verification.des': '状态机验证器将在转换执行之前检查用户的输入是否有效。例如：校验可以保证在转换的页面上用户输入的值是否满足某些标准。如果校验不满足 ，转换的后处理功能将不被执行，并且这个问题将不会进行到转换的目标状态。',
  'stateMachine.config_validator.add': '添加验证器',
  'stateMachine.processor.des': '在一个转换被执行之后，系统会立即执行一些操作（因此称之为后处理功能），例如：更新一个问题的字段，生成一个问题的 修改记录。',
  'stateMachine.config_postposition.add': '添加后处理功能',
  'stateMachine.config.name': '名称',
  'stateMachine.config.des': '描述',

  'stateMachine.edit.draft.tip': '注意：此状态机正在被使用。你正在编辑 状态机草稿 ，如果修改后的草稿需要生效，请点击 发布 。删除草稿 后草稿备份为现在正在使用的状态机。',
  'stateMachine.edit.deploy.tip': '注意：此状态机正在被使用。如果你需要修改，请点击 编辑 。',
  'stateMachine.edit.avtive': '查看状态机',
  'stateMachine.draft.delete': '删除草稿',
  'stateMachine.node.all': '让所有的状态转换到这里',
  'stateMachine.node.name.start': '开始',
  'stateMachine.node.name.all': '全部',
  'stateMachine.delete.confirm': '确定要删除状态“{des}”及其相关转换吗？',
  'stateMachine.node.deleteTip': '确认删除？',
  'stateMachine.node.deleteInfo': '无法删除状态',
  'stateMachine.node.deleteDes': '有{count}个问题在使用此状态，如要删除状态，需要将问题转换到其他状态。',
  'stateMachine.transfer.deleteTip': '请选择需要删除的转换。',
  'stateMachine.transfer.deleteConfirm': '确认删除？',
  'stateMachine.draft': '草稿',
  'stateMachine.publish': '发布',
  'stateMachine.publish.success': '发布成功！',
  'stateMachine.publish.info': '发布状态机草案失败',
  'stateMachineScheme.publish.warn': '当前方案已经被修改，请刷新后重试。',
  'stateMachineScheme.tip': '状态机方案指的是，将状态机和问题类型组合形成并关联项目的方案。',
  'stateMachine.publish.des': '当前状态机草案无法删除，因为您的修改中移除了关联问题的状态，需要将问题转换到其他状态才能继续发布。',

  ...pageDetail,
};
export default zh_CN;  
