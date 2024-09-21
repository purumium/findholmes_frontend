<template>
  <div class="find-container">
    <header class="find-header" @click="goBack">
      <button class="back-button">&lt;</button>
      <h2>홈즈 찾기</h2>
      <span class="header-span"></span>
    </header>

    <section class="services">
      <div class="service-card">
        <img src="@/assets/main/service1.png" />
        <div>지역별, 전문 분야별 홈즈를 검색하고</div>
        <div>의뢰서를 직접 요청해보세요</div>
      </div>
    </section>

    <div class="find-contain">
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

        <button @click="detectiveSearch()" class="search-btn">검색</button>
      </div>

      <div class="city">
        <div class="city-title">지역별 홈즈가 궁금하신가요?</div>
        <div class="city-container">
          <div class="item" v-for="(city, index) in cities" :key="index">
            <img
              :src="city.imgSrc"
              :alt="city.name"
              @click="detectiveSearch2(city.value)"
            />
            <p>{{ city.name }}</p>
          </div>
        </div>
      </div>

      <div class="spaciality">
        <div class="speciality-title">전문분야별 홈즈가 궁금하신가요?</div>
        <div class="speciality-container">
          <div
            class="speciality-item"
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
        { name: "서울", imgSrc: "/images/location.png", value: "서울특별시" },
        {
          name: "경기(인천)",
          imgSrc: "/images/location.png",
          value: "인천광역시",
        },
        { name: "강원", imgSrc: "/images/location.png", value: "강원도" },
        {
          name: "충북(세종)",
          imgSrc: "/images/location.png",
          value: "충청북도",
        },
        {
          name: "충남(대전)",
          imgSrc: "/images/location.png",
          value: "충청남도(대전,세종)",
        },
        { name: "전북", imgSrc: "/images/location.png", value: "전라북도" },
        {
          name: "전남(광주)",
          imgSrc: "/images/location.png",
          value: "전라남도(광주)",
        },
        {
          name: "경북(대구)",
          imgSrc: "/images/location.png",
          value: "경상북도(대구)",
        },
        {
          name: "경남(부산,울산)",
          imgSrc: "/images/location.png",
          value: "경상남도(부산,울산)",
        },
        {
          name: "제주",
          imgSrc: "/images/location.png",
          value: "제주특별자치도",
        },
      ],
      specialities: [
        { name: "가족문제", imgSrc: "/images/speciality.png", id: 1 },
        { name: "기업문제", imgSrc: "/images/speciality.png", id: 2 },
        { name: "디지털조사", imgSrc: "/images/speciality.png", id: 3 },
        { name: "민원대행", imgSrc: "/images/speciality.png", id: 4 },
        { name: "부동산", imgSrc: "/images/speciality.png", id: 5 },
        { name: "불법기기탐지", imgSrc: "/images/speciality.png", id: 6 },
        { name: "사기및분쟁", imgSrc: "/images/speciality.png", id: 7 },
        { name: "스토킹", imgSrc: "/images/speciality.png", id: 8 },
        { name: "아동경호", imgSrc: "/images/speciality.png", id: 9 },
        { name: "사람찾기", imgSrc: "/images/speciality.png", id: 10 },
      ],
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    detectiveSearch() {
      this.$router.push({
        path: "/detectivelist",
        query: {
          location: this.selectedRegion,
          specialityId: this.selectedCategory,
        },
      });
    },
    detectiveSearch2(name) {
      console.log(name);
      this.$router.push({
        path: "/detectivelist",
        query: { location: name, specialityId: 0 },
      });
    },
    detectiveSearch3(index) {
      console.log(index + 1);
      this.$router.push({
        path: "/detectivelist",
        query: { location: "", specialityId: index + 1 },
      });
    },
  },
};
</script>

<style scoped>
.find-container {
  font-family: Arial, sans-serif;
}

.find-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #80808012;
}

.back-button {
  font-size: 21px;
  margin-left: 0px;
  padding: 8px 15px;
  background: none;
  border: none;
  cursor: pointer;
}

h2 {
  margin-left: -5px;
  font-size: 16px;
  font-weight: bold;
}

.header-span {
  color: #666;
  font-size: 12px;
  margin: 5px 0 0 5px;
}

.find-contain {
  margin: 25px 20px;
}

.services {
  text-align: center;
  margin-top: 20px;
}

.service-card {
  background-color: #c4c2ba17;
  padding: 15px 0;
}

.service-card img {
  height: 110px;
  width: 130px;
}

.service-card div {
  font-size: 13px;
  color: #190404;
  margin: 5px 0;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  border: 1px solid #8080803d;
  border-radius: 8px;
  padding: 9px 15px 9px 2px;
  margin-top: 30px;
}

select {
  padding: 9px 14px;
  border: 1px solid #cccccc00;
  border-radius: 5px;
  width: 40%;
}

.search-btn {
  color: #3f3939;
  background-color: #ffdf3e7a;
  border: 1px solid #d3cb3a5e;
  padding: 6px 12px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.search-btn:hover {
  background-color: #ffdf3e9c;
}

.city,
.spaciality {
  margin-top: 40px;
}

.city-title,
.speciality-title {
  font-size: 14px;
  font-weight: 600;
  font-family: math;
  margin: 25px 0;
}

.city-container,
.speciality-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.item,
.speciality-item {
  text-align: center;
  flex-basis: 18%; /* 한 행에 5개씩 들어가도록 조정 */
}

.item img,
.speciality-item img {
  width: 30px;
  height: 30px;
  padding: 7px;
  border-radius: 50%;
  border: 1px solid lightgray;
}

@media screen and (max-width: 768px) {
  p {
    font-size: 11px;
  }
}

@media screen and (max-width: 500px) {
  h2 {
    font-size: 14px;
  }

  .back-button {
    font-size: 15px;
    margin-left: 0px;
    padding: 8px 15px;
    background: none;
    border: none;
    cursor: pointer;
  }

  p {
    font-size: 10.5px;
    letter-spacing: -1px;
  }

  .search-bar {
    display: flex;
    justify-content: space-between;
    border: 1px solid #8080803d;
    border-radius: 8px;
    padding: 5px 15px 5px 2px;
    margin-top: 20px;
  }

  .city,
  .spaciality {
    margin-top: 30px;
  }

  city-title,
  .speciality-title {
    font-size: 14px;
    font-weight: 600;
    font-family: math;
    margin: 25px 0 20px 0;
  }

  select {
    padding: 5px 14px;
    border: 1px solid #cccccc00;
    border-radius: 5px;
    width: 40%;
    font-size: 12px;
  }
}
</style>
