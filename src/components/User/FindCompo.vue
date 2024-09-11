<template>
  <div class="middle-component">
    <!-- 상단: 셀렉트바와 검색 버튼 -->
    <div class="search-bar">
      <select v-model="selectedRegion" @change="onRegionChange">
        <option value="" disabled selected>지역을 선택해주세요</option>
        <option v-for="region in regions" :key="region.id" :value="region.name">
          {{ region.name }}
        </option>
      </select>

      <select v-model="selectedCategory" @change="onCategoryChange">
        <option value="" disabled selected>의뢰 분야를 선택해주세요</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.name"
        >
          {{ category.name }}
        </option>
      </select>

      <button @click="onSearch">검색</button>
    </div>

    <!-- 중간: 광고 케러셀 -->
    <div class="carousel">
      <div
        class="carousel-wrapper"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div
          class="carousel-slide"
          v-for="(ad, index) in ads"
          :key="index"
          :style="{ backgroundImage: 'url(' + ad.image + ')' }"
        >
          <div class="ad-text">
            <h3>{{ ad.title }}</h3>
            <p>{{ ad.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedRegion: "",
      selectedCategory: "",
      regions: [
        { id: 1, name: "서울" },
        { id: 2, name: "경기" },
        { id: 3, name: "부산" },
      ],
      categories: [
        { id: 1, name: "법률 상담" },
        { id: 2, name: "탐정 조사" },
        { id: 3, name: "기타 의뢰" },
      ],
      ads: [
        {
          image: "/images/ad1.jpg",
          title: "딱 24시간 동안 담아보세요",
          description: "월간이구홈 테이블웨어 단독 ~61+12%",
        },
        {
          image: "/images/ad2.jpg",
          title: "추석선물 10%쿠폰",
          description: "지금 바로 적용 가능!",
        },
        {
          image: "/images/ad3.jpg",
          title: "봄 세일 시작!",
          description: "최대 50% 할인",
        },
      ],
      currentSlide: 0,
      slideInterval: null, // 슬라이드 자동 전환을 위한 변수
    };
  },
  methods: {
    onRegionChange() {
      console.log("Selected Region: ", this.selectedRegion);
    },
    onCategoryChange() {
      console.log("Selected Category: ", this.selectedCategory);
    },
    onSearch() {
      console.log("Searching with", this.selectedRegion, this.selectedCategory);
      // 검색 로직 추가
    },
    startSlideShow() {
      this.slideInterval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.ads.length;
      }, 3000); // 3초마다 슬라이드 전환
    },
    stopSlideShow() {
      clearInterval(this.slideInterval);
    },
  },
  mounted() {
    this.startSlideShow(); // 컴포넌트가 로드되면 슬라이드 쇼 시작
  },
  beforeUnmount() {
    this.stopSlideShow(); // 컴포넌트가 파괴되기 전에 슬라이드 쇼 정지
  },
};
</script>

<style scoped>
.middle-component {
  padding: 20px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  width: 40%;
}

button {
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #555;
}

.carousel {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.carousel-wrapper {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ad-text {
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  text-align: center;
}
</style>
