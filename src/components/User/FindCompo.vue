<template>
  <div class="middle-component">
    <div>
      <h2>홈즈 찾기</h2>
      <p>지역과 전문분야를 선택하여 직접 홈즈 찾기</p>
    </div>
    <div class="search-bar">
      <select v-model="selectedRegion" @change="onRegionChange">
        <option value="" disabled selected>활동 지역</option>
        <option
          v-for="location in locations"
          :key="location.locationId"
          :value="location.locationName"
        >
          {{ location.locationName }}
        </option>
      </select>

      <select v-model="selectedCategory" @change="onCategoryChange">
        <option value="" disabled selected>전문 분야</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>

      <button @click="detectiveSearch()">검색</button>
    </div>

    <div>
      <div class="city-title">지역별 홈즈가 궁금하신가요?</div>
      <div class="city-container">
        <div class="item" v-for="(city, index) in cities" :key="index" >
          <img :src="city.imgSrc" :alt="city.name" @click="detectiveSearch2(city.value)" />
          <p>{{ city.name }}</p>
        </div>
      </div>
    </div>

    <div>
      <div class="speciality-title">전문분야별 홈즈가 궁금하신가요?</div>
      <div class="special-container">
        <div
          class="special-item"
          v-for="(speciality, index) in specialities"
          :key="index"
        >
          <img
            :src="speciality.imgSrc"
            :alt="speciality.name"
            @click="detectiveSearch3(index)"
          />
          <p>{{ speciality.name }}</p>
        </div>
      </div>
    </div>

    <!-- 중간: 광고 케러셀 
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
    -->
  </div>
</template>

<script>
import locations from "@/assets/locations.json";

export default {
  data() {
    return {
      selectedRegion: "",
      selectedCategory: "",
      locations: locations,
      categories: [
        { id: 1, name: "가족" },
        { id: 2, name: "기업문제" },
        { id: 3, name: "디지털조사" },
        { id: 4, name: "민원대행" },
        { id: 5, name: "부동산" },
        { id: 6, name: "불법기기탐지" },
        { id: 7, name: "사기 및 분쟁" },
        { id: 8, name: "스토킹" },
        { id: 9, name: "아동 경호" },
        { id: 10, name: "사람 찾기" },
      ],
      cities: [
        { name: "서울", imgSrc: "/images/location.png", value:"서울특별시"},
        { name: "경기(인천)", imgSrc: "/images/location.png", value:"인천광역시" },
        { name: "강원", imgSrc: "/images/location.png", value:"강원도" },
        { name: "충북(세종)", imgSrc: "/images/location.png", value:"충청북도" },
        { name: "충남(대전)", imgSrc: "/images/location.png", value:"충청남도(대전,세종)" },
        { name: "전북", imgSrc: "/images/location.png", value:"전라북도" },
        { name: "전남(광주)", imgSrc: "/images/location.png", value:"전라남도(광주)" },
        { name: "경북(대구)", imgSrc: "/images/location.png", value:"경상북도(대구)" },
        { name: "경남(부산,울산)", imgSrc: "/images/location.png", value:"경상남도(부산,울산)" },
        { name: "제주", imgSrc: "/images/location.png", value:"제주특별자치도" },
      ],
      specialities: [
        { name: "가족문제", imgSrc: "/images/speciality.jpeg", id:1},
        { name: "기업문제", imgSrc: "/images/speciality.jpeg", id:2 },
        { name: "디지털조사", imgSrc: "/images/speciality.jpeg", id:3 },
        { name: "민원대행", imgSrc: "/images/speciality.jpeg", id:4 },
        { name: "부동산", imgSrc: "/images/speciality.jpeg", id:5 },
        { name: "불법기기탐지", imgSrc: "/images/speciality.jpeg", id:6 },
        { name: "사기및분쟁", imgSrc: "/images/speciality.jpeg", id:7 },
        { name: "스토킹", imgSrc: "/images/speciality.jpeg", id:8 },
        { name: "아동경호", imgSrc: "/images/speciality.jpeg", id:9 },
        { name: "사람찾기", imgSrc: "/images/speciality.jpeg", id:10 },
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
    detectiveSearch() {
      this.$router.push({ 
          path: '/detectivelist', 
          query: { location: this.selectedRegion, specialityId: this.selectedCategory }
      });
    },
    detectiveSearch2(name) {
      console.log(name)
      this.$router.push({ 
          path: '/detectivelist', 
          query: { location: name, specialityId: 0 }
      });
    },
    detectiveSearch3(index) {
      console.log(index+1)
      this.$router.push({ 
          path: '/detectivelist', 
          query: { location: "", specialityId: index+1 }
      });
    },
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

.city-title,
.speciality-title {
  font-size: 14px;
  font-weight: 600;
  font-family: math;
  margin: 20px 0;
}

.city-container,
.special-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.item,
.special-item {
  text-align: center;
  flex-basis: 18%; /* 한 행에 5개씩 들어가도록 조정 */
}

.item img,
.special-item img {
  width: 30px;
  height: 30px;
  padding: 7px;
  border-radius: 50%;
  border: 1px solid lightgray;
}

.item p,
.special-item p {
  font-size: 10px;
  margin-top: 5px;
}
</style>
