import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from 'choerodon-ui';
import classnames from 'classnames';
import TypeTag from '../../../../components/TypeTag';
import UserHead from '../../../../components/UserHead';
import StatusTag from '../../../../components/StatusTag';
import PriorityTag from '../../../../components/PriorityTag';
import './SprintIssue.less';

@observer
class SprintIssue extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (JSON.stringify(nextProps) === JSON.stringify(this.props)) {
      return false;
    }
    return true;
  }

  render() {
    const { item } = this.props;
    return (
      <div className={classnames('c7n-backlog-IssueCard')}>
        <div
          label="sprintIssue"
          className={classnames('c7n-backlog-IssueCard-left')}
        >
          <TypeTag
            data={item.issueTypeVO}
          />
          <div className="c7n-backlog-IssueCard-left-summaryContainer">
            <div className="c7n-backlog-IssueCard-left-issueNum" style={{ textDecoration: item.statusVO && item.statusVO.completed ? 'line-through' : 'none' }}>
              {`${item.issueNum}`}
            </div>
            <Tooltip title={item.summary} placement="topLeft">
              <div className="c7n-backlog-IssueCard-left-issueSummary">{item.summary}</div>
            </Tooltip>
          </div>
        </div>
        <div
          className={classnames('c7n-backlog-IssueCard-right')}
        >
          <div className={classnames('line-two-left')}>
            {item.versionNames.length > 0 ? (
              <Tooltip title={`版本: ${item.versionNames.join(', ')}`}>
                <span className="c7n-backlog-IssueCard-right-version container">
                  {item.versionNames.join(', ')}
                </span>
              </Tooltip>
            ) : ''}
            {item.epicName ? (
              <Tooltip title={`史诗: ${item.epicName}`}>
                <span
                  label="sprintIssue"
                  className="c7n-backlog-IssueCard-right-epic container"
                  style={{
                    color: item.color || item.epicColor,
                    border: `1px solid ${item.color || item.epicColor}`,
                  }}
                >
                  {item.epicName}
                </span>
              </Tooltip>
            ) : ''}
          </div>
          <div className={classnames('line-two-right')}>
            {item.assigneeId && (
              <UserHead
                user={{
                  id: item.assigneeId,
                  loginName: item.assigneeLoginName,
                  realName: item.assigneeRealName,
                  name: item.assigneeName,
                  avatar: item.imageUrl,
                }}
              />
            )}
            <Tooltip title={`状态: ${item.statusVO ? item.statusVO.name : ''}`}>
              <div className="c7n-backlog-IssueCard-right-status">
                <StatusTag
                  data={item.statusVO}
                />
              </div>
            </Tooltip>
            <Tooltip title={`优先级: ${item.priorityVO ? item.priorityVO.name : ''}`}>
              <PriorityTag priority={item.priorityVO} />
            </Tooltip>
            <Tooltip title={`故事点: ${item.storyPoints}`}>
              <div
                label="sprintIssue"
                className={classnames('c7n-backlog-IssueCard-right-storyPoint', {
                  visible: item.storyPoints && item.issueTypeVO && item.issueTypeVO.typeCode === 'story',
                })}
              >
                {item.storyPoints}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default SprintIssue;
