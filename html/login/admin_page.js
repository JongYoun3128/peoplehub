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
                        eventDiv.className = 'calendar-event';
                        eventDiv.innerHTML = `<span class=\"emoji\">${ev.emojis.join(
                            ' ',
                        )}</span> ${ev.title}`;
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
                        eventDiv.className = 'calendar-event';
                        eventDiv.innerHTML = `<span class=\"emoji\">${ev.emojis.join(
                            ' ',
                        )}</span> ${ev.title}`;
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
    const openScheduleModalBtn = document.getElementById(
        'openScheduleModalBtn',
    );
    const closeScheduleModalBtn = document.getElementById(
        'closeScheduleModalBtn',
    );
    const scheduleModal = document.getElementById('scheduleModal');
    const scheduleForm = document.getElementById('scheduleForm');
    const addScheduleBtn = document.getElementById('addScheduleBtn');
    const emojiPicker = document.getElementById('emojiPicker');
    const selectedEmojisDiv = document.getElementById('selectedEmojis');

    let selectedEmojis = [];

    function openScheduleModal() {
        scheduleModal.style.display = 'block';
    }
    function closeScheduleModal() {
        scheduleModal.style.display = 'none';
        scheduleForm.reset();
        selectedEmojis = [];
        updateSelectedEmojis();
        // 선택된 버튼 초기화
        emojiPicker
            .querySelectorAll('.emoji-btn')
            .forEach((btn) => btn.classList.remove('selected'));
    }
    openScheduleModalBtn.addEventListener('click', openScheduleModal);
    closeScheduleModalBtn.addEventListener('click', closeScheduleModal);
    window.addEventListener('click', function (e) {
        if (e.target === scheduleModal) closeScheduleModal();
    });

    // 이모티콘 선택/해제
    emojiPicker.querySelectorAll('.emoji-btn').forEach((btn) => {
        btn.addEventListener('click', function () {
            const emoji = btn.textContent;
            if (selectedEmojis.includes(emoji)) {
                selectedEmojis = selectedEmojis.filter((e) => e !== emoji);
                btn.classList.remove('selected');
            } else {
                selectedEmojis.push(emoji);
                btn.classList.add('selected');
            }
            updateSelectedEmojis();
        });
    });
    function updateSelectedEmojis() {
        selectedEmojisDiv.innerHTML = selectedEmojis.join(' ');
    }

    // 일정 저장 및 캘린더에 표시
    function addEventToCalendars({ title, date, content, emojis }) {
        // 월간 이벤트 저장
        const [y, m, d] = date.split('-');
        const ym = `${y}-${m}`;
        if (!calendarEvents[ym]) calendarEvents[ym] = {};
        if (!calendarEvents[ym][date]) calendarEvents[ym][date] = [];
        calendarEvents[ym][date].push({ title, content, emojis });
        // 월간 렌더링
        renderMonthCalendar();
        // 주간 (현재 주간은 6/9~6/15로 고정)
        const weekCell = weekCalendar.querySelector(`td[data-date='${date}']`);
        if (weekCell) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'calendar-event';
            eventDiv.innerHTML = `<span class=\"emoji\">${emojis.join(
                ' ',
            )}</span> ${title}`;
            weekCell.appendChild(eventDiv);
        }
    }

    addScheduleBtn.addEventListener('click', function () {
        if (!scheduleForm.reportValidity()) return;
        const title = document.getElementById('scheduleTitle').value;
        const date = document.getElementById('scheduleDate').value;
        const content = document.getElementById('scheduleContent').value;
        const emojis = selectedEmojis.slice();
        // 일정 추가 시 월간 캘린더를 해당 년/월로 이동
        const [y, m] = date.split('-');
        monthYear.year = parseInt(y, 10);
        monthYear.month = parseInt(m, 10);
        addEventToCalendars({ title, date, content, emojis });
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
    const openEmployeeModalBtn = document.querySelector('#employee .add');
    const closeEmployeeModalBtn = document.getElementById('closeEmployeeModalBtn');
    const employeeModal = document.getElementById('employeeModal');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const employeeForm = document.getElementById('employeeForm');
    const employeeTableBody = document.querySelector('#employee table tbody');

    // 수정모드 관련 변수
    let editMode = false;
    let editingRow = null;
    // 수정완료 버튼 생성
    let editEmployeeBtn = document.createElement('button');
    editEmployeeBtn.type = 'button';
    editEmployeeBtn.id = 'editEmployeeBtn';
    editEmployeeBtn.className = 'full-width';
    editEmployeeBtn.textContent = '수정완료';
    editEmployeeBtn.style.display = 'none';
    // 모달 버튼 영역에 추가
    const modalBtns = employeeForm.querySelector('.modal-btns');
    modalBtns.appendChild(editEmployeeBtn);

    function openEmployeeModal() {
        employeeModal.style.display = 'block';
    }
    function closeEmployeeModal() {
        employeeModal.style.display = 'none';
        employeeForm.reset();
        editMode = false;
        editingRow = null;
        addEmployeeBtn.style.display = '';
        editEmployeeBtn.style.display = 'none';
    }
    openEmployeeModalBtn.addEventListener('click', function() {
        openEmployeeModal();
        addEmployeeBtn.style.display = '';
        editEmployeeBtn.style.display = 'none';
    });
    closeEmployeeModalBtn.addEventListener('click', closeEmployeeModal);
    window.addEventListener('click', function (e) {
        if (e.target === employeeModal) closeEmployeeModal();
    });

    // 직원 추가
    addEmployeeBtn.addEventListener('click', function () {
        if (!employeeForm.reportValidity()) return;
        const empId = document.getElementById('empId').value;
        const name = document.getElementById('empName').value;
        const dept = document.getElementById('empDept').value;
        const rank = document.getElementById('empRank').value;
        const phone = document.getElementById('empPhone').value;
        const joinDate = document.getElementById('empJoinDate').value;
        // 기기매칭, 관리(수정/삭제) 기본값
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${empId}</td>
            <td>${name}</td>
            <td>${dept}</td>
            <td>${rank}</td>
            <td>${phone}</td>
            <td>${joinDate}</td>
            <td>O</td>
            <td class="employee_btn_04">
                <button class="edit-btn">수정</button><button class="delete-btn">삭제</button>
            </td>
        `;
        employeeTableBody.appendChild(row);
        closeEmployeeModal();
    });

    // 수정/삭제 버튼 이벤트 위임
    employeeTableBody.addEventListener('click', function(e) {
        const target = e.target;
        const row = target.closest('tr');
        if (target.classList.contains('edit-btn')) {
            // 수정 모드 진입
            const tds = row.querySelectorAll('td');
            document.getElementById('empId').value = tds[0].textContent;
            document.getElementById('empName').value = tds[1].textContent;
            document.getElementById('empDept').value = tds[2].textContent;
            document.getElementById('empRank').value = tds[3].textContent;
            document.getElementById('empPhone').value = tds[4].textContent;
            document.getElementById('empJoinDate').value = tds[5].textContent;
            openEmployeeModal();
            addEmployeeBtn.style.display = 'none';
            editEmployeeBtn.style.display = '';
            editMode = true;
            editingRow = row;
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('정말 삭제하시겠습니까?')) {
                row.remove();
            }
        }
    });

    // 수정완료 버튼 동작
    editEmployeeBtn.addEventListener('click', function() {
        if (!employeeForm.reportValidity() || !editingRow) return;
        const empId = document.getElementById('empId').value;
        const name = document.getElementById('empName').value;
        const dept = document.getElementById('empDept').value;
        const rank = document.getElementById('empRank').value;
        const phone = document.getElementById('empPhone').value;
        const joinDate = document.getElementById('empJoinDate').value;
        const tds = editingRow.querySelectorAll('td');
        tds[0].textContent = empId;
        tds[1].textContent = name;
        tds[2].textContent = dept;
        tds[3].textContent = rank;
        tds[4].textContent = phone;
        tds[5].textContent = joinDate;
        // 수정모드 종료
        closeEmployeeModal();
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
