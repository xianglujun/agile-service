import { createContext } from 'react';
import IssueSearchStore from './store';
import { IssueSearchProps } from './index';

export interface IIssueSearchContext extends Omit<IssueSearchProps, 'onChange'> {
  store: IssueSearchStore

}

const context = createContext<IIssueSearchContext>({} as IIssueSearchContext);
export default context;
