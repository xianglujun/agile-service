import React, { Fragment, useState } from 'react';
import {
  Radio, Select, message, Icon,
} from 'choerodon-ui';
import { loadComponents, deleteComponent } from '../../../../api/ComponentApi';
import './component.less';

const RadioGroup = Radio.Group;
const { Option } = Select;

const DeleteComponent = (props) => {
  const { modal, component } = props;
  const issueCount = component.get('issueCount');
  const componentId = component.get('componentId');
  const name = component.get('name');
  const [radio, setRadio] = useState(1);
  const [relatedComponentId, setRelatedComponentId] = useState(undefined);
  const [originComponents, setOriginComponents] = useState([]);
  const [filters, setFilters] = useState(
    {
      searchArgs: {},
      advancedSearchArgs: {
        defaultAssigneeRole: [],
        contents: [],
      },
    },
  );


  const onRadioChange = (e) => {
    setRadio(e.target.value);
  };

  const localDeleteComponent = async () => {
    let localRelatedComponentId;
    if (radio === 1) {
      localRelatedComponentId = 0;
    } else if (!relatedComponentId) {
      message.warning('请选择关联的模块');
      return false;
    } else {
      localRelatedComponentId = relatedComponentId;
    }
    await deleteComponent(componentId, localRelatedComponentId);
    props.onOk();
    return true;
  };
  modal.handleOk(localDeleteComponent);
  const handleRelatedComponentChange = (value) => {
    setRelatedComponentId(value);
  };

  const renderDelete = () => (
    <Fragment>
      <RadioGroup label="" onChange={onRadioChange} value={radio}>
        <Radio style={{ display: 'block' }} value={1}>
          删除模块
        </Radio>
        <Radio style={{ display: 'block', marginTop: 5 }} value={2}>
          删除模块，相关的问题关联到其他模块
        </Radio>
      </RadioGroup>
      {radio === 2 && (
        <Select
          label="模块"
          placeholder="请选择一个新的模块"
          style={{ width: '100%', marginTop: 15 }}
          value={relatedComponentId}
          onChange={handleRelatedComponentChange}
          onFocus={() => {
            loadComponents({ current: 1, pageSize: 999 }, filters, componentId).then((res) => {
              setOriginComponents(res.list);
            });
          }}
        >
          {originComponents && originComponents.map(c => (
            <Option key={c.componentId} value={c.componentId}>
              {c.name}
            </Option>
          ))}
        </Select>
      )}
    </Fragment>
  );
  return (
    <div>
      {
        issueCount ? (
          <Fragment>
            <div>
              <div>
                删除模块:
                <span style={{ margin: '0 10px', fontWeight: 500 }}>{name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                <Icon
                  style={{
                    color: '#d50000', fontSize: '16px', marginRight: 5,
                  }}
                  type="error"
                />
                当前有
                <span style={{ margin: '0 5px', color: 'red' }}>{issueCount}</span>
                个问题使用此模块
              </div>
              <div style={{ margin: '10px 0' }}>
                注意：将会从所有使用的问题中删除此模块，相关的问题可以选择关联到其他模块，或不关联模块。
              </div>
            </div>
            <div>{renderDelete()}</div>
          </Fragment>
        )
          : (
            <Fragment>
              确定要删除
              <span style={{ margin: '0 5px', fontWeight: 500 }}>{name}</span>
              模块吗？
            </Fragment>
          )
      }
    </div>
  );
};

export default DeleteComponent;
