document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.querySelector('.hamburger_menu');
    const mobileMenu = document.querySelector('.mobile_menu');
    const mobileMenuItems = document.querySelectorAll('.mobile_menu_item');

    // 요소들이 존재하는지 확인
    if (!hamburgerBtn || !mobileMenu) {
        console.error('햄버거 메뉴 요소를 찾을 수 없습니다.');
        return;
    }

    console.log('모바일 메뉴 초기화 완료');

    // 햄버거 메뉴 토글
    hamburgerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('햄버거 버튼 클릭됨');
        
        hamburgerBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // 메뉴가 열릴 때 body 스크롤 방지
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            console.log('모바일 메뉴 열림');
        } else {
            document.body.style.overflow = '';
            console.log('모바일 메뉴 닫힘');
        }
    });

    // 서브메뉴 토글
    mobileMenuItems.forEach(item => {
        const title = item.querySelector('.mobile_menu_title');
        if (title) {
            title.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('서브메뉴 토글:', title.textContent);
                item.classList.toggle('active');
            });
        }
    });

    // 모바일 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (mobileMenu.classList.contains('active') && 
            !hamburgerBtn.contains(e.target) && 
            !mobileMenu.contains(e.target)) {
            
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            console.log('외부 클릭으로 메뉴 닫힘');
        }
    });

    // ESC 키로 메뉴 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            console.log('ESC 키로 메뉴 닫힘');
        }
    });

    // 윈도우 리사이즈 시 메뉴 닫기
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            console.log('화면 크기 변경으로 메뉴 닫힘');
        }
    });

    // 모바일 메뉴 내부 링크 클릭 시 메뉴 닫기
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 서브메뉴 토글 링크는 제외
            if (!this.classList.contains('mobile_menu_title')) {
                setTimeout(() => {
                    hamburgerBtn.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    console.log('링크 클릭으로 메뉴 닫힘');
                }, 100);
            }
        });
    });
}); 