import React, { Component } from 'react';
import { stores, Choerodon } from '@choerodon/boot';
import { observer } from 'mobx-react';
import moment from 'moment';
import { Modal, Radio } from 'choerodon-ui';
import FileSaver from 'file-saver';
import IssueStore from '@/stores/project/issue/IssueStore';
import { find, unionBy } from 'lodash';
import { issueApi } from '@/api';
import SelectFocusLoad from '@/components/SelectFocusLoad';

const RadioGroup = Radio.Group;
const { AppState } = stores;
const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

let list = [];
@observer
class ExportIssue extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    mode: 'show',
    loading: false,
    sprints: [],
  }

  handleExportChange = (e) => {
    this.setState({
      mode: e.target.value,
    });
  }

  handleCancel = () => {
    IssueStore.setExportModalVisible(false);
  }

  getVisibleColumns = () => {
    const fieldTransform = {
      issueNum: 'issueNum',
      issueId: 'summary',
      //  "description":
      issueTypeId: 'typeName',
      //  "projectName":
      assigneeId: 'assigneeName',
      // "assigneeRealName":
      reporterId: 'reporterName',
      //  "reporterRealName":
      //   "resolution":
      statusId: 'statusName',
      issueSprintVOS: 'sprintName',
      // "creationDate":
      lastUpdateDate: 'lastUpdateDate',
      priorityId: 'priorityName',
      //  "subTask":
      //  "remainingTime":
      version: 'versionName',
      epic: 'epicName',
      label: 'labelName',
      storyPoints: 'storyPoints',
      component: 'componentName',
    };
    const { tableRef } = this.props;
    const columns = tableRef.current
      ? tableRef.current.tableStore.columns.filter((column) => column.name && !column.hidden)
      : [];
    return columns.map((column) => fieldTransform[column.name] || column.name);
  };

  /**
   * 输出 excel
   */
  exportExcel = () => {
    const { dataSet, issueSearchStore } = this.props;
    const searchDTO = issueSearchStore.getCustomFieldFilters();
    const { mode, sprints } = this.state;
    const field = find([...dataSet.fields.values()], (f) => f.order);
    const tableShowColumns = mode === 'all' ? [] : this.getVisibleColumns();
    const search = {
      ...searchDTO,
      exportFieldCodes: tableShowColumns,
    };
    this.setState({
      loading: true,
    });
    if (!issueSearchStore.isHasFilter) {
      search.otherArgs.sprint = sprints;
    }
    issueApi.export(search, field ? `${field.name},${field.order}` : undefined)
      .then((data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileName = `${AppState.currentMenuType.name}.xlsx`;
        FileSaver.saveAs(blob, fileName);
        Choerodon.prompt('导出成功');
        IssueStore.setExportModalVisible(false);
      }).finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  handleSprintChange = (sprints) => {
    this.setState({
      sprints,
    });
  }

  render() {
    const { mode, loading, sprints } = this.state;
    const { issueSearchStore } = this.props;
    const visible = IssueStore.exportModalVisible;
    const projectName = AppState.currentMenuType.name;

    return (
      <Modal
        title="问题列表导出确认"
        visible={visible}
        onOk={this.exportExcel}
        onCancel={this.handleCancel}
        confirmLoading={loading}
      >
        <div style={{ margin: '10px 0', display: 'inline-block' }}>
          <div>
            您正在导出
            {' '}
            <span style={{ fontWeight: 500 }}>{projectName}</span>
            {' '}
            的问题，请选择你需要导出的字段
          </div>
          {!issueSearchStore.isHasFilter && (
            <div style={{ display: 'flex' }}>
              <SelectFocusLoad
                style={{ flexGrow: 1, width: 0, marginTop: 10 }}
                type="sprint"
                loadWhenMount
                mode="multiple"
                showCheckAll={false}
                allowClear
                dropdownMatchSelectWidth={false}
                placeholder="冲刺"
                saveList={(v) => {
                  list = unionBy(list, v, 'sprintId');
                }}
                afterLoad={(data) => {
                  if (data && data.length > 0) {
                    const startedSprint = data.find((item) => item.statusCode === 'started');
                    if (startedSprint) {
                      this.setState({
                        sprints: [startedSprint.sprintId],
                      });
                    } else {
                      const closedSprints = data.filter((item) => item.statusCode === 'closed');
                      if (closedSprints && closedSprints.length) {
                        const closedSprintsSortByEndDate = closedSprints.sort((sprint1, sprint2) => { // 将团队下的冲刺按照开始时间先后进行排列，避免出现自定义冲刺开始时间比较小，确在后边的情况
                          if (moment(sprint1.actualEndDate).isBefore(moment(sprint2.actualEndDate))) {
                            return 1;
                          }
                          return -1;
                        });
                        this.setState({
                          sprints: [closedSprintsSortByEndDate[0].sprintId],
                        });
                      } else {
                        this.setState({
                          sprints: [data[0].sprintId],
                        });
                      }
                    }
                  }
                }}
                filter
                onChange={this.handleSprintChange}
                value={sprints}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                requestArgs={[]}
              />
            </div>
          )}
        </div>
        <br />
        <RadioGroup onChange={this.handleExportChange} value={mode}>
          <Radio style={radioStyle} value="show">当前页面显示字段</Radio>
          <Radio style={radioStyle} value="all">全部字段</Radio>
        </RadioGroup>
      </Modal>
    );
  }
}

ExportIssue.propTypes = {

};

export default ExportIssue;
