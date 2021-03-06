import {
  observable, action, computed, runInAction,
} from 'mobx';
import { IReportContentType } from '@/common/types';
import { BurnDownConfig } from '@/components/charts/burn-down/useBurnDownReport';
import { SprintConfig } from '@/components/charts/sprint/useSprintReport';

export type IChartType = 'burndown' | 'sprint'

interface IBaseReportBlock {
  id: string
  title: string
  type: IReportContentType
}

export interface IReportChartBlock extends IBaseReportBlock {
  chartType: IChartType
  data: {
    filter: BurnDownConfig | SprintConfig
  }
}
export interface IReportListBlock extends IBaseReportBlock {
  data: {
    filter: any
  }
}
export interface IReportTextBlock extends IBaseReportBlock {
  data: string
}
export type IReportBlock = IReportTextBlock | IReportListBlock | IReportChartBlock
class ProjectReportStore {
  @observable blockList: IReportBlock[] = [{
    id: '1',
    title: '上周工作总结（文本标题）',
    type: 'text',
    data: '[{"insert":"描述内容\\n"}]',
  }, {
    id: '2',
    title: '上周未完成的工作项（列表标题）',
    type: 'list',
    data: {
      filter: {},
    },
  }, {
    id: '2',
    title: '上周未完成的工作项（图表标题）',
    type: 'chart',
    chartType: 'burndown',
    data: {
      filter: {
        type: 'issueCount',
        sprintId: '=xFlL48OlIBm6InJtxh7OA6pF-SWg1-_JQGrtR1P3sj4==',
        quickFilter: {
          onlyStory: false,
          onlyMe: true,
          quickFilters: [],
          personalFilters: [],
        },
        restDayShow: false,
      },
    },
  }, {
    id: '3',
    title: '上周未完成的工作项（图表标题）',
    type: 'chart',
    chartType: 'sprint',
    data: {
      filter: {
        sprintId: '=xFlL48OlIBm6InJtxh7OA6pF-SWg1-_JQGrtR1P3sj4==',
        quickFilter: {
          onlyStory: false,
          onlyMe: true,
          quickFilters: [],
          personalFilters: [],
        },
        restDayShow: false,
      },
    },
  }]
}

export default ProjectReportStore;
