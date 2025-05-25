import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators';
import { login, register, userLogout } from '@/api/employee';
import { getToken, setToken, removeToken, getStoreId, setStoreId, removeStoreId, setUserInfo, getUserInfo, removeUserInfo } from '@/utils/cookies';
import store from '@/store';
import Cookies from 'js-cookie';
import { Message } from 'element-ui';
export interface IUserState {
  token: string
  name: string
  avatar: string
  storeId: string
  introduction: string
  userInfo: any
  roles: string[]
  userName: string
}

@Module({ 'dynamic': true, store, 'name': 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public id : number = null
  public avatar = ''
  // @ts-ignore
  public storeId: string = getStoreId() || ''
  public introduction = ''
  public userInfo = {}
  public role = ''
  public roles: string[] = []
  public userName = Cookies.get('userName') || ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token;
  }
  @Mutation
  private SET_ID(id: number) {
    this.id = id;
  }
  @Mutation
  private SET_ROLE(token: string) {
    this.token = token;
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name;
  }

  @Mutation
  private SET_USERINFO(userInfo: any) {
    this.userInfo = { ...userInfo };
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar;
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction;
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles;
  }

  @Mutation
  private SET_STOREID(storeId: string) {
    this.storeId = storeId;
  }
  @Mutation
  private SET_USERNAME(name: string) {
    this.userName = name;
  }

  @Action
  public async Login(userInfo: { userName: string, password: string }) { // TODO 登陆
    let { userName, password } = userInfo;
    userName = userName.trim();
    const { data } = await login({ userName, password });
    if (String(data.code) === '1') {
      console.log(data.data);
      if (data.data.role === 'admin') {
        this.SET_ROLE('admin');
        // 在登录逻辑中需要包含类似处理
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userInfo', JSON.stringify({
          role: 'admin' })); // 根据实际登录角色设置
      } else {
        localStorage.setItem('userInfo', JSON.stringify({
          role: 'user' })); // 根据实际登录角色设置
      }

      // 设置vuex中属性的值
      this.SET_USERNAME(userName);
      this.SET_TOKEN(data.data.token);
      this.SET_USERINFO(data.data);
      this.SET_ID(data.data.id);

      // 保存到Cookie中
      Cookies.set('userName', userName);
      Cookies.set('user_info', data.data);
      Cookies.set('token', data.data.token);
      return data;
    } else {
      return Message.error(data.msg);
    }
  }
  @Action
  // public async register(userInfo: { userName: string, password: string }) { // TODO 注册
  public async register(registerData) { // TODO 注册
    // let { userName, password } = userInfo;
    // userName = ruserName.trim();
    // const { data } = await register({ userName, password });
    const { data } = await register(registerData);
    if (String(data.code) === '1') {
      return Message.success('注册成功');
    } else {
      return Message.error('注册失败' + data.msg);
    }
  }
  @Action
  public ResetToken() {
    removeToken();
    this.SET_TOKEN('');
    this.SET_ROLES([]);
  }

  @Action
  public async changeStore(data: any) {
    this.SET_STOREID = data.data;
    this.SET_TOKEN(data.authorization);
    setStoreId(data.data);
    setToken(data.authorization);
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!');
    }

    const data = JSON.parse(<string>getUserInfo()); //  { roles: ['admin'], name: 'zhangsan', avatar: '/login', introduction: '' }
    if (!data) {
      throw Error('Verification failed, please Login again.');
    }

    const { roles, name, avatar, introduction, applicant, storeManagerName, storeId = '' } = data; // data.user
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!');
    }

    this.SET_ROLES(roles);
    this.SET_USERINFO(data);
    this.SET_NAME(name || applicant || storeManagerName);
    this.SET_AVATAR(avatar);
    this.SET_INTRODUCTION(introduction);
  }

  @Action
  public async LogOut() { // TODO 退出
    const { data } = await userLogout({});
    removeToken();
    this.SET_TOKEN('');
    this.SET_ROLES([]);
    Cookies.remove('userName');
    Cookies.remove('user_info');
    removeUserInfo();
  }
}

export const UserModule = getModule(User);
