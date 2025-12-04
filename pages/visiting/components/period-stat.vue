<template>
	<view class="content-box">
		<view class="table-box" v-if="list.length">
			<view class="table-header">
				<view class="u-p-lr-10">时间</view>
				<view>拜访数</view>
				<view>环比</view>
			</view>
			<view class="table-tr" v-for="(item, index) in list" :key="index">
				<view class="u-p-lr-10">{{item.timeShow}}</view>
				<view>{{item.visitCount}}</view>
				<view v-if="item.flag === 1">
					<text class="iconfont icon-a-iconup u-error"></text>
					<text class="u-error">{{item.chainRatio}}</text>
				</view>
				<view v-else-if="item.flag === -1">
					<text class="iconfont icon-a-icondown u-success"></text>
					<text class="u-success">{{item.chainRatio}}</text>
				</view>
				<text v-else>-</text>
			</view>
		</view>
		<view class="empty-stat" v-else>
			<image src="../../../static/imgs/common/date-empty.png" class="empty-img"></image>
			<view class="u-tips-color">暂无统计数据，请入户拜访~</view>
		</view>
	</view>
</template>

<script>
	export default { props: { list: { type: Array, require: true } } }
</script>

<style lang="scss" scoped>
	.table-box {
		border: 1px solid #f5f3f0;
		border-radius: 8px;
	}
	
	.table-header {
		display: grid;
		grid-template-columns: 1fr 80px 80px;
		background-color: #FFF9F0;
		border-radius: 8px 8px 0 0;
		padding: 10px 0;
		color: $u-main-color;
	}
	
	.table-tr {
		display: grid;
		grid-template-columns: 1fr 80px 80px;
		border-bottom: 1px solid #f5f3f0;
		padding: 10px 0;
		color: $u-main-color;
		&:last-of-type {
			border-bottom: none;
		}
	}
	
	.empty-stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 50px 0;
	}
	
	.empty-img {
		width: 146px;
		height: 120px;
		margin-bottom: 24px;
	}
</style>
