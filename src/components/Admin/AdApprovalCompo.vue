<template>
  <div>
    <div class="find-container">
      <header class="find-header" @click="goBack">
        <button class="back-button">&lt;</button>
        <h2>홈즈 승인하기</h2>
        <span class="header-span"></span>
      </header>
      <div class="find-contain">
        <div class="filter-container">
          <select
            id="status-filter"
            v-model="statusFilter"
            @change="filterByStatus(statusFilter)"
          >
            <option value="PENDING">승인대기중</option>
            <option value="APPROVED">승인완료</option>
            <option value="REJECTED">승인거부</option>
          </select>
        </div>

        <div class="filterTest-container">
          <div
            v-for="(item, index) in filteredTest"
            :key="index"
            class="bordered-div"
          >
            <ul class="item-details">
              <li><strong>탐정 ID : </strong> {{ item.detectiveId }}</li>
              <li>
                <strong>탐정 이름 : </strong>
                {{ item.detectiveDetails.userName }}
              </li>
              <li>
                <strong>회사명 : </strong>
                {{ item.detectiveDetails.company }}
              </li>
              <li>
                <strong>전화번호 : </strong>
                {{ item.detectiveDetails.phoneNumber }}
              </li>
              <li>
                <strong>활동 지역 : </strong>
                {{ item.detectiveDetails.location }}
              </li>
              <li>
                <strong>전문 분야 : </strong>
                <span
                  v-for="(specialty, index) in item.detectiveDetails
                    .specialtiesName"
                  :key="index"
                  class="speciality-span"
                >
                  {{ specialty }}
                </span>
              </li>
              <li v-if="item.detectiveDetails.introduction != null">
                <strong>자기소개 :</strong>
                <div>
                  <textarea
                    v-model="item.detectiveDetails.introduction"
                    readonly
                    class="introduction-textarea"
                  >
                  </textarea>
                </div>
              </li>
              <li v-if="item.detectiveDetails.description != null">
                <strong>추가소개(경력 사항 등) : </strong>
                <div>
                  <textarea
                    v-model="item.detectiveDetails.description"
                    readonly
                    class="introduction-textarea"
                  >
                  </textarea>
                </div>
              </li>

              <li>
                <strong>탐정 프로필: </strong>
                <div>
                  <img
                    :src="getImageUrl(item.detectiveDetails.profilePicture)"
                    @click="showImgModal(item.detectiveDetails.profilePicture)"
                    class="thumbnail"
                  />
                </div>
              </li>

              <li>
                <strong>사업자 등록증 : </strong>
                <div>
                  <img
                    :src="
                      getImageUrl(item.detectiveDetails.businessRegistration)
                    "
                    @click="
                      showImgModal(item.detectiveDetails.businessRegistration)
                    "
                    class="thumbnail"
                  />
                </div>
              </li>
              <li>
                <strong>탐정의 등록증 : </strong>
                <div>
                  <img
                    :src="getImageUrl(item.detectiveDetails.detectiveLicense)"
                    @click="
                      showImgModal(item.detectiveDetails.detectiveLicense)
                    "
                    class="thumbnail detective-image"
                  />
                </div>
              </li>
              <li v-if="item.detectiveDetails.additionalCertifications != null">
                <strong>기타 자격사항 : </strong>
                <div>
                  <img
                    :src="
                      getImageUrl(
                        item.detectiveDetails.additionalCertifications
                      )
                    "
                    @click="
                      showImgModal(
                        item.detectiveDetails.additionalCertifications
                      )
                    "
                    class="thumbnail detective-image"
                  />
                </div>
              </li>

              <li>
                <strong>등록 일자 : </strong> {{ formatDate(item.createdAt) }}
              </li>
              <li>
                <strong>승인 상태 : </strong>
                <span v-if="item.approvalStatus === 'PENDING'" class="status"
                  >대기중</span
                >
                <span v-if="item.approvalStatus === 'APPROVED'" class="status"
                  >완료</span
                >
                <span v-if="item.approvalStatus === 'REJECTED'" class="status"
                  >거부</span
                >
              </li>
              <li v-if="statusFilter === 'REJECTED'">
                <strong>거절 사유 : </strong> {{ item.rejReason }}
              </li>
              <li v-if="statusFilter != 'PENDING'">
                <strong>관리자 승인 일자 : </strong>
                {{ formatDate(item.confirmedAt) }}
              </li>
            </ul>

            <!-- <div v-if="statusFilter === 'PENDING'" class="btn-div"> -->
            <div class="btn-div">
              <button @click="acceptbtn(item)" class="rej-button">수락</button>
              <button @click="openRejectModal(item)" class="rej-button">
                거절
              </button>
            </div>
          </div>

          <!-- 모달 -->
          <div v-if="showRejectModal" class="modal-overlay">
            <div class="modal">
              <h4>거절 사유</h4>
              <textarea
                v-model="rejReason"
                placeholder="거절 사유를 입력하세요"
                rows="4"
                cols="50"
                class="modal-textarea"
              ></textarea>
              <div class="btn">
                <button @click="confirmReject" class="rej-button">확인</button>
                <button @click="closeRejectModal" class="rej-button">
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const test = ref([]);
    const statusFilter = ref(""); // 현재 필터 상태
    const showRejectModal = ref(false);
    const selectedItem = ref(null);
    const rejReason = ref(""); // 모달 내 거절 사유

    // onMounted 훅을 사용하여 컴포넌트가 마운트되었을 때 데이터 가져오기
    onMounted(() => {
      statusFilter.value = "PENDING";
      test4();
    });

    // 데이터 가져오기 함수
    const test4 = async () => {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        // 1. 관리자의 승인 요청 데이터를 가져옴
        const response = await axios.get(
          "https://findmyholmes.store/admin/approvals"
        );
        const approvals = response.data; // 응답 데이터를 배열로 추가
        test.value = []; // 초기화

        // 2. 각 탐정 ID에 대한 상세 정보를 가져옴
        const detectivePromises = approvals.map(async (approval) => {
          if (approval.detectiveId) {
            try {
              // detectiveId로 탐정 정보를 가져옴
              const detectiveResponse = await axios.get(
                `https://findmyholmes.store/detective/${approval.detectiveId}`
              );
              return { ...approval, detectiveDetails: detectiveResponse.data }; // 탐정 정보를 병합
            } catch (error) {
              console.error(
                `탐정 정보 가져오는 중 오류 발생: detectiveId: ${approval.detectiveId}`,
                error
              );
              return approval; // 오류 발생 시 탐정 정보 없이 반환
            }
          } else {
            return approval; // 탐정 ID가 없으면 기존 approval 반환
          }
        });

        // 3. 탐정 정보를 모두 가져온 후 test 배열에 저장
        test.value = await Promise.all(detectivePromises);
        console.log("탐정 정보와 함께 가져온 승인 목록:", test.value);
      } catch (error) {
        console.error("승인 목록 데이터 가져오는 중 오류 발생:", error);
      }
    };

    // 항목 수락 처리 함수
    const acceptbtn = async (item) => {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        await axios.post("https://findmyholmes.store/admin/approvals/update", {
          id: item.id,
          detectiveId: item.detectiveId,
          approvalStatus: "accept",
          rejReason: "",
        });
        test4(); // 데이터 새로고침
      } catch (error) {
        console.error("Error accepting item:", error);
      }
    };

    // 항목 거절 처리 함수
    const confirmReject = async () => {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        await axios.post("https://findmyholmes.store/admin/approvals/update", {
          id: selectedItem.value.id,
          detectiveId: selectedItem.value.detectiveId,
          approvalStatus: "reject",
          rejReason: rejReason.value,
        });
        closeRejectModal(); // 모달 닫기
        test4(); // 데이터 새로고침
      } catch (error) {
        console.error("Error rejecting item:", error);
      }
    };

    // 모달 열기
    const openRejectModal = (item) => {
      selectedItem.value = item;
      showRejectModal.value = true;
    };

    // 모달 닫기
    const closeRejectModal = () => {
      showRejectModal.value = false;
      selectedItem.value = null;
      rejReason.value = ""; // 입력 필드 초기화
    };

    // 필터링된 test 배열을 계산된 속성으로 정의
    const filteredTest = computed(() => {
      if (!statusFilter.value) {
        return test.value;
      }
      return test.value.filter(
        (item) => item.approvalStatus === statusFilter.value
      );
    });

    // 필터 상태를 설정하는 함수
    const filterByStatus = (status) => {
      statusFilter.value = status;
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };

    // 이미지 URL 반환 함수
    const getImageUrl = (path) => {
      return `http://localhost:8080/${path}`;
    };

    return {
      test4,
      test,
      acceptbtn,
      confirmReject,
      filteredTest,
      filterByStatus,
      closeRejectModal,
      openRejectModal,
      showRejectModal,
      rejReason,
      statusFilter,
      formatDate,
      getImageUrl,
    };
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
  display: flex;
  flex-direction: column;
}

/* 필터 스타일 */
.filter-container {
  margin-bottom: 10px;
  text-align: end;
}

#status-filter {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* 테두리 있는 div 스타일 */
.bordered-div {
  border: 1px solid #a1a4a88a;
  padding: 15px;
  margin: 10px 0 25px 0;
  border-radius: 10px;
}

.item-details {
  list-style-type: none;
  padding: 0;
}

.item-details li {
  margin: 10px 3px;
  font-size: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #80808026;
}

.introduction-textarea {
  width: 100%;
  height: 200px;
  resize: none;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #80808069;
  line-height: 24px;
  margin-top: 10px;
}

.thumbnail {
  width: 150px;
  height: 150px;
  margin-top: 7px;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  z-index: 100;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 300px;
  width: 100%;
  border: solid 1px black;
}

.modal-textarea {
  width: 295px;
  resize: none;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #80808069;
  line-height: 24px;
}

.speciality-span {
  border: 1px solid #80808042;
  padding: 2px 4px;
  margin-right: 5px;
  border-radius: 10px;
  background-color: #80808017;
}

.status {
  border: 1px solid #80808047;
  padding: 3px 6px;
  border-radius: 10px;
  font-size: 13px;
  background-color: #f7f28463;
}

.btn {
  margin-top: 15px;
  text-align: center;
}

h4 {
  text-align: center;
  font-size: 15px;
}

.btn-div {
  text-align: end;
}

.rej-button {
  width: 60px;
  padding: 10px;
  border: 1px solid #eae8c1;
  border-radius: 5px;
  background-color: #ffdf3e9c;
  color: #46444a;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin: 7px;
}

.rej-button:hover {
  background-color: #ffdf3ec5;
}
</style>
