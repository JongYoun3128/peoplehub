document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('aside nav ul li');
    const sections = document.querySelectorAll('main section');

    menuItems.forEach((menu, idx) => {
        menu.addEventListener('click', () => {
            menuItems.forEach((li) => li.classList.remove('active'));
            menu.classList.add('active');
            sections.forEach((sec, sidx) => {
                sec.classList.toggle('active', idx === sidx);
            });
        });
    });

    // 기본 첫 번째 메뉴 활성화
    menuItems[0].classList.add('active');
    sections[0].classList.add('active');

    // --- 메시지 모달 관련 ---
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const messageModal = document.getElementById('messageModal');
    const reserveBtn = document.getElementById('reserveBtn');
    const sendBtn = document.getElementById('sendBtn');
    const messageForm = document.getElementById('messageForm');
    const notificationList = document.getElementById('notificationList');

    function openModal() {
        messageModal.style.display = 'block';
    }
    function closeModal() {
        messageModal.style.display = 'none';
        messageForm.reset();
    }

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function (e) {
        if (e.target === messageModal) closeModal();
    });

    function addMessageToList(type) {
        const title = document.getElementById('msgTitle').value;
        const date = document.getElementById('msgDate').value;
        const time = document.getElementById('msgTime').value;
        const content = document.getElementById('msgContent').value;
        const receiver = document.getElementById('msgReceiver').value;
        let status = '';
        if (type === 'reserve') status = '예약메시지';
        else status = '발송완료';
        const now = new Date();
        let displayDate = date ? date : now.toISOString().slice(0, 10);
        let displayTime = time ? time : now.toTimeString().slice(0, 5);
        const li = document.createElement('li');
        li.innerHTML = `<span>[${displayDate} ${displayTime}] ${title} (${receiver})<br>${content}</span><span class="status">${status}</span>`;
        notificationList.prepend(li);
    }

    reserveBtn.addEventListener('click', function () {
        if (!messageForm.reportValidity()) return;
        addMessageToList('reserve');
        closeModal();
    });
    sendBtn.addEventListener('click', function () {
        if (!messageForm.reportValidity()) return;
        addMessageToList('send');
        closeModal();
    });

    // --- 근무일정 캘린더 관련 ---
    let monthYear = { year: 2025, month: 7 };
    const monthLabel = document.getElementById('monthLabel');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const weekCalendar = document.getElementById('weekCalendar');
    const monthCalendar = document.getElementById('monthCalendar');
    const monthRows = document.getElementById('monthRows');
    // 대시보드 캘린더 요소
    const dashboardMonthLabel = document.getElementById('dashboardMonthLabel');
    const dashboardPrevMonthBtn = document.getElementById('dashboardPrevMonthBtn');
    const dashboardNextMonthBtn = document.getElementById('dashboardNextMonthBtn');
    const dashboardMonthRows = document.getElementById('dashboardMonthRows');

    // 일정 저장: { 'YYYY-MM': { 'YYYY-MM-DD': [event, ...] } }
    let calendarEvents = {};

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function renderMonthCalendar() {
        monthRows.innerHTML = '';
        const { year, month } = monthYear;
        const firstDay = new Date(`${year}-${pad(month)}-01`).getDay();
        const totalDays = new Date(year, month, 0).getDate();
        monthLabel.textContent = `${year}년 ${month}월`;
        let day = 1;
        for (let row = 0; row < 6; row++) {
            let tr = document.createElement('tr');
            for (let col = 0; col < 7; col++) {
                let td = document.createElement('td');
                if (row === 0 && col < firstDay) {
                    td.innerHTML = '';
                } else if (day > totalDays) {
                    td.innerHTML = '';
                } else {
                    const dateStr = `${year}-${pad(month)}-${pad(day)}`;
                    td.setAttribute('data-date', dateStr);
                    td.innerHTML = `<div>${day}</div>`;
                    // 일정 표시
                    const events =
                        (calendarEvents[`${year}-${pad(month)}`] &&
                            calendarEvents[`${year}-${pad(month)}`][dateStr]) ||
                        [];
                    events.forEach((ev) => {
                        const eventDiv = document.createElement('div');
                        let typeClass = '';
                        if (ev.type === '회의') typeClass = 'type-meeting';
                        else if (ev.type === '업무') typeClass = 'type-work';
                        else if (ev.type === '외근') typeClass = 'type-out';
                        else if (ev.type === '출장') typeClass = 'type-trip';
                        else typeClass = 'type-etc';
                        eventDiv.className = 'calendar-event ' + typeClass;
                        eventDiv.innerHTML = `<b>[${ev.type}]</b> ${ev.title}`;
                        td.appendChild(eventDiv);
                    });
                    day++;
                }
                tr.appendChild(td);
            }
            monthRows.appendChild(tr);
        }
        // 대시보드 캘린더도 같이 렌더링
        renderDashboardMonthCalendar();
    }

    function renderDashboardMonthCalendar() {
        if (!dashboardMonthRows) return;
        dashboardMonthRows.innerHTML = '';
        const { year, month } = monthYear;
        const firstDay = new Date(`${year}-${pad(month)}-01`).getDay();
        const totalDays = new Date(year, month, 0).getDate();
        if (dashboardMonthLabel) dashboardMonthLabel.textContent = `${year}년 ${month}월`;
        let day = 1;
        for (let row = 0; row < 6; row++) {
            let tr = document.createElement('tr');
            for (let col = 0; col < 7; col++) {
                let td = document.createElement('td');
                if (row === 0 && col < firstDay) {
                    td.innerHTML = '';
                } else if (day > totalDays) {
                    td.innerHTML = '';
                } else {
                    const dateStr = `${year}-${pad(month)}-${pad(day)}`;
                    td.setAttribute('data-date', dateStr);
                    td.innerHTML = `<div>${day}</div>`;
                    // 일정 표시
                    const events =
                        (calendarEvents[`${year}-${pad(month)}`] &&
                            calendarEvents[`${year}-${pad(month)}`][dateStr]) ||
                        [];
                    events.forEach((ev) => {
                        const eventDiv = document.createElement('div');
                        let typeClass = '';
                        if (ev.type === '회의') typeClass = 'type-meeting';
                        else if (ev.type === '업무') typeClass = 'type-work';
                        else if (ev.type === '외근') typeClass = 'type-out';
                        else if (ev.type === '출장') typeClass = 'type-trip';
                        else typeClass = 'type-etc';
                        eventDiv.className = 'calendar-event ' + typeClass;
                        eventDiv.innerHTML = `<b>[${ev.type}]</b> ${ev.title}`;
                        td.appendChild(eventDiv);
                    });
                    day++;
                }
                tr.appendChild(td);
            }
            dashboardMonthRows.appendChild(tr);
        }
    }

    prevMonthBtn.addEventListener('click', function () {
        if (monthYear.month === 1) {
            monthYear.year--;
            monthYear.month = 12;
        } else {
            monthYear.month--;
        }
        renderMonthCalendar();
    });
    nextMonthBtn.addEventListener('click', function () {
        if (monthYear.month === 12) {
            monthYear.year++;
            monthYear.month = 1;
        } else {
            monthYear.month++;
        }
        renderMonthCalendar();
    });
    // 대시보드 캘린더 월 이동 버튼 이벤트
    if (dashboardPrevMonthBtn && dashboardNextMonthBtn) {
        dashboardPrevMonthBtn.addEventListener('click', function () {
            if (monthYear.month === 1) {
                monthYear.year--;
                monthYear.month = 12;
            } else {
                monthYear.month--;
            }
            renderMonthCalendar();
        });
        dashboardNextMonthBtn.addEventListener('click', function () {
            if (monthYear.month === 12) {
                monthYear.year++;
                monthYear.month = 1;
            } else {
                monthYear.month++;
            }
            renderMonthCalendar();
        });
    }

    // 일정추가 모달
    const openScheduleModalBtn = document.getElementById('openScheduleModalBtn');
    const closeScheduleModalBtn = document.getElementById('closeScheduleModalBtn');
    const scheduleModal = document.getElementById('scheduleModal');
    const scheduleForm = document.getElementById('scheduleForm');
    const saveScheduleBtn = document.getElementById('saveScheduleBtn');
    const cancelScheduleBtn = document.getElementById('cancelScheduleBtn');

    function openScheduleModal() {
        scheduleModal.style.display = 'block';
    }
    function closeScheduleModal() {
        scheduleModal.style.display = 'none';
        scheduleForm.reset();
    }
    openScheduleModalBtn.addEventListener('click', openScheduleModal);
    closeScheduleModalBtn.addEventListener('click', closeScheduleModal);
    cancelScheduleBtn.addEventListener('click', closeScheduleModal);
    window.addEventListener('click', function (e) {
        if (e.target === scheduleModal) closeScheduleModal();
    });

    // 일정 저장 및 캘린더에 표시 (기간 전체 등록)
    function addEventToCalendars({ title, desc, type, start, end, place, alarm, memo }) {
        // 시작~종료일 범위의 모든 날짜에 등록
        const startDate = new Date(start);
        const endDate = end ? new Date(end) : startDate;
        let cur = new Date(startDate);
        while (cur <= endDate) {
            const y = cur.getFullYear();
            const m = String(cur.getMonth() + 1).padStart(2, '0');
            const d = String(cur.getDate()).padStart(2, '0');
            const date = `${y}-${m}-${d}`;
            const ym = `${y}-${m}`;
            if (!calendarEvents[ym]) calendarEvents[ym] = {};
            if (!calendarEvents[ym][date]) calendarEvents[ym][date] = [];
            calendarEvents[ym][date].push({ title, desc, type, start, end, place, alarm, memo });
            cur.setDate(cur.getDate() + 1);
        }
        renderMonthCalendar();
        // 주간 캘린더에도 표시 (해당 주에 있으면)
        // (여기선 시작일만 표시)
        const weekCell = weekCalendar.querySelector(`td[data-date='${start.split('T')[0]}']`);
        if (weekCell) {
            const eventDiv = document.createElement('div');
            let typeClass = '';
            if (type === '회의') typeClass = 'type-meeting';
            else if (type === '업무') typeClass = 'type-work';
            else if (type === '외근') typeClass = 'type-out';
            else if (type === '출장') typeClass = 'type-trip';
            else typeClass = 'type-etc';
            eventDiv.className = 'calendar-event ' + typeClass;
            eventDiv.innerHTML = `<b>[${type}]</b> ${title}`;
            weekCell.appendChild(eventDiv);
        }
    }

    saveScheduleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (!scheduleForm.reportValidity()) return;
        const title = document.getElementById('scheduleTitleInput').value;
        const desc = document.getElementById('scheduleDescInput').value;
        const type = document.getElementById('scheduleTypeInput').value;
        const start = document.getElementById('scheduleStartInput').value;
        const end = document.getElementById('scheduleEndInput').value;
        const place = document.getElementById('schedulePlaceInput').value;
        const alarm = document.getElementById('scheduleAlarmInput').value;
        const memo = document.getElementById('scheduleMemoInput').value;
        // 월간 캘린더를 해당 년/월로 이동
        const [y, m] = start.split('T')[0].split('-');
        monthYear.year = parseInt(y, 10);
        monthYear.month = parseInt(m, 10);
        addEventToCalendars({ title, desc, type, start, end, place, alarm, memo });
        renderMonthCalendar();
        closeScheduleModal();
    });

    // --- 휴가관리 월간 캘린더 관련 ---
    let leaveMonthYear = { year: 2025, month: 7 };
    const leaveMonthLabel = document.getElementById('leaveMonthLabel');
    const leavePrevMonthBtn = document.getElementById('leavePrevMonthBtn');
    const leaveNextMonthBtn = document.getElementById('leaveNextMonthBtn');
    const leaveMonthRows = document.getElementById('leaveMonthRows');

    // 휴가 일정 예시 데이터
    let leaveEvents = {
        '2025-07': {
            
        },
    };

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function renderLeaveMonthCalendar() {
        leaveMonthRows.innerHTML = '';
        const { year, month } = leaveMonthYear;
        const firstDay = new Date(`${year}-${pad(month)}-01`).getDay();
        const totalDays = new Date(year, month, 0).getDate();
        leaveMonthLabel.textContent = `${year}년 ${month}월`;
        let day = 1;
        for (let row = 0; row < 6; row++) {
            let tr = document.createElement('tr');
            for (let col = 0; col < 7; col++) {
                let td = document.createElement('td');
                if (row === 0 && col < firstDay) {
                    td.innerHTML = '';
                } else if (day > totalDays) {
                    td.innerHTML = '';
                } else {
                    const dateStr = `${year}-${pad(month)}-${pad(day)}`;
                    td.setAttribute('data-date', dateStr);
                    td.innerHTML = `<div>${day}</div>`;
                    // 휴가 일정 표시
                    const events =
                        (leaveEvents[`${year}-${pad(month)}`] &&
                            leaveEvents[`${year}-${pad(month)}`][dateStr]) ||
                        [];
                    events.forEach((ev) => {
                        const eventDiv = document.createElement('div');
                        let typeClass = '';
                        if (ev.type === '휴가') typeClass = 'leave-type-holiday';
                        else if (ev.type === '연차') typeClass = 'leave-type-annual';
                        else if (ev.type === '반차') typeClass = 'leave-type-half';
                        eventDiv.className = 'calendar-event ' + typeClass;
                        eventDiv.innerHTML = `<span class=\"emoji\">${ev.emoji || ''}</span> ${ev.name} (${ev.type})`;
                        td.appendChild(eventDiv);
                    });
                    day++;
                }
                tr.appendChild(td);
            }
            leaveMonthRows.appendChild(tr);
        }
    }

    leavePrevMonthBtn.addEventListener('click', function () {
        if (leaveMonthYear.month === 1) {
            leaveMonthYear.year--;
            leaveMonthYear.month = 12;
        } else {
            leaveMonthYear.month--;
        }
        renderLeaveMonthCalendar();
        renderLeaveHistory();
    });
    leaveNextMonthBtn.addEventListener('click', function () {
        if (leaveMonthYear.month === 12) {
            leaveMonthYear.year++;
            leaveMonthYear.month = 1;
        } else {
            leaveMonthYear.month++;
        }
        renderLeaveMonthCalendar();
        renderLeaveHistory();
    });

    renderLeaveMonthCalendar();
    renderLeaveHistory();

    // --- 휴가신청 모달 관련 ---
    const openLeaveModalBtn = document.getElementById('openLeaveModalBtn');
    const closeLeaveModalBtn = document.getElementById('closeLeaveModalBtn');
    const leaveModal = document.getElementById('leaveModal');
    const addLeaveBtn = document.getElementById('addLeaveBtn');
    const leaveForm = document.getElementById('leaveForm');

    function openLeaveModal() {
        leaveModal.style.display = 'block';
    }
    function closeLeaveModal() {
        leaveModal.style.display = 'none';
        leaveForm.reset();
    }
    openLeaveModalBtn.addEventListener('click', openLeaveModal);
    closeLeaveModalBtn.addEventListener('click', closeLeaveModal);
    window.addEventListener('click', function (e) {
        if (e.target === leaveModal) closeLeaveModal();
    });

    addLeaveBtn.addEventListener('click', function () {
        if (!leaveForm.reportValidity()) return;
        const name = document.getElementById('leaveName').value;
        const startDate = document.getElementById('leaveStartDate').value;
        const endDate = document.getElementById('leaveEndDate').value;
        const type = document.getElementById('leaveType').value;
        const reason = document.getElementById('leaveReason').value;
        if (startDate > endDate) {
            alert('시작일이 종료일보다 늦을 수 없습니다.');
            return;
        }
        let current = new Date(startDate);
        const end = new Date(endDate);
        while (current <= end) {
            const y = current.getFullYear();
            const m = String(current.getMonth() + 1).padStart(2, '0');
            const d = String(current.getDate()).padStart(2, '0');
            const dateStr = `${y}-${m}-${d}`;
            const ym = `${y}-${m}`;
            if (!leaveEvents[ym]) leaveEvents[ym] = {};
            if (!leaveEvents[ym][dateStr]) leaveEvents[ym][dateStr] = [];
            leaveEvents[ym][dateStr].push({ name, type, emoji: '', reason });
            current.setDate(current.getDate() + 1);
        }
        // 월간 캘린더를 해당 년/월로 이동 (시작일 기준)
        const [sy, sm] = startDate.split('-');
        leaveMonthYear.year = parseInt(sy, 10);
        leaveMonthYear.month = parseInt(sm, 10);
        renderLeaveMonthCalendar();
        renderLeaveHistory();
        renderLeaveSummary();
        closeLeaveModal();
    });

    // --- 휴가신청 내역 렌더링 ---
    function renderLeaveHistory() {
        const historyDiv = document.getElementById('leaveHistory');
        let allEvents = [];
        // leaveEvents 구조: { 'YYYY-MM': { 'YYYY-MM-DD': [ {name, type, reason, ...}, ... ] } }
        Object.keys(leaveEvents).forEach((ym) => {
            Object.keys(leaveEvents[ym]).forEach((date) => {
                leaveEvents[ym][date].forEach((ev) => {
                    allEvents.push({
                        name: ev.name,
                        type: ev.type,
                        reason: ev.reason,
                        date: date,
                    });
                });
            });
        });
        // 날짜순 정렬
        allEvents.sort((a, b) => a.date.localeCompare(b.date));
        if (allEvents.length === 0) {
            historyDiv.innerHTML =
                '<h3>휴가 신청 내역</h3><div style="color:#888;">신청 내역이 없습니다.</div>';
            return;
        }
        let html =
            '<h3>휴가 신청 내역</h3>';
        allEvents.forEach((ev) => {
            
        });
        html += '</tbody></table>';
        historyDiv.innerHTML = html;
    }

    // --- 휴가신청 요약(잔여/사용 연차) 표 렌더링 ---
    function renderLeaveSummary() {
        const summaryBody = document.getElementById('leaveSummaryBody');
        if (!summaryBody) return;
        // 직원별 사용 연차 집계
        const BASIC_LEAVE = 15; // 기본 연차
        const summary = {};
        Object.keys(leaveEvents).forEach((ym) => {
            Object.keys(leaveEvents[ym]).forEach((date) => {
                leaveEvents[ym][date].forEach((ev) => {
                    if (!summary[ev.name]) summary[ev.name] = { used: 0 };
                    // 연차, 반차, 휴가 모두 1일로 가정, 반차는 0.5일로 처리 가능
                    if (ev.type === '반차') summary[ev.name].used += 0.5;
                    else summary[ev.name].used += 1;
                });
            });
        });
        // 표 갱신
        summaryBody.innerHTML = '';
        Object.keys(summary).forEach((name) => {
            const used = summary[name].used;
            const remain = BASIC_LEAVE - used;
            summaryBody.innerHTML += `
                <tr>
                    <td>${name}</td>
                    <td>${remain}일</td>
                    <td>${used}일</td>
                    <td><button class="leave-detail-btn">신청내역</button></td>
                    <td>정상</td>
                </tr>
            `;
        });
    }

    // --- 신청내역 모달 기능 ---
    const leaveDetailModal = document.getElementById('leaveDetailModal');
    const leaveDetailContent = document.getElementById('leaveDetailContent');
    const closeLeaveDetailModalBtn = document.getElementById('closeLeaveDetailModalBtn');
    // 모달 닫기
    function closeLeaveDetailModal() {
        leaveDetailModal.style.display = 'none';
        leaveDetailContent.innerHTML = '';
    }
    closeLeaveDetailModalBtn.addEventListener('click', closeLeaveDetailModal);
    window.addEventListener('click', function(e) {
        if (e.target === leaveDetailModal) closeLeaveDetailModal();
    });
    // 신청내역 버튼 이벤트 위임
    document.getElementById('leaveSummaryBody').addEventListener('click', function(e) {
        if (e.target.classList.contains('leave-detail-btn')) {
            const row = e.target.closest('tr');
            const name = row.querySelector('td').textContent;
            // 해당 직원의 신청내역 추출
            let details = [];
            Object.keys(leaveEvents).forEach((ym) => {
                Object.keys(leaveEvents[ym]).forEach((date) => {
                    leaveEvents[ym][date].forEach((ev) => {
                        if (ev.name === name) {
                            details.push({ date, type: ev.type, reason: ev.reason });
                        }
                    });
                });
            });
            // 날짜순 정렬
            details.sort((a, b) => a.date.localeCompare(b.date));
            // 내용 생성
            if (details.length === 0) {
                leaveDetailContent.innerHTML = '<div style="color:#888;">신청 내역이 없습니다.</div>';
            } else {
                let html = '<table class="leave-history-table"><thead><tr><th>날짜</th><th>휴가종류</th><th>사유</th></tr></thead><tbody>';
                details.forEach(ev => {
                    html += `<tr><td>${ev.date}</td><td>${ev.type}</td><td>${ev.reason}</td></tr>`;
                });
                html += '</tbody></table>';
                leaveDetailContent.innerHTML = html;
            }
            leaveDetailModal.style.display = 'block';
        }
    });

    // 페이지 로드시 요약 표도 초기 렌더링
    renderLeaveSummary();

    // 직원 추가 모달 관련
    // 직원 추가 모달 동작 및 표 추가/수정/삭제 기능
    const openEmployeeModalBtn = document.querySelector('#employee .add');
    const closeEmployeeModalBtn = document.getElementById('closeEmployeeModalBtn');
    const employeeModal = document.getElementById('employeeModal');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const employeeForm = document.getElementById('employeeForm');
    const employeeTableBody = document.querySelector('#employee table tbody');

    // 탭 전환
    const modalTabs = document.querySelectorAll('.employee-modal-tab');
    const modalPanels = document.querySelectorAll('.employee-modal-panel');
    modalTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        modalTabs.forEach(t => t.classList.remove('active'));
        modalPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      });
    });

    // 모달 열기/닫기
    openEmployeeModalBtn.addEventListener('click', function() {
      employeeModal.style.display = 'block';
    });
    closeEmployeeModalBtn.addEventListener('click', function() {
      employeeModal.style.display = 'none';
      employeeForm.reset();
    });
    window.addEventListener('click', function(e) {
      if (e.target === employeeModal) {
        employeeModal.style.display = 'none';
        employeeForm.reset();
      }
    });

    // 직원 추가/수정
    let editMode = false;
    let editingRow = null;
    employeeForm.onsubmit = function(e) {
      e.preventDefault();
      // 값 수집
      const empId = document.getElementById('empId').value;
      const empFirstName = document.getElementById('empFirstName').value;
      const empDept = document.getElementById('empDept').value;
      const empRank = document.getElementById('empRank').value;
      const empPhone = document.getElementById('empPhone').value;
      const empJoinDate = document.getElementById('empJoinDate').value;
      const empEmail = document.getElementById('empEmail').value;
      // 표에 추가/수정
      if (editMode && editingRow) {
        const tds = editingRow.querySelectorAll('td');
        tds[0].textContent = empId;
        tds[1].textContent = empFirstName;
        tds[2].textContent = empDept;
        tds[3].textContent = empRank;
        tds[4].textContent = empPhone;
        tds[5].textContent = empJoinDate;
        tds[6].textContent = empEmail;
        employeeModal.style.display = 'none';
        employeeForm.reset();
        editMode = false;
        editingRow = null;
        return;
      }
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${empId}</td>
        <td>${empFirstName}</td>
        <td>${empDept}</td>
        <td>${empRank}</td>
        <td>${empPhone}</td>
        <td>${empJoinDate}</td>
        <td>${empEmail}</td>
        <td class="employee_btn_04">
          <button class="edit-btn">수정</button><button class="delete-btn">삭제</button>
        </td>
      `;
      employeeTableBody.appendChild(row);
      employeeModal.style.display = 'none';
      employeeForm.reset();
    };

    // 수정/삭제 버튼 이벤트 위임
    employeeTableBody.addEventListener('click', function(e) {
      const target = e.target;
      const row = target.closest('tr');
      if (target.classList.contains('edit-btn')) {
        // 수정 모드 진입
        const tds = row.querySelectorAll('td');
        document.getElementById('empId').value = tds[0].textContent;
        document.getElementById('empFirstName').value = tds[1].textContent;
        document.getElementById('empDept').value = tds[2].textContent;
        document.getElementById('empRank').value = tds[3].textContent;
        document.getElementById('empPhone').value = tds[4].textContent;
        document.getElementById('empJoinDate').value = tds[5].textContent;
        document.getElementById('empEmail').value = tds[6].textContent;
        employeeModal.style.display = 'block';
        editMode = true;
        editingRow = row;
      } else if (target.classList.contains('delete-btn')) {
        if (confirm('정말 삭제하시겠습니까?')) {
          row.remove();
        }
      }
    });

    // 설정 페이지 탭 전환 기능
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsPanels = document.querySelectorAll('.settings-panel');
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            settingsTabs.forEach(t => t.classList.remove('active'));
            settingsPanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            document.getElementById('tab-' + target).classList.add('active');
        });
    });

    // 페이지 로드시 캘린더 렌더링
    renderMonthCalendar();
    renderDashboardMonthCalendar();
});
