/* eslint-disable no-param-reassign */
/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import { Choerodon } from '@choerodon/boot';
import { Select } from 'choerodon-ui/pro';
import {
  quickFilterApi, personalFilterApi,
} from '@/api';
import './index.less';

const { Option, OptGroup } = Select;
interface IQuickFilter {
  description: string
  expressQuery: string
  filterId: string
  name: string
  objectVersionNumber: number
  projectId: number
  sequence: number
}
interface IPersonalFilter {
  filterId: string
  filterJson: string
  name: string
  objectVersionNumber: number
  projectId: number
  userId: string
}
interface Props {
  value?: string[] | null
  onChange?: (value: IQuickSearchValue) => void
}
interface IQuickSearchValue {
  onlyStory: boolean
  onlyMe: boolean
  quickFilters: string[]
  personalFilters: string[]
}

interface State {
  quickFilters: IQuickFilter[],
  personalFilters: IPersonalFilter[],
  value: IQuickSearchValue,
}
const SEPARATE = '%';

type IQuickSearchValueKey = keyof IQuickSearchValue
const valueToQuickSearchValue = (values: string[] | null): IQuickSearchValue => {
  const defaultValue = {
    onlyStory: false,
    onlyMe: false,
    quickFilters: [],
    personalFilters: [],
  };
  if (values) {
    return values.reduce((
      result: IQuickSearchValue,
      value,
    ) => {
      const [type, id] = value.split(SEPARATE) as ['commonly' | 'quick' | 'personal', string];
      switch (type) {
        case 'commonly': {
          if (id === 'onlyMe') {
            result.onlyMe = true;
          } else if (id === 'onlyStory') {
            result.onlyStory = true;
          }
          break;
        }
        case 'quick': {
          result.quickFilters.push(id);
          break;
        }
        case 'personal': {
          result.personalFilters.push(id);
          break;
        }
      }
      return result;
    }, defaultValue);
  }
  return defaultValue;
};
const QuickSearchValueToValue = (quickSearchValue: IQuickSearchValue): string[] => {
  const {
    onlyStory, onlyMe, quickFilters, personalFilters,
  } = quickSearchValue;
  let result = [];
  if (onlyStory) {
    result.push(`commonly${SEPARATE}${'onlyStory'}`);
  }
  if (onlyMe) {
    result.push(`commonly${SEPARATE}${'onlyMe'}`);
  }
  if (quickFilters.length > 0) {
    result = [...result, ...quickFilters.map((id) => `quick${SEPARATE}${id}`)];
  }
  if (personalFilters.length > 0) {
    result = [...result, ...personalFilters.map((id) => `personal${SEPARATE}${id}`)];
  }
  return result;
};
class QuickSearch extends Component<Props, State> {
  state: State = {
    quickFilters: [],
    personalFilters: [],
    value: {
      onlyMe: false,
      onlyStory: false,
      quickFilters: [],
      personalFilters: [],
    },
  };

  static getDerivedStateFromProps(nextProps: Props) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      };
    }
    return null;
  }

  componentDidMount() {
    Promise.all([
      quickFilterApi.loadAll(),
      personalFilterApi.loadAll(),
    ]).then(([quickFilters, personalFilters]) => {
      this.setState({
        quickFilters,
        personalFilters,
      });
    }).catch((error) => {
      Choerodon.prompt(error);
    });
  }

  triggerChange = (value: IQuickSearchValue) => {
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    if (onChange) {
      onChange(value);
    }
  }

  handleChange = (values: string[] | null) => {
    this.triggerChange(valueToQuickSearchValue(values));
  }

  renderCommonlyUsedOptions = () => (
    <OptGroup key="commonly" label="常用选项">
      <Option value={`commonly${SEPARATE}${'onlyMe'}`}>仅我的问题</Option>
      <Option value={`commonly${SEPARATE}${'onlyStory'}`}>仅故事</Option>
    </OptGroup>
  )

  renderQuickFiltersOptions = () => {
    const { quickFilters } = this.state;
    return (
      <OptGroup key="quick" label="快速筛选">
        {
          quickFilters.map((item) => (
            <Option
              value={`quick${SEPARATE}${item.filterId}`}
            >
              {item.name}
            </Option>
          ))
        }
      </OptGroup>
    );
  }

  renderUserFiltersOptions = () => {
    const { personalFilters } = this.state;
    return (
      <OptGroup key="personal" label="我的筛选">
        {
          personalFilters.map((item) => (
            <Option
              value={`personal${SEPARATE}${item.filterId}`}
            >
              {item.name}
            </Option>
          ))
        }
      </OptGroup>
    );
  }

  render() {
    const { value } = this.state;
    return (
      <Select
        multiple
        placeholder="快速搜索"
        onChange={this.handleChange}
        value={QuickSearchValueToValue(value)}
      >
        {this.renderCommonlyUsedOptions()}
        {this.renderQuickFiltersOptions()}
        {this.renderUserFiltersOptions()}
      </Select>
    );
  }
}

export default QuickSearch;