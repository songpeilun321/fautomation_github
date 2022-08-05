<template>
	<div id="app">
		<a-config-provider :locale="locale">
			<the-layout v-if="$route.path !== '/login'">
				<router-view />
			</the-layout>
			<router-view v-else />
		</a-config-provider>
	</div>
</template>

<script>
	import zhCN from "ant-design-vue/es/locale/zh_CN";
	export default {
		data() {
			return {
				locale: zhCN
			};
		}
	};
</script>

<style lang="scss">
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		min-width: 1200px;
		height: 100%;
	}
</style>
