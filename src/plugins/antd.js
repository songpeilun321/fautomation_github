import Vue from "vue";

import {
	ConfigProvider,
	Layout,
	Menu,
	Icon,
	Row,
	Col,
	DatePicker,
	Button,
	List,
	Pagination,
	Tag,
	Popconfirm,
	Input,
	Select,
	Upload,
	Form,
	message,
	Dropdown
} from "ant-design-vue";

Vue.use(ConfigProvider);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(DatePicker);
Vue.use(Input);
Vue.use(Button);
Vue.use(List);
Vue.use(Pagination);
Vue.use(Tag);
Vue.use(Popconfirm);
Vue.use(Select);
Vue.use(Upload);
Vue.use(Form);
Vue.use(Dropdown);
Vue.prototype.$message = message;
