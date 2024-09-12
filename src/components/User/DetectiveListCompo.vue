<template>
  <div class="middle-component">
    <div>
      <h2>홈즈 검색 결과</h2>
      <p>홈즈의 프로필을 확인하기</p>
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
          image: "/images/detective.jpg",
          title: "상담 시간: 24시간 언제든지 가능합니다",
          description: "전화 상담: 010-1234-5678",
        },
        {
          image: "/images/estimate.jpg",
          title: "셜록은 당신을 기다립니다",
          description: "전화 상담가느",
        },
        {
          image: "/images/request.jpg",
          title: "당신의 남편! 지켜봐 드립니다",
          description: "전화 상담: 010-1234-5678",
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
  padding: 30px 40px;
}

h2 {
  text-align: center;
  margin-bottom: -10px;
}

p {
  text-align: center;
  color: #666;
  font-size: 13px;
  margin-bottom: 25px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin: 45px 0px;
}

select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  width: 40%;
}

button {
  color: #3f3939;
  background-color: #efe7945e;
  border: 1px solid #d3cb3a5e;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  background-color: #e9e48db2;
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
  /* height: 400px; */
  /* max-height: 400px; */
  background-size: cover;
  background-position: center;
  position: relative;
  /* display: flex; */
  /* justify-content: center; */
}

.ad-text {
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  text-align: center;
  height: 400px;
  max-height: 400px;
}
</style>
