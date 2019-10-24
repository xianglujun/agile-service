import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Icon, Button, Tooltip } from 'choerodon-ui';
import { deleteDoc, loadDocs } from '../../../../api/NewIssueApi';
import Doc from '../../../Doc';
import DocItem from '../../Component/DocItem';
import EditIssueContext from '../../stores';
import Divider from './Divider';

const IssueDoc = observer(({ reloadIssue }) => {
  const [addDocShow, setAddDocShow] = useState(false);
  const { store, disabled } = useContext(EditIssueContext);
  const { issueId } = store.getIssue;
  const docs = store.getDoc;
  const onDeleteDoc = async (id) => {
    await deleteDoc(id);
    const res = await loadDocs(issueId);
    store.setDoc(res || []);
  };

  const onDocCreate = async () => {
    setAddDocShow(false);
    const res = await loadDocs(issueId);
    store.setDoc(res || []);
    if (reloadIssue) {
      reloadIssue();
    }
  };

  const renderDoc = () => (
    <div>
      {
        docs && docs.knowledgeRelationList
        && docs.knowledgeRelationList.map(doc => (
          <DocItem
            key={doc.id}
            doc={doc}
            onDeleteDoc={onDeleteDoc}
            type="narrow"
          />
        ))
      }
    </div>
  );

  return (
    <div id="doc">
      <Divider />
      <div className="c7n-title-wrapper">
        <div className="c7n-title-left">       
          <span>知识</span>
        </div>        
        {!disabled && (
          <div className="c7n-title-right" style={{ marginLeft: '14px' }}>
            <Tooltip placement="topRight" title="关联知识" getPopupContainer={triggerNode => triggerNode.parentNode}>
              <Button style={{ padding: '0 6px' }} className="leftBtn" funcType="flat" onClick={() => setAddDocShow(true)}>
                <Icon type="playlist_add icon" />
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
      {renderDoc()}
      {
        addDocShow ? (
          <Doc
            issueId={issueId}
            visible={addDocShow}
            onCancel={() => setAddDocShow(false)}
            onOk={onDocCreate}
            checkIds={docs ? docs.knowledgeRelationList.map(doc => doc.spaceId) : []}
          />
        ) : null
      }
    </div>
  );
});

export default IssueDoc;
