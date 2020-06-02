import {
  observable, action, computed, runInAction,
} from 'mobx';
import { stores } from '@choerodon/boot';
import { getProjectsInProgram, getProjectIsShowFeature, getIsOwner } from '@/api/CommonApi';

const { AppState } = stores;
/**
 * @param isInProgram 判断项目是否在项目群中
 * @param isShowFeature 判断项目是否显示特性 需先使用loadIsShowFeature 
 */
class IsInProgramStore {
  @observable isOwner = true;

  @observable isInProgram = false;

  @observable program = false;

  @observable isShowFeature = false; // 判断是否可以展示特性字段

  @observable artInfo = {};


  refresh = async () => {
    if (AppState.currentMenuType.category !== 'PROGRAM' && AppState.currentMenuType.type === 'project') {
      const program = await getProjectsInProgram();
      const hasProgram = Boolean(program);
      this.setIsInProgram(hasProgram);
      this.setProgram(program);
      if (hasProgram) {
        this.loadIsShowFeature();
      } else {
        this.setIsShowFeature(false);
      }
    }
  }


  @action setIsInProgram(isInProgram) {
    this.isInProgram = isInProgram;
  }

  @action setProgram(program) {
    this.program = program;
  }

  @computed get getIsInProgram() {
    return this.isInProgram;
  }

  @action setIsShowFeature(data) {
    this.isShowFeature = data;
  }

  @computed get getIsShowFeature() {
    return this.isShowFeature;
  }

  getIsOwner = async () => {
    const isOwner = await getIsOwner();
    this.setIsOwner(isOwner);
  }

  @action setIsOwner(data) {
    this.isOwner = data;
  }

  @action setArtInfo(data) {
    this.artInfo = data;
  }

  @computed get getArtInfo() {
    return this.artInfo;
  }


  loadIsShowFeature = async () => {
    const artInfo = await getProjectIsShowFeature();
    runInAction(() => {
      this.setArtInfo(artInfo);
      this.setIsShowFeature(Boolean(artInfo));
    });    
    return Boolean(artInfo);
  }
}


export default new IsInProgramStore();
