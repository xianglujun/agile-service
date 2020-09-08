package io.choerodon.agile.infra.utils;

import io.choerodon.agile.api.vo.ProjectVO;
import io.choerodon.agile.api.vo.StatusMachineSchemeConfigVO;
import io.choerodon.agile.api.vo.StateMachineSchemeVO;
import io.choerodon.agile.infra.dto.ProjectConfigDTO;
import io.choerodon.agile.infra.dto.StatusMachineSchemeConfigDTO;
import io.choerodon.agile.infra.dto.StateMachineSchemeDTO;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author peng.jiang@hand-china.com
 */
public class ConvertUtils {
    private ConvertUtils() {
    }


    public static StateMachineSchemeVO convertStateMachineSchemeToVO(final StateMachineSchemeDTO scheme, final Map<Long, ProjectVO> projectMap) {
        ModelMapper modelMapper = new ModelMapper();
        StateMachineSchemeVO schemeVO = modelMapper.map(scheme, StateMachineSchemeVO.class);
        List<StatusMachineSchemeConfigDTO> schemeConfigs = scheme.getSchemeConfigs();
        if (null != schemeConfigs && !schemeConfigs.isEmpty()) {
            List<StatusMachineSchemeConfigVO> schemeConfigVOS = modelMapper.map(schemeConfigs, new TypeToken<List<StatusMachineSchemeConfigVO>>() {
            }.getType());
            schemeVO.setConfigVOS(schemeConfigVOS);
        }
        List<ProjectConfigDTO> projectConfigs = scheme.getProjectConfigs();
        if (null != projectConfigs && !projectConfigs.isEmpty()) {
            List<ProjectVO> projectVOS = new ArrayList<>(projectConfigs.size());
            for (ProjectConfigDTO config : projectConfigs) {
                ProjectVO projectVO = projectMap.get(config.getProjectId());
                if (projectVO != null) {
                    projectVOS.add(projectVO);
                }
            }
            schemeVO.setProjectVOS(projectVOS);
        }
        return schemeVO;
    }

    public static List<StateMachineSchemeVO> convertStateMachineSchemesToVOS(final List<StateMachineSchemeDTO> schemes, final Map<Long, ProjectVO> projectMap) {
        List<StateMachineSchemeVO> list = new ArrayList<>(schemes.size());
        for (StateMachineSchemeDTO scheme : schemes) {
            StateMachineSchemeVO schemeVO = convertStateMachineSchemeToVO(scheme, projectMap);
            list.add(schemeVO);
        }
        return list;
    }

}
