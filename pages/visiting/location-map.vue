<template>
	<view class="location-map">
		<u-navbar title="定位地址" placeholder bgColor="#FAF9F7">
			<u-icon slot="left" :name="aIcon('zuojiantou')" width="24" height="24" @click="handleBack"></u-icon>
		</u-navbar>
		<map
			:style="{ width: '100%', height: `calc(100vh - 44px - ${barHeight}px)` }"
			:latitude="latitude"
			:longitude="longitude"
			:markers="markers"
		></map>
	</view>
</template>

<script>
	export default {
		onLoad ({ latitude, longitude, name }) {
			this.latitude = latitude
			this.longitude = longitude
			this.markers = [{
				id: 1,
				latitude,
				longitude,
				iconPath: '/static/imgs/common/location.png',
				name,
				title: name
			}]
		},
		data () {
			return {
				markers: [],
				latitude: 0,
				longitude: 0
			}
		}
	}
</script>
