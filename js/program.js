// 전역 변수
let employees = [
    {
        id: 1,
        name: '현종윤',
        department: '개발팀',
        position: '대표',
        hireDate: '2020-03-15',
        phone: '010-1234-5678',
        email: 'jongyun@peoplehub.com',
    },
    {
        id: 2,
        name: '홍석현',
        department: '개발팀',
        position: 'UI/UX 디자이너',
        hireDate: '2021-07-10',
        phone: '010-2345-6789',
        email: 'hong@peoplehub.com',
    },
    {
        id: 3,
        name: '전우빈',
        department: '개발팀',
        position: '마케팅 매니저',
        hireDate: '2019-11-22',
        phone: '010-3456-7890',
        email: 'jwbin@peoplehub.com',
    },
];

let currentEmployeeId = null;
let nextEmployeeId = 6;

// 현재 시간 업데이트 함수
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    const dateString = now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });

    document.getElementById('currentTime').textContent = timeString;
    document.getElementById('currentDate').textContent = dateString;
}

// 출근 함수
function checkIn() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const timeString = now.toLocaleTimeString('ko-KR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });

    // 오늘 이미 출근했는지 확인
    const existingRecord = attendanceRecords.find(
        (record) => record.date === today,
    );
    if (existingRecord) {
        alert('오늘 이미 출근하셨습니다!');
        return;
    }

    // 새로운 출근 기록 생성
    todayRecord = {
        date: today,
        checkIn: timeString,
        checkInTime: now.getTime(),
        checkOut: null,
        checkOutTime: null,
        totalWorkTime: null,
    };

    // 기록 배열 맨 앞에 추가
    attendanceRecords.unshift(todayRecord);

    // UI 업데이트
    document.getElementById(
        'statusText',
    ).textContent = `${timeString}에 출근하셨습니다`;
    document.getElementById('checkInBtn').disabled = true;
    document.getElementById('checkOutBtn').disabled = false;

    // 근무시간 타이머 시작
    workStartTime = now.getTime();
    startWorkTimer();

    // 출퇴근 기록 다시 렌더링
    renderAttendanceRecords();

    alert(`출근 완료!\n시간: ${timeString}`);
}

// 퇴근 함수
function checkOut() {
    if (!todayRecord || !todayRecord.checkIn) {
        alert('먼저 출근을 해주세요!');
        return;
    }

    if (todayRecord.checkOut) {
        alert('오늘 이미 퇴근하셨습니다!');
        return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });

    // 퇴근 시간 기록
    todayRecord.checkOut = timeString;
    todayRecord.checkOutTime = now.getTime();

    // 총 근무시간 계산
    const workDuration = now.getTime() - todayRecord.checkInTime;
    const hours = Math.floor(workDuration / (1000 * 60 * 60));
    const minutes = Math.floor((workDuration % (1000 * 60 * 60)) / (1000 * 60));
    todayRecord.totalWorkTime = `${hours}시간 ${minutes}분`;

    // UI 업데이트
    document.getElementById(
        'statusText',
    ).textContent = `${timeString}에 퇴근하셨습니다`;
    document.getElementById('workTime').textContent = todayRecord.totalWorkTime;
    document.getElementById('checkOutBtn').disabled = true;

    // 타이머 정지
    if (workTimer) {
        clearInterval(workTimer);
        workTimer = null;
    }

    // 출퇴근 기록 다시 렌더링
    renderAttendanceRecords();

    alert(
        `퇴근 완료!\n시간: ${timeString}\n총 근무시간: ${todayRecord.totalWorkTime}`,
    );
}

// 근무시간 타이머 시작
function startWorkTimer() {
    if (workTimer) {
        clearInterval(workTimer);
    }

    workTimer = setInterval(() => {
        if (workStartTime) {
            const now = new Date().getTime();
            const workDuration = now - workStartTime;
            const hours = Math.floor(workDuration / (1000 * 60 * 60));
            const minutes = Math.floor(
                (workDuration % (1000 * 60 * 60)) / (1000 * 60),
            );
            const seconds = Math.floor((workDuration % (1000 * 60)) / 1000);

            const timeString = `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('workTime').textContent = timeString;
        }
    }, 1000);
}

// 출퇴근 기록 렌더링
function renderAttendanceRecords() {
    const container = document.getElementById('attendanceRecords');
    if (!container) return;

    container.innerHTML = '';

    // 최근 10개 기록만 표시
    const recentRecords = attendanceRecords.slice(0, 10);

    if (recentRecords.length === 0) {
        container.innerHTML =
            '<p style="text-align: center; color: #718096; padding: 20px;">출퇴근 기록이 없습니다.</p>';
        return;
    }

    recentRecords.forEach((record) => {
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record-item';

        const checkOutDisplay = record.checkOut || '--:--';
        const totalTimeDisplay = record.totalWorkTime || '근무 중';

        recordDiv.innerHTML = `
                    <div class="record-date">${record.date}</div>
                    <div class="record-times">
                        <div class="record-time in">출근: ${record.checkIn}</div>
                        <div class="record-time out">퇴근: ${checkOutDisplay}</div>
                    </div>
                    <div class="total-time">${totalTimeDisplay}</div>
                `;

        container.appendChild(recordDiv);
    });
}

// 근태 관리 변수
let attendanceRecords = [
    {
        date: '2025-07-01',
        checkIn: '09:15',
        checkInTime: new Date('2025-07-01 09:15').getTime(),
        checkOut: '18:30',
        checkOutTime: new Date('2025-07-01 18:30').getTime(),
        totalWorkTime: '9시간 15분',
    },
    {
        date: '2025-06-30',
        checkIn: '09:00',
        checkInTime: new Date('2025-06-30 09:00').getTime(),
        checkOut: '18:00',
        checkOutTime: new Date('2025-06-30 18:00').getTime(),
        totalWorkTime: '9시간 0분',
    },
];
let todayRecord = null;
let workStartTime = null;
let workTimer = null;

// 근태 관리 초기화 함수
function initializeAttendance() {
    // 오늘 날짜 확인
    const today = new Date().toISOString().split('T')[0];

    // 오늘의 출퇴근 기록이 있는지 확인
    todayRecord = attendanceRecords.find((record) => record.date === today);

    if (todayRecord) {
        // 오늘 이미 출근한 경우
        document.getElementById(
            'statusText',
        ).textContent = `${todayRecord.checkIn}에 출근하셨습니다`;
        document.getElementById('checkInBtn').disabled = true;

        if (todayRecord.checkOut) {
            // 이미 퇴근도 한 경우
            document.getElementById(
                'statusText',
            ).textContent = `${todayRecord.checkOut}에 퇴근하셨습니다`;
            document.getElementById('workTime').textContent =
                todayRecord.totalWorkTime;
            document.getElementById('checkOutBtn').disabled = true;
        } else {
            // 출근은 했지만 퇴근 안한 경우
            document.getElementById('checkOutBtn').disabled = false;
            workStartTime = todayRecord.checkInTime;
            startWorkTimer();
        }
    } else {
        // 오늘 아직 출근 안한 경우
        document.getElementById('statusText').textContent =
            '오늘 아직 출근하지 않았습니다';
        document.getElementById('workTime').textContent = '00:00:00';
        document.getElementById('checkInBtn').disabled = false;
        document.getElementById('checkOutBtn').disabled = true;
    }

    // 출퇴근 기록 렌더링
    renderAttendanceRecords();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function () {
    renderEmployeeTable();
    initializeAttendance();

    // 실시간 시계 시작
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

// 탭 전환 함수
function showTab(tabName) {
    // 모든 탭 비활성화
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach((tab) => tab.classList.remove('active'));
    contents.forEach((content) => content.classList.remove('active'));

    // 선택된 탭 활성화
    const clickedTab = document.querySelector(
        `[onclick="showTab('${tabName}')"]`,
    );
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    document.getElementById(tabName).classList.add('active');
}

// 직원 테이블 렌더링
function renderEmployeeTable(employeeList = employees) {
    const tbody = document.getElementById('employeeTableBody');
    tbody.innerHTML = '';

    employeeList.forEach((employee) => {
        const row = document.createElement('tr');

        // 이름의 첫 글자로 아바타 생성
        const initial = employee.name.charAt(0);

        row.innerHTML = `
                    <td>
                        <div class="employee-info">
                            <div class="avatar">${initial}</div>
                            <div>
                                <div style="font-weight: 600;">${employee.name}</div>
                                <div style="font-size: 0.9rem; color: #718096;">${employee.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>${employee.department}</td>
                    <td>${employee.position}</td>
                    <td>${employee.hireDate}</td>
                    <td>${employee.phone}</td>
                    <td>
                        <button class="btn btn-sm btn-view" onclick="viewEmployee(${employee.id})" title="상세보기">👁️</button>
                        <button class="btn btn-sm btn-edit" onclick="editEmployee(${employee.id})" title="수정" style="margin-left: 5px;">✏️</button>
                        <button class="btn btn-sm btn-delete" onclick="deleteEmployee(${employee.id})" title="삭제" style="margin-left: 5px;">🗑️</button>
                    </td>
                `;

        tbody.appendChild(row);
    });
}

// 직원 검색 함수
function searchEmployees() {
    const searchTerm = document
        .getElementById('employeeSearch')
        .value.toLowerCase();
    const filteredEmployees = employees.filter(
        (employee) =>
            employee.name.toLowerCase().includes(searchTerm) ||
            employee.department.toLowerCase().includes(searchTerm) ||
            employee.position.toLowerCase().includes(searchTerm),
    );
    renderEmployeeTable(filteredEmployees);
}

// 모달 열기/닫기
function openAddModal() {
    currentEmployeeId = null;
    document.getElementById('modalTitle').textContent = '직원 추가';
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeModal').classList.add('active');
}

function editEmployee(id) {
    const employee = employees.find((emp) => emp.id === id);
    if (!employee) return;

    currentEmployeeId = id;
    document.getElementById('modalTitle').textContent = '직원 정보 수정';

    // 폼에 기존 데이터 채우기
    document.getElementById('employeeName').value = employee.name;
    document.getElementById('employeeDepartment').value = employee.department;
    document.getElementById('employeePosition').value = employee.position;
    document.getElementById('employeeHireDate').value = employee.hireDate;
    document.getElementById('employeePhone').value = employee.phone;
    document.getElementById('employeeEmail').value = employee.email;

    document.getElementById('employeeModal').classList.add('active');
}

function viewEmployee(id) {
    const employee = employees.find((emp) => emp.id === id);
    if (!employee) {
        alert('직원을 찾을 수 없습니다.');
        return;
    }

    const joinDate = new Date(employee.hireDate);
    const today = new Date();
    const workYears = Math.floor(
        (today - joinDate) / (365.25 * 24 * 60 * 60 * 1000),
    );

    alert(
        `📋 직원 상세 정보\n\n👤 이름: ${employee.name}\n🏢 부서: ${employee.department}\n💼 직책: ${employee.position}\n📅 입사일: ${employee.hireDate}\n⏰ 근속년수: ${workYears}년\n📞 연락처: ${employee.phone}\n📧 이메일: ${employee.email}`,
    );
}

function deleteEmployee(id) {
    const employee = employees.find((emp) => emp.id === id);
    if (!employee) {
        alert('직원을 찾을 수 없습니다.');
        return;
    }

    if (confirm(`정말로 "${employee.name}" 직원을 삭제하시겠습니까?`)) {
        employees = employees.filter((emp) => emp.id !== id);
        renderEmployeeTable();
        alert('직원이 성공적으로 삭제되었습니다.');

        // 검색 중이었다면 검색 결과도 업데이트
        const searchTerm = document.getElementById('employeeSearch').value;
        if (searchTerm) {
            searchEmployees();
        }
    }
}

function closeModal() {
    document.getElementById('employeeModal').classList.remove('active');
}

// 폼 제출 처리
document
    .getElementById('employeeForm')
    .addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('employeeName').value.trim(),
            department: document.getElementById('employeeDepartment').value,
            position: document.getElementById('employeePosition').value.trim(),
            hireDate: document.getElementById('employeeHireDate').value,
            phone: document.getElementById('employeePhone').value.trim(),
            email: document.getElementById('employeeEmail').value.trim(),
        };

        // 유효성 검사
        if (
            !formData.name ||
            !formData.department ||
            !formData.position ||
            !formData.hireDate ||
            !formData.phone ||
            !formData.email
        ) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        // 이메일 중복 검사 (수정시 자신 제외)
        const emailExists = employees.some(
            (emp) =>
                emp.email === formData.email && emp.id !== currentEmployeeId,
        );
        if (emailExists) {
            alert('이미 사용 중인 이메일 주소입니다.');
            return;
        }

        if (currentEmployeeId) {
            // 기존 직원 수정
            const employeeIndex = employees.findIndex(
                (emp) => emp.id === currentEmployeeId,
            );
            if (employeeIndex !== -1) {
                employees[employeeIndex] = {
                    ...employees[employeeIndex],
                    ...formData,
                };
                alert('직원 정보가 성공적으로 수정되었습니다.');
            }
        } else {
            // 새 직원 추가
            const newEmployee = {
                id: nextEmployeeId++,
                ...formData,
            };
            employees.push(newEmployee);
            alert('새 직원이 성공적으로 추가되었습니다.');
        }

        renderEmployeeTable();
        closeModal();

        // 검색 중이었다면 검색 결과도 업데이트
        const searchTerm = document.getElementById('employeeSearch').value;
        if (searchTerm) {
            searchEmployees();
        }
    });

// 모달 외부 클릭 시 닫기
document
    .getElementById('employeeModal')
    .addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function () {
    renderEmployeeTable();
    initializeAttendance();

    // 실시간 시계 시작
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});
