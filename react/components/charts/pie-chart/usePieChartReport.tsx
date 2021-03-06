import {
  useEffect, useState, useCallback,
} from 'react';
import { axios } from '@choerodon/boot';
import {
  PieChartProps, IPieChartType, IPieData, IDimension,
} from '@/components/charts/pie-chart';
import { PieSearchProps } from '@/components/charts/pie-chart/search';
import { reportApi, sprintApi, versionApi } from '@/api';
import { ISprint, IVersion } from '@/common/types';

interface PieConfig {
  defaultType?: IPieChartType
}

function usePieChartReport(config?: PieConfig): [PieSearchProps, PieChartProps] {
  const [type, setType] = useState<IPieChartType>(config?.defaultType || 'assignee');
  const [loading, setLoading] = useState(false);
  const [chooseId, setChooseId] = useState<string | ''>('');
  const [chooseDimension, setChooseDimension] = useState<IDimension>('');
  const [data, setData] = useState<IPieData[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sprints, setSprints] = useState<ISprint[]>([]);
  const [versions, setVersions] = useState<IVersion[]>([]);

  const loadSprintsAndVersions = useCallback(() => {
    axios.all([
      sprintApi.loadSprints(['started', 'closed']),
      versionApi.loadNamesByStatus(),
    ])
      .then(axios.spread((sprintList: ISprint[], versionList: IVersion[]) => {
        setSprints(sprintList);
        setVersions(versionList);
      }));
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    reportApi.loadPie(type, chooseDimension === 'sprint' ? chooseId : '', chooseDimension === 'version' ? chooseId : '')
      .then((res: IPieData[]) => {
        const len = res.length;
        if (len) {
          const initColors = ['#9665E2', '#F0657D', '#FAD352', '#FF9915', '#45A3FC', '#3F51B5', '#47CBCA', '#59CB79', '#F953BA', '#D3D3D3'];
          if (len > 10) {
            for (let i = 10; i < len; i += 1) {
              // eslint-disable-next-line no-bitwise
              initColors.push(`#${(`00000${((Math.random() * 16777215 + 0.5) >> 0).toString(16)}`).slice(-6)}`);
            }
          }
          setColors(initColors);
          setData(res);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [chooseDimension, chooseId, type]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadSprintsAndVersions();
  }, [loadSprintsAndVersions]);

  const searchProps: PieSearchProps = {
    type,
    chooseId,
    sprints,
    versions,
    chooseDimension,
    setType,
    setChooseDimension,
    setChooseId,
  };
  const props: PieChartProps = {
    loading,
    type,
    data,
    colors,
    chooseDimension,
    chooseId,
    sprints,
    versions,
  };
  return [searchProps, props];
}

export default usePieChartReport;
