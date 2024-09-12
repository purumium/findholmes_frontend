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
          :value="category.name"
        >
          {{ category.name }}
        </option>
      </select>

      <button @click="detectiveSeahch()">검색</button>
    </div>

    <div>
      <div class="city-title">지역별 홈즈가 궁금하신가요?</div>
      <div class="city-container">
        <div class="item" v-for="(city, index) in cities" :key="index">
          <img :src="city.imgSrc" :alt="city.name" @click="detectiveSeahch()" />
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
            @click="detectiveSeahch()"
          />
          <p>{{ speciality.name }}</p>
        </div>
      </div>
    </div>
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
        { id: 1, name: "법률 상담" },
        { id: 2, name: "탐정 조사" },
        { id: 3, name: "기타 의뢰" },
      ],
      cities: [
        { name: "서울", imgSrc: "/images/location.png" },
        { name: "경기(인천)", imgSrc: "/images/location.png" },
        { name: "강원", imgSrc: "/images/location.png" },
        { name: "충북(세종)", imgSrc: "/images/location.png" },
        { name: "충남(대전)", imgSrc: "/images/location.png" },
        { name: "전북", imgSrc: "/images/location.png" },
        { name: "전남(광주)", imgSrc: "/images/location.png" },
        { name: "경북(대구)", imgSrc: "/images/location.png" },
        { name: "경남(부산,울산)", imgSrc: "/images/location.png" },
        { name: "제주", imgSrc: "/images/location.png" },
      ],
      specialities: [
        { name: "가족문제", imgSrc: "/images/speciality.png" },
        { name: "기업문제", imgSrc: "/images/speciality.png" },
        { name: "디지털조사", imgSrc: "/images/speciality.png" },
        { name: "민원대행", imgSrc: "/images/speciality.png" },
        { name: "부동산", imgSrc: "/images/speciality.png" },
        { name: "불법기기탐지", imgSrc: "/images/speciality.png" },
        { name: "사기및분쟁", imgSrc: "/images/speciality.png" },
        { name: "스토킹", imgSrc: "/images/speciality.png" },
        { name: "아동경호", imgSrc: "/images/speciality.png" },
        { name: "사람찾기", imgSrc: "/images/speciality.png" },
      ],
    };
  },
  methods: {
    detectiveSeahch() {
      this.$router.push("/detectivelist");
    },
    onSearch() {
      console.log("Searching with", this.selectedRegion, this.selectedCategory);
      // 검색 로직 추가
    },
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
