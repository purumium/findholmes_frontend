<template>
  <div>
    <button @click="test4">{{ '승인하기' }}</button>
    <button @click="filterByStatus('PENDING')">PENDING</button>
    <button @click="filterByStatus('APPROVED')">APPROVED</button>
    <button @click="filterByStatus('REJECTED')">REJECTED</button>
  
    <!-- test 배열의 길이만큼 div를 동적으로 렌더링 -->
    <div v-for="(item, index) in filteredTest" :key="index" class="bordered-div">
      {{ item }}
      <button @click="acceptbtn(item)">수락</button>
      <button @click="openRejectModal(item)">거절</button>
      <!-- 현재 필터 상태를 표시 -->
      <p>Current filter: {{ statusFilter }}</p>
    </div>

    <!-- 모달 -->
    <div v-if="showRejectModal" class="modal-overlay">
      <div class="modal">
        <h3>거절 사유 입력</h3>
        <textarea v-model="rejReason" placeholder="거절 사유를 입력하세요..." rows="4" cols="50"></textarea>
        <button @click="confirmReject">확인</button>
        <button @click="closeRejectModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const test = ref([]);
    const statusFilter = ref(""); // 현재 필터 상태
    const showRejectModal = ref(false);
    const selectedItem = ref(null);
    const rejReason = ref(""); // 모달 내 거절 사유

    // onMounted 훅을 사용하여 컴포넌트가 마운트되었을 때 데이터 가져오기
    onMounted(() => {
      statusFilter.value = "PENDING"
      test4();
    });

    // 데이터 가져오기 함수
    const test4 = async () => {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await axios.get('/api/admin/approvals');
        test.value = response.data; // 응답 데이터를 배열로 추가
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // 항목 수락 처리 함수
    const acceptbtn = async (item) => {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      try {
        console.log(item)
        console.log(item.detectiveId)
        await axios.post('/api/admin/approvals/update', {
          id: item.id,
          detectiveId: item.detectiveId,
          approvalStatus: "accept",
          rejReason: ""
        });
        // statusFilter.value = "APPROVED"
        test4(); // 데이터 새로고침
        
      } catch (error) {
        console.error('Error accepting item:', error);
      }
    };

    // 항목 거절 처리 함수
    const confirmReject = async () => {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log(selectedItem.value)
      console.log(selectedItem.value.id)
      console.log(rejReason.value)
      try {
        await axios.post('/api/admin/approvals/update', {
          id: selectedItem.value.id,
          detectiveId: selectedItem.value.id,
          approvalStatus: "reject",
          rejReason: rejReason.value
        });
        // statusFilter.value = "REJECTED"
        test4(); // 데이터 새로고침
        closeRejectModal(); // 모달 닫기
      } catch (error) {
        console.error('Error rejecting item:', error);
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
      return test.value.filter(item => item.approvalStatus === statusFilter.value);
    });

    // 필터 상태를 설정하는 함수
    const filterByStatus = (status) => {
      statusFilter.value = status;
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
      statusFilter 
    };
  }
}
</script>

<style>
/* 테두리 있는 div 스타일 */
.bordered-div {
  border: 1px solid red;
  padding: 10px;
  margin: 10px 0;
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
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 600px;
  width: 100%;
  border: solid 1px black;
}
</style>
