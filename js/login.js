// 로그인 폼 처리
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username && password) {
                const button = this.querySelector('.login-button');
                const originalText = button.textContent;
                button.textContent = '로그인 중...';
                button.disabled = true;
                
                setTimeout(() => {
                    alert('인사관리 시스템 로그인 성공!\n사용자: ' + username);
                    window.location.href = '../../index.html';
                    button.textContent = originalText;
                    button.disabled = false;
                }, 1000);
            } else {
                alert('사용자 ID와 비밀번호를 모두 입력해주세요.');
            }
        });

        // 체크박스 라벨 클릭 처리
        document.querySelector('.remember-me').addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
            }
        });

        window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const isLogged = urlParams.get('logged');
    const username = urlParams.get('user');
    
    if (isLogged === 'true' && username) {
        // 공통 로그인 상태 처리
        console.log('로그인됨:', username);
        
        // 로그인 버튼 변경 (모든 페이지 공통)
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = username + '님';
            loginBtn.href = '#';
        }
        
        // 로그인 전용 콘텐츠 표시 (있는 페이지만)
        const memberContent = document.querySelector('.member-only');
        if (memberContent) {
            memberContent.style.display = 'block';
        }
        
        // 로그아웃 버튼 표시 (있는 페이지만)
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.style.display = 'inline-block';
        }
    }
});