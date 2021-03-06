import React, { useMemo, useState, useCallback } from 'react';
import {
  Button, Modal, Spin, Tooltip,
} from 'choerodon-ui/pro';
import Measure from 'react-measure';
import { observer } from 'mobx-react-lite';
import STATUS from '@/constants/STATUS';
import { IStatusCirculation } from '@/api';
import Table, { ColumnsType } from 'antd/lib/table';
import 'antd/lib/table/style';
import { useStateMachineContext } from '@/routes/StateMachine/context';
import { useStatusCirculationContext } from '../..';
import Checkbox from './Checkbox';
import DeleteStatus from './DeleteStatus';
import styles from './index.less';

const StatusCirculationTable: React.FC = () => {
  const [height, setHeight] = useState<number>(0);
  const { store } = useStatusCirculationContext();
  const { selectedType } = useStateMachineContext();
  const { statusList, loading } = store;
  const handleDeleteClick = useCallback((record: IStatusCirculation) => {
    Modal.open({
      title: `确认删除状态“${record.name}”`,
      children: <DeleteStatus
        data={record}
        selectedType={selectedType}
        onSubmit={async () => {
          store.clearStatusActions(record.id);
          store.getStatusList(selectedType);
        }}
      />,
    });
  }, [selectedType, store]);
  const { data } = store;
  const statusColumns: ColumnsType<IStatusCirculation> = useMemo(() => statusList.map((status) => ({
    dataIndex: status.name,
    width: 150,
    title: <span style={{ color: STATUS[status.type], fontWeight: 500 }}>{status.name}</span>,
    render: ((text: string, record) => (
      <Checkbox store={store} status={status} record={record} />
    )),
  })), [statusList, store]);
  const columns: ColumnsType<IStatusCirculation> = useMemo(() => [{
    dataIndex: 'name',
    width: 150,
    fixed: true,
    title: null,
    render: ((text: string, record) => (
      <span style={{ color: STATUS[record.type], fontWeight: 500 }}>
        {record.name}
        {record.defaultStatus && <span className={styles.default_status}>初始</span>}
      </span>
    )),
  }, {
    dataIndex: 'operate',
    width: 100,
    fixed: true,
    title: () => null,
    render: (() => '可流转到'),
  },
  ...statusColumns,
  {
    dataIndex: 'delete',
    width: 60,
    fixed: 'right',
    align: 'center',
    title: null,
    render: ((text: string, record) => {
      let disabled: [boolean, null | string] = [false, null];
      if (record.hasIssue) {
        disabled = [true, '该状态已被使用，不可删除'];
      }
      if (record.defaultStatus) {
        disabled = [true, '初始状态不可删除'];
      }
      return (
        <div>
          <Tooltip title={disabled[1]}>
            <Button
              disabled={disabled[0]}
              icon="delete"
              onClick={() => handleDeleteClick(record)}
            />
          </Tooltip>
        </div>
      );
    }

    ),
  }], [handleDeleteClick, statusColumns]);
  return (
    <Measure
      bounds
      onResize={(contentRect) => {
        if (contentRect.bounds?.height !== height) {
          setHeight(contentRect.bounds?.height || 0);
        }
      }}
    >
      {({ measureRef }) => (
        <div ref={measureRef} className={styles.table}>
          <Spin spinning={loading}>
            <Table
              size="small"
              dataSource={data}
              scroll={{ x: 'max-content', y: height - 50 }}
              columns={statusColumns.length > 0 ? columns : []}
              pagination={false}
              locale={{
                emptyText: '暂无数据',
              }}
            />
          </Spin>
        </div>
      )}
    </Measure>
  );
};
export default observer(StatusCirculationTable);
