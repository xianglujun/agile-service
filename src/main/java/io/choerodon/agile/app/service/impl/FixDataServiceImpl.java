package io.choerodon.agile.app.service.impl;

import io.choerodon.agile.api.vo.ProjectVO;
import io.choerodon.agile.api.vo.StatusMachineNodeVO;
import io.choerodon.agile.api.vo.event.ProjectEvent;
import io.choerodon.agile.app.service.*;
import io.choerodon.agile.infra.dto.*;
import io.choerodon.agile.infra.enums.*;
import io.choerodon.agile.infra.feign.BaseFeignClient;
import io.choerodon.agile.infra.mapper.*;
import io.choerodon.agile.infra.utils.RankUtil;
import io.choerodon.core.exception.CommonException;
import org.apache.commons.collections.MapIterator;
import org.apache.commons.collections.keyvalue.MultiKey;
import org.apache.commons.collections.map.MultiKeyMap;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static org.slf4j.LoggerFactory.getLogger;

@Service
@Transactional(rollbackFor = Exception.class)
public class FixDataServiceImpl implements FixDataService {

    private static final Logger LOGGER = getLogger(FixDataServiceImpl.class);

    @Autowired
    private BaseFeignClient baseFeignClient;
    @Autowired
    private ProjectConfigMapper projectConfigMapper;
    @Autowired
    private ProjectInfoMapper projectInfoMapper;
    @Autowired
    private IssueLinkTypeMapper issueLinkTypeMapper;
    @Autowired
    private BoardMapper boardMapper;
    @Autowired
    private BoardColumnMapper boardColumnMapper;
    @Autowired
    private ColumnStatusRelMapper columnStatusRelMapper;
    @Autowired
    private IssueStatusMapper issueStatusMapper;
    @Autowired
    private ProjectInfoService projectInfoService;
    @Autowired
    private IssueLinkTypeService issueLinkTypeService;
    @Autowired
    private StateMachineSchemeService stateMachineSchemeService;
    @Autowired
    private IssueTypeSchemeService issueTypeSchemeService;
    @Autowired
    private StatusMachineMapper statusMachineMapper;
    @Autowired
    private StateMachineNodeService stateMachineNodeService;
    @Autowired
    private StatusMachineTransformMapper statusMachineTransformMapper;
    @Autowired
    private StateMachineSchemeConfigService stateMachineSchemeConfigService;
    @Autowired
    private IssueTypeSchemeConfigMapper issueTypeSchemeConfigMapper;
    @Autowired
    protected ObjectSchemeFieldMapper objectSchemeFieldMapper;
    @Autowired
    private PageMapper pageMapper;
    @Autowired
    private ObjectSchemeFieldExtendMapper objectSchemeFieldExtendMapper;
    @Autowired
    protected IssueTypeMapper issueTypeMapper;
    @Autowired
    private StatusMachineSchemeConfigMapper statusMachineSchemeConfigMapper;
    @Autowired
    private StatusMachineNodeMapper statusMachineNodeMapper;
    @Autowired
    protected PageFieldMapper pageFieldMapper;

    @Override
    public void fixCreateProject() {
        // 查询有问题的项目id列表
        List<Long> configProjectIds = projectConfigMapper.selectAll().stream().map(ProjectConfigDTO::getProjectId).collect(Collectors.toList());
        List<Long> projectIds = projectInfoMapper.selectAll().stream().map(ProjectInfoDTO::getProjectId).collect(Collectors.toList());
        projectIds.removeAll(configProjectIds);
        Collections.sort(projectIds, Comparator.reverseOrder());
        LOGGER.info("查询出有问题的项目共有{}个，开始修复数据", projectIds.size());
        int count = 0;
        for (Long projectId : projectIds) {
            ProjectVO project = baseFeignClient.queryProject(projectId).getBody();
            LOGGER.info("项目id:{}，项目信息:{}", projectId, project);
            if (!project.getCode().equals("def-ops-proj") || !project.getCategory().equals(ProjectCategory.GENERAL) || !project.getCreatedBy().equals(0L)) {
                LOGGER.info("项目id:{}，该项目不符合规定，跳过", projectId);
                continue;
            }
            singleFix(projectId, project);
            count++;
        }
        LOGGER.info("完成修复数据，共计修复项目{}个", count);
    }

    @Override
    public void fixCreateProjectSingle(Long projectId) {
        ProjectInfoDTO projectInfo = new ProjectInfoDTO();
        projectInfo.setProjectId(projectId);
        if (projectInfoMapper.select(projectInfo).isEmpty()) {
            LOGGER.info("项目id:{}，该项目不符合规定，跳过", projectId);
            return;
        }
        ProjectConfigDTO projectConfig = new ProjectConfigDTO();
        projectConfig.setProjectId(projectId);
        if (!projectConfigMapper.select(projectConfig).isEmpty()) {
            LOGGER.info("项目id:{}，该项目不符合规定，跳过", projectId);
            return;
        }
        ProjectVO project = baseFeignClient.queryProject(projectId).getBody();
        LOGGER.info("项目id:{}，项目信息:{}", projectId, project);
        if (!project.getCode().equals("def-ops-proj") || !project.getCategory().equals(ProjectCategory.GENERAL) || !project.getCreatedBy().equals(0L)) {
            LOGGER.info("项目id:{}，该项目不符合规定，跳过", projectId);
            return;
        }
        singleFix(projectId, project);
    }

    private void singleFix(Long projectId, ProjectVO project) {
        // 删除project_info
        ProjectInfoDTO projectInfoDTO = new ProjectInfoDTO();
        projectInfoDTO.setProjectId(projectId);
        projectInfoMapper.delete(projectInfoDTO);
        // 删除agile_issue_link_type
        IssueLinkTypeDTO issueLinkTypeDTO = new IssueLinkTypeDTO();
        issueLinkTypeDTO.setProjectId(projectId);
        issueLinkTypeMapper.delete(issueLinkTypeDTO);
        // 删除agile_board
        BoardDTO boardDTO = new BoardDTO();
        boardDTO.setProjectId(projectId);
        boardMapper.delete(boardDTO);
        // 删除agile_board_column
        BoardColumnDTO boardColumnDTO = new BoardColumnDTO();
        boardColumnDTO.setProjectId(projectId);
        boardColumnMapper.delete(boardColumnDTO);
        // 删除agile_board_column_status_rel
        ColumnStatusRelDTO columnStatusRelDTO = new ColumnStatusRelDTO();
        columnStatusRelDTO.setProjectId(projectId);
        columnStatusRelMapper.delete(columnStatusRelDTO);
        // 删除agile_issue_status
        IssueStatusDTO issueStatusDTO = new IssueStatusDTO();
        issueStatusDTO.setProjectId(projectId);
        issueStatusMapper.delete(issueStatusDTO);
        LOGGER.info("已清理脏数据，项目id:{}", projectId);

        ProjectEvent projectEvent = new ProjectEvent();
        projectEvent.setProjectCategory(ProjectCategory.GENERAL);
        projectEvent.setProjectCode(project.getCode());
        projectEvent.setProjectName(project.getName());
        projectEvent.setProjectId(project.getId());
        //创建projectInfo
        projectInfoService.initializationProjectInfo(projectEvent);
        //创建项目初始化issueLinkType
        issueLinkTypeService.initIssueLinkType(projectEvent.getProjectId());
        //创建项目时创建默认状态机方案
        stateMachineSchemeService.initByConsumeCreateProject(projectEvent);
        //创建项目时创建默认问题类型方案
        issueTypeSchemeService.initByConsumeCreateProject(projectEvent.getProjectId(), projectEvent.getProjectCode());
        LOGGER.info("已修复数据，项目id:{}", projectId);
    }
    @Override
    @Async
    public void fixDateStateMachineAndPage(){
        LOGGER.info("开始修复数据");
        // 迁移数据
        migrateData();
        // 修状态转换数据
        fixStateMachineTransform();
        // 修项目的问题类型对应的状态机
        fixStateMachineByIssueTypeId();
        // 修复页面配置
        fixPage();
        LOGGER.info("==============================>>>>>>>> AGILE Data Fixed Finished <<<<<<<<=================================");
    }

    private  void migrateData() {
        LOGGER.info("开始迁移状态机相关表的数据");
        // 迁移状态机方案配置表
        statusMachineSchemeConfigMapper.migrateStatusMachineSchemeConfig();
        LOGGER.info("完成迁移状态机方案配置表");
        // 迁移状态机表
        statusMachineMapper.migrateStatusMachine();
        LOGGER.info("完成迁移状态机表");
        // 迁移状态机node表
        statusMachineNodeMapper.migrateStatusMachineNode();
        LOGGER.info("完成迁移状态机node表");
        // 迁移状态机转换表
        statusMachineTransformMapper.migrateStatusMachineTransform();
        LOGGER.info("完成迁移状态机转换表");
        LOGGER.info("完成迁移状态机相关的表");
    }

    @Override
    public void fixPage() {
        LOGGER.info("开始迁移页面数据");
        String createPageCode = "agile_issue_create";
        String editPageCode = "agile_issue_edit";
        Long createPageId = getPageIdByCode(createPageCode);
        Long editPageId = getPageIdByCode(editPageCode);
        if (ObjectUtils.isEmpty(createPageId) || ObjectUtils.isEmpty(editPageId)) {
            return;
        }

        String schemeCode = "agile_issue";
        //key1 fieldId, key2 organizationId, key3 projectId, key4 issueType
        MultiKeyMap dataMap = new MultiKeyMap();
        //key1 fieldId, key2 organizationId, key3 projectId, key4 pageId
        MultiKeyMap rankMap = new MultiKeyMap();

        //旧数据没有设置的字段，但业务上是必须的
        Set<Long> specialFieldIds = new HashSet<>();

        processFields(createPageId, editPageId, schemeCode, dataMap, rankMap, specialFieldIds);

        List<ObjectSchemeFieldExtendDTO> insertList = new ArrayList<>();
        MapIterator mapIterator = dataMap.mapIterator();
        LOGGER.info("同一个字段，优先使用编辑页面的排序值作为页面配置的排序值");
        while (mapIterator.hasNext()) {
            mapIterator.next();
            ObjectSchemeFieldExtendDTO dto = (ObjectSchemeFieldExtendDTO)mapIterator.getValue();
            dto.setCreated(Optional.ofNullable(dto.getCreated()).orElse(false));
            Boolean edited = dto.getEdited();
            if (specialFieldIds.contains(dto.getFieldId()) && ObjectUtils.isEmpty(edited)) {
                edited = true;
            } else {
                edited = Optional.ofNullable(dto.getEdited()).orElse(false);
            }
            dto.setEdited(edited);
            String rank = getRank(rankMap, createPageId, editPageId, dto);
            dto.setRank(rank);
            if (objectSchemeFieldExtendMapper.selectExtendFieldCount(dto.getIssueType(), dto.getOrganizationId(), dto.getFieldId(), dto.getProjectId()) == 0) {
                insertList.add(dto);
            }
        }
        //处理字段rank值相同的情况
        resetSameRank(insertList);
        int total = insertList.size();
        int step = 5000;
        int totalPage = total / step + 1;
        LOGGER.info("开始插入数据，数据量: {}, 每次插入{}条数据, 需要插入{}次", total, step, totalPage);
        for (int i = 0; i < totalPage; i++) {
            int startLine = i * step;
            int endLine =  (i + 1) * step > total ? total : (i + 1) * step;
            objectSchemeFieldExtendMapper.batchInsert(insertList.subList(startLine, endLine));
            LOGGER.info("第{}次插入成功", i+1);
        }
        LOGGER.info("迁移页面数据完成");
    }

    private void resetSameRank(List<ObjectSchemeFieldExtendDTO> insertList) {
        List<ObjectSchemeFieldExtendDTO> organizationLevels =
                insertList.stream().filter(i -> ObjectUtils.isEmpty(i.getProjectId())).collect(Collectors.toList());
        //根据组织id和issueType分组
        Map<Long, Map<String, List<ObjectSchemeFieldExtendDTO>>> organizationMap =
                organizationLevels
                        .stream()
                        .collect(Collectors.groupingBy(ObjectSchemeFieldExtendDTO::getOrganizationId,
                                Collectors.groupingBy(ObjectSchemeFieldExtendDTO::getIssueType)));
        foreachAndResetRank(organizationMap, "organization");

        List<ObjectSchemeFieldExtendDTO> projectLevels =
                insertList.stream().filter(i -> !ObjectUtils.isEmpty(i.getProjectId())).collect(Collectors.toList());
        //根据项目id和issueType分组
        Map<Long, Map<String, List<ObjectSchemeFieldExtendDTO>>> projectMap =
                projectLevels
                        .stream()
                        .collect(Collectors.groupingBy(ObjectSchemeFieldExtendDTO::getProjectId,
                                Collectors.groupingBy(ObjectSchemeFieldExtendDTO::getIssueType)));
        foreachAndResetRank(projectMap, "project");
    }

    private void foreachAndResetRank(Map<Long, Map<String, List<ObjectSchemeFieldExtendDTO>>> map,
                                     String level) {
        for (Map.Entry<Long, Map<String, List<ObjectSchemeFieldExtendDTO>>> entry : map.entrySet()) {
            Long id = entry.getKey();
            Map<String, List<ObjectSchemeFieldExtendDTO>> issueTypeMap = entry.getValue();
            for (Map.Entry<String, List<ObjectSchemeFieldExtendDTO>> e : issueTypeMap.entrySet()) {
                List<ObjectSchemeFieldExtendDTO> list = e.getValue();
                resetRank(list);
            }
            LOGGER.info("{} id = {}的字段重置rank值成功", level, id);
        }
    }

    private void resetRank(List<ObjectSchemeFieldExtendDTO> list) {
        //先按rank升序排列，rank值相同，按fieldId升序排列
        Collections.sort(list, new Comparator<ObjectSchemeFieldExtendDTO>() {
            @Override
            public int compare(ObjectSchemeFieldExtendDTO o1, ObjectSchemeFieldExtendDTO o2) {
                int result = o1.getRank().compareTo(o2.getRank());
                if (result == 0) {
                    return o2.getFieldId().compareTo(o1.getFieldId());
                }
                return result;
            }
        });
        String mid = RankUtil.mid();
        for (ObjectSchemeFieldExtendDTO dto : list) {
            dto.setRank(mid);
            mid = RankUtil.genNext(mid);
        }
    }

    protected void processFields(Long createPageId, Long editPageId, String schemeCode, MultiKeyMap dataMap, MultiKeyMap rankMap, Set<Long> specialFieldIds) {
        ObjectSchemeFieldDTO objectSchemeField = new ObjectSchemeFieldDTO();
        objectSchemeField.setSchemeCode(schemeCode);
        objectSchemeField.setSystem(true);

        generateDataMap(createPageId, editPageId, dataMap, objectSchemeField, rankMap, specialFieldIds);

        processEstimatedTime(dataMap, rankMap, editPageId);

        objectSchemeField.setSystem(false);
        generateDataMap(createPageId, editPageId, dataMap, objectSchemeField, rankMap, specialFieldIds);
    }

    protected void processEstimatedTime(MultiKeyMap dataMap, MultiKeyMap rankMap,
                                      Long editPageId) {
        LOGGER.info("处理预计开始时间和预计结束时间");
        String estimatedStartTime = "estimatedStartTime";
        String estimatedEndTime = "estimatedEndTime";
        ObjectSchemeFieldDTO example = new ObjectSchemeFieldDTO();
        example.setCode(estimatedStartTime);
        ObjectSchemeFieldDTO estimatedStartTimeField = objectSchemeFieldMapper.selectOne(example);
        example.setCode(estimatedEndTime);
        ObjectSchemeFieldDTO estimatedEndTimeField = objectSchemeFieldMapper.selectOne(example);
        if (!ObjectUtils.isEmpty(estimatedStartTimeField)
                && !ObjectUtils.isEmpty(estimatedEndTimeField)) {
            Set<Long> organizationIds = pageFieldMapper.selectOrganizationIds();
            List<IssueTypeDTO> issueTypeList = issueTypeMapper.selectByOrganizationIds(organizationIds);
            Map<Long, List<IssueTypeDTO>> issueTypeMap = issueTypeList.stream().collect(Collectors.groupingBy(IssueTypeDTO::getOrganizationId));
            //获取某个组织下的某个类型的最小rank值
            Map<Long, String> minRankMap = getMinRankMap(rankMap);

            String estimatedStartTimeFieldContext = estimatedStartTimeField.getContext();
            String[] estimatedStartTimeFieldContextArray = estimatedStartTimeFieldContext.split(",");

            String estimatedEndTimeFieldContext = estimatedEndTimeField.getContext();
            String[] estimatedEndTimeFieldContextArray = estimatedEndTimeFieldContext.split(",");

            organizationIds.forEach(o -> {
                List<IssueTypeDTO> issueTypes = issueTypeMap.get(o);
                if (ObjectUtils.isEmpty(issueTypes)) {
                    return;
                }
                List<IssueTypeDTO> filterIssueTypeList = filterIssueType(issueTypes, estimatedStartTimeFieldContextArray);
                fillInData(filterIssueTypeList, estimatedStartTimeField, o, dataMap, rankMap, minRankMap, editPageId, SystemFieldPageConfig.CommonField.ESTIMATED_START_TIME);

                filterIssueTypeList = filterIssueType(issueTypes, estimatedEndTimeFieldContextArray);
                fillInData(filterIssueTypeList, estimatedEndTimeField, o, dataMap, rankMap, minRankMap, editPageId, SystemFieldPageConfig.CommonField.ESTIMATED_END_TIME);
            });
        } else {
            throw new CommonException("系统字段缺失，字段estimatedStartTime或estimatedEndTime不存在");
        }
    }

    protected void fillInData(List<IssueTypeDTO> filterIssueTypeList,
                            ObjectSchemeFieldDTO field,
                            Long organizationId,
                            MultiKeyMap dataMap,
                            MultiKeyMap rankMap,
                            Map<Long, String> minRankMap,
                            Long editPageId,
                            SystemFieldPageConfig.CommonField commonField) {
        Long fieldId = field.getId();
        filterIssueTypeList.forEach(f -> {
            ObjectSchemeFieldExtendDTO dto = new ObjectSchemeFieldExtendDTO();
            dto.setFieldId(fieldId);
            dto.setOrganizationId(organizationId);
            dto.setIssueType(f.getTypeCode());
            dto.setIssueTypeId(f.getId());
            dto.setRequired(field.getRequired());
            dto.setCreated(commonField.created());
            dto.setEdited(commonField.edited());
            dataMap.put(fieldId, organizationId, null, f.getTypeCode(), dto);
            String minRank = minRankMap.get(organizationId);
            String rank;
            if (StringUtils.hasText(minRank)) {
                rank = RankUtil.genPre(minRank);
            } else {
                rank = RankUtil.mid();
            }
            minRankMap.put(organizationId, rank);
            rankMap.put(fieldId, organizationId, null, editPageId, rank);
        });
    }

    protected Map<Long, String> getMinRankMap(MultiKeyMap rankMap) {
        Map<Long, String> result = new HashMap<>();
        MapIterator iterator = rankMap.mapIterator();
        while (iterator.hasNext()) {
            iterator.next();
            MultiKey mk = (MultiKey) iterator.getKey();
            Long organizationId = (Long) mk.getKey(1);
            String rank = (String) iterator.getValue();
            String minRank = result.get(organizationId);
            if (ObjectUtils.isEmpty(minRank)) {
                result.put(organizationId, rank);
            } else {
                int compare = minRank.compareTo(rank);
                if (compare < 0) {
                    result.put(organizationId, minRank);
                } else {
                    result.put(organizationId, rank);
                }
            }
        }
        return result;
    }

    private String getRank(MultiKeyMap rankMap,
                           Long createPageId,
                           Long editPageId,
                           ObjectSchemeFieldExtendDTO fieldExtend) {
        Long fieldId = fieldExtend.getFieldId();
        Long organizationId = fieldExtend.getOrganizationId();
        Long projectId = fieldExtend.getProjectId();
        //优先使用编辑界面的顺序
        Object rank = rankMap.get(fieldId, organizationId, projectId, editPageId);
        if (!ObjectUtils.isEmpty(rank)) {
            return (String) rank;
        }
        rank = rankMap.get(fieldId, organizationId, projectId, createPageId);
        if (!ObjectUtils.isEmpty(rank)) {
            return (String) rank;
        }
        StringBuilder msgBuilder = new StringBuilder();
        msgBuilder
                .append("fieldId=")
                .append(fieldId)
                .append("的字段在组织organizationId=")
                .append(organizationId);
        if (!ObjectUtils.isEmpty(projectId)) {
            msgBuilder.append("项目projectId=").append(projectId);
        }
        String rankStr = RankUtil.mid();
        msgBuilder.append("下不存在排序值，生成随机rank值: ").append(rankStr);
        LOGGER.warn(msgBuilder.toString());
        return rankStr;
    }

    protected void generateDataMap(Long createPageId,
                                   Long editPageId,
                                   MultiKeyMap dataMap,
                                   ObjectSchemeFieldDTO objectSchemeField,
                                   MultiKeyMap rankMap,
                                   Set<Long> specialFieldIds) {
        if (Boolean.TRUE.equals(objectSchemeField.getSystem())) {
            LOGGER.info("处理系统字段");
        } else {
            LOGGER.info("处理自定义字段");
        }
        List<ObjectSchemeFieldDTO> fields = objectSchemeFieldMapper.selectFieldsWithPages(objectSchemeField);
        LOGGER.info("查询到{}条字段", fields.size());
        List<PageFieldDTO> pages = new ArrayList<>();
        fields.forEach(s -> {
            String code = s.getCode();
            pages.addAll(s.getPages());
            if (FieldCode.SUMMARY.equals(code)
                    || FieldCode.DESCRIPTION.equals(code)
                    || FieldCode.ISSUE_TYPE.equals(code)) {
                specialFieldIds.add(s.getId());
            }
        });
        Set<Long> organizationIds = pages.stream().map(PageFieldDTO::getOrganizationId).collect(Collectors.toSet());
        List<IssueTypeDTO> issueTypeList = issueTypeMapper.selectByOrganizationIds(organizationIds);
        Map<Long, List<IssueTypeDTO>> issueTypeMap = issueTypeList.stream().collect(Collectors.groupingBy(IssueTypeDTO::getOrganizationId));

        processFields(createPageId, editPageId, dataMap, rankMap, fields, issueTypeMap);
    }

    protected void processFields(Long createPageId,
                                 Long editPageId,
                                 MultiKeyMap dataMap,
                                 MultiKeyMap rankMap,
                                 List<ObjectSchemeFieldDTO> fields,
                                 Map<Long, List<IssueTypeDTO>> issueTypeMap) {
        fields.forEach(s -> {
            Boolean required = s.getRequired();
            String context = s.getContext();
            String[] contextArray = context.split(",");
            Long fieldId = s.getId();
            List<PageFieldDTO> pageFields = s.getPages();
            pageFields.forEach(p -> {
                Long organizationId = p.getOrganizationId();
                List<IssueTypeDTO> issueTypes = issueTypeMap.get(organizationId);
                issueTypes = filterIssueType(issueTypes, contextArray);
                String rank = p.getRank();
                rankMap.put(fieldId, organizationId, p.getProjectId(), p.getPageId(), rank);
                ObjectSchemeFieldExtendDTO carrier =
                        buildCarrier(createPageId, editPageId, required, fieldId, p, organizationId);
                issueTypes.forEach(i -> {
                    carrier.setIssueType(i.getTypeCode());
                    carrier.setIssueTypeId(i.getId());
                    getAndPutDataMap(dataMap, carrier);
                });
            });
        });
    }

    protected List<IssueTypeDTO> filterIssueType(List<IssueTypeDTO> issueTypes,
                                               String[] contextArray) {
        List<IssueTypeDTO> result = new ArrayList<>();
        List<String> contextList = Arrays.asList(contextArray);
        List<String> fixDataIssueTypes = Arrays.asList(ObjectSchemeFieldContext.FIX_DATA_ISSUE_TYPES);
        if (ObjectSchemeFieldContext.isGlobal(contextArray)) {
            issueTypes.forEach(i -> {
                if (fixDataIssueTypes.contains(i.getTypeCode())) {
                    result.add(i);
                }
            });
        } else {
            issueTypes.forEach(i -> {
                String typeCode = i.getTypeCode();
                if (contextList.contains(typeCode)
                        && fixDataIssueTypes.contains(typeCode)) {
                    result.add(i);
                }
            });
        }
        return result;
    }

    private ObjectSchemeFieldExtendDTO buildCarrier(Long createPageId,
                                                    Long editPageId,
                                                    Boolean required,
                                                    Long fieldId,
                                                    PageFieldDTO p,
                                                    Long organizationId) {
        Long projectId = p.getProjectId();
        Long pageId = p.getPageId();
        Boolean created = null;
        Boolean edited = null;
        if (createPageId.equals(pageId)) {
            created = p.getDisplay();
        }
        if (editPageId.equals(pageId)) {
            edited = p.getDisplay();
        }

        ObjectSchemeFieldExtendDTO carrier = new ObjectSchemeFieldExtendDTO();
        carrier.setOrganizationId(organizationId);
        carrier.setProjectId(projectId);
        carrier.setFieldId(fieldId);
        carrier.setRequired(required);
        carrier.setCreated(created);
        carrier.setEdited(edited);
        return carrier;
    }

    private void getAndPutDataMap(MultiKeyMap dataMap, ObjectSchemeFieldExtendDTO carrier) {
        Long issueTypeId = carrier.getIssueTypeId();
        Long fieldId = carrier.getFieldId();
        Long organizationId = carrier.getOrganizationId();
        Long projectId = carrier.getProjectId();
        String issueType = carrier.getIssueType();
        Boolean required = carrier.getRequired();
        Boolean created = carrier.getCreated();
        Boolean edited = carrier.getEdited();
        ObjectSchemeFieldExtendDTO dto =
                (ObjectSchemeFieldExtendDTO) dataMap.get(fieldId, organizationId, projectId, issueType);
        if (ObjectUtils.isEmpty(dto)) {
            dto = new ObjectSchemeFieldExtendDTO();
            dto.setIssueTypeId(issueTypeId);
            dto.setIssueType(issueType);
            dto.setOrganizationId(organizationId);
            dto.setProjectId(projectId);
            dto.setFieldId(fieldId);
            dto.setRequired(required);
            dto.setCreated(created);
            dto.setEdited(edited);
            dataMap.put(fieldId, organizationId, projectId, issueType, dto);
        } else {
            if (!ObjectUtils.isEmpty(created)) {
                dto.setCreated(created);
            }
            if (!ObjectUtils.isEmpty(edited)) {
                dto.setEdited(edited);
            }
            dto.setRequired(required);
        }
    }

    private Long getPageIdByCode(String code) {
        PageDTO pageExample = new PageDTO();
        pageExample.setPageCode(code);
        List<PageDTO> pages = pageMapper.select(pageExample);
        if (pages.isEmpty()) {
            String msg = "【迁移页面配置数据失败】fd_page中不存在code=" + code + "的数据";
            throw new CommonException(msg);
        }
        return pages.get(0).getId();
    }

    private  void fixStateMachineTransform(){
        LOGGER.info("开始修复状态机转换");
        // 查所有的状态机
        List<StatusMachineDTO> stateMachines = statusMachineMapper.selectAll();
        // 遍历修改
        for (StatusMachineDTO statusMachineDTO : stateMachines) {
            // 查询当前状态机所有的node
            List<StatusMachineNodeVO> statusMachineNodeVOS = stateMachineNodeService.queryByStateMachineId(statusMachineDTO.getOrganizationId(), statusMachineDTO.getId(), false);
            if (CollectionUtils.isEmpty(statusMachineNodeVOS)) {
                continue;
            }
            List<StatusMachineNodeVO> machineNodeVOS = statusMachineNodeVOS.stream().filter(v -> !NodeType.START.equals(v.getType())).collect(Collectors.toList());
            Map<Long, StatusMachineNodeVO> nodeVOMap = machineNodeVOS.stream().collect(Collectors.toMap(StatusMachineNodeVO::getId, Function.identity()));
            // 将转换到所有转换为多个transform
            List<StatusMachineTransformDTO> statusMachineTransformDTOS = statusMachineTransformMapper.queryByStateMachineIds(statusMachineDTO.getOrganizationId(), Arrays.asList(statusMachineDTO.getId()));
            List<StatusMachineTransformDTO> allTransforms = statusMachineTransformDTOS.stream().filter(x -> x.getType().equals(TransformType.ALL)).collect(Collectors.toList());
            if (!CollectionUtils.isEmpty(allTransforms)) {
                // 对tansform_all进行转换
                Map<Long, List<Long>> nodeMap = statusMachineTransformDTOS.stream().filter(x -> x.getType().equals(TransformType.CUSTOM)).collect(Collectors.groupingBy(StatusMachineTransformDTO::getStartNodeId, Collectors.mapping(StatusMachineTransformDTO::getEndNodeId, Collectors.toList())));
                List<StatusMachineTransformDTO> addTransform = new ArrayList<>();
                allTransforms.forEach(v -> {
                    Long startNode = v.getEndNodeId();
                    List<Long> endNodes = nodeMap.get(startNode);
                    if (CollectionUtils.isEmpty(endNodes)) {
                        endNodes = new ArrayList<>();
                    }
                    for (StatusMachineNodeVO node : machineNodeVOS) {
                        if (Boolean.FALSE.equals(endNodes.contains(node.getId()))) {
                            StatusMachineNodeVO nodeVO = nodeVOMap.get(startNode);
                            StatusMachineNodeVO endNodeVO = nodeVOMap.get(node.getId());
                            StatusMachineTransformDTO statusMachineTransformDTO = new StatusMachineTransformDTO();
                            statusMachineTransformDTO.setOrganizationId(statusMachineDTO.getOrganizationId());
                            statusMachineTransformDTO.setStartNodeId(startNode);
                            statusMachineTransformDTO.setEndNodeId(node.getId());
                            statusMachineTransformDTO.setName(nodeVO.getStatusVO().getName() + "转换到" + endNodeVO.getStatusVO().getName());
                            statusMachineTransformDTO.setStateMachineId(v.getStateMachineId());
                            statusMachineTransformDTO.setType(TransformType.CUSTOM);
                            statusMachineTransformDTO.setCreatedBy(0L);
                            statusMachineTransformDTO.setLastUpdatedBy(0L);
                            statusMachineTransformDTO.setConditionStrategy("condition_all");
                            addTransform.add(statusMachineTransformDTO);
                        }
                    }
                });
                // 批量增加
                statusMachineTransformMapper.batchInsert(addTransform);
            }
            // 查询有转换到自身的节点
            List<Long> existTransferOwnerNodeId = statusMachineTransformMapper.existTransferOwner(statusMachineDTO.getId());
            // 获取没有转换自身的节点
            Set<Long> allNodeId = nodeVOMap.keySet();
            allNodeId.removeAll(existTransferOwnerNodeId);
            if (!CollectionUtils.isEmpty(allNodeId)) {
                // 添加转换
                List<StatusMachineTransformDTO> transform = new ArrayList<>();
                allNodeId.forEach(v -> {
                    StatusMachineNodeVO nodeVO = nodeVOMap.get(v);
                    StatusMachineTransformDTO statusMachineTransformDTO = new StatusMachineTransformDTO();
                    statusMachineTransformDTO.setOrganizationId(statusMachineDTO.getOrganizationId());
                    statusMachineTransformDTO.setStartNodeId(v);
                    statusMachineTransformDTO.setEndNodeId(v);
                    statusMachineTransformDTO.setName(nodeVO.getStatusVO().getName() + "转换到" + nodeVO.getStatusVO().getName());
                    statusMachineTransformDTO.setStateMachineId(statusMachineDTO.getId());
                    statusMachineTransformDTO.setType(TransformType.CUSTOM);
                    statusMachineTransformDTO.setCreatedBy(0L);
                    statusMachineTransformDTO.setLastUpdatedBy(0L);
                    statusMachineTransformDTO.setConditionStrategy("condition_all");
                    transform.add(statusMachineTransformDTO);
                });
                statusMachineTransformMapper.batchInsert(transform);
            }
            LOGGER.info("修复状态机:Id:{},名称:{}的转换完成",statusMachineDTO.getId(),statusMachineDTO.getName());
        }
        // 删除所有type为transform_all的转换
        StatusMachineTransformDTO statusMachineTransformDTO = new StatusMachineTransformDTO();
        statusMachineTransformDTO.setType(TransformType.ALL);
        statusMachineTransformMapper.delete(statusMachineTransformDTO);
        LOGGER.info("修复状态机转换完成,共计修复:{}条", stateMachines.size());
    }

    protected void fixStateMachineByIssueTypeId(){
        LOGGER.info("开始修复项目所有问题类型的状态机");
        // 查询所有的项目
        List<Long> projectIds = projectInfoMapper.selectAll().stream().map(ProjectInfoDTO::getProjectId).collect(Collectors.toList());
        if (CollectionUtils.isEmpty(projectIds)) {
            return;
        }
        int total = projectIds.size();
        int size = 100;
        int totalPage = (int) Math.ceil(projectIds.size() / (size * 1.0));
        int totalSize = 0;
        for (int page = 0; page < totalPage; page++) {
            List<Long> list = projectIds.subList(page * size > total ? total : page * size, (page + 1) * size > total ? total : (page + 1) * size);
            List<ProjectVO> projectVOS = baseFeignClient.queryByIds(new HashSet<>(list)).getBody();
            for (ProjectVO projectVO : projectVOS) {
                LOGGER.info("开始修复{}-{}项目所有问题类型的状态机",projectVO.getId(),projectVO.getName());
                String applyType = "PROGRAM".equals(projectVO.getCategory()) ? "program" : "agile";
                if ("program".equals(applyType)) {
                    continue;
                }
                // 查询单个项目的问题类型(故事、特性、任务、子任务、bug)
                fixStateMachineApplyType(projectVO,applyType);
            }
            totalSize = totalSize + projectVOS.size();
        }
        LOGGER.info("项目的状态机修复完成:预计项目{}个", projectIds.size());
        LOGGER.info("项目的状态机修复完成:实际修复项目{}个", totalSize);
    }

    protected void fixStateMachineApplyType(ProjectVO projectVO,String applyType){
        ProjectConfigDTO projectConfigDTO = projectConfigMapper.queryBySchemeTypeAndApplyType(projectVO.getId(), SchemeType.ISSUE_TYPE, applyType);
        ProjectConfigDTO configDTO = projectConfigMapper.queryBySchemeTypeAndApplyType(projectVO.getId(), SchemeType.STATE_MACHINE, applyType);
        if (ObjectUtils.isEmpty(projectConfigDTO)) {
            return;
        }
        if (ObjectUtils.isEmpty(configDTO)) {
            return;
        }
        Long stateMachineSchemeId = configDTO.getSchemeId();
        Long schemeId = projectConfigDTO.getSchemeId();
        IssueTypeSchemeConfigDTO issueTypeSchemeConfigDTO = new IssueTypeSchemeConfigDTO();
        issueTypeSchemeConfigDTO.setSchemeId(schemeId);
        issueTypeSchemeConfigDTO.setOrganizationId(projectVO.getOrganizationId());
        List<IssueTypeSchemeConfigDTO> issueTypeSchemeConfigDTOS = issueTypeSchemeConfigMapper.select(issueTypeSchemeConfigDTO);
        if (CollectionUtils.isEmpty(issueTypeSchemeConfigDTOS)) {
            return;
        }
        List<Long> issueTypeIds = issueTypeSchemeConfigDTOS.stream().map(IssueTypeSchemeConfigDTO::getIssueTypeId).collect(Collectors.toList());
        if ("agile".equals(applyType)) {
            List<IssueTypeWithInfoDTO> issueTypeWithInfoDTOS = issueTypeMapper.queryIssueTypeList(projectVO.getOrganizationId(), issueTypeIds);
            if (!CollectionUtils.isEmpty(issueTypeSchemeConfigDTOS)) {
                issueTypeIds = issueTypeWithInfoDTOS.stream().filter(v -> !"feature".equals(v.getTypeCode())).map(IssueTypeWithInfoDTO::getId).collect(Collectors.toList());
            }
        }
        for (Long issueTypeId : issueTypeIds) {
            stateMachineSchemeConfigService.queryStatusMachineBySchemeIdAndIssueType(projectVO.getOrganizationId(), stateMachineSchemeId, issueTypeId);
        }
    }

}
